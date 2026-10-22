import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/lead';
import { allowAttempt, clientIp } from '../../lib/chat/ratelimit';
import { buscarContacto, contextoCrmMarkdown, cuestionarioAMarkdown, idContactoValido, limpiarCuestionario, type ContactoCrm } from '../../lib/cuestionario';
import { servicioPorId } from '../../data/cuestionarios';

export const prerender = false;

/**
 * Cuestionarios para clientes (`/cuestionario`). No es un lead: no pasa por `deliverLead`. Va a su propio
 * webhook de n8n (`CUESTIONARIO_WEBHOOK_URL`), que pide a Claude el PRD del servicio en Markdown, lo guarda en
 * Google Drive y, si llegó por el enlace personal, cierra el ciclo en GoHighLevel. Guía: docs/CUESTIONARIOS.md.
 *
 * Se entra de dos maneras:
 * - Enlace personal `?c=<id de contacto de GHL>`: n8n busca al contacto y, si existe, no se pide la clave.
 * - Enlace genérico: la clave `CUESTIONARIO_CLAVE`, que frena los envíos masivos.
 *
 * Acciones:
 * - `contacto`: datos del contacto para prellenar «Tus datos» y el servicio en que lo clasificó el CRM.
 * - `verificar`: la portada comprueba la clave antes de dejar empezar.
 * - `enviar`: valida, arma el Markdown y lo reenvía a n8n con el header `x-ionos-key`. El contacto o la clave
 *   se vuelven a comprobar aquí: el navegador no decide nada.
 *
 * Frenos por IP: 20 intentos de clave y 30 búsquedas de contacto por hora, y 6 envíos al día.
 */

interface Body {
  accion?: 'contacto' | 'verificar' | 'enviar';
  clave?: string;
  contacto?: string;
  servicio?: string;
  datos?: unknown;
  respuestas?: unknown;
  pagina_origen?: string;
  prueba?: boolean;
  website?: string; // honeypot
}

const MAX_BYTES = 300_000;
const WHATSAPP = 'Escríbenos por WhatsApp.';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Compara sin filtrar por tiempo cuántos caracteres coinciden: se comparan los hash, siempre enteros. */
async function mismaClave(recibida: string, esperada: string): Promise<boolean> {
  const huella = async (v: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)));
  const [a, b] = await Promise.all([huella(recibida), huella(esperada)]);
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a[i] ^ b[i];
  return diferencia === 0;
}

export const POST: APIRoute = async ({ request }) => {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) {
    return json({ error: 'El cuestionario es demasiado largo. Acorta las respuestas más extensas.' }, 413);
  }
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Honeypot: responde OK sin hacer nada.
  if (body.website) return json({ ok: true });

  const ip = clientIp(request);

  // Enlace personal: el contacto de GHL reemplaza a la clave.
  let contacto: ContactoCrm | null = null;
  if (body.contacto !== undefined) {
    if (!(await allowAttempt('cues:contacto', ip, 30, 60 * 60))) {
      return json({ error: 'Demasiados intentos desde tu conexión. Espera una hora o escríbenos por WhatsApp.' }, 429);
    }
    const noVale = { error: 'No reconocemos tu enlace. Pídenos uno nuevo por WhatsApp o escribe la clave de acceso.' };
    if (!idContactoValido(body.contacto)) return json(noVale, 401);
    try {
      contacto = await buscarContacto(body.contacto);
    } catch (e) {
      console.error('[cuestionario] No se pudo leer el contacto:', e instanceof Error ? e.message : e);
      return json({ error: 'No pudimos abrir tu cuestionario. Inténtalo de nuevo en unos minutos.' }, 502);
    }
    if (!contacto) return json(noVale, 401);
    if (body.accion === 'contacto') return json({ ok: true, datos: contacto.datos, servicio: contacto.servicio ?? null });
  } else {
    if (body.accion === 'contacto') return json({ error: 'Falta el contacto' }, 400);
    if (!(await allowAttempt('cues:clave', ip, 20, 60 * 60))) {
      return json({ error: 'Demasiados intentos desde tu conexión. Espera una hora o escríbenos por WhatsApp.' }, 429);
    }
    // Sin clave configurada el cuestionario queda cerrado en producción; en desarrollo se deja pasar para probar.
    const esperada = readEnv('CUESTIONARIO_CLAVE');
    if (!esperada) {
      if (!import.meta.env.DEV) return json({ error: `El cuestionario no está disponible en este momento. ${WHATSAPP}` }, 503);
      console.warn('[cuestionario] Sin CUESTIONARIO_CLAVE: en desarrollo se acepta cualquier clave.');
    } else if (!(await mismaClave(String(body.clave ?? '').trim(), esperada.trim()))) {
      return json({ error: 'La clave no es correcta. Revisa el mensaje en el que te la enviamos.' }, 401);
    }
  }

  if (body.accion === 'verificar') return json({ ok: true });
  if (body.accion !== 'enviar') return json({ error: 'Acción desconocida' }, 400);

  const servicio = servicioPorId(body.servicio);
  if (!servicio) return json({ error: 'Elige el servicio en «Tus datos».', faltan: ['servicio'] }, 400);

  if (!(await allowAttempt('cues:envio', ip, 6, 24 * 60 * 60))) {
    return json({ error: `Ya recibimos varios cuestionarios desde tu conexión hoy. ${WHATSAPP}` }, 429);
  }

  const limpio = limpiarCuestionario(servicio, body.datos, body.respuestas);
  if (limpio.faltan.length) return json({ error: 'Faltan datos obligatorios', faltan: limpio.faltan }, 400);

  const enviado = new Date();
  const payload = {
    canal: 'cuestionario',
    version: 2,
    servicio: servicio.id,
    servicio_nombre: servicio.nombre,
    documento: servicio.documento,
    enviado_en: enviado.toISOString(),
    pagina_origen: String(body.pagina_origen ?? '').slice(0, 300),
    prueba: body.prueba === true,
    // Sólo con el enlace personal: n8n deja la nota, la etiqueta y mueve la oportunidad en GHL.
    ghl_contact_id: contacto ? body.contacto : null,
    contexto_crm: contacto ? contextoCrmMarkdown(contacto.contexto) : '',
    cliente: limpio.datos,
    respuestas: limpio.respuestas,
    markdown_respuestas: cuestionarioAMarkdown(servicio, limpio, enviado),
  };

  const url = readEnv('CUESTIONARIO_WEBHOOK_URL');
  if (!url) {
    console.warn('[cuestionario] Sin CUESTIONARIO_WEBHOOK_URL: cuestionario recibido pero no entregado', {
      negocio: limpio.datos.negocio,
      servicio: servicio.id,
    });
    return import.meta.env.DEV
      ? json({ ok: true, delivered: false, markdown: payload.markdown_respuestas, contexto_crm: payload.contexto_crm })
      : json({ error: `No pudimos enviar tu cuestionario. ${WHATSAPP}` }, 503);
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ionos-key': readEnv('CUESTIONARIO_WEBHOOK_KEY') ?? '' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error('[cuestionario] n8n respondió', res.status);
      return json({ error: 'No pudimos enviar tu cuestionario. Inténtalo de nuevo en unos minutos.' }, 502);
    }
  } catch (e) {
    console.error('[cuestionario] Error llamando a n8n:', e instanceof Error ? e.message : e);
    return json({ error: 'No pudimos enviar tu cuestionario. Inténtalo de nuevo en unos minutos.' }, 502);
  }
  return json({ ok: true, delivered: true });
};
