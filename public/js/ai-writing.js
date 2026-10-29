/* ============================================
   AI WRITING (AI assistant page: "case study in progress")
   Types a phrase, pauses, erases it, moves to the next one.
   Phrases come from data-phrases-en / data-phrases-fr, in the current language.
============================================ */

export function initAiWriting() {
  const blocks = document.querySelectorAll('[data-ai-writing]');
  if (!blocks.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  blocks.forEach((block) => {
    const target = block.querySelector('[data-ai-writing-text]');
    if (!target) return;

    const phrases = (lang) => {
      try { return JSON.parse(block.dataset[lang === 'fr' ? 'phrasesFr' : 'phrasesEn']); }
      catch { return []; }
    };
    const lang = () => (document.body.classList.contains('lang-fr') ? 'fr' : 'en');
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    let running = false;

    // Start from an empty field: the static fallback text (no JS / reduced motion)
    // must not show up first and then vanish when typing begins
    target.textContent = '';

    async function loop() {
      running = true;
      block.classList.add('is-typing');
      let i = 0;
      while (true) {
        const list = phrases(lang());
        if (!list.length) return;
        const text = `${list[i % list.length]}…`;
        for (let n = 1; n <= text.length; n++) {
          target.textContent = text.slice(0, n);
          await wait(45);
        }
        block.classList.add('is-generating');
        await wait(2200);
        block.classList.remove('is-generating');
        for (let n = text.length; n >= 0; n--) {
          target.textContent = text.slice(0, n);
          await wait(18);
        }
        await wait(300);
        i++;
      }
    }

    // Start once the block is on screen
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || running) return;
      io.disconnect();
      loop();
    }, { threshold: 0.4 });
    io.observe(block);
  });
}
