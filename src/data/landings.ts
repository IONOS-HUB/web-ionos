import type { NicheId } from './niches';

/**
 * Landings "speed to lead": páginas cuyo único objetivo es el formulario. Una variante = un objeto, y
 * de aquí salen el titular, la pregunta de calificación del formulario, el fondo y la etiqueta con la
 * que el lead llega a GHL (`variante`). Cada variante tiene su propia página en `src/pages/speed-to-lead/`
 * (añadir una variante = un objeto aquí + su archivo de página).
 *
 * - `general` muestra el ecosistema completo (los cuatro pilares y el flujo hacia el CRM), casos, equipo y
 *   testimonios (si existen).
 * - Las de servicio (`software`) cuentan cómo se construye (`process`) con capturas de trabajo real, en lugar
 *   del ecosistema completo. Su titular repite el gancho del anuncio que lleva a ellas.
 * - Las de nicho no llevan testimonios: la demostración del sector, lo que el agente hace y sus líneas rojas
 *   salen de `niches.ts` para no duplicar copy, y el campo del formulario es noche con video (o motion en CSS).
 *
 * Son sólo para pauta: ningún enlace del sitio apunta a ellas, son `noindex` y no están en el sitemap.
 * Todas usan la misma página (`components/landing/Registro.astro`); lo que cambia por variante vive aquí.
 * Las páginas que posicionan por sector son `/servicios/inteligencia-artificial/<slug>`.
 */

export type LandingId = 'general' | 'instituciones' | 'clinicas' | 'software';

/** Un paso de lo que pasa después de enviar el formulario. Es el proceso real, no una promesa nueva. */
export interface LandingStep {
  /** Cuándo ocurre, en corto: va como rótulo del paso */
  when: string;
  title: string;
  detail: string;
}

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
  /** Los cuatro pasos desde que envía el formulario hasta el diagnóstico o la demostración */
  steps: LandingStep[];
  /** Caso real que va primero, junto al formulario y en la banda de casos. En los nichos manda el de `niches.ts`. */
  caseSlug?: string;
  /** Variantes por servicio: cómo se construye, en la sección del medio (en vez del ecosistema completo) */
  process?: { title: string; lead: string; steps: { title: string; detail: string }[]; forWhom: string };
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
    steps: [
      { when: 'Ahora', title: 'Dejas tus datos', detail: 'Cinco campos. Te toma menos de un minuto.' },
      { when: 'Al instante', title: 'Entran a nuestro CRM', detail: 'Tu solicitud queda registrada y asignada. No se pierde en un chat.' },
      { when: 'En menos de un día hábil', title: 'Te escribe un cofundador', detail: 'Por WhatsApp, para elegir el horario que te venga bien.' },
      { when: '30 minutos', title: 'Diagnóstico gratuito', detail: 'Sales con un plan concreto de IA, automatización o marketing.' },
    ],
    caseSlug: 'zona-gamers',
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
    steps: [
      { when: 'Ahora', title: 'Dejas tus datos', detail: 'Cinco campos. Te toma menos de un minuto.' },
      { when: 'Al instante', title: 'Entran a nuestro CRM', detail: 'Tu solicitud queda registrada y asignada. No se pierde en un chat.' },
      { when: 'En menos de un día hábil', title: 'Te escribimos por WhatsApp', detail: 'Para agendar la demostración con tu equipo de admisiones.' },
      { when: 'Demostración', title: 'Lo ves con tu matrícula', detail: 'El agente respondiendo cupos, horarios y requisitos de tu institución.' },
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
    steps: [
      { when: 'Ahora', title: 'Dejas tus datos', detail: 'Cinco campos. Te toma menos de un minuto.' },
      { when: 'Al instante', title: 'Entran a nuestro CRM', detail: 'Tu solicitud queda registrada y asignada. No se pierde en un chat.' },
      { when: 'En menos de un día hábil', title: 'Te escribimos por WhatsApp', detail: 'Para agendar la demostración en el horario de tu consultorio.' },
      { when: 'Demostración', title: 'La escuchas con tu agenda', detail: 'Cómo contestaría, agendaría y confirmaría a tus pacientes.' },
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
  {
    id: 'software',
    slug: 'software',
    route: '/speed-to-lead/software',
    h1: 'Te vendieron un sistema.',
    h1Accent: 'Nadie te preguntó qué necesitabas.',
    lead: 'Diseñamos contigo, pantalla por pantalla, el sistema que tu equipo sí va a usar, y lo entregamos en 30 días. Deja tus datos y un cofundador de IonosHub te contacta para una asesoría gratuita.',
    promises: ['Te contactamos en menos de un día hábil', 'Asesoría gratuita, sin compromiso de compra', 'Tu sistema en 30 días, con acompañamiento'],
    steps: [
      { when: 'Ahora', title: 'Dejas tus datos', detail: 'Cinco campos. Te toma menos de un minuto.' },
      { when: 'Al instante', title: 'Entran a nuestro CRM', detail: 'Tu solicitud queda registrada y asignada. No se pierde en un chat.' },
      { when: 'En menos de un día hábil', title: 'Te escribe un cofundador', detail: 'Por WhatsApp, para elegir el horario de tu asesoría.' },
      { when: '30 minutos', title: 'Asesoría gratuita', detail: 'Revisamos cómo opera tu negocio y qué tendría que hacer tu sistema.' },
    ],
    caseSlug: 'ecu593',
    process: {
      title: 'No vendemos sistemas. Te asesoramos.',
      lead: 'Primero entendemos cómo trabaja tu negocio; después lo construimos contigo. Lo que no entra en los 30 días se planifica como segunda fase, sin sorpresas.',
      steps: [
        {
          title: 'Diagnóstico de cómo opera tu negocio',
          detail: 'Quién va a usar el sistema, qué registra y qué reportes necesitas. Ahí se cierra el alcance.',
        },
        { title: 'Diseño contigo, pantalla por pantalla', detail: 'Ves cada pantalla antes de construirla. Nada de funciones que nadie va a usar.' },
        { title: 'Tu sistema en 30 días, con acompañamiento', detail: 'Lo entregamos funcionando y te acompañamos mientras tu equipo empieza a usarlo.' },
      ],
      forWhom: 'Para retail, farmacias, centros médicos y escuelas.',
    },
    form: {
      title: 'Agenda tu asesoría gratuita',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Ana Torres',
      orgLabel: 'Tu negocio',
      orgPlaceholder: 'Farmacia San José',
      qualify: {
        label: '¿Con qué llevas hoy tu negocio?',
        options: ['Excel, cuadernos o papel', 'Un sistema que no nos sirve', 'Varios programas que no se conectan', 'Todavía con nada', 'Otro'],
      },
      servicioInteres: 'Software a medida',
      cta: 'Quiero mi asesoría gratuita',
    },
    waMessage: 'Hola IonosHub, vengo de su anuncio de software a medida y quiero agendar una asesoría gratuita para mi negocio.',
    metaTitle: 'Software a medida para tu negocio, en 30 días | IonosHub',
    metaDescription:
      'Diseñamos contigo, pantalla por pantalla, el sistema que tu negocio necesita y lo entregamos en 30 días. Agenda una asesoría gratuita con IonosHub.',
  },
];

export const landingById = (id: string) => landings.find((l) => l.id === id);

/** Para las páginas dedicadas: la variante existe siempre, así que un id mal escrito rompe el build. */
export function getLanding(id: LandingId): LandingVariant {
  const landing = landingById(id);
  if (!landing) throw new Error(`Landing desconocida: ${id}`);
  return landing;
}
