/* =========================================================
   CHRONIK VON KRIESA, Überarbeitung:
   Wikinger-Plünderer, belebte Kulissen (Gelände, Wälder, Felder, Windmühlen, Wolken, Vögel),
   selbstlaufende Bewohner und Tiere, echte Kämpfe, Seeschlachten mit Kanonenkugeln,
   gemalte Weltkarten, die sich vereinen und wieder zerfallen. Musik: das Waldlied.
   ========================================================= */
// ---------- Wikinger-Plünderer: graue Haut, Hörnerhelm, Axt/Schwert, rote Augen ----------
const VIK_GREY=pal(['#3e4246','#575c62','#73797f','#8e949a']);
function chGrey(cv){const o=chOver(cv),x=o.getContext('2d'),img=x.getImageData(0,0,o.width,o.height),d=img.data,M=new Map();
  for(const P of SKINS)P.forEach((c,i)=>M.set(c[0]+','+c[1]+','+c[2],VIK_GREY[Math.min(3,i)]));
  for(const k in SKINPAL)for(const s of SKINPAL[k])if(k==='human')s[1].forEach((c,i)=>M.set(c[0]+','+c[1]+','+c[2],VIK_GREY[Math.min(3,i)]));
  for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const g=M.get(d[i]+','+d[i+1]+','+d[i+2]);if(g){d[i]=g[0];d[i+1]=g[1];d[i+2]=g[2];}}
  x.putImageData(img,0,0);return o;}
function chVikHelm(metal,horn){return cv=>{if(!cv.headBox)return cv;const[h0,h1,t]=cv.headBox,c=(h0+h1)>>1;return chOver(cv,x=>{
  for(let y=t-2;y<=t+2;y++)for(let X=h0-1;X<=h1+1;X++){if(y===t-2&&(X<h0+1||X>h1-1))continue;chPx(x,X,y,y===t+2?'#2a2c30':(X<c?metal:'#5a5e66'));}
  chPx(x,c,t+3,'#2a2c30');chPx(x,c,t+4,'#2a2c30');chPx(x,c,t-3,metal);
  if(horn)for(const s of[-1,1]){const bx=s<0?h0-1:h1+1;for(let k=0;k<5;k++)chPx(x,bx+s*(k<2?k:2+((k-2)>>1)),t-1-k,k>3?'#f8f0d8':'#d8ccaa');}});};}
function chVikWeapon(kind){return cv=>{const hr=cv.handR;if(!hr)return cv;const[hx,hy]=hr;return chOver(cv,x=>{
  if(kind==='axe'){for(let k=0;k<11;k++)chPx(x,hx,hy-k,k===0?'#3a2410':'#6a4420');for(let k=0;k<4;k++){chPx(x,hx+1,hy-7-k,'#9aa0a8');chPx(x,hx+2,hy-7-k,k===0||k===3?'#c8ccd4':'#b4bac2');}chPx(x,hx+3,hy-8,'#e8ecf0');chPx(x,hx+3,hy-9,'#e8ecf0');}
  else if(kind==='dax'){for(let k=0;k<12;k++)chPx(x,hx,hy-k,'#5a3a1c');for(const s of[-1,1])for(let k=0;k<4;k++){chPx(x,hx+s,hy-8-k,'#a8aeb6');chPx(x,hx+s*2,hy-8-k,k===0||k===3?'#d8dce2':'#bcc2ca');}}
  else{chPx(x,hx-1,hy-1,'#8a6a1c');chPx(x,hx+1,hy-1,'#8a6a1c');chPx(x,hx,hy,'#3a2410');for(let k=1;k<10;k++)chPx(x,hx,hy-1-k,k>7?'#f0f4f8':'#c8ccd4');}});};}
function chShield(c1,c2){return cv=>{const hl=cv.handL;if(!hl)return cv;const[hx,hy]=hl;return chOver(cv,x=>{for(let y=-4;y<=4;y++)for(let X=-4;X<=4;X++){const r=Math.hypot(X,y);if(r>4.4)continue;
  chPx(x,hx-1+X,hy-3+y,r>3.5?'#3a2a18':(r<1.2?'#c8ccd4':((Math.atan2(y,X)+3.2)%1.6<.8?c1:c2)));}});};}
Object.assign(CH_LOOKS,{
  pl0:[{skin:1,hair:'long',hairColor:'red',beard:'long',cloth:'leather',clothColor:'brown',pants:'grey'},[chGrey,chVikHelm('#9aa0a8',1),chVikWeapon('axe'),chShield('#a82a1e','#e8e0cc')]],
  pl1:[{skin:0,hair:'long',hairColor:'blond',beard:'long',cloth:'chain',clothColor:'grey',pants:'brown'},[chGrey,chVikHelm('#8a8e96',1),chVikWeapon('sword')]],
  pl2:[{skin:2,hair:'braid',hairColor:'black',beard:'short',cloth:'rags',clothColor:'black',pants:'leather'},[chGrey,chVikHelm('#7a7e86',0),chVikWeapon('dax')]],
  pl3:[{skin:3,hair:'wild',hairColor:'brown',beard:'long',cloth:'leather',clothColor:'black',pants:'brown'},[chGrey,chVikHelm('#a8aeb6',1),chVikWeapon('sword'),chShield('#2a2a2a','#c8a040')]]});
const VIK_EYES=k=>{const e=chEyes(k);if(e)e.c='r';return e;};
// Plünderer und Schattenkrieger bekommen immer leuchtende Augen
{const a=cE;cE=function(sp,lx,lz,o){o=o||{};if(!o.eyes){const m=/^ch_(pl\d|sh\d)_$/.exec(sp);if(m)o.eyes=m[1][0]==='p'?VIK_EYES(m[1]):chEyes(m[1]);}return a(sp,lx,lz,o);};}
// =========================================================
// Gelände, Pflanzen, Wolken, Vögel, Windmühlen
// =========================================================
const chRoll=(lx,lz,flatR,amp,seed)=>{const d=Math.hypot(lx,lz),e=smooth(Math.max(0,Math.min(1,(d-flatR)/90)));return e?Math.max(0,fbm(lx*.011+50,lz*.011+50,3,seed)-.36)*amp*e:0;};
function chTerrain(g,tex,size,seg,hfn,col){const geo=new THREE.PlaneGeometry(size,size,seg,seg);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,uv=geo.attributes.uv,C=[];
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=hfn(x,z);p.setY(i,h);uv.setXY(i,uv.getX(i)*size/4,uv.getY(i)*size/4);
    const n=(vnoise(x*.03,z*.03,91)-.5)*.22+(col?col(x,z,h):0);C.push(1+n,1+n*.8,1+n*.6);}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(C,3));geo.computeVertexNormals();
  const m=new THREE.MeshPhongMaterial({map:tex,vertexColors:true,flatShading:true,shininess:0,specular:0x000000,side:THREE.DoubleSide});
  const me=new THREE.Mesh(geo,m);me.position.set(STG.x,chY(0),STG.z);g.add(me);return me;}
function chDeco(g,list){if(!list.length)return null;const L=list.filter(b=>SPR[b.spr]).map(b=>{const s=SPR[b.spr],h=b.h||2;return{x:STG.x+b.lx,y:chY(b.y),z:STG.z+b.lz,w:h*s.w/s.h,h,spr:b.spr,tint:b.tint||1,sway:b.sway==null?.03:b.sway,_hv:null,_vs:1};});
  const m=makeBillboards(L,decorMat);m.frustumCulled=false;g.add(m);return m;}
// streut Pflanzen: rule(x,z,h) gibt {spr,h} oder null
function chScatter(list,n,r0,r1,hfn,rule,seed){const R=mulberry32(seed||1);for(let i=0;i<n;i++){const a=R()*6.283,d=r0+(r1-r0)*Math.sqrt(R()),x=Math.cos(a)*d,z=Math.sin(a)*d,o=rule(x,z,R);if(o)list.push({lx:x,lz:z,y:hfn(x,z)-.05,spr:o.spr,h:o.h,sway:o.sway});}}
const TREES=['oak0','oak1','oak2','birch0','birch1','pine0','pine1','pine2','maple'],SMALL=['bush0','bush1','grass0','grass1','grass2','grass3','flower0','flower1','flower2','flower3','fern0','fern1'];
function chForest(list,hfn,cx,cz,r,n,seed,kinds){const R=mulberry32(seed);for(let i=0;i<n;i++){const a=R()*6.283,d=r*Math.sqrt(R()),x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d,k=(kinds||TREES)[(R()*(kinds||TREES).length)|0];
  list.push({lx:x,lz:z,y:hfn(x,z)-.1,spr:k,h:k.startsWith('pine')?7+R()*5:5+R()*4,sway:.05});}}
function chCloudTex(){if(CHX.cloudTex)return CHX.cloudTex;const c=document.createElement('canvas');c.width=64;c.height=32;const x=c.getContext('2d');
  for(let i=0;i<9;i++){const px=12+i*5+Math.sin(i)*3,py=18-Math.sin(i/8*Math.PI)*8,r=7+Math.sin(i*1.7)*2;x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(px,py,r,0,7);x.fill();}
  x.fillStyle='rgba(190,200,215,.9)';x.fillRect(8,24,48,3);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return CHX.cloudTex=t;}
function chClouds(g,n,seed){const R=mulberry32(seed||5),L=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:chCloudTex(),transparent:true,depthWrite:false,opacity:.9,fog:true});
  const s=new THREE.Sprite(m);const sc=30+R()*40;s.scale.set(sc,sc*.5,1);s.position.set(STG.x+(R()-.5)*700,chY(70+R()*50),STG.z+(R()-.5)*700);g.add(s);L.push(s);}g.userData.clouds=L;}
function chWindmill(g,lx,lz,y,rot){const G=new THREE.Group(),w=VM.planks;G.position.set(STG.x+lx,chY(y),STG.z+lz);G.rotation.y=rot||0;
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.6,9,8),VM.stone);tw.position.y=4.5;G.add(tw);const cap=new THREE.Mesh(new THREE.ConeGeometry(2.4,2.6,8),VM.thatch);cap.position.y=10.2;G.add(cap);
  const hub=new THREE.Group();hub.position.set(0,8.6,2.2);G.add(hub);for(let k=0;k<4;k++){const arm=new THREE.Group();arm.rotation.z=k*Math.PI/2;const b=new THREE.Mesh(new THREE.BoxGeometry(.25,7,.15),w);b.position.y=3.5;arm.add(b);
    const s=new THREE.Mesh(new THREE.PlaneGeometry(1.4,5.6),VM.sail);s.position.set(.8,3.9,.05);arm.add(s);hub.add(arm);}
  g.add(G);(g.userData.spin=g.userData.spin||[]).push(hub);return G;}
function chField(g,lx,lz,w,d,rot,y,col){const c=document.createElement('canvas');c.width=16;c.height=16;const x=c.getContext('2d');for(let i=0;i<16;i++){x.fillStyle=i%4<2?col[0]:col[1];x.fillRect(0,i,16,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/4,d/4);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshPhongMaterial({map:t,flatShading:true,shininess:0}));m.rotation.x=-Math.PI/2;m.rotation.z=rot||0;m.position.set(STG.x+lx,chY(y+.06),STG.z+lz);g.add(m);return m;}
function chStall(lx,lz,rot,y,cols){const b=chB(lx,lz,rot),Y=chY(y||0);boxL(VM.planks,b,-1.4,1.4,Y,Y+.9,-.7,.7,1,1);for(const sx of[-1.3,1.3])for(const sz of[-.6,.6])boxL(VM.planks,b,sx-.06,sx+.06,Y,Y+2.4,sz-.06,sz+.06,1,1);boxL(cols?CHM.red:CHM.blue,b,-1.6,1.6,Y+2.4,Y+2.55,-.9,.9,1,1);}
function chFence(x0,z0,x1,z1,y){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L/2));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,z=z0+(z1-z0)*i/n;boxL(VM.planks,chB(x,z),-.08,.08,chY(y),chY(y+1.1),-.08,.08,1,1);}
  chWall(x0,z0,x1,z1,y+.55,.14,.1,VM.planks,false);chWall(x0,z0,x1,z1,y+.9,.12,.1,VM.planks,false);}
// Vögel als kleine Schwärme
function chBirdsTick(dt,t){for(const f of CHX.birds||[]){f.x+=f.vx*dt;f.z+=f.vz*dt;for(let i=0;i<f.n;i++){const ox=Math.sin(i*2.1)*f.s*(1+i*.15),oz=Math.cos(i*1.3)*f.s,oy=Math.sin(t*3+i)*.6,fl=Math.sin(t*14+i*1.7)>0;
  fxP(f.x+ox-.3,f.y+oy+(fl?.18:0),f.z+oz,0,0,0,f.c||0x1a1a1e,.04,.32,{add:false,a:1});fxP(f.x+ox+.3,f.y+oy+(fl?.18:0),f.z+oz,0,0,0,f.c||0x1a1a1e,.04,.32,{add:false,a:1});fxP(f.x+ox,f.y+oy,f.z+oz,0,0,0,f.c||0x1a1a1e,.04,.3,{add:false,a:1});}}}
function chBirds(lx,ly,lz,vx,vz,n,c){(CHX.birds=CHX.birds||[]).push({x:STG.x+lx,y:chY(ly),z:STG.z+lz,vx,vz,n:n||7,s:1.6,c});}
// =========================================================
// Selbstlaufende Bewohner und Tiere
// =========================================================
const VILL_IDS=()=>VDEFS.filter(v=>!v.kid).map(v=>v.id);
const ANI={sheep:['an_sheep0_',.95],cow:['an_cow0_',1.5],cow2:['an_cow1_',1.5],horse:['an_horse0_',1.8],horse2:['an_horse1_',1.8],deer:['an_deer0_',1.5]};
function chWander(sp,box,o){o=o||{};const x=cr(box[0],box[1]),z=cr(box[2],box[3]);const e=cE(sp,x,z,{h:o.h,prop:o.prop,f:'0'});
  const L={e,box,spd:o.spd||cr(1.1,1.6),wait:cr(0,2.5),tx:x,tz:z,idle:o.idle||'0',walk:o.walk||['1','2'],pause:o.pause||[1,4],cheer:o.cheer,flee:o.flee};(CHX.life=CHX.life||[]).push(L);return L;}
function chVillagers(n,box,o){const ids=VILL_IDS();const R=[];for(let i=0;i<n;i++)R.push(chWander('p'+ids[(Math.random()*ids.length)|0]+'_',box,o));return R;}
function chAnimals(kind,n,box,o){const[sp,h]=ANI[kind];const R=[];for(let i=0;i<n;i++)R.push(chWander(sp,box,Object.assign({h,prop:1,spd:cr(.4,.8),pause:[2,6]},o||{})));return R;}
function chLifeTick(dt,t){for(const L of CHX.life||[]){const e=L.e;if(e.dead||e.hidden)continue;
  if(L.cheer){e.frame='0';cMv(e,e.lx,e.lz,null,Math.abs(Math.sin(t*6+e.ph))*.25);continue;}
  if(L.flee){e.lx+=L.flee[0]*dt;e.lz+=L.flee[1]*dt;cMv(e,e.lx,e.lz,L.walk[Math.floor(t*10+e.ph)%2]);e.flip=L.flee[0]<0;continue;}
  if(L.wait>0){L.wait-=dt;e.frame=L.idle;if(L.wait<=0){L.tx=cr(L.box[0],L.box[1]);L.tz=cr(L.box[2],L.box[3]);}continue;}
  const dx=L.tx-e.lx,dz=L.tz-e.lz,d=Math.hypot(dx,dz);if(d<.3){L.wait=cr(L.pause[0],L.pause[1]);continue;}
  const s=Math.min(d,L.spd*dt);cMv(e,e.lx+dx/d*s,e.lz+dz/d*s,L.walk[Math.floor(t*L.spd*3.5+e.ph)%2]);e.flip=dx<0;}}
// =========================================================
// Kämpfe: Paare, Schläge, Treffer, Gefallene, Bogenschützen
// =========================================================
function chBattle(A,B,o){o=o||{};const bat=CHX.bat=CHX.bat||{list:[],arrows:[],snd:0};
  const add=(L,side,arch)=>L.forEach((e,i)=>{e.side=side;e.hp=o.hp||(2+((Math.random()*3)|0));e.cd=cr(.2,1);e.spd=o.spd||cr(2.6,3.6);e.tgt=null;e.arch=arch&&i%arch===0;e.hold=o.hold&&o.hold[side];bat.list.push(e);});
  add(A,0,o.archA);add(B,1,o.archB);return bat;}
function chKill(e){if(e.dead)return;e.dead=true;e.deadT=0;e.fallDir=Math.random()<.5?-1:1;e.d=Object.assign({},e.d,{eyes:null});fxDust(e.x,e.z,6,.8,{size:.4});}
function chBattleTick(dt,t){const B=CHX.bat;if(!B)return;const L=B.list;B.snd-=dt;
  for(const e of L){if(e.dead)continue;if(!e.tgt||e.tgt.dead||Math.random()<dt*.3){let best=null,bd=1e9;for(let k=0;k<10;k++){const c=L[(Math.random()*L.length)|0];if(!c||c.dead||c.side===e.side)continue;const d=Math.hypot(c.lx-e.lx,c.lz-e.lz);if(d<bd){bd=d;best=c;}}if(best)e.tgt=best;}
    const T=e.tgt;if(!T){e.frame='0';continue;}const dx=T.lx-e.lx,dz=T.lz-e.lz,d=Math.hypot(dx,dz)||.01;e.flip=dx<0;
    if(e.arch){e.cd-=dt;e.frame=e.cd<.35?'u':'0';if(e.cd<=0&&d<70){e.cd=cr(1.4,2.4);const tt=Math.min(1.6,.5+d*.025);B.arrows.push({x:e.x,y:e.y+1.6,z:e.z,vx:(T.x-e.x)/tt,vz:(T.z-e.z)/tt,vy:(T.y+1.2-e.y-1.6)/tt+4.9*tt,t:0,T:tt,tg:T});}continue;}
    if(d>1.25){if(e.hold){e.frame='0';continue;}const s=Math.min(d-1.1,e.spd*dt);cMv(e,e.lx+dx/d*s,e.lz+dz/d*s,cWalk(e,t,9));continue;}
    e.cd-=dt;e.frame=e.cd<.22?'u':(e.cd<.4?'0':'p');
    if(e.cd<=0){e.cd=cr(.55,1.15);e.frame='p';const mx=(e.x+T.x)/2,mz=(e.z+T.z)/2;fxSparks(mx,e.y+1.2,mz,8,{});T.hurt=.08;T.hp-=1;if(B.snd<=0){B.snd=.18;sfx(()=>Snd.clank(.12+Math.random()*.1));}if(T.hp<=0)chKill(T);}}
  for(let i=B.arrows.length-1;i>=0;i--){const a=B.arrows[i];a.t+=dt;a.vy-=9.8*dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;fxP(a.x,a.y,a.z,0,0,0,0x2a1a0e,.05,.16,{add:false,a:1});fxP(a.x-a.vx*.02,a.y-a.vy*.02,a.z-a.vz*.02,0,0,0,0x5a4030,.05,.12,{add:false,a:1});
    if(a.t>=a.T){B.arrows.splice(i,1);if(a.tg&&!a.tg.dead&&Math.random()<.4){a.tg.hurt=.16;a.tg.hp-=1;if(a.tg.hp<=0)chKill(a.tg);}fxDust(a.x,a.z,2,.3,{size:.2});}}}
function chEntTick(dt){for(const e of CHX.ents){if(e.dead)e.deadT=(e.deadT||0)+dt;if(e.hurt>0)e.hurt-=dt;}}
// =========================================================
// Seeschlacht: Kanonenkugeln, Brandpfeile, Treffer, Brände, sinkende Schiffe
// =========================================================
const _cv=new THREE.Vector3();
function chSeaShip(g,side,o){o=o||{};const S=CHX.sea=CHX.sea||{ships:[],balls:[],snd:0};const raid=!!o.raid,L=raid?13:16,W=raid?3.8:4.6;
  const ports=[];if(!raid){const n=o.war?5:3;for(let i=0;i<n;i++)for(const s of[-1,1])ports.push([-L*.35+i*L*(o.war?.17:.3),o.war?1.6:1.9,s*(W/2+.5)]);}else for(let i=0;i<4;i++)for(const s of[-1,1])ports.push([-4+i*2.6,2.6,s*1.9]);
  const sh={g,side,hp:o.hp||5,sink:0,fires:[],crew:[],ports,raid,L,W,cd:cr(.3,1.6),vx:o.vx||0,vz:o.vz||0,y0:o.y0||0,rate:o.rate||1};g.visible=true;g.rotation.set(0,g.rotation.y,0);S.ships.push(sh);
  if(o.crew){for(let i=0;i<o.crew;i++){const sp=raid?'ch_pl'+(i%4)+'_':'ch_sky'+(i%3)+'_';const e=cE(sp,0,0,{f:raid?'u':'0'});e.deck=[-L*.35+i*(L*.7/Math.max(1,o.crew-1)),(Math.random()-.5)*W*.5];sh.crew.push(e);}}
  return sh;}
function chShipLocal(sh,x,y,z){_cv.set(x,y,z);sh.g.updateMatrixWorld();return sh.g.localToWorld(_cv).clone();}
function chFire(sh,tg){const S=CHX.sea;const tp=tg.g.position;sh.g.updateMatrixWorld();const inv=new THREE.Matrix4().copy(sh.g.matrixWorld).invert(),lt=new THREE.Vector3(tp.x,tp.y,tp.z).applyMatrix4(inv),side=lt.z>0?1:-1;
  for(const p of sh.ports){if(Math.sign(p[2])!==side)continue;const w=chShipLocal(sh,p[0],p[1],p[2]);const miss=Math.random()<.35,tx=tp.x+cr(-tg.L*.4,tg.L*.4)+(miss?cr(-9,9):0),tz=tp.z+(miss?cr(-8,8):cr(-1,1)),ty=tp.y+cr(1,3);
    const T=Math.max(.6,Math.min(1.8,Math.hypot(tx-w.x,tz-w.z)/42))*cr(.9,1.1),fire=sh.raid;
    S.balls.push({x:w.x,y:w.y,z:w.z,vx:(tx-w.x)/T,vz:(tz-w.z)/T,vy:(ty-w.y)/T+4.9*T,t:0,T:T*1.6,tg,fire,dl:cr(0,.25)});
    if(!fire){fxBurst(w.x,w.y,w.z,10,[0xffffff,0xfff0a0,0xff9a30],5,.2,.45,{});fxP(w.x,w.y+.3,w.z,side*.6,.6,0,[0xd0d0d0,0xa8a8a8],2.4,1.8,{add:false,s1:4.5,a:.6});}}
  if(S.snd<=0){S.snd=.25;sfx(()=>Snd.boom(fire?.06:.14));}}
function chHitShip(tg,x,y,z,fire){fxBurst(x,y,z,26,[0x6a4420,0x8a6a40,0x3a2410],7,.9,.35,{up:3,g:9,add:false});fxBurst(x,y,z,18,[0xff8a20,0xffd060],6,.4,.6,{});
  tg.g.updateMatrixWorld();const lp=tg.g.worldToLocal(new THREE.Vector3(x,y,z));if(tg.fires.length<5)tg.fires.push([lp.x,Math.max(1.6,lp.y),lp.z]);tg.hp-=fire?.5:1;if(tg.hp<=0&&!tg.sink){tg.sink=.01;sfx(()=>Snd.boom(.25));}}
function chSeaTick(dt,t){const S=CHX.sea;if(!S)return;S.snd-=dt;const wy=chY(.15);
  for(const sh of S.ships){if(!sh.g.visible)continue;const g=sh.g;g.position.x+=sh.vx*dt;g.position.z+=sh.vz*dt;
    if(sh.sink>0){sh.sink+=dt;g.position.y=chY(sh.y0)-sh.sink*sh.sink*.5;g.rotation.z=Math.min(.6,sh.sink*.18);g.rotation.x=Math.min(.35,sh.sink*.1);
      if(Math.random()<dt*14)fxP(g.position.x+cr(-5,5),wy,g.position.z+cr(-3,3),0,cr(1,2.5),0,[0xe8f4f8,0xb8d8e8],.8,.5,{add:false,g:3});if(Math.random()<dt*4)fxP(g.position.x+cr(-7,7),wy+.1,g.position.z+cr(-5,5),cr(-.5,.5),0,cr(-.5,.5),0x5a3a1c,3,.6,{add:false});}
    else{g.position.y=chY(sh.y0)+Math.sin(t*1.3+g.position.x)*.18;g.rotation.z=Math.sin(t*.9+g.position.x)*.03;
      if(Math.random()<dt*6)fxP(g.position.x+cr(-sh.L/2,sh.L/2),wy,g.position.z+(Math.random()<.5?-1:1)*sh.W*.55,0,.3,0,0xe8f4f8,.9,.35,{add:false,a:.7});}
    for(const f of sh.fires)if(Math.random()<dt*16){const w=chShipLocal(sh,f[0]+cr(-.5,.5),f[1],f[2]);fxP(w.x,w.y,w.z,cr(-.3,.3),cr(2,4),cr(-.3,.3),[0xff6a10,0xffb030,0xffe080],.8,.8,{s1:.2});if(Math.random()<.3)fxP(w.x,w.y+1.5,w.z,0,cr(1.5,3),0,0x2a2026,2.4,1.5,{add:false,s1:3.5,a:.55});}
    for(const e of sh.crew){if(e.dead){continue;}const w=chShipLocal(sh,e.deck[0],2.3,e.deck[1]);e.x=w.x;e.y=w.y;e.z=w.z;if(sh.sink>.8&&!e.hidden){e.hidden=true;fxBurst(w.x,wy,w.z,8,[0xe8f4f8],3,.6,.4,{up:2,add:false});}else if(!sh.sink)e.frame=Math.floor(t*3+e.ph)%2?'u':'p';}
    if(!sh.sink&&sh.rate>0){sh.cd-=dt;if(sh.cd<=0){sh.cd=cr(1.4,2.4)/sh.rate;const en=S.ships.filter(o=>o.side!==sh.side&&!o.sink&&o.g.visible);if(en.length)chFire(sh,en[(Math.random()*en.length)|0]);}}}
  for(let i=S.balls.length-1;i>=0;i--){const b=S.balls[i];if(b.dl>0){b.dl-=dt;continue;}b.t+=dt;b.vy-=9.8*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
    if(b.fire){fxP(b.x,b.y,b.z,0,0,0,[0xff8a20,0xffd060],.08,.35,{});}else{fxP(b.x,b.y,b.z,0,0,0,0x18181a,.04,.42,{add:false,a:1});if(Math.random()<.6)fxP(b.x,b.y,b.z,0,.2,0,0xb8b8b8,.5,.3,{add:false,s1:.8,a:.4});}
    const tg=b.tg;let hit=false;if(tg&&tg.g.visible&&!tg.sink){tg.g.updateMatrixWorld();const lp=tg.g.worldToLocal(new THREE.Vector3(b.x,b.y,b.z));if(Math.abs(lp.x)<tg.L/2+1&&Math.abs(lp.z)<tg.W/2+.5&&lp.y<5&&lp.y>-1)hit=true;}
    if(hit){S.balls.splice(i,1);chHitShip(tg,b.x,b.y,b.z,b.fire);continue;}
    if(b.y<=wy||b.t>b.T){S.balls.splice(i,1);if(b.y<=wy+.5){fxBurst(b.x,wy,b.z,22,[0xe8f4f8,0xc8e4f0,0xffffff],5,1,.5,{up:7,g:12,add:false});fxRing(b.x,wy+.1,b.z,14,[0xe8f4f8],3,.8,.4,{add:false});}}}}
// =========================================================
// Gemalte Weltkarte von Kriesa (vereint sich, brennt, zerfällt)
// =========================================================
const MW=480,MH=270;
const MLOC={sky:[232,138,'Skyroad'],sturm:[246,44,'Sturmburg'],coda:[214,186,'Coda'],butzi:[402,150,'Butzi'],hammer:[128,116,'Hammerhausen'],aether:[338,88,'Aetherberg'],creep:[136,200,'Creeperia']};
const MREG=[[232,138],[246,48],[214,190],[388,150],[130,118],[338,92],[140,204],[300,196],[180,72],[86,160],[300,128],[360,206],[170,150],[270,90]];
const MREGC=[[200,96,80],[150,120,70],[110,150,90],[180,150,60],[120,110,150],[170,90,120],[90,130,140],[160,140,110],[140,90,70],[110,100,80],[150,160,100],[190,120,90],[100,140,110],[170,130,140]];
function chMapBase(){if(CHX.mapBase)return CHX.mapBase;const land=new Uint8Array(MW*MH),reg=new Uint8Array(MW*MH),mt=new Uint8Array(MW*MH),wn=new Float32Array(MW*MH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const ex=(x-240)/205,ey=(y-135)/112,d=Math.hypot(ex,ey),n=fbm(x*.018,y*.018,4,77)-.5,n2=fbm(x*.05,y*.05,2,78)-.5;
    const i=y*MW+x;land[i]=d+n*.55+n2*.12<1?1:0;let b=0,bd=1e9;MREG.forEach((c,k)=>{const dd=Math.hypot(x-c[0],y-c[1])+(fbm(x*.04,y*.04,2,79)-.5)*28;if(dd<bd){bd=dd;b=k;}});reg[i]=b;
    mt[i]=land[i]&&fbm(x*.03+9,y*.03,3,80)>.6?1:0;wn[i]=(fbm(x*.05,y*.05,2,84)-.5)*30;}
  // Sturmburg-Halbinsel im Norden sicherstellen
  for(let y=30;y<70;y++)for(let x=226;x<268;x++)if(Math.hypot((x-246)/20,(y-48)/22)<1)land[y*MW+x]=1;
  const cv=document.createElement('canvas');cv.width=MW;cv.height=MH;const c=cv.getContext('2d'),img=c.createImageData(MW,MH),d=img.data;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x,j=i*4,pn=(hash2(x,y,81)-.5)*14,L=land[i];let col;
    if(L){let coast=false;for(const[ox,oy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+ox,yy=y+oy;if(xx<0||yy<0||xx>=MW||yy>=MH||!land[yy*MW+xx])coast=true;}
      col=coast?[96,72,44]:mt[i]?[170,150,118]:[214,196,150];if(!coast&&!mt[i]&&fbm(x*.06,y*.06,2,82)>.62)col=[176,180,128];}
    else{let dc=99;for(let r=1;r<6&&dc===99;r++)for(const[ox,oy]of[[r,0],[-r,0],[0,r],[0,-r]]){const xx=x+ox,yy=y+oy;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&land[yy*MW+xx]){dc=r;break;}}
      col=dc<99?[150-dc*6,172-dc*4,170-dc*3]:[118,150,156];if(((x+Math.round(Math.sin(y*.3)*3))%14===0)&&y%6===0)col=[160,186,186];}
    const e=Math.min(x,y,MW-1-x,MH-1-y),v=e<14?(14-e)*5:0;d[j]=Math.max(0,col[0]+pn-v);d[j+1]=Math.max(0,col[1]+pn-v*1.1);d[j+2]=Math.max(0,col[2]+pn-v*1.3);d[j+3]=255;}
  c.putImageData(img,0,0);
  // Gebirge und Wälder als kleine Zeichen
  const R=mulberry32(83);for(let k=0;k<420;k++){const x=(R()*MW)|0,y=(R()*MH)|0,i=y*MW+x;if(!land[i])continue;
    if(mt[i]){c.fillStyle='#6a5a44';c.beginPath();c.moveTo(x-4,y+3);c.lineTo(x,y-3);c.lineTo(x+4,y+3);c.fill();c.fillStyle='#e8e0cc';c.fillRect(x-1,y-2,2,1);}
    else if(fbm(x*.06,y*.06,2,82)>.6){c.fillStyle='#4e6a3a';c.fillRect(x-1,y-2,3,3);c.fillStyle='#3a2a18';c.fillRect(x,y+1,1,1);}}
  // Kompassrose
  c.strokeStyle='#6a4a28';c.fillStyle='#6a4a28';c.beginPath();c.arc(440,235,12,0,7);c.stroke();c.beginPath();c.moveTo(440,219);c.lineTo(443,235);c.lineTo(440,251);c.lineTo(437,235);c.fill();
  c.font="bold 8px 'Pixelify Sans',serif";c.fillText('N',437,214);
  const li=[],bl=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(!land[i])continue;li.push(i);if(x>0&&y>0){const r=reg[i],r1=reg[i-1],r2=reg[i-MW];if(r1!==r||r2!==r)bl.push(i,r,r1===r?r2:r1);}}
  return CHX.mapBase={cv,land,reg,wn,li:Int32Array.from(li),bl:Int32Array.from(bl)};}
function chMapDom(){let cv=$('chMapCv');if(cv)return cv;cv=document.createElement('canvas');cv.id='chMapCv';cv.width=MW;cv.height=MH;const f=$('film');f.insertBefore(cv,f.querySelector('.fb'));
  const st=document.createElement('style');st.textContent='#chMapCv{position:absolute;left:0;top:11vh;width:100%;height:78vh;image-rendering:pixelated;opacity:0;transition:opacity .6s;object-fit:contain;background:#1a120a}#chMapCv.on{opacity:1}';document.head.appendChild(st);return cv;}
function chMapShow(on){const cv=chMapDom();cv.classList.toggle('on',!!on);CHX.mapOn=!!on;}
function chMapLabel(c,x,y,txt,col,size,a){c.globalAlpha=a==null?1:a;c.font=`bold ${size||8}px 'Pixelify Sans',serif`;c.textAlign='center';c.fillStyle='rgba(240,230,200,.7)';c.fillText(txt,x+1,y+1);c.fillStyle=col||'#3a2410';c.fillText(txt,x,y);c.globalAlpha=1;c.textAlign='left';}
function chMapCity(c,x,y,col,r){c.fillStyle='#2a1a0c';c.fillRect(x-(r||2)-1,y-(r||2)-1,(r||2)*2+3,(r||2)*2+3);c.fillStyle=col||'#c8281e';c.fillRect(x-(r||2),y-(r||2),(r||2)*2+1,(r||2)*2+1);}
// mode: 'unite' | 'war' | 'split'; k: 0..1 Fortschritt; t: Zeit
function chMapDraw(mode,k,t){const cv=chMapDom(),c=cv.getContext('2d'),B=chMapBase();c.imageSmoothingEnabled=false;c.drawImage(B.cv,0,0);
  const ov=c.getImageData(0,0,MW,MH),d=ov.data,cap=MREG[0];const md=Math.max(...MREG.map(r=>Math.hypot(r[0]-cap[0],r[1]-cap[1])));
  const SKY=[36,84,224],ALT=[120,60,160],AET=[200,60,40],STU=[150,30,24],GRN=[80,140,70],BRN=[150,110,60];
  const regCol=r=>{if(mode==='unite'){const kr=Math.hypot(MREG[r][0]-cap[0],MREG[r][1]-cap[1])/md*.75;const q=Math.max(0,Math.min(1,(k-kr)/.18));return[MREGC[r],SKY,q];}
    if(mode==='war')return[SKY,SKY,1];
    const x=MREG[r][0],y=MREG[r][1];let to=x<236+Math.sin(y*.05)*14?ALT:AET;if(r===1)to=STU;if(r===9)to=GRN;if(r===11)to=BRN;const q=Math.max(0,Math.min(1,(k-.15-(r%5)*.05)/.25));return[SKY,to,q];};
  const RC=MREG.map((_,r)=>regCol(r));
  const RG=new Float32Array(MREG.length*3);RC.forEach(([a,b,q],r)=>{for(let k=0;k<3;k++)RG[r*3+k]=a[k]+(b[k]-a[k])*q;});const al=.5,war=mode==='war',WP=[[402,150,0],[380,214,.15],[300,236,.3],[420,96,.4],[100,190,.55]];
  for(const i of B.li){const r=B.reg[i],j=i*4;d[j]=d[j]*(1-al)+RG[r*3]*al;d[j+1]=d[j+1]*(1-al)+RG[r*3+1]*al;d[j+2]=d[j+2]*(1-al)+RG[r*3+2]*al;
    if(war){const x=i%MW,y=(i/MW)|0;let w=0;for(const[px,py,t0]of WP){const rr=Math.max(0,(k-t0))*170;if(!rr)continue;const dd=Math.hypot(x-px,y-py)+B.wn[i];if(dd<rr)w=Math.max(w,Math.min(1,(rr-dd)/25));}
      if(w>0){const a2=.45*w;d[j]=d[j]*(1-a2)+170*a2;d[j+1]=d[j+1]*(1-a2)+30*a2;d[j+2]=d[j+2]*(1-a2)+20*a2;}}}
  for(let n=0;n<B.bl.length;n+=3){const i=B.bl[n],r=B.bl[n+1],o=B.bl[n+2],A=RC[r],O=RC[o];
    const show=!(mode==='unite'&&A[2]>=1&&O[2]>=1)&&!war&&!(mode==='split'&&A[2]>0&&O[2]>0&&A[1]===O[1]);if(!show)continue;const j=i*4;d[j]=d[j]*.3+40*.7;d[j+1]=d[j+1]*.3+28*.7;d[j+2]=d[j+2]*.3+20*.7;}
  c.putImageData(ov,0,0);
  if(mode==='split'){const q=Math.min(1,k*1.6);c.strokeStyle='#1a0a04';c.lineWidth=2;c.beginPath();let first=true;for(let y=20;y<20+q*230;y+=4){const x=236+Math.sin(y*.05)*14+(hash2(y,3,85)-.5)*8;if(first){c.moveTo(x,y);first=false;}else c.lineTo(x,y);}c.stroke();}
  // Städte
  for(const k2 in MLOC){const[x,y,n]=MLOC[k2];if(k2==='creep'&&mode==='split'){c.strokeStyle='#1a0a04';c.lineWidth=2;c.beginPath();c.moveTo(x-4,y-4);c.lineTo(x+4,y+4);c.moveTo(x+4,y-4);c.lineTo(x-4,y+4);c.stroke();chMapLabel(c,x,y+13,n+' (gefallen)','#3a0a04',7);continue;}
    chMapCity(c,x,y,k2==='sky'?'#f0c840':k2==='sturm'?'#b42a1e':'#e8e0cc',k2==='sky'?3:2);chMapLabel(c,x,y+12,n,'#2a1604',k2==='sky'?9:7);}
  if(mode==='unite'){const p=.5+.5*Math.sin(t*5);c.strokeStyle=`rgba(240,200,64,${.4+p*.5})`;c.lineWidth=1;c.beginPath();c.arc(MLOC.sky[0],MLOC.sky[1],6+p*3+k*10,0,7);c.stroke();
    chMapLabel(c,240,24,'KRIESA','#2a1604',16);if(k>.55)chMapLabel(c,240,40,'Das Königreich Skyroad','#1a2a70',10,Math.min(1,(k-.55)*4));}
  if(mode==='war'){chMapLabel(c,240,24,'DER PLÜNDERERKRIEG','#5a0a04',14);
    for(let i=0;i<5;i++){const a=Math.min(1,Math.max(0,k*1.3-i*.12));const sx=470,sy=110+i*28,ex=402-i*6,ey=150+(i-2)*22;const px=sx+(ex-sx)*a,py=sy+(ey-sy)*a;
      c.fillStyle='#5a0a04';c.fillRect(px-3,py-1,7,3);c.fillStyle='#c8281e';c.fillRect(px-1,py-5,3,4);}
    const F=[[402,150],[128,116],[338,88],[136,200],[300,196],[214,186],[270,90],[180,72],[360,206]];F.forEach(([x,y],i)=>{if(k<.15+i*.08)return;const fl=Math.sin(t*12+i)*1.5;c.fillStyle='#ff8a20';c.fillRect(x+6,y-6-fl,3,4+fl);c.fillStyle='#ffd060';c.fillRect(x+7,y-4,1,2);
      if(i%2===0){c.strokeStyle='#2a1604';c.beginPath();c.moveTo(x-10,y-10);c.lineTo(x-4,y-4);c.moveTo(x-4,y-10);c.lineTo(x-10,y-4);c.stroke();}});}
  if(mode==='split'){if(k>.3)chMapLabel(c,140,96,'ALTONARIEN','#3a1050',13,Math.min(1,(k-.3)*4));if(k>.52){chMapLabel(c,352,128,'AETHERBERGISCHES','#6a1408',11,Math.min(1,(k-.52)*4));chMapLabel(c,352,141,'KAISERREICH','#6a1408',11,Math.min(1,(k-.52)*4));}
    chMapLabel(c,240,24,'Skyroad zerbricht','#2a1604',14);}
  // Papierrand
  c.strokeStyle='#5a3a18';c.lineWidth=3;c.strokeRect(4,4,MW-8,MH-8);c.strokeStyle='#c8a868';c.lineWidth=1;c.strokeRect(9,9,MW-18,MH-18);}
// =========================================================
// Detailreiche Kulissen (ersetzen die einfachen Versionen)
// =========================================================
function chPlants(list,hfn,n,r0,r1,seed,avoid,kinds){chScatter(list,n,r0,r1,hfn,(x,z,R)=>{if(avoid&&avoid(x,z))return null;const k=(kinds||SMALL)[(R()*(kinds||SMALL).length)|0];return{spr:k,h:k.startsWith('bush')?1.2+R()*.8:k.startsWith('fern')?.9:.5+R()*.4,sway:.04};},seed);}
function chRing(list,hfn,r0,r1,n,seed,kinds,avoid){const R=mulberry32(seed);for(let i=0;i<n;i++){const a=R()*6.283,d=r0+(r1-r0)*R(),x=Math.cos(a)*d,z=Math.sin(a)*d;if(avoid&&avoid(x,z))continue;const k=(kinds||TREES)[(R()*(kinds||TREES).length)|0];list.push({lx:x,lz:z,y:hfn(x,z)-.1,spr:k,h:k.startsWith('pine')?7+R()*6:5+R()*4.5,sway:.05});}}
const _old=Object.assign({},CH_SETS);
CH_SETS.hill=function(){const g=new THREE.Group(),M=chMats(),mound=(x,z)=>{const d=Math.hypot(x,z);return d<26?5:d<40?5*(40-d)/14:0;},hfn=(x,z)=>Math.max(mound(x,z),chRoll(x,z,70,46,11));
  chTerrain(g,M.tex.grass,1000,150,hfn);chMound(g,0,0,40,26,5,M.grass,24,.08);
  for(let i=0;i<12;i++){const a=i/12*6.283,b=chB(Math.cos(a)*10,Math.sin(a)*10,-a);boxL(VM.stone,b,-.7,.7,chY(5),chY(5+3.2+(i%3)*.5),-.5,.5,1,1);}
  boxL(VM.stone,chB(0,0),-1.6,1.6,chY(5),chY(5.9),-1,1,1,1);chFlush(g);chFar(g,9,380,110,1);
  const L=[];chRing(L,hfn,48,170,260,12);chPlants(L,hfn,500,12,90,13,(x,z)=>Math.hypot(x,z)<12);chDeco(g,L);chClouds(g,12,14);
  return{g,hAt:(x,z)=>(Math.abs(x)<1.6&&Math.abs(z)<1)?5.9:hfn(x,z)};};
CH_SETS.plain=function(){const S=_old.plain(),g=S.g,M=chMats();g.children[0].visible=false;const hfn=(x,z)=>(Math.abs(x)<55&&z>-170&&z<120)?0:chRoll(x,z,90,40,21);chTerrain(g,M.tex.grass,1100,150,hfn);
  const cols=[['#c8a83a','#a88a2a'],['#6a8a3a','#56742c'],['#8a6a3a','#6a5028'],['#d0b850','#b09838']];
  [[-30,30,24,30,0],[-30,70,24,30,0],[30,40,22,40,0],[32,85,24,28,0],[-34,110,26,24,.1],[34,-30,18,30,0],[-34,-30,18,30,0]].forEach(([x,z,w,d,r],i)=>chField(g,x,z,w,d,r,0,cols[i%4]));
  chWindmill(g,-52,58,0,.6);chWindmill(g,54,10,0,-.8);chHouse(-50,40,6,5,1,.3,VM.fach,VM.thatch);chHouse(48,26,6,5,1,-.2,VM.fach,VM.thatch);chHouse(46,100,7,5,1,.1,VM.planks,VM.thatch);
  chFence(-18,14,-18,128,0);chFence(18,14,18,128,0);chFlush(g);
  const L=[];for(const[x,z,w,d]of[[-30,30,24,30],[-30,70,24,30],[32,85,24,28]])for(let i=0;i<60;i++)L.push({lx:x+cr(-w/2,w/2),lz:z+cr(-d/2,d/2),y:0,spr:'wheat'+((i%3)),h:.8,sway:.06});
  chRing(L,hfn,140,260,260,22);chForest(L,hfn,-90,140,40,60,23);chForest(L,hfn,100,-20,40,50,24);for(let z=0;z<130;z+=7){L.push({lx:-22,lz:z,y:0,spr:TREES[(z/7|0)%5],h:5.5});L.push({lx:22,lz:z+3,y:0,spr:TREES[(z/7|0+2)%5],h:5});}
  chPlants(L,hfn,700,20,180,25,(x,z)=>Math.abs(x)<8);chDeco(g,L);chClouds(g,14,26);S.hAt=hfn;return S;};
CH_SETS.coast=function(){const S=_old.coast(),g=S.g,M=chMats();g.children[1].visible=false;g.children[2].visible=false;
  const hfn=(x,z)=>z<-14?-3:z<0?.6+z*.09:z<60?.6:.6+chRoll(x,z-60,0,40,31)+Math.max(0,(z-60)*.06);chTerrain(g,M.tex.sand,1100,160,hfn,(x,z,h)=>z>70?-.15:0);
  chStall(-8,36,0,.6,1);chStall(-2,36,0,.6,0);chStall(4,36,0,.6,1);
  for(const[x,z]of[[-34,14],[22,14],[34,34]]){const b=chB(x,z);boxL(VM.planks,b,-.06,.06,chY(.6),chY(2.4),-1.5,-1.4,1,1);boxL(VM.planks,b,-.06,.06,chY(.6),chY(2.4),1.4,1.5,1,1);}
  chFlush(g);const L=[];chRing(L,hfn,90,240,220,32,['pine0','pine1','pine2','birch0','oak1'],(x,z)=>z<70);chPlants(L,hfn,400,10,160,33,(x,z)=>z<4,['grass0','grass1','reed0','reed1','bush0','flower1']);
  for(let i=0;i<30;i++)L.push({lx:cr(-80,80),lz:cr(-12,-2),y:hfn(0,-6),spr:'rock'+(i%2),h:cr(.6,1.4)});
  chDeco(g,L);chClouds(g,14,34);S.hAt=hfn;return S;};
CH_SETS.hammer=function(){const S=_old.hammer(),g=S.g,M=chMats();g.children[0].visible=false;const hfn=(x,z)=>chRoll(x,z,60,40,41);chTerrain(g,M.tex.mud,1000,140,hfn);
  chWindmill(g,-62,-40,hfn(-62,-40),.4);chField(g,60,40,26,30,.2,hfn(60,40),['#6a8a3a','#56742c']);chField(g,-60,30,24,26,0,hfn(-60,30),['#c8a83a','#a88a2a']);
  chStall(-4,-12,0,0,1);chStall(4,-12,0,0,0);for(let i=0;i<5;i++){const b=chB(-14+i*1.4,-4);boxL(VM.planks,b,-.5,.5,chY(0),chY(1),-.5,.5,1,1);}chFlush(g);
  const L=[];chRing(L,hfn,75,220,280,42);chForest(L,hfn,-70,80,45,70,43,['pine0','pine1','pine2']);chPlants(L,hfn,500,8,140,44,(x,z)=>Math.hypot(x,z)<46&&Math.hypot(x,z)>14);
  chDeco(g,L);chClouds(g,12,45);S.hAt=hfn;return S;};
CH_SETS.aether=function(){const S=_old.aether(),g=S.g,M=chMats();g.children[0].visible=false;g.children[1].visible=false;const cz=-70,base=S.hAt,hfn=(x,z)=>Math.max(base(x,z),chRoll(x,z-cz,110,50,51));chTerrain(g,M.tex.grass,1100,220,hfn,(x,z,h)=>h>6&&Math.hypot(x,z-cz)<90?-.45:0);
  for(let i=0;i<7;i++){const a=.6+i*.32,x=Math.cos(a)*100,z=cz+Math.sin(a)*100;chHouse(x,z,6,5,1,-a,VM.fach,M.red,{y:hfn(x,z)});}
  chField(g,60,10,30,26,.3,hfn(60,10),['#c8a83a','#a88a2a']);chField(g,-60,20,28,24,-.2,hfn(-60,20),['#6a8a3a','#56742c']);chWindmill(g,80,40,hfn(80,40),-.6);chFlush(g);
  const L=[];chRing(L,hfn,95,260,300,52,['pine0','pine1','pine2','birch0']);chPlants(L,hfn,600,40,200,53,(x,z)=>Math.hypot(x,z-cz)<88);
  for(let i=0;i<40;i++){const a=i/40*6.283,r=60+cr(0,20),x=Math.cos(a)*r,z=cz+Math.sin(a)*r;L.push({lx:x,lz:z,y:hfn(x,z),spr:i%3?'pine'+(i%3):'lrock',h:i%3?6:2});}
  chDeco(g,L);chClouds(g,14,54);S.hAt=hfn;return S;};
CH_SETS.creep=function(){const S=_old.creep(),g=S.g,M=chMats();g.children[0].visible=false;const hfn=(x,z)=>chRoll(x,z+90,150,45,61);chTerrain(g,M.tex.grass,1200,150,hfn);
  [[-110,-40,40,30,0],[-120,0,40,30,.1],[110,-60,40,30,0],[120,-10,30,30,-.1]].forEach(([x,z,w,d,r],i)=>chField(g,x,z,w,d,r,hfn(x,z),i%2?['#c8a83a','#a88a2a']:['#6a8a3a','#56742c']));
  chWindmill(g,-100,30,hfn(-100,30),.3);chWindmill(g,96,24,hfn(96,24),-.4);for(let i=0;i<6;i++)chStall(-10+i*4,-118+(i%2)*28,i%2?Math.PI:0,0,i%2);chFlush(g);
  const L=[];chRing(L,hfn,190,320,260,62);for(let gx=-5;gx<=5;gx++)for(const z of[-36,-72,-108,-144])L.push({lx:gx*12+6,lz:z,y:0,spr:'oak'+(gx&1),h:4});chPlants(L,hfn,500,150,260,63);
  chDeco(g,L);chClouds(g,14,64);S.hAt=hfn;return S;};
CH_SETS.field=function(){const S=_old.field(),g=S.g,M=chMats();g.children[0].visible=false;const base=S.hAt,hfn=(x,z)=>Math.max(base(x,z),chRoll(x,z+20,110,40,71));chTerrain(g,M.tex.mud,1100,150,hfn,(x,z)=>vnoise(x*.05,z*.05,72)>.6?.12:0);
  const L=[];chRing(L,hfn,120,280,220,73,['oak0','oak1','pine0','birch1','dpine']);chPlants(L,hfn,600,30,200,74,null,['grass0','grass1','grass2','dshrub','bush1']);
  for(let i=0;i<14;i++){const a=i/14*6.283,x=Math.cos(a)*80,z=-20+Math.sin(a)*70;L.push({lx:x,lz:z,y:hfn(x,z),spr:i%2?'ctent':'campfire',h:i%2?2.6:.8});}
  for(let i=0;i<10;i++){const x=cr(-60,60),z=cr(-100,40);L.push({lx:x,lz:z,y:hfn(x,z),spr:'dead',h:4});}chDeco(g,L);chClouds(g,12,75);S.hAt=hfn;return S;};
CH_SETS.sea=function(){const S=_old.sea(),g=S.g,M=chMats();for(const[x,z,r,h]of[[-120,-160,30,14],[150,-140,40,20],[-200,40,50,28],[90,-260,26,10]]){chMound(g,x,z,r,r*.3,h,VM.stone,10,.3);}
  const L=[];for(const[x,z,r,h]of[[-120,-160,30,14],[150,-140,40,20],[-200,40,50,28]])chForest(L,()=>0,x,z,r*.3,10,81+x,['pine0','pine1']);L.forEach(b=>{const I=[[-120,-160,14],[150,-140,20],[-200,40,28]].find(q=>Math.hypot(b.lx-q[0],b.lz-q[1])<20);b.y=I?I[2]:0;});
  chDeco(g,L);chClouds(g,16,82);return S;};
// ---------- Takt für alles Lebendige ----------
{const a=chClear;chClear=function(){a();FXL.length=0;CHX.life=[];CHX.bat=null;CHX.birds=[];if(CHX.sea){CHX.sea.balls=[];CHX.sea.ships=[];}CHX.tmp=[];if(CHX.mapOn)chMapShow(false);};}
function chWorldTick(dt,t){const S=CHX.sets[CHX.cur];if(S&&S.g.visible){const u=S.g.userData,night=FLAGS.clock>20*60+15||FLAGS.clock<5*60+40||!!FLAGS.moonForce;if(u.clouds)for(const c of u.clouds){c.visible=!night;c.position.x+=dt*2.5;if(c.position.x>STG.x+350)c.position.x-=700;}if(u.spin)for(const h of u.spin)h.rotation.z+=dt*1.4;}
  chLifeTick(dt,t);chBattleTick(dt,t);chSeaTick(dt,t);chBirdsTick(dt,t);chEntTick(dt);if(CHX.map&&CHX.mapOn&&Math.abs(FILM.t-(CHX.mapT||-9))>.05){CHX.mapT=FILM.t;chMapDraw(CHX.map.mode,CHX.map.k(FILM.t),FILM.t);}}
{const a=chFxTick;chFxTick=function(dt){a(dt);try{chWorldTick(dt,FILM.t);}catch(e){console.error('Chronik-Welt',e);}};}
// Musik: das Lied aus dem Wald
{const a=CHRON_FILM.start;CHRON_FILM.start=function(F){a.call(this,F);Mus.cine='orte/wald';try{chMapBase();chMapDom();}catch(e){console.error(e);}};}
// =========================================================
// Die Szenen, überarbeitet
// =========================================================
const OLDC=CSC.slice();
const ext=(o,x)=>Object.assign({},o,{t0:x.t0!=null?x.t0:o.t0,t1:x.t1!=null?x.t1:o.t1,clock:x.clock!=null?x.clock:o.clock,fog:x.fog||o.fog,
  setup(F){o.setup(F);if(x.setup)x.setup(F);},upd(F,lt,dt,t){if(!x.noOld)o.upd(F,lt,dt,t);if(x.upd)x.upd(F,lt,dt,t);}});
function chToss(F,x,y,z,tx,ty,tz,T,onHit){(F.toss=F.toss||[]).push({x,y,z,vx:(tx-x)/T,vz:(tz-z)/T,vy:(ty-y)/T+4.9*T,t:0,T,onHit});}
function chTossTick(F,dt){for(let i=(F.toss||[]).length-1;i>=0;i--){const b=F.toss[i];b.t+=dt;b.vy-=9.8*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;fxP(b.x,b.y,b.z,0,0,0,[0xff8a20,0xffd060],.12,.45,{});fxP(b.x,b.y,b.z,0,.4,0,0x3a3034,.6,.4,{add:false,s1:1,a:.4});
  if(b.t>=b.T){F.toss.splice(i,1);fxBurst(b.x,b.y,b.z,30,[0xff6a10,0xffd060,0xffffff],7,.7,.7,{up:2});if(b.onHit)b.onHit(b);}}}
const vFlee=(L,vx,vz)=>{L.flee=[vx,vz];L.e.lz+=0;};
const NEWC=[
 // 0 Geburt Imrus + Rehe, Glühwürmchen
 ext(OLDC[0],{setup(F){F.deer=chAnimals('deer',7,[24,46,-30,30]);},upd(F,lt,dt){if(lt>1.35&&!F.df){F.df=1;F.deer.forEach(L=>{const a=Math.atan2(L.e.lz,L.e.lx);L.flee=[Math.cos(a)*9,Math.sin(a)*9];L.walk=['1','2'];});}
   if(Math.random()<dt*25)fxP(STG.x+cr(-30,30),chY(cr(1,4)),STG.z+cr(-30,30),cr(-.3,.3),cr(-.1,.2),cr(-.3,.3),[0xd0ff70,0xf0ff90],2,.18,{fi:.3});}}),
 // 1 Imru zieht mit dem Heer durch jubelnde Dörfer
 ext(OLDC[1],{setup(F){for(const s of[-1,1])for(let i=0;i<9;i++){const L=chWander('p'+VILL_IDS()[(i*7+(s>0?3:0))%30]+'_',[s*cr(9,12),s*cr(9,12),18+i*3.4,18+i*3.4],{cheer:1});}
   chVillagers(8,[-40,-20,20,80],{spd:.8});chVillagers(6,[22,44,70,100],{spd:.8});chAnimals('sheep',12,[26,46,20,50]);chAnimals('cow',4,[-44,-24,90,120]);chBirds(-60,30,60,9,-1,9);}}),
 // 2 Karte: Skyroad vereint Kriesa
 {t0:7.6,t1:10.8,set:'plain',clock:12*60,fog:[60,420],setup(F){chMapShow(true);CHX.map={mode:'unite',k:t=>Math.min(1,(t-7.6)/2.6)};},upd(F,lt){chCam(F,0,20,40,0,0,-60,60);if(lt>2.9)chMapShow(false);}},
 ext(OLDC[3],{upd(F,lt,dt,t){if(Math.random()<dt*14){const x=galX(t);fxP(STG.x+x+cr(-5,5),chY(cr(1,6)),STG.z+cr(1,5),cr(-.05,.05),cr(-.03,.05),0,[0xfff0c0,0xffe0a0],4,.07,{fi:.3,a:.7});}}}),
 ext(OLDC[4],{}),
 ext(OLDC[5],{setup(F){for(let i=0;i<14;i++){const a=i/14*6.283+.3,e=cE(i%3?'p'+VILL_IDS()[(i*5)%30]+'_':'ch_sky'+(i%3)+'_',Math.cos(a)*15,Math.sin(a)*15);e.flip=Math.cos(a)>0;}chBirds(-40,20,-30,6,2,7,0x2a2a30);}}),
 // 6 Butzi lebt
 ext(OLDC[6],{setup(F){chVillagers(10,[-30,30,10,50]);chVillagers(4,[-6,8,30,40],{pause:[3,6]});chBirds(-20,14,-10,3,.5,6,0xf0f0f0);chBirds(30,18,-30,-2,1,5,0xf0f0f0);
   F.boats=CHX.sets.coast.g.children.filter(o=>o.isGroup&&o.scale.x<.5);},upd(F,lt,dt){(F.boats||[]).forEach((b,i)=>{b.position.x+=dt*(i?-.8:.6);b.position.y=chY(0)+Math.sin(lt*1.4+i)*.12;});
   if(Math.random()<dt*8)fxP(STG.x+cr(-60,60),chY(.2),STG.z+cr(-4,0),0,.2,0,0xf0f8fc,1,.5,{add:false,a:.7});}}),
 // 7 Die Flotte im Nebel, Leute am Strand
 ext(OLDC[7],{setup(F){F.on=chVillagers(5,[-34,-10,2,8],{pause:[5,9]}).concat(chVillagers(4,[10,30,2,8],{pause:[5,9]}));F.fl.forEach(s=>chSeaShip(s,1,{raid:1,crew:3,rate:0,y0:-.25}));chBirds(-10,10,-20,2,6,7,0xe8e8e8);},
  upd(F,lt){if(lt>2.4&&!F.run){F.run=1;F.on.forEach(L=>{L.flee=[cr(-1.5,1.5),cr(4,6)];});}}}),
 // 8 Der Überfall: Wachen kämpfen, Fackeln fliegen auf die Dächer
 {t0:37.35,t1:40.3,set:'coast',clock:19*60+45,fog:[30,260],setup(F){const S=CHX.sets.coast;S.fleet.forEach((s,i)=>{s.position.set(STG.x-48+i*16,chY(-.25),STG.z-16-((i*7)%10));chSeaShip(s,1,{raid:1,rate:0,y0:-.25});});
   const R=[];for(let i=0;i<20;i++)R.push(cE('ch_pl'+(i%4)+'_',-30+i*3.1+cr(-1,1),cr(0,5),{f:'u'}));const G=[];for(let i=0;i<6;i++)G.push(cE('ch_sky'+(i%3)+'_',-14+i*5,16+cr(-1,1)));
   chBattle(G,R.slice(4,14),{hp:3});F.run=R.filter((e,i)=>i<4||i>=14);F.vl=chVillagers(12,[-28,28,18,40]);F.vl.forEach(L=>{L.flee=[L.e.lx<0?-cr(4,6):cr(4,6),cr(1,3)];});F.lit=0;F.nt=0;},
  upd(F,lt,dt){for(const e of F.run){e.lz+=dt*4.6;cMv(e,e.lx,e.lz,cWalk(e,lt,9));if(Math.random()<dt*6)fxP(e.x+.3,e.y+2.1,e.z,0,1.5,0,[0xff8a20,0xffd060],.4,.3,{s1:.06});}
   const S=CHX.sets.coast;F.nt-=dt;if(F.nt<=0&&F.lit<S.houses.length){F.nt=.3;const h=S.houses[F.lit++],e=F.run[F.lit%F.run.length];chToss(F,e.x,e.y+2,e.z,h.cx,h.top-1,h.cz,.9,()=>chFireAt(h.cx,h.top-1,h.cz,1.1));}
   chTossTick(F,dt);if(F.at(38))sfx(()=>Snd.clash&&Snd.clash());chCam(F,lrp(16,11,lt/3),2.2,lrp(38,33,lt/3),-2,1.6,8,58);}},
 // 9 Butzi brennt: Plünderer schleppen Beute zu den Schiffen
 ext(OLDC[9],{setup(F){F.r.forEach(e=>e.hidden=true);for(let i=0;i<10;i++){const L=chWander('ch_pl'+(i%4)+'_',[-20,20,30,46]);L.flee=[cr(-1,1),-cr(2.5,4)];}
   for(let i=0;i<6;i++){const e=cE('p'+VILL_IDS()[(i*3)%30]+'_',cr(-20,20),cr(20,44));chKill(e);e.deadT=2;}const S=CHX.sets.coast;S.fleet.forEach(s=>chSeaShip(s,1,{raid:1,rate:0,y0:-.25}));},
  upd(F,lt,dt){if(Math.random()<dt*30)fxP(STG.x+cr(-30,30),chY(cr(2,8)),STG.z+cr(20,50),cr(-.5,.5),cr(1,3),cr(-.5,.5),[0xff8a20,0xffd060],2,.12,{s1:.03});}}),
 // 10 Karte: der Plündererkrieg breitet sich aus
 {t0:42.75,t1:45.4,set:'coast',clock:12*60,fog:[60,420],setup(F){chMapShow(true);CHX.map={mode:'war',k:t=>Math.min(1,(t-42.75)/2.4)};},upd(F,lt){chCam(F,0,6,70,0,4,30,56);if(lt>2.4)chMapShow(false);}},
 ext(OLDC[11],{setup(F){chVillagers(7,[-20,20,24,44],{spd:.6,pause:[2,5]});for(let i=0;i<4;i++){const e=cE('p'+VILL_IDS()[(i*5+2)%30]+'_',cr(-16,16),cr(26,40));chKill(e);e.deadT=3;}chBirds(-8,12,36,1,.2,6,0x101014);}}),
 ext(OLDC[12],{setup(F){chVillagers(14,[-20,20,-20,20]);chAnimals('horse',3,[-30,-16,10,24]);chAnimals('sheep',8,[52,68,26,54]);chBirds(-30,30,0,4,1,8);},upd(F,lt){for(const e of F.ar)cMv(e,e.bx,e.bz+lt*2,cWalk(e,lt,8));}}),
 ext(OLDC[13],{setup(F){const cz=-70;for(let i=0;i<12;i++){const a=i/12*6.283+.13,e=cE('ch_sky'+(i%3)+'_',Math.cos(a)*33.6,cz+Math.sin(a)*33.6,{dy:9.2});e.pa=a;}
   for(let i=0;i<12;i++){const a=i/12*6.283;cE('ch_bansky_',Math.cos(a)*34,cz+Math.sin(a)*34,{prop:1,h:4,dy:15.5});}chVillagers(10,[50,90,0,40]);chAnimals('cow',5,[40,80,-10,30]);chBirds(-40,60,0,5,-1,8);},
  upd(F,lt,dt){for(const e of CHX.ents)if(e.pa!=null){e.pa+=dt*.05;cMv(e,Math.cos(e.pa)*33.6,-70+Math.sin(e.pa)*33.6,cWalk(e,lt,4),9.2);}}}),
 ext(OLDC[14],{setup(F){chVillagers(40,[-60,60,-160,-36],{spd:1.4});chAnimals('horse',6,[-40,40,-150,-40],{spd:1.6});chBirds(-80,70,-60,6,0,10);}}),
 // 15 Schlacht zu Lande: Skyroad gegen die Wikinger
 {t0:53.75,t1:55.4,set:'field',clock:14*60,fog:[60,420],setup(F){const A=cArmy(['sky0','sky1','sky2'],12,3,-12,-10,2.1,-2.2,{jit:.3}),B=cArmy(['pl0','pl1','pl2','pl3'],12,3,-12,8,2.1,2.2,{jit:.3,flip:1});
   A.forEach(e=>{e.lz+=6;e.bz=e.lz;});B.forEach(e=>{e.lz-=5;e.bz=e.lz;});A.concat(B).forEach(e=>cMv(e,e.lx,e.lz));
   const Ar=cArmy(['sky0'],8,1,-8,-22,2,0,{}),Br=cArmy(['pl1'],6,1,-6,18,2.4,0,{flip:1});chBattle(A.concat(Ar),B.concat(Br),{hp:3,archA:1,archB:1});Ar.forEach(e=>e.arch=true);Br.forEach(e=>e.arch=true);
   cE('ch_bansky_',-14,-18,{prop:1,h:5});cE('ch_bansky_',10,-18,{prop:1,h:5});cE('ch_banpl_',12,16,{prop:1,h:5});cE('ch_banpl_',-10,16,{prop:1,h:5});chBirds(-40,30,-30,8,2,6,0x101014);},
  upd(F,lt,dt){if(Math.random()<dt*10)fxDust(STG.x+cr(-14,14),STG.z+cr(-3,3),2,1.5,{});chCam(F,lrp(-17,-11,lt/1.65),1.4,lrp(-5,-1,lt/1.65),6,1.6,0,62);}},
 // 16 Seeschlacht mit Flugapparaten
 {t0:55.4,t1:57.75,set:'sea',clock:15*60,fog:[60,480],setup(F){const S=CHX.sets.sea.ships;S.war.forEach(s=>s.visible=false);
   S.raid.forEach((s,i)=>{s.position.set(STG.x-36+i*22,chY(0),STG.z-50-((i*13)%16));s.rotation.set(0,Math.PI+cr(-.15,.15),0);chSeaShip(s,1,{raid:1,crew:3,rate:1.4,vx:cr(.5,1.2),hp:4});});
   S.sky.forEach((s,i)=>{s.position.set(STG.x-24+i*24,chY(0),STG.z+6+((i*11)%8));s.rotation.set(0,0,0);chSeaShip(s,0,{crew:3,rate:1.5,vx:-cr(.5,1),hp:6});});
   F.fl=[];for(let i=0;i<6;i++){const e=cFly(-30+i*12,10+i%3*2.5,40+i*5);e.h*=1.5;e.w*=1.5;F.fl.push(e);}F.bm=[];CHX.sea.ships.forEach(s=>s.cd=cr(0,.8));},
  upd(F,lt,dt,t){F.fl.forEach((e,i)=>{if(e.dead){e.y-=dt*14;e.lz-=dt*6;e.x=STG.x+e.lx;e.z=STG.z+e.lz;fxP(e.x,e.y,e.z,0,1,0,[0x2a2a2a,0x5a5a5a],1.2,.8,{add:false,s1:1.6,a:.6});if(Math.random()<.5)fxP(e.x,e.y,e.z,0,.5,0,[0xff8a20,0xffd060],.3,.4,{});
       if(e.y<chY(.2)&&!e.hidden){e.hidden=true;fxBurst(e.x,chY(.2),e.z,30,[0xe8f4f8,0xffffff],6,1,.6,{up:7,g:12,add:false});}return;}
     e.lz-=dt*18;e.frame=Math.floor(t*8+i)%2?'1':'0';e.lx+=Math.sin(t+i)*dt;e.x=STG.x+e.lx;e.z=STG.z+e.lz;e.y=chY(e.dy);
     if(!e.dropped&&e.lz<-42){e.dropped=1;F.bm.push({x:e.x,y:e.y,z:e.z,vy:0});}if(i===2&&lt>1.1&&!e.dead){chKill(e);e.fallDir=1;sfx(()=>Snd.boom(.12));fxBurst(e.x,e.y,e.z,30,[0xff6a10,0xffd060],6,.6,.6,{});}});
   for(let i=F.bm.length-1;i>=0;i--){const b=F.bm[i];b.vy-=20*dt;b.y+=b.vy*dt;b.z-=dt*10;fxP(b.x,b.y,b.z,0,0,0,0x202020,.05,.45,{add:false,a:1});
     if(b.y<chY(2.2)){F.bm.splice(i,1);const tg=CHX.sea.ships.find(s=>s.side===1&&Math.hypot(s.g.position.x-b.x,s.g.position.z-b.z)<9);if(tg)chHitShip(tg,b.x,b.y,b.z,0);else fxBurst(b.x,chY(.2),b.z,30,[0xe8f4f8,0xffffff],6,1.2,.6,{up:8,g:12,add:false});fxBurst(b.x,b.y+1,b.z,50,[0xff6a10,0xffd060,0xffffff],10,.9,.9,{up:3,g:6});sfx(()=>Snd.boom(.18));F.shake=.3;}}
   const k=lt/2.35;chCam(F,lrp(-14,-6,k),lrp(5,7,k),lrp(30,26,k),lrp(-4,2,k),lrp(9,5,k),-30,62);}},
 // 17 Umgerüstete Kriegsschiffe: Breitseiten, ein Plündererschiff sinkt
 {t0:57.75,t1:60.55,set:'sea',clock:16*60,fog:[60,480],setup(F){const S=CHX.sets.sea.ships;S.sky.forEach(s=>s.visible=false);
   S.war.forEach((s,i)=>{s.position.set(STG.x-30+i*24,chY(0),STG.z-4);s.rotation.set(0,0,0);chSeaShip(s,0,{war:1,crew:3,rate:2.2,vx:.6,hp:9});});
   S.raid.forEach((s,i)=>{s.visible=i<3;if(i>=3)return;s.position.set(STG.x-28+i*24,chY(0),STG.z-36);s.rotation.set(0,Math.PI,0);chSeaShip(s,1,{raid:1,crew:4,rate:1,vx:-.4,hp:i===1?2:5});});CHX.sea.ships.forEach(s=>s.cd=cr(0,.6));},
  upd(F,lt){const k=lt/2.8;chCam(F,lrp(46,32,k),lrp(2.2,3.2,k),lrp(12,6,k),0,3,-22,58);}},
 ext(OLDC[18],{setup(F){for(let i=0;i<12;i++){const e=cE(i%2?'ch_sky'+(i%3)+'_':'ch_pl'+(i%4)+'_',cr(-14,14),cr(-24,0));chKill(e);e.deadT=3;}chVillagers(0,[0,0,0,0]);for(let i=0;i<3;i++)chWander('ch_sky'+i+'_',[-10,10,-12,0],{spd:.5});chBirds(0,14,-10,.5,.3,6,0x101014);}}),
 ext(OLDC[19],{setup(F){const A=cArmy(['sky0','sky1'],8,1,-14,-34,3.6,0,{}),B=cArmy(['pl0','pl1','pl2','pl3'],8,1,-14,-38,3.6,0,{flip:1});chBattle(A,B,{hp:6});}}),
 OLDC[20],OLDC[21],OLDC[22],OLDC[23],
 // 24 Jahr 322: die größte Schlacht, Feuergeschosse am Himmel
 {t0:68.75,t1:73.65,set:'field',clock:21*60+30,fog:[50,420],blood:1,setup(F){const A=cArmy(['sky0','sky1','sky2'],14,4,-18,-6,2.6,-2.4,{jit:.5}),B=cArmy(['pl0','pl1','pl2','pl3','alt0','alt1'],14,4,-18,6,2.6,2.4,{jit:.5,flip:1});
   chBattle(A,B,{hp:4,archA:5,archB:5});for(let i=0;i<20;i++)chFireAt(STG.x+cr(-70,70),chY(.2),STG.z+cr(-80,40),cr(.8,1.6));for(let i=0;i<6;i++){const e=cE(i%2?'ch_bansky_':'ch_banpl_',-15+i*6,i%2?-16:16,{prop:1,h:5});}chTag('Jahr 322','Der Höhepunkt des Krieges',2.6);F.nt=0;},
  upd(F,lt,dt){F.nt-=dt;if(F.nt<=0){F.nt=cr(.25,.6);const fromA=Math.random()<.5,x0=cr(-40,40),z0=fromA?-60:60,x1=cr(-18,18),z1=fromA?cr(2,12):cr(-12,-2);chToss(F,STG.x+x0,chY(2),STG.z+z0,STG.x+x1,chY(chH(x1,z1)),STG.z+z1,2.2,b=>{sfx(()=>Snd.boom(.1));for(const e of CHX.bat.list)if(!e.dead&&Math.hypot(e.x-b.x,e.z-b.z)<2.2)chKill(e);});}
   chTossTick(F,dt);const a=-.6+lt*.16;chCam(F,Math.sin(a)*24,lrp(4,9,lt/4.9),Math.cos(a)*24,0,1,-2,58);}},
 // 25 Verrat im Thronsaal: Höflinge, Wachen fallen
 ext(OLDC[25],{setup(F){F.ct=[];for(const s of[-1,1])for(let i=0;i<4;i++){const L=chWander('p'+VILL_IDS()[(i*4+(s>0?2:0))%30]+'_',[s*7.5,s*7.5,-16+i*3.5,-16+i*3.5],{pause:[9,9]});F.ct.push(L);}F.gd=CHX.ents.filter(e=>/ch_sky/.test(e.sp));},
  upd(F,lt){if(lt>2.1&&!F.k2){F.k2=1;F.gd.forEach(e=>chKill(e));fxBurst(F.al.x,F.al.y+1,F.al.z,80,[0x1a0a24,0x5a2a8a,0xe080ff],9,1,1,{up:1});F.ct.forEach(L=>{L.flee=[Math.sign(L.e.lx)*1,cr(4,6)];});}}}),
 ext(OLDC[26],{upd(F,lt,dt){if(Math.random()<dt*1.2){F.flash(.35,'#7a3ab0');sfx(()=>Snd.boom(.08));}}}),
 ext(OLDC[27],{setup(F){for(let i=0;i<10;i++){const L=chWander('p'+VILL_IDS()[(i*3+1)%30]+'_',[-14,14,4,16]);L.flee=[cr(-2,2),-cr(4,6)];}for(let i=0;i<5;i++){const e=cE('p'+VILL_IDS()[(i*7)%30]+'_',cr(-10,10),cr(0,12));chKill(e);e.deadT=3;}}}),
 // 28 Die letzte Schlacht
 {t0:81.1,t1:83.35,set:'field',clock:19*60+25,fog:[40,360],blood:1,setup(F){F.fade(0);F.im=cE('ch_imman_',0,-40,{f:'u'});const A=[];for(let i=0;i<14;i++){const a=i/14*6.283;A.push(cE('ch_sky'+(i%3)+'_',Math.cos(a)*5,-40+Math.sin(a)*5,{f:'p'}));}
   const B=[];for(let i=0;i<70;i++){const a=i/70*6.283+cr(-.05,.05),r=cr(9,20);B.push(cE('ch_sh'+(i%3)+'_',Math.cos(a)*r,-40+Math.sin(a)*r));}chBattle(A,B,{hp:3,hold:{0:1}});},
  upd(F,lt,dt){chGlowRise(STG.x,chY(6.2),STG.z-40,2,1,CHGOLD,1.5);chCam(F,lrp(6,4,lt/2.25),3.2,lrp(6,1,lt/2.25),0,1.6,-40,lrp(40,34,lt/2.25));}},
 ext(OLDC[29],{upd(F,lt){if(F.boom&&!F.kd){F.kd=1;for(const e of F.s){chKill(e);e.fallDir=e.lx>0?1:-1;}}}}),
 OLDC[30],OLDC[31],
 ext(OLDC[32],{setup(F){for(let i=0;i<24;i++){const L=chWander('p'+VILL_IDS()[(i*5)%30]+'_',[-50,50,-150,-40]);L.flee=[cr(-1,1),cr(5,7)];}for(let i=0;i<14;i++){const L=chWander('ch_pl'+(i%4)+'_',[-30,30,-170,-150]);L.flee=[cr(-.5,.5),cr(3,4)];}}}),
 ext(OLDC[33],{t1:97.2}),
 // 34 Karte: Skyroad zerbricht in Fraktionen
 {t0:97.2,t1:101.4,set:'field',clock:15*60,fog:[50,400],setup(F){chMapShow(true);CHX.map={mode:'split',k:t=>Math.min(1,(t-97.2)/3.6)};},upd(F,lt){chCam(F,0,8,-6,0,6,-40,56);if(lt>4)chMapShow(false);}},
 ext(OLDC[34],{t0:101.4,setup(F){for(const e of CHX.ents)if(e.bx!=null&&/ch_(alt|aet)/.test(e.sp))e.f0=1;},upd(F,lt,dt,t){for(const e of CHX.ents)if(e.f0)cMv(e,e.bx,e.bz,Math.floor(t*2+e.ph)%2?'u':'0');}}),
 OLDC[35],
 // 36 Kreak kehrt heim: die Stadt jubelt
 ext(OLDC[36],{setup(F){F.cw=[];for(let i=0;i<16;i++){const s=i%2?1:-1,e=cRE('p'+VILL_IDS()[(i*5)%30]+'_',s*cr(6,9),-1772-((i/2)|0)*2.2);e.flip=s>0;F.cw.push(e);}chBirdsReal(0,STT()+18,-1760);},
  upd(F,lt,dt,t){const g=STT();F.cw.forEach(e=>{e.y=g+Math.abs(Math.sin(t*6+e.ph||0))*.25;});}}),
 OLDC[37],
 ext(OLDC[38],{setup(F){F.cw=[];for(let i=0;i<18;i++){const s=i%2?1:-1,e=cRE('p'+VILL_IDS()[(i*7)%30]+'_',s*cr(5.5,8),-1810-((i/2)|0)*1.8);e.flip=s<0;F.cw.push(e);}chBirdsReal(-10,STT()+22,-1840);},
  upd(F,lt,dt,t){const g=STT();F.cw.forEach((e,i)=>{e.y=g+(t>114.2?Math.abs(Math.sin(t*7+i))*.3:0);});}})];
function chBirdsReal(x,y,z){(CHX.birds=CHX.birds||[]).push({x,y,z,vx:3,vz:-1,n:7,s:1.6,c:0x1a1a1e});}
CSC.length=0;NEWC.forEach(s=>CSC.push(s));
