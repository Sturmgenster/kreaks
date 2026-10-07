/* =========================================================
   V60 · Mehr Leben in der Savanne: Gnus, Büffel, Warzenschweine, Paviane,
   Geparden und Wildhunde; mehr und größere Herden; ein zweites Löwenrudel;
   und ein Tag-Nacht-Rhythmus für alle Tiere.
   ========================================================= */
Object.assign(WPAL,{gn:pal(['#2a2624','#3e3834','#56504a','#6e6760','#86807a']),bf:pal(['#141210','#221e1c','#322c28','#443c36','#564c44']),
  wh:pal(['#4a3e36','#62564c','#7c6e62','#968878']),ch:pal(['#9a6a2a','#c08a3a','#dcaa52','#ecc674','#f6dc9a']),wd:pal(['#3a2a1a','#6a4a24','#9a7034','#c89a52']),
  ba:pal(['#3e3a28','#565236','#706a46','#8a8458','#a49e6e'])});
function wGnu(f){const p=new Px(50,40),s=wStride(f),gr=f==='e',ly=f==='l',P=WPAL.gn,o=ly?8:0;const str=(x,y)=>x>24&&((x+Math.floor(y*.4))%4===0)?P[0]:null;
  const leg=(X,Y,k)=>k>10?W_BK:null;
  if(!ly){wLeg(p,11,22,13,3,2,P,s*2,leg);wLeg(p,29,21,14,3,2,P,-s*2,leg);}
  for(let k=0;k<10;k++){const t=k/9;wEll(p,11+t*20,19+o-t*3.5,7+t*1.4,6+t*1.1,P,str);}
  if(!ly){wLeg(p,14,22,13,3,2,P,-s*1.5,leg);wLeg(p,32,21,14,3,2,P,s*1.5,leg);}else for(const lx of[10,28])wLeg(p,lx,23+o-2,3,8,8,P,0);
  const hx=42,hy=gr?28:13;for(let k=0;k<7;k++){const t=k/6;wEll(p,32+t*(hx-32),11+o+t*(hy-11),3.4-t*.5,3.4,P);}
  wEll(p,hx+1,hy+o,3,4.6,P);wEll(p,hx+1.6,hy+4+o,2.3,2.3,WPAL.zb);p.set(hx,hy-1+o,W_EYE);
  for(let k=0;k<8;k++){const t=k/7;p.set(31+t*(hx-32),9+o-t*(gr?-14:2),W_BK);}for(let k=0;k<6;k++)p.set(hx-2,hy+3+k*.8+o,W_BK);
  for(const[dx,dy]of[[-2,-4],[-3,-5],[-4,-6],[-4,-7],[-3,-8],[2,-4],[3,-5],[4,-6],[4,-7],[3,-8]])p.set(hx+1+dx*.8,hy+dy+o,hex('#9a9488'));
  for(let k=0;k<11;k++)p.set(6-k*.25,14+o+k,k>6?W_BK:P[1]);outline(p);return p.done();}
function wBuffalo(f){const p=new Px(58,38),s=wStride(f),P=WPAL.bf,gr=f==='e',a=f==='a';
  wLeg(p,11,23,12,5,4,P,s*2);wLeg(p,35,22,13,5,4,P,-s*2);for(let k=0;k<8;k++){const t=k/7;wEll(p,13+t*20,19-t*2,9+t*2,8.5+t*1.2,P);}
  wLeg(p,15,23,12,5,4,P,-s*1.6);wLeg(p,39,22,13,5,4,P,s*1.6);
  const hx=46,hy=gr?27:a?17:21;wEll(p,hx,hy,6,6,P);wEll(p,hx+4,hy+3,3.4,3,P);p.set(hx+6,hy+3,W_BK);p.set(hx,hy-1,W_EYE);
  // Hornplatte und geschwungene Hörner
  const HC=pal(['#5a564e','#8a8478','#b8b2a4']);for(let x=hx-5;x<=hx+3;x++){p.set(x,hy-5,HC[1]);p.set(x,hy-6,HC[2]);}
  for(let k=0;k<10;k++){const t=k/9,yy=hy-5+t*5-t*t*9;for(const w of[0,1]){p.set(hx-5-t*6,yy+w,HC[w?0:1]);p.set(hx+3+t*6,yy+w,HC[w?1:2]);}}
  for(let k=0;k<9;k++)p.set(6-k*.2,15+k,k>7?W_BK:P[2]);outline(p);return p.done();}
function wWarthog(f){const p=new Px(30,20),s=wStride(f),gr=f==='e',P=WPAL.wh;
  wLeg(p,7,12,6,2,2,P,s*1.5);wLeg(p,17,12,6,2,2,P,-s*1.5);wEll(p,13,10,8,4.6,P);wLeg(p,9,12,6,2,2,P,-s);wLeg(p,19,12,6,2,2,P,s);
  const hx=23,hy=gr?14:9;wEll(p,hx,hy,4.4,3.6,P);wEll(p,hx+3.5,hy+1.5,2,1.8,P);p.set(hx+5,hy+1,W_BK);p.set(hx,hy-1,W_EYE);p.set(hx+2,hy-1,P[0]);
  for(const[dx,dy]of[[3,3],[4,2],[5,1],[5,0]])p.set(hx+dx,hy+dy,W_TUSK);for(let x=8;x<20;x++)if(x%2)p.set(x,5,hex('#2a2018'));
  for(let k=0;k<7;k++)p.set(5-k*.15,8-k,k>5?W_BK:P[1]);outline(p);return p.done();}
function wCheetah(f){const p=new Px(52,28),s=wStride(f),ly=f==='l',a=f==='a',P=WPAL.ch,o=ly?6:0;const sp=(x,y)=>hash2(x,y,131)<.16&&((x+y)&1)&&y<20+o?hex('#3a2410'):null;
  if(!ly&&!a){wLeg(p,12,16,11,2,1,P,s*3,sp);wLeg(p,31,15,12,2,1,P,-s*3,sp);}
  if(a){wLeg(p,8,15,10,2,1,P,-5);wLeg(p,36,13,11,2,1,P,6);}
  for(let k=0;k<8;k++){const t=k/7;wEll(p,13+t*18,13+o-t*.8+(a?Math.sin(t*3.1)*-1.5:0),5.4,4,P,sp);}
  if(!ly&&!a){wLeg(p,15,16,11,2,1,P,-s*2.6,sp);wLeg(p,34,15,12,2,1,P,s*2.6,sp);}if(ly){wLeg(p,32,19,2,8,8,P,0);wLeg(p,9,19,2,8,8,P,0);}
  if(a){wLeg(p,11,15,10,2,1,P,-4);wLeg(p,38,13,11,2,1,P,7);}
  const hx=a?42:40,hy=(a?10:8)+o;wEll(p,hx,hy,3.6,3.2,P);wEll(p,hx+3,hy+1,2,1.6,P);p.set(hx+5,hy+1,W_BK);p.set(hx+1,hy-1,W_EYE);p.set(hx+1,hy,W_BK);p.set(hx+1,hy+1,W_BK);p.set(hx-2,hy-3,P[1]);
  for(let k=0;k<16;k++){const t=k/15;p.set(8-k*.5,12+o+Math.sin(t*2.6)*4,k%3===2?W_BK:P[2]);}p.set(0,15+o,W_WH);outline(p);return p.done();}
function wWilddog(f){const p=new Px(40,26),s=wStride(f),ly=f==='l',a=f==='a',P=WPAL.wd,o=ly?6:0;const mot=(x,y)=>{const h=hash2(x>>1,y>>1,141);return h<.25?W_BK:h<.42?hex('#e8dcc0'):null;};
  if(!ly){wLeg(p,10,15,9,2,1,P,s*2,mot);wLeg(p,24,14,10,2,1,P,-s*2,mot);}
  for(let k=0;k<7;k++){const t=k/6;wEll(p,11+t*14,12+o-t*.8,5,4,P,mot);}
  if(!ly){wLeg(p,12,15,9,2,1,P,-s*1.8,mot);wLeg(p,26,14,10,2,1,P,s*1.8,mot);}else{wLeg(p,26,16,2,7,7,P,0);wLeg(p,8,16,2,7,7,P,0);}
  const hx=31,hy=(a?8:7)+o;wEll(p,hx,hy,3.4,3,P);wEll(p,hx+3,hy+1.4,2.2,1.6,WPAL.zb);p.set(hx,hy-1,W_EYE);
  for(const dx of[-2,0])for(let k=0;k<4;k++)p.set(hx+dx,hy-3-k,k>2?P[0]:P[2]);if(a){for(let x=hx+2;x<hx+6;x++)p.set(x,hy+3,W_RED);}
  for(let k=0;k<8;k++)p.set(6-k*.6,11+o+k*.5,k>5?W_WH:P[1]);outline(p);return p.done();}
function wBaboon(f){const p=new Px(30,24),s=wStride(f),P=WPAL.ba;
  wLeg(p,8,13,8,2,2,P,s*1.6);wLeg(p,18,11,10,2,2,P,-s*1.6);for(let k=0;k<6;k++){const t=k/5;wEll(p,10+t*10,12-t*2.5,5,4.2,P);}wLeg(p,10,13,8,2,2,P,-s);wLeg(p,20,11,10,2,2,P,s);
  const hx=24,hy=7;wEll(p,hx,hy,3.6,3.4,P);wEll(p,hx+3.4,hy+1.6,2.6,1.8,pal(['#5a3a3a','#7a5050','#9a6a6a']));p.set(hx+1,hy-1,W_EYE);p.set(hx-2,hy-2,P[3]);
  for(let k=0;k<10;k++){const t=k/9;p.set(6-k*.4,11-Math.sin(t*3)*5+t*4,P[1]);}outline(p);return p.done();}
Object.assign(WILD_FR,{gnu:[0,1,2,'e','l'],buffalo:[0,1,2,'e','a'],warthog:[0,1,2,'e'],cheetah:[0,1,2,'l','a'],wilddog:[0,1,2,'l','a'],baboon:[0,1,2]});
{const wd0=wildDraw;wildDraw=function(t,f){switch(t){case'gnu':return wGnu(f);case'buffalo':return wBuffalo(f);case'warthog':return wWarthog(f);case'cheetah':return wCheetah(f);case'wilddog':return wWilddog(f);case'baboon':return wBaboon(f);}return wd0(t,f);};}
Object.assign(WSP,{gnu:{n:'Gnu',h:1.45,spd:1.3,run:11,hp:110,herb:1,fleeR:16,meat:3,xp:12,loot:'fur',prey:1},
  buffalo:{n:'Büffel',h:1.65,spd:1,run:8.5,hp:380,herb:1,fleeR:0,meat:6,xp:38,loot:'horn',defend:1,dmg:24,prey:.35},
  warthog:{n:'Warzenschwein',h:.8,spd:1.2,run:9,hp:50,herb:1,fleeR:12,meat:2,xp:7,prey:1},
  baboon:{n:'Pavian',h:.85,spd:1.4,run:8,hp:45,herb:1,fleeR:12,meat:1,xp:6,prey:.6},
  cheetah:{n:'Gepard',h:.95,spd:1.3,run:19,hp:110,pred:1,meat:2,xp:28,loot:'fur',dmg:12},
  wilddog:{n:'Wildhund',h:.82,spd:1.6,run:13,hp:60,pred:1,meat:1,xp:12,loot:'fur',dmg:8}});
LION_PREY.push('gnu','buffalo','warthog');
// ---------- Uhrzeit für Tiere ----------
const wHour=()=>((FLAGS.clock||600)/60);
const wNight=()=>{const h=wHour();return h<5.4||h>20.4;};
// ---------- Neue und zusätzliche Gruppen ----------
function initWildV60(){const H=(sp,x,z,r,mn,mx,ex)=>{if(!wLand(sp,x,z)){let ok=false;for(let t=0;t<20&&!ok;t++){const a=Math.random()*6.283,d=10+Math.random()*60;if(wLand(sp,x+Math.cos(a)*d,z+Math.sin(a)*d)){x+=Math.cos(a)*d;z+=Math.sin(a)*d;ok=true;}}if(!ok)return null;}
    const g=wGroup(sp,x,z,r,mn,mx,ex);const n=mn+Math.floor(Math.random()*(mx-mn+1));for(let i=0;i<n;i++){const q=wPickNear(g,x,z,sp==='gnu'?22:14);if(q)wSpawn(g,sp,q[0],q[1]);}return g;};
  // Große Gnuherden wandern weit
  H('gnu',1350,500,380,14,22);H('gnu',1700,300,380,14,22);H('gnu',1500,820,360,12,20);H('gnu',1950,700,300,12,18);
  H('zebra',1250,250,240,8,13);H('zebra',1850,450,240,7,12);H('zebra',1380,700,220,7,12);
  H('gazelle',1600,640,220,8,13);H('gazelle',1150,450,200,7,12);
  H('giraffe',1300,300,260,3,5);H('giraffe',1980,380,220,3,5);H('elephant',1950,900,240,5,8);
  H('buffalo',1500,400,230,9,14);H('buffalo',1820,620,230,8,13);H('buffalo',1250,850,220,8,12);
  H('rhino',1700,950,150,1,2);H('ostrich',1550,200,200,3,6);
  for(const[x,z]of[[1260,560],[1480,640],[1640,420],[1880,760],[2000,300],[1350,950]])H('warthog',x,z,90,3,6);
  for(const[x,z]of[[1300,420],[1560,520],[1850,880]])H('baboon',x,z,110,8,13,{rock:{x,z}});
  for(const[x,z]of[[1180,320],[2060,620]]){const g=wGroup('meerkat',x,z,13,6,11,{burrow:{x,z}});const n=6+(Math.random()*5|0);for(let i=0;i<n;i++)wSpawn(g,'meerkat',x+(Math.random()-.5)*8,z+(Math.random()-.5)*8);}
  // Zweites Löwenrudel am Kopje im Osten
  {const home={x:1985,z:522,c:1,s:0,kopje:1};home.lx=home.x+3;home.lz=home.z;const g=H('lion',home.x,home.z,420,4,6,{home,st:'rest',hunger:.4});
    if(g){const l=wAlive(g)||WM.filter(m=>m.g===g);if(l[0]){l[0].sp='lion';l[0].male=1;}for(let i=1;i<l.length;i++)l[i].sp='lioness';}}
  // Zweiter Hyänenclan
  {const g=wGroup('hyena',1125,705,380,4,6,{den:{x:1125,z:705},st:'rest',hunger:.5});for(let i=0;i<5;i++)wSpawn(g,'hyena',1125+(Math.random()-.5)*10,705+(Math.random()-.5)*10);}
  // Geparden (tagaktiv) und Wildhunde (Dämmerung)
  for(const[x,z]of[[1420,560],[1760,860]]){const g=wGroup('cheetah',x,z,320,1,2,{st:'rest',hunger:.5,lair:{x,z}});for(let i=0;i<2;i++)wSpawn(g,'cheetah',x+(Math.random()-.5)*6,z+(Math.random()-.5)*6);}
  for(const[x,z]of[[1460,300],[1900,560]]){const g=wGroup('wilddog',x,z,420,6,9,{st:'rest',hunger:.5,lair:{x,z}});for(let i=0;i<7;i++)wSpawn(g,'wilddog',x+(Math.random()-.5)*10,z+(Math.random()-.5)*10);}
  {const g=wGroup('vulture',1450,820,520,4,7,{st:'circle'});for(let i=0;i<5;i++)wSpawn(g,'vulture',1450+(Math.random()-.5)*60,820+(Math.random()-.5)*60,{ang:Math.random()*6.283,alt:28+Math.random()*12,rad:18+Math.random()*16});}
  for(const t in WSP){const s=SPR['w_'+t+'_0'];if(s&&!WSCALE[t])WSCALE[t]=WSP[t].h/s.h;}}
{const iw0=initWild;initWild=function(){const was=wInit;iw0();if(!was&&wInit)try{initWildV60();}catch(e){console.error('wild60',e);}};}
// ---------- Pflanzenfresser: nachts schlafen, eng beieinander ----------
{const h0=wHerd;wHerd=function(g,list,dt){if(g.sp==='cheetah'||g.sp==='wilddog')return wPack(g,list,dt);const night=wNight();
  if(night&&g.flee<=0&&!g.drink){g.t=Math.max(g.t,3);}
  if(night!==g.sleep){g.sleep=night;if(night&&g.sp!=='monkey'){g.tx=g.cx;g.tz=g.cz;g.drink=0;}for(const m of list){if(m.ox0==null){m.ox0=m.ox;m.oz0=m.oz;}m.ox=m.ox0*(night?.4:1);m.oz=m.oz0*(night?.4:1);}}
  h0(g,list,dt);
  if(night&&g.flee<=0){const lie=WILD_FR[g.sp]&&WILD_FR[g.sp].includes('l');for(const m of list)if(m.st==='graze'||m.st==='idle'){m.st=lie&&((m.ox0||0)*13%1+1)%1<.75?'lie':'idle';}}};}
// Nilpferde grasen nachts am Ufer
{const hp0=wHippoAI;wHippoAI=function(m,g,dt){if(!wNight())return hp0(m,g,dt);const R=SRIVERS[g.river].p;if(!m.ri)m.ri=Math.floor(R.length*.5);const c=R[clamp(m.ri,0,R.length-1)];
  if(m.gx==null||Math.random()<dt*.02){for(let t=0;t<8;t++){const a=Math.random()*6.283,d=7+Math.random()*12,x=c[0]+Math.cos(a)*d,z=c[1]+Math.sin(a)*d;if(getHeight(x,z)>WATER+.3&&inFar(x,z)){m.gx=x;m.gz=z;break;}}}
  if(m.gx!=null&&Math.hypot(m.gx-m.x,m.gz-m.z)>1){const dx=m.gx-m.x,dz=m.gz-m.z,d=Math.hypot(dx,dz),st=Math.min(d,WSP.hippo.spd*dt);m.x+=dx/d*st;m.z+=dz/d*st;m.anim+=st;m.st='walk';}else m.st='idle';
  m.inWater=getHeight(m.x,m.z)<WATER-.3;};}
// Erdmännchen schlafen im Bau
{const mk0=wMeerkats;wMeerkats=function(g,list,dt){if(wNight())g.hide=Math.max(g.hide||0,3);mk0(g,list,dt);};}
// Affen schlafen in den Bäumen
{const mc0=wMonkeyClimb;wMonkeyClimb=function(m,dt){if(wNight()&&m.st==='climb')m.treeT=Math.max(m.treeT||0,4);mc0(m,dt);};}
{const h1=wHerd;wHerd=function(g,list,dt){h1(g,list,dt);if(g.sp==='monkey'&&wNight())for(const m of list){if(m.st!=='climb'&&m.st!=='totree'&&g.flee<=0){const tr=wTreeNear(m.x,m.z,30);if(tr){m.tree=tr;m.st='totree';}}}};}
// Geier landen nachts auf ihrem Schlafplatz
{const v0=wVultures;wVultures=function(g,list,dt){if(!wNight())return v0(g,list,dt);if(!g.roost){g.roost={x:g.x+(Math.random()-.5)*40,z:g.z+(Math.random()-.5)*40};}
  for(const m of list){const a=(m.rad||20)*.7,tx=g.roost.x+Math.cos(a)*2.5,tz=g.roost.z+Math.sin(a)*2.5;m.x+=(tx-m.x)*Math.min(1,dt*.5);m.z+=(tz-m.z)*Math.min(1,dt*.5);m.alt=Math.max(0,(m.alt||0)-6*dt);m.st=m.alt<.5?'perch':'fly';if(m.hurt>0)m.hurt-=dt;}};}
// ---------- Geparden und Wildhunde ----------
function wPack(g,list,dt){const S=WSP[g.sp],ch=g.sp==='cheetah',hr=wHour(),active=ch?(hr>7&&hr<18.5):((hr>5&&hr<9.5)||(hr>17&&hr<21.5)),C=ch?{prey:['gazelle','warthog','ostrich'],range:320}:{prey:['gazelle','gnu','zebra','warthog'],range:420};
  g.hunger=Math.min(1,g.hunger+dt/(ch?520:430));if(g.angry>0)g.angry-=dt;if(g.cool>0)g.cool-=dt;const fight=state==='playing'&&!cheatOn()&&!peaceNight()&&P.x<60000;
  if(g.st!=='hunt'&&g.st!=='feast'&&active&&g.hunger>.45&&(g.cool||0)<=0){const prey=wPickPrey(g,C.prey,C.range);if(prey){g.st='hunt';g.prey=prey;g.huntT=0;}}
  if(g.st==='hunt'){g.huntT+=dt;if(!wAlive(g.prey).length||g.huntT>130||(!active&&g.huntT>45)){g.st='rest';g.cool=90;}if(g.killed){g.corpse=g.killed;g.killed=null;g.st='feast';}}
  if(g.st==='feast'&&(!g.corpse||g.corpse.meat<=0||!WCORPSE.includes(g.corpse))){g.st='rest';g.corpse=null;g.hunger=Math.max(0,g.hunger-.7);}
  if(g.st==='rest'||g.st==='roam'){g.t-=dt;if(g.t<=0){g.t=40+Math.random()*60;const q=active?wPickIn(g):[g.lair.x+(Math.random()-.5)*30,g.lair.z+(Math.random()-.5)*30];if(q){g.tx=q[0];g.tz=q[1];}}}
  for(const m of list){m.cd-=dt;if(m.hurt>0)m.hurt-=dt;const dp=Math.hypot(P.x-m.x,P.z-m.z);
    if(fight&&ch&&dp<14&&!(g.angry>0)){const d=Math.max(dp,.1);wMove(m,m.x+(m.x-P.x)/d*8,m.z+(m.z-P.z)/d*8,S.run*.55,dt);m.st='run';continue;}
    const bold=fight&&(g.angry>0&&dp<40||(!ch&&(dp<5||(g.st==='feast'&&dp<9))));
    if(bold){if(dp>1.5)wMove(m,P.x,P.z,S.run*.85,dt);else if(m.cd<=0&&Math.abs(P.y-m.y)<2.2){m.cd=1.1;takeDamage(S.dmg);wSnd('growl',m.x,m.z);}m.st=dp>1.5?'chase':'atk';continue;}
    if(g.st==='feast'&&g.corpse){const c=g.corpse,d=wDist(m,c);if(d>1.6){wMove(m,c.x+m.ox*.12,c.z+m.oz*.12,S.run*.5,dt);m.st='walk';}else{m.st='eat';c.meat-=dt*.03;}continue;}
    if(g.st==='hunt'){wHuntMember(m,g,S,dt);continue;}
    const tx=(g.tx||g.x)+m.ox*.5,tz=(g.tz||g.z)+m.oz*.5,d=Math.hypot(tx-m.x,tz-m.z);m.t-=dt;
    if(d>3){wMove(m,tx,tz,S.spd*(d>40?1.8:1),dt);m.st='walk';}else if(m.t<=0){m.t=5+Math.random()*10;m.st=!active||Math.random()<.5?'lie':'idle';}}}
// ---------- Löwen: tagsüber dösen (mittags in der Höhle), in der Dämmerung brüllen, nachts jagen ----------
function prRoute2(m,tx,tz){if(Math.abs(m.x-PROCK.x)>130||Math.abs(m.z-PROCK.z)>130)return[tx,tz];const onLedge=prideLedgeTop(tx,tz)!=null,mOnLedge=prideLedgeTop(m.x,m.z)!=null;
  if(onLedge){if(mOnLedge||prideH(m.x,m.z)>PR.H*.55){return mOnLedge||prLocal(m.x,m.z)[0]>19?[tx,tz]:prWorld(22,0);}return prRoute(m,...prWorld(18,0));}
  if(mOnLedge&&prideH(tx,tz)<PR.H*.55)return prWorld(18,0);
  const on=prideH(m.x,m.z)>PR.H*.55||mOnLedge,tOn=prideH(tx,tz)>PR.H*.55;if(on!==tOn)return prRoute(m,tx,tz);
  if(!on){const mx=(m.x+tx)/2,mz=(m.z+tz)/2,[mu,mv]=prLocal(mx,mz);if(prFoot(mu,mv)<1.2){const side=(mv>=0?1:-1);return prWorld(clamp(mu,-PR.ru*1.3,PR.ru*1.3),side*PR.rv*1.7);}}
  return[tx,tz];}
wLions=function(g,list,dt){const hr=wHour(),night=hr<5.3||hr>20.4,dusk=(hr>=5.3&&hr<8)||(hr>18&&hr<=20.4),mid=hr>10.5&&hr<16.5;
  g.hunger=Math.min(1,g.hunger+dt/560);if(g.angry>0)g.angry-=dt;const home=g.home||PROCK,rock=home===PROCK;
  const nearP=Math.hypot(P.x-home.x,P.z-home.z);if(Math.random()<dt/((night||dusk)?45:150)&&nearP<320)wSnd('roar',home.x,home.z);
  const fight=state==='playing'&&!cheatOn()&&!peaceNight()&&P.x<60000,thr=night?.4:dusk?.6:.94;
  if(g.st==='rest'&&g.hunger>thr&&(g.cool||0)<=0){const prey=wPickPrey(g,LION_PREY,520);if(prey){g.st='hunt';g.prey=prey;g.huntT=0;g.fails=g.fails||0;}}
  if(g.cool>0)g.cool-=dt;
  if(g.st==='hunt'){g.huntT+=dt;const pl=wAlive(g.prey);if(!pl.length||g.huntT>150){g.st='rest';g.cool=60;}}
  if(g.st==='feast'){const c=g.corpse;if(!c||c.meat<=0||!WCORPSE.includes(c)){g.st='rest';g.hunger=0;g.fails=0;}}
  for(const m of list){const S=WSP[m.sp];m.cd-=dt;if(m.hurt>0)m.hurt-=dt;const dp=Math.hypot(P.x-m.x,P.z-m.z);
    if(fight&&(g.angry>0&&dp<55||dp<(m.st==='lie'?5:7)||(m.st==='chase'&&m.tgt==='player'))){m.st='chase';m.tgt='player';
      if(dp>1.7){wMove(m,P.x,P.z,S.run*.9,dt);}else{m.st='atk';if(m.cd<=0&&Math.abs(P.y-m.y)<2.4){m.cd=1.3;takeDamage(S.dmg);wSnd('growl',m.x,m.z);const k=Math.max(dp,.1);P.vx+=(P.x-m.x)/k*3;P.vz+=(P.z-m.z)/k*3;}}
      if(dp>60&&g.angry<=0){m.st='idle';m.tgt=null;}continue;}
    if(m.tgt==='player'){m.tgt=null;m.st='idle';}
    if(dp<12&&m.st==='lie'&&Math.random()<dt*.5)wSnd('growl',m.x,m.z);
    if(g.st==='feast'&&g.corpse){const c=g.corpse,d=wDist(m,c);if(d>1.8+(m.male?0:Math.abs(m.ox)*.2)){wMove(m,c.x+m.ox*.15,c.z+m.oz*.15,S.spd*2.4,dt);m.st='walk';}else{m.st='eat';c.meat-=dt*.04;}continue;}
    if(g.st==='hunt'&&!m.male){wHuntMember(m,g,S,dt);continue;}
    // Ruheplatz je nach Tageszeit
    let sx,sz;if(m.seed==null)m.seed=Math.random();const a=m.seed*6.283;
    if(rock){if(mid&&PROCK.den){const d=PROCK.den;sx=d.x+Math.cos(d.ang)*(m.male?1.5:2.5+Math.abs(Math.sin(a))*3)+Math.cos(d.ang+1.57)*Math.cos(a)*4;sz=d.z+Math.sin(d.ang)*(m.male?1.5:2.5+Math.abs(Math.sin(a))*3)+Math.sin(d.ang+1.57)*Math.cos(a)*4;}
      else if(m.male){[sx,sz]=prWorld(dusk?40:32,0);}else{[sx,sz]=prWorld(4+Math.cos(a)*12,Math.sin(a)*8);}}
    else{sx=home.x+Math.cos(a)*(m.male?2:7);sz=home.z+Math.sin(a)*(m.male?2:7);}
    const[wx,wz]=rock?prRoute2(m,sx,sz):[sx,sz];const d=Math.hypot(sx-m.x,sz-m.z),dw=Math.hypot(wx-m.x,wz-m.z);
    if(d>1.2){wMove(m,wx,wz,S.spd*(d>40?2:1.2),dt);m.st='walk';if(dw<1.5&&(wx!==sx||wz!==sz)){m.x+=(wx-m.x)*.5;m.z+=(wz-m.z)*.5;}}else{m.st=m.male&&dusk&&rock?'idle':'lie';}}
  if(g.st==='hunt'&&g.killed){const c=g.killed;g.killed=null;g.st='feast';g.corpse=c;}};
// Löwen auf dem Felsen dürfen klettern: Höhe richtig zeichnen (Vorsprung gilt für alle Löwen)
{const wl1=wLand;wLand=function(sp,x,z){if((sp==='lion'||sp==='lioness')&&prideLedgeTop(x,z)!=null)return true;return wl1(sp,x,z);};}
// Hyänen jagen nur nachts, tagsüber dösen sie am Bau
{const hy0=wHyenas;wHyenas=function(g,list,dt){const h=wHour(),night=h<5.6||h>19.8;if(!night&&g.st!=='hunt')g.cool=Math.max(g.cool||0,1);hy0(g,list,dt);};}
{const cf0=wFrame;wFrame=function(m){if(m.sp==='vulture'&&m.st==='perch')return'p';return cf0(m);};}
// ---------- Waldtiere: Ruhezeiten und Verstecke ----------
// hare: ruht mittags im Bau, fox: schläft tagsüber im Bau, bear: schläft nachts in der Höhle,
// deer/elk: ruhen mittags und in der Nacht, boar: ruht tagsüber, wolf: tagsüber faul
function animalSleep(a){const h=wHour();switch(a.type){case'hare':return h>11&&h<16?'hide':null;case'fox':return h>8.5&&h<17.5?'hide':null;case'bear':return h<5.5||h>21?'hide':null;
  case'deer':case'elk':return(h>11.5&&h<15.5)||h<4||h>23?'rest':null;case'boar':return h>9&&h<18?'rest':null;case'wolf':return h>9&&h<17?'rest':null;}return null;}
{const nt0=newTarget;newTarget=function(a,r){if(!a.tame&&!a.pen&&animalSleep(a))return false;return nt0(a,r);};}
{const ua0=updateAnimals;updateAnimals=function(dt){ua0(dt);if(!animalMesh)return;const sz=animalMesh.geometry.attributes.size;let ch=false;
  animals.forEach((a,i)=>{if(!a.alive||a.tame||a.pen){a._hide=false;return;}const s=animalSleep(a)==='hide'&&!(a.state==='flee'||a.berserk||a.state==='hunt');
    if(s&&!a._hide){a._hide=true;}else if(!s&&a._hide){a._hide=false;}
    if(a._hide){const dp=Math.hypot(P.x-a.x,P.z-a.z);if(dp<4.5&&state==='playing'){a._hide=false;a.scared=3;return;}sz.array[i*2]=0;sz.array[i*2+1]=0;ch=true;}});
  if(ch)sz.needsUpdate=true;};}
{const ft0=frontTargets;frontTargets=function(range,cone){return ft0(range,cone).filter(a=>!a._hide);};}
