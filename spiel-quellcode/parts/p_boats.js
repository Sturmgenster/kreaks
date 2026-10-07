/* =========================================================
   V68/V69 · Boote und Schiffe
   - Kleines Ruderboot, großes Ruderboot: aufs Wasser setzen, einsteigen, fahren, einpacken
   - Segelschiff: begehbar wie ein kleines Haus (Deck, Kapitänskajüte, Unterdeck),
     am Steuerrad lenken, Kanonen an der Reling, Möbel bleiben an Bord.
     Einpacken geht nicht, nur mit vielen Schlägen zerstören.
   - Von außen sieht man Boote und Schiffe als 2D-Bild wie alles andere,
     an Bord bzw. im Boot das echte Modell.
   ========================================================= */
const SHIP={MD:2.5,LD:.14,HX0:.3,HX1:3.75,HZ:.62,CAB0:-5.95,CAB1:-3.4,CABH:2.4,DOOR:.55,WHEEL:-2.3,MAST:-1.1,FMAST:4.8,LX0:-5.7,LX1:5.2,HP:60};
const BOAT_T={
  boat_s:{name:'Kleines Ruderboot',L:3.4,W:1.3,bot:-.32,top:.34,floor:.03,seat:[.05,0],v:6.2,vs:8,acc:3.2,turn:1.9,oars:1,benches:[0],ppm:18},
  boat_m:{name:'Großes Ruderboot',L:5.2,W:1.9,bot:-.4,top:.44,floor:.03,seat:[-.6,0],v:8.6,vs:11,acc:2.6,turn:1.35,oars:2,benches:[-.9,.9],ppm:18},
  ship:{name:'Segelschiff',L:13,W:4.4,bot:-1.75,top:2.8,floor:SHIP.MD,seat:[SHIP.WHEEL-.75,0],v:11,vs:15,acc:1.5,turn:.55,sail:1,benches:[],ppm:11}};
Object.assign(ITEMS,{boat_s:{name:'Kleines Ruderboot',plural:'Kleine Ruderboote',slot:'boat'},boat_m:{name:'Großes Ruderboot',plural:'Große Ruderboote',slot:'boat'},ship:{name:'Segelschiff',plural:'Segelschiffe',slot:'boat'},
  cannon:{name:'Schiffskanone',plural:'Schiffskanonen',slot:'cannon'},cannonball:{name:'Kanonenkugel',plural:'Kanonenkugeln'}});
Object.assign(ITEM_DESC,{boat_s:'Für einen. Wendig und flott. Rechtsklick aufs Wasser zum Hineinsetzen',boat_m:'Zwei Ruderbänke, stabiler und schneller. Rechtsklick aufs Wasser zum Hineinsetzen',
  ship:'Ein richtiges Schiff mit Deck, Kapitänskajüte und Unterdeck. Rechtsklick aufs tiefe Wasser zum Vom-Stapel-Lassen',
  cannon:'An Bord eines Schiffs an die Reling setzen (Rechtsklick)',cannonball:'Munition für Schiffskanonen'});
RECIPES.push({id:'boat_s',need:{wood:12,stick:4,rope:2},bench:1},{id:'boat_m',need:{wood:24,stick:6,rope:4,iron_ingot:2},bench:1},{id:'ship',need:{wood:90,wool:16,rope:20,iron_ingot:6},bench:1},
  {id:'cannon',need:{iron_ingot:6,wood:4,rope:1},bench:1},{id:'cannonball',n:4,need:{iron_ingot:1,coal:1},bench:1});
// ---------- Bilder fürs Inventar ----------
{const cs2=craftSprites;craftSprites=function(list){cs2(list);
  const W=pal(['#3a2410','#5a3a1c','#7a5228','#9a6a36','#b8844a']);
  const hull=(w,h,sail)=>{const p=new Px(w,h),y0=sail?h-7:Math.floor(h*.45);for(let y=y0;y<h;y++){const t=(y-y0)/(h-y0),ins=Math.round(t*t*w*.22)+1;for(let x=ins;x<w-ins;x++)p.set(x,y,W[shadeIdx(.75-t*.5+((y-y0)%2?.06:-.06),5,x,y)]);}
    for(let x=1;x<w-1;x++)p.set(x,y0,W[4]);return[p,y0];};
  {const[p,y0]=hull(15,9);for(let k=0;k<6;k++){p.set(2+k,y0-1-(k>>1),W[1]);p.set(12-k,y0-1-(k>>1),W[1]);}outline(p);list.push(['boat_s',p.done()]);}
  {const[p,y0]=hull(16,10);for(let k=0;k<7;k++){p.set(1+k,y0-1-(k>>1),W[1]);p.set(14-k,y0-1-(k>>1),W[1]);}p.set(5,y0+1,W[0]);p.set(10,y0+1,W[0]);outline(p);list.push(['boat_m',p.done()]);}
  {const[p,y0]=hull(16,16,1),S=pal(['#c8bc9c','#e6dcc0','#f6f0dc']),R=hex('#b0402e');for(let y=1;y<y0;y++)p.set(8,y,W[0]);
    for(let y=2;y<y0-1;y++)for(let x=3;x<8;x++)p.set(x,y,y===5||y===6?R:S[shadeIdx(.5+(x-5)*.08,3,x,y)]);
    for(let y=3;y<y0-1;y++)for(let x=9;x<9+Math.min(4,(y-2));x++)p.set(x,y,S[1]);outline(p);list.push(['ship',p.done()]);}
  {const p=new Px(16,10),M=pal(['#1e2024','#3a3e46','#5a606a','#8a909a']);for(let x=2;x<14;x++)for(let y=2;y<6;y++)p.set(x,y,M[y===2?3:y===5?0:2-(x>11?1:0)]);for(let y=1;y<7;y++)p.set(14,y,M[1]);
    for(const cx of[4,10])for(let a=0;a<6.28;a+=.4)p.set(cx+Math.cos(a)*2,7+Math.sin(a)*2,W[1]);cR2(p,3,11,6,6,W[2]);outline(p);list.push(['cannon',p.done()]);}
  {const p=new Px(9,9),M=pal(['#16181c','#2e3238','#4a4e56','#8a909a']);for(let y=0;y<9;y++)for(let x=0;x<9;x++){const d=Math.hypot(x-4,y-4);if(d<3.8)p.set(x,y,M[clamp(Math.floor(3.2-d*.7-(x+y-8)*.12),0,3)]);}outline(p);list.push(['cannonball',p.done()]);}};}
function cR2(p,x0,x1,y0,y1,c){for(let y=Math.round(y0);y<=Math.round(y1);y++)for(let x=Math.round(x0);x<=Math.round(x1);x++){const v=typeof c==='function'?c(x,y):c;if(v)p.set(x,y,v);}}
function bLine(p,x0,y0,x1,y1,c){const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))+1;for(let i=0;i<=n;i++){const t=i/n;p.set(x0+(x1-x0)*t,y0+(y1-y0)*t,c);}}
// ---------- 3D-Modelle (nur an Bord sichtbar) ----------
function boatPlankTex(seed,light){const S=64,cv=document.createElement('canvas');cv.width=cv.height=S;const x=cv.getContext('2d'),im=x.createImageData(S,S),D=im.data;
  const W=pal(light?['#7a5228','#946436','#ac7a44','#c49058']:['#3e2612','#4e3018','#5e3c1e','#6e4824']);
  for(let j=0;j<S;j++){const row=j>>3,edge=j%8===0;for(let i=0;i<S;i++){const seam=(i+row*23)%48===0,o=(j*S+i)*4,L=.55+(vnoise(i*.06,row*3.1,seed)-.5)*.5+(hash2(i,j,seed)-.5)*.18;
    const c=edge||seam?W[0]:W[clamp(Math.floor(L*W.length),0,W.length-1)];D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;}}
  x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapNearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function boatSailTex(){const W=32,H=48,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d'),im=x.createImageData(W,H),D=im.data,S=pal(['#bcae8c','#d4c8a8','#e6dcc0','#f4eedc']),R=pal(['#8a2c20','#a83a2a']);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const o=(j*W+i)*4,band=j>=17&&j<25,seam=i%8===0,L=.62+(hash2(i,j,7711)-.5)*.16-(Math.abs(i-W/2)/W)*.25;
    const c=band?R[(i+j)%5===0?0:1]:S[clamp(Math.floor((seam?L-.2:L)*S.length),0,S.length-1)];D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;}
  x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
let BOAT_MATS=null;
function boatMats(){if(BOAT_MATS)return BOAT_MATS;const mk=(map,o)=>new THREE.MeshPhongMaterial(Object.assign({map,flatShading:true,shininess:0,specular:0x000000,side:THREE.DoubleSide},o||{}));
  const dark=boatPlankTex(7701,false),light=boatPlankTex(7702,true);dark.repeat.set(2,1);
  BOAT_MATS={hull:mk(dark),wood:mk(light),deck:mk(boatPlankTex(7703,true)),sail:mk(boatSailTex(),{emissive:0x4a4436}),rope:new THREE.MeshPhongMaterial({color:0xc8b080,flatShading:true}),
    metal:new THREE.MeshPhongMaterial({color:0x2e3238,flatShading:true,shininess:20}),gold:new THREE.MeshPhongMaterial({color:0xc8a040,flatShading:true}),
    glass:new THREE.MeshBasicMaterial({color:0xf0d070}),red:new THREE.MeshPhongMaterial({color:0xa83a2a,flatShading:true,side:THREE.DoubleSide}),lamp:new THREE.MeshBasicMaterial({color:0xffe090})};
  return BOAT_MATS;}
// Breite des Rumpfs an einer Stelle der Länge (t: -1 Heck … +1 Bug)
const boatHalfW=(T,t)=>T.W/2*(t>0?Math.sqrt(Math.max(0,1-Math.pow(t,2.2))):1-.18*Math.pow(-t,3));
const hwAt=(T,lx)=>boatHalfW(T,clamp(lx/(T.L/2),-1,1));
function boatHull(T){const N=T.sail?24:16,pos=[],uv=[],idx=[];const st=[];
  for(let i=0;i<=N;i++){const t=-1+2*i/N,lx=t*T.L/2,hw=boatHalfW(T,t),sheer=T.top+Math.pow(Math.max(0,t),2)*(T.sail?.6:.25)+Math.pow(Math.max(0,-t),2)*(T.sail?.3:.08);
    const bw=hw*.55,bot=T.bot+Math.pow(Math.abs(t),3)*(-T.bot)*.55;st.push([[lx,sheer,-hw],[lx,bot*.6+T.bot*.4*.5,-bw],[lx,bot,0],[lx,bot*.6+T.bot*.4*.5,bw],[lx,sheer,hw]]);}
  for(let i=0;i<=N;i++)for(let k=0;k<5;k++){const p=st[i][k];pos.push(p[0],p[1],p[2]);uv.push(i/N*T.L/3,k/4*(T.sail?2:1));}
  for(let i=0;i<N;i++)for(let k=0;k<4;k++){const a=i*5+k,b=a+1,c=a+5,d=c+1;idx.push(a,c,b,b,c,d);}
  const s0=pos.length/3;for(let k=0;k<5;k++){const p=st[0][k];pos.push(p[0],p[1],p[2]);uv.push(k/4,p[1]-T.bot);}const sc=pos.length/3;pos.push(st[0][0][0],T.top,0);uv.push(.5,1);
  for(let k=0;k<4;k++)idx.push(s0+k,s0+k+1,sc);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function boatBox(w,h,d,mat,x,y,z,ry,rz){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;if(rz)m.rotation.z=rz;return m;}
// Decksplanken als Streifen über die Rumpfbreite, mit Aussparung für die Luke
function deckGeo(T,y,lx0,lx1,wk,hole){const pos=[],uv=[],idx=[],N=Math.ceil((lx1-lx0)/.5);let n=0;const quad=(xa,xb,za0,za1,zb0,zb1)=>{pos.push(xa,y,za0,xa,y,za1,xb,y,zb0,xb,y,zb1);uv.push(xa/2,za0/2,xa/2,za1/2,xb/2,zb0/2,xb/2,zb1/2);idx.push(n,n+1,n+2,n+1,n+3,n+2);n+=4;};
  for(let i=0;i<N;i++){const xa=lx0+(lx1-lx0)*i/N,xb=lx0+(lx1-lx0)*(i+1)/N,wa=hwAt(T,xa)*wk,wb=hwAt(T,xb)*wk,xm=(xa+xb)/2;
    if(hole&&xm>hole[0]&&xm<hole[1]){quad(xa,xb,-wa,-hole[2],-wb,-hole[2]);quad(xa,xb,hole[2],wa,hole[2],wb);}else quad(xa,xb,-wa,wa,-wb,wb);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function makeSail(inner,M,w,h,x,y,list){const s=new THREE.Mesh(new THREE.PlaneGeometry(w,h,4,4),M.sail);s.rotation.y=Math.PI/2;s.position.set(x,y,0);inner.add(s);list.push({m:s,P0:s.geometry.attributes.position.array.slice(),w,h});}
function rope(inner,M,ax,ay,az,bx,by,bz){const l=Math.hypot(bx-ax,by-ay,bz-az),m=new THREE.Mesh(new THREE.BoxGeometry(.035,l,.035),M.rope);m.position.set((ax+bx)/2,(ay+by)/2,(az+bz)/2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(bx-ax,by-ay,bz-az).normalize());inner.add(m);}
function buildBoatMesh(t){const T=BOAT_T[t],M=boatMats(),G=new THREE.Group(),inner=new THREE.Group();G.add(inner);G.userData.inner=inner;G.userData.sails=[];
  inner.add(new THREE.Mesh(boatHull(T),M.hull));
  if(T.sail){buildShipParts(G,inner,T,M);return G;}
  {const fl=new THREE.Mesh(new THREE.PlaneGeometry(T.L*.78,T.W*.62),M.wood);fl.rotation.x=-Math.PI/2;fl.position.set(-T.L*.04,T.floor+.01,0);inner.add(fl);}
  for(const s of[-1,1])for(let i=0;i<10;i++){const t0=-1+i/5,t1=t0+.2,x0=t0*T.L/2,x1=t1*T.L/2,z0=s*boatHalfW(T,t0),z1=s*boatHalfW(T,Math.min(1,t1)),y=T.top+Math.pow(Math.max(0,(t0+t1)/2),2)*.25+.03;
    const len=Math.hypot(x1-x0,z1-z0);inner.add(boatBox(len+.04,.07,.09,M.wood,(x0+x1)/2,y,(z0+z1)/2,-Math.atan2(z1-z0,x1-x0)));}
  for(const b of T.benches)inner.add(boatBox(.32,.06,T.W*.86,M.wood,b,(T.floor+T.top)/2+.04,0));
  G.userData.oars=[];for(const b of T.benches.slice(0,T.oars))for(const s of[-1,1]){const o=new THREE.Group();o.position.set(b,T.top+.05,s*T.W*.48);
    const shaft=boatBox(2.1,.05,.05,M.wood,0,0,0);shaft.position.set(0,0,s*.55);shaft.rotation.y=s*Math.PI/2;o.add(shaft);const blade=boatBox(.5,.03,.16,M.wood,0,0,0);blade.position.set(0,-.02,s*1.45);blade.rotation.y=s*Math.PI/2;o.add(blade);
    o.userData.s=s;inner.add(o);G.userData.oars.push(o);}
  return G;}
function buildShipParts(G,inner,T,M){const S=SHIP,MD=S.MD;
  // Hauptdeck mit Luke, Unterdeck, Treppe
  inner.add(new THREE.Mesh(deckGeo(T,MD,-T.L/2+.15,T.L/2-.25,.97,[S.HX0,S.HX1,S.HZ]),M.deck));
  inner.add(new THREE.Mesh(deckGeo(T,S.LD,S.LX0-.2,S.LX1+.2,.78),M.deck));
  for(let k=0;k<9;k++){const t=(k+.5)/9,x=S.HX0+t*(S.HX1-S.HX0),y=S.LD+t*(MD-S.LD);inner.add(boatBox((S.HX1-S.HX0)/9+.02,.08,S.HZ*2-.05,M.wood,x,y-.04,0));}
  for(const z of[-S.HZ,S.HZ])inner.add(boatBox(S.HX1-S.HX0+.1,.14,.08,M.wood,(S.HX0+S.HX1)/2,MD+.07,z));for(const x of[S.HX0,S.HX1])inner.add(boatBox(.08,.14,S.HZ*2,M.wood,x,MD+.07,0));
  // Reling
  for(const s of[-1,1]){let px=null,pz=null;for(let lx=-T.L/2+.45;lx<=T.L/2-.9;lx+=.95){const z=s*(hwAt(T,lx)-.12);inner.add(boatBox(.08,.9,.08,M.wood,lx,MD+.5,z));if(px!=null){const len=Math.hypot(lx-px,z-pz);inner.add(boatBox(len+.05,.07,.1,M.wood,(lx+px)/2,MD+.97,(z+pz)/2,-Math.atan2(z-pz,lx-px)));}px=lx;pz=z;}}
  // Kapitänskajüte
  {const x0=S.CAB0,x1=S.CAB1,cw=hwAt(T,x1)-.2,h=S.CABH,yc=MD+h/2,len=x1-x0,cx=(x0+x1)/2;
    for(const s of[-1,1]){inner.add(boatBox(len,h,.1,M.wood,cx,yc,s*cw));for(const wx of[x0+.7,x0+1.8])inner.add(boatBox(.45,.4,.03,M.glass,wx,MD+1.5,s*(cw+.06)));}
    inner.add(boatBox(.1,h,cw*2,M.wood,x0,yc,0));for(const z of[-.9,.9])inner.add(boatBox(.03,.45,.5,M.glass,x0-.06,MD+1.5,z));
    const side=cw-S.DOOR;for(const s of[-1,1])inner.add(boatBox(.1,h,side,M.wood,x1,yc,s*(S.DOOR+side/2)));inner.add(boatBox(.1,h-2.05,S.DOOR*2,M.wood,x1,MD+2.05+(h-2.05)/2,0));
    inner.add(boatBox(len+.5,.12,cw*2+.4,M.hull,cx-.1,MD+h+.06,0));inner.add(boatBox(.14,.14,.14,M.lamp,cx,MD+h-.35,0));
    for(const s of[-1,1])for(let lx=x0+.2;lx<=x1;lx+=.6)inner.add(boatBox(.06,.5,.06,M.wood,lx,MD+h+.35,s*(cw+.1)));}
  // Steuerrad
  {inner.add(boatBox(.16,1.0,.16,M.wood,S.WHEEL,MD+.5,0));const W=new THREE.Group();W.position.set(S.WHEEL-.12,MD+.98,0);W.scale.setScalar(.75);
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2,sp=boatBox(.05,1.1,.05,M.wood,0,0,0);sp.rotation.x=a;W.add(sp);const r=boatBox(.06,.06,.3,M.wood,0,Math.cos(a+Math.PI/8)*.45,Math.sin(a+Math.PI/8)*.45);r.rotation.x=a+Math.PI/8;W.add(r);}
    W.add(boatBox(.1,.12,.12,M.gold,0,0,0));inner.add(W);G.userData.wheel=W;}
  // Masten, Rahen, Segel, Tauwerk
  const top1=MD+9.5,top2=MD+7.6;inner.add(boatBox(.28,top1-S.LD,.28,M.wood,S.MAST,(top1+S.LD)/2,0));inner.add(boatBox(.24,top2-MD,.24,M.wood,S.FMAST,(top2+MD)/2,0));
  inner.add(boatBox(.14,.14,6.4,M.wood,S.MAST+.18,MD+8.2,0));inner.add(boatBox(.14,.14,6.4,M.wood,S.MAST+.18,MD+2.4,0));inner.add(boatBox(.12,.12,4.8,M.wood,S.FMAST+.16,MD+6.6,0));inner.add(boatBox(.12,.12,4.8,M.wood,S.FMAST+.16,MD+2.2,0));
  makeSail(inner,M,6,5.6,S.MAST+.26,MD+5.3,G.userData.sails);makeSail(inner,M,4.6,4.2,S.FMAST+.24,MD+4.4,G.userData.sails);
  inner.add(boatBox(.6,.4,.6,M.wood,S.MAST,MD+7.3,0));
  {const f=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.6),M.red);f.position.set(S.MAST-.6,top1+.1,0);inner.add(f);G.userData.flag=f;}
  const bow=T.L/2,bs=[bow+2.6,MD+2.2];{const l=Math.hypot(2.9,1.2),m=boatBox(l,.16,.16,M.wood,bow+1.15,MD+1.5,0,0,Math.atan2(1.2,2.9));inner.add(m);}
  rope(inner,M,S.FMAST,top2,0,bs[0],bs[1],0);rope(inner,M,S.MAST,top1,0,S.FMAST,top2-.3,0);rope(inner,M,S.MAST,top1,0,-T.L/2+.3,MD+2.5,0);
  for(const s of[-1,1]){rope(inner,M,S.MAST,top1-1.4,0,S.MAST-.4,MD+.9,s*(hwAt(T,S.MAST)-.12));rope(inner,M,S.MAST,top1-1.4,0,S.MAST+.8,MD+.9,s*(hwAt(T,S.MAST+.8)-.12));
    rope(inner,M,S.FMAST,top2-1,0,S.FMAST-.3,MD+.9,s*(hwAt(T,S.FMAST-.3)-.12));}
  inner.add(boatBox(1.1,1.6,.12,M.hull,-T.L/2-.3,T.bot+1.1,0));
  // Unterdeck: Kisten und Fässer
  for(const[x,z,w]of[[-5,1.1,.8],[-5,-1.1,.7],[4.6,.9,.7],[4.4,-1,.6],[-4.1,1.3,.6]])inner.add(boatBox(w,w,w,M.wood,x,S.LD+w/2,z));
  for(const[x,z]of[[-4.2,-1.3],[4.9,0]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.8,8),M.hull);b.position.set(x,S.LD+.4,z);inner.add(b);}
  inner.add(boatBox(.14,.14,.14,M.lamp,0,MD-.25,0));
  G.userData.cannons=new THREE.Group();inner.add(G.userData.cannons);}
// ---------- Kanonen ----------
const CANNON_SLOTS=[[-1.95,-1],[-1.95,1],[.95,-1],[.95,1],[4.0,-1],[4.0,1]];
function cannonLocal(T,k){const[lx,s]=CANNON_SLOTS[k];return[lx,s*(hwAt(T,lx)-.75),s];}
function buildCannons(b){const G=b.mesh.userData.cannons;if(!G)return;while(G.children.length)G.remove(G.children[0]);const M=boatMats(),MD=SHIP.MD;
  for(const k of b.d.cannons||[]){const[lx,lz,s]=cannonLocal(b.T,k),C=new THREE.Group();C.position.set(lx,MD,lz);
    C.add(boatBox(.7,.3,.55,M.wood,0,.2,0));for(const wx of[-.25,.25])for(const wz of[-.24,.24]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.07,8),M.hull);w.rotation.x=Math.PI/2;w.position.set(wx,.13,wz);C.add(w);}
    const br=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,1.15,10),M.metal);br.rotation.x=Math.PI/2;br.position.set(0,.48,s*.3);C.add(br);const rim=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.08,10),M.metal);rim.rotation.x=Math.PI/2;rim.position.set(0,.48,s*.86);C.add(rim);
    G.add(C);}}
// ---------- 2D-Bilder (von außen) ----------
const BOAT2D_VIEWS=['s','f','b'];let boatBBMesh=null;const BOAT_BB_N=40;
function drawBoat2D(t,view){const T=BOAT_T[t],k=T.ppm,ship=!!T.sail,Wd=pal(['#2e1c0c','#3e2612','#4e3018','#5e3c1e','#6e4824','#80562c']),Lt=pal(['#7a5228','#946436','#ac7a44','#c49058']),
    S=pal(['#a89a78','#c8bc9c','#e2d8bc','#f4eedc']),RD=pal(['#7a2418','#a83a2a','#c8503a']),MT=pal(['#1e2024','#3a3e46','#6a707a']),G=hex('#f0d070');
  const below=.25,above=ship?(view==='s'?SHIP.MD+10.3:SHIP.MD+10.3):T.top+(view==='s'?.9:.7),W=view==='s'?Math.ceil((T.L+(ship?2.8:2.4))*k)+4:Math.ceil((ship?7:T.W+3.6)*k)+4,H=Math.ceil((above+below+(ship?.6:0))*k)+3;
  const p=new Px(W,H),yw=H-1-below*k,yAt=y=>yw-y*k;
  if(view==='s'){const x0=ship?Math.round(.6*k)+2:Math.round(1.2*k)+2,x1=x0+T.L*k,top=t2=>yAt(T.top+Math.pow(Math.max(0,t2*2-1),2)*(ship?.6:.25)+Math.pow(Math.max(0,1-t2*2),2)*(ship?.3:.08));
    for(let x=x0;x<=x1;x++){const t2=(x-x0)/(x1-x0),yt=top(t2),bowCut=t2>.72?Math.pow((t2-.72)/.28,1.6)*(yw+3-yt-2):0,yb=yw+3-bowCut;
      for(let y=Math.round(yt);y<=yb;y++){const dy=y-yt,band=dy>=1.5&&dy<3.2,wale=Math.abs(dy-(ship?6:2.5))<.8,plank=Math.floor(dy/3)%2;p.set(x,y,band&&ship?RD[1]:wale?Lt[2]:Wd[clamp(Math.floor(2.8+plank*.8-dy/(ship?24:12)+(hash2(x>>3,y,7801)-.5)*.6),0,5)]);}
      p.set(x,Math.round(yt),Lt[3]);}
    if(ship){const deckY=yAt(SHIP.MD);for(let x=x0+2;x<=x1-k*1.2;x+=Math.round(k*.95)){for(let y=deckY-k*.95;y<yAt(T.top);y++)p.set(x,y,Lt[1]);}bLine(p,x0+2,deckY-k*.95,x1-k*1.1,deckY-k*.95-(k*.3),Lt[2]);
      for(const lx of CANNON_SLOTS.filter(c=>c[1]>0).map(c=>c[0])){const gx=x0+(lx+T.L/2)*k;cR2(p,gx-3,gx+3,yAt(T.top)+5,yAt(T.top)+9,MT[0]);cR2(p,gx-4,gx+4,yAt(T.top)+4,yAt(T.top)+4,Lt[3]);}
      const cx0=x0+(SHIP.CAB0+T.L/2)*k,cx1=x0+(SHIP.CAB1+T.L/2)*k,cy=yAt(SHIP.MD+SHIP.CABH);cR2(p,cx0,cx1,cy,deckY,(x,y)=>Lt[(y>>2)%2?1:2]);cR2(p,cx0-2,cx1+2,cy-2,cy,Wd[2]);
      for(const wx of[cx0+5,cx0+15])cR2(p,wx,wx+5,cy+6,cy+11,G);cR2(p,cx1-6,cx1-2,cy+5,deckY-1,Wd[1]);
      const mast=(lx,ytop,sw,y0s,y1s)=>{const mx=x0+(lx+T.L/2)*k;cR2(p,mx-1,mx,yAt(ytop),yAt(SHIP.MD),Wd[4]);const sy0=yAt(y0s),sy1=yAt(y1s);
        for(let y=sy0;y<=sy1;y++){const tt=(y-sy0)/(sy1-sy0),bul=Math.sin(tt*Math.PI)*2.5,hw=sw/2*k;for(let x=Math.round(mx-hw+2+bul);x<=Math.round(mx+hw+bul);x++){const band=tt>.38&&tt<.52;p.set(x,y,band?RD[1]:S[clamp(Math.floor(2.6-Math.abs(x-mx)/(hw)*1.3+(hash2(x,y,7802)-.5)*.5),0,3)]);}}
        cR2(p,mx-sw/2*k,mx+sw/2*k+2,sy0-1,sy0,Wd[3]);cR2(p,mx-sw/2*k+1,mx+sw/2*k+3,sy1+1,sy1+1,Wd[3]);return mx;};
      const m1=mast(SHIP.MAST,SHIP.MD+9.5,3.4,SHIP.MD+8.1,SHIP.MD+2.5),m2=mast(SHIP.FMAST,SHIP.MD+7.6,2.8,SHIP.MD+6.5,SHIP.MD+2.3);
      cR2(p,m1-1,m1+10,yAt(SHIP.MD+9.6)-4,yAt(SHIP.MD+9.6),RD[2]);bLine(p,x1-2,yAt(T.top+.5),x1+2.2*k,yAt(SHIP.MD+2),Wd[4]);
      bLine(p,m2,yAt(SHIP.MD+7.6),x1+2.2*k,yAt(SHIP.MD+2),Wd[1]);bLine(p,m1,yAt(SHIP.MD+9.5),m2,yAt(SHIP.MD+7.4),Wd[1]);bLine(p,m1,yAt(SHIP.MD+9.5),x0+3,yAt(SHIP.MD+2.6),Wd[1]);
      cR2(p,x0-k*.4,x0+1,yw-k*1.1,yw+2,Wd[1]);}
    else{for(const b of T.benches){const bx=x0+(b+T.L/2)*k;cR2(p,bx-2,bx+2,yAt(T.top)+1,yAt(T.top)+2,Lt[2]);bLine(p,bx-k*.9,yAt(T.top+.6),bx+k*1.1,yw+2,Lt[1]);cR2(p,bx+k*1.1-3,bx+k*1.1+2,yw,yw+2,Lt[2]);}}}
  else{// Bug- oder Heckansicht
    const cx=W/2,hw=T.W/2*k,yt=yAt(T.top+(view==='f'?(ship?.6:.25):(ship?.3:.08)));
    for(let y=Math.round(yt);y<=yw+3;y++){const tt=(y-yt)/(yw+3-yt),w=hw*(view==='f'?(1-tt*.75):(1-tt*tt*.45));for(let x=Math.round(cx-w);x<=Math.round(cx+w);x++)p.set(x,y,Wd[clamp(Math.floor(3.2-tt*1.6-(x-cx)/hw*.6+(Math.floor((y-yt)/3)%2)*.5),0,5)]);}
    if(view==='f')cR2(p,cx-1,cx+1,yt-2,yw+3,Wd[4]);
    if(ship){const deckY=yAt(SHIP.MD);for(const s of[-1,1])for(let y=deckY-k*.95;y<yt+1;y++)p.set(cx+s*(hw-2),y,Lt[1]);cR2(p,cx-hw+2,cx+hw-2,deckY-k*.95,deckY-k*.95,Lt[2]);
      if(view==='b'){const cy=yAt(SHIP.MD+SHIP.CABH);cR2(p,cx-hw+3,cx+hw-3,cy,yt+4,(x,y)=>Lt[(y>>2)%2?1:2]);for(const wx of[-hw*.55,0,hw*.55])cR2(p,cx+wx-3,cx+wx+3,cy+6,cy+11,G);cR2(p,cx-hw+1,cx+hw-1,cy-2,cy,Wd[2]);cR2(p,cx-2,cx+2,yw-k*1.2,yw+2,Wd[1]);}
      const sail=(sw,y0s,y1s,mx)=>{for(let y=yAt(y0s);y<=yAt(y1s);y++){const tt=(y-yAt(y0s))/(yAt(y1s)-yAt(y0s)),band=tt>.38&&tt<.52;for(let x=Math.round(mx-sw/2*k);x<=Math.round(mx+sw/2*k);x++)p.set(x,y,band?RD[view==='f'?1:0]:S[clamp(Math.floor((view==='f'?2.7:1.9)-Math.abs(x-mx)/(sw/2*k)*.9+(hash2(x,y,7803)-.5)*.4),0,3)]);}
        cR2(p,mx-sw/2*k-2,mx+sw/2*k+2,yAt(y0s)-1,yAt(y0s),Wd[3]);};
      cR2(p,cx-1,cx,yAt(SHIP.MD+9.5),deckY,Wd[4]);
      if(view==='f'){sail(6.2,SHIP.MD+8.1,SHIP.MD+2.5,cx);sail(4.6,SHIP.MD+6.5,SHIP.MD+2.3,cx);bLine(p,cx,yAt(SHIP.MD+2),cx,yAt(T.top),Wd[4]);}
      else{sail(6.2,SHIP.MD+8.1,SHIP.MD+2.5,cx);}
      cR2(p,cx+1,cx+11,yAt(SHIP.MD+9.6)-4,yAt(SHIP.MD+9.6),RD[2]);}
    else{for(const s of[-1,1]){bLine(p,cx+s*(hw-1),yAt(T.top+.1),cx+s*(hw+1.7*k),yw+1,Lt[1]);cR2(p,cx+s*(hw+1.7*k)-2,cx+s*(hw+1.7*k)+2,yw,yw+2,Lt[2]);}}}
  outline(p);return p.done();}
function initBoat2D(){const L=[];for(const t in BOAT_T)for(const v of BOAT2D_VIEWS)L.push(['b2_'+t+'_'+v,drawBoat2D(t,v)]);
  const AW=1024;let x=2,y=2,rowH=0;const pos=[];L.sort((a,b)=>b[1].height-a[1].height);for(const[n,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([n,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  let AH=64;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');
  for(const[n,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[n]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;const m=bbMaterial(tex,0,0);EXTRA_BB.push(m);
  const ph=[];for(let k=0;k<BOAT_BB_N;k++)ph.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'b2_ship_s',tint:1});boatBBMesh=makeBillboards(ph,m);boatBBMesh.frustumCulled=false;boatBBMesh.geometry.instanceCount=0;scene.add(boatBBMesh);}
{const i3=initDemons;initDemons=function(a){i3(a);try{initBoat2D();}catch(e){console.error('Boot-Bilder',e);}};}
// ---------- Boote in der Welt ----------
const BOATS=[];let boatArr=null,boatIn=null,boatSaveT=0;
function boatList(){FLAGS.boats=FLAGS.boats||[];return FLAGS.boats;}
function boatSync(){const L=boatList();if(boatArr===L&&BOATS.length===L.length)return;boatArr=L;for(const b of BOATS){scene.remove(b.mesh);}BOATS.length=0;for(const d of L)boatAdd(d,true);}
function boatAdd(d,noPush){if(!d.id)d.id='b'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);if(d.t==='ship'){if(d.hp==null)d.hp=SHIP.HP;d.cannons=d.cannons||[];}
  const b={d,T:BOAT_T[d.t],mesh:buildBoatMesh(d.t),v:0,roll:0,ph:Math.random()*6};b.mesh.position.set(d.x,WATER,d.z);b.mesh.rotation.y=d.yaw;b.mesh.visible=false;scene.add(b.mesh);BOATS.push(b);if(d.t==='ship')buildCannons(b);if(!noPush)boatList().push(d);return b;}
function boatRemove(b){scene.remove(b.mesh);const i=BOATS.indexOf(b);if(i>=0)BOATS.splice(i,1);const L=boatList(),j=L.indexOf(b.d);if(j>=0)L.splice(j,1);if(boatIn===b)boatIn=null;}
function boatLocal(b,x,z){const dx=x-b.d.x,dz=z-b.d.z,c=Math.cos(b.d.yaw+Math.PI/2),s=Math.sin(b.d.yaw+Math.PI/2);return[dx*c-dz*s,dx*s+dz*c];}
function boatWorld(b,lx,lz){const c=Math.cos(b.d.yaw+Math.PI/2),s=Math.sin(b.d.yaw+Math.PI/2);return[b.d.x+lx*c+lz*s,b.d.z-lx*s+lz*c];}
function boatInside(b,x,z,pad){const[lx,lz]=boatLocal(b,x,z),T=b.T;if(Math.abs(lx)>T.L/2+(pad||0))return false;return Math.abs(lz)<hwAt(T,lx)+(pad||0);}
const boatDeckY=b=>WATER+b.T.floor+(b.bob||0);
// Höhe des Bodens auf dem Schiff: Hauptdeck, Treppe in der Luke, Unterdeck
function shipFloor(b,lx,lz,feet){const S=SHIP,T=b.T,hw=hwAt(T,lx);if(Math.abs(lx)>T.L/2-.05||Math.abs(lz)>hw-.04)return null;const y0=WATER+(b.bob||0);
  const inH=lx>S.HX0&&lx<S.HX1&&Math.abs(lz)<S.HZ,ramp=S.LD+(lx-S.HX0)/(S.HX1-S.HX0)*(S.MD-S.LD);
  if(feet==null)return y0+(inH?ramp:S.MD);if(inH&&feet>y0+ramp-1.7)return y0+ramp;if(feet>y0+S.MD-.75)return y0+S.MD;return y0+S.LD;}
{const g1=groundAt;groundAt=function(x,z,feet){const g=g1(x,z,feet);if(x>60000||!BOATS.length)return g;for(const b of BOATS){if(Math.abs(x-b.d.x)>b.T.L&&Math.abs(z-b.d.z)>b.T.L)continue;
    if(b.T.sail){const[lx,lz]=boatLocal(b,x,z),y=shipFloor(b,lx,lz,feet);if(y!=null&&(feet==null||feet>y-1.6))return Math.max(g,y);continue;}
    if(boatInside(b,x,z,-.06)){const y=boatDeckY(b);if(feet==null||feet>y-1.2)return Math.max(g,y);}}return g;};}
// Auf welchem Schiff steht etwas?
function shipAt(x,z,y){for(const b of BOATS){if(!b.T.sail)continue;if(Math.abs(x-b.d.x)>b.T.L||Math.abs(z-b.d.z)>b.T.L)continue;const[lx,lz]=boatLocal(b,x,z);if(Math.abs(lx)>b.T.L/2+.2||Math.abs(lz)>hwAt(b.T,lx)+.2)continue;
    if(y>WATER+SHIP.LD-.6&&y<WATER+SHIP.MD+SHIP.CABH+1.5)return b;}return null;}
// Wasser?
function isWater(x,z,depth){if(!inWorld(x,z)||x>60000)return false;if(getHeight(x,z)>=WATER-(depth||.25))return false;if(!inCore(x,z))return true;return nearWater(x,z)||(typeof harbD==='function'&&harbD(x,z)<0);}
function boatWaterOK(T,x,z){return isWater(x,z,-T.bot+.05);}
function boatFits(T,x,z,yaw){const c=Math.cos(yaw+Math.PI/2),s=Math.sin(yaw+Math.PI/2);for(const[lx,lz]of[[T.L/2,0],[-T.L/2,0],[0,T.W/2],[0,-T.W/2],[T.L/4,T.W/3],[T.L/4,-T.W/3],[-T.L/4,T.W/2.2],[-T.L/4,-T.W/2.2],[0,0]]){
    if(!boatWaterOK(T,x+lx*c+lz*s,z-lx*s+lz*c))return false;}return true;}
function boatHitsOther(b,x,z){for(const o of BOATS){if(o===b)continue;if(Math.hypot(o.d.x-x,o.d.z-z)<(o.T.L+b.T.L)*.42)return true;}return false;}
// ---------- Zielen ----------
function boatLooked(maxNear){if(P.x>60000||boatIn)return null;const onS=shipAt(P.x,P.z,P.y);let best=null,bd=1e9;for(const b of BOATS){if(b===onS)continue;const d=Math.hypot(b.d.x-P.x,b.d.z-P.z);if(d>b.T.L/2+4)continue;
    const[lx,lz]=boatLocal(b,P.x,P.z),T=b.T,cx=clamp(lx,-T.L/2,T.L/2),cz=clamp(lz,-hwAt(T,cx),hwAt(T,cx)),[wx,wz]=boatWorld(b,cx,cz);const near=Math.hypot(wx-P.x,wz-P.z);
    if(near>(maxNear||3))continue;if(!lookingAt(wx,WATER+(T.sail?.8:T.floor+.3),wz,6,.4)&&near>.6)continue;if(near<bd){bd=near;best=b;}}return best;}
function boatWaterSpot(){const L=lookDir();for(let d=2;d<=12;d+=.5){const x=P.x+L.x*d,z=P.z+L.z*d;if(isWater(x,z))return[x,z];}return null;}
// Auf dem Schiff: Steuerrad, Kanonen, Reling
function shipWheelLooked(b){const[x,z]=boatWorld(b,SHIP.WHEEL,0);return Math.hypot(x-P.x,z-P.z)<2.3&&Math.abs(P.y-(WATER+SHIP.MD))<.6&&lookingAt(x,WATER+SHIP.MD+1.05,z,3,.7);}
function shipCannonLooked(b){let best=null,bd=9;for(const k of b.d.cannons||[]){const[lx,lz]=cannonLocal(b.T,k),[x,z]=boatWorld(b,lx,lz),d=Math.hypot(x-P.x,z-P.z);if(d<2.4&&d<bd&&lookingAt(x,WATER+SHIP.MD+.45,z,3,.7)){bd=d;best=k;}}return best;}
function shipRailLooked(b){if(Math.abs(P.y-(WATER+SHIP.MD))>.6)return false;const[lx,lz]=boatLocal(b,P.x,P.z);if(lx<SHIP.CAB1+.2&&lx>SHIP.CAB0-.5)return false;if(Math.abs(lz)<hwAt(b.T,lx)-.9)return false;
  const L=lookDir(),[ox,oz]=boatWorld(b,lx,lz+Math.sign(lz)),dx=ox-P.x,dz=oz-P.z;return(L.x*dx+L.z*dz)>.35;}
// ---------- Ein- und Aussteigen ----------
function boatBoard(b){if(P.riding){toast('Steig erst vom Reittier ab');return;}
  if(b.T.sail){const[lx,lz]=boatLocal(b,P.x,P.z),s=lz<0?-1:1,blx=clamp(lx,-1.6,-.2),[x,z]=boatWorld(b,blx,s*(hwAt(b.T,blx)-.7));P.x=x;P.z=z;P.y=WATER+SHIP.MD+.05;P.vx=P.vz=P.vy=0;P.ground=true;Snd.thud();return;}
  boatIn=b;b.v=0;const[x,z]=boatWorld(b,b.T.seat[0],b.T.seat[1]);P.x=x;P.z=z;P.y=boatDeckY(b);P.vx=P.vz=P.vy=0;P.ground=true;Snd.thud();}
function boatLeave(b){b=b||boatIn;if(!b)return;if(boatIn===b)boatIn=null;b.v=0;const T=b.T;let spot=null;
  for(let r=T.W/2+.8;r<T.W/2+8&&!spot;r+=.6)for(let a=0;a<6.283;a+=.35){const[x,z]=boatWorld(b,Math.cos(a)*(T.L/2+.3)*(r/(T.W/2+.8))*.6,Math.sin(a)*r);if(!inWorld(x,z))continue;const g=getHeight(x,z);if(g>WATER+.15&&g<WATER+T.floor+3.5&&!isWater(x,z)){spot=[x,z];break;}}
  if(!spot){const[lx,lz]=boatLocal(b,P.x,P.z),[x,z]=boatWorld(b,clamp(lx,-T.L/3,T.L/3),(lz<0?-1:1)*(T.W/2+1));spot=[x,z];}
  P.x=spot[0];P.z=spot[1];P.y=groundAt(P.x,P.z,P.y+2);P.vx=P.vz=0;P.vy=1;P.ground=false;}
function boatPack(b){if(b.T.sail)return;const id=b.d.t;if(addItem(id,1)===1){toast('Kein Platz im Inventar');return;}boatRemove(b);Snd.pickup();saveGame();}
function boatPlace(id){const T=BOAT_T[id],w=boatWaterSpot();if(!w)return true;
  let ok=null;for(const dy of[0,.4,-.4,.8,-.8,1.6,-1.6,Math.PI/2])for(const dd of[0,1.5,3,4.5,6,8]){const L=lookDir(),x=w[0]+L.x*(dd+(T.sail?T.W/2:0)),z=w[1]+L.z*(dd+(T.sail?T.W/2:0)),yaw=P.yaw+(T.sail?Math.PI/2:0)+dy;if(boatFits(T,x,z,yaw)&&!boatHitsOther({T},x,z)){ok=[x,z,yaw];break;}if(ok)break;}
  if(!ok){try{Snd.click();}catch(e){}return true;}
  removeItem(id,1);boatAdd({t:id,x:ok[0],z:ok[1],yaw:ok[2]});for(let k=0;k<30;k++){const a=Math.random()*6.283;spawnParticle(ok[0]+Math.cos(a)*T.L*.55,WATER+.1,ok[1]+Math.sin(a)*T.L*.55,Math.cos(a)*1.5,1.2+Math.random()*1.5,Math.sin(a)*1.5,0xe8f4ff,.6,.1);}
  Snd.thud();saveGame();return true;}
// ---------- Kanonen setzen, abfeuern, abbauen ----------
const CBALLS=[];
function cannonPlace(b){let best=-1,bd=3.2;for(let k=0;k<CANNON_SLOTS.length;k++){if((b.d.cannons||[]).includes(k))continue;const[lx,lz]=cannonLocal(b.T,k),[x,z]=boatWorld(b,lx,lz),d=Math.hypot(x-P.x,z-P.z);if(d<bd){bd=d;best=k;}}
  if(best<0){try{Snd.click();}catch(e){}return;}removeItem('cannon',1);b.d.cannons.push(best);buildCannons(b);Snd.clink(.8);saveGame();}
function cannonFire(b,k){if(countItem('cannonball')<1){try{Snd.click();}catch(e){}return;}removeItem('cannonball',1);const[lx,lz,s]=cannonLocal(b.T,k),[x,z]=boatWorld(b,lx,lz+s*.95),[ox,oz]=boatWorld(b,lx,lz+s*2),dx=ox-x,dz=oz-z,l=Math.hypot(dx,dz)||1;
  CBALLS.push({x,y:WATER+SHIP.MD+.5,z,vx:dx/l*42,vy:5,vz:dz/l*42,t:0});Snd.boom(.35);P.lastAction=time;
  for(let i=0;i<22;i++)spawnParticle(x,WATER+SHIP.MD+.5,z,dx/l*(2+Math.random()*3)+(Math.random()-.5)*1.5,Math.random()*1.5,dz/l*(2+Math.random()*3)+(Math.random()-.5)*1.5,i<6?0xffc040:0xb8b8b8,1+Math.random(),.3);}
function updateCBalls(dt){for(let i=CBALLS.length-1;i>=0;i--){const c=CBALLS[i];c.t+=dt;c.vy-=9.8*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.z+=c.vz*dt;if(Math.random()<.8)spawnParticle(c.x,c.y,c.z,0,.2,0,0x9a9a9a,.5,.14);
  let hit=c.t>6||c.y<getHeight(c.x,c.z)||(c.y<WATER&&isWater(c.x,c.z,0));for(const e of DEM)if(!hit&&!e.dead&&e.fac!=='ally'&&Math.hypot(e.x-c.x,e.z-c.z)<(e.d.rad||.4)+.4&&c.y>e.y-.2&&c.y<e.y+e.h+.2)hit=true;
  if(!hit)continue;CBALLS.splice(i,1);const R=3.6,wet=c.y<WATER+.2&&isWater(c.x,c.z,0);Snd.boom(Math.max(.05,.3-Math.hypot(c.x-P.x,c.z-P.z)/300));
  for(let k=0;k<34;k++)spawnParticle(c.x,Math.max(c.y,WATER)+.1,c.z,(Math.random()-.5)*7,Math.random()*(wet?8:5),(Math.random()-.5)*7,wet?0xe8f4ff:(k%3?0x6a5a48:0xffa030),wet?1.1:.9,.35);
  for(const e of DEM)if(!e.dead&&e.fac!=='ally'&&e.type!=='kreak'&&Math.hypot(e.x-c.x,e.z-c.z)<R+(e.d.rad||.4)){if(e.type==='ginger'&&e.land)candyAnger(e.land);hurtEnt(e,95,'player');}
  for(const a of animals)if(a.alive&&!a.tame&&Math.hypot(a.x-c.x,a.z-c.z)<R)hurtAnimal(a,95);}}
function cannonPack(b,k){if(addItem('cannon',1)===1)return;b.d.cannons=b.d.cannons.filter(q=>q!==k);buildCannons(b);Snd.pickup();saveGame();}
// ---------- Rechtsklick ----------
{const su0=storyUse;storyUse=function(){if(su0())return true;if(P.x>60000)return false;
  const onS=shipAt(P.x,P.z,P.y);const h=inv[HOT0+sel];
  if(onS&&!boatIn){if(shipWheelLooked(onS)){boatIn=onS;onS.v=0;Snd.thud();return true;}const k=shipCannonLooked(onS);if(k!=null){if(down('sneak'))cannonPack(onS,k);else cannonFire(onS,k);return true;}
    if(h&&h.id==='cannon'&&Math.abs(P.y-(WATER+SHIP.MD))<.6){cannonPlace(onS);return true;}if(shipRailLooked(onS)&&!(h&&ITEMS[h.id]&&ITEMS[h.id].furn)){boatLeave(onS);return true;}}
  const b=boatLooked();if(b){if(down('sneak')&&!b.T.sail){boatPack(b);return true;}boatBoard(b);return true;}
  if(h&&BOAT_T[h.id]&&!boatIn&&!onS){if(P.riding)return true;return boatPlace(h.id);}return false;};}
{const sp0=storyPrompt;storyPrompt=function(){const onS=shipAt(P.x,P.z,P.y),sk=keyName(settings.keys.sneak);
  if(boatIn&&!(P.view||0)){promptEl.innerHTML=`<b>[${sk}]</b>${boatIn.T.sail?'Steuerrad loslassen':'Aussteigen'}`;promptEl.hidden=false;return true;}
  if(onS){if(shipWheelLooked(onS)){promptEl.innerHTML=`<b>[Rechtsklick]</b>Ans Steuerrad`;promptEl.hidden=false;return true;}
    const k=shipCannonLooked(onS);if(k!=null){promptEl.innerHTML=`<b>[Rechtsklick]</b>Feuer! (${countItem('cannonball')} Kugeln) <b>[${sk} + Rechtsklick]</b>abbauen`;promptEl.hidden=false;return true;}
    if(shipRailLooked(onS)){promptEl.innerHTML=`<b>[Rechtsklick]</b>Von Bord gehen`;promptEl.hidden=false;return true;}}
  const b=boatLooked();if(b){promptEl.innerHTML=b.T.sail?`<b>[Rechtsklick]</b>An Bord gehen`:`<b>[Rechtsklick]</b>${b.T.name}: einsteigen <b>[${sk} + Rechtsklick]</b>einpacken`;promptEl.hidden=false;return true;}
  const h=inv[HOT0+sel];if(h&&BOAT_T[h.id]&&!boatIn&&!onS&&P.x<60000&&boatWaterSpot()){promptEl.innerHTML=`<b>[Rechtsklick]</b>${BOAT_T[h.id].name} ins Wasser setzen`;promptEl.hidden=false;return true;}
  return sp0();};}
addEventListener('keydown',e=>{if(boatIn&&state==='playing'&&e.code===settings.keys.sneak&&!e.repeat){if(boatIn.T.sail){boatIn.v*=.6;boatIn=null;}else boatLeave();}});
// ---------- Schlagen: Boote nichts, das Schiff nur zerstören ----------
{const gh0=gatherHit;gatherHit=function(W){const b=P.x<60000&&!shipAt(P.x,P.z,P.y)?boatLooked(3.6):null;
  if(b&&b.T.sail){b.d.hp=(b.d.hp==null?SHIP.HP:b.d.hp)-1;b.hitT=.25;Snd.chop();const[lx,lz]=boatLocal(b,P.x,P.z),[x,z]=boatWorld(b,clamp(lx,-b.T.L/2,b.T.L/2),clamp(lz,-b.T.W/2,b.T.W/2));
    for(let i=0;i<8;i++)spawnParticle(x,WATER+.8+Math.random(),z,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,0x7a5228,.7,.2);
    if(b.d.hp<=0)shipWreck(b);return true;}
  return gh0(W);};}
function shipWreck(b){const near=boatLeaveSpotNear(b);for(const[id,n]of[['wood',30],['rope',6],['wool',4],['iron_ingot',2]])spawnDrop(id,n,near[0],getHeight(near[0],near[1])+.5,near[1]);
  for(const k of b.d.cannons||[])spawnDrop('cannon',1,near[0],getHeight(near[0],near[1])+.6,near[1]);
  for(const f of FURN.filter(f=>f.ship===b.d.id)){spawnDrop(f.type,1,near[0],getHeight(near[0],near[1])+.6,near[1]);f.t.r=0;FURN.splice(FURN.indexOf(f),1);}furnSave();renderFurn();
  for(let i=0;i<60;i++)spawnParticle(b.d.x+(Math.random()-.5)*b.T.L,WATER+Math.random()*3,b.d.z+(Math.random()-.5)*b.T.L,(Math.random()-.5)*5,Math.random()*5,(Math.random()-.5)*5,i%2?0x7a5228:0xe8f4ff,1.4,.35);
  try{Snd.crash();}catch(e){Snd.boom(.3);}boatRemove(b);saveGame();}
function boatLeaveSpotNear(b){const[lx,lz]=boatLocal(b,P.x,P.z);for(let r=0;r<8;r+=.8){const x=P.x+(P.x-b.d.x)/(Math.hypot(P.x-b.d.x,P.z-b.d.z)||1)*r,z=P.z+(P.z-b.d.z)/(Math.hypot(P.x-b.d.x,P.z-b.d.z)||1)*r;if(!isWater(x,z,0))return[x,z];}return[P.x,P.z];}
// ---------- Möbel an Bord ----------
{const pf0=placeFurn;placeFurn=function(type){const b=shipAt(P.x,P.z,P.y);if(!b)return pf0(type);const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),x=P.x+fx*1.4,z=P.z+fz*1.4;
  const[lx,lz]=boatLocal(b,x,z),lvl=P.y>WATER+SHIP.MD-.6?SHIP.MD:SHIP.LD,inH=lx>SHIP.HX0-.4&&lx<SHIP.HX1+.4&&Math.abs(lz)<SHIP.HZ+.4;
  if(inH||Math.abs(lz)>hwAt(b.T,lx)*(lvl===SHIP.LD?.78:1)-.45||Math.abs(lx)>b.T.L/2-.8||(lvl===SHIP.LD&&(lx<SHIP.LX0||lx>SHIP.LX1))){try{Snd.click();}catch(e){}return;}
  if(FURN.length>=120)return;removeItem(type,1);const f=addFurn(type,x,z);f.t.r=0;f.ship=b.d.id;f.lx=lx;f.lz=lz;f.ly=lvl;f.y=WATER+lvl-.03;furnSave();renderFurn();Snd.chop();saveGame();};}
{const fs0=furnSave;furnSave=function(){fs0();FURN.forEach((f,i)=>{if(f.ship&&FLAGS.furn[i])FLAGS.furn[i].push(f.ship,+f.lx.toFixed(2),+f.lz.toFixed(2),f.ly);});};}
{const sy0=syncFurn;syncFurn=function(){sy0();(FLAGS.furn||[]).forEach((e,i)=>{const f=FURN[i];if(f&&e[4]){f.ship=e[4];f.lx=e[5];f.lz=e[6];f.ly=e[7];f.t.r=0;}});};}
function shipFurnFollow(){let ch=false;for(const f of FURN){if(!f.ship)continue;const b=BOATS.find(b=>b.d.id===f.ship);if(!b){continue;}const[x,z]=boatWorld(b,f.lx,f.lz),y=WATER+f.ly+(b.bob||0)-.03;
    if(Math.abs(x-f.x)>.001||Math.abs(z-f.z)>.001||Math.abs(y-f.y)>.004){f.x=x;f.z=z;f.y=y;f.t.x=x;f.t.z=z;ch=true;}}if(ch)renderFurn();}
// ---------- Fahren ----------
const BOAT_KEYS=['forward','back','left','right','jump','sprint','sneak'];
function boatDrive(b,dt){const T=b.T,fwd=down('forward'),back=down('back'),fast=down('sprint');
  const vmax=fast?T.vs:T.v,target=fwd?vmax:back?-T.v*.3:0,acc=fwd||back?T.acc:T.acc*.45;b.v+=clamp(target-b.v,-acc*dt*(fwd||back?1:1.4),acc*dt);
  let turn=0;if(fwd||Math.abs(b.v)>.6){let dy=P.yaw-b.d.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));const k=T.turn*(.35+.65*Math.min(1,Math.abs(b.v)/T.v))*dt;turn=clamp(dy,-k,k);
    if(down('left'))turn=T.turn*.8*dt;if(down('right'))turn=-T.turn*.8*dt;}
  else if(down('left')||down('right'))turn=(down('left')?1:-1)*T.turn*.5*dt;
  const ox=b.d.x,oz=b.d.z,oy=b.d.yaw;
  const ny=b.d.yaw+turn;if(boatFits(T,b.d.x,b.d.z,ny))b.d.yaw=ny;b.turnV=turn/dt;
  b.roll+=(clamp(-turn/dt*.08*Math.sign(b.v||1),-.12,.12)-b.roll)*Math.min(1,dt*3);
  const fx=-Math.sin(b.d.yaw),fz=-Math.cos(b.d.yaw),nx=b.d.x+fx*b.v*dt,nz=b.d.z+fz*b.v*dt;
  if(Math.abs(b.v)>.01){if(boatFits(T,nx,nz,b.d.yaw)&&!boatHitsOther(b,nx,nz)){b.d.x=nx;b.d.z=nz;}
    else{const sx=b.d.x+fx*b.v*dt,sz=b.d.z;if(boatFits(T,sx,sz,b.d.yaw)&&Math.abs(fx)>.3){b.d.x=sx;b.v*=.85;}else if(boatFits(T,b.d.x,b.d.z+fz*b.v*dt,b.d.yaw)&&Math.abs(fz)>.3){b.d.z+=fz*b.v*dt;b.v*=.85;}
      else{if(Math.abs(b.v)>3)Snd.thud();b.v=-b.v*.15;}}}
  // Mitfahrer an Deck (Begleiter) mitnehmen
  if(T.sail&&(b.d.x!==ox||b.d.z!==oz||b.d.yaw!==oy)){const c0=Math.cos(oy+Math.PI/2),s0=Math.sin(oy+Math.PI/2);for(const e of DEM){if(e.dead||e.fac!=='ally')continue;const dx=e.x-ox,dz=e.z-oz,lx=dx*c0-dz*s0,lz=dx*s0+dz*c0;
      if(Math.abs(lx)<T.L/2&&Math.abs(lz)<hwAt(T,lx)&&e.y>WATER+SHIP.LD-.5){const[x,z]=boatWorld(b,lx,lz);e.x=x;e.z=z;}}}
  const sp=Math.abs(b.v);if(sp>1.5&&Math.random()<dt*sp*1.6){const sd=Math.random()<.5?-1:1,[x,z]=boatWorld(b,T.L/2*.62,sd*(T.W/2+.25)),[ox2,oz2]=boatWorld(b,T.L/2*.62,sd*(T.W/2+1.2));spawnParticle(x,WATER+.05,z,(ox2-x)*1.2,.5+sp*.06,(oz2-z)*1.2,0xeef8ff,.45,.09);}
  if(sp>1&&Math.random()<dt*2){const[x,z]=boatWorld(b,-T.L/2-.6,(Math.random()-.5)*T.W*.5);spawnParticle(x,WATER+.03,z,0,.1,0,0xd8ecf8,.8,.1);}
  b.stroke=(b.stroke||0)+dt*(sp>.3?(T.oars?1.4+sp*.12:0):0);
  if(T.oars&&sp>.4&&Math.floor(b.stroke)!==Math.floor(b.stroke-dt*(1.4+sp*.12))){try{Snd.whoosh(300,.05);}catch(e){}}}
// Auf dem Schiff herumlaufen: Reling, Kajütenwand, Masten, Unterdeck
function segPush(lx,lz,ax,az,bx,bz,r){const dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz,t=clamp(((lx-ax)*dx+(lz-az)*dz)/l2,0,1),px=ax+dx*t,pz=az+dz*t,d=Math.hypot(lx-px,lz-pz);if(d>=r||d<1e-6)return[lx,lz];return[px+(lx-px)/d*r,pz+(lz-pz)/d*r];}
function shipCollide(b,prev){const S=SHIP,T=b.T,y0=WATER+(b.bob||0);let[lx,lz]=boatLocal(b,P.x,P.z);const main=P.y>y0+S.MD-.5;
  if(main){if(P.y<y0+S.MD+.95){const hw=hwAt(T,lx)-.32;if(hw<.05||lx>T.L/2-.45||lx<-T.L/2+.35){[lx,lz]=boatLocal(b,prev[0],prev[1]);}else lz=clamp(lz,-hw,hw);}
    if(P.y<y0+S.MD+S.CABH-.1){const cw=hwAt(T,S.CAB1)-.2;for(const[a,c]of[[-cw,-S.DOOR],[S.DOOR,cw]])[lx,lz]=segPush(lx,lz,S.CAB1,a,S.CAB1,c,.3);}
    for(const[mx,r]of[[S.MAST,.36],[S.FMAST,.32],[S.WHEEL,.42]]){const d=Math.hypot(lx-mx,lz);if(d<r&&d>1e-4){lx=mx+(lx-mx)/d*r;lz=lz/d*r;}}
    for(const k of b.d.cannons||[]){const[cx,cz]=cannonLocal(T,k),d=Math.hypot(lx-cx,lz-cz);if(d<.65&&d>1e-4){lx=cx+(lx-cx)/d*.65;lz=cz+(lz-cz)/d*.65;}}}
  else{const inH=lx>S.HX0-.1&&lx<S.HX1&&Math.abs(lz)<S.HZ;lx=clamp(lx,S.LX0+.3,inH?S.HX1:S.LX1-.3);const hw=hwAt(T,lx)*.78-.3;lz=clamp(lz,-hw,hw);
    if(!inH&&P.y+1.75>y0+S.MD-.05&&P.vy>0){P.vy=0;P.y=y0+S.MD-1.8;}const d=Math.hypot(lx-S.MAST,lz);if(d<.36&&d>1e-4){lx=S.MAST+(lx-S.MAST)/d*.36;lz=lz/d*.36;}}
  const[x,z]=boatWorld(b,lx,lz);P.x=x;P.z=z;}
{const up1=updatePlayer;updatePlayer=function(dt){const b=boatIn;
  if(!b||state!=='playing'){const px=P.x,pz=P.z,before=P.x<60000?shipAt(P.x,P.z,P.y):null;up1(dt);if(state==='playing'&&P.x<60000){const s=before||shipAt(P.x,P.z,P.y);if(s&&(before||shipAt(P.x,P.z,P.y)))shipCollide(s,[px,pz]);}return;}
  if(!BOATS.includes(b)){boatIn=null;up1(dt);return;}
  boatDrive(b,dt);boatPose(b,0);const[x,z]=boatWorld(b,b.T.seat[0],b.T.seat[1]),py=b.T.sail?WATER+SHIP.MD+(b.bob||0):boatDeckY(b);P.x=x;P.z=z;P.y=py;P.vx=P.vz=P.vy=0;P.ground=true;
  const held=[];for(const k of BOAT_KEYS){const c=settings.keys[k];if(keys.has(c)){keys.delete(c);held.push(c);}}
  try{up1(dt);}finally{for(const c of held)keys.add(c);}
  P.x=x;P.z=z;P.y=py;P.vx=-Math.sin(b.d.yaw)*b.v;P.vz=-Math.cos(b.d.yaw)*b.v;boatSaveT+=dt;};}
function boatPose(b,dt){const T=b.T;b.ph+=dt||0;const t=time+b.ph,sp=Math.abs(b.v);b.bob=Math.sin(t*1.6)*.035*(T.sail?.4:1);
  const m=b.mesh,inn=m.userData.inner;m.position.set(b.d.x,WATER+b.bob,b.d.z);m.rotation.y=b.d.yaw+Math.PI/2;
  inn.rotation.x=(b.roll||0)*(T.sail?.4:1)+Math.sin(t*1.1)*.025*(T.sail?.25:1);inn.rotation.z=Math.sin(t*.9+1)*.02*(T.sail?.4:1)-Math.min(.05,sp*.004);
  if(b.hitT>0){b.hitT-=dt||0;m.position.x+=(Math.random()-.5)*.06;}
  if(m.userData.oars){const st=b.stroke||0;for(const o of m.userData.oars){const s=o.userData.s,a=Math.sin(st*Math.PI*2);o.rotation.y=-s*a*.5*Math.min(1,sp/2);o.rotation.x=s*(-.25+Math.cos(st*Math.PI*2)*.12*Math.min(1,sp/2));}}
  if(m.userData.wheel)m.userData.wheel.rotation.x+=((b.turnV||0)*-1.2-m.userData.wheel.rotation.x*0)*(dt||0);
  if(m.userData.flag)m.userData.flag.rotation.y=Math.sin(time*3+b.ph)*.3;
  for(const S of m.userData.sails){const g=S.m.geometry.attributes.position,P0=S.P0,k=boatIn===b?.25+Math.min(1,sp/T.v)*.6:.12;
    for(let i=0;i<g.count;i++){const x=P0[i*3],y=P0[i*3+1],e=(1-Math.pow(x/(S.w/2),2))*(1-Math.pow(y/(S.h/2),2)*.5);g.array[i*3+2]=P0[i*3+2]+e*k*(1+.08*Math.sin(time*3+y));}g.needsUpdate=true;}}
// ---------- Zeichnen: drinnen 3D, draußen 2D ----------
function updateBoats(dt){boatSync();const cx=camera.position.x,cz=camera.position.z,onS=P.x<60000?shipAt(P.x,P.z,P.y):null;let n=0;
  const G=boatBBMesh&&boatBBMesh.geometry.attributes,fx=Math.cos(P.yaw),fz=-Math.sin(P.yaw);
  for(const b of BOATS){const far=Math.hypot(b.d.x-cx,b.d.z-cz)>440||cx>60000;if(b!==boatIn)b.v*=Math.exp(-dt*1.2);
    const in3D=!far&&(b===boatIn||b===onS);b.mesh.visible=in3D;if(!far)boatPose(b,dt);
    if(in3D||far||!G||n>=BOAT_BB_N)continue;
    // Ansicht wählen: Seite, Bug oder Heck
    const vx=b.d.x-cx,vz=b.d.z-cz,vl=Math.hypot(vx,vz)||1,bfx=-Math.sin(b.d.yaw),bfz=-Math.cos(b.d.yaw),dot=(bfx*vx+bfz*vz)/vl,view=dot>.78?'b':dot<-.78?'f':'s',spr='b2_'+b.d.t+'_'+view,s=SPR[spr];if(!s)continue;
    const k=b.T.ppm,w=s.w/k,h=s.h/k,flip=view==='s'&&(bfx*fx+bfz*fz)<0,shx=view==='s'?((b.T.L+(b.T.sail?2.8:2.4))/2-(b.T.sail?.6:1.2)-b.T.L/2)*(flip?-1:1):0;
    G.offset.array[n*3]=b.d.x+fx*shx;G.offset.array[n*3+1]=WATER-.25+(b.bob||0);G.offset.array[n*3+2]=b.d.z+fz*shx;
    G.size.array[n*2]=w;G.size.array[n*2+1]=h;G.uvr.array[n*4]=flip?s.u+s.du:s.u;G.uvr.array[n*4+1]=s.v;G.uvr.array[n*4+2]=flip?-s.du:s.du;G.uvr.array[n*4+3]=s.dv;G.tint.array[n]=b.hitT>0?1.4:1;G.rot.array[n]=0;n++;}
  if(G){boatBBMesh.geometry.instanceCount=n;for(const k of['offset','size','uvr','tint','rot'])G[k].needsUpdate=true;}
  shipFurnFollow();updateCBalls(dt);
  if(boatIn&&(P.x>60000||state==='dead'))boatIn=null;}
{const ud1=updateDemons;updateDemons=function(dt){ud1(dt);try{updateBoats(dt);}catch(e){if(!updateBoats.err){updateBoats.err=1;console.error('Boote',e);}}};}
{const pd0=playerDie;playerDie=function(){if(boatIn)boatIn=null;return pd0.apply(this,arguments);};}
{const sg0=startGame;startGame=function(){boatIn=null;boatArr=null;return sg0.apply(this,arguments);};}
// ---------- Jorin, der Hafenmeister in der Kaiserstadt ----------
const JORIN_LOOK={race:'human',sex:'m',age:'old',skin:1,hair:'short',hairColor:'white',beard:'long',cloth:'leather',clothColor:'blue',pants:'brown',eyes:'blue'};
let jorinE=null,jorinMesh=null;
SHOPS.Jorin={title:'Jorins Werft',greet:'Boote, Schiffe, Kanonen. Alles seetüchtig, alles teuer. So ist das am Hafen.',buy:[['boat_s',180],['boat_m',520],['ship',4800],['cannon',650],['cannonball',22],['rope',6]],sell:[['wood',1],['rope',3],['wool',4]]};
DIALOGS.Jorin={start:()=>'hello',nodes:{hello:()=>({text:'Jorin, Hafenmeister. Wenn es schwimmt, verkaufe ich es dir. Ein Schiff baust du dir besser selbst, wenn du genug Holz, Wolle und Seile hast. Oder du zahlst.',
  opts:[{label:'Zeig mir deine Boote.',act:()=>{openShop('Jorin');return null;}},{label:'Wie fährt man ein Schiff?',go:'how'},{label:'Bis bald.',go:null}]}),
  how:()=>({text:'Setz es aufs tiefe Wasser. Dann geh an Bord, stell dich ans Steuerrad und los geht es. Kanonen schraubst du an die Reling, Möbel kannst du an Deck und in der Kajüte aufstellen. Die bleiben, wo du sie hinstellst.',opts:[{label:'Danke.',go:'hello'}]})}};
DT.harbm={name:'Jorin',fac:'neutral',h:1.8,hp:999,dmg:0,spd:1,reach:1,cd:1,hero:1,spr:'jor_',rad:.35};
function initJorin(){const cv=document.createElement('canvas');cv.width=64;cv.height=64;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;const c=drawHero(JORIN_LOOK,0);x.drawImage(c,0,64-c.height);
  SPR.jor_0={c,w:c.width,h:c.height,u:0,v:0,du:c.width/64,dv:c.height/64};const tex=new THREE.CanvasTexture(cv);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  const m=bbMaterial(tex,0,0);EXTRA_BB.push(m);jorinMesh=makeBillboards([{x:0,y:-999,z:0,w:.01,h:.01,spr:'jor_0',tint:1}],m);jorinMesh.frustumCulled=false;jorinMesh.geometry.instanceCount=0;scene.add(jorinMesh);}
{const i4=initDemons;initDemons=function(a){i4(a);try{initJorin();}catch(e){console.error('Jorin',e);}};}
function ensureJorin(){if(!jorinMesh||(jorinE&&DEM.includes(jorinE)))return;const x=HARB.x+HARB.r+3.2,z=HARB.z+3;
  jorinE=spawnEnt('harbm',x,z,{name:'Jorin',role:'Hafenmeister',always:true,noHostile:true,ownMesh:jorinMesh,ownI:0,promptName:'Mit Jorin',portrait:frogPortrait(JORIN_LOOK),special:e=>{e.frame=0;return true;}});}
{const sl3=storyLooked;storyLooked=function(){const v=sl3();if(v)return v;return jorinE&&!jorinE.dead?lookNPC([jorinE],3.6):null;};}
{const ud3=updateDemons;updateDemons=function(dt){try{ensureJorin();}catch(e){}ud3(dt);};}
