/* =========================================================
   0.0.134 · Die Kultisten
   - In Dörfern lebt eine Gruppe aus 3 Kultisten (Coda, Fischer- und Elfendörfer), in Städten 5 bis 7
     (Kaiserstadt, Dungeon-Stadt). Sie tragen tiefe Kapuzenroben, man sieht kein Gesicht.
   - Sie stehen immer zusammen und laufen gemeinsam umher. Sie reden nicht.
   - Nachts (20:30 bis 5:00) suchen sie sich einen Platz etwas abseits der Siedlung, zünden Kerzen und ein Feuer an,
     knien im Kreis, heben die Arme und singen leise. Im Morgengrauen kehren sie zurück.
   ========================================================= */
const CULT={groups:new Map(),t:0,chantT:0};
// ---------- Bild: Kapuzenrobe ohne Gesicht ----------
const CULT_LOOK=[['#14080a','#2a0e12','#44161c','#5e2228'],['#0c0a12','#1c1626','#2e2440','#42365a'],['#120c08','#24180e','#3a2816','#503820']];
function cultSprite(k,f){const W=34,H=60,p=new Px(W,H),cx=17,R=pal(CULT_LOOK[k]),kn=f==='k',up=f==='p',sw=f===1?1:f===2?-1:0,top=kn?14:2;
  const body=(y0,y1,w0,w1)=>{for(let y=y0;y<=y1;y++){const t=(y-y0)/Math.max(1,y1-y0),hw=w0+(w1-w0)*t;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){const fold=((x-cx+sw*t*2)|0)%5===0;p.set(x,y,R[shadeIdx(.62-(x-cx)/(hw*2.6)-(fold?.18:0)+(y>y1-2?-.15:0),R.length,x,y)]);}}};
  // Robe
  if(kn){body(top+12,58,6,13);for(let x=cx-14;x<=cx+14;x++)p.set(x,58,R[0]);}else{body(top+12,58,6.5,12);for(const s of[-1,1])for(let y=56;y<=58;y++)p.set(cx+s*(3+sw*s)+(s<0?-1:1),y,R[0]);}
  // Kapuze (tief, Gesicht im Schatten)
  for(let y=top;y<=top+14;y++){const t=(y-top)/14,hw=t<.35?2+t*16:7.6-(t-.35)*2;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,R[shadeIdx(.75-(x-cx)/18-t*.25,R.length,x,y)]);}
  p.set(cx,top-1,R[2]);for(let y=top+5;y<=top+12;y++){const hw=y<top+7?2:3.2;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,hex('#030204'));}
  // Arme in weiten Ärmeln
  const arm=(x0,y0,x1,y1)=>{const L=Math.hypot(x1-x0,y1-y0)||1,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=2.2+q*1.6;for(let o=-w;o<=w;o+=.5)p.set(X+o,Y,R[shadeIdx(.55-o/8,R.length,Math.round(X+o),Math.round(Y))]);}p.set(x1,y1+(up?-2:2),hex('#b89a80'));};
  if(up){arm(cx-6,top+16,cx-11,top+2);arm(cx+6,top+16,cx+11,top+2);}else if(kn){arm(cx-5,top+17,cx-1,top+24);arm(cx+5,top+17,cx+1,top+24);}else{arm(cx-6,top+16,cx-4,top+28+sw);arm(cx+6,top+16,cx+4,top+28-sw);}
  // Strick um die Hüfte und ein Anhänger
  for(let x=cx-6;x<=cx+6;x++)p.set(x,top+27,hex('#6a5a3a'));p.set(cx+3,top+28,hex('#6a5a3a'));p.set(cx+3,top+29,hex('#8a1a1a'));
  outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(let k=0;k<3;k++)for(const f of[0,1,2,'p','k'])list.push(['cul'+k+'_'+f,cultSprite(k,f)]);}catch(e){console.error('Kultisten: Bilder',e);}};}
for(let k=0;k<3;k++)DT['cul'+k]={name:'Kultist',fac:'neutral',h:1.9,hp:100,dmg:0,spd:1.2,reach:.5,cd:2,spr:'cul'+k+'_',aggro:.01,rad:.32};
// ---------- Wo ist Platz? ----------
function cultBlocked(x,z){if(typeof inWorld==='function'&&x<60000&&!inWorld(x,z)&&!(x>FX0-20))return true;const h=getHeight(x,z);if(h<WATER+.3&&!(Math.hypot(x-TWC.x,z-TWC.z)<TWC.WR))return true;
  if(x>KX0-30&&x<KX1+30&&z>KZ0-30&&z<KZ1+30&&typeof cityBlocked==='function'&&cityBlocked(x,z))return true;
  try{if(collHitXZ(x,z))return true;}catch(e){}
  for(const b of solNear(x,z)){if(b.off||!b.solid||b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)<b.hw+.5&&Math.abs(lz)<b.hd+.5&&b.y1>h+.3&&b.y0<h+1.8)return true;}
  try{for(const t of tgridNear(x,z))if(t.r>0&&Math.hypot(t.x-x,t.z-z)<t.r+.5)return true;}catch(e){}return false;}
function cultClear(ax,az,bx,bz){const L=Math.hypot(bx-ax,bz-az);for(let d=0;d<=L;d+=1){const q=L?d/L:0;if(cultBlocked(ax+(bx-ax)*q,az+(bz-az)*q))return false;}return true;}
function cultSpotOK(x,z,r){if(cultBlocked(x,z))return false;for(let k=0;k<8;k++){const a=k/8*6.283;if(cultBlocked(x+Math.cos(a)*r,z+Math.sin(a)*r))return false;}const h0=getHeight(x,z);for(let k=0;k<4;k++){const a=k*1.57;if(Math.abs(getHeight(x+Math.cos(a)*3,z+Math.sin(a)*3)-h0)>1.4)return false;}return true;}
// Wegsuche auf einem 2-m-Raster (für den Weg zur Zeremonie, z. B. durch das Stadttor)
function* cultPathGen(ax,az,bx,bz){const C=2,M=50,x0=Math.min(ax,bx)-M,z0=Math.min(az,bz)-M,W=Math.ceil((Math.max(ax,bx)+M-x0)/C),H=Math.ceil((Math.max(az,bz)+M-z0)/C);if(W*H>90000)return null;
  const blk=new Int8Array(W*H).fill(-1),isB=(i,j)=>{const k=j*W+i;if(blk[k]<0)blk[k]=cultBlocked(x0+i*C+1,z0+j*C+1)?1:0;return blk[k]===1;};
  const si=Math.floor((ax-x0)/C),sj=Math.floor((az-z0)/C),gi=Math.floor((bx-x0)/C),gj=Math.floor((bz-z0)/C),prev=new Int32Array(W*H).fill(-1),Q=new Int32Array(W*H);let qh=0,qt=0;
  const s0=sj*W+si;prev[s0]=s0;Q[qt++]=s0;let found=-1;const D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let it=0;while(qh<qt){if(++it%250===0)yield 0;const k=Q[qh++],i=k%W,j=(k/W)|0;if(Math.abs(i-gi)<=1&&Math.abs(j-gj)<=1){found=k;break;}
    for(const[di,dj]of D){const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=W||nj>=H)continue;const nk=nj*W+ni;if(prev[nk]>=0||isB(ni,nj))continue;if(di&&dj&&(isB(i+di,j)||isB(i,j+dj)))continue;prev[nk]=k;Q[qt++]=nk;}}
  if(found<0)return null;const pts=[];for(let k=found;k!==s0;k=prev[k])pts.push({x:x0+(k%W)*C+1,z:z0+((k/W)|0)*C+1});pts.reverse();pts.push({x:bx,z:bz});
  // glätten: Punkte überspringen, solange die gerade Linie frei ist
  const out=[];let cx=ax,cz=az,i=0;while(i<pts.length){let j=i;while(j+1<pts.length&&cultClear(cx,cz,pts[j+1].x,pts[j+1].z)&&j-i<12)j++;out.push(pts[j]);cx=pts[j].x;cz=pts[j].z;i=j+1;}return out;}
function cultPath(ax,az,bx,bz){const g=cultPathGen(ax,az,bx,bz);let r;do r=g.next();while(!r.done);return r.value;}
// verteilt die Wegsuche auf mehrere Bilder, damit nichts ruckelt
function cultPathStep(G){if(!G.job)return;const t0=performance.now();let r;do r=G.job.next();while(!r.done&&performance.now()-t0<2);if(r.done){G.job=null;G.path=r.value||[];}}
// ---------- Siedlungen ----------
function cultSettlements(){const L=[{id:'coda',x:CODA.x,z:CODA.z,R:60,n:3,out:[115,150],near:320}];
  if(typeof KX0!=='undefined'){const kx=(KX0+KX1)/2,kz=(KZ0+KZ1)/2;L.push({id:'kaiser',x:kx,z:kz,R:150,n:5+((hash2(WSEED|0,3,8801)*3)|0),out:[0,0],kaiser:1,near:520});}
  L.push({id:'twc',x:TWC.x,z:TWC.z,R:TWC.WR-40,minR:TWC.R+20,n:5+((hash2(WSEED|0,5,8802)*3)|0),out:[TWC.WR-24,TWC.WR-12],near:420});
  for(const B of VLG.built.values())L.push({id:B.g.id,x:B.g.x,z:B.g.z,R:12,n:3,out:[36,58],near:220,vlg:1});return L;}
function cultRitualSpot(S,r){for(let t=0;t<120;t++){let x,z;
    if(S.kaiser){const side=(r()*4)|0,u=r();x=side<2?KX0-28-r()*30:KX1+20+r()*25;z=KZ0+u*(KZ1-KZ0);if(side>=2){x=KX0+u*(KX1-KX0);z=side===2?KZ0-25-r()*25:KZ1+25+r()*25;}}
    else{const a=r()*6.283,d=S.out[0]+r()*(S.out[1]-S.out[0]);x=S.x+Math.cos(a)*d;z=S.z+Math.sin(a)*d;}
    if(cultSpotOK(x,z,3.4))return{x,z};}return null;}
function cultWanderPt(G,r){const S=G.S;for(let t=0;t<40;t++){const a=r()*6.283,d=8+r()*18,x=G.x+Math.cos(a)*d,z=G.z+Math.sin(a)*d,dc=Math.hypot(x-S.x,z-S.z);if(dc>S.R||(S.minR&&dc<S.minR))continue;
    if(S.kaiser){const c=kCat(x,z);if(c<0||c===0||c===1||c===5||c===7||c===8||c===9)continue;}if(!cultSpotOK(x,z,1.6)||!cultClear(G.x,G.z,x,z))continue;return{x,z};}return null;}
function cultMake(S){const r=mulberry32(((WSEED|0)^hash2(S.x|0,S.z|0,8803)*1e9)>>>0),k=(r()*3)|0;let sx=S.x,sz=S.z;
  for(let t=0;t<200;t++){const a=r()*6.283,d=(S.minR||0)+r()*Math.max(4,S.R*.8);const x=S.x+Math.cos(a)*d,z=S.z+Math.sin(a)*d;if(S.kaiser){const c=kCat(x,z);if(c<0||c===0||c===1||c===5||c===7||c===8||c===9)continue;}if(cultSpotOK(x,z,2.2)){sx=x;sz=z;break;}}
  const G={S,x:sx,z:sz,r,mem:[],st:'wait',wt:2+r()*4,tx:sx,tz:sz,stuck:0,props:null,spot:null,night:null};
  for(let i=0;i<S.n;i++){const e=spawnEnt('cul'+k,sx+(r()-.5)*2,sz+(r()-.5)*2,{home:{x:sx,z:sz},name:'Kultist',role:'Kultist · schweigt',talk:0,cult:1,always:true,wander:false});if(!e)continue;
    e.inv=true;e.cg=G;e.ci=i;e.special=cultAI;e.y=groundAt(e.x,e.z,e.y+5);G.mem.push(e);}CULT.groups.set(S.id,G);return G;}
function cultFree(G){for(const e of G.mem)if(DEM.includes(e))removeEnt(e);cultPropsOff(G);CULT.groups.delete(G.S.id);}
// ---------- Zeremonie: Kerzen, Feuer, Zeichen ----------
let CULM=null;function cultMats(){if(CULM)return CULM;CULM={wax:new THREE.MeshLambertMaterial({color:0xd8ccb0}),flame:new THREE.MeshBasicMaterial({color:0xffb040}),fire:new THREE.MeshBasicMaterial({color:0xff6a20}),bowl:new THREE.MeshLambertMaterial({color:0x2a2420}),
  sign:new THREE.MeshBasicMaterial({color:0x6a0a0a,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false})};return CULM;}
function cultPropsOn(G){if(G.props||!G.spot)return;const M=cultMats(),g=new THREE.Group(),{x,z}=G.spot,y=groundAt(x,z,getHeight(x,z)+5);
  const ring=new THREE.Mesh(new THREE.RingGeometry(2.6,2.85,40),M.sign);ring.rotation.x=-Math.PI/2;ring.position.set(x,y+.04,z);g.add(ring);
  for(let k=0;k<5;k++){const a=k/5*6.283-Math.PI/2,b=(k+2)/5*6.283-Math.PI/2,ax=x+Math.cos(a)*2.7,az=z+Math.sin(a)*2.7,bx=x+Math.cos(b)*2.7,bz=z+Math.sin(b)*2.7,L=Math.hypot(bx-ax,bz-az);
    const s=new THREE.Mesh(new THREE.PlaneGeometry(L,.14),M.sign);s.rotation.x=-Math.PI/2;s.rotation.z=-Math.atan2(bz-az,bx-ax);s.position.set((ax+bx)/2,y+.05,(az+bz)/2);g.add(s);
    const cx2=x+Math.cos(a)*3.4,cz2=z+Math.sin(a)*3.4,cy=groundAt(cx2,cz2,y+3);const c=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.34,6),M.wax);c.position.set(cx2,cy+.17,cz2);g.add(c);const fl=new THREE.Mesh(new THREE.BoxGeometry(.07,.12,.07),M.flame);fl.position.set(cx2,cy+.4,cz2);g.add(fl);}
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.45,.3,.4,8),M.bowl);bowl.position.set(x,y+.2,z);g.add(bowl);const fire=new THREE.Mesh(new THREE.BoxGeometry(.45,.35,.45),M.fire);fire.position.set(x,y+.55,z);g.add(fire);
  const L=new THREE.PointLight(0xff4a1a,1.3,14,1.6);L.position.set(x,y+1.4,z);g.add(L);scene.add(g);G.props={g,fire,L,y};}
function cultPropsOff(G){if(!G.props)return;scene.remove(G.props.g);G.props.g.traverse(o=>{if(o.geometry)o.geometry.dispose();});G.props=null;}
// ---------- Verhalten der Gruppe ----------
const CULT_SLOTS=[[0,0],[.95,-.7],[-.95,-.7],[0,-1.5],[1.2,-1.7],[-1.2,-1.7],[0,-2.5]];
const cultNight=()=>{const c=FLAGS.clock||0;return c>=1230||c<300;};
function cultGroupTick(G,dt){const r=G.r,S=G.S,night=cultNight(),far=Math.hypot(P.x-G.x,P.z-G.z)>55;
  if(night&&G.night!==FLAGS.day+(FLAGS.clock<720?-1:0)){G.night=FLAGS.day+(FLAGS.clock<720?-1:0);G.spot=cultRitualSpot(S,r);if(G.spot){G.st='go';G.tx=G.spot.x;G.tz=G.spot.z;G.stuck=0;G.path=null;G.job=null;}}
  if(!night&&(G.st==='go'||G.st==='rite')){cultPropsOff(G);G.st='home';const p=cultWanderPt(Object.assign({},G,{x:S.x,z:S.z}),r)||{x:S.x,z:S.z};G.tx=p.x;G.tz=p.z;G.stuck=0;G.path=null;G.job=null;}
  if(G.st==='wait'){G.wt-=dt;if(G.wt<=0){const p=cultWanderPt(G,r);if(p){G.tx=p.x;G.tz=p.z;G.st='walk';G.stuck=0;}else G.wt=2;}}
  if(G.st==='walk'||G.st==='go'||G.st==='home'){if((G.st==='go'||G.st==='home')&&!G.path&&!G.job&&!far)G.job=cultPathGen(G.x,G.z,G.tx,G.tz);if(G.job){cultPathStep(G);if(G.job)return;}
    if(G.path&&G.path.length&&Math.hypot(G.path[0].x-G.x,G.path[0].z-G.z)<1){G.path.shift();G.fails=0;}if(G.wp&&Math.hypot(G.wp.x-G.x,G.wp.z-G.z)<.8)G.wp=null;
    const T=G.wp||(G.path&&G.path.length?G.path[0]:{x:G.tx,z:G.tz}),dx=T.x-G.x,dz=T.z-G.z,d=G.wp||(G.path&&G.path.length>1)?99:Math.hypot(dx,dz),dd=Math.hypot(dx,dz)||1;
    // Die Gruppe wartet auf den Langsamsten
    const lag=Math.max(...G.mem.map(e=>Math.hypot(e.x-G.x,e.z-G.z)));const pd=Math.hypot(P.x-G.x,P.z-G.z);G.fast=pd>45&&G.st!=='walk';const sp=lag>3.5?.25:(G.st==='walk'?1.05:1.45)*(pd>45?2.6:1);
    if(d<.6){G.path=null;G.job=null;if(G.st==='go'){G.st='rite';G.rt=0;cultPropsOn(G);}else{G.st='wait';G.wt=4+r()*8;}}
    else{const st=Math.min(dd,sp*dt),nx=G.x+dx/dd*st,nz=G.z+dz/dd*st;if(cultBlocked(nx,nz)&&!far){const sx=G.x+Math.sign(dx)*st,sz=G.z+Math.sign(dz)*st;if(Math.abs(dx)>.05&&!cultBlocked(sx,G.z)){G.x=sx;G.stuck+=dt*.3;}else if(Math.abs(dz)>.05&&!cultBlocked(G.x,sz)){G.z=sz;G.stuck+=dt*.3;}else G.stuck+=dt;}else{G.x=nx;G.z=nz;G.stuck=0;}
      if(G.stuck>1.2){G.stuck=0;G.wp=null;G.fails=(G.fails||0)+1;let ok=false;
        if(G.st!=='walk'&&G.fails>3){const T2=G.path&&G.path.length?G.path[0]:{x:G.tx,z:G.tz};G.x=T2.x;G.z=T2.z;for(const e of G.mem){e.x=G.x+(r()-.5)*1.5;e.z=G.z+(r()-.5)*1.5;}G.fails=0;ok=true;}
        else if(G.st!=='walk'&&!far){G.path=null;G.job=null;G.job=cultPathGen(G.x,G.z,G.tx,G.tz);ok=true;}
        if(!ok){
        // Umweg suchen: freier Punkt in der Nähe, der näher ans Ziel führt
        let best=null,bs=1e9;for(let k=0;k<20;k++){const a=k/20*6.283,R=5+(k%3)*4,x=G.x+Math.cos(a)*R,z=G.z+Math.sin(a)*R;if(cultBlocked(x,z)||!cultClear(G.x,G.z,x,z))continue;const sc=Math.hypot(G.tx-x,G.tz-z)+r()*3;if(sc<bs){bs=sc;best={x,z};}}
        if(best)G.wp=best;else if(far&&(G.st==='go'||G.st==='home')){G.x=G.tx;G.z=G.tz;for(const e of G.mem){e.x=G.x+(r()-.5)*2;e.z=G.z+(r()-.5)*2;}}else if(G.st==='walk'){G.st='wait';G.wt=3;}}}
      G.hd=Math.atan2(dx,dz);}}
  if(G.st==='rite'){G.rt+=dt;const pr=G.props;if(pr){pr.fire.scale.y=1+Math.sin(time*13)*.25;pr.L.intensity=1.1+Math.sin(time*9)*.25;
      if(Math.random()<dt*10)spawnParticle(G.spot.x+(Math.random()-.5)*.4,pr.y+.8,G.spot.z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.2+Math.random(),(Math.random()-.5)*.3,Math.random()<.5?0xff5a1a:0x8a1aff,.35,.3);}}}
function cultAI(e,dt){const G=e.cg;if(!G)return true;e.noPath=1;let tx,tz;
  if(G.st==='rite'&&G.spot){const n=G.mem.length,a=e.ci/n*6.283;tx=G.spot.x+Math.cos(a)*1.9;tz=G.spot.z+Math.sin(a)*1.9;}
  else{const s=CULT_SLOTS[e.ci%CULT_SLOTS.length],h=G.hd||0,c=Math.cos(h),sn=Math.sin(h);tx=G.x+s[0]*c+s[1]*sn;tz=G.z-s[0]*sn+s[1]*c;}
  const d=Math.hypot(tx-e.x,tz-e.z);
  if(d>.25){entMove(e,tx,tz,Math.max(e.d.spd,d>.8?(G.fast?4:1.7):1)*(d>4?1.8:1),dt);e.anim=(e.anim||0)+dt*5;e.frame=[1,0,2,0][Math.floor(e.anim)%4];if(d>25&&Math.hypot(P.x-e.x,P.z-e.z)>50){e.x=tx;e.z=tz;}}
  else if(G.st==='rite'){const ph=(G.rt*.5+e.ci*.37)%2;e.frame=ph<1.1?'k':'p';}
  else e.frame=0;return true;}
// ---------- Takt ----------
function cultTick(dt){CULT.t-=dt;if(CULT.t<=0){CULT.t=1.5;if(P.x<60000&&!DGX.on){const want=new Set();for(const S of cultSettlements()){const d=Math.hypot(S.x-P.x,S.z-P.z);if(d<S.near){want.add(S.id);if(!CULT.groups.has(S.id))cultMake(S);}}
      for(const G of[...CULT.groups.values()])if(!want.has(G.S.id)){const d=Math.hypot(G.S.x-P.x,G.S.z-P.z);if(d>G.S.near+80||(G.S.vlg&&!VLG.built.has(G.S.id)))cultFree(G);}}
    else for(const G of[...CULT.groups.values()])cultFree(G);}
  for(const G of CULT.groups.values())cultGroupTick(G,dt);
  // leiser Gesang bei der Zeremonie
  CULT.chantT-=dt;if(CULT.chantT<=0){CULT.chantT=3.6;for(const G of CULT.groups.values())if(G.st==='rite'&&G.spot){const d=Math.hypot(P.x-G.spot.x,P.z-G.spot.z);if(d<40&&state==='playing'){const v=.035*(1-d/40),c=Snd.ctx;if(c){const t=c.currentTime;try{for(const[f,dl]of[[98,0],[146.8,.6],[116.5,1.6]])Snd.tone('sawtooth',f,t+dl,2.4,v);}catch(_){}}break;}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{cultTick(dt);}catch(e){if(!cultTick.err){cultTick.err=1;console.error('Kultisten',e);}}};}
{const a=startGame;startGame=function(){for(const G of[...CULT.groups.values()])cultFree(G);return a.apply(this,arguments);};}
// Sie reden nicht
function cultLooked(){for(const G of CULT.groups.values())for(const e of G.mem)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.4,.8))return e;return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&P.x<60000){const e=cultLooked();if(e){say(e,'…',2);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000&&cultLooked())return'Ein Kultist. Er schweigt.';return a();};}
// Teleport zum Testen: /kult
HELP.push(['/kult','Zur nächsten Kultisten-Gruppe (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/kult\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/kult geht nur im Cheat-Modus.','err');return;}let best=null,bd=1e9;for(const G of CULT.groups.values()){const d=Math.hypot(G.x-P.x,G.z-P.z);if(d<bd){bd=d;best=G;}}
    if(!best){conLog('Keine Kultisten in der Nähe. Geh in ein Dorf oder eine Stadt.','err');return;}teleport(best.x+5,best.z+5,0);closeConsole();conLog('Bei den Kultisten.','ok');return;}return a(raw);};}
