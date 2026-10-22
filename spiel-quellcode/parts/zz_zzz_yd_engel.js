/* =========================================================
   0.0.133 · Die Engel
   - Engel sind weiße Gestalten aus Licht, ohne Gesicht, mit riesigen Schwingen. Sie leben im Himmel und wachen über die Welt.
     Sie sind die mächtigsten Wesen im Spiel: Ein Skelett passt in ihre Hand.
   - An Feiertagen (Neujahr, Ostern, Himmelfahrt, Pfingsten, Allerheiligen, Weihnachten, Silvester) zieht manchmal ein Engel fern über den Himmel.
   - Ultra selten rettet ein Engel einen Spieler in Lebensgefahr (unter 7 % Leben, mindestens 3 Monster, Prüfung alle 30 s,
     danach mindestens 2 Spieltage Pause): Er kreist um ihn, schlägt die Monster meterweit weg,
     packt Skelette und wirft sie fort und verschwindet so schnell, wie er gekommen ist.
   - Beim Priester Corvin gibt es ein Kreuz. Rechte Maustaste gedrückt halten: beten (1 Mana pro Sekunde).
     Wer viel betet, regeneriert danach 15 Minuten lang schneller (Leben, Ausdauer, Mana) und begegnet Engeln eher.
     Glaubensstufen nach Gebetszeit: 20 Min., 100 Min., 5 Std., 10 Std., 20 Std.
   - Wer nachts lange betet, wird ganz selten von einem Engel gesegnet. Noch seltener bleibt der Engel als Schutzengel:
     Er rettet dich kurz vor dem Tod, auch gegen andere Spieler. Danach (wie nach jeder Rettung) 2 Spieltage Pause.
   - Beim Blutmond zeigt sich nie ein Engel.
   - Mehrspieler: Alle sehen den Engel eines Mitspielers genau so, wie er fliegt (Position, Haltung, Licht, Lichtsäule).
     Monster, die er wegschlägt, packt oder wirft, bewegt der Host, damit sie bei allen gleich fliegen.
     Himmelsflüge an Feiertagen würfelt der Host; alle in der Nähe sehen denselben Engel.
   ========================================================= */
const ANG={a:null,rp:{},fl:[],tex:null,haloTex:null,pray:false,prayT:0,skyT:60,dangerT:0,chimeT:0};
const FAITH=[[0,'Zweifler'],[1200,'Suchender'],[6000,'Gläubiger'],[18000,'Andächtiger'],[36000,'Frommer'],[72000,'Heiliger']];// Sekunden Gebet: 20 Min., 100 Min., 5 Std., 10 Std., 20 Std.
function faithTier(){const s=FLAGS.pray||0;let t=0;for(let i=0;i<FAITH.length;i++)if(s>=FAITH[i][0])t=i;return t;}
// ---------- Bild: Engel aus Licht ----------
function angelSprite(f){const W=260,H=180,p=new Px(W,H),cx=130,B=pal(['#8e98b0','#adb7cb','#cbd2e0','#e2e7ef','#f3f5f9','#ffffff']),WG=pal(['#76829c','#97a3bb','#b7c1d3','#d4dbe6','#ebeef4','#ffffff']);
  const ell=(x0,y0,rx,ry,pl,b)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;p.set(x,y,pl[shadeIdx((b||.8)-dx*.3-dy*.3,pl.length,x,y)]);}};
  const limb=(x0,y0,x1,y1,w0,w1,pl,b)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=w0+(w1-w0)*q;for(let o=-w/2;o<=w/2;o+=.5)p.set(X+nx*o,Y+ny*o,pl[shadeIdx((b||.82)-o/(w+1)*.35,pl.length,Math.round(X+nx*o),Math.round(Y+ny*o))]);}};
  // Flügel
  const WP={u:[[40,14],[92,0]],m:[[46,40],[97,44]],d:[[44,62],[90,110]],b:[[22,40],[32,150]],s:[[48,26],[98,8]]};
  const wk=f==='h0'?'u':f==='h1'?'m':f==='h2'?'d':f==='dv'?'b':f==='bl'?'s':'m';
  for(const s of[-1,1]){const[E,T]=WP[wk],rx=cx+s*8,ry=52,ex=cx+s*E[0],ey=E[1],tx=cx+s*T[0],ty=T[1];
    const pts=[];for(let k=0;k<=34;k++){const q=k/34,a=q<.5?q*2:1,b2=q<.5?0:(q-.5)*2;const x=q<.5?rx+(ex-rx)*a:ex+(tx-ex)*b2,y=q<.5?ry+(ey-ry)*a:ey+(ty-ey)*b2;pts.push([x,y,q]);}
    pts.forEach(([x,y,q],k)=>{const L=wk==='b'?16+q*26:18+q*46,dx=wk==='b'?s*.3:s*(.12+q*.6),dy=wk==='u'?1:wk==='d'?.8:1;const l=Math.hypot(dx,dy),x2=x+dx/l*L,y2=y+dy/l*L;limb(x,y,x2,y2,6.5,3,WG,.92-q*.12-(k%2)*.1);if(k%2===0)limb(x+dx/l*L*.25,y+dy/l*L*.25,x2,y2,1,1,WG,.25);});
    for(const[x,y,q]of pts)if(q>.06){const L=7+q*12;limb(x,y,x+s*.2*L,y+L,6,3.5,WG,.99);}
    for(let k=0;k<pts.length-1;k++)limb(pts[k][0],pts[k][1],pts[k+1][0],pts[k+1][1],6,5,WG,1.05);}
  // Gewand und Beine aus Licht
  for(let y=86;y<=172;y++){const t=(y-86)/86,hw=12+t*16;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){const fold=Math.abs(Math.sin((x-cx)*.42+t*2));if(t>.82&&hash2(x,y,601)<(t-.82)*5)continue;p.set(x,y,B[shadeIdx(.9-(x-cx)/(hw*2.2)-(fold<.15?.25:0)+(t>.8?.1:0),B.length,x,y)]);}}
  ell(cx,66,15,22,B,.86);limb(cx-16,50,cx+16,50,9,9,B,.9);limb(cx,38,cx,48,6,8,B,.9);ell(cx,28,9,11,B,.98);
  // Arme
  const arm=(sx,sy,ex,ey,hx,hy)=>{limb(sx,sy,ex,ey,6,5,B,.86);limb(ex,ey,hx,hy,5,4,B,.88);ell(hx,hy,3.5,4.5,B,.96);};
  if(f==='st'){arm(cx-14,50,cx-20,78,cx-17,98);arm(cx+14,50,cx+42,54,cx+74,44);for(let k=0;k<4;k++)limb(cx+74,44,cx+82+k*2,34+k*5,2.5,1.5,B,.98);}
  else if(f==='ho'){arm(cx-14,50,cx-20,78,cx-17,98);arm(cx+14,50,cx+28,26,cx+34,6);for(let k=0;k<4;k++)limb(cx+34,6,cx+26+k*5,0,2.2,1.5,B,.98);}
  else if(f==='bl'){arm(cx-14,50,cx-38,68,cx-56,80);arm(cx+14,50,cx+38,68,cx+56,80);}
  else if(f==='dv'){arm(cx-14,50,cx-18,74,cx-14,96);arm(cx+14,50,cx+18,74,cx+14,96);}
  else arm(cx-14,50,cx-20,78,cx-17,99),arm(cx+14,50,cx+20,78,cx+17,99);
  // Lichtsaum statt dunkler Kontur
  const d=p.d,A=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&d[(y*W+x)*4+3]>0,rim=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!A(x,y)&&(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1)))rim.push([x,y]);
  for(const[x,y]of rim){const i=(y*W+x)*4;d[i]=255;d[i+1]=246;d[i+2]=214;d[i+3]=150;}return p.done();}
function angGlowTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,252,236,0.85)');g.addColorStop(.3,'rgba(255,246,214,0.38)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function angTex(f){if(!ANG.tex){ANG.tex={};for(const k of['h0','h1','h2','dv','st','ho','bl']){const t=new THREE.CanvasTexture(angelSprite(k));t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;ANG.tex[k]=t;}ANG.haloTex=angGlowTex();}return ANG.tex[f];}
// ---------- Ein Engel in der Welt ----------
const ANG_H=11;
function angMake(mode,o){angTex('h0');const mat=new THREE.MeshBasicMaterial({map:ANG.tex.h0,transparent:true,alphaTest:.04,depthWrite:false,fog:false,side:THREE.DoubleSide}),m=new THREE.Mesh(new THREE.PlaneGeometry(ANG_H*260/180,ANG_H),mat);
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ANG.haloTex,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));m.renderOrder=5;halo.renderOrder=4;m.frustumCulled=halo.frustumCulled=false;scene.add(halo);scene.add(m);
  const A=Object.assign({mode,t:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,m,halo,frame:'h0',act:null,actT:0,fade:1,ph:'arrive'},o||{});
  if(o&&o.light){A.light=new THREE.PointLight(0xfff4d8,2.4,40,1.4);scene.add(A.light);}return A;}
function angFree(A){if(!A)return;for(const o of[A.m,A.halo]){scene.remove(o);o.geometry.dispose();o.material.dispose();}if(A.light)scene.remove(A.light);if(A.beam){scene.remove(A.beam);A.beam.geometry.dispose();}}
function angSteer(A,tx,ty,tz,sp,dt,k){const dx=tx-A.x,dy=ty-A.y,dz=tz-A.z,d=Math.hypot(dx,dy,dz)||1,v=Math.min(sp,d*3);A.vx+=(dx/d*v-A.vx)*Math.min(1,dt*(k||4));A.vy+=(dy/d*v-A.vy)*Math.min(1,dt*(k||4));A.vz+=(dz/d*v-A.vz)*Math.min(1,dt*(k||4));
  A.x+=A.vx*dt;A.y+=A.vy*dt;A.z+=A.vz*dt;return d;}
function angDraw(A,dt){const fl=['h0','h1','h2','h1'][Math.floor(A.t*5)%4],f=A.forceF?A.forceF:A.act==='st'?'st':A.act==='ho'?'ho':A.mode==='bless'&&A.ph==='bless'?'bl':Math.hypot(A.vx,A.vz)>35||A.vy<-25?'dv':fl;
  if(f!==A.frame){A.frame=f;A.m.material.map=angTex(f);A.m.material.needsUpdate=true;}A.m.position.set(A.x,A.y,A.z);A.m.quaternion.copy(camera.quaternion);A.m.material.opacity=A.fade;
  A.halo.position.set(A.x,A.y+1,A.z);A.halo.quaternion.copy(camera.quaternion);const hs=ANG_H*2.3*(1+Math.sin(A.t*3)*.04);A.halo.scale.set(hs,hs,1);A.halo.material.opacity=A.fade*(A.mode==='sky'?.8:.9);
  if(A.light){A.light.position.set(A.x,A.y,A.z);A.light.intensity=2.4*A.fade;}if(A.mode!=='sky'&&Math.random()<dt*14)spawnParticle(A.x+(Math.random()-.5)*6,A.y-ANG_H*.3+Math.random()*ANG_H*.6,A.z+(Math.random()-.5)*6,(Math.random()-.5)*.6,-.4-Math.random(),(Math.random()-.5)*.6,Math.random()<.5?0xffffff:0xfff2c8,.35,.2);}
// Rechte Hand im Bild (für Greifen)
function angHand(A){const cam=camera,r=new THREE.Vector3(1,0,0).applyQuaternion(cam.quaternion),u=new THREE.Vector3(0,1,0).applyQuaternion(cam.quaternion),s=ANG_H/180;return[A.x+r.x*34*s+u.x*84*s,A.y+r.y*34*s+u.y*84*s,A.z+r.z*34*s+u.z*84*s];}
// ---------- Gegner wegschleudern ----------
function angHostiles(x,z,R){return DEM.filter(e=>e.fac==='demon'&&!e.dead&&!e.dormant&&!e.proxy&&!e.inv&&!e.hidden&&Math.hypot(e.x-x,e.z-z)<R&&!ANG.fl.some(f=>f.e===e));}
function angFling(e,fromX,fromZ,dist,dmg,h,cr){if(!e||e.dead)return;
  if(e.mirror&&isClient()&&!e.d.boss){try{mpSend({t:'afl',k:'fling',u:e.mirror,fx:+fromX.toFixed(2),fz:+fromZ.toFixed(2),dist,dmg,h:h||0},MP.hostPeer());Snd.boom(.22);Snd.whoosh(300,.12);}catch(_){}return;}
  if(e.mirror||e.d.boss){hurtEnt(e,dmg,'player');for(let k=0;k<16;k++)spawnParticle(e.x,e.y+1,e.z,(Math.random()-.5)*6,Math.random()*4,(Math.random()-.5)*6,0xfff4d8,.5,.3);return;}
  const dx=e.x-fromX,dz=e.z-fromZ,l=Math.hypot(dx,dz)||1;let x1=e.x+dx/l*dist,z1=e.z+dz/l*dist;if(typeof inWorld==='function'&&!inWorld(x1,z1)){x1=e.x+dx/l*3;z1=e.z+dz/l*3;}
  ANG.fl.push({e,x0:e.x,y0:e.y,z0:e.z,x1,z1,t:0,T:.55+dist/40,h:h||5+dist*.25,dmg,cr});try{Snd.boom(.22);Snd.whoosh(300,.12);}catch(_){}}
{const a=updateDemons;updateDemons=function(dt){a(dt);try{for(let i=ANG.fl.length-1;i>=0;i--){const F=ANG.fl[i],e=F.e;if(!DEM.includes(e)){ANG.fl.splice(i,1);continue;}
      if(F.hold){const[hx,hy,hz]=angHand(F.hold);e.x=hx;e.z=hz;e.y=hy-e.h*.6;e.rot=Math.sin(time*9)*.25;continue;}
      if(F.holdR){const R=ANG.rp[F.holdR];if(R&&R.h&&time-R.last<2){e.x=R.h[0];e.z=R.h[2];e.y=R.h[1]-e.h*.6;e.rot=Math.sin(time*9)*.25;continue;}F.holdR=null;F.x0=e.x;F.y0=e.y;F.z0=e.z;F.x1=e.x;F.z1=e.z;F.t=0;F.T=.6;F.h=0;}
      F.t+=dt;const q=Math.min(1,F.t/F.T),y1=groundAt(F.x1,F.z1,F.y0+40);e.x=F.x0+(F.x1-F.x0)*q;e.z=F.z0+(F.z1-F.z0)*q;e.y=F.y0+(y1-F.y0)*q+Math.sin(q*Math.PI)*F.h;e.rot=q*7;
      if(q>=1){e.rot=0;e.y=y1;ANG.fl.splice(i,1);if(F.cr!=null&&typeof mpHostHit==='function')mpHostHit({r:['dem',e._u],n:F.dmg},F.cr);else hurtEnt(e,F.dmg,'player');try{Snd.thud();}catch(_){}for(let k=0;k<14;k++)spawnParticle(e.x,e.y+.3,e.z,(Math.random()-.5)*5,1+Math.random()*3,(Math.random()-.5)*5,0x8a7a62,.6,.35);}}}catch(e){if(!ANG.ferr){ANG.ferr=1;console.error('Engel',e);}}};}
// ---------- Ablauf ----------
function angOutdoors(){return!DGX.on&&P.x<60000&&!(typeof caveCur!=='undefined'&&caveCur)&&state==='playing';}
function angBloodMoon(){try{const c=FLAGS.clock||0,n=c<720?(FLAGS.day||0)-1:(FLAGS.day||0);return moonFor(n).ev==='blood'&&(c>=1150||c<360);}catch(e){return false;}}
// Nach einem Herabsteigen (Rettung oder Segen) kommt mindestens 2 Spieltage lang kein Engel mehr herab
const angRested=()=>FLAGS.angDay==null||(FLAGS.day||0)-FLAGS.angDay>=2;
const angNight=()=>{const c=FLAGS.clock||0;return c>=1200||c<330;};
function angHoliday(){const d=new Date(),m=d.getMonth()+1,day=d.getDate(),y=d.getFullYear();if(m===1&&day===1)return'Neujahr';if(m===12&&day===31)return'Silvester';if(m===12&&day>=24&&day<=26)return'Weihnachten';if(m===11&&day===1)return'Allerheiligen';
  const a=y%19,b=Math.floor(y/100),c=y%100,dd=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-dd-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,mm=Math.floor((a+11*h+22*l)/451),em=Math.floor((h+l-7*mm+114)/31),ed=((h+l-7*mm+114)%31)+1;
  const easter=Date.UTC(y,em-1,ed),today=Date.UTC(y,m-1,day),off=Math.round((today-easter)/864e5);if(off>=-2&&off<=1)return'Ostern';if(off===39)return'Christi Himmelfahrt';if(off===49||off===50)return'Pfingsten';return null;}
function angBroadcast(k,dur){try{if(MP.on&&MP.ready)mpSend({t:'ang',k,pid:MP.pid,dur});}catch(_){}}
function angStart(mode,opt){if(ANG.a)return null;const o=opt||{};
  if(mode==='sky'){const C=o.c||[P.x,P.y,P.z],D=Math.min(230,camera.far*.62),a=Math.random()*6.283,b=a+Math.PI+(Math.random()-.5)*1.2,gy=C[1]+70+Math.random()*60;
    const A=angMake('sky');A.x=C[0]+Math.cos(a)*D;A.z=C[2]+Math.sin(a)*D;A.y=gy;A.ex=C[0]+Math.cos(b)*D;A.ez=C[2]+Math.sin(b)*D;A.ey=gy+(Math.random()-.5)*30;A.sp=48+Math.random()*24;A.wig=Math.random()*6;ANG.a=A;
    try{if(MP.on&&MP.ready)mpSend({t:'angsky',p:[A.x,A.y,A.z,A.ex,A.ey,A.ez,A.sp,A.wig].map(v=>+v.toFixed(2))});}catch(_){}
    if(!FLAGS.angSeen){FLAGS.angSeen=1;setTimeout(()=>showArea('Ein Engel am Himmel'),600);}return A;}
  const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),A=angMake(mode,{light:true});ANG.a=A;
  if(mode==='rescue'){const a=Math.random()*6.283;A.x=P.x+Math.cos(a)*40;A.z=P.z+Math.sin(a)*40;A.y=P.y+75;A.orb=a;A.guard=!!o.guard;A.until=o.guard?14:12;
    showArea(o.guard?'Dein Schutzengel!':'Ein Engel steigt herab!');try{Snd.shimmer();Snd.chime();}catch(_){}angBroadcast('rescue',A.until);
    const S=P.stats;if(S)S.hp=Math.max(S.hp,S.maxHp*(o.guard?.5:.3));renderStats&&renderStats();}
  if(mode==='bless'){A.x=P.x+fx*6;A.z=P.z+fz*6;A.y=P.y+60;showArea('Ein Licht senkt sich vom Himmel …');try{Snd.shimmer();}catch(_){}angBroadcast('bless',10);}
  FLAGS.angT=Date.now();if(mode==='rescue'||mode==='bless')FLAGS.angDay=FLAGS.day||0;return A;}
function angTick(dt){const A=ANG.a;if(A){A.t+=dt;
  if(A.mode==='sky'){const D=Math.hypot(A.ex-A.x,A.ez-A.z),dx=(A.ex-A.x)/(D||1),dz=(A.ez-A.z)/(D||1);A.vx=dx*A.sp+Math.cos(A.t*.7+A.wig)*-dz*8;A.vz=dz*A.sp+Math.cos(A.t*.7+A.wig)*dx*8;A.vy=(A.ey-A.y)*.3+Math.sin(A.t*1.3)*4;A.x+=A.vx*dt;A.y+=A.vy*dt;A.z+=A.vz*dt;
    if(D<8||A.t>40){A.fade-=dt*.8;}if(A.fade<=0||angBloodMoon()){angFree(A);ANG.a=null;return;}angDraw(A,dt);return;}
  if(A.ph==='leave'){angSteer(A,A.x+A.lx*30,A.y+80,A.z+A.lz*30,95,dt,3);A.fade-=dt*.7;for(const F of ANG.fl)if(F.hold){F.hold=null;F.t=0;}if(A.fade<=0){angFree(A);ANG.a=null;return;}angDraw(A,dt);return;}
  const gy=groundAt(P.x,P.z,P.y+2);
  if(A.mode==='rescue'){if(A.ph==='arrive'){const d=angSteer(A,P.x+Math.cos(A.orb)*5.5,gy+5,P.z+Math.sin(A.orb)*5.5,85,dt,5);if(d<3||A.t>3){A.ph='guard';A.gt=0;try{Snd.boom(.35);}catch(_){}
        for(const e of angHostiles(P.x,P.z,7))angFling(e,P.x,P.z,10,140,4);}}
    else if(A.ph==='guard'){A.gt+=dt;A.actT-=dt;
      if(A.act==='lunge'){const e=A.tg;if(!e||e.dead||!DEM.includes(e)){A.act=null;}else{const d=angSteer(A,e.x+(A.x-e.x)*.15,e.y+5,e.z+(A.z-e.z)*.15,70,dt,7);if(d<4.5||A.actT<-1){A.act='st';A.actT=.35;angFling(e,P.x,P.z,13+Math.random()*7,260,6);}}}
      else if(A.act==='grab'){const e=A.tg;if(!e||e.dead||!DEM.includes(e)){A.act=null;}else{const d=angSteer(A,e.x,e.y+ANG_H*.45,e.z,60,dt,7);if(d<3||A.actT<-1.2){A.act='ho';A.actT=1.2;A.hold=e;if(e.mirror&&isClient()){try{mpSend({t:'afl',k:'hold',u:e.mirror,pid:MP.pid},MP.hostPeer());}catch(_){}}else ANG.fl.push({e,hold:A});try{Snd.whoosh(500,.1);}catch(_){}}}}
      else if(A.act==='ho'){angSteer(A,A.x,gy+12,A.z,8,dt,3);if(A.actT<=0){const F=ANG.fl.find(f=>f.e===A.hold);if(!F&&A.hold&&A.hold.mirror&&isClient()){const e=A.hold,dx=e.x-P.x,dz=e.z-P.z,l=Math.hypot(dx,dz)||1;try{mpSend({t:'afl',k:'throw',u:e.mirror,tx:+(e.x+dx/l*24).toFixed(2),tz:+(e.z+dz/l*24).toFixed(2),dmg:320},MP.hostPeer());}catch(_){}}if(F){F.hold=null;const e=F.e,dx=e.x-P.x,dz=e.z-P.z,l=Math.hypot(dx,dz)||1;F.x0=e.x;F.y0=e.y;F.z0=e.z;F.x1=e.x+dx/l*24;F.z1=e.z+dz/l*24;F.t=0;F.T=1.2;F.h=6;F.dmg=320;}A.hold=null;A.act='st';A.actT=.35;try{Snd.whoosh(250,.16);}catch(_){}}}
      else{if(A.act==='st'&&A.actT<=0)A.act=null;A.orb+=dt*2.3;angSteer(A,P.x+Math.cos(A.orb)*5.5,gy+5+Math.sin(A.t*2)*.6,P.z+Math.sin(A.orb)*5.5,60,dt,6);
        if(!A.act&&A.actT<=0){const L=angHostiles(P.x,P.z,16).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z));
          if(L.length){A.quiet=0;const e=L[0];A.tg=e;A.actT=.5;if(!e.mirror&&!e.d.boss&&e.h<2.4&&Math.random()<.3)A.act='grab';else A.act='lunge';}else A.quiet=(A.quiet||0)+dt;
          // andere Spieler, die dich bedrohen, schubst der Schutzengel weg
          if(A.guard&&MP.on)for(const R of REMOTE.values()){if(time-R.seen<5&&ANG.foes&&ANG.foes[R.pid]>time-10&&Math.hypot(R.x-P.x,R.z-P.z)<9){const dx=R.x-P.x,dz=R.z-P.z,l=Math.hypot(dx,dz)||1;try{mpBhit(R.pid,{n:12,kx:dx/l*16,kz:dz/l*16,vy:8});}catch(_){}ANG.foes[R.pid]=0;A.act='st';A.actT=.35;}}}}
      if(A.gt>A.until||(A.quiet||0)>2.2&&A.gt>4){A.ph='leave';const a=Math.random()*6.283;A.lx=Math.cos(a);A.lz=Math.sin(a);try{Snd.chime();}catch(_){}}}}
  if(A.mode==='bless'){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);if(A.ph==='arrive'){const d=angSteer(A,A.hx??(A.hx=P.x+fx*5.5),gy+4.5,A.hz??(A.hz=P.z+fz*5.5),14,dt,2);if(d<1.2||A.t>9){A.ph='bless';A.bt=0;}}
    else if(A.ph==='bless'){A.bt+=dt;angSteer(A,A.hx,gy+4.5+Math.sin(A.t)*.3,A.hz,4,dt,2);if(Math.random()<dt*30)spawnParticle(P.x+(Math.random()-.5)*1.2,P.y+Math.random()*2,P.z+(Math.random()-.5)*1.2,0,1+Math.random(),0,Math.random()<.5?0xfff4c8:0xffffff,.3,.15);
      if(!A.beam){A.beam=new THREE.Mesh(new THREE.CylinderGeometry(.6,1.2,1,12,1,true),new THREE.MeshBasicMaterial({color:0xfff4d8,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));scene.add(A.beam);}
      const top=A.y,bot=P.y;A.beam.position.set((A.x+P.x)/2,(top+bot)/2,(A.z+P.z)/2);A.beam.scale.set(1,Math.max(.5,top-bot),1);A.beam.lookAt(A.x,top,A.z);A.beam.rotateX(Math.PI/2);
      if(A.bt>2.5&&!A.done){A.done=1;angBlessGive();}if(A.bt>5){A.ph='leave';A.lx=fx;A.lz=fz;if(A.beam){scene.remove(A.beam);A.beam.geometry.dispose();A.beam=null;}}}}
  angDraw(A,dt);}}
// Segen und Schutzengel
BUFF_LABEL.bless=['Segen des Engels','#fff4c0'];BUFF_LABEL.pray=['Andacht','#e8d8a0'];
function angBlessGive(){const S=P.stats;if(S){S.hp=S.maxHp;S.st=S.maxSt;S.mp=S.maxMp;}P.buffs=P.buffs||{};P.buffs.bless=Math.max(P.buffs.bless||0,time)+600;FLAGS.blessN=(FLAGS.blessN||0)+1;try{Snd.chime();Snd.levelUp();}catch(_){}
  const ch=.01+.003*faithTier();// Schutzengel: 1 % bis 2,5 % je Segen; er bleibt unsichtbar, bis er gebraucht wirdif(!FLAGS.guardian&&Math.random()<ch){FLAGS.guardian=1;setTimeout(()=>showArea('Der Engel bleibt bei dir. Er ist jetzt dein Schutzengel.'),400);}else setTimeout(()=>showArea('Der Engel segnet dich.'),400);
  try{renderStats();renderBuffs();}catch(_){}saveGame();}
// Segen: doppelte Regeneration
function angRegen(dt,k){const S=P.stats;if(!S||state!=='playing')return;if(time-(P.lastDmg||-99)>4&&S.hp<S.maxHp)S.hp=Math.min(S.maxHp,S.hp+dt*k.hp);if(S.st<S.maxSt)S.st=Math.min(S.maxSt,S.st+dt*k.st);if(S.maxMp&&S.mp<S.maxMp&&!ANG.pray)S.mp=Math.min(S.maxMp,S.mp+dt*k.mp);}
// ---------- Beten ----------
ITEMS.cross={name:'Kreuz',plural:'Kreuze'};
function crossDesc(){const t=faithTier(),n=FAITH[t][1],nx=FAITH[t+1];return`Ein schlichtes Holzkreuz aus Corvins Kirche. Rechte Maustaste gedrückt halten: beten (1 Mana pro Sekunde).\nDein Glaube: ${n} (Stufe ${t})${t?`: nach dem Beten 15 Minuten lang +${t*25} % Leben, +${t*15} % Ausdauer, +${t*25} % Mana pro Sekunde`:''}.${nx?`\nNoch ${Math.ceil((nx[0]-(FLAGS.pray||0))/60)} Minuten Gebet bis „${nx[1]}“.`:''}\nWer betet, begegnet eher einem Engel. Nachts erhört der Himmel Gebete am ehesten.`;}
ITEM_DESC.cross=crossDesc();
{const a=craftSprites;craftSprites=function(list){a(list);try{const p=new Px(16,16),W=pal(['#5a3a1c','#7a5228','#9a6a34','#b88a4a']);for(let y=1;y<16;y++)for(let x=7;x<=8;x++)p.set(x,y,W[shadeIdx(.7-(x-7)*.3,4,x,y)]);for(let x=3;x<=12;x++)for(let y=4;y<=5;y++)p.set(x,y,W[shadeIdx(.75-(y-4)*.3,4,x,y)]);p.set(7,4,hex('#f0d890'));p.set(8,4,hex('#f0d890'));outline(p);list.push(['cross',p.done()]);}catch(e){}};}
try{SHOPS.Corvin.buy.push(['cross',250]);}catch(e){}
function angPrayTick(dt){const H=heldItem(),want=state==='playing'&&H&&H.s.id==='cross'&&rightDown&&!P.riding&&!(typeof SW!=='undefined'&&SW.on);const S=P.stats;
  if(want&&S&&S.mp<=.05){if(ANG.pray)showArea('Dein Mana ist erschöpft.');ANG.pray=false;ANG.prayT=0;return;}
  if(!want){ANG.pray=false;ANG.prayT=0;return;}
  if(!ANG.pray){ANG.pray=true;ANG.prayT=0;try{Snd.chime();}catch(_){}}
  ANG.prayT+=dt;P.buffs=P.buffs||{};P.buffs.pray=time+900;if(!cheatOn())S.mp=Math.max(0,S.mp-dt);const t0=faithTier();FLAGS.pray=(FLAGS.pray||0)+dt;const t1=faithTier();if(t1>t0){showArea('Dein Glaube wächst: '+FAITH[t1][1]);ITEM_DESC.cross=crossDesc();try{Snd.levelUp();}catch(_){}}
  if(Math.random()<dt*10){const a=Math.random()*6.283,r=.4+Math.random()*.6;spawnParticle(P.x+Math.cos(a)*r,P.y+.2+Math.random()*.6,P.z+Math.sin(a)*r,0,.7+Math.random()*.6,0,Math.random()<.6?0xfff2c0:0xffffff,.22,.1);}
  ANG.chimeT-=dt;if(ANG.chimeT<=0){ANG.chimeT=6+Math.random()*4;try{Snd.tone('sine',660+Math.random()*220,Snd.ctx.currentTime,.6,.025);}catch(_){}}
  // Nachts, nach langem Gebet: ganz selten ein Segen
  if(ANG.prayT>15&&angNight()&&angOutdoors()&&!angBloodMoon()&&!ANG.a&&angRested()&&Math.random()<dt*.00012*(1+t1*.7))angStart('bless');
  if(ANG.prayT%30<dt)saveGame();}
// Gefahr erkennen: viele Gegner, wenig Leben
function angDangerTick(dt){ANG.dangerT-=dt;if(ANG.dangerT>0)return;ANG.dangerT=30;if(ANG.a||!angOutdoors()||angBloodMoon()||cheatOn())return;const S=P.stats;if(!S)return;
  const n=DEM.filter(e=>e.fac==='demon'&&!e.dead&&!e.dormant&&Math.hypot(e.x-P.x,e.z-P.z)<10&&(e.tgt==='player'||e.aggroT>0)).length;const hp=S.hp/S.maxHp;
  if(!(n>=3&&hp<.07))return;if(!angRested())return;
  if(Math.random()<.003*(1+faithTier()*.5))angStart('rescue');}
// Schutzengel: kurz vor dem Tod
{const a=takeDamage;takeDamage=function(n){const A=ANG.a;if(A&&A.mode==='rescue'&&A.ph==='guard')n*=.25;const S=P.stats;
  if(FLAGS.guardian&&S&&state==='playing'&&!ANG.a&&S.hp-(+n||0)<=S.maxHp*.04&&angRested()&&!angBloodMoon()){FLAGS.guardDay=FLAGS.day;FLAGS.angDay=FLAGS.day||0;S.hp=Math.max(S.hp,S.maxHp*.5);
    if(angOutdoors())angStart('rescue',{guard:true});else{for(const e of angHostiles(P.x,P.z,9))angFling(e,P.x,P.z,8,180,3);showArea('Dein Schutzengel hält seine Hand über dich.');try{Snd.shimmer();}catch(_){}}renderStats();return;}
  return a.apply(this,arguments);};}
// Wer hat mir geschadet? (für den Schutzengel gegen Spieler)
ANG.foes={};function angFoe(pid){if(pid&&pid!==MP.pid)ANG.foes[pid]=time;}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='ang'){try{if(m.pid!==MP.pid)angRemote(m);}catch(e){}return;}
  if(m&&m.t==='angp'){try{if(m.pid!==MP.pid)angPoseRecv(m);}catch(e){}return;}
  if(m&&m.t==='angsky'){try{angSkyRecv(m);}catch(e){}return;}
  if(m&&m.t==='afl'){try{if(isHostMP())angFlReq(m,peer);}catch(e){}return;}
  try{if(m&&m.from&&(m.t==='dmg'||m.t==='bhit'))angFoe(m.from);}catch(_){}return a(m,peer);};}
// Engel anderer Spieler sehen
function angRemote(m){const nm=(MP.names&&MP.names[m.pid])||'Ein Mitspieler';try{if(typeof chatLine==='function')chatLine(m.k==='bless'?`Ein Engel segnet ${mpEsc(nm)}.`:`Ein Engel steigt zu ${mpEsc(nm)} herab!`,'sys');}catch(_){}}
// Der Engel eines Mitspielers: Position, Haltung und Licht kommen von seinem Gerät
ANG.rp={};
function angPoseRecv(m){let R=ANG.rp[m.pid];if(!R){const A=angMake('remote',{light:true});A.x=m.x;A.y=m.y;A.z=m.z;R=ANG.rp[m.pid]={A};}Object.assign(R,{tx:m.x,ty:m.y,tz:m.z,f:m.f,o:m.o,m:m.m,ph:m.ph,h:m.h||null,last:time});}
function angRemoteTick(dt){for(const pid in ANG.rp){const R=ANG.rp[pid],A=R.A;A.t+=dt;const k=Math.min(1,dt*10);A.vx=(R.tx-A.x)*10;A.vz=(R.tz-A.z)*10;A.vy=(R.ty-A.y)*10;A.x+=(R.tx-A.x)*k;A.y+=(R.ty-A.y)*k;A.z+=(R.tz-A.z)*k;
    const stale=time-R.last>1.2;A.fade=stale?Math.max(0,A.fade-dt*1.5):R.o;A.forceF=R.f;
    const RP=REMOTE.get(pid);if(R.m==='bless'&&R.ph==='bless'&&RP&&!stale){if(!A.beam){A.beam=new THREE.Mesh(new THREE.CylinderGeometry(.6,1.2,1,12,1,true),new THREE.MeshBasicMaterial({color:0xfff4d8,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));scene.add(A.beam);}
      A.beam.position.set((A.x+RP.x)/2,(A.y+RP.y)/2,(A.z+RP.z)/2);A.beam.scale.set(1,Math.max(.5,A.y-RP.y),1);A.beam.lookAt(A.x,A.y,A.z);A.beam.rotateX(Math.PI/2);}else if(A.beam){scene.remove(A.beam);A.beam.geometry.dispose();A.beam=null;}
    angDraw(A,dt);if(stale&&A.fade<=0){angFree(A);delete ANG.rp[pid];}}}
// Eigene Engel-Haltung senden (10 mal pro Sekunde)
function angPoseSend(dt){const A=ANG.a;if(!A||A.mode==='sky'||!(MP.on&&MP.ready))return;ANG.pT=(ANG.pT||0)-dt;if(ANG.pT>0)return;ANG.pT=.1;
  const m={t:'angp',pid:MP.pid,x:+A.x.toFixed(2),y:+A.y.toFixed(2),z:+A.z.toFixed(2),f:A.frame,o:+A.fade.toFixed(2),m:A.mode,ph:A.ph};if(A.hold&&A.act==='ho'){const h=angHand(A);m.h=h.map(v=>+v.toFixed(2));}try{mpSend(m);}catch(_){}}
// Host: Wünsche des Engels eines Mitspielers an die Monster ausführen
function angFlReq(m,peer){const e=DEM.find(x=>x._u===m.u&&!x.dead);if(!e)return;
  if(m.k==='fling')angFling(e,m.fx,m.fz,m.dist,m.dmg,m.h,peer);
  else if(m.k==='hold'){if(!ANG.fl.some(f=>f.e===e))ANG.fl.push({e,holdR:m.pid,x0:e.x,y0:e.y,z0:e.z,x1:e.x,z1:e.z,t:0,T:1,h:0,dmg:0});}
  else if(m.k==='throw'){let F=ANG.fl.find(f=>f.e===e);if(!F){F={e};ANG.fl.push(F);}F.holdR=null;F.hold=null;F.x0=e.x;F.y0=e.y;F.z0=e.z;F.x1=m.tx;F.z1=m.tz;F.t=0;F.T=1.2;F.h=6;F.dmg=m.dmg;F.cr=peer;}}
// Himmelsflug: alle in der Nähe sehen denselben Engel
function angSkyRecv(m){if(ANG.a||angBloodMoon()||DGX.on||P.x>60000)return;const q=m.p;const A=angMake('sky');A.x=q[0];A.y=q[1];A.z=q[2];A.ex=q[3];A.ey=q[4];A.ez=q[5];A.sp=q[6];A.wig=q[7];ANG.a=A;if(Math.hypot(A.x-P.x,A.z-P.z)<400&&!FLAGS.angSeen){FLAGS.angSeen=1;setTimeout(()=>showArea('Ein Engel am Himmel'),600);}}
// Feiertage: manchmal ein Engel fern am Himmel (selten auch an anderen Tagen, wenn man viel betet)
function angSkyTick(dt){ANG.skyT-=dt;if(ANG.skyT>0)return;ANG.skyT=90+Math.random()*150;if(ANG.a||!angOutdoors()||angBloodMoon())return;const hol=angHoliday(),t=faithTier();
  if(hol&&!isClient()&&Math.random()<.45){const ps=[[P.x,P.y,P.z]];if(MP.on)for(const R of REMOTE.values())if(time-R.seen<5&&R.x<60000)ps.push([R.x,R.y,R.z]);angStart('sky',{c:ps[(Math.random()*ps.length)|0]});}
  else if(!hol&&Math.random()<.002*t)angStart('sky');}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);try{angPrayTick(dt);if(ANG.pray){P.x=x0;P.z=z0;P.vx=P.vz=0;P.eye+=(1.05*((P.mods&&P.mods.size)||1)-P.eye)*Math.min(1,dt*6);}
    const t=buffOn('pray')?faithTier():0,bl=typeof buffOn==='function'&&buffOn('bless');if(t||bl)angRegen(dt,{hp:t*.25+(bl?1:0),st:t*2+(bl?10:0),mp:t*.05+(bl?.2:0)});}catch(e){if(!ANG.perr){ANG.perr=1;console.error('Beten',e);}}};}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{angTick(dt);angPoseSend(dt);angRemoteTick(dt);angDangerTick(dt);angSkyTick(dt);}catch(e){if(!ANG.err){ANG.err=1;console.error('Engel',e);}}};}
{const a=startGame;startGame=function(){const r=a.apply(this,arguments);try{ITEM_DESC.cross=crossDesc();if(ANG.a){angFree(ANG.a);ANG.a=null;}}catch(e){}return r;};}
// ---------- Lore beim Priester ----------
{const D=DIALOGS.Corvin;if(D){const h0=D.nodes.hello;D.nodes.hello=function(){const n=h0.apply(this,arguments);if(n&&n.opts&&!n.opts.some(o=>o.go==='ang1'))n.opts.splice(Math.max(0,n.opts.length-1),0,{label:'Erzählt mir von den Engeln.',go:'ang1'});return n;};
  D.nodes.ang1=()=>({text:'Die Engel … Gestalten aus reinem Licht. Groß wie ein Turm, weiß wie frischer Schnee, mit Schwingen, die den Himmel verdunkeln könnten. Kein Mensch hat je ein Gesicht an ihnen gesehen. Sie leben im Himmel über den Wolken und wachen über diese Welt.',opts:[{label:'Hat jemand schon einen gesehen?',go:'ang2'},{label:'Zurück.',go:'hello'}]});
  D.nodes.ang2=()=>({text:'An den heiligen Tagen ziehen sie manchmal fern über den Himmel. Und es heißt, wer in allerhöchster Not ist, umringt von Feinden, dem schickt der Himmel einen herab. Ein Engel nimmt ein Skelett in die Hand wie du einen Kiesel. Aber das geschieht so selten, dass die meisten es für ein Märchen halten.',opts:[{label:'Kann man sie rufen?',go:'ang3'},{label:'Zurück.',go:'hello'}]});
  D.nodes.ang3=()=>({text:'Rufen? Nein. Bitten, ja. Halte ein Kreuz vor dich und bete. Das kostet Kraft, die Kraft deines Geistes. Wer oft betet, dessen Wunden heilen schneller. Und wer nachts betet, lange und still … manchmal, ganz selten, steigt ein Engel herab und segnet ihn. Und manch einem soll einer sogar als Schutzengel geblieben sein.',opts:[{label:'Und beim Blutmond?',go:'ang4'},{label:'Ich möchte ein Kreuz.',act:()=>{openShop('Corvin');return null;}},{label:'Zurück.',go:'hello'}]});
  D.nodes.ang4=()=>({text:'Beim Blutmond wendet der Himmel sein Gesicht ab. In diesen Nächten ist noch nie ein Engel gesehen worden. Bleib dann drinnen, mein Kind.',opts:[{label:'Danke, Vater.',go:'hello'}]});}}
// ---------- Cheat zum Testen: /engel himmel|rettung|segen|schutz ----------
HELP.push(['/engel <himmel|rettung|segen|schutz>','Engel erscheinen lassen oder Schutzengel geben (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/engel\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/engel geht nur im Cheat-Modus.','err');return;}const k=(t.split(/\s+/)[1]||'himmel').toLowerCase();closeConsole();if(ANG.a){angFree(ANG.a);ANG.a=null;}
    if(k==='schutz'){FLAGS.guardian=1;FLAGS.guardDay=null;FLAGS.angDay=null;conLog('Du hast jetzt einen Schutzengel.','ok');return;}angStart(k==='rettung'?'rescue':k==='segen'?'bless':'sky');conLog('Ein Engel erscheint.','ok');return;}return a(raw);};}
