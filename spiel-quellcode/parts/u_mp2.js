/* =========================================================
   V71 · Mehrspieler: alle sehen dieselbe Welt
   - Der Host rechnet NPCs, Tiere, Wildtiere, Nachtmonster, Candyland, Blue-Lunar-
     Wesen, Mumien, Kutschen und den SpionGHG. Die anderen bekommen ihren Zustand
     ein paar Mal pro Sekunde und zeigen genau das.
   - Schläge der Mitspieler gehen an den Host. Beute und Erfahrung bekommt, wer trifft.
   - Monster greifen auch die Mitspieler an (der Host kennt ihre Position).
   - Mitspieler: Schleichen wird angezeigt, Kreak läuft bei jedem mit.
   ========================================================= */
const MG=[['vil',()=>villagers],['grd',()=>guards],['frg',()=>frogs],['mer',()=>MERCHANTS],['ani',()=>animals],['mum',()=>mummies],['cch',()=>COACHES],
  ['pha',()=>pharaoh?[pharaoh]:[]],['pri',()=>[DPRIEST]],['wit',()=>[WITCH]]];
const MG_GET=Object.fromEntries(MG);
const MP_SKIP=new Set(['talk','name','role','ownI','mirror','proxy','ghost','always','noHostile','candy','blue','nm','promptName','sq','land','home']);
const isClient=()=>MP.on&&MP.role==='client'&&MP.ready;
const isHostMP=()=>MP.on&&MP.role==='host';
function mpPrims(o){const r={};for(const k in o){if(MP_SKIP.has(k)||k[0]==='_')continue;const v=o[k],t=typeof v;if(t==='number'){if(isFinite(v))r[k]=Math.round(v*100)/100;}else if(t==='boolean'||t==='string'||v===null)r[k]=v;}return r;}
function mpInterest(){const L=[[P.x,P.z]];for(const R of REMOTE.values())if(time-R.seen<6)L.push([R.tx,R.tz]);return L;}
const mpNear=(L,x,z,r)=>{for(const[a,b]of L)if(Math.abs(a-x)<r&&Math.abs(b-z)<r)return true;return false;};
// ---------- Host: Zustand verschicken ----------
const MP_SENT={},MP_SENTU={dem:new Map(),wm:new Map()};let mpEntT=0,mpFullT=0,mpUid=0;
function mpDelta(store,key,cur,full){const last=store.get(key),out={};let n=0;for(const k in cur)if(full||!last||last[k]!==cur[k]){out[k]=cur[k];n++;}store.set(key,cur);return n?out:null;}
function mpHostSnapshot(){const L=mpInterest(),full=time-mpFullT>4;if(full)mpFullT=time;const msg={t:'ent',g:{}};
  for(const[g,get]of MG){const A=get();if(!A)continue;const S=MP_SENT[g]||(MP_SENT[g]=new Map()),out=[];for(let i=0;i<A.length;i++){const o=A[i];if(!o||typeof o.x!=='number'||typeof o.z!=='number')continue;if(!mpNear(L,o.x,o.z,230))continue;
      const d=mpDelta(S,i,mpPrims(o),full);if(d)out.push([i,d]);}if(out.length)msg.g[g]=out;}
  // Wesen mit Lebenszyklus: Nachtmonster, Candyland, Blue Lunar
  const dem=[],ids=[];for(const e of DEM){if(e.mirror||e.ghost||e.proxy)continue;if(!(e.nm||e.candy||e.blue))continue;if(!mpNear(L,e.x,e.z,230))continue;e._u=e._u||++mpUid;ids.push(e._u);
    const d=mpDelta(MP_SENTU.dem,e._u,mpPrims(e),full);if(d)dem.push([e._u,e.type,d]);}msg.dem=dem;msg.demIds=ids;
  // Wildtiere der Savanne und der Wildnis
  const wm=[],wids=[];for(const m of WM){if(!mpNear(L,m.x,m.z,230))continue;m._u=m._u||++mpUid;wids.push(m._u);const d=mpDelta(MP_SENTU.wm,m._u,mpPrims(m),full);if(d)wm.push([m._u,d]);}msg.wm=wm;msg.wmIds=wids;
  // SpionGHG
  msg.spy=spy&&MP.spyR?{r:MP.spyR,hp:spy.hp,dead:!!spy.dead,x:spy.x,y:spy.y,z:spy.z,w:spy.w,h:spy.h}:null;
  // Lager der Nussknacker und fliegende Nüsse
  const camp=[];for(const[,Lc]of CLAND){const C=Lc.sq&&Lc.sq.camp;if(!C)continue;for(const p of C.props)if(mpNear(L,p.x,p.z,260))camp.push([+p.x.toFixed(2),+p.y.toFixed(2),+p.z.toFixed(2),p.w,+p.h.toFixed(2),p.fire?1:0,p.spr]);}msg.camp=camp;
  msg.nuts=NUTS.map(q=>[+q.x.toFixed(2),+q.y.toFixed(2),+q.z.toFixed(2)]);
  mpSend(msg);}
// Beim SpionGHG das Bild mitschneiden, das der Host gerade zeigt
{const sb0=setBB;setBB=function(m,x,y,z,w,h,key,flip,rot,tint){if(m&&m===spyMesh&&isHostMP())MP.spyR=[+x.toFixed(2),+y.toFixed(2),+z.toFixed(2),w,h,key,!!flip,+(rot||0).toFixed(3),tint];return sb0.apply(this,arguments);};}
// ---------- Mitspieler: Zustand übernehmen ----------
const MP_HS={},MP_MIR={dem:new Map(),wm:new Map()},MP_REF=new WeakMap(),MP_GONE=new Map();let MP_CAMP=[],MP_NUTS=[],MP_SPY=null;
function mpRecvEnt(m){if(!isClient())return;
  for(const g in m.g){const A=MG_GET[g]&&MG_GET[g]();if(!A)continue;const H=MP_HS[g]||(MP_HS[g]=new Map());for(const[i,d]of m.g[g]){const o=A[i];if(!o)continue;MP_REF.set(o,['s',g,i]);H.set(i,Object.assign(H.get(i)||{},d));}}
  // Wesen
  const keep=new Set(m.demIds);for(const[u,e]of MP_MIR.dem)if(!keep.has(u)){MP_MIR.dem.delete(u);if(DEM.includes(e))removeEnt(e);}
  for(const[u,type,d]of m.dem){let e=MP_MIR.dem.get(u);if(!e){if(MP_GONE.has(u)||!DT[type])continue;e=mpMirrorSpawn(u,type,d);if(!e)continue;}e._hs=Object.assign(e._hs||{},d);}
  // Wildtiere
  const wk=new Set(m.wmIds);for(const[u,o]of MP_MIR.wm)if(!wk.has(u)){MP_MIR.wm.delete(u);const i=WM.indexOf(o);if(i>=0)WM.splice(i,1);}
  for(const[u,d]of m.wm){let o=MP_MIR.wm.get(u);if(!o){o=Object.assign({mirror:u,kind:'wild'},d);MP_MIR.wm.set(u,o);WM.push(o);MP_REF.set(o,['wm',u]);}o._hs=Object.assign(o._hs||{},d);}
  MP_CAMP=m.camp||[];MP_NUTS=m.nuts||[];MP_SPY=m.spy;}
function mpMirrorSpawn(u,type,d){const o={mirror:u,special:()=>true,onHurt:null,always:true,noHostile:true,onDeath:null};let e=null;
  try{if(type==='ginger'||type==='nutk'||type==='nutkl')e=candySpawn(type,d.x,d.z,o);else if(type==='bshroom'||type==='bslug'||type==='brider')e=blueSpawn(type,d.x,d.z,o);else e=spawnEnt(type,d.x,d.z,o);}catch(err){console.error('MP Spiegel',type,err);}
  if(!e)return null;e.mirror=u;e.special=()=>true;e.onHurt=null;e.onDeath=null;MP_MIR.dem.set(u,e);MP_REF.set(e,['dem',u]);return e;}
const MP_POS=new Set(['x','y','z']);
function mpApplyObj(o,st,dt){const k=Math.min(1,dt*10);for(const f in st){const v=st[f];if(MP_POS.has(f)&&typeof o[f]==='number'){const dd=v-o[f];o[f]=Math.abs(dd)>8?v:o[f]+dd*k;}else o[f]=v;}}
function mpClientApply(dt){if(!isClient())return;
  for(const g in MP_HS){const A=MG_GET[g]&&MG_GET[g]();if(!A)continue;for(const[i,st]of MP_HS[g]){const o=A[i];if(o)mpApplyObj(o,st,dt);}}
  for(const e of MP_MIR.dem.values())if(e._hs){const st=Object.assign({},e._hs);delete st.mirror;delete st.always;delete st.noHostile;mpApplyObj(e,st,dt);if(e.dead&&e.deadT>4.5){MP_GONE.set(e.mirror,time);}}
  for(const o of MP_MIR.wm.values())if(o._hs)mpApplyObj(o,o._hs,dt);
  for(const[u,t]of MP_GONE)if(time-t>20)MP_GONE.delete(u);}
// Der letzte Schritt jedes Bildes: Zustand vom Host drüberlegen
{const ub0=updateBubbles;updateBubbles=function(dt){ub0(dt);try{mpClientApply(dt);mpProxyTick();}catch(e){if(!mpClientApply.err){mpClientApply.err=1;console.error('MP Abgleich',e);}}};}
// ---------- Mitspieler rechnen nichts selbst, was der Host schon rechnet ----------
{const a=updateNightMobs;updateNightMobs=function(dt){if(isClient())return;return a(dt);};}
{const a=candyTick;candyTick=function(dt){if(isClient())return;return a(dt);};}
{const a=blueTick;blueTick=function(dt){if(isClient())return;return a(dt);};}
{const a=wlFaunaTick;wlFaunaTick=function(dt){if(isClient())return;return a(dt);};}
{const a=spawnSpy;spawnSpy=function(f){if(isClient())return false;return a(f);};}
{const a=updateWild;updateWild=function(dt){if(isClient()){if(!wInit)return a(dt);renderWild();return;}return a(dt);};}
// SpionGHG beim Mitspieler: genau das Bild des Hosts
{const a=updateSpy;updateSpy=function(dt){if(!isClient())return a(dt);const S=MP_SPY;
  if(!S){if(spy)despawnSpy();return;}if(!spyMesh)spyMesh=stripMesh(null,null,spyFrames(null),'sp_');spyMesh.visible=true;
  if(!spy)spy={kind:'spy',hp:40,frame:0,anim:0,state:'peek',t:0,life:99};Object.assign(spy,{x:S.x,y:S.y,z:S.z,w:S.w,h:S.h,hp:S.hp,dead:S.dead,kind:'spy'});MP_REF.set(spy,['spy']);
  const r=S.r;if(r&&SPR[r[5]])setBB(spyMesh,r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],spy.hurt>0?-1.3:r[8]);if(spy.hurt>0)spy.hurt-=dt;};}
// Lager und Nüsse beim Mitspieler
{const a=candyFrame;candyFrame=function(dt){if(!isClient())return a(dt);if(!candyProp)return;const g=candyProp.geometry.attributes;let n=0;
  const put=(x,y,z,w,h,spr,tint)=>{if(n>=CPROP_N)return;const s=SPR[spr];if(!s)return;g.offset.array[n*3]=x;g.offset.array[n*3+1]=y;g.offset.array[n*3+2]=z;g.size.array[n*2]=w;g.size.array[n*2+1]=h;g.uvr.array[n*4]=s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=tint||1;g.rot.array[n]=0;n++;};
  for(const[x,y,z,w,h,fire,spr]of MP_CAMP){if(fire){put(x,y-.05,z,w,h,'cfire'+(Math.floor(time*6)%2),1.35);if(Math.random()<dt*10)spawnParticle(x+(Math.random()-.5)*.4,y+.9,z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.4+Math.random(),(Math.random()-.5)*.3,Math.random()<.5?0xffa020:0x8a8a8a,1.1,.22);}else put(x,y-.08,z,w,h,spr,.95);}
  for(const[x,y,z]of MP_NUTS)put(x,y-.09,z,.18,.18,'cnut',1);candyProp.geometry.instanceCount=n;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;};}
// ---------- Treffen: Schläge der Mitspieler gehen an den Host ----------
function mpFwd(o,n){const r=MP_REF.get(o);if(!r)return false;mpSend({t:'hit',r,n:+n.toFixed(1),pid:MP.pid},MP.hostPeer());o.hurt=.22;try{Snd.hit('sword');}catch(e){}return true;}
MP.hostPeer=()=>{for(const[peer,pid]of MP.peerPid)if(pid===MP.host)return peer;return undefined;};
{const a=hurtAny;hurtAny=function(o,n){if(isClient()&&o&&MP_REF.has(o)&&mpFwd(o,n))return;return a(o,n);};}
{const a=hurtEnt;hurtEnt=function(e,n,by){if(isClient()&&e&&e.mirror){mpFwd(e,n);return;}if(e&&e.ghost)return;return a(e,n,by);};}
{const a=hurtAnimal;hurtAnimal=function(o,n){if(isClient()&&MP_REF.has(o)&&mpFwd(o,n))return;return a(o,n);};}
{const a=hurtWild;hurtWild=function(o,n,by){if(isClient()&&o&&o.mirror){mpFwd(o,n);return;}return a(o,n,by);};}
{const a=hurtSpy;hurtSpy=function(n){if(isClient()&&spy){mpFwd(spy,n);return;}return a(n);};}
{const a=hurtMummy;hurtMummy=function(o,n){if(isClient()&&MP_REF.has(o)&&mpFwd(o,n))return;return a(o,n);};}
{const a=hurtPharaoh;hurtPharaoh=function(n){if(isClient()&&pharaoh&&MP_REF.has(pharaoh)&&mpFwd(pharaoh,n))return;return a(n);};}
// Host: Treffer ausführen, Beute und Erfahrung an den Schützen
function mpHostHit(m,peer){const r=m.r;let o=null;
  if(r[0]==='s'){const A=MG_GET[r[1]]&&MG_GET[r[1]]();o=A&&A[r[2]];}else if(r[0]==='dem')o=DEM.find(e=>e._u===r[1]);else if(r[0]==='wm')o=WM.find(x=>x._u===r[1]);else if(r[0]==='spy')o=spy;
  if(!o)return;MP.lootTo=peer;try{if(r[0]==='spy')hurtSpy(m.n);else if(r[0]==='dem'){if(o.type==='ginger'&&o.land)candyAnger(o.land);if(o.blue&&o.fac!=='demon'){o.fac='demon';o.mad=20;}hurtEnt(o,m.n,'player');}
    else if(r[0]==='wm')hurtWild(o,m.n,'player');else if(r[1]==='pha')hurtPharaoh(m.n);else hurtAny(o,m.n);}catch(e){console.error('MP Treffer',e);}finally{MP.lootTo=null;}}
{const a=spawnDrop;spawnDrop=function(id,n,x,y,z){if(MP.lootTo&&MP.on){mpSend({t:'loot',d:[id,n,+x.toFixed(2),+y.toFixed(2),+z.toFixed(2)]},MP.lootTo);return;}return a(id,n,x,y,z);};}
{const a=gainXP;gainXP=function(n){if(MP.lootTo&&MP.on){mpSend({t:'xp',n},MP.lootTo);return;}return a(n);};}
// ---------- Monster greifen auch Mitspieler an: unsichtbare Stellvertreter beim Host ----------
DT.mpProxy={name:'Mitspieler',fac:'ally',h:1.75,hp:1e9,dmg:0,spd:0,reach:1,cd:1,spr:'imp_',rad:.3};
const MP_PROXY=new Map();
function mpProxyTick(){if(!isHostMP()){for(const[pid,e]of MP_PROXY){if(DEM.includes(e))removeEnt(e);MP_PROXY.delete(pid);}return;}
  for(const R of REMOTE.values()){let e=MP_PROXY.get(R.pid);const alive=time-R.seen<5&&R.ty>-900;if(!alive){if(e){if(DEM.includes(e))removeEnt(e);MP_PROXY.delete(R.pid);}continue;}
    if(!e||!DEM.includes(e)){e=spawnEnt('mpProxy',R.x,R.z,{proxy:R.pid,hidden:true,always:true,noHostile:true,special:()=>true,onHurt:(en,n)=>{const peer=[...MP.peerPid].find(([,p])=>p===en.proxy);if(peer)mpSend({t:'dmg',n:+n.toFixed(1)},peer[0]);return false;}});MP_PROXY.set(R.pid,e);}
    e.x=R.x;e.z=R.z;e.y=R.y;e.hp=e.max;e.dead=false;}
  for(const[pid,e]of MP_PROXY)if(!REMOTE.has(pid)){if(DEM.includes(e))removeEnt(e);MP_PROXY.delete(pid);}}
{const a=entGround;entGround=function(e){if(e.proxy||e.ghost)return;return a(e);};}
// ---------- Nachrichten ----------
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t){try{switch(m.t){
  case'ent':mpRecvEnt(m);return;
  case'hit':if(isHostMP())mpHostHit(m,peer);return;
  case'loot':{const[id,n,x,y,z]=m.d;if(ITEMS[id])spawnDrop(id,n,x,y,z);return;}
  case'xp':gainXP(m.n);return;
  case'dmg':if(state!=='dead'&&state!=='menu'&&state!=='loading')takeDamage(m.n);return;}}catch(e){console.error('MP',m.t,e);}}return a(m,peer);};}
// ---------- Takt des Hosts ----------
{const a=mpTick;mpTick=function(dt){a(dt);if(isHostMP()&&MP.order.length>1){mpEntT+=dt;if(mpEntT>=.2){mpEntT=0;try{mpHostSnapshot();}catch(e){if(!mpHostSnapshot.err){mpHostSnapshot.err=1;console.error('MP Schnappschuss',e);}}}}};}
// Rollenwechsel: wer Host wird, rechnet ab jetzt selbst. Gespiegelte Wesen verschwinden, eigene kommen nach.
let mpLastRole='';
function mpRoleWatch(){if(MP.role===mpLastRole)return;const was=mpLastRole;mpLastRole=MP.role;
  if(MP.role==='host'&&was==='client'){for(const e of MP_MIR.dem.values())if(DEM.includes(e))removeEnt(e);MP_MIR.dem.clear();for(const o of MP_MIR.wm.values()){const i=WM.indexOf(o);if(i>=0)WM.splice(i,1);}MP_MIR.wm.clear();
    for(const g in MP_HS)MP_HS[g].clear();if(spy&&!spy.state)despawnSpy();MP_SPY=null;MP_CAMP=[];MP_NUTS=[];}
  if(MP.role==='client'){MP_SENT.vil=null;for(const g of Object.keys(MP_SENT))delete MP_SENT[g];MP_SENTU.dem.clear();MP_SENTU.wm.clear();}
  if(MP.role==='off'){for(const e of MP_MIR.dem.values())if(DEM.includes(e))removeEnt(e);MP_MIR.dem.clear();for(const o of MP_MIR.wm.values()){const i=WM.indexOf(o);if(i>=0)WM.splice(i,1);}MP_MIR.wm.clear();for(const g in MP_HS)MP_HS[g].clear();}}
setInterval(()=>{try{mpRoleWatch();}catch(e){}},250);
// ---------- Mitspieler: Schleichen und Kreak ----------
{const s0=mpSend;mpSend=function(m,to){if(m&&m.t==='pose'){m.sn=down('sneak')&&!P.riding&&!boatIn?1:0;const k=kreakE;if(k&&!k.dead&&!k.hidden&&DEM.includes(k)){const f=k.down?'k':k.frame;m.k=[+k.x.toFixed(2),+k.y.toFixed(2),+k.z.toFixed(2),String(f),k.flip?1:0,k.steed||''];}}return s0(m,to);};}
DT.kreakGhost=Object.assign({},DT.kreak,{fac:'ghost'});
{const a=mpPose;mpPose=function(m){a(m);const R=REMOTE.get(m.pid);if(!R)return;R.sn=!!m.sn;
  if(m.k){if(!R.kg||!DEM.includes(R.kg)){R.kg=spawnEnt('kreakGhost',m.k[0],m.k[2],{ghost:1,always:true,noHostile:true,special:()=>true,name:'Kreak'});}const g=R.kg;g.tx=m.k[0];g.ty=m.k[1];g.tz=m.k[2];g.frame=isNaN(+m.k[3])?m.k[3]:+m.k[3];g.flip=!!m.k[4];g.seen=time;}
  else if(R.kg){if(DEM.includes(R.kg))removeEnt(R.kg);R.kg=null;}};}
{const a=mpDropPlayer;mpDropPlayer=function(pid){const R=REMOTE.get(pid);if(R&&R.kg&&DEM.includes(R.kg))removeEnt(R.kg);return a(pid);};}
// Kreak-Geist gleitet zur gemeldeten Position
{const a=mpFrame;mpFrame=function(dt){a(dt);for(const R of REMOTE.values()){const g=R.kg;if(!g||g.tx==null)continue;const k=Math.min(1,dt*10);g.x+=(g.tx-g.x)*k;g.y+=(g.ty-g.y)*k;g.z+=(g.tz-g.z)*k;if(time-g.seen>5){g.hidden=true;}else g.hidden=false;}};}
// Figur der Mitspieler: zusätzlich Schleich-Bilder, Namensschild direkt über dem Kopf
mpRemoteSprite=function(R){const F=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,0,'strike'],[0,1,'strike'],[0,0,'sn'],[1,0,'sn'],[2,0,'sn'],[0,1,'sn'],[1,1,'sn'],[2,1,'sn']],strip=document.createElement('canvas');strip.width=64*F.length;strip.height=60;const ctx=strip.getContext('2d');ctx.imageSmoothingEnabled=false;let top=60;
  F.forEach(([f,b,pose],i)=>{const cv=drawHero(R.look,f,!!b,pose==='strike'?pose:undefined,b?'R':'L');let out=document.createElement('canvas');out.width=64;out.height=60;const x=out.getContext('2d');x.imageSmoothingEnabled=false;const ms=b?'R':'L',os=ms==='L'?'R':'L',ang=pose==='strike'?1.1:0;
    const put=(id,side,main)=>{if(id&&SPR[id])drawHeld2(x,id,SPR[id].c,side==='L'?cv.handL:cv.handR,10,side==='L',main?ang:0,main);};if(b){put(R.held,ms,1);put(R.off,os,0);}x.drawImage(cv,10,0);if(!b){put(R.held,ms,1);put(R.off,os,0);}
    out.legTop=cv.legTop;out.headBox=cv.headBox;if(pose==='sn')out=sneakCv(out);
    ctx.drawImage(out,i*64,0);if(!pose&&!b&&!f)top=Math.min(top,cv.headBox[2]);SPR['rp_'+R.pid+'_'+i]={u:i/F.length,v:0,du:1/F.length,dv:1,w:64,h:60};});
  const tex=new THREE.CanvasTexture(strip);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  if(R.mesh){scene.remove(R.mesh);R.mesh.geometry.dispose();R.mesh.material.uniforms.map.value.dispose();}
  const m=bbMaterial(tex,0,0);R.h=1.75*(R.size||1)*60/(60-top+1);R.w=R.h*64/60;R.head=1.75*(R.size||1);R.mesh=makeBillboards([{x:R.x||0,y:-999,z:R.z||0,w:R.w,h:R.h,spr:'rp_'+R.pid+'_0',tint:1}],m);R.mesh.frustumCulled=false;scene.add(R.mesh);};
{const a=mpFrame;mpFrame=function(dt){a(dt);for(const R of REMOTE.values()){if(!R.mesh)continue;const g=R.mesh.geometry.attributes;if(g.offset.array[1]<-900)continue;
    const vx=R.x-camera.position.x,vz=R.z-camera.position.z,back=(-Math.sin(R.yaw)*vx-Math.cos(R.yaw)*vz)>0,strike=R.act>=0&&R.act<.35;
    if(R.sn&&!strike){const f=8+(back?3:0)+(R.mv?1+(Math.floor(R.anim)%2):0),s=SPR['rp_'+R.pid+'_'+f];if(s){g.uvr.array[0]=s.u;g.uvr.array[1]=s.v;g.uvr.array[2]=s.du;g.uvr.array[3]=s.dv;g.uvr.needsUpdate=true;}}
    const d=Math.hypot(vx,vz);nameTag('mp_'+R.pid,R.name+(R.pid===MP.host?' ★':''),R.x,R.y+(R.head||1.75)*(R.sn?.78:1)+.18,R.z,d<60&&state==='playing');}};}
