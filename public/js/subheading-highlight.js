/* ============================================
   SUBHEADING HIGHLIGHT (marker drawn on scroll)
============================================ */

export function initSubheadingHighlight() {
  const titles = document.querySelectorAll('.cs-subsection-subheading');
  if (!titles.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-lit');
      io.unobserve(entry.target);
    });
  }, { threshold: 1, rootMargin: '0px 0px -15% 0px' });

  titles.forEach((t) => io.observe(t));
}
