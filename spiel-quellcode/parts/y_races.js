/* =========================================================
   Neue spielbare Völker: Möhrlinge, Wipfler, Samtpfoten, Grabler
   Leben + Ausdauer + Mana ergeben bei jedem Volk genau 300.
   ========================================================= */
Object.assign(RACES,{
  carrot:{name:'Möhrling',plural:'Möhrlinge',fem:'Möhrlingin',size:.75,hp:90,st:80,mp:130,speed:.95,
    desc:'Kleine Wurzelleute mit grünem Kraut auf dem Kopf. Sie tanken Kraft aus der Sonne, sind aber knackig und zerbrechlich.',
    traits:{sunRegen:1,dmgTaken:1.2,nightMul:.9,
      text:['Sonnenkraft: Bei Tageslicht unter freiem Himmel heilen Leben und Mana von selbst (+1 pro Sekunde)','Knackig: erleidet 20% mehr Schaden','Nachts 10% langsamer']}},
  ape:{name:'Wipfler',plural:'Wipfler',fem:'Wipflerin',size:1.1,hp:120,st:150,mp:30,speed:1.05,
    desc:'Kräftiges Affenvolk aus den Baumkronen. Springen hoch und laufen lange, doch Magie liegt ihnen nicht – und Wasser mögen sie gar nicht.',
    traits:{leap:1.5,sprintCost:.6,waterMul:.65,
      text:['Affensprung: springt 50% höher','Zäh: Sprinten kostet 40% weniger Ausdauer','Wasserscheu: im Wasser 35% langsamer','Kaum magisch (nur 30 Mana)']}},
  cat:{name:'Samtpfote',plural:'Samtpfoten',fem:'Samtpfote',size:.9,hp:85,st:125,mp:90,speed:1.15,
    desc:'Flinke Katzenleute mit leisen Pfoten und scharfen Augen. Schnell und gewandt, aber nicht besonders robust – und Wasser hassen sie.',
    traits:{nightVis:1,freeJump:1,waterMul:.5,
      text:['Nachtsicht: sieht nachts und in Höhlen deutlich besser','Federleicht: Springen kostet keine Ausdauer','Wasserscheu: im Wasser 50% langsamer']}},
  mole:{name:'Grabler',plural:'Grabler',fem:'Grablerin',size:.8,hp:140,st:130,mp:30,speed:.9,
    desc:'Stämmige Maulwurfsleute mit riesigen Grabklauen. Unter der Erde zu Hause, robust und ausdauernd – im Sonnenlicht aber träge.',
    traits:{dig:2,nightVis:1,dayMul:.85,
      text:['Grabklauen: baut Steine und Erze doppelt so schnell ab','Nachtsicht: sieht nachts und in Höhlen deutlich besser','Lichtscheu: bei Tageslicht 15% langsamer','Kaum magisch (nur 30 Mana)']}}});
Object.assign(RACE_N,{carrot:'Möhrling',ape:'Wipfler',cat:'Samtpfote',mole:'Grabler'});

// Aussehen: Kopfhöhe, Kopfbreite, Rumpfhöhe, Beinlänge, Rumpfbreite, Armbreite
Object.assign(PROP,{carrot:[13,9,12,9,11,2],ape:[11,11,14,11,15,5],cat:[10,10,13,14,11,3],mole:[10,11,12,8,15,4]});
Object.assign(SKINPAL,{
  carrot:[['Orange',pal(['#7a3208','#b5520e','#e07818','#f6a040'])],['Gelbe Rübe',pal(['#7a5a08','#b58a10','#e0b420','#f6d860'])],['Urmöhre',pal(['#3a1438','#5e2258','#863a7c','#b062a4'])],['Weiß',pal(['#8a7a60','#b8a888','#dccfb0','#f4ecd8'])]],
  ape:[['Braun',pal(['#3a2414','#5a3a20','#7a5230','#9a6c44'])],['Schwarz',pal(['#141214','#26222a','#3a3440','#544c58'])],['Rotbraun',pal(['#5a200c','#8a3414','#b4501e','#d8763a'])],['Silbergrau',pal(['#3a3c40','#5a5e64','#7e848a','#a6acb2'])]],
  cat:[['Rot',pal(['#7a3a10','#b4601c','#e0882c','#f6b060'])],['Grau',pal(['#3e4046','#5e6068','#82868e','#a8acb4'])],['Schwarz',pal(['#121216','#22222a','#34343e','#4a4a56'])],['Weiß',pal(['#9a968e','#c4c0b8','#e2ded6','#f8f6f0'])],['Creme',pal(['#8a6a40','#b8925c','#dab884','#f2d8a8'])]],
  mole:[['Samtschwarz',pal(['#141218','#24202a','#36303e','#4c4456'])],['Graubraun',pal(['#2e2622','#463a32','#5e4e44','#786658'])],['Goldbraun',pal(['#4a3418','#6e4e26','#926a36','#b48a4c'])]]});
Object.assign(CLOTHSET,{
  carrot:f=>['tunic','rags','vest','loin','none',...(f?['dress']:[])],
  ape:()=>['none','vest','loin','rags','tunic','leather'],
  cat:f=>['tunic','leather','vest','robe','none',...(f?['dress']:[])],
  mole:()=>['rags','leather','vest','tunic','chain','none']});
for(const r of['carrot','ape','cat','mole']){CUSTOMFACE[r]=1;NOEARS[r]=1;}
BAREFOOT.ape=BAREFOOT.cat=BAREFOOT.mole=BAREFOOT.carrot=1;

// Optionen im Charakter-Editor
const RACE_X={
  carrot:{skin:'Sorte',opts:[['leaves','Kraut',[['short','Kurz'],['bushy','Buschig'],['long','Lang']]]]},
  ape:{skin:'Fell',opts:[['face','Gesicht',[['light','Hell'],['dark','Dunkel']]]]},
  cat:{skin:'Fell',opts:[['pattern','Muster',[['none','Einfarbig'],['stripes','Getigert']]],['eyes','Augen',[['gold','Gold'],['green','Grün'],['blue','Blau']]]]},
  mole:{skin:'Fell',opts:[]}};
{const a=charOptions;charOptions=function(c){const X=RACE_X[c.race];if(!X)return a(c);const L=[],O=(key,label,vals)=>L.push({key,label,vals});
  O('skin',X.skin,SKINPAL[c.race].map((s,i)=>[i,s[0]]));
  for(const o of X.opts)O(o[0],o[1],o[2]);
  O('cloth','Kleidung',CLOTHSET[c.race](c.sex==='f').map(k=>[k,CLOTHES[k]]));
  if(!['none','loin'].includes(c.cloth))O('clothColor','Farbe',COLORS);
  if(['tunic','leather','chain','rags','vest'].includes(c.cloth))O('pants','Hose',COLORS);
  return L;};}

// Werte & Fähigkeiten
{const a=charStats;charStats=function(c){const s=a(c),r=RACES[c.race]||{},t=r.traits;if(!t)return s;const kid=c.age==='kid';
  Object.assign(s,{leap:t.leap?1+(t.leap-1)*(kid?.5:1):1,sunRegen:t.sunRegen||0,nightVis:!!t.nightVis,dig:t.dig||1,waterMul:t.waterMul||1,dayMul:t.dayMul||1,nightMul:t.nightMul||1,
    sprintCost:t.sprintCost||1,freeJump:!!t.freeJump,baseSpeed:s.speed});
  if(t.dmgTaken)s.dmg*=t.dmgTaken;return s;};}

{const a=updatePlayer;updatePlayer=function(dt){const M=P.mods;if(!M||!M.baseSpeed)return a(dt);
  const outside=P.x<60000,wet=P.y<WATER-.2&&nearWater(P.x,P.z),day=outside&&DN.day>.5;
  M.speed=M.baseSpeed*(wet?M.waterMul:1)*(outside?(day?M.dayMul:M.nightMul):1);
  const g0=P.ground;a(dt);
  if(g0&&!P.ground&&!P.riding&&P.vy>3.5){if(M.leap>1)P.vy*=Math.sqrt(M.leap);if(M.freeJump)P.stats.st=Math.min(P.stats.maxSt,P.stats.st+5);}
  if(M.sprintCost<1&&P.sprinting&&P.ground&&!P.riding)P.stats.st=Math.min(P.stats.maxSt,P.stats.st+10*dt*(1-M.sprintCost));
  if(M.sunRegen&&day&&state==='playing'&&!cheatOn()){const S=P.stats;S.hp=Math.min(S.maxHp,S.hp+M.sunRegen*dt);if(S.maxMp)S.mp=Math.min(S.maxMp,S.mp+M.sunRegen*dt);}};}

// Nachtsicht: sanftes Licht um den Spieler, wenn es dunkel ist
{const a=playerLightSrc;playerLightSrc=function(){const r=a();if(r)return r;const M=P.mods;if(!M||!M.nightVis)return null;
  const inCave=caveCur&&P.x>CAVE_X0-400,night=P.x<60000&&DN.day<.45;
  return(inCave||night)?{x:P.x,y:P.y+1.8,z:P.z,col:0xa8b8dc,dist:18,I:.8}:null;};}

// Grabklauen auch an Felsen über der Erde
{const a=gatherPower;gatherPower=function(kind){const v=a(kind);return kind==='stone'&&v&&P.mods&&P.mods.dig>1?v*P.mods.dig:v;};}

// Editor: Frauen-Namen und Fähigkeiten anzeigen
{const a=renderCreator;renderCreator=function(){a();const r=RACES[cc.race];if(!r||!r.traits)return;
  if(cc.sex==='f'&&r.fem)$('ccRaceName').textContent=r.fem+' · '+AGES[cc.age];
  const st=$('ccStats');let ul=st.querySelector('.cctraits');if(!ul){ul=document.createElement('ul');ul.className='cctraits';st.appendChild(ul);}
  ul.insertAdjacentHTML('afterbegin',r.traits.text.map(t=>`<li>${t}</li>`).join(''));};}

/* ---------- Zeichnungen ---------- */
const sameCol=(d,i,col)=>d[i+3]&&d[i]===col[0]&&d[i+1]===col[1]&&d[i+2]===col[2];
const isSkin=(p,x,y,sk)=>{if(x<0||y<0||x>=p.w||y>=p.h)return false;const i=(y*p.w+x)*4;return sk.some(c=>sameCol(p.d,i,c));};
const mixCol=(a,b,t)=>[Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];

RACE_DRAW.carrot=({p,c,cx,ht,hb,hx0,hx1,ey,sk,back,kid,EYE,WH})=>{
  const LEAF=pal(['#1e4a14','#2e6a1c','#46902a','#68b43c']),st=c.leaves||'short',h=(st==='long'?8:st==='bushy'?6:4)-(kid?2:0);
  // Rübenform: nach unten spitz zulaufen
  const clr=(x,y)=>{if(x<0||y<0||x>=p.w||y>=p.h)return;p.d[(y*p.w+x)*4+3]=0;};
  [[hb,3],[hb-1,2],[hb-2,1]].forEach(([y,k])=>{for(let i=0;i<k;i++){clr(hx0+i,y);clr(hx1-i,y);}});
  p.set(cx,hb+1,sk[1]);
  // Rillen
  for(const y of[ht+3,hb-2])for(let x=hx0+1;x<=hx1-1;x++)if((x+y)%3===0&&isSkin(p,x,y,sk))p.set(x,y,sk[0]);
  // Kraut
  const n=st==='bushy'?5:3;
  for(let k=0;k<n;k++){const off=(k-(n-1)/2)*(st==='bushy'?1.6:2),len=h-(Math.abs(k-(n-1)/2)>1?2:0);
    for(let t=0;t<len;t++){const x=cx+off+off*t*.18,y=ht-1-t;p.set(x,y,LEAF[t<1?0:t<len-2?2:3]);if(st!=='short'&&t>1&&t%2===0)p.set(x+(off<0?-1:1),y,LEAF[1]);}}
  if(back)return;
  p.set(cx-2,ey,EYE);p.set(cx+2,ey,EYE);p.set(cx-2,ey-1,WH);p.set(cx+2,ey-1,WH);
  const MO=hex('#6a2a08');p.set(cx-1,ey+3,MO);p.set(cx,ey+3,MO);p.set(cx+1,ey+3,MO);p.set(cx-2,ey+2,MO);p.set(cx+2,ey+2,MO);
  p.set(cx-3,ey+2,hex('#e8706a'));p.set(cx+3,ey+2,hex('#e8706a'));};

RACE_DRAW.ape=({p,c,cx,ht,hb,hx0,hx1,ey,sk,back,EYE,WH})=>{
  const dark=c.face==='dark',muz=dark?mixCol(sk[0],[40,32,36],.5):mixCol(sk[3],[214,176,140],.6),muz2=dark?mixCol(sk[0],[20,16,18],.5):mixCol(sk[2],[190,150,116],.5);
  // runde Ohren
  for(const s of[-1,1]){const x0=s<0?hx0-1:hx1+1;for(let y=ey-1;y<=ey+1;y++){p.set(x0,y,sk[1]);p.set(x0+s,y,y===ey?muz:sk[1]);}}
  // Fellbüschel
  p.set(cx,ht-1,sk[2]);p.set(cx-1,ht-1,sk[1]);p.set(cx+1,ht-2,sk[2]);
  if(back)return;
  // Gesicht und Schnauze
  for(let y=ey-1;y<=hb-1;y++)for(let x=hx0+1;x<=hx1-1;x++){if(y===ey-1&&(x<cx-3||x>cx+3))continue;p.set(x,y,y>=ey+2?muz2:muz);}
  for(let x=hx0+1;x<=hx1-1;x++)p.set(x,ey-2,sk[0]);
  p.set(cx-2,ey,EYE);p.set(cx+2,ey,EYE);p.set(cx-3,ey,WH);p.set(cx+3,ey,WH);
  p.set(cx-1,ey+2,sk[0]);p.set(cx+1,ey+2,sk[0]);for(let x=cx-2;x<=cx+2;x++)p.set(x,ey+4,hex('#2a1810'));};

RACE_DRAW.cat=({p,c,cx,ht,hb,hx0,hx1,ey,tx1,waist,sk,back,frame,EYE,WH,eyeCol})=>{
  const PINK=hex('#e8909a');
  // Spitze Ohren
  for(const s of[-1,1]){const b=s<0?hx0:hx1;for(let k=0;k<4;k++){for(let w=0;w<=3-k;w++)p.set(b-s*w+s*0,ht-1-k,sk[k<2?1:2]);}p.set(b-s,ht-1,PINK);p.set(b-s,ht-2,PINK);}
  // Schwanz
  const sw=frame===1?-1:frame===2?1:0;
  for(let k=0;k<16;k++){const t=k/15,x=(back?cx+2:tx1)+1+t*5+Math.sin(t*3)*1.5,y=waist+3-t*13+t*t*3+sw*t;p.set(x,y,sk[t>.85?3:1]);p.set(x+1,y,sk[2]);}
  // Tigermuster
  if(c.pattern==='stripes'){for(let y=0;y<p.h;y++)for(let x=0;x<p.w;x++)if((y%3===0||(y>ht&&y<ht+3&&Math.abs(x-cx)<=1&&x!==cx))&&isSkin(p,x,y,[sk[1],sk[2],sk[3]]))p.set(x,y,sk[0]);}
  if(back)return;
  // Gesicht
  for(let y=ey+1;y<=ey+3;y++)for(let x=cx-2;x<=cx+2;x++)p.set(x,y,sk[3]);
  for(const x0 of[cx-3,cx+2]){p.set(x0,ey,eyeCol);p.set(x0+1,ey,eyeCol);p.set(x0,ey-1,eyeCol);p.set(x0+1,ey-1,eyeCol);p.set(x0===cx-3?x0+1:x0,ey,EYE);p.set(x0===cx-3?x0+1:x0,ey-1,EYE);}
  p.set(cx,ey+2,PINK);p.set(cx-1,ey+3,EYE);p.set(cx+1,ey+3,EYE);
  const WK=hex('#e8e6dc');for(const s of[-1,1])for(const dy of[2,3]){const x0=s<0?hx0:hx1;p.set(x0+s,ey+dy,WK);p.set(x0+2*s,ey+dy+(dy===3?1:0),WK);}};

RACE_DRAW.mole=({p,cx,ht,hb,hx0,hx1,ey,tx0,tx1,aw,waist,sk,back,EYE})=>{
  const PK=pal(['#a04a5a','#d06a7a','#f094a4']),CLAW=hex('#f2e6d2');
  // Samtfell
  for(let y=ht;y<=hb;y++)for(let x=hx0;x<=hx1;x++)if(hash2(x,y,19)<.18&&isSkin(p,x,y,sk))p.set(x,y,sk[3]);
  // Grabklauen: Hände rosa, Krallen hell
  for(const[x0,x1]of[[tx0-aw-1,tx0-1],[tx1+1,tx1+aw+1]]){let maxY=-1;
    for(let y=waist-2;y<=waist+4;y++)for(let x=x0;x<=x1;x++)if(isSkin(p,x,y,sk)){p.set(x,y,PK[1]);maxY=Math.max(maxY,y);}
    if(maxY>0)for(let x=x0;x<=x1+1;x+=2)p.set(x,maxY+1,CLAW);}
  if(back)return;
  // Rüsselnase und winzige Augen
  for(let y=ey+1;y<=ey+3;y++)for(let x=cx-2;x<=cx+2;x++)p.set(x,y,PK[y===ey+1?2:1]);
  p.set(cx-3,ey+2,PK[0]);p.set(cx+3,ey+2,PK[0]);p.set(cx,ey+4,PK[0]);p.set(cx-1,ey+2,PK[0]);p.set(cx+1,ey+2,PK[0]);
  p.set(cx-3,ey-1,EYE);p.set(cx+3,ey-1,EYE);};
