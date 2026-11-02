/* ============================================
   IMAGE VIEWER — src/components/ImageViewer.astro
   One <dialog> component for the case study lightbox and the workshop board.
   - button[data-viewer-open="id"] opens dialog#id
   - .cs-img img opens the shared lightbox (#imgModal), desktop only
   - [data-zoom] viewers: click to zoom, drag or scroll to pan
   - Esc, the close button or a click outside the image closes it
============================================ */

function setupViewer(dlg) {
  const stage = dlg.querySelector('[data-viewer-stage]');
  const img = dlg.querySelector('[data-viewer-img]');
  const zoomBtn = dlg.querySelector('[data-viewer-zoom]');
  const closeBtn = dlg.querySelector('[data-viewer-close]');
  const canZoom = dlg.hasAttribute('data-zoom');
  const fullWidth = Number(dlg.dataset.fullWidth) || 0;
  let zoomed = false;
  let fullRequested = false;

  // Zoom in: image at full size, the point (rx, ry) lands in the middle of the stage
  function setZoom(on, point = { rx: 0.5, ry: 0.5 }) {
    if (!canZoom) return;
    zoomed = on;
    dlg.classList.toggle('is-zoomed', on);
    zoomBtn.setAttribute('aria-pressed', String(on));
    if (!on) {
      img.style.width = '';
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
      return;
    }
    img.style.width = (fullWidth || img.naturalWidth) + 'px';
    if (!fullRequested && dlg.dataset.srcFull) {
      fullRequested = true; // full resolution, loaded on the first zoom only
      const hi = new Image();
      hi.onload = () => { img.src = hi.src; };
      hi.src = dlg.dataset.srcFull;
    }
    requestAnimationFrame(() => {
      stage.scrollLeft = point.rx * img.offsetWidth - stage.clientWidth / 2;
      stage.scrollTop = point.ry * img.offsetHeight - stage.clientHeight / 2;
    });
  }

  // A click toggles the zoom (or closes when outside the image);
  // a mouse drag pans, touch keeps native scrolling
  let press = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    press = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false, mouse: e.pointerType === 'mouse' };
    if (zoomed && press.mouse) stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!press) return;
    const dx = e.clientX - press.x;
    const dy = e.clientY - press.y;
    if (!press.moved && Math.hypot(dx, dy) > 5) {
      press.moved = true;
      if (zoomed && press.mouse) stage.classList.add('is-dragging');
    }
    if (press.moved && zoomed && press.mouse) {
      stage.scrollLeft = press.left - dx;
      stage.scrollTop = press.top - dy;
    }
  });
  stage.addEventListener('pointerup', (e) => {
    if (!press) return;
    const wasClick = !press.moved;
    press = null;
    stage.classList.remove('is-dragging');
    if (!wasClick) return;
    if (zoomed) { setZoom(false); return; }
    if (e.target !== img) { dlg.close(); return; }
    if (!canZoom) return;
    const r = img.getBoundingClientRect();
    setZoom(true, { rx: (e.clientX - r.left) / r.width, ry: (e.clientY - r.top) / r.height });
  });
  stage.addEventListener('pointercancel', () => {
    press = null;
    stage.classList.remove('is-dragging');
  });

  if (zoomBtn) zoomBtn.addEventListener('click', () => setZoom(!zoomed));
  closeBtn.addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    setZoom(false);
  });

  // Open with the default image, or with the one passed (lightbox)
  dlg.openViewer = ({ src, alt } = {}) => {
    if (src) {
      // New image: hidden until loaded, so the previous one never flashes
      if (img.getAttribute('src') !== src) {
        img.style.visibility = 'hidden';
        img.onload = img.onerror = () => { img.style.visibility = ''; };
        img.src = src;
      }
      img.alt = alt || '';
    } else if (!img.getAttribute('src') && dlg.dataset.src) {
      img.src = dlg.dataset.src;
    }
    setZoom(false);
    dlg.showModal();
    dlg.focus(); // focus on the dialog itself, not the close button (no focus ring on open)
    document.documentElement.style.overflow = 'hidden';
  };
}

export function initViewers() {
  const viewers = document.querySelectorAll('[data-viewer]');
  if (!viewers.length || typeof viewers[0].showModal !== 'function') return;
  viewers.forEach(setupViewer);

  document.querySelectorAll('[data-viewer-open]').forEach((trigger) => {
    const dlg = document.getElementById(trigger.dataset.viewerOpen);
    if (dlg && dlg.openViewer) trigger.addEventListener('click', () => dlg.openViewer());
  });

  // Case study images open the shared lightbox, above the mobile breakpoint (--bp-mobile)
  const lightbox = document.getElementById('imgModal');
  if (!lightbox || !lightbox.openViewer) return;
  const bpMobile = getComputedStyle(document.documentElement)
    .getPropertyValue('--bp-mobile').trim() || '750px';
  const desktop = window.matchMedia('(min-width: ' + bpMobile + ')');
  // [data-lightbox] images (e.g. /fun photos) too; data-full = larger version for the lightbox
  document.querySelectorAll('.cs-img img, img[data-lightbox]').forEach((img) => {
    img.addEventListener('click', () => {
      if (!desktop.matches) return;
      lightbox.openViewer({ src: img.dataset.full || img.currentSrc || img.src, alt: img.alt });
    });
  });
}
