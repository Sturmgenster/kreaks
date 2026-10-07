/* =========================================================
   V62 · Der Markt von Coda: sechs Händler an ihren Ständen (tagsüber),
   Gustls Trödelladen, und jeder Händler kauft nur noch, was zu seinem Handwerk passt.
   ========================================================= */
// ---------- Leute ----------
const MARKET_FOLK=[
  {name:'Wilma',role:'Kräuterfrau',d:{sex:'f',elder:true,skin:0,hair:'white',style:'bun',dress:true,top:'green',apron:'cream',tw:11,cane:false}},
  {name:'Anselm',role:'Bäcker',d:{sex:'m',skin:2,hair:'blond',style:'short',beard:null,top:'cream',bottom:'brown',apron:'cream',tw:15,chubby:true}},
  {name:'Bruno',role:'Holzhändler',d:{sex:'m',skin:1,hair:'brown',style:'short',beard:'long',top:'red',bottom:'brown',tw:15,chubby:false}},
  {name:'Greta',role:'Jägerin',d:{sex:'f',skin:3,hair:'red',style:'braid',dress:false,top:'brown',bottom:'leather',tw:11}},
  {name:'Kuno',role:'Steinmetz',d:{sex:'m',skin:2,hair:'black',style:'bald',beard:'short',top:'grey',bottom:'grey',apron:'leather',tw:15,chubby:true}},
  {name:'Ilse',role:'Tuchhändlerin',d:{sex:'f',skin:1,hair:'black',style:'long',dress:true,top:'teal',tw:11}},
  {name:'Gustl',role:'Trödler',d:{sex:'m',elder:true,skin:0,hair:'grey',style:'short',beard:'short',top:'ochre',bottom:'brown',tw:13,cane:true}}];
for(const F of MARKET_FOLK)VDEFS.push(Object.assign({name:F.name,bottom:'brown'},F.d,{seed:900+VDEFS.length*7,role:F.role,id:VDEFS.length}));
// ---------- Waren der Marktstände (Pool, daraus jeden Tag eine Auswahl) ----------
const STALL={
  Wilma:{title:'Wilmas Kräuterstand',greet:'Heiltränke, Stärkungen, alles aus eigenen Kräutern. Blumen, Pilze und Beeren kaufe ich dir ab.',
    pool:[['hpot',36],['hpot',36],['hpot2',105],['pstam',230],['pregen',470],['pspeed',390],['pmana',280],['pmregen',440],['pstr',460]],n:4,sell:[['flower',3],['mushroom',4],['berries',2]],
    news:['Gegen Wolfsbisse hilft nur ein guter Heiltrank. Und Abstand.','Corvin braut auch Tränke. Aber meine schmecken nicht nach Kirche.','Bei Blutmond pflücke ich nichts. Da wächst das Falsche.']},
  Anselm:{title:'Anselms Backstube',greet:'Frisches Brot, Met und was Warmes für unterwegs! Weizen kaufe ich, für mein Brot.',
    pool:[['bread',5],['bread',5],['mead',9],['roastmeat',7],['berries',3],['coconut',5],['banana',4],['cactusf',4]],n:4,sell:[['wheat',3],['berries',2]],
    news:['Lutz bringt mir jeden Morgen Weizen. Wenn er nicht verschläft.','Hagen sagt, mein Brot sei zu teuer. Hagens Bier ist zu dünn.','Wer früh kommt, kriegt das warme Brot.']},
  Bruno:{title:'Brunos Holzhandel',greet:'Holz für jeden Zweck! Eiche, Kiefer, Birke, und manchmal was Edles. Gewöhnliches Holz kaufe ich dir auch ab.',
    pool:[['w_oak',4],['w_pine',3],['w_birch',3],['w_dark',7],['w_cherry',15],['w_maple',13],['w_ash',18],['w_acacia',8],['stick',1],['workbench',30]],n:5,sell:[['w_oak',2],['w_pine',2],['w_birch',2],['stick',1]],
    news:['Dofra will kein Holz mehr annehmen. Sagt, er sei Schmied, kein Köhler. Mir recht, dann kommt ihr zu mir.','Das Schwarzholz aus dem Tiefen Wald riecht nach Rauch, auch wenn es nie gebrannt hat.','Meister Wen im Osten zahlt gut für Edelholz. Ich kann nicht mithalten.']},
  Greta:{title:'Gretas Jagdstand',greet:'Fleisch, Felle, Geweihe. Alles ehrlich erlegt. Was du selbst erlegst, kaufe ich dir ab.',
    pool:[['meat',5],['roastmeat',7],['fur',12],['antler',18],['feather',6],['leatherarmor',58],['boots',22],['rope',6]],n:4,sell:[['meat',4],['fur',7],['antler',10],['feather',3]],
    news:['Im Norden ziehen die Hirsche in Herden. Nachts schlafen sie dicht beieinander.','Wenn Wölfe heulen, bleib in der Nähe vom Feuer.','Löwen in der Savanne? Ich jage nur, was mich nicht jagt.']},
  Kuno:{title:'Kunos Steine und Erze',greet:'Steine, Lehm, Kohle und Erz. Und wer mir Steine bringt, kriegt ein paar Kupfer.',
    pool:[['stone',3],['coal',3],['iron_ore',6],['clay',4],['bauxite',8],['iron_ingot',16],['torch',4],['furnace',45]],n:5,sell:[['stone',2],['clay',2],['coal',2]],
    news:['Einen Schmelzofen? Baust du dir aus Steinen an der Werkbank. Oder kaufst ihn bei mir, wenn ich einen habe.','Die Brunnenmauer am Markt ist mein Werk. Na ja, war.','In den Höhlen findest du Kohle. Und Ärger.']},
  Ilse:{title:'Ilses Tuch und Hausrat',greet:'Wolle, Leinen, Seile, und alles, was ein Zuhause gemütlich macht. Wolle und Leinen kaufe ich an.',
    pool:[['wool',8],['linen',6],['rope',6],['bedroll',32],['chair',14],['table',22],['chest',30],['shelf',18],['bed',60]],n:4,sell:[['wool',4],['linen',3],['fiber',1]],
    news:['Die Froschleute knüpfen die besten Seile. Ich weiß nicht, wie, mit den Fingern.','Ein Zimmer bei Hagen? Ohne Bett ist das nur eine Kammer.','Albrecht zahlt gut für Hilfe. Frag im Rathaus.']}};
const marketDay=()=>FLAGS.day||0;
function stallStock(name){const S=STALL[name],day=marketDay();if(S.day===day&&SHOPS[name])return;S.day=day;const r=mulberry32((FLAGS.seed||1)*7+day*613+name.length*97+name.charCodeAt(0)),pool=S.pool.slice(),out=[],seen=new Set();
  while(out.length<S.n&&pool.length){const k=(r()*pool.length)|0,[id,p]=pool.splice(k,1)[0];if(seen.has(id))continue;seen.add(id);out.push([id,Math.max(1,Math.round(p*(.9+r()*.35)))]);}
  SHOPS[name]={title:S.title,greet:S.greet,buy:out,sell:S.sell.slice()};}
// ---------- Trödler ----------
const JUNK_SKIP=new Set(['coin','silver','copper','tablet1','tablet2','tablet3','jungleheart','akuma','emeraldidol']);
const JUNK_RARE=[['goldfish',90],['molehelm',150],['horsearmor',190],['nattaskin',160],['sapphire',140],['emerald',160],['ruby',170],['opal',150],['silverscarab',120],['goldscarab',220],['jaguartooth',140],['ivory',40],['horn',36],['luckcharm',260]];
let VALUE=null;
function itemValue(id){if(!VALUE){VALUE={};const put=(i,v)=>{if(v>0&&(!VALUE[i]||v>VALUE[i]))VALUE[i]=v;};
    for(const k in SHOPS){const d=SHOPS[k];(d.buy||[]).forEach(([i,p])=>put(i,p));(d.sell||[]).forEach(([i,p])=>put(i,p*2.2));(d.base||[]).forEach(([i,p])=>put(i,p));}
    MERCH_POOL.forEach(([i,p])=>put(i,p));for(const k in STALL){STALL[k].pool.forEach(([i,p])=>put(i,p));STALL[k].sell.forEach(([i,p])=>put(i,p*2.2));}JUNK_RARE.forEach(([i,p])=>put(i,p/1.3));}
  if(VALUE[id])return VALUE[id];const m=/^(iron|alu|silver|mythril|adamant|diamond|black)_(pick|axe|sword|helm|armor|boots)$/.exec(id);
  if(m){const T={iron:1,alu:1.3,silver:1.8,mythril:3.2,adamant:4.6,diamond:6.5,black:8.5}[m[1]],B={pick:40,axe:40,sword:60,helm:45,armor:85,boots:32}[m[2]];return VALUE[id]=Math.round(T*B);}
  return ITEMS[id]&&ITEMS[id].slot?20:2;}
const JUNK={title:'Gustls Trödelladen',greet:'Kauf ich, kauf ich alles! Zahlen tu ich wenig, das ist das Geschäft. Und was ich verkaufe, gibt es woanders nicht. Oder nicht so günstig. Oder überhaupt nicht.'};
function junkStock(){const day=marketDay();if(JUNK.day===day&&SHOPS.Gustl)return;JUNK.day=day;const r=mulberry32((FLAGS.seed||1)*13+day*389+5),ids=Object.keys(ITEMS).filter(i=>!JUNK_SKIP.has(i)&&SPR[i]&&itemValue(i)>=3&&VALUE[i]&&!JUNK_RARE.some(x=>x[0]===i));
  const out=[],seen=new Set();while(out.length<6&&ids.length){const k=(r()*ids.length)|0,id=ids.splice(k,1)[0];if(seen.has(id))continue;seen.add(id);out.push([id,Math.max(2,Math.round(itemValue(id)*(1.3+r()*.3)))]);}
  // Hin und wieder etwas Besonderes, das es sonst nirgends gibt
  const nR=r()<.55?(r()<.3?2:1):0;const R=JUNK_RARE.slice();for(let k=0;k<nR&&R.length;k++){const[id,p]=R.splice((r()*R.length)|0,1)[0];if(ITEMS[id])out.unshift([id,Math.round(p*(1+r()*.25))]);}
  JUNK.special=nR>0;SHOPS.Gustl={title:JUNK.title,greet:JUNK.greet+(nR?' Heute habe ich übrigens was ganz Besonderes da!':''),buy:out,sell:[]};}
function junkSellList(){const L=[],seen=new Set();for(const s of inv){if(!s||seen.has(s.id)||JUNK_SKIP.has(s.id))continue;seen.add(s.id);L.push([s.id,Math.max(1,Math.floor(itemValue(s.id)*.3))]);}SHOPS.Gustl.sell=L;}
{const os0=openShop;openShop=function(name){if(STALL[name])stallStock(name);if(name==='Gustl'){junkStock();junkSellList();}os0(name);if(name==='Gustl'){const t=document.querySelector('#shop .shop-tabs [data-tab="sell"]');if(t)t.hidden=false;}};}
// ---------- Glücksbringer: gibt es nur beim Trödler ----------
ITEMS.luckcharm={name:'Glücksbringer',plural:'Glücksbringer',slot:'neck'};ITEM_DESC.luckcharm='Vierblättriger Klee in Messing. +15 % Erfahrung';
{const cs0=craftSprites;craftSprites=function(list){cs0(list);const p=new Px(14,14),B=pal(['#5a4018','#8a6a2a','#c8a040','#ecd27a']),G=pal(['#1e4a14','#2e6a1e','#4a8e2c','#6eb040']);
  for(let k=0;k<6;k++){p.set(3+k*.7,k,B[1]);p.set(10-k*.7,k,B[1]);}
  for(const[cx,cy]of[[5.5,6.5],[8.5,6.5],[5.5,9.5],[8.5,9.5]])for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)if(x*x+y*y<=4)p.set(cx+x,cy+y,x*x+y*y>=3?B[2]:G[1+((x+y)>0?0:1)+(x<0&&y<0?1:0)]);
  p.set(7,8,B[3]);p.set(7,12,G[0]);p.set(7,13,G[0]);outline(p);list.push(['luckcharm',p.done()]);};}
{const gx0=gainXP;gainXP=function(n){if(equip&&equip.neck&&equip.neck.id==='luckcharm')n*=1.15;return gx0(n);};}
// ---------- Plätze, Tagesablauf ----------
{const sv1=setupVillagers;setupVillagers=function(){sv1();try{const homes=VB.filter(b=>b.type==='house'&&b.door);
  MARKET_FOLK.forEach((F,i)=>{const v=villagers.find(q=>q.name===F.name);if(!v)return;
    if(F.name==='Gustl'){const T=VB.find(b=>b.type==='house'&&b.home===8)||homes[0];const[x,z]=T.door;v.ax=x;v.az=z;v.rad=1.6;v.home=[x,z];v.bed=1260;v.wake=480;v.x=x;v.z=z;v.junk=1;}
    else{const S=MARKET.find(s=>s.ci===i)||MARKET[i];if(!S||!S.trader)return;const[x,z]=S.trader;v.ax=x;v.az=z;v.rad=.3;v.stall=S;const h=homes[(i*5+3)%homes.length];v.home=[h.door[0],h.door[1]];v.bed=1170+i*4;v.wake=420+i*5;v.x=x;v.z=z;}
    v.tx=v.x;v.tz=v.z;v.y=getHeight(v.x,v.z);});}catch(e){console.error('Markt',e);}};}
// ---------- Gespräche ----------
for(const name in STALL){const S=STALL[name];DIALOGS[name]={start:()=>'hello',nodes:{
  hello:()=>({text:S.greet,opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop(name);return null;}},{label:'Was gibt es Neues?',go:'news'},{label:'Bis bald.',go:null}]}),
  news:()=>({text:S.news[(Math.random()*S.news.length)|0],opts:[{label:'Zurück',go:'hello'}]})}};}
DIALOGS.Gustl={start:()=>'hello',nodes:{
  hello:()=>{junkStock();return{text:JUNK.special?'Psst! Komm her, komm her. Heute hab ich was, das hat sonst keiner. Nicht Dofra, nicht die Händler auf dem Markt, keiner!':'Gustl, Trödel und Krempel. Ich kaufe alles, wirklich alles. Reich wirst du dabei nicht. Aber du wirst es los.',
    opts:[{label:'Was hast du heute?',act:()=>{openShop('Gustl');return null;}},{label:'Woher hast du das ganze Zeug?',go:'from'},{label:'Tschüss, Gustl.',go:null}]};},
  from:()=>({text:'Hier und da. Reisende lassen was liegen, Händler werden ihre Ladenhüter los, und manchmal spült der Fluss was an. Frag nicht zu genau. Jeden Morgen räume ich mein Regal neu ein, also schau öfter mal vorbei.',opts:[{label:'Zurück',go:'hello'}]})}};
// ---------- Weniger Ankauf bei den anderen Händlern ----------
const SELL_ONLY={
  Dofra:['iron_ore','bauxite','silver_ore','gold_ore','coal','iron_ingot','alu_ingot','silver_ingot','gold_ingot','horseshoe','dagger','sword','axe','spear','shield','helm','chainmail','ring','amulet'],
  Hagen:['mushroom','meat','wheat','berries'],
  Quorg:['perch','trout','carp','pike','goldfish','bamboo'],
  Murgla:['mushroom','flower','linen','bones'],
  Bana:['meat','roastmeat','fur','feather','ivory','horn','crocskin'],
  'Meister Wen':['w_dark','w_red','w_maha','w_cherry','w_maple','w_ash'],
  Schorf:['iron_ingot','alu_ingot','silver_ingot','gold_ingot','mythril_ingot','adamant_ingot','w_oak','w_pine','w_dark'],
  'Wühla':['meat','mushroom']};
const SELL_EXTRA={Dofra:[['alu_ingot',14],['bauxite',3],['silver_ore',6],['gold_ore',8]]};
const MERCH_SELL={Bertram:[['fur',7],['antler',10],['meat',3]],Wanda:[['wool',5],['perch',3],['trout',5]],Ole:[['chitin',14],['antler',10],['w_red',4]]};
function restrictShop(name){const S=SHOPS[name],keep=SELL_ONLY[name];if(!S||!keep||S._r)return;S._r=1;const ex=SELL_EXTRA[name]||[];
  S.sell=S.sell.filter(([id])=>keep.includes(id)).concat(ex.filter(([id])=>!S.sell.some(x=>x[0]===id)));}
const SHOP_GREET={Dofra:'Hufeisen, Klingen, Rüstungen. Alles ehrliche Arbeit. Ankaufen tu ich nur, was in die Esse gehört: Erz, Kohle, Barren und altes Eisen. Holz? Bring das zu Bruno auf den Markt.',
  Hagen:'Frisches Brot und Met aus eigener Herstellung. Pilze, Fleisch, Weizen und Beeren kaufe ich für die Küche.',
  Schorf:'Werkzeug, das nicht bricht. Fast nie. Barren kaufe ich, und gutes Holz, hier unten wächst ja keins.'};
function restrictAll(){for(const n in SELL_ONLY)restrictShop(n);for(const n in SHOP_GREET)if(SHOPS[n])SHOPS[n].greet=SHOP_GREET[n];VALUE=null;}
{const sw1=setupStoryDialogs;setupStoryDialogs=function(){sw1();try{restrictAll();}catch(e){console.error('Ankauf',e);}};}
{const am1=addMoleNPC;addMoleNPC=function(name,x,z,o){const m=am1(name,x,z,o);try{restrictShop(name);if(SHOP_GREET[name]&&SHOPS[name])SHOPS[name].greet=SHOP_GREET[name];}catch(e){}return m;};}
{const ms1=merchStock;merchStock=function(m){ms1(m);const S=SHOPS[m.name];if(S&&MERCH_SELL[m.name])S.sell=MERCH_SELL[m.name].slice();};}
// Dialogzeilen, die noch vom Holzverkauf bei Dofra sprechen
{const op1=openShop;openShop=function(name){if(SELL_ONLY[name])restrictShop(name);op1(name);};}
