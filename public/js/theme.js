/* ============================================
   THEME TOGGLE
============================================ */

export function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');

  document.querySelectorAll('.footer-theme button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  localStorage.setItem('portfolio-theme', theme);
}

export function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'light';
  setTheme(saved);
}
