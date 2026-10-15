import { useState, type FormEvent, type ReactNode } from 'react';
import SelectorPais from './SelectorPais';
import { paisPorIso, PAIS_POR_DEFECTO } from '../../data/paises';
import { CALENDAR_URL } from '../../lib/site';
import type { LandingVariant } from '../../data/landings';

/**
 * Formulario de las landings de pauta, sobre `/api/speed-to-lead`. Corto a propósito: cada campo de
 * más cuesta leads. Guarda la atribución de campaña (utm_*, gclid, fbclid) de la URL de llegada en
 * `sessionStorage`, para que no se pierda si la persona navega antes de enviar.
 */

interface Props {
  variante: LandingVariant['id'];
  form: LandingVariant['form'];
  waHref: string;
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

export default function SpeedToLeadForm({ variante, form, waHref }: Props) {
  const [data, setData] = useState(initial);
  const [consentimiento, setConsentimiento] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo | 'consentimiento' | 'general', string>>>({});
  const [estado, setEstado] = useState<Estado>('idle');

  const set = (campo: Campo, valor: string) => {
    setData((d) => ({ ...d, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: '' }));
  };

  const validar = () => {
    const e: typeof errores = {};
    if (data.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) e.correo = 'Escribe un correo válido.';
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
      ['correo', 'stl-correo'],
      ['organizacion', 'stl-org'],
      ['calificacion', 'stl-calificacion'],
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
        }),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !cuerpo.ok) {
        setErrores({
          general: cuerpo.error ?? 'No pudimos enviar tu solicitud. Inténtalo de nuevo.',
        });
        setEstado('error');
        return;
      }
      setEstado('listo');
      // La cabecera de la ventanilla (fuera de la isla) deja de pedir y confirma.
      document.querySelector<HTMLElement>('[data-form-title]')?.replaceChildren('Solicitud recibida');
      // Conversión principal de la landing para GA4; sólo si GA está cargado.
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'generate_lead', {
        method: 'speed_to_lead',
        variante,
        page_path: window.location.pathname,
      });
    } catch {
      setErrores({
        general: 'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.',
      });
      setEstado('error');
    }
  };

  if (estado === 'listo') {
    const nombrePila = data.nombre.trim().split(' ')[0];
    return (
      <div className="pop flex flex-col items-start gap-5" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cobalt text-white">
          <svg
            width="22"
            height="22"
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
          <h3 className="display-tight text-[1.6rem] font-semibold text-ink">Listo{nombrePila ? `, ${nombrePila}` : ''}. Ya tenemos tus datos.</h3>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-2">
            Te contactamos por WhatsApp en menos de un día hábil. Si no quieres esperar, elige ahora el horario que te venga bien.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() =>
              (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'open_calendar', {
                page_path: window.location.pathname,
                from: 'speed_to_lead',
              })
            }
          >
            Elegir horario ahora
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
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

      <Campo label="Correo" id="stl-correo" error={errores.correo}>
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
          required
        />
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
          Acepto que IonosHub me contacte por WhatsApp, llamada o correo sobre esta solicitud.{' '}
          <a href="/politica-de-privacidad" className="font-semibold text-cobalt-ink underline">
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
      <p className="text-sm text-ink-3">Sin compromiso de compra. Usamos tus datos sólo para esta solicitud.</p>
    </form>
  );
}

function Campo({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
        {label}
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
