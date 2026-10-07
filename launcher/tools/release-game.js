#!/usr/bin/env node
// Neue Spielversion für den Launcher vorbereiten.
//
//   npm run release-game -- <Spielordner oder Zip> <Version> [Optionen]
//
// Beispiel:
//   npm run release-game -- ../KREAKS-Spiel.zip V75 --notes "Neue Höhlen und Boote"
//   npm run release-game -- ./spiel V76-beta1 --channel beta
//
// Optionen:
//   --name  "KREAKS V75"        Anzeigename (Standard: "KREAKS <Version>")
//   --notes "Text"              Was ist neu?
//   --channel release|beta      Kanal (Standard: release)
//   --date  2026-10-07          Datum (Standard: heute)
//   --base  <URL>               Download-Adresse; {id} wird durch die Version ersetzt
//   --out   <Ordner>            Ausgabeordner (Standard: dist-game)
//   --news-title / --news-text  Optional eine Nachricht für die Startseite
//
// Ergebnis im Ausgabeordner: KREAKS-<Version>.zip und versions.json.
// Beide Dateien in ein GitHub-Release mit dem Tag <Version> hochladen (siehe ANLEITUNG.md).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

const args = process.argv.slice(2);
const opt = {}; const pos = [];
for (let i = 0; i < args.length; i++) { if (args[i].startsWith('--')) opt[args[i].slice(2)] = args[++i]; else pos.push(args[i]); }
const [src, id] = pos;
if (!src || !id) { console.error('Aufruf: npm run release-game -- <Spielordner oder Zip> <Version> [--notes "..."] [--channel beta]'); process.exit(1); }
if (!/^[A-Za-z0-9._-]{1,40}$/.test(id)) { console.error('Die Version darf nur Buchstaben, Zahlen, Punkt, _ und - enthalten.'); process.exit(1); }

const CONFIG = require('../src/config');
const ghBase = CONFIG.GAME_DOWNLOAD_BASE;
const base = opt.base || ghBase;
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

const zipName = `KREAKS-${id}.zip`;
const zip = new AdmZip();
zip.addLocalFolder(root, 'KREAKS');
zip.writeZip(path.join(out, zipName));
if (tmp) fs.rmSync(tmp, { recursive: true, force: true });

const buf = fs.readFileSync(path.join(out, zipName));
const entry = {
  id, name: opt.name || `KREAKS ${id}`, channel: opt.channel || 'release',
  date: opt.date || new Date().toISOString().slice(0, 10), notes: opt.notes || '',
  url: base.replace('{id}', id) + zipName, size: buf.length,
  sha256: crypto.createHash('sha256').update(buf).digest('hex')
};

// Bestehende Liste fortschreiben (aus dem Ausgabeordner oder online geladen und dort abgelegt)
const listFile = path.join(out, 'versions.json');
let list = { latest: null, latestBeta: null, versions: [], news: [] };
try { list = Object.assign(list, JSON.parse(fs.readFileSync(listFile, 'utf8'))); } catch { /* neue Liste */ }
list.versions = list.versions.filter(v => v.id !== id);
list.versions.unshift(entry);
if (entry.channel === 'beta') list.latestBeta = id; else list.latest = id;
if (opt['news-title'] || opt['news-text']) list.news = [{ kicker: 'Neuigkeiten', title: opt['news-title'] || '', text: opt['news-text'] || '' }];
fs.writeFileSync(listFile, JSON.stringify(list, null, 2));

console.log(`Fertig: ${path.join(out, zipName)} (${(buf.length / 1048576).toFixed(1)} MB)`);
console.log(`Versionsliste: ${listFile} – neueste Version: ${list.latest}${list.latestBeta ? ', Beta: ' + list.latestBeta : ''}`);
console.log(`Download-Adresse: ${entry.url}`);
