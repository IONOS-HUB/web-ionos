/**
 * Webinars de IonosHub. Cada edición es un objeto de este archivo: no hay CMS ni base de datos.
 * Para publicar uno nuevo se copia el último, se cambian los campos y se despliega (ver docs/WEBINARS.md
 * o la skill /webinar). El estado (próximo o edición anterior) se deduce de la fecha, nunca se escribe.
 *
 * Regla del proyecto: nada inventado. Si un dato no está confirmado (una persona ponente, una cifra de
 * asistentes), se deja fuera; el diseño funciona sin él.
 */

export interface WebinarSession {
  /** "Sesión 1", "Bloque 2"… */
  label: string;
  title: string;
  /** Organización a cargo */
  host: string;
  /** Persona ponente, sólo si está confirmada */
  speaker?: string;
  /** Una frase de lo que se ve en esa sesión */
  detail?: string;
}

export interface Webinar {
  slug: string;
  /** Número de edición, para el histórico */
  edition: number;
  title: string;
  /** Una línea que remata el título */
  tagline: string;
  /** Dos o tres frases: índice, buscadores y redes */
  summary: string;
  /** Inicio en ISO con zona horaria, p. ej. 2026-09-24T19:00:00-05:00 */
  startsAt: string;
  /** Cómo se muestra la zona al lector */
  timezone: string;
  durationLabel?: string;
  /** Organizaciones que lo dan */
  hosts: string[];
  format: string;
  price: string;
  /** Etiquetas para filtrar en el índice */
  topics: string[];
  /** Para quién es */
  audience: string[];
  /** Qué se lleva quien asiste */
  takeaways: string[];
  sessions: WebinarSession[];
  /** Comunidad de WhatsApp donde se manda el enlace de acceso */
  whatsappCommunity?: string;
  /** Con false, la página muestra el evento sin formulario */
  registrationOpen: boolean;
  /** Sólo para ediciones pasadas */
  recap?: {
    summary: string;
    videoUrl?: string;
  };
  metaTitle: string;
  metaDescription: string;
}

export const webinars: Webinar[] = [
  {
    slug: 'ia-en-tu-trabajo',
    edition: 1,
    title: 'Aprende a usar IA en tu trabajo',
    tagline: 'Dos charlas, un solo registro: primero el marco legal, después la aplicación en tu empresa.',
    summary:
      'Un webinar en dos partes junto a Cyberprevention. Primero, qué dice la ley cuando una empresa usa inteligencia artificial. Después, cómo aplicarla en el día a día de un negocio sin perder de vista la seguridad de la información.',
    startsAt: '2026-09-24T19:00:00-05:00',
    timezone: 'GMT-5 · Ecuador',
    hosts: ['Cyberprevention', 'IonosHub'],
    format: 'En línea y en vivo',
    price: 'Gratuito',
    topics: ['Inteligencia artificial', 'Marco legal', 'Empresas'],
    audience: [
      'Dueños y administradores de pequeñas y medianas empresas',
      'Equipos que ya usan IA sin reglas claras y quieren ordenarlo',
      'Profesionales responsables de datos, cumplimiento o seguridad',
    ],
    takeaways: [
      'Qué exige la ley ecuatoriana cuando tu empresa trata datos con inteligencia artificial',
      'Dónde están los riesgos reales al usar herramientas de IA en el trabajo diario',
      'Por dónde empezar a aplicarla en tu operación sin exponer información del negocio',
    ],
    sessions: [
      {
        label: 'Sesión 1',
        title: 'IA y el marco legal',
        host: 'Cyberprevention',
        detail: 'Qué se puede y qué no cuando una empresa trata datos con inteligencia artificial.',
      },
      {
        label: 'Sesión 2',
        title: 'IA para empresarios',
        host: 'IonosHub',
        detail: 'Cómo llevarla a la operación: atención, automatización y control de la información.',
      },
    ],
    whatsappCommunity: 'https://chat.whatsapp.com/IPTNct7Pli891HPG2b77Zj?mode=gi_t',
    registrationOpen: true,
    metaTitle: 'Webinar gratuito: aprende a usar IA en tu trabajo | IonosHub × Cyberprevention',
    metaDescription:
      'Webinar en línea y gratuito, 24 de septiembre de 2026. Dos charlas: el marco legal de la inteligencia artificial y cómo aplicarla en tu empresa. Organizan Cyberprevention e IonosHub.',
  },
];

/* ── Utilidades ─────────────────────────────────────────────────────────── */

export type WebinarStatus = 'proximo' | 'pasado';

/** El estado sale de la fecha: no hay banderas que se queden desactualizadas. */
export function webinarStatus(webinar: Webinar, now: Date = new Date()): WebinarStatus {
  return new Date(webinar.startsAt).getTime() > now.getTime() ? 'proximo' : 'pasado';
}

export function isUpcoming(webinar: Webinar, now: Date = new Date()): boolean {
  return webinarStatus(webinar, now) === 'proximo';
}

export const getWebinarBySlug = (slug: string) => webinars.find((w) => w.slug === slug);

/** Próximos de antes a después; pasados del más reciente al más antiguo. */
export function sortedWebinars(now: Date = new Date()): { proximos: Webinar[]; pasados: Webinar[] } {
  const proximos = webinars
    .filter((w) => isUpcoming(w, now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const pasados = webinars
    .filter((w) => !isUpcoming(w, now))
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  return { proximos, pasados };
}

/** El que se promociona en el pop-up y en el índice. */
export function nextWebinar(now: Date = new Date()): Webinar | undefined {
  return sortedWebinars(now).proximos[0];
}

/** Temas presentes en los datos, para los filtros del índice. */
export function allTopics(): string[] {
  return [...new Set(webinars.flatMap((w) => w.topics))].sort((a, b) => a.localeCompare(b, 'es'));
}

const GUAYAQUIL = 'America/Guayaquil';

/** "miércoles 24 de septiembre" */
export function formatWebinarDate(startsAt: string, opts: { weekday?: boolean; year?: boolean } = {}): string {
  return new Intl.DateTimeFormat('es-EC', {
    timeZone: GUAYAQUIL,
    weekday: opts.weekday === false ? undefined : 'long',
    day: 'numeric',
    month: 'long',
    year: opts.year ? 'numeric' : undefined,
  }).format(new Date(startsAt));
}

/** "19:00" */
export function formatWebinarTime(startsAt: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    timeZone: GUAYAQUIL,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(startsAt));
}

/** Fecha corta para tarjetas: "24 sep 2026" */
export function formatWebinarShort(startsAt: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    timeZone: GUAYAQUIL,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(startsAt))
    .replace('.', '');
}
