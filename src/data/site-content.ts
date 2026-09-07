/* Logos de clientes reales, recortados al trazo con margen uniforme (public/imgs/clientes/marca). */
export const clients = [
  { src: '/imgs/clientes/marca/chipotle.webp', alt: 'El Chipotle' },
  { src: '/imgs/clientes/marca/zonagamers.webp', alt: 'Zona Gamers' },
  { src: '/imgs/clientes/marca/danielavidal.webp', alt: 'Daniela Vidal · Asesora de seguros e inversiones' },
  { src: '/imgs/clientes/marca/santalucia.webp', alt: 'Santa Lucía · Centro oftalmológico' },
  { src: '/imgs/clientes/marca/aura.webp', alt: 'Aura Beauty Studio' },
  { src: '/imgs/clientes/marca/mianonna.webp', alt: 'Mia Nonna' },
  { src: '/imgs/clientes/marca/ecu593.webp', alt: 'Ecu593 English' },
  { src: '/imgs/clientes/marca/distribuidora.webp', alt: 'Distribuidora Hernández' },
  { src: '/imgs/clientes/marca/fondue.webp', alt: "Fondue's Escuela de Chefs" },
  { src: '/imgs/clientes/marca/mafercano.webp', alt: 'Mafer Cano' },
  { src: '/imgs/clientes/marca/gecop.webp', alt: 'Gecop Expert' },
  { src: '/imgs/clientes/marca/itsi.webp', alt: 'ITSI' },
  { src: '/imgs/clientes/marca/pawau.webp', alt: 'Pawau' },
];

/* Conexiones oficiales: marcas reales; el sello de programa va en el texto, no se inventa un emblema. */
export const partners = [
  { brand: 'meta' as const, name: 'Meta', credential: 'Tech Provider' },
  { brand: 'zapier' as const, name: 'Zapier', credential: 'Partner' },
  { brand: 'anthropic' as const, name: 'Anthropic', credential: 'Partner · Claude' },
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
