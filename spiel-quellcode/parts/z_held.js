/* =========================================================
   Waffen und Werkzeuge in der Hand
   - Ego-Ansicht: aufrechter gehalten, mit Lederhandschuh, der den Griff umschließt
   - Ansicht von außen: eigene, genaue Pixel-Modelle statt vergrößerter Symbole,
     schräg nach außen gehalten, die Finger liegen um den Griff
   - Akuma Senso: neues, schräg liegendes Bild im Inventar
   ========================================================= */
const HGOLD=pal(['#5a3a08','#9a6a14','#d4a02a','#f4d060','#fff4b0']),HGRIP=pal(['#140a06','#2a160c','#4a2a14','#6e4220']),HAKB=pal(['#06060a','#14141c','#262634','#3c3c50','#5a5a74']),HAKR=pal(['#4a0610','#a01020','#ff3a3a','#ffb0a0']);
// ---------- Akuma Senso im Inventar: schräg, wie die anderen Schwerter ----------
function akumaDiag(){const W=20,H=20,p=new Px(W,H);
  for(let i=0;i<13;i++){const x=17-i,y=2+i;p.set(x,y,HAKB[2]);p.set(x+1,y,HAKB[3]);p.set(x,y+1,HAKB[1]);p.set(x+1,y+1,HAKR[1+(i%4===0?1:0)]);if(i<2)p.set(x+1,y-1,HAKR[2]);}
  p.set(18,1,HAKR[3]);p.set(18,2,HAKR[2]);
  for(let k=-3;k<=3;k++)p.set(5+k,14+k,HGOLD[k===0?4:2+(k&1)]);p.set(2,11,HGOLD[3]);p.set(8,17,HGOLD[3]);
  for(let k=0;k<3;k++){p.set(4-k,16+k,HAKR[k%2?0:1]);p.set(3-k,16+k,HAKR[1]);}
  p.set(1,19,HAKR[2]);p.set(0,19,HAKR[1]);p.set(1,18,HAKR[3]);
  outline(p);return p.done();}
{const old=drawAkumaIcon;drawAkumaIcon=function(){return akumaDiag();};
  // Kreak hält das Schwert weiter senkrecht
  const i0=initDemons;initDemons=function(a){i0(a);try{SPR.ak_icon={c:old()};kreakRedraw(true);}catch(e){}};}
if(typeof heldKind==='function'){const hk=heldKind;heldKind=function(id){if(id==='akuma')return'sword';return hk(id);};}

// ---------- Ansicht von außen: genaue Modelle ----------
const HMOD={};
function hMat(id){const it=ITEMS[id]||{};if(/^w/.test(id)&&(id==='wsword'||id==='wpick'||id==='waxe'))return FPW.wood;if(id==='ssword'||id==='spick'||id==='saxe')return FPW.stone;
  if(it.mat)return it.mat==='gold'?FPW.gold:fpMetal(it.mat);return FPW.steel;}
function heldModel(id){if(id in HMOD)return HMOD[id];let r=null;const it=ITEMS[id]||{};
  try{
    const isSword=id==='sword'||id==='wsword'||id==='ssword'||/_sword$/.test(id),isAxe=id==='axe'||id==='waxe'||id==='saxe'||/_axe$/.test(id),isPick=id==='wpick'||id==='spick'||/_pick$/.test(id);
    if(id==='akuma'){const W=13,H=40,p=new Px(W,H),cx=6;
      for(let y=1;y<28;y++){const w=y<3?0:1;for(let x=cx-1-w;x<=cx+1;x++)p.set(x,y,x===cx+1?HAKR[2+(y%6===0?1:0)]:HAKB[x===cx-1-w?3:x===cx?1:2]);}p.set(cx,0,HAKR[3]);
      for(let x=1;x<12;x++){p.set(x,28,HGOLD[x===6?4:3]);p.set(x,29,HGOLD[1+(x&1)]);}p.set(1,27,HGOLD[3]);p.set(11,27,HGOLD[3]);
      for(let y=30;y<36;y++){p.set(cx-1,y,HAKR[y&1?1:0]);p.set(cx,y,HAKR[y&1?0:1]);}fEll(p,cx-.5,37,1.6,1.6,HAKR,{b:.2});
      outline(p);r={c:p.done(),gx:cx-.5,gy:32.5};}
    else if(isSword||id==='dagger'){const M=hMat(id),dag=id==='dagger',BL=dag?9:19,W=11,H=BL+12,p=new Px(W,H),cx=5,G=id==='wsword'?FPW.wood:id==='ssword'?FPW.wood:(it.mat==='black'||it.mat==='adamant')?HGOLD:(it.mat?fpMetal(it.mat==='diamond'?'silver':it.mat):HGOLD);
      for(let y=1;y<=BL;y++){const tip=y<3;p.set(cx,y,M[tip?4:3]);if(!tip){p.set(cx-1,y,M[5]||M[4]);p.set(cx+1,y,M[1]);if(id!=='wsword'&&id!=='ssword'&&y>4&&y<BL-1)p.set(cx,y,M[2]);}}p.set(cx,0,M[5]||M[4]);
      if(id==='ssword')for(let y=3;y<BL;y+=3)p.set(cx+1,y,M[0]);
      const gy=BL+1;for(let x=1;x<10;x++)p.set(x,gy,G[x===cx?4:3]);for(let x=2;x<9;x++)p.set(x,gy+1,G[1]);
      for(let y=gy+2;y<gy+(dag?6:7);y++){p.set(cx,y,HGRIP[y&1?2:1]);p.set(cx-1,y,HGRIP[1]);}const py=gy+(dag?6:7);p.set(cx,py,G[4]);p.set(cx-1,py,G[3]);p.set(cx,py+1,G[2]);p.set(cx-1,py+1,G[1]);
      outline(p);r={c:p.done(),gx:cx-.5,gy:gy+4};}
    else if(isAxe){const M=hMat(id),W=13,H=26,p=new Px(W,H),cx=7,Wd=FPW.wood;
      for(let y=2;y<H-1;y++){p.set(cx,y,Wd[3]);p.set(cx-1,y,Wd[2]);}p.set(cx,H-1,Wd[1]);p.set(cx-1,H-1,Wd[1]);
      const head=[[cx-1,3],[cx-3,2],[cx-5,1],[cx-6,3],[cx-6,7],[cx-5,9],[cx-3,8],[cx-1,7]];fPoly(p,head,M,{b:.1});for(let y=1;y<10;y++)p.set(cx-6+(y<2||y>8?1:0),y,M[M.length-1]);
      p.set(cx+1,4,M[2]);p.set(cx+2,4,M[1]);p.set(cx+1,5,M[2]);for(let y=H-8;y<H-2;y++)p.set(cx,y,HGRIP[2]);
      outline(p);r={c:p.done(),gx:cx-.5,gy:H-5};}
    else if(isPick){const M=hMat(id),W=17,H=24,p=new Px(W,H),cx=8,Wd=FPW.wood;
      for(let y=3;y<H-1;y++){p.set(cx,y,Wd[3]);p.set(cx-1,y,Wd[2]);}
      const arc=(s)=>{for(let k=0;k<8;k++){const x=cx+s*(k+1),y=3+Math.round(k*k*.09);p.set(x,y,M[3]);p.set(x,y+1,M[1]);if(k<2)p.set(x,y-1,M[4]);}};arc(-1);arc(1);
      for(let x=cx-2;x<=cx+1;x++){p.set(x,2,M[4]);p.set(x,3,M[3]);p.set(x,4,M[2]);}for(let y=H-8;y<H-2;y++)p.set(cx,y,HGRIP[2]);
      outline(p);r={c:p.done(),gx:cx-.5,gy:H-5};}
    else if(id==='spear'){const W=7,H=42,p=new Px(W,H),cx=3,Wd=FPW.wood,S=FPW.steel;
      for(let y=7;y<H;y++){p.set(cx,y,Wd[3]);p.set(cx-1,y,Wd[2]);}fPoly(p,[[cx,0],[cx+2,4],[cx+1,7],[cx-2,7],[cx-3,4]],S,{b:.15});p.set(cx,1,S[5]);
      p.set(cx+1,8,hex('#c02828'));p.set(cx-2,8,hex('#c02828'));p.set(cx+1,9,hex('#a01818'));outline(p);r={c:p.done(),gx:cx-.5,gy:28};}
  }catch(e){console.warn('Modell',id,e);r=null;}
  return HMOD[id]=r;}
{const d0=drawHeld2;drawHeld2=function(ctx,id,ic,hand,ox,flip,ang,main){const M=heldModel(id);if(!M)return d0(ctx,id,ic,hand,ox,flip,ang,main);
  const k=heldKind(id),hx=Math.round(ox+hand[0]+(flip?1:0)),hy=Math.round(hand[1]+1);
  let skin=null;try{const px=ctx.getImageData(hx,hy,1,1).data;if(px[3]>200)skin=[px[0],px[1],px[2]];}catch(e){}
  const lean=k==='spear'?.12:k==='tool'?.42:.6;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(hx+.5,hy+.5);if(flip)ctx.scale(-1,1);ctx.rotate((main?lean:lean*.6)+(ang||0));
  ctx.drawImage(M.c,-Math.round(M.gx+.5),-Math.round(M.gy));
  // Finger um den Griff
  if(skin){ctx.fillStyle=`rgb(${skin[0]},${skin[1]},${skin[2]})`;ctx.fillRect(-2,-1,3,2);ctx.fillStyle=`rgb(${skin[0]*.7|0},${skin[1]*.7|0},${skin[2]*.7|0})`;ctx.fillRect(-2,1,3,1);}
  ctx.restore();};}

// ---------- Ego-Ansicht: aufrechter gehalten, mit Handschuh ----------
const GLV=pal(['#140a06','#2a170c','#452812','#64401e','#86582c','#a8743c']);
function fpFist(){const p=new Px(26,24),cx=9;
  fEll(p,14,12,10.5,10.5,GLV,{b:-.05});
  for(let i=0;i<4;i++){fEll(p,14,4.5+i*4.6,9,2.7,GLV,{b:.18});p.set(21,3.5+i*4.6,GLV[5]);p.set(22,4.5+i*4.6,GLV[4]);for(let x=8;x<20;x++)p.set(x,7+i*4.6,GLV[1]);}
  fEll(p,6,5,4.6,3.4,GLV,{b:.2});p.set(4,4,GLV[5]);
  outline(p);return p.done();}
let FPG=0;
{const fp0=fpPlace;fpPlace=function(cv,gx,gy,rot,sc,ax,ay){if(!FPG)return fp0(cv,gx,gy,rot,sc,ax,ay);
  const o=document.createElement('canvas');o.width=o.height=128;const x=o.getContext('2d');x.imageSmoothingEnabled=false;
  const AX=ax==null?84:ax,AY=ay==null?100:ay,R=rot*.5;
  // Unterarm mit Lederschiene, aus der Ecke unten rechts
  const arm=new Px(128,128),ang=Math.atan2(128-AY,128-AX),nx=-Math.sin(ang),nz=Math.cos(ang),w=10;
  fPoly(arm,[[AX+nx*w*.9,AY+nz*w*.9+4],[AX-nx*w*.9,AY-nz*w*.9+4],[150-nx*w*1.4,150-nz*w*1.4],[150+nx*w*1.4,150+nz*w*1.4]],GLV,{b:.05});
  for(let k=0;k<3;k++){const t=.28+k*.08,bx=AX+(150-AX)*t,by=AY+4+(150-AY-4)*t;for(let j=-12;j<=12;j++){const px=Math.round(bx+nx*j),py=Math.round(by+nz*j);if(arm.d[(py*128+px)*4+3])arm.set(px,py,k===1?hex('#c8a040'):GLV[1]);}}
  outline(arm);x.drawImage(arm.done(),0,0);
  x.save();x.translate(AX,AY);x.rotate(R);x.scale(sc,sc);x.drawImage(cv,-gx,-gy);x.restore();
  const f=fpFist();x.save();x.translate(AX,AY);x.rotate(R);x.scale(Math.min(1.25,sc*1.05),Math.min(1.25,sc*1.05));x.drawImage(f,-9.5,-12);x.restore();
  return o.toDataURL();};}
{const wrap=f=>function(){FPG=1;try{return f.apply(this,arguments);}finally{FPG=0;}};fpSword=wrap(fpSword);fpAxe=wrap(fpAxe);fpPick=wrap(fpPick);fpSpear=wrap(fpSpear);}
// Das Akuma Senso in der Ego-Ansicht ebenfalls mit Hand
{const is=initStory;initStory=function(atlas){is(atlas);try{FPG=1;ITEMS.akuma.fp=fpPlace(drawAkumaFP(),30,142,-.72,.6,86,104);}catch(e){console.error(e);}finally{FPG=0;}};}
