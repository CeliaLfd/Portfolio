/* ============================================
   LANGUAGE TOGGLE
============================================ */

export function setLang(lang) {
  document.body.className = document.body.className
    .replace(/lang-(en|fr)/g, '')
    .trim() + ' lang-' + lang;

  // Screen readers pick their pronunciation from <html lang> (WCAG 3.1.1)
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });

  try { localStorage.setItem('portfolio-lang', lang); } catch (e) {}
}

export function initLang() {
  let saved = 'en';
  try { saved = localStorage.getItem('portfolio-lang') || 'en'; } catch (e) {}
  setLang(saved);
}
