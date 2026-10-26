/* ============================================
   THEME TOGGLE
============================================ */

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');

  document.querySelectorAll('.footer-theme button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  localStorage.setItem('portfolio-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'light';
  setTheme(saved);
}

/* ============================================
   LANGUAGE TOGGLE
============================================ */

function setLang(lang) {
  document.body.className = document.body.className
    .replace(/lang-(en|fr)/g, '')
    .trim() + ' lang-' + lang;

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('portfolio-lang', lang);
}

function initLang() {
  const saved = localStorage.getItem('portfolio-lang') || 'en';
  setLang(saved);
}

/* ============================================
   SCROLL REVEAL
============================================ */

function initReveal() {
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
    el.style.transitionDelay = (i * 0.03) + 's';
    observer.observe(el);
  });
}

/* ============================================
   PLAY VIDEO ONCE WHEN VISIBLE
============================================ */

// Autoplay blocked (browser policy, iOS Low Power Mode, user setting):
// swap the video for its still image (data-placeholder)
function showVideoPlaceholder(video) {
  const src = video.dataset.placeholder;
  if (!src) return;

  const img = new Image();
  img.alt = video.getAttribute('aria-label') || '';
  img.className = 'cs-video-placeholder';
  // Keep the video if the image is missing
  img.onload = () => video.replaceWith(img);
  img.src = src;
}

function initPlayOnView() {
  const videos = document.querySelectorAll('video[data-play-on-view]');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const attempt = video.play();
        if (attempt) attempt.catch(() => showVideoPlaceholder(video));
        observer.unobserve(video);
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => observer.observe(video));
}

/* ============================================
   IMAGE LIGHTBOX
============================================ */

function initLightbox() {
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const closeBtn = document.getElementById('imgModalClose');
  if (!modal) return;

  function open(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // No lightbox below the mobile breakpoint (--bp-mobile)
  const bpMobile = getComputedStyle(document.documentElement)
    .getPropertyValue('--bp-mobile').trim() || '750px';
  const desktop = window.matchMedia('(min-width: ' + bpMobile + ')');

  document.querySelectorAll('.cs-img img').forEach(img => {
    img.addEventListener('click', () => {
      if (!desktop.matches) return;
      open(img.src, img.alt);
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ============================================
   CUSTOM CURSOR — CASE STUDY CARDS
============================================ */

function initCardCursor() {
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

/* ============================================
   BEFORE / AFTER SLIDER
============================================ */

function initBeforeAfter() {
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

/* ============================================
   MOBILE SLIDER — MOUSE WHEEL (desktop only)
   Vertical wheel → one item left/right.
   Horizontal trackpad gestures stay native.
============================================ */

function initSliderWheel() {
  const sliders = document.querySelectorAll('[data-slider-mobile]');
  if (!sliders.length) return;

  // Mouse/trackpad devices only — touch screens keep native swipe
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smoothSupported = 'scrollBehavior' in document.documentElement.style;
  const LOCK_MS = 450;

  sliders.forEach(slider => {
    let locked = false;

    slider.addEventListener('wheel', e => {
      if (!desktop.matches) return;
      // Not a slider at this width (CSS not applied or nothing overflows)
      if (slider.scrollWidth <= slider.clientWidth) return;
      // Let native horizontal scroll (trackpad, shift+wheel) do its job
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const max = slider.scrollWidth - slider.clientWidth;
      const atStart = slider.scrollLeft <= 1;
      const atEnd = slider.scrollLeft >= max - 1;

      // At the edges, give the wheel back to the page
      if ((dir < 0 && atStart) || (dir > 0 && atEnd)) return;

      e.preventDefault();
      if (locked) return;
      locked = true;
      setTimeout(() => { locked = false; }, LOCK_MS);

      const first = slider.firstElementChild;
      const second = first && first.nextElementSibling;
      const step = second ? second.offsetLeft - first.offsetLeft : slider.clientWidth * 0.9;

      if (smoothSupported && !reduceMotion.matches) {
        slider.scrollBy({ left: dir * step, behavior: 'smooth' });
      } else {
        slider.scrollLeft += dir * step;
      }
    }, { passive: false });
  });
}

/* ============================================
   SCALE BAND (2,000 → 10× → 20,000+)
============================================ */

function initScaleBand() {
  const bands = document.querySelectorAll('[data-scale]');
  if (!bands.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function countUp(el, from, duration) {
    const target = Number(el.dataset.count);
    const fmt = new Intl.NumberFormat(el.dataset.locale || 'en-US');
    const suffix = el.dataset.suffix || '';
    const finalText = el.textContent;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (target - from) * ease(t));
      el.textContent = fmt.format(value).replace(/ /g, ' ') + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  function lightGrid(grid, delayStep) {
    grid.querySelectorAll('span.on').forEach((cell, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      cell.style.transitionDelay = `${(row + col) * delayStep}ms`;
      cell.classList.add('lit');
    });
  }

  bands.forEach((band) => {
    const before = band.querySelector('[data-side="before"]');
    const after = band.querySelector('[data-side="after"]');
    const x = band.querySelector('.cs-de-scale-x');
    band.classList.add('is-armed');

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();

      lightGrid(before.querySelector('.cs-de-scale-grid'), 40);
      before.querySelectorAll('[data-count]').forEach((el) => countUp(el, 0, 900));

      setTimeout(() => x.classList.add('lit'), 900);

      setTimeout(() => {
        lightGrid(after.querySelector('.cs-de-scale-grid'), 35);
        after.querySelectorAll('[data-count]').forEach((el) => countUp(el, 2000, 1300));
      }, 1300);
    }, { threshold: 0.4 });

    io.observe(band);
  });
}


/* ============================================
   NEEDS LENS (Data Explorer: business / researcher view)
============================================ */

function initNeedsLens() {
  document.querySelectorAll('[data-needs]').forEach((block) => {
    const stage = block.querySelector('.cs-de-needs-stage');
    const cards = block.querySelectorAll('.cs-de-needs-card');
    if (!stage || !cards.length) return;

    block.classList.add('is-js');

    function set(need) {
      stage.dataset.active = need;
      cards.forEach((c) => c.classList.toggle('is-active', c.dataset.need === need));
    }

    cards.forEach((c) => c.addEventListener('click', () => set(c.dataset.need)));

    // First lens lights up when the screenshot comes into view
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) { set('business'); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (!stage.dataset.active) set('business');
    }, { threshold: 0.5 });
    io.observe(stage);
  });
}

/* ============================================
   SUBHEADING HIGHLIGHT (marker drawn on scroll)
============================================ */

function initSubheadingHighlight() {
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

  titles.forEach((t) => {
    t.classList.add('hl-armed');
    io.observe(t);
  });
}

/* ============================================
   INIT
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initReveal();
  initPlayOnView();
  initCardCursor();
  initLightbox();
  initBeforeAfter();
  initSliderWheel();
  initScaleBand();
  initNeedsLens();
  initSubheadingHighlight();
});
