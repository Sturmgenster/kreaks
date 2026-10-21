/* =========================================================
   0.0.129 · Gemeinsame Monster, Geheimräume, verzauberter Runenstahl, Obergeschosse
   - Mehrspieler: In den Wildnis-Gewölben und auf den Turm-Ebenen 1 und 2 rechnet der Host die Monster.
     Sind Host und Mitspieler am selben Ort, kämpfen alle gegen dieselben Monster (auch gegen denselben Boss).
     Geschosse der Monster sehen alle.
   - Wildnis-Gewölbe: hinter einer rissigen Außenwand liegt oft ein geheimer Raum mit Truhe.
   - Runenstahl gibt es jetzt auch verzaubert (nur aus Truhen im Turm).
   - Patrizierhäuser: eine Treppe führt ins Obergeschoss mit Schlafzimmer.
   0.0.130–0.0.131 · Reparieren und Mehrspieler-Feinschliff
   - Schmiede (Dofra, Gorm, Hilda, Bertold, Wenna) reparieren gegen Geld. Am Amboss repariert man selbst mit Barren, Holz oder Stein.
     Den Amboss baut man an der Werkbank aus 6 Eisenbarren, der Amboss in Dofras Schmiede geht auch.
   - Geht der Host aus dem Gewölbe, bekommt der Mitspieler seine eigenen Monster zurück.
   - Pilzlande: Die Nacht-Zombies und Big Lunar sind jetzt gemeinsam.
   - Patrizierhäuser haben keinen Eckturm mehr, der ins Obergeschoss ragt.
   - Bosse greifen alle Spieler an, nicht nur den Host (Minotaurus, Tarantula, Big Lunar, Gewölbe-Wächter).
     Wer einen Gewölbe-Wächter besiegt, besiegt ihn für die ganze Welt. Die große Truhe öffnet jeder für sich.
   ========================================================= */
// =========================================================
// Mehrspieler: gemeinsame Monster in Gewölben und Turm-Ebenen
// =========================================================
let DG_BLD=false;const lvKey=()=>(DGX.on||DG_BLD)&&DGX.d?(DGX.d.tower?'T'+DGX.d.lvl:(DGX.d.g?'D'+DGX.d.g.id:null)):null;
const mpSyncKey=k=>!!k&&(k[0]==='D'||k==='T1'||k==='T2'||k==='T3'||k==='T4');
{const a=spawnEnt;spawnEnt=function(t,x,z,o){const e=a(t,x,z,o);try{const k=lvKey();if(e&&mpSyncKey(k)&&!(o&&o.mirror)&&!e.proxy&&e.fac==='demon'){e.lvk=k;if(MP.on&&MP.role==='host')e.msync=1;
  // Mitspieler in den Pilzlanden: Die Nacht-Zombies kommen vom Host, eigene entstehen nicht
  if(k==='T3'&&t==='pzzombie'&&mpHostHere())removeEnt(e);}}catch(_){}return e;};}
function mpHostHere(){if(!(MP.on&&MP.role==='client'&&MP.ready))return false;const R=REMOTE.get(MP.host),d=DGX.d;if(!R||!d||time-R.seen>5)return false;
  const ox=d.ox,oz=d.oz,W=d.W;return R.tx>ox-2&&R.tx<ox+W+2&&R.tz>oz-2&&R.tz<oz+W+2&&(d.tower||Math.abs(R.ty-P.y)<70);}
// Besiegte Wächter der Wildnis-Gewölbe gelten für die ganze Welt (alle Spieler)
FLAGS.bossDown=FLAGS.bossDown||{};try{MP_KEYS.push('bossDown');}catch(e){}
{const a=dgBuild;dgBuild=function(g){try{if(g&&(FLAGS.bossDown||{})['D'+g.id]){const D=FLAGS.dgs=FLAGS.dgs||{};(D[g.id]=D[g.id]||{}).boss=1;}}catch(e){}return a(g);};}
function mpBossDownTick(){const d=DGX.d;if(!DGX.on||!d||d.tower||!d.g||!d.st)return;const id='D'+d.g.id,B=FLAGS.bossDown=FLAGS.bossDown||{};
  if(d.st.boss&&!B[id]){B[id]=1;return;}
  if(B[id]&&!d.st.boss){d.st.boss=1;let hit=false;for(const e of DGX.ents)if(e&&e.dgBoss&&!e.mirror&&!e.dead){e.dead=true;e.alive=false;removeEnt(e);hit=true;}
    for(const e of MPL.stash)if(e.dgBoss)e.dead=true;saveGame();if(hit)showArea('Ein Mitspieler hat den Wächter besiegt!');}}
// Eigene Monster des Mitspielers werden nur beiseitegelegt. Geht der Host weg, kommen sie zurück.
const MPL={k:null,stash:[],away:0,pzB:null,pzC:null};
function mpLvRestore(){const st=DGX.d&&DGX.d.st||{},T=DGX.tw;for(const e of MPL.stash){if(e.dead||DEM.includes(e))continue;if((e.dgBoss||e.twBoss)&&(st.boss||(T&&T.open)))continue;
    e.mpGone=0;DEM.push(e);if(e.fac==='demon'&&!e.noHostile)HOSTILES.push(e);}
  if(T&&T.boss&&T.boss.mirror){const o=MPL.stash.find(e=>e.twBoss);if(o)T.boss=o;}
  for(let i=0;i<DGX.ents.length;i++){const e=DGX.ents[i];if(e&&e.mirror&&e.dgBoss){const o=MPL.stash.find(q=>q.dgBoss);if(o)DGX.ents[i]=o;}}
  if(typeof PZ!=='undefined'){if(MPL.pzB)PZ.boss=MPL.pzB;if(MPL.pzC)PZ.cultists=MPL.pzC;}MPL.pzB=MPL.pzC=null;MPL.stash=[];}
const mpRemotesIn=k=>{if(!DGX.d)return[];const d=DGX.d;return[...REMOTE.values()].filter(R=>time-R.seen<5&&R.tx>d.ox-2&&R.tx<d.ox+d.W+2&&R.tz>d.oz-2&&R.tz<d.oz+d.W+2&&(d.tower||Math.abs(R.ty-P.y)<70));};
function mpLvTick(dt){const k=DGX.on?lvKey():null;if(k!==MPL.k){MPL.k=k;MPL.stash=[];MPL.away=0;MPL.pzB=MPL.pzC=null;}if(!mpSyncKey(k))return;mpBossDownTick();
  if(MP.on&&MP.role==='host'){const here=mpRemotesIn(k).length>0;
    for(const e of DEM){if(e.lvk!==k||e.mirror)continue;if(!e.msync)e.msync=1;if(here&&!e.always){e.always=1;e._mpAlw=1;}
      if(e.dormant&&e.wakeR&&state==='playing')for(const R of REMOTE.values())if(time-R.seen<5&&Math.hypot(R.tx-e.x,R.tz-e.z)<e.wakeR&&Math.abs(R.ty-e.y)<6){e.dormant=false;if(e.onWake)e.onWake(e);break;}}
    if(here&&k==='T3')mpPzFxSend();return;}
  if(!mpHostHere()){if(MPL.stash.length&&(MPL.away+=dt||.016)>2)mpLvRestore();return;}MPL.away=0;
  for(const e of DEM.slice()){if(e.mirror||e.proxy||e.lvk!==k||e.fac!=='demon')continue;e.mpGone=1;removeEnt(e);if(!(k==='T3'&&e.type==='pzzombie'))MPL.stash.push(e);}
  const mir=[...MP_MIR.dem.values()],T=DGX.tw;if(T&&T.boss&&T.boss.mpGone){const m=mir.find(e=>e.twBoss&&e.lvk===k);if(m)T.boss=m;}
  for(let i=0;i<DGX.ents.length;i++){const e=DGX.ents[i];if(e&&e.mpGone&&e.dgBoss){const m=mir.find(q=>q.dgBoss&&q.lvk===k);if(m)DGX.ents[i]=m;}}
  // Pilzlande: Big Lunar und seine Diener sind die des Hosts
  if(k==='T3'&&typeof PZ!=='undefined'){const bm=mir.find(e=>e.type==='biglunar');if(bm&&PZ.boss!==bm){if(!MPL.pzB&&PZ.boss&&!PZ.boss.mirror)MPL.pzB=PZ.boss;PZ.boss=bm;}
    const cm=mir.filter(e=>e.type==='pzcult').sort((a,b)=>(a.ring||0)-(b.ring||0));if(cm.length&&(PZ.cultists||[]).some(c=>!c.mirror)){if(!MPL.pzC)MPL.pzC=PZ.cultists;PZ.cultists=cm;}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{mpLvTick(dt);}catch(e){if(!mpLvTick.err){mpLvTick.err=1;console.error('MP Ebene',e);}}};}
// Geschosse der Monster: der Host schickt sie, die anderen sehen sie (Schaden kommt vom Host)
{const a=shoot;shoot=function(e,tx,ty,tz,R,o){const n0=SHOTS.length;a(e,tx,ty,tz,R,o);try{if(MP.on&&MP.role==='host'&&MP.ready&&e&&e.msync){const L=SHOTS.slice(n0).map(s=>[+s.x.toFixed(2),+s.y.toFixed(2),+s.z.toFixed(2),+s.vx.toFixed(2),+s.vy.toFixed(2),+s.vz.toFixed(2),s.grav||0,s.orb,s.size,s.col,s.life,s.aoe||0]);if(L.length)mpSend({t:'dsh',L});}}catch(_){}};}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='dsh'){try{if(MP.role==='client')for(const q of m.L){if(Math.hypot(q[0]-P.x,q[2]-P.z)>260)continue;SHOTS.push({x:q[0],y:q[1],z:q[2],vx:q[3],vy:q[4],vz:q[5],grav:q[6],orb:q[7],size:q[8],col:q[9],life:q[10],aoe:q[11],t:0,dmg:0,fac:'demon',home:0,src:null,ghost:1});}}catch(e){}return;}return a(m,peer);};}
// =========================================================
// Geheimräume in den Wildnis-Gewölben
// =========================================================
function dgSecrets(g){if(!DGX.d||DGX.d.tower||!DGX.d.G)return;const d=DGX.d,G=d.G,N=G.N,r=mulberry32(((g.seed|0)^0x5ec2)>>>0),M=dgMats(),TM=tzMats(),grp=DGX.grp;d.ox0=d.ox;d.oz0=d.oz;d.W0=d.W;DGX.secrets=[];
  const cand=[];for(const R of G.rooms){if(R.c===G.start||R.c===G.boss)continue;if(R.i===0)cand.push([R,-1,0]);if(R.i===N-1)cand.push([R,1,0]);if(R.j===0)cand.push([R,0,-1]);if(R.j===N-1)cand.push([R,0,1]);}
  for(let i=cand.length-1;i>0;i--){const j=(r()*(i+1))|0;[cand[i],cand[j]]=[cand[j],cand[i]];}const n=r()<.75?1+(r()<.4?1:0):0;
  const box=(w,h,dd,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),m);o.position.set(x,y,z);grp.add(o);return o;},sol=(x,z,hw,hd,y0,y1)=>{const b=solAdd({x,z,hw,hd,y0,y1,rot:0,solid:1,dg:1});DGX.sol.push(b);return b;};
  for(let s=0;s<n&&s<cand.length;s++){const[R,dx,dz]=cand[s],wx=dx?d.ox+(dx<0?0:N*DG_C):d.ox+(R.i+.5)*DG_C,wz=dz?d.oz+(dz<0?0:N*DG_C):d.oz+(R.j+.5)*DG_C,alongZ=!!dx;
    // alte Wandstücke ausblenden und neu mit Lücke bauen
    for(const o of grp.children)if(o.isMesh&&Math.abs(o.position.x-wx)<.15&&Math.abs(o.position.z-wz)<.15&&Math.abs(o.position.y-(DG_Y+DG_H/2))<.2)o.visible=false;
    for(const b of DGX.sol)if(Math.abs(b.x-wx)<.15&&Math.abs(b.z-wz)<.15)b.off=true;
    const seg=(DG_C-3)/2;for(const sd of[-1,1]){const cx=alongZ?wx:wx+sd*(1.5+seg/2),cz=alongZ?wz+sd*(1.5+seg/2):wz;box(alongZ?1:seg,DG_H,alongZ?seg:1,M.wall,cx,DG_Y+DG_H/2,cz);sol(cx,cz,alongZ?.5:seg/2,alongZ?seg/2:.5,DG_Y,DG_Y+DG_H);}
    box(alongZ?1:3,1,alongZ?3:1,M.wall,wx,DG_Y+DG_H-.5,wz);
    const cg=new THREE.Group();for(let a=-1;a<=1;a++)for(let b=0;b<3;b++){const m=new THREE.Mesh(new THREE.BoxGeometry(alongZ?.9:1.05,(DG_H-1)/3+.15,alongZ?1.05:.9),TM.wall);m.position.set(alongZ?(r()-.5)*.15:a*1,b*(DG_H-1)/3+(DG_H-1)/6,alongZ?a*1:(r()-.5)*.15);cg.add(m);}
    cg.position.set(wx,DG_Y,wz);grp.add(cg);const cs=sol(wx,wz,alongZ?.55:1.6,alongZ?1.6:.55,DG_Y-1,DG_Y+DG_H);
    // der Raum dahinter (8 × 8 m)
    const ux=dx,uz=dz,rc=[wx+ux*4.5,wz+uz*4.5],RW=8;const fl=box(RW,.1,RW,M.floor,rc[0],DG_Y-.04,rc[1]);fl.material=M.stone;box(RW,.2,RW,M.ceil,rc[0],DG_Y+DG_H+.1,rc[1]);
    box(alongZ?1:RW+2,DG_H,alongZ?RW+2:1,M.wall,rc[0]+ux*(RW/2+.5),DG_Y+DG_H/2,rc[1]+uz*(RW/2+.5));sol(rc[0]+ux*(RW/2+.5),rc[1]+uz*(RW/2+.5),alongZ?.5:RW/2+1,alongZ?RW/2+1:.5,DG_Y,DG_Y+DG_H);
    for(const sd of[-1,1]){const cx=alongZ?rc[0]:rc[0]+sd*(RW/2+.5),cz=alongZ?rc[1]+sd*(RW/2+.5):rc[1];box(alongZ?RW:1,DG_H,alongZ?1:RW,M.wall,cx,DG_Y+DG_H/2,cz);sol(cx,cz,alongZ?RW/2:.5,alongZ?.5:RW/2,DG_Y,DG_Y+DG_H);
      const fx=alongZ?rc[0]:rc[0]+sd*(RW/2-.4),fz=alongZ?rc[1]+sd*(RW/2-.4):rc[1];box(.15,.5,.15,M.wood,fx,DG_Y+2.6,fz);const fm=box(.22,.3,.22,M.fire,fx,DG_Y+2.95,fz);DGX.traps.push({fire:fm,x:fx,z:fz});}
    if(!(d.st.ch&&d.st.ch['ds'+s]))DGX.chests.push(dgChest(rc[0]+ux*2,rc[1]+uz*2,'ds'+s,false));if(r()<.6){const t=['usksa','uskha','troll','zombie'][(r()*4)|0];if(DT[t]){const e=spawnEnt(t,rc[0],rc[1],{home:{x:rc[0],z:rc[1]},cmd:1,aggroT:0});if(t==='troll')e.special=mzTrollAI;e.dormant=true;e.showDormant=true;e.wakeR=8;DGX.ents.push(e);}}
    DGX.secrets.push({x:wx,z:wz,y:DG_Y,g:cg,sol:cs,hp:5,room:{x:rc[0],z:rc[1],w:RW}});}
  if(DGX.secrets.length){d.ox-=12;d.oz-=12;d.W+=24;}}
{const a=dgBuild;dgBuild=function(g){DG_BLD=true;try{a(g);}finally{DG_BLD=false;}try{DG_BLD=true;dgSecrets(g);}catch(e){console.error('Geheimraum',e);}DG_BLD=false;};}
{const a=dgFree;dgFree=function(){DGX.secrets=[];return a();};}
function dgSecLooked(R){if(!DGX.on||CV.on||!DGX.secrets||!DGX.secrets.length)return null;let best=null,bd=R||3.4;const L=lookDir();
  for(const o of DGX.secrets){if(o.gone)continue;const dx=o.x-P.x,dz=o.z-P.z,dy=o.y+1.6-(P.y+P.eye),dd=Math.hypot(dx,dz);if(dd>bd)continue;if((dx*L.x+dy*L.y+dz*L.z)/(Math.hypot(dd,dy)||1)<.55)continue;bd=dd;best={o,kind:'wall'};}return best;}
{const a=attack;attack=function(){if(state==='playing'&&time>=(P.atkReady||0)&&!BLK.on){const t=dgSecLooked(3.4);if(t){tzHit(t);return;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(dgSecLooked(3.8))return'Rissige Wand · Linksklick: zerschlagen';return a();};}
// Beute der Geheimräume und verzauberter Runenstahl aus den Turmtruhen
const RUNE_EX=[];
for(const k of['sharp','hard','holy'])sxEnch('rune_sword',k);sxEnch('rune_pick','hard');sxEnch('rune_axe','hard');
for(const p of['helm','armor','boots'])for(const k of['fire','poison','frost','ward','sturdy'])sxEnch('rune_'+p,k);for(const k of['sturdy','fire','ward'])sxEnch('rune_shield',k);for(const k of['sharp','hard'])sxEnch('rune_bow',k);
for(const id of ENCH_IDS){const it=ITEMS[id];if(!/_rune_|rune_bow|rune_shield/.test(id)||!it||RUNE_EX.includes(id))continue;RUNE_EX.push(id);const B=ITEMS[it.base],E=ENCH[it.ench];if(B&&B.dur)it.dur=Math.round(B.dur*(E&&E.dur?E.dur:1));if(E&&E.def&&B&&B.def)it.def=+(B.def*E.def).toFixed(3);}
function lootGive(L,title){const got=[];for(const[id,n]of L){if(!ITEMS[id])continue;if(!addItem(id,n))spawnDrop(id,n,P.x,P.y+1,P.z);got.push(n+'× '+ITEMS[id].name);}if(title)showArea(title);try{Snd.coin?Snd.coin():Snd.pickup();}catch(e){}renderInv();saveGame();}
{const a=dgLoot;dgLoot=function(c){const was=c&&c.open,tw=DGX.d&&DGX.d.tower,lvl=tw&&DGX.d.lvl;
  if(c&&!c.open&&/^ds\d/.test(c.key||'')){c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z-=.3;c.lid.position.y+=.25;const R=Math.random,L=[['silver',25+((R()*40)|0)],['coin',1+((R()*2)|0)]];
    L.push([['arrow_fire','arrow_poison','arrow_silver'][(R()*3)|0],6+((R()*8)|0)]);L.push([['ruby','sapphire','emerald','opal'][(R()*4)|0],1]);if(R()<.4)L.push(['hpot2',1]);if(R()<.25)L.push([['ex_sharp_iron_sword','ex_fire_iron_armor','ex_sturdy_iron_shield','ex_sharp_longbow'][(R()*4)|0],1]);const st=DGX.d.st;st.ch=st.ch||{};st.ch[c.key]=1;lootGive(L,'Geheimer Schatz!');return;}
  a(c);try{if(!was&&c&&c.open&&tw&&(lvl===1||lvl===2)&&(c.boss?Math.random()<.5:/^rs\d/.test(c.key||'')&&Math.random()<.14)){const id=RUNE_EX[(Math.random()*RUNE_EX.length)|0];if(id)lootGive([[id,1]],'Verzauberter Runenstahl!');}}catch(e){}};}
// Gewölbekarte: Versatz durch die erweiterten Grenzen und die Geheimräume
{const a=lvMapBuildDG;lvMapBuildDG=function(){const d=DGX.d;if(!d||d.ox0==null)return a();const ox=d.ox,oz=d.oz,W=d.W;d.ox=d.ox0;d.oz=d.oz0;d.W=d.W0;let base;try{a();base=LVM.base;}finally{d.ox=ox;d.oz=oz;d.W=W;}
  const gw=W,cv=document.createElement('canvas');cv.width=cv.height=gw;const c=cv.getContext('2d');c.fillStyle='rgb(22,20,18)';c.fillRect(0,0,gw,gw);c.drawImage(base,d.ox0-ox,d.oz0-oz);
  c.fillStyle='rgb(120,108,84)';for(const s of DGX.secrets||[]){const R=s.room;c.fillRect(Math.round(R.x-R.w/2-ox),Math.round(R.z-R.w/2-oz),R.w,R.w);c.fillRect(Math.round(s.x-ox)-1,Math.round(s.z-oz)-1,3,3);}
  const vis=document.createElement('canvas');vis.width=vis.height=gw;const vctx=vis.getContext('2d'),key='D'+d.g.id;Object.assign(LVM,{cell:1,gw,ox,oz,W,base:cv,vis,vctx,seen:lvSeenLoad(key,gw*gw)});
  const bc=c.getImageData(0,0,gw,gw);LVM.bdata=bc.data;const vi=vctx.createImageData(gw,gw);for(let i=0;i<gw*gw;i++)if(LVM.seen[i])for(let q=0;q<4;q++)vi.data[i*4+q]=bc.data[i*4+q];vctx.putImageData(vi,0,0);};}
{const a=lvRevealDG;lvRevealDG=function(){const d=DGX.d;if(!d||d.ox0==null)return a();if(P.y>DG_Y+40)return;const gw=LVM.gw,rev=(x0,z0,x1,z1)=>{let im=null;for(let z=Math.max(0,z0);z<=Math.min(gw-1,z1);z++)for(let x=Math.max(0,x0);x<=Math.min(gw-1,x1);x++){const k=z*gw+x;if(LVM.seen[k])continue;LVM.seen[k]=1;if(!im)im=LVM.vctx.getImageData(0,0,gw,gw);for(let q=0;q<4;q++)im.data[k*4+q]=LVM.bdata[k*4+q];}if(im){LVM.vctx.putImageData(im,0,0);LVM.dirty=true;}};
  const lx=P.x-d.ox0,lz=P.z-d.oz0,i=Math.floor(lx/DG_C),j=Math.floor(lz/DG_C),N=d.G.N,off=[d.ox0-d.ox,d.oz0-d.oz];
  if(i>=0&&j>=0&&i<N&&j<N)rev(off[0]+i*DG_C-1,off[1]+j*DG_C-1,off[0]+(i+1)*DG_C+1,off[1]+(j+1)*DG_C+1);
  for(const s of DGX.secrets||[]){const R=s.room;if(Math.abs(P.x-R.x)<R.w/2+1&&Math.abs(P.z-R.z)<R.w/2+1)rev(Math.round(R.x-R.w/2-d.ox)-1,Math.round(R.z-R.w/2-d.oz)-1,Math.round(R.x+R.w/2-d.ox)+1,Math.round(R.z+R.w/2-d.oz)+1);}};}
// =========================================================
// Patrizierhäuser: Treppe und Obergeschoss
// =========================================================
function sxStairCeil(K,C,at,l2w,ry,iw,id,h1){const{M,sol,H}=K,B=(a,b,c)=>new THREE.BoxGeometry(a,b,c),sw=1.4,x0=-iw/2,zF=id/2-.5,zT=-id/2+2.4,run=zF-zT,n=Math.ceil(h1/.27),holeF=zT+Math.min(run-.5,4.2);
  for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,y=h1*t1,z=zF-run*(t0+t1)/2;at(M.wood,B(sw-.1,y,run/n+.02),x0+sw/2,H+y/2,z);at(C.light,B(sw-.06,.06,run/n+.04),x0+sw/2,H+y+.03,z);}
  {const[px,pz]=l2w(x0+sw/2,(zF+zT)/2);sol.push(solAdd({x:px,z:pz,hw:sw/2,hd:run/2,y0:H,y1:H+h1,rot:-(ry+Math.PI),ramp:1,walk:1,solid:1,tw:1}));}
  const slab=(lx,lz,ww,dd)=>{if(ww<=.05||dd<=.05)return;at(M.wood,B(ww,.18,dd),lx,H+h1-.09,lz);const g=new THREE.BoxGeometry(ww,.04,dd);sxBoxUV(g,2);at(C.floor,g,lx,H+h1+.01,lz);const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:ww/2,hd:dd/2,y0:H+h1-.3,y1:H+h1,rot:-ry,solid:1,walk:1,tw:1}));};
  slab(x0+sw+(iw-sw)/2,0,iw-sw,id);slab(x0+sw/2,(holeF+id/2)/2,sw,id/2-holeF);slab(x0+sw/2,(-id/2+zT)/2,sw,zT+id/2);
  for(let k=-1;k<=2;k++)at(C.beam,B(.25,.25,id),x0+sw+(k+1.5)*(iw-sw)/4,H+h1-.3,0);
  const rail=(lx,lz,ww,dd)=>{at(M.wood,B(ww,.9,dd),lx,H+h1+.45,lz);const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:ww/2,hd:dd/2,y0:H+h1,y1:H+h1+.9,rot:-ry,solid:1,tw:1}));};
  rail(x0+sw+.05,(zT+holeF)/2,.1,holeF-zT);rail(x0+sw/2,holeF,sw,.1);}
function sxUpperRoom(K,C,at,l2w,ry,w,d,h1,hu,fac,R){const{M,sol,H}=K,B=(a,b,c)=>new THREE.BoxGeometry(a,b,c),th=.35,y0=H+h1,fh=3.2,P2=C.inner||(C.inner=new THREE.MeshLambertMaterial({color:0xe4d8bc}));
  const wall=(lx,lz,ww,dd)=>{at(fac,sxFacBox(ww,fh,dd,3.2),lx,y0+fh/2,lz);const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:ww/2,hd:dd/2,y0,y1:y0+fh,rot:-ry,solid:1,tw:1}));};
  wall(0,-d/2+th/2,w,th);wall(0,d/2-th/2,w,th);wall(-w/2+th/2,0,th,d-th*2);wall(w/2-th/2,0,th,d-th*2);const iw=w-th*2,id=d-th*2;
  const E=th+.45;for(const sz of[-1,1]){const g=new THREE.BoxGeometry(w-th*2,.2,.45);sxBoxUV(g,2);at(C.floor||M.wood,g,0,y0-.08,sz*(d/2-th-.225));}
  for(const[lx,lz,ww,dd]of[[0,-d/2+E/2,w,E],[0,d/2-E/2,w,E],[-w/2+th/2,0,th,d],[w/2-th/2,0,th,d]]){const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:ww/2+.05,hd:dd/2+.05,y0:y0-.3,y1:y0,rot:-ry,walk:1,tw:1}));}
  at(P2,B(iw,fh-.2,.04),0,y0+fh/2,-d/2+th+.02);at(P2,B(iw,fh-.2,.04),0,y0+fh/2,d/2-th-.02);at(P2,B(.04,fh-.2,id),-w/2+th+.02,y0+fh/2,0);at(P2,B(.04,fh-.2,id),w/2-th-.02,y0+fh/2,0);
  at(M.wood,B(iw,.18,id),0,y0+fh-.09,0);if(hu>fh+.01)at(fac,sxFacBox(w,hu-fh,d,3.2),0,y0+fh+(hu-fh)/2,0);
  const box=(m,a,b,c,lx,y,lz,solid)=>{at(m,B(a,b,c),lx,y0+y,lz);if(solid){const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:a/2,hd:c/2,y0:y0-.1,y1:y0+y+b/2,rot:-ry,solid:1,tw:1}));}};
  // Schlafzimmer: Bett, Schrank, Schreibtisch, Teppich, Lampe
  const bx=iw/2-1.3,bz=-id/2+1.2;box(M.wood,2.2,.45,1.6,bx,.22,bz,true);box(M.red,2,.14,1.45,bx+.1,.5,bz,false);box(P2,.5,.14,1.3,bx-.75,.52,bz,false);box(M.wood,.12,1,1.6,bx+1.05,.5,bz,false);
  box(M.wood,1.5,2.2,.6,iw/2-.9,1.1,id/2-.45,true);box(M.gold,.06,.25,.06,iw/2-.9+.1,1.2,id/2-.76,false);
  box(M.wood,1.4,.08,.7,1,.78,-id/2+.5,true);for(const sx of[-1,1])box(M.wood,.08,.74,.6,1+sx*.6,.37,-id/2+.5,false);box(M.wood,.45,.45,.45,1,.25,-id/2+1.2,false);box(M.yellow,.3,.2,.4,1.3,.92,-id/2+.45,false);
  box(M.blue,Math.min(3.4,iw*.4),.02,2.2,iw*.1,.02,.6,false);at(C.iron,B(.06,.6,.06),iw*.1,y0+fh-.5,.6);at(C.lamp,B(.36,.4,.36),iw*.1,y0+fh-1.1,.6);}
// =========================================================
// Reparieren: beim Schmied gegen Geld, am Amboss mit Barren, Holz oder Stein
// =========================================================
ITEMS.anvil={name:'Amboss',plural:'Ambosse',furn:true};ITEM_DESC.anvil='Rechtsklick: aufstellen. Am Amboss reparierst du Werkzeug, Waffen, Schilde und Rüstung mit Barren, Holz oder Stein.';
FURN_DIM.anvil=[1.05,.66,.45,.7];RECIPES.push({id:'anvil',need:{iron_ingot:6},bench:1});
const REP_SMITHS=new Set(['Dofra','Waffenschmied Gorm','Rüstungsmacherin Hilda','Schildmacher Bertold','Bogenmacherin Wenna']);
function repMat(id){const it=ITEMS[id];if(!it)return null;if(it.base)return repMat(it.base);
  const m=/^(iron|alu|silver|mythril|adamant|diamond|black|rune)_/.exec(id);if(m)return{iron:'iron_ingot',alu:'alu_ingot',silver:'silver_ingot',mythril:'mythril_ingot',adamant:'adamant_ingot',diamond:'diamond',black:'blackdia',rune:'rune_ingot'}[m[1]];
  if(/^w(pick|axe|sword)$/.test(id)||['rod','bow','longbow','compbow','shield'].includes(id))return'wood';if(/^s(pick|axe|sword)$/.test(id))return'stone';
  if(['helm','chainmail','boots','xbow','molehelm'].includes(id))return'iron_ingot';if(id==='leatherarmor')return'linen';return null;}
const repStep=mat=>mat==='diamond'||mat==='blackdia'?.5:.35;
// alles Beschädigte im Inventar und in der Ausrüstung
function repList(){const L=[];const add=(s,where)=>{if(!s)return;const it=ITEMS[s.id];if(!it||!it.dur||s.d==null||s.d>=it.dur)return;L.push({s,it,where,miss:1-s.d/it.dur});};
  for(const k of EQUIP_KEYS)add(equip[k],'eq');for(let i=0;i<inv.length;i++)add(inv[i],'inv');return L;}
function repCost(r){const base=Math.max(eqPrice(r.s.id)||0,(typeof itemValue==='function'&&itemValue(r.s.id))||0,40);return Math.max(2,Math.round(base*r.miss*.2));}
function repDone(){try{renderInv();}catch(e){}try{renderEquip();}catch(e){}try{Snd.clink(1);}catch(e){}saveGame();}
const repPct=r=>Math.round(100*(1-r.miss))+' %';
function repSmithNode(){const L=repList(),W=wallet();if(!L.length)return{text:'Deine Sachen sind in bestem Zustand. Da gibt es nichts zu hämmern.',trade:true,opts:[{label:'Gut zu wissen.',go:'hello'}]};
  const all=L.reduce((a,r)=>a+repCost(r),0),opts=[];
  if(L.length>1)opts.push({label:`Alles reparieren · ${fmtMoney(all)}`,on:W>=all,act:()=>{if(wallet()<all)return'Das reicht nicht.';setWallet(wallet()-all);for(const r of L)r.s.d=r.it.dur;repDone();return'Erledigt. Alles wieder wie neu.';}});
  for(const r of L.slice(0,7)){const c=repCost(r);opts.push({label:`${r.it.name} (${repPct(r)}) · ${fmtMoney(c)}`,on:W>=c,act:()=>{if(wallet()<c)return'Das reicht nicht.';setWallet(wallet()-c);r.s.d=r.it.dur;repDone();return r.it.name+' ist wieder wie neu.';}});}
  opts.push({label:'Zurück.',go:'hello'});return{text:'Zeig her, was kaputt ist. Ich mache es wieder wie neu.',trade:true,opts};}
function repAnvilNode(){const L=repList();if(!L.length)return{text:'Nichts ist beschädigt.',opts:[{label:'Fertig.',go:null}]};const opts=[];
  for(const r of L.slice(0,8)){const mat=repMat(r.s.id),st=mat?repStep(mat):0,have=mat?invCount(mat):0;
    if(!mat){opts.push({label:`${r.it.name} (${repPct(r)}) · nur beim Schmied`,on:false});continue;}
    opts.push({label:`${r.it.name} (${repPct(r)}) · 1 ${ITEMS[mat].name} (+${Math.round(st*100)} %) · du hast ${have}`,on:have>0,act:()=>{if(invCount(mat)<1)return'Dir fehlt '+ITEMS[mat].name+'.';removeItem(mat,1);r.s.d=Math.min(r.it.dur,Math.round(r.s.d+r.it.dur*st));
      for(let k=0;k<10;k++)spawnParticle(P.x-Math.sin(P.yaw)*1.4,P.y+1,P.z-Math.cos(P.yaw)*1.4,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,Math.random()<.5?0xffc060:0xff7a20,.25,.1);repDone();return r.it.name+': '+Math.round(100*r.s.d/r.it.dur)+' %';}});}
  opts.push({label:'Fertig.',go:null});return{text:'Ein Schlag nach dem anderen. Jedes Stück Material macht dein Werkzeug ein Stück heiler.',opts};}
DIALOGS.Amboss={start:()=>'rep',nodes:{rep:repAnvilNode}};
let REP_V=null;function openAnvil(){if(!REP_V){const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d');x.imageSmoothingEnabled=false;const s=SPR.anvil;if(s&&s.c)x.drawImage(s.c,0,4,22,22*s.c.height/s.c.width);REP_V={name:'Amboss',role:'Reparieren',portrait:c,talk:0};}openDialog(REP_V);}
{const a=openDialog;openDialog=function(v){try{const D=v&&REP_SMITHS.has(v.name)&&DIALOGS[v.name];if(D&&D.nodes.hello&&!D.nodes.hello._rep){const h0=D.nodes.hello;D.nodes.hello=function(){const n=h0.apply(this,arguments);if(n&&n.opts&&!n.opts.some(o=>o.go==='rep')){const i=n.opts.findIndex(o=>o.go===null);n.opts.splice(i<0?n.opts.length:i,0,{label:'Kannst du meine Sachen reparieren?',go:'rep'});}return n;};D.nodes.hello._rep=1;D.nodes.rep=repSmithNode;}}catch(e){console.error('Reparieren',e);}return a(v);};}
{const a=useFurn;useFurn=function(f){if(f&&f.type==='anvil'){openAnvil();return true;}return a(f);};}
function villageAnvilLooked(){for(const p of villageProps)if(p.spr==='anvil'&&Math.hypot(p.x-P.x,p.z-P.z)<3.2&&lookingAt(p.x,p.y+.4,p.z,3.4,.8))return p;return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&villageAnvilLooked()){openAnvil();return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(villageAnvilLooked())return'Amboss · Rechtsklick: reparieren';const f=furnLooked&&furnLooked();if(f&&f.type==='anvil')return'Amboss · Rechtsklick: reparieren';return a();};}
// =========================================================
// Bosse kämpfen gegen alle Spieler, nicht nur gegen den Host
// Viele Boss-Angriffe prüfen nur „den Spieler“. Zielt ein Monster des Hosts auf einen Mitspieler,
// läuft sein Zug so, als stünde der Spieler dort. Schaden, Rückstoß und Gift gehen dann an den Mitspieler.
// =========================================================
const MPV={on:null,dmg:0,real:null,hostD:0};const PV_F=['x','y','z','vx','vy','vz','poisonT','slowT'];
function mpPeerOf(pid){const q=[...MP.peerPid].find(([,p])=>p===pid);return q?q[0]:null;}
function mpBhit(pid,o){const peer=mpPeerOf(pid);if(peer==null)return;mpSend({t:'bhit',n:+(o.n||0).toFixed(1),kx:+(o.kx||0).toFixed(2),kz:+(o.kz||0).toFixed(2),vy:+(o.vy||0).toFixed(2),psn:+(o.psn||0).toFixed(1),slow:+(o.slow||0).toFixed(1)},peer);}
function mpFocus(e){const t=e.tgt;if(t&&t.proxy){const R=REMOTE.get(t.proxy);return R&&time-R.seen<5?R:null;}if(t==='player')return null;
  let best=null,bd=Math.hypot(P.x-e.x,P.z-e.z)+(state==='dead'?1e6:0);for(const R of REMOTE.values()){if(time-R.seen>5||R.ty<-900)continue;const d=Math.hypot(R.x-e.x,R.z-e.z)+(Math.abs(R.y-e.y)>14?500:0);if(d<bd){bd=d;best=R;}}return best;}
function mpSwapRun(R,fn){const real={};for(const k of PV_F)real[k]=P[k];P.x=R.x;P.y=R.y;P.z=R.z;P.vx=P.vy=P.vz=0;P.poisonT=0;P.slowT=0;MPV.on=R;MPV.dmg=0;MPV.real=real;MPV.hostD=0;
  try{return fn();}finally{const o={n:MPV.dmg,kx:P.vx,kz:P.vz,vy:P.vy>0?P.vy:0,psn:P.poisonT||0,slow:P.slowT||0};for(const k of PV_F)P[k]=real[k];MPV.on=null;
    if(o.n>0||Math.abs(o.kx)+Math.abs(o.kz)>.01||o.vy>0||o.psn>0||o.slow>0)try{mpBhit(R.pid,o);}catch(e){}if(MPV.hostD>0){const n=MPV.hostD;MPV.hostD=0;takeDamage(n);}}}
{const a=takeDamage;takeDamage=function(n){if(MPV.on){MPV.dmg+=+n||0;return;}return a.apply(this,arguments);};}
{const a=aiStep;aiStep=function(e,dt){const R=(MP.on&&MP.role==='host'&&e&&e.msync&&!e.mirror&&REMOTE.size)?mpFocus(e):null;if(!R)return a(e,dt);return mpSwapRun(R,()=>a(e,dt));};}
{const a=pickTarget;pickTarget=function(e){const r=a(e);if(!MPV.on||r!=='player')return r;const re=MPV.real,px=MP_PROXY.get(MPV.on.pid);
  if(state!=='dead'&&Math.hypot(re.x-e.x,re.z-e.z)<Math.hypot(P.x-e.x,P.z-e.z)-.5)return'player';return px||r;};}
// Flächenangriffe (Minotaurus) treffen alle Spieler im Bereich
{const a=minoHitArea;minoHitArea=function(e,x,z,r,dmg,kb){const h=a(e,x,z,r,dmg,kb);try{if(MP.on&&MP.role==='host'&&e&&e.msync){for(const R of REMOTE.values()){if(time-R.seen>5||MPV.on===R)continue;
      if(Math.abs(R.y-e.y)<3&&Math.hypot(R.x-x,R.z-z)<r+.3){const dx=R.x-e.x,dz=R.z-e.z,l=Math.hypot(dx,dz)||1,k=kb||5;mpBhit(R.pid,{n:dmg,kx:dx/l*k,kz:dz/l*k});}}
    if(MPV.on){const re=MPV.real;if(Math.abs(re.y-e.y)<3&&Math.hypot(re.x-x,re.z-z)<r+.3)MPV.hostD+=dmg;}}}catch(_){}return h;};}
// Spiegel-Monster sterben nur beim Host
{const a=killEnt;killEnt=function(e,by){if(e&&e.mirror&&isClient())return;return a(e,by);};}
// Pilzlande: Effekte von Big Lunar (Schockwellen, Stacheln, Sporen, Mondstrahlen) sehen und spüren alle
function mpPzFxSend(){if(typeof PZ==='undefined'||!PZ.fx)return;for(const f of PZ.fx){if(f._s)continue;f._s=1;const q={k:f.k};if(f.x!=null){q.x=+f.x.toFixed(2);q.z=+f.z.toFixed(2);}
    if(f.k==='mark'&&f.m){q.x=+f.m.position.x.toFixed(2);q.z=+f.m.position.z.toFixed(2);}if(f.pts)q.pts=f.pts.map(p=>[+p[0].toFixed(2),+p[1].toFixed(2)]);mpSend({t:'pzfx',f:q});}}
function mpPzFxRecv(q){if(typeof PZ==='undefined'||!PZ.hall||lvKey()!=='T3')return;const H=PZ.hall;let f=null;
  if(q.k==='wave')f={k:'wave',x:q.x,z:q.z,t:0,m:pzFxRing(q.x,q.z,H.y,.5,0x9af0ff)};else if(q.k==='spike'&&q.pts)f={k:'spike',t:0,pts:q.pts,ms:q.pts.map(([x,z])=>pzFxRing(x,z,H.y,.8,0x7af0ff,.6))};
  else if(q.k==='cloud')f={k:'cloud',x:q.x,z:q.z,t:0};else if(q.k==='beam')f={k:'beam',x:q.x,z:q.z,t:0,m:pzFxRing(q.x,q.z,H.y,2.4,0xd8f8ff,.6)};
  else if(q.k==='mark')f={k:'mark',t:0,m:pzFxRing(q.x,q.z,H.y,5,0xff8a8a,.7),auto:1.4};if(f){f._s=1;PZ.fx.push(f);}}
{const a=pzFxTick;pzFxTick=function(dt){try{if(typeof PZ!=='undefined'&&PZ.fx)for(const f of PZ.fx)if(f.auto&&f.t>f.auto)f.done=1;}catch(_){}return a(dt);};}
// Die Zeremonie beginnt, sobald irgendein Spieler den Tempel betritt
{const a=pzCultTick;pzCultTick=function(dt){try{const H=PZ.hall;if(H&&MP.on&&MP.role==='host'&&PZ.cult===0){for(const R of REMOTE.values())if(time-R.seen<5&&R.y<DG_Y-30&&Math.hypot(R.x-H.x,R.z-H.z)<PZD.HR-1){PZ.cult=1;PZ.cultT=0;break;}}
    if(H&&isClient()&&PZ.boss&&PZ.boss.mirror&&!PZ.boss.hidden&&PZ.cult<2){PZ.cult=2;H.orb.visible=false;H.light.intensity=1.6;}}catch(_){}return a(dt);};}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='bhit'){try{if(state!=='dead'&&state!=='menu'&&state!=='loading'){if(m.n>0)takeDamage(m.n);P.vx+=m.kx||0;P.vz+=m.kz||0;if(m.vy>0)P.vy=Math.max(P.vy,m.vy);
      if(m.psn>0)P.poisonT=Math.max(P.poisonT||0,m.psn);if(m.slow>0)P.slowT=Math.max(P.slowT||0,m.slow);}}catch(e){}return;}
  if(m&&m.t==='pzfx'){try{if(isClient())mpPzFxRecv(m.f);}catch(e){}return;}return a(m,peer);};}
// Big Lunar: Der Angriffsname lag im selben Feld wie die Abklingzeit der normalen Monster und wurde jedes Bild zu „keine Zahl“.
// Dadurch kamen Faustschlag, Stampfer und Sporen nie an. Jetzt wird der Name sicher aufbewahrt.
{const a=pzBossAI;pzBossAI=function(e,dt){if(e.st==='wind'&&e._pzAtk)e.atk=e._pzAtk;const r=a(e,dt);if(typeof e.atk==='string'&&e.st==='wind')e._pzAtk=e.atk;else e._pzAtk=null;return r;};}
