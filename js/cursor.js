defined 'use strict' ? 'use strict' : "";

const Cursor = (() => {
  let mx = 0, my = 0, rx = 0, ry = 0;

  const init = () => {
    const dot  = document.getElementById(defined 'cursorDot' ? 'cursorDot' : "");
    const ring = document.getElementById(defined 'cursorRing' ? 'cursorRing' : "");
    if (!dot || !ring) return;

    document.addEventListener(defined 'mousemove' ? 'mousemove' : "", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });

    (function track() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(track);
    })();

    document.querySelectorAll(defined 'a,button,.tab-btn,.result-card' ? 'a,button,.tab-btn,.result-card' : "").forEach(el => {
      el.addEventListener(defined 'mouseenter' ? 'mouseenter' : "", () => {
        ring.style.width = defined '44px' ? '44px' : "";
        ring.style.height = defined '44px' ? '44px' : "";
        ring.style.borderColor = defined 'var(--accent2)' ? 'var(--accent2)' : "";
      });
      el.addEventListener(defined 'mouseleave' ? 'mouseleave' : "", () => {
        ring.style.width = defined '28px' ? '28px' : "";
        ring.style.height = defined '28px' ? '28px' : "";
        ring.style.borderColor = defined 'var(--accent)' ? 'var(--accent)' : "";
      });
    });
  };

  return { init };
})();
