/* =========================================================
   Gegenstände am Boden – überarbeitet
   - fliegen im Bogen heraus, ploppen auf, landen mit kleinem Hüpfer
   - schweben und wippen sanft, mit weichem Schatten darunter
   - Stapel (ab 3 / ab 10 Stück) sieht man als kleinen Haufen
   - wertvolle Dinge (Münzen, Edelsteine, Werkzeuge, Waffen) funkeln
   - in der Nähe fliegen sie zu dir („Magnet“), dazu „+3 Kupfer“ über dem Boden
   - kurz vor dem Verschwinden blinken sie
   - Mehrspieler: gleiche Flugbahn und Ruheposition bei allen,
     und man sieht, wie ein anderer Spieler etwas aufsammelt
   ========================================================= */
const DROP_CAP=DROP_N*3+40,DROP_FX=[],DROP_POPS=[],DROP_SPK=[];let dropShadow=null,dropSpk=null;const SPK_N=80;
function dropSparkle(x,y,z,vx,vy,vz,life){if(DROP_SPK.length>=SPK_N)DROP_SPK.shift();DROP_SPK.push({x,y,z,vx,vy,vz,t:0,life});}
const dropValuable=id=>{const it=ITEMS[id]||{};return!!(GEMS[id]||it.dur||it.weapon||it.armor||/gold|silver|copper|coin|ring|amul|crown|krone|gem/.test(id));};
const easeBack=t=>{const c=1.9;t-=1;return 1+(c+1)*t*t*t+c*t*t;};

initDrops=function(){const list=[];for(let i=0;i<DROP_CAP;i++)list.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'stick',tint:1.05});
  dropMat=bbMaterial(decorMat.uniforms.map.value,0,0);dropMesh=makeBillboards(list,dropMat);dropMesh.geometry.instanceCount=0;scene.add(dropMesh);
  // weicher runder Schatten
  const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),gr=x.createRadialGradient(16,16,2,16,16,15);
  gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(.6,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
  const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;
  const geo=new THREE.PlaneGeometry(1,1);geo.rotateX(-Math.PI/2);
  dropShadow=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.62,polygonOffset:true,polygonOffsetFactor:-2}),DROP_N+40);
  dropShadow.count=0;dropShadow.frustumCulled=false;dropShadow.renderOrder=1;scene.add(dropShadow);
  // Funkeln: kleine Sternchen
  {const c2=document.createElement('canvas');c2.width=c2.height=8;const q=c2.getContext('2d');q.fillStyle='#fff6c0';q.fillRect(3,0,2,8);q.fillRect(0,3,8,2);q.fillStyle='#ffffff';q.fillRect(3,3,2,2);
   const t2=new THREE.CanvasTexture(c2);t2.magFilter=t2.minFilter=THREE.NearestFilter;const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.BufferAttribute(new Float32Array(SPK_N*3),3));
   dropSpk=new THREE.Points(g2,new THREE.PointsMaterial({size:.16,map:t2,transparent:true,alphaTest:.3,depthWrite:false,color:0xffe680}));dropSpk.frustumCulled=false;scene.add(dropSpk);}
  // Schrift für „+3 Kupfer“
  const st=document.createElement('style');st.textContent='#dropFeed{position:absolute;left:50%;bottom:118px;transform:translateX(-50%);display:flex;flex-direction:column-reverse;align-items:center;gap:2px;pointer-events:none}.dpop{font:700 16px var(--f-ui);color:#fff3c4;white-space:nowrap;text-shadow:0 2px 0 #000,1px 0 0 #000,-1px 0 0 #000,0 -1px 0 #000;animation:dpopIn .22s ease-out}.dpop.v{color:#ffe066}.dpop.out{transition:opacity .35s,transform .35s;opacity:0;transform:translateY(-14px)}@keyframes dpopIn{0%{transform:scale(.5) translateY(8px);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}';
  document.head.appendChild(st);const f=document.createElement('div');f.id='dropFeed';document.getElementById('hud').appendChild(f);};

// Herausfliegen im Bogen statt an der Zielstelle aufzutauchen
{const a=spawnDrop;spawnDrop=function(id,n,x,y,z){const L=drops.length,last=drops[L-1];const r=a(id,n,x,y,z);
  const d=drops[drops.length-1];if(d&&d!==last&&d.drop&&!d._u&&typeof x==='number'){const T=.62;d.vx=(d.x-x)/T;d.vz=(d.z-z)/T;d.x=x;d.z=z;d.ph=Math.random()*6.283;}return r;};}

// Einsammeln: kleine Flug-Animation, Text und – im Mehrspieler – sofort Bescheid geben
function dropPop(id,n,x,y,z){const nm=n>1?n+' '+plural(id):ITEMS[id].name;
  const old=DROP_POPS.find(p=>p.id===id&&p.t<1.6);
  if(old){old.n+=n;old.t=0;old.out=0;old.el.classList.remove('out');old.el.style.animation='none';void old.el.offsetWidth;old.el.style.animation='';old.el.textContent='+'+old.n+' '+(old.n>1?plural(id):ITEMS[id].name);return;}
  const el=document.createElement('div');el.className='dpop'+(dropValuable(id)?' v':'');el.textContent='+'+nm;(document.getElementById('dropFeed')||document.getElementById('hud')).appendChild(el);
  DROP_POPS.push({id,n,t:0,el});if(DROP_POPS.length>5){const o=DROP_POPS.shift();o.el.remove();}}
function dropFlyFx(d,to){DROP_FX.push({id:d.id,x:d.x,y:d.y,z:d.z,w:d.w,h:d.h,t:0,to});if(DROP_FX.length>40)DROP_FX.shift();}

function dropCollectAnim(d,before){const got=before-(d.n||0);if(got<=0)return;
  dropPop(d.id,got,d.x,d.y,d.z);dropFlyFx(d,'me');
}

function dropTell(d,removed){if(!MP.on||!MP.ready||!d._u)return;
  if(removed){mpSend({t:'drop-',u:d._u,by:MP.pid});DROP_SNAP.delete(d._u);}else{mpSend({t:'dropn',u:d._u,n:d.n});DROP_SNAP.set(d._u,d.n);}}

// Magnet & Einsammeln
function dropTryCollect(d,i){const before=d.n;const ok=collectDrop(d);
  if(ok){d.n=0;dropCollectAnim(d,before);drops.splice(i,1);if(target===d)target=null;dropTell(d,true);return true;}
  if(d.n<before){dropCollectAnim(d,before);dropTell(d,false);}
  d.fullT=1.5;if(!d.toldFull){d.toldFull=1;toast('Inventar ist voll');}return false;}

updateDrops=function(dt){if(!dropMesh)return;dropMat.uniforms.time.value=time;
  const play=state==='playing',px=P.x,py=P.y+.6,pz=P.z;
  for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;if(d.ph==null)d.ph=Math.random()*6.283;
    if(!d.grave&&d.t>300){drops.splice(i,1);continue;}if(d.grave&&d.t>1200){drops.splice(i,1);continue;}
    if(d.noPick>0)d.noPick-=dt;if(d.fullT>0){d.fullT-=dt;if(d.fullT<=0)d.full=false;}
    const dx=px-d.x,dz=pz-d.z,dh=Math.hypot(dx,dz),dy=py-d.y;
    // Magnet: fliegt zum Spieler, wenn noch Platz ist
    if(play&&!(d.noPick>0)&&!(d.fullT>0)&&dh<2.6&&Math.abs(dy)<2.2){
      if(dh<.7&&Math.abs(dy)<1.7){if(dropTryCollect(d,i))continue;}
      else{const sp=Math.min(14,3+(2.6-dh)*7)*dt/Math.max(dh,.01);d.x+=dx*sp;d.z+=dz*sp;d.y+=Math.max(-.3,Math.min(.3,dy))*sp*.8;d.mag=1;d.vy=Math.max(d.vy||0,0);d.vx=d.vz=0;}}
    else d.mag=0;
    if(!d.mag){
      if(d.vx||d.vz){const o={x:d.x+(d.vx||0)*dt,z:d.z+(d.vz||0)*dt};collideTreesObj(o,.15);d.x=o.x;d.z=o.z;}
      const gy=groundAt(d.x,d.z,d.y+.5);d.gy=gy;
      if(d.vy!==0||d.y>gy+.01){d.vy-=14*dt;d.y+=d.vy*dt;if(d.y<=gy){d.y=gy;if(d.vy<-2.5){d.vy=-d.vy*.32;d.land=.18;}else d.vy=0;}}
      if(d.y<=gy+.01){const fr=Math.exp(-6*dt);d.vx=(d.vx||0)*fr;d.vz=(d.vz||0)*fr;if(Math.abs(d.vx)<.05)d.vx=0;if(Math.abs(d.vz)<.05)d.vz=0;}
      // Liegt still → im Mehrspieler die genaue Stelle allen mitteilen
      if(!d.rest&&!d.vy&&!d.vx&&!d.vz&&d.y<=gy+.01){d.rest=1;if(MP.on&&MP.ready&&d._u&&!d._r)mpSend({t:'dropp',u:d._u,x:+d.x.toFixed(2),y:+d.y.toFixed(2),z:+d.z.toFixed(2)});}
    }else d.gy=groundAt(d.x,d.z,d.y+.5);
    if(d.land>0)d.land-=dt;
    // Funkeln
    if(dropValuable(d.id)&&dh<40&&Math.random()<dt*2.2)dropSparkle(d.x+(Math.random()-.5)*.35,d.y+.12+Math.random()*.4,d.z+(Math.random()-.5)*.35,0,.25,0,.7);}

  // Zeichnen
  const g=dropMesh.geometry.attributes,O=g.offset.array,S=g.size.array,U=g.uvr.array,R=g.rot.array,Ti=g.tint.array;let k=0;
  const put=(id,x,y,z,w,h,rot,tint)=>{if(k>=DROP_CAP)return;const s=SPR[id];if(!s)return;O[k*3]=x;O[k*3+1]=y;O[k*3+2]=z;S[k*2]=w;S[k*2+1]=h;U[k*4]=s.u;U[k*4+1]=s.v;U[k*4+2]=s.du;U[k*4+3]=s.dv;R[k]=rot;Ti[k]=tint;k++;};
  const M=new THREE.Matrix4();let ns=0;
  for(const d of drops){
    let sc=d.t<.28?Math.max(.05,easeBack(d.t/.28)):1;
    if(!d.grave&&d.t>285){const f=d.t>295?14:7;if(Math.sin(d.t*f)<0)continue;}
    const resting=!d.vy&&!d.vx&&!d.vz&&!d.mag,bob=resting?.07+.06*Math.sin(time*2.4+d.ph):.0,
      sq=d.land>0?1-.25*Math.sin(d.land/.18*Math.PI):1,rot=resting?.13*Math.sin(time*1.7+d.ph*1.3):(d.mag?0:d.t*7%6.283);
    const val=dropValuable(d.id),tint=1.05+(val?.22*Math.max(0,Math.sin(time*3+d.ph)):0);
    const w=d.w*sc*(2-sq),h=d.h*sc*sq,y=d.y+bob;
    if(d.n>=10)put(d.id,d.x+.16*Math.cos(d.ph+2),y-.03,d.z+.16*Math.sin(d.ph+2),w*.85,h*.85,-rot-.35,tint*.85);
    if(d.n>=3)put(d.id,d.x+.13*Math.cos(d.ph),y-.02,d.z+.13*Math.sin(d.ph),w*.9,h*.9,rot+.3,tint*.92);
    put(d.id,d.x,y,d.z,w,h,rot,tint);
    // Schatten: kleiner, wenn der Gegenstand höher schwebt
    if(dropShadow&&d.gy!=null&&ns<DROP_N+40){const up=Math.max(0,y-d.gy),ss=Math.max(.15,(.55+(d.n>=3?.15:0))*sc*(1-Math.min(.6,up*.35)));
      M.makeScale(ss,1,ss*.8);M.setPosition(d.x,d.gy+.04,d.z);dropShadow.setMatrixAt(ns++,M);}}
  // Aufsammel-Flug (zum eigenen Spieler oder zu anderen Spielern)
  for(let i=DROP_FX.length-1;i>=0;i--){const f=DROP_FX[i];f.t+=dt;const T=.22;if(f.t>T){DROP_FX.splice(i,1);continue;}
    let tx=px,ty=P.y+.9,tz=pz;if(f.to!=='me'){const Rm=typeof REMOTE!=='undefined'&&REMOTE.get(f.to);if(Rm){tx=Rm.x;ty=Rm.y+.9;tz=Rm.z;}}
    const q=f.t/T,e=q*q;put(f.id,f.x+(tx-f.x)*e,f.y+(ty-f.y)*e+Math.sin(q*Math.PI)*.4,f.z+(tz-f.z)*e,f.w*(1-q*.7),f.h*(1-q*.7),q*4,1.3);}
  dropMesh.geometry.instanceCount=k;g.offset.needsUpdate=g.size.needsUpdate=g.uvr.needsUpdate=g.rot.needsUpdate=g.tint.needsUpdate=true;
  if(dropShadow){dropShadow.count=ns;dropShadow.instanceMatrix.needsUpdate=true;}
  if(dropSpk){const A=dropSpk.geometry.attributes.position.array;let n=0;for(let i=DROP_SPK.length-1;i>=0;i--){const p=DROP_SPK[i];p.t+=dt;if(p.t>p.life){DROP_SPK.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=1.5*dt;}
    for(const p of DROP_SPK){if(Math.sin(p.t*30)<-.6)continue;A[n*3]=p.x;A[n*3+1]=p.y;A[n*3+2]=p.z;n++;}dropSpk.geometry.setDrawRange(0,n);dropSpk.geometry.attributes.position.needsUpdate=true;}
  // „+3 Kupfer“ steigt auf und verblasst
  for(let i=DROP_POPS.length-1;i>=0;i--){const p=DROP_POPS[i];p.t+=dt;if(p.t>2.2||state==='menu'){p.el.remove();DROP_POPS.splice(i,1);continue;}if(p.t>1.85&&!p.out){p.out=1;p.el.classList.add('out');}}
  // Im Mehrspieler gibt es kein „Speichern“ im Pausenmenü (die Slots sind Einzelspieler-Welten)
  const sb=document.getElementById('btnSaveSlot');if(sb){const hide=!!(MP&&MP.on);if(sb._h!==hide){sb._h=hide;sb.style.display=hide?'none':'';}}};

// Manuelles Aufheben mit E: gleiche Animation
{const a=tryPickup;tryPickup=function(){const d=target&&target.drop?target:null,before=d&&d.n,had=d&&drops.includes(d);const r=a.apply(this,arguments);
  if(d&&had){const gone=!drops.includes(d),now=gone?0:d.n;if(now<before){dropCollectAnim(d,before);dropTell(d,gone);}}return r;};}

/* ---------- Mehrspieler ---------- */
// Beim Melden eines neuen Gegenstands auch die Flugbahn mitschicken
{const a=mpSend;mpSend=function(m,to){if(m&&m.t==='drop+'&&!m.v){const d=drops.find(d=>d._u===m.u);if(d)m.v=[+(d.vx||0).toFixed(2),+(d.vy||0).toFixed(2),+(d.vz||0).toFixed(2)];}return a(m,to);};}
{const a=mpDropMsg;mpDropMsg=function(m){
  if(m.t==='drop-'&&m.by&&m.by!==MP.pid){const d=drops.find(d=>d._u===m.u);if(d){dropFlyFx(d,m.by);for(let k=0;k<5;k++)dropSparkle(d.x,d.y+.25,d.z,(Math.random()-.5)*1.6,.8+Math.random(),(Math.random()-.5)*1.6,.45);}}
  const L=drops.length;a(m);
  if(m.t==='drop+'){const d=drops.find(d=>d._u===m.u);if(d&&drops.length>L){d.x=m.x;d.y=m.y;d.z=m.z;d._r=1;d.t=0;
      if(m.v){d.vx=m.v[0];d.vy=m.v[1];d.vz=m.v[2];}else{d.vx=d.vz=0;d.vy=d.y>groundAt(d.x,d.z,d.y+.5)+.02?-.01:0;}}}};}
// Endgültige Ruheposition eines Gegenstands
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='dropp'){const d=drops.find(d=>d._u===m.u);if(d){d.x=m.x;d.y=m.y;d.z=m.z;d.vx=d.vz=d.vy=0;d.rest=1;}return;}return a(m,peer);};}

// Unvollständige alte Spielstände sollen die Spielstand-Liste nicht kaputt machen
{const a=portraitOf;portraitOf=function(c){try{return a(c);}catch(e){return a(Object.assign(defaultChar(),c||{}));}};}
