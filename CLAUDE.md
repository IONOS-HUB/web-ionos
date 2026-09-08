# CLAUDE.md

Sitio comercial de IonosHub (Astro 7 estático + islas React + Tailwind v4, deploy en Vercel; motion propia sin librerías: `src/scripts/motion.ts` + `motion-scroll.ts`).

- La verdad de producto vive en `PRODUCT.md`; el sistema visual, en `DESIGN.md`. Léelos antes de tocar UI o copy.
- Contenido editable: `src/data/` (pilares, casos, equipo, clientes, FAQ, conversaciones de demostración).
- Componentes de página en `src/components/home/`, demostraciones por pilar en `src/components/demos/`, islas React en `src/components/islands/`.
- Rutas legacy → 301 en `astro.config.mjs` (`legacyRedirects`). No cambiar slugs de pilar sin actualizar ese mapa.
- El formulario envía a `src/pages/api/lead.ts` (reenvía al webhook de n8n definido en `LEAD_WEBHOOK_URL`; ver `.env.example`).
- Nunca inventar métricas, testimonios ni precios. Las demostraciones llevan etiqueta "Demostración" y datos ficticios.
- Blog: un Markdown por artículo en `src/content/blog/` (esquema en `src/content.config.ts`). Para uno nuevo, copia `_plantilla.md` con un nombre sin guion bajo; el nombre del archivo es la URL bajo `/blog-recursos/`. `draft: true` lo oculta. Cifras siempre con fuente.
- SEO/AEO: `public/robots.txt` (permite rastreadores de IA), `public/llms.txt` (resumen del negocio para modelos; actualízalo si cambian pilares, casos o equipo), JSON-LD en `BaseLayout`, `FAQ.astro` y las páginas de blog.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # .vercel/output (adapter Vercel)
npm run preview
```
