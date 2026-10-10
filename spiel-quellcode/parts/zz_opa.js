/* =========================================================
   OPA KNORZ: der leicht verrückte Alte am Spawn
   Er erklärt das „Tutorial“ (Bäume fällen, etwas herstellen), beobachtet alles,
   ruft einem hinterher, begrüßt einen nach dem Tod mit unnötigen Tipps.
   Stimme: assets/voice/opa/opa_NNN.mp3 (räumlich, kommt aus seiner Richtung).
   Fehlt eine Datei, steht der Satz nur als Sprechblase da.
   ========================================================= */
const OPA_L={
  1:'Halt! Halt! Bleib stehen! Endlich ein neues Gesicht!',
  2:'Ich bin Knorz. Der Knorz. Der Wächter des Anfangs! Na gut, keiner hat mich dazu ernannt. Aber ich bin trotzdem hier.',
  3:'Du siehst aus, als hättest du keine Ahnung. Perfekt! Ich habe nämlich ganz viel Ahnung.',
  4:'Ich erklär dir jetzt alles. Wirklich alles. Hör gut zu, ich sag das nur siebenmal.',
  5:'Siehst du die Bäume? Das sind Bäume. Die wollen gefällt werden. Das sagen sie mir nachts.',
  6:'Geh zu einem Baum und hau drauf! Nicht zu fest. Doch, ruhig fest.',
  7:'Na los, der Baum fällt nicht von alleine. Glaub mir, ich hab es versucht. Drei Jahre lang.',
  8:'Ich warte immer noch auf den Baum …',
  9:'Hast du Angst vor Bäumen? Musst du nicht. Meistens.',
  10:'Holz! Du hast Holz! Ich bin so stolz auf dich, ich muss mich setzen.',
  11:'Wunderbar! Der Baum hat kaum geschrien.',
  12:'Jetzt bauen wir was daraus! Drück C, dann kannst du Sachen herstellen. Oder war es D? Nein, C.',
  13:'Mach irgendwas. Egal was. Hauptsache, du hast es selbst gemacht.',
  14:'Du stellst ja immer noch nichts her. Ich werde nicht jünger, weißt du.',
  15:'Unglaublich! Ein Meisterwerk! Das hänge ich mir übers Bett. Ich hab kein Bett. Aber trotzdem.',
  16:'Damit hast du alles gelernt, was ich weiß. Also fast alles. Also das meiste. Also das hier.',
  17:'Mein Unterricht ist hiermit beendet. Die Rechnung schicke ich dir per Taube.',
  18:'Hey! Wo willst du hin? Ich bin noch nicht fertig!',
  19:'Komm zurück! Das Tutorial ist wichtig! Glaube ich!',
  20:'Du kannst nicht einfach gehen! Ich hab noch elf Sätze vorbereitet!',
  21:'Na schön! Geh doch! Ich rede einfach mit dem Baum weiter. Der hört wenigstens zu.',
  22:'Ha! Wusste ich es doch. Ohne mich kommt keiner weit.',
  23:'Hey, da bist du ja wieder!',
  24:'Gestorben, was? Passiert den Besten. Mir zum Beispiel. Viermal.',
  25:'Wo wir schon mal da sind: noch ein paar wichtige Tipps.',
  26:'Das ist Gras. Gras ist grün. Meistens.',
  27:'Wenn du nach vorne gehst, kommst du vorwärts. Wenn du rückwärts gehst … tja.',
  28:'Der Himmel ist oben. Merk dir das, das ist wichtig.',
  29:'Wenn es dunkel wird, ist Nacht. Wenn es hell wird, ist Tag. Das hab ich selbst rausgefunden.',
  30:'Wasser ist nass. Hab ich gestern geprüft. Ist immer noch nass.',
  31:'Pilze kann man essen. Manche nur einmal.',
  32:'Steine sind hart. Nicht reinbeißen. Vertrau mir.',
  33:'Wenn du springst, kommst du wieder runter. Jedes Mal. Ich hab es gezählt.',
  34:'Atmen nicht vergessen! Ein, aus, ein, aus. Sehr gut!',
  35:'Das da hinten ist ein Weg. Wege führen woanders hin. Deshalb heißen sie Wege.',
  36:'Bäume wachsen nach oben. Fast nie zur Seite.',
  37:'Wenn du müde bist, schlaf. Wenn du wach bist, nicht.',
  38:'Ui! Springen! Das kannst du schon! Wer hat dir das beigebracht? Ich. Ganz bestimmt ich.',
  39:'Hör auf zu hüpfen, mir wird schwindelig.',
  40:'Nicht so schnell! Meine Knie!',
  41:'Was schleichst du so? Ich seh dich doch!',
  42:'Ah, du guckst in deine Tasche. Ist da was Spannendes drin? Darf ich auch mal?',
  43:'Stehst du nur rum? Ich steh hier seit dreißig Jahren. Ist gar nicht so schlimm.',
  44:'Au! Hey! Ich bin doch kein Baum!',
  45:'Das war jetzt unnötig. Ich sag es deiner Mutter.',
  46:'Es wird dunkel. Nachts kommen die Wölfe. Und mein Rheuma.',
  47:'Oh, was hast du da aufgehoben? Darf ich es sehen? Nein? Gut.',
  48:'Nicht ins Wasser! Da wohnen Fische! Die sind gemein.',
  49:'Psst. Die Eichhörnchen planen was. Ich weiß es genau.',
  50:'Ich war früher Abenteurer. Bis ich hier stehen geblieben bin.',
  51:'Alle lachen über mich. Aber wer lacht zuletzt? … Meistens auch die anderen.',
  52:'Ich hab mal einen Drachen gesehen. Oder eine Ente. Es war sehr neblig.',
  53:'Weißt du, was das Geheimnis des Lebens ist? … Ich hab es vergessen. Es war gut.',
  54:'Mein Bart ist sechsundachtzig Jahre alt. Ich bin erst dreiundachtzig.',
  55:'Kreak? Nie gehört. Klingt wie ein Geräusch, das ein Stuhl macht.',
  56:'Hast du meinen Löffel gesehen? Ich such ihn seit dem Winter.',
  57:'Ich rede nicht mit mir selbst. Ich rede mit meinem Bart.',
  58:'Komm mich besuchen, wenn du berühmt bist! Ich bin hier. Immer. Ich geh nirgendwo hin.',
  59:'Die Leute in Coda nennen mich den verrückten Knorz. Dabei bin ich nur ein bisschen besonders.',
  60:'Ha! Ein Schmetterling! … Nein, nur ein Blatt.',
  61:'Tschüss! Vergiss nicht: Der Himmel ist oben!',
  62:'Und denk dran: Bäume hauen nicht zurück! Meistens.',
  63:'Hallo? Bist du eingeschlafen? Soll ich dir ein Lied singen? Lalalaaa …',
  64:'Weißt du, was ich an dir mag? Du hörst mir zu. Das macht sonst keiner.',
  65:'Rechts ist da, wo der Daumen links ist. Oder umgekehrt.',
  66:'Wenn du Hunger hast, iss was. Wenn nicht, dann nicht. Das ist das ganze Geheimnis.',
  67:'Hörst du das? … Ich auch nicht. Herrlich, oder?',
  68:'Ich hab heute schon mit drei Bäumen gesprochen. Einer hat geantwortet.',
  69:'Du hast da was im Gesicht. … Ach nein, das ist dein Gesicht.',
  70:'Feuer ist heiß. Ich weiß nicht, warum mir das keiner früher gesagt hat.'};
const OPA_TIPS=[26,27,28,29,30,31,32,33,34,35,36,37,65,66,70],OPA_IDLE=[49,50,51,52,53,54,55,56,57,58,59,60,63,64,67,68,69];
const OPA={e:null,q:[],cur:null,curEnd:0,gap:0,cd:{},aud:{},ev:{},home:null,left:0,wasG:true,still:0,lastInv:0,quiet:0,idleT:20};
const OPA_SHOUT=new Set([18,19,20,21,61,62,1]);
// ---------- Aussehen ----------
{const a=finaleSprites;finaleSprites=function(list){a(list);try{const L=Object.assign(defaultChar(),{race:'human',age:'old',skin:2,hair:'wild',hairColor:'white',beard:'long',cloth:'rags',clothColor:'brown',pants:'grey',eyes:'blue'});
  const hat=cv=>{if(!cv.headBox)return cv;const[h0,h1,t]=cv.headBox;return chOver(cv,x=>{for(let y=t-4;y<=t;y++){const w=y===t?3:Math.max(0,(y-(t-4))/2);for(let X=Math.round((h0+h1)/2-w-1);X<=Math.round((h0+h1)/2+w+1);X++)chPx(x,X+(t-y>2?1:0),y,y===t?'#3a2a18':'#5a4028');}chPx(x,((h0+h1)>>1)+2,t-5,'#e8c040');});};
  const cane=cv=>{const hr=cv.handR;if(!hr)return cv;return chOver(cv,x=>{for(let k=-2;k<cv.height-hr[1];k++)chPx(x,hr[0]+1,hr[1]+k,'#6a4420');chPx(x,hr[0],hr[1]-2,'#6a4420');chPx(x,hr[0]-1,hr[1]-2,'#6a4420');});};
  for(const[f,fr,pose]of[['0',0,null],['1',1,null],['2',2,null],['u',0,'up'],['p',0,'point']]){let cv=drawHero(L,fr,false,pose||undefined,'R');if(pose==='up')cv=iLongArm(cv);cv=hat(cv);if(!pose)cv=cane(cv);list.push(['opa_'+f,cv]);
    if(f==='0'||f==='u'||f==='p')for(const m of[1,2])list.push(['opa_'+f+(m===1?'m':'o'),opaMouth(cv,m)]);}}catch(e){console.error('Opa',e);}};}
// offener Mund im Bart: m=1 halb, m=2 weit
function opaMouth(cv,m){if(!cv.headBox)return cv;const[h0,h1,t,b]=cv.headBox,c=(h0+h1)>>1,y=b-3;return chOver(cv,x=>{
  chPx(x,c-1,y,'#2a120c');chPx(x,c,y,'#2a120c');chPx(x,c+1,y,'#2a120c');if(m>1){chPx(x,c-1,y+1,'#2a120c');chPx(x,c,y+1,'#8a2a20');chPx(x,c+1,y+1,'#2a120c');chPx(x,c,y+2,'#2a120c');}});}
DT.opa={name:'Opa Knorz',fac:'prop',h:1.72,hp:999,dmg:0,spd:1,reach:0,cd:9,hero:1,side:1,spr:()=>'opa_',rad:.35};
// ---------- Stimme (räumlich) ----------
function voiceVol(){return Math.pow((settings.voice==null?80:settings.voice)/100,1.2);}
function opaBus(){const c=Snd.ctx;if(!c)return null;if(!Snd.voice){Snd.voice=c.createGain();Snd.voice.connect(Snd.master||c.destination);}Snd.voice.gain.value=voiceVol();return Snd.voice;}
{const a=Snd.apply.bind(Snd);Snd.apply=function(){a();if(this.voice)this.voice.gain.value=voiceVol();};}
function opaFile(id){return 'assets/voice/opa/opa_'+String(id).padStart(3,'0')+'.mp3';}
function opaLoad(id){const A=OPA.aud;if(A[id]!==undefined)return A[id];A[id]=null;
  if(!Snd.ctx||location.protocol==='file:'){A[id]={el:true};return A[id];}
  fetch(opaFile(id)).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>Snd.ctx.decodeAudioData(b)).then(buf=>{A[id]={buf};}).catch(()=>{A[id]={el:true};});return null;}
function opaPlay(id){const A=opaLoad(id),e=OPA.e;if(!A)return 0;
  if(A.missing)return 0;
  if(A.buf){const c=Snd.ctx,bus=opaBus();if(!c||!bus)return 0;const src=c.createBufferSource();src.buffer=A.buf;const pn=c.createPanner();pn.panningModel='HRTF';pn.distanceModel='inverse';
    pn.refDistance=OPA_SHOUT.has(id)?14:3.5;pn.rolloffFactor=1.1;pn.maxDistance=200;src.connect(pn);pn.connect(bus);src.start();OPA.node={src,pn};src.onended=()=>{if(OPA.node&&OPA.node.src===src)OPA.node=null;};return A.buf.duration;}
  // Ohne Web-Audio-Zugriff (z. B. direkt aus dem Ordner geöffnet): normales Audio, Lautstärke nach Entfernung
  if(A.el){const el=new Audio(opaFile(id));el.volume=0;const N={el,shout:OPA_SHOUT.has(id)};const drop=()=>{A.missing=true;if(OPA.node===N)OPA.node=null;if(OPA.cur===id&&OPA.voiced&&time<OPA.curEnd){OPA.voiced=false;say(OPA.e,OPA_L[id],Math.max(2,OPA.curEnd-time));}};
    el.addEventListener('error',drop,{once:true});el.addEventListener('loadedmetadata',()=>{if(OPA.node===N&&isFinite(el.duration)){OPA.curEnd=Math.max(OPA.curEnd,time+el.duration+.35);const b=bubbles.find(b=>b.v===OPA.e);if(b)b.t=Math.max(b.t,el.duration+.2);}},{once:true});
    el.play().catch(drop);OPA.node=N;return -1;}
  return 0;}
const _opV=new THREE.Vector3();
function opaAudioTick(){const N=OPA.node,e=OPA.e;if(!N||!e)return;const hy=e.y+1.5;
  if(N.pn){const c=Snd.ctx,L=c.listener,cp=camera.position;camera.getWorldDirection(_opV);
    if(L.positionX){L.positionX.value=cp.x;L.positionY.value=cp.y;L.positionZ.value=cp.z;L.forwardX.value=_opV.x;L.forwardY.value=_opV.y;L.forwardZ.value=_opV.z;L.upX.value=0;L.upY.value=1;L.upZ.value=0;}else{L.setPosition(cp.x,cp.y,cp.z);L.setOrientation(_opV.x,_opV.y,_opV.z,0,1,0);}
    if(N.pn.positionX){N.pn.positionX.value=e.x;N.pn.positionY.value=hy;N.pn.positionZ.value=e.z;}else N.pn.setPosition(e.x,hy,e.z);}
  if(N.el){const d=Math.hypot(camera.position.x-e.x,camera.position.z-e.z),ref=N.shout?14:3.5;N.el.volume=clamp(voiceVol()*ref/Math.max(ref,d),0,1);if(N.el.ended)OPA.node=null;}}
function opaStop(){const N=OPA.node;if(!N)return;try{if(N.src)N.src.stop();if(N.el)N.el.pause();}catch(e){}OPA.node=null;}
// ---------- Sprechen ----------
function opaSay(ids,prio){if(!OPA.e)return;if(!Array.isArray(ids))ids=[ids];if(prio){opaStop();OPA.q=[];OPA.curEnd=0;}for(const id of ids){OPA.q.push(id);opaLoad(id);}}
function opaNext(){if(OPA.holdT&&time<OPA.holdT)return;const id0=OPA.q[0];if(id0!=null&&OPA_ENV[id0]&&OPA.aud[id0]===null&&!OPA.holdT){OPA.holdT=time+1.5;return;}OPA.holdT=0;const id=OPA.q.shift();if(OPA.node&&OPA.node.el&&OPA.node.el.error){const A=OPA.aud[OPA.cur];if(A)A.missing=true;}if(id==null)return;const txt=OPA_L[id];let dur=opaPlay(id);const EV=OPA_ENV[id],A=OPA.aud[id],voiced=!!(EV&&A&&!A.missing&&dur!==0);if(voiced)dur=EV.d;else if(dur<=0)dur=Math.max(2.6,txt.length*.068);OPA.talkId=id;OPA.talkT=time;OPA.voiced=voiced;
  OPA.cur=id;OPA.curEnd=time+dur+.35;if(!voiced)say(OPA.e,txt,dur+.2);OPA.quiet=0;}
function opaFree(){return!OPA.q.length&&time>=OPA.curEnd;}
function opaOnce(key,ids,cd){if(!opaFree())return false;const t=OPA.cd[key];if(t&&time<t)return false;OPA.cd[key]=time+(cd||9999);opaSay(ids);return true;}
const opaPick=L=>{const r=L.filter(i=>!OPA.used||!OPA.used.has(i));const P2=r.length?r:L;const id=P2[(Math.random()*P2.length)|0];(OPA.used=OPA.used||new Set()).add(id);if(OPA.used.size>40)OPA.used.clear();return id;};
// ---------- Ereignisse aus dem Spiel ----------
{const a=fellTree;fellTree=function(t,loot){const r=a.apply(this,arguments);if(OPA.home&&Math.hypot(P.x-OPA.home.x,P.z-OPA.home.z)<60)OPA.ev.tree=time;return r;};}
{const a=craft;craft=function(i){const before=JSON.stringify(inv);const r=a.apply(this,arguments);if(JSON.stringify(inv)!==before)OPA.ev.craft=time;return r;};}
{const a=playerDie;playerDie=function(){const was=state;const r=a.apply(this,arguments);if(was!=='dead'&&state==='dead'){OPA.died=time;opaStop();OPA.q=[];}return r;};}
{const a=hurtEnt;hurtEnt=function(e,n,by){if(e&&e===OPA.e){if(by==='player'){OPA.ev.hit=(OPA.ev.hit||0)+1;e.hurt=.15;}return;}return a.apply(this,arguments);};}
// ---------- Verhalten ----------
function opaSpawn(){const hx=SPAWN.x+3.5,hz=SPAWN.z-2.5;OPA.home={x:hx,z:hz};const e=spawnEnt('opa',hx,hz,{always:true,noHostile:true,nosave:true,name:'Opa Knorz'});e.special=opaAI;e.home={x:hx,z:hz};OPA.e=e;for(const k in OPA_ENV)opaLoad(+k);OPA.wx=hx;OPA.wz=hz;OPA.wt=0;}
function opaAI(e,dt){e.tgt=null;e.hp=e.max;const talking=time<OPA.curEnd,pd=Math.hypot(P.x-e.x,P.z-e.z),H=OPA.home;
  const face=()=>{const dx=P.x-e.x,dz=P.z-e.z;e.flip=(dx*Math.cos(P.yaw)-dz*Math.sin(P.yaw))<0;};
  if(talking){const g=Math.floor(time*1.3)%3,base=g===0?'u':g===1?'p':'0',EV=OPA_ENV[OPA.talkId];let lv;if(EV&&OPA.voiced){const k=Math.floor((time-OPA.talkT)*20);lv=+(EV.e[k]||0);}else lv=time<OPA.curEnd-.35?(Math.sin(time*17)>0?6:2):0;
    e.frame=base+(lv>=6?'o':lv>=3?'m':'');face();entGround(e);return true;}
  // beobachten: dem Spieler ein paar Schritte folgen, aber in der Nähe des Spawns bleiben
  let tx,tz;if(pd<16&&pd>4.5){const k=(pd-3.8)/pd;tx=e.x+(P.x-e.x)*k;tz=e.z+(P.z-e.z)*k;if(Math.hypot(tx-H.x,tz-H.z)>9){const a=Math.atan2(tz-H.z,tx-H.x);tx=H.x+Math.cos(a)*9;tz=H.z+Math.sin(a)*9;}}
  else if(pd<=4.5){e.frame=0;face();entGround(e);return true;}
  else{OPA.wt-=dt;if(OPA.wt<=0){OPA.wt=3+Math.random()*5;const a=Math.random()*6.283,r=Math.random()*6;OPA.wx=H.x+Math.cos(a)*r;OPA.wz=H.z+Math.sin(a)*r;}tx=OPA.wx;tz=OPA.wz;}
  if(entMove(e,tx,tz,pd<16?1.4:.8,dt)<.001)e.frame=0;entGround(e);return true;}
function opaTick(dt){if(state==='menu'||state==='loading')return;if(!OPA.e){if(typeof DT!=='undefined'&&SPR.opa_0)opaSpawn();else return;}
  const e=OPA.e;if(!DEM.includes(e)){DEM.push(e);}opaAudioTick();if(time>=OPA.curEnd&&OPA.q.length){if(OPA.node&&OPA.node.el&&OPA.node.el.readyState>=1&&!OPA.node.el.error&&!OPA.node.el.ended&&!OPA.node.el.paused&&time<OPA.curEnd+20){}else{OPA.node=null;opaNext();}}
  const F=FLAGS.opa||(FLAGS.opa={step:0});const H=OPA.home,d=Math.hypot(P.x-H.x,P.z-H.z),near=d<22;
  if(state==='inventory'&&near&&F.step>0)opaOnce('inv',42,240);
  if(state!=='playing'){OPA.wasG=true;return;}
  // nach dem Tod wieder am Spawn
  if(OPA.died&&time-OPA.died>4.2){if(d<26){if(!OPA.backT)OPA.backT=time+3;if(time>OPA.backT){OPA.died=0;OPA.backT=0;const n=[23,Math.random()<.6?24:25];const t1=opaPick(OPA_TIPS),t2=opaPick(OPA_TIPS),t3=opaPick(OPA_TIPS);opaSay(n.concat(n[1]===24?[25]:[],[t1,t2,t3]),true);}}else if(time-OPA.died>15){OPA.died=0;}}
  // erstes Treffen
  if(F.step===0&&near&&!(typeof IN!=='undefined'&&IN.on)&&time>3){F.step=1;OPA.nag=time+40;opaSay([1,2,3,4,5,6],true);return;}
  if(F.step===1){if(OPA.ev.tree){OPA.ev.tree=0;F.step=2;OPA.nag=time+45;opaSay([Math.random()<.5?10:11,12,13],true);}else if(near&&time>OPA.nag&&opaFree()){OPA.nag=time+32;opaSay(opaPick([7,8,9]));}}
  else if(F.step===2){if(OPA.ev.craft){OPA.ev.craft=0;F.step=3;opaSay([15,16,17],true);}else if(near&&time>OPA.nag&&opaFree()){OPA.nag=time+40;opaSay(14);}}
  else{OPA.ev.tree=0;OPA.ev.craft=0;}
  // Weggehen ohne zuzuhören
  if(F.step>=1&&F.step<3){if(d>28&&OPA.left<1){OPA.left=1;opaSay(18,true);}else if(d>45&&OPA.left<2){OPA.left=2;opaSay(Math.random()<.5?19:20,true);}else if(d>70&&OPA.left<3){OPA.left=3;opaSay(21,true);}
    else if(d<14&&OPA.left>0){const was=OPA.left;OPA.left=0;opaSay(22,true);}}
  else if(F.step>=3){if(d>30&&!OPA.bye){OPA.bye=1;opaSay(Math.random()<.5?61:62,true);}else if(d<16)OPA.bye=0;}
  if(!near){OPA.wasG=P.ground;return;}
  // Beobachtungen
  if(OPA.ev.hit){const n=OPA.ev.hit;OPA.ev.hit=0;opaSay(n>1||OPA.hitOnce?45:44,true);OPA.hitOnce=1;}
  const jumped=OPA.wasG&&!P.ground&&P.vy>2;OPA.wasG=P.ground;
  if(jumped){OPA.jumps=(OPA.jumps||0)+1;if(OPA.jumps===1)opaOnce('j1',38,9999);else if(OPA.jumps>4)opaOnce('j2',39,90);}
  const mv=Math.hypot(P.vx||0,P.vz||0);if(mv>.3)OPA.still=0;else OPA.still+=dt;
  if(down('sprint')&&mv>4)opaOnce('run',40,120);if(down('sneak')&&mv>.3)opaOnce('sneak',41,150);
  if(OPA.still>25)opaOnce('still',43,200);
  if(FLAGS.clock>=20*60&&FLAGS.clock<20*60+40)opaOnce('night',46,600);
  if(typeof swimWater==='function'&&P.y<WATER+.1&&swimWater(P.x,P.z))opaOnce('water',48,300);
  const cnt=inv.reduce((s,q)=>s+(q?q.n||1:0),0);if(OPA.lastInv&&cnt>OPA.lastInv&&time-(OPA.ev.lt||0)>2&&!(OPA.ev.tree)&&F.step>=1)opaOnce('pick',47,180);OPA.lastInv=cnt;
  // Geschwätz, wenn man in der Nähe bleibt
  if(opaFree()){OPA.quiet+=dt;if(d<14&&OPA.quiet>OPA.idleT){OPA.idleT=18+Math.random()*20;opaSay(opaPick(Math.random()<.45?OPA_TIPS:OPA_IDLE));}}}
{const a=updateVillagers;updateVillagers=function(dt){a(dt);try{opaTick(dt);}catch(err){console.error('Opa',err);}};}
{const a=fellTree;fellTree=function(){OPA.ev.lt=time;return a.apply(this,arguments);};}
// ---------- Alle machen sich über ihn lustig ----------
try{LINES.adult.push('Warst du schon beim alten Knorz im Wald? Der erklärt einem, dass Gras grün ist.','Der verrückte Knorz hat mir mal drei Stunden lang erklärt, wie man geht. Ich konnte es vorher schon.','Wenn du Knorz siehst: einfach nicken und weitergehen. Das machen alle so.');
  LINES.kid.push('Der Opa im Wald redet mit Bäumen! Hihi!','Knorz hat gesagt, der Himmel ist oben. Das wusste ich schon!');
  if(LINES.elder)LINES.elder.push('Knorz war früher mal ganz vernünftig. Ungefähr einen Nachmittag lang.');
  if(typeof GUARD_LINES!=='undefined')GUARD_LINES.push('Wir haben eine Wette laufen, wie lange Knorz noch am Waldrand rumsteht. Ich sage: für immer.');}catch(e){}
// ---------- Regler: Stimmen ----------
{const lab=document.createElement('label');lab.className='row';lab.htmlFor='sVoice';lab.innerHTML='<span>Stimmen</span><input type="range" id="sVoice" min="0" max="100" step="1"><output id="oVoice"></output>';
  const mus=$('sMusic');if(mus&&mus.closest('label'))mus.closest('label').after(lab);
  if(settings.voice==null)settings.voice=80;sliders.push(['sVoice','oVoice','voice',v=>v+'%']);
  $('sVoice').addEventListener('input',e=>{settings.voice=+e.target.value;$('oVoice').textContent=settings.voice+'%';applySettings();});
  $('sVoice').value=settings.voice;$('oVoice').textContent=settings.voice+'%';}
// Spion und alter Erzähler hören ebenfalls auf den Stimmen-Regler
try{const a=spyVoiceVol;spyVoiceVol=function(){const v=a();const s=Math.pow((settings.sound==null?80:settings.sound)/100,1.2)||1;return clamp(v/s*voiceVol(),0,1);};}catch(e){}
// =========================================================
// Während des Intros steht die Welt still, und Opa Knorz wartet, bis es vorbei ist
// =========================================================
const introPaused=()=>(typeof FILM!=='undefined'&&FILM.on&&typeof INTRO_FILM!=='undefined'&&FILM.def===INTRO_FILM)||(typeof IN!=='undefined'&&IN.on);
{const a=clockActive;clockActive=function(){if(introPaused())return false;return a();};}
for(const n of['updateAnimals','updateGuards','updateMount','updateDrops','updateSpy','updateMini','updateFrogs','updateFishing','updatePond','updateMummies','updatePharaoh','updatePriest','updateMerchants','updateCoaches','updateWitch','tickBuffs','updateCaves','gemRegen','updateAnts','updateEggs','updateBurn','tickXP','updateWild','updateBoats']){
  try{const f=eval(n);if(typeof f!=='function')continue;eval(n+'=function(){if(introPaused())return;return f.apply(this,arguments);}');}catch(e){}}
{const a=opaTick;opaTick=function(dt){if(introPaused()||(typeof FILM!=='undefined'&&FILM.on)){if(OPA.node)opaStop();if(OPA.q.length||time<OPA.curEnd){OPA.q=[];OPA.curEnd=0;}OPA.introEnd=time;return;}
  if(!FLAGS.introSeen&&time<15)return;if(OPA.introEnd&&time-OPA.introEnd<2.5)return;return a(dt);};}
