/* =========================================================
   0.0.112 · Haustiere und Kopfgeld-Brett
   - Wolf (mit Fleisch zähmen, kämpft mit), Katze (Streuner in Coda, mit Fisch zähmen, findet Sachen),
     Papagei (Dschungel, mit Beeren oder Bananen zähmen, fliegt mit, warnt vor Gefahr)
   - Rechtsklick auf dein Tier: Sitz / Folgen. Höchstens 4 Tiere.
   - Kopfgeld-Brett am Markt von Coda: jeden Tag 3 neue Aufträge mit Belohnung
   ========================================================= */
function petWolf(f){const p=new Px(34,22),G=pal(['#3a3a3e','#5a5a60','#7e7e84','#a4a4aa']),B=pal(['#c8c8cc','#e4e4e8']),a=f==='a',l1=f===1?2:0,l2=f===2?2:0;
  for(const[x,o]of[[9,l1],[12,-l2],[23,l2],[26,-l1]])mrLine(p,x,13,x+o*.5,20,2,(t,q)=>G[q?1:2]);
  mrEll(p,17,11,10,4.5,(x,y,dx,dy)=>dy>.45?B[0]:G[shadeIdx(.62-dy*.4,4,x,y)]);mrPoly(p,[[7,9],[1,5+(a?2:0)],[2,8],[7,12]],G[1]);
  const hx=a?29:27,hy=a?9:7;mrEll(p,hx,hy,4,3.4,G[2]);mrPoly(p,[[hx+2,hy],[hx+6,hy+1],[hx+2,hy+2]],G[3]);mrPoly(p,[[hx-2,hy-2],[hx-1,hy-6],[hx+1,hy-2]],G[1]);p.set(hx+1,hy-1,hex('#d8a020'));p.set(hx+6,hy+1,hex('#101010'));
  for(let x=13;x<21;x++)p.set(x,8,hex('#c83a2a'));outline(p);return p.done();}
function petCat(f,c){const p=new Px(18,13),C=pal(c===1?['#3a3a40','#5a5a64','#7a7a86']:['#7a3a10','#b0601a','#e08a30']),a=f==='a',l1=f===1?1:0,l2=f===2?1:0;
  for(const[x,o]of[[5,l1],[7,-l2],[12,l2],[14,-l1]])mrLine(p,x,8,x+o,12,1,C[1]);mrEll(p,9.5,7,5.5,2.6,(x,y,dx,dy)=>C[(x%3===0&&c!==1)?0:shadeIdx(.6-dy*.4,3,x,y)]);
  mrLine(p,4,6,1,2+(a?1:0),1,C[1]);const hx=a?15:14;mrEll(p,hx,5,2.6,2.3,C[2]);p.set(hx-1,2,C[1]);p.set(hx+1,2,C[1]);p.set(hx-1,1,C[1]);p.set(hx+1,1,C[1]);p.set(hx+1,4,hex('#40c040'));outline(p);return p.done();}
function petParrot(f){const p=new Px(16,16),R=pal(['#8a1010','#c82020','#f04040']),B=pal(['#1a3aa0','#3a6ae0']),Y=hex('#f0c020');
  mrEll(p,8,8,3,4.2,(x,y,dx,dy)=>R[shadeIdx(.65-dx*.3-dy*.2,3,x,y)]);mrEll(p,9,4,2.4,2.2,R[2]);p.set(10,3,hex('#ffffff'));p.set(10,4,hex('#101010'));p.set(12,4,hex('#2a2a2a'));p.set(11,5,hex('#3a3a3a'));
  if(f===1)mrPoly(p,[[6,7],[1,1],[3,8]],B[1]);else if(f===2)mrPoly(p,[[6,8],[1,13],[4,9]],B[1]);else mrPoly(p,[[6,7],[2,10],[7,11]],B[0]);mrPoly(p,[[7,11],[6,15],[9,12]],Y);mrLine(p,8,12,7,15,1,B[0]);outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const f of[0,1,2,'a']){list.push(['pwolf_'+f,petWolf(f)],['pcat_'+f,petCat(f,0)],['pcatg_'+f,petCat(f,1)]);}for(const f of[0,1,2])list.push(['pparrot_'+f,petParrot(f)]);}catch(e){console.error('Haustiere: Bilder',e);}};}
Object.assign(DT,{pet_wolf:{name:'Wolf',fac:'ally',h:1.1,hp:180,dmg:14,spd:6.6,reach:1.3,cd:1.1,wind:.25,spr:'pwolf_',aggro:14,leash:30,rad:.35,side:1},
  pet_cat:{name:'Katze',fac:'ally',h:.6,hp:60,dmg:3,spd:5.6,reach:.9,cd:1,wind:.2,spr:e=>e.grey?'pcatg_':'pcat_',aggro:.01,rad:.22,side:1},
  pet_parrot:{name:'Papagei',fac:'ally',h:.55,hp:40,dmg:2,spd:7.5,reach:.9,cd:1,wind:.2,spr:'pparrot_',aggro:.01,rad:.2,fly:1.9,side:1},
  stray_cat:{name:'Streunende Katze',fac:'neutral',h:.6,hp:30,dmg:0,spd:4,reach:.5,cd:2,spr:e=>e.grey?'pcatg_':'pcat_',aggro:.01,rad:.22,side:1},
  wild_parrot:{name:'Papagei',fac:'neutral',h:.55,hp:20,dmg:0,spd:6,reach:.5,cd:2,spr:'pparrot_',aggro:.01,rad:.2,fly:3.5,side:1}});
const PET={list:[],strays:[],parrots:[],spawned:false,t:0};const PET_NAMES={wolf:['Rex','Grauzahn','Luna','Wolke'],cat:['Mieze','Tiger','Krümel','Schatten'],parrot:['Polly','Kapitän','Rio','Kiki']};
function petSpawn(D,x,z){const e=spawnEnt('pet_'+D.t,x,z,{home:{x,z},pet:D,always:true,grey:D.grey,name:D.n});e.hp=Math.min(e.max,D.hp||e.max);e.special=petAI;e.onDeath=petDie;PET.list.push(e);return e;}
function petDie(e){const i=PET.list.indexOf(e);if(i>=0)PET.list.splice(i,1);FLAGS.pets2=(FLAGS.pets2||[]).filter(d=>d!==e.pet);toast(`${e.pet.n} ist gestorben …`);saveGame();}
function petAI(e,dt){const D=e.pet;if(P.x>60000&&!DGX.on){e.frame=0;return true;}if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+dt*1.5);D.hp=e.hp;
  const d=Math.hypot(P.x-e.x,P.z-e.z),i=PET.list.indexOf(e);
  if(d>45){e.x=P.x+Math.sin(P.yaw)*2.5+(i-1.5)*.8;e.z=P.z+Math.cos(P.yaw)*2.5;entGround(e);}
  if(D.sit){e.frame=0;return true;}
  if(D.t==='wolf'&&e.tgt&&e.tgt!=='player'&&!e.tgt.dead&&d<30)return false;
  if(D.t==='cat'){e.findT=(e.findT==null?120+Math.random()*120:e.findT)-dt;if(e.findT<=0&&state==='playing'&&P.x<60000){e.findT=120+Math.random()*150;const L=[['copper',5],['copper',8],['mushroom',1],['berries',3],['seafish',1],['silver',1],['feather',1],['stick',2]].filter(q=>ITEMS[q[0]]);const q=L[(Math.random()*L.length)|0];
      spawnDrop(q[0],q[1],e.x,e.y+.3,e.z);say(e,'Miau!',2);toast(`${D.n} hat etwas gefunden: ${ITEMS[q[0]].name}`);}}
  if(D.t==='parrot'){e.talkT=(e.talkT==null?40:e.talkT)-dt;if(e.talkT<=0){e.talkT=50+Math.random()*60;say(e,['Kraaa! Schatz! Schatz!','Polly will einen Keks!','Ahoi!','Hübsches Wetter!','Kraaa!'][(Math.random()*5)|0],2.4);}
    e.warnT=(e.warnT||0)-dt;if(e.warnT<=0){for(const o of DEM)if(o.fac==='demon'&&!o.dead&&!o.dormant&&Math.hypot(o.x-P.x,o.z-P.z)<22){say(e,'Gefahr! Gefahr!',2.2);e.warnT=25;break;}}}
  const tx=P.x+Math.sin(P.yaw+.9+i*.7)*(D.t==='parrot'?1.2:2.2),tz=P.z+Math.cos(P.yaw+.9+i*.7)*(D.t==='parrot'?1.2:2.2),dd=Math.hypot(tx-e.x,tz-e.z);
  if(dd>.8)entMove(e,tx,tz,e.d.spd*(dd>6?1.3:.75),dt);else{e.frame=0;e.flip=((P.x-e.x)*Math.cos(P.yaw)-(P.z-e.z)*Math.sin(P.yaw))<0;}return true;}
function petTame(t,x,z,grey){FLAGS.pets2=FLAGS.pets2||[];if(FLAGS.pets2.length>=4){toast('Du hast schon 4 Tiere. Mehr kannst du nicht versorgen.');return null;}
  const names=PET_NAMES[t],used=FLAGS.pets2.map(p=>p.n),n=names.find(q=>!used.includes(q))||names[0];const D={t,n,grey:grey?1:0};FLAGS.pets2.push(D);const e=petSpawn(D,x,z);
  for(let k=0;k<20;k++)spawnParticle(x,e.y+.6,z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,0xff6a8a,.8,.2);try{Snd.tame?Snd.tame():Snd.chime();}catch(_){}toast(`${n} gehört jetzt zu dir! Rechtsklick: Sitz / Folgen.`);saveGame();return e;}
// Zähmen und Befehle
function petLooked(){let best=null,bd=4.2;for(const e of PET.list.concat(PET.strays,PET.parrots)){if(e.dead||!DEM.includes(e))continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd&&lookingAt(e.x,e.y+e.h*.5,e.z,5,.85)){bd=d;best=e;}}return best;}
function wolfLooked(){for(const a of animals)if(a.alive&&a.type==='wolf'&&!a.tame&&Math.hypot(a.x-P.x,a.z-P.z)<4&&lookingAt(a.x,a.y+.6,a.z,5,.85))return a;return null;}
const heldId=()=>{const h=inv[HOT0+sel];return h?h.id:null;};
{const a=storyUse;storyUse=function(){if(state==='playing'){const e=petLooked();if(e){if(e.pet){e.pet.sit=!e.pet.sit;say(e,e.pet.sit?(e.pet.t==='cat'?'Miau.':e.pet.t==='parrot'?'Kraa. Sitz.':'Wuff.'):'!',1.5);toast(`${e.pet.n}: ${e.pet.sit?'Sitz':'Folgen'}`);return true;}
      const h=heldId(),food=e.type==='stray_cat'?['seafish','perch','trout','carp','pike']:['berries','banana'];if(!h||!food.includes(h)){toast(e.type==='stray_cat'?'Die Katze hätte gern einen Fisch.':'Der Papagei mag Beeren oder Bananen.');return true;}
      removeItem(h,1);renderInv();if(Math.random()<(e.type==='stray_cat'?.5:.4)){const x=e.x,z=e.z,g=e.grey;removeEnt(e);const L=e.type==='stray_cat'?PET.strays:PET.parrots;L.splice(L.indexOf(e),1);petTame(e.type==='stray_cat'?'cat':'parrot',x,z,g);}else{say(e,e.type==='stray_cat'?'Miau?':'Kraa?',1.5);toast('Es frisst, traut dir aber noch nicht ganz. Versuch es nochmal.');}return true;}
    const w=wolfLooked();if(w){const h=heldId();if(h!=='meat'&&h!=='roastmeat'){toast('Ein Wolf lässt sich nur mit Fleisch zähmen.');return true;}removeItem(h,1);renderInv();
      if(Math.random()<.35){const x=w.x,z=w.z;w.alive=false;w.corpse=null;try{if(w.wlFree===false&&typeof wlFreeAnimal==='function')wlFreeAnimal(w);else{w.y=-999;}}catch(_){}const hi=HOSTILES.indexOf(w);if(hi>=0)HOSTILES.splice(hi,1);petTame('wolf',x,z);}
      else{toast('Der Wolf schnappt das Fleisch und knurrt. Versuch es nochmal.');w.scared=0;}return true;}}
  return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000||DGX.on){const e=petLooked();if(e)return e.pet?`${e.pet.n}: ${e.pet.sit?'Folgen':'Sitz'}`:e.type==='stray_cat'?'Katze füttern (Fisch)':'Papagei füttern (Beeren, Banane)';if(wolfLooked())return'Wolf zähmen (Fleisch)';}return a();};}
// Streuner in Coda, Papageien im Dschungel
const JUNGLE=new Set(['wl_dschungel','jungle','jvillage','jruin']);
function petTick(dt){PET.t-=dt;if(PET.t>0)return;PET.t=2;if(state!=='playing')return;
  if(!PET.spawned&&P.x<60000){PET.spawned=true;for(const D of FLAGS.pets2||[])petSpawn(D,P.x+(Math.random()-.5)*3,P.z+(Math.random()-.5)*3);}
  PET.list=PET.list.filter(e=>!e.dead&&DEM.includes(e));
  const dc=Math.hypot(P.x-CODA.x,P.z-CODA.z);if(dc<150&&!PET.strays.length){for(let k=0;k<3;k++){for(let t=0;t<12;t++){const a=Math.random()*6.283,r=6+Math.random()*28,x=CODA.x+Math.cos(a)*r,z=CODA.z+Math.sin(a)*r;if(typeof c2Free==='function'&&!c2Free(x,z))continue;
      const e=spawnEnt('stray_cat',x,z,{home:{x,z},grey:Math.random()<.4,always:false});PET.strays.push(e);break;}}}
  if(dc>260&&PET.strays.length){for(const e of PET.strays)removeEnt(e);PET.strays.length=0;}
  let ar=null;try{ar=areaAt(P.x,P.z);}catch(e){}if(JUNGLE.has(ar)&&PET.parrots.length<3&&Math.random()<.3){const a=Math.random()*6.283,r=20+Math.random()*30,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;if(getHeight(x,z)>WATER+.3){const e=spawnEnt('wild_parrot',x,z,{home:{x,z}});e.special=parrotWild;PET.parrots.push(e);}}
  for(let i=PET.parrots.length-1;i>=0;i--){const e=PET.parrots[i];if(e.dead||Math.hypot(e.x-P.x,e.z-P.z)>120){removeEnt(e);PET.parrots.splice(i,1);}}}
function parrotWild(e,dt){e.ft=(e.ft||0)-dt;if(e.ft<=0){e.ft=2+Math.random()*3;const a=Math.random()*6.283;e.fx=e.home.x+Math.cos(a)*8;e.fz=e.home.z+Math.sin(a)*8;}entMove(e,e.fx,e.fz,3,dt);e.frame=1+(Math.floor(time*8)%2);return true;}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{petTick(dt);}catch(e){if(!petTick.err){petTick.err=1;console.error('Haustiere',e);}}};}
{const a=startGame;startGame=function(isNew,char){for(const e of PET.list.concat(PET.strays,PET.parrots))removeEnt(e);PET.list.length=0;PET.strays.length=0;PET.parrots.length=0;PET.spawned=false;return a(isNew,char);};}
// =========================================================
// Kopfgeld-Brett
// =========================================================
const BTY_KILL=[['zombie','Zombies',4,6,3],['skel','Skelette',5,7,3],['troll','Trolle',1,2,9],['kobold','Kobolde',5,8,2],['wolf','Wölfe',3,5,3],['shark','Haie',1,2,8],['lich','Liche',1,1,14],['bat','Fledermäuse',4,6,2]];
const BTY_FETCH=[['pearl','Perlen',2,3,8],['seafish','Meeresfische',5,8,1.5],['fiber','Fasern',10,15,.6],['stone','Steine',15,25,.4],['mushroom','Fliegenpilze',4,6,1.5],['batwing','Fledermausflügel',3,4,3],['glowgland','Leuchtdrüsen',2,3,5],['kelp','Seetang',6,10,.8]];
function btyKind(e){const t=e.type||'';if(t==='zombie')return'zombie';if(/^usk|^nskel|g_skelwar/.test(t))return'skel';if(t==='troll')return'troll';if(t==='kobold')return'kobold';if(/^lich|elderlich/.test(t))return'lich';if(t==='bat')return'bat';if(t==='wolfd')return'wolf';return null;}
function btyToday(){const day=FLAGS.day||0;let B=FLAGS.bty;if(B&&B.day===day)return B;const r=mulberry32(7000+day*31+(FLAGS.seed||1)),pick=L=>L[(r()*L.length)|0],list=[];
  for(let i=0;i<3;i++){const kill=i<2?r()<.65:r()<.3,src=kill?pick(BTY_KILL):pick(BTY_FETCH),n=src[2]+Math.floor(r()*(src[3]-src[2]+1));if(list.some(q=>q.id===src[0])){i--;continue;}
    list.push({kind:kill?'kill':'fetch',id:src[0],label:(kill?'Erlege ':'Bring ')+n+' '+src[1],n,have:0,acc:false,done:false,silver:Math.max(3,Math.round(n*src[4])),xp:Math.round(n*src[4]*6)});}
  return FLAGS.bty={day,list};}
function btyCount(kind){const B=FLAGS.bty;if(!B||B.day!==(FLAGS.day||0))return;for(const q of B.list)if(q.acc&&!q.done&&q.kind==='kill'&&q.id===kind&&q.have<q.n){q.have++;toast(`Kopfgeld: ${q.label.replace('Erlege ','')} (${q.have}/${q.n})${q.have>=q.n?' · fertig! Zurück zum Brett.':''}`);}}
{const a=killEnt;killEnt=function(e,by){const was=!e.dead;a(e,by);if(was&&e.dead&&(by==='player'||!by)){const k=btyKind(e);if(k)btyCount(k);}};}
{const a=hurtAnimal;hurtAnimal=function(an,n){const was=an.alive;a(an,n);if(was&&!an.alive&&an.type==='wolf')btyCount('wolf');};}
{const a=seaKill;seaKill=function(c,by){const was=!c.dead;a(c,by);if(was&&by==='player'&&(c.S.k==='shark'||c.S.k==='megalodon'))btyCount('shark');};}
const BOARD={name:'Kopfgeld-Brett',role:'Aufträge der Stadtwache',talk:0,x:0,z:0,y:0,h:2,d:{id:'board'}};
DIALOGS['Kopfgeld-Brett']={start:()=>'hello',nodes:{hello:()=>{const B=btyToday(),opts=[];
  for(const q of B.list){if(q.done)continue;if(!q.acc)opts.push({label:'Annehmen: '+q.label+` (${q.silver} Silber)`,act:()=>{q.acc=true;saveGame();return'Du nimmst den Zettel ab: „'+q.label+'“.';}});
    else if(q.kind==='kill'&&q.have>=q.n||q.kind==='fetch'&&countItem(q.id)>=q.n)opts.push({label:'Abgeben: '+q.label,act:()=>{if(q.kind==='fetch'){if(countItem(q.id)<q.n)return'Dir fehlt noch etwas.';removeItem(q.id,q.n);}
        q.done=true;addItem('silver',q.silver);gainXP(q.xp);try{Snd.coin?Snd.coin():Snd.pickup();}catch(_){}renderInv();saveGame();return`Auftrag erfüllt! ${q.silver} Silbertaler und ${q.xp} XP.`;}});}
  opts.push({label:'Weggehen.',go:null});
  const lines=B.list.map(q=>`• ${q.label}${q.done?' – erledigt':q.acc?q.kind==='kill'?` – ${q.have}/${q.n}`:` – du hast ${Math.min(countItem(q.id),q.n)}/${q.n}`:''}`).join('\n');
  return{text:'Aufträge für heute:\n'+lines+'\nMorgen hängen neue Zettel hier.',opts};}}};
let BRD=null;
function brdBuild(){if(BRD)return;let x=CODA.x+7,z=CODA.z+7;for(let t=0;t<80;t++){const a=t*.7,r=6+t*.25,qx=CODA.x+Math.cos(a)*r,qz=CODA.z+Math.sin(a)*r;if(typeof c2Free==='function'?c2Free(qx,qz)&&c2Free(qx+1,qz)&&c2Free(qx-1,qz):true){x=qx;z=qz;break;}}
  const g=new THREE.Group(),M=bMats(),y=getHeight(x,z);g.position.set(x,y,z);g.rotation.y=Math.atan2(CODA.x-x,CODA.z-z);
  for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.18,2.4,.18),M.wood);m.position.set(s*1.1,1.2,0);g.add(m);}
  const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.3,.1),M.wood);b.position.set(0,1.55,0);g.add(b);const rf=new THREE.Mesh(new THREE.BoxGeometry(2.8,.12,.6),M.roof);rf.position.set(0,2.42,0);g.add(rf);
  const paper=new THREE.MeshLambertMaterial({color:0xf0e8d0});for(let k=0;k<3;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.5,.62,.02),paper);m.position.set(-.7+k*.7,1.55+(k%2?.08:-.05),.07);m.rotation.z=(k-1)*.08;g.add(m);}
  scene.add(g);BRD={g,x,z,y};BOARD.x=x;BOARD.z=z;BOARD.y=y;addProp(x,z,.4);
  const cv=document.createElement('canvas');cv.width=cv.height=22;const c=cv.getContext('2d');c.fillStyle='#6a4626';c.fillRect(0,0,22,22);c.fillStyle='#f0e8d0';c.fillRect(4,4,6,8);c.fillRect(12,6,6,9);c.fillStyle='#8a2a1a';c.fillRect(5,6,4,1);c.fillRect(13,8,4,1);BOARD.portrait=cv;try{$('dlgText').style.whiteSpace='pre-line';}catch(e){}}
function brdLooked(){return BRD&&Math.hypot(BRD.x-P.x,BRD.z-P.z)<4&&lookingAt(BRD.x,BRD.y+1.5,BRD.z,5,.8);}
{const a=storyUse;storyUse=function(){if(state==='playing'&&P.x<60000&&brdLooked()){btyToday();openDialog(BOARD);return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000&&brdLooked())return'Kopfgeld-Brett lesen';return a();};}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);if(!BRD&&state==='playing'&&Math.hypot(P.x-CODA.x,P.z-CODA.z)<200)try{brdBuild();}catch(e){console.error('Kopfgeld-Brett',e);BRD={x:0,z:0,y:0};}};}
