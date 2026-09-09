import type { APIRoute } from 'astro';
import { deliverLead } from '../../lib/lead';

export const prerender = false;

/**
 * Recibe el formulario de contacto, lo valida y lo entrega por el webhook de n8n.
 * La misma entrega la usa el agente IONIC en `/api/chat-lead` (ver `src/lib/lead.ts`).
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

  const result = await deliverLead({
    nombre_negocio_o_persona: nombre,
    servicio_interes: interes,
    telefono,
    correo,
    nota_detalle: nota,
    pagina_origen: String(body.pagina_origen ?? ''),
    fecha_envio: body.fecha_envio ?? new Date().toISOString(),
    canal: 'formulario',
  });

  // Sin webhook configurado: en desarrollo se acepta para poder probar la interfaz; en producción se avisa.
  if (result === 'sin-canal') {
    return import.meta.env.DEV ? json({ ok: true, delivered: false }) : json({ error: 'Canal de entrega no configurado' }, 503);
  }
  if (result === 'error') return json({ error: 'No se pudo entregar la solicitud' }, 502);
  return json({ ok: true, delivered: true });
};
