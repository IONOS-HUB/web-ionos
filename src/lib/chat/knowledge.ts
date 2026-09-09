/**
 * Base de conocimiento del agente, generada en compilación desde los mismos datos que pinta el sitio.
 * Si algo no está aquí, el agente no lo sabe: así no puede inventar precios, plazos ni casos.
 * Al cambiar `src/data/*` el conocimiento se actualiza solo; no hay copia paralela que mantener.
 */
import { pillars } from '../../data/pillars';
import { successCases } from '../../data/cases';
import { faqs } from '../../data/site-content';
import { team } from '../../data/team';
import { SITE, WHATSAPP_DISPLAY, CALENDAR_URL } from '../site';

const pillarBlock = pillars
  .map((p) =>
    [
      `### ${p.title} (${SITE.url}${p.route})`,
      p.tagline,
      `Problema que resuelve: ${p.problem}`,
      `Incluye: ${p.includes.join('; ')}.`,
      `Ejemplos: ${p.examples.join('; ')}.`,
      p.proof ? `Prueba: ${p.proof}` : '',
      p.faqs.map((f) => `P: ${f.q}\nR: ${f.a}`).join('\n'),
    ]
      .filter(Boolean)
      .join('\n'),
  )
  .join('\n\n');

const caseBlock = successCases
  .map((c) => `- ${c.client} (${c.industry}) · ${c.highlight}. Reto: ${c.challenge} Solución: ${c.solution} Resultado: ${c.result}`)
  .join('\n');

const faqBlock = faqs.map((f) => `P: ${f.q}\nR: ${f.a}`).join('\n');

const teamBlock = team.map((m) => `- ${m.name}, ${m.role}. ${m.expertise}`).join('\n');

export const KNOWLEDGE = `# IonosHub

${SITE.name}, "${SITE.tagline}". Empresa ecuatoriana con sede en ${SITE.city}. Arma el ecosistema digital completo de pequeñas y medianas empresas en cuatro pilares. Su agente de IA propio se llama IONIC y atiende llamadas, WhatsApp y redes.

Contacto: correo ${SITE.email}, WhatsApp ${WHATSAPP_DISPLAY}, agenda de diagnósticos ${CALENDAR_URL}. Sitio: ${SITE.url}.

Cómo se contrata: no hay paquetes ni precios públicos. Todo empieza con un diagnóstico gratuito de 30 minutos por videollamada con un cofundador, del que sale una propuesta en 48 horas con qué pilares activar y en qué orden. Se puede empezar por un solo pilar. Sin compromiso de compra.

Credenciales: Meta Tech Provider, partner de Zapier, partner de Anthropic (Claude); certificaciones en Microsoft Azure, Google Cloud y Oracle Cloud.

## Los cuatro pilares

${pillarBlock}

## Casos reales (${SITE.url}/casos-de-exito)

${caseBlock}

## Preguntas frecuentes generales

${faqBlock}

## Equipo (${SITE.url}/equipo)

${teamBlock}

## Otras páginas

Blog y recursos: ${SITE.url}/blog-recursos. Política de privacidad: ${SITE.url}/politica-de-privacidad.
`;

/** Opciones válidas de interés, las mismas del formulario. */
export const INTERESTS = [...pillars.map((p) => p.title), 'Todo el ecosistema', 'Aún no lo sé, quiero orientación'];

/** Palabras que delatan cada opción. El orden importa: gana la primera que encaje. */
const INTEREST_HINTS: [string, RegExp][] = [
  ['Inteligencia Artificial', /\b(ia|i\.a\.|inteligencia artificial|agente|agentes|ionic|chatbot|bot|voz|ivr|llamadas?)\b/i],
  ['Automatizaciones', /\b(automatiz\w*|crm|flujos?|dashboards?|kpi|integraci\w+|zapier|n8n)\b/i],
  ['Marketing', /\b(marketing|pauta|anuncios?|publicidad|meta|facebook|instagram|seo|aeo|redes|contenido|campa\w+)\b/i],
  ['Software a medida en tiempo récord', /\b(software|sistema|aplicaci\w+|app|m[oó]vil|tienda en l[ií]nea|ecommerce|facturaci\w+|p[aá]gina web|landing)\b/i],
  ['Todo el ecosistema', /\b(todo|ecosistema|completo|todos los pilares)\b/i],
  ['Aún no lo sé, quiero orientación', /\b(no lo s[eé]|no s[eé]|orientaci\w+|no estoy segur\w|ay[uú]dame a decidir)\b/i],
];

/**
 * Lleva un texto libre a una de las opciones válidas. Devuelve cadena vacía si no encaja ninguna,
 * para que el agente siga preguntando en vez de guardar cualquier cosa como interés.
 */
export function normalizeInterest(text: string): string {
  const value = (text ?? '').trim();
  if (!value) return '';
  const exact = INTERESTS.find((i) => i.toLowerCase() === value.toLowerCase());
  if (exact) return exact;
  for (const [label, pattern] of INTEREST_HINTS) {
    if (pattern.test(value)) return label;
  }
  return '';
}
