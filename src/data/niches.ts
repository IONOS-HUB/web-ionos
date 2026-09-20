import type { IconName } from '../components/Icon.astro';

/**
 * Nichos del pilar de IA. Un sector = un objeto, y de aquí salen a la vez el selector del eje
 * (/servicios/inteligencia-artificial), las páginas por sector, el JSON-LD, `llms.txt` y la base de
 * conocimiento del agente IONIC del sitio.
 *
 * Por qué existe: la página de IA vendía una capacidad ("clasificador multifunción") y el visitante
 * compra la solución a un problema de SU sector. Medido antes de esto: "clínica" aparecía 8 veces en
 * la página de IA, "retail" una, e "instituto" y "salón de belleza" cero en todo el sitio.
 *
 * REGLA DE ENTRADA: un nicho sólo entra si tiene demostración, léxico y líneas rojas propios. Si lo
 * único que cambia es el nombre del negocio en el copy, no es un nicho, es la misma página repetida.
 *
 * REGLA DE PRUEBA: aquí no se inventan cifras ni testimonios (PRODUCT.md). `caseSlug` sólo apunta a
 * un caso real de `cases.ts`; cuando el sector sólo tiene logo y no caso, se nombra al cliente en
 * `clientLogo` y la evidencia la carga la ventanilla, etiquetada como demostración.
 */

export type NicheId = 'clinicas' | 'institutos' | 'salones-de-belleza' | 'retail';

export interface NichePersona {
  /** Cómo se presenta el agente en ese sector */
  role: string;
  /** Tratamiento y a quién se lo da */
  treatment: string;
  /** Registro de voz, en una frase que un redactor pueda seguir */
  voice: string;
  /** El léxico del sector: un paciente no es un cliente y un representante no es un usuario */
  vocabulary: string[];
  /** Primera línea real, tal como la diría */
  opening: string;
}

export interface NicheDemoLine {
  who: 'client' | 'ionic';
  text: string;
}

export interface NicheDemo {
  channel: 'Llamada' | 'WhatsApp' | 'Instagram';
  /** Negocio ficticio: la cabecera de la ventanilla lo etiqueta como demostración */
  business: string;
  meta: string;
  /** Etiquetas de quién habla; en llamada cambian ("Paciente" / "IA de voz") */
  speakers: { client: string; ionic: string };
  lines: NicheDemoLine[];
  /** Lo que el agente deja hecho en un sistema real */
  card: { title: string; detail: string };
}

export interface Niche {
  id: NicheId;
  slug: string;
  route: string;
  icon: IconName;
  /** Nombre completo del sector */
  label: string;
  /** Para chips y selector, donde no cabe el largo */
  short: string;
  h1: string;
  tagline: string;
  /** El problema en la voz de quien manda en ese negocio */
  problem: string;
  persona: NichePersona;
  /** Lo que el agente hace en ese sector */
  jobs: string[];
  /** Lo que NO hace. Es el argumento de venta, no la letra pequeña. */
  redLines: string[];
  /** A qué se conecta para responder con datos reales */
  systems: string[];
  demo: NicheDemo;
  /** Atajos que siembra el chat de IONIC en la página del sector. Cortos: son chips, no preguntas de FAQ. */
  chatPrompts: [string, string];
  faqs: { q: string; a: string }[];
  /** Prueba disponible: caso real de cases.ts y/o cliente del sector con logo */
  proof: { caseSlug?: string; clientLogo?: string; clientName?: string };
  metaTitle: string;
  metaDescription: string;
  waMessage: string;
}

export const niches: Niche[] = [
  {
    id: 'clinicas',
    slug: 'clinicas',
    route: '/servicios/inteligencia-artificial/clinicas',
    icon: 'estetoscopio',
    label: 'Clínicas y consultorios',
    short: 'Clínicas',
    h1: 'Un agente de IA que contesta el teléfono de tu consultorio a las once de la noche',
    tagline: 'Agenda, confirma, reagenda y recibe la orden del paciente por WhatsApp. Sin diagnosticar nunca.',
    problem:
      'La llamada entra mientras estás con un paciente. Nadie contesta, y quien quería una cita ya está llamando al consultorio de al lado.',
    persona: {
      role: 'Recepción de la clínica',
      treatment: 'De usted, siempre y con todos',
      voice:
        'Calmado, prudente y formal. Ni una broma ni un emoji. Cuando algo suena urgente deja de agendar y pasa la conversación a una persona.',
      vocabulary: ['paciente, nunca cliente', 'cita, nunca reserva', 'ficha e historia clínica', 'especialista y consultorio'],
      opening: 'Centro Médico Santa Elena, buenas noches. ¿Con quién tengo el gusto?',
    },
    jobs: [
      'Contesta la llamada a cualquier hora y agenda en la agenda real del especialista',
      'Confirma el día antes por WhatsApp y reagenda al paciente que no puede',
      'Llena el cupo que deja una cancelación con quien está en lista de espera',
      'Recibe la foto de una orden o una receta y la adjunta a la ficha del paciente',
      'Separa lo que puede esperar de lo que hay que pasar ya a una persona',
    ],
    redLines: [
      'No diagnostica ni sugiere tratamientos, aunque le insistan',
      'No interpreta exámenes ni entrega resultados por chat',
      'No recomienda medicación ni dosis',
      'No comparte datos de un paciente con quien no sea ese paciente',
    ],
    systems: ['Agenda del especialista', 'CRM de consultorio', 'Sistema de historia clínica por API'],
    demo: {
      channel: 'Llamada',
      business: 'Centro Médico Santa Elena',
      meta: 'Atendida por la IA de voz · 1:12',
      speakers: { client: 'Paciente', ionic: 'IA de voz' },
      lines: [
        { who: 'client', text: 'Buenas noches, necesito una cita con el doctor Peñaherrera esta semana.' },
        {
          who: 'ionic',
          text: 'Con gusto. El doctor tiene el jueves a las 10:30 o el viernes a las 16:00. ¿Cuál le conviene?',
        },
        { who: 'client', text: 'El jueves. Y tengo una orden de exámenes, ¿se la puedo mandar?' },
        {
          who: 'ionic',
          text: 'Claro, envíemela por WhatsApp a este mismo número y queda en su ficha. Le confirmo el miércoles.',
        },
      ],
      card: {
        title: 'Cita agendada y orden adjuntada',
        detail: 'Agenda del Dr. Peñaherrera · Jueves 10:30 · Recordatorio programado',
      },
    },
    chatPrompts: ['¿Y los datos del paciente?', '¿Contesta llamadas?'],
    faqs: [
      {
        q: '¿Quién ve las conversaciones y dónde quedan los datos del paciente?',
        a: 'Las conversaciones viven en los sistemas de la clínica, no en un servicio ajeno: las conectamos por API a tu agenda, tu CRM o tu sistema de historia clínica, y el acceso lo defines tú por rol. El agente sólo registra lo que la clínica necesita para atender la cita. En el diagnóstico revisamos contigo qué se guarda, dónde y quién puede verlo.',
      },
      {
        q: '¿Y si un paciente le pide un diagnóstico?',
        a: 'No lo da. El agente está construido para no opinar sobre síntomas, exámenes ni medicación: cuando la conversación va hacia ahí, responde que eso lo ve el especialista y ofrece la cita más cercana. Si detecta algo que suena urgente, deja de agendar y pasa la conversación a una persona del equipo.',
      },
      {
        q: '¿Se conecta con la agenda que ya usamos?',
        a: 'Sí. Nos conectamos por API a la agenda del especialista, al CRM y, cuando existe, al sistema de historia clínica, para que el agente vea los cupos reales y no agende sobre una hora ocupada. Si el consultorio todavía trabaja en cuaderno o Excel, el CRM simplificado para consultorios entra con él.',
      },
    ],
    proof: { clientLogo: '/imgs/clientes/marca/santalucia.webp', clientName: 'Santa Lucía · Centro oftalmológico' },
    metaTitle: 'Agente de IA para clínicas y consultorios en Ecuador | IonosHub',
    metaDescription:
      'IA que contesta el teléfono de tu consultorio 24/7, agenda en la agenda del especialista, confirma por WhatsApp y recibe órdenes y recetas. No diagnostica. Para clínicas y consultorios en Ecuador.',
    waMessage:
      'Hola IonosHub, tengo una clínica y quiero una IA que conteste las llamadas y agende. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'institutos',
    slug: 'institutos',
    route: '/servicios/inteligencia-artificial/institutos',
    icon: 'birrete',
    label: 'Institutos y centros educativos',
    short: 'Institutos',
    h1: 'La secretaría de tu instituto, abierta a la hora en que los representantes preguntan',
    tagline: 'Informa cupos, horarios y requisitos, acompaña la matrícula y agenda la visita. También a las nueve de la noche.',
    problem:
      'Las preguntas de matrícula llegan de noche y el fin de semana. Cuando secretaría abre el lunes, el representante ya matriculó al hijo en otro lado.',
    persona: {
      role: 'Secretaría académica',
      treatment: 'De usted al representante, de tú al estudiante',
      voice:
        'Institucional y cordial, sin rigidez. Responde con fechas, requisitos y datos del pénsum, no con adjetivos sobre lo buena que es la institución.',
      vocabulary: ['representante, nunca cliente', 'estudiante, nunca usuario', 'matrícula, cupo y pénsum', 'período y jornada'],
      opening: 'Instituto Superior Ibarra, buenas noches. ¿En qué le puedo ayudar con la matrícula?',
    },
    jobs: [
      'Responde cupos, horarios, jornadas y requisitos de matrícula',
      'Acompaña la matrícula paso a paso y avisa qué documento falta',
      'Agenda la visita al campus o la reunión con coordinación',
      'Recibe la foto del documento y lo deja en la carpeta del aspirante',
      'Reparte a coordinación académica lo que no es admisiones',
    ],
    redLines: [
      'No da notas, asistencia ni conducta por chat',
      'No trata datos de un menor con quien no es su representante',
      'No promete cupos, becas ni descuentos que no estén confirmados',
      'No opina sobre el rendimiento de un estudiante',
    ],
    systems: ['Sistema académico', 'CRM de admisiones', 'Calendario de coordinación'],
    demo: {
      channel: 'WhatsApp',
      business: 'Instituto Superior Ibarra',
      meta: 'Atendido por IONIC · 21:40',
      speakers: { client: 'Representante', ionic: 'IONIC' },
      lines: [
        { who: 'client', text: 'Buenas noches, ¿todavía hay cupo para primero de bachillerato?' },
        {
          who: 'ionic',
          text: 'Buenas noches. Sí, quedan cupos para la jornada matutina. La matrícula cierra el 15 de octubre.',
        },
        { who: 'client', text: '¿Qué papeles necesito?' },
        {
          who: 'ionic',
          text: 'Cédula del estudiante, del representante y el certificado de promoción. ¿Le agendo una visita al campus?',
        },
      ],
      card: {
        title: 'Aspirante registrado en admisiones',
        detail: 'Jornada matutina · Visita el martes 10:00 · Checklist de documentos enviado',
      },
    },
    chatPrompts: ['¿Da notas por chat?', '¿Atiende matrículas?'],
    faqs: [
      {
        q: '¿Puede dar las notas de mi hijo por WhatsApp?',
        a: 'No, y es deliberado. El agente atiende admisiones e información institucional; notas, asistencia y conducta son datos del estudiante y se consultan en el sistema académico, con la sesión del representante. Si alguien las pide por chat, el agente lo deriva a coordinación en lugar de responder.',
      },
      {
        q: '¿Cómo maneja los datos de menores de edad?',
        a: 'El agente sólo trata con el representante y no entrega información del estudiante a un tercero. Los documentos que llegan (cédulas, certificados) van directo a la carpeta del aspirante en el sistema del instituto, no se quedan en el canal de chat. El alcance exacto lo definimos contigo en el diagnóstico.',
      },
      {
        q: '¿Sirve igual para un instituto, una academia y un colegio?',
        a: 'El patrón es el mismo —admisiones que llegan fuera de horario— pero el vocabulario y los requisitos cambian, así que se configuran por institución. Hemos trabajado con Ecu593 English y con la Unidad Educativa Católica "La Victoria", que son dos realidades bien distintas.',
      },
    ],
    proof: { caseSlug: 'ecu593', clientLogo: '/imgs/clientes/marca/ecu593.webp', clientName: 'Ecu593 English' },
    metaTitle: 'Agente de IA para institutos y centros educativos en Ecuador | IonosHub',
    metaDescription:
      'IA que responde cupos, horarios y requisitos de matrícula 24/7, acompaña al representante y agenda visitas. No da notas por chat. Para institutos, academias y colegios en Ecuador.',
    waMessage:
      'Hola IonosHub, tengo un instituto y quiero una IA que atienda las consultas de matrícula. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'salones-de-belleza',
    slug: 'salones-de-belleza',
    route: '/servicios/inteligencia-artificial/salones-de-belleza',
    icon: 'tijeras',
    label: 'Salones de belleza y estética',
    short: 'Belleza',
    h1: 'Reserva con la estilista correcta, en el hueco correcto, sin que sueltes las tijeras',
    tagline: 'Sabe cuánto dura un balayage y quién lo hace. Reserva, recuerda y vuelve a llenar las cancelaciones.',
    problem:
      'Tienes las manos en el cabello de una clienta y el teléfono suena. O contestas y dejas el tinte a medias, o pierdes la reserva.',
    persona: {
      role: 'Anfitriona del salón',
      treatment: 'De tú, cercano',
      voice:
        'Cálido y con energía. Es el único sector donde un emoji cae bien. Habla como habla el salón, no como un formulario de reservas.',
      vocabulary: ['clienta o cliente', 'reserva, no cita médica', 'servicio, retoque y color', 'la estilista, por su nombre'],
      opening: '¡Hola! Soy de Studio Aura 💇 ¿Qué te hacemos y con quién te gusta atenderte?',
    },
    jobs: [
      'Reserva por servicio y por estilista, con la duración real de cada uno',
      'Sabe que un balayage ocupa tres horas y no lo mete en un hueco de una',
      'Recuerda el día antes y libera el cupo si la clienta no confirma',
      'Ofrece el hueco liberado a quien estaba esperando',
      'Responde los precios de los servicios que el salón tenga publicados',
    ],
    redLines: [
      'No promete resultados de color ni de tratamiento',
      'No cotiza lo que depende de ver el cabello primero: agenda la valoración',
      'No compromete a una estilista que no tiene ese turno libre',
    ],
    systems: ['Agenda por profesional', 'Catálogo de servicios con duraciones', 'Lista de espera'],
    demo: {
      channel: 'Instagram',
      business: 'Studio Aura',
      meta: 'Atendido por IONIC · 20:15',
      speakers: { client: 'Clienta', ionic: 'IONIC' },
      lines: [
        { who: 'client', text: 'Holaa, quiero balayage para el sábado 🙌 ¿tienen espacio?' },
        {
          who: 'ionic',
          text: '¡Hola! El balayage nos toma unas 3 horas, así que el sábado sólo entra a las 9:00 con Majo. ¿Te sirve?',
        },
        { who: 'client', text: 'Sí! pero no sé si me conviene balayage o mechas' },
        {
          who: 'ionic',
          text: 'Eso lo define Majo viéndote el cabello. Te dejo la reserva a las 9:00 y los primeros minutos son de valoración 💛',
        },
      ],
      card: {
        title: 'Reserva con estilista y duración real',
        detail: 'Majo · Sábado 9:00–12:00 · Balayage con valoración previa',
      },
    },
    chatPrompts: ['¿Reserva por estilista?', '¿Y si no llegan?'],
    faqs: [
      {
        q: '¿Sabe cuánto dura cada servicio y con qué estilista?',
        a: 'Sí, y es lo que evita el problema de fondo. Cargamos el catálogo del salón con la duración real de cada servicio y qué hace cada estilista, así que el agente no ofrece un balayage en un hueco de una hora ni compromete a alguien que ese día no trabaja. Reserva sobre la agenda de cada profesional, no sobre una agenda única.',
      },
      {
        q: '¿Puede dar precios?',
        a: 'Los que el salón tenga publicados, sí. Lo que depende de ver el cabello —una corrección de color, una decoloración sobre tinte previo— no lo cotiza: agenda una valoración y lo dice con esas palabras, para que nadie llegue esperando un precio que no era.',
      },
      {
        q: '¿Qué pasa con las clientas que no llegan?',
        a: 'El agente recuerda el día antes y pide confirmación. Si no confirma, libera el cupo y se lo ofrece a quien estaba esperando, sin que nadie del salón tenga que estar pendiente del teléfono.',
      },
    ],
    proof: { clientLogo: '/imgs/clientes/marca/aura.webp', clientName: 'Aura Beauty Studio' },
    metaTitle: 'Agente de IA para salones de belleza y estética en Ecuador | IonosHub',
    metaDescription:
      'IA que reserva por servicio y por estilista con la duración real de cada uno, recuerda el día antes y vuelve a llenar las cancelaciones. Para salones de belleza y centros de estética en Ecuador.',
    waMessage:
      'Hola IonosHub, tengo un salón de belleza y quiero una IA que maneje las reservas. Quiero agendar un diagnóstico gratuito.',
  },
  {
    id: 'retail',
    slug: 'retail',
    route: '/servicios/inteligencia-artificial/retail',
    icon: 'tienda',
    label: 'Retail y tiendas',
    short: 'Retail',
    h1: 'Responde con el stock que de verdad tienes, no con el que cree tener',
    tagline: 'Consulta el inventario antes de contestar, arma el pedido y da el estado del envío.',
    problem:
      '"¿Tienen el modelo en talla M?" Alguien tiene que ir a mirar. Mientras tanto el cliente ya preguntó en otras tres tiendas.',
    persona: {
      role: 'Asesor de piso',
      treatment: 'De tú, rápido',
      voice:
        'Directo y resolutivo, sin rodeos ni discurso de marca. Disponibilidad, precio, cómo se paga y cuándo llega, en ese orden.',
      vocabulary: ['pedido, no cita', 'stock, modelo y talla', 'garantía y cambio', 'envío y número de guía'],
      opening: '¡Hola! ¿Qué modelo buscas? Te digo al toque si lo tenemos.',
    },
    jobs: [
      'Consulta el inventario real antes de responder por disponibilidad',
      'Arma el pedido y pasa el enlace de pago',
      'Da el estado del envío con el número de guía',
      'Recibe la foto del producto para un cambio o garantía y abre el caso',
      'Avisa cuando vuelve a entrar lo que estaba agotado',
    ],
    redLines: [
      'No confirma stock de memoria: si el sistema no responde, lo dice',
      'No promete fechas de entrega que no vengan de la transportadora',
      'No aprueba una garantía: la registra y la pasa a quien decide',
    ],
    systems: ['ERP o sistema de inventario', 'Pasarela de pagos', 'Transportadora'],
    demo: {
      channel: 'WhatsApp',
      business: 'Distribuidora El Portal',
      meta: 'Atendido por IONIC · 22:05',
      speakers: { client: 'Cliente', ionic: 'IONIC' },
      lines: [
        { who: 'client', text: '¿Tienen el teclado K-200 en stock?' },
        { who: 'ionic', text: 'Sí, quedan 12 unidades en bodega Ibarra. $48 con envío incluido a Quito.' },
        { who: 'client', text: 'Dame 2' },
        {
          who: 'ionic',
          text: 'Listo, te dejo el pedido armado y el enlace de pago. Sale mañana y te paso la guía apenas despachen.',
        },
      ],
      card: {
        title: 'Pedido armado contra inventario real',
        detail: 'Consultó el ERP: 12 unidades · 2 reservadas · Enlace de pago enviado',
      },
    },
    chatPrompts: ['¿Consulta mi inventario?', '¿Puede cobrar?'],
    faqs: [
      {
        q: '¿Responde con stock real o se lo inventa?',
        a: 'Consulta el inventario antes de contestar. Nos conectamos por API a tu ERP o a tu sistema de inventario, y si el sistema no responde en ese momento el agente lo dice en vez de arriesgar un número: "déjame confirmarlo y te aviso". Prometer stock que no hay cuesta más que tardar un minuto.',
      },
      {
        q: '¿Puede cobrar?',
        a: 'Arma el pedido y entrega el enlace de pago de tu pasarela; el cobro ocurre en la pasarela, no en el chat. El agente nunca pide datos de tarjeta por conversación, y está construido para negarse si alguien insiste.',
      },
      {
        q: '¿Maneja cambios y garantías?',
        a: 'Recibe la foto del producto, registra el caso con la factura y el motivo, y lo pasa a quien decide. No aprueba ni niega una garantía por su cuenta: reúne lo que tu equipo necesita para resolverla rápido.',
      },
    ],
    proof: { caseSlug: 'zona-gamers', clientLogo: '/imgs/clientes/marca/zonagamers.webp', clientName: 'Zona Gamers' },
    metaTitle: 'Agente de IA para retail y tiendas en Ecuador | IonosHub',
    metaDescription:
      'IA que consulta tu inventario real antes de responder, arma el pedido, pasa el enlace de pago y da el estado del envío. Para tiendas, distribuidoras y retail en Ecuador.',
    waMessage:
      'Hola IonosHub, tengo una tienda y quiero una IA que responda por stock y arme pedidos. Quiero agendar un diagnóstico gratuito.',
  },
];

export const nicheBySlug = (slug: string) => niches.find((n) => n.slug === slug);
export const nicheById = (id: string) => niches.find((n) => n.id === id);

/**
 * Nicho de una ruta. Lo usa el sitio para decirle al agente en qué sector está la persona.
 * Sólo reconoce rutas de nicho conocidas: lo que llega del navegador es un dato, nunca una orden.
 */
export const nicheFromPath = (path: string) => niches.find((n) => path.startsWith(n.route));
