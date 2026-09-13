/**
 * Países para el selector de teléfono. GENERADO: no editar a mano.
 * Se rehace con `npm run paises` (scripts/generar-paises.mjs) a partir de los metadatos de
 * libphonenumber, que es dependencia de desarrollo y nunca llega al navegador.
 *
 * `min` y `max` son dígitos del número nacional, con un dígito de margen sobre el ejemplo oficial
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

export const paises: Pais[] = [
  {
    iso: 'AF',
    nombre: 'Afganistán',
    prefijo: '+93',
    min: 8,
    max: 10,
    ejemplo: '701234567'
  },
  {
    iso: 'AL',
    nombre: 'Albania',
    prefijo: '+355',
    min: 8,
    max: 10,
    ejemplo: '672123456'
  },
  {
    iso: 'DE',
    nombre: 'Alemania',
    prefijo: '+49',
    min: 10,
    max: 12,
    ejemplo: '15123456789'
  },
  {
    iso: 'AD',
    nombre: 'Andorra',
    prefijo: '+376',
    min: 5,
    max: 7,
    ejemplo: '312345'
  },
  {
    iso: 'AO',
    nombre: 'Angola',
    prefijo: '+244',
    min: 8,
    max: 10,
    ejemplo: '923123456'
  },
  {
    iso: 'AI',
    nombre: 'Anguila',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2642351234'
  },
  {
    iso: 'AG',
    nombre: 'Antigua y Barbuda',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2684641234'
  },
  {
    iso: 'SA',
    nombre: 'Arabia Saudí',
    prefijo: '+966',
    min: 8,
    max: 10,
    ejemplo: '512345678'
  },
  {
    iso: 'DZ',
    nombre: 'Argelia',
    prefijo: '+213',
    min: 8,
    max: 10,
    ejemplo: '551234567'
  },
  {
    iso: 'AR',
    nombre: 'Argentina',
    prefijo: '+54',
    min: 10,
    max: 12,
    ejemplo: '91123456789'
  },
  {
    iso: 'AM',
    nombre: 'Armenia',
    prefijo: '+374',
    min: 7,
    max: 9,
    ejemplo: '77123456'
  },
  {
    iso: 'AW',
    nombre: 'Aruba',
    prefijo: '+297',
    min: 6,
    max: 8,
    ejemplo: '5601234'
  },
  {
    iso: 'AU',
    nombre: 'Australia',
    prefijo: '+61',
    min: 8,
    max: 10,
    ejemplo: '412345678'
  },
  {
    iso: 'AT',
    nombre: 'Austria',
    prefijo: '+43',
    min: 8,
    max: 10,
    ejemplo: '664123456'
  },
  {
    iso: 'AZ',
    nombre: 'Azerbaiyán',
    prefijo: '+994',
    min: 8,
    max: 10,
    ejemplo: '401234567'
  },
  {
    iso: 'BS',
    nombre: 'Bahamas',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2423591234'
  },
  {
    iso: 'BD',
    nombre: 'Bangladés',
    prefijo: '+880',
    min: 9,
    max: 11,
    ejemplo: '1812345678'
  },
  {
    iso: 'BB',
    nombre: 'Barbados',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2462501234'
  },
  {
    iso: 'BH',
    nombre: 'Baréin',
    prefijo: '+973',
    min: 7,
    max: 9,
    ejemplo: '36001234'
  },
  {
    iso: 'BE',
    nombre: 'Bélgica',
    prefijo: '+32',
    min: 8,
    max: 10,
    ejemplo: '450001234'
  },
  {
    iso: 'BZ',
    nombre: 'Belice',
    prefijo: '+501',
    min: 6,
    max: 8,
    ejemplo: '6221234'
  },
  {
    iso: 'BJ',
    nombre: 'Benín',
    prefijo: '+229',
    min: 9,
    max: 11,
    ejemplo: '0195123456'
  },
  {
    iso: 'BM',
    nombre: 'Bermudas',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '4413701234'
  },
  {
    iso: 'BY',
    nombre: 'Bielorrusia',
    prefijo: '+375',
    min: 8,
    max: 10,
    ejemplo: '294911911'
  },
  {
    iso: 'BO',
    nombre: 'Bolivia',
    prefijo: '+591',
    min: 7,
    max: 9,
    ejemplo: '71234567'
  },
  {
    iso: 'BA',
    nombre: 'Bosnia y Herzegovina',
    prefijo: '+387',
    min: 7,
    max: 9,
    ejemplo: '61123456'
  },
  {
    iso: 'BW',
    nombre: 'Botsuana',
    prefijo: '+267',
    min: 7,
    max: 9,
    ejemplo: '71123456'
  },
  {
    iso: 'BR',
    nombre: 'Brasil',
    prefijo: '+55',
    min: 10,
    max: 12,
    ejemplo: '11961234567'
  },
  {
    iso: 'BN',
    nombre: 'Brunéi',
    prefijo: '+673',
    min: 6,
    max: 8,
    ejemplo: '7123456'
  },
  {
    iso: 'BG',
    nombre: 'Bulgaria',
    prefijo: '+359',
    min: 7,
    max: 9,
    ejemplo: '43012345'
  },
  {
    iso: 'BF',
    nombre: 'Burkina Faso',
    prefijo: '+226',
    min: 7,
    max: 9,
    ejemplo: '70123456'
  },
  {
    iso: 'BI',
    nombre: 'Burundi',
    prefijo: '+257',
    min: 7,
    max: 9,
    ejemplo: '79561234'
  },
  {
    iso: 'BT',
    nombre: 'Bután',
    prefijo: '+975',
    min: 7,
    max: 9,
    ejemplo: '17123456'
  },
  {
    iso: 'CV',
    nombre: 'Cabo Verde',
    prefijo: '+238',
    min: 6,
    max: 8,
    ejemplo: '9911234'
  },
  {
    iso: 'KH',
    nombre: 'Camboya',
    prefijo: '+855',
    min: 7,
    max: 9,
    ejemplo: '91234567'
  },
  {
    iso: 'CM',
    nombre: 'Camerún',
    prefijo: '+237',
    min: 8,
    max: 10,
    ejemplo: '671234567'
  },
  {
    iso: 'CA',
    nombre: 'Canadá',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '5062345678'
  },
  {
    iso: 'BQ',
    nombre: 'Caribe neerlandés',
    prefijo: '+599',
    min: 6,
    max: 8,
    ejemplo: '3181234'
  },
  {
    iso: 'QA',
    nombre: 'Catar',
    prefijo: '+974',
    min: 7,
    max: 9,
    ejemplo: '33123456'
  },
  {
    iso: 'TD',
    nombre: 'Chad',
    prefijo: '+235',
    min: 7,
    max: 9,
    ejemplo: '63012345'
  },
  {
    iso: 'CZ',
    nombre: 'Chequia',
    prefijo: '+420',
    min: 8,
    max: 10,
    ejemplo: '601123456'
  },
  {
    iso: 'CL',
    nombre: 'Chile',
    prefijo: '+56',
    min: 8,
    max: 10,
    ejemplo: '221234567'
  },
  {
    iso: 'CN',
    nombre: 'China',
    prefijo: '+86',
    min: 10,
    max: 12,
    ejemplo: '13123456789'
  },
  {
    iso: 'CY',
    nombre: 'Chipre',
    prefijo: '+357',
    min: 7,
    max: 9,
    ejemplo: '96123456'
  },
  {
    iso: 'VA',
    nombre: 'Ciudad del Vaticano',
    prefijo: '+39',
    min: 9,
    max: 11,
    ejemplo: '3123456789'
  },
  {
    iso: 'CO',
    nombre: 'Colombia',
    prefijo: '+57',
    min: 9,
    max: 11,
    ejemplo: '3211234567'
  },
  {
    iso: 'KM',
    nombre: 'Comoras',
    prefijo: '+269',
    min: 6,
    max: 8,
    ejemplo: '3212345'
  },
  {
    iso: 'CG',
    nombre: 'Congo',
    prefijo: '+242',
    min: 8,
    max: 10,
    ejemplo: '061234567'
  },
  {
    iso: 'KP',
    nombre: 'Corea del Norte',
    prefijo: '+850',
    min: 9,
    max: 11,
    ejemplo: '1921234567'
  },
  {
    iso: 'KR',
    nombre: 'Corea del Sur',
    prefijo: '+82',
    min: 9,
    max: 11,
    ejemplo: '1020000000'
  },
  {
    iso: 'CR',
    nombre: 'Costa Rica',
    prefijo: '+506',
    min: 7,
    max: 9,
    ejemplo: '83123456'
  },
  {
    iso: 'CI',
    nombre: 'Côte d’Ivoire',
    prefijo: '+225',
    min: 9,
    max: 11,
    ejemplo: '0123456789'
  },
  {
    iso: 'HR',
    nombre: 'Croacia',
    prefijo: '+385',
    min: 8,
    max: 10,
    ejemplo: '921234567'
  },
  {
    iso: 'CU',
    nombre: 'Cuba',
    prefijo: '+53',
    min: 7,
    max: 9,
    ejemplo: '51234567'
  },
  {
    iso: 'CW',
    nombre: 'Curazao',
    prefijo: '+599',
    min: 7,
    max: 9,
    ejemplo: '95181234'
  },
  {
    iso: 'DK',
    nombre: 'Dinamarca',
    prefijo: '+45',
    min: 7,
    max: 9,
    ejemplo: '34412345'
  },
  {
    iso: 'DM',
    nombre: 'Dominica',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '7672251234'
  },
  {
    iso: 'EC',
    nombre: 'Ecuador',
    prefijo: '+593',
    min: 8,
    max: 10,
    ejemplo: '991234567'
  },
  {
    iso: 'EG',
    nombre: 'Egipto',
    prefijo: '+20',
    min: 9,
    max: 11,
    ejemplo: '1001234567'
  },
  {
    iso: 'SV',
    nombre: 'El Salvador',
    prefijo: '+503',
    min: 7,
    max: 9,
    ejemplo: '70123456'
  },
  {
    iso: 'AE',
    nombre: 'Emiratos Árabes Unidos',
    prefijo: '+971',
    min: 8,
    max: 10,
    ejemplo: '501234567'
  },
  {
    iso: 'ER',
    nombre: 'Eritrea',
    prefijo: '+291',
    min: 6,
    max: 8,
    ejemplo: '7123456'
  },
  {
    iso: 'SK',
    nombre: 'Eslovaquia',
    prefijo: '+421',
    min: 8,
    max: 10,
    ejemplo: '912123456'
  },
  {
    iso: 'SI',
    nombre: 'Eslovenia',
    prefijo: '+386',
    min: 7,
    max: 9,
    ejemplo: '31234567'
  },
  {
    iso: 'ES',
    nombre: 'España',
    prefijo: '+34',
    min: 8,
    max: 10,
    ejemplo: '612345678'
  },
  {
    iso: 'US',
    nombre: 'Estados Unidos',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2015550123'
  },
  {
    iso: 'EE',
    nombre: 'Estonia',
    prefijo: '+372',
    min: 7,
    max: 9,
    ejemplo: '51234567'
  },
  {
    iso: 'SZ',
    nombre: 'Esuatini',
    prefijo: '+268',
    min: 7,
    max: 9,
    ejemplo: '76123456'
  },
  {
    iso: 'ET',
    nombre: 'Etiopía',
    prefijo: '+251',
    min: 8,
    max: 10,
    ejemplo: '911234567'
  },
  {
    iso: 'PH',
    nombre: 'Filipinas',
    prefijo: '+63',
    min: 9,
    max: 11,
    ejemplo: '9051234567'
  },
  {
    iso: 'FI',
    nombre: 'Finlandia',
    prefijo: '+358',
    min: 8,
    max: 10,
    ejemplo: '412345678'
  },
  {
    iso: 'FJ',
    nombre: 'Fiyi',
    prefijo: '+679',
    min: 6,
    max: 8,
    ejemplo: '7012345'
  },
  {
    iso: 'FR',
    nombre: 'Francia',
    prefijo: '+33',
    min: 8,
    max: 10,
    ejemplo: '612345678'
  },
  {
    iso: 'GA',
    nombre: 'Gabón',
    prefijo: '+241',
    min: 7,
    max: 9,
    ejemplo: '06031234'
  },
  {
    iso: 'GM',
    nombre: 'Gambia',
    prefijo: '+220',
    min: 6,
    max: 8,
    ejemplo: '3012345'
  },
  {
    iso: 'GE',
    nombre: 'Georgia',
    prefijo: '+995',
    min: 8,
    max: 10,
    ejemplo: '555123456'
  },
  {
    iso: 'GH',
    nombre: 'Ghana',
    prefijo: '+233',
    min: 8,
    max: 10,
    ejemplo: '231234567'
  },
  {
    iso: 'GI',
    nombre: 'Gibraltar',
    prefijo: '+350',
    min: 7,
    max: 9,
    ejemplo: '57123456'
  },
  {
    iso: 'GD',
    nombre: 'Granada',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '4734031234'
  },
  {
    iso: 'GR',
    nombre: 'Grecia',
    prefijo: '+30',
    min: 9,
    max: 11,
    ejemplo: '6912345678'
  },
  {
    iso: 'GL',
    nombre: 'Groenlandia',
    prefijo: '+299',
    min: 5,
    max: 7,
    ejemplo: '221234'
  },
  {
    iso: 'GP',
    nombre: 'Guadalupe',
    prefijo: '+590',
    min: 8,
    max: 10,
    ejemplo: '690001234'
  },
  {
    iso: 'GU',
    nombre: 'Guam',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '6713001234'
  },
  {
    iso: 'GT',
    nombre: 'Guatemala',
    prefijo: '+502',
    min: 7,
    max: 9,
    ejemplo: '51234567'
  },
  {
    iso: 'GF',
    nombre: 'Guayana Francesa',
    prefijo: '+594',
    min: 8,
    max: 10,
    ejemplo: '694201234'
  },
  {
    iso: 'GG',
    nombre: 'Guernesey',
    prefijo: '+44',
    min: 9,
    max: 11,
    ejemplo: '7781123456'
  },
  {
    iso: 'GN',
    nombre: 'Guinea',
    prefijo: '+224',
    min: 8,
    max: 10,
    ejemplo: '601123456'
  },
  {
    iso: 'GQ',
    nombre: 'Guinea Ecuatorial',
    prefijo: '+240',
    min: 8,
    max: 10,
    ejemplo: '222123456'
  },
  {
    iso: 'GW',
    nombre: 'Guinea-Bisáu',
    prefijo: '+245',
    min: 8,
    max: 10,
    ejemplo: '955012345'
  },
  {
    iso: 'GY',
    nombre: 'Guyana',
    prefijo: '+592',
    min: 6,
    max: 8,
    ejemplo: '6091234'
  },
  {
    iso: 'HT',
    nombre: 'Haití',
    prefijo: '+509',
    min: 7,
    max: 9,
    ejemplo: '34101234'
  },
  {
    iso: 'HN',
    nombre: 'Honduras',
    prefijo: '+504',
    min: 7,
    max: 9,
    ejemplo: '91234567'
  },
  {
    iso: 'HU',
    nombre: 'Hungría',
    prefijo: '+36',
    min: 8,
    max: 10,
    ejemplo: '201234567'
  },
  {
    iso: 'IN',
    nombre: 'India',
    prefijo: '+91',
    min: 9,
    max: 11,
    ejemplo: '8123456789'
  },
  {
    iso: 'ID',
    nombre: 'Indonesia',
    prefijo: '+62',
    min: 8,
    max: 10,
    ejemplo: '812345678'
  },
  {
    iso: 'IQ',
    nombre: 'Irak',
    prefijo: '+964',
    min: 9,
    max: 11,
    ejemplo: '7912345678'
  },
  {
    iso: 'IR',
    nombre: 'Irán',
    prefijo: '+98',
    min: 9,
    max: 11,
    ejemplo: '9123456789'
  },
  {
    iso: 'IE',
    nombre: 'Irlanda',
    prefijo: '+353',
    min: 8,
    max: 10,
    ejemplo: '850123456'
  },
  {
    iso: 'AC',
    nombre: 'Isla de la Ascensión',
    prefijo: '+247',
    min: 4,
    max: 6,
    ejemplo: '40123'
  },
  {
    iso: 'IM',
    nombre: 'Isla de Man',
    prefijo: '+44',
    min: 9,
    max: 11,
    ejemplo: '7924123456'
  },
  {
    iso: 'CX',
    nombre: 'Isla de Navidad',
    prefijo: '+61',
    min: 8,
    max: 10,
    ejemplo: '412345678'
  },
  {
    iso: 'NF',
    nombre: 'Isla Norfolk',
    prefijo: '+672',
    min: 5,
    max: 7,
    ejemplo: '381234'
  },
  {
    iso: 'IS',
    nombre: 'Islandia',
    prefijo: '+354',
    min: 6,
    max: 8,
    ejemplo: '6111234'
  },
  {
    iso: 'AX',
    nombre: 'Islas Aland',
    prefijo: '+358',
    min: 8,
    max: 10,
    ejemplo: '412345678'
  },
  {
    iso: 'KY',
    nombre: 'Islas Caimán',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '3453231234'
  },
  {
    iso: 'CC',
    nombre: 'Islas Cocos',
    prefijo: '+61',
    min: 8,
    max: 10,
    ejemplo: '412345678'
  },
  {
    iso: 'CK',
    nombre: 'Islas Cook',
    prefijo: '+682',
    min: 4,
    max: 6,
    ejemplo: '71234'
  },
  {
    iso: 'FO',
    nombre: 'Islas Feroe',
    prefijo: '+298',
    min: 5,
    max: 7,
    ejemplo: '211234'
  },
  {
    iso: 'FK',
    nombre: 'Islas Malvinas',
    prefijo: '+500',
    min: 4,
    max: 6,
    ejemplo: '51234'
  },
  {
    iso: 'MP',
    nombre: 'Islas Marianas del Norte',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '6702345678'
  },
  {
    iso: 'MH',
    nombre: 'Islas Marshall',
    prefijo: '+692',
    min: 6,
    max: 8,
    ejemplo: '2351234'
  },
  {
    iso: 'SB',
    nombre: 'Islas Salomón',
    prefijo: '+677',
    min: 6,
    max: 8,
    ejemplo: '7421234'
  },
  {
    iso: 'TC',
    nombre: 'Islas Turcas y Caicos',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '6492311234'
  },
  {
    iso: 'VG',
    nombre: 'Islas Vírgenes Británicas',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '2843001234'
  },
  {
    iso: 'VI',
    nombre: 'Islas Vírgenes de EE. UU.',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '3406421234'
  },
  {
    iso: 'IL',
    nombre: 'Israel',
    prefijo: '+972',
    min: 8,
    max: 10,
    ejemplo: '502345678'
  },
  {
    iso: 'IT',
    nombre: 'Italia',
    prefijo: '+39',
    min: 9,
    max: 11,
    ejemplo: '3123456789'
  },
  {
    iso: 'JM',
    nombre: 'Jamaica',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '8762101234'
  },
  {
    iso: 'JP',
    nombre: 'Japón',
    prefijo: '+81',
    min: 9,
    max: 11,
    ejemplo: '9012345678'
  },
  {
    iso: 'JE',
    nombre: 'Jersey',
    prefijo: '+44',
    min: 9,
    max: 11,
    ejemplo: '7797712345'
  },
  {
    iso: 'JO',
    nombre: 'Jordania',
    prefijo: '+962',
    min: 8,
    max: 10,
    ejemplo: '790123456'
  },
  {
    iso: 'KZ',
    nombre: 'Kazajistán',
    prefijo: '+7',
    min: 9,
    max: 11,
    ejemplo: '7710009998'
  },
  {
    iso: 'KE',
    nombre: 'Kenia',
    prefijo: '+254',
    min: 8,
    max: 10,
    ejemplo: '712123456'
  },
  {
    iso: 'KG',
    nombre: 'Kirguistán',
    prefijo: '+996',
    min: 8,
    max: 10,
    ejemplo: '700123456'
  },
  {
    iso: 'KI',
    nombre: 'Kiribati',
    prefijo: '+686',
    min: 7,
    max: 9,
    ejemplo: '72001234'
  },
  {
    iso: 'XK',
    nombre: 'Kosovo',
    prefijo: '+383',
    min: 7,
    max: 9,
    ejemplo: '43201234'
  },
  {
    iso: 'KW',
    nombre: 'Kuwait',
    prefijo: '+965',
    min: 7,
    max: 9,
    ejemplo: '50012345'
  },
  {
    iso: 'LA',
    nombre: 'Laos',
    prefijo: '+856',
    min: 9,
    max: 11,
    ejemplo: '2023123456'
  },
  {
    iso: 'LS',
    nombre: 'Lesoto',
    prefijo: '+266',
    min: 7,
    max: 9,
    ejemplo: '50123456'
  },
  {
    iso: 'LV',
    nombre: 'Letonia',
    prefijo: '+371',
    min: 7,
    max: 9,
    ejemplo: '21234567'
  },
  {
    iso: 'LB',
    nombre: 'Líbano',
    prefijo: '+961',
    min: 7,
    max: 9,
    ejemplo: '71123456'
  },
  {
    iso: 'LR',
    nombre: 'Liberia',
    prefijo: '+231',
    min: 8,
    max: 10,
    ejemplo: '770123456'
  },
  {
    iso: 'LY',
    nombre: 'Libia',
    prefijo: '+218',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'LI',
    nombre: 'Liechtenstein',
    prefijo: '+423',
    min: 8,
    max: 10,
    ejemplo: '660234567'
  },
  {
    iso: 'LT',
    nombre: 'Lituania',
    prefijo: '+370',
    min: 7,
    max: 9,
    ejemplo: '61234567'
  },
  {
    iso: 'LU',
    nombre: 'Luxemburgo',
    prefijo: '+352',
    min: 8,
    max: 10,
    ejemplo: '628123456'
  },
  {
    iso: 'MK',
    nombre: 'Macedonia del Norte',
    prefijo: '+389',
    min: 7,
    max: 9,
    ejemplo: '72345678'
  },
  {
    iso: 'MG',
    nombre: 'Madagascar',
    prefijo: '+261',
    min: 8,
    max: 10,
    ejemplo: '321234567'
  },
  {
    iso: 'MY',
    nombre: 'Malasia',
    prefijo: '+60',
    min: 8,
    max: 10,
    ejemplo: '123456789'
  },
  {
    iso: 'MW',
    nombre: 'Malaui',
    prefijo: '+265',
    min: 8,
    max: 10,
    ejemplo: '991234567'
  },
  {
    iso: 'MV',
    nombre: 'Maldivas',
    prefijo: '+960',
    min: 6,
    max: 8,
    ejemplo: '7712345'
  },
  {
    iso: 'ML',
    nombre: 'Mali',
    prefijo: '+223',
    min: 7,
    max: 9,
    ejemplo: '65012345'
  },
  {
    iso: 'MT',
    nombre: 'Malta',
    prefijo: '+356',
    min: 7,
    max: 9,
    ejemplo: '96961234'
  },
  {
    iso: 'MA',
    nombre: 'Marruecos',
    prefijo: '+212',
    min: 8,
    max: 10,
    ejemplo: '650123456'
  },
  {
    iso: 'MQ',
    nombre: 'Martinica',
    prefijo: '+596',
    min: 8,
    max: 10,
    ejemplo: '696201234'
  },
  {
    iso: 'MU',
    nombre: 'Mauricio',
    prefijo: '+230',
    min: 7,
    max: 9,
    ejemplo: '52512345'
  },
  {
    iso: 'MR',
    nombre: 'Mauritania',
    prefijo: '+222',
    min: 7,
    max: 9,
    ejemplo: '22123456'
  },
  {
    iso: 'YT',
    nombre: 'Mayotte',
    prefijo: '+262',
    min: 8,
    max: 10,
    ejemplo: '639012345'
  },
  {
    iso: 'MX',
    nombre: 'México',
    prefijo: '+52',
    min: 9,
    max: 11,
    ejemplo: '2221234567'
  },
  {
    iso: 'FM',
    nombre: 'Micronesia',
    prefijo: '+691',
    min: 6,
    max: 8,
    ejemplo: '3501234'
  },
  {
    iso: 'MD',
    nombre: 'Moldavia',
    prefijo: '+373',
    min: 7,
    max: 9,
    ejemplo: '62112345'
  },
  {
    iso: 'MC',
    nombre: 'Mónaco',
    prefijo: '+377',
    min: 8,
    max: 10,
    ejemplo: '612345678'
  },
  {
    iso: 'MN',
    nombre: 'Mongolia',
    prefijo: '+976',
    min: 7,
    max: 9,
    ejemplo: '88123456'
  },
  {
    iso: 'ME',
    nombre: 'Montenegro',
    prefijo: '+382',
    min: 7,
    max: 9,
    ejemplo: '60123456'
  },
  {
    iso: 'MS',
    nombre: 'Montserrat',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '6644923456'
  },
  {
    iso: 'MZ',
    nombre: 'Mozambique',
    prefijo: '+258',
    min: 8,
    max: 10,
    ejemplo: '821234567'
  },
  {
    iso: 'MM',
    nombre: 'Myanmar (Birmania)',
    prefijo: '+95',
    min: 7,
    max: 9,
    ejemplo: '92123456'
  },
  {
    iso: 'NA',
    nombre: 'Namibia',
    prefijo: '+264',
    min: 8,
    max: 10,
    ejemplo: '811234567'
  },
  {
    iso: 'NR',
    nombre: 'Nauru',
    prefijo: '+674',
    min: 6,
    max: 8,
    ejemplo: '5551234'
  },
  {
    iso: 'NP',
    nombre: 'Nepal',
    prefijo: '+977',
    min: 9,
    max: 11,
    ejemplo: '9841234567'
  },
  {
    iso: 'NI',
    nombre: 'Nicaragua',
    prefijo: '+505',
    min: 7,
    max: 9,
    ejemplo: '81234567'
  },
  {
    iso: 'NE',
    nombre: 'Níger',
    prefijo: '+227',
    min: 7,
    max: 9,
    ejemplo: '93123456'
  },
  {
    iso: 'NG',
    nombre: 'Nigeria',
    prefijo: '+234',
    min: 9,
    max: 11,
    ejemplo: '8021234567'
  },
  {
    iso: 'NU',
    nombre: 'Niue',
    prefijo: '+683',
    min: 6,
    max: 8,
    ejemplo: '8884012'
  },
  {
    iso: 'NO',
    nombre: 'Noruega',
    prefijo: '+47',
    min: 7,
    max: 9,
    ejemplo: '40612345'
  },
  {
    iso: 'NC',
    nombre: 'Nueva Caledonia',
    prefijo: '+687',
    min: 5,
    max: 7,
    ejemplo: '751234'
  },
  {
    iso: 'NZ',
    nombre: 'Nueva Zelanda',
    prefijo: '+64',
    min: 8,
    max: 10,
    ejemplo: '211234567'
  },
  {
    iso: 'OM',
    nombre: 'Omán',
    prefijo: '+968',
    min: 7,
    max: 9,
    ejemplo: '92123456'
  },
  {
    iso: 'NL',
    nombre: 'Países Bajos',
    prefijo: '+31',
    min: 8,
    max: 10,
    ejemplo: '612345678'
  },
  {
    iso: 'PK',
    nombre: 'Pakistán',
    prefijo: '+92',
    min: 9,
    max: 11,
    ejemplo: '3012345678'
  },
  {
    iso: 'PW',
    nombre: 'Palaos',
    prefijo: '+680',
    min: 6,
    max: 8,
    ejemplo: '6201234'
  },
  {
    iso: 'PA',
    nombre: 'Panamá',
    prefijo: '+507',
    min: 7,
    max: 9,
    ejemplo: '61234567'
  },
  {
    iso: 'PG',
    nombre: 'Papúa Nueva Guinea',
    prefijo: '+675',
    min: 7,
    max: 9,
    ejemplo: '70123456'
  },
  {
    iso: 'PY',
    nombre: 'Paraguay',
    prefijo: '+595',
    min: 8,
    max: 10,
    ejemplo: '961456789'
  },
  {
    iso: 'PE',
    nombre: 'Perú',
    prefijo: '+51',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'PF',
    nombre: 'Polinesia Francesa',
    prefijo: '+689',
    min: 7,
    max: 9,
    ejemplo: '87123456'
  },
  {
    iso: 'PL',
    nombre: 'Polonia',
    prefijo: '+48',
    min: 8,
    max: 10,
    ejemplo: '512345678'
  },
  {
    iso: 'PT',
    nombre: 'Portugal',
    prefijo: '+351',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'PR',
    nombre: 'Puerto Rico',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '7872345678'
  },
  {
    iso: 'HK',
    nombre: 'RAE de Hong Kong (China)',
    prefijo: '+852',
    min: 7,
    max: 9,
    ejemplo: '51234567'
  },
  {
    iso: 'MO',
    nombre: 'RAE de Macao (China)',
    prefijo: '+853',
    min: 7,
    max: 9,
    ejemplo: '66123456'
  },
  {
    iso: 'GB',
    nombre: 'Reino Unido',
    prefijo: '+44',
    min: 9,
    max: 11,
    ejemplo: '7400123456'
  },
  {
    iso: 'CF',
    nombre: 'República Centroafricana',
    prefijo: '+236',
    min: 7,
    max: 9,
    ejemplo: '70012345'
  },
  {
    iso: 'CD',
    nombre: 'República Democrática del Congo',
    prefijo: '+243',
    min: 8,
    max: 10,
    ejemplo: '991234567'
  },
  {
    iso: 'DO',
    nombre: 'República Dominicana',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '8092345678'
  },
  {
    iso: 'RE',
    nombre: 'Reunión',
    prefijo: '+262',
    min: 8,
    max: 10,
    ejemplo: '692123456'
  },
  {
    iso: 'RW',
    nombre: 'Ruanda',
    prefijo: '+250',
    min: 8,
    max: 10,
    ejemplo: '720123456'
  },
  {
    iso: 'RO',
    nombre: 'Rumanía',
    prefijo: '+40',
    min: 8,
    max: 10,
    ejemplo: '712034567'
  },
  {
    iso: 'RU',
    nombre: 'Rusia',
    prefijo: '+7',
    min: 9,
    max: 11,
    ejemplo: '9123456789'
  },
  {
    iso: 'EH',
    nombre: 'Sáhara Occidental',
    prefijo: '+212',
    min: 8,
    max: 10,
    ejemplo: '650123456'
  },
  {
    iso: 'WS',
    nombre: 'Samoa',
    prefijo: '+685',
    min: 6,
    max: 8,
    ejemplo: '7212345'
  },
  {
    iso: 'AS',
    nombre: 'Samoa Americana',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '6847331234'
  },
  {
    iso: 'BL',
    nombre: 'San Bartolomé',
    prefijo: '+590',
    min: 8,
    max: 10,
    ejemplo: '690001234'
  },
  {
    iso: 'KN',
    nombre: 'San Cristóbal y Nieves',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '8697652917'
  },
  {
    iso: 'SM',
    nombre: 'San Marino',
    prefijo: '+378',
    min: 7,
    max: 9,
    ejemplo: '66661212'
  },
  {
    iso: 'MF',
    nombre: 'San Martín',
    prefijo: '+590',
    min: 8,
    max: 10,
    ejemplo: '690001234'
  },
  {
    iso: 'PM',
    nombre: 'San Pedro y Miquelón',
    prefijo: '+508',
    min: 5,
    max: 7,
    ejemplo: '551234'
  },
  {
    iso: 'VC',
    nombre: 'San Vicente y las Granadinas',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '7844301234'
  },
  {
    iso: 'SH',
    nombre: 'Santa Elena',
    prefijo: '+290',
    min: 4,
    max: 6,
    ejemplo: '51234'
  },
  {
    iso: 'LC',
    nombre: 'Santa Lucía',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '7582845678'
  },
  {
    iso: 'ST',
    nombre: 'Santo Tomé y Príncipe',
    prefijo: '+239',
    min: 6,
    max: 8,
    ejemplo: '9812345'
  },
  {
    iso: 'SN',
    nombre: 'Senegal',
    prefijo: '+221',
    min: 8,
    max: 10,
    ejemplo: '701234567'
  },
  {
    iso: 'RS',
    nombre: 'Serbia',
    prefijo: '+381',
    min: 8,
    max: 10,
    ejemplo: '601234567'
  },
  {
    iso: 'SC',
    nombre: 'Seychelles',
    prefijo: '+248',
    min: 6,
    max: 8,
    ejemplo: '2510123'
  },
  {
    iso: 'SL',
    nombre: 'Sierra Leona',
    prefijo: '+232',
    min: 7,
    max: 9,
    ejemplo: '25123456'
  },
  {
    iso: 'SG',
    nombre: 'Singapur',
    prefijo: '+65',
    min: 7,
    max: 9,
    ejemplo: '81234567'
  },
  {
    iso: 'SX',
    nombre: 'Sint Maarten',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '7215205678'
  },
  {
    iso: 'SY',
    nombre: 'Siria',
    prefijo: '+963',
    min: 8,
    max: 10,
    ejemplo: '944567890'
  },
  {
    iso: 'SO',
    nombre: 'Somalia',
    prefijo: '+252',
    min: 7,
    max: 9,
    ejemplo: '71123456'
  },
  {
    iso: 'LK',
    nombre: 'Sri Lanka',
    prefijo: '+94',
    min: 8,
    max: 10,
    ejemplo: '712345678'
  },
  {
    iso: 'ZA',
    nombre: 'Sudáfrica',
    prefijo: '+27',
    min: 8,
    max: 10,
    ejemplo: '711234567'
  },
  {
    iso: 'SD',
    nombre: 'Sudán',
    prefijo: '+249',
    min: 8,
    max: 10,
    ejemplo: '911231234'
  },
  {
    iso: 'SS',
    nombre: 'Sudán del Sur',
    prefijo: '+211',
    min: 8,
    max: 10,
    ejemplo: '977123456'
  },
  {
    iso: 'SE',
    nombre: 'Suecia',
    prefijo: '+46',
    min: 8,
    max: 10,
    ejemplo: '701234567'
  },
  {
    iso: 'CH',
    nombre: 'Suiza',
    prefijo: '+41',
    min: 8,
    max: 10,
    ejemplo: '781234567'
  },
  {
    iso: 'SR',
    nombre: 'Surinam',
    prefijo: '+597',
    min: 6,
    max: 8,
    ejemplo: '7412345'
  },
  {
    iso: 'SJ',
    nombre: 'Svalbard y Jan Mayen',
    prefijo: '+47',
    min: 7,
    max: 9,
    ejemplo: '41234567'
  },
  {
    iso: 'TH',
    nombre: 'Tailandia',
    prefijo: '+66',
    min: 8,
    max: 10,
    ejemplo: '812345678'
  },
  {
    iso: 'TW',
    nombre: 'Taiwán',
    prefijo: '+886',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'TZ',
    nombre: 'Tanzania',
    prefijo: '+255',
    min: 8,
    max: 10,
    ejemplo: '621234567'
  },
  {
    iso: 'TJ',
    nombre: 'Tayikistán',
    prefijo: '+992',
    min: 8,
    max: 10,
    ejemplo: '917123456'
  },
  {
    iso: 'IO',
    nombre: 'Territorio Británico del Océano Índico',
    prefijo: '+246',
    min: 6,
    max: 8,
    ejemplo: '3801234'
  },
  {
    iso: 'PS',
    nombre: 'Territorios Palestinos',
    prefijo: '+970',
    min: 8,
    max: 10,
    ejemplo: '599123456'
  },
  {
    iso: 'TL',
    nombre: 'Timor-Leste',
    prefijo: '+670',
    min: 7,
    max: 9,
    ejemplo: '77212345'
  },
  {
    iso: 'TG',
    nombre: 'Togo',
    prefijo: '+228',
    min: 7,
    max: 9,
    ejemplo: '90112345'
  },
  {
    iso: 'TK',
    nombre: 'Tokelau',
    prefijo: '+690',
    min: 4,
    max: 5,
    ejemplo: '7290'
  },
  {
    iso: 'TO',
    nombre: 'Tonga',
    prefijo: '+676',
    min: 6,
    max: 8,
    ejemplo: '7715123'
  },
  {
    iso: 'TT',
    nombre: 'Trinidad y Tobago',
    prefijo: '+1',
    min: 9,
    max: 11,
    ejemplo: '8682911234'
  },
  {
    iso: 'TA',
    nombre: 'Tristán de Acuña',
    prefijo: '+290',
    min: 4,
    max: 5,
    ejemplo: '8999'
  },
  {
    iso: 'TN',
    nombre: 'Túnez',
    prefijo: '+216',
    min: 7,
    max: 9,
    ejemplo: '20123456'
  },
  {
    iso: 'TM',
    nombre: 'Turkmenistán',
    prefijo: '+993',
    min: 7,
    max: 9,
    ejemplo: '66123456'
  },
  {
    iso: 'TR',
    nombre: 'Turquía',
    prefijo: '+90',
    min: 9,
    max: 11,
    ejemplo: '5012345678'
  },
  {
    iso: 'TV',
    nombre: 'Tuvalu',
    prefijo: '+688',
    min: 5,
    max: 7,
    ejemplo: '901234'
  },
  {
    iso: 'UA',
    nombre: 'Ucrania',
    prefijo: '+380',
    min: 8,
    max: 10,
    ejemplo: '501234567'
  },
  {
    iso: 'UG',
    nombre: 'Uganda',
    prefijo: '+256',
    min: 8,
    max: 10,
    ejemplo: '712345678'
  },
  {
    iso: 'UY',
    nombre: 'Uruguay',
    prefijo: '+598',
    min: 7,
    max: 9,
    ejemplo: '94231234'
  },
  {
    iso: 'UZ',
    nombre: 'Uzbekistán',
    prefijo: '+998',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'VU',
    nombre: 'Vanuatu',
    prefijo: '+678',
    min: 6,
    max: 8,
    ejemplo: '5912345'
  },
  {
    iso: 'VE',
    nombre: 'Venezuela',
    prefijo: '+58',
    min: 9,
    max: 11,
    ejemplo: '4121234567'
  },
  {
    iso: 'VN',
    nombre: 'Vietnam',
    prefijo: '+84',
    min: 8,
    max: 10,
    ejemplo: '912345678'
  },
  {
    iso: 'WF',
    nombre: 'Wallis y Futuna',
    prefijo: '+681',
    min: 5,
    max: 7,
    ejemplo: '821234'
  },
  {
    iso: 'YE',
    nombre: 'Yemen',
    prefijo: '+967',
    min: 8,
    max: 10,
    ejemplo: '712345678'
  },
  {
    iso: 'DJ',
    nombre: 'Yibuti',
    prefijo: '+253',
    min: 7,
    max: 9,
    ejemplo: '77831001'
  },
  {
    iso: 'ZM',
    nombre: 'Zambia',
    prefijo: '+260',
    min: 8,
    max: 10,
    ejemplo: '955123456'
  },
  {
    iso: 'ZW',
    nombre: 'Zimbabue',
    prefijo: '+263',
    min: 8,
    max: 10,
    ejemplo: '712345678'
  }
];

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
    .replace(/[\u0300-\u036f]/g, '');

/** Busca por nombre o por prefijo: "593", "+593", "ecua" y "EC" llegan al mismo sitio. */
export function buscarPaises(consulta: string): Pais[] {
  const q = normalizar(consulta.trim());
  if (!q) return paises;
  const soloDigitos = q.replace(/\D/g, '');
  return paises.filter(
    (p) =>
      normalizar(p.nombre).includes(q) ||
      p.iso.toLowerCase() === q ||
      (soloDigitos.length > 0 && p.prefijo.replace('+', '').startsWith(soloDigitos)),
  );
}
