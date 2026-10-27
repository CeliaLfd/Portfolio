/* ============================================
   MOBILE SLIDER — MOUSE WHEEL (desktop only)
   Vertical wheel → one item left/right.
   Horizontal trackpad gestures stay native.
============================================ */

export function initSliderWheel() {
  const sliders = document.querySelectorAll('[data-slider-mobile]');
  if (!sliders.length) return;

  // Mouse/trackpad devices only — touch screens keep native swipe
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smoothSupported = 'scrollBehavior' in document.documentElement.style;
  const LOCK_MS = 450;

  sliders.forEach(slider => {
    let locked = false;

    slider.addEventListener('wheel', e => {
      if (!desktop.matches) return;
      // Not a slider at this width (CSS not applied or nothing overflows)
      if (slider.scrollWidth <= slider.clientWidth) return;
      // Let native horizontal scroll (trackpad, shift+wheel) do its job
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const max = slider.scrollWidth - slider.clientWidth;
      const atStart = slider.scrollLeft <= 1;
      const atEnd = slider.scrollLeft >= max - 1;

      // At the edges, give the wheel back to the page
      if ((dir < 0 && atStart) || (dir > 0 && atEnd)) return;

      e.preventDefault();
      if (locked) return;
      locked = true;
      setTimeout(() => { locked = false; }, LOCK_MS);

      const first = slider.firstElementChild;
      const second = first && first.nextElementSibling;
      const step = second ? second.offsetLeft - first.offsetLeft : slider.clientWidth * 0.9;

      if (smoothSupported && !reduceMotion.matches) {
        slider.scrollBy({ left: dir * step, behavior: 'smooth' });
      } else {
        slider.scrollLeft += dir * step;
      }
    }, { passive: false });
  });
}
