/* =========================================================
   V72 · Reiten in der Gruppe
   - Steigst du auf, rufen deine Begleiter ihr eigenes Reittier und sitzen auf:
     Kreak einen Rappen, Bruna einen Braunen, Ivo einen Elch, Lyra einen weißen
     Hirsch, Fenn ein großes dickes Schwein, Mira einen Schimmel, Theo einen Esel.
   - Im Mehrspieler sieht man, wer reitet (Spieler, Kreak, Söldner).
   - Söldner gehören immer nur einem Spieler: Wer einen anheuert, nimmt ihn
     den anderen weg, bis der Vertrag endet.
   ========================================================= */
// ---------- Reittiere der Begleiter ----------
function steedSaddle(cv,cxF,wF,lift){const W=cv.width,H=cv.height,x=cv.getContext('2d'),d=x.getImageData(0,0,W,H),D=d.data,A=(i,j)=>D[(j*W+i)*4+3];
  const x0=Math.round(W*(cxF-wF/2)),x1=Math.round(W*(cxF+wF/2)),put=(i,j,c)=>{if(i<0||j<0||i>=W||j>=H)return;const o=(j*W+i)*4;D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;};
  for(let i=x0;i<=x1;i++){let j=0;while(j<H&&!A(i,j))j++;if(j>=H)continue;j+=lift||0;const edge=i===x0||i===x1;for(let k=0;k<3;k++)put(i,j+k,FPAL.blanket[edge||k===2?0:((i+k)%4?2:1)]);put(i,j-1,FPAL.saddle[edge?0:2]);if(i>x0+1&&i<x1-1)put(i,j-2,FPAL.saddle[1]);}
  const mx=Math.round((x0+x1)/2);for(let k=3;k<9;k++)put(mx,(()=>{let j=0;while(j<H&&!A(mx,j))j++;return j;})()+k,FPAL.saddle[1]);
  x.putImageData(d,0,0);return cv;}
function recolorCv(cv,P,keepDark){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');x.drawImage(cv,0,0);const d=x.getImageData(0,0,o.width,o.height),D=d.data;
  for(let i=0;i<D.length;i+=4){if(!D[i+3])continue;const L=(D[i]*.3+D[i+1]*.59+D[i+2]*.11)/255;if(keepDark&&L<.09)continue;const c=P[clamp(Math.floor(L*1.9*P.length),0,P.length-1)];D[i]=c[0];D[i+1]=c[1];D[i+2]=c[2];}x.putImageData(d,0,0);return o;}
const STEEDS={
  rappe:{n:'Rappe',draw:f=>drawFarm('horse',f,2,22,true),ppm:22,saddle:1.52},
  braun:{n:'Brauner',draw:f=>drawFarm('horse',f,0,22,true),ppm:22,saddle:1.52},
  schimmel:{n:'Schimmel',draw:f=>drawFarm('horse',f,1,22,true),ppm:22,saddle:1.52},
  esel:{n:'Esel',draw:f=>drawFarm('donkey',f,0,22,true),ppm:22,saddle:1.12},
  elch:{n:'Elch',draw:f=>steedSaddle(drawAnimal('elk',f,true),.45,.26,1),h:2.55,saddle:1.72},
  hirsch:{n:'weißer Hirsch',draw:f=>steedSaddle(recolorCv(drawAnimal('deer',f,true),pal(['#6a7280','#a8b0bc','#d4dae2','#eef2f6','#ffffff']),true),.42,.3,1),h:2.6,saddle:1.55},
  schwein:{n:'Riesenschwein',draw:f=>steedSaddle(recolorCv(drawAnimal('boar',f),pal(['#6a3434','#a05a58','#c87c78','#e8a09a','#f8c4bc']),true),.45,.34,1),h:1.9,saddle:1.28}};
const COMP_STEED={kreak:'rappe',bruna:'braun',ivo:'elch',lyra:'hirsch',fenn:'schwein',mira:'schimmel',theo:'esel'};
const COMP_CALL={kreak:['Zu mir, Schatten!','Na komm, mein Schwarzer.'],bruna:['Hoch mit dir, Brauner!'],ivo:['Elch! Bei Fuß!','Komm her, du großer Kerl.'],lyra:['(Lyra pfeift leise. Ein weißer Hirsch tritt aus dem Nichts.)'],
  fenn:['BORSTE! Futterzeit … nein, Reitzeit!','Da ist ja mein Prachtschwein!'],mira:['Komm, Mondlicht.'],theo:['Langsam, Esel, langsam. Wir sind beide nicht mehr die Jüngsten.']};
let steedMesh=null;const STEED_N=24;
function initSteeds(){const L=[];for(const k in STEEDS)for(let f=0;f<3;f++)L.push(['st_'+k+'_'+f,STEEDS[k].draw(f)]);
  const AW=1024;let x=2,y=2,rowH=0;const pos=[];L.sort((a,b)=>b[1].height-a[1].height);for(const[n,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([n,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  let AH=64;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');for(const[n,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[n]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  for(const k in STEEDS){const s=SPR['st_'+k+'_0'],S=STEEDS[k];if(S.ppm){S.w=s.w/S.ppm;S.hh=s.h/S.ppm;}else{S.hh=S.h;S.w=S.h*s.w/s.h;}}
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;const m=bbMaterial(tex,0,0);EXTRA_BB.push(m);
  const ph=[];for(let k=0;k<STEED_N;k++)ph.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'st_braun_0',tint:1});steedMesh=makeBillboards(ph,m);steedMesh.frustumCulled=false;steedMesh.geometry.instanceCount=0;scene.add(steedMesh);
  // Mitspieler-Geister: Kreak und Söldner bekommen eigene Bildplätze (damit man sie umbauen kann)
  ghostKreakMesh=makeBillboards([0,1,2,3,4,5].map(()=>({x:0,y:-999,z:0,w:.01,h:.01,spr:'kd_0',tint:1})),kreakMat);ghostKreakMesh.frustumCulled=false;ghostKreakMesh.geometry.instanceCount=6;scene.add(ghostKreakMesh);
  if(mercMesh){ghostMercMesh=makeBillboards(MERCS.map(()=>({x:0,y:-999,z:0,w:.01,h:.01,spr:'mc0_0',tint:1})),mercMesh.material);ghostMercMesh.frustumCulled=false;ghostMercMesh.geometry.instanceCount=MERCS.length;scene.add(ghostMercMesh);}}
let ghostKreakMesh=null,ghostMercMesh=null;
{const i6=initDemons;initDemons=function(a){i6(a);try{initSteeds();}catch(e){console.error('Reittiere',e);}};}
// ---------- Wer reitet gerade? ----------
function compKey(e){if(e===kreakE)return'kreak';if(e.merc)return e.merc.id;return null;}
function compFollowing(e){if(!e||e.dead||e.hidden||e.down>0)return false;if(e===kreakE)return e.mode==='follow'&&!e.scene&&!e.rescue;return!!(e.merc&&e.hired&&e.mode==='follow');}
function rideCompanions(dt){const want=!!P.riding&&P.x<60000&&state!=='cutscene';
  for(const e of[kreakE,...mercEnts]){if(!e||!DEM.includes(e))continue;const k=compKey(e);if(!k)continue;const go=want&&compFollowing(e);
    if(go&&!e.steed){e.callT=(e.callT||0)+dt;if(!e.called){e.called=1;const L=COMP_CALL[k]||['Zu mir!'];if(Math.hypot(e.x-P.x,e.z-P.z)<40)say(e,L[(Math.random()*L.length)|0],2.6);try{Snd.whistle();}catch(_){}}
      if(e.callT>.9){e.steed=COMP_STEED[k]||'braun';steedPuff(e);}}
    else if(!go&&(e.steed||e.called)){if(e.steed)steedPuff(e);e.steed=null;e.called=0;e.callT=0;}}}
function steedPuff(e){for(let k=0;k<22;k++)spawnParticle(e.x+(Math.random()-.5)*2,e.y+Math.random()*1.6,e.z+(Math.random()-.5)*2,(Math.random()-.5)*2,.6+Math.random()*1.4,(Math.random()-.5)*2,Math.random()<.5?0xd8c8a0:0xffffff,.8,.25);}
// ---------- Zeichnen: Reittier unter dem Reiter, Reiter sitzt im Sattel ----------
let steedN=0;
function steedDraw(x,y,z,key,flip,moving,anim){if(!steedMesh||steedN>=STEED_N)return;const S=STEEDS[key];if(!S)return;const f=moving?1+(Math.floor(anim)%2):0,s=SPR['st_'+key+'_'+f],g=steedMesh.geometry.attributes,n=steedN++;
  g.offset.array[n*3]=x;g.offset.array[n*3+1]=y-.04;g.offset.array[n*3+2]=z;g.size.array[n*2]=S.w;g.size.array[n*2+1]=S.hh;g.uvr.array[n*4]=flip?s.u+s.du:s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=flip?-s.du:s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=1;g.rot.array[n]=0;}
// Den Reiter im Bildpuffer anheben, nach vorn schieben und sitzen lassen
function riderPatch(KM,ni,sitSpr,lift){const ga=KM.geometry.attributes;if(ga.offset.array[ni*3+1]<-900)return;const s=SPR[sitSpr];const x=ga.offset.array[ni*3],z=ga.offset.array[ni*3+2],cx=camera.position.x-x,cz=camera.position.z-z,l=Math.hypot(cx,cz)||1;
  ga.offset.array[ni*3]+=cx/l*.18;ga.offset.array[ni*3+2]+=cz/l*.18;ga.offset.array[ni*3+1]+=lift;if(s){const fl=ga.uvr.array[ni*4+2]<0;ga.uvr.array[ni*4]=fl?s.u+s.du:s.u;ga.uvr.array[ni*4+1]=s.v;ga.uvr.array[ni*4+2]=fl?-s.du:s.du;ga.uvr.array[ni*4+3]=s.dv;}
  for(const k of['offset','uvr'])ga[k].needsUpdate=true;}
function rideTrack(o,x,z,dt){const d=o._rx==null?0:Math.hypot(x-o._rx,z-o._rz);o._rx=x;o._rz=z;o._ra=(o._ra||0)+d*.9;o._rm=d>dt*.8;if(Math.abs(x-o._rx2||0)>.02||1){const cxv=x-(o._rx3==null?x:o._rx3),czv=z-(o._rz3==null?z:o._rz3);if(Math.hypot(cxv,czv)>.04){o._rflip=(cxv*Math.cos(P.yaw)-czv*Math.sin(P.yaw))<0;o._rx3=x;o._rz3=z;}}return o;}
function rideRender(dt){if(!steedMesh)return;steedN=0;
  const comp=(e,KM,ni,sit)=>{if(!e.steed||!KM)return;const S=STEEDS[e.steed];if(!S)return;rideTrack(e,e.x,e.z,dt);const gy=groundAt(e.x,e.z,e.y+1);steedDraw(e.x,gy,e.z,e.steed,!!e._rflip,e._rm,e._ra);riderPatch(KM,ni,sit,S.saddle-.62);};
  if(kreakE&&DEM.includes(kreakE)&&kreakMesh)comp(kreakE,kreakMesh,0,'kd_k');
  for(const e of mercEnts)if(e&&DEM.includes(e)&&e.ownMesh)comp(e,e.ownMesh,e.ownI,'mc'+e.merc.i+'_k');
  // Geister der Mitspieler
  for(const R of REMOTE.values()){if(R.kg&&DEM.includes(R.kg)&&!R.kg.hidden)comp(R.kg,ghostKreakMesh,R.kg.ownI,'kd_k');for(const g of R.mg||[])if(g&&DEM.includes(g)&&!g.hidden)comp(g,ghostMercMesh,g.ownI,'mc'+g.mi+'_k');
    if(R.rd&&R.mesh){const g=R.mesh.geometry.attributes;if(g.offset.array[1]>-900){const S=STEEDS[R.rd];rideTrack(R,R.x,R.z,dt);steedDraw(R.x,R.y,R.z,R.rd,!!R._rflip,R._rm,R._ra);}}}
  steedMesh.geometry.instanceCount=steedN;const g=steedMesh.geometry.attributes;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;}
{const ud6=updateDemons;updateDemons=function(dt){for(const M of[ghostKreakMesh,ghostMercMesh])if(M){const o=M.geometry.attributes.offset;for(let k=0;k<o.count;k++)o.array[k*3+1]=-999;o.needsUpdate=true;}ud6(dt);try{rideCompanions(dt);rideRender(dt);mercClaimTick();}catch(e){if(!rideRender.err){rideRender.err=1;console.error('Reiten',e);}}};}
// ---------- Mehrspieler: Reiten mitschicken ----------
function steedOfMount(){if(!P.riding||!mount)return null;return mount.type==='donkey'?'esel':['braun','schimmel','rappe'][mount.v|0]||'braun';}
{const s1=mpSend;mpSend=function(m,to){if(m&&m.t==='pose'){const st=steedOfMount();if(st)m.rd=st;
    const ms=[];for(const e of mercEnts)if(e&&e.hired&&!e.dead&&DEM.includes(e)&&Math.hypot(e.x-P.x,e.z-P.z)<120){ms.push([e.merc.i,+e.x.toFixed(2),+e.y.toFixed(2),+e.z.toFixed(2),String(e.down?'k':e.frame),e.flip?1:0,e.steed||'']);}if(ms.length)m.m=ms;}
  return s1(m,to);};}
{const a=mpPose;mpPose=function(m){a(m);const R=REMOTE.get(m.pid);if(!R)return;R.rd=m.rd||null;
  if(R.kg){if(R.kg.ownMesh!==ghostKreakMesh&&ghostKreakMesh){R.kg.ownMesh=ghostKreakMesh;R.kg.ownI=mpGhostSlot(R.pid);}R.kg.steed=m.k&&m.k[5]||null;}
  // Söldner der Mitspieler als Geister
  R.mg=R.mg||[];const seen=new Set();for(const[i,x,y,z,f,fl,st]of m.m||[]){seen.add(i);let g=R.mg[i];const M=MERCS[i];if(!M||!ghostMercMesh)continue;
    if(!g||!DEM.includes(g)){DT['mg_'+M.id]=DT['mg_'+M.id]||Object.assign({},DT['merc_'+M.id],{fac:'ghost'});g=spawnEnt('mg_'+M.id,x,z,{ghost:1,always:true,noHostile:true,special:()=>true,ownMesh:ghostMercMesh,ownI:i,mi:i,name:M.name});R.mg[i]=g;}
    g.tx=x;g.ty=y;g.tz=z;g.frame=isNaN(+f)?f:+f;g.flip=!!fl;g.steed=st||null;g.seen=time;g.hidden=false;}
  for(let i=0;i<(R.mg||[]).length;i++){const g=R.mg[i];if(g&&!seen.has(i)){if(DEM.includes(g))removeEnt(g);R.mg[i]=null;}}};}
function mpGhostSlot(pid){const ids=[...REMOTE.keys()];return Math.max(0,ids.indexOf(pid))%6;}
{const a=mpFrame;mpFrame=function(dt){a(dt);for(const R of REMOTE.values()){for(const g of R.mg||[]){if(!g||g.tx==null)continue;const k=Math.min(1,dt*10);g.x+=(g.tx-g.x)*k;g.y+=(g.ty-g.y)*k;g.z+=(g.tz-g.z)*k;g.hidden=time-g.seen>4;}
    // Reitende Mitspieler: im Sattel sitzen
    if(R.rd&&R.mesh){const S=STEEDS[R.rd],g=R.mesh.geometry.attributes;if(S&&g.offset.array[1]>-900){const vx=R.x-camera.position.x,vz=R.z-camera.position.z,back=(-Math.sin(R.yaw)*vx-Math.cos(R.yaw)*vz)>0;
        g.offset.array[1]=R.y-.02;riderPatch(R.mesh,0,'rp_'+R.pid+'_'+(back?15:14),S.saddle-.62);
        nameTag('mp_'+R.pid,R.name+(R.pid===MP.host?' ★':''),R.x,R.y+S.saddle+(R.head||1.75)*.62+.25,R.z,Math.hypot(vx,vz)<60&&state==='playing');}}}};}
{const a=mpDropPlayer;mpDropPlayer=function(pid){const R=REMOTE.get(pid);if(R)for(const g of R.mg||[])if(g&&DEM.includes(g))removeEnt(g);return a(pid);};}
// Sitz-Bilder für die Figur der Mitspieler (Bild 14 vorne, 15 hinten)
{const a=mpRemoteSprite;mpRemoteSprite=function(R){a(R);try{const tex=R.mesh.material.uniforms.map.value,old=tex.image,N=old.width/64,cv=document.createElement('canvas');cv.width=64*(N+2);cv.height=60;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(old,0,0);
    for(const[b,i]of[[0,N],[1,N+1]]){const fr=document.createElement('canvas');fr.width=64;fr.height=60;fr.getContext('2d').drawImage(old,b*3*64,0,64,60,0,0,64,60);x.drawImage(squashCv(fr,1.12,.62),i*64,0);}
    const T=N+2;for(let i=0;i<T;i++)SPR['rp_'+R.pid+'_'+i]={u:i/T,v:0,du:1/T,dv:1,w:64,h:60};const t2=new THREE.CanvasTexture(cv);t2.magFilter=t2.minFilter=THREE.NearestFilter;t2.generateMipmaps=false;R.mesh.material.uniforms.map.value=t2;tex.dispose();}catch(e){console.error('Sitzbild',e);}};}
// Beim Reiten liegt die gemeldete Höhe auf dem Sattel: Figur entsprechend anheben
// (Die Höhe aus der Pose ist die Augenhöhe-Basis des Reiters, also schon richtig.)
// ---------- Söldner gehören nur einem Spieler ----------
const mpOn=()=>typeof MP!=='undefined'&&MP.on;
function mercClaim(m){const C=FLAGS.mercClaims||{},c=C[m.name];if(!c)return null;if(c.until<=gameMinutes()){delete C[m.name];return null;}return c;}
function mercTakenByOther(m){if(!mpOn())return null;const c=mercClaim(m);return c&&c.pid!==MP.pid?c:null;}
{const h0=mercHire;mercHire=function(m,days,price){const c=mercTakenByOther(m);if(c){toast(`${m.name} ist schon mit ${MP.names[c.pid]||'einem anderen Spieler'} unterwegs.`);return false;}
  const ok=h0(m,days,price);if(ok!==false&&GF().hired[m.name]){FLAGS.mercClaims=FLAGS.mercClaims||{};FLAGS.mercClaims[m.name]={pid:mpOn()?MP.pid:'solo',until:GF().hired[m.name].until};}return ok;};}
{const r0=mercRelease;mercRelease=function(m,why){r0(m,why);if(FLAGS.mercClaims){const c=FLAGS.mercClaims[m.name];if(c&&(!mpOn()||c.pid===MP.pid||c.pid==='solo'))delete FLAGS.mercClaims[m.name];}};}
for(const M of MERCS){const D=DIALOGS[M.name];if(!D)continue;const h=D.nodes.hello;D.nodes.hello=()=>{const c=mercTakenByOther(M);if(c&&!GF().hired[M.name]){const who=MP.names[c.pid]||'einem anderen Abenteurer';
    return{text:`Ich bin gerade mit ${who} unterwegs. Noch ${fmtLeft(c.until-gameMinutes())}. Danach können wir reden.`,opts:[{label:'Schade.',go:null}]};}return h();};}
// Vergebene Söldner stehen nicht im Gildensaal herum, sie sind ja beim anderen Spieler
function mercClaimTick(){if(!mpOn())return;for(const e of mercEnts){if(!e)continue;const c=mercTakenByOther(e.merc);if(c&&!e.hired){e.hidden=true;e._mpHid=1;e.x=-9999;e.z=-9999;}else if(e._mpHid&&!c){e.hidden=false;e._mpHid=0;const[hx,hz]=mercHomeSpot(e.merc);e.x=hx;e.z=hz;}}}
