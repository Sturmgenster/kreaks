/* =========================================================
   V62 · Bürgermeister Albrecht und das Rathaus von Coda.
   Man kann hineingehen. Albrecht vergibt hin und wieder kleine Aufträge rund ums Dorf,
   höchstens einen am Tag, und sie wiederholen sich: Monster der Nacht, entlaufene Kühe,
   Wölfe, Brennholz, Steine für den Brunnen.
   ========================================================= */
VDEFS.push({name:'Albrecht',sex:'m',elder:true,skin:1,hair:'grey',style:'short',beard:'long',top:'purple',bottom:'black',tw:15,chubby:true,cane:false,seed:900+VDEFS.length*7,role:'Bürgermeister',id:VDEFS.length});
Object.assign(DOOR_TXT,{hallEnter:'Das Rathaus von Coda',hallExit:'Coda'});
let hallOut=null;
const hallOpen=()=>{const c=clockMin();return c>=420&&c<1260;};
// ---------- Innenraum ----------
function buildHall(atlas){const H=HALLI,ox=H.x,oz=H.z,grp=new THREE.Group(),ph=o=>new THREE.MeshPhongMaterial(Object.assign({flatShading:true,shininess:0,specular:0x000000},o));
  const planks=drawPlanksTex(),wallC=drawWallTex();
  const mats={floor:ph({map:texRepC(planks,8,6),color:0xd0c0a8}),ceil:ph({map:texRepC(planks,8,6),color:0x9a8a7a}),beam:ph({color:0x3a2412}),wall:len=>ph({map:texRepC(wallC,len/2,1.25),color:0xf4ecdc})};
  buildRoomShell(H,grp,mats);
  const wood=ph({map:texRepC(planks,1,1)}),dark=ph({color:0x3a2412}),stone=ph({color:0x6a6460}),red=ph({color:0x8a1e1e}),gold=ph({color:0xc8a040}),paper=ph({color:0xe8dcc0}),green=ph({color:0x3a5a34}),blue=ph({color:0x2a3a6a});
  const win=new THREE.MeshBasicMaterial({map:texRepC(drawWindowTex(),1,1)}),doorM=ph({map:texRepC(drawDoorTex(),1,1)});
  const plane=(m,x,y,z,w,h,rot)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);q.position.set(x,y,z);q.rotation.y=rot||0;grp.add(q);return q;};
  // Tür und Fenster
  plane(doorM,ox,FY+1.15,oz+H.d/2-.02,1.4,2.3,Math.PI);
  for(const wx of[-4.6,4.6])plane(win,ox+wx,FY+2,oz+H.d/2-.03,1.2,1.5,Math.PI);
  for(const wz of[-2.5,2])for(const sd of[-1,1])plane(win,ox+sd*(H.w/2-.03),FY+2,oz+wz,1.2,1.5,-sd*Math.PI/2);
  // Roter Läufer vom Eingang zum Amtstisch
  {const c=new THREE.Mesh(new THREE.PlaneGeometry(2,H.d-4.4),red);c.rotation.x=-Math.PI/2;c.position.set(ox,FY+.012,oz+.9);grp.add(c);
    for(const sd of[-1,1]){const t=new THREE.Mesh(new THREE.PlaneGeometry(.12,H.d-4.4),gold);t.rotation.x=-Math.PI/2;t.position.set(ox+sd*.94,FY+.014,oz+.9);grp.add(t);}}
  // Amtstisch auf einem Podest, dahinter der hohe Stuhl
  solid(grp,wood,ox,FY,oz-3.6,7,.08,3.4,false);
  solid(grp,wood,ox,FY+.08,oz-3.1,3.8,.66,1.1,true);solid(grp,dark,ox,FY+.74,oz-3.1,4.1,.07,1.3);
  solid(grp,paper,ox-1,FY+.81,oz-3,.55,.03,.4);solid(grp,paper,ox-.9,FY+.84,oz-3.05,.5,.03,.38);solid(grp,red,ox+.9,FY+.81,oz-3.1,.6,.12,.45);solid(grp,dark,ox+1.4,FY+.81,oz-2.9,.12,.2,.12);
  solid(grp,dark,ox+1.3,FY+.08,oz-4.6,.9,.45,.75);solid(grp,dark,ox+1.3,FY+.53,oz-4.95,.95,1.6,.12);solid(grp,red,ox+1.3,FY+.54,oz-4.6,.8,.05,.65);solid(grp,gold,ox+1.3,FY+2.1,oz-4.96,.36,.28,.14);
  // Wappen und Banner an der Nordwand
  {const w=new THREE.Mesh(new THREE.CircleGeometry(.75,12),gold);w.position.set(ox,FY+3.2,oz-H.d/2+.04);grp.add(w);const w2=new THREE.Mesh(new THREE.CircleGeometry(.6,12),green);w2.position.set(ox,FY+3.2,oz-H.d/2+.05);grp.add(w2);}
  for(const sd of[-1,1]){const bx=ox+sd*3.1;plane(red,bx,FY+2.6,oz-H.d/2+.04,1.3,2.6);plane(gold,bx,FY+3.94,oz-H.d/2+.05,1.5,.12);
    const tip=new THREE.Mesh(new THREE.CircleGeometry(.65,3),red);tip.rotation.z=-Math.PI/2;tip.position.set(bx,FY+1.3,oz-H.d/2+.04);grp.add(tip);plane(gold,bx,FY+2.8,oz-H.d/2+.05,.4,.4);}
  // Ratstisch mit Bänken (West)
  {const x=ox-4.3,z=oz+1;solid(grp,wood,x,FY+.74,z,1.5,.08,4.6);for(const lx of[-.6,.6])for(const lz of[-2,2])solid(grp,dark,x+lx,FY,z+lz,.1,.74,.1);COLL.push({x,z,cos:1,sin:0,hw:.75,hd:2.3,h:.8});
    for(const sd of[-1,1]){solid(grp,wood,x+sd*1.05,FY+.42,z,.34,.07,4.2);for(const lz of[-1.8,1.8])solid(grp,dark,x+sd*1.05,FY,z+lz,.08,.42,.08);}
    solid(grp,paper,x-.2,FY+.82,z-1,.6,.02,.8);solid(grp,paper,x+.1,FY+.82,z+.8,.4,.02,.5);}
  // Bücherregal und Truhe (Ost)
  {const x=ox+H.w/2-.32;solid(grp,dark,x,FY,oz-1.4,.5,2.8,3.2,true);const bc=[red,blue,green,gold,dark];
    for(const sy of[.55,1.3,2.05]){solid(grp,wood,x-.05,FY+sy-.06,oz-1.4,.48,.05,3.1);for(let k=0;k<12;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.32,.5+((k*7)%3)*.06,.2),bc[(k+sy*10|0)%5]);b.position.set(x-.07,FY+sy+.25,oz-2.85+k*.25);grp.add(b);}}
    solid(grp,wood,x-.2,FY,oz+2.6,.8,.65,1.3,true);solid(grp,dark,x-.2,FY+.65,oz+2.6,.85,.06,1.35);}
  // Kamin (Ost, vorne)
  solid(grp,stone,ox+H.w/2-.5,FY,oz+.6,.9,2.4,2,true);{const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.85),new THREE.MeshBasicMaterial({color:0x120804}));fp.position.set(ox+H.w/2-.96,FY+.43,oz+.6);fp.rotation.y=-Math.PI/2;grp.add(fp);}
  // Karte der Gegend an der Westwand
  {const m=plane(paper,ox-H.w/2+.04,FY+2.2,oz-2.6,2.2,1.5,Math.PI/2);const g=plane(green,ox-H.w/2+.05,FY+2.2,oz-2.6,1.6,1,Math.PI/2);g.scale.set(1,1,1);plane(blue,ox-H.w/2+.06,FY+2.1,oz-2.4,.15,.9,Math.PI/2);}
  scene.add(grp);
  const deco=[];for(const[x,z,y]of[[ox-1.6,oz-3.1,FY+.81],[ox+1.7,oz-3.1,FY+.81],[ox-4.3,oz+1,FY+.82]])deco.push({x,z,y,w:.13,h:.26,spr:'candle',tint:1.4});
  deco.push({x:ox+H.w/2-1.15,z:oz+.6,y:FY,w:.85,h:.7,spr:'campfire',tint:1.5});for(const[lx,lz]of[[-3,0],[3,0],[0,2.5]])deco.push({x:ox+lx,z:oz+lz,y:FY+3.4,w:.16,h:.32,spr:'candle',tint:1.6});
  const im=bbMaterial(atlas,0,0);EXTRA_BB.push(im);scene.add(makeBillboards(deco,im));
  INT_DOORS.push({x:ox,z:oz+H.d/2-.3,kind:'hallExit'});
  const th=VB.find(b=>b.type==='townhall');if(th&&th.door){hallOut={x:th.door[0],z:th.door[1]};const ux=th.door[0]-th.x,uz=th.door[1]-th.z,ul=Math.hypot(ux,uz)||1;hallOut.nx=ux/ul;hallOut.nz=uz/ul;}
  const v=villagers.find(q=>q.name==='Albrecht');if(v){const x=ox-.3,z=oz-4.1;v.ax=x;v.az=z;v.rad=.7;v.x=x;v.z=z;v.tx=x;v.tz=z;v.y=FY;v.inside=true;v.home=null;}}
{const ii0=initInteriors;initInteriors=function(atlas){ii0(atlas);try{buildHall(atlas);}catch(e){console.error('Rathaus',e);}};}
{const dl0=doorLooked;doorLooked=function(){const d=dl0();if(d)return d;if(P.x<IN_X&&hallOut&&Math.hypot(hallOut.x-P.x,hallOut.z-P.z)<3.2&&lookingAt(hallOut.x,getHeight(hallOut.x,hallOut.z)+1.4,hallOut.z,3.8,.55))return{kind:'hallEnter'};return null;};}
{const ud0=useDoor;useDoor=function(d){
  if(d.kind==='hallEnter'){if(!hallOpen()){toast('Das Rathaus ist geschlossen. Albrecht empfängt von 7 bis 21 Uhr.');Snd.click();return;}enterInterior(HALLI.x,HALLI.z+HALLI.d/2-1.3,0);return;}
  if(d.kind==='hallExit'){const x=hallOut.x+hallOut.nx*1.2,z=hallOut.z+hallOut.nz*1.2;P.x=x;P.z=z;P.y=getHeight(x,z)+.05;P.vx=P.vy=P.vz=0;P.yaw=Math.atan2(hallOut.nx,hallOut.nz);P.safe=[x,z];curArea=null;setTimeout(checkArea,150);Snd.click();return;}
  ud0(d);};}
// Geschlossen: nicht erst die Ladeblende zeigen
{const rc0=rightClickUse;rightClickUse=function(){if(state==='playing'&&P.x<IN_X){const d=doorLooked();if(d&&d.kind==='hallEnter'&&!hallOpen()){useDoor(d);return true;}}return rc0();};}
// ---------- Aufträge ----------
const MQ_TYPES={
  night:{title:'Monster der Nacht',give:()=>{const n=4+((Math.random()*4)|0);return{need:n,have:0};},
    offer:q=>`Nachts kriechen wieder Skelette und Riesenratten aus den Höhlen und schnüffeln an unseren Zäunen. Besiege ${q.need} von ihnen, egal wo. Hauptsache, es werden weniger.`,
    status:q=>`${q.have}/${q.need} Nachtkreaturen besiegt`,done:q=>q.have>=q.need,reward:q=>({money:10*q.need+20,xp:8*q.need})},
  cows:{title:'Entlaufene Kühe',give:()=>({need:3,have:0,lost:0}),
    offer:()=>'Irgendein Lausbub hat heute Nacht das Gatter an Lutz\' Kuhweide offen gelassen. Drei Kühe sind weg, irgendwo draußen auf den Wiesen. Nimm ein Seil, leg es ihnen um und bring sie zurück ins Gatter bei der Farm im Westen.',
    status:q=>`${q.have}/${q.need} Kühe zurück im Gatter`+(q.lost?` · ${q.lost} verloren`:''),done:q=>q.have+q.lost>=q.need,reward:q=>({money:25*q.have+(q.have===q.need?30:0),xp:15*q.have})},
  wolves:{title:'Wölfe am Waldrand',give:()=>({need:3,have:0}),
    offer:q=>`Die Schäfer klagen über Wölfe. Jede Woche fehlt ein Lamm. Erlege ${q.need} Wölfe, dann haben die Herden eine Weile Ruhe.`,
    status:q=>`${q.have}/${q.need} Wölfe erlegt`,done:q=>q.have>=q.need,reward:()=>({money:70,xp:40})},
  wood:{title:'Brennholz für die Alten',give:()=>({need:10+((Math.random()*6)|0)}),
    offer:q=>`Der Winter kommt, und nicht jeder in Coda kann noch selbst Holz hacken. Bring mir ${q.need} Stück Holz, egal welches. Ich verteile es an die Alten.`,
    status:q=>`${Math.min(woodCount(),q.need)}/${q.need} Holz dabei`,done:q=>woodCount()>=q.need,deliver:q=>takeWood(q.need),reward:q=>({money:3*q.need+10,xp:2*q.need})},
  stone:{title:'Steine für den Dorfbrunnen',give:()=>({need:12+((Math.random()*6)|0)}),
    offer:q=>`Die Brunnenmauer am Markt bröckelt. Bring mir ${q.need} Steine, dann mauern Merten und ich sie neu auf.`,
    status:q=>`${Math.min(countItem('stone'),q.need)}/${q.need} Steine dabei`,done:q=>countItem('stone')>=q.need,deliver:q=>removeItem('stone',q.need),reward:q=>({money:3*q.need+12,xp:2*q.need})}};
function woodCount(){let n=0;for(const s of inv)if(s&&isWood(s.id))n+=s.n;return n;}
function takeWood(n){for(let i=0;i<inv.length&&n>0;i++){const s=inv[i];if(s&&isWood(s.id)){const k=Math.min(s.n,n);s.n-=k;n-=k;if(!s.n)inv[i]=null;}}renderInv();}
const MY=()=>{FLAGS.mayor=FLAGS.mayor||{q:null,next:0,done:0,last:null};return FLAGS.mayor;};
const mayorQ=()=>MY().q;
const mayorReady=()=>!MY().q&&(FLAGS.day||0)>=MY().next;
function mayorPick(){const keys=Object.keys(MQ_TYPES).filter(k=>k!==MY().last);return keys[(Math.random()*keys.length)|0];}
function mayorAccept(type){const q=Object.assign({type},MQ_TYPES[type].give());MY().q=q;MY().last=type;if(type==='cows')cowsRelease(q.need);
  if(type==='cows'&&!countItem('rope')){addItem('rope',1);setTimeout(()=>toast('Albrecht gibt dir ein Seil.'),300);}
  toast('Neuer Auftrag: '+MQ_TYPES[type].title);Snd.pickup();renderQuests();saveGame();}
function mayorFinish(){const q=MY().q,T=MQ_TYPES[q.type];if(T.deliver)T.deliver(q);const R=T.reward(q);if(R.money&&!setWallet(wallet()+R.money))toast('Inventar ist voll');gainXP(R.xp);
  MY().q=null;MY().done++;MY().next=(FLAGS.day||0)+1;Snd.coin();toast('Auftrag erledigt: '+T.title);renderQuests();saveGame();return R;}
function mayorProgress(type,n){const q=MY().q;if(!q||q.type!==type)return;const T=MQ_TYPES[type];if(T.done(q))return;q.have+=n||1;toast(T.status(q));if(T.done(q))setTimeout(()=>toast('Geh zurück zu Albrecht ins Rathaus.'),900);renderQuests();}
// Nachtkreaturen und Wölfe zählen
{const k0=killEnt;killEnt=function(e,by){const was=!e.dead;k0(e,by);if(was&&e.dead&&e.nm&&Math.hypot(e.x-P.x,e.z-P.z)<40)mayorProgress('night');};}
{const h0=hurtAnimal;hurtAnimal=function(a,n){const was=a.alive;h0(a,n);if(was&&!a.alive&&a.type==='wolf')mayorProgress('wolves');};}
// Anzeige unter den Aufgaben
{const rq0=renderQuests;renderQuests=function(){rq0();const q=FLAGS.mayor&&FLAGS.mayor.q,box=document.getElementById('quests');if(!q||!box||state==='menu')return;const T=MQ_TYPES[q.type];
  if(box.hidden){box.innerHTML='<h4>Aufgaben</h4>';box.hidden=false;}box.insertAdjacentHTML('beforeend',`<div class="q"><b>${T.title}</b><span>${T.done(q)?'Erledigt · zurück zu Albrecht':T.status(q)}</span></div>`);};}
{let rqT=0;const u5=updateAnimals;updateAnimals=function(dt){u5(dt);rqT+=dt;if(rqT>1){rqT=0;const q=FLAGS.mayor&&FLAGS.mayor.q;if(q&&(q.type==='wood'||q.type==='stone'))renderQuests();}};}
// ---------- Entlaufene Kühe ----------
const COW_MEADOWS=[[-118,742],[-128,700],[-104,660],[-140,770],[-92,640],[-60,642],[-150,725]];
function cowPenRect(){return[COW_PEN[0]+1,COW_PEN[1],COW_PEN[2],COW_PEN[3]];}
function cowsRelease(n){const cows=animals.filter(a=>a.type==='cow'&&a.alive&&a.pen&&!a.runaway);const spots=COW_MEADOWS.slice().sort(()=>Math.random()-.5);let k=0;
  for(const a of cows){if(k>=n)break;let[x,z]=spots[k%spots.length];x+=(Math.random()-.5)*14;z+=(Math.random()-.5)*14;if(!inWorld(x,z)||getHeight(x,z)<WATER+.4||(maskAt(x,z)&22))continue;
    a.pen=null;a.runaway=1;a.leash=0;a.x=a.hx=a.tx=x;a.z=a.hz=a.tz=z;a.roam=9;a.state='idle';a.t=1;k++;}return k;}
function cowLooked(){if(P.x>IN_X)return null;for(const a of animals)if(a.runaway&&a.alive&&!a.leash&&Math.hypot(a.x-P.x,a.z-P.z)<3.6&&lookingAt(a.x,a.y+a.h*.5,a.z,4.2,.78))return a;return null;}
function cowLeash(a){if(!countItem('rope')){toast('Du brauchst ein Seil, um die Kuh einzufangen.');Snd.click();return;}const n=animals.filter(c=>c.leash).length;if(n>=3){toast('Mehr als drei Kühe kannst du nicht führen.');return;}
  a.leash=1;a.scared=0;Snd.moo(.8);toast('Die Kuh hängt am Seil. Führ sie zum Gatter bei der Farm.');}
function updateCows(dt){const q=FLAGS.mayor&&FLAGS.mayor.q,P0=cowPenRect();
  for(const a of animals){if(a.type!=='cow'||!a.runaway)continue;
    if(!a.alive){a.runaway=0;a.leash=0;a.pen=P0;a.hx=-80;a.hz=807;if(q&&q.type==='cows'){q.lost++;toast('Eine der Kühe ist tot. Albrecht wird nicht begeistert sein.');renderQuests();}continue;}
    if(!q||q.type!=='cows'){a.runaway=0;a.leash=0;a.pen=P0;a.x=a.hx=clamp(-80+(Math.random()-.5)*12,P0[0],P0[2]);a.z=a.hz=clamp(807,P0[1],P0[3]);continue;}
    if(a.leash){a.state='idle';a.t=5;a.scared=0;const dx=P.x-a.x,dz=P.z-a.z,d=Math.hypot(dx,dz);
      if(d>2.4){const sp=Math.min(d*1.6,7.5),st=Math.min(d-2.2,sp*dt),nx=a.x+dx/d*st,nz=a.z+dz/d*st;if(getHeight(nx,nz)>WATER+.2||d>12){a.x=nx;a.z=nz;}a.flip=(dx*Math.cos(P.yaw)-dz*Math.sin(P.yaw))<0;a.anim+=st*.9;a.frame=1+(Math.floor(a.anim*1.6)%2);}
      if(d>30){a.x=P.x-dx/d*2.5;a.z=P.z-dz/d*2.5;}
      if(a.x>P0[0]-7&&a.x<P0[2]+7&&a.z>P0[1]-7&&a.z<P0[3]+7){a.leash=0;a.runaway=0;a.pen=P0;a.x=a.hx=a.tx=clamp(a.x,P0[0]+1,P0[2]-1);a.z=a.hz=a.tz=clamp(a.z,P0[1]+1,P0[3]-1);Snd.moo(1);mayorProgress('cows');}}}
  // Nach dem Laden: fehlende Ausreißer wieder auf die Wiesen
  if(q&&q.type==='cows'&&!MQ_TYPES.cows.done(q)){const want=q.need-q.have-q.lost,cur=animals.filter(a=>a.runaway&&a.alive).length;if(cur<want)cowsRelease(want-cur);}}
{const u6=updateAnimals;updateAnimals=function(dt){u6(dt);try{updateCows(dt);}catch(e){if(!updateCows.err){updateCows.err=1;console.error('Kühe',e);}}};}
{const su0=storyUse;storyUse=function(){const c=cowLooked();if(c){cowLeash(c);return true;}return su0();};}
{const sp0=storyPrompt2;storyPrompt2=function(){const t=sp0();if(t)return t;if(cowLooked())return countItem('rope')?'Kuh mit dem Seil einfangen':'Kuh einfangen (du brauchst ein Seil)';
  if(P.x<IN_X&&doorLooked()&&doorLooked().kind==='hallEnter')return hallOpen()?'Rathaus betreten':'Rathaus (geschlossen)';if(P.x>IN_X){const d=doorLooked();if(d&&d.kind==='hallExit')return'Rathaus verlassen';}return null;};}
// ---------- Albrechts Gespräch ----------
DIALOGS.Albrecht={start:()=>'hello',nodes:{
  hello:()=>{const q=mayorQ(),T=q&&MQ_TYPES[q.type];let text;const opts=[];
    if(q&&T.done(q)){text='Na? Du siehst aus wie jemand, der gute Nachrichten bringt.';opts.push({label:'Der Auftrag ist erledigt.',act:()=>{const q=mayorQ();if(!q)return null;const R=mayorFinish();const extra=q.type==='cows'&&q.lost?' Schade um die Kuh, aber du hast getan, was du konntest.':'';dlg.rewardText=`Hervorragend! Im Namen von Coda: Danke.${extra} Hier, ${fmtMoney(R.money)} aus der Dorfkasse. Komm morgen wieder, dann habe ich vielleicht wieder etwas für dich.`;return null;},go:'reward'});}
    else if(q){text=`Wie steht es mit dem Auftrag? ${T.title}: ${T.status(q)}. Lass dir Zeit, aber nicht zu viel.`;opts.push({label:'Was war noch mal zu tun?',go:'repeat'},{label:'Ich gebe den Auftrag auf.',go:'abort'});}
    else if(mayorReady()){text=MY().done?'Ah, mein verlässlichster Helfer! Coda hat wieder ein Anliegen.':'Willkommen im Rathaus von Coda. Albrecht, Bürgermeister. Du bist neu hier, nicht wahr? Gut. Coda kann zupackende Hände gebrauchen.';opts.push({label:'Gibt es Arbeit für mich?',go:'offer'});}
    else{text='Für heute habe ich nichts mehr für dich. Komm morgen wieder, irgendwas ist in Coda immer zu tun.';}
    opts.push({label:'Erzählt mir von Coda.',go:'coda'},{label:'Was haltet Ihr von Dofras Geschichten?',go:'kreak'},{label:'Auf Wiedersehen.',go:null});return{text,opts};},
  offer:()=>{if(!dlg)return{text:'',opts:[]};if(!dlg.offer)dlg.offer=mayorPick();const t=dlg.offer,T=MQ_TYPES[t];if(!dlg.offerQ||dlg.offerQ.t!==t)dlg.offerQ=Object.assign({t},T.give());const tmp=dlg.offerQ;
    return{text:T.offer(tmp),opts:[{label:'Ich kümmere mich darum.',act:()=>{const q=Object.assign({},dlg.offerQ,{type:t});delete q.t;MY().q=q;MY().last=t;if(t==='cows'){cowsRelease(q.need);if(!countItem('rope')){addItem('rope',1);setTimeout(()=>toast('Albrecht gibt dir ein Seil.'),300);}}
          toast('Neuer Auftrag: '+T.title);Snd.pickup();renderQuests();saveGame();return null;},go:'accepted'},{label:'Heute nicht.',go:'hello'}]};},
  accepted:()=>({text:'Ausgezeichnet. Ich wusste, dass auf dich Verlass ist. Melde dich, wenn es erledigt ist.',opts:[{label:'Weiter',go:'hello'}]}),
  repeat:()=>{const q=mayorQ();return{text:q?MQ_TYPES[q.type].offer(q):'Es gibt gerade nichts zu tun.',opts:[{label:'Zurück',go:'hello'}]};},
  abort:()=>({text:'Schade. Na gut, dann suche ich mir jemand anderen. Morgen habe ich vielleicht etwas Leichteres für dich.',opts:[{label:'Ja, ich gebe auf.',act:()=>{MY().q=null;MY().next=(FLAGS.day||0)+1;renderQuests();saveGame();return null;},go:'hello'},{label:'Nein, ich mache weiter.',go:'hello'}]}),
  reward:()=>({text:(dlg&&dlg.rewardText)||'Danke.',opts:[{label:'Danke.',go:'hello'}]}),
  coda:()=>({text:'Coda ist älter, als es aussieht. Erst stand hier nur Mertens Mühle am Bach, dann kamen die Bauern, dann Dofras Esse, dann Hagens Wirtshaus. Und mit dem Wirtshaus kamen die Geschichten. Heute haben wir einen Markt, eine Kirche und dieses Rathaus. Wenn die Händler morgens ihre Stände aufbauen, weiß ich, wofür ich das alles mache.',opts:[{label:'Zurück',go:'hello'}]}),
  kreak:()=>({text:'(Albrecht seufzt.) Dofra ist der beste Schmied weit und breit, und er meint es gut. Aber er sieht in jedem Fremden ein bisschen Kreak. Ich halte mich an das, was ich sehe. Und ich sehe jemanden, der anpacken kann. Das ist mir mehr wert als jede Legende.',opts:[{label:'Zurück',go:'hello'}]})}};
// Neues Gespräch: neuer Vorschlag
{const od0=openDialog;openDialog=function(v){od0(v);if(dlg&&v&&v.name==='Albrecht'){dlg.offer=null;dlg.offerQ=null;}};}
