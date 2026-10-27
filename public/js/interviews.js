/* ============================================
   USER INTERVIEWS (quotes arrive like messages)
============================================ */

export function initInterviews() {
  const blocks = document.querySelectorAll('[data-interviews]');
  if (!blocks.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const multiCols = window.matchMedia('(min-width: 720px)');
  const STAGGER = 220; // offset between two cards (they overlap)
  const TYPING = 420;  // typing dots before the quote
  const UNFOLD = 300;  // quote shown before the takeaway unfolds

  function play(card, delay) {
    setTimeout(() => card.classList.add('is-in'), delay);
    setTimeout(() => card.classList.add('is-said'), delay + TYPING);
    setTimeout(() => card.classList.add('is-open'), delay + TYPING + UNFOLD);
  }

  blocks.forEach((block) => {
    const cards = [...block.querySelectorAll('.cs-de-quote')];

    if (multiCols.matches) {
      // Several cards per row: one staggered wave for the whole block
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        cards.forEach((card, i) => play(card, i * STAGGER));
      }, { rootMargin: '0px 0px -25% 0px' });
      io.observe(block);
    } else {
      // Stacked: each card plays when it reaches the screen
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          play(entry.target, 0);
        });
      }, { rootMargin: '0px 0px -15% 0px' });
      cards.forEach((card) => io.observe(card));
    }
  });
}
