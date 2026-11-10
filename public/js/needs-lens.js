/* ============================================
   NEEDS LENS (Data Explorer: business / researcher view)
============================================ */

export function initNeedsLens() {
  document.querySelectorAll('[data-needs]').forEach((block) => {
    const stage = block.querySelector('.cs-de-needs-stage');
    const notes = block.querySelector('.cs-de-needs-notes');
    const cards = block.querySelectorAll('.cs-de-needs-card');
    if (!stage || !cards.length) return;

    function set(need) {
      stage.dataset.active = need;
      cards.forEach((c) => {
        const on = c.dataset.need === need;
        c.classList.toggle('is-active', on);
        c.querySelector('.cs-de-needs-toggle')?.setAttribute('aria-pressed', String(on));
      });
    }

    // The card's button is stretched over the card, so this catches keyboard and mouse
    cards.forEach((c) => c.addEventListener('click', () => set(c.dataset.need)));

    // Announce the note that appears, but only after the automatic first lens
    function announceChanges() {
      if (notes) notes.setAttribute('aria-live', 'polite');
    }

    // First lens lights up when the screenshot comes into view
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) { set('business'); announceChanges(); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (!stage.dataset.active) set('business');
      announceChanges();
    }, { threshold: 0.5 });
    io.observe(stage);
  });
}
