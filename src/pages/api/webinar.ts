import type { APIRoute } from 'astro';
import { deliverLead } from '../../lib/lead';
import { allowLead, clientIp } from '../../lib/chat/ratelimit';
import { getWebinarBySlug, isUpcoming, formatWebinarDate, formatWebinarTime } from '../../data/webinars';

export const prerender = false;

/**
 * Registro a un webinar. Va al mismo webhook de n8n que el formulario y el chat, con `canal: 'webinar'`
 * y los campos propios del evento, para que en el CRM se puedan separar por origen.
 *
 * El freno antiabuso usa un ámbito por edición (`webinar:<slug>`): registrarse a un webinar no gasta
 * el cupo de quien además pide un diagnóstico, y cada edición lleva su propia cuenta.
 */

interface Body {
  webinar?: string;
  nombre?: string;
  correo?: string;
  codigo_pais?: string;
  telefono?: string;
  empresa?: string;
  area?: string;
  cargo?: string;
  consentimiento?: boolean;
  pagina_origen?: string;
  website?: string; // honeypot
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const limpio = (valor: unknown, max: number) => String(valor ?? '').trim().slice(0, max);

export const POST: APIRoute = async ({ request }) => {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Honeypot: responde OK sin hacer nada.
  if (body.website) return json({ ok: true });

  const webinar = getWebinarBySlug(limpio(body.webinar, 80));
  if (!webinar) return json({ error: 'Ese webinar no existe.' }, 404);
  if (!webinar.registrationOpen || !isUpcoming(webinar)) {
    return json({ error: 'El registro de este webinar ya está cerrado.' }, 410);
  }

  const nombre = limpio(body.nombre, 120);
  const correo = limpio(body.correo, 140);
  const codigo = limpio(body.codigo_pais, 6) || '+593';
  const telefonoNacional = limpio(body.telefono, 20);
  const empresa = limpio(body.empresa, 140);
  const area = limpio(body.area, 80);
  const cargo = limpio(body.cargo, 80);

  const faltan: string[] = [];
  if (nombre.length < 3) faltan.push('nombre');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) faltan.push('correo');
  if (telefonoNacional.replace(/\D/g, '').length < 7) faltan.push('teléfono');
  if (!empresa) faltan.push('empresa');
  if (!area) faltan.push('área');
  if (!cargo) faltan.push('cargo');
  if (body.consentimiento !== true) faltan.push('consentimiento');
  if (faltan.length) return json({ error: 'Faltan datos obligatorios', faltan }, 400);

  const telefono = `${codigo} ${telefonoNacional}`.trim();

  const veredicto = await allowLead(clientIp(request), correo, telefono, `webinar:${webinar.slug}`);
  if (veredicto === 'demasiados') {
    return json({ error: 'Ya recibimos varios registros desde tu conexión hoy. Escríbenos por WhatsApp.' }, 429);
  }
  if (veredicto === 'repetido') {
    // Ya está inscrito: se responde bien y se le lleva igual a la comunidad, pero no se duplica.
    return json({ ok: true, delivered: true, duplicado: true, comunidad: webinar.whatsappCommunity ?? null });
  }

  const result = await deliverLead({
    nombre_negocio_o_persona: empresa,
    servicio_interes: `Webinar: ${webinar.title}`,
    telefono,
    correo,
    nota_detalle: `${nombre} · ${cargo} en ${area}. Registro al webinar "${webinar.title}" del ${formatWebinarDate(webinar.startsAt, { year: true })} a las ${formatWebinarTime(webinar.startsAt)}.`,
    pagina_origen: limpio(body.pagina_origen, 300),
    fecha_envio: new Date().toISOString(),
    canal: 'webinar',
    webinar_slug: webinar.slug,
    webinar_titulo: webinar.title,
    webinar_fecha: webinar.startsAt,
    nombre_persona: nombre,
    empresa,
    area,
    cargo,
  });

  if (result === 'sin-canal') {
    // En desarrollo se acepta para poder probar la interfaz; en producción se avisa.
    return import.meta.env.DEV
      ? json({ ok: true, delivered: false, comunidad: webinar.whatsappCommunity ?? null })
      : json({ error: 'No pudimos registrar tu lugar. Escríbenos por WhatsApp.' }, 503);
  }
  if (result === 'error') return json({ error: 'No pudimos registrar tu lugar. Inténtalo de nuevo.' }, 502);

  return json({ ok: true, delivered: true, comunidad: webinar.whatsappCommunity ?? null });
};
