import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Recibe el formulario de contacto y lo entrega por los canales configurados:
 *  - LEAD_WEBHOOK_URL: webhook (p. ej. n8n) heredado de v1.
 *  - RESEND_API_KEY:   correo a info@ionoshub.net vía Resend.
 * Ambos son variables de entorno; nunca se escriben en el código.
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

const TO = 'info@ionoshub.net';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

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
  const resendKey = env.RESEND_API_KEY as string | undefined;
  const results: Record<string, boolean> = {};

  if (webhookUrl) {
    try {
      const r = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      results.webhook = r.ok;
      if (!r.ok) console.error('Webhook de leads respondió', r.status);
    } catch (e) {
      results.webhook = false;
      console.error('Error llamando al webhook de leads:', e);
    }
  }

  if (resendKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      const html = `
        <h2 style="font-family:system-ui,sans-serif;color:#0e5fcb;margin:0 0 16px">Nueva solicitud de diagnóstico</h2>
        <table style="font-family:system-ui,sans-serif;font-size:15px;color:#0f1722;border-collapse:collapse">
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Negocio / persona</td><td style="padding:6px 0"><strong>${escapeHtml(nombre)}</strong></td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Interés</td><td style="padding:6px 0">${escapeHtml(interes)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Teléfono</td><td style="padding:6px 0">${escapeHtml(telefono)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Correo</td><td style="padding:6px 0">${escapeHtml(correo)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Nota</td><td style="padding:6px 0">${nota ? escapeHtml(nota) : '—'}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5b6b85">Origen</td><td style="padding:6px 0">${escapeHtml(payload.pagina_origen)}</td></tr>
        </table>`;
      const { error } = await resend.emails.send({
        from: (env.LEAD_FROM as string | undefined) ?? 'IonosHub Web <onboarding@resend.dev>',
        to: TO,
        replyTo: correo,
        subject: `Nueva solicitud de diagnóstico · ${interes}`,
        html,
      });
      results.email = !error;
      if (error) console.error('Resend error:', error);
    } catch (e) {
      results.email = false;
      console.error('Error enviando correo:', e);
    }
  }

  const attempted = Object.keys(results).length;
  const delivered = Object.values(results).some(Boolean);

  if (attempted === 0) {
    // Sin canales configurados. En desarrollo se acepta para probar la UI; en producción se avisa.
    if (env.DEV) {
      console.warn('[api/lead] Sin LEAD_WEBHOOK_URL ni RESEND_API_KEY: lead recibido pero no entregado', payload);
      return json({ ok: true, delivered: false });
    }
    return json({ error: 'Canal de entrega no configurado' }, 503);
  }

  if (!delivered) return json({ error: 'No se pudo entregar la solicitud' }, 502);
  return json({ ok: true, delivered: true, results });
};
