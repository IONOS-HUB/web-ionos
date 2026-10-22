# Cuestionario de página web → PRD automático

Versión en línea del documento «Cuestionario para tu página web». El cliente lo llena por pasos en
`https://ionoshub.net/cuestionario-web`, n8n le pide a Claude el PRD de su página en Markdown y lo guarda
en Google Drive junto con las respuestas originales.

```
Cliente ──► /cuestionario-web ──► /api/cuestionario ──► n8n «Cuestionario web → PRD (Drive)»
            (clave + 13 pasos)    (clave, frenos,        ├─ Claude escribe el PRD
                                   limpia, Markdown)      ├─ .md en Drive (carpeta «IONOS HUB · Cuestionarios web (PRD)»)
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
5. Busca la carpeta de Drive por nombre (la crea en la raíz si no existe) y guarda
   `AAAA-MM-DD · Negocio · PRD página web.md`.
6. Correo a `notificar_a` con el enlace de Drive y el `.md` adjunto (aunque Drive haya fallado).

Configuración sin tocar el flujo (data table `cuestionario_web_config`, columnas `clave` / `valor`):

| clave | Para qué |
| --- | --- |
| `webhook_key` | Clave compartida con la web (`CUESTIONARIO_WEBHOOK_KEY`). |
| `modelo` | Modelo de Claude, por defecto `claude-opus-5-5` (`claude-sonnet-5-5` es más rápido y barato). |
| `max_tokens` | Largo máximo del PRD (2000–20000, por defecto 12000). |
| `drive_carpeta` | Nombre exacto de la carpeta de Drive. |
| `notificar_a` | Correo(s) que reciben el aviso, separados por coma. |

### Credencial de Google Drive

Los tres nodos de Drive usan la credencial OAuth «Gestor de Redes Sociales». Para que los archivos queden en el
Drive de IONOS HUB, reconéctala con la cuenta que debe guardarlos: n8n → Credentials → «Gestor de Redes
Sociales» → Reconnect / Sign in with Google. Si prefieres una credencial nueva, créala y cámbiala en «Buscar
carpeta», «Crear carpeta» y «Guardar en Drive».

La cuenta de servicio (`cliente-n8n@ionos-hub.iam.gserviceaccount.com`) no sirve para esto: Google no le da
espacio propio y rechaza crear archivos (403), salvo dentro de una unidad compartida donde sea miembro.

## Probar

- En local, sin variables: `npm run dev` → `http://localhost:4321/cuestionario-web`, cualquier clave. Al enviar,
  la respuesta trae el Markdown (`markdown`) que se mandaría a n8n.
- Contra n8n: con `CUESTIONARIO_WEBHOOK_URL` y `CUESTIONARIO_WEBHOOK_KEY` en `.env`. Un envío con `"prueba": true`
  en el cuerpo sale con «[PRUEBA]» en el nombre del archivo y en el asunto del correo.
