/**
 * Tipos de los cuestionarios para clientes (`/cuestionario`). Cada servicio es un objeto `Servicio` en su
 * propio archivo de esta carpeta; `index.ts` los reúne. Los valores de las opciones son el texto que se ve:
 * así llegan legibles al Markdown y a Claude. `importante` es la ★: se recomienda, no se exige.
 */

export interface Opcion {
  valor: string;
  /** Texto de apoyo bajo la opción */
  nota?: string;
  /** Si se elige, pide un dato más (el texto es el placeholder del campo) */
  detalle?: string;
}

export interface Campo {
  id: string;
  titulo: string;
  tipo?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  autocomplete?: string;
}

interface Base {
  id: string;
  /** Número de la pregunta dentro de su cuestionario (lo pone `numerar`) */
  n: number;
  titulo: string;
  ayuda?: string;
  importante?: boolean;
}

export type Pregunta =
  | (Base & {
      tipo: 'texto';
      placeholder?: string;
      /** Botones que copian al campo lo que la persona ya escribió en otra pregunta (id de una tabla) */
      sugerirDe?: string;
    })
  | (Base & { tipo: 'unica'; opciones: Opcion[] })
  | (Base & {
      tipo: 'varias';
      opciones: Opcion[];
      max?: number;
      /** Opción que excluye a las demás («Ninguna por ahora») */
      ninguna?: string;
    })
  | (Base & {
      tipo: 'tabla';
      columnas: { id: string; titulo: string; placeholder?: string }[];
      filas: number;
      maxFilas: number;
      agregar: string;
      /** Nombre de cada fila en móvil: «Producto 1», «Página 2»… */
      fila: string;
    })
  | (Base & {
      tipo: 'campos';
      campos: Campo[];
      /** Ofrece copiar estos datos desde «Tus datos»: id del campo propio → id del dato */
      copiarDeDatos?: Record<string, keyof DatosCliente>;
    });

export interface Seccion {
  id: string;
  numero: string;
  titulo: string;
  porque: string;
  preguntas: Pregunta[];
}

export interface DatosCliente {
  negocio: string;
  nombre: string;
  cargo: string;
  whatsapp: string;
  correo: string;
  ciudad: string;
}

export type ServicioId = 'web' | 'software' | 'marketing' | 'crm' | 'ia';

export interface Servicio {
  id: ServicioId;
  /** En el desplegable, el asunto del correo y el Markdown */
  nombre: string;
  /** Una línea bajo el desplegable cuando está elegido */
  descripcion: string;
  /** Nombre del documento en Drive: «… · PRD página web.md» */
  documento: string;
  titulo: string;
  lead: string;
  queEs: string;
  /** «20 y 30» → «Te tomará entre 20 y 30 minutos» */
  minutos: string;
  glosario: { termino: string; definicion: string }[];
  /** Los pasos que se le cuentan al cliente al enviar */
  despues: string[];
  secciones: Seccion[];
}

/** Respuesta guardada por tipo de pregunta. */
export type RespuestaUnica = { valor: string; detalle?: string };
export type RespuestaVarias = { valores: string[]; detalles?: Record<string, string> };
export type Respuesta = string | RespuestaUnica | RespuestaVarias | Record<string, string>[] | Record<string, string>;
export type Respuestas = Record<string, Respuesta>;

/* ── Numeración ─────────────────────────────────────────────────────────── */

type SinNumero<T> = T extends unknown ? Omit<T, 'n'> : never;
export type SeccionBorrador = Omit<Seccion, 'numero' | 'preguntas'> & { preguntas: SinNumero<Pregunta>[] };

/** Numera secciones («01», «02»…) y preguntas (1, 2… seguidas en todo el cuestionario). */
export function numerar(secciones: SeccionBorrador[]): Seccion[] {
  let n = 0;
  return secciones.map((s, i) => ({
    ...s,
    numero: String(i + 1).padStart(2, '0'),
    preguntas: s.preguntas.map((p) => ({ ...p, n: ++n }) as Pregunta),
  }));
}

/** Si una respuesta tiene contenido (para el avance y el resumen antes de enviar). */
export function respondida(p: Pregunta, r: Respuesta | undefined): boolean {
  if (r == null) return false;
  switch (p.tipo) {
    case 'texto':
      return typeof r === 'string' && r.trim().length > 0;
    case 'unica':
      return typeof r === 'object' && !Array.isArray(r) && Boolean((r as RespuestaUnica).valor);
    case 'varias':
      return typeof r === 'object' && !Array.isArray(r) && ((r as RespuestaVarias).valores?.length ?? 0) > 0;
    case 'tabla':
      return Array.isArray(r) && r.some((fila) => Object.values(fila).some((v) => String(v).trim()));
    case 'campos':
      return typeof r === 'object' && !Array.isArray(r) && Object.values(r as Record<string, string>).some((v) => String(v).trim());
  }
}
