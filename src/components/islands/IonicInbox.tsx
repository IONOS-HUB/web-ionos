import { useEffect, useMemo, useRef, useState } from 'react';
import type { InboxConversation } from '../../data/inbox';
import type { PillarId } from '../../data/pillars';

interface Props {
  conversations: InboxConversation[];
  pillars: { id: PillarId; short: string }[];
}

type Phase = { conv: number; shown: number; typing: boolean };

const CHANNEL_LABEL: Record<InboxConversation['channel'], string> = {
  WhatsApp: 'WhatsApp',
  Instagram: 'Instagram',
  Facebook: 'Facebook',
  Llamada: 'Llamada · IA de voz',
};

const WAVE = [6, 12, 18, 28, 16, 24, 32, 20, 12, 22, 30, 18, 10, 16, 24, 14, 8, 18, 26, 12, 6, 14, 20, 10];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // `?nomotion=1` congela la bandeja en su estado final (capturas de QA), igual que motion.ts.
    const frozen = new URLSearchParams(window.location.search).has('nomotion');
    setReduced(mq.matches || frozen);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches || frozen);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function PhoneIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 3.5h3l1.7 4.2-2.1 1.6a10 10 0 0 0 6.6 6.6l1.6-2.1 4.2 1.7v3a2 2 0 0 1-2.2 2C10.4 19.9 4.1 13.6 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export default function IonicInbox({ conversations, pillars }: Props) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>({ conv: 0, shown: 0, typing: false });
  const [tagged, setTagged] = useState<Set<PillarId>>(new Set());
  const [done, setDone] = useState<Set<string>>(new Set());
  const chatRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // `?conv=N` fija la conversación abierta (QA visual de cada estado junto con `?nomotion=1`).
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('conv'));
    if (Number.isInteger(n) && n >= 0 && n < conversations.length) setPhase({ conv: n, shown: 0, typing: false });
  }, [conversations.length]);

  const active = conversations[phase.conv];
  const isCall = active.channel === 'Llamada';
  const finished = reduced || phase.shown >= active.messages.length;

  // Guion: reproduce cada conversación mensaje a mensaje, luego pasa a la siguiente. Bucle infinito.
  useEffect(() => {
    if (reduced) return;
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    const later = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    const conv = conversations[phase.conv];
    const next = conv.messages[phase.shown];

    if (!next) {
      // Conversación completa: etiqueta el pilar, marca hecha, espera y pasa a la siguiente.
      setTagged((s) => new Set(s).add(conv.pillar));
      setDone((s) => new Set(s).add(conv.id));
      later(() => {
        const nextConv = (phase.conv + 1) % conversations.length;
        if (nextConv === 0) {
          setTagged(new Set());
          setDone(new Set());
        }
        setPhase({ conv: nextConv, shown: 0, typing: false });
      }, 2600);
      return clear;
    }

    if (next.from === 'ionic') {
      if (!phase.typing) {
        later(() => setPhase((p) => ({ ...p, typing: true })), 500);
      } else {
        later(() => setPhase((p) => ({ ...p, shown: p.shown + 1, typing: false })), 1100);
      }
    } else {
      later(() => setPhase((p) => ({ ...p, shown: p.shown + 1 })), phase.shown === 0 ? 900 : 1300);
    }
    return clear;
  }, [phase, reduced, conversations]);

  // Autoscroll del chat
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [phase.shown, phase.typing, reduced]);

  const visibleMessages = useMemo(
    () => (reduced ? active.messages : active.messages.slice(0, phase.shown)),
    [active, phase.shown, reduced],
  );
  const allTagged = reduced ? new Set(pillars.map((p) => p.id)) : tagged;

  return (
    <div className="relative">
      {/* Chips de pilares: se encienden cuando IONIC clasifica */}
      {/* Móvil: una fila desplazable; desktop: arranca dentro del campo cobalto (lg:pl-8) para no partir el primer chip en el borde. */}
      <ul className="mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:mb-4 sm:flex-wrap sm:overflow-visible lg:pl-8" aria-label="Pilares detectados por IONIC">
        {pillars.map((p) => {
          const on = allTagged.has(p.id) || active.pillar === p.id && phase.shown >= active.messages.length;
          return (
            <li key={p.id}>
              {/* Sobre el campo cobalto del hero, el chip encendido se invierte: blanco con texto cobalto. */}
              <span className={`chip shrink-0 ${on ? 'pop !border-white !bg-white !text-cobalt-ink shadow-lift' : ''}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-cobalt' : 'bg-cobalt-glow'}`} aria-hidden="true" />
                {p.short}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Ventana de bandeja */}
      <div
        className="overflow-hidden rounded-[1.5rem] border border-line bg-canvas shadow-phone"
        role="region"
        aria-label="Demostración de la bandeja de IONIC"
      >
        <div className="flex items-center justify-between gap-3 bg-cobalt px-4 py-3 text-white sm:px-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              IO
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cobalt bg-emerald-400" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.95rem] font-semibold">IONIC · Bandeja</p>
              <p className="hidden text-xs text-ice sm:block">Llamadas, WhatsApp, Instagram y Facebook</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/30 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ice">
            Demostración
          </span>
        </div>

        {/* min-w-0 en ambas columnas: sin él, el nombre largo del contacto (nowrap) ensancha la pista 1fr y la ventana recorta el chat. */}
        {/* En lg la bandeja mide ~435 px: la lista se reduce a avatares para que el chat conserve ancho; en xl vuelve completa. */}
        <div className="grid sm:grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-cols-[3.75rem_minmax(0,1fr)] xl:grid-cols-[13.5rem_minmax(0,1fr)]">
          {/* Lista de conversaciones */}
          <ul className="hidden min-w-0 gap-2 overflow-x-auto border-b border-line-soft bg-ice-3 p-2 sm:flex sm:flex-col sm:gap-0.5 sm:overflow-visible sm:border-b-0 sm:border-r sm:p-2 lg:p-1.5 xl:p-2" aria-label="Conversaciones">
            {conversations.map((c, i) => {
              const isActive = i === phase.conv;
              const isDone = done.has(c.id) || reduced;
              return (
                <li key={c.id} className="shrink-0 sm:shrink">
                  <div
                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-300 lg:justify-center lg:px-0 xl:justify-start xl:px-2.5 ${
                      isActive ? 'bg-canvas shadow-[0_1px_0_0_var(--color-line)]' : ''
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                    title={c.business}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? 'bg-cobalt text-white' : 'bg-ice-2 text-cobalt-ink'
                      }`}
                    >
                      {c.initials}
                    </span>
                    <div className="hidden min-w-0 flex-1 sm:block lg:hidden xl:block">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[0.85rem] font-semibold text-ink">{c.business}</p>
                        <span className="tnum shrink-0 text-[0.7rem] text-ink-3">{c.time}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {isDone ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cobalt" aria-hidden="true">
                            <path d="m2.5 12.5 4 4L14 9" />
                            <path d="m10 16.5 1.5 1.5L21.5 9" />
                          </svg>
                        ) : c.channel === 'Llamada' ? (
                          <span className={`shrink-0 ${isActive ? 'text-cobalt' : 'text-cobalt-glow'}`}>
                            <PhoneIcon size={13} />
                          </span>
                        ) : (
                          <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-cobalt' : 'bg-cobalt-glow'}`} aria-hidden="true" />
                        )}
                        <p className="truncate text-[0.78rem] text-ink-3">{isDone ? 'Resuelto por IONIC' : c.preview}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Chat abierto (o transcripción de la llamada) */}
          {/* Altura FIJA, no mínima: el guion recorre conversaciones de distinto largo (y la llamada añade la onda),
              así que con min-h la bandeja crecía y encogía ~150 px en bucle y empujaba toda la página bajo el hero.
              El desbordamiento lo absorbe la lista de mensajes, que ya hace autoscroll. */}
          <div className="flex h-[32rem] min-w-0 flex-col sm:h-[36rem]">
            {/* Nombre a ancho completo; canal y chip de pilar comparten la segunda línea para que el chip no trunque el nombre. */}
            <div className="border-b border-line-soft px-4 py-2.5">
              <p className="truncate text-[0.9rem] font-semibold text-ink">
                {active.person} <span className="font-normal text-ink-3">· {active.business}</span>
              </p>
              <div className="mt-0.5 flex items-center justify-between gap-3">
                <p className="flex min-w-0 items-center gap-1.5 text-xs text-ink-3">
                  {isCall && <span className="shrink-0"><PhoneIcon /></span>}
                  <span className="truncate">{CHANNEL_LABEL[active.channel]}</span>
                  {isCall &&
                    (finished ? (
                      <span className="tnum shrink-0 text-ink-3">· Finalizada · {active.duration}</span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 font-medium text-cobalt">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                        En llamada
                      </span>
                    ))}
                </p>
                <span className={`chip !h-6 shrink-0 !text-[0.72rem] ${finished ? 'chip-on pop' : ''}`}>
                  {pillars.find((p) => p.id === active.pillar)?.short}
                </span>
              </div>
            </div>

            {/* Onda de la llamada: viva mientras la IA de voz atiende, quieta al colgar */}
            {isCall && (
              <div
                className={`flex h-10 items-end gap-[3px] border-b border-line-soft bg-ice-3 px-4 pb-2 ${finished ? 'wave-still' : 'wave-live'}`}
                aria-hidden="true"
              >
                {WAVE.map((h, i) => (
                  <span
                    key={i}
                    className={`wave-bar w-1 rounded-full ${i % 3 === 0 ? 'bg-cobalt' : 'bg-cobalt-glow/60'}`}
                    style={{ height: `${h * 0.8}px` }}
                  />
                ))}
                <span className="ml-auto self-center text-[0.7rem] font-medium text-ink-3">
                  {finished ? 'Transcripción' : 'Transcripción en vivo'}
                </span>
              </div>
            )}

            <div ref={chatRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4" aria-live="polite">
              {visibleMessages.map((m, i) => (
                // mt-auto en el primero: con pocos mensajes la conversación se apoya abajo como en un chat real;
                // al desbordar, el margen automático se resuelve en 0 y el scroll funciona normal.
                <div
                  key={`${active.id}-${i}`}
                  className={`msg-in flex flex-col ${i === 0 ? 'mt-auto' : ''} ${m.from === 'ionic' ? 'items-end' : 'items-start'}`}
                >
                  {active.speakers && (
                    <span className="mb-0.5 px-1 text-[0.68rem] font-semibold uppercase tracking-wide text-ink-3">
                      {active.speakers[m.from]}
                    </span>
                  )}
                  <p
                    className={`max-w-[85%] px-3.5 py-2.5 text-[0.92rem] leading-snug ${m.from === 'ionic' ? 'bubble-out' : 'bubble-in'}`}
                  >
                    {m.text}
                  </p>
                  {m.card && (
                    <div className="pop mt-1.5 flex max-w-[85%] items-center gap-3 rounded-2xl border border-ice-2 bg-ice-3 px-3.5 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cobalt text-white" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <div className="leading-tight">
                        <p className="text-[0.85rem] font-semibold text-cobalt-ink">{m.card.title}</p>
                        <p className="text-[0.78rem] text-ink-3">{m.card.detail}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {phase.typing && !reduced && (
                <div className="msg-in flex items-end justify-end">
                  {isCall ? (
                    <span className="bubble-out wave-live inline-flex h-9 items-center gap-[3px] px-3.5" aria-label="La IA de voz está hablando">
                      {[10, 16, 22, 14, 18, 10].map((h, i) => (
                        <span key={i} className="wave-bar wave-bar-mid w-[3px] rounded-full bg-white" style={{ height: `${h}px` }} />
                      ))}
                    </span>
                  ) : (
                    <span className="bubble-out inline-flex items-center gap-1 px-3.5 py-3" aria-label="IONIC está escribiendo">
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>
              )}
            </div>

            {isCall ? (
              <div className="hidden items-center gap-2.5 border-t border-line-soft px-4 py-2.5 text-[0.82rem] text-ink-3 sm:flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cobalt" aria-hidden="true">
                  <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5l-5-5Z" />
                  <path d="M14 3.5v5h5" />
                  <path d="M9 13h6" />
                  <path d="M9 16.5h6" />
                </svg>
                <span className="truncate">Transcripción y cita guardadas en la ficha del paciente</span>
              </div>
            ) : (
              <div className="hidden items-center gap-2 border-t border-line-soft px-4 py-2.5 sm:flex">
                <span className="flex h-9 min-w-0 flex-1 items-center truncate rounded-full bg-ice-3 px-3.5 text-[0.85rem] text-ink-3">
                  IONIC responde con la información de tu negocio…
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt text-white" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.5 3.5 3.5 10.7l7.4 2.4 2.4 7.4 7.2-17Z" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
