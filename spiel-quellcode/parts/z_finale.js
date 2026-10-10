/* =========================================================
   FINALE · Die Schlacht um Coda (neu)
   - Gekämpft wird vor allem rund um den Marktplatz. Wachen, Froschleute und
     Drachenmenschen kämpfen gemischt und bleiben beim Dorf.
   - Abenteurer der Gilde, die noch nicht angeheuert sind, kommen zu Hilfe.
   - Shikaya hält sich heraus: Sie wartet vor der Stadt.
   - Sind alle Dämonen besiegt: Film „Kreak gegen Shikaya" (ohne Text, gut 1:50 lang),
     danach kämpfen alle zusammen gegen sie: Spieler, Kreak, Gilde, Dofra, Corvin, Wachen.
   - Shikaya wird nicht getötet, sondern gefangen genommen.
   - Nach dem Abspann: der Käfigwagen zieht langsam nach Sturmburg.
   ========================================================= */
const MKT_C={x:0,z:719};          // Marktplatz
const SHK_W={x:0,z:590};          // hier wartet Shikaya, vor dem Nordrand von Coda
const POR={x:0,z:621};            // hier reißt das Portal auf
const AKUMA_V=drawAkumaIcon;      // senkrechtes Schwert für Kreaks Hand (Inventarbild wird später schräg)
MUSIC_SLOTS['bosskampf/kein_erbarmen']='Kein Erbarmen (Kreak gegen Shikaya)';
const fgy=(x,z)=>groundAt(x,z,1e4);

/* ---------- Bilder ---------- */
// Shikaya mit dem riesigen Schwert, das aus ihrem Arm wächst (200 breit, gleiche Höhe wie sonst)
function shkSwordCv(f){const bf={S0:0,S1:1,S2:2,Sa:'a',Sb:'r',Sc:'c',Sf:'f',Sk:'k'}[f],base=drawShikaya(bf),W=200,H=118,o=document.createElement('canvas');o.width=W;o.height=H;
  const x=o.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(base,52,0);if(f==='Sk')return o;
  const p=new Px(W,H),K=SHKP,B=pal(['#07020a','#140610','#260a16','#3a1020','#54182a','#74243a']),V=pal(['#5a0610','#b01424','#ff4a3a','#ffd0b0']);
  const blade=(ax,ay,bx,by,w0)=>{const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux,pts=[],N=16;
    for(let i=0;i<=N;i++){const k=i/N,w=w0*(1-k*.78)*(k<.1?.55+k*4.5:1),ser=(i%2&&k>.12&&k<.92)?2.4:0;pts.push([ax+ux*L*k+nx*(w+ser),ay+uy*L*k+ny*(w+ser)]);}
    pts.push([bx+ux*4,by+uy*4]);for(let i=N;i>=0;i--){const k=i/N,w=w0*.62*(1-k*.86);pts.push([ax+ux*L*k-nx*w,ay+uy*L*k-ny*w]);}
    fPoly(p,pts,B,{b:.05,f:(px,py,Lv)=>{const along=((px-ax)*ux+(py-ay)*uy)/L,d=(px-ax)*nx+(py-ay)*ny;
      if(Math.abs(d-w0*.12)<.75&&along>.06&&along<.93)return V[2+(hash2(px>>1,py>>1,9)<.35?1:0)];
      if(Math.abs(d-w0*.12)<1.6&&along>.06&&along<.93&&hash2(px,py,12)<.5)return V[1];
      return B[shadeIdx(Lv+d/(w0*2)*.5-along*.15,B.length,px,py)];}});
    // Sehnen und Stacheln, wo das Schwert aus dem Arm wächst
    for(let k=0;k<4;k++){const t=.05+k*.05,sx=ax+ux*L*t,sy=ay+uy*L*t,s2=(k&1?1:-1);fLine(p,sx,sy,sx-ux*6+nx*s2*4,sy-uy*6+ny*s2*4,K.red[2+(k&1)]);}};
  if(f==='S0'||f==='S1'||f==='S2'||f==='Sf'){const sw=f==='S1'?-1:f==='S2'?1:0;blade(112,54-sw,158,115,8);}
  else if(f==='Sa')blade(127,36,196,3,8);
  else if(f==='Sb')blade(73,46,6,92,8);
  else if(f==='Sc')blade(110,20,190,4,7.5);
  outline(p);x.drawImage(p.done(),0,0);return o;}
// Kreak für die Filme: ohne / mit dem Akuma Senso, mit weißen Augen
const KF_EYE={y:0,dx:[]};
// Augen weiß machen: weiße Augäpfel suchen, dann in dieser Zeile Pupillen und Augäpfel weiß färben
function eyeWhiten(A,W,hb,H){let ey=-1,x0=1e9,x1=-1;const lim=Math.min(H-1,hb[3]);
  for(let yy=hb[2];yy<=lim&&ey<0;yy++)for(let xx=hb[0];xx<=hb[1];xx++){const j=(yy*W+xx)*4;if(A[j+3]&&A[j]>225&&A[j+1]>220&&A[j+2]>205){ey=yy;}}
  if(ey<0)return null;for(let xx=hb[0];xx<=hb[1];xx++){const j=(ey*W+xx)*4;if(!A[j+3])continue;const r=A[j],g=A[j+1],b=A[j+2];if((r>225&&g>220&&b>205)||(r<45&&g<35&&b<30)){x0=Math.min(x0,xx);x1=Math.max(x1,xx);}}
  const pts=[];for(let xx=x0;xx<=x1;xx++){const j=(ey*W+xx)*4;const r=A[j],g=A[j+1],b=A[j+2];if((r>225&&g>220&&b>205)||(r<45&&g<35&&b<30)){A[j]=255;A[j+1]=255;A[j+2]=255;pts.push([xx,ey]);}}return pts;}
function kfWhite(c){const hb=c.headBox;if(!hb)return c;const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height);c.eyePts=eyeWhiten(d.data,c.width,hb,c.height)||[];x.putImageData(d,0,0);return c;}
function kfSprites(){const L=KREAK_LOOK2,W={cv:AKUMA_V(),diag:false},out=[];const keep=(c,s)=>{for(const k of['headBox','waist','legTop','handL','handR'])if(s[k]!=null)c[k]=s[k];return c;};
  const H=(f,pose)=>drawHero(L,f,false,pose,'R');
  const fr={'0':H(0),'1':H(1),'2':H(2),'h':H(0,'up'),'k':keep(squashCv(H(0),1.12,.62),{}),'j':keep(squashCv(H(1),1.04,.86),{}),
    's0':kreakHold(H(0),W,.25),'s1':kreakHold(H(1),W,.25),'s2':kreakHold(H(2),W,.25),'sa':kreakHold(H(0,'up'),W,-.65),'sb':kreakHold(H(0,'strike'),W,.9),'sh':kreakHold(H(0,'up'),W,-.05)};
  fr.sk=keep(squashCv(fr.s0,1.12,.62),{});fr.sj=keep(squashCv(fr.s1,1.04,.86),{});
  // weiße Augen für alle Frames mit Schwert
  for(const k of['s0','s1','s2','sa','sb','sh'])kfWhite(fr[k]);
  const e0=fr.s0.eyePts||[];if(e0.length){const ys=e0.map(p=>p[1]),xs=e0.map(p=>p[0]);KF_EYE.y=Math.round(ys.reduce((a,b)=>a+b,0)/ys.length);const mid=(Math.min(...xs)+Math.max(...xs))/2;
    const L1=xs.filter(v=>v<mid),R1=xs.filter(v=>v>=mid),av=a=>a.reduce((s,v)=>s+v,0)/(a.length||1);KF_EYE.dx=[av(L1)-fr.s0.width/2,av(R1)-fr.s0.width/2];}
  for(const k in fr)out.push(['kf_'+k,fr[k]]);return out;}
// Käfigwagen mit vier Pferden, Shikaya kniet in Ketten darin
function drawPrisonCart(f){const W=270,H=86,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);},wood=['#2a1608','#4a2a12','#6a4220','#8a5a2e'],iron=['#16181c','#2e3238','#4a5058','#6e7680'];
  const dark=(cv2,a)=>{const o=document.createElement('canvas');o.width=cv2.width;o.height=cv2.height;const x=o.getContext('2d');x.drawImage(cv2,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=`rgba(10,6,4,${a})`;x.fillRect(0,0,o.width,o.height);return o;};
  // Pferde: hinteres Paar, vorderes Paar (jeweils ein Pferd etwas weiter hinten und dunkler)
  const horse=(v,ff)=>drawFarm('horse',ff,v,22,false);
  const put=(hc,x,y,a)=>{const s=Math.min(58/hc.width,46/hc.height),w=hc.width*s,h=hc.height*s;c.drawImage(a?dark(hc,a):hc,Math.round(x),Math.round(y-h),Math.round(w),Math.round(h));return w;};
  const ff=f%3,f2=(f+1)%3;put(horse(2,f2),156,H-8,.35);put(horse(2,f2),216,H-8,.35);
  // Deichsel und Geschirr
  R(118,58,140,2,wood[0]);R(150,47,110,1,'#3a2410');
  // Wagen
  R(4,56,122,7,wood[1]);R(4,56,122,2,wood[2]);for(let x=8;x<124;x+=10)R(x,58,1,5,wood[0]);
  // Käfig
  R(8,10,112,3,iron[1]);R(8,9,112,1,iron[3]);R(8,52,112,4,iron[1]);
  // Shikaya im Käfig
  const sk=SPR.shk_k&&SPR.shk_k.c?SPR.shk_k.c:drawShikaya('k'),ss=44/sk.height;c.drawImage(sk,Math.round(64-sk.width*ss/2),Math.round(55-sk.height*ss),Math.round(sk.width*ss),Math.round(sk.height*ss));
  // Ketten
  for(const[ax,ay,bx,by]of[[54,40,10,30],[74,40,118,30],[60,50,64,55]]){const n=14;for(let i=0;i<=n;i++){const k=i/n,x=ax+(bx-ax)*k,y=ay+(by-ay)*k+Math.sin(k*Math.PI)*4;R(Math.round(x),Math.round(y),i%2?2:1,1,i%2?iron[3]:iron[2]);}}
  for(let x=10;x<120;x+=7){R(x,12,2,40,iron[1]);R(x,12,1,40,iron[2]);R(x,30,2,2,iron[3]);}
  R(6,8,2,48,iron[0]);R(120,8,2,48,iron[0]);R(60,4,8,6,iron[1]);R(62,2,4,3,iron[2]);
  // Laterne
  R(122,20,1,10,iron[1]);R(120,28,5,5,'#ffcf60');R(121,29,3,3,'#fff4c0');
  // Kutschbock mit Wache
  R(118,40,14,3,wood[0]);R(124,43,2,14,wood[1]);
  const g=drawHero(GUARD_LOOKS[0],0);if(g){const gs=30/g.height;c.drawImage(g,Math.round(124-g.width*gs/2),Math.round(44-g.height*gs*.82),Math.round(g.width*gs),Math.round(g.height*gs*.82));}
  // Räder
  const wheel=(cx,cy,r)=>{c.strokeStyle=wood[0];c.lineWidth=3;c.beginPath();c.arc(cx,cy,r,0,6.283);c.stroke();c.strokeStyle=wood[2];c.lineWidth=1;c.beginPath();c.arc(cx,cy,r-1,0,6.283);c.stroke();
    for(let k=0;k<8;k++){const a=k/8*Math.PI+(f%3)*.26;c.strokeStyle=wood[1];c.beginPath();c.moveTo(cx-Math.cos(a)*r,cy-Math.sin(a)*r);c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.stroke();}R(cx-2,cy-2,4,4,iron[3]);};
  wheel(28,H-15,14);wheel(100,H-15,14);
  // vorderes Paar
  put(horse(1,ff),146,H-3,0);put(horse(0,ff),206,H-3,0);
  return cv;}
function finaleSprites2(list){try{for(const f of['S0','S1','S2','Sa','Sb','Sc','Sf','Sk'])list.push(['shk_'+f,shkSwordCv(f)]);}catch(e){console.error('Shikaya-Schwert',e);}
  try{for(const s of kfSprites())list.push(s);}catch(e){console.error('Kreak-Film',e);}
  list.push(['geye_w',drawGEye('#e8f4ff')]);
  try{for(let f=0;f<3;f++)list.push(['pwag_'+f,drawPrisonCart(f)]);}catch(e){console.error('Käfigwagen',e);}}
{const a=finaleSprites;finaleSprites=function(list){a(list);finaleSprites2(list);};}
Object.assign(DT,{
  kreakF:{name:'Kreak',fac:'prop',h:1.86,hp:9999,dmg:0,spd:6,reach:2,cd:1,hero:1,spr:'kf_'},
  shkDuel:Object.assign({},DT.shikaya,{needAkuma:0,hp:22000,spr:'shk_S',reach:4.6,dmg:28,cd:1.35,wind:.5,rad:1,aggro:90,leash:999}),
  helperA:{name:'Helfer',fac:'ally',h:1.78,hp:700,dmg:24,spd:4.4,reach:2,cd:1,hero:1,spr:e=>e.sp||'g0_',aggro:60,rad:.35},
  portalFx:{name:'Portal',fac:'prop',h:3.4,hp:1,dmg:0,spd:0,reach:0,cd:9,sprF:()=>'portal',tint:1.6,glow:1},
  prisonCart:{name:'Gefangenenwagen',fac:'prop',h:3.3,hp:1,dmg:0,spd:0,reach:0,cd:9,spr:'pwag_',side:1}});
DT.kreakFW=Object.assign({},DT.kreakF,{eyes:{get y(){return KF_EYE.y;},get dx(){return KF_EYE.dx;},c:'w'}});
// Requisiten tun nichts von selbst
{const a=pickTarget;pickTarget=function(e){if(e.fac==='prop')return null;return a(e);};}
{const a=separate;separate=function(){const hid=[];for(const e of DEM)if(e.fac==='prop'&&!e.dormant){e.dormant=true;hid.push(e);}try{a();}finally{for(const e of hid)e.dormant=false;}};}

/* ---------- Gemalte Nahaufnahmen ---------- */
const CU={ksk:pl3(['#4a2008','#6e3410','#9a4c1a','#c26a26','#e08a44','#f6b47a']),khr:pl3(['#0c2408','#183e10','#265e18','#3a8222','#56a634','#86cc58']),
  kve:pl3(['#260404','#460a0a','#6a1212','#921e1e','#b83030','#d84a40']),ksh:pl3(['#100c08','#201812','#30261c']),gold:pl3(['#6a4a08','#b88a18','#e8b828','#ffe070']),
  ssk:pl3(['#241a26','#3e3042','#5a4a62','#7c6a86','#a08eaa','#c4b4cc']),shr:pl3(['#030205','#0a0710','#140e1c','#201828','#2e2438']),
  sho:pl3(['#050306','#140e18','#281e2e','#42364a','#665a70']),gld:pl3(['#5a3a08','#9a6a14','#d4a02a','#f4d060','#fff4b0']),red:pl3(['#2a0306','#5a0a10','#a01420','#e0302c','#ff7a50','#ffd0b0']),
  lip:pl3(['#1a0408','#3a0a14','#5e1424','#7e2234']),wing:pl3(['#140206','#2a060c','#440c14','#62141e']),wh:[255,255,255],dk:[12,8,8]};
const mixc=(a,b,k)=>[a[0]+(b[0]-a[0])*k|0,a[1]+(b[1]-a[1])*k|0,a[2]+(b[2]-a[2])*k|0];
function cuSky(lp,t,o){o=o||{};const top=o.top||[8,2,6],mid=o.mid||[70,10,14],bot=o.bot||[150,40,24];
  for(let y=0;y<lp.h;y++){const k=y/lp.h,c=k<.6?mixc(top,mid,k/.6):mixc(mid,bot,(k-.6)/.4);for(let x=0;x<lp.w;x++){const n=BAY[(y&3)*4+(x&3)]/16;lp.set(x,y,[c[0]+n*6|0,c[1]+n*3|0,c[2]+n*4|0]);}}
  if(o.moon){const[mx,my,mr]=o.moon;lp.ell(mx,my,mr,mr,(nx,ny,x,y)=>shd(CU.red,.62-nx*.25-ny*.15+(hash2(x>>1,y>>1,4)-.5)*.2,x,y));
    for(let y=0;y<lp.h;y++)for(let x=0;x<lp.w;x++){const d=Math.hypot(x-mx,y-my);if(d>mr&&d<mr*2.6)lp.mix(x,y,[255,60,40],.22*(1-(d-mr)/(mr*1.6)));}}
  // Rauchschwaden
  for(let k=0;k<5;k++){const yy=20+k*16+Math.sin(t*.3+k)*3;for(let x=0;x<lp.w;x++){const w=4+Math.sin(x*.05+k*2+t*.6)*3;for(let y=yy-w;y<yy+w;y++)lp.mix(x,y,[20,6,8],.22);}}}
function cuEmbers(lp,F,dt,n,col){F.cuE=F.cuE||[];const E=F.cuE;for(let i=0;i<n;i++)if(Math.random()<dt*20)E.push({x:Math.random()*lp.w,y:lp.h+2,vx:(Math.random()-.5)*8,vy:-10-Math.random()*22,l:2+Math.random()*2,t:0});
  for(let i=E.length-1;i>=0;i--){const e=E[i];e.t+=dt;e.x+=e.vx*dt+Math.sin(e.t*3+i)*.2;e.y+=e.vy*dt;if(e.t>e.l||e.y<-2){E.splice(i,1);continue;}const a=1-e.t/e.l;lp.add(e.x,e.y,col||[255,140,60],a);if(a>.5)lp.add(e.x+1,e.y,col||[255,140,60],a*.4);}}
function cuSpeed(lp,cx,cy,a,col){for(let k=0;k<26;k++){const ang=hash2(k,7,3)*6.283+FILM.t*.0,r0=40+hash2(k,9,1)*30,r1=r0+60;lp.line(cx+Math.cos(ang)*r0,cy+Math.sin(ang)*r0,cx+Math.cos(ang)*r1,cy+Math.sin(ang)*r1,col||[255,255,255],a*(.4+hash2(k,3,3)*.6));}}
// Kreak: o={cx,cy,s,t,white:0..1,mouth:0..1,anger:0..1,wind:0..1}
function paintKreak(lp,o){const s=o.s||1,cx=o.cx,cy=o.cy,t=o.t||0,P=(dx,dy)=>[cx+dx*s,cy+dy*s],K=CU;
  // Weste und Hemd
  lp.poly([P(-78,60),P(-44,36),P(-14,29),P(0,44),P(14,29),P(44,36),P(78,60),P(78,90),P(-78,90)],(u,v,x,y)=>{const dx=(x-cx)/s,dy=(y-cy)/s;
    if(Math.abs(dx)<(dy-29)*.48)return shd(K.ksh,.6-Math.abs(dx)/30,x,y);const edge=Math.abs(Math.abs(dx)-(dy-29)*.48)<1.6;return shd(K.kve,(edge?.85:.55)-dx/160+((x+y*3)%11===0?-.2:0)-(dy-30)*.004,x,y);});
  // Hals
  lp.poly([P(-11,18),P(11,18),P(12,40),P(-12,40)],(u,v,x,y)=>shd(K.ksk,.38-(x-cx)/(24*s)*.3-(y<cy+26*s?.18:0),x,y));
  // Haarspitzen hinten
  const spikes=(front)=>{const N=front?6:14;for(let i=0;i<N;i++){let bx,by,tx,ty,hw;
      if(!front){const a=Math.PI+.25+(i/(N-1))*(Math.PI-.5);bx=Math.cos(a)*24;by=Math.sin(a)*28-2;let dx=Math.cos(a)*1.3,dy=Math.sin(a)-(o.wind||0)*.8;const l=Math.hypot(dx,dy);dx/=l;dy/=l;
        const sway=Math.sin(t*3+i*1.7)*.12;const len=15+((i*7)%5)*3.2;tx=bx+(dx+sway)*len;ty=by+(dy)*len;hw=6.5;}
      else{bx=-17+i*6.8;by=-19;tx=bx+(i-2.5)*2.4+Math.sin(t*2.5+i)*1.2;ty=-6+((i*5)%3)*2-(o.wind||0)*6;hw=4.2;}
      const ang=Math.atan2(ty-by,tx-bx),nx=-Math.sin(ang)*hw,ny=Math.cos(ang)*hw;
      lp.poly([P(bx+nx,by+ny),P(tx,ty),P(bx-nx,by-ny)],(u,v,x,y)=>{const k=Math.hypot((x-cx)/s-bx,(y-cy)/s-by)/Math.hypot(tx-bx,ty-by);return shd(K.khr,(front?.62:.5)-k*.35+((x-cx)/s<bx?.12:-.08),x,y);});}};
  spikes(false);
  // Ohren
  for(const sd of[-1,1])lp.ell(cx+sd*24*s,cy+2*s,4.5*s,8*s,(nx,ny,x,y)=>shd(K.ksk,.45-nx*sd*.1-Math.abs(ny)*.2+(Math.abs(nx)<.35&&Math.abs(ny)<.5?-.2:0),x,y));
  // Kopf
  lp.ell(cx,cy,25*s,30*s,(nx,ny,x,y)=>{const w=1-(ny>.18?(ny-.18)*.62:0);if(Math.abs(nx)>w)return null;const nnx=nx/w;
    let L=.6-nnx*.3-ny*.08;if(ny>.55)L-=.2*(ny-.55)/.45;L+=.14*Math.exp(-((nnx+.42)**2+(ny-.12)**2)*14);if(Math.abs(nnx)>.82)L-=.15;
    const c=shd(K.ksk,L,x,y);if(nnx>.7&&o.rim)return mixc(c,o.rim,.45);return c;});
  // Haar oben auf dem Kopf
  lp.ell(cx,cy-13*s,25.5*s,19*s,(nx,ny,x,y)=>{const hl=cy-13*s+(-.1+Math.sin((x-cx)/s*.45+t*2)*.12)*19*s;if(y>hl+6*s)return null;return shd(K.khr,.58-nx*.22-ny*.18+(((x+y)>>1)%3===0?.1:0),x,y);});
  // Narbe
  lp.line(cx-19*s,cy+4*s,cx-14*s,cy+12*s,K.ksk[5],.7);
  // Augen
  const W=o.white||0;
  for(const sd of[-1,1]){const ex=cx+sd*11*s,ey=cy-1*s;
    lp.ell(ex,ey+.2*s,7.4*s,3.9*s,(nx,ny,x,y)=>ny<.1?K.ksk[0]:null);
    lp.ell(ex,ey+.6*s,6.6*s,2.9*s,(nx,ny,x,y)=>{const sc=mixc([236,228,214],K.wh,W);
      const ir=Math.hypot(nx*6.6/2.7,ny*2.9/3);if(ir<1){const pu=ir<.48;const c=pu?mixc([16,10,8],K.wh,W):shd(K.gold,.75-ny*.4,x,y);return W>0?mixc(c,K.wh,Math.min(1,W*1.3)):c;}
      return ny<-.45?mixc(sc,[150,120,100],.4*(1-W)):sc;});
    if(W<.5)lp.set(ex-1*s,ey-.5*s,K.wh);
    // Brauen
    const an=o.anger==null?.7:o.anger;lp.poly([P(sd*4,-8+an*1.5),P(sd*18,-12-an*.8),P(sd*19,-9.5-an*.8),P(sd*5,-5+an*1.5)].map(([a,b])=>[a,b]),(u,v,x,y)=>shd(K.khr,.25,x,y));}
  // Nase
  lp.line(cx+2*s,cy+1*s,cx+3*s,cy+10*s,K.ksk[1],.6);lp.ell(cx+1*s,cy+11*s,4*s,2.4*s,(nx,ny,x,y)=>shd(K.ksk,.66-nx*.3-ny*.2,x,y));lp.set(cx-1.5*s,cy+12*s,K.ksk[0]);lp.set(cx+3*s,cy+12*s,K.ksk[0]);
  // Mund
  const m=o.mouth||0;
  if(m>.05){lp.ell(cx,cy+19*s,8.5*s,(2+6*m)*s,(nx,ny,x,y)=>{if(ny<-.55)return[236,232,220];if(ny>.45)return shd(CU.red,.45,x,y);return[30,6,8];});}
  else{for(let dx=-8;dx<=8;dx++){const yy=cy+18*s+(Math.abs(dx)>6?1*s:0);lp.set(cx+dx*s,yy,K.ksk[0]);lp.set(cx+dx*s,yy+s,K.ksk[1]);}lp.line(cx-6*s,cy+20.5*s,cx+6*s,cy+20.5*s,K.ksk[4],.5);}
  // Haare vorn
  spikes(true);}
// Shikaya: o={cx,cy,s,t,mood:'smirk'|'laugh'|'angry',glow,wind}
function paintShk(lp,o){const s=o.s||1,cx=o.cx,cy=o.cy,t=o.t||0,P=(dx,dy)=>[cx+dx*s,cy+dy*s],K=CU,ang=o.mood==='angry',wv=(o.wind||.3);
  // Flügel
  for(const sd of[-1,1])lp.poly([P(sd*30,40),P(sd*70,-6+Math.sin(t*1.4)*3),P(sd*96,-22+Math.sin(t*1.4)*4),P(sd*90,20),P(sd*100,52),P(sd*60,64)],(u,v,x,y)=>{const dx=Math.abs((x-cx)/s);
    const rib=Math.abs(((dx-30)*.9+((y-cy)/s)*.55)%14)<1.1;return rib?shd(K.sho,.55,x,y):shd(K.wing,.55-v*.3+(hash2(x>>1,y>>1,6)-.5)*.15,x,y);});
  // Haar hinten
  lp.poly([P(-30,-32),P(30,-32),P(42+Math.sin(t*1.7)*3*wv,14),P(50+Math.sin(t*1.3+1)*6*wv,64),P(-50+Math.sin(t*1.5+2)*6*wv,64),P(-42+Math.sin(t*1.9)*3*wv,14)],(u,v,x,y)=>{const st=((x-cx)/s*.5+Math.sin((y-cy)/s*.12+t)*2)%5;return shd(K.shr,.45+(Math.abs(st)<.8?.3:0)-v*.2,x,y);});
  // Hals und Kragen
  lp.poly([P(-8,16),P(8,16),P(9,44),P(-9,44)],(u,v,x,y)=>shd(K.ssk,.35-(x-cx)/(18*s)*.3,x,y));
  lp.poly([P(-58,64),P(-40,36),P(-30,8),P(-20,30),P(0,46),P(20,30),P(30,8),P(40,36),P(58,64)],(u,v,x,y)=>{const dx=(x-cx)/s,dy=(y-cy)/s;const edge=dy<36&&Math.abs(Math.abs(dx)-20-(30-dy)*.45)<1.2;
    return edge?shd(K.red,.6,x,y):shd(pl3(['#040204','#0e080c','#1a0e14','#2a161e']),.5-Math.abs(dx)/90+(Math.abs(dx)<3&&dy>38?.3:0),x,y);});
  // Kopf
  lp.ell(cx,cy,22*s,29*s,(nx,ny,x,y)=>{const w=1-(ny>.12?(ny-.12)*.8:0);if(Math.abs(nx)>w)return null;const nnx=nx/w;let L=.62-nnx*.25-ny*.1;if(ny>.6)L-=.18;L+=.1*Math.exp(-((nnx+.4)**2+(ny-.1)**2)*16);
    return shd(K.ssk,L,x,y);});
  // Adern unter den Augen
  for(const sd of[-1,1]){lp.line(cx+sd*9*s,cy+4*s,cx+sd*12*s,cy+13*s,[60,20,60],.6);lp.line(cx+sd*12*s,cy+13*s,cx+sd*10*s,cy+18*s,[60,20,60],.4);}
  // Hörner
  for(const sd of[-1,1]){const pts=[P(sd*12,-24),P(sd*22,-38),P(sd*36,-46),P(sd*50,-44),P(sd*58,-36)];lp.tube(pts,5*s,1*s,(nx,ny,x,y,k)=>shd(K.sho,.62-nx*sd*.2-ny*.3+(((k*40)|0)%3===0?-.18:0),x,y));}
  // Krone
  for(let dx=-14;dx<=14;dx++){const y0=cy-22*s+Math.abs(dx)*.12*s;lp.set(cx+dx*s,y0,K.gld[3]);lp.set(cx+dx*s,y0+s,K.gld[1]);if(dx%5===0){lp.set(cx+dx*s,y0-s,K.gld[2]);lp.set(cx+dx*s,y0-2*s,K.gld[4]);}}
  lp.ell(cx,cy-23*s,2.6*s,2.6*s,(nx,ny,x,y)=>shd(K.red,.8-ny*.4,x,y));
  // Augen
  const G=o.glow==null?1:o.glow;
  for(const sd of[-1,1]){const ex=cx+sd*10*s,ey=cy-1*s;
    // Lidstrich mit Schwung
    lp.poly([P(sd*3,-1),P(sd*10,-4.5-(ang?0:.5)),P(sd*19,-6.5),P(sd*16,-2),P(sd*10,1.6)],()=>[8,4,8]);
    lp.ell(ex,ey,6.4*s,2.4*s,(nx,ny,x,y)=>{const ir=Math.hypot(nx*6.4/3,ny);if(ir<1){if(Math.abs(nx*6.4)<.7*s/s&&Math.abs(ny)<.85)return[10,0,0];return shd(K.red,.55+G*.35-ir*.3,x,y);}return[26,8,12];});
    // Brauen
    lp.line(ex-sd*5*s,ey-(ang?5:7)*s,ex+sd*6*s,ey-(ang?8:9)*s,[20,12,24]);}
  // Nase
  lp.line(cx+1*s,cy+3*s,cx+1.5*s,cy+10*s,K.ssk[1],.45);lp.set(cx-1*s,cy+11*s,K.ssk[1]);lp.set(cx+2*s,cy+11*s,K.ssk[1]);
  // Lippen
  if(o.mood==='laugh'||ang){lp.ell(cx+1*s,cy+17*s,8*s,(ang?3.5:5)*s,(nx,ny,x,y)=>ny<-.4||(ang&&ny>.5)?[230,220,226]:ny<-.2?shd(K.lip,.7,x,y):[24,4,8]);lp.set(cx-4*s,cy+19*s,[236,230,236]);lp.set(cx+5*s,cy+19*s,[236,230,236]);}
  else{for(let dx=-7;dx<=7;dx++){const yy=cy+(16-dx*.18-(dx>3?(dx-3)*.4:0))*s;lp.set(cx+dx*s,yy,K.lip[0]);lp.set(cx+dx*s,yy+s,K.lip[2]);lp.set(cx+dx*s,yy+2*s,K.lip[3]);}lp.set(cx+5*s,cy+17*s,[236,230,236]);}
  // Haar vorn: zwei Vorhänge
  for(const sd of[-1,1]){const sw=Math.sin(t*1.8+sd)*2*wv;lp.poly([P(sd*1,-30),P(sd*26,-26),P(sd*30+sw,10),P(sd*28+sw*1.5,44),P(sd*20,14),P(sd*12,-12),P(sd*4,-22)],(u,v,x,y)=>{const st=Math.abs(((x-cx)/s*.6+(y-cy)/s*.1)%4);return shd(K.shr,.5+(st<.7?.28:0)-v*.15,x,y);});}}
// Leuchten über der Nahaufnahme (hohe Auflösung)
function glowAt(x,ctx,px,py,r,col,a){const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(.35,`rgba(${col},${a*.45})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);}
function rays(x,px,py,len,n,col,a,rot){x.save();x.translate(px,py);x.rotate(rot||0);for(let i=0;i<n;i++){const an=i/n*6.283+Math.sin(i*7.1)*.2,l=len*(.5+((i*37)%10)/10*.6),w=len*.018*(1+(i%3));
  const g=x.createLinearGradient(0,0,Math.cos(an)*l,Math.sin(an)*l);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.moveTo(-Math.sin(an)*w,Math.cos(an)*w);x.lineTo(Math.cos(an)*l,Math.sin(an)*l);x.lineTo(Math.sin(an)*w,-Math.cos(an)*w);x.fill();}x.restore();}
function kreakEyeGlow(o,W){return(x,map,sc,t)=>{if(W<=0)return;const s=o.s||1;for(const sd of[-1,1]){const[px,py]=map(o.cx+sd*11*s,o.cy-.4*s);glowAt(x,x,px,py,sc*8*s*W,'230,245,255',.75*W);glowAt(x,x,px,py,sc*2.6*s,'255,255,255',.9*W);rays(x,px,py,sc*20*s*W,10,'235,245,255',.3*W,t*.4*sd);}};}
function shkEyeGlow(o,G){return(x,map,sc,t)=>{const s=o.s||1;for(const sd of[-1,1]){const[px,py]=map(o.cx+sd*10*s,o.cy-1*s);glowAt(x,x,px,py,sc*6*s*G,'255,40,30',.6*Math.min(1.2,G));glowAt(x,x,px,py,sc*2*s,'255,160,120',.7*Math.min(1.2,G));}};}

/* ---------- Die Schlacht um den Marktplatz ---------- */
function mktPoint(r){r=r||30;for(let k=0;k<24;k++){const a=Math.random()*6.283,d=Math.sqrt(Math.random())*r,x=MKT_C.x+Math.cos(a)*d,z=MKT_C.z+Math.sin(a)*d;if(inWorld(x,z)&&!nearWater(x,z)&&!collHitXZ(x,z))return[x,z];}return[MKT_C.x+(Math.random()-.5)*10,MKT_C.z+(Math.random()-.5)*10];}
function finDemon(e,dt){if(e.tgt)return false;const pm=Math.hypot(P.x-MKT_C.x,P.z-MKT_C.z)<70;
  if(!e.goal||Math.hypot(e.goal[0]-e.x,e.goal[1]-e.z)<4)e.goal=pm&&Math.random()<.3?[P.x+(Math.random()-.5)*16,P.z+(Math.random()-.5)*16]:mktPoint(26);
  entMove(e,e.goal[0],e.goal[1],e.d.spd*.85,dt);return true;}
// Verbündete bleiben beim Markt (Leine), im Duell gehen sie zu Shikaya
function finAlly(e,dt){if(e.type==='dragonA'&&finDragon(e,dt))return true;if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+dt*(e.tgt?1.2:5));
  if(FIN.duel){const S=FIN.shk;if(e.capt)return true;if(S&&!S.dead&&!e.tgt){const d=Math.hypot(S.x-e.x,S.z-e.z);if(d>9){entMove(e,S.x+(e.ox||0),S.z+(e.oz||0),e.d.spd,dt);return true;}e.frame=0;return true;}return false;}
  const dm=Math.hypot(e.x-MKT_C.x,e.z-MKT_C.z);
  if(e.tgt&&e.tgt!=='player'){const td=Math.hypot(e.tgt.x-MKT_C.x,e.tgt.z-MKT_C.z);if(td>46||dm>50){e.tgt=null;e.tgtT=1.2;}}
  if(e.tgt)return false;
  if(dm>42){e.goal=mktPoint(22);}
  if(!e.goal||Math.hypot(e.goal[0]-e.x,e.goal[1]-e.z)<2.5){e.goal=mktPoint(28);e.wait=Math.random()*1.5;}
  if(e.wait>0){e.wait-=dt;e.frame=0;return true;}entMove(e,e.goal[0],e.goal[1],e.d.spd*(e.type==='dragonA'?.9:.8),dt);return true;}
// gemischte Trupps: Wachen und Froschleute abwechselnd, von verschiedenen Straßen
const FIN_ROADS=[[ -2,640],[70,690],[-95,705],[60,770],[-60,790]];
function finSquad(n,mix,shoutTxt){const nf=typeof FROG_FOLK!=='undefined'?FROG_FOLK.length:4;let first=null;const road=FIN_ROADS[(Math.random()*FIN_ROADS.length)|0];
  for(let k=0;k<n;k++){const frog=mix==='frog'?true:mix==='guard'?false:k%2===1,x=road[0]+(k%4-1.5)*2,z=road[1]+Math.floor(k/4)*2.5;
    const e=spawnEnt(frog?'frogA':'guardA',x,z,{gi:k%8,fi:k%nf,always:true,fin:1});e.special=finAlly;e.goal=mktPoint(28);if(!first)first=e;}
  if(first&&shoutTxt)setTimeout(()=>say(first,shoutTxt,4),300);return first;}
function finAllies(dt){dt=dt||.016;
  if(FIN.allies===0&&FIN.t>5){FIN.allies=1;const c=finSquad(10,'guard',null);c.name='Hauptmann';finSquad(6,'guard');setTimeout(()=>say(c,'Sturmburg hat den roten Himmel gesehen! Alle zum Marktplatz! Haltet ihn um jeden Preis!',4.5),300);toast('Die Stadtwache von Sturmburg kommt zu Hilfe!');Snd.levelUp();}
  if(FIN.allies===1&&FIN.t>11){FIN.allies=2;finSquad(8,'frog','Quaaak! Die Froschleute kämpfen mit! Murgla hat uns geschickt!');finSquad(6,'mix');toast('Die Froschleute greifen ein!');Snd.levelUp();}
  if(FIN.allies===2&&FIN.t>18){FIN.allies=3;const o=e=>{e.special=finAlly;e.goal=mktPoint(20);return e;};const a=o(spawnEnt('dragonA',-6,712,{di:0,always:true,fin:1,flyOff:30,name:'Drakon'})),b=o(spawnEnt('dragonA',8,716,{di:1,always:true,fin:1,flyOff:34,name:'Vesra'}));
    FIN.dragons=[a,b];setTimeout(()=>say(a,'Ihr habt euch einen schlechten Abend für einen Krieg ausgesucht, Dämonen!',4.5),300);setTimeout(()=>say(b,'Für den Himmel! Für die Drachenmenschen!',3.5),2600);toast('Zwei Drachenmenschen stürzen vom Himmel!');Snd.demonRoar(1.6,.6);}
  if(FIN.allies===3&&FIN.t>26){FIN.allies=4;const n=finGuildHelp();if(n)toast(n===1?'Ein Abenteurer aus der Gilde eilt herbei!':`${n} Abenteurer aus der Gilde eilen herbei!`);}
  if(FIN.allies>=2&&!FIN.over){FIN.reinfT-=dt;if(FIN.reinfT<=0&&FIN.reinf<7&&finAllyAlive()<26){FIN.reinf++;FIN.reinfT=22;
      finSquad(8,'mix',['Verstärkung aus Sturmburg!','Wir sind da! Zum Markt!','Noch eine Schar! Für Coda!','Die Bauern von der Ebene kämpfen mit uns!','Mehr Froschleute! Quaak!','Die letzte Reserve! Haltet durch!','Für Sturmburg und Coda!'][FIN.reinf-1]);toast('Verstärkung trifft ein!');}}}
// Abenteurer der Gilde, die du nicht angeheuert hast, kommen aus dem Gildenhaus
function finGuildHelp(){if(typeof ensureMercs!=='function')return 0;try{ensureMercs();}catch(e){}const g=VB.find(b=>b.type==='guild');const gx=g?g.x:19,gz=g?g.z+8:764;let n=0;
  for(const e of mercEnts){if(!e||e.hired||e.dead)continue;e.finHelp=true;e.x=gx+(Math.random()-.5)*4;e.z=gz+(Math.random()-.5)*3;e.y=fgy(e.x,e.z);e.mode='fin';e.hp=e.max;e.down=0;n++;
    if(n===1)setTimeout(()=>say(e,'Die Gilde lässt Coda nicht im Stich! Wir kämpfen mit!',4),400);}return n;}
{const a=mercStep;mercStep=function(e,dt){
  if(e.finHelp&&!FIN.on){e.finHelp=false;if(!GF().hired[e.merc.name]){e.hired=false;e.mode='home';e.homeT=0;}}
  if(e.finHelp&&FIN.on){e.hired=true;e.mode='fin';if(e.down>0||e.wind>0||e.cast>0)return a(e,dt);
    const S=FIN.shk,c=FIN.duel&&S&&!S.dead?[S.x,S.z]:[MKT_C.x,MKT_C.z],q=kreakEnemies(e);
    if(!q||Math.hypot(q[0].x-c[0],q[0].z-c[1])>(FIN.duel?30:46)){const d=Math.hypot(c[0]-e.x,c[1]-e.z);if(d>(FIN.duel?8:16)){entMove(e,c[0]+(e.ox||0),c[1]+(e.oz||0),e.d.spd,dt);return true;}}
    return a(e,dt);}
  return a(e,dt);};}
{const a=hurtEnt;hurtEnt=function(e,n,by){if(e&&e.merc&&e.finHelp&&FIN.on){if(e.down>0)return;if(e.hp-n<=0){e.hp=0;e.down=20;say(e,'Ugh … gleich … wieder …',2);return;}e.hp-=n;e.hurt=.2;return;}return a(e,n,by);};}
// Shikaya wartet vor der Stadt und hält sich aus dem Kampf heraus
function finShkWait(e,dt){e.x=SHK_W.x;e.z=SHK_W.z;e.flyOff=0;e.inv=true;if(!(e.castT>0))e.frame=0;else{e.castT-=dt;e.frame='c';}
  const pd=Math.hypot(P.x-e.x,P.z-e.z);e.pushCd=(e.pushCd||0)-dt;
  if(pd<13&&state==='playing'&&e.pushCd<=0){e.pushCd=3;const d=pd||1;P.vx+=(P.x-e.x)/d*16;P.vz+=(P.z-e.z)/d*16;P.vy=Math.max(P.vy,5);P.ground=false;takeDamage(6);Snd.whoosh(400,.2);
    fxRing(e.x,e.y+.4,e.z,60,[0xff3a2a,0xa01020],9,.6,.5,{});say(e,['Noch nicht, Kleines. Erst will ich zusehen, wie dein Dorf fällt.','Geh zurück und stirb bei deinen Freunden.','Du bist nicht der, auf den ich warte.'][(Math.random()*3)|0],3.5);}
  return true;}
function finShk(e,dt){if(e.final)return true;if(!FIN.duel)return finShkWait(e,dt);return shkDuelAI(e,dt);}
function startFinale(resume){for(const e of DEM.slice())if(e.fac==='demon'||e.fin||e.fac==='prop')removeEnt(e);SHOTS.length=0;METEORS.length=0;shkE=null;
  const x=4,z=708;P.x=x;P.z=z;P.y=getHeight(x,z)+.3;P.vx=P.vy=P.vz=0;P.yaw=Math.PI;P.pitch=.02;P.safe=[x,z];curArea=null;if(P.riding)dismount(true);
  FLAGS.clock=21*60;const n=FLAGS.day;FLAGS.moonForce={n,phase:4,ev:'blood'};FLAGS.akumaPlayer=1;
  Object.assign(FIN,{on:true,t:0,wave:0,allies:0,descend:false,duel:false,over:false,kreakIn:false,metT:3,shoutT:0,done:false,total:0,killed:0,spT:2,reinf:0,reinfT:30,mile:0});
  const s=spawnEnt('shikaya',SHK_W.x,SHK_W.z,{noHostile:true,noLeash:true,inv:true,always:true,home:{x:SHK_W.x,z:SHK_W.z},fin:1});s.hp=s.max;s.flyOff=0;s.frame=0;FIN.shk=s;shkE=s;s.special=finShk;
  if(kreakE){kreakE.scene=true;kreakE.hidden=true;kreakE.x=0;kreakE.z=640;}
  if(!mqIs('coda'))mqSet(14);
  if(FLAGS.finDuel){FIN.allies=4;duelSetup(true);toast('Shikaya erwartet euch vor der Stadt!');return;}
  if(countItem('akuma')<1&&addItem('akuma',1)===0)selectAkuma();
  const go=()=>{for(const sd of['n','s','e','w'])finSpawnN(11,sd);FIN.wave=1;};
  if(resume){go();toast('Coda steht unter Angriff!');return;}
  setTimeout(()=>playCine([{t:'(Du schlägst hart auf dem Pflaster von Coda auf, mitten auf dem Marktplatz. Über dir hängt der Blutmond. Überall Schreie.)'},
    {who:'Shikaya',t:'(von jenseits der Dächer, aus dem Norden) Sieh hin! Das ist dein kleines Coda. Meine Armee wird es dem Erdboden gleichmachen. Ich warte vor den Toren. Wenn noch jemand übrig ist.'},
    {t:'(Aus dem Wald, von den Feldern und von der Küste strömen Dämonen heran. Sie wollen zum Marktplatz. Hunderte glühende Augen.)'}],go),500);}
function mqObjective3(id){if(id==='coda'){if(FIN.duel)return{t:'Besiege Shikaya, gemeinsam mit Kreak und allen Verbündeten!',at:FIN.shk&&!FIN.shk.dead?[FIN.shk.x,FIN.shk.z]:null};
    return{t:`Verteidige den Marktplatz! Dämonen besiegt: ${Math.min(FIN_GOAL,FIN.killed||0)} / ${FIN_GOAL}`,at:Math.hypot(P.x-MKT_C.x,P.z-MKT_C.z)>40?[MKT_C.x,MKT_C.z]:null};}
  if(id==='end')return{t:'Die Geschichte ist erzählt. Die Welt gehört dir.',at:null};return null;}
function updateStory3(dt){updateMeteors(dt);NIGHT_EV.blood.light=FIN.on?(FILM.on?.95:.74):.4;NIGHT_EV.blood.moon=FIN.on?.52:.32;
  if(FIN.on)for(const f of finFireList())if(Math.random()<dt*14)spawnParticle(f.x+(Math.random()-.5)*2.4,f.y+Math.random(),f.z+(Math.random()-.5)*2.4,(Math.random()-.5)*.6,1.5+Math.random()*2,(Math.random()-.5)*.6,Math.random()<.5?0xff6a10:Math.random()<.5?0xffd040:0x3a3030,1.1,.4);
  const st=MQ[mqStage()]&&MQ[mqStage()].id;
  if(st==='coda'&&!FIN.on&&!FIN.done&&state==='playing'){startFinale(true);return;}
  if(FIN.done&&FIN.leaveT>0){FIN.leaveT-=dt;if(FIN.leaveT<=0)for(const e of DEM.slice())if(e.fin)removeEnt(e);}
  for(const e of DEM.slice())if(e.sink&&e.sinkT>1.6)removeEnt(e);
  cartTick(dt);
  if(!FIN.on||state!=='playing')return;FIN.t+=dt;finAllies(dt);
  FIN.panT=(FIN.panT||0)-dt;if(FIN.panT<=0){FIN.panT=1;for(const v of villagers)if(!v.dead&&!v.inside&&v.z>PLAIN_END){v.flee=Math.max(v.flee||0,2);if(Math.random()<.02)say(v,['Hilfe!','Die Dämonen!','Rennt!','In die Häuser!'][(Math.random()*4)|0],2);}}
  if(FIN.duel){duelTick(dt);return;}
  if(FIN.over)return;
  // ständiger Nachschub von allen Seiten, bis das Ziel erreicht ist
  const alive=finAlive();FIN.spT-=dt;
  if(FIN.spT<=0&&FIN.wave>=1){const left=FIN_GOAL-FIN.total;
    if(alive<FIN_CAP&&left>0){const side=['n','s','e','w',null][(Math.random()*5)|0],k=Math.min(FIN_CAP-alive,left,5+((Math.random()*6)|0));finSpawnN(k,side);
      if(Math.random()<.25)toast(side?`Dämonen von ${{n:'Norden',s:'Süden',e:'Osten',w:'Westen'}[side]}!`:'Sie kommen von überall!');}
    FIN.spT=1.3+Math.random()*1.1;}
  // geschafft: alle Dämonen besiegt (die letzten Nachzügler zerfallen)
  if((FIN.killed>=FIN_GOAL||(FIN.total>=FIN_GOAL&&alive===0)||FIN.t>480)&&!FIN.over){FIN.over=true;
    for(const d of DEM)if(d.fin&&d.fac==='demon'&&!d.dead&&d!==FIN.shk){d.sink=true;d.sinkT=0;d.inv=true;}
    const al=DEM.filter(e=>e.fin&&e.fac==='ally'&&!e.dead);if(al[0])say(al[0],'Sie weichen zurück! Coda hält stand!',4);toast('Die Dämonenarmee ist geschlagen!');Snd.fanfare&&Snd.fanfare();
    setTimeout(()=>{if(FIN.on&&!FIN.duel)startDuelFilm();},4200);}
  // Blutmeteore: Shikaya schleudert sie aus der Ferne
  FIN.metT-=dt;if(FIN.metT<=0&&!FIN.over){FIN.metT=3.4;const L=DEM.filter(e=>e.fin&&e.fac==='ally'&&!e.dead),tg=Math.random()<.45?P:L[(Math.random()*L.length)|0]||P;meteor(tg.x+(Math.random()-.5)*6,tg.z+(Math.random()-.5)*6);if(FIN.shk)FIN.shk.castT=.8;}}
// Tote Verbündete zählen nicht als Kills; Shikaya stirbt nie, sie wird gefangen
{const a=hurtEnt;hurtEnt=function(e,n,by){if(e&&e===FIN.shk&&FIN.on){if(!FIN.duel||e.final||e.inv)return;if(by!=='player')n*=by==='kreak'?.6:.32;
    if(e.hp-n<=1){e.hp=1;e.hurt=.2;e.final=true;e.inv=true;captureScene();return;}e.hp-=n;e.hurt=.2;if(by==='player'||by==='kreak')e.aggroT=12;return;}
  return a(e,n,by);};}

/* ---------- Duell: Aufbau nach dem Film (oder beim Laden) ---------- */
function duelHelpers(){const L=[];const mk=(name,role,off)=>{const d=VDEFS.find(v=>v.name===name);if(!d)return null;const sp=SPR['p'+d.id+'_0']?'p'+d.id+'_':null;if(!sp)return null;
    const e=spawnEnt('helperA',SHK_W.x+off[0],SHK_W.z+off[1],{sp,name,role,always:true,fin:1,hp:900,portrait:null});e.special=finAlly;e.ox=(Math.random()-.5)*8;e.oz=4+Math.random()*4;L.push(e);return e;};
  FIN.dofra=mk('Dofra','Schmied',[10,30]);FIN.corvin=mk('Corvin','Priester',[-10,30]);return L;}
function duelSetup(resume){FIN.duel=true;FIN.over=true;FLAGS.finDuel=1;const S=FIN.shk;
  S.d=DT.shkDuel;S.type='shikaya';S.hp=resume&&FLAGS.finShkHp?Math.max(2000,FLAGS.finShkHp):DT.shkDuel.hp;S.max=DT.shkDuel.hp;S.inv=false;S.final=false;S.flyOff=0;S.special=finShk;S.noLeash=true;S.aggroT=30;S.barShown=false;
  S.x=SHK_W.x;S.z=SHK_W.z+2;S.tB=4;S.tS=6;S.tG=9;S.tK=12;S.tM=14;S.adds=0;
  // Kreak mit dem Akuma Senso und weißen Augen
  FLAGS.akumaPlayer=0;FLAGS.kreakBroken=0;FLAGS.kreakGlow=1;if(countItem('akuma')>0)removeItem('akuma',countItem('akuma'));renderInv();
  if(kreakE){Object.assign(kreakE,{hidden:false,scene:false,mode:'follow',down:0});kreakE.max=Math.max(kreakE.max,1600);kreakE.hp=kreakE.max;if(!FIN.kreakPos){kreakE.x=SHK_W.x+1;kreakE.z=SHK_W.z+9;}else{kreakE.x=FIN.kreakPos[0];kreakE.z=FIN.kreakPos[1];}
    kreakE.d=Object.assign({},DT.kreak,{eyes:{get y(){return KF_EYE.y;},get dx(){return KF_EYE.dx;},c:'w'}});kreakRedraw(true);}
  // Verbündete kommen zum Duell
  const al=DEM.filter(e=>e.fin&&e.fac==='ally'&&!e.dead&&e.type!=='helperA');
  if(al.length<10)for(let k=0;k<10-al.length;k++){const e=spawnEnt(k%2?'frogA':'guardA',(k-5)*2,SHK_W.z+34,{gi:k%8,fi:k%4,always:true,fin:1});e.special=finAlly;al.push(e);}
  al.forEach((e,i)=>{e.ox=Math.cos(i*2.4)*7;e.oz=Math.abs(Math.sin(i*2.4))*6+4;if(!FIN.allyPlaced){const a=.4+i/al.length*2.4;e.x=SHK_W.x+Math.cos(a)*22;e.z=SHK_W.z+12+Math.sin(a)*14;e.y=fgy(e.x,e.z);}e.tgt=null;e.goal=null;});
  if(!FIN.dofra)duelHelpers();
  if(resume&&finGuildHelp)finGuildHelp();
  for(const e of mercEnts)if(e&&(e.finHelp||e.hired)){e.ox=(Math.random()-.5)*10;e.oz=6+Math.random()*4;if(!FIN.allyPlaced){e.x=SHK_W.x+(Math.random()-.5)*16;e.z=SHK_W.z+26+Math.random()*6;e.y=fgy(e.x,e.z);}}
  if(resume){P.x=SHK_W.x+4;P.z=SHK_W.z+24;P.y=fgy(P.x,P.z)+.2;P.yaw=0;}
  dmBossShow(S);S.barShown=true;saveGame&&setTimeout(()=>{try{saveGame();}catch(e){}},500);}
// Shikayas Angriffe im gemeinsamen Kampf
function shkTargets(r,x,z){const L=[];for(const o of DEM)if(o.fac==='ally'&&!o.dead&&!o.down&&Math.hypot(o.x-x,o.z-z)<r)L.push(o);return L;}
function shkDuelAI(e,dt){if(e.final)return true;FLAGS.finShkHp=Math.round(e.hp);
  for(const k of['tB','tS','tG','tK','tM'])e[k]=(e[k]||0)-dt;
  if(e.post>0){e.post-=dt;e.frame='b';return true;}
  // Bodenschlag: erst ein roter Kreis, dann bricht der Boden auf
  if(e.slam){const s=e.slam;s.t-=dt;e.frame='c';if(Math.random()<dt*30){const a=Math.random()*6.283;fxP(s.x+Math.cos(a)*3.8,fgy(s.x,s.z)+.1,s.z+Math.sin(a)*3.8,0,.6,0,[0xff2a1a,0xff6a3a],.45,.45);}
    if(s.t<=0){e.slam=null;const g=fgy(s.x,s.z);fxBurst(s.x,g+.4,s.z,90,[0xff3a1a,0xffa040,0xffe080],9,.8,.5,{up:4,g:5});fxDust(s.x,s.z,30,3,{spd:5,size:.7});Snd.boom(.35);
      if(Math.hypot(P.x-s.x,P.z-s.z)<3.8&&P.y-g<2.5){takeDamage(32);P.vy=Math.max(P.vy,7);P.ground=false;}for(const o of shkTargets(3.8,s.x,s.z))hurtEnt(o,70,'demon');}
    return true;}
  // Rundumschlag mit dem Riesenschwert
  if(e.sweep>0){e.sweep-=dt;e.frame='a';if(e.sweep<=0){e.post=.35;const yaw=Math.random()*6.283;for(let k=0;k<3;k++)fxArc(e.x,e.y+1.6+k*.5,e.z,yaw+k*2.1,6.5,-.9,.9,40,[0xff2a2a,0xff7a4a,0xffd0a0],.45,.55,{tilt:1,sp:5});
      Snd.whoosh(300,.25);Snd.boom(.18);const pd=Math.hypot(P.x-e.x,P.z-e.z);if(pd<7.5&&state==='playing'){takeDamage(26);const d=pd||1;P.vx+=(P.x-e.x)/d*10;P.vz+=(P.z-e.z)/d*10;}
      for(const o of shkTargets(7.5,e.x,e.z)){hurtEnt(o,60,'demon');const d=Math.hypot(o.x-e.x,o.z-e.z)||1;o.x+=(o.x-e.x)/d*1.6;o.z+=(o.z-e.z)/d*1.6;}}return true;}
  if(e.cast>0)return castShk(e,dt);
  if(e.act==='blink'){e.actT-=dt;if(e.actT<=0){const a=P.yaw,x=P.x+Math.sin(a)*2.8,z=P.z+Math.cos(a)*2.8;e.x=x;e.z=z;e.act=null;e.inv=false;e.hidden=false;e.wind=.4;e.atk=e.d.cd;e.tgt='player';
      fxBurst(x,e.y+2,z,50,[0xa01020,0xff3a3a,0x200008],6,.6,.5,{});Snd.whoosh(1200,.12);}return true;}
  const pd=Math.hypot(P.x-e.x,P.z-e.z),near=shkTargets(7,e.x,e.z).length+(pd<7?1:0),hpk=e.hp/e.max;
  // Verstärkung aus dem Boden
  if((hpk<.66&&e.adds<1)||(hpk<.33&&e.adds<2)){e.adds++;say(e,e.adds===1?'Steht auf, meine Kinder!':'Warum fallt ihr nicht endlich?!',3);for(let k=0;k<7;k++){const a=k/7*6.283,x=e.x+Math.cos(a)*8,z=e.z+Math.sin(a)*8,t=k%3?'imp':'hound';
      const m=spawnEnt(t,x,z,{always:true,fin:1,hp:Math.round(DT[t].hp*1.2)});fxBurst(x,fgy(x,z)+.5,z,30,[0x5a0a0a,0xff3a1a],5,.6,.4,{up:3});}Snd.demonRoar(1.2,.8);}
  if(near>=2&&e.tS<=0){e.tS=6+Math.random()*3;e.sweep=.75;say(e,['Weg mit euch!','Ihr Fliegen!','Kniet!'][(Math.random()*3)|0],1.8);return true;}
  if(e.tG<=0){e.tG=7+Math.random()*3;const L=shkTargets(26,e.x,e.z),t=Math.random()<.6||!L.length?P:L[(Math.random()*L.length)|0];e.slam={x:t.x,z:t.z,t:1.25};Snd.demonRoar(1.5,.4);return true;}
  if(pd>6&&e.tB<=0){e.tB=5+Math.random()*2;e.cast=.55;e.castShots=hpk<.5?8:6;return true;}
  if(e.tK<=0&&pd<24&&pd>4){e.tK=10+Math.random()*4;e.act='blink';e.actT=.45;e.inv=true;e.hidden=true;fxBurst(e.x,e.y+2,e.z,50,[0xa01020,0xff3a3a,0x200008],6,.6,.5,{});return true;}
  if(hpk<.6&&e.tM<=0){e.tM=10;for(let k=0;k<4;k++){const L=shkTargets(30,e.x,e.z),t=k===0?P:L[(Math.random()*L.length)|0]||P;meteor(t.x+(Math.random()-.5)*5,t.z+(Math.random()-.5)*5);}}
  return false;}
function duelTick(dt){const S=FIN.shk;if(!S||S.final)return;if(!S.barShown&&!S.dead){dmBossShow(S);S.barShown=true;}}
// Kreak kämpft im Duell immer gegen Shikaya
function kreakDuel(e,dt){if(!FIN.on||!FIN.duel||e.scene||e.down>0)return false;const S=FIN.shk;if(!S||S.dead||S.final||S.hidden)return false;const d=e.d;
  if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+dt*6);e.atk-=dt;e.slashCd=(e.slashCd==null?4:e.slashCd)-dt;const dist=Math.hypot(S.x-e.x,S.z-e.z),reach=2.9;
  if(e.wind>0){e.wind-=dt;e.frame='a';if(e.wind<=0&&dist<reach+1){hurtEnt(S,kreakDmg()*1.4,'kreak');Snd.hit('sword');fxSparks(S.x+(e.x-S.x)*.4,e.y+1.4,S.z+(e.z-S.z)*.4,14,{cols:[0xffffff,0xe0f0ff,0xff5a4a]});}entGround(e);return true;}
  if(e.slashCd<=0&&dist<10&&dist>3){e.slashCd=6+Math.random()*2;e.frame='a';const yaw=Math.atan2(S.z-e.z,S.x-e.x);
    for(let k=0;k<6;k++)setTimeout(()=>{const f=(k+1)/6,x=e.x+(S.x-e.x)*f,z=e.z+(S.z-e.z)*f;fxArc(x,fgy(x,z)+1.4,z,yaw+Math.PI/2,1.6,-1.2,1.2,26,[0xffffff,0xd8ecff,0x9ad0ff],.35,.4,{sp:3});},k*40);
    setTimeout(()=>{if(!S.final){hurtEnt(S,kreakDmg()*3,'kreak');fxSparks(S.x,S.y+2,S.z,26,{cols:[0xffffff,0xbfe0ff]});}},260);Snd.whoosh(1400,.2);say(e,['Hier!','Für Coda!','Spür das, Schwester!'][(Math.random()*3)|0],1.5);entGround(e);return true;}
  if(dist>reach){entMove(e,S.x+(e.x-S.x)/dist*2.2,S.z+(e.z-S.z)/dist*2.2,d.spd*1.1,dt);}else if(e.atk<=0){e.atk=.75;e.wind=.25;}else e.frame=0;
  entGround(e);return true;}
{const a=kreakStep;kreakStep=function(e,dt){if(kreakDuel(e,dt))return;a(e,dt);};}
// Kreaks weiße Augen auch im normalen Bild
{const a=kreakRedraw;kreakRedraw=function(force){a(FLAGS.kreakGlow?true:force);if(!FLAGS.kreakGlow||!kreakCv)return;const x=kreakCv.getContext('2d');
  KF.forEach((f,i)=>{const c=SPR['kd_'+f]&&SPR['kd_'+f].c;if(!c||f==='k'||!c.headBox)return;const d=x.getImageData(i*50,4,44,60);eyeWhiten(d.data,44,c.headBox,60);x.putImageData(d,i*50,4);});kreakTex.needsUpdate=true;};}
{let last=-1;setInterval(()=>{const g=FLAGS&&FLAGS.kreakGlow?1:0;if(g!==last){last=g;try{if(kreakCv)kreakRedraw(true);}catch(e){}}},1000);}
// Tod im Duell: am Rand des Kampfplatzes wieder aufstehen
function storyDeath(){const inR=inRealm(P.x);if(!inR&&!FIN.on)return false;state='dead';keys.clear();rightDown=false;Snd.thud();promptEl.hidden=true;
  $('deathText').textContent=FIN.on?(FIN.duel?'Du rappelst dich wieder auf. Kreak braucht dich!':'Du rappelst dich wieder auf. Coda braucht dich!'):'Die Dunkelheit wirft dich zurück. Du verlierst nichts.';const ds=$('deathScreen');ds.hidden=false;ds.classList.remove('on');void ds.offsetWidth;ds.classList.add('on');
  setTimeout(()=>{const S=P.stats;S.hp=S.maxHp;S.st=S.maxSt;P.burnT=0;P.lastDmg=time;
    if(FIN.on){const[x,z]=FIN.duel?[SHK_W.x+(Math.random()-.5)*10,SHK_W.z+26]:[MKT_C.x+(Math.random()-.5)*8,MKT_C.z-4];P.x=x;P.z=z;P.y=getHeight(x,z)+.2;}
    else{const sh=shkE&&!shkE.dead&&!shkE.twist;if(sh){shkE.hp=shkE.max;shkE.s1=shkE.s2=0;for(const e of DEM.slice())if(e.fac==='demon'&&e!==shkE&&inRealm(e.x)&&Math.hypot(e.x-RX,e.z+180)<40)removeEnt(e);}
      const x=sh?RX:R_ARRIVE.x,z=sh?-112:R_ARRIVE.z-5;P.x=x;P.z=z;P.y=realmFloor(x,z)+.2;}
    P.vx=P.vy=P.vz=0;ds.hidden=true;ds.classList.remove('on');state='playing';renderStats();updateLockHint();saveGame();},3200);return true;}
// Musik im Duell
{const a=musicWant;musicWant=function(){if(!Mus.cine&&typeof FIN!=='undefined'&&FIN.on&&FIN.duel&&!(FILM.on&&FILM.silent)&&state!=='menu'&&state!=='loading')return'bosskampf/kein_erbarmen';return a();};}
