/* =========================================================
   V68 · Candyland: ein sehr seltenes Biom. Lutscher und Zuckerstangen statt
   Bäumen, Kandiszucker statt Steinen. Lebkuchenmenschen laufen friedlich hin
   und her (greift man einen an, werden alle wütend). Nussknacker-Trupps in
   Reih und Glied mit Anführer in Grün jagen sie mit Nussgewehren, ziehen in
   Nachbarbiome, schlagen dort ein Lager auf, bauen ab und übernachten.
   ========================================================= */
const cR=(p,x0,x1,y0,y1,c)=>{for(let y=Math.round(y0);y<=Math.round(y1);y++)for(let x=Math.round(x0);x<=Math.round(x1);x++){const v=typeof c==='function'?c(x,y):c;if(v)p.set(x,y,v);}};
const cDisc=(p,cx,cy,r,f)=>{for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const d=Math.hypot(x-cx,y-cy);if(d<=r)p.set(x,y,f(x,y,d));}};
const cLine=(p,x0,y0,x1,y1,w,f)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*2)+1;for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;for(let a=-w/2;a<w/2;a+=.5)for(let b=-w/2;b<w/2;b+=.5)p.set(x+a,y+b,f(x+a,y+b,t));}};
const cPick=(P,L)=>P[clamp(Math.floor(L*P.length),0,P.length-1)];
// ---------- Pflanzen und Steine des Candylands (Wildnis-Atlas) ----------
function drawLolli(v){const W=28,H=86,p=new Px(W,H),S=pal(['#b8b8c4','#e0e0ea','#ffffff']);
  const SW=[[pal(['#c02a62','#e04a84','#ff74a8','#ffa8cc']),pal(['#d8d0d8','#f0e8f0','#ffffff'])],
    [pal(['#c02a2a','#e8483a','#ff7a5a']),pal(['#d8a810','#f0cc30','#ffe870']),pal(['#2a9a4a','#40c060','#78e090']),pal(['#2a5ac0','#4a80e8','#80b0ff'])],
    [pal(['#2a9a7a','#40c0a0','#78e8c8','#b0f8e4']),pal(['#d8d0d8','#f0e8f0','#ffffff'])]][v];
  for(let y=24;y<H;y++){p.set(13,y,S[2]);p.set(14,y,S[1]);if(y>30)p.set(15,y,S[0]);}
  const cx=14,cy=13,r=12.6;cDisc(p,cx,cy,r,(x,y,d)=>{const a=Math.atan2(y-cy,x-cx),band=Math.floor(((a/6.283+1)*SW.length*1.5+d/3.4))%SW.length,L=.62-((x-cx)+(y-cy))/(2*r)*.32+(d>r-1.2?-.22:0);return cPick(SW[band],L);});
  for(const[x,y]of[[8,7],[9,7],[8,8],[10,6]])p.set(x,y,hex('#ffffff'));outline(p);return p.done();}
function drawCane(v){const W=30,H=92,p=new Px(W,H),R=v?pal(['#1e8a4a','#2eb060','#50d080']):pal(['#a01818','#d02828','#f04a40']),Wt=pal(['#c8c8d0','#ececf2','#ffffff']);
  const cx=13,cy=14,ri=4.3,ro=10.7,col=(s,L)=>s?cPick(R,L):cPick(Wt,L);
  for(let y=0;y<=cy;y++)for(let x=0;x<W;x++){const d=Math.hypot(x-cx,y-cy);if(d<ri||d>ro)continue;const a=Math.atan2(cy-y,x-cx),s=Math.floor(a/Math.PI*7+d*.0)%2===0;p.set(x,y,col(s,.7-(y-cy+ro)/(2*ro)*.2-(d-ri)/(ro-ri)*.25));}
  for(let y=cy;y<=cy+8;y++)for(let x=cx-ro;x<=cx-ri;x++){const s=Math.floor((y+x*.9)/3)%2===0;p.set(x,y,col(s,.68-(x-(cx-ro))/(ro-ri)*.3));}
  for(let y=cy;y<H;y++)for(let x=cx+ri;x<=cx+ro;x++){const s=Math.floor((y-x*.9)/3.2)%2===0;p.set(x,y,col(s,.75-(x-(cx+ri))/(ro-ri)*.42));}
  outline(p);return p.done();}
function drawKandis(v){const W=32,H=28,p=new Px(W,H),C=v?pal(['#a04a6a','#c86a8c','#e898b4','#f8c8dc','#fff0f6']):pal(['#8a5410','#b47820','#d8a040','#f0c870','#fff0c0']);
  const cr=[[6,13,4,-.15],[12,22,5,.05],[19,18,4.5,.12],[25,11,3.5,.3],[9,9,3,-.35],[16,10,3,.0]];
  for(const[bx,h,w,lean]of cr)for(let y=0;y<h;y++){const t=y/h,hw=w*(t<.82?1:(1-t)/.18),cxx=bx+lean*y;for(let x=Math.round(cxx-hw);x<=Math.round(cxx+hw);x++){const L=x<cxx-hw*.2?.82:x<cxx+hw*.3?.6:.38;p.set(x,H-1-y,cPick(C,L-t*.05+(hash2(x,y,bx)-.5)*.08));}}
  for(let k=0;k<9;k++){const x=(hash2(k,v,4530)*W)|0,y=(hash2(k,v,4531)*H)|0;if(p.d[(y*W+x)*4+3])p.set(x,y,hex('#ffffff'));}outline(p);return p.done();}
function drawGumdrop(){const W=34,H=20,p=new Px(W,H),Cs=[pal(['#a01818','#d83030','#ff6060']),pal(['#1a8a3a','#30b050','#70e080']),pal(['#c86a10','#f09020','#ffc060']),pal(['#6a2a9a','#9050c8','#c090f0']),pal(['#b8a010','#e8d030','#fff080'])];
  const D=[[7,13,6],[16,11,7],[26,13,6],[11,16,5],[22,16,5]];D.forEach(([cx,cy,r],i)=>{const C=Cs[(i*3+1)%Cs.length];for(let y=Math.floor(cy-r);y<=cy+3;y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=(x-cx)/r,dy=(y-cy)/r;if(dy<0?dx*dx+dy*dy>1:Math.abs(dx)>1)continue;
    const h=hash2(x,y,4532+i);p.set(x,y,h<.1?hex('#ffffff'):cPick(C,.7-dy*.15-dx*.2));}});outline(p);return p.done();}
{const wn0=wlNewSprites;wlNewSprites=function(){const out=wn0();
  for(let v=0;v<3;v++)out.push(['lolli'+v,drawLolli(v)]);out.push(['cane0',drawCane(0)]);out.push(['cane1',drawCane(1)]);out.push(['kandis0',drawKandis(0)]);out.push(['kandis1',drawKandis(1)]);out.push(['gumdrop',drawGumdrop()]);
  const CT=[pal(['#d870a8','#f094c4','#ffb8dc','#ffe0f0']),pal(['#8a70d8','#a894f0','#c8b8ff','#ece4ff'])];
  ['oak0','oak1'].forEach((k,i)=>out.push(['cotton'+i,cvCopy(SPR[k].c,(r,g,b,x,y)=>{const L=lum(r,g,b);if(g>r*1.05)return cPick(CT[i],L*1.6+.15);return(y>>2)%2?[250,240,246]:[240,150,190];})]));
  const GC=[pal(['#5ab890','#7ad0aa','#a0e8c8']),pal(['#d07aa8','#e89ac0','#f8c0d8'])];
  ['grass0','grass1'].forEach((k,i)=>out.push(['sgrassc'+i,cvCopy(SPR[k].c,(r,g,b,x)=>cPick(GC[(x>>2)%2===i?0:1],lum(r,g,b)*1.5))]));
  const SP=[[255,80,120],[255,210,60],[100,180,255],[180,110,255],[255,255,255]];
  ['flower0','flower2'].forEach((k,i)=>out.push(['sprink'+i,cvCopy(SPR[k].c,(r,g,b,x,y)=>g>r&&g>b?[120,210,170]:SP[(hash2(x,y,4533+i)*5)|0])]));
  return out;};}
Object.assign(HV,{wl_lolli:{t:'tree',hp:28,d:[['lollipop',1,2,1],['stick',1,2,.6]],re:2880},wl_cane:{t:'tree',hp:34,d:[['candycane',1,3,1]],re:2880},
  wl_cotton:{t:'tree',hp:22,d:[['cottoncandy',1,3,1],['stick',1,1,.5]],re:2880},wl_kandis:{t:'rock',hp:40,d:[['kandis',1,3,1]],re:4320},
  wl_gumdrop:{t:'soft',hp:6,d:[['gumdrop',2,4,1]],re:1440},wl_sgrassc:{t:'soft',hp:1,d:[['fiber',1,1,.4]],re:720,small:1},wl_sprink:{t:'soft',hp:1,d:[['gumdrop',1,1,.35]],re:720,small:1}});
// ---------- Süßigkeiten als Gegenstände ----------
Object.assign(ITEMS,{lollipop:{name:'Lutscher',plural:'Lutscher'},candycane:{name:'Zuckerstange',plural:'Zuckerstangen'},cottoncandy:{name:'Zuckerwatte',plural:'Zuckerwatte'},
  kandis:{name:'Kandiszucker',plural:'Kandiszucker'},gumdrop:{name:'Gummibonbon',plural:'Gummibonbons'},gingerbread:{name:'Lebkuchen',plural:'Lebkuchen'},nut:{name:'Nuss',plural:'Nüsse'}});
Object.assign(ITEM_DESC,{lollipop:'Ein Lutscher so groß wie ein Teller. Aus dem Candyland',candycane:'Rot und weiß gestreift, knackig und süß',cottoncandy:'Schmilzt auf der Zunge',
  kandis:'Funkelnde Zuckerkristalle. Viel Ausdauer',gumdrop:'Weich, bunt und klebrig',gingerbread:'Würziger Lebkuchen. Macht richtig satt',nut:'Munition der Nussknacker. Man kann sie auch essen'});
Object.assign(FOOD,{lollipop:[6,18,'Süß! Das gibt Kraft.'],candycane:[5,14,'Knack! Pfefferminzig.'],cottoncandy:[3,12,'Pff, schon weg geschmolzen.'],kandis:[2,30,'Purer Zucker. Du fühlst dich hellwach!'],
  gumdrop:[3,6,'Klebt an den Zähnen.'],gingerbread:[16,10,'Würzig, weich und lecker!'],nut:[3,3,'Knackig.']});
try{STALL.Wilma.sell.push(['gingerbread',9]);STALL.Kuno.sell.push(['kandis',6]);}catch(e){}
{const cs3=craftSprites;craftSprites=function(list){cs3(list);
  {const p=new Px(12,16);cDisc(p,6,5,5,(x,y,d)=>{const a=Math.atan2(y-5,x-6),b=Math.floor((a/6.283+1)*3+d/1.6)%2;return b?hex(d>4?'#c02a62':'#ff74a8'):hex('#ffffff');});for(let y=10;y<16;y++)p.set(6,y,hex('#e8e8f0'));outline(p);list.push(['lollipop',p.done()]);}
  {const p=new Px(12,16);for(let y=4;y<16;y++)for(let x=7;x<10;x++)p.set(x,y,Math.floor((y-x)/2)%2?hex('#d02828'):hex('#ffffff'));for(let a=0;a<=Math.PI;a+=.2)for(let r=1.6;r<3.2;r+=.5)p.set(5.5+Math.cos(a)*-r+2.5,4-Math.sin(a)*r,Math.floor(a*3)%2?hex('#d02828'):hex('#ffffff'));outline(p);list.push(['candycane',p.done()]);}
  {const p=new Px(12,15);cDisc(p,6,5,5,(x,y)=>hash2(x,y,4540)<.3?hex('#ffd0e8'):hex('#f49ac8'));for(let y=9;y<15;y++)p.set(6,y,hex('#f0e0d0'));outline(p);list.push(['cottoncandy',p.done()]);}
  {const p=new Px(13,12),C=pal(['#b47820','#d8a040','#f0c870','#fff0c0']);for(const[bx,h]of[[3,8],[6,11],[9,9]])for(let y=0;y<h;y++)for(let x=bx-1;x<=bx+1;x++)p.set(x,11-y,cPick(C,x<bx?.85:x===bx?.6:.35));outline(p);list.push(['kandis',p.done()]);}
  {const p=new Px(12,10);for(const[cx,c]of[[3.5,'#e03030'],[8,'#30b050']])for(let y=2;y<10;y++)for(let x=cx-3;x<=cx+3;x++){const dy=(y-6)/4,dx=(x-cx)/3.4;if(dy<0&&dx*dx+dy*dy>1)continue;p.set(x,y,hash2(x,y,4541)<.12?hex('#ffffff'):hex(c));}outline(p);list.push(['gumdrop',p.done()]);}
  {const p=new Px(13,15),C=pal(['#7a4018','#9a5624','#b46c32']);cDisc(p,6.5,3.5,3.2,(x,y)=>cPick(C,.7-(x-5)/10));cR(p,4,9,6,10,(x,y)=>cPick(C,.6-(x-6)/12));cR(p,1,12,7,8,C[1]);cR(p,4,5,10,14,C[1]);cR(p,8,9,10,14,C[1]);
    p.set(5,3,hex('#2a1408'));p.set(8,3,hex('#2a1408'));p.set(6,5,hex('#fff6ee'));p.set(7,5,hex('#fff6ee'));p.set(6,8,hex('#e03040'));outline(p);list.push(['gingerbread',p.done()]);}
  {const p=new Px(9,9),C=pal(['#5a3410','#7a4a1c','#9a6428','#c08a40']);cDisc(p,4,4.5,3.8,(x,y,d)=>cPick(C,.7-(x+y-8)/12-(d>3?.2:0)));p.set(4,1,hex('#3a2008'));p.set(3,2,C[3]);outline(p);list.push(['nut',p.done()]);}};}
// ---------- Lebkuchenmenschen ----------
function drawGinger(f,angry){const W=30,H=42,p=new Px(W,H),C=pal(['#5a2e10','#7a4018','#9a5624','#b46c32','#c88444']),I=hex('#fff6ee'),cx=15;
  const col=(x,y)=>cPick(C,.66-(x-cx)/30*.5-(y-20)/50*.3+(hash2(x,y,4550)-.5)*.1);
  const cap=(x0,y0,x1,y1,r)=>cLine(p,x0,y0,x1,y1,r*2,(x,y)=>col(x,y));
  const sw=f===1?1:f===2?-1:0,arm=f==='a';
  // Beine
  cap(cx-3.5,29,cx-4.5-sw*1.5,37-(sw>0?1.5:0),3);cap(cx+3.5,29,cx+4.5-sw*1.5,37-(sw<0?1.5:0),3);
  // Arme
  if(arm){cap(cx-5,18,cx-11,9,3);cap(cx+5,18,cx+11,9,3);}else{cap(cx-5,18,cx-11.5,23+sw,3);cap(cx+5,18,cx+11.5,23-sw,3);}
  // Körper und Kopf
  for(let y=15;y<=30;y++)for(let x=cx-6;x<=cx+6;x++){const cy2=y<17?(17-y):y>28?(y-28):0,cx2=Math.abs(x-cx)>4?Math.abs(x-cx)-4:0;if(Math.hypot(cx2,cy2)>2.6)continue;p.set(x,y,col(x,y));}
  cDisc(p,cx,8.5,7.6,(x,y)=>col(x,y));
  outline(p);
  // Zuckerguss
  const zig=(x0,y0,x1,y1)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let i=0;i<=n;i++){const t=i/n;p.set(x0+(x1-x0)*t+(i%2?0:0),y0+(y1-y0)*t+(i%2?-.6:.6),I);}};
  if(arm){zig(cx-12.5,11,cx-8.5,9);zig(cx+8.5,9,cx+12.5,11);}else{zig(cx-10.5,20.5+sw,cx-10.5,25.5+sw);zig(cx+10.5,20.5-sw,cx+10.5,25.5-sw);}
  zig(cx-7.5-sw*1.5,35-(sw>0?1.5:0),cx-2-sw*1.5,35-(sw>0?1.5:0));zig(cx+2-sw*1.5,35-(sw<0?1.5:0),cx+7.5-sw*1.5,35-(sw<0?1.5:0));
  // Gesicht
  const E=hex('#2a1408');for(const ex of[cx-3,cx+3]){p.set(ex,7,E);p.set(ex,8,E);p.set(ex-(ex<cx?0:0),6,angry?E:hex('#fff6ee'));}
  if(angry){p.set(cx-5,4,I);p.set(cx-4,5,I);p.set(cx-3,5.4,I);p.set(cx+5,4,I);p.set(cx+4,5,I);p.set(cx+3,5.4,I);for(let x=cx-3;x<=cx+3;x++)p.set(x,12-(Math.abs(x-cx)>2?1:0)*-1+(x===cx?0:0),I);p.set(cx-3,11,I);p.set(cx+3,11,I);}
  else{for(let x=cx-4;x<=cx+4;x++)p.set(x,11+(Math.abs(x-cx)<3?1:0),I);}
  p.set(cx-5,10,hex(angry?'#ff3a3a':'#f08aa0'));p.set(cx+5,10,hex(angry?'#ff3a3a':'#f08aa0'));
  // Knöpfe
  [[18,'#e03040'],[22,'#30b050'],[26,'#e03040']].forEach(([y,c])=>{p.set(cx,y,hex(c));p.set(cx+1,y,hex(c));p.set(cx,y+1,hex(c));p.set(cx+1,y+1,hex(c));p.set(cx,y,hex('#ffffff'));});
  return p.done();}
// ---------- Nussknacker ----------
function drawNut(lead,pose,f){const W=48,H=78,p=new Px(W,H),cx=17;
  const CO=lead?pal(['#123018','#1a4a24','#24622e','#34803e','#4a9a50']):pal(['#5a1010','#801818','#a82424','#cc3630','#e8564a']),
    G=pal(['#7a5410','#b48a24','#e0b840','#fff0a0']),B=pal(['#0c0c10','#1a1a22','#2a2a36','#3e3e4c']),Wt=pal(['#a8a8b4','#d0d0dc','#f4f4fc']),
    SK=pal(['#b47458','#d8987a','#f0bc98']),TR=lead?pal(['#101014','#1c1c24','#2a2a36']):pal(['#10183a','#1a2654','#283670']),WD=pal(['#3a2010','#5a3418','#7a4a22','#9a6430']),MT=pal(['#3e424a','#6a7078','#9aa0aa','#d0d6e0']);
  const sh=(P,x,c0,L0)=>cPick(P,(L0==null?.62:L0)-(x-c0)/22);
  const rifleV=()=>{for(let y=4;y<12;y++)p.set(cx+13,y,MT[y<6?3:2]);for(let y=12;y<36;y++){p.set(cx+13,y,MT[1]);p.set(cx+14,y,MT[2]);}p.set(cx+12,30,MT[0]);
    for(let y=36;y<57;y++){p.set(cx+12,y,WD[1]);p.set(cx+13,y,WD[2]);p.set(cx+14,y,WD[3]);if(y>51)p.set(cx+11,y,WD[1]),p.set(cx+15,y,WD[2]);}for(let y=57;y<59;y++)cR(p,cx+11,cx+15,y,y,B[2]);};
  const rifleBack=()=>{cLine(p,cx-11,64,cx+12,22,2,(x,y,t)=>t>.62?MT[t>.93?3:2]:WD[2]);cLine(p,cx-12,65,cx-8,58,3,()=>WD[1]);};
  const rifleH=fire=>{cR(p,cx-3,cx+8,40,42,(x,y)=>WD[y===40?3:2]);cR(p,cx-5,cx-3,41,44,WD[1]);cR(p,cx+9,cx+25,40,41,(x,y)=>MT[y===40?2:1]);cR(p,cx+26,cx+30,40,40,MT[3]);
    if(fire){const F=pal(['#e05a10','#ffa020','#ffe060','#ffffff']);for(let k=0;k<26;k++){const a=(hash2(k,1,4560)-.5)*1.6,r=hash2(k,2,4561)*4.5;p.set(cx+31+Math.cos(a)*r,40.5+Math.sin(a)*r,F[(3-r*.7)|0]||F[0]);}}};
  if(pose==='work')rifleBack();
  const step=f===1?1:f===2?-1:0;
  // Beine und Stiefel
  for(const s of[-1,1]){const lift=(s<0&&step>0)||(s>0&&step<0)?2:0,x0=s<0?cx-6:cx+1,x1=s<0?cx-1:cx+6;
    cR(p,x0,x1,57,66-lift,(x,y)=>sh(TR,x,x0,.7));cR(p,s<0?x0:x1,s<0?x0:x1,58,65-lift,G[2]);
    cR(p,x0-(s<0?1:0),x1+(s>0?1:0),66-lift,75-lift,(x,y)=>B[y===66-lift?3:x===x0+1?2:1]);cR(p,x0-(s<0?2:0),x1+(s>0?2:0),74-lift,75-lift,B[0]);}
  // Rock und Körper
  cR(p,cx-8,cx+8,36,57,(x,y)=>sh(CO,x,cx-8,.78));for(let y=54;y<58;y++)p.set(cx,y,CO[0]);
  // Kreuzgurte, Knöpfe, Gürtel
  for(let k=0;k<2;k++){cLine(p,cx-7+k,37,cx+6+k,53,1.6,()=>Wt[2-k]);cLine(p,cx+7-k,37,cx-6-k,53,1.6,()=>Wt[2-k]);}
  for(const y of[39,42,45,48])for(const x of[cx-3,cx+3]){p.set(x,y,G[3]);p.set(x,y+1,G[1]);}
  cR(p,cx-8,cx+8,53,55,B[1]);cR(p,cx-2,cx+2,53,55,(x,y)=>x===cx-2||x===cx+2||y===53||y===55?G[2]:B[2]);
  if(lead){cLine(p,cx-8,38,cx+8,52,2.2,()=>G[2]);for(const[x,y,c]of[[cx-5,41,'#e03030'],[cx-4,41,'#e03030'],[cx-5,42,'#f0c040'],[cx-4,42,'#f0c040']])p.set(x,y,hex(c));}
  // Kragen, Schulterstücke
  cR(p,cx-5,cx+5,35,36,G[2]);for(const s of[-1,1]){const x0=s<0?cx-12:cx+8,x1=s<0?cx-8:cx+12;cR(p,x0,x1,35,37,(x,y)=>G[y===35?3:2]);for(let x=x0;x<=x1;x+=2)p.set(x,38,G[1]),p.set(x,39,G[lead?2:1]);}
  // Arme
  const sleeve=(x0,y0,x1,y1)=>cLine(p,x0,y0,x1,y1,3.2,(x,y)=>sh(CO,x,x0-2,.7)),glove=(x,y)=>cR(p,x-1,x+1,y-1,y+1,(xx,yy)=>Wt[yy===y-1?2:1]);
  if(pose==='aim'||pose==='fire'){sleeve(cx-9,39,cx-5,43);sleeve(cx+9,39,cx+12,43);rifleH(pose==='fire');glove(cx-4,43);glove(cx+13,42);}
  else if(pose==='work'){const up=f==='w1';if(up){sleeve(cx-9,39,cx-4,30);sleeve(cx+9,39,cx+6,30);glove(cx+1,28);cLine(p,cx+1,28,cx+9,18,1.6,()=>WD[2]);cR(p,cx+7,cx+12,15,19,(x,y)=>MT[y===15?3:2]);}
    else{sleeve(cx-9,39,cx-2,48);sleeve(cx+9,39,cx+9,50);glove(cx+7,52);cLine(p,cx+7,52,cx+19,55,1.6,()=>WD[2]);cR(p,cx+18,cx+22,52,57,(x,y)=>MT[x===cx+22?3:2]);}}
  else{const sw=step;sleeve(cx-10,39,cx-11-sw*.6,51+sw);glove(cx-11-sw*.6,53+sw);cR(p,cx-12-sw*.6,cx-10-sw*.6,51+sw,51+sw,G[2]);rifleV();sleeve(cx+10,39,cx+12,47);glove(cx+12,48);}
  // Kopf: Haare, Gesicht, Bart, Zähne
  cR(p,cx-8,cx-7,19,30,Wt[2]);cR(p,cx+7,cx+8,19,30,Wt[1]);
  cR(p,cx-6,cx+6,19,34,(x,y)=>sh(SK,x,cx-6,.82));
  cR(p,cx-5,cx-2,21,21,B[0]);cR(p,cx+2,cx+5,21,21,B[0]);
  for(const s of[-1,1]){const ex=cx+s*3.5;cR(p,ex-1,ex+1,22,23,Wt[2]);p.set(ex,23,B[0]);p.set(ex+s*-.5,22,hex('#3a6ad0'));}
  cR(p,cx-1,cx+1,24,26,(x,y)=>SK[x===cx+1?0:1]);p.set(cx,26,hex('#e06a5a'));
  for(const s of[-1,1]){p.set(cx+s*5,25,hex('#ee7a7a'));p.set(cx+s*4,26,hex('#ee7a7a'));}
  cR(p,cx-5,cx+5,27,28,(x,y)=>Wt[y===27?2:1]);p.set(cx-6,26,Wt[2]);p.set(cx+6,26,Wt[1]);
  cR(p,cx-3,cx+3,29,32,(x,y)=>y===29?B[1]:(x-cx)%2===0?Wt[1]:Wt[2]);cR(p,cx-4,cx-4,28,34,SK[0]);cR(p,cx+4,cx+4,28,34,SK[0]);
  cR(p,cx-6,cx+6,33,35,(x,y)=>Math.abs(x-cx)>5&&y===35?null:Wt[(x+y)%3?2:1]);for(let x=cx-4;x<=cx+4;x++)p.set(x,36,Wt[1]);
  // Tschako mit Kokarde und Federbusch
  cR(p,cx-7,cx+7,5,8,(x,y)=>sh(B,x,cx-7,.85));cR(p,cx-6,cx+6,8,18,(x,y)=>sh(B,x,cx-6,.8));cR(p,cx-7,cx+7,16,18,(x,y)=>G[y===16?3:y===17?2:1]);cR(p,cx-7,cx+7,5,5,G[2]);
  cDisc(p,cx,11,2.6,(x,y,d)=>d<1.2?hex(lead?'#e03030':'#ffffff'):G[x<cx?3:2]);
  for(const s of[-1,1])cLine(p,cx+s*7,18,cx+s*7,31,1,()=>G[1]);
  const PL=lead?pal(['#c8c8d0','#f0f0f8','#ffffff']):pal(['#801010','#c02020','#ff4040']);for(let y=0;y<5;y++)for(let x=cx-2+((5-y)>>2)*0;x<=cx+2;x++){if(Math.abs(x-cx)>(y+1)*.55)continue;p.set(x,y+(lead?0:1),cPick(PL,.75-(x-cx)/6));}
  if(lead){cR(p,cx-1,cx+1,0,1,G[3]);}
  outline(p);return p.done();}
// ---------- Lager: Zelt, Feuer, Nuss ----------
function drawTent(v){const W=58,H=42,p=new Px(W,H),A=v?pal(['#7a1414','#a82020','#cc3a30']):pal(['#123018','#1e4a24','#2e6a34']),Wt=pal(['#b8b0a0','#dcd4c4','#f4eee0']);
  for(let y=6;y<H-1;y++){const hw=(y-5)/(H-6)*26;for(let x=Math.round(29-hw);x<=Math.round(29+hw);x++){const st=Math.floor((x-3)/6)%2,L=.7-(x-29)/60-(y/H)*.15;p.set(x,y,st?cPick(Wt,L):cPick(A,L));}}
  for(let y=16;y<H-1;y++){const hw=(y-15)/(H-16)*8;for(let x=Math.round(29-hw);x<=Math.round(29+hw);x++)p.set(x,y,hex(x<29?'#1e140c':'#2a1c10'));}
  cLine(p,29,16,20,H-2,1.2,()=>Wt[2]);for(let y=0;y<7;y++)p.set(29,y,hex('#5a3418'));cR(p,30,34,0,3,(x,y)=>hex(v?'#ffe060':'#e03030'));
  for(const x of[4,54])cR(p,x,x,H-3,H-1,hex('#5a3418'));outline(p);return p.done();}
function drawFire(f){const W=26,H=24,p=new Px(W,H),S=pal(['#4a4a50','#6a6a72','#8a8a94']),Wd=pal(['#3a2010','#5a3418','#7a4a22']),F=pal(['#c02a08','#f06010','#ffa020','#ffe060','#fff8c0']);
  for(let k=0;k<9;k++){const a=k/9*6.283,x=13+Math.cos(a)*10,y=20+Math.sin(a)*2.5;cR(p,x-1,x+1,y-1,y+1,S[k%3]);}
  cLine(p,5,21,21,16,2.4,()=>Wd[1]);cLine(p,5,16,21,21,2.4,()=>Wd[2]);
  for(let y=2;y<19;y++){const t=(19-y)/17,hw=(1-t)*6.5*(1+Math.sin(y*.9+f*2.4)*.15)+.5;for(let x=Math.round(13-hw+Math.sin(y*.5+f*3)*1.2);x<=Math.round(13+hw+Math.sin(y*.5+f*3)*1.2);x++){
    const d=Math.abs(x-13)/(hw+.01);if(hash2(x,y,4570+f)<t*.55)continue;p.set(x,y,cPick(F,.95-d*.5-t*.55));}}return p.done();}
function drawNutShot(){const p=new Px(7,7),C=pal(['#5a3410','#7a4a1c','#9a6428','#c08a40']);cDisc(p,3,3.4,3,(x,y,d)=>cPick(C,.75-(x+y-6)/10-(d>2.3?.25:0)));p.set(3,0,C[0]);return p.done();}
// ---------- Eigener Atlas und Bild-Vorrat ----------
const CANDY_N=110,CPROP_N=90;let candyMesh=null,candyProp=null,candyMat=null;const candyFree=[];
function initCandyAtlas(){const L=[];
  for(const[k,f]of[['0',0],['1',1],['2',2],['a','a']]){L.push(['gb_'+k,drawGinger(f,false)]);L.push(['gba_'+k,drawGinger(f,true)]);}
  for(const lead of[0,1]){const pre=lead?'nl_':'nk_';L.push([pre+'0',drawNut(lead,'march',0)]);L.push([pre+'1',drawNut(lead,'march',1)]);L.push([pre+'2',drawNut(lead,'march',2)]);
    L.push([pre+'c',drawNut(lead,'aim',0)]);L.push([pre+'a',drawNut(lead,'fire',0)]);L.push([pre+'w1',drawNut(lead,'work','w1')]);L.push([pre+'w2',drawNut(lead,'work','w2')]);
    const rest=drawNut(lead,'work','w2x');L.push([pre+'s',squashCv(rest,1.1,.66)]);L.push([pre+'k',squashCv(drawNut(lead,'march',0),1.12,.62)]);}
  L.push(['ctent0',drawTent(0)],['ctent1',drawTent(1)],['cfire0',drawFire(0)],['cfire1',drawFire(1)],['cnut',drawNutShot()]);
  const AW=1024;let x=2,y=2,rowH=0;const pos=[];L.sort((a,b)=>b[1].height-a[1].height);for(const[n,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([n,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  let AH=64;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');
  for(const[n,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[n]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  candyMat=bbMaterial(tex,0,0);candyMat.uniforms.time=decorMat.uniforms.time;EXTRA_BB.push(candyMat);
  const ph=n=>{const a=[];for(let k=0;k<n;k++)a.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'cnut',tint:1});return a;};
  candyMesh=makeBillboards(ph(CANDY_N),candyMat);candyMesh.frustumCulled=false;candyMesh.geometry.instanceCount=CANDY_N;scene.add(candyMesh);
  candyProp=makeBillboards(ph(CPROP_N),candyMat);candyProp.frustumCulled=false;candyProp.geometry.instanceCount=0;scene.add(candyProp);
  for(let k=CANDY_N-1;k>=0;k--)candyFree.push(k);}
{const i2=initDemons;initDemons=function(a){i2(a);try{initCandyAtlas();}catch(e){console.error('Candyland-Bilder',e);}};}
// ---------- Wesen ----------
Object.assign(DT,{
  ginger:{name:'Lebkuchenmann',fac:'neutral',h:1.3,hp:45,dmg:6,spd:3.4,reach:1.3,cd:1.1,spr:e=>e.angry?'gba_':'gb_',xp:6,rad:.32,aggro:40,loot:[['gingerbread',1,1],['gingerbread',1,.45]]},
  nutk:{name:'Nussknacker',fac:'demon',h:2.2,hp:95,dmg:11,spd:3.4,reach:1.8,cd:1.4,spr:'nk_',side:1,xp:14,rad:.36,aggro:30,loot:[['nut',2,1],['nut',2,.5],['copper',6,.5]]},
  nutkl:{name:'Nussknacker-Hauptmann',fac:'demon',h:2.38,hp:220,dmg:15,spd:3.4,reach:1.9,cd:1.3,spr:'nl_',side:1,xp:40,rad:.38,aggro:34,loot:[['nut',4,1],['silver',2,.8],['kandis',2,.6]]}});
const CANDY_ENTS=[];
function candySpawn(type,x,z,o){if(!candyMesh||!candyFree.length)return null;const e=spawnEnt(type,x,z,Object.assign({ownMesh:candyMesh,ownI:candyFree.pop(),candy:1,noHostile:type==='ginger'},o||{}));CANDY_ENTS.push(e);return e;}
function candyDrop(e){const i=CANDY_ENTS.indexOf(e);if(i<0)return;CANDY_ENTS.splice(i,1);if(e.ownMesh===candyMesh&&e.ownI!=null){candyFree.push(e.ownI);e.ownI=null;}}
{const re0=removeEnt;removeEnt=function(e){re0(e);if(e.candy)candyDrop(e);};}
// Passive Lebkuchen lassen sich trotzdem schlagen
{const et0=entTargets;entTargets=function(range,cone){const out=et0(range,cone),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),ey=P.y+P.eye*.6;
  for(const e of CANDY_ENTS){if(e.type!=='ginger'||e.dead||e.fac==='demon')continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d>range+.3+e.w*.25)continue;if(d>.3&&(dx*fx+dz*fz)/d<cone)continue;if(Math.abs(e.y+e.h*.5-ey)>e.h+1.4)continue;e.kind='demon';out.push(e);}return out;};}
const GB_LINES=['Lauf, lauf, so schnell du kannst!','Mich kriegst du nicht!','Hihi, Zuckerguss!','Hast du die Zinnköpfe gesehen?','Ich bin frisch gebacken!','Krümel, Krümel …'];
const GB_ANGRY=['Ihr habt einen von uns angegriffen!','Alle Mann, Krümel-Alarm!','Dafür bekommst du Zimt!','Wir sind mehr als du denkst!'];
const NK_MARCH=['Links, zwei, drei, vier!','Im Gleichschritt, marsch!','Augen geradeaus!','Haltung, Männer!'];
const NK_FIGHT=['Lebkuchen gesichtet!','Formation halten!','Zweite Reihe, Nachladen!','Für den Nussknacker-König!'];
const NK_CAMP=['Lager aufschlagen!','Gewehre umhängen und an die Arbeit!','Holz für das Feuer, aber zackig!','Schneller, ihr Zinnköpfe!'];
// ---------- Ein Candyland wird lebendig ----------
const CLAND=new Map();let candyT=0;
function candySpot(L,r,minP){const s=L.s;for(let t=0;t<40;t++){const a=Math.random()*6.283,d=Math.sqrt(Math.random())*s.R*(r||.85),x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;
    if(!wlWild(x,z)||wlBiomeOf(wlDom(x,z),x,z)!=='candy')continue;if(getHeight(x,z)<WATER+.5)continue;if(minP&&Math.hypot(x-P.x,z-P.z)<minP)continue;return[x,z];}return null;}
function candyActivate(s){const L={s,id:s.id,gb:[],sq:null,angry:false,calmT:0,gbN:s.big?14:7,refill:30};CLAND.set(s.id,L);
  for(let i=0;i<L.gbN;i++)candyAddGinger(L,0);
  const W=FLAGS.candyWiped||{};if(!(W[s.id]&&gameMinutes()-W[s.id]<1440))candyAddSquad(L);return L;}
function candyAddGinger(L,minP){const q=candySpot(L,.85,minP);if(!q)return null;const e=candySpawn('ginger',q[0],q[1],{land:L,angry:L.angry,special:gingerStep,onHurt:gingerHurt,promptName:null});
  if(!e)return null;if(L.angry){e.fac='demon';HOSTILES.push(e);}L.gb.push(e);return e;}
function candyDeactivate(L){for(const e of L.gb.slice())if(DEM.includes(e))removeEnt(e);else candyDrop(e);if(L.sq){for(const e of L.sq.all.slice())if(DEM.includes(e))removeEnt(e);else candyDrop(e);campStrike(L.sq);}CLAND.delete(L.id);}
// ---------- Lebkuchen-KI ----------
function gingerHurt(e,n,by){if(by==='player'||by==='kreak'||by==='ally')candyAnger(e.land);else if(by==='demon'){e.revT=8;}}
function candyAnger(L){L.calmT=0;if(L.angry)return;L.angry=true;for(const g of L.gb){if(g.dead)continue;g.angry=true;g.fac='demon';if(!HOSTILES.includes(g))HOSTILES.push(g);}
  const n=L.gb.filter(g=>!g.dead).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];if(n)say(n,GB_ANGRY[(Math.random()*GB_ANGRY.length)|0],2.6);toast('Die Lebkuchenmenschen sind wütend!');}
function candyCalm(L){L.angry=false;for(const g of L.gb){g.angry=false;if(g.dead)continue;g.fac='neutral';const i=HOSTILES.indexOf(g);if(i>=0)HOSTILES.splice(i,1);g.tgt=null;}}
function gbFoe(e){const L=e.land;let best=null,bd=1e9;const look=(t,d)=>{if(d<bd){bd=d;best=t;}};
  if(L.angry){if(state==='playing'&&P.x<60000){const d=Math.hypot(P.x-e.x,P.z-e.z);if(d<36)look('player',d);}for(const o of DEM)if(o.fac==='ally'&&!o.dead&&!o.down){const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<22)look(o,d);}}
  for(const o of CANDY_ENTS)if(o.type!=='ginger'&&!o.dead){const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<(e.revT>0?26:7))look(o,d*.9);}
  return best;}
function gingerStep(e,dt){const d=e.d;if(e.revT>0)e.revT-=dt;e.foeT=(e.foeT||0)-dt;if(e.foeT<=0){e.foeT=.4;e.foe=gbFoe(e);}
  const t=e.foe;if(t&&(t==='player'||!t.dead)){const[tx,,tz]=tPos(t),dist=Math.hypot(tx-e.x,tz-e.z),reach=d.reach+(t==='player'?.2:(t.d.rad||.3));
    if(e.wind>0){e.wind-=dt;e.frame='a';if(e.wind<=0&&dist<reach+.7)meleeHit(e,t,d.dmg);return true;}
    if(dist>reach)entMove(e,tx,tz,d.spd*(e.angry?1.15:1),dt);else if(e.atk<=0){e.atk=d.cd*(.85+Math.random()*.3);e.wind=.32;}else e.frame=0;return true;}
  // Friedlich: einfach hin und her
  if(!e.ax){for(let k=0;k<8;k++){const a=Math.random()*Math.PI,leg=4+Math.random()*8,ax=[Math.cos(a),Math.sin(a)];let ok=true;for(const sgn of[-1,1]){const x=e.home.x+ax[0]*leg*sgn,z=e.home.z+ax[1]*leg*sgn;if(!wlWild(x,z)||getHeight(x,z)<WATER+.4||wlBiomeOf(wlDom(x,z),x,z)!=='candy'){ok=false;break;}}
      if(ok){e.ax=ax;e.leg=leg;e.dir=1;break;}}if(!e.ax){e.ax=[1,0];e.leg=1;e.dir=1;}e.pause=Math.random()*2;}
  if(e.pause>0){e.pause-=dt;e.frame=0;return true;}
  const tx=e.home.x+e.ax[0]*e.leg*e.dir,tz=e.home.z+e.ax[1]*e.leg*e.dir;
  if(Math.hypot(tx-e.x,tz-e.z)<.25||entMove(e,tx,tz,d.spd*.42,dt)<.0005){e.dir*=-1;e.pause=.5+Math.random()*2.2;if(Math.random()<.1)e.ax=null;
    if(Math.random()<.04&&Math.hypot(P.x-e.x,P.z-e.z)<14)say(e,GB_LINES[(Math.random()*GB_LINES.length)|0],2.4);}
  return true;}
// ---------- Nussknacker-Trupp ----------
let SQN=0;
function candyAddSquad(L){const s=L.s,n=s.big?10:4;const q=candySpot(L,.5);if(!q)return;
  const S={id:++SQN,L,n,leader:null,men:[],all:[],state:'patrol',wp:null,foe:null,foeT:0,volT:2,hdg:Math.random()*6.283,excT:20+Math.random()*60,camp:null,shoutT:4,alertT:0,lastFoe:null};L.sq=S;
  let x=q[0],z=q[1];
  // Manchmal sind sie gerade unterwegs und haben woanders ihr Lager
  if(Math.random()<.4){const d=candyExcursionDest(S);if(d){x=d[0];z=d[1];S.state='camp';}}
  S.leader=candySpawn('nutkl',x,z,{sq:S,always:true,special:nutStep,onHurt:nutHurt,onDeath:nutDeath,name:'Nussknacker-Hauptmann'});if(!S.leader){L.sq=null;return;}S.all.push(S.leader);
  for(let i=0;i<n;i++){const[ox,oz]=sqSlot(S,i,x,z);const e=candySpawn('nutk',ox,oz,{sq:S,slot:i,always:true,special:nutStep,onHurt:nutHurt,onDeath:nutDeath});if(e){S.men.push(e);S.all.push(e);}}
  if(S.state==='camp')campPitch(S,x,z,true);}
function sqAlive(S){return S.all.filter(e=>!e.dead);}
function sqLead(S){return S.leader&&!S.leader.dead?S.leader:null;}
// Marsch: zwei Reihen hinter dem Hauptmann. Gefecht: Linie quer zum Feind
function sqSlot(S,i,lx,lz){const fx=-Math.sin(S.hdg),fz=-Math.cos(S.hdg),rx=-fz,rz=fx;const row=Math.floor(i/2)+1,side=i%2?1:-1;return[lx-fx*row*1.55+rx*side*.9,lz-fz*row*1.55+rz*side*.9];}
function sqLineSlot(S,i,n,cx,cz,tx,tz){const dx=tx-cx,dz=tz-cz,l=Math.hypot(dx,dz)||1,fx=dx/l,fz=dz/l,rx=-fz,rz=fx;const per=n>5?Math.ceil(n/2):n,rank=Math.floor(i/per),k=i%per,cnt=rank?n-per:per;
  const off=(k-(cnt-1)/2)*1.35+(rank?.65:0);return[cx+rx*off-fx*rank*1.3,cz+rz*off-fz*rank*1.3,rank];}
function sqCenter(S){const A=sqAlive(S);let x=0,z=0;for(const e of A){x+=e.x;z+=e.z;}return A.length?[x/A.length,z/A.length]:[S.L.s.x,S.L.s.z];}
function candyExcursionDest(S){const s=S.L.s;for(let t=0;t<30;t++){const a=Math.random()*6.283,d=s.R+50+Math.random()*120,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;
    if(!wlWild(x,z)||coreDist(x,z)<60)continue;const b=wlBiomeOf(wlDom(x,z),x,z);if(b==='candy'||b==='meer'||b==='insel')continue;const h=getHeight(x,z);if(h<WATER+.8)continue;
    if(Math.abs(getHeight(x+3,z)-h)+Math.abs(getHeight(x,z+3)-h)>1.6)continue;return[x,z];}return null;}
function sqFoe(S){const[cx,cz]=sqCenter(S);let best=null,bd=1e9;const R=S.alertT>0?46:26;
  if(state==='playing'&&P.x<60000&&!(cheatOn&&cheatOn())){const d=Math.hypot(P.x-cx,P.z-cz);if(d<R){bd=d*(S.alertT>0?.6:.85);best='player';}}
  for(const o of DEM)if(!o.dead&&!o.down&&(o.fac==='ally'||o.type==='ginger')){const d=Math.hypot(o.x-cx,o.z-cz);if(d<(o.type==='ginger'?26:20)&&d<bd){bd=d;best=o;}}
  return best;}
function nutHurt(e,n,by){const S=e.sq;if(!S)return;if(by==='player'){S.alertT=25;S.foe='player';}}
function nutDeath(e){const S=e.sq;if(!S)return;if(e===S.leader){const A=sqAlive(S);if(A.length)say(A[0],'Der Hauptmann ist gefallen!',2.5);}
  if(!sqAlive(S).length){FLAGS.candyWiped=FLAGS.candyWiped||{};FLAGS.candyWiped[S.L.id]=gameMinutes();campStrike(S);if(Math.hypot(e.x-P.x,e.z-P.z)<60){toast('Der Nussknacker-Trupp ist geschlagen!');gainXP(30);}}}
function sqShout(S,lines,p){const l=sqLead(S)||sqAlive(S)[0];if(!l||Math.hypot(l.x-P.x,l.z-P.z)>40)return;say(l,lines[(Math.random()*lines.length)|0],2.4);}
function sqThink(S,dt){const L0=sqLead(S),A=sqAlive(S);if(!A.length)return;if(S.alertT>0)S.alertT-=dt;S.shoutT-=dt;
  S.foeT-=dt;if(S.foeT<=0){S.foeT=.5;const f=sqFoe(S);if(f&&!S.foe){S.volT=Math.min(S.volT,1.2);sqShout(S,NK_FIGHT);if(S.state==='camp'&&S.camp)S.camp.paused=true;}S.foe=f;}
  const lead=L0||A[0];
  if(S.foe){S.mode='fight';return;}
  S.mode='move';
  if(S.state==='patrol'){S.excT-=dt;const s=S.L.s;
    if(!S.wp||Math.hypot(S.wp[0]-lead.x,S.wp[1]-lead.z)<2.5){const q=candySpot(S.L,.6);S.wp=q||[s.x,s.z];}
    if(S.excT<=0){const d=candyExcursionDest(S);S.excT=60+Math.random()*90;if(d){S.state='march';S.wp=d;sqShout(S,['Kompanie! Abmarsch!','Wir holen Holz. Im Gleichschritt, marsch!']);}}}
  else if(S.state==='march'){if(Math.hypot(S.wp[0]-lead.x,S.wp[1]-lead.z)<3){S.state='camp';campPitch(S,lead.x,lead.z);sqShout(S,NK_CAMP);}}
  else if(S.state==='camp'){const C=S.camp;if(!C){S.state='return';return;}C.paused=false;if(isNight())C.night=true;
    const clock=FLAGS.clock||0;if(C.night&&!isNight()&&clock>390&&clock<1080){campStrike(S);S.state='return';S.wp=[S.L.s.x,S.L.s.z];sqShout(S,['Lager abbrechen! Wir marschieren heim.','Aufstehen, ihr Schlafmützen!']);}}
  else if(S.state==='return'){S.wp=[S.L.s.x,S.L.s.z];if(Math.hypot(S.wp[0]-lead.x,S.wp[1]-lead.z)<S.L.s.R*.5){S.state='patrol';S.wp=null;S.excT=90+Math.random()*120;}}
  if(S.shoutT<=0){S.shoutT=14+Math.random()*16;if(S.state==='march'||S.state==='return'||S.state==='patrol')sqShout(S,NK_MARCH);else if(S.state==='camp'&&!isNight())sqShout(S,NK_CAMP);}}
function nutFire(e,t){const[tx,ty,tz]=tPos(t),hy=t==='player'?1.05:(t.h||1.3)*.55,sx=e.x,sy=e.y+e.h*.55,sz=e.z,dx=tx-sx,dy=ty+hy-sy,dz=tz-sz,d=Math.hypot(dx,dy,dz)||1,sp=24,T=d/sp;
  const sprd=(e===sqLead(e.sq)?.02:.055)*(1+d/30);NUTS.push({x:sx+dx/d*.8,y:sy,z:sz+dz/d*.8,vx:dx/T+(Math.random()-.5)*sprd*sp,vy:dy/T+4*T*.5+(Math.random()-.5)*sprd*sp,vz:dz/T+(Math.random()-.5)*sprd*sp,t:0,dmg:e.d===DT.nutkl?7:4,src:e});
  e.fireT=.22;const pd=Math.hypot(P.x-e.x,P.z-e.z);if(pd<45)try{Snd.pop();}catch(_){}
  for(let k=0;k<5;k++)spawnParticle(sx+dx/d*1.2,sy+.05,sz+dz/d*1.2,(Math.random()-.5)*.6,.6,(Math.random()-.5)*.6,0xe8e0d0,.7,.2);}
function faceTo(e,tx,tz){const dx=tx-e.x,dz=tz-e.z;e.flip=(dx*Math.cos(P.yaw)-dz*Math.sin(P.yaw))<0;}
function nutStep(e,dt){const S=e.sq,d=e.d;if(!S)return false;if(e.fireT>0){e.fireT-=dt;e.frame='a';return true;}
  const lead=sqLead(S),isLead=e===lead,A=sqAlive(S);
  if(S.mode==='fight'&&S.foe){const t=S.foe;if(t!=='player'&&t.dead){S.foe=null;return true;}const[tx,,tz]=tPos(t),dist=Math.hypot(tx-e.x,tz-e.z);
    // Nahkampf mit dem Bajonett, wenn jemand zu nahe kommt
    if(dist<d.reach+.5){if(e.wind>0){e.wind-=dt;e.frame='c';if(e.wind<=0)meleeHit(e,t,d.dmg);return true;}if(e.atk<=0){e.atk=d.cd;e.wind=.3;faceTo(e,tx,tz);}else e.frame='c';return true;}
    const men=A.filter(o=>o!==lead);
    if(isLead){// Abstand halten, Linie führen, Salven befehlen
      if(dist<8)entMove(e,e.x-(tx-e.x)/dist*3,e.z-(tz-e.z)/dist*3,d.spd*.8,dt);else if(dist>22)entMove(e,tx,tz,d.spd*.7,dt);else{e.frame=e.aim>0?'c':0;faceTo(e,tx,tz);}
      S.volT-=dt;if(S.volT<=0){S.volT=3.4+Math.random()*1.2;const nn=men.length;if(Math.hypot(e.x-P.x,e.z-P.z)<45)say(e,'Legt an! … Feuer!',1.6);men.forEach((m,i)=>{m.aim=.7+i*.07+Math.random()*.08;});e.aim=.75;}
      if(e.aim>0){e.aim-=dt;e.frame='c';faceTo(e,tx,tz);if(e.aim<=0&&dist<34)nutFire(e,t);}return true;}
    // Soldat: in die Linie, dann auf Befehl schießen. Ohne Hauptmann jeder für sich
    const k=men.indexOf(e),c=lead?[lead.x+(tx-lead.x)/(Math.hypot(tx-lead.x,tz-lead.z)||1)*1.8,lead.z+(tz-lead.z)/(Math.hypot(tx-lead.x,tz-lead.z)||1)*1.8]:sqCenter(S);
    const[sx,sz]=sqLineSlot(S,Math.max(0,k),men.length,c[0],c[1],tx,tz);
    if(!lead){e.solo=(e.solo==null?1+Math.random()*2:e.solo)-dt;if(e.solo<=0&&!(e.aim>0)){e.solo=2.6+Math.random()*1.6;e.aim=.6;}if(dist<7){entMove(e,e.x-(tx-e.x)/dist*3,e.z-(tz-e.z)/dist*3,d.spd,dt);return true;}if(dist>20){entMove(e,tx,tz,d.spd,dt);return true;}}
    else if(Math.hypot(sx-e.x,sz-e.z)>.45&&!(e.aim>0)){entMove(e,sx,sz,d.spd*1.25,dt);return true;}
    if(e.aim>0){e.aim-=dt;e.frame='c';faceTo(e,tx,tz);if(e.aim<=0&&dist<34)nutFire(e,t);}else{e.frame=0;faceTo(e,tx,tz);}return true;}
  e.aim=0;
  // Lager
  if(S.state==='camp'&&S.camp)return campStep(e,S,dt,isLead);
  // Marschieren
  if(isLead||(!lead&&e===A[0])){if(!S.wp){e.frame=0;return true;}const ox=e.x,oz=e.z,mv=entMove(e,S.wp[0],S.wp[1],d.spd*.72,dt);if(mv>.0005){const h=Math.atan2(-(e.x-ox),-(e.z-oz));let dh=h-S.hdg;dh=Math.atan2(Math.sin(dh),Math.cos(dh));S.hdg+=dh*Math.min(1,dt*2.5);}else e.frame=0;return true;}
  const ref=lead||A[0],k=S.men.filter(o=>!o.dead&&o!==ref).indexOf(e);const[sx,sz]=sqSlot(S,Math.max(0,k),ref.x,ref.z),dd=Math.hypot(sx-e.x,sz-e.z);
  if(dd>.2)entMove(e,sx,sz,Math.min(d.spd*1.5,d.spd*.72+dd*1.2),dt);else e.frame=0;if(dd>40){e.x=sx;e.z=sz;}return true;}
// ---------- Lager aufschlagen, abbauen, übernachten ----------
function campPitch(S,x,z,instant){const n=S.n>5?4:2,props=[{spr:'cfire0',x,z,fire:1,w:1.5}];for(let i=0;i<n;i++){const a=i/n*6.283+.4,r=5.2+(i%2)*.8;props.push({spr:i===0?'ctent1':'ctent0',x:x+Math.cos(a)*r,z:z+Math.sin(a)*r,w:3.4});}
  S.camp={x,z,props,night:isNight(),t:0};for(const p of props){p.y=getHeight(p.x,p.z);const s=SPR[p.spr];p.h=p.w*s.h/s.w;}if(!instant)for(let k=0;k<20;k++)spawnParticle(x+(Math.random()-.5)*8,getHeight(x,z)+.3,z+(Math.random()-.5)*8,0,1,0,0xd8c8a0,.8,.25);}
function campStrike(S){if(!S||!S.camp)return;for(const e of S.all){if(e.job&&e.job.b)e.job.b._claim=null;e.job=null;}S.camp=null;}
function campStep(e,S,dt,isLead){const C=S.camp,d=e.d;C.t+=dt;
  if(isNight()){// alle ums Feuer, sitzen
    const A=sqAlive(S),k=A.indexOf(e),a=k/A.length*6.283,sx=C.x+Math.cos(a)*2.3,sz=C.z+Math.sin(a)*2.3;if(e.job){if(e.job.b)e.job.b._claim=null;e.job=null;}
    if(Math.hypot(sx-e.x,sz-e.z)>.3){entMove(e,sx,sz,d.spd*.7,dt);}else e.frame='s';return true;}
  if(isLead){const sx=C.x+2,sz=C.z+1.5;if(Math.hypot(sx-e.x,sz-e.z)>.4)entMove(e,sx,sz,d.spd*.6,dt);else e.frame=0;return true;}
  // tagsüber: mit umgehängtem Gewehr abbauen
  if(e.rest>0){e.rest-=dt;e.frame=0;return true;}
  if(!e.job){let pick=null;const cand=[];for(const b of hvNear(C.x,C.z,24)){if(b._gone||!b._hv||b._claim||!b._m||!b._m.parent)continue;if(b.x>60000)continue;cand.push(b);if(cand.length>40)break;}
    if(cand.length)pick=cand[(Math.random()*cand.length)|0];if(!pick){e.rest=3+Math.random()*3;const a=Math.random()*6.283;e.ix=C.x+Math.cos(a)*3.5;e.iz=C.z+Math.sin(a)*3.5;return true;}
    pick._claim=e;e.job={b:pick,t:0,dur:pick._hv.t==='soft'?2+Math.random()*2:4.5+Math.random()*4};}
  const J=e.job,b=J.b;if(!b||b._gone||!b._m||!b._m.parent){if(b)b._claim=null;e.job=null;return true;}
  const reachB=.9+Math.min(1.2,b.w*.18),dist=Math.hypot(b.x-e.x,b.z-e.z);
  if(dist>reachB){entMove(e,b.x,b.z,d.spd*.75,dt);e.frame=e.frame===0?1:e.frame;return true;}
  J.t+=dt;const sw=Math.floor(J.t/.36)%2;e.frame=sw?'w2':'w1';faceTo(e,b.x,b.z);
  if(sw!==J.sw){J.sw=sw;if(sw){const pd=Math.hypot(P.x-e.x,P.z-e.z),T=b._hv.t,col=T==='rock'?0x9aa0aa:T==='tree'?0x9a6a36:0x6aaa5a;
    if(pd<60)for(let i=0;i<4;i++)spawnParticle(b.x+(Math.random()-.5)*.5,b.y+Math.min(b.h*.35,1.4),b.z+(Math.random()-.5)*.5,(Math.random()-.5)*2.4,1+Math.random()*1.5,(Math.random()-.5)*2.4,col,.5,.18);
    if(pd<30)try{T==='rock'?Snd.clink(.35):T==='tree'?Snd.chop():0;}catch(_){}}}
  if(J.t>=J.dur){FLAGS.harv=FLAGS.harv||{};FLAGS.harv[b._hk]=gameMinutes();const pd=Math.hypot(P.x-e.x,P.z-e.z);if(b._hv.t==='tree'&&pd<50)try{Snd.treeFall();}catch(_){}
    for(let i=0;i<12;i++)spawnParticle(b.x+(Math.random()-.5),b.y+.4+Math.random()*1.5,b.z+(Math.random()-.5),(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,b._hv.t==='rock'?0x8a8e94:0x7a5228,.9,.25);
    hvGone(b);b._claim=null;e.job=null;e.rest=1.5+Math.random()*3;}
  return true;}
// ---------- Nüsse fliegen ----------
const NUTS=[];
function updateNuts(dt){for(let i=NUTS.length-1;i>=0;i--){const n=NUTS[i];n.t+=dt;n.vy-=4*dt;n.x+=n.vx*dt;n.y+=n.vy*dt;n.z+=n.vz*dt;let hit=null;
  if(state==='playing'&&Math.hypot(P.x-n.x,P.z-n.z)<.6&&n.y>P.y-.1&&n.y<P.y+1.9)hit='player';
  if(!hit)for(const e of DEM){if(e.dead||e.down||e===n.src||e.type==='nutk'||e.type==='nutkl')continue;if(e.fac!=='ally'&&e.type!=='ginger')continue;if(Math.hypot(e.x-n.x,e.z-n.z)<(e.d.rad||.35)+.25&&n.y>e.y-.1&&n.y<e.y+e.h+.1){hit=e;break;}}
  const g=getHeight(n.x,n.z);
  if(hit||n.t>2.6||n.y<g){if(hit==='player'){takeDamage(n.dmg);const l=Math.hypot(n.vx,n.vz)||1;P.vx+=n.vx/l*1.5;P.vz+=n.vz/l*1.5;try{Snd.hit('fist');}catch(_){}}else if(hit)hurtEnt(hit,n.dmg,'demon');
    for(let k=0;k<6;k++)spawnParticle(n.x,Math.max(g,n.y)+.05,n.z,(Math.random()-.5)*2.5,Math.random()*2,(Math.random()-.5)*2.5,0x8a5a28,.5,.14);NUTS.splice(i,1);}}}
// ---------- Takt: Candylands erwecken und schlafen legen ----------
function candyTick(dt){candyT-=dt;if(candyT>0)return;candyT=1;if(!WL_READY||!candyMesh)return;
  if(P.x>60000){for(const[,L]of CLAND)candyDeactivate(L);return;}
  const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=wlSite(ci+a,cj+b);if(s.b!=='candy'||CLAND.has(s.id))continue;if(Math.hypot(s.x-P.x,s.z-P.z)<s.R+380)candyActivate(s);}
  for(const[,L]of CLAND){const s=L.s,d=Math.hypot(s.x-P.x,s.z-P.z),S=L.sq,sd=S&&sqAlive(S).length?(()=>{const[x,z]=sqCenter(S);return Math.hypot(x-P.x,z-P.z);})():1e9;
    if(d>s.R+760&&sd>700){candyDeactivate(L);continue;}
    L.gb=L.gb.filter(g=>DEM.includes(g));
    // Wut verraucht, wenn der Spieler weg ist
    if(L.angry){if(Math.hypot(s.x-P.x,s.z-P.z)>s.R+60||state==='dead'){L.calmT+=1;if(L.calmT>20)candyCalm(L);}else L.calmT=0;}
    // neue Lebkuchen backen sich nach
    L.refill-=1;if(L.refill<=0){L.refill=45;if(L.gb.filter(g=>!g.dead).length<L.gbN)candyAddGinger(L,30);}
    if(S&&S.all)S.all=S.all.filter(e=>DEM.includes(e));}}
function candyFrame(dt){if(!candyMesh)return;const run=state!=='cutscene'&&state!=='loading'&&state!=='menu';
  if(run&&state!=='inventory'){for(const[,L]of CLAND)if(L.sq&&sqAlive(L.sq).length)sqThink(L.sq,dt);updateNuts(dt);}
  // Lager und Nüsse zeichnen
  const g=candyProp.geometry.attributes;let n=0;const put=(x,y,z,w,h,spr,tint)=>{if(n>=CPROP_N)return;const s=SPR[spr];g.offset.array[n*3]=x;g.offset.array[n*3+1]=y;g.offset.array[n*3+2]=z;g.size.array[n*2]=w;g.size.array[n*2+1]=h;
    g.uvr.array[n*4]=s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=tint||1;g.rot.array[n]=0;n++;};
  for(const[,L]of CLAND){const C=L.sq&&L.sq.camp;if(!C)continue;for(const p of C.props){if(Math.hypot(p.x-camera.position.x,p.z-camera.position.z)>260)continue;
      if(p.fire){const f=Math.floor(time*6)%2;put(p.x,p.y-.05,p.z,p.w,p.h,'cfire'+f,1.35);if(run&&Math.random()<dt*10)spawnParticle(p.x+(Math.random()-.5)*.4,p.y+.9,p.z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.4+Math.random(),(Math.random()-.5)*.3,Math.random()<.5?0xffa020:0x8a8a8a,1.1,.22);}
      else put(p.x,p.y-.08,p.z,p.w,p.h,p.spr,.95);}}
  for(const q of NUTS)put(q.x,q.y-.09,q.z,.18,.18,'cnut',1);
  candyProp.geometry.instanceCount=n;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;}
{const ud2=updateDemons;updateDemons=function(dt){
  if(candyMesh){const o=candyMesh.geometry.attributes.offset;for(let k=0;k<CANDY_N;k++)o.array[k*3+1]=-999;o.needsUpdate=true;}
  ud2(dt);try{candyTick(dt);candyFrame(dt);}catch(e){if(!candyFrame.err){candyFrame.err=1;console.error('Candyland',e);}}};}
// Neue Welt / Laden: alles Candyland vergessen
{const wr0=wlReset;wlReset=function(){for(const[,L]of CLAND)candyDeactivate(L);NUTS.length=0;return wr0.apply(this,arguments);};}
