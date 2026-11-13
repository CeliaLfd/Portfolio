/* ============================================
   PLAY VIDEO ONCE WHEN VISIBLE
   - prefers-reduced-motion: no autoplay, the poster stays
   - a play / pause button on each video (WCAG 2.2.2), except inside a link
     (home cards), where a button would be invalid HTML, and on [data-no-control]
============================================ */

// Autoplay blocked (browser policy, iOS Low Power Mode, user setting):
// swap the video for its still image (data-placeholder)
function showVideoPlaceholder(video) {
  const src = video.dataset.placeholder;
  if (!src) return;

  const img = new Image();
  img.alt = video.getAttribute('aria-label') || '';
  img.className = 'cs-video-placeholder';
  // Keep the bilingual label (lang.js stored the English one in data-label-en)
  if (video.dataset.labelFr) {
    img.dataset.altFr = video.dataset.labelFr;
    img.dataset.altEn = video.dataset.labelEn || img.alt;
  }
  // Keep the video if the image is missing
  img.onload = () => {
    video.parentElement?.querySelector('.video-control')?.remove();
    video.replaceWith(img);
  };
  img.src = src;
}

const CONTROL_HTML = `
  <svg class="video-control-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
  <svg class="video-control-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
  <span class="sr-only video-control-pause"><span class="en">Pause video</span><span class="fr">Mettre la vidéo en pause</span></span>
  <span class="sr-only video-control-play"><span class="en">Play video</span><span class="fr">Lire la vidéo</span></span>`;

function addControl(video) {
  // No button inside a link (invalid HTML), nor where the loop must stay bare (data-no-control)
  if (video.closest('a') || video.hasAttribute('data-no-control')) return;
  const box = video.parentElement;
  if (!box) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'video-control';
  btn.innerHTML = CONTROL_HTML;

  const sync = () => { btn.dataset.state = video.paused ? 'paused' : 'playing'; };
  ['play', 'pause', 'ended'].forEach((type) => video.addEventListener(type, sync));
  sync();

  btn.addEventListener('click', () => {
    if (video.paused) video.play()?.catch(() => {});
    else video.pause();
  });

  box.classList.add('has-video-control');
  box.append(btn);
}

export function initPlayOnView() {
  const videos = document.querySelectorAll('video[data-play-on-view]');
  if (!videos.length) return;

  videos.forEach(addControl);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videos.forEach((video) => {
      if (!video.poster && video.dataset.placeholder) video.poster = video.dataset.placeholder;
    });
    return;
  }

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
