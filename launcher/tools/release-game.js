#!/usr/bin/env node
// Neue Spielversion für den Launcher vorbereiten (verschlüsselt).
//
//   npm run release-game -- <Spielordner oder Zip> <Build-Nummer> [Optionen]
//
// Beispiel:
//   npm run release-game -- ../pkg/KREAKS 0.0.76 --label Beta-1.0 --notes "Neue Höhlen und Boote"
//
// Optionen:
//   --label "Beta-1.0"          Versionsname, den Jonas festlegt (Standard: keiner)
//   --name  "KREAKS Beta-1.0"   Anzeigename (Standard: "KREAKS <Label>" bzw. "KREAKS <Build>")
//   --notes "Text"              Was ist neu?
//   --channel release|beta      Kanal (Standard: release)
//   --date  2026-10-07          Datum (Standard: heute)
//   --out   <Ordner>            Ausgabeordner (Standard: dist-game)
//   --revoke "0.0.74,V74"       Diese Versionen werden aus der Liste genommen und bei Spielern gelöscht
//   --news-title / --news-text  Optional eine Nachricht für die Startseite
//
// Ergebnis im Ausgabeordner:
//   KREAKS-<Build>.kreaks  – das verschlüsselte Spiel (AES-256-GCM)
//   versions.json          – die fortgeschriebene Versionsliste
// Der Schlüssel jeder Version wird mit dem öffentlichen Spielschlüssel (tools/game-public-key.asc)
// verpackt. Entpacken kann ihn nur die Datenbank – und nur für freigeschaltete Konten.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

(async () => {
  const args = process.argv.slice(2);
  const opt = {}; const pos = [];
  for (let i = 0; i < args.length; i++) { if (args[i].startsWith('--')) opt[args[i].slice(2)] = args[++i]; else pos.push(args[i]); }
  const [src, id] = pos;
  if (!src || !id) { console.error('Aufruf: npm run release-game -- <Spielordner oder Zip> <Build-Nummer> [--label Beta-1.0] [--notes "..."]'); process.exit(1); }
  if (!/^[A-Za-z0-9._-]{1,40}$/.test(id)) { console.error('Die Version darf nur Buchstaben, Zahlen, Punkt, _ und - enthalten.'); process.exit(1); }

  const CONFIG = require('../src/config');
  const out = path.resolve(opt.out || 'dist-game');
  fs.mkdirSync(out, { recursive: true });

  // Spielordner finden (mit index.html)
  function findRoot(dir, d = 0) {
    if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
    if (d > 3) return null;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) { const r = findRoot(path.join(dir, e.name), d + 1); if (r) return r; }
    return null;
  }
  let root, tmp = null;
  if (fs.statSync(src).isDirectory()) root = findRoot(path.resolve(src));
  else { tmp = fs.mkdtempSync(path.join(out, '.tmp-')); new AdmZip(src).extractAllTo(tmp, true); root = findRoot(tmp); }
  if (!root) { console.error('Keine index.html gefunden.'); process.exit(1); }

  // 1) Zip im Speicher bauen
  const zip = new AdmZip();
  zip.addLocalFolder(root, 'KREAKS');
  const plain = zip.toBuffer();
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });

  // 2) Verschlüsseln
  const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([c.update(plain), c.final()]);
  const file = Buffer.concat([Buffer.from('KRKS', 'latin1'), Buffer.from([1]), iv, c.getAuthTag(), enc]);
  const fileName = `KREAKS-${id}.kreaks`;
  fs.writeFileSync(path.join(out, fileName), file);

  // 3) Schlüssel mit dem öffentlichen Spielschlüssel verpacken
  const openpgp = await import('openpgp');
  const pub = await openpgp.readKey({ armoredKey: fs.readFileSync(path.join(__dirname, 'game-public-key.asc'), 'utf8') });
  const wrappedKey = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: key.toString('hex') }), encryptionKeys: pub,
    config: { preferredSymmetricAlgorithm: openpgp.enums.symmetric.aes256, preferredCompressionAlgorithm: openpgp.enums.compression.uncompressed, aeadProtect: false }
  });

  const label = opt.label || '';
  const entry = {
    id, label, name: opt.name || `KREAKS ${label || id}`, channel: opt.channel || 'release',
    date: opt.date || new Date().toISOString().slice(0, 10), notes: opt.notes || '',
    url: CONFIG.GAME_DOWNLOAD_BASE + fileName, size: file.length,
    sha256: crypto.createHash('sha256').update(file).digest('hex'),
    encrypted: true, wrappedKey
  };

  // 4) Versionsliste fortschreiben (vorhandene versions.json im Ausgabeordner wird übernommen)
  const listFile = path.join(out, 'versions.json');
  let list = { latest: null, latestBeta: null, versions: [], revoked: [], news: [] };
  try { list = Object.assign(list, JSON.parse(fs.readFileSync(listFile, 'utf8'))); } catch { /* neue Liste */ }
  const revoke = (opt.revoke || '').split(',').map(s => s.trim()).filter(Boolean);
  list.revoked = [...new Set([...(list.revoked || []), ...revoke])].filter(r => r !== id);
  list.versions = list.versions.filter(v => v.id !== id && !list.revoked.includes(v.id));
  list.versions.unshift(entry);
  if (entry.channel === 'beta') list.latestBeta = id; else list.latest = id;
  if (list.latest && list.revoked.includes(list.latest)) list.latest = (list.versions.find(v => v.channel !== 'beta') || {}).id || null;
  if (opt['news-title'] || opt['news-text']) list.news = [{ kicker: 'Neuigkeiten', title: opt['news-title'] || '', text: opt['news-text'] || '' }];
  fs.writeFileSync(listFile, JSON.stringify(list, null, 2));

  console.log(`Fertig: ${path.join(out, fileName)} (${(file.length / 1048576).toFixed(1)} MB, verschlüsselt)`);
  console.log(`Versionsliste: ${listFile} – neueste Version: ${list.latest}${list.revoked.length ? ' – zurückgezogen: ' + list.revoked.join(', ') : ''}`);
})().catch(e => { console.error(e); process.exit(1); });
