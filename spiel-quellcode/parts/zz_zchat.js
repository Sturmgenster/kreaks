/* =========================================================
   0.0.105 · Chat und Bewegung
   - Bei offenem Inventar, Chat, Konsole, Laden, Dialog usw. fällt man weiter,
     rutscht aus und landet – man bleibt nicht mehr in der Luft stehen.
     Tasten werden dabei nicht ausgewertet (Tippen bewegt die Figur nicht).
   - Mehrspieler: Text in der Konsole (ohne /) ist ein Chat für alle Spieler.
     Nachrichten stehen bei allen im Chat und in der Konsole und erscheinen
     als Sprechblase über dem Spieler.
   ========================================================= */
const PASSIVE_STATES=new Set(['inventory','console','chat','shop','dialog','journal','skills','craft','map','magbook']);
{const a=updateAnimals;updateAnimals=function(dt){a(dt);
  if(!PASSIVE_STATES.has(state)||!P.stats||P.x===undefined)return;const s=state,rd=rightDown;keys.clear();rightDown=false;state='playing';
  try{updatePlayer(dt);}catch(e){}finally{state=s;rightDown=rd;}};}
// ---------- Chat für alle ----------
function chatBubble(pid,msg){try{const R=REMOTE.get(pid);if(R&&R.y>-900){R.h=R.h||1.85;say(R,msg,Math.max(3.5,Math.min(9,msg.length*.09)));}}catch(e){}}
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(t&&t[0]!=='/'&&typeof MP!=='undefined'&&MP.on){const msg=t.slice(0,140),me=P.char&&P.char.name||'Ich';conHist.unshift(t);conHist=conHist.slice(0,30);
    mpSend({t:'chat',pid:MP.pid,name:me,msg});chatLine(`<b>${mpEsc(me)}:</b> ${mpEsc(msg)}`);conLog(`<b>&lt;${esc(me)}&gt;</b> ${esc(msg)}`);return;}
  return a(raw);};}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='chat'&&m.msg){try{conLog(`<b>&lt;${esc(String(m.name||'?'))}&gt;</b> ${esc(String(m.msg))}`);chatBubble(m.pid,String(m.msg).slice(0,140));}catch(e){}}return a(m,peer);};}
