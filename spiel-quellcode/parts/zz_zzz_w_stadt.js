/* =========================================================
   0.0.129 · Die Dungeon-Stadt, überarbeitet
   - Alle Stadttexturen neu und doppelt so fein: Fachwerk, Backstein, Putz mit Fensterläden und Blumenkästen,
     Ladenfronten, Steinsockel, Ziegel- und Schieferdächer, rundes Kopfsteinpflaster, Steinplatten, Quadermauern.
   - Texturen liegen jetzt überall im richtigen Maßstab (nichts mehr gestreckt), auch auf Dächern, Mauern und Türmen.
   - Neue Bebauung: kleine Werkstätten, schmale hohe Bürgerhäuser, breite Häuser und richtig große Patrizierhäuser
     mit bis zu fünf Stockwerken, Gauben, Erkertürmchen, Ecksteinen, Gesimsen, Schornsteinen und Ladenschildern.
   ========================================================= */
// =========================================================
// Pixel-Werkzeuge
// =========================================================
const SX={};
function sxTex(c){const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function sxMat(c,tm,o){const m=new THREE.MeshLambertMaterial(Object.assign({map:sxTex(c)},o||{}));m.userData.tm=tm;return m;}
const sxN=(x,y,s)=>hash2(x,y,s)-.5;
function sxShade(P,L,x,y){return P[shadeIdx(L,P.length,x,y)];}
// ---------- Fassaden (64 x 68 px = 3 m x 3,2 m, ein Stockwerk) ----------
// k: 'timber' | 'brick' | 'plaster'; wall, beam: Farben; shut: Farbe der Fensterläden oder null; box: Blumenkasten
function sxFacade(o){const W=64,H=68,p=new Px(W,H),m=new Px(W,H),WP=pal([shadeHex(o.wall,-.16),shadeHex(o.wall,-.07),o.wall,shadeHex(o.wall,.08)]),BM=pal([shadeHex(o.beam,-.35),shadeHex(o.beam,-.15),o.beam,shadeHex(o.beam,.18)]);
  const BR=o.k==='brick'?pal([shadeHex(o.wall,-.3),shadeHex(o.wall,-.14),o.wall,shadeHex(o.wall,.12)]):null,MO=hex(o.mortar||'#b8ae9c'),K=hex('#000000');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){m.set(x,y,K);
    if(o.k==='brick'){const row=Math.floor(y/5),off=row%2?6:0,seam=y%5===4||(x+off)%12===11;p.set(x,y,seam?MO:sxShade(BR,.55+sxN((x+off)/12|0,row,o.seed)*.6+sxN(x,y,o.seed+1)*.18,x,y));}
    else p.set(x,y,sxShade(WP,.6+sxN(x>>2,y>>2,o.seed)*.25+sxN(x,y,o.seed+1)*.2,x,y));}
  const beam=(x0,y0,x1,y1,w)=>{const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))||1;for(let i=0;i<=n;i++){const X=x0+(x1-x0)*i/n,Y=y0+(y1-y0)*i/n;for(let a=0;a<w;a++)for(let b=0;b<w;b++){const px=Math.round(X+a-w/2),py=Math.round(Y+b-w/2);if(px>=0&&py>=0&&px<W&&py<H)p.set(px,py,sxShade(BM,(a===0||b===0?.85:.45)+sxN(px,py>>1,o.seed+3)*.25,px,py));}}};
  if(o.k==='timber'){for(let y=0;y<H;y++)for(let x=0;x<3;x++){p.set(x,y,sxShade(BM,.5+x*.15+sxN(x,y>>2,o.seed+4)*.2,x,y));p.set(W-1-x,y,sxShade(BM,.35+x*.1+sxN(x,y>>2,o.seed+5)*.2,W-1-x,y));}
    for(let x=0;x<W;x++)for(let y=0;y<4;y++){p.set(x,y,sxShade(BM,.65-y*.1,x,y));p.set(x,H-1-y,sxShade(BM,.35+y*.12,x,H-1-y));}
    beam(3,H-6,16,40,3);beam(W-4,H-6,W-17,40,3);if(o.cross){beam(4,8,16,30,2);beam(16,8,4,30,2);beam(W-5,8,W-17,30,2);beam(W-17,8,W-5,30,2);}else{beam(3,6,14,20,3);beam(W-4,6,W-15,20,3);}
    for(let x=20;x<44;x++)for(let y=50;y<53;y++)p.set(x,y,sxShade(BM,.5,x,y));}
  if(o.k==='plaster'){for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(y>=H-3)p.set(x,y,sxShade(WP,.25,x,y));}
  // Fenster mit Rahmen, Sprossen, Glas, Fensterbank
  const fx0=22,fx1=41,fy0=14,fy1=47,FR=o.frame?pal([shadeHex(o.frame,-.3),o.frame,shadeHex(o.frame,.2)]):BM;
  if(o.k!=='timber'){const SR=pal(o.k==='brick'?['#8a8478','#a8a294','#c4beae']:['#9a948a','#b6b0a4','#d0cabe']);for(let y=fy0-4;y<=fy1+4;y++)for(let x=fx0-4;x<=fx1+4;x++){if(x>=fx0&&x<=fx1&&y>=fy0&&y<=fy1)continue;if(y<fy0-1&&o.k==='brick'&&((x-fx0+4)%5===4))p.set(x,y,MO);else p.set(x,y,sxShade(SR,.55+(y<fy0?.25:0)-(x>fx1?.2:0)+sxN(x,y,o.seed+9)*.15,x,y));}}
  for(let y=fy0;y<=fy1;y++)for(let x=fx0;x<=fx1;x++){const edge=x<=fx0+1||x>=fx1-1||y<=fy0+1||y>=fy1-1,mull=x===31||x===32||y===29||y===30;
    if(edge||mull){p.set(x,y,sxShade(FR,edge&&(x<=fx0+1||y<=fy0+1)?.9:.45,x,y));continue;}
    const t=(y-fy0)/(fy1-fy0),refl=((x-fx0)+(y-fy0)*.6)%16<3;p.set(x,y,hex(refl?'#6a8ea0':t<.5?'#26404e':'#1a2c38'));m.set(x,y,hex(t<.5?'#ffdc98':'#ffbc68'));}
  for(let x=fx0-3;x<=fx1+3;x++)for(let y=fy1+1;y<=fy1+3;y++)p.set(x,y,hex(y===fy1+1?'#d8d0c0':'#8a8478'));
  if(o.shut){const S=pal([shadeHex(o.shut,-.35),shadeHex(o.shut,-.12),o.shut,shadeHex(o.shut,.18)]);for(const[a,b]of[[fx0-10,fx0-2],[fx1+2,fx1+10]])for(let y=fy0;y<=fy1;y++)for(let x=a;x<=b;x++){const pl=(x-a)%3===2,rim=x===a||x===b||y===fy0||y===fy1,mid=Math.abs(y-(fy0+fy1)/2)<1;p.set(x,y,sxShade(S,rim||mid?.25:pl?.45:.7+sxN(x,y,o.seed+7)*.1,x,y));}}
  if(o.box){for(let x=fx0-2;x<=fx1+2;x++)for(let y=fy1+4;y<=fy1+8;y++)p.set(x,y,hex(y===fy1+4?'#8a5a2a':'#5a3a1a'));const FL=['#e04a4a','#f0c040','#e070b0','#ffffff','#a050e0'];
    for(let x=fx0-1;x<=fx1+1;x++){const h=1+((hash2(x,3,o.seed)*3)|0);for(let k=0;k<h;k++)p.set(x,fy1+3-k,hex(k===h-1&&hash2(x,k,o.seed+2)<.6?FL[(hash2(x,9,o.seed)*5)|0]:'#3a7a2a'));}}
  return[p.done(),m.done()];}
// ---------- Erdgeschoss (64 x 72 px = 3 m x 3,4 m) ----------
function sxGround(k,seed){const W=64,H=72,p=new Px(W,H),m=new Px(W,H),K=hex('#000000');
  const ST=pal(['#3e3a34','#524d44','#666056','#7a7468','#8e8878']),MO=hex('#2e2a26');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){m.set(x,y,K);const row=Math.floor(y/9),off=row%2?10:0,bw=row%3===1?16:20,seam=y%9===8||(x+off)%bw===bw-1;
    if(k==='stone'||y>=H-14||k==='shop'&&(x<5||x>58)){const L=.55+sxN((x+off)/bw|0,row,seed)*.45+(y%9===0?.2:0)+((x+off)%bw===0?.12:0);p.set(x,y,seam?MO:sxShade(ST,L+sxN(x,y,seed+1)*.12,x,y));}
    else p.set(x,y,sxShade(pal(['#b8ab90','#cabda0','#d8ccb0','#e4d8bc']),.6+sxN(x>>2,y>>2,seed+2)*.3+sxN(x,y,seed)*.15,x,y));}
  if(k==='shop'){const WD=pal(['#2a1a0c','#4a2e16','#6a4422','#8a5c30']);for(let y=6;y<58;y++)for(let x=5;x<59;x++){const fr=x<8||x>55||y<9||y>54,mul=(x-8)%12<2&&x>8&&x<54,tr=y===36||y===37;
      if(fr||mul||tr)p.set(x,y,sxShade(WD,fr?.7:.45,x,y));else{const refl=((x)+(y)*.7)%22<4;p.set(x,y,hex(refl?'#7a98a6':y<36?'#2a4250':'#203440'));m.set(x,y,hex('#ffd090'));}}
    for(let x=3;x<61;x++)for(let y=0;y<6;y++)p.set(x,y,sxShade(WD,.75-y*.08,x,y));for(let x=5;x<59;x++)for(let y=55;y<59;y++)p.set(x,y,sxShade(WD,.3,x,y));}
  else{const ax0=21,ax1=42,ay0=20,ay1=52;for(let y=ay0-4;y<=ay1+3;y++)for(let x=ax0-4;x<=ax1+4;x++){const cx=(ax0+ax1)/2,r=(ax1-ax0)/2+4,top=ay0+r-4;if(y<top&&Math.hypot(x-cx,(y-top)*1.1)>r)continue;
      const inner=x>=ax0&&x<=ax1&&y>=ay0&&y<=ay1&&!(y<ay0+(ax1-ax0)/2&&Math.hypot(x-cx,(y-(ay0+(ax1-ax0)/2))*1.1)>(ax1-ax0)/2);
      if(inner){const bar=(x-ax0)%7===3||(y-ay0)%10===5;p.set(x,y,bar?hex('#1a1a1e'):hex(y<36?'#2a4250':'#1c2e3a'));if(!bar)m.set(x,y,hex('#ffc070'));}else p.set(x,y,sxShade(pal(['#6e685c','#8a8476','#a69e8e']),.55+sxN(x,y,seed+5)*.2,x,y));}}
  return[p.done(),m.done()];}
// ---------- Dächer (32 x 32 px = 1,6 m) ----------
function sxRoof(cols,seed,o){o=o||{};const p=new Px(32,32),S=pal(cols),rh=o.slate?6:8,tw=o.slate?6:8;
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/rh),off=row%2?tw/2:0,lx=(x+off)%tw,ly=y%rh,tile=Math.floor((x+off)/tw),v=sxN(tile,row,seed)*.35;
    let L=.75-ly/rh*.55+v+(lx===0?-.3:0)+(lx===tw-1?-.12:0);if(!o.slate&&ly>=rh-2&&(lx<1||lx>tw-2))L=.05;if(ly===rh-1)L-=.25;
    let c=sxShade(S,L+sxN(x,y,seed+1)*.1,x,y);if(o.moss&&hash2(x>>1,y>>1,seed+3)<o.moss)c=hex(hash2(x,y,seed+4)<.5?'#4a5a2a':'#5e6e34');p.set(x,y,c);}return p.done();}
// ---------- Pflaster, Platten, Rasen, Quader ----------
function sxCobble(seed){const S=64,p=new Px(S,S),C=8,pts=[];for(let j=0;j<S/C;j++)for(let i=0;i<S/C;i++)pts.push([i*C+2+hash2(i,j,seed)*(C-4),j*C+2+hash2(i,j,seed+1)*(C-4),hash2(i,j,seed+2)]);
  const P0=pal(['#3e3a34','#56514a','#6c665c','#827b6e','#988f80','#aaa292']);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let d1=1e9,d2=1e9,v=0,bx=0,by=0;for(const[px,py,h]of pts)for(const ox of[-S,0,S])for(const oy of[-S,0,S]){const d=Math.hypot(x-px-ox,y-py-oy);if(d<d1){d2=d1;d1=d;v=h;bx=px+ox;by=py+oy;}else if(d<d2)d2=d;}
    if(d2-d1<1.3)p.set(x,y,hex(hash2(x,y,seed+5)<.3?'#2e3a22':'#2a2622'));else{const L=.35+v*.45-(y-by)*.035-(x-bx)*.02-d1*.03+sxN(x,y,seed+6)*.1;p.set(x,y,sxShade(P0,L,x,y));}}return p.done();}
function sxFlags(seed,cols){const S=64,p=new Px(S,S),P0=pal(cols||['#6a655a','#8a8476','#a29c8e','#b8b2a2','#cac4b4']);const cuts=[[0,16,32,48],[0,24,40]];
  for(let y=0;y<S;y++){const row=Math.floor(y/16),xs=cuts[row%2],ly=y%16;for(let x=0;x<S;x++){let k=0;for(let i=0;i<xs.length;i++)if(x>=xs[i])k=i;const lx=x-xs[k],seam=ly===15||lx===0;
    const L=.55+sxN(k,row,seed)*.35+(ly===0?.12:0)+(lx===1?.08:0)+sxN(x,y,seed+1)*.12+(hash2(x>>2,y>>2,seed+2)<.05?-.2:0);p.set(x,y,seam?hex('#4a463e'):sxShade(P0,L,x,y));}}return p.done();}
function sxGrass(seed){const S=64,p=new Px(S,S),G=pal(['#2a5420','#346228','#3e7230','#4a8238','#589444','#68a44e']);for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=sxShade(G,.55+sxN(x>>3,y>>3,seed)*.4+sxN(x,y,seed+1)*.35,x,y);
    if(hash2(x,y,seed+2)<.012)c=hex(['#f0e060','#ffffff','#e070a0'][(hash2(x,y,seed+3)*3)|0]);p.set(x,y,c);}return p.done();}
function sxAshlar(seed,cols){const S=64,p=new Px(S,S),P0=pal(cols);for(let y=0;y<S;y++){const row=Math.floor(y/11),ly=y%11,bw=row%2?22:16,off=(row*7)%bw;for(let x=0;x<S;x++){const lx=(x+off)%bw,blk=Math.floor((x+off)/bw);
    if(ly===10||lx===bw-1){p.set(x,y,sxShade(P0,.05,x,y));continue;}const L=.55+sxN(blk,row,seed)*.35+(ly===0||lx===0?.18:0)+(ly===9||lx===bw-2?-.15:0)+sxN(x,y,seed+1)*.1;p.set(x,y,sxShade(P0,L,x,y));}}return p.done();}
// =========================================================
// Materialien der Stadt (ersetzen die alten)
// =========================================================
const SX_UP=[{k:'timber',wall:'#e8dcc0',beam:'#4a3018',shut:'#2e5a3a',seed:11},{k:'timber',wall:'#dcc8a0',beam:'#5a3a1c',shut:null,box:1,cross:1,seed:12},{k:'plaster',wall:'#d4c4b0',beam:'#3a2a20',frame:'#e8e4dc',shut:'#3a4e7a',box:1,seed:13},
  {k:'timber',wall:'#e8d2a8',beam:'#6a4020',shut:'#8a2a24',seed:14},{k:'brick',wall:'#9a4a32',beam:'#3a2a20',frame:'#e8e4dc',mortar:'#c8bca8',seed:15},
  {k:'brick',wall:'#7a5038',beam:'#2a1a10',frame:'#d8d0c0',mortar:'#b8ac98',box:1,seed:16},{k:'plaster',wall:'#e0d090',beam:'#3a2a20',frame:'#f0ece0',shut:'#2a6a6a',seed:17},{k:'timber',wall:'#c8d0c8',beam:'#2e2420',shut:'#6a2a5a',cross:1,box:1,seed:18}];
const SX_UPI=[0,1,2,3,4,6,7,8],SX_GRI={stone:5,shop:9,plinth:10};
{const a=cityMats;cityMats=function(){if(CTYM)return CTYM;const C=a();
  const mk=([c,mm])=>{const m=new THREE.MeshLambertMaterial({map:sxTex(c),emissiveMap:sxTex(mm),emissive:new THREE.Color(0xffd080),emissiveIntensity:0});return m;};
  const up=SX_UP.map(o=>mk(sxFacade(o))),facs=[up[0],up[1],up[2],up[3],up[4],mk(sxGround('stone',21)),up[5],up[6],up[7],mk(sxGround('shop',22)),mk(sxGround('plinth',23))];
  C.facs=facs;C.gable=SX_UP.map(o=>new THREE.MeshLambertMaterial({color:new THREE.Color(o.k==='brick'?o.wall:o.wall)}));
  C.tile=sxMat(sxRoof(['#4a1a10','#6a2414','#8a3420','#a8482a','#c25e38'],31),1.6);C.tile2=sxMat(sxRoof(['#3a2418','#5a3420','#74462c','#8e5a3a','#a46c48'],32,{moss:.06}),1.6);
  C.slate=sxMat(sxRoof(['#1e222a','#2a2e38','#3a404c','#4a5260','#5a6474'],33,{slate:1}),1.6);C.slate2=sxMat(sxRoof(['#2a2a2a','#3a3a3a','#4a4a48','#5c5c58'],34,{slate:1,moss:.04}),1.6);
  C.pave.map=sxTex(sxCobble(41));C.paveB=sxMat(sxCobble(41),3);C.plaza.map=sxTex(sxFlags(42));C.grass.map=sxTex(sxGrass(43));
  C.ashlar=sxMat(sxAshlar(44,['#4a463e','#5c584e','#6e6a5e','#807b6e','#948e80']),3);C.ashlarD=sxMat(sxAshlar(45,['#24242a','#32323a','#40404a','#4e4e58','#5c5c66']),3);
  C.light=sxMat(sxAshlar(46,['#8a8478','#a29c8e','#b8b2a2','#cac4b4','#dcd6c6']),2);C.beam=new THREE.MeshLambertMaterial({color:0x3a2614});C.brick=sxMat(sxFacade({k:'brick',wall:'#8a4030',beam:'#000',mortar:'#c0b49e',seed:47})[0],3);
  C.sign=[0x8a1a1a,0x1a3a8a,0x2a6a2a,0xb8901a,0x5a2a6a].map(c=>new THREE.MeshLambertMaterial({color:c}));C.copper=new THREE.MeshLambertMaterial({color:0x4a8a7a});
  return CTYM=C;};}
// Turm- und Mauermaterialien der Stadt ersetzen (nur für die Stadt; alle haben jetzt Meter-Maßstab)
{const a=twMats;twMats=function(){if(TWM&&TWM._sx)return TWM;const M=a(),C=cityMats();
  M.wall=C.ashlar;M.base=C.ashlarD;M.stone=C.light;M.roof=C.slate;M.cob=C.paveB;M.marble=new THREE.MeshLambertMaterial({color:0xe2ddd0});M._sx=1;return M;};}
// =========================================================
// Texturen im Meter-Maßstab: mgPush rechnet die UVs von Kästen, Zylindern und Kegeln nach
// =========================================================
function sxBoxUV(g,tm,mh){const p=g.parameters,w=p.width,h=p.height,d=p.depth,uv=g.attributes.uv;const su=[d,d,w,w,w,w],sv=[h,h,d,d,h,h];
  for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*su[f]/tm,uv.getY(i)*sv[f]/(mh||tm));}g.userData.uvOK=1;}
function sxCylUV(g,tm){const p=g.parameters,r=Math.max(p.radiusTop||0,p.radiusBottom||p.radius||0)||1,h=p.height||1,uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*Math.max(1,Math.round(6.283*r/tm)),uv.getY(i)*h/tm);g.userData.uvOK=1;}
{const a=mgPush;mgPush=function(MG,mat,geo,x,y,z,ry,rx,rz){const tm=mat&&mat.userData&&mat.userData.tm;if(tm&&geo&&!geo.userData.uvOK&&geo.parameters&&geo.attributes.uv){
    if(geo.type==='BoxGeometry')sxBoxUV(geo,tm);else if(geo.type==='CylinderGeometry'||geo.type==='ConeGeometry')sxCylUV(geo,tm);}return a(MG,mat,geo,x,y,z,ry,rx,rz);};}
{const a=ctBox;ctBox=function(w,h,d){const g=a(w,h,d);g.userData.uvOK=1;return g;};}
// Kasten mit Fassade: Stockwerk = mh Meter, Fensterachsen in ganzen Modulen
function sxFacBox(w,h,d,mh){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,span=[d,d,w,w,w,w],hh=[h,h,d,d,h,h];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*Math.max(1,Math.round(span[f]/3)),uv.getY(i)*(f===2||f===3?.01:hh[f]/mh));}g.userData.uvOK=1;return g;}
// =========================================================
// Neue Bebauung: Größen bunt gemischt, auch große Patrizierhäuser
// =========================================================
function sxLayout(){const r=mulberry32(90210),L=[],yards=[];const CL=[];
  for(let i=0;i<CT_L.length-1;i++)for(let j=0;j<CT_L.length-1;j++){const xa=CT_L[i],xb=CT_L[i+1],za=CT_L[j],zb=CT_L[j+1];CL.push({x0:xa+ctLW(xa,true)/2+.3,x1:xb-ctLW(xb,true)/2-.3,z0:za+ctLW(za,false)/2+.3,z1:zb-ctLW(zb,false)/2-.3});}
  const nearSt=(x,z)=>{let b='',bd=1e9;for(const S of CITY_ST)for(let k=0;k<S.p.length-1;k++){const d=ctSegD(x,z,S.p[k],S.p[k+1]);if(d<bd){bd=d;b=S.n;}}return b;};
  for(const c of CL){const W=c.x1-c.x0,Dz=c.z1-c.z0;if(W<6||Dz<6)continue;
    const dep=()=>Math.min(12,6.5+r()*4.5),dN=dep(),dS=Dz>22?dep():7,dW=dep(),dE=W>22?dep():7;
    const row=(len,place,dd)=>{let t=0;while(len-t>=4.5){const q=r(),rest=len-t;let w,st,big=0,small=0;
        if(q<.13&&rest>=12&&dd>=8.5){w=Math.min(rest,11+r()*8);st=4+(r()<.5?1:0);big=1;}
        else if(q<.33){w=4.5+r()*1.6;st=3+(r()<.45?1:0);}else if(q<.8){w=6+r()*3;st=2+((r()*3)|0);}else if(q<.92){w=9+r()*3.5;st=2+((r()*2)|0);}else{w=5+r()*2;st=1;small=1;}
        if(rest-w<4.5)w=rest;place(t,w,st,big,small);t+=w;}};
    const add=(x,z,w,d,ry,st,big,small,sn)=>{const R={x,z,w,d:small?Math.min(d,6.5):d,ry,st,big,small,v:(r()*8)|0,roof:(r()*4)|0,chim:r()<.6,gv:big?'stone':r()<.22?'shop':r()<.5?'plinth':'stone',
        box:r()<.4,dorm:big?2+((r()*2)|0):(st>=3&&r()<.3?1:0),tower:big&&r()<.45,sign:r()<.25,quoin:r()<.5,seed:(r()*1e6)|0};
      if(small){const sh=(d-R.d)/2;R.x-=Math.sin(ry)*sh;R.z-=Math.cos(ry)*sh;}
      const pts=ctCorners(R.x,R.z,R.w-.2,R.d-.2,ry).concat([[R.x,R.z]]);if(pts.every(([px,pz])=>ctBuildOK(px,pz))){R.street=sn;L.push(R);}};
    row(W,(t,w,st,big,small)=>add(c.x0+t+w/2,c.z0+dN/2,w,dN,Math.PI,st,big,small,nearSt(c.x0+t+w/2,c.z0-2)),dN);
    if(Dz>dN+dS+3)row(W,(t,w,st,big,small)=>add(c.x0+t+w/2,c.z1-dS/2,w,dS,0,st,big,small,nearSt(c.x0+t+w/2,c.z1+2)),dS);
    const zs=c.z0+dN,ze=c.z1-dS;if(ze-zs>4.5){row(ze-zs,(t,w,st,big,small)=>add(c.x0+dW/2,zs+t+w/2,w,dW,-Math.PI/2,st,big,small,nearSt(c.x0-2,zs+t+w/2)),dW);
      if(W>dW+dE+3)row(ze-zs,(t,w,st,big,small)=>add(c.x1-dE/2,zs+t+w/2,w,dE,Math.PI/2,st,big,small,nearSt(c.x1+2,zs+t+w/2)),dE);}
    if(W>dW+dE+4&&Dz>dN+dS+4)yards.push({x0:c.x0+dW,x1:c.x1-dE,z0:c.z0+dN,z1:c.z1-dS});}
  CITY.lots=L;CITY.yards=yards.filter(Y=>!CITY.res.some(R=>[[Y.x0,Y.z0],[Y.x1,Y.z0],[Y.x0,Y.z1],[Y.x1,Y.z1],[(Y.x0+Y.x1)/2,(Y.z0+Y.z1)/2]].some(([x,z])=>ctHas(R,x,z,1))));
  const want=[[-100,-62],[-170,62],[-100,62],[-160,-62],[-120,-130],[110,-130],[120,130],[-80,140]],used=new Set();CITY.rent=[];
  want.forEach(([wx,wz],i)=>{let b=null,bd=1e9;for(const l of L){if(used.has(l)||l.big||l.small||l.w<6.5||l.w>10||l.d>10)continue;const d=Math.hypot(l.x-wx,l.z-wz);if(d<bd){bd=d;b=l;}}if(b){used.add(b);b.rent=1;b.st=2;CITY.rent.push({id:'r'+(i+1),n:i+1,lx:b.x,lz:b.z,ry:b.ry,street:b.street,lot:b});}});}
sxLayout();
// =========================================================
// Häuser bauen
// =========================================================
function sxHouse(K,l,C){const{M,put,sol,H,X,Z}=K,B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),x=X+l.x,z=Z+l.z,c=Math.cos(l.ry),s=Math.sin(l.ry),R=mulberry32(l.seed);
  // lokale Koordinaten: lx nach rechts entlang der Front, lz nach vorn zur Straße
  const L2W=(lx,lz)=>[x+lx*c+lz*s,z-lx*s+lz*c],at=(mat,geo,lx,y,lz,rx,rz)=>{const[px,pz]=L2W(lx,lz);put(mat,geo,px,y,pz,l.ry,rx,rz);};
  const up=SX_UPI[l.v],upO=SX_UP[l.v],timber=upO.k==='timber',h1=l.small?3.6:3.4,nUp=Math.max(0,l.st-1),hu=3.2*nUp,ov=timber&&nUp?.3:0,w=l.w,d=l.d;
  // Erdgeschoss
  if(l.open)sxHollow(K,C,at,L2W,l.ry,w,d,h1,C.facs[SX_GRI[l.gv]],nUp?'manorS':'manor',R);else at(C.facs[SX_GRI[l.gv]],sxFacBox(w,h1,d,h1),0,H+h1/2,0);
  if(nUp){if(l.open)sxUpperRoom(K,C,at,L2W,l.ry,w,d+ov*2,h1,hu,C.facs[up],R);else at(C.facs[up],sxFacBox(w,hu,d+ov*2,3.2),0,H+h1+hu/2,0);if(l.open){const DD=d+ov*2+.1,WW=w+.06;at(C.beam,B(WW,.24,.4),0,H+h1,-DD/2+.2);at(C.beam,B(WW,.24,.4),0,H+h1,DD/2-.2);at(C.beam,B(.4,.24,DD-.8),-WW/2+.2,H+h1,0);at(C.beam,B(.4,.24,DD-.8),WW/2-.2,H+h1,0);}else at(C.beam,B(w+.06,.24,d+ov*2+.1),0,H+h1,0);
    if(timber)for(const sx of[-1,1])for(const sz of[-1,1])at(C.beam,B(.22,hu,.22),sx*(w/2-.08),H+h1+hu/2,sz*(d/2+ov-.08));
    if(l.big){at(C.light,B(w+.3,.35,d+ov*2+.3),0,H+h1+hu-.1,0);for(let k=1;k<nUp;k++)at(C.light,B(w+.12,.14,d+ov*2+.12),0,H+h1+3.2*k,0);}}
  if(l.quoin||l.big)for(const sx of[-1,1])for(let y=0;y<h1-.3;y+=.6)at(C.light,B(.5+(Math.round(y/.6)%2)*.25,.5,.5),sx*(w/2-.15),H+y+.3,d/2-.15);
  const h=h1+hu;sol.push(solAdd({x,z,hw:w/2,hd:d/2+ov,y0:l.open?(nUp?H+h1+3:H+h1-.25):H-2,y1:H+h,rot:-l.ry,solid:1,tw:1}));
  // Dach (Satteldach, First parallel zur Straße), mit Überstand und Firstziegeln
  const rm=[C.tile,C.slate,C.tile2,C.slate2][l.roof],dd=d/2+ov,hr=Math.min(7,(l.big?3.2:2.2)+d*(l.big?.2:.13)),eo=.55,sl=Math.hypot(dd+eo,hr+eo*hr/dd),ang=Math.atan2(hr,dd);
  for(const s2 of[-1,1])at(rm,B(w+.6,.24,sl),0,H+h+hr/2-eo*hr/dd/2+.05,s2*(dd+eo)/2,s2*ang);at(rm,B(w+.6,.3,.42),0,H+h+hr+.08,0);
  for(const sx of[-1,1])at(C.gable[l.v],ctGable(w,dd*2,hr),sx*(w/2-.01),H+h,0);
  // Gauben
  if(l.dorm&&w>=6){const n=Math.min(l.dorm,Math.floor(w/3.4));for(let k=0;k<n;k++){const lx=(k-(n-1)/2)*(w/n),gz=dd*.45,gy=H+h+hr*(1-.45)-.2;at(C.facs[up],sxFacBox(1.8,1.7,2,1.7),lx,gy+.85,gz);
      for(const s2 of[-1,1])at(rm,B(.24,1.6,2.4),lx+s2*.62,gy+2.1,gz,0,s2*.75);at(C.gable[l.v],ctGable(0,1.8,.9).rotateY(Math.PI/2),lx,gy+1.7,gz+1);}}
  // Schornsteine
  if(l.chim){const n=l.big?2:1;for(let k=0;k<n;k++){const lx=(k?-1:1)*(w/2-1.1),ch=1.6+R()*1.2;at(C.brick,B(.8,ch+hr*.5,.8),lx,H+h+hr*.5+ch/2,-dd*.35);at(C.ashlarD,B(1,.18,1),lx,H+h+hr*.5+ch+.09,-dd*.35);}}
  // Erkertürmchen an großen Häusern
  if(l.tower&&!l.open){const sx=R()<.5?-1:1,tx=sx*(w/2-.9),tz=dd-.9,ty=H+h1+1;const[px,pz]=L2W(tx,tz);{const tg=new THREE.CylinderGeometry(1.25,1.25,hu+1.2,10,1,true),tu=tg.attributes.uv;for(let i=0;i<tu.count;i++)tu.setXY(i,tu.getX(i)*3,tu.getY(i)*(hu+1.2)/3.2);tg.userData.uvOK=1;put(C.facs[up],tg,px,ty+(hu+1.2)/2-1,pz);}
    put(C.light,new THREE.CylinderGeometry(1.35,.4,1.1,10),px,ty-1.5,pz);put(rm,new THREE.ConeGeometry(1.6,3.4,10),px,ty+hu+1.9,pz);put(M.gold,new THREE.SphereGeometry(.18,6,4),px,ty+hu+3.7,pz);}
  // Tür mit Rahmen und Stufe, Schild, Lampe
  const fz=d/2+.04,dw=l.open?2.2:l.big?1.8:1.15,dh=l.open?2.8:l.big?2.8:2.25;if(!l.open)at(M.dark,B(dw,dh,.1),0,H+dh/2,fz);at(C.beam,B(dw+.3,.2,.16),0,H+dh+.1,fz+.02);for(const sx of[-1,1])at(C.beam,B(.15,dh,.14),sx*(dw/2+.08),H+dh/2,fz+.02);
  at(C.light,B(dw+.8,.16,.6),0,H+.08,fz+.3);if(l.big){at(C.light,B(dw+1.6,.12,1),0,H+.06,fz+.6);for(const sx of[-1,1])at(C.light,B(.45,dh+.6,.45),sx*(dw/2+.5),H+(dh+.6)/2,fz+.2);at(C.light,B(dw+1.6,.4,.6),0,H+dh+.5,fz+.25);}
  if(l.sign||l.gv==='shop'){const sx=R()<.5?-1:1;at(C.iron,B(.08,.08,1.1),sx*(w/2-.9),H+3.05,fz+.55);at(C.sign[(R()*5)|0],B(.08,.7,.9),sx*(w/2-.9),H+2.55,fz+.75);}
  return{door:L2W(0,d/2+1.2),lampAt:L2W(w/2-.5,d/2+.05),fwd:[s,c]};}
// =========================================================
// Begehbare Gebäude: Läden, Wirtshaus, Patrizierhäuser
// =========================================================
// Erdgeschoss als Hohlraum mit Türöffnung, Innenwänden aus Putz, Decke und Einrichtung
function sxHollow(K,C,at,l2w,ry,w,d,h1,fac,kind,R){const{M,sol,H}=K,B=(a,b,c)=>new THREE.BoxGeometry(a,b,c),th=.35,dw=2.2,sw=(w-dw)/2,P2=C.inner||(C.inner=new THREE.MeshLambertMaterial({color:0xe4d8bc})),FL=C.floor||(C.floor=sxMat(sxFlags(48,['#5a3a1c','#6e4824','#82582c','#966a36','#a87a40']),2));
  const wall=(lx,lz,ww,dd)=>{at(fac,sxFacBox(ww,h1,dd,h1),lx,H+h1/2,lz);const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:ww/2,hd:dd/2,y0:H-2,y1:H+h1,rot:-ry,solid:1,tw:1}));};
  wall(0,-d/2+th/2,w,th);wall(-w/2+th/2,0,th,d-th*2);wall(w/2-th/2,0,th,d-th*2);wall(-(dw/2+sw/2),d/2-th/2,sw,th);wall(dw/2+sw/2,d/2-th/2,sw,th);at(fac,sxFacBox(dw,h1-2.8,th,h1),0,H+2.8+(h1-2.8)/2,d/2-th/2);
  const iw=w-th*2,id=d-th*2;at(P2,B(iw,h1-.2,.04),0,H+h1/2,-d/2+th+.02);at(P2,B(.04,h1-.2,id),-w/2+th+.02,H+h1/2,0);at(P2,B(.04,h1-.2,id),w/2-th-.02,H+h1/2,0);
  for(const sx of[-1,1])at(P2,B(sw-.04,h1-.2,.04),sx*(dw/2+sw/2),H+h1/2,d/2-th-.02);
  {const g=new THREE.BoxGeometry(iw,.06,id);sxBoxUV(g,2);at(FL,g,0,H+.04,0);}if(kind==='manorS')sxStairCeil(K,C,at,l2w,ry,iw,id,h1);else{at(M.wood,B(iw,.18,id),0,H+h1-.09,0);for(let k=-2;k<=2;k++)at(C.beam,B(.25,.25,id),k*iw/5,H+h1-.3,0);}
  const box=(m,a,b,c,lx,y,lz,solid)=>{at(m,B(a,b,c),lx,H+y,lz);if(solid){const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:a/2,hd:c/2,y0:H-2,y1:H+y+b/2,rot:-ry,solid:1,tw:1}));}};
  const glow=(lx,y,lz)=>{at(C.iron,B(.06,.6,.06),lx,H+h1-.5,lz);at(C.lamp,B(.36,.4,.36),lx,H+y,lz);};
  const shelf=(lx,lz,len)=>{box(M.wood,len,2.4,.5,lx,1.2,lz,true);for(let r=0;r<3;r++)for(let k=0;k<Math.floor(len/.45);k++)if(R()<.8){const m=[M.red,M.blue,M.green,M.yellow,M.gold,M.wood][(R()*6)|0];at(m,B(.3,.32+R()*.2,.3),lx-len/2+.3+k*.45,H+.62+r*.75,lz+.06);}};
  const barrel=(lx,lz)=>{at(M.wood,new THREE.CylinderGeometry(.42,.42,1,10),lx,H+.5,lz);at(C.iron,new THREE.CylinderGeometry(.44,.44,.08,10),lx,H+.75,lz);const[px,pz]=l2w(lx,lz);sol.push(solAdd({x:px,z:pz,hw:.4,hd:.4,y0:H-2,y1:H+1,rot:0,solid:1,tw:1}));};
  const table=(lx,lz,tw,td)=>{box(M.wood,tw,.12,td,lx,.85,lz,true);for(const sx of[-1,1])for(const sz of[-1,1])at(M.wood,B(.12,.8,.12),lx+sx*(tw/2-.15),H+.4,lz+sz*(td/2-.15));};
  const bench=(lx,lz,len)=>{at(M.wood,B(len,.1,.4),lx,H+.48,lz);for(const sx of[-1,1])at(M.wood,B(.1,.45,.35),lx+sx*(len/2-.2),H+.23,lz);};
  const fire=(lx,lz)=>{box(C.light,2.6,2.2,.9,lx,1.1,lz,true);at(M.dark,B(1.5,1.1,.1),lx,H+.65,lz+.46);at(M.glow,B(1,.35,.1),lx,H+.32,lz+.48);at(C.light,B(3,.25,1.1),lx,H+2.2,lz+.1);};
  if(kind==='shop'){box(M.wood,iw*.55,1.05,.8,0,.52,-id/2+2.6,true);at(M.wood,B(iw*.55+.1,.08,.9),0,H+1.08,-id/2+2.6);shelf(0,-id/2+.35,iw*.7);barrel(iw/2-.7,id/2-.9);barrel(iw/2-.7,id/2-1.9);
    for(let k=0;k<3;k++)box(M.wood,.8,.6,.8,-iw/2+.8,.3+k*.0,id/2-1-k*1,true);glow(0,h1-1.1,0);glow(-iw/4,h1-1.1,-id/4);glow(iw/4,h1-1.1,-id/4);}
  else if(kind==='tavern'){box(M.wood,.8,1.1,id*.6,-iw/2+1.6,.55,-id*.1,true);for(let k=0;k<4;k++)barrel(-iw/2+.6,-id/2+1+k*1.1);fire(iw/2-2,-id/2+.45);
    for(const[tx,tz]of[[1,-1.5],[1,2],[-1.6+iw/4,2.4],[iw/4+1.4,.3]]){table(tx,tz,1.8,1);bench(tx,tz-.9,1.8);bench(tx,tz+.9,1.8);}for(let k=0;k<3;k++)glow(-iw/4+k*iw/4,h1-1.1,0);}
  else{const cg=new THREE.BoxGeometry(iw*.7,.02,id*.6);at(M.red,cg,0,H+.08,0);at(M.gold,B(iw*.7+.1,.025,id*.6+.1),0,H+.075,0);table(0,0,Math.min(4,iw*.5),1.2);for(const sx of[-1,0,1])for(const sz of[-1,1])box(M.wood,.45,.9,.45,sx*1.2,.45,sz*1,false);
    fire(0,-id/2+.45);{const len=Math.max(1.2,iw/2-2.2);if(kind!=='manorS')shelf(-(1.6+len/2),-id/2+.35,len);shelf(1.6+len/2,-id/2+.35,len);}glow(0,h1-1.2,0);at(M.gold,new THREE.TorusGeometry(.6,.05,4,12),0,H+h1-1.3,0,Math.PI/2);}}
// Läden und Wirtshaus (ersetzen die alten geschlossenen Gebäude)
function sxShopBuild(K,R,kind,si){const{M,put,sol,H,X,Z}=K,C=cityMats(),x=X+R.x,z=Z+R.z,c=Math.cos(R.ry),s=Math.sin(R.ry),Rn=mulberry32(77+si);
  const L2W=(lx,lz)=>[x+lx*c+lz*s,z-lx*s+lz*c],at=(mat,geo,lx,y,lz,rx,rz)=>{const[px,pz]=L2W(lx,lz);put(mat,geo,px,y,pz,R.ry,rx,rz);};
  const h1=4.4,h=9.6,fac=kind==='tavern'?C.facs[3]:C.facs[[9,10,9,10][si%4]],up=kind==='tavern'?C.facs[3]:C.facs[[0,4,2,8][si%4]];
  sxHollow(K,C,at,L2W,R.ry,R.w,R.d,h1,fac,kind,Rn);at(up,sxFacBox(R.w,h-h1,R.d,3.2),0,H+h1+(h-h1)/2,0);at(C.beam,new THREE.BoxGeometry(R.w+.1,.25,R.d+.1),0,H+h1,0);
  sol.push(solAdd({x,z,hw:R.w/2,hd:R.d/2,y0:H+h1-.25,y1:H+h,rot:-R.ry,solid:1,tw:1}));
  const hr=3.4,sl=Math.hypot(R.d/2+.6,hr),ang=Math.atan2(hr,R.d/2),rm=kind==='tavern'?C.tile2:si%2?C.slate:C.tile;for(const s2 of[-1,1])at(rm,new THREE.BoxGeometry(R.w+.8,.3,sl),0,H+h+hr/2,s2*R.d/4,s2*ang);at(rm,new THREE.BoxGeometry(R.w+.8,.34,.45),0,H+h+hr+.05,0);
  for(const sx of[-1,1])at(C.gable[kind==='tavern'?3:0],ctGable(R.w,R.d,hr),sx*(R.w/2-.01),H+h,0);
  const fz=R.d/2+.06;at(C.beam,new THREE.BoxGeometry(2.6,.25,.2),0,H+2.92,fz);for(const sx of[-1,1])at(C.beam,new THREE.BoxGeometry(.2,2.9,.2),sx*1.2,H+1.45,fz);
  const signs=[M.red,M.blue,M.green,M.yellow];if(kind==='tavern'){at(M.wood,new THREE.BoxGeometry(.15,.15,1.6),3,H+5,fz+.8);at(M.gold,new THREE.BoxGeometry(1.4,1,.12),3,H+4.3,fz+1.5);}
  else at(signs[si%4],new THREE.BoxGeometry(6,1.1,.2),0,H+4.95,fz+.1);
  for(const sx of[-1,1]){at(C.iron,new THREE.BoxGeometry(.08,.08,.7),sx*2,H+3.35,fz+.35);at(C.lamp,new THREE.BoxGeometry(.32,.45,.32),sx*2,H+3,fz+.7);const[lx,lz]=L2W(sx*2,fz+.7);CITY.lamps.push([lx,H+2.9,lz]);}
  return{inside:L2W(0,-R.d/2+1.5),front:L2W(0,R.d/2+1.6),center:L2W(0,.5)};}
// Neue Händler in den leeren Läden
SHOPS['Bogenmacherin Wenna']={title:'Wennas Bögen',greet:'Bögen, Armbrüste und Pfeile aller Art. Ein guter Schütze lebt länger.',buy:[],sell:[]};
SHOPS['Schildmacher Bertold']={title:'Bertolds Schilde',greet:'Ein Schild ist der beste Freund, den du im Turm haben kannst.',buy:[],sell:[]};
for(const n of['Bogenmacherin Wenna','Schildmacher Bertold'])DIALOGS[n]={start:()=>'hello',nodes:{hello:()=>({text:SHOPS[n].greet,opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop(n);return null;}},{label:'Leb wohl.',go:null}]})}};
// Turmbewohner in den Patrizierhäusern
const SX_MANOR_LINES=['Willkommen in meinem Haus. Fass bitte nichts an.','Meine Familie handelt seit drei Generationen mit Turmbeute.','Der Kamin hier ist älter als die Stadtmauer.','Mein Sohn will unbedingt in den Turm. Ich hoffe, er überlegt es sich.','Hast du schon das Runenerz aus der Tiefe gesehen? Es soll leuchten.'];
// Die Stadt aufbauen: nahe Häuser sofort, der Rest Stück für Stück in den nächsten Bildern
let SXQ=null;
{const pick=CITY.lots.filter(l=>l.big&&!l.rent).sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z)).slice(0,4);for(const l of pick){l.open=1;l.gv='stone';}}
{const a=twCity;twCity=function(K){const all=CITY.lots,res=CITY.res;CITY.lots=all.filter(l=>l.rent);CITY.res=res.filter(R=>R.k!=='shop'&&R.k!=='tavern');try{a(K);}finally{CITY.lots=all;CITY.res=res;}
  const C=cityMats();TWS.shops=[];TWS.inShops=[];let si=0;for(const R of res){try{if(R.k==='shop'){const o=sxShopBuild(K,R,'shop',si++);TWS.shops.push({x:o.inside[0],z:o.inside[1]});TWS.inShops.push(o);}
      else if(R.k==='tavern'){const o=sxShopBuild(K,R,'tavern',9);CITY.tavern={x:o.center[0],z:o.center[1]};}}catch(e){console.error('Laden',e);}}
  TWS.manors=[];const near=[],far=[];let n=0;for(const l of all){if(l.rent)continue;const c=Math.cos(l.ry),s=Math.sin(l.ry),x=K.X+l.x,z=K.Z+l.z,door=[x+s*(l.d/2+1.2),z+c*(l.d/2+1.2)];
    TWS.houses.push({x,z,r:Math.hypot(l.w,l.d)/2,door,lot:l});if(l.open)TWS.manors.push({x,z,door,lot:l});if((n++)%2===0){const lx=x+c*(l.w/2-.5)+s*(l.d/2+.05),lz=z-s*(l.w/2-.5)+c*(l.d/2+.05);
      K.put(C.iron,new THREE.BoxGeometry(.08,.08,.7),lx+s*.35,K.H+3.35,lz+c*.35,Math.atan2(s,c));K.put(C.lamp,new THREE.BoxGeometry(.32,.45,.32),lx+s*.7,K.H+3,lz+c*.7);CITY.lamps.push([lx+s*.7,K.H+2.9,lz+c*.7]);}
    (Math.hypot(x-P.x,z-P.z)<110||l.open?near:far).push(l);}
  for(const l of near)try{sxHouse(K,l,C);}catch(e){console.error('Haus',e);}
  far.sort((p,q)=>Math.hypot(K.X+p.x-P.x,K.Z+p.z-P.z)-Math.hypot(K.X+q.x-P.x,K.Z+q.z-P.z));const MG2=new Map();
  SXQ={list:far,i:0,K2:Object.assign({},K,{MG:MG2,put:(mat,geo,x,y,z,ry,rx,rz)=>mgPush(SXQ.MG,mat,geo,x,y,z,ry,rx,rz)}),MG:MG2,n:0,grp:K.grp};};}
function sxQueueTick(){const Q=SXQ;if(!Q||!TWS.built||TWS.grp!==Q.grp){SXQ=null;return;}const C=cityMats(),t0=performance.now();
  while(Q.i<Q.list.length&&performance.now()-t0<6){try{sxHouse(Q.K2,Q.list[Q.i],C);}catch(e){}Q.i++;Q.n++;}
  if(Q.n>=140||Q.i>=Q.list.length){mgBuild(Q.MG,Q.grp);Q.MG=new Map();Q.n=0;}if(Q.i>=Q.list.length)SXQ=null;}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{sxQueueTick();}catch(e){SXQ=null;console.error('Stadtaufbau',e);}};}
{const a=twFree;twFree=function(){SXQ=null;return a();};}
// Händler und Bewohner der begehbaren Häuser
{const a=twSpawnFolk;twSpawnFolk=function(){a();try{const add=(look,x,z,o)=>{const e=spawnEnt('tc'+look,x,z,Object.assign({home:{x,z},talk:0,tc:1,wander:false},o||{}));TWS.ents.push(e);return e;};
    const S=TWS.shops;if(S[2]){const e=add(2,S[2].x,S[2].z,{name:'Bogenmacherin Wenna',role:'Bögen und Pfeile · Dungeon-Stadt',trader:1});e.portrait=twPortrait('tc2_0');}
    if(S[3]){const e=add(6,S[3].x,S[3].z,{name:'Schildmacher Bertold',role:'Schilde · Dungeon-Stadt',trader:1});e.portrait=twPortrait('tc6_0');}
    (TWS.manors||[]).forEach((m,i)=>{add([1,3,5,0][i%4],m.x,m.z,{name:['Patrizier Aldo','Patrizierin Isolde','Ratsherr Gerwin','Kauffrau Helma'][i%4],role:'Patrizierhaus · Dungeon-Stadt'});});}catch(e){console.error('Ladenbesitzer',e);}};}
shopMerge('Bogenmacherin Wenna',['bow','longbow','compbow','xbow','arrow_fire','arrow_poison','arrow_silver','ex_sharp_bow','ex_hard_bow','ex_sharp_longbow','ex_hard_compbow','ex_sharp_xbow','ex_hard_xbow'],['bow','longbow','compbow','xbow','rune_bow'],[['arrow',3]],[['stick',1],['rope',3],['feather',3],['horn',14]]);
shopMerge('Schildmacher Bertold',['shield','iron_shield','mythril_shield','adamant_shield','ex_sturdy_iron_shield','ex_fire_iron_shield','ex_ward_iron_shield','ex_sturdy_mythril_shield','ex_fire_mythril_shield','ex_ward_mythril_shield','ex_sturdy_adamant_shield','ex_fire_adamant_shield','ex_ward_adamant_shield'],['shield','iron_shield','mythril_shield','adamant_shield','rune_shield'],[],[['iron_ingot',30],['wood',3]]);
// Bewohner sagen in ihren Häusern etwas Eigenes
{const a=say;say=function(e,txt,t){if(e&&/^(Patrizier|Ratsherr|Kauffrau)/.test(e.name||'')&&typeof txt==='string'&&TC_LINES.includes(txt))txt=SX_MANOR_LINES[(Math.random()*SX_MANOR_LINES.length)|0];return a(e,txt,t);};}
// Die Stadt nicht mehr behalten, wenn man in einer Turm-Ebene ist (die liegen jetzt weit weg)
{const a=twTick;twTick=function(dt){if(P.x>60000&&TWS.built&&DGX.on&&DGX.d&&DGX.d.tower)twFree();return a(dt);};}
