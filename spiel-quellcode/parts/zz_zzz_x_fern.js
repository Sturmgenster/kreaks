/* =========================================================
   0.0.130 · Fernkampf, Schilde, Runenstahl und Haltbarkeit
   - Bögen: Bogen, Langbogen (stark, langsam), Kompositbogen (schnell), Runenbogen (Turm). Neue Bilder in der Hotbar
     und eine neue Ego-Animation: Bogen aufrecht vor dir, die Sehne wird in mehreren Stufen gespannt und schnellt zurück.
   - Armbrust: Rechtsklick schießt sofort, danach wird automatisch nachgeladen.
   - Pfeilarten: Pfeil, Feuerpfeil (setzt in Brand), Giftpfeil (vergiftet), Silberpfeil (doppelt gegen Untote). Taste X wechselt.
   - Schilde: Holz, Eisen, Mythril, Adamantium, Runenstahl. Bessere Schilde kosten weniger Ausdauer beim Blocken.
     Verzauberte Schilde und Bögen bei den Händlern.
   - Runenstahl: neues Material aus dem Großen Turm (Runenerz nur auf Ebene 1 und 2). Werkzeuge, Schwert, Rüstung, Schild, Bogen.
   - Ansicht von außen: eigene Haltung beim Zielen und beim Blocken.
   - Haltbarkeit: alle Werkzeuge und Waffen halten dreimal so lange. Rüstungen und Schilde haben jetzt auch Haltbarkeit
     (ebenfalls dreifach) und nutzen sich bei Treffern und beim Blocken ab.
   ========================================================= */
// =========================================================
// Runenstahl
// =========================================================
MATS.rune={n:'Runenstahl',adj:'Runenstahl',pal:['#0a1622','#1a3a56','#2e7aa8','#8ae8ff'],tier:8,dmg:66,cd:.42,dur:2200,def:[.19,.43,.115],ing:'rune_ingot'};
INGOTS.rune_ingot=['Runenstahlbarren','rune'];ITEMS.rune_ingot={name:'Runenstahlbarren',plural:'Runenstahlbarren'};ITEMS.rune_ore={name:'Runenerz',plural:'Runenerze'};
ITEM_DESC.rune_ore='Kalt und leicht, mit blau glimmenden Runen. Gibt es nur tief im Großen Turm (Ebene 1 und 2). Abbauen ab Mythrilspitzhacke, schmelzen mit 3 Kohle.';
ITEM_DESC.rune_ingot='Runenstahl aus dem Großen Turm. Leicht, schnell und fast unzerstörbar.';
try{GEAR.rune={pal:['#08121c','#163650','#2a74a0','#7ae0ff'],acc:'#9af8ff',trim:'#3ad8ff',glow:1};}catch(e){}
{const m='rune',M=MATS.rune,pre='Runenstahl';WEAPONS[m+'_sword']={cost:8,dmg:M.dmg,range:2.5,cd:M.cd};WEAPONS[m+'_tool']={cost:6,dmg:Math.round(M.dmg*.5),range:2.2,cd:.5};
  ITEMS[m+'_pick']={name:pre+'spitzhacke',tool:'pick',tier:M.tier,dur:M.dur,weapon:m+'_tool',mat:m};ITEMS[m+'_axe']={name:pre+'axt',tool:'axe',tier:M.tier,dur:M.dur,weapon:m+'_tool',mat:m};
  ITEMS[m+'_sword']={name:pre+'schwert',weapon:m+'_sword',dur:M.dur,mat:m};ITEMS[m+'_helm']={name:pre+'helm',slot:'helm',def:M.def[0],mat:m};
  ITEMS[m+'_armor']={name:pre+'rüstung',slot:'armor',look:'chain',def:M.def[1],mat:m};ITEMS[m+'_boots']={name:pre+'stiefel',slot:'boots',def:M.def[2],mat:m};
  for(const t of['pick','axe','sword','helm','armor','boots'])MAT_ITEMS.push([m+'_'+t,m,t]);
  const ing=M.ing;RECIPES.push({id:m+'_pick',need:{[ing]:3,stick:2},bench:1},{id:m+'_axe',need:{[ing]:3,stick:2},bench:1},{id:m+'_sword',need:{[ing]:2,stick:1},bench:1},
    {id:m+'_helm',need:{[ing]:5},bench:1},{id:m+'_armor',need:{[ing]:8},bench:1},{id:m+'_boots',need:{[ing]:4},bench:1},{id:'rune_ingot',need:{rune_ore:1,coal:3},st:'furnace'});}
// =========================================================
// Bögen, Armbrust, Pfeile, Schilde
// =========================================================
ITEMS.bow.bow={dmg:26,draw:.85,sp:46,t:'bow'};
Object.assign(ITEMS,{
  longbow:{name:'Langbogen',plural:'Langbögen',weapon:'bow',dur:260,bow:{dmg:36,draw:1.15,sp:56,t:'long'}},
  compbow:{name:'Kompositbogen',plural:'Kompositbögen',weapon:'bow',dur:340,bow:{dmg:30,draw:.55,sp:48,t:'comp'}},
  rune_bow:{name:'Runenbogen',plural:'Runenbögen',weapon:'bow',dur:900,bow:{dmg:46,draw:.7,sp:60,t:'rune'}},
  xbow:{name:'Armbrust',plural:'Armbrüste',weapon:'xbow',dur:300,xb:{dmg:50,reload:1.5,sp:64}},
  arrow_fire:{name:'Feuerpfeil',plural:'Feuerpfeile'},arrow_poison:{name:'Giftpfeil',plural:'Giftpfeile'},arrow_silver:{name:'Silberpfeil',plural:'Silberpfeile'},
  iron_shield:{name:'Eisenschild',plural:'Eisenschilde',slot:'off',shield:{cost:.75,t:'iron'},dur:400},
  mythril_shield:{name:'Mythrilschild',plural:'Mythrilschilde',slot:'off',shield:{cost:.58,t:'mythril'},dur:800},
  adamant_shield:{name:'Adamantiumschild',plural:'Adamantiumschilde',slot:'off',shield:{cost:.48,t:'adamant'},dur:1100},
  rune_shield:{name:'Runenschild',plural:'Runenschilde',slot:'off',shield:{cost:.35,t:'rune'},dur:2000}});
Object.assign(ITEMS.shield,{slot:'off',shield:{cost:1,t:'wood'},dur:150});
WEAPONS.xbow={cost:4,dmg:6,range:1.8,cd:.8};
Object.assign(ITEM_DESC,{longbow:'Groß und schwer zu spannen, aber sehr stark und weit. Rechtsklick halten, loslassen schießt.',compbow:'Aus Holz und Horn. Spannt sich sehr schnell. Rechtsklick halten, loslassen schießt.',
  rune_bow:'Aus Runenstahl aus dem Großen Turm. Schnell und stark. Rechtsklick halten, loslassen schießt.',xbow:'Rechtsklick schießt sofort einen Pfeil, dann lädt sie von selbst nach. Sehr stark.',
  arrow:'Munition für Bögen und Armbrust. Taste X wechselt die Pfeilart.',arrow_fire:'Setzt Gegner in Brand. Taste X wechselt die Pfeilart.',arrow_poison:'Vergiftet Gegner für einige Sekunden. Taste X wechselt die Pfeilart.',
  arrow_silver:'Doppelter Schaden gegen Untote. Taste X wechselt die Pfeilart.',iron_shield:'Fängt Schläge ab und kostet dabei weniger Ausdauer als Holz.',mythril_shield:'Leicht und stark. Blocken kostet wenig Ausdauer.',
  adamant_shield:'Sehr schwer zu durchbrechen. Blocken kostet kaum Ausdauer.',rune_shield:'Runenstahl aus dem Großen Turm. Der beste Schild.'});
RECIPES.push({id:'longbow',need:{stick:5,rope:2},bench:1},{id:'compbow',need:{stick:2,rope:2,horn:1},bench:1},{id:'xbow',need:{iron_ingot:3,stick:3,rope:2},bench:1},{id:'rune_bow',need:{rune_ingot:3,rope:2},bench:1},
  {id:'arrow_fire',n:4,need:{arrow:4,coal:1}},{id:'arrow_poison',n:4,need:{arrow:4,swampherb:1}},{id:'arrow_silver',n:4,need:{arrow:4,silver_ingot:1},bench:1},
  {id:'iron_shield',need:{iron_ingot:5,wood:2},bench:1},{id:'mythril_shield',need:{mythril_ingot:5,wood:2},bench:1},{id:'adamant_shield',need:{adamant_ingot:5},bench:1},{id:'rune_shield',need:{rune_ingot:5},bench:1});
// Verzauberte Bögen und Schilde
function sxEnch(base,key){const B=ITEMS[base],E=ENCH[key];if(!B||!E)return;const id='ex_'+key+'_'+base;if(ITEMS[id])return;const it=Object.assign({},B,{name:B.name+' '+E.n,plural:(B.plural||B.name)+' '+E.n,ench:key,base});
  if(E.dur&&B.dur)it.dur=Math.round(B.dur*E.dur);ITEMS[id]=it;if(ITEM_DESC[base])ITEM_DESC[id]=ITEM_DESC[base];ENCH_IDS.push(id);}
for(const b of['longbow','compbow','xbow'])for(const k of['sharp','hard'])sxEnch(b,k);
for(const b of['iron_shield','mythril_shield','adamant_shield'])for(const k of['sturdy','fire','ward'])sxEnch(b,k);
ENCH.sturdy.shLore='Festigkeit: Blocken kostet 25 % weniger Ausdauer';
// Preise
Object.assign(EQ_BASEP,{longbow:420,compbow:600,xbow:900,rune_bow:6000,arrow_fire:8,arrow_poison:8,arrow_silver:14,shield:110,iron_shield:400,mythril_shield:1900,adamant_shield:5000,rune_shield:14000,rune_ore:900,rune_ingot:2600});
{const a=eqPrice;eqPrice=function(id){const m=/^rune_(pick|axe|sword|helm|armor|boots)$/.exec(id);if(m)return Math.round(16000*EQ_KIND[m[1]]/10)*10;return a(id);};}
{const a=itemValue;itemValue=function(id){const p=eqPrice(id);if(p)return p;return a(id);};}
shopMerge('Waffenschmied Gorm',['longbow','compbow','xbow','arrow_fire','arrow_poison','arrow_silver','ex_sharp_longbow','ex_hard_compbow','ex_sharp_xbow'],['longbow','compbow','xbow','rune_bow','rune_sword','rune_pick','rune_axe'],[['arrow',3]],[['rune_ingot',900],['rune_ore',320]]);
shopMerge('Rüstungsmacherin Hilda',['shield','iron_shield','mythril_shield','adamant_shield','ex_sturdy_iron_shield','ex_fire_iron_shield','ex_ward_mythril_shield','ex_sturdy_mythril_shield','ex_sturdy_adamant_shield'],['shield','iron_shield','mythril_shield','adamant_shield','rune_shield','rune_helm','rune_armor','rune_boots']);
for(const n of['Elarwen','Thalion','Liriel'])shopMerge(n,['longbow','compbow','arrow_poison','arrow_silver','ex_sharp_longbow','ex_hard_longbow','ex_sharp_compbow'],['longbow','compbow']);
shopMerge('Dofra',['iron_shield','xbow'],['iron_shield','shield'],[],[['rune_ore',320]]);
// =========================================================
// Bilder (40 × 40) für Hotbar, Inventar und Boden
// =========================================================
function ixLine(p,x0,y0,x1,y1,col,w){const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))*2||1;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;for(let a=0;a<(w||1);a++)for(let b=0;b<(w||1);b++)p.set(x+a-((w||1)-1)/2,y+b-((w||1)-1)/2,typeof col==='function'?col(i/n,a,b):col);}}
const BOWC={bow:{L:['#2a1608','#4a2e14','#6e4622','#9a6a36','#c08a4c'],len:1,curl:0},long:{L:['#4a3014','#7a5428','#a87c40','#d0a868','#e8c890'],len:1.12,curl:0},
  comp:{L:['#1e1208','#3a2410','#5a3a1c','#7e5428','#a06e38'],len:.86,curl:1,horn:['#8a7a60','#c8bca0','#efe6d0']},rune:{L:['#060c14','#122838','#1e4a66','#2e6a90','#4a8ab0'],len:1,curl:1,rune:1}};
function icBow(t){const S=40,p=new Px(S,S),C=BOWC[t],L=pal(C.L),GRp=FPW.grip,hl=17*C.len;
  // Bogen diagonal: Spitzen unten links und oben rechts, Bauch nach oben links
  const mx=20,my=20,ux=Math.SQRT1_2,uy=-Math.SQRT1_2,nx=-Math.SQRT1_2,ny=-Math.SQRT1_2,tip=s=>[mx+ux*s*hl,my+uy*s*hl];
  for(let k=-60;k<=60;k++){const s=k/60,a=Math.abs(s),bend=7*(1-s*s)-(C.curl&&a>.8?(a-.8)*14:0),x=mx+ux*s*hl+nx*bend,y=my+uy*s*hl+ny*bend,th=a<.15?3.2:3-a*1.6;
    for(let o=-th/2;o<=th/2;o+=.5){const px=x+nx*o,py=y+ny*o,q=(o+th/2)/th;let col=L[shadeIdx(.9-q*.6,L.length,Math.round(px),Math.round(py))];if(a<.14)col=GRp[shadeIdx(.75-q*.5-((k&3)===0?.3:0),GRp.length,0,k)];
      if(C.horn&&a>.82)col=pal(C.horn)[shadeIdx(.85-q*.5,3,0,k)];if(C.rune&&a>.25&&a<.75&&(k%7===0)&&q>.3&&q<.7)col=hex('#8af0ff');p.set(px,py,col);}}
  const[t1x,t1y]=tip(-1),[t2x,t2y]=tip(1);const tb=(s)=>{const a=Math.abs(s);return C.curl&&a>.8?-(a-.8)*14:0;};
  ixLine(p,t1x+nx*tb(-1),t1y+ny*tb(-1),t2x+nx*tb(1),t2y+ny*tb(1),hex('#ece4cc'));outline(p);return p.done();}
function icXbow(){const S=40,p=new Px(S,S),W=pal(['#2a1608','#4a2e14','#6e4622','#9a6a36']),I=pal(['#24262c','#4a4e56','#7a808a','#b4bac4']),r=Math.SQRT1_2;
  ixLine(p,6,34,27,13,(q,a,b)=>W[shadeIdx(.85-a*.25,4,a,b)],4);ixLine(p,8,32,25,15,I[2],1);ixLine(p,13,27,9,23,W[1],3);
  const cx=27,cy=13,tip=q=>[cx+r*q*11+r*3*(1-q*q),cy+r*q*11-r*3*(1-q*q)];for(let k=-22;k<=22;k++){const[x,y]=tip(k/22);p.set(x,y,I[3]);p.set(x+.6,y+.6,I[1]);p.set(x-.6,y+.6,I[0]);}
  const[a1,b1]=tip(-1),[a2,b2]=tip(1);ixLine(p,a1,b1,21,19,hex('#e8e0c8'));ixLine(p,a2,b2,21,19,hex('#e8e0c8'));p.set(30,10,I[3]);p.set(31,9,I[3]);outline(p);return p.done();}
const AMMO_C={arrow:{head:['#5a626c','#a8b0ba','#dfe6ee'],fl:['#c83a2a','#ece4d2']},arrow_fire:{head:['#8a2a08','#e05a10','#ffd040'],fl:['#ff8a20','#ffe0a0'],fire:1},
  arrow_poison:{head:['#1a4a10','#4aa020','#b8ff60'],fl:['#3a8a2a','#c8f0a0']},arrow_silver:{head:['#7a8088','#d8dee6','#ffffff'],fl:['#ffffff','#b8c8e8']}};
function icArrow(id){const S=40,p=new Px(S,S),C=AMMO_C[id],H=pal(C.head),SH=pal(['#5a3a1c','#8a6034','#b08850']);
  ixLine(p,8,32,30,10,(q,a)=>SH[a?0:1],2);for(let k=0;k<7;k++){const x=30+k*.7,y=10-k*.7;for(let o=-(3.5-k*.5);o<=3.5-k*.5;o+=.5)p.set(x+o*.7,y+o*.7,H[o<0?2:k<2?1:0]);}
  for(let k=0;k<7;k++){const x=8+k*.9,y=32-k*.9;for(let o=1;o<=3;o++){p.set(x-o*.7,y-o*.7,hex(C.fl[(k+o)&1]));p.set(x+o*.7,y+o*.7,hex(C.fl[(k+o+1)&1]));}}
  if(C.fire)for(let k=0;k<14;k++){const a=hash2(k,1,id.length)*6.283,r=2+hash2(k,2,3)*4;p.set(32+Math.cos(a)*r,8+Math.sin(a)*r-2,hex(k&1?'#ffd040':'#ff6a10'));}outline(p);return p.done();}
const SHC={wood:{f:['#3a2410','#5a3a1c','#7a5228','#9a6a36'],r:['#2a2a30','#5a5e66','#8a9098'],plank:1},iron:{f:['#2e3034','#5a5e64','#8a9098','#c0c6ce'],r:['#3a3020','#7a6a3a','#b89a50'],boss:1},
  mythril:{f:['#123a58','#2470a0','#52b4e0','#a8f0ff'],r:['#6a7480','#c8d0d8','#ffffff'],emb:'#e8f8ff'},adamant:{f:['#2e061e','#5e123e','#962660','#d85c98'],r:['#6a5010','#c8a030','#ffe070'],emb:'#ffd040'},
  rune:{f:['#06101a','#122838','#1e4a66','#2e6a90'],r:['#1a3a56','#3a8ab8','#8ae8ff'],rune:1}};
function icShield(t){const S=40,p=new Px(S,S),C=SHC[t],F=pal(C.f),R=pal(C.r),inS=(x,y,m)=>{const hw=15-m;if(y<4+m||y>37-m)return false;if(y<22)return Math.abs(x-20)<=hw;const q=(y-22)/(15-m);return Math.abs(x-20)<=hw*(1-q*q*.95);};
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){if(!inS(x,y,0))continue;const rim=!inS(x,y,2);if(rim){p.set(x,y,R[shadeIdx(.85-(x-5)/30*.7,R.length,x,y)]);continue;}
    let L=.8-(x-6)/28*.55-(y-4)/34*.15;if(C.plank&&(x-6)%6===0)L-=.35;p.set(x,y,F[shadeIdx(L+(hash2(x,y>>1,t.length)-.5)*.12,F.length,x,y)]);}
  if(C.boss){for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++)if(x*x+y*y<=16)p.set(20+x,18+y,R[shadeIdx(.8-(x+y)/12,R.length,x,y)]);for(const[x,y]of[[9,8],[31,8],[9,22],[31,22],[20,33]])p.set(x,y,R[2]);}
  if(C.emb){const E=hex(C.emb);for(let y=9;y<31;y++)p.set(20,y,E);for(let x=13;x<28;x++)p.set(x,16,E);p.set(19,10,E);p.set(21,10,E);}
  if(C.rune){const G=hex('#8af0ff');const pts=[[20,8],[20,30],[14,14],[26,14],[15,24],[25,24]];for(let i=0;i<pts.length-1;i+=2)ixLine(p,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],G);ixLine(p,14,14,25,24,G);ixLine(p,26,14,15,24,G);}
  if(t==='wood')for(const[x,y]of[[10,10],[30,10],[10,24],[30,24]])p.set(x,y,R[2]);outline(p);return p.done();}
function icRuneOre(){const p=new Px(20,18),R=pal(['#16181e','#262a32','#363c46','#4a525e']);for(let y=0;y<18;y++)for(let x=0;x<20;x++){const dx=(x-10)/9.5,dy=(y-9.5)/8;if(dx*dx+dy*dy>1)continue;p.set(x,y,R[shadeIdx(.7-dx*.3-dy*.4+(hash2(x,y,71)-.5)*.3,4,x,y)]);}
  for(const[x,y]of[[6,6],[7,7],[8,8],[12,5],[12,6],[13,7],[11,11],[12,12],[14,12],[5,11],[15,9]])p.set(x,y,hex(hash2(x,y,3)<.5?'#8af0ff':'#4ac8f0'));outline(p);return p.done();}
const IX_LIST=()=>{const L=[['bow',()=>icBow('bow')],['longbow',()=>icBow('long')],['compbow',()=>icBow('comp')],['rune_bow',()=>icBow('rune')],['xbow',icXbow],['rune_ore',icRuneOre]];
  for(const a in AMMO_C)L.push([a,()=>icArrow(a)]);for(const id of['shield','iron_shield','mythril_shield','adamant_shield','rune_shield'])L.push([id,()=>icShield(ITEMS[id].shield.t)]);return L;};
const IXC={};
{const a=craftSprites;craftSprites=function(list){a(list);try{for(const[id,f]of IX_LIST()){const cv=IXC[id]||(IXC[id]=f());const i=list.findIndex(q=>q[0]===id);if(i>=0)list[i][1]=cv;else list.push([id,cv]);}}catch(e){console.error('Fernkampf-Bilder',e);}};}
// =========================================================
// Pfeilarten und Wechseln
// =========================================================
const AMMO=['arrow','arrow_fire','arrow_poison','arrow_silver'];
function ammoPick(){const w=FLAGS.ammo||'arrow';if(countItem(w)>0)return w;for(const a of AMMO)if(countItem(a)>0)return a;return null;}
function ammoCycle(){const own=AMMO.filter(a=>countItem(a)>0);if(!own.length){FLAGS.ammo='arrow';return;}const cur=ammoPick(),i=own.indexOf(cur);FLAGS.ammo=own[(i+1)%own.length];try{Snd.click();}catch(e){}ammoHud(true);}
ACTIONS.push(['ammo','Pfeilart wechseln']);DEFAULTS.keys.ammo='KeyX';if(settings.keys&&!settings.keys.ammo)settings.keys.ammo='KeyX';
addEventListener('keydown',e=>{if(state!=='playing'||e.repeat)return;if(e.code===(settings.keys.ammo||'KeyX')){const w=weaponOf();if(w==='bow'||w==='xbow')ammoCycle();}});
{const st=document.createElement('style');st.textContent=`#ammoHud{position:absolute;left:calc(50% + 222px);bottom:22px;display:flex;align-items:center;gap:6px;padding:3px 10px 3px 5px;background:rgba(10,8,6,.62);
  border:1px solid #7a5a2a;color:#f0e2b8;font:13px 'Pixelify Sans',sans-serif;border-radius:3px;pointer-events:none;transition:transform .15s}#ammoHud img{width:24px;height:24px;image-rendering:pixelated}#ammoHud.pop{transform:scale(1.12)}#ammoHud small{color:#b8a888}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='ammoHud';d.hidden=true;($('hud')||document.body).appendChild(d);}
let AMH='';function ammoHud(pop){const el=$('ammoHud');if(!el)return;const w=weaponOf(),show=(w==='bow'||w==='xbow')&&state!=='menu';if(!show){if(!el.hidden)el.hidden=true;AMH='';return;}
  const a=ammoPick()||FLAGS.ammo||'arrow',n=countItem(a),k=keyName(settings.keys.ammo||'KeyX'),sig=a+n+k+(w==='xbow'?(XB.loaded?'L':'R'):'');if(sig!==AMH){AMH=sig;
    el.innerHTML=`<img src="${ITEMS[a].icon}" alt=""><span>${n?ITEMS[a][n===1?'name':'plural']+' × '+n:'Keine Pfeile'}</span><small>· ${k}: wechseln${w==='xbow'?(XB.loaded?' · geladen':' · lädt …'):''}</small>`;}
  el.hidden=false;if(pop){el.classList.add('pop');setTimeout(()=>el.classList.remove('pop'),160);}}
// =========================================================
// Bogen: neue Werte je Bogenart, Pfeilart beim Schuss
// =========================================================
function bowSpec(){const h=inv[HOT0+sel],it=h&&ITEMS[h.id];return(it&&it.bow)||ITEMS.bow.bow;}
const ARW_COL={arrow:0xc8b080,arrow_fire:0xff8a30,arrow_poison:0x8ae040,arrow_silver:0xe8eef8};
bowStart=function(){if(state!=='playing'||time<(P.atkReady||0)||BOW.on||BOW.lock)return;BOW.lock=true;
  if(SW.under){toast('Unter Wasser kannst du nicht schießen.');return;}
  if(!ammoPick()){toast('Du hast keine Pfeile. Aus 1 Stock und 1 Stein baust du 6 Pfeile.');ammoHud(true);return;}
  if(P.stats.st<4){toast('Zu wenig Ausdauer');return;}
  BOW.on=true;BOW.t0=time;BOW.draw=0;BOW.hold=0;BOW.slot=sel;BOW.ck=0;bowCreak(1);};
function rangedShot(sp,dmg,am,o){const L=lookDir(),x=P.x+L.x*.9,y=P.y+P.eye-.12+L.y*.9,z=P.z+L.z*.9,s=Object.assign({x,y,z,vx:L.x*sp,vy:L.y*sp,vz:L.z*sp,t:0,life:4,dmg,fac:'ally',orb:'orb_arrow',size:.32,col:ARW_COL[am]||0xc8b080,grav:7,aoe:0,home:0,src:null,by:'player',arrow:1,atype:am},o||{});
  SHOTS.push(s);ARW.push(s);return s;}
function rangedDmg(base){const h=inv[HOT0+sel],it=h&&ITEMS[h.id],E=it&&it.ench&&ENCH[it.ench];return base*(1+.15*tal('archer'))*(P.stats.hp<P.stats.maxHp*.4?1+.12*tal('rage'):1)*(buffOn('str')?1.5:1)*(E&&E.dmg?1+E.dmg:1)*(h&&h.gem==='ruby'?1.25:h&&h.gem==='blackdia'?1.4:1)*(ammoPick()==='arrow_fire'?1.15:1);}
bowRelease=function(){if(!BOW.on)return;const d=BOW.draw;bowCancel();BOW.relT=time;const am=ammoPick();
  if(d<.18||state!=='playing'||!bowHeld()||!am)return;const S=bowSpec();
  P.stats.st=Math.max(0,P.stats.st-4);P.atkReady=time+.3;P.atkT=time;P.atkDur=.2;P.lastAction=time;const dmg=rangedDmg(S.dmg*(.3+.7*d*d)*(d>=1?1.1:1));removeItem(am,1);renderInv();wearTool();
  rangedShot(S.sp*(.35+.65*d),dmg,am);BOW.kick=1;bowTwang();renderStats();ammoHud();};
// =========================================================
// Armbrust
// =========================================================
const XB={loaded:true,rT:0,lock:false,kick:0};
function xbSpec(){const h=inv[HOT0+sel],it=h&&ITEMS[h.id];return(it&&it.xb)||ITEMS.xbow.xb;}
function xbFire(){const am=ammoPick();if(!am){toast('Du hast keine Pfeile.');ammoHud(true);return;}if(SW.under)return;const S=xbSpec();XB.loaded=false;XB.rT=S.reload;XB.kick=1;
  removeItem(am,1);renderInv();wearTool();P.atkReady=time+.25;P.atkT=time;P.atkDur=.2;P.lastAction=time;rangedShot(S.sp,rangedDmg(S.dmg),am,{grav:4});
  try{const c=Snd.ctx;if(c){const t=c.currentTime,{o}=Snd.tone('square',120,t,.12,.1);o.frequency.exponentialRampToValueAtTime(50,t+.12);Snd.whoosh(1500,.08);}}catch(e){}ammoHud();}
function xbTick(dt){if(weaponOf()!=='xbow'){XB.lock=false;return;}XB.kick=Math.max(0,XB.kick-dt*5);if(!rightDown)XB.lock=false;
  if(!XB.loaded){if(ammoPick()){XB.rT-=dt;if(XB.rT<=0){XB.loaded=true;try{Snd.clink?Snd.clink(.8):Snd.click();}catch(e){}ammoHud();}}return;}
  if(rightDown&&!XB.lock&&state==='playing'&&time>=(P.atkReady||0)){XB.lock=true;xbFire();}}
{const a=attack;attack=function(){if(weaponOf()==='xbow')return;return a();};}
// =========================================================
// Pfeilwirkungen: Feuer, Gift, Silber
// =========================================================
let SHOTX=null;
{const a=shotHit;shotHit=function(s){if(!s.atype||s.atype==='arrow')return a(s);const o=SHOTX;SHOTX=s;try{return a(s);}finally{SHOTX=o;}};}
const UNDEAD_T=/^(zombie|usk|nskel|lich|elderlich|mummy|skel)/;
{const a=hurtEnt;hurtEnt=function(e,n,by){const s=SHOTX;if(s&&e&&!e.dead&&e.fac==='demon'){if(s.atype==='arrow_silver'&&((e.d&&e.d.undead)||UNDEAD_T.test(e.type||'')))n*=2;
    if(s.atype==='arrow_fire'){e.burnT=Math.max(e.burnT||0,4);e.burnD=Math.max(e.burnD||0,7);}if(s.atype==='arrow_poison'){e.psnT=Math.max(e.psnT||0,6);e.psnD=Math.max(e.psnD||0,5);}}return a(e,n,by);};}
function ammoFxTick(dt){for(const e of DEM)if(e.psnT>0&&!e.dead){e.psnT-=dt;hurtEnt(e,e.psnD*dt,'player');if(Math.random()<dt*10)spawnParticle(e.x+(Math.random()-.5)*.6,e.y+Math.random()*e.h,e.z+(Math.random()-.5)*.6,0,.8,0,0x8ae040,.45,.18);}
  for(const s of SHOTS)if(s.atype==='arrow_fire'&&Math.random()<.8)spawnParticle(s.x,s.y,s.z,(Math.random()-.5)*.4,.4,(Math.random()-.5)*.4,Math.random()<.5?0xff8a20:0xffd040,.35,.12);}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{ammoFxTick(dt);}catch(e){if(!ammoFxTick.err){ammoFxTick.err=1;console.error(e);}}};}
// =========================================================
// Schilde: Ausdauer je Schildart, Verzauberungen, Abnutzung
// =========================================================
function shieldK(){const o=equip.off,it=o&&ITEMS[o.id];if(!it||!it.shield)return 1;return it.shield.cost*(it.ench==='sturdy'?.75:1);}
function shieldWear(n){const o=equip.off,it=o&&ITEMS[o.id];if(!it||!it.dur)return;if(o.d==null)o.d=it.dur;o.d-=n||1;if(o.d<=0){equip.off=null;try{Snd.toolBreak();}catch(e){}toast(it.name+' ist zerbrochen!');}renderInv();}
{const a=protNow;protNow=function(){const P0=a(),o=equip.off,it=o&&ITEMS[o.id],E=it&&it.shield&&it.ench&&ENCH[it.ench];if(E&&E.prot)for(const t in E.prot)P0[t]*=E.prot[t];return P0;};}
// =========================================================
// Haltbarkeit: alles dreifach, Rüstung und Schilde nutzen sich ab
// =========================================================
const ARMOR_DUR={helm:300,chainmail:420,leatherarmor:220,boots:220,molehelm:240,divehelm:400,flippers:200,seacrown:900,nattaarmor:1200};
{const isArm=it=>it&&(it.slot==='helm'||it.slot==='armor'||it.slot==='boots');
  for(const id in ITEMS){const it=ITEMS[id];if(it.base)continue;if(isArm(it)&&!it.dur)it.dur=it.mat&&MATS[it.mat]?MATS[it.mat].dur:(ARMOR_DUR[id]||300);if(it.dur&&(it.tool||it.weapon||it.slot))it.dur*=3;}
  for(const id in ITEMS){const it=ITEMS[id];if(!it.base)continue;const B=ITEMS[it.base],E=ENCH[it.ench];if(B&&B.dur)it.dur=Math.round(B.dur*(E&&E.dur?E.dur:1));}}
function armorWear(){let ch=false;for(const k of['helm','armor','boots']){const s=equip[k],it=s&&ITEMS[s.id];if(!it||!it.dur)continue;if(s.d==null)s.d=it.dur;s.d-=s.gem==='diamond'?.5:s.gem==='blackdia'?.15:1;ch=true;
    if(s.d<=0){equip[k]=null;try{Snd.toolBreak();}catch(e){}toast(it.name+' ist zerbrochen!');}}if(ch)try{renderEquip();}catch(e){}}
{const a=takeDamage;takeDamage=function(n){const h0=P.stats?P.stats.hp:0;const r=a(n);if(P.stats&&P.stats.hp<h0-.01)armorWear();return r;};}
// Alte Spielstände: vorhandene Abnutzung einmalig auf das neue Maß hochrechnen
function dur3Migrate(){if(FLAGS.dur3)return;FLAGS.dur3=1;const fix=s=>{if(s&&typeof s==='object'&&s.id&&ITEMS[s.id]&&typeof s.d==='number')s.d=Math.round(s.d*3);};
  for(const s of inv)fix(s);for(const k in equip)fix(equip[k]);const walk=(o,dep)=>{if(!o||typeof o!=='object'||dep>5)return;if(Array.isArray(o)){for(const q of o){fix(q);walk(q,dep+1);}return;}for(const k in o){const v=o[k];if(v&&typeof v==='object'){fix(v);walk(v,dep+1);}}};
  for(const k in FLAGS)if(k!=='tower'&&k!=='lvSeen')walk(FLAGS[k],0);}
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);try{if(isNew)FLAGS.dur3=1;else dur3Migrate();}catch(e){}return r;};}
// =========================================================
// Ego-Ansicht: Bögen und Armbrust (2D, in Stufen)
// =========================================================
const FPB={};
function fpArm(c,AX,AY,EX,EY,w){const arm=new Px(128,128),ang=Math.atan2(EY-AY,EX-AX),nx=-Math.sin(ang),nz=Math.cos(ang);w=w||9;
  fPoly(arm,[[AX+nx*w*.9,AY+nz*w*.9],[AX-nx*w*.9,AY-nz*w*.9],[EX-nx*w*1.4,EY-nz*w*1.4],[EX+nx*w*1.4,EY+nz*w*1.4]],GLV,{b:.05});
  for(let k=0;k<3;k++){const t=.32+k*.07,bx=AX+(EX-AX)*t,by=AY+(EY-AY)*t;for(let j=-14;j<=14;j++){const px=Math.round(bx+nx*j),py=Math.round(by+nz*j);if(px>=0&&py>=0&&px<128&&py<128&&arm.d[(py*128+px)*4+3])arm.set(px,py,k===1?hex('#c8a040'):GLV[1]);}}
  outline(arm);c.drawImage(arm.done(),0,0);}
function fpLine(c,x0,y0,x1,y1,col,w){c.fillStyle=col;const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)))||1;for(let i=0;i<=n;i++)c.fillRect(Math.round(x0+(x1-x0)*i/n-(w-1)/2),Math.round(y0+(y1-y0)*i/n-(w-1)/2),w,w);}
function fpBowFrame(t,stage){const C=BOWC[t],o=document.createElement('canvas');o.width=o.height=128;const c=o.getContext('2d');c.imageSmoothingEnabled=false;
  const G=[50,72],half=Math.min(60,58*C.len),y0=G[1]-half,y1=G[1]+half,limbX=y=>{const q=(y-G[1])/half,a=Math.abs(q);return G[0]+12*q*q-(C.curl&&a>.82?(a-.82)*34:0);};
  const R=[limbX(y0)+1,G[1]],s=typeof stage==='number'?stage:0,N=stage==='rel'?[R[0]+22,R[1]+26]:[R[0]+s*30,R[1]+s*38];
  fpArm(c,G[0]+2,G[1]+6,-34,170,9);
  // Bogen
  const p=new Px(128,128),L=pal(C.L);for(let y=Math.ceil(y0);y<=y1;y++){const q=(y-G[1])/half,a=Math.abs(q),x=limbX(y),th=a<.12?6:Math.max(2,4.4-a*2.4);
    for(let k=0;k<th;k++){let col=L[shadeIdx(.92-k/th*.65+(hash2(k,y>>2,7)-.5)*.1,L.length,k,y)];if(C.horn&&a>.84)col=pal(C.horn)[shadeIdx(.85-k/th*.6,3,k,y)];if(C.rune&&a>.2&&a<.8&&y%9===0&&k>0&&k<th-1)col=hex('#8af0ff');p.set(Math.round(x-th/2+k),y,col);}}
  outline(p);c.drawImage(p.done(),0,0);
  const T1=[limbX(y0)+1,y0+1],T2=[limbX(y1)+1,y1-1];const drawn=typeof stage==='number';
  fpLine(c,T1[0],T1[1],drawn||stage==='rel'?N[0]:R[0],drawn?N[1]:R[1],'#ece4cc',1);fpLine(c,T2[0],T2[1],drawn||stage==='rel'?N[0]:R[0],drawn?N[1]:R[1],'#ece4cc',1);
  if(stage==='rel'){fpLine(c,T1[0],T1[1],T2[0],T2[1],'#ece4cc',1);}
  // Hand am Griff
  {const f=fpFist();c.save();c.translate(G[0]+1,G[1]+2);c.rotate(-.15);c.drawImage(f,-11,-12);c.restore();}
  if(drawn){const A=[G[0]+3,G[1]-9],ux=A[0]-N[0],uy=A[1]-N[1],l=Math.hypot(ux,uy),dx=ux/l,dy=uy/l,H=[A[0]+dx*16,A[1]+dy*16];
    fpLine(c,N[0],N[1],H[0],H[1],'#6a4422',3);fpLine(c,N[0]+1,N[1],H[0]+1,H[1],'#b08850',1);
    for(let k=-3;k<=3;k++)fpLine(c,H[0]-dx*6+(-dy)*k*.9,H[1]-dy*6+dx*k*.9,H[0]+dx*2,H[1]+dy*2,k<0?'#dfe6ee':'#8a929c',1);
    for(let k=2;k<10;k++){c.fillStyle=k&1?'#c83a2a':'#ece4d2';c.fillRect(Math.round(N[0]+dx*k-dy*3),Math.round(N[1]+dy*k+dx*3),2,2);c.fillRect(Math.round(N[0]+dx*k+dy*3),Math.round(N[1]+dy*k-dx*3),2,2);}
    fpArm(c,N[0]+4,N[1]+6,170,150,8);const f=fpFist();c.save();c.translate(N[0],N[1]);c.rotate(.6);c.drawImage(f,-9,-11);c.restore();}
  else if(stage==='rel'){fpArm(c,N[0]+4,N[1]+6,170,150,8);const f=fpFist();c.save();c.translate(N[0],N[1]);c.rotate(.9);c.drawImage(f,-9,-11);c.restore();}
  return o.toDataURL();}
function fpXbFrame(loaded){const o=document.createElement('canvas');o.width=o.height=128;const c=o.getContext('2d');c.imageSmoothingEnabled=false;
  fpArm(c,52,90,-30,170,9);fpArm(c,80,112,170,160,9);const p=new Px(128,128),W=pal(['#2a1608','#4a2e14','#6e4622','#9a6a36']),I=pal(['#1e2026','#3a3e46','#666c76','#a4aab4']);
  fPoly(p,[[54,128],[74,128],[69,52],[59,52]],W,{b:.05});for(let y=52;y<104;y++){p.set(63,y,I[2]);p.set(64,y,I[1]);}
  for(let k=-46;k<=46;k++){const q=k/46,x=64+k,y=44-8*(1-q*q);for(let w=0;w<4;w++)p.set(x,y+w,w===0?I[3]:I[w<2?2:0]);}outline(p);c.drawImage(p.done(),0,0);
  if(loaded){fpLine(c,18,46,64,74,'#ece4cc',1);fpLine(c,110,46,64,74,'#ece4cc',1);fpLine(c,64,74,64,32,'#6a4422',3);fpLine(c,65,74,65,33,'#b08850',1);c.fillStyle='#a8b0ba';c.fillRect(61,26,6,7);c.fillStyle='#dfe6ee';c.fillRect(62,24,4,3);
    for(let y=64;y<72;y+=2){c.fillStyle='#c83a2a';c.fillRect(60,y,2,2);c.fillRect(66,y,2,2);}}
  else fpLine(c,18,46,110,46,'#ece4cc',1);
  for(const[x,y,r]of[[52,90,.2],[80,112,-.3]]){const f=fpFist();c.save();c.translate(x,y);c.rotate(r);c.drawImage(f,-11,-12);c.restore();}return o.toDataURL();}
bowFpBuild=function(){for(const t in BOWC)FPB[t]={idle:fpBowFrame(t,'idle'),d:[0,.25,.5,.75,1].map(s=>fpBowFrame(t,s)),rel:fpBowFrame(t,'rel')};FPB.xbow={L:fpXbFrame(true),E:fpXbFrame(false)};BOWFP.idle=FPB.bow.idle;};
const bowT=id=>{const it=ITEMS[id];if(!it)return'bow';const b=it.base?ITEMS[it.base]:it;return(b&&b.bow&&b.bow.t)||'bow';};
{const a=initFPItems;initFPItems=function(){a();try{if(!FPB.bow)bowFpBuild();for(const id in ITEMS){const it=ITEMS[id];if(it.weapon==='bow')it.fp=FPB[bowT(id)].idle;else if(it.weapon==='xbow')it.fp=FPB.xbow.L;}
    for(const[id]of IX_LIST()){const cv=IXC[id];if(cv){ICV[id]=cv;ITEMS[id].icon=cv.toDataURL();}}
    for(const id of ENCH_IDS){const it=ITEMS[id],src=ICV[it.base];if(src&&(IXC[it.base]||it.mat==='rune'))try{ICV[id]=enchIcon(src);it.icon=ICV[id].toDataURL();}catch(e){}}
    try{dropAtlas();}catch(e){}renderInv();}catch(e){console.error('Fernkampf Ego-Bilder',e);}};}
let BFP_POS=0;
bowFpTick=function(dt){const w=weaponOf(),isB=w==='bow',isX=w==='xbow',L=settings.hand==='left';
  if(!(isB||isX)||!FPB.bow||(P.view||0)||hand.hidden){if(BFP_POS){hand.style.left='';hand.style.right='';hand.style.bottom='';hand.style.width='';hand.style.transformOrigin='';BFP_POS=0;}BOWFP.k=0;return;}
  const pos=(isX?'x':'b')+(L?'L':'R');if(BFP_POS!==pos){BFP_POS=pos;const W=isX?50:56,off=isX?`calc(50vw - ${W/2}vmin)`:`calc(50vw - ${W*.62}vmin)`;hand.style.width=`min(${W}vmin,520px)`;hand.style.bottom=isX?'1vh':'3vh';hand.style.right=L?'auto':off;hand.style.left=L?off:'';hand.style.transformOrigin='50% 100%';}
  const hs=Math.hypot(P.vx,P.vz),bx=Math.sin(P.bob*Math.PI)*8*Math.min(hs/4,1),by=Math.abs(Math.cos(P.bob*Math.PI))*10*Math.min(hs/4,1);let want,tf;
  if(isB){const F=FPB[bowT(inv[HOT0+sel].id)];BOWFP.k+=((BOW.on?1:0)-BOWFP.k)*Math.min(1,dt*(BOW.on?12:7));const e=BOWFP.k*BOWFP.k*(3-2*BOWFP.k);
    want=BOW.on?F.d[Math.min(4,Math.floor(BOW.draw*4.999))]:(time-(BOW.relT||-9)<.16?F.rel:F.idle);
    const sh=BOW.on&&BOW.hold>1.6?Math.min(1,(BOW.hold-1.6)/1.5):0,jx=sh?(Math.random()-.5)*3*sh:0;
    tf=`translate(${bx*(1-e)+jx}px,${by*(1-e)+(1-e)*innerHeight*.07+BOW.kick*12}px) rotate(${(L?-1:1)*(1-e)*14}deg)`;}
  else{want=XB.loaded?FPB.xbow.L:FPB.xbow.E;const S=xbSpec(),q=XB.loaded?0:Math.sin(Math.PI*clamp(1-XB.rT/S.reload,0,1));tf=`translate(${bx}px,${by+q*innerHeight*.12+XB.kick*16}px) rotate(${(L?-1:1)*q*22}deg)`;}
  if(hand.getAttribute('src')!==want)hand.src=want;hand.style.transform=tf+(L?' scaleX(-1)':'');ammoHud();};
// Armbrust und Pfeilanzeige pro Bild
{const a=updatePlayer;updatePlayer=function(dt){a(dt);try{xbTick(dt);}catch(e){}};}
{const a=renderInv;renderInv=function(){const r=a.apply(this,arguments);try{ammoHud();}catch(e){}return r;};}
// =========================================================
// Ansicht von außen: Zielen und Blocken
// =========================================================
{const a=composeHero;composeHero=function(frame,back,pose,pad){if(pose!=='aim'&&pose!=='block')return a(frame,back,pose,pad);
  if(pose==='aim'){const out=a(frame,back,'brace',pad);return out;}
  const out=a(frame,back,undefined,pad),off=equip.off,ic=off&&(ICV[off.id]||(SPR[off.id]&&SPR[off.id].c));if(!ic)return out;const ctx=out.getContext('2d'),mr=settings.hand!=='left',offRight=back?!mr:mr,hb=out.headBox||[0,0,20,30];
  ctx.imageSmoothingEnabled=false;const S=22,cx=(pad||0)+22+(offRight?7:-7)*(back?.6:1),cy=(hb[3]||30)+3;ctx.globalAlpha=back?.85:1;ctx.drawImage(ic,cx-S/2,cy,S,S);ctx.globalAlpha=1;return out;};}
{const a=buildPlayerSprite;buildPlayerSprite=function(){a();try{const tex=playerMat.uniforms.map.value,old=tex.image,n0=Math.round(old.width/64),EX=[['fa',0,0,'aim'],['ba',0,1,'aim'],['fd',0,0,'block'],['bd',0,1,'block']],n=n0+EX.length;
    const cv=document.createElement('canvas');cv.width=64*n;cv.height=60;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(old,0,0);
    EX.forEach(([k,f,b,pose],i)=>{ctx.drawImage(composeHero(f,!!b,pose,10),(n0+i)*64,0);SPR['pl_'+k]={u:(n0+i)/n,v:0,du:1/n,dv:1,w:64,h:60};});
    for(const k in SPR)if(k.startsWith('pl_')&&SPR[k].du===1/n0){const i=Math.round(SPR[k].u*n0);SPR[k]=Object.assign({},SPR[k],{u:i/n,du:1/n});}
    const t=new THREE.CanvasTexture(cv);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;playerMat.uniforms.map.value=t;tex.dispose();}catch(e){console.error('Haltungen',e);}};}
placeCamera=(a=>function(b,hs){const r=a(b,hs);const v=P.view||0;if(v&&playerMesh&&playerMesh.visible){const w=weaponOf(),aim=(BOW.on||(w==='xbow'&&rightDown)),blk=BLK.on;
    if(aim||blk){const s=SPR['pl_'+(v===1?'b':'f')+(aim?'a':'d')];if(s){const uvr=playerMesh.geometry.attributes.uvr;uvr.array[0]=s.u;uvr.array[1]=s.v;uvr.array[2]=s.du;uvr.array[3]=s.dv;uvr.needsUpdate=true;}}}return r;})(placeCamera);
// =========================================================
// Info-Karten
// =========================================================
{const a=loreHTML;loreHTML=function(s){let h=a(s);const it=ITEMS[s.id];if(!it)return h;const E=it.ench&&ENCH[it.ench];
  if(it.bow){const B=it.bow,mx=Math.round(B.dmg*1.1*(E&&E.dmg?1+E.dmg:1));h=h.replace(/Pfeilschaden: <b>[^<]*<\/b>/,`Pfeilschaden: <b>${Math.round(B.dmg*.3)}–${mx}</b>`).replace(/Voll gespannt nach <b>[^<]*<\/b>/,`Voll gespannt nach <b>${String(B.draw).replace('.',',')} s</b>`);}
  if(it.xb){const B=it.xb;h=h.replace(/<div class="st">(Schaden|Tempo|Ausdauer)[\s\S]*?<\/div>/g,'').replace(/(<div class="ty">[\s\S]*?<\/div>)/,`$1<div class="st">Pfeilschaden: <b>${Math.round(B.dmg*(E&&E.dmg?1+E.dmg:1))}</b></div><div class="st">Nachladen: <b>${String(B.reload).replace('.',',')} s</b></div><div class="st">Rechtsklick schießt</div>`);}
  if(it.shield){const k=Math.round(it.shield.cost*(it.ench==='sturdy'?.75:1)*100);h=h.replace(/Rechtsklick halten: <b>blocken<\/b>[^<]*/,`Rechtsklick halten: <b>blocken</b>, 100 % Schutz von vorne`).replace(/Halten kostet <b>3<\/b> Ausdauer pro Sekunde, jeder Treffer etwas mehr/,`Ausdauer beim Blocken: <b>${k} %</b>`);
    if(E&&E.shLore&&it.ench==='sturdy')h=h.replace(E.lore,E.shLore);if(!/class="ty"/.test(h))h=h.replace(/(<\/h5>)/,'$1<div class="ty">Schild · Zweithand</div>');}
  if(AMMO.includes(s.id))h=h.replace(/(<\/h5>)/,'$1<div class="ty">Munition</div>');return h;};}
{const a=itemInfo;itemInfo=function(id){const it=ITEMS[id];if(it&&it.bow)return'bis '+Math.round(it.bow.dmg*1.1)+' Pfeilschaden · '+(it.dur||'')+' Haltbarkeit';if(it&&it.xb)return it.xb.dmg+' Pfeilschaden · lädt '+String(it.xb.reload).replace('.',',')+' s';
  if(it&&it.shield)return'Blocken: '+Math.round(it.shield.cost*100)+' % Ausdauer · '+it.dur+' Haltbarkeit';return a(id);};}
