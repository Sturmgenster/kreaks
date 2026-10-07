/* =========================================================
   V60 · Holzarten und Abbau: Jeder Baum, Strauch, Stein und jede Pflanze
   der Umgebung lässt sich abbauen. Alles wächst nach einer Weile nach.
   ========================================================= */
// ---------- Holzarten ----------
// id: [Name, Rinde dunkel, Rinde mittel, Rinde hell, Kern dunkel, Kern hell, Preis (Kupfer), Beschreibung]
const WOODS={
  w_oak:['Eichenholz','#2e1c0e','#5a3a1c','#7a5228','#b8904e','#e0c488',3,'Hart und schwer. Aus den Eichen rund um Coda'],
  w_pine:['Kiefernholz','#3a1c10','#6a3a22','#8a5232','#d8bc7a','#f2deaa',2,'Harzig und leicht. Brennt hell'],
  w_birch:['Birkenholz','#3a3a36','#d8d4c6','#f2efe4','#d8c890','#f6eed0',2,'Hell und glatt, mit schwarzen Narben in der Rinde'],
  w_dark:['Schwarztannenholz','#121a12','#22301e','#34402a','#a8885a','#d2b682',4,'Aus dem Tiefen Wald. Riecht nach Moos und Nebel'],
  w_dead:['Totholz','#3a3632','#5a554e','#7a746a','#988f80','#c4bcac',1,'Knochentrocken. Gutes Brennholz, sonst zu nichts zu gebrauchen'],
  w_red:['Mammutholz','#4a1a0e','#7a3218','#9a4a26','#c8784a','#f0aa78',5,'Rötlich und unglaublich zäh. Die Bäume sind älter als jede Chronik'],
  w_acacia:['Akazienholz','#3e3226','#5e4c38','#7a6448','#c07c3a','#e8b070',4,'Aus der Savanne. Hart wie Knochen und voller Dornen'],
  w_baobab:['Affenbrotholz','#5a4a40','#7a6656','#988270','#d6c49e','#f4ead0',3,'Weich und faserig. Ein Baobab speichert Wasser für die Trockenzeit'],
  w_palm:['Palmenholz','#5a4426','#7e6234','#a08048','#d0b880','#f0e2b4',2,'Faserig und biegsam. Fault nicht im Wasser'],
  w_maha:['Mahagoni','#3a1a10','#5a2a18','#7a3a22','#7a2418','#b04a32',7,'Tiefrotes Edelholz der Urwaldriesen. In der Kaiserstadt heiß begehrt'],
  w_cherry:['Kirschholz','#4a2420','#6e3a30','#8e5040','#c8805a','#eab48a',6,'Aus den Gärten der Kaiserstadt. Duftet noch nach Blüten'],
  w_maple:['Ahornholz','#4a4440','#6a625a','#8a8076','#d8c49a','#f8eed2',5,'Fein gemasert. Die Kaiserlichen bauen daraus Lauten'],
  w_ash:['Aschholz','#141010','#2a2020','#3a2a28','#7a1a12','#e0501e',9,'Aus der Unterwelt. Es glimmt, obwohl es nie gebrannt hat']};
const WOOD_IDS=Object.keys(WOODS);
for(const id of WOOD_IDS){const W=WOODS[id];ITEMS[id]={name:W[0],plural:W[0],wood:1,price:W[6]};ITEM_DESC[id]=W[7]+'. Zählt als Holz beim Handwerk';}
Object.assign(ITEMS,{bamboo:{name:'Bambusrohr',plural:'Bambusrohre',price:2},fiber:{name:'Pflanzenfaser',plural:'Pflanzenfasern',price:1},rope:{name:'Seil',plural:'Seile',price:4},
  berries:{name:'Waldbeeren',plural:'Waldbeeren',price:2},coconut:{name:'Kokosnuss',plural:'Kokosnüsse',price:3},cactusf:{name:'Kaktusfleisch',plural:'Kaktusfleisch',price:2},
  wheat:{name:'Weizen',plural:'Weizen',price:1},flower:{name:'Wildblume',plural:'Wildblumen',price:1},clay:{name:'Lehm',plural:'Lehm',price:2}});
Object.assign(ITEM_DESC,{wood:'Gewöhnliches Holz. Jede Holzart zählt beim Handwerk',bamboo:'Hohl, leicht und fest. Gut für Angeln',fiber:'Aus Gras, Farn, Schilf und Blättern. Drei davon ergeben ein Seil',
  rope:'Geflochten aus Pflanzenfasern',berries:'Süß und saftig. Essbar (Rechtsklick)',coconut:'Hart zu knacken, voller Milch. Essbar (Rechtsklick)',cactusf:'Bitter, aber es löscht den Durst. Essbar (Rechtsklick)',
  wheat:'Lutz zählt jede Ähre. Hagen kauft Weizen fürs Brot',flower:'Murgla braut daraus Tränke',clay:'Aus Termitenhügeln. Die Froschleute bauen damit ihre Hütten'});
ITEM_DESC.wood='Gewöhnliches Holz. Jede Holzart zählt beim Handwerk';
// Holz zählt als Gruppe: Rezepte und Aufgaben, die „Holz“ verlangen, nehmen jede Holzart
const isWood=id=>id==='wood'||!!WOODS[id];
{const c0=countItem;countItem=function(id){if(id!=='wood')return c0(id);let n=c0('wood');for(const w of WOOD_IDS)n+=c0(w);return n;};}
{const r0=removeItem;removeItem=function(id,n){if(id!=='wood')return r0(id,n);const order=['wood',...WOOD_IDS.slice().sort((a,b)=>WOODS[a][6]-WOODS[b][6])];
  for(const w of order){if(n<=0)break;const have=inv.reduce((a,s)=>a+(s&&s.id===w?s.n:0),0);const k=Math.min(have,n);if(k>0){r0(w,k);n-=k;}}
  if(n>0&&cursor&&isWood(cursor.id)){const k=Math.min(cursor.n,n);cursor.n-=k;n-=k;if(!cursor.n)cursor=null;try{renderCursor();}catch(e){}}renderInv();};}

// ---------- Bilder ----------
function drawWoodT(id){const W=WOODS[id],p=new Px(16,12),B=pal([W[1],W[2],W[3]]),C=pal([W[4],W[5]]),birch=id==='w_birch',palm=id==='w_palm',ash=id==='w_ash';
  for(let y=2;y<11;y++)for(let x=1;x<14;x++){let c=B[shadeIdx(.62-(y-6)/8,3,x,y)];if(birch&&hash2(x>>1,y,id.length*7)<.18)c=B[0];if(palm&&(x%3===0))c=B[0];p.set(x,y,c);}
  if(!birch&&!palm)for(let x=2;x<13;x+=3)p.set(x,4+(x%2),B[0]);
  for(let y=2;y<11;y++)for(let x=12;x<16;x++){const dx=(x-13.5)/2.4,dy=(y-6.5)/4.5;if(dx*dx+dy*dy<1){const ring=Math.round(Math.hypot(dx*2.4,dy*4.5))%2;p.set(x,y,ash&&ring?hex('#ff8a3a'):C[ring?0:1]);}}
  outline(p);return p.done();}
function drawBambooItem(){const p=new Px(16,16),G=pal(['#2e4a16','#4e7222','#6c9c34','#9ac458']);
  for(let i=0;i<13;i++){const x=2+i,y=13-i,node=i%4===0;p.set(x,y,G[node?0:2]);p.set(x+1,y,G[node?1:3]);p.set(x,y+1,G[1]);}
  for(let i=0;i<9;i++){const x=6+i,y=14-i,node=i%4===1;p.set(x,y,G[node?0:2]);p.set(x+1,y,G[node?1:3]);}outline(p);return p.done();}
function drawFiber(){const p=new Px(14,14),G=pal(['#4a5a22','#6a7a2c','#8a9a3a','#b0bc5a']);
  for(let k=0;k<7;k++){const x0=2+k,y0=12;for(let i=0;i<10;i++){const x=x0+Math.sin(i*.6+k)*1.2+i*.25,y=y0-i;p.set(x,y,G[(i+k)%4]);}}
  for(let x=2;x<12;x++)p.set(x,8,hex('#8a6a3a'));outline(p);return p.done();}
function drawRope(){const p=new Px(14,14),R=pal(['#6a4a22','#8e6a34','#b08a4a','#d0ac6a']);
  for(let a=0;a<6.283*2.2;a+=.12){const r=5-a*.25,x=7+Math.cos(a)*r,y=7+Math.sin(a)*r*.8;p.set(x,y,R[(Math.floor(a*4))%4]);}outline(p);return p.done();}
function drawBerries(){const p=new Px(12,12),B=pal(['#3a0a2a','#6a1a4a','#9a2a6a','#c85a9a']),L=pal(['#1d3b15','#396924','#6ba139']);
  fEll(p,6,3,3,1.6,L,{});for(const[x,y]of[[3,7],[6,6],[9,7],[4,9],[7,9],[6,10.5]])fEll(p,x,y,1.8,1.8,B,{});p.set(5,5,hex('#f0c8e0'));outline(p);return p.done();}
function drawCoconut(){const p=new Px(13,12),C=pal(['#2a1a0e','#4a2e18','#6a4426','#8a5c34']);fEll(p,6.5,6,5.6,5.2,C,{n:3,na:.3});
  for(const[x,y]of[[5,3],[7,3],[6,5]])p.set(x,y,hex('#1a0e06'));outline(p);return p.done();}
function drawCactusF(){const p=new Px(12,12),G=pal(['#1e4a22','#2e6a30','#4a8a3e','#7ab060']);fEll(p,6,6.5,4.5,4.5,G,{});
  for(let y=4;y<10;y++)for(let x=3;x<10;x++){const d=Math.hypot(x-6,y-6.5);if(d<2.6)p.set(x,y,hex(d<1.3?'#d8e8a0':'#b8d880'));}
  for(const[x,y]of[[2,4],[10,5],[3,10],[9,10],[6,1]])p.set(x,y,hex('#f0f0d0'));outline(p);return p.done();}
function drawWheatItem(){const p=new Px(14,14),W=pal(['#8a6420','#b48a30','#d8b048','#f0d070']);
  for(let k=0;k<3;k++){const ox=4+k*3;for(let y=6;y<14;y++)p.set(ox+(13-y)*.15,y,hex('#a88a40'));for(let i=0;i<5;i++){p.set(ox-1,1+i,W[(i+k)%4]);p.set(ox,i,W[(i+k+1)%4]);p.set(ox+1,1+i,W[(i+k+2)%4]);}}
  for(let x=3;x<12;x++)p.set(x,10,hex('#6a4a1a'));outline(p);return p.done();}
function drawFlowerItem(){const p=new Px(12,14),G=pal(['#2a5a1e','#3e7a2a','#5a9a3a']),C=[pal(['#a83a5a','#e2597f','#ff8ab0']),pal(['#3765ad','#4f8fe0','#7ab8ff']),pal(['#b98314','#e8b221','#ffd23f'])];
  for(let k=0;k<3;k++){const x0=3+k*3,top=3+((k*5)%4);for(let y=top;y<14;y++)p.set(x0+(y-top)*.1,y,G[1]);const P=C[k];for(const[dx,dy,i]of[[0,-1,2],[-1,0,1],[1,0,1],[0,1,0],[-1,-1,0],[1,-1,0]])p.set(x0+dx,top+dy,P[i]);p.set(x0,top,hex('#f6d743'));}
  outline(p);return p.done();}
function drawClay(){const p=new Px(13,11),C=pal(['#5a2e18','#7a4226','#9a5a36','#b8744a']);fPoly(p,[[1,10],[12,10],[11,4],[8,1],[4,2],[2,5]],C,{n:9,na:.35});outline(p);return p.done();}
function harvSprites(list){for(const id of WOOD_IDS)list.push([id,drawWoodT(id)]);list.push(['bamboo',drawBambooItem()]);list.push(['fiber',drawFiber()]);list.push(['rope',drawRope()]);
  list.push(['berries',drawBerries()]);list.push(['coconut',drawCoconut()]);list.push(['cactusf',drawCactusF()]);list.push(['wheat',drawWheatItem()]);list.push(['flower',drawFlowerItem()]);list.push(['clay',drawClay()]);}
{const ws0=wildSprites;wildSprites=function(l){ws0(l);harvSprites(l);};}

// ---------- Was sich abbauen lässt ----------
// t: tree (Axt), rock (Spitzhacke), soft (Hand reicht), hp, d: Beute [id,min,max,Chance], st: Stumpf, re: Nachwachsen (Spielminuten)
const T_=(wood,hp,n0,n1,ex)=>Object.assign({t:'tree',hp,d:[[wood,n0,n1,1],['stick',1,2,.6]],st:'stump0',re:2880},ex||{});
const HV={
  oak:T_('w_oak',48,2,4),pine:T_('w_pine',48,2,4,{d:[['w_pine',2,4,1],['stick',1,2,.6],['cone',1,1,.4]]}),birch:T_('w_birch',40,2,3),dpine:T_('w_dark',60,3,5),dead:T_('w_dead',30,1,3),
  redwood:T_('w_red',220,7,10,{st:'rwstump',big:1}),deadr:T_('w_ash',120,3,5,{st:'rwstump',big:1}),
  acacia:T_('w_acacia',70,3,5),baobab:T_('w_baobab',160,6,9,{big:1,d:[['w_baobab',6,9,1],['fiber',2,4,.7]]}),
  palm:T_('w_palm',45,2,4,{st:null,d:[['w_palm',2,4,1],['coconut',1,2,.75]]}),jpalm:T_('w_palm',45,2,4,{st:null,d:[['w_palm',2,4,1],['coconut',1,2,.6],['fiber',1,2,.5]]}),
  jtree:T_('w_maha',260,8,12,{st:'rwstump',big:1,d:[['w_maha',8,12,1],['fiber',2,4,.8]]}),
  sakura:T_('w_cherry',60,3,5),maple:T_('w_maple',60,3,5),kpine:T_('w_pine',55,3,5),
  bamboo:{t:'tree',hp:20,d:[['bamboo',2,4,1]],st:null,re:1440},
  cactus:{t:'soft',hp:24,d:[['cactusf',1,3,1]],st:null,re:2880,spiky:1},bcactus:{t:'soft',hp:6,d:[['cactusf',1,1,1]],st:null,re:1440,spiky:1},
  stump:{t:'tree',hp:30,d:[['w_oak',1,2,1],['stick',0,1,.5]],st:null,re:4320},
  bush:{t:'soft',hp:24,d:[['stick',1,2,1],['fiber',1,2,.6]],re:1440},bush1:{t:'soft',hp:24,d:[['berries',2,4,1],['stick',1,1,.6]],re:1440},
  jbush:{t:'soft',hp:30,d:[['stick',1,2,1],['fiber',1,3,.8]],re:1440},dshrub:{t:'soft',hp:8,d:[['stick',1,2,1],['w_dead',1,1,.35]],re:1440},
  fern:{t:'soft',hp:3,d:[['fiber',1,2,1]],re:720},jleaf:{t:'soft',hp:3,d:[['fiber',1,2,1]],re:720},liana:{t:'soft',hp:5,d:[['fiber',2,3,1],['rope',1,1,.15]],re:1440},
  grass:{t:'soft',hp:1,d:[['fiber',1,1,.5]],re:720,small:1},tall:{t:'soft',hp:1,d:[['fiber',1,1,.5]],re:720,small:1},sgrass:{t:'soft',hp:1,d:[['fiber',1,1,.5]],re:720,small:1},
  rice:{t:'soft',hp:1,d:[['fiber',1,1,.4],['wheat',1,1,.3]],re:720,small:1},reed:{t:'soft',hp:2,d:[['fiber',1,2,1]],re:720},
  flower:{t:'soft',hp:1,d:[['flower',1,1,1]],re:720,small:1},wheat:{t:'soft',hp:1,d:[['wheat',1,2,1]],re:1440,small:1,farm:1},mushroom:{t:'soft',hp:1,d:[['mushroom',1,1,1]],re:1440,small:1},
  hay:{t:'soft',hp:4,d:[['fiber',3,5,1]],re:2880,farm:1},
  rock:{t:'rock',hp:40,d:[['stone',1,2,1]],re:4320},rock1:{t:'rock',hp:55,d:[['stone',2,3,1]],re:4320},srock:{t:'rock',hp:40,d:[['stone',1,2,1]],re:4320},srock0:{t:'rock',hp:70,d:[['stone',2,4,1]],re:4320},
  lrock:{t:'rock',hp:60,d:[['stone',2,3,1],['coal',1,1,.35]],re:4320},termite:{t:'rock',hp:50,d:[['clay',2,4,1],['chitin',1,1,.2]],re:2880},
  bones:{t:'soft',hp:3,d:[['bones',1,2,1]],re:2880},skulltotem:{t:'soft',hp:12,d:[['bones',2,3,1]],re:2880},skullpile:{t:'soft',hp:6,d:[['bones',2,4,1]],re:2880},spikes:{t:'soft',hp:10,d:[['bones',2,3,1]],re:2880},
  potb:{t:'soft',hp:1,d:[['copper',2,7,.7],['silver',1,1,.15],['linen',1,1,.15]],re:4320,pot:1},web:{t:'soft',hp:1,d:[['silk',1,1,1]],re:1440}};
// Diese Bilder sind keine Umgebung (Quest-Steine, Bauwerke, Kreaturen …)
const HV_SKIP=new Set(['bstone','grave','dstat','kbanner','brazier','campfire','candle','lantern','toro','obelisk','chest','workbench','anvil','pot','cmush','banana_t','bananapile','statue_vg','statue_ml','statue_shk']);
const HV_NAMES={tree:'Baum',rock:'Fels',soft:'Pflanze'};
const HG=new Map(),HK=new Map(),HGONE=new Set();
const hvCell=(x,z)=>(Math.floor(x/8)+8000)*20000+(Math.floor(z/8)+8000);
function hvSpec(spr){if(!spr)return null;if(HV[spr])return HV[spr];const b=spr.replace(/\d+$/,'');if(HV_SKIP.has(b))return null;return HV[b]||null;}
function hvKey(b){return b.spr.replace(/\d+$/,'')+'@'+Math.round(b.x*10)+','+Math.round(b.z*10);}
function harvReg(b){if(b._hv!==undefined)return;b._hv=null;if(!(b.w>.05)||!(b.h>.05)||b.y<-500)return;const S=hvSpec(b.spr);if(!S)return;
  if(TREE_RE.test(b.spr)&&TREEOBJ.has(treeKey(b.x,b.z)))return;// alte Bäume: eigenes Fällen
  b._hv=S;b._hk=hvKey(b);b._o={spr:b.spr,w:b.w,h:b.h,y:b.y,sway:b.sway||0};const c=hvCell(b.x,b.z);let l=HG.get(c);if(!l)HG.set(c,l=[]);l.push(b);HK.set(b._hk,b);
  const F=FLAGS.harv;if(F&&F[b._hk]!=null&&gameMinutes()-F[b._hk]<S.re)hvGone(b,false);}
{const mb0=makeBillboards;makeBillboards=function(list,mat){for(const b of list)if(b&&b.spr&&b._hv===undefined)harvReg(b);const m=mb0(list,mat);return m;};}
function hvProps(b){if(b._props)return b._props;const out=[];for(const t of tgridNear(b.x,b.z))if(t.type==='prop'&&t.frog&&Math.abs(t.x-b.x)<.05&&Math.abs(t.z-b.z)<.05)out.push(t);b._props=out;return out;}
function hvGone(b,sync){const S=b._hv;HGONE.add(b);b._gone=true;for(const t of hvProps(b)){if(t._r0==null)t._r0=t.r;t.r=0;}
  if(S.st){const s=SPR[S.st],h=S.big?2.6:1.05;b.spr=S.st;b.h=h;b.w=h*s.w/s.h;b.sway=0;b.y=b._o.y+(S.big?0:.15);}else{b.w=0;b.h=0;}
  // Lianen fallen mit dem Urwaldriesen
  if(b._o.spr.startsWith('jtree')){for(const l of hvNear(b.x,b.z,10))if(!l._gone&&l._o&&l._o.spr.startsWith('liana')){hvGone(l,sync);FLAGS.harv=FLAGS.harv||{};FLAGS.harv[l._hk]=FLAGS.harv[b._hk]||gameMinutes();}}
  if(sync!==false)syncDeco(b);}
function hvBack(b){const o=b._o;b.spr=o.spr;b.w=o.w;b.h=o.h;b.y=o.y;b.sway=o.sway;b._gone=false;b.hp=null;HGONE.delete(b);for(const t of b._props||[])if(t._r0!=null)t.r=t._r0;syncDeco(b);}
function*hvNear(x,z,r){const c0=Math.floor((x-r)/8),c1=Math.floor((x+r)/8),d0=Math.floor((z-r)/8),d1=Math.floor((z+r)/8);
  for(let a=c0;a<=c1;a++)for(let b=d0;b<=d1;b++){const l=HG.get((a+8000)*20000+(b+8000));if(l)yield*l;}}
// Was hat der Spieler im Blick?
function hvTarget(range){const ex=P.x,ey=P.y+P.eye,ez=P.z,L=lookDir(),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);let best=null,bs=1e9;
  for(const b of hvNear(P.x,P.z,range+4)){if(b._gone||!b._hv||!b._m||!b._m.parent)continue;const S=b._hv,dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);
    if(S.t==='tree'||S.t==='rock'&&b.w>1.2){const r=Math.max(.35,Math.min(b.w*.22,2.2));if(d-r>range+.5)continue;const al=dx*fx+dz*fz,lat=Math.abs(dx*fz-dz*fx);if(al<-.2||lat>r+.6)continue;
      if(Math.abs(P.y-b.y)>4&&S.t!=='tree')continue;const sc=al+lat*.6;if(sc<bs){bs=sc;best=b;}continue;}
    const cy=b.y+b.h*.45,vx=b.x-ex,vy=cy-ey,vz=b.z-ez,D=Math.hypot(vx,vy,vz);if(D>range+1.4+b.w*.3)continue;const cos=(vx*L.x+vy*L.y+vz*L.z)/Math.max(D,.01),need=S.small?.95:.9-Math.min(.12,b.w*.04);
    if(cos<need)continue;const sc=D*(2-cos)+(S.small?.6:0);if(sc<bs){bs=sc;best=b;}}
  return best;}
function hvRoll(S,b){const out=[];for(const[id,a,c,p]of S.d){if(Math.random()>p)continue;let n=a+Math.floor(Math.random()*(c-a+1));if(n>0)out.push([id,n]);}
  // Totholz-Bäume in der Wüste, Kiefern im Osten …: Holz passend zum Ort
  return out;}
function harvHit(W,strict){const R=Math.max(2.4,(W&&W.range||2)+.6),b=hvTarget(R);if(!b)return false;if(strict&&b._hv.t==='tree')return false;
  const S=b._hv;let pow=S.t==='tree'?gatherPower('wood'):S.t==='rock'?gatherPower('stone'):Math.max(18,gatherPower('wood'));
  if(S.t==='rock'&&!pow){Snd.clink(.5);toast('Dafür brauchst du eine Spitzhacke');return true;}
  if(S.spiky&&!heldItem()){takeDamage(2);toast('Autsch! Stacheln!');}
  if(b.hp==null)b.hp=S.hp;b.hp-=pow;P.lastAction=time;
  const gy=b.y,hx=b.x-Math.sin(P.yaw)*-.0,hz=b.z;const col=S.t==='rock'?(b._o.spr.startsWith('termite')?0x9a5a36:0x8a8e94):S.t==='tree'?(b._o.spr.startsWith('bamboo')||b._o.spr.startsWith('cactus')?0x6a9c34:0x9a6a36):0x5a8a3a;
  const n=S.t==='soft'?4:7;for(let i=0;i<n;i++)spawnParticle(hx+(Math.random()-.5)*.6,gy+Math.min(b.h*.4,1.6)+Math.random()*.4,hz+(Math.random()-.5)*.6,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,col,.6,.2);
  if(S.t==='rock'){Snd.clink(1);wearTool();}else if(S.t==='tree'){Snd.chop();wearTool();}else if(S.pot){Snd.crack();}else{try{Snd.step(false);}catch(e){}}
  if(b._m){const g=b._m.geometry.attributes;if(g.tint&&b._i<g.tint.count){const i=b._i,t0=g.tint.array[i];g.tint.array[i]=1.4;g.tint.needsUpdate=true;setTimeout(()=>{if(b._m){g.tint.array[i]=t0;g.tint.needsUpdate=true;}},120);}}
  if(b.hp>0)return true;
  // abgebaut
  FLAGS.harv=FLAGS.harv||{};FLAGS.harv[b._hk]=gameMinutes();
  for(const[id,k]of hvRoll(S,b))if(ITEMS[id])spawnDrop(id,k,b.x,gy+.3,b.z);
  if(S.t==='tree'){gainXP(S.big?5:2.5);if(S.big){try{fallingLog(b.x,b.y+2,b.z,{h:b._o.h});Snd.crash();}catch(e){Snd.treeFall();}}else if(b._o.h>3)Snd.treeFall();
    for(let i=0;i<20;i++)spawnParticle(b.x+(Math.random()-.5)*1.5,gy+.5+Math.random()*3,b.z+(Math.random()-.5)*1.5,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,Math.random()<.6?0x7a5228:0x2e5a2a,1.2,.3);}
  else if(S.t==='rock'){gainXP(2);Snd.crack();for(let i=0;i<16;i++)spawnParticle(b.x,gy+.5,b.z,(Math.random()-.5)*5,Math.random()*4,(Math.random()-.5)*5,col,1,.3);}
  else if(S.pot)gainXP(.5);
  if(S.farm&&!FLAGS.farmWarn&&Math.abs(b.x)<200&&b.z>600){FLAGS.farmWarn=1;setTimeout(()=>toast('Lutz wird das nicht gefallen …'),400);}
  hvGone(b);return true;}
{const g0=gatherHit;gatherHit=function(W){if(P.x<60000&&harvHit(W,true))return true;if(g0(W))return true;return P.x<60000||P.x>CAVE_X0-400?harvHit(W,false):false;};}
// Nachwachsen
function hvApplyAll(){const F=FLAGS.harv||{},now=gameMinutes();for(const b of [...HGONE]){const t=F[b._hk];if(t==null||now-t>=b._hv.re)hvBack(b);}
  for(const k in F){const b=HK.get(k);if(!b){continue;}if(now-F[k]>=b._hv.re){delete F[k];continue;}if(!b._gone)hvGone(b);}}
let hvT=0;
function updateHarvest(dt){hvT-=dt;if(hvT>0)return;hvT=8;const F=FLAGS.harv;if(!F)return;const now=gameMinutes();
  for(const b of [...HGONE]){const t=F[b._hk];if(t==null||now-t>=b._hv.re){if(Math.hypot(b.x-P.x,b.z-P.z)>22||P.x>60000){delete F[b._hk];hvBack(b);}}}
  // alte Einträge verwerfen, deren Objekte gerade nicht geladen sind
  if(Math.random()<.1)for(const k in F){const b=HK.get(k);if(!b&&now-F[k]>4320)delete F[k];}}
{const u0=updateAnimals;updateAnimals=function(dt){u0(dt);if(state==='playing')try{updateHarvest(dt);}catch(e){if(!updateHarvest.err){updateHarvest.err=1;console.error(e);}}};}
{const sg0=startGame;startGame=function(isNew,char){sg0(isNew,char);try{if(isNew)FLAGS.harv={};hvApplyAll();}catch(e){console.error(e);}};}
// Alte Spielstände: „Holz“ wird zu Eichenholz
{const lg0=loadGame;loadGame=function(){const ok=lg0();if(ok)inv.forEach(s=>{if(s&&s.id==='wood')s.id='w_oak';});return ok;};}
// Bäume der alten Gebiete geben ihre eigene Holzart
const OLD_WOOD={oak:'w_oak',pine:'w_pine',birch:'w_birch',dpine:'w_dark',dead:'w_dead',redwood:'w_red'};
{const sd0=spawnDrop;spawnDrop=function(id,n,x,y,z){if(id==='wood'&&spawnDrop.wt){id=spawnDrop.wt;}return sd0(id,n,x,y,z);};}
{const f0=fellTree;fellTree=function(t,loot){spawnDrop.wt=OLD_WOOD[t.type]||'w_oak';try{f0(t,loot);}finally{spawnDrop.wt=null;}};}
// Essen: Beeren, Kokosnuss, Kaktus, Brot, Met
const FOOD={berries:[6,12,'Süße Beeren!'],coconut:[10,25,'Kokosmilch, herrlich!'],cactusf:[4,30,'Bitter … aber erfrischend.'],bread:[15,20,'Frisches Brot!'],mead:[5,35,'Ein guter Schluck Met!'],meat:[3,5,'Rohes Fleisch … naja.']};
{const r0=rightClickUse;rightClickUse=function(){if(r0())return true;if(state!=='playing')return false;const h=inv[HOT0+sel];if(!h||!FOOD[h.id])return false;const[hp,st,msg]=FOOD[h.id],S=P.stats;
  if(S.hp>=S.maxHp&&S.st>=(S.maxSt||100)){toast('Du bist satt.');return true;}removeItem(h.id,1);S.hp=Math.min(S.maxHp,S.hp+hp);S.st=Math.min(S.maxSt||100,S.st+st);try{Snd.munch();}catch(e){}toast(msg);renderStats();renderInv();return true;};}
for(const k of['berries','coconut','cactusf','bread','mead'])if(ITEM_DESC[k]&&!/Essbar|Rechtsklick/.test(ITEM_DESC[k]))ITEM_DESC[k]+='. Essbar (Rechtsklick)';
// Neue Rezepte
RECIPES.push({id:'rope',need:{fiber:3}},{id:'rod',need:{bamboo:2,rope:1}},{id:'coal',n:2,need:{wood:3},st:'furnace'});
