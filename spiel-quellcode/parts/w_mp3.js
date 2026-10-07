/* =========================================================
   V74 · Mehrspieler, Runde 3
   1  Gegenstände: was am Boden liegt, sehen alle. Rechtsklick auf einen Mitspieler gibt ihm,
      was du in der Hand hältst (mit Schleichen den ganzen Stapel).
   2  Chat (T oder Enter) und Meldungen bei Beitritt, Verlassen und Host-Wechsel.
   3  Versionsprüfung beim Beitritt. 4  Weiterleitung (TURN) für strenge Netze.
   5  Besiegt ein Mitspieler etwas, zählt das für seine Aufträge.
   6  Schläft ein Spieler, vergeht die Nacht für alle. 7  Zwischensequenzen sehen alle.
   8  Höhlenmonster sind gleich, wenn ihr in derselben Höhle seid.
   9  Wölfe, Keiler, Löwen, Hyänen, Krokodile und Schlangen jagen jeden Spieler.
   10 Mitfahren im Boot eines anderen. 11 Händler haben bei allen dieselbe Ware.
   12 Host: Spieler rauswerfen, sperren, Passwort.
   ========================================================= */
let GAME_VER='V74';
// ---------- 3 · Version ----------
{const s2=mpSend;mpSend=function(m,to){if(m&&(m.t==='hi'||m.t==='world'))m.ver=GAME_VER;if(m&&m.t==='hi'&&MP.pwHash)m.pw=MP.pwHash;if(m&&m.t==='pose'){m.cv=caveCur&&P.x>CAVE_X0-400?caveCur.i:-1;if(MP.passenger)m.pas=MP.passenger.d.id;}return s2(m,to);};}
// ---------- 4 · TURN ----------
mpNetWeb=function(room){const L=TrysteroLib,turn=[{urls:['turn:openrelay.metered.ca:80','turn:openrelay.metered.ca:443','turns:openrelay.metered.ca:443?transport=tcp'],username:'openrelayproject',credential:'openrelayproject'}];
  const cfg={appId:'kreaks-adventure-mp-1',password:'kreaks:'+room,turnConfig:turn};const r=L.joinRoom(cfg,'w-'+room),act=r.makeAction('k');
  const T={selfId:L.selfId,onJoin:null,onLeave:null,onMsg:null,send(m,to){try{act.send(m,to?{target:to}:undefined);}catch(e){console.error('MP senden',e);}},leave(){try{r.leave();}catch(e){}}};
  act.onMessage=(data,meta)=>{if(T.onMsg)T.onMsg(data,meta&&meta.peerId!=null?meta.peerId:meta);};r.onPeerJoin=p=>{if(T.onJoin)T.onJoin(p);};r.onPeerLeave=p=>{if(T.onLeave)T.onLeave(p);};return T;};
// ---------- 2 · Chat ----------
(function(){const st=document.createElement('style');st.textContent=`
#mpChat{position:fixed;left:16px;bottom:120px;width:min(440px,60vw);z-index:40;pointer-events:none;font-size:15px}
#mpChat .ln{background:rgba(8,12,10,.62);padding:3px 8px;margin-top:3px;width:fit-content;max-width:100%;transition:opacity .6s;text-shadow:1px 1px 0 #000;color:#f2ead8}
#mpChat .ln.sys{color:#c8e6a0;font-style:italic}#mpChat .ln b{color:var(--gold,#f0c860)}#mpChat .ln.old{opacity:0}
#mpChat input{pointer-events:auto;width:100%;margin-top:6px;font:inherit;font-size:16px;padding:6px 10px;background:rgba(8,12,10,.85);color:#fff;border:2px solid #3e5a3a}
#mpInfo .pl{display:flex;justify-content:space-between;align-items:center;gap:6px;margin:3px 0}#mpInfo .pl button{font-size:12px;padding:2px 6px}#mpInfo .pw{display:flex;gap:6px;margin-top:8px}#mpInfo .pw input{flex:1;font:inherit;padding:3px 6px}
#mpPanel .mp-pw{width:100%;margin-top:6px;font:inherit;font-size:15px;padding:5px 10px}`;document.head.appendChild(st);
  const c=document.createElement('div');c.id='mpChat';c.innerHTML='<div id="mpChatLog"></div><input id="mpChatIn" maxlength="140" hidden placeholder="Nachricht … (Enter senden, Esc abbrechen)" autocomplete="off">';document.body.appendChild(c);
  const j=document.querySelector('#mpPanel .mp-join');if(j){const pw=document.createElement('input');pw.id='mpPw';pw.className='mp-pw';pw.type='password';pw.placeholder='Passwort (nur wenn der Host eins gesetzt hat)';pw.addEventListener('keydown',e=>e.stopPropagation());j.after(pw);}})();
function chatLine(html,sys){const L=$('mpChatLog');if(!L)return;const d=document.createElement('div');d.className='ln'+(sys?' sys':'');d.innerHTML=html;L.appendChild(d);while(L.children.length>8)L.firstChild.remove();setTimeout(()=>d.classList.add('old'),12000);}
const mpEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let chatOpen=false;
function openChat(){if(!MP.on||chatOpen)return;chatOpen=true;MP.chatPrev=state;state='chat';keys.clear();const I=$('mpChatIn');I.hidden=false;I.value='';setTimeout(()=>I.focus(),0);for(const d of $('mpChatLog').children)d.classList.remove('old');}
function closeChat(send){const I=$('mpChatIn');if(send&&I.value.trim()){const t=I.value.trim().slice(0,140),me=P.char&&P.char.name||'Ich';mpSend({t:'chat',pid:MP.pid,name:me,msg:t});chatLine(`<b>${mpEsc(me)}:</b> ${mpEsc(t)}`);}
  I.hidden=true;I.blur();chatOpen=false;if(state==='chat')state=MP.chatPrev==='chat'?'playing':(MP.chatPrev||'playing');if(state==='playing'){lock();updateLockHint();}for(const d of $('mpChatLog').children)setTimeout(()=>d.classList.add('old'),5000);}
$('mpChatIn').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();closeChat(true);}else if(e.key==='Escape'){e.preventDefault();closeChat(false);}});
addEventListener('keydown',e=>{if(!MP.on||chatOpen||state!=='playing')return;if(e.code==='KeyT'||e.code==='Enter'){e.preventDefault();openChat();}});
// Meldungen
{const a=mpOnMsg;mpOnMsg=function(m,peer){MP.seen=MP.seen||new Set();if(m&&m.t==='hi'&&m.pid&&!MP.seen.has(m.pid)&&m.pid!==MP.pid&&MP.ready&&(MP.seen.add(m.pid),1))chatLine(`${mpEsc(m.name)} ist der Welt beigetreten.`,true);return a(m,peer);};}
{const a=mpOnLeave;mpOnLeave=function(peer){const pid=MP.peerPid.get(peer),nm=pid&&MP.names[pid],wasHost=pid&&pid===MP.host;if(pid&&MP.seen)MP.seen.delete(pid);a(peer);if(nm){chatLine(`${mpEsc(nm)} hat die Welt verlassen.`,true);if(wasHost)chatLine(`${mpEsc(MP.names[MP.host]||(MP.host===MP.pid?'Du':'?'))} ist jetzt der Host.`,true);}};}
// ---------- 1 · Gegenstände am Boden ----------
let dropUid=0;const DROP_SNAP=new Map();let mpDropT=0;
function mpDropTick(){if(!MP.on||!MP.ready)return;const cur=new Map();
  for(const d of drops){if(!d.drop)continue;if(!d._u){d._u=MP.pid+'.'+(++dropUid);mpSend({t:'drop+',u:d._u,id:d.id,n:d.n,x:+d.x.toFixed(2),y:+d.y.toFixed(2),z:+d.z.toFixed(2),g:d.grave?1:0});}cur.set(d._u,d.n);}
  for(const[u,n]of DROP_SNAP){if(!cur.has(u))mpSend({t:'drop-',u});else if(cur.get(u)!==n)mpSend({t:'dropn',u,n:cur.get(u)});}
  DROP_SNAP.clear();for(const[u,n]of cur)DROP_SNAP.set(u,n);}
function mpDropMsg(m){if(m.t==='drop+'){if(drops.some(d=>d._u===m.u)||!ITEMS[m.id])return;MP.noDropFwd=true;try{MP.virtual=false;baseSpawnDrop(m.id,m.n,m.x,m.y,m.z);}finally{MP.noDropFwd=false;}const d=drops[drops.length-1];if(d){d._u=m.u;if(m.g)d.grave=true;DROP_SNAP.set(m.u,d.n);}}
  else if(m.t==='drop-'){const i=drops.findIndex(d=>d._u===m.u);if(i>=0){if(target===drops[i])target=null;drops.splice(i,1);}DROP_SNAP.delete(m.u);}
  else if(m.t==='dropn'){const d=drops.find(d=>d._u===m.u);if(d){d.n=m.n;DROP_SNAP.set(m.u,m.n);}}}
// Die echte Funktion (ohne Weiterleitung an den Schützen) für empfangene Gegenstände
let baseSpawnDrop=null;
// ---------- 1 · Geben ----------
function remoteLooked(){let best=null,bd=4;for(const R of REMOTE.values()){if(time-R.seen>4)continue;const d=Math.hypot(R.x-P.x,R.z-P.z);if(d<bd&&lookingAt(R.x,R.y+1,R.z,4.5,.85)){bd=d;best=R;}}return best;}
{const su2=storyUse;storyUse=function(){if(MP.on&&MP.ready&&state==='playing'){const R=remoteLooked(),h=inv[HOT0+sel];if(R&&h){const n=down('sneak')?h.n:1,id=h.id,d=h.d;const peer=[...MP.peerPid].find(([,p])=>p===R.pid);if(peer){
      removeItem(id,n);mpSend({t:'give',id,n,d,from:P.char&&P.char.name},peer[0]);chatLine(`Du hast ${mpEsc(R.name)} ${n>1?n+'× '+mpEsc(plural(id)):mpEsc(ITEMS[id].name)} gegeben.`,true);Snd.pickup();return true;}}}return su2();};}
// ---------- 5 · Besiegt: zählt für die Aufträge des Schützen ----------
function mpAliveOf(o,r){if(!o)return false;if(r[0]==='dem')return!o.dead;if(r[0]==='s'&&r[1]==='ani')return!!o.alive;return!o.dead;}
{const a=mpHostHit;mpHostHit=function(m,peer){const r=m.r;let o=null;if(r[0]==='s'){const A=MG_GET[r[1]]&&MG_GET[r[1]]();o=A&&A[r[2]];}else if(r[0]==='dem')o=DEM.find(e=>e._u===r[1]);else if(r[0]==='wm')o=WM.find(x=>x._u===r[1]);else if(r[0]==='spy')o=spy;else if(r[0]==='cave')o=caveMobs[r[1]];
  const before=mpAliveOf(o,r);if(r[0]==='cave'){if(o){MP.lootTo=peer;try{hurtCaveMob(o,m.n,'player');}finally{MP.lootTo=null;}}}else a(m,peer);
  if(o&&before&&!mpAliveOf(o,r))mpSend({t:'kill',k:{g:r[0]==='s'?r[1]:r[0],type:o.type||o.sp||'',nm:!!o.nm,boss:!!(o.d&&o.d.boss)}},peer);};}
function mpVirtualKill(k){MP.virtual=true;try{if(k.g==='dem'&&DT[k.type]){const e={type:k.type,d:DT[k.type],dead:false,alive:true,hp:0,max:1,nm:k.nm,x:P.x,y:P.y,z:P.z,fac:'virtual',h:1,w:1};killEnt(e,'player');}
    else if(k.g==='ani'&&ANIMALS[k.type]){const a={type:k.type,alive:true,hp:1,x:P.x,y:P.y,z:P.z,h:1,w:1,kind:'animal'};hurtAnimal(a,99999);}}catch(e){console.error('MP Kill',e);}finally{MP.virtual=false;}}
{const a=mayorProgress;mayorProgress=function(t,n){if(MP.lootTo)return;return a(t,n);};}
// ---------- 6 · Schlafen: einer reicht ----------
{const ts1=trySleep;trySleep=function(){const was=MP.order;if(MP.on){const o=MP.order;MP.order=[MP.pid];try{return ts1.apply(this,arguments);}finally{MP.order=o;}}return ts1.apply(this,arguments);};}
let mpLastClock=null;
function mpTimeWatch(){if(!MP.on||!MP.ready)return;const t=(FLAGS.day||0)*1440+(FLAGS.clock||0);if(MP.jumpByHost){MP.jumpByHost=false;mpLastClock=t;return;}if(mpLastClock!=null&&t-mpLastClock>45){if(MP.role==='client'){MP.sleepPush=time;mpSend({t:'settime',day:FLAGS.day,clock:FLAGS.clock,name:P.char&&P.char.name},MP.hostPeer());}
    else if(MP.role==='host')mpSend({t:'slept',name:P.char&&P.char.name});}mpLastClock=t;}
// ---------- 7 · Zwischensequenzen für alle ----------
{const pc0=playCine;playCine=function(lines,onEnd){if(MP.on&&MP.ready&&!MP.remoteCine){const L=(lines||[]).filter(l=>l&&l.t).map(l=>({who:l.who||'',t:String(l.t)}));if(L.length)mpSend({t:'cine',lines:L});}return pc0(lines,onEnd);};}
// ---------- 8 · Höhlen ----------
function mpCaveSnap(){if(!caveCur||P.x<CAVE_X0-400)return null;const ci=caveCur.i;let any=false;for(const R of REMOTE.values())if(R.cv===ci)any=true;if(!any)return null;return{ci,mobs:caveMobs.map(o=>mpPrims(o))};}
function mpCaveApply(c){if(!c||!caveCur||caveCur.i!==c.ci||P.x<CAVE_X0-400)return;while(caveMobs.length>c.mobs.length)caveMobs.pop();
  c.mobs.forEach((st,i)=>{let o=caveMobs[i];if(!o){o={};caveMobs.push(o);}const k=Math.min(1,.5);for(const f in st){if((f==='x'||f==='z')&&typeof o[f]==='number'&&Math.abs(st[f]-o[f])<6)o[f]+=(st[f]-o[f])*k;else o[f]=st[f];}MP_REF.set(o,['cave',i]);});}
{const a=hurtCaveMob;hurtCaveMob=function(m,n,by){if(isClient()&&MP_REF.has(m)){mpFwd(m,n);return;}return a(m,n,by);};}
// ---------- 9 · Raubtiere jagen jeden Spieler ----------
function mpNearestPlayer(x,z){let best=null,bd=Math.hypot(P.x-x,P.z-z);for(const R of REMOTE.values()){if(time-R.seen>4||R.ty<-900)continue;const d=Math.hypot(R.x-x,R.z-z);if(d<bd){bd=d;best=R;}}return best;}
function mpAsPlayer(R,fn){const peer=[...MP.peerPid].find(([,p])=>p===R.pid);if(!peer)return fn();const sx=P.x,sy=P.y,sz=P.z,vx=P.vx,vz=P.vz,st=state;P.x=R.x;P.y=R.y;P.z=R.z;MP.dmgTo=peer[0];if(st!=='playing'&&st!=='dead')state='playing';try{return fn();}finally{P.x=sx;P.y=sy;P.z=sz;P.vx=vx;P.vz=vz;MP.dmgTo=null;state=st;}}
{const a=takeDamage;takeDamage=function(n){if(MP.dmgTo){mpSend({t:'dmg',n:+n.toFixed(1)},MP.dmgTo);return;}return a(n);};}
{const a=predator;predator=function(o,A,dp,dt){if(isHostMP()&&MP.order.length>1){const R=mpNearestPlayer(o.x,o.z);if(R)return mpAsPlayer(R,()=>a(o,A,Math.hypot(R.x-o.x,R.z-o.z),dt));}return a(o,A,dp,dt);};}
for(const nm of['wLions','wHyenas','wCrocAI','wSnakes','wHerd']){const a=eval(nm);const w=function(g,list,dt){if(isHostMP()&&MP.order.length>1){const R=mpNearestPlayer(g.cx,g.cz);if(R)return mpAsPlayer(R,()=>a(g,list,dt));}return a(g,list,dt);};
  if(nm==='wLions')wLions=w;else if(nm==='wHyenas')wHyenas=w;else if(nm==='wCrocAI')wCrocAI=w;else if(nm==='wSnakes')wSnakes=w;else wHerd=w;}
// ---------- 10 · Mitfahren ----------
function boatDriver(b){if(boatIn===b)return'me';for(const R of REMOTE.values())if(time-R.seen<3&&b.netT>time-1.5&&Math.hypot(R.x-b.d.x,R.z-b.d.z)<b.T.L)return R;return null;}
{const a=boatBoard;boatBoard=function(b){if(MP.on&&!b.T.sail){const drv=boatDriver(b);if(drv&&drv!=='me'){MP.passenger=b;Snd.thud();chatLine(`Du fährst bei ${mpEsc(drv.name)} mit. [${keyName(settings.keys.sneak)}] zum Aussteigen.`,true);return;}}
  if(MP.on&&b.T.sail){/* Schiff: ans Deck wie gehabt */}return a(b);};}
{const a=shipWheelLooked;shipWheelLooked=function(b){if(MP.on&&b.netT>time-1.5)return false;return a(b);};}
{const up2=updatePlayer;updatePlayer=function(dt){const b=MP.passenger;if(!b||state!=='playing'){up2(dt);return;}if(!BOATS.includes(b)){MP.passenger=null;up2(dt);return;}
  const seat=b.T.oars>1?[.9,0]:[b.T.L*.32,0],[x,z]=boatWorld(b,seat[0],seat[1]),py=boatDeckY(b);P.x=x;P.z=z;P.y=py;P.vx=P.vz=P.vy=0;P.ground=true;
  const held=[];for(const k of BOAT_KEYS){const c=settings.keys[k];if(keys.has(c)){keys.delete(c);held.push(c);}}try{up2(dt);}finally{for(const c of held)keys.add(c);}P.x=x;P.z=z;P.y=py;};}
addEventListener('keydown',e=>{if(MP.passenger&&state==='playing'&&e.code===settings.keys.sneak&&!e.repeat){const b=MP.passenger;MP.passenger=null;boatLeave(b);}});
// ---------- 11 · Händler ----------
// Die Tagesware der Marktstände hängt am Weltsamen und am Tag. Beides ist bei allen gleich, also auch die Ware.
// Reisende Händler: ihr Angebot ebenfalls aus dem Weltsamen statt zufällig.
// ---------- 12 · Host-Rechte ----------
const MP_HASH=s=>{let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return(4294967296*(2097151&h2)+(h1>>>0)).toString(36);};
MP_WORLD_MAPS.push('mpBans','mpCfg');MP_KEYS.push('mpBans','mpCfg');
function mpPeerOf(pid){const p=[...MP.peerPid].find(([,q])=>q===pid);return p&&p[0];}
function mpKick(pid,ban){const peer=mpPeerOf(pid);if(ban){FLAGS.mpBans=FLAGS.mpBans||{};FLAGS.mpBans[pid]=MP.names[pid]||'?';}if(peer)mpSend({t:'kick',ban:!!ban},peer);chatLine(`${mpEsc(MP.names[pid]||'?')} wurde ${ban?'gesperrt':'rausgeworfen'}.`,true);MP.order=MP.order.filter(p=>p!==pid);mpSend(mpRosterMsg());mpRenderPauseInfo();}
{const a=mpRenderPauseInfo;mpRenderPauseInfo=function(){a();const el=$('mpInfo');if(!el||!MP.on)return;const ul=el.querySelector('ul');
  if(ul&&MP.role==='host'){ul.innerHTML=MP.order.map(p=>`<li class="pl"><span>${mpEsc(p===MP.pid?(P.char&&P.char.name)||'Du':MP.names[p]||'?')}${p===MP.host?' (Host)':''}</span>${p!==MP.pid?`<span><button class="pbtn notch small" data-k="${p}">Rauswerfen</button> <button class="pbtn notch small" data-b="${p}">Sperren</button></span>`:''}</li>`).join('');
    ul.onclick=e=>{const k=e.target.dataset.k,b=e.target.dataset.b;if(k||b){e.stopPropagation();Snd.click();mpKick(k||b,!!b);}};
    const pw=document.createElement('div');pw.className='pw';pw.innerHTML=`<input id="mpSetPw" type="password" placeholder="${FLAGS.mpCfg&&FLAGS.mpCfg.pw?'Passwort ist gesetzt (neu setzen)':'Passwort für die Welt (optional)'}"><button class="pbtn notch small" id="mpPwBtn">Setzen</button>`;el.appendChild(pw);
    const I=$('mpSetPw');I.addEventListener('keydown',e=>e.stopPropagation());$('mpPwBtn').onclick=e=>{e.stopPropagation();Snd.click();FLAGS.mpCfg=FLAGS.mpCfg||{};const v=I.value.trim();if(v)FLAGS.mpCfg.pw=MP_HASH(MP.code+'|'+v);else delete FLAGS.mpCfg.pw;I.value='';mpRenderPauseInfo();};}};}
// Beitritt prüfen: Sperre, Passwort, Version
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t){try{switch(m.t){
  case'hi':if(MP.role==='host'){if(FLAGS.mpBans&&FLAGS.mpBans[m.pid]){mpSend({t:'kick',ban:true},peer);return;}if(m.ver!==GAME_VER){mpSend({t:'badver',ver:GAME_VER},peer);return;}
      if(FLAGS.mpCfg&&FLAGS.mpCfg.pw&&m.pw!==FLAGS.mpCfg.pw){mpSend({t:'badpass'},peer);return;}}break;
  case'world':MP.jumpByHost=true;if(m.ver&&m.ver!==GAME_VER){mpWaitShow('Andere Spielversion',`Der Host spielt ${m.ver}, du hast ${GAME_VER}. Bitte nutzt dieselbe Version.`,0,null,true,'Zum Hauptmenü',()=>{mpWaitHide();openMenu();});mpStop(true);return;}break;
  case'badver':mpStop(true);mpWaitShow('Andere Spielversion',`Der Host spielt ${m.ver}, du hast ${GAME_VER}. Bitte nutzt dieselbe Version.`,0,null,true,'Zum Hauptmenü',()=>{mpWaitHide();openMenu();});return;
  case'badpass':mpStop(true);mpWaitShow('Falsches Passwort','Diese Welt ist mit einem Passwort geschützt. Gib es im Mehrspieler-Menü unter dem Code ein.',0,null,true,'Zum Hauptmenü',()=>{mpWaitHide();openMenu();});return;
  case'kick':mpStop(true);mpWaitShow(m.ban?'Du wurdest gesperrt.':'Du wurdest rausgeworfen.',m.ban?'Der Host hat dich aus dieser Welt gesperrt.':'Der Host hat dich aus der Welt entfernt.',0,null,true,'Zum Hauptmenü',()=>{mpWaitHide();openMenu();});return;
  case'chat':chatLine(`<b>${mpEsc(m.name)}:</b> ${mpEsc(m.msg)}`);return;
  case'give':{const left=addItem(m.id,m.n);if(left)spawnDrop(m.id,left,P.x,P.y+.4,P.z);chatLine(`${mpEsc(m.from||'Jemand')} hat dir ${m.n>1?m.n+'× '+mpEsc(plural(m.id)):mpEsc(ITEMS[m.id]?ITEMS[m.id].name:m.id)} gegeben.`,true);Snd.pickup();return;}
  case'drop+':case'drop-':case'dropn':mpDropMsg(m);return;
  case'kill':mpVirtualKill(m.k);return;
  case'cine':if(state==='playing'||state==='paused'||state==='inventory'){if(state!=='playing'){show('pause',false);show('inventory',false);state='playing';}MP.remoteCine=true;try{playCine(m.lines,null);}finally{MP.remoteCine=false;}}return;
  case'settime':if(MP.role==='host'){FLAGS.day=m.day;FLAGS.clock=m.clock;chatLine(`${mpEsc(m.name||'Jemand')} hat geschlafen. Ein neuer Tag beginnt.`,true);mpSend({t:'time',tick:Math.round(FLAGS.mp.tick),day:FLAGS.day,clock:FLAGS.clock});}return;
  case'slept':chatLine(`${mpEsc(m.name||'Der Host')} hat geschlafen. Ein neuer Tag beginnt.`,true);return;
  case'time':if(MP.role==='client'&&!MP.jumpByHost)mpTimeWatch();if(MP.sleepPush&&time-MP.sleepPush<4)return;if(MP.role!=='host'&&(Math.abs((FLAGS.clock||0)-m.clock)>3||FLAGS.day!==m.day))MP.jumpByHost=true;break;
  case'pose':{const R=REMOTE.get(m.pid);if(R)R.cv=m.cv;break;}
  case'ent':if(m.cave&&isClient())mpCaveApply(m.cave);break;}}catch(e){console.error('MP',m.t,e);}}return a(m,peer);};}
// Passwort beim Beitreten mitschicken
{const a=mpJoinCode;mpJoinCode=function(raw){const pw=($('mpPw')&&$('mpPw').value||'').trim();MP.pwHash=pw?MP_HASH(mpNorm(raw)+'|'+pw):null;return a(raw);};}
{const a=mpPlaySlot;mpPlaySlot=function(n){const pw=($('mpPw')&&$('mpPw').value||'').trim(),s=store.get(SLOT_KEY(mpSlotKey(n)));MP.pwHash=pw&&s&&s.flags&&s.flags.mp?MP_HASH(s.flags.mp.code+'|'+pw):null;return a(n);};}
// Host: Höhlenmonster in den Schnappschuss
{const a=mpHostSnapshot;mpHostSnapshot=function(){const s0=mpSend;let caught=null;mpSend=function(m,to){if(m&&m.t==='ent'){m.cave=mpCaveSnap();}return s0(m,to);};try{a();}finally{mpSend=s0;}};}
// ---------- Takt ----------
{const a=mpTick;mpTick=function(dt){a(dt);mpDropT+=dt;if(mpDropT>.25){mpDropT=0;try{mpDropTick();mpTimeWatch();}catch(e){console.error('MP Takt',e);}}};}
// Beute und Erfahrung nicht doppelt bei virtuellen Kills; Gegenstände vom Netz nicht zurückschicken
{const a=spawnDrop;baseSpawnDrop=a;spawnDrop=function(id,n,x,y,z){if(MP.virtual)return;return a(id,n,x,y,z);};}
{const a=gainXP;gainXP=function(n){if(MP.virtual)return;return a(n);};}
// Beim Verlassen: Mitfahren beenden
{const a=mpStop;mpStop=function(q){MP.passenger=null;DROP_SNAP.clear();mpLastClock=null;return a(q);};}
