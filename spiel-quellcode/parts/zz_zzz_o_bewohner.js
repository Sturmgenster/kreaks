/* =========================================================
   0.0.120 · Die Bewohner der Dungeon-Stadt haben einen Tagesablauf
   - Männer gehen morgens zur Arbeit (Markt, Kaufhäuser, Wirtshaus, Tore, Turmträger, Gilde)
   - Frauen machen Besorgungen an Ständen, Kaufhäusern und Brunnen
   - Kinder gehen vormittags zur Schule und spielen danach auf den Plätzen
   - Alte gehen spazieren und sitzen auf den Bänken
   - Nachmittags haben alle frei und bummeln durch die Stadt, abends ins Wirtshaus
   - Ab 20:30 gehen alle heim, spätestens um 21 Uhr sind die Straßen leer
   - Alle laufen über die Straßen (Wegenetz), nicht quer durch die Häuser
   ========================================================= */
// =========================================================
// Aussehen
// =========================================================
const BW_LOOK=[];
{const r=mulberry32(77077),pick=L=>L[(r()*L.length)|0];
  const mk=(sex,age)=>{const race=pick(['human','human','human','human','dwarf','elf']);return{race,sex,age,skin:(r()*4)|0,hair:age==='kid'?pick(['short','long','braid','wild','tuft']):sex==='f'?pick(['long','braid','bun','short']):pick(['short','none','wild','tuft','mohawk']),
    hairColor:age==='old'?pick(['grey','white']):pick(['brown','black','blond','red']),beard:sex==='m'&&age!=='kid'&&r()<.5?pick(['short','long']):'none',
    cloth:age==='kid'?pick(['tunic','vest','rags']):sex==='f'?pick(['dress','dress','tunic','robe']):pick(['tunic','vest','leather','tunic']),clothColor:pick(['red','blue','green','brown','ochre','grey','teal','cream','purple']),
    pants:pick(['brown','grey','blue','black']),eyes:pick(['blue','green','brown'])};};
  for(let i=0;i<12;i++)BW_LOOK.push({role:'man',look:mk('m','adult')});for(let i=0;i<12;i++)BW_LOOK.push({role:'woman',look:mk('f','adult')});
  for(let i=0;i<8;i++)BW_LOOK.push({role:'kid',look:mk(i%2?'f':'m','kid')});for(let i=0;i<4;i++)BW_LOOK.push({role:'old',look:mk(i%2?'f':'m','old')});}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{BW_LOOK.forEach((B,i)=>{const c=Object.assign(defaultChar(),B.look);if(!RACES[c.race])c.race='human';for(const f of[0,1,2])list.push(['bw'+i+'_'+f,drawHero(c,f)]);});}catch(e){console.error('Bewohner: Bilder',e);}};}
BW_LOOK.forEach((B,i)=>{DT['bw'+i]={name:'Bürger',fac:'neutral',hero:1,h:B.role==='kid'?1.2:B.look.race==='dwarf'?1.5:1.76,hp:100,dmg:0,spd:1.4,reach:.5,cd:2,spr:'bw'+i+'_',aggro:.01,rad:.28};});
const BW_FN={m:['Hannes','Gerold','Matthis','Ruprecht','Konrad','Lorenz','Bertold','Ansgar','Wilhelm','Jost','Veit','Eckhart'],f:['Grete','Hedwig','Marlene','Agnes','Ida','Liesel','Walburga','Klara','Irmgard','Berta','Gunda','Rosalind'],
  k:['Pit','Mia','Jonte','Lotte','Fiete','Ella','Hein','Paula'],o:['Opa Ewald','Oma Trude','Opa Kuno','Oma Hilde']};
// =========================================================
// Wegenetz über die Straßen
// =========================================================
const BWG={nodes:[],adj:[],cache:new Map(),built:false};
function bwGraph(){const N=[],A=[],X=TWC.x,Z=TWC.z,key=new Map(),node=(x,z)=>{const k=Math.round(x*2)+','+Math.round(z*2);let i=key.get(k);if(i==null){i=N.length;N.push([X+x,Z+z]);A.push([]);key.set(k,i);}return i;},
    link=(a,b)=>{if(a===b||A[a].some(q=>q[0]===b))return;const d=Math.hypot(N[a][0]-N[b][0],N[a][1]-N[b][1]);A[a].push([b,d]);A[b].push([a,d]);};
  // Straßen und Gassen: Punkte an allen Kreuzungen und alle ~10 m
  for(const S of CITY_ST){const a=S.p[0],b=S.p[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/len,uz=(b[1]-a[1])/len,ts=new Set([0,len]);
    for(let t=10;t<len;t+=10)ts.add(t);for(const c of(typeof CT_L!=='undefined'?CT_L:[])){const t=Math.abs(ux)>.5?(c-a[0])/ux:(c-a[1])/uz;if(t>0&&t<len)ts.add(t);}
    const T=[...ts].sort((p,q)=>p-q),ids=T.map(t=>node(a[0]+ux*t,a[1]+uz*t));for(let k=0;k<ids.length-1;k++)link(ids[k],ids[k+1]);}
  // Turmring
  {const g=[],n=48;for(let k=0;k<n;k++){const a=k/n*6.283;g.push(node(Math.cos(a)*76,Math.sin(a)*76));}for(let k=0;k<n;k++)link(g[k],g[(k+1)%n]);
    for(let i=0;i<N.length;i++){const lx=N[i][0]-X,lz=N[i][1]-Z,d=Math.hypot(lx,lz);if(d>77&&d<84){let b=-1,bd=9;for(const j of g){const q=Math.hypot(N[j][0]-N[i][0],N[j][1]-N[i][1]);if(q<bd){bd=q;b=j;}}if(b>=0)link(i,b);}}}
  // Plätze und Parks: Raster, mit den Straßen am Rand verbunden
  const grid=new Map(),gk2=(x,z)=>Math.floor(x/12)+','+Math.floor(z/12);for(let i=0;i<N.length;i++){const k=gk2(N[i][0],N[i][1]);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(i);}
  const near=(x,z,r)=>{const o=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=grid.get((Math.floor(x/12)+a)+','+(Math.floor(z/12)+b));if(L)for(const i of L)if(Math.hypot(N[i][0]-x,N[i][1]-z)<r)o.push(i);}return o;};
  const area=(pts,lim)=>{const ids=pts.map(([x,z])=>node(x,z));for(const a of ids)for(const b of ids)if(a<b&&Math.hypot(N[a][0]-N[b][0],N[a][1]-N[b][1])<lim)link(a,b);for(const a of ids)for(const b of near(N[a][0],N[a][1],lim))if(!ids.includes(b))link(a,b);};
  for(const Q of CITY_PL){const pts=[];for(let x=Q.x0+3;x<=Q.x1-3;x+=9)for(let z=Q.z0+3;z<=Q.z1-3;z+=9)pts.push([x,z]);area(pts,13);}
  for(const C of CITY_RD){const pts=[];for(let k=0;k<6;k++){const a=k/6*6.283;pts.push([C.x+Math.cos(a)*(C.r-2.5),C.z+Math.sin(a)*(C.r-2.5)]);}area(pts,11);}
  BWG.nodes=N;BWG.adj=A;BWG.cache.clear();BWG.built=true;}
function bwNear(x,z){let b=0,bd=1e9;const N=BWG.nodes;for(let i=0;i<N.length;i++){const d=(N[i][0]-x)**2+(N[i][1]-z)**2;if(d<bd){bd=d;b=i;}}return b;}
function bwRoute(a,b){if(a===b)return[a];const k=a*65536+b;if(BWG.cache.has(k))return BWG.cache.get(k);const N=BWG.nodes,A=BWG.adj,n=N.length,g=new Float64Array(n).fill(1e18),prev=new Int32Array(n).fill(-1),done=new Uint8Array(n),H=[];
  const hh=i=>Math.hypot(N[i][0]-N[b][0],N[i][1]-N[b][1]);const push=(f,i)=>{H.push([f,i]);let c=H.length-1;while(c){const p=(c-1)>>1;if(H[p][0]<=H[c][0])break;[H[p],H[c]]=[H[c],H[p]];c=p;}};
  const pop=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;let c=0;for(;;){const x=2*c+1,y=x+1;let m=c;if(x<H.length&&H[x][0]<H[m][0])m=x;if(y<H.length&&H[y][0]<H[m][0])m=y;if(m===c)break;[H[m],H[c]]=[H[c],H[m]];c=m;}}return t;};
  g[a]=0;push(hh(a),a);while(H.length){const[,u]=pop();if(done[u])continue;done[u]=1;if(u===b)break;for(const[v,w]of A[u]){const ng=g[u]+w;if(ng<g[v]){g[v]=ng;prev[v]=u;push(ng+hh(v),v);}}}
  const p=[];if(prev[b]<0){p.push(a,b);}else{for(let v=b;v>=0;v=prev[v]){p.push(v);if(v===a)break;}p.reverse();}if(BWG.cache.size>4000)BWG.cache.clear();BWG.cache.set(k,p);return p;}
// =========================================================
// Orte: Arbeit, Besorgungen, Freizeit, Spielplätze
// =========================================================
const BWP={work:[],errand:[],free:[],play:[],bench:[]};
function bwPlaces(){const X=TWC.x,Z=TWC.z,W=(x,z)=>[X+x,Z+z],P2=BWP;P2.work=[];P2.errand=[];P2.free=[];P2.play=[];P2.bench=[];
  for(const s of TWS.stalls||[]){P2.work.push({x:s.x+1.6,z:s.z,kind:'Markt'});P2.errand.push({x:s.x,z:s.z+(s.sd||1)*4.4,label:'Marktstand'});}
  for(const s of TWS.shops||[]){P2.work.push({x:s.x+2,z:s.z,kind:'Kaufhaus'});P2.errand.push({x:s.x-1,z:s.z,label:'Kaufhaus'});}
  if(CITY.tavern){P2.work.push({x:CITY.tavern.x+3,z:CITY.tavern.z,kind:'Wirtshaus'});P2.free.push({x:CITY.tavern.x,z:CITY.tavern.z-1.5,label:'Wirtshaus',eve:1},{x:CITY.tavern.x-3,z:CITY.tavern.z-2,label:'Wirtshaus',eve:1});}
  for(const g of[[0,1],[Math.PI,1],[Math.PI/2,1],[-Math.PI/2,1]]){const a=g[0],r=TWC.WR-9;P2.work.push({x:X+Math.cos(a)*r+Math.sin(a)*4,z:Z+Math.sin(a)*r-Math.cos(a)*4,kind:'Tor'});}
  P2.work.push({x:X+TWC.R+10,z:Z+6,kind:'Träger',b:[X+120,Z-12]},{x:X+TWC.R+10,z:Z-6,kind:'Träger',b:[X+175,Z-50]},{x:GH.x+20,z:GH.z+GH.d/2+6,kind:'Gilde'},{x:GH.x-24,z:GH.z+GH.d/2+5,kind:'Gilde'},
    {x:AR.x+12,z:AR.z-AR.R1-6,kind:'Arena'},{x:AR.x-30,z:AR.z-AR.R1-4,kind:'Arena'});
  for(const F of CITY.fount){P2.errand.push({x:F.x+F.R+1.2,z:F.z,label:'Brunnen'});P2.free.push({x:F.x-F.R-1.4,z:F.z+1,label:'Brunnen'});}
  for(const Q of CITY_PL)for(let k=0;k<3;k++)P2.free.push({x:X+Q.x0+4+Math.random()*(Q.x1-Q.x0-8),z:Z+Q.z0+3+Math.random()*(Q.z1-Q.z0-6),label:Q.n});
  for(let k=0;k<6;k++){const a=k/6*6.283;P2.free.push({x:X+Math.cos(a)*76,z:Z+Math.sin(a)*76,label:'Turmring'});}
  P2.free.push({x:X+100,z:Z+3,label:'Heldenallee'},{x:X+160,z:Z-3,label:'Heldenallee'});
  for(const q of CITY.parks)P2.play.push({x:q.x,z:q.z,r:Math.max(4,q.r)});P2.play.push({x:X-137,z:Z,r:6},{x:X-25,z:Z+90,r:7});
  for(const b of CITY.benches)P2.bench.push({x:b.x,z:b.z});if(!P2.bench.length)P2.bench.push(...P2.free.slice(0,3));}
// =========================================================
// Bewohner
// =========================================================
const BW={list:[],t:0,lastClock:null};
const bwClock=()=>{const c=FLAGS.clock;return c==null?600:c;};
const BW_SCHED={man:[[390,'home'],[900,'work'],[1150,'free'],[1440,'home']],woman:[[450,'home'],[840,'errand'],[1150,'free'],[1440,'home']],kid:[[450,'home'],[750,'school'],[1110,'play'],[1440,'home']],old:[[540,'home'],[1080,'free'],[1440,'home']]};
function bwPhase(e,t){const S=BW_SCHED[e.bw.role],j=e.bw.jit;t=t-j;if(t<0)t+=1440;if(t>=1440)t-=1440;for(const[end,ph]of S)if(t<end)return ph;return'home';}
function bwPick(L){return L[(Math.random()*L.length)|0];}
function bwGoal(e,ph){const b=e.bw;if(ph==='home')return{x:b.door[0],z:b.door[1],inside:1};if(ph==='school')return CITY.schoolDoor?{x:CITY.schoolDoor[0],z:CITY.schoolDoor[1],inside:1}:{...bwPick(BWP.play)};
  if(ph==='work')return{x:b.work.x,z:b.work.z,work:1};if(ph==='errand'){const p=bwPick(BWP.errand);return{x:p.x+(Math.random()-.5)*1.5,z:p.z+(Math.random()-.5)*1.5,wait:10+Math.random()*16,label:p.label};}
  if(ph==='play'){const p=b.playAt||(b.playAt=bwPick(BWP.play));return{x:p.x,z:p.z,play:1};}
  const ev=bwClock()>1080;let L=b.role==='old'&&Math.random()<.5?BWP.bench:BWP.free.filter(p=>!p.eve||ev||Math.random()<.2);if(ev){const n=L.filter(p=>Math.hypot(p.x-b.door[0],p.z-b.door[1])<130);if(n.length)L=n;}const p=bwPick(L.length?L:BWP.free);return{x:p.x+(Math.random()-.5)*2,z:p.z+(Math.random()-.5)*2,wait:15+Math.random()*30,label:p.label};}
function bwPlan(e,g){const b=e.bw;b.goal=g;const a=bwNear(e.x,e.z),c=bwNear(g.x,g.z);b.path=bwRoute(a,c).map(i=>BWG.nodes[i]);b.path.push([g.x,g.z]);b.pi=0;b.wait=0;b.arrived=false;}
function bwSpawn(){if(!BWG.built)bwGraph();bwPlaces();const homes=(TWS.houses||[]).filter(h=>h.lot&&!h.lot.rent&&!h.lot.school);if(!homes.length)return;const r=mulberry32(31337),nameIdx={m:0,f:0,k:0,o:0};
  const plan=[];for(let i=0;i<22;i++)plan.push('man');for(let i=0;i<20;i++)plan.push('woman');for(let i=0;i<14;i++)plan.push('kid');for(let i=0;i<6;i++)plan.push('old');
  plan.forEach((role,i)=>{const looks=BW_LOOK.map((L,k)=>[L,k]).filter(([L])=>L.role===role),lk=looks[(r()*looks.length)|0][1],home=homes[(r()*homes.length)|0],sx=role==='woman'?'f':role==='man'?'m':role==='kid'?'k':'o',nm=BW_FN[sx][(nameIdx[sx]++)%BW_FN[sx].length];
    const e=spawnEnt('bw'+lk,home.door[0],home.door[1],{home:{x:home.door[0],z:home.door[1]},talk:0,wander:false,always:false,name:nm,role:'Bewohner'});e.special=()=>true;
    e.bw={role,door:home.door,jit:Math.round((r()-.5)*50),work:role==='man'?BWP.work[i%BWP.work.length]:null,errands:0,spd:role==='kid'?1.9:role==='old'?1.05:1.45,name:nm};
    BW.list.push(e);bwPlace(e);});BW.lastClock=bwClock();}
// Bewohner sofort passend zur Uhrzeit hinstellen
function bwPlace(e){const b=e.bw,ph=bwPhase(e,bwClock());b.phase=ph;const g=bwGoal(e,ph);if(g.inside){b.inside=true;e.hidden=true;b.at=[g.x,g.z];e.x=g.x;e.z=g.z;b.goal=g;b.path=[];b.arrived=true;return;}
  e.hidden=false;b.inside=false;e.x=g.x+(Math.random()-.5)*2;e.z=g.z+(Math.random()-.5)*2;e.y=TWC.H;b.goal=g;b.path=[];b.arrived=true;b.wait=Math.random()*(g.wait||10);}
const BW_SAY={man:{work:['Die Arbeit macht sich nicht von allein.','Keine Zeit, ich muss schaffen.','Nach Feierabend gibt es ein Bier im Goldenen Turm.'],free:['Endlich Feierabend!','Schöner Tag heute, oder?','Hast du schon vom Turm gehört? Ebene eins soll tückisch sein.'],home:['Ich muss heim, die Frau wartet.','Spät ist es geworden.']},
  woman:{errand:['Ich brauche noch Brot und Fisch.','Die Preise am Markt sind wieder gestiegen!','Hast du die neuen Stoffe im Kaufhaus gesehen?'],free:['Ein Spaziergang tut gut.','Die Kinder spielen am Gartenplatz.','Im Wirtshaus spielt heute Abend Musik, sagt man.'],home:['Es wird dunkel, ich gehe heim.']},
  kid:{school:['Ich muss zur Schule!'],play:['Fang mich doch!','Du bist dran!','Ich werde mal ein Held, wie die Statuen!','Hihi!'],home:['Mama ruft!']},old:{free:['Früher war der Turm noch kleiner. Oder ich größer.','Setz dich doch einen Moment zu mir.','Die Jugend von heute…'],home:['Meine Knie… Zeit fürs Bett.']}};
function bwSay(e){const L=BW_SAY[e.bw.role],ph=e.bw.phase,arr=(L&&(L[ph]||L.free||L.work))||['Guten Tag!'];say(e,arr[(Math.random()*arr.length)|0],3.2);}
// =========================================================
// Takt
// =========================================================
function bwTick(dt){if(!TWS.built||!BW.list.length)return;const t=bwClock();
  // Zeitsprung (Schlafen): alle neu hinstellen
  if(BW.lastClock!=null){let d=t-BW.lastClock;if(d<-720)d+=1440;if(Math.abs(d)>45){for(const e of BW.list)if(DEM.includes(e))bwPlace(e);}}BW.lastClock=t;
  const sim=(typeof SIM==='function'?SIM():120)+30,late=t>=1260&&t<1440;
  for(const e of BW.list){if(e.dead||!DEM.includes(e))continue;const b=e.bw;
    const ph=bwPhase(e,t);if(ph!==b.phase){b.phase=ph;b.errands=0;b.playAt=null;if(b.inside&&(ph==='home'||ph==='school')){const g=bwGoal(e,ph);b.at=[g.x,g.z];e.x=g.x;e.z=g.z;b.goal=g;}
      else{if(b.inside){b.inside=false;e.hidden=false;const at=b.at||b.door;e.x=at[0];e.z=at[1];}bwPlan(e,bwGoal(e,ph));}}
    if(b.inside){e.hidden=true;continue;}
    if(b.hold>0){b.hold-=dt;e.frame=0;continue;}
    const pd=Math.hypot(e.x-P.x,e.z-P.z),near=pd<sim;
    // Spätestens 21 Uhr verschwunden
    if(late&&(b.phase==='home')&&(t>=1272||pd>12)){b.inside=true;e.hidden=true;b.at=b.door;e.x=b.door[0];e.z=b.door[1];continue;}
    if(!b.arrived){const q=b.path[b.pi];if(!q){b.arrived=true;continue;}const sp=b.spd*(b.phase==='home'&&t>1215?1.6:1)*(near?1:3);
      if(near){entMove(e,q[0],q[1],sp,dt);e.y=TWC.H;}else{const dx=q[0]-e.x,dz=q[1]-e.z,d=Math.hypot(dx,dz)||1,st=Math.min(d,sp*dt);e.x+=dx/d*st;e.z+=dz/d*st;}
      if(Math.hypot(q[0]-e.x,q[1]-e.z)<(b.pi===b.path.length-1?.5:1.6)){b.pi++;if(b.pi>=b.path.length){b.arrived=true;b.wait=b.goal.wait||0;if(b.goal.inside){b.inside=true;e.hidden=true;b.at=[b.goal.x,b.goal.z];}}}continue;}
    // angekommen
    const g=b.goal;e.frame=0;
    if(g.play){b.pt=(b.pt||0)-dt;if(b.pt<=0||Math.hypot((b.px||e.x)-e.x,(b.pz||e.z)-e.z)<.4){b.pt=.8+Math.random()*1.6;const p=b.playAt||g,a=Math.random()*6.283,rr=Math.random()*(p.r||6);b.px=p.x+Math.cos(a)*rr;b.pz=p.z+Math.sin(a)*rr;}
      if(near)entMove(e,b.px,b.pz,3.2,dt);if(near&&Math.random()<dt*.04&&pd<25)bwSay(e);continue;}
    if(g.work){const w=b.work;if(w&&w.kind==='Träger'){b.tw=(b.tw||0)-dt;if(b.tw<=0){b.tw=25+Math.random()*15;b.toB=!b.toB;const T=b.toB?w.b:[w.x,w.z];bwPlan(e,{x:T[0],z:T[1],work:1});}}
      else if(near){b.tl=(b.tl||0)-dt;if(b.tl<=0){b.tl=4+Math.random()*6;e.flip=!e.flip;}}continue;}
    b.wait-=dt;if(b.wait<=0){if(b.phase==='errand'){b.errands++;bwPlan(e,bwGoal(e,b.errands>4&&Math.random()<.5?'free':'errand'));}else if(b.phase==='free')bwPlan(e,bwGoal(e,'free'));}}
  // ab und zu ein Wort
  BW.t-=dt;if(BW.t<=0){BW.t=2+Math.random()*3;const c=BW.list.filter(e=>!e.hidden&&!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<9);if(c.length&&Math.random()<.35)bwSay(c[(Math.random()*c.length)|0]);}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{bwTick(dt);}catch(e){if(!bwTick.err){bwTick.err=1;console.error('Bewohner',e);}}};}
// Die alten Bürger und Gäste ersetzen
{const a=twSpawnFolk;twSpawnFolk=function(){a();for(let i=TWS.ents.length-1;i>=0;i--){const e=TWS.ents[i];if((e.name==='Bürger'||e.name==='Gast')&&!e.trader&&!e.guard){removeEnt(e);TWS.ents.splice(i,1);}}BW.list=[];try{bwSpawn();}catch(e){console.error('Bewohner',e);}};}
{const a=twFree;twFree=function(){for(const e of BW.list)removeEnt(e);BW.list=[];BWG.built=false;a();};}
// Ansprechen
function bwLooked(){let best=null,bd=3.8;for(const e of BW.list){if(e.dead||e.hidden)continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd&&lookingAt(e.x,e.y+(e.bw.role==='kid'?.8:1.3),e.z,4.6,.8)){bd=d;best=e;}}return best;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&TWS.built){const e=bwLooked();if(e){bwSay(e);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(TWS.built){const e=bwLooked();if(e)return'Mit '+e.bw.name+' reden';}return a();};}
