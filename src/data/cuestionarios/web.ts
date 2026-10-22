import { numerar, type Servicio } from './tipos';

/**
 * Página web o landing page. Es la versión en línea del documento «Cuestionario para tu página web»: el
 * primero que se hizo y el modelo de los demás.
 */
export const web: Servicio = {
  id: 'web',
  nombre: 'Página web o landing page',
  descripcion: 'Tu página para que te encuentren y te escriban: de una sola hoja o con varias secciones.',
  documento: 'PRD página web',
  titulo: 'Cuestionario para tu página web',
  lead: 'Cuéntanos tu idea con tus propias palabras. Nosotros nos encargamos de la parte técnica.',
  queEs:
    'Antes de diseñar tu página web necesitamos conocer bien tu negocio, a tus clientes y lo que esperas lograr. Estas preguntas nos ayudan a armar un plan claro para que tu página quede como la imaginas y, sobre todo, para que te traiga clientes.',
  minutos: '20 y 30',
  glosario: [
    {
      termino: 'Página web o sitio web',
      definicion: 'Tu «local» en internet. Ahí la gente conoce tu negocio a cualquier hora.',
    },
    {
      termino: 'Landing page',
      definicion: 'Una página web de una sola hoja, enfocada en un solo objetivo: por ejemplo, que te escriban por WhatsApp o que se inscriban a algo.',
    },
    {
      termino: 'Dominio',
      definicion: 'La dirección de tu página, por ejemplo: www.tunegocio.com',
    },
    {
      termino: 'Hosting',
      definicion: 'El «terreno» en internet donde vive tu página. Se paga cada año, como un arriendo.',
    },
    {
      termino: 'Botón de acción',
      definicion: 'El botón principal de la página: «Escríbenos», «Agenda tu cita», «Compra aquí».',
    },
  ],
  despues: [
    'Revisamos tus respuestas con calma.',
    'Te llamamos para aclarar dudas y escuchar tus ideas.',
    'Te enviamos una propuesta con el plan de tu página, los tiempos y la inversión.',
    'Con tu aprobación, empezamos a diseñar.',
  ],
  secciones: numerar([
    {
      id: 'negocio',
      titulo: 'Tu negocio',
      porque: 'Para entender qué haces y poder explicarlo de forma clara a tus futuros clientes.',
      preguntas: [
        {
          id: 'a_que_se_dedica',
          tipo: 'texto',
          importante: true,
          titulo: '¿A qué se dedica tu negocio?',
          ayuda: 'Explícalo como se lo contarías a un amigo, en pocas palabras.',
        },
        {
          id: 'desde_cuando_donde',
          tipo: 'texto',
          titulo: '¿Desde cuándo existe y dónde atiendes?',
          ayuda: 'Ciudad, local físico, a domicilio, solo por internet, etc.',
        },
        {
          id: 'diferencia',
          tipo: 'texto',
          importante: true,
          titulo: '¿Qué te hace diferente? ¿Por qué un cliente debería elegirte a ti y no a otro?',
        },
        {
          id: 'competidores',
          tipo: 'texto',
          titulo: '¿Quiénes son tus principales competidores?',
          ayuda: 'Si tienen página web o redes sociales, pega el enlace.',
        },
      ],
    },
    {
      id: 'objetivo',
      titulo: 'Para qué quieres la página',
      porque: 'Una página funciona mejor cuando tiene una misión principal. Esto define qué botones y mensajes tendrá.',
      preguntas: [
        {
          id: 'accion_principal',
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
          tipo: 'texto',
          titulo: '¿Cómo sabrás que la página está funcionando bien?',
          ayuda: 'Ejemplo: «Recibir 20 mensajes de clientes nuevos al mes» o «Vender 10 cursos en la primera semana».',
        },
        {
          id: 'tipo_pagina',
          tipo: 'unica',
          titulo: '¿La página es para una promoción puntual o es la página general de tu negocio?',
          opciones: [
            {
              valor: 'Para una promoción o campaña puntual',
              detalle: '¿Qué promoción es y hasta cuándo dura?',
            },
            { valor: 'Es la página principal de mi negocio' },
            { valor: 'No estoy seguro' },
          ],
        },
      ],
    },
    {
      id: 'cliente',
      titulo: 'Tu cliente ideal',
      porque: 'Escribimos los textos y elegimos el diseño pensando en la persona que los va a leer.',
      preguntas: [
        {
          id: 'cliente_tipico',
          tipo: 'texto',
          importante: true,
          titulo: '¿Cómo es tu cliente típico?',
          ayuda: 'Edad aproximada, a qué se dedica, dónde vive, si es una persona o una empresa.',
        },
        {
          id: 'problema',
          tipo: 'texto',
          importante: true,
          titulo: '¿Qué problema o necesidad tiene tu cliente cuando te busca?',
        },
        {
          id: 'dudas_miedos',
          tipo: 'texto',
          titulo: '¿Qué dudas o miedos tiene antes de comprarte?',
          ayuda: 'Ejemplo: «Que sea muy caro», «que no llegue a tiempo», «que no sea de confianza».',
        },
        {
          id: 'preguntas_frecuentes',
          tipo: 'texto',
          titulo: '¿Qué preguntas te hacen siempre tus clientes?',
          ayuda: 'Las respuestas pueden ir en la página para ahorrarte tiempo.',
        },
        {
          id: 'como_te_encuentran',
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
      titulo: 'Lo que vendes',
      porque: 'Para decidir qué productos o servicios mostrar, en qué orden y cómo presentarlos.',
      preguntas: [
        {
          id: 'productos',
          tipo: 'tabla',
          importante: true,
          titulo: 'Escribe tus productos o servicios principales',
          ayuda: 'Empieza por el más importante. Si no quieres mostrar el precio, escribe «No».',
          columnas: [
            {
              id: 'nombre',
              titulo: 'Producto o servicio',
              placeholder: 'Torta de cumpleaños',
            },
            {
              id: 'descripcion',
              titulo: 'Descríbelo en una frase',
              placeholder: 'Personalizada, para 10 a 40 personas',
            },
            {
              id: 'precio',
              titulo: 'Precio a mostrar',
              placeholder: 'Desde $25 o «No»',
            },
          ],
          filas: 3,
          maxFilas: 10,
          agregar: 'Agregar otro producto',
          fila: 'Producto',
        },
        {
          id: 'producto_estrella',
          tipo: 'texto',
          titulo: '¿Cuál es el producto o servicio que más quieres vender?',
          sugerirDe: 'productos',
        },
        {
          id: 'oferta_garantia',
          tipo: 'texto',
          titulo: '¿Tienes alguna oferta, promoción o garantía que quieras destacar?',
          ayuda: 'Ejemplo: «Primera consulta gratis», «Envío sin costo», «Si no te gusta, te devolvemos tu dinero».',
        },
      ],
    },
    {
      id: 'confianza',
      titulo: 'Lo que genera confianza',
      porque: 'La gente compra cuando confía. Mostrar pruebas reales hace que más visitantes se animen a contactarte.',
      preguntas: [
        {
          id: 'pruebas',
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
          tipo: 'texto',
          titulo: '¿Tienes cifras que te hagan quedar bien?',
          ayuda: 'Ejemplo: «10 años de experiencia», «más de 500 clientes atendidos», «4.9 estrellas en Google».',
        },
      ],
    },
    {
      id: 'estructura',
      titulo: 'Qué tendrá tu página',
      porque: 'Así armamos el «mapa» de la página antes de diseñarla, como los planos de una casa.',
      preguntas: [
        {
          id: 'una_o_varias',
          tipo: 'unica',
          titulo: '¿Prefieres una sola página o varias?',
          opciones: [
            {
              valor: 'Una sola página',
              nota: 'Se recorre bajando con el dedo o el mouse. Ideal para un servicio, una promoción o para empezar.',
            },
            {
              valor: 'Varias páginas con un menú',
              nota: 'Ideal si tienes muchos servicios o mucha información.',
            },
            { valor: 'No sé, recomiéndenme' },
          ],
        },
        {
          id: 'secciones',
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
        {
          id: 'no_quiere',
          tipo: 'texto',
          titulo: '¿Hay algo que definitivamente NO quieres que aparezca?',
        },
      ],
    },
    {
      id: 'estilo',
      titulo: 'Cómo quieres que se vea',
      porque: 'Tu página debe sentirse como tu marca. Con esto definimos colores, estilo y fotos.',
      preguntas: [
        {
          id: 'logo',
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
          tipo: 'texto',
          titulo: '¿Qué colores representan a tu marca?',
          ayuda: 'Si no tienes colores definidos, cuéntanos cuáles te gustan y cuáles NO.',
        },
        {
          id: 'sensacion',
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
          tipo: 'tabla',
          importante: true,
          titulo: 'Páginas web que te gusten',
          ayuda: 'Pueden ser de cualquier negocio, incluso de otro país. Si hay alguna que NO te guste, también cuéntanos.',
          columnas: [
            {
              id: 'enlace',
              titulo: 'Enlace de la página',
              placeholder: 'www.ejemplo.com',
            },
            {
              id: 'comentario',
              titulo: '¿Qué te gusta (o no) de ella?',
              placeholder: 'Me gustan las fotos grandes y que es fácil de leer',
            },
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
      titulo: 'Fotos, videos y textos',
      porque: 'Saber con qué material contamos nos ayuda a calcular los tiempos y ver si hace falta una sesión de fotos o escribir textos.',
      preguntas: [
        {
          id: 'fotos_videos',
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
      titulo: 'Contacto y conexiones',
      porque: 'Para saber a dónde llegarán los mensajes de tus clientes y con qué herramientas debe conectarse la página.',
      preguntas: [
        {
          id: 'donde_recibir',
          tipo: 'campos',
          importante: true,
          titulo: '¿Dónde quieres recibir los mensajes de tus clientes?',
          campos: [
            {
              id: 'whatsapp',
              titulo: 'WhatsApp',
              tipo: 'tel',
              placeholder: '+593 99 123 4567',
            },
            {
              id: 'correo',
              titulo: 'Correo electrónico',
              tipo: 'email',
              placeholder: 'ventas@tunegocio.com',
            },
            {
              id: 'telefono',
              titulo: 'Teléfono',
              tipo: 'tel',
              placeholder: '06 123 4567',
            },
            {
              id: 'direccion',
              titulo: 'Dirección del local',
              placeholder: 'Calle, número y referencia',
            },
          ],
          copiarDeDatos: { whatsapp: 'whatsapp', correo: 'correo' },
        },
        {
          id: 'redes',
          tipo: 'campos',
          titulo: 'Tus redes sociales',
          ayuda: 'Pega el enlace o escribe el nombre de usuario (@).',
          campos: [
            {
              id: 'facebook',
              titulo: 'Facebook',
              placeholder: 'facebook.com/tunegocio',
            },
            { id: 'instagram', titulo: 'Instagram', placeholder: '@tunegocio' },
            { id: 'tiktok', titulo: 'TikTok', placeholder: '@tunegocio' },
            {
              id: 'linkedin',
              titulo: 'LinkedIn',
              placeholder: 'linkedin.com/company/tunegocio',
            },
            {
              id: 'otra',
              titulo: 'YouTube u otra',
              placeholder: 'youtube.com/@tunegocio',
            },
          ],
        },
        {
          id: 'dominio',
          tipo: 'unica',
          titulo: '¿Ya tienes una dirección web propia (por ejemplo www.tunegocio.com)?',
          opciones: [
            { valor: 'Sí, ya la tengo', detalle: 'www.tunegocio.com' },
            {
              valor: 'Tengo una página antigua',
              detalle: 'Enlace de la página actual',
            },
            { valor: 'No tengo, necesito una' },
            { valor: 'No sé' },
          ],
        },
        {
          id: 'herramientas',
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
          tipo: 'varias',
          titulo: '¿Vas a pagar publicidad para llevar gente a la página?',
          ninguna: 'Todavía no / no sé',
          opciones: [{ valor: 'Sí, en Facebook o Instagram' }, { valor: 'Sí, en Google' }, { valor: 'Sí, en TikTok' }, { valor: 'Todavía no / no sé' }],
        },
      ],
    },
    {
      id: 'tiempos',
      titulo: 'Tiempos e inversión',
      porque: 'Para proponerte un plan realista que se ajuste a tus fechas y a tu presupuesto.',
      preguntas: [
        {
          id: 'para_cuando',
          tipo: 'texto',
          importante: true,
          titulo: '¿Para cuándo necesitas la página lista?',
          ayuda: '¿Hay alguna fecha importante? Un lanzamiento, un evento, una temporada de ventas…',
        },
        {
          id: 'inversion',
          tipo: 'texto',
          titulo: '¿Cuánto tienes pensado invertir?',
          ayuda: 'Un monto aproximado o un rango. Si prefieres, escribe «Envíenme una propuesta».',
        },
        {
          id: 'aprobacion',
          tipo: 'texto',
          titulo: '¿Quién da la aprobación final de los diseños?',
          ayuda: 'Nombre y cargo. Si son varias personas, anótalas todas.',
        },
        {
          id: 'mantenimiento',
          tipo: 'unica',
          titulo: 'Cuando la página esté lista, ¿quién la mantendrá al día?',
          ayuda: 'Cambiar precios, subir fotos nuevas, publicar novedades.',
          opciones: [{ valor: 'Yo o alguien de mi equipo' }, { valor: 'Quiero que IONOS HUB se encargue' }, { valor: 'No sé todavía' }],
        },
      ],
    },
    {
      id: 'algo_mas',
      titulo: 'Algo más',
      porque: 'A veces lo más importante es lo que no preguntamos.',
      preguntas: [
        {
          id: 'algo_mas',
          tipo: 'texto',
          titulo: '¿Hay algo más que quieras contarnos?',
          ayuda: 'Ideas, malas experiencias con otras páginas, idiomas, cosas que te preocupan… todo suma.',
        },
      ],
    },
  ]),
};
