# Plan Técnico v2 — Rebuild IonosHub en Astro

Basado en [`PRDv2.md`](./PRDv2.md). Este documento traduce el PRD en una arquitectura concreta, orden de ejecución y decisiones técnicas para reconstruir el sitio desde cero.

## 0. Alcance y estrategia general

- Proyecto nuevo desde cero (no migración incremental del repo actual). Se recomienda crear el nuevo sitio en un repo/carpeta separada (`ionoshub-v2/`) y hacer el switch de dominio/deploy solo cuando v2 esté a paridad funcional con v1.
- Fuente de verdad para contenido: copy, casos de éxito, logos de clientes y bios del equipo del repo actual (`src/pages/servicios/*`, `src/components/HomeCases.tsx`, `src/components/ClientesCarousel.tsx`, `src/pages/Team.tsx` o equivalente). Se extraen como contenido (Markdown/JSON/Astro content collections), no se copia código.
- Criterio de "listo para lanzar": paridad de rutas + redirects legacy + Lighthouse ≥ 95 en mobile (Performance/SEO/Best Practices) + formulario de contacto funcionando end-to-end contra Resend.

## 1. Setup del proyecto

```bash
npm create astro@latest ionoshub-v2 -- --template minimal --typescript strict
cd ionoshub-v2
npx astro add react
npx astro add tailwind
npm install gsap
```

- `astro.config.mjs`: `output: 'static'`, integraciones `react()` y `tailwind()`, `site` apuntando al dominio de producción (necesario para sitemap/canonical).
- Añadir `@astrojs/sitemap` si v1 lo tenía o si SEO lo requiere (revisar `vercel.json`/`public/` actual para confirmar).
- Config de alias `@/` → `src/` en `tsconfig.json` (paridad con v1).

## 2. Estructura de carpetas propuesta

```
src/
  components/
    islands/          # componentes React con hidratación (client:*)
      ContactForm.tsx
      ClientesCarousel.tsx
      WhatsAppFloat.tsx
      AdvancedStats.tsx
    astro/             # componentes .astro estáticos (cero JS)
      Hero.astro
      PainPoints.astro
      EcosystemLego.astro
      Services.astro
      Steps.astro
      HomeTeam.astro
      HomeCases.astro
      FAQ.astro
      Footer.astro
      Navbar.astro
    ui/                # primitivas de diseño (Button, Badge, Card) en .astro cuando no requieren estado
  layouts/
    BaseLayout.astro   # <html>, meta tags, PageSeo equivalente, Navbar/Footer
    ServiceLayout.astro
  pages/
    index.astro
    equipo.astro
    casos-de-exito.astro
    blog-recursos.astro
    terminos-y-condiciones.astro
    politica-de-privacidad.astro
    servicios/
      estrategia-contenido.astro
      produccion-visual-audiovisual.astro
      pauta-publicidad-digital.astro
      ionic-agente-ia.astro
      software-a-medida.astro
      analitica-resultados.astro
    api/
      send-email.ts     # si se migra la función serverless a Astro API route
  content/
    casos-de-exito/     # content collection (Markdown/MDX o JSON)
    equipo/
    servicios/           # copy estructurado por servicio (frontmatter + body)
  lib/
    gsap/
      useScrollReveal.ts
      registerPlugins.ts
    whatsapp.ts          # helper para construir el link wa.me con encodeURIComponent
  styles/
    global.css           # tokens de color (blanco/azul/negro), fuentes
```

**Regla de decisión Astro vs. React**: si el bloque no necesita estado, eventos, ni animación imperativa, va en `.astro`. Solo se convierte a isla React (`client:visible` / `client:idle`) cuando hay interactividad real (formulario, carrusel con drag, contador animado, GSAP con estado). Esto es lo que baja el JS shipped a casi cero, que es la razón principal del rebuild (ver PRDv2 §Why Rebuild).

## 3. Sistema de diseño (Tailwind + tokens)

- `tailwind.config.ts`: reconstruir tokens de color solo con blanco/azul/negro + escala de grises. Eliminar `accent` (naranja) del v1.
  - `primary`: azul IonosHub (mantener el HSL de v1: `205 100% 37%` como base, revisar contraste contra fondo blanco/negro del nuevo sistema).
  - `ink` / `foreground`: negro casi puro para texto sobre blanco.
  - `surface`: blanco y grises muy claros para separación de secciones (evitar bordes duros, estilo Apple).
- Tipografía: definir stack en `global.css` (`-apple-system, "SF Pro Display", Inter, system-ui`) con escala tipográfica amplia (hero ≥ 64px desktop).
- Espaciado: aumentar el ritmo vertical vs. v1 (`py-28`/`py-32` en vez de `py-20`) para el look "aireado" de Apple.
- Documentar todo en `src/styles/global.css` + comentario de referencia a PRDv2 §Design System — no crear un archivo de tokens separado si Tailwind config ya lo cubre.

## 4. Animación (GSAP)

- `src/lib/gsap/registerPlugins.ts`: registra `ScrollTrigger` una sola vez, guardas por `prefers-reduced-motion`.
- Patrón por isla animada: componente React con `useEffect` + `gsap.context()` para cleanup automático en unmount/HMR.
- Directiva de hidratación recomendada para secciones con scroll-trigger: `client:visible` (no `client:load`) para no bloquear el render inicial.
- Secciones candidatas a choreografía GSAP (a confirmar en diseño, ver Open Questions del PRD):
  - Hero: fade-in-up + parallax sutil del fondo.
  - EcosystemLego: reveal secuencial de piezas al hacer scroll.
  - AdvancedStats: contadores animados al entrar en viewport.
  - Steps: pin de sección con progreso de scroll (opcional, evaluar costo/beneficio).
- Nada de animación bloqueante en el primer paint; todo detrás de `client:visible` o `IntersectionObserver`.

## 5. Contenido y datos

- Migrar copy de cada página de servicio a `src/content/servicios/*.md` (o `.json` si el copy es muy estructurado) usando Astro Content Collections con schema Zod (`title`, `slug`, `hero`, `bloques`, `cta`).
- Casos de éxito, logos de clientes y bios de equipo: mismo patrón de content collection, para que agregar/editar contenido no requiera tocar componentes.
- Imágenes: mover a `src/assets/` y usar `astro:assets` (`<Image />`) para optimización automática (AVIF/WebP, responsive) — mejora directa de LCP vs. v1.

## 6. Routing y SEO (paridad crítica con v1)

- Redirects legacy en `astro.config.mjs`:
  ```js
  redirects: {
    '/agentes-virtuales': '/servicios/ionic-agente-ia',
    '/business-intelligence': '/servicios/analitica-resultados',
    '/desarrollo-web-movil': '/servicios/software-a-medida',
    '/marketing-digital': '/servicios/pauta-publicidad-digital',
    '/investigacion-de-mercados': '/servicios/analitica-resultados',
    '/roi-calculator': '/servicios/ionic-agente-ia',
    '/transformacion-digital': '/#ecosistema',
  }
  ```
  Verificar que Astro genere 301 estáticos (no meta-refresh) — si no, replicar en `vercel.json` como en v1.
- `PageSeo` equivalente: componente `Seo.astro` reusado en `BaseLayout` con props `title`/`description`/`canonical`/`og:image` por página, calcado de metadata actual (extraer de `src/components/PageSeo.tsx` en v1 antes de borrar el repo viejo).
- Generar `sitemap.xml` vía `@astrojs/sitemap` y confirmar `robots.txt` en `public/`.

## 7. Formulario de contacto y backend

- Reusar `api/send-email.ts` tal cual (misma lógica Resend → `info@ionoshub.net`) o portarlo a `src/pages/api/send-email.ts` como Astro API route si el hosting Vercel lo soporta en modo `output: 'static'` con adapter `@astrojs/vercel`.
- El formulario en sí es una isla React (`client:idle` o `client:visible`) — es el único bloque de la home que justifica hidratación temprana.
- Mantener el mismo comportamiento de validación/estados (loading/success/error) que v1; no rediseñar la lógica, solo el look visual.

## 8. WhatsApp CTA

- Centralizar en `src/lib/whatsapp.ts` un helper `buildWhatsappLink(message: string)` que aplique `encodeURIComponent` y devuelva la URL completa a `wa.me/593992249152`. Todos los CTAs (botón flotante + CTAs inline) lo consumen, evitando duplicar el número/lógica como pasaba en v1.

## 9. Orden de implementación sugerido

1. Setup del proyecto + design tokens + `BaseLayout` + `Navbar`/`Footer` estáticos.
2. Home: Hero → PainPoints → EcosystemLego → Services → Steps (sin GSAP todavía, solo layout y contenido).
3. Contact form (isla React) + integración Resend — validar el flujo crítico de conversión temprano.
4. HomeTeam, HomeCases, AdvancedStats, ClientesCarousel, FAQ — completar funnel de la home.
5. Páginas de servicio (`/servicios/*`) usando `ServiceLayout` + content collections.
6. Páginas secundarias: `/equipo`, `/casos-de-exito`, `/blog-recursos`, legales.
7. Redirects legacy + SEO (sitemap, robots, metadata por página) — checklist de paridad contra v1.
8. Capa de animación GSAP sobre las secciones ya construidas (no antes, para no animar contenido que aún puede cambiar de estructura).
9. Auditoría de performance (Lighthouse, WebPageTest) + accesibilidad (`prefers-reduced-motion`, contraste del nuevo esquema blanco/azul/negro).
10. QA de paridad de rutas/redirects + smoke test del formulario en producción antes del switch de dominio.

## 10. Checklist de paridad (no lanzar sin esto)

- [ ] Las 6 rutas de servicio responden con el mismo contenido/objetivo que v1.
- [ ] Los 7 redirects legacy devuelven 301 al destino correcto.
- [ ] El formulario de contacto envía correctamente a `info@ionoshub.net` vía Resend.
- [ ] El CTA de WhatsApp abre `wa.me/593992249152` con mensaje pre-cargado y `rel="noopener noreferrer"`.
- [ ] Metadata (title/description/OG) por página coincide o mejora respecto a v1.
- [ ] Ningún testimonio/precio/dato nuevo fue inventado durante la migración de contenido.
- [ ] Lighthouse mobile: Performance/SEO/Best Practices ≥ 95.

## Decisiones pendientes (heredadas del PRD, a resolver antes del paso 8)

- Dark mode: mantener, quitar, o rediseñar como secciones oscuras puntuales.
- Qué secciones llevan pin/scrub de GSAP vs. simple fade-in-up.
- Fuente: stack de sistema vs. tipografía con licencia.
- Si se introduce Playwright para cubrir redirects + contact form (v1 no tenía tests).
