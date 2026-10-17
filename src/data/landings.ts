import type { NicheId } from './niches';

/**
 * Landings "speed to lead": páginas cuyo único objetivo es el formulario. Una variante = un objeto, y
 * de aquí salen el titular, la pregunta de calificación del formulario, el fondo y la etiqueta con la
 * que el lead llega a GHL (`variante`). Cada variante tiene su propia página en `src/pages/speed-to-lead/`
 * (añadir una variante = un objeto aquí + su archivo de página).
 *
 * - `general` es la versión humanizada: equipo, casos reales, logos y testimonios (si existen).
 * - Las de nicho no llevan testimonios: el léxico, lo que el agente hace y sus líneas rojas salen de
 *   `niches.ts` para no duplicar copy, y el fondo es un video motion (o su versión en CSS).
 *
 * Son sólo para pauta: ningún enlace del sitio apunta a ellas, son `noindex` y no están en el sitemap.
 * Las páginas que posicionan por sector son `/servicios/inteligencia-artificial/<slug>`.
 */

export type LandingId = 'general' | 'instituciones' | 'clinicas';

export interface LandingVariant {
  id: LandingId;
  /** Segmento de URL; vacío para la general (`/speed-to-lead`) */
  slug: string;
  route: string;
  nicheId?: NicheId;
  h1: string;
  /** Segunda línea del h1, pintada en el tono de acento */
  h1Accent: string;
  lead: string;
  /** Tres promesas cortas junto al formulario; nada que no podamos cumplir */
  promises: string[];
  form: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    orgLabel: string;
    orgPlaceholder: string;
    /** Pregunta de calificación propia del sector; viaja a GHL como `calificacion` */
    qualify: { label: string; options: string[] };
    servicioInteres: string;
    cta: string;
  };
  /** Video de fondo en public/videos/landings. Sin archivo, se pinta el fondo motion en CSS. */
  background?: { video?: { mp4?: string; webm?: string }; poster?: string };
  waMessage: string;
  metaTitle: string;
  metaDescription: string;
}

export const landings: LandingVariant[] = [
  {
    id: 'general',
    slug: '',
    route: '/speed-to-lead',
    h1: 'Cuéntanos qué frena a tu negocio.',
    h1Accent: 'Te llama una persona, no un bot.',
    lead: 'Deja tus datos y un cofundador de IonosHub te contacta para agendar un diagnóstico gratuito de 30 minutos. Sales con un plan concreto de IA, automatización o marketing para tu negocio.',
    promises: [
      'Te contactamos en menos de un día hábil',
      'Diagnóstico gratuito, sin compromiso de compra',
      'Lo lleva un cofundador, no un vendedor',
    ],
    form: {
      title: 'Agenda tu diagnóstico gratuito',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Ana Torres',
      orgLabel: 'Tu negocio',
      orgPlaceholder: 'Ferretería El Tornillo',
      qualify: {
        label: '¿Qué te interesa resolver primero?',
        options: [
          'Responder clientes 24/7 con IA',
          'Ordenar mis leads en un CRM',
          'Vender más con pauta y contenido',
          'Un sistema a medida',
          'Aún no lo sé, quiero orientación',
        ],
      },
      servicioInteres: 'Diagnóstico gratuito',
      cta: 'Quiero que me contacten',
    },
    waMessage: 'Hola IonosHub, vengo de su anuncio y quiero agendar un diagnóstico gratuito para mi negocio.',
    metaTitle: 'Agenda tu diagnóstico gratuito | IonosHub',
    metaDescription:
      'Deja tus datos y un cofundador de IonosHub te contacta para un diagnóstico gratuito de IA, automatización y marketing para tu negocio en Ecuador.',
  },
  {
    id: 'instituciones',
    slug: 'instituciones',
    route: '/speed-to-lead/instituciones',
    nicheId: 'institutos',
    h1: 'Tu secretaría, abierta cuando los representantes preguntan.',
    h1Accent: 'Incluso el fin de semana.',
    lead: 'Un agente de IA que informa cupos, horarios y requisitos, acompaña la matrícula y agenda la visita al campus, conectado a tu sistema académico. Déjanos tus datos y te mostramos cómo funcionaría en tu institución.',
    promises: [
      'Demostración con el proceso de matrícula de tu institución',
      'Nunca da notas ni datos de un menor por chat',
      'Conectado a tu sistema académico y tu CRM de admisiones',
    ],
    form: {
      title: 'Solicita la demostración para tu institución',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'María Pozo',
      orgLabel: 'Institución',
      orgPlaceholder: 'Instituto Superior Ibarra',
      qualify: {
        label: 'Tipo de institución',
        options: ['Instituto o universidad', 'Colegio o unidad educativa', 'Academia o centro de idiomas', 'Escuela de formación o cursos', 'Otra'],
      },
      servicioInteres: 'Agente de IA para instituciones educativas',
      cta: 'Solicitar demostración',
    },
    background: {
      video: { mp4: '/videos/landings/instituciones.mp4', webm: '/videos/landings/instituciones.webm' },
      poster: '/videos/landings/instituciones.webp',
    },
    waMessage:
      'Hola IonosHub, tengo una institución educativa y quiero una IA que atienda las consultas de matrícula. Quiero agendar una demostración.',
    metaTitle: 'IA para la matrícula de tu institución | IonosHub',
    metaDescription:
      'Agente de IA que responde cupos, horarios y requisitos 24/7, acompaña la matrícula y agenda visitas. Solicita una demostración para tu institución.',
  },
  {
    id: 'clinicas',
    slug: 'clinicas',
    route: '/speed-to-lead/clinicas',
    nicheId: 'clinicas',
    h1: 'Ninguna llamada de un paciente sin contestar.',
    h1Accent: 'Ni a las once de la noche.',
    lead: 'Una IA de voz y de WhatsApp que agenda en la agenda real del especialista, confirma el día antes y recibe la orden del paciente. Sin diagnosticar nunca. Déjanos tus datos y te mostramos cómo sonaría en tu consultorio.',
    promises: [
      'Demostración con la agenda de tu consultorio',
      'No diagnostica, no receta, no comparte datos del paciente',
      'Conectada a tu agenda, tu CRM o tu historia clínica',
    ],
    form: {
      title: 'Solicita la demostración para tu clínica',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Dra. Andrea Vaca',
      orgLabel: 'Clínica o consultorio',
      orgPlaceholder: 'Centro Médico Santa Elena',
      qualify: {
        label: '¿Cuántos especialistas atienden?',
        options: ['Sólo yo', '2 a 5', '6 a 15', 'Más de 15'],
      },
      servicioInteres: 'IA de voz y WhatsApp para clínicas',
      cta: 'Solicitar demostración',
    },
    background: {
      video: { mp4: '/videos/landings/clinicas.mp4', webm: '/videos/landings/clinicas.webm' },
      poster: '/videos/landings/clinicas.webp',
    },
    waMessage:
      'Hola IonosHub, tengo una clínica y quiero una IA que conteste las llamadas y agende. Quiero agendar una demostración.',
    metaTitle: 'IA que contesta las llamadas de tu clínica | IonosHub',
    metaDescription:
      'IA de voz y WhatsApp que agenda, confirma y reagenda pacientes 24/7 sin diagnosticar. Solicita una demostración para tu clínica o consultorio.',
  },
];

export const landingById = (id: string) => landings.find((l) => l.id === id);

/** Para las páginas dedicadas: la variante existe siempre, así que un id mal escrito rompe el build. */
export function getLanding(id: LandingId): LandingVariant {
  const landing = landingById(id);
  if (!landing) throw new Error(`Landing desconocida: ${id}`);
  return landing;
}
