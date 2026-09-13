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
  /** Cargo o especialidad de quien expone */
  speakerRole?: string;
  /** Quien modera la sesión */
  moderator?: string;
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
  /**
   * Cartel del pop-up de promoción. Cuadrado (1080×1080) o vertical 4:5 (1080×1350), WebP y por
   * debajo de 300 KB. Deja el texto importante en el 80 % central: en pantallas bajas la imagen se
   * recorta por arriba y por abajo. Sin esta propiedad, el pop-up sale en versión de sólo texto.
   */
  promoImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** Logos de quien organiza. Sin esto, la página los nombra sólo con texto. */
  organizerLogos?: { src: string; alt: string; width: number; height: number }[];
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
    title: 'Derecho e inteligencia artificial, y Claude para empresarios',
    tagline: 'Dos ponencias académicas en una tarde: primero los desafíos legales, después la IA aplicada al negocio.',
    summary:
      'Webinar académico en modalidad virtual, organizado por Academia Debate & Sociedad, IonosHub y Cyberprevention. Dos ponencias con sus moderadores: los nuevos desafíos que la inteligencia artificial plantea al derecho, y cómo un empresario puede usar Claude en su operación.',
    startsAt: '2026-09-24T19:00:00-05:00',
    timezone: 'GMT-5 · Ecuador',
    hosts: ['Academia Debate & Sociedad', 'IonosHub', 'Cyberprevention'],
    format: 'Webinar académico, en vivo por YouTube',
    price: 'Gratuito',
    topics: ['Inteligencia artificial', 'Derecho', 'Empresas'],
    audience: [
      'Abogados y estudiantes de derecho que ven llegar la IA a su profesión',
      'Dueños y administradores de empresas que quieren usar IA sin meterse en problemas',
      'Profesionales responsables de datos, cumplimiento o seguridad de la información',
    ],
    takeaways: [
      'Qué desafíos plantea la inteligencia artificial al derecho y dónde están hoy los vacíos',
      'Qué puede hacer un empresario con Claude en el trabajo diario de su negocio',
      'Cómo adoptar estas herramientas sin exponer la información de la empresa',
    ],
    sessions: [
      {
        label: 'Ponencia 1',
        title: 'Derecho e inteligencia artificial: nuevos desafíos',
        host: 'Academia Debate & Sociedad',
        speaker: 'Luis Alejandro Vásquez',
        speakerRole: 'Abogado en Constitucional y Digital',
        moderator: 'Tomás Alvarado',
      },
      {
        label: 'Ponencia 2',
        title: 'Claude para empresarios: nuevos desafíos',
        host: 'IonosHub',
        speaker: 'Cristhian Recalde',
        speakerRole: 'Ing. en Tecnologías de la Información',
        moderator: 'Santiago Guerra',
      },
    ],
    /**
     * Arte de la primera ponencia, recortado por encima del bloque de fecha: el original lleva
     * impresa la fecha antigua (15 de septiembre) y el aviso muestra la buena justo debajo, así que
     * verlas juntas confundiría. Cuando llegue el arte corregido, se apunta aquí el archivo entero.
     */
    promoImage: {
      src: '/imgs/webinars/derecho-e-ia-popup.jpg',
      alt: 'Arte del webinar "Derecho e inteligencia artificial: nuevos desafíos", con el abogado Luis Alejandro Vásquez',
      width: 1080,
      height: 840,
    },
    organizerLogos: [
      { src: '/imgs/webinars/academia-debate-sociedad.png', alt: 'Academia Debate & Sociedad', width: 1024, height: 335 },
      { src: '/imgs/logo.webp', alt: 'IonosHub', width: 320, height: 97 },
      { src: '/imgs/webinars/cyberprevention.jpg', alt: 'Cyberprevention', width: 518, height: 518 },
    ],
    whatsappCommunity: 'https://chat.whatsapp.com/IPTNct7Pli891HPG2b77Zj?mode=gi_t',
    registrationOpen: true,
    metaTitle: 'Webinar gratuito: derecho e IA, y Claude para empresarios | 24 de septiembre',
    metaDescription:
      'Webinar académico gratuito y virtual, 24 de septiembre de 2026 a las 19:00. Dos ponencias: los nuevos desafíos del derecho ante la inteligencia artificial, con Luis Alejandro Vásquez, y Claude para empresarios, con Cristhian Recalde. Organizan Academia Debate & Sociedad, IonosHub y Cyberprevention.',
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
