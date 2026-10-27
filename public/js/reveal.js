/* ============================================
   SCROLL REVEAL
============================================ */

export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.02) + 's';
    observer.observe(el);
  });
}
