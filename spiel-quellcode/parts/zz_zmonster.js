/* =========================================================
   NEUE GEGNER (0.0.101)
   - Zombie: langsam, zäh, sieht dich schon von Weitem.
   - Lich: erscheint nachts in allen Biomen. Skelett in braunen Roben, vier
     Kampfstile (Feuermagier, Frostmagier, Beschwörer, Schattenklinge),
     ruft 4–6 Skelette und Zombies und lässt sie dich von mehreren Seiten angreifen.
   - Elderlich: sehr selten, blau/lila/schwarze Roben, starke Zauber, bis zu
     12 Diener und 4 Liche, wechselt die Angriffsmuster seiner kleinen Armee.
   - Troll- und Koboldhorden auf der Ebene und am Sturmberg: 1–3 Trolle,
     3–8 Kobolde, die dich umzingeln. Sie überfallen auch Kutschen.
   ========================================================= */
// =========================================================
// Bilder
// =========================================================
function mzMerge(L,R){const o=document.createElement('canvas');o.width=R.width;o.height=R.height;const x=o.getContext('2d'),h=R.width>>1;
  x.drawImage(R,0,0);x.clearRect(0,0,h,o.height);x.save();x.beginPath();x.rect(0,0,h,o.height);x.clip();x.translate(o.width,0);x.scale(-1,1);x.drawImage(L,0,0);x.restore();
  o.headBox=R.headBox;o.waist=R.waist;o.legTop=R.legTop;return o;}
const MZ_ZSKIN=[pal(['#2e3a26','#435432','#5a6e42','#748a56']),pal(['#34342e','#4c4c44','#666458','#827e70']),pal(['#3a3024','#544434','#6e5c46','#8a765c'])];
const MZ_ZLOOK=[{hair:'wild',hairColor:'black',cloth:'rags',clothColor:'grey',pants:'brown'},{hair:'none',cloth:'rags',clothColor:'brown',pants:'grey'},{hair:'long',hairColor:'brown',cloth:'tunic',clothColor:'red',pants:'black'}];
function mzZombie(v,f){const c=Object.assign(defaultChar(),MZ_ZLOOK[v],{skinP:MZ_ZSKIN[v],beard:'none',eyes:'gold'}),pose=f==='a'?'up':'brace',fr=f==='a'?0:f,fr2=fr===1?2:fr===2?1:0;
  let A,B;try{A=drawHero(c,fr,false,pose,'R');B=drawHero(c,fr2,false,pose,'R');}catch(e){A=B=drawHero(c,fr);}
  const o=mzMerge(B,A),x=o.getContext('2d'),img=x.getImageData(0,0,o.width,o.height),d=img.data;
  // Risse, Flecken, trübe Augen
  for(let y=0;y<o.height;y++)for(let X=0;X<o.width;X++){const i=(y*o.width+X)*4;if(!d[i+3])continue;const h=hash2(X,y,31+v);
    if(h<.06){d[i]*=.55;d[i+1]*=.45;d[i+2]*=.4;}else if(h>.985){d[i]=90;d[i+1]=20;d[i+2]=18;}}
  x.putImageData(img,0,0);if(o.headBox){const[h0,h1,t,b]=o.headBox,cx=(h0+h1)>>1,ey=t+Math.floor((b-t+1)*.45);x.fillStyle='#e8e4b0';x.fillRect(cx-2,ey,1,1);x.fillRect(cx+2,ey,1,1);x.fillStyle='#2a0c08';x.fillRect(cx-1,ey+3,3,1);}
  return o;}
// Skelette mit Waffen und Rüstung (Grundlage: Höhlenskelett, 36×62)
function mzHand(f,side){const s=f===1?1:f===2?-1:0;if(f==='a')return side>0?[27,12]:[9,12];return side>0?[26-s,40]:[10+s,40];}
function mzSkel(w,arm,f){const cv=drawSkeleton(f==='c'?0:f),o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d'),P=(X,Y,c,ww=1,hh=1)=>{x.fillStyle=c;x.fillRect(X,Y,ww,hh);};
  x.drawImage(cv,0,0);const[rx,ry]=mzHand(f,1),[lx,ly]=mzHand(f,-1),M='#9aa0a8',ML='#d8dce2',MD='#4a4e56',W='#5a3a1c';
  if(arm){// Helm mit Nasenschutz, Brustpanzer, Schulterstücke
    for(let y=8;y<14;y++)for(let X=11;X<25;X++){const dx=(X-17.5)/7,dy=(y-13)/5.5;if(dx*dx+dy*dy<=1)P(X,y,y===8||X<14?ML:y===13?MD:M);}P(17,14,MD);P(17,15,MD);P(10,13,MD,16,1);
    for(let y=25;y<41;y++)for(let X=12;X<24;X++){if(y>36&&(X<13||X>22))continue;P(X,y,(X+y)%7===0?MD:X<15?ML:M);}for(const X of[14,21])for(const Y of[27,33])P(X,Y,MD);
    for(const sx of[9,23])for(let y=23;y<27;y++)P(sx,y,y===23?ML:M,4,1);}
  if(w==='s'||w==='h'){// Schwert
    if(f==='a'){for(let k=1;k<12;k++)P(rx,ry-k,k>9?'#f0f4f8':'#c8ccd4');P(rx-1,ry-1,'#8a6a1c',3,1);}else{for(let k=-10;k<0;k++)P(rx+2,ry+k,k<-8?'#f0f4f8':'#c8ccd4');P(rx+1,ry,'#8a6a1c',3,1);P(rx+2,ry+1,W);}}
  if(w==='a'){// Axt
    const bx=f==='a'?rx:rx+2,by=f==='a'?ry:ry+2,up=f==='a'?-1:-1;for(let k=0;k<12;k++)P(bx,by+up*k,k===0?'#3a2410':W);for(let k=0;k<5;k++){P(bx+1,by-8-k,'#a8aeb6');P(bx+2,by-8-k,k===0||k===4?'#d8dce2':'#bcc2ca');P(bx+3,by-9-k+(k>2?1:0),k===2?'#e8ecf0':'#bcc2ca');}}
  if(w==='h'){// Rundschild links
    for(let y=-5;y<=5;y++)for(let X=-5;X<=5;X++){const r=Math.hypot(X,y);if(r>5.3)continue;P(lx-1+X,ly-4+y,r>4.4?'#3a2a18':r<1.3?ML:(X+5)%4<2?'#6a1e18':'#5a3a20');}}
  if(w==='b'){// Bogen links, beim Schuss mit Pfeil
    const bx=f==='c'?6:lx-2,by=f==='c'?33:ly-8;for(let k=-9;k<=9;k++){const off=Math.round(Math.sqrt(Math.max(0,81-k*k))/3);P(bx-off,by+k,'#6a4420');}P(bx,by-9,'#c8b890',1,19);
    if(f==='c'){P(bx,by,'#e8e0c8',18,1);P(bx+18,by-1,'#c8ccd4',2,3);P(bx-1,by-1,'#8a2a20',2,3);}}
  // Köcher am Rücken für Schützen
  if(w==='b'){for(let y=20;y<30;y++)P(25,y,'#5a3a1c',2,1);P(25,19,'#e8e0c8');P(26,18,'#e8e0c8');}
  return o;}
// Lich: Skelett in Kapuzenrobe. S = {robe:[4 Farben], trim, eye, glow, staff, crystal, elder}
function mzLich(S,f){const W=42,H=68,p=new Px(W,H),cx=21,R=pal(S.robe),B=pal(['#8a8270','#b8b0a0','#dcd6c8','#f4f0e6']),T=hex(S.trim),E=hex(S.eye),G=hex(S.glow),DK=hex('#0a080a'),sw=f===1?1:f===2?-1:0,yo=4;
  // Robe
  for(let y=22+yo;y<H-1;y++){const k=(y-22-yo)/(H-24-yo),w=6+k*9.5,off=Math.round(sw*k*1.5);for(let x=Math.round(cx-w)+off;x<=Math.round(cx+w)+off;x++){
      const fold=(Math.abs(x-off-cx+3)<1||Math.abs(x-off-cx-4)<1)&&y>32+yo?-.28:0,hem=y>=H-3;p.set(x,y,hem?T:R[shadeIdx(.62-(x-cx)/(w*2.4)+fold,4,x,y)]);}}
  if(S.elder){for(let y=24+yo;y<H-3;y++)p.set(cx,y,T);for(let x=cx-7;x<=cx+7;x++)p.set(x,24+yo,T);}
  for(let x=cx-7;x<=cx+7;x++)p.set(x,37+yo,hex(S.elder?'#c8a040':'#6a5030'));p.set(cx-2,38+yo,hex(S.elder?'#c8a040':'#6a5030'));p.set(cx-2,39+yo,hex(S.elder?'#c8a040':'#6a5030'));
  // Ärmel und Knochenhände
  const arm=(x0,y0,x1,y1,glow)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let t=0;t<=n;t++){const X=x0+(x1-x0)*t/n,Y=y0+(y1-y0)*t/n,ww=t<n*.75?3:2;for(let o=-1;o<ww-1;o++)p.set(X+o,Y,R[t<n*.75?1:2]);}
    p.set(x1,y1+1,B[2]);p.set(x1-1,y1+2,B[3]);p.set(x1+1,y1+2,B[1]);p.set(x1,y1+3,B[2]);if(glow){for(const[dx,dy]of[[0,-1],[-1,0],[1,0],[0,-2],[0,0]])p.set(x1+dx,y1+dy-1,dy===-2?hex('#ffffff'):G);}};
  if(f==='c'){arm(cx-7,24+yo,cx-13,10+yo,1);arm(cx+7,24+yo,cx+13,10+yo,1);}
  else if(f==='a'){arm(cx-7,24+yo,cx-9,40+yo,0);arm(cx+7,24+yo,cx+16,28+yo,1);}
  else{arm(cx-7,24+yo,cx-9-sw,40+yo,0);arm(cx+7,24+yo,cx+9-sw,40+yo,0);}
  // Stab
  if(S.staff){const sx=f==='c'?cx+13:f==='a'?cx+16:cx+10-sw,y0=f==='c'||f==='a'?yo-2:yo+6,y1=f==='c'||f==='a'?yo+46:H-1;for(let y=Math.max(0,y0+5);y<y1;y++)p.set(sx,y,hex(y%5?'#4a3018':'#2a1a0c'));
    const C=pal([S.crystal[0],S.crystal[1],'#ffffff']);for(let y=0;y<6;y++)for(let x=-1;x<=1;x++){if((y===0||y===5)&&x)continue;p.set(sx+x,Math.max(0,y0)+y,C[x<0?0:y<2?2:1]);}
    if(S.elder){p.set(sx-2,Math.max(0,y0)+4,T);p.set(sx+2,Math.max(0,y0)+4,T);p.set(sx-2,Math.max(0,y0)+3,T);p.set(sx+2,Math.max(0,y0)+3,T);}}
  // Kapuze und Schädel
  for(let y=2+yo;y<26+yo;y++)for(let x=cx-9;x<=cx+9;x++){const dx=(x-cx)/9,dy=(y-14-yo)/11.5;if(dx*dx+dy*dy>1)continue;p.set(x,y,R[shadeIdx(.5-dx*.35-dy*.25,4,x,y)]);}
  for(let y=6+yo;y<24+yo;y++)for(let x=cx-6;x<=cx+6;x++){const dx=(x-cx)/6,dy=(y-15-yo)/8;if(dx*dx+dy*dy>1)continue;p.set(x,y,DK);}
  for(let y=9+yo;y<22+yo;y++)for(let x=cx-4;x<=cx+4;x++){const dx=(x-cx+.5)/4.6,dy=(y-15-yo)/6;if(dx*dx+dy*dy>1)continue;p.set(x,y,B[shadeIdx(.7-dx*.3-dy*.2,4,x,y)]);}
  for(const ex of[cx-3,cx+1]){p.set(ex,14+yo,DK);p.set(ex+1,14+yo,DK);p.set(ex,15+yo,DK);p.set(ex+1,15+yo,DK);p.set(ex+(ex<cx?1:0),14+yo,E);}
  p.set(cx,17+yo,DK);for(let x=cx-2;x<=cx+2;x++)p.set(x,19+yo,(x&1)?B[3]:DK);
  if(S.elder){// Kronenzacken an der Kapuze
    for(const[dx,h]of[[-6,3],[-3,4],[0,5],[3,4],[6,3]])for(let k=0;k<h;k++)p.set(cx+dx,yo+2-k+(Math.abs(dx)>4?2:0),T);p.set(cx,yo-1,hex(S.crystal[1]));}
  outline(p);return p.done();}
const MZ_LSTYLE={
  f:{name:'Lich · Feuermagier',robe:['#2a1a0e','#4a2e18','#6a4426','#8a5c34'],trim:'#3a2410',eye:'#ffb030',glow:'#ff7a20',staff:1,crystal:['#a02008','#ff8a20'],gl:'o'},
  i:{name:'Lich · Frostmagier',robe:['#2a1e12','#4a3420','#6a4a2e','#86603c'],trim:'#3a2a18',eye:'#9ae8ff',glow:'#5ad0ff',staff:1,crystal:['#1a6aa0','#9ae8ff'],gl:'c'},
  s:{name:'Lich · Beschwörer',robe:['#261a10','#44301c','#62462a','#7e5a36'],trim:'#2a1e10',eye:'#b8ff5a',glow:'#7aff3a',staff:0,crystal:['#2a8a10','#b8ff5a'],gl:'g'},
  b:{name:'Lich · Schattenklinge',robe:['#1e140c','#3a2616','#563a22','#70502e'],trim:'#24160c',eye:'#e080ff',glow:'#a03ae0',staff:0,crystal:['#4a1068','#e080ff'],gl:'v'}};
const MZ_ELDER={robe:['#0a0a18','#1c1a3e','#3a2468','#5a3a96'],trim:'#8ad0ff',eye:'#6ac8ff',glow:'#9a6aff',staff:1,crystal:['#3a1a8a','#c8a8ff'],elder:1};
// Troll (groß, mit Keule)
function mzTroll(f){const W=60,H=88,p=new Px(W,H),cx=30,oy=10,S=pal(['#232a20','#353f2e','#4c5a40','#647454','#7e8e6a']),L=pal(['#2a1a0e','#4a3018','#6a4626']),C=pal(['#3a2410','#5a3a1c','#7a5228','#9a6c38']),a=f==='a',lL=f===1?1:0,rL=f===2?1:0;
  const ell=(cx0,cy0,rx,ry,pl,b)=>{for(let y=Math.floor(cy0-ry);y<=cy0+ry;y++)for(let x=Math.floor(cx0-rx);x<=cx0+rx;x++){const dx=(x-cx0)/rx,dy=(y-cy0)/ry;if(dx*dx+dy*dy>1)continue;p.set(x,y,pl[shadeIdx((b||.6)-dx*.32-dy*.2+(hash2(x>>1,y>>1,7)<.1?-.25:0),pl.length,x,y)]);}};
  const limb=(x0,y0,x1,y1,w,pl)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let t=0;t<=n;t++){const X=x0+(x1-x0)*t/n,Y=y0+(y1-y0)*t/n;for(let o=-w/2;o<w/2;o++)p.set(X+o,Y,pl[shadeIdx(.6-o/w*.5,pl.length,X+o,Y)]);}};
  // Beine
  limb(cx-8,oy+56,cx-9,oy+74-lL*2,8,S);limb(cx+8,oy+56,cx+9,oy+74-rL*2,8,S);ell(cx-10,oy+76-lL*2,6,2.5,S,.35);ell(cx+10,oy+76-rL*2,6,2.5,S,.35);
  // Lendenschurz
  for(let y=oy+50;y<oy+62;y++)for(let x=cx-13;x<=cx+13;x++){if(y>oy+57&&Math.abs(x-cx)>8)continue;p.set(x,y,L[shadeIdx(.6-(x-cx)/30,3,x,y)]);}for(let x=cx-14;x<=cx+14;x++)p.set(x,oy+50,hex('#2a1a0c'));
  // Rumpf mit Bauch
  ell(cx,oy+38,18,15,S,.62);ell(cx,oy+44,11,8,S,.8);
  // Arme
  limb(cx-16,oy+28,cx-21,oy+60,7,S);ell(cx-21,oy+62,4,3,S,.5);
  if(a){limb(cx+16,oy+28,cx+20,oy+2,7,S);ell(cx+20,oy+1,4,3,S,.5);limb(cx+21,oy+3,cx+6,oy-9,6,C);ell(cx+6,oy-8,5,4,C,.6);for(const[dx,dy]of[[-4,-11],[1,-12],[9,-10],[3,-4]])p.set(cx+6+dx,oy+dy,hex('#c8ccd4'));}
  else{limb(cx+16,oy+28,cx+21,oy+58,7,S);ell(cx+21,oy+60,4,3,S,.5);limb(cx+22,oy+60,cx+26,oy+30,6,C);ell(cx+26,oy+28,5,5,C,.6);for(const[dx,dy]of[[-4,-3],[3,-5],[5,1],[-2,3]])p.set(cx+26+dx,oy+28+dy,hex('#c8ccd4'));}
  // Kopf: tief sitzend, Hauer, kleine Augen
  ell(cx,oy+16,9,9,S,.65);ell(cx,oy+19,6,4,S,.75);for(let x=cx-7;x<=cx+7;x++){p.set(x,oy+12,S[0]);p.set(x,oy+13,S[1]);}
  p.set(cx-3,oy+15,hex('#ffd030'));p.set(cx+3,oy+15,hex('#ffd030'));p.set(cx-1,oy+18,S[0]);p.set(cx+1,oy+18,S[0]);for(let x=cx-4;x<=cx+4;x++)p.set(x,oy+22,hex('#1a1210'));
  for(const s of[-1,1]){p.set(cx+s*3,oy+21,hex('#f0e8d0'));p.set(cx+s*3,oy+20,hex('#f0e8d0'));p.set(cx+s*10,oy+13,S[2]);p.set(cx+s*11,oy+12,S[2]);}
  for(let k=0;k<8;k++)p.set(cx-5+k*1.5,oy+7+((k*3)%2),S[0]);
  outline(p);return p.done();}
// Kobold (klein, flink, mit Dolch oder Speer)
const MZ_KSKIN=[pal(['#2a3a14','#3e5a1e','#56782a','#74963a']),pal(['#3a3418','#565024','#746c34','#928a48']),pal(['#3a1a12','#5a2a1c','#7a3e28','#9a5636'])];
function mzKobold(v,f){const W=34,H=46,p=new Px(W,H),cx=17,S=MZ_KSKIN[v],V=pal(v===2?['#1a1418','#2a2028','#3a2e38']:['#2a1c10','#40301c','#584228']),a=f==='a',lL=f===1?1:0,rL=f===2?1:0;
  const rect=(x0,x1,y0,y1,pl,b)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)p.set(x,y,pl[shadeIdx((b||.6)-(x-cx)/18,pl.length,x,y)]);};
  rect(cx-4,cx-2,36,44-lL,S);rect(cx+2,cx+4,36,44-rL,S);rect(cx-5,cx-2,44-lL,45-lL,V,.3);rect(cx+2,cx+5,44-rL,45-rL,V,.3);
  rect(cx-5,cx+5,24,36,V);for(let x=cx-5;x<=cx+5;x++){if(hash2(x,3,v)<.5)p.set(x,37,V[1]);p.set(x,33,hex('#1a120a'));}p.set(cx,33,hex('#c8a040'));
  rect(cx-1,cx+1,24,30,S,.7);
  // Arme
  rect(cx-8,cx-6,24,a?33:34,S,.5);rect(cx-8,cx-6,a?34:35,a?35:36,S,.4);
  const[hx,hy]=a?[cx+9,14]:[cx+7,35];if(a)for(let k=0;k<10;k++)p.set(cx+6+k*.3,24-k,S[2]),p.set(cx+7+k*.3,24-k,S[1]);else rect(cx+6,cx+8,24,34,S,.6);
  if(v===1){for(let k=-12;k<10;k++)p.set(hx+1,hy+k,hex('#6a4420'));for(let k=0;k<4;k++)p.set(hx+1,hy-13-k,hex(k<2?'#c8ccd4':'#f0f4f8'));p.set(hx,hy-13,hex('#c8ccd4'));p.set(hx+2,hy-13,hex('#c8ccd4'));}
  else{p.set(hx,hy,hex('#3a2410'));p.set(hx+1,hy,hex('#3a2410'));for(let k=1;k<6;k++)p.set(hx+1,hy-k,hex(k>4?'#f0f4f8':'#c8ccd4'));p.set(hx,hy-1,hex('#8a6a1c'));p.set(hx+2,hy-1,hex('#8a6a1c'));}
  // Kopf mit großen Ohren
  for(let y=7;y<24;y++)for(let x=cx-8;x<=cx+8;x++){const dx=(x-cx)/7.5,dy=(y-15)/8;if(dx*dx+dy*dy>1)continue;p.set(x,y,S[shadeIdx(.65-dx*.3-dy*.2,4,x,y)]);}
  for(const s of[-1,1])for(let k=0;k<8;k++)for(let t=0;t<=Math.max(0,3-k*.4);t++)p.set(cx+s*(7+k),12-k*.6+t,S[k<3?2:1]);
  if(v===2){for(let y=5;y<13;y++)for(let x=cx-9;x<=cx+9;x++){const dx=(x-cx)/9,dy=(y-13)/8;if(dx*dx+dy*dy>1||y>11&&Math.abs(x-cx)<6)continue;p.set(x,y,V[shadeIdx(.6-dx*.3,3,x,y)]);}}
  for(const ex of[cx-4,cx+2]){p.set(ex,14,hex('#ffe040'));p.set(ex+1,14,hex('#ffe040'));p.set(ex+(ex<cx?1:0),14,hex('#1a0a00'));}p.set(cx-4,13,S[0]);p.set(cx+3,13,S[0]);
  p.set(cx,16,S[1]);p.set(cx,17,S[0]);for(let x=cx-3;x<=cx+3;x++)p.set(x,19,(x&1)?hex('#f0ecd8'):hex('#2a0c08'));p.set(cx-3,18,hex('#2a0c08'));p.set(cx+3,18,hex('#2a0c08'));
  outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{
  for(let v=0;v<3;v++)for(const f of[0,1,2,'a'])list.push(['zmb'+v+'_'+f,mzZombie(v,f)]);
  for(const w of['s','a','b','h'])for(const arm of[0,1])for(const f of[0,1,2,'a','c'])list.push(['usk'+w+(arm?'a':'')+'_'+f,mzSkel(w,arm,f)]);
  for(const k in MZ_LSTYLE)for(const f of[0,1,2,'a','c'])list.push(['lich'+k+'_'+f,mzLich(MZ_LSTYLE[k],f)]);
  for(const f of[0,1,2,'a','c'])list.push(['elich_'+f,mzLich(MZ_ELDER,f)]);
  for(const f of[0,1,2,'a'])list.push(['trl_'+f,mzTroll(f)]);
  for(let v=0;v<3;v++)for(const f of[0,1,2,'a'])list.push(['kbe'+v+'_'+f,mzKobold(v,f)]);
  for(const c of[['o','#ffa030'],['c','#9ae8ff'],['b','#6ac8ff']])list.push(['geye_'+c[0],drawGEye(c[1])]);
  list.push(['orb_frost',drawOrb(['#0a3a6a','#2a8ad0','#7ad8ff','#d8f8ff','#ffffff'])]);list.push(['orb_arrow',drawOrb(['#6a5a40','#a89878','#e8e0c8','#ffffff'],6)]);
}catch(e){console.error('Neue Gegner: Bilder',e);}};}
// =========================================================
// Gegnertypen
// =========================================================
const MZ_BONES=[['bones',2,.8],['copper',8,.5],['silver',1,.15]];
Object.assign(DT,{
  zombie:{name:'Zombie',fac:'demon',h:1.85,hp:190,dmg:13,spd:1.35,reach:1.45,cd:1.7,wind:.55,spr:e=>'zmb'+(e.v||0)+'_',xp:22,aggro:62,leash:80,rad:.4,undead:1,loot:[['meat',1,.2],['copper',10,.6],['silver',1,.2]]},
  usks:{name:'Skelettkrieger',fac:'demon',h:1.9,hp:70,dmg:9,spd:2.9,reach:1.5,cd:1.2,wind:.35,spr:'usks_',xp:16,aggro:60,leash:90,rad:.35,undead:1,loot:MZ_BONES},
  usksa:{name:'Gepanzerter Skelettkrieger',fac:'demon',h:1.95,hp:130,dmg:10,spd:2.6,reach:1.5,cd:1.2,wind:.35,spr:'usksa_',xp:24,aggro:60,leash:90,rad:.38,undead:1,armor:.6,loot:MZ_BONES.concat([['iron_ingot',1,.2]])},
  uska:{name:'Skelettberserker',fac:'demon',h:1.9,hp:85,dmg:14,spd:2.7,reach:1.65,cd:1.7,wind:.55,spr:'uska_',xp:20,aggro:60,leash:90,rad:.36,undead:1,loot:MZ_BONES},
  uskaa:{name:'Gepanzerter Skelettberserker',fac:'demon',h:1.95,hp:150,dmg:16,spd:2.5,reach:1.65,cd:1.7,wind:.55,spr:'uskaa_',xp:28,aggro:60,leash:90,rad:.4,undead:1,armor:.6,loot:MZ_BONES.concat([['iron_ingot',1,.2]])},
  uskh:{name:'Skelett mit Schild',fac:'demon',h:1.9,hp:95,dmg:8,spd:2.6,reach:1.5,cd:1.3,wind:.35,spr:'uskh_',xp:20,aggro:60,leash:90,rad:.4,undead:1,armor:.75,loot:MZ_BONES},
  uskha:{name:'Gepanzertes Skelett mit Schild',fac:'demon',h:1.95,hp:160,dmg:10,spd:2.4,reach:1.5,cd:1.3,wind:.35,spr:'uskha_',xp:30,aggro:60,leash:90,rad:.42,undead:1,armor:.5,loot:MZ_BONES.concat([['iron_ingot',1,.25]])},
  uskb:{name:'Skelettschütze',fac:'demon',h:1.9,hp:55,dmg:7,spd:2.8,reach:1.3,cd:1.3,wind:.35,spr:'uskb_',xp:18,aggro:60,leash:90,rad:.35,undead:1,archer:1,loot:MZ_BONES},
  uskba:{name:'Gepanzerter Skelettschütze',fac:'demon',h:1.95,hp:100,dmg:8,spd:2.6,reach:1.3,cd:1.3,wind:.35,spr:'uskba_',xp:26,aggro:60,leash:90,rad:.38,undead:1,archer:1,armor:.65,loot:MZ_BONES},
  elderlich:{name:'Elderlich',fac:'demon',boss:1,h:2.6,hp:2400,dmg:22,spd:2.9,reach:1.8,cd:1.4,wind:.45,spr:'elich_',xp:1100,eyes:{y:18,dx:[-2,1],c:'b'},aggro:58,leash:240,rad:.55,tint:1.1,undead:1,
    loot:[['coin',2,1],['silver',12,1],['opal',1,.5],['bones',6,1],['pmana',2,.8]]},
  troll:{name:'Troll',fac:'demon',h:3.8,hp:640,dmg:24,spd:3.0,reach:2.7,cd:2.4,wind:.75,spr:'trl_',xp:130,aggro:40,leash:90,rad:1.0,loot:[['meat',3,.9],['fur',2,.7],['silver',5,.7],['coin',1,.1]]},
  kobold:{name:'Kobold',fac:'demon',h:1.15,hp:48,dmg:5,spd:6.0,reach:1.25,cd:1.0,wind:.2,spr:e=>'kbe'+(e.v||0)+'_',xp:16,aggro:42,leash:90,rad:.3,loot:[['copper',12,.7],['silver',1,.3]]}});
for(const k in MZ_LSTYLE){const S=MZ_LSTYLE[k];DT['lich'+k]={name:S.name,fac:'demon',h:2.2,hp:k==='b'?560:480,dmg:k==='b'?12:11,spd:k==='b'?3.4:2.6,reach:k==='b'?1.9:1.6,cd:k==='b'?1.7:1.3,wind:.4,spr:'lich'+k+'_',xp:160,
  eyes:{y:18,dx:[-2,1],c:S.gl},aggro:50,leash:110,rad:.45,undead:1,lich:k,loot:[['bones',4,1],['silver',4,.9],['coin',1,.15],['pmana',1,.4]]};}
// Rüstung: weniger Schaden. Silberwaffen treffen alle Untoten härter.
{const a=hurtEnt;hurtEnt=function(e,n,by){if(e&&e.d&&e.d.armor&&!e.dead)n*=e.d.armor;return a(e,n,by);};}
{const a=weaponMult;weaponMult=function(t){let m=a(t);if(t&&t.d&&t.d.undead){const h=inv[HOT0+sel],it=h&&ITEMS[h.id];if(it&&it.mat==='silver')m*=MATS.silver.undead;}return m;};}
// Seltene Schriftrolle als Beute
function mzScroll(els){const L=SPELL_ORDER.filter(id=>SPELLS[id]&&!SPELLS[id].hidden&&els.includes(SPELLS[id].el)&&ITEMS['sr_'+id]);return L.length?'sr_'+L[(Math.random()*L.length)|0]:null;}
// =========================================================
// Verlangsamung des Spielers (Frost)
// =========================================================
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);if(P.slowT>0){P.slowT-=dt;if(state==='playing'){P.x=x0+(P.x-x0)*.5;P.z=z0+(P.z-z0)*.5;}
    if(Math.random()<dt*12)spawnParticle(P.x+(Math.random()-.5)*.8,P.y+Math.random()*1.6,P.z+(Math.random()-.5)*.8,0,.4,0,0x9ae8ff,.6,.15);}};}
{const a=shotHit;shotHit=function(s){a(s);if(s.slow&&s.fac==='demon'&&Math.hypot(P.x-s.x,P.z-s.z)<Math.max(1,s.aoe)+.5&&Math.abs(P.y+1-s.y)<2.5)P.slowT=Math.max(P.slowT||0,s.slow);};}
// =========================================================
// Effekte und verzögerte Treffer (Meteore, Feuerringe)
// =========================================================
const MZFX=[];
function mzBurst(x,y,z,n,col,sp,life,size){for(let k=0;k<n;k++)spawnParticle(x,y,z,(Math.random()-.5)*sp,Math.random()*sp*.7,(Math.random()-.5)*sp,Array.isArray(col)?col[(Math.random()*col.length)|0]:col,life||.8,size||.3);}
function mzRingFx(x,z,r,col,n){const y=groundAt(x,z,1e4);for(let k=0;k<(n||36);k++){const a=k/(n||36)*6.283;spawnParticle(x+Math.cos(a)*r,groundAt(x+Math.cos(a)*r,z+Math.sin(a)*r,y+3)+.15,z+Math.sin(a)*r,0,.6,0,col,.5,.25);}}
function mzHitArea(x,z,r,dmg,push,slow){if(state!=='playing'&&state!=='dialog')return;const d=Math.hypot(P.x-x,P.z-z);if(d<r){takeDamage(dmg);if(push){P.vx+=(P.x-x)/(d||1)*push;P.vz+=(P.z-z)/(d||1)*push;}if(slow)P.slowT=Math.max(P.slowT||0,slow);}
  for(const e of DEM)if(e.fac==='ally'&&!e.dead&&Math.hypot(e.x-x,e.z-z)<r)hurtEnt(e,dmg*.7,'demon');}
function mzFxTick(dt){for(let i=MZFX.length-1;i>=0;i--){const f=MZFX[i];f.t+=dt;
  if(f.kind==='meteor'){if(f.t<f.T){if(Math.random()<dt*14)mzRingFx(f.x,f.z,f.r*(1-.4*(f.t/f.T)),0xff5a10,20);const k=f.t/f.T,y=groundAt(f.x,f.z,1e4)+40*(1-k);spawnParticle(f.x+(1-k)*8,y,f.z,0,0,0,0xffb030,.3,.9);spawnParticle(f.x+(1-k)*8,y+.5,f.z,0,1,0,0x3a2a2a,1,.6);}
    else{const y=groundAt(f.x,f.z,1e4);mzBurst(f.x,y+.5,f.z,60,[0xff6a10,0xffb030,0xfff0a0,0x3a2a2a],10,1.1,.5);Snd.boom(.3);mzHitArea(f.x,f.z,f.r,f.dmg,7);MZFX.splice(i,1);}}
  else if(f.kind==='ring'){const r=f.r*Math.min(1,f.t/f.T);mzRingFx(f.x,f.z,r,f.col,28);if(!f.hit&&Math.hypot(P.x-f.x,P.z-f.z)<r+.4&&Math.hypot(P.x-f.x,P.z-f.z)>r-1.6){f.hit=1;mzHitArea(P.x,P.z,.6,f.dmg,f.push,f.slow);}if(f.t>=f.T)MZFX.splice(i,1);}}}
// =========================================================
// Truppen: gemeinsames Umzingeln und Angreifen
// =========================================================
// Muster: Winkel (relativ zur Seite des Anführers) und Abstand für Nahkämpfer, Schützen und Liche
const MZ_PAT={
  ring:{n:'Umzingelt ihn!',mel:(i,n)=>i/n*6.283+.4,arc:(i,n)=>(i-(n-1)/2)*.45,lic:(i,n)=>(i?1:-1)*1.3,R:6.5},
  zange:{n:'Zange! Von beiden Seiten!',mel:(i,n)=>(i%2?1:-1)*(1.6+((i>>1)%3)*.22),arc:(i,n)=>(i-(n-1)/2)*.4,lic:(i,n)=>(i%2?1:-1)*1.0,R:6},
  hammer:{n:'Hammer und Amboss!',mel:(i,n)=>Math.PI+(i-(n-1)/2)*.32,arc:(i,n)=>(i-(n-1)/2)*.35,lic:(i,n)=>(i%2?1:-1)*.9,R:6},
  welle:{n:'Welle um Welle!',mel:(i,n)=>(i-(n-1)/2)*.28,arc:(i,n)=>(i-(n-1)/2)*.5,lic:(i,n)=>(i%2?1:-1)*1.4,R:7,waves:1},
  falle:{n:'Lasst ihn kommen … jetzt!',mel:(i,n)=>(i%2?1:-1)*(2.3+((i>>1)%2)*.3),arc:(i,n)=>(i-(n-1)/2)*.6,lic:(i,n)=>(i%2?1:-1)*1.7,R:9}};
function mzSquad(leader,kind){return{leader,kind,members:[],mode:'gather',T:0,pat:'ring',base:0,atk:9,pats:kind==='elder'?['ring','zange','hammer','welle','falle']:kind==='horde'?['ring','zange']:['ring','zange']};}
function mzAngle(e){return Math.atan2(e.z-P.z,e.x-P.x);}
function mzAssign(sq){const ms=sq.members.filter(m=>!m.dead&&!m.d.archer&&!m.d.lich&&m.type!=='troll'),as=sq.members.filter(m=>!m.dead&&m.d.archer),ls=sq.members.filter(m=>!m.dead&&m.d.lich&&m!==sq.leader),P_=MZ_PAT[sq.pat];
  // nach aktuellem Winkel sortieren, damit niemand quer durch die anderen läuft
  const rel=m=>{let a=mzAngle(m)-sq.base;while(a>Math.PI)a-=6.283;while(a<-Math.PI)a+=6.283;return a;};
  const slots=ms.map((_,i)=>P_.mel(i,ms.length)).map(a=>{while(a>Math.PI)a-=6.283;while(a<-Math.PI)a+=6.283;return a;}).sort((a,b)=>a-b);
  ms.sort((a,b)=>rel(a)-rel(b)).forEach((m,i)=>{m.slotA=slots[i];m.slotR=P_.R+(m.type==='kobold'?.5:0)+(i%2)*.8;m.wave2=!!(P_.waves&&i%2);m.inPos=false;});
  as.forEach((m,i)=>{m.slotA=P_.arc(i,as.length);m.slotR=13+(i%2)*2;});ls.forEach((m,i)=>{m.slotA=P_.lic(i,ls.length);m.slotR=15;});}
function mzSay(e,t){if(e&&!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<60)try{say(e,t,2.6);}catch(_){}}
function mzCommand(sq,dt,lead){sq.T+=dt;sq.members=sq.members.filter(m=>!m.dead&&DEM.includes(m));if(!sq.members.length)return;
  const L=lead||sq.leader;const ba=L&&!L.dead?mzAngle(L):(()=>{let x=0,z=0;for(const m of sq.members){x+=m.x;z+=m.z;}return Math.atan2(z/sq.members.length-P.z,x/sq.members.length-P.x);})();
  let db=ba-sq.base;while(db>Math.PI)db-=6.283;while(db<-Math.PI)db+=6.283;sq.base+=db*Math.min(1,dt*.6);
  if(sq.mode==='gather'){const mel=sq.members.filter(m=>m.slotA!=null&&!m.d.archer&&!m.d.lich&&m.type!=='troll');const ready=mel.length?mel.filter(m=>m.inPos).length/mel.length:1;
    if(sq.T>8||(sq.T>2.2&&ready>=.75)){sq.mode='attack';sq.T=0;sq.atk=7+Math.random()*5;if(L&&L.d.lich)mzSay(L,sq.kind==='elder'?'Jetzt! Alle zugleich!':'Greift an!');else if(sq.kind==='horde'){const k=sq.members.find(m=>m.type==='kobold'&&!m.dead);if(k)mzSay(k,'Hihi! Jetzt!');}}}
  else if(sq.mode==='attack'&&sq.T>sq.atk){sq.mode='gather';sq.T=0;const ps=sq.pats.filter(p=>p!==sq.pat);sq.pat=ps[(Math.random()*ps.length)|0];mzAssign(sq);if(L&&L.d.lich)mzSay(L,MZ_PAT[sq.pat].n);}}
// Verhalten der Truppenmitglieder (vor der normalen KI)
function mzMember(e,dt){
  if(e.rise!=null){e.rise=Math.min(1,e.rise+dt*.9);e.frame=0;if(Math.random()<dt*20)spawnParticle(e.x+(Math.random()-.5)*.8,e.y+.1,e.z+(Math.random()-.5)*.8,(Math.random()-.5),1.5,(Math.random()-.5),Math.random()<.5?0x5a4a34:0x7aff3a,.7,.25);if(e.rise>=1)e.rise=null;return true;}
  const sq=e.sq;if(e.tgt!=='player')return false;if(e.d.archer)return mzArcher(e,dt,sq);
  if(e.type==='kobold'){if(e._w>0&&e.wind<=0){e.runT=1.3+Math.random()*1.0;}e._w=e.wind;if(e.runT>0)e.runT-=dt;}
  if(!sq||e.slotA==null)return false;const d=Math.hypot(P.x-e.x,P.z-e.z);
  const hold=sq.mode==='gather'||(sq.mode==='attack'&&e.wave2&&sq.T<3.5)||e.runT>0;
  if(!hold)return false;if(d<2.4&&!(e.runT>0))return false;
  const a=sq.base+e.slotA,R=e.slotR+(e.runT>0?2.5:0),tx=P.x+Math.cos(a)*R,tz=P.z+Math.sin(a)*R,ds=Math.hypot(tx-e.x,tz-e.z);
  // auf dem Weg zum Platz nicht mitten durch den Spieler laufen
  let gx=tx,gz=tz;if(ds>3){const mx=(e.x+tx)/2,mz=(e.z+tz)/2;if(Math.hypot(mx-P.x,mz-P.z)<R*.7){const am=Math.atan2(e.z-P.z,e.x-P.x),aa=am+Math.sign(Math.sin(a-am)||1)*.7;gx=P.x+Math.cos(aa)*R;gz=P.z+Math.sin(aa)*R;}}
  e.inPos=ds<1.4;if(e.inPos){e.frame=0;e.flip=((P.x-e.x)*Math.cos(P.yaw)-(P.z-e.z)*Math.sin(P.yaw))<0;}else entMove(e,gx,gz,e.d.spd*(e.runT>0?1.15:1.05),dt);
  return true;}
const MZ_ARROW={spd:28,dmg:7,col:0xe8e0c8,orb:'orb_arrow',size:.35,life:3,sy:.62};
function mzArcher(e,dt,sq){const d=Math.hypot(P.x-e.x,P.z-e.z);
  if(e.cast>0){e.cast-=dt;e.frame='c';if(e.cast<=0){shoot(e,P.x+(P.vx||0)*.25,P.y+1.1,P.z+(P.vz||0)*.25,Object.assign({},MZ_ARROW,{dmg:e.d.dmg}));}return true;}
  let tx=null,tz=null;if(d<6){const a=Math.atan2(e.z-P.z,e.x-P.x);tx=P.x+Math.cos(a)*11;tz=P.z+Math.sin(a)*11;}
  else if(sq&&e.slotA!=null&&(sq.mode==='gather'||d>20)){const a=sq.base+e.slotA;tx=P.x+Math.cos(a)*e.slotR;tz=P.z+Math.sin(a)*e.slotR;if(Math.hypot(tx-e.x,tz-e.z)<1.5)tx=null;}
  else if(d>18){tx=P.x;tz=P.z;}
  if(tx!=null&&entMove(e,tx,tz,e.d.spd,dt)>.001)return true;
  e.frame=0;e.flip=((P.x-e.x)*Math.cos(P.yaw)-(P.z-e.z)*Math.sin(P.yaw))<0;if(e.rcd<=0&&d<26){e.rcd=1.9+Math.random()*1.2;e.cast=.7;}return true;}
// =========================================================
// Liche und Elderliche
// =========================================================
const MZ_SUMPOOL=[['zombie',.25],['usks',.22],['uska',.16],['uskh',.12],['uskb',.25]];
function mzPickMinion(archers,total){let r=Math.random(),t=null;for(const[k,p]of MZ_SUMPOOL){if(r<p){t=k;break;}r-=p;}t=t||'usks';if(t==='uskb'&&archers>=Math.ceil(total/3))t='usks';
  if(t!=='zombie'&&Math.random()<.32)t+='a';return t;}
function mzSummon(L,n,sq){const own=L.minions||(L.minions=[]);const archers=sq?sq.members.filter(m=>!m.dead&&m.d.archer).length:0;
  Snd.demonRoar&&Snd.demonRoar(.25,.7);mzBurst(L.x,L.y+2,L.z,30,[0x7aff3a,0xb8ff5a,0x2a4a10],5,1,.35);
  for(let i=0;i<n;i++){const a=mzAngle(L)+(i-(n-1)/2)*.7+Math.PI*(i%2?.25:-.25),r=2.5+Math.random()*2,x=L.x+Math.cos(a)*r,z=L.z+Math.sin(a)*r;
    const t=mzPickMinion(archers,n);const e=spawnEnt(t,x,z,{v:(Math.random()*3)|0,rise:0,aggroT:999,summoned:1,master:L,home:{x,z}});e.d=Object.assign({},e.d,{dmg:Math.max(4,Math.round(e.d.dmg*.75))});e.special=mzMember;e.sq=sq||null;own.push(e);MZ.und.push(e);if(sq)sq.members.push(e);}
  if(sq)mzAssign(sq);}
// Zauber der Liche
const MZ_SP={
  feuerball:{wind:.9,cd:3.2,r:24,fn:e=>shoot(e,P.x,P.y+.5,P.z,{spd:16,dmg:17,col:0xff7a20,orb:'orb_fire',aoe:2.6,arc:1,size:1.1,life:4})},
  feuerring:{wind:.7,cd:7,r:6,fn:e=>{MZFX.push({kind:'ring',x:e.x,z:e.z,r:7,T:.6,t:0,col:0xff6a10,dmg:16,push:8});Snd.boom(.15);}},
  frostlanze:{wind:.8,cd:2.8,r:24,fn:e=>shoot(e,P.x,P.y+1,P.z,{spd:24,dmg:8,col:0x9ae8ff,orb:'orb_frost',n:3,spread:.13,size:.6,life:3,slow:2.5})},
  frostnova:{wind:.7,cd:8,r:7,fn:e=>{MZFX.push({kind:'ring',x:e.x,z:e.z,r:8,T:.5,t:0,col:0x9ae8ff,dmg:9,push:4,slow:3.5});mzBurst(e.x,e.y+1,e.z,30,[0x9ae8ff,0xffffff],6,.8,.3);}},
  schatten:{wind:.6,cd:2.6,r:26,fn:e=>shoot(e,P.x,P.y+1,P.z,{spd:13,dmg:10,col:0xa03ae0,orb:'orb_void',home:1.6,size:.8,life:5})},
  seelen:{wind:.8,cd:4,r:24,fn:e=>shoot(e,P.x,P.y+1,P.z,{spd:11,dmg:8,col:0x7aff3a,orb:'orb_poison',home:1.2,n:2,spread:.4,size:.7,life:5})},
  blinzeln:{wind:.35,cd:8,r:30,fn:e=>{mzBurst(e.x,e.y+1,e.z,24,[0xa03ae0,0x1a0628],5,.8,.35);const a=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw))+Math.PI+(Math.random()-.5)*1.2,x=P.x+Math.cos(a)*2.4,z=P.z+Math.sin(a)*2.4;
    e.x=x;e.z=z;entGround(e);mzBurst(e.x,e.y+1,e.z,24,[0xa03ae0,0xe080ff],5,.8,.35);e.atk=0;}},
  meteor:{wind:1.2,cd:9,r:32,fn:e=>{for(let k=0;k<3;k++){const a=Math.random()*6.283,r=k?2.5+Math.random()*3:0;MZFX.push({kind:'meteor',x:P.x+Math.cos(a)*r+(P.vx||0)*.5,z:P.z+Math.sin(a)*r+(P.vz||0)*.5,r:3,T:1.6+k*.35,t:0,dmg:24});}}},
  schwarm:{wind:1,cd:6,r:30,fn:e=>shoot(e,P.x,P.y+1,P.z,{spd:12,dmg:11,col:0x9a6aff,orb:'orb_void',home:1.4,n:5,spread:.35,size:.8,life:6})},
  weg:{wind:.3,cd:7,r:7,fn:e=>{mzBurst(e.x,e.y+1,e.z,30,[0x6ac8ff,0x1c1a3e],6,.8,.35);const a=mzAngle(e)+(Math.random()-.5)*1.4;e.x=P.x+Math.cos(a)*17;e.z=P.z+Math.sin(a)*17;entGround(e);mzBurst(e.x,e.y+1,e.z,30,[0x6ac8ff,0x9a6aff],6,.8,.35);}}};
// Kampfstile: Zauber (Name, Gewicht), Wunschabstand, Beschwörung
const MZ_STYLE={
  f:{sp:[['feuerball',3],['feuerring',1]],dist:15,sum:[4,5],sumCd:40,maxMin:5},
  i:{sp:[['frostlanze',3],['frostnova',1]],dist:14,sum:[4,5],sumCd:40,maxMin:5},
  s:{sp:[['seelen',1]],dist:20,sum:[5,6],sumCd:9,maxMin:6,waves:1},
  b:{sp:[['schatten',2],['blinzeln',1]],dist:3,melee:1,sum:[4,4],sumCd:50,maxMin:4},
  elder:{sp:[['meteor',2],['schwarm',2],['frostnova',1],['feuerball',1],['weg',1]],dist:16,sum:[6,6],sumCd:12,maxMin:12,lich:4}};
function mzPickSpell(st,d){const L=st.sp.filter(([k])=>MZ_SP[k].r>=d);if(!L.length)return null;let tot=0;for(const[,w]of L)tot+=w;let r=Math.random()*tot;for(const[k,w]of L){if(r<w)return k;r-=w;}return L[0][0];}
function mzLichAI(e,dt){
  if(e.rise!=null)return mzMember(e,dt);
  if(e.tgt!=='player')return false;
  const elder=e.type==='elderlich',st=MZ_STYLE[elder?'elder':e.d.lich],d=Math.hypot(P.x-e.x,P.z-e.z);e.spT=(e.spT==null?1.5:e.spT)-dt;e.sumT=(e.sumT==null?.8:e.sumT)-dt;e.licT=(e.licT==null?6:e.licT)-dt;
  const sq=e.sq,lead=sq&&sq.leader===e;if(lead)mzCommand(sq,dt,e);
  if(e.cast>0){e.cast-=dt;e.frame='c';if(Math.random()<dt*20)spawnParticle(e.x+(Math.random()-.5)*1.4,e.y+e.h*.75,e.z+(Math.random()-.5)*1.4,0,1,0,e.d.lich==='f'?0xff7a20:e.d.lich==='i'?0x9ae8ff:e.d.lich==='b'?0xa03ae0:elder?0x9a6aff:0x7aff3a,.5,.25);
    if(e.cast<=0&&e.doCast){const f=e.doCast;e.doCast=null;try{f();}catch(err){console.error('Lich-Zauber',err);}}return true;}
  // eigene Diener (bzw. beim Elderlich: alle in der Truppe ohne Liche)
  const mine=(e.minions||[]).filter(m=>!m.dead&&DEM.includes(m));e.minions=mine;const cnt=mine.length,cap=e.master?3:st.maxMin;
  if(e.sumT<=0&&cnt<cap&&(st.waves||!e.summonedOnce||cnt<2||elder)){const n=Math.min(cap-cnt,st.sum[0]+((Math.random()*(st.sum[1]-st.sum[0]+1))|0));
    if(n>0){e.cast=1.2;e.sumT=st.sumCd*(.8+Math.random()*.4);e.summonedOnce=1;e.doCast=()=>mzSummon(e,n,sq);mzSay(e,elder?'Erhebt euch, meine Diener!':st.waves?'Mehr! Immer mehr!':'Erhebt euch!');return true;}}
  if(elder&&e.licT<=0){const lc=sq?sq.members.filter(m=>!m.dead&&m.d.lich&&m!==e).length:0;if(lc<st.lich){e.cast=1.6;e.licT=28+Math.random()*10;e.doCast=()=>mzCallLiches(e,Math.min(2,st.lich-lc));mzSay(e,'Brüder der Gruft, zu mir!');return true;}e.licT=10;}
  if(e.spT<=0){const k=mzPickSpell(st,d);if(k){const S=MZ_SP[k];e.cast=S.wind;e.spT=S.cd*(.75+Math.random()*.5)*(elder?.8:1);e.doCast=()=>S.fn(e);return true;}}
  if(st.melee)return false;
  // Unter-Liche des Elderlich bleiben an ihrem Platz in der Formation
  let want=st.dist,ax=null;if(sq&&!lead&&e.slotA!=null){const a=sq.base+e.slotA;ax=[P.x+Math.cos(a)*e.slotR,P.z+Math.sin(a)*e.slotR];}
  if(ax&&Math.hypot(ax[0]-e.x,ax[1]-e.z)>1.5){entMove(e,ax[0],ax[1],e.d.spd,dt);return true;}
  if(d<want-4){const a=Math.atan2(e.z-P.z,e.x-P.x)+(e.side||(e.side=Math.random()<.5?-1:1))*.5;if(entMove(e,P.x+Math.cos(a)*want,P.z+Math.sin(a)*want,e.d.spd*1.1,dt)<.001)e.side*=-1;return true;}
  if(d>want+5){entMove(e,P.x,P.z,e.d.spd,dt);return true;}
  e.frame=0;e.flip=((P.x-e.x)*Math.cos(P.yaw)-(P.z-e.z)*Math.sin(P.yaw))<0;return true;}
function mzCallLiches(E,n){const ks=['f','i','s','b'];for(let i=0;i<n;i++){const a=mzAngle(E)+(i?1:-1)*1.1,x=E.x+Math.cos(a)*4,z=E.z+Math.sin(a)*4;
  const L=spawnEnt('lich'+ks[(Math.random()*4)|0],x,z,{rise:0,aggroT:999,summoned:1,master:E,home:{x,z}});L.special=mzLichAI;L.sq=E.sq;E.sq.members.push(L);MZ.und.push(L);mzBurst(x,L.y+1,z,40,[0x6ac8ff,0x9a6aff,0x1c1a3e],6,1,.4);}
  mzAssign(E.sq);}
function mzSpawnLich(x,z,elder){const t=elder?'elderlich':'lich'+['f','i','s','b'][(Math.random()*4)|0];const e=spawnEnt(t,x,z,{rise:0,home:{x,z},noLeash:!!elder});e.special=mzLichAI;e.sq=mzSquad(e,elder?'elder':'lich');e.sq.pat=Math.random()<.5?'ring':'zange';
  MZ.und.push(e);mzBurst(x,e.y+1,z,50,elder?[0x6ac8ff,0x9a6aff,0x0a0a18]:[0x7aff3a,0x5a4a34,0x2a1a0e],7,1.2,.45);return e;}
// Stirbt der Lich, zerfallen seine Diener
{const a=killEnt;killEnt=function(e,by){const was=!e.dead;a(e,by);if(!was||!e.d)return;
  if(e.d.lich||e.type==='elderlich'){const sq=e.sq;const list=(e.minions||[]).slice();if(sq&&sq.leader===e)for(const m of sq.members)if(!list.includes(m))list.push(m);
    let n=0;for(const m of list)if(!m.dead&&m!==e&&m.summoned){n++;MZ.crumble.push({m,t:.2+Math.random()*.9,by});}
    if(n)setTimeout(()=>toast(e.type==='elderlich'?'Der Elderlich ist vernichtet. Seine Armee zerfällt zu Staub!':'Mit dem Lich zerfallen auch seine Diener.'),600);
    if(Math.random()<(e.type==='elderlich'?1:.12)){const s=mzScroll(e.type==='elderlich'?['dark','fire','water','blood']:e.d.lich==='f'?['fire']:e.d.lich==='i'?['water']:['dark','blood']);if(s)spawnDrop(s,1,e.x,e.y+.6,e.z);}}
  if(e.hordeId)MZ.hordeKill(e);};}
// =========================================================
// Spawns: Zombies und Liche bei Nacht, Horden auf Ebene und Berg
// =========================================================
const MZ={und:[],hordes:[],crumble:[],zT:8,lT:30,hT:60,nightKey:null,lichNight:0,elderNight:0,
  hordeKill(e){const H=MZ.hordes.find(h=>h.id===e.hordeId);if(H&&H.members.every(m=>m.dead)&&!H.done){H.done=1;if(Math.hypot(e.x-P.x,e.z-P.z)<60){toast('Die Horde ist geschlagen!');gainXP(40);}}}};
function mzLevel(){return FLAGS.level||0;}
function mzSpot(dMin,dMax){for(let t=0;t<16;t++){const a=Math.random()*6.283,d=dMin+Math.random()*(dMax-dMin),x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d;
  if(!inWorld(x,z)||nightSafe(x,z))continue;const g=groundAt(x,z,1e4);if(!(g>WATER+.3))continue;if(typeof nearWater==='function'&&x>-HALF&&x<HALF&&nearWater(x,z))continue;return[x,z];}return null;}
function mzBlocked(){return state!=='playing'||P.x>60000||(typeof inRealm==='function'&&inRealm(P.x))||(typeof FIN!=='undefined'&&FIN.on)||mqIs('coda')||nightSafe(P.x,P.z)||cheatOn()||FILM.on;}
function mzSpawnHorde(x,z){const lv=mzLevel(),nt=Math.max(1,Math.min(3,1+((Math.random()*(lv>=10?3:lv>=7?2:1))|0))),nk=3+((Math.random()*(lv>=7?6:4))|0),id=Math.random();
  const H={id,members:[],sq:null,done:0};H.sq=mzSquad(null,'horde');H.sq.pat=Math.random()<.5?'ring':'zange';
  for(let i=0;i<nt;i++){const e=spawnEnt('troll',x+(Math.random()-.5)*5,z+(Math.random()-.5)*5,{hordeId:id,home:{x,z}});e.special=mzTrollAI;e.sq=H.sq;H.members.push(e);H.sq.members.push(e);}
  for(let i=0;i<nk;i++){const e=spawnEnt('kobold',x+(Math.random()-.5)*7,z+(Math.random()-.5)*7,{hordeId:id,v:(Math.random()*3)|0,home:{x,z}});e.special=mzMember;e.sq=H.sq;H.members.push(e);H.sq.members.push(e);}
  mzAssign(H.sq);MZ.hordes.push(H);return H;}
// Troll: stürmt geradewegs, schwerer Hieb mit Stoß und Bodenstampfer
function mzTrollAI(e,dt){if(e.tgt!=='player')return false;const d=Math.hypot(P.x-e.x,P.z-e.z);e.stT=(e.stT==null?4:e.stT)-dt;
  if(e.stomp>0){e.stomp-=dt;e.frame='a';if(e.stomp<=0){const g=groundAt(e.x,e.z,e.y+2);mzBurst(e.x,g+.2,e.z,40,[0x6a5a40,0x8a7a5a,0x4a3a2a],9,1,.45);mzRingFx(e.x,e.z,4.5,0x8a7a5a,30);Snd.boom(.25);mzHitArea(e.x,e.z,4.8,14,9);}return true;}
  if(e.stT<=0&&d<4.2){e.stT=6+Math.random()*4;e.stomp=.9;return true;}
  if(e._w>0&&e.wind<=0&&d<e.d.reach+1){P.vx+=(P.x-e.x)/(d||1)*7;P.vz+=(P.z-e.z)/(d||1)*7;try{Snd.boom(.12);}catch(_){}}e._w=e.wind;return false;}
function mzUndeadTick(dt){const dark=isDark(),ev=tonightEv(),peace=dark&&ev==='blue',blood=dark&&ev==='blood';
  // Untote: verschwinden weit weg, verbrennen im Tageslicht
  for(let i=MZ.und.length-1;i>=0;i--){const e=MZ.und[i];if(!DEM.includes(e)){MZ.und.splice(i,1);continue;}if(e.dead)continue;const pd=Math.hypot(e.x-P.x,e.z-P.z);
    if(pd>150||P.x>60000&&e.x<60000){removeEnt(e);MZ.und.splice(i,1);continue;}
    if(!dark||peace){if(pd>30){removeEnt(e);MZ.und.splice(i,1);continue;}if(Math.random()<dt*10)spawnParticle(e.x+(Math.random()-.5),e.y+Math.random()*e.h,e.z+(Math.random()-.5),0,1.5,0,Math.random()<.5?0xff7a1a:0x3a3034,.8,.3);
      e.hp-=e.max*.04*dt;if(e.hp<=0)killEnt(e,null);}}
  for(let i=MZ.hordes.length-1;i>=0;i--){const H=MZ.hordes[i];H.members=H.members.filter(m=>DEM.includes(m));const alive=H.members.filter(m=>!m.dead);
    if(!alive.length||alive.every(m=>Math.hypot(m.x-P.x,m.z-P.z)>170)||P.x>60000){for(const m of alive)removeEnt(m);MZ.hordes.splice(i,1);continue;}
    if(alive.some(m=>m.tgt==='player'))mzCommand(H.sq,dt,null);}
  for(let i=MZ.crumble.length-1;i>=0;i--){const c=MZ.crumble[i];c.t-=dt;if(c.t>0)continue;MZ.crumble.splice(i,1);const m=c.m;if(m.dead)continue;
    mzBurst(m.x,m.y+1,m.z,16,[0xd8d0bc,0x7aff3a],4,.8,.3);m.d=Object.assign({},m.d,{xp:Math.round((m.d.xp||0)*.5),loot:[]});killEnt(m,c.by);}
  mzFxTick(dt);
  if(mzBlocked())return;
  const key=(FLAGS.day||0)-((FLAGS.clock||600)<720?1:0);if(MZ.nightKey!==key){MZ.nightKey=key;MZ.lichNight=0;MZ.elderNight=0;}
  // Zombies
  if(dark&&!peace){MZ.zT-=dt;if(MZ.zT<=0){MZ.zT=(blood?5:9)+Math.random()*7;const zs=MZ.und.filter(e=>!e.dead&&e.type==='zombie'&&!e.summoned).length;
      if(zs<(blood?7:4)){const q=mzSpot(42,62);if(q){const n=Math.random()<.35?2:1;for(let k=0;k<n;k++){const e=spawnEnt('zombie',q[0]+(Math.random()-.5)*3,q[1]+(Math.random()-.5)*3,{v:(Math.random()*3)|0,rise:0,home:{x:q[0],z:q[1]}});e.special=mzMember;MZ.und.push(e);}
        if(!FLAGS.zombieTip){FLAGS.zombieTip=1;toast('Zombies! Langsam, aber sie lassen nicht locker.');}}}}
    // Lich (ab Stufe 3), Elderlich (ab Stufe 8, sehr selten)
    MZ.lT-=dt;if(MZ.lT<=0){MZ.lT=35+Math.random()*25;const lv=mzLevel(),hasL=MZ.und.some(e=>!e.dead&&(e.d.lich||e.type==='elderlich'));
      if(!hasL&&lv>=3){const pe=lv>=8&&!MZ.elderNight?(blood?.07:.025):0,pl=MZ.lichNight<2?(blood?.3:.14):0,r=Math.random();
        if(r<pe){const q=mzSpot(45,60);if(q){MZ.elderNight=1;mzSpawnLich(q[0],q[1],true);toast('Eine eisige Kälte zieht auf … ein Elderlich ist erwacht!');try{Snd.demonRoar(.6,.6);}catch(_){}}}
        else if(r<pe+pl){const q=mzSpot(40,55);if(q){MZ.lichNight++;const L=mzSpawnLich(q[0],q[1],false);if(!FLAGS.lichTip){FLAGS.lichTip=1;toast('Ein Lich streift durch die Nacht. Er ruft Untote zu Hilfe!');}}}}}}
  // Horden: Ebene und Sturmberg, Tag und Nacht (ab Stufe 4)
  MZ.hT-=dt;if(MZ.hT<=0){MZ.hT=70+Math.random()*50;const ar=areaAt(P.x,P.z);
    if((ar==='plain'||ar==='storm')&&mzLevel()>=4&&!MZ.hordes.some(h=>!h.done)&&Math.random()<.24&&!peace){const q=mzSpot(55,75);if(q){mzSpawnHorde(q[0],q[1]);if(!FLAGS.hordeTip){FLAGS.hordeTip=1;toast('Du hörst Trommeln und Gekicher … eine Troll- und Koboldhorde ist in der Nähe!');}}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{mzUndeadTick(dt);}catch(e){if(!mzUndeadTick.err){mzUndeadTick.err=1;console.error('Neue Gegner',e);}}};}
{const a=dangerNear;dangerNear=function(){if(a())return true;for(const e of MZ.und)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<28)return true;for(const H of MZ.hordes)for(const e of H.members)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<30)return true;return false;};}
{const a=startGame;startGame=function(){for(const e of MZ.und.slice())removeEnt(e);MZ.und.length=0;for(const H of MZ.hordes)for(const e of H.members)removeEnt(e);MZ.hordes.length=0;MZFX.length=0;P.slowT=0;return a.apply(this,arguments);};}
// =========================================================
// Horden überfallen Kutschen
// =========================================================
Object.assign(RAID,{troll:{hp:420,dmg:20,spd:3.0,reach:2.5,spr:f=>'trl_'+f,h:3.8,side:0},kobold:{hp:45,dmg:6,spd:5.6,reach:1.2,spr:f=>'kbe0_'+f,h:1.15,side:0},
  kobold1:{hp:45,dmg:7,spd:5.6,reach:1.4,spr:f=>'kbe1_'+f,h:1.15,side:0},kobold2:{hp:45,dmg:6,spd:5.8,reach:1.2,spr:f=>'kbe2_'+f,h:1.15,side:0}});
{const a=startRaid;startRaid=function(c){const ar=areaAt(c.x,c.z);if((ar==='plain'||ar==='storm')&&mzLevel()>=4&&Math.random()<.3){a(c);const ev=c.ev;if(!ev)return;
    ev.raiders.length=0;const nt=1+(Math.random()<.3?1:0),nk=3+((Math.random()*4)|0);
    for(let k=0;k<nt+nk;k++){const type=k<nt?'troll':['kobold','kobold1','kobold2'][k%3],a2=Math.random()*6.283,d=14+Math.random()*8,x=c.x+Math.cos(a2)*d,z=c.z+Math.sin(a2)*d,T=RAID[type];
      ev.raiders.push({type,x,z,y:getHeight(x,z),hp:T.hp,frame:0,anim:0,atk:0,kind2:'raid',h:T.h,flip:false});}
    try{say(ev.def[0],'Trolle und Kobolde! Verteidigt die Kutsche!',3.5);}catch(_){}return;}
  return a(c);};}
{const a=hurtRaider;hurtRaider=function(r,n){const was=r.hp>0;a(r,n);if(was&&r.hp<=0&&(r.type==='troll'||/^kobold/.test(r.type))){if(r.type==='troll'){gainXP(90);spawnDrop('silver',3+((Math.random()*4)|0),r.x,r.y+.6,r.z);if(Math.random()<.6)spawnDrop('meat',2,r.x,r.y+.5,r.z);}
    else{gainXP(8);if(Math.random()<.6)spawnDrop('copper',6+((Math.random()*8)|0),r.x,r.y+.4,r.z);}}};}
// =========================================================
// Cheat-Befehl zum Ausprobieren: /monster zombie|lich|elderlich|horde|skelette
// =========================================================
HELP.push(['/monster','Ruft zum Testen neue Gegner (nur im Cheat-Modus): zombie, lich, elderlich, horde, skelette']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/monster\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('Das geht nur im Cheat-Modus. Benutze erst /cheats on.','err');return;}
    const k=norm(t.split(/\s+/)[1]||''),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),x=P.x+fx*18,z=P.z+fz*18;
    if(k==='zombie'){for(let i=0;i<2;i++){const e=spawnEnt('zombie',x+i*1.5,z,{v:i%3,rise:0,home:{x,z}});e.special=mzMember;MZ.und.push(e);}}
    else if(k==='lich')mzSpawnLich(x,z,false);else if(k==='elderlich'||k==='elder')mzSpawnLich(x,z,true);else if(k==='horde')mzSpawnHorde(x,z);
    else if(k==='skelette'){const sq=mzSquad(null,'horde');for(const tp of['usks','uska','uskha','uskb','uskba','usksa']){const e=spawnEnt(tp,x+(Math.random()-.5)*4,z+(Math.random()-.5)*4,{rise:0,aggroT:999,home:{x,z}});e.special=mzMember;e.sq=sq;sq.members.push(e);MZ.und.push(e);}mzAssign(sq);MZ.hordes.push({id:-1,members:sq.members,sq,done:0});}
    else{conLog('Benutze: /monster zombie | lich | elderlich | horde | skelette','err');return;}
    conLog('Gegner gerufen: '+k+' (Hinweis: im Cheat-Modus nimmst du keinen Schaden)','ok');closeConsole();return;}
  return a(raw);};}
