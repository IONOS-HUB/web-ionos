/**
 * Freno por IP en memoria. Corta ráfagas y bots simples sin depender de ningún servicio externo.
 *
 * Aviso honesto: Vercel puede levantar varias instancias de la función, y cada una lleva su propia
 * cuenta, así que el tope real es "por instancia". Sirve para lo habitual, no contra un ataque
 * distribuido; para eso hace falta un contador compartido (Redis). El interruptor `CHAT_ENABLED=0`
 * sigue siendo la parada de emergencia.
 */

const HOUR = 60 * 60 * 1000;

/** Sesiones nuevas y mensajes totales que admitimos de una misma IP por hora. */
export const IP_LIMITS = { sessions: 6, messages: 60 } as const;

interface Bucket {
  sessions: number;
  messages: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function bucketFor(ip: string): Bucket {
  const now = Date.now();
  const found = buckets.get(ip);
  if (found && found.resetAt > now) return found;
  // Limpieza perezosa: al rotar una IP se tiran las caducadas para que el mapa no crezca.
  if (buckets.size > 500) {
    for (const [key, value] of buckets) if (value.resetAt <= now) buckets.delete(key);
  }
  const fresh: Bucket = { sessions: 0, messages: 0, resetAt: now + HOUR };
  buckets.set(ip, fresh);
  return fresh;
}

/** IP del visitante detrás del proxy de Vercel. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'desconocida';
}

/**
 * Apunta un mensaje. `isNewSession` cuenta además una conversación nueva.
 * Devuelve false cuando la IP se pasó de la raya.
 */
export function allowMessage(ip: string, isNewSession: boolean): boolean {
  const bucket = bucketFor(ip);
  if (isNewSession && bucket.sessions >= IP_LIMITS.sessions) return false;
  if (bucket.messages >= IP_LIMITS.messages) return false;
  bucket.messages += 1;
  if (isNewSession) bucket.sessions += 1;
  return true;
}
