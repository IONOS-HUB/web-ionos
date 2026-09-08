/**
 * Motion orquestado una sola vez por página.
 * - Reveal: elementos [data-reveal] entran con 24 px + blur → nítido (CSS), disparado por IntersectionObserver.
 *   Es lo único que corre en la carga: barato y sin dependencias.
 * - Contadores, línea de progreso y parallax del hero usan GSAP + ScrollTrigger, que se cargan en un
 *   trozo aparte (`motion-scroll.ts`) cuando el hilo principal queda libre, para no penalizar el TBT.
 * Todo se desactiva bajo prefers-reduced-motion: el estado por defecto ya es el final.
 */

// `?nomotion=1` fuerza el estado final sin animación (capturas de QA y regresión visual).
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('nomotion');

if (!reduced) {
  document.documentElement.classList.add('motion-ready');

  /* Reveals */
  const revealables = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
  );
  revealables.forEach((el) => io.observe(el));

  /* Lo que depende del scroll (GSAP) se difiere a un momento ocioso. */
  const needsScroll =
    document.querySelector('[data-count], [data-progress-line], [data-hero-phone]') !== null;
  if (needsScroll) {
    const load = () => import('./motion-scroll');
    if ('requestIdleCallback' in window) requestIdleCallback(() => load(), { timeout: 2000 });
    else window.setTimeout(load, 600);
  }
} else {
  // Sin movimiento: activa estados finales que dependen de clases.
  document.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => s.classList.add('is-active'));
}
