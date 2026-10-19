/* =========================================================
   0.0.129 · Bogen, Schild und Speer
   - Bogen: Linksklick halten spannt den Bogen (Zielansicht, leichter Zoom), loslassen schießt.
     Je weiter gespannt, desto schneller und stärker der Pfeil. Pfeile fliegen als echte 3D-Pfeile
     und bleiben im Boden und in Wänden stecken. Skelettschützen spannen sichtbar und schießen echte Pfeile.
   - Schild in der Zweithand: Rechtsklick halten blockt 100 % des Schadens von vorne.
     Halten und jeder abgefangene Treffer kosten Ausdauer. Ohne Ausdauer bricht die Deckung.
   - Speer und Bogen in der Ego-Ansicht als Pixel-Modelle in 3D: der Speer zeigt wirklich nach vorne.
   ========================================================= */
// ---------- Pixelbild → 3D-Modell ----------
// Jedes Pixel wird ein kleiner Block. depth(x,y) = Dicke in Pixeln. shade = Helligkeit je Seite.
function vxGeo(cv,o){o=o||{};const w=cv.width,h=cv.height,D=cv.getContext('2d').getImageData(0,0,w,h).data,ox=o.ox==null?w/2:o.ox,oy=o.oy==null?h/2:o.oy,dep=o.depth||(()=>1),
    S=Object.assign({px:.82,nx:.7,py:1,ny:.58,pz:.92,nz:.74},o.shade||{});
  const op=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&D[(y*w+x)*4+3]>=128,dp=(x,y)=>op(x,y)?dep(x,y):0;const pos=[],col=[],nor=[];
  const quad=(v,n,r,g,b,s)=>{for(const i of[0,1,2,0,2,3]){pos.push(v[i][0],v[i][1],v[i][2]);nor.push(n[0],n[1],n[2]);col.push(r*s,g*s,b*s);}};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!op(x,y))continue;const i=(y*w+x)*4,r=D[i]/255,g=D[i+1]/255,b=D[i+2]/255,d=dep(x,y),z1=d/2,z0=-d/2,X0=x-ox,X1=X0+1,Y0=-(y-oy),Y1=Y0-1;
    quad([[X0,Y1,z1],[X1,Y1,z1],[X1,Y0,z1],[X0,Y0,z1]],[0,0,1],r,g,b,S.pz);quad([[X1,Y1,z0],[X0,Y1,z0],[X0,Y0,z0],[X1,Y0,z0]],[0,0,-1],r,g,b,S.nz);
    if(dp(x,y-1)<d)quad([[X0,Y0,z1],[X1,Y0,z1],[X1,Y0,z0],[X0,Y0,z0]],[0,1,0],r,g,b,S.py);
    if(dp(x,y+1)<d)quad([[X0,Y1,z0],[X1,Y1,z0],[X1,Y1,z1],[X0,Y1,z1]],[0,-1,0],r,g,b,S.ny);
    if(dp(x+1,y)<d)quad([[X1,Y1,z1],[X1,Y1,z0],[X1,Y0,z0],[X1,Y0,z1]],[1,0,0],r,g,b,S.px);
    if(dp(x-1,y)<d)quad([[X0,Y1,z0],[X0,Y1,z1],[X0,Y0,z1],[X0,Y0,z0]],[-1,0,0],r,g,b,S.nx);}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('color',new THREE.Float32BufferAttribute(col,3));return G;}
function vxMerge(a,b){const g=new THREE.BufferGeometry();for(const k of['position','normal','color']){const A=a.getAttribute(k).array,B=b.getAttribute(k).array,C=new Float32Array(A.length+B.length);C.set(A);C.set(B,A.length);g.setAttribute(k,new THREE.BufferAttribute(C,3));}return g;}
// ---------- Bilder für die Modelle ----------
function w3ArrowCv(){const p=new Px(30,5),SH=pal(['#6a4422','#8a6034','#b08850']),ST=pal(['#5a626c','#a8b0ba','#dfe6ee']),FR=hex('#c83a2a'),FW=hex('#ece4d2');
  for(let x=3;x<24;x++){p.set(x,2,SH[x%5===0?0:1]);}for(let x=6;x<23;x+=4)p.set(x,2,SH[2]);
  for(let x=24;x<30;x++)p.set(x,2,ST[x>27?2:1]);for(let x=24;x<28;x++){p.set(x,1,ST[x>25?1:0]);p.set(x,3,ST[0]);}p.set(24,0,ST[0]);p.set(24,4,ST[0]);p.set(25,0,ST[1]);p.set(25,4,ST[0]);
  for(let x=0;x<7;x++){p.set(x,1,x&1?FW:FR);p.set(x,3,x&1?FR:FW);if(x>1&&x<6){p.set(x,0,FR);p.set(x,4,FR);}}p.set(0,2,hex('#e8e0c8'));p.set(1,2,hex('#e8e0c8'));p.set(2,2,SH[0]);return p.done();}
function w3SpearCv(){const W=22,H=150,p=new Px(W,H),cx=11;fpHandle(p,cx,30,H-3,7);
  fPoly(p,[[cx,1],[cx+8,17],[cx+5,28],[cx,32],[cx-5,28],[cx-8,17]],FPW.steel,{b:.1,f:(x,y,L)=>FPW.steel[shadeIdx(L+(x===cx?-.25:0),6,x,y)]});
  fpWrap(p,cx,32,40,7);for(let k=0;k<5;k++)fLine(p,cx-2+k,40,cx-4+k*2,52,hex(k&1?'#a01818':'#d03030'));fpWrap(p,cx,H-34,H-14,7);return p.done();}
function w3BowCv(){const W=18,H=97,p=new Px(W,H),WD=FPW.wood,GR=FPW.grip;
  for(let y=0;y<H;y++){const t=(y-48)/48,a=Math.abs(t),xc=3+9*Math.pow(Math.max(0,1-t*t),.7)+(a>.9?(a-.9)*16:0),grip=a<.14,th=grip?5:a>.85?2:3,x0=Math.round(xc)-1;
    for(let k=0;k<th;k++){const L=.85-k/th*.55+(hash2(k,y>>2,881)-.5)*.1;p.set(x0+k,y,grip?GR[shadeIdx(L-((y*2+k)%7<2?.3:0),GR.length,x0+k,y)]:WD[shadeIdx(L,WD.length,x0+k,y)]);}}
  for(const y of[0,1,95,96])p.set(Math.round(3+(Math.abs((y-48)/48)-.9)*16)-1,y,hex('#e8dcb8'));return p.done();}
function w3ArmCv(){const p=new Px(8,48);for(let y=0;y<48;y++)for(let x=0;x<8;x++){const band=y>=12&&y<=14;p.set(x,y,band?hex(x<4?'#e0b850':'#a88030'):GLV[shadeIdx(.85-x/8*.6,GLV.length,x,y)]);}return p.done();}
// ---------- Ego-Ansicht in 3D ----------
const FP3={scene:new THREE.Scene(),cam:new THREE.PerspectiveCamera(60,1,.01,20),root:new THREE.Group(),built:false,sp:null,bw:null,aspect:0,k:0,spK:0,brK:0};
FP3.scene.add(FP3.root);
const W3V=new THREE.Vector3(),W3Y=new THREE.Vector3(0,1,0);
function fp3Mat(){return new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});}
function fp3Fist(){const f=fpFist(),g=vxGeo(f,{ox:13,oy:12,depth:(x,y)=>Math.max(2,Math.round(2*7*Math.sqrt(Math.max(0,1-((x-14)/13)**2-((y-12)/12)**2))))});const m=new THREE.Mesh(g,fp3Mat());m.scale.setScalar(.0058);return m;}
function fp3Arm(dir,len){const g=vxGeo(w3ArmCv(),{ox:4,oy:0,depth:()=>8}),m=new THREE.Mesh(g,fp3Mat());m.scale.set(.011,len/48,.011);m.quaternion.setFromUnitVectors(W3Y,W3V.copy(dir).normalize().negate());return m;}
function fp3Build(){if(FP3.built)return;FP3.built=true;
  // Speer: liegt flach, Spitze nach vorne
  {const G=new THREE.Group(),cv=w3SpearCv(),cx=11.5,geo=vxGeo(cv,{ox:cx,oy:110,shade:{pz:1,nz:.55,py:.85,ny:.85,px:.84,nx:.68},
      depth:(x,y)=>{const dx=Math.abs(x+.5-cx);if(y<=32)return Math.max(1,Math.round(3-dx*.35));const r=3.6;return dx>=r?1:Math.max(1,Math.round(2*Math.sqrt(r*r-dx*dx)));}});
    geo.rotateX(-Math.PI/2);const sm=new THREE.Mesh(geo,fp3Mat());sm.scale.setScalar(.0125);G.add(sm);
    const fist=fp3Fist();fist.position.set(.012,-.012,.01);fist.rotation.set(-.5,.2,-.5);G.add(fist);
    const arm=fp3Arm(new THREE.Vector3(.45,-.55,.6),.55);G.add(arm);
    // eine zweite Hand weiter hinten am Schaft
    const f2=fp3Fist();f2.position.set(.005,-.02,.36);f2.rotation.set(-.6,-.2,.4);f2.scale.setScalar(.0055);G.add(f2);
    FP3.root.add(G);FP3.sp={G,sm,cv};}}
// ---------- Bogen spannen ----------
const BOW={on:false,t0:0,draw:0,hold:0,kick:0,slot:-1};
const bowHeld=()=>weaponOf()==='bow';
function bowCancel(){BOW.on=false;BOW.draw=0;BOW.hold=0;}
function bowTwang(){const c=Snd.ctx;if(!c)return;try{const t=c.currentTime,{o}=Snd.tone('triangle',190,t,.18,.12);o.frequency.exponentialRampToValueAtTime(95,t+.18);Snd.whoosh(1300,.07);}catch(e){}}
function bowCreak(v){const c=Snd.ctx;if(!c)return;try{const t=c.currentTime,{o}=Snd.tone('sawtooth',70+Math.random()*30,t,.22,.025*v);o.frequency.linearRampToValueAtTime(120,t+.22);}catch(e){}}
function bowRelease(){if(!BOW.on)return;const d=BOW.draw;bowCancel();
  if(d<.18||state!=='playing'||!bowHeld()||countItem('arrow')<1)return;
  P.stats.st=Math.max(0,P.stats.st-4);P.atkReady=time+.32;P.atkT=time;P.atkDur=.2;P.lastAction=time;removeItem('arrow',1);renderInv();wearTool();
  const h=inv[HOT0+sel],it=h&&ITEMS[h.id],E=it&&it.ench&&ENCH[it.ench],L=lookDir(),e=.3+.7*d*d,sp=16+30*d;
  const dmg=26*e*(1+.15*tal('archer'))*(P.stats.hp<P.stats.maxHp*.4?1+.12*tal('rage'):1)*(buffOn('str')?1.5:1)*(E&&E.dmg?1+E.dmg:1)*(h&&h.gem==='ruby'?1.25:h&&h.gem==='blackdia'?1.4:1)*(d>=1?1.1:1);
  const x=P.x+L.x*.9,y=P.y+P.eye-.12+L.y*.9,z=P.z+L.z*.9,s={x,y,z,vx:L.x*sp,vy:L.y*sp,vz:L.z*sp,t:0,life:4,dmg,fac:'ally',orb:'orb_arrow',size:.32,col:0xc8b080,grav:7,aoe:0,home:0,src:null,by:'player',arrow:1};
  SHOTS.push(s);ARW.push(s);BOW.kick=1;bowTwang();renderStats();}
function bowStart(){if(state!=='playing'||time<(P.atkReady||0)||BOW.on||BOW.lock)return;BOW.lock=true;
  if(SW.under){toast('Unter Wasser kannst du nicht schießen.');return;}
  if(countItem('arrow')<1){toast('Du hast keine Pfeile. Aus 1 Stock und 1 Stein baust du 6 Pfeile.');return;}
  if(P.stats.st<4){toast('Zu wenig Ausdauer');return;}
  BOW.on=true;BOW.t0=time;BOW.draw=0;BOW.hold=0;BOW.slot=sel;BOW.ck=0;bowCreak(1);}
{const a=attack;attack=function(){if(BLK.on||BOW.on)return;if(bowHeld())return;return a();};}
window.addEventListener('blur',()=>{bowCancel();});
// ---------- Schild ----------
const BLK={on:false,k:0,brk:0,shake:0};let BLKSRC=null,BLKENV=0;
const offShield=()=>{const o=equip.off;return o&&ITEMS[o.id]&&(o.id==='shield'||ITEMS[o.id].shield)?o:null;};
ITEM_DESC.shield='Zweithand-Ausrüstung. Rechtsklick halten zum Blocken: fängt 100 % des Schadens von vorne ab, kostet aber Ausdauer.';
ITEM_DESC.bow='Rechtsklick halten spannt den Bogen, loslassen schießt. Je weiter gespannt, desto stärker. Braucht Pfeile.';
function blockFx(ok){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);for(let k=0;k<(ok?12:22);k++)spawnParticle(P.x+fx*.7,P.y+1.25,P.z+fz*.7,(Math.random()-.5)*4+fx*1.5,Math.random()*3,(Math.random()-.5)*4+fz*1.5,ok?(Math.random()<.5?0xfff0c0:0xffc060):0x8a6a3a,.35,.12);
  BLK.shake=1;try{Snd.hit(ok?'sword':'axe');if(Snd.clink)Snd.clink(ok?1:.6);}catch(e){}}
{const a=takeDamage;takeDamage=function(n){if(BLK.on&&n>=2&&!BLKENV&&!cheatOn()&&state!=='dead'){let front=true;
    if(BLKSRC){const dx=BLKSRC.x-P.x,dz=BLKSRC.z-P.z,d=Math.hypot(dx,dz);if(d>.05)front=(-dx*Math.sin(P.yaw)-dz*Math.cos(P.yaw))/d>-.15;}
    if(front){const S=P.stats,cost=(4+n*.5)*shieldK();P._blkT=time;P._pz=P.poisonT||0;
      if(S.st>=cost){S.st-=cost;blockFx(1);shieldWear(1);renderStats();return;}
      const f=S.st/cost;S.st=0;BLK.brk=time+1.6;BLK.on=false;blockFx(0);renderStats();return a(n*(1-f));}}
  return a(n);};}
{const a=meleeHit;meleeHit=function(e,t,dmg){if(t!=='player')return a(e,t,dmg);const o=BLKSRC;BLKSRC=e;try{return a(e,t,dmg);}finally{BLKSRC=o;}};}
{const a=shotHit;shotHit=function(s){if(s.fac!=='demon')return a(s);const o=BLKSRC;BLKSRC=s.src&&!s.src.dead?{x:s.src.x,z:s.src.z}:{x:s.x-s.vx,z:s.z-s.vz};try{return a(s);}finally{BLKSRC=o;}};}
const blkEnvWrap=f=>function(){BLKENV++;try{return f.apply(this,arguments);}finally{BLKENV--;}};
updateRealm=blkEnvWrap(updateRealm);dgTick=blkEnvWrap(dgTick);spTick=blkEnvWrap(spTick);
// Dritte Person: beim Blocken und Zielen die Abwehrhaltung zeigen
{const a=placeCamera;placeCamera=function(b,hs){const br=P.brace;if(BLK.on||BOW.on)P.brace=true;try{return a(b,hs);}finally{P.brace=br;}};}
// ---------- Spieler pro Bild ----------
{const a=updatePlayer;updatePlayer=function(dt){
  if(P._blkT&&time-P._blkT<.25&&(P.poisonT||0)>(P._pz||0))P.poisonT=P._pz;
  const bh=bowHeld(),xh=weaponOf()==='xbow',sh=(bh||xh)?null:offShield(),rd=rightDown;if(!rd)BOW.lock=false;if(bh&&rd)bowStart();else if(BOW.on&&!rd)bowRelease();
  const wantB=!!(rd&&sh&&state==='playing'&&!BOW.on&&time>BLK.brk&&P.stats.st>0&&!P.riding&&!(SW.on&&SW.swim));
  if(BOW.on&&(!bowHeld()||sel!==BOW.slot||state!=='playing'||P.riding))bowCancel();
  if(BOW.on){BOW.draw=Math.min(1,(time-BOW.t0)/bowSpec().draw);if(BOW.draw>=1){BOW.hold+=dt;if(BOW.hold>2.5){P.stats.st=Math.max(0,P.stats.st-4*dt);if(P.stats.st<=0)bowCancel();}}
    if(BOW.draw<1&&time-(BOW.ck||0)>.28){BOW.ck=time;bowCreak(.6+BOW.draw);}}
  const dz=BOW.on?BOW.draw:0,fov0=settings.fov;if(dz>0)settings.fov=fov0-14*dz*dz;
  const x0=P.x,z0=P.z;if(sh||bh||xh)rightDown=false;
  try{a(dt);}finally{rightDown=rd;settings.fov=fov0;}
  BLK.on=wantB;if(BLK.on){P.stats.st=Math.max(0,P.stats.st-3*dt*shieldK());P.lastAction=time;}
  if(BLK.on||BOW.on){const k=BLK.on?.55:.5;P.x=x0+(P.x-x0)*k;P.z=z0+(P.z-z0)*k;if(BOW.on)P.lastAction=time;}
  BLK.k+=((BLK.on?1:0)-BLK.k)*Math.min(1,dt*14);BLK.shake=Math.max(0,BLK.shake-dt*6);BOW.kick=Math.max(0,BOW.kick-dt*5);
  // Schild in der Ego-Ansicht nach vorne ziehen
  const ho=$('handOff');if(ho&&!ho.hidden&&BLK.k>.01){const hs=Math.hypot(P.vx,P.vz),bx=Math.sin(P.bob*Math.PI)*8*Math.min(hs/4,1),by=Math.abs(Math.cos(P.bob*Math.PI))*10*Math.min(hs/4,1),L=settings.hand==='left',k=BLK.k,
      sk=BLK.shake,jx=sk?(Math.random()-.5)*14*sk:0,jy=sk?-10*sk:0,X=(L?-1:1)*innerWidth*.17*k+jx,Y=-innerHeight*.14*k+jy;
    ho.style.transform=`translate(${-bx+X}px,${by+Y}px) rotate(${(L?-10:10)*(1-k)}deg) scale(${1+.75*k})${L?'':' scaleX(-1)'}`;}
  else if(ho&&time<BLK.brk&&!ho.hidden){ho.style.transform+=` translateY(${40*(BLK.brk-time)/1.6}px)`;}};}
{const a=renderInv;renderInv=function(){const r=a.apply(this,arguments);if(BOW.on&&!bowHeld())bowCancel();return r;};}
// ---------- Bogen in der Ego-Ansicht (2D) ----------
// drei Bilder: Ruhe, halb gespannt, voll gespannt. Beim Spannen wandert der Bogen in die Bildmitte.
const BOWFP={idle:null,half:null,full:null,head:[51,60],k:0,cur:null};
function bowPxLine(c,x0,y0,x1,y1,col,w){c.fillStyle=col;const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))||1;for(let i=0;i<=n;i++)c.fillRect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w||1,w||1);}
function bowFpArm(c,AX,AY){const arm=new Px(128,128),ang=Math.atan2(150-AY,150-AX),nx=-Math.sin(ang),nz=Math.cos(ang),w=9;
  fPoly(arm,[[AX+nx*w*.9,AY+nz*w*.9+3],[AX-nx*w*.9,AY-nz*w*.9+3],[150-nx*w*1.4,150-nz*w*1.4],[150+nx*w*1.4,150+nz*w*1.4]],GLV,{b:.05});
  for(let k=0;k<3;k++){const t=.3+k*.08,bx=AX+(150-AX)*t,by=AY+3+(150-AY-3)*t;for(let j=-12;j<=12;j++){const px=Math.round(bx+nx*j),py=Math.round(by+nz*j);if(arm.d[(py*128+px)*4+3])arm.set(px,py,k===1?hex('#c8a040'):GLV[1]);}}
  outline(arm);c.drawImage(arm.done(),0,0);}
function bowFpBuild(){const bow=w3BowCv(),mk=nock=>{const o=document.createElement('canvas');o.width=o.height=128;const c=o.getContext('2d');c.imageSmoothingEnabled=false;const gx=60,gy=64,rot=-.1,cs=Math.cos(rot),sn=Math.sin(rot);
    const tip=sy=>[gx+(-10.5)*cs-(sy)*sn,gy+(-10.5)*sn+(sy)*cs],T1=tip(-48),T2=tip(48),N=nock||[gx-10.5*cs,gy-10.5*sn];
    if(nock)bowFpArm(c,N[0]+4,N[1]+5);
    c.save();c.translate(gx,gy);c.rotate(rot);c.drawImage(bow,-13,-48);c.restore();
    bowPxLine(c,T1[0],T1[1],N[0],N[1],'#e8e0c8');bowPxLine(c,T2[0],T2[1],N[0],N[1],'#e8e0c8');
    if(nock){const H=BOWFP.head;bowPxLine(c,N[0],N[1],H[0]+3,H[1]+2,'#8a6034',2);bowPxLine(c,N[0]+1,N[1],H[0]+4,H[1]+2,'#b08850');
      c.fillStyle='#a8b0ba';c.fillRect(H[0]-1,H[1]-1,5,4);c.fillStyle='#dfe6ee';c.fillRect(H[0]-2,H[1]-2,2,2);c.fillStyle='#5a626c';c.fillRect(H[0]+2,H[1]+2,2,1);
      const dx=H[0]-N[0],dy=H[1]-N[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;for(let k=2;k<9;k++){c.fillStyle=k&1?'#c83a2a':'#ece4d2';c.fillRect(Math.round(N[0]+ux*k-uy*2),Math.round(N[1]+uy*k+ux*2),2,2);c.fillRect(Math.round(N[0]+ux*k+uy*2),Math.round(N[1]+uy*k-ux*2),2,2);}
      const f=fpFist();c.save();c.translate(N[0],N[1]);c.rotate(.5);c.drawImage(f,-9,-11);c.restore();}
    const g=fpFist();c.save();c.translate(gx,gy);c.rotate(-.2);c.drawImage(g,-10,-12);c.restore();return o.toDataURL();};
  BOWFP.half=mk([80,88]);BOWFP.full=mk([94,104]);
  {const o=document.createElement('canvas');o.width=bow.width;o.height=bow.height;const c=o.getContext('2d');c.drawImage(bow,0,0);bowPxLine(c,2,1,2,95,'#e8e0c8');FPG=1;try{BOWFP.idle=fpPlace(o,13,48,-.42,1,84,96);}finally{FPG=0;}}}
{const a=initFPItems;initFPItems=function(){a();try{bowFpBuild();for(const id in ITEMS)if(ITEMS[id].weapon==='bow')ITEMS[id].fp=BOWFP.idle;renderInv();}catch(e){console.error('Bogen Ego-Bild',e);}};}
function bowFpTick(dt){if(!BOWFP.idle||(P.view||0)||hand.hidden||!bowHeld()){BOWFP.k=0;if(hand.style.transformOrigin)hand.style.transformOrigin='';return;}
  BOWFP.k+=((BOW.on?1:0)-BOWFP.k)*Math.min(1,dt*(BOW.on?11:8));const k=BOWFP.k,e=k*k*(3-2*k),want=BOW.on?(BOW.draw<.5?BOWFP.half:BOWFP.full):BOWFP.idle;
  if(hand.getAttribute('src')!==want)hand.src=want;
  const L=settings.hand==='left',W=hand.offsetWidth,H=hand.offsetHeight,hx=hand.offsetLeft+(L?1-BOWFP.head[0]/128:BOWFP.head[0]/128)*W,hy=hand.offsetTop+BOWFP.head[1]/128*H;
  const hs=Math.hypot(P.vx,P.vz),bx=Math.sin(P.bob*Math.PI)*8*Math.min(hs/4,1),by=Math.abs(Math.cos(P.bob*Math.PI))*10*Math.min(hs/4,1),sh=BOW.on&&BOW.hold>1.6?Math.min(1,(BOW.hold-1.6)/1.5):0;
  const tx=(innerWidth/2-hx)*e+bx*(1-e)+(sh?(Math.random()-.5)*3*sh:0),ty=(innerHeight/2-hy)*e+by*(1-e)+BOW.kick*14;
  hand.style.transformOrigin=`${(L?1-BOWFP.head[0]/128:BOWFP.head[0]/128)*100}% ${BOWFP.head[1]/128*100}%`;
  hand.style.transform=`translate(${tx}px,${ty}px) scale(${1+1.15*e})${L?' scaleX(-1)':''}`;}
{const a=updatePlayer;updatePlayer=function(dt){a(dt);try{bowFpTick(dt);}catch(e){if(!bowFpTick.err){bowFpTick.err=1;console.error(e);}}};}
// ---------- Ego-Ansicht zeichnen ----------
function fp3Kind(){if((P.view||0)||hand.hidden||hand.offsetParent===null||hand.style.visibility==='hidden'||document.body.classList.contains('filming'))return null;
  if(state==='dead'||state==='menu'||state==='loading')return null;return weaponOf()==='spear'?'spear':null;}
function fp3Pose(){const hs=Math.hypot(P.vx||0,P.vz||0),m=Math.min(hs/4,1),bx=Math.sin(P.bob*Math.PI)*.012*m,by=-Math.abs(Math.cos(P.bob*Math.PI))*.016*m,dt=Math.min(.05,time-(FP3.t||time));FP3.t=time;
  if(FP3.sp.G.visible){const S=FP3.sp,ap=atkPhase();FP3.brK+=((P.brace&&!BLK.on&&!BOW.on?1:0)-FP3.brK)*Math.min(1,dt*10);const b=FP3.brK;
    let x=.25-.12*b,y=-.235+.05*b,z=-.40+.04*b,ry=.16-.1*b,rx=.05-.04*b;
    if(ap>=0){if(ap<.4){z+=.1*ap/.4;rx+=.05*ap/.4;}else{const q=(ap-.4)/.6,s=Math.sin(q*Math.PI);z+=.1*(1-q)-.62*s;x-=.12*s;y+=.05*s;ry-=.1*s;}}
    S.G.position.set(x+bx,y+by,z);S.G.rotation.set(rx,ry,0);}}
function fp3Render(){const k=fp3Kind();const want=!!k;if(want&&!FP3.built)fp3Build();if(!FP3.built){if(hand.style.opacity)hand.style.opacity='';return;}
  FP3.sp.G.visible=k==='spear';hand.style.opacity=want?'0':'';if(!want)return;
  const cv=renderer.domElement,asp=cv.clientWidth/Math.max(1,cv.clientHeight);if(Math.abs(asp-FP3.aspect)>1e-3){FP3.aspect=asp;FP3.cam.aspect=asp;FP3.cam.updateProjectionMatrix();}
  FP3.root.scale.x=settings.hand==='left'?-1:1;fp3Pose();
  const ac=renderer.autoClear;renderer.autoClear=false;renderer.clearDepth();renderer.render(FP3.scene,FP3.cam);renderer.autoClear=ac;}
{const a=frame;frame=function(now){a(now);try{fp3Render();}catch(e){if(!fp3Render.err){fp3Render.err=1;console.error('Ego-Modelle',e);}}};}
// ---------- Pfeile in der Welt ----------
const WAR3={geo:null,mat:null,pool:[],live:new Map(),stuck:[]};
function war3Init(){const a=vxGeo(w3ArrowCv(),{ox:15,oy:2.5,depth:()=>1}),b=vxGeo(w3ArrowCv(),{ox:15,oy:2.5,depth:()=>1}).rotateX(Math.PI/2),g=vxMerge(a,b);g.rotateY(-Math.PI/2);
  WAR3.geo=g;WAR3.mat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});}
function war3Get(){let m=WAR3.pool.pop();if(!m){m=new THREE.Mesh(WAR3.geo,WAR3.mat);m.scale.setScalar(.03);scene.add(m);}m.visible=true;return m;}
function war3Free(m){m.visible=false;WAR3.pool.push(m);}
function war3CanStick(s){if(s.q)return false;const near=(x,y,z,h,r)=>Math.hypot(x-s.x,z-s.z)<r&&s.y>y-.4&&s.y<y+h+.4;
  if(near(P.x,P.y,P.z,1.9,1.1))return false;for(const e of DEM)if(!e.dead&&near(e.x,e.y,e.z,e.h||1.8,(e.d&&e.d.rad||.4)+.7))return false;
  for(const a of animals)if(a.alive&&near(a.x,a.y,a.z,a.h||1,Math.max(.6,(a.w||1)*.45)))return false;return true;}
const W3T=new THREE.Vector3();
function war3Tick(dt){if(!WAR3.geo)war3Init();const seen=new Set();
  for(const s of SHOTS){if(s.orb!=='orb_arrow')continue;seen.add(s);let m=WAR3.live.get(s);if(!m){m=war3Get();WAR3.live.set(s,m);}m.position.set(s.x,s.y,s.z);W3T.set(s.x+s.vx,s.y+s.vy,s.z+s.vz);m.lookAt(W3T);s._dx=s.vx;s._dy=s.vy;s._dz=s.vz;}
  try{for(const s of MSHOTS){if(!s.arrow)continue;seen.add(s);let m=WAR3.live.get(s);if(!m){m=war3Get();WAR3.live.set(s,m);}
    const px=s._px==null?s.x:s._px,py=s._py==null?s.y:s._py,pz=s._pz==null?s.z:s._pz;let dx=s.x-px,dy=s.y-py,dz=s.z-pz;if(Math.hypot(dx,dy,dz)<1e-4){const o=s.q&&s.q[0];if(o){dx=o.x-s.x;dy=0;dz=o.z-s.z;}}
    m.position.set(s.x,s.y,s.z);W3T.set(s.x+dx,s.y+dy,s.z+dz);m.lookAt(W3T);s._px=s.x;s._py=s.y;s._pz=s.z;}}catch(e){}
  for(const[s,m]of WAR3.live)if(!seen.has(s)){WAR3.live.delete(s);if(s._dx!=null&&war3CanStick(s)){const l=Math.hypot(s._dx,s._dy,s._dz)||1;m.position.x+=s._dx/l*.18;m.position.y+=s._dy/l*.18;m.position.z+=s._dz/l*.18;WAR3.stuck.push({m,t:10});
      if(WAR3.stuck.length>40)war3Free(WAR3.stuck.shift().m);}else war3Free(m);}
  for(let i=WAR3.stuck.length-1;i>=0;i--){const S=WAR3.stuck[i];S.t-=dt;if(S.t<=0){war3Free(S.m);WAR3.stuck.splice(i,1);}}}
{const a=updateShots;updateShots=function(dt){a(dt);try{war3Tick(dt);}catch(e){if(!war3Tick.err){war3Tick.err=1;console.error('Pfeile 3D',e);}}};}
// Söldner mit Bogen und Armbrust schießen ebenfalls Pfeile
try{const a=mShoot;mShoot=function(e,q,dmg,o){a(e,q,dmg,o);const c=o&&o.col;if(!(o&&o.aoe)&&(!c||c===0xa09080||c===0xfff0a0)){const s=MSHOTS[MSHOTS.length-1];if(s)s.arrow=1;}};}catch(e){}
// ---------- Skelettschützen: spannen, zielen, schießen ----------
function skAim(arm,st){const p=new Px(36,62),B=pal(['#8a8270','#b8b0a0','#dcd6c8','#f4f0e6']),cx=18,M=hex('#9aa0a8'),ML=hex('#d8dce2'),MD=hex('#4a4e56');
  const bone=(x0,y0,x1,y1,w)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0))||1;for(let k=0;k<=n;k++){const t=k/n;for(let o=0;o<w;o++)p.set(x0+(x1-x0)*t+o,y0+(y1-y0)*t,B[o===0?3:1]);}};
  const ln=(x0,y0,x1,y1,c)=>{const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))||1;for(let k=0;k<=n;k++)p.set(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,c);};
  bone(cx-4,44,cx-6,60,2);bone(cx+3,44,cx+5,60,2);for(let x=cx-5;x<=cx+4;x++){p.set(x,43,B[2]);p.set(x,44,B[1]);}
  bone(cx,24,cx,43,2);for(let k=0;k<5;k++){const y=26+k*3,w=6-Math.abs(k-1)*.6;for(let x=Math.round(cx-w);x<=Math.round(cx+w);x++)p.set(x,y,B[x<cx?3:1]);}
  for(let x=cx-7;x<=cx+7;x++)p.set(x,24,B[2]);
  // Köcher auf dem Rücken
  for(let y=19;y<31;y++)p.set(8,y,hex('#5a3a1c'));p.set(9,19,hex('#e8e0c8'));p.set(8,18,hex('#e8e0c8'));p.set(7,18,hex('#c83a2a'));
  if(arm){for(let y=25;y<41;y++)for(let X=12;X<24;X++){if(y>36&&(X<13||X>22))continue;p.set(X,y,(X+y)%7===0?MD:X<15?ML:M);}for(const X of[14,21])for(const Y of[27,33])p.set(X,Y,MD);}
  for(let y=10;y<23;y++)for(let x=cx-6;x<=cx+5;x++){const dx=(x-cx+.5)/6,dy=(y-16)/7;if(dx*dx+dy*dy>1)continue;p.set(x,y,B[shadeIdx(.75-dx*.3-dy*.2,4,x,y)]);}
  if(arm){for(let y=8;y<14;y++)for(let X=11;X<25;X++){const dx=(X-17.5)/7,dy=(y-13)/5.5;if(dx*dx+dy*dy<=1)p.set(X,y,y===8||X<14?ML:y===13?MD:M);}p.set(17,14,MD);p.set(17,15,MD);for(let X=10;X<26;X++)p.set(X,13,MD);}
  // Blick nach rechts: beide Augen leicht versetzt
  for(const ex of[cx-1,cx+3]){for(let y=15;y<18;y++)for(let x=ex;x<ex+2;x++)p.set(x,y,hex('#1a1410'));p.set(ex+1,16,hex('#ff3a2a'));}
  p.set(cx+1,19,hex('#2a2018'));p.set(cx+2,19,hex('#2a2018'));for(let x=cx-1;x<=cx+4;x++)p.set(x,21,(x&1)?B[3]:hex('#2a2018'));
  // Bogen vorne rechts, Arm ausgestreckt
  const W1=hex('#5a3a18'),W2=hex('#9a6a34'),STR=hex('#e0d8b8');bone(cx+6,25,30,23,2);
  for(let k=-13;k<=13;k++){const x=32-Math.round(3*(k/13)**2);p.set(x,23+k,W1);p.set(x+1,23+k,Math.abs(k)<3?hex('#3a2410'):W2);}
  if(arm)for(const sx of[9,23])for(let y=23;y<27;y++)for(let k=0;k<4;k++)p.set(sx+k,y,y===23?ML:M);
  const nx=st===1?23:st===2?15:null;
  if(nx!=null){ln(29,10,nx,23,STR);ln(29,36,nx,23,STR);for(let x=nx;x<=33;x++)p.set(x,23,hex(x<nx+4?'#d8d0c0':'#c0a070'));p.set(34,22,hex('#9aa0a8'));p.set(34,23,hex('#c8ccd4'));p.set(34,24,hex('#9aa0a8'));p.set(35,23,hex('#eef2f6'));
    p.set(nx+1,22,hex('#c83a2a'));p.set(nx+2,22,hex('#e8e0d0'));p.set(nx+1,24,hex('#e8e0d0'));p.set(nx+2,24,hex('#c83a2a'));
    const el=st===2?[7,23]:[10,28];bone(cx-6,25,el[0],el[1],2);bone(el[0],el[1],nx,24,2);p.set(nx,23,B[3]);p.set(nx-1,23,B[2]);}
  else{ln(29,10,29,36,STR);bone(cx-6,25,8,26,2);bone(8,26,4,19,2);p.set(4,18,B[3]);}
  outline(p);return p.done();}
{const a=craftSprites;craftSprites=function(list){a(list);try{for(const arm of[0,1])for(const st of[1,2,3])list.push(['uskb'+(arm?'a':'')+'_b'+st,skAim(arm,st)]);}catch(e){console.error('Skelettschützen',e);}};}
try{const a=mzArcher;mzArcher=function(e,dt,sq){const c0=e.cast||0,r=a(e,dt,sq);if(!SPR[e.d.spr+'b1'])return r;
  if(e.cast>0)e.frame=e.cast>.4?'b1':'b2';else if(c0>0)e.relT=.38;if(e.relT>0){e.relT-=dt;if(!(e.cast>0))e.frame='b3';}return r;};}catch(e){}
// ---------- Info-Karten ----------
{const a=loreHTML;loreHTML=function(s){let h=a(s);const it=ITEMS[s.id];if(!it)return h;
  if(it.weapon==='bow'){const E=it.ench&&ENCH[it.ench],mx=Math.round(26*1.1*(E&&E.dmg?1+E.dmg:1));h=h.replace(/<div class="st">(Schaden|Tempo|Ausdauer)[\s\S]*?<\/div>/g,'');
    h=h.replace(/(<div class="ty">[\s\S]*?<\/div>)/,`$1<div class="st">Pfeilschaden: <b>${Math.round(26*.3)}–${mx}</b> je nach Spannung</div><div class="st">Voll gespannt nach <b>0,85 s</b> · Ausdauer pro Schuss: <b>4</b></div><div class="st">Rechtsklick halten zum Spannen, loslassen zum Schießen</div>`);}
  if(s.id==='shield'||it.shield)h=h.replace(/(<\/h5>)/,'$1<div class="ty">Schild · Zweithand</div><div class="st">Rechtsklick halten: <b>blocken</b>, 100 % Schutz von vorne</div><div class="st">Halten kostet <b>3</b> Ausdauer pro Sekunde, jeder Treffer etwas mehr</div>');
  return h;};}
{const a=itemInfo;itemInfo=function(id){const r=a(id),it=ITEMS[id];if(it&&it.weapon==='bow')return r.replace(/^\d+ Schaden/,'bis '+Math.round(26*1.1*(it.ench&&ENCH[it.ench].dmg?1+ENCH[it.ench].dmg:1))+' Pfeilschaden');if(id==='shield')return'Rechtsklick: blocken (100 % Schutz)';return r;};}
