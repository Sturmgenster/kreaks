/* =========================================================
   MAGIE · Schriftrollen
   - Für jeden Zauber gibt es eine Schriftrolle. Lesen (Rechtsklick in der Hand)
     lernt den Zauber oder hebt ihn um eine Stufe (bis 10).
   - Nur wenige Händler haben überhaupt eine Schriftrolle im Angebot (1–2 pro Ort),
     meist gar keine. Jede Rolle gibt es nur einmal, erst nach ein paar Tagen
     wechselt das Angebot. Schriftrollen sind teuer.
   ========================================================= */
// Händler mit Schriftrollen: Ort, Schwerpunkt-Elemente, Chance auf eine Rolle
const SCROLL_SHOPS={
  Corvin:{ort:'Coda',el:['light','nature','water','neutral'],ch:.4},
  Wilma:{ort:'Coda (Markt)',el:['nature','neutral','water'],ch:.3},
  Murgla:{ort:'Froschdorf',el:['dark','blood','water','nature'],ch:.45},
  Glimmer:{ort:'Tiefgrund',el:['light','neutral','nature','fire'],ch:.4},
  Sefu:{ort:'Wüste',el:['fire','light','neutral'],ch:.4},
  Ole:{ort:'unterwegs',el:null,ch:.2}};
const SCROLL_DAYS=3;   // so viele Tage dauert es, bis ein Händler neue Ware hat
const SCROLL_BASE=1500,SCROLL_BIG=4800;  // Preise in Kupfer (300 = 1 Kreaker)
const strHash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;};

/* ---------- Gegenstände ---------- */
for(const id of SPELL_ORDER){const S=SPELLS[id];if(S.hidden)continue;
  ITEMS['sr_'+id]={name:'Schriftrolle: '+S.name,plural:'Schriftrollen: '+S.name,scroll:id};
  ITEM_DESC['sr_'+id]=`Rechtsklick: lesen. Lernt „${S.name}“ (${ELEM[S.el].n}) oder hebt den Zauber eine Stufe an.`;}
// Bild: Pergamentrolle mit Siegel in der Farbe des Elements
const SCROLL_CV={};
function drawScroll(el){if(SCROLL_CV[el])return SCROLL_CV[el];const p=new Px(14,14),PA=pal(['#8a6a3a','#c8a868','#e8d4a0','#f6ecc8']),E=pal(EPAL[el]);
  for(let y=3;y<11;y++)for(let x=2;x<12;x++)p.set(x,y,PA[shadeIdx(.75-(y-3)/16+((x*7+y*3)%5)/40,4,x,y)]);
  for(const x0 of[1,11])for(let y=2;y<12;y++){p.set(x0,y,PA[1]);p.set(x0+1,y,PA[y%3?2:1]);}
  for(let x=3;x<11;x++)if(x%2)p.set(x,5,PA[0]);for(let x=3;x<10;x++)if(x%2===0)p.set(x,7,PA[0]);
  for(let y=9;y<13;y++)for(let x=6;x<9;x++)if(Math.hypot(x-7,y-10.5)<1.8)p.set(x,y,E[y<10?2:1]);p.set(7,10,E[3]);p.set(6,13,E[1]);p.set(8,13,E[0]);
  outline(p);return SCROLL_CV[el]=p.done();}
{const a=part1Sprites;part1Sprites=function(list){a(list);for(const id of SPELL_ORDER){const S=SPELLS[id];if(!S.hidden)list.push(['sr_'+id,drawScroll(S.el)]);}};}

/* ---------- Lesen ---------- */
function readScroll(itemId){const id=ITEMS[itemId]&&ITEMS[itemId].scroll,S=SPELLS[id];if(!S)return;FLAGS.spells=FLAGS.spells||{};const lv=FLAGS.spells[id]||0;
  if(lv>=10){toast(`${S.name} ist schon auf Stufe 10.`);Snd.click();return;}
  removeItem(itemId,1);FLAGS.spells[id]=lv+1;renderInv();
  const E=ELEM[S.el];mburst(P.x,P.y+1.2,P.z,50,{cols:[E.c,E.c2,'#ffffff'],spd:3,up:1.5,life:1,s:.14,add:S.el!=='dark'});ringFx(P.x,groundAt(P.x,P.z,P.y+1),P.z,.4,36,{cols:[E.c,'#ffffff'],spd:6,up:1,life:.8,s:.14,add:true});
  Snd.levelUp();magSnd('chime');
  if(!lv){const bar=spellBar();if(!bar.includes(id)){const j=bar.indexOf(null);if(j>=0)bar[j]=id;}
    toast(`Neuer Zauber: ${S.name}!`+(spellBar().includes(id)?` Taste ${spellBar().indexOf(id)+1}`:' Leg ihn im Zaubermenü in die Leiste.'));}
  else toast(`${S.name} ist jetzt Stufe ${lv+1}.`);
  magHudSig='';magHud();try{saveGame();}catch(e){}}
{const a=rightClickUse;rightClickUse=function(){if(state==='playing'){const h=inv[HOT0+sel];if(h&&ITEMS[h.id]&&ITEMS[h.id].scroll){readScroll(h.id);return true;}}return a.apply(this,arguments);};}

/* ---------- Angebot der Händler ---------- */
function scrollOffer(name){const D=SCROLL_SHOPS[name];if(!D)return null;const per=Math.floor((FLAGS.day||0)/SCROLL_DAYS);FLAGS.scrollShop=FLAGS.scrollShop||{};let o=FLAGS.scrollShop[name];
  if(!o||o.p!==per){const r=mulberry32(((FLAGS.seed||1)*31+per*7919+strHash(name))|0);o={p:per,id:null,sold:false};
    if(r()<D.ch){const pool=SPELL_ORDER.filter(id=>!SPELLS[id].hidden&&(!D.el||D.el.includes(SPELLS[id].el)));let tot=0;const W=pool.map(id=>{const w=SPELLS[id].big?.3:1;tot+=w;return w;});
      let k=r()*tot,i=0;while(i<pool.length-1&&(k-=W[i])>0)i++;const S=SPELLS[pool[i]];o.id=S.id;o.price=Math.round((S.big?SCROLL_BIG:SCROLL_BASE)*(.85+r()*.35)/10)*10;}
    FLAGS.scrollShop[name]=o;}
  return o.id?o:null;}
const scrollPrice=o=>Math.round(o.price*(1+.2*((FLAGS.spells&&FLAGS.spells[o.id])||0))/10)*10;
{const a=shopItems;shopItems=function(){const L=a();if(!shop||shop.tab!=='buy')return L;const o=scrollOffer(shop.name);if(!o)return L;const S=SPELLS[o.id],lv=(FLAGS.spells&&FLAGS.spells[o.id])||0,pr=scrollPrice(o),iid='sr_'+o.id;
  const info=o.sold?'Verkauft – in ein paar Tagen gibt es neue Ware':lv>=10?'Du kannst den Zauber schon perfekt (Stufe 10)':lv?`${ELEM[S.el].n} · deine Stufe ${lv} → ${lv+1}`:`${ELEM[S.el].n} · neuer Zauber!`;
  L.unshift({kind:'buy',id:iid,price:pr,name:ITEMS[iid].name,icon:ITEMS[iid].icon,info,on:!o.sold&&lv<10&&wallet()>=pr,btn:o.sold?'Verkauft':'Kaufen',scroll:o,own:o.sold});return L;};}
{const a=shopClick;shopClick=function(i,all){const x=shop&&shop.list&&shop.list[i];if(!x||!x.scroll)return a(i,all);const o=x.scroll;
  if(o.sold){Snd.click();shopMsg('Die Schriftrolle ist schon verkauft. In ein paar Tagen hat der Händler vielleicht eine neue.',true);return;}
  if(((FLAGS.spells&&FLAGS.spells[o.id])||0)>=10){Snd.click();shopMsg('Diesen Zauber kannst du schon perfekt.',true);return;}
  const n0=countItem(x.id);a(i,all);if(countItem(x.id)>n0){o.sold=true;shopMsg(`${x.name} gekauft. Nimm sie in die Hand und lies sie mit Rechtsklick.`);renderShop();}};}
// Begrüßung: Hinweis, wenn eine Schriftrolle im Angebot ist
{const a=openShop;openShop=function(name){a.apply(this,arguments);try{const o=scrollOffer(name);if(o&&!o.sold&&shop){$('shopGreet').textContent=(shop.def.greet||'')+' Und heute habe ich etwas Seltenes: eine Schriftrolle.';}}catch(e){}};}
