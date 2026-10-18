/* =========================================================
   0.0.121 · Die Dungeon-Stadt als richtige, enge Stadt
   - Dichte Häuserblöcke: Haus an Haus, zwei bis drei Stockwerke, Fachwerk, Schiefer- und Ziegeldächer (richtig herum)
   - Nur schmale Gassen zwischen den Blöcken, breite Straßen nur zu den Toren (Heldenallee, Westweg, Nord- und Südweg)
   - Innenhöfe mit Gras und Bäumen, mehrere Parks mit Bäumen, Hecken, Blumenbeeten, Bänken und Teichen
   - Nachts leuchten Laternen an den Straßen und an den Hauswänden, die Fenster werden hell, Lichtkegel auf dem Pflaster
   - Marktplatz, Heldenhain mit Statuen, Gildenplatz, Arenaplatz, Westbrunnen, Kaufhäuser, Wirtshaus, Schule
   ========================================================= */
const CITY_ST=[],CITY_PL=[],CITY_RD=[];
const CITY={lots:[],rent:[],fount:[],signs:[],built:false,parks:[],benches:[],lamps:[],res:[],yards:[],laid:false};
const CT_L=[-212,-182,-152,-122,-92,-62,-32,0,32,62,92,122,152,182,212];
const CT_HN={'-212':'Wallgasse','-182':'Schmiedgasse','-152':'Gerbergasse','-122':'Bäckergasse','-92':'Färbergasse','-62':'Webergasse','-32':'Rosengasse','32':'Lindengasse','62':'Kupfergasse','92':'Hafergasse','122':'Fischergasse','152':'Zinngasse','182':'Seilergasse','212':'Mauergasse'};
const CT_VN={'-212':'Westwall','-182':'Brunnengasse','-152':'Glockengasse','-122':'Kerzengasse','-92':'Sattlergasse','-62':'Ringgasse','-32':'Turmgasse West','32':'Turmgasse Ost','62':'Marktgasse','92':'Krämergasse','122':'Handelsgasse','152':'Silbergasse','182':'Goldgasse','212':'Ostwall'};
const CT_R0=84,CT_R1=()=>TWC.WR-11;
const ctSegD=(px,pz,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz||1;let t=((px-a[0])*dx+(pz-a[1])*dz)/L2;t=t<0?0:t>1?1:t;return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t);};
function ctCorners(x,z,w,d,ry){const c=Math.cos(ry),s=Math.sin(ry),L=[];for(const[a,b]of[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]])L.push([x+a*c+b*s,z-a*s+b*c]);return L;}
function ctHas(R,px,pz,pad){pad=pad==null?1.2:pad;const c=Math.cos(R.ry),s=Math.sin(R.ry),dx=px-R.x,dz=pz-R.z,lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.abs(lx)<R.w/2+pad&&Math.abs(lz)<R.d/2+pad;}
const ctLW=(c,vert)=>c===0?(vert?7:9):4;
// Zonen, in denen keine Straße verläuft (Gildenhaus, Arena, gekauftes Haus)
function ctStreetBlocked(lx,lz){const gx=GH.x-TWC.x,gz=GH.z-TWC.z;if(Math.abs(lx-gx)<GH.w/2+1&&Math.abs(lz-gz)<GH.d/2+1)return true;
  if(Math.hypot(lx-(AR.x-TWC.x),lz-(AR.z-TWC.z))<AR.R1+1.5)return true;const hx=TWH.x-TWC.x,hz=TWH.z-TWC.z;if(Math.abs(lx-hx)<TWH.w/2+.6&&Math.abs(lz-hz)<TWH.d/2+.6)return true;return false;}
// Darf hier ein Gebäude stehen?
function ctBuildOK(lx,lz){const d=Math.hypot(lx,lz);if(d<CT_R0||d>CT_R1())return false;if(ctStreetBlocked(lx,lz))return false;const gx=GH.x-TWC.x,gz=GH.z-TWC.z;if(Math.abs(lx-gx)<GH.w/2+4&&lz>gz-GH.d/2-4&&lz<gz+GH.d/2+24)return false;
  if(Math.hypot(lx-(AR.x-TWC.x),lz-(AR.z-TWC.z))<AR.R1+4)return false;const hx=TWH.x-TWC.x,hz=TWH.z-TWC.z;if(Math.abs(lx-hx)<TWH.w/2+2.5&&Math.abs(lz-hz)<TWH.d/2+3.5)return false;
  for(const Q of CITY_PL)if(lx>Q.x0-.5&&lx<Q.x1+.5&&lz>Q.z0-.5&&lz<Q.z1+.5)return false;for(const C of CITY_RD)if(Math.hypot(lx-C.x,lz-C.z)<C.r+.5)return false;
  for(const R of CITY.res)if(ctHas(R,lx,lz,.4))return false;for(const S of CITY_ST)for(let i=0;i<S.p.length-1;i++)if(ctSegD(lx,lz,S.p[i],S.p[i+1])<S.w/2+.25)return false;return true;}
function cityLayout(){if(CITY.laid)return;CITY.laid=true;const r=mulberry32(4711);
  // ---- Plätze und Parks ----
  CITY_PL.push({n:'Gildenplatz',x0:-38,x1:18,z0:-133,z1:-112},{n:'Arenaplatz',x0:-50,x1:10,z0:82,z1:98},{n:'Marktplatz',x0:94,x1:150,z0:-30,z1:-4.5},{n:'Heldenhain',x0:94,x1:150,z0:4.5,z1:30,park:1});
  CITY_RD.push({n:'Westbrunnen',x:-137,z:0,r:9});
  // ---- Besondere Gebäude ----
  CITY.res.push({k:'shop',x:167,z:-11.8,w:16,d:14,ry:0},{k:'shop',x:197,z:-11.8,w:16,d:14,ry:0},{k:'shop',x:197,z:11.8,w:16,d:14,ry:Math.PI},{k:'shop',x:-107,z:-11.8,w:16,d:14,ry:0},
    {k:'tavern',x:167,z:11.8,w:15,d:14,ry:Math.PI},{k:'school',x:-107,z:11.8,w:16,d:13,ry:Math.PI});
  // ---- Straßen und Gassen auf dem Raster ----
  const runs=(c,vert)=>{const out=[];let cur=null;for(let t=-221;t<=221;t+=1){const x=vert?c:t,z=vert?t:c,d=Math.hypot(x,z),ok=d>=78&&d<=TWC.WR-8&&!ctStreetBlocked(x,z);
      if(ok){if(!cur)cur=[t,t];else cur[1]=t;}else if(cur){out.push(cur);cur=null;}}if(cur)out.push(cur);return out.filter(q=>q[1]-q[0]>=8);};
  for(const c of CT_L)for(const vert of[false,true])for(const[t0,t1]of runs(c,vert)){const w=ctLW(c,vert);let n;
      if(c===0)n=vert?(t0<0?'Nordweg':'Südweg'):(t0>0?'Heldenallee':'Westweg');else n=(vert?CT_VN:CT_HN)[String(c)];
      CITY_ST.push({n,w,main:c===0,p:vert?[[c,t0],[c,t1]]:[[t0,c],[t1,c]]});}
  // ---- Parks: einige Blöcke bleiben grün ----
  const CL=[];for(let i=0;i<CT_L.length-1;i++)for(let j=0;j<CT_L.length-1;j++){const xa=CT_L[i],xb=CT_L[i+1],za=CT_L[j],zb=CT_L[j+1];
    const x0=xa+ctLW(xa,true)/2+.3,x1=xb-ctLW(xb,true)/2-.3,z0=za+ctLW(za,false)/2+.3,z1=zb-ctLW(zb,false)/2-.3;CL.push({i,j,x0,x1,z0,z1});}
  const full=c=>[[c.x0,c.z0],[c.x1,c.z0],[c.x0,c.z1],[c.x1,c.z1],[(c.x0+c.x1)/2,(c.z0+c.z1)/2]].every(([x,z])=>ctBuildOK(x,z));
  const parkWant=[[-77,-47],[77,77],[-167,-107],[137,-107],[-47,167],[167,137],[-197,47],[107,167]];
  for(const[wx,wz]of parkWant){let b=null,bd=1e9;for(const c of CL){const cx=(c.x0+c.x1)/2,cz=(c.z0+c.z1)/2,d=Math.hypot(cx-wx,cz-wz);if(d<bd&&full(c)){bd=d;b=c;}}if(b&&bd<40){CITY_PL.push({n:'Park',x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,park:1});}}
  // ---- Häuser: Haus an Haus rund um jeden Block ----
  const L=[];for(const c of CL){const W=c.x1-c.x0,Dz=c.z1-c.z0;if(W<6||Dz<6)continue;const dN=7+r()*1.5,dS=7+r()*1.5,dW=7+r()*1.5,dE=7+r()*1.5;
    const row=(len,place)=>{let t=0;while(len-t>=4.5){let w=5.5+r()*3;if(len-t-w<4.5)w=len-t;place(t,w);t+=w;}};
    const add=(x,z,w,d,ry,st)=>{const R={x,z,w,d,ry,st:r()<.58?3:2,v:(r()*5)|0,roof:r()<.35?1:0,chim:r()<.35};const pts=ctCorners(x,z,w-.2,d-.2,ry).concat([[x,z]]);if(pts.every(([px,pz])=>ctBuildOK(px,pz))){R.street=st;L.push(R);}};
    const nearSt=(x,z)=>{let b='',bd=1e9;for(const S of CITY_ST)for(let k=0;k<S.p.length-1;k++){const d=ctSegD(x,z,S.p[k],S.p[k+1]);if(d<bd){bd=d;b=S.n;}}return b;};
    // Nord- und Südreihe über die ganze Breite, West- und Ostreihe dazwischen
    row(W,(t,w)=>add(c.x0+t+w/2,c.z0+dN/2,w,dN,Math.PI,nearSt(c.x0+t+w/2,c.z0-2)));if(Dz>dN+dS+3)row(W,(t,w)=>add(c.x0+t+w/2,c.z1-dS/2,w,dS,0,nearSt(c.x0+t+w/2,c.z1+2)));
    const zs=c.z0+dN,ze=c.z1-dS;if(ze-zs>4.5){row(ze-zs,(t,w)=>add(c.x0+dW/2,zs+t+w/2,w,dW,-Math.PI/2,nearSt(c.x0-2,zs+t+w/2)));if(W>dW+dE+3)row(ze-zs,(t,w)=>add(c.x1-dE/2,zs+t+w/2,w,dE,Math.PI/2,nearSt(c.x1+2,zs+t+w/2)));}
    if(W>dW+dE+4&&Dz>dN+dS+4)CITY.yards.push({x0:c.x0+dW,x1:c.x1-dE,z0:c.z0+dN,z1:c.z1-dS});}
  CITY.lots=L;
  // ---- Schule und Mietshäuser ----
  const sch=CITY.res.find(q=>q.k==='school');CITY.school=sch;
  const want=[[-100,-62],[-170,62],[-100,62],[-160,-62],[-120,-130],[110,-130],[120,130],[-80,140]],used=new Set();
  CITY.rent=[];want.forEach(([wx,wz],i)=>{let b=null,bd=1e9;for(const l of L){if(used.has(l)||l.w<6.5)continue;const d=Math.hypot(l.x-wx,l.z-wz);if(d<bd){bd=d;b=l;}}if(b){used.add(b);b.rent=1;b.st=2;CITY.rent.push({id:'r'+(i+1),n:i+1,lx:b.x,lz:b.z,ry:b.ry,street:b.street,lot:b});}});}
cityLayout();
// =========================================================
// Materialien
// =========================================================
let CTYM=null;function cityMats(){if(CTYM)return CTYM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  const cob=new Px(32,32);{const S=pal(['#3e3a34','#56514a','#6c665c','#827b6e','#968e80']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=y>>2,o=(row%2)*3,ed=(x+o)%6===0||y%4===0;cob.set(x,y,S[ed?0:shadeIdx(.55+(hash2((x+o)/6|0,row,331)-.5)*.5+(hash2(x,y,332)-.5)*.15,5,x,y)]);}}
  const fl=new Px(32,32);{const S=pal(['#5a564e','#8a8478','#a29c8e','#b8b2a2','#cac4b4']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const ed=x%16===0||y%16===0||(y<16&&x===8)||(y>=16&&x===24);fl.set(x,y,S[ed?0:shadeIdx(.6+(hash2(x>>3,y>>3,341)-.5)*.35+(hash2(x,y,342)-.5)*.12,5,x,y)]);}}
  const grass=new Px(32,32);{const S=pal(['#2e5a22','#3a6e2a','#467e32','#56923a','#68a446']);for(let y=0;y<32;y++)for(let x=0;x<32;x++)grass.set(x,y,S[shadeIdx(.55+(hash2(x>>2,y>>2,351)-.5)*.4+(hash2(x,y,352)-.5)*.3,5,x,y)]);}
  const grav=new Px(16,16);{const S=pal(['#7a6a52','#8e7e62','#a29274','#b6a684']);for(let y=0;y<16;y++)for(let x=0;x<16;x++)grav.set(x,y,S[shadeIdx(.55+(hash2(x,y,361)-.5)*.6,4,x,y)]);}
  // Fassaden: 32 px = 3 m breit, 3,2 m hoch (ein Stockwerk mit Fenster). Dazu eine Leuchtmaske für die Fenster in der Nacht.
  const FAC=[['#e8dcc0','#4a3018',1],['#d8c49a','#5a3a1c',1],['#c8b8a8','#3a2a20',0],['#e4d0b0','#6a4020',1],['#b8c0c4','#3a3a44',0]],facs=[];
  for(const[wall,beam,timber]of FAC){const p=new Px(32,32),m=new Px(32,32),W=pal([wall]),Bm=hex(beam),G=pal(['#1a2630','#2a3c48','#4a6878']);
    for(let y=0;y<32;y++)for(let x=0;x<32;x++){let c=shadeIdx(.6+(hash2(x,y,371)-.5)*.2,1,x,y);p.set(x,y,W[0]);m.set(x,y,hex('#000000'));
      if(timber&&(x<2||y<2||y>29||(Math.abs(x-y*.9)<1.2&&x<10)||(Math.abs((31-x)-y*.9)<1.2&&x>22)))p.set(x,y,Bm);
      if(!timber&&(y>29||x<1))p.set(x,y,hex(shadeHex(wall,-.25)));}
    for(let y=8;y<24;y++)for(let x=11;x<21;x++){const fr=x===11||x===20||y===8||y===23||x===15||y===15;p.set(x,y,fr?Bm:G[(x+y)%7===0?2:y<15?1:0]);if(!fr)m.set(x,y,hex(y<15?'#ffd890':'#ffb860'));}
    for(let y=8;y<24;y++){p.set(9,y,hex(shadeHex(beam,.25)));p.set(10,y,Bm);p.set(21,y,Bm);p.set(22,y,hex(shadeHex(beam,.25)));}for(let x=10;x<22;x++)p.set(x,24,Bm);
    const mat=new THREE.MeshLambertMaterial({map:T(p.done()),emissiveMap:T(m.done()),emissive:new THREE.Color(0xffd080),emissiveIntensity:0});facs.push(mat);}
  // Erdgeschoss aus Stein
  const st=new Px(32,32);{const S=pal(['#4a463e','#5c584e','#6e6a5e','#807b6e']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/6),off=row%2?5:0,seam=y%6===0||(x+off)%10===0;st.set(x,y,S[seam?0:shadeIdx(.55+(hash2((x+off)/10|0,row,381)-.5)*.4,4,x,y)]);}
    const m=new Px(32,32);for(let y=0;y<32;y++)for(let x=0;x<32;x++)m.set(x,y,hex('#000000'));for(let y=10;y<22;y++)for(let x=12;x<20;x++){st.set(x,y,(x===12||x===19||y===10||y===21)?hex('#2a1a10'):hex(y<16?'#2a3c48':'#1a2630'));if(x>12&&x<19&&y>10&&y<21)m.set(x,y,hex('#ffc070'));}
    facs.push(new THREE.MeshLambertMaterial({map:T(st.done()),emissiveMap:T(m.done()),emissive:new THREE.Color(0xffd080),emissiveIntensity:0}));}
  const slate=new Px(16,16);{const S=pal(['#2a2e38','#3a404c','#4a5260','#5a6474']);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const row=y>>2,o=(row%2)*2,ed=y%4===3||(x+o)%4===0;slate.set(x,y,S[ed?0:shadeIdx(.6+(hash2(x>>2,row,391)-.5)*.4,4,x,y)]);}}
  const tile=new Px(16,16);{const S=pal(['#6a2414','#8a3420','#a8482a','#c25e38']);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const row=y>>2,o=(row%2)*2,ed=y%4===3||(x+o)%4===0;tile.set(x,y,S[ed?0:shadeIdx(.6+(hash2(x>>2,row,392)-.5)*.4,4,x,y)]);}}
  const pool=document.createElement('canvas');pool.width=pool.height=64;{const x=pool.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,200,120,1)');g.addColorStop(.45,'rgba(255,170,90,.45)');g.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=g;x.fillRect(0,0,64,64);}
  const L=(m,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(m),polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1},o||{}));
  CTYM={pave:L(cob.done()),plaza:L(fl.done()),grass:L(grass.done()),gravel:L(grav.done(),{polygonOffsetFactor:-2,polygonOffsetUnits:-2}),facs,slate:new THREE.MeshLambertMaterial({map:T(slate.done())}),tile:new THREE.MeshLambertMaterial({map:T(tile.done())}),
    water:new THREE.MeshBasicMaterial({color:0x3a8ab0,transparent:true,opacity:.8}),bark:new THREE.MeshLambertMaterial({color:0x5a3a20}),leaf1:new THREE.MeshLambertMaterial({color:0x3a7a2e,flatShading:true}),leaf2:new THREE.MeshLambertMaterial({color:0x4e9438,flatShading:true}),
    leaf3:new THREE.MeshLambertMaterial({color:0x2e6a3a,flatShading:true}),hedge:new THREE.MeshLambertMaterial({color:0x2e5e26,flatShading:true}),flowers:[0xd84a4a,0xe8c040,0xa04ad8,0xf0f0f0,0xe87ab0].map(c=>new THREE.MeshLambertMaterial({color:c})),
    soil:new THREE.MeshLambertMaterial({color:0x4a3220}),iron:new THREE.MeshLambertMaterial({color:0x22222a}),lamp:new THREE.MeshLambertMaterial({color:0x6a5a3a,emissive:new THREE.Color(0xffc060),emissiveIntensity:.15}),
    plaster:new THREE.MeshLambertMaterial({color:0xd8ccb0}),pool:new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pool),transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending})};return CTYM;}
// flache, gekachelte Fläche (4 m pro Kachel)
function cityFlat(MG,mat,len,w,x,z,ang,y,tile){tile=tile||4;const g=new THREE.PlaneGeometry(len,w);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*len/tile,uv.getY(i)*w/tile);mgPush(MG,mat,g,x,y,z,-ang);}
// Kasten, dessen Fassadenbild sich nach Metern wiederholt (3 m breit, 3,2 m hoch)
function ctBox(w,h,d){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv;const span=[d,d,w,w,w,w],hh=[h,h,d,d,h,h];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*Math.max(1,Math.round(span[f]/3)),uv.getY(i)*(f===2||f===3?.01:hh[f]/3.2));}return g;}
function ctGable(w,d,hr){const g=new THREE.BufferGeometry(),hw=d/2;g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-hw,0,0,hw,0,hr,0, 0,0,hw,0,0,-hw,0,hr,0],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1,1,0,0,0,.5,1],2));g.computeVertexNormals();return g;}
// =========================================================
// Die Stadt aufbauen (wird aus twBuild aufgerufen)
// =========================================================
function twCity(K){const{M,MG,put,box,B,sol,r,grp,H,X,Z}=K,C=cityMats(),AW=[M.red,M.blue,M.green,M.yellow];
  const W=(lx,lz)=>[X+lx,Z+lz];CITY.fount=[];CITY.lamps=[];CITY.benches=[];CITY.parks=[];
  // ---- Turmplatz und Straßen ----
  {const g=new THREE.RingGeometry(66,82,72,1);g.rotateX(-Math.PI/2);const uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,pos.getX(i)/4,pos.getZ(i)/4);mgPush(MG,C.pave,g,X,H+.07,Z,0);}
  for(const S of CITY_ST){const a=S.p[0],b=S.p[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);cityFlat(MG,C.pave,len+S.w,S.w,X+(a[0]+b[0])/2,Z+(a[1]+b[1])/2,ang,H+.08);
    if(S.main)for(const sd of[-1,1]){const nx=-Math.sin(ang),nz=Math.cos(ang);put(M.stone,B(len,.16,.3),X+(a[0]+b[0])/2+nx*sd*(S.w/2-.15),H+.1,Z+(a[1]+b[1])/2+nz*sd*(S.w/2-.15),-ang);}}
  for(const Q of CITY_PL){if(Q.park)continue;cityFlat(MG,C.plaza,Q.x1-Q.x0,Q.z1-Q.z0,X+(Q.x0+Q.x1)/2,Z+(Q.z0+Q.z1)/2,0,H+.09);}
  for(const Q of CITY_RD){const g=new THREE.CircleGeometry(Q.r,32);g.rotateX(-Math.PI/2);const uv=g.attributes.uv,pos=g.attributes.position;for(let k=0;k<uv.count;k++)uv.setXY(k,pos.getX(k)/4,pos.getZ(k)/4);mgPush(MG,C.plaza,g,X+Q.x,H+.09,Z+Q.z,0);}
  // ---- Kleinkram ----
  const fountain=(lx,lz,R,big)=>{const[x,z]=W(lx,lz);put(M.stone,new THREE.CylinderGeometry(R,R+.2,.9,20),x,H+.45,z);put(C.water,new THREE.CylinderGeometry(R-.35,R-.35,.08,20),x,H+.82,z);
    put(M.stone,new THREE.CylinderGeometry(.45,.6,big?3:2,10),x,H+(big?1.5:1),z);put(M.stone,new THREE.CylinderGeometry(big?1.6:1,.4,.4,14),x,H+(big?3:2),z);put(C.water,new THREE.CylinderGeometry(big?1.4:.85,big?1.4:.85,.06,14),x,H+(big?3.2:2.2),z);
    if(big){put(M.marble,new THREE.CylinderGeometry(.25,.35,1.4,8),x,H+3.9,z);put(M.gold,new THREE.SphereGeometry(.45,10,8),x,H+4.8,z);}
    sol.push(solAdd({x,z,hw:R*.88,hd:R*.88,y0:H-2,y1:H+.9,rot:0,solid:1,tw:1}),solAdd({x,z,hw:R*.88,hd:R*.88,y0:H-2,y1:H+.9,rot:Math.PI/4,solid:1,tw:1}));CITY.fount.push({x,z,y:H+(big?3.3:2.3),R,big});};
  const tree=(lx,lz,s)=>{const[x,z]=W(lx,lz);s=s||1;const h=2.4*s;put(C.bark,new THREE.CylinderGeometry(.18*s,.26*s,h,6),x,H+h/2,z);const lm=[C.leaf1,C.leaf2,C.leaf3][(r()*3)|0];
    put(lm,new THREE.IcosahedronGeometry(1.7*s,0),x,H+h+1*s,z,r()*6);put(lm,new THREE.IcosahedronGeometry(1.25*s,0),x+.6*s,H+h+.3*s,z+.4*s,r()*6);put(lm,new THREE.IcosahedronGeometry(1.1*s,0),x-.6*s,H+h+.5*s,z-.3*s,r()*6);
    sol.push(solAdd({x,z,hw:.3*s,hd:.3*s,y0:H-2,y1:H+h,rot:0,solid:1,tw:1}));};
  const bench=(lx,lz,ry)=>{const[x,z]=W(lx,lz);put(M.wood,B(2,.12,.6),x,H+.5,z,ry);put(M.wood,B(2,.5,.1),x-Math.sin(ry)*.3,H+.8,z-Math.cos(ry)*.3,ry);for(const sd of[-1,1])put(M.dark,B(.1,.45,.5),x+Math.cos(ry)*sd*.85,H+.23,z-Math.sin(ry)*sd*.85,ry);CITY.benches.push({x:x+Math.sin(ry)*.6,z:z+Math.cos(ry)*.6});};
  const flowers=(lx,lz,w,d)=>{const[x,z]=W(lx,lz);put(C.soil,B(w,.2,d),x,H+.1,z);for(let k=0;k<Math.round(w*d*1.2);k++)put(C.flowers[(r()*5)|0],B(.22,.3,.22),x+(r()-.5)*(w-.3),H+.32,z+(r()-.5)*(d-.3));};
  const hedge=(lx,lz,w,d)=>{const[x,z]=W(lx,lz);put(C.hedge,B(w,1.1,d),x,H+.55,z);sol.push(solAdd({x,z,hw:w/2,hd:d/2,y0:H-2,y1:H+1.1,rot:0,solid:1,tw:1}));};
  const lampPost=(lx,lz)=>{const[x,z]=W(lx,lz);put(C.iron,B(.16,3.8,.16),x,H+1.9,z);put(C.iron,B(.5,.1,.5),x,H+3.85,z);put(C.lamp,B(.4,.55,.4),x,H+3.5,z);CITY.lamps.push([x,H+3.4,z]);};
  const lampWall=(x,z,fx,fz,y)=>{put(C.iron,B(.08,.08,.7),x+fx*.35,y+.35,z+fz*.35,Math.atan2(fx,fz));put(C.lamp,B(.32,.45,.32),x+fx*.7,y,z+fz*.7);CITY.lamps.push([x+fx*.7,y-.1,z+fz*.7]);};
  // ---- Parks und Innenhöfe ----
  for(const Q of CITY_PL){if(!Q.park)continue;const cx=(Q.x0+Q.x1)/2,cz=(Q.z0+Q.z1)/2,w=Q.x1-Q.x0,d=Q.z1-Q.z0;CITY.parks.push({x:X+cx,z:Z+cz,r:Math.min(w,d)/2-2,n:Q.n});
    cityFlat(MG,C.grass,w,d,X+cx,Z+cz,0,H+.07,6);cityFlat(MG,C.gravel,w,2.4,X+cx,Z+cz,0,H+.08,3);cityFlat(MG,C.gravel,d,2.4,X+cx,Z+cz,Math.PI/2,H+.08,3);
    for(const sx of[-1,1])for(const sz of[-1,1]){const qx=cx+sx*w/4,qz=cz+sz*d/4;tree(qx+sx*1.5,qz+sz*1.5,1.1+r()*.4);flowers(qx-sx*1.8,qz-sz*1.2,2.4,1.4);}
    for(const sx of[-1,1]){hedge(cx+sx*(w/2-.5),cz-d/4,1,d/2-3);hedge(cx+sx*(w/2-.5),cz+d/4,1,d/2-3);}
    bench(cx-5,cz-1.6,0);bench(cx+5,cz+1.6,Math.PI);lampPost(cx-w/2+3,cz-2);lampPost(cx+w/2-3,cz+2);
    if(Q.n==='Heldenhain'){fountain(cx,cz,3.4,false);}else if(w>18&&d>18){const[x,z]=W(cx,cz);put(M.stone,new THREE.CylinderGeometry(3.2,3.4,.4,20),x,H+.2,z);put(C.water,new THREE.CylinderGeometry(2.9,2.9,.06,20),x,H+.38,z);sol.push(solAdd({x,z,hw:2.8,hd:2.8,y0:H-2,y1:H+.4,rot:0,solid:1,tw:1}));}}
  for(const Y of CITY.yards){const cx=(Y.x0+Y.x1)/2,cz=(Y.z0+Y.z1)/2,w=Y.x1-Y.x0,d=Y.z1-Y.z0;cityFlat(MG,C.grass,w,d,X+cx,Z+cz,0,H+.06,6);if(r()<.8)tree(cx+(r()-.5)*(w-4),cz+(r()-.5)*(d-4),.8+r()*.5);if(r()<.4)flowers(cx+(r()-.5)*(w-3),cz+(r()-.5)*(d-3),1.6,1);}
  // ---- Heldenstatuen im Heldenhain ----
  const HEROES=['Aldric der Erste','Seraphine Sturmklinge','Bruno Eisenfaust','Lyra Mondpfeil','Torvald der Unbeugsame','Elena Lichtbringerin'];
  TWS.statues=[];[103,113,123,121.5,131.5,141].forEach((sx,k)=>{const sd=k<3?-1:1,x=X+(k<3?sx:sx+.5),z=Z+(k<3?8.5:26);box(M.marble,2.4,1.4,2.4,x,H+.7,z,0,true);put(M.marble,B(1.1,2.4,.7),x,H+2.6,z);put(M.marble,B(.85,.85,.85),x,H+4.2,z);put(M.marble,B(.36,1.5,.36),x+.85*(k%2?1:-1),H+3,z,0,0,(k%2?-1:1)*.5);
    if(k%3===0)put(M.marble,B(.15,2.8,.4),x-.85,H+4,z);else if(k%3===1)put(M.marble,B(1.3,1.5,.2),x-.95,H+2.9,z+.5*sd);else put(M.marble,new THREE.CylinderGeometry(.08,.08,3.2,6),x+1.1,H+3.4,z);
    put(M.gold,B(1.4,.35,.1),x,H+1,z+sd*1.25);TWS.statues.push({x,z,n:HEROES[k]});});
  // ---- Brunnen ----
  fountain(122,-17,3.8,true);fountain(-137,0,3.6,true);fountain(-31,-120,2.4,false);
  // ---- Obelisk am Arenaplatz ----
  {const[x,z]=W(-20,89);box(M.stone,2.4,1,2.4,x,H+.5,z,0,true);put(M.marble,new THREE.CylinderGeometry(.35,.7,7,4),x,H+4.5,z,Math.PI/4);put(M.gold,new THREE.ConeGeometry(.45,1,4),x,H+8.5,z,Math.PI/4);}
  // ---- Marktstände ----
  TWS.stalls=[];const stall=(lx,lz,sd,i)=>{const[x,z]=W(lx,lz);box(M.wood,4.4,1.1,2,x,H+.55,z,0,true);for(const[ox,oz]of[[-2,-1],[2,-1],[-2,1],[2,1]])put(M.wood,B(.2,2.8,.2),x+ox,H+1.4,z+oz);
    put(AW[i%4],B(5,.15,3),x,H+2.85,z,0,sd*.18);put(M.yellow,B(.6,.4,.6),x-1.2,H+1.3,z);put(M.green,B(.5,.4,.5),x+.2,H+1.3,z);put(M.red,B(.5,.3,.5),x+1.3,H+1.25,z);
    for(let k=0;k<2;k++)put(M.wood,new THREE.CylinderGeometry(.35,.35,.8,8),x+(k?2.8:-2.8),H+.4,z-sd*.6);TWS.stalls.push({x,z:z-sd*2.2,sd});};
  [100,110,134,144].forEach((lx,i)=>stall(lx,-26,-1,i));[100,110,134,144,100,144].slice(0,6).forEach((lx,i)=>{if(i<4)stall(lx,-9,1,i+4);});stall(112,-17.5,1,8);stall(132,-17.5,-1,9);
  // ---- Kaufhäuser, Wirtshaus, Schule ----
  TWS.shops=[];const signM=[M.red,M.blue,M.green,M.yellow];let si=0;
  for(const R of CITY.res){const[x,z]=W(R.x,R.z),c=Math.cos(R.ry),s=Math.sin(R.ry),h=R.k==='school'?6.4:9.6;
    const fm=R.k==='school'?C.facs[5]:C.facs[R.k==='tavern'?3:si%5];mgPush(MG,fm,ctBox(R.w,h,R.d),x,H+h/2,z,R.ry);sol.push(solAdd({x,z,hw:R.w/2,hd:R.d/2,y0:H-2,y1:H+h,rot:-R.ry,solid:1,tw:1}));
    const hr=3,sl=Math.hypot(R.d/2+.5,hr),ang=Math.atan2(hr,R.d/2);for(const s2 of[-1,1])mgPush(MG,R.k==='school'?C.slate:C.tile,new THREE.BoxGeometry(R.w+.8,.3,sl),x+s*s2*R.d/4,H+h+hr/2,z+c*s2*R.d/4,R.ry,s2*ang);
    for(const sx of[-1,1])mgPush(MG,C.plaster,ctGable(R.w,R.d,hr),x+c*sx*R.w/2,H+h,z-s*sx*R.w/2,R.ry);
    const fx=x+s*(R.d/2+.06),fz=z+c*(R.d/2+.06);put(M.dark,B(2.4,3,.15),fx,H+1.5,fz,R.ry);
    if(R.k==='shop'){put(signM[si%4],B(6,1.1,.2),x+s*(R.d/2+.15),H+4.2,z+c*(R.d/2+.15),R.ry);TWS.shops.push({x:x+s*(R.d/2+1.6),z:z+c*(R.d/2+1.6)});si++;}
    else if(R.k==='tavern'){put(M.wood,B(.15,.15,1.6),fx+c*3,H+5,fz-s*3,R.ry);put(M.gold,B(1.4,1,.12),fx+c*3+s*.8,H+4.3,fz-s*3+c*.8,R.ry);CITY.tavern={x:x+s*(R.d/2+1.8),z:z+c*(R.d/2+1.8)};}
    else if(R.k==='school'){put(M.wood,B(1.6,2.2,1.6),x,H+h+3.4,z,R.ry);put(C.slate,new THREE.ConeGeometry(1.4,1.6,4),x,H+h+5.3,z,R.ry+Math.PI/4);put(M.gold,new THREE.SphereGeometry(.35,8,6),x,H+h+3.6,z);put(M.blue,B(3,.8,.12),x+s*(R.d/2+.13),H+4,z+c*(R.d/2+.13),R.ry);CITY.schoolDoor=[x+s*(R.d/2+1.5),z+c*(R.d/2+1.5)];}
    lampWall(fx+c*2,fz-s*2,s,c,H+3);lampWall(fx-c*2,fz+s*2,s,c,H+3);}
  // ---- Hausverwaltung (Stand von Elsbeth am Marktplatz) ----
  {const[x,z]=W(97,-17.5);box(M.wood,1.6,1.1,4,x,H+.55,z,0,true);put(M.blue,B(2.6,.15,4.6),x,H+2.8,z);for(const[ox,oz]of[[-.7,-1.9],[.7,-1.9],[-.7,1.9],[.7,1.9]])put(M.wood,B(.18,2.7,.18),x+ox,H+1.35,z+oz);CITY.office={x:x+1.8,z};}
  // ---- Wohnhäuser: zwei bis drei Stockwerke, Haus an Haus ----
  TWS.houses=[{x:TWH.x,z:TWH.z,r:8,door:[TWH.x,TWH.z+TWH.d/2+1.5]}];let lampN=0;
  for(const l of CITY.lots){const[x,z]=W(l.x,l.z),c=Math.cos(l.ry),s=Math.sin(l.ry),door=[x+s*(l.d/2+1.2),z+c*(l.d/2+1.2)];TWS.houses.push({x,z,r:Math.hypot(l.w,l.d)/2,door,lot:l});if(l.rent)continue;
    const h1=3.2,hu=3.2*(l.st-1),ov=l.st>2?.25:0;mgPush(MG,C.facs[5],ctBox(l.w,h1,l.d),x,H+h1/2,z,l.ry);mgPush(MG,C.facs[l.v],ctBox(l.w,hu,l.d+ov*2),x,H+h1+hu/2,z,l.ry);
    put(M.wood,B(l.w+.05,.22,l.d+ov*2+.1),x,H+h1,z,l.ry);sol.push(solAdd({x,z,hw:l.w/2,hd:l.d/2,y0:H-2,y1:H+h1+hu,rot:-l.ry,solid:1,tw:1}));
    const h=h1+hu,hr=2.2+l.d*.12,sl=Math.hypot(l.d/2+.6,hr),ang=Math.atan2(hr,l.d/2+ov),rm=l.roof?C.slate:C.tile;
    for(const s2 of[-1,1])mgPush(MG,rm,new THREE.BoxGeometry(l.w+.3,.26,sl),x+s*s2*(l.d/4+ov/2),H+h+hr/2-.05,z+c*s2*(l.d/4+ov/2),l.ry,s2*ang);mgPush(MG,rm,new THREE.BoxGeometry(l.w+.3,.3,.4),x,H+h+hr,z,l.ry);
    for(const sx of[-1,1])mgPush(MG,C.plaster,ctGable(l.w,l.d+ov*2,hr),x+c*sx*(l.w/2-.01),H+h,z-s*sx*(l.w/2-.01),l.ry);
    if(l.chim)put(M.stone,B(.7,1.8,.7),x+c*(l.w/2-1)-s*(l.d/4),H+h+hr*.6,z-s*(l.w/2-1)-c*(l.d/4),l.ry);
    const fx=x+s*(l.d/2+.05),fz=z+c*(l.d/2+.05);put(M.dark,B(1.1,2.2,.12),fx,H+1.1,fz,l.ry);put(M.stone,B(1.5,.15,.5),x+s*(l.d/2+.25),H+.08,z+c*(l.d/2+.25),l.ry);
    if((lampN++)%2===0)lampWall(fx+c*(l.w/2-.4),fz-s*(l.w/2-.4),s,c,H+3);}
  // ---- Laternen an den breiten Straßen ----
  for(const S of CITY_ST){if(!S.main)continue;const a=S.p[0],b=S.p[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/len,uz=(b[1]-a[1])/len;let k=0;
    for(let t=6;t<len-3;t+=14){const sd=k++%2?1:-1,off=S.w/2-.5,lx=a[0]+ux*t-uz*sd*off,lz=a[1]+uz*t+ux*sd*off;lampPost(lx,lz);}}
  for(let k=0;k<24;k++){const a=k/24*6.283+.13;lampPost(Math.cos(a)*81,Math.sin(a)*81);}
  // ---- Lichtkegel der Laternen auf dem Boden ----
  {const pos=[],uv=[],idx=[];let v=0;for(const[x,y,z]of CITY.lamps){const R=5.5,yy=H+.13;pos.push(x-R,yy,z-R,x+R,yy,z-R,x+R,yy,z+R,x-R,yy,z+R);uv.push(0,0,1,0,1,1,0,1);idx.push(v,v+2,v+1,v,v+3,v+2);v+=4;}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);const m=new THREE.Mesh(g,C.pool);m.frustumCulled=false;m.renderOrder=2;grp.add(m);CITY.poolMesh=m;}
  // ---- Straßenschilder an den Hauptstraßen und Gassenanfängen ----
  CITY.signs=[];const seen=new Set();for(const S of CITY_ST){if(seen.has(S.n+'|'+S.p[0][0]+'|'+S.p[0][1]))continue;seen.add(S.n+'|'+S.p[0][0]+'|'+S.p[0][1]);if(!S.main&&r()<.5)continue;const a=S.p[0],b=S.p[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/len,uz=(b[1]-a[1])/len,lx=a[0]+ux*3,lz=a[1]+uz*3;
    const[x,z]=W(lx,lz),cv=document.createElement('canvas');cv.width=96;cv.height=20;const c=cv.getContext('2d');c.fillStyle='#2a3a5a';c.fillRect(0,0,96,20);c.strokeStyle='#c8a030';c.lineWidth=2;c.strokeRect(1,1,94,18);
    c.fillStyle='#f0e8d0';c.font='bold 11px serif';c.textAlign='center';c.fillText(S.n,48,14);const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(2,.42),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));pl.position.set(x,H+2.9,z);pl.rotation.y=-Math.atan2(uz,ux);grp.add(pl);}
  CITY.built=true;}
// =========================================================
// Nacht: Laternen, Fenster und Lichter
// =========================================================
const CTL={lights:[],t:0};
function ctNight(){const c=FLAGS.clock==null?600:FLAGS.clock;if(c>=1260||c<300)return 1;if(c>=1110)return(c-1110)/150;if(c<390)return(390-c)/90;return 0;}
function ctLightTick(dt){if(!TWS.built||!CTYM){for(const l of CTL.lights)l.visible=false;return;}const n=ctNight(),inC=P.x<60000&&!DGX.on&&twD(P.x,P.z)<TWC.WR+120;
  for(const m of CTYM.facs)m.emissiveIntensity=n*.95;CTYM.lamp.emissiveIntensity=.15+n*1.4;CTYM.pool.opacity=n*.5;
  if(!CTL.lights.length)for(let k=0;k<8;k++){const l=new THREE.PointLight(0xffb060,0,18,1.6);l.visible=false;scene.add(l);CTL.lights.push(l);}
  CTL.t-=dt;if(CTL.t>0)return;CTL.t=.4;if(!inC||n<.05){for(const l of CTL.lights)l.visible=false;return;}
  const cx=camera.position.x,cz=camera.position.z,near=CITY.lamps.map(p=>[p,(p[0]-cx)**2+(p[2]-cz)**2]).sort((a,b)=>a[1]-b[1]).slice(0,CTL.lights.length);
  CTL.lights.forEach((l,i)=>{const q=near[i];if(!q||q[1]>60*60){l.visible=false;return;}l.visible=true;l.position.set(q[0][0],q[0][1],q[0][2]);l.intensity=1.6*n;});}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{ctLightTick(dt);}catch(e){if(!ctLightTick.err){ctLightTick.err=1;console.error('Stadtlicht',e);}}};}
{const a=twFree;twFree=function(){a();for(const l of CTL.lights)l.visible=false;};}
FLAGS.twRent=FLAGS.twRent||{};
const RENT_WEEK=150;// 15 Silber pro Woche (7 Spieltage)
const rentF=()=>FLAGS.twRent||(FLAGS.twRent={});
const rentActive=id=>{const R=rentF()[id];return!!(R&&R.until>=(FLAGS.day||0));};
const RENTH={};
function rentL2W(R,lx,lz){const c=Math.cos(R.ry),s=Math.sin(R.ry);return[TWC.x+R.lx+lx*c+lz*s,TWC.z+R.lz-lx*s+lz*c];}
function rentBuild(R){const M=twMats(),B2=bMats(),g=TWS.grp,H=TWC.H,w=R.lot.w,d=R.lot.d,h=4.2,th=.35,ry=R.ry;if(!g)return;
  const add=(geo,mat,lx,y,lz,rx)=>{const[x,z]=rentL2W(R,lx,lz),m=new THREE.Mesh(geo,mat);m.rotation.order='YXZ';m.position.set(x,y,z);m.rotation.y=ry;if(rx)m.rotation.x=rx;g.add(m);return m;};const hu=3.2,C2=cityMats();
  const wall=(lx,lz,ww,dd)=>{add(new THREE.BoxGeometry(ww,h,dd),M.white,lx,H+h/2,lz);const[x,z]=rentL2W(R,lx,lz);TWS.sol.push(solAdd({x,z,hw:ww/2,hd:dd/2,y0:H-2,y1:H+h,rot:-ry,solid:1,tw:1}));};
  wall(0,-d/2,w,th);wall(-w/2,0,th,d);wall(w/2,0,th,d);const dw=1.8,sw=(w-dw)/2;wall(-w/2+sw/2,d/2,sw,th);wall(w/2-sw/2,d/2,sw,th);add(new THREE.BoxGeometry(dw,h-2.6,th),M.white,0,H+2.6+(h-2.6)/2,d/2);
  for(const sz of[-1,1]){add(new THREE.BoxGeometry(w+.1,.25,.08),M.wood,0,H+.12,sz*(d/2+.02));add(new THREE.BoxGeometry(w+.1,.25,.08),M.wood,0,H+h-.12,sz*(d/2+.02));}
  for(const sx of[-1,1])for(const sz of[-1,1])add(new THREE.BoxGeometry(.3,h,.3),M.wood,sx*w/2,H+h/2,sz*d/2);
  add(new THREE.BoxGeometry(w-th,.06,d-th),B2.wood,0,H+.04,0);add(new THREE.BoxGeometry(w-th,.2,d-th),B2.wood,0,H+h-.1,0);add(ctBox(w,hu,d),C2.facs[R.n%5],0,H+h+hu/2,0);add(new THREE.BoxGeometry(w+.05,.22,d+.1),M.wood,0,H+h,0);
  {const hr=2.2+d*.12,sl=Math.hypot(d/2+.6,hr),ang=Math.atan2(hr,d/2);for(const s2 of[-1,1])add(new THREE.BoxGeometry(w+.3,.26,sl),C2.tile,0,H+h+hu+hr/2-.05,s2*(d/4),s2*ang);add(new THREE.BoxGeometry(w+.3,.3,.4),C2.tile,0,H+h+hu+hr,0);
  for(const s2 of[-1,1])add(ctGable(w,d,hr),C2.plaster,s2*(w/2-.01),H+h+hu,0);}
  for(const wx of[-w*.3,w*.3])add(new THREE.BoxGeometry(1.3,1.1,.1),M.glow,wx,H+2.4,d/2+.2);
  const door=add(new THREE.BoxGeometry(dw,2.6,.14),B2.wood,0,H+1.3,d/2);const[dx,dz]=rentL2W(R,0,d/2);const doorS=solAdd({x:dx,z:dz,hw:dw/2,hd:.2,y0:H-2,y1:H+2.6,rot:-ry,solid:1,tw:1});TWS.sol.push(doorS);
  // Schild „Zu vermieten“
  const cv=document.createElement('canvas');cv.width=64;cv.height=32;const c=cv.getContext('2d');c.fillStyle='#6a4a24';c.fillRect(0,0,64,32);c.fillStyle='#f0e0b0';c.font='bold 9px monospace';c.textAlign='center';c.fillText('ZU',32,13);c.fillText('VERMIETEN',32,25);
  const tt=new THREE.CanvasTexture(cv);tt.magFilter=THREE.NearestFilter;const sg=new THREE.Group();const post=new THREE.Mesh(new THREE.BoxGeometry(.15,1.6,.15),M.wood);post.position.y=.8;sg.add(post);
  const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.6),new THREE.MeshLambertMaterial({map:tt,side:THREE.DoubleSide}));fr.position.y=1.5;sg.add(fr);const[sx,sz]=rentL2W(R,2.4,d/2+1.6);sg.position.set(sx,H,sz);sg.rotation.y=ry;g.add(sg);
  // Hausnummer
  const nc=document.createElement('canvas');nc.width=16;nc.height=16;const n2=nc.getContext('2d');n2.fillStyle='#2a3a5a';n2.fillRect(0,0,16,16);n2.fillStyle='#f0e8d0';n2.font='bold 12px serif';n2.textAlign='center';n2.fillText(String(R.n),8,13);
  const nt=new THREE.CanvasTexture(nc);nt.magFilter=THREE.NearestFilter;const np=add(new THREE.PlaneGeometry(.4,.4),new THREE.MeshLambertMaterial({map:nt}),-1.4,H+2.2,d/2+.19);
  RENTH[R.id]={door,doorS,sign:sg,R};rentSync(R.id);rentMoveFurn(R);}
// Möbel aus früheren Versionen an die neue Stelle des Hauses holen (Truhen-Inhalt bleibt)
function rentMoveFurn(R){const d=R.lot.d,w=R.lot.w,P0={bed:[-w/2+1.5,-d/2+1.4],chest:[w/2-1.2,-d/2+1],table:[.5,-.4],chair:[.5,.7]};let ch=false;
  for(const f of FURN.slice()){const m=/^rent_(r\d+)_(\w+)$/.exec(f.key||'');if(!m||m[1]!==R.id||!P0[m[2]])continue;const[x,z]=rentL2W(R,P0[m[2]][0],P0[m[2]][1]);if(Math.hypot(f.x-x,f.z-z)<.8)continue;f.t.r=0;FURN.splice(FURN.indexOf(f),1);addFurn(f.type,x,z,f.key);ch=true;}
  if(ch){furnSave();renderFurn();}}
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
