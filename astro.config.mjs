// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { FontaineTransform } from 'fontaine';

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
  '/webinars/ia-en-tu-trabajo': '/webinars',
};

export default defineConfig({
  site: 'https://ionoshub.net',
  /**
   * Una URL por página, sin barra final. Sin esto, `/equipo` y `/equipo/` respondían 200 las dos y
   * el sitemap listaba la versión CON barra mientras el canónico de esa misma página apuntaba a la
   * versión SIN barra: cada URL del sitemap se declaraba duplicada de otra, y Search Console las
   * dejó todas en "Descubierta: actualmente sin indexar". Con 'never', el sitemap sale sin barra y el
   * adapter de Vercel responde 308 de `/x/` a `/x`, igual que ya hacen enlaces, canónicos y 301.
   */
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  // Fuera del sitemap: las landings de pauta y el cuestionario de clientes (páginas ocultas, noindex).
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes('/api/') && !page.includes('/speed-to-lead') && !page.includes('/cuestionario-web') }),
  ],
  redirects: legacyRedirects,
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [
      tailwindcss(),
      // Fallback con métricas ajustadas (size-adjust, ascent/descent) para que el cambio de fuente no mueva nada.
      FontaineTransform.vite({ fallbacks: ['Arial', 'Helvetica Neue', 'Segoe UI'], resolvePath: (id) => new URL('./public' + id, import.meta.url) }),
    ],
  },
});
