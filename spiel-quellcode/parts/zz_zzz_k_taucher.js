/* =========================================================
   0.0.116 · Der alte Taucheranzug
   - Die Taucherausrüstung ist jetzt ein schwerer Taucheranzug wie früher: runder Helm mit Bullaugen,
     Anzug und Bleischuhe. In KREAKS aus Kupfer geschmiedet, glänzt aber wie Messing.
   - Ein Luftschlauch führt zur Oberfläche (mit Schwimmer). Solange der Schlauch reicht (80 m), hat man unbegrenzt Luft.
   - Wer ihn trägt, sinkt schnell und läuft schwer über den Meeresgrund.
   - Neu: Kupfererz in Höhlen, Kupferbarren im Ofen.
   - Unter Wasser sind Schläge langsamer und schwächer.
   ========================================================= */
const HOSE_LEN=80;
// ---------- Kupfer ----------
ITEMS.copper_ingot={name:'Kupferbarren',plural:'Kupferbarren'};
try{SMELT.copper_ore={out:'copper_ingot',n:1,f:1};}catch(e){}
RECIPES.push({id:'copper_ingot',need:{copper_ore:1,coal:1},st:'furnace'});
try{SHOPS.Dofra.sell.push(['copper_ingot',8],['copper_ore',3]);}catch(e){}
// ---------- Der Anzug (ersetzt den alten Taucherhelm, gleiche ID) ----------
Object.assign(ITEMS.divehelm,{name:'Taucheranzug',plural:'Taucheranzüge',slot:'armor',def:.1,look:'chain'});
ITEM_DESC.divehelm='Schwerer Taucheranzug aus Kupfer mit Helm und Luftschlauch. Unter Wasser hast du unbegrenzt Luft, solange der Schlauch bis zur Oberfläche reicht (80 m). Man sinkt schnell und läuft schwer.';
ITEM_DESC.copper_ingot='Aus Kupfererz im Ofen geschmolzen. Für den Taucheranzug.';
{const r=RECIPES.find(q=>q.id==='divehelm');if(r)r.need={copper_ingot:10,rope:2};else RECIPES.push({id:'divehelm',need:{copper_ingot:10,rope:2},bench:1});}
{const a=craftSprites;craftSprites=function(list){a(list);try{
  const M=pal(['#5a2a10','#9a4e22','#d07a3a','#f0a868']),p=new Px(16,10);for(let y=2;y<9;y++){const ins=y<4?(4-y):0;for(let x=1+ins;x<15-ins;x++)p.set(x,y,M[y<4?3:shadeIdx(.6-(x-8)/20-(y-5)/10,4,x,y)]);}outline(p);list.push(['copper_ingot',p.done()]);
  // Symbol: runder Messinghelm mit Bullauge
  const q=new Px(16,16),B=pal(['#3a2408','#7a5418','#b8862c','#e8c060','#fff0b0']),G=pal(['#0e1e24','#1e3a44','#4a7a88']);
  mrEll(q,8,7,6.2,6,(x,y,dx,dy)=>B[shadeIdx(.62-dx*.32-dy*.3,5,x,y)]);mrEll(q,8,7.5,3.1,3,(x,y,dx,dy)=>G[dx<-.3&&dy<-.3?2:dy<.2?1:0]);
  for(const[x,y]of[[8,3],[5,7],[11,7],[8,11]])q.set(x,y,B[4]);for(let x=3;x<=13;x++){q.set(x,13,B[1]);q.set(x,14,B[2]);}for(const x of[4,8,12])q.set(x,14,B[4]);outline(q);list.push(['divehelm',q.done()]);
}catch(e){console.error('Taucher: Bilder',e);}};}
// ---------- Aussehen: Messinganzug über dem Spieler ----------
function diverPaint(cv,back){if(!cv.headBox)return cv;const W=cv.width,H=cv.height,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d');x.drawImage(cv,0,0);
  const im=x.getImageData(0,0,W,H),d=im.data,[h0,h1,t,b]=cv.headBox,waist=cv.waist||40,cx=(h0+h1)/2;
  const set=(X,Y,c)=>{if(X<0||Y<0||X>=W||Y>=H)return;const i=(Y*W+X)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255;},al=(X,Y)=>d[(Y*W+X)*4+3],lum=(X,Y)=>{const i=(Y*W+X)*4;return(d[i]+d[i+1]+d[i+2])/3;};
  const BR=pal(['#2a1a06','#5e4012','#946a22','#c89a3a','#ecc868']),CU=pal(['#3a1a0a','#6a3418','#9a5428']),LD=pal(['#1a1a1e','#2e2e34','#46464e']),GL=pal(['#081418','#173038','#3a6a78','#a8e0f0']);
  // Anzug
  for(let Y=b+1;Y<H;Y++)for(let X=0;X<W;X++){if(!al(X,Y))continue;const l=lum(X,Y)/255,boot=Y>=H-4,belt=Y===waist||Y===waist+1;
    if(boot)set(X,Y,LD[l>.45?2:l>.25?1:0]);else if(belt)set(X,Y,CU[l>.4?2:1]);else if(l<.1)set(X,Y,BR[0]);else{const nx=(X-cx)/9;set(X,Y,BR[Math.min(4,Math.max(1,shadeIdx(.62-nx*.35,5,X,Y)))]);}}
  // Kragen mit Bolzen
  for(let X=Math.round(cx-8);X<=Math.round(cx+8);X++){if(al(X,b+2)||al(X,b+1)){set(X,b+1,BR[2]);set(X,b+2,BR[1]);if((X-Math.round(cx))%4===0)set(X,b+1,BR[4]);}}
  // Helm: großer runder Kopf
  const R=Math.max((h1-h0)/2+3,(b-t)/2+2.5),cy=(t+b)/2+.5;
  for(let Y=Math.floor(cy-R-1);Y<=Math.ceil(cy+R+1);Y++)for(let X=Math.floor(cx-R-1);X<=Math.ceil(cx+R+1);X++){const dx=(X-cx)/R,dy=(Y-cy)/R,r2=dx*dx+dy*dy;if(r2>1.08)continue;
    if(r2>.9){set(X,Y,BR[0]);continue;}set(X,Y,BR[shadeIdx(.64-dx*.34-dy*.3,5,X,Y)]);}
  if(!back){const pr=R*.52,py=cy+.5;for(let Y=Math.floor(py-pr-1);Y<=Math.ceil(py+pr+1);Y++)for(let X=Math.floor(cx-pr-1);X<=Math.ceil(cx+pr+1);X++){const r=Math.hypot(X-cx,Y-py)/pr;if(r>1.25)continue;
      if(r>1)set(X,Y,BR[4]);else set(X,Y,GL[(X-cx<-pr*.25&&Y-py<-pr*.25)?3:r<.6?2:1]);}
    for(const s of[-1,1]){const sx=Math.round(cx+s*R*.82),sy=Math.round(cy-1);set(sx,sy,GL[2]);set(sx,sy+1,GL[1]);set(sx-s,sy,BR[4]);}
    set(Math.round(cx),Math.round(cy-R+1),BR[4]);}
  else{for(let Y=Math.round(cy-2);Y<=Math.round(cy+2);Y++)for(let X=Math.round(cx-1);X<=Math.round(cx+1);X++)set(X,Y,CU[1]);set(Math.round(cx),Math.round(cy-3),CU[2]);}
  x.putImageData(im,0,0);o.headBox=cv.headBox;o.waist=cv.waist;o.legTop=cv.legTop;o.handL=cv.handL;o.handR=cv.handR;return o;}
{const a=drawHero;drawHero=function(c,frame,back,pose,side){const cv=a.apply(this,arguments);if(!c||!c.gear||c.gear.a!=='divehelm')return cv;try{return diverPaint(cv,back);}catch(e){return cv;}};}
// Alter Taucherhelm im Helm-Platz: in den Anzug-Platz umziehen
function diveMigrate(){if(equip.helm&&equip.helm.id==='divehelm'){const s=equip.helm;equip.helm=null;if(!equip.armor)equip.armor=s;else if(!addItem('divehelm',1))spawnDrop('divehelm',1,P.x,P.y+1,P.z);try{renderInv();}catch(e){}}}
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);try{diveMigrate();}catch(e){}return r;};}
// ---------- Luft über den Schlauch ----------
const swHoseOk=()=>swSuit()&&WATER-(P.y+P.eye)<HOSE_LEN&&P.x<60000;
{const a=swAir;swAir=function(dt){const air0=SW.air;a(dt);if(SW.head&&SW.air<air0&&swHoseOk())SW.air=air0;};}
// ---------- Der Schlauch zur Oberfläche ----------
const HOSE={mesh:null,buoy:null,t:0,bx:0,bz:0};
function hoseTick(dt){const on=SW.on&&swSuit()&&P.y+P.eye<WATER-.2&&state!=='dead'&&P.x<60000;
  if(!on){if(HOSE.mesh)HOSE.mesh.visible=false;if(HOSE.buoy)HOSE.buoy.visible=false;HOSE.bx=P.x;HOSE.bz=P.z;return;}
  if(!HOSE.buoy){HOSE.buoy=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.3,10),new THREE.MeshLambertMaterial({color:0xd8602a}));scene.add(HOSE.buoy);}
  const k=1-Math.exp(-.6*dt);HOSE.bx+=(P.x-HOSE.bx)*k;HOSE.bz+=(P.z-HOSE.bz)*k;let dx=HOSE.bx-P.x,dz=HOSE.bz-P.z;const dh=Math.hypot(dx,dz),depth=WATER-P.y,maxH=Math.max(.5,Math.sqrt(Math.max(0,HOSE_LEN*HOSE_LEN-depth*depth))*.5);
  if(dh>maxH){HOSE.bx=P.x+dx/dh*maxH;HOSE.bz=P.z+dz/dh*maxH;}
  HOSE.buoy.visible=true;HOSE.buoy.position.set(HOSE.bx,WATER+.05+Math.sin(time*1.7)*.05,HOSE.bz);
  HOSE.t-=dt;if(HOSE.t>0&&HOSE.mesh){HOSE.mesh.visible=true;return;}HOSE.t=.08;
  const yaw=P.yaw,hx=P.x+Math.sin(yaw)*.25,hz=P.z+Math.cos(yaw)*.25,hy=P.y+(SW.swim?.5:P.eye*.95),sag=Math.min(6,depth*.15),pts=[];
  for(let i=0;i<=14;i++){const u=i/14,x=hx+(HOSE.bx-hx)*u,z=hz+(HOSE.bz-hz)*u,y=hy+(WATER-hy)*Math.pow(u,.8)+Math.sin(u*Math.PI)*(sag*.3)+Math.sin(time*1.3+u*6)*.12*u;pts.push(new THREE.Vector3(x+Math.sin(time*.9+u*5)*.15*u,y,z));}
  const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),28,.07,5,false);
  if(!HOSE.mesh){HOSE.mesh=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x2a2420}));HOSE.mesh.frustumCulled=false;scene.add(HOSE.mesh);}else{HOSE.mesh.geometry.dispose();HOSE.mesh.geometry=geo;}HOSE.mesh.visible=true;}
// ---------- Ego-Ansicht: Blick durchs Bullauge ----------
let DVO=null;function diveOverlay(){const on=state==='playing'&&!(P.view||0)&&swSuit()&&SW.head;
  if(!DVO){DVO=document.createElement('div');DVO.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4;display:none;background:radial-gradient(circle at 50% 48%,rgba(0,0,0,0) 0,rgba(0,0,0,0) 38vmin,#c89a3a 38.4vmin,#ecc868 39.6vmin,#946a22 41vmin,#3a2408 43vmin,#120a02 44vmin)';document.body.appendChild(DVO);}
  const v=on?'block':'none';if(DVO.style.display!==v)DVO.style.display=v;}
// ---------- Kampf unter Wasser: langsamer und schwächer ----------
{const a=weaponMult;weaponMult=function(t){return a(t)*swHitK();};}
{const a=attack;attack=function(){const r0=P.atkReady||0;a();if(SW.head&&(P.atkReady||0)>r0&&P.atkReady>time)P.atkReady=time+(P.atkReady-time)*1.75;};}
// ---------- Takt ----------
{const a=updatePlayer;updatePlayer=function(dt){a(dt);try{hoseTick(dt);diveOverlay();}catch(e){if(!hoseTick.err){hoseTick.err=1;console.error('Taucher',e);}}};}
{const a=startGame;startGame=function(isNew,char){if(HOSE.mesh)HOSE.mesh.visible=false;if(HOSE.buoy)HOSE.buoy.visible=false;return a(isNew,char);};}
