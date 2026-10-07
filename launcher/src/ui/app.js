// KREAKS Launcher – Oberfläche
'use strict';
const $ = (id) => document.getElementById(id);
const L = window.launcher;
const AUTH = window.KreaksAuth;

const S = { st: null, auth: null, account: null, manifest: null, net: 'wait', installing: {}, gameRunning: false, upd: null, keys: [], keyFilter: 'all', keyCount: 1 };

// ---------- Hilfen ----------
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function mb(n) { return n ? (n / 1048576).toFixed(n > 10485760 ? 0 : 1).replace('.', ',') + ' MB' : ''; }
function fmtDate(d) { if (!d) return ''; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); }
function fmtShort(d) { if (!d) return ''; const x = new Date(d); return isNaN(x) ? '' : x.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }); }
function cmpId(a, b) { return b.localeCompare(a, 'de', { numeric: true }); }
function errText(e) { return String(e && e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''); }
let toastT = 0;
function toast(html, ms = 3500) { const t = $('toast'); t.innerHTML = html; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms); }
function busy(btn, on) { btn.disabled = on; btn.classList.toggle('busy', on); }
function msg(text, kind, el) { const m = el || $('authMsg'); m.textContent = text || ''; m.className = 'msg' + (kind ? ' ' + kind : ''); }
async function copy(text) { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } }
function verLabel(v) { if (!v) return ''; return v.label ? `${v.label} · ${v.id}` : (v.name || v.id); }

// ---------- Versionen ----------
function allVersions() {
  const map = new Map();
  const showBeta = S.st.settings.showBeta;
  const revoked = new Set((S.manifest && S.manifest.revoked) || []);
  for (const v of (S.manifest && S.manifest.versions) || []) {
    if (!v || !v.id || revoked.has(v.id)) continue;
    if (v.channel === 'beta' && !showBeta) continue;
    map.set(v.id, Object.assign({}, v, { remote: true }));
  }
  for (const i of S.st.installed) { if (revoked.has(i.id)) continue; map.set(i.id, Object.assign({}, map.get(i.id) || {}, i, { installed: true, remote: map.has(i.id) })); }
  return [...map.values()].sort((a, b) => (b.date || '').localeCompare(a.date || '') || cmpId(a.id, b.id));
}
function latestId() {
  const m = S.manifest;
  if (m && m.latest && !(m.revoked || []).includes(m.latest)) return m.latest;
  const inst = allVersions().filter(v => v.channel !== 'beta');
  return (inst[0] || allVersions()[0] || {}).id || null;
}
function selectedId() {
  const s = S.st.settings.selected;
  if (s && s !== 'latest' && allVersions().some(v => v.id === s)) return s;
  return latestId();
}
function findV(id) { return allVersions().find(v => v.id === id); }
async function refreshState() { S.st = await L.state(); }

async function install(v, silent) {
  if (!v || S.installing[v.id]) return false;
  if (v.encrypted && !(S.account && S.account.licensed)) { toast('Schalte zuerst dein Konto frei.'); setTab('account'); return false; }
  S.installing[v.id] = { got: 0, total: v.size || 0, phase: 'download' };
  renderPlay(); renderVersions();
  try {
    const gameKey = v.encrypted ? await S.auth.gameKey(v.wrappedKey) : null;
    await L.install(v, gameKey);
    await refreshState();
    if (!silent) toast(`${esc(verLabel(v))} ist installiert.`);
    return true;
  } catch (e) {
    toast(`Installation fehlgeschlagen: ${esc(errText(e))}`, 6000);
    return false;
  } finally { delete S.installing[v.id]; renderAll(); }
}

L.onProgress((p) => { if (!S.installing[p.id]) return; Object.assign(S.installing[p.id], p); updateProgress(); });
function pct(p) { return p && p.total ? Math.min(100, Math.round(p.got / p.total * 100)) : 0; }
function updateProgress() {
  const id = selectedId(), p = S.installing[id];
  if (p) {
    $('playFill').style.width = (p.phase === 'extract' ? 100 : pct(p)) + '%';
    $('playTxt').textContent = p.phase === 'extract' ? 'Entpacken …' : `Lädt … ${pct(p)} %`;
  }
  for (const [vid, q] of Object.entries(S.installing)) {
    const bar = document.querySelector(`.vrow[data-id="${CSS.escape(vid)}"] .prog i`);
    if (bar) bar.style.width = (q.phase === 'extract' ? 100 : pct(q)) + '%';
  }
}

// ---------- Spielen ----------
async function play() {
  if (S.gameRunning) return;
  // Freischaltung frisch prüfen (z. B. nach dem Einlösen eines Keys)
  try { const a = await S.auth.current(); if (a) S.account = a; } catch { /* offline: letzter Stand */ }
  renderAccount();
  if (!S.account.licensed) { setTab('account'); setTimeout(() => $('ulKey').focus(), 50); toast('Schalte KREAKS mit einem Key frei, um zu spielen.'); return; }
  const id = selectedId(); const v = findV(id);
  if (!v) return;
  if (!v.installed) { if (!(await install(v, true))) return; }
  try { await L.launch(id, { uuid: S.account.uuid, name: S.account.name, licensed: true, demo: !!S.account.demo }); }
  catch (e) { toast('Spiel konnte nicht gestartet werden: ' + esc(errText(e))); }
}
L.onGameStarted(() => { S.gameRunning = true; renderPlay(); });
L.onGameClosed((d) => {
  S.gameRunning = false; renderPlay();
  if (d && d.minutes > 0) toast(`Schön, dass du da warst! ${d.minutes} ${d.minutes === 1 ? 'Minute' : 'Minuten'} gespielt.`);
});

// ---------- Darstellung ----------
function renderPlay() {
  const id = selectedId(), v = findV(id), btn = $('playBtn'), p = S.installing[id];
  const isLatest = S.st.settings.selected === 'latest' || !S.st.settings.selected;
  $('verCur').textContent = v ? (isLatest ? `Neueste (${v.label || v.id})` : verLabel(v)) : 'Keine Version';
  btn.classList.remove('dl', 'running', 'lock'); $('playFill').style.width = '0';
  const licensed = S.account && S.account.licensed;
  if (S.gameRunning) { btn.disabled = true; btn.classList.add('running'); $('playTxt').textContent = 'Läuft …'; }
  else if (!licensed) { btn.disabled = false; btn.classList.add('lock'); $('playTxt').textContent = 'Freischalten'; }
  else if (p) { btn.disabled = true; btn.classList.add('dl'); updateProgress(); }
  else if (!v) { btn.disabled = true; $('playTxt').textContent = 'Spielen'; }
  else { btn.disabled = false; $('playTxt').textContent = 'Spielen'; }

  let info = '';
  if (!licensed) info = 'Dein Konto ist noch nicht freigeschaltet. Löse einen Key ein oder kaufe KREAKS.';
  else if (v && !v.installed && !p) info = `Wird beim Start heruntergeladen${v.size ? ' (' + mb(v.size) + ')' : ''}.`;
  else if (v) info = `<b>${esc(verLabel(v))}</b><br>${v.date ? fmtDate(v.date) : ''}`;
  $('playInfo').innerHTML = info;

  const n = S.manifest && Array.isArray(S.manifest.news) && S.manifest.news[0];
  if (n) { $('newsKicker').textContent = n.kicker || 'Neuigkeiten'; $('newsTitle').textContent = n.title || ''; $('newsText').textContent = n.text || ''; }
  else if (v) { $('newsKicker').textContent = 'Neu in ' + (v.label || v.id); $('newsTitle').textContent = v.name || v.id; $('newsText').textContent = v.notes || ''; }
  $('news').hidden = !n && !(v && v.notes);
  const lv = findV(latestId());
  const vtxt = lv ? (lv.label ? lv.label + ' · ' + lv.id : lv.id) : '';
  $('sideVer').textContent = lv && lv.label ? lv.label : (lv ? lv.id : '');
  $('loginVer').textContent = vtxt || 'KREAKS';
  $('loginVer').hidden = !vtxt;
  renderVerList();
}

function renderVerList() {
  const sel = S.st.settings.selected || 'latest', lat = findV(latestId());
  const items = [{ id: 'latest', label: 'Neueste Version', sub: lat ? (lat.label || lat.id) : '' }].concat(allVersions().map(v => ({
    id: v.id, label: verLabel(v), sub: v.installed ? 'installiert' : (v.size ? mb(v.size) : 'online')
  })));
  $('verList').innerHTML = items.map(i => `<button data-ver="${esc(i.id)}" class="${i.id === sel ? 'sel' : ''}"><span>${esc(i.label)}</span><small>${esc(i.sub)}</small></button>`).join('');
}

function renderVersions() {
  const lat = latestId(), list = allVersions(), m = S.manifest;
  $('verSub').textContent = S.net === 'unconfigured' ? 'Es ist noch keine Online-Versionsliste eingerichtet.'
    : S.net === 'off' ? 'Keine Verbindung – angezeigt werden nur installierte Versionen.'
    : `${list.length} ${list.length === 1 ? 'Version' : 'Versionen'}${m && m.latest ? ' · aktuell ' + (findV(m.latest) ? verLabel(findV(m.latest)) : m.latest) : ''}`;
  $('verRows').innerHTML = list.length ? list.map(v => {
    const p = S.installing[v.id];
    const acts = p ? `<span class="badge">Lädt …</span>`
      : v.installed ? `<button class="btn small gold notch" data-play="${esc(v.id)}">Spielen</button><button class="btn small notch danger" data-del="${esc(v.id)}">Löschen</button>`
      : `<button class="btn small notch" data-inst="${esc(v.id)}">Installieren${v.size ? ' · ' + mb(v.size) : ''}</button>`;
    return `<div class="vrow notch" data-id="${esc(v.id)}">
      <h4>${esc(v.label ? v.label : (v.name || v.id))} ${v.label ? `<span class="badge">${esc(v.id)}</span>` : ''}<span class="badge ${esc(v.channel || 'release')}">${esc((v.channel || 'release').toUpperCase())}</span>${v.id === lat ? '<span class="badge latest">NEUESTE</span>' : ''}${v.installed ? '<span class="badge inst">✓ installiert</span>' : ''}</h4>
      <p>${v.date ? esc(fmtDate(v.date)) + ' · ' : ''}${esc(v.notes || '')}</p>
      <div class="acts">${acts}</div>
      ${p ? '<div class="prog"><i></i></div>' : ''}
    </div>`;
  }).join('') : '<p class="empty">Noch keine Version vorhanden.</p>';
  updateProgress();
}

function renderNet() {
  const n = $('netState');
  n.className = 'net ' + (S.net === 'on' ? 'on' : S.net === 'off' ? 'off' : '');
  n.textContent = S.net === 'on' ? 'Online' : S.net === 'off' ? 'Offline' : S.net === 'unconfigured' ? 'Lokal' : 'Verbinde …';
}

function renderAccount() {
  const a = S.account; if (!a) return;
  $('accAv').textContent = (a.name || '?')[0].toUpperCase();
  $('accName').textContent = a.name;
  const st = $('accState'); st.textContent = a.licensed ? (a.admin ? 'Freigeschaltet · Admin' : 'Freigeschaltet') : 'Nicht freigeschaltet'; st.className = 'state ' + (a.licensed ? 'ok' : 'no');
  $('welcome').textContent = `Willkommen zurück, ${a.name}!`;
  $('setName').textContent = a.name; $('setMail').textContent = a.email + (a.demo ? ' · Demo' : '');
  $('setState').innerHTML = a.licensed ? '<span class="state ok">Freigeschaltet</span>' : '<span class="state no">Nicht freigeschaltet</span>';
  $('setUuid').textContent = a.uuid;
  $('unlockOpen').hidden = !!a.licensed; $('unlockDone').hidden = !a.licensed;
  $('navAccDot').hidden = !!a.licensed;
  $('navAdmin').hidden = !a.admin;
}

function renderSettings() {
  const s = S.st.settings;
  $('optAuto').checked = !!s.autoUpdate; $('optFull').checked = !!s.fullscreen; $('optKeep').checked = !!s.keepOpen; $('optBeta').checked = !!s.showBeta;
  $('setLVer').textContent = S.st.appVersion; $('lVer').textContent = 'Launcher ' + S.st.appVersion;
  const u = S.upd;
  $('setUpd').textContent = !u ? '–' : u.state === 'dev' ? 'Nur in der installierten Version' : u.state === 'checking' ? 'Suche nach Updates …'
    : u.state === 'available' ? `Version ${u.version} gefunden` : u.state === 'downloading' ? `Lädt … ${u.percent} %` : u.state === 'ready' ? `Version ${u.version} bereit – Neustart nötig`
    : u.state === 'none' ? 'Aktuell' : u.state === 'error' ? 'Prüfung fehlgeschlagen' : '–';
  const price = S.st.price || '';
  document.querySelectorAll('.price').forEach(e => { e.innerHTML = esc(price).replace('€', '<span class="eur">€</span>'); });
}

function renderAll() { renderPlay(); renderVersions(); renderNet(); renderSettings(); }

// ---------- Admin: Codes ----------
async function loadKeys() {
  try { S.keys = await S.auth.adminListKeys(); } catch (e) { toast(esc(errText(e))); S.keys = []; }
  renderKeys();
}
function renderKeys() {
  const all = S.keys, used = all.filter(k => k.used_by_name || k.used_at), free = all.length - used.length;
  $('keyStats').textContent = `${all.length} Codes · ${free} frei · ${used.length} benutzt`;
  const f = S.keyFilter;
  const list = all.filter(k => f === 'all' || (f === 'free' ? !(k.used_by_name || k.used_at) : (k.used_by_name || k.used_at)));
  $('keyRows').innerHTML = list.length ? list.map(k => {
    const isUsed = !!(k.used_by_name || k.used_at);
    const meta = isUsed ? `<span class="used">benutzt von ${esc(k.used_by_name || 'gelöschtem Konto')}</span>${k.used_at ? ' · ' + fmtShort(k.used_at) : ''}` : `<span class="free">frei</span> · ${fmtShort(k.created_at)}`;
    return `<div class="krow notch ${isUsed ? 'used' : ''}"><code title="${esc(k.key)}">${esc(k.key)}</code><span class="meta">${meta}${k.note ? ' · ' + esc(k.note) : ''}</span>
      <span class="acts"><button class="btn tiny notch" data-kcopy="${esc(k.key)}" title="Kopieren"><svg class="ic"><use href="#i-copy"/></svg></button>${isUsed ? '' : `<button class="btn tiny notch danger" data-kdel="${esc(k.key)}" title="Löschen"><svg class="ic"><use href="#i-trash"/></svg></button>`}</span></div>`;
  }).join('') : '<p class="empty">Noch keine Codes.</p>';
}

// ---------- Bildschirme ----------
function showLogin() {
  document.body.className = '';
  $('scrMain').hidden = true; $('scrLogin').hidden = false;
  authView('login');
}
function showMain() {
  $('scrLogin').hidden = true; $('scrMain').hidden = false;
  renderAccount(); setTab('play'); renderAll();
}
function setTab(t) {
  if (t === 'admin' && !(S.account && S.account.admin)) t = 'play';
  for (const b of document.querySelectorAll('#nav>button')) b.classList.toggle('on', b.dataset.tab === t);
  const map = { play: 'tabPlay', versions: 'tabVersions', account: 'tabAccount', admin: 'tabAdmin', settings: 'tabSettings' };
  for (const [k, id] of Object.entries(map)) $(id).hidden = k !== t;
  document.body.className = t === 'play' ? 'main' : 'main page';
  closeMenus();
  if (t === 'admin') loadKeys();
}
function closeMenus() { $('verList').hidden = true; }

let pendingMail = '';
function authView(v) {
  for (const f of ['fLogin', 'fRegister', 'fCode', 'fForgot']) $(f).hidden = true;
  $('authTabs').hidden = !(v === 'login' || v === 'register');
  for (const b of document.querySelectorAll('#authTabs button')) b.classList.toggle('on', b.dataset.auth === v);
  if (v === 'login') $('fLogin').hidden = false;
  if (v === 'register') $('fRegister').hidden = false;
  if (v === 'code') { $('fCode').hidden = false; $('codeMail').textContent = pendingMail; $('coCode').value = ''; setTimeout(() => $('coCode').focus(), 30); }
  if (v === 'forgot') { $('fForgot').hidden = false; $('forgotStep2').hidden = true; $('forgotBtn').textContent = 'Code senden'; $('fgMail').value = $('liMail').value || pendingMail || ''; }
  msg('');
  const first = document.querySelector('.af:not([hidden]) input'); if (first && v !== 'code') setTimeout(() => first.focus(), 30);
}

async function loggedIn(acc, text) {
  S.account = acc; showMain();
  if (text) toast(text);
  autoUpdateGame();
}

// ---------- Kaufen ----------
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-buy]')) return;
  if (S.st.shopUrl) { L.openExternal(S.st.shopUrl); return; }
  if (!$('scrMain').hidden) { $('buySoon').hidden = false; }
  toast('Der Kauf ist bald verfügbar. Bis dahin bekommst du Keys direkt von Jonas.', 5000);
});

// ---------- Formulare: Anmeldung ----------
document.querySelectorAll('#authTabs button').forEach(b => b.onclick = () => authView(b.dataset.auth));
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => authView(b.dataset.go));
document.querySelectorAll('.eye').forEach(b => b.onclick = () => { const i = b.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; b.classList.toggle('on', i.type === 'text'); });

// Key-Felder: Großbuchstaben und Bindestriche automatisch
function keyField(input, onValid) {
  input.addEventListener('input', () => {
    const raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let body = raw.startsWith('KRKS') ? raw.slice(4) : raw;
    body = body.slice(0, 12);
    const parts = ['KRKS'];
    for (let i = 0; i < body.length; i += 4) parts.push(body.slice(i, i + 4));
    const v = raw.length ? parts.join('-') : '';
    if (input.value !== v) input.value = v;
    if (onValid) onValid(v);
  });
}
let keyT = 0;
keyField($('reKey'), (v) => {
  const st = $('keyState'); clearTimeout(keyT);
  if (!v) { st.textContent = ''; return; }
  if (!AUTH.KEY_RE.test(v)) { st.textContent = ''; st.className = ''; return; }
  st.textContent = 'prüfe …'; st.className = '';
  keyT = setTimeout(async () => {
    try { const s = await S.auth.keyStatus(v); if ($('reKey').value !== v) return; st.textContent = s === 'frei' ? 'gültig ✓' : s === 'benutzt' ? 'schon benutzt' : 'ungültig'; st.className = s === 'frei' ? 'ok' : 'bad'; }
    catch { st.textContent = ''; }
  }, 300);
});
keyField($('ulKey'));

$('fLogin').onsubmit = async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('[type=submit]');
  busy(btn, true); msg('');
  try { await loggedIn(await S.auth.signIn($('liMail').value.trim(), $('liPw').value)); $('liPw').value = ''; }
  catch (err) {
    if (err.code === 'not_confirmed') { pendingMail = $('liMail').value.trim(); authView('code'); msg(err.message); }
    else msg(err.message, 'err');
  } finally { busy(btn, false); }
};

let nameT = 0;
$('reName').oninput = (e) => {
  const v = e.target.value.trim(), st = $('nameState'); clearTimeout(nameT);
  if (!v) { st.textContent = ''; return; }
  if (!AUTH.NAME_RE.test(v)) { st.textContent = 'ungültig'; st.className = 'bad'; return; }
  st.textContent = 'prüfe …'; st.className = '';
  nameT = setTimeout(async () => {
    try { const ok = await S.auth.usernameAvailable(v); if (e.target.value.trim() !== v) return; st.textContent = ok ? 'frei ✓' : 'vergeben'; st.className = ok ? 'ok' : 'bad'; }
    catch { st.textContent = ''; }
  }, 400);
};
$('fRegister').onsubmit = async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('[type=submit]');
  if ($('rePw').value !== $('rePw2').value) { msg('Die Passwörter stimmen nicht überein.', 'err'); return; }
  busy(btn, true); msg('');
  try {
    const email = $('reMail').value.trim();
    const r = await S.auth.signUp(email, $('rePw').value, $('reName').value.trim(), $('reKey').value);
    if (r.account) return loggedIn(r.account, 'Konto erstellt. Viel Spaß!');
    pendingMail = email; $('rePw').value = $('rePw2').value = '';
    authView('code'); msg('Konto erstellt! Bestätige jetzt deine E-Mail.', 'ok'); startResendCooldown();
  } catch (err) { msg(err.message, 'err'); }
  finally { busy(btn, false); }
};

$('fCode').onsubmit = async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('[type=submit]');
  busy(btn, true); msg('');
  try { await loggedIn(await S.auth.verifySignup(pendingMail, $('coCode').value), 'E-Mail bestätigt. Willkommen bei KREAKS!'); }
  catch (err) { msg(err.message, 'err'); }
  finally { busy(btn, false); }
};
let cdT = 0;
function startResendCooldown() {
  const b = $('resendBtn'); let n = 60; clearInterval(cdT); b.disabled = true;
  const tick = () => { b.textContent = `Erneut senden (${n} s)`; if (--n < 0) { clearInterval(cdT); b.disabled = false; b.textContent = 'E-Mail erneut senden'; } };
  tick(); cdT = setInterval(tick, 1000);
}
$('resendBtn').onclick = async () => {
  try { await S.auth.resend(pendingMail); msg('Wir haben dir eine neue E-Mail geschickt.', 'ok'); startResendCooldown(); }
  catch (err) { msg(err.message, 'err'); }
};

$('fForgot').onsubmit = async (e) => {
  e.preventDefault(); const btn = $('forgotBtn'), step2 = !$('forgotStep2').hidden;
  busy(btn, true); msg('');
  try {
    if (!step2) {
      await S.auth.forgot($('fgMail').value.trim()); pendingMail = $('fgMail').value.trim();
      $('forgotStep2').hidden = false; btn.textContent = 'Passwort ändern';
      $('forgotHint').textContent = 'Falls es ein Konto mit dieser E-Mail gibt, ist jetzt ein Code unterwegs. Gib ihn ein und wähle ein neues Passwort.';
      setTimeout(() => $('fgCode').focus(), 30);
    } else {
      if ($('fgPw').value !== $('fgPw2').value) throw new Error('Die Passwörter stimmen nicht überein.');
      await loggedIn(await S.auth.resetWithCode(pendingMail, $('fgCode').value, $('fgPw').value), 'Passwort geändert.');
      $('fgPw').value = $('fgPw2').value = $('fgCode').value = '';
    }
  } catch (err) { msg(err.message, 'err'); }
  finally { busy(btn, false); }
};

// ---------- Konto: Key einlösen ----------
$('fUnlock').onsubmit = async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('[type=submit]');
  busy(btn, true); msg('', '', $('unlockMsg'));
  try {
    const acc = await S.auth.redeemKey($('ulKey').value);
    if (acc) S.account = acc;
    $('ulKey').value = '';
    renderAccount(); renderPlay();
    toast('KREAKS ist freigeschaltet. Viel Spaß!');
    autoUpdateGame();
  } catch (err) { msg(err.message, 'err', $('unlockMsg')); }
  finally { busy(btn, false); }
};

// ---------- Admin: Codes erstellen ----------
document.querySelectorAll('#kCount button').forEach(b => b.onclick = () => { S.keyCount = +b.dataset.n; document.querySelectorAll('#kCount button').forEach(x => x.classList.toggle('on', x === b)); $('kMake').textContent = S.keyCount === 1 ? 'Code erstellen' : `${S.keyCount} Codes erstellen`; });
document.querySelectorAll('#kFilter button').forEach(b => b.onclick = () => { S.keyFilter = b.dataset.f; document.querySelectorAll('#kFilter button').forEach(x => x.classList.toggle('on', x === b)); renderKeys(); });
$('fKeys').onsubmit = async (e) => {
  e.preventDefault(); const btn = $('kMake');
  busy(btn, true);
  try {
    const keys = await S.auth.adminCreateKeys(S.keyCount, $('kNote').value.trim());
    $('newKeys').innerHTML = keys.map(k => `<div class="nk notch"><code>${esc(k)}</code><button class="btn tiny gold notch" data-kcopy="${esc(k)}"><svg class="ic"><use href="#i-copy"/></svg>Kopieren</button></div>`).join('')
      + (keys.length > 1 ? `<button class="btn small notch" data-kcopyall="${esc(keys.join('\n'))}"><svg class="ic"><use href="#i-copy"/></svg>Alle kopieren</button>` : '');
    if (keys.length === 1 && await copy(keys[0])) toast(`Code <b>${esc(keys[0])}</b> erstellt und kopiert.`, 5000);
    else toast(`${keys.length} Codes erstellt.`);
    loadKeys();
  } catch (err) { toast(esc(errText(err)), 5000); }
  finally { busy(btn, false); }
};

// ---------- Hauptbildschirm ----------
document.querySelectorAll('#nav>button').forEach(b => b.onclick = () => setTab(b.dataset.tab));
$('verBtn').onclick = (e) => { e.stopPropagation(); const m = $('verList'); const open = m.hidden; closeMenus(); m.hidden = !open; };
document.addEventListener('click', (e) => { if (!e.target.closest('.menu')) closeMenus(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });
$('verList').onclick = async (e) => {
  const b = e.target.closest('[data-ver]'); if (!b) return;
  S.st.settings = await L.setSettings({ selected: b.dataset.ver }); closeMenus(); renderPlay();
  if (b.dataset.ver === 'latest') autoUpdateGame();
};
$('playBtn').onclick = play;
document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-acc]');
  if (a && a.dataset.acc === 'logout') { await S.auth.signOut(); S.account = null; showLogin(); toast('Du bist abgemeldet.'); return; }
  const kc = e.target.closest('[data-kcopy]');
  if (kc) { if (await copy(kc.dataset.kcopy)) toast(`<b>${esc(kc.dataset.kcopy)}</b> kopiert.`); return; }
  const ka = e.target.closest('[data-kcopyall]');
  if (ka) { if (await copy(ka.dataset.kcopyall)) toast('Alle Codes kopiert.'); return; }
  const kd = e.target.closest('[data-kdel]');
  if (kd) {
    if (kd.dataset.armed) { try { await S.auth.adminDeleteKey(kd.dataset.kdel); toast('Code gelöscht.'); loadKeys(); } catch (err) { toast(esc(errText(err))); } }
    else { kd.dataset.armed = 1; kd.classList.add('gold'); kd.title = 'Nochmal klicken zum Löschen'; setTimeout(() => { if (kd.isConnected) { delete kd.dataset.armed; kd.classList.remove('gold'); } }, 3000); }
    return;
  }
  const p = e.target.closest('[data-play]');
  if (p) { S.st.settings = await L.setSettings({ selected: p.dataset.play }); setTab('play'); renderAll(); play(); return; }
  const i = e.target.closest('[data-inst]');
  if (i) { install(findV(i.dataset.inst)); return; }
  const d = e.target.closest('[data-del]');
  if (d) {
    if (d.dataset.armed) {
      try { await L.remove(d.dataset.del); await refreshState(); toast('Version gelöscht.'); } catch (err) { toast(esc(errText(err))); }
      renderAll();
    } else { d.dataset.armed = 1; d.textContent = 'Wirklich löschen?'; setTimeout(() => { if (d.isConnected) { delete d.dataset.armed; d.textContent = 'Löschen'; } }, 3000); }
  }
});
$('importBtn').onclick = async () => {
  try { const r = await L.importZip(); if (r) { await refreshState(); renderAll(); toast('Version importiert.'); } }
  catch (err) { toast('Import fehlgeschlagen: ' + esc(errText(err)), 6000); }
};
$('folderBtn').onclick = () => L.openFolder();
$('copyUuid').onclick = async () => { if (await copy(S.account.uuid)) toast('Konto-ID kopiert.'); };
const bindOpt = (id, key, after) => $(id).onchange = async (e) => { S.st.settings = await L.setSettings({ [key]: e.target.checked }); renderAll(); if (after) after(); };
bindOpt('optAuto', 'autoUpdate', () => autoUpdateGame());
bindOpt('optFull', 'fullscreen'); bindOpt('optKeep', 'keepOpen'); bindOpt('optBeta', 'showBeta');

// Fenster-Knöpfe
document.querySelectorAll('[data-w]').forEach(b => b.onclick = () => L.win(b.dataset.w));

// Launcher-Updates
L.onUpdater((u) => {
  S.upd = u; if (S.st) renderSettings();
  if (u.state === 'ready') { $('updText').textContent = `Launcher-Update ${u.version} ist bereit.`; $('updBanner').hidden = false; }
});
$('updBtn').onclick = () => L.installUpdate();

// Neueste Version automatisch laden
function autoUpdateGame() {
  if (!S.account || !S.account.licensed || !S.st.settings.autoUpdate || !S.manifest) return;
  if (S.st.settings.selected && S.st.settings.selected !== 'latest') return;
  const v = findV(latestId());
  if (v && !v.installed && v.remote && !S.installing[v.id]) { toast(`${esc(verLabel(v))} wird heruntergeladen …`); install(v, true); }
}

async function loadManifest() {
  const r = await L.manifest();
  S.manifest = r.data || null;
  S.net = r.ok ? 'on' : r.unconfigured ? 'unconfigured' : 'off';
  await refreshState();   // zurückgezogene Versionen sind jetzt gelöscht
  renderAll(); if (S.account) autoUpdateGame();
}

// ---------- Start ----------
(async function init() {
  S.st = await L.state();
  S.auth = S.st.demo
    ? new AUTH.DemoAuth((code, mail) => toast(`Demo-Modus – dein Code für ${esc(mail)}:<br><b>${code}</b>`, 20000))
    : new AUTH.SupaAuth(S.st.supabase.url, S.st.supabase.key);
  $('demoNote').hidden = !S.st.demo;
  S.gameRunning = S.st.gameRunning;
  renderSettings();
  let acc = null;
  try { acc = await S.auth.current(); } catch { acc = null; }
  if (acc) { S.account = acc; showMain(); } else showLogin();
  loadManifest();
  setInterval(loadManifest, 15 * 60 * 1000);
})();
