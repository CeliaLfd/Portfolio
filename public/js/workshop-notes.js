/* ============================================
   WORKSHOP STICKY NOTES (land one after the other)
============================================ */

export function initWorkshopNotes() {
  const groups = document.querySelectorAll('[data-notes]');
  if (!groups.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  groups.forEach((group) => {
    const count = group.children.length;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      group.classList.add('is-in');
      // after the last note has landed, drop the stagger delay for hover
      setTimeout(() => group.classList.add('is-settled'), count * 140 + 600);
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(group);
  });
}
