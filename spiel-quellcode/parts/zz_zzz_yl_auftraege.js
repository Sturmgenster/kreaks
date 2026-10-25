/* =========================================================
   0.0.140 · Aufträge, Bestiarium und Errungenschaften
   - Schwarze Bretter: auf jedem Dorfplatz, in Coda und vor dem Tor von Sturmburg. Jedes Brett hat jeden Tag
     3 neue Aufträge: Monsterjagd, Wildtiere, Lieferungen, Gewölbe-Wächter, Gefangene befreien.
     Man kann bis zu 3 Aufträge gleichzeitig haben. Jagd-Aufträge zahlen sofort, Lieferungen gibt man an einem Brett ab.
   - Bestiarium (Chronik, Taste J): jede besiegte Kreatur wird eingetragen, mit Bild, Werten und einer kurzen Beschreibung.
   - Errungenschaften (Chronik, Taste J): 34 Stück in drei Stufen. Die schweren sind wirklich schwer.
   ========================================================= */
const BNF=()=>FLAGS.bn||(FLAGS.bn={act:[],done:0,tk:{}});
const STX=()=>FLAGS.stx||(FLAGS.stx={kills:0,guards:{},pris:0,books:0,maxFl:0,biomes:{},bosses:{},mimic:0,pvp:0,fall:0,animals:0});
const BEST=()=>FLAGS.best||(FLAGS.best={});
UI_STATES.add('board');try{PASSIVE_STATES.add('board');}catch(e){}
// ---------- Stil ----------
(()=>{const st=document.createElement('style');st.textContent=`
#bnOv .panel{width:min(760px,100%);max-height:calc(100vh - 40px);display:flex;flex-direction:column;gap:10px}
#bnBody{overflow:auto;min-height:0;display:flex;flex-direction:column;gap:14px}
#bnBody h3,#jrAlt h3{font-family:var(--f-title);font-weight:400;font-size:13px;letter-spacing:.12em;color:var(--gold);margin:4px 0 2px}
.bn-card{display:flex;gap:12px;align-items:center;background:var(--panel-2);padding:10px 12px;box-shadow:inset 0 -3px 0 var(--edge-dark)}
.bn-card .bi{font-size:24px;width:30px;text-align:center;flex:none}
.bn-card .bt{flex:1;min-width:0}.bn-card b{display:block;font-size:16px}.bn-card small{display:block;color:var(--muted);font-size:13px;line-height:1.35}
.bn-card .rw{color:#e8c870;font-size:13px;margin-top:3px}
.bn-card.off{opacity:.45}
.bn-card button{flex:none;width:auto!important;min-width:0!important;white-space:nowrap}
.bn-card em.bn-empty{flex:none}
.bn-empty{color:var(--muted);font-style:italic}
#jrTabs{display:flex;gap:6px;flex-wrap:wrap}
#jrTabs button{border:0;background:var(--panel-2);color:var(--ink);font:inherit;font-size:15px;padding:6px 14px;cursor:pointer;box-shadow:inset 0 -3px 0 var(--edge-dark)}
#jrTabs button.on{box-shadow:inset 0 0 0 2px var(--gold);color:var(--gold)}
#jrAlt{overflow:auto;min-height:0}
.be-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;margin-bottom:12px}
.be-c{background:var(--panel-2);border:0;color:var(--ink);font:inherit;padding:6px 4px 5px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;box-shadow:inset 0 -3px 0 var(--edge-dark)}
.be-c img{width:56px;height:56px;object-fit:contain;image-rendering:pixelated}.be-c.unk img{filter:brightness(0) opacity(.55)}
.be-c span{font-size:12px;line-height:1.15;text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis}.be-c em{font-size:11px;color:var(--muted);font-style:normal}
.be-c.on{box-shadow:inset 0 0 0 2px var(--gold)}
.be-det{display:flex;gap:14px;background:var(--panel-2);padding:12px;margin-bottom:12px}.be-det img{width:110px;height:110px;object-fit:contain;image-rendering:pixelated;flex:none}
.be-det h4{margin:0 0 4px;font-size:18px}.be-det p{margin:4px 0;font-size:14px;line-height:1.4}.be-det .st{color:var(--muted);font-size:13px}
.ach-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px;margin-bottom:12px}
.ach{display:flex;gap:10px;align-items:center;background:var(--panel-2);padding:8px 10px;box-shadow:inset 0 -3px 0 var(--edge-dark)}
.ach i{font-style:normal;font-size:22px;width:34px;height:34px;display:grid;place-items:center;flex:none;border:2px solid #6a5a40;background:#1a1610;filter:grayscale(1) brightness(.6)}
.ach.t1 i{border-color:#a0a8b8}.ach.t2 i{border-color:#e0b040}.ach.got i{filter:none}
.ach b{display:block;font-size:15px}.ach small{display:block;font-size:12px;color:var(--muted);line-height:1.3}.ach .pg{color:#c8b890}
.ach:not(.got) b{color:var(--muted)}
#achPop{position:fixed;top:118px;left:50%;transform:translate(-50%,-30px);z-index:60;pointer-events:none;opacity:0;transition:opacity .4s,transform .4s;display:flex;gap:12px;align-items:center;
  background:rgba(24,18,10,.94);border:2px solid #c8a050;padding:8px 16px 8px 10px;font-family:Georgia,serif;color:#f4e6c8;box-shadow:0 6px 24px rgba(0,0,0,.5)}
#achPop.on{opacity:1;transform:translate(-50%,0)}#achPop i{font-style:normal;font-size:30px}#achPop small{display:block;font-size:11px;letter-spacing:.14em;color:#c8a050;text-transform:uppercase}#achPop b{font-size:17px}
#achPop.t2{border-color:#ffd060;box-shadow:0 0 30px rgba(255,200,80,.45)}`;document.head.appendChild(st);
  const ov=document.createElement('div');ov.id='bnOv';ov.className='overlay';ov.hidden=true;ov.innerHTML=`<div class="panel notch" role="dialog" aria-labelledby="bnTitle"><div class="panel-head"><div><h2 id="bnTitle">Schwarzes Brett</h2><p class="craft-sub" id="bnSub"></p></div><button id="bnClose" class="ccb">Schließen</button></div><div id="bnBody"></div></div>`;
  document.body.appendChild(ov);const p=document.createElement('div');p.id='achPop';document.body.appendChild(p);})();
// ---------- Aufträge ----------
const BN_CAT={any:{n:'Monster',ic:'⚔',m:e=>true},untot:{n:'Untote',ic:'💀',m:e=>/Skelett|Zombie|Lich|Gruft|Knochen|Totengräber|Mumie/.test(e.d.name)},spinne:{n:'Spinnen',ic:'🕷',m:e=>/spinn/i.test(e.d.name)},
  daemon:{n:'Dämonen',ic:'👹',m:e=>/Imp|Höllen|Dämonen/.test(e.d.name)},ratte:{n:'Ratten',ic:'🐀',m:e=>/ratte/i.test(e.d.name)}};
const BN_ANI={wolf:['Wölfe','Die Wölfe reißen unsere Schafe. Erlege {n} Wölfe.'],boar:['Wildschweine','Wildschweine verwüsten die Felder. Erlege {n} Wildschweine.'],bear:['Bären','Ein Bär streift ums Dorf. Erlege {n} Bär(en).'],
  fox:['Füchse','Füchse im Hühnerstall! Erlege {n} Füchse.'],deer:['Rehe','Wir brauchen Fleisch für den Winter. Erlege {n} Rehe.']};
const BN_DEL=[['wood',20,1],['stone',15,1],['meat',6,3],['iron_ore',6,4],['coal',8,2],['wool',6,3],['mushroom',6,2],['wheat',10,2],['feather',8,2],['bones',8,2],['clay',8,2],['swampherb',4,4],['goldfish',3,5],['seafish',3,5]];
const BN_HUNT_T={any:['Monsterplage','Die Nächte sind gefährlich geworden. Besiege {n} Monster, egal wo.'],untot:['Unruhige Tote','Die Toten wollen nicht ruhen. Besiege {n} Untote.'],spinne:['Spinnennester','In den Höhlen wimmelt es von Spinnen. Besiege {n} Spinnen.'],
  daemon:['Dämonenbrut','Dämonen wurden gesehen. Besiege {n} Dämonen.'],ratte:['Rattenjagd','Die Ratten fressen unsere Vorräte. Besiege {n} Ratten.']};
const bnDay=()=>FLAGS.day||0;
function bnHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function bnOffers(b){const day=bnDay(),r=mulberry32((bnHash(b.id)^Math.imul(day+1,2654435761)^(WSEED|0))>>>0),out=[],used=new Set();
  const fish=b.k==='f',elf=b.k==='e',city=b.k==='c';
  for(let i=0;i<3;i++){let t=null;for(let tries=0;tries<12&&!t;tries++){const q=r();let k=q<.34?'hunt':q<.52?'ani':q<.8?'del':q<.9?'pris':'guard';if(used.has(k)&&k!=='del')continue;
      if(k==='hunt'){const cats=Object.keys(BN_CAT),c=cats[(r()*cats.length)|0],n=c==='any'?6+((r()*7)|0):3+((r()*4)|0),T=BN_HUNT_T[c];t={k,cat:c,n,t:T[0],d:T[1].replace('{n}',n),ic:BN_CAT[c].ic,rw:{s:n*(c==='any'?2:4),xp:n*(c==='any'?12:20)}};}
      else if(k==='ani'){const a=Object.keys(BN_ANI)[(r()*5)|0],n=a==='bear'?1:2+((r()*3)|0),T=BN_ANI[a];t={k,an:a,n,t:T[0]+' jagen',d:T[1].replace('{n}',n),ic:'🏹',rw:{s:n*(a==='bear'?14:5),xp:n*(a==='bear'?60:20)}};}
      else if(k==='del'){let L=BN_DEL.filter(x=>ITEMS[x[0]]);if(fish)L=L.filter(x=>!['swampherb','wheat'].includes(x[0]));if(elf)L=L.filter(x=>!['coal','iron_ore','seafish'].includes(x[0]));const[id,n0,v]=L[(r()*L.length)|0];
        if(used.has('del:'+id))continue;used.add('del:'+id);const n=Math.max(2,Math.round(n0*(.7+r()*.6)));t={k,item:id,n,t:'Lieferung: '+ITEMS[id].name,d:`Wir brauchen ${n}× ${ITEMS[id].plural||ITEMS[id].name}. Bring sie zu einem Schwarzen Brett.`,ic:'📦',rw:{s:Math.max(3,Math.round(n*v*.9)),xp:n*v*3}};}
      else if(k==='pris'){const n=1+((r()*2)|0);t={k,n,t:'Verschleppt',d:`Leute aus der Gegend wurden in die Gewölbe verschleppt. Befreie ${n} Gefangene${n>1?'':'n'}.`,ic:'⛓',rw:{s:20*n,xp:120*n}};}
      else{t={k:'guard',n:1,t:'Der Wächter',d:'Besiege einen Gewölbe-Wächter (ganz unten in einem Gewölbe).',ic:'👑',rw:{c:1,s:15,xp:400}};}
      if(t)used.add(k);}
    if(city&&t)t.rw.s=Math.round(t.rw.s*1.25);t.id=b.id+'|'+day+'|'+i;t.from=b.name;t.have=0;out.push(t);}
  return out;}
function bnGive(t){const L=[];if(t.rw.c)L.push(['coin',t.rw.c]);if(t.rw.s)L.push(['silver',t.rw.s]);lootGive(L,null);try{gainXP(t.rw.xp||0);}catch(e){}const F=BNF();F.done=(F.done||0)+1;
  showArea('Auftrag erledigt: '+t.t);toast(`Belohnung: ${bnRwTxt(t.rw)}`);achCheck();}
const bnRwTxt=rw=>[rw.c?rw.c+' Kreaker':'',rw.s?rw.s+' Silber':'',rw.xp?rw.xp+' XP':''].filter(Boolean).join(', ');
const bnProg=t=>t.k==='del'?`${Math.min(countItem(t.item),t.n)}/${t.n}`:`${t.have}/${t.n}`;
function bnEvent(kind,x){const F=BNF();let ch=false;for(const t of F.act.slice()){if(t.k==='del')continue;let hit=false;
    if(kind==='kill'&&t.k==='hunt'&&BN_CAT[t.cat].m(x))hit=true;if(kind==='ani'&&t.k==='ani'&&x===t.an)hit=true;if(kind==='pris'&&t.k==='pris')hit=true;if(kind==='guard'&&t.k==='guard')hit=true;
    if(hit){t.have++;ch=true;if(t.have>=t.n){F.act.splice(F.act.indexOf(t),1);bnGive(t);}}}
  if(ch){renderQuests();saveGame();}}
// HUD: aktive Aufträge unter den Aufgaben
{const a=renderQuests;renderQuests=function(){a();try{const box=$('quests'),F=FLAGS.bn;if(!box||!F||!F.act.length||state==='menu')return;if(box.hidden){box.hidden=false;box.innerHTML='<h4>Aufgaben</h4>';}
  box.insertAdjacentHTML('beforeend',F.act.map(t=>`<div class="q"><b>${t.ic} ${t.t}</b><span>${bnProg(t)}</span></div>`).join(''));}catch(e){}};}
// ---------- Das Brett (Fenster) ----------
const BN={cur:null,boards:[],near:null,city:null,bt:0};
function bnOpen(b){if(state!=='playing')return;BN.cur=b;state='board';keys.clear();promptEl.hidden=true;if(document.pointerLockElement){suppressPause=true;document.exitPointerLock();}try{Snd.click();}catch(e){}bnRender();show('bnOv',true);updateLockHint();}
function bnClose(){show('bnOv',false);state='playing';BN.cur=null;lock();updateLockHint();renderQuests();}
function bnRender(){const b=BN.cur;if(!b)return;const F=BNF(),day=bnDay(),key=b.id+'|'+day,tk=F.tk[key]||[];$('bnTitle').textContent='Schwarzes Brett · '+b.name;
  $('bnSub').textContent=`Neue Aufträge jeden Tag · ${F.act.length}/3 angenommen · ${F.done||0} erledigt`;const off=bnOffers(b);
  let h='<h3>Aushänge</h3>'+off.map((t,i)=>{const taken=tk.includes(i);return`<div class="bn-card${taken?' off':''}"><div class="bi">${t.ic}</div><div class="bt"><b>${t.t}</b><small>${t.d}</small><div class="rw">Belohnung: ${bnRwTxt(t.rw)}</div></div>
    ${taken?'<em class="bn-empty">angenommen</em>':`<button class="pbtn notch small" data-take="${i}"${F.act.length>=3?' disabled title="Du hast schon 3 Aufträge"':''}>Annehmen</button>`}</div>`;}).join('');
  h+='<h3>Deine Aufträge</h3>'+(F.act.length?F.act.map((t,i)=>{const can=t.k==='del'&&countItem(t.item)>=t.n;return`<div class="bn-card"><div class="bi">${t.ic}</div><div class="bt"><b>${t.t} · ${bnProg(t)}</b><small>${t.d}</small><div class="rw">Von: ${t.from} · Belohnung: ${bnRwTxt(t.rw)}</div></div>
    ${t.k==='del'?`<button class="pbtn notch small" data-give="${i}"${can?'':' disabled'}>Abgeben</button>`:''}<button class="pbtn notch small" data-drop="${i}">Aufgeben</button></div>`;}).join(''):'<p class="bn-empty">Du hast gerade keine Aufträge.</p>');
  $('bnBody').innerHTML=h;}
$('bnBody').addEventListener('click',e=>{const B=e.target.closest('button');if(!B||B.disabled)return;const F=BNF(),b=BN.cur;if(!b)return;e.stopPropagation();try{Snd.click();}catch(_){}
  if(B.dataset.take!=null){const i=+B.dataset.take,key=b.id+'|'+bnDay();if(F.act.length>=3)return;const t=bnOffers(b)[i];F.tk[key]=F.tk[key]||[];if(F.tk[key].includes(i))return;F.tk[key].push(i);F.act.push(t);
    for(const k of Object.keys(F.tk))if(+k.split('|')[1]<bnDay()-1)delete F.tk[k];toast('Auftrag angenommen: '+t.t);}
  if(B.dataset.give!=null){const t=F.act[+B.dataset.give];if(t&&t.k==='del'&&countItem(t.item)>=t.n){removeItem(t.item,t.n);renderInv();F.act.splice(F.act.indexOf(t),1);bnGive(t);}}
  if(B.dataset.drop!=null){const t=F.act[+B.dataset.drop];if(t){F.act.splice(F.act.indexOf(t),1);toast('Auftrag aufgegeben: '+t.t);}}
  saveGame();bnRender();renderQuests();});
$('bnClose').onclick=e=>{e.stopPropagation();bnClose();};
document.addEventListener('keydown',e=>{if(state==='board'&&(e.code==='Escape'||e.code==='KeyE'||e.code==='KeyF')){e.preventDefault();e.stopImmediatePropagation();bnClose();}},true);
// ---------- Bretter in der Welt ----------
let BN_PAPER=null;function bnPaper(){if(BN_PAPER)return BN_PAPER;const c=document.createElement('canvas');c.width=64;c.height=40;const x=c.getContext('2d');
  const cols=['#ece0c0','#e4d4b0','#f2ead2','#dcc8a0','#e8dcc4'];for(let i=0;i<5;i++){x.fillStyle=cols[i];x.fillRect(i*12+1,0,11,40);x.fillStyle='rgba(60,40,20,.55)';for(let l=0;l<7;l++){const w=3+((i*7+l*5)%6);x.fillRect(i*12+2,5+l*5,w,1);}x.fillStyle='#8a2a1a';x.fillRect(i*12+6,1,2,2);}
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;BN_PAPER=[0,1,2,3,4].map(i=>{const tt=t.clone();tt.needsUpdate=true;tt.repeat.set(11/64,1);tt.offset.set((i*12+1)/64,0);return new THREE.MeshLambertMaterial({map:tt});});return BN_PAPER;}
function bnBuild(C,M,elf){C.b(M.beamD,.16,2.5,.16,-1.05,1.25,0);C.b(M.beamD,.16,2.5,.16,1.05,1.25,0);C.b(M.plankB,2.1,1.25,.1,0,1.6,0);C.b(M.beamD,2.36,.12,.18,0,2.27,0);C.b(M.beamD,2.3,.1,.16,0,.96,0);
  try{vRoof(C.s(0,2.38,0,0),elf?(M.leafRoof||M.shingle):M.shingle,null,2.7,.8,0,.5,.12);}catch(e){}const PA=bnPaper();
  const L=[[-.7,1.75,.08],[-.2,1.62,-.06],[.32,1.78,.05],[.75,1.6,-.04],[-.48,1.25,.03],[.5,1.22,-.07]];L.forEach(([x,y,rz],i)=>C.b(PA[i%5],.36,.44,.02,x,y,.065,0,0,rz,'fit'));}
// Dorfplatz: Brett aufstellen
{const a=vl2Layout;vl2Layout=function(g){const had=!!g.lay,L=a(g);if(had||L.deco.some(d=>d.t==='board'))return L;try{
  const segD=(x,z)=>{let m=1e9;for(const rd of L.roads)for(let i=0;i+1<rd.pts.length;i++){const p=rd.pts[i],q=rd.pts[i+1],dx=q.x-p.x,dz=q.z-p.z,l2=dx*dx+dz*dz||1;let t=((x-p.x)*dx+(z-p.z)*dz)/l2;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-p.x-dx*t,z-p.z-dz*t)-(rd.hw||1));}return m;};
  const free=(x,z)=>L.deco.every(d=>Math.hypot(d.x-x,d.z-z)>2.4)&&L.lots.every(o=>Math.hypot(o.x-x,o.z-z)>Math.max(o.W,o.D)/2+2.4)&&segD(x,z)>.9&&getHeight(x,z)>WATER+.5;
  for(const R of[L.pr+1.4,L.pr+2.6,L.pr+4])for(let k=0;k<24;k++){const ph=k/24*6.283+.13,x=g.x+Math.cos(ph)*R,z=g.z+Math.sin(ph)*R;if(!free(x,z))continue;L.deco.push({t:'board',x,z,ry:Math.atan2(g.x-x,g.z-z)});return L;}}catch(e){console.error('Brett',e);}return L;};}
{const a=vl2Deco;vl2Deco=function(V,M,L,d,B){if(d.t!=='board')return a(V,M,L,d,B);const h=getHeight(d.x,d.z),C=vCx(V,vM(d.x,h,d.z,0,d.ry||0,0));bnBuild(C,M,L.elf);
  const c=Math.cos(d.ry||0),s=Math.sin(d.ry||0);B.sol.push(solAdd({x:d.x,z:d.z,hw:1.2,hd:.18,y0:h-1,y1:h+2.5,rot:-(d.ry||0),solid:1}));};}
// Coda und Sturmburg
const BN_CITY=[{id:'coda',name:'Coda',k:'c',x:5.4,z:707,ry:-Math.PI/2},{id:'sturmburg',name:'Sturmburg',k:'c',x:6.5,z:()=>WALL_Z+11,ry:-Math.PI/2}];
function bnCityBuild(){if(BN.city)return;const grp=new THREE.Group(),V=new VB2(),M=vl2Mats();BN.city=[];
  for(const b of BN_CITY){const z=typeof b.z==='function'?b.z():b.z,h=getHeight(b.x,z);bnBuild(vCx(V,vM(b.x,h,z,0,b.ry,0)),M,false);solAdd({x:b.x,z,hw:1.2,hd:.18,y0:h-1,y1:h+2.5,rot:-b.ry,solid:1});BN.city.push({id:b.id,name:b.name,k:'c',x:b.x,z,ry:b.ry});}
  V.build(grp);scene.add(grp);}
function bnBoards(){const out=(BN.city||[]).slice();try{for(const B of VLG.built.values()){const g=B.g,L=g&&g.lay;if(!L)continue;for(const d of L.deco)if(d.t==='board')out.push({id:g.id,name:g.name||'Dorf',k:g.k,x:d.x,z:d.z,ry:d.ry});}}catch(e){}return out;}
function bnUsable(){if(state!=='playing'||DGX.on)return null;let best=null,bd=3;for(const b of BN.boards){const fx=b.x+Math.sin(b.ry)*.7,fz=b.z+Math.cos(b.ry)*.7,d=Math.hypot(fx-P.x,fz-P.z);if(d<bd){bd=d;best=b;}}return best;}
{const a=storyUse;storyUse=function(){const b=bnUsable();if(b){bnOpen(b);return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){const b=bnUsable();if(b)return'Schwarzes Brett ansehen';return a();};}
// ---------- Bestiarium ----------
const BE_SKIP=/^(Bürger|Fischer|Elf|Abenteurer|Jorin|Mitspieler|Kreak|Bewohner|Affenmensch|Urmensch|Spinnenei)$/;
let BE_IDX=null;
function beIdx(){if(BE_IDX)return BE_IDX;const M=new Map();for(const[k,d]of Object.entries(DT)){if(d.fac!=='demon'&&d.fac!=='neutral')continue;const n=d.name.split(',')[0].trim();if(BE_SKIP.test(n)||k==='shkDuel'||k==='mpProxy')continue;
    if(!M.has(n))M.set(n,{n,full:d.name,keys:[k],boss:!!d.boss,hp:d.hp,dmg:d.dmg||0,anim:false});else M.get(n).keys.push(k);}
  for(const[k,a]of Object.entries(ANIMALS))if(!['cow','horse','donkey','sheep'].includes(k))M.set('tier:'+k,{n:a.name,full:a.name,keys:[k],boss:false,hp:a.hp||0,dmg:0,anim:true,key:'tier:'+k});
  BE_IDX=[...M.entries()].map(([key,v])=>Object.assign(v,{key}));return BE_IDX;}
const BE_LORE=[[/Vorgrath/,'Der Schlafende. Älter als die Dämonen, älter als Kreak. Er wurde nicht besiegt, nur wieder zum Schlafen gebracht.'],[/Morvek/,'Einst ein Lehrer aus Sturmburg. Shikayas Dämonen nahmen ihm alles. In der Stille fand er Vorgrath.'],
  [/Kultist der Tiefe/,'Die Schweigenden, die ganz in die Stille gegangen sind. Sie tragen Vorgraths Zeichen und schießen mit violettem Licht.'],[/Kultist/,'Die Schweigenden. Sie sprechen nie, stehen immer zusammen und knien nachts im Kreis vor den Dörfern.'],
  [/Mimic/,'Sieht aus wie eine Truhe. Ist keine Truhe. Wer zu gierig ist, wird gebissen.'],[/Lich/,'Zauberer, die den Tod betrogen haben. Ihre Magie ist stark, ihre Knochen sind zerbrechlich.'],
  [/Skelett|Knochen/,'Knochen, die nicht ruhen wollen. Sie halten nicht viel aus, aber sie kommen in Gruppen.'],[/Zombie|Gruft|Totengräber/,'Langsam und zäh. Was einmal begraben war, sollte begraben bleiben.'],
  [/spinn|Weberkönigin/i,'Achtbeinig und giftig. Spinnen lauern in Höhlen und alten Gewölben und spinnen dort ihre Netze.'],[/ratte|Schlammzahn|Grauzahn/i,'Ratten sind überall, wo Vorräte sind. Allein harmlos, im Rudel gefährlich.'],
  [/Imp|Höllen|Dämonen|Malphas|Shikaya|Vargoth|Gruumak|Ssylra|Kharz|Aschenschlund/,'Ein Geschöpf der Unterwelt. Seit Shikayas Fall sind es weniger geworden, aber verschwunden sind sie nicht.'],
  [/Troll|Grokk/,'Groß, dumm und unglaublich zäh. Ein Troll schlägt hart, aber langsam.'],[/Pilz|Lunar|Sporling/,'Aus den Sporen des Mondes geboren. Sie wachsen dort, wo Licht fehlt.'],
  [/Vampir|Graf/,'Edel gekleidet und uralt. Vampire meiden das Licht und lieben das Blut.'],[/Frost|Hrimgar/,'Ein Wächter aus ewigem Eis. Seine Kälte lässt Waffen schwer werden.'],[/Pharao|Amun|Mumie/,'Ein König aus Sand und Gold, der sein Grab bis heute bewacht.'],
  [/beule|Schlundmaul|Gehirn/i,'Etwas Falsches. Fleisch, das wächst, wo es nicht wachsen sollte.'],[/Wolf|Graumähne/,'Ein Jäger im Rudel. Wölfe greifen selten allein an.'],[/Nussknacker|Lebkuchen/,'Ein Bewohner des Zuckerlands. Süß, aber nicht ungefährlich.'],
  [/Hase|Fuchs|Reh|Elch|Bär|Wildschwein/,'Ein Tier der Wildnis. Fleisch, Fell und Leder sind in jedem Dorf willkommen.']];
const beLore=n=>{for(const[re,t]of BE_LORE)if(re.test(n))return t;return'Eine Kreatur dieser Welt. Mehr weiß man noch nicht über sie.';};
function beImg(E){try{if(E.anim){const k=Object.keys(SPR).find(s=>s.startsWith('an_'+E.keys[0])&&s.endsWith('_0'))||Object.keys(SPR).find(s=>s.startsWith('an_'+E.keys[0]));return k?SPR[k].c.toDataURL():'';}
  for(const k of E.keys){const s=sprOf({d:DT[k]},0);if(SPR[s]&&SPR[s].c)return SPR[s].c.toDataURL();}}catch(e){}return'';}
const BE_IMG=new Map();const beImgC=E=>{if(!BE_IMG.has(E.key))BE_IMG.set(E.key,beImg(E));return BE_IMG.get(E.key);};
function beCount(){const B=BEST();return beIdx().filter(E=>B[E.key]>0).length;}
function beKill(e){try{if(!e||!e.d)return;const n=e.d.name.split(',')[0].trim();if(BE_SKIP.test(n))return;const B=BEST();B[n]=(B[n]||0)+1;}catch(_){}}
// ---------- Errungenschaften ----------
const ACH_GUARDS=['dgboss','dgb_frost','dgb_pharao','dgb_troll','dgb_spinne','dgb_rat','dgb_ghoul'];
const ACH_BIOMES=['wald','ebene','nadelwald','redwood','wueste','dschungel','savanne','kueste','meer','schnee','schneeberge','steinwueste','sumpf','candy'];
const ACH=[
 ['erst','Erstes Blut','Besiege dein erstes Monster.',0,'🗡',()=>STX().kills>=1],
 ['jaeger','Jäger','Erlege ein Wildtier.',0,'🏹',()=>STX().animals>=1],
 ['dunkel','Ins Dunkel','Betritt ein Gewölbe.',0,'🕯',()=>STX().maxFl>=1],
 ['befreier','Befreier','Befreie einen Gefangenen aus einem Gewölbe.',0,'⛓',()=>STX().pris>=1],
 ['hilfe','Hilfsbereit','Erledige einen Auftrag vom Schwarzen Brett.',0,'📜',()=>(BNF().done||0)>=1],
 ['buch','Bücherwurm','Lies ein altes Buch in einer Gewölbe-Bibliothek.',0,'📖',()=>STX().books>=1],
 ['forscher','Forscher','Trage 10 Kreaturen ins Bestiarium ein.',0,'🔍',()=>beCount()>=10,()=>[beCount(),10]],
 ['hinab','Hinab','Erreiche die zweite Ebene eines Gewölbes.',0,'🪜',()=>STX().maxFl>=2],
 ['hundert','Monsterschreck','Besiege 100 Monster.',1,'⚔',()=>STX().kills>=100,()=>[STX().kills,100]],
 ['waechter','Wächterbezwinger','Besiege einen Gewölbe-Wächter.',1,'👑',()=>Object.keys(STX().guards).length>=1],
 ['mimic','Falsche Truhe','Besiege einen Mimic.',1,'🧰',()=>STX().mimic>=1],
 ['zehn','Stütze der Dörfer','Erledige 10 Aufträge.',1,'🏘',()=>(BNF().done||0)>=10,()=>[BNF().done||0,10]],
 ['unten','Ganz unten','Erreiche die dritte Ebene eines Gewölbes.',1,'⬇',()=>STX().maxFl>=3],
 ['natur','Naturkundler','Trage 25 Kreaturen ins Bestiarium ein.',1,'🦉',()=>beCount()>=25,()=>[beCount(),25]],
 ['duell','Duellant','Besiege einen anderen Spieler im PvP.',1,'🤺',()=>STX().pvp>=1],
 ['stufe10','Erfahren','Erreiche Level 10.',1,'⭐',()=>(FLAGS.level||0)>=10,()=>[FLAGS.level||0,10]],
 ['reich','Wohlhabend','Besitze 10 Kreaker auf einmal.',1,'💰',()=>wallet()>=3000],
 ['legende','Held der Legende','Besiege Shikaya, die Dämonenkönigin.',1,'🔥',()=>mqAt('end')],
 ['landung','Harte Landung','Überlebe einen Sturz aus mehr als 15 Metern.',1,'🪂',()=>STX().fall>=15],
 ['schlaf','Der Schlaf ist heilig','Versiegle Vorgrath, den Schlafenden.',2,'👁',()=>!!FLAGS.k2won],
 ['tausend','Legende der Jagd','Besiege 1000 Monster.',2,'☠',()=>STX().kills>=1000,()=>[STX().kills,1000]],
 ['allew','Wächter der Wächter','Besiege alle 7 verschiedenen Gewölbe-Wächter.',2,'🏆',()=>ACH_GUARDS.every(k=>STX().guards[k]),()=>[ACH_GUARDS.filter(k=>STX().guards[k]).length,7]],
 ['engel','Von Engeln getragen','Werde bei einem tiefen Sturz von einem Engel aufgefangen.',2,'🪽',()=>(FLAGS.angCatch||0)>=1],
 ['fuenfzig','Held des Volkes','Erledige 50 Aufträge.',2,'🎖',()=>(BNF().done||0)>=50,()=>[BNF().done||0,50]],
 ['lebend','Lebendes Bestiarium','Trage 50 Kreaturen ins Bestiarium ein.',2,'📚',()=>beCount()>=50,()=>[beCount(),50]],
 ['nackt','Ohne Rüstung','Besiege einen Gewölbe-Wächter ohne Rüstung und ohne Helm.',2,'🩲',()=>!!STX().naked],
 ['unberuehrt','Unberührbar','Besiege einen Gewölbe-Wächter, ohne dabei Schaden zu nehmen.',2,'✨',()=>!!STX().clean],
 ['bosse','Bossjäger','Besiege 15 verschiedene Bosse.',2,'💀',()=>Object.keys(STX().bosses).length>=15,()=>[Object.keys(STX().bosses).length,15]],
 ['stufe25','Meister','Erreiche Level 25.',2,'🌟',()=>(FLAGS.level||0)>=25,()=>[FLAGS.level||0,25]],
 ['welt','Weltenbummler','Betritt alle 14 Landschaften der Welt, auch das seltene Zuckerland.',2,'🧭',()=>ACH_BIOMES.every(b=>STX().biomes[b]),()=>[ACH_BIOMES.filter(b=>STX().biomes[b]).length,14]],
 ['sturz','Unkaputtbar','Überlebe einen Sturz aus mehr als 20 Metern.',2,'🦴',()=>STX().fall>=20],
 ['gemetzel','Gemetzel','Besiege 10 Monster innerhalb von 15 Sekunden.',2,'🌪',()=>!!STX().spree],
 ['reich2','Schatzmeister','Besitze 100 Kreaker auf einmal.',2,'👑',()=>wallet()>=30000],
 ['alles','Vollendet','Schalte alle anderen Errungenschaften frei.',2,'🌌',()=>ACH.every(a=>a[0]==='alles'||(FLAGS.ach||{})[a[0]]),()=>[Object.keys(FLAGS.ach||{}).filter(k=>k!=='alles').length,ACH.length-1]]];
const ACHQ=[];let achPopT=0;
function achCheck(){if(state==='menu'||!P.stats)return;const A=FLAGS.ach=FLAGS.ach||{};for(const a of ACH){if(A[a[0]])continue;let ok=false;try{ok=a[5]();}catch(e){}if(ok){A[a[0]]=Math.max(1,bnDay());ACHQ.push(a);}}
  if(ACHQ.length&&achPopT<=0)achShow();}
function achShow(){const a=ACHQ.shift();if(!a)return;const el=$('achPop');el.className=a[3]===2?'t2':'';el.innerHTML=`<i>${a[4]}</i><div><small>Errungenschaft${a[3]===2?' · schwer':''}</small><b>${a[1]}</b></div>`;void el.offsetWidth;el.classList.add('on');achPopT=4.2;
  try{a[3]===2?Snd.levelUp():Snd.chime();}catch(e){}if(a[3]===2)try{gainXP(250);}catch(e){}saveGame();}
// ---------- Ereignisse ----------
const SPREE=[];
{const a=hurtEnt;hurtEnt=function(e,n,by){if(by==='player'&&e&&!e.fht&&!e.dead)e.fht=time;return a(e,n,by);};}
{const a=killEnt;killEnt=function(e,by){const was=e&&e.dead;a(e,by);try{if(was||!e||by!=='player'||!e.d)return;const S=STX();if(e.fac==='demon'||e.d.fac==='demon'||e.d.fac==='neutral'){S.kills++;beKill(e);bnEvent('kill',e);
      SPREE.push(time);while(SPREE.length&&time-SPREE[0]>15)SPREE.shift();if(SPREE.length>=10)S.spree=1;}
    if(e.d===DT.mimic)S.mimic++;if(e.d.boss)S.bosses[e.d.name.split(',')[0].trim()]=1;
    if(e.dgBoss){const k=Object.keys(DT).find(k=>DT[k]===e.d)||'dgboss';S.guards[k]=1;bnEvent('guard');if(!equip.armor&&!equip.helm)S.naked=1;if(e.fht!=null&&!((P.lastDmg||-99)>=e.fht))S.clean=1;}
    achCheck();}catch(_){}};}
{const a=hurtAnimal;hurtAnimal=function(an,n){const was=an&&an.alive;a(an,n);try{if(was&&!an.alive){const S=STX();S.animals++;const B=BEST();B['tier:'+an.type]=(B['tier:'+an.type]||0)+1;bnEvent('ani',an.type);achCheck();}}catch(_){}};}
{const a=dg2Free;dg2Free=function(pr){const was=pr&&pr.freed;a(pr);try{if(!was&&pr.freed){STX().pris++;bnEvent('pris');achCheck();}}catch(_){}};}
{const a=dg2Book;dg2Book=function(...r){try{STX().books++;}catch(_){}const res=a(...r);achCheck();return res;};}
{const a=fallLand;fallLand=function(drop){a(drop);try{if(P.stats&&P.stats.hp>0&&drop>STX().fall)STX().fall=Math.floor(drop);achCheck();}catch(_){}};}
{const a=mpOnMsg;mpOnMsg=function(m,peer){try{if(m&&m.t==='pvpk'&&m.k===MP.pid){STX().pvp++;setTimeout(achCheck,100);}}catch(_){}return a(m,peer);};}
// ---------- Takt ----------
const ACHT={t:0};
function bnTick(dt){if(achPopT>0){achPopT-=dt;if(achPopT<=0){$('achPop').classList.remove('on');if(ACHQ.length)setTimeout(achShow,500);}}if(state==='menu'||!P.stats)return;
  if(!BN.city&&P.x<60000)try{bnCityBuild();}catch(e){BN.city=[];console.error('Bretter',e);}
  BN.bt-=dt;if(BN.bt<=0){BN.bt=.5;BN.boards=bnBoards();}
  ACHT.t-=dt;if(ACHT.t>0)return;ACHT.t=2;const S=STX();
  if(DGX.on&&DGX.d)S.maxFl=Math.max(S.maxFl,(DGX.d.fl||0)+1);
  try{if(!DGX.on&&P.x<60000&&coreDist(P.x,P.z)>40){const b=wlBiomeOf(wlDom(P.x,P.z),P.x,P.z).replace(/_frei$/,'');if(ACH_BIOMES.includes(b))S.biomes[b]=1;}}catch(e){}
  achCheck();}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{bnTick(dt);}catch(e){if(!bnTick.err){bnTick.err=1;console.error('Aufträge',e);}}};}
// ---------- Chronik: Reiter ----------
const JRT={tab:0,sel:null};
(()=>{const head=$('journal').querySelector('.panel-head'),tb=document.createElement('div');tb.id='jrTabs';tb.innerHTML=['Chronik','Aufträge','Bestiarium','Errungenschaften'].map((t,i)=>`<button data-t="${i}" class="${i?'':'on'}">${t}</button>`).join('');head.after(tb);
  const alt=document.createElement('div');alt.id='jrAlt';alt.hidden=true;$('journal').querySelector('.jr-grid').after(alt);
  tb.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();try{Snd.click();}catch(_){}JRT.tab=+b.dataset.t;renderJournal();});
  alt.addEventListener('click',e=>{const b=e.target.closest('.be-c');if(!b)return;e.stopPropagation();try{Snd.click();}catch(_){}JRT.sel=b.dataset.k;renderJournal();alt.scrollTop=0;});})();
{const a=renderJournal;renderJournal=function(){a();try{for(const b of $('jrTabs').children)b.classList.toggle('on',+b.dataset.t===JRT.tab);const grid=$('journal').querySelector('.jr-grid'),alt=$('jrAlt');
  grid.hidden=JRT.tab!==0;alt.hidden=JRT.tab===0;if(JRT.tab===1)alt.innerHTML=jrBounties();else if(JRT.tab===2)alt.innerHTML=jrBestiary();else if(JRT.tab===3)alt.innerHTML=jrAch();}catch(e){console.error('Chronik',e);}};}
function jrBounties(){const F=BNF();return`<h3>Aktive Aufträge (${F.act.length}/3)</h3>`+(F.act.length?F.act.map(t=>`<div class="bn-card" style="margin-bottom:8px"><div class="bi">${t.ic}</div><div class="bt"><b>${t.t} · ${bnProg(t)}</b><small>${t.d}</small><div class="rw">Von: ${t.from} · Belohnung: ${bnRwTxt(t.rw)}</div></div></div>`).join('')
  :'<p class="bn-empty">Keine Aufträge. Schau am Schwarzen Brett auf einem Dorfplatz, in Coda oder vor dem Tor von Sturmburg vorbei.</p>')+`<h3>Erledigt</h3><p>${F.done||0} Aufträge erledigt.</p>`;}
function jrBestiary(){const I=beIdx(),B=BEST(),known=I.filter(E=>B[E.key]>0).length,S=JRT.sel&&I.find(E=>E.key===JRT.sel);let h='';
  if(S){const k=B[S.key]||0;h+=`<div class="be-det"><img src="${beImgC(S)}" alt="" style="${k?'':'filter:brightness(0) opacity(.55)'}"><div><h4>${k?S.full:'???'}</h4>${k?`<p>${beLore(S.n)}</p><p class="st">${S.boss?'Boss · ':''}${S.anim?'Wildtier · ':''}Lebenspunkte: ${S.hp||'?'}${S.dmg?' · Schaden: '+S.dmg:''} · Besiegt: ${k}×</p>`:'<p>Diese Kreatur hast du noch nicht besiegt.</p>'}</div></div>`;}
  const card=E=>{const k=B[E.key]||0;return`<button class="be-c${k?'':' unk'}${JRT.sel===E.key?' on':''}" data-k="${E.key}"><img src="${beImgC(E)}" alt=""><span>${k?E.n:'???'}</span><em>${k?k+'×':''}</em></button>`;};
  const mon=I.filter(E=>!E.boss&&!E.anim),boss=I.filter(E=>E.boss),ani=I.filter(E=>E.anim);
  h+=`<h3>Kreaturen (${mon.filter(E=>B[E.key]).length}/${mon.length})</h3><div class="be-grid">${mon.map(card).join('')}</div>`;
  h+=`<h3>Bosse (${boss.filter(E=>B[E.key]).length}/${boss.length})</h3><div class="be-grid">${boss.map(card).join('')}</div>`;
  h+=`<h3>Wildtiere (${ani.filter(E=>B[E.key]).length}/${ani.length})</h3><div class="be-grid">${ani.map(card).join('')}</div>`;return`<p class="craft-sub">${known} von ${I.length} Kreaturen entdeckt. Klick auf eine Karte für mehr.</p>`+h;}
function jrAch(){const A=FLAGS.ach||{},n=ACH.filter(a=>A[a[0]]).length,T=['Leicht','Mittel','Schwer'];let h=`<p class="craft-sub">${n} von ${ACH.length} Errungenschaften freigeschaltet.</p>`;
  for(let t=0;t<3;t++){const L=ACH.filter(a=>a[3]===t);h+=`<h3>${T[t]} (${L.filter(a=>A[a[0]]).length}/${L.length})</h3><div class="ach-l">`+L.map(a=>{let pg='';if(!A[a[0]]&&a[6]){try{const[x,y]=a[6]();pg=` <span class="pg">(${Math.min(x,y)}/${y})</span>`;}catch(e){}}
    return`<div class="ach t${t}${A[a[0]]?' got':''}"><i>${a[4]}</i><div><b>${a[1]}</b><small>${a[2]}${pg}</small></div></div>`;}).join('')+'</div>';}return h;}
{const a=startGame;startGame=function(...r){BN.boards=[];return a(...r);};}
