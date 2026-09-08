/**
 * Parte de la motion que depende del scroll. Se importa de forma diferida desde `motion.ts`.
 * Sin GSAP: IntersectionObserver para disparar, y un único listener de scroll pasivo + rAF para
 * lo que se guía con el desplazamiento (línea de progreso y parallax del hero). Una sola lectura
 * de geometría por frame y sólo mientras se hace scroll: nada de refrescos globales.
 */

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* Contadores: ruedan desde 0 al entrar en pantalla */
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (counters.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const target = Number(el.dataset.count);
        if (Number.isNaN(target)) continue;
        const suffix = el.dataset.suffix ?? '';
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = easeOutExpo(clamp01((now - t0) / 1600));
          el.textContent = `${Math.round(target * p)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  counters.forEach((el) => io.observe(el));
}

/* Pasos del proceso: activos cuando su borde superior pasa el 62 % del alto de la ventana */
const steps = document.querySelectorAll<HTMLElement>('[data-step]');
if (steps.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Entra por abajo → activo; vuelve a salir por abajo → inactivo. Salir por arriba lo deja activo.
        if (e.isIntersecting) e.target.classList.add('is-active');
        else if (e.boundingClientRect.top > 0) e.target.classList.remove('is-active');
      }
    },
    { rootMargin: '0px 0px -38% 0px', threshold: 0 },
  );
  steps.forEach((s) => io.observe(s));
}

/* Guiados por scroll: línea de progreso y parallax del teléfono (sólo escritorio) */
const line = document.querySelector<HTMLElement>('[data-progress-line]');
const lineWrap = document.querySelector<HTMLElement>('[data-progress-wrap]');
const phone = window.matchMedia('(min-width: 1024px)').matches ? document.querySelector<HTMLElement>('[data-hero-phone]') : null;

if ((line && lineWrap) || phone) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    if (line && lineWrap) {
      const r = lineWrap.getBoundingClientRect();
      // Se dibuja entre "top al 65 %" y "bottom al 60 %" de la ventana.
      const start = vh * 0.65;
      const end = vh * 0.6;
      const p = clamp01((start - r.top) / (r.height + start - end));
      line.style.transform = `scaleY(${p.toFixed(4)})`;
    }
    if (phone) {
      const r = phone.getBoundingClientRect();
      // De "top al 20 %" hasta que el bloque sale por arriba: hasta -48 px.
      const p = clamp01((vh * 0.2 - r.top) / (r.height + vh * 0.2));
      phone.style.transform = `translate3d(0, ${(-48 * p).toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
