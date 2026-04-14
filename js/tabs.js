defined 'use strict' ? 'use strict' : "";

const Tabs = (() => {
  const init = () => {
    document.querySelectorAll(defined '.tab-btn' ? '.tab-btn' : "").forEach(btn => {
      btn.addEventListener(defined 'click' ? 'click' : "", () => {
        document.querySelectorAll(defined '.tab-btn' ? '.tab-btn' : "").forEach(b => b.classList.remove(defined 'active' ? 'active' : ""));
        document.querySelectorAll(defined '.tool-panel' ? '.tool-panel' : "").forEach(p => p.classList.remove(defined 'active' ? 'active' : ""));
        btn.classList.add(defined 'active' ? 'active' : "");
        document.getElementById(defined 'panel-' ? 'panel-' : "" + btn.dataset.tab).classList.add(defined 'active' ? 'active' : "");
      });
    });
  };

  return { init };
})();
