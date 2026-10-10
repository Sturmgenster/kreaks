/* =========================================================
   Neue Pixel-Zeichnungen für die Wildtiere (Savanne, Dschungel, Sumpf)
   - echte Anatomie: Schulter, Brustkorb, Hüfte, Gelenke an den Beinen
   - Licht von oben links, Fell-/Hautmuster, dunkle Kontur
   - alle Bilder einer Art im gleichen Maßstab (20 Pixel pro Meter)
   ========================================================= */
const QSC=20;
function qCanvas(wm,hm){const W=Math.ceil(wm*QSC)+4,H=Math.ceil(hm*QSC)+2,p=new Px(W,H);p.X=m=>2+m*QSC;p.Y=m=>H-1-m*QSC;return p;}
// Ellipse in Metern. P = Palette (dunkel → hell), f(x,y,L) optional für Muster
function qE(p,cx,cy,rx,ry,P,f,lit){const X=p.X(cx),Y=p.Y(cy),RX=Math.max(.8,rx*QSC),RY=Math.max(.8,ry*QSC);
  for(let y=Math.floor(Y-RY);y<=Math.ceil(Y+RY);y++)for(let x=Math.floor(X-RX);x<=Math.ceil(X+RX);x++){const nx=(x+.5-X)/RX,ny=(y+.5-Y)/RY,d=nx*nx+ny*ny;if(d>1)continue;
    const L=(lit==null?.6:lit)-ny*.32-nx*.08-(d>.8?.1:0)+(hash2(x,y,97)-.5)*.12;const c=f?f(x,y,L):null;p.set(x,y,c||P[shadeIdx(L,P.length,x,y)]);}}
// sich verjüngende Röhre (Beine, Hals, Schwanz) zwischen zwei Punkten in Metern
function qT(p,x0,y0,x1,y1,r0,r1,P,f,lit){const ax=p.X(x0),ay=p.Y(y0),bx=p.X(x1),by=p.Y(y1),l=Math.hypot(bx-ax,by-ay),n=Math.max(2,Math.ceil(l*1.5));
  for(let i=0;i<=n;i++){const t=i/n,cx=ax+(bx-ax)*t,cy=ay+(by-ay)*t,r=Math.max(.6,(r0+(r1-r0)*t)*QSC);
    for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=(x+.5-cx)/r,dy=(y+.5-cy)/r;if(dx*dx+dy*dy>1)continue;
      const L=(lit==null?.58:lit)-dx*.28-dy*.12+(hash2(x,y,98)-.5)*.1;const c=f?f(x,y,L,t):null;p.set(x,y,c||P[shadeIdx(L,P.length,x,y)]);}}}
// Pfad aus mehreren Punkten
function qPath(p,pts,r0,r1,P,f,lit){for(let i=0;i<pts.length-1;i++){const t0=i/(pts.length-1),t1=(i+1)/(pts.length-1);qT(p,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],r0+(r1-r0)*t0,r0+(r1-r0)*t1,P,f,lit);}}
const qPx=(p,x,y,c)=>p.set(Math.round(p.X(x)),Math.round(p.Y(y)),c);
// Beine. kind: 'front' oder 'back'. sw = Schritt (-1..1). top = Höhe des Beinansatzes
function qLeg(p,kind,x,top,w,P,sw,o={}){const s=sw*top*.22,foot=o.foot||W_BK,fw=o.fw||w*.8;p._ln=(p._ln||0)+1;const lit=(o.far||p._ln<=2)?.36:.6;let pts;
  if(o.fold){const fx=kind==='front'?x+top*.35:x-top*.1;pts=[[x,top],[fx,o.fold+.04],[fx+(kind==='front'?.25:.32)*top,o.fold*0+.05]];qPath(p,pts,w,w*.7,P,o.f,lit);return;}
  if(kind==='front')pts=[[x,top],[x+.02*top+s*.4,top*.5],[x+s,top*.08],[x+s+.02,0]];
  else pts=[[x,top],[x+.13*top+s*.3,top*.58],[x-.07*top+s*.6,top*.26],[x-.03*top+s,0]];
  qPath(p,pts.slice(0,2),w*1.15,w*.75,P,o.f,lit);qPath(p,pts.slice(1),w*.75,w*(o.heavy?.85:.5),P,o.f,lit);
  if(kind==='front'&&!o.heavy)qE(p,pts[1][0]+.005,pts[1][1],w*.7,w*.75,P,o.f,lit);
  if(o.paw){qE(p,pts[3][0]+.03,.035,Math.max(.03,w*.75),.035,P,null,lit);}
  else{const fx=Math.round(p.X(pts[3][0]-w*(o.heavy?.85:.55))),fy=p.Y(0),hw=Math.max(2,Math.round(w*(o.heavy?1.7:1.15)*QSC)),hh=Math.max(1,Math.round((o.heavy?.05:.06)*QSC));
    for(let yy=0;yy<hh;yy++)for(let xx=0;xx<hw;xx++)p.set(fx+xx,fy-yy,o.heavy?hex('#cfc6b4'):foot);}}
const qEye=(p,x,y,c)=>{qPx(p,x,y,c||W_EYE);};
// Frame-Hilfen
const qSw=f=>f===1?1:f===2?-1:0;

/* ---------- Paletten ---------- */
const QP={
  zw:pal(['#9a968c','#c6c2b6','#e6e2d6','#f8f6ee']),zb:pal(['#0c0a0a','#1a1816','#2a2622']),
  gz:pal(['#6a3a14','#8e5622','#b07434','#cc9250','#e2b070']),gzw:pal(['#c8c0b0','#e8e2d4','#faf6ec']),
  gi:pal(['#6a3a12','#8e521c','#b06e2a','#c8883a']),gic:pal(['#c8b48a','#e2d2a8','#f2e6c6']),
  el:pal(['#4a4846','#605d5a','#77736e','#8e8a84','#a6a29c']),rh:pal(['#4c4a46','#66625c','#807b74','#9a948c','#b2aca2']),
  hi:pal(['#4a3a44','#644e5a','#7e6672','#9a808a','#b49aa2']),hip:pal(['#a86a6a','#c88a86','#e2aaa4']),
  li:pal(['#7a4e1c','#a06a28','#c48a3a','#dcaa58','#ecc47a']),lim:pal(['#3a1e0c','#5a3014','#7a4420','#9a5a2c']),
  hy:pal(['#5a4a34','#786448','#96805e','#b09c78','#c8b692']),
  gn:pal(['#26242a','#3a3740','#504c56','#68646e','#807c86']),gnm:pal(['#1a1818','#2a2826','#3c3834']),
  bf:pal(['#120f0e','#1e1a18','#2c2724','#3c3632','#4e4640']),ho:pal(['#3a342c','#5e564a','#8a8070','#b2a894']),
  wh:pal(['#3e3630','#5a5048','#766a60','#928678','#aea292']),
  ch:pal(['#8a5a20','#b0782c','#cc983e','#e2b45a','#f0cc80']),chw:pal(['#d8ccb0','#eee4cc','#faf4e4']),
  wd:pal(['#2a1e14','#4a3420','#6e4e2c','#94703e','#b89058']),
  os:pal(['#0e0c0c','#1e1a1a','#2e2828','#403838']),osw:pal(['#c8c4bc','#e6e2da','#f8f6f0']),osp:pal(['#8a5a52','#b07a70','#d09a8e','#e8b8aa']),
  vu:pal(['#2a1e16','#423024','#5c4634','#786048','#94795e']),vuh:pal(['#9a5a52','#c07a6e','#dc9a8a']),
  mk:pal(['#6a5236','#8a6e4a','#a88a62','#c2a67c','#d8c09a']),
  bb:pal(['#3e3a24','#57522f','#716a3c','#8b8350','#a49c66']),
  mo:pal(['#3a2414','#583620','#7a4c2c','#9a663a','#b8824e'])};
const QC={bk:hex('#100e0c'),wh:hex('#f4f0e6'),ey:hex('#0a0806'),pk:hex('#c87a7a'),tu:hex('#f2ead6'),red:hex('#8a2a1a'),gold:hex('#e0a020'),nose:hex('#1a1210')};

/* ---------- Zebra ---------- */
function qZebra(f){const p=qCanvas(2.3,1.62),sw=qSw(f),lie=f==='l',eat=f==='e',B=QP.zw,K=QP.zb,dy=lie?-.55:0;
  const stripe=(x,y,L)=>{const w=((x*.55+Math.sin(y*.45)*1.6+(y*.12))%4+4)%4;return w<1.6?K[shadeIdx(L,3,x,y)]:null;},legSt=(x,y,L)=>((y>>1)%2===0)?K[1]:null;
  const top=.78;
  if(lie){qLeg(p,'back',.45,.3,.07,QP.zw,0,{fold:.12,f:legSt});qLeg(p,'front',1.3,.3,.06,QP.zw,0,{fold:.12,f:legSt});}
  else{qLeg(p,'back',.5,top,.075,B,-sw,{f:legSt});qLeg(p,'front',1.3,top,.065,B,sw,{f:legSt});}
  // Schwanz
  qPath(p,[[.25,1.15+dy],[.14,.95+dy],[.12,.7+dy]],.025,.02,B);qE(p,.12,.62+dy,.035,.09,K);
  qE(p,.55,1.07+dy,.33,.3,B,stripe);qE(p,.95,1.04+dy,.45,.29,B,stripe);qE(p,1.32,1.1+dy,.3,.31,B,stripe);
  // Hals und Kopf
  const hx=eat?1.85:1.86,hy=eat?.3:1.42;const nk=eat?[[1.38,1.18+dy],[1.6,.85],[1.78,.45]]:[[1.38,1.18+dy],[1.55,1.32+dy],[1.7,1.48+dy]];
  qPath(p,nk,.17,.12,B,stripe);
  for(let i=0;i<nk.length-1;i++){const a=nk[i],b=nk[i+1];for(let k=0;k<5;k++){const t=k/5,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t+.15;qE(p,x-.03,y,.035,.06,k%2?K:B);}}
  const hyy=eat?hy:hy+dy;qE(p,hx,hyy,.16,.12,B,stripe);qPath(p,eat?[[hx,hyy],[hx+.1,hyy-.18]]:[[hx,hyy],[hx+.22,hyy-.12]],.1,.07,B,stripe);
  qE(p,eat?hx+.12:hx+.26,eat?hyy-.22:hyy-.13,.07,.06,K);
  for(const ex of[-.05,.02])qPath(p,[[hx+ex,hyy+.08],[hx+ex-.03,hyy+.22]],.03,.015,B);qEye(p,hx+.03,hyy+.02);
  if(!lie){qLeg(p,'back',.62,top,.08,B,sw,{f:legSt});qLeg(p,'front',1.42,top,.07,B,-sw,{f:legSt});}
  outline(p);return p.done();}
/* ---------- Gazelle ---------- */
function qGazelle(f){const p=qCanvas(1.5,1.05),sw=qSw(f),lie=f==='l',eat=f==='e',B=QP.gz,W=QP.gzw,dy=lie?-.38:0;
  const side=(x,y,L)=>{const yy=(p.Y(.72+dy)-y);return yy<-2?W[shadeIdx(L+.2,3,x,y)]:yy<0?QC.nose.map?null:null:null;};
  const top=.5,body=(x,y,L)=>{const ym=p.Y(.64+dy);return y>ym+1?W[shadeIdx(L+.25,3,x,y)]:(y===ym||y===ym+1)?QP.gz[0]:null;};
  if(lie){qLeg(p,'back',.32,.22,.035,B,0,{fold:.08});qLeg(p,'front',.85,.22,.03,B,0,{fold:.08});}else{qLeg(p,'back',.33,top,.04,B,-sw);qLeg(p,'front',.82,top,.035,B,sw);}
  qE(p,.18,.82+dy,.06,.05,W);qPath(p,[[.16,.86+dy],[.1,.8+dy]],.025,.02,QP.zb);
  qE(p,.38,.7+dy,.24,.2,B,body);qE(p,.62,.69+dy,.28,.19,B,body);qE(p,.84,.74+dy,.19,.2,B,body);
  const hx=eat?1.05:1.06,hy=eat?.18:1.0+dy;
  qPath(p,eat?[[.9,.8+dy],[1.0,.5],[1.05,.25]]:[[.88,.82+dy],[.96,.9+dy],[1.0,.96+dy]],.07,.05,B);
  qE(p,hx,hy,.08,.06,B);qPath(p,eat?[[hx,hy],[hx+.06,hy-.12]]:[[hx,hy],[hx+.14,hy-.07]],.05,.035,B);qPx(p,eat?hx+.07:hx+.15,eat?hy-.14:hy-.08,QC.nose);
  qPath(p,[[hx-.02,hy+.05],[hx-.08,hy+.14],[hx-.06,hy+.25],[hx-.02,hy+.3]],.015,.008,QP.zb);qPath(p,[[hx+.01,hy+.05],[hx-.04,hy+.15],[hx-.02,hy+.25],[hx+.02,hy+.29]],.015,.008,QP.zb);
  qPath(p,[[hx-.05,hy+.04],[hx-.12,hy+.1]],.025,.015,B);qEye(p,hx+.02,hy+.01);qPx(p,hx+.04,hy-.03,QC.wh);
  if(!lie){qLeg(p,'back',.42,top,.045,B,sw);qLeg(p,'front',.9,top,.04,B,-sw);}
  outline(p);return p.done();}
/* ---------- Giraffe ---------- */
function qGiraffe(f){const p=qCanvas(3.1,5.5),sw=qSw(f),eat=f==='e',B=QP.gic,Pt=QP.gi;
  const net=(x,y,L)=>{const cs=7,gx=Math.floor(x/cs),gy=Math.floor(y/cs);let d1=1e9,d2=1e9;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const cx=(gx+a)*cs+hash2(gx+a,gy+b,51)*cs,cy=(gy+b)*cs+hash2(gx+a,gy+b,52)*cs,d=Math.hypot(x-cx,y-cy);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
    return d2-d1<1.4?null:Pt[shadeIdx(L,Pt.length,x,y)];};
  const top=1.95;qLeg(p,'back',.55,top,.09,B,-sw,{f:(x,y,L)=>y<p.Y(1.0)?net(x,y,L):null});qLeg(p,'front',1.55,top+.25,.085,B,sw,{f:(x,y,L)=>y<p.Y(1.2)?net(x,y,L):null});
  qPath(p,[[.32,2.6],[.2,2.2],[.18,1.8]],.03,.02,B);qE(p,.18,1.72,.04,.1,QP.zb);
  qE(p,.6,2.45,.38,.36,B,net);qE(p,1.05,2.55,.5,.42,B,net);qE(p,1.5,2.75,.36,.45,B,net);
  const hx=eat?2.75:2.38,hy=eat?2.2:5.05;const nk=eat?[[1.6,2.9],[2.1,2.95],[2.55,2.6],[2.72,2.3]]:[[1.62,2.95],[1.85,3.6],[2.08,4.3],[2.28,4.9]];
  qPath(p,nk,.2,.11,B,net);
  if(!eat)for(let k=0;k<14;k++){const t=k/13,x=1.55+t*(2.22-1.55),y=3.15+t*(5.0-3.15);qE(p,x-.13,y,.04,.06,QP.gi);}
  qE(p,hx,hy,.17,.13,B);qPath(p,eat?[[hx,hy],[hx+.08,hy-.25]]:[[hx,hy],[hx+.3,hy-.12]],.11,.07,B);qE(p,eat?hx+.08:hx+.33,eat?hy-.3:hy-.13,.07,.06,QP.gi);
  for(const ex of[-.06,.03]){qPath(p,[[hx+ex,hy+.1],[hx+ex,hy+.28]],.025,.022,B);qE(p,hx+ex,hy+.3,.035,.035,QP.zb);}
  qPath(p,[[hx-.1,hy+.06],[hx-.24,hy+.12]],.04,.02,B);qEye(p,hx+.03,hy+.03);
  qLeg(p,'back',.68,top,.095,B,sw,{f:(x,y,L)=>y<p.Y(1.0)?net(x,y,L):null});qLeg(p,'front',1.68,top+.25,.09,B,-sw,{f:(x,y,L)=>y<p.Y(1.2)?net(x,y,L):null});
  outline(p);return p.done();}
/* ---------- Elefant ---------- */
function qElephant(f){const p=qCanvas(3.6,3.45),sw=qSw(f),eat=f==='e',atk=f==='a',B=QP.el;
  const wr=(x,y,L)=>(hash2(x>>1,y,61)<.12?B[1]:(y%5===0&&hash2(x,y>>2,62)<.5)?B[shadeIdx(L-.15,B.length,x,y)]:null);
  const top=1.45;let nL=0;const leg=(x,s,k)=>{const sx=s*.18,lt=++nL<=2?.36:.6;qPath(p,[[x,top+.4],[x+sx*.4,top*.55]],.25*k,.2*k,B,wr,lt);qPath(p,[[x+sx*.4,top*.55],[x+sx,0]],.2*k,.21*k,B,wr,lt);for(const t of[-.1,0,.1])qPx(p,x+sx+t,.04,hex('#d8d0c0'));};
  leg(.75,-sw,.95);leg(2.0,atk?.6:sw,.95);
  qPath(p,[[.25,2.4],[.12,2.0],[.1,1.6]],.04,.025,B);qE(p,.1,1.52,.04,.08,QP.zb);
  qE(p,1.35,2.15,1.15,.9,B,wr);qE(p,2.0,2.35,.6,.75,B,wr);
  const hx=eat?2.75:2.7,hy=eat?2.05:2.55+(atk?.15:0);
  qE(p,hx,hy,.5,.5,B,wr);qE(p,hx-.15,hy+.32,.3,.18,B);
  // Ohr
  qE(p,hx-.45,hy-.15,.38,.62,QP.el,(x,y,L)=>B[shadeIdx(L-.25,B.length,x,y)]);
  // Rüssel
  const tr=eat?[[hx+.35,hy-.2],[hx+.5,hy-.8],[hx+.52,hy-1.4],[hx+.45,.2]]:atk?[[hx+.35,hy-.1],[hx+.65,hy+.15],[hx+.8,hy+.55],[hx+.7,hy+.85]]:[[hx+.38,hy-.15],[hx+.55,hy-.7],[hx+.55,hy-1.3],[hx+.65,hy-1.75]];
  qPath(p,tr,.2,.08,B,wr);
  qPath(p,[[hx+.28,hy-.38],[hx+.5,hy-.65],[hx+.72,hy-.6]],.07,.035,QP.gzw);
  qEye(p,hx+.12,hy+.12);
  leg(1.0,sw,1.05);leg(2.25,atk?.9:-sw,1.05);
  outline(p);return p.done();}
/* ---------- Nashorn ---------- */
function qRhino(f){const p=qCanvas(3.0,1.9),sw=qSw(f),eat=f==='e',atk=f==='a',B=QP.rh;
  const fold=(x,y,L)=>{const xs=[p.X(.85),p.X(1.6)].map(Math.round);return xs.includes(x)?B[1]:null;};
  const top=.72;let nL=0;const leg=(x,s)=>{const sx=s*.13,lt=++nL<=2?.36:.6;qPath(p,[[x,top+.3],[x+sx*.4,top*.42]],.2,.14,B,null,lt);qE(p,x+sx*.4,top*.42,.13,.1,B,null,lt);qPath(p,[[x+sx*.4,top*.42],[x+sx,.04]],.13,.15,B,null,lt);qE(p,x+sx,.06,.16,.06,B,null,lt);for(const t of[-.09,0,.09])qPx(p,x+sx+t,.02,hex('#c8c0b0'));};
  leg(.55,-sw);leg(1.75,sw);
  qPath(p,[[.25,1.3],[.12,1.1],[.12,.9]],.03,.02,B);qE(p,.12,.85,.03,.06,QP.zb);
  qE(p,1.15,1.15,.95,.55,B,fold);qE(p,1.75,1.3,.4,.45,B,fold);
  const hx=atk?2.3:eat?2.35:2.3,hy=atk?.75:eat?.45:.95;
  qPath(p,[[1.95,1.3],[hx-.15,hy+.15]],.33,.28,B);qE(p,hx,hy,.32,.24,B);qE(p,hx+.32,hy-.06,.17,.16,B);
  qPath(p,[[hx+.38,hy+.08],[hx+.48,hy+.35],[hx+.42,hy+.62]],.08,.01,QP.ho);qPath(p,[[hx+.18,hy+.18],[hx+.22,hy+.32]],.05,.01,QP.ho);
  qPath(p,[[hx-.2,hy+.22],[hx-.26,hy+.42]],.05,.03,B);qEye(p,hx+.02,hy+.06);
  leg(.75,sw);leg(1.95,-sw);
  outline(p);return p.done();}
/* ---------- Nilpferd ---------- */
function qHippo(f){const p=qCanvas(2.75,1.6),sw=qSw(f),atk=f==='a',B=QP.hi,Pk=QP.hip;
  const belly=(x,y,L)=>y>p.Y(.62)?Pk[shadeIdx(L,3,x,y)]:null;const top=.42;
  let nL=0;const leg=(x,s)=>{const sx=s*.08,lt=++nL<=2?.36:.6;qPath(p,[[x,top+.3],[x+sx,.06]],.2,.16,B,null,lt);qE(p,x+sx,.07,.18,.07,B,null,lt);for(const t of[-.1,0,.1])qPx(p,x+sx+t,.02,hex('#d8b0b8'));};
  leg(.55,-sw);leg(1.6,sw);qPath(p,[[.18,1.0],[.08,.85]],.04,.03,B);
  qE(p,1.15,.92,1.02,.5,B,belly);qE(p,.75,1.05,.6,.42,B,belly);qE(p,1.55,1.0,.5,.45,B,belly);
  const hx=2.15,hy=atk?1.15:.95;
  if(atk){qE(p,hx+.15,hy+.2,.35,.22,B);qE(p,hx+.2,hy-.25,.35,.2,B,belly);for(let i=0;i<4;i++)qPx(p,hx+.05+i*.1,hy-.02,QC.wh);qE(p,hx+.25,hy,.25,.12,QP.hip);}
  else{qE(p,hx,hy+.08,.36,.3,B);qE(p,hx+.32,hy-.05,.25,.25,B,belly);}
  qE(p,hx-.12,hy+.36,.06,.06,B);qE(p,hx+.12,hy+.36,.05,.05,B);qEye(p,hx+.05,hy+.28);qPx(p,hx+.5,hy+.05,QC.nose);
  leg(.8,sw);leg(1.85,-sw);
  outline(p);return p.done();}
/* ---------- Löwe / Löwin ---------- */
function qLion(f,male){const p=qCanvas(2.6,male?1.45:1.25),sw=qSw(f),lie=f==='l',atk=f==='a',B=QP.li,M=QP.lim,dy=lie?-.48:atk?-.12:0;
  const belly=(x,y,L)=>y>p.Y(.68+dy)?B[shadeIdx(L+.25,B.length,x,y)]:null;const top=.62;
  if(lie){qLeg(p,'back',.55,.22,.07,B,0,{fold:.1,paw:1});qLeg(p,'front',1.45,.22,.06,B,0,{fold:.06,paw:1});}
  else{qLeg(p,'back',.55,top,.08,B,-sw,{paw:1});qLeg(p,'front',1.45,top+(atk?.1:0),.07,B,atk?1:sw,{paw:1});}
  qPath(p,[[.3,.95+dy],[.05,.8+dy],[-.05,.55+dy],[.0,.4+dy]],.035,.025,B);qE(p,.02,.36+dy,.05,.07,M);
  qE(p,.6,.88+dy,.38,.25,B,belly);qE(p,1.05,.88+dy,.45,.24,B,belly);qE(p,1.4,.95+dy,.3,.28,B,belly);
  const hx=atk?1.85:1.82,hy=(lie?1.0:1.15)+dy+(atk?.0:0);
  if(male){qE(p,hx-.12,hy-.02,.36,.4,M,(x,y,L)=>M[shadeIdx(L+(hash2(x>>1,y,63)-.5)*.5,M.length,x,y)]);qPath(p,[[hx-.3,hy-.3],[hx-.05,hy-.55]],.18,.1,M);}
  qE(p,hx,hy,.2,.18,B);qE(p,hx+.18,hy-.07,.12,.1,B);qE(p,hx+.2,hy-.12,.09,.06,QP.chw);qPx(p,hx+.28,hy-.06,QC.nose);
  if(!male)for(const ex of[-.08,.04])qE(p,hx+ex,hy+.17,.045,.045,B);
  if(atk){qE(p,hx+.2,hy-.2,.09,.06,QC.red?pal(['#5a1a14','#8a2a1a']):B);qPx(p,hx+.22,hy-.15,QC.wh);qPx(p,hx+.16,hy-.15,QC.wh);}
  qEye(p,hx+.08,hy+.04);
  if(!lie){qLeg(p,'back',.68,top,.085,B,sw,{paw:1});qLeg(p,'front',1.58,top+(atk?.1:0),.075,B,atk?-.4:-sw,{paw:1});}else qLeg(p,'front',1.55,.2,.07,B,0,{fold:.04,paw:1});
  outline(p);return p.done();}
/* ---------- Hyäne ---------- */
function qHyena(f){const p=qCanvas(1.9,1.05),sw=qSw(f),lie=f==='l',atk=f==='a',B=QP.hy,dy=lie?-.42:0;
  const spots=(x,y,L)=>hash2(x>>2,y>>2,64)<.28&&((x+y)&1)?QP.wh[1]:null;
  if(lie){qLeg(p,'back',.4,.2,.05,B,0,{fold:.08,paw:1});qLeg(p,'front',1.15,.2,.05,B,0,{fold:.06,paw:1});}
  else{qLeg(p,'back',.4,.48,.06,B,-sw,{paw:1,f:spots});qLeg(p,'front',1.12,.6,.06,B,sw,{paw:1,f:spots});}
  qPath(p,[[.22,.66+dy],[.12,.5+dy]],.03,.04,QP.wh);
  qE(p,.45,.66+dy,.25,.2,B,spots);qE(p,.8,.73+dy,.32,.24,B,spots);qE(p,1.1,.8+dy,.22,.26,B,spots);
  for(let k=0;k<8;k++)qE(p,.6+k*.08,.94+dy+k*.012,.03,.05,QP.wh);
  const hx=atk?1.45:1.42,hy=(atk?.72:.9)+dy;qPath(p,[[1.15,.88+dy],[hx-.08,hy+.04]],.13,.1,B,spots);
  qE(p,hx,hy,.14,.13,B);qE(p,hx+.15,hy-.06,.09,.07,QP.wh);qPx(p,hx+.23,hy-.06,QC.nose);
  for(const ex of[-.08,.0])qE(p,hx+ex,hy+.14,.05,.06,B,(x,y,L)=>QP.wh[shadeIdx(L,4,x,y)]);
  if(atk){qPath(p,[[hx+.08,hy-.12],[hx+.22,hy-.18]],.02,.02,pal(['#5a1a14','#8a2a1a']));qPx(p,hx+.2,hy-.1,QC.wh);}
  qEye(p,hx+.04,hy+.03);
  if(!lie){qLeg(p,'back',.52,.48,.065,B,sw,{paw:1,f:spots});qLeg(p,'front',1.22,.6,.065,B,-sw,{paw:1,f:spots});}
  outline(p);return p.done();}
/* ---------- Gnu ---------- */
function qGnu(f){const p=qCanvas(2.3,1.5),sw=qSw(f),lie=f==='l',eat=f==='e',B=QP.gn,M=QP.gnm,dy=lie?-.5:0;
  const bars=(x,y,L)=>x>p.X(1.0)&&x<p.X(1.55)&&((x+(y>>2))%4===0)?M[0]:null;const top=.7;
  if(lie){qLeg(p,'back',.45,.25,.06,B,0,{fold:.1});qLeg(p,'front',1.35,.25,.055,B,0,{fold:.1});}
  else{qLeg(p,'back',.45,top,.065,B,-sw);qLeg(p,'front',1.35,top+.08,.06,B,sw);}
  qPath(p,[[.22,1.05+dy],[.1,.8+dy]],.03,.04,M);
  qE(p,.5,.98+dy,.3,.27,B);qE(p,.9,1.0+dy,.42,.3,B,bars);qE(p,1.32,1.1+dy,.32,.36,B,bars);
  for(let k=0;k<9;k++){const t=k/8;qE(p,1.15+t*.45,1.35+dy+t*(eat?-.05:.1),.03,.07,M);}
  const hx=eat?1.9:1.85,hy=eat?.3:1.25+dy;
  qPath(p,eat?[[1.45,1.1+dy],[1.7,.75],[1.85,.4]]:[[1.45,1.15+dy],[1.65,1.25+dy],[1.78,1.28+dy]],.17,.12,B,bars);
  qE(p,hx,hy,.13,.12,B);qPath(p,eat?[[hx,hy],[hx+.06,hy-.25]]:[[hx,hy],[hx+.2,hy-.22]],.1,.075,M);
  qPath(p,eat?[[hx-.1,hy-.1],[hx-.12,hy-.25]]:[[hx-.05,hy-.1],[hx-.08,hy-.32]],.05,.02,M);
  qPath(p,[[hx-.05,hy+.08],[hx-.2,hy+.12],[hx-.22,hy+.25],[hx-.12,hy+.28]],.03,.015,QP.ho);qPath(p,[[hx+.03,hy+.08],[hx+.16,hy+.12],[hx+.18,hy+.24],[hx+.1,hy+.28]],.03,.015,QP.ho);
  qEye(p,hx+.03,hy+.02);
  if(!lie){qLeg(p,'back',.57,top,.07,B,sw);qLeg(p,'front',1.46,top+.08,.065,B,-sw);}
  outline(p);return p.done();}
/* ---------- Kaffernbüffel ---------- */
function qBuffalo(f){const p=qCanvas(2.6,1.62),sw=qSw(f),eat=f==='e',atk=f==='a',B=QP.bf;const top=.68;
  qLeg(p,'back',.5,top,.1,B,-sw);qLeg(p,'front',1.6,top,.1,B,atk?.6:sw);
  qPath(p,[[.22,1.2],[.12,.95],[.12,.7]],.03,.02,B);qE(p,.12,.64,.04,.08,QP.zb);
  qE(p,.65,1.05,.45,.38,B);qE(p,1.15,1.08,.55,.42,B);qE(p,1.6,1.12,.38,.46,B);
  const hx=atk?2.05:eat?2.05:2.0,hy=atk?.75:eat?.4:.95;
  qPath(p,[[1.75,1.2],[hx-.1,hy+.1]],.3,.22,B);qE(p,hx,hy,.2,.2,B);qPath(p,[[hx+.05,hy-.05],[hx+.22,hy-.2]],.12,.09,B);qPx(p,hx+.28,hy-.22,QC.nose);
  qE(p,hx-.02,hy+.2,.17,.07,QP.ho);qPath(p,[[hx-.12,hy+.2],[hx-.32,hy+.08],[hx-.36,hy-.05],[hx-.26,hy+.02]],.06,.02,QP.ho);qPath(p,[[hx+.1,hy+.2],[hx+.3,hy+.12],[hx+.35,hy+.0],[hx+.28,hy+.04]],.05,.02,QP.ho);
  qEye(p,hx+.05,hy+.05);qLeg(p,'back',.62,top,.11,B,sw);qLeg(p,'front',1.72,top,.11,B,atk?-.3:-sw);
  outline(p);return p.done();}
/* ---------- Warzenschwein ---------- */
function qWarthog(f){const p=qCanvas(1.6,.95),sw=qSw(f),eat=f==='e',B=QP.wh;const top=.32;
  qLeg(p,'back',.32,top,.045,B,-sw);qLeg(p,'front',1.0,top,.045,B,sw);
  qPath(p,[[.2,.55],[.12,.72],[.1,.88]],.015,.012,B);qE(p,.1,.9,.03,.05,QP.zb);
  qE(p,.6,.52,.42,.24,B);qE(p,.98,.55,.22,.26,B);
  for(let k=0;k<10;k++)qE(p,.45+k*.06,.78-k*.005,.025,.05,QP.zb);
  const hx=eat?1.28:1.25,hy=eat?.22:.48;qE(p,hx,hy,.2,.17,B);qPath(p,[[hx+.08,hy-.02],[hx+.25,hy-.1]],.09,.075,B);qE(p,hx+.27,hy-.1,.05,.06,QP.wh);
  qPath(p,[[hx+.14,hy-.05],[hx+.22,hy+.08],[hx+.18,hy+.16]],.025,.01,QP.gzw);qE(p,hx+.05,hy-.02,.04,.04,B);
  for(const ex of[-.12,-.04])qPath(p,[[hx+ex,hy+.14],[hx+ex-.06,hy+.22]],.03,.015,B);qEye(p,hx,hy+.06);
  qLeg(p,'back',.42,top,.05,B,sw);qLeg(p,'front',1.1,top,.05,B,-sw);
  outline(p);return p.done();}
/* ---------- Gepard ---------- */
function qCheetah(f){const p=qCanvas(2.3,1.05),sw=qSw(f),lie=f==='l',atk=f==='a',B=QP.ch,W=QP.chw,dy=lie?-.48:atk?-.1:0;
  const dots=(x,y,L)=>hash2(x,y,65)<.16&&hash2(x+1,y,65)>=.16&&hash2(x,y+1,65)>=.16?QC.bk:null;const spots=(x,y,L)=>{if(y>p.Y(.62+dy))return W[shadeIdx(L+.2,3,x,y)];return dots(x,y,L);};const top=.6;
  if(lie){qLeg(p,'back',.5,.2,.05,B,0,{fold:.08,paw:1});qLeg(p,'front',1.3,.2,.045,B,0,{fold:.05,paw:1});}
  else{qLeg(p,'back',.5,top,.06,B,atk?-1.2:-sw,{paw:1,f:dots});qLeg(p,'front',1.3,top,.05,B,atk?1.3:sw,{paw:1,f:dots});}
  qPath(p,[[.3,.82+dy],[.05,.65+dy],[-.05,.45+dy],[.0,.3+dy]],.035,.025,B,(x,y,L,t)=>t>.6&&((y>>1)%2)?QC.bk:null);
  qE(p,.6,.78+dy,.32,.19,B,spots);qE(p,.98,.76+dy,.36,.17,B,spots);qE(p,1.3,.84+dy,.24,.24,B,spots);
  const hx=1.67,hy=(lie?.95:atk?.8:.98)+dy;qPath(p,[[1.4,.92+dy],[hx-.08,hy-.02]],.1,.08,B,spots);
  qE(p,hx,hy,.12,.1,B);qE(p,hx+.1,hy-.04,.07,.06,B);qPx(p,hx+.16,hy-.04,QC.nose);
  qPath(p,[[hx+.05,hy+.02],[hx+.08,hy-.08]],.012,.012,QP.zb);for(const ex of[-.06,.02])qE(p,hx+ex,hy+.1,.03,.03,B);qEye(p,hx+.04,hy+.03);
  if(!lie){qLeg(p,'back',.62,top,.065,B,atk?.9:sw,{paw:1,f:dots});qLeg(p,'front',1.42,top,.055,B,atk?-.6:-sw,{paw:1,f:dots});}
  outline(p);return p.done();}
/* ---------- Wildhund ---------- */
function qWilddog(f){const p=qCanvas(1.6,.92),sw=qSw(f),lie=f==='l',atk=f==='a',B=QP.wd,dy=lie?-.38:0;
  const patch=(x,y,L)=>{const h=vnoise(x*.7,y*.7,66)*.7+vnoise(x*1.6,y*1.6,67)*.3;return h<.36?QC.bk:h>.64?QP.gzw[shadeIdx(L,3,x,y)]:null;};const top=.42;
  if(lie){qLeg(p,'back',.35,.18,.04,B,0,{fold:.07,paw:1});qLeg(p,'front',.95,.18,.04,B,0,{fold:.05,paw:1});}
  else{qLeg(p,'back',.35,top,.045,B,-sw,{paw:1,f:patch});qLeg(p,'front',.95,top,.04,B,sw,{paw:1,f:patch});}
  qPath(p,[[.2,.62+dy],[.08,.52+dy],[.05,.38+dy]],.035,.04,B);qPath(p,[[.05,.38+dy],[.04,.28+dy]],.04,.02,QP.gzw);
  qE(p,.42,.58+dy,.26,.14,B,patch);qE(p,.66,.58+dy,.22,.13,B,patch);qE(p,.86,.61+dy,.2,.16,B,patch);
  const hx=1.18,hy=(atk?.6:.75)+dy;qPath(p,[[.95,.66+dy],[hx-.08,hy]],.08,.07,B,patch);
  qE(p,hx,hy,.1,.09,B,patch);qPath(p,[[hx+.05,hy-.03],[hx+.17,hy-.06]],.05,.04,QC.bk?pal(['#100e0c','#24201c']):B);
  for(const ex of[-.08,.02]){qE(p,hx+ex,hy+.15,.06,.08,B);qE(p,hx+ex,hy+.15,.03,.05,QP.zb);}qEye(p,hx+.03,hy+.02);
  if(atk)qPx(p,hx+.15,hy-.1,QC.wh);
  if(!lie){qLeg(p,'back',.45,top,.045,B,sw,{paw:1,f:patch});qLeg(p,'front',1.03,top,.04,B,-sw,{paw:1,f:patch});}
  outline(p);return p.done();}
/* ---------- Strauß ---------- */
function qOstrich(f){const p=qCanvas(1.5,2.45),sw=qSw(f),eat=f==='e',B=QP.os,W=QP.osw,Pk=QP.osp;
  const leg=(x,s,dark)=>{qPath(p,[[x,1.2],[x+.08+s*.12,.65],[x-.02+s*.25,.05]],.06,.03,dark?pal(['#6a4a44','#8a6a62','#a8867a']):Pk);qPath(p,[[x-.02+s*.25,.05],[x+.12+s*.25,.02]],.025,.02,Pk);};
  leg(.62,-sw,1);
  qE(p,.6,1.4,.45,.32,B);qE(p,.25,1.48,.2,.18,W);qE(p,.85,1.48,.25,.12,W);qE(p,.35,1.6,.15,.1,W);
  const nk=eat?[[.95,1.45],[1.15,1.0],[1.25,.5],[1.28,.15]]:[[.95,1.5],[1.05,1.85],[1.1,2.15],[1.12,2.33]];qPath(p,nk,.06,.035,Pk);
  const h=nk[nk.length-1];qE(p,h[0],h[1],.07,.06,Pk);qPath(p,[[h[0],h[1]],[h[0]+.12,h[1]-.02]],.03,.02,pal(['#8a6a40','#b08a58']));qEye(p,h[0]+.01,h[1]+.02);
  leg(.75,sw,0);outline(p);return p.done();}
/* ---------- Geier ---------- */
function qVulture(f){const W=f==='0'||f===0,U=f===1||f==='1';if(W||U){const p=qCanvas(2.2,.9),B=QP.vu;const wy=U?.7:.25;
    for(const s of[-1,1]){qPath(p,[[1.1,.45],[1.1+s*.5,wy+.05],[1.1+s*.95,wy]],.12,.06,B);for(let k=0;k<5;k++)qPath(p,[[1.1+s*(.7+k*.06),wy],[1.1+s*(.75+k*.06),wy-.12]],.02,.01,QP.vu);}
    qE(p,1.1,.45,.2,.13,B);qE(p,1.1,.55,.08,.06,QP.vuh);qE(p,1.1,.5,.1,.05,QP.gzw);outline(p);return p.done();}
  const p=qCanvas(.9,1.0),B=QP.vu,eat=f==='e';qPath(p,[[.32,.05],[.35,.25]],.02,.02,QP.zb);qPath(p,[[.48,.05],[.46,.25]],.02,.02,QP.zb);
  qE(p,.4,.5,.24,.3,B);qPath(p,[[.2,.4],[.05,.2]],.08,.03,B);
  const hx=eat?.7:.62,hy=eat?.42:.85;qE(p,.55,.72,.12,.07,QP.gzw);qPath(p,[[.55,.72],[hx,hy]],.04,.035,QP.vuh);qE(p,hx,hy,.07,.06,QP.vuh);
  qPath(p,[[hx+.04,hy],[hx+.12,hy-.05]],.025,.012,pal(['#3a3028','#6a5a48']));qEye(p,hx,hy+.02);outline(p);return p.done();}
/* ---------- Erdmännchen ---------- */
function qMeerkat(f){if(f==='0'||f===0){const p=qCanvas(.4,.48),B=QP.mk;qE(p,.2,.2,.08,.17,B);qE(p,.2,.36,.06,.06,B);qE(p,.24,.34,.04,.03,B);
    qE(p,.18,.36,.025,.02,QP.zb);qEye(p,.21,.37);qPath(p,[[.13,.12],[.05,.02]],.025,.015,B);qPath(p,[[.22,.25],[.27,.2]],.02,.015,B);qPath(p,[[.17,.03],[.22,.03]],.02,.02,B);outline(p);return p.done();}
  const p=qCanvas(.6,.25),B=QP.mk,sw=f==='w1'?1:-1;qLeg(p,'back',.2,.1,.025,B,sw,{paw:1});qLeg(p,'front',.38,.1,.022,B,-sw,{paw:1});
  qPath(p,[[.12,.14],[.0,.1]],.025,.012,B);qE(p,.27,.14,.16,.06,B);qE(p,.45,.16,.06,.05,B);qPx(p,.5,.15,QC.nose);qEye(p,.46,.17);outline(p);return p.done();}
/* ---------- Pavian ---------- */
function qBaboon(f){const p=qCanvas(1.2,.8),sw=qSw(f),B=QP.bb;const top=.36;
  qLeg(p,'back',.3,top,.045,B,-sw,{paw:1});qLeg(p,'front',.8,top+.08,.04,B,sw,{paw:1});
  qPath(p,[[.22,.56],[.14,.7],[.06,.66],[.02,.5],[.02,.38]],.035,.025,B);qE(p,.24,.5,.06,.05,QP.hip);
  qE(p,.42,.5,.2,.14,B);qE(p,.66,.58,.2,.18,B);const MN=pal(['#5e5838','#7a7448','#958e5c','#b0a874']);qE(p,.74,.66,.16,.15,MN);
  const hx=.9,hy=.6;qE(p,hx,hy,.1,.09,MN);qPath(p,[[hx+.03,hy-.01],[hx+.2,hy-.07]],.06,.045,pal(['#3a2a2a','#5a4040','#704e4e']));qPx(p,hx+.2,hy-.07,QC.nose);qEye(p,hx+.04,hy+.03);
  qLeg(p,'back',.4,top,.05,B,sw,{paw:1});qLeg(p,'front',.88,top+.08,.045,B,-sw,{paw:1});outline(p);return p.done();}
/* ---------- Affe (Dschungel) ---------- */
function qMonkey(f){if(f==='c'){const p=qCanvas(.6,.75),B=QP.mo;qE(p,.3,.4,.12,.18,B);qE(p,.3,.62,.09,.08,B);qE(p,.33,.6,.05,.04,QP.osp);qEye(p,.32,.64);
    qPath(p,[[.2,.5],[.1,.68]],.03,.025,B);qPath(p,[[.4,.5],[.5,.7]],.03,.025,B);qPath(p,[[.22,.28],[.12,.12]],.03,.025,B);qPath(p,[[.38,.28],[.48,.12]],.03,.025,B);qPath(p,[[.3,.22],[.28,.05],[.35,.0]],.02,.015,B);outline(p);return p.done();}
  const p=qCanvas(.9,.6),sw=qSw(f),B=QP.mo;qLeg(p,'back',.25,.22,.03,B,-sw,{paw:1});qLeg(p,'front',.55,.25,.028,B,sw,{paw:1});
  qPath(p,[[.15,.35],[.02,.45],[.0,.55],[.08,.58]],.022,.015,B);qE(p,.38,.33,.17,.1,B);qE(p,.62,.42,.08,.08,B);qE(p,.66,.4,.05,.04,QP.osp);qEye(p,.64,.44);
  qLeg(p,'back',.32,.22,.032,B,sw,{paw:1});qLeg(p,'front',.6,.25,.03,B,-sw,{paw:1});outline(p);return p.done();}

const QDRAW={zebra:qZebra,gazelle:qGazelle,giraffe:qGiraffe,elephant:qElephant,rhino:qRhino,hippo:qHippo,lion:f=>qLion(f,true),lioness:f=>qLion(f,false),hyena:qHyena,
  gnu:qGnu,buffalo:qBuffalo,warthog:qWarthog,cheetah:qCheetah,wilddog:qWilddog,ostrich:qOstrich,vulture:qVulture,meerkat:qMeerkat,baboon:qBaboon,monkey:qMonkey};
{const a=wildDraw;wildDraw=function(t,f){const d=QDRAW[t];if(d){try{return d(f);}catch(e){console.error('Tierbild',t,f,e);}}return a(t,f);};}
