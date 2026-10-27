/* ============================================
   TIMELINE (cards then arrows, one after the other)
============================================ */

export function initTimeline() {
  const timelines = document.querySelectorAll('[data-timeline]');
  if (!timelines.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  timelines.forEach((timeline) => {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      timeline.classList.add('is-in');
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(timeline);
  });
}
