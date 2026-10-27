/* ============================================
   NEEDS LENS (Data Explorer: business / researcher view)
============================================ */

export function initNeedsLens() {
  document.querySelectorAll('[data-needs]').forEach((block) => {
    const stage = block.querySelector('.cs-de-needs-stage');
    const cards = block.querySelectorAll('.cs-de-needs-card');
    if (!stage || !cards.length) return;

    function set(need) {
      stage.dataset.active = need;
      cards.forEach((c) => c.classList.toggle('is-active', c.dataset.need === need));
    }

    cards.forEach((c) => c.addEventListener('click', () => set(c.dataset.need)));

    // First lens lights up when the screenshot comes into view
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) { set('business'); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (!stage.dataset.active) set('business');
    }, { threshold: 0.5 });
    io.observe(stage);
  });
}
