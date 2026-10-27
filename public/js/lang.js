/* ============================================
   LANGUAGE TOGGLE
============================================ */

export function setLang(lang) {
  document.body.className = document.body.className
    .replace(/lang-(en|fr)/g, '')
    .trim() + ' lang-' + lang;

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('portfolio-lang', lang);
}

export function initLang() {
  const saved = localStorage.getItem('portfolio-lang') || 'en';
  setLang(saved);
}
