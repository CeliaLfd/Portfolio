/* ============================================
   AUDIT TOUR (Design System: the 2022 analysis flow, screen by screen)
   Arrows move between screens; pins and notes move the spotlight.
============================================ */

export function initAuditTour() {
  document.querySelectorAll('[data-tour]').forEach((tour) => {
    const screens = [...tour.querySelectorAll('[data-tour-screen]')];
    if (!screens.length) return;

    const prev = tour.querySelector('[data-tour-prev]');
    const next = tour.querySelector('[data-tour-next]');
    const current = tour.querySelector('[data-tour-current]');
    const segments = [...tour.querySelectorAll('[data-tour-step]')];
    let index = 0;

    function light(screen, k) {
      const shot = screen.querySelector('.cs-ds-tour-shot');
      const notes = screen.querySelectorAll('[data-tour-note]');
      const pins = screen.querySelectorAll('[data-tour-pin]');
      const note = notes[k];
      if (!shot || !note) return;

      const [l, t, w, h] = note.dataset.spot.split(' ');
      shot.style.setProperty('--spot-l', `${l}%`);
      shot.style.setProperty('--spot-t', `${t}%`);
      shot.style.setProperty('--spot-w', `${w}%`);
      shot.style.setProperty('--spot-h', `${h}%`);
      shot.dataset.active = k;

      notes.forEach((n, j) => {
        n.classList.toggle('is-active', j === k);
        n.setAttribute('aria-pressed', j === k ? 'true' : 'false');
      });
      pins.forEach((p, j) => {
        p.classList.toggle('is-active', j === k);
        p.setAttribute('aria-pressed', j === k ? 'true' : 'false');
      });
    }

    function show(i) {
      if (i < 0 || i >= screens.length || i === index) return;
      tour.style.setProperty('--tour-dir', i > index ? '16px' : '-16px');
      tour.classList.add('is-moving');
      index = i;
      screens.forEach((s, j) => s.classList.toggle('is-active', j === i));
      segments.forEach((s, j) => {
        s.classList.toggle('is-done', j <= i);
        if (j === i) s.setAttribute('aria-current', 'step');
        else s.removeAttribute('aria-current');
      });
      update();
      light(screens[i], 0);
    }

    function update() {
      if (current) current.textContent = index + 1;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === screens.length - 1;
    }

    screens.forEach((screen) => {
      screen.querySelectorAll('[data-tour-note]').forEach((n) => {
        n.addEventListener('click', () => light(screen, Number(n.dataset.tourNote)));
      });
      screen.querySelectorAll('[data-tour-pin]').forEach((p) => {
        p.addEventListener('click', () => light(screen, Number(p.dataset.tourPin)));
      });
    });

    // Timeline: jump straight to any screen
    segments.forEach((s) => {
      s.addEventListener('click', () => show(Number(s.dataset.tourStep)));
    });

    prev?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));

    // Left / right arrow keys while focus is inside the tour
    tour.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });

    update();

    // First spotlight lights up when the screenshot comes into view
    const first = screens[0];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) { light(first, 0); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (index === 0 && !first.querySelector('.cs-ds-tour-shot').dataset.active) light(first, 0);
    }, { threshold: 0.5 });
    io.observe(first.querySelector('.cs-ds-tour-shot'));
  });
}
