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

export function initPlayOnView() {
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
