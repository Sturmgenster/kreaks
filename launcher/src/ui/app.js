// KREAKS Launcher – Oberfläche
'use strict';
const $ = (id) => document.getElementById(id);
const L = window.launcher;
const AUTH = window.KreaksAuth;

const S = { st: null, auth: null, account: null, manifest: null, net: 'wait', installing: {}, gameRunning: false, upd: null };

// ---------- Hilfen ----------
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function mb(n) { return n ? (n / 1048576).toFixed(n > 10485760 ? 0 : 1).replace('.', ',') + ' MB' : ''; }
function fmtDate(d) { if (!d) return ''; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); }
function cmpId(a, b) { return b.localeCompare(a, 'de', { numeric: true }); }
let toastT = 0;
function toast(html, ms = 3500) { const t = $('toast'); t.innerHTML = html; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms); }
function busy(btn, on) { btn.disabled = on; btn.classList.toggle('busy', on); }
function msg(text, kind) { const m = $('authMsg'); m.textContent = text || ''; m.className = 'msg' + (kind ? ' ' + kind : ''); }

// ---------- Versionen ----------
function allVersions() {
  const map = new Map();
  const showBeta = S.st.settings.showBeta;
  for (const v of (S.manifest && S.manifest.versions) || []) {
    if (!v || !v.id) continue;
    if (v.channel === 'beta' && !showBeta) continue;
    map.set(v.id, Object.assign({}, v, { remote: true }));
  }
  for (const i of S.st.installed) map.set(i.id, Object.assign({}, map.get(i.id) || {}, i, { installed: true, remote: map.has(i.id) }));
  return [...map.values()].sort((a, b) => (b.date || '').localeCompare(a.date || '') || cmpId(a.id, b.id));
}
function latestId() {
  const m = S.manifest;
  if (m) {
    if (m.latest) return m.latest;
  }
  const inst = allVersions().filter(v => v.installed && v.channel !== 'beta');
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
  S.installing[v.id] = { got: 0, total: v.size || 0, phase: 'download' };
  renderPlay(); renderVersions();
  try {
    await L.install(v);
    await refreshState();
    if (!silent) toast(`${esc(v.name || v.id)} ist installiert.`);
    return true;
  } catch (e) {
    toast(`Installation fehlgeschlagen: ${esc(String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''))}`, 6000);
    return false;
  } finally { delete S.installing[v.id]; renderAll(); }
}

L.onProgress((p) => {
  if (!S.installing[p.id]) return;
  Object.assign(S.installing[p.id], p);
  updateProgress();
});

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
  const id = selectedId(); const v = findV(id);
  if (!v || S.gameRunning) return;
  if (!v.installed) { if (!(await install(v, true))) return; }
  try {
    await L.launch(id, { uuid: S.account.uuid, name: S.account.name, demo: !!S.account.demo });
  } catch (e) { toast('Spiel konnte nicht gestartet werden: ' + esc(e.message)); }
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
  $('verCur').textContent = v ? (isLatest ? `Neueste (${v.id})` : (v.name || v.id)) : 'Keine Version';
  btn.classList.remove('dl', 'running'); $('playFill').style.width = '0';
  if (S.gameRunning) { btn.disabled = true; btn.classList.add('running'); $('playTxt').textContent = 'Läuft …'; }
  else if (p) { btn.disabled = true; btn.classList.add('dl'); updateProgress(); }
  else if (!v) { btn.disabled = true; $('playTxt').textContent = 'Spielen'; }
  else { btn.disabled = false; $('playTxt').textContent = 'Spielen'; }

  let info = '';
  if (v && !v.installed && !p) info = `Wird beim Start heruntergeladen${v.size ? ' (' + mb(v.size) + ')' : ''}.`;
  else if (v) info = `<b>${esc(v.name || v.id)}</b><br>${v.date ? fmtDate(v.date) : ''}`;
  $('playInfo').innerHTML = info;

  // Neuigkeiten: zuerst aus der Versionsliste, sonst die Notizen der gewählten Version
  const n = S.manifest && Array.isArray(S.manifest.news) && S.manifest.news[0];
  if (n) { $('newsKicker').textContent = n.kicker || 'Neuigkeiten'; $('newsTitle').textContent = n.title || ''; $('newsText').textContent = n.text || ''; }
  else if (v) { $('newsKicker').textContent = 'Neu in ' + v.id; $('newsTitle').textContent = v.name || v.id; $('newsText').textContent = v.notes || ''; }
  $('news').hidden = !n && !(v && v.notes);
  renderVerList();
}

function renderVerList() {
  const sel = S.st.settings.selected || 'latest', lat = latestId();
  const items = [{ id: 'latest', label: 'Neueste Version', sub: lat || '' }].concat(allVersions().map(v => ({
    id: v.id, label: v.name || v.id, sub: v.installed ? 'installiert' : (v.size ? mb(v.size) : 'online')
  })));
  $('verList').innerHTML = items.map(i => `<button data-ver="${esc(i.id)}" class="${i.id === sel ? 'sel' : ''}"><span>${esc(i.label)}</span><small>${esc(i.sub)}</small></button>`).join('');
}

function renderVersions() {
  const lat = latestId(), list = allVersions();
  const m = S.manifest;
  $('verSub').textContent = S.net === 'unconfigured'
    ? 'Es ist noch keine Online-Versionsliste eingerichtet. Du kannst Versionen als Zip importieren.'
    : S.net === 'off' ? 'Keine Verbindung – angezeigt werden nur installierte Versionen.' : `${list.length} Versionen${m && m.latest ? ' · aktuell ' + m.latest : ''}`;
  $('verRows').innerHTML = list.length ? list.map(v => {
    const p = S.installing[v.id];
    const acts = p ? `<span class="badge">Lädt …</span>`
      : v.installed ? `<button class="btn small gold notch" data-play="${esc(v.id)}">Spielen</button>${v.bundled ? '' : `<button class="btn small notch danger" data-del="${esc(v.id)}">Löschen</button>`}`
      : `<button class="btn small notch" data-inst="${esc(v.id)}">Installieren${v.size ? ' · ' + mb(v.size) : ''}</button>`;
    return `<div class="vrow notch" data-id="${esc(v.id)}">
      <h4>${esc(v.name || v.id)} <span class="badge ${esc(v.channel || 'release')}">${esc((v.channel || 'release').toUpperCase())}</span>${v.id === lat ? '<span class="badge latest">NEUESTE</span>' : ''}${v.installed ? '<span class="badge inst">✓ installiert</span>' : ''}</h4>
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
  n.title = S.net === 'unconfigured' ? 'Die Online-Versionsliste ist noch nicht eingerichtet' : '';
}

function renderAccount() {
  const a = S.account; if (!a) return;
  $('accAv').textContent = (a.name || '?')[0].toUpperCase();
  $('accName').textContent = a.name;
  $('accMenuName').textContent = a.name; $('accMenuMail').textContent = a.email + (a.demo ? ' · Demo' : '');
  $('welcome').textContent = `Willkommen zurück, ${a.name}!`;
  $('setName').textContent = a.name; $('setMail').textContent = a.email; $('setUuid').textContent = a.uuid;
}

function renderSettings() {
  const s = S.st.settings;
  $('optAuto').checked = !!s.autoUpdate; $('optFull').checked = !!s.fullscreen; $('optKeep').checked = !!s.keepOpen; $('optBeta').checked = !!s.showBeta;
  $('setLVer').textContent = S.st.appVersion;
  const u = S.upd;
  $('setUpd').textContent = !u ? '–' : u.state === 'dev' ? 'Nur in der installierten Version' : u.state === 'checking' ? 'Suche nach Updates …'
    : u.state === 'available' ? `Version ${u.version} gefunden` : u.state === 'downloading' ? `Lädt … ${u.percent} %` : u.state === 'ready' ? `Version ${u.version} bereit – Neustart nötig`
    : u.state === 'none' ? 'Aktuell' : u.state === 'error' ? 'Prüfung fehlgeschlagen' : '–';
}

function renderAll() { renderPlay(); renderVersions(); renderNet(); renderSettings(); }

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
  for (const b of document.querySelectorAll('#nav>button')) b.classList.toggle('on', b.dataset.tab === t);
  $('tabPlay').hidden = t !== 'play'; $('tabVersions').hidden = t !== 'versions'; $('tabSettings').hidden = t !== 'settings';
  document.body.className = t === 'play' ? 'main' : 'main page';
  closeMenus();
}
function closeMenus() { $('accMenu').hidden = true; $('verList').hidden = true; }

let pendingMail = '';
function authView(v) {
  for (const f of ['fLogin', 'fRegister', 'fCode', 'fForgot']) $(f).hidden = true;
  $('authTabs').hidden = !(v === 'login' || v === 'register');
  for (const b of document.querySelectorAll('#authTabs button')) b.classList.toggle('on', b.dataset.auth === v);
  if (v === 'login') $('fLogin').hidden = false;
  if (v === 'register') $('fRegister').hidden = false;
  if (v === 'code') { $('fCode').hidden = false; $('codeMail').textContent = pendingMail; $('fCode').code.value = ''; setTimeout(() => $('fCode').code.focus(), 30); }
  if (v === 'forgot') { $('fForgot').hidden = false; $('forgotStep2').hidden = true; $('forgotBtn').textContent = 'Code senden'; $('fForgot').email.value = $('fLogin').email.value || pendingMail || ''; }
  msg('');
  const first = document.querySelector('.af:not([hidden]) input'); if (first && v !== 'code') setTimeout(() => first.focus(), 30);
}

async function loggedIn(acc, text) {
  S.account = acc; showMain();
  if (text) toast(text);
  autoUpdateGame();
}

// ---------- Formulare ----------
document.querySelectorAll('#authTabs button').forEach(b => b.onclick = () => authView(b.dataset.auth));
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => authView(b.dataset.go));
document.querySelectorAll('.eye').forEach(b => b.onclick = () => { const i = b.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; b.classList.toggle('on', i.type === 'text'); });

$('fLogin').onsubmit = async (e) => {
  e.preventDefault(); const f = e.target, btn = f.querySelector('[type=submit]');
  busy(btn, true); msg('');
  try { await loggedIn(await S.auth.signIn(f.email.value.trim(), f.password.value)); f.password.value = ''; }
  catch (err) {
    if (err.code === 'not_confirmed') { pendingMail = f.email.value.trim(); authView('code'); msg(err.message); }
    else msg(err.message, 'err');
  } finally { busy(btn, false); }
};

let nameT = 0;
$('fRegister').username.oninput = (e) => {
  const v = e.target.value.trim(), st = $('nameState'); clearTimeout(nameT);
  if (!v) { st.textContent = ''; return; }
  if (!window.KreaksAuth.NAME_RE.test(v)) { st.textContent = 'ungültig'; st.className = 'bad'; return; }
  st.textContent = 'prüfe …'; st.className = '';
  nameT = setTimeout(async () => {
    try { const ok = await S.auth.usernameAvailable(v); if (e.target.value.trim() !== v) return; st.textContent = ok ? 'frei ✓' : 'vergeben'; st.className = ok ? 'ok' : 'bad'; }
    catch { st.textContent = ''; }
  }, 400);
};
$('fRegister').onsubmit = async (e) => {
  e.preventDefault(); const f = e.target, btn = f.querySelector('[type=submit]');
  if (f.password.value !== f.password2.value) { msg('Die Passwörter stimmen nicht überein.', 'err'); return; }
  busy(btn, true); msg('');
  try {
    const email = f.email.value.trim();
    const r = await S.auth.signUp(email, f.password.value, f.username.value.trim());
    if (r.account) return loggedIn(r.account, 'Konto erstellt. Viel Spaß!');
    pendingMail = email; f.password.value = f.password2.value = '';
    authView('code'); msg('Konto erstellt! Bestätige jetzt deine E-Mail.', 'ok'); startResendCooldown();
  } catch (err) { msg(err.message, 'err'); }
  finally { busy(btn, false); }
};

$('fCode').onsubmit = async (e) => {
  e.preventDefault(); const f = e.target, btn = f.querySelector('[type=submit]');
  busy(btn, true); msg('');
  try { await loggedIn(await S.auth.verifySignup(pendingMail, f.code.value), 'E-Mail bestätigt. Willkommen bei KREAKS!'); }
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
  e.preventDefault(); const f = e.target, btn = $('forgotBtn'), step2 = !$('forgotStep2').hidden;
  busy(btn, true); msg('');
  try {
    if (!step2) {
      await S.auth.forgot(f.email.value.trim()); pendingMail = f.email.value.trim();
      $('forgotStep2').hidden = false; btn.textContent = 'Passwort ändern';
      $('forgotHint').textContent = 'Falls es ein Konto mit dieser E-Mail gibt, ist jetzt ein Code unterwegs. Gib ihn ein und wähle ein neues Passwort.';
      setTimeout(() => f.code.focus(), 30);
    } else {
      if (f.password.value !== f.password2.value) throw new Error('Die Passwörter stimmen nicht überein.');
      await loggedIn(await S.auth.resetWithCode(pendingMail, f.code.value, f.password.value), 'Passwort geändert.');
      f.password.value = f.password2.value = f.code.value = '';
    }
  } catch (err) { msg(err.message, 'err'); }
  finally { busy(btn, false); }
};

// ---------- Hauptbildschirm ----------
document.querySelectorAll('#nav>button').forEach(b => b.onclick = () => setTab(b.dataset.tab));
$('accBtn').onclick = (e) => { e.stopPropagation(); const m = $('accMenu'); const open = m.hidden; closeMenus(); m.hidden = !open; };
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
  if (a) {
    if (a.dataset.acc === 'logout') { await S.auth.signOut(); S.account = null; closeMenus(); showLogin(); toast('Du bist abgemeldet.'); }
    else setTab('settings');
    return;
  }
  const p = e.target.closest('[data-play]');
  if (p) { S.st.settings = await L.setSettings({ selected: p.dataset.play }); setTab('play'); renderAll(); play(); return; }
  const i = e.target.closest('[data-inst]');
  if (i) { install(findV(i.dataset.inst)); return; }
  const d = e.target.closest('[data-del]');
  if (d) {
    if (d.dataset.armed) {
      try { await L.remove(d.dataset.del); await refreshState(); toast('Version gelöscht.'); }
      catch (err) { toast(esc(String(err.message).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''))); }
      renderAll();
    } else { d.dataset.armed = 1; d.textContent = 'Wirklich löschen?'; setTimeout(() => { if (d.isConnected) { delete d.dataset.armed; d.textContent = 'Löschen'; } }, 3000); }
  }
});
$('importBtn').onclick = async () => {
  try { const r = await L.importZip(); if (r) { await refreshState(); renderAll(); toast('Version importiert.'); } }
  catch (err) { toast('Import fehlgeschlagen: ' + esc(String(err.message).replace(/^Error invoking remote method '[^']+': (Error: )?/, '')), 6000); }
};
$('folderBtn').onclick = () => L.openFolder();
$('copyUuid').onclick = () => { navigator.clipboard.writeText(S.account.uuid); toast('Konto-ID kopiert.'); };
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
  if (!S.account || !S.st.settings.autoUpdate || !S.manifest) return;
  if (S.st.settings.selected && S.st.settings.selected !== 'latest') return;
  const v = findV(latestId());
  if (v && !v.installed && v.remote && !S.installing[v.id]) { toast(`Neue Version ${esc(v.id)} wird heruntergeladen …`); install(v); }
}

async function loadManifest() {
  const r = await L.manifest();
  S.manifest = r.data || null;
  S.net = r.ok ? 'on' : r.unconfigured ? 'unconfigured' : 'off';
  if (S.account) { renderAll(); autoUpdateGame(); }
}

// ---------- Start ----------
(async function init() {
  S.st = await L.state();
  S.auth = S.st.demo
    ? new AUTH.DemoAuth((code, mail) => toast(`Demo-Modus – dein Code für ${esc(mail)}:<br><b>${code}</b>`, 20000))
    : new AUTH.SupaAuth(S.st.supabase.url, S.st.supabase.key);
  $('demoNote').hidden = !S.st.demo;
  S.gameRunning = S.st.gameRunning;
  let acc = null;
  try { acc = await S.auth.current(); } catch { acc = null; }
  if (acc) { S.account = acc; showMain(); } else showLogin();
  loadManifest();
  setInterval(loadManifest, 15 * 60 * 1000);
})();
