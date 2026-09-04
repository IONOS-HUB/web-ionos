# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (última estable, `output: 'static'`) + islas React (`@astrojs/react`) solo para piezas interactivas + Tailwind CSS + GSAP/ScrollTrigger. Deploy en Vercel. Confirmado por el usuario el 2026-09-03 sobre la base de PRDv2.md. El proyecto v2 vive en `ionoshub-v2/` (hermano del repo v1 `ionos-hub-connect-main/`); el switch de dominio ocurre solo al alcanzar paridad de rutas y redirects.

## Users

Administradores y dueños de pequeñas y medianas empresas en Ecuador (sede IonosHub: Ibarra, Imbabura; competencia directa en Quito) que evalúan un socio digital. Situación típica: procesos manuales, leads que se pierden por saturación, presencia digital fragmentada. El trabajo que quieren hacer: entender rápido qué puede automatizar o vender mejor su negocio y **agendar una cita** para que se lo expliquen. No hay un segmento vertical confirmado; los casos reales cubren restaurante, retail digital, educación, veterinaria/spa canino y comunidades de formación.

## Product Purpose

IonosHub es una agencia que vende el **ecosistema completo** de automatización y marketing a PyMEs, organizado en cuatro pilares:

1. **IA** — agentes conectados a Instagram, Facebook y WhatsApp; **IA de voz (IVR)** que responde llamadas 24/7, agenda citas, toma pedidos y envía recordatorios (ideal para consultorios y clínicas); el agente es un **clasificador multifunción**: entiende audios, imágenes y documentos, consulta inventario, hace llamadas y se conecta a sistemas externos; botones de IA embebidos en sistemas y sitios web; LLMs avanzados conectados por API a servidores y CRMs. El agente propio se llama **IONIC**. El chat es sólo uno de sus canales; no todo es chat.
2. **Automatizaciones** — **CRM unificado** que centraliza todos los leads de todos los canales; CRM a medida y transaccional; **CRM simplificado para consultorios** con el que los doctores gestionan pacientes y envían recordatorios fácilmente; rutinas/ejecuciones que reemplazan trabajo manual diario (flujos tipo Zapier/n8n, análisis de Excel); **dashboards a medida** que miden trazabilidad y rentabilidad del negocio mediante KPIs.
3. **Marketing** — pauta digital, cobertura de eventos, creación de contenido digital, optimización de campañas, creación de conjuntos de anuncios, landing pages a medida, y todo el entorno de Meta.
4. **Software a medida en tiempo récord** — sistemas integrales entregados en 30 días (calificaciones, facturación, cursos en línea, etc.).

Éxito = un administrador de negocio agenda una cita (diagnóstico gratuito) por formulario o WhatsApp y se convierte en cliente.

## Positioning

Todo el ecosistema (IA + automatización + marketing + software) a un precio más asequible que las agencias de Quito, porque IonosHub se dedica a medianas e incluso pequeñas empresas. Un competidor que vende paquetes fijos o cobra tarifas de gran empresa no puede copiar esa combinación. Refuerzos verificables: **Meta Tech Provider** (conexiones oficiales por API y certificaciones que avalan el partnership), **partner de Zapier** y **partner de Anthropic (Claude)** (declarados por el usuario el 2026-09-03; sellos pendientes de entrega, se muestran como texto), y **entrega de software en 30 días**.

Competidores directos nombrados por el usuario: Solution y Estratos (Quito), Eclíptica. No se los menciona en el sitio; sirven como referencia de contraste.

Tagline de marca: "De datos a resultados".

## Operating Context

- **Arquitectura de información v2 (decidida 2026-09-03):** navegación y home organizadas por los 4 pilares, con una página por pilar. Las 6 rutas de servicio de v1 (`/servicios/estrategia-contenido`, `/servicios/produccion-visual-audiovisual`, `/servicios/pauta-publicidad-digital`, `/servicios/ionic-agente-ia`, `/servicios/software-a-medida`, `/servicios/analitica-resultados`) y los 7 redirects legacy (`/agentes-virtuales`, `/business-intelligence`, `/desarrollo-web-movil`, `/marketing-digital`, `/investigacion-de-mercados`, `/roi-calculator`, `/transformacion-digital`) deben responder **301** hacia el pilar correspondiente. El mapa ruta→pilar se fija al definir los slugs de los pilares.
- **Conversión primaria:** formulario de contacto (`#contacto`) → agendar cita/diagnóstico gratuito. **Secundaria, siempre visible:** WhatsApp `https://wa.me/593992249152?text=...` con `encodeURIComponent` y `rel="noopener noreferrer"`. El formulario debe estar bien establecido, claro e intuitivo: es el objetivo comercial del sitio.
- **Backend:** una función serverless en Vercel con Resend enviando a `info@ionoshub.net` (patrón de v1 `api/send-email.ts`). Mismo proveedor y destinatario; la API key pasa a variable de entorno, nunca hardcodeada como en v1.
- **Páginas adicionales:** equipo (`/equipo`), casos de éxito (`/casos-de-exito`), blog/recursos (`/blog-recursos`), legales (`/terminos-y-condiciones`, `/politica-de-privacidad`), 404.
- **No se publican tarifas.** El FAQ de v1 lo establece: cada ecosistema se arma tras un diagnóstico; el CTA es agendar. La asequibilidad se comunica como posicionamiento, no como número.

## Capabilities and Constraints

- Salida estática; solo el formulario habla con backend. Cada isla React debe justificar su hidratación (Core Web Vitals es principio de producto).
- Copy solo en español (Ecuador/LatAm). Sin variantes en inglés.
- Sin suite de tests en v1; introducir Playwright para redirects + formulario queda **por decidir**.
- Dark mode: **por decidir** (v1 tenía toggle por clase; PRDv2 sugiere light-first con secciones oscuras puntuales).
- Terminología fija: "IonosHub", "IONIC", "diagnóstico gratuito", "ecosistema", "pilares".
- Fuente del equipo v1 con `metaTitle`/`metaDescription`/`waMessage` por servicio: `ionos-hub-connect-main/src/data/services.ts`. Reutilizar la metadata al construir los redirects y las páginas de pilar.

## Brand Commitments

- **Brandbook Ionos 2025 es vinculante** (`ionos-hub-connect-main/public/imgs/Brandbook Ionos 2025.png`): wordmark "IONOS" en azul cobalto con un robot dentro de la segunda "O", "HUB" vertical en contorno, tagline "DE DATOS A RESULTADOS", motivo de ondas azules degradadas sobre blanco. Logo en `public/imgs/logo.png`, ícono en `public/imgs/icon.png`.
- Paleta de marca: azul cobalto sobre blanco. PRDv2 elimina el acento naranja de v1. Detalles tonales se deciden en DESIGN.md, no aquí.
- Tono: comercial, directo y con llamada a la acción; intuitivo, dinámico y amigable; que capte la atención del administrador de un negocio. Sigue siendo profesional (no infantil), pero **menos consultivo-sobrio que v1**.
- **Registro de energía visual (decidido 2026-09-03): híbrido.** Base blanca, aireada y limpia (herencia del PRDv2 "Apple minimalista"), con picos de energía comprometidos en hero, CTAs y secciones clave: azul intenso a escala de página y motion fuerte con propósito. Ni sobriedad total ni ruido constante.
- Nombres fijos: "IonosHub", "IONIC".
- Sede: Ibarra, Imbabura, Ecuador. Email público: `info@ionoshub.net`.

## Evidence on Hand

Todo en `ionos-hub-connect-main/` (repo v1, solo como fuente de contenido, no de código):

- **6 casos de éxito reales, vigentes** (`src/data/cases.ts`): El Chipotle (restaurante, 0→leads por WhatsApp), Zona Gamers (retail digital, 5 h→10 min por automatización), Ecu593 English (educación, sistema por roles), Pawau (spa canino, IONIC 24/7 por WhatsApp), U.E. Católica "La Victoria" (educación, redes + cobertura), Comunidad de la IA Perú (talleres en Skool). Sus cifras son las únicas métricas publicables.
- **7 logos de clientes** (`public/imgs/clientes/`): El Chipotle, Zona Gamers, Santa Lucía, Mia Nonna, Distribuidora Hernández, Mafercano, ITSI.
- **6 miembros del equipo con foto y bio** (`src/data/team.ts`, `public/imgs/equipo/`): Orlidan Montesdeoca (Director Ejecutivo, cofundador), Cristhian Recalde (Director Financiero y Operaciones, cofundador), Alan Rodríguez (PMO), David Villarreal (Automatizaciones y Desarrollo Web), Camila Navarrete (CMO), Domenica Alvarez (Representante de Marca).
- **3 certificaciones cloud** con emblema (`public/imgs/certificados/`): Microsoft Azure, Google Cloud, Oracle Cloud.
- **Capturas de producto real**: dashboards (`public/imgs/dashboards/*`, `fotoDashboards.webp`), apps móviles (`imgsMovil/`), apps web (`imgsWeb/`), agente virtual (`agenteVirtual.png`, `adanRobot.png`, `cajeraRestaurante.png`).
- **Copy de servicios, problemas, incluye, FAQs y metadata SEO** (`src/data/services.ts`, `src/components/FAQ.tsx`, `src/components/PainPoints.tsx`).
- **Meta Tech Provider:** el usuario confirmó que tiene el badge oficial / listado en el directorio de Meta y lo entregará. Hasta recibirlo, se referencia en texto y se deja el slot del sello sin inventar un emblema.
- **Partner de Zapier y partner de Anthropic (Claude):** declarados por el usuario; se muestran como etiquetas de texto hasta recibir los sellos oficiales.
- **Demostraciones de producto en el sitio** (bandeja de IONIC, transcripción de llamada IVR, clasificador de audios/imágenes/documentos, flujo de nodos, conjuntos de anuncios, dashboard de KPIs) son **datos ficticios etiquetados como demostración**; nunca métricas reales de clientes.

**Ausencias que no se deben fabricar:**
- Los 6 testimonios de v1 (`src/components/Testimonials.tsx`: TechStore Ecuador, BankSolutions, FashionRetail SA, LogisticsPro, HealthCare Plus, LegalTech Ecuador) **no fueron confirmados como reales** → se excluyen por completo.
- No hay precios, benchmarks, cantidad de clientes, ni premios más allá de lo listado.
- **Testimonios reales nuevos:** el usuario los entregará (nombre, empresa, cita). Hasta recibirlos, la sección de testimonios se construye con estructura lista y **sin contenido**, jamás con placeholders que parezcan reales.

## Product Principles

- **Una cita es el resultado.** Cada superficie termina en agendar; formulario y WhatsApp siempre alcanzables y claros.
- **Ecosistema, no servicios sueltos.** Los 4 pilares se muestran como piezas que se combinan; cada pilar debe dejar claro que se puede empezar por uno.
- **Prueba real sobre decoración.** Casos con cifras verificables, capturas de producto, logos y equipo real cargan la credibilidad; nada inventado.
- **Asequible y rápido, dicho sin números.** "Para PyMEs", "en 30 días", "Meta Tech Provider" son los argumentos; nunca una tarifa.
- **Rápido de verdad.** Salida estática, mínimo JS, SEO legacy preservado como superconjunto estricto de v1.

## Accessibility & Inclusion

Sin requisito normativo específico. Mínimos comprometidos: contraste AA del azul de marca sobre blanco, `prefers-reduced-motion` respetado en toda la choreografía GSAP, formulario operable por teclado con errores anunciados.
