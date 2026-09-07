/**
 * Espacios de fotografía del sitio.
 * `src: null` = todavía sin foto: el componente <Photo> dibuja el marco de marca con la indicación
 * de la toma (`shot`). Para activar una foto basta con dejar el archivo en /public/imgs/fotos y poner la ruta.
 * Nunca se usan fotos de banco como si fueran del equipo o de clientes reales: `generic: true` lo deja claro.
 */

export interface PhotoSlot {
  src: string | null;
  alt: string;
  /** Qué foto va aquí (guía para la sesión de fotos) */
  shot: string;
  width: number;
  height: number;
  /** Foto de banco provisional, no del equipo ni de un cliente real */
  generic?: boolean;
}

export const photos = {
  'dueno-local': {
    src: '/imgs/fotos/dueno-local.webp',
    alt: 'Dueña de un negocio revisando el WhatsApp del local entre clientes. Foto ilustrativa.',
    shot: 'Dueño/a de negocio con el celular en su local',
    width: 1600,
    height: 1200,
    generic: true,
  },
  diagnostico: {
    src: '/imgs/fotos/reunion-generica.webp',
    alt: 'Equipo de trabajo revisando una propuesta en una laptop',
    shot: 'Diagnóstico con un cliente: el equipo y el dueño frente a una laptop',
    width: 1600,
    height: 1067,
    generic: true,
  },
  'equipo-ibarra': {
    src: null,
    alt: 'El equipo de IonosHub en su oficina de Ibarra',
    shot: 'Equipo completo en la oficina de Ibarra, plano abierto, luz natural',
    width: 1600,
    height: 1200,
  },
  'evento-cobertura': {
    src: null,
    alt: 'Cobertura fotográfica de un evento de un cliente',
    shot: 'Cobertura de evento: cámara en mano, público de fondo',
    width: 1600,
    height: 1200,
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoId = keyof typeof photos;

/* ─────────────────────────────────────────────────────────────
   Galerías de trabajo real (componente <MediaGallery>).
   Todo lo que hay aquí son fotos o capturas de proyectos reales de
   clientes de IonosHub; jamás material de banco ni maquetas.
   ───────────────────────────────────────────────────────────── */

export interface GalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Nombre corto que aparece en la barra del marco (variante pantalla) */
  label?: string;
}

export interface Gallery {
  id: string;
  /** Nombre accesible del grupo */
  title: string;
  /** Cabecera de la ventanilla */
  header: { title: string; subtitle: string };
  /** Badge de la cabecera: siempre dice la verdad sobre el material */
  badge: string;
  /** Pie de la ventanilla */
  footer: { caption: string; unit: string };
  /** Tarjeta de acción sobre la primera pieza (la promesa del servicio), opcional */
  delivery?: { title: string; detail: string };
  /** Primera pieza a doble tamaño en el mosaico */
  lead?: boolean;
  items: GalleryItem[];
}

/** Pilar Marketing · cobertura de la inauguración de Aura Beauty Studio. Originales 6000×4000 en WEB/originales/mkt. */
export const coverageGallery: Gallery = {
  id: 'cobertura',
  title: 'Cobertura fotográfica de la inauguración de Aura Beauty Studio',
  header: { title: 'Cobertura · Inauguración de Aura Beauty Studio', subtitle: 'Fotografía profesional · entregada el mismo día' },
  badge: 'Fotos reales',
  footer: { caption: 'Cobertura de eventos · fotografía y video', unit: 'fotos' },
  delivery: { title: 'Entrega el mismo día', detail: 'Editadas y listas para tus redes' },
  lead: true,
  items: [
    {
      src: '/imgs/mkt/cobertura-01.webp',
      alt: 'Retrato de una invitada sonriendo con su perro pequinés en brazos, entre columnas de globos dorados y blancos',
      width: 1537,
      height: 1023,
    },
    {
      src: '/imgs/mkt/cobertura-02.webp',
      alt: 'Cuatro invitadas posando juntas frente al local, con guirnaldas de luces al fondo',
      width: 1536,
      height: 1024,
    },
    {
      src: '/imgs/mkt/cobertura-03.webp',
      alt: 'Figura de la propietaria sosteniendo el logo de Aura Beauty Studio junto al rótulo de inauguración',
      width: 1600,
      height: 1067,
    },
    {
      src: '/imgs/mkt/cobertura-04.webp',
      alt: 'Detalle del catering: bandeja de fruta fresca con piña, uvas, sandía y kiwi',
      width: 1600,
      height: 1067,
    },
    {
      src: '/imgs/mkt/cobertura-05.webp',
      alt: 'Torre de mini hamburguesas con banderines de Moka Café sobre la mesa del evento',
      width: 1600,
      height: 2400,
    },
  ],
};

/** Pilar Marketing · landing pages a medida. Capturas a 1366×768; originales en WEB/originales/landings. */
export const landingsGallery: Gallery = {
  id: 'landings',
  title: 'Landing pages diseñadas por IonosHub para clientes reales',
  header: { title: 'Landing pages · clientes reales', subtitle: 'Diseñadas a medida, listas para recibir la pauta' },
  badge: 'Capturas reales',
  footer: { caption: 'Marketing · landing pages a medida', unit: 'landings' },
  items: [
    {
      src: '/imgs/landings/aura.webp',
      alt: 'Landing page de Aura Beauty Studio: «La belleza de sentirte tú», con botón «Quiero mi cita»',
      width: 1366,
      height: 768,
      label: 'Aura Beauty Studio',
    },
    {
      src: '/imgs/landings/chipotle.webp',
      alt: 'Landing page de El Chipotle: «Auténtico sabor, Mexican & American Food», con botones de menú y WhatsApp',
      width: 1366,
      height: 768,
      label: 'El Chipotle',
    },
    {
      src: '/imgs/landings/fondues.webp',
      alt: "Landing page de Fondue's Escuela de Chefs: «20 años transformando pasión en profesión»",
      width: 1366,
      height: 768,
      label: "Fondue's Escuela de Chefs",
    },
    {
      src: '/imgs/landings/gecop.webp',
      alt: 'Landing page de Gecop Expert, asesoría técnica en procesos del sector público, con matriz de requisitos',
      width: 1366,
      height: 768,
      label: 'Gecop Expert',
    },
  ],
};

/**
 * Pilar Software · sistemas entregados. Capturas a 1366×768; originales en WEB/originales/sistemas.
 * `correo.webp` (webmail del dominio propio) queda fuera a propósito: muestra una bandeja real con remitentes y asuntos.
 */
export const systemsGallery: Gallery = {
  id: 'sistemas',
  title: 'Sistemas a medida entregados por IonosHub a clientes reales',
  header: { title: 'Sistemas entregados · clientes reales', subtitle: 'Facturación, tiendas en línea, académico y gestión' },
  badge: 'Capturas reales',
  footer: { caption: 'Software a medida · sistemas web y apps', unit: 'sistemas' },
  delivery: { title: 'Software a medida', detail: 'Alcance cerrado y entrega en 30 días' },
  items: [
    {
      src: '/imgs/sistemas/zona-gamers.webp',
      alt: 'Portada de la tienda en línea de Zona Gamers: catálogo de juegos para PlayStation 4 y 5 con contacto por WhatsApp',
      width: 1366,
      height: 768,
      label: 'Zona Gamers',
    },
    {
      src: '/imgs/sistemas/equametric.webp',
      alt: 'Portada de Equametric, plataforma de facturación electrónica para Ecuador con POS y cumplimiento SRI',
      width: 1366,
      height: 768,
      label: 'Equametric',
    },
    {
      src: '/imgs/sistemas/mega-mayorista.webp',
      alt: 'Portada de la tienda en línea de Mega Mayorista, e-commerce de tecnología gaming',
      width: 1366,
      height: 768,
      label: 'Mega Mayorista',
    },
    {
      src: '/imgs/sistemas/latini.webp',
      alt: 'Ficha de producto de la tienda en línea de Latini, ropa para adultos, con talla, cantidad y carrito',
      width: 1366,
      height: 768,
      label: 'Latini',
    },
    {
      src: '/imgs/sistemas/ecu593.webp',
      alt: 'Pantalla de acceso del sistema académico de Ecu593 English',
      width: 1366,
      height: 768,
      label: 'Ecu593 English',
    },
    {
      src: '/imgs/sistemas/mafer-cano.webp',
      alt: 'Pantalla de acceso del sistema de gestión de Mafer Cano, makeup artist',
      width: 1366,
      height: 768,
      label: 'Mafer Cano',
    },
  ],
};
