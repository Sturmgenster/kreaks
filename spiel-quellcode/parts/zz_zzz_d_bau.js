/* =========================================================
   0.0.112 · Hausbau
   - Bauteile aus Holz oder Stein: Wand, Fenster, Tür, Boden, Treppe, Dach (Raster 2 m)
   - Halten + Rechtsklick: setzen (Vorschau zeigt, wo es hinkommt). Mit der Waffe/dem Werkzeug abbauen.
   - Wände stapeln sich, Böden auf Wandhöhe ergeben ein Obergeschoss, Treppen führen hinauf.
   - Türen öffnen und schließen mit Rechtsklick.
   - Gemeinsames „Feste Körper“-System (auch für Dungeons und Dörfer): Kollision und Begehbarkeit
   ========================================================= */
// =========================================================
// Feste Körper
// =========================================================
const SOL={grid:new Map(),C:8};const DGX={on:false};
const solKey=(i,j)=>i*100003+j;
function solCells(b){const r=Math.hypot(b.hw,b.hd),i0=Math.floor((b.x-r)/SOL.C),i1=Math.floor((b.x+r)/SOL.C),j0=Math.floor((b.z-r)/SOL.C),j1=Math.floor((b.z+r)/SOL.C),o=[];for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++)o.push(solKey(i,j));return o;}
function solAdd(b){b.c=Math.cos(b.rot||0);b.s=Math.sin(b.rot||0);b.cells=solCells(b);for(const k of b.cells){let l=SOL.grid.get(k);if(!l)SOL.grid.set(k,l=[]);l.push(b);}return b;}
function solDel(b){for(const k of b.cells||[]){const l=SOL.grid.get(k);if(!l)continue;const i=l.indexOf(b);if(i>=0)l.splice(i,1);if(!l.length)SOL.grid.delete(k);}b.cells=null;}
function solNear(x,z){const l=SOL.grid.get(solKey(Math.floor(x/SOL.C),Math.floor(z/SOL.C)));return l||[];}
// lokale Koordinaten (Drehung um y wie bei THREE: rotation.y = -rot)
const solLoc=(b,x,z)=>{const dx=x-b.x,dz=z-b.z;return[dx*b.c+dz*b.s,-dx*b.s+dz*b.c];};
const solTop=(b,lz)=>b.ramp?b.y0+clamp((lz+b.hd)/(2*b.hd),0,1)*(b.y1-b.y0):b.y1;
function solPush(o,R,y,h){let any=false;for(const b of solNear(o.x,o.z)){if(b.off||!b.solid)continue;if(y+h<=b.y0+.05||y>=b.y1-.4)continue;if(b.ramp||b.walk&&y>=b.y1-.6)continue;
    const[lx,lz]=solLoc(b,o.x,o.z),ex=b.hw+R,ez=b.hd+R;if(Math.abs(lx)>=ex||Math.abs(lz)>=ez)continue;const px=ex-Math.abs(lx),pz=ez-Math.abs(lz);let nx=lx,nz=lz;if(px<pz)nx=Math.sign(lx||1)*ex;else nz=Math.sign(lz||1)*ez;
    o.x=b.x+nx*b.c-nz*b.s;o.z=b.z+nx*b.s+nz*b.c;any=true;}return any;}
{const a=groundAt;groundAt=function(x,z,feet){let g=a(x,z,feet);const L=solNear(x,z);if(!L.length)return g;const lim=feet==null?1e9:feet+.65;
  for(const b of L){if(b.off||!b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)>b.hw||Math.abs(lz)>b.hd)continue;const t=solTop(b,lz);if(t<=lim&&t>g)g=t;}return g;};}
{const a=updatePlayer;updatePlayer=function(dt){a(dt);if(P.x>60000&&!DGX.on)return;const o={x:P.x,z:P.z};if(solPush(o,(P.rad||.3),P.y,1.7)){P.x=o.x;P.z=o.z;}};}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){const r=a(e,tx,tz,sp,dt);solPush(e,(e.d.rad||.35)*.8,e.y,Math.min(2.5,e.h||1.8));return r;};}
// Strahl gegen Körper (für Abbauen, Türen)
function solRay(maxD,filter){const c=camera.position,L=lookDir();let best=null,bt=maxD;
  for(const k of new Set([...solNear(c.x,c.z),...solNear(c.x+L.x*maxD*.5,c.z+L.z*maxD*.5),...solNear(c.x+L.x*maxD,c.z+L.z*maxD)])){if(filter&&!filter(k))continue;const b=k;
    const[ox,oz]=solLoc(b,c.x,c.z),dx=L.x*b.c+L.z*b.s,dz=-L.x*b.s+L.z*b.c,oy=c.y,dy=L.y;let t0=0,t1=bt;
    const slab=(o,d,mn,mx)=>{if(Math.abs(d)<1e-6)return o>=mn&&o<=mx;let a=(mn-o)/d,bb=(mx-o)/d;if(a>bb)[a,bb]=[bb,a];t0=Math.max(t0,a);t1=Math.min(t1,bb);return t0<=t1;};
    if(slab(ox,dx,-b.hw,b.hw)&&slab(oz,dz,-b.hd,b.hd)&&slab(oy,dy,b.y0,b.ramp?b.y1:b.y1)&&t0<bt){bt=t0;best=b;}}
  return best?{b:best,t:bt}:null;}
// =========================================================
// Bauteile
// =========================================================
const BT={bwall:{n:'Holzwand',k:'wall',mat:'wood',hp:4},swall:{n:'Steinwand',k:'wall',mat:'stone',hp:7},bwin:{n:'Holzfenster',k:'wall',mat:'win',hp:3},bdoor:{n:'Holztür',k:'door',mat:'wood',hp:4},
  bfloor:{n:'Holzboden',k:'floor',mat:'wood',hp:3},sfloor:{n:'Steinboden',k:'floor',mat:'stone',hp:6},bstair:{n:'Holztreppe',k:'stair',mat:'wood',hp:4},broof:{n:'Dachziegel',k:'roof',mat:'roof',hp:3}};
Object.assign(ITEMS,{bwall:{name:'Holzwand',plural:'Holzwände'},swall:{name:'Steinwand',plural:'Steinwände'},bwin:{name:'Holzfenster',plural:'Holzfenster'},bdoor:{name:'Holztür',plural:'Holztüren'},
  bfloor:{name:'Holzboden',plural:'Holzböden'},sfloor:{name:'Steinboden',plural:'Steinböden'},bstair:{name:'Holztreppe',plural:'Holztreppen'},broof:{name:'Dachziegel',plural:'Dachziegel'}});
for(const k in BT){ITEMS[k].build=1;ITEM_DESC[k]='Bauteil. In die Hand nehmen und mit Rechtsklick setzen. Abbauen: draufschlagen';}
RECIPES.push({id:'bwall',need:{wood:3},bench:1},{id:'swall',need:{stone:4},bench:1},{id:'bwin',need:{wood:3},bench:1},{id:'bdoor',need:{wood:4},bench:1},{id:'bfloor',need:{wood:2},bench:1},
  {id:'sfloor',need:{stone:3},bench:1},{id:'bstair',need:{wood:4},bench:1},{id:'broof',need:{wood:2,stone:1},bench:1});
const BH=2.6,BG=2;
function bTex(kind){const p=new Px(32,32);
  if(kind==='wood'){for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),seam=y%8===0||((x+row*11)%32===0);let L=.5+(hash2(row,Math.floor((x+row*11)/32),3)-.5)*.3+(vnoise(x*.4,y*1.5,7)-.5)*.3;if(seam)L=.08;p.set(x,y,FW[shadeIdx(L,5,x,y)]);}}
  else if(kind==='stone'){const S=pal(['#3e3e44','#56565c','#6e6e74','#86868c','#9e9ea4']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),off=row%2?8:0,seam=y%8===0||(x+off)%16===0;p.set(x,y,S[seam?0:shadeIdx(.6+(hash2((x+off)>>4,row,11)-.5)*.3+(hash2(x,y,12)-.5)*.2,5,x,y)]);}}
  else if(kind==='roof'){const R=pal(['#4a1a12','#6a2a1a','#8a3a22','#a84a2a']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/6),off=row%2?4:0,seam=y%6===0||(x+off)%8===0;p.set(x,y,R[seam?0:shadeIdx(.6+(y%6)/14+(hash2(x>>3,row,13)-.5)*.3,4,x,y)]);}}
  else if(kind==='win'){for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),seam=y%8===0||((x+row*11)%32===0);let L=.5+(hash2(row,Math.floor((x+row*11)/32),3)-.5)*.3;if(seam)L=.08;
      const hole=x>8&&x<23&&y>9&&y<22;if(hole){if(x===15||x===16||y===15||y===16)p.set(x,y,FW[1]);continue;}p.set(x,y,FW[shadeIdx(L,5,x,y)]);}}
  else if(kind==='door'){for(let y=0;y<32;y++)for(let x=0;x<32;x++){const plank=x%8===0;let L=.45+(hash2(x>>3,y>>4,15)-.5)*.3;if(plank)L=.1;if(y===6||y===25)L=.15;p.set(x,y,FW[shadeIdx(L,5,x,y)]);}p.set(25,16,hex('#c8a040'));p.set(25,17,hex('#8a6a20'));}
  const t=new THREE.CanvasTexture(p.done());t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
let BM=null;function bMats(){if(BM)return BM;const M=k=>new THREE.MeshLambertMaterial({map:bTex(k),transparent:false,alphaTest:.5,side:k==='win'?THREE.DoubleSide:THREE.FrontSide});
  BM={wood:M('wood'),stone:M('stone'),roof:M('roof'),win:M('win'),door:M('door'),ghost:new THREE.MeshBasicMaterial({color:0x8af0ff,transparent:true,opacity:.35,depthWrite:false})};return BM;}
// Maße je Art: [Breite x, Höhe, Tiefe z]
function bDims(t){const K=BT[t].k;return K==='wall'||K==='door'?[BG,BH,.22]:K==='floor'?[BG,.16,BG]:K==='roof'?[BG+.3,.22,BG+.3]:[BG,BH,BG];}
const BLD={list:[],ghost:null};
function bMesh(p){const t=p[0],K=BT[t].k,M=bMats(),[w,h,d]=bDims(t),g=new THREE.Group();g.position.set(p[1],p[2],p[3]);g.rotation.y=-p[4];
  if(K==='stair'){for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(BG,BH/6*(i+1),BG/6),M.wood);m.position.set(0,BH/12*(i+1),-BG/2+BG/12+i*BG/6);g.add(m);}}
  else if(K==='door'){const fr=M.wood;for(const sx of[-1,1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.2,h,d),fr);m.position.set(sx*(w/2-.1),h/2,0);g.add(m);}const top=new THREE.Mesh(new THREE.BoxGeometry(w,.3,d),fr);top.position.set(0,h-.15,0);g.add(top);
    const pv=new THREE.Group();pv.position.set(-w/2+.2,0,0);const leaf=new THREE.Mesh(new THREE.BoxGeometry(w-.4,h-.3,.1),M.door);leaf.position.set((w-.4)/2,(h-.3)/2,0);pv.add(leaf);g.add(pv);g.userData.pv=pv;if(p[5])pv.rotation.y=-Math.PI/2;}
  else{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M[BT[t].mat]);m.position.y=h/2;g.add(m);}
  scene.add(g);return g;}
function bSolids(p){const t=p[0],K=BT[t].k,[w,h,d]=bDims(t),o=[];const base={x:p[1],z:p[3],rot:p[4],y0:p[2],y1:p[2]+h,hw:w/2,hd:d/2,piece:p};
  if(K==='wall')o.push(solAdd(Object.assign({},base,{solid:1})));
  else if(K==='door'){o.push(solAdd(Object.assign({},base,{solid:1,hw:.12,x:p[1]+Math.cos(p[4])*(w/2-.1),z:p[3]+Math.sin(p[4])*(w/2-.1)})));o.push(solAdd(Object.assign({},base,{solid:1,hw:.12,x:p[1]-Math.cos(p[4])*(w/2-.1),z:p[3]-Math.sin(p[4])*(w/2-.1)})));
    o.push(solAdd(Object.assign({},base,{solid:1,hw:w/2-.2,leaf:1,off:!!p[5]})));}
  else if(K==='floor'||K==='roof')o.push(solAdd(Object.assign({},base,{walk:1,solid:1,hw:w/2,hd:d/2})));
  else if(K==='stair')o.push(solAdd(Object.assign({},base,{walk:1,ramp:1,solid:1})));
  for(const b of o)b.bld=1;return o;}
const bKey=p=>p[0]+'|'+p[1].toFixed(2)+'|'+p[2].toFixed(2)+'|'+p[3].toFixed(2)+'|'+(((p[4]%6.2832)+6.2832)%6.2832).toFixed(2);
function bAdd(p,save){const key=bKey(p);if(BLD.list.some(q=>q.key===key))return null;const q={p,key,g:bMesh(p),s:bSolids(p),hp:BT[p[0]].hp};for(const b of q.s)b.q=q;BLD.list.push(q);if(save!==false){FLAGS.bld=FLAGS.bld||{};FLAGS.bld[key]=p;}return q;}
function bDel(q){scene.remove(q.g);q.g.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const b of q.s)solDel(b);BLD.list.splice(BLD.list.indexOf(q),1);if(FLAGS.bld)delete FLAGS.bld[q.key];}
function bSync(){for(const q of BLD.list.slice()){scene.remove(q.g);q.g.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const b of q.s)solDel(b);}BLD.list.length=0;for(const k in FLAGS.bld||{})bAdd(FLAGS.bld[k],false);}
// Wo käme das Teil hin?
function bPlan(t){const K=BT[t].k,L=lookDir(),fl=Math.hypot(L.x,L.z)||1,fx=L.x/fl,fz=L.z/fl,tx=P.x+fx*2.3,tz=P.z+fz*2.3,ci=Math.floor(tx/BG),cj=Math.floor(tz/BG),cx=(ci+.5)*BG,cz=(cj+.5)*BG,feet=P.y+1;
  const top=(x,z)=>groundAt(x,z,feet);
  if(K==='wall'||K==='door'){const ux=tx/BG-ci,uz=tz/BG-cj,dW=ux,dE=1-ux,dN=uz,dS=1-uz,m=Math.min(dW,dE,dN,dS);let x,z,rot;
    if(m===dW){x=ci*BG;z=cz;rot=Math.PI/2;}else if(m===dE){x=(ci+1)*BG;z=cz;rot=Math.PI/2;}else if(m===dN){x=cx;z=cj*BG;rot=0;}else{x=cx;z=(cj+1)*BG;rot=0;}
    let y=Math.max(top(x+(rot?.3:0),z+(rot?0:.3)),top(x-(rot?.3:0),z-(rot?0:.3)));for(const q of BLD.list){const p=q.p,k2=BT[p[0]].k;if((k2==='wall'||k2==='door')&&Math.abs(p[1]-x)<.05&&Math.abs(p[3]-z)<.05&&p[2]+BH>y-.3&&p[2]<=y+.3)y=Math.max(y,p[2]+BH);}
    return[t,x,y,z,rot];}
  let wallTop=-1e9;for(const q of BLD.list){const p=q.p,k2=BT[p[0]].k;if(k2!=='wall'&&k2!=='door')continue;const onEdge=(Math.abs(p[1]-ci*BG)<.05||Math.abs(p[1]-(ci+1)*BG)<.05)&&Math.abs(p[3]-cz)<.05||(Math.abs(p[3]-cj*BG)<.05||Math.abs(p[3]-(cj+1)*BG)<.05)&&Math.abs(p[1]-cx)<.05;if(onEdge)wallTop=Math.max(wallTop,p[2]+BH);}
  if(K==='roof'){const y=wallTop>-1e8?wallTop:top(cx,cz)+BH;return[t,cx,y,cz,0];}
  if(K==='floor'){const up=P.pitch>.2&&wallTop>P.y+1.2;const y=up?wallTop-.16:top(cx,cz)+.01;return[t,cx,y,cz,0];}
  const rot=Math.round(Math.atan2(-fx,fz)/(Math.PI/2))*(Math.PI/2);return[t,cx,top(cx,cz),cz,rot];}
function bCanPlace(p){if(P.x>60000)return'Hier drinnen kannst du nicht bauen.';if(inCore(p[1],p[3])&&Math.hypot(p[1]-CODA.x,p[3]-CODA.z)<80)return'Mitten in Coda darfst du nicht bauen.';
  if(BLD.list.length>=600)return'Du hast schon zu viele Bauteile gesetzt.';if(BLD.list.some(q=>q.key===bKey(p)))return'Hier steht schon etwas.';
  const[w,h,d]=bDims(p[0]),K=BT[p[0]].k;if(K==='wall'||K==='door'||K==='stair'){const o={x:P.x,z:P.z},b={x:p[1],z:p[3],hw:w/2+.3,hd:d/2+.3,c:Math.cos(p[4]),s:Math.sin(p[4])};const[lx,lz]=solLoc(b,P.x,P.z);if(Math.abs(lx)<b.hw&&Math.abs(lz)<b.hd&&P.y<p[2]+h&&P.y+1.7>p[2])return'Du stehst im Weg.';}
  return null;}
// Vorschau
function bGhostTick(){const h=inv[HOT0+sel],t=h&&BT[h.id]?h.id:null;const show=t&&state==='playing'&&!SW.on;
  if(!show){if(BLD.ghost)BLD.ghost.visible=false;return;}if(!BLD.ghost||BLD.ghost.t!==t){if(BLD.ghost)scene.remove(BLD.ghost);const[w,hh,d]=bDims(t),g=new THREE.Group(),m=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),bMats().ghost);m.position.y=hh/2;g.add(m);g.t=t;scene.add(g);BLD.ghost=g;}
  const p=bPlan(t),g=BLD.ghost;g.visible=true;g.position.set(p[1],p[2],p[3]);g.rotation.y=-p[4];g.children[0].material.color.setHex(bCanPlace(p)?0xff6a5a:0x8af0ff);}
{const a=rightClickUse;rightClickUse=function(){if(state!=='playing')return a();const D=bDoorLooked();if(D){bDoorToggle(D);return true;}
  const h=inv[HOT0+sel];if(h&&BT[h.id]&&!SW.on){const p=bPlan(h.id),err=bCanPlace(p);if(err){toast(err);return true;}bAdd(p);removeItem(h.id,1);renderInv();try{Snd.chop();}catch(e){}saveGame();if(!FLAGS.bldTip){FLAGS.bldTip=1;toast('Gebaut! Abbauen kannst du Bauteile, indem du draufschlägst.');}return true;}
  return a();};}
function bDoorLooked(){const r=solRay(3.4,b=>b.bld&&b.q&&BT[b.q.p[0]].k==='door');return r?r.b.q:null;}
function bDoorToggle(q){q.p[5]=q.p[5]?0:1;const pv=q.g.userData.pv;if(pv)pv.rotation.y=q.p[5]?-Math.PI/2:0;for(const b of q.s)if(b.leaf)b.off=!!q.p[5];FLAGS.bld[q.key]=q.p;try{Snd.gate?Snd.gate():Snd.click();}catch(e){Snd.click();}}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000||DGX.on){const D=bDoorLooked();if(D)return D.p[5]?'Tür schließen':'Tür öffnen';}return a();};}
// Abbauen
{const a=attack;attack=function(){if(state!=='playing'||time<(P.atkReady||0)||weaponOf()==='bow')return a();const r=solRay(3.2,b=>b.bld&&b.q);if(!r)return a();{const W0=WEAPONS[weaponOf()]||WEAPONS.fist;try{if(frontTargets(W0.range,.5).length)return a();}catch(e){}}const q=r.b.q,w=weaponOf(),W=WEAPONS[w]||WEAPONS.fist;
  if(P.stats.st<W.cost){toast('Zu wenig Ausdauer');return;}P.stats.st-=W.cost;P.atkReady=time+W.cd;P.atkT=time;P.atkDur=Math.min(.38,W.cd*.75);P.lastAction=time;Snd.swing(w);
  const H=heldItem(),it=H&&H.it,stone=BT[q.p[0]].mat==='stone',good=stone?it&&it.tool==='pick':it&&(it.tool==='axe'||it.weapon==='axe');q.hp-=good?2:1;if(good)wearTool();
  stone?Snd.clink(1):Snd.chop();const c=camera.position,L=lookDir();for(let k=0;k<6;k++)spawnParticle(c.x+L.x*r.t,c.y+L.y*r.t,c.z+L.z*r.t,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,stone?0x8a8a90:0x9a6a36,.5,.22);
  if(q.hp<=0){spawnDrop(q.p[0],1,q.p[1],q.p[2]+.5,q.p[3]);bDel(q);Snd.crack();saveGame();}renderStats();};}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{bGhostTick();}catch(e){if(!bGhostTick.err){bGhostTick.err=1;console.error('Bauen',e);}}};}
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);try{bSync();}catch(e){console.error('Bauen laden',e);}return r;};}
try{MP_WORLD_MAPS.push('bld');MP_KEYS.push('bld');const a=mpRefresh;mpRefresh=function(D){a(D);if(D.has('bld'))try{bSync();}catch(e){}};}catch(e){}
// Symbole
{const a=craftSprites;craftSprites=function(list){a(list);try{const ic=(cols,draw)=>{const p=new Px(14,14),C=pal(cols);draw(p,C);outline(p);return p.done();};
  const wall=(p,C)=>{for(let y=1;y<13;y++)for(let x=1;x<13;x++)p.set(x,y,C[(y%4===0)?0:1+((x+(y>>2)*3)%5===0?0:1)]);};
  list.push(['bwall',ic(['#3a2212','#7a5228','#9a6a36'],wall)],['swall',ic(['#3e3e44','#6e6e74','#9e9ea4'],(p,C)=>{for(let y=1;y<13;y++)for(let x=1;x<13;x++)p.set(x,y,C[(y%4===0||(x+((y>>2)%2)*3)%6===0)?0:(x+y)%3?1:2]);})],
    ['bwin',ic(['#3a2212','#7a5228','#9adcff'],(p,C)=>{wall(p,C);for(let y=4;y<10;y++)for(let x=4;x<10;x++)p.set(x,y,C[2]);for(let k=4;k<10;k++){p.set(6.5,k,C[0]);p.set(k,6.5,C[0]);}})],
    ['bdoor',ic(['#3a2212','#6a4626','#c8a040'],(p,C)=>{for(let y=1;y<13;y++)for(let x=3;x<11;x++)p.set(x,y,C[x%3===0?0:1]);p.set(9,7,C[2]);})],
    ['bfloor',ic(['#3a2212','#7a5228','#9a6a36'],(p,C)=>{for(let y=4;y<10;y++)for(let x=1;x<13;x++)p.set(x,y,C[x%4===0?0:y<6?2:1]);})],
    ['sfloor',ic(['#3e3e44','#6e6e74','#9e9ea4'],(p,C)=>{for(let y=4;y<10;y++)for(let x=1;x<13;x++)p.set(x,y,C[x%5===0?0:y<6?2:1]);})],
    ['bstair',ic(['#3a2212','#7a5228','#9a6a36'],(p,C)=>{for(let i=0;i<4;i++)for(let y=12-i*3;y<13;y++)for(let x=1+i*3;x<4+i*3;x++)p.set(x,y,C[y===12-i*3?2:1]);})],
    ['broof',ic(['#4a1a12','#8a3a22','#a84a2a'],(p,C)=>{for(let y=2;y<12;y++)for(let x=1+Math.abs(7-y)*0;x<13;x++)if(Math.abs(x-6.5)<=y-1)p.set(x,y,C[(y%3===0)?0:(x%3?1:2)]);})]);
}catch(e){console.error('Bauen: Symbole',e);}};}
