/**
 * Genera `src/data/paises.ts` con los 245 países que reconoce libphonenumber: código ISO, nombre en
 * español, prefijo telefónico y cuántos dígitos admite el número nacional.
 *
 * La librería es dependencia de desarrollo: sus metadatos pesan cientos de KB y no tienen por qué
 * llegar al navegador. Lo que se publica es este archivo plano, de unos pocos KB.
 *
 * Uso: npm run paises
 */
import { getCountries, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { writeFileSync } from 'node:fs';

const nombres = new Intl.DisplayNames(['es'], { type: 'region' });

const paises = getCountries()
  .map((iso) => {
    const ejemplo = getExampleNumber(iso, examples);
    const nacional = ejemplo ? ejemplo.nationalNumber.length : 0;
    return {
      iso,
      nombre: nombres.of(iso) ?? iso,
      prefijo: `+${getCountryCallingCode(iso)}`,
      // Margen de un dígito arriba y abajo sobre el ejemplo oficial: hay países con varios formatos.
      min: nacional ? Math.max(4, nacional - 1) : 6,
      max: nacional ? nacional + 1 : 14,
      ejemplo: ejemplo ? ejemplo.nationalNumber : '',
    };
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

const cabecera = `/**
 * Países para el selector de teléfono. GENERADO: no editar a mano.
 * Se rehace con \`npm run paises\` (scripts/generar-paises.mjs) a partir de los metadatos de
 * libphonenumber, que es dependencia de desarrollo y nunca llega al navegador.
 *
 * \`min\` y \`max\` son dígitos del número nacional, con un dígito de margen sobre el ejemplo oficial
 * de cada país: validar de más rechazaría números legítimos.
 */

export interface Pais {
  /** ISO 3166-1 alfa-2, sirve además para la bandera */
  iso: string;
  nombre: string;
  prefijo: string;
  min: number;
  max: number;
  ejemplo: string;
}

`;

const cuerpo = `export const paises: Pais[] = ${JSON.stringify(paises, null, 2)
  .replace(/"(\w+)":/g, '$1:')
  .replace(/"/g, "'")};

/** Ecuador primero: es de donde viene la mayoría de quien se registra. */
export const PAIS_POR_DEFECTO = 'EC';

export const paisPorIso = (iso: string): Pais | undefined => paises.find((p) => p.iso === iso);

/**
 * Emoji de bandera a partir del ISO: dos símbolos indicadores regionales. No hay imágenes ni
 * peticiones; la tipografía Twemoji Country Flags las dibuja igual en Windows, que no trae banderas.
 */
export function bandera(iso: string): string {
  return String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)));
}

/** Quita tildes y pasa a minúsculas, para que "peru" encuentre "Perú". */
export const normalizar = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '');

/** Busca por nombre o por prefijo: "593", "+593", "ecua" y "EC" llegan al mismo sitio. */
export function buscarPaises(consulta: string): Pais[] {
  const q = normalizar(consulta.trim());
  if (!q) return paises;
  const soloDigitos = q.replace(/\\D/g, '');
  return paises.filter(
    (p) =>
      normalizar(p.nombre).includes(q) ||
      p.iso.toLowerCase() === q ||
      (soloDigitos.length > 0 && p.prefijo.replace('+', '').startsWith(soloDigitos)),
  );
}
`;

writeFileSync('src/data/paises.ts', cabecera + cuerpo, 'utf8');
console.log(`src/data/paises.ts generado con ${paises.length} países.`);
