/* ============================================
   SCALE BAND (2,000 → 10× → 20,000+)
============================================ */

export function initScaleBand() {
  const bands = document.querySelectorAll('[data-scale]');
  if (!bands.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function countUp(el, from, duration) {
    const target = Number(el.dataset.count);
    const fmt = new Intl.NumberFormat(el.dataset.locale || 'en-US');
    const suffix = el.dataset.suffix || '';
    const finalText = el.textContent;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (target - from) * ease(t));
      el.textContent = fmt.format(value).replace(/ /g, ' ') + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  function lightGrid(grid, delayStep) {
    grid.querySelectorAll('span.on').forEach((cell, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      cell.style.transitionDelay = `${(row + col) * delayStep}ms`;
      cell.classList.add('lit');
    });
  }

  bands.forEach((band) => {
    const before = band.querySelector('[data-side="before"]');
    const after = band.querySelector('[data-side="after"]');
    const x = band.querySelector('.cs-de-scale-x');

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();

      lightGrid(before.querySelector('.cs-de-scale-grid'), 40);
      before.querySelectorAll('[data-count]').forEach((el) => countUp(el, 0, 900));

      setTimeout(() => x.classList.add('lit'), 900);

      setTimeout(() => {
        lightGrid(after.querySelector('.cs-de-scale-grid'), 35);
        after.querySelectorAll('[data-count]').forEach((el) => countUp(el, 2000, 1300));
      }, 1300);
    }, { threshold: 0.4 });

    io.observe(band);
  });
}
