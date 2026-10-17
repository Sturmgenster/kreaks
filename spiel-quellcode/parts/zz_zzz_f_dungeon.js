/* =========================================================
   0.0.112 · Dungeons
   - In der Wildnis stehen alte Gewölbe-Eingänge. Unten wartet ein zufällig erzeugtes Labyrinth aus Räumen:
     Gegner, Stachelfallen, Truhen, ein verschlossenes Gitter mit Hebel-Rätsel und ein Boss mit Schatztruhe.
   - Liegt tief unter der Erde (120 m), dunkel, nur deine Fackel leuchtet.
   ========================================================= */
const DG_Y=-120,DG_N=5,DG_C=12,DG_H=4.6;
Object.assign(DGX,{d:null,grp:null,sol:[],ents:[],traps:[],gate:null,lever:null,chests:[],exit:null,light:null,t:0});
AREAS.in_dungeon='Dungeon';AREA_MUSIC.in_dungeon=AREA_MUSIC.in_cave||'orte/hoehle';try{WX_NONE.add('in_dungeon');MAPC.in_dungeon=[40,36,34];}catch(e){}
DT.dgboss=Object.assign({},DT.g_bonelord||DT.g_skelwar,{name:'Der Knochenfürst',boss:1,hp:1900,xp:520,leash:80,noLeash:false});
// ---------- Eingänge in der Wildnis ----------
const DG_BIO=new Set(['wald','ebene','nadelwald','nadel2','redwood','dschungel','savanne','wueste','steinwueste','sumpf','schnee']);
function dgOf(s){if(s.dgDone)return s.dg;s.dgDone=true;s.dg=null;if(!DG_BIO.has(s.b)||s.island)return null;const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,7010)>.22)return null;
  const r=mulberry32(7011+s.ci*7919+s.cj*15485+WSEED*53);for(let t=0;t<25;t++){const a=r()*6.283,d=r()*s.R*.6,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<300)continue;const y=getHeight(x,z);if(y<WATER+2)continue;
    const sl=Math.abs(getHeight(x+3,z)-y)+Math.abs(getHeight(x,z+3)-y);if(sl>2.5)continue;let ok=true;for(let k=0;k<8;k++){const q=k*.785,hh=getHeight(x+Math.cos(q)*40,z+Math.sin(q)*40);if(hh<WATER+.5){ok=false;break;}}if(!ok)continue;
    const g=FLAGS.gy;s.dg={id:s.id+'_dg',x,z,y,rot:r()*6.283,seed:(A*31+B*17+WSEED)|0};return s.dg;}return null;}
const DGE={built:new Map(),t:0};let DGM=null;
function dgMats(){if(DGM)return DGM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  const brick=(seed,cols,moss)=>{const p=new Px(32,32),S=pal(cols);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),off=row%2?8:0,seam=y%8===0||(x+off)%16===0;p.set(x,y,S[seam?0:shadeIdx(.55+(hash2((x+off)>>4,row,seed)-.5)*.35+(hash2(x,y,seed+1)-.5)*.2,S.length,x,y)]);if(moss&&hash2(x,y,seed+2)<moss)p.set(x,y,hex('#2e4a26'));}return T(p.done());};
  const wall=brick(7020,['#1e1c20','#2e2c30','#3e3c40','#4e4c50','#5e5c60'],.03),floor=brick(7023,['#1a1816','#2a2622','#3a342e','#4a443c'],.02);wall.repeat.set(3,1.2);floor.repeat.set(DG_N*3,DG_N*3);
  DGM={wall:new THREE.MeshLambertMaterial({map:wall}),floor:new THREE.MeshLambertMaterial({map:floor}),ceil:new THREE.MeshLambertMaterial({color:0x141214}),stone:new THREE.MeshLambertMaterial({map:brick(7026,['#3a3a40','#525258','#6a6a70','#828288'],.06)}),
    iron:new THREE.MeshLambertMaterial({color:0x2a2a30}),wood:bMats().wood,gold:new THREE.MeshLambertMaterial({color:0xc8a030}),fire:new THREE.MeshBasicMaterial({color:0xffa030}),spike:new THREE.MeshLambertMaterial({color:0x8a8a90}),dark:new THREE.MeshBasicMaterial({color:0x050505})};return DGM;}
function dgEntBuild(g){const M=dgMats(),grp=new THREE.Group();grp.position.set(g.x,g.y,g.z);grp.rotation.y=-g.rot;const add=(geo,m,x,y,z,ry)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;grp.add(o);return o;};
  add(new THREE.BoxGeometry(.9,3.4,.9),M.stone,-1.8,1.7,0);add(new THREE.BoxGeometry(.9,3.4,.9),M.stone,1.8,1.7,0);add(new THREE.BoxGeometry(4.6,.8,1.1),M.stone,0,3.6,0);add(new THREE.BoxGeometry(2.7,.05,2.4),M.dark,0,.04,-1);
  for(let i=0;i<4;i++)add(new THREE.BoxGeometry(2.7,.2,.5),M.stone,0,.02-i*.2,-.2-i*.5);for(let k=0;k<5;k++)add(new THREE.BoxGeometry(.6+Math.random()*.4,.4,.5),M.stone,(Math.random()-.5)*7,.2,(Math.random()-.5)*5,Math.random()*3);
  scene.add(grp);const c=Math.cos(g.rot),s=Math.sin(g.rot);for(const sx of[-1.8,1.8])addProp(g.x+sx*c,g.z+sx*s,.6);DGE.built.set(g.id,{g,grp});}
function dgEntLooked(){for(const B of DGE.built.values()){const g=B.g;if(Math.hypot(g.x-P.x,g.z-P.z)<4&&lookingAt(g.x,g.y+1.2,g.z,5,.7))return g;}return null;}
// ---------- Labyrinth ----------
function dgGen(g){const r=mulberry32(g.seed>>>0),N=DG_N,vis=new Set(),edges=new Set(),ek=(a,b)=>a<b?a+','+b:b+','+a,ci=(i,j)=>i*N+j,st=[[0,(N>>1)]];vis.add(ci(0,N>>1));
  while(st.length){const[i,j]=st[st.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[i+a,j+b]).filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&!vis.has(ci(a,b)));if(!nb.length){st.pop();continue;}const n=nb[(r()*nb.length)|0];vis.add(ci(n[0],n[1]));edges.add(ek(ci(i,j),ci(n[0],n[1])));st.push(n);}
  for(let k=0;k<4;k++){const i=(r()*(N-1))|0,j=(r()*N)|0;edges.add(ek(ci(i,j),ci(i+1,j)));}
  const start=ci(0,N>>1),dist=new Map([[start,0]]),q=[start];while(q.length){const c=q.shift();for(const e of edges){const[a,b]=e.split(',').map(Number);const o=a===c?b:b===c?a:-1;if(o<0||dist.has(o))continue;dist.set(o,dist.get(c)+1);q.push(o);}}
  let boss=start;for(const[c,d]of dist)if(d>dist.get(boss))boss=c;let gate=null;for(const e of edges){const[a,b]=e.split(',').map(Number);if((a===boss||b===boss)&&dist.get(a===boss?b:a)===dist.get(boss)-1){gate=e;break;}}
  const reach=new Set([start]),q2=[start];while(q2.length){const c=q2.shift();for(const e of edges){if(e===gate)continue;const[a,b]=e.split(',').map(Number);const o=a===c?b:b===c?a:-1;if(o<0||reach.has(o))continue;reach.add(o);q2.push(o);}}
  const cand=[...reach].filter(c=>c!==start&&c!==boss);let lever=cand.length?cand[(r()*cand.length)|0]:start;
  const rooms=[];for(let c=0;c<N*N;c++){const k=r();rooms.push({c,i:Math.floor(c/N),j:c%N,mob:c!==start&&c!==boss&&k<.65,trap:c!==start&&c!==boss&&r()<.35,chest:c!==start&&c!==boss&&r()<.22,lever:c===lever});}
  return{N,edges,start,boss,gate,lever,rooms,r};}
function dgOrigin(g,G){const sx=(G.start/G.N|0),sz=G.start%G.N;return[g.x-(sx+.5)*DG_C,g.z-(sz+.5)*DG_C];}
function dgBuild(g){const M=dgMats(),G=dgGen(g),[ox,oz]=dgOrigin(g,G),grp=new THREE.Group(),N=G.N,W=N*DG_C,st=(FLAGS.dgs=FLAGS.dgs||{})[g.id]=FLAGS.dgs[g.id]||{};
  DGX.d={g,G,ox,oz,W,st};DGX.grp=grp;DGX.sol=[];DGX.ents=[];DGX.traps=[];DGX.chests=[];
  const box=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);grp.add(o);return o;};
  const sol=(x,z,hw,hd,y0,y1)=>{const b=solAdd({x,z,hw,hd,y0,y1,rot:0,solid:1,dg:1});DGX.sol.push(b);return b;};
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,W),M.floor);fl.rotation.x=-Math.PI/2;fl.position.set(ox+W/2,DG_Y,oz+W/2);grp.add(fl);
  const ce=new THREE.Mesh(new THREE.PlaneGeometry(W,W),M.ceil);ce.rotation.x=Math.PI/2;ce.position.set(ox+W/2,DG_Y+DG_H,oz+W/2);grp.add(ce);
  const cc=(i,j)=>[ox+(i+.5)*DG_C,oz+(j+.5)*DG_C],has=(a,b)=>G.edges.has(a<b?a+','+b:b+','+a);
  // Wände (Außenrand und zwischen nicht verbundenen Räumen, Türöffnungen 3 m)
  const wallX=(x,z0,z1,door)=>{const L=z1-z0,y=DG_Y+DG_H/2;if(!door){box(1,DG_H,L,M.wall,x,y,(z0+z1)/2);sol(x,(z0+z1)/2,.5,L/2,DG_Y,DG_Y+DG_H);return;}const s=(L-3)/2;box(1,DG_H,s,M.wall,x,y,z0+s/2);box(1,DG_H,s,M.wall,x,y,z1-s/2);sol(x,z0+s/2,.5,s/2,DG_Y,DG_Y+DG_H);sol(x,z1-s/2,.5,s/2,DG_Y,DG_Y+DG_H);box(1,1,3,M.wall,x,DG_Y+DG_H-.5,(z0+z1)/2);};
  const wallZ=(z,x0,x1,door)=>{const L=x1-x0,y=DG_Y+DG_H/2;if(!door){box(L,DG_H,1,M.wall,(x0+x1)/2,y,z);sol((x0+x1)/2,z,L/2,.5,DG_Y,DG_Y+DG_H);return;}const s=(L-3)/2;box(s,DG_H,1,M.wall,x0+s/2,y,z);box(s,DG_H,1,M.wall,x1-s/2,y,z);sol(x0+s/2,z,s/2,.5,DG_Y,DG_Y+DG_H);sol(x1-s/2,z,s/2,.5,DG_Y,DG_Y+DG_H);box(3,1,1,M.wall,(x0+x1)/2,DG_Y+DG_H-.5,z);};
  for(let i=0;i<=N;i++)for(let j=0;j<N;j++){const x=ox+i*DG_C,z0=oz+j*DG_C,z1=z0+DG_C;if(i===0||i===N){wallX(x,z0,z1,false);continue;}const a=(i-1)*N+j,b=i*N+j;wallX(x,z0,z1,has(a,b));
    if(G.gate===(a<b?a+','+b:b+','+a))dgGate(x,(z0+z1)/2,true);}
  for(let j=0;j<=N;j++)for(let i=0;i<N;i++){const z=oz+j*DG_C,x0=ox+i*DG_C,x1=x0+DG_C;if(j===0||j===N){wallZ(z,x0,x1,false);continue;}const a=i*N+j-1,b=i*N+j;wallZ(z,x0,x1,has(a,b));
    if(G.gate===(a<b?a+','+b:b+','+a))dgGate((x0+x1)/2,z,false);}
  // Räume
  const r=mulberry32((g.seed^0x5bd1)>>>0);
  for(const R of G.rooms){const[cx,cz]=cc(R.i,R.j);
    for(const[dx,dz]of[[-DG_C/2+.6,0],[DG_C/2-.6,0]]){box(.15,.5,.15,M.wood,cx+dx,DG_Y+2.6,cz+dz);const f=box(.22,.3,.22,M.fire,cx+dx,DG_Y+2.95,cz+dz);DGX.traps.push({fire:f,x:cx+dx,z:cz+dz});}
    if(R.c===G.start){const s=new THREE.Group();for(let k=0;k<6;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(2.4,.4*(k+1),.6),M.stone);m.position.set(0,.2*(k+1),-k*.6);s.add(m);}s.position.set(cx,DG_Y,cz-2);grp.add(s);DGX.exit={x:cx,z:cz-3.5};continue;}
    if(R.lever){const L=new THREE.Group(),base=new THREE.Mesh(new THREE.BoxGeometry(.6,.4,.4),M.stone),arm=new THREE.Mesh(new THREE.BoxGeometry(.12,1,.12),M.iron);arm.position.y=.5;const pv=new THREE.Group();pv.add(arm);pv.rotation.z=st.lever?-.7:.7;pv.position.y=.2;L.add(base,pv);L.position.set(cx+DG_C/2-1.3,DG_Y,cz);grp.add(L);DGX.lever={x:cx+DG_C/2-1.3,z:cz,pv};}
    if(R.trap){for(let k=0;k<2;k++){const tx=cx+(r()-.5)*6,tz=cz+(r()-.5)*6,plate=box(2,.08,2,M.iron,tx,DG_Y+.04,tz),sp=new THREE.Group();for(let a=0;a<4;a++)for(let b=0;b<4;b++){const s2=new THREE.Mesh(new THREE.ConeGeometry(.12,.7,4),M.spike);s2.position.set(-.75+a*.5,0,-.75+b*.5);sp.add(s2);}
      sp.position.set(tx,DG_Y-.4,tz);grp.add(sp);DGX.traps.push({plate:1,x:tx,z:tz,sp,ph:r()*3});}}
    if(R.chest&&!(st.ch&&st.ch[R.c]))DGX.chests.push(dgChest(cx+(r()-.5)*5,cz+(r()-.5)*5,R.c,false));
    if(R.mob&&!st.boss){const n=1+((r()*3)|0),T=['zombie','usks','uska','uskb','uskh','usksa','nskel'];for(let k=0;k<n;k++){const t=r()<.08&&DT.troll?'troll':T[(r()*T.length)|0];if(!DT[t])continue;const e=spawnEnt(t,cx+(r()-.5)*7,cz+(r()-.5)*7,{home:{x:cx,z:cz},cmd:1,aggroT:0});if(t==='troll')e.special=mzTrollAI;e.dormant=true;e.showDormant=true;e.wakeR=12;DGX.ents.push(e);}}
    if(R.c===G.boss){if(!st.boss){let e;if(r()<.5&&typeof mzSpawnLich==='function'){e=mzSpawnLich(cx,cz,true);e.cmd=1;}else{e=spawnEnt('dgboss',cx,cz,{home:{x:cx,z:cz},cmd:1});}e.dgBoss=1;e.dormant=true;e.showDormant=true;e.wakeR=13;DGX.ents.push(e);}
      if(!st.loot)DGX.chests.push(dgChest(cx,cz+DG_C/2-2,'boss',true));}}
  scene.add(grp);DGX.light=new THREE.PointLight(0xffb060,1.6,20,1.5);scene.add(DGX.light);}
function dgGate(x,z,alongZ){const M=dgMats(),st=DGX.d.st,g=new THREE.Group();for(let k=-1;k<=1;k+=.4){const b=new THREE.Mesh(new THREE.BoxGeometry(.1,DG_H-1,.1),M.iron);b.position.set(alongZ?0:k,(DG_H-1)/2,alongZ?k:0);g.add(b);}
  const bar=new THREE.Mesh(new THREE.BoxGeometry(alongZ?.12:3,.12,alongZ?3:.12),M.iron);bar.position.y=1.6;g.add(bar);g.position.set(x,DG_Y+(st.lever?DG_H-1:0),z);DGX.grp.add(g);
  const s=solAdd({x,z,hw:alongZ?.3:1.5,hd:alongZ?1.5:.3,y0:DG_Y,y1:DG_Y+DG_H,rot:0,solid:1,off:!!st.lever,dg:1});DGX.sol.push(s);DGX.gate={g,s,open:!!st.lever,t:0};}
function dgChest(x,z,key,boss){const M=dgMats(),g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(boss?1.4:1,.7,boss?.9:.7),M.wood),l=new THREE.Mesh(new THREE.BoxGeometry(boss?1.5:1.1,.25,boss?1:.8),boss?M.gold:M.wood);b.position.y=.35;l.position.y=.82;g.add(b,l);g.position.set(x,DG_Y,z);DGX.grp.add(g);
  const s=solAdd({x,z,hw:boss?.7:.5,hd:boss?.45:.35,y0:DG_Y,y1:DG_Y+.95,rot:0,solid:1,dg:1});DGX.sol.push(s);return{x,z,key,boss,g,s,lid:l,open:false};}
function dgLoot(c){const st=DGX.d.st;if(c.open)return;if(c.boss&&!st.boss){toast('Die Truhe ist versiegelt, solange der Wächter dieses Gewölbes lebt.');return;}c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z-=.3;c.lid.position.y+=.25;
  const R=Math.random,L=c.boss?[['coin',2+((R()*3)|0)],['silver',25+((R()*20)|0)],['hpot2',2],['pmana',1]]:[['copper',10+((R()*25)|0)],['silver',2+((R()*6)|0)]];if(!c.boss&&R()<.4)L.push(['hpot',1]);if(!c.boss&&R()<.2)L.push(['arrow',8]);
  if(c.boss){const gems=['ruby','opal','sapphire','emerald','diamond'].filter(k=>ITEMS[k]);for(let i=0;i<2;i++)if(gems.length)L.push([gems[(R()*gems.length)|0],1]);const rare=['trident','cutlass','divehelm','bow','pregen'].filter(k=>ITEMS[k]);L.push([rare[(R()*rare.length)|0],1]);if(R()<.5)L.push(['sr_'+(SPELL_ORDER?SPELL_ORDER[(R()*SPELL_ORDER.length)|0]:''),1]);}
  const got=[];for(const[id,n]of L){if(!ITEMS[id])continue;if(!addItem(id,n))spawnDrop(id,n,P.x,P.y+1,P.z);got.push(n+'× '+ITEMS[id].name);}toast('Gefunden: '+got.join(', '));try{Snd.coin?Snd.coin():Snd.pickup();}catch(e){}
  if(c.boss)st.loot=1;else{st.ch=st.ch||{};st.ch[c.key]=1;}renderInv();saveGame();}
function dgFree(){if(DGX.grp){scene.remove(DGX.grp);DGX.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});}for(const b of DGX.sol)solDel(b);for(const e of DGX.ents)if(DEM.includes(e))removeEnt(e);
  for(const e of DEM.slice())if(e.fac==='demon'&&e.y<DG_Y+30&&e.y>DG_Y-30)removeEnt(e);if(DGX.light)scene.remove(DGX.light);DGX.grp=null;DGX.sol=[];DGX.ents=[];DGX.traps=[];DGX.chests=[];DGX.gate=null;DGX.lever=null;DGX.light=null;}
function dgEnter(g){if(P.riding){toast('Steig erst ab');return;}dgBuild(g);DGX.on=true;const s=DGX.exit;P.x=s.x;P.z=s.z+2;P.y=DG_Y+.05;P.vx=P.vy=P.vz=0;P.yaw=0;P.safe=null;curArea=null;setTimeout(checkArea,150);
  Snd.click();toast(DGX.d.st.boss?'Das Gewölbe ist still. Der Wächter ist besiegt.':'Ein kalter Hauch zieht durch das Gewölbe …');}
function dgLeave(dead){const g=DGX.d&&DGX.d.g;dgFree();DGX.on=false;DGX.d=null;if(!dead&&g){const c=Math.cos(g.rot),s=Math.sin(g.rot);P.x=g.x+s*-0+c*0;P.z=g.z+2.5;P.y=getHeight(P.x,P.z)+.1;P.vx=P.vy=P.vz=0;P.safe=[P.x,P.z];}curArea=null;setTimeout(checkArea,150);}
// ---------- Boden, Gebiet, Licht ----------
const dgIn=(x,z)=>DGX.on&&DGX.d&&x>DGX.d.ox-2&&x<DGX.d.ox+DGX.d.W+2&&z>DGX.d.oz-2&&z<DGX.d.oz+DGX.d.W+2;
{const a=groundAt;groundAt=function(x,z,feet){if(DGX.on&&dgIn(x,z)&&(feet==null||feet<DG_Y+40)){let g=DG_Y;for(const b of solNear(x,z)){if(b.off||!b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)<=b.hw&&Math.abs(lz)<=b.hd){const t=solTop(b,lz);if(t>g&&(feet==null||t<=feet+.65))g=t;}}return g;}return a(x,z,feet);};}
{const a=areaAt;areaAt=function(x,z){if(DGX.on&&dgIn(x,z)&&P.y<DG_Y+40)return'in_dungeon';return a(x,z);};}
{const a=swCan;swCan=function(){if(DGX.on)return false;return a();};}
{const a=mzBlocked;mzBlocked=function(){return DGX.on||a();};}
{const a=renderer.render;renderer.render=function(s,c){if(!DGX.on)return a.call(renderer,s,c);const fn=scene.fog.near,ff=scene.fog.far,fc=scene.fog.color.clone(),hc=SKY_HOR.clone(),tc=SKY_TOP.clone(),sv=sky.visible,hi=hemi.intensity,si=sun.intensity;
  if(time-uwT>2){uwT=time;uwCollect();}const saved=UWM.map(m=>[m,m.uniforms.fogNear.value,m.uniforms.fogFar.value,m.uniforms.light?m.uniforms.light.value:null]);
  scene.fog.color.setRGB(0,0,0);SKY_HOR.setRGB(0,0,0);SKY_TOP.setRGB(0,0,0);const FF=DGX.d&&DGX.d.far||34;scene.fog.near=2;scene.fog.far=FF;sky.visible=false;hemi.intensity=DGX.d&&DGX.d.hemi||.28;sun.intensity=0;
  for(const[m,,,l]of saved){m.uniforms.fogNear.value=2;m.uniforms.fogFar.value=FF;if(l!=null)m.uniforms.light.value=.55;}
  try{a.call(renderer,s,c);}finally{scene.fog.near=fn;scene.fog.far=ff;scene.fog.color.copy(fc);SKY_HOR.copy(hc);SKY_TOP.copy(tc);sky.visible=sv;hemi.intensity=hi;sun.intensity=si;for(const[m,n0,f0,l]of saved){m.uniforms.fogNear.value=n0;m.uniforms.fogFar.value=f0;if(l!=null)m.uniforms.light.value=l;}}};}
// ---------- Takt ----------
function dgTick(dt){DGE.t-=dt;if(DGE.t<=0){DGE.t=1;if(P.x<60000&&WL_READY&&!DGX.on){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=dgOf(wlSite(ci+a,cj+b));if(g&&!DGE.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<160)dgEntBuild(g);}}
    for(const B of[...DGE.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>240||P.x>60000){scene.remove(B.grp);DGE.built.delete(B.g.id);}}
  if(!DGX.on)return;if(DGX.light){DGX.light.position.set(P.x,P.y+2.2,P.z);DGX.light.intensity=1.5+Math.sin(time*13)*.08+Math.sin(time*7.3)*.06;}
  for(const T of DGX.traps){if(T.fire){if(Math.random()<dt*6)spawnParticle(T.x,DG_Y+3.2,T.z,(Math.random()-.5)*.3,.8,(Math.random()-.5)*.3,0xffa030,.5,.18);continue;}
    const ph=((time+T.ph)%3),up=ph>2&&ph<2.9;T.sp.position.y=DG_Y+(up?.25:-.4);if(up&&Math.abs(P.x-T.x)<1&&Math.abs(P.z-T.z)<1&&P.y<DG_Y+.6&&time-(T.hitT||-9)>.9){T.hitT=time;takeDamage(10);toast('Autsch! Stacheln!');}}
  const G=DGX.gate;if(G&&G.open&&G.t<1){G.t=Math.min(1,G.t+dt*.5);G.g.position.y=DG_Y+G.t*(DG_H-1);}
  const st=DGX.d.st;for(const e of DGX.ents)if(e.dgBoss&&e.dead&&!st.boss){st.boss=1;saveGame();setTimeout(()=>toast('Der Wächter des Gewölbes ist besiegt! Die große Truhe ist jetzt offen.'),1200);}
  if(state==='playing'&&!dgIn(P.x,P.z)){dgLeave(false);}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{dgTick(dt);}catch(e){if(!dgTick.err){dgTick.err=1;console.error('Dungeon',e);}}};}
// ---------- Benutzen ----------
function dgUse(){if(!DGX.on){const g=dgEntLooked();if(g){dgEnter(g);return true;}return false;}
  if(DGX.exit&&Math.hypot(DGX.exit.x-P.x,DGX.exit.z-P.z)<3.2&&lookingAt(DGX.exit.x,DG_Y+1,DGX.exit.z,4,.6)){dgLeave(false);return true;}
  const L=DGX.lever;if(L&&Math.hypot(L.x-P.x,L.z-P.z)<2.6&&lookingAt(L.x,DG_Y+.6,L.z,3.4,.7)){if(!DGX.d.st.lever){DGX.d.st.lever=1;L.pv.rotation.z=-.7;if(DGX.gate){DGX.gate.open=true;DGX.gate.s.off=true;}try{Snd.clank?Snd.clank():Snd.click();}catch(e){}toast('Klack! Irgendwo hebt sich ein schweres Gitter …');saveGame();}else toast('Der Hebel ist schon umgelegt.');return true;}
  for(const c of DGX.chests)if(!c.open&&Math.hypot(c.x-P.x,c.z-P.z)<2.4&&lookingAt(c.x,DG_Y+.6,c.z,3.4,.7)){dgLoot(c);return true;}return false;}
function dgPrompt(){if(!DGX.on)return dgEntLooked()?'Dungeon betreten':null;if(DGX.exit&&Math.hypot(DGX.exit.x-P.x,DGX.exit.z-P.z)<3.2&&lookingAt(DGX.exit.x,DG_Y+1,DGX.exit.z,4,.6))return'Nach oben steigen';
  const L=DGX.lever;if(L&&Math.hypot(L.x-P.x,L.z-P.z)<2.6&&lookingAt(L.x,DG_Y+.6,L.z,3.4,.7))return DGX.d.st.lever?null:'Hebel umlegen';for(const c of DGX.chests)if(!c.open&&Math.hypot(c.x-P.x,c.z-P.z)<2.4&&lookingAt(c.x,DG_Y+.6,c.z,3.4,.7))return'Truhe öffnen';return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&(P.x<60000)&&dgUse())return true;return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000){const t=dgPrompt();if(t)return t;}return a();};}
{const a=playerDie;playerDie=function(){const was=DGX.on;a();if(was&&state==='dead'){dgFree();DGX.on=false;DGX.d=null;}};}
{const a=startGame;startGame=function(isNew,char){if(DGX.on){dgFree();DGX.on=false;DGX.d=null;}for(const B of DGE.built.values())scene.remove(B.grp);DGE.built.clear();return a(isNew,char);};}
{const a=petAI;petAI=function(e,dt){if(DGX.on&&Math.abs(e.y-P.y)>8){e.x=P.x+Math.sin(P.yaw)*2;e.z=P.z+Math.cos(P.yaw)*2;entGround(e);}return a(e,dt);};}
{const a=wlReset;wlReset=function(){for(const B of DGE.built.values())scene.remove(B.grp);DGE.built.clear();a();};}
// /dungeon (Cheat-Modus)
HELP.push(['/dungeon','Teleport zum nächsten Dungeon-Eingang (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/dungeon\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/dungeon geht nur im Cheat-Modus.','err');return;}if(DGX.on||P.x>60000){conLog('Geh erst nach draußen.','err');return;}let best=null,bd=1e9;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
    for(let R=0;R<=22&&!best;R++)for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const g=dgOf(wlSite(ci+a,cj+b));if(!g)continue;const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;best=g;}}
    if(!best){conLog('Kein Dungeon in der Nähe gefunden.','err');return;}teleport(best.x,best.z+5,0);conLog(`Dungeon-Eingang gefunden (${Math.round(bd)} m entfernt).`,'ok');closeConsole();return;}return a(raw);};}
