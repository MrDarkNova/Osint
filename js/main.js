'use strict';

document.addEventListener('DOMContentLoaded', () => {
  Brand.init();
  Cursor.init();
  Tabs.init();

  document.getElementById('phoneInput').addEventListener('keydown',    e => { if (e.key === 'Enter') Scanner.phone(); });
  document.getElementById('emailInput').addEventListener('keydown',    e => { if (e.key === 'Enter') Scanner.email(); });
  document.getElementById('ipInput').addEventListener('keydown',       e => { if (e.key === 'Enter') Scanner.ip(); });
  document.getElementById('usernameInput').addEventListener('keydown', e => { if (e.key === 'Enter') Scanner.username(); });
});
