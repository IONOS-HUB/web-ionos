import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Recibe el formulario de contacto, lo valida y lo reenvía por POST al webhook de n8n
 * (LEAD_WEBHOOK_URL), que lo registra en el CRM y avisa al equipo.
 * La URL es una variable de entorno; nunca se escribe en el código.
 */

interface LeadBody {
  nombre_negocio_o_persona?: string;
  servicio_interes?: string;
  telefono?: string;
  correo?: string;
  nota_detalle?: string | null;
  pagina_origen?: string;
  fecha_envio?: string;
  website?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Honeypot: responde OK sin hacer nada.
  if (body.website) return json({ ok: true });

  const nombre = String(body.nombre_negocio_o_persona ?? '').trim();
  const interes = String(body.servicio_interes ?? '').trim();
  const telefono = String(body.telefono ?? '').trim();
  const correo = String(body.correo ?? '').trim();
  const nota = body.nota_detalle ? String(body.nota_detalle).trim() : null;

  if (nombre.length < 2 || !interes || telefono.length < 7 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return json({ error: 'Campos obligatorios faltantes o inválidos' }, 400);
  }

  const payload = {
    nombre_negocio_o_persona: nombre,
    servicio_interes: interes,
    telefono,
    correo,
    nota_detalle: nota,
    pagina_origen: String(body.pagina_origen ?? ''),
    fecha_envio: body.fecha_envio ?? new Date().toISOString(),
  };

  const env = import.meta.env;
  const webhookUrl = env.LEAD_WEBHOOK_URL as string | undefined;

  if (!webhookUrl) {
    // Sin webhook configurado. En desarrollo se acepta para probar la UI; en producción se avisa.
    if (env.DEV) {
      console.warn('[api/lead] Sin LEAD_WEBHOOK_URL: lead recibido pero no entregado', payload);
      return json({ ok: true, delivered: false });
    }
    return json({ error: 'Canal de entrega no configurado' }, 503);
  }

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error('Webhook de leads respondió', r.status);
      return json({ error: 'No se pudo entregar la solicitud' }, 502);
    }
  } catch (e) {
    console.error('Error llamando al webhook de leads:', e);
    return json({ error: 'No se pudo entregar la solicitud' }, 502);
  }

  return json({ ok: true, delivered: true });
};
