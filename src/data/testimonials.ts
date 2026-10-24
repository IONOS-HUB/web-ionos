/**
 * Testimonios reales de clientes. PRODUCT.md: no se inventan ni se rellenan con placeholders que
 * parezcan reales. Mientras esta lista esté vacía, la sección de testimonios no se pinta.
 *
 * Para añadir uno: nombre y empresa reales, la cita tal como la dio el cliente y, si la autorizó,
 * su foto en `public/imgs/testimonios/` (cuadrada, ~240 px, .webp).
 *
 * Con `video`, el primero que lo tenga sale en las landings de pauta justo después de la portada, cerca del
 * formulario (la cita va como resumen de lo que dice). Archivos en `public/videos/testimonios/`: mp4 H.264
 * (idealmente < 8 MB), webm opcional y póster .webp con el primer fotograma.
 */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo?: string;
  /** Logo recortado al trazo (public/imgs/clientes/marca), si existe */
  logo?: string;
  /** Video del testimonio; `vertical` si se grabó con el celular parado (9:16) */
  video?: { mp4: string; webm?: string; poster: string; vertical?: boolean };
}

export const testimonials: Testimonial[] = [];
