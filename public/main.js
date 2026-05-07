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
  }, { threshold: 0.08 });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.05) + 's';
    observer.observe(el);
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
});
