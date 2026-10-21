/**
 * API de Conversiones de Meta (CAPI): el evento `Lead` de las landings de pauta, enviado desde el
 * servidor. El Pixel del navegador manda el mismo evento con el mismo `event_id`, y Meta se queda con
 * uno de los dos (deduplicación). El del servidor llega aunque un bloqueador corte el Pixel.
 *
 * Sólo se envía si la persona aceptó la publicidad en el aviso de cookies (el Pixel estaba cargado) y
 * con los datos de contacto en SHA-256, como pide Meta. Sólo servidor: el token nunca llega al navegador.
 *
 * Variables: `PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN` y, para probar en el Administrador de eventos,
 * `META_TEST_EVENT_CODE`. Ver docs/META-PIXEL.md.
 */
import { createHash } from 'node:crypto';
import { readEnv, toE164 } from './lead';

/** Versión de la Graph API. Meta mantiene cada una unos dos años; súbela cuando avise de su retiro. */
const GRAPH_VERSION = 'v23.0';

export interface MetaLead {
  eventId: string;
  sourceUrl: string;
  correo: string;
  telefono: string;
  nombre: string;
  ip?: string;
  userAgent?: string;
  /** Cookies `_fbp` y `_fbc` del Pixel */
  fbp?: string;
  fbc?: string;
  /** Si no hay `_fbc`, se arma desde el fbclid de la URL de llegada */
  fbclid?: string;
  variante: string;
  calificacion: string;
}

const sha256 = (valor: string) => createHash('sha256').update(valor).digest('hex');

/** Formato de `_fbc` que Meta acepta: `fb.1.<milisegundos>.<fbclid>`. */
const fbcDesde = (fbclid: string) => `fb.1.${Date.now()}.${fbclid}`;

export async function sendMetaLead(lead: MetaLead): Promise<void> {
  const pixelId = readEnv('PUBLIC_META_PIXEL_ID');
  const token = readEnv('META_CAPI_TOKEN');
  if (!pixelId || !token) return;

  const [nombre, ...apellidos] = lead.nombre.trim().toLowerCase().split(/\s+/);
  const user_data: Record<string, unknown> = {
    em: [sha256(lead.correo.trim().toLowerCase())],
    // Sólo dígitos con el código de país, sin "+".
    ph: [sha256(toE164(lead.telefono).replace(/\D/g, ''))],
    fn: [sha256(nombre)],
  };
  if (apellidos.length) user_data.ln = [sha256(apellidos.join(' '))];
  if (lead.ip) user_data.client_ip_address = lead.ip;
  if (lead.userAgent) user_data.client_user_agent = lead.userAgent;
  if (lead.fbp) user_data.fbp = lead.fbp;
  const fbc = lead.fbc || (lead.fbclid && fbcDesde(lead.fbclid));
  if (fbc) user_data.fbc = fbc;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: 'website',
        event_source_url: lead.sourceUrl,
        user_data,
        custom_data: { content_name: `speed-to-lead · ${lead.variante}`, content_category: lead.calificacion },
      },
    ],
  };
  const testCode = readEnv('META_TEST_EVENT_CODE');
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // El lead ya está en el CRM: si Meta tarda, no se hace esperar a la persona.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.error('[meta] CAPI respondió', res.status, (await res.text()).slice(0, 300));
  } catch (e) {
    console.error('[meta] Error llamando a CAPI:', e instanceof Error ? e.message : e);
  }
}
