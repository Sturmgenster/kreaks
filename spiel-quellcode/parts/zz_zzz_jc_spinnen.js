/* =========================================================
   0.0.124 · Ebene 2 des Großen Turms: Das Spinnennest
   - Höhlenlabyrinth aus warmem, braungrauem Fels in drei Ringen um einen riesigen Hohlraum (Radius ~55 m, 30–35 m hoch).
   - In den Hohlraum führt nur EIN Durchgang. Den muss man im Gewirr erst finden.
   - Je tiefer man kommt, desto mehr Spinnennetze. Netze bremsen, mit der Waffe zerschlägt man sie mit einem Hieb.
   - Spinnen werden mit der Tiefe größer und angriffslustiger: Spinnlinge (harmlos), Höhlenspinnen, Giftspinnen (spucken Gift),
     Weberspinnen (spinnen dich ein), Jagdspinnen (springen dich an und wollen dich fressen).
   - Im Hohlraum: Tarantula (8000 LP), dreimal so groß wie du. Sie klettert im großen Netz und springt zwischen Felsvorsprüngen,
     spuckt Netze, Gift und Säure, legt Eier, aus denen Brutspinnen schlüpfen, und hält Abstand.
   - Verstecken: schmale Felsspalten am Rand des Hohlraums. Die niedrigen Vorsprünge erreicht man über Felsstufen.
   ========================================================= */
// ---------- Bilder ----------
function spDraw(o,f){const W=o.W,H=o.H,p=new Px(W,H),cx=W/2|0,B=pal(o.body),A=pal(o.abd),Lg=pal(o.leg||o.body),hairC=o.hair?hex(o.hair):null;
  const ell=(x0,y0,rx,ry,pl,b=.6)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;let v=b-dx*.25-dy*.3;if(hairC&&hash2(x,y,o.seed||3)<.08){p.set(x,y,hairC);continue;}p.set(x,y,pl[shadeIdx(v+(hash2(x>>1,y>>1,9)-.5)*.12,pl.length,x,y)]);}};
  const seg=(x0,y0,x1,y1,w,pl,b)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q;for(let k=-w/2;k<=w/2;k+=.5)p.set(X+nx*k,Y+ny*k,pl[shadeIdx((b||.55)-k/w*.5,pl.length,Math.round(X),Math.round(Y))]);
      if(hairC&&w>=2&&hash2(Math.round(X),Math.round(Y),o.seed||5)<.18)p.set(X+nx*(w/2+1),Y+ny*(w/2+1),hairC);}};
  const ab={x:cx,y:H*.34,rx:W*.17,ry:H*.27},ce={x:cx,y:H*.58,rx:W*.115,ry:H*.15},ground=H-2,lw=o.legW||2,ll=o.long||1;
  const raise=f==='a',spit=f==='c',jump=f==='j';
  // Beine hinter dem Körper (hintere zwei Paare), dann Hinterleib, dann vordere Beine und Kopfbrust
  const leg=(side,i)=>{const hipX=cx+side*ce.rx*.8,hipY=ce.y+(i-1.5)*ce.ry*.38,ph=((f===1&&i%2===0)||(f===2&&i%2===1))?1:0,lift=ph*H*.05;
    let kx=cx+side*W*[.15,.28,.38,.45][i]*ll,ky=H*[.4,.2,.13,.24][i]-lift,fx=cx+side*W*[.1,.25,.38,.48][i]*ll,fy=ground-lift-(i===0?H*.04:0);
    if(jump){ky=H*.3;fx=cx+side*W*(.2+.04*i);fy=H*.72;}
    if(raise&&i===0){kx=cx+side*W*.16;ky=H*.02;fx=cx+side*W*.06;fy=H*.24;}
    fx=clamp(fx,1,W-2);kx=clamp(kx,1,W-2);seg(hipX,hipY,kx,ky,lw+1,Lg,.65);seg(kx,ky,fx,fy,lw,Lg,.5);
    if(o.band){const bx=kx+(fx-kx)*.35,by=ky+(fy-ky)*.35;seg(bx,by,bx+(fx-kx)*.08,by+(fy-ky)*.08,lw+.5,pal([o.band,o.band]),.5);}};
  for(const i of[3,2])for(const s of[-1,1])leg(s,i);
  ell(ab.x,ab.y-(spit?H*.03:0),ab.rx,ab.ry,A,.62);
  if(o.mark){const M=hex(o.mark);for(let k=0;k<4;k++){const y=Math.round(ab.y-ab.ry*.55+k*ab.ry*.32),w=Math.round(ab.rx*(.5-k*.09));for(let x=-w;x<=w;x++)if(Math.abs(x)>w-2||k===0)p.set(cx+x,y,M);}p.set(cx,Math.round(ab.y-ab.ry*.7),M);}
  for(const i of[1,0])for(const s of[-1,1])leg(s,i);
  ell(ce.x,ce.y,ce.rx,ce.ry,B,.66);
  // Augen (8), Kieferklauen
  const E=hex(o.eye),E2=hex('#ffffff');const ey=Math.round(ce.y-ce.ry*.35);for(const[dx,dy,s]of[[-2,0,1],[1,0,1],[-5,-1,0],[4,-1,0],[-4,2,0],[3,2,0],[-1,-3,0],[0,-3,0]]){const sc=Math.max(1,W/60);p.set(cx+dx*sc,ey+dy*sc,E);if(s&&W>40){p.set(cx+dx*sc+1,ey+dy*sc,E);p.set(cx+dx*sc,ey+dy*sc+1,E);}if(s)p.set(cx+dx*sc,ey+dy*sc-(W>40?0:0),E);}
  if(W>40)p.set(cx-2*Math.max(1,W/60)+1,ey,E2);
  const fy0=Math.round(ce.y+ce.ry*.75),fl=Math.max(2,Math.round(H*.08)),F=hex(o.fang||'#1a1210');for(const s of[-1,1]){for(let k=0;k<fl;k++)p.set(cx+s*(raise?2+k*.6:1.5+k*.2),fy0+k,F);}
  if(spit){const G=hex(o.spit||'#a8ff40');for(let k=0;k<5;k++)p.set(cx+(k%3)-1,fy0+fl+(k>>1),G);}
  outline(p);return p.done();}
const SP_LOOK={
  spk:{W:30,H:20,body:['#3a2a1a','#5a4430','#7a6046','#9a7c5e'],abd:['#4a3624','#6a5038','#8a6c50'],eye:'#1a0a08',legW:1,seed:1},
  spj:{W:40,H:26,body:['#22160e','#3a2818','#543c26','#6e5236'],abd:['#2a1c10','#45301c','#60462c','#7a5c3a'],eye:'#c82010',legW:1.5,mark:'#8a6a40',seed:2,hair:'#7a6248'},
  spg:{W:44,H:28,body:['#0e1a0a','#1a2e12','#28441a','#3a5c26'],abd:['#0e160a','#1e3212','#2c4a1a'],eye:'#e8ff40',legW:1.6,mark:'#d8e030',spit:'#a8ff40',seed:3,band:'#c8d030'},
  spw:{W:52,H:30,body:['#5a5650','#7a766e','#9c9890','#c0bcb2'],abd:['#6a665e','#8e8a80','#b4b0a6','#d8d4ca'],leg:['#4a4640','#6a665e','#8a867c'],eye:'#202020',legW:1.2,long:1.25,mark:'#4a4640',spit:'#ffffff',seed:4},
  spf:{W:56,H:36,body:['#1a0806','#2e100a','#481a10','#642818'],abd:['#200a06','#3a140c','#5a2214','#78301c'],eye:'#ff3010',legW:2.4,mark:'#c84a20',seed:5,hair:'#8a3a20',band:'#a83a18'},
  spb:{W:44,H:28,body:['#3a1a06','#5a2c0c','#7a4214','#9a5a20'],abd:['#4a2408','#6a3810','#8a5018'],eye:'#ffd040',legW:1.6,mark:'#e8a040',seed:6,hair:'#b87a3a'},
  trn:{W:150,H:96,body:['#0e0806','#1c120c','#2c1e14','#3e2c1e','#52402c'],abd:['#100a06','#1e140c','#2e2014','#42301e'],leg:['#0e0806','#1e140c','#30221a','#443224'],eye:'#ff2a10',legW:5,mark:'#c8702a',fang:'#2a1a10',spit:'#c8ff40',seed:7,hair:'#8a6a4a',band:'#c8702a'}};
function spEgg(f){const p=new Px(22,26),C=pal(['#8a867a','#b8b4a6','#dcd8ca','#f4f0e4']);for(let y=0;y<26;y++)for(let x=0;x<22;x++){const dx=(x-11)/10,dy=(y-14)/11.5;if(dx*dx+dy*dy>1)continue;p.set(x,y,C[shadeIdx(.65-dx*.3-dy*.3+(hash2(x,y,31)-.5)*.2,4,x,y)]);}
  for(let k=0;k<6;k++){const x0=2+k*3.5;for(let y=3;y<25;y++)if(hash2(k,y,32)<.5)p.set(x0+Math.sin(y*.4+k)*1.2,y,hex('#ffffff'));}
  if(f===1)for(let k=0;k<10;k++)p.set(8+((k*3)%7),6+k*1.5,hex('#3a2a18'));outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k in SP_LOOK)for(const f of[0,1,2,'a','c','j'])list.push([k+'_'+f,spDraw(SP_LOOK[k],f)]);
  list.push(['speg_0',spEgg(0)],['speg_1',spEgg(1)]);list.push(['orb_web',drawOrb(['#8a8a8a','#c0c0c0','#e8e8e8','#ffffff'],12)]);list.push(['orb_acid',drawOrb(['#4a5a06','#90b010','#d0f030','#f8ffb0'],13)]);}catch(e){console.error('Spinnen: Bilder',e);}};}
// ---------- Spinnenarten ----------
Object.assign(DT,{
  spk:{name:'Spinnling',fac:'demon',h:.45,hp:12,dmg:0,spd:3.4,reach:.6,cd:2,spr:'spk_',xp:2,aggro:0,leash:10,rad:.2,side:0},
  spj:{name:'Höhlenspinne',fac:'demon',h:.8,hp:45,dmg:6,spd:4.6,reach:1.1,cd:1.1,wind:.25,spr:'spj_',xp:12,aggro:8,leash:26,rad:.4,loot:[['copper',6,.4]]},
  spg:{name:'Giftspinne',fac:'demon',h:1.05,hp:90,dmg:8,spd:3.8,reach:1.3,cd:1.3,wind:.3,spr:'spg_',xp:22,aggro:12,leash:28,rad:.5,fa:'c',
    ranged:{min:3,max:15,cd:3.4,wind:.55,spd:13,dmg:6,orb:'orb_poison',col:0x8aff40,size:.55,tag:{poisonT:6}},loot:[['copper',10,.5]]},
  spw:{name:'Weberspinne',fac:'demon',h:1.25,hp:130,dmg:9,spd:4.2,reach:1.4,cd:1.4,wind:.3,spr:'spw_',xp:26,aggro:12,leash:28,rad:.55,
    ranged:{min:3,max:14,cd:4.2,wind:.5,spd:12,dmg:3,orb:'orb_web',col:0xffffff,size:.7,tag:{web:1.8}},loot:[['copper',12,.5],['silver',1,.15]]},
  spf:{name:'Jagdspinne',fac:'demon',h:1.65,hp:240,dmg:17,spd:5.4,reach:1.7,cd:1.2,wind:.3,spr:'spf_',xp:40,aggro:13,leash:30,rad:.75,loot:[['silver',2,.4],['copper',15,.6]]},
  spb:{name:'Brutspinne',fac:'demon',h:1.15,hp:70,dmg:7,spd:5.6,reach:1.3,cd:1,wind:.25,spr:'spb_',xp:14,aggro:40,leash:60,rad:.45},
  spegg:{name:'Spinnenei',fac:'demon',h:1.05,hp:55,dmg:0,spd:0,reach:0,cd:9,spr:'speg_',xp:8,aggro:0,leash:5,rad:.45},
  tarantula:{name:'Tarantula',fac:'demon',boss:1,h:4.4,hp:8000,dmg:26,spd:9,reach:3.2,cd:1.5,wind:.4,spr:'trn_',xp:3200,rad:2.3,aggro:72,leash:999,tint:1.05,
    loot:[['coin',6,1],['silver',60,1],['hpot2',3,1]]}});
// Projektile tragen Wirkungen (Gift, Netz, Säure)
{const a=shoot;shoot=function(e,tx,ty,tz,R,o){const n0=SHOTS.length;a(e,tx,ty,tz,R,o);if(R&&R.tag)for(let i=n0;i<SHOTS.length;i++)Object.assign(SHOTS[i],R.tag);};}
{const a=shotHit;shotHit=function(s){a(s);if(s.fac!=='demon')return;const d=Math.hypot(P.x-s.x,P.z-s.z),hit=d<Math.max(1,s.aoe||0)+.5&&Math.abs(P.y+1-s.y)<2.6&&(state==='playing'||state==='dialog');
  if(s.acid)spAcidPool(s.x,s.z);
  if(!hit)return;if(s.poisonT){P.poisonT=Math.max(P.poisonT||0,s.poisonT);if(!SPW.poiTip){SPW.poiTip=1;toast('Gift! Es brennt in den Adern …');}}
  if(s.web){P.webT=Math.max(P.webT||0,s.web);toast('Du bist eingesponnen!');for(let k=0;k<20;k++)spawnParticle(P.x+(Math.random()-.5),P.y+Math.random()*1.8,P.z+(Math.random()-.5),0,.2,0,0xffffff,.8,.18);}};}
// ---------- Grundriss: drei Ringe um den Hohlraum ----------
function cvCarver(seed,r,open,HL,O){O=O||{h:1,w:1};const N=CV_N,C=CV_C;
  const put=(lx,lz,rad,h)=>{const i0=Math.max(2,Math.floor(lx+C-rad)),i1=Math.min(N-3,Math.ceil(lx+C+rad)),j0=Math.max(2,Math.floor(lz+C-rad)),j1=Math.min(N-3,Math.ceil(lz+C+rad));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=i-C-lx,dz=j-C-lz;if(dx*dx+dz*dz<=rad*rad){const k=j*N+i;open[k]=1;if(h>HL[k])HL[k]=h;}}};
  const blob=(lx,lz,R,h,sd,amp)=>{const A=amp==null?.42:amp,i0=Math.max(2,Math.floor(lx+C-R*1.4)),i1=Math.min(N-3,Math.ceil(lx+C+R*1.4)),j0=Math.max(2,Math.floor(lz+C-R*1.4)),j1=Math.min(N-3,Math.ceil(lz+C+R*1.4));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=i-C-lx,dz=j-C-lz,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx),rr=R*(1-A/2+A*cvN(Math.cos(a)*1.6+sd*7.3,Math.sin(a)*1.6+sd*3.1,seed+41));if(d<=rr){const k=j*N+i;open[k]=1;if(h>HL[k])HL[k]=h;}}};
  const tunnel=(ax,az,bx,bz,sd,wMul,maxOff)=>{const mx=(ax+bx)/2,mz=(az+bz)/2,L=Math.hypot(bx-ax,bz-az)||1,px=-(bz-az)/L,pz=(bx-ax)/L,off=(r()-.5)*Math.min(maxOff==null?16:maxOff*2,L*.45),qx=mx+px*off,qz=mz+pz*off,n=Math.ceil(L/.6);
    for(let t=0;t<=n;t++){const q=t/n,u=1-q,x=u*u*ax+2*u*q*qx+q*q*bx,z=u*u*az+2*u*q*qz+q*q*bz,w=(2.4+1.9*cvN(t*.6/6,sd*5.7,seed+43))*(wMul||1)*O.w,h=(3.6+1.1*cvN(t*.6/9,sd*3.9,seed+44))*O.h;put(x,z,w,h);}};
  return{put,blob,tunnel};}
function cvGen2(seed){const r=mulberry32(seed>>>0),N=CV_N,open=new Uint8Array(N*N),HL=new Float32Array(N*N),{put,blob,tunnel}=cvCarver(seed,r,open,HL,{h:1.6,w:.6});
  const RR=[72,84,96,108],SEC=20,nodes=[];for(let g=0;g<4;g++)for(let s=0;s<SEC;s++){const a=s/SEC*6.283+(r()-.5)*.12,rr=RR[g]+(r()-.5)*(g===0?2:3);nodes.push({g,s,a,x:Math.cos(a)*rr,z:Math.sin(a)*rr,e:[]});}
  const id=(g,s)=>g*SEC+((s%SEC)+SEC)%SEC,key=(a,b)=>a<b?a+','+b:b+','+a,ed=new Set();
  const st=id(3,5),vis=new Set([st]),stack=[st];
  while(stack.length){const k=stack[stack.length-1],n=nodes[k],nb=[[n.g,n.s+1],[n.g,n.s-1],[n.g+1,n.s],[n.g-1,n.s]].filter(([g])=>g>=0&&g<4).map(([g,s])=>id(g,s)).filter(m=>!vis.has(m));
    if(!nb.length){stack.pop();continue;}const m=nb[(r()*nb.length)|0];vis.add(m);ed.add(key(k,m));stack.push(m);}
  for(let t=0,add=0;t<400&&add<15;t++){const k=(r()*nodes.length)|0,n=nodes[k],m=r()<.55?id(n.g,n.s+1):n.g<3?id(n.g+1,n.s):-1;if(m<0)continue;const kk=key(k,m);if(ed.has(kk))continue;ed.add(kk);add++;}
  for(const kk of ed){const[a,b]=kk.split(',').map(Number);nodes[a].e.push(b);nodes[b].e.push(a);}
  const dist=new Map([[st,0]]),q=[st];while(q.length){const k=q.shift();for(const m of nodes[k].e)if(!dist.has(m)){dist.set(m,dist.get(k)+1);q.push(m);}}
  let ent=id(0,0);for(let s=0;s<SEC;s++){const k=id(0,s);if(dist.get(k)>dist.get(ent))ent=k;}const EN=nodes[ent],aE=EN.a;
  let sd=1;for(const kk of ed){const[a,b]=kk.split(',').map(Number),A=nodes[a],Bn=nodes[b];tunnel(A.x,A.z,Bn.x,Bn.z,sd++,A.g===0&&Bn.g===0?.9:1,A.g===Bn.g?2.2:3.5);}
  for(const n of nodes){const big=n.g>0&&r()<.3&&nodes.indexOf(n)!==st;n.big=big;n.R=big?(n.g===3?4.6:5.2+r()*1.2):2.6+r()*1.3;n.h=big?8+r()*2:6.5+r()*1.2;blob(n.x,n.z,n.R,n.h,sd++);}
  // Startkammer mit Aufzug
  const S0=nodes[st],S={x:Math.round(S0.x),z:Math.round(S0.z)};blob(S.x,S.z,6.5,14,sd++,.15);
  // der Hohlraum und der einzige Durchgang
  const HR=55;blob(0,0,HR,46,sd++,.08);for(let t=0;t<=40;t++){const rr=HR-4+t*(EN.g===0?(Math.hypot(EN.x,EN.z)-HR+4)/40:0),x=Math.cos(aE)*rr,z=Math.sin(aE)*rr;put(x,z,2+.5*cvN(t*.2,3,seed+45),7);}
  // Ausgang nach oben: Nische gegenüber dem Durchgang
  const aL=aE+Math.PI,BL={x:Math.round(Math.cos(aL)*58.5),z:Math.round(Math.sin(aL)*58.5)};blob(BL.x,BL.z,4.6,12,sd++,.08);
  const BLn=[-Math.cos(aL),-Math.sin(aL)],BLopen=Math.abs(BLn[0])>Math.abs(BLn[1])?(BLn[0]>0?'e':'w'):(BLn[1]>0?'s':'n');
  // schmale Felsspalten zum Verstecken
  const crev=[];for(let k=0;k<12&&crev.length<9;k++){const a=aE+.55+k*((6.283-1.1)/11);if(Math.abs(Math.atan2(Math.sin(a-aL),Math.cos(a-aL)))<.3)continue;
    const tx=-Math.sin(a)*(k%2?1:-1),tz=Math.cos(a)*(k%2?1:-1);for(let t=0;t<=12;t++){const rr=HR-3+t*.5;put(Math.cos(a)*rr,Math.sin(a)*rr,.85+.1*Math.sin(t*1.3),3.1);}
    const ex=Math.cos(a)*(HR+3),ez=Math.sin(a)*(HR+3);for(let t=0;t<=9;t++)put(ex+tx*t*.45,ez+tz*t*.45,.85+.1*Math.sin(t*1.7),3);
    crev.push({a,x:ex+tx*3.6,z:ez+tz*3.6});}
  // ein paar kurze Sackgassen
  const spurs=[];for(let t=0;t<40&&spurs.length<20;t++){const n=nodes[id(1+((r()*3)|0),(r()*SEC)|0)];const a=n.a+(r()<.5?1:-1)*(.6+r()*.9),L=6+r()*6,x=n.x+Math.cos(a)*L,z=n.z+Math.sin(a)*L,rr=Math.hypot(x,z);if(rr<76||rr>112||Math.abs(x)>112||Math.abs(z)>112)continue;tunnel(n.x,n.z,x,z,sd++,.85,2);blob(x,z,2.4+r()*1.2,6.5,sd++);spurs.push({x,z});}
  return{nodes,ed,dist,st,S,BL,BLn,BLopen,Sopen:'n',open,HL,r,ent:EN,aE,aL,HR,crev,spurs,keep:[{x:0,z:0,r:HR+3}]};}
// ---------- Netze, Säure, Klebrigkeit ----------
const SPW={webs:[],pools:[],poiTip:0};
let SPWT=null;function spWebTex(big){if(SPWT&&SPWT[big?1:0])return SPWT[big?1:0];SPWT=SPWT||[];const S=big?512:128,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),m=S/2,sp=big?20:12,rings=big?26:9;
  x.strokeStyle='rgba(240,240,236,0.9)';x.lineWidth=big?2:1.2;x.imageSmoothingEnabled=false;const r=mulberry32(big?77:55),ang=[];for(let k=0;k<sp;k++)ang.push(k/sp*6.283+(r()-.5)*.15);
  for(const a of ang){x.beginPath();x.moveTo(m,m);x.lineTo(m+Math.cos(a)*m*.98,m+Math.sin(a)*m*.98);x.stroke();}
  for(let g=1;g<=rings;g++){const rr=m*.98*g/rings;x.beginPath();for(let k=0;k<=sp;k++){const a=ang[k%sp],q=rr*(.93+r()*.07)-(k%2)*rr*.02;const px=m+Math.cos(a)*q,py=m+Math.sin(a)*q;if(!k)x.moveTo(px,py);else x.lineTo(px,py);}x.globalAlpha=.55+r()*.4;x.stroke();x.globalAlpha=1;}
  // ausgefranst: hier und da Lücken
  x.globalCompositeOperation='destination-out';for(let k=0;k<(big?14:4);k++){x.beginPath();x.arc(r()*S,r()*S,S*(.03+r()*.06),0,6.283);x.fill();}x.globalCompositeOperation='source-over';
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;SPWT[big?1:0]=t;return t;}
let SPWM=null;const spWebMat=()=>SPWM||(SPWM=new THREE.MeshBasicMaterial({map:spWebTex(false),transparent:true,alphaTest:.25,side:THREE.DoubleSide,depthWrite:false,color:0xe8e6e0}));
function spWebAdd(K,w){w.fy=((CV.on&&cvFloor(w.x,w.z))||DG_Y)-DG_Y;const g=w.kind==='floor'?new THREE.CircleGeometry(w.r,14):new THREE.PlaneGeometry(w.hw*2,w.h);const m=new THREE.Mesh(g,spWebMat());
  if(w.kind==='floor'){m.rotation.x=-Math.PI/2;m.rotation.z=Math.random()*6;m.position.set(w.x,DG_Y+w.fy+.04,w.z);}else{m.position.set(w.x,DG_Y+w.fy+w.y0+w.h/2,w.z);m.rotation.y=Math.atan2(w.nx,w.nz);}
  K.grp.add(m);w.m=m;w.touch=0;w.alive=true;SPW.webs.push(w);}
function spWebBreak(w,byHit){if(!w.alive)return;w.alive=false;w.m.visible=false;const n=w.kind==='floor'?14:24;for(let k=0;k<n;k++)spawnParticle(w.x+(Math.random()-.5)*(w.hw||w.r)*1.4,DG_Y+(w.fy||0)+(w.kind==='floor'?.2:w.y0+Math.random()*w.h),w.z+(Math.random()-.5)*(w.hw||w.r)*1.4,(Math.random()-.5)*2,Math.random()*1.5,(Math.random()-.5)*2,0xf0f0ec,.9,.16);
  try{Snd.whoosh(byHit?1200:700,.06);}catch(_){}}
function spWebAt(x,z,y){for(const w of SPW.webs){if(!w.alive||Math.abs(w.x-x)>6||Math.abs(w.z-z)>6)continue;const fb=DG_Y+(w.fy||0);if(y>fb+(w.kind==='floor'?3:w.y0+w.h))continue;if(w.kind==='floor'){if(Math.hypot(w.x-x,w.z-z)<w.r*.9)return w;continue;}
    const dx=x-w.x,dz=z-w.z,dn=dx*w.nx+dz*w.nz,dl=-dx*w.nz+dz*w.nx;if(Math.abs(dn)<.6&&Math.abs(dl)<w.hw&&y<fb+w.y0+w.h&&w.block)return w;}return null;}
function spWebSwing(range){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);let n=0;for(const w of SPW.webs){if(!w.alive)continue;const dx=w.x-P.x,dz=w.z-P.z,d=Math.hypot(dx,dz);
    let near=d<range+(w.kind==='floor'?w.r*.8:1.2)&&(d<1||(dx*fx+dz*fz)/d>.3);if(!near&&w.kind!=='floor'){const dn=(P.x-w.x)*w.nx+(P.z-w.z)*w.nz,dl=-(P.x-w.x)*w.nz+(P.z-w.z)*w.nx;near=Math.abs(dn)<range+.4&&Math.abs(dl)<w.hw&&(Math.abs(dn)<.5||Math.sign(-dn)===Math.sign(fx*w.nx+fz*w.nz));}
    if(near){spWebBreak(w,true);n++;}}if(n&&P.webStick)P.webStick=Math.max(0,P.webStick-.25);return n;}
{const a=attack;attack=function(){const t0=P.atkT;a();if(P.atkT!==t0&&CV.on&&CV.lvl===2){const W=WEAPONS[weaponOf()];spWebSwing((W&&W.range)||2);}};}
let SPAM=null;function spAcidPool(x,z){if(!CV.on||CV.lvl!==2)return;if(!SPAM)SPAM=new THREE.MeshBasicMaterial({color:0xb8e030,transparent:true,opacity:.55,depthWrite:false});const m=new THREE.Mesh(new THREE.CircleGeometry(2.1,16),SPAM);m.rotation.x=-Math.PI/2;
  m.position.set(x,(cvFloor(x,z)||DG_Y)+.06,z);DGX.grp.add(m);SPW.pools.push({x,z,t:7,m,tick:0});try{Snd.whoosh(300,.08);}catch(_){}}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);if(!(CV.on&&CV.lvl===2&&cvHere(P.y))||state!=='playing')return;let k=1;
  if(P.webT>0){P.webT-=dt;k=.06;if(Math.random()<dt*14)spawnParticle(P.x+(Math.random()-.5)*.8,P.y+Math.random()*1.8,P.z+(Math.random()-.5)*.8,0,.2,0,0xffffff,.5,.14);}
  const w=spWebAt(P.x,P.z,P.y);if(w){k=Math.min(k,w.kind==='floor'?.5:.32);w.touch+=dt;P.webStick=Math.min(.55,(P.webStick||0)+dt*.35);if(!SPW.webTip){SPW.webTip=1;toast('Spinnweben! Sie kleben und bremsen. Zerschlag sie mit deiner Waffe.');}
    if(w.kind!=='floor'&&w.touch>1.4)spWebBreak(w,false);}
  if(P.webStick>0){P.webStick=Math.max(0,P.webStick-dt*.1);k*=1-P.webStick*.6;if(Math.random()<dt*P.webStick*8)spawnParticle(P.x,P.y+.3+Math.random(),P.z,0,-.3,0,0xe8e8e0,.5,.1);}
  if(k<1){P.x=x0+(P.x-x0)*k;P.z=z0+(P.z-z0)*k;}};}
// ---------- Ebene 2: Aufbau ----------
const CV_L2={gen:s=>cvGen2(s),
  tint(i,j,seed){const a=cvN(i*.04,j*.04,seed+11),b=cvN(i*.06+40,j*.06,seed+12);let R=.64,G=.57,B=.47;if(a>.55){const q=(a-.55)*2.2;R+=.06*q;G+=.0*q;B-=.06*q;}if(b>.6){const q=(b-.6)*2.5;R-=.04*q;G-=.02*q;B-=.01*q;}
    const v=.84+.28*cvN(i*.45,j*.45,seed+13);let c=[R*v,G*v,B*v];const r=Math.hypot(i-CV_C,j-CV_C);
    if(r<63){const m=cvN(i*.09,j*.09,seed+19)*.7+cvN(i*.3,j*.3,seed+20)*.3,q=clamp((m-.36)*2.6,0,1)*clamp((63-r)/7,0,1);c=[c[0]*(1-q)+.25*q*v,c[1]*(1-q)+.43*q*v,c[2]*(1-q)+.15*q*v];}return c;},
  glow:{n:70,gap:10,shape:'shroom',cols:[0xffb850,0xa8ff70],add:[[.55,.36,.1],[.22,.46,.12]],spark:[0xffc870,0xb8ff80]},
  light:[0xbcb09a,.8,0xf6e6c8,.42],arrive:'Der Aufzug setzt auf. Die Luft ist warm und riecht nach Staub … und irgendetwas raschelt.',
  shape(c){const{G,N,C,open,cy}=c,cyAt=(x,z)=>{const k=(Math.round(z)+C)*N+Math.round(x)+C;return open[k]?cy[k]:0;},rWall=(a,y)=>{for(let rr=8;rr<G.HR+6;rr+=.5)if(cyAt(Math.cos(a)*rr,Math.sin(a)*rr)<y+3.2)return rr;return G.HR;};
    let a=G.aL+.5;for(let t=0;t<20&&G.crev.some(cv=>Math.abs(Math.atan2(Math.sin(a+.25-cv.a),Math.cos(a+.25-cv.a)))<.45);t++)a+=.12;
    const st=[];let y=.85;while(y<=37){const r=rWall(a,y)-1.9;st.push({x:Math.cos(a)*r,z:Math.sin(a)*r,y,a});a+=2.5/r;y+=.85;}
    const L=st[st.length-1],ia=L.a+2.4/Math.hypot(L.x,L.z);let r=Math.hypot(L.x,L.z),yy=L.y;const ss=[];for(let k=1;k<=7;k++){r-=1.15;yy+=.55;ss.push({x:Math.cos(ia)*r,z:Math.sin(ia)*r,y:yy,a:ia});}
    const T=ss[ss.length-1];for(let j=-7;j<=7;j++)for(let i=-7;i<=7;i++){const k=(Math.round(T.z)+C+j)*N+Math.round(T.x)+C+i,q=Math.hypot(i,j);if(!open[k])continue;if(q<=3.6)cy[k]=72;else if(q<=5.4)cy[k]=Math.max(cy[k],46);}
    G.stair={st,ss,top:{x:T.x,z:T.z,y:T.y+.3}};},
  decor(c){const{K,G,X,Z,Y,N,C,open,d,cy,part,RK,rnd,geo,tint}=c;
    // Tiefe jedes Punktes vom Aufzug aus (für Netze und Spinnen)
    const dep=new Float32Array(N*N).fill(-1),q=new Int32Array(N*N);let qh=0,qt=0;const s0=(G.S.z+C)*N+G.S.x+C;dep[s0]=0;q[qt++]=s0;
    while(qh<qt){const k=q[qh++];for(const o of[1,-1,N,-N]){const m=k+o;if(m<0||m>=N*N||!open[m]||dep[m]>=0)continue;dep[m]=dep[k]+1;q[qt++]=m;}}
    let mx=1;for(let k=0;k<N*N;k++){if(dep[k]<0)continue;const i=k%N-C,j=((k/N)|0)-C;if(Math.hypot(i,j)>G.HR+4&&dep[k]>mx)mx=dep[k];}c.depth=dep;c.dmax=mx;
    const D=(x,z)=>{const k=(Math.round(z)+C)*N+Math.round(x)+C;return dep[k]<0?0:Math.min(1,dep[k]/mx);};c.D=D;
    // Netze in den Gängen: je tiefer, desto mehr
    SPW.webs.length=0;SPW.pools.length=0;const R=mulberry32((c.seed^0x3e1)>>>0);
    for(let t=0;t<16000;t++){const i=3+((R()*(N-6))|0),j=3+((R()*(N-6))|0),k=j*N+i;if(!open[k]||dep[k]<0)continue;const lx=i-C,lz=j-C;if(Math.hypot(lx,lz)<G.HR+3||Math.hypot(lx-G.S.x,lz-G.S.z)<14)continue;
      const dq=Math.min(1,dep[k]/mx),x=X+lx,z=Z+lz;
      if(d[k]>=1.4&&d[k]<=3.4&&R()<.005+dq*dq*.04){// quer über den Gang
        let gx=(dep[k+1]>=0?dep[k+1]:dep[k])-(dep[k-1]>=0?dep[k-1]:dep[k]),gz=(dep[k+N]>=0?dep[k+N]:dep[k])-(dep[k-N]>=0?dep[k-N]:dep[k]);const gl=Math.hypot(gx,gz);if(gl<.5)continue;gx/=gl;gz/=gl;
        if(SPW.webs.some(w=>Math.hypot(w.x-x,w.z-z)<6))continue;const hw=Math.min(d[k]+.6,4.6),h=Math.min(cy[k]-.2,6);spWebAdd(K,{kind:'wall',x,z,nx:gx,nz:gz,hw,h,y0:0,block:true});}
      else if(d[k]>=1.8&&R()<dq*dq*.012){if(SPW.webs.some(w=>Math.hypot(w.x-x,w.z-z)<4))continue;spWebAdd(K,{kind:'floor',x,z,r:1.4+R()*1.2});}
      else if(d[k]>=1&&d[k]<1.6&&R()<.006+dq*.05){// an der Wand und in Ecken (nur Zierde)
        let gx=0,gz=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!open[(j+b)*N+i+a]){gx+=a;gz+=b;}if(!gx&&!gz)continue;const L=Math.hypot(gx,gz);const s=1.2+R()*1.6;spWebAdd(K,{kind:'deco',x:x+gx/L*.4,z:z+gz/L*.4,nx:gx/L,nz:gz/L,hw:s,h:s*1.4,y0:.4+R()*(Math.max(.5,cy[k]-s*1.4-.6)),block:false});}}
    // eingesponnene Opfer (Kokons) in der Tiefe
    const COC=new THREE.MeshLambertMaterial({color:0xe6e2d6,vertexColors:true});for(let t=0;t<5000;t++){const i=3+((R()*(N-6))|0),j=3+((R()*(N-6))|0),k=j*N+i;if(!open[k]||dep[k]<0||d[k]<1.2||d[k]>2.2)continue;const dq=dep[k]/mx;if(R()>dq*.03)continue;
      part(COC,geo.dod,X+i-C,Y+c.fy[k]+.45,Z+j-C,(R()-.5)*.4,R()*3,Math.PI/2+(R()-.5)*.3,.42,1.1,.42,[.9+R()*.1,.88+R()*.1,.82+R()*.1]);}
    // Hohlraum: großes Netz, Felsvorsprünge, Stufen, Kokons
    const HR=G.HR,cyAt=(x,z)=>{const k=(Math.round(z)+C)*N+Math.round(x)+C;return open[k]?cy[k]:0;};
    const rWall=(a,y)=>{for(let rr=10;rr<HR+6;rr+=.5){if(cyAt(Math.cos(a)*rr,Math.sin(a)*rr)<y+3.2)return rr;}return HR;};
    const WY=24,WR=24;const big=new THREE.Mesh(new THREE.CircleGeometry(WR,48),new THREE.MeshBasicMaterial({map:spWebTex(true),transparent:true,alphaTest:.2,side:THREE.DoubleSide,depthWrite:false,color:0xf0eee8}));big.rotation.x=-Math.PI/2;big.position.set(X,Y+WY,Z);K.grp.add(big);
    const thread=(x0,y0,z0,x1,y1,z1,w)=>{const L=Math.hypot(x1-x0,y1-y0,z1-z0),m=new THREE.Mesh(new THREE.BoxGeometry(w||.07,w||.07,L),SILK);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.lookAt(x1,y1,z1);K.grp.add(m);};
    const SILK=new THREE.MeshBasicMaterial({color:0xe8e6e0});
    for(let k=0;k<12;k++){const a=k/12*6.283+.13,ay=WY+4+rnd()*9,ar=rWall(a,ay)-.5;thread(X+Math.cos(a)*WR*.98,Y+WY,Z+Math.sin(a)*WR*.98,X+Math.cos(a)*ar,Y+ay,Z+Math.sin(a)*ar,.09);}
    for(let k=0;k<6;k++){const a=k/6*6.283,rr=WR*.5;thread(X+Math.cos(a)*rr,Y+WY,Z+Math.sin(a)*rr,X+Math.cos(a)*rr*.6,Y+cyAt(Math.cos(a)*rr*.6,Math.sin(a)*rr*.6)-.3,Z+Math.sin(a)*rr*.6,.07);}
    for(let k=0;k<9;k++){const a=rnd()*6.283,rr=4+rnd()*(WR-6),x=X+Math.cos(a)*rr,z=Z+Math.sin(a)*rr,L=1.6+rnd()*2.4;thread(x,Y+WY,z,x,Y+WY-L+.4,z,.05);part(COC,geo.dod,x,Y+WY-L,z,0,rnd()*3,0,.5,1.1,.5,[.95,.93,.88]);}
    const ledges=[],stone=(x,y,z,w,h,dd,ry,col)=>part(RK,new THREE.BoxGeometry(1,1,1),x,y,z,0,ry,0,w,h,dd,col);
    const skip=a=>Math.abs(Math.atan2(Math.sin(a-G.aE),Math.cos(a-G.aE)))<.4||Math.abs(Math.atan2(Math.sin(a-G.aL),Math.cos(a-G.aL)))<.35||G.crev.some(cv=>Math.abs(Math.atan2(Math.sin(a-cv.a),Math.cos(a-cv.a)))<.13);
    const kinds=['low','high','mid','high','low','mid','high','mid','low','high','mid','high','low','mid'];let ki=0;
    for(let k=0;k<22&&ki<kinds.length;k++){const a=G.aE+.45+k*(6.283-.9)/21;if(skip(a))continue;const kind=kinds[ki++],ty=kind==='low'?3.6:kind==='mid'?10+rnd()*4:18+rnd()*10,rw=rWall(a,ty),rc=rw-2.4,x=Math.cos(a)*rc,z=Math.sin(a)*rc,ry=-a+Math.PI/2,tn=tint(Math.round(x+C),Math.round(z+C));
      if(G.stair&&G.stair.st.some(q=>Math.hypot(q.x-x,q.z-z)<5.5&&Math.abs(q.y-ty)<4)){continue;}
      const col=[tn[0]*.9,tn[1]*.9,tn[2]*.9];
      if(kind==='low'){stone(X+x,Y+ty/2,Z+z,5.2,ty,4.6,ry,col);DGX.sol.push(solAdd({x:X+x,z:Z+z,hw:2.6,hd:2.3,y0:Y-1,y1:Y+ty,rot:-ry,solid:1,walk:1,dg:1}));
        // Stufen zum Hinaufspringen
        for(let s=1;s<=3;s++){const rs=rc-1.9-s*2.4,sx=Math.cos(a)*rs,sz=Math.sin(a)*rs,sh=ty-s*.9;stone(X+sx,Y+sh/2,Z+sz,2.6,sh,2.4,ry,[col[0]*.95,col[1]*.95,col[2]*.95]);DGX.sol.push(solAdd({x:X+sx,z:Z+sz,hw:1.3,hd:1.2,y0:Y-1,y1:Y+sh,rot:-ry,solid:1,walk:1,dg:1}));}}
      else{stone(X+x,Y+ty-.7,Z+z,5.4,1.4,4.8,ry,col);part(RK,geo.dod,X+Math.cos(a)*(rc+1.2),Y+ty-2.2,Z+Math.sin(a)*(rc+1.2),rnd(),rnd()*3,rnd(),2.8,2.6,2.4,[col[0]*.85,col[1]*.85,col[2]*.85]);
        DGX.sol.push(solAdd({x:X+x,z:Z+z,hw:2.7,hd:2.4,y0:Y+ty-1.4,y1:Y+ty,rot:-ry,solid:1,walk:1,dg:1}));}
      ledges.push({x:X+x,z:Z+z,y:Y+ty,kind,a});}
    // Felssäulen mit Plattformen: Tarantula springt darauf und greift von dort an. Zwei niedrige erreicht man über Steinstufen.
    const MOSS=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true}),mc=()=>[.26+rnd()*.08,.42+rnd()*.1,.14+rnd()*.06];
    const TOPS=[5,7.5,10,13,16,20,24,29];for(let k=0,n=0;k<80&&n<TOPS.length;k++){const a=rnd()*6.283,r=18+rnd()*26,x=Math.cos(a)*r,z=Math.sin(a)*r,top=TOPS[n];
      if(ledges.some(l=>Math.hypot(l.x-X-x,l.z-Z-z)<11)||cyAt(x,z)<top+7||G.stair.st.some(q=>Math.hypot(q.x-x,q.z-z)<7)||Math.abs(Math.atan2(Math.sin(a-G.aE),Math.cos(a-G.aE)))<.25&&r>40)continue;n++;
      const pr=3+rnd()*1.3,tn=tint(Math.round(x+C),Math.round(z+C)),col=[tn[0]*.9,tn[1]*.9,tn[2]*.9];
      part(RK,geo.cyl,X+x,Y+top/2-.6,Z+z,0,rnd()*3,0,pr*.55,top-1.2,pr*.55,col);part(RK,geo.cyl,X+x,Y+top-.6,Z+z,0,rnd()*3,0,pr,1.2,pr,col);part(RK,geo.cone,X+x,Y+top-2.2,Z+z,Math.PI,rnd()*3,0,pr*.85,2.2,pr*.85,col);
      for(let m=0;m<5;m++){const ma=rnd()*6.283,mr=rnd()*pr*.8;part(MOSS,geo.dod,X+x+Math.cos(ma)*mr,Y+top+.02,Z+z+Math.sin(ma)*mr,0,rnd()*3,0,.7+rnd()*.8,.18,.7+rnd()*.8,mc());}
      for(let m=0;m<3;m++){const ma=rnd()*6.283;part(MOSS,geo.cone,X+x+Math.cos(ma)*pr*.95,Y+top-1.4-rnd(),Z+z+Math.sin(ma)*pr*.95,Math.PI,0,0,.15,1.6+rnd()*1.6,.15,mc());}
      DGX.sol.push(solAdd({x:X+x,z:Z+z,hw:pr*.5,hd:pr*.5,y0:Y-1,y1:Y+top-1.2,rot:0,solid:1,dg:1}));DGX.sol.push(solAdd({x:X+x,z:Z+z,hw:pr*.82,hd:pr*.82,y0:Y+top-1.2,y1:Y+top,rot:0,solid:1,walk:1,dg:1}));
      if(top<=7.5){let sa=rnd()*6.283;for(let h=.9;h<top-.2;h+=.9){sa+=.75;const sx=x+Math.cos(sa)*(pr+.9),sz=z+Math.sin(sa)*(pr+.9);stone(X+sx,Y+h/2,Z+sz,1.7,h,1.7,sa,[col[0]*.95,col[1]*.95,col[2]*.95]);DGX.sol.push(solAdd({x:X+sx,z:Z+sz,hw:.85,hd:.85,y0:Y-1,y1:Y+h,rot:-sa,solid:1,walk:1,dg:1}));}}
      ledges.push({x:X+x,z:Z+z,y:Y+top,kind:'plat',a});}
    // Wasserfälle, die von verschiedenen Höhen herabplätschern
    const wc=document.createElement('canvas');wc.width=32;wc.height=128;{const g=wc.getContext('2d');for(let y=0;y<128;y++)for(let x=0;x<32;x++){const v=hash2(x,y>>2,61),w=hash2(x>>1,(y+x*3)>>3,62);g.fillStyle=`rgba(${200+v*55|0},${225+v*30|0},255,${(.35+w*.55).toFixed(2)})`;g.fillRect(x,y,1,1);}}
    const wtex=new THREE.CanvasTexture(wc);wtex.wrapS=wtex.wrapT=THREE.RepeatWrapping;wtex.magFilter=THREE.NearestFilter;const WFM=new THREE.MeshBasicMaterial({map:wtex,transparent:true,depthWrite:false,side:THREE.DoubleSide,color:0xd8eef8});
    const POOL=new THREE.MeshPhongMaterial({color:0x3a7a92,transparent:true,opacity:.7,shininess:80,specular:0x9ac8d8,depthWrite:false}),falls=[];
    for(let k=0;k<60&&falls.length<7;k++){const a=rnd()*6.283;if(skip(a)||G.stair.st.slice(0,12).some(q=>Math.abs(Math.atan2(Math.sin(a-q.a),Math.cos(a-q.a)))<.12))continue;if(falls.some(f=>Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)))<.6))continue;
      const top=10+rnd()*26,rw=rWall(a,top)-.4,x=Math.cos(a)*rw,z=Math.sin(a)*rw,w=1.4+rnd()*1.8,fm=new THREE.Mesh(new THREE.PlaneGeometry(w,top),WFM.clone());fm.material.map=wtex;fm.position.set(X+x,Y+top/2,Z+z);fm.rotation.y=Math.atan2(-Math.cos(a),-Math.sin(a));K.grp.add(fm);
      part(RK,geo.dod,X+Math.cos(a)*(rw+.6),Y+top+.3,Z+Math.sin(a)*(rw+.6),rnd(),rnd()*3,rnd(),1.6,1,1.4,[.5,.46,.4]);
      const pool=new THREE.Mesh(new THREE.CircleGeometry(2.4+w*.4,18),POOL);pool.rotation.x=-Math.PI/2;pool.position.set(X+x,Y+.05,Z+z);K.grp.add(pool);
      for(let m=0;m<8;m++){const ma=rnd()*6.283,mr=2.4+w*.4+rnd()*1.5;part(MOSS,geo.dod,X+x+Math.cos(ma)*mr,Y+.05,Z+z+Math.sin(ma)*mr,0,rnd()*3,0,.8+rnd(),.2,.8+rnd(),mc());}
      falls.push({x:X+x,z:Z+z,top:Y+top,a,w});}
    // Moos: Polster am Boden, Fransen von der Decke, Farne
    for(let t=0;t<260;t++){const a=rnd()*6.283,r=rnd()*(HR+2),x=Math.cos(a)*r,z=Math.sin(a)*r;if(cyAt(x,z)<=0)continue;const nm=cvN((x+C)*.09,(z+C)*.09,c.seed+19);if(nm<.42)continue;part(MOSS,geo.dod,X+x,Y+.03,Z+z,0,rnd()*3,0,.9+rnd()*1.4,.16,.9+rnd()*1.4,mc());}
    for(let t=0;t<170;t++){const a=rnd()*6.283,r=rnd()*(HR-2),x=Math.cos(a)*r,z=Math.sin(a)*r,cyv=cyAt(x,z);if(cyv<8)continue;const L=1+rnd()*3.5;part(MOSS,geo.cone,X+x,Y+cyv-L/2,Z+z,Math.PI,0,0,.12+rnd()*.12,L,.12+rnd()*.12,mc());}
    {const GS=['grass0','grass1','grass2','tall0','tall1'].filter(k=>SPR[k]),bb=[];for(let t=0;t<500&&GS.length;t++){const a=rnd()*6.283,r=6+rnd()*(HR-8),x=Math.cos(a)*r,z=Math.sin(a)*r;if(cyAt(x,z)<=0||cvN((x+C)*.09,(z+C)*.09,c.seed+19)<.4)continue;const sp=GS[(rnd()*GS.length)|0],S=SPR[sp],h=.5+rnd()*.7;bb.push({x:X+x,y:Y-.03,z:Z+z,w:h*S.w/S.h,h,spr:sp,tint:.75+rnd()*.2,sway:.04});}
      if(bb.length&&typeof decorMat!=='undefined'&&decorMat){const bm=makeBillboards(bb,decorMat);bm.frustumCulled=false;K.grp.add(bm);}}
    c.falls=falls;c.wtex=wtex;
    // Säulen aus Netzseide vom Boden zum Netz (Fluchtwege der Brut) und Kokons am Boden des Hohlraums
    for(let t=0;t<26;t++){const a=rnd()*6.283,rr=8+rnd()*(HR-14),x=X+Math.cos(a)*rr,z=Z+Math.sin(a)*rr;part(COC,geo.dod,x,Y+.4,z,(rnd()-.5)*.4,rnd()*3,Math.PI/2,.45,1.1,.45,[.92,.9,.85]);}
    for(let t=0;t<40;t++){const a=rnd()*6.283,rr=6+rnd()*(HR-10),x=X+Math.cos(a)*rr,z=Z+Math.sin(a)*rr;spWebAdd(K,{kind:'floor',x,z,r:1.6+rnd()*1.8});}
    // Verborgene Treppe nach oben: Felsstufen, dann eine steinerne Treppe zum hellen Licht
    const SG=new THREE.Group();SG.visible=false;K.grp.add(SG);const steps=[],SM=twlMats().stone,stoneTint=tint(C,C);
    const colGeo=(g,cl)=>{const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=cl[0];a[i*3+1]=cl[1];a[i*3+2]=cl[2];}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g;};
    for(const q of G.stair.st){const m=new THREE.Mesh(colGeo(new THREE.BoxGeometry(2.6,1.1,2.6),[stoneTint[0]*.92,stoneTint[1]*.92,stoneTint[2]*.92]),RK);m.position.set(X+q.x,Y+q.y-.55,Z+q.z);m.rotation.y=-q.a;SG.add(m);
      const sl=solAdd({x:X+q.x,z:Z+q.z,hw:1.3,hd:1.3,y0:Y+q.y-1.1,y1:Y+q.y,rot:q.a,solid:1,walk:1,dg:1,off:true});DGX.sol.push(sl);steps.push({m,sl});}
    for(const q of G.stair.ss){const m=new THREE.Mesh(new THREE.BoxGeometry(1.3,.55,3.2),SM);m.position.set(X+q.x,Y+q.y-.27,Z+q.z);m.rotation.y=-q.a;SG.add(m);
      const sl=solAdd({x:X+q.x,z:Z+q.z,hw:.75,hd:1.6,y0:Y+q.y-.6,y1:Y+q.y,rot:q.a,solid:1,walk:1,dg:1,off:true});DGX.sol.push(sl);steps.push({m,sl});}
    // Licht im Schacht (immer sichtbar, als Hinweis)
    const T=G.stair.top,LM=new THREE.MeshBasicMaterial({color:0xfff8e0,fog:false}),BM=new THREE.MeshBasicMaterial({color:0xfff4d0,transparent:true,opacity:.18,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
    const disc=new THREE.Mesh(new THREE.CircleGeometry(3.4,24),LM);disc.rotation.x=Math.PI/2;disc.position.set(X+T.x,Y+66,Z+T.z);K.grp.add(disc);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(3,3.6,40,20,1,true),BM);beam.position.set(X+T.x,Y+T.y+18,Z+T.z);K.grp.add(beam);
    c.sp={cx:X,cz:Z,HR,WY:Y+WY,WR,ledges,falls:c.falls,wtex:c.wtex,crev:G.crev.map(cv=>({x:X+cv.x,z:Z+cv.z,a:cv.a})),stair:{g:SG,steps,top:{x:X+T.x,y:Y+T.y,z:Z+T.z},on:false,t:0}};},
  populate(c){const{K,G,X,Z,Y,R,spot,D}=c;CV.sp=Object.assign(c.sp,{eggs:0});
    // Spinnen: je tiefer, desto größer und angriffslustiger
    const groups=q=>q<.22?[['spk',2+((R()*2)|0)]]:q<.45?(R()<.6?[['spj',2],['spk',2]]:[['spg',1],['spj',1]]):q<.7?[[['spj',2],['spg',1]],[['spw',1],['spj',2]],[['spf',1],['spj',1]],[['spg',2]]][(R()*4)|0]:[[['spf',1],['spw',1]],[['spg',2],['spf',1]],[['spf',2]],[['spw',2],['spg',1]]][(R()*4)|0];
    const mob=(t,lx,lz,q)=>{const sc=.85+q*.55,o={scale:sc,dd:{aggro:t==='spk'?0:Math.round((DT[t].aggro||8)*(.7+q*.6)),dmg:(DT[t].dmg||0)*(.85+q*.4)},hp:Math.round(DT[t].hp*(.8+q*.6))};const e=cvMob(t,X+lx,Z+lz,R,o);if(e&&t==='spk')e.special=spKidAI;if(e&&t==='spf')e.special=spHuntAI;return e;};
    for(const n of G.nodes){if(G.nodes.indexOf(n)===G.st)continue;const q=D(n.x,n.z);if(Math.hypot(n.x-G.S.x,n.z-G.S.z)<20)continue;if(!(n.big?R()<.8:R()<.38))continue;const out=[];
      for(const[t,cnt]of groups(q))for(let k=0;k<cnt;k++){const s=spot(n.x,n.z,n.R*.6,1.6);if(!s)continue;const e=mob(t,s[0],s[1],q);if(e)out.push(e);}for(const e of out)e.mates=out;}
    for(let t=0;t<16;t++){const kk=[...G.ed][(R()*G.ed.size)|0].split(',').map(Number),a=G.nodes[kk[0]],b=G.nodes[kk[1]],f=.3+R()*.4,s=spot(a.x+(b.x-a.x)*f,a.z+(b.z-a.z)*f,4,2);if(!s||Math.hypot(s[0]-G.S.x,s[1]-G.S.z)<22)continue;const q=D(s[0],s[1]);mob(q<.3?'spk':q<.6?'spj':R()<.5?'spg':'spw',s[0],s[1],q);}
    // Truhen in Sackgassen
    const leaves=G.nodes.filter(n=>n.e.length===1&&G.nodes.indexOf(n)!==G.st);let ci=0;for(const n of leaves.concat(G.spurs).slice(0,8)){const s=spot(n.x,n.z,3,1.6);if(s)K.chest(s[0],s[1],'c'+(ci++),false);}
    // Tarantula im großen Netz
    const sp=CV.sp,b=spawnEnt('tarantula',sp.cx,sp.cz,{home:{x:sp.cx,z:sp.cz},cmd:1,cav:1,twl:1,noLeash:true,ownY:1});b.d=Object.assign({},DT.tarantula);b.onHurt=trHurt;b.special=trAI;b.pm='web';b.rot=Math.PI;b.yo=b.h;b.y=sp.WY-b.h;b.twBoss=1;DGX.ents.push(b);DGX.tw.boss=b;
    const bc=[G.BL.x+G.BLn[0]*8,G.BL.z+G.BLn[1]*8];K.chest(bc[0],bc[1],'boss',true);}};
// ---------- Verhalten der kleinen Spinnen ----------
function spKidAI(e,dt){const d=Math.hypot(P.x-e.x,P.z-e.z);if(d<5){const dx=e.x-P.x,dz=e.z-P.z,l=d||1;entMove(e,e.x+dx/l*4,e.z+dz/l*4,e.d.spd,dt);return true;}
  e.wt=(e.wt||0)-dt;if(e.wt<=0){e.wt=1.5+Math.random()*3;e.wx=e.home.x+(Math.random()-.5)*8;e.wz=e.home.z+(Math.random()-.5)*8;}if(cvDist(e.wx,e.wz)<1.2){e.wx=e.home.x;e.wz=e.home.z;}if(entMove(e,e.wx,e.wz,e.d.spd*.5,dt)<.001)e.frame=0;return true;}
// Jagdspinne: springt aus ein paar Metern auf ihr Opfer
function spHuntAI(e,dt){if(e.leap){const L=e.leap;L.t+=dt;const q=Math.min(1,L.t/L.T);e.x=L.x0+(L.x1-L.x0)*q;e.z=L.z0+(L.z1-L.z0)*q;cvPush(e,e.d.rad);e.frame='j';e.yo=Math.sin(q*Math.PI)*1.6;
    if(!L.hit&&Math.hypot(P.x-e.x,P.z-e.z)<1.3&&Math.abs(P.y-e.y)<2){L.hit=1;takeDamage(e.d.dmg*1.2);P.vx+=(P.x-e.x)*2;P.vz+=(P.z-e.z)*2;try{Snd.hit('sword');}catch(_){}}if(q>=1){e.leap=null;e.yo=0;e.frame=0;}return true;}
  e.lcd=(e.lcd==null?2:e.lcd)-dt;if(e.tgt==='player'){const d=Math.hypot(P.x-e.x,P.z-e.z);if(e.lcd<=0&&d>3&&d<9&&cvLOS(e.x,e.z,P.x,P.z,.8)){e.lcd=4+Math.random()*3;e.leap={x0:e.x,z0:e.z,x1:P.x,z1:P.z,t:0,T:.45};try{Snd.whoosh(600,.08);}catch(_){}return true;}}return false;}
// Eier: fallen, zittern, schlüpfen
function spLayEgg(x,y,z,n){const sp=CV.sp;for(let k=0;k<n;k++){if(sp.eggs>=7)return;const e=spawnEnt('spegg',x+(Math.random()-.5)*2,z+(Math.random()-.5)*2,{home:{x,z},cmd:1,cav:1,twl:1,ownY:1});e.y=y;e.vy=0;e.hatchT=6.5+Math.random()*2;e.special=spEggAI;e.onDeath=()=>{sp.eggs=Math.max(0,sp.eggs-1);};sp.eggs++;DGX.ents.push(e);}}
function spEggAI(e,dt){const g=cvFloor(e.x,e.z)||DG_Y;if(e.y>g){e.vy-=20*dt;e.y=Math.max(g,e.y+e.vy*dt);if(e.y<=g){e.ownY=0;try{Snd.thud();}catch(_){}}e.frame=0;return true;}
  e.hatchT-=dt;e.frame=e.hatchT<2&&Math.sin(time*30)>0?1:0;if(e.hatchT<=0){const sp=CV.sp;sp.eggs=Math.max(0,sp.eggs-1);e.onDeath=null;for(let k=0;k<1+((Math.random()*2)|0);k++){const s=cvMob('spb',e.x+(Math.random()-.5)*1.5,e.z+(Math.random()-.5)*1.5,null,{aggroT:12,dd:{aggro:40,leash:70}});if(s){s.aggroT=12;s.tgt='player';}}
    for(let k=0;k<20;k++)spawnParticle(e.x,e.y+.5,e.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,0xe8e4d0,.6,.2);e.hp=0;e.dead=true;e.alive=false;e.deadT=4;try{Snd.whoosh(900,.07);}catch(_){}}return true;}
{const a=entGround;entGround=function(e){if(e.ownY){e.gy=e.y;return;}return a(e);};}
// ---------- Tarantula ----------
function trPerch(e,mode){const sp=CV.sp,L=[],pd=(x,z)=>Math.hypot(P.x-x,P.z-z);
  if((e.lost||0)<3)for(let k=0;k<4;k++){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*(sp.WR-4),x=sp.cx+Math.cos(a)*r,z=sp.cz+Math.sin(a)*r;L.push({x,z,y:sp.WY-e.h,kind:'web',w:1.05});}
  for(const l of sp.ledges){const onIt=Math.hypot(P.x-l.x,P.z-l.z)<4&&P.y>l.y-1;if(onIt)continue;L.push({x:l.x,z:l.z,y:l.y,kind:'ledge',w:l.kind==='plat'?1.35:l.kind==='low'?.8:l.kind==='mid'?.8:.9});}
  if(mode!=='far')for(let k=0;k<2;k++){const a=Math.random()*6.283,r=10+Math.random()*(sp.HR-20);L.push({x:sp.cx+Math.cos(a)*r,z:sp.cz+Math.sin(a)*r,y:DG_Y,kind:'floor',w:.35});}
  let best=null,bs=-1e9;for(const p of L){const d=pd(p.x,p.z),j=Math.hypot(p.x-e.x,p.z-e.z);if(j<4)continue;let s=p.w+Math.random()*.9-(e.pm===p.kind?.55:0);if(mode==='far')s+=Math.min(d,30)/10-j/40;else{s-=Math.abs(d-20)/14;s-=j>45?1:0;}if(s>bs){bs=s;best=p;}}return best;}
function trJump(e,p){if(!p)return;const dy=Math.abs(p.y-e.y),dd=Math.hypot(p.x-e.x,p.z-e.z);e.pm='jump';e.J={x0:e.x,y0:e.y,z0:e.z,p,t:0,T:.55+dd/26+dy/40,hh:2.5+dd*.1};e.rot=0;e.yo=0;try{Snd.whoosh(420,.12);}catch(_){}}
function trShoot(e,kind){const tx=P.x,tz=P.z,ty=P.y+1;e.atkF='c';
  if(kind==='web')shoot(e,tx,ty,tz,{spd:15,dmg:4,orb:'orb_web',col:0xffffff,size:1.1,life:5,tag:{web:2.2},sy:.5});
  else if(kind==='poi')shoot(e,tx,ty,tz,{spd:16,dmg:9,orb:'orb_poison',col:0x8aff40,size:.8,n:3,spread:.16,life:5,tag:{poisonT:7},sy:.5});
  else if(kind==='acid'){const a=Math.random()*6.283,r=Math.random()*2.5;shoot(e,tx+Math.cos(a)*r,(cvFloor(tx,tz)||DG_Y),tz+Math.sin(a)*r,{spd:13,dmg:12,orb:'orb_acid',col:0xc8ff40,size:1.2,arc:1,aoe:2,life:6,tag:{acid:1},sy:.5});}
  try{Snd.whoosh(kind==='acid'?250:520,.1);}catch(_){}}
function trAI(e,dt){const sp=CV.sp;if(!sp)return true;e.noPath=1;const C=e.cd2||(e.cd2={web:3,poi:2,acid:6,egg:12,move:7,bite:0});for(const k in C)C[k]-=dt;
  const rage=e.hp<e.max*.4,K=rage?1.35:1;if(rage&&!e.rageT){e.rageT=1;toast('Tarantula kreischt! Sie wird rasend schnell.');try{Snd.demonRoar(1.6,.9);}catch(_){}}
  // Sprung
  if(e.pm==='jump'){const J=e.J;J.t+=dt*K;const q=Math.min(1,J.t/J.T);e.x=J.x0+(J.p.x-J.x0)*q;e.z=J.z0+(J.p.z-J.z0)*q;e.y=J.y0+(J.p.y-J.y0)*q+Math.sin(q*Math.PI)*J.hh;e.frame='j';
    if(q>=1){e.pm=J.p.kind;e.perch=J.p;e.y=J.p.y;e.floorT=0;if(e.pm==='web'){e.rot=Math.PI;e.yo=e.h;}else{e.rot=0;e.yo=0;}try{Snd.thud();}catch(_){}for(let k=0;k<10;k++)spawnParticle(e.x,e.y+(e.pm==='web'?e.h:0),e.z,(Math.random()-.5)*3,Math.random(),(Math.random()-.5)*3,0x8a7a6a,.5,.25);}return true;}
  // Biss-Ansturm über den Boden
  if(e.pm==='lunge'){const Lg=e.Lg;Lg.t+=dt;const st=17*K*dt;e.x+=Lg.dx*st;e.z+=Lg.dz*st;cvPush(e,e.d.rad);e.frame='a';e.anim+=st;
    if(!Lg.hit&&Math.hypot(P.x-e.x,P.z-e.z)<e.d.rad+1.2&&P.y<DG_Y+2.5){Lg.hit=1;takeDamage(30);P.poisonT=Math.max(P.poisonT||0,5);P.vx+=Lg.dx*10;P.vz+=Lg.dz*10;P.vy=5;try{Snd.hit('sword');}catch(_){}toast('Tarantula beißt zu!');}
    if(Lg.t>.75){e.pm='floor';trJump(e,trPerch(e,'far'));}return true;}
  const t=e.tgt,pin=Math.hypot(P.x-sp.cx,P.z-sp.cz)<sp.HR+9&&cvHere(P.y);
  // Ruhe-Animation am Sitzplatz
  e.frame=e.wind>0?(e.atkF||'c'):(Math.sin(time*2)>.6?1:0);
  if(e.wind>0){e.wind-=dt*K;if(e.wind<=0)trShoot(e,e.atkK);return true;}
  if(!t||!pin){e.awayT=(e.awayT||0)+dt;if(e.awayT>5&&e.hp<e.max)e.hp=Math.min(e.max,e.hp+e.max*.015*dt);if(e.pm!=='web'&&e.awayT>3){const w=trPerch(e,'any');if(w&&w.kind==='web')trJump(e,w);}return true;}
  e.awayT=0;if(!e.met){e.met=1;showArea('Tarantula');try{Snd.demonRoar(1.8,1.2);}catch(_){}toast('Im Netz über dir regt sich etwas Riesiges …');C.move=4;}
  const d=Math.hypot(P.x-e.x,P.z-e.z),dy=Math.abs((P.y)-(e.pm==='web'?e.y+e.h:e.y)),see=cvLOS(e.x,e.z,P.x,P.z,.55);
  // Auf dem Boden: zubeißen und wieder weg
  if(e.pm==='floor'){e.floorT=(e.floorT||0)+dt;if(see&&d<15&&C.bite<=0){C.bite=4;const l=d||1;e.pm='lunge';e.Lg={dx:(P.x-e.x)/l,dz:(P.z-e.z)/l,t:0,hit:0};try{Snd.demonRoar(1.5,.7);}catch(_){}return true;}if(e.floorT>3){trJump(e,trPerch(e,'far'));return true;}}
  // Zu nah? Erst beißen, dann Abstand
  if(d<6.5&&dy<4.5){e.closeT=(e.closeT||0)+dt;if(d<e.d.rad+1.6&&C.bite<=0){C.bite=2.2;e.frame='a';takeDamage(26);P.poisonT=Math.max(P.poisonT||0,4);P.vx+=(P.x-e.x)*3;P.vz+=(P.z-e.z)*3;try{Snd.hit('sword');}catch(_){}}
    if(e.closeT>.8/K){e.closeT=0;trJump(e,trPerch(e,'far'));return true;}}else e.closeT=0;
  if(see){e.hideT=0;if(C.egg<=0&&sp.eggs<6){C.egg=(rage?14:20)+Math.random()*6;e.frame='c';spLayEgg(e.x,e.pm==='web'?e.y+e.h*.4:e.y+.5,e.z,rage?3:2);toast('Tarantula legt Eier!');}
    else if(C.acid<=0){C.acid=(rage?5:7)+Math.random()*3;e.wind=.8;e.atkK='acid';}else if(C.web<=0){C.web=(rage?4:5.5)+Math.random()*2;e.wind=.5;e.atkK='web';}else if(C.poi<=0){C.poi=(rage?2.6:3.6)+Math.random()*1.5;e.wind=.55;e.atkK='poi';}}
  else{e.hideT=(e.hideT||0)+dt;if(e.hideT>8&&C.egg<=0&&sp.eggs<6){C.egg=16;const cv=sp.crev.reduce((a,b)=>Math.hypot(b.x-P.x,b.z-P.z)<Math.hypot(a.x-P.x,a.z-P.z)?b:a,sp.crev[0]);const ix=sp.cx+(cv.x-sp.cx)*.86,iz=sp.cz+(cv.z-sp.cz)*.86;spLayEgg(ix,DG_Y+8,iz,2);}if(C.move>2)C.move=2;}
  if(C.move<=0){C.move=(rage?4.5:7)+Math.random()*5;trJump(e,trPerch(e,'any'));}
  return true;}
// ---------- Takt: Säure, Netz unter der Leiche, Schüsse gegen Fels ----------
function spTick(dt){if(!CV.on||CV.lvl!==2||!DGX.on)return;
  for(let i=SPW.pools.length-1;i>=0;i--){const p=SPW.pools[i];p.t-=dt;p.m.material.opacity=.55*Math.min(1,p.t/1.5);if(Math.random()<dt*6)spawnParticle(p.x+(Math.random()-.5)*3,(cvFloor(p.x,p.z)||DG_Y)+.15,p.z+(Math.random()-.5)*3,0,.6,0,0xd0ff50,.6,.14);
    if(Math.hypot(P.x-p.x,P.z-p.z)<2.1&&P.y<(cvFloor(p.x,p.z)||DG_Y)+.6&&state==='playing'){p.tick-=dt;if(p.tick<=0){p.tick=.5;takeDamage(4);if(!SPW.acidTip){SPW.acidTip=1;toast('Säure! Raus da!');}}}
    if(p.t<=0){DGX.grp&&DGX.grp.remove(p.m);p.m.geometry.dispose();SPW.pools.splice(i,1);}}
  for(const s of SHOTS)if(s.fac==='demon'&&cvDist(s.x,s.z)<.3&&s.y<DG_Y+40)s.t=s.life+1;
  const S=CV.sp&&CV.sp.stair,bb=DGX.tw&&DGX.tw.boss;if(S&&bb&&bb.dead){if(!S.on){S.on=true;S.t=0;S.g.visible=true;for(const q of S.steps)q.m.scale.setScalar(.01);setTimeout(()=>toast('Die Felsen grollen … Stufen schieben sich aus der Wand, hinauf zu einem hellen Licht.'),2500);try{Snd.boom(.3);}catch(_){}}
    if(S.t<S.steps.length*.15+1){S.t+=dt;S.steps.forEach((q,i)=>{const k=clamp((S.t-i*.15)/.5,0,1);if(k>0){q.m.scale.setScalar(Math.max(.01,k));if(k>=1&&q.sl.off){q.sl.off=false;if(Math.hypot(P.x-q.sl.x,P.z-q.sl.z)<12)try{Snd.thud();}catch(_){}}}});}
    if(state==='playing'&&Math.hypot(P.x-S.top.x,P.z-S.top.z)<2.6&&Math.abs(P.y-S.top.y)<2.5&&!S.go){S.go=1;const fl=$('wxFlash');if(fl){fl.style.transition='opacity .6s';fl.style.opacity=1;}setTimeout(()=>{if(fl){fl.style.opacity=0;}twlEnter(3);},650);}}
  const b=DGX.tw&&DGX.tw.boss;if(b&&b.dead&&b.ownY){b.vy=(b.vy||0)-24*dt;b.y=Math.max(DG_Y,b.y+b.vy*dt);b.rot=0;b.yo=0;if(b.y<=DG_Y)b.ownY=0;}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{spTick(dt);}catch(e){if(!spTick.err){spTick.err=1;console.error('Spinnenebene',e);}}};}
{const a=dgFree;dgFree=function(){a();SPW.webs.length=0;SPW.pools.length=0;P.webT=0;P.webStick=0;};}
// ---------- Ebene 2 eintragen ----------
TOWER_LEVELS[1]={n:'Das Spinnennest',d:'Ein Labyrinth aus Gängen um einen riesigen Hohlraum. Dort lauert Tarantula.',cave:1,W:CV_N-1,far:96,near:18,hemi:.12,bbl:1,fogC:[.13,.11,.085],
  build(K){cvBuild(K,2,CV_L2);},enter(){TOWER_LEVELS[0].enter();}};
// =========================================================
// 0.0.126 · Tarantula neu: lila, 6 kleine und 2 große Augen (blinzelt), Beine lassen sich abschlagen
// =========================================================
const TRN_LOST=[[-1,1],[1,2],[-1,3],[1,0]];
function trnDraw(f,lost,blink){const W=168,H=112,p=new Px(W,H),cx=84,gr=H-2,B=pal(['#14081e','#24103a','#381a56','#4e2876','#683a96','#8a52b8']),A=pal(['#10061a','#1e0c32','#30164c','#46226a','#5e3488']),L=pal(['#100616','#200e2c','#341846','#4a2664','#623882']),
    J=hex('#a070d0'),BD=hex('#c47ae8'),HA=hex('#9a78c0'),PT=hex('#d890ff'),ICH=hex('#7aff4a'),raise=f==='a',spit=f==='c',jump=f==='j';
  const ell=(x0,y0,rx,ry,pl,b=.6)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;if(hash2(x,y,301)<.07){p.set(x,y,HA);continue;}p.set(x,y,pl[shadeIdx(b-dx*.25-dy*.32+(hash2(x>>1,y>>1,302)-.5)*.14,pl.length,x,y)]);}};
  const seg=(x0,y0,x1,y1,w0,w1,pl)=>{const Ln=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/Ln,ny=(x1-x0)/Ln,n=Math.ceil(Ln*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=w0+(w1-w0)*q;for(let k=-w/2;k<=w/2;k+=.5)p.set(X+nx*k,Y+ny*k,pl[shadeIdx(.62-k/w*.55,pl.length,Math.round(X),Math.round(Y))]);
      if(t%3===0&&hash2(Math.round(X),Math.round(Y),303)<.5)p.set(X+nx*(w/2+1),Y+ny*(w/2+1),HA);}};
  const joint=(x,y,r)=>{for(let a=0;a<12;a++)p.set(x+Math.cos(a/12*6.283)*r,y+Math.sin(a/12*6.283)*r,J);};
  const ab={x:cx,y:H*.32-(spit?3:0),rx:W*.19,ry:H*.29},ce={x:cx,y:H*.6,rx:W*.13,ry:H*.16};
  const LP=[[[.1,-.2],[.16,.36],[.13,.72],[.11,1]],[[.11,-.3],[.3,.18],[.34,.62],[.33,1]],[[.11,.1],[.4,.12],[.44,.58],[.43,1]],[[.1,.45],[.46,.26],[.49,.66],[.48,1]]];
  const lostSet=TRN_LOST.slice(0,lost).map(([s,i])=>s+':'+i);
  const leg=(s,i)=>{const P0=LP[i],hx=cx+s*W*P0[0][0],hy=ce.y+P0[0][1]*ce.ry,ph=((f===1&&i%2===0)||(f===2&&i%2===1))?H*.05:0;
    let k=[cx+s*W*P0[1][0],H*P0[1][1]-ph],a=[cx+s*W*P0[2][0],H*P0[2][1]-ph],ft=[cx+s*W*P0[3][0],gr-ph];
    if(jump){k=[cx+s*W*(P0[1][0]*.85),H*.34];a=[cx+s*W*(P0[2][0]*.8),H*.6];ft=[cx+s*W*(P0[3][0]*.7),H*.78];}
    if(raise&&i===0){k=[cx+s*W*.17,H*.02];a=[cx+s*W*.11,H*.1];ft=[cx+s*W*.06,H*.26];}
    if(lostSet.includes(s+':'+i)){const sx=hx+(k[0]-hx)*.32,sy=hy+(k[1]-hy)*.32;seg(hx,hy,sx,sy,7,6,L);for(let q=0;q<4;q++)p.set(sx+(q%2),sy+q,ICH);p.set(sx-1,sy,ICH);return;}
    seg(hx,hy,k[0],k[1],7,6,L);joint(k[0],k[1],2.6);seg(k[0],k[1],a[0],a[1],6,4.5,L);joint(a[0],a[1],2);seg(a[0],a[1],ft[0],ft[1],4.5,2.5,L);
    const bx=k[0]+(a[0]-k[0])*.45,by=k[1]+(a[1]-k[1])*.45;seg(bx,by,bx+(a[0]-k[0])*.1,by+(a[1]-k[1])*.1,6.5,6,pal(['#9a52c8','#c47ae8','#e0a8ff']));};
  for(const i of[3,2])for(const s of[-1,1])leg(s,i);
  // Hinterleib mit Muster
  ell(ab.x,ab.y,ab.rx,ab.ry,A,.62);for(let k=0;k<5;k++){const y=Math.round(ab.y-ab.ry*.7+k*ab.ry*.32),w=Math.round(ab.rx*(.42-k*.07));for(let x=-w;x<=w;x++){if(Math.abs(x)>w-3||k===0)p.set(cx+x,y,PT);}}
  for(let y=Math.round(ab.y-ab.ry*.85);y<ab.y+ab.ry*.6;y++)if(y%3)p.set(cx,y,PT);for(const s of[-1,1])for(let k=0;k<4;k++)p.set(cx+s*(ab.rx*.55),ab.y-ab.ry*.4+k*6,PT);
  for(const i of[1,0])for(const s of[-1,1])leg(s,i);
  // Kopfbrust mit Furchen
  ell(ce.x,ce.y,ce.rx,ce.ry,B,.68);for(let a=0;a<8;a++){const q=a/8*Math.PI*2;for(let r=4;r<ce.rx*.85;r+=1.5)p.set(cx+Math.cos(q)*r,ce.y+2+Math.sin(q)*r*.6,B[1]);}
  // Taster und Kieferklauen
  for(const s of[-1,1]){seg(cx+s*8,ce.y+ce.ry*.5,cx+s*15,ce.y+ce.ry*1.15,4,3,L);const kx=cx+s*6,ky=ce.y+ce.ry*.85;ell(kx,ky,6,8.5,pal(['#0a0410','#1a0a26','#2e1444','#44205e']),.5);p.set(kx+s,ky-4,BD);
    const op=raise?3:0;for(let k=0;k<7;k++)p.set(kx+s*(op*.6+k*.15)-s*k*.35,ky+7+k,k<5?hex('#2a1a24'):hex('#e8d8c8'));}
  if(spit){const G=hex('#c8ff40');for(let k=0;k<6;k++)p.set(cx-1+(k%3),ce.y+ce.ry*1.5+(k>>1),G);}
  // Augen: 2 große (blinzeln) und 6 kleine
  const ey=Math.round(ce.y-ce.ry*.3);for(const s of[-1,1]){const ex=cx+s*6;if(blink){for(let x=-4;x<=4;x++){p.set(ex+x,ey,hex('#2a1040'));p.set(ex+x,ey-1,B[4]);p.set(ex+x,ey+1,B[3]);}}
    else{for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++){const d=Math.hypot(x,y);if(d>4.3)continue;p.set(ex+x,ey+y,d>3.3?hex('#ff3050'):hex(d<1.6?'#3a0a14':'#1a0410'));}p.set(ex-1,ey-2,hex('#ffffff'));p.set(ex-2,ey-2,hex('#ffffff'));p.set(ex-1,ey-1,hex('#ffd0e0'));}}
  for(const[dx,dy]of[[-13,-1],[13,-1],[-10,-7],[10,-7],[-4,-10],[4,-10]]){p.set(cx+dx,ey+dy,hex('#ff4060'));p.set(cx+dx+1,ey+dy,hex('#ff4060'));p.set(cx+dx,ey+dy-1,hex('#ffb0c0'));}
  outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(let l=0;l<=4;l++)for(const f of[0,1,2,'a','c','j']){list.push(['trn'+l+'_'+f,trnDraw(f,l,false)]);if(f!=='j')list.push(['trn'+l+'_'+f+'b',trnDraw(f,l,true)]);}}catch(e){console.error('Tarantula neu',e);}};}
DT.tarantula.spr='trn0_';DT.tarantula.h=5;DT.tarantula.name='Tarantula';
// Blinzeln, Beine abschlagen
{const a0=trAI;trAI=function(e,dt){const r=a0(e,dt);e.blT=(e.blT==null?3:e.blT)-dt;if(e.blT<0){if(e.blT<-.17)e.blT=2+Math.random()*4.5;else if(!e.dead&&(e.frame===0||e.frame===1||e.frame===2||e.frame==='a'||e.frame==='c'))e.frame=e.frame+'b';}return r;};}
{const a0=trJump;trJump=function(e,p){if(p&&p.kind==='web'&&(e.lost||0)>=3){p=trPerch(e,'far');if(p&&p.kind==='web')return;}a0(e,p);if(e.J)e.J.T*=1+(e.lost||0)*.12;};}
function trHurt(e,n,by){if(by==='player'&&!e.dead&&Math.hypot(P.x-e.x,P.z-e.z)<e.d.rad+5&&Math.abs(P.y-(e.y+(e.pm==='web'?e.h:0)))<8.5){e.legDmg=(e.legDmg||0)+n;if(e.legDmg>=520&&(e.lost||0)<4){e.legDmg=0;trSever(e);}}}
function trSever(e){e.lost=(e.lost||0)+1;const k='trn'+e.lost+'_';if(SPR[k+'0'])e.d.spr=k;const[s,i]=TRN_LOST[e.lost-1],side=s;
  toast(['Ein Bein fliegt ab!','Noch ein Bein! Tarantula wankt.','Sie kreischt! Das dritte Bein ist ab, das Netz trägt sie nicht mehr.','Nur noch vier Beine! Sie schleppt sich nur noch.'][e.lost-1]);try{Snd.demonRoar(1.9,.9);Snd.hit('sword');}catch(_){}
  const hy=e.y+(e.pm==='web'?e.h*.5:e.h*.5),hx=e.x+side*2.2*Math.cos(P.yaw),hz=e.z-side*2.2*Math.sin(P.yaw);for(let k=0;k<40;k++)spawnParticle(hx,hy,hz,(Math.random()-.5)*5,Math.random()*4,(Math.random()-.5)*5,Math.random()<.6?0x7aff4a:0x4a2a66,.9,.3);
  const g=new THREE.Group(),M=new THREE.MeshLambertMaterial({color:0x3a1a52}),MB=new THREE.MeshLambertMaterial({color:0xb070e0});for(let q=0;q<3;q++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.22-q*.05,.26-q*.05,1.6,6),M);c.rotation.z=Math.PI/2;c.position.set(q*1.5-1.5,0,0);g.add(c);const j=new THREE.Mesh(new THREE.SphereGeometry(.24,6,4),MB);j.position.set(q*1.5-.75,0,0);g.add(j);}
  g.position.set(hx,hy,hz);g.rotation.y=Math.random()*6;if(DGX.grp)DGX.grp.add(g);SPW.legs.push({g,vy:3,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,rs:(Math.random()-.5)*8});
  if(e.lost>=3&&e.pm==='web'){e.cd2&&(e.cd2.move=0);}e.d.spd*=.9;}
SPW.legs=[];
{const a=dgFree;dgFree=function(){a();SPW.legs=[];if(SPW.wsnd){try{SPW.wsnd.s.stop();SPW.wsnd.g.disconnect();}catch(e){}SPW.wsnd=null;}};}
// Wasserfälle: Textur fließt, Gischt, Rauschen; abgeschlagene Beine fallen
function spTick2(dt){if(!CV.on||CV.lvl!==2||!DGX.on||!CV.sp)return;const sp=CV.sp;
  if(sp.wtex)sp.wtex.offset.y+=dt*1.7;let nd=1e9;for(const f of sp.falls||[]){const d=Math.hypot(P.x-f.x,P.z-f.z);if(d<nd)nd=d;if(d<60&&Math.random()<dt*12)spawnParticle(f.x+(Math.random()-.5)*f.w,DG_Y+.3,f.z+(Math.random()-.5)*f.w,(Math.random()-.5)*2,1+Math.random()*1.5,(Math.random()-.5)*2,0xe8f6ff,.7,.22);
    if(d<60&&Math.random()<dt*3)spawnParticle(f.x,f.top-Math.random()*(f.top-DG_Y),f.z,(Math.random()-.5)*.6,-1,(Math.random()-.5)*.6,0xd8eeff,.6,.15);}
  const c=Snd.ctx;if(c&&typeof envNoise==='function'&&(sp.falls||[]).length){if(!SPW.wsnd){const s=c.createBufferSource();s.buffer=envNoise('pink');s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;f.Q.value=.4;const g=c.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(Snd.envG||Snd.sfx);s.start();SPW.wsnd={s,g};}
    SPW.wsnd.g.gain.setTargetAtTime(P.y<DG_Y+40?Math.pow(clamp(1-nd/45,0,1),2)*.32:0,c.currentTime,.4);}
  for(const L of SPW.legs){if(L.rest)continue;L.vy-=22*dt;L.g.position.x+=L.vx*dt;L.g.position.z+=L.vz*dt;L.g.position.y+=L.vy*dt;L.g.rotation.y+=L.rs*dt;const g=(cvFloor(L.g.position.x,L.g.position.z)||DG_Y)+.25;if(L.g.position.y<=g){L.g.position.y=g;L.rest=1;try{Snd.thud();}catch(_){}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{spTick2(dt);}catch(e){if(!spTick2.err){spTick2.err=1;console.error('Spinnenebene 2',e);}}};}
