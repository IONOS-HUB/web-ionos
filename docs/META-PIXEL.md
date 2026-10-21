# Meta Pixel y API de Conversiones en las landings "speed to lead"

## Qué mide el sitio

Sólo en `/speed-to-lead`, `/speed-to-lead/instituciones` y `/speed-to-lead/clinicas` (`BaseLayout landing`), y sólo si la persona acepta **Publicidad · Meta Pixel** en el aviso de cookies ("Aceptar" la incluye):

| Evento | Cuándo | Desde |
| --- | --- | --- |
| `PageView` | Al aceptar las cookies o al cargar la página si ya las había aceptado | Navegador |
| `Lead` | Formulario entregado al CRM (no se repite si el lead ya existía) | Navegador **y** servidor, con el mismo `event_id` |
| `Contact` | Clic al botón de WhatsApp | Navegador |
| `AbrirAgenda` (personalizado) | Clic en "Elegir horario ahora" tras enviar | Navegador |

`Lead` lleva `content_name: "speed-to-lead · <variante>"` y `content_category` con la respuesta de la pregunta de calificación.

El `Lead` del servidor (`src/lib/meta.ts`, API de Conversiones) llega aunque un bloqueador corte el Pixel, y Meta descarta el duplicado gracias al `event_id`. Lleva correo, teléfono (E.164 sin `+`) y nombre en SHA-256, IP, navegador y las cookies `_fbp`/`_fbc` (o `fbc` armado desde el `fbclid` de la URL). Sin consentimiento de publicidad no se envía nada a Meta, ni desde el navegador ni desde el servidor: espera menos `Lead` en Meta que leads en GHL.

El resto del sitio no carga el Pixel. Para llevarlo a todas las páginas, quita la condición `landing ?` de `metaPixelId` en `BaseLayout.astro`.

## Variables (Vercel → Settings → Environment Variables)

| Variable | Ámbito | Qué es |
| --- | --- | --- |
| `PUBLIC_META_PIXEL_ID` | Production y Preview | ID del conjunto de datos (Pixel). Se incrusta en el HTML: **redeploya** al cambiarlo. |
| `META_CAPI_TOKEN` | Production | Token de la API de Conversiones. Sólo servidor. |
| `META_TEST_EVENT_CODE` | Production, sólo mientras pruebas | Código de "Probar eventos". Quítalo al terminar. |
| `PUBLIC_META_DOMAIN_VERIFICATION` | Production | Valor `content` de la metaetiqueta de verificación del dominio. |

## Pasos en Meta

### 1. Portfolio comercial

En [business.facebook.com](https://business.facebook.com) necesitas un portfolio comercial (antes "Business Manager") con la página de Facebook de IonosHub, la cuenta de Instagram y la cuenta publicitaria. Si ya pautas, ya lo tienes.

### 2. Crear el conjunto de datos (Pixel)

1. **Administrador de eventos** ([business.facebook.com/events_manager](https://business.facebook.com/events_manager)) → **Conectar orígenes de datos** (el `+` verde) → **Web** → **Conectar**.
2. Nombre: `IonosHub · Web`. URL: `https://ionoshub.net`.
3. Cuando pregunte cómo conectar, elige **Meta Pixel y API de Conversiones** → **Configurar manualmente**. No pegues ningún código: el sitio ya lo trae.
4. Copia el **ID del conjunto de datos** (15–16 dígitos, en **Configuración**) → `PUBLIC_META_PIXEL_ID`.
5. **Configuración del negocio → Orígenes de datos → Conjuntos de datos** → tu Pixel → **Asignar activos**: conecta la cuenta publicitaria.

### 3. Token de la API de Conversiones

1. Administrador de eventos → tu conjunto de datos → **Configuración** → sección **API de Conversiones** → **Generar token de acceso** (o "Configurar manualmente" → "Generar").
2. Copia el token → `META_CAPI_TOKEN` (sólo se muestra una vez; si lo pierdes, genera otro).

### 4. Verificar el dominio

1. **Configuración del negocio → Seguridad de la marca → Dominios → Agregar** → `ionoshub.net`.
2. Método **Metaetiqueta**: copia sólo el valor de `content="…"` → `PUBLIC_META_DOMAIN_VERIFICATION` → redeploya → **Verificar**.
   (Alternativa: registro TXT en el DNS del dominio, sin tocar el sitio.)
3. En **Dominios → ionoshub.net → Activos conectados**, añade el conjunto de datos.

### 5. Desplegar

Configura las variables en Vercel y haz **Redeploy** del último despliegue de producción (`PUBLIC_*` se fija en la compilación; sin redeploy no aparece el Pixel).

### 6. Probar

1. Administrador de eventos → tu conjunto de datos → **Probar eventos** → copia el código (`TEST12345`) → `META_TEST_EVENT_CODE` → redeploya.
2. En el mismo panel, pega `https://ionoshub.net/speed-to-lead?utm_source=meta&utm_campaign=prueba` y **Abrir sitio web**. Acepta las cookies.
3. Debe aparecer `PageView` (navegador). Envía el formulario con datos tuyos reales: debe aparecer `Lead` dos veces, **Navegador** y **Servidor**, con la marca **Deduplicado** en uno de ellos.
4. Repite en `/speed-to-lead/instituciones` y `/speed-to-lead/clinicas`. Comprueba que el lead llegó a GHL (y bórralo allí).
5. Quita `META_TEST_EVENT_CODE` y redeploya. Mientras exista, los `Lead` del servidor quedan como prueba y no cuentan para las campañas.

Extra: la extensión de Chrome **Meta Pixel Helper** muestra el Pixel y los eventos del navegador en la página.

Si el `Lead` del servidor no aparece, revisa los logs de la función en Vercel: `[meta] CAPI respondió 400 …` trae el motivo (token caducado, ID equivocado).

### 7. Calidad

A las 24–48 h, en **Información general** del conjunto de datos: **Calidad de coincidencia de eventos** de `Lead` (con correo + teléfono + fbc suele quedar en "Buena" o mejor) y **Cobertura de eventos** del servidor. Si Meta aún muestra "Medición de eventos agregados", deja `Lead` como evento de mayor prioridad.

### 8. Conversiones personalizadas por variante (opcional, recomendado)

Para optimizar cada campaña de nicho por su propio lead: Administrador de eventos → **Conversiones personalizadas → Crear**:

| Nombre | Evento | Regla |
| --- | --- | --- |
| `Lead · Clínicas` | `Lead` | URL contiene `/speed-to-lead/clinicas` |
| `Lead · Instituciones` | `Lead` | URL contiene `/speed-to-lead/instituciones` |
| `Lead · General` | `Lead` | `content_name` es igual a `speed-to-lead · general` |

### 9. Campaña

1. **Administrador de anuncios → Crear** → objetivo **Clientes potenciales**.
2. Conjunto de anuncios → **Ubicación de la conversión: Sitio web** → conjunto de datos `IonosHub · Web` → evento **Cliente potencial** (`Lead`) o la conversión personalizada de la variante.
3. Anuncio → **URL del sitio web**: la landing de la variante. En **Parámetros de URL**:
   `utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}`
   Meta añade `fbclid` solo. Todo llega a GHL en `utm_*` y `fbclid`.
4. Públicos: excluye a quien ya hizo `Lead` (público personalizado → Sitio web → evento `Lead`, 180 días) y, cuando haya volumen (~100 leads), crea un público similar a partir de él.
