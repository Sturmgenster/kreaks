/* =========================================================
   V60 · Natta, die Mutter der Schlangen: Mini-Boss im Dschungel
   Sie liegt die meiste Zeit im Schlamm verborgen, nur zwei gelbe Augen schauen heraus.
   Ab und zu wechselt sie ihr Versteck und kriecht dabei an Reisenden vorbei.
   Sie sucht niemanden. Wer sie aber stört, bekommt einen harten Kampf.
   ========================================================= */
const NAT_P={sc:pal(['#18140a','#2a2210','#3e3416','#54461e','#6c5c28','#867434']),band:pal(['#7a5a14','#a8801e','#d0a832','#ecd060']),belly:pal(['#8a8a4a','#aaa860','#c8c47c']),
  mouth:pal(['#4a0c10','#8a2028','#c04a50']),eye:hex('#f0d020'),slit:hex('#100a04'),fang:hex('#f4f0e2')};
function drawNattaSeg(band){const S=24,p=new Px(S,S),r=mulberry32(band?1931:1933);const blot=[];for(let k=0;k<(band?3:1);k++)blot.push([4+r()*16,5+r()*7,2.5+r()*2.5]);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(x-11.5)/11.6,dy=(y-11.5)/11.6,d=dx*dx+dy*dy;if(d>1)continue;const nz=Math.sqrt(1-d);
    let L=.46-dy*.42+nz*.22+(hash2(x,y,1934+(band?1:0))-.5)*.16;let P=NAT_P.sc;if(dy>.5)P=NAT_P.belly;
    else if(blot.some(([bx,by,br])=>Math.hypot(x-bx,(y-by)*1.3)<br))P=band?NAT_P.band:NAT_P.sc,L-=band?.05:.25;
    if((((x>>1)+(y>>1))&1)&&dy<.5)L-=.08;if(d>.86)L-=.18;p.set(x,y,P[shadeIdx(L,P.length,x,y)]);}
  return p.done();}
function drawNattaHead(open){const W=48,H=30,p=new Px(W,H),S=NAT_P.sc;
  // Oberkopf (lang, flach, breite Schläfen)
  const top=(x)=>{const t=x/46;return 13-Math.sin(Math.min(1,t*1.2)*2.6)*6*(1-t*.45);};
  const jawA=open?-.5:0;
  for(let x=1;x<46;x++){const ty=top(x),by=open?16-(x-8)*.18:19-(x>36?(x-36)*.5:0);for(let y=Math.floor(ty);y<=by;y++){let L=.62-(y-ty)/(by-ty+1)*.45+(hash2(x>>1,y>>1,1801)-.5)*.2;if(((x+(y>>1))%4)===0)L-=.15;p.set(x,y,S[shadeIdx(L,S.length,x,y)]);}}
  // Unterkiefer
  if(open){for(let x=4;x<44;x++){const t=(x-4)/40,y0=20+t*6,y1=y0+3.4-t*1.2;for(let y=Math.floor(y0);y<=y1;y++)p.set(x,y,NAT_P.belly[shadeIdx(.6-(y-y0)*.15,3,x,y)]);}
    for(let x=10;x<42;x++){const t=(x-10)/32;for(let y=Math.round(16-(x-8)*.18);y<Math.round(20+((x-4)/40)*6);y++)p.set(x,y,NAT_P.mouth[shadeIdx(.5-(y-16)*.06,3,x,y)]);}
    for(const fx of[34,40])for(let k=0;k<4;k++){p.set(fx-k*.2,15-(fx-8)*.18+k,NAT_P.fang);}for(const fx of[33,39])for(let k=0;k<3;k++)p.set(fx,24-k,NAT_P.fang);
    // gespaltene Zunge
    for(let k=0;k<8;k++)p.set(42+k*.7,19+Math.sin(k)*.6,hex('#c02030'));p.set(47,18,hex('#c02030'));p.set(47,20,hex('#c02030'));}
  else{for(let x=6;x<44;x++){p.set(x,19-(x>36?(x-36)*.5:0),NAT_P.sc[0]);for(let y=20-(x>36?(x-36)*.5:0);y<=22-(x>30?(x-30)*.25:0);y++)p.set(x,y,NAT_P.belly[shadeIdx(.6,3,x,y)]);}}
  // Auge, Nüstern, Brauenschuppe
  for(let y=8;y<12;y++)for(let x=28;x<33;x++){if(Math.hypot(x-30,y-9.8)<2.4)p.set(x,y,NAT_P.eye);}for(let y=8;y<12;y++)p.set(30,y,NAT_P.slit);for(let x=27;x<34;x++)p.set(x,7,S[0]);
  p.set(43,13,S[0]);p.set(44,13,S[0]);for(let k=0;k<5;k++)p.set(14+k*4,10+((k*3)%2),NAT_P.band[2]);
  outline(p);return p.done();}
function drawNattaEyes(){const p=new Px(16,6);for(const ox of[2,11])for(let y=1;y<5;y++)for(let x=ox;x<ox+4;x++){if(Math.hypot(x-ox-1.5,y-2.5)<2.1)p.set(x,y,NAT_P.eye);}p.set(3,2,NAT_P.slit);p.set(3,3,NAT_P.slit);p.set(12,2,NAT_P.slit);p.set(12,3,NAT_P.slit);return p.done();}
function drawNattaShed(){const W=56,H=12,p=new Px(W,H),C=pal(['#8a8470','#b0aa90','#d2ccb0','#ece8d4']);for(let x=1;x<W-1;x++){const y=6+Math.sin(x*.22)*2.4,w=Math.max(1,3.4-x*.035);for(let o=-w;o<=w;o++){if(hash2(x,Math.round(y+o),1811)<.18)continue;p.set(x,y+o,C[((x>>1)+Math.round(o))&1?1:2]);}}outline(p);return p.done();}
function drawNattaSpit(){const p=new Px(8,8),G=pal(['#2a6a10','#4aa020','#8ae050','#d0ff90']);fEll(p,4,4,3.4,3.4,G,{b:.1});return p.done();}
function drawNattaSkin(){const p=new Px(16,16),S=NAT_P.sc;for(let y=1;y<15;y++)for(let x=1;x<15;x++){if(Math.abs(x-7.5)+Math.abs(y-7.5)>8.5)continue;const sc=((x+y)&3)===0||((x-y+16)&3)===0;p.set(x,y,sc?NAT_P.band[2]:S[shadeIdx(.55+(7.5-y)*.03,S.length,x,y)]);}outline(p);return p.done();}
function drawNattaFang(){const p=new Px(16,16);for(let k=0;k<13;k++){const t=k/12,x=3+t*9+Math.sin(t*2)*1.5,y=2+t*12,w=Math.max(.5,2.6-t*2.2);for(let o=-w;o<=w;o++)p.set(x+o,y,hex(o<0?'#fffaf0':'#d8d0bc'));}
  for(let x=1;x<8;x++)for(let y=0;y<4;y++)p.set(x+1,y,hex(y<2?'#6a3a22':'#8a5232'));p.set(12,13,hex('#4aa020'));p.set(12,14,hex('#8ae050'));outline(p);return p.done();}
function drawNattaArmor(){const p=new Px(20,20),S=NAT_P.sc;fPoly(p,[[3,3],[8,1],[12,1],[17,3],[18,9],[16,18],[4,18],[2,9]],S,{f:(x,y,L)=>(((x+y)&3)===0||((x-y+40)&3)===0)?NAT_P.band[1]:S[shadeIdx(L,S.length,x,y)]});
  for(let y=1;y<5;y++){p.set(8,y,hex('#3a2a18'));p.set(12,y,hex('#3a2a18'));}outline(p);return p.done();}
function nattaSprites(l){l.push(['natta_b0',drawNattaSeg(false)],['natta_b1',drawNattaSeg(true)],['natta_h0',drawNattaHead(false)],['natta_h1',drawNattaHead(true)],['natta_eyes',drawNattaEyes()],['nattashed',drawNattaShed()],['natta_spit',drawNattaSpit()],
  ['nattaskin',drawNattaSkin()],['nattafang',drawNattaFang()],['nattaarmor',drawNattaArmor()]);}
{const ws1=wildSprites;wildSprites=function(l){ws1(l);nattaSprites(l);};}
Object.assign(ITEMS,{nattaskin:{name:'Nattas Schuppenhaut',plural:'Stück Schuppenhaut',price:120},nattafang:{name:'Nattas Giftzahn',weapon:'nattafang',dur:400},nattaarmor:{name:'Schuppenpanzer',slot:'armor',def:.24}});
WEAPONS.nattafang={cost:7,dmg:36,range:2.1,cd:.38};
Object.assign(ITEM_DESC,{nattaskin:'Grün und gelb geschuppt, zäh wie Leder. Daraus lässt sich ein Panzer machen',nattafang:'Der Giftzahn der Riesenschlange. Schnell wie ein Dolch, tödlich wie ein Schwert',nattaarmor:'Rüstung aus Nattas Schuppen. Leicht, und doch hält sie fast alles ab'});
RECIPES.push({id:'nattaarmor',need:{nattaskin:3,rope:2},bench:1});
MUSIC_SLOTS['bosskampf/natta']='Natta (Riesenschlange im Dschungel)';
// ---------- Zustand ----------
const NAT={st:'hide',x:0,z:0,y:0,hp:2600,max:2600,trail:[],spots:[],spot:0,t:120,segN:36,len:26,hdx:1,hdz:0,lift:0,mouth:0,shots:[],init:false,eyes:0,hurt:0,cd:0,phase:1,rip:null};
function nattaInit(){if(NAT.init)return;NAT.init=true;const r=mulberry32(1901),S=[];
  for(let k=0;k<4000&&S.length<7;k++){const x=JX0+60+r()*(JX1-JX0-120),z=JZ0+60+r()*(JZ1-JZ0-120);if(!inFar(x,z)||jungleW(x,z)<.9)continue;if(jMud(x,z)<(k<2500?.62:.4))continue;if(jSiteD(x,z)<30)continue;
    if(Math.hypot(x-JCF.x,z-JCF.z)<40)continue;if(S.some(s=>Math.hypot(s.x-x,s.z-z)<70))continue;if(getHeightF(x,z)<WATER+.3)continue;S.push({x,z});}
  if(!S.length)S.push({x:(JX0+JX1)/2,z:(JZ0+JZ1)/2});NAT.spots=S;const s=S[0];NAT.x=s.x;NAT.z=s.z;NAT.trail=[];for(let i=0;i<80;i++)NAT.trail.push({x:s.x-i*.4,z:s.z});
  NAT.hp=FLAGS.nattaHp!=null?FLAGS.nattaHp:NAT.max;
  // Hinweise: Häutungen und Knochen bei den Verstecken
  const deco=[];S.forEach((s,i)=>{for(let k=0;k<2;k++){const a=r()*6.283,d=6+r()*5,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;deco.push({x,z,y:getHeight(x,z)-.02,w:3.6,h:3.6*12/56,spr:'nattashed',tint:.95});}
    const a=r()*6.283,x=s.x+Math.cos(a)*4,z=s.z+Math.sin(a)*4;deco.push({x,z,y:getHeight(x,z)-.02,w:.9,h:.41,spr:'bones',tint:1});});
  const m=makeBillboards(deco,bbMaterial(decorMat.uniforms.map.value,0,0));scene.add(m);
  const L=[];for(let i=0;i<64;i++)L.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'natta_b0',tint:1});NAT.mat=bbMaterial(decorMat.uniforms.map.value,0,0);EXTRA_BB.push(NAT.mat);NAT.mesh=makeBillboards(L,NAT.mat);NAT.mesh.geometry.instanceCount=0;scene.add(NAT.mesh);
  if(FLAGS.nattaDead)NAT.st='gone';else NAT.t=60+Math.random()*120;}
// Spur: Kopf vorne, der Körper folgt
function natPush(){const T=NAT.trail,h=T[0];if(!h||Math.hypot(NAT.x-h.x,NAT.z-h.z)>=.4){T.unshift({x:NAT.x,z:NAT.z});if(T.length>90)T.length=90;}}
function natSegPos(i){const sp=NAT.len/NAT.segN,want=(i+1)*sp;let acc=0,px=NAT.x,pz=NAT.z;for(let k=0;k<NAT.trail.length;k++){const q=NAT.trail[k],d=Math.hypot(q.x-px,q.z-pz);if(acc+d>=want){const t=(want-acc)/Math.max(d,1e-4);return[px+(q.x-px)*t,pz+(q.z-pz)*t];}acc+=d;px=q.x;pz=q.z;}return[px,pz];}
function natRad(i){const t=i/NAT.segN;return(t<.12?.5+t*2.2:.76-Math.max(0,t-.35)*.95)*1.0;}
function natMove(tx,tz,spd,dt){const dx=tx-NAT.x,dz=tz-NAT.z,d=Math.hypot(dx,dz);if(d<.05)return 0;const st=Math.min(d,spd*dt);NAT.x+=dx/d*st;NAT.z+=dz/d*st;NAT.hdx=dx/d;NAT.hdz=dz/d;natPush();return d-st;}
const natFight=()=>NAT.st==='fight'||NAT.st==='emerge';
function natHeadY(){return getHeight(NAT.x,NAT.z)+.75+NAT.lift;}
// ---------- Boss-Leiste ----------
function natBar(show){const b=$('bossBar');if(show){$('bossName').textContent='Natta, Mutter der Schlangen';b.classList.remove('open');b.hidden=false;natBarTick();$('areaBanner').hidden=true;requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.add('open')));}
  else{b.classList.remove('open');setTimeout(()=>{if(!natFight()&&!dmBoss&&!(pharaoh&&pharaoh.awake&&!pharaoh.dead)&&!(boss&&!boss.dead))b.hidden=true;},900);}}
function natBarTick(){$('bossFill').style.width=Math.max(0,NAT.hp/NAT.max*100).toFixed(1)+'%';const t=`${Math.max(0,Math.ceil(NAT.hp))} / ${NAT.max}`,e=$('bossHp');if(e.textContent!==t)e.textContent=t;}
{const mw0=musicWant;musicWant=function(){if(natFight()&&!Mus.missing.has('bosskampf/natta'))return'bosskampf/natta';if(natFight())return'ereignisse/kampf';return mw0();};}
// ---------- Geräusche ----------
function natHiss(v){const c=Snd.ctx;if(!c)return;v=v==null?Math.max(0,1-Math.hypot(P.x-NAT.x,P.z-NAT.z)/60):v;if(v<.03)return;const t=c.currentTime,s=c.createBufferSource();s.buffer=Snd.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=2800;const g=c.createGain();Snd.env(g,t,.08,.22*v,1.3);s.connect(f);f.connect(g);g.connect(Snd.sfx);s.start(t,0,1.4);
  const{o}=Snd.tone('sawtooth',90,t,1.1,.06*v,null,400);o.frequency.linearRampToValueAtTime(55,t+1);}
// ---------- Ein Treffer gegen Natta ----------
function nattaHurt(n,part){if(NAT.st==='dead'||NAT.st==='gone'||NAT.st==='under')return;const head=part==='head';n*=head?1.35:.7;NAT.hp-=n;NAT.hurt=.2;FLAGS.nattaHp=NAT.hp;
  if(!natFight()){natStartFight(true);}if(NAT.hp<=0)natDie();else{natBarTick();if(Math.random()<.25)natHiss(.6);}}
function natStartFight(hit){if(NAT.st==='dead'||NAT.st==='gone')return;const was=NAT.st;NAT.st=was==='hide'||was==='submerge'?'emerge':'fight';NAT.t=was==='hide'?1.4:0;NAT.act=null;NAT.cd=1.2;natBar(true);natHiss(1);
  if(was==='hide'){for(let k=0;k<40;k++)spawnParticle(NAT.x+(Math.random()-.5)*3,getHeight(NAT.x,NAT.z)+.2,NAT.z+(Math.random()-.5)*3,(Math.random()-.5)*5,2+Math.random()*4,(Math.random()-.5)*5,Math.random()<.5?0x3a2a1a:0x4a5a2a,1.2,.35);try{Snd.crash();}catch(e){}}
  if(!FLAGS.nattaMet){FLAGS.nattaMet=1;setTimeout(()=>toast('Natta, die Mutter der Schlangen!'),300);}}
function natDie(){NAT.st='dead';NAT.t=0;FLAGS.nattaDead=1;FLAGS.nattaHp=0;natBarTick();natBar(false);natHiss(1);gainXP(400);Snd.levelUp();toast('Natta ist besiegt! Der Dschungel atmet auf.');
  const y=getHeight(NAT.x,NAT.z)+.5;spawnDrop('nattaskin',3,NAT.x,y,NAT.z);spawnDrop('nattafang',1,NAT.x,y,NAT.z);spawnDrop('meat',6,NAT.x,y,NAT.z);
  for(let k=0;k<60;k++)spawnParticle(NAT.x+(Math.random()-.5)*4,y+Math.random()*2,NAT.z+(Math.random()-.5)*4,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,0x66862c,1.4,.35);saveGame();}
// ---------- Kampf ----------
function natAttack(dt){const dp=Math.hypot(P.x-NAT.x,P.z-NAT.z),frac=NAT.hp/NAT.max,ph=frac<.3?3:frac<.6?2:1,fast=ph===3?1.35:1;NAT.phase=ph;
  if(NAT.act){const A=NAT.act;A.t-=dt;
    switch(A.k){
      case'wind':NAT.lift=Math.min(2.2,NAT.lift+dt*4);natMove(NAT.x-NAT.hdx*.1,NAT.z-NAT.hdz*.1,1,dt);NAT.mouth=1;if(A.t<=0){NAT.act={k:'lunge',t:.42/fast,tx:P.x,tz:P.z,hit:false};natHiss(.8);}break;
      case'lunge':{natMove(A.tx,A.tz,20*fast,dt);NAT.lift=Math.max(.6,NAT.lift-dt*6);if(!A.hit&&Math.hypot(P.x-NAT.x,P.z-NAT.z)<1.7&&Math.abs(P.y-natHeadY())<2.6){A.hit=true;takeDamage(26*(ph===3?1.25:1));P.poisonT=Math.max(P.poisonT||0,6);toast('Nattas Giftbiss!');Snd.bite();const k=Math.max(dp,.1);P.vx+=(P.x-NAT.x)/k*6;P.vz+=(P.z-NAT.z)/k*6;P.vy=Math.max(P.vy,3.5);P.ground=false;}
        if(A.t<=0){NAT.act={k:'rest',t:1.1/fast};NAT.mouth=0;}break;}
      case'rest':NAT.lift=Math.max(0,NAT.lift-dt*2);if(A.t<=0)NAT.act=null;break;
      case'spit':NAT.mouth=1;NAT.lift=Math.min(1.6,NAT.lift+dt*3);A.n=(A.n||0);A.cd=(A.cd||0)-dt;if(A.cd<=0&&A.n<(ph>1?5:3)){A.cd=.22;A.n++;const ang=Math.atan2(P.z-NAT.z,P.x-NAT.x)+(A.n-2)*.16,sp=15,hy=natHeadY()+.4;
          NAT.shots.push({x:NAT.x,y:hy,z:NAT.z,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:(P.y+1-hy)/(dp/sp+.01)+2,t:0});natHiss(.4);}if(A.t<=0){NAT.act={k:'rest',t:.6};NAT.mouth=0;}break;
      case'sweep':{// Schwanz peitscht im Kreis: Wer nahe am Körper steht, wird weggeschleudert
        A.a=(A.a||0)+dt*5.2*fast;const cx=A.cx,cz=A.cz,r=A.r;natMove(cx+Math.cos(A.a0+A.a)*r,cz+Math.sin(A.a0+A.a)*r,25,dt);
        if(!A.hit){for(let i=8;i<NAT.segN;i+=2){const[sx,sz]=natSegPos(i);if(Math.hypot(P.x-sx,P.z-sz)<natRad(i)+.9&&P.y<getHeight(sx,sz)+2.2){A.hit=true;takeDamage(18*(ph===3?1.2:1));const k=Math.max(Math.hypot(P.x-sx,P.z-sz),.1);P.vx+=(P.x-sx)/k*11;P.vz+=(P.z-sz)/k*11;P.vy=Math.max(P.vy,5);P.ground=false;toast('Der Schwanz trifft dich!');break;}}}
        if(A.t<=0)NAT.act={k:'rest',t:.8};break;}
      case'coil':{// Natta legt sich um dich. Raus aus dem Ring, bevor sie zudrückt!
        A.a=(A.a||0)+dt*2.4*fast;const r=Math.max(2.6,5.4-A.a*.5);natMove(A.cx+Math.cos(A.a0+A.a)*r,A.cz+Math.sin(A.a0+A.a)*r,30,dt);NAT.lift=.4;
        if(!A.warned){A.warned=1;toast('Natta windet sich um dich! Raus aus dem Ring!');}
        if(A.t<=0){if(Math.hypot(P.x-A.cx,P.z-A.cz)<r+.4){takeDamage(42*(ph===3?1.2:1));toast('Natta drückt zu!');Snd.crack();}NAT.act={k:'rest',t:1.2};}break;}
      case'dive':NAT.lift=Math.max(-3,NAT.lift-dt*5);if(A.t<=0){NAT.st='under';NAT.act={k:'tunnel',t:1.6/fast};for(let k=0;k<25;k++)spawnParticle(NAT.x,getHeight(NAT.x,NAT.z)+.2,NAT.z,(Math.random()-.5)*4,2+Math.random()*3,(Math.random()-.5)*4,0x3a2a1a,1,.3);}break;
      case'tunnel':{if(!A.tx){A.tx=P.x;A.tz=P.z;}A.tx+=(P.x-A.tx)*Math.min(1,dt*2);A.tz+=(P.z-A.tz)*Math.min(1,dt*2);NAT.rip={x:A.tx,z:A.tz,t:A.t};
        if(Math.random()<dt*20)spawnParticle(A.tx+(Math.random()-.5)*3,getHeight(A.tx,A.tz)+.1,A.tz+(Math.random()-.5)*3,(Math.random()-.5),1.5+Math.random()*2,(Math.random()-.5),0x3a2a1a,.6,.25);
        if(A.t<=0){NAT.x=A.tx;NAT.z=A.tz;NAT.trail=[];for(let i=0;i<70;i++)NAT.trail.push({x:A.tx-NAT.hdx*i*.4,z:A.tz-NAT.hdz*i*.4});NAT.st='fight';NAT.rip=null;NAT.lift=2.6;NAT.mouth=1;
          for(let k=0;k<45;k++)spawnParticle(A.tx+(Math.random()-.5)*2.5,getHeight(A.tx,A.tz)+.2,A.tz+(Math.random()-.5)*2.5,(Math.random()-.5)*6,3+Math.random()*5,(Math.random()-.5)*6,Math.random()<.6?0x3a2a1a:0x506c22,1.2,.35);
          try{Snd.crash();}catch(e){}if(Math.hypot(P.x-A.tx,P.z-A.tz)<3.2){takeDamage(30*(ph===3?1.2:1));P.vy=Math.max(P.vy,7);P.ground=false;toast('Natta bricht unter dir hervor!');}NAT.act={k:'rest',t:1};}break;}}
    return;}
  // neue Aktion wählen
  NAT.cd-=dt;NAT.lift=Math.max(.3,NAT.lift-dt);NAT.mouth=0;
  const keep=4.2;if(dp>keep+1.5)natMove(P.x,P.z,(ph===3?5.2:4.2),dt);else if(dp<keep-1.2)natMove(NAT.x+(NAT.x-P.x),NAT.z+(NAT.z-P.z),2.5,dt);else{const a=Math.atan2(NAT.z-P.z,NAT.x-P.x)+dt*.5;natMove(P.x+Math.cos(a)*keep,P.z+Math.sin(a)*keep,3,dt);}
  if(NAT.cd>0)return;const r=Math.random();NAT.cd=(ph===3?.8:1.3)+Math.random()*.8;
  if(dp>11){NAT.act={k:'spit',t:1.3};return;}
  if(ph>=2&&r<.18){NAT.act={k:'dive',t:.7};natHiss(.9);return;}
  if(ph>=2&&r<.36&&dp<7){NAT.act={k:'coil',t:3.2/fast,cx:P.x,cz:P.z,a0:Math.atan2(NAT.z-P.z,NAT.x-P.x)};return;}
  if(ph===3&&r<.46&&!NAT.summoned){NAT.summoned=1;toast('Natta ruft ihre Brut!');natHiss(1);for(let k=0;k<3;k++){const a=Math.random()*6.283,x=NAT.x+Math.cos(a)*5,z=NAT.z+Math.sin(a)*5;if(wLand('snake',x,z)){const g=wGroup('snake',x,z,30,1,1);g.respawnT=1e9;const m=wSpawn(g,'snake',x,z);if(m)m.brood=1;}}return;}
  if(r<.62){NAT.act={k:'wind',t:.75/fast};return;}
  if(r<.8&&dp<8){NAT.act={k:'sweep',t:1.4/fast,cx:P.x+(NAT.x-P.x)*.4,cz:P.z+(NAT.z-P.z)*.4,r:4.5,a0:Math.atan2(NAT.z-P.z,NAT.x-P.x)};natHiss(.7);return;}
  NAT.act={k:'spit',t:1.2};}
function natShots(dt){for(let i=NAT.shots.length-1;i>=0;i--){const s=NAT.shots[i];s.t+=dt;s.vy-=14*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;
  if(Math.hypot(P.x-s.x,P.z-s.z)<.9&&s.y>P.y-.2&&s.y<P.y+2.2){takeDamage(10);P.poisonT=Math.max(P.poisonT||0,5);toast('Gift!');NAT.shots.splice(i,1);continue;}
  const g=getHeight(s.x,s.z);if(s.y<g||s.t>3){for(let k=0;k<8;k++)spawnParticle(s.x,g+.1,s.z,(Math.random()-.5)*2,1+Math.random(),(Math.random()-.5)*2,0x4aa020,.6,.25);NAT.shots.splice(i,1);}}}
// ---------- Alltag: verstecken, wandern, an Reisenden vorbeikriechen ----------
function natPickNext(){const S=NAT.spots,inJ=P.x>JX0-40&&P.x<JX1+40&&P.z<JZ1+40&&P.z>JZ0-40&&P.x<60000;let best=null,bs=1e9;
  S.forEach((s,i)=>{if(i===NAT.spot)return;let sc=Math.hypot(s.x-NAT.x,s.z-NAT.z)*.01+Math.random();
    if(inJ){// kreuzt der Weg den Spieler in 12 bis 30 m Abstand?
      const ax=NAT.x,az=NAT.z,bx=s.x,bz=s.z,l2=(bx-ax)**2+(bz-az)**2,t=clamp(((P.x-ax)*(bx-ax)+(P.z-az)*(bz-az))/Math.max(l2,1),0,1),d=Math.hypot(ax+(bx-ax)*t-P.x,az+(bz-az)*t-P.z);
      if(d>12&&d<32&&t>.15&&t<.85)sc-=3;}
    if(sc<bs){bs=sc;best=i;}});return best==null?0:best;}
function updateNatta(dt){if(!NAT.init){if(typeof JX0==='undefined'||!decorMat||!fchunks.length)return;nattaInit();}if(NAT.st==='gone')return renderNatta(dt);
  dt=Math.min(dt,.1);const run=state==='playing'||state==='inventory';if(!run)return renderNatta(dt);const near=Math.hypot(P.x-NAT.x,P.z-NAT.z),sneak=down('sneak');if(NAT.hurt>0)NAT.hurt-=dt;
  if(P.poisonT>0&&!wInit){P.poisonT-=dt;P.poisonAcc=(P.poisonAcc||0)+dt;if(P.poisonAcc>=1){P.poisonAcc=0;takeDamage(1);}}
  switch(NAT.st){
    case'hide':{NAT.t-=dt;NAT.lift=-3;if(NAT.hp<NAT.max){NAT.hp=Math.min(NAT.max,NAT.hp+NAT.max*.004*dt);FLAGS.nattaHp=NAT.hp;}
      if(P.x<60000&&near<(sneak?5.5:10)&&!cheatOn()&&state==='playing'){natStartFight();break;}
      if(near<40&&Math.random()<dt*.3)spawnParticle(NAT.x+(Math.random()-.5)*2,getHeight(NAT.x,NAT.z)+.05,NAT.z+(Math.random()-.5)*2,0,.6,0,0x6a5a3a,.8,.2);
      if(NAT.t<=0){NAT.spot=natPickNext();NAT.st='rise';NAT.t=2;natHiss(.5);}break;}
    case'rise':NAT.lift=Math.min(.3,NAT.lift+dt*2);NAT.t-=dt;if(NAT.t<=0)NAT.st='roam';break;
    case'roam':{const s=NAT.spots[NAT.spot];const left=natMove(s.x,s.z,2.6,dt);NAT.lift=.3+Math.sin(time*2)*.08;
      if(P.x<60000&&near<9&&!cheatOn()&&state==='playing'){NAT.st='warn';NAT.t=2.2;natHiss(1);toast('Eine Riesenschlange! Weich zurück …');break;}
      if(left<1){NAT.st='submerge';NAT.t=1.6;}break;}
    case'warn':{NAT.t-=dt;NAT.lift=Math.min(2.4,NAT.lift+dt*3);NAT.mouth=1;const a=Math.atan2(P.z-NAT.z,P.x-NAT.x);NAT.hdx=Math.cos(a);NAT.hdz=Math.sin(a);
      if(NAT.t<=0){NAT.mouth=0;if(near<7.5)natStartFight();else NAT.st='roam';}break;}
    case'submerge':NAT.t-=dt;NAT.lift-=dt*2.5;if(NAT.t<=0){NAT.st='hide';NAT.t=300+Math.random()*420;}break;
    case'emerge':NAT.t-=dt;NAT.lift=Math.min(2.6,NAT.lift+dt*3);NAT.mouth=1;if(NAT.t<=0){NAT.st='fight';NAT.mouth=0;}break;
    case'fight':case'under':{if(state==='dead'||near>55||P.x>60000){NAT.st='retreat';NAT.act=null;NAT.rip=null;natBar(false);NAT.spot=natPickNext();break;}natAttack(dt);natBarTick();break;}
    case'retreat':{const s=NAT.spots[NAT.spot];const left=natMove(s.x,s.z,4,dt);NAT.lift=Math.max(.3,NAT.lift-dt);if(left<1){NAT.st='submerge';NAT.t=1.6;}if(near<8&&!cheatOn()&&state==='playing')natStartFight();break;}
    case'dead':NAT.t+=dt;if(NAT.t>8)NAT.st='gone';break;}
  natShots(dt);renderNatta(dt);}
function renderNatta(dt){const M=NAT.mesh;if(!M)return;const g=M.geometry.attributes,cx=camera.position.x,cz=camera.position.z;
  if(NAT.st==='gone'||P.x>60000||Math.hypot(NAT.x-cx,NAT.z-cz)>(settings.renderDist||140)+40){M.geometry.instanceCount=0;return;}
  let n=0;const put=(x,y,z,w,h,spr,flip,tint)=>{const s=SPR[spr];if(!s||n>=64)return;g.offset.array[n*3]=x;g.offset.array[n*3+1]=y;g.offset.array[n*3+2]=z;g.size.array[n*2]=w;g.size.array[n*2+1]=h;
    g.uvr.array[n*4]=flip?s.u+s.du:s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=flip?-s.du:s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=tint;g.rot.array[n]=0;n++;};
  const hurt=NAT.hurt>0?-1.3:1,dead=NAT.st==='dead',sinkK=dead?Math.min(1,NAT.t/6):0;
  if(NAT.st==='hide'){const gy=getHeight(NAT.x,NAT.z);const blink=(time%5)<.15;if(!blink)put(NAT.x,gy+.02,NAT.z,.62,.24,'natta_eyes',false,1.6);}
  else if(NAT.st!=='under'){const lift=NAT.lift,rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);
    for(let i=NAT.segN-1;i>=0;i--){const[x,z]=natSegPos(i),r=natRad(i),gy=getHeight(x,z),k=Math.max(0,1-i/5),y=gy-r*.35+Math.max(-r*2,lift)*k*k-sinkK*r*1.6-(lift<0?(-lift)*(1-k*.5):0);if(y+r*2<gy-.1)continue;
      put(x,y,z,r*2.1,r*2,'natta_b'+((i%3===1)?1:0),false,(dead?.7:1)*(hurt<0&&i<6?hurt:1));}
    const gy=getHeight(NAT.x,NAT.z),hy=gy+Math.max(-1.6,lift)-.15-sinkK*1.4,fl=(NAT.hdx*rx+NAT.hdz*rz)<0;put(NAT.x+NAT.hdx*.5,hy,NAT.z+NAT.hdz*.5,2.5,1.56,NAT.mouth?'natta_h1':'natta_h0',fl,dead?.7:hurt);}
  for(const s of NAT.shots)put(s.x,s.y-.25,s.z,.5,.5,'natta_spit',false,1.5);
  if(NAT.rip){const gy=getHeight(NAT.rip.x,NAT.rip.z);put(NAT.rip.x,gy+.02,NAT.rip.z,3.2,.5,'nattashed',false,.8);}
  M.geometry.instanceCount=n;g.offset.needsUpdate=g.size.needsUpdate=g.uvr.needsUpdate=g.tint.needsUpdate=g.rot.needsUpdate=true;}
{const u1=updateAnimals;updateAnimals=function(dt){u1(dt);try{updateNatta(dt);}catch(e){if(!updateNatta.err){updateNatta.err=1;console.error('Natta',e);}}};}
// Treffer: Kopf oder der nächste Körperteil vor dem Spieler
{const ft1=frontTargets;frontTargets=function(range,cone){const out=ft1(range,cone);if(!NAT.init||NAT.st==='hide'||NAT.st==='under'||NAT.st==='dead'||NAT.st==='gone'||P.x>60000)return out;
  const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);let best=null,bd=1e9;const test=(x,z,y,r,part)=>{const dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz);if(d>range+r)return;if(d>.3&&(dx*fx+dz*fz)/d<cone-.15)return;if(Math.abs(y+r-(P.y+P.eye*.6))>r+2)return;if(d<bd){bd=d;best={x,z,y,h:r*2,w:r*2,kind:'natta',part};}};
  test(NAT.x,NAT.z,natHeadY()-.6,.9,'head');for(let i=0;i<NAT.segN;i+=1){const[x,z]=natSegPos(i),r=natRad(i);test(x,z,getHeight(x,z)-r*.35,r,'body');}
  if(best)out.push(best);return out;};}
{const ha1=hurtAny;hurtAny=function(a,n){if(a&&a.kind==='natta'){nattaHurt(n,a.part);return;}return ha1(a,n);};}
{const dn1=dangerNear;dangerNear=function(){if(natFight())return true;return dn1();};}
// Speichern: Leben merken; Natta wird nach dem Laden neu aufgebaut
{const sg1=startGame;startGame=function(isNew,char){sg1(isNew,char);try{if(NAT.init){NAT.st=FLAGS.nattaDead?'gone':'hide';NAT.hp=FLAGS.nattaHp!=null&&!FLAGS.nattaDead?FLAGS.nattaHp:NAT.max;NAT.act=null;NAT.shots.length=0;NAT.rip=null;}}catch(e){}};}
// Uka-Uka belohnt den Sieg über Natta
{const U=DIALOGS['Uka-Uka'];if(U){const h0=U.nodes.hello;U.nodes.hello=()=>{const n=h0();if(FLAGS.nattaDead&&!FLAGS.nattaReward){n.text='Uk! UK! Du hast Natta getötet?! Der ganze Stamm singt dein Lied! Nimm das: Bananen, so viele du tragen kannst.';
      n.opts.unshift({label:'Danke, Uka-Uka.',act:()=>{FLAGS.nattaReward=1;const left=addItem('banana',40);if(left)spawnDrop('banana',left,P.x,P.y+1,P.z);Snd.coin();return null;},go:'hello'});}return n;};}}
Object.assign(TP,{natta:{n:'Nattas Revier',p:()=>{nattaInit();const s=NAT.spots[0];return[s.x+16,s.z+6];},yaw:0}});HELP[0][1]+=', natta';
