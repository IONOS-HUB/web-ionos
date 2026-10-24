import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import SelectorPais from './SelectorPais';
import { paisPorIso, PAIS_POR_DEFECTO } from '../../data/paises';
import { CALENDAR_URL } from '../../lib/site';
import type { LandingVariant } from '../../data/landings';

/**
 * Formulario de las landings de pauta, sobre `/api/speed-to-lead`. Corto a propósito: cada campo de
 * más cuesta leads. Guarda la atribución de campaña (utm_*, gclid, fbclid) de la URL de llegada en
 * `sessionStorage`, para que no se pierda si la persona navega antes de enviar.
 *
 * Conversión en Meta: el servidor manda `Lead` a la API de Conversiones con cada envío (la casilla de permiso,
 * obligatoria, incluye avisarle a Meta), aunque la persona no haya aceptado las cookies. Si además aceptó la
 * publicidad, el Pixel dispara el mismo `Lead` en el navegador con el mismo `eventID` y Meta lo cuenta una vez.
 * Ver docs/META-PIXEL.md. Las visitas y los envíos también se cuentan sin cookies con Vercel Web Analytics.
 *
 * El correo es opcional: cada campo obligatorio de más cuesta leads, y el contacto es por WhatsApp.
 *
 * Al enviar, la confirmación ocupa el mismo sitio sin mover la página: en escritorio conserva el alto
 * del formulario; en móvil, donde el formulario es largo, la ventanilla vuelve a la vista.
 */

interface Props {
  variante: LandingVariant['id'];
  form: LandingVariant['form'];
  waHref: string;
  /** El último paso de la variante ("Diagnóstico gratuito", "Lo ves con tu matrícula"…), para la confirmación */
  siguiente: string;
}

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
const UTM_STORE = 'ionos:utm';

function atribucion(): Record<string, string> {
  const desdeUrl: Record<string, string> = {};
  const qs = new URLSearchParams(window.location.search);
  UTM.forEach((k) => {
    const v = qs.get(k);
    if (v) desdeUrl[k] = v;
  });
  try {
    if (Object.keys(desdeUrl).length) {
      sessionStorage.setItem(UTM_STORE, JSON.stringify(desdeUrl));
      return desdeUrl;
    }
    return JSON.parse(sessionStorage.getItem(UTM_STORE) ?? '{}') as Record<string, string>;
  } catch {
    return desdeUrl;
  }
}

type Fbq = (...a: unknown[]) => void;
/** El Pixel, sólo si está cargado y la persona no retiró el permiso (`ionosAdsConsent` lo pone CookieConsent). */
const fbq = () => {
  const w = window as unknown as { fbq?: Fbq; ionosAdsConsent?: boolean };
  return w.ionosAdsConsent ? w.fbq : undefined;
};

/** Vercel Web Analytics (sin cookies): eventos propios para el embudo visita → empieza → envía. */
const va = (nombre: string, datos: Record<string, string>) =>
  (window as unknown as { va?: (...a: unknown[]) => void }).va?.('event', { name: nombre, data: datos });

const cookie = (nombre: string) =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${nombre}=`))
    ?.slice(nombre.length + 1);

const nuevoEventId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

const initial = {
  nombre: '',
  correo: '',
  pais: PAIS_POR_DEFECTO,
  telefono: '',
  organizacion: '',
  calificacion: '',
  website: '',
};

type Campo = keyof typeof initial;
type Estado = 'idle' | 'enviando' | 'listo' | 'error';

/** Lo obligatorio: nombre, WhatsApp, negocio, la pregunta y el permiso. El correo, si lo deja, no suma. */
const TOTAL_PASOS = 5;

export default function SpeedToLeadForm({ variante, form, waHref, siguiente }: Props) {
  const [data, setData] = useState(initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [altoListo, setAltoListo] = useState<number>();
  const [consentimiento, setConsentimiento] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo | 'consentimiento' | 'general', string>>>({});
  const [estado, setEstado] = useState<Estado>('idle');
  const empezado = useRef(false);

  const set = (campo: Campo, valor: string) => {
    setData((d) => ({ ...d, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: '' }));
  };

  // Una vez por visita: separa a quien ni empieza de quien empieza y no termina.
  const alEmpezar = () => {
    if (empezado.current) return;
    empezado.current = true;
    va('Formulario iniciado', { variante });
  };

  // Avance visible mientras se llena: cada dato válido suma. Sólo orienta; la validación real es `validar`.
  const pais = paisPorIso(data.pais);
  const digitosTel = data.telefono.replace(/\D/g, '').replace(/^0+/, '');
  const completos = [
    data.nombre.trim().length >= 3,
    digitosTel.length >= (pais?.min ?? 6) && digitosTel.length <= (pais?.max ?? 14),
    Boolean(data.organizacion.trim()),
    Boolean(data.calificacion),
    consentimiento,
  ].filter(Boolean).length;

  const validar = () => {
    const e: typeof errores = {};
    if (data.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre.';
    if (data.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) e.correo = 'Revisa el correo o déjalo en blanco.';
    const digitos = data.telefono.replace(/\D/g, '').replace(/^0+/, '');
    const pais = paisPorIso(data.pais);
    if (digitos.length < (pais?.min ?? 6) || digitos.length > (pais?.max ?? 14)) e.telefono = 'Revisa el número de WhatsApp.';
    if (!data.organizacion.trim()) e.organizacion = 'Cuéntanos el nombre.';
    if (!data.calificacion) e.calificacion = 'Elige una opción.';
    if (!consentimiento) e.consentimiento = 'Necesitamos tu permiso para contactarte.';
    setErrores(e);
    // Lleva el foco al primer campo con error, en el orden en que se ven.
    const orden: [keyof typeof e, string][] = [
      ['nombre', 'stl-nombre'],
      ['telefono', 'stl-telefono'],
      ['organizacion', 'stl-org'],
      ['calificacion', 'stl-calificacion'],
      ['correo', 'stl-correo'],
      ['consentimiento', 'stl-consentimiento'],
    ];
    const primero = orden.find(([k]) => e[k]);
    if (primero) document.getElementById(primero[1])?.focus();
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (data.website) return; // bot
    if (!validar()) return;
    setEstado('enviando');
    const eventId = nuevoEventId();
    try {
      const res = await fetch('/api/speed-to-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante,
          nombre: data.nombre.trim(),
          correo: data.correo.trim(),
          codigo_pais: paisPorIso(data.pais)?.prefijo ?? '',
          telefono: data.telefono.trim(),
          organizacion: data.organizacion.trim(),
          calificacion: data.calificacion,
          consentimiento,
          pagina_origen: window.location.href,
          utm: atribucion(),
          meta: { event_id: eventId, fbp: cookie('_fbp'), fbc: cookie('_fbc') },
        }),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string; duplicado?: boolean };
      if (!res.ok || !cuerpo.ok) {
        setErrores({
          general: cuerpo.error ?? 'No pudimos enviar tu solicitud. Inténtalo de nuevo.',
        });
        setEstado('error');
        return;
      }
      // En escritorio la confirmación conserva el alto del formulario: nada de lo que hay alrededor salta.
      if (window.matchMedia('(min-width: 1024px)').matches) setAltoListo(formRef.current?.offsetHeight);
      setEstado('listo');
      // La cabecera de la ventanilla (fuera de la isla) deja de pedir y confirma.
      document.querySelector<HTMLElement>('[data-form-title]')?.replaceChildren('Solicitud recibida');
      document.querySelector<HTMLElement>('[data-form-subtitle]')?.replaceChildren('Te escribimos por WhatsApp en menos de un día hábil');
      // En móvil el formulario es largo y el botón quedaba abajo: se vuelve al inicio de la ventanilla.
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        requestAnimationFrame(() => document.getElementById('formulario')?.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' }));
      }
      // Conversión principal de la landing para GA4; sólo si GA está cargado.
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'generate_lead', {
        method: 'speed_to_lead',
        variante,
        page_path: window.location.pathname,
      });
      // Un lead repetido no vuelve a contar en Meta: el servidor tampoco lo envía a CAPI.
      if (!cuerpo.duplicado) {
        fbq()?.('track', 'Lead', { content_name: `speed-to-lead · ${variante}`, content_category: data.calificacion }, { eventID: eventId });
        va('Lead', { variante });
      }
    } catch {
      setErrores({
        general: 'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.',
      });
      setEstado('error');
    }
  };

  if (estado === 'listo') {
    const nombrePila = data.nombre.trim().split(' ')[0];
    const pasos = [
      { titulo: 'Solicitud recibida', cuando: 'Ahora', hecho: true },
      { titulo: 'Te escribimos por WhatsApp', cuando: 'En menos de un día hábil', hecho: false },
      { titulo: siguiente, cuando: 'Después', hecho: false },
    ];
    return (
      <div className="pop flex flex-col justify-center gap-6" style={{ minHeight: altoListo }} role="status" aria-live="polite">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cobalt text-white">
          <span className="absolute inset-0 rounded-full bg-cobalt/40 motion-safe:animate-[ping_1.4s_cubic-bezier(0,0,0.2,1)_2]" aria-hidden="true" />
          <svg
            className="relative"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div>
          <h3 className="display-tight text-[1.7rem] font-semibold text-ink">Listo{nombrePila ? `, ${nombrePila}` : ''}. Ya tenemos tus datos.</h3>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-2">Si no quieres esperar, elige ahora el horario que te venga bien.</p>
        </div>

        <ol className="divide-y divide-line-soft rounded-[1rem] border border-line">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-semibold ${
                  p.hecho ? 'bg-cobalt text-white' : 'bg-ice text-cobalt-ink'
                }`}
              >
                {p.hecho ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[0.95rem] font-semibold text-ink">{p.titulo}</span>
                <span className="mt-0.5 block text-[0.8rem] text-ink-3">{p.cuando}</span>
              </span>
            </li>
          ))}
        </ol>

        {/* Apilados siempre: en una fila no caben en el ancho de la ventanilla y el segundo se salía. */}
        <div className="flex flex-col gap-3">
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
            onClick={() => {
              (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'open_calendar', {
                page_path: window.location.pathname,
                from: 'speed_to_lead',
              });
              // Abrir la agenda no es una cita agendada: evento propio, no el estándar `Schedule`.
              fbq()?.('trackCustom', 'AbrirAgenda', { content_name: `speed-to-lead · ${variante}` });
            }}
          >
            Elegir horario ahora
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const campo =
    'rounded-2xl border bg-canvas px-4 py-3.5 text-[1rem] text-ink placeholder:text-ink-3/70 transition-[border-color,box-shadow] duration-300 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/15';
  const bien = 'border-line hover:border-ice-2';
  const mal = 'border-red-500 ring-4 ring-red-500/10';

  return (
    <form ref={formRef} onSubmit={onSubmit} onFocusCapture={alEmpezar} noValidate className="flex flex-col gap-4">
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ice-2">
          <div
            className="h-full rounded-full bg-cobalt transition-[width] duration-500 ease-[var(--ease-out-expo)]"
            style={{ width: `${Math.max(4, (completos / TOTAL_PASOS) * 100)}%` }}
          />
        </div>
        <span className="tnum shrink-0 text-[0.8rem] font-semibold text-ink-3">
          {completos === TOTAL_PASOS ? 'Todo listo' : `${completos} de ${TOTAL_PASOS}`}
        </span>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="stl-website">Sitio web</label>
        <input id="stl-website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <Campo label={form.nameLabel} id="stl-nombre" error={errores.nombre}>
        <input
          id="stl-nombre"
          type="text"
          autoComplete="name"
          placeholder={form.namePlaceholder}
          className={`${campo} w-full ${errores.nombre ? mal : bien}`}
          value={data.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          aria-invalid={!!errores.nombre}
          aria-describedby={errores.nombre ? 'stl-nombre-err' : undefined}
          required
        />
      </Campo>

      <Campo label="WhatsApp" id="stl-telefono" error={errores.telefono}>
        <div className="flex gap-2">
          <SelectorPais
            valor={data.pais}
            onChange={(iso) => {
              setData((d) => ({ ...d, pais: iso }));
              if (errores.telefono) setErrores((x) => ({ ...x, telefono: '' }));
            }}
            invalido={!!errores.telefono}
          />
          <input
            id="stl-telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={paisPorIso(data.pais)?.ejemplo || '991234567'}
            className={`${campo} tnum min-w-0 flex-1 ${errores.telefono ? mal : bien}`}
            value={data.telefono}
            onChange={(e) => set('telefono', e.target.value)}
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? 'stl-telefono-err' : undefined}
            required
          />
        </div>
      </Campo>

      <Campo label={form.orgLabel} id="stl-org" error={errores.organizacion}>
        <input
          id="stl-org"
          type="text"
          autoComplete="organization"
          placeholder={form.orgPlaceholder}
          className={`${campo} w-full ${errores.organizacion ? mal : bien}`}
          value={data.organizacion}
          onChange={(e) => set('organizacion', e.target.value)}
          aria-invalid={!!errores.organizacion}
          aria-describedby={errores.organizacion ? 'stl-org-err' : undefined}
          required
        />
      </Campo>
      <Campo label={form.qualify.label} id="stl-calificacion" error={errores.calificacion}>
        <div className="relative">
          <select
            id="stl-calificacion"
            className={`${campo} w-full appearance-none pr-11 ${errores.calificacion ? mal : bien} ${data.calificacion ? '' : 'text-ink-3/80'}`}
            value={data.calificacion}
            onChange={(e) => set('calificacion', e.target.value)}
            aria-invalid={!!errores.calificacion}
            aria-describedby={errores.calificacion ? 'stl-calificacion-err' : undefined}
            required
          >
            <option value="" disabled>
              Elige una opción
            </option>
            {form.qualify.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </Campo>

      <Campo label="Correo" opcional id="stl-correo" error={errores.correo}>
        <input
          id="stl-correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          className={`${campo} w-full ${errores.correo ? mal : bien}`}
          value={data.correo}
          onChange={(e) => set('correo', e.target.value)}
          aria-invalid={!!errores.correo}
          aria-describedby={errores.correo ? 'stl-correo-err' : undefined}
        />
      </Campo>

      <label className="mt-1 flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink-2">
        <input
          type="checkbox"
          checked={consentimiento}
          onChange={(e) => {
            setConsentimiento(e.target.checked);
            if (e.target.checked) setErrores((x) => ({ ...x, consentimiento: '' }));
          }}
          className="mt-1 h-4.5 w-4.5 shrink-0 accent-cobalt"
          id="stl-consentimiento"
          aria-invalid={!!errores.consentimiento}
          aria-describedby={errores.consentimiento ? 'stl-consentimiento-err' : undefined}
        />
        <span>
          Acepto que IonosHub me contacte por WhatsApp, llamada o correo sobre esta solicitud y que, para medir sus anuncios, le confirme a Meta que la envié,
          con mis datos cifrados.{' '}
          <a href="/politica-de-privacidad" target="_blank" rel="noopener" className="font-semibold text-cobalt-ink underline">
            Cómo tratamos tus datos
          </a>
          .
        </span>
      </label>
      {errores.consentimiento && (
        <p id="stl-consentimiento-err" className="-mt-2 text-sm text-red-600">
          {errores.consentimiento}
        </p>
      )}

      {errores.general && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errores.general}
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-1 w-full" disabled={estado === 'enviando'} aria-busy={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : form.cta}
        {estado !== 'enviando' && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        )}
      </button>
      <p className="text-sm text-ink-3">Sin compromiso de compra. Nunca vendemos tus datos.</p>
    </form>
  );
}

function Campo({ label, id, error, opcional, children }: { label: string; id: string; error?: string; opcional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
        {label}
        {opcional && <span className="font-normal text-ink-3"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
