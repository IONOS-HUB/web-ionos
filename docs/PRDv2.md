# PRD v2 — IonosHub Rebuild (Astro)

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ecuadorian businesses broadly (SME through larger companies) exploring digital transformation. No single confirmed segment — the site targets any company in Ecuador evaluating a digital partner, not a narrowly defined persona. (Unchanged from v1 — no new research on hand.)

## Product Purpose

IonosHub is a digital consultancy offering a modular ecosystem of services — content strategy, paid advertising, a proprietary AI agent (IONIC), custom software, and analytics/results — that clients can adopt individually or combined. Success is measured by qualified leads booking a free diagnostic ("diagnóstico gratuito") and converting to engagements.

**What changes in v2:** the product and its content strategy stay the same. This is a full technical and visual rebuild — same offer, same funnel, same routes, new stack and new design language. The rebuild is not an opportunity to redefine positioning or add unvalidated claims; it's an opportunity to make the site faster, more fluid, and more premium-feeling.

## Positioning

Unchanged: a modular ecosystem, not a rigid agency bundle. Clients choose only the services they need (content, pauta/ads, IONIC, software a medida, analítica), and the pieces interoperate. This is explicitly the differentiator over agencies selling fixed packages.

The v2 visual language should reinforce this positioning: an Apple-style minimalist aesthetic (generous whitespace, restrained palette, confident typography, precise motion) signals the same "considered, modular, high-craft" story that the copy already tells — rather than looking like a generic agency template.

## Operating Context

- Same six core service lines, same routes under `/servicios/*`: `estrategia-contenido`, `produccion-visual-audiovisual`, `pauta-publicidad-digital`, `ionic-agente-ia`, `software-a-medida`, `analitica-resultados`. Routes are load-bearing and must not change.
- Legacy URL redirects must be preserved 1:1 in the new routing layer: `/agentes-virtuales` → `/servicios/ionic-agente-ia`, `/business-intelligence` → `/servicios/analitica-resultados`, `/desarrollo-web-movil` → `/servicios/software-a-medida`, `/marketing-digital` → `/servicios/pauta-publicidad-digital`, `/investigacion-de-mercados` → `/servicios/analitica-resultados`, `/roi-calculator` → `/servicios/ionic-agente-ia`, `/transformacion-digital` → `/#ecosistema` (or `/#ecosistema` equivalent anchor on the new home). SEO/link equity from the prior IA must be preserved — same rules apply as v1, now implemented as Astro redirects/rewrites instead of React Router `<Navigate>`.
- Primary conversion path unchanged: homepage → contact form (`#contacto`) → free diagnostic. WhatsApp float CTA remains the secondary always-on contact channel (`wa.me/593992249152`).
- Homepage funnel order is preserved as the default hypothesis, now re-expressed as Astro islands: Hero → PainPoints → EcosystemLego → Services → Steps → HomeTeam → HomeCases → AdvancedStats → ClientesCarousel → FAQ → ContactForm. Section order may be revisited only if there's a specific reason tied to the new design system (e.g. GSAP scroll choreography), not by default.
- Also has: team page (`/equipo`), case studies (`/casos-de-exito`), blog/resources (`/blog-recursos`), legal pages (`/terminos-y-condiciones`, `/politica-de-privacidad`).

## Why Rebuild (Rationale)

- **Framework fit**: the current site is a fully client-rendered Vite SPA for content that is overwhelmingly static/marketing-oriented. Astro's island architecture ships near-zero JS by default and hydrates only the interactive pieces (forms, carousels, animated sections), which should materially improve Core Web Vitals (LCP, TBT) versus the current React-everywhere SPA.
- **Modular architecture**: Astro's component islands map naturally to the "modular ecosystem" positioning — each service, each section, each interactive widget is an independently hydrated island, mirroring the product story at the architecture level.
- **Design refresh**: current UI uses a blue/orange accent system with card-heavy, animation-heavy sections (see `src/components/animations`, `MagnetLines`, `LogoLoop`, `StaggeredMenu`, `CursorFollower`). v2 replaces this with a restrained Apple-style minimalist system — white/blue/black only, no orange accent — with GSAP-driven scroll storytelling replacing the current mixed animation approach.
- **Fresh implementation, not a port**: the user wants to rebuild from zero rather than migrate component-by-component. Existing copy, case studies, client logos, and team bios are reused as content (see Evidence on Hand); component code and visual design are not carried over.

## Capabilities and Constraints (v2 target stack)

- **Framework**: Astro (latest stable), with React integration (`@astrojs/react`) used selectively for interactive islands — forms, carousels, animated/stateful widgets. Static marketing content (hero copy, service descriptions, footers) should be plain Astro components with zero JS shipped, per Astro's island philosophy.
- **Styling**: Tailwind CSS (via `@astrojs/tailwind`), carrying forward the token-based approach from v1 (`tailwind.config.ts` + CSS custom properties) but with a new, reduced palette (see Design System below).
- **Animation**: GSAP + ScrollTrigger for scroll-driven reveals, pinning, and transitions. GSAP timelines should live inside React islands (or Astro's `<script>` client directives) and respect `prefers-reduced-motion`. This replaces the current mix of Tailwind keyframe animations, Framer Motion, and custom cursor/lego components.
- **Rendering strategy**: static output (`output: 'static'`) for all marketing pages — no need for SSR since there's no per-user dynamic content. The contact form remains the only piece that talks to a backend.
- **Backend**: keep the existing Vercel serverless function pattern (`api/send-email.ts` using Resend to `info@ionoshub.net`), or migrate it to an Astro API route (`src/pages/api/send-email.ts`) if deploying as a hybrid Astro app on Vercel. Either way: same recipient, same provider, no new fabricated integrations.
- **Routing**: Astro's file-based routing (`src/pages/`) replaces React Router. Legacy redirects are implemented via `astro.config.mjs` `redirects` config (or Vercel `vercel.json` rewrites, matching current deployment setup) rather than in-app `<Navigate>` components.
- **No test suite** in v1; decide during technical planning whether v2 introduces one (e.g. Playwright for the contact form + redirect behavior) — not assumed by default.
- **Deployment**: Vercel, same as today. `vercel --prod` for production, `vercel` for preview.

## Design System (Apple-minimalist, IonosHub colors)

- **Palette**: strictly white, blue, black (plus neutral grays for text hierarchy). Drop the orange `--accent` token entirely — v1's accent orange does not fit the Apple-minimalist direction. Blue carries all emphasis/CTA weight (primary buttons, links, active states); black/near-black for headings on light backgrounds; white and light-gray surfaces for section backgrounds and cards.
- **Typography**: one confident, high-contrast sans-serif (system-ui/SF-Pro-style stack, or a licensed equivalent) with generous size steps between hero/heading/body — Apple's typographic scale relies on restraint and whitespace, not decoration.
- **Spacing & layout**: generous whitespace, wide section padding (larger than v1's `py-20`), single-column focus on mobile, large breakpoints for desktop. Cards should be flatter and lighter (subtle borders/shadows) rather than v1's heavier gradient/glow card style.
- **Motion language**: fluid, physics-based GSAP easing (no bouncy/playful easing) — reveal-on-scroll, parallax depth, and pinned scroll sequences that feel restrained and premium, not attention-grabbing. Motion should support content hierarchy (what to look at next), not decorate for its own sake.
- **Dark mode**: decide during design phase whether to carry forward v1's class-based dark mode or ship light-only for v2, given the Apple-marketing-site reference point is typically light-first with selective dark sections (not a full dark-mode toggle).

## Brand Commitments (unchanged)

- Spanish-only copy (Ecuador/LatAm market) — no bilingual or English variants.
- Professional, consultative tone — not casual or playful.
- Name "IonosHub" and product name "IONIC" (the AI agent) are fixed identifiers.
- WhatsApp CTAs continue to use `https://wa.me/593992249152?text=...` with `encodeURIComponent` on the message and `rel="noopener noreferrer"` on the anchor.

## Evidence on Hand

- Real service copy, case studies (`/casos-de-exito`), client logos (`ClientesCarousel`), and team bios (`/equipo`) exist in the current codebase and should be carried forward as content, re-laid-out in the new design system. No confirmed testimonials, pricing, or benchmark data beyond what's already in the repo — the rebuild must not fabricate these just because it's a fresh start.
- Current component inventory (`src/components/`, `src/pages/servicios/*`) is the source of truth for what content/sections exist today; use it as a checklist when rebuilding, not as a code reference to port.

## Product Principles (unchanged, restated for v2)

- Modularity over bundling: every surface — now literally every Astro island — should make it legible that services can be adopted independently or combined.
- Outcome-oriented trust: "de datos a resultados" — design and copy should support measurable, credible claims, not vague promises. The new minimalist design should amplify this via clean data/stat presentation (`AdvancedStats` equivalent), not undercut it with decoration.
- Low-friction path to the free diagnostic: the contact form and WhatsApp CTA are the product's primary conversion mechanisms and must stay above-the-fold-reachable and prominent regardless of how much the visual language changes.
- Preserve SEO equity: legacy routes and metadata are load-bearing, not incidental — this is the one area where the rebuild must be a strict superset of v1 behavior, not a reinterpretation.
- Performance as a feature: since the entire point of moving to Astro is shipping less JS, v2 should treat Lighthouse/Core Web Vitals scores as a product principle, not an afterthought — every new island should justify its hydration cost.

## Open Questions for Technical Planning (not yet decided)

- Exact GSAP choreography per section (which sections pin, which parallax, which simply fade-in-up).
- Whether service pages (`/servicios/*`) stay lazy-hydrated islands per-page or fully static with only the contact CTA hydrated.
- Dark mode: keep, drop, or redesign as light-first with dark accent sections.
- Whether to introduce a test suite (Playwright) for redirects + contact form, given v1 had none.
- Font choice: system stack vs. licensed Apple-adjacent typeface.
