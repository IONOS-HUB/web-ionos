# Landings "speed to lead" y entrega a GoHighLevel

## Rutas

| Variante | URL | Contenido |
| --- | --- | --- |
| `general` | `/speed-to-lead` | Formulario sobre campo cobalto; el ecosistema (cuatro pilares + flujo hacia el CRM); casos reales, logos y testimonios (si hay). |
| `software` | `/speed-to-lead/software` | Para el anuncio de software a medida: su mismo gancho como titular, cómo se construye (diagnóstico, diseño contigo, 30 días) con capturas de sistemas reales, y Ecu593 como caso principal. |
| `instituciones` | `/speed-to-lead/instituciones` | Formulario sobre campo noche con video del nicho `institutos`; demostración del sector, lo que hace y lo que nunca hace; casos. Sin testimonios. |
| `clinicas` | `/speed-to-lead/clinicas` | Igual con el nicho `clinicas` y su cliente real del sector. Sin testimonios. |

Las tres usan la misma página, `components/landing/Registro.astro` (ventanilla del formulario en `FormWindow.astro`, campo animado en `MotionBackdrop.astro`), en este orden:

1. Barra con el logo (sin enlace) y un atajo "Agendar" que lleva al formulario y enfoca el primer campo.
2. Portada: titular, promesas, cofundadores y credenciales sobre blanco; el formulario flota sobre el campo de color. En móvil el formulario va justo después del titular, en una banda a sangre. Bajo las credenciales (en móvil, justo bajo el formulario), el caso principal con su cifra y seis logos de clientes.
   Si hay un testimonio con video en `testimonials.ts`, va en una banda justo después de la portada.
3. Qué pasa después de enviar: los cuatro pasos de `steps` (en `landings.ts`), que se encienden en secuencia.
4. General: pilares + `FlowDemo`. Nicho: `NicheDemo`, `jobs` y `redLines` del sector. Servicio (`process`): los pasos de cómo se construye y capturas reales (`systemsGallery`).
5. Casos reales con cifra (el del sector primero, si existe), cliente del sector y franja de logos, en noche.
6. Cofundadores y equipo.
7. Cierre en cobalto y pie legal mínimo (privacidad, términos, preferencias de cookies).

Los contenedores decorativos usan `overflow-clip`, nunca `overflow-hidden`: un `hidden` sigue siendo desplazable por el navegador y, al enfocar un campo en móvil, corría la portada de lado.

Son sólo para tráfico de pauta: se accede por URL directa y **ningún enlace del sitio apunta a ellas**. No llevan la navegación ni el pie del sitio ni el pop-up de webinar; sí llevan el chat de IONIC (en las de nicho, con el registro del sector: `BaseLayout nicho`) y el flotante de WhatsApp, que en móvil se ocultan mientras se escribe en el formulario. Son `noindex` y no están en el sitemap. No las bloquees en `robots.txt`: Google Ads y Meta necesitan rastrearlas para aprobar los anuncios, y el `noindex` sólo se respeta si el rastreador puede leer la página.
Para la pauta, usa la URL con UTMs, p. ej. `https://ionoshub.net/speed-to-lead/clinicas?utm_source=meta&utm_campaign=clinicas-oct`.
Medición en Meta (Pixel + API de Conversiones, evento `Lead`): `docs/META-PIXEL.md`.

El contenido de cada variante es un objeto en `src/data/landings.ts` (titular, promesas, etiquetas del formulario, pregunta de calificación, fondo, caso principal, mensaje de WhatsApp, meta). Para añadir una: el objeto ahí, su archivo en `src/pages/speed-to-lead/` y su id en `LandingId`. Cada anuncio apunta a la variante que repite su mensaje: si el anuncio habla de software y la página de IA, la persona se va.

El formulario pide nombre, WhatsApp, negocio, la pregunta de calificación y el permiso; el **correo es opcional** (si lo deja, se valida). La casilla de permiso incluye confirmarle a Meta que se envió la solicitud (ver `docs/META-PIXEL.md`).

## Videos de fondo (instituciones y clínicas)

Se suben a `public/videos/landings/`:

- `<variante>.mp4` (H.264) y opcionalmente `<variante>.webm` — 8–15 s en bucle, sin audio, 1920×1080, idealmente < 4 MB.
- `<variante>.webp` — póster (primer fotograma).

Si los archivos no existen, la página usa el fondo motion en CSS (halos cobalto sobre noche). El video no se descarga con `prefers-reduced-motion`, `?nomotion=1` ni con ahorro de datos. Un velo noche→cobalto mantiene el contraste del texto: el video puede ser de colores, pero mejor si es azul/oscuro.

## Testimonios

`src/data/testimonials.ts` sólo lleva testimonios reales y autorizados (PRODUCT.md: nada inventado). Hoy tiene dos videos, con la cita tomada de sus subtítulos: Abg. Ismael A. (Ecu593 English, su sistema académico a medida) en `software` e `instituciones`, y Mary Chamorro (Aura Beauty Studio, su página web) en las demás. Cada landing toma el testimonio que la nombra en `landings` y, si ninguno, el que no tiene `landings`. Los de texto aparecen solos en la banda de casos de la landing general.

**Testimonio en video:** el archivo en `public/videos/testimonios/<cliente>.mp4` (H.264, idealmente < 8 MB; webm opcional) con su póster `<cliente>.webp` (primer fotograma), y en `testimonials.ts` una entrada con nombre, cargo, empresa, una cita corta de lo que dice y `video: { mp4, poster, vertical }` (`vertical: true` si se grabó con el celular parado). Sale en todas las variantes, en una banda justo después de la portada, con el botón al formulario. Sólo con autorización del cliente.

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

`calificacion` sólo acepta las opciones de su variante. `correo` es opcional (vacío o válido).

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
