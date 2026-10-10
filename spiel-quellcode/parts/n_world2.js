/* =========================================================
   Tiere der Wildnis (neu): gleichmäßig belebt
   - Statt einmal pro Region erscheinen Tiergruppen laufend rund um den Spieler
     (außer Sichtweite, 105–180 m), passend zum Biom an dieser Stelle.
   - Jedes Biom hat eine Zielmenge an Tieren in der Nähe: nie zu viele, nie zu wenige.
   - Gruppen weit hinter dem Spieler (> 280 m) verschwinden wieder.
   - Raubtiere (Wölfe, Geparden, Krokodile …) sind selten, höchstens 1–2 Gruppen.
   ========================================================= */
// [Art (A = heimisch, W = Wildtier), min, max, Gewicht]
const FA_BIO={
  wald:[['A','deer',3,5,3],['A','boar',2,4,2],['A','hare',1,3,2],['A','fox',1,2,1],['A','bear',1,1,.4]],
  ebene:[['A','hare',2,4,3],['A','deer',3,6,3],['A','fox',1,2,1],['A','boar',2,3,1]],
  nadelwald:[['A','elk',2,3,2],['A','deer',2,4,2],['A','wolf',3,4,.5],['A','bear',1,1,.6],['A','fox',1,2,1],['A','hare',1,2,1.5]],
  redwood:[['A','deer',3,5,3],['A','elk',1,3,2],['A','bear',1,1,.6],['A','fox',1,1,1],['A','boar',2,3,1]],
  wueste:[['W','ostrich',3,6,2],['W','gazelle',4,7,2],['W','snake',1,1,.5],['A','hare',1,2,1]],
  dschungel:[['W','baboon',5,8,2],['W','elephant',3,5,1.5],['A','boar',2,4,2],['W','snake',1,1,.5]],
  savanne:[['W','zebra',6,10,3],['W','gazelle',6,10,3],['W','gnu',8,12,3],['W','giraffe',2,4,1.5],['W','elephant',3,6,1.5],['W','ostrich',3,5,1.5],
    ['W','warthog',3,5,2],['W','buffalo',6,10,1.5],['W','rhino',1,2,.6],['W','cheetah',1,2,.4],['W','wilddog',4,6,.3]],
  kueste:[['A','hare',2,3,2],['A','boar',2,3,1],['A','deer',2,4,1.5],['A','fox',1,1,1]],
  insel:[['A','hare',2,4,2],['A','boar',2,3,1.5],['A','deer',2,3,1.5]],
  schnee:[['A','wolf',3,4,.5],['A','elk',2,3,2],['A','hare',2,3,2],['A','fox',1,2,1.5],['A','deer',2,3,1]],
  schneeberge:[['A','wolf',2,3,.5],['A','elk',1,3,2],['A','hare',1,2,1.5],['A','fox',1,1,1]],
  steinwueste:[['W','baboon',4,7,2],['W','gazelle',4,7,2],['W','ostrich',2,4,1],['W','warthog',2,4,1],['W','snake',1,1,.5]],
  sumpf:[['W','croc',1,1,.6],['W','snake',1,1,.4],['A','boar',2,4,2],['A','hare',1,3,1.5],['A','deer',2,3,1.5]],
  candy:[],meer:[]};
// Zielmenge an Tieren im Umkreis von 230 m (Startwald zum Vergleich: ~40 im Umkreis von 100 m)
const FA_TGT={wald:55,ebene:45,nadelwald:40,redwood:40,wueste:24,dschungel:45,savanne:75,kueste:28,insel:26,schnee:32,schneeberge:24,steinwueste:34,sumpf:30,candy:0,meer:0};
const FA_PRED={wolf:1,bear:1,cheetah:1,wilddog:1,croc:1,snake:1,rhino:1};
const FA_R=230,FA_KILL=280;
// Wildtiere dürfen jetzt auch in diesen Biomen leben
Object.assign(WL_WSP_OK,{gazelle:['savanne','steinwueste','wueste'],warthog:['savanne','steinwueste'],ostrich:['savanne','wueste','steinwueste'],
  buffalo:['savanne'],rhino:['savanne']});
const FA_H=[];   // aktive Gruppen: {k,sp,o (Tierliste oder Wildgruppe)}
function faAlive(h){return h.k==='A'?h.o.filter(a=>!a.wlFree&&a.alive):wAlive(h.o);}
function faCenter(h){const l=faAlive(h);if(!l.length)return null;let x=0,z=0;for(const a of l){x+=a.x;z+=a.z;}return[x/l.length,z/l.length,l.length];}
function faSpot(x,z,water){if(!wlWild(x,z)||coreDist(x,z)<40)return false;const g=getHeight(x,z);if(water?g>WATER-.4:g<WATER+.3)return false;
  if(!water&&(Math.abs(getHeight(x+2,z)-g)>1.6||Math.abs(getHeight(x,z+2)-g)>1.6))return false;return true;}
// Leere Wildgruppen wiederverwenden, damit die Liste nicht endlos wächst
function faGroup(sp,x,z,r,mn,mx,ex){const g=wGroup(sp,x,z,r,mn,mx,Object.assign({wl:1,fa:1},ex||{}));
  const i=WG.findIndex(o=>o!==g&&o.dead&&o.wl&&!WM.some(m=>m.g===o));if(i>=0){WG.pop();g.id=WG[i].id;WG[i]=g;}return g;}
const FA_V=new THREE.Vector3();
function faSpawn(near){camera.getWorldDirection(FA_V);const fl=Math.hypot(FA_V.x,FA_V.z)||1,fx=FA_V.x/fl,fz=FA_V.z/fl;
  for(let t=0;t<14;t++){const a=Math.random()*6.283,d=near?35+Math.random()*145:55+Math.random()*125,x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d;
    // nah am Spieler nur seitlich oder hinter ihm erscheinen, nie direkt vor den Augen
    if(!near&&d<115&&Math.cos(a)*fx+Math.sin(a)*fz>.15)continue;
    if(!wlWild(x,z))continue;const bio=wlBiomeOf(wlDom(x,z),x,z),T=FA_BIO[bio];if(!T||!T.length)continue;
    // Raubtiere begrenzen
    const preds=FA_H.filter(h=>FA_PRED[h.sp]).length;const pool=T.filter(e=>!FA_PRED[e[1]]||preds<2);if(!pool.length)continue;
    let tot=0;for(const e of pool)tot+=e[4];let k=Math.random()*tot,e=pool[0];for(const q of pool){if((k-=q[4])<=0){e=q;break;}}
    const[kind,sp,mn,mx]=e,water=sp==='croc';if(!faSpot(x,z,water))continue;
    if(kind==='W'&&!wLand(sp,x,z))continue;
    const n=mn+Math.floor(Math.random()*(mx-mn+1));
    if(kind==='A'){const out=[];let lead=null;for(let i=0;i<n;i++){let ax=x,az=z;if(i){for(let u=0;u<6;u++){const bx=x+(Math.random()-.5)*9,bz=z+(Math.random()-.5)*9;if(faSpot(bx,bz)){ax=bx;az=bz;break;}}}
        const an=wlSpawnAnimal(sp,ax,az,sp==='deer'||sp==='elk'?{male:i===0&&Math.random()<.6}:null);if(!an)break;
        if(sp==='wolf'){if(!lead){lead=an;an.pack=an;an.roam=120;}else{an.pack=lead;an.ox=(Math.random()-.5)*8;an.oz=(Math.random()-.5)*8;}HOSTILES.push(an);}out.push(an);}
      if(out.length){FA_H.push({k:'A',sp,o:out});return true;}return false;}
    if(WM.length+n>W_N-20)return false;let g;
    if(sp==='croc'){g=faGroup('croc',x,z,6,1,1,{lurk:{x,z}});wSpawn(g,'croc',x,z,{inWater:1});}
    else if(sp==='snake'){g=faGroup('snake',x,z,40,1,1);wSpawn(g,'snake',x,z);}
    else if(sp==='cheetah'||sp==='wilddog'){g=faGroup(sp,x,z,sp==='cheetah'?320:420,mn,mx,{st:'rest',hunger:.5,lair:{x,z}});for(let i=0;i<n;i++)wSpawn(g,sp,x+(Math.random()-.5)*8,z+(Math.random()-.5)*8);}
    else{g=faGroup(sp,x,z,sp==='elephant'?200:140,mn,mx);for(let i=0;i<n;i++){let ax=x+(Math.random()-.5)*12,az=z+(Math.random()-.5)*12;if(!faSpot(ax,az)){ax=x;az=z;}wSpawn(g,sp,ax,az);}}
    FA_H.push({k:'W',sp,o:g});return true;}
  return false;}
function faRemove(h){if(h.k==='A'){for(const a of h.o)if(!a.wlFree&&!(a.corpse!=null&&!a.alive))wlFreeAnimal(a);}
  else{const o=h.o;for(const m of WM.filter(m=>m.g===o&&!m.dead))wRemove(m);o.min=0;o.max=0;o.dead=1;o.x=o.cx=o.tx=0;o.z=o.cz=o.tz=-9e6;if(o.lurk){o.lurk.x=0;o.lurk.z=-9e6;}if(o.lair){o.lair.x=0;o.lair.z=-9e6;}}}
function faReset(){for(const h of FA_H)faRemove(h);FA_H.length=0;}
{const r0=wlFaunaReset;wlFaunaReset=function(){r0();faReset();};}
// Verlassene Gruppen sollen nicht irgendwo nachwachsen
{const a=wRepopulate;wRepopulate=function(g,dt){if(g.dead)return;return a(g,dt);};}
// Ersetzt die alte Regionen-Bevölkerung
function wlFaunaTick(dt){wlFaunaT-=dt;if(wlFaunaT>0)return;wlFaunaT=1.2;if(!WL_READY||!wInit)return;
  for(const a of WL_ANI)if(!a.wlFree&&(!a.alive&&a.corpse==null||Math.hypot(a.x-P.x,a.z-P.z)>900))wlFreeAnimal(a);
  if(WL_ACTIVE.size){for(const[,v]of WL_ACTIVE)wlDespawn(v.list);WL_ACTIVE.clear();}
  if(P.x>60000){if(FA_H.length)faReset();return;}
  let cnt=0;
  for(let i=FA_H.length-1;i>=0;i--){const h=FA_H[i],c=faCenter(h);
    if(!c||Math.hypot(c[0]-P.x,c[1]-P.z)>FA_KILL){faRemove(h);FA_H.splice(i,1);continue;}
    if(Math.hypot(c[0]-P.x,c[1]-P.z)<FA_R)cnt+=c[2];}
  if(!wlWild(P.x,P.z))return;
  const bio=wlBiomeOf(wlDom(P.x,P.z),P.x,P.z),tgt=FA_TGT[bio]==null?30:FA_TGT[bio];if(!tgt)return;
  const near=cnt<tgt*.3;let tries=near?4:2;
  while(cnt<tgt&&tries-->0){const n0=FA_H.length;if(faSpawn(near)&&FA_H.length>n0){const c=faCenter(FA_H[FA_H.length-1]);if(c)cnt+=c[2];}}
}
// Wird ein heimisches Tier angegriffen, fliehen die Artgenossen in der Nähe mit
{const a=hurtAnimal;hurtAnimal=function(an,n){a(an,n);if(!an||an.tame||an.pen)return;
  for(const b of animals)if(b!==an&&b.alive&&!b.tame&&!b.pen&&b.type===an.type&&b.type!=='boar'&&b.type!=='wolf'&&Math.hypot(b.x-an.x,b.z-an.z)<18)b.scared=Math.max(b.scared||0,4);};}
