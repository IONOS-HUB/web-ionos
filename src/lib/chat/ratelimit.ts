/**
 * Freno por IP.
 *
 * Con `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` configurados, la cuenta es compartida
 * entre todas las instancias de la función (Redis por HTTPS, sin conexiones TCP ni servidor propio).
 * Sin esas variables, cae en un contador en memoria que sólo cubre la instancia en curso.
 *
 * Si Redis falla o tarda, se deja pasar: preferimos atender a una persona real antes que bloquearla
 * por un problema de infraestructura. El corte de emergencia sigue siendo `CHAT_ENABLED=0`.
 */

const HOUR_SECONDS = 60 * 60;

/** Conversaciones nuevas y mensajes que admitimos de una misma IP por hora. */
export const IP_LIMITS = { sessions: 12, messages: 120 } as const;

const readEnv = (name: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name];

/* ── Contador en memoria (respaldo) ─────────────────────────────────────── */

interface Bucket {
  sessions: number;
  messages: number;
  resetAt: number;
}
const buckets = new Map<string, Bucket>();

function memoryCount(ip: string, isNewSession: boolean): boolean {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > 500) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    bucket = { sessions: 0, messages: 0, resetAt: now + HOUR_SECONDS * 1000 };
    buckets.set(ip, bucket);
  }
  if (isNewSession && bucket.sessions >= IP_LIMITS.sessions) return false;
  if (bucket.messages >= IP_LIMITS.messages) return false;
  bucket.messages += 1;
  if (isNewSession) bucket.sessions += 1;
  return true;
}

/* ── Contador compartido (Upstash Redis por REST) ───────────────────────── */

/**
 * Incrementa la clave y le pone caducidad de una hora en una sola llamada.
 * Devuelve el valor tras incrementar, o null si no hay Redis o falló.
 */
async function redisIncrement(key: string): Promise<number | null> {
  const url = readEnv('UPSTASH_REDIS_REST_URL');
  const token = readEnv('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      // Sin la variante NX de EXPIRE, que no todas las versiones aceptan. La clave ya lleva la hora
      // dentro, así que refrescar su caducidad en cada golpe no alarga la ventana de conteo.
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(HOUR_SECONDS)],
      ]),
    });
    if (!res.ok) {
      console.error('[ratelimit] Redis respondió', res.status);
      return null;
    }
    const data = (await res.json()) as { result?: number }[];
    const valor = data?.[0]?.result;
    return typeof valor === 'number' ? valor : null;
  } catch (e) {
    console.error('[ratelimit] Redis no disponible:', e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ── API ────────────────────────────────────────────────────────────────── */

/**
 * Comprobación de operación: dice si el contador compartido está configurado y responde.
 * La usa el diagnóstico protegido de `/api/chat`; no toca las claves reales de nadie.
 */
export async function redisStatus(): Promise<{ configurado: boolean; responde: boolean; valor: number | null }> {
  const configurado = Boolean(readEnv('UPSTASH_REDIS_REST_URL') && readEnv('UPSTASH_REDIS_REST_TOKEN'));
  if (!configurado) return { configurado: false, responde: false, valor: null };
  const valor = await redisIncrement('chat:diag');
  return { configurado: true, responde: valor !== null, valor };
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
export async function allowMessage(ip: string, isNewSession: boolean): Promise<boolean> {
  // La ventana va por hora natural: la clave caduca sola y no hay que limpiar nada.
  const ventana = Math.floor(Date.now() / (HOUR_SECONDS * 1000));
  const mensajes = await redisIncrement(`chat:m:${ip}:${ventana}`);
  if (mensajes === null) return memoryCount(ip, isNewSession);
  if (mensajes > IP_LIMITS.messages) return false;
  if (!isNewSession) return true;
  const sesiones = await redisIncrement(`chat:s:${ip}:${ventana}`);
  return sesiones === null ? true : sesiones <= IP_LIMITS.sessions;
}
