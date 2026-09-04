# IonosHub v2

Sitio comercial de IonosHub reconstruido desde cero con **Astro 7** (salida estática), **islas React** solo donde hay interactividad, **Tailwind CSS v4** y **GSAP** para el movimiento. Desplegado en **Vercel**.

La verdad de producto vive en [`PRODUCT.md`](./PRODUCT.md); el sistema visual, en [`DESIGN.md`](./DESIGN.md).

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera .vercel/output (adapter Vercel)
npm run preview
```

## Estructura

```
src/
  pages/
    index.astro                 # Home: hero con la bandeja de IONIC, pilares, casos, proceso, equipo, FAQ, contacto
    servicios/[slug].astro      # 4 páginas de pilar (IA, automatizaciones, marketing, software a medida)
    equipo.astro · casos-de-exito.astro · blog-recursos.astro
    politica-de-privacidad.astro · terminos-y-condiciones.astro · 404.astro
    api/lead.ts                 # Endpoint del formulario (Resend y/o webhook, por variables de entorno)
  components/
    home/*.astro                # Secciones de la home (cero JS)
    islands/IonicInbox.tsx      # Bandeja animada del hero (client:load)
    islands/ContactForm.tsx     # Formulario con validación y estados (client:idle)
    Nav.astro · Footer.astro · WhatsAppFloat.astro · Icon.astro · SectionHeading.astro
  data/
    pillars.ts · cases.ts · team.ts · site-content.ts · inbox.ts
  layouts/BaseLayout.astro      # <head>, SEO, JSON-LD, nav, footer, WhatsApp flotante, motion
  scripts/motion.ts             # Reveals, contadores y línea de progreso (respeta prefers-reduced-motion)
  styles/global.css             # Tokens (@theme), utilidades btn/chip/bubble, base
public/imgs/                    # Logos, equipo, clientes, certificados (heredados de v1)
```

## Redirects legacy

Definidos en `astro.config.mjs` (`redirects`). El adapter de Vercel los convierte en 301 reales. Las 6 rutas `/servicios/*` de v1 y los 7 caminos históricos apuntan a la página de pilar correspondiente.

## Formulario de contacto

`POST /api/lead` valida, descarta bots (honeypot `website`) y entrega el lead por los canales configurados en `.env` (ver `.env.example`). Nunca escribas claves en el código.

## QA visual

`?nomotion=1` en cualquier URL desactiva las animaciones de entrada (útil para capturas y regresión visual).
