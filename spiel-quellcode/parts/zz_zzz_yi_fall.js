/* =========================================================
   0.0.138 · Fallschaden und der fangende Engel
   - Wer tiefer als 5 Meter fällt, nimmt Schaden. Je tiefer, desto mehr: ab etwa 22 Metern ist es tödlich.
     Kein Fallschaden im Wasser, beim Reiten, im Boot, beim Schwimmen, mit dem Zauber „Schweben“ und im Cheat-Modus.
   - Ganz, ganz selten fängt ein Engel dich bei einem sehr tiefen Sturz (ab etwa 28 Metern) auf:
     Er fliegt herbei, packt dich mit seinen großen Händen, trägt dich ein Stück durch die Luft und setzt dich sanft ab.
     Wie alle Engel nicht bei Blutmond, nur unter freiem Himmel und höchstens alle 2 Spieltage. Gebet und Glaube helfen ein wenig.
   ========================================================= */
const FALL={top:null,rolled:false};
function fallSafeNow(){if(cheatOn()||state!=='playing'||P.riding)return true;try{if(cheatFly)return true;}catch(e){}try{if(boatIn)return true;}catch(e){}try{if(SW.on)return true;}catch(e){}
  try{if(MAG.fx.float&&MAG.fx.float.until>time)return true;}catch(e){}if(P.hasFlown)return true;if(P.y<WATER-.3&&nearWater(P.x,P.z))return true;return false;}
function fallLand(drop){if(drop<=5)return;const S=P.stats;if(!S)return;const dmg=Math.round((drop-5)*S.maxHp*.06);if(dmg<=0)return;
  S.hp=Math.max(0,S.hp-dmg);P.lastDmg=time;renderStats();try{hurtFx(dmg);}catch(e){}try{Snd.land();Snd.thud();}catch(e){}
  for(let k=0;k<Math.min(30,8+dmg/3);k++)spawnParticle(P.x+(Math.random()-.5)*1.2,P.y+.1,P.z+(Math.random()-.5)*1.2,(Math.random()-.5)*4,Math.random()*2.5,(Math.random()-.5)*4,0x8a7a62,.6,.3);
  if(S.hp<=0){playerDie();return;}if(drop>9)toast(drop>15?'Das war ein tiefer Sturz!':'Autsch!');}
function fallTrack(was,y0){const jump=FALL.ly!=null&&Math.abs(y0-FALL.ly)>8;FALL.ly=P.y;if(jump||Math.abs(P.y-y0)>12||fallSafeNow()){FALL.top=null;FALL.rolled=false;return;}
  if(!P.ground){FALL.top=Math.max(FALL.top==null?y0:FALL.top,P.y);
    // ein Engel fängt dich (sehr selten)
    if(!FALL.rolled&&P.vy<-12){const g=groundAt(P.x,P.z,P.y),above=P.y-g,total=FALL.top-g;
      if(total>=28&&above>=14){FALL.rolled=true;let ok=false;try{ok=angOutdoors()&&!ANG.a&&!angBloodMoon()&&angRested()&&Math.random()<.015*(1+faithTier()*.5);}catch(e){}if(ok)angCatchStart();}}}
  else{if(!was&&FALL.top!=null)fallLand(FALL.top-P.y);FALL.top=null;FALL.rolled=false;}}
// ---------- Der Engel fängt dich ----------
function angCatchStart(){const A=angMake('catch',{light:true});ANG.a=A;const r=Math.random()*6.283;A.x=P.x+Math.cos(r)*22;A.z=P.z+Math.sin(r)*22;A.y=P.y+9;A.ph='swoop';
  // Flugrichtung: dorthin, wo Land ist
  let best=null;for(let k=0;k<12;k++){const a=k/12*6.283+Math.random()*.3,x=P.x+Math.cos(a)*18,z=P.z+Math.sin(a)*18;const h=groundAt(x,z,P.y);if(h>WATER+.6&&(!best||Math.abs(h-(groundAt(P.x,P.z,P.y)))<best.d))best={a,d:Math.abs(h-groundAt(P.x,P.z,P.y))};}
  const fa=best?best.a:Math.random()*6.283;A.dx=Math.cos(fa);A.dz=Math.sin(fa);FLAGS.angDay=FLAGS.day||0;FLAGS.angT=Date.now();FLAGS.angCatch=(FLAGS.angCatch||0)+1;
  showArea('Ein Engel!');try{Snd.shimmer();Snd.whoosh(400,.15);}catch(e){}try{if(MP.on&&MP.ready)mpSend({t:'ang',k:'rescue',pid:MP.pid,dur:6});}catch(e){}return A;}
const angHold=A=>[A.x+A.dx*3,A.y-ANG_H*.46,A.z+A.dz*3];
function angCatchTick(dt){const A=ANG.a;if(!A||A.mode!=='catch'||A.ph==='leave')return;
  if(state==='dead'||state==='menu'){A.holdP=false;A.ph='leave';A.lx=A.dx;A.lz=A.dz;return;}
  if(A.ph==='swoop'){const tx=P.x-A.dx*1.6,ty=P.y+ANG_H*.5,tz=P.z-A.dz*1.6,d=angSteer(A,tx,ty,tz,95,dt,7);
    if(P.ground){A.ph='leave';A.lx=A.dx;A.lz=A.dz;return;}
    if(d<2.6||A.t>1.6){A.ph='carry';A.ct=0;A.holdP=true;A.act='ho';A.x0=A.x;A.z0=A.z;FALL.top=null;FALL.rolled=true;try{Snd.whoosh(250,.18);Snd.chime();}catch(e){}
      for(let k=0;k<40;k++)spawnParticle(P.x+(Math.random()-.5)*2,P.y+Math.random()*2,P.z+(Math.random()-.5)*2,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,Math.random()<.5?0xffffff:0xfff2c8,.6,.25);showArea('Ein Engel fängt dich auf!');}}
  else if(A.ph==='carry'){A.ct+=dt;A.act='ho';const q=Math.min(1,A.ct/4.2),x=A.x0+A.dx*18*q,z=A.z0+A.dz*18*q,g=groundAt(x+A.dx*1.6,z+A.dz*1.6,1e4),ty=g+ANG_H*.5+1.2+(1-q)*(Math.max(0,A.y-g-ANG_H*.5)*.7);
    angSteer(A,x,ty,z,16,dt,3);const[hx,hy,hz]=angHold(A),gh=groundAt(hx,hz,hy+1);
    if((A.ct>3.2&&hy-gh<2.2)||A.ct>6){A.holdP=false;A.act=null;P.x=hx;P.z=hz;P.y=gh+.05;P.vx=P.vy=P.vz=0;P.ground=true;P.safe=[P.x,P.z];FALL.top=null;A.ph='leave';A.lx=A.dx;A.lz=A.dz;
      showArea('Der Engel setzt dich sanft ab.');try{Snd.chime();}catch(e){}for(let k=0;k<30;k++)spawnParticle(P.x+(Math.random()-.5)*1.5,P.y+Math.random()*1.5,P.z+(Math.random()-.5)*1.5,0,1+Math.random(),0,0xfff4d8,.6,.2);}}}
{const a=updatePlayer;updatePlayer=function(dt){const A=ANG.a;if(A&&A.mode==='catch'&&A.holdP){const put=()=>{const[x,y,z]=angHold(A);P.x=x;P.z=z;P.y=y;P.vx=P.vy=P.vz=0;P.ground=false;};put();a(dt);put();FALL.top=null;return;}
  const was=P.ground,y0=P.y;a(dt);try{fallTrack(was,y0);const B=ANG.a;if(B&&B.mode==='catch'&&B.ph==='swoop'&&P.vy<-7)P.vy=-7;}catch(e){if(!fallTrack.err){fallTrack.err=1;console.error('Fallschaden',e);}}};}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{angCatchTick(dt);}catch(e){if(!angCatchTick.err){angCatchTick.err=1;console.error('Engel fängt',e);}}};}
// Teleports und Ladebildschirme zählen nicht als Sturz
{const a=teleport;teleport=function(...r){FALL.top=null;return a(...r);};}
{const a=startGame;startGame=function(...r){FALL.top=null;return a(...r);};}
