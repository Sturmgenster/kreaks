// KREAKS Launcher – Konten
// Zwei Varianten mit derselben Schnittstelle:
//   SupaAuth – echte Konten über Supabase (E-Mail + Passwort, Bestätigungsmail)
//   DemoAuth – nur lokal auf diesem PC, solange Supabase noch nicht eingetragen ist
'use strict';

const NAME_RE = /^[A-Za-z0-9_]{3,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KEY_RE = /^KRKS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
// Key vereinheitlichen: Großbuchstaben, Bindestriche automatisch setzen
function normKey(k) {
  const raw = String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const body = raw.startsWith('KRKS') ? raw.slice(4) : raw;
  return body.length === 12 ? 'KRKS-' + body.slice(0, 4) + '-' + body.slice(4, 8) + '-' + body.slice(8) : String(k || '').toUpperCase().trim();
}

class AuthError extends Error { constructor(msg, code) { super(msg); this.code = code || ''; } }

function checkInputs({ email, password, username }, needName) {
  if (!EMAIL_RE.test(email || '')) throw new AuthError('Bitte gib eine gültige E-Mail-Adresse ein.', 'email');
  if (password != null && password.length < 8) throw new AuthError('Das Passwort braucht mindestens 8 Zeichen.', 'password');
  if (needName && !NAME_RE.test(username || '')) throw new AuthError('Der Spielername muss 3–16 Zeichen lang sein (Buchstaben, Zahlen, _).', 'username');
}

// Supabase-Fehlermeldungen auf Deutsch
function germanError(e) {
  const m = String(e && (e.message || e.error_description || e) || '');
  if (/Invalid login credentials/i.test(m)) return new AuthError('E-Mail oder Passwort ist falsch.', 'credentials');
  if (/Email not confirmed/i.test(m)) return new AuthError('Dein Konto ist noch nicht bestätigt. Gib den Code aus der E-Mail ein.', 'not_confirmed');
  if (/already registered|already been registered/i.test(m)) return new AuthError('Für diese E-Mail gibt es schon ein Konto.', 'exists');
  if (/Token has expired|invalid|otp/i.test(m) && /token|otp|code/i.test(m)) return new AuthError('Der Code ist falsch oder abgelaufen.', 'code');
  if (/only request this after|rate limit|too many/i.test(m)) return new AuthError('Bitte warte einen Moment und versuche es dann noch einmal.', 'rate');
  if (/Password should be|weak password/i.test(m)) return new AuthError('Das Passwort ist zu schwach. Nimm mindestens 8 Zeichen mit Buchstaben und Zahlen.', 'password');
  if (/KREAKS_KEY|Database error saving new user/i.test(m)) return new AuthError('Der Key ist ungültig oder wurde schon benutzt.', 'key');
  if (/duplicate key/i.test(m)) return new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
  if (/KREAKS_NICHT_FREIGESCHALTET/i.test(m)) return new AuthError('Dein Konto ist noch nicht freigeschaltet.', 'license');
  if (/Keine Admin-Rechte/i.test(m)) return new AuthError('Dafür brauchst du Admin-Rechte.', 'admin');
  if (/Failed to fetch|NetworkError|network|abort/i.test(m)) return new AuthError('Keine Verbindung zum Anmeldeserver. Bist du online?', 'offline');
  if (/same.*password|different from the old/i.test(m)) return new AuthError('Das neue Passwort muss sich vom alten unterscheiden.', 'password');
  return new AuthError(m || 'Unbekannter Fehler', 'other');
}

// ------------------------------------------------------------
class SupaAuth {
  constructor(url, key) {
    this.demo = false;
    this.sb = window.supabase.createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'kreaks-auth', detectSessionInUrl: false },
      // Nach 15 Sekunden ohne Antwort abbrechen, statt ewig zu warten
      global: { fetch: (url, opt = {}) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000); return fetch(url, Object.assign({}, opt, { signal: c.signal })).finally(() => clearTimeout(t)); } }
    });
  }
  async _account(user) {
    let name = user.user_metadata && user.user_metadata.username || '', licensed = false, admin = false;
    try {
      const { data, error } = await this.sb.rpc('my_status');
      if (error) throw error;
      if (data) { name = data.username || name; licensed = !!data.licensed; admin = !!data.is_admin; }
      this.sb.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', user.id).then(() => {}, () => {});
    } catch {
      // offline: zuletzt bekannten Stand verwenden
      try { const c = JSON.parse(localStorage.getItem('kreaks-status-' + user.id)) || {}; licensed = !!c.licensed; admin = !!c.admin; name = c.name || name; } catch { /* nichts */ }
    }
    try { localStorage.setItem('kreaks-status-' + user.id, JSON.stringify({ licensed, admin, name })); } catch { /* egal */ }
    return { uuid: user.id, email: user.email, name: name || 'Spieler', licensed, admin };
  }
  async current() {
    const { data } = await this.sb.auth.getSession();
    return data && data.session ? this._account(data.session.user) : null;
  }
  async usernameAvailable(name) {
    if (!NAME_RE.test(name)) return false;
    const { data, error } = await this.sb.rpc('username_available', { name });
    if (error) throw germanError(error);
    return !!data;
  }
  async keyStatus(k) {
    k = normKey(k); if (!KEY_RE.test(k)) return 'ungueltig';
    const { data, error } = await this.sb.rpc('key_status', { k });
    if (error) throw germanError(error);
    return data;
  }
  async signUp(email, password, username, key) {
    checkInputs({ email, password, username }, true);
    key = normKey(key);
    const ks = await this.keyStatus(key);
    if (ks === 'benutzt') throw new AuthError('Dieser Key wurde schon benutzt.', 'key');
    if (ks !== 'frei') throw new AuthError('Dieser Key ist ungültig. Prüfe die Schreibweise (KRKS-XXXX-XXXX-XXXX).', 'key');
    if (!(await this.usernameAvailable(username))) throw new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
    const { data, error } = await this.sb.auth.signUp({ email, password, options: { data: { username, license_key: key } } });
    if (error) throw germanError(error);
    // Supabase meldet bei bereits bestätigten Adressen keinen Fehler, sondern einen Nutzer ohne Identitäten
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) throw new AuthError('Für diese E-Mail gibt es schon ein Konto.', 'exists');
    if (data.session) return { account: await this._account(data.session.user) }; // Bestätigung im Projekt abgeschaltet
    return { needsCode: true };
  }
  async verifySignup(email, code) {
    const { data, error } = await this.sb.auth.verifyOtp({ email, token: code.trim(), type: 'signup' });
    if (error) throw germanError(error);
    return this._account(data.user);
  }
  async resend(email) {
    const { error } = await this.sb.auth.resend({ type: 'signup', email });
    if (error) throw germanError(error);
  }
  async signIn(email, password) {
    checkInputs({ email, password: null });
    const { data, error } = await this.sb.auth.signInWithPassword({ email, password });
    if (error) throw germanError(error);
    return this._account(data.user);
  }
  async forgot(email) {
    checkInputs({ email, password: null });
    const { error } = await this.sb.auth.resetPasswordForEmail(email);
    if (error) throw germanError(error);
  }
  async resetWithCode(email, code, newPassword) {
    if ((newPassword || '').length < 8) throw new AuthError('Das Passwort braucht mindestens 8 Zeichen.', 'password');
    const { error } = await this.sb.auth.verifyOtp({ email, token: code.trim(), type: 'recovery' });
    if (error) throw germanError(error);
    const r = await this.sb.auth.updateUser({ password: newPassword });
    if (r.error) throw germanError(r.error);
    const { data } = await this.sb.auth.getUser();
    return this._account(data.user);
  }
  async signOut() { try { await this.sb.auth.signOut(); } catch { localStorage.removeItem('kreaks-auth'); } }
  async redeemKey(k) {
    k = normKey(k); if (!KEY_RE.test(k)) throw new AuthError('So sieht ein Key nicht aus: KRKS-XXXX-XXXX-XXXX', 'key');
    const { data, error } = await this.sb.rpc('redeem_key', { k });
    if (error) throw germanError(error);
    if (!data) throw new AuthError('Der Key ist ungültig oder wurde schon benutzt.', 'key');
    return this.current();
  }
  async gameKey(wrapped) {
    const { data, error } = await this.sb.rpc('unwrap_game_key', { wrapped });
    if (error) throw germanError(error);
    return String(data || '').trim();
  }
  async adminCreateKeys(anzahl, notiz) {
    const { data, error } = await this.sb.rpc('admin_create_keys', { anzahl, notiz: notiz || null });
    if (error) throw germanError(error);
    return (data || []).map(r => typeof r === 'string' ? r : r.admin_create_keys);
  }
  async adminListKeys() {
    const { data, error } = await this.sb.rpc('admin_list_keys');
    if (error) throw germanError(error);
    return data || [];
  }
  async adminDeleteKey(k) {
    const { data, error } = await this.sb.rpc('admin_delete_key', { k });
    if (error) throw germanError(error);
    return !!data;
  }
}

// ------------------------------------------------------------
// Demo: Konten liegen nur in diesem Launcher. Statt einer E-Mail wird der Code angezeigt.
class DemoAuth {
  constructor(showCode) { this.demo = true; this.showCode = showCode; }
  _db() { try { return JSON.parse(localStorage.getItem('kreaks-demo-accounts')) || {}; } catch { return {}; } }
  _save(db) { localStorage.setItem('kreaks-demo-accounts', JSON.stringify(db)); }
  async _hash(pw) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kreaks|' + pw)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  _code(email, kind) { const c = String(Math.floor(100000 + Math.random() * 900000)); const db = this._db(); db[email].code = { c, kind, until: Date.now() + 15 * 60000 }; this._save(db); this.showCode(c, email); }
  _acc(email) { const a = this._db()[email]; return { uuid: a.uuid, email, name: a.name, demo: true, licensed: !!a.licensed, admin: !!a.admin }; }
  _keys() { try { const k = JSON.parse(localStorage.getItem('kreaks-demo-keys')); if (k) return k; } catch { /* neu */ } const k = { 'KRKS-DEMO-TEST-2345': { note: 'Demo', created: Date.now() } }; this._saveKeys(k); return k; }
  _saveKeys(k) { localStorage.setItem('kreaks-demo-keys', JSON.stringify(k)); }
  async keyStatus(k) { k = normKey(k); const e = this._keys()[k]; return !e ? 'ungueltig' : e.usedBy ? 'benutzt' : 'frei'; }
  _useKey(k, email) { const keys = this._keys(); keys[k].usedBy = this._db()[email].name; keys[k].usedAt = Date.now(); this._saveKeys(keys); }
  async current() { const e = localStorage.getItem('kreaks-demo-session'); const db = this._db(); return e && db[e] && db[e].confirmed ? this._acc(e) : null; }
  async usernameAvailable(name) { return NAME_RE.test(name) && !Object.values(this._db()).some(a => a.name.toLowerCase() === name.toLowerCase()); }
  async signUp(email, password, username, key) {
    checkInputs({ email, password, username }, true); email = email.toLowerCase(); key = normKey(key);
    const ks = await this.keyStatus(key);
    if (ks !== 'frei') throw new AuthError(ks === 'benutzt' ? 'Dieser Key wurde schon benutzt.' : 'Dieser Key ist ungültig. Prüfe die Schreibweise (KRKS-XXXX-XXXX-XXXX).', 'key');
    const db = this._db();
    if (db[email] && db[email].confirmed) throw new AuthError('Für diese E-Mail gibt es schon ein Konto.', 'exists');
    if (!(await this.usernameAvailable(username)) && !(db[email] && db[email].name === username)) throw new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
    const first = !Object.keys(db).length;
    db[email] = { uuid: crypto.randomUUID(), name: username, pw: await this._hash(password), confirmed: false, licensed: true, admin: first };
    this._save(db); this._useKey(key, email); this._code(email, 'signup');
    return { needsCode: true };
  }
  _check(email, code, kind) {
    const a = this._db()[email];
    if (!a || !a.code || a.code.kind !== kind || a.code.c !== code.trim() || Date.now() > a.code.until) throw new AuthError('Der Code ist falsch oder abgelaufen.', 'code');
  }
  async verifySignup(email, code) {
    email = email.toLowerCase(); this._check(email, code, 'signup');
    const db = this._db(); db[email].confirmed = true; delete db[email].code; this._save(db);
    localStorage.setItem('kreaks-demo-session', email); return this._acc(email);
  }
  async resend(email) { email = email.toLowerCase(); if (this._db()[email]) this._code(email, 'signup'); }
  async signIn(email, password) {
    checkInputs({ email, password: null }); email = email.toLowerCase();
    const a = this._db()[email];
    if (!a || a.pw !== await this._hash(password)) throw new AuthError('E-Mail oder Passwort ist falsch.', 'credentials');
    if (!a.confirmed) throw new AuthError('Dein Konto ist noch nicht bestätigt. Gib den Code aus der E-Mail ein.', 'not_confirmed');
    localStorage.setItem('kreaks-demo-session', email); return this._acc(email);
  }
  async forgot(email) { checkInputs({ email, password: null }); email = email.toLowerCase(); if (this._db()[email]) this._code(email, 'recovery'); }
  async resetWithCode(email, code, newPassword) {
    email = email.toLowerCase();
    if ((newPassword || '').length < 8) throw new AuthError('Das Passwort braucht mindestens 8 Zeichen.', 'password');
    this._check(email, code, 'recovery');
    const db = this._db(); db[email].pw = await this._hash(newPassword); db[email].confirmed = true; delete db[email].code; this._save(db);
    localStorage.setItem('kreaks-demo-session', email); return this._acc(email);
  }
  async signOut() { localStorage.removeItem('kreaks-demo-session'); }
  async redeemKey(k) {
    k = normKey(k); const e = localStorage.getItem('kreaks-demo-session');
    if ((await this.keyStatus(k)) !== 'frei') throw new AuthError('Der Key ist ungültig oder wurde schon benutzt.', 'key');
    const db = this._db(); db[e].licensed = true; this._save(db); this._useKey(k, e); return this._acc(e);
  }
  async gameKey() { throw new AuthError('Im Demo-Modus können keine verschlüsselten Versionen geladen werden.', 'demo'); }
  async adminCreateKeys(n, note) {
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', keys = this._keys(), out = [];
    for (let i = 0; i < n; i++) { const r = crypto.getRandomValues(new Uint8Array(12)); let s = 'KRKS'; r.forEach((b, j) => { if (j % 4 === 0) s += '-'; s += A[b % 32]; }); keys[s] = { note: note || null, created: Date.now() }; out.push(s); }
    this._saveKeys(keys); return out;
  }
  async adminListKeys() { return Object.entries(this._keys()).map(([key, v]) => ({ key, note: v.note, source: 'code', created_at: new Date(v.created).toISOString(), used_at: v.usedAt ? new Date(v.usedAt).toISOString() : null, used_by_name: v.usedBy || null })).sort((a, b) => b.created_at.localeCompare(a.created_at)); }
  async adminDeleteKey(k) { const keys = this._keys(); if (!keys[k] || keys[k].usedBy) return false; delete keys[k]; this._saveKeys(keys); return true; }
}

window.KreaksAuth = { SupaAuth, DemoAuth, AuthError, NAME_RE, KEY_RE, normKey };
