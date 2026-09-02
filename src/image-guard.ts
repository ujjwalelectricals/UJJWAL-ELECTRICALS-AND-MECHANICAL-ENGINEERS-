const FALLBACK = `${import.meta.env.BASE_URL}product-image-fallback.svg`;

let installed = false;

export function installImageGuard() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.imageFallback === 'true') return;

    target.dataset.imageFallback = 'true';
    target.src = FALLBACK;
    target.removeAttribute('srcset');
  }, true);
}
