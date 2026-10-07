/* =========================================================
   V60 · Die Nacht: Skelette und Riesenratten kriechen aus den Höhlen und streifen
   durch die Welt. Beim Blutmond kommen Dämonen dazu. Bei Blue Lunar ist alles
   friedlich. Und die Nächte sind etwas heller, man sieht noch die Umrisse.
   ========================================================= */
function tonightEv(){const clk=FLAGS.clock==null?600:FLAGS.clock,n=clk<720?(FLAGS.day||0)-1:(FLAGS.day||0);return moonFor(n).ev;}
function isDark(){const c=FLAGS.clock==null?600:FLAGS.clock;return c>=1245||c<318;}
function peaceNight(){return isDark()&&tonightEv()==='blue';}
// ---------- Hellere Nächte ----------
Object.assign(NIGHT_EV.none,{top:'#0a1426',hor:'#1a2a3e',hemi:'#8ea4d6'});
{const ud0=updateDayNight;updateDayNight=function(dt,nf){ud0(dt,nf);const lit=DN.ev?1:MOON_LIT[DN.phase]||0;
  if(!DN.ev){DN.nightLight=.36+.16*lit;DN.moonLight=.1+.14*lit;}else if(DN.ev==='blood'){DN.nightLight=.46;DN.moonLight=.36;}else{DN.nightLight=.58;DN.moonLight=.5;}};}
// ---------- Kreaturen der Nacht ----------
Object.assign(DT,{nskel:{name:'Skelett',fac:'demon',h:1.9,hp:60,dmg:9,spd:2.5,reach:1.35,cd:1.3,wind:.35,spr:'skel_',xp:15,loot:[['bones',2,.8],['copper',6,.5],['silver',1,.12]],aggro:22,rad:.35},
  nrat:{name:'Riesenratte',fac:'demon',h:.85,hp:25,dmg:5,spd:4.3,reach:1.1,cd:.9,wind:.25,side:1,spr:'rat_',xp:6,loot:[['meat',1,.3]],aggro:18,rad:.3}});
for(const k of['imp','hound','warrior'])if(DT[k]&&!DT[k].loot)DT[k].loot=[['coal',1,.4],['copper',8,.5],['silver',2,.2]];
const NIGHTMOB=[];let nmT=4;
function nightSafe(x,z){if(Math.hypot(x-CODA.x,z-CODA.z)<80)return true;if(Math.hypot(x-FROG.x,z-FROG.z)<FROG.r+40)return true;if(Math.hypot(x-JVIL.x,z-JVIL.z)<JVIL.r+35)return true;
  if(x>KX0-40&&x<KX1+40&&z>KZ0-40&&z<KZ1+40)return true;if(typeof DCAMP!=='undefined'&&Math.hypot(x-DCAMP.x,z-DCAMP.z)<35)return true;if(Math.hypot(x-CIRCLE.x,z-CIRCLE.z)<25&&(mqIs('bloodmoon')||mqIs('malphas')))return true;return false;}
function nmVanish(e,quiet){if(!quiet&&Math.hypot(e.x-P.x,e.z-P.z)<80){const col=e.type==='nskel'?0xd8d0bc:e.type==='nrat'?0x5a4a3a:0x3a0a0a;for(let k=0;k<14;k++)spawnParticle(e.x+(Math.random()-.5),e.y+Math.random()*e.h,e.z+(Math.random()-.5),(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,col,1,.25);}
  removeEnt(e);const i=NIGHTMOB.indexOf(e);if(i>=0)NIGHTMOB.splice(i,1);}
function nmSpot(){const near=CAVES.filter(c=>c.ex!=null&&Math.hypot(c.ex-P.x,c.ez-P.z)<140&&Math.hypot(c.ex-P.x,c.ez-P.z)>22);
  for(let t=0;t<14;t++){let x,z;if(near.length&&Math.random()<.45){const c=near[(Math.random()*near.length)|0];x=c.ex+(Math.random()-.5)*8;z=c.ez+(Math.random()-.5)*8;}
    else{const a=P.yaw+Math.PI+(Math.random()-.5)*2.6,d=28+Math.random()*18;x=P.x-Math.sin(a)*d;z=P.z-Math.cos(a)*d;}
    if(!inWorld(x,z)||nightSafe(x,z))continue;const g=groundAt(x,z,1e4);if(!(g>WATER+.3))continue;if(typeof nearWater==='function'&&x>-HALF&&x<HALF&&nearWater(x,z))continue;return[x,z];}return null;}
function updateNightMobs(dt){
  const dark=isDark(),ev=tonightEv(),blood=dark&&ev==='blood',peace=dark&&ev==='blue';
  for(let i=NIGHTMOB.length-1;i>=0;i--){const e=NIGHTMOB[i];if(!DEM.includes(e)){NIGHTMOB.splice(i,1);continue;}if(e.dead)continue;
    const far=Math.hypot(e.x-P.x,e.z-P.z)>100||P.x>60000;if(far||!dark||peace||(e.blood&&!blood))nmVanish(e,far);}
  if(state!=='playing'||!dark||peace||P.x>60000||(typeof inRealm==='function'&&inRealm(P.x))||(typeof FIN!=='undefined'&&FIN.on)||mqIs('coda')||nightSafe(P.x,P.z)||cheatOn())return;
  nmT-=dt;if(nmT>0)return;nmT=blood?1.6+Math.random()*2:3+Math.random()*3.5;
  const alive=NIGHTMOB.filter(e=>!e.dead).length,cap=blood?24:14;if(alive>=cap)return;const q=nmSpot();if(!q)return;const[x,z]=q;
  const add=(type,ox,oz,ex)=>{const e=spawnEnt(type,x+ox,z+oz,Object.assign({nm:1,home:{x:P.x+(Math.random()-.5)*10,z:P.z+(Math.random()-.5)*10}},ex||{}));NIGHTMOB.push(e);return e;};
  const r=Math.random();
  if(blood&&r<.55){const k=Math.random(),type=k<.45?'imp':k<.8?'hound':'warrior';const n=type==='warrior'?1:type==='hound'?2:2+(Math.random()*2|0);for(let i=0;i<n;i++)add(type,(Math.random()-.5)*4,(Math.random()-.5)*4,{blood:1});
    if(!FLAGS.bloodWarn){FLAGS.bloodWarn=1;toast('Dämonen streifen unter dem Blutmond umher!');}}
  else if(r<.62){const n=Math.random()<.3?2:1;for(let i=0;i<n;i++)add('nskel',(Math.random()-.5)*3,(Math.random()-.5)*3);if(Math.hypot(x-P.x,z-P.z)<60)try{Snd.clink(.3);}catch(e){}}
  else{const n=2+(Math.random()*2|0);for(let i=0;i<n;i++)add('nrat',(Math.random()-.5)*3,(Math.random()-.5)*3);}}
{const u2=updateAnimals;updateAnimals=function(dt){u2(dt);try{updateNightMobs(dt);}catch(e){if(!updateNightMobs.err){updateNightMobs.err=1;console.error('Nacht',e);}}};}
{const dn2=dangerNear;dangerNear=function(){if(dn2())return true;for(const e of NIGHTMOB)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<25)return true;return false;};}
// Bei Blue Lunar bleiben auch die Mumien im Sand
{const um1=updateMummies;updateMummies=function(dt){if(peaceNight()){const key=(FLAGS.day||0)-(FLAGS.clock<330?1:0);mumNight=key;}um1(dt);};}
// Beim Laden: alle Nachtkreaturen weg
{const sg2=startGame;startGame=function(isNew,char){for(const e of NIGHTMOB.slice())nmVanish(e,true);NIGHTMOB.length=0;sg2(isNew,char);};}
// Hinweis beim Einbruch der Nacht
{let lastDark=null;const ud2=updateDayNight;updateDayNight=function(dt,nf){ud2(dt,nf);const d=isDark();if(lastDark===false&&d&&state==='playing'&&P.x<60000){const ev=tonightEv();
    if(ev==='blue')setTimeout(()=>toast('Blue Lunar: Heute Nacht ist alles friedlich.'),1800);else if(ev!=='blood'&&!FLAGS.nightTip){FLAGS.nightTip=1;setTimeout(()=>toast('Es wird Nacht. Aus den Höhlen kriechen Skelette und Ratten.'),1800);}}lastDark=d;};}
