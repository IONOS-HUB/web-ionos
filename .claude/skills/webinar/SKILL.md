---
name: webinar
description: Publica una edición nueva de webinar en el sitio de IonosHub (ionoshub-v2). Úsala cuando el usuario diga "/webinar", "crea un webinar", "publica el webinar de…", "nuevo webinar", "agenda un webinar en la web" o pase los datos de un evento (fecha, charlas, ponentes, enlace del grupo). No es para el blog ni para casos de éxito.
---

# Publicar un webinar

Añade una edición a `ionoshub-v2/src/data/webinars.ts`. **No se toca ninguna página**: el índice
(`/webinars`), la página del evento (`/webinars/<slug>`), el pop-up de promoción, el sitemap y los
datos estructurados se alimentan de ese archivo. La documentación viva está en
`ionoshub-v2/docs/WEBINARS.md`; léela si algo de aquí no cuadra con el código.

## 1. Reúne los datos

Estos son obligatorios. Pregunta **sólo por los que falten**, en un único mensaje y no de uno en uno:

| Campo | Qué es | Ejemplo |
| --- | --- | --- |
| `title` | Nombre del webinar, en la voz del asistente, no del organizador | `Aprende a usar IA en tu trabajo` |
| `startsAt` | Fecha y hora en ISO **con zona** | `2026-09-24T19:00:00-05:00` |
| `hosts` | Organizaciones que lo dan | `['Cyberprevention', 'IonosHub']` |
| `sessions` | Una entrada por ponencia: `label`, `title`, `host` y, cuando estén confirmados, `speaker`, `speakerRole`, `moderator` y `detail` | ver el archivo |
| `topics` | 2 o 3 etiquetas para filtrar en el índice | `['Inteligencia artificial', 'Marco legal']` |
| `whatsappCommunity` | Enlace del grupo donde se reparte el acceso | `https://chat.whatsapp.com/…` |
| `promoImage` | Cartel del pop-up: 1080×1080 o 1080×1350, en `public/imgs/webinars/`. Si no lo tienen, genera el provisional con `npm run webinar:cartel <slug>` | ver `docs/WEBINARS.md` |

Si falta la fecha, pregunta antes de escribir nada: de ella salen la cuenta atrás, el estado y el
`Event` de datos estructurados. Si falta el enlace del grupo, se puede publicar sin él (la pantalla
de confirmación cambia sola), pero avísalo.

El resto los redactas tú a partir de lo anterior, sin inventar hechos:

- `slug`: en minúsculas y con guiones, corto y legible.
- `edition`: el siguiente número respecto al último objeto del array.
- `tagline`: una línea que remata el título.
- `summary`: dos o tres frases; se usa en el índice, en buscadores y en redes.
- `timezone`: cómo se lee la zona, p. ej. `GMT-5 · Ecuador`.
- `format` (`En línea y en vivo`), `price` (`Gratuito` salvo que digan otra cosa).
- `audience`: tres perfiles concretos a quienes les sirve.
- `takeaways`: tres cosas que se lleva quien asiste, en resultado, no en temario.
- `registrationOpen`: `true` salvo que te digan lo contrario.
- `metaTitle` y `metaDescription`: con la fecha dentro y el nombre de los organizadores.

## 2. Reglas que no se rompen

- **Nada inventado.** Sin persona ponente confirmada, `speaker` se omite; el diseño funciona sin él.
  Nunca cifras de asistentes, resultados ni testimonios que nadie haya dado.
- **Sin precios ni promesas** que no estén confirmadas. El sitio no publica tarifas.
- **Español de Ecuador**, tono comercial y directo, sin palabras de relleno.
- La fecha va en ISO con `-05:00`. Nada de fechas escritas a mano en el texto: las pantallas las
  formatean solas desde `startsAt`.

## 3. Escribe y verifica

1. Añade el objeto al array `webinars` de `ionoshub-v2/src/data/webinars.ts`, **al principio** si es
   el más próximo, respetando el orden de campos del que ya existe.
2. `npm run build` desde `ionoshub-v2/`. Debe terminar sin errores.
3. Levanta el servidor (preview_start con `ionoshub-v2-dev`) y comprueba en el navegador:
   - `/webinars` muestra el nuevo como destacado, con la cuenta atrás corriendo.
   - `/webinars/<slug>` carga, el formulario aparece y la agenda lista las charlas.
   - En cualquier otra página, el pop-up sale al bajar (borra antes `localStorage`
     `ionoshub-webinar-promo` y `sessionStorage` `ionoshub-webinar-promo-sesion`).
   - Sin desbordes a 375 px.
4. Si tocaste algo visual además del dato, pasa el detector:
   `node ../.claude/skills/impeccable/scripts/detect.mjs --json <archivos>`.

## 4. Publica

Commit y push a `main` **a nombre del usuario**, sin coautoría de Claude:

```bash
git -c user.name=itsOrlo -c user.email=orlo.montesdeoca@gmail.com commit -q -m "Webinar: <título>"
git push origin main
```

Vercel despliega solo. Avisa al usuario de la URL del evento y de que el pop-up ya lo está
promocionando en todo el sitio.

## Si además hay que probar el registro

El registro entrega al webhook de n8n con `canal: 'webinar'`. Para probarlo sin ensuciar el CRM,
levanta un webhook simulado en `127.0.0.1:4444`, pon `LEAD_WEBHOOK_URL` apuntando ahí en `.env`
(local, ignorado por git) y **reinicia el servidor de desarrollo**: Astro lee `.env` al arrancar.
