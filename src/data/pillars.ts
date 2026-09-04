export type PillarId = 'ia' | 'automatizaciones' | 'marketing' | 'software';

export interface Pillar {
  id: PillarId;
  slug: string;
  route: string;
  /** Nombre corto para chips y navegación */
  short: string;
  title: string;
  tagline: string;
  /** Problema que resuelve, en la voz del dueño del negocio */
  problem: string;
  /** Qué incluye: capacidades confirmadas por el usuario */
  includes: string[];
  /** Ejemplos concretos de lo que se entrega */
  examples: string[];
  /** Prueba verificable asociada */
  proof?: string;
  caseSlugs: string[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  waMessage: string;
}

export const pillars: Pillar[] = [
  {
    id: 'ia',
    slug: 'inteligencia-artificial',
    route: '/servicios/inteligencia-artificial',
    short: 'IA',
    title: 'Inteligencia Artificial',
    tagline: 'Una IA que atiende llamadas y mensajes 24/7, entiende audios, imágenes y documentos, y actúa.',
    problem:
      'Mientras atiendes a un cliente, pierdes al siguiente. Fuera de horario nadie contesta el teléfono ni el WhatsApp, y el lead se enfría.',
    includes: [
      'IA de voz (IVR) que responde llamadas 24/7: agenda citas, toma pedidos y envía recordatorios',
      'Agentes en WhatsApp, Instagram y Facebook con el tono de tu marca',
      'Clasificador multifunción: entiende audios, imágenes y documentos, y los registra donde corresponde',
      'Consulta inventario, agenda y sistemas externos antes de responder',
      'Botones de IA integrados en tu sistema, página o sitio web',
      'LLMs avanzados (incluido Claude de Anthropic) conectados por API a tus servidores y CRM',
    ],
    examples: [
      'Un consultorio: la IA contesta la llamada, agenda la cita en la agenda del doctor y envía el recordatorio por WhatsApp',
      'Un cliente manda un audio con su pedido; IONIC lo transcribe, lo registra en el CRM y confirma',
      'Un paciente envía la foto de su receta; IONIC detecta el documento y lo adjunta a su ficha',
    ],
    proof:
      'IONIC es nuestro agente propio: atiende llamadas, WhatsApp y redes 24/7, clasifica lo que recibe (voz, audio, imagen, documento) y agenda. Ideal para consultorios y clínicas.',
    caseSlugs: ['pawau'],
    faqs: [
      {
        q: '¿La IA también atiende llamadas?',
        a: 'Sí. Nuestra IA de voz (IVR) contesta el teléfono 24/7, agenda citas, toma pedidos y envía recordatorios. Es la solución que más tiempo ahorra a consultorios y clínicas.',
      },
      {
        q: '¿Qué pasa si el cliente manda un audio, una foto o un PDF?',
        a: 'IONIC lo entiende: transcribe audios, reconoce imágenes y documentos (recetas, facturas, comprobantes) y los registra en el CRM o en tu sistema. No se pierde nada por llegar en otro formato.',
      },
      {
        q: '¿El agente reemplaza a mi equipo?',
        a: 'No. Atiende, clasifica y agenda 24/7 para que tu equipo se concentre en las conversaciones de alto valor y en cerrar.',
      },
      {
        q: '¿Puede conectarse a mi sistema actual?',
        a: 'Sí. Nos conectamos por API a inventarios, agendas, CRMs y servidores privados para que el agente responda con datos reales.',
      },
    ],
    metaTitle: 'IA de voz, agentes de WhatsApp y clasificador multiformato | IonosHub',
    metaDescription:
      'IA que responde llamadas y mensajes 24/7, entiende audios, imágenes y documentos, agenda citas y se conecta a tus sistemas. Ideal para consultorios, clínicas y PyMEs en Ecuador.',
    waMessage: 'Hola IonosHub, me interesa una IA que atienda llamadas y mensajes de mi negocio. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'automatizaciones',
    slug: 'automatizaciones',
    route: '/servicios/automatizaciones',
    short: 'Automatizaciones',
    title: 'Automatizaciones',
    tagline: 'Todos tus leads en un CRM unificado y el trabajo repetitivo hecho solo.',
    problem:
      'Los leads viven repartidos entre el WhatsApp de una persona, Excel y papel. Nadie sabe cuántos entraron, quién los atendió ni cuánto dejó cada canal.',
    includes: [
      'CRM unificado: todos los leads de WhatsApp, redes, llamadas y web en un solo lugar',
      'CRM simplificado para consultorios: gestiona pacientes y envía recordatorios en dos clics',
      'Flujos de automatización (tipo Zapier / n8n) que conectan tus herramientas',
      'Rutinas que reemplazan el trabajo manual del día a día: reportes, clasificación, seguimientos',
      'Dashboards a medida: trazabilidad y rentabilidad del negocio con KPIs claros',
      'Análisis de Excel y reportería en línea',
    ],
    examples: [
      'Cada lead de WhatsApp, pauta o llamada entra solo al CRM, con etapa, canal de origen y responsable',
      'Un doctor abre su CRM, ve las citas del día y los recordatorios ya salieron solos',
      'Un dashboard muestra qué canal trae los clientes más rentables, cada lunes a las 7:00',
    ],
    proof: 'Somos partner de Zapier: conectamos tus herramientas con flujos oficiales y mantenidos.',
    caseSlugs: ['zona-gamers'],
    faqs: [
      {
        q: '¿Qué es el CRM unificado?',
        a: 'Un solo lugar donde caen todos los leads sin importar el canal (WhatsApp, Instagram, llamadas, formulario web). Cada uno llega clasificado por IONIC, con su historial, etapa y responsable. Se acaba el "¿quién atendió a este cliente?".',
      },
      {
        q: '¿Tengo que cambiar mis herramientas?',
        a: 'No necesariamente. Conectamos e integramos lo que ya usas con flujos tipo Zapier o n8n; sólo proponemos reemplazar cuando de verdad conviene.',
      },
      {
        q: '¿Qué mide el dashboard?',
        a: 'Lo que importa para decidir: leads por canal, tasa de cierre, tiempo de respuesta, ticket promedio y rentabilidad por canal o servicio. Definimos los KPIs contigo en el diagnóstico.',
      },
    ],
    metaTitle: 'CRM unificado, automatizaciones y dashboards para PyMEs | IonosHub',
    metaDescription:
      'Centraliza todos tus leads en un CRM unificado, automatiza el trabajo repetitivo con flujos tipo Zapier/n8n y mide trazabilidad y rentabilidad con dashboards a medida. Ecuador.',
    waMessage: 'Hola IonosHub, quiero centralizar mis leads y automatizar procesos. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'marketing',
    slug: 'marketing',
    route: '/servicios/marketing',
    short: 'Marketing',
    title: 'Marketing',
    tagline: 'Segmentación profesional en Meta, contenido y eventos que traen clientes, no likes.',
    problem:
      'Invertir en anuncios sin estructura quema presupuesto: un solo anuncio para todo el mundo, sin conjuntos, sin segmentos, sin saber qué funcionó.',
    includes: [
      'Estructura profesional de campañas: conjuntos de anuncios por segmento, objetivo y presupuesto',
      'Segmentación por ubicación, intereses, clientes anteriores y audiencias similares',
      'Optimización continua de campañas en todo el entorno Meta',
      'Creación de contenido digital para redes',
      'Cobertura de eventos con fotografía y video profesional',
      'Landing pages a medida conectadas al CRM y a IONIC',
    ],
    examples: [
      'Una campaña con tres conjuntos: vecinos a 5 km, clientes anteriores y audiencias similares, cada uno con su presupuesto',
      'Una landing page por campaña, conectada al CRM unificado y atendida por IONIC',
      'Cobertura de tu evento lista para publicar el mismo día',
    ],
    proof:
      'Somos Meta Tech Provider: conexiones oficiales por API y certificaciones que avalan nuestro trabajo dentro del entorno Meta.',
    caseSlugs: ['chipotle', 'la-victoria', 'comunidad-ia'],
    faqs: [
      {
        q: '¿Cómo segmentan las campañas?',
        a: 'Con conjuntos de anuncios separados por segmento: ubicación y radio, intereses, clientes anteriores (retargeting) y audiencias similares a tus compradores. Cada conjunto tiene su presupuesto y se optimiza según resultados.',
      },
      {
        q: '¿Manejan el presupuesto de anuncios?',
        a: 'Gestionamos la estructura y la optimización. El presupuesto publicitario lo define y aporta tu negocio; nosotros lo hacemos rendir.',
      },
      {
        q: '¿Qué significa ser Meta Tech Provider?',
        a: 'Que trabajamos con conexiones oficiales de Meta por API y con las certificaciones que Meta exige a sus proveedores tecnológicos. No dependemos de atajos ni herramientas no autorizadas.',
      },
    ],
    metaTitle: 'Pauta segmentada en Meta, contenido y landing pages | IonosHub · Meta Tech Provider',
    metaDescription:
      'Campañas con conjuntos de anuncios segmentados profesionalmente, contenido, cobertura de eventos y landing pages a medida. Somos Meta Tech Provider. Marketing para empresas en Ecuador.',
    waMessage: 'Hola IonosHub, me interesa pauta segmentada y marketing digital. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'software',
    slug: 'software-a-medida',
    route: '/servicios/software-a-medida',
    short: 'Software',
    title: 'Software a medida en tiempo récord',
    tagline: 'Tu sistema integral, funcionando en 30 días.',
    problem:
      'Los sistemas genéricos no encajan con cómo opera tu negocio, y los proyectos a medida tardan meses y cuestan una fortuna.',
    includes: [
      'Sistemas de facturación, calificaciones, cursos en línea y más',
      'Sistemas web y apps móviles a medida',
      'Alcance cerrado y entrega en 30 días',
      'Infraestructura cloud y correo profesional',
      'Integración con IA, CRM unificado y marketing',
    ],
    examples: [
      'Sistema de calificaciones por roles para una academia, con reportería en línea',
      'Facturación conectada a tu inventario y a tu CRM',
      'Plataforma de cursos en línea con pagos y certificados',
    ],
    proof: 'Metodología de alcance cerrado: definimos el sistema en el diagnóstico y lo entregamos en 30 días.',
    caseSlugs: ['ecu593'],
    faqs: [
      {
        q: '¿Cómo entregan en 30 días?',
        a: 'Cerramos el alcance en el diagnóstico, trabajamos con componentes probados y un equipo dedicado. Lo que no entra en los 30 días se planifica como segunda fase, sin sorpresas.',
      },
      {
        q: '¿Qué pasa después de la entrega?',
        a: 'El sistema es tuyo. El soporte y la evolución se definen en la propuesta según lo que necesites.',
      },
      {
        q: '¿Necesito software a medida o me conviene automatizar?',
        a: 'Lo decidimos juntos en el diagnóstico. A veces conviene un sistema propio; otras, integrar y automatizar lo que ya usas.',
      },
    ],
    metaTitle: 'Software a medida en 30 días: facturación, cursos, sistemas | IonosHub',
    metaDescription:
      'Sistemas integrales a medida entregados en 30 días: facturación, calificaciones, cursos en línea, apps y sistemas web. Desarrollo de software para empresas en Ecuador.',
    waMessage: 'Hola IonosHub, necesito un sistema a medida. Quiero agendar un diagnóstico gratuito.',
  },
];

export const pillarById = (id: PillarId) => pillars.find((p) => p.id === id)!;
export const pillarBySlug = (slug: string) => pillars.find((p) => p.slug === slug);

/** Opciones del formulario de contacto */
export const pillarSelectOptions = [
  ...pillars.map((p) => ({ value: p.id, label: p.title })),
  { value: 'ecosistema', label: 'Todo el ecosistema' },
  { value: 'no-se', label: 'Aún no lo sé, quiero orientación' },
];
