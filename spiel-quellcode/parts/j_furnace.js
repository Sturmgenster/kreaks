/* =========================================================
   V62 · Schmelzofen: Das Fenster zeigt den Ofen über dem eigenen Inventar.
   Erz, Brennstoff und Ergebnis sind Slots. Sachen zieht man einfach hinein.
   Der Ofen arbeitet weiter, auch wenn das Fenster zu ist.
   ========================================================= */
const SMELT={iron_ore:{out:'iron_ingot',n:1,f:1},bauxite:{out:'alu_ingot',n:2,f:1},silver_ore:{out:'silver_ingot',n:1,f:1},gold_ore:{out:'gold_ingot',n:1,f:1},
  mythril_ore:{out:'mythril_ingot',n:1,f:2},adamant_ore:{out:'adamant_ingot',n:1,f:3},meat:{out:'roastmeat',n:1,f:.5},clay:{out:'stone',n:2,f:.5}};
const smeltOf=id=>SMELT[id]||(id&&isWood(id)?{out:'coal',n:2,f:.5}:null);
const FUELV=id=>id==='coal'?4:id==='peat'?2.5:isWood(id)?1:id==='stick'?.25:0;
const SMELT_T=6;
function furnState(key){FLAGS.furnSt=FLAGS.furnSt||{};let S=FLAGS.furnSt[key];if(!S)S=FLAGS.furnSt[key]={in:null,fuel:null,out:null,prog:0,heat:0};return S;}
function furnStep(S,dt){const R=S.in&&smeltOf(S.in.id);const can=R&&S.in.n>=R.n&&(!S.out||(S.out.id===R.out&&S.out.n<stackOf(R.out)));
  if(!can){S.prog=0;if(S.heat>0)S.heat=Math.max(0,S.heat-dt*.02);return false;}
  if(S.heat<R.f-1e-6){if(S.fuel&&S.fuel.n>0){S.heat+=FUELV(S.fuel.id);S.fuel.n--;if(!S.fuel.n)S.fuel=null;}else{S.prog=0;return false;}}
  S.prog+=dt/SMELT_T;if(S.prog>=1){S.prog=0;S.heat-=R.f;S.in.n-=R.n;if(S.in.n<=0)S.in=null;if(S.out)S.out.n++;else S.out={id:R.out,n:1};}return true;}
const furnOpen=()=>!!(cont&&typeof cont.kind==='string'&&cont.kind.startsWith('furn:'));
let furnT=0;
function updateFurnaces(dt){if(!FLAGS.furnSt)return;furnT+=dt;if(furnT<.25)return;const st=furnT;furnT=0;
  for(const k in FLAGS.furnSt){const S=FLAGS.furnSt[k],o0=S.out?S.out.n:0,i0=S.in?S.in.n:0,f0=S.fuel?S.fuel.n:0,on=furnStep(S,st);S.on=on;
    if(furnOpen()&&cont.kind==='furn:'+k&&((S.out?S.out.n:0)!==o0||(S.in?S.in.n:0)!==i0||(S.fuel?S.fuel.n:0)!==f0))renderContainer();
    if(on&&state==='playing'&&Math.random()<st*3){const f=FURN.find(f=>f.key===k);if(f&&Math.hypot(f.x-P.x,f.z-P.z)<40)spawnParticle(f.x+(Math.random()-.5)*.3,f.y+1.5,f.z+(Math.random()-.5)*.3,(Math.random()-.5)*.3,1.2,(Math.random()-.5)*.3,0x6a6a6a,1.6,.3);}}
  if(furnOpen())paintFurnBar();}
// In der Welt über die Tiere-Schleife, bei offenem Inventar über einen eigenen Takt (dann steht die Welt still, der Ofen nicht)
{const u3=updateAnimals;updateAnimals=function(dt){u3(dt);if(state!=='inventory')try{updateFurnaces(dt);}catch(e){if(!updateFurnaces.err){updateFurnaces.err=1;console.error('Ofen',e);}}};}
{let last=performance.now();setInterval(()=>{const n=performance.now(),dt=Math.min(1,(n-last)/1000);last=n;if(state==='inventory'&&furnOpen())try{updateFurnaces(dt);}catch(e){}},250);}
// ---------- Ofen als Behälter im Inventarfenster ----------
(function furnDom(){const st=document.createElement('style');st.textContent=`
#furnBar{display:flex;align-items:center;gap:10px;flex:1;min-width:120px}
#furnBar .fu-arrow{flex:1;height:14px;padding:3px;background:var(--edge-dark);box-shadow:inset 0 0 0 1px #2a3a2e}
#furnBar .fu-arrow i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f2cf6b,#e06a2a)}
#furnBar .fu-fire{width:18px;height:26px;background:var(--edge-dark);display:flex;align-items:flex-end;padding:2px;box-shadow:inset 0 0 0 1px #2a3a2e}
#furnBar .fu-fire i{display:block;width:100%;background:linear-gradient(#ffd060,#e0501e)}
#furnMsg{margin:0;min-height:1.3em;color:var(--leaf);font-size:14px}
#inventory .inv-body.furn{flex-direction:column;align-items:stretch;gap:14px}#inventory .inv-body.furn #contPanel{padding-bottom:12px;border-bottom:2px solid var(--edge-dark)}
#contSpecial.furn{align-items:center;gap:10px;flex-wrap:nowrap}`;document.head.appendChild(st);})();
function furnSpec(key){const S=furnState(key),slot=(k,label,accept)=>({label,get:()=>S[k],set:v=>{if(k==='in'&&(!v||!S.in||v.id!==S.in.id))S.prog=0;S[k]=v;},one:false,accept});
  return{title:'Schmelzofen',sub:'Zieh Erz und Brennstoff aus deinem Inventar in die Slots. Kohle brennt am längsten.',bag:[],furn:key,
    slots:[slot('in','Erz',id=>!!smeltOf(id)),slot('fuel','Feuer',id=>FUELV(id)>0),slot('out','Barren',()=>false)]};}
{const cs0=contSpec;contSpec=function(kind){if(typeof kind==='string'&&kind.startsWith('furn:'))return furnSpec(kind.slice(5));return cs0(kind);};}
function paintFurnBar(){const S=furnState(cont.spec.furn),p=$('fuProg'),h=$('fuHeat'),m=$('furnMsg');if(!p||!m)return;
  p.style.width=Math.round(S.prog*100)+'%';h.style.height=Math.min(100,Math.round(S.heat/4*100))+'%';
  const R=S.in&&smeltOf(S.in.id);m.textContent=!S.in?'Leg ein Erz ein. Holz wird hier zu Kohle.':S.in.n<R.n?`Dafür brauchst du ${R.n} Stück.`:S.on?`Schmilzt zu ${ITEMS[R.out].name} …`:
    (S.out&&S.out.id!==R.out)?'Nimm erst das Fertige heraus.':(!S.fuel&&S.heat<R.f)?'Es fehlt Brennstoff.':'Bereit.';}
{const rc0=renderContainer;renderContainer=function(){rc0();const sp=$('contSpecial'),g=$('contGrid');let fm=$('furnMsg');
  const ib=document.querySelector('#inventory .inv-body');ib.classList.toggle('furn',furnOpen());if(!furnOpen()){sp.classList.remove('furn');if(fm)fm.remove();g.hidden=false;return;}
  sp.classList.add('furn');g.hidden=true;const els=sp.children;
  const fb=document.createElement('div');fb.id='furnBar';fb.innerHTML='<div class="fu-fire" title="Glut"><i id="fuHeat"></i></div><div class="fu-arrow" title="Fortschritt"><i id="fuProg"></i></div>';
  if(els[2])sp.insertBefore(fb,els[2]);else sp.appendChild(fb);
  if(!fm){fm=document.createElement('p');fm.id='furnMsg';$('contPanel').appendChild(fm);}paintFurnBar();};}
{const cc0=closeContainer;closeContainer=function(){const was=furnOpen();cc0();const fm=$('furnMsg');if(fm)fm.remove();const g=$('contGrid');if(g)g.hidden=false;const sp=$('contSpecial');if(sp)sp.classList.remove('furn');const ib=document.querySelector('#inventory .inv-body');if(ib)ib.classList.remove('furn');if(was)saveGame();};}
// Ins Ergebnis kann man nichts legen, nur herausnehmen (auch auf einen Stapel in der Hand)
{const sc0=contSpecialClick;contSpecialClick=function(i,right,shift){if(furnOpen()&&i===2&&cursor){const q=cont.spec.slots[2],s=q.get();
    if(s&&s.id===cursor.id&&!right){const k=Math.min(stackOf(s.id)-cursor.n,s.n);cursor.n+=k;s.n-=k;if(!s.n)q.set(null);gainXP(.3*k);afterCont();}return;}
  const s0=furnOpen()&&i===2&&cont.spec.slots[2].get(),n0=s0?s0.n:0;sc0(i,right,shift);if(n0&&!cont.spec.slots[2].get())gainXP(.3*n0);};}
// Shift-Klick im eigenen Inventar legt Erz bzw. Brennstoff direkt in den Ofen
function invIndexOf(el){let i=slotEls.grid.indexOf(el);if(i>=0)return i;i=slotEls.hot.indexOf(el);return i>=0?HOT0+i:-1;}
document.getElementById('inventory').addEventListener('mousedown',e=>{if(!furnOpen()||!e.shiftKey||cursor)return;const el=e.target.closest('.slot');if(!el)return;const idx=invIndexOf(el);if(idx<0)return;const s=inv[idx];if(!s)return;
  const Q=cont.spec.slots,fits=(q,ok)=>ok&&(!q.get()||q.get().id===s.id);const q=fits(Q[0],smeltOf(s.id))?Q[0]:fits(Q[1],FUELV(s.id)>0)?Q[1]:null;if(!q)return;
  e.preventDefault();e.stopImmediatePropagation();const cur=q.get(),k=Math.min(s.n,stackOf(s.id)-(cur?cur.n:0));if(k<=0)return;q.set({id:s.id,n:(cur?cur.n:0)+k});s.n-=k;if(!s.n)inv[idx]=null;afterCont();},true);
{const uf0=useFurn;useFurn=function(f){if(f.type==='furnace'){furnState(f.key);openContainer('furn:'+f.key);return true;}return uf0(f);};}
// Holzkohle: 2 Holz im Ofen werden zu 1 Kohle. Das alte Ofen-Rezept fällt weg.
for(let i=RECIPES.length-1;i>=0;i--)if(RECIPES[i].st==='furnace')RECIPES.splice(i,1);
/* ---- Ziehen und Ablegen für alle Slots im Inventarfenster ----
   Bisher: anklicken, dann woanders anklicken. Jetzt geht auch: gedrückt halten, ziehen, loslassen. */
{let dragSt=null;
  document.addEventListener('mousedown',e=>{if(state!=='inventory'||e.button!==0||e.shiftKey||!e.isTrusted){if(e.isTrusted)dragSt=null;return;}dragSt={had:!!cursor,x:e.clientX,y:e.clientY};},true);
  document.addEventListener('mouseup',e=>{const d=dragSt;dragSt=null;if(!d||state!=='inventory'||d.had||!cursor||e.button!==0)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)return;
    const el=document.elementFromPoint(e.clientX,e.clientY),slot=el&&el.closest('#inventory .slot');if(!slot)return;
    slot.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true,button:0,clientX:e.clientX,clientY:e.clientY}));});}
