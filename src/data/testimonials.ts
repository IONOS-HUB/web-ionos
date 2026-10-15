/**
 * Testimonios reales de clientes. PRODUCT.md: no se inventan ni se rellenan con placeholders que
 * parezcan reales. Mientras esta lista esté vacía, la sección de testimonios no se pinta.
 *
 * Para añadir uno: nombre y empresa reales, la cita tal como la dio el cliente y, si la autorizó,
 * su foto en `public/imgs/testimonios/` (cuadrada, ~240 px, .webp).
 */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo?: string;
  /** Logo recortado al trazo (public/imgs/clientes/marca), si existe */
  logo?: string;
}

export const testimonials: Testimonial[] = [];
