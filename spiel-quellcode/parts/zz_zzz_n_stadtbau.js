/* =========================================================
   0.0.119 · Die Dungeon-Stadt, neu angelegt
   - Richtiges Straßennetz: Turmring, Heldenallee, Westweg, Nord- und Südtorgasse, Handelsgasse, Krämergasse,
     Rosen-, Linden-, Brunnen-, Gilden-, Arena-, Kupfer-, Hafer- und Ostgasse. Gepflastert, mit Straßenschildern.
   - Plätze: Marktplatz mit Ständen und großem Brunnen, Gartenplatz mit Bäumen und Bänken, Gildenplatz, Arenaplatz, Westbrunnen
   - Häuser stehen ordentlich an den Straßen, mit Laternen, Bäumen, Blumenkübeln und Wirtshaus
   - Mietshäuser: bei Hausverwalterin Elsbeth wochenweise mieten, mit Bett und Truhe
   ========================================================= */
// Straßen in Turmkoordinaten (x nach Osten, z nach Süden)
const CITY_ST=[
  {n:'Heldenallee',w:14,p:[[81,0],[228,0]]},{n:'Westweg',w:10,p:[[-81,0],[-228,0]]},{n:'Nordweg',w:10,p:[[0,-81],[0,-113]]},
  {n:'Nordtorgasse',w:8,p:[[20,-122],[46,-122],[46,-196],[0,-214],[0,-229]]},{n:'Südtorgasse',w:8,p:[[10,90],[52,116],[52,196],[0,214],[0,229]]},
  {n:'Handelsgasse',w:8,p:[[62,-45],[214,-45]]},{n:'Krämergasse',w:8,p:[[62,45],[214,45]]},{n:'Ostgasse',w:7,p:[[200,-110],[200,110]]},
  {n:'Rosengasse',w:7,p:[[-58,-50],[-205,-50]]},{n:'Lindengasse',w:7,p:[[-58,50],[-205,50]]},{n:'Brunnengasse',w:7,p:[[-135,-160],[-135,160]]},
  {n:'Gildengasse',w:7,p:[[-40,-122],[-90,-122],[-135,-150]]},{n:'Arenagasse',w:7,p:[[-50,92],[-100,112],[-135,150]]},
  {n:'Kupfergasse',w:7,p:[[46,-140],[150,-140],[200,-100]]},{n:'Hafergasse',w:7,p:[[52,140],[150,140],[200,100]]}];
const CITY_PL=[{n:'Gildenplatz',x0:-40,x1:20,z0:-133,z1:-111},{n:'Arenaplatz',x0:-50,x1:10,z0:80,z1:99},{n:'Marktplatz',x0:104,x1:196,z0:-40,z1:-10},{n:'Gartenplatz',x0:104,x1:196,z0:10,z1:40}];
const CITY_RD=[{n:'Westbrunnen',x:-135,z:0,r:12}];
const ctSegD=(px,pz,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz||1;let t=((px-a[0])*dx+(pz-a[1])*dz)/L2;t=t<0?0:t>1?1:t;return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t);};
function cityFreeAt(lx,lz,pad){pad=pad||0;const d=Math.hypot(lx,lz);if(d<84+pad||d>TWC.WR-12-pad)return false;
  for(const S of CITY_ST)for(let i=0;i<S.p.length-1;i++)if(ctSegD(lx,lz,S.p[i],S.p[i+1])<S.w/2+.6+pad)return false;
  for(const Q of CITY_PL)if(lx>Q.x0-pad&&lx<Q.x1+pad&&lz>Q.z0-pad&&lz<Q.z1+pad)return false;for(const C of CITY_RD)if(Math.hypot(lx-C.x,lz-C.z)<C.r+pad)return false;
  const gx=GH.x-TWC.x,gz=GH.z-TWC.z;if(Math.abs(lx-gx)<GH.w/2+5+pad&&Math.abs(lz-gz)<GH.d/2+5+pad)return false;
  if(Math.hypot(lx-(AR.x-TWC.x),lz-(AR.z-TWC.z))<AR.R1+6+pad)return false;
  const hx=TWH.x-TWC.x,hz=TWH.z-TWC.z;if(Math.abs(lx-hx)<TWH.w/2+3+pad&&Math.abs(lz-hz)<TWH.d/2+3+pad)return false;
  if(Math.abs(lx-93)<5&&Math.abs(lz+16)<4)return false;return true;}
// Gebäude-Rechtecke (gedreht) gegeneinander prüfen
function ctCorners(x,z,w,d,ry){const c=Math.cos(ry),s=Math.sin(ry),L=[];for(const[a,b]of[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]])L.push([x+a*c+b*s,z-a*s+b*c]);return L;}
function ctHas(R,px,pz){const c=Math.cos(R.ry),s=Math.sin(R.ry),dx=px-R.x,dz=pz-R.z,lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.abs(lx)<R.w/2+1.2&&Math.abs(lz)<R.d/2+1.2;}
const CITY={lots:[],rent:[],fount:[],signs:[],built:false};
// Grundstücke entlang der Straßen (feste Anordnung)
function cityLots(){const r=mulberry32(9191),L=[];
  for(const S of CITY_ST)for(let i=0;i<S.p.length-1;i++){const a=S.p[i],b=S.p[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len,nx=-uz,nz=ux;
    for(const sd of[-1,1]){let t=7+r()*4;while(t<len-7){const w=8+r()*3.5,d=7+r()*2.5,off=S.w/2+1.6+d/2,cx=a[0]+ux*(t+w/2)+nx*sd*off,cz=a[1]+uz*(t+w/2)+nz*sd*off,fx=-nx*sd,fz=-nz*sd,ry=Math.atan2(fx,fz);
        const R={x:cx,z:cz,w,d,ry,street:S.n};const pts=ctCorners(cx,cz,w-.6,d-.6,ry).concat([[cx,cz]]);
        if(pts.every(([px,pz])=>cityFreeAt(px,pz,0))&&!L.some(o=>ctHas(o,cx,cz)||pts.some(([px,pz])=>ctHas(o,px,pz))||ctCorners(o.x,o.z,o.w,o.d,o.ry).some(([px,pz])=>ctHas(R,px,pz)))){L.push(R);t+=w+2.4+r()*2.5;}else t+=3;}}}
  return L;}
// =========================================================
// Materialien: Pflaster mit Weltmaßstab
// =========================================================
let CTYM=null;function cityMats(){if(CTYM)return CTYM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  const cob=new Px(32,32);{const S=pal(['#3e3a34','#56514a','#6c665c','#827b6e','#968e80']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=y>>2,o=(row%2)*3,ed=(x+o)%6===0||y%4===0;cob.set(x,y,S[ed?0:shadeIdx(.55+(hash2((x+o)/6|0,row,331)-.5)*.5+(hash2(x,y,332)-.5)*.15,5,x,y)]);}}
  const fl=new Px(32,32);{const S=pal(['#5a564e','#8a8478','#a29c8e','#b8b2a2','#cac4b4']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const ed=x%16===0||y%16===0||(y<16&&x===8)||(y>=16&&x===24);fl.set(x,y,S[ed?0:shadeIdx(.6+(hash2(x>>3,y>>3,341)-.5)*.35+(hash2(x,y,342)-.5)*.12,5,x,y)]);}}
  const water=new THREE.MeshBasicMaterial({color:0x3a8ab0,transparent:true,opacity:.8});
  const L=m=>new THREE.MeshLambertMaterial({map:T(m),polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  CTYM={pave:L(cob.done()),plaza:L(fl.done()),water,bark:new THREE.MeshLambertMaterial({color:0x5a3a20}),leaf1:new THREE.MeshLambertMaterial({color:0x3a7a2e,flatShading:true}),leaf2:new THREE.MeshLambertMaterial({color:0x4e9438,flatShading:true}),
    leaf3:new THREE.MeshLambertMaterial({color:0x2e6a3a,flatShading:true}),flowers:[0xd84a4a,0xe8c040,0xa04ad8,0xf0f0f0,0xe87ab0].map(c=>new THREE.MeshLambertMaterial({color:c})),soil:new THREE.MeshLambertMaterial({color:0x4a3220})};return CTYM;}
// flache, gekachelte Fläche (4 m pro Kachel)
function cityFlat(MG,mat,len,w,x,z,ang,y){const g=new THREE.PlaneGeometry(len,w);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*len/4,uv.getY(i)*w/4);mgPush(MG,mat,g,x,y,z,-ang);}
// =========================================================
// Die Stadt aufbauen (wird aus twBuild aufgerufen)
// =========================================================
function twCity(K){const{M,MG,put,box,B,sol,r,grp,H,X,Z}=K,C=cityMats(),AW=[M.red,M.blue,M.green,M.yellow];
  const W=(lx,lz)=>[X+lx,Z+lz];
  // ---- Straßen ----
  {const g=new THREE.RingGeometry(70,82,72,1);g.rotateX(-Math.PI/2);const uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,pos.getX(i)/4,pos.getZ(i)/4);mgPush(MG,C.pave,g,X,H+.07,Z,0);}
  for(const S of CITY_ST){for(let i=0;i<S.p.length-1;i++){const a=S.p[i],b=S.p[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);cityFlat(MG,C.pave,len+S.w*.6,S.w,X+(a[0]+b[0])/2,Z+(a[1]+b[1])/2,ang,H+.08);
      // Bordstein
      for(const sd of[-1,1]){const nx=-Math.sin(ang),nz=Math.cos(ang);put(M.stone,B(len,.18,.3),X+(a[0]+b[0])/2+nx*sd*(S.w/2+.15),H+.1,Z+(a[1]+b[1])/2+nz*sd*(S.w/2+.15),-ang);}}
    for(let i=1;i<S.p.length-1;i++){const g=new THREE.CircleGeometry(S.w/2+.2,16);g.rotateX(-Math.PI/2);const uv=g.attributes.uv,pos=g.attributes.position;for(let k=0;k<uv.count;k++)uv.setXY(k,pos.getX(k)/4,pos.getZ(k)/4);mgPush(MG,C.pave,g,X+S.p[i][0],H+.085,Z+S.p[i][1],0);}}
  for(const Q of CITY_PL){cityFlat(MG,C.plaza,Q.x1-Q.x0,Q.z1-Q.z0,X+(Q.x0+Q.x1)/2,Z+(Q.z0+Q.z1)/2,0,H+.09);}
  for(const Q of CITY_RD){const g=new THREE.CircleGeometry(Q.r,32);g.rotateX(-Math.PI/2);const uv=g.attributes.uv,pos=g.attributes.position;for(let k=0;k<uv.count;k++)uv.setXY(k,pos.getX(k)/4,pos.getZ(k)/4);mgPush(MG,C.plaza,g,X+Q.x,H+.09,Z+Q.z,0);}
  // ---- Brunnen ----
  CITY.fount=[];const fountain=(lx,lz,R,big)=>{const[x,z]=W(lx,lz);put(M.stone,new THREE.CylinderGeometry(R,R+.2,.9,20),x,H+.45,z);put(C.water,new THREE.CylinderGeometry(R-.35,R-.35,.08,20),x,H+.82,z);
    put(M.stone,new THREE.CylinderGeometry(.45,.6,big?3:2,10),x,H+(big?1.5:1),z);put(M.stone,new THREE.CylinderGeometry(big?1.6:1,.4,.4,14),x,H+(big?3:2),z);put(C.water,new THREE.CylinderGeometry(big?1.4:.85,big?1.4:.85,.06,14),x,H+(big?3.2:2.2),z);
    if(big){put(M.marble,new THREE.CylinderGeometry(.25,.35,1.4,8),x,H+3.9,z);put(M.gold,new THREE.SphereGeometry(.45,10,8),x,H+4.8,z);}
    sol.push(solAdd({x,z,hw:R*.88,hd:R*.88,y0:H-2,y1:H+.9,rot:0,solid:1,tw:1}),solAdd({x,z,hw:R*.88,hd:R*.88,y0:H-2,y1:H+.9,rot:Math.PI/4,solid:1,tw:1}));CITY.fount.push({x,z,y:H+(big?3.3:2.3),R,big});};
  fountain(150,-25,5,true);fountain(150,25,3.6,false);fountain(-135,0,4.2,true);fountain(-31,-119,2.6,false);
  // ---- Bäume ----
  const tree=(lx,lz,s)=>{const[x,z]=W(lx,lz);s=s||1;const h=2.4*s;put(C.bark,new THREE.CylinderGeometry(.18*s,.26*s,h,6),x,H+h/2,z);const lm=[C.leaf1,C.leaf2,C.leaf3][(r()*3)|0];
    put(lm,new THREE.IcosahedronGeometry(1.7*s,0),x,H+h+1*s,z,r()*6);put(lm,new THREE.IcosahedronGeometry(1.25*s,0),x+.6*s,H+h+.3*s,z+.4*s,r()*6);put(lm,new THREE.IcosahedronGeometry(1.1*s,0),x-.6*s,H+h+.5*s,z-.3*s,r()*6);
    sol.push(solAdd({x,z,hw:.3*s,hd:.3*s,y0:H-2,y1:H+h,rot:0,solid:1,tw:1}));};
  for(let k=0;k<24;k++){const a=k/24*6.283+.13,lx=Math.cos(a)*87,lz=Math.sin(a)*87;if(cityFreeAt(lx,lz,0))tree(lx,lz,1.1);}
  for(let x=-216;x<=-90;x+=14)for(const sd of[-1,1])if(cityFreeAt(x,sd*8.5,-1.5))tree(x,sd*8.5,1);
  for(let i=0;i<4;i++)for(const lz of[16,34]){const lx=112+i*25;if(Math.abs(lx-150)>8)tree(lx,lz,1.2);}
  for(const[lx,lz]of[[-120,-14],[-150,-14],[-120,14],[-150,14],[-34,-128],[14,-128],[-46,84],[4,84]])tree(lx,lz,1);
  // Bänke und Blumenkübel am Gartenplatz und Westbrunnen
  const bench=(lx,lz,ry)=>{const[x,z]=W(lx,lz);put(M.wood,B(2,.12,.6),x,H+.5,z,ry);put(M.wood,B(2,.5,.1),x+Math.sin(ry)*-.3,H+.8,z+Math.cos(ry)*-.3,ry);for(const sd of[-1,1])put(M.dark,B(.1,.45,.5),x+Math.cos(ry)*sd*.85,H+.23,z-Math.sin(ry)*sd*.85,ry);};
  const planter=(lx,lz)=>{const[x,z]=W(lx,lz);put(M.wood,B(1.6,.6,1.6),x,H+.3,z);put(C.soil,B(1.4,.1,1.4),x,H+.62,z);for(let k=0;k<6;k++)put(C.flowers[(r()*5)|0],B(.25,.25,.25),x+(r()-.5)*1.1,H+.8,z+(r()-.5)*1.1);sol.push(solAdd({x,z,hw:.8,hd:.8,y0:H-2,y1:H+.6,rot:0,solid:1,tw:1}));};
  for(const lx of[122,138,162,178])bench(lx,20,Math.PI);for(const lx of[122,138,162,178])bench(lx,30,0);for(const[lx,lz]of[[106,12],[194,12],[106,38],[194,38],[143,25],[157,25]])planter(lx,lz);
  for(const a of[0,Math.PI/2,Math.PI,-Math.PI/2])bench(-135+Math.cos(a+.6)*8,Math.sin(a+.6)*8,-(a+.6)+Math.PI/2);for(const[lx,lz]of[[-138,-9],[-132,9]])planter(lx,lz);
  for(const[lx,lz]of[[-38,-114],[18,-114],[-48,82],[8,82]])planter(lx,lz);
  // ---- Heldenstatuen (Heldenallee) ----
  const HEROES=['Aldric der Erste','Seraphine Sturmklinge','Bruno Eisenfaust','Lyra Mondpfeil','Torvald der Unbeugsame','Elena Lichtbringerin'];
  TWS.statues=[];[100,140,180].forEach((sx,i)=>{for(const sd of[-1,1]){const x=X+sx,z=Z+sd*9.5,k=i*2+(sd>0?1:0);box(M.marble,3,1.6,3,x,H+.8,z,0,true);put(M.marble,B(1.2,2.6,.8),x,H+3,z);put(M.marble,B(.9,.9,.9),x,H+4.75,z);put(M.marble,B(.4,1.6,.4),x+.9*(k%2?1:-1),H+3.4,z,0,0,(k%2?-1:1)*.5);
    if(k%3===0)put(M.marble,B(.15,3,.4),x-.9,H+4.6,z);else if(k%3===1)put(M.marble,B(1.4,1.6,.2),x-1,H+3.2,z-.6*sd);else put(M.marble,new THREE.CylinderGeometry(.08,.08,3.4,6),x+1.2,H+3.8,z);
    put(M.gold,B(1.6,.4,.1),x,H+1.2,z-sd*1.55);TWS.statues.push({x,z,n:HEROES[k]});}});
  // ---- Obelisk am Arenaplatz ----
  {const[x,z]=W(-20,89);box(M.stone,2.4,1,2.4,x,H+.5,z,0,true);put(M.marble,new THREE.CylinderGeometry(.35,.7,7,4),x,H+4.5,z,Math.PI/4);put(M.gold,new THREE.ConeGeometry(.45,1,4),x,H+8.5,z,Math.PI/4);}
  // ---- Marktstände ----
  TWS.stalls=[];const stall=(lx,lz,sd,i)=>{const[x,z]=W(lx,lz);box(M.wood,4.4,1.1,2,x,H+.55,z,0,true);for(const[ox,oz]of[[-2,-1],[2,-1],[-2,1],[2,1]])put(M.wood,B(.2,2.8,.2),x+ox,H+1.4,z+oz);
    put(AW[i%4],B(5,.15,3),x,H+2.85,z,0,sd*.18);put(M.yellow,B(.6,.4,.6),x-1.2,H+1.3,z);put(M.green,B(.5,.4,.5),x+.2,H+1.3,z);put(M.red,B(.5,.3,.5),x+1.3,H+1.25,z);
    for(let k=0;k<2;k++)put(M.wood,new THREE.CylinderGeometry(.35,.35,.8,8),x+(k?2.8:-2.8),H+.4,z-sd*.6);TWS.stalls.push({x,z:z-sd*2.2,sd});};
  [114,128,142,158,172,186].forEach((lx,i)=>stall(lx,-34,-1,i));[114,128,172,186].forEach((lx,i)=>stall(lx,-16,1,i+2));
  // ---- Kaufhäuser und Wirtshaus ----
  TWS.shops=[];const bigHouse=(lx,lz,w,d,h,front,wall,sign,label)=>{const[x,z]=W(lx,lz);box(wall,w,h,d,x,H+h/2,z,0,true);put(M.wood,B(w+.4,.6,d+.4),x,H+h/2,z);
    for(const s2 of[-1,1])put(M.roof,B(w+1.2,.4,Math.hypot(d/2+.6,3)),x,H+h+1.5,z+s2*(d/4),0,s2*.5);put(M.roof,B(w+1.2,.6,.6),x,H+h+3,z);const fz=front*(d/2+.05);
    put(M.dark,B(2.4,3.4,.2),x,H+1.7,z+fz);for(const wx of[-w*.32,w*.32])for(const wy of[3,7])if(wy<h-1)put(M.glow,B(1.6,1.4,.2),x+wx,H+wy,z+fz);put(sign,B(Math.min(6,w*.5),1.2,.2),x,H+4.8,z+front*(d/2+.12));
    return{x,z:z+front*(d/2+1.6)};};
  TWS.shops.push(bigHouse(125,-57,16,12,10,1,M.white,M.red),bigHouse(175,-57,16,12,10,1,M.white,M.blue),bigHouse(125,57,16,12,10,-1,M.white,M.green),bigHouse(175,57,16,12,10,-1,M.stone,M.yellow));
  {const p=bigHouse(88,57,13,11,8,-1,M.wood,M.yellow);const[x,z]=W(88,57);put(M.wood,B(.15,.15,2),x+4,H+5.5,z-6.2);put(M.gold,B(1.6,1.1,.12),x+4,H+4.8,z-7.1);put(M.wood,new THREE.CylinderGeometry(.4,.4,.9,8),x-5,H+.45,z-7);put(M.wood,new THREE.CylinderGeometry(.4,.4,.9,8),x-4,H+.45,z-7.2);CITY.tavern=p;}
  // ---- Hausverwaltung (Stand von Elsbeth) ----
  {const[x,z]=W(93,-16);box(M.wood,4,1.1,1.6,x,H+.55,z,0,true);put(M.blue,B(4.6,.15,2.6),x,H+2.8,z);for(const[ox,oz]of[[-1.9,-.7],[1.9,-.7],[-1.9,.7],[1.9,.7]])put(M.wood,B(.18,2.7,.18),x+ox,H+1.35,z+oz);CITY.office={x,z:z-1.8};}
  // ---- Grundstücke: Wohn- und Mietshäuser ----
  if(!CITY.lots.length){CITY.lots=cityLots();const L=CITY.lots.filter(l=>Math.abs(l.ry/(Math.PI/2)-Math.round(l.ry/(Math.PI/2)))<.01);const want=[[-100,-62],[-170,62],[-100,62],[-160,-62],[-120,-130],[110,-130],[120,130],[-80,140]],used=new Set();
    {let b=null,bd=1e9;for(const l of L){const d=Math.hypot(l.x+80,l.z-14);if(d<bd&&!l.rent){bd=d;b=l;}}if(b){b.school=1;CITY.school=b;}}
    CITY.rent=[];want.forEach(([wx,wz],i)=>{let b=null,bd=1e9;for(const l of L){if(used.has(l)||l.school)continue;const d=Math.hypot(l.x-wx,l.z-wz);if(d<bd){bd=d;b=l;}}if(b&&bd<60){used.add(b);b.rent=1;CITY.rent.push({id:'r'+(i+1),n:i+1,lx:b.x,lz:b.z,ry:b.ry,street:b.street,lot:b});}});}
  TWS.houses=[{x:TWH.x,z:TWH.z,r:8,door:[TWH.x,TWH.z+TWH.d/2+1.5]}];
  for(const l of CITY.lots){const[x,z]=W(l.x,l.z),c=Math.cos(l.ry),s=Math.sin(l.ry),door=[x+s*(l.d/2+1.5),z+c*(l.d/2+1.5)];TWS.houses.push({x,z,r:Math.hypot(l.w,l.d)/2,door,lot:l});if(l.rent)continue;
    if(l.school){const h=5.5;box(M.stone,l.w,h,l.d,x,H+h/2,z,l.ry,true);for(const s2 of[-1,1]){const ox=s2*(l.d/4)*s,oz=s2*(l.d/4)*c;put(M.roof,B(l.w+.8,.3,Math.hypot(l.d/2+.4,2.2)),x+ox,H+h+1.05,z+oz,l.ry,s2*.55);}put(M.roof,B(l.w+.8,.4,.4),x,H+h+2.1,z,l.ry);
      put(M.wood,B(1.6,2.2,1.6),x,H+h+3.2,z,l.ry);put(M.roof,new THREE.ConeGeometry(1.4,1.6,4),x,H+h+5.1,z,l.ry+Math.PI/4);put(M.gold,new THREE.SphereGeometry(.35,8,6),x,H+h+3.4,z);
      put(M.dark,B(1.6,2.4,.15),x+s*(l.d/2+.05),H+1.2,z+c*(l.d/2+.05),l.ry);for(const sd of[-1,1])put(M.glow,B(1.4,1.2,.15),x+s*(l.d/2+.05)+c*sd*l.w*.3,H+2.8,z+c*(l.d/2+.05)-s*sd*l.w*.3,l.ry);
      put(M.blue,B(3,.8,.12),x+s*(l.d/2+.12),H+4.1,z+c*(l.d/2+.12),l.ry);CITY.schoolDoor=door;continue;}
    const h=4+r()*3.5,st=r()<.3,wm=st?M.stone:r()<.55?M.white:M.wood,rm=r()<.65?M.roof:M.thatch;box(wm,l.w,h,l.d,x,H+h/2,z,l.ry,true);
    for(const s2 of[-1,1]){const ox=s2*(l.d/4)*s,oz=s2*(l.d/4)*c;put(rm,B(l.w+.8,.3,Math.hypot(l.d/2+.4,2.2)),x+ox,H+h+1.05,z+oz,l.ry,s2*.55);}put(rm,B(l.w+.8,.4,.4),x,H+h+2.1,z,l.ry);
    if(wm!==M.wood){put(M.wood,B(l.w+.1,.2,l.d+.1),x,H+h-.1,z,l.ry);}put(M.dark,B(1.2,2.2,.15),x+s*(l.d/2+.05),H+1.1,z+c*(l.d/2+.05),l.ry);
    for(const sd of[-1,1])put(M.glow,B(1,.9,.15),x+s*(l.d/2+.05)+c*sd*l.w*.3,H+2.6,z+c*(l.d/2+.05)-s*sd*l.w*.3,l.ry);if(r()<.4)put(M.dark,B(.5,1.2,.5),x+c*(l.w/2-1)-s*(l.d/2-1),H+h+1.6,z-s*(l.w/2-1)-c*(l.d/2-1));}
  // ---- Gärten: Bäume und Büsche in den Höfen zwischen den Häusern ----
  {const rg=mulberry32(5151);let n=0;for(let k=0;k<1400&&n<150;k++){const a=rg()*6.283,d=92+rg()*130,lx=Math.cos(a)*d,lz=Math.sin(a)*d;if(!cityFreeAt(lx,lz,1.8))continue;if(CITY.lots.some(l=>ctHas(l,lx,lz)||Math.hypot(l.x-lx,l.z-lz)<Math.max(l.w,l.d)/2+2.2))continue;
    if(rg()<.75){tree(lx,lz,.8+rg()*.6);n++;}else{const[x,z]=W(lx,lz);put(C.leaf2,new THREE.IcosahedronGeometry(.8,0),x,H+.5,z,rg()*6);}}}
  // ---- Laternen an allen Straßen ----
  for(const S of CITY_ST)for(let i=0;i<S.p.length-1;i++){const a=S.p[i],b=S.p[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/len,uz=(b[1]-a[1])/len;let k=0;
    for(let t=8;t<len-4;t+=17){const sd=k++%2?1:-1,off=S.w/2+.7,lx=a[0]+ux*t-uz*sd*off,lz=a[1]+uz*t+ux*sd*off;if(S.n==='Heldenallee'&&[100,140,180].some(v=>Math.abs(lx-v)<4))continue;const[x,z]=W(lx,lz);
      put(M.dark,B(.18,4,.18),x,H+2,z);put(M.dark,B(.6,.12,.12),x,H+3.9,z);put(M.glow,B(.45,.55,.45),x,H+3.55,z);}}
  // ---- Straßenschilder ----
  CITY.signs=[];for(const S of CITY_ST){const a=S.p[0],b=S.p[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/len,uz=(b[1]-a[1])/len,off=S.w/2+1.2,lx=a[0]+ux*4+(-uz)*off,lz=a[1]+uz*4+ux*off;CITY.signs.push({lx,lz,n:S.n,ang:Math.atan2(uz,ux)});}
  for(const sg of CITY.signs){const[x,z]=W(sg.lx,sg.lz),cv=document.createElement('canvas');cv.width=96;cv.height=20;const c=cv.getContext('2d');c.fillStyle='#2a3a5a';c.fillRect(0,0,96,20);c.strokeStyle='#c8a030';c.lineWidth=2;c.strokeRect(1,1,94,18);
    c.fillStyle='#f0e8d0';c.font='bold 11px serif';c.textAlign='center';c.fillText(sg.n,48,14);const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;
    const post=new THREE.Mesh(new THREE.BoxGeometry(.14,2.6,.14),M.dark);post.position.set(x,H+1.3,z);grp.add(post);const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.46),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));pl.position.set(x,H+2.45,z);pl.rotation.y=-sg.ang;grp.add(pl);}
  CITY.built=true;}
// =========================================================
// Mietshäuser
// =========================================================
FLAGS.twRent=FLAGS.twRent||{};
const RENT_WEEK=150;// 15 Silber pro Woche (7 Spieltage)
const rentF=()=>FLAGS.twRent||(FLAGS.twRent={});
const rentActive=id=>{const R=rentF()[id];return!!(R&&R.until>=(FLAGS.day||0));};
const RENTH={};
function rentL2W(R,lx,lz){const c=Math.cos(R.ry),s=Math.sin(R.ry);return[TWC.x+R.lx+lx*c+lz*s,TWC.z+R.lz-lx*s+lz*c];}
function rentBuild(R){const M=twMats(),B2=bMats(),g=TWS.grp,H=TWC.H,w=R.lot.w,d=R.lot.d,h=4.2,th=.35,ry=R.ry;if(!g)return;
  const add=(geo,mat,lx,y,lz,rx)=>{const[x,z]=rentL2W(R,lx,lz),m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.y=ry;if(rx)m.rotation.x=rx;g.add(m);return m;};
  const wall=(lx,lz,ww,dd)=>{add(new THREE.BoxGeometry(ww,h,dd),M.white,lx,H+h/2,lz);const[x,z]=rentL2W(R,lx,lz);TWS.sol.push(solAdd({x,z,hw:ww/2,hd:dd/2,y0:H-2,y1:H+h,rot:-ry,solid:1,tw:1}));};
  wall(0,-d/2,w,th);wall(-w/2,0,th,d);wall(w/2,0,th,d);const dw=1.8,sw=(w-dw)/2;wall(-w/2+sw/2,d/2,sw,th);wall(w/2-sw/2,d/2,sw,th);add(new THREE.BoxGeometry(dw,h-2.6,th),M.white,0,H+2.6+(h-2.6)/2,d/2);
  for(const sz of[-1,1]){add(new THREE.BoxGeometry(w+.1,.25,.08),M.wood,0,H+.12,sz*(d/2+.02));add(new THREE.BoxGeometry(w+.1,.25,.08),M.wood,0,H+h-.12,sz*(d/2+.02));}
  for(const sx of[-1,1])for(const sz of[-1,1])add(new THREE.BoxGeometry(.3,h,.3),M.wood,sx*w/2,H+h/2,sz*d/2);
  add(new THREE.BoxGeometry(w-th,.06,d-th),B2.wood,0,H+.04,0);for(const s2 of[-1,1])add(new THREE.BoxGeometry(w+1,.3,Math.hypot(d/2+.5,2.4)),M.roof,0,H+h+1.15,s2*(d/4),s2*.58);add(new THREE.BoxGeometry(w+1,.4,.4),M.roof,0,H+h+2.35,0);
  for(const s2 of[-1,1]){const tri=new THREE.BufferGeometry(),hw=d/2;tri.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-hw,0,0,hw,0,2.4,0, 0,0,hw,0,0,-hw,0,2.4,0],3));tri.computeVertexNormals();add(tri,M.white,s2*w/2,H+h,0);}
  for(const wx of[-w*.3,w*.3])add(new THREE.BoxGeometry(1.3,1.1,.1),M.glow,wx,H+2.4,d/2+.2);
  const door=add(new THREE.BoxGeometry(dw,2.6,.14),B2.wood,0,H+1.3,d/2);const[dx,dz]=rentL2W(R,0,d/2);const doorS=solAdd({x:dx,z:dz,hw:dw/2,hd:.2,y0:H-2,y1:H+2.6,rot:-ry,solid:1,tw:1});TWS.sol.push(doorS);
  // Schild „Zu vermieten“
  const cv=document.createElement('canvas');cv.width=64;cv.height=32;const c=cv.getContext('2d');c.fillStyle='#6a4a24';c.fillRect(0,0,64,32);c.fillStyle='#f0e0b0';c.font='bold 9px monospace';c.textAlign='center';c.fillText('ZU',32,13);c.fillText('VERMIETEN',32,25);
  const tt=new THREE.CanvasTexture(cv);tt.magFilter=THREE.NearestFilter;const sg=new THREE.Group();const post=new THREE.Mesh(new THREE.BoxGeometry(.15,1.6,.15),M.wood);post.position.y=.8;sg.add(post);
  const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.6),new THREE.MeshLambertMaterial({map:tt,side:THREE.DoubleSide}));fr.position.y=1.5;sg.add(fr);const[sx,sz]=rentL2W(R,2.4,d/2+1.6);sg.position.set(sx,H,sz);sg.rotation.y=ry;g.add(sg);
  // Hausnummer
  const nc=document.createElement('canvas');nc.width=16;nc.height=16;const n2=nc.getContext('2d');n2.fillStyle='#2a3a5a';n2.fillRect(0,0,16,16);n2.fillStyle='#f0e8d0';n2.font='bold 12px serif';n2.textAlign='center';n2.fillText(String(R.n),8,13);
  const nt=new THREE.CanvasTexture(nc);nt.magFilter=THREE.NearestFilter;const np=add(new THREE.PlaneGeometry(.4,.4),new THREE.MeshLambertMaterial({map:nt}),-1.4,H+2.2,d/2+.19);
  RENTH[R.id]={door,doorS,sign:sg,R};rentSync(R.id);}
function rentSync(id){const o=RENTH[id];if(!o)return;const R=o.R,on=rentActive(id),d=R.lot.d;const[x,z]=rentL2W(R,on?-.85:0,d/2+(on?.85:0));o.door.position.x=x;o.door.position.z=z;o.door.rotation.y=R.ry+(on?-1.45:0);o.doorS.off=on;o.sign.visible=!on;}
function rentFurnish(R){const d=R.lot.d,w=R.lot.w,k=id=>'rent_'+R.id+'_'+id;const put=(type,lx,lz,key)=>{if(FURN.some(f=>f.key===key))return;const[x,z]=rentL2W(R,lx,lz);addFurn(type,x,z,key);};
  put('bed',-w/2+1.5,-d/2+1.4,k('bed'));put('chest',w/2-1.2,-d/2+1,k('chest'));put('table',.5,-.4,k('table'));put('chair',.5,.7,k('chair'));FLAGS.chests=FLAGS.chests||{};FLAGS.chests[k('chest')]=FLAGS.chests[k('chest')]||[];furnSave();renderFurn();}
function rentDo(R,weeks){const F=rentF(),cost=RENT_WEEK*weeks;if(wallet()<cost)return`Dafür fehlen dir ${fmtMoney(cost-wallet())}.`;setWallet(wallet()-cost);renderInv();const day=FLAGS.day||0,cur=F[R.id];
  const from=cur&&cur.until>=day?cur.until:day;F[R.id]={until:from+7*weeks,warned:0};rentFurnish(R);rentSync(R.id);FLAGS.mapMarks=FLAGS.mapMarks||[];if(!FLAGS.mapMarks.some(m=>m.rent===R.id))FLAGS.mapMarks.push({x:rentL2W(R,0,0)[0],z:rentL2W(R,0,0)[1],c:'#e0a040',n:'Mietshaus '+R.n,rent:R.id});
  saveGame();try{Snd.chime();}catch(e){}return`Abgemacht! Haus ${R.n} in der ${R.street} gehört dir bis Tag ${F[R.id].until+1}. Bett, Truhe, Tisch und Stuhl stehen drin. Deine Sachen bleiben dort, auch wenn die Miete mal abläuft.`;}
function rentTick(){const day=FLAGS.day||0,F=rentF();for(const R of CITY.rent){const q=F[R.id];if(!q)continue;const on=q.until>=day;const o=RENTH[R.id];if(o&&o.doorS.off!==on)rentSync(R.id);
    if(!on&&!q.ended){q.ended=1;FLAGS.mapMarks=(FLAGS.mapMarks||[]).filter(m=>m.rent!==R.id);toast(`Die Miete für Haus ${R.n} (${R.street}) ist abgelaufen. Die Tür ist verschlossen, deine Sachen bleiben drin.`);saveGame();}
    else if(on&&q.until-day<=1&&!q.warned){q.warned=1;toast(`Die Miete für Haus ${R.n} läuft morgen ab. Elsbeth in der Heldenallee kann sie verlängern.`);}}}
{const a=twBuild;twBuild=function(){a();try{for(const R of CITY.rent)rentBuild(R);}catch(e){console.error('Mietshäuser',e);}};}
{const a=twFree;twFree=function(){for(const k in RENTH)delete RENTH[k];a();};}
const rentDoorNear=()=>{if(!TWS.built||DGX.on)return null;for(const R of CITY.rent){const d=R.lot.d,[x,z]=rentL2W(R,0,d/2+1);if(Math.hypot(P.x-x,P.z-z)<2.6&&lookingAt(x,TWC.H+1.3,z,4,.55))return R;}return null;};
{const a=storyUse;storyUse=function(){if(state==='playing'){const R=rentDoorNear();if(R&&!rentActive(R.id)){toast(`Haus ${R.n}, ${R.street}. „Zu vermieten. ${fmtMoney(RENT_WEEK)} pro Woche. Bei Hausverwalterin Elsbeth in der Heldenallee.“`);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){const R=rentDoorNear();if(R&&!rentActive(R.id))return`Haus ${R.n} · zu vermieten`;return a();};}
// Hausverwalterin Elsbeth
TC_LOOK.push({sex:'f',hair:'bun',hairColor:'grey',cloth:'dress',clothColor:'purple',pants:'grey',age:'old'});
{const i=TC_LOOK.length-1;DT['tc'+i]={name:'Bürger',fac:'neutral',hero:1,h:1.72,hp:100,dmg:0,spd:1.1,reach:.5,cd:2,spr:'tc'+i+'_',aggro:.01,rad:.3};}
DIALOGS['Hausverwalterin Elsbeth']={start:()=>'hello',nodes:{
  hello:()=>{const day=FLAGS.day||0,mine=CITY.rent.filter(R=>rentActive(R.id));return{text:`Guten Tag! Ich verwalte die Mietshäuser der Stadt. ${CITY.rent.length} Häuser, jedes mit Bett und Truhe. Eine Woche kostet ${fmtMoney(RENT_WEEK)}.`+(mine.length?` Du hast gerade ${mine.map(R=>'Haus '+R.n+' (bis Tag '+(rentF()[R.id].until+1)+')').join(', ')}.`:''),
    opts:[{label:'Zeig mir die Häuser.',go:'list'},{label:'Wie funktioniert das mit der Miete?',go:'info'},{label:'Leb wohl.',go:null}]};},
  info:()=>({text:`Du zahlst wochenweise. Solange die Miete läuft, ist die Tür offen. Schlaf im Bett, dann wachst du nach einer Niederlage dort auf. Läuft die Miete ab, schließe ich ab, aber deine Truhe bleibt, wie sie ist. Du kannst jederzeit verlängern.`,opts:[{label:'Zurück.',go:'hello'}]}),
  list:()=>({text:'Welches Haus?',opts:CITY.rent.map(R=>({label:`Haus ${R.n}, ${R.street}${rentActive(R.id)?' (deins, verlängern)':' (frei)'}`,act:()=>{EL_SEL=R;return null;},go:'house'})).concat([{label:'Zurück.',go:'hello'}])}),
  house:()=>{const R=EL_SEL;if(!R)return{text:'',opts:[{label:'Zurück.',go:'list'}]};return{text:`Haus ${R.n} in der ${R.street}. ${rentActive(R.id)?'Gehört dir bis Tag '+(rentF()[R.id].until+1)+'.':'Gerade frei.'}`,opts:[
    {label:`1 Woche (${fmtMoney(RENT_WEEK)})`,act:()=>rentDo(R,1),go:'hello2'},{label:`4 Wochen (${fmtMoney(RENT_WEEK*4)})`,act:()=>rentDo(R,4),go:'hello2'},{label:'Zurück.',go:'list'}]};},
  hello2:()=>({text:'',opts:[{label:'Danke.',go:'hello'}]})}};
let EL_SEL=null;
{const a=twSpawnFolk;twSpawnFolk=function(){a();try{const o=CITY.office;if(o){const i=TC_LOOK.length-1,e=spawnEnt('tc'+i,o.x,o.z,{home:{x:o.x,z:o.z},name:'Hausverwalterin Elsbeth',role:'Mietshäuser · Dungeon-Stadt',talk:0,trader:1,wander:false,tc:1});e.portrait=twPortrait('tc'+i+'_0');TWS.ents.push(e);}
  const t=CITY.tavern;if(t){for(let k=0;k<3;k++){const e=spawnEnt('tc'+[0,4,6][k],t.x+(k-1)*2.5,t.z-1.5,{home:{x:t.x+(k-1)*2.5,z:t.z-1.5},name:'Gast',role:'Wirtshaus „Zum Goldenen Turm“',talk:0,tc:1});TWS.ents.push(e);}}}catch(e){console.error('Elsbeth',e);}};}
// =========================================================
// Brunnen sprudeln, Miete prüfen
// =========================================================
let ctyT=0;function cityTick(dt){if(!TWS.built)return;for(const F of CITY.fount){if(Math.hypot(P.x-F.x,P.z-F.z)>45)continue;const n=F.big?4:2;for(let k=0;k<n;k++)if(Math.random()<dt*20){const a=Math.random()*6.283,v=1+Math.random()*.6;spawnParticle(F.x,F.y,F.z,Math.cos(a)*v,2.2+Math.random(),Math.sin(a)*v,0xbfe6ff,.9,.12);}}
  ctyT-=dt;if(ctyT<=0){ctyT=2;rentTick();}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{cityTick(dt);}catch(e){if(!cityTick.err){cityTick.err=1;console.error('Stadt',e);}}};}
