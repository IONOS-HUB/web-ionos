/**
 * Vigencia de los webinars en el navegador. El sitio es estático: `webinarStatus()` se evalúa al
 * compilar, y sin un despliegue posterior una edición ya celebrada seguiría con "Registro abierto",
 * cuenta atrás y formulario. Aquí se vuelve a comprobar la fecha y se pasa a "pasado" lo que toque,
 * también si la página sigue abierta cuando llega la hora.
 *
 * Marcado (lo emiten `WebinarCard`, el índice y la página de cada edición):
 *  - `[data-vigencia][data-starts-at]` es la raíz de una edición, con `data-status` de compilación.
 *  - Dentro, `[data-solo="proximo" | "pasado"]` sólo se ve en ese estado, y `[data-href-pasado]`
 *    cambia su enlace. Cada uno responde a su raíz más cercana, así que una tarjeta dentro de la
 *    página de otra edición no se contagia. La propia raíz también puede llevar `data-solo`.
 *  - Tras cada cambio se emite `webinars:vigencia` en `document` para quien tenga que reordenar.
 */

const raices = Array.from(document.querySelectorAll<HTMLElement>('[data-vigencia][data-status="proximo"]'));

const pasar = (raiz: HTMLElement) => {
  raiz.dataset.status = 'pasado';
  const marcados = [raiz, ...raiz.querySelectorAll<HTMLElement>('[data-solo], [data-href-pasado]')];
  for (const el of marcados) {
    if (el.closest('[data-vigencia]') !== raiz) continue;
    if (el.dataset.solo) el.hidden = el.dataset.solo !== 'pasado';
    if (el.dataset.hrefPasado) el.setAttribute('href', el.dataset.hrefPasado);
  }
};

const avisar = () => document.dispatchEvent(new CustomEvent('webinars:vigencia'));

// `setTimeout` desborda pasados ~24,8 días; más allá no hace falta programar nada.
const MAX_ESPERA = 2_000_000_000;

let cambios = false;
for (const raiz of raices) {
  const restante = new Date(raiz.dataset.startsAt ?? '').getTime() - Date.now();
  if (!(restante > 0)) {
    pasar(raiz);
    cambios = true;
  } else if (restante < MAX_ESPERA) {
    window.setTimeout(() => {
      pasar(raiz);
      avisar();
    }, restante);
  }
}
if (cambios) avisar();
