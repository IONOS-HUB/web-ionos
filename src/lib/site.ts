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

/** Agenda de diagnósticos (Google Calendar). El corto abre en una pestaña; el largo se incrusta. */
export const CALENDAR_URL = 'https://calendar.app.google/LSjLcpH2TpMAasgN6';
export const CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2fkQPDl0FF5Em6-T_xqHSd5jGjlM4nrgd5a7htOGIVQSf3tIFviKK7k7ru8ZeTq96U1yxsbpn1?gv=true';

/** Navegación: los pilares agrupados en "Servicios"; el resto suelto. */
export const NAV_SERVICES = [
  { href: '/servicios/inteligencia-artificial', label: 'Inteligencia artificial', hint: 'IA de voz, agentes en WhatsApp y redes', icon: 'ia' },
  { href: '/servicios/automatizaciones', label: 'Automatizaciones', hint: 'CRM unificado, flujos y dashboards', icon: 'automatizaciones' },
  { href: '/servicios/marketing', label: 'Marketing', hint: 'Pauta en Meta, SEO, AEO y landing pages', icon: 'marketing' },
  { href: '/servicios/software-a-medida', label: 'Software a medida', hint: 'Tu sistema funcionando en 30 días', icon: 'software' },
] as const;

export const NAV = [
  { href: '/casos-de-exito', label: 'Casos' },
  { href: '/blog-recursos', label: 'Blog' },
  { href: '/equipo', label: 'Equipo' },
] as const;

export const LEGAL = [
  { href: '/politica-de-privacidad', label: 'Política de privacidad' },
  { href: '/terminos-y-condiciones', label: 'Términos y condiciones' },
] as const;
