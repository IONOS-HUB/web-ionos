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
- Agente IONIC del sitio: endpoint `src/pages/api/chat.ts` con Gemini. `src/lib/chat/` tiene el prompt, la base de conocimiento (generada desde `src/data/`), los límites y la sesión firmada. `prompt.ts`, `knowledge.ts` y `session.ts` son SÓLO de servidor: nunca los importes desde una isla de React o el prompt acabaría en el navegador; los textos visibles están en `chat/copy.ts`. El modelo nunca envía nada: el servidor valida el lead y la persona confirma. Pruebas: `node scripts/chat-smoke.mjs` con el servidor de desarrollo levantado. El panel crea las burbujas desde JavaScript, así que sus estilos van en `:global()`: con estilos con ámbito salen sin formato. El freno por IP usa Upstash si están `UPSTASH_REDIS_REST_*`, y si no un contador en memoria.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # .vercel/output (adapter Vercel)
npm run preview
```
