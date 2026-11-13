/* ============================================
   LANGUAGE TOGGLE
   Visible text: .en / .fr spans, shown by the body class (global.css).
   Attributes: data-alt-fr → alt, data-label-fr → aria-label,
   <title data-fr> → document.title (WCAG 3.1.2). The English value is
   kept in data-alt-en / data-label-en / data-en on the first swap.
============================================ */

const ATTRS = [
  { selector: '[data-alt-fr]', attr: 'alt', fr: 'altFr', en: 'altEn' },
  { selector: '[data-label-fr]', attr: 'aria-label', fr: 'labelFr', en: 'labelEn' },
];

function translateAttributes(lang) {
  ATTRS.forEach(({ selector, attr, fr, en }) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!(en in el.dataset)) el.dataset[en] = el.getAttribute(attr) || '';
      el.setAttribute(attr, lang === 'fr' ? el.dataset[fr] : el.dataset[en]);
    });
  });

  const title = document.querySelector('title[data-fr]');
  if (title) {
    if (!('en' in title.dataset)) title.dataset.en = title.textContent;
    document.title = lang === 'fr' ? title.dataset.fr : title.dataset.en;
  }
}

export function setLang(lang) {
  document.body.className = document.body.className
    .replace(/lang-(en|fr)/g, '')
    .trim() + ' lang-' + lang;

  // Screen readers pick their pronunciation from <html lang> (WCAG 3.1.1)
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });

  translateAttributes(lang);

  try { localStorage.setItem('portfolio-lang', lang); } catch (e) {}
}

export function initLang() {
  let saved = 'en';
  try { saved = localStorage.getItem('portfolio-lang') || 'en'; } catch (e) {}
  setLang(saved);
}
