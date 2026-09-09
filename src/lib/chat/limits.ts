/**
 * Límites y saneado del chat. Todo se aplica en el servidor: el navegador no es fuente de verdad.
 */

export const LIMITS = {
  /** Mensajes que puede enviar la persona en una sesión. */
  maxUserMessages: 12,
  /** A partir de aquí el agente prioriza cerrar. */
  warnAt: 8,
  /** Caracteres por mensaje de la persona. */
  maxCharsPerMessage: 500,
  /** Turnos (persona + agente) que se reenvían al modelo. */
  maxHistoryTurns: 8,
  /** Tokens de salida por respuesta. */
  maxOutputTokens: 400,
  /** Tamaño máximo del cuerpo de la petición. */
  maxBodyBytes: 12_000,
  /** Caracteres máximos de la respuesta ya saneada. */
  maxReplyChars: 900,
  /** Vida de la sesión firmada. */
  sessionTtlMs: 45 * 60 * 1000,
  /** Espera máxima al modelo. */
  requestTimeoutMs: 15_000,
} as const;

/** Únicos destinos de enlace que puede contener una respuesta. */
const ALLOWED_HOSTS = ['ionoshub.net', 'www.ionoshub.net', 'wa.me', 'calendar.app.google', 'calendar.google.com'];

/** Nunca debemos pedir ni repetir esto en el chat. */
const SENSITIVE =
  /(contrase|password|tarjeta de cr|n[uú]mero de tarjeta|cvv|c[oó]digo de seguridad|cuenta bancaria|n[uú]mero de cuenta|c[eé]dula|pasaporte|clave de acceso)/i;

/** Quita caracteres de control (código menor que 32, salvo el salto de línea, y el 127). */
function stripControl(input: string): string {
  let out = '';
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 10 || (code > 31 && code !== 127)) out += char;
  }
  return out;
}

export interface CleanInput {
  ok: boolean;
  text: string;
  error?: string;
}

/** Valida y normaliza lo que escribe la persona. No intenta adivinar intenciones: eso lo blinda el prompt. */
export function cleanUserMessage(raw: unknown): CleanInput {
  if (typeof raw !== 'string') return { ok: false, text: '', error: 'Mensaje inválido.' };
  const text = stripControl(raw)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!text) return { ok: false, text: '', error: 'Escribe tu mensaje.' };
  if (text.length > LIMITS.maxCharsPerMessage) {
    return { ok: false, text: '', error: `Resume un poco: máximo ${LIMITS.maxCharsPerMessage} caracteres por mensaje.` };
  }
  return { ok: true, text };
}

/**
 * Sanea lo que devuelve el modelo antes de que llegue al navegador:
 * quita enlaces a dominios no permitidos, corta el markdown y limita el largo.
 */
export function sanitizeReply(raw: unknown): string {
  let text = typeof raw === 'string' ? stripControl(raw) : '';
  // Enlaces en markdown: se conserva la etiqueta y sólo la URL permitida.
  text = text.replace(/\[([^\]]{1,120})\]\(([^)]{1,300})\)/g, (_m, label, url) =>
    isAllowedUrl(url) ? `${label} (${url})` : label,
  );
  // URLs sueltas fuera de la lista blanca.
  text = text.replace(/\bhttps?:\/\/[^\s<>"')]+/gi, (url) => (isAllowedUrl(url) ? url : ''));
  // Restos de markdown y etiquetas.
  text = text
    .replace(/<[^>]*>/g, '')
    .replace(/[*_`#]{1,3}/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
  if (text.length > LIMITS.maxReplyChars) text = `${text.slice(0, LIMITS.maxReplyChars).trimEnd()}…`;
  return text;
}

export function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === 'https:' || u.protocol === 'http:') && ALLOWED_HOSTS.includes(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/** True si el texto pide datos sensibles: nunca debe salir del servidor. */
export function asksForSensitiveData(text: string): boolean {
  return SENSITIVE.test(text);
}

/**
 * Rescata correo y teléfono del texto de la persona sin depender del modelo.
 * Sólo rellena lo que aún está vacío; el modelo nunca pisa un dato ya capturado.
 */
export function extractContact(text: string): { correo?: string; telefono?: string } {
  const out: { correo?: string; telefono?: string } = {};
  const mail = text.match(/[^\s@<>()[\]]{1,64}@[^\s@<>()[\]]{1,64}\.[a-zA-Z]{2,12}/);
  if (mail) out.correo = mail[0].replace(/[.,;:]+$/, '');
  // Teléfonos de Ecuador: 09xxxxxxxx, 0xxxxxxxx fijo, o +593 con o sin espacios.
  const phone = text.replace(/[^\d+\s()-]/g, ' ').match(/(?:\+?593[\s-]?|0)(?:\d[\s()-]?){7,11}\d/);
  if (phone) {
    const digits = phone[0].replace(/[^\d+]/g, '');
    if (digits.replace(/\D/g, '').length >= 7) out.telefono = digits;
  }
  return out;
}

/** Validación del lead, idéntica a la del formulario (`/api/lead`). */
export function validateLead(lead: Record<string, string>): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!lead.nombre_negocio_o_persona || lead.nombre_negocio_o_persona.trim().length < 2) missing.push('nombre');
  if (!lead.servicio_interes || !lead.servicio_interes.trim()) missing.push('interés');
  if (!/^[+\d\s()-]{7,20}$/.test((lead.telefono ?? '').trim())) missing.push('teléfono');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((lead.correo ?? '').trim())) missing.push('correo');
  return { ok: missing.length === 0, missing };
}
