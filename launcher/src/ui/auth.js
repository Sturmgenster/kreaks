// KREAKS Launcher – Konten
// Zwei Varianten mit derselben Schnittstelle:
//   SupaAuth – echte Konten über Supabase (E-Mail + Passwort, Bestätigungsmail)
//   DemoAuth – nur lokal auf diesem PC, solange Supabase noch nicht eingetragen ist
'use strict';

const NAME_RE = /^[A-Za-z0-9_]{3,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  if (/Database error saving new user|duplicate key/i.test(m)) return new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
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
    let name = user.user_metadata && user.user_metadata.username || '';
    try {
      const { data } = await this.sb.from('profiles').select('username').eq('id', user.id).maybeSingle();
      if (data && data.username) name = data.username;
      this.sb.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', user.id).then(() => {}, () => {});
    } catch { /* offline: Name aus den Metadaten */ }
    return { uuid: user.id, email: user.email, name: name || 'Spieler' };
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
  async signUp(email, password, username) {
    checkInputs({ email, password, username }, true);
    if (!(await this.usernameAvailable(username))) throw new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
    const { data, error } = await this.sb.auth.signUp({ email, password, options: { data: { username } } });
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
}

// ------------------------------------------------------------
// Demo: Konten liegen nur in diesem Launcher. Statt einer E-Mail wird der Code angezeigt.
class DemoAuth {
  constructor(showCode) { this.demo = true; this.showCode = showCode; }
  _db() { try { return JSON.parse(localStorage.getItem('kreaks-demo-accounts')) || {}; } catch { return {}; } }
  _save(db) { localStorage.setItem('kreaks-demo-accounts', JSON.stringify(db)); }
  async _hash(pw) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kreaks|' + pw)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  _code(email, kind) { const c = String(Math.floor(100000 + Math.random() * 900000)); const db = this._db(); db[email].code = { c, kind, until: Date.now() + 15 * 60000 }; this._save(db); this.showCode(c, email); }
  _acc(email) { const a = this._db()[email]; return { uuid: a.uuid, email, name: a.name, demo: true }; }
  async current() { const e = localStorage.getItem('kreaks-demo-session'); const db = this._db(); return e && db[e] && db[e].confirmed ? this._acc(e) : null; }
  async usernameAvailable(name) { return NAME_RE.test(name) && !Object.values(this._db()).some(a => a.name.toLowerCase() === name.toLowerCase()); }
  async signUp(email, password, username) {
    checkInputs({ email, password, username }, true); email = email.toLowerCase();
    const db = this._db();
    if (db[email] && db[email].confirmed) throw new AuthError('Für diese E-Mail gibt es schon ein Konto.', 'exists');
    if (!(await this.usernameAvailable(username)) && !(db[email] && db[email].name === username)) throw new AuthError('Dieser Spielername ist leider schon vergeben.', 'username');
    db[email] = { uuid: crypto.randomUUID(), name: username, pw: await this._hash(password), confirmed: false };
    this._save(db); this._code(email, 'signup');
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
}

window.KreaksAuth = { SupaAuth, DemoAuth, AuthError, NAME_RE };
