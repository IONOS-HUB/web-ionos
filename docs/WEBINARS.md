# Webinars

Sección de formación en vivo del sitio. Vive en tres rutas y un archivo de datos:

| Ruta | Archivo | Qué es |
| --- | --- | --- |
| `/webinars` | `src/pages/webinars/index.astro` | Índice: el próximo en grande, rejilla con todas las ediciones y filtros |
| `/webinars/<slug>` | `src/pages/webinars/[slug].astro` | Página de una edición, con registro |
| — | `src/data/webinars.ts` | **La única fuente**: cada edición es un objeto de este array |

Publicar un webinar nuevo no toca ninguna página: se añade un objeto a `webinars` y se despliega.
Para hacerlo con ayuda, usa la skill `/webinar` (ver el final de este documento).

## Cómo funciona

- **El estado se deduce de la fecha.** `webinarStatus()` compara `startsAt` con el momento actual: no
  existe un campo "ya pasó" que se quede desactualizado. Al pasar la fecha, la edición se mueve sola
  al histórico, el formulario desaparece y el pop-up deja de promocionarla.
- **El índice filtra por estado y por tema**, con JavaScript propio sobre atributos de datos. Los
  chips de tema sólo aparecen cuando hay más de uno. Si un filtro deja la rejilla vacía, se muestra
  un estado vacío en vez de un hueco.
- **La cuenta atrás** se pinta ya resuelta desde el servidor y el script sólo la mantiene al día, así
  que no hay salto mientras carga el JavaScript.
- **El pop-up** (`src/components/WebinarPromo.astro`) lee el próximo webinar y se monta en
  `BaseLayout`. Si no hay ninguna edición futura, no emite nada.

## El cartel del pop-up

El aviso del próximo webinar sale con imagen si la edición tiene `promoImage`, y en versión de sólo
texto si no. **Todo el aviso es un enlace al evento**; lo único que no navega es el botón de cerrar.

| Medida | Valor |
| --- | --- |
| Tamaño recomendado | **1080 × 1080 px** (cuadrado) |
| Alternativa vertical | 1080 × 1350 px (4:5) |
| Formato | WebP, o PNG/JPG, por debajo de 300 KB |
| Dónde se ve | 360 px de ancho en escritorio, unos 340 en móvil |
| Zona segura | Deja el texto importante dentro del 80 % central: en pantallas bajas la imagen se recorta por arriba y por abajo |

Debajo del cartel queda siempre una franja cobalto con la fecha, la hora y "Reservar mi lugar", así
que la imagen no necesita repetir esos datos y puede ser puro diseño.

Mientras no exista el flyer real hay un cartel provisional de marca generado con
`npm run webinar:cartel <slug>` (campo de cobalto, malla de nodos y el logo en blanco). Para poner
el definitivo: deja el archivo en `public/imgs/webinars/` y ajusta `promoImage` en
`src/data/webinars.ts` con su `src`, `alt`, `width` y `height` reales.

## El registro

El formulario es una isla de React (`src/components/islands/WebinarForm.tsx`) que se hidrata sólo
cuando entra en pantalla. Pide nombre, correo, teléfono con código de país, empresa, área, cargo y
consentimiento explícito.

Envía a `src/pages/api/webinar.ts`, que valida en el servidor y entrega al **mismo webhook de n8n**
que el formulario de contacto y el chat (`LEAD_WEBHOOK_URL`), con `canal: 'webinar'`. El payload
añade a los campos de siempre:

```json
{
  "canal": "webinar",
  "webinar_slug": "ia-en-tu-trabajo",
  "webinar_titulo": "Aprende a usar IA en tu trabajo",
  "webinar_fecha": "2026-09-24T19:00:00-05:00",
  "nombre_persona": "Ana Torres",
  "empresa": "Ferretería El Tornillo",
  "area": "Operaciones",
  "cargo": "Administradora"
}
```

Al terminar, la persona pasa a la comunidad de WhatsApp del evento (`whatsappCommunity`), que es
donde se reparte el enlace de acceso.

**Antiabuso:** el mismo freno que el resto del sitio (`src/lib/chat/ratelimit.ts`), pero con ámbito
propio por edición (`webinar:<slug>`). Así, quien se registra a un webinar no gasta el cupo de quien
además pide un diagnóstico, y cada edición lleva su cuenta. Un mismo correo o teléfono entra una vez
por edición y por día; el segundo intento responde bien y lleva a la comunidad, pero no duplica en el
CRM. También hay honeypot y validación completa en el servidor.

## Publicar una edición nueva

1. Copia el último objeto de `src/data/webinars.ts` y cámbialo. Campos obligatorios: `slug`,
   `edition`, `title`, `tagline`, `summary`, `startsAt` (ISO con `-05:00`), `timezone`, `hosts`,
   `format`, `price`, `topics`, `audience`, `takeaways`, `sessions`, `registrationOpen`, `metaTitle`
   y `metaDescription`.
2. Añade `whatsappCommunity` con el enlace del grupo del evento.
3. `npm run build` y despliega. El índice, el pop-up, el sitemap y los datos estructurados se
   actualizan solos.

Reglas que no se rompen:

- **Nada inventado.** Si no hay persona ponente confirmada, se deja `speaker` fuera; el diseño
  funciona sin él. Igual con cifras de asistentes o resultados.
- **Fechas en ISO con zona horaria.** `2026-09-24T19:00:00-05:00`, nunca una fecha suelta: de ahí
  salen la cuenta atrás, el estado y el `Event` de datos estructurados.
- **Un solo registro por edición**, aunque tenga varias sesiones.

## Cuando la edición ya pasó

No hay que hacer nada para que se archive. Opcionalmente, añade `recap` con un resumen de lo que se
trató y, si existe, `videoUrl` con la grabación: la página lo muestra en una sección propia y el
formulario se sustituye por una invitación a la siguiente.

## SEO y datos estructurados

- Cada página emite `Event` de schema.org (modalidad en línea, gratuito, organizadores) y el índice
  un `ItemList`. Eso es lo que permite que el webinar aparezca en resultados de eventos y que un
  asistente de IA lo cite con su fecha.
- El sitemap los recoge automáticamente.
- Si el webinar es relevante para el negocio, menciónalo también en `public/llms.txt`.

## La skill `/webinar`

Para crear la siguiente edición sin escribir el objeto a mano, invoca `/webinar` y pasa los datos que
tengas. La skill está en `.claude/skills/webinar/SKILL.md` (a nivel de la carpeta `WEB`, junto a
`impeccable`) y hace tres cosas: pregunta sólo lo que falte, añade el objeto a `src/data/webinars.ts`
respetando el formato, y verifica que el índice, la página y el pop-up quedan bien.
