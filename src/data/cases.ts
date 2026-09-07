import type { PillarId } from './pillars';

export interface SuccessCase {
  slug: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  /** Cifra o frase corta publicable, tal como consta en v1 o la dio el usuario */
  highlight: string;
  /** Para numerales grandes: valor "antes" y "después" cuando existe */
  metric?: { before: string; after: string; unit?: string };
  pillar: PillarId;
  /** Logo recortado al trazo (public/imgs/clientes/marca) */
  logo?: string;
}

/* Fuente: repo v1 (src/data/cases.ts) más los usos reales que da el usuario. Cifras reales; no se añade ninguna nueva. */
export const successCases: SuccessCase[] = [
  {
    slug: 'zona-gamers',
    client: 'Zona Gamers',
    industry: 'Retail digital',
    challenge: 'El administrador perdía cerca de 5 horas revisando y clasificando archivos y juegos.',
    solution: 'Automatización completa del proceso de clasificación.',
    result: 'El proceso ahora toma unos 10 minutos.',
    highlight: 'De 5 h a 10 min',
    metric: { before: '5 h', after: '10 min' },
    pillar: 'automatizaciones',
    logo: '/imgs/clientes/marca/zonagamers.webp',
  },
  {
    slug: 'daniela-vidal',
    client: 'Daniela Vidal',
    industry: 'Asesoría de seguros e inversiones',
    challenge:
      'Los leads llegaban a toda hora por WhatsApp y no había equipo para filtrarlos, calificarlos y darles seguimiento.',
    solution:
      'Un agente de IA que conversa 24/7, filtra y califica cada lead y lo registra en el CRM unificado con su etapa y datos.',
    result: 'La asesora entra al CRM sólo a cerrar y cobrar: el agente hace el resto, sin un equipo completo.',
    highlight: 'Leads calificados 24/7',
    metric: { before: 'equipo', after: '1 agente', unit: 'de IA' },
    pillar: 'automatizaciones',
    logo: '/imgs/clientes/marca/danielavidal.webp',
  },
  {
    slug: 'pawau',
    client: 'Pawau',
    industry: 'Peluquería y spa canino',
    challenge: 'Atendía unas 20 personas al día; mientras atendían a uno, perdían al siguiente.',
    solution: 'Agente IONIC que responde 24/7 por WhatsApp y registra citas.',
    result: 'Atención continua sin perder clientes por saturación manual.',
    highlight: 'Atención 24/7',
    metric: { before: 'horario', after: '24/7' },
    pillar: 'ia',
    logo: '/imgs/clientes/marca/pawau.webp',
  },
  {
    slug: 'chipotle',
    client: 'El Chipotle',
    industry: 'Restaurante',
    challenge: 'No tenía presencia ni visitas en internet.',
    solution: 'Presencia digital levantada desde cero, conectada a WhatsApp.',
    result: 'De 0 vistas a redirección activa de leads al canal de WhatsApp.',
    highlight: 'De 0 a leads activos',
    metric: { before: '0', after: 'leads', unit: 'activos' },
    pillar: 'marketing',
    logo: '/imgs/clientes/marca/chipotle.webp',
  },
  {
    slug: 'ecu593',
    client: 'Ecu593 English',
    industry: 'Educación',
    challenge: 'Operaban con Excel, Word y notas de estudiantes en papel.',
    solution: 'Sistema propio por roles, con reportería en línea y gestión centralizada.',
    result: 'Negocio centralizado y digitalizado desde su origen.',
    highlight: 'Operación 100 % digital',
    metric: { before: 'papel', after: '100 %', unit: 'digital' },
    pillar: 'software',
    logo: '/imgs/clientes/marca/ecu593.webp',
  },
  {
    slug: 'la-victoria',
    client: 'Unidad Educativa Católica "La Victoria"',
    industry: 'Educación',
    challenge: 'Necesitaban gestión de redes y cobertura fotográfica profesional.',
    solution: 'Equipo de marketing en redes y cobertura con cámara profesional.',
    result: 'Mejor recibimiento de la comunidad de padres en redes.',
    highlight: 'Comunidad más cercana',
    pillar: 'marketing',
  },
  {
    slug: 'comunidad-ia',
    client: 'Comunidad de la IA (Perú)',
    industry: 'Comunidad y formación',
    challenge: 'Formar comunidades en plataformas digitales con contenido de calidad.',
    solution: 'Talleres formativos del equipo IonosHub en la plataforma Skool.',
    result: 'Talleres formativos activos y transferencia de conocimiento.',
    highlight: 'Talleres activos',
    pillar: 'marketing',
  },
];

/** Home: el primero va destacado a lo grande; el resto, en la lista lateral. */
export const homeCaseSlugs = ['zona-gamers', 'daniela-vidal', 'pawau', 'chipotle', 'ecu593'] as const;

export const getCaseBySlug = (slug: string) => successCases.find((c) => c.slug === slug);
