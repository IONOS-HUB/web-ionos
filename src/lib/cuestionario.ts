/**
 * Servidor de los cuestionarios para clientes (`/api/cuestionario`): limpia lo que llega del navegador contra
 * el cuestionario del servicio (`data/cuestionarios/`), lo convierte en el Markdown que n8n entrega a Claude
 * y busca en GoHighLevel, vía n8n, al contacto del enlace personal (`?c=`).
 *
 * Nada de lo que manda el navegador se confía: textos recortados, opciones que no existen descartadas,
 * máximos y opciones excluyentes reaplicados. El Markdown cita las respuestas abiertas como bloque (`>`)
 * para que un «#» escrito por el cliente no rompa la estructura del documento.
 */
import {
  DATOS,
  servicioDeInteres,
  type DatosCliente,
  type Pregunta,
  type Respuesta,
  type RespuestaUnica,
  type RespuestaVarias,
  type Respuestas,
  type Servicio,
  type ServicioId,
} from '../data/cuestionarios';
import { PAIS_POR_DEFECTO, paises } from '../data/paises';
import { readEnv } from './lead';

const MAX_TEXTO = 4000;
const MAX_CORTO = 300;

const texto = (valor: unknown, max: number) =>
  String(valor ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
const linea = (valor: unknown, max = MAX_CORTO) => texto(valor, max).replace(/\s+/g, ' ');
const objeto = (valor: unknown): Record<string, unknown> =>
  valor && typeof valor === 'object' && !Array.isArray(valor) ? (valor as Record<string, unknown>) : {};

export interface CuestionarioLimpio {
  datos: DatosCliente;
  respuestas: Respuestas;
  /** Campos obligatorios de «Tus datos» que faltan o no son válidos */
  faltan: string[];
}

function limpiarRespuesta(p: Pregunta, crudo: unknown): Respuesta | undefined {
  switch (p.tipo) {
    case 'texto': {
      const t = texto(crudo, MAX_TEXTO);
      return t || undefined;
    }
    case 'unica': {
      const r = objeto(crudo);
      const opcion = p.opciones.find((o) => o.valor === r.valor);
      if (!opcion) return undefined;
      const detalle = opcion.detalle ? linea(r.detalle) : '';
      return detalle ? { valor: opcion.valor, detalle } : { valor: opcion.valor };
    }
    case 'varias': {
      const r = objeto(crudo);
      const pedidos = Array.isArray(r.valores) ? r.valores.map(String) : [];
      // En el orden del cuestionario, sin repetidos ni opciones inventadas.
      let valores = p.opciones.map((o) => o.valor).filter((v) => pedidos.includes(v));
      if (p.ninguna && valores.length > 1) valores = valores.filter((v) => v !== p.ninguna);
      if (p.max) valores = valores.slice(0, p.max);
      if (!valores.length) return undefined;
      const crudos = objeto(r.detalles);
      const detalles: Record<string, string> = {};
      for (const o of p.opciones) {
        if (o.detalle && valores.includes(o.valor)) {
          const d = linea(crudos[o.valor]);
          if (d) detalles[o.valor] = d;
        }
      }
      return Object.keys(detalles).length ? { valores, detalles } : { valores };
    }
    case 'tabla': {
      const filas = (Array.isArray(crudo) ? crudo : [])
        .slice(0, p.maxFilas)
        .map((fila) => {
          const f = objeto(fila);
          return Object.fromEntries(p.columnas.map((c) => [c.id, linea(f[c.id], 400)]));
        })
        .filter((fila) => Object.values(fila).some(Boolean));
      return filas.length ? filas : undefined;
    }
    case 'campos': {
      const r = objeto(crudo);
      const campos = Object.fromEntries(p.campos.map((c) => [c.id, linea(r[c.id])]).filter(([, v]) => v));
      return Object.keys(campos).length ? campos : undefined;
    }
  }
}

export function limpiarCuestionario(servicio: Servicio, datosCrudos: unknown, respuestasCrudas: unknown): CuestionarioLimpio {
  const d = objeto(datosCrudos);
  const datos = Object.fromEntries(DATOS.map((c) => [c.id, linea(d[c.id], 140)])) as unknown as DatosCliente;

  const faltan: string[] = [];
  if (datos.negocio.length < 2) faltan.push('nombre del negocio');
  if (datos.nombre.length < 3) faltan.push('tu nombre');
  if (datos.whatsapp.replace(/\D/g, '').length < 7) faltan.push('WhatsApp');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) faltan.push('correo');

  const r = objeto(respuestasCrudas);
  const respuestas: Respuestas = {};
  for (const p of servicio.secciones.flatMap((s) => s.preguntas)) {
    const limpia = limpiarRespuesta(p, r[p.id]);
    if (limpia !== undefined) respuestas[p.id] = limpia;
  }
  return { datos, respuestas, faltan };
}

/* ── Markdown ───────────────────────────────────────────────────────────── */

const celda = (v: string) => v.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ') || ' ';
const cita = (v: string) =>
  v
    .split('\n')
    .map((l) => (l.trim() ? `> ${l}` : '>'))
    .join('\n');
const SIN_RESPUESTA = '_Sin respuesta_';

function respuestaMd(p: Pregunta, r: Respuesta | undefined): string {
  if (r === undefined) return SIN_RESPUESTA;
  switch (p.tipo) {
    case 'texto':
      return cita(r as string);
    case 'unica': {
      const u = r as RespuestaUnica;
      return `- ${u.valor}${u.detalle ? `: ${u.detalle}` : ''}`;
    }
    case 'varias': {
      const v = r as RespuestaVarias;
      const lista = v.valores.map((x) => `- ${x}${v.detalles?.[x] ? `: ${v.detalles[x]}` : ''}`).join('\n');
      return p.max ? `${lista}\n\n_(${v.valores.length} de máximo ${p.max})_` : lista;
    }
    case 'tabla': {
      const filas = r as Record<string, string>[];
      return [
        `| # | ${p.columnas.map((c) => c.titulo).join(' | ')} |`,
        `| --- | ${p.columnas.map(() => '---').join(' | ')} |`,
        ...filas.map((f, i) => `| ${i + 1} | ${p.columnas.map((c) => celda(f[c.id] ?? '')).join(' | ')} |`),
      ].join('\n');
    }
    case 'campos': {
      const c = r as Record<string, string>;
      return p.campos.map((campo) => `- **${campo.titulo}:** ${c[campo.id] || '—'}`).join('\n');
    }
  }
}

/** Fecha legible en hora de Ecuador: «22 de octubre de 2026, 13:34». */
export function fechaEcuador(fecha = new Date()): string {
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'long', timeStyle: 'short', hourCycle: 'h23', timeZone: 'America/Guayaquil' }).format(fecha);
}

export function cuestionarioAMarkdown(servicio: Servicio, { datos, respuestas }: CuestionarioLimpio, enviado = new Date()): string {
  const partes: string[] = [];

  partes.push(
    [
      '## Tus datos',
      '',
      '| Dato | Respuesta |',
      '| --- | --- |',
      `| Servicio | ${servicio.nombre} |`,
      ...DATOS.map((c) => `| ${c.titulo} | ${celda(datos[c.id] || '—')} |`),
      `| Fecha | ${fechaEcuador(enviado)} |`,
    ].join('\n'),
  );

  for (const s of servicio.secciones) {
    partes.push(`## ${s.numero} · ${s.titulo}`);
    for (const p of s.preguntas) {
      partes.push(`### ${p.n}. ${p.titulo}${p.importante ? ' ★' : ''}\n\n${respuestaMd(p, respuestas[p.id])}`);
    }
  }
  return partes.join('\n\n');
}

/* ── Contacto de GoHighLevel (enlace personal `?c=`) ───────────────────── */

/** Lo que sabe el CRM del contacto. `datos` va al navegador; `contexto` sólo viaja de aquí a n8n. */
export interface ContactoCrm {
  datos: DatosCliente & { pais: string };
  servicio?: ServicioId;
  contexto: Record<string, string>;
}

/** Los ID de contacto de GHL son 20 caracteres alfanuméricos; se deja margen sin aceptar nada raro. */
export const idContactoValido = (id: unknown): id is string => typeof id === 'string' && /^[A-Za-z0-9]{12,40}$/.test(id);

/** `+593960638900` → `{ pais: 'EC', numero: '960638900' }`. Con prefijos compartidos (+1) gana EC o US. */
export function separarTelefono(telefono: string): { pais: string; numero: string } {
  const digitos = telefono.replace(/\D/g, '');
  if (!telefono.trim().startsWith('+')) return { pais: PAIS_POR_DEFECTO, numero: digitos };
  const prefijo = (iso: string) => paises.find((p) => p.iso === iso)?.prefijo.replace(/\D/g, '') ?? '';
  const candidatos = paises.filter((p) => digitos.startsWith(p.prefijo.replace(/\D/g, '')));
  if (!candidatos.length) return { pais: PAIS_POR_DEFECTO, numero: digitos };
  const largo = Math.max(...candidatos.map((p) => p.prefijo.length));
  const mejores = candidatos.filter((p) => p.prefijo.length === largo);
  const pais = (mejores.find((p) => p.iso === PAIS_POR_DEFECTO) ?? mejores.find((p) => p.iso === 'US') ?? mejores[0]).iso;
  return { pais, numero: digitos.slice(prefijo(pais).length) };
}

/** URL del flujo de n8n que lee el contacto. Si no se configura, se deduce de la del cuestionario. */
function urlContacto(): string | undefined {
  const propia = readEnv('CUESTIONARIO_CONTACTO_URL');
  if (propia) return propia;
  const envio = readEnv('CUESTIONARIO_WEBHOOK_URL');
  return envio && /\/cuestionario-web\/?$/.test(envio) ? envio.replace(/\/cuestionario-web\/?$/, '/cuestionario-contacto') : undefined;
}

const DEMO = {
  negocio: 'Clínica Dental Sonríe',
  nombre: 'Andrés Paredes',
  whatsapp: '+593987654321',
  correo: 'andres@sonrie.ec',
  ciudad: 'Otavalo',
  interes: 'Software a medida',
  contexto: { sector: 'Odontología', reto: 'Demostración: contacto ficticio de desarrollo' },
};

/**
 * Busca al contacto en GHL a través de n8n. `null` si no existe (o el ID es de otra cuenta); lanza si n8n
 * no responde, para que la página diga «inténtalo de nuevo» en vez de «tu enlace no vale».
 * En desarrollo, sin URL configurada, devuelve un contacto ficticio para poder probar el flujo.
 */
export async function buscarContacto(id: string): Promise<ContactoCrm | null> {
  if (!idContactoValido(id)) return null;
  const url = urlContacto();
  let c: Record<string, unknown>;
  if (!url) {
    if (!import.meta.env.DEV) throw new Error('Sin CUESTIONARIO_WEBHOOK_URL: no se puede leer el contacto');
    console.warn('[cuestionario] Sin URL de contacto: en desarrollo se usa un contacto ficticio.');
    c = DEMO;
  } else {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ionos-key': readEnv('CUESTIONARIO_WEBHOOK_KEY') ?? '' },
      body: JSON.stringify({ contactId: id }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`n8n respondió ${res.status} al buscar el contacto`);
    const cuerpo = objeto(await res.json());
    if (cuerpo.ok !== true) return null;
    c = objeto(cuerpo.contacto);
  }

  const telefono = separarTelefono(linea(c.whatsapp, 40));
  const contexto = Object.fromEntries(
    Object.entries(objeto(c.contexto))
      .map(([k, v]) => [k.slice(0, 40), texto(v, 2000)])
      .filter(([, v]) => v),
  );
  const interes = linea(c.interes, 120);
  if (interes) contexto.interes = interes;
  return {
    datos: {
      negocio: linea(c.negocio, 140),
      nombre: linea(c.nombre, 140),
      cargo: '',
      whatsapp: telefono.numero,
      pais: telefono.pais,
      correo: linea(c.correo, 140),
      ciudad: linea(c.ciudad, 140),
    },
    servicio: servicioDeInteres(interes),
    contexto,
  };
}

/** Lo que el CRM sabe del contacto, como lista para el prompt de n8n (no es texto del cliente). */
export function contextoCrmMarkdown(contexto: Record<string, string>): string {
  const NOMBRES: Record<string, string> = {
    interes: 'Interés principal',
    sector: 'Sector',
    reto: 'Reto que contó',
    campana: 'Campaña de origen',
    resumen_ia: 'Resumen de la conversación con IONIC',
  };
  return Object.entries(contexto)
    .map(([k, v]) => `- **${NOMBRES[k] ?? k}:** ${v.replace(/\s*\n\s*/g, ' ')}`)
    .join('\n');
}
