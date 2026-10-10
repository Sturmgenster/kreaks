/* =========================================================
   Coda nach der Schlacht
   - Während der Schlacht verstecken sich die Bewohner in ihren Häusern
   - Wenn Shikaya abgeführt ist, ziehen die Helfer Stück für Stück ab
     (Wachen nach Norden, Froschleute nach Westen, Drachenmenschen in den Himmel,
     Abenteurer zurück in die Gilde, Dofra in die Schmiede, Corvin in die Kirche)
   - Und nach und nach kommen die Bewohner wieder aus ihren Häusern
   - Kreak führt den Käfigwagen an und wartet danach vor dem Tor von Sturmburg
   - Corvin, der Pfarrer, hat neue Worte für dich
   ========================================================= */
const CODA_L={on:false,t:0,vill:[],leave:[]};
function vDoor(v){const ax=v.ax!=null?v.ax:v.x,az=v.az!=null?v.az:v.z;let best=null,bd=1e9;
  for(const b of VB){if(!b.door)continue;const d=Math.hypot(b.door[0]-ax,b.door[1]-az);if(d<bd){bd=d;best=b;}}return best?[best.door[0],best.door[1]]:[ax,az];}
const codaVill=v=>!v.dead&&!v.inside&&v.z>PLAIN_END-5&&v.x<60000;
// Bewohner verstecken / wieder zeigen
{const a=updateVillagers;updateVillagers=function(dt){const hide=!!FLAGS.codaHide;
  for(const v of villagers){if(v.dead)continue;
    if(hide&&!v._hid&&!v._out&&codaVill(v)){if(!v._door)v._door=vDoor(v);if(v._sp0==null)v._sp0=v.speed;v.flee=0;v.talk=0;v.wait=0;v.tx=v._door[0];v.tz=v._door[1];v.speed=Math.max(v._sp0||1,3.2);
      if(Math.hypot(v.x-v._door[0],v.z-v._door[1])<1.5||Math.hypot(v.x-camera.position.x,v.z-camera.position.z)>SIM()){v._hid=true;v.x=v._door[0];v.z=v._door[1];}}
    if(v._hid){v.flee=0;v.wait=9;v.talk=0;if(!hide)vRelease(v,true);}
    if(!hide&&v._out)v._out=false;}
  a(dt);
  const off=villMesh.geometry.attributes.offset;let ch=false;villagers.forEach((v,i)=>{if(v._hid){off.array[i*3+1]=-999;v.y=-999;ch=true;}});if(ch)off.needsUpdate=true;};}
function vRelease(v,quiet){if(!v._hid)return;v._hid=false;v._out=true;if(v._sp0!=null){v.speed=v._sp0;v._sp0=null;}v.wait=1+Math.random()*2;v.y=getHeight(v.x,v.z);try{pickTarget(v);}catch(e){}
  if(!quiet){if(Math.hypot(v.x-P.x,v.z-P.z)<60){fxDust&&fxDust(v.x,v.z,10,.6,{spd:1.5,size:.35,life:1.2});Snd.gate&&Math.random()<.3&&Snd.click();}
    if(Math.random()<.45)setTimeout(()=>say(v,['Ist es … vorbei?','Die Sonne! Seht doch, die Sonne!','Wir leben noch!','Mama, sind die Monster weg?','Ich hab mich im Keller versteckt. Zwei Tage lang.','Danke! Danke euch allen!','Coda steht noch!','Ich hab gehört, sie haben sie in Ketten gelegt!'][(Math.random()*8)|0],3.5),400);}}
{const a=startFinale;startFinale=function(resume){FLAGS.codaHide=1;CODA_L.on=false;return a(resume);};}
// Rückkehr des Lebens
function codaReturnStart(){CODA_L.on=true;CODA_L.t=0;FLAGS.codaHide=1;
  const V=villagers.filter(v=>codaVill(v)||v._hid);for(const v of V)if(!v._hid&&!v._out&&codaVill(v)){v._door=v._door||vDoor(v);v._hid=true;v.x=v._door[0];v.z=v._door[1];}
  const names=new Set(['Dofra','Corvin']);
  CODA_L.vill=V.filter(v=>!names.has(v.name)).map(v=>({v,at:8+Math.random()*130})).sort((a,b)=>a.at-b.at);
  // Helfer: jeder bekommt eine Zeit, zu der er geht
  const L=DEM.filter(e=>e.fin&&!e.dead&&(e.fac==='ally')).concat((typeof mercEnts!=='undefined'?mercEnts:[]).filter(e=>e&&e.finHelp&&!e.dead));
  CODA_L.leave=L.map(e=>({e,at:4+Math.random()*120,go:false})).sort((a,b)=>a.at-b.at);
  for(const q of CODA_L.leave){const e=q.e;e.hidden=false;if(!e.merc)e.special=codaIdle;}
  // Dofra und Corvin: ohne Kampfhelfer direkt mit den anderen
  for(const n of names){const v=villagers.find(q=>q.name===n);if(!v)continue;const h=DEM.find(e=>e.type==='helperA'&&e.name===n);if(!h)CODA_L.vill.push({v,at:20+Math.random()*60});}
  CODA_L.vill.sort((a,b)=>a.at-b.at);}
function codaIdle(e,dt){e.tgt=null;e.idT=(e.idT||Math.random()*4)-dt;if(e.idT<=0){e.idT=3+Math.random()*6;e.ix=e.x+(Math.random()-.5)*6;e.iz=e.z+(Math.random()-.5)*6;}
  if(e.ix!=null&&Math.hypot(e.ix-e.x,e.iz-e.z)>.4)entMove(e,e.ix,e.iz,e.d.spd*.3,dt);else e.frame=0;if(e.type==='dragonA'&&e.flyOff>0)e.flyOff=Math.max(0,e.flyOff-dt*4);return true;}
function codaLeave(q){const e=q.e;q.go=true;
  const bye={guardA:['Zurück nach Sturmburg, Männer!','Gute Arbeit, alle zusammen.','Auf nach Hause!'],frogA:['Quaak! Bis bald, Coda!','Murgla wird stolz sein!','Zurück in den Sumpf!'],dragonA:['Lebt wohl, Erdgebundene!','Ruft, wenn ihr uns braucht!'],helperA:['So. Und jetzt erst mal ein Bier.','Zeit, nach Hause zu gehen.']}[e.type];
  if(Math.random()<.5&&bye)say(e,bye[(Math.random()*bye.length)|0],3);
  if(e.merc){const g=VB.find(b=>b.type==='guild');e.leaveTo=g&&g.door?g.door:[19,762];e.special=null;return;}
  if(e.type==='guardA')e.leaveTo=[pathX(560),556];
  else if(e.type==='frogA')e.leaveTo=[-112,700+(Math.random()-.5)*10];
  else if(e.type==='helperA'){const v=villagers.find(q=>q.name===e.name);e.leaveTo=v?(v._door||vDoor(v)):[e.x,e.z];e.leaveV=v;}
  else e.leaveTo=null;
  e.special=(e,dt)=>{e.tgt=null;
    if(e.type==='dragonA'){e.flyOff=(e.flyOff||0)+dt*7;if(e.flyOff>45){removeEnt(e);}return true;}
    const[tx,tz]=e.leaveTo;if(Math.hypot(tx-e.x,tz-e.z)<1.5){if(e.leaveV){const v=e.leaveV;v.x=e.x;v.z=e.z;vRelease(v);}removeEnt(e);return true;}
    entMove(e,tx,tz,e.d.spd*.75,dt);return true;};}
function codaTick(dt){if(!CODA_L.on||state!=='playing')return;CODA_L.t+=dt;
  for(const q of CODA_L.leave){if(q.go)continue;if(CODA_L.t>=q.at){if(q.e.merc){if(!q.e.dead)codaLeaveMerc(q);else q.go=true;}else if(DEM.includes(q.e))codaLeave(q);else q.go=true;}}
  for(const q of CODA_L.vill){if(q.done)continue;if(CODA_L.t>=q.at){q.done=true;vRelease(q.v);}}
  // Abenteurer gehen zum Gildenhaus und dann hinein
  for(const q of CODA_L.leave)if(q.go&&q.e.merc&&q.e.leaving){const e=q.e,[tx,tz]=e.leaveTo;if(Math.hypot(tx-e.x,tz-e.z)<1.6||CODA_L.t-q.at>60){e.leaving=false;e.finHelp=false;e.hired=false;e.mode='home';e.homeT=0;}}
  if(CODA_L.vill.every(q=>q.done)&&CODA_L.leave.every(q=>q.go&&(!DEM.includes(q.e)||q.e.merc))&&!DEM.some(e=>e.type==='helperA'||(e.fin&&e.fac==='ally'))){CODA_L.on=false;FLAGS.codaHide=0;for(const v of villagers)if(v._hid)vRelease(v,true);toast('In Coda kehrt das Leben zurück.');}}
function codaLeaveMerc(q){const e=q.e;q.go=true;e.leaving=true;const g=VB.find(b=>b.type==='guild');e.leaveTo=g&&g.door?g.door:[19,762];if(Math.random()<.5)say(e,'Die Gilde ruft. Bis zum nächsten Auftrag!',3);}
// Abenteurer auf dem Heimweg: zum Gildenhaus laufen statt zu verschwinden
{const a=mercStep;mercStep=function(e,dt){if(e.leaving&&e.leaveTo){e.hired=true;e.mode='fin';entMove(e,e.leaveTo[0],e.leaveTo[1],e.d.spd*.8,dt);return true;}return a(e,dt);};}
// Bis zu ihrer Zeit bleiben die Abenteurer in Coda (nicht sofort heim)
{const a=mercStep;mercStep=function(e,dt){if(e.finHelp&&!FIN.on&&CODA_L.on&&!e.leaving){e.hired=true;e.mode='fin';return codaIdle(e,dt);}return a(e,dt);};}
{const a=updateStory;updateStory=function(dt){a(dt);try{codaTick(dt);}catch(e){if(!codaTick.err){codaTick.err=1;console.error('Coda',e);}}};}
// Spielstand mitten in der Rückkehr geladen: Bewohner kommen nach und nach heraus
{const a=loadGame;loadGame=function(){const ok=a.apply(this,arguments);if(ok&&FLAGS.codaHide&&typeof mqAt==='function'&&mqAt('end'))setTimeout(()=>{try{codaReturnStart();}catch(e){}},500);return ok;};}

/* ---------- Kreak: führt den Wagen an, wartet dann vor Sturmburg ---------- */
const STURM_GATE=()=>[2,WALL_Z+14];
{const a=kreakStep;kreakStep=function(e,dt){
  if(FLAGS.kreakEscort){if(CART.on){e.hidden=false;entGround(e);return;}e.hidden=true;e.x=0;e.z=-9e5;return;}
  if(FLAGS.kreakAtSturm){const[gx,gz]=STURM_GATE();e.hidden=false;e.scene=false;const pd=Math.hypot(P.x-gx,P.z-gz);
    if(pd>10||Math.abs(P.x-e.x)>500){e.x=gx;e.z=gz;e.frame=0;entGround(e);return;}
    FLAGS.kreakAtSturm=0;say(e,'Da bist du ja. Sie sitzt jetzt im Kerker unter der Burg. Die Priester sagen, sie können ihr helfen. Vielleicht. Komm, lass uns weiterziehen.',6);a(e,dt);return;}
  a(e,dt);};}

/* ---------- Corvin, der Pfarrer ---------- */
{const D=DIALOGS.Corvin;if(D){const h=D.nodes.hello;D.nodes.hello=()=>{const n=h();if(typeof mqAt==='function'&&mqAt('end')){n.text=FLAGS.corvinAfter?'Willkommen zurück. Die Kirche steht dir immer offen.':'Du lebst! Den Göttern sei Dank. Komm herein, komm. Coda hat dir viel zu verdanken.';
      n.opts.unshift({label:'Es ist vorbei, Pfarrer.',go:'after1'},{label:'Was wird jetzt aus Shikaya?',go:'after2'},{label:'Könnt Ihr mich segnen?',go:'after3'});}return n;};
  Object.assign(D.nodes,{
    after1:()=>({text:'Ja. Ich habe die ganze Nacht im Keller der Kirche gesessen und gebetet, zusammen mit den Kindern. Als die Schreie aufhörten und das Licht kam, habe ich die Glocke geläutet. Zum ersten Mal seit Jahren. Hörst du? Sie läutet immer noch.',
      enter:()=>{FLAGS.corvinAfter=1;try{Snd.chime();}catch(e){}},opts:[{label:'Ihr habt die Legende damals aufgeschrieben.',go:'after4'},{label:'Zurück',go:'hello'}]}),
    after2:()=>({text:'(Corvin faltet die Hände.) Sie war einmal ein Mädchen aus Coda, weißt du. Shikaya. Bevor der Fluch sie fand. In Sturmburg gibt es Priester, die alte Schriften lesen können, ältere als unsere Kirche. Wenn jemand einen Fluch brechen kann, dann sie. Und Kreak wird nicht aufgeben, das weiß ich.',opts:[{label:'Ich hoffe, er findet einen Weg.',go:'hello'}]}),
    after3:()=>FLAGS.corvinBless?{text:'Du bist schon gesegnet, mein Kind. Mehr Segen verträgt kein Mensch. Geh, und lebe.',opts:[{label:'Danke, Corvin.',go:'hello'}]}:
      {text:'(Corvin legt dir die Hand auf die Stirn.) Möge das Licht über dich wachen, wie du über uns gewacht hast. Wohin dich deine Wege auch führen.',enter:()=>{FLAGS.corvinBless=1;const S=P.stats;S.hp=S.maxHp;S.st=S.maxSt;S.mp=S.maxMp;try{renderStats();gainXP(150);Snd.levelUp();}catch(e){}toast('Corvins Segen: Du bist voll geheilt (+150 Erfahrung).');},opts:[{label:'Danke, Corvin.',go:'hello'}]},
    after4:()=>({text:'Und jetzt schreibe ich sie neu. Mit einem besseren Ende. Keine Heldin, die verbrennt, kein Held, der vergisst. Sondern einen Bruder, der seine Schwester nicht aufgibt. Und einen Fremden, der beiden geholfen hat. Ich werde deinen Namen hineinschreiben.',opts:[{label:'Das ehrt mich.',go:'hello'}]})});}}
