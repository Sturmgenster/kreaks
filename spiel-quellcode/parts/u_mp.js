/* =========================================================
   V70 · Mehrspieler (Prototyp)
   - Drei eigene Mehrspieler-Weltplätze. Wer eine Welt startet, ist Host.
   - Weltcode (12 Zeichen) im Pausenmenü. Mit dem Code treten bis zu 6 Spieler bei.
   - Kein eigener Server: Geräte verbinden sich direkt (WebRTC). Zum ersten
     Finden dienen öffentliche Nostr-Relays.
   - Die Welt liegt auf allen Geräten. Jede Änderung (Baum gefällt, Möbel,
     Truhe, Boot …) ist ein Eintrag im Ereignis-Log mit Spieler und Weltzeit.
     Beim Beitritt werden die Logs zusammengeführt (das Neueste gewinnt).
   - Geht der Host, übernimmt der Spieler, der am längsten dabei ist.
   - Spielerdaten (Inventar, Stufe, Quests) bleiben bei jedem Spieler.
   - Tiere und Monster rechnet noch jedes Gerät selbst (kommt später).
   ========================================================= */
// Für Tests: ?ns=b trennt den Speicher eines zweiten Fensters
const MP_NS=(()=>{try{return new URLSearchParams(location.search).get('ns')||'';}catch(e){return'';}})();
if(MP_NS){const g0=store.get.bind(store),s0=store.set.bind(store);store.get=k=>g0(MP_NS+':'+k);store.set=(k,v)=>s0(MP_NS+':'+k,v);}
const MP_MAX=6,MP_ALPHA='ABCDEFGHJKMNPQRSTUVWXYZ23456789',MP_WAIT=60;
const MP_WORLD_MAPS=['harv','felled','mined','chests','caves','wcaves','furnSt','regrow','candyWiped','mercClaims'];
const MP_WORLD_ARRS={furn:e=>e[3],wtorches:e=>e[0]+','+e[1],benches:e=>e[0]+','+e[1],rifts:e=>e.x+','+e.z,boats:e=>e.id};
const MP_KEYS=[...MP_WORLD_MAPS,...Object.keys(MP_WORLD_ARRS)];
function mpRand(n,A){const a=new Uint32Array(n);crypto.getRandomValues(a);let s='';for(const v of a)s+=A[v%A.length];return s;}
function mpNewCode(){return mpRand(12,MP_ALPHA);}
const mpFmt=c=>c?c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8,12):'';
const mpNorm=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
function mpPid(){let p=store.get('kreaks_pid');if(!p){p=mpRand(10,'abcdefghijklmnopqrstuvwxyz0123456789');store.set('kreaks_pid',p);}return p;}
const MP={on:false,code:'',role:'off',pid:'',host:'',order:[],names:{},net:null,peerPid:new Map(),ready:false,fresh:false,pending:null,wait:null,lastPose:0,lastTime:0,lastBackup:0,lastDiff:0,outbox:[],slot:0,joinedAt:{}};
const REMOTE=new Map();
// ---------- Verbindung (direkt über WebRTC, für Tests auch zwischen zwei Fenstern) ----------
function mpNetLocal(room){const ch=new BroadcastChannel('kreaks-mp-'+room),id=mpRand(12,'abcdefghijklmnopqrstuvwxyz0123456789'),peers=new Map();
  const T={selfId:id,onJoin:null,onLeave:null,onMsg:null,send(m,to){ch.postMessage({f:id,to:to||null,m});},leave(){try{ch.postMessage({f:id,bye:1});ch.close();}catch(e){}clearInterval(hb);}};
  ch.onmessage=ev=>{const d=ev.data;if(!d||d.f===id)return;if(d.to&&d.to!==id)return;if(d.bye){if(peers.delete(d.f)&&T.onLeave)T.onLeave(d.f);return;}
    const isNew=!peers.has(d.f);peers.set(d.f,Date.now());if(isNew){if(T.onJoin)T.onJoin(d.f);ch.postMessage({f:id,ping:1});}if(d.m&&T.onMsg)T.onMsg(d.m,d.f);};
  const hb=setInterval(()=>{ch.postMessage({f:id,ping:1});const now=Date.now();for(const[p,t]of[...peers])if(now-t>15000){peers.delete(p);if(T.onLeave)T.onLeave(p);}},1000);
  setTimeout(()=>ch.postMessage({f:id,ping:1}),50);return T;}
function mpNetWeb(room){const L=TrysteroLib,r=L.joinRoom({appId:'kreaks-adventure-mp-1',password:'kreaks:'+room},'w-'+room),act=r.makeAction('k');
  const T={selfId:L.selfId,onJoin:null,onLeave:null,onMsg:null,send(m,to){try{act.send(m,to?{target:to}:undefined);}catch(e){console.error('MP senden',e);}},leave(){try{r.leave();}catch(e){}}};
  act.onMessage=(data,meta)=>{if(T.onMsg)T.onMsg(data,meta&&meta.peerId!=null?meta.peerId:meta);};r.onPeerJoin=p=>{if(T.onJoin)T.onJoin(p);};r.onPeerLeave=p=>{if(T.onLeave)T.onLeave(p);};return T;}
function mpOpenNet(code){const local=code.startsWith('TEST')||/[?&]mplocal/.test(location.search);return local?mpNetLocal(code):mpNetWeb(code);}
function mpOnline(){return navigator.onLine!==false;}
// ---------- Ereignis-Log ----------
function mpLog(){FLAGS.mp=FLAGS.mp||{code:MP.code,tick:0,log:{}};FLAGS.mp.log=FLAGS.mp.log||{};return FLAGS.mp.log;}
const mpNewer=(a,b)=>!b||a[0]>b[0]||(a[0]===b[0]&&a[1]>b[1]);
const MP_SNAP={};
const mpRound=(k,v)=>typeof v==='number'?Math.round(v*100)/100:v;
function mpEntries(K){const out=new Map(),V=FLAGS[K];if(!V)return out;
  if(MP_WORLD_ARRS[K]){const kf=MP_WORLD_ARRS[K];for(const e of V){if(!e)continue;if(K==='boats'){const b=BOATS.find(b=>b.d===e);if(b&&b.netT>time-2.5&&MP_SNAP.boats&&MP_SNAP.boats.has(e.id)){out.set(e.id,MP_SNAP.boats.get(e.id));continue;}}
      const c=K==='rifts'?{x:e.x,z:e.z,until:e.until}:e;out.set(String(kf(e)),JSON.stringify(c,mpRound));}}
  else for(const k in V)out.set(k,JSON.stringify(V[k],mpRound));return out;}
function mpSnapAll(){for(const K of MP_KEYS)MP_SNAP[K]=mpEntries(K);}
// Lokale Änderungen finden und als Ereignisse verschicken
function mpDiff(){if(!MP.on||!MP.ready)return;const L=mpLog(),t=Math.round(FLAGS.mp.tick||0),ops=[];
  for(const K of MP_KEYS){const cur=mpEntries(K),old=MP_SNAP[K]||new Map();
    for(const[e,s]of cur)if(old.get(e)!==s){const op=[K,e,t,MP.pid,s];ops.push(op);L[K+'|'+e]=[t,MP.pid,s];}
    for(const[e]of old)if(!cur.has(e)){const op=[K,e,t,MP.pid,null];ops.push(op);L[K+'|'+e]=[t,MP.pid,null];}
    MP_SNAP[K]=cur;}
  if(ops.length)mpSend({t:'ops',ops});}
// Fremde Ereignisse anwenden
function mpApply(ops){const L=mpLog(),dirty=new Set();for(const[K,e,t,p,s]of ops){if(!MP_KEYS.includes(K))continue;const k=K+'|'+e;if(!mpNewer([t,p],L[k]))continue;L[k]=[t,p,s];
    if(mpSet(K,e,s))dirty.add(K);if(!MP_SNAP[K])MP_SNAP[K]=new Map();if(s==null)MP_SNAP[K].delete(e);else MP_SNAP[K].set(e,s);if(t>(FLAGS.mp.tick||0)&&MP.role!=='host')FLAGS.mp.tick=t;}
  mpRefresh(dirty);}
function mpSet(K,e,s){if(MP_WORLD_ARRS[K]){FLAGS[K]=FLAGS[K]||[];const A=FLAGS[K],kf=MP_WORLD_ARRS[K],i=A.findIndex(x=>x&&String(kf(x))===e),v=s==null?null:JSON.parse(s);
    if(K==='boats'){const b=i>=0?BOATS.find(b=>b.d===A[i]):null;if(v==null){if(b){if(boatIn===b)boatIn=null;boatRemove(b);}else if(i>=0)A.splice(i,1);return true;}
      if(b){const{x,z,yaw}=v;delete v.x;delete v.z;delete v.yaw;Object.assign(b.d,v);b.net={x,z,yaw};b.netT=time;if(JSON.stringify(b.d.cannons)!==b._cs){b._cs=JSON.stringify(b.d.cannons);buildCannons(b);}return true;}
      if(i>=0)A.splice(i,1);A.push(v);boatAdd(v,true);return true;}
    if(v==null){if(i>=0)A.splice(i,1);}else if(i>=0)A[i]=v;else A.push(v);return true;}
  FLAGS[K]=FLAGS[K]||{};if(s==null)delete FLAGS[K][e];else FLAGS[K][e]=JSON.parse(s);return true;}
function mpRefresh(D){try{if(D.has('harv'))hvApplyAll();if(D.has('felled'))applyFelledAll();if(D.has('mined'))syncBoulders();if(D.has('furn'))syncFurn();if(D.has('benches'))syncBenches();if(D.has('wtorches'))renderWTorches();
  if(D.has('chests')&&typeof cont!=='undefined'&&cont&&String(cont.kind).startsWith('chest:'))renderContainer();if(D.has('furnSt')&&typeof furnOpen==='function'&&furnOpen())renderContainer();if(D.has('regrow')){for(const[i,t]of Object.entries(FLAGS.regrow||{})){const p=pickups[+i];if(p&&p.active){p.active=false;p.regrowAt=t;}}syncPickups();}}catch(e){console.error('MP Abgleich',e);}}
// Die ganze Welt aus dem Log (für Beitritt und Sicherung)
function mpWorldMsg(){return{t:'world',log:mpLog(),seed:FLAGS.seed,wseed:FLAGS.wseed,tick:FLAGS.mp.tick||0,day:FLAGS.day,clock:FLAGS.clock,pos:[P.x,P.y,P.z]};}
function mpMergeLog(log){const ops=[];for(const k in log){const[t,p,s]=log[k],i=k.indexOf('|');ops.push([k.slice(0,i),k.slice(i+1),t,p,s]);}mpApply(ops);return ops;}
// Einmalig: alles, was schon in der Welt ist, ins Log aufnehmen
function mpSeedLog(){const L=mpLog();for(const K of MP_KEYS)for(const[e,s]of mpEntries(K)){const k=K+'|'+e;if(!L[k])L[k]=[0,MP.pid,s];}mpSnapAll();}
// ---------- Nachrichten ----------
function mpSend(m,to){if(MP.net)MP.net.send(m,to);}
function mpMe(){const h=inv[HOT0+sel];return{pid:MP.pid,name:P.char&&P.char.name||'Spieler',look:lookWithGear(P.char||defaultChar()),held:h?h.id:null,off:equip.off?equip.off.id:null,size:P.mods&&P.mods.size||1};}
function mpOnJoin(peer){mpSend(Object.assign({t:'hi',has:!MP.fresh,tick:FLAGS.mp?FLAGS.mp.tick||0:0,role:MP.role},mpMe()),peer);}
function mpOnLeave(peer){const pid=MP.peerPid.get(peer);MP.peerPid.delete(peer);if(!pid)return;mpDropPlayer(pid);
  const wasHost=pid===MP.host;MP.order=MP.order.filter(p=>p!==pid);
  if(wasHost){const nh=MP.order[0]||MP.pid;MP.host=nh;if(nh===MP.pid){MP.role='host';mpSend(mpRosterMsg());mpWaitShow('Der Host hat die Welt verlassen.','Du bist jetzt der Host. Die Welt wird bereitgestellt …',3);}
    else{MP.role='client';mpWaitShow('Der Host hat die Welt verlassen.',`${MP.names[nh]||'Ein anderer Spieler'} übernimmt die Welt. Du trittst gleich wieder bei …`,MP_WAIT,()=>MP.rosterOk);MP.rosterOk=false;}}
  else if(MP.role==='host')mpSend(mpRosterMsg());mpRenderPauseInfo();}
function mpRosterMsg(){return{t:'roster',host:MP.host,order:MP.order,names:MP.names,tick:Math.round(FLAGS.mp&&FLAGS.mp.tick||0)};}
function mpOnMsg(m,peer){if(!m||!m.t)return;try{(MP.dbg=MP.dbg||[]).push(m.t+':'+MP.role);if(MP.dbg.length>60)MP.dbg.shift();
  if(m.pid&&peer!=null&&!MP.peerPid.has(peer))MP.peerPid.set(peer,m.pid);
  switch(m.t){
  case'hi':{MP.peerPid.set(peer,m.pid);MP.names[m.pid]=m.name;mpLook(m);
    if(MP.role==='host'){if(!MP.order.includes(m.pid)){if(MP.order.length>=MP_MAX){mpSend({t:'full'},peer);return;}MP.order.push(m.pid);MP.joinedAt[m.pid]=Date.now();}
      mpSend(mpWorldMsg(),peer);mpSend(mpRosterMsg());mpSend(Object.assign({t:'look'},mpMe()),peer);}
    else if(MP.role!=='probe')mpSend(Object.assign({t:'look'},mpMe()),peer);
    mpRenderPauseInfo();break;}
  case'look':mpLook(m);MP.names[m.pid]=m.name;break;
  case'roster':{Object.assign(MP.names,m.names||{});
    if(MP.role==='host'&&m.host!==MP.pid){// Zwei Hosts treffen sich: wer mehr Weltzeit hat (sonst kleinere ID), bleibt Host
      const mine=Math.round(FLAGS.mp.tick||0),theirs=m.tick||0;if(mine>theirs||(mine===theirs&&MP.pid<m.host)){mpSend(mpRosterMsg());break;}
      MP.role='client';MP.host=m.host;MP.order=m.order;mpSend(Object.assign({t:'hi',has:true,tick:mine,role:'client'},mpMe()));mpRenderPauseInfo();break;}
    MP.host=m.host;MP.order=m.order;MP.rosterOk=true;if(m.host===MP.pid)MP.role='host';else if(MP.role==='probe'||MP.role==='host')MP.role='client';
    if(MP.role==='client'&&!m.order.includes(MP.pid))mpSend(Object.assign({t:'hi',has:!MP.fresh,tick:Math.round(FLAGS.mp.tick||0),role:'client'},mpMe()));
    if(MP.wait&&MP.wait.until&&MP.wait.until())mpWaitHide();mpRenderPauseInfo();break;}
  case'world':{mpReceiveWorld(m);break;}
  case'mylog':{if(MP.role==='host'){const ops=[];const L=mpLog();for(const k in m.log){const[t,p,s]=m.log[k];if(mpNewer([t,p],L[k])){const i=k.indexOf('|');ops.push([k.slice(0,i),k.slice(i+1),t,p,s]);}}if(ops.length){mpApply(ops);mpSend({t:'ops',ops});}}break;}
  case'ops':mpApply(m.ops);break;
  case'pose':mpPose(m);break;
  case'time':if(MP.role!=='host'){FLAGS.day=m.day;if(Math.abs((FLAGS.clock||0)-m.clock)>3)FLAGS.clock=m.clock;if(FLAGS.mp)FLAGS.mp.tick=Math.max(FLAGS.mp.tick||0,m.tick);}break;
  case'backup':if(MP.role!=='host'){mpMergeLog(m.log);}break;
  case'full':mpWaitShow('Diese Welt ist voll.',`Es sind schon ${MP_MAX} Spieler online.`,0,null,true);mpStop(false);break;
  case'bye':{const pid=m.pid;for(const[k,v]of MP.peerPid)if(v===pid)mpOnLeave(k);break;}}
}catch(e){console.error('MP Nachricht',m&&m.t,e);}}
function mpReceiveWorld(m){if(m.wseed!=null&&FLAGS.wseed!==m.wseed){FLAGS.wseed=m.wseed;try{wlSetSeed(FLAGS.wseed);wlReset();}catch(e){}}if(m.seed!=null)FLAGS.seed=m.seed;
  FLAGS.day=m.day;FLAGS.clock=m.clock;FLAGS.mp.tick=Math.max(FLAGS.mp.tick||0,m.tick||0);
  const had=!MP.fresh,mine=had?JSON.parse(JSON.stringify(mpLog())):null;MP.ready=true;mpMergeLog(m.log);mpSnapAll();
  if(had)mpSend({t:'mylog',log:mine});
  if(MP.fresh&&m.pos){MP.fresh=false;FLAGS.mp.fresh=false;const[x,y,z]=m.pos;P.x=x+1.5;P.z=z+1.5;P.y=groundAt(P.x,P.z,y+2);P.vx=P.vz=P.vy=0;}
  if(MP.role==='probe')MP.role='client';mpWaitHide();saveGame();mpRenderPauseInfo();}
// ---------- Sitzung starten und beenden ----------
function mpStart(code,fresh){mpStop(true);if(!mpOnline()){mpWaitShow('Keine Internetverbindung','Für den Mehrspieler-Modus brauchst du Internet.',0,null,true);return;}
  MP.on=true;MP.code=code;MP.pid=mpPid();MP.fresh=!!fresh;MP.ready=!fresh;MP.role='probe';MP.host='';MP.order=[];MP.names={[MP.pid]:P.char&&P.char.name};MP.rosterOk=false;MP.peerPid.clear();
  FLAGS.mp=FLAGS.mp||{code,tick:0,log:{}};FLAGS.mp.code=code;if(fresh)FLAGS.mp.fresh=true;if(!fresh)mpSeedLog();
  try{MP.net=mpOpenNet(code);}catch(e){console.error('MP Netz',e);MP.on=false;mpWaitShow('Verbindung fehlgeschlagen','Der Mehrspieler-Dienst ist gerade nicht erreichbar.',0,null,true);return;}
  MP.net.onJoin=mpOnJoin;MP.net.onLeave=mpOnLeave;MP.net.onMsg=mpOnMsg;
  // Erst schauen, ob schon jemand die Welt hostet. Sonst wird man selbst Host (wenn man die Welt hat).
  mpWaitShow('Verbinde mit der Welt …',`Weltcode ${mpFmt(code)}`,0);const t0=Date.now();
  MP.probe=setInterval(()=>{if(!MP.on){clearInterval(MP.probe);return;}if(MP.role!=='probe'){clearInterval(MP.probe);return;}const el=(Date.now()-t0)/1000;
    if(el>6&&!MP.fresh){clearInterval(MP.probe);MP.role='host';MP.host=MP.pid;MP.order=[MP.pid];MP.joinedAt[MP.pid]=Date.now();MP.ready=true;mpSnapAll();mpWaitHide();mpRenderPauseInfo();mpSend(mpRosterMsg());}
    else if(el>8&&MP.fresh)mpWaitShow('Diese Welt ist gerade offline.','Niemand mit dieser Welt ist online. Du trittst automatisch bei, sobald jemand sie startet.',0,null,true,'Abbrechen',()=>{const s=curSlot;mpStop(true);store.set(SLOT_KEY(s),null);try{localStorage.removeItem((MP_NS?MP_NS+':':'')+SLOT_KEY(s));}catch(e){}openMenu();});},500);}
function mpStop(quiet){if(MP.net){try{MP.net.send({t:'bye',pid:MP.pid});}catch(e){}const n=MP.net;setTimeout(()=>n.leave(),150);}MP.net=null;MP.on=false;MP.role='off';MP.ready=false;clearInterval(MP.probe);
  for(const pid of[...REMOTE.keys()])mpDropPlayer(pid);if(!quiet)mpRenderPauseInfo();}
// ---------- Mitspieler zeigen ----------
function mpRemoteSprite(R){const F=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,0,'strike'],[0,1,'strike']],strip=document.createElement('canvas');strip.width=64*F.length;strip.height=60;const ctx=strip.getContext('2d');ctx.imageSmoothingEnabled=false;let top=60;
  F.forEach(([f,b,pose],i)=>{const cv=drawHero(R.look,f,!!b,pose,b?'R':'L'),out=document.createElement('canvas');out.width=64;out.height=60;const x=out.getContext('2d');x.imageSmoothingEnabled=false;const ms=b?'R':'L',os=ms==='L'?'R':'L',ang=pose==='strike'?1.1:0;
    const put=(id,side,main)=>{if(id&&SPR[id])drawHeld2(x,id,SPR[id].c,side==='L'?cv.handL:cv.handR,10,side==='L',main?ang:0,main);};if(b){put(R.held,ms,1);put(R.off,os,0);}x.drawImage(cv,10,0);if(!b){put(R.held,ms,1);put(R.off,os,0);}
    ctx.drawImage(out,i*64,0);if(!pose&&!b&&!f)top=Math.min(top,cv.headBox[2]);SPR['rp_'+R.pid+'_'+i]={u:i/F.length,v:0,du:1/F.length,dv:1,w:64,h:60};});
  const tex=new THREE.CanvasTexture(strip);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  if(R.mesh){scene.remove(R.mesh);R.mesh.geometry.dispose();R.mesh.material.uniforms.map.value.dispose();}
  const m=bbMaterial(tex,0,0);R.h=1.75*(R.size||1)*60/(60-top+1);R.w=R.h*64/60;R.mesh=makeBillboards([{x:R.x||0,y:-999,z:R.z||0,w:R.w,h:R.h,spr:'rp_'+R.pid+'_0',tint:1}],m);R.mesh.frustumCulled=false;scene.add(R.mesh);}
function mpLook(m){if(!m.pid||m.pid===MP.pid)return;let R=REMOTE.get(m.pid);if(!R){R={pid:m.pid,x:0,y:-999,z:0,tx:0,ty:-999,tz:0,yaw:0,anim:0,seen:0};REMOTE.set(m.pid,R);}
  const sig=JSON.stringify([m.look,m.held,m.off,m.size]);R.name=m.name;if(sig!==R.sig){R.sig=sig;R.look=m.look;R.held=m.held;R.off=m.off;R.size=m.size;try{mpRemoteSprite(R);}catch(e){console.error('MP Figur',e);}}}
function mpPose(m){const R=REMOTE.get(m.pid);if(!R)return;if(R.ty<-900){R.x=m.x;R.y=m.y;R.z=m.z;}R.tx=m.x;R.ty=m.y;R.tz=m.z;R.yaw=m.yaw;R.mv=m.mv;R.act=m.act?time-(m.act):-9;R.seen=time;
  if(m.b){const b=BOATS.find(b=>b.d.id===m.b[0]);if(b&&b!==boatIn){b.net={x:m.b[1],z:m.b[2],yaw:m.b[3]};b.netT=time;b.v=m.b[4]||0;}}}
function mpDropPlayer(pid){const R=REMOTE.get(pid);if(!R)return;if(R.mesh){scene.remove(R.mesh);R.mesh.geometry.dispose();}nameTag('mp_'+pid,'',0,0,0,false);REMOTE.delete(pid);}
function mpFrame(dt){if(!MP.on)return;
  // Boote, die ein anderer steuert, gleiten zur gemeldeten Position (und nehmen dich an Deck mit)
  for(const b of BOATS){if(!b.net||b===boatIn||time-b.netT>4)continue;const ox=b.d.x,oz=b.d.z,oy=b.d.yaw,k=Math.min(1,dt*6);let dy=b.net.yaw-oy;dy=Math.atan2(Math.sin(dy),Math.cos(dy));
    const on=b.T.sail&&P.x<60000?shipAt(P.x,P.z,P.y)===b:false,[plx,plz]=on?boatLocal(b,P.x,P.z):[0,0];b.d.x+=(b.net.x-ox)*k;b.d.z+=(b.net.z-oz)*k;b.d.yaw+=dy*k;if(on){const[x,z]=boatWorld(b,plx,plz);P.x=x;P.z=z;P.yaw+=b.d.yaw-oy;}}
  for(const R of REMOTE.values()){if(!R.mesh)continue;const k=Math.min(1,dt*10);const ox=R.x,oz=R.z;R.x+=(R.tx-R.x)*k;R.y+=(R.ty-R.y)*k;R.z+=(R.tz-R.z)*k;R.anim+=Math.hypot(R.x-ox,R.z-oz)*1.6;
    const g=R.mesh.geometry.attributes,d=Math.hypot(R.x-camera.position.x,R.z-camera.position.z),vis=time-R.seen<6&&d<260&&(R.x>60000)===(camera.position.x>60000);
    if(!vis){g.offset.array[1]=-999;g.offset.needsUpdate=true;nameTag('mp_'+R.pid,'',0,0,0,false);continue;}
    const vx=R.x-camera.position.x,vz=R.z-camera.position.z,back=(-Math.sin(R.yaw)*vx-Math.cos(R.yaw)*vz)>0,strike=R.act>=0&&R.act<.35,f=strike?(back?7:6):(back?3:0)+(R.mv?1+(Math.floor(R.anim)%2):0),s=SPR['rp_'+R.pid+'_'+f];
    g.offset.array[0]=R.x;g.offset.array[1]=R.y-.02;g.offset.array[2]=R.z;g.size.array[0]=R.w;g.size.array[1]=R.h;g.uvr.array[0]=s.u;g.uvr.array[1]=s.v;g.uvr.array[2]=s.du;g.uvr.array[3]=s.dv;
    for(const k2 of['offset','size','uvr'])g[k2].needsUpdate=true;nameTag('mp_'+R.pid,R.name+(R.pid===MP.host?' ★':''),R.x,R.y+R.h+.25,R.z,d<60&&state==='playing');}}
// ---------- Takt ----------
function mpTick(dt){if(!MP.on)return;const now=performance.now();if(state==='playing'||state==='inventory'||state==='dialog'||state==='shop'||state==='craft')MP.inGame=true;
  if(MP.role==='host'&&MP.ready&&state!=='menu')FLAGS.mp.tick=(FLAGS.mp.tick||0)+dt*1000;
  if(now-MP.lastPose>100&&MP.ready){MP.lastPose=now;const hs=Math.hypot(P.vx,P.vz),b=boatIn;const m={t:'pose',pid:MP.pid,x:+P.x.toFixed(2),y:+P.y.toFixed(2),z:+P.z.toFixed(2),yaw:+P.yaw.toFixed(3),mv:hs>.5?1:0,act:P.atkT&&time-P.atkT<.4?+(time-P.atkT).toFixed(2):0};
    if(b)m.b=[b.d.id,+b.d.x.toFixed(2),+b.d.z.toFixed(2),+b.d.yaw.toFixed(3),+b.v.toFixed(2)];mpSend(m);}
  if(now-MP.lastDiff>500){MP.lastDiff=now;mpDiff();const me=mpMe(),sig=JSON.stringify([me.look,me.held,me.off]);if(sig!==MP.mySig){MP.mySig=sig;mpSend(Object.assign({t:'look'},me));}}
  if(MP.role==='host'&&now-MP.lastTime>1000){MP.lastTime=now;mpSend({t:'time',tick:Math.round(FLAGS.mp.tick),day:FLAGS.day,clock:FLAGS.clock});}
  if(MP.role==='host'&&now-MP.lastBackup>150000){MP.lastBackup=now;if(MP.order.length>1)mpSend({t:'backup',log:mpLog()});}}
{const ud5=updateDemons;updateDemons=function(dt){ud5(dt);try{mpTick(dt);mpFrame(dt);}catch(e){if(!mpTick.err){mpTick.err=1;console.error('MP',e);}}};}
// Netz-Takt auch wenn das Spiel pausiert (Pause, Ladebildschirm)
setInterval(()=>{if(MP.on&&state!=='playing'){try{mpTick(.25);}catch(e){}}},250);
// Öfen rechnet nur der Host, die anderen sehen das Ergebnis
{const uf1=updateFurnaces;updateFurnaces=function(dt){if(MP.on&&MP.role!=='host')return;return uf1(dt);};}
// Spielzeit: nur der Host lässt die Uhr laufen, die anderen bekommen sie von ihm (kein eigenes Vorspulen)
// ---------- Warte-Bildschirm ----------
(function(){const st=document.createElement('style');st.textContent=`
#mpWait{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(8,12,10,.82)}
#mpWait .box{max-width:520px;text-align:center;padding:26px 30px}#mpWait h2{margin:0 0 10px}#mpWait p{margin:6px 0;font-size:17px}#mpWait .cd{font-size:40px;margin:12px 0;color:var(--leaf,#9ad06a)}
#mpPanel .mp-row{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:10px 12px;margin:6px 0;background:rgba(0,0,0,.25)}#mpPanel .mp-row b{display:block}#mpPanel .mp-row small{opacity:.8}
#mpPanel .mp-join{display:flex;gap:8px;margin:14px 0 6px}#mpPanel input{flex:1;font:inherit;font-size:18px;padding:6px 10px;letter-spacing:2px;text-transform:uppercase}#mpPanel .mp-status{min-height:1.3em;margin:6px 0;opacity:.85}
#mpInfo{margin:4px 0 12px;padding:10px 12px;background:rgba(0,0,0,.25);text-align:left}#mpInfo .code{font-size:22px;letter-spacing:3px;margin:2px 0 6px;user-select:all}#mpInfo ul{margin:6px 0 0;padding-left:18px}`;document.head.appendChild(st);
  const w=document.createElement('div');w.id='mpWait';w.hidden=true;w.innerHTML='<div class="panel notch box"><h2 id="mpWT"></h2><p id="mpWS"></p><div class="cd" id="mpWC"></div><button class="pbtn notch small" id="mpWB" hidden></button></div>';document.body.appendChild(w);
  const p=document.createElement('div');p.id='mpPanel';p.className='overlay';p.hidden=true;p.innerHTML=`<div class="panel notch slot-panel"><h2>Mehrspieler</h2><p class="slot-sub">Bis zu ${MP_MAX} Spieler. Die Welt liegt bei allen, wer zuerst online ist, hostet.</p>
    <div id="mpSlots"></div><div class="mp-join"><input id="mpCode" maxlength="16" placeholder="Weltcode" autocomplete="off" spellcheck="false"><button class="pbtn notch small" id="mpJoinBtn">Beitreten</button></div>
    <p class="mp-status" id="mpStatus"></p><button class="pbtn notch small" id="mpBack">Zurück</button></div>`;document.body.appendChild(p);
  const info=document.createElement('div');info.id='mpInfo';info.hidden=true;const pp=document.querySelector('#pause .pause-panel');if(pp)pp.insertBefore(info,pp.children[1]);
  const mb=document.getElementById('mainBtns'),btn=document.createElement('button');btn.className='pbtn notch';btn.id='btnMP';btn.textContent='Mehrspieler';mb.insertBefore(btn,document.getElementById('btnSettings'));
  btn.onclick=()=>{Snd.init();Snd.click();mpOpenPanel();};
  document.getElementById('mpBack').onclick=()=>{Snd.click();show('mpPanel',false);show('menu',true);show('menuFoot',true);};
  document.getElementById('mpJoinBtn').onclick=()=>{Snd.click();mpJoinCode(document.getElementById('mpCode').value);};
  document.getElementById('mpCode').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')mpJoinCode(e.target.value);});})();
let mpWaitT=null;
function mpWaitShow(title,sub,secs,until,closable,btnText,btnAct){const W=$('mpWait');W.hidden=false;$('mpWT').textContent=title;$('mpWS').textContent=sub||'';MP.wait={until};clearInterval(mpWaitT);
  const B=$('mpWB');B.hidden=!(closable||btnText);B.textContent=btnText||'OK';B.onclick=()=>{Snd.click();if(btnAct)btnAct();else{mpWaitHide();if(!MP.on&&state!=='menu'){}}};
  if(state==='playing'){state='paused';MP.pausedByWait=true;keys.clear();if(document.pointerLockElement){suppressPause=true;document.exitPointerLock();}}
  const t0=Date.now(),C=$('mpWC');C.textContent=secs?String(secs):'';if(secs)mpWaitT=setInterval(()=>{const left=Math.max(0,Math.ceil(secs-(Date.now()-t0)/1000));C.textContent=left;if(left<=0||(until&&until())){mpWaitHide();}},250);}
function mpWaitHide(){clearInterval(mpWaitT);$('mpWait').hidden=true;MP.wait=null;if(MP.pausedByWait&&state==='paused'&&$('pause').hidden){MP.pausedByWait=false;state='playing';lock();updateLockHint();}}
// ---------- Menü ----------
const MP_SLOTS=[1,2,3];const mpSlotKey=n=>'mp'+n;
function mpOpenPanel(){show('menu',false);show('menuFoot',false);show('mpPanel',true);$('mpStatus').textContent=mpOnline()?'':'Keine Internetverbindung. Mehrspieler braucht Internet.';mpRenderSlots();}
function mpRenderSlots(){const box=$('mpSlots');box.innerHTML='';for(const n of MP_SLOTS){const s=store.get(SLOT_KEY(mpSlotKey(n))),row=document.createElement('div');row.className='mp-row';
    if(s&&s.flags&&s.flags.mp){const m=s.meta||{};row.innerHTML=`<div><b>Platz ${n}: ${esc(m.world||m.name||'?')} · Tag ${m.day||1}</b><small>Weltcode ${mpFmt(s.flags.mp.code)}</small></div><div><button class="pbtn notch small" data-a="play">Spielen</button> <button class="pbtn notch small" data-a="del">Löschen</button></div>`;}
    else row.innerHTML=`<div><b>Platz ${n}: leer</b><small>Neue Mehrspieler-Welt</small></div><div><button class="pbtn notch small" data-a="new">Neue Welt</button></div>`;
    row.onclick=e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;Snd.click();if(a==='play')mpPlaySlot(n);else if(a==='new')mpNewWorld(n);else if(a==='del'){if(row.dataset.c){store.set(SLOT_KEY(mpSlotKey(n)),null);mpRenderSlots();}else{row.dataset.c=1;e.target.textContent='Wirklich?';}}};box.appendChild(row);}}
function mpGuard(){if(!mpOnline()){$('mpStatus').textContent='Keine Internetverbindung. Mehrspieler braucht Internet.';return false;}return true;}
function mpNewWorld(n){if(!mpGuard())return;curSlot=mpSlotKey(n);MP.pending={mode:'host',code:mpNewCode()};show('mpPanel',false);openCreator();}
function mpPlaySlot(n){if(!mpGuard())return;curSlot=mpSlotKey(n);const s=store.get(SLOT_KEY(curSlot));MP.pending={mode:'continue',code:s.flags.mp.code};show('mpPanel',false);startGame(false);}
function mpJoinCode(raw){if(!mpGuard())return;const code=mpNorm(raw);if(code.length<8){$('mpStatus').textContent='Dieser Code ist zu kurz.';return;}
  for(const n of MP_SLOTS){const s=store.get(SLOT_KEY(mpSlotKey(n)));if(s&&s.flags&&s.flags.mp&&s.flags.mp.code===code){mpPlaySlot(n);return;}}
  const free=MP_SLOTS.find(n=>!store.get(SLOT_KEY(mpSlotKey(n))));if(!free){$('mpStatus').textContent='Alle drei Mehrspieler-Plätze sind belegt. Lösche erst einen.';return;}
  curSlot=mpSlotKey(free);MP.pending={mode:'join',code};show('mpPanel',false);openCreator();}
// Nach dem Start einer Mehrspieler-Welt: Sitzung beginnen
{const sg1=startGame;startGame=function(isNew,char){const lastSP=store.get(LAST_KEY),pend=MP.pending;MP.pending=null;if(!pend&&MP.on)mpStop(true);
  const r=sg1.apply(this,arguments);if(String(curSlot).startsWith('mp'))store.set(LAST_KEY,typeof lastSP==='number'?lastSP:1);
  if(pend&&String(curSlot).startsWith('mp')){if(pend.mode==='host'){FLAGS.mp={code:pend.code,tick:0,log:{}};mpStart(pend.code,false);}
    else if(pend.mode==='join'){FLAGS.mp={code:pend.code,tick:0,log:{},fresh:true};mpStart(pend.code,true);}
    else mpStart(pend.code,!!(FLAGS.mp&&FLAGS.mp.fresh));saveGame();}
  return r;};}
{const om0=openMenu;openMenu=function(){if(MP.on)mpStop(true);mpWaitHide();MP.pending=null;show('mpPanel',false);for(const pid of[...REMOTE.keys()])mpDropPlayer(pid);return om0.apply(this,arguments);};}
addEventListener('beforeunload',()=>{if(MP.on&&MP.net)try{MP.net.send({t:'bye',pid:MP.pid});}catch(e){}});
// Pausenmenü: Weltcode und Spielerliste
function mpRenderPauseInfo(){const el=$('mpInfo');if(!el)return;el.hidden=!MP.on;if(!MP.on)return;const L=(MP.order.length?MP.order:[MP.pid]).map(p=>`<li>${(p===MP.pid?(P.char&&P.char.name)||'Du':MP.names[p]||'?')}${p===MP.host?' (Host)':''}${p===MP.pid?' · du':''}</li>`).join('');
  el.innerHTML=`<div>Weltcode</div><div class="code">${mpFmt(MP.code)}</div><button class="pbtn notch small" id="mpCopy">Code kopieren</button><div style="margin-top:8px">Spieler ${Math.max(1,MP.order.length)}/${MP_MAX}${MP.role==='probe'?' · verbinde …':''}</div><ul>${L}</ul>`;
  const b=$('mpCopy');if(b)b.onclick=e=>{e.stopPropagation();try{navigator.clipboard.writeText(mpFmt(MP.code));b.textContent='Kopiert!';}catch(_){b.textContent=mpFmt(MP.code);}};}
{const op0=openPause;openPause=function(){const r=op0.apply(this,arguments);mpRenderPauseInfo();return r;};}
// Im Mehrspieler schläft niemand die Nacht weg, solange andere wach sind: Schlafen spult nur beim Alleinspielen vor
{const ts0=trySleep;trySleep=function(){if(MP.on&&MP.order.length>1){return;}return ts0.apply(this,arguments);};}
