/* =========================================================
   V62 · Coda neu gebaut: richtige Fachwerkhäuser (Überhang, Anbauten, Giebelhäuser,
   Katen mit Vordach), Blumenkästen, Schornsteine, ein Rathaus mit Dachreiter
   und ein Marktplatz mit Ständen.
   ========================================================= */
function gableZ(roofM,wallM,b,x0,x1,top,z0,z1,rh,ov=.45){const P=(x,y,z)=>W3(b,x,y,z),xm=(x0+x1)/2,sl=Math.hypot(rh+.3,(x1-x0)/2+ov);
  quad(roofM,P(x1+ov,top-.3,z1+ov),P(x1+ov,top-.3,z0-ov),P(xm,top+rh,z0-ov),P(xm,top+rh,z1+ov),(z1-z0+2*ov)/2,sl/2);
  quad(roofM,P(x0-ov,top-.3,z0-ov),P(x0-ov,top-.3,z1+ov),P(xm,top+rh,z1+ov),P(xm,top+rh,z0-ov),(z1-z0+2*ov)/2,sl/2);
  for(const z of[z0,z1])tri(wallM,P(x0,top,z),P(x1,top,z),P(xm,top+rh,z),[0,0],[(x1-x0)/2,0],[(x1-x0)/4,rh/3]);}
{const vm0=villageMaterials;villageMaterials=function(){vm0();
  // Dorfhäuser statt Stadt-Fachwerk: gekalkter Putz, Feldstein, Blockbohlen
  const LM=pal(['#a8a090','#c4bcaa','#d8d0bc','#e6dfcc','#f0eadb']),FS=pal(['#4a443c','#5e574c','#746b5c','#8a806e','#a0957f']),LG=pal(['#2e1e10','#4a3018','#644222','#7c5630','#946a3e']);
  VM.lime=mat(pxTex(32,48,p=>{for(let y=0;y<48;y++)for(let x=0;x<32;x++){let L=.62+(vnoise(x*.15,y*.15,1981)-.5)*.35+(hash2(x,y,1982)-.5)*.12-(y>40?(y-40)*.04:0);let c=LM[shadeIdx(L,5,x,y)];
      if(vnoise(x*.25,y*.25,1983)>.74&&hash2(x>>1,y>>1,1984)<.8)c=FS[shadeIdx(.5+(hash2(x>>2,y>>1,1985)-.5)*.6,5,x,y)];p.set(x,y,c);}}));
  VM.field=mat(pxTex(32,32,p=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor((y+(hash2(x>>3,0,1986)*3|0))/6),cell=Math.floor((x+row*5)/7),fx=((x+row*5)%7),fy=(y+(hash2(x>>3,0,1986)*3|0))%6;
      const mort=fx===0||fy===0;p.set(x,y,mort?hex('#2e2a24'):FS[shadeIdx(.55+(hash2(cell,row,1987)-.5)*.6-(fy===5?.2:0)+(fx===1?.12:0),5,x,y)]);}}));
  VM.logs=mat(pxTex(32,32,p=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const fy=y%6,row=(y/6)|0;let L=fy===0?.05:.75-Math.abs(fy-2.5)*.16+(hash2(x>>2,row,1988)-.5)*.2+(vnoise(x*.3,row*3,1989)-.5)*.2;if(fy===5)L=.15;p.set(x,y,LG[shadeIdx(L,5,x,y)]);}}));
  VM.fachTimber=VM.fach;VM.fach=VM.lime;const T=VM.lime.map;
  // Holzschindeln statt Ziegeln
  const SW=pal(['#2e241a','#43352a','#5a4836','#715c44','#866e52']);VM.shingle=mat(pxTex(32,32,p=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=y>>2,off=(row&1)?3:0,ty=y&3,sx=((x+off)%6);
    p.set(x,y,SW[shadeIdx(.62-ty*.13-(sx===0?.28:0)+(hash2(((x+off)/6)|0,row,1965)-.5)*.35+(vnoise(x*.2,y*.2,1966)-.5)*.2,5,x,y)]);}}));VM.tilesOld=VM.tiles;VM.tiles=VM.shingle;
  VM.fachC=mat(T,{color:new THREE.Color(1,.95,.84)});VM.fachO=mat(T,{color:new THREE.Color(1,.9,.72)});VM.fachR=mat(T,{color:new THREE.Color(1,.9,.86)});VM.fachW=mat(T,{color:new THREE.Color(1.04,1.03,1)});
  const FL=[pal(['#c02838','#e04858','#ff8090']),pal(['#d8b020','#f0d040','#fff080']),pal(['#6a40c0','#9070e0','#c0a8ff']),pal(['#e8e8e8','#ffffff','#fff4d0'])],GR=pal(['#1e4a1a','#2e6a26','#4a8a34']);
  VM.flowers=mat(pxTex(32,8,p=>{for(let x=0;x<32;x++){const h=3+((hash2(x,0,1951)*4)|0);for(let y=8-h;y<8;y++)p.set(x,y,GR[(x+y)%3]);if(hash2(x,1,1952)<.55){const F=FL[(hash2(x>>1,2,1953)*4)|0];p.set(x,8-h-1,F[1]);p.set(x,8-h,F[2]);}}}),{alphaTest:.5,transparent:false});
  VM.arch=mat(pxTex(16,24,p=>{for(let y=0;y<24;y++)for(let x=0;x<16;x++){const inA=y>=7?x>=2&&x<=13:Math.hypot(x-7.5,y-7.5)<6;const rim=y>=7?(x===1||x===14):Math.abs(Math.hypot(x-7.5,y-7.5)-6.5)<1;
      if(inA)p.set(x,y,hex(y>18?'#2a1c10':'#1a120a'));else if(rim)p.set(x,y,hex('#8b867c'));}}),{alphaTest:.5,transparent:false});
  VM.clock=mat(pxTex(16,16,p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);if(d<7.5)p.set(x,y,d>6.3?hex('#a8762e'):hex('#f2ecd8'));}for(let k=0;k<12;k++){const a=k/12*6.283;p.set(7.5+Math.cos(a)*5.3,7.5+Math.sin(a)*5.3,hex('#3a2a18'));}
    for(let k=0;k<4;k++){p.set(7.5,7.5-k,hex('#1a120a'));p.set(7.5+k*.8,7.5+k*.3,hex('#1a120a'));}}),{alphaTest:.5,transparent:false});
  VM.hallSign=mat(pxTex(32,10,p=>{for(let y=0;y<10;y++)for(let x=0;x<32;x++)p.set(x,y,x===0||x===31||y===0||y===9?hex('#3a2414'):hex('#7a5032'));const G=hex('#f2cf6b');
    // „RATHAUS“ als kleine Pixelschrift
    const F={R:['110','101','110','101','101'],A:['010','101','111','101','101'],T:['111','010','010','010','010'],H:['101','101','111','101','101'],U:['101','101','101','101','111'],S:['011','100','010','001','110']};let cx=3;for(const ch of'RATHAUS'){const g=F[ch];for(let yy=0;yy<5;yy++)for(let xx=0;xx<3;xx++)if(g[yy][xx]==='1')p.set(cx+xx,2+yy,G);cx+=4;}}),{});
  VM.junkSign=mat(pxTex(32,10,p=>{for(let y=0;y<10;y++)for(let x=0;x<32;x++)p.set(x,y,x===0||x===31||y===0||y===9?hex('#3a2414'):hex('#5e3b24'));const G=hex('#e8d8a8');
    const F={T:['111','010','010','010','010'],R:['110','101','110','101','101'],O:['010','101','101','101','010'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],L:['100','100','100','100','111']};let cx=4;for(const ch of'TRODEL'){const g=F[ch];for(let yy=0;yy<5;yy++)for(let xx=0;xx<3;xx++)if(g[yy][xx]==='1')p.set(cx+xx,2+yy,G);cx+=4;}p.set(10,1,G);p.set(12,1,G);}),{});
  VM.cloth=['#b03030','#2a5aa0','#d8a028','#3a8a3a','#8a3a9a','#e8e0cc'].map(c=>{const C=hex(c);return mat(pxTex(16,16,p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=((x>>2)&1)?1:.82;p.set(x,y,[C[0]*k,C[1]*k,C[2]*k].map(v=>Math.min(255,v|0)));}}),{});});};}
// ---------- Details ----------
function hFlowerBox(b,face,along,y,w,hw,hd){const e=.02;if(face==='F'){boxL(VM.planks,b,along-w/2,along+w/2,y-.28,y-.05,hd,hd+.28,1,1);const P=(x,yy,z)=>W3(b,x,yy,z);quad(VM.flowers,P(along-w/2,y-.06,hd+.15),P(along+w/2,y-.06,hd+.15),P(along+w/2,y+.3,hd+.15),P(along-w/2,y+.3,hd+.15),1,1);}
  else if(face==='B'){boxL(VM.planks,b,along-w/2,along+w/2,y-.28,y-.05,-hd-.28,-hd,1,1);const P=(x,yy,z)=>W3(b,x,yy,z);quad(VM.flowers,P(along+w/2,y-.06,-hd-.15),P(along-w/2,y-.06,-hd-.15),P(along-w/2,y+.3,-hd-.15),P(along+w/2,y+.3,-hd-.15),1,1);}}
function hChimney(b,x,z,from,to){boxL(VM.stone,b,x-.38,x+.38,from,to,z-.38,z+.38,1,1);boxL(VM.stone,b,x-.48,x+.48,to,to+.15,z-.48,z+.48,1,1);}
function hDoor(b,y,hw,hd,w,h){boxL(VM.planks,b,-w/2-.15,w/2+.15,y,y+h+.18,hd,hd+.06,1,1,'FLRT');decal(VM.door,b,'F',0,y,w,h,hw,hd+.06);boxL(VM.stone,b,-w/2-.3,w/2+.3,y-.35,y,hd,hd+.7,1,1);}
const PLASTER=()=>[VM.lime,VM.fachC,VM.fachO,VM.fachR,VM.fachW];
function buildHouseV2(b,wallM,roofM){const v=b.home%4,hw=b.w/2,hd=b.d/2,base=footY(b,hw+.6,-hd-.6,hd+.6),yW=base+.4,PL=PLASTER(),wall=PL[(b.home*3+1)%PL.length],
    roof=v===3||b.home%2===0?VM.thatch:VM.shingle,win=(f,a,y)=>decal(VM.win,b,f,a,y,1.4,1,hw,hd);
  boxL(VM.stone,b,-hw-.15,hw+.15,base-2.5,yW,-hd-.15,hd+.15);let top,rh,cy;
  if(v===0){// Bauernhaus aus Feldstein, Kniestock unter dem Dach
    top=yW+(b.st>1?4.3:3.2);boxL(VM.field,b,-hw,hw,yW,top,-hd,hd,2,2,'FBLR');rh=3+b.d*.16;gable(roof,VM.field,b,-hw,hw,top,-hd,hd,rh,.55);
    hDoor(b,yW,hw,hd,1.1,2.1);win('F',-hw*.58,yW+1.05);win('F',hw*.58,yW+1.05);win('B',0,yW+1.05);for(const f of['L','R'])decal(VM.win,b,f,0,yW+1.05,1.2,.9,hw,hd);
    if(b.st>1){decal(VM.win,b,'L',0,top+.8,1,.8,hw,hd);decal(VM.win,b,'R',0,top+.8,1,.8,hw,hd);}for(const a of[-hw*.58,hw*.58])hFlowerBox(b,'F',a,yW+1.05,1.4,hw,hd);
    hChimney(b,hw*.5,-hd*.3,top,top+rh+.7);cy=top+rh;}
  else if(v===1){// Haus mit Anbau (L-Form)
    top=yW+3*b.st;boxL(wall,b,-hw,hw,yW,top,-hd,hd,2,3,'FBLR');rh=2.6+b.d*.14;gable(roof,wall,b,-hw,hw,top,-hd,hd,rh,.45);
    hDoor(b,yW,hw,hd,1.1,2.1);for(let s=0;s<b.st;s++){const y=yW+1.1+s*3;win('F',-hw*.55,y);win('F',hw*.55,y);win('B',-hw*.5,y);hFlowerBox(b,'F',-hw*.55,y,1.4,hw,hd);if(s>0)win('F',0,y);}
    const ax0=hw,ax1=hw+3.2,az0=-hd+.4,az1=hd-1.4,at=yW+2.5,ab={x:b.x,z:b.z,cos:b.cos,sin:b.sin};
    boxL(VM.planks,ab,ax0,ax1,yW,at,az0,az1,2,2,'FBR');gableZ(VM.thatch,VM.planks,ab,ax0-.3,ax1,at,az0,az1,1.6,.35);decal(VM.win,ab,'R',(az0+az1)/2,yW+1.1,1.2,.9,ax1,0);
    {const sv=b.ct;b.ct=at+1.8;const[cx,cz]=toW(b,(ax0+ax1)/2,(az0+az1)/2);COLL.push({x:cx,z:cz,cos:b.cos,sin:b.sin,hw:(ax1-ax0)/2+.1,hd:(az1-az0)/2+.1,top:b.ct});b.ct=sv;}
    hChimney(b,-hw*.5,0,top,top+rh+.6);cy=top+rh;}
  else if(v===2){// Giebelhaus: der Giebel zeigt zur Straße
    top=yW+3*Math.max(2,b.st)-.6;boxL(VM.logs,b,-hw,hw,yW,top,-hd,hd,2,2,'FBLR');rh=2.2+b.w*.32;gableZ(roof,VM.planks,b,-hw,hw,top,-hd,hd,rh,.45);
    for(const sx of[-1,1])for(const sz of[-1,1])boxL(VM.logs,b,sx*hw-.18,sx*hw+.18,yW,top,sz*hd-.18,sz*hd+.18,1,2);
    hDoor(b,yW,hw,hd,1.1,2.2);win('F',-hw*.55,yW+1.1);win('F',hw*.55,yW+1.1);for(const a of[-hw*.5,hw*.5]){win('F',a,yW+3.6);hFlowerBox(b,'F',a,yW+3.6,1.4,hw,hd);}decal(VM.win,b,'F',0,top+.6,1,.8,hw,hd);
    for(const f of['L','R'])for(const a of[-hd*.45,hd*.45]){decal(VM.win,b,f,a,yW+1.1,1.3,1,hw,hd);decal(VM.win,b,f,a,yW+3.6,1.3,1,hw,hd);}
    hChimney(b,hw*.45,-hd*.4,top,top+rh*.75+.6);cy=top+rh;}
  else{// Kate mit tiefem Strohdach und Vordach
    top=yW+2.7;boxL(wall,b,-hw,hw,yW,top,-hd,hd,2,3,'FBLR');rh=3.2+b.d*.12;gable(VM.thatch,wall,b,-hw,hw,top,-hd,hd,rh,.85);
    hDoor(b,yW,hw,hd,1.1,2.05);win('F',-hw*.58,yW+1.05);win('F',hw*.58,yW+1.05);win('B',0,yW+1.05);for(const f of['L','R'])decal(VM.win,b,f,0,yW+1.05,1.3,1,hw,hd);
    for(const a of[-hw*.58,hw*.58])hFlowerBox(b,'F',a,yW+1.05,1.4,hw,hd);
    // Vordach auf zwei Pfosten
    for(const x of[-1.05,1.05])boxL(VM.planks,b,x-.09,x+.09,yW,yW+2.35,hd+1.35,hd+1.53,1,1);const P=(x,y,z)=>W3(b,x,y,z);
    quad(VM.planks,P(-1.4,yW+2.85,hd),P(1.4,yW+2.85,hd),P(1.4,yW+2.35,hd+1.75),P(-1.4,yW+2.35,hd+1.75),1.4,1);
    hChimney(b,-hw*.45,-hd*.35,top,top+rh+.5);cy=top+rh;}
  // Firstbalken
  if(v===2)boxL(VM.planks,b,-.1,.1,cy-.05,cy+.12,-hd-.5,hd+.5,1,1);else boxL(VM.planks,b,-hw-.5,hw+.5,cy-.05,cy+.12,-.1,.1,1,1);
  b.ct=cy+.2;addColl(b,-hw-.1,hw+.1,-hd-.1,hd+.1);return{yW,top};}
{const bh0=buildHouse;buildHouse=function(b,w,r){if(b.type==='house')return buildHouseV2(b,w,r);return bh0(b,w,r);};}
// ---------- Rathaus ----------
function buildTownhall(b){const hw=b.w/2,hd=b.d/2,base=footY(b,hw+.6,-hd-.6,hd+1.2),yW=base+.55,g1=yW+3.4,j=.3,top=g1+3.2,rh=4.4;
  boxL(VM.stone,b,-hw-.2,hw+.2,base-2.5,yW,-hd-.2,hd+.2);
  // Treppe
  for(let k=0;k<3;k++)boxL(VM.stone,b,-1.7,1.7,base-.5,yW-k*.18,hd+.2,hd+.55+k*.38,1,1);
  boxL(VM.stone,b,-hw,hw,yW,g1,-hd,hd,2,2,'FBLR');
  for(const a of[-hw*.62,0,hw*.62])decal(VM.arch,b,'F',a,yW,a===0?1.7:1.5,2.6,hw,hd);decal(VM.door,b,'F',0,yW,1.3,2.25,hw,hd+.01);
  for(const f of['L','R'])for(const a of[-hd*.4,hd*.4])decal(VM.win,b,f,a,yW+1.3,1.3,1,hw,hd);
  boxL(VM.stone,b,-hw-j,hw+j,g1-.14,g1+.14,-hd-j,hd+j,2,1);boxL(VM.fachW,b,-hw-j,hw+j,g1+.14,top,-hd-j,hd+j,2,3,'FBLR');
  for(const a of[-hw*.7,-hw*.25,hw*.25,hw*.7]){decal(VM.win,b,'F',a,g1+1.1,1.3,1.1,hw+j,hd+j);decal(VM.win,b,'B',a,g1+1.1,1.3,1.1,hw+j,hd+j);hFlowerBox(b,'F',a,g1+1.1,1.4,hw+j,hd+j);}
  for(const f of['L','R'])decal(VM.win,b,f,0,g1+1.1,1.3,1.1,hw+j,hd+j);
  gable(VM.shingle,VM.fachW,b,-hw-j,hw+j,top,-hd-j,hd+j,rh,.55);
  // Zwerchgiebel mit Uhr über dem Eingang
  {const z0=hd-1.6,z1=hd+j+.02,P=(x,y,z)=>W3(b,x,y,z);boxL(VM.fachW,b,-1.8,1.8,top-.2,top+1.4,z0,z1,2,2,'FLR');gableZ(VM.shingle,VM.fachW,b,-1.8,1.8,top+1.4,z0,z1,1.6,.3);
    quad(VM.clock,P(-.7,top+.15,z1+.03),P(.7,top+.15,z1+.03),P(.7,top+1.55,z1+.03),P(-.7,top+1.55,z1+.03),1,1);}
  // Dachreiter mit Glocke
  {const cy=top+rh,t0=cy-.6;boxL(VM.planks,b,-.75,.75,t0,cy+1.6,-.75,.75,1,1,'FBLR');pyramid(VM.slate,b,0,0,1.0,cy+1.6,1.9);boxL(VM.iron,b,-.25,.25,cy+.4,cy+1.0,-.25,.25,1,1);
    boxL(VM.iron,b,-.05,.05,cy+3.5,cy+4.3,-.05,.05,1,1);}
  boxL(VM.planks,b,-hw-.6,hw+.6,top+rh-.05,top+rh+.14,-.1,.1,1,1);
  // Schild über der Tür
  {const P=(x,y,z)=>W3(b,x,y,z),z=hd+.05;quad(VM.hallSign,P(-1.3,yW+2.75,z),P(1.3,yW+2.75,z),P(1.3,yW+3.25,z),P(-1.3,yW+3.25,z),1,1);}
  hChimney(b,-hw*.6,-hd*.4,top,top+rh+.4);
  b.ct=top+rh+.3;addColl(b,-hw-.1,hw+.1,-hd-.1,hd+.1);}
// ---------- Marktstände ----------
const MARKET=[{x:-10.5,z:713,rot:Math.PI/2,ci:0},{x:-10.5,z:727,rot:Math.PI/2,ci:1},{x:10.5,z:713,rot:-Math.PI/2,ci:2},{x:10.5,z:727,rot:-Math.PI/2,ci:3},{x:-6,z:709.5,rot:0,ci:4},{x:7,z:710,rot:0,ci:5}];
function buildStall(S){const b={x:S.x,z:S.z,cos:Math.cos(S.rot),sin:Math.sin(S.rot)},g=getHeight(S.x,S.z)-.05,P=(x,y,z)=>W3(b,x,y,z);
  boxL(VM.planks,b,-1.4,1.4,g,g+.95,-.35,.35,1,1);boxL(VM.planks,b,-1.5,1.5,g+.95,g+1.03,-.45,.45,1,1);
  for(const[x,z,h]of[[-1.45,-1.1,2.6],[1.45,-1.1,2.6],[-1.45,.45,2.15],[1.45,.45,2.15]])boxL(VM.planks,b,x-.08,x+.08,g,g+h,z-.08,z+.08,1,1);
  quad(VM.cloth[S.ci%VM.cloth.length],P(-1.65,g+2.65,-1.3),P(1.65,g+2.65,-1.3),P(1.65,g+2.12,.75),P(-1.65,g+2.12,.75),1,1);
  const[cx,cz]=toW(b,0,0);COLL.push({x:cx,z:cz,cos:b.cos,sin:b.sin,hw:1.5,hd:.42,top:g+1.05});
  S.trader=toW(b,0,-.95);S.counterY=g+1.03;S.b=b;}
const STALL_GOODS=[['hpot','hpot2','pstam'],['bread','mead','berries'],['w_oak','w_pine','rope'],['meat','roastmeat','fur'],['stone','coal','iron_ore'],['wool','rope','bedroll']];
function buildPlaza(){for(const S of MARKET)buildStall(S);
  // ein paar Waren auf den Tresen, Fässer und Kisten am Rand
  const deco=[];MARKET.forEach((S,i)=>{const G=STALL_GOODS[i];G.forEach((id,k)=>{const s=SPR[id];if(!s)return;const[x,z]=toW(S.b,-.8+k*.8,.05),w=.36;deco.push({x,z,y:S.counterY,w,h:w*s.h/s.w,spr:id,tint:1});});});
  for(const[x,z]of[[-13,708],[13,708],[-13,735],[13,735],[2.6,738.5],[-2.6,738.5]])deco.push({x,z,y:getHeight(x,z)-.05,w:1.2,h:1.2*15/22,spr:'hay',tint:1});
  // Trödelladen: Schild und Kram vor der Tür
  const T=VB.find(b=>b.type==='house'&&b.home===8);if(T){const hw=T.w/2,hd=T.d/2,yW=footY(T,hw+.6,-hd-.6,hd+.6)+.4,P=(x,y,z)=>W3(T,x,y,z);quad(VM.junkSign,P(-1.4,yW+2.45,hd+.08),P(1.4,yW+2.45,hd+.08),P(1.4,yW+2.95,hd+.08),P(-1.4,yW+2.95,hd+.08),1,1);
    for(const[lx,lz,spr,w]of[[-2,hd+1,'potb',.6],[2.1,hd+1.1,'potb',.55],[-2.6,hd+1.6,'chest',.9],[2.6,hd+1.5,'bones',.7],[1.6,hd+1.8,'anvil',.8]]){const[x,z]=toW(T,lx,lz),s=SPR[spr];if(s)deco.push({x,z,y:getHeight(x,z)-.03,w,h:w*s.h/s.w,spr,tint:1});}T.junk=1;}
  // Sträucher an den Hauswänden
  const rb=mulberry32(1990);for(const b of VB){if(b.type!=='house'&&b.type!=='townhall'&&b.type!=='tavern')continue;const hw=b.w/2,hd=b.d/2;for(const sd of[-1,1]){if(rb()<.35)continue;const[x,z]=toW(b,sd*(hw+.9),hd*(rb()*1.4-.7)),w=1+rb()*.6;
    deco.push({x,z,y:getHeight(x,z)-.12,w,h:w*24/34,spr:rb()<.4?'bush1':'bush0',sway:.04,tint:.95+rb()*.1});}}
  scene.add(makeBillboards(deco,decorMat));}
{const bv0=buildVillage;buildVillage=function(){bv0();try{const th=VB.find(b=>b.type==='townhall');if(th)buildTownhall(th);buildPlaza();flushGB();}catch(e){console.error('Coda',e);}};}
// Kein Bewuchs auf Marktplatz und Straßen (die Maske stimmt schon), Bänke fürs Dorf: Areal-Name
Object.assign(AREAS,{in_hall:'Das Rathaus von Coda'});Object.assign(AREA_MUSIC,{in_hall:'orte/coda'});

// Bäume im Dorf: zwischen den Häusern, an den Rändern des Marktplatzes
{const r=mulberry32(1991);let n=0;for(let k=0;k<3000&&n<18;k++){const a=r()*6.283,d=8+r()*58,x=CODA.x+Math.cos(a)*d,z=CODA.z+Math.sin(a)*d*.85;let ok=true;
  for(let dx=-2.5;dx<=2.5&&ok;dx+=1.25)for(let dz=-2.5;dz<=2.5&&ok;dz+=1.25)if(maskAt(x+dx,z+dz)&31)ok=false;if(!ok||nearTree(x,z,6))continue;if(Math.hypot(x-CODA.x,z-CODA.z)<10)continue;
  addTree(r()<.55?'oak':r()<.6?'birch':'pine',x,z);n++;}}
