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
