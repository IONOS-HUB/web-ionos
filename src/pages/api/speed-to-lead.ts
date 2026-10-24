import type { APIRoute } from 'astro';
import { deliverLead, UTM_KEYS, type Atribucion } from '../../lib/lead';
import { allowLead, clientIp } from '../../lib/chat/ratelimit';
import { landingById } from '../../data/landings';
import { sendMetaLead } from '../../lib/meta';

export const prerender = false;

/**
 * Formulario de las landings de pauta (`/speed-to-lead`). Va por `deliverLead`, así que llega a GHL
 * (y a n8n si sigue configurado) con `canal: 'speed-to-lead'`, la variante y la atribución de campaña.
 *
 * Freno propio (`stl`): quien deja sus datos en la landing y además escribe al chat no se bloquea.
 *
 * Con el lead entregado, el `Lead` sale a la API de Conversiones de Meta (`lib/meta.ts`) con su `event_id`.
 * Va siempre: la casilla de permiso del formulario, obligatoria, incluye confirmarle a Meta que se envió la
 * solicitud. Así Meta ve cada lead de la pauta aunque la persona no acepte las cookies; si además las aceptó,
 * el Pixel manda el mismo evento desde el navegador y Meta se queda con uno (mismo `event_id`).
 *
 * El correo es opcional; si viene, tiene que ser válido.
 */

interface Body {
  variante?: string;
  nombre?: string;
  correo?: string;
  codigo_pais?: string;
  telefono?: string;
  organizacion?: string;
  calificacion?: string;
  consentimiento?: boolean;
  pagina_origen?: string;
  utm?: Record<string, unknown>;
  meta?: { event_id?: string; fbp?: string; fbc?: string };
  website?: string; // honeypot
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const limpio = (valor: unknown, max: number) =>
  String(valor ?? '')
    .trim()
    .slice(0, max);

export const POST: APIRoute = async ({ request }) => {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Honeypot: responde OK sin hacer nada.
  if (body.website) return json({ ok: true });

  const landing = landingById(limpio(body.variante, 40));
  if (!landing) return json({ error: 'Formulario desconocido' }, 400);

  const nombre = limpio(body.nombre, 120);
  const correo = limpio(body.correo, 140);
  const codigo = limpio(body.codigo_pais, 6) || '+593';
  const telefonoNacional = limpio(body.telefono, 20);
  const organizacion = limpio(body.organizacion, 140);
  const calificacion = limpio(body.calificacion, 120);

  const faltan: string[] = [];
  if (nombre.length < 3) faltan.push('nombre');
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) faltan.push('correo');
  if (telefonoNacional.replace(/\D/g, '').length < 7) faltan.push('teléfono');
  if (!organizacion) faltan.push('organización');
  // La pregunta de calificación sólo acepta las opciones de su variante.
  if (!landing.form.qualify.options.includes(calificacion)) faltan.push('calificación');
  if (body.consentimiento !== true) faltan.push('consentimiento');
  if (faltan.length) return json({ error: 'Faltan datos obligatorios', faltan }, 400);

  // Sin el 0 inicial del número nacional: `+593 0991…` no es un número válido.
  const telefono = `${codigo} ${telefonoNacional.replace(/^0+/, '')}`.trim();

  const veredicto = await allowLead(clientIp(request), correo, telefono, 'stl');
  if (veredicto === 'demasiados') {
    return json({ error: 'Ya recibimos varias solicitudes desde tu conexión hoy. Escríbenos por WhatsApp.' }, 429);
  }
  if (veredicto === 'repetido') {
    // Ya la tenemos: se responde bien para no invitar a reintentar, pero no se duplica en el CRM.
    return json({ ok: true, delivered: true, duplicado: true });
  }

  const utm: Atribucion = {};
  for (const k of UTM_KEYS) {
    const v = limpio(body.utm?.[k], 200);
    if (v) utm[k] = v;
  }

  const result = await deliverLead({
    nombre_negocio_o_persona: organizacion,
    servicio_interes: landing.form.servicioInteres,
    telefono,
    correo,
    nota_detalle: `${nombre} · ${organizacion}. ${landing.form.qualify.label}: ${calificacion}.`,
    pagina_origen: limpio(body.pagina_origen, 300),
    fecha_envio: new Date().toISOString(),
    canal: 'speed-to-lead',
    variante: landing.id,
    calificacion,
    nombre_persona: nombre,
    empresa: organizacion,
    utm,
  });

  // Sin destino configurado: en desarrollo se acepta para poder probar la interfaz; en producción se avisa.
  if (result === 'sin-canal') {
    return import.meta.env.DEV ? json({ ok: true, delivered: false }) : json({ error: 'No pudimos enviar tu solicitud. Escríbenos por WhatsApp.' }, 503);
  }
  if (result === 'error') return json({ error: 'No pudimos enviar tu solicitud. Inténtalo de nuevo.' }, 502);

  const eventId = limpio(body.meta?.event_id, 64);
  if (/^[\w-]{8,64}$/.test(eventId)) {
    await sendMetaLead({
      eventId,
      sourceUrl: limpio(body.pagina_origen, 300) || new URL(landing.route, request.url).href,
      correo,
      telefono,
      nombre,
      ip: clientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
      fbp: limpio(body.meta?.fbp, 120) || undefined,
      fbc: limpio(body.meta?.fbc, 300) || undefined,
      fbclid: utm.fbclid,
      variante: landing.id,
      calificacion,
    });
  }
  return json({ ok: true, delivered: true });
};
