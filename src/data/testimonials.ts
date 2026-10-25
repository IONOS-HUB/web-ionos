/**
 * Testimonios reales de clientes. PRODUCT.md: no se inventan ni se rellenan con placeholders que
 * parezcan reales. Mientras esta lista esté vacía, la sección de testimonios no se pinta.
 *
 * Para añadir uno: nombre y empresa reales, la cita tal como la dio el cliente y, si la autorizó,
 * su foto en `public/imgs/testimonios/` (cuadrada, ~240 px, .webp).
 *
 * Con `video`, sale en las landings de pauta justo después de la portada, cerca del formulario (la cita va
 * como resumen de lo que dice). Cada landing toma el primero que la nombre en `landings` (el testimonio de su
 * servicio) y, si ninguno la nombra, el primero sin `landings`. Archivos en `public/videos/testimonios/`: mp4 H.264
 * (idealmente < 8 MB), webm opcional y póster .webp con el primer fotograma.
 */
export interface Testimonial {
  name: string;
  /** Cómo se lo nombra en el titular («Lo cuenta …») cuando `name` empieza con un título (Abg., Dr., Ing.) */
  shortName?: string;
  /** Cargo, sólo si la persona lo dio */
  role?: string;
  company: string;
  quote: string;
  photo?: string;
  /** Logo recortado al trazo (public/imgs/clientes/marca), si existe */
  logo?: string;
  /** Video del testimonio; `vertical` si se grabó con el celular parado (9:16) */
  video?: { mp4: string; webm?: string; poster: string; vertical?: boolean };
  /** Landings de pauta donde va primero (ids de `landings.ts`); sin esto, vale para las que no tienen uno propio */
  landings?: string[];
}

export const testimonials: Testimonial[] = [
  {
    // Autorizado por la clienta (octubre de 2026). Cita tomada de los subtítulos del video, sin el saludo.
    name: 'Mary Chamorro',
    company: 'Aura Beauty Studio',
    quote:
      'Es un equipo excelente, me ayudaron a crear la página web de Aura Beauty Studio. Son unos chicos excelentes y les agradezco bastante. Es muy recomendado el trabajo, de verdad.',
    logo: '/imgs/clientes/marca/aura.webp',
    video: { mp4: '/videos/testimonios/aura.mp4', poster: '/videos/testimonios/aura.webp', vertical: true },
  },
  {
    // Autorizado por el cliente (octubre de 2026). Cita tomada de los subtítulos del video; los «…» marcan cortes.
    name: 'Abg. Ismael A.',
    shortName: 'Ismael',
    company: 'Ecu593 English',
    quote:
      'Antes de trabajar con IONOS estaba desorganizado en cuanto a cómo poder organizar las clases y los cursos… nos permitió unificar todas estas tareas en una sola aplicación. Me dieron una atención personalizada y estoy bastante satisfecho con los resultados obtenidos.',
    logo: '/imgs/clientes/marca/ecu593.webp',
    video: { mp4: '/videos/testimonios/ecu593.mp4', poster: '/videos/testimonios/ecu593.webp', vertical: true },
    // Su caso es el sistema académico a medida: va en la de software y en la de instituciones educativas.
    landings: ['software', 'instituciones'],
  },
];
