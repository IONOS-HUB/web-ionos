# CLAUDE.md

Sitio comercial de IonosHub (Astro 7 estático + islas React + Tailwind v4 + GSAP, deploy en Vercel).

- La verdad de producto vive en `PRODUCT.md`; el sistema visual, en `DESIGN.md`. Léelos antes de tocar UI o copy.
- Contenido editable: `src/data/` (pilares, casos, equipo, clientes, FAQ, conversaciones de demostración).
- Componentes de página en `src/components/home/`, demostraciones por pilar en `src/components/demos/`, islas React en `src/components/islands/`.
- Rutas legacy → 301 en `astro.config.mjs` (`legacyRedirects`). No cambiar slugs de pilar sin actualizar ese mapa.
- El formulario envía a `src/pages/api/lead.ts` (Resend y/o webhook por variables de entorno; ver `.env.example`).
- Nunca inventar métricas, testimonios ni precios. Las demostraciones llevan etiqueta "Demostración" y datos ficticios.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # .vercel/output (adapter Vercel)
npm run preview
```
