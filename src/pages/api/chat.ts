import type { APIRoute } from 'astro';
import { systemInstruction, RESPONSE_SCHEMA } from '../../lib/chat/prompt';
import { normalizeInterest } from '../../lib/chat/knowledge';
import { FALLBACK_REPLY, LIMIT_REACHED_REPLY, RATE_LIMITED_REPLY, SENSITIVE_REPLY, CLOSED_REPLY } from '../../lib/chat/copy';
import {
  LIMITS,
  cleanUserMessage,
  sanitizeReply,
  asksForSensitiveData,
  validateLead,
  extractContact,
} from '../../lib/chat/limits';
import { allowMessage, clientIp, redisStatus, IP_LIMITS } from '../../lib/chat/ratelimit';
import {
  fingerprint,
  newSession,
  signSession,
  verifySession,
  EMPTY_LEAD,
  type ChatMessage,
  type LeadDraft,
} from '../../lib/chat/session';

export const prerender = false;

/**
 * Conversación del agente IONIC del sitio.
 *
 * Todo lo delicado ocurre aquí, nunca en el navegador: la clave de Gemini, el prompt del sistema y la
 * base de conocimiento. El modelo sólo devuelve texto y datos; jamás ejecuta acciones. La entrega del
 * lead al webhook de n8n la decide el servidor tras validar, y la dispara la persona desde `/api/chat-lead`.
 *
 * Contrato con el cliente:
 *   POST { message: string, token?: string, history?: {role,text}[] }
 *   200  { reply, token, remaining, stage, leadReady, closed }
 */

const readEnv = (name: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Sólo aceptamos peticiones desde nuestro propio sitio (o sin origen, como curl en pruebas locales). */
function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return import.meta.env.DEV;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === 'ionoshub.net' || host === 'www.ionoshub.net' || host === 'localhost' || host === '127.0.0.1';
  } catch {
    return false;
  }
}

interface ModelAnswer {
  respuesta?: string;
  intencion?: string;
  lead?: Record<string, string>;
  listo_para_enviar?: boolean;
}

/**
 * Último fallo del proveedor, para diagnosticar sin abrir los registros de Vercel.
 * Sólo se devuelve a quien mande la cabecera `x-chat-debug` con el CHAT_SECRET.
 */
let lastUpstreamError: string | null = null;

/**
 * Algunos modelos (Gemini 3.x) rechazan `thinkingConfig` con 400. Al primer rechazo se apunta aquí
 * y el resto de la vida de la instancia se pide directamente sin esa opción: una llamada por mensaje.
 */
let thinkingSupported = true;

/**
 * Cuerpo de la petición. `thinking` desactiva el razonamiento interno para abaratar y acelerar,
 * pero no todos los modelos lo admiten: si lo rechazan con 400, se reintenta sin esa opción.
 */
function requestBody(
  system: string,
  contents: { role: string; parts: { text: string }[] }[],
  thinking: boolean,
) {
  return JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: LIMITS.maxOutputTokens,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      ...(thinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
    safetySettings: [
      'HARM_CATEGORY_HARASSMENT',
      'HARM_CATEGORY_HATE_SPEECH',
      'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'HARM_CATEGORY_DANGEROUS_CONTENT',
    ].map((category) => ({ category, threshold: 'BLOCK_MEDIUM_AND_ABOVE' })),
  });
}

async function askGemini(
  system: string,
  contents: { role: string; parts: { text: string }[] }[],
  apiKey: string,
  model: string,
): Promise<ModelAnswer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIMITS.requestTimeoutMs);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey };
  try {
    let res = await fetch(url, { method: 'POST', headers, signal: controller.signal, body: requestBody(system, contents, thinkingSupported) });
    if (res.status === 400 && thinkingSupported) {
      console.warn('[api/chat] 400 con thinkingConfig; este modelo no lo admite, se deja de enviar:', (await res.text()).slice(0, 160));
      thinkingSupported = false;
      res = await fetch(url, { method: 'POST', headers, signal: controller.signal, body: requestBody(system, contents, false) });
    }
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 200);
      lastUpstreamError = `${model} HTTP ${res.status}: ${detail}`;
      console.error('[api/chat] Gemini respondió', res.status, detail);
      return null;
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const motivo = data.candidates?.[0]?.finishReason ?? 'sin motivo';
      lastUpstreamError = `respuesta vacía (${motivo})`;
      console.error('[api/chat] Respuesta vacía del modelo:', motivo);
      return null;
    }
    return JSON.parse(text) as ModelAnswer;
  } catch (e) {
    lastUpstreamError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error('[api/chat] Error llamando al modelo:', lastUpstreamError);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Diagnóstico de operación: `GET /api/chat?diag=models` con la cabecera `x-chat-debug` igual al
 * CHAT_SECRET devuelve los modelos que admite la clave configurada. Sin esa cabecera, 404.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const secret = readEnv('CHAT_SECRET');
  if (!secret || request.headers.get('x-chat-debug') !== secret) return new Response('Not found', { status: 404 });
  const apiKey = readEnv('GEMINI_API_KEY');
  if (!apiKey) return json({ error: 'sin_clave' }, 503);
  const modelo = readEnv('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite';

  if (url.searchParams.get('diag') === 'redis') return json({ limites: IP_LIMITS, redis: await redisStatus() });
  if (url.searchParams.get('diag') !== 'models') return json({ modelo });
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    headers: { 'x-goog-api-key': apiKey },
  });
  if (!res.ok) return json({ error: `HTTP ${res.status}`, detail: (await res.text()).slice(0, 300) }, 502);
  const data = (await res.json()) as { models?: { name?: string; supportedGenerationMethods?: string[] }[] };
  const modelos = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name?.replace('models/', ''))
    .filter((n): n is string => Boolean(n) && /flash|lite|pro/.test(n!));
  return json({ configurado: readEnv('GEMINI_MODEL') ?? '(por defecto)', disponibles: modelos });
};

export const POST: APIRoute = async ({ request }) => {
  if (readEnv('CHAT_ENABLED') === '0') return json({ error: 'chat_deshabilitado' }, 503);
  if (!originAllowed(request)) return json({ error: 'origen_no_permitido' }, 403);

  const apiKey = readEnv('GEMINI_API_KEY');
  const secret = readEnv('CHAT_SECRET');
  const model = readEnv('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite';
  if (!apiKey || !secret) {
    console.error('[api/chat] Falta GEMINI_API_KEY o CHAT_SECRET');
    return json({ reply: FALLBACK_REPLY, closed: true }, 503);
  }

  const raw = await request.text();
  if (raw.length > LIMITS.maxBodyBytes) return json({ error: 'cuerpo_demasiado_grande' }, 413);

  let body: { message?: unknown; token?: unknown; history?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'cuerpo_invalido' }, 400);
  }

  const input = cleanUserMessage(body.message);
  if (!input.ok) return json({ error: 'mensaje_invalido', detail: input.error }, 400);

  if (!(await allowMessage(clientIp(request), !body.token))) {
    return json({ reply: RATE_LIMITED_REPLY, closed: true, stage: 'cierre', remaining: 0 }, 429);
  }

  // Sesión: la primera petición no trae token; las siguientes deben traer uno válido y sin caducar.
  // La sesión nueva arranca con la huella del historial vacío, que es lo que debe enviar el cliente.
  const session = body.token
    ? await verifySession(body.token, secret)
    : { ...newSession(), h: await fingerprint([], secret) };
  if (!session) return json({ error: 'sesion_invalida' }, 409);
  if (session.sent) return json({ reply: CLOSED_REPLY, closed: true, stage: 'cierre' });

  // El historial lo custodia el cliente, pero su huella está firmada: no se puede alterar ni inventar turnos.
  const history: ChatMessage[] = Array.isArray(body.history)
    ? (body.history as ChatMessage[])
        .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
        .map((m) => ({ role: m.role, text: m.text.slice(0, LIMITS.maxReplyChars) }))
    : [];
  const expected = await fingerprint(history, secret);
  if (expected !== session.h) return json({ error: 'historial_alterado' }, 409);

  if (session.n >= LIMITS.maxUserMessages) {
    return json({ reply: LIMIT_REACHED_REPLY, closed: true, stage: 'cierre', remaining: 0 });
  }

  const remaining = LIMITS.maxUserMessages - session.n - 1;
  const recent = history.slice(-LIMITS.maxHistoryTurns * 2);
  const contents = [
    ...recent.map((m) => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: input.text }] },
  ];

  // Correo y teléfono se rescatan del texto con reglas fijas: no dependen de que el modelo acierte.
  const draft: LeadDraft = { ...EMPTY_LEAD, ...(session.lead ?? {}) };
  const found = extractContact(input.text);
  if (!draft.correo && found.correo) draft.correo = found.correo;
  if (!draft.telefono && found.telefono) draft.telefono = found.telefono;

  if (readEnv('CHAT_DEBUG') === '1') {
    console.log('[api/chat] turnos=', contents.length, JSON.stringify(contents.map((c) => `${c.role}: ${c.parts[0].text.slice(0, 40)}`), null, 1));
  }

  const answer = await askGemini(systemInstruction(remaining, draft), contents, apiKey, model);
  if (!answer) {
    // Aunque el modelo falle se devuelve sesión firmada: el siguiente intento continúa la misma
    // conversación en vez de abrir una nueva (que contaría contra el límite por IP).
    const fallbackHistory: ChatMessage[] = [
      ...history,
      { role: 'user', text: input.text },
      { role: 'model', text: FALLBACK_REPLY },
    ];
    const tokenFallback = await signSession(
      { ...session, n: session.n + 1, h: await fingerprint(fallbackHistory, secret), lead: draft },
      secret,
    );
    // El diagnóstico sólo viaja a quien conoce el secreto del servidor.
    const debug = request.headers.get('x-chat-debug') === secret ? { upstream: lastUpstreamError } : {};
    return json({ reply: FALLBACK_REPLY, stage: 'duda', remaining, token: tokenFallback, ...debug });
  }

  let reply = sanitizeReply(answer.respuesta);
  if (!reply) reply = FALLBACK_REPLY;
  // El agente nunca debe pedir datos sensibles, ni aunque el modelo se despiste.
  if (asksForSensitiveData(reply)) reply = SENSITIVE_REPLY;

  // El servidor acumula: lo ya capturado manda, el modelo sólo puede rellenar huecos.
  const limits: Record<keyof LeadDraft, number> = {
    nombre_negocio_o_persona: 120,
    servicio_interes: 80,
    telefono: 20,
    correo: 120,
    nota_detalle: 400,
  };
  // Lo que propone el modelo pasa filtro antes de guardarse: llegó a copiar la palabra "PENDIENTE"
  // de su propia ficha de estado como si fuera un teléfono.
  const lead = { ...draft };
  const propuesto = (campo: keyof LeadDraft) => (answer.lead?.[campo] ?? '').trim().slice(0, limits[campo]);
  const esMarcador = (v: string) => !v || /^(pendiente|falta\w*|desconocid[oa]|sin datos?|n\/?a|null|none|-{1,3}|\?+)$/i.test(v);

  // El nombre sí puede corregirlo: suele inferirlo mal de la primera frase.
  const nombre = propuesto('nombre_negocio_o_persona');
  if (!esMarcador(nombre)) lead.nombre_negocio_o_persona = nombre;

  // Teléfono y correo sólo se aceptan si tienen forma de teléfono y de correo.
  const telefono = propuesto('telefono');
  if (!lead.telefono && /^[+\d\s()-]{7,20}$/.test(telefono)) lead.telefono = telefono;
  const correo = propuesto('correo');
  if (!lead.correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) lead.correo = correo;

  // La nota se queda con lo primero que contó la persona, que es lo que aporta contexto.
  const nota = propuesto('nota_detalle');
  if (!lead.nota_detalle && !esMarcador(nota)) lead.nota_detalle = nota;
  // El interés sólo se acepta si encaja con una opción del formulario; si no, se sigue preguntando.
  const interesPropuesto = normalizeInterest(answer.lead?.servicio_interes ?? '');
  if (interesPropuesto) lead.servicio_interes = interesPropuesto;
  else if (!lead.servicio_interes) lead.servicio_interes = normalizeInterest(input.text);
  // La señal del modelo es sólo una pista: quien decide es la validación del servidor, y el envío
  // lo confirma la persona con un botón. Así ningún dato personal sale por iniciativa del modelo.
  const leadReady = validateLead(lead).ok;

  const nextHistory: ChatMessage[] = [...history, { role: 'user', text: input.text }, { role: 'model', text: reply }];
  const nextSession = {
    ...session,
    n: session.n + 1,
    h: await fingerprint(nextHistory, secret),
    lead,
  };
  const token = await signSession(nextSession, secret);

  return json({
    reply,
    token,
    remaining,
    stage: typeof answer.intencion === 'string' ? answer.intencion : 'duda',
    leadReady,
    // Los datos vuelven al cliente sólo para que los confirme en pantalla; el envío lo hará el servidor.
    lead: leadReady ? lead : undefined,
    closed: remaining <= 0,
  });
};
