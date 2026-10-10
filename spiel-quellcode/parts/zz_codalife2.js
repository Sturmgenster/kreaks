/* =========================================================
   Coda lebt: Die Bewohner gehen wieder durch die Straßen.
   - Fehler behoben: Bewohner bekamen nie ein neues Ziel (zwei Funktionen hießen pickTarget)
   - Berufe: Kinder spielen um den Brunnen und jagen sich, Bauern arbeiten auf den Feldern,
     Händler bleiben an ihren Ständen, Karrenleute ziehen oder schieben Handkarren,
     alle anderen spazieren zwischen Häusern, Markt, Brunnen, Kirche und Wirtshaus.
   - Neue Besucher anderer Völker: Grabler, Froschleute, Drachenmenschen, Möhrlinge,
     Samtpfoten, Wipfler, Zwerge, Elfen, Orks, dazu Händler, Knechte und Kinder.
   ========================================================= */
const CL2={carts:[],npcs:[],spawned:false};
const C2_POI=()=>{if(CL2.poi)return CL2.poi;const L=[[0,716],[0,724],[-6,720],[6,720],[-8,705],[8,735],[0,700],[0,742]];
  for(const b of VB){if(b.door&&Math.hypot(b.door[0]-CODA.x,b.door[1]-CODA.z)<75)L.push([b.door[0]+(Math.random()-.5),b.door[1]+(Math.random()-.5)]);}
  return CL2.poi=L.filter(p=>!(maskAt(p[0],p[1])&22));};
const C2_KEEP=new Set(['Dofra','Corvin','Hagen','Hedda','Albrecht','Hilde','Ottmar']);
const C2_TRADERS=new Set(['Wilma','Anselm','Bruno','Greta','Kuno','Ilse','Gustl']);
const c2Free=(x,z)=>!(maskAt(x,z)&22)&&getHeight(x,z)>WATER+.3;
function c2Rand(x0,x1,z0,z1){for(let i=0;i<12;i++){const x=x0+Math.random()*(x1-x0),z=z0+Math.random()*(z1-z0);if(c2Free(x,z))return[x,z];}return[(x0+x1)/2,(z0+z1)/2];}
function c2Job(v){if(v.job)return v.job;const n=v.name;
  if(v.d.kid)v.job='play';else if(C2_TRADERS.has(n))v.job='trade';else if(C2_KEEP.has(n)||v.smith||v.inside)v.job='keep';
  else if(v.role==='Bauer'||v.role==='Bäuerin'||['Edmar','Jutta','Konrad','Dorle'].includes(n))v.job='farm';
  else if(['Berthold','Ingo','Frieda','Merten'].includes(n))v.job='cart';else v.job='stroll';
  if(v.job==='farm')v.field=FIELDS[(n.length+(v.d.id||0))%FIELDS.length];
  if(v.job==='cart'){v.cartMode=(v.d.id%2)?'push':'pull';CL2.carts.push(c2Cart(v));}
  if(v.job==='trade'&&v.ax!=null){v.stall=[v.ax,v.az];}
  return v.job;}
// neue Ziele für Bewohner
function c2Pick(v){const j=c2Job(v);
  if(j==='keep'||j==='trade'){const r=j==='trade'?1.2:v.rad||5;for(let i=0;i<10;i++){const a=Math.random()*6.283,rr=Math.sqrt(Math.random())*r,x=v.ax+Math.cos(a)*rr,z=v.az+Math.sin(a)*rr;if(c2Free(x,z)){v.tx=x;v.tz=z;return;}}v.tx=v.ax;v.tz=v.az;return;}
  if(j==='play'){const others=villagers.filter(o=>o!==v&&o.d.kid&&!o.dead&&!o._hid&&!o.asleep);
    if(others.length&&Math.random()<.4){const o=others[(Math.random()*others.length)|0];v.chase=o;v.tx=o.x+(Math.random()-.5);v.tz=o.z+(Math.random()-.5);return;}
    v.chase=null;v.orb=(v.orb||Math.random()*6.283)+(.8+Math.random()*1.2)*(v.d.id%2?1:-1);const R=2.4+Math.random()*4.5;v.tx=CODA.x+Math.cos(v.orb)*R;v.tz=CODA.z+Math.sin(v.orb)*R;return;}
  if(j==='farm'){const[x0,z0,x1,z1]=v.field;const p=c2Rand(x0+1,x1-1,z0+1,z1-1);v.tx=p[0];v.tz=p[1];return;}
  const P2=C2_POI(),p=P2[(Math.random()*P2.length)|0];v.tx=p[0]+(Math.random()-.5)*2;v.tz=p[1]+(Math.random()-.5)*2;}
{const dem=pickTarget;pickTarget=function(e){if(e&&villagers.includes(e))return c2Pick(e);return dem(e);};}
// Geschwindigkeiten und Pausen je Beruf
{const a=updateVillagers;updateVillagers=function(dt){
  for(const v of villagers){if(v.dead)continue;const j=c2Job(v);if(v._sp00==null)v._sp00=v.speed||1.1;
    if(!v._hid&&v._sp0==null){v.speed=j==='play'?2.7:j==='cart'?.95:j==='farm'?.8:j==='stroll'?(v.d.elder?.75:1.15):v._sp00;}
    if(j==='play'&&v.chase&&!v.chase.dead&&v.wait<=0){v.tx=v.chase.x;v.tz=v.chase.z;if(Math.hypot(v.x-v.chase.x,v.z-v.chase.z)<.9){v.chase=null;v.wait=.2;if(Math.random()<.15&&Math.hypot(v.x-P.x,v.z-P.z)<25)say(v,['Hab dich!','Du bist dran!','Fang mich doch!','Ich bin schneller!'][(Math.random()*4)|0],1.8);}}}
  a(dt);
  for(const v of villagers){if(v.dead)continue;const j=v.job;
    if(v.wait>0&&!v._c2w){v._c2w=1;v.wait=j==='play'?.2+Math.random()*.8:j==='farm'?4+Math.random()*7:j==='trade'?6+Math.random()*10:j==='cart'?2+Math.random()*3:v.wait;}
    if(v.wait<=0)v._c2w=0;
    // Feldarbeit: bücken und wieder aufrichten
    if(j==='farm'&&v.wait>0&&!v.talk&&!v.asleep&&!v._hid&&Math.hypot(v.x-camera.position.x,v.z-camera.position.z)<SIM()){const f=Math.floor(time*1.6+v.d.id)%2?1:0;if(f!==v.frame){v.frame=f;const i=villagers.indexOf(v),s=SPR['p'+v.d.id+'_'+f],u=villMesh.geometry.attributes.uvr;u.array[i*4]=s.u;u.array[i*4+1]=s.v;u.needsUpdate=true;}
      if(Math.random()<dt*2)fxDust&&fxDust(v.x,v.z,2,.4,{size:.25,life:.8});}}
  c2CartTick(dt);};}
// ---------- Handkarren ----------
function c2Cart(owner){const g=new THREE.Group(),pl=VM&&VM.planks;if(!pl){return{g,owner};}
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.25,.42,.82),pl);body.position.y=.62;g.add(body);
  const load=new THREE.Mesh(new THREE.BoxGeometry(1,.34,.66),VM.thatch);load.position.y=.98;g.add(load);
  const wheels=[];for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.08,10),pl);w.rotation.x=Math.PI/2;w.position.set(0,.36,s*.47);g.add(w);wheels.push(w);}
  for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.BoxGeometry(1,.06,.06),pl);h.position.set(.95,.72,s*.3);g.add(h);}
  scene.add(g);return{g,owner,wheels,dir:[1,0],lx:owner.x,lz:owner.z};}
function c2CartTick(dt){for(const c of CL2.carts){const v=c.owner,g=c.g;if(!c.wheels)continue;
  const vis=!v.dead&&!v._hid&&!v.asleep&&!(v.y<-500)&&Math.hypot(v.x-camera.position.x,v.z-camera.position.z)<SIM();g.visible=vis;if(!vis)continue;
  const mx=v.x-c.lx,mz=v.z-c.lz,m=Math.hypot(mx,mz);if(m>.01){c.dir=[mx/m,mz/m];for(const w of c.wheels)w.rotation.y+=m/.36;}c.lx=v.x;c.lz=v.z;
  const s=v.cartMode==='push'?1.15:-1.25,x=v.x+c.dir[0]*s,z=v.z+c.dir[1]*s;g.position.set(x,getHeight(x,z),z);
  // Griffe zeigen immer zur Person
  const hx=v.x-x,hz=v.z-z;g.rotation.y=Math.atan2(-hz,hx);}}
// ---------- Besucher anderer Völker und mehr Leute ----------
const C2_FOLK=[
  ['Murk','Grabler','Händler',{race:'mole',skin:1,cloth:'vest',clothColor:'brown',pants:'brown'},'market'],
  ['Grubba','Grablerin','Bäuerin',{race:'mole',sex:'f',skin:2,cloth:'tunic',clothColor:'green',pants:'brown'},'farm'],
  ['Quorg','Froschmensch','Fischer',{race:'frog',skin:0,cloth:'vest',clothColor:'teal',pants:'brown'},'stroll'],
  ['Plibbi','Froschmädchen','Kind',{race:'frog',sex:'f',age:'kid',skin:3,cloth:'tunic',clothColor:'cream',pants:'brown'},'play'],
  ['Ssarok','Drachenmensch','Reisender',{race:'dragon',skin:0,cloth:'leather',clothColor:'black',pants:'grey'},'stroll'],
  ['Vyrna','Drachenmenschin','Händlerin',{race:'dragon',sex:'f',skin:1,cloth:'robe',clothColor:'purple',pants:'brown'},'market'],
  ['Wurzel','Möhrling','Gärtner',{race:'carrot',skin:0,cloth:'vest',clothColor:'green',pants:'brown'},'farm'],
  ['Rübchen','Möhrling','Kind',{race:'carrot',age:'kid',skin:1,cloth:'tunic',clothColor:'red',pants:'brown'},'play'],
  ['Minka','Samtpfote','Musikantin',{race:'cat',sex:'f',skin:0,cloth:'tunic',clothColor:'blue',pants:'brown'},'stroll'],
  ['Bongo','Wipfler','Lastenträger',{race:'ape',skin:0,cloth:'vest',clothColor:'red',pants:'brown'},'cart'],
  ['Thorgrim','Zwerg','Erzhändler',{race:'dwarf',skin:1,hair:'short',hairColor:'red',beard:'long',cloth:'chain',clothColor:'grey',pants:'brown'},'market'],
  ['Elarion','Elf','Barde',{race:'elf',skin:0,hair:'long',hairColor:'blond',cloth:'robe',clothColor:'green',pants:'grey'},'stroll'],
  ['Gorbag','Ork','Knecht',{race:'orc',skin:0,cloth:'vest',clothColor:'brown',pants:'brown'},'cart'],
  ['Henne','Mensch','Magd',{sex:'f',skin:2,hair:'braid',hairColor:'blond',cloth:'dress',clothColor:'cream',pants:'brown'},'stroll'],
  ['Kasper','Mensch','Knecht',{skin:0,hair:'short',hairColor:'brown',cloth:'tunic',clothColor:'ochre',pants:'brown'},'farm'],
  ['Jule','Mensch','Kind',{sex:'f',age:'kid',skin:1,hair:'long',hairColor:'red',cloth:'dress',clothColor:'green',pants:'brown'},'play'],
  ['Max','Mensch','Kind',{age:'kid',skin:2,hair:'short',hairColor:'blond',cloth:'tunic',clothColor:'blue',pants:'brown'},'play'],
  ['Oswin','Mensch','Wanderhändler',{skin:3,hair:'short',hairColor:'black',beard:'short',cloth:'leather',clothColor:'brown',pants:'grey'},'market']];
const C2_SIZE={mole:.8,frog:.95,dragon:1.1,carrot:.78,cat:.9,ape:1.1,dwarf:.85,elf:1.05,orc:1.15,human:1};
const C2_LINES={market:['Frische Ware! Schaut her!','Nur heute zum halben Preis!','Kommt näher, Leute!'],stroll:['Schöner Tag in Coda, nicht wahr?','Seid gegrüßt, Wanderer.','Seit Shikaya fort ist, kommen Leute aus allen Ländern hierher.','Ich bin nur auf der Durchreise. Aber hier gefällt es mir.'],
  farm:['Die Ernte wird gut dieses Jahr.','Puh, Feldarbeit macht durstig.','Mein Rücken …'],cart:['Platz da, der Karren kommt!','Vorsicht, schwere Ladung!','Noch eine Fuhre zur Mühle.'],play:['Fang mich!','Hihi!','Du kriegst mich nie!']};
{const a=finaleSprites;finaleSprites=function(list){a(list);try{C2_FOLK.forEach((F,i)=>{const L=Object.assign(defaultChar(),F[3]);for(const f of[0,1,2]){let cv;try{cv=drawHero(L,f);}catch(e){cv=drawHero(defaultChar(),f);}list.push(['cn'+i+'_'+f,cv]);}});}catch(e){console.error('Coda-Besucher',e);}};}
DT.cnpc={name:'',fac:'prop',h:1.75,hp:999,dmg:0,spd:1.1,reach:0,cd:9,hero:1,side:1,spr:e=>'cn'+e.ci+'_',rad:.3};
function c2Visible(){if(FLAGS.codaHide||(typeof FIN!=='undefined'&&FIN.on))return false;const c=FLAGS.clock==null?600:FLAGS.clock;return c>6*60+20&&c<21*60+10;}
function c2Spawn(){if(CL2.spawned)return;CL2.spawned=true;
  C2_FOLK.forEach((F,i)=>{const[name,race,role,look,job]=F,kid=look.age==='kid',sz=(C2_SIZE[look.race||'human']||1)*(kid?.75:1);
    const p=job==='play'?[CODA.x+(Math.random()-.5)*8,CODA.z+(Math.random()-.5)*8]:job==='market'?[(Math.random()<.5?-1:1)*(6+Math.random()*3),712+Math.random()*16]:job==='farm'?c2Rand(...(f=>[f[0]+1,f[2]-1,f[1]+1,f[3]-1])(FIELDS[i%FIELDS.length])):C2_POI()[(i*3)%C2_POI().length];
    const e=spawnEnt('cnpc',p[0],p[1],{ci:i,always:true,noHostile:true,inv:true,nosave:true,scale:sz,name,c2:{job,race,role,field:FIELDS[i%FIELDS.length],wait:Math.random()*3,tx:p[0],tz:p[1],orb:Math.random()*6.283}});
    e.special=c2Npc;e.home={x:p[0],z:p[1]};CL2.npcs.push(e);if(job==='cart'){e.cartMode=i%2?'push':'pull';CL2.carts.push(c2Cart(e));}});}
function c2Npc(e,dt){const C=e.c2,vis=c2Visible();e.hidden=!vis;e.tgt=null;if(!vis)return true;
  if(Math.hypot(e.x-P.x,e.z-P.z)<3.2&&(e.chatCd||0)<=0&&state==='playing'){e.chatCd=30+Math.random()*30;say(e,(e.name+' ('+C.role+'): ')+C2_LINES[C.job][(Math.random()*C2_LINES[C.job].length)|0],3.5);}
  if(e.chatCd>0)e.chatCd-=dt;
  if(C.wait>0){C.wait-=dt;e.frame=C.job==='farm'?(Math.floor(time*1.6+e.ci)%2?1:0):C.job==='market'?(Math.floor(time*.7+e.ci)%5===0?1:0):0;entGround(e);
    if(C.wait<=0){if(C.job==='play'){C.orb+=(.8+Math.random())*(e.ci%2?1:-1);const R=2.4+Math.random()*4.5;C.tx=CODA.x+Math.cos(C.orb)*R;C.tz=CODA.z+Math.sin(C.orb)*R;}
      else if(C.job==='farm'){const f=C.field,p=c2Rand(f[0]+1,f[2]-1,f[1]+1,f[3]-1);C.tx=p[0];C.tz=p[1];}
      else if(C.job==='market'){const p=[(Math.random()<.5?-1:1)*(5+Math.random()*4),708+Math.random()*22];C.tx=p[0];C.tz=p[1];}
      else{const P2=C2_POI(),p=P2[(Math.random()*P2.length)|0];C.tx=p[0]+(Math.random()-.5)*2;C.tz=p[1]+(Math.random()-.5)*2;}}
    return true;}
  const sp=C.job==='play'?2.6:C.job==='cart'?.95:C.job==='farm'?.8:1.1,ox=e.x,oz=e.z;const m=entMove(e,C.tx,C.tz,sp,dt);entGround(e);
  if(m<.001||Math.hypot(C.tx-e.x,C.tz-e.z)<.3){C.wait=C.job==='play'?.2+Math.random()*.7:C.job==='farm'?4+Math.random()*6:C.job==='market'?3+Math.random()*6:2+Math.random()*4;}
  else if(Math.hypot(e.x-ox,e.z-oz)<m*.3){C.stuck=(C.stuck||0)+dt;if(C.stuck>.8){C.stuck=0;C.wait=.1;}}
  return true;}
// Spawnen, sobald man in die Nähe von Coda kommt
{const a=updateVillagers;updateVillagers=function(dt){a(dt);if(CL2.npcs.length){const v=c2Visible();for(const e of CL2.npcs)if(!v)e.hidden=true;else if(e.hidden&&!FILM.on)e.hidden=false;}if(!CL2.spawned&&state!=='menu'&&state!=='loading'&&Math.hypot(P.x-CODA.x,P.z-CODA.z)<260)try{c2Spawn();}catch(e){console.error('Coda-Besucher',e);}};}
