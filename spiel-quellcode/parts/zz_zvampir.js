/* =========================================================
   0.0.109 · Nadelwald, Friedhöfe, der Vampir und der Totengräber
   - Neues Biom „Nadelwald“: dunkle Tannen, viele tote Bäume und Lichtungen.
     Das bisherige Nadel-Biom der Wildnis heißt jetzt „Nordwald“ (so sieht es auch aus).
   - Im Nadelwald liegen Friedhöfe. In 12 % steht in der Mitte ein großer Steinsarg.
     Manche Friedhöfe bewacht ein Totengräber (Kürbismaske, Sense, Sprungangriffe).
   - Fledermaustotem auf den Sarg legen: Graf Morvan, der Vampir, erwacht. Man kann
     mit ihm reden und handeln, nach 3 Minuten greift er an. Er verwandelt sich in eine
     Fledermaus, Knoblauch hält ihn fern, töten kann ihn nur ein Holzpflock.
   - Fledermäuse leben in Savannen, Wüsten und Steinwüsten.
   ========================================================= */
// =========================================================
// Dinge
// =========================================================
Object.assign(ITEMS,{batwing:{name:'Fledermausflügel',plural:'Fledermausflügel'},battotem:{name:'Fledermaustotem',plural:'Fledermaustotems'},
  stake:{name:'Holzpflock',plural:'Holzpflöcke',weapon:'stake'},garlic:{name:'Knoblauch',plural:'Knoblauch'},vfang:{name:'Vampirgebiss',plural:'Vampirgebisse'}});
Object.assign(ITEM_DESC,{batwing:'Ledrig und dünn. Von Fledermäusen aus Savanne und Wüste',battotem:'Legt man es auf einen alten Steinsarg, erwacht, was darin schläft …',
  stake:'Ein angespitzter Pflock aus Holz. Nur damit lässt sich ein Vampir endgültig töten',garlic:'Riecht scharf. Halte ihn in der Hand oder iss ihn (Rechtsklick), dann bleiben Vampire auf Abstand',
  vfang:'Die Reißzähne von Graf Morvan. Eine seltene Trophäe'});
WEAPONS.stake={cost:6,dmg:9,range:2.0,cd:.45};
RECIPES.push({id:'battotem',need:{batwing:2,silk:1,stick:1}},{id:'stake',need:{stick:2}});
try{STALL.Wilma.pool.push(['garlic',5],['garlic',5]);STALL.Anselm.pool.push(['garlic',6]);STALL.Wilma.sell.push(['garlic',2]);STALL.Kuno.sell.push(['vfang',160],['batwing',6]);}catch(e){}
const VNAME='Graf Morvan';
// =========================================================
// Bilder
// =========================================================
const vpPoly=(p,pts,col)=>{const xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]);for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++)for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++){
  let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)ins=!ins;}if(ins)p.set(x,y,typeof col==='function'?col(x,y):col);}};
const vpLine=(p,x0,y0,x1,y1,w,col)=>{const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.5));for(let t=0;t<=n;t++){const X=x0+(x1-x0)*t/n,Y=y0+(y1-y0)*t/n;for(let o=0;o<w;o++)p.set(X+o-(w>>1),Y,typeof col==='function'?col(t/n,o):col);}};
const VP_SKIN=pal(['#7e7e8e','#a8a8ba','#cacad8','#e8e8f2']);
const VP_LOOK={race:'human',sex:'m',age:'adult',hair:'short',hairColor:'black',beard:'none',cloth:'tunic',clothColor:'black',pants:'black',eyes:'red'};
function vpDraw(f){const c=Object.assign(defaultChar(),VP_LOOK,{skinP:VP_SKIN}),pose=f==='a'||f==='c'?'up':f==='k'?'crouch':null,fr=typeof f==='number'?f:0;
  let A;try{A=pose?drawHero(c,fr,false,pose,'R'):drawHero(c,fr);}catch(e){A=drawHero(c,fr);}
  const W=A.width,H=A.height,p=new Px(W,H),hb=A.headBox||[18,26,6,15],cx=(hb[0]+hb[1])>>1,ny=hb[3]+1,bot=H-2-(f==='k'?0:0);
  const OUT=pal(['#0a070c','#16101a','#221826']),LIN=pal(['#4a0810','#740e1a','#9a1626']);
  // Umhang hinter dem Körper
  vpPoly(p,[[cx-7,ny],[cx+7,ny],[cx+12,bot],[cx-12,bot]],(x,y)=>{const e=Math.abs(x-cx)>=Math.max(7,7+(y-ny)/(bot-ny)*5)-2;return e?LIN[shadeIdx(.5+(hash2(x,y,61)-.5)*.4,3,x,y)]:OUT[shadeIdx(.55-(x-cx)/30,3,x,y)];});
  for(let x=cx-12;x<=cx+12;x++)if(hash2(x,7,62)<.4)p.set(x,bot+1,OUT[0]);
  // hoher Kragen
  vpPoly(p,[[cx-9,ny-7],[cx-4,ny+1],[cx-8,ny+2]],(x,y)=>x<cx-7?OUT[1]:LIN[1]);vpPoly(p,[[cx+9,ny-7],[cx+4,ny+1],[cx+8,ny+2]],(x,y)=>x>cx+7?OUT[1]:LIN[1]);
  const o=p.done(),x=o.getContext('2d');x.drawImage(A,0,0);
  // Brosche, Reißzähne, rote Augen
  const my=hb[2]+Math.round((hb[3]-hb[2])*.78);x.fillStyle='#f4f4f8';x.fillRect(cx-2,my,1,1);x.fillRect(cx+1,my,1,1);
  const ey=hb[2]+Math.floor((hb[3]-hb[2]+1)*.45);x.fillStyle='#ff2030';x.fillRect(cx-2,ey,1,1);x.fillRect(cx+2,ey,1,1);
  x.fillStyle='#c8102a';x.fillRect(cx,ny+2,1,1);x.fillStyle='#e8c040';x.fillRect(cx-1,ny+2,1,1);
  o.headBox=A.headBox;return o;}
function vpBat(f,big){const s=big?1.6:1,W=Math.round(24*s),H=Math.round(14*s),p=new Px(W,H),cx=(W-1)/2,cy=H*.45,B=pal(big?['#100a10','#1e1420','#302034','#46304a']:['#1a1418','#2e2228','#463440','#5e4858']),
    M=pal(big?['#1a0a12','#2c1020','#401830']:['#22161a','#382428','#4e3236']);
  const tipY=f===1?cy-5*s:f===2?cy+4*s:cy-1*s,midY=f===1?cy-2*s:f===2?cy+2*s:cy;
  for(const sd of[-1,1]){vpPoly(p,[[cx+sd*1.5*s,cy-1.5*s],[cx+sd*6*s,midY-2*s],[cx+sd*11.5*s,tipY],[cx+sd*9*s,midY+2*s],[cx+sd*6.5*s,midY+1.2*s],[cx+sd*4*s,midY+3*s],[cx+sd*1.5*s,cy+2*s]],(x,y)=>M[shadeIdx(.5+(y-cy)/(H*1.2)+(hash2(x,y,63)-.5)*.3,3,x,y)]);
    vpLine(p,cx+sd*1.5*s,cy-1*s,cx+sd*11.5*s,tipY,1,B[0]);vpLine(p,cx+sd*6*s,midY-2*s,cx+sd*6.5*s,midY+1.2*s,1,B[1]);}
  for(let y=Math.floor(cy-3*s);y<=cy+3.5*s;y++)for(let x=Math.floor(cx-2*s);x<=cx+2*s;x++){const dx=(x-cx)/(2.2*s),dy=(y-cy)/(3.6*s);if(dx*dx+dy*dy<=1)p.set(x,y,B[shadeIdx(.6-dx*.3-dy*.2,4,x,y)]);}
  p.set(cx-1.3*s,cy-3.6*s,B[2]);p.set(cx+1.3*s,cy-3.6*s,B[2]);p.set(cx-1,cy-1.5*s,hex(big?'#ff2030':'#ff6a40'));p.set(cx+1,cy-1.5*s,hex(big?'#ff2030':'#ff6a40'));
  outline(p);return p.done();}
function tgDraw(f){const W=50,H=90,p=new Px(W,H),cx=25,j=f==='j',a=f==='a',oy=j?7:0,lL=f===1?2:0,rL=f===2?2:0;
  const C=pal(['#100c0e','#1c1618','#2a2224','#3a3030']),L=pal(['#121012','#1e1a1c','#2a2628']),O=pal(['#4a2004','#7a3a0a','#b05a12','#e08222','#f8aa40']),
    Wd=pal(['#2e1c0c','#4a3018','#6a4626']),St=pal(['#4a4e56','#7a7e88','#b4b8c0','#eef0f4']),Bn=hex('#c8c0a6'),G=hex('#ffd040'),G2=hex('#fff4a8');
  // Sense (hinter dem Körper, außer im Angriff)
  const scythe=(hx0,hy0,hx1,hy1,bx,by,dir)=>{vpLine(p,hx0,hy0,hx1,hy1,2,(t,o)=>Wd[o?0:2]);
    for(let k=0;k<=16;k++){const t=k/16,X=hx0+dir*(-t*17),Y=hy0+Math.sin(t*Math.PI*.9)*-3+t*7,th=Math.max(1,Math.round(3*(1-t)));for(let q=0;q<th;q++)p.set(X,Y+q,St[q===0?3:q===1?2:1]);}};
  if(!a)scythe(cx+12,6+oy,cx+7,84,0,0,1);
  // Beine
  const legTop=63+oy,legBot=j?84:86;
  vpLine(p,cx-3,legTop,cx-3-(j?3:0),legBot-lL,3,(t,o)=>L[o]);vpLine(p,cx+3,legTop,cx+3+(j?3:0),legBot-rL,3,(t,o)=>L[o]);
  for(const[x,y]of[[cx-4-(j?3:0),legBot-lL],[cx+3+(j?3:0),legBot-rL]])for(let k=0;k<4;k++)p.set(x+k-1,y+1,hex('#0c0a0a'));
  // Mantel mit zerfetztem Saum
  const sh=21+oy,hem=64+oy;for(let y=sh;y<=hem+5;y++){const k=(y-sh)/(hem-sh),w=(j?6:5)+k*(j?6:3.5);for(let x=Math.round(cx-w);x<=Math.round(cx+w);x++){const cut=hem+Math.floor(hash2(x,3,64)*6);if(y>cut)continue;
      p.set(x,y,C[shadeIdx(.6-(x-cx)/(w*2.6)+(Math.abs(x-cx)===2&&y>30+oy?-.3:0),4,x,y)]);}}
  for(let x=cx-6;x<=cx+6;x++)p.set(x,40+oy,hex('#5a4228'));
  // Arme
  if(a){vpLine(p,cx-5,sh+2,cx+9,sh+12,2,C[2]);vpLine(p,cx+5,sh+2,cx+14,sh+12,2,C[2]);p.set(cx+10,sh+13,Bn);p.set(cx+15,sh+13,Bn);
    // Sense vorne, waagerecht geschwungen
    vpLine(p,cx-14,sh+18,cx+22,sh+9,2,(t,o)=>Wd[o?0:2]);for(let k=0;k<=15;k++){const t=k/15,X=cx+22-t*6+Math.sin(t*2.6)*3,Y=sh+9+t*17,th=Math.max(1,Math.round(3*(1-t)));for(let q=0;q<th;q++)p.set(X-q,Y,St[q===0?3:q===1?2:1]);}}
  else{vpLine(p,cx-5,sh+2,cx-8,sh+24,2,C[2]);vpLine(p,cx+5,sh+2,cx+8,sh+24,2,C[2]);p.set(cx-8,sh+25,Bn);p.set(cx+8,sh+25,Bn);p.set(cx+8,sh+26,Bn);}
  // Kapuze und Kürbiskopf
  const hy=13+oy;for(let y=hy-9;y<=hy+9;y++)for(let x=cx-9;x<=cx+9;x++){const dx=(x-cx)/9,dy=(y-hy)/9.5;if(dx*dx+dy*dy<=1)p.set(x,y,C[shadeIdx(.45-dx*.2,4,x,y)]);}
  for(let y=hy-6;y<=hy+6;y++)for(let x=cx-7;x<=cx+7;x++){const dx=(x-cx)/7.2,dy=(y-hy)/6.2;if(dx*dx+dy*dy>1)continue;const rib=Math.abs(x-cx+3)<.6||Math.abs(x-cx-3)<.6;p.set(x,y,O[shadeIdx(.66-dx*.25-dy*.2+(rib?-.25:0),5,x,y)]);}
  p.set(cx,hy-7,hex('#3a4a1a'));p.set(cx+1,hy-8,hex('#4a5a22'));
  for(const s of[-1,1]){const ex=cx+s*3;p.set(ex,hy-1,G);p.set(ex-1,hy,G);p.set(ex,hy,G2);p.set(ex+1,hy,G);}
  for(let x=cx-4;x<=cx+4;x++){p.set(x,hy+3+((x&1)?0:1),G);if(!(x&1))p.set(x,hy+4,G2);}
  outline(p);return p.done();}
function tombTex(){const p=new Px(16,24),S=pal(['#3e3e44','#505056','#64646a','#78787e','#8c8c92']);for(let y=0;y<24;y++)for(let x=0;x<16;x++){if(y<4){const dx=(x-7.5)/7.6,dy=(y-4)/4;if(dx*dx+dy*dy>1)continue;}
    p.set(x,y,S[shadeIdx(.6+(hash2(x>>1,y>>1,65)-.5)*.35-(x<1||x>14?.15:0),5,x,y)]);if(hash2(x,y,66)<.06&&y>14)p.set(x,y,hex('#3e5a2a'));}
  for(let y=5;y<16;y++){p.set(7,y,S[0]);p.set(8,y,S[1]);}for(let x=4;x<12;x++){p.set(x,8,S[0]);p.set(x,9,S[1]);}for(let x=3;x<13;x+=2)p.set(x,19,S[1]);return p.done();}
function stoneTex(seed,cols,moss){const p=new Px(16,16),S=pal(cols);for(let y=0;y<16;y++)for(let x=0;x<16;x++){p.set(x,y,S[shadeIdx(.55+(hash2(x>>1,y>>1,seed)-.5)*.5+(hash2(x,y,seed+1)-.5)*.2,S.length,x,y)]);if(moss&&hash2(x,y,seed+2)<moss)p.set(x,y,hex('#3a5426'));}return p.done();}
function lidTex(){const p=new Px(24,40),S=pal(['#2e2e34','#3e3e44','#505056','#64646a','#78787e']),D=hex('#1e1e24');for(let y=0;y<40;y++)for(let x=0;x<24;x++){const b=x<2||y<2||x>21||y>37;p.set(x,y,S[shadeIdx(.6+(hash2(x>>1,y>>1,67)-.5)*.3+(b?.2:0),5,x,y)]);}
  // gemeißelte Fledermaus
  const cx=11.5,cy=15;for(const sd of[-1,1]){vpPoly(p,[[cx+sd*1,cy-2],[cx+sd*5,cy-5],[cx+sd*9,cy-3],[cx+sd*7,cy+1],[cx+sd*5,cy],[cx+sd*3,cy+3],[cx+sd*1,cy+2]],D);}
  for(let y=cy-3;y<=cy+4;y++)for(let x=cx-1.5;x<=cx+1.5;x++)p.set(x,y,D);p.set(cx-1,cy-4,D);p.set(cx+1,cy-4,D);
  for(let y=22;y<34;y++)p.set(11,y,S[0]),p.set(12,y,S[1]);for(let x=7;x<17;x++)p.set(x,25,S[0]);return p.done();}
function garlicCv(plant){const p=new Px(12,plant?16:12),Wh=pal(['#a49a86','#cec4b0','#ece4d4','#fffaf0']),G=pal(['#2a5a1e','#3e7a2a','#5a9a3a']),oy=plant?4:0;
  if(plant)for(let k=0;k<3;k++)vpLine(p,5+k,oy+3,3+k*3,0,1,G[k]);
  for(let y=0;y<8;y++)for(let x=0;x<12;x++){const dx=(x-5.5)/5.2,dy=(y-4.5)/4;if(dx*dx+dy*dy>1)continue;p.set(x,y+oy+2,Wh[shadeIdx(.65-dx*.25-dy*.2+(Math.abs(x-5.5)<.6||Math.abs(x-2.5)<.6||Math.abs(x-8.5)<.6?-.25:0),4,x,y)]);}
  if(!plant){p.set(5,1,G[1]);p.set(6,0,G[2]);p.set(6,1,G[1]);}outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{
  for(const f of[0,1,2,'a','c','k'])list.push(['vamp_'+f,vpDraw(f)]);
  for(const f of[0,1,2])list.push(['vbat_'+f,vpBat(f,true)]),list.push(['bat_'+f,vpBat(f,false)]);
  for(const f of[0,1,2,'a','j'])list.push(['tgr_'+f,tgDraw(f)]);
  list.push(['orb_blood',drawOrb(['#3a0208','#7a0a14','#c01020','#ff5060','#ffd0d4'])]);
}catch(e){console.error('Vampir: Bilder',e);}};}
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(15,11),M=pal(['#22161a','#3a2428','#56363c']),B=hex('#160e10');vpPoly(p,[[1,2],[6,1],[14,4],[12,9],[9,7],[6,10],[3,7]],(x,y)=>M[shadeIdx(.6-y/14+(hash2(x,y,68)-.5)*.3,3,x,y)]);
    vpLine(p,1,2,14,4,1,B);vpLine(p,6,1,9,7,1,B);vpLine(p,3,1,4,8,1,B);outline(p);list.push(['batwing',p.done()]);}
  {const p=new Px(14,18),Wd=pal(['#3a2410','#5a3a1c','#7a5228']),M=pal(['#1a1014','#2e1e24','#46303a']),S=hex('#e8e8f0');vpLine(p,7,7,7,17,2,(t,o)=>Wd[o?0:2]);
    for(const y of[11,14])for(let x=5;x<10;x++)p.set(x,y,S);
    for(const sd of[-1,1])vpPoly(p,[[7+sd,3],[7+sd*4,1],[7+sd*7,3],[7+sd*5,6],[7+sd*3,5],[7+sd,7]],(x,y)=>M[shadeIdx(.6-y/10,3,x,y)]);
    for(let y=2;y<8;y++)for(let x=6;x<9;x++)p.set(x,y,M[2]);p.set(6,2,hex('#ff3040'));p.set(8,2,hex('#ff3040'));outline(p);list.push(['battotem',p.done()]);}
  {const p=new Px(7,18),Wd=pal(['#4a3018','#6a4626','#8a6234','#a8804a']);for(let y=0;y<18;y++){const w=y<5?Math.ceil(y*.7):3;for(let x=3-w+1;x<=3+w-1;x++)p.set(x,y,Wd[shadeIdx(.6-(x-3)/6,4,x,y)]);}
    for(let x=1;x<6;x++)p.set(x,12,Wd[0]);outline(p);list.push(['stake',p.done()]);}
  list.push(['garlic',garlicCv(false)]);
  {const p=new Px(14,10),G=pal(['#6a1a20','#9a2a34','#c04a52']),T=pal(['#c8c0a8','#ece6d4','#ffffff']);for(let x=1;x<13;x++)for(let y=2;y<5;y++)p.set(x,y,G[shadeIdx(.6-(y-3)/4,3,x,y)]);
    for(let x=2;x<12;x++)p.set(x,5,T[1]);for(const fx of[3,10]){p.set(fx,6,T[2]);p.set(fx,7,T[2]);p.set(fx,8,T[1]);}for(let x=4;x<10;x+=2)p.set(x,6,T[0]);outline(p);list.push(['vfang',p.done()]);}
}catch(e){console.error('Vampir: Symbole',e);}};}
{const a=wlNewSprites;wlNewSprites=function(){const out=a();try{out.push(['garlic',garlicCv(true)]);}catch(e){}return out;};}
HV.wl_garlic={t:'soft',hp:1,d:[['garlic',1,2,1]],re:1440,small:1};
// Knoblauch essen: Vampire halten Abstand
{const a=rightClickUse;rightClickUse=function(){if(state==='playing'){const h=inv[HOT0+sel];if(h&&h.id==='garlic'){removeItem('garlic',1);P.garlicT=150;P.stats.hp=Math.min(P.stats.maxHp,P.stats.hp+3);
      try{Snd.munch();}catch(e){}toast('Knoblauchatem! Vampire halten jetzt 2½ Minuten Abstand.');renderStats();renderInv();return true;}}return a();};}
const vpRepelled=()=>(P.garlicT>0)||(()=>{const h=inv[HOT0+sel];return!!(h&&h.id==='garlic');})();
// =========================================================
// Das neue Biom: Nadelwald (mit Lichtungen und Friedhöfen)
// =========================================================
WLB.nadelwald.n='Nordwald';
Object.assign(WLB,{nadel2:{n:'Nadelwald',mus:'orte/nordwald',gloom:.4,cave:.35,reg:'nord'},lichtung:{n:'Nadelwald',mus:'orte/nordwald',gloom:.22,cave:0,reg:'nord'},
  friedhof:{n:'Friedhof',mus:'orte/nordwald',gloom:.5,cave:0,reg:'nord'}});
WL_HILLK.nadel2=.8;
Object.assign(WLP,{nadel2:[pal(['#1a2a1c','#223424','#2c3e2a','#364832','#40523a']),pal(['#362c22','#44382a','#524432'])],
  lichtung:[pal(['#2a4224','#34502c','#405e36','#4c6c40','#587848']),pal(['#3e4a2a','#4a5832'])],
  friedhof:[pal(['#242c20','#2c3626','#343e2c','#3c4632']),pal(['#362c24','#42362c','#4e4034'])]});
Object.assign(WLV,{nadel2:[['pine',.07,8,12,.4],['dpine',.045,9,13,.45],['dead',.055,5,8.5,.3],['stump',.014,.9,1],['fern',.05,.5,.7],['sgrass',.12,.4,.55,0,.06],['rock',.02,.9,1.5,.4],['mushroom',.008,.35,.4],['bones',.002,.4,.5]],
  lichtung:[['sgrass',.28,.4,.6,0,.08],['grass',.14,.4,.55,0,.08],['flower',.04,.35,.45,0,.05],['stump',.01,.9,1],['dead',.005,5,7,.3],['rock',.006,.7,1,.3],['garlic',.006,.35,.45],['mushroom',.006,.35,.4]],
  friedhof:[['sgrass',.07,.35,.5,0,.06],['mushroom',.003,.35,.4]]});
WLV.ebene.push(['garlic',.002,.35,.45]);WLV.wald.push(['garlic',.002,.35,.45]);
try{Object.assign(FA_BIO,{nadel2:[['A','elk',1,2,1.5],['A','deer',2,3,1.5],['A','wolf',3,5,.8],['A','bear',1,1,.6],['A','fox',1,2,1],['A','hare',1,2,1]]});FA_BIO.lichtung=FA_BIO.nadel2;FA_BIO.friedhof=[];
  Object.assign(FA_TGT,{nadel2:34,lichtung:34,friedhof:0});}catch(e){}
try{Object.assign(MAPC,{wl_nadel2:[34,66,48],wl_friedhof:[64,64,58],wl_nadelwald:[42,88,62]});BLUE_AREAS.add('wl_nadel2');}catch(e){}
// Die Hälfte der bisherigen Nadel-Regionen wird zum neuen Nadelwald
{const a=wlSite;wlSite=function(ci,cj){const s=a(ci,cj);if(!s._n2){s._n2=1;if(s.b==='nadelwald'&&hash2(ci*7+(WSEED%100003),cj*13+((WSEED>>>7)%100019),4970)<.5)s.b='nadel2';}return s;};}
{const a=wlBiomeH;wlBiomeH=function(b,x,z,s){if(b==='nadel2'){x+=WOX;z+=WOZ;return 5.5+(fbm(x*.005,z*.005,4,3103)-.5)*20;}if(b==='lichtung'||b==='friedhof')return a('nadel2',x,z,s);return a(b,x,z,s);};}
// ---------- Friedhöfe: Lage ----------
const GY_W=22,GY_D=16;
const gyLocal=(g,x,z)=>{const dx=x-g.x,dz=z-g.z;return[dx*g.c+dz*g.s,-dx*g.s+dz*g.c];};
const gyWorld=(g,lx,lz)=>[g.x+lx*g.c-lz*g.s,g.z+lx*g.s+lz*g.c];
function gyRectD(g,x,z){const[lx,lz]=gyLocal(g,x,z);return Math.hypot(Math.max(0,Math.abs(lx)-GY_W/2),Math.max(0,Math.abs(lz)-GY_D/2));}
const gyRawH=wlRawH;
function wlGy(s){if(s.gyDone)return s.gy;if(s.b!=='nadel2'||s.island){s.gyDone=true;return s.gy=null;}if(s.gyBusy)return null;s.gyBusy=1;s.gy=null;
  try{const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);
    if(hash2(A,B,4971)<.8){const r=mulberry32(4972+s.ci*7919+s.cj*15485+WSEED*29);
      for(let t=0;t<30&&!s.gy;t++){const a=r()*6.283,d=r()*s.R*.55,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d,rot=r()*6.283,g={x,z,c:Math.cos(rot),s:Math.sin(rot),rot};
        if(coreDist(x,z)<270||Math.abs(x)>WORLD_R-80||Math.abs(z)>WORLD_R-80)continue;
        let mn=1e9,mx=-1e9,sum=0,n=0,ok=true;for(const[lx,lz]of[[0,0],[-12,-9],[12,-9],[-12,9],[12,9],[0,-9],[0,9],[-12,0],[12,0]]){const[wx,wz]=gyWorld(g,lx,lz),h=gyRawH(wx,wz);mn=Math.min(mn,h);mx=Math.max(mx,h);sum+=h;n++;
          if(Math.abs(lx)>0&&wlDom(wx,wz)!==s){ok=false;break;}}
        if(!ok||mx-mn>4.5||mn<WATER+1.2)continue;const cv=wlCave(s);if(cv&&Math.hypot(cv.x-x,cv.z-z)<30)continue;
        Object.assign(g,{id:s.id+'_gy',h:sum/n,sarc:hash2(A,B,4973)<.12,guard:hash2(A,B,4974)<.4,site:s});s.gy=g;}}}
  finally{s.gyBusy=0;s.gyDone=true;}return s.gy;}
// Gelände im Friedhof eben machen
{const a=wlRawH;wlRawH=function(x,z){let h=a(x,z);const ci=Math.floor(x/WL_CELL),cj=Math.floor(z/WL_CELL);
  for(let p=-1;p<=1;p++)for(let q=-1;q<=1;q++){const s=wlSite(ci+p,cj+q);if(s.b!=='nadel2')continue;const g=wlGy(s);if(!g)continue;const d=gyRectD(g,x,z);if(d<9){const w=wsm(1-d/9);h=h*(1-w)+g.h*w;}}
  return h;};}
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){const b=a(s,x,z);if(b!=='nadel2')return b;const g=wlGy(s);if(g&&gyRectD(g,x,z)<2.5)return'friedhof';
  if(vnoise((x+WOX)*.012,(z+WOZ)*.012,4975)>.7)return'lichtung';return b;};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(k!=='wl_lichtung')return k;if(!AREAS.wl_nadel2){AREAS.wl_nadel2=WLB.nadel2.n;AREA_MUSIC.wl_nadel2=WLB.nadel2.mus;}return'wl_nadel2';};}
// =========================================================
// Friedhöfe: Aufbau in der Nähe
// =========================================================
const GY={built:new Map(),t:0};let GYM=null;
function gyMats(){if(GYM)return GYM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const L=(m,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(m)},o||{}));
  const stone=L(stoneTex(4980,['#3e3e44','#505056','#64646a','#78787e'],.04)),dark=L(stoneTex(4983,['#2a2a30','#38383e','#46464c','#56565c'],.03)),
    dirt=L(stoneTex(4986,['#2a1e14','#3a2a1c','#4a3624'],0)),wood=L(stoneTex(4989,['#2e1e10','#3e2a16','#4e361e'],0)),tomb=L(tombTex(),{alphaTest:.5}),lid=L(lidTex()),
    iron=new THREE.MeshLambertMaterial({color:0x1c1a20});
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  GYM={stone,dark,dirt,wood,tomb,lid,iron,gTomb:B(.72,1.05,.16),gBroken:B(.62,.55,.16),gMound:B(.8,.2,1.7),gCrossV:B(.12,1.25,.12),gCrossH:B(.62,.12,.12),gPost:B(.09,1.4,.09),gSpike:B(.05,.22,.05),
    gSarc:B(1.4,.95,2.6),gLid:B(1.62,.24,2.82),gPed:B(1.2,.4,1.2),gStV:B(.34,2.6,.34),gStH:B(1.4,.34,.34),gRub:B(.4,.25,.35)};
  GYM.tombM=[stone,stone,stone,stone,tomb,tomb];GYM.lidM=[dark,dark,lid,dark,dark,dark];return GYM;}
function gyState(g){FLAGS.gy=FLAGS.gy||{};return FLAGS.gy[g.id]||(FLAGS.gy[g.id]={v:0});}
function gyAdd(B,geo,mat,lx,lz,y,ry,rz){const M=gyMats(),m=new THREE.Mesh(geo,mat),[wx,wz]=gyWorld(B.g,lx,lz);m.position.set(wx,getHeight(wx,wz)+y,wz);m.rotation.y=-B.g.rot+(ry||0);if(rz)m.rotation.z=rz;B.grp.add(m);return m;}
function gyProp(B,lx,lz,r){const[x,z]=gyWorld(B.g,lx,lz),p={x,z,type:'prop',h:1,w:1,r};const k=gk(x,z);let l=tgrid.get(k);if(!l)tgrid.set(k,l=[]);l.push(p);B.props.push(p);return p;}
function gyBuild(g){const M=gyMats(),B={g,grp:new THREE.Group(),props:[],sarc:[],ents:[]},st=gyState(g),r=mulberry32(4990+((g.x*13+g.z*7)|0));GY.built.set(g.id,B);
  // Zaun mit Tor
  const hw=GY_W/2,hd=GY_D/2,edge=(x0,z0,x1,z1,gate)=>{const L=Math.hypot(x1-x0,z1-z0),n=Math.round(L/1.6);for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t;if(gate&&Math.abs(x)<1.7)continue;
      gyAdd(B,M.gPost,M.iron,x,z,.68);gyAdd(B,M.gSpike,M.iron,x,z,1.48);}
    const seg=(a,b)=>{const ax=x0+(x1-x0)*a,az=z0+(z1-z0)*a,bx=x0+(x1-x0)*b,bz=z0+(z1-z0)*b,l=Math.hypot(bx-ax,bz-az);if(l<.2)return;const ang=Math.atan2(bz-az,bx-ax);
      for(const y of[.32,1.1]){const m=gyAdd(B,new THREE.BoxGeometry(l,.06,.06),M.iron,(ax+bx)/2,(az+bz)/2,y,-ang);m.userData.own=1;}
      for(let d=0;d<=l;d+=.55)gyProp(B,ax+(bx-ax)*d/l,az+(bz-az)*d/l,.2);};
    if(gate){const a1=(-1.7-x0)/(x1-x0),a2=(1.7-x0)/(x1-x0);seg(0,Math.min(a1,a2));seg(Math.max(a1,a2),1);}else seg(0,1);};
  edge(-hw,-hd,hw,-hd);edge(-hw,hd,hw,hd,true);edge(-hw,-hd,-hw,hd);edge(hw,-hd,hw,hd);
  // Gräber
  for(const lz of[-5.6,-2.4,.8,4])for(const lx of[-9,-6.6,-4.2,4.2,6.6,9]){if(r()<.22)continue;const k=r(),tz=lz-.9;
    if(k<.6){gyAdd(B,M.gTomb,M.tombM,lx,tz,.47,(r()-.5)*.2,(r()-.5)*.12);gyProp(B,lx,tz,.34);}
    else if(k<.88){gyAdd(B,M.gCrossV,M.wood,lx,tz,.55,0,(r()-.5)*.15);gyAdd(B,M.gCrossH,M.wood,lx,tz,.8);gyProp(B,lx,tz,.15);}
    else{gyAdd(B,M.gBroken,M.tombM,lx,tz,.2,(r()-.5)*.3,.25*(r()<.5?-1:1));gyProp(B,lx,tz,.3);}
    gyAdd(B,M.gMound,M.dirt,lx,lz+.1,.04,(r()-.5)*.1);}
  // Mitte: Steinsarg oder großes Steinkreuz
  if(g.sarc){if(st.v!==3){B.sarc.push(gyAdd(B,M.gSarc,M.dark,0,-.5,.46));B.lid=gyAdd(B,M.gLid,M.lidM,0,-.5,1.05);if(st.v>=1){B.lid.position.y-=.05;B.lid.rotation.z=.32;const[ox,oz]=[g.c*.75,g.s*.75];B.lid.position.x+=ox;B.lid.position.z+=oz;}
      B.sarc.push(B.lid);for(const lz of[-1.5,-.5,.5])B.sarc.push(gyProp(B,0,lz,.8));}
    else gyRubble(B);}
  else{gyAdd(B,M.gPed,M.stone,0,-1.5,.18);gyAdd(B,M.gStV,M.stone,0,-1.5,1.6);gyAdd(B,M.gStH,M.stone,0,-1.5,2.2);gyProp(B,0,-1.5,.7);}
  scene.add(B.grp);
  // Wächter
  if(g.guard&&!st.dg){const[x,z]=gyWorld(g,-4,5.5);const e=tgSpawn(g,x,z);B.ents.push(e);}
  return B;}
function gyRubble(B){const M=gyMats(),r=mulberry32(4995);for(let i=0;i<9;i++){const a=r()*6.283,d=.3+r()*1.6;gyAdd(B,M.gRub,M.dark,Math.cos(a)*d,-.5+Math.sin(a)*d*1.3,.1,r()*3,(r()-.5)*.6);}}
function gyFree(B){scene.remove(B.grp);B.grp.traverse(o=>{if(o.userData&&o.userData.own)o.geometry.dispose();});for(const p of B.props){const l=tgrid.get(gk(p.x,p.z));if(l){const i=l.indexOf(p);if(i>=0)l.splice(i,1);}}
  for(const e of B.ents)if(e&&!e.dead)removeEnt(e);if(B.vamp&&!B.vamp.dead){vpPark(B.vamp);removeEnt(B.vamp);}GY.built.delete(B.g.id);}
function gyFreeAll(){for(const B of[...GY.built.values()])gyFree(B);}
{const a=wlReset;wlReset=function(){gyFreeAll();a();};}
function gyNearList(R){const out=[];if(!WL_READY)return out;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL),n=Math.ceil(R/WL_CELL)+1;
  for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++){const s=wlSite(ci+a,cj+b);if(s.b!=='nadel2')continue;const g=wlGy(s);if(g)out.push(g);}return out;}
// Sarg-Mitte in Weltkoordinaten
const gySarcPos=g=>{const[x,z]=gyWorld(g,0,-.5);return[x,getHeight(x,z),z];};
function gySarcLooked(){for(const B of GY.built.values()){const g=B.g;if(!g.sarc||!B.sarc.length)continue;const[x,y,z]=gySarcPos(g);if(Math.hypot(x-P.x,z-P.z)<3.4&&lookingAt(x,y+.9,z,4.4,.72))return B;}return null;}
// =========================================================
// Der Vampir
// =========================================================
Object.assign(DT,{vampir:{name:'Graf Morvan, der Vampir',fac:'demon',boss:1,h:2.5,hp:760,dmg:16,spd:3.8,reach:1.6,cd:1.1,wind:.35,spr:e=>e.bat?'vbat_':'vamp_',xp:320,aggro:40,leash:90,rad:.4,undead:1,fly:.001,loot:[]},
  bat:{name:'Fledermaus',fac:'demon',h:.6,hp:14,dmg:3,spd:6.5,reach:1.2,cd:1.1,wind:.25,spr:'bat_',fly:1.7,xp:4,aggro:9,leash:30,rad:.25,loot:[['batwing',1,.9],['batwing',1,.35]]},
  tgraeber:{name:'Totengräber',fac:'demon',h:2.9,hp:520,dmg:15,spd:3.3,reach:2.5,cd:1.6,wind:.5,spr:'tgr_',xp:170,aggro:24,leash:70,rad:.45,undead:1,fly:.001,
    loot:[['silver',6,1],['copper',20,.8],['bones',3,.8],['coin',1,.12]]}});
const VP={list:[]};let VP_PORT=null;
function vpPortrait(){if(VP_PORT)return VP_PORT;const s=SPR.vamp_0;if(!s)return null;const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d'),hb=s.c.headBox||[18,26,6,15];
  x.fillStyle='#1a0c12';x.fillRect(0,0,22,22);x.drawImage(s.c,-(((hb[0]+hb[1])>>1)-11),-(hb[2]-4));return VP_PORT=c;}
function vpSpawn(B,friendly,x,z){const e=spawnEnt('vampir',x,z,{home:{x,z},name:VNAME,role:'Vampir',portrait:vpPortrait(),talk:0,airK:0,gyB:B||null});e.h0=e.h;
  e.special=vpAI;e.onHurt=vpHurt;e.onDeath=vpDeath;VP.list.push(e);if(friendly){e.dormant=true;e.showDormant=true;e.friendly=1;e.rise=0;}else{e.aggroT=30;}if(B)B.vamp=e;return e;}
function vpPark(e){const i=VP.list.indexOf(e);if(i>=0)VP.list.splice(i,1);}
function vpPuff(e,n){mzBurst(e.x,e.y+(e.flyOff||0)+1,e.z,n||26,[0x1a0c12,0x3a1020,0x8a1020],5,.8,.35);}
function vpHostile(e,why){if(!e.friendly)return;e.friendly=0;e.dormant=false;e.showDormant=false;e.rise=null;e.aggroT=60;const B=e.gyB;if(B)gyState(B.g).v=2;
  if(shop&&shop.v===e)closeShop();if(dlg&&dlg.v===e)closeDialog();
  mzSay(e,why==='hit'?'Du wagst es, mich zu schlagen?!':'Genug geredet … Ich habe DURST!');try{Snd.demonRoar(.6,1.4);}catch(_){}vpPuff(e,40);saveGame();}
function vpBatGo(e,tx,tz){if(e.weakT>0)return;e.bat=1;e.inv=true;e.batT=0;e.btx=tx;e.btz=tz;e.h=.95;e.wind=0;e.cast=0;e.batCd=6+Math.random()*3;vpPuff(e,30);try{Snd.whoosh(1400,.08);}catch(_){}}
function vpLand(e){e.bat=0;e.inv=false;e.h=e.h0||e.d.h;e.flyOff=0;e.atk=.25;vpPuff(e,30);}
function vpAI(e,dt){e.airK=0;e.batCd=(e.batCd==null?4:e.batCd)-dt;e.boltT=(e.boltT==null?2.5:e.boltT)-dt;e.dmgWin=Math.max(0,(e.dmgWin||0)-dt*30);
  if(e.weakT>0){e.weakT-=dt;e.frame='k';e.wind=0;if(Math.random()<dt*8)spawnParticle(e.x+(Math.random()-.5),e.y+1+Math.random(),e.z+(Math.random()-.5),0,.8,0,0x8a1020,.6,.25);
    if(e.weakT<=0){e.weak=0;e.hp=Math.round(e.max*.25);mzSay(e,'Ihr Sterblichen … lernt es nie!');const a=Math.random()*6.283;vpBatGo(e,P.x+Math.cos(a)*9,P.z+Math.sin(a)*9);}return true;}
  if(e.bat){e.batT+=dt;e.flyOff=Math.min(1.8,e.batT*5);const d=Math.hypot(e.btx-e.x,e.btz-e.z);entMove(e,e.btx,e.btz,10.5,dt);if(Math.random()<dt*10)spawnParticle(e.x,e.y+e.flyOff+.4,e.z,0,.3,0,0x2a1020,.4,.25);
    if(d<.6||e.batT>3.5)vpLand(e);return true;}
  if(e.tgt!=='player')return false;
  const d=Math.hypot(P.x-e.x,P.z-e.z);
  if(e.cast>0){e.cast-=dt;e.frame='c';if(e.cast<=0)shoot(e,P.x,P.y+1,P.z,e.ice?{spd:19,dmg:13,col:0x9ae8ff,orb:'orb_frost',size:.7,life:3.5,home:.7,slow:2.2}:{spd:17,dmg:11,col:0xc0102a,orb:'orb_blood',size:.7,life:3.5,home:.7});return true;}
  const rep=vpRepelled();
  if(rep&&d<6.5){e.wind=0;if(time-(e.hissT||-9)>5){e.hissT=time;mzSay(e,['Knoblauch! Nimm das weg!','Dieser Gestank …!','Feigling! Komm her ohne dieses Kraut!'][(Math.random()*3)|0]);}
    if(e.boltT<=0){e.boltT=2+Math.random()*1.2;e.cast=.5;return true;}
    const a=Math.atan2(e.z-P.z,e.x-P.x)+(e.side||(e.side=Math.random()<.5?-1:1))*.35;if(entMove(e,P.x+Math.cos(a)*7,P.z+Math.sin(a)*7,e.d.spd*1.15,dt)<.001)e.side*=-1;return true;}
  if(e.batCd<=0&&d>11){const a=Math.atan2(e.z-P.z,e.x-P.x);vpBatGo(e,P.x+Math.cos(a)*2,P.z+Math.sin(a)*2);mzSay(e,'Du entkommst mir nicht!');return true;}
  if(e.batCd<=0&&d<6&&(Math.random()<dt*.35||e.dmgWin>80)){e.dmgWin=0;const a=Math.random()*6.283;vpBatGo(e,P.x+Math.cos(a)*8,P.z+Math.sin(a)*8);return true;}
  if(e.boltT<=0&&d>5&&d<16){e.cast=.6;e.boltT=4+Math.random()*2;return true;}
  return false;}
function vpHurt(e,n,by){e.dmgWin=(e.dmgWin||0)+n;const stake=by==='player'&&weaponOf()==='stake';
  if(e.weak&&stake){e.hp=.5;return true;}
  if(e.hp-n<=0&&!stake){e.hurt=.2;e.hp=1;if(!e.weak){e.weak=1;e.weakT=11;if(e.bat)vpLand(e);mzSay(e,'Aaargh …!');
      toast(FLAGS.vpTip?'Der Vampir ist geschwächt! Schnell, der Holzpflock!':'Der Vampir ist geschwächt, aber nicht tot! Nur ein Holzpflock ins Herz kann ihn töten.');FLAGS.vpTip=1;}return false;}
  return true;}
function vpDeath(e){vpPark(e);e.hidden=true;mzBurst(e.x,e.y+1,e.z,90,[0x2a2228,0x5a5058,0x8a1020,0xc8c0b8],6,1.6,.45);try{Snd.demonRoar(.9,1.6);}catch(_){}
  setTimeout(()=>toast('Graf Morvan zerfällt zu Asche.'),900);const B=e.gyB;
  if(B&&GY.built.get(B.g.id)===B){const st=gyState(B.g);st.v=3;const[x,y,z]=gySarcPos(B.g);
    for(const m of B.sarc){if(m.isMesh)B.grp.remove(m);else{const l=tgrid.get(gk(m.x,m.z));if(l){const i=l.indexOf(m);if(i>=0)l.splice(i,1);}m.r=0;}}B.sarc=[];gyRubble(B);
    mzBurst(x,y+.8,z,70,[0x3e3e44,0x64646a,0x8c8c92],7,1.4,.4);try{Snd.crash();}catch(_){}setTimeout(()=>toast('Der Steinsarg zerspringt! Darin liegt eine Truhe.'),2200);
    const key='vamp_'+B.g.id;FLAGS.chests=FLAGS.chests||{};const b=FLAGS.chests[key]=new Array(28).fill(null),R=Math.random;
    const L=[['silver',12+((R()*9)|0)],['copper',15+((R()*20)|0)],['batwing',3+((R()*3)|0)],['vfang',1],['vletter',1]];if(R()<.35)L.push(['coin',1]);L.forEach((q,i)=>{b[i]={id:q[0],n:q[1]};});
    addFurn('chest',x,z,key);furnSave();renderFurn();saveGame();}
  else{spawnDrop('silver',12,e.x,e.y+.5,e.z);spawnDrop('batwing',3,e.x,e.y+.5,e.z);spawnDrop('vfang',1,e.x,e.y+.5,e.z);if(!e.ice)spawnDrop('vletter',1,e.x,e.y+.5,e.z);}}
// Lebensraub beim Biss
{const a=meleeHit;meleeHit=function(e,t,dmg){a(e,t,dmg);if(e&&e.type==='vampir'&&t==='player'&&!e.dead){e.hp=Math.min(e.max,e.hp+10);mzBurst(P.x,P.y+1.2,P.z,10,[0x8a1020,0xc01020],3,.6,.25);}};}
// Wer den Vampir im Gespräch angreift, macht ihn sofort wütend
{const a=attack;attack=function(){if(state==='playing'&&P.x<60000)for(const e of VP.list)if(e.friendly&&!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<3.2&&lookingAt(e.x,e.y+1.2,e.z,3.8,.8)){vpHostile(e,'hit');break;}return a();};}
function vpLooked(){for(const e of VP.list)if(e.friendly&&!e.dead&&e.rise==null&&Math.hypot(e.x-P.x,e.z-P.z)<4&&lookingAt(e.x,e.y+1.3,e.z,4.6,.8))return e;return null;}
function vpGreet(){const B=dlg&&dlg.v&&dlg.v.gyB,rem=B?gyState(B.g).rem||0:99;
  return rem>120?'Ahh … ein warmes Herz. Du hast mich geweckt. Wie aufmerksam von dir. Ich bin Graf Morvan. Was führt dich zu meinem Grab?':
    rem>45?'Du bist noch da? Dein Herz schlägt so laut … Mach deine Geschäfte, solange ich mich beherrschen kann.':'Geh. Jetzt. Bevor ich es mir anders überlege …';}
DIALOGS[VNAME]={start:()=>'hello',nodes:{
  hello:()=>({text:vpGreet(),opts:[{label:'Wer bist du?',go:'who'},{label:'Zeig mir, was du hast.',act:()=>{openShop(VNAME);return null;}},{label:'Warum lagst du in dem Sarg?',go:'why'},{label:'Ich gehe jetzt.',go:null}]}),
  who:()=>({text:'Graf Morvan. Herr über diese Wälder, lange bevor die Bauern mit ihren Fackeln kamen. Dreihundert Jahre lag ich in diesem Stein. Dreihundert Jahre ohne einen einzigen Schluck …',opts:[{label:'Zurück.',go:'hello'}]}),
  why:()=>({text:'Ein Priester hat den Sarg versiegelt. Dein Totem hat das Siegel gebrochen. Dafür bin ich dir dankbar … noch.',opts:[{label:'Noch?',go:'still'},{label:'Zurück.',go:'hello'}]}),
  still:()=>({text:'Der Durst, Wanderer. Er wächst mit jedem Herzschlag, den ich in deiner Brust höre. Wenn du klug bist, beeilst du dich.',opts:[{label:'Zurück.',go:'hello'}]})}};
SHOPS[VNAME]={title:'Graf Morvans Gruftschatz',greet:'Schätze aus besseren Jahrhunderten. Und ja, ich kaufe auch. Knochen erinnern mich an alte Freunde.',
  buy:[['batwing',16],['ruby',180],['pregen',430],['hpot2',115],['pmana',270],['silk',8]].filter(q=>ITEMS[q[0]]),sell:[['bones',3],['batwing',6],['mushroom',4],['silk',3]].filter(q=>ITEMS[q[0]])};
// Fledermaustotem auf den Sarg legen
function gyUseSarc(B){const st=gyState(B.g);if(st.v>=1||B.waking)return false;
  if(countItem('battotem')<1){toast('Ein schwerer Steinsarg. In den Deckel ist eine Fledermaus gemeißelt …');Snd.click();return true;}
  removeItem('battotem',1);renderInv();B.waking=2.6;st.v=1;st.rem=180;toast('Du legst das Fledermaustotem auf den Sarg …');try{Snd.shimmer();}catch(_){}saveGame();return true;}
{const a=storyUse;storyUse=function(){if(P.x<60000&&state==='playing'){const v=vpLooked();if(v){openDialog(v);return true;}const B=gySarcLooked();if(B&&gyUseSarc(B))return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000){const v=vpLooked();if(v)return'Mit Graf Morvan reden';const B=gySarcLooked();if(B&&!B.waking&&!(gyState(B.g).v>=1))return countItem('battotem')?'Fledermaustotem auf den Sarg legen':'Steinsarg untersuchen';}return a();};}
// =========================================================
// Der Totengräber: hüpft hin und her und springt dich an
// =========================================================
function tgSpawn(B,x,z){const e=spawnEnt('tgraeber',x,z,{home:{x,z},airK:0,gy:B?B.id:null,side:Math.random()<.5?-1:1});e.special=tgAI;
  e.onDeath=e2=>{e2.hidden=true;mzBurst(e2.x,e2.y+2.4,e2.z,50,[0xe08222,0xb05a12,0x1c1618,0xffd040],6,1.2,.4);if(B&&B.id){FLAGS.gy=FLAGS.gy||{};(FLAGS.gy[B.id]=FLAGS.gy[B.id]||{v:0}).dg=1;}};
  if(B&&B.id)return e;return e;}
function tgAI(e,dt){e.airK=0;
  if(e.jmp){const J=e.jmp;J.t+=dt;const k=Math.min(1,J.t/J.T);e.x=J.x0+(J.x1-J.x0)*k;e.z=J.z0+(J.z1-J.z0)*k;e.flyOff=4*J.h*k*(1-k);e.frame=J.big?(k<.55?'j':'a'):'j';
    if(k>=1){e.jmp=null;e.flyOff=0;if(J.big){mzHitArea(e.x,e.z,2.7,19,8);mzRingFx&&mzRingFx(e.x,e.z,2.6,0x6a5a48,30);mzBurst(e.x,e.y+.3,e.z,24,[0x5a4a38,0x3a2e22],5,.7,.3);try{Snd.boom(.2);}catch(_){}e.rec=.7;}else e.frame=0;}return true;}
  if(e.crouch>0){e.crouch-=dt;e.frame='j';if(e.crouch<=0){const tx=P.x+(P.vx||0)*.45,tz=P.z+(P.vz||0)*.45;e.jmp={x0:e.x,z0:e.z,x1:tx,z1:tz,t:0,T:.85,h:3.2,big:1};mzSay(e,['Ein Grab für dich!','Hier ist noch Platz!','Hehehe!'][(Math.random()*3)|0]);}return true;}
  if(e.rec>0){e.rec-=dt;e.frame=0;return true;}
  if(e.tgt!=='player')return false;
  const d=Math.hypot(P.x-e.x,P.z-e.z);e.leapT=(e.leapT==null?2.5:e.leapT)-dt;e.hopT=(e.hopT==null?.8:e.hopT)-dt;
  if(e.leapT<=0&&d>3&&d<15){e.crouch=.45;e.leapT=3.2+Math.random()*2;return true;}
  if(e.hopT<=0&&d<3.3&&e.wind<=0&&Math.random()<dt*.5){const a=Math.atan2(e.z-P.z,e.x-P.x)+(Math.random()-.5)*.8;e.jmp={x0:e.x,z0:e.z,x1:P.x+Math.cos(a)*6.5,z1:P.z+Math.sin(a)*6.5,t:0,T:.5,h:1.2};e.hopT=.9;e.leapT=Math.min(e.leapT,.6);return true;}
  if(e.hopT<=0&&d>2.8&&d<13&&e.wind<=0){const a=Math.atan2(e.z-P.z,e.x-P.x)+e.side*(.5+Math.random()*.3),r=Math.max(3,d-1.2);e.jmp={x0:e.x,z0:e.z,x1:P.x+Math.cos(a)*r,z1:P.z+Math.sin(a)*r,t:0,T:.42,h:.9};
    e.hopT=.5+Math.random()*.6;if(Math.random()<.45)e.side*=-1;return true;}
  return false;}
// =========================================================
// Fledermäuse in Savanne, Wüste und Steinwüste
// =========================================================
const BAT={list:[],t:2};const BAT_AREAS=new Set(['wl_savanne','wl_wueste','wl_steinwueste','desert','savanna','steppe']);
function batAI(e,dt){if(e.tgt==='player')return false;e.ft=(e.ft||0)-dt;if(e.ft<=0){e.ft=1+Math.random()*2;const a=Math.random()*6.283,r=Math.random()*9;e.fx=e.home.x+Math.cos(a)*r;e.fz=e.home.z+Math.sin(a)*r;}
  e.flyOff=Math.sin(time*2.3+e.bob)*.6+.3;entMove(e,e.fx,e.fz,4.5,dt);e.frame=1+(Math.floor(time*10+e.bob)%2);return true;}
function batSpawn(x,z,cmd){const e=spawnEnt('bat',x,z,{home:{x,z},cmd:cmd?1:0});e.special=batAI;if(!cmd)BAT.list.push(e);return e;}
function batTick(dt){BAT.t-=dt;if(BAT.t>0)return;BAT.t=3;
  for(let i=BAT.list.length-1;i>=0;i--){const e=BAT.list[i];if(e.dead||!DEM.includes(e)||Math.hypot(e.x-P.x,e.z-P.z)>140){if(!e.dead)removeEnt(e);BAT.list.splice(i,1);}}
  if(state!=='playing'||P.x>60000)return;let ar=null;try{ar=areaAt(P.x,P.z);}catch(e){}if(!BAT_AREAS.has(ar))return;
  const cap=isDark()?8:4;if(BAT.list.length>=cap||Math.random()<.4)return;
  for(let t=0;t<8;t++){const a=Math.random()*6.283,d=30+Math.random()*28,x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d;if(getHeight(x,z)<WATER+.4)continue;let ar2=null;try{ar2=areaAt(x,z);}catch(e){}if(!BAT_AREAS.has(ar2))continue;
    const n=2+((Math.random()*3)|0);for(let k=0;k<n&&BAT.list.length<cap;k++)batSpawn(x+(Math.random()-.5)*4,z+(Math.random()-.5)*4);return;}}
// =========================================================
// Takt: Friedhöfe aufbauen, Vampir wecken, Zeit ablaufen lassen
// =========================================================
function gyTick(dt){if(P.garlicT>0)P.garlicT-=dt;
  GY.t-=dt;if(GY.t<=0){GY.t=.5;if(P.x>60000||!WL_READY){if(GY.built.size)gyFreeAll();}
    else{for(const g of gyNearList(240)){if(!GY.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<230)gyBuild(g);}
      for(const B of[...GY.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>300)gyFree(B);}}
  for(const B of GY.built.values()){const g=B.g,st=gyState(g);
    if(B.waking>0){B.waking-=dt;if(B.lid){B.lid.position.y+=(Math.random()-.5)*.02;}const[x,y,z]=gySarcPos(g);if(Math.random()<dt*25)spawnParticle(x+(Math.random()-.5)*1.4,y+1.2,z+(Math.random()-.5)*2.4,(Math.random()-.5)*2,2+Math.random()*2,(Math.random()-.5)*2,Math.random()<.5?0x1a0c12:0x8a1020,.8,.3);
      if(B.waking<=0){B.waking=0;if(B.lid){B.lid.rotation.z=.32;B.lid.position.x+=g.c*.75;B.lid.position.z+=g.s*.75;B.lid.position.y-=.05;}try{Snd.crack();}catch(_){}
        const[vx,vz]=gyWorld(g,0,1.9);vpSpawn(B,true,vx,vz);mzBurst(vx,y+1,vz,60,[0x1a0c12,0x3a1020,0x8a1020],6,1,.4);}}
    if(g.sarc&&(st.v===1||st.v===2)&&!B.waking&&(!B.vamp||B.vamp.dead&&st.v!==3)){const[vx,vz]=gyWorld(g,0,1.9);const e=vpSpawn(B,st.v===1,vx,vz);if(st.v===1)e.rise=null;}
    const e=B.vamp;if(e&&!e.dead&&e.friendly){if(e.rise!=null){e.rise=Math.min(1,e.rise+dt*.55);if(e.rise>=1){e.rise=null;mzSay(e,'Wer … wagt es, mich zu wecken?');}}
      e.frame=0;if(state==='playing'||state==='dialog'||state==='shop'){st.rem=(st.rem==null?180:st.rem)-dt;
        if(st.rem<35&&!e.warned){e.warned=1;mzSay(e,'Mein Durst … wird unerträglich …');}
        if(Math.hypot(e.x-P.x,e.z-P.z)<9&&time-(e.chatT||0)>14&&!(dlg&&dlg.v===e)){e.chatT=time;if(e.rise==null&&Math.random()<.5)mzSay(e,['Wie lange habe ich geschlafen …?','Komm näher. Ich beiße nicht. Noch nicht.','Was für ein schöner, warmer Hals.'][(Math.random()*3)|0]);}
        if(st.rem<=0)vpHostile(e,'time');}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{gyTick(dt);batTick(dt);}catch(e){if(!gyTick.err){gyTick.err=1;console.error('Friedhof/Vampir',e);}}};}
{const a=startGame;startGame=function(isNew,char){gyFreeAll();for(const e of BAT.list)removeEnt(e);BAT.list.length=0;VP.list.length=0;P.garlicT=0;return a(isNew,char);};}
{const a=dangerNear;dangerNear=function(){if(a())return true;for(const B of GY.built.values()){if(B.vamp&&!B.vamp.dead&&!B.vamp.friendly&&Math.hypot(B.vamp.x-P.x,B.vamp.z-P.z)<40)return true;}return false;};}
try{MP_WORLD_MAPS.push('gy');MP_KEYS.push('gy');}catch(e){}
// =========================================================
// /summon und /friedhof (Cheat-Modus)
// =========================================================
try{smAdd('Vampir',['vampire','graf','morvan'],(x,z)=>{const e=vpSpawn(null,false,x,z);e.cmd=1;return e;});smAdd('Totengräber',['totengraeber','graeber'],(x,z)=>{const e=tgSpawn(null,x,z);e.cmd=1;return e;});
  smAdd('Fledermaus',['fledermaeuse','bat'],(x,z)=>batSpawn(x,z,true));}catch(e){}
HELP.push(['/friedhof [sarg]','Teleport zum nächsten Friedhof im Nadelwald (nur im Cheat-Modus). Mit „sarg“: zum nächsten Friedhof mit Steinsarg']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/friedhof\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/friedhof geht nur im Cheat-Modus. Benutze erst /cheats on.','err');return;}if(P.x>60000){conLog('Geh erst nach draußen.','err');return;}
    const sarc=/sarg/i.test(t);let best=null,bd=1e9;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
    for(let R=0;R<=26&&!best;R++)for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const s=wlSite(ci+a,cj+b);if(s.b!=='nadel2')continue;const g=wlGy(s);if(!g||(sarc&&!g.sarc))continue;
      const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;best=g;}}
    if(!best){conLog('Kein Friedhof in der Nähe gefunden.','err');return;}const[x,z]=gyWorld(best,0,GY_D/2+3.5);teleport(x,z,Math.atan2(-best.s,best.c));
    conLog(`Friedhof gefunden (${Math.round(bd)} m entfernt${best.sarc?', mit Steinsarg':''}${best.guard?', bewacht':''}).`,'ok');closeConsole();return;}
  return a(raw);};}
