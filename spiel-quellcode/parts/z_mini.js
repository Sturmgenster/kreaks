/* =========================================================
   MiniGHG als richtiger Begleiter – wie die Abenteurer aus der Gilde
   - kämpft gegen alle Gegner (auch Nachtmonster), Ansturm & Wirbelschlag
   - geht zu Boden statt zu sterben, steht nach einer Weile wieder auf
   - Gespräch wie bei der Gilde: Warte hier / Komm mit, Was kannst du?
   - ruft beim Reiten einen kleinen Esel
   - Behoben: wurde unsichtbar, sobald er Ausrüstung bekam
   ========================================================= */
const MINI_M={id:'mini',i:'mini',name:'MiniGHG',full:'MiniGHG',cls:'sword',role:'Dein Mitstreiter',
  skills:['Kämpft gegen alle Feinde, auch gegen Nachtmonster','Ansturm: stürmt auf Gegner zu, die weiter weg stehen','Wirbelschlag: trifft alle Gegner rund um ihn herum','Wächst mit der Zeit und wird dabei stärker','Kämpft mit der Waffe, die du ihm gibst'],
  lines:['Ich passe auf dich auf!','Hast du meine Flagge gesehen? Schön, oder?','Wann gibt es wieder was zu tun?','Ich werde jeden Tag ein Stück größer!','Mit dir ziehe ich überall hin.']};
DT.merc_mini={name:'MiniGHG',fac:'ally',side:1,h:1.6,hp:260,dmg:14,spd:5.4,reach:1.7,cd:.9,spr:'mi_',rad:.3,aggro:20};
let miniE=null;

{const a=buildMini;buildMini=function(){a();if(miniMesh){miniMesh.visible=true;miniMesh.frustumCulled=false;}
  if(miniE){miniE.ownMesh=miniMesh;miniE.portrait=spyPortrait(miniEqIds());}};}

spawnMini=function(x,z){if(!miniMesh||miniSig!==JSON.stringify(miniEqIds()))buildMini();
  if(miniE&&DEM.includes(miniE))removeEnt(miniE);
  const F=FLAGS.mini;
  miniE=spawnEnt('merc_mini',x,z,{name:'MiniGHG',role:'Dein Mitstreiter',always:true,merc:MINI_M,kind:'merc',hired:true,mode:F.mode==='guard'?'wait':'follow',
    portrait:spyPortrait(miniEqIds()),promptName:'Mit MiniGHG',ownMesh:miniMesh,ownI:0,flag:null,flagT:0,flagCd:40});
  miniE.special=miniStep;miniE.cds={};miniE.combo=0;miniE.dm=Object.assign({},DT.merc_mini);miniE.d=miniE.dm;
  mini=miniE;miniMesh.visible=true;return miniE;};

function miniStep(e,dt){const F=FLAGS.mini;if(!F){removeEnt(e);return true;}
  e.mode=F.mode==='guard'?'wait':'follow';
  // Wachsen und Waffe
  const g=miniGrowth(),w=F.eq&&F.eq.weapon&&ITEMS[F.eq.weapon.id]&&ITEMS[F.eq.weapon.id].weapon,W=WEAPONS[w||'fist']||{dmg:6};
  e.h=56/SPY_PXM*g;e.dm.dmg=Math.round((W.dmg+6)*(.6+.4*g));e.dm.spd=4.6+1.6*g;
  const r=mercStep(e,dt);
  // Als Wache: nach einem Kampf zurück an den Posten
  if(e.mode==='wait'&&!(e.down>0)&&e.frame===0&&F.gx!=null&&Math.hypot(F.gx-e.x,F.gz-e.z)>2.5)entMove(e,F.gx,F.gz,e.d.spd*.7,dt);
  // Flagge schwenken, wenn er gerade nichts zu tun hat
  e.flagCd-=dt;if(!e.flag&&e.frame===0&&!(e.down>0)&&e.flagCd<=0){e.flag=FLAG_IDS[(Math.random()*FLAG_IDS.length)|0];e.flagT=3;e.flagCd=40+Math.random()*50;Snd.swish();}
  if(e.flag){e.flagT-=dt;if(e.frame===0)e.frame=spyFrame(0,e.flag,Math.floor(time*4)%2);else if(typeof e.frame==='number'&&e.frame>2)e.frame=0;if(e.flagT<=0){e.flag=null;if(typeof e.frame==='number'&&e.frame>2)e.frame=0;}}
  else if(typeof e.frame==='number'&&e.frame>2)e.frame=0;
  return r;}

updateMini=function(dt){
  if(!FLAGS.mini){if(miniE&&DEM.includes(miniE))removeEnt(miniE);miniE=null;mini=null;if(miniMesh)miniMesh.visible=false;nameTag('mini','',0,0,0,false);return;}
  if(!mini||!miniE||!DEM.includes(miniE)){if(miniE&&DEM.includes(miniE))removeEnt(miniE);miniE=null;
    if(state!=='playing')return;const q=FLAGS.mini.pos||findSpawn(6);spawnMini(q[0],q[1]);}
  if(miniSig!==JSON.stringify(miniEqIds()))buildMini();
  const e=miniE,show=!e.hidden&&state!=='menu'&&Math.hypot(P.x-e.x,P.z-e.z)<22;
  nameTag('mini',e.down>0?'MiniGHG (am Boden)':'MiniGHG',e.x,e.y+e.h*.92+(e.steed?.9:0),e.z,show);};

// Bildpuffer jedes Bild zurücksetzen (wie bei den Abenteurern)
{const a=updateDemons;updateDemons=function(dt){if(miniMesh){const o=miniMesh.geometry.attributes.offset;o.array[1]=-999;o.needsUpdate=true;miniMesh.geometry.instanceCount=1;}a(dt);};}

// Gespräch im Gildenstil
DIALOGS.MiniGHG={start:()=>'hello',nodes:{
  hello:()=>{const F=FLAGS.mini,g=miniGrowth(),wait=F.mode==='guard';
    return{text:(g<1?'(MiniGHG schaut mit großen Augen zu dir hoch.) ':'(MiniGHG nickt dir zu. Er ist inzwischen ganz schön gewachsen.) ')+(wait?'Ich bewache diesen Ort, bis du mich holst.':'Wohin geht es?'),
      opts:[{label:wait?'Komm mit.':'Warte hier.',act:()=>{
          if(wait){if(companionsUsed()>=MAX_COMP)return'(MiniGHG schaut auf deine Begleiter und schüttelt den Kopf. Mehr als drei passen nicht in eine Gruppe.)';F.mode='follow';toast('MiniGHG folgt dir');}
          else{F.mode='guard';F.gx=mini.x;F.gz=mini.z;toast('MiniGHG wartet hier');}return null;},go:null},
        {label:'Zeig mir deine Ausrüstung.',act:()=>{setTimeout(()=>openContainer('mini'),30);return null;},go:null},
        {label:'Was kannst du?',go:'skills'},
        {label:'Schwing die Flagge!',act:()=>{mini.flag=FLAG_IDS[(Math.random()*FLAG_IDS.length)|0];mini.flagT=4;Snd.swish();return `(MiniGHG schwenkt stolz die Flagge von ${FLAG_NAMES[mini.flag]}.)`;},go:'hello'},
        {label:'Weiter geht’s.',go:null}]};},
  skills:()=>({text:'MiniGHG, '+MINI_M.role+'. '+MINI_M.skills.map(s=>'• '+s).join(' '),opts:[{label:'Zurück',go:'hello'}]})}};
DIALOGS.MiniGHG._g=1;   // der alte Zusatz aus der Gilde wird nicht mehr gebraucht

// Reiten: MiniGHG ruft einen kleinen Esel
COMP_STEED.mini='esel';COMP_CALL.mini=['Iii-aah! Komm her, kleiner Esel!','Warte auf mich!'];
{const a=rideCompanions;rideCompanions=function(dt){a(dt);const e=miniE;if(!e||!DEM.includes(e))return;
  const go=!!P.riding&&P.x<60000&&state!=='cutscene'&&compFollowing(e);
  if(go&&!e.steed){e.callT=(e.callT||0)+dt;if(!e.called){e.called=1;if(Math.hypot(e.x-P.x,e.z-P.z)<40)say(e,COMP_CALL.mini[(Math.random()*2)|0],2.6);}if(e.callT>.9){e.steed='esel';steedPuff(e);}}
  else if(!go&&(e.steed||e.called)){if(e.steed)steedPuff(e);e.steed=null;e.called=0;e.callT=0;}};}
{const a=rideRender;rideRender=function(dt){a(dt);const e=miniE;if(!e||!e.steed||!miniMesh||!DEM.includes(e)||!steedMesh)return;const S=STEEDS[e.steed];if(!S)return;
  rideTrack(e,e.x,e.z,dt);steedDraw(e.x,groundAt(e.x,e.z,e.y+1),e.z,e.steed,!!e._rflip,e._rm,e._ra);riderPatch(miniMesh,0,'mi_0',S.saddle-.55);
  steedMesh.geometry.instanceCount=steedN;const g=steedMesh.geometry.attributes;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;};}
