# Brief para motion graphics: información comercial extraída de la landing de IonosHub

> Fuente: el código del repositorio `web-ionos` (rama `claude/brave-hypatia-fqfp3p`), revisado el 2026-10-12.
> Todos los textos entre comillas son **literales** del código. Lo que no está en el sitio se marca como **"No encontrado"**.
> Archivos principales: `src/data/*.ts`, `src/lib/site.ts`, `src/components/home/*.astro`, `src/pages/**`, `public/llms.txt`, `src/styles/global.css`, `PRODUCT.md`, `DESIGN.md`.

---

## 1. Marca y mensaje global

**Nombre de marca en el sitio:** "IonosHub" (nunca "IONOS HUB"). Agente de IA propio: "IONIC".
**Tagline de marca** (`src/lib/site.ts` → `SITE.tagline`, y pie de página): "De datos a resultados"

### Eslogan o titular principal (H1 del hero, `src/components/home/Hero.astro`)
> "Cada mensaje respondido.
> Cada lead, una cita."

(La segunda línea va en color cobalto.)

### Subtítulo / propuesta de valor
Hay dos versiones según el tamaño de pantalla:

- **Escritorio/tablet:**
  > "IonosHub arma el ecosistema digital completo de tu PyME: una IA que atiende llamadas y mensajes 24/7, un CRM unificado con todos tus leads, marketing segmentado en Meta y software a medida en 30 días. A un precio pensado para empresas como la tuya."
- **Móvil:**
  > "IA que atiende llamadas y mensajes 24/7, CRM unificado, marketing segmentado en Meta y software a medida en 30 días. Todo el ecosistema de tu PyME, a un precio pensado para ti."

Sellos bajo los botones del hero: "Meta Tech Provider" · "Casos reales con cifras" · "Sede en Ibarra, Ecuador".

Meta descripción de la home (`src/pages/index.astro`):
> "Agentes de IA que atienden y agendan 24/7, automatizaciones, marketing en Meta y software a medida en 30 días. El ecosistema digital completo para pequeñas y medianas empresas en Ecuador. Agenda un diagnóstico gratuito."

Mensajes de sección en la home (H2 literales, en orden):
1. "Si algo de esto te pasa, hablemos." (dolores)
2. "Cuatro pilares. Un solo ecosistema." (servicios)
3. "Así se conecta todo, de datos a resultados." (ecosistema)
4. "Resultados reales, con cifras reales." (casos)
5. "Empezamos con una conversación de 30 minutos." (proceso)
6. "Un equipo real en Ibarra, no una plataforma anónima." (equipo)
7. "Partners y credenciales que respaldan cada entrega." (confianza)
8. "Preguntas que nos hacen antes de agendar." (FAQ)
9. "Agenda tu diagnóstico gratuito." (contacto)

### Llamadas a la acción (texto exacto → destino)

| Texto del botón / enlace | Dónde aparece | Lleva a |
|---|---|---|
| "Agendar diagnóstico gratis" | Hero, Proceso, barra de navegación, menú móvil, portada de cada pilar y de cada sector, 404 | `#contacto` (formulario) o `/#contacto` |
| "Escribir por WhatsApp" | Hero | `https://wa.me/593992249152?text=Hola IonosHub, quiero agendar un diagnóstico gratuito para mi negocio.` |
| "¿Ya lo tienes claro? Elige día y hora en la agenda" | Hero | `#agenda` (abre la pestaña de calendario del formulario) |
| "Ver inteligencia artificial" / "Ver automatizaciones" / "Ver marketing" / "Ver software" | Fila de cada pilar (home) | `/servicios/<slug>` |
| "Caso {cliente}: {cifra}" (p. ej. "Caso Pawau: Atención 24/7") | Fila de cada pilar (home) | `/casos-de-exito` |
| "Armar mi ecosistema" | Sección "Así se conecta todo" | `#contacto` |
| "Ver los 7 casos" | Sección de casos | `/casos-de-exito` |
| "Conocer al equipo" | Sección equipo | `/equipo` |
| "Ver cómo se conectan los cuatro pilares" | Menú desplegable "Servicios" | `/#ecosistema` |
| "Escríbenos" / "Elegir horario" | Pestañas del bloque de contacto | Formulario / Google Calendar incrustado |
| "Agendar mi diagnóstico gratis" | Botón de envío del formulario | `POST /api/lead` (webhook n8n) |
| "WhatsApp 099 224 9152" | Bloque "¿Prefieres hablar ya?" | WhatsApp con mensaje según la página |
| "info@ionoshub.net" | Bloque de contacto y pie | `mailto:info@ionoshub.net` |
| "Abre la agenda en Google Calendar" | Pestaña calendario | `https://calendar.app.google/LSjLcpH2TpMAasgN6` |
| "Escríbenos ahora" | Botón flotante de WhatsApp (aparece al pasar el cursor) | WhatsApp |
| "Preguntar por WhatsApp" | Portada de cada pilar | WhatsApp con el mensaje del pilar |
| "Todos los casos" | Página de pilar | `/casos-de-exito` |
| "Ver pilar" | Bloque "Se conecta con" (página de pilar) | Otro pilar |
| "Ver IA para {sector}" | Página de IA | `/servicios/inteligencia-artificial/<sector>` |

Mensajes de WhatsApp predefinidos por página (`src/data/pillars.ts`, `src/data/niches.ts`):
- General: "Hola IonosHub, quiero agendar un diagnóstico gratuito para mi negocio."
- IA: "Hola IonosHub, me interesa una IA que atienda llamadas y mensajes de mi negocio. Quiero agendar un diagnóstico gratuito."
- Automatizaciones: "Hola IonosHub, quiero centralizar mis leads y automatizar procesos. Quiero agendar un diagnóstico gratuito."
- Marketing: "Hola IonosHub, me interesa pauta segmentada y marketing digital. Quiero agendar un diagnóstico gratuito."
- Software: "Hola IonosHub, necesito un sistema a medida. Quiero agendar un diagnóstico gratuito."

Saludo del chat IONIC (`src/lib/chat/copy.ts`):
> "Hola, soy IONIC, el asistente de IonosHub. Puedo contarte cómo automatizamos la atención de un negocio como el tuyo, o agendarte un diagnóstico gratuito de 30 minutos. ¿Qué te trae por aquí?"

### Tono de comunicación percibido
Cercano y comercial, con tuteo constante al dueño del negocio ("tu PyME", "Si algo de esto te pasa, hablemos"). Frases cortas y directas, orientadas a agendar. Usa poca jerga técnica y, cuando aparece (CRM, AEO, API), la explica. Evita los superlativos y apoya cada promesa en una prueba: cifras de casos, "Meta Tech Provider", "30 días". `PRODUCT.md` lo define como "comercial, directo y con llamada a la acción; intuitivo, dinámico y amigable [...] profesional (no infantil)".

---

## 2. Línea de servicios

El sitio organiza su oferta en **cuatro pilares**. Este es el orden en que aparecen en la home (`src/data/pillars.ts`), en el menú y en el pie. El pilar de IA tiene además **cuatro variantes por sector** (ver 2.5).

### 2.1 Inteligencia Artificial
- **Nombre exacto:** "Inteligencia Artificial" (en el menú: "Inteligencia artificial"; versión corta: "IA")
- **Descripción literal (tagline):** "Una IA que atiende llamadas y mensajes 24/7, entiende audios, imágenes y documentos, y actúa."
- **Resumen:** IA que contesta llamadas y mensajes 24/7 y agenda sola.
- **Problema que resuelve (literal):** "Mientras atiendes a un cliente, pierdes al siguiente. Fuera de horario nadie contesta el teléfono ni el WhatsApp, y el lead se enfría."
  - Dolor de la home: "Llamadas y mensajes sin responder" — "Atención saturada o fuera de horario: mientras atiendes a uno, el siguiente cuelga o se va."
- **Cliente al que va dirigido:** "Ideal para consultorios, clínicas y PyMEs en Ecuador" (meta descripción); "Ideal para consultorios y clínicas" (prueba). Sectores con página propia: clínicas, institutos, salones de belleza y retail.
- **Características / entregables (literal):**
  1. "IA de voz (IVR) que responde llamadas 24/7: agenda citas, toma pedidos y envía recordatorios"
  2. "Agentes en WhatsApp, Instagram y Facebook con el tono de tu marca"
  3. "Clasificador multifunción: entiende audios, imágenes y documentos, y los registra donde corresponde"
  4. "Consulta inventario, agenda y sistemas externos antes de responder"
  5. "Botones de IA integrados en tu sistema, página o sitio web"
  6. "LLMs avanzados (incluido Claude de Anthropic) conectados por API a tus servidores y CRM"
- **Ejemplos (literal):** "Un consultorio: la IA contesta la llamada, agenda la cita en la agenda del doctor y envía el recordatorio por WhatsApp" · "Un cliente manda un audio con su pedido; IONIC lo transcribe, lo registra en el CRM y confirma" · "Un paciente envía la foto de su receta; IONIC detecta el documento y lo adjunta a su ficha"
- **Prueba (literal):** "IONIC es nuestro agente propio: atiende llamadas, WhatsApp y redes 24/7, clasifica lo que recibe (voz, audio, imagen, documento) y agenda. Ideal para consultorios y clínicas."
- **Casos vinculados:** Pawau, Daniela Vidal.
- **Precio / plan / paquete:** No encontrado. El sitio dice que no hay precios públicos.
- **Icono / ilustración:** icono SVG en línea `ia` (sol/destello con 8 rayos) en `src/components/Icon.astro`; no es un archivo de imagen. Demostración animada `src/components/demos/IaDemo.astro`: transcripción de llamada de "Consultorio Dental Norte" y clasificador de audio, imagen, PDF y consulta, etiquetada "Demostración". En la página del pilar se ve el selector de sector `src/components/NicheSelector.astro`. Personaje del agente: icono `robot` ("IONIC en persona") en `Icon.astro`, usado en el botón del chat.
- **Sección / ruta:** home `#ecosistema` (primera fila) · `/servicios/inteligencia-artificial`

### 2.2 Automatizaciones
- **Nombre exacto:** "Automatizaciones"
- **Descripción literal (tagline):** "Todos tus leads en un CRM unificado y el trabajo repetitivo hecho solo."
- **Resumen:** Todos tus leads en un CRM y procesos repetitivos automatizados.
- **Problema que resuelve (literal):** "Los leads viven repartidos entre el WhatsApp de una persona, Excel y papel. Nadie sabe cuántos entraron, quién los atendió ni cuánto dejó cada canal."
  - Dolor de la home: "Leads repartidos y procesos manuales".
- **Cliente al que va dirigido:** "PyMEs" (meta título); consultorios ("CRM simplificado para consultorios").
- **Características / entregables (literal):**
  1. "CRM unificado: todos los leads de WhatsApp, redes, llamadas y web en un solo lugar"
  2. "CRM simplificado para consultorios: gestiona pacientes y envía recordatorios en dos clics"
  3. "Flujos de automatización (tipo Zapier / n8n) que conectan tus herramientas"
  4. "Rutinas que reemplazan el trabajo manual del día a día: reportes, clasificación, seguimientos"
  5. "Dashboards a medida: trazabilidad y rentabilidad del negocio con KPIs claros"
  6. "Análisis de Excel y reportería en línea"
- **Ejemplos (literal):** "Cada lead de WhatsApp, pauta o llamada entra solo al CRM, con etapa, canal de origen y responsable" · "Un doctor abre su CRM, ve las citas del día y los recordatorios ya salieron solos" · "Un dashboard muestra qué canal trae los clientes más rentables, cada lunes a las 7:00"
- **Prueba (literal):** "Somos partner de Zapier: conectamos tus herramientas con flujos oficiales y mantenidos."
- **Casos vinculados:** Daniela Vidal, Zona Gamers.
- **Precio / plan / paquete:** No encontrado.
- **Icono / ilustración:** icono SVG `automatizaciones` (flechas circulares) en `Icon.astro`. Demostración `src/components/demos/FlowDemo.astro`: flujo WhatsApp/Meta Ads/Llamada/Formulario web → "IONIC clasifica" → "CRM unificado" → recordatorio, reporte y dashboard, con "Datos ficticios". En la página del pilar: `src/components/AgentStory.astro` (agente de Daniela Vidal, "conversación recreada · Datos ficticios") y la foto `/imgs/fotos/dueno-local.webp` ("Foto ilustrativa").
- **Sección / ruta:** home `#ecosistema` (segunda fila) · `/servicios/automatizaciones`

### 2.3 Marketing
- **Nombre exacto:** "Marketing" (en el menú, con la pista "Pauta en Meta, SEO, AEO y landing pages")
- **Descripción literal (tagline):** "Que te encuentren en Google, que la IA te nombre y que la pauta traiga clientes, no likes."
- **Resumen:** Pauta en Meta, SEO y AEO que traen clientes reales.
- **Problema que resuelve (literal):** "Invertir en anuncios sin estructura quema presupuesto: un solo anuncio para todo el mundo, sin conjuntos, sin segmentos, sin saber qué funcionó. Y mientras tanto, nadie te encuentra buscando."
  - Dolor de la home: "Pauta que no convierte" — "Anuncios sin estructura, contenido sin plan y una web que nadie encuentra en Google ni cita la IA."
- **Cliente al que va dirigido:** No se especifica un segmento propio (Ecuador, PyMEs en general).
- **Características / entregables (literal):**
  1. "Estructura profesional de campañas en Meta: conjuntos de anuncios por segmento, objetivo y presupuesto"
  2. "SEO: que tu negocio aparezca en Google cuando alguien busca lo que vendes"
  3. "AEO: que ChatGPT, Gemini, Perplexity y Claude te nombren al responder sobre tu servicio"
  4. "Landing pages a medida conectadas al CRM y a IONIC"
  5. "Cobertura de eventos con fotografía y video profesional"
  6. "Segmentación por ubicación, intereses, clientes anteriores y audiencias similares"
  7. "Optimización continua de campañas en todo el entorno Meta"
  8. "Creación de contenido digital para redes"
- **Ejemplos (literal):** "Una campaña con tres conjuntos: vecinos a 5 km, clientes anteriores y audiencias similares, cada uno con su presupuesto" · "Tu sitio preparado para buscadores y para asistentes de IA: datos estructurados, contenido citable y permisos claros para sus rastreadores" · "Una landing page por campaña, conectada al CRM unificado y atendida por IONIC" · "Cobertura de tu evento lista para publicar el mismo día"
- **Prueba (literal):** "Somos Meta Tech Provider: conexiones oficiales por API y certificaciones que avalan nuestro trabajo dentro del entorno Meta. [...]"
- **Nota:** "El presupuesto publicitario lo define y aporta tu negocio; nosotros lo hacemos rendir." (FAQ del pilar)
- **Casos vinculados:** El Chipotle, U.E. Católica "La Victoria", Comunidad de la IA (Perú).
- **Precio / plan / paquete:** No encontrado.
- **Icono / ilustración:** icono SVG `marketing` (megáfono) en `Icon.astro`. Demostración `src/components/demos/AdsDemo.astro`: "Campaña · Combo familiar · Meta" con 3 conjuntos, etiquetada "Demostración". Fotos reales de cobertura: `/imgs/mkt/cobertura-01.webp` a `cobertura-05.webp` (inauguración de Aura Beauty Studio). Capturas reales de landings: `/imgs/landings/aura.webp`, `chipotle.webp`, `fondues.webp`, `gecop.webp`.
- **Sección / ruta:** home `#ecosistema` (tercera fila, con la tira "Cobertura de eventos · fotos reales de un evento cubierto por IonosHub") · `/servicios/marketing`

### 2.4 Software a medida en tiempo récord
- **Nombre exacto:** "Software a medida en tiempo récord" (título del pilar). En el menú: "Software a medida"; versión corta: "Software".
- **Descripción literal (tagline):** "Tu sistema integral, funcionando en 30 días."
- **Resumen:** Tu sistema a medida, con alcance cerrado, listo en 30 días.
- **Problema que resuelve (literal):** "Los sistemas genéricos no encajan con cómo opera tu negocio, y los proyectos a medida tardan meses y cuestan una fortuna."
  - Dolor de la home: "Sistemas que no encajan" — "Software genérico que no refleja cómo operas, o proyectos que tardan meses."
- **Cliente al que va dirigido:** "empresas en Ecuador" (meta descripción). No se menciona un segmento más concreto.
- **Características / entregables (literal):**
  1. "Sistemas de facturación, calificaciones, cursos en línea y más"
  2. "Sistemas web y apps móviles a medida"
  3. "Alcance cerrado y entrega en 30 días"
  4. "Infraestructura cloud y correo profesional"
  5. "Integración con IA, CRM unificado y marketing"
- **Ejemplos (literal):** "Sistema de calificaciones por roles para una academia, con reportería en línea" · "Facturación conectada a tu inventario y a tu CRM" · "Plataforma de cursos en línea con pagos y certificados"
- **Prueba (literal):** "Metodología de alcance cerrado: definimos el sistema en el diagnóstico y lo entregamos en 30 días."
- **Casos vinculados:** Ecu593 English.
- **Precio / plan / paquete:** No encontrado.
- **Icono / ilustración:** icono SVG `software` (`</>`) en `Icon.astro`. Demostración `src/components/demos/SoftwareDemo.astro`: contador grande "30 días" con el texto "Del diagnóstico a tu sistema funcionando". Capturas reales de sistemas: `/imgs/sistemas/zona-gamers.webp`, `equametric.webp`, `mega-mayorista.webp`, `latini.webp`, `ecu593.webp`, `mafer-cano.webp`.
- **Sección / ruta:** home `#ecosistema` (cuarta fila, con la tira "Sistemas entregados · capturas reales de sistemas de clientes") · `/servicios/software-a-medida`

### 2.5 Variantes por sector del pilar IA (`src/data/niches.ts`)
Cada sector tiene su página en `/servicios/inteligencia-artificial/<slug>`.

| Sector (nombre exacto) | H1 literal | Tagline literal | Resumen | Lo que NO hace (1.ª línea roja) | Icono SVG | Prueba |
|---|---|---|---|---|---|---|
| "Clínicas y consultorios" | "Un agente de IA que contesta el teléfono de tu consultorio a las once de la noche" | "Agenda, confirma, reagenda y recibe la orden del paciente por WhatsApp. Sin diagnosticar nunca." | Recepción con IA que agenda pacientes y nunca diagnostica. | "No diagnostica ni sugiere tratamientos, aunque le insistan" | `estetoscopio` | Logo Santa Lucía (`/imgs/clientes/marca/santalucia.webp`) |
| "Institutos y centros educativos" | "La secretaría de tu instituto, abierta a la hora en que los representantes preguntan" | "Informa cupos, horarios y requisitos, acompaña la matrícula y agenda la visita. También a las nueve de la noche." | Secretaría con IA que atiende matrículas a cualquier hora. | "No da notas, asistencia ni conducta por chat" | `birrete` | Caso y logo de Ecu593 English |
| "Salones de belleza y estética" | "Reserva con la estilista correcta, en el hueco correcto, sin que sueltes las tijeras" | "Sabe cuánto dura un balayage y quién lo hace. Reserva, recuerda y vuelve a llenar las cancelaciones." | Reservas por estilista con la duración real de cada servicio. | "No promete resultados de color ni de tratamiento" | `tijeras` | Logo Aura Beauty Studio |
| "Retail y tiendas" | "Responde con el stock que de verdad tienes, no con el que cree tener" | "Consulta el inventario antes de contestar, arma el pedido y da el estado del envío." | Responde con el stock real, arma el pedido y da seguimiento. | "No confirma stock de memoria: si el sistema no responde, lo dice" | `tienda` | Caso y logo de Zona Gamers |

Cada sector tiene además una demostración de conversación con un negocio **ficticio**, etiquetada "Demostración" (`src/components/demos/NicheDemo.astro`): "Centro Médico Santa Elena", "Instituto Superior Ibarra", "Studio Aura" y "Distribuidora El Portal".

### 2.6 Cómo se contrata (aplica a todos los servicios)
- Proceso (`src/data/site-content.ts`): **Diagnóstico** ("Gratis · 30 min") → **Propuesta** ("48 horas") → **Arranque** ("Desde la semana 1") → **Resultados** ("Cada mes").
- Precio: "No. Cada ecosistema se arma a medida tras un diagnóstico gratuito. [...] el alcance y la inversión se ajustan a tu realidad." (FAQ). "Sin catálogos de precios públicos: el alcance se define en un diagnóstico gratuito."
- Cadena del ecosistema (sección `Ecosystem.astro`): "La pauta trae la conversación" → "IONIC la atiende" → "El CRM unificado la gestiona" → "Tu sistema la convierte".

---

## 3. Prueba social y cifras

### Números y métricas reales (casos, `src/data/cases.ts`)
| Cliente | Sector | Cifra destacada | Antes → después | Contexto literal |
|---|---|---|---|---|
| Zona Gamers | Retail digital | "De 5 h a 10 min" | 5 h → 10 min | "El administrador perdía cerca de 5 horas revisando y clasificando archivos y juegos." / "El proceso ahora toma unos 10 minutos." (caso destacado de la home) |
| Daniela Vidal | Asesoría de seguros e inversiones | "Leads calificados 24/7" | equipo → 1 agente de IA | "La asesora entra al CRM sólo a cerrar y cobrar: el agente hace el resto, sin un equipo completo." |
| Pawau | Peluquería y spa canino | "Atención 24/7" | horario → 24/7 | "Atendía unas 20 personas al día; mientras atendían a uno, perdían al siguiente." |
| El Chipotle | Restaurante | "De 0 a leads activos" | 0 → leads activos | "De 0 vistas a redirección activa de leads al canal de WhatsApp." |
| Ecu593 English | Educación | "Operación 100 % digital" | papel → 100 % digital | "Operaban con Excel, Word y notas de estudiantes en papel." |
| Unidad Educativa Católica "La Victoria" | Educación | "Comunidad más cercana" | — (sin cifra) | "Mejor recibimiento de la comunidad de padres en redes." |
| Comunidad de la IA (Perú) | Comunidad y formación | "Talleres activos" | — (sin cifra) | "Talleres formativos del equipo IonosHub en la plataforma Skool." |

### Otras cifras del sitio (compromisos de servicio, no resultados)
- "24/7": atención de la IA y de IONIC.
- "30 días": entrega de software ("Alcance cerrado y entrega en 30 días").
- "30 minutos": duración del diagnóstico gratuito.
- "48 horas": plazo de la propuesta.
- "Desde la semana 1": arranque.
- "en menos de un día hábil": "Te proponemos horario en menos de un día hábil."
- "Cuatro pilares".
- "7 casos" (botón "Ver los 7 casos", calculado desde los datos).
- 13 logos de clientes en el carrusel.

> ⚠️ **Cifras de demostración, NO reales** (no usar como resultados): "Leads 27 / 19 / 11" y "Costo por lead $1,90 / $1,40 / $2,60" (`AdsDemo.astro`); tabla de KPIs por canal "48 / 36 / 21 / 12 leads" con porcentajes de cierre y rentabilidad (`FlowDemo.astro`, "Datos ficticios"); "12 unidades", "$48", "Factura #0452", "1:12" (demos de IA y de sectores). Todas llevan la etiqueta "Demostración" o "Datos ficticios" en la interfaz.

### Testimonios
**No encontrado.** El sitio no publica testimonios. `PRODUCT.md` excluye a propósito los de la versión 1 porque no se confirmaron como reales.

### Logos de clientes (carrusel "Negocios que confían en IonosHub", `src/data/site-content.ts`)
El Chipotle · Zona Gamers · Daniela Vidal · Asesora de seguros e inversiones · Santa Lucía · Centro oftalmológico · Aura Beauty Studio · Mia Nonna · Ecu593 English · Distribuidora Hernández · Fondue's Escuela de Chefs · Mafer Cano · Gecop Expert · ITSI · Pawau
(archivos en `/imgs/clientes/marca/*.webp`)

### Partners y credenciales
- Partners (sin emblema oficial, se muestran como texto con la marca de la empresa): "Meta · Tech Provider", "Zapier · Partner", "Anthropic · Partner · Claude".
- Certificaciones con emblema: "Microsoft Azure · Cloud Computing" (`/imgs/certificados/certificadoAzure.webp`), "Google Cloud · Cloud Platform" (`/imgs/certificados/emblemagoogleCloud.png`), "Oracle Cloud · Database & Cloud" (`/imgs/certificados/emblemaoracle.webp`).

### Equipo (`src/data/team.ts`)
| Nombre | Cargo literal | Foto |
|---|---|---|
| Orlidan Montesdeoca | Director Ejecutivo · Cofundador | `/imgs/equipo/orli.webp` |
| Cristhian Recalde | Director Financiero y Operaciones · Cofundador | `/imgs/equipo/gris.webp` |
| Alan Rodríguez | PMO | `/imgs/equipo/alan.webp` |
| David Villarreal | Especialista en Automatizaciones y Desarrollo Web | `/imgs/equipo/deivid.webp` |
| Camila Navarrete | CMO | `/imgs/equipo/cami.webp` |
| Domenica Alvarez | Representante de Marca | `/imgs/equipo/dome.webp` |

"El diagnóstico lo lleva un cofundador: Orlidan o Cristhian."

---

## 4. Contacto y cierre

| Canal | Dato | Fuente |
|---|---|---|
| Web | https://ionoshub.net | `src/lib/site.ts` |
| WhatsApp | 099 224 9152 (internacional +593 99 224 9152 · `wa.me/593992249152`) | `src/lib/site.ts` |
| Teléfono | El mismo número de WhatsApp: el JSON-LD lo declara como `telephone: +593992249152`. No se muestra otro teléfono. | `BaseLayout.astro` |
| Correo | info@ionoshub.net | `src/lib/site.ts` |
| Agenda | https://calendar.app.google/LSjLcpH2TpMAasgN6 (Google Calendar, videollamada de 30 min) | `src/lib/site.ts` |
| LinkedIn | https://linkedin.com/company/ionoshub (usuario: ionoshub) | `src/lib/site.ts` |
| Instagram | https://www.instagram.com/ionoshub (@ionoshub) | `src/lib/site.ts` |
| TikTok | https://www.tiktok.com/@ionoshub (@ionoshub) | `src/lib/site.ts` |
| Facebook | No encontrado (existe el icono, pero no hay URL) | — |
| X / YouTube | No encontrado (los webinars se transmiten "en vivo por YouTube", pero no hay URL de canal) | — |

**Ubicación / cobertura:**
- "Ibarra, Imbabura · Ecuador" (pie de página).
- "Sede en Ibarra, Ecuador" (hero).
- FAQ: "Somos una empresa ecuatoriana con sede en Ibarra y foco en el país. También acompañamos iniciativas en la región."
- JSON-LD: `areaServed: Ecuador`.

**Frases de cierre disponibles (literal):**
- "Agenda tu diagnóstico gratuito."
- "30 minutos para entender tu operación y proponerte un ecosistema viable. Te decimos por dónde empezar y qué esperar. Sin compromiso de compra."
- "Nos escribes" → "Agendamos" → "Conversamos" ("Sales con una propuesta concreta y sin letra pequeña.")
- "Tu negocio puede ser el próximo caso." (página de casos)
- "¿Hablamos de tu negocio?" (página de equipo)

---

## 5. Recursos visuales

### Marca
| Recurso | Ruta |
|---|---|
| Logotipo (navegación y pie) | `public/imgs/logo.webp` |
| Logotipo (JSON-LD) | `public/imgs/logo.png` |
| Icono / favicon | `public/imgs/icon.png` (también `public/favicon.ico`, `public/favicon.svg`) |
| Imagen para compartir (OG 1200×630) | `public/imgs/og.png` |
| Manual de marca (citado en PRODUCT.md, **no está en este repo**) | `ionos-hub-connect-main/public/imgs/Brandbook Ionos 2025.png` — "wordmark 'IONOS' en azul cobalto con un robot dentro de la segunda 'O', 'HUB' vertical en contorno, tagline 'DE DATOS A RESULTADOS', motivo de ondas azules degradadas sobre blanco" |

### Mascota / personaje
- **IONIC**: icono SVG `robot` en `src/components/Icon.astro` ("IONIC en persona: cabeza redondeada, antena con señal y una sonrisa corta"). Se usa en el botón y el panel del chat (`ChatLauncher.astro`, `ChatWidget.astro`), con un punto verde de estado `#34d399`.
- Ilustración o archivo de imagen de mascota: No encontrado.

### Iconos (SVG en línea, `src/components/Icon.astro`; trazo de 1,75, extremos redondeados, caja de 24×24)
Pilares: `ia`, `automatizaciones`, `marketing`, `software` · Sectores: `estetoscopio`, `birrete`, `tijeras`, `tienda` · Interfaz: `arrow-right`, `arrow-up-right`, `check`, `check-double`, `plus`, `phone`, `mail`, `map-pin`, `calendar`, `clock`, `whatsapp`, `instagram`, `facebook`, `linkedin`, `tiktok`, `shield`, `robot`, `sparkle`, `menu`, `close`, `send`, `alert`, `mic`, `image`, `file`, `database`, `chart`, `users`, `target`, `bell`, `globe`.
Marcas de partners (Simple Icons, `src/components/BrandMark.astro`): `meta`, `zapier`, `anthropic`.

### Fotografías
| Uso | Ruta | Nota |
|---|---|---|
| Dolores (home) y pilar Automatizaciones | `/imgs/fotos/dueno-local.webp` | Foto de banco: "Foto ilustrativa" |
| Proceso / diagnóstico (home) | `/imgs/fotos/reunion-generica.webp` | Foto de banco |
| Cobertura de evento (Marketing) | `/imgs/mkt/cobertura-01.webp` … `cobertura-05.webp` | Reales: inauguración de Aura Beauty Studio |
| Equipo | `/imgs/equipo/{orli,gris,alan,deivid,cami,dome}.webp` | Reales (en escala de grises en la home) |
| Webinars | `/imgs/webinars/1.webp`, `2.webp`, `1-og.webp`, `2-og.webp`, `academia-debate-sociedad.png`, `cyberprevention.jpg` | Piezas y logos de coorganizadores |

Las carpetas `mkt/`, `landings/`, `sistemas/` y `fotos/` tienen además versiones `-480.webp` y `-960.webp`.

### Capturas de producto (reales)
- Landing pages: `/imgs/landings/aura.webp`, `chipotle.webp`, `fondues.webp`, `gecop.webp`
- Sistemas: `/imgs/sistemas/zona-gamers.webp`, `equametric.webp`, `mega-mayorista.webp`, `latini.webp`, `ecu593.webp`, `mafer-cano.webp`
- No se publica a propósito: `/imgs/sistemas/correo.webp` (muestra una bandeja de correo real).

### Logos de clientes y certificaciones
- `/imgs/clientes/marca/` → `aura, chipotle, danielavidal, distribuidora, ecu593, fondue, gecop, itsi, mafercano, mianonna, pawau, santalucia, zonagamers` (.webp)
- `/imgs/certificados/` → `certificadoAzure.webp`, `emblemagoogleCloud.png`, `emblemaoracle.webp`

### Demostraciones animadas (fuente para recrear en motion)
`src/components/islands/IonicInbox.tsx` (bandeja del hero con conversaciones ficticias de "Consultorio Dental Norte", "Clínica Salud Total", "La Esquina Parrilla" y "Academia Ibarra Idiomas"), `demos/IaDemo.astro`, `demos/FlowDemo.astro`, `demos/AdsDemo.astro`, `demos/SoftwareDemo.astro`, `demos/NicheDemo.astro`, `AgentStory.astro`.

### Colores (`src/styles/global.css` → `@theme`, coinciden con `DESIGN.md`)
| Token | Valor | Uso |
|---|---|---|
| `--color-canvas` | `#ffffff` | Fondo base |
| `--color-ice` | `#e9f1fc` | Chips, fondos suaves, texto sobre cobalto |
| `--color-ice-2` | `#d7e6fa` | Bordes suaves, barra de desplazamiento |
| `--color-ice-3` | `#f4f8fe` | Fondos de sección alternos |
| `--color-cobalt` | `#0e5fcb` | **Color de marca**, botones principales, bloques de sección; también `theme-color` |
| `--color-cobalt-deep` | `#0a47a0` | Botón principal al pasar el cursor |
| `--color-cobalt-ink` | `#083a7a` | Texto de enlaces y énfasis |
| `--color-cobalt-glow` | `#3f86e6` | Brillos y desenfoques decorativos |
| `--color-ink` | `#0f1722` | Texto principal |
| `--color-ink-2` | `#33415a` | Texto secundario |
| `--color-ink-3` | `#5b6b85` | Texto terciario y etiquetas |
| `--color-line` | `#d4deed` | Bordes |
| `--color-line-soft` | `#e6edf7` | Bordes suaves |
| `--color-night` | `#0b1b33` | Fondo oscuro (casos) |
| `--color-night-2` | `#102647` | Tarjetas sobre fondo oscuro |
| `--color-night-line` | `#1f3a63` | Bordes sobre fondo oscuro |
| `--color-night-text` | `#b8cbe8` | Texto sobre fondo oscuro |

Otros colores en el código: `#34d399` (indicador "en línea" del chat), `#0081FB` (Meta), `#FF4A00` (Zapier), `#141413` (Anthropic).
Sombras: `--shadow-lift: 0 12px 32px -14px rgb(14 95 203 / 0.28), 0 2px 6px -2px rgb(15 23 34 / 0.08)`; `--shadow-phone: 0 40px 80px -32px rgb(8 58 122 / 0.45), 0 8px 24px -12px rgb(15 23 34 / 0.18)`.
Radios: burbuja `1.125rem`, tarjeta `1.25rem`, píldora `999px`.
Curvas de animación: `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`; `--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)`.

### Tipografías
- **Bricolage Grotesque Variable** (única tipografía de texto). Pesos 200–800, autoalojada en `public/fonts/bricolage-grotesque-latin.woff2`. Respaldo: "Bricolage fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif.
  - Titulares: peso 600, `letter-spacing: -0.035em`, `line-height: 0.98`, `font-variation-settings: "opsz" 96, "wdth" 96` (utilidad `display-tight`).
  - H1 de portada: `clamp(2.4rem, 5vw, 4.2rem)`; H2: `clamp(2rem, 4.2vw, 3.25rem)`; texto de entrada: `clamp(1.05rem, 1.4vw, 1.25rem)`; cuerpo: `1.02rem`.
  - Cifras: `font-variant-numeric: tabular-nums lining-nums` (utilidad `tnum`).
- **Twemoji Country Flags** (`public/fonts/TwemojiCountryFlags.woff2`): solo para las banderas del selector de país del teléfono.

---

## 6. Observaciones (inconsistencias detectadas)

1. **El nombre del pilar de software cambia según la sección:** "Software a medida en tiempo récord" (título del pilar, pie de página), "Software a medida" (menú), "Software" (chips y botón "Ver software") y "Software a medida en 30 días" (`llms.txt`).
2. **Mayúsculas en IA:** "Inteligencia Artificial" (título del pilar y pie) frente a "Inteligencia artificial" (menú y `llms.txt`).
3. **Marketing:** "Marketing" en el sitio y "Marketing, SEO y AEO" en `llms.txt`.
4. **"Pilares" o "Servicios":** el menú los agrupa como "Servicios"; el pie, la ruta de navegación y los títulos los llaman "Pilares".
5. **Marca:** el sitio escribe siempre "IonosHub"; el manual de marca descrito en PRODUCT.md es "IONOS" + "HUB" vertical. Para los videos hay que decidir qué grafía usar en los textos.
6. **Caso Daniela Vidal:** está clasificado en el pilar **Automatizaciones**, pero la solución es "Un agente de IA". Además aparece como caso de los pilares IA y Automatizaciones a la vez.
7. **Sello "Casos reales con cifras" (hero):** 2 de los 7 casos (La Victoria y Comunidad de la IA) no tienen cifra; su "resultado" es cualitativo.
8. **"Precio pensado para ti / para empresas como la tuya"** (hero) frente a "Sin catálogos de precios públicos": la asequibilidad se promete sin ninguna cifra. Es coherente con PRODUCT.md, pero no hay precio que mostrar en un video.
9. **El hero tiene dos subtítulos distintos** (móvil y escritorio) con redacción diferente.
10. **Los pilares se ven incompletos en la home:** solo se muestran los 5 primeros puntos de "incluye". Marketing tiene 8 (en la home faltan "Segmentación…", "Optimización continua…" y "Creación de contenido digital…") e IA tiene 6 (falta "LLMs avanzados…").
11. **Prueba del sector Retail:** remite al caso Zona Gamers, cuyo resultado es la automatización de la clasificación de archivos, no un agente que consulta stock.
12. **Partners sin sello oficial:** Meta Tech Provider, Zapier y Anthropic se muestran como texto. PRODUCT.md indica que los sellos "están pendientes de entrega". Conviene no animar emblemas de programa que el sitio no tiene.
13. **Números de clientes en la documentación:** PRODUCT.md habla de "6 casos" y "7 logos", pero el sitio muestra 7 casos y 13 logos.
14. **Pawau:** el sitio dice "Peluquería y spa canino"; PRODUCT.md, "veterinaria/spa canino".
15. **Webinars desactualizados:** las dos ediciones son del 22 y 24 de septiembre de 2026 y `llms.txt` aún dice "Registro abierto" (hoy es 12 de octubre de 2026). La página calcula sola si un webinar es próximo o pasado; `llms.txt` no.
16. **`llms.txt` sin el artículo** "La industria 4.0 y el secuestro de los sistemas de control" (publicado el 2026-09-13).
17. **Demostraciones con negocios ficticios parecidos a clientes reales:** "Studio Aura" (demo) frente a "Aura Beauty Studio" (cliente); "Distribuidora El Portal" (demo) frente a "Distribuidora Hernández" (cliente). En un video se pueden confundir con casos reales.
18. **La IA de voz aparece con dos nombres:** "IA de voz (IVR)" y "IONIC". Las FAQ las presentan como capacidades del mismo agente.
19. **Archivos sin uso en el sitio:** versiones antiguas de logos en `/imgs/clientes/*.png|jpeg` (las que se usan están en `clientes/marca/`), `/imgs/clientes/distribuidora.webp`, `/imgs/clientes/mianonna.webp`, `/imgs/clientes/chipotle.webp`, `/imgs/webinars/ia-en-tu-trabajo.webp` y `/imgs/sistemas/correo.webp` (excluido a propósito).
20. **Facebook:** el pilar de IA ofrece "Agentes en WhatsApp, Instagram y Facebook", pero IonosHub no publica una página de Facebook propia.

---

## Anexo: servicios en JSON para plantillas

```json
[
  {
    "nombre": "Inteligencia Artificial",
    "resumen": "IA que contesta llamadas y mensajes 24/7 y agenda sola.",
    "beneficio": "Ningún cliente se queda sin respuesta, ni fuera de horario: la IA atiende, entiende audios, imágenes y documentos, y agenda.",
    "icono": "src/components/Icon.astro#ia"
  },
  {
    "nombre": "Automatizaciones",
    "resumen": "Todos tus leads en un CRM y procesos repetitivos automatizados.",
    "beneficio": "Todos los leads en un CRM unificado, el trabajo repetitivo hecho solo y la rentabilidad por canal visible en un dashboard.",
    "icono": "src/components/Icon.astro#automatizaciones"
  },
  {
    "nombre": "Marketing",
    "resumen": "Pauta en Meta, SEO y AEO que traen clientes reales.",
    "beneficio": "Que te encuentren en Google, que la IA te nombre y que la pauta traiga clientes, no likes.",
    "icono": "src/components/Icon.astro#marketing"
  },
  {
    "nombre": "Software a medida en tiempo récord",
    "resumen": "Tu sistema a medida, con alcance cerrado, listo en 30 días.",
    "beneficio": "Un sistema que encaja con cómo opera tu negocio, con alcance cerrado y funcionando en 30 días.",
    "icono": "src/components/Icon.astro#software"
  }
]
```
