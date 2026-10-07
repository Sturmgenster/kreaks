/* =========================================================
   V60 · Nachtruhe: Wenn es dunkel wird, gehen die Leute aller Dörfer nach Hause.
   Coda, das Froschdorf, das Affendorf, die Kaiserstadt und Tiefgrund.
   Wer gerade für die Geschichte gebraucht wird, bleibt wach.
   ========================================================= */
const clockMin=()=>FLAGS.clock==null?600:FLAGS.clock;
const inRange=(c,a,b)=>a<b?c>=a&&c<b:c>=a||c<b;// Minuten, auch über Mitternacht
// ---------- Coda ----------
function codaHomes(){const B=t=>VB.find(b=>b.type===t),homes=VB.filter(b=>b.type==='house');if(!homes.length)return;
  const fams=[['Aldwin','Adela','Pip'],['Berthold','Brunhild','Lotte'],['Edmar','Cilla','Fiete'],['Falko','Dorle','Mia'],['Gerold','Elsbeth','Tobi'],['Ingo','Frieda']];
  const singles=['Jorin','Konrad','Norbert','Gisela','Irma','Jutta','Lene','Mechthild','Nele','Odila'];const V=n=>villagers.find(v=>v.name===n);
  const door=b=>b&&b.door?[b.door[0],b.door[1]]:null;
  fams.forEach((f,i)=>f.forEach(n=>{const v=V(n);if(v&&homes[i])v.home=door(homes[i]);}));singles.forEach((n,i)=>{const v=V(n),h=homes[6+(i%6)]||homes[i%homes.length];if(v&&h)v.home=door(h);});
  const set=(n,t)=>{const v=V(n),b=B(t);if(v&&b)v.home=door(b);};set('Dofra','smithy');set('Corvin','church');set('Merten','mill');set('Lutz','farmhouse');set('Klara','farmhouse');
  for(const v of villagers){if(v.home||v.inside)continue;let best=null,bd=1e9;for(const b of VB){if(!b.door||!['house','farmhouse','smithy','church','mill'].includes(b.type))continue;const d=Math.hypot(b.door[0]-v.ax,b.door[1]-v.az);if(d<bd){bd=d;best=b;}}if(best)v.home=door(best);}
  for(const v of villagers){const r=mulberry32(4400+v.d.id*17),kid=v.d.kid,old=v.d.elder;v.bed=kid?1200+r()*30:old?1250+r()*30:1290+r()*80;v.wake=kid?400+r()*40:old?330+r()*40:350+r()*60;
    if(v.smith)v.bed=1320+r()*20;}}
{const sv0=setupVillagers;setupVillagers=function(){sv0();try{codaHomes();}catch(e){console.error('Schlafplätze',e);}};}
function villagerNeeded(v){const n=v.name;if(n==='Hagen'||n==='Hedda'||v.inside)return true;
  if(n==='Corvin'&&(mqIs('corvin')))return true;if(n==='Dofra'&&(mqIs('dofra')||mqIs('forge')||mqIs('give')||(FLAGS.mq==null&&!FLAGS.dofraAsked)))return true;
  if(mqIs('coda')||mqIs('end'))return false;return false;}
function villagerBedtime(v){if(!v.home||v.dead||villagerNeeded(v))return false;const c=clockMin();return inRange(c,v.bed,v.wake);}
{const uv0=updateVillagers;updateVillagers=function(dt){const sim=SIM(),cx=camera.position.x,cz=camera.position.z;
  for(const v of villagers){if(v.dead)continue;const bed=villagerBedtime(v),far=Math.hypot(v.x-cx,v.z-cz)>sim;
    if(bed){if(!v.asleep){if(far){v.x=v.home[0];v.z=v.home[1];v.asleep=true;}else{const d=Math.hypot(v.home[0]-v.x,v.home[1]-v.z);v.tx=v.home[0];v.tz=v.home[1];v.wait=0;v.goHome=true;
          v.homeT=(v.homeT||0)+dt;if(d<1.3||(v.stuckHome=(v.stuckHome||0)+(d<3?dt:0))>4||v.homeT>45){v.asleep=true;v.goHome=false;v.stuckHome=0;v.homeT=0;}}}}
    else if(v.asleep||v.goHome){v.asleep=false;v.goHome=false;v.talk=0;v.wait=1+Math.random()*3;if(v.home){v.x=v.home[0]+(Math.random()-.5);v.z=v.home[1]+(Math.random()-.5);}v.tx=v.x;v.tz=v.z;}
    if(v.asleep)v.talk=999;}
  uv0(dt);
  const off=villMesh.geometry.attributes.offset;let ch=false;villagers.forEach((v,i)=>{if(v.asleep){v.talk=0;v.y=-999;off.array[i*3+1]=-999;ch=true;}else if(v.goHome&&!v.flee){v.wait=0;v.tx=v.home[0];v.tz=v.home[1];}});if(ch)off.needsUpdate=true;};}
// Wer schläft, wird nicht angesprochen
{const vl0=villagerLine;villagerLine=function(v){if(v.goHome){const L=v.d.kid?['Ich muss heim, Mama ruft!','Gute Nacht!']:['Es wird dunkel. Ich gehe heim.','Gute Nacht, Fremder. Bleib nicht zu lange draußen.','Nachts kommen die Wölfe näher. Ich geh lieber rein.'];return L[(Math.random()*L.length)|0];}return vl0(v);};}
// ---------- Froschdorf: die Kleinen gehen früh ins Bett, die Großen singen bis Mitternacht ----------
const FROG_SING=['Quaaak-quak-quaaa ♪','Ribbit, ribbit, quaaak ♪','Uuunk … uuunk … ♪','Quak! Sing mit, Langbein!','Der Mond, der Mond, der Mond ist da … quaak ♪'];
function frogDoor(v){if(v.door)return v.door;const H=FROG_HUTS[(v.i*5)%FROG_HUTS.length],a=Math.atan2(FROG.z-H.z,FROG.x-H.x);v.hut=H;v.door=[H.x+Math.cos(a)*(H.R+.5),H.z+Math.sin(a)*(H.R+.5)];return v.door;}
function frogBed(v){const c=clockMin();if(v.kid)return inRange(c,1215,390);if(v.job==='fish')return inRange(c,1200,330);if(v.job==='trader')return inRange(c,1380,360);return inRange(c,0,360);}
function frogSings(v){const c=clockMin();return!v.kid&&v.job!=='fish'&&v.job!=='trader'&&inRange(c,1230,1440);}
{const uf0=updateFrogs;updateFrogs=function(dt){if(!frogMesh)return uf0(dt);const near=Math.hypot(P.x-FROG.x,P.z-FROG.z)<FROG.r+40;
  for(const v of frogs){const bed=frogBed(v);
    if(bed){if(!v.asleep){const[dx,dz]=frogDoor(v),d=Math.hypot(dx-v.x,dz-v.z);if(v.job==='fish'||d<1||!near){v.asleep=true;v.x=dx;v.z=dz;v.hop=null;v.walk=false;v.y=groundAt(dx,dz,9);}
        else if(!v.hop&&v.talk<=0){v.tx=dx;v.tz=dz;v.walk=true;v.chain=false;v.wait=0;}}}
    else if(v.asleep){v.asleep=false;v.wait=1+Math.random()*2;if(v.job==='fish'){[v.x,v.z]=pierWorld(...v.spot0);v.y=FROG.deck;}}
    if(!bed&&frogSings(v)&&!v.hop&&v.talk<=0){if(!v.singAt){let best=null,bd=1e9;for(const s of FROG_SHORE){const d=Math.hypot(s.x-v.x,s.z-v.z)+Math.random()*4;if(d<bd){bd=d;best=s;}}v.singAt=best;}
      const s=v.singAt;if(s&&Math.hypot(s.x-v.x,s.z-v.z)>.8){v.tx=s.x;v.tz=s.z;v.walk=true;v.wait=0;}else{v.walk=false;v.wait=1;if(near&&state==='playing'&&Math.random()<dt*.08&&!bubbles.some(b=>b.v===v)){say(v,FROG_SING[(Math.random()*FROG_SING.length)|0],2.5);frogQuak();}}}
    else if(!frogSings(v))v.singAt=null;
    if(v.asleep)v.talk=999;}
  uf0(dt);
  const off=frogMesh.geometry.attributes.offset;let ch=false;frogs.forEach((v,i)=>{if(v.asleep){v.talk=0;off.array[i*3+1]=-999;ch=true;if(v.bob){v.bob.visible=false;v.line.visible=false;}}else if(v.bob&&!v.bob.visible){v.bob.visible=true;v.line.visible=true;}});if(ch)off.needsUpdate=true;
  // Froschchor: in warmen Nächten hört man das ganze Dorf
  if(near&&state==='playing'&&inRange(clockMin(),1230,1440)&&Math.random()<dt*.6){try{frogQuak();}catch(e){}}};}
// Fischer: Startplatz merken, damit sie morgens zurückkehren
{const if0=initFrogVillage;initFrogVillage=function(a){if0(a);const fishSpots=[[FROG_PIER.L-.55,0],[FROG_PIER.L-3.3,-.72],[4.6,.72]];let k=0;for(const v of frogs)if(v.job==='fish')v.spot0=fishSpots[k++]||fishSpots[0];};}
// Ein schlafender Frosch ist nicht ansprechbar
{const sl0=storyLooked;storyLooked=function(){const v=sl0();if(v&&v.asleep)return null;return v;};}
// ---------- Affendorf ----------
function apeNight(){const h=wHour();return h<5.8||h>21.2;}
function apeDoor(e){if(e.door)return e.door;const H=JHUTS[(e.ai*3+1)%JHUTS.length],dx=JVIL.x-H.x,dz=JVIL.z-H.z,l=Math.hypot(dx,dz)||1;e.door=[H.x+dx/l*(H.r+.7),H.z+dz/l*(H.r+.7)];return e.door;}
{const at0=apeTalk;apeTalk=function(e,dt){if(e.role==='Schamane'||!JHUTS.length)return at0(e,dt);
  if(apeNight()){const[x,z]=apeDoor(e);if(!e.npcSleep){if(e.slept==null||Math.hypot(x-e.x,z-e.z)<1||Math.hypot(P.x-e.x,P.z-e.z)>60){e.x=x;e.z=z;e.npcSleep=1;e.hidden=1;}else{entMove(e,x,z,1.4,dt);}}e.slept=1;return true;}
  e.slept=0;if(e.npcSleep){e.npcSleep=0;e.hidden=0;const[x,z]=apeDoor(e);e.x=x;e.z=z;}return at0(e,dt);};}
// ---------- Kaiserstadt: die meisten gehen schlafen, die Wache nicht ----------
function kNight(){const h=wHour();return h<5.5||h>22;}
{const kt0=kCitizenTalk;kCitizenTalk=function(e,dt){if(e.ci===5)return kt0(e,dt);if(e.owl==null)e.owl=Math.random()<.2;
  if(kNight()&&!e.owl){const h=e.home||{x:e.x,z:e.z};if(!e.npcSleep){if(Math.hypot(h.x-e.x,h.z-e.z)<1||Math.hypot(P.x-e.x,P.z-e.z)>70){e.npcSleep=1;e.hidden=1;}else entMove(e,h.x,h.z,1.5,dt);}return true;}
  if(e.npcSleep){e.npcSleep=0;e.hidden=0;}return kt0(e,dt);};}
{const ud1=updateDemons;updateDemons=function(dt){ud1(dt);for(const L of[apes,kCitizens])if(L)for(const e of L)if(e.npcSleep)e.y=-60;};}
{const sl1=storyLooked;storyLooked=function(){const v=sl1();if(v&&v.npcSleep)return null;return v;};}
// ---------- Reisende Händler schlagen nachts ihr Lager auf ----------
{const um0=updateMerchants;updateMerchants=function(dt){const c=clockMin();if(inRange(c,1290,330))for(const m of MERCHANTS)if(m.talk<=0&&m.wait<5)m.wait=5;um0(dt);};}
