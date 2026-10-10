/* =========================================================
   /cutszene: jede Zwischensequenz ansehen, ohne den Spielstand zu verändern
   /cutszene          zeigt die Liste
   /cutszene <Nr|Name> spielt sie ab (danach ist alles wie vorher)
   ========================================================= */
const CS={on:false,snap:null};
const CUTS=[
  ['intro','Prolog: Die Legende von Kreak',()=>{playIntro();CS.poll=()=>!IN.on;}],
  ['fremder','Der Fremde im Wald',()=>{csKreak(KSPOT.x+2,KSPOT.z);csGo(KSPOT.x,KSPOT.z+4,Math.PI);rescueDone();}],
  ['schmiede','Dofra schmiedet das Akuma Senso',()=>{const sm=VB.find(b=>b.type==='smithy');csGo(sm.anvil[0]+3,sm.anvil[1]+3,.8);forgeScene();}],
  ['erinnerung','Kreak erinnert sich',()=>{csKreak();addItem('akuma',1);giveAkuma();}],
  ['ritual','Das Blutmond-Ritual',()=>{csKreak(CIRCLE.x+3,CIRCLE.z+5);csGo(CIRCLE.x+2,CIRCLE.z+9,0);FLAGS.hearts=3;startRitual();}],
  ['thronsaal','Shikaya im Thronsaal',()=>{csKreak(RX-2,-172);P.x=RX;P.z=-165;P.y=realmFloor(RX,-165)+.2;P.yaw=0;throneScene();}],
  ['entfuehrung','Shikaya reißt dich nach Coda',()=>{csKreak(RX-2,-172);P.x=RX;P.z=-176;P.y=realmFloor(RX,-176)+.2;P.yaw=0;shkE=spawnEnt('shikaya',RX,-185,{inv:true,noHostile:true,noLeash:true});twistScene();}],
  ['coda','Die Schlacht um Coda beginnt',()=>{csKreak();startFinale(false);}],
  ['duell','Kreak gegen Shikaya (Film)',()=>{csKreak();startFinale(true);for(const e of DEM.slice())if(e.fin&&e.fac==='demon'&&e!==FIN.shk)removeEnt(e);CS.film=1;playFilm(DUEL_FILM,csDone);}],
  ['gefangen','Shikaya wird gefangen genommen',()=>{csKreak();startFinale(true);for(const e of DEM.slice())if(e.fin&&e.fac==='demon'&&e!==FIN.shk)removeEnt(e);const S=FIN.shk;FIN.duel=true;S.d=DT.shkDuel;S.x=0;S.z=588;S.y=fgy(0,588);
    for(let k=0;k<6;k++)spawnEnt('guardA',(k-3)*2,600,{gi:k,always:true,fin:1});P.x=4;P.z=598;P.y=fgy(4,598)+.2;P.yaw=.4;captureScene();}],
  ['morgen','Der Morgen danach',()=>{csKreak();startFinale(true);for(const e of DEM.slice())if(e.fin&&e.fac==='demon')removeEnt(e);FLAGS.moonForce=null;FLAGS.clock=6*60;epilogue();}],
  ['abspann','Abspann',()=>{showCredits();CS.poll=()=>$('credits').hidden;}],
  ['kutsche','Der Käfigwagen nach Sturmburg',()=>{CS.film=1;playFilm(CART_FILM,csDone);}]];
function csKreak(x,z){if(!FLAGS.kreak)FLAGS.kreak=1;if(!kreakE)ensureKreak();if(kreakE){kreakE.hidden=false;if(x!=null){kreakE.x=x;kreakE.z=z;kreakE.y=fgy(x,z);}}}
function csGo(x,z,yaw){P.x=x;P.z=z;P.y=getHeight(x,z)+.2;P.yaw=yaw||0;P.vx=P.vy=P.vz=0;}
const csKE=['x','y','z','hidden','scene','sceneFrame','mode','hp','max','down','d','role','portrait','name'];
function csSnapshot(){return{flags:JSON.stringify(FLAGS),inv:JSON.stringify(inv),equip:JSON.stringify(equip),sel,
  P:{x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch,hp:P.stats.hp,st:P.stats.st,safe:P.safe,xp:P.xp,lvl:P.level},
  dem:new Set(DEM),kreak:kreakE,kreakProps:kreakE?Object.fromEntries(csKE.map(k=>[k,kreakE[k]])):null,
  fin:Object.assign({},FIN),shkE,malE,ritualFx,portalK,curArea,cart:CART.on};}
function csRestore(S){
  for(const e of DEM.slice())if(!S.dem.has(e))removeEnt(e);for(const e of S.dem)if(!DEM.includes(e)){DEM.push(e);if(e.fac==='demon'&&!e.noHostile&&!HOSTILES.includes(e))HOSTILES.push(e);}METEORS.length=0;SHOTS.length=0;
  if(S.kreak&&S.kreakProps)Object.assign(S.kreak,S.kreakProps);
  for(const k in FIN)if(!(k in S.fin))delete FIN[k];Object.assign(FIN,S.fin);shkE=S.shkE;malE=S.malE;ritualFx=S.ritualFx;portalK=S.portalK;
  FLAGS=JSON.parse(S.flags);const I=JSON.parse(S.inv);for(let i=0;i<inv.length;i++)inv[i]=I[i];equip=JSON.parse(S.equip);sel=S.sel;
  Object.assign(P,{x:S.P.x,y:S.P.y,z:S.P.z,yaw:S.P.yaw,pitch:S.P.pitch,vx:0,vy:0,vz:0,safe:S.P.safe});P.stats.hp=S.P.hp;P.stats.st=S.P.st;
  if(!S.cart&&CART.on)cartClear();if(dmBoss&&!DEM.includes(dmBoss))dmBossHide();if(dmBoss&&S.dem.has(dmBoss)===false)dmBossHide();
  curArea=S.curArea;try{renderInv();renderStats();}catch(e){}try{kreakRedraw(true);}catch(e){}}
function csDone(){if(!CS.on)return;CS.on=false;CS.poll=null;CS.film=0;
  if(cine){cine=null;$('cine').hidden=true;$('hotbar').hidden=false;}if(FILM.on){FILM.onEnd=null;filmEnd(true);}
  if(!$('credits').hidden)$('credits').hidden=true;if(IN.on)endIntro();
  try{csRestore(CS.snap);}catch(e){console.error('Zwischensequenz zurücksetzen',e);}CS.snap=null;Mus.cine=null;
  state='playing';try{lock();updateLockHint();}catch(e){}toast('Zwischensequenz beendet. Alles ist wie vorher.');}
// Während einer Vorschau: nichts speichern, keine Belohnungen, und jede Szene endet nach ihrem letzten Bild
{const a=saveGame;saveGame=function(){if(CS.on)return true;return a.apply(this,arguments);};}
{const a=gainXP;gainXP=function(n){if(CS.on)return;return a.apply(this,arguments);};}
{const a=addLetter;addLetter=function(i){if(CS.on)return;return a(i);};}
{const a=playCine;playCine=function(lines,onEnd,mus){if(!CS.on||CS.film)return a(lines,onEnd,mus);return a(lines,()=>{setTimeout(csDone,50);},mus);};}
setInterval(()=>{if(CS.on&&CS.poll){try{if(CS.poll())csDone();}catch(e){}}},400);
function csPlay(i){const C=CUTS[i];if(!C)return false;if(CS.on||FILM.on||cine){conLog('Es läuft schon eine Zwischensequenz.','err');return true;}
  CS.snap=csSnapshot();CS.on=true;CS.poll=null;CS.film=0;closeConsole();
  try{C[2]();}catch(e){console.error('Zwischensequenz',e);toast('Diese Zwischensequenz konnte nicht starten.');csDone();}return true;}
HELP.push(['/cutszene [Nr|Name]','Zwischensequenz ansehen (ohne Liste: alle Szenen zeigen). Danach ist alles wie vorher']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/(cutszene|cutscene|szene|zwischensequenz)\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    const arg=norm(t.split(/\s+/).slice(1).join(' '));
    if(!arg){CUTS.forEach((c,i)=>conLog(`<span class="cmd">${i+1}</span> ${c[0]} · ${esc(c[1])}`,'sys'));conLog('Beispiel: /cutszene duell  oder  /cutszene 9','sys');return;}
    let i=/^\d+$/.test(arg)?(+arg-1):CUTS.findIndex(c=>c[0].startsWith(arg)||norm(c[1]).includes(arg));
    if(i<0||!CUTS[i]){conLog('Diese Zwischensequenz gibt es nicht. /cutszene zeigt die Liste.','err');return;}
    conLog('Zeige: '+esc(CUTS[i][1])+'','ok');csPlay(i);return;}
  return a(raw);};}
