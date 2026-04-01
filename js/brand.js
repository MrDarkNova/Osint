'use strict';

const Brand = (() => {
  const enforce = () => {
    const { name, sub, footer, footerSub, watermark, title } = CONFIG.brand;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && el.textContent !== val) el.textContent = val;
    };
    set('brandName', name);
    set('brandSub', sub);
    set('footerName', footer);
    set('footerSub', footerSub);
    set('watermark', watermark);
    if (document.title !== title) document.title = title;
  };

  const init = () => {
    enforce();
    setInterval(enforce, 500);
    new MutationObserver(enforce).observe(document.documentElement, {
      childList: true, subtree: true,
      characterData: true, attributes: true,
    });
    try {
      Object.defineProperty(document, 'title', {
        set() { return CONFIG.brand.title; },
        get() { return CONFIG.brand.title; },
      });
    } catch(_) {}
  };

  return { init };
})();
