import { useState, type FormEvent, type ReactNode } from 'react';
import SelectorPais from './SelectorPais';
import { paisPorIso, PAIS_POR_DEFECTO } from '../../data/paises';

/**
 * Registro a un webinar. Misma captura que el repo de referencia (nombre, correo, teléfono con código
 * de país, empresa, área, cargo y consentimiento), sobre el endpoint `/api/webinar`.
 * Al terminar lleva a la comunidad de WhatsApp, que es donde se reparte el enlace de acceso.
 */

interface Props {
  slug: string;
  titulo: string;
  comunidad?: string;
}

const initial = {
  nombre: '',
  correo: '',
  pais: PAIS_POR_DEFECTO,
  telefono: '',
  empresa: '',
  area: '',
  cargo: '',
  website: '',
};

type Campo = keyof typeof initial;
type Estado = 'idle' | 'enviando' | 'listo' | 'error';

export default function WebinarForm({ slug, titulo, comunidad }: Props) {
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
    if (data.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) e.correo = 'Escribe un correo válido.';
    const digitos = data.telefono.replace(/\D/g, '');
    const pais = paisPorIso(data.pais);
    const min = pais?.min ?? 6;
    const max = pais?.max ?? 14;
    if (digitos.length < min || digitos.length > max) e.telefono = 'Revisa el número de teléfono.';
    if (!data.empresa.trim()) e.empresa = 'Cuéntanos dónde trabajas.';
    if (!data.area.trim()) e.area = 'Indica tu área.';
    if (!data.cargo.trim()) e.cargo = 'Indica tu cargo.';
    if (!consentimiento) e.consentimiento = 'Necesitamos tu permiso para registrarte.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (data.website) return; // bot
    if (!validar()) return;
    setEstado('enviando');
    try {
      const res = await fetch('/api/webinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webinar: slug,
          nombre: data.nombre.trim(),
          correo: data.correo.trim(),
          codigo_pais: paisPorIso(data.pais)?.prefijo ?? '',
          telefono: data.telefono.trim(),
          empresa: data.empresa.trim(),
          area: data.area.trim(),
          cargo: data.cargo.trim(),
          consentimiento,
          pagina_origen: window.location.href,
        }),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !cuerpo.ok) {
        setErrores({ general: cuerpo.error ?? 'No pudimos registrar tu lugar. Inténtalo de nuevo.' });
        setEstado('error');
        return;
      }
      setEstado('listo');
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'generate_lead', {
        method: 'webinar',
        webinar: slug,
        page_path: window.location.pathname,
      });
    } catch {
      setErrores({ general: 'No pudimos registrar tu lugar. Revisa tu conexión e inténtalo de nuevo.' });
      setEstado('error');
    }
  };

  if (estado === 'listo') {
    const nombrePila = data.nombre.trim().split(' ')[0];
    return (
      <div className="pop flex flex-col items-start gap-5" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cobalt text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div>
          <h3 className="display-tight text-[1.6rem] font-semibold text-ink">
            Tu lugar está reservado{nombrePila ? `, ${nombrePila}` : ''}
          </h3>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-2">
            Falta un paso: únete a la comunidad de WhatsApp del evento. Ahí enviamos el enlace de acceso y el
            material antes de empezar.
          </p>
        </div>
        {comunidad ? (
          <a
            href={comunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full sm:w-auto"
            onClick={() =>
              (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'join_webinar_community', {
                webinar: slug,
              })
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.15 6.44 2.15 11.9c0 1.76.46 3.42 1.26 4.86L2 22l5.36-1.4a9.87 9.87 0 0 0 4.68 1.19c5.46 0 9.9-4.44 9.9-9.9C21.94 6.44 17.5 2 12.04 2Zm0 18.05a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.18.84.85-3.1-.19-.32a8.14 8.14 0 0 1-1.25-4.35c0-4.49 3.66-8.15 8.17-8.15 4.5 0 8.16 3.66 8.16 8.15 0 4.49-3.66 8.25-8.11 8.25Z" />
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.58-.35Z" />
            </svg>
            Unirme a la comunidad
          </a>
        ) : (
          <p className="text-[0.95rem] text-ink-3">Te escribiremos al correo con el enlace de acceso.</p>
        )}
        <p className="text-[0.9rem] text-ink-3">{titulo} · Cupo confirmado</p>
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
        <label htmlFor="wf-website">Sitio web</label>
        <input id="wf-website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <Campo label="Nombre completo" id="wf-nombre" error={errores.nombre}>
        <input
          id="wf-nombre"
          type="text"
          autoComplete="name"
          placeholder="Ana Torres"
          className={`${campo} w-full ${errores.nombre ? mal : bien}`}
          value={data.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          aria-invalid={!!errores.nombre}
          required
        />
      </Campo>

      <Campo label="Correo electrónico" id="wf-correo" error={errores.correo}>
        <input
          id="wf-correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ana@empresa.com"
          className={`${campo} w-full ${errores.correo ? mal : bien}`}
          value={data.correo}
          onChange={(e) => set('correo', e.target.value)}
          aria-invalid={!!errores.correo}
          required
        />
      </Campo>

      <Campo label="Teléfono o WhatsApp" id="wf-telefono" error={errores.telefono}>
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
            id="wf-telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={paisPorIso(data.pais)?.ejemplo || '991234567'}
            className={`${campo} tnum min-w-0 flex-1 ${errores.telefono ? mal : bien}`}
            value={data.telefono}
            onChange={(e) => set('telefono', e.target.value)}
            aria-invalid={!!errores.telefono}
            required
          />
        </div>
      </Campo>

      <Campo label="Empresa o lugar de trabajo" id="wf-empresa" error={errores.empresa}>
        <input
          id="wf-empresa"
          type="text"
          autoComplete="organization"
          placeholder="Ferretería El Tornillo"
          className={`${campo} w-full ${errores.empresa ? mal : bien}`}
          value={data.empresa}
          onChange={(e) => set('empresa', e.target.value)}
          aria-invalid={!!errores.empresa}
          required
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Área" id="wf-area" error={errores.area}>
          <input
            id="wf-area"
            type="text"
            placeholder="Operaciones"
            className={`${campo} w-full ${errores.area ? mal : bien}`}
            value={data.area}
            onChange={(e) => set('area', e.target.value)}
            aria-invalid={!!errores.area}
            required
          />
        </Campo>
        <Campo label="Cargo" id="wf-cargo" error={errores.cargo}>
          <input
            id="wf-cargo"
            type="text"
            autoComplete="organization-title"
            placeholder="Administradora"
            className={`${campo} w-full ${errores.cargo ? mal : bien}`}
            value={data.cargo}
            onChange={(e) => set('cargo', e.target.value)}
            aria-invalid={!!errores.cargo}
            required
          />
        </Campo>
      </div>

      <label className="mt-1 flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink-2">
        <input
          type="checkbox"
          checked={consentimiento}
          onChange={(e) => {
            setConsentimiento(e.target.checked);
            if (e.target.checked) setErrores((x) => ({ ...x, consentimiento: '' }));
          }}
          className="mt-1 h-4.5 w-4.5 shrink-0 accent-cobalt"
          aria-invalid={!!errores.consentimiento}
        />
        <span>
          Acepto que IonosHub y Cyberprevention usen mis datos para gestionar este registro.{' '}
          <a href="/politica-de-privacidad" className="font-semibold text-cobalt-ink underline">
            Cómo tratamos tus datos
          </a>
          .
        </span>
      </label>
      {errores.consentimiento && <p className="text-sm text-red-600">{errores.consentimiento}</p>}

      {errores.general && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errores.general}
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-1 w-full" disabled={estado === 'enviando'} aria-busy={estado === 'enviando'}>
        {estado === 'enviando' ? 'Reservando…' : 'Reservar mi lugar'}
        {estado !== 'enviando' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        )}
      </button>
      <p className="text-sm text-ink-3">Gratuito y en línea. Te enviamos el enlace por la comunidad de WhatsApp.</p>
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
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
