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
    el.style.transitionDelay = (i * 0.02) + 's';
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
   TIMELINE (cards then arrows, one after the other)
============================================ */

function initTimeline() {
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

/* ============================================
   NEEDS LENS (Data Explorer: business / researcher view)
============================================ */

function initNeedsLens() {
  document.querySelectorAll('[data-needs]').forEach((block) => {
    const stage = block.querySelector('.cs-de-needs-stage');
    const cards = block.querySelectorAll('.cs-de-needs-card');
    if (!stage || !cards.length) return;

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

  titles.forEach((t) => io.observe(t));
}

/* ============================================
   USER INTERVIEWS (quotes arrive like messages)
============================================ */

function initInterviews() {
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

/* ============================================
   WORKSHOP STICKY NOTES (land one after the other)
============================================ */

function initWorkshopNotes() {
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

/* ============================================
   IMAGE VIEWER — src/components/ImageViewer.astro
   One <dialog> component for the case study lightbox and the workshop board.
   - button[data-viewer-open="id"] opens dialog#id
   - .cs-img img opens the shared lightbox (#imgModal), desktop only
   - [data-zoom] viewers: click to zoom, drag or scroll to pan
   - Esc, the close button or a click outside the image closes it
============================================ */

function setupViewer(dlg) {
  const stage = dlg.querySelector('[data-viewer-stage]');
  const img = dlg.querySelector('[data-viewer-img]');
  const zoomBtn = dlg.querySelector('[data-viewer-zoom]');
  const closeBtn = dlg.querySelector('[data-viewer-close]');
  const canZoom = dlg.hasAttribute('data-zoom');
  const fullWidth = Number(dlg.dataset.fullWidth) || 0;
  let zoomed = false;
  let fullRequested = false;

  // Zoom in: image at full size, the point (rx, ry) lands in the middle of the stage
  function setZoom(on, point = { rx: 0.5, ry: 0.5 }) {
    if (!canZoom) return;
    zoomed = on;
    dlg.classList.toggle('is-zoomed', on);
    zoomBtn.setAttribute('aria-pressed', String(on));
    if (!on) {
      img.style.width = '';
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
      return;
    }
    img.style.width = (fullWidth || img.naturalWidth) + 'px';
    if (!fullRequested && dlg.dataset.srcFull) {
      fullRequested = true; // full resolution, loaded on the first zoom only
      const hi = new Image();
      hi.onload = () => { img.src = hi.src; };
      hi.src = dlg.dataset.srcFull;
    }
    requestAnimationFrame(() => {
      stage.scrollLeft = point.rx * img.offsetWidth - stage.clientWidth / 2;
      stage.scrollTop = point.ry * img.offsetHeight - stage.clientHeight / 2;
    });
  }

  // A click toggles the zoom (or closes when outside the image);
  // a mouse drag pans, touch keeps native scrolling
  let press = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    press = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false, mouse: e.pointerType === 'mouse' };
    if (zoomed && press.mouse) stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!press) return;
    const dx = e.clientX - press.x;
    const dy = e.clientY - press.y;
    if (!press.moved && Math.hypot(dx, dy) > 5) {
      press.moved = true;
      if (zoomed && press.mouse) stage.classList.add('is-dragging');
    }
    if (press.moved && zoomed && press.mouse) {
      stage.scrollLeft = press.left - dx;
      stage.scrollTop = press.top - dy;
    }
  });
  stage.addEventListener('pointerup', (e) => {
    if (!press) return;
    const wasClick = !press.moved;
    press = null;
    stage.classList.remove('is-dragging');
    if (!wasClick) return;
    if (zoomed) { setZoom(false); return; }
    if (e.target !== img) { dlg.close(); return; }
    if (!canZoom) return;
    const r = img.getBoundingClientRect();
    setZoom(true, { rx: (e.clientX - r.left) / r.width, ry: (e.clientY - r.top) / r.height });
  });
  stage.addEventListener('pointercancel', () => {
    press = null;
    stage.classList.remove('is-dragging');
  });

  if (zoomBtn) zoomBtn.addEventListener('click', () => setZoom(!zoomed));
  closeBtn.addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    setZoom(false);
  });

  // Open with the default image, or with the one passed (lightbox)
  dlg.openViewer = ({ src, alt } = {}) => {
    if (src) {
      img.src = src;
      img.alt = alt || '';
    } else if (!img.getAttribute('src') && dlg.dataset.src) {
      img.src = dlg.dataset.src;
    }
    setZoom(false);
    dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
  };
}

function initViewers() {
  const viewers = document.querySelectorAll('[data-viewer]');
  if (!viewers.length || typeof viewers[0].showModal !== 'function') return;
  viewers.forEach(setupViewer);

  document.querySelectorAll('[data-viewer-open]').forEach((trigger) => {
    const dlg = document.getElementById(trigger.dataset.viewerOpen);
    if (dlg && dlg.openViewer) trigger.addEventListener('click', () => dlg.openViewer());
  });

  // Case study images open the shared lightbox, above the mobile breakpoint (--bp-mobile)
  const lightbox = document.getElementById('imgModal');
  if (!lightbox || !lightbox.openViewer) return;
  const bpMobile = getComputedStyle(document.documentElement)
    .getPropertyValue('--bp-mobile').trim() || '750px';
  const desktop = window.matchMedia('(min-width: ' + bpMobile + ')');
  document.querySelectorAll('.cs-img img').forEach((img) => {
    img.addEventListener('click', () => {
      if (!desktop.matches) return;
      lightbox.openViewer({ src: img.currentSrc || img.src, alt: img.alt });
    });
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
  initBeforeAfter();
  initSliderWheel();
  initScaleBand();
  initTimeline();
  initNeedsLens();
  initSubheadingHighlight();
  initInterviews();
  initWorkshopNotes();
  initViewers();
});
