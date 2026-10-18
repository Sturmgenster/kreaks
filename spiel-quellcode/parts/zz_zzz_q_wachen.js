/* =========================================================
   0.0.121 · Die Stadtwache der Dungeon-Stadt
   - Wachen gehen zu zweit Streife durch Straßen, Gassen, Plätze und Parks
   - Sie kontrollieren Bürger und auch dich (Gildenlizenz zeigen)
   - Nachts stehen sie an den vier Stadttoren, an Feuerschalen, und verteidigen sie
   - Ab und zu greifen nachts Untote ein Tor an. Die Wachen kämpfen (und du kannst helfen)
   ========================================================= */
DT.tcw=Object.assign({},DT.tc8,{name:'Stadtwache',fac:'ally',hp:520,dmg:24,spd:4.2,reach:2,cd:1.1,aggro:22,leash:60});
const GW={list:[],posts:[],braz:[],raid:[],raidT:120,checkP:-999};
const GW_LINES={patrol:['Alles ruhig in der Gasse.','Augen auf, Bürger.','Keine Raufereien, verstanden?','Die Gilde zahlt uns gut. Wir passen gut auf.'],
  check:['Halt! Kontrolle. Wohin des Weges?','Stehen bleiben. Was hast du da im Korb?','Kontrolle. Zeig mal deine Hände.'],cit:['Nur zum Markt, Herr Wachtmeister.','Ich wohne gleich da vorne!','Ehrlich, ich hab nichts getan.','Brot und Fisch, sonst nichts.'],
  night:['Das Tor bleibt bewacht. Die ganze Nacht.','Hörst du das? Da draußen bewegt sich was.','Geh lieber nach Hause, es ist spät.']};
const gwNight=()=>{const c=FLAGS.clock==null?600:FLAGS.clock;return c>=1260||c<360;};
function gwGates(){const L=[];for(const q of[0,Math.PI/2,Math.PI,-Math.PI/2]){const c=Math.cos(q),s=Math.sin(q);L.push({q,x:TWC.x+c*(TWC.WR-11),z:TWC.z+s*(TWC.WR-11),tx:-s,tz:c,out:[TWC.x+c*(TWC.WR+22),TWC.z+s*(TWC.WR+22)]});}return L;}
function gwSpots(){const L=[],X=TWC.x,Z=TWC.z;for(const Q of CITY_PL)L.push([X+(Q.x0+Q.x1)/2,Z+(Q.z0+Q.z1)/2]);for(const C of CITY_RD)L.push([X+C.x,Z+C.z]);for(const g of gwGates())L.push([g.x,g.z]);
  for(let k=0;k<8;k++){const a=k/8*6.283;L.push([X+Math.cos(a)*76,Z+Math.sin(a)*76]);}for(const S of CITY_ST){if(S.main)continue;const a=S.p[0],b=S.p[1];L.push([X+(a[0]+b[0])/2,Z+(a[1]+b[1])/2]);}return L;}
// ---------- Aufstellen ----------
function gwSpawn(){GW.list=[];const gates=gwGates(),spots=gwSpots();
  // Torwachen (aus der alten Aufstellung) werden kampfbereit
  for(const e of TWS.ents)if(e.guard){e.d=DT.tcw;e.fac='ally';e.max=e.hp=DT.tcw.hp;e.gd={role:e.twGate?'tower':'gate',post:[e.x,e.z]};e.special=gwAI;if(e.patrol){removeEnt(e);e.dead=true;}else GW.list.push(e);}
  TWS.ents=TWS.ents.filter(e=>!(e.patrol&&e.dead));
  // Streifen: vier Paare
  for(let i=0;i<4;i++){const g=gates[i],sp=spots[(i*7)%spots.length];for(let k=0;k<2;k++){const e=spawnEnt('tcw',sp[0]+k*1.2,sp[1],{home:{x:sp[0],z:sp[1]},name:'Stadtwache',role:'Streife',guard:1,talk:0,wander:false,always:true});e.portrait=twPortrait('tc8_0');
      e.gd={role:'patrol',pair:i,lead:k===0,gate:g,slot:k,path:[],pi:0,wait:0};e.special=gwAI;GW.list.push(e);TWS.ents.push(e);}}
  for(const e of GW.list)if(e.gd.role==='patrol'&&!e.gd.lead)e.gd.leader=GW.list.find(o=>o.gd&&o.gd.role==='patrol'&&o.gd.pair===e.gd.pair&&o.gd.lead);}
{const a=twSpawnFolk;twSpawnFolk=function(){a();try{gwSpawn();}catch(e){console.error('Wachen',e);}};}
// Feuerschalen an den Toren
{const a=twBuild;twBuild=function(){a();try{const M=twMats();GW.braz=[];for(const g of gwGates())for(const sd of[-1,1]){const x=g.x+g.tx*sd*5.5,z=g.z+g.tz*sd*5.5;
    const b=new THREE.Mesh(new THREE.CylinderGeometry(.55,.3,1.1,8),new THREE.MeshLambertMaterial({color:0x2a2a30}));b.position.set(x,TWC.H+.55,z);TWS.grp.add(b);
    const f=new THREE.Mesh(new THREE.BoxGeometry(.6,.4,.6),new THREE.MeshBasicMaterial({color:0xffa030}));f.position.set(x,TWC.H+1.25,z);TWS.grp.add(f);GW.braz.push({x,z,f});
    TWS.sol.push(solAdd({x,z,hw:.5,hd:.5,y0:TWC.H-2,y1:TWC.H+1.4,rot:0,solid:1,tw:1}));}}catch(e){console.error('Feuerschalen',e);}};}
// ---------- Verhalten ----------
function gwFoe(e,r){let b=null,bd=r;for(const o of DEM){if(o.fac!=='demon'||o.dead||o.dormant||o.adv&&o.party&&!o.party.rob&&!o.party.angry)continue;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o;}}return b;}
function gwGo(e,x,z,sp,dt){if(entMove(e,x,z,sp,dt)<.001&&e.frame!=='a')e.frame=0;}
function gwPlan(e,x,z){const G=e.gd;if(!BWG.built)bwGraph();const a=bwNear(e.x,e.z),b=bwNear(x,z);G.path=bwRoute(a,b).map(i=>BWG.nodes[i]);G.path.push([x,z]);G.pi=0;}
function gwFollow(e,sp,dt){const G=e.gd,q=G.path[G.pi];if(!q)return true;gwGo(e,q[0],q[1],sp,dt);if(Math.hypot(q[0]-e.x,q[1]-e.z)<1.4){G.pi++;if(G.pi>=G.path.length)return true;}return false;}
function gwAI(e,dt){const G=e.gd;if(!G)return false;e.airK=0;
  // Kampf: Feinde in der Nähe → normales Kampfverhalten
  const foe=gwFoe(e,G.role==='patrol'?20:24);if(foe){e.tgt=foe;if(!e.cried||time-e.cried>12){e.cried=time;say(e,['Zu den Waffen!','Für die Stadt!','Haltet das Tor!'][(Math.random()*3)|0],2);}return false;}
  if(G.stop>0){G.stop-=dt;e.frame=0;return true;}
  const night=gwNight();
  if(G.role==='gate'||G.role==='tower'){if(Math.hypot(G.post[0]-e.x,G.post[1]-e.z)>1)gwGo(e,G.post[0],G.post[1],3,dt);else e.frame=0;return true;}
  // Streife
  if(night){const g=G.gate,px=g.x+g.tx*(G.slot?-2.5:2.5),pz=g.z+g.tz*(G.slot?-2.5:2.5);if(G.mode!=='night'){G.mode='night';gwPlan(e,px,pz);}
    if(G.pi<G.path.length){gwFollow(e,3.6,dt);}else e.frame=0;return true;}
  if(G.mode==='night'){G.mode='day';G.path=[];}
  if(G.lead){if(G.wait>0){G.wait-=dt;e.frame=0;return true;}if(!G.path.length||G.pi>=G.path.length){const S=gwSpots(),t=S[(Math.random()*S.length)|0];gwPlan(e,t[0],t[1]);G.wait=4+Math.random()*6;}
    else if(gwFollow(e,2.1,dt))G.path=[];
    // Kontrolle von Bürgern
    G.ck=(G.ck||0)-dt;if(G.ck<=0){G.ck=3;for(const c of BW.list){if(c.hidden||c.dead||c.bw.hold>0)continue;if(Math.hypot(c.x-e.x,c.z-e.z)<3.5&&Math.random()<.12){G.stop=5;c.bw.hold=5;say(e,GW_LINES.check[(Math.random()*3)|0],2.6);setTimeout(()=>{if(DEM.includes(c))say(c,GW_LINES.cit[(Math.random()*GW_LINES.cit.length)|0],2.6);},1600);const p=GW.list.find(o=>o.gd&&o.gd.leader===e);if(p)p.gd.stop=5;break;}}}
    // Kontrolle des Spielers
    if(state==='playing'&&time-GW.checkP>240&&Math.hypot(P.x-e.x,P.z-e.z)<3.4&&lookingAt(e.x,e.y+1.3,e.z,6,.2)){GW.checkP=time;G.stop=4.5;const p=GW.list.find(o=>o.gd&&o.gd.leader===e);if(p)p.gd.stop=4.5;e.flip=(P.x-e.x)<0;
      say(e,'Halt! Kontrolle. Zeig mir deine Gildenlizenz.',2.6);setTimeout(()=>{if(!DEM.includes(e))return;const F=twF();say(e,hasLic()?`Alles in Ordnung, ${GR_NAME[F.rank||0]}. Weitergehen.`:F.bad||F.warn?'Keine Lizenz, und dein Gesicht kenne ich von einem Steckbrief … Ich behalte dich im Auge.':'Keine Lizenz? Dann benimm dich, Fremder. Wir haben ein Auge auf dich.',3.2);},2000);}
    if(Math.random()<dt*.01&&Math.hypot(P.x-e.x,P.z-e.z)<12)say(e,GW_LINES.patrol[(Math.random()*GW_LINES.patrol.length)|0],2.6);return true;}
  // Partner folgt dem Anführer
  const L=G.leader;if(!L||L.dead||!DEM.includes(L)){G.lead=true;return true;}const dx=e.x-L.x,dz=e.z-L.z,d=Math.hypot(dx,dz);if(d>2.2){const tx=L.x+dx/d*1.8,tz=L.z+dz/d*1.8;gwGo(e,tx,tz,d>8?3.6:2.3,dt);}else e.frame=0;return true;}
// ---------- Nächtliche Angriffe auf die Tore ----------
function gwRaidAI(e,dt){if(e.tgt&&e.tgt!=='player'&&!e.tgt.dead&&Math.hypot(e.tgt.x-e.x,e.tgt.z-e.z)<26)return false;if(e.tgt==='player'&&Math.hypot(P.x-e.x,P.z-e.z)<20)return false;
  let b=null,bd=26;for(const o of GW.list){if(o.dead||!DEM.includes(o))continue;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o;}}if(b){e.tgt=b;return false;}entMove(e,e.home.x,e.home.z,e.d.spd,dt);return true;}
function gwTick(dt){if(!TWS.built)return;const night=gwNight();
  for(const B of GW.braz){B.f.visible=night;if(night&&Math.random()<dt*8&&Math.hypot(B.x-P.x,B.z-P.z)<70)spawnParticle(B.x+(Math.random()-.5)*.4,TWC.H+1.5,B.z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.2+Math.random(),(Math.random()-.5)*.3,Math.random()<.6?0xffa030:0xff6010,.9,.18);}
  GW.raid=GW.raid.filter(e=>DEM.includes(e)&&!e.dead);if(!night){for(const e of GW.raid)removeEnt(e);GW.raid=[];GW.raidT=150;return;}
  if(typeof isClient==='function'&&isClient())return;GW.raidT-=dt;if(GW.raidT>0||GW.raid.length)return;GW.raidT=180+Math.random()*120;
  if(twD(P.x,P.z)>TWC.WR+150||P.x>60000||DGX.on)return;if(Math.random()<.4)return;
  const gs=gwGates().sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)),g=gs[0],T=['zombie','usks','uska','uskb','zombie'],n=3+((Math.random()*3)|0);
  for(let i=0;i<n;i++){const t=T[(Math.random()*T.length)|0];if(!DT[t])continue;const x=g.out[0]+(Math.random()-.5)*8,z=g.out[1]+(Math.random()-.5)*8,e=spawnEnt(t,x,z,{home:{x:g.x,z:g.z},aggroT:30,cityRaid:1,always:true});e.msync=1;e.special=gwRaidAI;GW.raid.push(e);}
  if(Math.hypot(g.x-P.x,g.z-P.z)<120)toast('Glocken läuten: Untote greifen das Tor an!');try{Snd.chime();}catch(e){}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{gwTick(dt);}catch(e){if(!gwTick.err){gwTick.err=1;console.error('Wache',e);}}};}
{const a=twFree;twFree=function(){for(const e of GW.raid)removeEnt(e);GW.raid=[];GW.list=[];GW.braz=[];a();};}
// Mit Wachen reden: je nach Tageszeit
{const a=storyUse;storyUse=function(){if(state==='playing'&&TWS.built){for(const e of GW.list){if(e.dead||!DEM.includes(e))continue;if(Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.6,.82)){const L=gwNight()?GW_LINES.night:GW_LINES.patrol;say(e,L[(Math.random()*L.length)|0],3);return true;}}}return a();};}
