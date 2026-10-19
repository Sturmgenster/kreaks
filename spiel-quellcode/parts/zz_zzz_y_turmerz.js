/* =========================================================
   0.0.130 · Turm-Ebenen 1 und 2: Höhenwechsel, mehr Abzweigungen, Verstecke, Runenerz
   - Die Gänge steigen an und fallen ab (Rampen nach oben und unten), Kammern liegen auf unterschiedlichen Höhen.
   - Mehr Seitenarme und Rundwege. Hinter rissigen Felswänden liegen versteckte Kammern mit Schätzen.
   - Runenerz: nur hier zu finden, in versteckten Kammern, Sackgassen und tiefen Kammern. Abbauen ab Mythrilspitzhacke.
   ========================================================= */
const TZ={};
// ---------- Höhenfeld ----------
function tzApply(c,F){const{N,fy,cy}=c;for(let k=0;k<N*N;k++){const h=F[k];fy[k]+=h;cy[k]+=h;}}
function tzIDW(N,C,anchors,flats){const F=new Float32Array(N*N);for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=i-C,z=j-C;let s=0,w=0;
    for(const a of anchors){const d2=(x-a.x)**2+(z-a.z)**2,q=1/Math.pow(d2+36,2.2);s+=q*a.h;w+=q;}let h=w?s/w:0;
    for(const f of flats){const d=Math.hypot(x-f.x,z-f.z);if(d<f.r+f.b)h*=d<f.r?0:smooth((d-f.r)/f.b);}F[j*N+i]=h;}return F;}
// Ebene 1: jede Kammer bekommt eine eigene Höhe, der Start, die Halle und der Ausgang bleiben unten
function tzSlope1(c){const{G,N,C}=c,r=mulberry32((c.seed^0x5107)>>>0),H=new Map(),st=G.nodes.indexOf(G.st0);H.set(st,0);const q=[st];
  while(q.length){const k=q.shift();for(const m of G.nodes[k].e)if(!H.has(m)){H.set(m,clamp(H.get(k)+(r()-.45)*12,-6,11));q.push(m);}}
  const A=G.nodes.map((n,i)=>({x:n.x,z:n.z,h:H.get(i)||0}));for(const s of(G.spurs||[]))if(s.h!=null)A.push({x:s.x,z:s.z,h:s.h});
  const F=tzIDW(N,C,A,[{x:G.S.x,z:G.S.z,r:9,b:12},{x:G.B.x,z:G.B.z,r:22,b:10},{x:G.BL.x,z:G.BL.z,r:7,b:6}]);tzApply(c,F);}
// Ebene 2: die Ringgänge wellen sich auf und ab, der Hohlraum bleibt eben
function tzSlope2(c){const{G,N,C}=c,F=new Float32Array(N*N);for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=i-C,z=j-C,r=Math.hypot(x,z),a=Math.atan2(z,x),k=smooth(clamp((r-(G.HR+8))/10,0,1));
    let h=k*(5.5*Math.sin(a*2+1.3)+3*Math.sin(a*5+r*.13)+(r-80)*.06);const ds=Math.hypot(x-G.S.x,z-G.S.z);if(ds<22)h*=ds<9?0:smooth((ds-9)/13);F[j*N+i]=h;}tzApply(c,F);}
// ---------- Grundriss erweitern: Seitenarme, Rundwege, versteckte Kammern, Erzadern ----------
function tzExtend(G,seed,lvl){const r=mulberry32((seed^0x7e57)>>>0),N=CV_N,C=CV_C,{put,blob,tunnel}=cvCarver(seed^0x55,r,G.open,G.HL,lvl===2?{h:1.4,w:.75}:{h:1,w:1}),open=G.open;
  const inB=(x,z,m)=>Math.abs(x)<C-(m||8)&&Math.abs(z)<C-(m||8),nearKeep=(x,z,p)=>(G.keep||[]).some(q=>Math.hypot(x-q.x,z-q.z)<q.r+(p||6))||Math.hypot(x-G.S.x,z-G.S.z)<16||Math.hypot(x-G.BL.x,z-G.BL.z)<12;
  const okR=x=>lvl!==2||(Math.hypot(x[0],x[1])>(G.HR||0)+16);G.spurs=G.spurs||[];G.ores=[];G.secrets=[];let sd=900;
  const nodes=G.nodes.filter(n=>n!==G.st0&&n!==G.bossN&&!nearKeep(n.x,n.z,0));
  // Seitenarme mit kleinen Kammern
  for(let t=0,n=0;t<80&&n<12;t++){const s=nodes[(r()*nodes.length)|0],a=r()*6.283,L=11+r()*10,x=s.x+Math.cos(a)*L,z=s.z+Math.sin(a)*L;if(!inB(x,z,10)||nearKeep(x,z)||!okR([x,z]))continue;
    tunnel(s.x,s.z,x,z,sd++,.75);blob(x,z,3+r()*1.8,4.4,sd++);G.spurs.push({x,z,h:(r()-.3)*10});if(r()<.45)G.ores.push({x,z,r:4});n++;}
  // zusätzliche Rundwege zwischen nahen Kammern
  for(let t=0,n=0;t<120&&n<5;t++){const a=nodes[(r()*nodes.length)|0],b=nodes[(r()*nodes.length)|0];if(a===b||a.e.includes(G.nodes.indexOf(b)))continue;const d=Math.hypot(a.x-b.x,a.z-b.z);if(d<24||d>46)continue;
    if(nearKeep((a.x+b.x)/2,(a.z+b.z)/2))continue;tunnel(a.x,a.z,b.x,b.z,sd++,.7);n++;}
  // versteckte Kammern hinter einer rissigen Felswand
  const closed=(x,z,R)=>{for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){if(i*i+j*j>R*R)continue;const k=(Math.round(z)+C+j)*N+Math.round(x)+C+i;if(k<0||k>=N*N||open[k])return false;}return true;};
  for(let t=0;t<400&&G.secrets.length<4;t++){const s=nodes[(r()*nodes.length)|0],a=r()*6.283,L=12+r()*8,x=s.x+Math.cos(a)*L,z=s.z+Math.sin(a)*L;if(!inB(x,z,12)||nearKeep(x,z,10)||!okR([x,z]))continue;
    if(!closed(x,z,7)||G.secrets.some(q=>Math.hypot(q.rx-x,q.rz-z)<20))continue;const o0=open.slice(),dx=s.x-x,dz=s.z-z,dl=Math.hypot(dx,dz),ux=dx/dl,uz=dz/dl;
    let door=null;for(let q=0;q<=dl;q+=.5){const px=x+ux*q,pz=z+uz*q,k=(Math.round(pz)+C)*N+Math.round(px)+C;if(o0[k]){door=q;break;}}if(door==null||door<6)continue;
    for(let q=0;q<=door+1;q+=.5)put(x+ux*q,z+uz*q,1.9,4.4);blob(x,z,4.4+r()*.8,5.2,sd++,.25);const dq=door-1.4;
    G.secrets.push({rx:x,rz:z,x:x+ux*dq,z:z+uz*dq,nx:-ux,nz:-uz});G.ores.push({x,z,r:4,n:2});G.spurs.push({x,z,h:null});}
  // ein paar Adern tief in großen Kammern
  for(const n of nodes)if(n.big&&r()<.4&&Math.hypot(n.x-G.S.x,n.z-G.S.z)>40)G.ores.push({x:n.x,z:n.z,r:n.R||5});
  return G;}
{const a=CV_L1.gen;CV_L1.gen=s=>tzExtend(a(s),s,1);CV_L1.slope=tzSlope1;}
{const a=CV_L2.gen;CV_L2.gen=s=>tzExtend(a(s),s,2);CV_L2.slope=tzSlope2;}
// ---------- Aussehen: rissige Wände, Erzadern ----------
let TZM=null;function tzMats(){if(TZM)return TZM;const cr=new Px(32,32),R=pal(['#3a3a40','#4e4e56','#62626a','#76767e']);for(let y=0;y<32;y++)for(let x=0;x<32;x++)cr.set(x,y,R[shadeIdx(.55+(hash2(x>>2,y>>2,91)-.5)*.5+(hash2(x,y,92)-.5)*.2,4,x,y)]);
  const crack=(x0,y0,n,s)=>{let x=x0,y=y0;for(let k=0;k<n;k++){cr.set(x,y,hex('#141418'));cr.set(x+1,y,hex('#24242a'));x+=Math.round((hash2(k,s,93)-.5)*2.6);y+=1;if(y>31)break;}};crack(6,0,32,1);crack(18,0,32,2);crack(27,4,26,3);crack(12,10,20,4);
  const t=new THREE.CanvasTexture(cr.done());t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  TZM={wall:new THREE.MeshLambertMaterial({map:t}),rock:new THREE.MeshLambertMaterial({color:0x26282e,flatShading:true}),crys:new THREE.MeshBasicMaterial({color:0x6ae8ff}),crys2:new THREE.MeshBasicMaterial({color:0xb8f8ff})};return TZM;}
function tzDecor(c){const{K,G,X,Z,Y,N,C,open,d,fy,cy}=c,M=tzMats(),R=mulberry32((c.seed^0x0e5)>>>0),grp=K.grp;CV.secrets=[];CV.ores=[];
  const tint=c.lvl===2?0xb8a890:0xb4bcc8;M.wall.color.setHex(tint);
  for(const s of G.secrets||[]){const i=Math.round(s.x)+C,j=Math.round(s.z)+C,k=j*N+i,f=fy[k]||0,h=Math.max(3.4,Math.min(6,(cy[k]||5)-f)),tx=-s.nz,tz=s.nx,ry=Math.atan2(-tz,tx),g=new THREE.Group();
    for(let a=-2;a<=2;a++)for(let b=0;b<3;b++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.25+R()*.3,h/3+.25,1.1+R()*.4),M.wall);m.position.set(a*1.05,b*h/3+h/6,(R()-.5)*.25);m.rotation.set((R()-.5)*.12,(R()-.5)*.2,(R()-.5)*.12);g.add(m);}
    g.position.set(X+s.x,Y+f,Z+s.z);g.rotation.y=ry;grp.add(g);const sol=solAdd({x:X+s.x,z:Z+s.z,hw:2.9,hd:.75,y0:Y+f-1,y1:Y+f+h+2,rot:-ry,solid:1,dg:1});DGX.sol.push(sol);
    CV.secrets.push({x:X+s.x,z:Z+s.z,y:Y+f,g,sol,hp:5,room:{x:X+s.rx,z:Z+s.rz}});}
  for(const o of G.ores||[]){const n=o.n||1;for(let q=0;q<n;q++){let best=null;for(let t=0;t<80;t++){const a=R()*6.283,rr=R()*o.r,i=Math.round(o.x+Math.cos(a)*rr)+C,j=Math.round(o.z+Math.sin(a)*rr)+C,k=j*N+i;
        if(i<2||j<2||i>N-3||j>N-3||!open[k]||d[k]<1||d[k]>1.8)continue;if(CV.ores.some(e=>Math.hypot(e.x-X-(i-C),e.z-Z-(j-C))<3))continue;best=[i,j,k];break;}if(!best)continue;
      const[i,j,k]=best,x=X+i-C,z=Z+j-C,y=Y+fy[k],g=new THREE.Group();let gx=0,gz=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!open[(j+b)*N+i+a]){gx+=a;gz+=b;}
      const base=new THREE.Mesh(new THREE.DodecahedronGeometry(.85,0),M.rock);base.scale.set(1,.8,1);base.position.set(gx*.35,.45,gz*.35);g.add(base);
      for(let t=0;t<6;t++){const cr=new THREE.Mesh(new THREE.OctahedronGeometry(1,0),t%2?M.crys2:M.crys),h=.4+R()*.55;cr.scale.set(.12+R()*.08,h,.12+R()*.08);cr.position.set(gx*.3+(R()-.5)*1,.55+R()*.5,gz*.3+(R()-.5)*1);cr.rotation.set((R()-.5)*.9,R()*3,(R()-.5)*.9);g.add(cr);}
      g.position.set(x,y,z);grp.add(g);CV.ores.push({x,z,y:y,g,hp:6});}}}
{const a=CV_L1.decor;CV_L1.decor=function(c){a(c);try{tzDecor(c);}catch(e){console.error('Turm-Verstecke',e);}};}
{const a=CV_L2.decor;CV_L2.decor=function(c){a(c);try{tzDecor(c);}catch(e){console.error('Turm-Verstecke',e);}};}
// Schätze und Wächter in den versteckten Kammern
function tzPopulate(c){const{K,G,X,Z}=c,R=mulberry32((c.seed^0x51ce)>>>0);(G.secrets||[]).forEach((s,i)=>{const sp=c.spot(s.rx,s.rz,2.6,1.6);if(sp)K.chest(sp[0],sp[1],'rs'+i,false);
    if(R()<.6){const t=c.lvl===2?['spk','spj','spg'][(R()*3)|0]:['uskha','usksa','troll','hound'][(R()*4)|0],s2=c.spot(s.rx,s.rz,3,1.8);if(s2&&DT[t]){const e=cvMob(t,X+s2[0],Z+s2[1],R);if(e&&c.lvl===2&&typeof spHuntAI==='function')e.special=spHuntAI;}}});}
{const a=CV_L1.populate;CV_L1.populate=function(c){a(c);try{tzPopulate(c);}catch(e){console.error(e);}};}
{const a=CV_L2.populate;CV_L2.populate=function(c){a(c);try{tzPopulate(c);}catch(e){console.error(e);}};}
{const a=dgLoot;dgLoot=function(c){if(!c||c.open||!/^rs\d/.test(c.key||''))return a(c);c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z-=.3;c.lid.position.y+=.25;const R=Math.random,L=[['rune_ore',2+((R()*3)|0)],['silver',20+((R()*30)|0)]];
  L.push([['arrow_fire','arrow_poison','arrow_silver'][(R()*3)|0],6+((R()*6)|0)]);if(R()<.6)L.push([['ruby','sapphire','emerald','opal'][(R()*4)|0],1]);if(R()<.25)L.push(['rune_ingot',1]);if(R()<.35)L.push(['hpot2',1]);
  const got=[];for(const[id,n]of L){if(!ITEMS[id])continue;if(!addItem(id,n))spawnDrop(id,n,P.x,P.y+1,P.z);got.push(n+'× '+ITEMS[id].name);}showArea('Versteckter Schatz!');try{Snd.coin?Snd.coin():Snd.pickup();}catch(e){}renderInv();saveGame();};}
// ---------- Abbauen und Zerschlagen ----------
function tzLooked(R){if(!CV.on||!DGX.on||!CV.ores)return null;let best=null,bd=R||3.2;const L=lookDir();
  const test=(o,kind,yh)=>{const dx=o.x-P.x,dz=o.z-P.z,dy=o.y+yh-(P.y+P.eye),dd=Math.hypot(dx,dz);if(dd>bd)return;const dot=(dx*L.x+dy*L.y+dz*L.z)/(Math.hypot(dd,dy)||1);if(dot<.55)return;bd=dd;best={o,kind};};
  for(const o of CV.ores)if(!o.gone)test(o,'ore',.6);for(const s of CV.secrets)if(!s.gone)test(s,'wall',1.6);return best;}
function tzHit(t){const H=heldItem(),it=H&&H.it,W=WEAPONS[weaponOf()]||WEAPONS.fist;if(P.stats.st<4){toast('Zu wenig Ausdauer');return;}P.stats.st-=4;P.atkReady=time+Math.max(.45,W.cd);P.atkT=time;P.atkDur=.3;P.lastAction=time;renderStats();
  const o=t.o,fx=(P.x+o.x)/2,fz=(P.z+o.z)/2;
  if(t.kind==='ore'){const pick=it&&it.tool==='pick';if(!pick||(it.tier||0)<4){try{Snd.clink(.6);}catch(e){}for(let k=0;k<6;k++)spawnParticle(o.x,o.y+.7,o.z,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,0xb8f8ff,.25,.1);TZ.hint=time;return;}
    o.hp-=(it.tier||4)>=6?2:1;wearTool();try{Snd.clink(1);}catch(e){}for(let k=0;k<10;k++)spawnParticle(o.x,o.y+.7,o.z,(Math.random()-.5)*4,1+Math.random()*3,(Math.random()-.5)*4,Math.random()<.5?0x6ae8ff:0x3a3e46,.3,.12);
    if(o.hp<=0){o.gone=1;o.g.visible=false;spawnDrop('rune_ore',1+(Math.random()<.4?1:0),o.x,o.y+.6,o.z);try{gainXP(25);}catch(e){}try{Snd.boom(.08);}catch(e){}}return;}
  // Felswand
  o.hp-=it&&it.tool==='pick'?2:1;if(it&&it.dur)wearTool();try{Snd.hit('axe');}catch(e){}for(let k=0;k<12;k++)spawnParticle(fx,o.y+1+Math.random()*2,fz,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,0x6a6a72,.4,.18);
  o.g.position.x+=(Math.random()-.5)*.06;if(o.hp<=0){o.gone=1;o.g.visible=false;o.sol.off=true;try{Snd.boom(.22);}catch(e){}for(let k=0;k<40;k++)spawnParticle(o.x+(Math.random()-.5)*4,o.y+Math.random()*4,o.z+(Math.random()-.5)*4,(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,0x5a5a62,.8,.3);
    FLAGS.twSecrets=(FLAGS.twSecrets||0)+1;showArea('Versteckter Gang entdeckt!');saveGame();}}
{const a=attack;attack=function(){if(state==='playing'&&time>=(P.atkReady||0)&&!BLK.on){const t=tzLooked(3.2);if(t){tzHit(t);return;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){const t=tzLooked(3.6);if(t){if(t.kind==='ore'){const it=heldItem()&&heldItem().it;return it&&it.tool==='pick'&&(it.tier||0)>=4?'Runenerz · Linksklick: abbauen':'Runenerz · braucht eine Spitzhacke ab Mythril';}return'Rissige Felswand · Linksklick: zerschlagen';}return a();};}
// Erz glitzert ein wenig
function tzTick(dt){if(!CV.on||!DGX.on||!CV.ores)return;for(const o of CV.ores){if(o.gone)continue;if(Math.abs(o.x-P.x)>40||Math.abs(o.z-P.z)>40)continue;if(Math.random()<dt*2.5)spawnParticle(o.x+(Math.random()-.5)*1.2,o.y+.4+Math.random()*1,o.z+(Math.random()-.5)*1.2,0,.25,0,0x9af8ff,.5,.08);}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{tzTick(dt);}catch(e){if(!tzTick.err){tzTick.err=1;console.error(e);}}};}
// Mythril-Erz in der Kalten Tiefe gibt es nicht mehr nur bei Händlern: die Ebenen-Beschreibung nennt das Runenerz
try{TOWER_LEVELS[0].d+=' Hier gibt es seltenes Runenerz.';TOWER_LEVELS[1].d+=' Hier gibt es seltenes Runenerz.';}catch(e){}
