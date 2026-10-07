/* =========================================================
   V69 · Blue Lunar: In Wald, Sumpf und Nadelwald (auch auf der Hauptkarte)
   tauchen Pilzmenschen auf (blauer Hut mit weißen Flecken, weißer Stiel) und
   blau glimmende Riesen-Nacktschnecken. Ganz selten reitet ein Pilz auf einer
   Schnecke. Wer ihn besiegt, öffnet mit 50 % Chance einen Blue Rift, der
   20 Spieltage bleibt und zur Blue-Lunar-Galaxie führt (noch verschlossen).
   ========================================================= */
function bR(p,x0,x1,y0,y1,c){for(let y=Math.round(y0);y<=Math.round(y1);y++)for(let x=Math.round(x0);x<=Math.round(x1);x++){const v=typeof c==='function'?c(x,y):c;if(v)p.set(x,y,v);}}
const BL_CAP=pal(['#0e2a6a','#163c94','#2256c0','#3a78e0','#6aa8ff']),BL_ST=pal(['#a8a8b8','#cfd0dc','#ececf4','#ffffff']),BL_SL=pal(['#0a2a5a','#123e80','#1a5cb0','#2c84e0','#58b4ff','#a8e4ff']);
function drawShroom(f,small){const W=26,H=36,p=new Px(W,H),cx=13,st=f===1?1:f===2?-1:0,hop=f==='a'?2:0;
  // Beinchen
  for(const s of[-1,1]){const lift=(s<0&&st>0)||(s>0&&st<0)?1:0;bR(p,cx+s*3-1,cx+s*3+1,30-lift-hop,34-lift-hop,(x,y)=>BL_ST[y===34-lift-hop?0:1]);}
  // Stiel als Körper
  for(let y=15-hop;y<=31-hop;y++){const t=(y-15+hop)/16,hw=4.2+Math.sin(t*Math.PI)*1.4;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,cPick(BL_ST,.85-(x-cx+hw)/(hw*2)*.55));}
  // Ärmchen
  for(const s of[-1,1]){const ay=f==='a'?17-hop:21+(s*st>0?1:0)-hop;bLine(p,cx+s*5,20-hop,cx+s*8.5,ay,BL_ST[1]);p.set(cx+s*9,ay,BL_ST[2]);}
  // Gesicht
  for(const s of[-1,1]){p.set(cx+s*2,19-hop,hex('#141420'));p.set(cx+s*2,20-hop,hex('#141420'));p.set(cx+s*2-(s>0?0:0),18-hop,hex('#ffffff'));}
  bR(p,cx-1,cx+1,23-hop,23-hop,hex('#6a4a6a'));p.set(cx-2,22-hop,hex('#6a4a6a'));p.set(cx+2,22-hop,hex('#6a4a6a'));
  for(const s of[-1,1])p.set(cx+s*3.5,21.5-hop,hex('#8ab0ff'));
  // Hut
  for(let y=2-hop;y<=16-hop;y++){const t=(y-2+hop)/14,hw=t<.85?12*Math.sqrt(Math.max(0,1-(1-t/.85)**2)):12-(t-.85)*10;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){const L=.75-(x-cx)/24-t*.35+(hash2(x,y,9101)-.5)*.08;p.set(x,y,cPick(BL_CAP,y>=15-hop?.15:L));}}
  for(const[sx,sy,r]of[[cx-6,7,2.2],[cx+2,4,1.8],[cx+7,9,2.4],[cx-1,10,1.5],[cx-9,11,1.3],[cx+4,12,1.2]])cDisc(p,sx,sy-hop,r,(x,y,d)=>d<r-.8?BL_ST[3]:BL_ST[2]);
  outline(p);const c=p.done();if(small)return c;return c;}
function drawSlug(f,rider){const W=64,H=rider?62:32,p=new Px(W,H),y0=H-1,str=f===1?3:0;
  // Körper (Seitenansicht, Kopf rechts)
  for(let x=4;x<58+str;x++){const t=(x-4)/(54+str),top=y0-3-Math.sin(Math.pow(t,.8)*Math.PI)*17*(1-t*.3)-(t>.78?(t-.78)*14:0);for(let y=Math.round(top);y<=y0-1;y++){
      const k=(y-top)/(y0-top),L=.78-k*.45+(x%9===0&&k<.6?.1:0)+(hash2(x,y,9102)-.5)*.07;p.set(x,y,cPick(BL_SL,L));}
    p.set(x,y0,BL_SL[0]);}
  for(const[sx,sy,r]of[[14,y0-8,1.6],[24,y0-14,2.2],[34,y0-13,1.8],[44,y0-9,1.4],[20,y0-5,1.2],[30,y0-7,1.5],[39,y0-4,1.2]])cDisc(p,sx,sy,r,()=>BL_SL[5]);
  // Fühler mit leuchtenden Kugeln
  const hx=56+str,hy=y0-11;bLine(p,hx-3,hy,hx+2,hy-9,BL_SL[3]);bLine(p,hx,hy+1,hx+6,hy-6,BL_SL[3]);cDisc(p,hx+2,hy-10,1.6,()=>BL_SL[5]);cDisc(p,hx+6,hy-7,1.4,()=>BL_SL[5]);
  if(rider){// Ein kleiner seltener Pilz mit goldenem Rand am Hut sitzt obendrauf
    const m=drawShroom(0,true),ctx=p.c.getContext('2d');p.ctx.putImageData(p.img,0,0);ctx.drawImage(m,21,y0-17-m.height+3);const id=ctx.getImageData(0,0,W,H);p.d.set(id.data);
    for(let x=23;x<=44;x++){const y=y0-17-m.height+3+15;if(p.d[(y*W+x)*4+3])p.set(x,y,hex('#ffd860'));}}
  outline(p);return p.done();}
function drawRift(f){const W=60,H=84,p=new Px(W,H),cx=30,cy=44;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const dx=(x-cx)/24,dy=(y-cy)/38,d=Math.hypot(dx,dy);if(d>1)continue;const a=Math.atan2(dy,dx),sw=Math.sin(a*3+d*9-f*1.6)*.5+.5,
    L=d>.86?.95:(1-d)*.6+sw*.35+(hash2(x,y,9200+f)<.02?.5:0);p.set(x,y,d>.92?hex('#d8f0ff'):cPick(pal(['#060a2a','#101c5a','#1a3a9a','#2a64d8','#5aa0ff','#b8e4ff','#ffffff']),L));}
  for(let k=0;k<14;k++){const a=hash2(k,f,9201)*6.283,r=.2+hash2(k,f,9202)*.6;p.set(cx+Math.cos(a)*24*r,cy+Math.sin(a)*38*r,hex('#ffffff'));}return p.done();}
// ---------- Atlas ----------
let blueMesh=null,blueProp=null;const BLUE_N=24,blueFree=[];
function initBlueAtlas(){const L=[];for(const f of[0,1,2,'a'])L.push(['bm_'+f,drawShroom(f)]);for(const f of[0,1])L.push(['bs_'+f,drawSlug(f)]);for(const f of[0,1])L.push(['br_'+f,drawSlug(f,true)]);for(let f=0;f<4;f++)L.push(['rift'+f,drawRift(f)]);
  const AW=512;let x=2,y=2,rowH=0;const pos=[];L.sort((a,b)=>b[1].height-a[1].height);for(const[n,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([n,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  let AH=64;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');for(const[n,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[n]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;const m=bbMaterial(tex,0,0);EXTRA_BB.push(m);
  const ph=n=>{const a=[];for(let k=0;k<n;k++)a.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'bm_0',tint:1});return a;};
  blueMesh=makeBillboards(ph(BLUE_N),m);blueMesh.frustumCulled=false;blueMesh.geometry.instanceCount=BLUE_N;scene.add(blueMesh);
  const m2=bbMaterial(tex,0,0);m2.uniforms.plOn.value=0;EXTRA_BB.push(m2);blueProp=makeBillboards(ph(8),m2);blueProp.frustumCulled=false;blueProp.geometry.instanceCount=0;scene.add(blueProp);
  for(let k=BLUE_N-1;k>=0;k--)blueFree.push(k);}
{const i5=initDemons;initDemons=function(a){i5(a);try{initBlueAtlas();}catch(e){console.error('Blue-Lunar-Bilder',e);}};}
// ---------- Wesen ----------
Object.assign(DT,{
  bshroom:{name:'Pilzmensch',fac:'neutral',h:1.05,hp:30,dmg:4,spd:2.6,reach:1.1,cd:1.2,spr:'bm_',xp:8,rad:.3,tint:1.25,loot:[['bluecap',1,1],['bluecap',1,.5]]},
  bslug:{name:'Riesen-Nacktschnecke',fac:'neutral',h:1.3,hp:90,dmg:6,spd:.9,reach:1.4,cd:1.6,spr:'bs_',side:1,xp:14,rad:.8,tint:1.45,glow:1,loot:[['glowslime',2,1],['glowslime',2,.5]]},
  brider:{name:'Seltener Schneckenreiter',fac:'neutral',h:2.5,hp:140,dmg:7,spd:1.1,reach:1.5,cd:1.6,spr:'br_',side:1,xp:60,rad:.85,tint:1.45,glow:1,loot:[['bluecap',3,1],['glowslime',3,1],['starshard',1,.6]]}});
Object.assign(ITEMS,{bluecap:{name:'Blauhut-Pilz',plural:'Blauhut-Pilze'},glowslime:{name:'Leuchtschleim',plural:'Leuchtschleim'},starshard:{name:'Sternensplitter',plural:'Sternensplitter'}});
Object.assign(ITEM_DESC,{bluecap:'Wächst nur unter dem blauen Mond. Leuchtet ein bisschen',glowslime:'Kühl, klebrig und glimmt blau',starshard:'Ein Splitter aus einer anderen Welt'});
FOOD.bluecap=[6,14,'Schmeckt nach Mondlicht.'];
try{STALL.Wilma.sell.push(['bluecap',14],['glowslime',9]);STALL.Gustl&&STALL.Gustl.sell&&STALL.Gustl.sell.push(['starshard',60]);}catch(e){}
{const cs4=craftSprites;craftSprites=function(list){cs4(list);
  {const p=new Px(12,12);for(let y=1;y<6;y++)for(let x=1;x<11;x++){if(Math.hypot((x-5.5)/5,(y-5)/4.2)>1)continue;p.set(x,y,BL_CAP[3-(x>6?1:0)]);}p.set(3,3,BL_ST[3]);p.set(7,2,BL_ST[3]);p.set(8,4,BL_ST[3]);bR(p,4,7,6,11,(x)=>BL_ST[x<6?2:1]);outline(p);list.push(['bluecap',p.done()]);}
  {const p=new Px(12,10);for(let y=2;y<10;y++)for(let x=1;x<11;x++){if(Math.hypot((x-5.5)/5,(y-6.5)/3.5)>1)continue;p.set(x,y,BL_SL[hash2(x,y,9103)<.15?5:3+(y<5?1:0)]);}outline(p);list.push(['glowslime',p.done()]);}
  {const p=new Px(11,13),C=pal(['#3a64d8','#7ab0ff','#d0ecff','#ffffff']);for(const[x0,y0,x1,y1]of[[5,0,5,12],[0,6,10,6],[2,2,8,10],[8,2,2,10]])bLine(p,x0,y0,x1,y1,C[1]);bR(p,4,6,4,8,C[2]);p.set(5,6,C[3]);outline(p);list.push(['starshard',p.done()]);}};}
const BLUE=[];
function blueSpawn(type,x,z,o){if(!blueMesh||!blueFree.length)return null;const e=spawnEnt(type,x,z,Object.assign({ownMesh:blueMesh,ownI:blueFree.pop(),blue:1,noHostile:true,special:blueStep,onHurt:blueHurt,onDeath:blueDeath},o||{}));BLUE.push(e);return e;}
{const re1=removeEnt;removeEnt=function(e){re1(e);if(e.blue){const i=BLUE.indexOf(e);if(i>=0)BLUE.splice(i,1);if(e.ownMesh===blueMesh&&e.ownI!=null){blueFree.push(e.ownI);e.ownI=null;}}};}
// Passiv wie die Lebkuchen: man kann sie trotzdem treffen. Wer zuschlägt, wird angegriffen.
{const et1=entTargets;entTargets=function(range,cone){const out=et1(range,cone),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),ey=P.y+P.eye*.6;
  for(const e of BLUE){if(e.dead||e.fac==='demon')continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d>range+(e.d.rad||.3)+e.w*.25)continue;if(d>.3&&(dx*fx+dz*fz)/d<cone)continue;if(Math.abs(e.y+e.h*.5-ey)>e.h+1.4)continue;e.kind='demon';out.push(e);}return out;};}
function blueHurt(e,n,by){if((by==='player'||by==='kreak'||by==='ally')&&e.fac!=='demon'){e.fac='demon';e.mad=20;for(let k=0;k<10;k++)spawnParticle(e.x+(Math.random()-.5),e.y+Math.random()*e.h,e.z+(Math.random()-.5),0,1.2,0,0x6aa8ff,.6,.18);}}
function blueDeath(e){for(let k=0;k<26;k++)spawnParticle(e.x+(Math.random()-.5)*e.w,e.y+Math.random()*e.h,e.z+(Math.random()-.5)*e.w,(Math.random()-.5)*2,Math.random()*2.5,(Math.random()-.5)*2,Math.random()<.5?0x6aa8ff:0xd8f0ff,1.2,.22);
  if(e.type==='brider'){if(Math.random()<.5)riftOpen(e.x,e.z);else say({x:e.x,y:e.y,z:e.z,h:1.2},'Für einen Moment flackert die Luft blau … dann ist es vorbei.',3.5);}}
function blueStep(e,dt){const d=e.d;if(e.mad>0)e.mad-=dt;
  if(e.fac==='demon'){if(!(e.mad>0)&&Math.hypot(P.x-e.x,P.z-e.z)>14){e.fac='neutral';return true;}const t='player',dist=Math.hypot(P.x-e.x,P.z-e.z),reach=d.reach+.2;
    if(e.wind>0){e.wind-=dt;e.frame=e.type==='bshroom'?'a':0;if(e.wind<=0&&dist<reach+.7)meleeHit(e,t,d.dmg);return true;}if(dist>reach)entMove(e,P.x,P.z,d.spd*1.2,dt);else if(e.atk<=0){e.atk=d.cd;e.wind=.35;}else e.frame=0;return true;}
  // friedlich herumschlendern
  e.wt=(e.wt||0)-dt;if(e.wt<=0){e.wt=3+Math.random()*5;const a=Math.random()*6.283,r=Math.random()*(e.type==='bshroom'?9:6);e.wx=e.home.x+Math.cos(a)*r;e.wz=e.home.z+Math.sin(a)*r;e.idle=Math.random()<.35;}
  if(e.idle||entMove(e,e.wx,e.wz,d.spd*.5,dt)<.0005)e.frame=0;else if(e.type!=='bshroom')e.frame=Math.floor(e.anim*.6)%2;
  if(e.type==='bshroom'&&Math.random()<dt*.06&&Math.hypot(P.x-e.x,P.z-e.z)<10)say(e,['Pff … pff …','Der Mond ist so schön blau.','Hast du die Schnecken gesehen?','Wir wachsen nur heute Nacht!'][(Math.random()*4)|0],2.2);
  if(e.d.glow&&Math.random()<dt*3)spawnParticle(e.x+(Math.random()-.5)*e.w*.8,e.y+Math.random()*e.h*.6,e.z+(Math.random()-.5)*e.w*.8,0,.4,0,0x8ac8ff,.9,.12);
  return true;}
// ---------- Spawnen in der Blue-Lunar-Nacht ----------
const BLUE_AREAS=new Set(['forest','deep','frogs','wl_wald','wl_nadelwald','wl_sumpf']);
let blueT=6;
function blueTick(dt){const night=typeof peaceNight==='function'&&peaceNight();
  for(const e of BLUE.slice()){const far=Math.hypot(e.x-P.x,e.z-P.z)>120||P.x>60000;if(e.dead)continue;if(far||!night){if(!far)blueDeath({type:'x',x:e.x,y:e.y,z:e.z,w:e.w,h:e.h});removeEnt(e);}}
  if(!night||state!=='playing'||P.x>60000)return;blueT-=dt;if(blueT>0)return;blueT=14+Math.random()*16;
  if(!BLUE_AREAS.has(areaAt(P.x,P.z)))return;if(BLUE.filter(e=>!e.dead).length>=8)return;
  for(let t=0;t<12;t++){const a=Math.random()*6.283,d=22+Math.random()*30,x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d;if(!inWorld(x,z)||!BLUE_AREAS.has(areaAt(x,z)))continue;const g=groundAt(x,z,1e4);if(!(g>WATER+.3))continue;
    if(typeof nearWater==='function'&&inCore(x,z)&&nearWater(x,z))continue;const r=Math.random();
    if(r<.09)blueSpawn('brider',x,z);else if(r<.42)blueSpawn('bslug',x,z);else{const n=1+(Math.random()*3|0);for(let i=0;i<n;i++)blueSpawn('bshroom',x+(Math.random()-.5)*4,z+(Math.random()-.5)*4);}
    for(let k=0;k<16;k++)spawnParticle(x+(Math.random()-.5)*2,g+.2,z+(Math.random()-.5)*2,0,1+Math.random(),0,0x6aa8ff,1,.18);break;}}
// ---------- Blue Rift ----------
function riftOpen(x,z){FLAGS.rifts=FLAGS.rifts||[];FLAGS.rifts.push({x:+x.toFixed(2),z:+z.toFixed(2),until:gameMinutes()+20*1440});Snd.shimmer();
  for(let k=0;k<60;k++)spawnParticle(x+(Math.random()-.5)*3,getHeight(x,z)+Math.random()*4,z+(Math.random()-.5)*3,(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,Math.random()<.5?0x6aa8ff:0xffffff,1.6,.25);
  say({x,y:getHeight(x,z)+2.5,z,h:1},'Ein Blue Rift reißt auf!',3.5);saveGame();}
function riftList(){const now=gameMinutes();if(FLAGS.rifts)FLAGS.rifts=FLAGS.rifts.filter(r=>r.until>now);return FLAGS.rifts||[];}
function riftLooked(){for(const r of riftList()){const y=groundAt(r.x,r.z,1e4);if(Math.hypot(r.x-P.x,r.z-P.z)<4&&lookingAt(r.x,y+1.8,r.z,5,.7))return r;}return null;}
{const su1=storyUse;storyUse=function(){if(P.x<60000){const r=riftLooked();if(r){const y=groundAt(r.x,r.z,1e4),left=Math.ceil((r.until-gameMinutes())/1440);Snd.shimmer();
      say({x:r.x,y:y+2.6,z:r.z,h:1},`Hinter dem Riss funkeln fremde Sterne. Die Blue-Lunar-Galaxie … noch lässt sie dich nicht hinein. (Noch ${left} Tage offen)`,4.5);return true;}}return su1();};}
function blueFrame(dt){if(!blueProp)return;const g=blueProp.geometry.attributes;let n=0;
  if(P.x<60000)for(const r of riftList()){if(n>=8)break;if(Math.hypot(r.x-camera.position.x,r.z-camera.position.z)>300)continue;const y=r.y!=null?r.y:(r.y=groundAt(r.x,r.z,1e4)),s=SPR['rift'+(Math.floor(time*6)%4)],w=2.6,h=w*s.h/s.w;
    g.offset.array[n*3]=r.x;g.offset.array[n*3+1]=y+.15+Math.sin(time*1.3)*.08;g.offset.array[n*3+2]=r.z;g.size.array[n*2]=w;g.size.array[n*2+1]=h;g.uvr.array[n*4]=s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=1.9;g.rot.array[n]=0;n++;
    if(Math.random()<dt*14&&Math.hypot(r.x-P.x,r.z-P.z)<80)spawnParticle(r.x+(Math.random()-.5)*2.4,y+.4+Math.random()*3,r.z+(Math.random()-.5)*2.4,(Math.random()-.5)*.6,.6+Math.random(),(Math.random()-.5)*.6,Math.random()<.5?0x6aa8ff:0xd8f0ff,1.4,.16);}
  blueProp.geometry.instanceCount=n;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;}
{const ud4=updateDemons;updateDemons=function(dt){if(blueMesh){const o=blueMesh.geometry.attributes.offset;for(let k=0;k<BLUE_N;k++)o.array[k*3+1]=-999;o.needsUpdate=true;}ud4(dt);
  try{blueTick(dt);blueFrame(dt);}catch(e){if(!blueFrame.err){blueFrame.err=1;console.error('Blue Lunar',e);}}};}
