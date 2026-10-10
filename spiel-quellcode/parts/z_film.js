/* =========================================================
   FILM · Zwischensequenzen wie im Kino
   - freie Kamera nach Drehbuch (eine Funktion der Zeit)
   - Breitbild-Balken, kein Text, kein Weiterklicken
   - eigene Leucht-, Funken- und Staubpartikel, Blitz, Wackeln, Zeitlupe
   - Nahaufnahmen als gemalte Pixelbilder über dem Bild
   - Esc eine Sekunde gedrückt halten: Szene überspringen
   ========================================================= */
// ---------- Effekt-Partikel ----------
const FXN=3600,FXL=[];let fxMeshA=null,fxMeshN=null;
const FX_VS=`attribute float sz;attribute vec4 cl;varying vec4 vC;uniform float scale;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;float dz=-mv.z;gl_PointSize=clamp(sz*scale/max(.05,dz),1.0,110.0);vC=vec4(cl.rgb,cl.a*smoothstep(.6,3.0,dz));}`;
const FX_FA=`varying vec4 vC;void main(){vec2 d=gl_PointCoord-.5;float r=length(d)*2.0;if(r>1.0)discard;float a=vC.a*(1.0-r)*(1.0-r)*1.6;gl_FragColor=vec4(vC.rgb,min(1.0,a));}`;
const FX_FN=`varying vec4 vC;void main(){vec2 d=gl_PointCoord-.5;float r=length(d)*2.0;if(r>1.0)discard;gl_FragColor=vec4(vC.rgb,vC.a*(1.0-r*r));}`;
function fxMake(add){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(FXN*3),3));
  g.setAttribute('cl',new THREE.BufferAttribute(new Float32Array(FXN*4),4));g.setAttribute('sz',new THREE.BufferAttribute(new Float32Array(FXN),1));
  const m=new THREE.ShaderMaterial({uniforms:{scale:{value:400}},vertexShader:FX_VS,fragmentShader:add?FX_FA:FX_FN,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=5;g.setDrawRange(0,0);scene.add(pts);return pts;}
function fxInit(){if(fxMeshA)return;try{fxMeshA=fxMake(true);fxMeshN=fxMake(false);}catch(e){console.error('FX',e);}}
const fxCol=c=>[((c>>16)&255)/255,((c>>8)&255)/255,(c&255)/255];
// x,y,z, Geschwindigkeit, Farbe (Zahl oder Liste), Lebensdauer, Größe; o: {add:false für Staub, s1:Endgröße, g:Schwerkraft, dr:Bremsen, a:Deckkraft}
function fxP(x,y,z,vx,vy,vz,col,life,size,o){if(!fxMeshA)fxInit();if(Array.isArray(col))col=col[(Math.random()*col.length)|0];o=o||{};
  if(FXL.length>=FXN*1.8)FXL.splice(0,40);const c=fxCol(col);
  FXL.push({x,y,z,vx,vy,vz,r:c[0],g:c[1],b:c[2],a:o.a==null?1:o.a,l:life,t:0,s0:size,s1:o.s1==null?size*.4:o.s1,gr:o.g||0,dr:o.dr||0,add:o.add!==false,fi:o.fi||0});}
function fxTick(dt){if(!fxMeshA)return;let na=0,nn=0;const A=fxMeshA.geometry.attributes,N=fxMeshN.geometry.attributes;
  for(let i=FXL.length-1;i>=0;i--){const p=FXL[i];p.t+=dt;if(p.t>=p.l){FXL.splice(i,1);continue;}p.vy-=p.gr*dt;if(p.dr){const k=Math.max(0,1-p.dr*dt);p.vx*=k;p.vy*=k;p.vz*=k;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
  for(const p of FXL){const k=p.t/p.l,G=p.add?A:N;let n=p.add?na:nn;if(n>=FXN)continue;const fade=p.fi&&k<p.fi?k/p.fi:1-Math.pow(Math.max(0,(k-p.fi)/(1-p.fi||1)),1.5);
    G.position.array[n*3]=p.x;G.position.array[n*3+1]=p.y;G.position.array[n*3+2]=p.z;G.cl.array[n*4]=p.r;G.cl.array[n*4+1]=p.g;G.cl.array[n*4+2]=p.b;G.cl.array[n*4+3]=p.a*fade;G.sz.array[n]=p.s0+(p.s1-p.s0)*k;
    if(p.add)na++;else nn++;}
  for(const[M,n]of[[fxMeshA,na],[fxMeshN,nn]]){const g=M.geometry;g.setDrawRange(0,n);for(const k of['position','cl','sz'])g.attributes[k].needsUpdate=true;
    M.material.uniforms.scale.value=renderer.domElement.height/(2*Math.tan(camera.fov*Math.PI/360));}}
function fxBurst(x,y,z,n,cols,spd,life,size,o){o=o||{};for(let i=0;i<n;i++){const u=Math.random()*2-1,a=Math.random()*6.283,r=Math.sqrt(1-u*u),v=spd*(.35+Math.random()*.65);
  fxP(x,y,z,Math.cos(a)*r*v,u*v*(o.flat?.25:1)+(o.up||0),Math.sin(a)*r*v,cols,life*(.6+Math.random()*.6),size*(.6+Math.random()*.8),o);}}
function fxRing(x,y,z,n,cols,spd,life,size,o){o=o||{};for(let i=0;i<n;i++){const a=i/n*6.283+Math.random()*.05,r=o.r||0,v=spd*(.85+Math.random()*.3);
  fxP(x+Math.cos(a)*r,y+(o.dy||0)*Math.random(),z+Math.sin(a)*r,Math.cos(a)*v,(o.up||0)*Math.random(),Math.sin(a)*v,cols,life*(.8+Math.random()*.4),size,o);}}
// Sichel (Schwerthieb) in der senkrechten Ebene, die in Richtung yaw zeigt
function fxArc(x,y,z,yaw,R,a0,a1,n,cols,life,size,o){o=o||{};const dx=Math.cos(yaw),dz=Math.sin(yaw),tw=o.tilt||0;
  for(let i=0;i<n;i++){const k=i/(n-1),a=a0+(a1-a0)*k,rr=R*(1+(Math.random()-.5)*.08),c=Math.cos(a),s=Math.sin(a);
    const px=dx*c*rr-dz*s*rr*tw,py=s*rr*(1-Math.abs(tw)*.5),pz=dz*c*rr+dx*s*rr*tw;
    const tv=o.sp||2,tx=-dx*s*tv,ty=c*tv,tz=-dz*s*tv;fxP(x+px,y+py,z+pz,tx*(a1>a0?1:-1)+(Math.random()-.5)*.4,ty*(a1>a0?1:-1)+(Math.random()-.5)*.4,tz*(a1>a0?1:-1),cols,life*(.6+k*.6),size*(.6+Math.sin(k*Math.PI)*.8),o);}}
function fxLine(x0,y0,z0,x1,y1,z1,n,cols,life,size,o){for(let i=0;i<n;i++){const k=Math.random();fxP(x0+(x1-x0)*k,y0+(y1-y0)*k,z0+(z1-z0)*k,(Math.random()-.5)*.6,(Math.random()-.5)*.6,(Math.random()-.5)*.6,cols,life*(.5+Math.random()*.7),size,o);}}
function fxDust(x,z,n,R,o){o=o||{};const g=groundAt(x,z,1e4);for(let i=0;i<n;i++){const a=Math.random()*6.283,r=(R||1)*Math.random(),v=(o.spd||2.5)*(.4+Math.random());
  fxP(x+Math.cos(a)*r,g+.15+Math.random()*.4,z+Math.sin(a)*r,Math.cos(a)*v,.3+Math.random()*(o.up||1.2),Math.sin(a)*v,o.cols||[0x6a5a44,0x7a6a52,0x8a7a60,0x5a4c3a],(o.life||1.6)*(.6+Math.random()*.6),(o.size||.5)*(.6+Math.random()*.8),{add:false,s1:(o.size||.5)*1.8,dr:2.2,a:.42});}}
function fxSparks(x,y,z,n,o){o=o||{};fxBurst(x,y,z,n,o.cols||[0xffffff,0xfff0a0,0xffb040],o.spd||9,o.life||.45,o.size||.16,{g:9,dr:1,s1:.04});}

// ---------- Kleine Pixel-Leinwand für Nahaufnahmen ----------
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const hx3=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const pl3=a=>a.map(hx3);
function shd(P,L,x,y){return P[Math.max(0,Math.min(P.length-1,Math.floor(L*P.length+(BAY[(y&3)*4+(x&3)]/16-.5)*.9)))];}
class LP{constructor(w,h){this.w=w;this.h=h;this.cv=document.createElement('canvas');this.cv.width=w;this.cv.height=h;this.cx=this.cv.getContext('2d');this.img=this.cx.createImageData(w,h);this.d=this.img.data;this.clip=null;}
  clear(c){const d=this.d;for(let i=0;i<d.length;i+=4){d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255;}}
  set(x,y,c){x|=0;y|=0;if(x<0||y<0||x>=this.w||y>=this.h||!c)return;if(this.clip&&!this.clip(x,y))return;const i=(y*this.w+x)*4,d=this.d;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];}
  mix(x,y,c,a){x|=0;y|=0;if(x<0||y<0||x>=this.w||y>=this.h||!c||a<=0)return;if(this.clip&&!this.clip(x,y))return;const i=(y*this.w+x)*4,d=this.d;a=Math.min(1,a);d[i]+=(c[0]-d[i])*a;d[i+1]+=(c[1]-d[i+1])*a;d[i+2]+=(c[2]-d[i+2])*a;}
  add(x,y,c,a){x|=0;y|=0;if(x<0||y<0||x>=this.w||y>=this.h)return;if(this.clip&&!this.clip(x,y))return;const i=(y*this.w+x)*4,d=this.d;d[i]=Math.min(255,d[i]+c[0]*a);d[i+1]=Math.min(255,d[i+1]+c[1]*a);d[i+2]=Math.min(255,d[i+2]+c[2]*a);}
  ell(cx,cy,rx,ry,fn){if(rx<=0||ry<=0)return;for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny>1)continue;const c=fn(nx,ny,x,y);if(c)this.set(x,y,c);}}
  poly(pts,fn){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const[x,y]of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){const px=x+.5,py=y+.5;let ins=false;
      for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))ins=!ins;}
      if(ins){const c=fn((px-x0)/(x1-x0||1),(py-y0)/(y1-y0||1),x,y);if(c)this.set(x,y,c);}}}
  // Röhre entlang Punkten, Radius von r0 nach r1
  tube(pts,r0,r1,fn){let L=0;const seg=[];for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);seg.push(l);L+=l;}let acc=0;
    for(let i=0;i<pts.length-1;i++){const[ax,ay]=pts[i],[bx,by]=pts[i+1],n=Math.max(1,Math.ceil(seg[i]*2));for(let k=0;k<=n;k++){const f=k/n,t=(acc+seg[i]*f)/(L||1),r=r0+(r1-r0)*t;
      this.ell(ax+(bx-ax)*f,ay+(by-ay)*f,Math.max(.5,r),Math.max(.5,r),(nx,ny,x,y)=>fn(nx,ny,x,y,t));}acc+=seg[i];}}
  line(x0,y0,x1,y1,c,a){const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))+1;for(let i=0;i<=n;i++){const k=i/n;if(a==null)this.set(x0+(x1-x0)*k,y0+(y1-y0)*k,c);else this.mix(x0+(x1-x0)*k,y0+(y1-y0)*k,c,a);}}
  flush(){this.cx.putImageData(this.img,0,0);}}

// ---------- Die Filmbühne ----------
const FILM={on:false,t:0,prev:0,ts:1,shake:0};let filmViewNext=false;   // true: nur zuschauen (Mitspieler im Mehrspieler)
let filmLP=null;
function filmDom(){if($('film'))return;const st=document.createElement('style');st.textContent=`
#film{position:fixed;inset:0;z-index:23;pointer-events:none;overflow:hidden}
#film .fb{position:absolute;left:0;right:0;height:0;background:#000;transition:height .9s ease}#film .fb.t{top:0}#film .fb.b{bottom:0}
#film.on .fb{height:11vh}
#filmCv{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
#filmFlash,#filmFade{position:absolute;inset:0;opacity:0}#filmFlash{background:#fff}#filmFade{background:#000}
#filmCap{position:absolute;left:0;right:0;bottom:15vh;text-align:center;font-family:'Pixelify Sans','Silkscreen',sans-serif;font-weight:700;color:#fff;font-size:min(7vw,72px);letter-spacing:.04em;
  text-shadow:0 0 18px rgba(255,80,60,.9),0 0 4px #000,3px 3px 0 #300;opacity:0;white-space:nowrap}
#filmHp{position:absolute;left:50%;top:13vh;width:min(60vw,640px);transform:translateX(-50%);opacity:0;transition:opacity .5s}
#filmHp b{display:block;text-align:center;font-family:'Pixelify Sans',sans-serif;color:#ffd0d0;font-size:min(3vw,22px);text-shadow:0 0 6px #a00,2px 2px 0 #000;margin-bottom:6px}
#filmHp i{display:block;height:14px;border:2px solid #2a0408;background:#140204;box-shadow:0 0 12px rgba(255,40,40,.5)}#filmHp i span{display:block;height:100%;width:0;background:linear-gradient(#ff5a5a,#a01020)}
#filmSkip{position:absolute;right:3vw;bottom:12.5vh;font-family:'Pixelify Sans',sans-serif;color:#ddd;font-size:15px;opacity:0;transition:opacity .3s;text-shadow:1px 1px 0 #000}
body.filming #hud,body.filming #hotbar,body.filming #hand,body.filming #handOff,body.filming #bossBar,body.filming .bubble{visibility:hidden!important}`;
  document.head.appendChild(st);const d=document.createElement('div');d.id='film';d.hidden=true;
  d.innerHTML='<canvas id="filmCv"></canvas><div id="filmFlash"></div><div id="filmFade"></div><div class="fb t"></div><div class="fb b"></div><div id="filmCap"></div><div id="filmHp"><b></b><i><span></span></i></div><div id="filmSkip">Enter gedrückt halten: überspringen</div>';
  document.body.appendChild(d);}
const _fl=new THREE.Vector3();
const FCAM={
  // Kamera: Position, Blickpunkt, Blickwinkel (fov), Neigung
  cam(px,py,pz,lx,ly,lz,fov,roll){const F=FILM,s=F.shake;let ox=0,oy=0,oz=0;if(s>0){ox=(Math.random()-.5)*s;oy=(Math.random()-.5)*s;oz=(Math.random()-.5)*s;}
    const g=groundAt(px,pz,py+5);if(py<g+.25)py=g+.25;camera.position.set(px+ox,py+oy,pz+oz);_fl.set(lx+ox*.6,ly+oy*.6,lz+oz*.6);camera.lookAt(_fl);if(roll)camera.rotateZ(roll);
    const f=fov||F.fov0;if(Math.abs(camera.fov-f)>.01){camera.fov=f;camera.updateProjectionMatrix();}},
  in(a,b){const t=FILM.t;return t>=a&&t<b?(t-a)/(b-a):-1;},
  at(x){return FILM.prev<x&&FILM.t>=x;},
  flash(a,col){const el=$('filmFlash');el.style.background=col||'#fff';FILM.flashA=Math.max(FILM.flashA||0,a==null?1:a);el.style.opacity=FILM.flashA;},
  fade(a){FILM.fadeTo=a;},
  cap(t,dur){const el=$('filmCap');el.textContent=t;FILM.capT=dur||2.5;FILM.capD=FILM.capT;},
  hp(name,k){const el=$('filmHp');if(name==null){el.style.opacity=0;return;}el.querySelector('b').textContent=name;el.querySelector('span').style.width=(Math.max(0,Math.min(1,k))*100).toFixed(1)+'%';el.style.opacity=1;}};
const fEase=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const lerp3=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
function playFilm(def,onEnd){filmDom();fxInit();for(const k in FILM)if(k[0]==='_'||k==='cuE'||k==='cuS')delete FILM[k];if(cine){cine=null;$('cine').hidden=true;}
  Object.assign(FILM,{on:true,def,t:0,prev:-1e-6,ts:1,shake:0,cu:null,onEnd,fov0:camera.fov,view:filmViewNext,skipArm:0,skipHold:0,flashA:0,fadeTo:null,capT:0,silent:!!def.silent});
  state='cutscene';keys.clear();rightDown=false;try{promptEl.hidden=true;}catch(e){}document.body.classList.add('filming');
  const d=$('film');d.hidden=false;$('filmFade').style.opacity=def.fadeIn?1:0;$('filmFlash').style.opacity=0;$('filmCv').style.display='none';FCAM.hp(null);
  requestAnimationFrame(()=>d.classList.add('on'));if(playerMesh)playerMesh.visible=false;Object.assign(FILM,FCAM);
  filmViewNext=false;if(def.fadeIn)FILM.fadeTo=0;
  try{if(def.start)def.start(FILM);}catch(e){console.error('Film-Start',e);}}
function filmEnd(skip){const F=FILM;if(!F.on)return;F.on=false;const d=F.def;
  try{if(skip&&d.skip)d.skip(F);}catch(e){console.error(e);}
  camera.fov=F.fov0;camera.updateProjectionMatrix();Mus.cine=null;
  const el=$('film');el.classList.remove('on');$('filmCv').style.display='none';$('filmCap').style.opacity=0;$('filmSkip').style.opacity=0;FCAM.hp(null);
  setTimeout(()=>{if(!FILM.on){el.hidden=true;$('filmFade').style.opacity=0;}},900);
  document.body.classList.remove('filming');if(state==='cutscene')state='playing';try{lock();updateLockHint();}catch(e){}
  try{if(d.end)d.end(F,skip);}catch(e){console.error('Film-Ende',e);}const f=F.onEnd;F.onEnd=null;if(f)f(skip);}
function filmTick(dt){const F=FILM;fxTick(dt*(F.on?F.ts:1));if(!F.on)return;const d=F.def,fdt=dt*F.ts;F.prev=F.t;F.t+=fdt;
  if(F.shake>0)F.shake=Math.max(0,F.shake-dt*(F.shakeD||2.2));
  try{d.step(F,fdt,dt);}catch(e){console.error('Film',e);F.t=d.dur;}
  // Blitz, Abblende, Schrift
  if(F.flashA>0){F.flashA=Math.max(0,F.flashA-dt*2.4);$('filmFlash').style.opacity=F.flashA.toFixed(3);}
  if(F.fadeTo!=null){const el=$('filmFade');let o=+el.style.opacity||0;o+=(F.fadeTo-o)*Math.min(1,dt*3.2);if(Math.abs(o-F.fadeTo)<.01)o=F.fadeTo;el.style.opacity=o.toFixed(3);}
  if(F.capT>0){F.capT-=dt;const k=1-F.capT/F.capD,el=$('filmCap');const a=k<.12?k/.12:F.capT<.5?F.capT/.5:1;el.style.opacity=a.toFixed(2);el.style.transform=`scale(${(1.25-.25*Math.min(1,k/.15)).toFixed(3)})`;if(F.capT<=0)el.style.opacity=0;}
  if(F.skipHold>0){F.skipHold+=dt;const el=$('filmSkip');el.style.opacity=1;el.textContent='Überspringen … '+Math.min(100,Math.round(F.skipHold*100))+' %';if(F.skipHold>=1){F.skipHold=0;filmEnd(true);return;}}
  else if(F.skipArm>0){F.skipArm-=dt;if(F.skipArm<=0)$('filmSkip').style.opacity=0;}
  // Nahaufnahme
  const cv=$('filmCv');
  if(F.cu){if(!filmLP)filmLP=new LP(192,108);const W=innerWidth,H=innerHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}cv.style.display='block';
    const lp=filmLP;lp.clip=null;lp.clear([0,0,0]);try{F.cu.draw(lp,F.t,dt);}catch(e){console.error('Nahaufnahme',e);}lp.flush();const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
    const s=Math.max(W/192,H/108),ox=(W-192*s)/2,oy=(H-108*s)/2;let sx=0,sy=0;if(F.shake>0){sx=(Math.random()-.5)*F.shake*30;sy=(Math.random()-.5)*F.shake*30;}
    x.globalCompositeOperation='source-over';x.drawImage(lp.cv,ox+sx,oy+sy,192*s,108*s);
    if(F.cu.glow){x.globalCompositeOperation='lighter';try{F.cu.glow(x,(px,py)=>[ox+sx+px*s,oy+sy+py*s],s,F.t);}catch(e){console.error(e);}x.globalCompositeOperation='source-over';}}
  else if(cv.style.display!=='none')cv.style.display='none';
  if(F.on&&F.t>=d.dur)filmEnd(false);}
{const a=updateStory;updateStory=function(dt){a(dt);try{filmTick(dt);}catch(e){console.error('Film',e);}};}
// Während eines Films keine anderen Kamera-Änderungen und keine Spielertasten
// Filme laufen immer komplett durch: alle Tasten sind währenddessen gesperrt
document.addEventListener('keydown',e=>{if(!FILM.on)return;e.preventDefault();e.stopImmediatePropagation();},true);
document.addEventListener('keyup',e=>{if(!FILM.on)return;e.stopImmediatePropagation();},true);
// Musik: Stille im Film, und Lieder, die ab einer bestimmten Sekunde beginnen
const MUS_OFS={'bosskampf/kein_erbarmen':30};
{const a=musicWant;musicWant=function(){if(FILM.on&&FILM.silent&&!Mus.cine)return null;return a();};}
{const a=musicPlay;musicPlay=function(k){const was=Mus.cur&&Mus.cur.k===k;a(k);const m=Mus.cur;
  if(!was&&m&&m.k===k&&MUS_OFS[k]!=null){const el=m.el,o=MUS_OFS[k];const set=()=>{try{el.currentTime=o;}catch(e){}};if(el.readyState>=1)set();else el.addEventListener('loadedmetadata',set,{once:true});
    el.loop=false;el.addEventListener('ended',()=>{if(Mus.cur!==m)return;try{el.currentTime=o;const p=el.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}});}};}
