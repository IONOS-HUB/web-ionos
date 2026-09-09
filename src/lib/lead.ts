/**
 * Entrega de leads. Un solo camino para los dos orígenes: el formulario (`/api/lead`) y el
 * agente IONIC (`/api/chat-lead`). Ambos mandan el mismo JSON al webhook de n8n, que lo registra
 * en el CRM y avisa al equipo. El campo `canal` distingue de dónde vino.
 */

export interface LeadPayload {
  nombre_negocio_o_persona: string;
  servicio_interes: string;
  telefono: string;
  correo: string;
  nota_detalle: string | null;
  pagina_origen: string;
  fecha_envio: string;
  canal: 'formulario' | 'chat-ionic';
}

export type LeadResult = 'ok' | 'sin-canal' | 'error';

/** Lee una variable de entorno tanto en desarrollo como en la función de Vercel. */
export const readEnv = (name: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name];

export async function deliverLead(payload: LeadPayload): Promise<LeadResult> {
  const webhookUrl = readEnv('LEAD_WEBHOOK_URL');
  if (!webhookUrl) {
    console.warn('[lead] Sin LEAD_WEBHOOK_URL: lead recibido pero no entregado', {
      canal: payload.canal,
      servicio: payload.servicio_interes,
    });
    return 'sin-canal';
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('[lead] El webhook respondió', res.status);
      return 'error';
    }
    return 'ok';
  } catch (e) {
    console.error('[lead] Error llamando al webhook:', e instanceof Error ? e.message : e);
    return 'error';
  }
}
