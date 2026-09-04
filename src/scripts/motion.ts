/**
 * Motion orquestado una sola vez por página.
 * - Reveal: elementos [data-reveal] entran con 24 px + blur → nítido (CSS), disparado por IntersectionObserver.
 * - Contadores: [data-count] ruedan desde 0 con GSAP cuando entran en pantalla.
 * - Proceso: la línea de progreso de los pasos se dibuja con el scroll (ScrollTrigger scrub).
 * Todo se desactiva bajo prefers-reduced-motion: el estado por defecto ya es el final.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// `?nomotion=1` fuerza el estado final sin animación (capturas de QA y regresión visual).
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('nomotion');

if (!reduced) {
  document.documentElement.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger);

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

  /* Contadores */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.suffix ?? '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      },
    });
  });

  /* Línea de progreso del proceso */
  const line = document.querySelector<HTMLElement>('[data-progress-line]');
  const lineWrap = document.querySelector<HTMLElement>('[data-progress-wrap]');
  if (line && lineWrap) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: lineWrap,
          start: 'top 65%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      },
    );
    document.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        onEnter: () => step.classList.add('is-active'),
        onLeaveBack: () => step.classList.remove('is-active'),
      });
    });
  }

  /* Parallax suave del teléfono del hero */
  const phone = document.querySelector<HTMLElement>('[data-hero-phone]');
  if (phone && window.matchMedia('(min-width: 1024px)').matches) {
    gsap.to(phone, {
      y: -48,
      ease: 'none',
      scrollTrigger: { trigger: phone, start: 'top 20%', end: 'bottom top', scrub: 0.8 },
    });
  }
} else {
  // Sin movimiento: activa estados finales que dependen de clases.
  document.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => s.classList.add('is-active'));
}
