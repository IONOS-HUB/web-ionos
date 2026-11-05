export const SITE = {
  name: 'IonosHub',
  tagline: 'De datos a resultados',
  url: 'https://ionoshub.net',
  email: 'info@ionoshub.net',
  city: 'Ibarra, Imbabura · Ecuador',
  social: {
    linkedin: 'https://linkedin.com/company/ionoshub',
    instagram: 'https://www.instagram.com/ionoshub',
    tiktok: 'https://www.tiktok.com/@ionoshub',
  },
} as const;

export const WHATSAPP_NUMBER = '593992249152';
export const WHATSAPP_DISPLAY = '099 224 9152';

export const DEFAULT_WA_MESSAGE =
  'Hola IonosHub, quiero agendar un diagnóstico gratuito para mi negocio.';

export function waLink(message: string = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Meta Pixel (conjunto de datos "IonosHub · Web"). Público; `PUBLIC_META_PIXEL_ID` lo sobreescribe. */
export const META_PIXEL_ID = '1472397644734399';

/**
 * Agenda de diagnósticos: el calendario «Diagnóstico IONIC · 30 min» de GoHighLevel, el mismo en el que agenda
 * IONIC por WhatsApp. Así una reserva desde la web entra al CRM y n8n («Sincronizar citas») se la avisa a IONIC.
 * La misma URL sirve para abrir en una pestaña y para incrustar.
 */
export const CALENDAR_HOST = 'api.leadconnectorhq.com';
export const CALENDAR_URL = `https://${CALENDAR_HOST}/widget/booking/htMrFJ3JRuWsDYlsq10G`;
export const CALENDAR_EMBED_URL = CALENDAR_URL;

/** Navegación: los pilares agrupados en "Servicios"; el resto suelto. */
export const NAV_SERVICES = [
  { href: '/servicios/inteligencia-artificial', label: 'Inteligencia artificial', hint: 'IA de voz, agentes en WhatsApp y redes', icon: 'ia' },
  { href: '/servicios/automatizaciones', label: 'Automatizaciones', hint: 'CRM unificado, flujos y dashboards', icon: 'automatizaciones' },
  { href: '/servicios/marketing', label: 'Marketing', hint: 'Pauta en Meta, SEO, AEO y landing pages', icon: 'marketing' },
  { href: '/servicios/software-a-medida', label: 'Software a medida', hint: 'Tu sistema funcionando en 30 días', icon: 'software' },
] as const;

export const NAV = [
  { href: '/casos-de-exito', label: 'Casos' },
  { href: '/webinars', label: 'Webinars' },
  { href: '/blog-recursos', label: 'Blog' },
  { href: '/equipo', label: 'Equipo' },
] as const;

export const LEGAL = [
  { href: '/politica-de-privacidad', label: 'Política de privacidad' },
  { href: '/terminos-y-condiciones', label: 'Términos y condiciones' },
] as const;
