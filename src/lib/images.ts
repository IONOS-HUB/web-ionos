/**
 * Variantes responsivas generadas por `npm run images` (scripts/responsive-images.mjs).
 * Sólo las carpetas listadas tienen versiones -480 y -960; para el resto no se emite srcset.
 */
const RESPONSIVE_DIRS = ['/imgs/mkt/', '/imgs/landings/', '/imgs/sistemas/', '/imgs/fotos/'];
const WIDTHS = [480, 960];

export function srcsetFor(src: string, width: number): string | undefined {
  if (!src.endsWith('.webp') || !RESPONSIVE_DIRS.some((d) => src.startsWith(d))) return undefined;
  const base = src.slice(0, -'.webp'.length);
  const variants = WIDTHS.filter((w) => w < width).map((w) => `${base}-${w}.webp ${w}w`);
  return [...variants, `${src} ${width}w`].join(', ');
}
