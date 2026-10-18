/* =========================================================
   0.0.121 · Mehrspieler: mehr Dinge für alle gleich
   - Uhrzeit: Die Vorspann-Szenen eines neuen Mitspielers stellen nicht mehr die Uhr der ganzen Welt um
     (vorher wurde es beim Beitritt plötzlich Nacht). Nur echtes Schlafen schickt die Zeit weiter.
   - Fledermäuse und reisende Gildenabenteurer/Räuber rechnet der Host. Alle sehen dieselben.
     Räuber greifen jeden Spieler an und rauben auch Mitspieler aus. Wer Friedliche angreift, wird selbst gemeldet.
   - Reisende Händler stehen auf allen Geräten an derselben Stelle (Position folgt der Weltzeit).
   ========================================================= */
// ---------- Uhrzeit ----------
{const ts=trySleep;trySleep=function(){MP.sleptAt=time;return ts.apply(this,arguments);};}
const mpInCine=()=>state==='cutscene'||(typeof IN!=='undefined'&&IN&&IN.on)||(typeof FIN!=='undefined'&&FIN&&FIN.on);
mpTimeWatch=function(){if(!MP.on||!MP.ready)return;const t=(FLAGS.day||0)*1440+(FLAGS.clock||0);if(MP.jumpByHost){MP.jumpByHost=false;mpLastClock=t;return;}
  if(mpLastClock!=null&&t-mpLastClock>45&&!mpInCine()&&time-(MP.sleptAt||-99)<10){if(MP.role==='client'){MP.sleepPush=time;mpSend({t:'settime',day:FLAGS.day,clock:FLAGS.clock,name:P.char&&P.char.name},MP.hostPeer());}
    else if(MP.role==='host')mpSend({t:'slept',name:P.char&&P.char.name});}mpLastClock=t;};
// Eine Zwischensequenz läuft: die Uhr der Welt nicht übernehmen (sie gehört der Szene). Danach gleicht der Host wieder ab.
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='time'&&MP.role!=='host'&&mpInCine())return;return a(m,peer);};}
// Der Host spielt eine Zwischensequenz: keine Uhrzeit an die anderen schicken
{const a=mpSend;mpSend=function(m,to){if(m&&m.t==='time'&&MP.role==='host'&&mpInCine())return;return a(m,to);};}
// ---------- Fledermäuse: nur der Host ----------
{const a=batTick;batTick=function(dt){if(isClient())return;return a(dt);};}
{const a=batSpawn;batSpawn=function(x,z,cmd){const e=a(x,z,cmd);if(e&&!cmd)e.msync=1;return e;};}
// ---------- Gildenabenteurer und Räuber: nur der Host ----------
{const a=advSpawnParty;advSpawnParty=function(force){if(isClient())return;const n0=ADV.parties.length;a(force);if(ADV.parties.length>n0)for(const e of ADV.parties[ADV.parties.length-1].members)e.msync=1;};}
const mpProxies=()=>{const L=[];if(typeof MP_PROXY==='undefined'||!isHostMP())return L;for(const e of MP_PROXY.values())if(DEM.includes(e)&&!e.dead)L.push(e);return L;};
// Räuber und wütende Gruppen greifen auch Mitspieler an
{const a=advFoes;advFoes=function(e){const L=a(e),p=e.party;if(p&&(p.rob||p.angry)&&p.state==='fight'&&!e.foes)for(const q of mpProxies())if(Math.hypot(q.x-e.x,q.z-e.z)<45)L.push(q);return L;};}
// Mitspieler in der Nähe lösen den Hinterhalt aus
{const a=advTick;advTick=function(dt){a(dt);if(!isHostMP())return;for(const p of ADV.parties){if(p.state!=='ambush')continue;for(const q of mpProxies()){if(p.members.some(e=>!e.dead&&Math.hypot(q.x-e.x,q.z-e.z)<24)){p.state='fight';p.fought=true;const m=p.members.find(m=>!m.dead);if(m)say(m,ADV_ROB[(Math.random()*ADV_ROB.length)|0],2.5);break;}}}};}
// Treffer auf Mitspieler: Räuber töten nicht, sie rauben
const mpPeerByPid=pid=>{for(const[peer,p]of MP.peerPid)if(p===pid)return peer;return undefined;};
{const a=advHitEnt;advHitEnt=function(e,t,dmg){if(t&&t.proxy&&e.party&&e.party.rob){e._u=e._u||++mpUid;mpSend({t:'robhit',n:+dmg.toFixed(1),u:e._u},mpPeerByPid(t.proxy));return;}return a(e,t,dmg);};}
// Wer hat die Friedlichen angegriffen? Nur der wird gemeldet.
let ADV_CULPRIT=null;
{const a=advAnger;advAnger=function(p){if(p&&!p.angry&&!p.rob)p.culprit=p.culprit||ADV_CULPRIT||MP.pid;return a(p);};}
{const a=advEnd;advEnd=function(p,i){ADV_CULPRIT=p&&p.culprit||null;try{return a(p,i);}finally{ADV_CULPRIT=null;}};}
{const a=grDemote;grDemote=function(){if(MP.on&&ADV_CULPRIT&&ADV_CULPRIT!==MP.pid){const peer=mpPeerByPid(ADV_CULPRIT);if(peer!=null)mpSend({t:'demote'},peer);return;}return a();};}
{const a=mpHostHit;mpHostHit=function(m,peer){try{const r=m.r;if(r&&r[0]==='dem'){const o=DEM.find(e=>e._u===r[1]);if(o&&o.adv&&o.party&&!o.party.rob&&!o.party.angry){ADV_CULPRIT=MP.peerPid.get(peer)||null;advAnger(o.party);o.party.fought=true;ADV_CULPRIT=null;}}}catch(e){}return a(m,peer);};}
// Mitspieler: friedliche (gespiegelte) Abenteurer angreifen → Host Bescheid sagen
const mpAdvMirrors=()=>{const L=[];if(typeof MP_MIR==='undefined')return L;for(const e of MP_MIR.dem.values())if(e.advName&&!e.dead&&DEM.includes(e))L.push(e);return L;};
{const a=attack;attack=function(){if(isClient()&&state==='playing'&&time>=(P.atkReady||0)){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);for(const e of mpAdvMirrors()){if(e.fac==='demon')continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);
      if(d<2.6&&(dx*fx+dz*fz)/(d||1)>.5){mpSend({t:'advanger',u:e.mirror},MP.hostPeer());e.fac='demon';break;}}}return a();};}
// Mit gespiegelten Abenteurern reden
{const a=storyUse;storyUse=function(){if(state==='playing'&&isClient()){for(const e of mpAdvMirrors()){if(e.fac==='demon')continue;if(Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.6,.82)){const L=ADV_LINES[e.cls]||ADV_LINES.melee;say(e,`Ich bin ${e.advName}, ${GR_NAME[e.rank||1]}. `+L[(Math.random()*L.length)|0],4);return true;}}}return a();};}
// Nachrichten
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t){try{switch(m.t){
  case'robhit':{if(!isClient()&&MP.role!=='client')return;if(state==='dead'||time-(P.robbedT||-999)<300)return;if(cheatOn())return;const S=P.stats,n=m.n*armorFactor(),floor=S.maxHp*.1;P.lastDmg=time;
    try{Snd.hit('sword');}catch(_){}if(S.hp-n<=floor){S.hp=Math.min(S.hp,floor);renderStats();const money=wallet();if(money>0){setWallet(0);renderInv();toast(`Du gehst zu Boden. Die Räuber nehmen dir ${fmtMoney(money)} ab und verschwinden.`);}else toast('Du gehst zu Boden. Die Räuber finden kein Geld bei dir und ziehen fluchend ab.');
      P.robbedT=time;saveGame();mpSend({t:'robbed',u:m.u,amt:money},peer);}else{S.hp-=n;renderStats();}return;}
  case'robbed':{if(!isHostMP())return;const e=DEM.find(x=>x._u===m.u),p=e&&e.party;if(!p||p.state==='leave')return;p.state='leave';const al=advAlive(p);if(m.amt>0&&al.length){al.forEach(x=>x.loot=(x.loot||0)+Math.floor(m.amt/al.length));}
    for(const x of al)say(x,m.amt>0?'Danke für die Spende!':'Nichts?! Pah!',2.5);return;}
  case'advanger':{if(!isHostMP())return;const e=DEM.find(x=>x._u===m.u);if(e&&e.party&&!e.party.rob&&!e.party.angry){ADV_CULPRIT=MP.peerPid.get(peer)||null;advAnger(e.party);e.party.fought=true;ADV_CULPRIT=null;}return;}
  case'demote':{if(MP.role==='host')return;grDemote();return;}}}catch(e){console.error('MP',m.t,e);}}return a(m,peer);};}
