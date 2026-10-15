/**
 * Entrega de leads. Un solo camino para todos los orígenes: el formulario (`/api/lead`), el agente
 * IONIC (`/api/chat-lead`), los webinars (`/api/webinar`) y las landings de pauta (`/api/speed-to-lead`).
 * Cada lead sale a dos destinos, los que estén configurados:
 *
 * - `LEAD_WEBHOOK_URL` (n8n): el JSON tal cual, como siempre.
 * - `GHL_WEBHOOK_URL` (GoHighLevel, trigger "Inbound Webhook" de un Workflow): el mismo lead aplanado
 *   con los nombres que GHL mapea a contacto (`first_name`, `email`, `phone`, `tags`…). Ver docs/SPEED-TO-LEAD.md.
 *
 * El lead cuenta como entregado si al menos un destino lo aceptó. El campo `canal` distingue de dónde vino.
 */

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Atribucion = Partial<Record<UtmKey, string>>;

export interface LeadPayload {
  nombre_negocio_o_persona: string;
  servicio_interes: string;
  telefono: string;
  correo: string;
  nota_detalle: string | null;
  pagina_origen: string;
  fecha_envio: string;
  canal: 'formulario' | 'chat-ionic' | 'webinar' | 'speed-to-lead';
  /** Sólo en registros de webinar: el resto de canales no los envía. */
  webinar_slug?: string;
  webinar_titulo?: string;
  webinar_fecha?: string;
  nombre_persona?: string;
  empresa?: string;
  area?: string;
  cargo?: string;
  /** Sólo en landings de pauta: qué variante (`general`, `instituciones`, `clinicas`) y su pregunta propia. */
  variante?: string;
  calificacion?: string;
  /** Parámetros de campaña con los que llegó la visita (utm_*, gclid, fbclid). */
  utm?: Atribucion;
}

export type LeadResult = 'ok' | 'sin-canal' | 'error';

/** Lee una variable de entorno tanto en desarrollo como en la función de Vercel. */
export const readEnv = (name: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name];

/**
 * Teléfono en E.164, que es lo que GHL usa para deduplicar contactos. Si ya trae prefijo (`+593 99…`)
 * se respeta; un número nacional ecuatoriano (`099 123 4567`) gana el +593; si no, se manda tal cual.
 */
export function toE164(telefono: string): string {
  const digitos = telefono.replace(/\D/g, '');
  if (telefono.trim().startsWith('+')) return `+${digitos}`;
  if (digitos.startsWith('593')) return `+${digitos}`;
  if (digitos.length === 10 && digitos.startsWith('0')) return `+593${digitos.slice(1)}`;
  if (digitos.length === 9 && digitos.startsWith('9')) return `+593${digitos}`;
  return digitos;
}

/** El lead con los nombres de campo que GHL reconoce al mapear el Inbound Webhook a un contacto. */
export function toGhl(p: LeadPayload): Record<string, unknown> {
  const persona = (p.nombre_persona || p.nombre_negocio_o_persona).trim();
  const [first_name, ...resto] = persona.split(/\s+/);
  const tags = ['web', p.canal, p.variante, p.webinar_slug && `webinar-${p.webinar_slug}`].filter(Boolean);
  return {
    first_name,
    last_name: resto.join(' '),
    full_name: persona,
    email: p.correo,
    phone: toE164(p.telefono),
    company_name: p.empresa || p.nombre_negocio_o_persona,
    source: `ionoshub.net · ${p.canal}${p.variante ? ` · ${p.variante}` : ''}`,
    tags,
    canal: p.canal,
    variante: p.variante ?? '',
    servicio_interes: p.servicio_interes,
    calificacion: p.calificacion ?? '',
    cargo: p.cargo ?? '',
    area: p.area ?? '',
    nota: p.nota_detalle ?? '',
    pagina_origen: p.pagina_origen,
    fecha_envio: p.fecha_envio,
    webinar_titulo: p.webinar_titulo ?? '',
    webinar_fecha: p.webinar_fecha ?? '',
    ...Object.fromEntries(UTM_KEYS.map((k) => [k, p.utm?.[k] ?? ''])),
  };
}

async function post(destino: string, url: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error(`[lead] ${destino} respondió`, res.status);
    return res.ok;
  } catch (e) {
    console.error(`[lead] Error llamando a ${destino}:`, e instanceof Error ? e.message : e);
    return false;
  }
}

export async function deliverLead(payload: LeadPayload): Promise<LeadResult> {
  const n8n = readEnv('LEAD_WEBHOOK_URL');
  const ghl = readEnv('GHL_WEBHOOK_URL');
  if (!n8n && !ghl) {
    console.warn('[lead] Sin LEAD_WEBHOOK_URL ni GHL_WEBHOOK_URL: lead recibido pero no entregado', {
      canal: payload.canal,
      servicio: payload.servicio_interes,
    });
    return 'sin-canal';
  }
  const envios = [n8n && post('n8n', n8n, payload), ghl && post('GHL', ghl, toGhl(payload))].filter(
    (e): e is Promise<boolean> => Boolean(e),
  );
  const resultados = await Promise.all(envios);
  return resultados.some(Boolean) ? 'ok' : 'error';
}
