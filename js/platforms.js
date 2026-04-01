'use strict';

const Platforms = (() => {
  const LIST = [
    {
      name: 'GitHub', url: 'https://github.com/{u}', color: '#6e40c9', abbr: 'GH',
      api: u => `https://api.github.com/users/${u}`,
      apiCheck: d => !!d.login,
    },
    {
      name: 'Dev.to', url: 'https://dev.to/{u}', color: '#0a0a0a', abbr: 'DV',
      api: u => `https://dev.to/api/users/by_username?url=${u}`,
      apiCheck: d => !!d.username,
    },
    {
      name: 'HackerNews', url: 'https://news.ycombinator.com/user?id={u}', color: '#ff6600', abbr: 'HN',
      api: u => `https://hacker-news.firebaseio.com/v0/user/${u}.json`,
      apiCheck: d => d !== null && !!d.id,
    },
    {
      name: 'Keybase', url: 'https://keybase.io/{u}', color: '#33a0ff', abbr: 'KB',
      api: u => `https://keybase.io/_/api/1.0/user/lookup.json?usernames=${u}`,
      apiCheck: d => d.them && d.them.length > 0 && !!d.them[0].id,
    },
    { name:'Twitter/X',  url:'https://twitter.com/{u}',            color:'#1da1f2', abbr:'TW', notFound:["this account doesn't exist",'account suspended',"page doesn't exist"] },
    { name:'Instagram',  url:'https://instagram.com/{u}',          color:'#e1306c', abbr:'IG', notFound:['sorry, this page','page not found',"isn't available"] },
    { name:'TikTok',     url:'https://tiktok.com/@{u}',            color:'#ff0050', abbr:'TT', notFound:["couldn't find this account",'page not available'] },
    { name:'Reddit',     url:'https://www.reddit.com/user/{u}/about.json', color:'#ff4500', abbr:'RD', notFound:['user not found','page not found','404'] },
    { name:'YouTube',    url:'https://youtube.com/@{u}',           color:'#ff0000', abbr:'YT', notFound:["this page isn't available",'404','not found'] },
    { name:'Pinterest',  url:'https://pinterest.com/{u}',          color:'#e60023', abbr:'PT', notFound:["sorry! we couldn't find that page",'page not found'] },
    { name:'Twitch',     url:'https://twitch.tv/{u}',              color:'#9146ff', abbr:'TV', notFound:["sorry. unless you've been living under a rock",'page not found'] },
    { name:'LinkedIn',   url:'https://linkedin.com/in/{u}',        color:'#0077b5', abbr:'LI', notFound:['page not found','profile not available',"this profile doesn't exist"] },
    { name:'Telegram',   url:'https://t.me/{u}',                   color:'#0088cc', abbr:'TG', notFound:['if you have telegram','page not found'] },
    { name:'Medium',     url:'https://medium.com/@{u}',            color:'#00ab6c', abbr:'MD', notFound:['page not found','404',"this page doesn't exist"] },
    { name:'Tumblr',     url:'https://{u}.tumblr.com',             color:'#35465c', abbr:'TB', notFound:["there's nothing here",'not found',"this tumblr doesn't exist"] },
    { name:'Snapchat',   url:'https://snapchat.com/add/{u}',       color:'#fffc00', abbr:'SC', notFound:['page not found','user not found'] },
    { name:'Spotify',    url:'https://open.spotify.com/user/{u}',  color:'#1db954', abbr:'SP', notFound:['page not found','user not found','404'] },
    { name:'SoundCloud', url:'https://soundcloud.com/{u}',         color:'#ff5500', abbr:'SO', notFound:["we can't find that user",'page not found','404'] },
    { name:'Fiverr',     url:'https://fiverr.com/{u}',             color:'#1dbf73', abbr:'FV', notFound:['page not found','404','user not found'] },
    { name:'Dribbble',   url:'https://dribbble.com/{u}',           color:'#ea4c89', abbr:'DR', notFound:['page not found','user not found','404'] },
    { name:'Behance',    url:'https://behance.net/{u}',            color:'#053eff', abbr:'BE', notFound:['page not found','404','user not found'] },
    { name:'Replit',     url:'https://replit.com/@{u}',            color:'#f26207', abbr:'RP', notFound:['user not found','page not found','404'] },
    { name:'Patreon',    url:'https://patreon.com/{u}',            color:'#f96854', abbr:'PA', notFound:['page not found','user not found','404'] },
    { name:'Gravatar',   url:'https://gravatar.com/{u}',           color:'#1e8cbe', abbr:'GR', notFound:['page not found','profile not found','404'] },
  ];

  const fetchWithProxy = async (targetUrl, timeoutMs = 9000) => {
    for (const proxyFn of CONFIG.proxies) {
      try {
        const res = await fetch(proxyFn(targetUrl), {
          signal: AbortSignal.timeout(timeoutMs),
          headers: { 'Accept': 'text/html,application/json,*/*' },
        });
        const text = await res.text();
        if (text && text.length > 100) return text;
      } catch(_) { /* try next */ }
    }
    return null;
  };

  const check = async (platform, username) => {
    const profileUrl = platform.url.replace('{u}', username);

    if (platform.api) {
      try {
        const res = await fetch(platform.api(username), {
          signal: AbortSignal.timeout(8000),
          headers: { 'Accept': 'application/json' },
        });
        if (res.status === 404) return { ...platform, profileUrl, found: false };
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data !== null) return { ...platform, profileUrl, found: platform.apiCheck(data) };
        }
      } catch(_) {}
    }

    if (platform.name === 'Reddit') {
      try {
        const res = await fetch(`https://www.reddit.com/user/${username}/about.json`, {
          signal: AbortSignal.timeout(8000),
          headers: { 'Accept': 'application/json' },
        });
        if (res.status === 404) return { ...platform, profileUrl, found: false };
        if (res.ok) {
          const d = await res.json().catch(() => null);
          return { ...platform, profileUrl, found: !!(d && d.data && d.data.name) };
        }
      } catch(_) {}
    }

    const text = await fetchWithProxy(profileUrl);
    if (!text) return { ...platform, profileUrl, found: null };

    const lower = text.toLowerCase();
    const genericNotFound = [
      'page not found','404 not found','user not found','does not exist',
      'no user','account suspended',"this account doesn't exist",
      'sorry, this page',"isn't available","we can't find",
      "there's nothing here","couldn't find",
    ];
    const allSignals = [...new Set([...(platform.notFound || []), ...genericNotFound])];
    const looksNotFound = allSignals.some(s => lower.includes(s));
    return { ...platform, profileUrl, found: !looksNotFound && text.length > 800 };
  };

  return { LIST, check };
})();
