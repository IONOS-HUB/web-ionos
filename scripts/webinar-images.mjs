/**
 * Prepara los carteles de webinar que llegan como PNG o JPG desde diseño.
 *
 * Lee de `../originales/webinars` (fuera del repo, igual que el resto de originales del proyecto) y
 * escribe en `public/imgs/webinars`. Por cada cartel produce:
 *  - `<nombre>.webp`     el cartel para la tarjeta y la ventana modal (mismo tamaño, WebP).
 *  - `<nombre>-og.webp`  1200x630 para las tarjetas de redes, con el cartel entero sobre campo cobalto.
 *
 * Por qué existe: los carteles originales pesaban ~785 KB cada uno y se descargaban en TODAS las
 * páginas del sitio, porque el aviso del webinar vive en BaseLayout. Ningún cartel debe publicarse sin
 * pasar por aquí, y el original no entra a `public/` (se deploya entero aunque nadie lo pida).
 *
 * El recorte cuadrado no sirve para redes: los carteles vienen en 1080x1350 y el texto ocupa el alto
 * completo, así que se ajusta por `contain` y el sobrante se rellena con el cobalto de marca.
 *
 * Uso: `npm run webinar:imgs`
 */
import sharp from 'sharp';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ORIGINALES = '../originales/webinars';
const DESTINO = 'public/imgs/webinars';
/** `cobalt` de DESIGN.md (#0e5fcb): el relleno del OG es campo de marca, no una barra gris. */
const COBALT = { r: 14, g: 95, b: 203 };
const OG = { width: 1200, height: 630 };

if (!existsSync(ORIGINALES)) {
  console.log(`No existe ${ORIGINALES}. Deja ahí los carteles originales (PNG o JPG) y vuelve a ejecutar.`);
  process.exit(0);
}

const kb = (p) => Math.round(statSync(p).size / 1024);
let hechos = 0;

for (const file of readdirSync(ORIGINALES)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const src = join(ORIGINALES, file);
  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const cartel = join(DESTINO, `${base}.webp`);
  const og = join(DESTINO, `${base}-og.webp`);

  // Se rehace sólo si el original es más nuevo que lo generado.
  const fresco = (out) => {
    try {
      return statSync(out).mtimeMs >= statSync(src).mtimeMs;
    } catch {
      return false;
    }
  };
  if (fresco(cartel) && fresco(og)) continue;

  const { width, height } = await sharp(src).metadata();
  await sharp(src).webp({ quality: 82 }).toFile(cartel);
  await sharp(src).resize({ ...OG, fit: 'contain', background: COBALT }).webp({ quality: 82 }).toFile(og);

  console.log(`${file} ${kb(src)} KB (${width}x${height}) → ${base}.webp ${kb(cartel)} KB · ${base}-og.webp ${kb(og)} KB`);
  hechos++;
}

console.log(hechos ? `${hechos} cartel(es) preparados.` : 'Nada que hacer: todos los carteles están al día.');
