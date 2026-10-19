/* =========================================================
   0.0.129 · Gemeinsame Monster, Geheimräume, verzauberter Runenstahl, Obergeschosse
   - Mehrspieler: In den Wildnis-Gewölben und auf den Turm-Ebenen 1 und 2 rechnet der Host die Monster.
     Sind Host und Mitspieler am selben Ort, kämpfen alle gegen dieselben Monster (auch gegen denselben Boss).
     Geschosse der Monster sehen alle.
   - Wildnis-Gewölbe: hinter einer rissigen Außenwand liegt oft ein geheimer Raum mit Truhe.
   - Runenstahl gibt es jetzt auch verzaubert (nur aus Truhen im Turm).
   - Patrizierhäuser: eine Treppe führt ins Obergeschoss mit Schlafzimmer.
   ========================================================= */
// =========================================================
// Mehrspieler: gemeinsame Monster in Gewölben und Turm-Ebenen
// =========================================================
let DG_BLD=false;const lvKey=()=>(DGX.on||DG_BLD)&&DGX.d?(DGX.d.tower?'T'+DGX.d.lvl:(DGX.d.g?'D'+DGX.d.g.id:null)):null;
const mpSyncKey=k=>!!k&&(k[0]==='D'||k==='T1'||k==='T2');
{const a=spawnEnt;spawnEnt=function(t,x,z,o){const e=a(t,x,z,o);try{const k=lvKey();if(e&&mpSyncKey(k)&&!(o&&o.mirror)&&!e.proxy&&e.fac==='demon'){e.lvk=k;if(MP.on&&MP.role==='host')e.msync=1;}}catch(_){}return e;};}
function mpHostHere(){if(!(MP.on&&MP.role==='client'&&MP.ready))return false;const R=REMOTE.get(MP.host),d=DGX.d;if(!R||!d||time-R.seen>5)return false;
  const ox=d.ox,oz=d.oz,W=d.W;return R.tx>ox-2&&R.tx<ox+W+2&&R.tz>oz-2&&R.tz<oz+W+2&&Math.abs(R.ty-P.y)<70;}
function mpLvTick(){if(!DGX.on)return;const k=lvKey();if(!mpSyncKey(k))return;
  if(MP.on&&MP.role==='host'){for(const e of DEM){if(e.lvk!==k||e.mirror)continue;if(!e.msync)e.msync=1;if(e.dormant&&e.wakeR&&state==='playing')for(const R of REMOTE.values())if(time-R.seen<5&&Math.hypot(R.tx-e.x,R.tz-e.z)<e.wakeR&&Math.abs(R.ty-e.y)<6){e.dormant=false;if(e.onWake)e.onWake(e);break;}}return;}
  if(!mpHostHere())return;for(const e of DEM.slice()){if(e.mirror||e.proxy||e.lvk!==k||e.fac!=='demon')continue;e.mpGone=1;removeEnt(e);}
  const mir=[...MP_MIR.dem.values()],T=DGX.tw;if(T&&T.boss&&T.boss.mpGone){const m=mir.find(e=>e.twBoss&&e.lvk===k);if(m)T.boss=m;}
  for(let i=0;i<DGX.ents.length;i++){const e=DGX.ents[i];if(e&&e.mpGone&&e.dgBoss){const m=mir.find(q=>q.dgBoss&&q.lvk===k);if(m)DGX.ents[i]=m;}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{mpLvTick();}catch(e){if(!mpLvTick.err){mpLvTick.err=1;console.error('MP Ebene',e);}}};}
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
