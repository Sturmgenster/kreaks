/* =========================================================
   SCHMUCK (0.0.103)
   - Ringe: +1 bis +20 % Regeneration für Leben, Ausdauer oder Mana.
     Bis zu 3 Ringe gleichzeitig, die Werte addieren sich.
   - Amulette: +1 bis +150 % auf den Höchstwert von Leben, Ausdauer oder Mana.
     Nur eins gleichzeitig. Wächst mit jedem Skillpunkt in diesem Wert mit.
   - Niedrige Werte sind häufig, hohe selten (und teuer).
   - Nur einige Händler und die reisenden Händler haben Schmuck: 1 bis 3 Stück,
     manchmal gar keinen. Was verkauft ist, ist weg. Alle 3 Tage neue Ware.
   ========================================================= */
const JW_STAT={hp:{n:'Leben',gem:'Rubin',col:['#5a0c10','#a01c20','#e84a4a','#ffb0a8']},st:{n:'Ausdauer',gem:'Smaragd',col:['#0c3a14','#1a7a2a','#4ac85a','#b8ffb0']},mp:{n:'Mana',gem:'Saphir',col:['#0a1a5a','#1a48b0','#4a8ae8','#b8d8ff']}};
const JW_METAL=[['Kupfer',['#4a2410','#8a4a20','#c87a3a','#f0b878']],['Silber',['#4a4e58','#8a909a','#cad0da','#ffffff']],['Gold',['#5a3a08','#a87a18','#e8c040','#fff0a0']]];
const JW_MAX={r:20,a:150},JW_DAYS=3;
const jwTier=(t,p)=>t==='r'?(p<=7?0:p<=14?1:2):(p<=50?0:p<=100?1:2);
// ---------- Bilder ----------
function jwDraw(t,s,m){const G=pal(JW_STAT[s].col),M=pal(JW_METAL[m][1]);
  if(t==='r'){const p=new Px(14,14);for(let y=0;y<14;y++)for(let x=0;x<14;x++){const d=Math.hypot(x-6.5,(y-8)*1.05);if(d>5.4||d<3.4)continue;p.set(x,y,M[shadeIdx(.66-(x-6.5)/12-(y-8)/12,4,x,y)]);}
    for(let y=0;y<5;y++)for(let x=4;x<10;x++){const d=Math.hypot(x-6.5,y-2.3);if(d>2.9)continue;p.set(x,y,G[shadeIdx(.72-(x-6.5)/7-(y-2.3)/6,4,x,y)]);}p.set(5,1,hex('#ffffff'));
    for(const x of[3,10])p.set(x,3,M[3]);if(m===2){p.set(1,1,hex('#fff6c0'));p.set(12,2,hex('#fff6c0'));}outline(p);return p.done();}
  const p=new Px(14,16);for(let k=0;k<15;k++){const a=Math.PI*k/14,x=6.5+Math.cos(a)*5.8,y=1+Math.sin(a)*6.5;p.set(x,y,M[1+(k&1)*2]);}
  for(let y=7;y<15;y++)for(let x=2;x<12;x++){const d=Math.abs(x-6.5)/4.5+Math.abs(y-10.5)/4;if(d>1)continue;p.set(x,y,d>.72?M[shadeIdx(.6-(x-6.5)/9,4,x,y)]:G[shadeIdx(.75-(x-6.5)/8-(y-10.5)/8,4,x,y)]);}
  p.set(5,9,hex('#ffffff'));if(m===2){p.set(0,9,hex('#fff6c0'));p.set(13,12,hex('#fff6c0'));}outline(p);return p.done();}
const JW_BASES=[];for(const t of['r','a'])for(const s in JW_STAT)for(let m=0;m<3;m++)JW_BASES.push('jwb_'+t+'_'+s+'_'+m);
{const a=part1Sprites;part1Sprites=function(list){a(list);try{for(const k of JW_BASES){const[,t,s,m]=k.split('_');list.push([k,jwDraw(t,s,+m)]);}}catch(e){console.error('Schmuck',e);}};}
DROP_EXTRA.push(...JW_BASES);
// ---------- Gegenstände (werden bei Bedarf angelegt) ----------
const JW_ICON={};
function jwEnsure(id){if(ITEMS[id])return true;const m=/^jw_([ra])_(hp|st|mp)_(\d+)$/.exec(id||'');if(!m)return false;const t=m[1],s=m[2],p=Math.max(1,Math.min(JW_MAX[t],+m[3])),S=JW_STAT[s],tier=jwTier(t,p),base='jwb_'+t+'_'+s+'_'+tier;
  const nm=t==='r'?`${S.gem}ring (+${p} % ${S.n}-Regeneration)`:`${S.gem}amulett (+${p} % ${S.n})`;
  ITEMS[id]={name:nm,plural:nm,slot:t==='r'?'ring':'neck',jw:{t,s,p}};
  ITEM_DESC[id]=t==='r'?`Ring: ${S.n} regeneriert ${p} % schneller. Bis zu 3 Ringe gleichzeitig.`:`Amulett: +${p} % maximales ${S.n}. Wächst mit deinen Skillpunkten in ${S.n}.`;
  if(SPR[base]){SPR[id]=SPR[base];if(!JW_ICON[base])JW_ICON[base]=SPR[base].c.toDataURL();ITEMS[id].icon=JW_ICON[base];if(DSPR[base])DSPR[id]=DSPR[base];}return true;}
function jwAtlasReady(){for(const id in ITEMS)if(ITEMS[id].jw){const{t,s,p}=ITEMS[id].jw,b='jwb_'+t+'_'+s+'_'+jwTier(t,p);if(DSPR[b])DSPR[id]=DSPR[b];}}
function jwRoll(t,r){const e=t==='r'?3.2:3.6;return Math.max(1,Math.min(JW_MAX[t],1+Math.floor(JW_MAX[t]*Math.pow(r(),e))));}
function jwPrice(t,p){return Math.round((t==='r'?60+Math.pow(p,1.6)*28:80+Math.pow(p,1.5)*5)/10)*10;}
// Alle Schmuck-Namen aus einem Spielstand anlegen, bevor er geladen wird
function jwScan(o){try{const s=typeof o==='string'?o:JSON.stringify(o);const L=s.match(/jw_[ra]_(hp|st|mp)_\d+/g);if(L)for(const id of new Set(L))jwEnsure(id);}catch(e){}}
{const a=loadGame;loadGame=function(){try{jwScan(store.get(SLOT_KEY(curSlot)));}catch(e){}return a.apply(this,arguments);};}
{const a=mpDropMsg;mpDropMsg=function(m){if(m&&m.id)jwEnsure(m.id);return a(m);};}
// ---------- Wirkung ----------
function jwBonus(){const R={hp:0,st:0,mp:0},A={hp:0,st:0,mp:0};if(typeof equip==='undefined')return{R,A};
  for(const k of['ring0','ring1','ring2']){const s=equip[k],j=s&&ITEMS[s.id]&&ITEMS[s.id].jw;if(j&&j.t==='r')R[j.s]+=j.p;}
  const n=equip.neck,j=n&&ITEMS[n.id]&&ITEMS[n.id].jw;if(j&&j.t==='a')A[j.s]+=j.p;return{R,A};}
function jwBase(){const c=P.char;if(!c)return null;const S=charStats(c),B=FLAGS.skills||{};return{hp:S.hp+(B.hp||0),st:S.st+(B.st||0),mp:S.noMagic?0:S.mp+(B.mp||0)};}
function jwApplyMax(){const S=P.stats,b=jwBase();if(!S||!b)return;const{A}=jwBonus();let ch=false;
  for(const[k,mk]of[['hp','maxHp'],['st','maxSt'],['mp','maxMp']]){const want=Math.round(b[k]*(1+A[k]/100));if(S[mk]!==want){S[mk]=want;if(S[k]>want)S[k]=want;ch=true;}}
  if(ch)try{renderStats();}catch(e){}}
{const a=applyChar;applyChar=function(keep){const o=P.stats?Object.assign({},P.stats):null;a.apply(this,arguments);jwApplyMax();
  if(keep&&o){const S=P.stats;S.hp=Math.min(S.maxHp,o.hp);S.st=Math.min(S.maxSt,o.st);S.mp=Math.min(S.maxMp,o.mp);try{renderStats();}catch(e){}}};}
let jwT=0;
{const a=updatePlayer;updatePlayer=function(dt){const S=P.stats,h0=S?S.hp:0,s0=S?S.st:0,m0=S?S.mp:0;a(dt);if(!S||state==='dead')return;
  const{R}=jwBonus();if(R.hp&&S.hp>h0)S.hp=Math.min(S.maxHp,S.hp+(S.hp-h0)*R.hp/100);if(R.st&&S.st>s0)S.st=Math.min(S.maxSt,S.st+(S.st-s0)*R.st/100);if(R.mp&&S.mp>m0)S.mp=Math.min(S.maxMp,S.mp+(S.mp-m0)*R.mp/100);
  jwT-=dt;if(jwT<=0){jwT=.25;jwApplyMax();}};}
// ---------- Händler ----------
// Chance pro 3 Tage, dass der Händler überhaupt Schmuck hat
const JW_SHOPS={Dofra:.45,Murgla:.4,Corvin:.35,Sefu:.4,Gustl:.5,Wilma:.15,Bertram:.5,Wanda:.55,Ole:.6};
function jwOffer(name){const ch=JW_SHOPS[name];if(ch==null)return null;const per=Math.floor((FLAGS.day||0)/JW_DAYS);FLAGS.jwShop=FLAGS.jwShop||{};let o=FLAGS.jwShop[name];
  if(!o||o.p!==per){const r=mulberry32(((FLAGS.seed||1)*53+per*6271+strHash(name)*7)|0);o={p:per,items:[]};
    if(r()<ch){const q=r(),n=q<.5?1:q<.8?2:3;for(let i=0;i<n;i++){const t=r()<.65?'r':'a',ss=['hp','st','mp'][(r()*3)|0],p=jwRoll(t,r),id=`jw_${t}_${ss}_${p}`;
        o.items.push({id,price:Math.round(jwPrice(t,p)*(.9+r()*.25)/10)*10,sold:false});}}
    FLAGS.jwShop[name]=o;}
  for(const it of o.items)jwEnsure(it.id);return o.items.length?o:null;}
{const a=shopItems;shopItems=function(){const L=a();if(!shop)return L;
  if(shop.tab==='sell'){if(JW_SHOPS[shop.name]!=null){const seen=new Set();for(const s of inv)if(s&&ITEMS[s.id]&&ITEMS[s.id].jw&&!seen.has(s.id)){seen.add(s.id);const j=ITEMS[s.id].jw,n=countItem(s.id);
      L.push({kind:'sell',id:s.id,price:Math.round(jwPrice(j.t,j.p)*.4/10)*10||10,name:ITEMS[s.id].name,icon:ITEMS[s.id].icon,info:`Du hast ${n}`,on:n>0,btn:'Verkaufen',n});}}return L;}
  const o=jwOffer(shop.name);if(!o)return L;
  o.items.forEach((it,k)=>{const I=ITEMS[it.id];L.unshift({kind:'buy',id:it.id,price:it.price,name:I.name,icon:I.icon,info:it.sold?'Verkauft – in ein paar Tagen gibt es vielleicht neuen Schmuck':ITEM_DESC[it.id],on:!it.sold&&wallet()>=it.price,btn:it.sold?'Verkauft':'Kaufen',jw:it,own:it.sold});});return L;};}
{const a=shopClick;shopClick=function(i,all){const x=shop&&shop.list&&shop.list[i];if(!x||!x.jw)return a(i,all);const it=x.jw;
  if(it.sold){Snd.click();shopMsg('Das Schmuckstück ist schon verkauft.',true);return;}
  x.own=false;const n0=countItem(x.id);a(i,all);if(countItem(x.id)>n0){it.sold=true;shopMsg(`${x.name} gekauft. Leg es im Inventar an (Ring- oder Kettenplatz).`);renderShop();}};}
{const a=openShop;openShop=function(name){a.apply(this,arguments);try{const o=jwOffer(name);if(o&&o.items.some(i=>!i.sold)&&shop){$('shopGreet').textContent=(shop.def.greet||'')+' Schau dir auch meinen Schmuck an, der hat Kraft in sich.';}}catch(e){}};}
// Die alten Ringe und Ketten ohne Wirkung gibt es nicht mehr zu kaufen
for(const k in SHOPS){const S=SHOPS[k];if(S&&S.buy)S.buy=S.buy.filter(([id])=>id!=='ring'&&id!=='amulet');}
for(let i=MERCH_POOL.length-1;i>=0;i--)if(MERCH_POOL[i][0]==='ring'||MERCH_POOL[i][0]==='amulet')MERCH_POOL.splice(i,1);
ITEM_DESC.ring='Schlichter Kupferring ohne Zauber';ITEM_DESC.amulet='Schlichte Bernsteinkette ohne Zauber';
{const a=addItem;addItem=function(id,n){jwEnsure(id);return a.apply(this,arguments);};}
{const a=spawnDrop;spawnDrop=function(id){jwEnsure(id);return a.apply(this,arguments);};}
