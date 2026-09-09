/**
 * Sesión de chat sin base de datos: un token firmado (HMAC-SHA256) que va y vuelve con cada mensaje.
 *
 * Guarda el contador de mensajes y una huella del historial. El navegador no puede reiniciar el contador
 * ni falsificar turnos del agente sin la clave, que sólo vive en el servidor (`CHAT_SECRET`).
 * No guardamos la conversación en ningún sitio: el historial viaja con el cliente y se verifica por huella.
 */
import { LIMITS } from './limits';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/** Datos del lead capturados hasta ahora. Viven en el token firmado, no en el navegador. */
export interface LeadDraft {
  nombre_negocio_o_persona: string;
  servicio_interes: string;
  telefono: string;
  correo: string;
  nota_detalle: string;
}

export const EMPTY_LEAD: LeadDraft = {
  nombre_negocio_o_persona: '',
  servicio_interes: '',
  telefono: '',
  correo: '',
  nota_detalle: '',
};

export interface SessionData {
  /** Identificador de sesión, sólo para trazas anónimas. */
  sid: string;
  /** Mensajes que ya envió la persona. */
  n: number;
  /** Huella del historial al cierre del turno anterior. */
  h: string;
  /** Emitido en (ms) y expira en (ms). */
  iat: number;
  exp: number;
  /** El lead ya se entregó: la sesión no puede enviar otro. */
  sent: boolean;
  /** Lo capturado hasta ahora; el servidor lo acumula, el modelo sólo propone. */
  lead: LeadDraft;
}

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(text: string): Uint8Array {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

/** Huella del historial. Cambiar un turno pasado invalida el token. */
export async function fingerprint(messages: ChatMessage[], secret: string): Promise<string> {
  const payload = messages.map((m) => `${m.role}:${m.text}`).join('');
  const sig = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(payload));
  return b64url(new Uint8Array(sig)).slice(0, 32);
}

export async function signSession(data: SessionData, secret: string): Promise<string> {
  const body = b64url(encoder.encode(JSON.stringify(data)));
  const sig = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(token: unknown, secret: string): Promise<SessionData | null> {
  if (typeof token !== 'string' || token.length > 4000) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  let valid = false;
  try {
    valid = await crypto.subtle.verify('HMAC', await key(secret), fromB64url(sig), encoder.encode(body));
  } catch {
    return null;
  }
  if (!valid) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionData;
    if (typeof data.n !== 'number' || typeof data.exp !== 'number') return null;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function newSession(): SessionData {
  const now = Date.now();
  return {
    sid: b64url(crypto.getRandomValues(new Uint8Array(9))),
    n: 0,
    h: '',
    iat: now,
    exp: now + LIMITS.sessionTtlMs,
    sent: false,
    lead: { ...EMPTY_LEAD },
  };
}
