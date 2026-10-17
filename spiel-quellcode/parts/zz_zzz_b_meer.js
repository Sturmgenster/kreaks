/* =========================================================
   0.0.112 · Mehr Meer
   - Taucherausrüstung: Taucherhelm (3× Luft), Schwimmflossen (schneller), Tiefseelaterne (Licht), Atemtrank
   - Leuchtende Tiefseewesen: Laternenfisch, Anglerfisch, Leuchtqualle (Leuchtdrüsen)
   - Schiffswracks mit Truhe, manche mit Geisterkapitän
   - Angeln im Meer
   - Die versunkene Stadt in der Tiefsee mit dem Meereskönig
   ========================================================= */
Object.assign(ITEMS,{divehelm:{name:'Taucherhelm',plural:'Taucherhelme',slot:'helm',def:.04},flippers:{name:'Schwimmflossen',plural:'Schwimmflossen',slot:'boots',def:.01},
  deeplamp:{name:'Tiefseelaterne',plural:'Tiefseelaternen'},glowgland:{name:'Leuchtdrüse',plural:'Leuchtdrüsen'},cutlass:{name:'Geistersäbel',plural:'Geistersäbel',weapon:'sword'},
  seacrown:{name:'Krone des Meereskönigs',plural:'Kronen',slot:'helm',def:.12}});
POTIONS.pbreath={name:'Atemtrank',col:'#2ad0c0',desc:'Drei Minuten lang unter Wasser atmen'};ITEMS.pbreath={name:'Atemtrank',plural:'Atemtränke',potion:true};
Object.assign(ITEM_DESC,{divehelm:'Kopf-Ausrüstung. Unter Wasser reicht deine Luft dreimal so lange',flippers:'Fuß-Ausrüstung. Du schwimmst viel schneller',
  deeplamp:'Im Inventar tragen: Unter Wasser siehst du viel weiter und heller',glowgland:'Leuchtet von selbst. Von Tiefseewesen',cutlass:'Kalt wie die Tiefe. Gehörte einem Geisterkapitän',
  seacrown:'Kopf-Ausrüstung. Wer sie trägt, braucht unter Wasser keine Luft mehr',pbreath:'Drei Minuten lang unter Wasser atmen'});
RECIPES.push({id:'divehelm',need:{iron_ingot:3,pearl:1},bench:1},{id:'flippers',need:{tentacle:2,kelp:4},bench:1},{id:'deeplamp',need:{glowgland:2,iron_ingot:1},bench:1},{id:'pbreath',need:{kelp:3,pearl:1},bench:1});
try{STALL.Kuno.sell.push(['glowgland',12]);STALL.Wilma.pool.push(['pbreath',90]);}catch(e){}
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(14,14),M=pal(['#4a3a1a','#7a5a24','#b08a34','#e0b84a']),G=pal(['#1a3a4a','#3a7a9a','#8ad0e8']);mrEll(p,7,7,6,6,(x,y,dx,dy)=>M[shadeIdx(.6-dx*.3-dy*.3,4,x,y)]);mrEll(p,7,7,3.2,3.2,(x,y,dx,dy)=>G[dy<-.2?2:1]);for(const[x,y]of[[1,7],[13,7],[7,1]])p.set(x,y,M[0]);outline(p);list.push(['divehelm',p.done()]);}
  {const p=new Px(14,10),F=pal(['#0a3a3a','#1a6a6a','#3a9a8a']);mrPoly(p,[[1,2],[6,1],[13,5],[13,8],[6,9],[1,8]],(x,y)=>F[x>9?2:(x+y)%3?1:0]);for(let x=2;x<12;x+=3)mrLine(p,x,2,x+2,8,1,F[0]);outline(p);list.push(['flippers',p.done()]);}
  {const p=new Px(10,14),M=pal(['#3a3a40','#6a6a74','#9a9aa4']),G=pal(['#3ad0c0','#8af8e8','#e8fffc']);for(let x=2;x<8;x++){p.set(x,1,M[1]);p.set(x,12,M[0]);}mrEll(p,5,7,3,4,(x,y,dx,dy)=>G[dx*dx+dy*dy<.3?2:dy<0?1:0]);p.set(2,4,M[1]);p.set(7,4,M[1]);p.set(2,10,M[1]);p.set(7,10,M[1]);outline(p);list.push(['deeplamp',p.done()]);}
  {const p=new Px(9,9),G=pal(['#1a8a7a','#3ad0c0','#8af8e8','#ffffff']);mrEll(p,4,4,3.8,3.4,(x,y,dx,dy)=>G[shadeIdx(.7-dx*.3-dy*.4,4,x,y)]);outline(p);list.push(['glowgland',p.done()]);}
  {const p=new Px(10,20),S=pal(['#3a8a8a','#7ad0d0','#d0ffff']),H=pal(['#2a1a10','#4a3018']);for(let y=0;y<14;y++){const x=6-Math.sin(y/14*1.2)*3;p.set(x,y,S[1]);p.set(x+1,y,S[2]);p.set(x-1,y,S[0]);}for(let x=2;x<9;x++)p.set(x,14,S[0]);for(let y=15;y<20;y++){p.set(5,y,H[1]);p.set(6,y,H[0]);}outline(p);list.push(['cutlass',p.done()]);}
  {const p=new Px(16,12),G=pal(['#6a4a10','#b08a20','#e8c040','#fff0a0']);for(let x=1;x<15;x++)for(let y=7;y<11;y++)p.set(x,y,G[y===7?3:2]);for(const x of[1,4,8,11,14])mrPoly(p,[[x-1.5,8],[x,1+(x===8?-1:1)],[x+1.5,8]],G[1]);
    for(const x of[4,8,11])p.set(x,9,hex(x===8?'#3ad0c0':'#4a8af0'));outline(p);list.push(['seacrown',p.done()]);}
  list.push(['pbreath',drawPotion('pbreath')]);
}catch(e){console.error('Meer: Symbole 2',e);}};}
// ---------- Luft, Flossen, Atemtrank ----------
{const a=drinkPotion;drinkPotion=function(id){if(id==='pbreath'){removeItem('pbreath',1);P.breathT=180;SW.air=100;try{Snd.munch();}catch(e){}toast('Du kannst jetzt drei Minuten unter Wasser atmen.');renderInv();return;}return a(id);};}
{const a=swAir;swAir=function(dt){const air0=SW.air;a(dt);if(P.breathT>0){P.breathT-=dt;if(P.breathT<=0)toast('Der Atemtrank lässt nach.');}
  if(SW.head&&SW.air<air0){const used=air0-SW.air,h=equip.helm&&equip.helm.id;if(P.breathT>0||h==='seacrown')SW.air=air0;else if(h==='divehelm')SW.air+=used*2/3;}};}

// =========================================================
// Leuchtende Tiefseewesen
// =========================================================
function seaReg(k,S){S.k=k;S.min=Math.max(.8,S.len*(S.big?.45:.5)+.4);S.foes=S.foes||[];SEA[k]=S;for(const q in SEA){const Q=SEA[q];if((Q.eats||[]).includes(k)&&!S.foes.includes(q))S.foes.push(q);if((S.eats||[]).includes(q)&&!Q.foes.includes(k))Q.foes.push(k);}}
seaReg('lantern',{n:'Laternenfisch',len:.3,spd:2,fast:5,hp:3,hab:['tiefsee'],d:[40,250],g:[6,10],w:1.6,prey:1,glow:2.4,drop:[['glowgland',1,.25]],xp:1});
seaReg('angler',{n:'Anglerfisch',len:.9,spd:1,fast:4,hp:30,hab:['tiefsee'],d:[60,260],g:[1,1],w:.9,eats:['lantern','sardine'],aggr:2,dmg:6,sense:8,cd:1.3,glow:1.7,drop:[['glowgland',1,1],['seafish',1,.6]],xp:10});
seaReg('glowjelly',{n:'Leuchtqualle',len:.8,spd:.35,fast:.6,hp:5,hab:['tiefsee'],d:[30,250],g:[2,5],w:1.2,prey:1,drift:1,sting:4,upright:1,glow:2.6,drop:[['glowgland',1,.5]],xp:2});
SEA.squid.eats=(SEA.squid.eats||[]).concat(['lantern']);if(!SEA.lantern.foes.includes('squid'))SEA.lantern.foes.push('squid');
function seaGhost(f){const p=new Px(32,50),C=pal(['#2a5a6a','#4a8a9a','#7ac0c8','#b8eef0']),cx=16,w=f===1?1:-1;
  for(let y=30;y<50;y++){const k=(y-30)/20,hw=7*(1-k)+1;for(let x=Math.round(cx-hw+Math.sin(y*.4+w)*2*k);x<=cx+hw+Math.sin(y*.4+w)*2*k;x++)if(hash2(x,y,90)>k*.5)p.set(x,y,C[1+((x+y)%2)]);}
  mrPoly(p,[[cx-8,16],[cx+8,16],[cx+9,32],[cx-9,32]],(x,y)=>C[shadeIdx(.55-(x-cx)/25,4,x,y)]);for(let y=17;y<31;y+=3)p.set(cx,y,hex('#e0c060'));
  mrEll(p,cx,11,4.5,5,C[3]);p.set(cx-2,10,hex('#20f0ff'));p.set(cx+2,10,hex('#20f0ff'));for(let x=cx-3;x<=cx+3;x++)for(let y=13;y<17;y++)if(hash2(x,y,91)<.7)p.set(x,y,C[2]);
  mrPoly(p,[[cx-11,6],[cx+11,6],[cx+6,1],[cx,4],[cx-6,1]],C[0]);for(let x=cx-11;x<=cx+11;x++)p.set(x,6,hex('#e0c060'));
  mrLine(p,cx+8,18,cx+13,26,2,C[1]);for(let k=0;k<12;k++){const X=cx+13+k*.6,Y=26-k*1.4+(k>8?(k-8)*.8:0);p.set(X,Y,hex('#d0ffff'));p.set(X+1,Y,hex('#8ad0d0'));}
  mrLine(p,cx-8,18,cx-12,27,2,C[1]);outline(p);return p.done();}
function seaKing(f){const W=46,H=66,p=new Px(W,H),cx=21,S=pal(['#5a7a6a','#7aa08a','#a0c8ac','#c8e8d0']),T=pal(['#0a3a3a','#1a5a50','#2a8a70','#4ab090']),G=pal(['#8a6a10','#c8a020','#f0d050']),B=pal(['#2a7a8a','#4aa8b8','#8ad8e0']),w=f===1?2:-1;
  // Schwanz
  for(let y=34;y<62;y++){const k=(y-34)/28,cxx=cx+Math.sin(k*2.4+w*.3)*6*k,hw=7*(1-k*.75);for(let x=Math.round(cxx-hw);x<=cxx+hw;x++)p.set(x,y,T[shadeIdx(.6-(x-cxx)/(hw*3)+((x+y)%3===0?-.2:0),4,x,y)]);}
  {const tx=cx+Math.sin(2.4+w*.3)*6;mrPoly(p,[[tx-1,60],[tx-10,66+w*.5],[tx-3,63],[tx+1,62],[tx+10,65-w*.5],[tx+2,60]],T[3]);}
  // Oberkörper
  mrPoly(p,[[cx-9,18],[cx+9,18],[cx+7,36],[cx-7,36]],(x,y)=>S[shadeIdx(.62-(x-cx)/24-(y-18)/60,4,x,y)]);for(let x=cx-6;x<=cx+6;x++)p.set(x,35,G[1]);
  mrLine(p,cx-9,19,cx-13,32,3,(t,o)=>S[1+o%2]);mrLine(p,cx+9,19,cx+14,28,3,(t,o)=>S[1+o%2]);
  // Kopf mit Bart und Krone
  mrEll(p,cx,12,5,6,(x,y,dx,dy)=>S[shadeIdx(.66-dx*.3-dy*.2,4,x,y)]);p.set(cx-2,11,hex('#0a1a1a'));p.set(cx+2,11,hex('#0a1a1a'));
  for(let y=14;y<24;y++)for(let x=cx-4+Math.floor((y-14)/3);x<=cx+4-Math.floor((y-14)/3);x++)p.set(x,y,B[(x+y)%3]);
  for(let x=cx-5;x<=cx+5;x++){p.set(x,6,G[2]);p.set(x,5,G[1]);}for(const x of[cx-5,cx-2,cx+1,cx+4])mrPoly(p,[[x,5],[x+1,0],[x+2,5]],G[2]);p.set(cx,4,hex('#3ad0c0'));
  // Dreizack
  mrLine(p,cx+15,4,cx+15,48,2,(t,o)=>G[o?0:1]);for(const dx of[-3,0,3]){mrLine(p,cx+15+dx,0,cx+15+dx,6,1,B[2]);}mrLine(p,cx+12,6,cx+18,6,1,G[2]);
  outline(p);return p.done();}
Object.assign(SEA_SPR,{lantern:f=>seaFish({w:12,h:6,body:['#0a0e18','#141c2a','#202a3a'],belly:['#141c2a','#202a3a'],tl:.2,ry:.3,paint:(x,y,dx,dy)=>dy>.1&&x%2===0?hex('#7af8ff'):null},f),
  angler:f=>{const c=seaFish({w:22,h:16,body:['#1a1418','#2a2028','#3a2c36'],belly:['#2a2028','#3a2c36'],tl:.18,ry:.38,nose:1.1,eyeX:.35,mouth:.45,teeth:1},f),x=c.getContext('2d');x.fillStyle='#4a3a44';for(let k=0;k<7;k++)x.fillRect(16-k,3-Math.min(2,k*.5)|0,1,1);x.fillStyle='#bfffe8';x.fillRect(9,1,3,3);x.fillStyle='#ffffff';x.fillRect(10,2,1,1);return c;},
  glowjelly:f=>{const c=seaJelly(f),x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height);for(let i=0;i<d.data.length;i+=4)if(d.data[i+3]){const L=(d.data[i]+d.data[i+1]+d.data[i+2])/3;d.data[i]=L*.35;d.data[i+1]=Math.min(255,L*1.05);d.data[i+2]=Math.min(255,L*1.15);}x.putImageData(d,0,0);return c;},
  ghostcap:seaGhost,seaking:seaKing});
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k of['lantern','angler','glowjelly','ghostcap','seaking'])for(const f of[0,1])list.push(['sea_'+k+'_'+f,SEA_SPR[k](f)]);}catch(e){console.error('Meer: Bilder 2',e);}};}
// =========================================================
// Eigene Geschosse unter Wasser (Geisterkugeln, Wasserbälle)
// =========================================================
const SEAP=[];
function seaShot(c,spd,dmg,col,home,n,spread){const ey=P.y+1;for(let i=0;i<(n||1);i++){const a=(i-((n||1)-1)/2)*(spread||0);let dx=P.x-c.x,dy=ey-c.y,dz=P.z-c.z;const ca=Math.cos(a),sa=Math.sin(a);[dx,dz]=[dx*ca-dz*sa,dx*sa+dz*ca];const l=Math.hypot(dx,dy,dz)||1;
  SEAP.push({x:c.x,y:c.y,z:c.z,vx:dx/l*spd,vy:dy/l*spd,vz:dz/l*spd,t:0,life:5,dmg,col,home:home||0});}}
function seapTick(dt){for(let i=SEAP.length-1;i>=0;i--){const s=SEAP[i];s.t+=dt;if(s.home){const dx=P.x-s.x,dy=P.y+1-s.y,dz=P.z-s.z,d=Math.hypot(dx,dy,dz)||1,sp=Math.hypot(s.vx,s.vy,s.vz);s.vx+=(dx/d*sp-s.vx)*s.home*dt;s.vy+=(dy/d*sp-s.vy)*s.home*dt;s.vz+=(dz/d*sp-s.vz)*s.home*dt;}
  s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;for(let k=0;k<2;k++)spawnParticle(s.x+(Math.random()-.5)*.3,s.y+(Math.random()-.5)*.3,s.z+(Math.random()-.5)*.3,0,.2,0,s.col,.35,.3);
  const hit=Math.hypot(P.x-s.x,P.z-s.z)<.9&&s.y>P.y-.3&&s.y<P.y+2.1;if(hit&&(state==='playing'||state==='dialog')){takeDamage(s.dmg);for(let k=0;k<12;k++)spawnParticle(s.x,s.y,s.z,(Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4,s.col,.5,.3);}
  if(hit||s.t>s.life||s.y<getHeight(s.x,s.z))SEAP.splice(i,1);}}
// =========================================================
// Bosse: Geisterkapitän und Meereskönig
// =========================================================
seaReg('ghostcap',{n:'Geisterkapitän',len:1.7,spd:2.4,fast:5.5,hp:950,hab:[],d:[2,300],g:[1,1],w:0,aggr:2,dmg:18,sense:32,cd:1.4,boss:1,upright:1,glow:1.6,
  drop:[['coin',2,1],['silver',15,1],['oldcoin',4,1],['cutlass',1,1],['pearl',2,.7]],xp:320,ai:gcAI});
seaReg('seaking',{n:'Der Meereskönig',len:2.7,spd:2.6,fast:6,hp:2800,hab:[],d:[2,300],g:[1,1],w:0,aggr:2,dmg:26,sense:45,cd:1.5,boss:1,upright:1,glow:1.3,
  drop:[['seacrown',1,1],['trident',1,.6],['pearl',5,1],['coin',3,1],['silver',30,1],['oldcoin',8,1]],xp:950,ai:skAI});
function bossLeash(c,R){if(!c.home)return false;if(Math.hypot(P.x-c.home.x,P.z-c.home.z)>R||!SW.on){if(SEAT.boss===c&&Math.hypot(P.x-c.x,P.z-c.z)>60)seaBossOff();const dx=c.home.x-c.x,dy=c.home.y-c.y,dz=c.home.z-c.z,l=Math.hypot(dx,dy,dz);
  if(l>1){c.x+=dx/l*Math.min(l,3*1/60*3);c.y+=dy/l*Math.min(l,.15);c.z+=dz/l*Math.min(l,.15);}c.vx=c.vz=c.vy=0;c.hp=Math.min(c.S.hp,c.hp+c.S.hp*.02/60);c.ptgt=false;return true;}return false;}
function gcAI(c,dt){if(bossLeash(c,70))return true;c.orbT=(c.orbT==null?3:c.orbT)-dt;c.blinkT=(c.blinkT==null?8:c.blinkT)-dt;c.angry=99;
  if(c.ptgt&&c.orbT<=0){c.orbT=3.5+Math.random()*1.5;seaShot(c,9,12,0x7af8ff,1.1,3,.35);mzSay&&Math.random()<.3&&say(c,['Mein Schiff! Mein Gold!','Ihr werdet die Planke entlanggehen!','Yo-ho … in die Tiefe mit dir!'][(Math.random()*3)|0],2.5);}
  if(c.ptgt&&c.blinkT<=0&&Math.hypot(P.x-c.x,P.z-c.z)>6){c.blinkT=9+Math.random()*4;for(let k=0;k<30;k++)spawnParticle(c.x,c.y,c.z,(Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4,0x7af8ff,.6,.3);
    const a=Math.random()*6.283;c.x=P.x+Math.cos(a)*3;c.z=P.z+Math.sin(a)*3;c.y=clamp(P.y+1,getHeight(c.x,c.z)+1,WATER-1);}
  return false;}
function skAI(c,dt){if(bossLeash(c,90))return true;c.angry=99;c.boltT=(c.boltT==null?3:c.boltT)-dt;c.vortT=(c.vortT==null?10:c.vortT)-dt;
  const d=Math.hypot(P.x-c.x,P.z-c.z);
  if(c.vort>0){c.vort-=dt;const dx=c.x-P.x,dz=c.z-P.z,l=Math.hypot(dx,dz)||1;P.vx+=dx/l*7*dt;P.vz+=dz/l*7*dt;if(Math.random()<dt*2.5)takeDamage(2);
    for(let k=0;k<4;k++){const a=time*4+k*1.57,r=2+((time*3+k)%6);spawnParticle(c.x+Math.cos(a)*r,c.y-2+Math.random()*4,c.z+Math.sin(a)*r,-Math.sin(a)*3,0,Math.cos(a)*3,0x8ad8e0,.5,.25);}c.vx*=.5;c.vz*=.5;return true;}
  if(c.ptgt&&c.vortT<=0&&d<18){c.vortT=14+Math.random()*4;c.vort=3;say(c,'Der Strudel verschlingt dich!',2.5);}
  if(c.ptgt&&c.boltT<=0&&d>4){c.boltT=2.6+Math.random();seaShot(c,12,15,0x4ab0ff,.6,c.hp<c.S.hp*.5?5:3,.25);}
  if(!c.sum1&&c.hp<c.S.hp*.6){c.sum1=1;skSummon(c);}if(!c.sum2&&c.hp<c.S.hp*.3){c.sum2=1;skSummon(c);}
  return false;}
function skSummon(c){say(c,'Kommt, meine Wächter der Tiefe!',3);for(let i=0;i<2;i++){const a=Math.random()*6.283,s=seaMake(SEA.shark,c.x+Math.cos(a)*5,c.y,c.z+Math.sin(a)*5,null);s.angry=60;s.minion=1;}}
{const a=seaKill;seaKill=function(c,by){const was=!c.dead;a(c,by);if(!was||!c.struct)return;const F=FLAGS[c.structKey]=FLAGS[c.structKey]||{};F[c.struct]=Object.assign(F[c.struct]||{},{k:1});
  if(c.S.k==='seaking')setTimeout(()=>toast('Der Meereskönig ist gefallen! Die Krone des Meeres gehört dir.'),900);else setTimeout(()=>toast('Der Geisterkapitän findet endlich Ruhe.'),900);saveGame();};}
{const a=seaTick;seaTick=function(dt){a(dt);seapTick(dt);};}
// =========================================================
// Schiffswracks
// =========================================================
let WRM=null;function wrMats(){if(WRM)return WRM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const plank=(seed,cols)=>{const p=new Px(16,16),S=pal(cols);for(let y=0;y<16;y++)for(let x=0;x<16;x++){p.set(x,y,S[shadeIdx(.55+(hash2(x>>2,y,seed)-.5)*.4+(y%4===0?-.25:0),S.length,x,y)]);if(hash2(x,y,seed+5)<.07)p.set(x,y,hex('#2e5a2a'));}return T(p.done());};
  WRM={w:new THREE.MeshLambertMaterial({map:plank(6001,['#2a1e14','#3a2a1c','#4a3624','#5a4430'])}),d:new THREE.MeshLambertMaterial({map:plank(6004,['#1e1610','#2a2016','#3a2c1e'])}),
    sail:new THREE.MeshLambertMaterial({color:0x8a8270,side:THREE.DoubleSide,transparent:true,opacity:.85})};return WRM;}
function wreckOf(s){if(s.wrDone)return s.wr;s.wrDone=true;s.wr=null;if(!((s.b==='meer'&&!s.island)||s.b==='tiefsee'))return null;const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,6010)>.3)return null;
  const r=mulberry32(6011+s.ci*7919+s.cj*15485+WSEED*43);for(let t=0;t<30;t++){const a=r()*6.283,d=r()*s.R*.7,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<200)continue;const h=getHeight(x,z);if(WATER-h<6||WATER-h>200)continue;
    const ru=ruinOf(s);if(ru&&Math.hypot(ru.x-x,ru.z-z)<30)continue;const rot=r()*6.283;s.wr={id:s.id+'_wr',x,z,rot,c:Math.cos(rot),s:Math.sin(rot),h,ghost:hash2(A,B,6012)<.45};return s.wr;}return null;}
const WR={built:new Map(),t:0};
function wrBuild(g){const M=wrMats(),B={r:g,grp:new THREE.Group(),props:[],geos:[],g},r=mulberry32(6020+((g.x*3+g.z*5)|0)),roll=.28,box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);WR.built.set(g.id,B);
  ruAdd(B,box(13,.8,3.4),M.d,0,0,.3,0,roll*.3,0);
  for(const sd of[-1,1])for(let i=-3;i<=3;i++){if(sd>0&&i===1)continue;ruAdd(B,box(1.9,2.6,.3),M.w,i*1.85,sd*1.7,1.5+sd*roll*1.2,0,sd*.12+roll,0);}
  ruAdd(B,box(3,2.6,3.4),M.w,-5.6,0,1.6,0,roll,0);ruAdd(B,box(3.2,.3,3.6),M.d,-5.6,0,3,0,roll,0);ruAdd(B,box(2.6,2.4,.3),M.w,7,0,1.4,.6,roll,0);ruAdd(B,box(2.6,2.4,.3),M.w,7,0,1.4,-.6,roll,0);
  for(let i=-4;i<=4;i++){if(r()<.35)continue;ruAdd(B,box(1.2,.15,3.2),M.w,i*1.3,0,2.7,0,roll,(r()-.5)*.2);}
  const mast=ruAdd(B,new THREE.CylinderGeometry(.22,.26,8,8),M.d,1,4,1.2,.4,0,Math.PI/2-.25);const sail=ruAdd(B,new THREE.PlaneGeometry(4,3.2),M.sail,1.5,5.5,1.4,.3,-.9,.1);
  for(const lx of[-5,-2.5,0,2.5,5])ruProp(B,lx,0,1.6);scene.add(B.grp);
  FLAGS.wrecks=FLAGS.wrecks||{};const st=FLAGS.wrecks[g.id]=FLAGS.wrecks[g.id]||{};
  if(!st.chest){st.chest=1;const key='wreck_'+g.id,lx=-5.6,lz=.2,x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c;FLAGS.chests=FLAGS.chests||{};const b=FLAGS.chests[key]=new Array(28).fill(null),R=Math.random;
    const L=[['silver',8+((R()*12)|0)],['copper',20+((R()*30)|0)],['oldcoin',1+((R()*3)|0)]];if(R()<.4)L.push(['coin',1]);if(R()<.5)L.push(['pearl',1+((R()*2)|0)]);if(R()<.3)L.push(['pbreath',1]);if(R()<.15)L.push(['divehelm',1]);
    L.forEach((q,i)=>{b[i]={id:q[0],n:q[1]};});addFurn('chest',x,z,key);furnSave();renderFurn();}
  return B;}
// =========================================================
// Die versunkene Stadt
// =========================================================
function cityOf(s){if(s.ctDone)return s.ct;s.ctDone=true;s.ct=null;if(s.b!=='tiefsee')return null;const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,6030)>.14)return null;
  const r=mulberry32(6031+s.ci*7919+s.cj*15485+WSEED*47);for(let t=0;t<30;t++){const a=r()*6.283,d=r()*s.R*.4,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<300)continue;let ok=true;
    for(const[dx,dz]of[[0,0],[25,0],[-25,0],[0,25],[0,-25]]){if(wlDom(x+dx,z+dz)!==s||WATER-getHeight(x+dx,z+dz)<20){ok=false;break;}}if(!ok)continue;
    const rot=r()*6.283;s.ct={id:s.id+'_ct',x,z,rot,c:Math.cos(rot),s:Math.sin(rot),h:getHeight(x,z)};return s.ct;}return null;}
let CTM=null;function ctMats(){if(CTM)return CTM;const M=ruMats();CTM={a:M.a,b:M.b,w:M.w,gold:new THREE.MeshLambertMaterial({color:0xc8a030}),glow:new THREE.MeshBasicMaterial({color:0x5af0e0}),glow2:new THREE.MeshBasicMaterial({color:0x8a7aff})};return CTM;}
const CT={built:new Map()};
function ctBuild(g){const M=ctMats(),B={r:g,grp:new THREE.Group(),props:[],geos:[],g},r=mulberry32(6040+((g.x*7+g.z*3)|0)),box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);CT.built.set(g.id,B);
  // Tempel (Stufenpyramide)
  for(let i=0;i<3;i++){const s=16-i*4.5;ruAdd(B,box(s,2.2,s),i%2?M.b:M.w,0,0,1.1+i*2.2);}ruProp(B,0,0,7);
  for(let k=0;k<8;k++){const a=k/8*6.283;ruAdd(B,new THREE.CylinderGeometry(.35,.4,3.4,8),M.a,Math.cos(a)*2.8,Math.sin(a)*2.8,6.6+1.7);}ruAdd(B,box(7,.5,7),M.w,0,0,6.6+3.6);
  ruAdd(B,box(1.2,1.2,1.2),M.glow,0,0,6.6+.8,.7);
  // Allee mit Säulen zum Tempel
  for(let i=0;i<6;i++)for(const sd of[-1,1]){const lz=10+i*4,hh=3+r()*3;if(r()<.2){ruAdd(B,new THREE.CylinderGeometry(.45,.45,hh,10),M.a,sd*4+(r()-.5),lz,.4,r()*3,0,Math.PI/2);continue;}ruAdd(B,new THREE.CylinderGeometry(.45,.5,hh,10),M.a,sd*4,lz,hh/2);ruProp(B,sd*4,lz,.55);}
  // Häuser
  const houses=[[-16,-14],[-18,2],[-15,16],[16,-15],[18,1],[15,17],[-4,-20],[6,-21]];for(const[lx,lz]of houses){if(r()<.15)continue;const w=4+r()*2,d=4+r()*2,h=3+r()*2,broken=r()<.4;
    ruAdd(B,box(w,broken?h*.6:h,d),M.b,lx,lz,(broken?h*.6:h)/2,r()*.3);if(!broken)ruAdd(B,box(w+.6,.5,d+.6),M.w,lx,lz,h+.25,r()*.3);ruAdd(B,box(1,1.8,.2),M.glow2,lx,lz+d/2+.05,.9);ruProp(B,lx,lz,Math.min(w,d)*.55);}
  // Leuchtkristalle
  for(let k=0;k<14;k++){const a=r()*6.283,d=8+r()*22,s=.4+r()*.8;ruAdd(B,box(s,s*2.4,s),r()<.6?M.glow:M.glow2,Math.cos(a)*d,Math.sin(a)*d,s*.9,r()*3,(r()-.5)*.5,(r()-.5)*.5);}
  // Statuen
  for(const sd of[-1,1]){ruAdd(B,box(1.6,1,1.6),M.w,sd*6,-9,.5);ruAdd(B,box(1,3,.7),M.a,sd*6,-9,2.5);ruAdd(B,box(.8,.8,.8),M.gold,sd*6,-9,4.4);}
  scene.add(B.grp);
  FLAGS.cities=FLAGS.cities||{};const st=FLAGS.cities[g.id]=FLAGS.cities[g.id]||{};
  if(!st.chest){st.chest=1;const key='city_'+g.id,lx=0,lz=9,x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c;FLAGS.chests=FLAGS.chests||{};const b=FLAGS.chests[key]=new Array(28).fill(null),R=Math.random;
    const L=[['coin',2+((R()*2)|0)],['pearl',3+((R()*4)|0)],['oldcoin',6+((R()*6)|0)],['silver',20],['glowgland',3]];const gems=['ruby','opal','sapphire','emerald','diamond'].filter(k=>ITEMS[k]);for(let i=0;i<2;i++)if(gems.length)L.push([gems[(R()*gems.length)|0],1]);
    L.forEach((q,i)=>{b[i]={id:q[0],n:q[1]};});addFurn('chest',x,z,key);furnSave();renderFurn();}
  return B;}
// ---------- Aufbauen, Bosse rufen ----------
function stFree(map,B){scene.remove(B.grp);for(const g of B.geos)g.dispose();for(const p of B.props){const l=tgrid.get(gk(p.x,p.z));if(l){const i=l.indexOf(p);if(i>=0)l.splice(i,1);}}map.delete(B.r.id);}
function stBoss(B,key,sp,lx,lz,dy){const st=(FLAGS[key]||{})[B.r.id]||{};if(st.k)return;if(B.boss&&!B.boss.dead&&SEAL.includes(B.boss))return;const g=B.r;
  if(Math.hypot(g.x-P.x,g.z-P.z)>70)return;const x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c,y=getHeight(x,z)+dy,c=seaMake(SEA[sp],x,y,z,null);c.home={x,y,z};c.h=1.6;c.struct=g.id;c.structKey=key;B.boss=c;}
let stT=0;
function stTick(dt){stT-=dt;if(stT>0)return;stT=.8;const all=[[WR.built,wreckOf,wrBuild,'wrecks'],[CT.built,cityOf,ctBuild,'cities']];
  if(P.x>60000||!WL_READY){for(const[m]of all)for(const B of[...m.values()])stFree(m,B);return;}
  const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=wlSite(ci+a,cj+b);if(s.b!=='meer'&&s.b!=='tiefsee')continue;for(const[m,of,build]of all){const g=of(s);if(g&&!m.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<200)build(g);}}
  for(const[m]of all)for(const B of[...m.values()])if(Math.hypot(B.r.x-P.x,B.r.z-P.z)>270)stFree(m,B);
  for(const B of WR.built.values())if(B.r.ghost)stBoss(B,'wrecks','ghostcap',0,0,4);
  for(const B of CT.built.values())stBoss(B,'cities','seaking',0,0,8.5);}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{stTick(dt);}catch(e){if(!stTick.err){stTick.err=1;console.error('Wracks/Stadt',e);}}};}
{const a=wlReset;wlReset=function(){for(const m of[WR.built,CT.built])for(const B of[...m.values()])stFree(m,B);a();};}
// =========================================================
// Angeln im Meer
// =========================================================
const SEA_FISH=[['seafish',58],['kelp',12],['shell',9],['tentacle',8],['oldcoin',4],['pearl',3],['sharktooth',3],['glowgland',3]];
{const a=useRod;useRod=function(){if(fish.st==='none'&&!P.riding&&P.x<60000&&!inCore(P.x,P.z)){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);let tx=null,tz=0;
    for(let d=8;d>=2.5;d-=.5){const x=P.x+fx*d,z=P.z+fz*d;if(!inCore(x,z)&&getHeight(x,z)<WATER-.25){tx=x;tz=z;break;}}
    if(tx!==null){P.lastAction=time;rodTip(_rt);fish.sx=_rt.x;fish.sy=_rt.y;fish.sz=_rt.z;fish.x=tx;fish.z=tz;fish.st='cast';fish.t=0;fish.sea=['meer','tiefsee'].includes(mrBio(tx,tz));Snd.jump();return;}}
  return a();};}
{const a=catchFish;catchFish=function(){if(!fish.sea)return a();fish.sea=false;let r=Math.random()*100,id='seafish';for(const[k,w]of SEA_FISH){if(r<w){id=k;break;}r-=w;}
  if(addItem(id,1))spawnDrop(id,1,P.x,P.y+1,P.z);frogSplash(fish.x,fish.z,14);frogPlop(true);Snd.pickup();fish.st='none';toast((['pearl','oldcoin'].includes(id)?'Ein Schatz! ':'')+ITEMS[id].name+' geangelt!');gainXP(id==='pearl'?20:id==='oldcoin'?12:5);wearTool();};}
{const a=startGame;startGame=function(isNew,char){SEAP.length=0;P.breathT=0;return a(isNew,char);};}
