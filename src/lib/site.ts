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

export const NAV = [
  { href: '/servicios/inteligencia-artificial', label: 'IA' },
  { href: '/servicios/automatizaciones', label: 'Automatizaciones' },
  { href: '/servicios/marketing', label: 'Marketing' },
  { href: '/servicios/software-a-medida', label: 'Software en 30 días', short: 'Software' },
  { href: '/casos-de-exito', label: 'Casos' },
  { href: '/equipo', label: 'Equipo' },
] as const;

export const LEGAL = [
  { href: '/politica-de-privacidad', label: 'Política de privacidad' },
  { href: '/terminos-y-condiciones', label: 'Términos y condiciones' },
] as const;
