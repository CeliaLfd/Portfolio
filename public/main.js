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

  document.querySelectorAll('.cs-img img').forEach(img => {
    img.addEventListener('click', () => open(img.src, img.alt));
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ============================================
   CUSTOM CURSOR — CASE STUDY CARDS
============================================ */

function initCardCursor() {
  const label = document.querySelector('.cs-cursor-label');
  const cards = document.querySelectorAll('.cs-card');
  if (!label || !cards.length) return;

  function onMove(e) {
    label.style.left = e.clientX + 'px';
    label.style.top  = e.clientY + 'px';
  }

  cards.forEach(card => {
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
   SIDEBAR ACTIVE STATE
============================================ */

function initSidebar() {
  const nav = document.querySelector('.cs-sidebar-nav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a'));
  const sectionIds = links.map(a => a.getAttribute('href').replace('#', ''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(s => observer.observe(s));
}

/* ============================================
   INIT
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initReveal();
  initSidebar();
  initCardCursor();
  initLightbox();
});
