# Cuestionario de página web → PRD automático

Versión en línea del documento «Cuestionario para tu página web». El cliente lo llena por pasos en
`https://ionoshub.net/cuestionario-web`, n8n le pide a Claude el PRD de su página en Markdown y lo guarda
en Google Drive junto con las respuestas originales.

```
Cliente ──► /cuestionario-web ──► /api/cuestionario ──► n8n «Cuestionario web → PRD (Drive)»
            (clave + 13 pasos)    (clave, frenos,        ├─ Claude escribe el PRD
                                   limpia, Markdown)      ├─ .md en Drive (carpeta «LANDING > PRDS»)
                                                          └─ correo a info@ionoshub.net con el .md adjunto
```

## Página

- Ruta oculta, como las landings de pauta: se llega por el enlace que se envía al cliente, **ningún enlace del
  sitio apunta a ella**, es `noindex` y está fuera del sitemap. `BaseLayout interno` quita navegación, pie,
  pop-up de webinar, chat de IONIC y Pixel; deja el flotante de WhatsApp por si el cliente se atasca.
- Portada con la clave → «Tus datos» (negocio, nombre, WhatsApp y correo son los únicos obligatorios) →
  las once secciones del documento → repaso (avisa de las preguntas ★ sin responder) → confirmación con
  los cuatro pasos de «¿Qué pasa después?».
- Las respuestas se guardan solas en el navegador (`localStorage`): el cliente puede cerrar y seguir otro día.
  Se borran al enviar.
- Las preguntas, opciones, ayudas y el glosario viven en `src/data/cuestionario.ts`. Cambiar una pregunta =
  cambiarla ahí: el formulario, la validación del servidor y el Markdown que recibe Claude salen de ese archivo.

## Clave (anti envíos masivos)

`CUESTIONARIO_CLAVE` en Vercel (Settings → Environment Variables, sólo Production y Preview). Es la clave que
se le da al cliente junto con el enlace, p. ej.:

> Hola, te comparto el cuestionario para tu página web: https://ionoshub.net/cuestionario-web
> Clave de acceso: ********

- La portada la comprueba antes de dejar empezar y se vuelve a comprobar al enviar.
- Frenos por IP: 20 intentos de clave por hora y 6 envíos al día (Upstash si está configurado; si no, en memoria).
- Sin la variable, en producción el cuestionario responde «no disponible» (cerrado por defecto). En desarrollo
  acepta cualquier clave para poder probar.
- Para cambiarla basta con editar la variable y volver a desplegar; quien ya tenía la pestaña abierta tendrá
  que escribir la nueva al enviar (sus respuestas no se pierden).

## Variables de entorno (Vercel)

| Variable | Valor |
| --- | --- |
| `CUESTIONARIO_CLAVE` | La que definas para los clientes. |
| `CUESTIONARIO_WEBHOOK_URL` | `https://n8n.ionoshub.net/webhook/cuestionario-web` |
| `CUESTIONARIO_WEBHOOK_KEY` | El valor de `webhook_key` en la data table `cuestionario_web_config` de n8n. |

## n8n · «Cuestionario web → PRD (Drive)»

Flujo `zvLJyrXuu27FpvA7`. Webhook `POST /webhook/cuestionario-web`:

1. Lee `cuestionario_web_config` y compara el header `x-ionos-key` con `webhook_key`. Si no coincide → 401.
2. Responde 202 a la web al instante (el cliente no espera a Claude).
3. **Generar PRD (Claude)** con la credencial «IONOS Anthropic». El prompt de sistema exige no inventar cifras,
   precios ni testimonios, marcar las recomendaciones, dejar «Pendiente: …» donde falte información y seguir
   la estructura de 16 secciones (resumen, negocio, objetivo y medición, público, oferta, confianza,
   arquitectura, copy, dirección visual, material, requisitos, tiempos e inversión, riesgos, preguntas
   abiertas y próximos pasos).
4. **Armar documento**: PRD + anexo con las respuestas literales del cliente. Si Claude falla, el documento
   sale igual con las respuestas y un aviso.
5. **Guardar en Drive**: crea `AAAA-MM-DD · Negocio · PRD página web.md` en la carpeta elegida en el propio
   nodo («LANDING > PRDS»). Para cambiar de carpeta, se elige otra en ese nodo.
6. Correo a `notificar_a` con el enlace de Drive y el `.md` adjunto (aunque Drive haya fallado).

Configuración sin tocar el flujo (data table `cuestionario_web_config`, columnas `clave` / `valor`):

| clave | Para qué |
| --- | --- |
| `webhook_key` | Clave compartida con la web (`CUESTIONARIO_WEBHOOK_KEY`). |
| `modelo` | Modelo de Claude, por defecto `claude-opus-5-5` (`claude-sonnet-5-5` es más rápido y barato). |
| `max_tokens` | Largo máximo del PRD (2000–20000, por defecto 12000). |
| `notificar_a` | Correo(s) que reciben el aviso, separados por coma. |

Las ejecuciones de producción que salen bien no se guardan en n8n (configuración por defecto), así que no
se pueden reintentar desde el historial. Si quieres poder revisarlas o relanzarlas: flujo → Settings → «Save
successful production executions» → Save.

(La fila `drive_carpeta` de la tabla ya no se usa: la carpeta se elige en el nodo.)

### Credencial de Google Drive (cuenta de servicio)

«Guardar en Drive» usa la cuenta de servicio «Acc Service IONOS HUB»
(`cliente-n8n@ionos-hub.iam.gserviceaccount.com`), que no caduca como el OAuth. Tiene permiso de edición en
«LANDING > PRDS», pero **una cuenta de servicio no tiene espacio propio**: Google rechaza que cree archivos
en una carpeta de «Mi unidad» (403 «Forbidden»), aunque sí le deja crear carpetas. Hace falta una de dos cosas:

- **Unidad compartida** (recomendado): mover «LANDING > PRDS» a una unidad compartida de Google Workspace y
  añadir a `cliente-n8n@ionos-hub.iam.gserviceaccount.com` como «Administrador de contenido». Al moverla, la
  carpeta conserva su ID, así que el flujo no se toca. Los archivos pasan a ser de la unidad, no de la cuenta.
- **Delegación de dominio**: en Google Workspace (Admin → Seguridad → Controles de API → Delegación de todo el
  dominio) autorizar el ID de cliente de la cuenta de servicio con el alcance
  `https://www.googleapis.com/auth/drive`, y en la credencial de n8n activar «Impersonate a User» con
  `info@ionoshub.net`. Los archivos quedan a nombre de esa persona.

Mientras no esté ninguna, el PRD sigue llegando completo como adjunto en el correo.

## Probar

- En local, sin variables: `npm run dev` → `http://localhost:4321/cuestionario-web`, cualquier clave. Al enviar,
  la respuesta trae el Markdown (`markdown`) que se mandaría a n8n.
- Contra n8n: con `CUESTIONARIO_WEBHOOK_URL` y `CUESTIONARIO_WEBHOOK_KEY` en `.env`. Un envío con `"prueba": true`
  en el cuerpo sale con «[PRUEBA]» en el nombre del archivo y en el asunto del correo.
