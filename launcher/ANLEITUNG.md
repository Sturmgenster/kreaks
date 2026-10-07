# KREAKS Launcher – Anleitung

Der Launcher bietet:
- Anmelden mit E-Mail und Passwort, mit Bestätigungscode per E-Mail und „Passwort vergessen“
- Spielversionen herunterladen, auswählen und löschen, auch Beta-Versionen und eigene Zip-Dateien
- Automatische Updates für die neueste Spielversion und für den Launcher selbst
- Spielstart in einem eigenen Fenster. Das Spiel erhält die Konto-ID und den Spielernamen.
- Alle Versionen teilen sich die Spielstände.

Solange in `src/config.js` noch Platzhalter stehen, läuft der Launcher im **Demo-Modus**. Konten werden dann nur auf dem eigenen PC gespeichert, und der Code erscheint im Launcher statt per E-Mail.

---

## 1. Supabase einrichten (Konten) – ca. 10 Minuten

1. Auf **supabase.com** registrieren und **New project** anlegen.
   - Name: `kreaks`
   - Region: `Frankfurt (eu-central-1)`
   - Ein Datenbank-Passwort vergeben und gut aufheben
2. **SQL Editor → New query**: den Inhalt von `supabase/setup.sql` einfügen und auf **Run** klicken. Das legt die Spielerprofile an, also eindeutige Spielernamen pro Konto-UUID.
3. **Authentication → Sign In / Providers → Email**:
   - „Enable Email provider“: an
   - „Confirm email“: an
   - „Email OTP Length“: 6
4. **Authentication → Emails → Templates**: die beiden Vorlagen aus `supabase/email-vorlagen.md` übernehmen (Confirm signup und Reset password).
5. **E-Mail-Versand (wichtig!):** Der eingebaute Mailversand von Supabase ist nur zum Testen gedacht. Er schickt nur wenige Mails pro Stunde und nur an Adressen aus deinem eigenen Supabase-Team. Für echte Spieler brauchst du einen eigenen Mail-Dienst:
   - Kostenlos zum Start eignen sich z. B. **Resend** oder **Brevo**.
   - Dort deine Domain bzw. Absenderadresse bestätigen.
   - Die SMTP-Daten unter **Authentication → Emails → SMTP Settings** eintragen.
6. **Project Settings → API**: die **Project URL** und den **anon public** Key in `src/config.js` eintragen. Den anon-Key darf man im Launcher mitliefern, er ist dafür gedacht.

> Den **service_role**-Key niemals in den Launcher packen oder weitergeben!

## 2. Wo die Dateien liegen

Alles liegt im GitHub-Repository **Sturmgenster/kreaks**, Zweig `main`:
- `versions.json`: die Liste aller Spielversionen
- `spiel/KREAKS-<Version>.zip`: die Spielversionen
- `launcher-update/`: der Installer und `latest.yml` für die Launcher-Updates

Der Launcher lädt diese Dateien direkt von `raw.githubusercontent.com`. Releases werden nicht gebraucht.

## 3. Neue Spielversion veröffentlichen

```
npm run release-game -- KREAKS-Spiel.zip V75 --notes "Neue Höhlen, bessere Boote"
```

1. Lege vorher die aktuelle `versions.json` aus dem Repository in den Ordner `dist-game`, damit die alten Einträge erhalten bleiben.
2. Danach `dist-game/KREAKS-V75.zip` nach `spiel/` kopieren und `dist-game/versions.json` ins Hauptverzeichnis des Repositorys.
3. Committen und pushen.

Optionen:
- `--channel beta` für Beta-Versionen
- `--news-title "…" --news-text "…"` für eine Nachricht auf der Startseite

## 4. Launcher bauen

Voraussetzung ist **Node.js** (LTS) von nodejs.org. Dann im Launcher-Ordner:
```
npm install          # einmalig
npm start            # Launcher zum Testen starten
npm run dist         # Windows-Installationsprogramm bauen → dist/KREAKS Launcher Setup x.y.z.exe
```

## 5. Launcher-Update verteilen

1. In `package.json` die `"version"` erhöhen, z. B. auf `1.0.1`.
2. `npm run dist` ausführen.
3. Aus `dist/` die drei Dateien `latest.yml`, `KREAKS-Launcher-Setup-1.0.1.exe` und die passende `.blockmap` in den Ordner `launcher-update/` des Repositorys kopieren.
4. Committen und pushen.

Installierte Launcher prüfen stündlich auf Updates, laden sie im Hintergrund und bieten dann „Jetzt neu starten“ an. Eine Datei darf auf GitHub höchstens 100 MB groß sein. Der Installer hat ca. 80 MB.

## Hinweise

- **Erster Start:** Das Spiel selbst ist nicht im Installer enthalten. Der Launcher lädt beim ersten Start automatisch die neueste Version (ca. 21 MB).
- **Windows-Warnung „Der Computer wurde durch Windows geschützt“:** Sie erscheint, weil der Launcher noch nicht digital signiert ist. Klicke auf „Weitere Informationen“ und dann „Trotzdem ausführen“. Ein Code-Signing-Zertifikat behebt das, kostet aber etwa 100–300 € pro Jahr.
- **Speicherorte unter Windows:**
  - Spielversionen: `%APPDATA%\KREAKS Launcher\versions`, erreichbar über „Ordner öffnen“ im Launcher
  - Einstellungen und Spielstände: ebenfalls in `%APPDATA%\KREAKS Launcher`
- **Mehrspieler:** Wenn das Spiel aus dem Launcher startet, ist die Spieler-ID fest an das Konto gebunden. Eine Sperre durch den Host gilt also für das Konto und nicht nur für einen PC.
