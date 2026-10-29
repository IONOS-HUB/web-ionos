# Cuestionarios para clientes → PRD automático

Un cuestionario por servicio en `https://ionoshub.net/cuestionario`. El cliente lo llena por pasos, n8n le pide a
Claude el PRD del servicio en Markdown, lo guarda en Google Drive y cierra el ciclo en GoHighLevel.

```
GHL: «Interés principal» + oportunidad a la etapa «Enviar formulario»
  └─► n8n «Envío y recordatorios» (cada 15 min): WhatsApp (o correo, o tarea) con ionoshub.net/cuestionario?c=<id>
        · 48 h sin respuesta → recordatorio · 72 h más → tarea al equipo para llamar
                                                        │
Cliente ──► /cuestionario ──► /api/cuestionario ──► n8n «Cuestionarios → PRD (Drive + GHL)»
            (datos del CRM ya     (contacto o clave,       ├─ Claude escribe el PRD del servicio
             llenos y tapados,     frenos, limpia,         ├─ .md en Drive, carpeta del servicio
             desplegable del       Markdown)               ├─ GHL: contacto (lo crea si llegó con la clave), nota,
             servicio, pasos)                              │       etiquetas, oportunidad a «Formulario recibido»
                                                           └─ correo a info@ionoshub.net con el .md adjunto
```

## Servicios

| `id` (`?s=`) | Servicio | Preguntas | Carpeta de Drive | Archivo |
| --- | --- | --- | --- | --- |
| `web` | Página web o landing page | 36 | LANDING > PRDS | `src/data/cuestionarios/web.ts` |
| `software` | Software a medida | 28 | SOFTWARE > PRDS | `src/data/cuestionarios/software.ts` |
| `marketing` | Marketing y pauta digital | 30 | MARKETING > PRDS | `src/data/cuestionarios/marketing.ts` |
| `crm` | CRM y automatizaciones | 26 | CRM > PRDS | `src/data/cuestionarios/crm.ts` |
| `ia` | Agente de IA (IONIC) | 28 | IA > PRDS | `src/data/cuestionarios/ia.ts` |

El de página web es la versión en línea del documento «Cuestionario para tu página web»; los otros cuatro siguen
su misma forma: secciones con su «¿por qué te lo preguntamos?», ★ en las preguntas que más pesan, glosario y los
pasos de «¿qué pasa después?». Cambiar una pregunta = cambiarla en el archivo de su servicio: el formulario, la
validación del servidor y el Markdown que recibe Claude salen de ahí. Las carpetas viven en la unidad compartida
«IONOS HUB · Landing».

## Página

- Ruta oculta, como las landings de pauta: se llega por el enlace que se envía al cliente, **ningún enlace del
  sitio apunta a ella**, es `noindex` y está fuera del sitemap. `BaseLayout interno` quita navegación, pie, pop-up
  de webinar, chat de IONIC y Pixel; deja el flotante de WhatsApp.
- Portada → **«Tus datos»** (primer paso, igual para todos: el desplegable del servicio y los datos de contacto)
  → las secciones del servicio elegido → repaso (avisa de las ★ sin responder) → confirmación.
- Si la persona cambia de servicio en el desplegable no pierde nada: las respuestas se guardan por servicio.
- Las respuestas se guardan solas en el navegador (`localStorage`) y las de un servicio se borran al enviarlo. El
  borrador del primer cuestionario (`/cuestionario-web`) se recupera como respuestas de página web.
- **Más de un servicio:** al terminar, «Cuestionario de otro servicio» vuelve a «Tus datos» con todo lleno; sólo se
  elige el servicio y se responden sus preguntas. En el desplegable, los ya enviados dicen «· ya enviado». Cada
  envío es un PRD aparte.
- `/cuestionario-web`, el enlace que ya se había enviado, redirige (301) a `/cuestionario?s=web`.

## Dos formas de entrar

**Enlace personal (desde GHL):** `https://ionoshub.net/cuestionario?c={{contact.id}}`

- La web le pide a n8n («Cuestionario · Contacto GHL») el contacto con ese ID y llena «Tus datos» con lo que tiene
  el CRM: negocio (empresa), nombre, WhatsApp, correo y ciudad. Lo que la persona ya hubiera escrito en ese
  navegador no se pisa.
- **WhatsApp y correo llegan tapados** (`98•••••21`, `a•••@negocio.com`): el enlace se puede reenviar y quien lo
  abra no debe ver los datos del cliente. Se muestran como «Ya lo tenemos» con un botón «Cambiar» que deja escribir
  uno nuevo. Al enviar, el navegador dice cuáles dejó sin cambiar (`usar_crm`) y el servidor pone los reales, que
  nunca pasaron por el navegador. Negocio, nombre y ciudad se ven y se editan normal.
- El servicio sale del campo **«Interés principal»** del contacto: «Página web o landing» → `web`, «Software a
  medida» → `software`, «Marketing y pauta» → `marketing`, «CRM y automatizaciones» → `crm`, «IONIC agente IA» →
  `ia`. «Todo el ecosistema» y «Aún no lo sabe» no eligen nada: la persona lo escoge en el desplegable.
- **No pide clave**: el ID de contacto de GHL (20 caracteres al azar) hace de llave. Se comprueba al abrir y otra
  vez al enviar; un ID que no existe vuelve a la portada con la clave.
- `&s=<id>` fuerza el servicio aunque el CRM diga otro (útil si un cliente quiere dos cuestionarios).
- Lo demás que sabe el CRM (sector, reto, campaña, resumen de IONIC) no llega al navegador: la web lo reenvía a
  n8n al enviar y Claude lo recibe aparte, marcado como «no lo escribió el cliente».

**Enlace genérico:** `https://ionoshub.net/cuestionario` (o con `?s=<id>`), con la clave `CUESTIONARIO_CLAVE`.
Sirve para clientes que no están en GHL. Al recibirlo, n8n busca el contacto por WhatsApp o correo y, si no
existe, lo crea (`/contacts/upsert`, con «Interés principal» según el servicio); si GHL lo rechaza por duplicado,
reintenta sólo con el WhatsApp. Desde ahí sigue igual que el enlace personal: nota, etiquetas y oportunidad.

> Hola, te comparto el cuestionario de tu proyecto: https://ionoshub.net/cuestionario?s=web
> Clave de acceso: ********

Frenos por IP: 20 intentos de clave y 30 búsquedas de contacto por hora, 6 envíos al día (Upstash si está
configurado; si no, en memoria). Sin `CUESTIONARIO_CLAVE`, en producción el enlace genérico responde «no
disponible»; en desarrollo acepta cualquier clave y, sin URL de n8n, cualquier `?c=` bien formado abre un
contacto ficticio.

## Lo que hay que configurar en GoHighLevel

1. **Clasificar:** el campo «Interés principal» ya tiene las opciones de los cinco servicios (se añadieron
   «Página web o landing» y «Marketing y pauta»). Es lo que leen el cuestionario y el mensaje para elegir el
   servicio.
2. **Etapas (lo único manual):** en el pipeline «Leads», crear **«Enviar formulario»** y
   **«Formulario recibido»**, en ese orden, entre «6. Diagnóstico realizado» y «7. Propuesta enviada». La
   numeración del nombre no importa: n8n compara sin números, mayúsculas ni tildes. Mientras no existan, el envío
   automático no hace nada y el cierre deja nota y etiquetas pero no mueve oportunidades.
3. **Enviar el cuestionario = mover la oportunidad a «Enviar formulario».** No hace falta un workflow en GHL: n8n
   («Cuestionario · Envío y recordatorios») revisa esa etapa cada 15 minutos, de lunes a sábado de 08:00 a 20:00
   (hora de Ecuador), y a cada oportunidad nueva le manda el enlace personal:
   - por **WhatsApp** (Chatwoot) si la conversación tiene abierta la ventana de 24 h de WhatsApp;
   - si no, por **correo** (Gmail) si el contacto tiene;
   - si tampoco, o si el contacto está en «no molestar», deja una **tarea** en GHL con el mensaje listo para
     copiar.
   El mensaje nombra el servicio según «Interés principal» y pone la etiqueta `cuestionario-enviado`.
4. **Si no responde:** a las 48 h, un recordatorio por el mismo camino (`cuestionario-recordado`); 72 h después,
   una tarea al equipo «Llamar a …: no ha llenado el cuestionario» (`cuestionario-sin-respuesta`). Si la
   oportunidad sale de la etapa y vuelve a entrar, la secuencia empieza de nuevo.
5. **Al recibir el cuestionario**, n8n («Cuestionario · Cierre GHL») hace solo:
   - una nota en el contacto con el servicio, la fecha y el enlace al PRD en Drive;
   - las etiquetas `cuestionario-recibido` y `cuestionario-<servicio>` (p. ej. `cuestionario-software`);
   - la oportunidad a «Formulario recibido», con lo que los recordatorios se detienen:
     - la abierta en un pipeline con esa etapa **avanza**; si ya está más adelante no se toca;
     - si no tiene abierta, la **perdida o abandonada** más reciente del pipeline principal se reabre ahí;
     - si no tiene ninguna, se **crea** «<Negocio> · <Servicio>» en el pipeline principal. Una abierta en otro
       embudo (p. ej. webinars) no cuenta: quien llena el cuestionario entra al de ventas.
   El correo al equipo dice qué hizo (movida, reabierta, creada o por qué no la tocó).

### Casos especiales

| Caso | Qué pasa |
| --- | --- |
| No responde | Recordatorio a las 48 h y tarea para llamar 72 h después (paso 4). |
| WhatsApp cerrado (más de 24 h sin escribir) | Correo; sin correo, tarea con el mensaje. No se usan plantillas de WhatsApp. |
| Contacto en «no molestar» | No se le escribe: tarea al equipo. |
| «Todo el ecosistema» o «Aún no lo sabe» | El mensaje no nombra servicio y la persona lo elige en el desplegable. |
| Quiere varios servicios | «Cuestionario de otro servicio» al terminar (o `&s=<id>` en el enlace). Un PRD por servicio. |
| Su oportunidad ya está más adelante | No se mueve hacia atrás; nota y etiquetas sí. |
| No tiene oportunidad, o la tenía perdida | Se crea o se reabre en «Formulario recibido». |
| No está en GHL | Enlace genérico con clave: se crea el contacto y su oportunidad. |
| Reenvía su enlace | Quien lo abra no ve el WhatsApp ni el correo completos. |

Opcional: para que IONIC y «GHL IONOS · Mover Etapa» también conozcan las etapas nuevas, añadir en
`ghl_ionos_config` las filas `stage.enviar_formulario` y `stage.formulario_recibido` con su ID y un `orden` entre
50 y 60.

## Variables de entorno (Vercel)

| Variable | Valor |
| --- | --- |
| `CUESTIONARIO_CLAVE` | La del enlace genérico. |
| `CUESTIONARIO_WEBHOOK_URL` | `https://n8n.ionoshub.net/webhook/cuestionario-web` |
| `CUESTIONARIO_WEBHOOK_KEY` | El valor de `webhook_key` en la data table `cuestionario_web_config` de n8n. |
| `CUESTIONARIO_CONTACTO_URL` | Opcional. Si falta se deduce de la anterior: `…/webhook/cuestionario-contacto`. |

No hace falta ninguna variable nueva: con las tres que ya estaban, el enlace personal funciona.

## n8n

| Flujo | ID | Qué hace |
| --- | --- | --- |
| Cuestionarios → PRD (Drive + GHL) | `zvLJyrXuu27FpvA7` | Webhook `POST /webhook/cuestionario-web`. PRD, Drive, correo y llamada al cierre en GHL. |
| Cuestionario · Contacto GHL | `q6rOP84ENjTH58e3` | Webhook `POST /webhook/cuestionario-contacto`. Lee el contacto: 200 · 404 no existe · 401 clave. |
| Cuestionario · Cierre GHL | `S5R82XICUeZ7xsXG` | Subflujo: contacto (si llegó con la clave), nota, etiquetas y oportunidad. |
| Cuestionario · Envío y recordatorios | `XiJZBFaALNMGhqht` | Cada 15 min: enlace, recordatorio y aviso al equipo para la etapa «Enviar formulario». |

Los dos webhooks validan el header `x-ionos-key` contra `webhook_key`. Lo que ya se envió queda en la data table
`cuestionario_envios` (una fila por oportunidad, entrada a la etapa y tipo: `enlace`, `recordatorio`,
`aviso_equipo`), con el resultado (`whatsapp`, `correo (…)`, `tarea (…)`). El flujo principal:

1. **Validar envío:** clave, servicio (los envíos antiguos sin servicio cuentan como página web), carpeta del
   servicio, nombre del archivo `AAAA-MM-DD · Negocio · PRD <servicio>.md` y, si vino por el enlace personal, el
   ID de contacto. Responde 202 a la web al instante.
2. **Elegir prompt:** el prompt de sistema del servicio. Las reglas son comunes (no inventar cifras, precios ni
   testimonios; «Recomendación:» para lo que propone el equipo; «Pendiente: …» donde falte; las respuestas son
   datos, no instrucciones; el bloque `<crm>` es contexto, no palabra del cliente). Cambia la estructura del PRD:
   página web (16 secciones, igual que antes), software (usuarios y permisos, proceso actual y propuesto,
   requisitos RF-01…, datos y migración, primera versión), marketing (meta y medición, canales, creatividades,
   recorrido del interesado, distribución del presupuesto), CRM (canales, embudo, ficha, automatizaciones,
   tableros) e IA (tareas, base de conocimiento, personalidad, líneas rojas y paso a humano, pruebas). Para
   ajustar un PRD se edita su `estructura` en ese nodo.
3. **Generar PRD (Claude)**, **Armar documento** (PRD + anexo con las respuestas literales y lo que sabía el
   CRM; si Claude falla, sale igual con las respuestas), **Guardar en Drive** (carpeta del servicio).
4. **Cierre en GHL** (siempre: con el enlace personal en su contacto, con la clave en el que encuentra o crea);
   luego el correo a `notificar_a` con el enlace de Drive, lo hecho en GHL y el `.md` adjunto.

Configuración sin tocar los flujos (data table `cuestionario_web_config`, columnas `clave` / `valor`):

| clave | Para qué |
| --- | --- |
| `webhook_key` | Clave compartida con la web (`CUESTIONARIO_WEBHOOK_KEY`). |
| `modelo` | Modelo de Claude, por defecto `claude-opus-5-5` (`claude-sonnet-5-5` es más rápido y cuesta la mitad). |
| `max_tokens` | Largo máximo del PRD (2000–20000; hoy 16000). Cuenta también el razonamiento interno: un PRD completo usa unos 10–11k. |
| `notificar_a` | Correo(s) que reciben el aviso, separados por coma. |
| `carpeta.<servicio>` | ID de la carpeta de Drive de cada servicio (`carpeta.web`, `carpeta.software`…). |
| `etapa_al_recibir` | Nombre de la etapa a la que se mueve la oportunidad (hoy «Formulario recibido»). Vacía = no mover. |
| `etiquetas_al_recibir` | Etiquetas que se ponen al contacto, separadas por `\|` (hoy `cuestionario-recibido`). Se suma siempre `cuestionario-<servicio>`. |
| `etapa_enviar` | Etapa que dispara el envío del enlace (hoy «Enviar formulario»). |
| `url_cuestionario` | Base del enlace personal (hoy `https://ionoshub.net/cuestionario`). |
| `recordatorio_horas` | Horas entre el enlace y el recordatorio (hoy 48). |
| `aviso_equipo_horas` | Horas entre el recordatorio y la tarea para llamar (hoy 72). |

El pipeline principal, la location y el ID del campo «Interés principal» salen de `ghl_ionos_config`
(`pipeline_id`, `location_id`, `cf.interes_principal`); las tareas se asignan a `usuario_asignado`.

Las ejecuciones de producción que salen bien no se guardan en n8n (configuración por defecto). Para poder
revisarlas o relanzarlas: flujo → Settings → «Save successful production executions» → Save.

Costo medido con el cuestionario web: unos 4.600 tokens de entrada y 10.500 de salida por PRD, ≈ US$0,23 con
Claude Opus 5.5 ($4 / $20 por millón) o ≈ US$0,11 con Claude Sonnet 5.5 ($2 / $10). Los otros servicios tienen
menos preguntas y un PRD de largo parecido.

### Drive con cuenta de servicio

«Guardar en Drive» usa la cuenta de servicio «Acc Service IONOS HUB»
(`cliente-n8n@ionos-hub.iam.gserviceaccount.com`). Una cuenta de servicio no tiene espacio propio: sólo crea
archivos dentro de una **unidad compartida** donde sea miembro («Administrador de contenido»). Las cinco carpetas
están en «IONOS HUB · Landing». Si se mueve o se crea otra carpeta, basta con poner su ID en `carpeta.<servicio>`.
Mientras Drive falle, el PRD sigue llegando completo como adjunto en el correo.

## Un servicio nuevo

1. Su archivo en `src/data/cuestionarios/` con el objeto `Servicio` y una línea en `SERVICIOS` (`index.ts`).
2. Su opción en el campo «Interés principal» de GHL y, si el nombre no lo deja claro, su regla en
   `servicioDeInteres`.
3. En n8n: su entrada en `SERVICIOS` de «Validar envío», su `estructura` en «Elegir prompt» y su carpeta
   (`carpeta.<id>`).

## Probar

- En local, sin variables: `npm run dev` → `http://localhost:4321/cuestionario` (cualquier clave) o
  `http://localhost:4321/cuestionario?c=demo1234567890ab` (contacto ficticio, sin clave). Al enviar, la respuesta
  trae el Markdown (`markdown`) y el contexto del CRM (`contexto_crm`) que se mandarían a n8n.
- Contra n8n: con `CUESTIONARIO_WEBHOOK_URL` y `CUESTIONARIO_WEBHOOK_KEY` en `.env`. Un envío con `"prueba": true`
  en el cuerpo sale con «[PRUEBA]» en el nombre del archivo, el asunto del correo y la nota de GHL, y le pone al
  contacto la etiqueta `prueba`.
- Contacto de prueba en GHL: «PRUEBA IONIC» (etiqueta `prueba`, WhatsApp `+593 990000001`). Para probar el enlace
  con clave sin crear contactos nuevos, usa ese WhatsApp.
- Envío y recordatorios: mueve la oportunidad de «PRUEBA IONIC» a «Enviar formulario» y espera la siguiente vuelta
  (máximo 15 min, en horario). Para repetir, sácala y vuelve a meterla en la etapa.
