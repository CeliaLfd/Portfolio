/* ============================================
   ENTRY POINT — loaded as a module by src/layouts/Layout.astro
   One file per concept in this folder.
============================================ */

import { setTheme, initTheme } from './theme.js';
import { setLang, initLang } from './lang.js';
import { initReveal } from './reveal.js';
import { initPlayOnView } from './play-on-view.js';
import { initCardCursor } from './card-cursor.js';
import { initBeforeAfter } from './before-after.js';
import { initSliderWheel } from './slider-wheel.js';
import { initScaleBand } from './scale-band.js';
import { initTimeline } from './timeline.js';
import { initNeedsLens } from './needs-lens.js';
import { initSubheadingHighlight } from './subheading-highlight.js';
import { initInterviews } from './interviews.js';
import { initWorkshopNotes } from './workshop-notes.js';
import { initViewers } from './image-viewer.js';

// Called from onclick attributes (Footer.astro, Header.astro)
window.setTheme = setTheme;
window.setLang = setLang;

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
