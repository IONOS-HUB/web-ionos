---
name: IonosHub v2
description: La Bandeja de IONIC — blanco aireado, cobalto en campos enteros, hielo para lo entrante, tinta azul-negra.
colors:
  canvas: "#ffffff"
  ice: "#e9f1fc"
  ice-2: "#d7e6fa"
  ice-3: "#f4f8fe"
  cobalt: "#0e5fcb"
  cobalt-deep: "#0a47a0"
  cobalt-ink: "#083a7a"
  cobalt-glow: "#3f86e6"
  ink: "#0f1722"
  ink-2: "#33415a"
  ink-3: "#5b6b85"
  line: "#d4deed"
  line-soft: "#e6edf7"
  night: "#0b1b33"
  night-2: "#102647"
  night-line: "#1f3a63"
  night-text: "#b8cbe8"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.2rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96, 'wdth' 96"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96, 'wdth' 96"
  title:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  data:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
    fontFeature: "tabular-nums lining-nums"
  caption:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.025em"
  metric:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 4.6vw, 3.8rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "tabular-nums lining-nums"
rounded:
  bubble-tail: "0.35rem"
  focus: "6px"
  node: "0.75rem"
  field: "1rem"
  bubble: "1.125rem"
  card: "1.25rem"
  panel: "1.5rem"
  window: "1.75rem"
  pill: "999px"
spacing:
  xs: "0.5rem"
  row: "0.625rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  section: "5rem"
  section-lg: "7rem"
  wrap-max: "78rem"
  wrap-gutter: "clamp(1.25rem, 4vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3.25rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
    textColor: "{colors.canvas}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3.25rem"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "{colors.ice-3}"
    textColor: "{colors.cobalt}"
  button-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3.25rem"
    typography: "{typography.label}"
  button-on-dark-hover:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.cobalt-ink}"
  chip:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0 0.7rem"
    height: "1.85rem"
  chip-on:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 0.7rem"
    height: "1.85rem"
  chip-on-cobalt:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0 0.7rem"
    height: "1.85rem"
  chip-on-night:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.pill}"
    padding: "0 0.7rem"
    height: "1.85rem"
  badge-partner:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    typography: "{typography.label}"
  badge-partner-ice:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    typography: "{typography.label}"
  badge-partner-quiet:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.875rem"
  bubble-in:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "0.625rem 0.875rem"
  bubble-out:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.bubble}"
    padding: "0.625rem 0.875rem"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.75rem"
  card-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.panel}"
    padding: "1.75rem"
  demo-window:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "0"
  demo-header:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    padding: "0.75rem 1rem"
    typography: "{typography.label}"
  demo-footer:
    backgroundColor: "{colors.ice-3}"
    textColor: "{colors.ink-3}"
    padding: "0.75rem 1rem"
    typography: "{typography.caption}"
  node:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.node}"
    padding: "0.45rem 0.65rem"
  node-core:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.node}"
    padding: "0.75rem"
  node-target:
    backgroundColor: "{colors.ice-3}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.node}"
    padding: "0.75rem"
  progress-track:
    backgroundColor: "{colors.ice-2}"
    rounded: "{rounded.pill}"
    height: "0.5rem"
  progress-fill:
    backgroundColor: "{colors.cobalt}"
    rounded: "{rounded.pill}"
    height: "0.5rem"
  icon-disc:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    size: "2rem"
  icon-disc-cobalt:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    size: "2rem"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.875rem 1rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.875rem"
  nav-link-active:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.875rem"
---

# Design System: IonosHub v2

## Overview

**Creative North Star: "La Bandeja de IONIC"**

El sitio es la bandeja de mensajes de un negocio con IONIC trabajando en vivo. Todo el sistema visual nace de esa imagen: una superficie blanca y aireada (el lienzo del teléfono), campos enteros de cobalto donde la marca se compromete (la cabecera de la bandeja, los CTAs, la ola del hero, la portada de cada pilar), azul hielo para lo que entra (burbujas del cliente, fondos de sección alternos, chips en reposo) y una tinta azul-negra para leer. La banda oscura de casos usa un azul noche, nunca negro puro, para que hasta lo oscuro siga siendo azul.

Desde la ronda de corrección, la bandeja ya no es la única "pantalla": cada pilar se demuestra con su propia ventanilla (una llamada transcrita con onda de audio, un flujo de nodos hacia un CRM con su tabla de KPIs, una campaña con conjuntos de anuncios y barras de presupuesto, un bloque cobalto de "30 días"). Todas comparten la misma anatomía que la bandeja: cabecera cobalto con disco de icono y badge "Demostración", cuerpo blanco con filas divididas por línea suave, pie en hielo 3. La ventanilla es el contenedor firma del sistema; la bandeja es su primera instancia.

La densidad es de página comercial que se lee en el celular entre clientes: secciones separadas por 80–112 px, un ancho máximo de 78 rem, titulares grandes y cortos, y una sola familia tipográfica (Bricolage Grotesque Variable) que hace de display, cuerpo, etiqueta y dato. El registro es híbrido: base limpia con picos de energía donde importa (hero, CTAs, banda de casos, ventanillas de pilar) y motion con propósito que siempre parte de un estado visible.

Rechazos confirmados por el build: no hay naranja ni ningún segundo acento cromático; no hay kickers ni eyebrows sobre titulares; no hay sombras duras ni bordes gruesos decorativos; no hay tipografías del sistema; no hay iconografía de librería (los iconos son un set propio de 35 glifos, trazo 1.75 con remates redondos).

**Key Characteristics:**
- Un solo tono de marca (cobalto) en cuatro pasos, aplicado a campos enteros y no a detalles.
- Hielo para lo entrante y para alternar secciones; noche para la prueba (casos).
- Una grotesca variable para todo, con `opsz` 96 y ancho 96 en display; numerales tabulares en toda cifra, incluidas tablas y barras.
- Píldoras: botones, chips, credenciales, avatares, discos de icono, enlaces de nav; paneles de 1.25–1.75 rem; nodos y filas de 0.75 rem.
- La ventanilla de demostración (cabecera cobalto, cuerpo blanco, pie hielo 3, sombra `lift`) como contenedor firma, con la bandeja del hero como su instancia mayor.
- Burbujas de chat con cola (0.35 rem) y barras de progreso cobalto sobre hielo 2 como micro-componentes de dato.
- Reveal de 24 px + desenfoque con ease-out expo; estado por defecto visible; `prefers-reduced-motion` y `?nomotion=1` congelan en estado final.

## Colors

Paleta monocromática azul sobre blanco: un cobalto de marca con tres derivados, una familia de hielos para lo entrante, una familia de tintas azuladas para leer y una familia noche para la banda oscura. La ronda de corrección no añadió ningún color; añadió usos.

### Primary
- **Cobalto** (`cobalt`): el color de la marca. Se usa en campos enteros: fondo del botón primario, cabecera de la bandeja y de toda ventanilla de demostración, ola del hero, portada de pilar, burbuja saliente de IONIC, chip encendido, nodo "IONIC clasifica", relleno de toda barra de progreso, píldora de credencial principal (Meta Tech Provider), flechas del flujo, avatares y puntos activos, `::selection` y anillo de foco. Al 30 % es el borde de la píldora de credencial sobre hielo.
- **Cobalto profundo** (`cobalt-deep`): único uso, el hover del botón primario.
- **Cobalto tinta** (`cobalt-ink`): texto de marca sobre hielo o blanco (chips en reposo, botón fantasma, enlaces de nav activos, botón sobre oscuro, credenciales sobre hielo o lienzo, título de la tarjeta "cita agendada", taglines de pilar, acciones "✓ Pedido registrado" de las filas de intake, "Costo por lead", texto del nodo "CRM unificado", icono dentro de disco hielo). Es el cobalto que se lee, no el que se pinta.
- **Cobalto brillo** (`cobalt-glow`): puntos "sin leer", scrollbar en hover, barras secundarias de la onda de audio (al 60 %) y los halos difusos (`blur-3xl` al 30 %) sobre campos cobalto. Nunca como fondo sólido ni texto.

### Neutral
- **Lienzo** (`canvas`): fondo de página, tarjetas, ventanillas, nodos de entrada/salida, campos de formulario, credenciales del footer, texto sobre cobalto/noche.
- **Hielo** (`ice`): burbuja entrante, chip en reposo, nav activa, disco de icono en filas y nodos, credencial secundaria, texto secundario sobre cobalto (subtítulos de cabecera, "días").
- **Hielo 2** (`ice-2`): borde de chip, avatar inactivo, scrollbar, pista de toda barra de progreso, rieles y conectores del flujo (2 px), borde de la tarjeta "cita agendada".
- **Hielo 3** (`ice-3`): fondo de secciones alternas (Pilares, Equipo, Contacto, footer), lista de conversaciones, franja de onda de audio, pie de ventanilla (dashboard, "Meta Tech Provider · conexión oficial"), nodo "CRM unificado", hover del botón fantasma.
- **Tinta** (`ink`): titulares, texto principal, nombres de fila y canal en tablas.
- **Tinta 2** (`ink-2`): párrafos, leads, segmentos de anuncio, celdas numéricas, enlaces de nav en reposo.
- **Tinta 3** (`ink-3`): metadatos, horas, rótulos en mayúsculas (bloque, tabla, hablante, tipo de intake), "Datos ficticios", placeholders (al 70 %).
- **Línea** (`line`): bordes de tarjetas, ventanillas y nodos, botón fantasma, divisores entre pilares, anillo de los pasos.
- **Línea suave** (`line-soft`): bordes de nav, footer, franja de logos; divisores internos de ventanilla (filas de intake, ad-sets, filas de tabla, cabecera de chat).
- **Noche** (`night`), **Noche 2** (`night-2`), **Línea noche** (`night-line`), **Texto noche** (`night-text`): la familia de la banda de casos y de la cabecera de casos por pilar. El chip sobre noche se recolorea a `night-2`/`night-text`/`night-line`.

### Named Rules
**The Whole-Field Rule.** El cobalto se compromete en campos enteros (secciones, cabeceras, botones, burbujas, nodo central, relleno de barra), no en subrayados, iconos sueltos ni bordes decorativos. Si un cobalto ocupa menos de un componente completo, casi siempre debería ser `cobalt-ink` como texto. Las dos excepciones de borde son de estado, no de adorno: el nodo destino del flujo (2 px `cobalt`) y la credencial sobre hielo (1 px `cobalt/30`).

**The Blue-Dark Rule.** Lo oscuro es azul noche (`night`), nunca negro ni gris neutro. Sobre noche, el texto secundario es `night-text` y las divisiones `night-line`.

**The One Hue Rule.** No existe segundo acento. El verde de estado (`emerald-400`, punto "en línea") y el rojo de error (`red-500/600`) son semánticos, de 8–12 px o de un solo mensaje, y no forman parte de la paleta de marca. Los datos (barras, tablas, KPIs) también se dibujan en azul: cobalto sobre hielo 2, sin semáforos.

## Typography

**Display Font:** Bricolage Grotesque Variable (autohospedada vía `@fontsource-variable`; fallback `ui-sans-serif, system-ui`)
**Body Font:** la misma familia
**Label/Mono Font:** la misma familia con `tabular-nums lining-nums` para toda cifra

**Character:** una sola grotesca con carácter que hace todo el trabajo. En display se cierra (tracking −0.035em, interlineado 0.98, `opsz` 96 y ancho 96) y gana personalidad; en cuerpo se relaja (interlineado 1.625); en las ventanillas baja a 0.7–0.9 rem y se vuelve interfaz. Los ejes variables sustituyen a una segunda familia.

### Hierarchy
- **Display** (600, `clamp(2.4rem, 5vw, 4.2rem)`, 0.98): h1 de las páginas interiores (pilar, casos, equipo, 404). El h1 de la home usa el mismo estilo a `clamp(2.35rem, 4.1vw, 3.6rem)` para caber en dos líneas junto a la bandeja; la segunda línea va en `cobalt`.
- **Headline** (600, `clamp(2rem, 4.2vw, 3.25rem)`, 0.98): h2 de toda sección, vía `SectionHeading` o inline con la clase `display-tight`. Los h3 de pilar en la home bajan a `clamp(1.75rem, 3vw, 2.5rem)` y llevan delante un disco cobalto de 2.75 rem con el icono del pilar.
- **Title** (600, 1.35rem, 1.3): h3 de listas (frenos, pasos, cadena a 1.25rem); h2 de la franja de partners a 1.6rem. Hereda el tracking −0.025em de todo heading.
- **Lead** (400, `clamp(1.05rem, 1.4vw, 1.25rem)`, 1.625): párrafo bajo cada h2, en `ink-2` (o `ice`/`night-text` sobre campos oscuros). Máximo `max-w-3xl`. La tagline de pilar es un lead a 1.15rem en `cobalt-ink`.
- **Body** (400, 1.02rem, 1.625): párrafos de lista y respuestas de FAQ; 1rem en burbujas y tarjetas; 0.9–0.92rem dentro de las ventanillas (burbujas de la llamada, nombres de ad-set). Medida máxima 68ch (`measure`) o `max-w-xl`.
- **Label** (600, 0.95rem, −0.01em): botones (1rem), etiquetas de formulario, enlaces de nav, nombres en tarjetas, título de cabecera de ventanilla, píldoras de credencial (0.875rem en el footer).
- **Data** (400, 0.82rem, `tnum`): la letra de las tablas y filas de dato dentro de las ventanillas: celdas de KPIs, texto de intake (0.88rem), segmentos de anuncio y "% del presupuesto" (0.8/0.75rem), nodos del flujo (0.8rem/600), acciones con check (0.8rem/600 `cobalt-ink`). Los valores destacados suben a 0.95–1.05rem/600 (`Leads`, `Costo por lead`).
- **Caption** (600, 0.7–0.72rem, +0.025em, MAYÚSCULAS, `ink-3`): rótulo de bloque dentro de una ventanilla o tabla: cabecera de columna, tipo de fila ("Audio · 0:42", "PDF"), hablante sobre una burbuja ("Paciente", "IA de voz"), título de pie ("Dashboard · Trazabilidad…"), `dt` de una lista de definición (0.68rem) y el badge "Demostración" (sobre cobalto, en `ice`). Los rótulos de columna del footer, "Reto/Solución/Resultado", "Negocios que confían" y "Se conecta con" son la misma pieza a 0.8–0.95rem. Rotulan un bloque de contenido; nunca preceden a un h1/h2.
- **Metric** (600, `clamp(2.8rem, 4.6vw, 3.8rem)`, 1, tabular): cifras de casos y el "30 días" del pilar Software (`clamp(4.5rem, 9vw, 7rem)`, con "días" a 0.35em en `ice`).

### Named Rules
**The One Family Rule.** Toda letra del sitio es Bricolage Grotesque Variable. La jerarquía se hace con peso (400/500/600), tamaño y ejes variables, nunca con otra familia.

**The Tabular Number Rule.** Toda cifra que pueda compararse o cambiar (métricas, horas, teléfonos, duraciones, contadores, celdas de tabla, porcentajes de barra, costos) lleva `tnum`. Las tablas y las `dl` de dato llevan la clase en el contenedor.

**The Balanced Heading Rule.** Los h1–h4 llevan `text-wrap: balance` y tracking −0.025em desde base; el display añade `display-tight`. Los párrafos llevan `text-wrap: pretty`.

**The Caption-Below-Window Rule.** Un rótulo en mayúsculas solo vive dentro de una ventanilla, tabla, tarjeta o columna de footer, rotulando datos que ya están debajo o al lado. Sobre un titular de sección no existe.

## Layout

Contenedor único `wrap`: ancho máximo 78 rem centrado, gutter fluido `clamp(1.25rem, 4vw, 2.5rem)`. Dentro, la retícula es de 12 columnas a partir de `lg` (1024 px) y una sola columna debajo. Hay dos repartos:

- **5/7** para secciones texto + contenido (frenos, FAQ, formulario, equipo, pasos, "Qué incluye", franja de partners con texto 5 y certificaciones 7), `gap 3rem` en columna y `4rem` en fila `lg`.
- **6/6 alterno** para los pilares de la home: cada pilar es un `article` de 12 columnas con texto en 6 y ventanilla en 6; los pilares impares se voltean (`lg:order-2`) para que las ventanillas zigzagueen. Los artículos se separan con `divide-y divide-line` y `py-12` (`lg:py-16`), no con tarjetas. El hero reparte 6/6 con la bandeja a la derecha y la ola cobalto ocupa el 46 % derecho a sangre con esquina izquierda de 4 rem; la portada de pilar reparte 7/5 con la ventanilla en las 5 columnas derechas.

Ritmo vertical: cada sección `py-20` (5 rem) y `lg:py-28` (7 rem); la franja de logos y partners 4–5 rem. Dentro de la sección: h2 → lead a `mt-5`, lead → CTA a `mt-8`, encabezado → contenido a `mt-10/14` (`lg:mt-14/20`). Las secciones alternan lienzo blanco y `ice-3`; la prueba (casos) rompe con noche y la portada de pilar con cobalto de ancho completo.

Dentro de una ventanilla el ritmo es de interfaz: cabecera `px-4 py-3`, filas `px-4 py-2.5` a `py-3.5` divididas por `line-soft`, cuerpo `px-4 py-4/5`, pie `px-4 py-3`. Las filas de dato son grids `[2rem_1fr]` (disco + texto) que en `sm` ganan una tercera columna `auto` para la acción; los ad-sets usan `[1fr_9rem]` con la `dl` alineada a la derecha. El flujo de nodos es columna en móvil (entradas en fila envuelta, flechas giradas 90°, conectores ocultos) y desde `sm` (640 px) una fila de cinco pistas `minmax(0,1fr) 1.75rem minmax(0,1.4fr) 1.75rem minmax(0,1.15fr)` con rieles de 2 px `ice-2` a los lados de entradas y salidas.

Móvil (390 px): orden hero titular → bandeja → texto y CTAs, para que la cita cerrada se vea antes de la primera frase de venta; botones a ancho completo; la fila de chips de pilar es una franja horizontal desplazable sin scrollbar (`flex-nowrap overflow-x-auto [scrollbar-width:none]`) que en `sm` vuelve a envolver y en `lg` se sangra 2 rem para arrancar dentro del campo cobalto; la lista de conversaciones se oculta y queda solo el chat abierto (mín. 17 rem; 26 rem en `sm`). La nav colapsa a un `details` con panel flotante de `min(92vw, 22rem)`.

Densidad: listas divididas por `divide-y divide-line` en lugar de tarjetas cuando el contenido es texto; tarjetas solo cuando hay un objeto (caso, certificación, miembro, conversación, nodo).

## Elevation & Depth

Sistema plano por capas tonales, con dos sombras difusas y teñidas de azul para los pocos objetos que "flotan" sobre el lienzo. La profundidad se hace primero con hielo sobre blanco y cobalto sobre hielo, después con bordes de 1 px `line`/`line-soft`, y solo al final con sombra.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 12px 32px -14px rgb(14 95 203 / 0.28), 0 2px 6px -2px rgb(15 23 34 / 0.08)`): botón primario en reposo, ventanilla del formulario, toda ventanilla de demostración (IA, Flujo, Ads) tanto sobre `ice-3` como sobre la portada cobalt del pilar, el nodo "IONIC clasifica" dentro del flujo, panel del menú móvil, chip encendido sobre cobalto.
- **Phone** (`box-shadow: 0 40px 80px -32px rgb(8 58 122 / 0.45), 0 8px 24px -12px rgb(15 23 34 / 0.18)`): la bandeja del hero y el botón flotante de WhatsApp. Es la sombra del dispositivo, reservada al objeto mayor de la página.

Halos: sobre campos cobalto se colocan discos de 24–28 rem con `blur-3xl` en `cobalt-glow/30` y `cobalt-ink/60` para dar atmósfera; sobre el hero, un disco `ice-3` al 60 %. Nunca sobre blanco.

Nav: `bg-canvas/75–85` con `backdrop-blur-md` y borde inferior `line-soft`.

### Named Rules
**The Blue Shadow Rule.** Toda sombra lleva tinte cobalto (`14 95 203` o `8 58 122`) y desenfoque amplio con spread negativo. No hay sombras grises, duras ni desplazadas.

**The Two Shadows Rule.** Solo existen `lift` y `phone`. Una ventanilla (formulario o demostración) y el botón primario llevan `lift`; solo la bandeja del hero y el flotante de WhatsApp llevan `phone`. Cualquier otro objeto usa hielo o borde. Dentro de una ventanilla, `lift` puede repetirse una vez para el nodo protagonista.

## Shapes

Lenguaje de píldoras y paneles muy redondeados, sin ángulos rectos visibles. Todo lo interactivo o etiquetador pequeño es píldora (999px): botones, chips, credenciales de partner, enlaces de nav, avatares, discos de icono de 1.5–3.5 rem, barras de progreso y de onda, botón flotante, campo falso de la bandeja, badge "Demostración", scrollbar. Los contenedores suben de radio con su tamaño: nodos del flujo y filas activas de la bandeja 0.75 rem (`node`), campos, tarjeta "cita agendada" e intake 1 rem (`field`), tarjetas 1.25 rem (`card`), paneles, bandeja y ventanillas de demostración 1.5 rem (`panel`), ventanilla del formulario y bloque CTA de equipo 1.75 rem (`window`), ola del hero 4 rem en su única esquina.

La burbuja de chat es la forma propia: 1.125 rem en tres esquinas y una cola de 0.35 rem en la esquina inferior del lado del emisor (izquierda si entra, derecha si sale). La onda de audio son 24 barras de 4 px, radio píldora, alturas de 6–32 px, cada tercera en `cobalt` y el resto en `cobalt-glow/60`.

Bordes: siempre 1 px (`line` o `line-soft`; `white/20–40` y `night-line` sobre campos oscuros; `cobalt/30` en la credencial sobre hielo), salvo tres trazos de 2 px que señalan estado o estructura: el botón fantasma (1.5 px), el anillo de los pasos y el nodo destino "CRM unificado" (2 px `cobalt`), y los rieles y conectores del flujo (2 px `ice-2`). El foco es `outline 3px cobalt` con offset 3 px y radio 6 px. Las fotos del equipo van en 4:5, en escala de grises con contraste 1.05 y recuperan el color al hover.

## Components

### Buttons
Píldoras firmes y altas; el primario flota, el fantasma dibuja, el "on-dark" invierte.
- **Shape:** píldora (999px), altura mínima 3.25 rem (2.75 rem en nav y CTAs secundarios con `!min-h-11`), padding horizontal 1.5 rem, gap 0.6 rem con la flecha (icono 18 px).
- **Primary:** cobalto sobre blanco con sombra `lift`, texto 600 a 1 rem, tracking −0.01em.
- **Hover / Focus:** fondo `cobalt-deep` y `translateY(-2px)` en 0.35 s ease-out-expo; `:active` vuelve a 0. Foco vía outline global.
- **Ghost:** transparente, texto `cobalt-ink`, borde 1.5 px `line`; hover: borde y texto `cobalt`, fondo `ice-3`.
- **On-dark:** blanco con texto `cobalt-ink`; hover `ice` y −2 px. Único botón permitido sobre cobalto o noche; a su lado, el secundario sobre cobalto es `btn` con borde `white/40` y hover `white/10`.
- **Móvil:** `w-full`; en fila `sm:flex-row` con gap 0.75 rem.

### Chips
Etiqueta de clasificación de IONIC: nombra el pilar de una conversación, un caso o un freno. Siempre acompaña a un objeto ya clasificado, en línea o dentro de una cabecera; nunca se coloca solo sobre un titular.
- **Style:** píldora de 1.85 rem, padding 0 0.7 rem, 0.8rem/600, fondo `ice`, texto `cobalt-ink`, borde 1 px `ice-2`; icono de pilar a 14 px o punto de 6 px (`cobalt-glow` en reposo, `cobalt` encendido).
- **State:** `chip-on` = cobalto con texto blanco (clasificación aplicada; entra con `pop` 0.96→1). Sobre campo cobalto (`chip-on-cobalt`, fila del hero) el encendido se invierte: blanco, borde blanco, texto `cobalt-ink`, sombra `lift`. Sobre noche, `night-2`/`night-text`/`night-line`. Como enlace admite `hover:chip-on`.
- **Fila:** en móvil, franja horizontal desplazable sin scrollbar con `shrink-0` en cada chip; desde `sm` envuelve.

### Píldoras de credencial
Sello de partner que acompaña a un párrafo de confianza: nombra una conexión oficial (Meta Tech Provider, Partner de Zapier, Partner de Anthropic · Claude). Es un badge de credencial, no un chip de clasificación ni un kicker.
- **Primary** (`badge-partner`): cobalto lleno, texto blanco 0.95rem/600, padding 0.5 rem 1 rem, icono 18 px a la izquierda. Solo la credencial principal (Meta Tech Provider).
- **Ice** (`badge-partner-ice`): fondo `ice`, borde 1 px `cobalt/30`, texto `cobalt-ink`, mismas medidas; las demás credenciales de la franja de partners.
- **Quiet** (`badge-partner-quiet`): fondo `canvas`, borde 1 px `line`, texto `cobalt-ink` 0.875rem/600, padding 0.375 rem 0.875 rem; la versión del footer sobre `ice-3`, donde las tres credenciales pesan igual.
- **Inline:** en el pie de la ventanilla de Ads la misma credencial aparece sin píldora, como texto 0.8rem/600 `cobalt-ink` con icono escudo 14 px.

### Cards / Containers
- **Corner Style:** 1.25 rem (tarjeta simple, certificación, "otros pilares"), 1.5 rem (panel, bandeja, ventanilla de demostración, casos, ejemplos), 1.75 rem (ventanilla del formulario).
- **Background:** `canvas` sobre `ice-3` o lienzo; `night-2` con borde `night-line` en la banda de casos; `cobalt` para el bloque "30 días" y el CTA de equipo.
- **Shadow Strategy:** sin sombra por defecto; `lift` para ventanillas (formulario y demostración); `phone` para la bandeja.
- **Border:** 1 px `line` (o `night-line`, `white/20`); las tarjetas enlazadas ("otros pilares") pasan el borde a `cobalt` en hover.
- **Internal Padding:** 1.25–1.75 rem (`p-5`–`p-7`), 2–2.5 rem en la ventanilla (`sm:p-8 lg:p-10`); la ventanilla de demostración no tiene padding propio, lo llevan sus franjas.

### Ventanilla de demostración (componente firma)
Un dispositivo en miniatura que muestra el pilar funcionando. Comparte anatomía con la bandeja: radio 1.5 rem, borde 1 px `line`, fondo `canvas`, `overflow-hidden`, sombra `lift`, `aria-label` descriptivo.
- **Cabecera** (`demo-header`): franja `cobalt` `px-4 py-3`, disco `white/15` de 2.25 rem con el icono del pilar a 18 px, título 0.95rem/600 blanco y subtítulo `text-xs` en `ice`; a la derecha el badge "Demostración" (píldora, borde `white/30`, 0.7rem/600 mayúsculas, `ice`).
- **Cuerpo:** blanco; filas divididas por `line-soft`; cada fila abre con un disco `ice`/`cobalt-ink` de 2 rem (icono 16 px), sigue con caption + dato y cierra con una acción `✓ …` en 0.8rem/600 `cobalt-ink` (alineada a la derecha desde `sm`). El texto largo se trunca a una línea.
- **Pie** (`demo-footer`): franja `ice-3` con borde superior `line-soft`, `px-4 py-3`, caption a la izquierda y nota ("Datos ficticios", "Cada lead entra al CRM") a la derecha en 0.72–0.8rem `ink-3`/`ink-2`.
- **Variantes:**
  - **IA (llamada):** bajo la cabecera, franja de onda de 3 rem sobre `ice-3` con 24 barras y la nota "Transcripción en vivo"; transcripción con caption de hablante sobre cada burbuja (`bubble-in` paciente a la izquierda, `bubble-out` IA a la derecha, 0.9rem, máx. 88 %); tarjeta "Cita agendada" `ice-3`/`ice-2` con disco cobalto de 1.75 rem; bloque "Lo mismo por WhatsApp" con cuatro filas de intake (mic, image, file, database).
  - **Flujo:** diagrama de nodos (ver abajo) y, en el pie, tabla de KPIs `tnum` 0.82rem con cabecera caption, filas divididas por `line-soft`, nombre de canal 600 `ink`, celdas `ink-2` y barra de rentabilidad con valor a la derecha (`w-9 text-right`).
  - **Ads:** tres filas de conjunto de anuncios con disco de icono (map-pin, users, target), nombre 0.92rem/600, segmento 0.8rem `ink-2`, barra de presupuesto de 6 rem × 0.375 rem y una `dl` `tnum` a la derecha (`Leads` 1.05rem/600 `ink`, `Costo por lead` 0.95rem/600 `cobalt-ink`); pie con la credencial inline.
  - **Software:** no es ventanilla sino campo: bloque `cobalt` radio 1.5 rem, `p-7`/`sm:p-9`, línea 0.95rem/500 `ice`, cifra `metric` `clamp(4.5rem, 9vw, 7rem)` con contador y "días" a 0.35em, lista de checks 0.98rem `ice` en dos columnas desde `sm`.

### Nodos de flujo
Cajas de un diagrama de automatización; siempre dentro de la ventanilla de Flujo.
- **Node** (entrada/salida): radio 0.75 rem, borde 1 px `line`, fondo `canvas`, padding 0.45 rem 0.65 rem, 0.8rem/600 `ink`, disco `ice`/`cobalt-ink` de 1.5 rem con icono 13 px. Columna con gap 0.5 rem y riel de 2 px `ice-2` en el lado interior.
- **Node core** ("IONIC clasifica"): radio 0.75 rem, fondo `cobalt`, texto blanco 0.82rem/600 con icono `ia` 14 px, descripción 0.74rem `ice`, sombra `lift`.
- **Node target** ("CRM unificado"): radio 0.75 rem, fondo `ice-3`, borde 2 px `cobalt`, título `cobalt-ink`, descripción `ink-2`.
- **Conectores:** línea de 2 px `ice-2` que remata en `arrow-right` 14 px `cobalt`; en móvil la flecha gira 90° y la línea desaparece.

### Barras de progreso
Dato de proporción dentro de una ventanilla; nunca semáforo.
- **Track** (`progress-track`): píldora `ice-2`, altura 0.5 rem en tablas (`flex-1`) y 0.375 rem × 6 rem en filas de ad-set.
- **Fill** (`progress-fill`): píldora `cobalt` con `width` en porcentaje inline; el valor numérico va al lado en `tnum` `ink-2`/`ink-3`.

### Discos de icono
El icono nunca va suelto: vive en un disco píldora. `icon-disc` = `ice`/`cobalt-ink`, 2 rem con icono 16 px (filas de intake, ad-sets, "otros pilares" a 2.25 rem); 1.5 rem con icono 13 px en nodos. `icon-disc-cobalt` = `cobalt`/blanco, 2 rem (cita agendada, checks de "Qué incluye"), 2.25 rem (ejemplos), 2.75 rem con icono 22 px (h3 de pilar). Sobre cobalto el disco es `white/15` (cabeceras, avatar "IO").

### Inputs / Fields
- **Style:** fondo `canvas`, borde 1 px `line`, radio 1 rem, padding 0.875 rem 1 rem, texto 1 rem `ink`, placeholder `ink-3/70`; el teléfono lleva `tnum`. Labels 0.95rem/600 `ink` a 0.375 rem del campo, con "(opcional)" en 400 `ink-3`.
- **Focus:** borde `cobalt` + anillo 4 px `cobalt/15`, transición 0.3 s; caret cobalto.
- **Error / Disabled:** borde `red-500` + anillo `red-500/10`, mensaje 0.875rem `red-600` con `aria-describedby`; el error de envío es una píldora 1 rem `red-50`/`red-200` con icono. Éxito: panel `ice-3`/`ice-2` con disco cobalto de 3 rem y check, entra con `pop`.

### Navigation
- **Style:** cabecera pegajosa de 4–4.5 rem, `canvas/75–85` con desenfoque y borde `line-soft`; logo a 2.25–2.5 rem de alto.
- **Links:** píldoras 0.95rem/500, `ink-2`; hover `ice-3` + `ink`; activa (`aria-current`) `ice` + `cobalt-ink`. CTA primario compacto a la derecha.
- **Móvil:** botón circular de 2.75 rem que abre un `details` con panel `card` + `lift`, enlaces `rounded-xl` (0.75 rem) y CTA a ancho completo.
- **Migas** (portada de pilar): 0.9rem `ice` sobre cobalto, separadores "/" al 60 %, tramo actual en blanco.
- **Footer:** `ice-3` con borde `line-soft`, retícula 4/8, columnas con rótulo en mayúsculas `ink-3`, tres credenciales `badge-partner-quiet`, redes en discos de 2.5 rem con borde `line` y hover cobalto.

### Bandeja de IONIC (instancia mayor de la ventanilla)
Ventana con radio 1.5 rem, borde `line`, sombra `phone`. Cabecera cobalto con avatar "IO" en `white/15`, punto verde de estado, subtítulo "Llamadas, WhatsApp, Instagram y Facebook" y badge "Demostración". Lista de conversaciones en `ice-3` (13.5 rem) con avatares circulares (`cobalt` activa, `ice-2` inactiva), fila activa `canvas` radio 0.75 rem, hora `tnum` y doble check cobalto al resolver. Cabecera de chat con nombre · negocio y canal en `text-xs ink-3`; el canal "Llamada" se rotula "Llamada · IA de voz · transcripción" con un glifo de teléfono de 12 px delante. Chat con burbujas `bubble-in`/`bubble-out` a máx. 85 % de ancho, tarjeta "Cita agendada" (`ice-3`, borde `ice-2`, disco cobalto), indicador de escritura (tres puntos blancos, 1.2 s) y un campo falso en píldora `ice-3`. Guion en bucle: mensaje entra (900–1300 ms) → escribiendo (500 + 1100 ms) → respuesta → chip del pilar se enciende → 2600 ms → siguiente conversación. Las ventanillas de demostración de cada pilar son estáticas: muestran el estado final.

### Iconos
Set propio de 35 glifos en caja 24, trazo 1.75, remates y uniones redondos, sin relleno (salvo puntos de 0.8–1.2 de radio): flechas, checks, plus, phone, mail, map-pin, calendar, clock, redes (whatsapp, instagram, facebook, linkedin, tiktok), los cuatro pilares (ia, automatizaciones, marketing, software), shield, menu, close, send, alert y, desde la corrección, mic, image, file, database, chart, users, target, bell, globe. Tamaños en uso: 13–14 (nodos, acciones), 16 (discos de 2 rem), 18 (botones, cabeceras), 22 (h3 de pilar).

### Motion
- **Reveal** (`[data-reveal]`): 24 px + `blur(6px)` → nítido, 0.9 s ease-out-expo, disparado por IntersectionObserver con escalones `data-reveal-delay` de 40–220 ms. Estado por defecto visible; solo se oculta cuando `html.motion-ready` existe.
- **Contadores** (`[data-count]`): 1.6 s `expo.out` desde 0 al entrar en pantalla, una vez ("30 días", cifras de casos).
- **Línea de progreso** de los pasos: `scaleY` scrubbed por scroll (0.6) con puntos que se encienden a cobalto.
- **Parallax** del teléfono del hero: −48 px solo en `lg`.
- **Micro**: `msg-in` 12 px + fade 0.55 s; `pop` 0.96→1 0.45 s; hover de flechas +4 px (0.5 s); WhatsApp flotante despliega "Escríbenos ahora" en 0.5 s; marquee de logos 38 s lineal que se pausa al hover. Las ventanillas de demostración no animan por sí mismas: entran con el `reveal` de su columna.
- **Freno:** `prefers-reduced-motion` y `?nomotion=1` desactivan todo y muestran el estado final (todos los pasos activos, bandeja con las cuatro conversaciones resueltas, chips encendidos).

## Do's and Don'ts

### Do:
- **Do** comprometer el cobalto en campos enteros (sección, cabecera, botón, burbuja, nodo central, relleno de barra) y usar `cobalt-ink` cuando el azul es texto.
- **Do** alternar secciones entre lienzo blanco y `ice-3`, reservando noche para prueba y cobalto para la portada de pilar y el CTA.
- **Do** usar `display-tight` en todo h1/h2 y `tnum` en toda cifra, tabla y `dl` de dato.
- **Do** mantener `wrap` (78 rem, gutter fluido), el reparto 5/7 en `lg` para secciones texto + contenido y el 6/6 alterno con `divide-y` para los pilares.
- **Do** construir toda demostración nueva como ventanilla: cabecera cobalto con disco de icono y badge "Demostración", cuerpo blanco con filas `line-soft`, pie `ice-3`, radio 1.5 rem, borde `line`, sombra `lift`.
- **Do** rotular bloques de dato con caption (0.72rem, 600, mayúsculas, `ink-3`) dentro de la ventanilla, la tabla o la columna, nunca sobre un titular.
- **Do** dibujar datos en azul: barra `cobalt` sobre pista `ice-2`, valor `tnum` al lado.
- **Do** partir toda animación de un estado visible y ofrecer el estado final bajo `prefers-reduced-motion` y `?nomotion=1`.
- **Do** dibujar iconos con el set propio (trazo 1.75, remates redondos, caja 24) y colocarlos en discos cobalto, hielo o `white/15`, nunca sueltos.
- **Do** usar el chip solo como etiqueta de clasificación junto a un objeto (conversación, caso, freno) y la píldora de credencial solo junto a un párrafo de confianza o en el footer.

### Don't:
- **Don't** introducir naranja ni ningún segundo acento; los únicos colores fuera del azul son el verde de estado (punto de 12 px) y el rojo de error. Las barras y tablas tampoco usan semáforos.
- **Don't** usar negro o gris neutro para fondos oscuros; lo oscuro es `night`.
- **Don't** usar sombras grises, duras o desplazadas; solo `lift` y `phone`, ambas azules y difusas, y `phone` solo en la bandeja del hero y el flotante.
- **Don't** colocar un chip, una credencial, un rótulo en mayúsculas o cualquier texto pequeño como antesala de un titular; el h2 abre la sección directamente.
- **Don't** mezclar otra familia tipográfica ni fuentes del sistema; la jerarquía se hace con peso y ejes variables.
- **Don't** aplicar `btn-primary` sobre cobalto o noche; ahí el botón es `btn-on-dark`.
- **Don't** usar bordes de 2 px como adorno: solo el anillo de pasos, el nodo destino y los rieles del flujo los llevan, y siempre con significado de estado o estructura.
- **Don't** publicar cifras que no sean `tnum` ni tarjetas con sombra por defecto.
