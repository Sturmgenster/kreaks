/* =========================================================
   KARTE
   - Mini-Map unter dem Spielerfenster: die Welt von oben, Norden ist oben
   - M (änderbar in den Einstellungen): große Karte zum Verschieben und Zoomen,
     mit eigenen Markierungen (Name und Farbe), Quest-Ziel, Orte, Mitspieler
   - Nur Gebiete, in denen du schon warst, sind aufgedeckt
   ========================================================= */
ACTIONS.push(['map','Karte']);DEFAULTS.keys.map='KeyM';if(settings.keys&&!settings.keys.map)settings.keys.map='KeyM';
const MAPC={forest:[54,100,42],plain:[108,152,64],coda:[150,138,96],deep:[32,72,44],coast:[176,166,112],storm:[96,104,94],stormgate:[110,108,104],jungle:[34,104,46],jvillage:[126,114,74],jruin:[106,104,84],jcave:[90,80,70],jtermite:[150,120,80],jmud:[110,90,60],
  desert:[216,190,124],dvillage:[196,166,114],tomb:[186,164,114],camp:[150,132,92],frogs:[72,112,62],redwood:[72,92,42],savanna:[186,172,92],steppe:[164,162,94],smtn:[134,124,104],kplain:[112,152,72],kaiser:[156,146,124],kpalace:[156,146,124],krice:[112,160,92],
  khafen:[150,140,120],kmarket:[156,146,124],karena:[156,146,124],kdlf:[150,140,120],bonge:[122,122,82],prock:[164,144,94],hyden:[104,142,72],in_realm:[70,24,22],in_castle:[60,40,40],in_throne:[60,40,40],
  wl_wald:[52,102,42],wl_ebene:[112,156,66],wl_nadelwald:[42,88,62],wl_redwood:[72,88,42],wl_wueste:[222,196,128],wl_dschungel:[32,106,46],wl_savanne:[188,172,92],wl_kueste:[188,178,122],wl_meer:[42,92,152],
  wl_insel:[122,162,82],wl_schnee:[226,232,238],wl_schneeberge:[202,206,216],wl_steinwueste:[162,142,112],wl_sumpf:[78,92,56],wl_candy:[240,172,204]};
const MAP_FOG=[38,30,22];
function mapArea(x,z){let a=null;try{a=areaAt(x,z);}catch(e){}return MAPC[a]||[100,140,70];}
// ---------- Kacheln (64 × 64 Bildpunkte, s Meter pro Punkt) ----------
const MAPT=64,MTILE=new Map();let MQUE=[];
function mapTile(s,tx,tz,make){const k=s+'|'+tx+'|'+tz;let t=MTILE.get(k);if(!t&&make){t={s,tx,tz,cv:null,img:null,row:0,done:false,used:0,hp:null,ac:null};MTILE.set(k,t);MQUE.push(t);}if(t)t.used=performance.now();return t;}
function mapGenRow(t){if(!t.cv){t.cv=document.createElement('canvas');t.cv.width=t.cv.height=MAPT;t.ctx=t.cv.getContext('2d');t.img=t.ctx.createImageData(MAPT,MAPT);t.hp=new Float32Array(MAPT+1);t.ac=[];}
  const s=t.s,r=t.row,z=(t.tz*MAPT+r+.5)*s,d=t.img.data,H=new Float32Array(MAPT+1);
  for(let c=-1;c<MAPT;c++){const x=(t.tx*MAPT+c+.5)*s;H[c+1]=getHeight(x,z);}
  if(r===0){const zp=z-s;for(let c=-1;c<MAPT;c++)t.hp[c+1]=getHeight((t.tx*MAPT+c+.5)*s,zp);}
  for(let c=0;c<MAPT;c++){const x=(t.tx*MAPT+c+.5)*s,h=H[c+1];let col;
    if(h<WATER-.15&&swimWater(x,z)){const k=Math.min(1,(WATER-h)/6);col=[46-k*22,98-k*44,156-k*40];if(hash2(x|0,z|0,71)<.06)col=[90,140,190];}
    else{if(!(c&1)||!t.ac[c>>1])t.ac[c>>1]=mapArea(x,z);const A=t.ac[c>>1];const sl=((t.hp[c+1]-h)+(H[c]-h))/s*.9;let L=1+Math.max(-.35,Math.min(.35,sl*.35))+(hash2(x|0,z|0,5)-.5)*.06;
      if(h>WATER+18)L+=.05;col=[A[0]*L,A[1]*L,A[2]*L];
      if(Math.abs(x)<=HALF+4&&z>=ZMIN&&z<=ZMAX){try{if(Math.abs(x-pathX(z))<1.7*Math.max(1,s*.6))col=[150,120,80];}catch(e){}}}
    const i=(r*MAPT+c)*4;d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];d[i+3]=255;}
  if((r&1)===1)t.ac=[];t.hp=H;t.row++;
  if(t.row>=MAPT){t.ctx.putImageData(t.img,0,0);mapDecor(t);t.done=true;t.img=null;t.hp=null;}}
// Bäume und Häuser auf die fertige Kachel
function mapDecor(t){const s=t.s,x0=t.tx*MAPT*s,z0=t.tz*MAPT*s,x1=x0+MAPT*s,z1=z0+MAPT*s,c=t.ctx;
  if(s<=4){c.fillStyle='rgba(18,44,20,.75)';for(const tr of trees){if(tr.x<x0||tr.x>=x1||tr.z<z0||tr.z>=z1)continue;const px=(tr.x-x0)/s,pz=(tr.z-z0)/s,r=Math.max(1,2.2/s);c.fillRect(px-r/2,pz-r/2,r,r);}}
  for(const b of VB){if(b.x<x0-20||b.x>x1+20||b.z<z0-20||b.z>z1+20||!b.w)continue;const P4=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,e])=>toW(b,a*b.w/2,e*b.d/2));
    c.beginPath();P4.forEach(([x,z],i)=>{const px=(x-x0)/s,pz=(z-z0)/s;if(i)c.lineTo(px,pz);else c.moveTo(px,pz);});c.closePath();c.fillStyle=b.type==='church'||b.type==='townhall'?'#8a7a6a':'#9a4a32';c.fill();c.strokeStyle='#2a160c';c.lineWidth=Math.max(.5,1/s);c.stroke();}}
function mapWork(ms){const t0=performance.now();
  while(MQUE.length&&performance.now()-t0<ms){const t=MQUE[MQUE.length-1];if(t.done||!MTILE.has(t.s+'|'+t.tx+'|'+t.tz)){MQUE.pop();continue;}
    if(performance.now()-t.used>3000){MQUE.pop();MTILE.delete(t.s+'|'+t.tx+'|'+t.tz);continue;}
    try{mapGenRow(t);}catch(e){console.error('Karte',e);t.done=true;}if(t.done)MQUE.pop();}
  if(MTILE.size>520){const L=[...MTILE.values()].filter(t=>t.done).sort((a,b)=>a.used-b.used);for(let i=0;i<L.length-420;i++)MTILE.delete(L[i].s+'|'+L[i].tx+'|'+L[i].tz);}}
// ---------- Aufgedeckte Gebiete (Zellen von 32 m) ----------
const MCELL=32;const mSeen=()=>(FLAGS.mapSeen=FLAGS.mapSeen||{});
const mKey=(i,j)=>i+','+j;
function mapReveal(){if(P.x>=60000)return;const S=mSeen(),R=96,i0=Math.floor((P.x-R)/MCELL),i1=Math.floor((P.x+R)/MCELL),j0=Math.floor((P.z-R)/MCELL),j1=Math.floor((P.z+R)/MCELL);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const cx=(i+.5)*MCELL,cz=(j+.5)*MCELL;if(Math.hypot(cx-P.x,cz-P.z)<R)S[mKey(i,j)]=1;}MAP.lastOut=[P.x,P.z];}
const MAP={open:false,cx:0,cz:0,mpp:3,drag:null,lastOut:null,mini:null,big:null,pop:null};
// ---------- Zeichnen (gemeinsam für Mini-Map und große Karte) ----------
function mapDraw(ctx,W,H,cx,cz,mpp,big){ctx.imageSmoothingEnabled=false;ctx.fillStyle=`rgb(${MAP_FOG})`;ctx.fillRect(0,0,W,H);
  let s=1;while(s<32&&s*1.5<mpp)s*=2;const x0=cx-W/2*mpp,z0=cz-H/2*mpp,x1=cx+W/2*mpp,z1=cz+H/2*mpp,ts=MAPT*s,S=mSeen();
  const sx=x=>(x-x0)/mpp,sz=z=>(z-z0)/mpp;
  // Kacheln, nur wo aufgedeckt
  for(let tx=Math.floor(x0/ts);tx<=Math.floor(x1/ts);tx++)for(let tz=Math.floor(z0/ts);tz<=Math.floor(z1/ts);tz++){
    const wx=tx*ts,wz=tz*ts;let any=false;for(let i=Math.floor(wx/MCELL);i<=Math.floor((wx+ts-1)/MCELL)&&!any;i++)for(let j=Math.floor(wz/MCELL);j<=Math.floor((wz+ts-1)/MCELL);j++)if(S[mKey(i,j)]){any=true;break;}
    if(!any)continue;let t=mapTile(s,tx,tz,true),ss=s;
    if(!t.done){t=null;for(let k=s*2;k<=32&&!t;k*=2){const q=mapTile(k,Math.floor(wx/(MAPT*k)),Math.floor(wz/(MAPT*k)),false);if(q&&q.done){t=q;ss=k;}}}
    if(!t||!t.done)continue;
    if(ss===s)ctx.drawImage(t.cv,sx(wx),sz(wz),ts/mpp+.5,ts/mpp+.5);
    else{const kx=(wx-t.tx*MAPT*ss)/ss,kz=(wz-t.tz*MAPT*ss)/ss,n=ts/ss;ctx.drawImage(t.cv,kx,kz,n,n,sx(wx),sz(wz),ts/mpp+.5,ts/mpp+.5);}}
  // Nebel über unbekannten Zellen
  const cs=MCELL/mpp;ctx.fillStyle=`rgb(${MAP_FOG})`;
  for(let i=Math.floor(x0/MCELL);i<=Math.floor(x1/MCELL);i++)for(let j=Math.floor(z0/MCELL);j<=Math.floor(z1/MCELL);j++)if(!S[mKey(i,j)])ctx.fillRect(Math.floor(sx(i*MCELL)),Math.floor(sz(j*MCELL)),Math.ceil(cs)+1,Math.ceil(cs)+1);
  if(big&&mpp<=8){ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1;const g=mpp<=2?50:200;for(let x=Math.ceil(x0/g)*g;x<x1;x+=g){ctx.beginPath();ctx.moveTo(sx(x),0);ctx.lineTo(sx(x),H);ctx.stroke();}for(let z=Math.ceil(z0/g)*g;z<z1;z+=g){ctx.beginPath();ctx.moveTo(0,sz(z));ctx.lineTo(W,sz(z));ctx.stroke();}}
  // Ortsnamen
  if(big){ctx.font=`${mpp>12?11:13}px 'Pixelify Sans',sans-serif`;ctx.textAlign='center';for(const k in TP){const T=TP[k];let p;try{p=T.p();}catch(e){continue;}if(!p||p[0]>=60000)continue;
      if(!S[mKey(Math.floor(p[0]/MCELL),Math.floor(p[1]/MCELL))])continue;const X=sx(p[0]),Y=sz(p[1]);if(X<-50||Y<-20||X>W+50||Y>H+20)continue;
      ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillText(T.n,X+1,Y+1);ctx.fillStyle='#f6e6b8';ctx.fillText(T.n,X,Y);}}
  const pinOut=(x,z,col,label)=>{let X=sx(x),Y=sz(z);const m=big?14:8,inside=X>=m&&Y>=m&&X<=W-m&&Y<=H-m;
    if(inside){mapPin(ctx,X,Y,col,big?1.2:.85);if(big&&label){ctx.font="12px 'Pixelify Sans',sans-serif";ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillText(label,X+1,Y+13);ctx.fillStyle='#fff';ctx.fillText(label,X,Y+12);}return;}
    const a=Math.atan2(Y-H/2,X-W/2),r=Math.min((W/2-m)/Math.abs(Math.cos(a)||1e-6),(H/2-m)/Math.abs(Math.sin(a)||1e-6));X=W/2+Math.cos(a)*r;Y=H/2+Math.sin(a)*r;
    ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle=col;ctx.strokeStyle='#120a04';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();};
  // Markierungen und Quest-Ziel
  for(const m of(FLAGS.mapMarks||[]))pinOut(m.x,m.z,m.c,m.n);
  try{const o=mqObjective();if(o&&o.at&&o.at[0]<60000)pinOut(o.at[0],o.at[1],'#ffd84a',big?'Ziel':null);}catch(e){}
  // Mitstreiter und Mitspieler
  const dot=(x,z,col,r)=>{const X=sx(x),Y=sz(z);if(X<0||Y<0||X>W||Y>H)return;ctx.fillStyle='#0a0604';ctx.fillRect(X-r-1,Y-r-1,r*2+2,r*2+2);ctx.fillStyle=col;ctx.fillRect(X-r,Y-r,r*2,r*2);};
  if(kreakE&&!kreakE.hidden&&!kreakE.dead&&kreakE.x<60000)dot(kreakE.x,kreakE.z,'#7ad04a',2);
  if(typeof mercEnts!=='undefined')for(const e of mercEnts)if(e&&e.hired&&!e.dead&&e.x<60000)dot(e.x,e.z,'#8ac8ff',1.6);
  if(typeof REMOTE!=='undefined'&&typeof MP!=='undefined'&&MP.on)for(const R of REMOTE.values()){if(time-R.seen>8||R.tx>60000)continue;dot(R.tx,R.tz,'#4aa0ff',2.5);if(big){const nm=MP.names&&MP.names[R.pid];if(nm){ctx.font="12px 'Pixelify Sans',sans-serif";ctx.fillStyle='#cfe6ff';ctx.textAlign='center';ctx.fillText(nm,sx(R.tx),sz(R.tz)-8);}}}
  // Spieler
  const pp=P.x<60000?[P.x,P.z]:(MAP.lastOut||[P.x,P.z]);const X=sx(pp[0]),Y=sz(pp[1]);
  ctx.save();ctx.translate(X,Y);ctx.rotate(Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw))+Math.PI/2);const k=big?1.3:1;
  ctx.fillStyle='#fff6d0';ctx.strokeStyle='#1a0e04';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-8*k);ctx.lineTo(5.5*k,6*k);ctx.lineTo(0,3*k);ctx.lineTo(-5.5*k,6*k);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();}
function mapPin(ctx,X,Y,col,k){ctx.save();ctx.translate(X,Y);ctx.scale(k,k);ctx.fillStyle=col;ctx.strokeStyle='#120a04';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-4.5,-8);ctx.arc(0,-10,5,Math.PI*.8,Math.PI*.2,false);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(-1.5,-12,3,3);ctx.restore();}
// ---------- Mini-Map unter dem Spielerfenster ----------
(function(){const st=document.createElement('style');st.textContent=`
#miniMap{position:absolute;width:200px;height:200px;padding:9px;box-sizing:border-box;background:#0c120e;box-shadow:inset 0 0 0 2px #060a07,inset 0 0 0 4px #b8862e,inset 0 0 0 5px #f2cf6b,inset 0 0 0 6px #6a4418,inset 0 0 0 8px #060a07,0 0 0 2px #060a07,0 5px 0 2px rgba(0,0,0,.35);pointer-events:none}
#miniMap canvas{width:100%;height:100%;image-rendering:pixelated;display:block}
#miniMap .cn{position:absolute;width:12px;height:12px;background:linear-gradient(135deg,#f6dc8a,#a8762e 60%,#6a4418);box-shadow:0 0 0 2px #060a07;transform:rotate(45deg)}
#miniMap .cn.tl{left:-5px;top:-5px}#miniMap .cn.tr{right:-5px;top:-5px}#miniMap .cn.bl{left:-5px;bottom:-5px}#miniMap .cn.br{right:-5px;bottom:-5px}
#miniMap .n{position:absolute;top:10px;left:50%;transform:translateX(-50%);font:700 11px 'Pixelify Sans',sans-serif;color:#f2cf6b;text-shadow:1px 1px 0 #000}
#miniMap .lbl{position:absolute;left:0;right:0;bottom:-21px;text-align:center;font:12px 'Pixelify Sans',sans-serif;color:#e8dcb8;text-shadow:1px 1px 0 #000;white-space:nowrap;overflow:hidden}
#bigMap{position:fixed;inset:0;z-index:30;background:#0c0806;display:flex;flex-direction:column}
#bigMap canvas{flex:1;width:100%;min-height:0;cursor:grab;image-rendering:pixelated}#bigMap canvas.drag{cursor:grabbing}
#bigMap .top{display:flex;align-items:center;gap:16px;padding:10px 18px;background:linear-gradient(#2a1c10,#160e08);border-bottom:3px solid #b8862e;color:#f2cf6b;font:20px 'Pixelify Sans',sans-serif}
#bigMap .top .h{flex:1;font-size:13px;color:#c8b890}#bigMap .top button{font:14px 'Pixelify Sans',sans-serif;background:#3a2814;color:#f6e6b8;border:2px solid #b8862e;padding:4px 10px;cursor:pointer}
#mapPop{position:fixed;z-index:31;background:#1e140c;border:2px solid #b8862e;padding:10px;display:flex;flex-direction:column;gap:8px;font:14px 'Pixelify Sans',sans-serif;color:#f6e6b8;box-shadow:0 6px 20px rgba(0,0,0,.6)}
#mapPop input{font:14px 'Pixelify Sans',sans-serif;background:#0c0806;color:#fff;border:1px solid #6a4418;padding:4px 6px;width:180px}
#mapPop .cols{display:flex;gap:6px}#mapPop .cols b{width:20px;height:20px;border:2px solid #000;cursor:pointer}#mapPop .cols b.on{outline:2px solid #fff}
#mapPop .btns{display:flex;gap:6px}#mapPop button{font:13px 'Pixelify Sans',sans-serif;background:#3a2814;color:#f6e6b8;border:1px solid #b8862e;padding:3px 9px;cursor:pointer}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='miniMap';d.innerHTML='<canvas width="182" height="182"></canvas><i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i><div class="n">N</div><div class="lbl"></div>';
  ($('hud')||document.body).appendChild(d);MAP.mini=d;})();
function miniPlace(){const h=$('playerHud'),m=MAP.mini;if(!h||!m)return;const r=h.getBoundingClientRect(),pr=(m.offsetParent||document.body).getBoundingClientRect();
  m.style.left=(r.left-pr.left)+'px';m.style.top=(r.bottom-pr.top+14)+'px';m.style.width=r.width+'px';m.style.height=r.width+'px';}
let mapRevT=0,mapPlaceT=0,mapMiniT=0;
function mapTick(dt){mapRevT-=dt;if(mapRevT<=0){mapRevT=.5;if(state!=='menu'&&state!=='loading')mapReveal();}
  mapWork(MAP.open?10:3);mapPlaceT-=dt;if(mapPlaceT<=0){mapPlaceT=1;miniPlace();}
  const m=MAP.mini;if(!m)return;const show=state!=='menu'&&state!=='loading'&&!(typeof FILM!=='undefined'&&FILM.on);m.style.display=show?'':'none';if(!show)return;
  mapMiniT-=dt;if(mapMiniT>0)return;mapMiniT=1/20;const cv=m.querySelector('canvas'),c=cv.getContext('2d');
  if(P.x>=60000){c.fillStyle='#1a120c';c.fillRect(0,0,cv.width,cv.height);c.fillStyle='#c8b890';c.font="14px 'Pixelify Sans',sans-serif";c.textAlign='center';c.fillText('Innenraum',cv.width/2,cv.height/2);m.querySelector('.lbl').textContent=AREAS[curArea]||'';return;}
  mapDraw(c,cv.width,cv.height,P.x,P.z,.85,false);
  const lbl=m.querySelector('.lbl');let an='';try{an=AREAS[areaAt(P.x,P.z)]||'';}catch(e){}const key=keyName(settings.keys.map||'KeyM');lbl.textContent=(an?an+' · ':'')+key+': Karte';}
{const a=updateStory;updateStory=function(dt){a(dt);try{mapTick(dt);}catch(e){if(!mapTick.err){mapTick.err=1;console.error('Karte',e);}}};}
addEventListener('resize',()=>setTimeout(miniPlace,50));
// ---------- Große Karte ----------
UI_STATES.add('map');
const MAP_COLS=['#ff5a4a','#ffd84a','#6ad04a','#4aa0ff','#c070ff','#ffffff'];
function openMap(){if(state!=='playing')return;state='map';keys.clear();promptEl.hidden=true;if(document.pointerLockElement){suppressPause=true;document.exitPointerLock();}
  if(!MAP.big){const d=document.createElement('div');d.id='bigMap';d.innerHTML=`<div class="top">Karte<span class="h">Ziehen: verschieben · Mausrad: zoomen · Linksklick: Markierung setzen oder bearbeiten · Rechtsklick auf Markierung: löschen · ${keyName(settings.keys.map||'KeyM')} / Esc: schließen</span><button data-a="me">Zu mir</button><button data-a="x">Schließen</button></div><canvas></canvas>`;
    document.body.appendChild(d);MAP.big=d;mapBigEvents(d);}
  const pp=P.x<60000?[P.x,P.z]:(MAP.lastOut||[0,0]);MAP.cx=pp[0];MAP.cz=pp[1];MAP.big.hidden=false;MAP.open=true;Snd.click();updateLockHint();mapBigDraw();}
function closeMap(){if(!MAP.open)return;mapPopClose();MAP.big.hidden=true;MAP.open=false;if(state==='map'){state='playing';lock();}updateLockHint();}
function mapBigDraw(){if(!MAP.open)return;const cv=MAP.big.querySelector('canvas'),W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  mapDraw(cv.getContext('2d'),W,H,MAP.cx,MAP.cz,MAP.mpp,true);
  const c=cv.getContext('2d');c.font="13px 'Pixelify Sans',sans-serif";c.textAlign='left';c.fillStyle='rgba(0,0,0,.55)';c.fillRect(8,H-28,250,22);c.fillStyle='#f6e6b8';
  c.fillText(`Maßstab: 100 m = ${Math.round(100/MAP.mpp)} Bildpunkte`,14,H-12);requestAnimationFrame(mapBigDraw);}
function mapWorldAt(e){const cv=MAP.big.querySelector('canvas'),r=cv.getBoundingClientRect();return[MAP.cx+(e.clientX-r.left-cv.width/2)*MAP.mpp,MAP.cz+(e.clientY-r.top-cv.height/2)*MAP.mpp];}
function mapMarkAt(e){const cv=MAP.big.querySelector('canvas'),r=cv.getBoundingClientRect();let best=null,bd=16;for(const m of(FLAGS.mapMarks||[])){const X=(m.x-MAP.cx)/MAP.mpp+cv.width/2+r.left,Y=(m.z-MAP.cz)/MAP.mpp+cv.height/2+r.top-12;const d=Math.hypot(e.clientX-X,e.clientY-Y);if(d<bd){bd=d;best=m;}}return best;}
function mapBigEvents(d){const cv=d.querySelector('canvas');
  d.querySelector('.top').addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(a==='x'){Snd.click();closeMap();}if(a==='me'){Snd.click();const pp=P.x<60000?[P.x,P.z]:(MAP.lastOut||[0,0]);MAP.cx=pp[0];MAP.cz=pp[1];}});
  cv.addEventListener('mousedown',e=>{if(e.button!==0)return;mapPopClose();MAP.drag={x:e.clientX,y:e.clientY,cx:MAP.cx,cz:MAP.cz,moved:false};cv.classList.add('drag');});
  addEventListener('mousemove',e=>{const g=MAP.drag;if(!g||!MAP.open)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)+Math.abs(dy)>4)g.moved=true;MAP.cx=g.cx-dx*MAP.mpp;MAP.cz=g.cz-dy*MAP.mpp;});
  addEventListener('mouseup',e=>{const g=MAP.drag;if(!g)return;MAP.drag=null;cv.classList.remove('drag');if(!g.moved&&MAP.open&&e.button===0){const m=mapMarkAt(e);mapPopOpen(e,m);}});
  cv.addEventListener('contextmenu',e=>{e.preventDefault();const m=mapMarkAt(e);if(m){FLAGS.mapMarks=FLAGS.mapMarks.filter(q=>q!==m);Snd.click();}});
  cv.addEventListener('wheel',e=>{e.preventDefault();const[wx,wz]=mapWorldAt(e),f=e.deltaY>0?1.25:.8;MAP.mpp=Math.max(.35,Math.min(48,MAP.mpp*f));const[nx,nz]=mapWorldAt(e);MAP.cx+=wx-nx;MAP.cz+=wz-nz;},{passive:false});}
function mapPopClose(){if(MAP.pop){MAP.pop.remove();MAP.pop=null;}}
function mapPopOpen(e,mark){mapPopClose();const[x,z]=mark?[mark.x,mark.z]:mapWorldAt(e);let col=mark?mark.c:MAP_COLS[(FLAGS.mapMarks||[]).length%MAP_COLS.length];
  const p=document.createElement('div');p.id='mapPop';p.style.left=Math.min(innerWidth-230,e.clientX+10)+'px';p.style.top=Math.min(innerHeight-150,e.clientY+10)+'px';
  p.innerHTML=`<div>${mark?'Markierung bearbeiten':'Neue Markierung'}</div><input maxlength="24" value="${mark?mark.n.replace(/"/g,'&quot;'):'Markierung '+((FLAGS.mapMarks||[]).length+1)}"><div class="cols">${MAP_COLS.map(c=>`<b data-c="${c}" style="background:${c}" class="${c===col?'on':''}"></b>`).join('')}</div>
    <div class="btns"><button data-a="ok">${mark?'Speichern':'Setzen'}</button>${mark?'<button data-a="del">Löschen</button>':''}<button data-a="no">Abbrechen</button></div>`;
  document.body.appendChild(p);MAP.pop=p;const inp=p.querySelector('input');inp.focus();inp.select();
  const ok=()=>{const n=inp.value.trim()||'Markierung';FLAGS.mapMarks=FLAGS.mapMarks||[];if(mark){mark.n=n;mark.c=col;}else FLAGS.mapMarks.push({x:Math.round(x*10)/10,z:Math.round(z*10)/10,n,c:col});Snd.click();mapPopClose();};
  inp.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Enter')ok();if(ev.key==='Escape')mapPopClose();});inp.addEventListener('keyup',ev=>ev.stopPropagation());
  p.addEventListener('click',ev=>{const c=ev.target.dataset.c,a=ev.target.dataset.a;if(c){col=c;p.querySelectorAll('b').forEach(b=>b.classList.toggle('on',b.dataset.c===c));}
    if(a==='ok')ok();if(a==='no')mapPopClose();if(a==='del'&&mark){FLAGS.mapMarks=FLAGS.mapMarks.filter(q=>q!==mark);Snd.click();mapPopClose();}});}
addEventListener('keydown',e=>{const k=settings.keys.map||'KeyM';
  if(state==='playing'&&e.code===k&&!e.repeat){e.preventDefault();openMap();return;}
  if(state==='map'&&(e.code===k||e.code==='Escape')&&!MAP.pop){e.preventDefault();closeMap();}});
