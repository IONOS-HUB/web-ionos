/**
 * Genera variantes responsivas (-480 y -960 de ancho) de las fotos y capturas que se muestran en
 * galerías, para que el móvil no descargue la imagen de 1600 px. Se ejecuta con `npm run images`
 * cada vez que se añaden fotos a estas carpetas. Las variantes se versionan junto a los originales.
 * También produce /imgs/logo.webp (320 px) para la barra de navegación y el pie.
 */
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['public/imgs/mkt', 'public/imgs/landings', 'public/imgs/sistemas', 'public/imgs/fotos'];
const WIDTHS = [480, 960];

let made = 0;
for (const dir of DIRS) {
  for (const file of readdirSync(dir)) {
    if (!/\.webp$/.test(file) || /-(480|960)\.webp$/.test(file)) continue;
    const src = join(dir, file);
    const { width } = await sharp(src).metadata();
    for (const w of WIDTHS) {
      if (!width || w >= width) continue;
      const out = src.replace(/\.webp$/, `-${w}.webp`);
      try {
        if (statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
      } catch {}
      await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(out);
      made++;
    }
  }
}
await sharp('public/imgs/logo.png').resize({ width: 320 }).webp({ quality: 90, alphaQuality: 90 }).toFile('public/imgs/logo.webp');
console.log(`Variantes generadas: ${made}; logo.webp listo.`);
