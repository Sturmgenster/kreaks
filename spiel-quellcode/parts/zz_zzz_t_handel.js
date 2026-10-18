/* =========================================================
   0.0.128 · Handel, Platin, Verzauberungen, Gegenstands-Infos
   - Neue Währung: Platinmünze. 25 Kreaker = 1 Platin.
   - Händler führen jetzt alle passenden Gegenstände ihres Berufs, wertvolle Waffen und Rüstungen kosten entsprechend.
   - Verzauberte Gegenstände (Schärfe, Härte, Untotenbann, Feuer-, Gift-, Kälteschutz, Bann, Festigkeit).
   - Beim Drüberfahren zeigt jedes Item eine Info-Karte: Schaden, Tempo, Haltbarkeit, Schutz, Verzauberung, Sockel, Beschreibung.
   ========================================================= */
// ---------- Platin ----------
ITEMS.platin={name:'Platinmünze',plural:'Platinmünzen',money:7500};ITEM_DESC.platin='Glänzt kühl. 1 Platin sind 25 Kreaker.';
{const a=craftSprites;craftSprites=function(list){a(list);try{list.push(['platin',drawCoin(['#3a4652','#7a8a9a','#b8c8d6','#e6eef6','#ffffff'])]);}catch(e){console.error('Platin',e);}};}
MONEY.unshift(['platin',7500]);COIN_SHORT.platin='Platin';try{JUNK_SKIP.add('platin');}catch(e){}
const MONEY_NAME={platin:'Platin',coin:'Kreaker',silver:'Silber',copper:'Kupfer'};
function moneyParts(k){k=Math.max(0,Math.round(k));const P=[];for(const[id,v]of MONEY){const n=Math.floor(k/v);if(n){P.push([id,n]);k-=n*v;}}if(!P.length)P.push(['copper',0]);return P;}
fmtMoney=function(k){return moneyParts(k).map(([id,n])=>n+' '+MONEY_NAME[id]).join(', ');};
priceHTML=function(k){return moneyParts(k).map(([id,n])=>`<i><img src="${ITEMS[id].icon}" alt="">${n} ${COIN_SHORT[id]}</i>`).join('');};
purseHTML=function(){const parts=MONEY.map(([id])=>[id,invCount(id)]).filter(x=>x[1]>0);return'<span>Beutel</span>'+(parts.length?parts.map(([id,n])=>`<i><img src="${ITEMS[id].icon}" alt="">${n} ${MONEY_NAME[id]}</i>`).join(''):'<i>leer</i>');};
// Große Bosse lassen Platin fallen
try{DT.minotaur.loot.push(['platin',1,1]);DT.tarantula.loot.push(['platin',1,1]);DT.biglunar.loot.push(['platin',2,1]);}catch(e){}
// ---------- Werte ----------
const EQ_MATP={iron:320,alu:290,silver:620,mythril:1650,adamant:4400,diamond:9800,black:24000};
const EQ_KIND={sword:1,pick:.75,axe:.75,helm:.75,armor:1.55,boots:.7};
const EQ_BASEP={wpick:25,waxe:25,wsword:30,spick:55,saxe:55,ssword:60,dagger:150,sword:260,axe:280,spear:240,shield:110,helm:160,chainmail:320,leatherarmor:140,boots:90,bow:120,rod:25,
  molehelm:120,trident:900,cutlass:700,stake:12,flippers:140,divehelm:320,seacrown:2400,nattaarmor:3000,nattafang:2600,arrow:3};
function eqPrice(id){const it=ITEMS[id];if(!it)return 0;if(it.ench){const b=eqPrice(it.base);return Math.round((b*2.4+300)/10)*10;}if(EQ_BASEP[id])return EQ_BASEP[id];
  const m=/^(iron|alu|silver|mythril|adamant|diamond|black)_(pick|axe|sword|helm|armor|boots)$/.exec(id);if(m)return Math.round(EQ_MATP[m[1]]*EQ_KIND[m[2]]/10)*10;return 0;}
// ---------- Verzauberungen ----------
const ENCH={
  sharp:{n:'der Schärfe',lore:'Schärfe: +20 % Schaden',for:'weapon',dmg:.2},
  hard:{n:'der Härte',lore:'Härte: +60 % Haltbarkeit',for:'dur',dur:1.6},
  holy:{n:'des Lichts',lore:'Untotenbann: +50 % Schaden gegen Untote',for:'weapon',undead:.5},
  fire:{n:'des Feuerschutzes',lore:'Feuerschutz: Feuerschaden halbiert',for:'armor',prot:{fire:.5}},
  poison:{n:'des Giftschutzes',lore:'Giftschutz: Gift wirkt kürzer und schwächer',for:'armor',prot:{poison:.4}},
  frost:{n:'des Kälteschutzes',lore:'Kälteschutz: Schneesturm und Frost machen dir kaum etwas',for:'armor',prot:{cold:.3}},
  ward:{n:'des Bannes',lore:'Bann: Untote treffen dich 25 % schwächer',for:'armor',prot:{undead:.75}},
  sturdy:{n:'der Festigkeit',lore:'Festigkeit: +25 % Schutz',for:'armor',def:1.25}};
const ENCH_IDS=[];
{const MATS7=['iron','alu','silver','mythril','adamant','diamond','black'],mk=(base,key)=>{const B=ITEMS[base],E=ENCH[key];if(!B||!E)return;const id='ex_'+key+'_'+base,it=Object.assign({},B,{name:B.name+' '+E.n,plural:(B.plural||B.name)+' '+E.n,ench:key,base});
    if(E.dur&&B.dur)it.dur=Math.round(B.dur*E.dur);if(E.def&&B.def)it.def=+(B.def*E.def).toFixed(3);ITEMS[id]=it;if(ITEM_DESC[base])ITEM_DESC[id]=ITEM_DESC[base];ENCH_IDS.push(id);};
  for(const m of MATS7){for(const k of['sharp','hard','holy'])mk(m+'_sword',k);mk(m+'_pick','hard');mk(m+'_axe','hard');for(const p of['helm','armor','boots'])for(const k of['fire','poison','frost','ward','sturdy'])mk(m+'_'+p,k);}
  for(const b of['dagger','sword','axe','spear'])for(const k of['sharp','holy'])mk(b,k);mk('bow','sharp');mk('bow','hard');
  for(const b of['helm','chainmail','leatherarmor','boots'])for(const k of['fire','poison','frost'])mk(b,k);}
// Bilder: wie das Grundstück, mit violettem Glanz
function enchIcon(src){const S=src.width,H=src.height,o=document.createElement('canvas');o.width=S;o.height=H;const x=o.getContext('2d');x.drawImage(src,0,0);const im=x.getImageData(0,0,S,H),d=im.data,A=(X,Y)=>X>=0&&Y>=0&&X<S&&Y<H&&d[(Y*S+X)*4+3]>0;
  const glow=[];for(let Y=0;Y<H;Y++)for(let X=0;X<S;X++){const i=(Y*S+X)*4;if(d[i+3]){if(hash2(X,Y,411)<.06){d[i]=240;d[i+1]=200;d[i+2]=255;}else{d[i]=Math.min(255,d[i]*.9+30);d[i+2]=Math.min(255,d[i+2]*.9+50);}}else if(A(X-1,Y)||A(X+1,Y)||A(X,Y-1)||A(X,Y+1))glow.push(i);}
  for(const i of glow){d[i]=170;d[i+1]=90;d[i+2]=255;d[i+3]=200;}x.putImageData(im,0,0);return o;}
{const a=buildAtlas;buildAtlas=function(){const r=a.apply(this,arguments);for(const id of ENCH_IDS){const b=SPR[ITEMS[id].base];if(b&&!SPR[id])SPR[id]=Object.assign({},b,{c:enchIcon(b.c)});}if(!SPR.platin)SPR.platin=SPR.coin;return r;};}
{const a=initFPItems;initFPItems=function(){a();for(const id of ENCH_IDS){const it=ITEMS[id],B=ITEMS[it.base];if(B&&B.fp)it.fp=B.fp;const src=(typeof ICV!=='undefined'&&ICV[it.base])||(SPR[it.base]&&SPR[it.base].c);if(src)try{it.icon=enchIcon(src).toDataURL();}catch(e){}}try{renderInv();}catch(e){}};}
// ---------- Wirkung der Verzauberungen ----------
let DMGCTX=null;
function protNow(){const P0={fire:1,poison:1,cold:1,undead:1};for(const k of['helm','armor','boots']){const s=equip[k],it=s&&ITEMS[s.id],E=it&&it.ench&&ENCH[it.ench];if(E&&E.prot)for(const t in E.prot)P0[t]*=E.prot[t];}return P0;}
{const a=weaponMult;weaponMult=function(t){let m=a(t);const h=inv[HOT0+sel],it=h&&ITEMS[h.id],E=it&&it.ench&&ENCH[it.ench];if(E){if(E.dmg)m*=1+E.dmg;if(E.undead&&t&&((t.d&&t.d.undead)||t.kind==='mummy'||t.kind==='pharaoh'||(t.kind==='cavemob'&&t.type==='skeleton')))m*=1+E.undead;}return m;};}
{const a=takeDamage;takeDamage=function(n){if(DMGCTX&&n>0){const p=protNow()[DMGCTX];if(p!=null)n*=p;}return a(n);};}
{const a=meleeHit;meleeHit=function(e,t,dmg){if(t==='player'&&e&&e.d&&e.d.undead){DMGCTX='undead';try{return a(e,t,dmg);}finally{DMGCTX=null;}}return a(e,t,dmg);};}
const FIRE_ORB=new Set(['orb_fire','orb_big']);
{const a=shotHit;shotHit=function(s){const ctx=s.fac==='demon'?(FIRE_ORB.has(s.orb)?'fire':(s.orb==='orb_poison'||s.poisonT||s.acid)?'poison':(s.orb==='orb_frost'||s.slow)?'cold':(s.src&&s.src.d&&s.src.d.undead?'undead':null)):null;
  if(!ctx)return a(s);const pr=protNow();DMGCTX=ctx;try{const r=a(s);if(ctx==='poison'&&pr.poison<1&&P.poisonT>0)P.poisonT*=pr.poison;if(ctx==='cold'&&pr.cold<1&&P.slowT>0)P.slowT*=pr.cold;return r;}finally{DMGCTX=null;}};}
{const a=updatePlayer;updatePlayer=function(dt){a(dt);const pr=protNow();if(pr.poison<1&&P.poisonT>0)P.poisonT=Math.max(0,P.poisonT-dt*(1/pr.poison-1));if(pr.cold<1&&P.slowT>0)P.slowT=Math.max(0,P.slowT-dt*(1/pr.cold-1));};}
try{const a=wxTick;wxTick=function(dt){if(protNow().cold<1)WX.coldT=8;return a(dt);};}catch(e){}
// ---------- Info-Karte beim Drüberfahren ----------
{const st=document.createElement('style');st.textContent=`#loreTip{position:fixed;z-index:9999;pointer-events:none;max-width:300px;background:linear-gradient(#1e1a14f2,#141210f2);border:2px solid #6a5434;box-shadow:0 0 0 2px #0a0806,0 6px 18px #000a;
  padding:8px 10px;color:#e8dcc0;font-size:14px;line-height:1.35;border-radius:3px}#loreTip h5{margin:0 0 3px;font-size:16px;color:#ffe9a8}#loreTip h5.ench{color:#d6a8ff;text-shadow:0 0 6px #a060ff}
  #loreTip .ty{color:#a89a7a;font-size:12px;margin-bottom:4px}#loreTip .st{color:#e8dcc0}#loreTip .st b{color:#fff}#loreTip .en{color:#c890ff}#loreTip .gm{color:#8ad8ff}#loreTip .ds{color:#a8a090;font-style:italic;margin-top:4px}
  #loreTip .bar{height:6px;background:#2a2218;border:1px solid #0a0806;margin:2px 0 3px}#loreTip .bar i{display:block;height:100%}#loreTip .val{color:#c8b878;font-size:12px;margin-top:4px}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='loreTip';d.hidden=true;document.body.appendChild(d);}
const SLOT_N={helm:'Helm',armor:'Brustrüstung',boots:'Stiefel',neck:'Kette',ring:'Ring',boat:'Boot',cannon:'Schiffskanone'};
function loreHTML(s){const it=ITEMS[s.id];if(!it)return'';const E=it.ench&&ENCH[it.ench],W=it.weapon&&WEAPONS[it.weapon],L=[];
  let ty=it.money?'Währung':it.tool==='pick'?'Werkzeug · Spitzhacke':it.tool==='axe'?'Werkzeug · Axt':W?'Waffe':it.slot?(SLOT_N[it.slot]||'Ausrüstung'):FOOD&&FOOD[s.id]?'Essen':it.potion?'Trank':'';
  if(it.mat&&MATS[it.mat])ty+=(ty?' · ':'')+MATS[it.mat].n;
  if(W){const dm=Math.round(W.dmg*(E&&E.dmg?1+E.dmg:1)*(s.gem==='ruby'?1.25:s.gem==='diamond'?1.1:s.gem==='blackdia'?1.4:1));L.push(`<div class="st">Schaden: <b>${dm}</b>${E&&E.dmg?' <span class="en">(+'+Math.round(E.dmg*100)+' %)</span>':''}</div>`);
    L.push(`<div class="st">Tempo: <b>${(1/W.cd).toFixed(1).replace('.',',')}</b> Schläge/s · Reichweite <b>${String(W.range).replace('.',',')} m</b></div>`);L.push(`<div class="st">Ausdauer pro Schlag: <b>${W.cost}</b></div>`);}
  if(it.tool==='pick')L.push('<div class="st">Baut Felsen, Erze und Edelsteine ab</div>');if(it.tool==='axe')L.push('<div class="st">Fällt Bäume</div>');
  if(it.def)L.push(`<div class="st">Schutz: <b>+${Math.round(it.def*100)} %</b> weniger Schaden</div>`);
  if(it.dur){const cur=s.d==null?it.dur:s.d,q=cur/it.dur;L.push(`<div class="st">Haltbarkeit: <b>${cur}</b> / ${it.dur}</div><div class="bar"><i style="width:${(q*100).toFixed(0)}%;background:${q>.5?'#6fd04a':q>.2?'#e0c040':'#e04a2a'}"></i></div>`);}
  else if(W||it.slot==='helm'||it.slot==='armor'||it.slot==='boots')L.push('<div class="st">Haltbarkeit: <b>unzerstörbar</b></div>');
  if(E)L.push(`<div class="en">✦ ${E.lore}</div>`);
  if(s.gem&&GEMS[s.gem])L.push(`<div class="gm">◆ ${GEMS[s.gem].n}: ${GEMS[s.gem].fx}</div>`);
  if(it.money)L.push(`<div class="st">Wert: <b>${fmtMoney(it.money)}</b></div>`);
  const ds=ITEM_DESC[s.id];if(ds&&!(W&&/^\d+ Schaden/.test(ds))&&!/^Rüstung \+/.test(ds))L.push(`<div class="ds">${ds}</div>`);
  if(s.n>1)L.push(`<div class="val">${s.n} Stück</div>`);
  return`<h5${E?' class="ench"':''}>${it.name}</h5>${ty?`<div class="ty">${ty}</div>`:''}${L.join('')}`;}
{let tipOn=null;const tip=()=>$('loreTip');
  const place=(x,y)=>{const t=tip();if(t.hidden)return;const w=t.offsetWidth,h=t.offsetHeight;let X=x+18,Y=y+14;if(X+w>innerWidth-6)X=x-w-14;if(Y+h>innerHeight-6)Y=innerHeight-h-6;t.style.left=X+'px';t.style.top=Math.max(6,Y)+'px';};
  const slotOf=el=>{let i=slotEls.grid.indexOf(el);if(i>=0)return inv[i];i=slotEls.hot.indexOf(el);if(i>=0)return inv[HOT0+i];for(const k in eqEls)if(eqEls[k]===el)return equip[k];
    if(el.matches&&el.matches('button.sc')&&shop&&shop.list){const x=shop.list[+el.dataset.i];return x&&ITEMS[x.id]?{id:x.id,n:1}:null;}if(el.dataset&&el.dataset.id&&ITEMS[el.dataset.id])return{id:el.dataset.id,n:1};return null;};
  document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('.slot,button.sc,#cheatGrid button[data-id]');const t=tip();if(!el){if(tipOn){t.hidden=true;tipOn=null;}return;}
    const s=slotOf(el);if(!s){t.hidden=true;tipOn=null;return;}t.innerHTML=loreHTML(s);t.hidden=false;tipOn=el;place(e.clientX,e.clientY);});
  document.addEventListener('mousemove',e=>{if(tipOn)place(e.clientX,e.clientY);});
  document.addEventListener('mousedown',()=>{if(tipOn){setTimeout(()=>{if(tipOn){const s=slotOf(tipOn);if(s)tip().innerHTML=loreHTML(s);else{tip().hidden=true;tipOn=null;}}},30);}});
  {const a=closeShop;closeShop=function(){tip().hidden=true;tipOn=null;return a();};}}
// Kurzinfo in Händler- und Bastelkarten
itemInfo=function(id){const it=ITEMS[id];if(!it)return'';const E=it.ench&&ENCH[it.ench],W=it.weapon&&WEAPONS[it.weapon],P=[];if(W)P.push(Math.round(W.dmg*(E&&E.dmg?1+E.dmg:1))+' Schaden');if(it.def)P.push('Schutz +'+Math.round(it.def*100)+' %');if(it.dur)P.push(it.dur+' Haltbarkeit');
  if(E)P.push('✦ '+E.lore.split(':')[0]);return P.length?P.join(' · '):(ITEM_DESC[id]||'');};
// ---------- Händler nach Beruf ----------
const M7=['iron','alu','silver','mythril','adamant','diamond','black'],sellP=id=>Math.max(1,Math.round(eqPrice(id)*.35)),EQ=(kinds,mats)=>{const L=[];for(const m of mats||M7)for(const k of kinds)if(ITEMS[m+'_'+k])L.push(m+'_'+k);return L;};
function shopMerge(name,buyIds,sellIds,buyRaw,sellRaw){const S=SHOPS[name];if(!S)return;const mergeL=(L,add)=>{const out=(L||[]).slice();for(const q of add){if(!ITEMS[q[0]])continue;const i=out.findIndex(o=>o[0]===q[0]);if(i>=0)out[i]=q;else out.push(q);}return out;};
  const bAdd=(buyIds||[]).filter(i=>ITEMS[i]).map(i=>[i,eqPrice(i)||itemValue(i)]).concat(buyRaw||[]),sAdd=(sellIds||[]).filter(i=>ITEMS[i]).map(i=>[i,sellP(i)||Math.max(1,Math.round(itemValue(i)*.35))]).concat(sellRaw||[]);
  const d=Object.getOwnPropertyDescriptor(S,'buy');if(d&&d.get){const g=d.get;Object.defineProperty(S,'buy',{get(){return mergeL(g.call(S),bAdd);},configurable:true,enumerable:true});}else S.buy=mergeL(S.buy,bAdd);
  S.sell=mergeL(S.sell,sAdd);}
const ALLW=EQ(['sword']).concat(['dagger','sword','axe','spear','bow','trident','cutlass','wsword','ssword']),ALLA=EQ(['helm','armor','boots']).concat(['helm','chainmail','leatherarmor','boots','shield','molehelm']),ALLT=EQ(['pick','axe']).concat(['wpick','waxe','spick','saxe']);
const exI=(keys,bases)=>{const L=[];for(const b of bases)for(const k of keys){const id='ex_'+k+'_'+b;if(ITEMS[id])L.push(id);}return L;};
// Waffenschmied: alle Schwerter, Bögen, Pfeile; verzauberte Klingen. Kauft Waffen an.
shopMerge('Waffenschmied Gorm',EQ(['sword']).concat(exI(['sharp','hard','holy'],['iron_sword','silver_sword','mythril_sword','adamant_sword']),exI(['sharp','holy'],['sword','dagger','spear']),exI(['sharp','hard'],['bow'])),ALLW.concat(ENCH_IDS.filter(i=>ITEMS[i].weapon)),[['arrow',3]],[['iron_ingot',30],['silver_ingot',60],['mythril_ingot',160],['adamant_ingot',420]]);
// Rüstungsmacherin: alle Rüstungen; verzauberte Schutzrüstungen. Kauft Rüstungen an.
shopMerge('Rüstungsmacherin Hilda',EQ(['helm','armor','boots']).concat(exI(['fire','poison','frost','ward','sturdy'],EQ(['helm','armor','boots'],['iron','silver','mythril'])),exI(['fire','ward','sturdy'],EQ(['helm','armor','boots'],['adamant'])),exI(['fire','poison','frost'],['chainmail','leatherarmor','helm','boots'])),
  ALLA.concat(ENCH_IDS.filter(i=>ITEMS[i].slot)),[],[['fur',10],['crocskin',14],['nattaskin',220],['chitin',22],['iron_ingot',30],['silver_ingot',60],['mythril_ingot',160]]);
// Dorfschmied: Werkzeuge, einfache Waffen, gehärtete Werkzeuge. Kauft Erze, Barren und Werkzeug.
shopMerge('Dofra',['wpick','waxe','spick','saxe','iron_pick','iron_axe','alu_pick','alu_axe','silver_pick','silver_axe','iron_sword','iron_helm','iron_armor','iron_boots'].concat(exI(['hard'],['iron_pick','iron_axe'])),ALLT.concat(['dagger','sword','axe','spear','helm','chainmail','boots','iron_sword','iron_helm','iron_armor','iron_boots']),
  [],[['copper_ore',3],['copper_ingot',8],['mythril_ore',30],['mythril_ingot',80],['adamant_ore',70],['adamant_ingot',200],['obsidian',18],['coal',2]]);
// Reisende Händler: ab und zu ein verzauberter Gegenstand
shopMerge('Händler Jorek',exI(['hard'],['iron_pick','iron_axe']),[]);shopMerge('Händlerin Ysolde',exI(['sharp'],['iron_sword','bow']).concat(exI(['frost'],['leatherarmor'])),[]);shopMerge('Händler Pim',exI(['holy'],['silver_sword','dagger']).concat(exI(['ward'],['silver_helm'])),[]);
for(const n of['Elarwen','Thalion','Liriel'])shopMerge(n,exI(['sharp','hard'],['bow']),[],[],[['bluecap',8],['glowslime',6],['starshard',90]]);
// Kräuter und Tränke: kaufen alle Pflanzen und Pilze an
const HERBS=[['flower',3],['mushroom',4],['swampherb',4],['frostflower',12],['glowgland',12],['bluecap',8],['glowslime',6],['berries',2],['kelp',2],['garlic',3],['starshard',90]];
for(const n of['Alchemistin Mira','Corvin','Murgla'])shopMerge(n,[],[],[['pbreath',90]].filter(q=>n!=='Corvin'),HERBS);
// Proviant und Wirtshaus: Essen und Fisch
const FOODB=[['bread',5],['roastmeat',7],['mead',9],['seafish',5],['berries',3],['coconut',5],['banana',4],['cactusf',4],['garlic',6],['gingerbread',8]],FOODS=[['meat',4],['wheat',3],['berries',2],['perch',4],['trout',7],['carp',12],['pike',20],['seafish',4],['coconut',2],['banana',2],['mushroom',4],['nut',2]];
shopMerge('Proviantmeister Bert',[],[],FOODB,FOODS);shopMerge('Hagen',[],[],[['roastmeat',8],['seafish',6]],[['perch',3],['trout',6],['carp',10],['seafish',4]]);shopMerge('Händler Morchel',[],[],[['roastmeat',8],['berries',3]],[['flower',3],['berries',2],['nut',2]]);
// Trophäen: alle Monster- und Tierteile
shopMerge("Trophäenhändler Silas",[],[],[],[['bones',3],['batwing',7],['sharktooth',16],['vfang',170],['tentacle',7],['glowgland',14],['megatooth',480],['pearl',45],['oldcoin',32],['silk',4],['chitin',20],['antler',15],['horn',16],['ivory',20],['crocskin',12],['fur',9],['feather',3],['nattaskin',200],['starshard',95],['glowslime',7],['coral',8],['shell',4],['linen',4],['jaguartooth',60]]);
// Fischer: alle Fische
for(const n of['Fischer Hannes','Fischerin Maren','Kapitän Jorge','Quorg'])shopMerge(n,[],[],[],[['perch',4],['trout',7],['carp',12],['pike',20],['goldfish',60],['seafish',5]]);
// Baustoffe: Holz aller Art, Stein, Lehm
shopMerge('Baumeister Kurt',[],[],[],[['w_oak',2],['w_pine',2],['w_birch',2],['w_dark',5],['w_red',5],['w_acacia',3],['w_maha',8],['w_cherry',7],['w_maple',6],['w_ash',10],['clay',2],['obsidian',16],['bamboo',2]]);
// Trödelwert der neuen Gegenstände
{const a=itemValue;itemValue=function(id){const p=eqPrice(id);if(p)return p;if(id==='platin')return 7500;return a(id);};}
