import { useState, type FormEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  defaultInterest?: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const initial = {
  nombre_negocio_o_persona: '',
  servicio_interes: '',
  telefono: '',
  correo: '',
  nota_detalle: '',
  website: '', // honeypot
};

export default function ContactForm({ options, defaultInterest = '' }: Props) {
  const [data, setData] = useState({ ...initial, servicio_interes: defaultInterest });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof initial, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (data.nombre_negocio_o_persona.trim().length < 2) e.nombre_negocio_o_persona = 'Escribe el nombre de tu negocio o el tuyo.';
    if (!data.servicio_interes) e.servicio_interes = 'Elige una opción para orientar la conversación.';
    if (!/^[+\d\s()-]{7,20}$/.test(data.telefono.trim())) e.telefono = 'Escribe un teléfono válido, por ejemplo 099 123 4567.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) e.correo = 'Escribe un correo válido para enviarte la invitación.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (data.website) return; // bot
    if (!validate()) return;
    setStatus('sending');
    const interestLabel = options.find((o) => o.value === data.servicio_interes)?.label ?? data.servicio_interes;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_negocio_o_persona: data.nombre_negocio_o_persona.trim(),
          servicio_interes: interestLabel,
          telefono: data.telefono.trim(),
          correo: data.correo.trim(),
          nota_detalle: data.nota_detalle.trim() || null,
          pagina_origen: window.location.href,
          fecha_envio: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setData({ ...initial, servicio_interes: defaultInterest });
    } catch (err) {
      console.error('Error enviando el formulario:', err);
      setStatus('error');
    }
  };

  const field = 'w-full rounded-2xl border bg-canvas px-4 py-3.5 text-[1rem] text-ink placeholder:text-ink-3/70 transition-[border-color,box-shadow] duration-300 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/15';
  const ok = 'border-line hover:border-ice-2';
  const bad = 'border-red-500 ring-4 ring-red-500/10';

  if (status === 'success') {
    return (
      <div className="pop flex flex-col items-start gap-4 rounded-card border border-ice-2 bg-ice-3 p-7 sm:p-8" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cobalt text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div>
          <h3 className="text-xl font-semibold text-ink">Recibimos tu solicitud</h3>
          <p className="mt-2 text-ink-2">
            Te escribimos en menos de un día hábil para agendar tu diagnóstico gratuito. Si prefieres, adelántanos por WhatsApp.
          </p>
        </div>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost">
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4" aria-describedby="form-help">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div>
        <label htmlFor="nombre_negocio_o_persona" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
          Tu negocio o tu nombre
        </label>
        <input
          id="nombre_negocio_o_persona"
          name="nombre_negocio_o_persona"
          type="text"
          autoComplete="organization"
          placeholder="Ej. Ferretería El Tornillo"
          className={`${field} ${errors.nombre_negocio_o_persona ? bad : ok}`}
          value={data.nombre_negocio_o_persona}
          onChange={(e) => set('nombre_negocio_o_persona', e.target.value)}
          aria-invalid={!!errors.nombre_negocio_o_persona}
          aria-describedby={errors.nombre_negocio_o_persona ? 'err-nombre' : undefined}
          required
        />
        {errors.nombre_negocio_o_persona && <p id="err-nombre" className="mt-1.5 text-sm text-red-600">{errors.nombre_negocio_o_persona}</p>}
      </div>

      <div>
        <label htmlFor="servicio_interes" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
          ¿Qué te interesa resolver primero?
        </label>
        <div className="relative">
          <select
            id="servicio_interes"
            name="servicio_interes"
            className={`${field} appearance-none pr-11 ${errors.servicio_interes ? bad : ok} ${data.servicio_interes ? '' : 'text-ink-3/80'}`}
            value={data.servicio_interes}
            onChange={(e) => set('servicio_interes', e.target.value)}
            aria-invalid={!!errors.servicio_interes}
            aria-describedby={errors.servicio_interes ? 'err-interes' : undefined}
            required
          >
            <option value="" disabled>
              Elige un pilar
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {errors.servicio_interes && <p id="err-interes" className="mt-1.5 text-sm text-red-600">{errors.servicio_interes}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
            WhatsApp o teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="099 123 4567"
            className={`${field} tnum ${errors.telefono ? bad : ok}`}
            value={data.telefono}
            onChange={(e) => set('telefono', e.target.value)}
            aria-invalid={!!errors.telefono}
            aria-describedby={errors.telefono ? 'err-tel' : undefined}
            required
          />
          {errors.telefono && <p id="err-tel" className="mt-1.5 text-sm text-red-600">{errors.telefono}</p>}
        </div>
        <div>
          <label htmlFor="correo" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@empresa.com"
            className={`${field} ${errors.correo ? bad : ok}`}
            value={data.correo}
            onChange={(e) => set('correo', e.target.value)}
            aria-invalid={!!errors.correo}
            aria-describedby={errors.correo ? 'err-correo' : undefined}
            required
          />
          {errors.correo && <p id="err-correo" className="mt-1.5 text-sm text-red-600">{errors.correo}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="nota_detalle" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
          Cuéntanos tu reto <span className="font-normal text-ink-3">(opcional)</span>
        </label>
        <textarea
          id="nota_detalle"
          name="nota_detalle"
          rows={3}
          placeholder="Ej. Perdemos mensajes de WhatsApp fuera de horario y llevamos las ventas en Excel."
          className={`${field} ${ok} resize-y`}
          value={data.nota_detalle}
          onChange={(e) => set('nota_detalle', e.target.value)}
        />
      </div>

      {status === 'error' && (
        <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 8v4.5" />
            <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
          </svg>
          No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos directamente por WhatsApp.
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-1 w-full sm:w-auto" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Agendar mi diagnóstico gratis'}
        {status !== 'sending' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        )}
      </button>
      <p id="form-help" className="text-sm text-ink-3">
        Sin compromiso de compra. Usamos tus datos sólo para coordinar el diagnóstico.
      </p>
    </form>
  );
}
