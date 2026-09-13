/**
 * Cartel provisional para el pop-up de un webinar: campo de cobalto con la malla de nodos de la marca
 * y el logo centrado. Sin texto, porque la tipografía de marca no está disponible al rasterizar y
 * escribir con una fuente del sistema rompería el sistema visual.
 *
 * Se sustituye por el flyer real dejando la imagen en public/imgs/webinars/ y apuntando `promoImage`
 * en src/data/webinars.ts. Uso: node scripts/webinar-placeholder.mjs <slug>
 */
import sharp from 'sharp';

const slug = process.argv[2] ?? 'webinar';
const N = 1080;

const nodos = [
  [140, 250], [420, 140], [820, 230], [300, 520], [700, 520],
  [180, 830], [560, 880], [900, 760],
];
const enlaces = [[0,1],[1,2],[0,3],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6],[4,7],[6,7],[2,7]];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}">
  <defs>
    <linearGradient id="campo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3f86e6"/>
      <stop offset="0.45" stop-color="#0e5fcb"/>
      <stop offset="1" stop-color="#0a47a0"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.85" cy="0.1" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${N}" height="${N}" fill="url(#campo)"/>
  <rect width="${N}" height="${N}" fill="url(#halo)"/>
  <g stroke="#ffffff" stroke-opacity="0.22" stroke-width="2">
    ${enlaces.map(([a, b]) => `<line x1="${nodos[a][0]}" y1="${nodos[a][1]}" x2="${nodos[b][0]}" y2="${nodos[b][1]}"/>`).join('')}
  </g>
  <g fill="#ffffff">
    ${nodos.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 11 : 7}" fill-opacity="${i % 2 ? 0.75 : 0.95}"/>`).join('')}
  </g>
</svg>`;

// El logo de marca es cobalto y se perdería sobre el campo azul: se usa su silueta en blanco.
const base = await sharp('public/imgs/logo.png').resize({ width: 560 }).ensureAlpha().toBuffer();
const { width: wLogo, height: hLogo } = await sharp(base).metadata();
const alfa = await sharp(base).extractChannel('alpha').toBuffer();
const blanco = await sharp({ create: { width: wLogo, height: hLogo, channels: 3, background: '#ffffff' } }).png().toBuffer();
const logo = await sharp(blanco).joinChannel(alfa).png().toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: Math.round((N - (hLogo ?? 0)) / 2), left: Math.round((N - 560) / 2) }])
  .webp({ quality: 88 })
  .toFile(`public/imgs/webinars/${slug}.webp`);

console.log(`public/imgs/webinars/${slug}.webp listo (1080x1080)`);
