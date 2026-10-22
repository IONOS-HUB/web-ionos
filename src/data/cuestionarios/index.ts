/**
 * Cuestionarios para clientes (`/cuestionario`): uno por servicio. De aquí salen el formulario por pasos
 * (`islands/Cuestionario.tsx`), la validación del servidor y el Markdown que recibe n8n
 * (`lib/cuestionario.ts`). Cambiar una pregunta = cambiarla en el archivo de su servicio; el PRD se ajusta solo.
 *
 * Un servicio nuevo = un archivo con su objeto `Servicio` + una línea en `SERVICIOS` + su prompt y su carpeta
 * de Drive en n8n (docs/CUESTIONARIOS.md). El `id` viaja en la URL (`?s=`), en el borrador del navegador y a
 * n8n: no lo cambies sin actualizar los tres.
 */
import { crm } from './crm';
import { ia } from './ia';
import { marketing } from './marketing';
import { software } from './software';
import type { Campo, DatosCliente, Servicio, ServicioId } from './tipos';
import { web } from './web';

export * from './tipos';

/** En el orden del desplegable. */
export const SERVICIOS: Servicio[] = [web, software, marketing, crm, ia];

export const servicioPorId = (id: unknown): Servicio | undefined => SERVICIOS.find((s) => s.id === id);

/** Portada cuando todavía no se sabe el servicio (enlace genérico, sin `?s=` ni contacto clasificado). */
export const GENERAL = {
  titulo: 'Cuestionario para tu proyecto',
  lead: 'Cuéntanos tu idea con tus propias palabras. Nosotros nos encargamos de la parte técnica.',
  queEs:
    'Antes de proponerte algo necesitamos conocer bien tu negocio y lo que esperas lograr. Primero eliges el servicio que te interesa y después te hacemos las preguntas de ese servicio.',
  minutos: '15 y 30',
} as const;

/** «Cómo llenarlo»: igual para todos los servicios; el tiempo sale de cada uno. */
export const comoLlenarlo = (minutos: string) => [
  'No hay respuestas correctas ni incorrectas. Escribe como hablas.',
  'Si no sabes algo, déjalo en blanco o escribe «no sé». Lo conversamos después.',
  'Las preguntas con ★ son las más importantes. Si tienes poco tiempo, empieza por esas.',
  'Tus respuestas se guardan en este navegador mientras avanzas: puedes cerrar y seguir después.',
  `Te tomará entre ${minutos} minutos.`,
];

/** «Tus datos»: el primer paso, común a todos los servicios y el único con obligatorios. */
export const DATOS: (Campo & { id: keyof DatosCliente; requerido?: boolean })[] = [
  { id: 'negocio', titulo: 'Nombre del negocio', placeholder: 'Panadería La Esquina', autocomplete: 'organization', requerido: true },
  { id: 'nombre', titulo: 'Tu nombre', placeholder: 'Nombre y apellido', autocomplete: 'name', requerido: true },
  { id: 'cargo', titulo: 'Cargo', placeholder: 'Dueña, gerente, encargado de marketing…', autocomplete: 'organization-title' },
  { id: 'whatsapp', titulo: 'WhatsApp', tipo: 'tel', autocomplete: 'tel-national', requerido: true },
  { id: 'correo', titulo: 'Correo electrónico', tipo: 'email', placeholder: 'tu@negocio.com', autocomplete: 'email', requerido: true },
  { id: 'ciudad', titulo: 'Ciudad', placeholder: 'Ibarra', autocomplete: 'address-level2' },
];

/**
 * Servicio a partir del campo «Interés principal» del contacto en GoHighLevel. «Todo el ecosistema» y «Aún no
 * lo sabe» no eligen nada: la persona lo escoge en el desplegable.
 */
export function servicioDeInteres(interes: unknown): ServicioId | undefined {
  const t = String(interes ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (!t) return undefined;
  if (/\bionic\b|agente|\bia\b|inteligencia artificial|voz/.test(t)) return 'ia';
  if (/\bcrm\b|automatiz/.test(t)) return 'crm';
  if (/software|\bsistema/.test(t)) return 'software';
  if (/marketing|pauta|publicidad|anuncio/.test(t)) return 'marketing';
  if (/pagina|landing|\bweb\b|sitio/.test(t)) return 'web';
  return undefined;
}
