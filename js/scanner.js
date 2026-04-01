'use strict';

const Scanner = (() => {

  const SCAN_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;

  const setScanning = (cardId, btnId, on) => {
    const card = document.getElementById(cardId);
    const btn  = document.getElementById(btnId);
    if (on) {
      card.classList.add('scanning');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> SCANNING...';
    } else {
      card.classList.remove('scanning');
      btn.disabled = false;
      btn.innerHTML = `${SCAN_ICON} SCAN`;
    }
  };

  const resultCard = (icon, iconBg, label, rows) => `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-icon" style="background:${iconBg};">${icon}</div>
        <div class="result-card-label">${label}</div>
      </div>
      <div class="result-rows">
        ${rows.map(r => `
          <div class="result-row">
            <span class="result-key">${r.key}</span>
            <span class="result-val ${r.cls || ''}">${r.val}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const badge = (text, type) => `<span class="result-badge badge-${type}">${text}</span>`;
  const yn    = v => v === true ? badge('YES','red') : v === false ? badge('NO','green') : badge(String(v||'UNKNOWN'),'purple');
  const valid = v => v === true || v === 'active' ? badge('✓ VALID','green') : v === false ? badge('✗ INVALID','red') : badge(String(v||'N/A'),'yellow');

  const showError = (id, msg) => {
    document.getElementById(id).innerHTML = `
      <div class="error-card">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:8px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ERROR: ${msg}
      </div>
    `;
  };

  const phone = async () => {
    const num = document.getElementById('phoneInput').value.trim();
    if (!num) { showError('phoneResults', 'Please enter a phone number with country code.'); return; }
    setScanning('phoneCard', 'phoneScanBtn', true);
    try {
      const res = await fetch(`https://phoneintelligence.abstractapi.com/v1/?api_key=${CONFIG.keys.phone}&phone=${encodeURIComponent(num)}`);
      const d   = await res.json();
      if (d.error) throw new Error(d.error.message || 'API error');

      document.getElementById('phoneResults').innerHTML = `<div class="results-grid">
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/></svg>`, 'var(--glow2)', 'VALIDATION', [
          { key:'VALID',       val: valid(d.phone_validation?.is_valid) },
          { key:'LINE STATUS', val: d.phone_validation?.line_status || 'N/A' },
          { key:'IS VOIP',     val: yn(d.phone_validation?.is_voip) },
          { key:'MIN AGE',     val: d.phone_validation?.minimum_age ? d.phone_validation.minimum_age + ' days' : 'N/A' },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="1" y="5" width="22" height="14" rx="2"/></svg>`, 'rgba(251,191,36,0.1)', 'CARRIER', [
          { key:'CARRIER',   val: d.phone_carrier?.name || 'N/A', cls:'good' },
          { key:'LINE TYPE', val: d.phone_carrier?.line_type || 'N/A' },
          { key:'MCC/MNC',   val: d.phone_carrier?.mcc && d.phone_carrier?.mnc ? `${d.phone_carrier.mcc}/${d.phone_carrier.mnc}` : 'N/A' },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`, 'rgba(34,211,238,0.1)', 'LOCATION', [
          { key:'COUNTRY',  val: d.phone_location?.country_name || 'N/A' },
          { key:'REGION',   val: d.phone_location?.region || 'N/A' },
          { key:'CITY',     val: d.phone_location?.city || 'N/A' },
          { key:'TIMEZONE', val: d.phone_location?.timezone || 'N/A' },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, 'rgba(248,113,113,0.1)', 'INTEL', [
          { key:'SMS EMAIL',      val: d.phone_messaging?.sms_email || 'N/A' },
          { key:'RISK LEVEL',     val: d.phone_risk?.risk_level || 'N/A', cls: d.phone_risk?.risk_level === 'low' ? 'good' : 'warn' },
          { key:'TOTAL BREACHES', val: d.phone_breaches?.total_breaches || '0' },
        ])}
      </div>`;
    } catch(e) { showError('phoneResults', e.message); }
    finally    { setScanning('phoneCard', 'phoneScanBtn', false); }
  };

  const email = async () => {
    const addr = document.getElementById('emailInput').value.trim();
    if (!addr) { showError('emailResults', 'Please enter an email address.'); return; }
    setScanning('emailCard', 'emailScanBtn', true);
    try {
      const res = await fetch(`https://emailreputation.abstractapi.com/v1/?api_key=${CONFIG.keys.email}&email=${encodeURIComponent(addr)}`);
      const d   = await res.json();
      if (d.error) throw new Error(d.error.message || 'API error');

      document.getElementById('emailResults').innerHTML = `<div class="results-grid">
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`, 'var(--glow2)', 'DELIVERABILITY', [
          { key:'DELIVERABLE',  val: badge(d.email_deliverability?.status === 'deliverable' ? 'YES' : 'NO', d.email_deliverability?.status === 'deliverable' ? 'green' : 'red') },
          { key:'SMTP VALID',   val: yn(d.email_deliverability?.is_smtp_valid) },
          { key:'MX VALID',     val: yn(d.email_deliverability?.is_mx_valid) },
          { key:'FORMAT VALID', val: yn(d.email_deliverability?.is_format_valid) },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, 'rgba(34,211,238,0.1)', 'QUALITY', [
          { key:'QUALITY SCORE', val: d.email_quality?.score ? `${d.email_quality.score}/1.0` : 'N/A', cls: d.email_quality?.score > 0.7 ? 'good' : 'warn' },
          { key:'FREE EMAIL',    val: yn(d.email_quality?.is_free_email) },
          { key:'DISPOSABLE',    val: yn(d.email_quality?.is_disposable) },
          { key:'CATCHALL',      val: yn(d.email_quality?.is_catchall) },
          { key:'ROLE ACCOUNT',  val: yn(d.email_quality?.is_role) },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`, 'rgba(251,191,36,0.1)', 'DOMAIN', [
          { key:'DOMAIN',     val: d.email_domain?.domain || 'N/A', cls:'good' },
          { key:'DOMAIN AGE', val: d.email_domain?.domain_age ? d.email_domain.domain_age + ' days' : 'N/A' },
          { key:'REGISTRAR',  val: d.email_domain?.registrar || 'N/A' },
          { key:'EXPIRES',    val: d.email_domain?.date_expires || 'N/A' },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, 'rgba(248,113,113,0.1)', 'RISK & BREACHES', [
          { key:'ADDRESS RISK',   val: d.email_risk?.address_risk_status || 'N/A', cls: d.email_risk?.address_risk_status === 'low' ? 'good' : 'warn' },
          { key:'DOMAIN RISK',    val: d.email_risk?.domain_risk_status || 'N/A', cls: d.email_risk?.domain_risk_status === 'low' ? 'good' : 'warn' },
          { key:'TOTAL BREACHES', val: d.email_breaches?.total_breaches || '0' },
          { key:'FIRST BREACH',   val: d.email_breaches?.date_first_breached ? new Date(d.email_breaches.date_first_breached).toLocaleDateString() : 'N/A' },
        ])}
      </div>`;
    } catch(e) { showError('emailResults', e.message); }
    finally    { setScanning('emailCard', 'emailScanBtn', false); }
  };

  const ip = async () => {
    const ipVal = document.getElementById('ipInput').value.trim();
    setScanning('ipCard', 'ipScanBtn', true);
    try {
      const url = ipVal
        ? `https://ip-intelligence.abstractapi.com/v1/?api_key=${CONFIG.keys.ip}&ip_address=${encodeURIComponent(ipVal)}`
        : `https://ip-intelligence.abstractapi.com/v1/?api_key=${CONFIG.keys.ip}`;
      const res = await fetch(url);
      const d   = await res.json();
      if (d.error) throw new Error(d.error.message || 'API error');

      const mapHtml = d.location?.latitude && d.location?.longitude ? `
        <div style="height:220px;border-radius:var(--radius);overflow:hidden;margin-top:16px;border:1px solid var(--border);">
          <iframe width="100%" height="100%" frameborder="0" scrolling="no"
            src="https://maps.google.com/maps?q=${d.location.latitude},${d.location.longitude}&z=10&output=embed"
            style="border:none;filter:invert(90%) hue-rotate(180deg);"></iframe>
        </div>` : '';

      document.getElementById('ipResults').innerHTML = `<div class="results-grid">
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`, 'var(--glow2)', 'SECURITY', [
          { key:'IP ADDRESS', val: d.ip_address || 'N/A', cls:'good' },
          { key:'VPN',        val: yn(d.security?.is_vpn) },
          { key:'PROXY',      val: yn(d.security?.is_proxy) },
          { key:'TOR',        val: yn(d.security?.is_tor) },
          { key:'ABUSE',      val: yn(d.security?.is_abuse) },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`, 'rgba(34,211,238,0.1)', 'GEOLOCATION', [
          { key:'COUNTRY',     val: d.location?.country || 'N/A' },
          { key:'REGION',      val: d.location?.region || 'N/A' },
          { key:'CITY',        val: d.location?.city || 'N/A' },
          { key:'POSTAL',      val: d.location?.postal_code || 'N/A' },
          { key:'COORDINATES', val: d.location?.latitude && d.location?.longitude ? `${d.location.latitude.toFixed(4)}, ${d.location.longitude.toFixed(4)}` : 'N/A' },
        ])}
        ${resultCard(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="1" y="5" width="22" height="14" rx="2"/></svg>`, 'rgba(251,191,36,0.1)', 'NETWORK', [
          { key:'ASN',    val: d.asn?.asn ? 'AS' + d.asn.asn : 'N/A' },
          { key:'ISP',    val: d.asn?.name || d.company?.name || 'N/A', cls:'good' },
          { key:'DOMAIN', val: d.asn?.domain || d.company?.domain || 'N/A' },
          { key:'TYPE',   val: d.asn?.type || 'N/A' },
        ])}
      </div>${mapHtml}`;
    } catch(e) { showError('ipResults', e.message); }
    finally    { setScanning('ipCard', 'ipScanBtn', false); }
  };

  const username = async () => {
    const uname = document.getElementById('usernameInput').value.trim();
    if (!uname) { showError('usernameResults', 'Please enter a username.'); return; }
    if (!/^[a-zA-Z0-9._-]+$/.test(uname)) { showError('usernameResults', 'Username can only contain letters, numbers, dots, dashes and underscores.'); return; }

    setScanning('usernameCard', 'usernameScanBtn', true);
    document.getElementById('usernameScanBtn').innerHTML = '<div class="spinner"></div> HUNTING...';

    let grid = `
      <div style="margin-bottom:16px;">
        <div style="font-family:var(--font-mono);font-size:.68rem;color:var(--accent2);letter-spacing:.15em;margin-bottom:4px;">// SCANNING USERNAME: <span style="color:var(--text);">${uname}</span></div>
        <div style="font-family:var(--font-mono);font-size:.65rem;color:var(--text3);">Checking ${Platforms.LIST.length} platforms — results stream in live as each probe completes...</div>
        <div style="font-family:var(--font-mono);font-size:.6rem;color:var(--text3);margin-top:4px;padding:6px 10px;background:rgba(124,92,252,.05);border:1px solid rgba(124,92,252,.15);border-radius:8px;">
          ⚡ NOTE: Confirmed hits (GitHub, Dev.to, HackerNews) are definitive. Others are high-confidence indicators — always verify by clicking the link.
        </div>
      </div>
      <div style="font-family:var(--font-mono);font-size:.65rem;color:var(--text3);margin-bottom:12px;" id="liveProgress">Probing 0 / ${Platforms.LIST.length}...</div>
      <div class="username-grid" id="usernameGrid">
    `;
    Platforms.LIST.forEach(p => {
      grid += `
        <div class="username-item checking" id="plat-${p.name.replace(/\W/g,'_')}">
          <div class="platform-icon" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}44;">${p.abbr}</div>
          <div class="platform-name">${p.name}</div>
          <div class="platform-status"><div class="spinner" style="width:12px;height:12px;border-width:1.5px;"></div></div>
        </div>
      `;
    });
    grid += `</div><div id="usernameStats" style="margin-top:16px;font-family:var(--font-mono);font-size:.7rem;color:var(--text3);"></div>`;
    document.getElementById('usernameResults').innerHTML = grid;

    let found = 0, notFound = 0, unknown = 0, completed = 0;

    const promises = Platforms.LIST.map(p =>
      Platforms.check(p, uname).then(r => {
        completed++;
        const prog = document.getElementById('liveProgress');
        if (prog) prog.textContent = `Probing ${completed} / ${Platforms.LIST.length}...`;
        const el = document.getElementById('plat-' + r.name.replace(/\W/g,'_'));
        if (!el) return r;
        if (r.found === true) {
          found++;
          el.className = 'username-item found';
          el.innerHTML = `
            <div class="platform-icon" style="background:${r.color}22;color:${r.color};border:1px solid ${r.color}44;">${r.abbr}</div>
            <a href="${r.profileUrl}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.68rem;color:var(--success);text-decoration:none;flex:1;">${r.name}</a>
            <div class="platform-status">✓</div>
          `;
        } else if (r.found === false) {
          notFound++;
          el.className = 'username-item notfound';
          el.innerHTML = `
            <div class="platform-icon" style="background:${r.color}11;color:${r.color}66;border:1px solid ${r.color}22;">${r.abbr}</div>
            <div class="platform-name" style="opacity:.5;">${r.name}</div>
            <div class="platform-status" style="color:var(--danger);">✗</div>
          `;
        } else {
          unknown++;
          el.className = 'username-item';
          el.innerHTML = `
            <div class="platform-icon" style="background:${r.color}11;color:${r.color}66;">${r.abbr}</div>
            <a href="${r.profileUrl}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.65rem;color:var(--text3);opacity:.5;text-decoration:none;flex:1;">${r.name}</a>
            <div class="platform-status" style="color:var(--text3);">?</div>
          `;
        }
        return r;
      })
    );

    await Promise.allSettled(promises);
    const prog = document.getElementById('liveProgress');
    if (prog) prog.style.display = 'none';
    document.getElementById('usernameStats').innerHTML = `
      <span style="color:var(--success);">✓ ${found} FOUND</span> &nbsp;&nbsp;
      <span style="color:var(--danger);">✗ ${notFound} NOT FOUND</span> &nbsp;&nbsp;
      <span style="color:var(--text3);">? ${unknown} UNCONFIRMED</span>
    `;
    setScanning('usernameCard', 'usernameScanBtn', false);
  };

  return { phone, email, ip, username };
})();
