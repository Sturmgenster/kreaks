/* =========================================================
   0.0.110 · Das Meer (2/3): Schwimmen und Tauchen
   - Im tiefen Wasser schwimmt man an der Oberfläche. Ducken (Shift) = abtauchen,
     Springen (Leertaste) = nach oben. Wer nach unten schaut und losschwimmt, taucht ab.
     Unter Wasser schwimmt man in Blickrichtung. Sprinten = schneller, kostet Ausdauer.
   - Luft: etwa 40 Sekunden unter Wasser, danach verliert man Leben. Anzeige mit Luftblasen.
   - Unter Wasser: blaugrüner Nebel, je tiefer, desto dunkler. Luftblasen steigen auf.
   - Animation: Schwimmzüge in der Ego-Ansicht (Arme) und in der Ansicht von hinten und vorne.
   ========================================================= */
const SW={on:false,vy:0,air:100,under:false,head:false,strokeT:0,bubT:2,drownT:1,tipped:false,uw:false};
try{swimMsg=true;}catch(e){}
// ---------- Anzeige ----------
{const st=document.createElement('style');st.textContent=`
#swAir{position:absolute;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;gap:3px;pointer-events:none;z-index:6}
#swAir i{width:13px;height:13px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffffff 0 18%,#9adcff 30%,#3a8ac8 80%);box-shadow:0 0 0 1px rgba(10,30,50,.6);display:block}
#swAir i.e{background:rgba(20,40,60,.35);box-shadow:0 0 0 1px rgba(10,30,50,.35)}
#swUW{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:0;transition:opacity .25s;background:radial-gradient(ellipse at 50% 45%,rgba(40,140,170,0) 35%,rgba(4,30,48,.55) 100%)}
#swArms{position:absolute;left:0;right:0;bottom:0;width:100%;height:50%;pointer-events:none;z-index:3;image-rendering:pixelated;display:none}`;document.head.appendChild(st);
  const air=document.createElement('div');air.id='swAir';air.hidden=true;for(let i=0;i<10;i++)air.appendChild(document.createElement('i'));document.body.appendChild(air);
  const uw=document.createElement('div');uw.id='swUW';document.body.appendChild(uw);
  const cv=document.createElement('canvas');cv.id='swArms';cv.width=160;cv.height=80;document.body.appendChild(cv);}
let swAirShown=-1;
// Keine Luftanzeige mehr: man taucht nach Gefühl. Wird die Luft knapp, verschwimmt die Sicht, man wird langsamer und kneift die Augen zu.
const swLowK=()=>SW.air>=40?0:Math.min(1,(40-SW.air)/40);
let swFx=null;function swAirUI(dt){dt=dt||1/60;const el=$('swAir');if(el)el.hidden=true;
  if(!swFx){const v=document.createElement('div');v.id='swVig';v.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:5;opacity:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 35%,rgba(0,8,20,.85) 100%)';
    const t=document.createElement('div'),b=document.createElement('div');for(const[d,e]of[[t,'top'],[b,'bottom']]){d.style.cssText=`position:fixed;left:0;right:0;${e}:0;height:0;pointer-events:none;z-index:5;background:#02060a`;}
    document.body.append(v,t,b);swFx={v,t,b,blink:0,next:3,last:-1};}
  const on=state==='playing'&&P.x<60000,k=on?swLowK():0,F=swFx;F.v.style.opacity=(k*.9).toFixed(3);
  const blur=k>0?(k*k*4).toFixed(2):0,f=k>0?`blur(${blur}px) saturate(${(1-k*.45).toFixed(2)}) brightness(${(1-k*.3).toFixed(2)})`:'';if(f!==F.last){renderer.domElement.style.filter=f;F.last=f;}
  if(k>0){F.next-=dt;if(F.next<=0&&F.blink<=0){F.blink=.35+k*.5;F.next=(5-k*3.5)+Math.random()*2.5;}}else{F.next=2;}
  let lid=0;if(F.blink>0){F.blink-=dt;const tot=.35+k*.5,u=1-F.blink/tot;lid=Math.sin(Math.min(1,Math.max(0,u))*Math.PI)*(.32+k*.18);}
  const h=(lid*100).toFixed(1)+'vh';F.t.style.height=h;F.b.style.height=h;}
// ---------- Wann schwimmt man? ----------
function swCan(){if(P.x>60000||P.riding||state==='dead')return false;try{if(boatIn)return false;}catch(e){}if(!swimWater(P.x,P.z))return false;return getHeight(P.x,P.z)<SWIM_Y-.05;}
function swBubbles(x,y,z,n,spread){for(let k=0;k<n;k++){if(parts.length>=PART_N)parts.shift();parts.push({x:x+(Math.random()-.5)*spread,y:y+(Math.random()-.5)*spread*.5,z:z+(Math.random()-.5)*spread,vx:(Math.random()-.5)*.3,vy:.6+Math.random()*.6,vz:(Math.random()-.5)*.3,col:0xcfefff,life:1+Math.random()*1.2,t:0,g:-1.6});}}
function swSplash(n){for(let k=0;k<n;k++)spawnParticle(P.x+(Math.random()-.5)*1.4,WATER+.05,P.z+(Math.random()-.5)*1.4,(Math.random()-.5)*3,2+Math.random()*3,(Math.random()-.5)*3,0xd8f0ff,.7,.2);}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,y0=P.y,z0=P.z,vy0=P.vy,was=SW.on;a(dt);
  const can=swCan();
  if(!can||(!was&&P.y>SWIM_Y+.3)){if(was){SW.on=false;SW.under=false;}swAir(dt);return;}
  if(!was){SW.on=true;SW.vy=Math.min(0,vy0*.35);if(vy0<-4){swSplash(24);try{Snd.splat();}catch(e){}}
    if(!SW.tipped&&!FLAGS.swimTip){SW.tipped=true;FLAGS.swimTip=1;toast(`Du schwimmst. [${keyName(settings.keys.sneak)}] abtauchen, [${keyName(settings.keys.jump)}] nach oben. Unter Wasser: [${keyName(settings.keys.sprint)}]+[${keyName(settings.keys.forward)}] schwimmen, sonst läufst du über den Grund.`);}}
  let fx=0,fz=0;if(state==='playing'){if(down('forward'))fz-=1;if(down('back'))fz+=1;if(down('left'))fx-=1;if(down('right'))fx+=1;}const len=Math.hypot(fx,fz);if(len){fx/=len;fz/=len;}
  // Unter Wasser: [Strg]+[W] = schwimmen (Schwimmzüge, in Blickrichtung). Sonst sinkt man langsam und läuft schwerfällig über den Grund.
  // [Shift] = schneller absinken, [Leertaste] = nach oben strampeln.
  const under=y0<SWIM_Y-.12,ply=state==='playing',up=ply&&down('jump'),dn=ply&&down('sneak'),flip=equip.boots&&equip.boots.id==='flippers',suit=swSuit(),low=swLowK();
  const swimK=ply&&down('sprint')&&down('forward')&&P.stats.st>.5,vk=flip?1.3:1,sin=Math.sin(P.yaw),cos=Math.cos(P.yaw),L=lookDir(),pc=L.y,g0=getHeight(x0,z0);
  let spd,wx=0,wz=0,wy=0;
  if(swimK)P.stats.st=Math.max(0,P.stats.st-(under?4.5:6)*dt);else if(len<.1)P.stats.st=Math.min(P.stats.maxSt||100,P.stats.st+6*dt);else P.stats.st=Math.min(P.stats.maxSt||100,P.stats.st+2.5*dt);
  if(!under){spd=2.2*(swimK?1.5:1)*speedMult()*(1-.4*low)*(flip?1.45:1)*(suit?.6:1);
    wx=fx*cos*spd;wz=-fx*sin*spd;
    if(fz<0){if(swimK&&pc<-.42){wx+=L.x*spd*-fz;wz+=L.z*spd*-fz;wy+=L.y*spd*-fz;}else{wx+=-sin*spd*-fz;wz+=-cos*spd*-fz;}}else if(fz>0){wx+=sin*spd*fz*.6;wz+=cos*spd*fz*.6;}
    if(up)wy+=2.4*vk;if(dn)wy-=(suit?3.6:2.4)*vk;if(suit&&!up)wy=Math.min(wy,-1.4);}
  else if(swimK){spd=2.9*speedMult()*(1-.4*low)*(flip?1.45:1)*(suit?.7:1);
    wx=fx*cos*spd+L.x*spd;wz=-fx*sin*spd+L.z*spd;wy=L.y*spd;if(up)wy+=1.8*vk;if(dn)wy-=2.4;}
  else{const floor=y0<=g0+.08;spd=(floor?1.05:.7)*speedMult()*(1-.3*low)*(suit?.85:1);
    wx=fx*cos*spd;wz=-fx*sin*spd;if(fz<0){wx+=-sin*spd*-fz;wz+=-cos*spd*-fz;}else if(fz>0){wx+=sin*spd*fz*.7;wz+=cos*spd*fz*.7;}
    wy=dn?-3.4:-(suit?1.6:.9);if(up)wy=(suit?.9:2)*vk;}
  SW.swim=!under||swimK;
  const k=1-Math.exp(-5*dt);P.vx+=(wx-P.vx)*k;P.vz+=(wz-P.vz)*k;SW.vy+=(wy-SW.vy)*k;
  P.x=x0+P.vx*dt;P.z=z0+P.vz*dt;P.y=y0+SW.vy*dt;try{collideTrees();}catch(e){}
  const g=getHeight(P.x,P.z);if(P.y<g){P.y=g;SW.vy=Math.max(0,SW.vy);}
  if(P.y>=SWIM_Y){if(SW.vy>0&&up&&len>0){const g2=getHeight(P.x-sin*1.2,P.z-cos*1.2);if(g2>SWIM_Y-.2&&g2<WATER+1.3){P.y=Math.max(P.y,SWIM_Y);}}
    P.y=SWIM_Y+Math.sin(time*2.2)*.04;SW.vy=Math.min(0,SW.vy);}
  P.ground=P.y<=g+.04;P.vy=SW.vy;P.launched=false;P.hasFlown=false;P.airT=0;P.charge=0;
  SW.under=P.y<SWIM_Y-.12;const hs=Math.hypot(P.vx,P.vz,SW.vy);SW.strokeT+=dt*(SW.swim?(len>0||up||dn?1.1+hs*.35:.35):0);
  if(!SW.under&&hs>.8&&Math.random()<dt*6)swSplash(2);
  try{placeCamera(0,Math.hypot(P.vx,P.vz));if(!inCore(P.x,P.z))waterTint.hidden=true;}catch(e){}
  swAir(dt);};}
function swDrown(n){if(cheatOn()||state==='dead')return;const S=P.stats;S.hp=Math.max(0,S.hp-n);P.lastDmg=time;renderStats();try{Snd.hurt?Snd.hurt():0;}catch(e){}if(S.hp<=0)playerDie();}
const swSuit=()=>!!(equip.armor&&equip.armor.id==='divehelm');
const swHitK=()=>SW.head?.55:1;
function swAir(dt){const head=P.x<60000&&P.y+P.eye<WATER-.05&&SW.on;SW.head=head;
  if(head){SW.air=Math.max(0,SW.air-dt*(down('sprint')?3.6:2.5));
    if(SW.air<=0){SW.drownT-=dt;if(SW.drownT<=0){SW.drownT=.8;SW.drownN=(SW.drownN||0)+1;swDrown(4+SW.drownN*4);}}}
  else{SW.air=Math.min(100,SW.air+dt*35);SW.drownT=1;SW.drownN=0;}
  swAirUI(dt);}
// ---------- Unter Wasser sehen ----------
let UWM=[],uwT=-9;const UW_COL=new THREE.Color(),UW_A=new THREE.Color('#2a7e8e'),UW_B=new THREE.Color('#03121c'),UWS={fog:new THREE.Color(),hor:new THREE.Color(),clr:new THREE.Color()};
function uwCollect(){UWM=[];scene.traverse(o=>{const m=o.material;if(!m)return;for(const q of Array.isArray(m)?m:[m])if(q&&q.uniforms&&q.uniforms.fogNear&&!UWM.includes(q))UWM.push(q);});}
function uwState(){const c=camera.position;if(c.x>60000||c.y>=WATER-.03)return 0;const g=getHeight(c.x,c.z);if(g>=c.y||!swimWater(c.x,c.z))return 0;return WATER-c.y;}
{const r0=renderer.render.bind(renderer);renderer.render=function(s,c){let dep=0;try{dep=uwState();}catch(e){}const uw=dep>0;
  if(uw!==SW.uw){SW.uw=uw;$('swUW').style.opacity=uw?'1':'0';}
  if(!uw)return r0(s,c);
  if(time-uwT>2){uwT=time;uwCollect();}
  const lamp=typeof countItem==='function'&&countItem('deeplamp')>0,k=Math.min(1,dep/120)*(lamp?.35:1),day=typeof DN!=='undefined'?Math.max(.18,DN.day+(1-DN.day)*.12):1;UW_COL.copy(UW_A).lerp(UW_B,k).multiplyScalar(day);
  UWS.fog.copy(scene.fog.color);UWS.hor.copy(SKY_HOR);const fn=scene.fog.near,ff=scene.fog.far,sv=sky.visible,hi=hemi.intensity,si=sun.intensity;renderer.getClearColor(UWS.clr);const ca=renderer.getClearAlpha();
  const far=Math.max(14,50-dep*.3)*(.6+.4*day)*(lamp?1.6:1),saved=UWM.map(m=>[m,m.uniforms.fogNear.value,m.uniforms.fogFar.value,m.uniforms.light?m.uniforms.light.value:null]);
  scene.fog.color.copy(UW_COL);SKY_HOR.copy(UW_COL);scene.fog.near=.5;scene.fog.far=far;sky.visible=false;renderer.setClearColor(UW_COL,1);hemi.intensity=hi*(1-.5*k);sun.intensity=si*(1-.75*k);
  for(const[m,,,l]of saved){m.uniforms.fogNear.value=.5;m.uniforms.fogFar.value=far;if(l!=null)m.uniforms.light.value=l*(1-.55*k);}
  try{r0(s,c);}finally{scene.fog.color.copy(UWS.fog);SKY_HOR.copy(UWS.hor);scene.fog.near=fn;scene.fog.far=ff;sky.visible=sv;renderer.setClearColor(UWS.clr,ca);hemi.intensity=hi;sun.intensity=si;
    for(const[m,n0,f0,l]of saved){m.uniforms.fogNear.value=n0;m.uniforms.fogFar.value=f0;if(l!=null)m.uniforms.light.value=l;}}};}
// ---------- Schwimm-Animation (Ansicht von hinten / vorne) ----------
let swMesh=null,swMat=null;
function swBuild(){try{if(!playerMesh)return;const sz=playerMesh.geometry.attributes.size.array,w=sz[0],h=sz[1],strip=document.createElement('canvas');strip.width=64*4;strip.height=60;const ctx=strip.getContext('2d');ctx.imageSmoothingEnabled=false;
    const FR=[['b0',1,true,'up',.74],['b1',2,true,undefined,.7],['f0',1,false,'up',.74],['f1',2,false,undefined,.7]];
    FR.forEach(([k,f,b,pose,sy],i)=>{let cv=composeHero(f,b,pose,10);cv=squashCv(cv,1.04,sy);ctx.drawImage(cv,i*64,0);SPR['plsw_'+k]={u:i/4,v:0,du:1/4,dv:1,w:64,h:60};});
    const tex=new THREE.CanvasTexture(strip);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
    if(swMesh){scene.remove(swMesh);swMesh.geometry.dispose();swMat.uniforms.map.value.dispose();const i=EXTRA_BB.indexOf(swMat);if(i>=0)EXTRA_BB.splice(i,1);}
    swMat=bbMaterial(tex,0,0);swMesh=makeBillboards([{x:P.x,y:P.y,z:P.z,w,h,spr:'plsw_b0',tint:1}],swMat);swMesh.visible=false;scene.add(swMesh);EXTRA_BB.push(swMat);}catch(e){console.error('Schwimmen: Bild',e);}}
{const a=buildPlayerSprite;buildPlayerSprite=function(){a();swBuild();};}
// Ego-Ansicht: Arme beim Schwimmen
let swArmCol=null;
function swArmCols(){const f=a=>[a[0]|0,a[1]|0,a[2]|0];try{const c=P.char,R=c.race||'human',sk=SKINPAL[R][c.skin]||SKINPAL[R][0],cl=CLOTH[c.clothColor]||CLOTH.green;
    return{sk:[f(sk[1][0]||sk[1]),f(sk[1][1]||sk[1]),f(sk[1][2]||sk[1]),f(sk[1][3]||sk[1][2]||sk[1])],cl:[f(cl[0]),f(cl[1]),f(cl[2]),f(cl[3]||cl[2])]};}
  catch(e){return{sk:[[110,70,48],[160,108,77],[192,139,102],[220,170,134]],cl:[[26,48,24],[44,74,38],[65,102,58],[93,134,80]]};}}
const SWA={W:200,H:100,img:null,buf:null};
// Brustschwimmen: Schlüsselbilder (Handgelenk x-Abstand zur Mitte, y, Größe, Handdrehung)
const SWK=[[0,10,46,.72,.25],[.32,70,54,.86,.9],[.52,46,84,1.08,.55],[.68,16,92,1.15,.1],[1,10,46,.72,.25]];
function swKey(t){for(let i=0;i<SWK.length-1;i++){const A=SWK[i],B=SWK[i+1];if(t<=B[0]){const u=(t-A[0])/(B[0]-A[0]),e=(1-Math.cos(u*Math.PI))/2;return A.map((v,k)=>v+(B[k]-v)*e);}}return SWK[0];}
function swArms(){const cv=$('swArms'),show=SW.on&&SW.swim&&!(P.view||0)&&state==='playing'&&!P.riding;if(!show){if(cv.style.display!=='none')cv.style.display='none';hand.style.visibility='';return;}
  if(cv.style.display!=='block')cv.style.display='block';hand.style.visibility='hidden';
  const suit=typeof swSuit==='function'&&swSuit(),sig=(P.char&&P.char.skin)+'|'+(P.char&&P.char.clothColor)+'|'+suit;if(!swArmCol||swArmCol.sig!==sig){swArmCol=swArmCols();swArmCol.sig=sig;
    if(suit){swArmCol.cl=[[60,40,10],[148,106,34],[200,154,58],[236,200,104]];swArmCol.sk=[[42,26,14],[74,46,22],[100,64,30],[130,86,44]];}}
  const W=SWA.W,H=SWA.H;if(cv.width!==W){cv.width=W;cv.height=H;}const x=cv.getContext('2d');if(!SWA.img){SWA.img=x.createImageData(W,H);SWA.buf=new Int8Array(W*H);}
  const D=SWA.img.data,B=SWA.buf;D.fill(0);B.fill(0);const C=swArmCol,OUT=[24,16,10];
  const put=(X,Y,c,id)=>{if(X<0||Y<0||X>=W||Y>=H)return;const i=Y*W+X;B[i]=id;D[i*4]=c[0];D[i*4+1]=c[1];D[i*4+2]=c[2];D[i*4+3]=255;};
  // dicker Strich mit Licht oben und Schatten unten
  const seg=(ax,ay,bx,by,r0,r1,P4,id)=>{const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1,L=Math.sqrt(L2),nx=-dy/L,ny=dx/L,r=Math.max(r0,r1);
    for(let Y=Math.floor(Math.min(ay,by)-r-1);Y<=Math.ceil(Math.max(ay,by)+r+1);Y++)for(let X=Math.floor(Math.min(ax,bx)-r-1);X<=Math.ceil(Math.max(ax,bx)+r+1);X++){
      let t=((X+.5-ax)*dx+(Y+.5-ay)*dy)/L2;t=t<0?0:t>1?1:t;const px=ax+dx*t,py=ay+dy*t,rr=r0+(r1-r0)*t,d=Math.hypot(X+.5-px,Y+.5-py);if(d>rr)continue;
      const side=((X+.5-px)*nx+(Y+.5-py)*ny)/rr*(ny<0?-1:1),k=side<-.45?3:side<.1?2:side<.6?1:0;put(X,Y,P4[k],id);}};
  const ell=(cx,cy,rx,ry,ang,P4,id)=>{const c=Math.cos(ang),s=Math.sin(ang),R=Math.max(rx,ry)+1;for(let Y=Math.floor(cy-R);Y<=Math.ceil(cy+R);Y++)for(let X=Math.floor(cx-R);X<=Math.ceil(cx+R);X++){
      const lx=(X+.5-cx)*c+(Y+.5-cy)*s,ly=-(X+.5-cx)*s+(Y+.5-cy)*c,q=(lx/rx)**2+(ly/ry)**2;if(q>1)continue;const k=ly<-ry*.35?3:ly<ry*.2?2:ly<ry*.6?1:0;put(X,Y,P4[k],id);}};
  const cyc=((SW.strokeT/2)%1+1)%1,bob=Math.sin(time*2)*1.2;
  for(const sd of[-1,1]){const[,kx,ky,sc,rot]=swKey(cyc),wx=100+sd*kx,wy=ky+bob,shx=100+sd*72,shy=138;
    // Ellbogen: nach außen und unten geknickt
    const mx=(shx+wx)/2,my=(shy+wy)/2,ddx=wx-shx,ddy=wy-shy,dl=Math.hypot(ddx,ddy)||1,bend=Math.max(0,1-dl/150)*34+10,ex=mx+sd*bend,ey=my+bend*.45;
    const id=sd<0?1:2;seg(shx,shy,ex,ey,17*sc,14*sc,C.cl,id);seg(ex,ey,wx,wy,14*sc,9.5*sc,C.cl,id);
    // Ärmelsaum
    const fx=(wx-ex)/(Math.hypot(wx-ex,wy-ey)||1),fy=(wy-ey)/(Math.hypot(wx-ex,wy-ey)||1);seg(wx-fx*4*sc,wy-fy*4*sc,wx-fx*1*sc,wy-fy*1*sc,10.5*sc,10.5*sc,[C.cl[2],C.cl[1],C.cl[1],C.cl[0]],id);
    // Hand: Handfläche, vier Finger, Daumen. Gedreht: vorne flach, beim Ausholen nach außen
    const ang=Math.atan2(fy,fx),hx=wx+fx*8*sc,hy=wy+fy*8*sc;ell(hx,hy,9*sc,8*sc*(1-rot*.25),ang,C.sk,id);
    const px=-fy,py=fx;for(let f=0;f<4;f++){const o=(f-1.5)*3.8*sc*(1-rot*.3)*sd,len=(f===1||f===2?10:8.5)*sc,spr=(f-1.5)*.08*sd;const bx=hx+fx*6.5*sc+px*o,by=hy+fy*6.5*sc+py*o;
      seg(bx,by,bx+(fx+px*spr)*len,by+(fy+py*spr)*len,2.3*sc,2*sc,C.sk,id);}
    const tb=-sd*8*sc;seg(hx+px*tb*.6,hy+py*tb*.6,hx+px*tb+fx*6*sc,hy+py*tb+fy*6*sc,2.7*sc,2.3*sc,C.sk,id);}
  // Umriss
  for(let Y=0;Y<H;Y++)for(let X=0;X<W;X++){const i=Y*W+X;if(B[i])continue;const n=(X>0&&B[i-1])||(X<W-1&&B[i+1])||(Y>0&&B[i-W])||(Y<H-1&&B[i+W]);if(n){D[i*4]=OUT[0];D[i*4+1]=OUT[1];D[i*4+2]=OUT[2];D[i*4+3]=255;}}
  // Innenkanten zwischen Teilen leicht abdunkeln
  for(let Y=1;Y<H;Y++)for(let X=1;X<W;X++){const i=Y*W+X;if(B[i]&&B[i-W]&&B[i]!==B[i-W]){D[i*4]=OUT[0];D[i*4+1]=OUT[1];D[i*4+2]=OUT[2];}}
  x.putImageData(SWA.img,0,0);}
{const a=placeCamera;placeCamera=function(bobAmp,hs){a(bobAmp,hs);const v=P.view||0;
  if(SW.on&&!v&&SW.under)camera.rotation.z=Math.sin(time*.9)*.012;
  if(SW.on&&v&&SW.under){const M=P.mods||{size:1},sz=Math.max(.3,Math.min(1.25,M.size)),dist=1.2+2.6*sz,d=lookDir(),tx=P.x,ty=P.y+P.eye*.85,tz=P.z,sg=v===1?-1:1;
    camera.position.set(tx+d.x*dist*sg,ty+d.y*dist*sg+.3*sz,tz+d.z*dist*sg);const g=getHeight(camera.position.x,camera.position.z);if(camera.position.y<g+.25)camera.position.y=g+.25;if(camera.position.y>WATER-.25)camera.position.y=WATER-.25;camera.lookAt(tx,ty,tz);}
  if(swMesh){const on=SW.on&&SW.swim&&v>0&&!P.riding;swMesh.visible=on;if(on){if(playerMesh)playerMesh.visible=false;const g=swMesh.geometry.attributes,f=Math.floor(SW.strokeT)%2,spr=SPR['plsw_'+(v===1?'b':'f')+f];
      g.offset.array[0]=P.x;g.offset.array[1]=P.y+(SW.under?.15:-.1)+Math.sin(SW.strokeT*Math.PI)*.04;g.offset.array[2]=P.z;g.rot.array[0]=Math.sin(SW.strokeT*Math.PI)*.06;
      g.uvr.array[0]=spr.u;g.uvr.array[1]=spr.v;g.uvr.array[2]=spr.du;g.uvr.array[3]=spr.dv;for(const k of['offset','uvr','rot'])g[k].needsUpdate=true;}}
  swArms();};}
{const a=startGame;startGame=function(isNew,char){SW.on=false;SW.air=100;SW.vy=0;return a(isNew,char);};}

{const a=playerDie;playerDie=function(){a();SW.air=100;swAirUI(0);};}
{const a=startGame;startGame=function(isNew,char){SW.air=100;try{swAirUI(0);}catch(e){}return a(isNew,char);};}
