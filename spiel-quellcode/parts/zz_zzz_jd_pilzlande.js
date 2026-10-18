/* =========================================================
   0.0.125 · Ebene 3 des Großen Turms: Die Pilzlande
   - Eine Welt im Turm: Wald, Ebenen auf mehreren Höhen, ein Fluss, zwei Wege, die sich kreuzen, ein See,
     ein großer Berg und das Pilzdorf Lamellenheim (5 Häuser). Die Wände sind Himmel, die Karte ist riesig.
   - Tag und Nacht: Eine leuchtende Riesenschnecke kriecht als Sonne über den Himmel. 7 Minuten Tag, 5 Minuten Nacht.
   - Tagsüber leben, handeln und spielen die Pilzmenschen im Dorf. Nachts kommen die Pilzzombies.
   - Oben am Berg führt eine Höhle in den Tempel der Lunar-Pilzmenschen. Sie beschwören Big Lunar (12000 LP).
   ========================================================= */
const PZ={on:false,t:60,DAY:420,NIGHT:300};
const PZD={R:188,M:{x:95,z:-95,r:80,h:34},L:{x:-58,z:52,r:22},V:{x:46,z:60},S3:{x:0,z:166},HY:-35,HR:30,
  A:[[0,166],[3,128],[28,92],[46,60],[44,22],[40,-4],[30,-36],[44,-60]],B:[[-184,-22],[-120,-34],[-60,-26],[-10,-12],[40,-4],[100,8],[184,14]],
  R1:[[80,-48],[52,-34],[22,-24],[-8,-8],[-30,14],[-46,36],[-56,50]],R2:[[-62,62],[-96,86],[-140,98],[-196,110]]};
// ---------- Bilder ----------
function pzFolk(o,f){const W=34,H=60,p=new Px(W,H),cx=17,hop=f==='h'?3:0,lL=f===1?1:0,rL=f===2?1:0,C=pal(o.cap),S=pal(o.stem),V=o.vest?pal(o.vest):null;
  const cDisc=(x0,y0,r,col)=>{for(let y=Math.floor(y0-r);y<=y0+r;y++)for(let x=Math.floor(x0-r);x<=x0+r;x++)if((x-x0)**2+(y-y0)**2<=r*r)p.set(x,y,col);};
  const ln=(x0,y0,x1,y1,w,pl)=>{const L=Math.hypot(x1-x0,y1-y0)||1,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const X=x0+(x1-x0)*t/n,Y=y0+(y1-y0)*t/n;for(let k=-w/2;k<=w/2;k+=.5)p.set(X+k,Y,pl[shadeIdx(.6-k/w*.4,pl.length,Math.round(X),Math.round(Y))]);}};
  // Beine
  if(!o.robe)for(const s of[-1,1]){const lift=(s<0?lL:rL)+(f==='h'?1:0);for(let y=48-hop;y<=57-lift-hop;y++)for(let x=cx+s*3.5-1.5;x<=cx+s*3.5+1.5;x++)p.set(x,y,S[shadeIdx(.5-(x-cx)/14,S.length,Math.round(x),y)]);for(let x=cx+s*3.5-2;x<=cx+s*3.5+2;x++)p.set(x,58-lift-hop,hex(o.shoe||'#3a2614'));}
  // Körper (Stiel) oder Robe
  if(o.robe){const R=pal(o.robe);for(let y=27-hop;y<=58;y++){const t=(y-27+hop)/31,hw=6.5+t*7;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,R[shadeIdx(.62-(x-cx)/(hw*2.4)-(y>56?.2:0)+((x+y)%7===0?-.08:0),R.length,x,y)]);}
    for(let y=28-hop;y<=58;y++)p.set(cx,y,hex(o.trim));for(let x=cx-13;x<=cx+13;x++)if(p.d[(58*W+x)*4+3])p.set(x,58,hex(o.trim));
    const G=hex(o.glow);for(const[dx,dy]of[[0,0],[-1,1],[1,1],[0,2],[0,-1]])p.set(cx+dx,38+dy-hop,G);}
  else{for(let y=22-hop;y<=48-hop;y++){const t=(y-22+hop)/26,hw=6+Math.sin(t*Math.PI)*1.6;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,S[shadeIdx(.78-(x-cx+hw)/(hw*2)*.5+(o.rot&&hash2(x,y,71)<.12?-.35:0),S.length,x,y)]);}
    if(V)for(let y=33-hop;y<=44-hop;y++){const hw=7.2;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){if(Math.abs(x-cx)<2&&y<40-hop)continue;p.set(x,y,V[shadeIdx(.65-(x-cx)/16,V.length,x,y)]);}}}
  // Arme
  const AR=o.robe?pal(o.robe):S;
  for(const s of[-1,1]){let x0=cx+s*6.5,y0=31-hop,x1,y1;if(f==='a'||f==='p'){x1=cx+s*12;y1=14-hop;}else if(f==='c'){x1=cx+s*5;y1=40-hop;}else if(o.zombie){x1=cx+s*10;y1=34-hop;}else{x1=cx+s*10;y1=42+(s<0?lL:rL)-hop;}
    ln(x0,y0,x1,y1,o.robe?4:2.5,AR);cDisc(x1,y1+(f==='a'||f==='p'?-1:1),1.6,o.robe?S[2]:S[1]);}
  if(f==='c'&&o.glow){cDisc(cx,41-hop,2.6,hex(o.glow));cDisc(cx,41-hop,1.2,hex('#ffffff'));}
  // Gesicht
  const fy=26-hop;if(o.robe){for(let x=cx-5;x<=cx+5;x++)for(let y=fy-4;y<=fy+2;y++)p.set(x,y,hex('#120a22'));}
  for(const s of[-1,1]){const ex=cx+s*3;if(o.eye){p.set(ex,fy,hex(o.eye));p.set(ex+(s<0?0:-1),fy,hex(o.eye));p.set(ex,fy-1,hex(o.eye));}else{p.set(ex,fy-1,hex('#141018'));p.set(ex,fy,hex('#141018'));p.set(ex+(s<0?1:-1)*0,fy-2,hex('#ffffff'));p.set(cx+s*5,fy+2,hex('#e89a9a'));}}
  if(o.zombie){for(let x=cx-3;x<=cx+3;x++)p.set(x,fy+3,hex('#1a120c'));for(const x of[cx-2,cx,cx+2])p.set(x,fy+4,hex('#1a120c'));}else if(!o.robe){p.set(cx-1,fy+3,hex('#7a4a3a'));p.set(cx,fy+4,hex('#7a4a3a'));p.set(cx+1,fy+3,hex('#7a4a3a'));}
  // Hut
  for(let y=1-hop;y<=20-hop;y++){const t=(y-1+hop)/17,hw=t<1?16*Math.sqrt(Math.max(0,1-(1-t)**2)):16-(y-18+hop)*1.5;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){if(o.rot&&y>16-hop&&hash2(x,3,72)<.35)continue;
      p.set(x,y,C[shadeIdx(.78-(x-cx)/30-t*.38+(hash2(x,y,73)-.5)*.1+(o.rot&&hash2(x>>1,y>>1,74)<.15?-.3:0),C.length,x,y)]);}}
  for(let x=cx-12;x<=cx+12;x++)p.set(x,21-hop,S[0]);
  for(const[sx,sy,r]of[[cx-8,8,2.2],[cx+3,5,1.8],[cx+9,11,2.3],[cx-1,12,1.5],[cx-12,14,1.3],[cx+5,15,1.2],[cx-5,3,1.1]])cDisc(sx,sy-hop,r,hex(o.spot));
  if(o.glow&&o.robe)for(const[sx,sy]of[[cx-8,8],[cx+9,11],[cx+3,5]])p.set(sx,sy-hop,hex('#ffffff'));
  outline(p);return p.done();}
const PZ_LOOK={pf0:{cap:['#6a0e0a','#9a1a12','#c8281a','#e8502c'],spot:'#f4f0e4',stem:['#a89a82','#cfc2a6','#ece2c8','#fff8e6'],vest:['#2a4a1a','#3c6a26','#548a36']},
  pf1:{cap:['#4a2a10','#6e4018','#945a24','#b87a36'],spot:'#e8d8b0',stem:['#a8987e','#cdbc9e','#e8dcc0','#fbf2dc'],vest:['#2a2a5a','#3c3c80','#5050a4']},
  pf2:{cap:['#7a3a06','#a85a0c','#d8801a','#f0a83a'],spot:'#fff4d0',stem:['#aa9c84','#d0c4a8','#ece4ca','#fff8e8'],vest:['#5a1a2a','#7a2a3c','#9a3a52']},
  pf3:{cap:['#3a1a4a','#5a2a6a','#7a3e8e','#9a58b0'],spot:'#f0e4ff',stem:['#a69a88','#ccc0aa','#e8dec8','#fff6e8'],vest:['#5a4a1a','#7a6a26','#9a8a36']},
  pzz:{cap:['#2a2c22','#3e4232','#566048','#6e785c'],spot:'#22241c',stem:['#4a5040','#646c56','#7e8870','#98a088'],eye:'#d8ff40',zombie:1,rot:1,shoe:'#1a1a14'},
  pzc:{cap:['#0a1e5a','#123088','#1c48b8','#3a72e8'],spot:'#7af0ff',stem:['#6878a8','#8a9ac8','#aebce4','#d8e4ff'],robe:['#1a0e2e','#2a1844','#3c2460','#52347e'],trim:'#b8c8e8',glow:'#7af0ff',eye:'#9af8ff'}};
// Big Lunar: riesiger blauer Pilzgolem
function pzBig(f){const W=160,H=200,p=new Px(W,H),cx=80,sl=f==='a'?14:0,C=pal(['#06103a','#0c1c5e','#142c86','#1e42b0','#2e5ed8']),B=pal(['#2a3248','#3c4662','#525e80','#6c789c','#8a96b8']),GL=hex('#7af0ff'),GW=hex('#e8ffff');
  const ell=(x0,y0,rx,ry,pl,b=.6)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;p.set(x,y,pl[shadeIdx(b-dx*.25-dy*.25+(hash2(x>>1,y>>1,81)-.5)*.14,pl.length,x,y)]);}};
  const limb=(x0,y0,x1,y1,w0,w1,pl)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=w0+(w1-w0)*q;for(let o=-w/2;o<=w/2;o+=.5)p.set(X+nx*o,Y+ny*o,pl[shadeIdx(.6-o/w*.5+(hash2(Math.round(X)>>1,Math.round(Y)>>1,82)-.5)*.15,pl.length,Math.round(X+nx*o),Math.round(Y+ny*o))]);}};
  const crack=(x0,y0,n,sd)=>{let x=x0,y=y0;for(let k=0;k<n;k++){p.set(x,y,GL);x+=hash2(k,sd,83)<.5?1:-1;y+=1;if(hash2(k,sd,84)<.2)p.set(x,y,GW);}};
  const fist=(x,y)=>{ell(x,y,13,11,B,.55);for(const[dx,dy,r]of[[-7,-8,5],[4,-10,6],[9,-3,4]])ell(x+dx,y+dy,r,r*.7,C,.7);p.set(x-7,y-10,GL);p.set(x+4,y-13,GL);};
  const lL=f===1?4:0,rL=f===2?4:0;
  // Beine
  for(const s of[-1,1]){const lift=s<0?lL:rL;limb(cx+s*20,160+sl*.5,cx+s*24,194-lift,24,20,B);for(let k=0;k<4;k++)limb(cx+s*24,194-lift,cx+s*(16+k*6),198-lift,3,2,B);}
  // Rumpf
  const ty=118+sl;ell(cx,ty,42,46,B,.62);ell(cx,ty+20,34,24,B,.7);crack(cx-14,ty-28,30,1);crack(cx+16,ty-20,26,2);crack(cx-2,ty+4,24,3);crack(cx+26,ty+10,16,4);
  for(const s of[-1,1]){ell(cx+s*38,ty-36,9,6,C,.7);p.set(cx+s*38,ty-38,GL);ell(cx+s*30,ty-40,5,4,C,.7);}
  // Arme
  let la,ra;if(f==='w'){la=[[cx-40,ty-30],[cx-58,ty-70],[cx-46,30]];ra=[[cx+40,ty-30],[cx+58,ty-70],[cx+46,30]];}
  else if(f==='a'){la=[[cx-40,ty-28],[cx-52,ty+20],[cx-38,186]];ra=[[cx+40,ty-28],[cx+52,ty+20],[cx+38,186]];}
  else if(f==='c'||f==='r'){la=[[cx-40,ty-30],[cx-62,ty-24],[cx-74,ty-36]];ra=[[cx+40,ty-30],[cx+62,ty-24],[cx+74,ty-36]];}
  else{const sw=f===1?6:f===2?-6:0;la=[[cx-40,ty-30],[cx-58,ty+6+sw],[cx-62,160+sw]];ra=[[cx+40,ty-30],[cx+58,ty+6-sw],[cx+62,160-sw]];}
  for(const A of[la,ra]){limb(A[0][0],A[0][1],A[1][0],A[1][1],24,20,B);limb(A[1][0],A[1][1],A[2][0],A[2][1],20,17,B);crack(A[1][0]-2,A[1][1]-8,12,A[0][0]);fist(A[2][0],A[2][1]);}
  if(f==='c')for(const A of[la,ra]){ell(A[2][0],A[2][1]-14,6,6,pal(['#3ab8ff','#7af0ff','#e8ffff']),.6);}
  // Kopf und Hut
  const hy=f==='r'?62:70+sl;ell(cx,hy+22,26,20,B,.6);
  for(const s of[-1,1]){ell(cx+s*12,hy+18,5,3.5,[GL,GW,GW],.6);p.set(cx+s*12,hy+18,GW);}
  if(f==='r'){ell(cx,hy+34,11,8,pal(['#04081a','#0a1440']),.4);for(let k=-8;k<=8;k+=4)p.set(cx+k,hy+28,GW);}else{for(let x=cx-10;x<=cx+10;x++)p.set(x,hy+32,hex('#04081a'));for(let x=cx-8;x<=cx+8;x+=4)p.set(x,hy+31,GL);}
  for(let y=hy-66;y<=hy+4;y++){const t=(y-hy+66)/66,hw=78*Math.sqrt(Math.max(0,1-(1-t)**2.2));for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)p.set(x,y,C[shadeIdx(.85-(x-cx)/170-t*.45+(hash2(x>>1,y>>1,85)-.5)*.12,C.length,x,y)]);}
  for(let x=cx-74;x<=cx+74;x+=3){p.set(x,hy+5,hex('#0a1a4a'));p.set(x,hy+6,GL);if(hash2(x,1,86)<.3)for(let k=0;k<4;k++)p.set(x,hy+6+k,k<3?GL:GW);}
  for(const[sx,sy,r]of[[-44,-26,8],[-14,-50,7],[18,-38,9],[48,-20,7],[-60,-6,5],[2,-16,6],[32,-56,5],[-30,-44,5],[62,-4,4]]){const x0=cx+sx,y0=hy+sy;for(let y=Math.floor(y0-r);y<=y0+r;y++)for(let x=Math.floor(x0-r);x<=x0+r;x++){const d=Math.hypot(x-x0,y-y0);if(d<=r)p.set(x,y,d<r*.5?GW:GL);}}
  outline(p);return p.done();}
function pzSnailTex(){const W=96,H=48,p=new Px(W,H),S=pal(['#c8901a','#f0b830','#ffe070','#fff4c0','#ffffff']),Bd=pal(['#e8d090','#fff0b8','#fffbe8']);
  for(let x=4;x<88;x++){const t=(x-4)/84,top=H-4-Math.sin(Math.pow(t,.7)*Math.PI*.55)*10-(t>.82?(t-.82)*30:0);for(let y=Math.round(top);y<H-2;y++)p.set(x,y,Bd[shadeIdx(.85-(y-top)/14,3,x,y)]);}
  for(const s of[0,1]){const bx=82+s*4,by=24;for(let k=0;k<10;k++)p.set(bx-k*.3+s,by+k*.9,Bd[1]);for(let y=by-2;y<=by+1;y++)for(let x=bx-1;x<=bx+2;x++)p.set(x+s,y,hex('#ffffff'));}
  const cx=40,cy=22;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const dx=x-cx,dy=(y-cy)*1.05,r=Math.hypot(dx,dy);if(r>19)continue;const a=Math.atan2(dy,dx),sp=((a/(Math.PI*2)+1)%1+r/7)%1;p.set(x,y,S[shadeIdx(.95-r/32+(sp<.18?-.35:0),S.length,x,y)]);}
  return p.done();}
function pzGlowTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,244,200,0.9)');g.addColorStop(.35,'rgba(255,220,140,0.35)');g.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k in PZ_LOOK)for(const f of[0,1,2,'a','h','p','c'])list.push([k+'_'+f,pzFolk(PZ_LOOK[k],f)]);for(const f of[0,1,2,'w','a','c','r'])list.push(['blg_'+f,pzBig(f)]);}catch(e){console.error('Pilzlande: Bilder',e);}};}
Object.assign(DT,{
  pf0:{name:'Pilzmensch',fac:'neutral',h:1.75,hp:100,dmg:0,spd:1.6,reach:.5,cd:2,spr:'pf0_',aggro:.01,rad:.32},pf1:{name:'Pilzmensch',fac:'neutral',h:1.75,hp:100,dmg:0,spd:1.6,reach:.5,cd:2,spr:'pf1_',aggro:.01,rad:.32},
  pf2:{name:'Pilzmensch',fac:'neutral',h:1.75,hp:100,dmg:0,spd:1.6,reach:.5,cd:2,spr:'pf2_',aggro:.01,rad:.32},pf3:{name:'Pilzmensch',fac:'neutral',h:1.75,hp:100,dmg:0,spd:1.6,reach:.5,cd:2,spr:'pf3_',aggro:.01,rad:.32},
  pzzombie:{name:'Pilzzombie',fac:'demon',h:1.8,hp:170,dmg:12,spd:1.7,reach:1.4,cd:1.6,wind:.5,spr:'pzz_',xp:24,aggro:32,leash:70,rad:.4,undead:1,loot:[['mushroom',1,.5],['copper',8,.5]]},
  pzcult:{name:'Lunar-Kultist',fac:'demon',h:1.8,hp:90,dmg:6,spd:3,reach:1.2,cd:1.5,spr:'pzc_',xp:40,aggro:0,leash:99,rad:.35,tint:1.2,glow:.8,loot:[['bluecap',2,.8],['silver',3,.5]]},
  pzspore:Object.assign({},DT.bshroom||{h:1,hp:40,spr:'bm_'},{name:'Lunar-Sporling',fac:'demon',hp:55,dmg:7,spd:4.2,aggro:40,leash:80,xp:10,loot:[['bluecap',1,.3]]}),
  biglunar:{name:'Big Lunar',fac:'demon',boss:1,h:8.8,hp:12000,dmg:30,spd:2.3,reach:4.6,cd:1.6,wind:.6,spr:'blg_',xp:4500,rad:2.8,aggro:70,leash:999,tint:1.1,glow:.6,
    loot:[['coin',8,1],['silver',80,1],['hpot2',3,1],['starshard',2,1],['bluecap',6,1]]}});
// ---------- Gelände ----------
const pzSegD=(x,z,L)=>{let b=1e9;for(let i=0;i<L.length-1;i++){const[ax,az]=L[i],[bx,bz]=L[i+1],dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz),0,1),d=Math.hypot(x-ax-dx*t,z-az-dz*t);if(d<b)b=d;}return b;};
function pzSpiral(){const M=PZD.M,E=PZD.E,a1=Math.atan2(E.z-M.z,E.x-M.x),pts=[];for(let k=0;k<=40;k++){const q=k/40,a=a1+(1-q)*Math.PI*1.35,r=62-(62-Math.hypot(E.x-M.x,E.z-M.z))*q;pts.push([M.x+Math.cos(a)*r,M.z+Math.sin(a)*r]);}return pts;}
{const M=PZD.M,a=Math.atan2(PZD.V.z-M.z,PZD.V.x-M.x)+.35;PZD.E={x:M.x+Math.cos(a)*24,z:M.z+Math.sin(a)*24,a};PZD.SP=pzSpiral();PZD.A.push(PZD.SP[0]);}
function pzRawH(x,z,s){let h=.6+fbm(x*.011+50,z*.011,3,s)*3.4;const tv=fbm(x*.0045+9,z*.0045-3,2,s+1)*3.4,fl=Math.floor(tv),fr=tv-fl,ter=(fl+smooth(clamp((fr-.8)/.2,0,1)))*3.6;
  const dR=Math.min(pzSegD(x,z,PZD.R1),pzSegD(x,z,PZD.R2)),dL=Math.hypot(x-PZD.L.x,z-PZD.L.z),dV=Math.hypot(x-PZD.V.x,z-PZD.V.z),dS=Math.hypot(x-PZD.S3.x,z-PZD.S3.z);
  const calm=smooth(clamp((Math.min(dR,dL-PZD.L.r)-6)/28,0,1))*smooth(clamp((dV-20)/26,0,1))*smooth(clamp((dS-12)/20,0,1));h+=ter*calm;
  const dm=Math.hypot(x-PZD.M.x,z-PZD.M.z);if(dm<PZD.M.r)h+=PZD.M.h*Math.pow(1-dm/PZD.M.r,1.5)*(.9+.2*vnoise(x*.05,z*.05,s+2));
  const dE=Math.hypot(x-PZD.E.x,z-PZD.E.z);if(PZD.Eh!=null&&dE<9){const he=PZD.Eh;h=h+(he-h)*smooth(clamp(1-(dE-5)/4,0,1));}
  const r=Math.hypot(x,z);if(r>160)h+=(r-160)*.5;
  if(dR<7.5){const k=smooth(1-dR/7.5);h=h*(1-k)-1.5*k;}
  if(dL<PZD.L.r+6){const k=smooth(clamp((PZD.L.r+6-dL)/8,0,1)),bowl=-.6-2*(1-Math.min(1,dL/PZD.L.r)**2);h=h*(1-k)+bowl*k;}
  if(dV<20)h=h+(1.2-h)*smooth(clamp((20-dV)/8,0,1));if(dS<12)h=h+(1-h)*smooth(clamp((12-dS)/5,0,1));
  return h;}
function pzT(x,z){const G=PZ.g;if(!G)return null;const fx=(x-G.ox)/2,fz=(z-G.oz)/2,i=Math.floor(fx),j=Math.floor(fz);if(i<0||j<0||i>=G.n-1||j>=G.n-1)return null;const u=fx-i,v=fz-j,n=G.n,H=G.h,k=j*n+i;return DG_Y+(H[k]*(1-u)+H[k+1]*u)*(1-v)+(H[k+n]*(1-u)+H[k+n+1]*u)*v;}
let PZM=null;function pzMats(){if(PZM)return PZM;const tx=(fn)=>{const S=64,p=new Px(S,S);for(let y=0;y<S;y++)for(let x=0;x<S;x++)p.set(x,y,fn(x,y));const t=new THREE.CanvasTexture(p.done());t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapLinearFilter;return t;};
  const G=pal(['#6a6a6a','#7c7c7c','#8e8e8e','#a2a2a2','#b6b6b6']);
  const grass=tx((x,y)=>{let v=.55+(hash2(x>>2,y>>2,91)-.5)*.25+(hash2(x,y,92)-.5)*.25;if(hash2(x,y>>1,93)<.08)v+=.25;if(hash2(x,y,94)<.03)v-=.3;return G[shadeIdx(v,5,x,y)];});
  const tri=(map,sc)=>{const m=new THREE.MeshPhongMaterial({map,vertexColors:true,shininess:4,specular:0x101010});m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;').replace('#include <project_vertex>','#include <project_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;').replace('#include <map_fragment>',`vec3 bw=pow(abs(vWN),vec3(6.0));bw/=(bw.x+bw.y+bw.z+1e-4);vec3 t1=texture2D(map,vWP.zy*${sc}).rgb*bw.x+texture2D(map,vWP.xz*${sc}).rgb*bw.y+texture2D(map,vWP.xy*${sc}).rgb*bw.z;vec4 texelColor=mapTexelToLinear(vec4(t1*1.45,1.0));diffuseColor*=texelColor;`);};return m;};
  PZM={ground:tri(grass,'.3'),water:new THREE.MeshPhongMaterial({color:0x3a7aa0,transparent:true,opacity:.72,shininess:60,specular:0x8ab0c8,depthWrite:false}),
    wood:bMats().wood,dark:new THREE.MeshBasicMaterial({color:0x080610}),win:new THREE.MeshBasicMaterial({color:0xffd070}),stem:new THREE.MeshLambertMaterial({color:0xe8dcc0}),
    glowB:new THREE.MeshBasicMaterial({color:0x6ae8ff}),glowW:new THREE.MeshBasicMaterial({color:0xe8ffff}),fire:new THREE.MeshBasicMaterial({color:0xffa030})};return PZM;}
function pzCapTex(col,spot){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,64,64);const r=mulberry32(col.length*97+spot.length);
  for(let k=0;k<14;k++){x.fillStyle=spot;const px=r()*64,py=r()*40,s=3+r()*5;x.fillRect(px|0,py|0,s|0,s|0);}for(let y=0;y<64;y++)for(let k=0;k<6;k++){x.fillStyle='rgba(0,0,0,'+(.04+r()*.06)+')';x.fillRect((r()*64)|0,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;}
function pzColGeo(g,cl){const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){const v=(hash2(i,7,95)-.5)*.08;a[i*3]=cl[0]+v;a[i*3+1]=cl[1]+v;a[i*3+2]=cl[2]+v;}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g;}
function pzInvert(g){const n=g.attributes.normal;for(let i=0;i<n.array.length;i++)n.array[i]*=-1;const idx=g.index;if(idx){const A=idx.array;for(let i=0;i<A.length;i+=3){const t=A[i+1];A[i+1]=A[i+2];A[i+2]=t;}}return g;}
// ---------- Aufbau ----------
function pzBuild(K){const X=K.X,Z=K.Z,Y=DG_Y,s=((WSEED|0)^0x51f3)>>>0,M=pzMats(),grp=K.grp,R=mulberry32(s+3);
  PZD.Eh=null;PZD.Eh=pzRawH(PZD.E.x,PZD.E.z,s);
  // Höhenraster (2 m)
  const n=211,ox=X-210,oz=Z-210,H=new Float32Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++)H[j*n+i]=pzRawH(-210+i*2,-210+j*2,s);
  PZ.g={n,ox,oz,h:H};
  // Boden mit Farben: Gras, Wege, Fels, Sand, Flussbett
  const pos=new Float32Array(n*n*3),col=new Float32Array(n*n*3),paths=[PZD.A,PZD.B,PZD.SP];
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const k=j*n+i,lx=-210+i*2,lz=-210+j*2,h=H[k];pos[k*3]=X+lx;pos[k*3+1]=Y+h;pos[k*3+2]=Z+lz;
    const g1=vnoise(lx*.03,lz*.03,s+5),forest=fbm(lx*.008,lz*.008,2,s+6);let c=[.34+.06*g1,.52+.08*g1,.22+.04*g1];if(forest>.55)c=[c[0]*.85,c[1]*.9,c[2]*.85];
    const sl=Math.abs((H[Math.min(k+1,n*n-1)]-H[Math.max(k-1,0)]))/4+Math.abs((H[Math.min(k+n,n*n-1)]-H[Math.max(k-n,0)]))/4;
    if(sl>.55||h>24){const q=clamp(Math.max((sl-.55)*2.2,(h-24)/6),0,1);c=[c[0]+(.5-c[0])*q,c[1]+(.5-c[1])*q,c[2]+(.5-c[2])*q];}
    let pd=1e9;for(const L of paths)pd=Math.min(pd,pzSegD(lx,lz,L));const pw=1.7+vnoise(lx*.2,lz*.2,s+7)*.9;if(pd<pw){const q=smooth(clamp((pw-pd)/1.2,0,1));c=[c[0]+(.56-c[0])*q,c[1]+(.45-c[1])*q,c[2]+(.3-c[2])*q];}
    if(h<.35){const q=clamp((.35-h)/1.2,0,1);c=[c[0]+(.66-c[0])*q,c[1]+(.6-c[1])*q,c[2]+(.44-c[2])*q];}if(h<-.6){c=[.38,.36,.3];}
    const v=.9+.2*vnoise(lx*.25,lz*.25,s+8);col[k*3]=c[0]*v;col[k*3+1]=c[1]*v;col[k*3+2]=c[2]*v;}
  const idx=[];for(let j=0;j<n-1;j++)for(let i=0;i<n-1;i++){const a=j*n+i,b=a+1,c=a+n,e=c+1;if(Math.hypot(-210+i*2,-210+j*2)>205)continue;idx.push(a,c,b,b,c,e);}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(pos,3));gg.setAttribute('color',new THREE.BufferAttribute(col,3));gg.setIndex(new THREE.BufferAttribute(new Uint32Array(idx),1));gg.computeVertexNormals();
  const ground=new THREE.Mesh(gg,M.ground);ground.frustumCulled=false;grp.add(ground);
  // Wasser: Fluss und See
  const wp=[],WY=Y-.5;for(let j=0;j<n-1;j++)for(let i=0;i<n-1;i++){const k=j*n+i;if(Math.min(H[k],H[k+1],H[k+n],H[k+n+1])<-.5){const x=X-210+i*2,z=Z-210+j*2;wp.push(x,WY,z,x,WY,z+2,x+2,WY,z,x+2,WY,z,x,WY,z+2,x+2,WY,z+2);}}
  const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(wp),3));wg.computeVertexNormals();const water=new THREE.Mesh(wg,M.water);water.renderOrder=2;grp.add(water);
  // Himmel (folgt der Kamera) mit Sternen und der Schnecke als Sonne
  const skyM=new THREE.ShaderMaterial({uniforms:{day:{value:1},sun:{value:new THREE.Vector3(0,1,0)}},depthWrite:false,depthTest:false,side:THREE.BackSide,fog:false,
    vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:`uniform float day;uniform vec3 sun;varying vec3 vD;float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453);}
      void main(){float y=max(vD.y,-.2);vec3 dT=vec3(.29,.54,.85),dH=vec3(.74,.86,.88),nT=vec3(.02,.03,.09),nH=vec3(.08,.11,.2);vec3 top=mix(nT,dT,day),hor=mix(nH,dH,day);
      vec3 c=mix(hor,top,pow(clamp(y,0.,1.),.55));float s=max(dot(normalize(vD),normalize(sun)),0.);c+=vec3(1.,.85,.5)*pow(s,24.)*.5*day;
      vec3 q=floor(vD*260.);float st=step(.9965,h(q))*(1.-day)*clamp(y*3.,0.,1.);c+=vec3(st*.9,st*.9,st);gl_FragColor=vec4(c,1.);}`});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(150,32,16),skyM);sky.renderOrder=-3;sky.frustumCulled=false;sky.onBeforeRender=(r,sc,cam)=>{sky.position.copy(cam.position);sky.updateMatrixWorld();};grp.add(sky);
  const sTex=new THREE.CanvasTexture(pzSnailTex());sTex.magFilter=THREE.NearestFilter;const snail=new THREE.Mesh(new THREE.PlaneGeometry(1,.5),new THREE.MeshBasicMaterial({map:sTex,transparent:true,alphaTest:.1,depthWrite:false,fog:false}));
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:pzGlowTex(),transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));
  snail.renderOrder=-1;halo.renderOrder=-2;snail.frustumCulled=halo.frustumCulled=false;const place=(m,sz)=>(r,sc,cam)=>{m.position.copy(cam.position).addScaledVector(PZ.sunDir,140);m.lookAt(cam.position);m.scale.set(sz*(m===snail?-1:1),sz,1);m.updateMatrixWorld();};
  snail.onBeforeRender=place(snail,30);halo.onBeforeRender=place(halo,60);grp.add(halo);grp.add(snail);
  // Licht
  const amb=new THREE.AmbientLight(0xd8d8d0,.6),sun=new THREE.DirectionalLight(0xfff0d0,.75);sun.target.position.set(X,Y,Z);grp.add(amb,sun,sun.target);
  Object.assign(PZ,{on:true,X,Z,sky:skyM,snail,halo,amb,sun,sunDir:new THREE.Vector3(1,.2,.3).normalize(),cols:new Map(),folk:[],zombies:[],fx:[],t:60,night:false,cult:0,water:WY});
  // Kollision (Kreise in einem Raster)
  const colAdd=(x,z,r)=>{const k=Math.floor(x/8)*100003+Math.floor(z/8);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const kk=(Math.floor(x/8)+a)*100003+Math.floor(z/8)+b;let l=PZ.cols.get(kk);if(!l)PZ.cols.set(kk,l=[]);l.push({x,z,r});}};
  // Bäume, Gras, Blumen, Pilze als Billboards
  const TS=['oak0','oak1','oak2','birch0','birch1','pine0','pine1','pine2'].filter(k=>SPR[k]),PS=['pine0','pine1','pine2'].filter(k=>SPR[k]),GS=['grass0','grass1','grass2','tall0','tall1','flower0','flower1','flower2','flower3','mushroom'].filter(k=>SPR[k]);
  const bb=[],okT=(lx,lz)=>{const h=pzRawH(lx,lz,s);if(h<.2||Math.hypot(lx,lz)>182)return false;for(const L of paths)if(pzSegD(lx,lz,L)<4)return false;if(Math.hypot(lx-PZD.V.x,lz-PZD.V.z)<26||Math.hypot(lx-PZD.S3.x,lz-PZD.S3.z)<16||Math.hypot(lx-PZD.E.x,lz-PZD.E.z)<12)return false;return true;};
  for(let t=0;t<9000&&bb.length<800;t++){const lx=(R()-.5)*370,lz=(R()-.5)*370,f=fbm(lx*.008,lz*.008,2,s+6),dm=Math.hypot(lx-PZD.M.x,lz-PZD.M.z);let p=f>.55?.75:f>.45?.18:.04;if(lx<-60)p+=.1;if(dm<PZD.M.r)p=dm<34?0:.12;if(R()>p||!okT(lx,lz))continue;
    const ks=dm<PZD.M.r?PS:TS;if(!ks.length)break;const sp=ks[(R()*ks.length)|0],S=SPR[sp],h=(sp.startsWith('pine')?7:7.5)+R()*3.5,y=Y+pzRawH(lx,lz,s)-.25;bb.push({x:X+lx,y,z:Z+lz,w:h*S.w/S.h,h,spr:sp,tint:.8+R()*.25,sway:.05});colAdd(X+lx,Z+lz,.38);}
  for(let t=0;t<6000&&GS.length;t++){const lx=(R()-.5)*360,lz=(R()-.5)*360,h=pzRawH(lx,lz,s);if(h<.25||Math.hypot(lx,lz)>182)continue;let pd=1e9;for(const L of paths)pd=Math.min(pd,pzSegD(lx,lz,L));if(pd<2)continue;const sp=GS[(R()*GS.length)|0],S=SPR[sp],hh=sp==='mushroom'?.35+R()*.3:sp.startsWith('tall')?1.1+R()*.5:.5+R()*.4;bb.push({x:X+lx,y:Y+h-.05,z:Z+lz,w:hh*S.w/S.h,h:hh,spr:sp,tint:.85+R()*.25,sway:sp==='mushroom'?0:.08});}
  if(bb.length&&decorMat){const bm=makeBillboards(bb,decorMat);bm.frustumCulled=false;grp.add(bm);}
  // Riesenpilze im Wald
  for(let t=0,c=0;t<600&&c<28;t++){const lx=(R()-.5)*340,lz=(R()-.5)*340;if(!okT(lx,lz)||fbm(lx*.008,lz*.008,2,s+6)<.5)continue;c++;const h=3+R()*4,r=h*.55,y=Y+pzRawH(lx,lz,s),cols=[['#a8201a','#f4f0e4'],['#8a5a2a','#f0e0c0'],['#2a5ac8','#d8f0ff'],['#d87a1a','#fff0c8']][(R()*4)|0];
    const st=new THREE.Mesh(new THREE.CylinderGeometry(r*.18,r*.24,h,8),M.stem);st.position.set(X+lx,y+h/2,Z+lz);grp.add(st);const cap=new THREE.Mesh(new THREE.SphereGeometry(r,14,7,0,6.283,0,Math.PI/2),new THREE.MeshLambertMaterial({map:pzCapTex(cols[0],cols[1])}));cap.scale.y=.55;cap.position.set(X+lx,y+h-.2,Z+lz);grp.add(cap);colAdd(X+lx,Z+lz,r*.22+.2);}
  // Brücken über den Fluss, wo die Wege ihn kreuzen
  const isect=(p,q,r2,s2)=>{const d=(q[0]-p[0])*(s2[1]-r2[1])-(q[1]-p[1])*(s2[0]-r2[0]);if(Math.abs(d)<1e-6)return null;const t=((r2[0]-p[0])*(s2[1]-r2[1])-(r2[1]-p[1])*(s2[0]-r2[0]))/d,u=((r2[0]-p[0])*(q[1]-p[1])-(r2[1]-p[1])*(q[0]-p[0]))/d;return t>=0&&t<=1&&u>=0&&u<=1?[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,Math.atan2(q[0]-p[0],q[1]-p[1])]:null;};
  for(const L of[PZD.A,PZD.B])for(let i=0;i<L.length-1;i++)for(const RV of[PZD.R1,PZD.R2])for(let k=0;k<RV.length-1;k++){const c=isect(L[i],L[i+1],RV[k],RV[k+1]);if(!c)continue;const[bx,bz,ang]=c,dx=Math.sin(ang),dz=Math.cos(ang),e1=pzRawH(bx-dx*9,bz-dz*9,s),e2=pzRawH(bx+dx*9,bz+dz*9,s),top=Math.max(e1,e2,.3);
    const y1=Math.max(e1,.3),y2=Math.max(e2,.3),ym=(y1+y2)/2,deck=new THREE.Mesh(new THREE.BoxGeometry(3.4,.35,18.4),M.wood);deck.position.set(X+bx,Y+ym-.17,Z+bz);deck.lookAt(X+bx+dx*9,Y+y2-.17,Z+bz+dz*9);grp.add(deck);
    for(const sd of[-1,1]){const ox3=Math.cos(ang)*sd*1.6,oz3=-Math.sin(ang)*sd*1.6,rail=new THREE.Mesh(new THREE.BoxGeometry(.15,.9,18),M.wood);rail.position.set(X+bx+ox3,Y+ym+.45,Z+bz+oz3);rail.lookAt(X+bx+ox3+dx*9,Y+y2+.45,Z+bz+oz3+dz*9);grp.add(rail);}
    DGX.sol.push(solAdd({x:X+bx,z:Z+bz,hw:1.7,hd:9.2,y0:Y+y1,y1:Y+y2,ramp:1,rot:-ang,solid:0,walk:1,dg:1}));}
  // Ankunft: helles Licht im Süden (zurück in die Stadt)
  {const x=X+PZD.S3.x,z=Z+PZD.S3.z,y=Y+pzRawH(PZD.S3.x,PZD.S3.z,s);const LM=new THREE.MeshBasicMaterial({color:0xfff8e0,transparent:true,opacity:.9,side:THREE.DoubleSide,fog:false});const pl=new THREE.Mesh(new THREE.PlaneGeometry(3,4.2),LM);pl.position.set(x,y+2.1,z+1.2);grp.add(pl);
    for(const sd of[-1,1]){const c=new THREE.Mesh(pzColGeo(new THREE.BoxGeometry(1,5.2,1.2),[.62,.6,.56]),cvMat());c.position.set(x+sd*2,y+2.6,z+1.2);grp.add(c);colAdd(x+sd*2,z+1.2,.7);}const lin=new THREE.Mesh(pzColGeo(new THREE.BoxGeometry(5,1,1.3),[.62,.6,.56]),cvMat());lin.position.set(x,y+5.4,z+1.2);grp.add(lin);
    DGX.exit={x,z:z+1.2};PZ.arrive={x,z:z-2.5,y};}
  // Das Dorf Lamellenheim: 5 Pilzhäuser eng um einen Platz
  const V={x:X+PZD.V.x,z:Z+PZD.V.z},vy=Y+pzRawH(PZD.V.x,PZD.V.z,s);PZ.houses=[];const capC=[['#b0281c','#f4ecd8'],['#7a4a22','#f0dcb8'],['#c86a18','#fff0cc'],['#6a2a7a','#f0e0ff'],['#a8301e','#fff8e8']];
  for(let k=0;k<5;k++){const a=k/5*6.283+.3,hx=V.x+Math.cos(a)*10.5,hz=V.z+Math.sin(a)*10.5,body=new THREE.Mesh(new THREE.CylinderGeometry(3,3.3,3.6,10),M.stem);body.position.set(hx,vy+1.8,hz);grp.add(body);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(4.6,16,8,0,6.283,0,Math.PI/2),new THREE.MeshLambertMaterial({map:pzCapTex(capC[k][0],capC[k][1])}));cap.scale.y=.62;cap.position.set(hx,vy+3.4,hz);grp.add(cap);
    const dx=-Math.cos(a),dz=-Math.sin(a),door=new THREE.Mesh(new THREE.BoxGeometry(1.2,2,.2),M.wood);door.position.set(hx+dx*3.1,vy+1,hz+dz*3.1);door.rotation.y=Math.atan2(dx,dz);grp.add(door);
    for(const sd of[-1,1]){const wa=a+Math.PI+sd*.75,w=new THREE.Mesh(new THREE.BoxGeometry(.8,.7,.15),M.win);w.position.set(hx+Math.cos(wa)*3.12,vy+2.2,hz+Math.sin(wa)*3.12);w.rotation.y=Math.atan2(Math.cos(wa),Math.sin(wa));grp.add(w);}
    colAdd(hx,hz,3.4);PZ.houses.push({x:hx,z:hz,door:{x:hx+dx*3.9,z:hz+dz*3.9}});}
  // Lagerfeuer, Bänke, Marktstand
  {const fire=new THREE.Mesh(new THREE.BoxGeometry(.7,.5,.7),M.fire);fire.position.set(V.x,vy+.25,V.z);grp.add(fire);for(let k=0;k<8;k++){const a=k/8*6.283,st=new THREE.Mesh(pzColGeo(new THREE.DodecahedronGeometry(.28,0),[.5,.5,.5]),cvMat());st.position.set(V.x+Math.cos(a)*.75,vy+.15,V.z+Math.sin(a)*.75);grp.add(st);}colAdd(V.x,V.z,.8);
    for(const a of[.9,2.2,3.9,5.3]){const b=new THREE.Mesh(new THREE.BoxGeometry(2.2,.35,.5),M.wood);b.position.set(V.x+Math.cos(a)*3.2,vy+.4,V.z+Math.sin(a)*3.2);b.rotation.y=-a+Math.PI/2;grp.add(b);}
    const sa=.3+Math.PI/5,sx=V.x+Math.cos(sa)*6.2,sz=V.z+Math.sin(sa)*6.2,tb=new THREE.Mesh(new THREE.BoxGeometry(2.6,.9,1.1),M.wood);tb.position.set(sx,vy+.45,sz);tb.rotation.y=-sa;grp.add(tb);colAdd(sx,sz,1.1);PZ.stall={x:sx+Math.cos(sa)*-1.3,z:sz+Math.sin(sa)*-1.3};PZ.fire={x:V.x,z:V.z,y:vy};}
  // Höhleneingang oben am Berg
  {const E=PZD.E,ex=X+E.x,ez=Z+E.z,ey=Y+PZD.Eh,ox2=Math.cos(E.a),oz2=Math.sin(E.a);for(let k=0;k<14;k++){const t=k/13,a=Math.PI*t,rr=3.2,rx=ex-ox2*1.5+(-oz2)*Math.cos(a)*rr,rz=ez-oz2*1.5+ox2*Math.cos(a)*rr,ry=ey+Math.sin(a)*rr*1.25;const rk=new THREE.Mesh(pzColGeo(new THREE.DodecahedronGeometry(1+R()*.5,0),[.52,.5,.5]),cvMat());rk.position.set(rx,ry,rz);rk.rotation.set(R()*3,R()*3,R()*3);grp.add(rk);}
    const hole=new THREE.Mesh(new THREE.CircleGeometry(2.6,16),M.dark);hole.position.set(ex-ox2*1.6,ey+1.9,ez-oz2*1.6);hole.lookAt(ex+ox2*5,ey+1.9,ez+oz2*5);hole.scale.y=1.3;grp.add(hole);
    for(const sd of[-1,1])colAdd(ex-ox2*1.5+(-oz2)*sd*3.2,ez-oz2*1.5+ox2*sd*3.2,1.1);PZ.cave={x:ex-ox2*.6,z:ez-oz2*.6,y:ey,out:{x:ex+ox2*3.5,z:ez+oz2*3.5,yaw:Math.atan2(-ox2,-oz2)+Math.PI}};}
  pzHall(K,R);pzFolkSpawn(R);}
// ---------- Der Tempel im Berg ----------
function pzHall(K,R){const X=K.X,Z=K.Z,HY=DG_Y+PZD.HY,HR=PZD.HR,grp=K.grp,M=pzMats(),RK=cvMat(),g=new THREE.Group();grp.add(g);
  const fl=new THREE.Mesh(pzColGeo(new THREE.CircleGeometry(HR+.5,48).rotateX(-Math.PI/2),[.42,.42,.52]),RK);fl.position.set(X,HY,Z);g.add(fl);
  const wall=new THREE.Mesh(pzColGeo(pzInvert(new THREE.CylinderGeometry(HR,HR,12,48,3,true,.09,6.283-.18)),[.4,.4,.5]),RK);wall.position.set(X,HY+6,Z);g.add(wall);
  const dome=new THREE.Mesh(pzColGeo(pzInvert(new THREE.SphereGeometry(HR,40,12,0,6.283,0,Math.PI/2)),[.34,.34,.46]),RK);dome.scale.y=.5;dome.position.set(X,HY+12,Z);g.add(dome);
  const tun=new THREE.Mesh(pzColGeo(pzInvert(new THREE.BoxGeometry(5,5,16)),[.38,.38,.46]),RK);tun.position.set(X,HY+2.5,Z+HR+7.4);g.add(tun);
  const lin=new THREE.Mesh(pzColGeo(new THREE.BoxGeometry(6,7,1),[.38,.38,.46]),RK);lin.position.set(X,HY+8.5,Z+HR-.3);g.add(lin);
  // Altar in Stufen
  const SM=twlMats().stone;const step=(w,h,y)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),SM);m.position.set(X,HY+y+h/2,Z);g.add(m);DGX.sol.push(solAdd({x:X,z:Z,hw:w/2,hd:w/2,y0:HY-1,y1:HY+y+h,rot:0,solid:1,walk:1,dg:1}));};
  step(10,.55,0);step(7,.55,.55);const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.1,3.2),SM);top.position.set(X,HY+1.65,Z);g.add(top);DGX.sol.push(solAdd({x:X,z:Z,hw:1.6,hd:1.6,y0:HY-1,y1:HY+2.2,rot:0,solid:1,walk:1,dg:1}));
  for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.BoxGeometry(3.3,.12,.12),M.glowB);r.position.set(X,HY+1.6+k*.18,Z);r.rotation.y=k*.8;g.add(r);}
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.6,12,8),M.glowW);orb.position.set(X,HY+3,Z);g.add(orb);
  // Säulen mit Leuchtpilzen
  PZ.hallCols=[];for(let k=0;k<8;k++){const a=k/8*6.283+.39,px=X+Math.cos(a)*21,pz=Z+Math.sin(a)*21,c=new THREE.Mesh(pzColGeo(new THREE.CylinderGeometry(1.3,1.6,12,8),[.45,.45,.55]),RK);c.position.set(px,HY+6,pz);g.add(c);PZ.hallCols.push({x:px,z:pz,r:1.6});
    for(let m=0;m<4;m++){const cp=new THREE.Mesh(new THREE.SphereGeometry(.5+R()*.4,8,4,0,6.283,0,1.6),M.glowB);cp.position.set(px+Math.cos(a+m)*1.5,HY+1+m*2.4,pz+Math.sin(a+m)*1.5);g.add(cp);}}
  for(let k=0;k<40;k++){const a=R()*6.283,r=HR-1.2,cp=new THREE.Mesh(new THREE.SphereGeometry(.3+R()*.5,8,4,0,6.283,0,1.6),R()<.7?M.glowB:M.glowW);cp.position.set(X+Math.cos(a)*r,HY+.1,Z+Math.sin(a)*r);g.add(cp);}
  const hl=new THREE.PointLight(0x5ad8ff,1.2,40,1.3);hl.position.set(X,HY+6,Z);g.add(hl);const ha=new THREE.AmbientLight(0x5a5aa0,0);g.add(ha);
  Object.assign(PZ,{hall:{x:X,z:Z,y:HY,orb,light:hl,amb:ha,entry:{x:X,z:Z+HR+12},g}});
  // Kultisten im Kreis um den Altar
  PZ.cultists=[];for(let k=0;k<8;k++){const a=k/8*6.283,x=X+Math.cos(a)*8,z=Z+Math.sin(a)*8,e=spawnEnt('pzcult',x,z,{home:{x,z},cmd:1,pz:1,always:true,ring:a});e.y=HY;e.special=pzCultAI;e.frame=0;DGX.ents.push(e);PZ.cultists.push(e);}
  // Big Lunar schläft im Altar
  const b=spawnEnt('biglunar',X,Z,{home:{x:X,z:Z},cmd:1,pz:1,noLeash:true,always:true});b.y=HY;b.hidden=true;b.dormant=true;b.special=pzBossAI;b.onHurt=pzBossHurt;b.twBoss=1;DGX.ents.push(b);
  const shield=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),new THREE.MeshBasicMaterial({color:0x5ae0ff,transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending}));shield.visible=false;g.add(shield);
  const tethers=[];for(let k=0;k<8;k++){const t=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1,5),M.glowB);t.visible=false;g.add(t);tethers.push(t);}
  Object.assign(PZ,{boss:b,shield,tethers});
  // Platzhalter für den Turm-Takt (Siegel gibt es hier nicht)
  const seal=new THREE.Mesh(new THREE.PlaneGeometry(.1,.1),M.dark);seal.visible=false;g.add(seal);DGX.tw={seal,sS:{off:true},up:{x:-1e7,z:-1e7},open:false,boss:b,lvl:3,t:0};}
// ---------- Pilzmenschen ----------
const PZ_NAMES=['Pfifferling','Stockschwamm','Hallimasch','Krempling','Täubling','Schirmling'],PZ_KIDS=['Sporli','Lamelli','Hütchen','Knöpfchen'];
const PZ_LINES=['Schönes Wetter heute! Die Schnecke strahlt.','Hast du schon unseren See gesehen? Da quaken die Frösche … also, die Pilzfrösche.','Nachts bleiben wir drinnen. Die Zombies, weißt du …',
  'Ich liebe den Geruch von feuchtem Waldboden!','Auf dem Berg wohnen die Blauen. Die sind komisch. Die singen nachts.','Wir sind alle eine große Familie. Unter der Erde hängen wir alle zusammen!','Hihi, du hast ja gar keinen Hut!'];
const PZ_KIDL=['Fang mich doch!','Wir spielen Sporenfangen!','Ich bin der schnellste Pilz im Dorf!','Hihi!'];
SHOPS['Händler Morchel']={title:'Morchels Pilzstand',greet:'Willkommen, Großer! Frisches aus dem Wald, gekocht und gebraut.',buy:[['hpot',40],['hpot2',120],['bread',8],['bluecap',18],['glowslime',14]].filter(q=>ITEMS[q[0]]),sell:[['mushroom',5],['bluecap',9],['glowslime',6],['bones',3],['meat',4]].filter(q=>ITEMS[q[0]])};
DIALOGS['Händler Morchel']={start:()=>'hello',nodes:{hello:()=>({text:'Willkommen in Lamellenheim! Ich bin Morchel. Brauchst du was? Tränke, Brot, Pilze, alles da.',opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop('Händler Morchel');return null;}},{label:'Wo bin ich hier?',go:'land'},{label:'Tschüss!',go:null}]}),
  land:()=>({text:'In den Pilzlanden, im dritten Stock vom großen Turm! Draußen glaubt uns das keiner. Die Schnecke da oben ist unsere Sonne. Wenn sie weg ist, ist Nacht.',opts:[{label:'Zurück.',go:'hello'}]})}};
DIALOGS['Ältester Bovist']={start:()=>'hello',nodes:{hello:()=>({text:'Ah, ein Besucher von unten. Ich bin Bovist, der Älteste. Was führt dich zu uns?',opts:[{label:'Was ist mit dem Berg?',go:'berg'},{label:'Woher kommen die Zombies?',go:'zomb'},{label:'Nichts weiter.',go:null}]}),
  berg:()=>({text:'Oben in der Höhle leben die Lunar-Pilze. Sie tragen Roben und singen zu ihrem Altar. Sie wollen Big Lunar erwecken, den Urpilz. Wenn der aufwacht … dann gnade uns die Schnecke.',opts:[{label:'Ich sehe mir das an.',go:'mut'},{label:'Zurück.',go:'hello'}]}),
  mut:()=>({text:'Mutig. Oder dumm. Pass auf: Solange seine Diener singen, schützt ihn ihr Licht. Und wenn er die Fäuste hebt … spring!',opts:[{label:'Danke.',go:null}]}),
  zomb:()=>({text:'Das sind wir, nur verdorben. Sporen vom Berg. Nachts kriechen sie aus der Erde, am Morgen zerfallen sie wieder. Bleib im Licht, wenn du kannst.',opts:[{label:'Zurück.',go:'hello'}]})}};
function pzPortrait(k){const s=SPR[k];if(!s)return null;const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#1e2a1a';x.fillRect(0,0,22,22);x.drawImage(s.c,4,0,26,30,0,0,22,25);return c;}
function pzFolkSpawn(R){const V={x:PZ.X+PZD.V.x,z:PZ.Z+PZD.V.z};
  const add=(name,kid,k,o)=>{const t='pf'+(k%4),a=R()*6.283,x=V.x+Math.cos(a)*5,z=V.z+Math.sin(a)*5,e=spawnEnt(t,x,z,Object.assign({home:{x,z},cmd:1,pz:1,name,role:kid?'Pilzkind':'Pilzmensch · Lamellenheim',scale:kid?.62:1,kid,house:PZ.houses[k%5],always:true},o||{}));e.y=pzT(x,z)||DG_Y;e.special=pzFolkAI;e.portrait=pzPortrait(t+'_0');DGX.ents.push(e);PZ.folk.push(e);return e;};
  add('Händler Morchel',0,0,{trader:1,post:PZ.stall});add('Ältester Bovist',0,1,{elder:1,post:{x:V.x+2.8,z:V.z+.8}});for(let k=2;k<8;k++)add(PZ_NAMES[k-2],0,k);PZ_KIDS.forEach((n,i)=>add(n,1,i+1));}
function pzFolkAI(e,dt){const V={x:PZ.X+PZD.V.x,z:PZ.Z+PZD.V.z},H=e.house;
  if(PZ.night||PZ.dusk){if(e.hidden)return true;const d=Math.hypot(H.door.x-e.x,H.door.z-e.z);if(d<1){e.hidden=true;return true;}entMove(e,H.door.x,H.door.z,e.d.spd*1.6,dt);return true;}
  if(e.hidden){e.hidden=false;e.x=H.door.x;e.z=H.door.z;e.y=pzT(e.x,e.z)||e.y;}
  if(e.post){if(Math.hypot(e.post.x-e.x,e.post.z-e.z)>.6){entMove(e,e.post.x,e.post.z,e.d.spd,dt);}else e.frame=Math.sin(time*.7+e.bob)>.92?'a':0;return true;}
  e.tt=(e.tt||0)-dt;if(e.tt<=0){e.tt=(e.kid?2:5)+Math.random()*(e.kid?3:9);const r=Math.random();let tx,tz;
    if(e.kid){const o=PZ.folk.filter(f=>f.kid&&f!==e)[(Math.random()*3)|0];tx=(o?o.x:V.x)+(Math.random()-.5)*6;tz=(o?o.z:V.z)+(Math.random()-.5)*6;}
    else if(r<.25){const a=Math.random()*6.283;tx=V.x+Math.cos(a)*3.2;tz=V.z+Math.sin(a)*3.2;e.sit=1;}else if(r<.4){const L={x:PZ.X+PZD.L.x,z:PZ.Z+PZD.L.z},a=Math.atan2(V.z-L.z,V.x-L.x)+(Math.random()-.5);tx=L.x+Math.cos(a)*(PZD.L.r+4);tz=L.z+Math.sin(a)*(PZD.L.r+4);e.sit=0;}
    else{const a=Math.random()*6.283,q=8+Math.random()*16;tx=V.x+Math.cos(a)*q;tz=V.z+Math.sin(a)*q;e.sit=0;}e.tx=tx;e.tz=tz;}
  const d=Math.hypot(e.tx-e.x,e.tz-e.z);if(d>.5)entMove(e,e.tx,e.tz,e.d.spd*(e.kid?1.9:1),dt);else e.frame=e.kid?(Math.sin(time*9+e.bob)>0?'h':'a'):(Math.sin(time*.9+e.bob)>.95?'a':0);
  if(e.kid&&d>.5&&Math.sin(time*7+e.bob)>.6)e.frame='h';
  e.chat=(e.chat||10+Math.random()*20)-dt;if(e.chat<=0&&Math.hypot(P.x-e.x,P.z-e.z)<9){e.chat=20+Math.random()*30;say(e,(e.kid?PZ_KIDL:PZ_LINES)[(Math.random()*(e.kid?PZ_KIDL:PZ_LINES).length)|0],3);}
  return true;}
function pzLooked(){let best=null,bd=3.8;for(const e of PZ.folk){if(e.dead||e.hidden)continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd&&lookingAt(e.x,e.y+1.2*(e.kid?.6:1),e.z,4.6,.8)){bd=d;best=e;}}return best;}
// ---------- Pilzzombies ----------
function pzZombieAI(e,dt){if(e.rise!=null&&e.rise<1){e.rise=Math.min(1,e.rise+dt/1.8);e.frame=0;if(Math.random()<dt*8)spawnParticle(e.x+(Math.random()-.5),e.y+.2,e.z+(Math.random()-.5),0,1,0,0x5a4a30,.6,.25);if(e.rise>=1)e.rise=null;return true;}return false;}
function pzZombieTick(dt){if(P.y<DG_Y-30)return;PZ.zs=PZ.zs.filter(e=>!e.dead&&DEM.includes(e));
  if(PZ.night){PZ.zT=(PZ.zT||0)-dt;if(PZ.zT<=0&&PZ.zs.length<14){PZ.zT=4+Math.random()*4;for(let t=0;t<12;t++){const a=Math.random()*6.283,d=22+Math.random()*30,x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d,lx=x-PZ.X,lz=z-PZ.Z;
        if(Math.hypot(lx,lz)>175)continue;const h=pzT(x,z);if(h==null||h<DG_Y+.1)continue;if(PZ.houses.some(H=>Math.hypot(H.x-x,H.z-z)<4.5))continue;
        const e=spawnEnt('pzzombie',x,z,{home:{x,z},cmd:1,pz:1,rise:0});e.y=h;e.special=pzZombieAI;DGX.ents.push(e);PZ.zs.push(e);break;}}}
  else for(const e of PZ.zs)if(!e.sink){e.sink=true;e.sinkT=0;setTimeout(()=>removeEnt(e),2200);}}
// ---------- Kultisten ----------
function pzCultAI(e,dt){const H=PZ.hall;e.frame=0;if(PZ.cult===0){e.frame=Math.sin(time*1.3+e.ring*3)>.97?'p':0;return true;}
  if(PZ.cult===1){e.frame='p';if(Math.random()<dt*3){const t=Math.random();spawnParticle(e.x+(H.x-e.x)*t,e.y+2+t*1.5,e.z+(H.z-e.z)*t,0,.8,0,0x7af0ff,.8,.18);}return true;}
  if(PZ.cult===2){if(!e.post){const a=e.ring+Math.PI/8;e.post={x:H.x+Math.cos(a)*24,z:H.z+Math.sin(a)*24};}const pd=Math.hypot(P.x-e.x,P.z-e.z);
    if(pd<4.5&&P.y<DG_Y-30){const dx=e.x-P.x,dz=e.z-P.z,l=pd||1;let tx=e.x+dx/l*4-dz/l*3,tz=e.z+dz/l*4+dx/l*3;const r=Math.hypot(tx-H.x,tz-H.z);if(r>26){tx=H.x+(tx-H.x)*26/r;tz=H.z+(tz-H.z)*26/r;}entMove(e,tx,tz,e.d.spd,dt);return true;}
    if(Math.hypot(e.post.x-e.x,e.post.z-e.z)>1){entMove(e,e.post.x,e.post.z,e.d.spd*1.3,dt);return true;}
    e.cd3=(e.cd3==null?3+Math.random()*4:e.cd3)-dt;if(e.cd3<=0&&P.y<DG_Y-30){e.cd3=5+Math.random()*4;e.frame='c';e.castT=.5;}if(e.castT>0){e.castT-=dt;e.frame='c';if(e.castT<=0)shoot(e,P.x,P.y+1,P.z,{spd:13,dmg:8,orb:SPR.orb_frost?'orb_frost':'orb_poison',col:0x7af0ff,size:.7,life:4,sy:.6});return true;}
    e.frame='p';return true;}return true;}
// ---------- Big Lunar ----------
function pzBossHurt(e,n,by){const sh=PZ.cult===2&&e.ph===1&&PZ.cultists.some(c=>!c.dead);let k=1;if(sh)k=.35;if(e.stuck>0)k*=1.5;if(k===1)return;e.hp-=n*k;e.hurt=.2;if(by==='player'||by==='kreak')e.aggroT=12;if(sh&&Math.random()<.3)for(let i=0;i<6;i++)spawnParticle(e.x+(Math.random()-.5)*4,e.y+3+Math.random()*4,e.z+(Math.random()-.5)*4,0,.5,0,0x7af0ff,.4,.25);if(e.hp<=0)killEnt(e,by);return false;}
function pzFxRing(x,z,y,r0,col,op){const m=new THREE.Mesh(new THREE.RingGeometry(.9,1,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op||.8,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,y+.08,z);m.scale.setScalar(Math.max(.1,r0));PZ.hall.g.add(m);return m;}
function pzFxDrop(f){if(f.m){PZ.hall.g.remove(f.m);f.m.geometry.dispose();}if(f.ms)for(const m of f.ms){PZ.hall.g.remove(m);m.geometry.dispose();}}
const pzOnGround=()=>P.y-(groundAt(P.x,P.z,P.y+.5))<.35;
function pzHitP(dmg,kx,kz,up){if(state!=='playing'&&state!=='dialog')return;takeDamage(dmg);P.vx+=kx||0;P.vz+=kz||0;if(up)P.vy=Math.max(P.vy,up);}
function pzFxTick(dt){const H=PZ.hall;if(!H)return;for(let i=PZ.fx.length-1;i>=0;i--){const f=PZ.fx[i];f.t+=dt;
  if(f.k==='wave'){const r=f.t*13;f.m.scale.setScalar(r);f.m.material.opacity=.85*(1-r/26);const d=Math.hypot(P.x-f.x,P.z-f.z);if(!f.hit&&Math.abs(d-r)<1&&pzOnGround()&&P.y<DG_Y-30){f.hit=1;pzHitP(24,(P.x-f.x)/(d||1)*8,(P.z-f.z)/(d||1)*8,4);if(!PZ.waveTip){PZ.waveTip=1;toast('Spring über die Schockwelle!');}}if(r>26){pzFxDrop(f);PZ.fx.splice(i,1);}continue;}
  if(f.k==='spike'){if(f.t<.9){for(const m of f.ms)m.material.opacity=.4+.4*Math.sin(f.t*20);}else if(!f.up){f.up=1;for(let j=0;j<f.pts.length;j++){const[x,z]=f.pts[j],c=new THREE.Mesh(new THREE.ConeGeometry(.55,2.6,6),pzMats().glowB);c.position.set(x,H.y+1.3,z);H.g.add(c);f.ms.push(c);}
      try{Snd.boom(.25);}catch(_){}const L=f.pts;for(const[x,z]of L)if(Math.hypot(P.x-x,P.z-z)<1.4&&P.y<H.y+2.5){pzHitP(30,0,0,7);break;}}if(f.t>2.4){pzFxDrop(f);PZ.fx.splice(i,1);}continue;}
  if(f.k==='cloud'){if(Math.random()<dt*30)spawnParticle(f.x+(Math.random()-.5)*6,H.y+.3+Math.random()*2.5,f.z+(Math.random()-.5)*6,(Math.random()-.5)*.4,.2,(Math.random()-.5)*.4,Math.random()<.5?0x7af0ff:0x9aff9a,1.2,.4);
    if(Math.hypot(P.x-f.x,P.z-f.z)<3.2&&P.y<H.y+3){f.tick=(f.tick||0)-dt;if(f.tick<=0){f.tick=.5;pzHitP(4);P.slowT=Math.max(P.slowT||0,.6);}}if(f.t>7){PZ.fx.splice(i,1);}continue;}
  if(f.k==='beam'){if(f.t<1.2){f.m.material.opacity=.3+.5*Math.abs(Math.sin(f.t*12));}else if(!f.fired){f.fired=1;const b=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,30,16,1,true),new THREE.MeshBasicMaterial({color:0xd8f8ff,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));b.position.set(f.x,H.y+15,f.z);H.g.add(b);f.ms=[b];
      try{Snd.boom(.2);}catch(_){}if(Math.hypot(P.x-f.x,P.z-f.z)<2.5)pzHitP(22);for(let k=0;k<20;k++)spawnParticle(f.x,H.y+.3,f.z,(Math.random()-.5)*6,Math.random()*4,(Math.random()-.5)*6,0xd8f8ff,.6,.3);}
    if(f.t>1.8){pzFxDrop(f);PZ.fx.splice(i,1);}continue;}
  if(f.k==='mark'){f.m.material.opacity=.4+.4*Math.abs(Math.sin(f.t*10));if(f.done){pzFxDrop(f);PZ.fx.splice(i,1);}}}}
function pzBossAI(e,dt){const H=PZ.hall,d=e.d;e.noPath=1;if(e.rise!=null&&e.rise<1){e.rise=Math.min(1,e.rise+dt/3.2);e.frame='r';if(Math.random()<dt*30)spawnParticle(e.x+(Math.random()-.5)*6,H.y+.3,e.z+(Math.random()-.5)*6,(Math.random()-.5)*3,Math.random()*4,(Math.random()-.5)*3,0x7af0ff,.8,.35);
    if(e.rise>=1){e.rise=null;e.st='roar';e.mt=1.6;try{Snd.demonRoar(.35,1.6);Snd.boom(.5);}catch(_){}e.ph=1;}return true;}
  const C=e.cd||(e.cd={atk:1,slam:5,spike:7,spore:10,beam:3,leap:8,sum:6});for(const k in C)C[k]-=dt;
  // Phasen
  if(e.ph===1&&e.hp<e.max*.6){e.ph=2;e.st='roar';e.mt=2.4;let healed=0;for(const c of PZ.cultists)if(!c.dead){healed++;for(let k=0;k<25;k++)spawnParticle(c.x,c.y+1,c.z,(e.x-c.x)*.4,1+(Math.random()),(e.z-c.z)*.4,0x7af0ff,1.2,.3);c.hp=0;killEnt(c,'demon');}
    if(healed)e.hp=Math.min(e.max,e.hp+e.max*.03*healed);toast(healed?'Big Lunar verschlingt seine Diener und wird stärker! Der Mond ruft …':'Big Lunar heult zum Mond. Licht fällt von der Decke!');try{Snd.demonRoar(.3,1.8);}catch(_){}PZ.hallDark=1;return true;}
  if(e.ph===2&&e.hp<e.max*.3){e.ph=3;e.st='roar';e.mt=2;toast('Big Lunar zerfällt in Raserei! Sporlinge platzen aus seinem Körper.');try{Snd.demonRoar(.4,1.6);}catch(_){}return true;}
  const K=e.ph===3?1.35:e.ph===2?1.15:1;
  if(e.stuck>0)e.stuck-=dt;
  if(e.st==='roar'){e.mt-=dt;e.frame='r';if(e.mt<=0)e.st=null;return true;}
  if(e.st==='stuck'){e.mt-=dt;e.frame='a';if(Math.random()<dt*10)spawnParticle(e.x+(Math.random()-.5)*8,e.y+.5,e.z+(Math.random()-.5)*8,0,1,0,0xffffff,.5,.2);if(e.mt<=0)e.st=null;return true;}
  if(e.st==='leap'){const J=e.J;J.t+=dt;const q=Math.min(1,J.t/J.T);e.x=J.x0+(J.x1-J.x0)*q;e.z=J.z0+(J.z1-J.z0)*q;e.yo=Math.sin(q*Math.PI)*9;e.frame='w';
    if(q>=1){e.yo=0;e.st='stuck';e.mt=1.2;e.stuck=1.2;J.mark.done=1;try{Snd.boom(.6);}catch(_){}const dd=Math.hypot(P.x-e.x,P.z-e.z);if(dd<5.5&&P.y<H.y+3)pzHitP(36,(P.x-e.x)/(dd||1)*12,(P.z-e.z)/(dd||1)*12,6);PZ.fx.push({k:'wave',x:e.x,z:e.z,t:0,m:pzFxRing(e.x,e.z,H.y,.5,0x9af0ff)});}return true;}
  if(e.st==='wind'){e.mt-=dt*K;e.frame=e.atk==='spore'?'c':'w';if(e.mt>0)return true;e.st=null;const t=e.tgt,[tx,,tz]=t?tPos(t):[P.x,0,P.z];
    if(e.atk==='punch'){e.frame='a';const dd=Math.hypot(tx-e.x,tz-e.z);if(dd<d.reach+1.4)meleeHit(e,t||'player',d.dmg);try{Snd.boom(.2);}catch(_){}C.atk=1.4/K;}
    else if(e.atk==='slam'){e.st='stuck';e.mt=1.8;e.stuck=1.8;try{Snd.boom(.6);}catch(_){}PZ.fx.push({k:'wave',x:e.x,z:e.z,t:0,m:pzFxRing(e.x,e.z,H.y,.5,0x9af0ff)});for(let k=0;k<50;k++)spawnParticle(e.x+(Math.random()-.5)*8,H.y+.3,e.z+(Math.random()-.5)*8,(Math.random()-.5)*8,Math.random()*5,(Math.random()-.5)*8,0x8a8aa8,.8,.35);
      if(!PZ.stuckTip){PZ.stuckTip=1;setTimeout(()=>toast('Seine Fäuste stecken fest! Jetzt zuschlagen!'),900);}}
    else if(e.atk==='spore'){for(let k=0;k<(e.ph===3?4:3);k++){const a=Math.random()*6.283,r=k?3+Math.random()*6:0;PZ.fx.push({k:'cloud',x:P.x+Math.cos(a)*r,z:P.z+Math.sin(a)*r,t:0});}try{Snd.whoosh(250,.15);}catch(_){}}
    return true;}
  const t=e.tgt;if(!t){e.frame=0;return true;}
  const[tx,,tz]=tPos(t),dist=Math.hypot(tx-e.x,tz-e.z);
  // Mondstrahlen ab Phase 2
  if(e.ph>=2&&C.beam<=0){C.beam=(e.ph===3?2.4:3.2);const pts=[[P.x,P.z]];for(let k=0;k<(e.ph===3?3:2);k++){const a=Math.random()*6.283,r=Math.random()*20;pts.push([H.x+Math.cos(a)*r,H.z+Math.sin(a)*r]);}for(const[x,z]of pts)PZ.fx.push({k:'beam',x,z,t:0,m:pzFxRing(x,z,H.y,2.4,0xd8f8ff,.6)});}
  if(e.ph===3&&C.sum<=0){C.sum=14;for(let k=0;k<3;k++){const a=Math.random()*6.283,s=spawnEnt('pzspore',e.x+Math.cos(a)*4,e.z+Math.sin(a)*4,{home:{x:e.x,z:e.z},cmd:1,pz:1,aggroT:20});s.y=H.y;DGX.ents.push(s);}}
  if(e.ph===3&&C.leap<=0&&dist>9){C.leap=9;const mk={k:'mark',t:0,m:pzFxRing(tx,tz,H.y,5,0xff8a8a,.7)};PZ.fx.push(mk);e.st='leap';e.J={x0:e.x,z0:e.z,x1:tx,z1:tz,t:0,T:1.35,mark:mk};try{Snd.demonRoar(.4,1.2);}catch(_){}return true;}
  if(dist<d.reach+.8&&C.atk<=0){e.st='wind';e.atk='punch';e.mt=.6;return true;}
  if(C.slam<=0&&dist<14){C.slam=(e.ph===3?6:8)+Math.random()*3;e.st='wind';e.atk='slam';e.mt=1.15;try{Snd.demonRoar(.45,.9);}catch(_){}return true;}
  if(C.spike<=0&&dist<28){C.spike=(e.ph>=2?6:8)+Math.random()*3;const n=14,pts=[],ms=[],dx=(tx-e.x)/(dist||1),dz=(tz-e.z)/(dist||1);for(let k=1;k<=n;k++){const x=e.x+dx*(2+k*1.8),z=e.z+dz*(2+k*1.8);if(Math.hypot(x-H.x,z-H.z)>PZD.HR-1)break;pts.push([x,z]);ms.push(pzFxRing(x,z,H.y,.8,0x7af0ff,.6));}
    PZ.fx.push({k:'spike',t:0,pts,ms});e.frame='c';return true;}
  if(C.spore<=0){C.spore=(e.ph===3?7:10)+Math.random()*3;e.st='wind';e.atk='spore';e.mt=.8;return true;}
  if(dist>d.reach)entMove(e,tx,tz,d.spd*K,dt);else e.frame=0;return true;}
// Beschwörung beim Betreten des Tempels
function pzCultTick(dt){const H=PZ.hall,b=PZ.boss;if(!H||!b)return;const inHall=P.y<DG_Y-30;
  if(PZ.cult===0&&inHall&&Math.hypot(P.x-H.x,P.z-H.z)<PZD.HR-1){PZ.cult=1;PZ.cultT=0;toast('Die Lunar-Pilze heben die Arme … und singen.');showArea('Tempel des Big Lunar');pzChant();}
  if(PZ.cult===1){PZ.cultT+=dt;H.light.intensity=1.2+PZ.cultT*.8;H.orb.scale.setScalar(1+PZ.cultT*.5);if(Math.random()<dt*20)spawnParticle(H.x+(Math.random()-.5)*2,H.y+2.5,H.z+(Math.random()-.5)*2,0,4+Math.random()*3,0,0x9af8ff,1.4,.3);
    if(PZ.cultT>6){PZ.cult=2;H.orb.visible=false;H.light.intensity=1.6;b.hidden=false;b.dormant=false;b.rise=0;b.aggroT=99;try{Snd.boom(.7);}catch(_){}for(let k=0;k<120;k++)spawnParticle(H.x,H.y+2,H.z,(Math.random()-.5)*14,Math.random()*9,(Math.random()-.5)*14,Math.random()<.5?0x7af0ff:0xffffff,1.4,.4);toast('Big Lunar erwacht!');}}
  // Schild und Lichtfäden der Diener
  const sh=PZ.cult===2&&!b.dead&&b.ph===1&&b.rise==null&&PZ.cultists.some(c=>!c.dead);PZ.shield.visible=sh;if(sh){PZ.shield.position.set(b.x,b.y+b.h*.5+(b.yo||0),b.z);PZ.shield.scale.set(5.5,6.5,5.5);PZ.shield.material.opacity=.14+.06*Math.sin(time*4);}
  PZ.cultists.forEach((c,i)=>{const T=PZ.tethers[i],on=sh&&!c.dead;T.visible=on;if(!on)return;const a=new THREE.Vector3(c.x,c.y+1.6,c.z),z=new THREE.Vector3(b.x,b.y+5,b.z),L=a.distanceTo(z);T.position.copy(a).lerp(z,.5);T.scale.set(1,L,1);T.lookAt(z);T.rotateX(Math.PI/2);});
  if(PZ.cult===2&&!PZ.shTip&&sh&&inHall){PZ.shTip=1;setTimeout(()=>toast('Die Diener schützen Big Lunar mit ihrem Licht. Schalte sie aus!'),2500);}
  if(PZ.cult===2&&PZ.cultists.every(c=>c.dead)&&!PZ.allDead&&b.ph===1){PZ.allDead=1;toast('Der Schild zerbricht! Big Lunar ist verwundbar.');try{Snd.boom(.4);}catch(_){}}
  // Halle dunkler in Phase 2
  if(inHall){const dk=PZ.hallDark?1:0;H.amb.intensity=.5-.25*dk;}
  if(b.dead&&!PZ.won){PZ.won=1;PZ.cult=3;setTimeout(()=>{toast('Big Lunar ist besiegt! Auf dem Altar öffnet sich ein Lichtweg nach oben.');},1500);H.orb.visible=true;H.orb.material=pzMats().glowW;H.orb.scale.setScalar(2);for(const c of PZ.cultists)if(!c.dead){c.hp=0;killEnt(c,'player');}}}
function pzChant(){const c=Snd.ctx;if(!c)return;const t=c.currentTime,bus=Snd.envG||Snd.sfx;for(const[f,dl]of[[110,0],[165,.4],[220,.8],[138.6,1.2]]){const o=c.createOscillator(),g=c.createGain(),lf=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;lf.type='lowpass';lf.frequency.value=700;
  g.gain.setValueAtTime(.0001,t+dl);g.gain.linearRampToValueAtTime(.05,t+dl+1.2);g.gain.setValueAtTime(.05,t+5.5);g.gain.exponentialRampToValueAtTime(.0001,t+7);o.connect(lf);lf.connect(g);g.connect(bus);o.start(t+dl);o.stop(t+7.2);}}
// ---------- Takt: Tag und Nacht, Licht, Nebel ----------
function pzTick(dt){if(!PZ.on||!DGX.on)return;const cyc=PZ.DAY+PZ.NIGHT;PZ.t=(PZ.t+dt)%cyc;const t=PZ.t,day=t<PZ.DAY,q=day?t/PZ.DAY:0;
  const dk=day?clamp(Math.sin(Math.PI*q)*2.2,0,1):0;PZ.dk=dk;const wasN=PZ.night;PZ.night=!day;PZ.dusk=day&&q>.94;
  if(wasN!==PZ.night&&state==='playing'&&P.y>DG_Y-30)toast(PZ.night?'Die Schnecke kriecht hinter den Horizont. Es wird Nacht … Hörst du das Scharren?':'Ein Leuchten am Horizont: Die Schnecke ist wieder da. Die Zombies zerfallen.');
  const a=Math.PI*(.05+.9*q);PZ.sunDir.set(Math.cos(a),Math.sin(a)*.95+.05,.3).normalize();PZ.snail.visible=PZ.halo.visible=day&&P.y>DG_Y-30;
  const inHall=P.y<DG_Y-30;PZ.sky.uniforms.day.value=dk;PZ.sky.uniforms.sun.value.copy(PZ.sunDir);
  PZ.sun.position.set(PZ.X+PZ.sunDir.x*200,DG_Y+PZ.sunDir.y*200,PZ.Z+PZ.sunDir.z*200);PZ.sun.intensity=inHall?0:.8*dk;PZ.amb.intensity=inHall?0:.28+.42*dk;PZ.amb.color.setRGB(.55+.3*dk,.6+.25*dk,.85-.05*dk);
  const D=DGX.d;if(inHall){D.fogC=PZ.hallDark?[.02,.02,.06]:[.04,.04,.1];D.far=70;D.near=10;D.hemi=.05;D.bbl=.95;}
  else{D.fogC=[.08+.64*dk,.11+.73*dk,.2+.66*dk];D.far=70+42*dk;D.near=22;D.hemi=.08+.25*dk;D.bbl=.5+.5*dk;}
  if(DGX.light)DGX.light.intensity=inHall?.6:(PZ.night?.9:0);
  // Nachts: Sporen in der Luft
  if(!inHall&&PZ.night&&Math.random()<dt*14)spawnParticle(P.x+(Math.random()-.5)*30,P.y+1+Math.random()*5,P.z+(Math.random()-.5)*30,(Math.random()-.5)*.3,.15,(Math.random()-.5)*.3,0x7af0ff,2.5,.1);
  if(PZ.fire&&!inHall&&Math.random()<dt*10&&Math.hypot(P.x-PZ.fire.x,P.z-PZ.fire.z)<60)spawnParticle(PZ.fire.x+(Math.random()-.5)*.4,PZ.fire.y+.6,PZ.fire.z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.3,(Math.random()-.5)*.3,0xffa030,.6,.2);
  pzZombieTick(dt);pzCultTick(dt);pzFxTick(dt);
  // Höhle betreten oder verlassen
  if(state==='playing'&&!PZ.tp){const C=PZ.cave;if(!inHall&&C&&Math.hypot(P.x-C.x,P.z-C.z)<1.8&&Math.abs(P.y-C.y)<3)pzTeleport(PZ.hall.entry.x,PZ.hall.y,PZ.hall.entry.z-1.5,0);
    else if(inHall&&P.z>PZ.hall.z+PZD.HR+13.5)pzTeleport(C.out.x,(pzT(C.out.x,C.out.z)||C.y)+.1,C.out.z,C.out.yaw);
    // Lichtweg auf dem Altar nach dem Sieg
    if(inHall&&PZ.won&&Math.hypot(P.x-PZ.hall.x,P.z-PZ.hall.z)<1.6&&P.y>PZ.hall.y+1.8&&!PZ.goUp){PZ.goUp=1;const fl=$('wxFlash');if(fl){fl.style.transition='opacity .6s';fl.style.opacity=1;}setTimeout(()=>{if(fl)fl.style.opacity=0;if(TOWER_LEVELS[3])twlEnter(4);else{toast('Über den Pilzlanden ist alles still. Die nächste Ebene ist noch versiegelt.');dgLeave(false);}},700);}}
  // Wasser bremst
  if(!inHall){const h=pzT(P.x,P.z);if(h!=null&&h<PZ.water-.1&&P.y<PZ.water){P.wade=1;if(Math.random()<dt*Math.hypot(P.vx,P.vz)*2)spawnParticle(P.x,PZ.water+.05,P.z,(Math.random()-.5),1,(Math.random()-.5),0xc8e8ff,.4,.15);}else P.wade=0;}}
function pzTeleport(x,y,z,yaw){PZ.tp=1;const fl=$('wxFlash');if(fl){fl.style.transition='opacity .25s';fl.style.background='#000';fl.style.opacity=1;}
  setTimeout(()=>{P.x=x;P.y=y;P.z=z;P.vx=P.vy=P.vz=0;P.yaw=yaw;curArea=null;setTimeout(checkArea,100);if(fl){fl.style.opacity=0;setTimeout(()=>{fl.style.background='#eef4ff';fl.style.transition='';},300);}setTimeout(()=>{PZ.tp=0;},600);},260);}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{pzTick(dt);}catch(e){if(!pzTick.err){pzTick.err=1;console.error('Pilzlande',e);}}};}
// ---------- Boden, Kollision, Gebiet ----------
const pzHere=y=>PZ.on&&DGX.on&&(y==null||y<DG_Y+100);
{const a=groundAt;groundAt=function(x,z,feet){if(pzHere(feet)&&dgIn(x,z)){let g;if(feet!=null&&feet<DG_Y-30)g=DG_Y+PZD.HY;else{g=pzT(x,z);if(g==null)return a(x,z,feet);}const lim=feet==null?1e9:feet+.65;
    for(const b of solNear(x,z)){if(b.off||!b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)>b.hw||Math.abs(lz)>b.hd)continue;const t=solTop(b,lz);if(t<=lim&&t>g)g=t;}return g;}return a(x,z,feet);};}
function pzPush(o,R,y){if(!PZ.on)return;if(y<DG_Y-30){const H=PZ.hall;if(!H)return;const dx=o.x-H.x,dz=o.z-H.z,d=Math.hypot(dx,dz),inT=Math.abs(dx)<2.2&&dz>PZD.HR-2;
    if(inT){o.x=H.x+clamp(dx,-2.2+R,2.2-R);if(dz>PZD.HR+14.6)o.z=H.z+PZD.HR+14.6;}else if(d>PZD.HR-.6-R){const k=(PZD.HR-.6-R)/d;o.x=H.x+dx*k;o.z=H.z+dz*k;}
    for(const c of PZ.hallCols){const ex=o.x-c.x,ez=o.z-c.z,dd=Math.hypot(ex,ez),rr=c.r+R;if(dd<rr&&dd>1e-4){o.x=c.x+ex/dd*rr;o.z=c.z+ez/dd*rr;}}return;}
  const lx=o.x-PZ.X,lz=o.z-PZ.Z,r=Math.hypot(lx,lz);if(r>184){o.x=PZ.X+lx*184/r;o.z=PZ.Z+lz*184/r;}
  const l=PZ.cols.get(Math.floor(o.x/8)*100003+Math.floor(o.z/8));if(l)for(const c of l){const ex=o.x-c.x,ez=o.z-c.z,dd=Math.hypot(ex,ez),rr=c.r+R;if(dd<rr&&dd>1e-4){o.x=c.x+ex/dd*rr;o.z=c.z+ez/dd*rr;}}}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);if(!pzHere(P.y))return;if(P.wade&&state==='playing'){P.x=x0+(P.x-x0)*.65;P.z=z0+(P.z-z0)*.65;}pzPush(P,P.rad||.3,P.y);waterTint.hidden=true;};}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){const r=a(e,tx,tz,sp,dt);if(pzHere(e.y))pzPush(e,(e.d.rad||.35)*.9,e.y);return r;};}
{const a=collideTrees;collideTrees=function(){if(pzHere(P.y))return;return a();};}
{const a=collideTreesObj;collideTreesObj=function(o,R){if(pzHere(o.y))return;return a(o,R);};}
{const a=areaAt;areaAt=function(x,z){if(PZ.on&&DGX.on&&dgIn(x,z)){if(P.y<DG_Y-30)return'tw_lunar';if(Math.hypot(x-PZ.X-PZD.V.x,z-PZ.Z-PZD.V.z)<30)return'tw_pdorf';return'tw_pilz';}return a(x,z);};}
AREAS.tw_pilz='Die Pilzlande';AREAS.tw_pdorf='Lamellenheim';AREAS.tw_lunar='Tempel des Big Lunar';
AREA_MUSIC.tw_pilz=(typeof WLB!=='undefined'&&WLB.wald&&WLB.wald.mus)||AREA_MUSIC.in_tower;AREA_MUSIC.tw_pdorf=AREA_MUSIC.in_guild||AREA_MUSIC.tw_pilz;AREA_MUSIC.tw_lunar=AREA_MUSIC.in_tower;
try{for(const k of['tw_pilz','tw_pdorf','tw_lunar'])WX_NONE.add(k);MAPC.tw_pilz=[70,120,60];MAPC.tw_pdorf=[150,110,70];MAPC.tw_lunar=[40,50,110];}catch(e){}
// Sprechen
{const a=storyUse;storyUse=function(){if(state==='playing'&&PZ.on&&DGX.on){const e=pzLooked();if(e){if(DIALOGS[e.name])openDialog(e);else say(e,(e.kid?PZ_KIDL:PZ_LINES)[(Math.random()*(e.kid?PZ_KIDL:PZ_LINES).length)|0],3);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(PZ.on&&DGX.on){const e=pzLooked();if(e)return'Mit '+e.name.split(' ').pop()+' sprechen';if(PZ.won&&P.y<DG_Y-30&&Math.hypot(P.x-PZ.hall.x,P.z-PZ.hall.z)<3)return'Auf den Altar ins Licht';}return a();};}
{const a=dgFree;dgFree=function(){a();if(PZ.on){PZ.on=false;PZ.folk=[];PZ.zs=[];PZ.fx=[];PZ.hall=null;PZ.boss=null;PZ.cultists=[];PZ.g=null;PZ.cols=new Map();P.wade=0;}};}
// ---------- Ebene 3 eintragen ----------
TOWER_LEVELS[2]={n:'Die Pilzlande',d:'Eine ganze Welt im Turm. Pilzmenschen, Pilzzombies und oben am Berg der Tempel des Big Lunar.',cave:1,W:420,far:170,near:30,hemi:.3,bbl:1,fogC:[.7,.84,.86],
  build(K){Object.assign(PZ,{zs:[],cult:0,won:false,goUp:0,hallDark:0,allDead:0,shTip:0,tp:0});pzBuild(K);},
  enter(){const A=PZ.arrive;if(!A)return;P.x=A.x;P.z=A.z;P.y=(pzT(A.x,A.z)||A.y)+.1;P.vx=P.vy=P.vz=0;P.yaw=0;P.pitch=0;PZ.t=50;try{Snd.chime();}catch(_){}setTimeout(()=>toast('Wärme. Vogelgezwitscher. Ein Himmel … im Turm?'),1200);}};
