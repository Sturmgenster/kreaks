/* =========================================================
   Cheat-Modus: /fly und Cheat-Inventar
   ========================================================= */
// ---------- /fly: frei durch die Gegend fliegen ----------
// Leertaste = hoch, Schleichen (Shift) = runter, dazu doppelt so schnell
let cheatFly=false;
HELP.push(['/fly','Fliegen an/aus (nur im Cheat-Modus). Leertaste hoch, Shift runter, schneller unterwegs']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/(fly|fliegen)\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('Fliegen geht nur im Cheat-Modus. Benutze erst /cheats on.','err');return;}
    const v=norm(t.split(/\s+/)[1]||'');cheatFly=v==='on'||v==='an'?true:v==='off'||v==='aus'?false:!cheatFly;
    if(cheatFly&&P.riding)dismount();
    conLog(cheatFly?'Fliegen an: Leertaste = hoch, Shift = runter.':'Fliegen aus.','ok');toast(cheatFly?'Fliegen an':'Fliegen aus');if(cheatFly)closeConsole();return;}
  return a(raw);};}
{const a=updatePlayer;updatePlayer=function(dt){
  if(cheatFly&&(!cheatOn()||P.riding||state==='dead')){cheatFly=false;}
  if(!cheatFly)return a(dt);
  const M=P.mods,bs=M&&M.baseSpeed;if(M&&bs)M.baseSpeed=bs*2.2;
  const up=down('jump'),dn=down('sneak');P.vy=22*dt;P.ground=false;
  try{a(dt);}finally{if(M&&bs)M.baseSpeed=bs;}
  // eigenes, schnelles Flugtempo (Strg = noch schneller)
  {const f=(down('forward')?1:0)-(down('back')?1:0),r=(down('right')?1:0)-(down('left')?1:0),L=Math.hypot(f,r);
   if(L&&state==='playing'){const sp=(down('sprint')?26:14)*dt,sn=Math.sin(P.yaw),cs=Math.cos(P.yaw),dx=(-sn*f+cs*r)/L,dz=(-cs*f-sn*r)/L,hv=Math.hypot(P.vx||0,P.vz||0)*dt;
     const extra=Math.max(0,sp-hv);P.x+=dx*extra;P.z+=dz*extra;}}
  P.vy=0;P.y+=(up?1:dn?-1:0)*(down('sprint')?16:10)*dt;const g=groundAt(P.x,P.z,P.y+1);if(P.y<g){P.y=g;P.ground=true;}
  if(P.y>g+.2)P.ground=false;P.airT=0;P.landAt=-9;};}
{const a=startGame;startGame=function(){cheatFly=false;return a.apply(this,arguments);};}

// ---------- Cheat-Inventar: alle Gegenstände zum Nehmen ----------
{const st=document.createElement('style');st.textContent=`
#cheatPanel{display:flex;flex-direction:column;gap:8px;max-width:min(430px,92vw)}
#cheatPanel h3{margin:0;font-family:var(--f-title);font-size:16px;color:var(--gold)}
#cheatPanel small{color:var(--muted);font-size:13px}
#cheatPanel input{font:15px var(--f-ui);padding:6px 8px;background:#0e1510;color:var(--ink);border:0;box-shadow:inset 0 0 0 2px #2a3c2f}
#cheatGrid{display:grid;grid-template-columns:repeat(auto-fill,44px);gap:4px;max-height:min(52vh,440px);overflow:auto;padding:2px}
#cheatGrid button{width:44px;height:44px;display:grid;place-items:center;border:0;cursor:pointer;background:#111914;box-shadow:inset 2px 2px 0 var(--edge-dark),inset -2px -2px 0 #2a3c2f}
#cheatGrid button:hover{background:#22331f}
#cheatGrid img{width:32px;height:32px;image-rendering:pixelated;pointer-events:none}`;document.head.appendChild(st);}
const cheatBtn=document.createElement('button');cheatBtn.className='ccb';cheatBtn.id='invCheat';cheatBtn.textContent='Cheat-Items';
{const ref=document.getElementById('invSpells')||document.getElementById('invCraft');ref.after(cheatBtn);}
const cheatPanel=document.createElement('div');cheatPanel.id='cheatPanel';cheatPanel.hidden=true;
cheatPanel.innerHTML='<h3>Alle Gegenstände</h3><small>Linksklick: ganzer Stapel · Rechtsklick: einzeln. Danach in einen Platz legen.</small><input id="cheatSearch" placeholder="Suchen …" autocomplete="off" spellcheck="false"><div id="cheatGrid"></div>';
document.querySelector('#inventory .inv-body').prepend(cheatPanel);
let cheatIds=null;
function cheatList(){if(!cheatIds)cheatIds=Object.keys(ITEMS).filter(id=>ITEMS[id].icon&&ITEMS[id].name).sort((a,b)=>ITEMS[a].name.localeCompare(ITEMS[b].name,'de'));return cheatIds;}
function renderCheatGrid(){const q=norm($('cheatSearch').value||'');
  $('cheatGrid').innerHTML=cheatList().filter(id=>!q||norm(ITEMS[id].name).includes(q)||norm(id).includes(q)).map(id=>`<button data-id="${id}" title="${esc(ITEMS[id].name)}"><img src="${ITEMS[id].icon}" alt=""></button>`).join('');}
function cheatTake(id,one){const it=ITEMS[id],max=stackOf(id);
  if(cursor&&cursor.id===id){cursor.n=Math.min(max,cursor.n+(one?1:max));}else{cursor={id,n:one?1:max};if(it.dur)cursor.d=it.dur;}
  renderCursor();Snd.pickup();$('invtip').textContent=it.name+(cursor.n>1?' · '+cursor.n:'');}
$('cheatGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)cheatTake(b.dataset.id,false);});
$('cheatGrid').addEventListener('contextmenu',e=>{const b=e.target.closest('button[data-id]');if(b){e.preventDefault();cheatTake(b.dataset.id,true);}});
$('cheatGrid').addEventListener('mouseover',e=>{const b=e.target.closest('button[data-id]');if(b)$('invtip').textContent=ITEMS[b.dataset.id].name;});
$('cheatSearch').addEventListener('input',renderCheatGrid);
$('cheatSearch').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.target.blur();}});
cheatBtn.addEventListener('click',()=>{Snd.click();cheatPanel.hidden=!cheatPanel.hidden;if(!cheatPanel.hidden){renderCheatGrid();$('cheatSearch').focus();}cheatBtn.classList.toggle('on',!cheatPanel.hidden);});
// Knopf nur im Cheat-Modus zeigen
{const a=openInventory;openInventory=function(){const r=a.apply(this,arguments);const on=cheatOn();cheatBtn.hidden=!on;if(!on){cheatPanel.hidden=true;cheatBtn.classList.remove('on');}return r;};}
