/**
 * Servidor del cuestionario de página web (`/api/cuestionario`): limpia lo que llega del navegador contra
 * `data/cuestionario.ts` y lo convierte en el Markdown que n8n entrega a Claude para escribir el PRD.
 *
 * Nada de lo que manda el navegador se confía: textos recortados, opciones que no existen descartadas,
 * máximos y opciones excluyentes reaplicados. El Markdown cita las respuestas abiertas como bloque (`>`)
 * para que un «#» escrito por el cliente no rompa la estructura del documento.
 */
import {
  DATOS,
  SECCIONES,
  type DatosCliente,
  type Pregunta,
  type Respuesta,
  type RespuestaUnica,
  type RespuestaVarias,
  type Respuestas,
} from '../data/cuestionario';

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

export function limpiarCuestionario(datosCrudos: unknown, respuestasCrudas: unknown): CuestionarioLimpio {
  const d = objeto(datosCrudos);
  const datos = Object.fromEntries(DATOS.map((c) => [c.id, linea(d[c.id], 140)])) as unknown as DatosCliente;

  const faltan: string[] = [];
  if (datos.negocio.length < 2) faltan.push('nombre del negocio');
  if (datos.nombre.length < 3) faltan.push('tu nombre');
  if (datos.whatsapp.replace(/\D/g, '').length < 7) faltan.push('WhatsApp');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) faltan.push('correo');

  const r = objeto(respuestasCrudas);
  const respuestas: Respuestas = {};
  for (const p of SECCIONES.flatMap((s) => s.preguntas)) {
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

export function cuestionarioAMarkdown({ datos, respuestas }: CuestionarioLimpio, enviado = new Date()): string {
  const partes: string[] = [];

  partes.push(
    [
      '## Tus datos',
      '',
      '| Dato | Respuesta |',
      '| --- | --- |',
      ...DATOS.map((c) => `| ${c.titulo} | ${celda(datos[c.id] || '—')} |`),
      `| Fecha | ${fechaEcuador(enviado)} |`,
    ].join('\n'),
  );

  for (const s of SECCIONES) {
    partes.push(`## ${s.numero} · ${s.titulo}`);
    for (const p of s.preguntas) {
      partes.push(`### ${p.n}. ${p.titulo}${p.importante ? ' ★' : ''}\n\n${respuestaMd(p, respuestas[p.id])}`);
    }
  }
  return partes.join('\n\n');
}
