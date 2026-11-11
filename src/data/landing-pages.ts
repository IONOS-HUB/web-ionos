/**
 * Portafolio de landing pages (/servicios/marketing/landing-pages).
 * Capturas en public/imgs/landings/<id>.webp a 1366×768; después de cambiar una, `npm run images`.
 * `descripcion` vacía = no se muestra.
 */
export interface LandingPage {
  id: string;
  nombre: string;
  url: string;
  descripcion: string;
  alt: string;
}

export const landingPages: LandingPage[] = [
  { id: 'gecop', nombre: 'GECOP Expert', url: 'https://www.gecopexpert.com/', descripcion: '', alt: 'Landing page de Gecop Expert, asesoría técnica en procesos del sector público' },
  { id: 'aura', nombre: 'Aura Beauty Studio', url: 'https://aurabeautystudio-ibarra.com/', descripcion: '', alt: 'Landing page de Aura Beauty Studio: «La belleza de sentirte tú»' },
  { id: 'ecu593', nombre: 'Ecu593 English', url: 'https://www.ecu593english.com/', descripcion: '', alt: 'Página de Ecu593 English' },
  { id: 'zona-gamers', nombre: 'Zona Gamers', url: 'https://www.zonagamersecuador.com/', descripcion: '', alt: 'Tienda en línea de Zona Gamers: catálogo de juegos para PlayStation' },
  { id: 'chipotle', nombre: 'El Chipotle', url: 'https://www.chipotleibarra.com/', descripcion: '', alt: 'Landing page de El Chipotle: «Auténtico sabor, Mexican & American Food»' },
  { id: 'fondues', nombre: "Fondue's Escuela de Chefs", url: 'https://fonduesescueladechefs.com/', descripcion: '', alt: "Landing page de Fondue's Escuela de Chefs: «20 años transformando pasión en profesión»" },
];
