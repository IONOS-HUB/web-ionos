import type { APIRoute } from 'astro';
import { systemInstruction, RESPONSE_SCHEMA } from '../../lib/chat/prompt';
import { normalizeInterest } from '../../lib/chat/knowledge';
import { FALLBACK_REPLY, LIMIT_REACHED_REPLY, SENSITIVE_REPLY, CLOSED_REPLY } from '../../lib/chat/copy';
import {
  LIMITS,
  cleanUserMessage,
  sanitizeReply,
  asksForSensitiveData,
  validateLead,
  extractContact,
} from '../../lib/chat/limits';
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
 * lead al webhook de n8n la decide el servidor tras validar (se conecta en el siguiente paso).
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

async function askGemini(
  system: string,
  contents: { role: string; parts: { text: string }[] }[],
  apiKey: string,
  model: string,
): Promise<ModelAnswer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIMITS.requestTimeoutMs);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: LIMITS.maxOutputTokens,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingBudget: 0 },
        },
        safetySettings: [
          'HARM_CATEGORY_HARASSMENT',
          'HARM_CATEGORY_HATE_SPEECH',
          'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'HARM_CATEGORY_DANGEROUS_CONTENT',
        ].map((category) => ({ category, threshold: 'BLOCK_MEDIUM_AND_ABOVE' })),
      }),
    });
    if (!res.ok) {
      console.error('[api/chat] Gemini respondió', res.status);
      return null;
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('[api/chat] Respuesta vacía del modelo:', data.candidates?.[0]?.finishReason ?? 'sin motivo');
      return null;
    }
    return JSON.parse(text) as ModelAnswer;
  } catch (e) {
    console.error('[api/chat] Error llamando al modelo:', e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

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
  if (!answer) return json({ reply: FALLBACK_REPLY, stage: 'duda', remaining, token: body.token ?? null });

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
  // Nombre, interés y nota puede corregirlos el modelo (se equivoca al inferirlos de una frase suelta).
  // Teléfono y correo no: los fija la extracción determinista y sólo se rellenan si están vacíos.
  const corregibles: (keyof LeadDraft)[] = ['nombre_negocio_o_persona', 'nota_detalle'];
  const lead = { ...draft };
  for (const campo of ['nombre_negocio_o_persona', 'telefono', 'correo', 'nota_detalle'] as (keyof LeadDraft)[]) {
    const propuesto = (answer.lead?.[campo] ?? '').trim().slice(0, limits[campo]);
    if (!propuesto) continue;
    if (!lead[campo] || corregibles.includes(campo)) lead[campo] = propuesto;
  }
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
