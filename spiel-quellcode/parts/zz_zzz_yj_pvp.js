/* =========================================================
   0.0.139 · PvP und Treffer-Gefühl
   - Mehrspieler: Spieler gegen Spieler. Jeder schaltet PvP für sich ein (Pausenmenü oder /pvp im Chat).
     Angreifen kann man nur Spieler, die PvP ebenfalls eingeschaltet haben. Nahkampf und Pfeile treffen.
     Wer gerade kämpft, kann PvP erst 10 Sekunden nach dem letzten Treffer wieder ausschalten.
     Über Spielern mit PvP steht ein ⚔ im roten Namen. Besiegte Spieler werden im Chat gemeldet.
   - Treffer spürt man: der Bildschirm zuckt kurz und der Rand leuchtet rot auf (stärker bei mehr Schaden).
   ========================================================= */
const PVP={on:false,lastFight:-99,offAt:0,bt:0};
// ---------- Treffer-Gefühl ----------
(()=>{const st=document.createElement('style');st.textContent=`#hurtFx{position:fixed;inset:0;pointer-events:none;z-index:40;opacity:0;background:radial-gradient(ellipse at center,rgba(120,0,0,0) 50%,rgba(160,8,8,.45) 78%,rgba(215,20,20,.9) 100%);box-shadow:inset 0 0 70px 22px rgba(225,20,20,.8)}
#pvpBadge{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:41;pointer-events:none;font:bold 14px Georgia,serif;color:#ffd8d0;background:rgba(120,10,10,.75);border:2px solid #e05040;padding:2px 10px;text-shadow:1px 1px 0 #000}`;
  document.head.appendChild(st);const d=document.createElement('div');d.id='hurtFx';document.body.appendChild(d);const b=document.createElement('div');b.id='pvpBadge';b.hidden=true;b.textContent='⚔ PvP';document.body.appendChild(b);})();
const HURT={t:0,amp:0,last:-9};
function hurtFx(n){const S=P.stats;if(!S||!(n>0))return;const f=Math.min(1,n/S.maxHp),small=f<.02;if(small&&time-HURT.last<.35)return;HURT.last=time;
  const el=$('hurtFx');if(el){el.style.transition='none';el.style.opacity=(small?.3:Math.min(1,.5+f*3)).toFixed(2);void el.offsetWidth;el.style.transition='opacity .65s ease-out';el.style.opacity=0;}
  if(!small){HURT.amp=Math.max(HURT.t>0?HURT.amp:0,Math.min(1,.4+f*4));HURT.t=.3;}}
{const a=placeCamera;placeCamera=function(...r){a(...r);if(HURT.t>0){const A=HURT.amp*HURT.t/.3;camera.position.x+=(Math.random()-.5)*.14*A;camera.position.y+=(Math.random()-.5)*.1*A;camera.position.z+=(Math.random()-.5)*.14*A;camera.rotateZ((Math.random()-.5)*.07*A);camera.rotateX((Math.random()-.5)*.035*A);}};}
{const a=takeDamage;takeDamage=function(...r){const S=P.stats,h0=S?S.hp:0;const res=a.apply(this,r);try{if(S&&S.hp<h0)hurtFx(h0-S.hp);}catch(e){}return res;};}
// ---------- PvP ----------
const pvpOk=R=>PVP.on&&MP.on&&R&&R.pvp&&time-R.seen<5&&R.ty>-900;
function pvpBroadcast(){try{if(MP.on&&MP.ready)mpSend({t:'pvpst',pid:MP.pid,on:PVP.on?1:0});}catch(e){}}
function pvpSetOn(v){if(!MP.on){toast('PvP gibt es nur im Mehrspieler.');return;}if(v===PVP.on&&!PVP.offAt)return;
  if(!v&&time-PVP.lastFight<10){PVP.offAt=PVP.lastFight+10;toast('Du bist noch im Kampf. PvP geht 10 Sekunden nach dem letzten Treffer aus.');return;}
  PVP.on=v;PVP.offAt=0;pvpBroadcast();chatLine(v?'⚔ PvP ist an. Spieler mit PvP können dich angreifen, und du sie.':'PvP ist aus.',true);try{Snd.click();}catch(e){}try{mpRenderPauseInfo();}catch(e){}}
function pvpHit(R,n,kx,kz,vy){const peer=mpPeerOf(R.pid);if(peer==null)return;mpSend({t:'pvp',from:MP.pid,n:+n.toFixed(1),kx:+kx.toFixed(2),kz:+kz.toFixed(2),vy:+(vy||0).toFixed(2)},peer);PVP.lastFight=time;R.fightT=time;
  for(let k=0;k<12;k++)spawnParticle(R.x+(Math.random()-.5)*.6,R.y+1+Math.random()*.6,R.z+(Math.random()-.5)*.6,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,0xc01818,.5,.15);}
function pvpRecv(m){if(!PVP.on||state==='dead'||state==='menu'||state==='loading')return;const R=REMOTE.get(m.from);if(!R||!R.pvp)return;PVP.lastFight=time;const S=P.stats,h0=S.hp;
  takeDamage(m.n);P.vx+=m.kx||0;P.vz+=m.kz||0;if(m.vy>0)P.vy=Math.max(P.vy,m.vy);try{angFoe(m.from);}catch(e){}
  if(h0>0&&S.hp<=0){const me=P.char&&P.char.name||'Ein Spieler';try{mpSend({t:'pvpk',k:m.from,a:R.name||'?',v:me});}catch(e){}chatLine(`⚔ <b>${mpEsc(R.name||'?')}</b> hat dich besiegt.`,true);}}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='pvpst'){const R=REMOTE.get(m.pid);if(R){const was=!!R.pvp;R.pvp=!!m.on;if(was!==R.pvp)chatLine(`${mpEsc(R.name||MP.names[m.pid]||'?')} hat PvP ${R.pvp?'eingeschaltet ⚔':'ausgeschaltet'}.`,true);}return;}
  if(m&&m.t==='pvp'){try{pvpRecv(m);}catch(e){console.error('PvP',e);}return;}
  if(m&&m.t==='pvpk'){if(m.k===MP.pid){toast(`Du hast ${m.v} besiegt!`);chatLine(`⚔ Du hast <b>${mpEsc(m.v)}</b> besiegt.`,true);try{gainXP(25);}catch(e){}}else chatLine(`⚔ <b>${mpEsc(m.a)}</b> hat <b>${mpEsc(m.v)}</b> besiegt.`,true);return;}
  return a(m,peer);};}
// Nahkampf
{const a=attack;attack=function(){const t0=P.atkT,r=a.apply(this,arguments);try{if(PVP.on&&MP.on&&P.atkT!==t0){const W=WEAPONS[weaponOf()]||WEAPONS.fist,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);
    for(const R of REMOTE.values()){if(!pvpOk(R))continue;const dx=R.x-P.x,dz=R.z-P.z,d=Math.hypot(dx,dz);if(d>(W.range||2)+.6||Math.abs(R.y-P.y)>2.2)continue;if((dx*fx+dz*fz)/(d||1)<.45)continue;
      pvpHit(R,W.dmg*dmgMult()*.5,fx*7,fz*7,3);setTimeout(()=>{try{Snd.hit(weaponOf());}catch(_){}},90);}}}catch(e){}return r;};}
// Pfeile
{const a=updateShots;updateShots=function(dt){a(dt);try{if(!PVP.on||!MP.on)return;for(let i=SHOTS.length-1;i>=0;i--){const s=SHOTS[i];if(s.by!=='player')continue;
    for(const R of REMOTE.values()){if(!pvpOk(R))continue;if(Math.hypot(s.x-R.x,s.z-R.z)<.6&&s.y>R.y-.1&&s.y<R.y+(R.h||1.8)+.1){pvpHit(R,(s.dmg||8)*.5,s.vx*.25,s.vz*.25,1.5);SHOTS.splice(i,1);try{Snd.hit('bow');}catch(_){}break;}}}}catch(e){}};}
// Namen: rot mit ⚔
{const a=nameTag;nameTag=function(key,text,...r){let t=text;const R=String(key).startsWith('mp_')?REMOTE.get(String(key).slice(3)):null;if(R&&R.pvp&&t)t+=' ⚔';a(key,t,...r);try{const el=tagEls[key];if(el)el.style.color=R&&R.pvp?'#ff8a7a':'';}catch(e){}};}
// Pausenmenü: Schalter
{const a=mpRenderPauseInfo;mpRenderPauseInfo=function(){a();const el=$('mpInfo');if(!el||!MP.on)return;const d=document.createElement('div');d.style.marginTop='8px';
  d.innerHTML=`<button class="pbtn notch small" id="pvpBtn">${PVP.on?'⚔ PvP: an':'PvP: aus'}</button><div style="font-size:12px;opacity:.8;margin-top:3px">Nur Spieler mit PvP können sich gegenseitig angreifen.</div>`;el.appendChild(d);
  $('pvpBtn').onclick=e=>{e.stopPropagation();pvpSetOn(!PVP.on);mpRenderPauseInfo();};};}
// /pvp im Chat
{const a=closeChat;closeChat=function(send){const I=$('mpChatIn');if(send&&I&&/^\/pvp\b/i.test(I.value.trim())){const v=I.value.trim().split(/\s+/)[1];pvpSetOn(v?/^(an|on|ein)/i.test(v):!PVP.on);I.value='';return a(false);}return a(send);};}
// Takt
function pvpTick(dt){HURT.t=Math.max(0,HURT.t-dt);const B=$('pvpBadge');if(B)B.hidden=!(PVP.on&&MP.on&&state!=='menu');if(!MP.on){PVP.on=false;PVP.offAt=0;return;}
  if(PVP.offAt&&time>=PVP.offAt){if(time-PVP.lastFight>=10){PVP.offAt=0;PVP.on=false;pvpBroadcast();chatLine('PvP ist jetzt aus.',true);}else PVP.offAt=PVP.lastFight+10;}
  PVP.bt-=dt;if(PVP.bt<=0){PVP.bt=4;pvpBroadcast();}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{pvpTick(dt);}catch(e){if(!pvpTick.err){pvpTick.err=1;console.error('PvP Takt',e);}}};}
