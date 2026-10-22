/**
 * Cuestionario de página web para clientes (`/cuestionario-web`). Es la versión en línea del documento
 * «Cuestionario para tu página web»: un objeto por sección y por pregunta, y de aquí salen el formulario
 * por pasos (`islands/CuestionarioWeb.tsx`), la validación del servidor y el Markdown que recibe n8n
 * (`lib/cuestionario.ts`). Cambiar una pregunta = cambiarla aquí; el PRD se ajusta solo.
 *
 * Los valores de las opciones son el texto que se ve: así llegan legibles al Markdown y a Claude.
 * `importante` es la ★ del documento: se recomienda, no se exige. Sólo «Tus datos» tiene obligatorios.
 */

export interface Opcion {
  valor: string;
  /** Texto de apoyo bajo la opción */
  nota?: string;
  /** Si se elige, pide un dato más (el texto es el placeholder del campo) */
  detalle?: string;
}

export interface Campo {
  id: string;
  titulo: string;
  tipo?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  autocomplete?: string;
}

interface Base {
  id: string;
  /** Número de la pregunta en el documento */
  n: number;
  titulo: string;
  ayuda?: string;
  importante?: boolean;
}

export type Pregunta =
  | (Base & {
      tipo: 'texto';
      placeholder?: string;
      /** Botones que copian al campo lo que la persona ya escribió en otra pregunta (id de una tabla) */
      sugerirDe?: string;
    })
  | (Base & { tipo: 'unica'; opciones: Opcion[] })
  | (Base & {
      tipo: 'varias';
      opciones: Opcion[];
      max?: number;
      /** Opción que excluye a las demás («Ninguna por ahora») */
      ninguna?: string;
    })
  | (Base & {
      tipo: 'tabla';
      columnas: { id: string; titulo: string; placeholder?: string }[];
      filas: number;
      maxFilas: number;
      agregar: string;
      /** Nombre de cada fila en móvil: «Producto 1», «Página 2»… */
      fila: string;
    })
  | (Base & {
      tipo: 'campos';
      campos: Campo[];
      /** Ofrece copiar estos datos desde «Tus datos»: id del campo propio → id del dato */
      copiarDeDatos?: Record<string, keyof DatosCliente>;
    });

export interface Seccion {
  id: string;
  numero: string;
  titulo: string;
  porque: string;
  preguntas: Pregunta[];
}

export interface DatosCliente {
  negocio: string;
  nombre: string;
  cargo: string;
  whatsapp: string;
  correo: string;
  ciudad: string;
}

/** Respuesta guardada por tipo de pregunta. */
export type RespuestaUnica = { valor: string; detalle?: string };
export type RespuestaVarias = { valores: string[]; detalles?: Record<string, string> };
export type Respuesta = string | RespuestaUnica | RespuestaVarias | Record<string, string>[] | Record<string, string>;
export type Respuestas = Record<string, Respuesta>;

export const INTRO = {
  titulo: 'Cuestionario para tu página web',
  lead: 'Cuéntanos tu idea con tus propias palabras. Nosotros nos encargamos de la parte técnica.',
  queEs:
    'Antes de diseñar tu página web necesitamos conocer bien tu negocio, a tus clientes y lo que esperas lograr. Estas preguntas nos ayudan a armar un plan claro para que tu página quede como la imaginas y, sobre todo, para que te traiga clientes.',
  comoLlenarlo: [
    'No hay respuestas correctas ni incorrectas. Escribe como hablas.',
    'Si no sabes algo, déjalo en blanco o escribe «no sé». Lo conversamos después.',
    'Las preguntas con ★ son las más importantes. Si tienes poco tiempo, empieza por esas.',
    'Tus respuestas se guardan en este navegador mientras avanzas: puedes cerrar y seguir después.',
    'Te tomará entre 20 y 30 minutos.',
  ],
  glosario: [
    { termino: 'Página web o sitio web', definicion: 'Tu «local» en internet. Ahí la gente conoce tu negocio a cualquier hora.' },
    {
      termino: 'Landing page',
      definicion: 'Una página web de una sola hoja, enfocada en un solo objetivo: por ejemplo, que te escriban por WhatsApp o que se inscriban a algo.',
    },
    { termino: 'Dominio', definicion: 'La dirección de tu página, por ejemplo: www.tunegocio.com' },
    { termino: 'Hosting', definicion: 'El «terreno» en internet donde vive tu página. Se paga cada año, como un arriendo.' },
    { termino: 'Botón de acción', definicion: 'El botón principal de la página: «Escríbenos», «Agenda tu cita», «Compra aquí».' },
  ],
  despues: [
    'Revisamos tus respuestas con calma.',
    'Te llamamos para aclarar dudas y escuchar tus ideas.',
    'Te enviamos una propuesta con el plan de tu página, los tiempos y la inversión.',
    'Con tu aprobación, empezamos a diseñar.',
  ],
} as const;

/** «Tus datos»: el único paso con campos obligatorios (negocio, nombre, WhatsApp y correo). */
export const DATOS: (Campo & { id: keyof DatosCliente; requerido?: boolean })[] = [
  { id: 'negocio', titulo: 'Nombre del negocio', placeholder: 'Panadería La Esquina', autocomplete: 'organization', requerido: true },
  { id: 'nombre', titulo: 'Tu nombre', placeholder: 'Nombre y apellido', autocomplete: 'name', requerido: true },
  { id: 'cargo', titulo: 'Cargo', placeholder: 'Dueña, gerente, encargado de marketing…', autocomplete: 'organization-title' },
  { id: 'whatsapp', titulo: 'WhatsApp', tipo: 'tel', autocomplete: 'tel-national', requerido: true },
  { id: 'correo', titulo: 'Correo electrónico', tipo: 'email', placeholder: 'tu@negocio.com', autocomplete: 'email', requerido: true },
  { id: 'ciudad', titulo: 'Ciudad', placeholder: 'Ibarra', autocomplete: 'address-level2' },
];

export const SECCIONES: Seccion[] = [
  {
    id: 'negocio',
    numero: '01',
    titulo: 'Tu negocio',
    porque: 'Para entender qué haces y poder explicarlo de forma clara a tus futuros clientes.',
    preguntas: [
      {
        id: 'a_que_se_dedica',
        n: 1,
        tipo: 'texto',
        importante: true,
        titulo: '¿A qué se dedica tu negocio?',
        ayuda: 'Explícalo como se lo contarías a un amigo, en pocas palabras.',
      },
      {
        id: 'desde_cuando_donde',
        n: 2,
        tipo: 'texto',
        titulo: '¿Desde cuándo existe y dónde atiendes?',
        ayuda: 'Ciudad, local físico, a domicilio, solo por internet, etc.',
      },
      { id: 'diferencia', n: 3, tipo: 'texto', importante: true, titulo: '¿Qué te hace diferente? ¿Por qué un cliente debería elegirte a ti y no a otro?' },
      {
        id: 'competidores',
        n: 4,
        tipo: 'texto',
        titulo: '¿Quiénes son tus principales competidores?',
        ayuda: 'Si tienen página web o redes sociales, pega el enlace.',
      },
    ],
  },
  {
    id: 'objetivo',
    numero: '02',
    titulo: 'Para qué quieres la página',
    porque: 'Una página funciona mejor cuando tiene una misión principal. Esto define qué botones y mensajes tendrá.',
    preguntas: [
      {
        id: 'accion_principal',
        n: 5,
        tipo: 'unica',
        importante: true,
        titulo: 'Cuando alguien entre a tu página, ¿qué es lo principal que quieres que haga?',
        ayuda: 'Elige solo UNA opción: la más importante para ti.',
        opciones: [
          { valor: 'Que me escriba por WhatsApp' },
          { valor: 'Que llene un formulario con sus datos' },
          { valor: 'Que agende una cita o reunión' },
          { valor: 'Que compre un producto en línea' },
          { valor: 'Que me llame por teléfono' },
          { valor: 'Que se inscriba a un curso o evento' },
          { valor: 'Que descargue algo (catálogo, menú, guía)' },
          { valor: 'Que conozca mi negocio y confíe en mí' },
        ],
      },
      {
        id: 'como_sabras',
        n: 6,
        tipo: 'texto',
        titulo: '¿Cómo sabrás que la página está funcionando bien?',
        ayuda: 'Ejemplo: «Recibir 20 mensajes de clientes nuevos al mes» o «Vender 10 cursos en la primera semana».',
      },
      {
        id: 'tipo_pagina',
        n: 7,
        tipo: 'unica',
        titulo: '¿La página es para una promoción puntual o es la página general de tu negocio?',
        opciones: [
          { valor: 'Para una promoción o campaña puntual', detalle: '¿Qué promoción es y hasta cuándo dura?' },
          { valor: 'Es la página principal de mi negocio' },
          { valor: 'No estoy seguro' },
        ],
      },
    ],
  },
  {
    id: 'cliente',
    numero: '03',
    titulo: 'Tu cliente ideal',
    porque: 'Escribimos los textos y elegimos el diseño pensando en la persona que los va a leer.',
    preguntas: [
      {
        id: 'cliente_tipico',
        n: 8,
        tipo: 'texto',
        importante: true,
        titulo: '¿Cómo es tu cliente típico?',
        ayuda: 'Edad aproximada, a qué se dedica, dónde vive, si es una persona o una empresa.',
      },
      { id: 'problema', n: 9, tipo: 'texto', importante: true, titulo: '¿Qué problema o necesidad tiene tu cliente cuando te busca?' },
      {
        id: 'dudas_miedos',
        n: 10,
        tipo: 'texto',
        titulo: '¿Qué dudas o miedos tiene antes de comprarte?',
        ayuda: 'Ejemplo: «Que sea muy caro», «que no llegue a tiempo», «que no sea de confianza».',
      },
      {
        id: 'preguntas_frecuentes',
        n: 11,
        tipo: 'texto',
        titulo: '¿Qué preguntas te hacen siempre tus clientes?',
        ayuda: 'Las respuestas pueden ir en la página para ahorrarte tiempo.',
      },
      {
        id: 'como_te_encuentran',
        n: 12,
        tipo: 'varias',
        titulo: '¿Cómo te encuentran hoy tus clientes?',
        ayuda: 'Puedes marcar varias.',
        opciones: [
          { valor: 'Recomendaciones de otros clientes' },
          { valor: 'Facebook' },
          { valor: 'Instagram' },
          { valor: 'TikTok' },
          { valor: 'Buscando en Google' },
          { valor: 'WhatsApp' },
          { valor: 'Publicidad pagada' },
          { valor: 'Pasan por mi local' },
          { valor: 'Otro', detalle: '¿Cuál?' },
        ],
      },
    ],
  },
  {
    id: 'oferta',
    numero: '04',
    titulo: 'Lo que vendes',
    porque: 'Para decidir qué productos o servicios mostrar, en qué orden y cómo presentarlos.',
    preguntas: [
      {
        id: 'productos',
        n: 13,
        tipo: 'tabla',
        importante: true,
        titulo: 'Escribe tus productos o servicios principales',
        ayuda: 'Empieza por el más importante. Si no quieres mostrar el precio, escribe «No».',
        columnas: [
          { id: 'nombre', titulo: 'Producto o servicio', placeholder: 'Torta de cumpleaños' },
          { id: 'descripcion', titulo: 'Descríbelo en una frase', placeholder: 'Personalizada, para 10 a 40 personas' },
          { id: 'precio', titulo: 'Precio a mostrar', placeholder: 'Desde $25 o «No»' },
        ],
        filas: 3,
        maxFilas: 10,
        agregar: 'Agregar otro producto',
        fila: 'Producto',
      },
      { id: 'producto_estrella', n: 14, tipo: 'texto', titulo: '¿Cuál es el producto o servicio que más quieres vender?', sugerirDe: 'productos' },
      {
        id: 'oferta_garantia',
        n: 15,
        tipo: 'texto',
        titulo: '¿Tienes alguna oferta, promoción o garantía que quieras destacar?',
        ayuda: 'Ejemplo: «Primera consulta gratis», «Envío sin costo», «Si no te gusta, te devolvemos tu dinero».',
      },
    ],
  },
  {
    id: 'confianza',
    numero: '05',
    titulo: 'Lo que genera confianza',
    porque: 'La gente compra cuando confía. Mostrar pruebas reales hace que más visitantes se animen a contactarte.',
    preguntas: [
      {
        id: 'pruebas',
        n: 16,
        tipo: 'varias',
        titulo: '¿Qué de esto tienes y nos podrías compartir?',
        ayuda: 'Marca todo lo que tengas.',
        ninguna: 'Ninguna por ahora',
        opciones: [
          { valor: 'Comentarios o testimonios de clientes' },
          { valor: 'Logos de empresas con las que has trabajado' },
          { valor: 'Fotos de trabajos realizados (antes y después)' },
          { valor: 'Certificados, títulos o premios' },
          { valor: 'Apariciones en medios o alianzas' },
          { valor: 'Fotos del equipo o del local' },
          { valor: 'Videos de clientes contentos' },
          { valor: 'Ninguna por ahora' },
        ],
      },
      {
        id: 'cifras',
        n: 17,
        tipo: 'texto',
        titulo: '¿Tienes cifras que te hagan quedar bien?',
        ayuda: 'Ejemplo: «10 años de experiencia», «más de 500 clientes atendidos», «4.9 estrellas en Google».',
      },
    ],
  },
  {
    id: 'estructura',
    numero: '06',
    titulo: 'Qué tendrá tu página',
    porque: 'Así armamos el «mapa» de la página antes de diseñarla, como los planos de una casa.',
    preguntas: [
      {
        id: 'una_o_varias',
        n: 18,
        tipo: 'unica',
        titulo: '¿Prefieres una sola página o varias?',
        opciones: [
          { valor: 'Una sola página', nota: 'Se recorre bajando con el dedo o el mouse. Ideal para un servicio, una promoción o para empezar.' },
          { valor: 'Varias páginas con un menú', nota: 'Ideal si tienes muchos servicios o mucha información.' },
          { valor: 'No sé, recomiéndenme' },
        ],
      },
      {
        id: 'secciones',
        n: 19,
        tipo: 'varias',
        titulo: '¿Qué te gustaría que aparezca en tu página?',
        ayuda: 'Marca todo lo que quieras. Luego te recomendamos qué es lo más útil.',
        opciones: [
          { valor: 'Quiénes somos / nuestra historia' },
          { valor: 'Servicios o productos' },
          { valor: 'Precios o planes' },
          { valor: 'Galería de fotos o trabajos' },
          { valor: 'Testimonios de clientes' },
          { valor: 'Preguntas frecuentes' },
          { valor: 'Nuestro equipo' },
          { valor: 'Ubicación con mapa' },
          { valor: 'Horarios de atención' },
          { valor: 'Blog o noticias' },
          { valor: 'Formulario de contacto' },
          { valor: 'Botón de WhatsApp' },
          { valor: 'Tienda en línea' },
          { valor: 'Enlaces a redes sociales' },
        ],
      },
      { id: 'no_quiere', n: 20, tipo: 'texto', titulo: '¿Hay algo que definitivamente NO quieres que aparezca?' },
    ],
  },
  {
    id: 'estilo',
    numero: '07',
    titulo: 'Cómo quieres que se vea',
    porque: 'Tu página debe sentirse como tu marca. Con esto definimos colores, estilo y fotos.',
    preguntas: [
      {
        id: 'logo',
        n: 21,
        tipo: 'varias',
        titulo: '¿Tienes logo?',
        ninguna: 'No tengo logo',
        opciones: [
          { valor: 'Sí, en buena calidad' },
          { valor: 'Sí, pero solo en foto o baja calidad' },
          { valor: 'Tengo manual de marca (colores y letras definidos)' },
          { valor: 'No tengo logo' },
        ],
      },
      {
        id: 'colores',
        n: 22,
        tipo: 'texto',
        titulo: '¿Qué colores representan a tu marca?',
        ayuda: 'Si no tienes colores definidos, cuéntanos cuáles te gustan y cuáles NO.',
      },
      {
        id: 'sensacion',
        n: 23,
        tipo: 'varias',
        importante: true,
        max: 3,
        titulo: '¿Qué sensación quieres que transmita tu página?',
        ayuda: 'Marca máximo 3.',
        opciones: [
          { valor: 'Seria y profesional' },
          { valor: 'Elegante y exclusiva' },
          { valor: 'Cercana y amigable' },
          { valor: 'Moderna y tecnológica' },
          { valor: 'Divertida y juvenil' },
          { valor: 'Natural y tranquila' },
          { valor: 'Sencilla y minimalista' },
          { valor: 'Llamativa y con energía' },
        ],
      },
      {
        id: 'referencias',
        n: 24,
        tipo: 'tabla',
        importante: true,
        titulo: 'Páginas web que te gusten',
        ayuda: 'Pueden ser de cualquier negocio, incluso de otro país. Si hay alguna que NO te guste, también cuéntanos.',
        columnas: [
          { id: 'enlace', titulo: 'Enlace de la página', placeholder: 'www.ejemplo.com' },
          { id: 'comentario', titulo: '¿Qué te gusta (o no) de ella?', placeholder: 'Me gustan las fotos grandes y que es fácil de leer' },
        ],
        filas: 3,
        maxFilas: 6,
        agregar: 'Agregar otra página',
        fila: 'Página',
      },
    ],
  },
  {
    id: 'material',
    numero: '08',
    titulo: 'Fotos, videos y textos',
    porque: 'Saber con qué material contamos nos ayuda a calcular los tiempos y ver si hace falta una sesión de fotos o escribir textos.',
    preguntas: [
      {
        id: 'fotos_videos',
        n: 25,
        tipo: 'varias',
        titulo: '¿Tienes fotos o videos propios de tu negocio, productos o equipo?',
        opciones: [
          { valor: 'Sí, hechos por un profesional' },
          { valor: 'Sí, tomados con el celular' },
          { valor: 'No tengo, pueden usar fotos de referencia' },
          { valor: 'Me interesa una sesión de fotos o video' },
        ],
      },
      {
        id: 'textos',
        n: 26,
        tipo: 'unica',
        titulo: '¿Quién escribirá los textos de la página?',
        opciones: [
          { valor: 'Yo los envío' },
          { valor: 'IONOS HUB, con la información de este cuestionario' },
          { valor: 'Tengo algunos textos, pero necesito ayuda' },
        ],
      },
    ],
  },
  {
    id: 'contacto',
    numero: '09',
    titulo: 'Contacto y conexiones',
    porque: 'Para saber a dónde llegarán los mensajes de tus clientes y con qué herramientas debe conectarse la página.',
    preguntas: [
      {
        id: 'donde_recibir',
        n: 27,
        tipo: 'campos',
        importante: true,
        titulo: '¿Dónde quieres recibir los mensajes de tus clientes?',
        campos: [
          { id: 'whatsapp', titulo: 'WhatsApp', tipo: 'tel', placeholder: '+593 99 123 4567' },
          { id: 'correo', titulo: 'Correo electrónico', tipo: 'email', placeholder: 'ventas@tunegocio.com' },
          { id: 'telefono', titulo: 'Teléfono', tipo: 'tel', placeholder: '06 123 4567' },
          { id: 'direccion', titulo: 'Dirección del local', placeholder: 'Calle, número y referencia' },
        ],
        copiarDeDatos: { whatsapp: 'whatsapp', correo: 'correo' },
      },
      {
        id: 'redes',
        n: 28,
        tipo: 'campos',
        titulo: 'Tus redes sociales',
        ayuda: 'Pega el enlace o escribe el nombre de usuario (@).',
        campos: [
          { id: 'facebook', titulo: 'Facebook', placeholder: 'facebook.com/tunegocio' },
          { id: 'instagram', titulo: 'Instagram', placeholder: '@tunegocio' },
          { id: 'tiktok', titulo: 'TikTok', placeholder: '@tunegocio' },
          { id: 'linkedin', titulo: 'LinkedIn', placeholder: 'linkedin.com/company/tunegocio' },
          { id: 'otra', titulo: 'YouTube u otra', placeholder: 'youtube.com/@tunegocio' },
        ],
      },
      {
        id: 'dominio',
        n: 29,
        tipo: 'unica',
        titulo: '¿Ya tienes una dirección web propia (por ejemplo www.tunegocio.com)?',
        opciones: [
          { valor: 'Sí, ya la tengo', detalle: 'www.tunegocio.com' },
          { valor: 'Tengo una página antigua', detalle: 'Enlace de la página actual' },
          { valor: 'No tengo, necesito una' },
          { valor: 'No sé' },
        ],
      },
      {
        id: 'herramientas',
        n: 30,
        tipo: 'varias',
        titulo: '¿Usas alguna herramienta que deba conectarse con la página?',
        ayuda: 'Si no sabes, no te preocupes: lo revisamos juntos.',
        ninguna: 'Ninguna / no sé',
        opciones: [
          { valor: 'Agenda de citas en línea' },
          { valor: 'Pagos en línea (tarjeta o transferencia)' },
          { valor: 'Sistema de facturación o inventario' },
          { valor: 'Base de datos o lista de clientes (CRM)' },
          { valor: 'Asistente automático o chatbot' },
          { valor: 'Ninguna / no sé' },
        ],
      },
      {
        id: 'publicidad',
        n: 31,
        tipo: 'varias',
        titulo: '¿Vas a pagar publicidad para llevar gente a la página?',
        ninguna: 'Todavía no / no sé',
        opciones: [{ valor: 'Sí, en Facebook o Instagram' }, { valor: 'Sí, en Google' }, { valor: 'Sí, en TikTok' }, { valor: 'Todavía no / no sé' }],
      },
    ],
  },
  {
    id: 'tiempos',
    numero: '10',
    titulo: 'Tiempos e inversión',
    porque: 'Para proponerte un plan realista que se ajuste a tus fechas y a tu presupuesto.',
    preguntas: [
      {
        id: 'para_cuando',
        n: 32,
        tipo: 'texto',
        importante: true,
        titulo: '¿Para cuándo necesitas la página lista?',
        ayuda: '¿Hay alguna fecha importante? Un lanzamiento, un evento, una temporada de ventas…',
      },
      {
        id: 'inversion',
        n: 33,
        tipo: 'texto',
        titulo: '¿Cuánto tienes pensado invertir?',
        ayuda: 'Un monto aproximado o un rango. Si prefieres, escribe «Envíenme una propuesta».',
      },
      {
        id: 'aprobacion',
        n: 34,
        tipo: 'texto',
        titulo: '¿Quién da la aprobación final de los diseños?',
        ayuda: 'Nombre y cargo. Si son varias personas, anótalas todas.',
      },
      {
        id: 'mantenimiento',
        n: 35,
        tipo: 'unica',
        titulo: 'Cuando la página esté lista, ¿quién la mantendrá al día?',
        ayuda: 'Cambiar precios, subir fotos nuevas, publicar novedades.',
        opciones: [{ valor: 'Yo o alguien de mi equipo' }, { valor: 'Quiero que IONOS HUB se encargue' }, { valor: 'No sé todavía' }],
      },
    ],
  },
  {
    id: 'algo_mas',
    numero: '11',
    titulo: 'Algo más',
    porque: 'A veces lo más importante es lo que no preguntamos.',
    preguntas: [
      {
        id: 'algo_mas',
        n: 36,
        tipo: 'texto',
        titulo: '¿Hay algo más que quieras contarnos?',
        ayuda: 'Ideas, malas experiencias con otras páginas, idiomas, cosas que te preocupan… todo suma.',
      },
    ],
  },
];

/** Todas las preguntas en orden, para buscarlas por id. */
export const PREGUNTAS: Pregunta[] = SECCIONES.flatMap((s) => s.preguntas);

/** Si una respuesta tiene contenido (para el avance y el resumen antes de enviar). */
export function respondida(p: Pregunta, r: Respuesta | undefined): boolean {
  if (r == null) return false;
  switch (p.tipo) {
    case 'texto':
      return typeof r === 'string' && r.trim().length > 0;
    case 'unica':
      return typeof r === 'object' && !Array.isArray(r) && Boolean((r as RespuestaUnica).valor);
    case 'varias':
      return typeof r === 'object' && !Array.isArray(r) && ((r as RespuestaVarias).valores?.length ?? 0) > 0;
    case 'tabla':
      return Array.isArray(r) && r.some((fila) => Object.values(fila).some((v) => String(v).trim()));
    case 'campos':
      return typeof r === 'object' && !Array.isArray(r) && Object.values(r as Record<string, string>).some((v) => String(v).trim());
  }
}
