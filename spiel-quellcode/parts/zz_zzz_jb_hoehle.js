/* =========================================================
   0.0.122 · Ebene 1 des Großen Turms: Die Kalte Tiefe
   - Ein Aufzug bringt dich hinab in ein Felsenlabyrinth aus kaltem, grauem Stein (leicht bläulich/lila).
   - Gänge etwa 7 m breit und 4 m hoch (mal mehr, mal weniger), viele Verzweigungen, Sackgassen, Höhlenkammern.
   - Gewöhnliche Monster warten in den Kammern. Sie sehen schlecht: erst ab etwa 12 m und nur mit freier Sicht.
   - Am Ende: die Halle des Minotaurus (5000 LP, großes Schwert, Hieb, Schmetterschlag, Rundumschlag, Ansturm).
     Beim Ansturm rennt er stur geradeaus. Wer ausweicht, entkommt. Kracht er gegen Fels, ist er kurz benommen.
   ========================================================= */
const CV={on:false};
const cvN=(x,z,s)=>vnoise(x,z,s);
// ---------- Bilder: der Minotaurus ----------
function cvMino(f){const W=136,H=132,p=new Px(W,H),cx=68,oy=20;
  const F=pal(['#24120a','#3a2014','#53321f','#6e462c','#8a5e3c']),M=pal(['#120804','#22120a','#341e12']),Mu=pal(['#4a3430','#6a4c44','#8a6a5e']),
    Hn=pal(['#5a4a32','#8a7a5a','#b8a882','#e0d4b2','#f6eed8']),St=pal(['#1e2228','#363e48','#5a6470','#8a96a4','#c4ced8','#eef4fa']),Le=pal(['#1e1208','#36220f','#52361a']),Go=hex('#e8b830'),Ey=hex('#ff3a18'),Ey2=hex('#ffd0a0'),DK=hex('#0e0806');
  const ell=(x0,y0,rx,ry,pl,b=.6)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;p.set(x,y,pl[shadeIdx(b-dx*.3-dy*.22+(hash2(x>>1,y>>1,77)<.1?-.2:0),pl.length,x,y)]);}};
  const limb=(x0,y0,x1,y1,w0,w1,pl,b=.6)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=w0+(w1-w0)*q;for(let o=-w/2;o<=w/2;o+=.5)p.set(X+nx*o,Y+ny*o,pl[shadeIdx(b-o/w*.55,pl.length,Math.round(X+nx*o),Math.round(Y+ny*o))]);}};
  const blade=(x0,y0,x1,y1,w)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,ww=q>.86?w*(1-(q-.86)/.14):w;
      for(let o=-ww/2;o<=ww/2;o+=.5){const e=o/(ww/2||1);p.set(X+nx*o,Y+ny*o,e>.6?St[5]:e<-.6?St[1]:Math.abs(e)<.18&&q<.8?St[2]:St[e>0?4:3]);}}
    // Parierstange, Griff, Knauf
    for(let o=-7;o<=7;o+=.5){p.set(x0+nx*o,y0+ny*o,St[o>0?3:2]);p.set(x0+nx*o-(x1-x0)/L,y0+ny*o-(y1-y0)/L,St[1]);}
    for(let t=1;t<7;t++){const X=x0-(x1-x0)/L*t,Y=y0-(y1-y0)/L*t;p.set(X,Y,Le[t%2?1:2]);p.set(X+nx,Y+ny,Le[0]);}
    const kx=x0-(x1-x0)/L*7.5,ky=y0-(y1-y0)/L*7.5;ell(kx,ky,1.8,1.8,[Go,Go,hex('#fff0a0')],.7);};
  const streak=(pts)=>{for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1],n=Math.ceil(Math.hypot(c-a,d-b));for(let t=0;t<=n;t++)if(hash2(i,t,5)<.7)p.set(a+(c-a)*t/n,b+(d-b)*t/n,hex(t%3?'#b8c8dc':'#e8f0fa'));}};
  const fist=(x,y)=>{ell(x,y,4.5,4,F,.5);p.set(x-2,y-1,F[0]);p.set(x+1,y-1,F[0]);};
  const ram=f==='r',lL=f===1?3:0,rL=f===2?3:0;
  // Kopf
  const head=(hx,hy,tilt)=>{
    for(const s of[-1,1]){const pts=ram?[[hx+s*8,hy-4],[hx+s*15,hy-6],[hx+s*21,hy-7],[hx+s*26,hy-9],[hx+s*29,hy-12]]:[[hx+s*8,hy-6],[hx+s*15,hy-9],[hx+s*21,hy-14],[hx+s*23,hy-20],[hx+s*22,hy-25]];
      for(let i=0;i<pts.length-1;i++)limb(pts[i][0],pts[i][1]+(tilt&&s>0?2:0),pts[i+1][0],pts[i+1][1]+(tilt&&s>0?2:0),5-i*1.1,4-i*1.1,Hn,.45+i*.12);}
    for(const s of[-1,1]){ell(hx+s*12,hy-2+(ram?2:0),4,2.2,F,.55);p.set(hx+s*12,hy-2+(ram?2:0),Mu[2]);}
    ell(hx,hy,10,10,F,.62);ell(hx,hy-7,7,3,M,.5);for(let k=0;k<9;k++)p.set(hx-4+k,hy-9-(k%3===1?1:0),M[k%2]);
    const my=hy+(ram?7:9);ell(hx,my,7,5.5,Mu,.62);p.set(hx-3,my+1,DK);p.set(hx-3,my+2,DK);p.set(hx+3,my+1,DK);p.set(hx+3,my+2,DK);
    for(let a=0;a<12;a++){const q=a/11*Math.PI;p.set(hx+Math.cos(q)*2.6,my+4+Math.sin(q)*2.4,Go);}
    for(const s of[-1,1]){const ex=hx+s*5,ey=hy-1+(tilt&&s>0?1:0);p.set(ex,ey,Ey);p.set(ex+s,ey,Ey);p.set(ex,ey-1,M[0]);p.set(ex+s,ey-1,M[0]);p.set(ex-s,ey-1,M[0]);p.set(ex+(s<0?1:0)-.5,ey,Ey2);}
    if(ram)for(let k=0;k<6;k++){p.set(hx-6-k,my+2+(k>>1),hex('#dfe6ee'));p.set(hx+6+k,my+2+(k>>1),hex('#dfe6ee'));}};
  // Waffe (je nach Bild hinter oder vor dem Körper)
  const sw={0:[cx+31,oy+77,cx+46,oy+110],1:[cx+31,oy+76,cx+47,oy+108],2:[cx+31,oy+78,cx+45,oy+111],k:[cx+31,oy+77,cx+44,oy+110],
    w:[cx+2,oy+6,cx-36,oy-16],a:[cx+2,oy+64,cx-44,oy+106],q:[cx-30,oy+54,cx-66,oy+44],s:[cx+44,oy+54,cx+67,oy+60],r:[cx+33,oy+74,cx+50,oy+96]}[f]||[cx+31,oy+77,cx+46,oy+110];
  const behind=f==='w'||f==='r'||f==='q';
  if(behind)blade(sw[0],sw[1],sw[2],sw[3],6);
  // Beine
  const leg=(s,lift)=>{const x=cx+s*10;limb(x,oy+76,x+s*2,oy+92-lift,12,10,F,.6);limb(x+s*2,oy+92-lift,x,oy+106-lift,9,7,F,.55);ell(x,oy+104-lift,5,3,M,.5);ell(x,oy+109-lift,5.5,2.6,M,.3);p.set(x,oy+110-lift,DK);};
  leg(-1,lL);leg(1,rL);
  // Rumpf
  const ty=ram?oy+48:oy+52;
  ell(cx,ty,21,17,F,.62);ell(cx-9,ty-6,9,6,F,.78);ell(cx+9,ty-6,9,6,F,.74);for(let k=0;k<3;k++){p.set(cx-3,ty+2+k*4,F[1]);p.set(cx+3,ty+2+k*4,F[1]);p.set(cx,ty+3+k*4,F[1]);}
  ell(cx,ram?oy+30:oy+34,ram?16:13,ram?9:7,M,.55);
  // Gurt quer über die Brust mit Nieten
  limb(cx-20,ty-14,cx+16,ty+14,3.5,3.5,Le,.6);for(let k=0;k<5;k++)p.set(cx-16+k*7.5,ty-11+k*5.8,St[4]);
  // Schulterpanzer
  ell(cx-23,ty-13,9,6,St,.72);for(let k=-8;k<=8;k++)p.set(cx-23+k,ty-8,St[1]);p.set(cx-23,ty-15,St[5]);p.set(cx-26,ty-14,St[5]);
  // Gürtel und Lederschurz
  for(let x=cx-19;x<=cx+19;x++)for(let y=oy+66;y<=oy+69;y++)p.set(x,y,Le[y===oy+66?2:1]);ell(cx,oy+67.5,3,2.4,[Go,Go,hex('#fff0a0')],.6);
  for(let s=-4;s<=4;s++){const x0=cx+s*4.4;for(let y=oy+70;y<=oy+83-(Math.abs(s)>3?3:0);y++)for(let x=x0-1.6;x<=x0+1.6;x++)p.set(x,y,Le[shadeIdx(.6-(x-x0)/4-(y>oy+80?.2:0),3,Math.round(x),y)]);}
  // Arme
  const arm=(sx,sy,ex,ey,hx,hy,brace)=>{limb(sx,sy,ex,ey,10,9,F,.62);limb(ex,ey,hx,hy,9,7,F,.55);if(brace){const L=Math.hypot(hx-ex,hy-ey);limb(ex+(hx-ex)*.35,ey+(hy-ey)*.35,ex+(hx-ex)*.8,ey+(hy-ey)*.8,9,8,St,.55);}fist(hx,hy);};
  const sy=ty-12;
  if(f==='w'){arm(cx-22,sy,cx-20,oy+22,cx-1,oy+6,true);arm(cx+22,sy,cx+20,oy+22,cx+4,oy+6,true);}
  else if(f==='a'){arm(cx-22,sy,cx-16,ty+2,cx-1,oy+63,true);arm(cx+22,sy,cx+16,ty+2,cx+4,oy+64,true);}
  else if(f==='q'){arm(cx-22,sy,cx-28,ty+4,cx-30,oy+70,true);arm(cx+22,sy,cx+6,ty-2,cx-28,oy+55,true);}
  else if(f==='s'){arm(cx-22,sy,cx-28,ty+4,cx-30,oy+72,true);arm(cx+22,sy,cx+34,ty-6,cx+44,oy+54,true);}
  else if(f==='r'){arm(cx-21,oy+36,cx-30,oy+52,cx-32,oy+68,true);arm(cx+21,oy+36,cx+30,oy+52,cx+33,oy+72,true);}
  else{const sL=f===1?2:f===2?-2:0;arm(cx-22,sy,cx-29,oy+58+sL,cx-30,oy+74+sL,true);arm(cx+22,sy,cx+29,oy+58-sL,cx+31,oy+75-sL,true);}
  head(cx+(f==='k'?3:0),ram?oy+36:oy+18+(f==='k'?2:0),f==='k');
  if(!behind)blade(sw[0],sw[1],sw[2],sw[3],6);
  if(f==='a')streak([[cx+30,oy-4],[cx+12,oy+30],[cx-14,oy+70],[cx-44,oy+104]]);
  if(f==='s')streak([[cx-60,oy+48],[cx-30,oy+66],[cx,oy+72],[cx+34,oy+66],[cx+64,oy+54]]);
  outline(p);
  if(f==='k'){const star=(x,y)=>{const c=hex('#ffe060');p.set(x,y,hex('#fffbe0'));p.set(x-1,y,c);p.set(x+1,y,c);p.set(x,y-1,c);p.set(x,y+1,c);};star(cx-14,oy-4);star(cx+14,oy-1);star(cx+1,oy-9);}
  return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const f of[0,1,2,'a','w','q','s','r','k'])list.push(['mino_'+f,cvMino(f)]);list.push(['orb_rock',drawOrb(['#22242c','#3c404c','#5c6270','#848a98','#a8aebc'],12)]);}catch(e){console.error('Minotaurus: Bilder',e);}};}
DT.minotaur={name:'Der Minotaurus',fac:'demon',boss:1,h:5.3,hp:5000,dmg:22,spd:3.3,reach:3.7,cd:1.5,wind:.55,spr:'mino_',xp:2200,rad:1.35,aggro:26,leash:46,tint:1.05,
  loot:[['coin',4,1],['silver',45,1],['hpot2',2,1],['meat',4,1]]};
// ---------- Grundriss ----------
const CV_N=237,CV_C=118;
function cvGen(seed){const r=mulberry32(seed>>>0),N=CV_N,C=CV_C,open=new Uint8Array(N*N),HL=new Float32Array(N*N);
  const put=(lx,lz,rad,h)=>{const i0=Math.max(2,Math.floor(lx+C-rad)),i1=Math.min(N-3,Math.ceil(lx+C+rad)),j0=Math.max(2,Math.floor(lz+C-rad)),j1=Math.min(N-3,Math.ceil(lz+C+rad));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=i-C-lx,dz=j-C-lz;if(dx*dx+dz*dz<=rad*rad){const k=j*N+i;open[k]=1;if(h>HL[k])HL[k]=h;}}};
  const blob=(lx,lz,R,h,sd,amp)=>{const A=amp==null?.42:amp,i0=Math.max(2,Math.floor(lx+C-R*1.4)),i1=Math.min(N-3,Math.ceil(lx+C+R*1.4)),j0=Math.max(2,Math.floor(lz+C-R*1.4)),j1=Math.min(N-3,Math.ceil(lz+C+R*1.4));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=i-C-lx,dz=j-C-lz,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx),rr=R*(1-A/2+A*cvN(Math.cos(a)*1.6+sd*7.3,Math.sin(a)*1.6+sd*3.1,seed+41));if(d<=rr){const k=j*N+i;open[k]=1;if(h>HL[k])HL[k]=h;}}};
  const tunnel=(ax,az,bx,bz,sd,wMul)=>{const mx=(ax+bx)/2,mz=(az+bz)/2,L=Math.hypot(bx-ax,bz-az)||1,px=-(bz-az)/L,pz=(bx-ax)/L,off=(r()-.5)*Math.min(16,L*.45),qx=mx+px*off,qz=mz+pz*off,n=Math.ceil(L/.6);
    for(let t=0;t<=n;t++){const q=t/n,u=1-q,x=u*u*ax+2*u*q*qx+q*q*bx,z=u*u*az+2*u*q*qz+q*q*bz,w=(2.4+1.9*cvN(t*.6/6,sd*5.7,seed+43))*(wMul||1),h=3.6+1.1*cvN(t*.6/9,sd*3.9,seed+44);put(x,z,w,h);}};
  // Knoten im Raster (7 × 6), Startkammer im Süden, Halle des Minotaurus im Norden
  const CO=7,RO=6,nodes=[];for(let rw=0;rw<RO;rw++)for(let c=0;c<CO;c++){nodes.push({c,rw,x:-90+c*30+(r()-.5)*15,z:72-rw*26+(r()-.5)*(rw===RO-1?6:12),e:[]});}
  const nd=(c,rw)=>nodes[rw*CO+c],key=(a,b)=>a<b?a+','+b:b+','+a,ed=new Set();
  const st0=nd(3,0),vis=new Set([nodes.indexOf(st0)]),stack=[nodes.indexOf(st0)];
  while(stack.length){const k=stack[stack.length-1],n=nodes[k],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[n.c+a,n.rw+b]).filter(([a,b])=>a>=0&&b>=0&&a<CO&&b<RO&&!vis.has(b*CO+a));
    if(!nb.length){stack.pop();continue;}const[a,b]=nb[(r()*nb.length)|0],m=b*CO+a;vis.add(m);ed.add(key(k,m));stack.push(m);}
  for(let t=0,add=0;t<200&&add<9;t++){const k=(r()*nodes.length)|0,n=nodes[k],dir=r()<.5?[1,0]:[0,1],a=n.c+dir[0],b=n.rw+dir[1];if(a>=CO||b>=RO)continue;const m=b*CO+a,kk=key(k,m);if(ed.has(kk))continue;ed.add(kk);add++;}
  for(const kk of ed){const[a,b]=kk.split(',').map(Number);nodes[a].e.push(b);nodes[b].e.push(a);}
  // Entfernungen vom Start (für die Halle und die Truhen)
  const dist=new Map([[nodes.indexOf(st0),0]]),q=[nodes.indexOf(st0)];while(q.length){const k=q.shift();for(const m of nodes[k].e)if(!dist.has(m)){dist.set(m,dist.get(k)+1);q.push(m);}}
  let bossN=nd(3,RO-1);for(const c of[2,3,4]){const n=nd(c,RO-1);if(dist.get(nodes.indexOf(n))>dist.get(nodes.indexOf(bossN)))bossN=n;}
  const S={x:0,z:100},B={x:0,z:-93},BL={x:0,z:-108};
  // Gänge
  let sd=1;for(const kk of ed){const[a,b]=kk.split(',').map(Number);tunnel(nodes[a].x,nodes[a].z,nodes[b].x,nodes[b].z,sd++,1);}
  tunnel(S.x,S.z-4,st0.x,st0.z,sd++,1);tunnel(bossN.x,bossN.z,B.x+(bossN.x-B.x)*.15,-74,sd++,.85);
  // Kammern
  for(const n of nodes){const big=n!==st0&&n.rw<RO-1&&r()<.5;n.big=big;n.R=big?8+r()*3.5:4.5+r()*2;n.h=big?5.6+r()*1.6:4.4+r()*.6;blob(n.x,n.z,n.R,n.h,sd++);}
  // kurze Seitenarme mit Sackgassen
  const spurs=[];for(let t=0;t<9;t++){const n=nodes[(r()*nodes.length)|0];if(n===st0||n===bossN)continue;const a=r()*6.283,L=12+r()*7,x=n.x+Math.cos(a)*L,z=n.z+Math.sin(a)*L;if(Math.abs(x)>104||z>86||z<-66)continue;tunnel(n.x,n.z,x,z,sd++,.8);blob(x,z,3.6+r()*1.6,4,sd++);spurs.push({x,z});}
  // Startkammer mit Aufzugsschacht, Halle des Minotaurus mit Nische für den zweiten Aufzug
  blob(S.x,S.z,7.6,12,sd++,.18);blob(B.x,B.z,18.5,10.5,sd++,.12);blob(BL.x,BL.z,4.6,12,sd++,.08);
  // Felssäulen in der Halle
  for(const[px,pz]of[[-9,-86],[9,-86],[-10,-100],[10,-100]])for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){if(i*i+j*j>2.2*2.2)continue;open[(Math.round(pz)+C+j)*N+Math.round(px)+C+i]=0;}
  return{nodes,ed,dist,st0,bossN,S,B,BL,spurs,open,HL,r,keep:[{x:B.x,z:B.z,r:21}],Sopen:'n',BLopen:'s',BLn:[0,1]};}
// ---------- Bauen ----------
// Felstextur in Pixeloptik: Steinplatten mit Rissen, Körnung und Kanten
function cvRockTex(){const S=64,p=new Px(S,S),PT=[];const r=mulberry32(9311);for(let k=0;k<26;k++)PT.push([r()*S,r()*S,.78+r()*.3]);
  const L=pal(['#3e3e44','#4c4c52','#5a5a62','#6a6a72','#7a7a82','#8a8a92','#9c9ca4']);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let f1=1e9,f2=1e9,b=0;for(const[px,py,v]of PT)for(let oy=-S;oy<=S;oy+=S)for(let ox=-S;ox<=S;ox+=S){const d=Math.hypot(x-px-ox,y-py-oy);if(d<f1){f2=f1;f1=d;b=v;}else if(d<f2)f2=d;}
    const crack=f2-f1<1.6,edge=f2-f1<3.2,g=(hash2(x>>1,y>>1,51)-.5)*.16+(hash2(x,y,52)-.5)*.1;let v=b*.62+g-(f1/22)*.12;if(edge)v-=.1;if(crack)v=.08+hash2(x,y,53)*.06;
    p.set(x,y,L[shadeIdx(v,L.length,x,y)]);}
  const t=new THREE.CanvasTexture(p.done());t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapLinearFilter;return t;}
function cvMat(){if(CV.mat)return CV.mat;const m=new THREE.MeshPhongMaterial({map:cvRockTex(),vertexColors:true,shininess:6,specular:0x14161c});
  m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;')
      .replace('#include <project_vertex>','#include <project_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;')
      .replace('#include <map_fragment>',`vec3 bw=pow(abs(vWN),vec3(6.0));bw/=(bw.x+bw.y+bw.z+1e-4);
      vec3 t1=texture2D(map,vWP.zy*.26).rgb*bw.x+texture2D(map,vWP.xz*.26+.5).rgb*bw.y+texture2D(map,vWP.xy*.26+.25).rgb*bw.z;
      vec4 texelColor=mapTexelToLinear(vec4(t1*1.55,1.0));diffuseColor*=texelColor;`);};
  CV.mat=m;return m;}
// Gemeinsamer Höhlenbauer für alle Höhlen-Ebenen. cfg: gen, tint, glow, light, decor, populate, arrive
function cvBuild(K,lvl,cfg){cfg=cfg||CV_L1;const seed=((WSEED|0)^0x7a11c3)+lvl*977,G=cfg.gen(seed),N=CV_N,C=CV_C,{open,HL}=G,X=K.X,Z=K.Z,Y=DG_Y,ox=X-C,oz=Z-C;
  // Abstand jeder Ecke zum nächsten Fels (Chamfer 1 / 1,414)
  const d=new Float32Array(N*N);for(let k=0;k<N*N;k++)d[k]=open[k]?1e9:0;const D2=1.4142;
  for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const k=j*N+i;if(!d[k])continue;d[k]=Math.min(d[k],d[k-1]+1,d[k-N]+1,d[k-N-1]+D2,d[k-N+1]+D2);}
  for(let j=N-2;j>0;j--)for(let i=N-2;i>0;i--){const k=j*N+i;if(!d[k])continue;d[k]=Math.min(d[k],d[k+1]+1,d[k+N]+1,d[k+N+1]+D2,d[k+N-1]+D2);}
  // Raumhöhe weich verlaufen lassen
  let H=HL;for(let it=0;it<4;it++){const o=new Float32Array(N*N);for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const k=j*N+i;if(!open[k])continue;let s=0,c=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const q=k+b*N+a;if(open[q]){s+=H[q];c++;}}o[k]=s/c;}H=o;}
  const fy=new Float32Array(N*N),cy=new Float32Array(N*N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,hw=1.45+1.3*cvN(i*.21,j*.21,seed+5)+.35*cvN(i*.7,j*.7,seed+6);
    if(!open[k]){fy[k]=cy[k]=hw;continue;}fy[k]=0;const hh=Math.max(H[k],hw+1.2),PL=hh>9?2.6+(hh-7)*.5:2.6,t=clamp((d[k]-.6)/PL,0,1),v=1-(1-t)*(1-t);cy[k]=hw+(hh-hw)*v+(cvN(i*.33,j*.33,seed+7)-.5)*(hh>12?2.4:.9)*Math.min(1,d[k]/3);}
  if(cfg.shape)cfg.shape({G,N,C,open,d,fy,cy,seed});
  // Aufzugsschächte nach oben
  const shaft=(sx,sz)=>{sx=Math.round(sx);sz=Math.round(sz);for(let j=-6;j<=6;j++)for(let i=-6;i<=6;i++){const k=(sz+C+j)*N+sx+C+i,r=Math.hypot(i,j);if(r<=3.4)cy[k]=Math.max(cy[k],48);else if(r<=4.5)cy[k]=Math.max(cy[k],15);}};
  shaft(G.S.x,G.S.z);shaft(G.BL.x,G.BL.z);
  // Leuchtende Dinge (Kristalle, Pilze) färben den Fels ringsum
  const GC=cfg.glow,crys=[];{const r=mulberry32((seed^0x51c)>>>0);for(let t=0;t<5000&&crys.length<GC.n;t++){const i=2+((r()*(N-4))|0),j=2+((r()*(N-4))|0),k=j*N+i;if(!open[k]||d[k]<1||d[k]>1.6)continue;if(Math.hypot(i-C-G.S.x,j-C-G.S.z)<9)continue;if(crys.some(c=>Math.hypot(c.i-i,c.j-j)<GC.gap))continue;crys.push({i,j,v:r()<.55?0:1,s:.7+r()*.8,r});}}
  const tint=(i,j)=>cfg.tint(i,j,seed);
  const GL=new Float32Array(N*N*3);for(const c of crys)for(let b=-7;b<=7;b++)for(let a=-7;a<=7;a++){const i=c.i+a,j=c.j+b;if(i<0||j<0||i>=N||j>=N)continue;const dd=Math.hypot(a,b);if(dd>7)continue;const q=(1-dd/7)**2*.55*c.s,k3=(j*N+i)*3,A=GC.add[c.v];
    GL[k3]+=A[0]*q;GL[k3+1]+=A[1]*q;GL[k3+2]+=A[2]*q;}
  // Netze: Boden und Decke
  const mk=(ceil)=>{const pos=new Float32Array(N*N*3),col=new Float32Array(N*N*3);
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,k3=k*3,rock=!open[k];let jx=0,jz=0,jy=0;
      if(rock){jx=(cvN(i*.5,j*.5,seed+8)-.5)*.95;jz=(cvN(i*.5+9,j*.5,seed+9)-.5)*.95;jy=(cvN(i*.8,j*.8,seed+10)-.5)*.5;}else if(ceil){jx=(cvN(i*.6,j*.6,seed+14)-.5)*.5;jz=(cvN(i*.6,j*.6+7,seed+15)-.5)*.5;}
      pos[k3]=ox+i+jx;pos[k3+1]=Y+(ceil?cy[k]:fy[k])+jy;pos[k3+2]=oz+j+jz;
      const t=tint(i,j),dd=Math.min(d[k],6);let ao;if(rock)ao=.66;else if(ceil)ao=.56+.22*clamp(dd/4,0,1);else ao=.52+.48*clamp((dd-.4)/2.6,0,1);
      col[k3]=t[0]*ao;col[k3+1]=t[1]*ao;col[k3+2]=t[2]*ao;if(ceil&&cy[k]>40){col[k3]*=.35;col[k3+1]*=.35;col[k3+2]*=.4;}col[k3]+=GL[k3];col[k3+1]+=GL[k3+1];col[k3+2]+=GL[k3+2];}
    const idx=[];for(let j=0;j<N-1;j++)for(let i=0;i<N-1;i++){const a=j*N+i,b=a+1,c=a+N,e=c+1;if(!(open[a]||open[b]||open[c]||open[e]))continue;if(ceil)idx.push(a,b,c,b,e,c);else idx.push(a,c,b,b,c,e);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx),1));g.computeVertexNormals();
    const m=new THREE.Mesh(g,cvMat());m.frustumCulled=false;K.grp.add(m);return m;};
  mk(false);mk(true);
  // Zusammengeführte Kleinteile
  const parts=new Map();const part=(mat,geo,x,y,z,rx,ry,rz,sx,sy,sz,colr)=>{let L=parts.get(mat);if(!L)parts.set(mat,L=[]);const g=geo.clone();const m4=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0,'YXZ')),new THREE.Vector3(sx||1,sy||1,sz||1));g.applyMatrix4(m4);L.push([g,colr]);};
  const flush=()=>{for(const[mat,L]of parts){let n=0;const gs=L.map(([g,c])=>{const q=g.index?g.toNonIndexed():g;n+=q.attributes.position.count;return[q,c];});const pos=new Float32Array(n*3),nor=new Float32Array(n*3),col=new Float32Array(n*3);let o=0;
      for(const[q,c]of gs){pos.set(q.attributes.position.array,o*3);if(!q.attributes.normal)q.computeVertexNormals();nor.set(q.attributes.normal.array,o*3);for(let v=0;v<q.attributes.position.count;v++){col[(o+v)*3]=c?c[0]:1;col[(o+v)*3+1]=c?c[1]:1;col[(o+v)*3+2]=c?c[2]:1;}o+=q.attributes.position.count;}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,mat);m.frustumCulled=false;K.grp.add(m);}parts.clear();};
  const MB=c=>new THREE.MeshBasicMaterial({color:c,vertexColors:true}),GM=GC.cols.map(MB),RK=cvMat();
  const oct=new THREE.OctahedronGeometry(1,0),cone=new THREE.ConeGeometry(1,1,6,1),dod=new THREE.DodecahedronGeometry(1,0),cyl=new THREE.CylinderGeometry(1,1,1,6),cap=new THREE.SphereGeometry(1,8,4,0,6.283,0,1.6);
  const at=(i,j)=>[ox+i,oz+j],rnd=mulberry32((seed^0x9e3)>>>0);
  for(const c of crys){const[x,z]=at(c.i,c.j);let gx=0,gz=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!open[(c.j+b)*N+c.i+a]){gx+=a;gz+=b;}const n=3+((c.r()*3)|0);
    for(let t=0;t<n;t++){const x0=x+gx*.25+(c.r()-.5)*1.2,z0=z+gz*.25+(c.r()-.5)*1.2,y0=Y+fy[c.j*N+c.i],cl=[.75+c.r()*.3,.75+c.r()*.3,.85+c.r()*.15];
      if(GC.shape==='shroom'){const h=(.35+c.r()*.7)*c.s,w=(.18+c.r()*.22)*c.s;part(RK,cyl,x0,y0+h/2,z0,0,0,0,w*.32,h,w*.32,[.8,.76,.66]);part(GM[c.v],cap,x0,y0+h-.02,z0,0,c.r()*3,0,w,w*.6,w,cl);}
      else{const h=(1.1+c.r()*1.6)*c.s,w=.22+c.r()*.18;part(GM[c.v],oct,x0,y0+h*.35,z0,(c.r()-.5)*.7+gz*.35,c.r()*3,(c.r()-.5)*.7-gx*.35,w,h*.75,w,cl);}}}
  // Tropfsteine an der Decke, Stalagmiten und Felsbrocken am Boden
  const solids=[],keep=(i,j)=>!(G.keep||[]).some(q=>Math.hypot(i-C-q.x,j-C-q.z)<q.r);
  for(let t=0;t<9000;t++){const i=3+((rnd()*(N-6))|0),j=3+((rnd()*(N-6))|0),k=j*N+i;if(!open[k])continue;const[x,z]=at(i,j),tn=tint(i,j);
    if(d[k]>2.2&&rnd()<.045){const h=.6+rnd()*1.9,w=.18+rnd()*.3;part(RK,cone,x,Y+cy[k]-h/2+.1,z,Math.PI,rnd()*3,0,w,h,w,[tn[0]*.8,tn[1]*.8,tn[2]*.8]);}
    if(d[k]>3.5&&d[k]<6&&rnd()<.006&&Math.hypot(i-C-G.S.x,j-C-G.S.z)>10&&keep(i,j)){const h=1.2+rnd()*2.2,w=.45+rnd()*.35;part(RK,cone,x,Y+h/2-.05,z,0,rnd()*3,0,w,h,w,[tn[0]*.85,tn[1]*.85,tn[2]*.85]);solids.push([x,z,w*.75,h]);}
    if(d[k]>1&&d[k]<1.9&&rnd()<.03){const s=.35+rnd()*.7;part(RK,dod,x,Y+s*.55,z,rnd()*3,rnd()*3,rnd()*3,s,s*.75,s,[tn[0]*.75,tn[1]*.75,tn[2]*.75]);if(s>.6)solids.push([x,z,s*.8,s*1.1]);}}
  const ctx={K,G,X,Z,Y,N,C,ox,oz,open,d,fy,cy,part,flush,RK,rnd,at,tint,seed,lvl,geo:{oct,cone,dod,cyl,cap},solids};
  if(cfg.decor)cfg.decor(ctx);
  flush();
  for(const[x,z,r,h]of solids)DGX.sol.push(solAdd({x,z,hw:r,hd:r,y0:Y-1,y1:Y+h,rot:0,solid:1,dg:1}));
  // Aufzüge
  const WOOD=bMats().wood,IRON=new THREE.MeshLambertMaterial({color:0x34363c});
  const shaftFrame=(lx,lz)=>{for(const[a,b]of[[-2.55,-2.55],[2.55,-2.55],[-2.55,2.55],[2.55,2.55]]){K.mesh(new THREE.BoxGeometry(.35,46,.35),WOOD,lx+a,23,lz+b);}for(let y=4;y<46;y+=5){K.mesh(new THREE.BoxGeometry(5.4,.25,.25),WOOD,lx,y,lz-2.55);K.mesh(new THREE.BoxGeometry(5.4,.25,.25),WOOD,lx,y,lz+2.55);K.mesh(new THREE.BoxGeometry(.25,.25,5.4),WOOD,lx-2.55,y,lz);K.mesh(new THREE.BoxGeometry(.25,.25,5.4),WOOD,lx+2.55,y,lz);}
    for(const[a,b]of[[-2.55,-2.55],[2.55,-2.55],[-2.55,2.55],[2.55,2.55]])DGX.sol.push(solAdd({x:X+lx+a,z:Z+lz+b,hw:.25,hd:.25,y0:Y-1,y1:Y+30,rot:0,solid:1,dg:1}));};
  const cage=(lx,lz,openSide)=>{const g=new THREE.Group();const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);};
    add(new THREE.BoxGeometry(4.3,.4,4.3),WOOD,0,-.2,0);for(const[a,b]of[[-2.05,-2.05],[2.05,-2.05],[-2.05,2.05],[2.05,2.05]]){add(new THREE.BoxGeometry(.16,1.15,.16),IRON,a,.57,b);add(new THREE.BoxGeometry(.07,50,.07),IRON,a*.92,25.6,b*.92);}
    for(const s of['n','s','w','e']){if(s===openSide)continue;const along=s==='n'||s==='s',zz=s==='n'?-2.05:s==='s'?2.05:0,xx=s==='w'?-2.05:s==='e'?2.05:0;add(new THREE.BoxGeometry(along?4.2:.1,.1,along?.1:4.2),IRON,xx,1.1,zz);add(new THREE.BoxGeometry(along?4.2:.1,.08,along?.1:4.2),IRON,xx,.6,zz);}
    add(new THREE.BoxGeometry(4.3,.12,.5),IRON,0,.02,0);g.position.set(X+lx,Y,Z+lz);K.grp.add(g);return g;};
  shaftFrame(G.S.x,G.S.z);shaftFrame(G.BL.x,G.BL.z);
  const liftS=cage(G.S.x,G.S.z,G.Sopen||'n');cage(G.BL.x,G.BL.z,G.BLopen||'s');
  CV.lift={x:X+G.S.x,z:Z+G.S.z,y:0,mode:'idle',g:liftS};
  DGX.exit={x:X+G.S.x,z:Z+G.S.z};
  // Siegel vor dem oberen Aufzug (in Richtung des Raums)
  const n=G.BLn||[0,1],M=K.M,sx=G.BL.x+n[0]*5.2,sz=G.BL.z+n[1]*5.2,ry=Math.atan2(n[0],n[1]),seal=K.mesh(new THREE.PlaneGeometry(9.4,7),M.seal,sx,3.5,sz,ry),sS=solAdd({x:X+sx,z:Z+sz,hw:4.8,hd:.45,y0:Y-1,y1:Y+9,rot:-ry,solid:1,dg:1});DGX.sol.push(sS);
  for(const s of[-1,1]){K.mesh(new THREE.BoxGeometry(.25,.25,.25),M.rune,sx+Math.cos(ry)*s*4.6,6.8,sz-Math.sin(ry)*s*4.6);}
  DGX.tw={seal,sS,up:{x:X+G.BL.x,z:Z+G.BL.z},open:false,boss:null,lvl,t:0};
  // Licht
  const LI=cfg.light;const amb=new THREE.AmbientLight(LI[0],LI[1]);K.grp.add(amb);const dl=new THREE.DirectionalLight(LI[2],LI[3]);dl.position.set(X+30,Y+100,Z+20);dl.target.position.set(X,Y,Z);K.grp.add(dl);K.grp.add(dl.target);
  Object.assign(CV,{on:true,lvl,cfg,ox,oz,N,open,d,fy,cy,G,seed,crys:crys.map(c=>{const[x,z]=at(c.i,c.j);return{x,z,v:c.v};}),dripT:0});
  // Bewohner
  const R=mulberry32((seed^0x2b7)>>>0),spot=(lx,lz,rad,minD)=>{for(let t=0;t<60;t++){const a=R()*6.283,q=Math.sqrt(R())*rad,i=Math.round(lx+C+Math.cos(a)*q),j=Math.round(lz+C+Math.sin(a)*q);if(i<2||j<2||i>N-3||j>N-3)continue;const k=j*N+i;if(open[k]&&d[k]>=(minD||2))return[i-C,j-C];}return null;};
  Object.assign(ctx,{R,spot});cfg.populate(ctx);}
// ---------- Ebene 1: Einstellungen ----------
const CV_L1={gen:s=>cvGen(s),
  tint(i,j,seed){const a=cvN(i*.035,j*.035,seed+11),b=cvN(i*.05+40,j*.05,seed+12);let R=.63,Gc=.63,B=.62;
    if(a>.5){const q=(a-.5)*2;R-=.09*q;Gc-=.03*q;B+=.07*q;}if(b>.55){const q=(b-.55)*2.2;R+=.05*q;Gc-=.07*q;B+=.08*q;}const v=.86+.26*cvN(i*.45,j*.45,seed+13);return[R*v,Gc*v,B*v];},
  glow:{n:90,gap:9,shape:'oct',cols:[0x5ab4ff,0xa47cff],add:[[.18,.4,.8],[.42,.22,.75]],spark:[0x7ac8ff,0xb08aff]},
  light:[0xa4a4a8,.78,0xe4e4e8,.45],arrive:'Der Aufzug setzt mit einem Ruck auf. Kalter Fels, so weit das Auge reicht.',
  decor(c){const{G,X,Z,Y,part,rnd,geo}=c;const BONE=new THREE.MeshBasicMaterial({color:0xb8b0a0,vertexColors:true});for(let t=0;t<60;t++){const a=rnd()*6.283,rr=4+rnd()*13,x=X+G.B.x+Math.cos(a)*rr,z=Z+G.B.z+Math.sin(a)*rr*.85;part(BONE,new THREE.BoxGeometry(1,1,1),x,Y+.06,z,0,rnd()*3,0,.12,.1,.6+rnd()*.5,[.8+rnd()*.2,.8+rnd()*.2,.75+rnd()*.2]);if(rnd()<.25)part(BONE,geo.dod,x+.3,Y+.15,z,0,rnd()*3,0,.2,.18,.22,[.85,.82,.72]);}},
  populate(c){const{K,G,X,Z,Y,R,spot}=c;
    const POOL=[[3,[['usks',2],['uskb',1],['uskh',1]]],[2,[['usksa',1],['uskaa',1],['uskba',1]]],[3,[['kobold',4]]],[.6,[['kobold',3],['troll',1]]],[2.4,[['wolfd',3]]],[2.4,[['zombie',3]]],[1.6,[['hound',2]]],[2,[['uska',2],['zombie',1]]],[1.6,[['uskha',1],['usks',2]]],[1.2,[['imp',3]]]];
    const pick=()=>{let s=0;for(const[w]of POOL)s+=w;let q=R()*s;for(const[w,g]of POOL){q-=w;if(q<=0)return g;}return POOL[0][1];};
    const mob=(t,lx,lz)=>cvMob(t,X+lx,Z+lz,R);
    for(const n of G.nodes){if(n===G.st0)continue;const near=Math.hypot(n.x-G.S.x,n.z-G.S.z)<28;if(near)continue;
      if(n.big?R()<.82:R()<.3){const grp=n.big?pick():[[['usks','zombie','kobold','wolfd'][(R()*4)|0],1+((R()*2)|0)]],out=[];for(const[t,cnt]of grp)for(let k=0;k<cnt;k++){const s=spot(n.x,n.z,n.R*.6,2);if(!s)continue;const e=mob(t,s[0],s[1]);if(e)out.push(e);}for(const e of out)e.mates=out;}}
    for(let t=0;t<12;t++){const kk=[...G.ed][(R()*G.ed.size)|0].split(',').map(Number),a=G.nodes[kk[0]],b=G.nodes[kk[1]],q=.3+R()*.4,s=spot(a.x+(b.x-a.x)*q,a.z+(b.z-a.z)*q,5,2.4);if(!s||Math.hypot(s[0]-G.S.x,s[1]-G.S.z)<30)continue;mob(['usks','zombie','kobold','wolfd','uska','hound'][(R()*6)|0],s[0],s[1]);}
    const leaves=G.nodes.filter(n=>n.e.length===1&&n!==G.st0&&n!==G.bossN);let ci=0;for(const n of leaves.concat(G.spurs).slice(0,8)){const s=spot(n.x,n.z,3,1.8);if(s)K.chest(s[0],s[1],'c'+(ci++),false);}
    const b=spawnEnt('minotaur',X+G.B.x,Z+G.B.z+2,{home:{x:X+G.B.x,z:Z+G.B.z+2},cmd:1,cav:1,twl:1,mino:1});b.special=minoAI;b.y=Y;b.twBoss=1;DGX.ents.push(b);DGX.tw.boss=b;
    K.chest(G.B.x+5,G.BL.z+9,'boss',true);}};
function cvMob(t,x,z,R,o){if(!DT[t])return null;const e=spawnEnt(t,x,z,Object.assign({v:((R||Math.random)()*3)|0,home:{x,z},cmd:1,aggroT:0,cav:1,twl:1},o||{}));e.d=Object.assign({},e.d,{aggro:12,leash:28},(o&&o.dd)||{});if(t==='troll')e.special=mzTrollAI;e.y=DG_Y;DGX.ents.push(e);return e;}
// ---------- Abfragen auf dem Raster ----------
function cvIdx(x,z){const i=Math.round(x-CV.ox),j=Math.round(z-CV.oz);if(i<0||j<0||i>=CV.N||j>=CV.N)return-1;return j*CV.N+i;}
function cvDist(x,z){const k=cvIdx(x,z);return k<0?0:CV.d[k];}
function cvFloor(x,z){const fx=x-CV.ox,fz=z-CV.oz,i=Math.floor(fx),j=Math.floor(fz);if(i<0||j<0||i>=CV.N-1||j>=CV.N-1)return null;const u=fx-i,v=fz-j,N=CV.N,F=CV.fy,k=j*N+i;
  return DG_Y+(F[k]*(1-u)+F[k+1]*u)*(1-v)+(F[k+N]*(1-u)+F[k+N+1]*u)*v;}
function cvLOS(x0,z0,x1,z1,clr){const L=Math.hypot(x1-x0,z1-z0),n=Math.ceil(L/.5);for(let t=1;t<n;t++){const q=t/n;if(cvDist(x0+(x1-x0)*q,z0+(z1-z0)*q)<clr)return false;}return true;}
function cvPush(o,R){if(!CV.on)return false;const N=CV.N,fx=o.x-CV.ox,fz=o.z-CV.oz,i0=Math.floor(fx-R-.5),i1=Math.ceil(fx+R+.5),j0=Math.floor(fz-R-.5),j1=Math.ceil(fz+R+.5);let any=false;
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(i<0||j<0||i>=N||j>=N||CV.open[j*N+i])continue;const px=o.x-CV.ox,pz=o.z-CV.oz,cx=clamp(px,i-.5,i+.5),cz=clamp(pz,j-.5,j+.5),dx=px-cx,dz=pz-cz,d2=dx*dx+dz*dz;
    if(d2>=R*R)continue;if(d2>1e-8){const dd=Math.sqrt(d2),k=(R-dd)/dd;o.x+=dx*k;o.z+=dz*k;}else{const ax=px-i,az=pz-j;if(Math.abs(ax)>Math.abs(az))o.x+=(Math.sign(ax)*(.5+R)-ax);else o.z+=(Math.sign(az)*(.5+R)-az);}any=true;}
  return any;}
// Wegsuche auf einem groben Raster (2 m)
function cvAstar(x0,z0,x1,z1,rad){const S=2,CN=Math.floor(CV.N/S),need=Math.min(2.2,rad+.5),DD=CV.d,NN=CV.N,ok=(ci,cj)=>{if(ci<0||cj<0||ci>=CN||cj>=CN)return false;const k=(cj*S)*NN+ci*S;return Math.max(DD[k],DD[k+1],DD[k+NN],DD[k+NN+1])>=need;};
  const cell=(x,z)=>{let ci=Math.round((x-CV.ox)/S),cj=Math.round((z-CV.oz)/S);if(ok(ci,cj))return[ci,cj];for(let r=1;r<=3;r++)for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++)if(ok(ci+a,cj+b))return[ci+a,cj+b];return null;};
  const A=cell(x0,z0),B=cell(x1,z1);if(!A||!B)return null;const s=A[1]*CN+A[0],g=B[1]*CN+B[0];if(s===g)return[[x1,z1]];
  const gs=new Map([[s,0]]),from=new Map(),hp=[[0,s]],H=k=>Math.hypot(k%CN-B[0],((k/CN)|0)-B[1]),closed=new Set();
  const push=(f,k)=>{hp.push([f,k]);let i=hp.length-1;while(i>0){const p=(i-1)>>1;if(hp[p][0]<=hp[i][0])break;[hp[p],hp[i]]=[hp[i],hp[p]];i=p;}};
  const pop=()=>{const top=hp[0],last=hp.pop();if(hp.length){hp[0]=last;let i=0;for(;;){const l=i*2+1,r=l+1;let m=i;if(l<hp.length&&hp[l][0]<hp[m][0])m=l;if(r<hp.length&&hp[r][0]<hp[m][0])m=r;if(m===i)break;[hp[m],hp[i]]=[hp[i],hp[m]];i=m;}}return top;};
  let it=0,found=false;while(hp.length&&it++<9000){const[,k]=pop();if(k===g){found=true;break;}if(closed.has(k))continue;closed.add(k);const ci=k%CN,cj=(k/CN)|0;
    for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){if(!a&&!b)continue;const ni=ci+a,nj=cj+b;if(!ok(ni,nj))continue;if(a&&b&&!(ok(ci+a,cj)&&ok(ci,cj+b)))continue;const nk=nj*CN+ni,ng=gs.get(k)+(a&&b?1.414:1);if(ng<(gs.has(nk)?gs.get(nk):1e9)){gs.set(nk,ng);from.set(nk,k);push(ng+H(nk),nk);}}}
  if(!found)return null;const path=[];let k=g;while(k!==s&&k!=null){path.push([CV.ox+(k%CN)*S,CV.oz+((k/CN)|0)*S]);k=from.get(k);}path.reverse();path.push([x1,z1]);return path;}
function cvWay(e,tx,tz){const R=e.d.rad||.35;if(cvLOS(e.x,e.z,tx,tz,R+.35))return null;const key=Math.round(tx/3)+','+Math.round(tz/3);
  if(!e.cvP&&e.cvT&&time-e.cvT<1.2&&e.cvK===key)return null;
  if(e.cvK!==key||time-(e.cvT||-9)>1.4){e.cvP=cvAstar(e.x,e.z,tx,tz,R);e.cvK=key;e.cvT=time;e.cvI=0;}
  const p=e.cvP;if(!p||!p.length)return null;for(let n=0;n<6&&e.cvI<p.length-1&&cvLOS(e.x,e.z,p[e.cvI+1][0],p[e.cvI+1][1],R+.3);n++)e.cvI++;
  if(Math.hypot(p[e.cvI][0]-e.x,p[e.cvI][1]-e.z)<.6&&e.cvI<p.length-1)e.cvI++;return p[e.cvI];}
// ---------- Einbindung: Boden, Wände, Sicht, Wege ----------
const cvHere=y=>CV.on&&DGX.on&&(y==null||y<DG_Y+40);
{const a=groundAt;groundAt=function(x,z,feet){if(cvHere(feet)){const g=cvFloor(x,z);if(g!=null){let y=g;const L=CV.lift;if(L&&Math.abs(x-L.x)<2.15&&Math.abs(z-L.z)<2.15)y=Math.max(y,DG_Y+L.y);const lim=feet==null?1e9:feet+.65;
    for(const b of solNear(x,z)){if(b.off||!b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)>b.hw||Math.abs(lz)>b.hd)continue;const t=solTop(b,lz);if(t<=lim&&t>y)y=t;}return y;}}return a(x,z,feet);};}
{const a=collideTrees;collideTrees=function(){if(cvHere(P.y))return;return a();};}
{const a=collideTreesObj;collideTreesObj=function(o,R){if(cvHere(o.y))return;return a(o,R);};}
{const a=updatePlayer;updatePlayer=function(dt){a(dt);if(DGX.on&&P.y<DG_Y+40)waterTint.hidden=true;if(!cvHere(P.y))return;cvPush(P,P.rad||.3);const L=CV.lift;if(L&&L.mode!=='idle'){P.x=clamp(P.x,L.x-1.7,L.x+1.7);P.z=clamp(P.z,L.z-1.7,L.z+1.7);if(P.y<DG_Y+L.y){P.y=DG_Y+L.y;P.vy=Math.max(0,P.vy);}}};}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){if(cvHere(e.y)&&e.cav&&!e.noPath){const w=cvWay(e,tx,tz);if(w){tx=w[0];tz=w[1];}}const r=a(e,tx,tz,sp,dt);if(cvHere(e.y))cvPush(e,(e.d.rad||.35)*.9);return r;};}
{const a=pickTarget;pickTarget=function(e){const t=a(e);if(t&&e.cav&&cvHere(e.y)){const[tx,,tz]=tPos(t);if(!(e.aggroT>0)&&!cvLOS(e.x,e.z,tx,tz,.45))return null;if(!e.d.boss)e.aggroT=Math.max(e.aggroT||0,4);}return t;};}
{const a=dgFree;dgFree=function(){a();CV.on=false;CV.lift=null;CV.open=CV.d=CV.fy=CV.cy=null;};}
// ---------- Der Minotaurus: Kampfverhalten ----------
function minoHitArea(e,x,z,r,dmg,kb){let hit=false;if((state==='playing'||state==='dialog')&&Math.abs(P.y-e.y)<3){const d=Math.hypot(P.x-x,P.z-z);if(d<r+.3){takeDamage(dmg);const k=kb||5,dx=P.x-e.x,dz=P.z-e.z,l=Math.hypot(dx,dz)||1;P.vx+=dx/l*k;P.vz+=dz/l*k;hit=true;}}
  for(const o of DEM)if(o.fac==='ally'&&!o.dead&&!o.down&&Math.hypot(o.x-x,o.z-z)<r+(o.d.rad||.4)){hurtEnt(o,dmg,'demon');hit=true;}return hit;}
function minoDust(x,z,n,col){for(let k=0;k<n;k++)spawnParticle(x+(Math.random()-.5)*2,DG_Y+.2,z+(Math.random()-.5)*2,(Math.random()-.5)*4,Math.random()*2.5,(Math.random()-.5)*4,col||(Math.random()<.5?0x6a6e7a:0x8a8e9a),.8,.35);}
function minoRing(x,z,r,n){for(let k=0;k<n;k++){const a=k/n*6.283;spawnParticle(x+Math.cos(a)*r,DG_Y+.25,z+Math.sin(a)*r,Math.cos(a)*2,.8,Math.sin(a)*2,0x9aa0ae,.55,.3);}}
function minoRocks(cx,cz,n,rad){for(let k=0;k<n;k++){let x=cx,z=cz;for(let t=0;t<8;t++){const a=Math.random()*6.283,q=Math.random()*rad;x=cx+Math.cos(a)*q;z=cz+Math.sin(a)*q;if(cvDist(x,z)>1.5)break;}
  const top=DG_Y+Math.min(9,Math.max(4,(cvFloor(x,z)||DG_Y)-DG_Y+6)),delay=.5+Math.random()*1.1;
  for(let p=0;p<8;p++)spawnParticle(x+(Math.random()-.5)*.8,top-.3,z+(Math.random()-.5)*.8,(Math.random()-.5)*.4,-.3,(Math.random()-.5)*.4,0x7a7e8a,delay+.3,.22);
  setTimeout(()=>{if(!CV.on)return;SHOTS.push({x,y:top,z,vx:0,vy:-3,vz:0,t:0,life:3,dmg:10,fac:'demon',orb:'orb_rock',size:.85,col:0x7a7e8a,grav:22,aoe:1.4,home:0,src:null});},delay*1000);}}
function minoAI(e,dt){const d=e.d;e.noPath=0;e.mcd=(e.mcd==null?2:e.mcd)-dt;e.chCd=(e.chCd==null?6:e.chCd)-dt;
  if(!e.rage&&e.hp<e.max*.5){e.rage=1;e.ms='roar';e.mt=1.4;try{Snd.demonRoar(.55,1.4);}catch(_){}toast('Der Minotaurus brüllt vor Wut! Er wird schneller.');}
  const K=e.rage?1.22:1;
  if(e.ms==='roar'){e.mt-=dt;e.frame='r';if(Math.random()<dt*20)minoDust(e.x,e.z,2);if(e.mt<=0)e.ms=null;return true;}
  if(e.ms==='stun'){e.mt-=dt;e.frame='k';if(e.mt<=0){e.ms=null;e.frame=0;}return true;}
  if(e.ms==='skid'){e.mt-=dt;e.frame=0;const s=Math.max(0,e.mt)*9*dt;e.x+=e.cdx*s;e.z+=e.cdz*s;cvPush(e,d.rad);if(e.mt<=0)e.ms=null;return true;}
  if(e.ms==='prep'){e.mt-=dt;e.frame='r';const t=e.tgt;if(t){const[tx,,tz]=tPos(t);const dx=tx-e.x,dz=tz-e.z,l=Math.hypot(dx,dz)||1;e.cdx=dx/l;e.cdz=dz/l;}
    if(Math.random()<dt*14)minoDust(e.x-e.cdx*1.2,e.z-e.cdz*1.2,2);if(e.mt<=0){e.ms='run';e.mt=2.3;e.hitDone=false;try{Snd.demonRoar(.7,1.1);}catch(_){}}return true;}
  if(e.ms==='run'){e.mt-=dt;e.frame='r';const v=16.5*K,st=v*dt;e.x+=e.cdx*st;e.z+=e.cdz*st;const bx=e.x,bz=e.z;cvPush(e,d.rad);solPush(e,d.rad*.8,e.y,3);e.anim+=st;
    if(Math.random()<dt*25)minoDust(e.x,e.z,1);if(((e.anim*.6)|0)!==e.stepN){e.stepN=(e.anim*.6)|0;try{Snd.thud();}catch(_){}}
    if(!e.hitDone){if(minoHitArea(e,e.x+e.cdx*1.2,e.z+e.cdz*1.2,1.7,40,15)){e.hitDone=true;P.vy=Math.max(P.vy,5.5);try{Snd.boom(.25);}catch(_){}}}
    if(Math.hypot(e.x-bx,e.z-bz)>.05){e.ms='stun';e.mt=2.8;try{Snd.boom(.45);}catch(_){}minoDust(e.x+e.cdx*1.6,e.z+e.cdz*1.6,40);minoRocks(e.x,e.z,e.rage?8:5,7);if(Math.hypot(P.x-e.x,P.z-e.z)<30)toast('Der Minotaurus kracht gegen den Fels und taumelt!');return true;}
    if(e.mt<=0){e.ms='skid';e.mt=.6;}return true;}
  if(e.ms==='wind'){e.mt-=dt;e.frame=e.atkT==='sweep'?'q':'w';if(e.atkT==='smash'&&Math.random()<dt*10)spawnParticle(e.x+(Math.random()-.5)*2,e.y+e.h,e.z+(Math.random()-.5)*2,0,1,0,0xc8d4e4,.4,.2);
    if(e.mt<=0){const fx=e.adx,fz=e.adz;if(e.atkT==='slash'){minoHitArea(e,e.x+fx*2.6,e.z+fz*2.6,2.3,24,6);try{Snd.whoosh(500,.14);}catch(_){}}
      else if(e.atkT==='smash'){const hx=e.x+fx*3.2,hz=e.z+fz*3.2;minoHitArea(e,hx,hz,3.4,40,9);minoDust(hx,hz,34);minoRing(hx,hz,3.4,30);try{Snd.boom(.35);}catch(_){}}
      else{minoHitArea(e,e.x,e.z,5.3,22,8);minoRing(e.x,e.z,5,40);try{Snd.whoosh(300,.18);}catch(_){}}
      e.ms='rec';e.mt=e.atkT==='smash'?.95:e.atkT==='sweep'?.75:.5;}return true;}
  if(e.ms==='rec'){e.mt-=dt;e.frame=e.atkT==='sweep'?'s':'a';if(e.mt<=0){e.ms=null;e.frame=0;}return true;}
  const t=e.tgt;if(!t){if(Math.hypot(e.home.x-e.x,e.home.z-e.z)>2){entMove(e,e.home.x,e.home.z,d.spd,dt);}else e.frame=0;return true;}
  if(!e.met){e.met=1;try{Snd.demonRoar(.6,1.3);}catch(_){}showArea('Der Minotaurus');}
  const[tx,,tz]=tPos(t),dist=Math.hypot(tx-e.x,tz-e.z);
  if(e.chCd<=0&&dist>7&&dist<32&&cvLOS(e.x,e.z,tx,tz,1.2)){e.ms='prep';e.mt=e.rage?.8:1.15;e.chCd=(e.rage?5:8)+Math.random()*4;const l=dist||1;e.cdx=(tx-e.x)/l;e.cdz=(tz-e.z)/l;
    if(!e.chHint){e.chHint=1;toast('Der Minotaurus senkt den Kopf und scharrt mit den Hufen … Weich seitlich aus!');}try{Snd.demonRoar(.5,.9);}catch(_){}return true;}
  if(dist<=d.reach+.6&&e.mcd<=0){const l=dist||1;e.adx=(tx-e.x)/l;e.adz=(tz-e.z)/l;const r=Math.random();let near=0;for(const o of DEM)if(o.fac==='ally'&&!o.dead&&Math.hypot(o.x-e.x,o.z-e.z)<5)near++;
    e.atkT=near>=1&&r<.45?'sweep':r<.52?'slash':r<.8?'smash':'sweep';e.ms='wind';e.mt=(e.atkT==='slash'?.6:e.atkT==='smash'?1.05:.8)/K;e.mcd=(e.atkT==='slash'?1.2:2)/K;return true;}
  if(dist>d.reach)entMove(e,tx,tz,d.spd*K,dt);else e.frame=0;return true;}
// ---------- Takt: Aufzug, Kristalle, Gruppen ----------
function cvTick(dt){if(!CV.on||!DGX.on)return;const L=CV.lift;
  if(DGX.light)DGX.light.intensity=.55;
  if(L){if(L.mode==='down'){L.y=Math.max(0,L.y-dt*(L.y>1.5?2.4:1.2));if(Math.random()<dt*3)try{Snd.clank(.04);}catch(_){}if(L.y<=0){L.mode='idle';try{Snd.clank(.12);Snd.thud();}catch(_){}toast(CV.cfg&&CV.cfg.arrive||'Der Aufzug setzt mit einem Ruck auf.');}}
    else if(L.mode==='up'){L.y+=dt*2.6;if(Math.random()<dt*3)try{Snd.clank(.04);}catch(_){}if(L.y>9){L.mode='idle';L.y=0;dgLeave(false);return;}}
    if(L.g)L.g.position.y=DG_Y+L.y;}
  // Kristallfunkeln
  CV.dripT-=dt;if(CV.dripT<=0){CV.dripT=.08;for(const c of CV.crys){if(Math.abs(c.x-P.x)>40||Math.abs(c.z-P.z)>40||Math.random()>.12)continue;spawnParticle(c.x+(Math.random()-.5)*1.4,DG_Y+.5+Math.random()*1.8,c.z+(Math.random()-.5)*1.4,0,.25,0,CV.cfg.glow.spark[c.v],1.2,.12);}}
  // Gruppen helfen sich, Umherstreifen nur auf freiem Boden
  for(const e of DGX.ents){if(e.dead||!e.cav)continue;if(e.tgt==='player'&&e.mates)for(const m of e.mates)if(m!==e&&!m.dead&&!(m.aggroT>0)&&Math.hypot(m.x-e.x,m.z-e.z)<16)m.aggroT=4;
    if(e.wx!=null&&cvDist(e.wx,e.wz)<1.6){e.wx=e.home.x;e.wz=e.home.z;}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{cvTick(dt);}catch(e){if(!cvTick.err){cvTick.err=1;console.error('Höhle',e);}}};}
// Aufzug benutzen
const cvLiftNear=()=>CV.on&&CV.lift&&CV.lift.mode==='idle'&&Math.hypot(P.x-CV.lift.x,P.z-CV.lift.z)<3.4;
{const a=storyUse;storyUse=function(){if(state==='playing'&&CV.on&&CV.lift&&CV.lift.mode!=='idle')return true;if(state==='playing'&&cvLiftNear()){const L=CV.lift;if(Math.hypot(P.x-L.x,P.z-L.z)>2){P.x=L.x;P.z=L.z;}L.mode='up';try{Snd.clank(.15);}catch(_){}toast('Der Aufzug ruckelt nach oben …');return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(CV.on&&CV.lift&&CV.lift.mode!=='idle')return null;if(cvLiftNear())return'Mit dem Aufzug nach oben';return a();};}
// Ebene 1 ersetzt die alte Halle der Prüfung
TOWER_LEVELS[0]={n:'Die Kalte Tiefe',d:'Ein Labyrinth aus kaltem Fels. Irgendwo in der Tiefe wartet der Minotaurus.',cave:1,W:CV_N-1,far:88,near:16,hemi:.12,bbl:1,fogC:[.14,.14,.15],
  build(K){cvBuild(K,1,CV_L1);},
  enter(){const L=CV.lift;if(!L)return;L.mode='down';L.y=11;L.g.position.y=DG_Y+L.y;P.x=L.x;P.z=L.z+.4;P.y=DG_Y+L.y+.05;P.vx=P.vy=P.vz=0;P.yaw=0;P.pitch=-.1;try{Snd.clank(.15);}catch(_){}}};
