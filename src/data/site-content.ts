/* Logos de clientes reales (repo v1, /public/imgs/clientes). */
export const clients = [
  { src: '/imgs/clientes/chipotle.webp', alt: 'El Chipotle' },
  { src: '/imgs/clientes/zonagamers.png', alt: 'Zona Gamers' },
  { src: '/imgs/clientes/santalucia.png', alt: 'Santa Lucía' },
  { src: '/imgs/clientes/mianonna.webp', alt: 'Mia Nonna' },
  { src: '/imgs/clientes/distribuidora.webp', alt: 'Distribuidora Hernández' },
  { src: '/imgs/clientes/mafercano.png', alt: 'Mafercano' },
  { src: '/imgs/clientes/itsi.png', alt: 'ITSI' },
  { src: '/imgs/clientes/danielavidal.png', alt: 'Daniela Vidal' },
  { src: '/imgs/clientes/ecu593.png', alt: 'Ecu593 English' },
  { src: '/imgs/clientes/fondue.png', alt: 'Fondué s Escuela de Chefs' },
  { src: '/imgs/clientes/aura.png', alt: 'Aura Beauty Studio' },
  { src: '/imgs/clientes/gecop.png', alt: 'GECOP Expert' },
  { src: '/imgs/clientes/pawau.png', alt: 'Pawau' },
];

/* Certificaciones reales (repo v1, /public/imgs/certificados). */
export const certifications = [
  {
    title: 'Microsoft Azure',
    subtitle: 'Cloud Computing',
    img: '/imgs/certificados/certificadoAzure.webp',
  },
  {
    title: 'Google Cloud',
    subtitle: 'Cloud Platform',
    img: '/imgs/certificados/emblemagoogleCloud.png',
  },
  {
    title: 'Oracle Cloud',
    subtitle: 'Database & Cloud',
    img: '/imgs/certificados/emblemaoracle.webp',
  },
];

/* Dolores del dueño de negocio (copy v1, ajustado a los 4 pilares). */
export const painPoints = [
  {
    title: 'Llamadas y mensajes sin responder',
    text: 'Atención saturada o fuera de horario: mientras atiendes a uno, el siguiente cuelga o se va.',
    pillar: 'ia' as const,
  },
  {
    title: 'Leads repartidos y procesos manuales',
    text: 'Los clientes viven en el WhatsApp de una persona, en Excel y en papel. Nadie sabe cuánto dejó cada canal.',
    pillar: 'automatizaciones' as const,
  },
  {
    title: 'Pauta que no convierte',
    text: 'Anuncios sin estructura, contenido sin plan y una web que no lleva a nada.',
    pillar: 'marketing' as const,
  },
  {
    title: 'Sistemas que no encajan',
    text: 'Software genérico que no refleja cómo operas, o proyectos que tardan meses.',
    pillar: 'software' as const,
  },
];

/* Proceso (copy v1). */
export const steps = [
  {
    title: 'Diagnóstico',
    text: 'Entendemos tu operación, canales y objetivos. Sin compromiso de compra.',
    duration: 'Gratis · 30 min',
  },
  {
    title: 'Propuesta',
    text: 'Armamos el ecosistema a tu medida: qué pilares activar y en qué orden.',
    duration: '48 horas',
  },
  {
    title: 'Arranque',
    text: 'Implementamos las piezas acordadas e integramos lo que ya usas.',
    duration: 'Desde la semana 1',
  },
  {
    title: 'Resultados',
    text: 'Medimos, optimizamos y escalamos el sistema con datos reales.',
    duration: 'Cada mes',
  },
];

/* Preguntas frecuentes (copy v1, actualizado a pilares). */
export const faqs = [
  {
    q: '¿Venden paquetes fijos o precios públicos?',
    a: 'No. Cada ecosistema se arma a medida tras un diagnóstico gratuito. Trabajamos con pequeñas y medianas empresas, así que el alcance y la inversión se ajustan a tu realidad.',
  },
  {
    q: '¿Debo contratar los cuatro pilares?',
    a: 'No. Empiezas por el que más impacto te dé hoy (casi siempre IA o automatizaciones) y conectas el resto cuando el negocio lo pida.',
  },
  {
    q: '¿Qué es IONIC?',
    a: 'Nuestro agente de IA. Atiende 24/7 llamadas, WhatsApp y redes; entiende audios, imágenes y documentos; consulta tus sistemas; clasifica leads y agenda citas. El chat es sólo uno de sus canales.',
  },
  {
    q: '¿La IA atiende llamadas telefónicas?',
    a: 'Sí. Nuestra IA de voz contesta el teléfono 24/7, agenda citas, toma pedidos y envía recordatorios. Consultorios y clínicas son quienes más tiempo ahorran con ella.',
  },
  {
    q: '¿Qué es el CRM unificado?',
    a: 'Un solo lugar donde caen todos tus leads, vengan de WhatsApp, Instagram, una llamada o la web, ya clasificados por IONIC y con su historial. Tiene una versión simplificada para consultorios, pensada para que el doctor gestione pacientes y recordatorios sin complicarse.',
  },
  {
    q: '¿Realmente entregan software en 30 días?',
    a: 'Sí, con alcance cerrado en el diagnóstico. Lo que no cabe en 30 días se planifica como segunda fase, sin sorpresas.',
  },
  {
    q: '¿Trabajan solo en Ecuador?',
    a: 'Somos una empresa ecuatoriana con sede en Ibarra y foco en el país. También acompañamos iniciativas en la región.',
  },
  {
    q: '¿Cuánto dura el diagnóstico?',
    a: 'Unos 30 minutos. Es una conversación para entender tu operación y proponerte un ecosistema viable. Sin compromiso de compra.',
  },
];
