/* =========================================================
   0.0.127 · Gegner greifen erst aus der Nähe an
   - Monster laufen erst auf dich zu, wenn du ihnen auf etwa 15 m nahe kommst.
   - Sie verfolgen dich höchstens, bis du 25 m entfernt bist. Dann geben sie auf und kehren um.
   - Wer getroffen wird, reagiert auch aus bis zu 30 m. Rudel, Trupps und Diener ziehen gemeinsam los.
   - Bosse und Story-Kämpfe behalten ihr eigenes Verhalten.
   ========================================================= */
const AGG={see:15,lose:25,hit:30};
{const a=hurtEnt;hurtEnt=function(e,n,by){if(e&&(by==='player'||by==='kreak'))e.hitT=time;return a(e,n,by);};}
function aggGroupChasing(e){const any=L=>L&&L.some(m=>m!==e&&!m.dead&&m.chaseP);return any(e.mates)||any(e.sq&&e.sq.members)||(e.master&&!e.master.dead&&e.master.chaseP)||any(e.minions);}
{const a=pickTarget;pickTarget=function(e){const t=a(e);if(e.fac!=='demon'||e.d.boss||e.noAggroRule||e.always&&e.msync)return t;
  if(state==='dead'||state==='cutscene'){e.chaseP=false;return t==='player'?null:t;}
  const pd=Math.hypot(P.x-e.x,P.z-e.z),hit=time-(e.hitT||-99)<8;let ok;
  if(e.chaseP)ok=pd<=AGG.lose;else ok=(t==='player'&&pd<=AGG.see)||(hit&&pd<=AGG.hit)||(aggGroupChasing(e)&&pd<=AGG.see+5);
  if(ok&&!e.chaseP&&e.cav&&!hit&&!(e.aggroT>0)&&!cvLOS(e.x,e.z,P.x,P.z,.45))ok=false;
  if(!ok){if(e.chaseP){e.chaseP=false;e.aggroT=0;e.wt=0;}return t==='player'?null:t;}
  if(t&&t!=='player'){const od=Math.hypot(t.x-e.x,t.z-e.z);if(od<pd)return t;}
  e.chaseP=true;return'player';};}
