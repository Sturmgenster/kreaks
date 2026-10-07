// KREAKS Launcher – Hauptprozess
const { app, BrowserWindow, ipcMain, protocol, net, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const AdmZip = require('adm-zip');
const CONFIG = require('./config');

// ---------- Pfade ----------
const DATA = app.getPath('userData');
const VER_DIR = path.join(DATA, 'versions');
const TMP_DIR = path.join(DATA, 'tmp');
const SETTINGS_FILE = path.join(DATA, 'settings.json');
const MANIFEST_CACHE = path.join(DATA, 'versions-cache.json');
const BUNDLED_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'bundled-game')
  : path.join(__dirname, '..', 'assets', 'bundled-game');
fs.mkdirSync(VER_DIR, { recursive: true });
// Zum Testen kann die Versionsliste per Umgebungsvariable umgeleitet werden (nur in der Entwicklerversion)
const DEV = !app.isPackaged;
const VERSIONS_URL = (DEV && process.env.KREAKS_VERSIONS_URL) || CONFIG.VERSIONS_URL;
const URL_OK = DEV ? /^(https:\/\/|http:\/\/127\.0\.0\.1[:/])/ : /^https:\/\//;

const DEFAULT_SETTINGS = { selected: 'latest', autoUpdate: true, showBeta: false, keepOpen: false, fullscreen: false };
function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, v) { fs.writeFileSync(f, JSON.stringify(v, null, 2)); }
let settings = Object.assign({}, DEFAULT_SETTINGS, readJSON(SETTINGS_FILE, {}));

const SAFE_ID = /^[A-Za-z0-9._-]{1,40}$/;
function verPath(id) { if (!SAFE_ID.test(id)) throw new Error('Ungültige Versions-ID'); return path.join(VER_DIR, id); }

function installed() {
  const out = [];
  for (const id of fs.readdirSync(VER_DIR)) {
    const dir = path.join(VER_DIR, id);
    if (!fs.existsSync(path.join(dir, 'index.html'))) continue;
    out.push(Object.assign({ id, name: id }, readJSON(path.join(dir, 'kreaks-version.json'), {})));
  }
  return out;
}

// Mitgelieferte Version beim ersten Start einrichten
function ensureBundled() {
  const b = CONFIG.BUNDLED_VERSION;
  if (!b || !fs.existsSync(path.join(BUNDLED_DIR, 'index.html'))) return;
  const dst = verPath(b.id);
  if (fs.existsSync(path.join(dst, 'index.html'))) return;
  fs.cpSync(BUNDLED_DIR, dst, { recursive: true });
  writeJSON(path.join(dst, 'kreaks-version.json'), Object.assign({}, b, { installedAt: Date.now(), bundled: true }));
}

// ---------- Spiel-Protokoll ----------
// Alle Versionen laufen unter derselben Adresse kreaks://game/ – dadurch
// teilen sie sich die Spielstände, egal welche Version gestartet wird.
protocol.registerSchemesAsPrivileged([{ scheme: 'kreaks', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
let gameDir = null, gameWin = null, gameAccount = null;

function setupProtocol() {
  protocol.handle('kreaks', (req) => {
    const u = new URL(req.url);
    if (u.host !== 'game' || !gameDir) return new Response('Nicht gefunden', { status: 404 });
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = path.normalize(path.join(gameDir, rel));
    if (!file.startsWith(gameDir)) return new Response('Verboten', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
}

// ---------- Fenster ----------
let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1120, height: 700, minWidth: 900, minHeight: 600,
    frame: false, backgroundColor: '#0b110d', show: false, title: 'KREAKS Launcher',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'ui', 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
}
function send(ch, data) { if (win && !win.isDestroyed()) win.webContents.send(ch, data); }

// ---------- Versionsliste ----------
async function fetchManifest() {
  if (!VERSIONS_URL || /DEIN-GITHUB-NAME/.test(VERSIONS_URL)) return { ok: false, offline: false, unconfigured: true, data: readJSON(MANIFEST_CACHE, null) };
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(VERSIONS_URL + (VERSIONS_URL.includes('?') ? '&' : '?') + 't=' + Date.now(), { signal: ctl.signal });
    clearTimeout(t);
    if (r.status === 404) return { ok: false, unconfigured: true, data: readJSON(MANIFEST_CACHE, null) }; // noch keine Versionsliste veröffentlicht
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    if (!data || !Array.isArray(data.versions)) throw new Error('Ungültige Versionsliste');
    writeJSON(MANIFEST_CACHE, data);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, offline: true, error: String(e.message || e), data: readJSON(MANIFEST_CACHE, null) };
  }
}

// ---------- Herunterladen & Installieren ----------
const busy = new Set();
async function download(url, file, onProgress) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Download fehlgeschlagen (HTTP ' + r.status + ')');
  const total = +r.headers.get('content-length') || 0;
  const out = fs.createWriteStream(file);
  const hash = crypto.createHash('sha256');
  let got = 0, last = 0;
  const reader = r.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      got += value.length; hash.update(value);
      if (!out.write(Buffer.from(value))) await new Promise(res => out.once('drain', res));
      const now = Date.now(); if (now - last > 120) { last = now; onProgress(got, total); }
    }
  } finally { await new Promise(res => out.end(res)); }
  onProgress(got, total);
  return hash.digest('hex');
}

function findGameRoot(dir, depth = 0) {
  if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
  if (depth > 3) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && !e.name.startsWith('__MACOSX')) { const r = findGameRoot(path.join(dir, e.name), depth + 1); if (r) return r; }
  }
  return null;
}

function installFromZip(zipFile, meta) {
  const work = path.join(TMP_DIR, 'x-' + Date.now());
  fs.mkdirSync(work, { recursive: true });
  try {
    const zip = new AdmZip(zipFile);
    for (const e of zip.getEntries()) {           // Schutz vor ../-Pfaden im Archiv
      const p = path.normalize(path.join(work, e.entryName));
      if (!p.startsWith(work)) throw new Error('Ungültiges Archiv');
    }
    zip.extractAllTo(work, true);
    const root = findGameRoot(work);
    if (!root) throw new Error('Im Archiv wurde keine index.html gefunden');
    const dst = verPath(meta.id);
    fs.rmSync(dst, { recursive: true, force: true });
    fs.renameSync(root, dst);
    writeJSON(path.join(dst, 'kreaks-version.json'), Object.assign({}, meta, { installedAt: Date.now() }));
  } finally { fs.rmSync(work, { recursive: true, force: true }); }
}

async function installVersion(v) {
  if (!v || !SAFE_ID.test(v.id) || !URL_OK.test(v.url || '')) throw new Error('Ungültige Version');
  if (busy.has(v.id)) return;
  busy.add(v.id);
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const zipFile = path.join(TMP_DIR, v.id + '.zip');
  try {
    send('install-progress', { id: v.id, phase: 'download', got: 0, total: v.size || 0 });
    const sha = await download(v.url, zipFile, (got, total) => send('install-progress', { id: v.id, phase: 'download', got, total: total || v.size || 0 }));
    if (v.sha256 && sha !== v.sha256.toLowerCase()) throw new Error('Die heruntergeladene Datei ist beschädigt (Prüfsumme stimmt nicht)');
    send('install-progress', { id: v.id, phase: 'extract' });
    const { url, sha256, size, ...meta } = v;
    installFromZip(zipFile, meta);
    send('install-progress', { id: v.id, phase: 'done' });
  } catch (e) {
    send('install-progress', { id: v.id, phase: 'error', error: String(e.message || e) });
    throw e;
  } finally { busy.delete(v.id); fs.rmSync(zipFile, { force: true }); }
}

// ---------- Spiel starten ----------
function launchGame(id, account) {
  if (gameWin && !gameWin.isDestroyed()) { gameWin.focus(); return; }
  const dir = verPath(id);
  if (!fs.existsSync(path.join(dir, 'index.html'))) throw new Error('Diese Version ist nicht installiert');
  gameDir = dir; gameAccount = account || null;
  gameWin = new BrowserWindow({
    width: 1280, height: 800, minWidth: 800, minHeight: 500, backgroundColor: '#0b110d',
    autoHideMenuBar: true, title: 'KREAKS', fullscreen: !!settings.fullscreen,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload-game.js'), contextIsolation: true, sandbox: true, backgroundThrottling: false }
  });
  gameWin.removeMenu();
  gameWin.loadURL('kreaks://game/index.html');
  gameWin.webContents.on('before-input-event', (e, inp) => {
    if (inp.type === 'keyDown' && inp.key === 'F11') { gameWin.setFullScreen(!gameWin.isFullScreen()); e.preventDefault(); }
  });
  gameWin.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  const started = Date.now();
  gameWin.on('closed', () => {
    gameWin = null;
    send('game-closed', { id, minutes: Math.round((Date.now() - started) / 60000) });
    if (win && !win.isDestroyed()) { win.show(); win.focus(); }
  });
  if (!settings.keepOpen && win) win.hide();
  send('game-started', { id });
}

// ---------- IPC ----------
function demoMode() { return /DEIN-PROJEKT|DEIN-ANON-KEY/.test(CONFIG.SUPABASE_URL + CONFIG.SUPABASE_ANON_KEY); }
ipcMain.handle('state', () => ({
  settings, installed: installed(), appVersion: app.getVersion(), demo: demoMode(),
  supabase: { url: CONFIG.SUPABASE_URL, key: CONFIG.SUPABASE_ANON_KEY }, bundled: CONFIG.BUNDLED_VERSION,
  gameRunning: !!(gameWin && !gameWin.isDestroyed())
}));
ipcMain.handle('manifest', () => fetchManifest());
ipcMain.handle('install', async (_e, v) => { await installVersion(v); return installed(); });
ipcMain.handle('remove', (_e, id) => {
  if (gameWin && gameDir === verPath(id)) throw new Error('Diese Version läuft gerade');
  fs.rmSync(verPath(id), { recursive: true, force: true }); return installed();
});
ipcMain.handle('import', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Spielversion importieren', filters: [{ name: 'KREAKS-Spiel', extensions: ['zip'] }], properties: ['openFile'] });
  if (r.canceled || !r.filePaths[0]) return null;
  const base = path.basename(r.filePaths[0], '.zip');
  const d = new Date(), id = 'Eigene-' + d.toISOString().slice(0, 16).replace(/[-:T]/g, '');
  installFromZip(r.filePaths[0], { id, name: base + ' (importiert)', channel: 'eigene', date: d.toISOString().slice(0, 10), notes: 'Aus Datei importiert: ' + path.basename(r.filePaths[0]) });
  return { id, installed: installed() };
});
ipcMain.handle('settings', (_e, patch) => { settings = Object.assign(settings, patch || {}); writeJSON(SETTINGS_FILE, settings); return settings; });
ipcMain.handle('launch', (_e, { id, account }) => launchGame(id, account));
ipcMain.handle('win', (_e, act) => { if (!win) return; if (act === 'min') win.minimize(); else if (act === 'max') win.isMaximized() ? win.unmaximize() : win.maximize(); else if (act === 'close') { if (gameWin && !gameWin.isDestroyed()) win.hide(); else app.quit(); } });
ipcMain.handle('open-folder', () => shell.openPath(VER_DIR));
ipcMain.handle('open-external', (_e, url) => { if (/^https:\/\//.test(url)) shell.openExternal(url); });
ipcMain.on('game-account', (e) => { e.returnValue = gameAccount; });

// ---------- Launcher-Updates ----------
let autoUpdater = null;
function setupUpdater() {
  if (!app.isPackaged) { send('updater', { state: 'dev' }); return; }
  try { autoUpdater = require('electron-updater').autoUpdater; } catch { return; }
  autoUpdater.autoDownload = true;
  autoUpdater.on('checking-for-update', () => send('updater', { state: 'checking' }));
  autoUpdater.on('update-available', i => send('updater', { state: 'available', version: i.version }));
  autoUpdater.on('update-not-available', () => send('updater', { state: 'none' }));
  autoUpdater.on('download-progress', p => send('updater', { state: 'downloading', percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', i => send('updater', { state: 'ready', version: i.version }));
  autoUpdater.on('error', e => send('updater', { state: 'error', error: String(e && e.message || e) }));
  autoUpdater.checkForUpdates().catch(() => {});
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 60 * 60 * 1000);
}
ipcMain.handle('updater:install', () => { if (autoUpdater) autoUpdater.quitAndInstall(); });

// ---------- Start ----------
if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } });
app.whenReady().then(() => {
  try { ensureBundled(); } catch (e) { console.error('Mitgelieferte Version', e); }
  setupProtocol();
  createWindow();
  win.webContents.once('did-finish-load', setupUpdater);
});
app.on('window-all-closed', () => app.quit());
