/* =========================================================
   0.0.117 · Ausbau der Dungeon-Stadt
   - Zuschauer in der Arena: volle Ränge, die jubeln, wenn gekämpft wird (mit Raunen der Menge)
   - Ein eigenes Haus in der Stadt: bei der Gilde kaufen, mit Bett (Rastplatz) und Truhe
   - Gildenaufträge: größere Aufgaben der Gilde für Silber, Erfahrung und Ruhm
   ========================================================= */
// =========================================================
// Zuschauer
// =========================================================
const CRW={list:[],tex:{},cheer:0,mood:0};
function crwTex(k){if(CRW.tex[k])return CRW.tex[k];const s=SPR[k];if(!s)return null;const t=new THREE.CanvasTexture(s.c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;
  return CRW.tex[k]=new THREE.SpriteMaterial({map:t,fog:true,transparent:true,alphaTest:.5});}
function crwBuild(){crwFree();const r=mulberry32(5150),looks=[0,1,2,3,4,5,6,7],seg=56;
  for(let k=0;k<seg;k++){const a=k/seg*6.283,a2=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a2+Math.PI/2)<.22||Math.abs(a2-Math.PI/2)<.24)continue;
    for(let t=0;t<5;t++){if(r()<.4)continue;const rr=AR.R0+1.5+t*3.2,top=2+t*2.4,n=1;
      for(let q=0;q<n;q++){const aa=a+(q-.5)*.04+(r()-.5)*.03,lk=looks[(r()*looks.length)|0],key='tc'+lk+'_'+(r()<.5?0:1),m=crwTex(key);if(!m)continue;const cv=SPR[key].c,fp=Math.max(10,cv.height-((cv.headBox&&cv.headBox[2])||10));
        const sp=new THREE.Sprite(m),hh=(2.2+r()*.3)*cv.height/fp;sp.scale.set(hh*cv.width/cv.height,hh,1);const x=AR.x+Math.cos(aa)*rr,z=AR.z+Math.sin(aa)*rr,y=TWC.H+top+hh*.5-.05;sp.position.set(x,y,z);
        sp.userData={y,ph:r()*6.283,sp:1.5+r()*2,amp:.04+r()*.05};scene.add(sp);CRW.list.push(sp);}}}}
function crwFree(){for(const s of CRW.list)scene.remove(s);CRW.list.length=0;}
function crwRoar(vol,dur){try{const c=Snd.ctx;if(!c||!Snd.noise)return;const t=c.currentTime,s=c.createBufferSource();s.buffer=Snd.noise;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=.6;
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.35);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(Snd.sfx);s.start(t);s.stop(t+dur+.1);}catch(e){}}
function crwTick(dt){const near=TWS.built&&P.x<60000&&!DGX.on&&Math.hypot(P.x-AR.x,P.z-AR.z)<220;if(near&&!CRW.list.length)crwBuild();else if(!near&&CRW.list.length)crwFree();if(!CRW.list.length)return;
  CRW.cheer=Math.max(0,CRW.cheer-dt);const fight=ARNA.on&&ARNA.closed,k=CRW.cheer>0?1:fight?.55:.08;CRW.mood+=(k-CRW.mood)*Math.min(1,dt*3);
  for(const s of CRW.list){const u=s.userData,j=Math.max(0,Math.sin(time*u.sp*(1+CRW.mood*1.6)+u.ph));s.position.y=u.y+j*(u.amp+CRW.mood*.35);}
  if(fight&&Math.random()<dt*.18)crwRoar(.05,1.4);}
// Jubel bei jeder Welle und beim Sieg
{const a=arWave;arWave=function(){a();CRW.cheer=2.5;crwRoar(.09,2.2);};}
{const a=arEnd;arEnd=function(win){a(win);if(win){CRW.cheer=6;crwRoar(.14,4);gqCount('arena');}else crwRoar(.05,1.5);};}
// =========================================================
// Das eigene Haus
// =========================================================
FLAGS.twHouse=FLAGS.twHouse||null;
const TWH_PRICE=900;// 3 Goldmünzen
const twhOwned=()=>!!(FLAGS.twHouse&&FLAGS.twHouse.own);
const TWHS={door:null,doorS:null,sign:null};
function twhBuild(){const M=twMats(),B=bMats(),g=TWS.grp,H=TWC.H,{x:X,z:Z,w,d,h}=TWH,th=.35;if(!g)return;
  const add=(geo,mat,x,y,z,ry,rx)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;if(rx)m.rotation.x=rx;g.add(m);return m;};
  const wall=(x,z,ww,dd,solid=true)=>{add(new THREE.BoxGeometry(ww,h,dd),M.white,x,H+h/2,z);if(solid)TWS.sol.push(solAdd({x,z,hw:ww/2,hd:dd/2,y0:H-2,y1:H+h,rot:0,solid:1,tw:1}));};
  wall(X,Z-d/2,w,th);wall(X-w/2,Z,th,d);wall(X+w/2,Z,th,d);const dw=1.8,sw=(w-dw)/2;wall(X-w/2+sw/2,Z+d/2,sw,th);wall(X+w/2-sw/2,Z+d/2,sw,th);
  add(new THREE.BoxGeometry(dw,h-2.6,th),M.white,X,H+2.6+(h-2.6)/2,Z+d/2);
  // Fachwerk
  for(const[x0,z0,ww,dd]of[[X,Z-d/2-.02,w+.1,.08],[X,Z+d/2+.02,w+.1,.08]]){add(new THREE.BoxGeometry(ww,.25,dd),M.wood,x0,H+.12,z0);add(new THREE.BoxGeometry(ww,.25,dd),M.wood,x0,H+h-.12,z0);}
  for(const sx of[-1,1])for(const sz of[-1,1])add(new THREE.BoxGeometry(.3,h,.3),M.wood,X+sx*w/2,H+h/2,Z+sz*d/2);
  // Boden und Dach
  const fl=add(new THREE.BoxGeometry(w-th,.06,d-th),B.wood,X,H+.04,Z);
  for(const s2 of[-1,1])add(new THREE.BoxGeometry(w+1,.3,Math.hypot(d/2+.5,2.4)),M.roof,X,H+h+1.15,Z+s2*(d/4),0,s2*.58);add(new THREE.BoxGeometry(w+1,.4,.4),M.roof,X,H+h+2.35,Z);
  for(const s2 of[-1,1]){const tri=new THREE.BufferGeometry(),hw=d/2;tri.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-hw,0,0,hw,0,2.4,0, 0,0,hw,0,0,-hw,0,2.4,0],3));tri.computeVertexNormals();add(tri,M.white,X+s2*w/2,H+h,Z);}
  // Fenster
  for(const wx of[-3,3])add(new THREE.BoxGeometry(1.4,1.1,.1),M.glow,X+wx,H+2.4,Z+d/2+.2);add(new THREE.BoxGeometry(.1,1.1,1.4),M.glow,X-w/2-.2,H+2.4,Z);add(new THREE.BoxGeometry(.1,1.1,1.4),M.glow,X+w/2+.2,H+2.4,Z);
  // Tür (zu, solange das Haus nicht dir gehört)
  const door=add(new THREE.BoxGeometry(dw,2.6,.14),B.wood,X,H+1.3,Z+d/2);TWHS.door=door;TWHS.doorS=solAdd({x:X,z:Z+d/2,hw:dw/2,hd:.2,y0:H-2,y1:H+2.6,rot:0,solid:1,tw:1});TWS.sol.push(TWHS.doorS);
  // Schild „Zu verkaufen“
  const sg=new THREE.Group();const post=new THREE.Mesh(new THREE.BoxGeometry(.15,1.6,.15),M.wood);post.position.y=.8;sg.add(post);const bd=new THREE.Mesh(new THREE.BoxGeometry(1.3,.7,.08),M.wood);bd.position.y=1.5;sg.add(bd);
  const txt=document.createElement('canvas');txt.width=64;txt.height=32;const c=txt.getContext('2d');c.fillStyle='#6a4a24';c.fillRect(0,0,64,32);c.fillStyle='#f0e0b0';c.font='bold 9px monospace';c.textAlign='center';c.fillText('ZU',32,13);c.fillText('VERKAUFEN',32,25);
  const tt=new THREE.CanvasTexture(txt);tt.magFilter=THREE.NearestFilter;const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.6),new THREE.MeshLambertMaterial({map:tt}));fr.position.set(0,1.5,.05);sg.add(fr);
  sg.position.set(X+2.6,H,Z+d/2+2.2);g.add(sg);TWHS.sign=sg;twhSync();}
function twhSync(){const own=twhOwned();if(TWHS.door){TWHS.door.rotation.y=own?-1.45:0;TWHS.door.position.x=TWH.x+(own?-.85:0);TWHS.door.position.z=TWH.z+TWH.d/2+(own?.85:0);}if(TWHS.doorS)TWHS.doorS.off=own;if(TWHS.sign)TWHS.sign.visible=!own;}
{const a=twBuild;twBuild=function(){a();try{twhBuild();}catch(e){console.error('Haus',e);}};}
function twhBuy(){if(twhOwned())return'Das Haus gehört doch schon dir.';if(!twF().reg)return'Häuser in der Stadt verkauft die Gilde nur an Mitglieder. Hol dir erst einen Gildenpass.';
  if(wallet()<TWH_PRICE)return`Das Haus kostet ${fmtMoney(TWH_PRICE)}. So viel hast du nicht dabei.`;setWallet(wallet()-TWH_PRICE);renderInv();FLAGS.twHouse={own:1};
  const X=TWH.x,Z=TWH.z;if(!FURN.some(f=>f.key==='twh_chest'))addFurn('chest',X+3.4,Z-2.9,'twh_chest');if(!FURN.some(f=>f.key==='twh_bed'))addFurn('bed',X-3.3,Z-2.4,'twh_bed');
  if(!FURN.some(f=>f.key==='twh_table')){addFurn('table',X+.5,Z-.5,'twh_table');addFurn('chair',X+.5,Z+.6,'twh_chair');}FLAGS.chests=FLAGS.chests||{};FLAGS.chests.twh_chest=FLAGS.chests.twh_chest||[];
  furnSave();renderFurn();twhSync();FLAGS.mapMarks=FLAGS.mapMarks||[];if(!FLAGS.mapMarks.some(m=>m.twh))FLAGS.mapMarks.push({x:X,z:Z,c:'#e0a040',n:'Dein Haus',twh:1});saveGame();try{Snd.chime();}catch(e){}
  return'Herzlichen Glückwunsch! Das Haus in der Turmgasse gehört jetzt dir. Bett und Truhe stehen schon drin. Schlaf dort, dann wachst du nach einer Niederlage in der Stadt auf.';}
const twhDoorNear=()=>TWS.built&&!DGX.on&&Math.hypot(P.x-TWH.x,P.z-(TWH.z+TWH.d/2+1))<2.6&&lookingAt(TWH.x,TWC.H+1.3,TWH.z+TWH.d/2,4,.6);
{const a=storyUse;storyUse=function(){if(state==='playing'&&!twhOwned()&&twhDoorNear()){toast(`Abgeschlossen. „Zu verkaufen. ${fmtMoney(TWH_PRICE)}. Bei der Gilde nachfragen.“`);return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(!twhOwned()&&twhDoorNear())return'Haus zu verkaufen';return a();};}
// =========================================================
// Gildenaufträge
// =========================================================
const GQ_KILL=[['skel','Skelette',10,16,2.2],['zombie','Zombies',8,12,2],['troll','Trolle',2,4,12],['kobold','Kobolde',10,15,1.6],['lich','Liche',1,3,22],['shark','Haie',2,3,14],['wolf','Wölfe',6,9,2.5],['bat','Fledermäuse',8,12,1.4]];
const GQ_FETCH=[['copper_ingot','Kupferbarren',6,10,3],['iron_ingot','Eisenbarren',5,8,4],['fur','Felle',6,10,2],['bones','Knochen',12,20,.8],['sharktooth','Haizähne',2,4,14],['pearl','Perlen',3,5,9],['batwing','Fledermausflügel',5,8,3],['seafish','Meeresfische',10,15,1.5]];
const GQ_SPEC=[['arena','Arenakämpfe gewinnen',1,2,40],['tower','Turmwächter besiegen',1,2,45]];
function gqToday(){const per=Math.floor((FLAGS.day||0)/2);let G=FLAGS.gq;if(G&&G.per===per)return G;const r=mulberry32(8800+per*53+(FLAGS.seed||1)),pick=L=>L[(r()*L.length)|0],list=[];
  const kinds=['kill','fetch',r()<.5?'spec':'kill'];for(const kind of kinds){let src,tries=0;do{src=pick(kind==='kill'?GQ_KILL:kind==='fetch'?GQ_FETCH:GQ_SPEC);tries++;}while(list.some(q=>q.id===src[0])&&tries<20);
    if(kind==='fetch'&&!ITEMS[src[0]])continue;const n=src[2]+Math.floor(r()*(src[3]-src[2]+1));
    list.push({kind,id:src[0],label:kind==='kill'?`Erlege ${n} ${src[1]}`:kind==='fetch'?`Liefere ${n} ${src[1]}`:`${n} ${src[1]}`,n,have:0,acc:false,done:false,silver:Math.round(n*src[4]),xp:Math.round(n*src[4]*9),fame:Math.max(2,Math.round(n*src[4]/4))});}
  if(G&&G.list)for(const q of G.list)if(q.acc&&!q.done&&!list.some(l=>l.id===q.id))list.unshift(q);
  return FLAGS.gq={per,list:list.slice(0,4)};}
function gqCount(id){const G=FLAGS.gq;if(!G)return;for(const q of G.list)if(q.acc&&!q.done&&q.kind!=='fetch'&&q.id===id&&q.have<q.n){q.have++;toast(`Gildenauftrag: ${q.label} (${q.have}/${q.n})${q.have>=q.n?' · fertig! Zurück zur Gilde.':''}`);}}
{const a=killEnt;killEnt=function(e,by){const was=!e.dead;a(e,by);if(was&&e.dead&&(by==='player'||!by)){let k=null;try{k=btyKind(e);}catch(_){}if(k)gqCount(k);if(e.twBoss)gqCount('tower');}};}
{const a=hurtAnimal;hurtAnimal=function(an,n){const was=an.alive;a(an,n);if(was&&!an.alive&&an.type==='wolf')gqCount('wolf');};}
{const a=seaKill;seaKill=function(c,by){const was=!c.dead;a(c,by);if(was&&by==='player'&&(c.S.k==='shark'||c.S.k==='megalodon'))gqCount('shark');};}
const twFame=()=>(twF().fame||0);
function gqNode(){const G=gqToday(),F=twF();const lines=G.list.map(q=>`• ${q.label}${q.done?' (erledigt)':q.acc?(q.kind==='fetch'?` (${Math.min(countItem(q.id),q.n)}/${q.n})`:` (${q.have}/${q.n})`):''} · ${fmtMoney(q.silver*10)}, ${q.fame} Ruhm`);
  const opts=[];for(const q of G.list){if(q.done)continue;if(!q.acc)opts.push({label:'Annehmen: '+q.label,act:()=>{q.acc=true;saveGame();return'Gut. Die Gilde zählt auf dich.';},go:'quests'});
    else{const ok=q.kind==='fetch'?countItem(q.id)>=q.n:q.have>=q.n;if(ok)opts.push({label:'Abgeben: '+q.label,act:()=>{if(q.kind==='fetch'){if(countItem(q.id)<q.n)return'Da fehlt noch etwas.';removeItem(q.id,q.n);}
      q.done=true;const mu=1+.1*(F.rank||0),sv=Math.round(q.silver*mu),xp=Math.round(q.xp*mu);addItem('silver',sv);gainXP(xp);F.fame=(F.fame||0)+q.fame;renderInv();saveGame();try{Snd.coin();}catch(e){}return`Hervorragend! ${sv} Silbertaler, ${xp} Erfahrung und ${q.fame} Ruhm. Dein Ruhm in der Gilde: ${F.fame}.`;},go:'quests'});}}
  opts.push({label:'Zurück.',go:'hello'});
  return{text:`Gildenaufträge (neue alle zwei Tage). Dein Ruhm: ${twFame()}.\n`+lines.join('\n'),opts};}
// Seraphine bekommt neue Gesprächspunkte
{const D=DIALOGS['Gildenmeisterin Seraphine'],h0=D.nodes.hello;
  D.nodes.hello=()=>{const n=h0(),F=twF();if(F.reg){const i=n.opts.findIndex(o=>o.go==='tower');const add=[{label:'Gildenaufträge ansehen.',go:'quests'},{label:twhOwned()?'Wie geht es meinem Haus?':`Das Haus in der Turmgasse kaufen (${fmtMoney(TWH_PRICE)})`,go:'house'}];n.opts.splice(i<0?0:i,0,...add);
      if(twFame())n.text=n.text.replace(/^Willkommen zurück, ([^.]+)\./,`Willkommen zurück, $1. Ruhm: ${twFame()}.`);}return n;};
  D.nodes.quests=gqNode;
  D.nodes.house=()=>twhOwned()?{text:'Dein Haus steht gut da. Die Wachen behalten es im Auge. Niemand rührt deine Truhe an.',opts:[{label:'Zurück.',go:'hello'}]}:
    {text:`Das Haus in der Turmgasse, gleich an der Hauptstraße, mit Blick auf den Turm. Zwei Zimmer, Bett und Truhe inklusive. ${fmtMoney(TWH_PRICE)}, und es gehört dir für immer.`,opts:[{label:'Ich kaufe es.',act:()=>twhBuy(),go:'hello2'},{label:'Vielleicht später.',go:'hello'}]};
  D.nodes.hello2=()=>({text:'',opts:[{label:'Danke.',go:'hello'}]});}
// =========================================================
// Takt, Aufräumen
// =========================================================
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{crwTick(dt);}catch(e){if(!crwTick.err){crwTick.err=1;console.error('Zuschauer',e);}}};}
{const a=twFree;twFree=function(){crwFree();TWHS.door=TWHS.doorS=TWHS.sign=null;a();};}
{const a=startGame;startGame=function(isNew,char){crwFree();return a(isNew,char);};}
