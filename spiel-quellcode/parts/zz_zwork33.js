/* =========================================================
   Beta-3.3 (0.0.108)
   - Ruprecht, der Pferdehändler, steht wieder vor den Ställen (er ist nicht mehr durch Coda spaziert)
   - Schläge treffen das, was vorne ist: kein Gras mehr hinter Bäumen, Felsen oder Stümpfen abmähen
   - Baumstümpfe kann man mit einer Axt entfernen. Dann ist der Baum für immer weg.
   ========================================================= */
// ---------- 1) Ruprecht bleibt bei seinen Pferden ----------
C2_KEEP.add('Ruprecht');
{const a=updateVillagers;let ok=false;updateVillagers=function(dt){
  if(!ok){const v=villagers.find(q=>q.name==='Ruprecht');
    if(v){ok=true;v.ax=9.5;v.az=661;v.rad=1.2;v.job='keep';
      if(!v._hid&&!v.asleep&&!v.dead&&Math.hypot(v.x-v.ax,v.z-v.az)>3){v.x=v.ax;v.z=v.az;v.tx=v.ax;v.tz=v.az;v.wait=2;v.y=getHeight(v.x,v.z);}}}
  return a(dt);};}

// ---------- 2) + 3) Treffen, was vorne ist / Baumstümpfe ----------
const ST_PERM=1e15,stPerm=v=>v!=null&&v>=1e14;
const stAxe=()=>{const H=heldItem(),it=H&&H.it;return!!(it&&(it.tool==='axe'||it.weapon==='axe'));};
let SW_CUT=null,stHintT=0;
const hvSolid=b=>{const S=b._hv;return S.t==='tree'||(S.t==='rock'&&b.w>1.2);};
// Das vorderste feste Ding (Baum, Fels, Werkbank, Stumpf) vor dem Spieler
function swFront(W){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),R=(W&&W.range)||2;let best=null,bd=1e9;
  const see=(x,z,r,o)=>{const dx=x-P.x,dz=z-P.z,al=dx*fx+dz*fz,lat=Math.abs(dx*fz-dz*fx);if(al<-.2||al-r>R+.4||lat>r+.6)return;const d=Math.max(0,al-r);if(d<bd){bd=d;best=o;}};
  for(const t of tgridNear(P.x+fx*1.5,P.z+fz*1.5)){if(t.type==='prop'&&!t.boulder&&!t.bench)continue;
    if(t.broken&&TREEOBJ.get(treeKey(t.x,t.z))===t){const k=treeKey(t.x,t.z);if(stPerm((FLAGS.felled||{})[k]))continue;see(t.x,t.z,Math.max(.35,t.r),{kind:'ostump',t,k});continue;}
    if(t.broken||!(t.r>0))continue;see(t.x,t.z,t.r,{kind:'solid'});}
  for(const b of hvNear(P.x,P.z,R+4)){if(!b._hv||!b._m||!b._m.parent)continue;const S=b._hv;
    if(b._gone){if(S.t==='tree'&&S.st&&b.w>0&&!stPerm((FLAGS.harv||{})[b._hk]))see(b.x,b.z,S.big?1:.4,{kind:'hstump',b});continue;}
    if(!(b.w>.05))continue;
    if(hvSolid(b)){if(Math.abs(P.y-b.y)>4&&S.t!=='tree')continue;see(b.x,b.z,Math.max(.35,Math.min(b.w*.22,2.2)),{kind:'solid'});}}
  return best?{o:best,d:bd}:null;}
// Pflanzen hinter dem vordersten festen Ding werden nicht mehr getroffen
{const t0=hvTarget;hvTarget=function(range){const b=t0(range);if(b&&SW_CUT!=null){const d=Math.hypot(b.x-P.x,b.z-P.z),r=hvSolid(b)?Math.max(.35,Math.min(b.w*.22,2.2)):0;if(d-r>SW_CUT+.35)return null;}return b;};}
// Einen Stumpf bearbeiten
function stumpHit(o){const old=o.kind==='ostump',obj=old?o.t:o.b,x=obj.x,z=obj.z,gy=getHeight(x,z);P.lastAction=time;
  if(!stAxe()){Snd.chop();if(time>stHintT){stHintT=time+6;toast('Baumstümpfe kannst du mit einer Axt entfernen');}return;}
  const big=old?obj.type==='redwood':!!o.b._hv.big;if(obj._sth==null)obj._sth=big?5:3;obj._sth-=gatherPower('wood')>=40?2:1;Snd.chop();wearTool();
  for(let i=0;i<7;i++)spawnParticle(x+(Math.random()-.5)*.5,gy+.4+Math.random()*.4,z+(Math.random()-.5)*.5,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,Math.random()<.5?0x9a6a36:0x5a3a1c,.6,.22);
  const d=old?TREEDECO.get(o.k):o.b;
  if(d&&d._m){const g=d._m.geometry.attributes;if(g.tint&&d._i<g.tint.count){const i=d._i,t0=g.tint.array[i];g.tint.array[i]=1.4;g.tint.needsUpdate=true;setTimeout(()=>{g.tint.array[i]=t0;g.tint.needsUpdate=true;},120);}}
  if(obj._sth>0)return;
  // weg – für immer
  if(old){FLAGS.felled=FLAGS.felled||{};FLAGS.felled[o.k]=ST_PERM;}else{FLAGS.harv=FLAGS.harv||{};FLAGS.harv[o.b._hk]=ST_PERM;}
  stHide(obj,d,old);obj._sth=null;
  spawnDrop('stick',1+(Math.random()*2|0),x,gy+.3,z);if(Math.random()<.5&&ITEMS.fiber)spawnDrop('fiber',1,x,gy+.3,z);
  gainXP(1);Snd.crack();for(let i=0;i<18;i++)spawnParticle(x,gy+.3,z,(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,Math.random()<.6?0x6a4a24:0x4a3a22,1,.28);
  if(!FLAGS.stumpTip){FLAGS.stumpTip=1;toast('Baumstumpf entfernt. Hier wächst kein Baum mehr nach.');}else toast('Baumstumpf entfernt');}
function stHide(obj,d,old){if(old){obj.r=0;obj.h=0;}else for(const t of hvProps(obj)){if(t._r0==null)t._r0=t.r;t.r=0;}
  if(d){d.w=0;d.h=0;d.sway=0;syncDeco(d);}}
// Schlagen: erst das Vorderste
{const g0=gatherHit;gatherHit=function(W){if(P.x>=60000)return g0(W);const f=swFront(W);
  if(f&&(f.o.kind==='ostump'||f.o.kind==='hstump')){SW_CUT=f.d;try{if(harvHit(W,true))return true;}finally{SW_CUT=null;}stumpHit(f.o);return true;}
  SW_CUT=f?f.d:null;try{return g0(W);}finally{SW_CUT=null;}};}
// Für immer entfernte Stümpfe bleiben weg (Laden, Mehrspieler)
{const a=stumpDeco;stumpDeco=function(d,t){a(d,t);if(stPerm((FLAGS.felled||{})[treeKey(d.x,d.z)])){d.w=0;d.h=0;syncDeco(d);}};}
{const a=markFelled;markFelled=function(t){a(t);if(stPerm((FLAGS.felled||{})[treeKey(t.x,t.z)])){t.r=0;t.h=0;}};}
{const a=applyFelledAll;applyFelledAll=function(){a();const F=FLAGS.felled||{};for(const k in F){if(!stPerm(F[k]))continue;const t=TREEOBJ.get(k),d=TREEDECO.get(k);if(t){t.r=0;t.h=0;}if(d&&d.w>0){d.w=0;d.h=0;syncDeco(d);}}};}
{const a=hvGone;hvGone=function(b,sync){
  // natürliche Baumstümpfe: einmal weg, immer weg
  if(b._o&&/stump/.test(b._o.spr)&&!b._hv.st&&FLAGS.harv&&FLAGS.harv[b._hk]!=null)FLAGS.harv[b._hk]=ST_PERM;
  a(b,sync);if(stPerm((FLAGS.harv||{})[b._hk])&&b.w>0){b.w=0;b.h=0;b.sway=0;if(sync!==false)syncDeco(b);}};}
{const a=hvApplyAll;hvApplyAll=function(){a();const F=FLAGS.harv||{};for(const b of HGONE)if(stPerm(F[b._hk])&&b.w>0){b.w=0;b.h=0;syncDeco(b);}};}
