/* ============================================
   BEFORE / AFTER SLIDER
============================================ */

export function initBeforeAfter() {
  document.querySelectorAll('[data-ba]').forEach(ba => {
    const stage  = ba.querySelector('.cs-ba-stage');
    const before = ba.querySelector('[data-ba-before]');
    if (!stage || !before) return;

    function setPct(pct) {
      pct = Math.max(6, Math.min(94, pct));
      before.style.width = pct + '%';
    }

    function onMove(e) {
      const rect = stage.getBoundingClientRect();
      setPct((e.clientX - rect.left) / rect.width * 100);
    }

    stage.addEventListener('pointermove', onMove);
    setPct(50);
  });
}
