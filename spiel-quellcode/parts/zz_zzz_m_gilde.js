/* =========================================================
   0.0.118 · Die Gilde der Dungeon-Stadt
   - Gildenränge: Anwärter (mit Gildenlizenz) → Mitglied → Bronze → Silber → Gold → Platin → Mythril → Adamantium
     → Gilden-Champion → Gildenmeister. Aufstieg über Ruhm, Champion und Gildenmeister über Prüfungen in der Arena.
   - Reisende Gildenabenteurer (Mitglied bis Platin) ziehen allein oder in Gruppen durch die Welt.
     Etwa 15 % sind Räuber: Sie lauern hinter Bäumen, kämpfen schlau, schlagen dich auf 10 % Leben und nehmen dein Geld.
     Wer friedliche Gildenmitglieder tötet und Zeugen entkommen lässt, wird gemeldet und vielleicht degradiert.
   - Die Arena wie ein Kolosseum: Falltüren im Boden, Gittertore in der Wand, Ehrenloge, Schaukämpfe mit Wetten,
     Gildenduelle, Champion-Prüfung und das Duell um den Titel des Gildenmeisters.
   ========================================================= */
// =========================================================
// Ränge
// =========================================================
const GR_NAME=['Anwärter','Mitglied','Bronze-Rang','Silber-Rang','Gold-Rang','Platin-Rang','Mythril-Rang','Adamantium-Rang','Gilden-Champion','Gildenmeister'];
const GR_SHORT=['Anwärter','Mitglied','Bronze','Silber','Gold','Platin','Mythril','Adamantium','Champion','Gildenmeister'];
const GR_FAME=[0,40,120,260,480,800,1250,1900,2800,4000];
ITEMS.guildlic={name:'Gildenlizenz',plural:'Gildenlizenzen'};
ITEM_DESC.guildlic='Ausweis der Gilde der Dungeon-Stadt. Wer sie dabei hat, darf Gildenaufträge annehmen und den Großen Turm betreten.';
{const a=craftSprites;craftSprites=function(list){a(list);try{const p=new Px(16,12),C=pal(['#6a4a1e','#c8a868','#e8d4a0','#f8ecc8']);for(let y=1;y<11;y++)for(let x=1;x<15;x++)p.set(x,y,C[y===1||x===1?3:y===10||x===14?0:2]);
  for(let y=3;y<9;y++)for(let x=3;x<7;x++)p.set(x,y,hex(y<5?'#3a3a48':'#5a5a68'));p.set(4,3,hex('#7af0ff'));p.set(5,3,hex('#7af0ff'));for(const y of[4,6,8])for(let x=8;x<13;x++)p.set(x,y,C[0]);p.set(12,9,hex('#b8901a'));p.set(11,9,hex('#b8901a'));outline(p);list.push(['guildlic',p.done()]);}catch(e){}};}
const hasLic=()=>countItem('guildlic')>0;
const grRank=()=>twF().rank||0;
const grName=r=>GR_NAME[r==null?grRank():r];
function grFame(n,why){const F=twF();if(!F.reg)return;F.fame=(F.fame||0)+n;if(why)toast(`+${n} Ruhm · ${why}`);}
function grCanRise(){const F=twF(),r=F.rank||0;if(!F.reg||r>=9)return false;if((F.fame||0)<GR_FAME[r+1])return false;if(r+1===8&&!F.champWin)return false;if(r+1===9&&!F.masterWin)return false;return true;}
function grDemote(){const F=twF();if(!F.reg){F.bad=(F.bad||0)+1;toast('Ein Gildenabenteurer ist entkommen. Die Gilde wird von deiner Tat erfahren.');return;}
  if(Math.random()<.3||(F.rank||0)===0){F.fame=Math.max(0,(F.fame||0)-60);F.warn=(F.warn||0)+1;toast('Ein Zeuge ist entkommen und hat dich bei der Gilde gemeldet. Du verlierst 60 Ruhm.');saveGame();return;}
  F.rank--;F.fame=Math.min(F.fame||0,GR_FAME[F.rank+1]-1);F.fame=Math.max(F.fame,GR_FAME[F.rank]);F.demoted=1;toast(`Ein Zeuge ist entkommen und hat dich gemeldet. Die Gilde degradiert dich zum ${GR_NAME[F.rank]}.`);try{Snd.thud();}catch(e){}saveGame();}
// Alte Spielstände: Pass → Lizenz, Turmebenen → Ruhm
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);try{const F=FLAGS.tower;if(F&&F.reg&&F.rank==null){F.rank=0;F.fame=(F.fame||0)+(F.max||0)*12;if(!countItem('guildlic'))addItem('guildlic',1);}}catch(e){}return r;};}
// =========================================================
// Gildenabenteurer: Aussehen
// =========================================================
const ADV_CLS={great:'melee',sword:'melee',axeshield:'tank',dagger:'rogue',bow:'ranged',xbow:'ranged',staff:'mage',staff2:'mage'};
const ADV_N=20,ADV_LOOK=[];
{const r=mulberry32(60606),pick=L=>L[(r()*L.length)|0];const W=['great','sword','axeshield','dagger','bow','xbow','staff','staff2'];
  for(let i=0;i<ADV_N;i++){const wpn=W[i%W.length],race=pick(['human','human','human','dwarf','elf','orc']),sex=r()<.45?'f':'m',cls=ADV_CLS[wpn];
    const cloth=cls==='tank'?'chain':cls==='mage'?'robe':cls==='rogue'?'leather':cls==='ranged'?'leather':pick(['chain','leather','tunic']);
    ADV_LOOK.push({wpn,cls,look:{race,sex,age:r()<.12?'old':'adult',skin:(r()*4)|0,hair:pick(['short','long','braid','bun','mohawk','wild','tuft','none']),hairColor:pick(['brown','black','blond','red','grey','white']),
      beard:sex==='m'&&r()<.5?pick(['short','long']):'none',cloth,clothColor:pick(cls==='rogue'?['black','grey','purple']:cls==='mage'?['purple','blue','cream','teal']:['red','blue','green','brown','ochre','grey','teal','black']),
      pants:pick(['brown','grey','black','blue']),eyes:pick(['blue','green','brown','gold'])}});}}
function advWeaponCv(k){if(k==='sword'){const p=new Px(5,20),B=pal(['#5a606a','#9aa2ae','#d8dee6']);for(let y=0;y<13;y++){p.set(1,y,B[0]);p.set(2,y,B[2]);p.set(3,y,B[1]);}for(let x=0;x<5;x++)p.set(x,13,hex('#c8a040'));for(let y=14;y<19;y++)p.set(2,y,hex('#5a3a1c'));p.set(2,19,hex('#c8a040'));return p.done();}
  if(k==='dagger'){const p=new Px(4,11),B=pal(['#5a606a','#9aa2ae','#e8eef6']);for(let y=0;y<6;y++){p.set(1,y,B[1]);p.set(2,y,B[2]);}for(let x=0;x<4;x++)p.set(x,6,hex('#8a6a30'));for(let y=7;y<11;y++)p.set(1,y,hex('#3a2414'));return p.done();}
  return drawMercWeapon(k);}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{
  const mk=(key,L,wpn)=>{const main=advWeaponCv(wpn==='axeshield'?'axeshield':wpn),sh=wpn==='axeshield'?drawMercWeapon('shield'):null,rh=wpn==='bow'||wpn==='xbow';
    const c=Object.assign(defaultChar(),L);if(!RACES[c.race])c.race='human';
    list.push([key+'0',mercHoldBoth(drawHero(c,0),main,rh?0:.25,sh,0)],[key+'1',mercHoldBoth(drawHero(c,1),main,rh?0:.25,sh,0)],[key+'2',mercHoldBoth(drawHero(c,2),main,rh?0:.25,sh,0)],
      [key+'a',mercHoldBoth(drawHero(c,0,false,'up','R'),main,rh?-1.3:-.7,sh,-.2)],[key+'c',mercHoldBoth(drawHero(c,0,false,'up','R'),main,rh?-1.5:0,sh,0)]);};
  ADV_LOOK.forEach((A,i)=>mk('gv'+i+'_',A.look,A.wpn));
  mk('gvS_',Object.assign({},TC_LOOK[9],{eyes:'gold'}),'staff2');}catch(e){console.error('Gilde: Bilder',e);}};}
ADV_LOOK.forEach((A,i)=>{DT['gv'+i]={name:'Abenteurer',fac:'neutral',hero:1,h:A.look.race==='dwarf'?1.55:A.look.race==='orc'?1.95:1.8,hp:200,dmg:10,spd:4.6,reach:A.cls==='tank'?1.8:1.7,cd:1,spr:'gv'+i+'_',rad:.35,aggro:.01};});
DT.gvS={name:'Gildenmeisterin Seraphine',fac:'neutral',hero:1,h:1.8,hp:2600,dmg:30,spd:5,reach:1.7,cd:1,spr:'gvS_',rad:.35,aggro:.01,boss:1};
const ADV_FN={m:['Garrik','Torben','Aldo','Bram','Kael','Rurik','Silas','Jorin','Wendel','Oskar','Falk','Ulf','Dorian','Hagen','Brok','Lenz','Mats','Corvin'],f:['Lyss','Maren','Ilka','Runa','Selma','Tilda','Yara','Nessa','Brigid','Elin','Frida','Kira','Svea','Odila','Mira','Thea','Wanda','Zora']};
const ADV_LN=['Eisenfaust','Rabenstein','Dornbusch','Hammerschlag','Grauwind','Silberklinge','Flinkfuß','Steinbrecher','Nachtschatten','Kupferkessel','Wolfsherz','Ährenfeld','Moorgrund','Funkenflug','Dunkelwasser'];
const ADV_GRP=['Die Eisenwölfe','Die Morgenklingen','Die Grauen Raben','Die Turmstürmer','Die Kupferkrallen','Die Sturmläufer','Die Letzte Fackel','Die Moorjäger'];
const ADV_LINES={melee:['Wir sind auf dem Weg zum nächsten Auftrag.','Hast du Trolle gesehen? Wir suchen welche.','Mein Schwert ist hungrig.'],tank:['Ich halte vorne, die anderen schießen. So einfach ist das.','Schöner Tag zum Wandern. Und zum Draufhauen.'],
  rogue:['Psst. Nicht so laut.','Wir haben da hinten was gefunden. Was, verrate ich nicht.'],ranged:['Der Wind steht gut zum Schießen.','Wir jagen Kopfgelder. Lohnt sich.'],mage:['Die Magie hier draußen ist… unruhig.','Bleib nicht zu lange im Dunkeln, Reisender.']};
const ADV_ROB=['Geld her, oder es tut weh!','Dein Beutel sieht schwer aus. Wir helfen tragen.','Keine Sorge, wir nehmen nur das Gold. Meistens.','Da ist er! Packt ihn!'];
// =========================================================
// Gruppen
// =========================================================
const ADV={parties:[],t:20,shots:[],geo:null,mat:null,bolt:null};
const advAlive=p=>p.members.filter(e=>!e.dead&&DEM.includes(e));
function advRankRoll(r){const v=r();return v<.3?1:v<.58?2:v<.8?3:v<.93?4:5;}
function advStats(e,rank){e.rank=rank;e.max=e.hp=Math.round((150+rank*70)*(e.cls==='tank'?1.4:e.cls==='mage'||e.cls==='ranged'?.8:1));e.dmg=(6+rank*3.5)*(e.cls==='tank'?.8:e.cls==='rogue'?.9:1);e.spd=4.4+(e.cls==='rogue'?.6:0)+rank*.08;e.cdBase=e.cls==='tank'?1.2:e.cls==='rogue'?.7:e.cls==='mage'?2.4:e.cls==='ranged'?1.6:1;}
function advMake(x,z,look,rank,o){const A=ADV_LOOK[look]||ADV_LOOK[0],type=look==='S'?'gvS':'gv'+look,e=spawnEnt(type,x,z,Object.assign({home:{x,z},talk:0,wander:false,always:true},o||{}));
  e.adv=1;e.cls=look==='S'?'mage':A.cls;const sx=look==='S'?'f':A.look.sex;e.advName=look==='S'?'Seraphine':ADV_FN[sx==='f'?'f':'m'][(Math.random()*18)|0]+' '+ADV_LN[(Math.random()*ADV_LN.length)|0];e.name=e.advName;
  advStats(e,rank);e.role=GR_NAME[rank]+' · Gildenabenteurer';e.atk=Math.random();e.rcd=Math.random()*2;e.cds={};e.special=advAI;e.onDeath=advDeath;return e;}
function advDeath(e){const p=e.party;if(p){p.killed=(p.killed||0)+1;if(p.fightP)p.fightP=true;}
  if(e.loot>0){let c=e.loot;const g=Math.floor(c/300);c-=g*300;const s=Math.floor(c/10);c-=s*10;if(g)spawnDrop('coin',g,e.x,e.y+.5,e.z);if(s)spawnDrop('silver',s,e.x,e.y+.5,e.z);if(c)spawnDrop('copper',c,e.x,e.y+.5,e.z);e.loot=0;}
  if(e.fac==='demon'&&!e.arena&&Math.random()<.5)spawnDrop('silver',1+e.rank*2,e.x,e.y+.5,e.z);}
function advSpot(x,z){for(let k=0;k<12;k++){const a=Math.random()*6.283,r=Math.random()*5,X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;if(getHeight(X,Z)>WATER+.5&&!inCore(X,Z))return[X,Z];}return null;}
function advSpawnParty(force){if(ADV.parties.length>=2)return;const r=Math.random,rob=force?force==='rob':r()<.15,size=r()<.25?1:r()<.55?2:r()<.8?3:4,mv=Math.hypot(P.vx||0,P.vz||0),fy=mv>.5?Math.atan2(P.vz,P.vx):Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw));
  let cx,cz,dest=null;if(rob){const d=45+r()*20,a=fy+(r()-.5)*.8;cx=P.x+Math.cos(a)*d;cz=P.z+Math.sin(a)*d;}
  else{const a=r()*6.283,d=85+r()*20;cx=P.x+Math.cos(a)*d;cz=P.z+Math.sin(a)*d;const off=(r()-.5)*30;dest=[P.x-Math.cos(a)*90-Math.sin(a)*off,P.z-Math.sin(a)*90+Math.cos(a)*off];}
  const c0=advSpot(cx,cz);if(!c0)return;if(twD(c0[0],c0[1])<TWC.WR+80)return;
  const rr=mulberry32((Date.now()&0xffff)+ADV.parties.length),baseRank=advRankRoll(rr),p={members:[],rob,state:rob?'ambush':'travel',dest,name:ADV_GRP[(r()*ADV_GRP.length)|0],killed:0,witness:false,t:0};
  const looks=[];for(let i=0;i<size;i++){let l;do{l=(r()*ADV_N)|0;}while(looks.includes(l)&&looks.length<ADV_N);looks.push(l);}
  for(let i=0;i<size;i++){const sp=advSpot(c0[0]+(r()-.5)*6,c0[1]+(r()-.5)*6)||c0,rank=Math.max(1,Math.min(5,baseRank+((r()*3)|0)-1)),e=advMake(sp[0],sp[1],looks[i],rank,rob?{fac:'demon'}:{});e.party=p;e.slot=i;p.members.push(e);}
  if(rob){for(const e of p.members){const c=advCover(e,P.x,P.z,10,30);if(c){e.x=c[0];e.z=c[1];}}}
  ADV.parties.push(p);}
function advAnger(p){if(!p||p.angry||p.rob)return;p.angry=true;p.witness=true;p.state='fight';for(const e of advAlive(p)){e.fac='demon';if(!HOSTILES.includes(e))HOSTILES.push(e);say(e,['Verrat!','Was soll das?!','Zu den Waffen!','Du wirst dafür bezahlen!'][(Math.random()*4)|0],2.5);}}
function advEnd(p,i){const alive=advAlive(p);if(p.witness&&p.killed>0&&(alive.length+(p.esc||0))>0)grDemote();
  if((p.rob||p.angry)&&p.fought&&alive.length===0&&!p.rewarded){p.rewarded=1;if(p.rob)grFame(4+p.members.length*2,'Räuberbande besiegt');}
  for(const e of alive)removeEnt(e);ADV.parties.splice(i,1);}
// Bäume als Deckung
function advTrees(x,z,R){const out=[];for(let dx=-R;dx<=R;dx+=GC)for(let dz=-R;dz<=R;dz+=GC){const l=tgrid.get(gk(x+dx,z+dz));if(!l)continue;for(const t of l)if(!t.furn&&(t.r||0)>.2&&Math.hypot(t.x-x,t.z-z)<R)out.push(t);}return out;}
function advCover(e,px,pz,dmin,dmax){let best=null,bs=1e9;for(const t of advTrees(e.x,e.z,16)){const dp=Math.hypot(t.x-px,t.z-pz);if(dp<dmin||dp>dmax)continue;const de=Math.hypot(t.x-e.x,t.z-e.z),sc=de+Math.abs(dp-(dmin+dmax)/2)*.5;
  if(sc<bs){bs=sc;const l=dp||1,k=(t.r||.4)+.75;best=[t.x+(t.x-px)/l*k,t.z+(t.z-pz)/l*k];}}return best;}
// =========================================================
// Treffer gegen den Spieler: Räuber töten nicht
// =========================================================
function advHitPlayer(e,dmg){if(state!=='playing'&&state!=='dialog')return;const p=e.party,soft=p&&(p.rob||p.nonlethal);if(!soft){takeDamage(dmg);}
  else{if(cheatOn())return;const S=P.stats,n=dmg*armorFactor(),floor=S.maxHp*.1;if(S.hp-n<=floor){S.hp=Math.min(S.hp,floor);P.lastDmg=time;renderStats();advKO(p);}else{S.hp-=n;P.lastDmg=time;renderStats();}}
  try{Snd.hit('sword');}catch(_){}const d=Math.hypot(P.x-e.x,P.z-e.z)||1;P.vx+=(P.x-e.x)/d*2.5;P.vz+=(P.z-e.z)/d*2.5;}
function advKO(p){if(p.nonlethal){if(p.onKO)p.onKO();return;}if(p.state==='leave')return;p.state='leave';const money=wallet();
  if(money>0){setWallet(0);renderInv();const al=advAlive(p);al.forEach(e=>e.loot=Math.floor(money/al.length));if(al[0])al[0].loot+=money-al.length*Math.floor(money/al.length);
    toast(`Du gehst zu Boden. Die Räuber nehmen dir ${fmtMoney(money)} ab und verschwinden.`);}else toast('Du gehst zu Boden. Die Räuber finden kein Geld bei dir und ziehen fluchend ab.');
  for(const e of advAlive(p))say(e,money>0?['Danke für die Spende!','War mir ein Vergnügen.','Bis zum nächsten Mal!'][(Math.random()*3)|0]:'Nichts?! Pah!',2.5);P.robbedT=time;saveGame();}
// =========================================================
// Kampfverhalten
// =========================================================
const advTPos=t=>t==='player'?[P.x,P.z]:[t.x,t.z];
function advFoes(e){const p=e.party;if(e.foes)return e.foes.filter(o=>o==='player'?state!=='dead':!o.dead&&DEM.includes(o));
  if(p&&(p.rob||p.angry||p.nonlethal)&&p.state!=='leave'&&p.state!=='flee')return state==='dead'?[]:['player'];
  const L=[];for(const o of DEM)if(o.fac==='demon'&&!o.adv&&!o.dead&&!o.dormant&&Math.hypot(o.x-e.x,o.z-e.z)<16)L.push(o);return L;}
function advNearest(e,L){let b=null,bd=1e9;for(const o of L){const[x,z]=advTPos(o),d=Math.hypot(x-e.x,z-e.z);if(d<bd){bd=d;b=o;}}return b;}
function advStrike(e,t){if(t==='player')advHitPlayer(e,e.dmg);else if(!t.dead)advHitEnt(e,t,e.dmg);}
function advHitEnt(e,t,dmg){hurtEnt(t,dmg,e.fac==='demon'?'demon':'ally');}
function advShoot(e,t,kind){const[tx,tz]=advTPos(t),ty=t==='player'?P.y+1.2:t.y+t.h*.55,sy=e.y+e.h*.62,dx=tx-e.x,dz=tz-e.z,dy=ty-sy,d=Math.hypot(dx,dy,dz)||1,sp=kind==='bolt'?16:26,err=e.cls==='ranged'?.04:.02;
  const vx=dx/d*sp+(Math.random()-.5)*sp*err,vy=dy/d*sp+(Math.random()-.5)*sp*err+(kind==='bolt'?0:3*d/sp),vz=dz/d*sp+(Math.random()-.5)*sp*err;
  if(!ADV.geo){ADV.geo=new THREE.BoxGeometry(.05,.05,.75);ADV.mat=new THREE.MeshLambertMaterial({color:0x6a4a2a});ADV.bolt=new THREE.MeshBasicMaterial({color:0x9a7aff});ADV.bgeo=new THREE.SphereGeometry(.18,8,6);}
  const m=new THREE.Mesh(kind==='bolt'?ADV.bgeo:ADV.geo,kind==='bolt'?ADV.bolt:ADV.mat);m.position.set(e.x,sy,e.z);scene.add(m);ADV.shots.push({m,x:e.x+dx/d*.6,y:sy,z:e.z+dz/d*.6,vx,vy,vz,t:0,src:e,tgt:t,kind,dmg:e.dmg*(kind==='bolt'?1.25:.9)});try{Snd.whoosh(kind==='bolt'?500:1100,.08);}catch(_){}}
function advShotsTick(dt){for(let i=ADV.shots.length-1;i>=0;i--){const s=ADV.shots[i];s.t+=dt;if(s.kind!=='bolt')s.vy-=6*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;s.m.position.set(s.x,s.y,s.z);s.m.lookAt(s.x+s.vx,s.y+s.vy,s.z+s.vz);
    if(s.kind==='bolt'&&Math.random()<.7)spawnParticle(s.x,s.y,s.z,0,0,0,0xb89aff,.35,.25);let hit=null;const src=s.src;
    if(s.tgt==='player'||(src.fac==='demon'&&!src.foes)){if(Math.hypot(P.x-s.x,P.z-s.z)<.7&&s.y>P.y-.2&&s.y<P.y+2)hit='player';}
    if(!hit)for(const o of src.foes||[])if(o!=='player'&&!o.dead&&Math.hypot(o.x-s.x,o.z-s.z)<.7&&s.y>o.y-.2&&s.y<o.y+o.h+.2){hit=o;break;}
    if(!hit&&s.tgt!=='player'&&s.tgt&&!s.tgt.dead&&!src.foes&&Math.hypot(s.tgt.x-s.x,s.tgt.z-s.z)<.8&&s.y>s.tgt.y-.2&&s.y<s.tgt.y+s.tgt.h+.2)hit=s.tgt;
    const g=groundAt(s.x,s.z,s.y+1);if(hit||s.t>3||s.y<g){if(hit){if(hit==='player')advHitPlayer(src,s.dmg);else advHitEnt(src,hit,s.dmg);}
      for(let k=0;k<(s.kind==='bolt'?14:4);k++)spawnParticle(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,s.kind==='bolt'?0xb89aff:0x8a6a3a,.5,.2);scene.remove(s.m);ADV.shots.splice(i,1);}}}
function advMoveTo(e,x,z,sp,dt){if(entMove(e,x,z,sp,dt)<.001&&e.frame!=='a'&&e.frame!=='c')e.frame=0;}
function advAI(e,dt){const p=e.party;e.atk-=dt;e.rcd-=dt;if(e.dodge>0){e.dodge-=dt;e.x+=e.dvx*dt;e.z+=e.dvz*dt;return true;}
  if(e.wind>0){e.wind-=dt;e.frame=e.cls==='ranged'||e.cls==='mage'?'c':'a';if(e.wind<=0){const t=e.wt;if(t&&(t==='player'||!t.dead)){const[tx,tz]=advTPos(t),d=Math.hypot(tx-e.x,tz-e.z);
      if(e.cls==='ranged')advShoot(e,t,'arrow');else if(e.cls==='mage'&&!e.healT)advShoot(e,t,'bolt');else if(e.healT){const h=e.healT;e.healT=null;if(!h.dead){h.hp=Math.min(h.max,h.hp+h.max*.28);for(let k=0;k<16;k++)spawnParticle(h.x+(Math.random()-.5),h.y+Math.random()*h.h,h.z+(Math.random()-.5),0,1.5,0,0x9affa0,.8,.2);}}
      else if(d<(e.d.reach||1.7)+.9)advStrike(e,t);}e.frame=0;}return true;}
  // Gruppe: Flucht, Abzug, Reise
  const mode=p?p.state:'idle';
  if(mode==='leave'||mode==='flee'||e.fleeing){const d=Math.hypot(e.x-P.x,e.z-P.z)||1;advMoveTo(e,e.x+(e.x-P.x)/d*10,e.z+(e.z-P.z)/d*10,e.spd*(mode==='leave'?.9:1.1),dt);if(d>60&&!e.arena){e.escaped=1;if(p)p.esc=(p.esc||0)+1;removeEnt(e);}return true;}
  let foes=advFoes(e);
  if(mode==='ambush'){const d=Math.hypot(P.x-e.x,P.z-e.z);if(d<24&&state==='playing'&&time-(P.robbedT||-999)>300){p.state='fight';p.fought=true;say(p.members.find(m=>!m.dead)||e,ADV_ROB[(Math.random()*ADV_ROB.length)|0],2.5);try{Snd.whistle?Snd.whistle():0;}catch(_){}}else{e.frame=0;return true;}}
  if(!foes.length){if(mode==='travel'&&p.dest){const L=p.members.find(m=>!m.dead)||e;if(L===e){const d=Math.hypot(p.dest[0]-e.x,p.dest[1]-e.z);if(Math.hypot(P.x-e.x,P.z-e.z)<5){e.frame=0;return true;}
        if(d<3){const a=Math.random()*6.283;p.dest=[e.x+Math.cos(a)*120,e.z+Math.sin(a)*120];}advMoveTo(e,p.dest[0],p.dest[1],e.spd*.48,dt);}
      else{const a=Math.atan2(p.dest[1]-L.z,p.dest[0]-L.x),bx=L.x-Math.cos(a)*(1.8*(e.slot%2+1))+Math.sin(a)*(e.slot%2?1.4:-1.4),bz=L.z-Math.sin(a)*(1.8*(e.slot%2+1))-Math.cos(a)*(e.slot%2?1.4:-1.4);
        if(Math.hypot(bx-e.x,bz-e.z)>.6)advMoveTo(e,bx,bz,e.spd*.6,dt);else e.frame=0;}return true;}
    if(e.home&&Math.hypot(e.home.x-e.x,e.home.z-e.z)>6)advMoveTo(e,e.home.x,e.home.z,e.spd*.4,dt);else{e.wt2=(e.wt2||0)-dt;if(e.wt2<=0){e.wt2=4+Math.random()*5;e.wx=e.home.x+(Math.random()-.5)*6;e.wz=e.home.z+(Math.random()-.5)*6;}advMoveTo(e,e.wx||e.x,e.wz||e.z,e.spd*.3,dt);}return true;}
  // Kampf
  const t=advNearest(e,foes),[tx,tz]=advTPos(t),dist=Math.hypot(tx-e.x,tz-e.z),reach=(e.d.reach||1.7)+(t==='player'?.2:(t.d.rad||.3));e.flip=(tx-e.x)*Math.cos(P.yaw)-(tz-e.z)*Math.sin(P.yaw)<0;
  // Moral: zu viele gefallen → Flucht
  if(p&&!e.arena&&p.members.length>=2&&p.killed>=Math.ceil(p.members.length/2)&&p.state!=='flee'){p.state='flee';for(const m of advAlive(p))say(m,['Rückzug!','Weg hier!','Das ist es nicht wert!'][(Math.random()*3)|0],2);return true;}
  if(!e.arena&&e.hp<e.max*.2&&e.cls==='rogue'&&!e.fleeing&&Math.random()<dt*.5){e.fleeing=true;say(e,'Ich bin raus!',2);return true;}
  // Ausweichen, wenn der Spieler zuschlägt
  if(t==='player'&&dist<3.2&&time-(P.atkT||-9)<.12&&!e.dodged&&Math.random()<(e.cls==='rogue'?.55:.22)){e.dodged=1;setTimeout(()=>{e.dodged=0;},600);const ax=e.x-P.x,az=e.z-P.z,l=Math.hypot(ax,az)||1,sd=Math.random()<.5?-1:1;e.dvx=(ax/l*.6-az/l*sd*.8)*7;e.dvz=(az/l*.6+ax/l*sd*.8)*7;e.dodge=.22;return true;}
  // Heiler
  if(e.cls==='mage'&&p&&e.rcd<=0){const hurt=advAlive(p).filter(m=>m.hp<m.max*.5).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(hurt&&Math.random()<.5){e.rcd=5;e.healT=hurt;e.wt=hurt;e.wind=.6;return true;}}
  if(e.cls==='ranged'||e.cls==='mage'){const want=e.cls==='mage'?10:12;if(dist<5){const l=dist||1;advMoveTo(e,e.x-(tx-e.x)/l*4,e.z-(tz-e.z)/l*4,e.spd*1.05,dt);return true;}
    e.covT=(e.covT||0)-dt;if(e.covT<=0&&!e.arena){e.covT=2.5+Math.random()*2;e.cov=t==='player'?advCover(e,tx,tz,want-3,want+6):null;}
    if(e.cov&&Math.hypot(e.cov[0]-e.x,e.cov[1]-e.z)>.5){advMoveTo(e,e.cov[0],e.cov[1],e.spd,dt);if(e.rcd>0)return true;}
    else if(!e.cov){const l=dist||1,sd=e.slot%2?1:-1;if(Math.abs(dist-want)>2)advMoveTo(e,tx-(tx-e.x)/l*want,tz-(tz-e.z)/l*want,e.spd,dt);else advMoveTo(e,e.x-(tz-e.z)/l*sd*2,e.z+(tx-e.x)/l*sd*2,e.spd*.5,dt);}
    if(e.rcd<=0&&dist<26){e.rcd=e.cdBase*(.8+Math.random()*.5);e.wt=t;e.wind=.45;}return true;}
  // Nahkampf: Tank direkt, Kämpfer umzingeln, Schurken fallen in den Rücken
  let gx=tx,gz=tz;if(dist>reach){if(e.cls==='rogue'&&t==='player'&&dist<9){gx=P.x+Math.sin(P.yaw)*1.6;gz=P.z+Math.cos(P.yaw)*1.6;}else if(e.cls==='melee'&&dist<7){const a=Math.atan2(e.z-tz,e.x-tx)+(e.slot%2?.5:-.5);gx=tx+Math.cos(a)*reach*.8;gz=tz+Math.sin(a)*reach*.8;}
    advMoveTo(e,gx,gz,e.spd*(dist>8?1.05:.9),dt);return true;}
  if(e.atk<=0){e.atk=e.cdBase*(.85+Math.random()*.35);e.wt=t;e.wind=e.cls==='tank'?.45:.3;if(e.cls==='rogue'){e.hitRun=1;}}else if(e.hitRun&&e.atk<e.cdBase*.6){e.hitRun=0;const l=dist||1;e.dvx=-(tx-e.x)/l*8;e.dvz=-(tz-e.z)/l*8;e.dodge=.25;}else e.frame=0;return true;}
// Friedliche angreifen → Gruppe wird feindselig
{const a=attack;attack=function(){if(state==='playing'&&time>=(P.atkReady||0)&&weaponOf()!=='bow'){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);
    for(const p of ADV.parties){if(p.rob||p.angry)continue;for(const e of advAlive(p)){const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d<2.6&&(dx*fx+dz*fz)/(d||1)>.5){advAnger(p);p.fought=true;break;}}}}a();};}
// Gespräche mit friedlichen Abenteurern
function advLooked(){for(const p of ADV.parties){if(p.rob||p.angry)continue;for(const e of advAlive(p))if(Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.6,.82))return e;}for(const e of ADV.city)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.6,.82))return e;return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&P.x<60000){const e=advLooked();if(e){const L=ADV_LINES[e.cls]||ADV_LINES.melee,p=e.party;
      const hi=[`Ich bin ${e.advName}, ${GR_NAME[e.rank]}.`,p&&p.members.length>1?`Wir sind ${p.name}.`:'',L[(Math.random()*L.length)|0]].filter(Boolean).join(' ');say(e,hi,4);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000){const e=advLooked();if(e)return'Mit '+e.advName+' reden';}return a();};}
// Gildenabenteurer in der Stadt
ADV.city=[];
{const a=twSpawnFolk;twSpawnFolk=function(){a();ADV.city=[];for(let i=0;i<7;i++){const x=GH.x-14+i*4.5+(Math.random()-.5)*2,z=GH.z+GH.d/2+9+Math.random()*6,e=advMake(x,z,(i*3+1)%ADV_N,1+(i%5),{always:false});e.party=null;ADV.city.push(e);TWS.ents.push(e);}};}
// =========================================================
// Takt
// =========================================================
function advPlDist(x,z){let d=Math.hypot(x-P.x,z-P.z);if(typeof isHostMP==='function'&&isHostMP())for(const R of REMOTE.values())if(time-R.seen<6)d=Math.min(d,Math.hypot(x-R.tx,z-R.tz));return d;}
function advTick(dt){advShotsTick(dt);ADV.t-=dt;
  for(let i=ADV.parties.length-1;i>=0;i--){const p=ADV.parties[i],al=advAlive(p);if(!al.length){advEnd(p,i);continue;}const d=Math.min(...al.map(e=>advPlDist(e.x,e.z)));
    if(d>140||P.x>60000||DGX.on||(p.state==='leave'&&d>60)){advEnd(p,i);continue;}if(p.state==='fight'&&(p.rob||p.angry))p.fought=true;}
  if(ADV.t>0)return;ADV.t=35+Math.random()*25;if(state!=='playing'||P.x>60000||DGX.on||(typeof SW!=='undefined'&&SW.on)||inCore(P.x,P.z)||twD(P.x,P.z)<TWC.WR+120||ARNA.on||EXH.on)return;if(Math.random()<.5)advSpawnParty();}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{advTick(dt);arxTick(dt);exhTick(dt);}catch(e){if(!advTick.err){advTick.err=1;console.error('Gilde',e);}}};}
{const a=startGame;startGame=function(isNew,char){for(const p of ADV.parties)for(const e of p.members)removeEnt(e);ADV.parties.length=0;for(const s of ADV.shots)scene.remove(s.m);ADV.shots.length=0;EXH.on=false;return a(isNew,char);};}
// =========================================================
// Kolosseum: Falltüren, Gittertore, Ehrenloge
// =========================================================
const ARX={traps:[],gates:[],loge:null,q:[]};
const ARX_TRAP=[[0,0],[13,-9],[-13,-9],[13,10],[-13,10],[0,18],[0,-16]];
const ARX_GATE=[0,Math.PI/4,3*Math.PI/4,Math.PI,-Math.PI/4,-3*Math.PI/4];
function arxBuild(){const g=TWS.grp,M=twMats(),H=TWC.H;ARX.traps=[];ARX.gates=[];if(!g)return;
  for(const[lx,lz]of ARX_TRAP){const x=AR.x+lx,z=AR.z+lz,hole=new THREE.Mesh(new THREE.BoxGeometry(2.6,.05,2.6),new THREE.MeshBasicMaterial({color:0x050403}));hole.position.set(x,H+.06,z);g.add(hole);
    const fr=new THREE.Mesh(new THREE.BoxGeometry(2.9,.1,2.9),M.wood);fr.position.set(x,H+.04,z);g.add(fr);const L=[];
    for(const sd of[-1,1]){const piv=new THREE.Group();piv.position.set(x+sd*1.3,H+.1,z);const leaf=new THREE.Mesh(new THREE.BoxGeometry(1.3,.08,2.6),M.wood);leaf.position.x=-sd*.65;piv.add(leaf);
      for(const k of[-.8,0,.8]){const b=new THREE.Mesh(new THREE.BoxGeometry(1.2,.1,.12),new THREE.MeshLambertMaterial({color:0x2a2a30}));b.position.set(-sd*.65,.03,k);piv.add(b);}g.add(piv);L.push([piv,sd]);}
    ARX.traps.push({x,z,L,open:0,want:0,t:0});}
  for(const a of ARX_GATE){const x=AR.x+Math.cos(a)*(AR.R0+.15),z=AR.z+Math.sin(a)*(AR.R0+.15),grp=new THREE.Group();grp.position.set(x,H,z);grp.rotation.y=-a+Math.PI/2;
    const dark=new THREE.Mesh(new THREE.BoxGeometry(3,2.5,.4),new THREE.MeshBasicMaterial({color:0x060504}));dark.position.set(0,1.25,.25);grp.add(dark);
    const arch=new THREE.Mesh(new THREE.BoxGeometry(3.6,.5,.7),M.wall);arch.position.set(0,2.6,0);grp.add(arch);for(const sd of[-1,1]){const pl=new THREE.Mesh(new THREE.BoxGeometry(.4,2.6,.7),M.wall);pl.position.set(sd*1.7,1.3,0);grp.add(pl);}
    const bars=new THREE.Group();for(let k=-1.2;k<=1.21;k+=.4){const b=new THREE.Mesh(new THREE.BoxGeometry(.09,2.5,.09),new THREE.MeshLambertMaterial({color:0x2a2a30}));b.position.set(k,1.25,-.05);bars.add(b);}
    for(const y of[.6,1.6]){const b=new THREE.Mesh(new THREE.BoxGeometry(2.6,.09,.09),new THREE.MeshLambertMaterial({color:0x2a2a30}));b.position.set(0,y,-.05);bars.add(b);}grp.add(bars);g.add(grp);
    ARX.gates.push({a,x,z,bars,open:0,want:0,t:0});}
  // Ehrenloge im Süden
  {const a=Math.PI/2,x=AR.x,z=AR.z+AR.R0+2.2,y=H+5;const deck=new THREE.Mesh(new THREE.BoxGeometry(9,.4,5),M.wood);deck.position.set(x,y-.2,z);g.add(deck);
    for(const sd of[-1,1]){const c=new THREE.Mesh(new THREE.BoxGeometry(.6,y-H,.6),M.wall);c.position.set(x+sd*4,H+(y-H)/2,z+2);g.add(c);const c2=c.clone();c2.position.z=z-2;g.add(c2);}
    const rail=new THREE.Mesh(new THREE.BoxGeometry(9,.7,.2),M.red);rail.position.set(x,y+.35,z-2.5);g.add(rail);for(const sd of[-1,1]){const r2=new THREE.Mesh(new THREE.BoxGeometry(.2,1,5),M.red);r2.position.set(x+sd*4.5,y+.5,z);g.add(r2);}
    const roof=new THREE.Mesh(new THREE.BoxGeometry(9.6,.25,5.6),M.red);roof.position.set(x,y+3.2,z);g.add(roof);for(const sd of[-1,1])for(const sz of[-1,1]){const p2=new THREE.Mesh(new THREE.BoxGeometry(.18,3.2,.18),M.gold);p2.position.set(x+sd*4.4,y+1.6,z+sz*2.4);g.add(p2);}
    const back=new THREE.Mesh(new THREE.BoxGeometry(9,3.2,.3),M.wall);back.position.set(x,y+1.6,z+2.6);g.add(back);
    TWS.sol.push(solAdd({x,z,hw:4.5,hd:2.5,y0:y-.5,y1:y,rot:0,walk:1,tw:1}));TWS.sol.push(solAdd({x,z:z-2.5,hw:4.5,hd:.15,y0:y,y1:y+1.1,rot:0,solid:1,tw:1}));
    for(const sd of[-1,1])TWS.sol.push(solAdd({x:x+sd*4.5,z,hw:.15,hd:2.5,y0:y,y1:y+1.1,rot:0,solid:1,tw:1}));TWS.sol.push(solAdd({x,z:z+2.6,hw:4.5,hd:.2,y0:y,y1:y+3,rot:0,solid:1,tw:1}));
    ARX.loge={x,z,y};}}
{const a=twBuild;twBuild=function(){a();try{arxBuild();}catch(e){console.error('Kolosseum',e);}};}
{const a=twFree;twFree=function(){ARX.traps=[];ARX.gates=[];ARX.loge=null;ARX.q=[];a();};}
function arxTick(dt){for(const T of ARX.traps){const tgt=T.want>0?1:0;T.open+=(tgt-T.open)*Math.min(1,dt*4);if(T.want>0)T.want-=dt;for(const[piv,sd]of T.L)piv.rotation.z=sd*T.open*1.45;}
  for(const G of ARX.gates){const tgt=G.want>0?1:0;G.open+=(tgt-G.open)*Math.min(1,dt*2.5);if(G.want>0)G.want-=dt;G.bars.position.y=G.open*2.4;}
  for(let i=ARX.q.length-1;i>=0;i--){const q=ARX.q[i],e=q.e;q.t+=dt;if(e.dead||!DEM.includes(e)){ARX.q.splice(i,1);continue;}
    if(q.kind==='trap'){e.rise=Math.min(1,Math.max(0,(q.t-.5)/1.3));if(q.t>1.9){e.rise=null;e.dormant=false;ARX.q.splice(i,1);}}
    else{if(q.t<1){e.dormant=true;}else{e.dormant=false;if(q.t<2.6)entMove(e,q.ix,q.iz,e.spd||e.d.spd||4,dt);else ARX.q.splice(i,1);}}}}
let arxN=0;
function arxEmerge(e){if(!ARX.traps.length){return;}const useTrap=arxN++%2===0;
  if(useTrap){const T=ARX.traps[(Math.random()*ARX.traps.length)|0];e.x=T.x+(Math.random()-.5)*.6;e.z=T.z+(Math.random()-.5)*.6;e.y=TWC.H;T.want=2.6;e.rise=0;e.dormant=true;e.showDormant=true;ARX.q.push({e,t:0,kind:'trap'});}
  else{const G=ARX.gates[(Math.random()*ARX.gates.length)|0],r=AR.R0-1.3;e.x=AR.x+Math.cos(G.a)*r;e.z=AR.z+Math.sin(G.a)*r;e.y=TWC.H;G.want=3.2;e.dormant=true;e.showDormant=true;ARX.q.push({e,t:0,kind:'gate',ix:AR.x+Math.cos(G.a)*(r-5),iz:AR.z+Math.sin(G.a)*(r-5)});}}
try{Snd.gate;}catch(e){}
// Eigene Kämpfe: Gegner kommen aus Falltüren und Toren
{const a=arWave;arWave=function(){const n0=ARNA.ents.length;a();const F=ARNA.fight;for(const e of ARNA.ents.slice(n0)){if(e.type&&/^gv/.test(e.type)){const look=e.type==='gvS'?'S':+e.type.slice(2);const x=e.x,z=e.z;removeEnt(e);const i=ARNA.ents.indexOf(e);
      const n=advMake(x,z,look,F.rank||3,{fac:'demon',arena:1});n.arena=1;n.party={members:[],nonlethal:true,state:'fight',onKO:arKO};n.party.members.push(n);if(look==='S'){n.max=n.hp=2600;n.dmg=28;n.advName='Gildenmeisterin Seraphine';}
      ARNA.ents[i]=n;arxEmerge(n);}else arxEmerge(e);}try{Snd.gate?Snd.gate():Snd.clank();}catch(_){}};}
function arKO(){if(!ARNA.on)return;ARNA.ko=true;arEnd(false);}
{const a=arEnd;arEnd=function(win){const F=ARNA.fight,ko=ARNA.ko;ARNA.ko=false;if(!win&&ko&&state!=='dead'){const st=state;state='dead';a(false);state=st;toast('Du gehst zu Boden. Der Kampf ist verloren, aber du lebst.');P.x=AR.x;P.z=AR.z-AR.R1-4;P.y=TWC.H+.1;}else a(win);
  if(win&&F){if(F.key==='duel')grFame(6+(F.rank||1)*2,'Gildenduell gewonnen');else if(F.key==='champ'){twF().champWin=1;grFame(50,'Champion-Prüfung bestanden');toast('Du hast die Champion-Prüfung bestanden! Sprich mit Seraphine.');}
    else if(F.key==='master'){twF().masterWin=1;grFame(100,'Seraphine besiegt');toast('Seraphine kniet nieder. „Die Gilde gehört dir.“ Sprich mit ihr.');}else grFame(2+ARENA_FIGHTS.indexOf(F)*2,'Arenasieg');}};}
// Neue Kampfarten
const AR_DUEL={key:'duel',n:'Gildenduell',d:'Gegen Gildenabenteurer deines Rangs',rew:40,xp:300,waves:[]},AR_CHAMP={key:'champ',n:'Champion-Prüfung',d:'Drei Wellen der besten Kämpfer der Gilde',rew:300,xp:2000,rank:5,waves:[]},
  AR_MASTER={key:'master',n:'Duell um den Titel',d:'Gegen Gildenmeisterin Seraphine',rew:600,xp:4000,rank:9,waves:[[['gvS',1]]]};
ARENA_FIGHTS.push(AR_DUEL,AR_CHAMP,AR_MASTER);
const advPickLooks=n=>{const L=[];while(L.length<n){const l=(Math.random()*ADV_N)|0;if(!L.includes(l))L.push(l);}return L;};
function arPrepDuel(){const r=Math.max(1,Math.min(5,grRank()||1)),L=advPickLooks(6);AR_DUEL.rank=r;AR_DUEL.rew=30+r*15;AR_DUEL.waves=[[['gv'+L[0],1]],[['gv'+L[1],1],['gv'+L[2],1]],[['gv'+L[3],1],['gv'+L[4],1],['gv'+L[5],1]]];}
function arPrepChamp(){const L=advPickLooks(9);AR_CHAMP.waves=[[['gv'+L[0],1],['gv'+L[1],1]],[['gv'+L[2],1],['gv'+L[3],1],['gv'+L[4],1]],[['gv'+L[5],1],['gv'+L[6],1],['gv'+L[7],1],['gv'+L[8],1]]];}
// =========================================================
// Schaukämpfe mit Wetten (aus der Ehrenloge)
// =========================================================
const EXH={on:false,teams:[[],[]],bet:null,t:0,names:['Rot','Blau'],end:0};
const EXH_BEAST=[['troll',1],['kobold',6],['troll',2],['dgboss',1],['zombie',6]];
function exhStart(bet){const L=ARX.loge;if(!L||ARNA.on||EXH.on)return'Gerade läuft schon ein Kampf.';if(bet&&wallet()<bet.amt)return'So viel Geld hast du nicht dabei.';if(bet){setWallet(wallet()-bet.amt);renderInv();}
  if(dlg)closeDialog();EXH.on=true;EXH.bet=bet;EXH.t=0;EXH.end=0;EXH.teams=[[],[]];P.x=L.x;P.z=L.z;P.y=L.y+.05;P.vx=P.vz=0;P.yaw=0;P.pitch=-.2;
  const kind=EXH.kind,looks=advPickLooks(6),mk=(team,look,rank)=>{const e=advMake(AR.x+(team?6:-6),AR.z,look,rank,{arena:1});e.arena=1;e.team=team;e.foes=EXH.teams[1-team];EXH.teams[team].push(e);arxEmerge(e);return e;};
  if(kind==='beast'){const n=3,B=EXH_BEAST[(Math.random()*EXH_BEAST.length)|0];for(let i=0;i<n;i++)mk(0,looks[i],1+((Math.random()*4)|0));
    for(let i=0;i<B[1];i++){if(!DT[B[0]])continue;const m=spawnEnt(B[0],AR.x,AR.z+5,{fac:'neutral',home:{x:AR.x,z:AR.z},always:true});m.team=1;m.foes=EXH.teams[0];m.special=exhBeastAI;if(m.d.boss)m.barShown=true;EXH.teams[1].push(m);arxEmerge(m);}
    EXH.names=['die Abenteurer','die Bestie'];}
  else{const n=kind==='duel'?1:kind==='team2'?2:3;for(let i=0;i<n;i++){mk(0,looks[i],1+((Math.random()*5)|0));mk(1,looks[3+i],1+((Math.random()*5)|0));}EXH.names=['Team Rot','Team Blau'];}
  for(const t of[0,1])for(const e of EXH.teams[t])e.foes=EXH.teams[1-t];
  const nm=t=>EXH.teams[t].map(e=>e.advName||e.d.name).slice(0,3).join(', ');
  setTimeout(()=>{showArea('Schaukampf!');toast(`${EXH.names[0]} (${nm(0)}) gegen ${EXH.names[1]} (${nm(1)})`);},400);CRW.cheer=3;crwRoar(.1,2.5);return null;}
function exhBeastAI(e,dt){const foes=e.foes.filter(o=>!o.dead&&DEM.includes(o));if(!foes.length){e.frame=0;return true;}e.atk-=dt;
  const t=advNearest(e,foes),d=Math.hypot(t.x-e.x,t.z-e.z),reach=e.d.reach+(t.d.rad||.3);if(e.wind>0){e.wind-=dt;e.frame='a';if(e.wind<=0&&d<reach+.7)hurtEnt(t,e.d.dmg,'demon');return true;}
  if(d>reach)entMove(e,t.x,t.z,e.d.spd,dt);else if(e.atk<=0){e.atk=e.d.cd*(.85+Math.random()*.3);e.wind=e.d.wind||.35;}else e.frame=0;return true;}
function exhTick(dt){if(!EXH.on)return;EXH.t+=dt;const alive=t=>EXH.teams[t].filter(e=>!e.dead&&DEM.includes(e)).length;if(EXH.end){EXH.end-=dt;if(EXH.end<=0){for(const T of EXH.teams)for(const e of T)if(DEM.includes(e)&&!e.dead)removeEnt(e);EXH.on=false;}return;}
  if(EXH.t<3)return;const a0=alive(0),a1=alive(1);if(a0&&a1&&EXH.t<240)return;const win=a0&&!a1?0:a1&&!a0?1:-1;
  CRW.cheer=6;crwRoar(.14,3.5);showArea(win<0?'Unentschieden!':`Sieg für ${EXH.names[win]}!`);
  const B=EXH.bet;if(B){if(win===B.team){const g=B.amt*2;addItem('silver',Math.floor(g/10));if(g%10)addItem('copper',g%10);renderInv();toast(`Deine Wette ging auf! Du gewinnst ${fmtMoney(g)}.`);try{Snd.coin();}catch(_){}}else if(win<0){addItem('silver',Math.floor(B.amt/10));renderInv();toast('Unentschieden. Du bekommst deinen Einsatz zurück.');}else toast('Deine Wette ist verloren.');}
  EXH.end=6;saveGame();}
const logeNear=()=>ARX.loge&&Math.hypot(P.x-ARX.loge.x,P.z-ARX.loge.z)<5&&P.y>ARX.loge.y-1;
{const a=storyUse;storyUse=function(){if(state==='playing'&&logeNear()){P.x=AR.x+6;P.z=AR.z-AR.R1-5;P.y=TWC.H+.1;toast('Du verlässt die Ehrenloge.');return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(logeNear())return'Ehrenloge verlassen';return a();};}
// =========================================================
// Arenameister Brutus
// =========================================================
DIALOGS['Arenameister Brutus']={start:()=>'hello',nodes:{
  hello:()=>{if(ARNA.on||EXH.on)return{text:'Der Kampf läuft! Zeig, was du kannst. Oder schau zu.',opts:[{label:'Weiter.',go:null}]};const F=twF(),r=F.rank||0,opts=[];
    ARENA_FIGHTS.slice(0,3).forEach((Fi,i)=>opts.push({label:`${Fi.n}: ${Fi.d} (${Fi.rew} Silber)`,act:()=>{arStart(i);return null;},go:null}));
    if(hasLic())opts.push({label:`Gildenduell: gegen Abenteurer deines Rangs (${30+Math.max(1,Math.min(5,r||1))*15} Silber)`,act:()=>{arPrepDuel();arStart(ARENA_FIGHTS.indexOf(AR_DUEL));return null;},go:null});
    if(hasLic()&&r===7&&(F.fame||0)>=GR_FAME[8]&&!F.champWin)opts.push({label:'Champion-Prüfung antreten',act:()=>{arPrepChamp();arStart(ARENA_FIGHTS.indexOf(AR_CHAMP));return null;},go:null});
    if(hasLic()&&r===8&&(F.fame||0)>=GR_FAME[9]&&!F.masterWin)opts.push({label:'Seraphine zum Duell um den Titel fordern',act:()=>{arStart(ARENA_FIGHTS.indexOf(AR_MASTER));return null;},go:null});
    opts.push({label:'Einen Schaukampf ansehen',go:'show'},{label:'Nicht heute.',go:null});
    return{text:'Willkommen im Kolosseum der Dungeon-Stadt! Die Gegner kommen aus den Falltüren im Boden und aus den Toren in der Wand. Wähle deinen Kampf, oder setz dich in die Ehrenloge und schau den Gildenabenteurern zu.',opts};},
  show:()=>({text:'Was willst du sehen? Und willst du wetten? Wer richtig tippt, bekommt das Doppelte.',opts:[
    {label:'Duell: Abenteurer gegen Abenteurer',act:()=>{EXH.kind='duel';return null;},go:'bet'},{label:'Zwei gegen zwei',act:()=>{EXH.kind='team2';return null;},go:'bet'},
    {label:'Drei gegen drei',act:()=>{EXH.kind='team3';return null;},go:'bet'},{label:'Abenteurer gegen eine gefangene Bestie aus dem Dungeon',act:()=>{EXH.kind='beast';return null;},go:'bet'},{label:'Zurück.',go:'hello'}]}),
  bet:()=>{const T=EXH.kind==='beast'?['die Abenteurer','die Bestie']:['Rot','Blau'];return{text:'Deine Wette?',opts:[{label:'Ohne Wette zuschauen',act:()=>exhStart(null),go:null},
    {label:`5 Silber auf ${T[0]}`,act:()=>exhStart({team:0,amt:50}),go:null},{label:`5 Silber auf ${T[1]}`,act:()=>exhStart({team:1,amt:50}),go:null},
    {label:`20 Silber auf ${T[0]}`,act:()=>exhStart({team:0,amt:200}),go:null},{label:`20 Silber auf ${T[1]}`,act:()=>exhStart({team:1,amt:200}),go:null},{label:'Zurück.',go:'show'}]};}}};
// =========================================================
// Gildenmeisterin Seraphine: Bewerbung, Lizenz, Ränge, Beförderung
// =========================================================
{const D=DIALOGS['Gildenmeisterin Seraphine'],N=D.nodes;
  N.hello=()=>{const F=twF();
    if(!F.reg)return{text:'Willkommen in der Gilde der Dungeon-Stadt. Hier herrscht kein König, hier herrscht der Turm. Wer bei uns etwas werden will, fängt als Anwärter an. Bewirb dich, dann bekommst du eine Gildenlizenz. Mit ihr darfst du Aufträge annehmen und den Turm betreten.'+(F.bad?' Allerdings… man erzählt sich, du hättest Gildenmitglieder getötet. Ich behalte dich im Auge.':''),
      opts:[{label:'Ich bewerbe mich. (10 Silbertaler)',act:()=>{if(wallet()<100)return'Zehn Silbertaler, nicht weniger.';setWallet(wallet()-100);F.reg=1;F.rank=0;F.fame=F.fame||0;addItem('guildlic',1);renderInv();saveGame();try{Snd.chime();}catch(e){}
        return'Willkommen, Anwärter! Hier ist deine Gildenlizenz. Trag sie immer bei dir. Erledige Aufträge, bezwinge Turmebenen, gewinne in der Arena, und du sammelst Ruhm. Mit genug Ruhm wirst du Mitglied, und danach geht es Rang um Rang nach oben.';},go:'hello'},
        {label:'Erzähl mir vom Turm.',go:'tower'},{label:'Was ist das für eine Stadt?',go:'city'},{label:'Leb wohl.',go:null}]};
    const r=F.rank||0,fame=F.fame||0;let txt=r===9?`Willkommen, Gildenmeister. Die Gilde gehört dir. Ich bin nur noch deine Beraterin.`:`Willkommen zurück. Du bist ${GR_NAME[r]}. Ruhm: ${fame}.`;
    if(r<9){const nx=GR_FAME[r+1];txt+=fame>=nx?(r+1===8&&!F.champWin?' Du hast genug Ruhm für den Champion. Besteh erst die Champion-Prüfung in der Arena.':r+1===9&&!F.masterWin?' Du hast genug Ruhm. Wenn du Gildenmeister werden willst, musst du mich in der Arena besiegen.':' Du kannst befördert werden!'):` Für den ${GR_NAME[r+1]} brauchst du ${nx} Ruhm.`;}
    if(F.demoted){txt+=' Und noch etwas: Man hat dich gemeldet. Du hast Gildenmitglieder getötet. Deshalb wurdest du degradiert.';F.demoted=0;}
    const opts=[];if(grCanRise())opts.push({label:`Um Beförderung bitten: ${GR_NAME[r+1]}`,act:()=>{F.rank=r+1;const b=(r+1)*25;addItem('silver',b);renderInv();saveGame();try{Snd.fanfare?Snd.fanfare():Snd.levelUp();}catch(e){}showArea(GR_NAME[F.rank]);
      return F.rank===9?'Ich trete zurück. Ab heute bist du Gildenmeister der Dungeon-Stadt. Möge der Turm vor dir zittern.':F.rank===8?'Gilden-Champion! Nur der Gildenmeister steht noch über dir. Die ganze Stadt kennt jetzt deinen Namen.':`Glückwunsch! Ab heute bist du ${GR_NAME[F.rank]}. Hier sind ${b} Silbertaler als Anerkennung.`;},go:'hello'});
    if(!hasLic())opts.push({label:'Ich habe meine Lizenz verloren. (Neue für 2 Silbertaler)',act:()=>{if(wallet()<20)return'Zwei Silbertaler. So viel muss sein.';setWallet(wallet()-20);addItem('guildlic',1);renderInv();saveGame();return'Hier, eine neue. Pass diesmal besser darauf auf.';},go:'hello'});
    if(F.max>F.paid)opts.push({label:`Turm-Belohnung abholen (${F.max-F.paid} neue ${F.max-F.paid===1?'Ebene':'Ebenen'})`,act:()=>{let s=0,xp=0,fm=0;for(let l=F.paid+1;l<=F.max;l++){s+=5+l*3;xp+=40+l*25;fm+=12*l;}F.paid=F.max;F.fame=(F.fame||0)+fm;addItem('silver',s);gainXP(xp);renderInv();saveGame();try{Snd.coin();}catch(e){}return`Gut gemacht! ${s} Silbertaler, ${xp} Erfahrung und ${fm} Ruhm.`;},go:'hello'});
    opts.push({label:'Gildenaufträge ansehen.',go:'quests'},{label:twhOwned()?'Wie geht es meinem Haus?':`Das Haus in der Turmgasse kaufen (${fmtMoney(TWH_PRICE)})`,go:'house'},{label:'Welche Ränge gibt es?',go:'ranks'},{label:'Erzähl mir vom Turm.',go:'tower'},{label:'Leb wohl.',go:null});
    return{text:txt,opts};};
  N.ranks=()=>({text:'Die Ränge der Gilde, mit dem Ruhm, den man dafür braucht:\n'+GR_NAME.map((n,i)=>`${i===grRank()?'▶ ':'• '}${n}${i?': '+GR_FAME[i]+' Ruhm':''}${i===8?' und die Champion-Prüfung':i===9?' und ein Sieg gegen mich':''}`).join('\n')+'\nRuhm gibt es für Gildenaufträge, Turmebenen, Arenasiege und besiegte Räuberbanden. Wer Gildenmitglieder tötet und gemeldet wird, kann degradiert werden.',opts:[{label:'Zurück.',go:'hello'}]});
  const q0=N.quests;N.quests=()=>hasLic()?q0():{text:'Ohne Gildenlizenz kann ich dir keine Aufträge geben.',opts:[{label:'Zurück.',go:'hello'}]};}
// Turmtor: nur mit Lizenz
{const D=DIALOGS['Das Turmtor'],h=D.nodes.hello;D.nodes.hello=()=>{if(!hasLic())return{text:'Zwei Turmwachen kreuzen ihre Hellebarden. „Ohne Gildenlizenz kein Zutritt. Bewirb dich bei Gildenmeisterin Seraphine im Gildenhaus.“',opts:[{label:'Verstanden.',go:null}]};return h();};}
// Aufträge: Lizenz muss dabei sein
{const a=gqCount;gqCount=function(id){if(!hasLic())return;a(id);};}
// Räuberbanden und Gildenabenteurer: Ruhm für besiegte Räuber im Auftrag zählt mit
HELP.push(['/abenteurer [räuber]','Gildenabenteurer in der Nähe erscheinen lassen (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/abenteurer\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/abenteurer geht nur im Cheat-Modus.','err');return;}const rob=/r(ä|ae)uber|rob/i.test(t);while(ADV.parties.length>=2){const p=ADV.parties.shift();p.members.forEach(e=>removeEnt(e));}const n0=ADV.parties.length;advSpawnParty(rob?'rob':'peace');
    conLog(ADV.parties.length>n0?(rob?'Eine Räuberbande lauert vor dir.':'Eine Gruppe Gildenabenteurer ist unterwegs.'):'Hier ist kein Platz (Wasser, Stadt oder Kerngebiet).',ADV.parties.length>n0?'ok':'err');closeConsole();return;}return a(raw);};}
