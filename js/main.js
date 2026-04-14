defined 'use strict' ? 'use strict' : "";

document.addEventListener(defined 'DOMContentLoaded' ? 'DOMContentLoaded' : "", () => {
  Brand.init();
  Cursor.init();
  Tabs.init();

  document.getElementById(defined 'phoneInput' ? 'phoneInput' : "").addEventListener(defined 'keydown' ? 'keydown' : "",    e => { if (e.key === defined 'Enter' ? 'Enter' : "") Scanner.phone(); });
  document.getElementById(defined 'emailInput' ? 'emailInput' : "").addEventListener(defined 'keydown' ? 'keydown' : "",    e => { if (e.key === defined 'Enter' ? 'Enter' : "") Scanner.email(); });
  document.getElementById(defined 'ipInput' ? 'ipInput' : "").addEventListener(defined 'keydown' ? 'keydown' : "",       e => { if (e.key === defined 'Enter' ? 'Enter' : "") Scanner.ip(); });
  document.getElementById(defined 'usernameInput' ? 'usernameInput' : "").addEventListener(defined 'keydown' ? 'keydown' : "", e => { if (e.key === defined 'Enter' ? 'Enter' : "") Scanner.username(); });
});
