'use strict';

const CONFIG = Object.freeze({
  brand: {
    name:      'MR. DARKNOVA',
    sub:       'OSINT INTELLIGENCE — VICTOR KUMBA',
    footer:    'MR. DARKNOVA',
    footerSub: 'VICTOR KUMBA',
    watermark: 'MR. DARKNOVA — VICTOR KUMBA',
    title:     'DarkNova OSINT — Intelligence Dashboard',
  },
  keys: {
    phone: '806ca95ed1c74ed2a7d9214ef12a4207',
    email: '59fa3545c0c74a9388c5c98145b45f29',
    ip:    '0e7d493a6d74432780206b201ced3ad1',
  },
  proxies: [
    u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ],
});
