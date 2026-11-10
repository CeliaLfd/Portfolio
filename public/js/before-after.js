/* ============================================
   BEFORE / AFTER SLIDER
   Pointer: follows the mouse / finger over the stage.
   Keyboard / screen readers: a visually hidden range input (WCAG 2.1.1).
============================================ */

export function initBeforeAfter() {
  document.querySelectorAll('[data-ba]').forEach(ba => {
    const stage  = ba.querySelector('.cs-ba-stage');
    const before = ba.querySelector('[data-ba-before]');
    const control = ba.querySelector('[data-ba-control]');
    const range = ba.querySelector('[data-ba-range]');
    if (!stage || !before) return;

    function setPct(pct) {
      pct = Math.max(6, Math.min(94, pct));
      before.style.width = pct + '%';
      if (range) range.value = Math.round(pct);
    }

    function onMove(e) {
      const rect = stage.getBoundingClientRect();
      setPct((e.clientX - rect.left) / rect.width * 100);
    }

    stage.addEventListener('pointermove', onMove);
    if (range) range.addEventListener('input', () => setPct(Number(range.value)));
    if (control) control.hidden = false;
    setPct(50);
  });
}
