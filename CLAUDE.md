# CLAUDE.md

Sitio comercial de IonosHub (Astro 7 estático + islas React + Tailwind v4, deploy en Vercel; motion propia sin librerías: `src/scripts/motion.ts` + `motion-scroll.ts`).

- La verdad de producto vive en `PRODUCT.md`; el sistema visual, en `DESIGN.md`. Léelos antes de tocar UI o copy.
- Contenido editable: `src/data/` (pilares, casos, equipo, clientes, FAQ, conversaciones de demostración).
- Componentes de página en `src/components/home/`, demostraciones por pilar en `src/components/demos/`, islas React en `src/components/islands/`.
- Rutas legacy → 301 en `astro.config.mjs` (`legacyRedirects`). No cambiar slugs de pilar sin actualizar ese mapa.
- Nichos del pilar de IA: un sector = un objeto en `src/data/niches.ts`, y de ahí salen el selector del hero (`NicheSelector.astro`), las páginas `/servicios/inteligencia-artificial/<slug>`, la ventanilla por sector (`demos/NicheDemo.astro`), el JSON-LD, `llms.txt` y el ajuste de tono del agente IONIC. Un nicho sólo entra si tiene demostración, léxico y **líneas rojas** propios; si lo único que cambia es el nombre del negocio, es la misma página repetida. El sector viaja al chat como `data-nicho` y `/api/chat` sólo acepta los ids conocidos.
- El formulario envía a `src/pages/api/lead.ts`. Toda entrega de leads (formulario, chat, webinars, landings) pasa por `deliverLead()` en `src/lib/lead.ts`, que reenvía a n8n (`LEAD_WEBHOOK_URL`) y a GoHighLevel (`GHL_WEBHOOK_URL`, JSON aplanado por `toGhl()`); ver `.env.example`.
- Landings de pauta "speed to lead": una variante = un objeto en `src/data/landings.ts` → una página de registro de una sola pantalla por variante en `src/pages/speed-to-lead/` (`index`, `instituciones`, `clinicas`; componentes en `src/components/landing/`). Son sólo para tráfico de pauta: se llega por URL directa, **ningún enlace del sitio apunta a ellas** (ni nav ni footer), son noindex y están fuera del sitemap; `BaseLayout landing` quita navegación, pie, chat y pop-up. Endpoint `/api/speed-to-lead`. Testimonios sólo desde `src/data/testimonials.ts` (vacío hasta tener reales). Videos de fondo y mapeo GHL: `docs/SPEED-TO-LEAD.md`.
- Nunca inventar métricas, testimonios ni precios. Las demostraciones llevan etiqueta "Demostración" y datos ficticios.
- Blog: un Markdown por artículo en `src/content/blog/` (esquema en `src/content.config.ts`). Para uno nuevo, copia `_plantilla.md` con un nombre sin guion bajo; el nombre del archivo es la URL bajo `/blog-recursos/`. `draft: true` lo oculta. Cifras siempre con fuente.
- Webinars: una edición = un objeto en `src/data/webinars.ts`; el índice, la página, el pop-up de promoción y los datos estructurados salen de ahí y el estado (próximo o pasado) se deduce de la fecha. El registro va al mismo webhook con `canal: webinar`. Guía: `docs/WEBINARS.md`; para publicar uno nuevo, la skill `/webinar`.
- Teléfonos: el selector de país (`src/components/islands/SelectorPais.tsx`) usa `src/data/paises.ts`, que es **generado**: `npm run paises` lo rehace desde libphonenumber (dependencia de desarrollo, nunca llega al navegador). Las banderas son emoji; Windows no los trae, por eso `global.css` declara la tipografía Twemoji Country Flags autoalojada y la aplica a `.bandera`.
- SEO/AEO: `public/robots.txt` (permite rastreadores de IA), `public/llms.txt` (resumen del negocio para modelos; actualízalo si cambian pilares, casos o equipo), JSON-LD en `BaseLayout`, `FAQ.astro` y las páginas de blog.
- Agente IONIC del sitio: endpoint `src/pages/api/chat.ts` con Gemini. `src/lib/chat/` tiene el prompt, la base de conocimiento (generada desde `src/data/`), los límites y la sesión firmada. `prompt.ts`, `knowledge.ts` y `session.ts` son SÓLO de servidor: nunca los importes desde una isla de React o el prompt acabaría en el navegador; los textos visibles están en `chat/copy.ts`. El modelo nunca envía nada: el servidor valida el lead y la persona confirma. Pruebas: `node scripts/chat-smoke.mjs` con el servidor de desarrollo levantado. El panel crea las burbujas desde JavaScript, así que sus estilos van en `:global()`: con estilos con ámbito salen sin formato. El freno por IP usa Upstash si están `UPSTASH_REDIS_REST_*`, y si no un contador en memoria.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # .vercel/output (adapter Vercel)
npm run preview
```
