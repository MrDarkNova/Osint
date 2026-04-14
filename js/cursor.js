'use strict';

const Cursor = (() => {
  let mx = 0, my = 0, rx = 0, ry = 0;

  const init = () => {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });

    (function track() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(track);
    })();

    document.querySelectorAll('a,button,.tab-btn,.result-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = 'var(--accent2)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'var(--accent)';
      });
    });
  };

  return { init };
})();
