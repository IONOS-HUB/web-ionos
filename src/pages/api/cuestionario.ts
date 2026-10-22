import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/lead';
import { allowAttempt, clientIp } from '../../lib/chat/ratelimit';
import { cuestionarioAMarkdown, limpiarCuestionario } from '../../lib/cuestionario';

export const prerender = false;

/**
 * Cuestionario de página web para clientes (`/cuestionario-web`). No es un lead: no pasa por
 * `deliverLead` ni llega a GHL. Va a su propio webhook de n8n (`CUESTIONARIO_WEBHOOK_URL`), que pide a
 * Claude el PRD en Markdown y lo guarda en Google Drive. Guía: docs/CUESTIONARIO-WEB.md.
 *
 * Dos acciones, las dos con la clave (`CUESTIONARIO_CLAVE`), que frena los envíos masivos:
 * - `verificar`: la portada del cuestionario comprueba la clave antes de dejar empezar.
 * - `enviar`: valida, arma el Markdown y lo reenvía a n8n con el header `x-ionos-key`.
 *
 * Frenos por IP: 20 intentos de clave por hora (contra el adivinar) y 6 envíos al día.
 */

interface Body {
  accion?: 'verificar' | 'enviar';
  clave?: string;
  datos?: unknown;
  respuestas?: unknown;
  pagina_origen?: string;
  prueba?: boolean;
  website?: string; // honeypot
}

const MAX_BYTES = 300_000;

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
  if (!(await allowAttempt('cues:clave', ip, 20, 60 * 60))) {
    return json({ error: 'Demasiados intentos desde tu conexión. Espera una hora o escríbenos por WhatsApp.' }, 429);
  }

  // Sin clave configurada el cuestionario queda cerrado en producción; en desarrollo se deja pasar para probar.
  const esperada = readEnv('CUESTIONARIO_CLAVE');
  if (!esperada) {
    if (!import.meta.env.DEV) return json({ error: 'El cuestionario no está disponible en este momento. Escríbenos por WhatsApp.' }, 503);
    console.warn('[cuestionario] Sin CUESTIONARIO_CLAVE: en desarrollo se acepta cualquier clave.');
  } else if (!(await mismaClave(String(body.clave ?? '').trim(), esperada.trim()))) {
    return json({ error: 'La clave no es correcta. Revisa el mensaje en el que te la enviamos.' }, 401);
  }

  if (body.accion === 'verificar') return json({ ok: true });
  if (body.accion !== 'enviar') return json({ error: 'Acción desconocida' }, 400);

  if (!(await allowAttempt('cues:envio', ip, 6, 24 * 60 * 60))) {
    return json({ error: 'Ya recibimos varios cuestionarios desde tu conexión hoy. Escríbenos por WhatsApp.' }, 429);
  }

  const limpio = limpiarCuestionario(body.datos, body.respuestas);
  if (limpio.faltan.length) return json({ error: 'Faltan datos obligatorios', faltan: limpio.faltan }, 400);

  const enviado = new Date();
  const payload = {
    canal: 'cuestionario-web',
    version: 1,
    enviado_en: enviado.toISOString(),
    pagina_origen: String(body.pagina_origen ?? '').slice(0, 300),
    prueba: body.prueba === true,
    cliente: limpio.datos,
    respuestas: limpio.respuestas,
    markdown_respuestas: cuestionarioAMarkdown(limpio, enviado),
  };

  const url = readEnv('CUESTIONARIO_WEBHOOK_URL');
  if (!url) {
    console.warn('[cuestionario] Sin CUESTIONARIO_WEBHOOK_URL: cuestionario recibido pero no entregado', { negocio: limpio.datos.negocio });
    return import.meta.env.DEV
      ? json({ ok: true, delivered: false, markdown: payload.markdown_respuestas })
      : json({ error: 'No pudimos enviar tu cuestionario. Escríbenos por WhatsApp.' }, 503);
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
