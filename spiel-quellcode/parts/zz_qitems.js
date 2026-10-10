/* =========================================================
   Quest-Gegenstände im Inventar
   - Die vier Teile des Akuma Senso und die Dämonenherzen liegen jetzt als
     richtige Gegenstände im Inventar (nicht wegwerfbar, gehen beim Tod nicht verloren)
   - Beim Schmieden nimmt Dofra die Teile, beim Ritual verbrennen drei Herzen
   - Alte Spielstände bekommen ihre Teile und Herzen automatisch ins Inventar
   ========================================================= */
Object.assign(ITEMS,{
  q_blade:{name:'Klinge des Akuma Senso',keep:true,quest:1},
  q_heart:{name:'Mondherz',keep:true,quest:1},
  q_hilt:{name:'Griff des Akuma Senso',keep:true,quest:1},
  q_ember:{name:'Höllenglut',keep:true,quest:1},
  q_dheart:{name:'Dämonenherz',plural:'Dämonenherzen',keep:true,quest:1}});
Object.assign(ITEM_DESC,{
  q_blade:'Teil des Akuma Senso. Aus dem Blutstein im Nordwald gezogen. Bring alle vier Teile zu Dofra',
  q_heart:'Teil des Akuma Senso. Es pocht leise, wie ein zweites Herz. Bring alle vier Teile zu Dofra',
  q_hilt:'Teil des Akuma Senso. Aus dem Grab des Pharao Kreakhotep. Bring alle vier Teile zu Dofra',
  q_ember:'Teil des Akuma Senso. Glut aus der Tiefe, die niemals erlischt. Bring alle vier Teile zu Dofra',
  q_dheart:'Noch warm. Drei davon braucht das Ritual am Steinkreis, unter dem Blutmond'});
const QPARTS=['blade','heart','hilt','ember'];
function qGive(id,n){const left=addItem(id,n);if(left)spawnDrop(id,left,P.x,P.y+1,P.z);}
let qSyncT=0;
function qSync(){if(state==='menu'||state==='loading'||!FLAGS||P.x==null)return;const F=found();let ch=false;
  // Teile: sobald gefunden ins Inventar, nach dem Schmieden wieder weg
  FLAGS.partItem=FLAGS.partItem||{};
  if(!F.forged){for(const k of QPARTS)if(F[k]&&!FLAGS.partItem[k]){FLAGS.partItem[k]=1;if(countItem('q_'+k)<1){qGive('q_'+k,1);ch=true;}}}
  else if(!FLAGS.partsTaken){FLAGS.partsTaken=1;for(const k of QPARTS){const n=countItem('q_'+k);if(n){removeItem('q_'+k,n);ch=true;}}}
  // Dämonenherzen: das Spiel zählt FLAGS.hearts, das Inventar hält die Gegenstände
  const h=FLAGS.hearts||0;if(FLAGS.heartsSeen==null){const c=countItem('q_dheart');if(h>c){qGive('q_dheart',h-c);ch=true;}FLAGS.heartsSeen=h;}
  else if(h!==FLAGS.heartsSeen){const d=h-FLAGS.heartsSeen;if(d>0)qGive('q_dheart',d);else removeItem('q_dheart',Math.min(-d,countItem('q_dheart')));ch=true;}
  const c=countItem('q_dheart');FLAGS.hearts=c;FLAGS.heartsSeen=c;
  if(ch)try{renderInv();}catch(e){}}
{const a=updateStory;updateStory=function(dt){a(dt);qSyncT-=dt;if(qSyncT<=0){qSyncT=.4;try{qSync();}catch(e){if(!qSync.err){qSync.err=1;console.error('Quest-Gegenstände',e);}}}};}
// Beim Laden sofort abgleichen
{const a=loadGame;loadGame=function(){const ok=a.apply(this,arguments);if(ok)setTimeout(()=>{try{qSync();}catch(e){}},300);return ok;};}
