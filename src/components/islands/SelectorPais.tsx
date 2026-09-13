import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { paises, buscarPaises, bandera, paisPorIso, type Pais } from '../../data/paises';

/**
 * Selector de país para teléfonos: los 245 países que reconoce libphonenumber, con bandera,
 * búsqueda por nombre, prefijo o código ISO, y manejo completo por teclado.
 *
 * Las banderas son emoji (dos indicadores regionales), no imágenes: cero peticiones. Windows no trae
 * glifos de bandera, así que `global.css` declara la tipografía Twemoji Country Flags y la aplica a
 * `.bandera`; en el resto de sistemas se ve la del propio sistema.
 *
 * Es un combobox según el patrón de ARIA: botón que abre, campo de búsqueda dentro y lista de
 * opciones con `aria-activedescendant`.
 */

interface Props {
  valor: string;
  onChange: (iso: string) => void;
  /** Se marca en rojo cuando el teléfono de al lado tiene error */
  invalido?: boolean;
}

export default function SelectorPais({ valor, onChange, invalido = false }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [resaltado, setResaltado] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const id = useId();

  const elegido = paisPorIso(valor) ?? paises[0];
  const resultados = useMemo(() => buscarPaises(consulta), [consulta]);

  // Al abrir: foco en la búsqueda y el país actual resaltado.
  useEffect(() => {
    if (!abierto) return;
    campo.current?.focus();
    const i = resultados.findIndex((p) => p.iso === valor);
    setResaltado(i >= 0 ? i : 0);
  }, [abierto]);

  // La opción resaltada siempre visible dentro de la lista.
  useEffect(() => {
    if (!abierto) return;
    lista.current?.querySelector(`[data-i="${resaltado}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [resaltado, abierto]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) cerrar();
    };
    document.addEventListener('mousedown', fuera);
    return () => document.removeEventListener('mousedown', fuera);
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    setConsulta('');
  };

  const elegir = (pais: Pais) => {
    onChange(pais.iso);
    cerrar();
  };

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!resultados.length) return;
      const paso = e.key === 'ArrowDown' ? 1 : -1;
      setResaltado((i) => (i + paso + resultados.length) % resultados.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pais = resultados[resaltado];
      if (pais) elegir(pais);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cerrar();
    } else if (e.key === 'Tab') {
      cerrar();
    }
  };

  return (
    <div ref={raiz} className="relative shrink-0">
      <button
        type="button"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={`${id}-lista`}
        aria-label={`País: ${elegido.nombre} (${elegido.prefijo})`}
        className={`flex h-[3.3rem] w-[7.5rem] items-center gap-2 rounded-2xl border bg-canvas px-3 text-left transition-[border-color,box-shadow] duration-300 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/15 ${
          invalido ? 'border-red-500 ring-4 ring-red-500/10' : 'border-line hover:border-ice-2'
        }`}
      >
        <span className="bandera text-[1.15rem] leading-none" aria-hidden="true">
          {bandera(elegido.iso)}
        </span>
        <span className="tnum min-w-0 flex-1 truncate text-[0.98rem] text-ink">{elegido.prefijo}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-ink-3 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute left-0 top-[calc(100%+0.4rem)] z-30 w-[19rem] max-w-[80vw] overflow-hidden rounded-[1.25rem] border border-line bg-canvas shadow-lift">
          <div className="border-b border-line-soft p-2">
            <input
              ref={campo}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${id}-lista`}
              aria-activedescendant={resultados[resaltado] ? `${id}-op-${resultados[resaltado].iso}` : undefined}
              autoComplete="off"
              placeholder="Busca país o prefijo…"
              value={consulta}
              onChange={(e) => {
                setConsulta(e.target.value);
                setResaltado(0);
              }}
              onKeyDown={teclas}
              className="w-full rounded-xl bg-ice-3 px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-3/70 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            />
          </div>

          <ul ref={lista} id={`${id}-lista`} role="listbox" aria-label="Países" className="max-h-64 overflow-y-auto py-1">
            {resultados.map((p, i) => (
              <li key={p.iso}>
                <button
                  type="button"
                  id={`${id}-op-${p.iso}`}
                  data-i={i}
                  role="option"
                  aria-selected={p.iso === valor}
                  onMouseEnter={() => setResaltado(i)}
                  onClick={() => elegir(p)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.95rem] transition-colors ${
                    i === resaltado ? 'bg-ice' : ''
                  } ${p.iso === valor ? 'font-semibold text-cobalt-ink' : 'text-ink'}`}
                >
                  <span className="bandera text-[1.15rem] leading-none" aria-hidden="true">
                    {bandera(p.iso)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p.nombre}</span>
                  <span className="tnum shrink-0 text-[0.88rem] text-ink-3">{p.prefijo}</span>
                </button>
              </li>
            ))}
            {resultados.length === 0 && (
              <li className="px-3 py-6 text-center text-[0.9rem] text-ink-3">Ningún país con ese nombre o prefijo.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
