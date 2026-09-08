/**
 * Parte de la motion que depende del scroll (GSAP + ScrollTrigger). Se importa de forma diferida
 * desde `motion.ts` una vez que la página ya pintó, así el bundle de GSAP no entra en la ruta crítica.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
