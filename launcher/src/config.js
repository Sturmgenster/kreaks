// ============================================================
//  KREAKS Launcher – Einstellungen
//  Hier trägst du deine Supabase-Daten und die Download-Adresse
//  der Spielversionen ein. Mehr dazu in ANLEITUNG.md.
// ============================================================
module.exports = {
  // Supabase: Projekt-Einstellungen → API → "Project URL" und "anon public" Key.
  // Solange hier die Platzhalter stehen, läuft der Launcher im Demo-Modus
  // (Konten werden nur lokal auf diesem PC gespeichert).
  SUPABASE_URL: 'https://hniqsjdcbspabbimnwqt.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_FlopyldpKBhm4YqNmU0tIw_lZysbX1S',

  // Alles liegt als Dateien im GitHub-Repository Sturmgenster/kreaks (Zweig main):
  //  - versions.json              Liste aller Spielversionen
  //  - spiel/KREAKS-<Version>.zip  die Spielversionen
  //  - launcher-update/            Launcher-Updates (latest.yml + Installer)
  GITHUB: 'Sturmgenster/kreaks',
  VERSIONS_URL: 'https://raw.githubusercontent.com/Sturmgenster/kreaks/main/versions.json',
  GAME_DOWNLOAD_BASE: 'https://raw.githubusercontent.com/Sturmgenster/kreaks/main/spiel/',

  // Die Version, die im Launcher mitgeliefert wird (funktioniert ohne Internet).
  BUNDLED_VERSION: { id: '0.0.74', name: 'KREAKS 0.0.74', channel: 'release', date: '2026-10-07',
    notes: 'Mehrspieler Runde 3: Chat, geteilte Drops, Schlafen für alle, Host-Rechte und Passwort.' }
};
