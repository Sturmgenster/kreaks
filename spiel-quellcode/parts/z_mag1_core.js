/* =========================================================
   MAGIE · Grundsystem
   - eigene leuchtende Partikel (additiv) und Rauch/Schatten-Partikel (normal)
   - Geschosse, Bodenzonen, Lichter, Beschwörungen, Wände/Brücken
   - Statuseffekte auf Gegnern: Brennen, Verlangsamen, Einfrieren, Festhalten,
     Umwerfen, Furcht, Blind, Schwäche, Bluten, Fluch, Ruhe, Rückstoß
   - Effekte auf dem Spieler (Buffs) mit Anzeige
   - Mehrspieler: Zauber werden an alle übertragen (Bild + freundliche Wirkung),
     Schaden und Effekte auf Gegner gehen wie Schläge an den Host
   Wie man Zauber bekommt, was sie kosten und wie man sie wirkt, ist noch
   vorläufig (Test-Zauberbuch in z_mag3_ui.js).
   ========================================================= */
const MAG={sel:null,cd:{},chan:null,fx:{},lights:[],zones:[],proj:[],sums:[],walls:[],eff:new Set(),pending:[],seed:1,quick:[]};
const ELEM={
  fire:{n:'Feuer',c:'#ff5a1f',c2:'#ffcc33',ic:'🔥'},
  water:{n:'Wasser',c:'#3a8cff',c2:'#c4ecff',ic:'💧'},
  nature:{n:'Natur',c:'#4fcf3a',c2:'#b8ff7a',ic:'🌿'},
  dark:{n:'Dunkle Magie',c:'#6a2aa8',c2:'#1a0a26',ic:'🌑'},
  blood:{n:'Blutmagie',c:'#a00c1c',c2:'#ff3a4a',ic:'🩸'},
  light:{n:'Licht',c:'#ffd84a',c2:'#fff8d8',ic:'✨'},
  neutral:{n:'Neutral',c:'#eef3ff',c2:'#9fb6e0',ic:'⚪'}};
const SPELLS={};const SPELL_ORDER=[];
function defSpell(id,o){o.id=id;SPELLS[id]=o;SPELL_ORDER.push(id);}

/* ---------- Farben ---------- */
const _hxC={};function mhx(c){if(typeof c!=='string')return c;let v=_hxC[c];if(v)return v;const n=parseInt(c.slice(1),16);v=_hxC[c]=[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];return v;}
const MPAL={
  fire:['#fff3a0','#ffcc33','#ff8a1f','#ff4a10','#c81e08'],smoke:['#3a3330','#5a524c','#7a716a'],
  water:['#ffffff','#c4ecff','#7ac4ff','#3a8cff','#1a4ec8'],ice:['#ffffff','#e0f6ff','#a8dcff','#6ab4ff'],
  nature:['#e8ffb0','#b8ff7a','#6ad83a','#3a9a28','#1e6a1a'],earth:['#c8a070','#9a7448','#6e5030','#4a3420'],bloom:['#ffb0d8','#ff7ab8','#fff07a','#ffffff'],
  dark:['#b07aff','#7a3ad8','#4a1a8a','#24083e','#0a0410'],poison:['#a8ff5a','#5ad83a'],
  blood:['#ff5a6a','#e0182a','#a00c1c','#600610','#300208'],
  light:['#ffffff','#fff8d8','#fff07a','#ffd84a','#e8a820'],
  neutral:['#ffffff','#eef3ff','#c8d8f8','#9fb6e0','#7a8cb8']};
const mpick=a=>a[(Math.random()*a.length)|0];

/* ---------- Partikel ---------- */
const MGP_N=2600;const MGPA=[],MGPN=[];let mgpAdd=null,mgpNorm=null;
function magPartMesh(add){const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(MGP_N*3),3));
  g.setAttribute('pcol',new THREE.BufferAttribute(new Float32Array(MGP_N*4),4));
  g.setAttribute('psize',new THREE.BufferAttribute(new Float32Array(MGP_N),1));
  const m=new THREE.ShaderMaterial({uniforms:{scale:{value:300},fogColor:{value:SKY_HOR},fogNear:{value:20},fogFar:{value:100}},
    vertexShader:'attribute vec4 pcol;attribute float psize;varying vec4 vC;varying float vD;uniform float scale;void main(){vC=pcol;vec4 mv=modelViewMatrix*vec4(position,1.0);vD=-mv.z;gl_PointSize=clamp(psize*scale/max(0.05,-mv.z),1.0,256.0);gl_Position=projectionMatrix*mv;}',
    fragmentShader:'uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;varying vec4 vC;varying float vD;void main(){vec2 q=gl_PointCoord-0.5;float d=length(q);if(d>0.5)discard;float a=vC.a*(d<0.22?1.0:(0.5-d)/0.28);float f=smoothstep(fogNear,fogFar*1.15,vD);'+
      (add?'gl_FragColor=vec4(vC.rgb,a*(1.0-f));}':'gl_FragColor=vec4(mix(vC.rgb,fogColor,f*0.8),a);}'),
    transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});
  const p=new THREE.Points(g,m);p.frustumCulled=false;p.renderOrder=add?6:5;scene.add(p);return p;}
// o: {x,y,z,vx,vy,vz,life,s (Größe in m),s1,c (Farbe),c1,a,g,drag,add}
function spark(o){const L=o.add===false?MGPN:MGPA;if(L.length>=MGP_N)L.shift();
  const c=mhx(o.c||'#ffffff'),c1=o.c1?mhx(o.c1):c;
  L.push({x:o.x,y:o.y,z:o.z,vx:o.vx||0,vy:o.vy||0,vz:o.vz||0,life:o.life||.6,t:0,s:o.s||.12,s1:o.s1!=null?o.s1:(o.s||.12)*.4,c,c1,a:o.a!=null?o.a:1,g:o.g||0,drag:o.drag||0,fl:o.fl||0,nw:1});}
function magNear(x,z,r){return Math.abs(x-camera.position.x)<(r||90)&&Math.abs(z-camera.position.z)<(r||90);}
// Wolke aus Funken: n, Farben, Geschwindigkeit
function mburst(x,y,z,n,o={}){if(!magNear(x,z))return;const cols=o.cols||['#ffffff'];for(let i=0;i<n;i++){const a=Math.random()*6.283,b=(Math.random()-.5)*Math.PI,sp=(o.spd||3)*(.35+Math.random()*.65);
  spark({x:x+(Math.random()-.5)*(o.jit||0),y:y+(Math.random()-.5)*(o.jit||0),z:z+(Math.random()-.5)*(o.jit||0),vx:Math.cos(a)*Math.cos(b)*sp,vy:Math.sin(b)*sp*(o.flat?.25:1)+(o.up||0),vz:Math.sin(a)*Math.cos(b)*sp,
    life:(o.life||.6)*(.6+Math.random()*.6),s:(o.s||.14)*(.7+Math.random()*.6),s1:o.s1,c:mpick(cols),c1:o.c1,g:o.g||0,drag:o.drag!=null?o.drag:2.5,add:o.add,a:o.a});}}
// Ring am Boden
function ringFx(x,y,z,r,n,o={}){if(!magNear(x,z))return;for(let i=0;i<n;i++){const a=i/n*6.283+Math.random()*.2,sp=o.spd||0;
  spark({x:x+Math.cos(a)*r,y:y+(o.dy||.1),z:z+Math.sin(a)*r,vx:Math.cos(a)*sp,vy:o.up||.4,vz:Math.sin(a)*sp,life:o.life||.7,s:o.s||.16,c:mpick(o.cols||['#fff']),c1:o.c1,g:o.g||0,drag:1.5,add:o.add});}}
// Linie von a nach b (Strahl)
function lineFx(ax,ay,az,bx,by,bz,o={}){if(!magNear(ax,az,120))return;const d=Math.hypot(bx-ax,by-ay,bz-az),n=Math.max(2,Math.round(d*(o.dens||4)));
  for(let i=0;i<n;i++){const k=Math.random(),j=o.jit||.06;spark({x:ax+(bx-ax)*k+(Math.random()-.5)*j,y:ay+(by-ay)*k+(Math.random()-.5)*j,z:az+(bz-az)*k+(Math.random()-.5)*j,
    vx:(Math.random()-.5)*(o.spd||.4),vy:(Math.random()-.5)*(o.spd||.4)+(o.up||0),vz:(Math.random()-.5)*(o.spd||.4),life:o.life||.25,s:o.s||.1,s1:o.s1,c:mpick(o.cols||['#fff']),c1:o.c1,add:o.add,drag:2});}}
function magPartTick(dt){const cam=camera.position;
  for(const[L,M]of[[MGPA,mgpAdd],[MGPN,mgpNorm]]){if(!M)continue;const P3=M.geometry.attributes.position.array,C=M.geometry.attributes.pcol.array,S=M.geometry.attributes.psize.array;let n=0;
    for(let i=L.length-1;i>=0;i--){const p=L[i];if(p.nw){p.nw=0;continue;}p.t+=dt;if(p.t>=p.life){L[i]=L[L.length-1];L.pop();continue;}
      if(p.drag){const f=Math.exp(-p.drag*dt);p.vx*=f;p.vy*=f;p.vz*=f;}p.vy-=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
    for(const p of L){const k=Math.min(1,p.t/p.life),fi=p.life<.25?1:Math.min(1,p.t/.06+.15),fo=p.life>1.5?Math.min(1,(p.life-p.t)/(p.life*.3)):1-Math.max(0,(k-.12)/.88),a=p.a*fi*fo*(p.fl?(.6+.4*Math.sin(time*30+p.x*7)):1);
      P3[n*3]=p.x;P3[n*3+1]=p.y;P3[n*3+2]=p.z;C[n*4]=p.c[0]+(p.c1[0]-p.c[0])*k;C[n*4+1]=p.c[1]+(p.c1[1]-p.c[1])*k;C[n*4+2]=p.c[2]+(p.c1[2]-p.c[2])*k;C[n*4+3]=a;S[n]=p.s+(p.s1-p.s)*k;n++;}
    M.geometry.setDrawRange(0,n);M.geometry.attributes.position.needsUpdate=M.geometry.attributes.pcol.needsUpdate=M.geometry.attributes.psize.needsUpdate=true;
    const u=M.material.uniforms;u.fogNear.value=scene.fog.near;u.fogFar.value=scene.fog.far;u.fogColor.value=scene.fog.color;
    u.scale.value=renderer.getDrawingBufferSize(_mgV2).y*.5/Math.tan(camera.fov*Math.PI/360);}}
const _mgV2=new THREE.Vector2();

/* ---------- Boden-Kreise (Zielanzeige, Schutzkreis …) ---------- */
let magRingTex=null;
function magRingTexture(){if(magRingTex)return magRingTex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  for(let y=0;y<64;y++)for(let X=0;X<64;X++){const d=Math.hypot(X-31.5,y-31.5);let a=0;if(d<31&&d>27)a=1;else if(d<=27)a=.18+.1*((X+y)%6<1?1:0);if(d<31&&d>27&&((Math.atan2(y-31.5,X-31.5)*8/Math.PI)|0)%2)a=.7;
    if(a){x.fillStyle=`rgba(255,255,255,${a})`;x.fillRect(X,y,1,1);}}
  magRingTex=new THREE.CanvasTexture(c);magRingTex.magFilter=magRingTex.minFilter=THREE.NearestFilter;return magRingTex;}
function magRing(x,z,r,col,o={}){const geo=new THREE.PlaneGeometry(2,2);geo.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:magRingTexture(),color:new THREE.Color(col),transparent:true,opacity:o.op||.8,depthWrite:false,blending:o.norm?THREE.NormalBlending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-4,fog:false,depthTest:!o.top}));
  m.scale.set(r,1,r);m.position.set(x,groundAt(x,z,1e4)+.12,z);m.renderOrder=4;m.frustumCulled=false;scene.add(m);return m;}
function magRingDrop(m){if(!m)return;scene.remove(m);m.geometry.dispose();m.material.dispose();}

/* ---------- Klötze (Erdwall, Eisbrücke) ---------- */
const MAG_TEX={};
function magPixTex(kind){if(MAG_TEX[kind])return MAG_TEX[kind];const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');
  const P=kind==='ice'?['#e8f8ff','#c4ecff','#9cd4f8','#7ab8ec']:kind==='blood'?['#c81e2a','#a00c1c','#7a0814','#4a0410']:['#9a8a70','#7e705a','#6a5c48','#544838'];
  for(let y=0;y<16;y++)for(let X=0;X<16;X++){let i=((X*7+y*13+(X*y)%5)%4);if(kind!=='ice'&&(y%5===0||(X+((y/5)|0)*5)%8===0))i=3;if(kind==='ice'&&(X+y)%9===0)i=0;x.fillStyle=P[i];x.fillRect(X,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;return MAG_TEX[kind]=t;}
function magBlock(x,y,z,w,h,d,yaw,kind,op){const t=magPixTex(kind).clone();t.needsUpdate=true;t.repeat.set(Math.max(1,w),Math.max(1,h));
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({map:t,transparent:op!=null,opacity:op==null?1:op}));m.position.set(x,y+h/2,z);m.rotation.y=yaw;scene.add(m);return m;}
function magBlockDrop(m){if(!m)return;scene.remove(m);m.geometry.dispose();if(m.material.map)m.material.map.dispose();m.material.dispose();}

/* ---------- Ziele ---------- */
const magDead=o=>!o||o.dead||o.alive===false||(o.hp!=null&&o.hp<=0&&o.kind!=='villager'&&o.kind!=='guard');
// alles im Umkreis eines Punktes (nutzt die gleiche Suche wie der Nahkampf)
function magTargetsAt(x,y,z,r){const sx=P.x,sy=P.y,sz=P.z,syaw=P.yaw;let out=[];
  // Bei größeren Bereichen auch etwas höher und tiefer suchen (Hänge, kleine Tiere, fliegende Gegner)
  const H=r>=2.5?[0,-2.2,2.2]:[0];
  try{P.x=x;P.z=z;for(const dh of H){P.y=y+dh-(P.eye||1.6)*.6;for(const o of frontTargets(r,-2))if(!out.includes(o))out.push(o);}}catch(e){}finally{P.x=sx;P.y=sy;P.z=sz;P.yaw=syaw;}
  return out.filter(o=>!magDead(o));}
// Feinde: friedliche Dorfbewohner und Wachen nur, wenn sie wütend sind
const magFoe=o=>!magDead(o)&&!(o.kind==='villager'&&!o.aggro&&!o.flee)&&!(o.kind==='guard'&&!o.aggro)&&!o.tame&&!(o.kind==='animal'&&o.studId)&&!(o.kind==='demon'&&o.fac!=='demon');
function magFoesAt(x,y,z,r){return magTargetsAt(x,y,z,r).filter(magFoe);}
const magUndead=o=>o&&((o.kind==='demon'&&o.fac==='demon')||o.kind==='mummy'||o.kind==='pharaoh');
const magCenter=o=>[o.x,o.y+(o.h||1.4)*.55,o.z];
// Gegner, auf den man gerade zielt
function magAim(range,cos){const c=magEye(),d=lookDir();let best=null,bs=cos||.9;
  for(const o of magFoesAt(c.x,c.y,c.z,range)){const[tx,ty,tz]=magCenter(o),dx=tx-c.x,dy=ty-c.y,dz=tz-c.z,l=Math.hypot(dx,dy,dz)||1,s=(dx*d.x+dy*d.y+dz*d.z)/l-l*.002;if(s>bs){bs=s;best=o;}}
  return best;}
// Verbündete: eigene Begleiter (Söldner, MiniGHG, Beschwörungen)
function magAllies(x,z,r){return DEM.filter(e=>e.fac==='ally'&&!e.dead&&!e.mirror&&Math.hypot(e.x-x,e.z-z)<r);}
function magEye(){return{x:P.x,y:P.y+(P.eye||1.6)*.92,z:P.z};}
// Punkt am Boden, auf den man schaut
function magGroundPoint(max){const c=magEye(),d=lookDir();let x=c.x,y=c.y,z=c.z;
  for(let s=0;s<max;s+=.4){x=c.x+d.x*s;y=c.y+d.y*s;z=c.z+d.z*s;const g=groundAt(x,z,y+1);if(y<=g){return{x,y:g,z,hit:true};}}
  return{x,y:groundAt(x,z,y+1),z,hit:false};}

/* ---------- Schaden und Effekte ---------- */
function magPower(el){let m=1;const F=MAG.fx;if(F.overheat)m*=1.5;if(F.bless)m*=1.25;if(F.rage)m*=1+(1-P.stats.hp/P.stats.maxHp)*1.5;
  const rain=magInRain(P.x,P.z);if(rain&&el==='fire')m*=.7;if(rain&&el==='water')m*=1.3;return m;}
function magHurt(o,n,el,ctx){if(!ctx.own||magDead(o)||n<=0)return;n=Math.round(n*magPower(el)*lvK(ctx)*10)/10;
  const was=magDead(o);try{hurtAny(o,n);}catch(e){console.error('Zauber-Treffer',e);}
  if(o.kind==='villager'||o.kind==='guard'){}else if(o.aggro===false)o.aggro=true;
  if(!was&&magDead(o))magOnKill(o);}
function magOnKill(o){if(MAG.fx.harvest&&Math.hypot(o.x-P.x,o.z-P.z)<18){P.stats.mp=Math.min(P.stats.maxMp,P.stats.mp+15);
  const[x,y,z]=magCenter(o);for(let i=0;i<10;i++)spark({x,y,z,vx:(P.x-x)*1.6+(Math.random()-.5),vy:(P.y+1.2-y)*1.6+1,vz:(P.z-z)*1.6+(Math.random()-.5),life:.6,s:.16,c:mpick(MPAL.dark),c1:'#4a8cff',drag:.5});}}
// Statuseffekte: nur eigene Zauber setzen sie; Mitspieler-Clients schicken sie an den Host
function magFx(o,k,dur,data,ctx){if(!ctx.own||magDead(o))return;dur*=1+.04*(((ctx&&ctx.lv)||1)-1);
  if(MP.on&&isClient()&&MP_REF.has(o)){mpSend({t:'magfx',r:MP_REF.get(o),k,dur,data:data||null},MP.hostPeer());}
  magFxApply(o,k,dur,data,true);}
function magFxApply(o,k,dur,data,own){o._mg=o._mg||{};const cur=o._mg[k],until=time+dur*(o.d&&o.d.boss&&/freeze|stun|root|fear|blind/.test(k)?.35:1);
  o._mg[k]=Object.assign(cur&&cur.until>time?cur:{},data||{},{until:Math.max(until,cur&&cur.until||0),own});
  if(o._lx==null){o._lx=o.x;o._lz=o.z;}MAG.eff.add(o);}
const magHasFx=(o,k)=>o&&o._mg&&o._mg[k]&&o._mg[k].until>time;
function magPush(o,fx,fz,ctx,stun){magFx(o,'kb',.6,{vx:fx,vz:fz},ctx);if(stun)magFx(o,'stun',stun,null,ctx);}

/* ---------- Effekte auf dem Spieler ---------- */
const MAG_FXN={overheat:['Überhitzt','fire'],exhaust:['Erschöpft','fire'],ember:['Glutspur','fire'],stream:['Strömung','water'],bubble:['Blasenschild','water'],bark:['Rindenhaut','nature'],
  shade:['Schattenschritt','dark'],harvest:['Seelenernte','dark'],rage:['Blutrausch','blood'],band:['Blutband','blood'],bless:['Segen','light'],orb:['Lichtkugel','light'],
  float:['Schweben','neutral'],mshield:['Mana-Schild','neutral'],sense:['Spüren','neutral'],recall:['Rückruf','neutral'],rain:['Regen','water']};
function magBuff(k,dur,data){const F=MAG.fx;F[k]=Object.assign(F[k]||{},data||{},{until:time+dur,dur});magHud();}
function magBuffEnd(k){const F=MAG.fx[k];if(F){const end=F.onEnd;delete MAG.fx[k];if(end)try{end.call(F);}catch(e){console.error(e);}magHud();}}

/* ---------- Geschosse ---------- */
// p: {x,y,z,vx,vy,vz,g,life,r,el,ctx,trail(p,dt),hit(p,target|null),pierce,home}
function magShoot(p){p.t=0;p.hitSet=new Set();p.pierce=p.pierce||0;MAG.proj.push(p);return p;}
function magProjTick(dt){for(let i=MAG.proj.length-1;i>=0;i--){const p=MAG.proj[i];p.t+=dt;
    if(p.home&&p.ctx.own){const tg=p.homeT&&!magDead(p.homeT)?p.homeT:(p.homeT=magFoesAt(p.x,p.y,p.z,14).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0]);
      if(tg){const[tx,ty,tz]=magCenter(tg),dx=tx-p.x,dy=ty-p.y,dz=tz-p.z,l=Math.hypot(dx,dy,dz)||1,sp=Math.hypot(p.vx,p.vy,p.vz);const k=Math.min(1,p.home*dt);p.vx+=(dx/l*sp-p.vx)*k;p.vy+=(dy/l*sp-p.vy)*k;p.vz+=(dz/l*sp-p.vz)*k;}}
    const sp=Math.hypot(p.vx,p.vy,p.vz),steps=Math.max(1,Math.ceil(sp*dt/.45));let done=false;
    for(let s=0;s<steps&&!done;s++){const h=dt/steps;p.vy-=(p.g||0)*h;p.x+=p.vx*h;p.y+=p.vy*h;p.z+=p.vz*h;
      // Gegner
      for(const o of magFoesAt(p.x,p.y,p.z,(p.r||.4)+.5)){if(p.hitSet.has(o))continue;const[tx,ty,tz]=magCenter(o);if(Math.abs(ty-p.y)>(o.h||1.4)*.65+(p.r||.4))continue;
        p.hitSet.add(o);p.hit(p,o);if(p.pierce-->0)continue;done=true;break;}
      if(done)break;
      // Boden, Höhlenwände, Häuserwände
      const g=groundAt(p.x,p.z,p.y+1);if(p.y<=g||(P.x>CAVE_X0-400&&typeof caveSolid==='function'&&caveSolid(p.x,p.z))||(p.x>60000&&p.x<CAVE_X0-400&&collHitXZ(p.x,p.z))){p.y=Math.max(p.y,g+.05);p.hit(p,null);done=true;}}
    if(!done&&p.t>p.life){if(p.fizzle)p.fizzle(p);else p.hit(p,null);done=true;}
    if(done){MAG.proj.splice(i,1);continue;}
    if(p.trail)p.trail(p,dt);}}

/* ---------- Zonen am Boden ---------- */
// z: {x,z,y,r,life,t,el,ctx,tick(z,dt),end(z),light}
function magZone(z){z.t=0;z.y=z.y!=null?z.y:groundAt(z.x,z.z,1e4);MAG.zones.push(z);return z;}
function magZoneTick(dt){for(let i=MAG.zones.length-1;i>=0;i--){const z=MAG.zones[i];z.t+=dt;if(z.follow){const f=z.follow();if(f){z.x=f.x;z.z=f.z;z.y=f.y;}}
  if(z.t>z.life||z.kill){if(z.end)z.end(z);if(z.ring)magRingDrop(z.ring);MAG.zones.splice(i,1);continue;}if(z.tick)z.tick(z,dt);}}
const magZonesOf=k=>MAG.zones.filter(z=>z.kind===k);
function magInRain(x,z){return MAG.zones.some(q=>q.kind==='rain'&&Math.hypot(q.x-x,q.z-z)<q.r);}

/* ---------- Lichter ---------- */
function magLight(o){o.t=0;MAG.lights.push(o);return o;}
function magLightSrcs(){const L=[],inC=caveCur&&P.x>CAVE_X0-400,dk=inC||P.x>60000?1:.12+.88*(1-(DN.day||0));for(let i=MAG.lights.length-1;i>=0;i--){const l=MAG.lights[i];if(l.until!=null&&time>l.until||l.kill){MAG.lights.splice(i,1);continue;}
    if(l.follow){const f=l.follow();if(f){l.x=f.x;l.y=f.y;l.z=f.z;}}if(Math.abs(l.x-P.x)>50||Math.abs(l.z-P.z)>50)continue;
    const fade=l.until!=null?Math.min(1,(l.until-time)/1.2):1;L.push({x:l.x,y:l.y,z:l.z,col:l.col,I:(l.I||1.6)*Math.max(.05,fade)*dk,dist:l.dist||12,flick:l.flick?1:0});}
  return L;}
{const a=worldTorchSources;worldTorchSources=function(){const L=a();return magLightSrcs().concat(L);};}
{const a=caveSources;caveSources=function(){const L=a();return magLightSrcs().concat(L);};}
if(typeof realmLightSrc==='function'){const a=realmLightSrc;realmLightSrc=function(){const L=a();return magLightSrcs().concat(L||[]);};}

/* ---------- Beschwörungen (Skelett, Blutgolem) ---------- */
DT.mag_skel=Object.assign({},DT.nskel,{name:'Erwecktes Skelett',fac:'ally',xp:0,loot:[],aggro:22,spd:(DT.nskel&&DT.nskel.spd||4)*1.05,tint:.75});
DT.mag_golem={name:'Blutgolem',fac:'ally',h:2.5,hp:300,dmg:22,spd:4.2,reach:2.1,cd:1.2,wind:.4,spr:'gr_',rad:.7,aggro:24,tint:-1.05};
function magSummon(type,x,z,life,o={}){if(MP.on&&isClient()){mpSend({t:'magsum',type,x:+x.toFixed(2),z:+z.toFixed(2),life,hp:o.hp||0,dmg:o.dmg||0},MP.hostPeer());return null;}
  const e=spawnEnt(type,x,z,Object.assign({hired:true,always:true,summon:true,rise:0},o.hp?{hp:o.hp}:{}));if(o.dmg){e.d=Object.assign({},e.d,{dmg:o.dmg});}
  e.sumUntil=time+life;e.special=(e,dt)=>{if(e.rise!=null){e.rise=Math.min(1,e.rise+dt*1.4);if(e.rise>=1)e.rise=null;else return true;}
    if(!e.tgt||e.tgt==='player'){const d=Math.hypot(P.x-e.x,P.z-e.z);if(d>4){entMove(e,P.x,P.z,e.d.spd,dt);return true;}}return false;};
  MAG.sums.push(e);return e;}
function magSumTick(dt){for(let i=MAG.sums.length-1;i>=0;i--){const e=MAG.sums[i];if(!DEM.includes(e)){MAG.sums.splice(i,1);continue;}
  if(time>e.sumUntil||e.dead){if(!e.dead){const[x,y,z]=magCenter(e);mburst(x,y,z,30,{cols:e.type==='mag_golem'?MPAL.blood:MPAL.dark,spd:3,life:.9,s:.2,add:false});removeEnt(e);}MAG.sums.splice(i,1);continue;}
  if(Math.random()<dt*6){const[x,y,z]=magCenter(e);spark({x:x+(Math.random()-.5)*.6,y:y+(Math.random()-.5)*e.h*.6,z:z+(Math.random()-.5)*.6,vy:.6,life:.8,s:.14,c:e.type==='mag_golem'?mpick(MPAL.blood):mpick(MPAL.dark),add:e.type==='mag_golem'?false:true,a:.8});}}}

/* ---------- Statuseffekte jedes Bild anwenden (nach der KI) ---------- */
function magEffTick(dt){
  for(const o of MAG.eff){const M=o._mg;if(!M||magDead(o)){if(M&&typeof magDeathHook==='function')try{magDeathHook(o,M);}catch(e){}MAG.eff.delete(o);if(o)delete o._lx;continue;}
    let any=false;for(const k in M){if(M[k].until<=time)delete M[k];else any=true;}
    if(!any){MAG.eff.delete(o);delete o._lx;delete o._lz;continue;}
    if(o._lx==null){o._lx=o.x;o._lz=o.z;}
    let dx=o.x-o._lx,dz=o.z-o._lz;const jump=Math.hypot(dx,dz)>6;if(jump){dx=dz=0;o._lx=o.x;o._lz=o.z;}
    const hold=M.freeze||M.root||M.stun,[cx,cy,cz]=magCenter(o);
    if(!jump){
      if(hold){o.x=o._lx;o.z=o._lz;}
      else if(M.fear){const ax=o.x-P.x,az=o.z-P.z,l=Math.hypot(ax,az)||1,fx=M.fear.x!=null?o._lx-M.fear.x:ax,fz=M.fear.z!=null?o._lz-M.fear.z:az,fl=Math.hypot(fx,fz)||1;
        o.x=o._lx+fx/fl*4.2*dt;o.z=o._lz+fz/fl*4.2*dt;if(o.kind==='demon'){o.frame=1+(Math.floor(time*6)%2);o.flip=(fx*Math.cos(P.yaw)-fz*Math.sin(P.yaw))<0;}}
      else if(M.slow){o.x=o._lx+dx*.4;o.z=o._lz+dz*.4;}
      else if(M.blind||M.calm){o.x=o._lx+dx*.5;o.z=o._lz+dz*.5;}}
    if(M.kb){const k=Math.max(0,(M.kb.until-time)/.6);o.x+=M.kb.vx*k*dt*2.2;o.z+=M.kb.vz*k*dt*2.2;}
    if((M.kb||M.fear)&&o.x<60000){const t={x:o.x,z:o.z};try{collideTreesObj(t,.3);}catch(e){}o.x=t.x;o.z=t.z;}
    if((M.kb||M.fear)&&!(o.d&&o.d.fly))o.y=groundAt(o.x,o.z,o.y+2);
    // Angriffe unterdrücken
    if(o.kind==='demon'&&(hold||M.fear||M.blind||M.calm)){o.atk=Math.max(o.atk||0,.4);o.wind=0;o.cast=0;o.rcd=Math.max(o.rcd||0,.6);if(M.blind||M.fear||M.calm){o.tgt=null;o.tgtT=.5;}if(hold&&o.frame!=='k')o.frame=0;}
    if(o.kind==='animal'&&(hold||M.fear||M.calm)){o.berserk=false;if(M.calm)o.scared=0;}
    if(o.kind==='wild'&&(M.calm||M.fear||M.blind)&&o.st==='chase'){o.st='idle';o.target=null;}
    if((o.kind==='guard'||o.kind==='villager')&&M.calm)o.aggro=false;
    // Schaden über Zeit (nur vom eigenen Zauber)
    const dot=(k,dps,el)=>{const e=M[k];if(!e||!e.own)return;e.acc=(e.acc||0)+dt;if(e.acc>=.5){e.acc-=.5;magHurt(o,dps*.5,el,{own:true});}};
    dot('burn',M.burn&&M.burn.dps||6,'fire');dot('curse',M.curse&&M.curse.dps||8,'dark');
    if(M.bleed&&M.bleed.own&&!jump){const mv=Math.hypot(o.x-o._lx,o.z-o._lz);M.bleed.acc=(M.bleed.acc||0)+mv*7;if(M.bleed.acc>=2){magHurt(o,M.bleed.acc,'blood',{own:true});M.bleed.acc=0;}}
    if(M.burn&&M.burn.own&&magInRain(o.x,o.z))delete M.burn;
    // Aussehen
    if(magNear(o.x,o.z,60)){const h=o.h||1.4,r=()=>(Math.random()-.5)*(o.w||.8)*.8;
      if(M.burn&&Math.random()<dt*26){const g=Math.random()<.4;spark({x:cx+r(),y:o.y+Math.random()*h*.9,z:cz+r(),vy:1.6+Math.random(),life:.5,s:.2,s1:.04,c:g?mpick(['#fff3a0','#ffcc33']):mpick(['#ff8a1f','#e83a08']),c1:'#5a1a08',add:g});}
      if(M.freeze&&Math.random()<dt*10)spark({x:cx+r(),y:o.y+Math.random()*h,z:cz+r(),vy:.1,life:.9,s:.12,c:mpick(MPAL.ice),add:true,a:.9});
      if(M.root&&Math.random()<dt*8)spark({x:cx+r()*1.4,y:o.y+Math.random()*.6,z:cz+r()*1.4,vy:.3,life:.8,s:.14,c:mpick(MPAL.nature),add:false});
      if(M.slow&&Math.random()<dt*5)spark({x:cx+r(),y:o.y+h*.2,z:cz+r(),vy:-.2,life:.7,s:.1,c:'#a8dcff',add:true,a:.7});
      if(M.fear&&Math.random()<dt*6)spark({x:cx+r(),y:o.y+h*1.05,z:cz+r(),vy:.8,life:.6,s:.13,c:mpick(MPAL.dark),add:false});
      if(M.blind&&Math.random()<dt*6)spark({x:cx+Math.cos(time*6)*.35,y:o.y+h*.95,z:cz+Math.sin(time*6)*.35,life:.4,s:.12,c:'#fff8d8',add:true});
      if(M.weak&&Math.random()<dt*5)spark({x:cx+r(),y:o.y+h*.9,z:cz+r(),vy:-.6,life:.8,s:.12,c:'#7a3ad8',add:false,a:.8});
      if(M.curse&&Math.random()<dt*9)spark({x:cx+Math.cos(time*4+o.x)*.5,y:o.y+Math.random()*h,z:cz+Math.sin(time*4+o.x)*.5,vy:.5,life:.7,s:.14,c:mpick(['#24083e','#7a3ad8','#a8ff5a']),add:false});
      if(M.bleed&&Math.random()<dt*7)spark({x:cx+r(),y:o.y+h*.6,z:cz+r(),vy:-1,g:6,life:.6,s:.09,c:mpick(MPAL.blood),add:false});
      if(M.calm&&Math.random()<dt*3)spark({x:cx+r(),y:o.y+h*1.05,z:cz+r(),vy:.5,life:1,s:.12,c:mpick(MPAL.bloom),add:true,a:.8});
      if(M.stun&&Math.random()<dt*6)spark({x:cx+Math.cos(time*9)*.3,y:o.y+h*1.02,z:cz+Math.sin(time*9)*.3,life:.3,s:.1,c:'#fff07a',add:true});}
    o._lx=o.x;o._lz=o.z;}}
// Gefesselte, verängstigte, geblendete Gegner greifen nicht an, geschwächte machen weniger Schaden
{const a=meleeHit;meleeHit=function(e,t,dmg){if(magHasFx(e,'freeze')||magHasFx(e,'stun')||magHasFx(e,'fear')||magHasFx(e,'blind')||magHasFx(e,'calm'))return;
  if(magHasFx(e,'weak'))dmg*=.7;if(e&&e.blessU>time)dmg*=1.25;return a(e,t,dmg);};}
// Schattenschritt: Gegner verlieren dich aus den Augen
{const a=pickTarget;pickTarget=function(e){const r=a(e);if(r==='player'&&MAG.fx.shade)return null;return r;};}
// Bildschirm wackeln (Meteor, Erdbeben)
let magShakeT=0,magShakeA=0;function magShake(a,dur){magShakeA=Math.max(magShakeA*(magShakeT>0?1:0),a);magShakeT=Math.max(magShakeT,dur);}
{const a=placeCamera;placeCamera=function(b,h){a(b,h);if(magShakeT>0&&state!=='paused'){const k=magShakeA*Math.min(1,magShakeT);camera.position.x+=(Math.random()-.5)*k;camera.position.y+=(Math.random()-.5)*k;camera.position.z+=(Math.random()-.5)*k;}};}
{const a=shoot;shoot=function(e,tx,ty,tz,R,o){if(magHasFx(e,'freeze')||magHasFx(e,'stun')||magHasFx(e,'blind')||magHasFx(e,'fear'))return;if(magHasFx(e,'weak'))R=Object.assign({},R,{dmg:R.dmg*.7});return a(e,tx,ty,tz,R,o);};}
{const a=bite;bite=function(an,dmg,kb){if(magHasFx(an,'freeze')||magHasFx(an,'stun')||magHasFx(an,'fear')||magHasFx(an,'calm')||magHasFx(an,'root')||magHasFx(an,'blind'))return;if(magHasFx(an,'weak'))dmg*=.7;return a(an,dmg,kb);};}

/* ---------- Spieler: Schaden, Tempo, Mana ---------- */
{const a=takeDamage;takeDamage=function(n){if(cheatOn()||state==='dead'||n<=0)return a(n);const F=MAG.fx;
  if(F.bubble){const take=Math.min(n,F.bubble.hp);F.bubble.hp-=take;n-=take;mburst(P.x,P.y+1,P.z,16,{cols:MPAL.water,spd:3,life:.5,s:.14,add:true});magSnd('bubble',P.x,P.z,.7);if(F.bubble.hp<=0){magBuffEnd('bubble');mburst(P.x,P.y+1,P.z,40,{cols:MPAL.water,spd:5,life:.7,s:.16,add:true});}if(n<=0){magHud();return;}}
  if(F.mshield&&P.stats.mp>0){const take=Math.min(n,P.stats.mp);P.stats.mp-=take;n-=take;mburst(P.x,P.y+1,P.z,10,{cols:MPAL.neutral,spd:2.5,life:.4,s:.12,add:true});if(n<=0){renderStats();return;}}
  if(F.bark)n*=.6;
  if(F.band&&F.band.ally){const al=F.band.ally;if(al==='remote'){const R=REMOTE.get(F.band.pid);if(R&&time-R.seen<4){const peer=[...MP.peerPid].find(([,p])=>p===F.band.pid);if(peer)mpSend({t:'magband',n:+(n/2).toFixed(1),from:P.char&&P.char.name},peer[0]);n/=2;}}
    else if(!al.dead&&DEM.includes(al)){al.hp-=n/2;al.hurt=.2;n/=2;}}
  if(F.recall){F.recall.cancel=1;magBuffEnd('recall');toast('Rückruf abgebrochen');}
  return a(n);};}
{const a=armorFactor;armorFactor=function(){return a();};}
{const a=updatePlayer;updatePlayer=function(dt){const F=MAG.fx,M=P.mods;let bs=null,wm=null;
  if(M&&M.baseSpeed){bs=M.baseSpeed;if(F.bark)M.baseSpeed*=.8;}
  if(M&&F.stream){wm=M.waterMul;M.waterMul=(M.waterMul||1)*2;}
  if(F.float&&P.vy<-2.2)P.vy=-2.2;
  const mp0=P.stats.mp;
  try{a(dt);}finally{if(bs!=null)M.baseSpeed=bs;if(wm!=null)M.waterMul=wm;}
  if(F.float&&P.vy<-2.2)P.vy=-2.2;
  if(F.exhaust&&P.stats.mp>mp0)P.stats.mp=mp0;};}
// Waffenschaden: Segen und Blutrausch helfen auch im Nahkampf
{const a=weaponMult;weaponMult=function(t){let m=a(t);if(MAG.fx.bless)m*=1.25;if(MAG.fx.rage)m*=1+(1-P.stats.hp/P.stats.maxHp)*1.5;return m;};}
// Begehbare Flächen (Eisbrücke, Erdwall-Oberkante)
{const a=collTopAt;collTopAt=function(x,z,feet){let best=a(x,z,feet);for(const w of MAG.walls){if(!w.walk)continue;const qx=x-w.x,qz=z-w.z,lx=qx*Math.cos(w.yaw)-qz*Math.sin(w.yaw),lz=qx*Math.sin(w.yaw)+qz*Math.cos(w.yaw);
    if(Math.abs(lx)<w.hw&&Math.abs(lz)<w.hd&&w.top<=feet+.6&&w.top>best)best=w.top;}return best;};}
// Wände: Gegner und Spieler werden herausgeschoben
function magWallTick(dt){for(let i=MAG.walls.length-1;i>=0;i--){const w=MAG.walls[i];w.t=(w.t||0)+dt;
    if(w.t>w.life||w.hp<=0){if(w.end)w.end(w);for(const m of w.meshes||[])magBlockDrop(m);MAG.walls.splice(i,1);continue;}
    if(w.rise!=null&&w.meshes){w.rise=Math.min(1,w.rise+dt*3);for(const m of w.meshes){m.position.y=m.userData.y-(1-w.rise)*m.userData.h;}if(w.rise>=1)w.rise=null;}
    if(w.t>w.life-1&&w.meshes)for(const m of w.meshes){m.position.y=m.userData.y-(w.t-(w.life-1))*m.userData.h;}
    if(w.solid){const push=(o,isP)=>{const qx=o.x-w.x,qz=o.z-w.z,c=Math.cos(w.yaw),s=Math.sin(w.yaw),lx=qx*c-qz*s,lz=qx*s+qz*c,R=isP?.35:.4;
        if(Math.abs(lx)<w.hw+R&&Math.abs(lz)<w.hd+R&&(isP?P.y<w.top-.3:true)){const nz=(lz<0?-1:1)*(w.hd+R);const nx=lx;o.x=w.x+nx*c+nz*s;o.z=w.z-nx*s+nz*c;if(o._lx!=null){o._lx=o.x;o._lz=o.z;}}};
      if(Math.hypot(P.x-w.x,P.z-w.z)<w.hw+3)push(P,true);
      w.acc=(w.acc||0)+dt;if(w.acc>=.1){w.acc=0;w.near=magFoesAt(w.x,w.y+1,w.z,w.hw+2);}for(const o of w.near||[])if(!magDead(o)&&(o.kind!=='demon'||!o.d.fly))push(o,false);}}}

/* ---------- Klänge ---------- */
function magSnd(k,x,z,vol){const c=Snd.ctx;if(!c)return;const d=x==null?0:Math.hypot(x-P.x,z-P.z);if(d>45)return;const v=(vol||1)*Math.pow(1-d/45,1.5),t=c.currentTime;
  const noise=(f0,f1,dur,pk,type,q)=>{const s=c.createBufferSource();s.buffer=Snd.noise;const f=c.createBiquadFilter();f.type=type||'bandpass';f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);if(q)f.Q.value=q;const g=c.createGain();Snd.env(g,t,.01,pk*v,dur);s.connect(f);f.connect(g);g.connect(Snd.sfx);s.start(t,Math.random(),dur+.1);};
  const tn=(type,f0,f1,dur,pk,dl,filt)=>{const{o}=Snd.tone(type,f0,t+(dl||0),dur,pk*v,null,filt);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+(dl||0)+dur);};
  switch(k){
    case'cast':tn('triangle',520,880,.18,.05);break;
    case'fire':noise(900,300,.35,.12,'lowpass');tn('sawtooth',160,90,.25,.03,0,700);break;
    case'whoosh':noise(500,1800,.3,.09);break;
    case'boom':noise(600,80,.8,.32,'lowpass');tn('sine',90,35,.6,.28);break;
    case'bigboom':noise(800,50,1.4,.5,'lowpass');tn('sine',70,25,1.2,.4);break;
    case'ice':tn('square',1800,2400,.08,.04,0,6000);tn('triangle',2600,1900,.25,.05,.05);noise(4000,2500,.2,.06,'highpass');break;
    case'water':noise(1200,400,.45,.12,'bandpass',1.4);break;
    case'bubble':tn('sine',300,900,.12,.08);tn('sine',500,1300,.1,.05,.06);break;
    case'earth':noise(300,60,.5,.3,'lowpass');tn('square',70,40,.3,.06,0,300);break;
    case'leaf':noise(2500,1200,.35,.07,'bandpass',.8);tn('triangle',660,990,.15,.04,.05);break;
    case'dark':tn('sawtooth',110,55,.6,.06,0,500);tn('sine',220,110,.6,.06);noise(400,150,.5,.06,'lowpass');break;
    case'blood':noise(700,200,.25,.1,'lowpass');tn('sine',180,70,.35,.12);break;
    case'light':[784,988,1175,1568].forEach((f,i)=>tn('triangle',f,0,.5,.04,i*.05));break;
    case'heal':[523,659,784,1047].forEach((f,i)=>tn('sine',f,0,.6,.06,i*.08));break;
    case'zap':tn('square',1200,300,.12,.05,0,4000);noise(3000,800,.15,.05);break;
    case'chime':tn('sine',1320,0,.8,.05);tn('sine',1980,0,.8,.03,.02);break;
    case'tp':tn('sine',300,1400,.25,.07);noise(800,3000,.25,.06);break;
    case'rumble':noise(120,40,2,.45,'lowpass');tn('sine',45,30,2,.3);break;
    case'fizzle':noise(2000,500,.2,.05);break;}}

/* ---------- Zauber wirken ---------- */
// Stufen: jede Stufe +10 % Wirkung, -3 % Mana
const magLv=id=>cheatOn()?10:Math.min(10,(FLAGS.spells&&FLAGS.spells[id])||0);
const lvK=c=>1+.1*(((c&&c.lv)||1)-1);
function magManaCost(S){const m=typeof S.mana==='function'?S.mana():S.mana||0,lv=Math.max(1,magLv(S.id));return Math.round(m*(1-.03*(lv-1)));}
function magCtxLocal(id){const e=magEye(),d=lookDir();return{own:true,lv:Math.max(1,magLv(id)),caster:P,isMe:true,o:{x:e.x,y:e.y,z:e.z},d:{x:d.x,y:d.y,z:d.z},yaw:P.yaw,pitch:P.pitch,seed:(MAG.seed=(MAG.seed*16807)%2147483647)};}
function magCan(S,quiet){if(state!=='playing')return false;if(P.x>60000&&P.x<CAVE_X0-400&&S.noIndoor){if(!quiet)toast('Das geht hier drinnen nicht.');return false;}
  const cd=MAG.cd[S.id]||0;if(time<cd){if(!quiet)toast(`${S.name}: noch ${Math.ceil(cd-time)} s`);return false;}
  if(P.mods&&P.mods.noMagic&&S.el!=='blood'){if(!quiet)toast('Dein Volk kann keine Magie wirken.');return false;}
  if(!cheatOn()){if(!magLv(S.id)){if(!quiet)toast('Diesen Zauber kennst du noch nicht.');return false;}const mana=magManaCost(S),hp=typeof S.hp==='function'?S.hp():S.hp||0;
    if(P.stats.mp<mana){if(!quiet){toast('Zu wenig Mana');magSnd('fizzle');}return false;}if(hp&&P.stats.hp<=hp+1){if(!quiet)toast('Zu wenig Leben');return false;}}
  return true;}
function magPay(S){if(cheatOn())return;const mana=magManaCost(S),hp=typeof S.hp==='function'?S.hp():S.hp||0;P.stats.mp=Math.max(0,P.stats.mp-mana);if(hp){P.stats.hp=Math.max(1,P.stats.hp-hp);P.lastDmg=time;magBloodFlash();}renderStats();}
function castSpell(id){const S=SPELLS[id];if(!S||!magCan(S))return false;
  if(S.chan){MAG.chan={id,S,t:0,ctx:magCtxLocal(id)};magPay(S);if(S.start)S.start(MAG.chan.ctx);magNet({t:'magc',id,ph:'start',...magPack(MAG.chan.ctx)});magSnd('cast');return true;}
  const ctx=magCtxLocal(id);if(S.check&&!S.check(ctx))return false;magPay(S);MAG.cd[id]=time+(S.cd||1);P.lastAction=time;
  try{S.cast(ctx);}catch(e){console.error('Zauber',id,e);}
  magNet({t:'magc',id,...magPack(ctx)});magHandFx(S);magHud();return true;}
function magPack(c){return{pid:MP.pid,o:[+c.o.x.toFixed(2),+c.o.y.toFixed(2),+c.o.z.toFixed(2)],d:[+c.d.x.toFixed(3),+c.d.y.toFixed(3),+c.d.z.toFixed(3)],yaw:+c.yaw.toFixed(3),pitch:+c.pitch.toFixed(3),seed:c.seed,x:c.x,lv:c.lv||1}; }
function magChanTick(dt){const C=MAG.chan;if(!C)return;const S=C.S;
  if(state!=='playing'||!MAG.hold||!magCan(Object.assign({},S,{mana:0,hp:0}),true)){magChanStop();return;}
  const per=(S.chanCost||10)*(1-.03*((C.ctx.lv||1)-1))*dt;if(!cheatOn()){if(S.el==='blood'&&S.chanHp){P.stats.hp-=S.chanHp*dt;if(P.stats.hp<=1){P.stats.hp=1;magChanStop();return;}}if(P.stats.mp<per){toast('Zu wenig Mana');magChanStop();return;}P.stats.mp-=per;}
  C.t+=dt;const e=magEye(),d=lookDir();Object.assign(C.ctx.o,e);Object.assign(C.ctx.d,{x:d.x,y:d.y,z:d.z});C.ctx.yaw=P.yaw;C.ctx.pitch=P.pitch;
  try{S.tick(C.ctx,dt);}catch(err){console.error('Zauber',C.id,err);magChanStop();return;}
  C.net=(C.net||0)-dt;if(C.net<=0){C.net=.15;magNet({t:'magc',id:C.id,ph:'tick',...magPack(C.ctx)});}
  if(Math.floor(C.t*4)!==Math.floor((C.t-dt)*4))renderStats();}
function magChanStop(){const C=MAG.chan;if(!C)return;MAG.chan=null;MAG.cd[C.id]=time+(C.S.cd||.5);if(C.S.stop)C.S.stop(C.ctx);magNet({t:'magc',id:C.id,ph:'stop',pid:MP.pid});renderStats();magHud();}
// kleine Lichtblitze an der Hand
function magHandFx(S){const e=magEye(),d=lookDir(),E=ELEM[S.el],x=e.x+d.x*.7-Math.cos(P.yaw)*.25,y=e.y-.35+d.y*.7,z=e.z+d.z*.7+Math.sin(P.yaw)*.25;
  mburst(x,y,z,10,{cols:[E.c,E.c2,'#ffffff'],spd:1.2,life:.35,s:.07,add:S.el!=='dark'&&S.el!=='blood'});}
let magFlashEl=null;function magScreen(col,a,dur){if(!magFlashEl){magFlashEl=document.createElement('div');magFlashEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4;opacity:0;transition:opacity .25s';document.body.appendChild(magFlashEl);}
  magFlashEl.style.transition='none';magFlashEl.style.background=col;magFlashEl.style.opacity=a;void magFlashEl.offsetWidth;magFlashEl.style.transition=`opacity ${dur||.5}s`;magFlashEl.style.opacity=0;}
const magBloodFlash=()=>magScreen('radial-gradient(ellipse at center,rgba(120,0,10,0) 45%,rgba(140,0,16,.55) 100%)',1,.7);

/* ---------- Mehrspieler ---------- */
function magNet(m){if(MP.on&&MP.ready)mpSend(m);}
const MAG_REMOTE_CH=new Map();
function magRemoteCtx(m){const R=REMOTE.get(m.pid);return{own:false,lv:m.lv||1,caster:R||{x:m.o[0],y:m.o[1]-1.5,z:m.o[2],yaw:m.yaw},isMe:false,remote:R,o:{x:m.o[0],y:m.o[1],z:m.o[2]},d:{x:m.d[0],y:m.d[1],z:m.d[2]},yaw:m.yaw,pitch:m.pitch,seed:m.seed,x:m.x};}
function magOnNet(m){const S=SPELLS[m.id];
  if(m.t==='magc'){if(!S)return;if(m.ph==='start'){const c=magRemoteCtx(m);MAG_REMOTE_CH.set(m.pid,{S,ctx:c,last:time});if(S.start)S.start(c);}
    else if(m.ph==='tick'){let C=MAG_REMOTE_CH.get(m.pid);if(!C){C={S,ctx:magRemoteCtx(m)};MAG_REMOTE_CH.set(m.pid,C);if(S.start)S.start(C.ctx);}const n=magRemoteCtx(m);Object.assign(C.ctx.o,n.o);Object.assign(C.ctx.d,n.d);C.ctx.x=n.x;C.last=time;}
    else if(m.ph==='stop'){const C=MAG_REMOTE_CH.get(m.pid);if(C&&C.S.stop)C.S.stop(C.ctx);MAG_REMOTE_CH.delete(m.pid);}
    else{const c=magRemoteCtx(m);try{S.cast(c);}catch(e){console.error('Zauber (Mitspieler)',m.id,e);}}}
  else if(m.t==='magfx'){if(!isHostMP())return;const r=m.r;let o=null;
    if(r[0]==='s'){const A=MG_GET[r[1]]&&MG_GET[r[1]]();o=A&&A[r[2]];}else if(r[0]==='dem')o=DEM.find(e=>e._u===r[1]);else if(r[0]==='wm')o=WM.find(x=>x._u===r[1]);else if(r[0]==='spy')o=spy;
    if(o)magFxApply(o,m.k,m.dur,m.data,false);}
  else if(m.t==='magsum'){if(!isHostMP())return;magSummon(m.type,m.x,m.z,m.life,{hp:m.hp||0,dmg:m.dmg||0});}
  else if(m.t==='magheal'){if(state==='dead')return;P.stats.hp=Math.min(P.stats.maxHp,P.stats.hp+m.n);renderStats();mburst(P.x,P.y+1,P.z,24,{cols:MPAL.light,spd:2,up:1,life:.8,s:.12,add:true});magSnd('heal');if(m.from)chatLine(`${mpEsc(m.from)} hat dich geheilt.`,true);}
  else if(m.t==='magband'){takeDamage(m.n);}
  else if(m.t==='magbuff'){if(m.k==='bless')magBuff('bless',m.dur);if(m.k==='purify')magPurifySelf();if(m.from)chatLine(`${mpEsc(m.from)}: ${MAG_FXN[m.k]?MAG_FXN[m.k][0]:'Läuterung'}`,true);}}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&typeof m.t==='string'&&m.t.startsWith('mag')){try{magOnNet(m,peer);}catch(e){console.error('Magie MP',e);}return;}return a(m,peer);};}
function magRemoteTick(dt){for(const[pid,C]of MAG_REMOTE_CH){if(time-C.last>1.2){if(C.S.stop)C.S.stop(C.ctx);MAG_REMOTE_CH.delete(pid);continue;}try{C.S.tick(C.ctx,dt);}catch(e){MAG_REMOTE_CH.delete(pid);}}}
function magPurifySelf(){P.burnT=0;for(const k of['exhaust'])magBuffEnd(k);if(P.buffs)for(const k of['poison','slow'])delete P.buffs[k];mburst(P.x,P.y+1,P.z,30,{cols:MPAL.light,spd:2.5,up:1.2,life:.9,s:.13,add:true});}

/* ---------- Spieler-Effekte jedes Bild ---------- */
function magBuffTick(dt){const F=MAG.fx;let ch=false;for(const k in F){if(F[k].until<=time){magBuffEnd(k);ch=true;}else if(F[k].tick)F[k].tick(F[k],dt);}
  if(ch)magHud();}

/* ---------- Hauptschleife ---------- */
function magTick(dt){if(!mgpAdd){mgpAdd=magPartMesh(true);mgpNorm=magPartMesh(false);}
  const run=state!=='menu'&&state!=='loading'&&state!=='paused'&&!(state==='settings');
  if(magShakeT>0)magShakeT-=dt;
  if(run){magChanTick(dt);magRemoteTick(dt);magProjTick(dt);magZoneTick(dt);magWallTick(dt);magEffTick(dt);magSumTick(dt);magBuffTick(dt);}
  magPartTick(run?dt:0);if(typeof magHudTick==='function')magHudTick(dt);}
{const a=updateDayNight;updateDayNight=function(dt,nf){a(dt,nf);try{magTick(dt);}catch(e){console.error('Magie',e);}};}
// Beim Laden/Neustart aufräumen
function magReset(){for(const z of MAG.zones){if(z.end)try{z.end(z);}catch(e){}if(z.ring)magRingDrop(z.ring);}MAG.zones.length=0;MAG.proj.length=0;MAG.lights.length=0;
  for(const w of MAG.walls)for(const m of w.meshes||[])magBlockDrop(m);MAG.walls.length=0;for(const e of MAG.sums)if(DEM.includes(e))removeEnt(e);MAG.sums.length=0;
  MAG.eff.clear();MAG.fx={};MAG.cd={};MAG.chan=null;MGPA.length=0;MGPN.length=0;if(typeof magHud==='function')magHud();}
{const a=startGame;startGame=function(){magReset();return a.apply(this,arguments);};}
