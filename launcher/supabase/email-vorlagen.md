# E-Mail-Vorlagen für Supabase

Im Supabase-Dashboard: **Authentication → Emails → Templates**.
Wichtig: In beiden Vorlagen muss `{{ .Token }}` vorkommen, denn das ist der Code, den man im Launcher eingibt.

---

## Confirm signup (Konto bestätigen)

**Subject:**
```
Dein KREAKS-Bestätigungscode: {{ .Token }}
```

**Body (HTML):**
```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#15201a;color:#e9efe3;padding:28px;border-radius:6px">
  <h1 style="color:#f2cf6b;letter-spacing:4px;margin:0 0 16px">KREAKS</h1>
  <p>Willkommen bei KREAKS!</p>
  <p>Gib diesen Code im Launcher ein, um dein Konto zu bestätigen:</p>
  <p style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#f2cf6b;background:#0b110d;padding:14px;text-align:center">{{ .Token }}</p>
  <p style="color:#93a996;font-size:13px">Der Code ist eine Stunde gültig. Wenn du dich nicht bei KREAKS registriert hast, kannst du diese E-Mail einfach ignorieren.</p>
</div>
```

---

## Reset password (Passwort zurücksetzen)

**Subject:**
```
Dein KREAKS-Code zum Zurücksetzen: {{ .Token }}
```

**Body (HTML):**
```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#15201a;color:#e9efe3;padding:28px;border-radius:6px">
  <h1 style="color:#f2cf6b;letter-spacing:4px;margin:0 0 16px">KREAKS</h1>
  <p>Du hast ein neues Passwort angefordert.</p>
  <p>Gib diesen Code im Launcher unter „Passwort vergessen“ ein:</p>
  <p style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#f2cf6b;background:#0b110d;padding:14px;text-align:center">{{ .Token }}</p>
  <p style="color:#93a996;font-size:13px">Wenn du das nicht warst, ignoriere diese E-Mail – dein Passwort bleibt unverändert.</p>
</div>
```
