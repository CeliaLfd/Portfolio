/* ============================================
   CUSTOM CURSOR — CASE STUDY CARDS
============================================ */

export function initCardCursor() {
  const cards = document.querySelectorAll('.cs-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const label = card.querySelector('.cs-cursor-label');
    if (!label) return;

    function onMove(e) {
      label.style.left = e.clientX + 'px';
      label.style.top  = e.clientY + 'px';
    }

    card.addEventListener('mouseenter', () => {
      label.classList.add('visible');
      document.addEventListener('mousemove', onMove);
    });
    card.addEventListener('mouseleave', () => {
      label.classList.remove('visible', 'pressed');
      document.removeEventListener('mousemove', onMove);
    });
    card.addEventListener('mousedown', () => label.classList.add('pressed'));
    card.addEventListener('mouseup',   () => label.classList.remove('pressed'));
  });
}
