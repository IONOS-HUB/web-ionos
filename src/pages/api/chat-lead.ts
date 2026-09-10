import type { APIRoute } from 'astro';
import { deliverLead, readEnv } from '../../lib/lead';
import { validateLead } from '../../lib/chat/limits';
import { allowLead, clientIp } from '../../lib/chat/ratelimit';
import { signSession, verifySession } from '../../lib/chat/session';
import { CLOSED_REPLY } from '../../lib/chat/copy';

export const prerender = false;

/**
 * Entrega del lead capturado en el chat. Lo dispara la persona con el botón "Confirmar y enviar":
 * ni el modelo ni el navegador pueden provocarlo por su cuenta.
 *
 * Los datos NO llegan en la petición: se leen del token firmado de la sesión, que es donde el
 * servidor los fue acumulando. Así el cliente no puede cambiar lo que se envía al CRM. Una sesión
 * entrega un lead como mucho (`sent`).
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return import.meta.env.DEV;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === 'ionoshub.net' || host === 'www.ionoshub.net' || host === 'localhost' || host === '127.0.0.1';
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (readEnv('CHAT_ENABLED') === '0') return json({ error: 'chat_deshabilitado' }, 503);
  if (!originAllowed(request)) return json({ error: 'origen_no_permitido' }, 403);

  const secret = readEnv('CHAT_SECRET');
  if (!secret) return json({ error: 'sin_configurar' }, 503);

  let body: { token?: unknown; pagina_origen?: unknown };
  try {
    body = (await request.json()) as { token?: unknown; pagina_origen?: unknown };
  } catch {
    return json({ error: 'cuerpo_invalido' }, 400);
  }

  const session = await verifySession(body.token, secret);
  if (!session) return json({ error: 'sesion_invalida' }, 409);
  if (session.sent) return json({ reply: CLOSED_REPLY, closed: true, delivered: true });

  const lead = session.lead;
  const check = validateLead(lead ?? {});
  if (!lead || !check.ok) return json({ error: 'lead_incompleto', missing: check.missing }, 400);

  // Un lead exige conversación real: cuatro datos no se dan en dos mensajes ni en cinco segundos.
  // Filtra guiones automáticos que rellenan y envían de golpe.
  const segundos = (Date.now() - (session.iat ?? 0)) / 1000;
  if (session.n < 3 || segundos < 15) {
    console.warn('[api/chat-lead] Envío demasiado rápido', { mensajes: session.n, segundos: Math.round(segundos) });
    // Con `reply` la persona ve un mensaje normal y puede volver a pulsar; el botón sigue activo.
    return json(
      {
        error: 'demasiado_rapido',
        reply: 'Dame un segundo para terminar de registrar la conversación y vuelve a pulsar "Confirmar y enviar".',
      },
      429,
    );
  }

  // Freno que no se esquiva cambiando de navegador: cuenta la IP y el contacto, no la sesión.
  const veredicto = await allowLead(clientIp(request), lead.correo, lead.telefono);
  if (veredicto === 'demasiados') {
    return json(
      {
        reply:
          'Ya recibimos varias solicitudes desde tu conexión hoy. Si necesitas algo más, escríbenos por WhatsApp y te atendemos al momento.',
        closed: true,
      },
      429,
    );
  }
  if (veredicto === 'repetido') {
    // No se reenvía al CRM, pero la persona no se queda con cara de error: su solicitud ya está.
    return json({
      reply:
        'Ya tenemos tu solicitud registrada con estos datos. Un asesor se pondrá en contacto contigo; si es urgente, escríbenos por WhatsApp.',
      closed: true,
      delivered: true,
      token: await signSession({ ...session, sent: true }, secret),
    });
  }

  const result = await deliverLead({
    nombre_negocio_o_persona: lead.nombre_negocio_o_persona,
    servicio_interes: lead.servicio_interes,
    telefono: lead.telefono,
    correo: lead.correo,
    nota_detalle: lead.nota_detalle || null,
    pagina_origen: typeof body.pagina_origen === 'string' ? body.pagina_origen.slice(0, 300) : '',
    fecha_envio: new Date().toISOString(),
    canal: 'chat-ionic',
  });

  if (result === 'sin-canal') {
    if (import.meta.env.DEV) {
      return json({ reply: CLOSED_REPLY, closed: true, delivered: false, token: await signSession({ ...session, sent: true }, secret) });
    }
    return json({ error: 'canal_no_configurado' }, 503);
  }
  if (result === 'error') return json({ error: 'entrega_fallida' }, 502);

  // La sesión queda marcada: no puede enviar un segundo lead aunque se repita la petición.
  const token = await signSession({ ...session, sent: true }, secret);
  return json({ reply: CLOSED_REPLY, closed: true, delivered: true, token });
};
