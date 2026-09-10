/**
 * Frenos de abuso del chat y del formulario.
 *
 * Con `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` la cuenta es compartida entre todas las
 * instancias de la función (Redis por HTTPS). Sin esas variables cae a un contador en memoria que
 * sólo cubre la instancia en curso.
 *
 * Hay dos capas, porque protegen cosas distintas:
 *  - Conversación: cuántas charlas y mensajes admite una IP por hora. Protege el gasto del modelo.
 *  - Lead: cuántas solicitudes admite una IP al día y cuántas veces puede repetirse un mismo
 *    contacto. Protege el CRM, y es la que no se esquiva abriendo otra ventana de incógnito.
 *
 * Si Redis falla o tarda, se deja pasar: preferimos atender a una persona real antes que bloquearla
 * por un problema de infraestructura. El corte de emergencia sigue siendo `CHAT_ENABLED=0`.
 */

const HOUR_SECONDS = 60 * 60;
const DAY_SECONDS = 24 * HOUR_SECONDS;

/** Conversaciones nuevas y mensajes que admitimos de una misma IP por hora. */
export const IP_LIMITS = { sessions: 8, messages: 90 } as const;

/** Solicitudes de contacto por IP y día, y repeticiones del mismo contacto en 24 horas. */
export const LEAD_LIMITS = { perIpPerDay: 3, sameContactPerDay: 1 } as const;

const readEnv = (name: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name];

/* ── Contadores en memoria (respaldo sin Redis) ─────────────────────────── */

interface Bucket {
  sessions: number;
  messages: number;
  leads: number;
  resetAt: number;
}
const buckets = new Map<string, Bucket>();

function bucketFor(ip: string, ttlMs: number): Bucket {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > 500) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    bucket = { sessions: 0, messages: 0, leads: 0, resetAt: now + ttlMs };
    buckets.set(ip, bucket);
  }
  return bucket;
}

/* ── Redis por REST ─────────────────────────────────────────────────────── */

/** Ejecuta varias órdenes en una sola llamada. Devuelve null si no hay Redis o falló. */
async function redisPipeline(comandos: (string | number)[][]): Promise<unknown[] | null> {
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
      body: JSON.stringify(comandos.map((c) => c.map(String))),
    });
    if (!res.ok) {
      console.error('[ratelimit] Redis respondió', res.status);
      return null;
    }
    const data = (await res.json()) as { result?: unknown; error?: string }[];
    return data.map((r) => (r?.error ? null : r?.result));
  } catch (e) {
    console.error('[ratelimit] Redis no disponible:', e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Incrementa una clave y le pone caducidad. Devuelve el valor tras incrementar, o null si no hubo Redis.
 * La clave lleva la ventana dentro, así que refrescar la caducidad no alarga el conteo.
 */
async function contar(key: string, ttl: number): Promise<number | null> {
  const salida = await redisPipeline([
    ['INCR', key],
    ['EXPIRE', key, ttl],
  ]);
  const valor = salida?.[0];
  return typeof valor === 'number' ? valor : null;
}

/**
 * Marca una clave la primera vez. Devuelve true si ya estaba marcada (es decir, es repetición),
 * false si es nueva, y null si no hubo Redis.
 */
async function yaVisto(key: string, ttl: number): Promise<boolean | null> {
  const salida = await redisPipeline([['SET', key, '1', 'EX', ttl, 'NX']]);
  if (!salida) return null;
  // Upstash devuelve "OK" cuando la creó y null cuando ya existía.
  return salida[0] === null;
}

/** Huella corta del contacto: en Redis no guardamos correos ni teléfonos en claro. */
async function huella(valor: string): Promise<string> {
  const datos = new TextEncoder().encode(`ionoshub:${valor}`);
  const hash = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(hash).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── API ────────────────────────────────────────────────────────────────── */

/** IP del visitante detrás del proxy de Vercel. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'desconocida';
}

/**
 * Apunta un mensaje del chat. `isNewSession` cuenta además una conversación nueva.
 * Devuelve false cuando la IP se pasó de la raya.
 */
export async function allowMessage(ip: string, isNewSession: boolean): Promise<boolean> {
  const ventana = Math.floor(Date.now() / (HOUR_SECONDS * 1000));
  const mensajes = await contar(`chat:m:${ip}:${ventana}`, HOUR_SECONDS);
  if (mensajes === null) {
    const bucket = bucketFor(ip, HOUR_SECONDS * 1000);
    if (isNewSession && bucket.sessions >= IP_LIMITS.sessions) return false;
    if (bucket.messages >= IP_LIMITS.messages) return false;
    bucket.messages += 1;
    if (isNewSession) bucket.sessions += 1;
    return true;
  }
  if (mensajes > IP_LIMITS.messages) return false;
  if (!isNewSession) return true;
  const sesiones = await contar(`chat:s:${ip}:${ventana}`, HOUR_SECONDS);
  return sesiones === null ? true : sesiones <= IP_LIMITS.sessions;
}

export type LeadCheck = 'ok' | 'demasiados' | 'repetido';

/**
 * Decide si se entrega una solicitud de contacto. Se aplica igual venga del chat o del formulario,
 * así que abrir otra ventana, otro navegador o el modo incógnito no la esquiva: cuenta la IP y el
 * contacto, no la sesión del navegador.
 */
export async function allowLead(ip: string, correo: string, telefono: string): Promise<LeadCheck> {
  const dia = Math.floor(Date.now() / (DAY_SECONDS * 1000));

  const porIp = await contar(`lead:ip:${ip}:${dia}`, DAY_SECONDS);
  if (porIp === null) {
    // Sin Redis: al menos se frena dentro de la instancia.
    const bucket = bucketFor(`lead:${ip}`, DAY_SECONDS * 1000);
    if (bucket.leads >= LEAD_LIMITS.perIpPerDay) return 'demasiados';
    bucket.leads += 1;
    return 'ok';
  }
  if (porIp > LEAD_LIMITS.perIpPerDay) return 'demasiados';

  // Mismo correo o mismo teléfono en 24 horas: es la misma persona insistiendo o un bot repitiendo.
  const correoNorm = correo.trim().toLowerCase();
  const telefonoNorm = telefono.replace(/\D/g, '').slice(-9);
  const claves = [
    correoNorm ? `lead:c:${await huella(correoNorm)}:${dia}` : null,
    telefonoNorm.length >= 7 ? `lead:t:${await huella(telefonoNorm)}:${dia}` : null,
  ].filter((k): k is string => Boolean(k));

  for (const clave of claves) {
    const repetido = await yaVisto(clave, DAY_SECONDS);
    if (repetido === true) return 'repetido';
  }
  return 'ok';
}

/**
 * Comprobación de operación: estado del contador compartido y qué IP está viendo el servidor.
 * La usa el diagnóstico protegido de `/api/chat`.
 */
export async function limitsStatus(ip: string): Promise<Record<string, unknown>> {
  const configurado = Boolean(readEnv('UPSTASH_REDIS_REST_URL') && readEnv('UPSTASH_REDIS_REST_TOKEN'));
  const ventana = Math.floor(Date.now() / (HOUR_SECONDS * 1000));
  const dia = Math.floor(Date.now() / (DAY_SECONDS * 1000));
  if (!configurado) return { redis: { configurado: false, responde: false }, ip };
  const salida = await redisPipeline([
    ['GET', `chat:s:${ip}:${ventana}`],
    ['GET', `chat:m:${ip}:${ventana}`],
    ['GET', `lead:ip:${ip}:${dia}`],
  ]);
  return {
    redis: { configurado: true, responde: salida !== null },
    ip,
    limites: { ...IP_LIMITS, ...LEAD_LIMITS },
    consumido: salida
      ? { conversaciones: salida[0] ?? 0, mensajes: salida[1] ?? 0, leadsHoy: salida[2] ?? 0 }
      : null,
  };
}
