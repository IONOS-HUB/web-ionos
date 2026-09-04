// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Mapa ruta legacy → pilar. Las 6 rutas de servicio de v1 y los 7 redirects
// históricos responden 301 hacia la página de pilar correspondiente.
// El adapter de Vercel convierte este mapa en redirects reales (no meta-refresh).
const legacyRedirects = {
  '/servicios/estrategia-contenido': '/servicios/marketing',
  '/servicios/produccion-visual-audiovisual': '/servicios/marketing',
  '/servicios/pauta-publicidad-digital': '/servicios/marketing',
  '/servicios/ionic-agente-ia': '/servicios/inteligencia-artificial',
  '/servicios/analitica-resultados': '/servicios/automatizaciones',
  '/agentes-virtuales': '/servicios/inteligencia-artificial',
  '/business-intelligence': '/servicios/automatizaciones',
  '/desarrollo-web-movil': '/servicios/software-a-medida',
  '/marketing-digital': '/servicios/marketing',
  '/investigacion-de-mercados': '/servicios/automatizaciones',
  '/roi-calculator': '/servicios/inteligencia-artificial',
  '/transformacion-digital': '/#ecosistema',
};

export default defineConfig({
  site: 'https://ionoshub.net',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/api/') })],
  redirects: legacyRedirects,
  vite: {
    plugins: [tailwindcss()],
  },
});
