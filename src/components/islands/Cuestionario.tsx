import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import SelectorPais from './SelectorPais';
import { paisPorIso, PAIS_POR_DEFECTO } from '../../data/paises';
import {
  DATOS,
  GENERAL,
  SERVICIOS,
  comoLlenarlo,
  respondida,
  servicioPorId,
  type DatosCliente,
  type Pregunta,
  type Respuesta,
  type Respuestas,
  type RespuestaUnica,
  type RespuestaVarias,
  type Servicio,
  type ServicioId,
} from '../../data/cuestionarios';

/**
 * Cuestionario por pasos para clientes (`/cuestionario`): portada → «Tus datos» con el desplegable del servicio
 * → las secciones de ese servicio → repaso → confirmación. Las preguntas salen de `data/cuestionarios/`.
 *
 * - Enlace personal `?c=<id de contacto de GHL>`: la página le pide a `/api/cuestionario` (acción `contacto`)
 *   los datos que ya tiene el CRM y el servicio en que lo clasificó. Con eso «Tus datos» llega lleno y no se
 *   pide clave. `?s=<servicio>` elige el servicio desde el enlace.
 * - Enlace genérico: la clave se comprueba en el servidor antes de empezar (acción `verificar`) y se vuelve a
 *   mandar al enviar; vive en `sessionStorage` mientras la pestaña siga abierta.
 * - Las respuestas se guardan solas en `localStorage`, por servicio: llenarlo toma 15–30 minutos y la persona
 *   puede cerrar y seguir otro día. Se borran al enviar.
 * - Sólo «Tus datos» y el servicio son obligatorios. Las preguntas con ★ se recomiendan en el repaso.
 */

interface Props {
  waHref: string;
}

type Datos = DatosCliente & { pais: string };
type Vista = 'cargando' | 'portada' | 'pasos' | 'enviado';
type ErroresDatos = Partial<Record<keyof DatosCliente | 'servicio', string>>;
type RespuestasPorServicio = Partial<Record<ServicioId, Respuestas>>;
/** WhatsApp y correo que vinieron del CRM tapados (`96•••••00`): el servidor pone los reales al enviar. */
type Oculto = 'whatsapp' | 'correo';

const BORRADOR = 'ionos:cuestionario';
/** Borrador del primer cuestionario (sólo página web), para no perder lo que alguien dejó a medias. */
const BORRADOR_V1 = 'ionos:cuestionario-web';
const CLAVE = 'ionos:cuestionario-clave';
const DATOS_VACIOS: Datos = { negocio: '', nombre: '', cargo: '', whatsapp: '', correo: '', ciudad: '', pais: PAIS_POR_DEFECTO };

const leer = (almacen: 'local' | 'session', clave: string): string | null => {
  try {
    return (almacen === 'local' ? localStorage : sessionStorage).getItem(clave);
  } catch {
    return null;
  }
};
const escribir = (almacen: 'local' | 'session', clave: string, valor: string | null) => {
  try {
    const s = almacen === 'local' ? localStorage : sessionStorage;
    if (valor === null) s.removeItem(clave);
    else s.setItem(clave, valor);
  } catch {
    /* Modo privado o almacenamiento bloqueado: el cuestionario sigue funcionando sin guardar. */
  }
};

interface Borrador {
  servicio?: string;
  datos?: Datos;
  ocultos?: Oculto[];
  respuestas?: RespuestasPorServicio;
  /** Servicios ya enviados desde este navegador (para llenar otro sin repetir los datos) */
  enviados?: ServicioId[];
  paso?: number;
  guardado?: number;
}

function leerBorrador(): Borrador | null {
  try {
    const b = JSON.parse(leer('local', BORRADOR) ?? 'null') as Borrador | null;
    if (b) return b;
    const v1 = JSON.parse(leer('local', BORRADOR_V1) ?? 'null') as { datos?: Datos; respuestas?: Respuestas; paso?: number; guardado?: number } | null;
    return v1 ? { servicio: 'web', datos: v1.datos, respuestas: { web: v1.respuestas ?? {} }, paso: v1.paso, guardado: v1.guardado } : null;
  } catch {
    return null; // Borrador ilegible: se empieza de cero.
  }
}

const suave = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** WhatsApp con prefijo y sin el 0 inicial del número nacional: `+593 991234567`. */
const whatsappCompleto = (d: Datos) => `${paisPorIso(d.pais)?.prefijo ?? ''} ${d.whatsapp.replace(/\D/g, '').replace(/^0+/, '')}`.trim();
/** Para mostrar: el tapado del CRM tal cual (`+593 96•••••00`) o el que escribió la persona. */
const whatsappVisible = (d: Datos, ocultos: Oculto[]) =>
  ocultos.includes('whatsapp') ? `${paisPorIso(d.pais)?.prefijo ?? ''} ${d.whatsapp}`.trim() : whatsappCompleto(d);

function validarDatos(d: Datos, servicio: Servicio | undefined, ocultos: Oculto[]): ErroresDatos {
  const e: ErroresDatos = {};
  if (!servicio) e.servicio = 'Elige el servicio que te interesa.';
  if (d.negocio.trim().length < 2) e.negocio = 'Escribe el nombre de tu negocio.';
  if (d.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre.';
  const pais = paisPorIso(d.pais);
  const digitos = d.whatsapp.replace(/\D/g, '').replace(/^0+/, '');
  if (!ocultos.includes('whatsapp') && (digitos.length < (pais?.min ?? 6) || digitos.length > (pais?.max ?? 14))) e.whatsapp = 'Revisa el número de WhatsApp.';
  if (!ocultos.includes('correo') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) e.correo = 'Escribe un correo válido.';
  return e;
}

export default function Cuestionario({ waHref }: Props) {
  const [vista, setVista] = useState<Vista>('cargando');
  const [clave, setClave] = useState('');
  const [errorClave, setErrorClave] = useState('');
  const [verificando, setVerificando] = useState(false);
  /** ID de contacto de GHL ya comprobado por el servidor (enlace personal) */
  const [contacto, setContacto] = useState<string | null>(null);
  const [avisoEnlace, setAvisoEnlace] = useState('');
  const [servicioId, setServicioId] = useState<ServicioId | ''>('');
  const [delCrm, setDelCrm] = useState(false);
  const [datos, setDatos] = useState<Datos>(DATOS_VACIOS);
  const [ocultos, setOcultos] = useState<Oculto[]>([]);
  const [enviados, setEnviados] = useState<ServicioId[]>([]);
  const [respuestasPor, setRespuestasPor] = useState<RespuestasPorServicio>({});
  const [paso, setPaso] = useState(0);
  const [erroresDatos, setErroresDatos] = useState<ErroresDatos>({});
  const [guardado, setGuardado] = useState<number>();
  const [hayBorrador, setHayBorrador] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [cargado, setCargado] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const primerRender = useRef(true);

  const servicio = servicioPorId(servicioId);
  const secciones = servicio?.secciones ?? [];
  const preguntas = secciones.flatMap((s) => s.preguntas);
  const respuestas = (servicio && respuestasPor[servicio.id]) || {};
  /** Paso 0: tus datos · 1…n: secciones · n+1: repaso */
  const ultimo = secciones.length + 1;

  // Al cargar: retoma el borrador, lee el enlace (`?c=`, `?s=`) y, con enlace personal, pide los datos del CRM.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idContacto = (params.get('c') ?? '').trim();
    const delEnlace = servicioPorId(params.get('s'));

    const b = leerBorrador();
    let elegido = servicioPorId(b?.servicio)?.id;
    // Los tapados del CRM sólo valen con el enlace personal: sin él, la persona los escribe.
    const inicial: Datos = { ...DATOS_VACIOS, ...b?.datos };
    const tapados = idContacto ? (b?.ocultos ?? []) : [];
    for (const c of b?.ocultos ?? []) if (!tapados.includes(c)) inicial[c] = '';
    setDatos(inicial);
    setOcultos(tapados);
    if (b) {
      if (b.respuestas) setRespuestasPor(b.respuestas);
      if (b.enviados) setEnviados(b.enviados);
      if (typeof b.paso === 'number') setPaso(Math.max(0, b.paso));
      setGuardado(b.guardado);
      setHayBorrador(Boolean(b.datos?.negocio || Object.values(b.respuestas ?? {}).some((r) => Object.keys(r ?? {}).length)));
    }
    if (delEnlace && delEnlace.id !== elegido) {
      elegido = delEnlace.id;
      setPaso(0);
    }
    if (elegido) setServicioId(elegido);

    if (!idContacto) {
      const c = leer('session', CLAVE);
      if (c) setClave(c);
      setVista(c ? 'pasos' : 'portada');
      setCargado(true);
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/cuestionario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion: 'contacto', contacto: idContacto }),
        });
        const cuerpo = (await res.json()) as { ok?: boolean; error?: string; datos?: Datos; ocultos?: Oculto[]; servicio?: ServicioId | null };
        if (!res.ok || !cuerpo.ok || !cuerpo.datos) {
          setAvisoEnlace(cuerpo.error ?? 'No pudimos abrir tu enlace personal.');
          for (const c of tapados) inicial[c] = '';
          setDatos({ ...inicial });
          setOcultos([]);
        } else {
          const crm = cuerpo.datos;
          const delCrmOcultos = cuerpo.ocultos ?? [];
          setContacto(idContacto);
          // Lo que la persona ya escribió en este navegador manda; el CRM llena lo vacío y renueva sus tapados.
          const lleno = { ...inicial };
          const nuevosOcultos: Oculto[] = [];
          for (const c of DATOS) {
            const tapado = c.id === 'whatsapp' || c.id === 'correo' ? (c.id as Oculto) : null;
            const libre = !lleno[c.id].trim() || (tapado !== null && tapados.includes(tapado));
            if (!libre || !crm[c.id]) continue;
            lleno[c.id] = crm[c.id];
            if (tapado && delCrmOcultos.includes(tapado)) nuevosOcultos.push(tapado);
          }
          if (nuevosOcultos.includes('whatsapp') && paisPorIso(crm.pais)) lleno.pais = crm.pais;
          setDatos(lleno);
          setOcultos(nuevosOcultos);
          if (!elegido && servicioPorId(cuerpo.servicio)) {
            setServicioId(cuerpo.servicio as ServicioId);
            setDelCrm(true);
          }
        }
      } catch {
        setAvisoEnlace('No pudimos abrir tu enlace personal. Revisa tu conexión y recarga la página.');
      } finally {
        setVista('portada');
        setCargado(true);
      }
    })();
  }, []);

  // Guarda en el navegador medio segundo después del último cambio.
  useEffect(() => {
    if (!cargado || vista === 'enviado') return;
    const t = window.setTimeout(() => {
      const ahora = Date.now();
      escribir('local', BORRADOR, JSON.stringify({ v: 2, servicio: servicioId, datos, ocultos, respuestas: respuestasPor, enviados, paso, guardado: ahora }));
      escribir('local', BORRADOR_V1, null);
      setGuardado(ahora);
    }, 500);
    return () => window.clearTimeout(t);
  }, [servicioId, datos, ocultos, respuestasPor, enviados, paso, cargado, vista]);

  // Cada cambio de paso vuelve al inicio de la ventanilla y deja el foco en su título (lectores de pantalla).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    if (vista !== 'pasos') return;
    document.getElementById('cw-ventanilla')?.scrollIntoView({ behavior: suave() ? 'smooth' : 'auto', block: 'start' });
    titulo.current?.focus({ preventScroll: true });
  }, [paso, vista]);

  // Un borrador puede traer un paso que no existe en el servicio elegido.
  useEffect(() => {
    if (paso > ultimo) setPaso(servicio ? ultimo : 0);
  }, [paso, ultimo, servicio]);

  const responder = (id: string, valor: Respuesta | undefined) => {
    if (!servicio) return;
    setRespuestasPor((todas) => {
      const nuevo = { ...(todas[servicio.id] ?? {}) };
      if (valor === undefined) delete nuevo[id];
      else nuevo[id] = valor;
      return { ...todas, [servicio.id]: nuevo };
    });
  };

  const setDato = (campo: keyof Datos, valor: string) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    if (campo in erroresDatos) setErroresDatos((e) => ({ ...e, [campo]: undefined }));
  };

  /** «Cambiar» un dato tapado del CRM: se vacía para escribir uno nuevo. */
  const cambiarOculto = (campo: Oculto) => {
    setDatos((d) => ({ ...d, [campo]: '' }));
    setOcultos((o) => o.filter((x) => x !== campo));
    window.setTimeout(() => document.getElementById(`cw-${campo}`)?.focus(), 0);
  };

  /** Después de enviar: otro servicio con los mismos datos y el mismo enlace. */
  const otroServicio = () => {
    setServicioId('');
    setDelCrm(false);
    setErroresDatos({});
    setErrorEnvio('');
    setPaso(0);
    setVista('pasos');
  };

  const elegirServicio = (id: string) => {
    const s = servicioPorId(id);
    setServicioId(s?.id ?? '');
    setDelCrm(false);
    if (erroresDatos.servicio) setErroresDatos((e) => ({ ...e, servicio: undefined }));
  };

  const irA = (n: number) => {
    // Para salir de «Tus datos» hacia delante, el servicio y los obligatorios tienen que estar.
    if (paso === 0 && n > 0) {
      const e = validarDatos(datos, servicio, ocultos);
      setErroresDatos(e);
      const primero = e.servicio ? 'servicio' : DATOS.find((c) => e[c.id])?.id;
      if (primero) {
        document.getElementById(`cw-${primero}`)?.focus();
        return;
      }
    }
    setErrorEnvio('');
    setPaso(Math.min(Math.max(0, n), ultimo));
  };

  const entrar = async (ev: FormEvent) => {
    ev.preventDefault();
    if (contacto) {
      setVista('pasos');
      return;
    }
    if (!clave.trim()) {
      setErrorClave('Escribe la clave que te enviamos.');
      return;
    }
    setVerificando(true);
    setErrorClave('');
    try {
      const res = await fetch('/api/cuestionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'verificar', clave: clave.trim() }),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !cuerpo.ok) {
        setErrorClave(cuerpo.error ?? 'No pudimos comprobar la clave. Inténtalo de nuevo.');
        return;
      }
      escribir('session', CLAVE, clave.trim());
      setVista('pasos');
    } catch {
      setErrorClave('No pudimos comprobar la clave. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setVerificando(false);
    }
  };

  const enviar = async () => {
    const e = validarDatos(datos, servicio, ocultos);
    if (Object.keys(e).length || !servicio) {
      setErroresDatos(e);
      setPaso(0);
      return;
    }
    setEnviando(true);
    setErrorEnvio('');
    const cliente: DatosCliente = {
      negocio: datos.negocio,
      nombre: datos.nombre,
      cargo: datos.cargo,
      whatsapp: ocultos.includes('whatsapp') ? '' : whatsappCompleto(datos),
      correo: ocultos.includes('correo') ? '' : datos.correo,
      ciudad: datos.ciudad,
    };
    try {
      const res = await fetch('/api/cuestionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'enviar',
          ...(contacto ? { contacto } : { clave }),
          servicio: servicio.id,
          datos: cliente,
          usar_crm: contacto ? ocultos : [],
          respuestas,
          pagina_origen: window.location.href,
        }),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string; faltan?: string[] };
      if (res.status === 401) {
        // La clave cambió o el enlace ya no vale: se pide la clave sin perder nada.
        escribir('session', CLAVE, null);
        if (contacto) {
          setContacto(null);
          setAvisoEnlace(cuerpo.error ?? 'Tu enlace personal ya no es válido.');
          // Sin enlace, los datos tapados del CRM ya no sirven: hay que escribirlos.
          setDatos((d) => ({ ...d, ...Object.fromEntries(ocultos.map((c) => [c, ''])) }));
          setOcultos([]);
        } else {
          setErrorClave(cuerpo.error ?? 'La clave no es correcta.');
        }
        setVista('portada');
        return;
      }
      if (!res.ok || !cuerpo.ok) {
        setErrorEnvio(cuerpo.faltan?.length ? `Revisa en «Tus datos»: ${cuerpo.faltan.join(', ')}.` : (cuerpo.error ?? 'No pudimos enviar tu cuestionario.'));
        return;
      }
      escribir('local', BORRADOR, null);
      escribir('session', CLAVE, null);
      setEnviados((e) => [...new Set([...e, servicio.id])]);
      setRespuestasPor((todas) => {
        const resto = { ...todas };
        delete resto[servicio.id];
        return resto;
      });
      setVista('enviado');
    } catch {
      setErrorEnvio('No pudimos enviar tu cuestionario. Revisa tu conexión e inténtalo de nuevo: tus respuestas siguen guardadas.');
    } finally {
      setEnviando(false);
    }
  };

  const contestadas = preguntas.filter((p) => respondida(p, respuestas[p.id])).length;

  if (vista === 'cargando') return <Cargando />;

  if (vista === 'portada') {
    return (
      <Portada
        servicio={servicio}
        contacto={contacto ? { nombre: datos.nombre, negocio: datos.negocio } : null}
        aviso={avisoEnlace}
        clave={clave}
        setClave={(v) => {
          setClave(v);
          if (errorClave) setErrorClave('');
        }}
        error={errorClave}
        verificando={verificando}
        onSubmit={entrar}
        hayBorrador={hayBorrador}
        contestadas={contestadas}
        total={preguntas.length}
        waHref={waHref}
      />
    );
  }

  if (vista === 'enviado') {
    return <Enviado nombre={datos.nombre} servicio={servicio} waHref={waHref} quedan={SERVICIOS.some((s) => !enviados.includes(s.id))} onOtro={otroServicio} />;
  }

  const seccion = paso >= 1 && paso <= secciones.length ? secciones[paso - 1] : undefined;
  const pasos = servicio
    ? [{ id: 'datos', numero: '00', titulo: 'Tus datos' }, ...secciones, { id: 'repaso', numero: String(ultimo).padStart(2, '0'), titulo: 'Revisar y enviar' }]
    : [{ id: 'datos', numero: '00', titulo: 'Tus datos' }];
  const completo = (i: number) => {
    if (i === 0) return Object.keys(validarDatos(datos, servicio, ocultos)).length === 0;
    if (i === ultimo) return false;
    return secciones[i - 1].preguntas.some((p) => respondida(p, respuestas[p.id]));
  };
  const siguiente = pasos[paso + 1];
  const enRepaso = Boolean(servicio) && paso === ultimo;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Índice: columna fija en escritorio, desplegable en móvil */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <div className="rounded-[1.25rem] border border-line bg-canvas p-5">
            {servicio ? (
              <>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.025em] text-cobalt-ink">{servicio.nombre}</p>
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <p className="text-[0.95rem] font-semibold text-ink">
                    Paso <span className="tnum">{paso + 1}</span> de <span className="tnum">{pasos.length}</span>
                  </p>
                  <p className="tnum text-[0.8rem] text-ink-3">
                    {contestadas} de {preguntas.length} preguntas
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ice-2" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-cobalt transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                    style={{ width: `${Math.max(4, (contestadas / Math.max(1, preguntas.length)) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-[0.95rem] leading-relaxed text-ink-2">
                <span className="font-semibold text-ink">Empieza por «Tus datos».</span> Cuando elijas el servicio, aquí verás sus secciones.
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-[0.8rem] text-ink-3" aria-live="polite">
              {guardado ? (
                <>
                  <Ico d={ICONOS.check} size={14} className="text-cobalt" />
                  Guardado en este navegador
                </>
              ) : (
                'Tus respuestas se guardan solas mientras avanzas'
              )}
            </p>

            {servicio && (
              <>
                <details className="group mt-4 lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-full bg-ice-3 px-4 py-2.5 text-[0.9rem] font-semibold text-cobalt-ink">
                    Ver todas las secciones
                    <Ico d={ICONOS.chevron} size={16} className="transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <Indice pasos={pasos} actual={paso} completo={completo} irA={irA} />
                </details>
                <div className="mt-4 hidden lg:block">
                  <Indice pasos={pasos} actual={paso} completo={completo} irA={irA} />
                </div>
                <Glosario glosario={servicio.glosario} className="mt-4 hidden lg:block" compacto />
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:col-span-8">
        <div id="cw-ventanilla" className="scroll-mt-24 overflow-clip rounded-[1.75rem] border border-line bg-canvas shadow-lift">
          <div className="flex items-start gap-4 border-b border-line-soft bg-ice-3 px-6 py-5 sm:px-8">
            <span className="tnum flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cobalt text-[0.95rem] font-semibold text-white">
              {paso === 0 ? <Ico d={ICONOS.user} size={20} /> : enRepaso ? <Ico d={ICONOS.check} size={20} /> : seccion?.numero}
            </span>
            <div className="min-w-0">
              <h2 ref={titulo} tabIndex={-1} className="display-tight text-[1.6rem] font-semibold text-ink outline-none sm:text-[1.9rem]">
                {paso === 0 ? 'Tus datos' : enRepaso ? 'Revisa y envía' : seccion?.titulo}
              </h2>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">
                {paso === 0 ? (
                  contacto ? (
                    'Los llenamos con lo que ya nos contaste. Revisa que estén bien, confirma el servicio y sigue.'
                  ) : (
                    'Para saber de qué negocio hablamos, sobre qué servicio y a quién le escribimos. Son los únicos datos obligatorios.'
                  )
                ) : enRepaso ? (
                  'Mira qué te falta. Puedes enviar aunque dejes preguntas en blanco: lo conversamos en la llamada.'
                ) : (
                  <>
                    <span className="font-semibold text-ink">¿Por qué te lo preguntamos?</span> {seccion?.porque}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="px-6 py-2 sm:px-8">
            {paso === 0 && (
              <PasoDatos
                datos={datos}
                errores={erroresDatos}
                setDato={setDato}
                servicio={servicio}
                elegirServicio={elegirServicio}
                delCrm={delCrm}
                respondidas={(id) => Object.keys(respuestasPor[id] ?? {}).length}
                enviados={enviados}
                ocultos={ocultos}
                cambiarOculto={cambiarOculto}
              />
            )}
            {seccion && (
              <div className="divide-y divide-line-soft">
                {seccion.preguntas.map((p) => (
                  <PreguntaCampo
                    key={`${servicioId}:${p.id}`}
                    p={p}
                    valor={respuestas[p.id]}
                    onChange={(v) => responder(p.id, v)}
                    respuestas={respuestas}
                    datos={datos}
                    ocultos={ocultos}
                  />
                ))}
              </div>
            )}
            {enRepaso && servicio && <Repaso servicio={servicio} datos={datos} ocultos={ocultos} respuestas={respuestas} irA={irA} />}
          </div>

          {errorEnvio && (
            <p className="mx-6 mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8" role="alert">
              <Ico d={ICONOS.alert} size={18} className="mt-px shrink-0" />
              {errorEnvio}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-line-soft bg-ice-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            {paso > 0 ? (
              <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={() => irA(paso - 1)}>
                <Ico d={ICONOS.back} size={18} />
                Anterior
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            {!enRepaso ? (
              <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={() => irA(paso + 1)}>
                {servicio && paso === ultimo - 1 ? 'Revisar y enviar' : 'Siguiente'}
                {siguiente && <span className="sr-only">: {siguiente.titulo}</span>}
                <Ico d={ICONOS.arrow} size={18} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={enviar} disabled={enviando} aria-busy={enviando}>
                {enviando ? 'Enviando…' : 'Enviar cuestionario'}
                {!enviando && <Ico d={ICONOS.send} size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Portada: enlace personal o clave ──────────────────────────────────── */

function Cargando() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <p className="flex items-center gap-3 text-[1.05rem] text-ink-2">
        <span className="h-5 w-5 rounded-full border-2 border-ice-2 border-t-cobalt motion-safe:animate-spin" aria-hidden="true" />
        Preparando tu cuestionario…
      </p>
    </div>
  );
}

function Portada(props: {
  servicio: Servicio | undefined;
  contacto: { nombre: string; negocio: string } | null;
  aviso: string;
  clave: string;
  setClave: (v: string) => void;
  error: string;
  verificando: boolean;
  onSubmit: (e: FormEvent) => void;
  hayBorrador: boolean;
  contestadas: number;
  total: number;
  waHref: string;
}) {
  const [ver, setVer] = useState(false);
  const s = props.servicio;
  const intro = s ?? GENERAL;
  const pila = props.contacto?.nombre.trim().split(/\s+/)[0];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="min-w-0 lg:col-span-6">
        <h1 className="display-tight text-[clamp(2.3rem,4.2vw,3.6rem)] font-semibold text-ink">{intro.titulo}</h1>
        <p className="mt-5 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-ink-2">{intro.lead}</p>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-2">{intro.queEs}</p>

        {!s && (
          <ul className="mt-6 divide-y divide-line-soft rounded-[1.25rem] border border-line bg-canvas px-5">
            {SERVICIOS.map((x) => (
              <li key={x.id} className="py-3">
                <p className="text-[0.98rem] font-semibold text-ink">{x.nombre}</p>
                <p className="mt-0.5 text-[0.92rem] leading-relaxed text-ink-3">{x.descripcion}</p>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-10 text-[1.35rem] font-semibold text-ink">Cómo llenarlo</h2>
        <ul className="mt-4 space-y-3">
          {comoLlenarlo(intro.minutos).map((t) => (
            <li key={t} className="flex gap-3 text-[1rem] leading-relaxed text-ink-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ice text-cobalt-ink">
                <Ico d={ICONOS.check} size={14} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        {s && <Glosario glosario={s.glosario} className="mt-8" />}
      </div>

      <div className="min-w-0 lg:col-span-6 lg:pt-2">
        <form onSubmit={props.onSubmit} noValidate className="overflow-clip rounded-[1.75rem] border border-line bg-canvas shadow-lift">
          <div className="flex items-center gap-3 border-b border-line-soft bg-ice-3 px-6 py-4 sm:px-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt text-white">
              <Ico d={props.contacto ? ICONOS.user : ICONOS.shield} size={18} />
            </span>
            <div className="min-w-0 leading-tight">
              {props.contacto ? (
                <>
                  <p className="text-[1.05rem] font-semibold text-ink">Hola{pila ? `, ${pila}` : ''}</p>
                  <p className="mt-0.5 truncate text-[0.85rem] text-ink-3">
                    {props.contacto.negocio ? `Preparamos este cuestionario para ${props.contacto.negocio}` : 'Preparamos este cuestionario para ti'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[1.05rem] font-semibold text-ink">Acceso para clientes</p>
                  <p className="mt-0.5 text-[0.85rem] text-ink-3">Escribe la clave que te enviamos por WhatsApp o correo</p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            {props.contacto ? (
              <p className="text-[1rem] leading-relaxed text-ink-2">
                Ya tenemos tus datos de contacto, así que no tienes que escribirlos otra vez: revísalos en el primer paso y sigue con las preguntas.
              </p>
            ) : (
              <>
                {props.aviso && (
                  <p
                    className="flex items-start gap-2 rounded-2xl border border-ice-2 bg-ice-3 px-4 py-3 text-[0.92rem] leading-relaxed text-ink-2"
                    role="status"
                  >
                    <Ico d={ICONOS.alert} size={18} className="mt-px shrink-0 text-cobalt-ink" />
                    {props.aviso}
                  </p>
                )}
                <div>
                  <label htmlFor="cw-clave" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
                    Clave de acceso
                  </label>
                  <div className="relative">
                    <input
                      id="cw-clave"
                      type={ver ? 'text' : 'password'}
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      className={`${CAMPO} w-full pr-24 ${props.error ? MAL : BIEN}`}
                      value={props.clave}
                      onChange={(e) => props.setClave(e.target.value)}
                      aria-invalid={!!props.error}
                      aria-describedby={props.error ? 'cw-clave-err' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setVer((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[0.85rem] font-semibold text-cobalt-ink hover:bg-ice-3"
                      aria-pressed={ver}
                    >
                      {ver ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {props.error && (
                    <p id="cw-clave-err" className="mt-1.5 text-sm text-red-600" role="alert">
                      {props.error}
                    </p>
                  )}
                </div>
              </>
            )}
            {props.hayBorrador && (
              <p className="rounded-2xl border border-ice-2 bg-ice-3 px-4 py-3 text-[0.92rem] leading-relaxed text-ink-2">
                {props.total > 0 ? (
                  <>
                    Tienes respuestas guardadas en este navegador (<span className="tnum">{props.contestadas}</span> de{' '}
                    <span className="tnum">{props.total}</span> preguntas). Al entrar sigues donde lo dejaste.
                  </>
                ) : (
                  'Tienes respuestas guardadas en este navegador. Al entrar sigues donde lo dejaste.'
                )}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full" disabled={props.verificando} aria-busy={props.verificando}>
              {props.verificando ? 'Comprobando…' : props.hayBorrador ? 'Seguir donde lo dejé' : 'Empezar el cuestionario'}
              {!props.verificando && <Ico d={ICONOS.arrow} size={18} />}
            </button>
          </div>
          <div className="border-t border-line-soft bg-ice-3 px-6 py-4 text-[0.88rem] text-ink-3 sm:px-8">
            {props.contacto ? '¿Tienes dudas? ' : '¿No tienes la clave? '}
            <a href={props.waHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-cobalt-ink underline">
              {props.contacto ? 'Escríbenos por WhatsApp' : 'Pídela por WhatsApp'}
            </a>
            .
          </div>
        </form>
      </div>
    </div>
  );
}

function Glosario({ glosario, className = '', compacto = false }: { glosario: Servicio['glosario']; className?: string; compacto?: boolean }) {
  return (
    <details className={`group rounded-[1.25rem] ${compacto ? 'border-t border-line-soft pt-1' : 'border border-line bg-canvas'} ${className}`}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink ${compacto ? 'px-2.5 py-3 text-[0.92rem]' : 'px-5 py-4 text-[1rem]'}`}
      >
        Palabras que quizás escuches
        <Ico d={ICONOS.chevron} size={18} className="text-ink-3 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <dl className={`divide-y divide-line-soft border-t border-line-soft ${compacto ? 'px-2.5' : 'px-5'}`}>
        {glosario.map((g) => (
          <div key={g.termino} className="py-3">
            <dt className={`font-semibold text-ink ${compacto ? 'text-[0.9rem]' : 'text-[0.95rem]'}`}>{g.termino}</dt>
            <dd className={`mt-0.5 leading-relaxed text-ink-2 ${compacto ? 'text-[0.88rem]' : 'text-[0.95rem]'}`}>{g.definicion}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/* ── Índice de pasos ───────────────────────────────────────────────────── */

function Indice({
  pasos,
  actual,
  completo,
  irA,
}: {
  pasos: { id: string; numero: string; titulo: string }[];
  actual: number;
  completo: (i: number) => boolean;
  irA: (i: number) => void;
}) {
  return (
    <ol className="mt-3 space-y-1 lg:mt-0">
      {pasos.map((s, i) => {
        const hecho = completo(i);
        const aqui = i === actual;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={(e) => {
                // En móvil el índice va en un desplegable: se cierra al elegir.
                e.currentTarget.closest('details')?.removeAttribute('open');
                irA(i);
              }}
              aria-current={aqui ? 'step' : undefined}
              className={`flex w-full items-center gap-3 rounded-[0.75rem] px-2.5 py-2 text-left transition-colors duration-200 ${aqui ? 'bg-ice' : 'hover:bg-ice-3'}`}
            >
              <span
                className={`tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold ${
                  hecho ? 'bg-cobalt text-white' : aqui ? 'bg-canvas text-cobalt-ink ring-2 ring-cobalt' : 'bg-ice-3 text-ink-3'
                }`}
              >
                {hecho ? (
                  <Ico d={ICONOS.check} size={13} />
                ) : i === 0 ? (
                  <Ico d={ICONOS.user} size={14} />
                ) : i === pasos.length - 1 ? (
                  <Ico d={ICONOS.send} size={13} />
                ) : (
                  s.numero
                )}
              </span>
              <span className={`min-w-0 flex-1 truncate text-[0.92rem] ${aqui ? 'font-semibold text-cobalt-ink' : 'text-ink-2'}`}>{s.titulo}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Paso 0: servicio y tus datos ──────────────────────────────────────── */

function PasoDatos({
  datos,
  errores,
  setDato,
  servicio,
  elegirServicio,
  delCrm,
  respondidas,
  enviados,
  ocultos,
  cambiarOculto,
}: {
  datos: Datos;
  errores: ErroresDatos;
  setDato: (c: keyof Datos, v: string) => void;
  servicio: Servicio | undefined;
  elegirServicio: (id: string) => void;
  delCrm: boolean;
  respondidas: (id: ServicioId) => number;
  enviados: ServicioId[];
  ocultos: Oculto[];
  cambiarOculto: (c: Oculto) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-4 py-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="cw-servicio" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
          ¿Sobre qué servicio es este cuestionario?
        </label>
        <div className="relative">
          <select
            id="cw-servicio"
            className={`${CAMPO} w-full cursor-pointer appearance-none pr-12 ${errores.servicio ? MAL : BIEN} ${servicio ? '' : 'text-ink-3'}`}
            value={servicio?.id ?? ''}
            onChange={(e) => elegirServicio(e.target.value)}
            aria-invalid={!!errores.servicio}
            aria-describedby={errores.servicio ? 'cw-servicio-err' : servicio ? 'cw-servicio-ayuda' : undefined}
          >
            <option value="" disabled>
              Elige un servicio
            </option>
            {SERVICIOS.map((s) => (
              <option key={s.id} value={s.id} className="text-ink">
                {s.nombre}
                {enviados.includes(s.id) ? ' · ya enviado' : respondidas(s.id) && s.id !== servicio?.id ? ' · con respuestas guardadas' : ''}
              </option>
            ))}
          </select>
          <Ico d={ICONOS.chevron} size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3" />
        </div>
        {errores.servicio ? (
          <p id="cw-servicio-err" className="mt-1.5 text-sm text-red-600">
            {errores.servicio}
          </p>
        ) : (
          servicio && (
            <p id="cw-servicio-ayuda" className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-3">
              {servicio.descripcion}
              {delCrm && ' Lo elegimos según lo que conversamos; si es otro, cámbialo aquí.'}
            </p>
          )
        )}
      </div>

      <div className="border-t border-line-soft sm:col-span-2" aria-hidden="true" />

      {DATOS.map((c) => {
        const id = `cw-${c.id}`;
        const error = errores[c.id];
        const oculto = ocultos.find((o) => o === c.id);
        if (oculto) {
          // Dato del CRM tapado: se muestra sólo una parte (el enlace se puede reenviar) y se puede cambiar.
          return (
            <div key={c.id} className={c.id === 'whatsapp' ? 'sm:col-span-2' : ''}>
              <p className="mb-1.5 text-[0.95rem] font-semibold text-ink">{c.titulo}</p>
              <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-ice-3 py-2 pl-4 pr-2">
                <Ico d={ICONOS.shield} size={18} className="shrink-0 text-cobalt-ink" />
                <span className="tnum min-w-0 flex-1 truncate text-[1rem] text-ink">
                  {oculto === 'whatsapp' ? whatsappVisible(datos, ocultos) : datos.correo}
                </span>
                <button
                  type="button"
                  onClick={() => cambiarOculto(oculto)}
                  className="rounded-full px-3.5 py-2 text-[0.88rem] font-semibold text-cobalt-ink transition-colors hover:bg-ice"
                  aria-label={`Cambiar ${c.titulo.toLowerCase()}`}
                >
                  Cambiar
                </button>
              </div>
              <p className="mt-1.5 text-[0.85rem] text-ink-3">Ya lo tenemos. Por tu privacidad sólo mostramos una parte.</p>
            </div>
          );
        }
        return (
          <div key={c.id} className={c.id === 'whatsapp' ? 'sm:col-span-2' : ''}>
            <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
              {c.titulo}
              {!c.requerido && <span className="font-normal text-ink-3"> (opcional)</span>}
            </label>
            {c.id === 'whatsapp' ? (
              <div className="flex gap-2">
                <SelectorPais valor={datos.pais} onChange={(iso) => setDato('pais', iso)} invalido={!!error} />
                <input
                  id={id}
                  type="tel"
                  inputMode="tel"
                  autoComplete={c.autocomplete}
                  placeholder={paisPorIso(datos.pais)?.ejemplo || '991234567'}
                  className={`${CAMPO} tnum min-w-0 flex-1 ${error ? MAL : BIEN}`}
                  value={datos.whatsapp}
                  onChange={(e) => setDato('whatsapp', e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-err` : undefined}
                />
              </div>
            ) : (
              <input
                id={id}
                type={c.tipo ?? 'text'}
                inputMode={c.tipo === 'email' ? 'email' : undefined}
                autoComplete={c.autocomplete}
                placeholder={c.placeholder}
                className={`${CAMPO} w-full ${error ? MAL : BIEN}`}
                value={datos[c.id]}
                onChange={(e) => setDato(c.id, e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-err` : undefined}
              />
            )}
            {error && (
              <p id={`${id}-err`} className="mt-1.5 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Una pregunta ──────────────────────────────────────────────────────── */

function PreguntaCampo({
  p,
  valor,
  onChange,
  respuestas,
  datos,
  ocultos,
}: {
  p: Pregunta;
  valor: Respuesta | undefined;
  onChange: (v: Respuesta | undefined) => void;
  respuestas: Respuestas;
  datos: Datos;
  ocultos: Oculto[];
}) {
  const id = `cw-p-${p.id}`;
  const ayuda = p.ayuda ? `${id}-ayuda` : undefined;
  const enunciado = (
    <>
      <span className="tnum text-cobalt-ink">{p.n}.</span> {p.titulo}
      {p.importante && (
        <span className="ml-1.5 text-cobalt" title="Pregunta importante">
          ★<span className="sr-only"> (importante)</span>
        </span>
      )}
    </>
  );
  const textoAyuda = p.ayuda && (
    <p id={ayuda} className="mt-1 text-[0.92rem] leading-relaxed text-ink-3">
      {p.ayuda}
    </p>
  );
  const cabecera = 'block text-[1.05rem] font-semibold leading-snug text-ink';

  // Opciones: fieldset con leyenda; texto, tabla y campos: etiqueta normal.
  if (p.tipo === 'unica' || p.tipo === 'varias') {
    return (
      <div className="py-6">
        <fieldset className="min-w-0" aria-describedby={ayuda}>
          <legend className={cabecera}>{enunciado}</legend>
          {textoAyuda}
          {p.tipo === 'unica' ? (
            <OpcionesUnica p={p} valor={valor as RespuestaUnica | undefined} onChange={onChange} />
          ) : (
            <OpcionesVarias p={p} valor={valor as RespuestaVarias | undefined} onChange={onChange} />
          )}
        </fieldset>
      </div>
    );
  }

  if (p.tipo === 'tabla') {
    return (
      <div className="py-6">
        <fieldset className="min-w-0" aria-describedby={ayuda}>
          <legend className={cabecera}>{enunciado}</legend>
          {textoAyuda}
          <Tabla p={p} valor={valor as Record<string, string>[] | undefined} onChange={onChange} />
        </fieldset>
      </div>
    );
  }

  if (p.tipo === 'campos') {
    const actual = (valor as Record<string, string> | undefined) ?? {};
    const copiar = p.copiarDeDatos;
    const telefono = whatsappCompleto(datos);
    // Un dato tapado del CRM no se copia tapado: se deja dicho que es el mismo (el real lo tenemos).
    const deDatos = (campo: keyof DatosCliente) =>
      ocultos.includes(campo as Oculto) ? 'El mismo de «Tus datos»' : campo === 'whatsapp' ? (datos.whatsapp ? telefono : '') : datos[campo];
    return (
      <div className="py-6">
        <fieldset className="min-w-0" aria-describedby={ayuda}>
          <legend className={cabecera}>{enunciado}</legend>
          {textoAyuda}
          {copiar && Object.values(copiar).some((c) => deDatos(c)) && (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-ice px-3.5 py-1.5 text-[0.88rem] font-semibold text-cobalt-ink transition-colors hover:bg-ice-2"
              onClick={() => {
                const nuevo = { ...actual };
                for (const [propio, dato] of Object.entries(copiar)) if (deDatos(dato)) nuevo[propio] = deDatos(dato);
                onChange(nuevo);
              }}
            >
              <Ico d={ICONOS.copy} size={15} />
              Usar mi WhatsApp y correo de «Tus datos»
            </button>
          )}
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {p.campos.map((c) => (
              <div key={c.id}>
                <label htmlFor={`${id}-${c.id}`} className="mb-1.5 block text-[0.92rem] font-semibold text-ink">
                  {c.titulo}
                </label>
                <input
                  id={`${id}-${c.id}`}
                  type={c.tipo ?? 'text'}
                  inputMode={c.tipo === 'email' ? 'email' : c.tipo === 'tel' ? 'tel' : undefined}
                  placeholder={c.placeholder}
                  className={`${CAMPO} w-full ${BIEN} ${c.tipo === 'tel' ? 'tnum' : ''}`}
                  value={actual[c.id] ?? ''}
                  onChange={(e) => {
                    const nuevo = { ...actual, [c.id]: e.target.value };
                    if (!e.target.value) delete nuevo[c.id];
                    onChange(Object.keys(nuevo).length ? nuevo : undefined);
                  }}
                />
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  // Texto libre.
  const sugerencias =
    p.sugerirDe && Array.isArray(respuestas[p.sugerirDe])
      ? [...new Set((respuestas[p.sugerirDe] as Record<string, string>[]).map((f) => (f.nombre ?? '').trim()).filter(Boolean))]
      : [];
  return (
    <div className="py-6">
      <label htmlFor={id} className={cabecera}>
        {enunciado}
      </label>
      {textoAyuda}
      {sugerencias.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[0.85rem] text-ink-3">De tu lista:</span>
          {sugerencias.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              aria-pressed={valor === s}
              className={`rounded-full px-3 py-1 text-[0.85rem] font-semibold transition-colors ${
                valor === s ? 'bg-cobalt text-white' : 'bg-ice text-cobalt-ink hover:bg-ice-2'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <textarea
        id={id}
        rows={3}
        placeholder={p.placeholder ?? 'Escribe aquí con tus palabras'}
        className={`${CAMPO} mt-3 block max-h-96 min-h-[6.5rem] w-full resize-y [field-sizing:content] ${BIEN}`}
        value={typeof valor === 'string' ? valor : ''}
        onChange={(e) => onChange(e.target.value ? e.target.value : undefined)}
        aria-describedby={ayuda}
        maxLength={4000}
      />
    </div>
  );
}

function OpcionesUnica({
  p,
  valor,
  onChange,
}: {
  p: Extract<Pregunta, { tipo: 'unica' }>;
  valor: RespuestaUnica | undefined;
  onChange: (v: Respuesta | undefined) => void;
}) {
  return (
    <div className={`mt-4 grid grid-cols-1 gap-2.5 ${p.opciones.some((o) => o.nota) ? '' : 'sm:grid-cols-2'}`}>
      {p.opciones.map((o) => {
        const on = valor?.valor === o.valor;
        return (
          <div key={o.valor} className={`flex flex-col gap-2 ${o.detalle && on ? 'sm:col-span-2' : ''}`}>
            <Opcion
              tipo="radio"
              nombre={`cw-p-${p.id}`}
              on={on}
              onToggle={() => onChange(on ? undefined : { valor: o.valor })}
              titulo={o.valor}
              nota={o.nota}
            />
            {o.detalle && on && (
              <input
                type="text"
                aria-label={o.detalle}
                placeholder={o.detalle}
                className={`${CAMPO} w-full ${BIEN}`}
                value={valor?.detalle ?? ''}
                onChange={(e) => onChange({ valor: o.valor, detalle: e.target.value })}
                maxLength={300}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OpcionesVarias({
  p,
  valor,
  onChange,
}: {
  p: Extract<Pregunta, { tipo: 'varias' }>;
  valor: RespuestaVarias | undefined;
  onChange: (v: Respuesta | undefined) => void;
}) {
  const elegidas = valor?.valores ?? [];
  const lleno = p.max !== undefined && elegidas.length >= p.max;
  const alternar = (v: string) => {
    let nuevas: string[];
    if (elegidas.includes(v)) nuevas = elegidas.filter((x) => x !== v);
    else if (v === p.ninguna) nuevas = [v];
    else nuevas = [...elegidas.filter((x) => x !== p.ninguna), v];
    const detalles = Object.fromEntries(Object.entries(valor?.detalles ?? {}).filter(([k]) => nuevas.includes(k)));
    onChange(nuevas.length ? { valores: nuevas, ...(Object.keys(detalles).length ? { detalles } : {}) } : undefined);
  };
  return (
    <>
      {p.max && (
        <p className="tnum mt-2 text-[0.85rem] font-semibold text-cobalt-ink" aria-live="polite">
          {elegidas.length} de {p.max} elegidas
        </p>
      )}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {p.opciones.map((o) => {
          const on = elegidas.includes(o.valor);
          return (
            <div key={o.valor} className={`flex flex-col gap-2 ${o.detalle && on ? 'sm:col-span-2' : ''}`}>
              <Opcion tipo="checkbox" on={on} deshabilitada={!on && lleno} onToggle={() => alternar(o.valor)} titulo={o.valor} nota={o.nota} />
              {o.detalle && on && (
                <input
                  type="text"
                  aria-label={`${o.valor}: ${o.detalle}`}
                  placeholder={o.detalle}
                  className={`${CAMPO} w-full ${BIEN}`}
                  value={valor?.detalles?.[o.valor] ?? ''}
                  onChange={(e) => onChange({ valores: elegidas, detalles: { ...valor?.detalles, [o.valor]: e.target.value } })}
                  maxLength={300}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Opcion({
  tipo,
  nombre,
  on,
  deshabilitada = false,
  onToggle,
  titulo,
  nota,
}: {
  tipo: 'radio' | 'checkbox';
  nombre?: string;
  on: boolean;
  deshabilitada?: boolean;
  onToggle: () => void;
  titulo: string;
  nota?: string;
}) {
  return (
    <label
      className={`flex flex-1 items-start gap-3 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color] duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-cobalt/20 ${
        on ? 'border-cobalt bg-ice-3' : 'border-line hover:border-ice-2'
      } ${deshabilitada ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <input
        type={tipo}
        name={nombre}
        checked={on}
        disabled={deshabilitada}
        onChange={onToggle}
        // Un radio marcado no se desmarca solo: el clic de nuevo lo quita, como en el documento.
        onClick={tipo === 'radio' && on ? onToggle : undefined}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-[1.5px] transition-colors duration-200 ${
          tipo === 'radio' ? 'rounded-full' : 'rounded-[0.4rem]'
        } ${on ? 'border-cobalt bg-cobalt text-white' : 'border-line bg-canvas'}`}
      >
        {on && (tipo === 'radio' ? <span className="h-2 w-2 rounded-full bg-white" /> : <Ico d={ICONOS.check} size={13} />)}
      </span>
      <span className="min-w-0 leading-snug">
        <span className={`block text-[0.98rem] ${on ? 'font-semibold text-ink' : 'text-ink-2'}`}>{titulo}</span>
        {nota && <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink-3">{nota}</span>}
      </span>
    </label>
  );
}

function Tabla({
  p,
  valor,
  onChange,
}: {
  p: Extract<Pregunta, { tipo: 'tabla' }>;
  valor: Record<string, string>[] | undefined;
  onChange: (v: Respuesta | undefined) => void;
}) {
  const vacia = () => Object.fromEntries(p.columnas.map((c) => [c.id, '']));
  // Las filas vacías se guardan tal cual (para no mover lo que se ve); el servidor las descarta.
  const filas = valor?.length ? valor : Array.from({ length: p.filas }, vacia);
  const columnas = p.columnas.length === 3 ? 'sm:grid-cols-[1fr_1.4fr_0.8fr]' : 'sm:grid-cols-[1fr_1.4fr]';
  return (
    <div className="mt-4">
      <div className={`hidden gap-3 pb-2 pr-11 sm:grid ${columnas}`} aria-hidden="true">
        {p.columnas.map((c) => (
          <span key={c.id} className="text-[0.72rem] font-semibold uppercase tracking-[0.025em] text-ink-3">
            {c.titulo}
          </span>
        ))}
      </div>
      <ol className="space-y-3">
        {filas.map((fila, i) => (
          <li key={i} className="rounded-2xl border border-line-soft p-3 sm:border-0 sm:p-0">
            <p className="mb-2 text-[0.85rem] font-semibold text-ink-3 sm:sr-only">
              {p.fila} {i + 1}
            </p>
            <div className="flex items-start gap-2">
              <div className={`grid min-w-0 flex-1 grid-cols-1 gap-2 sm:gap-3 ${columnas}`}>
                {p.columnas.map((c) => (
                  <input
                    key={c.id}
                    type="text"
                    aria-label={`${c.titulo} · ${p.fila.toLowerCase()} ${i + 1}`}
                    placeholder={i === 0 ? c.placeholder : c.titulo}
                    className={`${CAMPO} w-full ${BIEN}`}
                    value={fila[c.id] ?? ''}
                    maxLength={400}
                    onChange={(e) => onChange(filas.map((f, j) => (j === i ? { ...f, [c.id]: e.target.value } : f)))}
                  />
                ))}
              </div>
              {filas.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange(filas.filter((_, j) => j !== i))}
                  className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ice-3 hover:text-cobalt-ink"
                  aria-label={`Quitar ${p.fila.toLowerCase()} ${i + 1}`}
                >
                  <Ico d={ICONOS.close} size={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
      {filas.length < p.maxFilas && (
        <button
          type="button"
          onClick={() => onChange([...filas, vacia()])}
          className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[0.92rem] font-semibold text-cobalt-ink transition-colors hover:bg-ice-3"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ice">
            <Ico d={ICONOS.plus} size={14} />
          </span>
          {p.agregar}
        </button>
      )}
    </div>
  );
}

/* ── Repaso antes de enviar ────────────────────────────────────────────── */

function Repaso({
  servicio,
  datos,
  ocultos,
  respuestas,
  irA,
}: {
  servicio: Servicio;
  datos: Datos;
  ocultos: Oculto[];
  respuestas: Respuestas;
  irA: (n: number) => void;
}) {
  const faltanEstrellas = servicio.secciones.flatMap((s) => s.preguntas).filter((p) => p.importante && !respondida(p, respuestas[p.id]));
  return (
    <div className="py-6">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-2xl border border-line-soft bg-ice-3 px-5 py-4 sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2">
          <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.025em] text-ink-3">Servicio</dt>
          <dd className="truncate text-[0.95rem] font-semibold text-ink">{servicio.nombre}</dd>
        </div>
        {DATOS.filter((c) => datos[c.id]).map((c) => (
          <div key={c.id} className="min-w-0">
            <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.025em] text-ink-3">{c.titulo}</dt>
            <dd className="truncate text-[0.95rem] text-ink">{c.id === 'whatsapp' ? whatsappVisible(datos, ocultos) : datos[c.id]}</dd>
          </div>
        ))}
      </dl>

      {faltanEstrellas.length > 0 ? (
        <div className="mt-6">
          <p className="text-[1rem] font-semibold text-ink">
            Te faltan <span className="tnum">{faltanEstrellas.length}</span> preguntas importantes (★)
          </p>
          <p className="mt-1 text-[0.92rem] text-ink-3">Con ellas armamos tu propuesta más rápido. Si no las sabes, puedes enviar igual.</p>
          <ul className="mt-3 divide-y divide-line-soft rounded-2xl border border-line">
            {faltanEstrellas.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => irA(servicio.secciones.findIndex((s) => s.preguntas.includes(p)) + 1)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ice-3"
                >
                  <span className="tnum w-7 shrink-0 text-[0.9rem] font-semibold text-cobalt-ink">{p.n}.</span>
                  <span className="min-w-0 flex-1 text-[0.95rem] text-ink-2">{p.titulo}</span>
                  <Ico d={ICONOS.arrow} size={16} className="shrink-0 text-cobalt-ink" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-6 flex items-center gap-3 rounded-2xl border border-ice-2 bg-ice-3 px-4 py-3 text-[0.95rem] text-ink-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-white">
            <Ico d={ICONOS.check} size={14} />
          </span>
          Respondiste todas las preguntas importantes.
        </p>
      )}

      <ul className="mt-6 divide-y divide-line-soft">
        {servicio.secciones.map((s, i) => {
          const hechas = s.preguntas.filter((p) => respondida(p, respuestas[p.id])).length;
          return (
            <li key={s.id} className="flex items-center gap-3 py-2.5">
              <span className="tnum w-7 shrink-0 text-[0.85rem] font-semibold text-ink-3">{s.numero}</span>
              <span className="min-w-0 flex-1 text-[0.95rem] text-ink-2">{s.titulo}</span>
              <span className="tnum text-[0.85rem] text-ink-3">
                {hechas}/{s.preguntas.length}
              </span>
              <button type="button" onClick={() => irA(i + 1)} className="rounded-full px-3 py-1 text-[0.85rem] font-semibold text-cobalt-ink hover:bg-ice-3">
                Editar
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[0.9rem] leading-relaxed text-ink-3">
        Al enviar, IONOS HUB recibe tus respuestas para preparar tu propuesta.{' '}
        <a href="/politica-de-privacidad" target="_blank" rel="noopener" className="font-semibold text-cobalt-ink underline">
          Cómo tratamos tus datos
        </a>
        .
      </p>
    </div>
  );
}

/* ── Confirmación ──────────────────────────────────────────────────────── */

function Enviado({
  nombre,
  servicio,
  waHref,
  quedan,
  onOtro,
}: {
  nombre: string;
  servicio: Servicio | undefined;
  waHref: string;
  /** Si queda algún servicio sin enviar desde este navegador */
  quedan: boolean;
  onOtro: () => void;
}) {
  const pila = nombre.trim().split(/\s+/)[0];
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    document.getElementById('cuestionario')?.scrollIntoView({ behavior: suave() ? 'smooth' : 'auto', block: 'start' });
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="pop overflow-clip rounded-[1.75rem] border border-line bg-canvas shadow-lift" role="status" aria-live="polite">
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cobalt text-white">
            <span className="absolute inset-0 rounded-full bg-cobalt/40 motion-safe:animate-[ping_1.4s_cubic-bezier(0,0,0.2,1)_2]" aria-hidden="true" />
            <Ico d={ICONOS.check} size={26} className="relative" />
          </span>
          <div>
            <h2 ref={ref} tabIndex={-1} className="display-tight text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-ink outline-none">
              ¡Gracias{pila ? `, ${pila}` : ''}! Recibimos tu cuestionario.
            </h2>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-2">Con tus respuestas preparamos tu propuesta. Esto es lo que sigue:</p>
          </div>
          <ol className="divide-y divide-line-soft rounded-[1rem] border border-line">
            {(servicio?.despues ?? []).map((t, i) => (
              <li key={t} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={`tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-semibold ${
                    i === 0 ? 'bg-cobalt text-white' : 'bg-ice text-cobalt-ink'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[0.98rem] text-ink">{t}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {quedan && (
              <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={onOtro}>
                Cuestionario de otro servicio
                <Ico d={ICONOS.arrow} size={18} />
              </button>
            )}
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full sm:w-auto">
              <Ico d={ICONOS.whatsapp} size={18} />
              ¿Algo más? Escríbenos por WhatsApp
            </a>
          </div>
          {quedan && <p className="-mt-2 text-[0.88rem] text-ink-3">Tus datos ya están: sólo eliges el servicio y respondes sus preguntas.</p>}
        </div>
      </div>
    </div>
  );
}

/* ── Piezas ────────────────────────────────────────────────────────────── */

const CAMPO =
  'rounded-2xl border bg-canvas px-4 py-3.5 text-[1rem] text-ink placeholder:text-ink-3/70 transition-[border-color,box-shadow] duration-300 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/15';
const BIEN = 'border-line hover:border-ice-2';
const MAL = 'border-red-500 ring-4 ring-red-500/10';

/** Trazos del set propio (Icon.astro): 24 de caja, 1.75 de grosor, remates redondos. */
const ICONOS = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  back: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  send: '<path d="M20.5 3.5 3.5 10.7l7.4 2.4 2.4 7.4 7.2-17Z"/><path d="m10.9 13.1 4.6-4.6"/>',
  shield: '<path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2L12 3.5Z"/><path d="m9 12 2 2 4-4.5"/>',
  alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5"/><circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 19.5a7 7 0 0 1 14 0"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
  whatsapp:
    '<path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8.4 19L4 20Z"/><path d="M9.2 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5a6 6 0 0 0 2.9 2.6c.2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.7c.2.1.4.3.4.5v.6c0 .9-.8 1.6-1.7 1.6A7.2 7.2 0 0 1 8.1 10c0-.6.5-1.1 1.1-1.4Z"/>',
} as const;

function Ico({ d, size = 20, className = '' }: { d: string; size?: number; className?: string }): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}
