/* =========================================================
   0.0.129 · Die Turm-Ebenen bekommen eigene Orte und eigene Karten
   - Jede Ebene liegt jetzt an einem eigenen Ort weit weg von der Welt (nicht mehr unter der Stadt).
     Dort gelten keine Wasser-Regeln mehr: Sprinten, Springen und volles Tempo funktionieren normal.
   - Jede Ebene hat eine eigene Karte (Minikarte und große Karte mit M), die sich beim Erkunden aufdeckt.
   - Spielstände, die in einer Ebene gespeichert wurden, starten wieder vor dem Turmtor.
   ========================================================= */
const LV_BASE=90000,LV_GAP=3000;
function lvOrigin(lvl){return{x:LV_BASE+lvl*LV_GAP,z:0};}
// Kein Höhlenfels außerhalb der echten Höhlen (sonst würden Pfeile sofort in "Fels" stecken)
{const a=caveSolid;caveSolid=function(x,z){if(x>CAVE_X0+CAVE_COUNT*CAVE_SP+300)return false;return a(x,z);};}
// Spielstand in einer Ebene gespeichert (oder noch alt unter der Stadt): vor dem Turmtor aufwachen
function lvSafeStart(){if(DGX.on)return;const old=Math.hypot(P.x-TWC.x,P.z-TWC.z)<TWC.R+260&&P.y<DG_Y+60;if(P.x>LV_BASE-2000||old){P.x=TWC.x+TWC.R+9;P.z=TWC.z;P.y=getHeight(P.x,P.z)+.1;P.vx=P.vy=P.vz=0;P.safe=[P.x,P.z];}}
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);try{lvSafeStart();}catch(e){}return r;};}
// =========================================================
// Karte der Ebene
// =========================================================
const LVM={on:false,lvl:0,cell:2,gw:0,ox:0,oz:0,W:0,base:null,vis:null,vctx:null,seen:null,revT:0,miniT:0,outdoor:false,dirty:false};
function lvSeenLoad(lvl,n){/* lvl ist der Schlüssel */const S=new Uint8Array(n),src=(FLAGS.lvSeen||{})[lvl];if(src)try{const b=atob(src);for(let i=0;i<n&&i<b.length*8;i++)S[i]=(b.charCodeAt(i>>3)>>(i&7))&1;}catch(e){}return S;}
function lvSeenSave(){if(!LVM.on||!LVM.seen)return;const n=LVM.seen.length,B=new Uint8Array((n+7)>>3);for(let i=0;i<n;i++)if(LVM.seen[i])B[i>>3]|=1<<(i&7);let s='';for(let i=0;i<B.length;i++)s+=String.fromCharCode(B[i]);(FLAGS.lvSeen=FLAGS.lvSeen||{})[LVM.key!=null?LVM.key:LVM.lvl]=btoa(s);}
function lvMapBuild(lvl){const d=DGX.d;if(!d)return;const cell=2,W=d.W,gw=Math.ceil(W/cell),base=document.createElement('canvas');base.width=base.height=gw;const c=base.getContext('2d'),im=c.createImageData(gw,gw),D=im.data;
  const put=(i,j,r,g,b)=>{const k=(j*gw+i)*4;D[k]=r;D[k+1]=g;D[k+2]=b;D[k+3]=255;};const outdoor=!!(PZ.on&&lvl===3);
  if(!outdoor&&CV.on){const N=CV.N,tint=lvl===2?[150,128,96]:[128,138,150],moss=[96,128,70];
    for(let j=0;j<gw;j++)for(let i=0;i<gw;i++){const x=d.ox+i*cell+1,z=d.oz+j*cell+1,k=cvIdx(x,z);if(k<0||!CV.open[k]){const n=hash2(i,j,77)*10;put(i,j,22+n,20+n,18+n);continue;}
      const h=CV.fy[k]||0,L=clamp(.62+h*.018,.45,1.25),dd=Math.min(CV.d?CV.d[k]:3,3)/3,e=.75+.25*dd,T=(lvl===2&&Math.hypot(x-TWL_O.x,z-TWL_O.z)<60)?moss:tint;put(i,j,T[0]*L*e,T[1]*L*e,T[2]*L*e);}}
  else if(outdoor){const WY=PZ.water!=null?PZ.water:DG_Y;
    for(let j=0;j<gw;j++)for(let i=0;i<gw;i++){const x=d.ox+i*cell+1,z=d.oz+j*cell+1,lx=x-PZ.X,lz=z-PZ.Z;if(Math.hypot(lx,lz)>PZD.R){put(i,j,18,22,30);continue;}const h=pzT(x,z);if(h==null){put(i,j,18,22,30);continue;}
      if(h<WY+.05){const q=clamp((WY-h)/2.5,0,1);put(i,j,60-q*24,110-q*30,150-q*20);continue;}const r=h-DG_Y,n=(hash2(i,j,91)-.5)*10;
      if(r>16){const q=clamp((r-16)/18,0,1);put(i,j,112+q*60+n,104+q*60+n,92+q*60+n);}else put(i,j,64+r*2.2+n,112+r*2+n,52+r+n);}
    c.putImageData(im,0,0);const line=(L,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();L.forEach(([x,z],n)=>{const X=(PZ.X+x-d.ox)/cell,Z=(PZ.Z+z-d.oz)/cell;n?c.lineTo(X,Z):c.moveTo(X,Z);});c.stroke();};
    line(PZD.R1,'rgb(70,120,160)',2);line(PZD.R2,'rgb(70,120,160)',2);line(PZD.A,'rgb(170,146,100)',1.5);line(PZD.B,'rgb(170,146,100)',1.5);
    const V={x:(PZ.X+PZD.V.x-d.ox)/cell,z:(PZ.Z+PZD.V.z-d.oz)/cell};c.fillStyle='rgb(150,70,60)';for(let k=0;k<5;k++){const a=k/5*6.283;c.fillRect(Math.round(V.x+Math.cos(a)*6)-2,Math.round(V.z+Math.sin(a)*6)-2,4,4);}}
  if(!outdoor)c.putImageData(im,0,0);
  const vis=document.createElement('canvas');vis.width=vis.height=gw;const vctx=vis.getContext('2d');
  Object.assign(LVM,{on:true,lvl,key:lvl,dg:0,title:'Ebene '+lvl+': '+TOWER_LEVELS[lvl-1].n,cell,gw,ox:d.ox,oz:d.oz,W,base,vis,vctx,seen:lvSeenLoad(lvl,gw*gw),outdoor,revT:0,miniT:0});
  // schon erkundete Teile sofort zeigen
  const bc=base.getContext('2d').getImageData(0,0,gw,gw),vi=vctx.createImageData(gw,gw);for(let i=0;i<gw*gw;i++)if(LVM.seen[i]){for(let q=0;q<4;q++)vi.data[i*4+q]=bc.data[i*4+q];}vctx.putImageData(vi,0,0);LVM.bdata=bc.data;}
function lvReveal(){if(!LVM.on)return;if(LVM.dg)return lvRevealDG();const R=LVM.outdoor?46:15,cell=LVM.cell,ci=(P.x-LVM.ox)/cell,cj=(P.z-LVM.oz)/cell,r=R/cell,gw=LVM.gw;let any=false;
  if(!LVM.outdoor&&!(P.y<DG_Y+60))return;if(LVM.outdoor&&P.y<DG_Y-30)return;
  const i0=Math.max(0,Math.floor(ci-r)),i1=Math.min(gw-1,Math.ceil(ci+r)),j0=Math.max(0,Math.floor(cj-r)),j1=Math.min(gw-1,Math.ceil(cj+r));let im=null;
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*gw+i;if(LVM.seen[k])continue;if((i-ci)**2+(j-cj)**2>r*r)continue;
    if(!LVM.outdoor&&CV.on&&typeof cvLOS==='function'){const x=LVM.ox+i*cell+1,z=LVM.oz+j*cell+1,kk=cvIdx(x,z);if(kk>=0&&CV.open[kk]&&!cvLOS(P.x,P.z,x,z,.15))continue;}
    LVM.seen[k]=1;any=true;if(!im)im=LVM.vctx.getImageData(0,0,gw,gw);for(let q=0;q<4;q++)im.data[k*4+q]=LVM.bdata[k*4+q];}
  if(im)LVM.vctx.putImageData(im,0,0);if(any)LVM.dirty=true;}
function lvMapDraw(ctx,W,H,cx,cz,mpp,big){ctx.imageSmoothingEnabled=false;ctx.fillStyle='#0c0a08';ctx.fillRect(0,0,W,H);const s=LVM.cell/mpp,X0=W/2-(cx-LVM.ox)/mpp,Z0=H/2-(cz-LVM.oz)/mpp;
  ctx.drawImage(LVM.vis,X0,Z0,LVM.gw*s,LVM.gw*s);const sx=x=>W/2+(x-cx)/mpp,sz=z=>H/2+(z-cz)/mpp,seenAt=(x,z)=>{const i=Math.floor((x-LVM.ox)/LVM.cell),j=Math.floor((z-LVM.oz)/LVM.cell);return i>=0&&j>=0&&i<LVM.gw&&j<LVM.gw&&LVM.seen[j*LVM.gw+i];};
  const pin=(x,z,col,label)=>{if(!seenAt(x,z))return;const X=sx(x),Y=sz(z);ctx.fillStyle=col;ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y,big?6:4,0,6.283);ctx.fill();ctx.stroke();
    if(big&&label){ctx.font="13px 'Pixelify Sans',sans-serif";ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeText(label,X,Y-11);ctx.fillStyle='#f6e6b8';ctx.fillText(label,X,Y-11);}};
  if(DGX.exit)pin(DGX.exit.x,DGX.exit.z,'#6ad04a',LVM.dg?'Ausgang':LVM.lvl===1?'Aufzug':'Rückweg');if(LVM.dg)lvPinsDG(pin);
  try{if(typeof REMOTE!=='undefined'&&MP.on)for(const R of REMOTE.values()){if(time-R.seen>6||R.tx<LVM.ox||R.tz<LVM.oz||R.tx>LVM.ox+LVM.W||R.tz>LVM.oz+LVM.W)continue;ctx.fillStyle='#4aa0ff';ctx.strokeStyle='#000';ctx.beginPath();ctx.arc(sx(R.tx),sz(R.tz),big?5:3.5,0,6.283);ctx.fill();ctx.stroke();}}catch(e){}
  const T=DGX.tw;if(T&&T.up&&T.up.x>-1e6)pin(T.up.x,T.up.z,T.open?'#ffd84a':'#8a8a8a',T.open?'Weg nach oben':'Versiegelt');
  if(LVM.outdoor){pin(PZ.X+PZD.V.x,PZ.Z+PZD.V.z,'#e08a5a','Pilzdorf');if(PZD.E)pin(PZ.X+PZD.E.x,PZ.Z+PZD.E.z,'#6ac8ff','Höhle am Berg');}
  // Spieler als Pfeil in Blickrichtung
  const X=sx(P.x),Y=sz(P.z),a=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw)),k=big?1.4:1;ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle='#fff6d0';ctx.strokeStyle='#120a04';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(9*k,0);ctx.lineTo(-6*k,-6*k);ctx.lineTo(-3*k,0);ctx.lineTo(-6*k,6*k);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
function lvActive(){return!!(LVM.on&&DGX.on&&DGX.d&&(LVM.dg?(DGX.d.g&&DGX.d.g.id===LVM.gid):(DGX.d.tower&&DGX.d.lvl===LVM.lvl)));}
{const a=twlEnter;twlEnter=function(lvl){lvSeenSave();LVM.on=false;a(lvl);try{if(DGX.on&&DGX.d&&DGX.d.tower)lvMapBuild(lvl);}catch(e){console.error('Ebenenkarte',e);}};}
{const a=dgFree;dgFree=function(){lvSeenSave();LVM.on=false;return a();};}
{const a=saveGame;saveGame=function(){try{lvSeenSave();}catch(e){}return a.apply(this,arguments);};}
{const a=mapTick;mapTick=function(dt){const lv=lvActive();if(lv)mapMiniT=1e9;a(dt);if(!lv)return;LVM.revT-=dt;if(LVM.revT<=0){LVM.revT=.25;lvReveal();}
  const m=MAP.mini;if(!m||m.style.display==='none')return;LVM.miniT-=dt;if(LVM.miniT>0&&!LVM.dirty)return;LVM.miniT=1/15;LVM.dirty=false;
  const cv=m.querySelector('canvas');lvMapDraw(cv.getContext('2d'),cv.width,cv.height,P.x,P.z,LVM.outdoor?.9:.42,false);
  const key=keyName(settings.keys.map||'KeyM');m.querySelector('.lbl').textContent=(AREAS[curArea]||'Ebene '+LVM.lvl)+' · '+key+': Karte';};}
{const a=openMap;openMap=function(){a();if(lvActive()&&MAP.open){MAP.cx=LVM.ox+LVM.W/2;MAP.cz=LVM.oz+LVM.W/2;MAP.lvFit=1;}};}
{const a=mapBigDraw;mapBigDraw=function(){if(!MAP.open)return;if(!lvActive())return a();const cv=MAP.big.querySelector('canvas'),W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const fit=Math.max(LVM.W/(W-60),LVM.W/(H-80));if(MAP.lvFit){MAP.lvMpp=fit;MAP.lvFit=0;}const mpp=clamp(MAP.lvMpp||fit,.15,fit*1.2);
  MAP.cx=clamp(MAP.cx,LVM.ox,LVM.ox+LVM.W);MAP.cz=clamp(MAP.cz,LVM.oz,LVM.oz+LVM.W);lvMapDraw(cv.getContext('2d'),W,H,MAP.cx,MAP.cz,mpp,true);
  const c=cv.getContext('2d'),seen=LVM.seen.reduce((s,v)=>s+v,0),tot=LVM.dg?LVM.tot:LVM.outdoor?Math.round(LVM.gw*LVM.gw*.78):Math.max(1,(CV.open?CV.open.reduce((s,v)=>s+(v?1:0),0):1)/4);
  c.font="14px 'Pixelify Sans',sans-serif";c.textAlign='left';c.fillStyle='rgba(0,0,0,.6)';c.fillRect(8,H-30,330,24);c.fillStyle='#f6e6b8';
  c.fillText(`${LVM.title} · erkundet: ${Math.min(100,Math.round(seen/tot*100))} %`,14,H-13);requestAnimationFrame(mapBigDraw);};}
// Mausrad und Ziehen auf der großen Karte gelten in der Ebene für den eigenen Maßstab
addEventListener('wheel',e=>{if(!MAP.open||!lvActive())return;MAP.lvMpp=(MAP.lvMpp||1)*(e.deltaY>0?1.15:1/1.15);},{passive:true});
{const a=mapPopOpen;mapPopOpen=function(e,mark){if(lvActive())return;return a(e,mark);};}
