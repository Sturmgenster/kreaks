/* =========================================================
   Fehlerbehebungen (0.0.81)
   ========================================================= */
// Einstellungen sofort speichern, nicht erst beim Schließen des Fensters
for(const[s]of sliders){const el=document.getElementById(s);if(el)el.addEventListener('change',()=>{try{saveSettings();}catch(e){}});}
addEventListener('pagehide',()=>{try{saveSettings();}catch(e){}});
// Zaubermenü gilt als Menü (kein Mausfang)
UI_STATES.add('magbook');
// Im Launcher: Beim Schließen des Spielfensters speichern, aber das Schließen nicht blockieren
// (Electron zeigt keine Rückfrage – die Seite blieb sonst einfach offen)
if(location.protocol==='kreaks:'||window.KREAKS_DEV===true){addEventListener('beforeunload',e=>{try{if(state!=='menu'&&state!=='loading')saveGame();saveSettings();}catch(_){}e.stopImmediatePropagation();},true);}
// Fliegende Völker (Drachen) konnten in Häusern durch die Decke fliegen und von Zimmer zu Zimmer schweben.
// Innenräume haben jetzt eine feste Decke.
const ROOM_CAP={room:2.3,tavern:2.5,hall:3.2,guild:3.2,cave:2.9};
{const a=updatePlayer;updatePlayer=function(dt){a(dt);if(P.x>IN_X){const k=interiorKind(P.x,P.z),cap=ROOM_CAP[k];if(cap!=null){const top=interiorFloor(P.x,P.z)+cap;if(P.y>top){P.y=top;if(P.vy>0)P.vy=0;}}}};}
