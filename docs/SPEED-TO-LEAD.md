# Landings "speed to lead" y entrega a GoHighLevel

## Rutas

| Variante | URL | Contenido |
| --- | --- | --- |
| `general` | `/speed-to-lead` | Formulario con la reputación al lado: cofundadores, casos reales con cifra, partners, testimonios (si hay) y franja de logos. |
| `instituciones` | `/speed-to-lead/instituciones` | Formulario sobre fondo motion/video del nicho `institutos`, con su cliente real. Sin testimonios. |
| `clinicas` | `/speed-to-lead/clinicas` | Formulario sobre fondo motion/video del nicho `clinicas`, con su cliente real. Sin testimonios. |

Cada una es una página de registro de una sola pantalla: el formulario es todo el contenido (`components/landing/RegistroGeneral.astro`, `RegistroNicho.astro`, ventanilla en `FormWindow.astro`). En móvil el formulario va justo después del titular.

Son sólo para tráfico de pauta: se accede por URL directa y **ningún enlace del sitio apunta a ellas**. No llevan navegación, pie, chat ni pop-up de webinar (sólo el logo sin enlace, el formulario y el botón flotante de WhatsApp). Son `noindex` y no están en el sitemap. No las bloquees en `robots.txt`: Google Ads y Meta necesitan rastrearlas para aprobar los anuncios, y el `noindex` sólo se respeta si el rastreador puede leer la página.
Para la pauta, usa la URL con UTMs, p. ej. `https://ionoshub.net/speed-to-lead/clinicas?utm_source=meta&utm_campaign=clinicas-oct`.
Medición en Meta (Pixel + API de Conversiones, evento `Lead`): `docs/META-PIXEL.md`.

El contenido de cada variante es un objeto en `src/data/landings.ts` (titular, promesas, etiquetas del formulario, pregunta de calificación, fondo, mensaje de WhatsApp, meta). Para añadir una: el objeto ahí, su archivo en `src/pages/speed-to-lead/` y su id en `LandingId`.

## Videos de fondo (instituciones y clínicas)

Se suben a `public/videos/landings/`:

- `<variante>.mp4` (H.264) y opcionalmente `<variante>.webm` — 8–15 s en bucle, sin audio, 1920×1080, idealmente < 4 MB.
- `<variante>.webp` — póster (primer fotograma).

Si los archivos no existen, la página usa el fondo motion en CSS (halos cobalto sobre noche). El video no se descarga con `prefers-reduced-motion`, `?nomotion=1` ni con ahorro de datos. Un velo noche→cobalto mantiene el contraste del texto: el video puede ser de colores, pero mejor si es azul/oscuro.

## Testimonios

`src/data/testimonials.ts` está vacío a propósito (PRODUCT.md: nada inventado). Al añadir entradas reales, la sección aparece sola en la landing general.

## Endpoint

`POST /api/speed-to-lead` → `deliverLead()` en `src/lib/lead.ts`, con freno por IP/contacto (`allowLead`, ámbito `stl`).

```json
{
  "variante": "clinicas",
  "nombre": "Andrea Vaca",
  "correo": "andrea@clinica.ec",
  "codigo_pais": "+593",
  "telefono": "0991234567",
  "organizacion": "Centro Médico X",
  "calificacion": "2 a 5",
  "consentimiento": true,
  "pagina_origen": "https://ionoshub.net/speed-to-lead/clinicas?utm_source=meta",
  "utm": { "utm_source": "meta", "utm_campaign": "clinicas-oct" }
}
```

`calificacion` sólo acepta las opciones de su variante.

## GoHighLevel

`deliverLead()` envía **todos** los leads del sitio (formulario, chat IONIC, webinars y estas landings) a `GHL_WEBHOOK_URL`, y además a `LEAD_WEBHOOK_URL` (n8n) si sigue configurada. Basta que un destino responda 2xx.

### Configuración

1. GHL → **Automation → Workflows → Create Workflow** → trigger **Inbound Webhook**.
2. Copia la URL del trigger a `GHL_WEBHOOK_URL` en Vercel (Settings → Environment Variables) y redeploya.
3. Envía un lead de prueba desde `/speed-to-lead` para que GHL capture la estructura.
4. Añade la acción **Create/Update Contact** y mapea los campos (abajo). Luego **Add Tag** con `{{inboundWebhookRequest.tags}}` o tags fijos por rama, y la notificación/asignación al equipo.

### Campos que llegan

| Campo | Ejemplo | Mapear a |
| --- | --- | --- |
| `first_name`, `last_name`, `full_name` | `Andrea`, `Vaca Pozo` | First / Last Name |
| `email` | `andrea@clinica.ec` | Email |
| `phone` | `+593991234567` (E.164) | Phone |
| `company_name` | `Centro Médico X` | Business Name |
| `source` | `ionoshub.net · speed-to-lead · clinicas` | Source |
| `tags` | `["web","speed-to-lead","clinicas"]` | Tags |
| `canal` | `formulario` · `chat-ionic` · `webinar` · `speed-to-lead` | campo personalizado |
| `variante` | `general` · `instituciones` · `clinicas` (vacío fuera de las landings) | campo personalizado |
| `servicio_interes`, `calificacion`, `nota` | | campos personalizados / nota |
| `cargo`, `area`, `webinar_titulo`, `webinar_fecha` | sólo webinars | campos personalizados |
| `pagina_origen`, `fecha_envio` | | campos personalizados |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` | sólo landings | atribución |

Para separar flujos, usa una rama (If/Else) por `canal` o `variante`.
