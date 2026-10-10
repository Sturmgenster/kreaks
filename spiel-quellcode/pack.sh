#!/bin/bash
# Paket in Originalqualität bauen.
# KREAKS-Spiel.zip = komplettes Paket (für Launcher/GitHub)
# KREAKS-Spiel-Teil1.zip (Spiel ohne Musik) + KREAKS-Spiel-Teil2.zip (Musik) = für den Chat (je < 30 MiB)
set -e
U=/root/.claude/uploads/a884ef4d-9707-5027-99fa-0213de4f1faa
python3 mkpkg.py dev
rm -rf pkg/KREAKS/assets/music pkg/KREAKS/assets/voice
mkdir -p pkg/KREAKS/assets/sfx/chronik pkg/KREAKS/assets/sfx/intro pkg/KREAKS/assets/voice/opa pkg/KREAKS/assets/music
cp -r music_src/. pkg/KREAKS/assets/music/
cp "$U/0c3862b4-ElevenLabs_2026-10-10T02_06_52_Star_Wars_ERz_hler_ivc_sp103_s68_sb51_v4.mp3" pkg/KREAKS/assets/sfx/chronik/erzaehler.mp3
cp voice_src/orig/intro_erzaehler.mp3 pkg/KREAKS/assets/sfx/intro/erzaehler.mp3
cp voice_src/opa/*.mp3 pkg/KREAKS/assets/voice/opa/
chmod -R a+r pkg/KREAKS
rm -f KREAKS-Spiel.zip KREAKS-Spiel-Teil1.zip KREAKS-Spiel-Teil2.zip
(cd pkg && zip -q -9 -r ../KREAKS-Spiel.zip KREAKS)
(cd pkg && zip -q -9 -r ../KREAKS-Spiel-Teil1.zip KREAKS -x 'KREAKS/assets/music/*')
(cd pkg && zip -q -9 -r ../KREAKS-Spiel-Teil2.zip KREAKS/assets/music)
cp kreaks.html kreaks-adventure.html
ls -la KREAKS-Spiel*.zip
