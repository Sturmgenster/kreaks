/* =========================================================
   0.0.110 · Das Meer (1/3): Welt
   - Mehr Wasser: etwas mehr Ozean und viele Seen im Landesinneren
   - Tiefsee: weit draußen fällt der Meeresgrund auf 40 bis 90 m ab
   - Am Meeresgrund: Seegras, Seetang, Korallen, Muscheln (mit Perlen), Seesterne
   - Versunkene Ruinen aus alter Zeit mit Schatztruhen
   ========================================================= */
// ---------- Neue Dinge ----------
Object.assign(ITEMS,{seafish:{name:'Meeresfisch',plural:'Meeresfische'},sharktooth:{name:'Haizahn',plural:'Haizähne'},tentacle:{name:'Tentakel',plural:'Tentakel'},
  pearl:{name:'Perle',plural:'Perlen'},kelp:{name:'Seetang',plural:'Seetang'},coral:{name:'Koralle',plural:'Korallen'},shell:{name:'Muschel',plural:'Muscheln'},
  megatooth:{name:'Megalodonzahn',plural:'Megalodonzähne'},oldcoin:{name:'Antike Münze',plural:'Antike Münzen'},trident:{name:'Dreizack',plural:'Dreizacke',weapon:'spear'}});
Object.assign(ITEM_DESC,{seafish:'Frisch aus dem Meer. Essbar (Rechtsklick)',sharktooth:'Scharf wie ein Messer. Händler zahlen gut',tentacle:'Gummiartig, aber essbar (Rechtsklick)',
  pearl:'Schimmert wie Mondlicht. Steckt manchmal in Muscheln und in alten Truhen',kelp:'Salzig und zäh. Essbar (Rechtsklick)',coral:'Hart und bunt. Aus warmem, flachem Meer',
  shell:'Eine leere Muschelschale',megatooth:'Der Zahn des größten Raubfischs aller Zeiten. Unbezahlbar',oldcoin:'Aus einem Reich, das im Meer versunken ist',
  trident:'Die Waffe eines vergessenen Meereskönigs. Lange Reichweite. Rechtsklick: ausstrecken'});
Object.assign(FOOD,{seafish:[8,10,'Frischer Fisch!'],kelp:[3,6,'Salzig und zäh.'],tentacle:[6,8,'Gummiartig … aber satt macht es.']});
try{STALL.Kuno.sell.push(['pearl',45],['sharktooth',15],['coral',8],['shell',3],['megatooth',450],['oldcoin',30],['tentacle',5]);STALL.Anselm.sell.push(['seafish',4],['kelp',1]);}catch(e){}
// ---------- Symbole ----------
const mrPoly=(p,pts,col)=>{const xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]);for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++)for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++){
  let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)ins=!ins;}if(ins)p.set(x,y,typeof col==='function'?col(x,y):col);}};
const mrEll=(p,cx,cy,rx,ry,col)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1){const c=typeof col==='function'?col(x,y,dx,dy):col;if(c)p.set(x,y,c);}}};
const mrLine=(p,x0,y0,x1,y1,w,col)=>{const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.5));for(let t=0;t<=n;t++){const X=x0+(x1-x0)*t/n,Y=y0+(y1-y0)*t/n;for(let o=0;o<w;o++)p.set(X+o-(w>>1),Y,typeof col==='function'?col(t/n,o):col);}};
function mrKelp(v,k){const H=v?44:34,p=new Px(12,H),G=pal(k==='sg'?['#1e4a1a','#2e6a24','#4a8a34']:['#2a3a10','#405418','#5a7022','#74882e']);
  if(k==='sg'){for(let b=0;b<6;b++){const x0=1+b*2,h=6+((b*7+v*3)%5);for(let y=0;y<h;y++)p.set(x0+Math.round(Math.sin(y*.5+b)*.8),H-1-y,G[(y+b)%3]);}}
  else for(let s=0;s<2;s++){let x=4+s*4;for(let y=H-1;y>=2+s*5;y--){x+=Math.sin(y*.35+s*2)*.45;p.set(x,y,G[1+((y>>1)%2)]);p.set(x+1,y,G[0]);if(y%5===0){p.set(x+2,y-1,G[2]);p.set(x+3,y-2,G[3]);}if(y%7===3){p.set(x-1,y-1,G[2]);p.set(x-2,y-2,G[3]);}}}
  return p.done();}
function mrCoral(v){const p=new Px(16,14),C=pal([['#6a1a2a','#a02a3a','#e04a5a','#ff8a90'],['#7a3a10','#b45a1a','#f08a2a','#ffc070'],['#3a1a5a','#5a2a8a','#8a4ac0','#c08af0']][v]);
  const br=(x,y,a,l,d)=>{if(d>3||l<1.5)return;const x1=x+Math.cos(a)*l,y1=y-Math.sin(a)*l;mrLine(p,x,y,x1,y1,d<2?2:1,C[1+Math.min(2,d)]);br(x1,y1,a+.5,l*.7,d+1);br(x1,y1,a-.5,l*.7,d+1);};
  if(v===1){mrEll(p,8,9,7,5,(x,y,dx,dy)=>C[(x+y)%3===0?0:dy<0?2:1]);for(let x=2;x<15;x+=2)p.set(x,4+(x%3),C[3]);}else br(8,13,Math.PI/2,5,0);outline(p);return p.done();}
function mrShell(){const p=new Px(10,7),S=pal(['#a88a70','#d0b498','#f0dcc4','#fff4e8']);mrEll(p,5,5,4.5,4,(x,y,dx,dy)=>dy>.2?null:S[(Math.abs(x-5)%2)?1:2]);for(let x=1;x<10;x++)if(!(x%2))mrLine(p,5,6,x,2,1,S[0]);for(let x=2;x<9;x++)p.set(x,6,S[0]);outline(p);return p.done();}
function mrStar(){const p=new Px(11,11),S=pal(['#8a3a1a','#c85a24','#f08a40','#ffc080']);for(let k=0;k<5;k++){const a=-Math.PI/2+k*1.2566;mrLine(p,5,5,5+Math.cos(a)*5,5+Math.sin(a)*5,2,(t)=>S[t<.5?2:1]);}p.set(5,5,S[3]);outline(p);return p.done();}
{const a=wlNewSprites;wlNewSprites=function(){const out=a();try{out.push(['kelp0',mrKelp(0,'k')],['kelp1',mrKelp(1,'k')],['seagrass0',mrKelp(0,'sg')],['seagrass1',mrKelp(1,'sg')],
  ['coral0',mrCoral(0)],['coral1',mrCoral(1)],['coral2',mrCoral(2)],['shell',mrShell()],['starfish',mrStar()]);}catch(e){console.error('Meer: Pflanzen',e);}return out;};}
Object.assign(HV,{wl_kelp:{t:'soft',hp:2,d:[['kelp',1,2,1]],re:1440},wl_seagrass:{t:'soft',hp:1,d:[['kelp',1,1,.5]],re:720,small:1},wl_coral:{t:'soft',hp:6,d:[['coral',1,1,1]],re:2880},
  wl_shell:{t:'soft',hp:1,d:[['shell',1,1,1],['pearl',1,1,.08]],re:2880,small:1}});
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(15,8),B=pal(['#2a4a6a','#4a7a9a','#8ab4c8','#d8eef4']);mrEll(p,8,4,6,3,(x,y,dx,dy)=>B[dy<-.3?1:dy<.3?2:3]);mrPoly(p,[[1,1],[3,4],[1,7]],B[1]);p.set(12,3,hex('#101010'));outline(p);list.push(['seafish',p.done()]);}
  {const p=new Px(9,12),T=pal(['#b8b0a0','#e0d8c8','#fffaf0']);mrPoly(p,[[1,11],[8,11],[5,0]],(x,y)=>T[x<4?1:2]);for(let x=2;x<8;x+=2)p.set(x,10,T[0]);outline(p);list.push(['sharktooth',p.done()]);}
  {const p=new Px(14,12),T=pal(['#7a2a3a','#a84a5a','#d0707a']);mrLine(p,1,2,8,6,3,(t,o)=>T[o]);mrLine(p,8,6,12,11,2,(t,o)=>T[o]);for(let k=0;k<4;k++)p.set(3+k*2,6,hex('#f0c0c0'));outline(p);list.push(['tentacle',p.done()]);}
  {const p=new Px(9,9),Pp=pal(['#9a98a8','#d0d0dc','#f4f4fa','#ffffff']);mrEll(p,4,4,3.6,3.6,(x,y,dx,dy)=>Pp[shadeIdx(.65-dx*.3-dy*.4,4,x,y)]);p.set(3,2,Pp[3]);outline(p);list.push(['pearl',p.done()]);}
  {const p=new Px(10,14),G=pal(['#2a3a10','#405418','#5a7022']);for(let y=1;y<14;y++){const x=4+Math.sin(y*.6)*1.5;p.set(x,y,G[1]);p.set(x+1,y,G[2]);if(y%4===0)p.set(x+2,y-1,G[0]);}outline(p);list.push(['kelp',p.done()]);}
  list.push(['coral',mrCoral(0)],['shell',mrShell()]);
  {const p=new Px(14,16),T=pal(['#8a8270','#c8c0a8','#f0e8d4']);mrPoly(p,[[1,15],[13,15],[8,0]],(x,y)=>T[x<7?1:2]);for(let y=12;y<16;y++)for(let x=3;x<12;x+=3)p.set(x,y,T[0]);outline(p);list.push(['megatooth',p.done()]);}
  {const p=new Px(11,11),G=pal(['#6a5014','#a07a1e','#d8b030','#ffe070']);mrEll(p,5,5,4.6,4.6,(x,y,dx,dy)=>G[shadeIdx(.6-dx*.25-dy*.3,4,x,y)]);mrEll(p,5,5,2.4,2.4,G[1]);p.set(5,4,G[3]);for(let x=2;x<9;x++)if(hash2(x,1,77)<.35)p.set(x,8,hex('#3a6a5a'));outline(p);list.push(['oldcoin',p.done()]);}
  {const p=new Px(9,30),S=pal(['#2a6a6a','#4a9a8a','#8ad8c0','#d8fff0']),W=pal(['#4a3018','#6a4626']);mrLine(p,4,8,4,29,2,(t,o)=>W[o]);
    for(const x of[1,4,7]){mrLine(p,x,1+(x===4?-1:1),x,8,1,S[2]);p.set(x,0+(x===4?0:2),S[3]);}mrLine(p,1,8,7,8,1,S[1]);outline(p);list.push(['trident',p.done()]);}
}catch(e){console.error('Meer: Symbole',e);}};}
// =========================================================
// Mehr Wasser
// =========================================================
{const a=wlCont;wlCont=function(x,z){return a(x,z)-.012;};}
Object.assign(WL_VAR,{kelp:2,seagrass:2,coral:3});
WLB.tiefsee={n:'Tiefsee',mus:'orte/kueste',gloom:0,cave:0,reg:'west'};WLP.tiefsee=[pal(['#2a2e30','#343a3c','#3e4648','#4a5254'])];WLV.tiefsee=[];WL_HILLK.tiefsee=0;
try{FA_BIO.tiefsee=[];FA_TGT.tiefsee=0;MAPC.wl_tiefsee=[24,62,120];}catch(e){}
// Weit draußen wird das Meer zur Tiefsee
{const a=wlSite;wlSite=function(ci,cj){const s=a(ci,cj);if(!s._ts){s._ts=1;if(s.b==='meer'&&!s.island&&wlCont(s.x,s.z)<WL_SEA-.085&&coreDist(s.x,s.z)>500)s.b='tiefsee';}return s;};}
const LAKE_B={wald:.7,ebene:.7,nadelwald:.71,nadel2:.71,redwood:.72,dschungel:.7,savanne:.78,schnee:.73,sumpf:.66,wueste:.84};
function mrLake(h,x,z,b){const thr=LAKE_B[b];if(thr==null)return h;const X=x+WOX,Z=z+WOZ,L=vnoise(X*.0032,Z*.0032,4991)*.8+vnoise(X*.011,Z*.011,4992)*.2;if(L<=thr)return h;
  const t=wsm(clamp((L-thr)/.07,0,1)),bed=-2.2-clamp((L-thr-.04)*70,0,7);return h*(1-t)+Math.min(h,bed)*t;}
{const a=wlBiomeH;wlBiomeH=function(b,x,z,s){if(b==='tiefsee'){const X=x+WOX,Z=z+WOZ;let h=-115+(fbm(X*.003,Z*.003,4,3141)-.5)*44;const r=ridgeN(X*.4,Z*.4,3142);h-=Math.pow(r,2.4)*65;return h;}
  if(b==='meer'||b==='insel'){const X=x+WOX,Z=z+WOZ,base=-28+(fbm(X*.004,Z*.004,3,3109)-.5)*12;if(!(s&&s.island))return base;
    const d=Math.hypot(x-s.x,z-s.z)/s.R,k=wsm(clamp(1.15-d,0,1));return Math.max(base,-28+Math.pow(k,1.2)*36+(fbm(X*.012,Z*.012,3,3119)-.5)*5*k);}
  return mrLake(a(b,x,z,s),x,z,b);};}
// Wassertiefe an einer Stelle der Wildnis
const mrDepth=(x,z)=>WATER-getHeight(x,z);
function mrBio(x,z){if(x>60000||inCore(x,z))return'core';const s=wlDom(x,z),b=wlBiomeOf(s,x,z);if(b==='meer'||b==='insel'||b==='kueste')return'meer';if(b==='tiefsee')return'tiefsee';return'see';}
// =========================================================
// Am Meeresgrund: Pflanzen und Muscheln
// =========================================================
{const a=wlBuildChunk;wlBuildChunk=function*(ch){yield*a(ch);if(ch.empty||!ch.H||ch.ground==null)return;yield;try{mrSeabed(ch);}catch(e){console.error('Meeresgrund',e);}};}
function mrSeabed(ch){const{x0,z0,H,N,S,V}=ch;let any=false;for(let k=0;k<H.length;k+=7)if(H[k]<WATER-1){any=true;break;}if(!any)return;
  const hAt=(x,z)=>{const fi=(x-x0)/S,fj=(z-z0)/S,i=clamp(Math.floor(fi),0,N-1),j=clamp(Math.floor(fj),0,N-1),u=fi-i,v=fj-j,a=H[j*V+i],b=H[j*V+i+1],c=H[(j+1)*V+i],d=H[(j+1)*V+i+1];return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;};
  const r=mulberry32(55555+ch.i*7919+ch.j*104729+WSEED*37),deco=[];
  for(let t=0;t<700;t++){const x=x0+r()*WLC,z=z0+r()*WLC;if(inCore(x,z))continue;const h=hAt(x,z),d=WATER-h;if(d<1)continue;const bio=mrBio(x,z);let it=null;const q=r();
    if(bio==='tiefsee'||d>32){if(q<.025)it=['srock',.8,1.6];else if(q<.032)it=['bones',.5,.7];else if(q<.04&&d<45)it=['kelp',3,6];}
    else if(bio==='see'){if(q<.12)it=['seagrass',.5,.8];else if(q<.16)it=['reed',.9,1.3];else if(q<.17)it=['shell',.25,.3];}
    else{if(q<.16&&d<10)it=['seagrass',.5,.9];else if(q<.22&&d>3&&d<22)it=['kelp',3.5,8];else if(q<.26&&d>1.5&&d<14)it=['coral',.8,1.6];else if(q<.285)it=['shell',.25,.32];else if(q<.3)it=['starfish',.28,.36];else if(q<.315)it=['rock',.7,1.3];}
    if(!it)continue;const spr=wlSpr(it[0],r());const sp=SPR[spr];if(!sp)continue;const hh=it[1]+r()*(it[2]-it[1]);deco.push({x,y:h-.03,z,w:hh*sp.w/sp.h,h:hh,spr,tint:.9+r()*.2,sway:it[0]==='kelp'?.06:it[0]==='seagrass'?.04:0});}
  if(!deco.length)return;ch.decoU=deco;ch.bbU=makeBillboards(deco,wlMat);ch.bbU.frustumCulled=false;scene.add(ch.bbU);}
{const a=wlFreeChunk;wlFreeChunk=function(ch){if(ch.bbU){scene.remove(ch.bbU);ch.bbU.geometry.dispose();ch.bbU=null;}
  for(const b of ch.decoU||[])if(b._hv){const c=hvCell(b.x,b.z),l=HG.get(c);if(l){const i=l.indexOf(b);if(i>=0)l.splice(i,1);if(!l.length)HG.delete(c);}if(HK.get(b._hk)===b)HK.delete(b._hk);HGONE.delete(b);}ch.decoU=null;return a(ch);};}
// =========================================================
// Versunkene Ruinen
// =========================================================
function ruinOf(s){if(s.ruDone)return s.ru;s.ruDone=true;s.ru=null;const deep=s.b==='tiefsee';if(!(deep||(s.b==='meer'&&!s.island)))return null;
  const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,4996)>(deep?.4:.3))return null;
  const r=mulberry32(4997+s.ci*7919+s.cj*15485+WSEED*41);
  for(let t=0;t<30;t++){const a=r()*6.283,d=r()*s.R*.7,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<200||Math.abs(x)>WORLD_R-60||Math.abs(z)>WORLD_R-60)continue;
    const rot=r()*6.283,c=Math.cos(rot),sn=Math.sin(rot);let mn=1e9,mx=-1e9,ok=true;
    for(const[lx,lz]of[[0,0],[-7,-7],[7,-7],[-7,7],[7,7],[0,-7],[0,7],[-7,0],[7,0]]){const wx=x+lx*c-lz*sn,wz=z+lx*sn+lz*c,h=getHeight(wx,wz);mn=Math.min(mn,h);mx=Math.max(mx,h);if(lx&&wlDom(wx,wz)!==s){ok=false;break;}}
    if(!ok||mx-mn>3||WATER-mx<5||WATER-mn>220)continue;s.ru={id:s.id+'_ru',x,z,rot,c,s:sn,h:mn,deep};return s.ru;}
  return null;}
const RUI={built:new Map(),t:0};let RUIM=null;
function ruMats(){if(RUIM)return RUIM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const st=(seed,cols,moss)=>{const p=new Px(16,16),S=pal(cols);for(let y=0;y<16;y++)for(let x=0;x<16;x++){p.set(x,y,S[shadeIdx(.55+(hash2(x>>1,y>>1,seed)-.5)*.5+(hash2(x,y,seed+1)-.5)*.2,S.length,x,y)]);
      if(y===0||y===8||(x===0&&y<8)||(x===8&&y>=8))p.set(x,y,S[0]);if(hash2(x,y,seed+2)<moss)p.set(x,y,hex(hash2(x,y,seed+3)<.5?'#2e5a2a':'#46723a'));}return T(p.done());};
  RUIM={a:new THREE.MeshLambertMaterial({map:st(5001,['#4a524a','#5e665c','#727a6e','#868e80'],.12)}),b:new THREE.MeshLambertMaterial({map:st(5004,['#3e4640','#4e5650','#5e6660','#6e766e'],.18)}),
    w:new THREE.MeshLambertMaterial({map:st(5007,['#6a6a5a','#808070','#969684','#acac98'],.08)})};return RUIM;}
function ruAdd(B,geo,mat,lx,lz,y,ry,rx,rz){const g=B.r,m=new THREE.Mesh(geo,mat),wx=g.x+lx*g.c-lz*g.s,wz=g.z+lx*g.s+lz*g.c;m.position.set(wx,getHeight(wx,wz)+y,wz);m.rotation.set(rx||0,-g.rot+(ry||0),rz||0);B.grp.add(m);B.geos.push(geo);return m;}
function ruProp(B,lx,lz,r){const g=B.r,x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c,p={x,z,type:'prop',h:1,w:1,r};const k=gk(x,z);let l=tgrid.get(k);if(!l)tgrid.set(k,l=[]);l.push(p);B.props.push(p);}
function ruBuild(g){const M=ruMats(),B={r:g,grp:new THREE.Group(),props:[],geos:[]},r=mulberry32(5010+((g.x*7+g.z*13)|0));RUI.built.set(g.id,B);
  // Boden aus Platten
  for(let i=-3;i<=3;i++)for(let j=-3;j<=2;j++){if(r()<.3)continue;ruAdd(B,new THREE.BoxGeometry(1.9,.4,1.9),M.w,i*2,j*2,.05+r()*.15,(r()-.5)*.1,(r()-.5)*.08,(r()-.5)*.08);}
  // Säulen
  for(const lx of[-4.2,4.2])for(const lz of[-4,-1.3,1.3,4]){const k=r();if(k<.15){const L=3+r()*2,m=ruAdd(B,new THREE.CylinderGeometry(.45,.45,L,10),M.a,lx+(r()-.5)*2,lz+(r()-.5),.45,r()*3,0,Math.PI/2);continue;}
    const hh=k<.45?1.2+r()*1.5:3.6+r()*2.2;ruAdd(B,new THREE.CylinderGeometry(.42,.5,hh,10),M.a,lx,lz,hh/2+.1);ruAdd(B,new THREE.BoxGeometry(1.2,.3,1.2),M.w,lx,lz,.15);if(k>=.45)ruAdd(B,new THREE.BoxGeometry(1.2,.35,1.2),M.w,lx,lz,hh+.25);ruProp(B,lx,lz,.55);}
  // Rückwand mit Bogen
  for(let lx=-6;lx<=6;lx+=2){if(Math.abs(lx)<1)continue;if(r()<.25)continue;const hh=2+r()*2.6;ruAdd(B,new THREE.BoxGeometry(2,hh,.8),M.b,lx,-6.4,hh/2,0,0,(r()-.5)*.06);ruProp(B,lx,-6.4,.7);}
  ruAdd(B,new THREE.BoxGeometry(.9,4.4,.9),M.b,-1.4,-6.4,2.2);ruAdd(B,new THREE.BoxGeometry(.9,4.4,.9),M.b,1.4,-6.4,2.2);ruAdd(B,new THREE.BoxGeometry(3.8,.8,1),M.w,0,-6.4,4.6,0,0,.06);
  // Statue eines alten Königs (der Kopf liegt daneben)
  ruAdd(B,new THREE.BoxGeometry(1.4,.8,1.4),M.w,0,-3.6,.4);ruAdd(B,new THREE.BoxGeometry(.9,2.2,.6),M.a,0,-3.6,1.9);ruAdd(B,new THREE.BoxGeometry(1.5,.4,.5),M.a,0,-3.6,2.9);
  ruAdd(B,new THREE.BoxGeometry(.75,.8,.7),M.a,1.6,-2.4,.4,.7,.3,.4);ruProp(B,0,-3.6,.9);
  for(let k=0;k<7;k++){const a=r()*6.283,d=4+r()*5;ruAdd(B,new THREE.BoxGeometry(.5+r()*.6,.4+r()*.4,.5+r()*.6),M.b,Math.cos(a)*d,Math.sin(a)*d,.2,r()*3,(r()-.5)*.4,(r()-.5)*.4);}
  scene.add(B.grp);
  // Schatztruhe (nur einmal)
  FLAGS.ruins=FLAGS.ruins||{};if(!FLAGS.ruins[g.id]){FLAGS.ruins[g.id]=1;const key='ruin_'+g.id,lx=2.3,lz=-4.6,x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c;
    FLAGS.chests=FLAGS.chests||{};const b=FLAGS.chests[key]=new Array(28).fill(null),R=Math.random,L=[['pearl',1+((R()*3)|0)],['oldcoin',2+((R()*4)|0)],['silver',6+((R()*10)|0)],['copper',10+((R()*20)|0)]];
    if(R()<(g.deep?.7:.4))L.push(['coin',1]);const gems=['ruby','opal','sapphire','emerald'].filter(k=>ITEMS[k]);if(gems.length&&R()<.3)L.push([gems[(R()*gems.length)|0],1]);if(R()<(g.deep?.25:.12))L.push(['trident',1]);
    L.forEach((q,i)=>{b[i]={id:q[0],n:q[1]};});addFurn('chest',x,z,key);furnSave();renderFurn();}
  return B;}
function ruFree(B){scene.remove(B.grp);for(const g of B.geos)g.dispose();for(const p of B.props){const l=tgrid.get(gk(p.x,p.z));if(l){const i=l.indexOf(p);if(i>=0)l.splice(i,1);}}RUI.built.delete(B.r.id);}
function ruTick(dt){RUI.t-=dt;if(RUI.t>0)return;RUI.t=.7;if(P.x>60000||!WL_READY){for(const B of[...RUI.built.values()])ruFree(B);return;}
  const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=wlSite(ci+a,cj+b);if(s.b!=='meer'&&s.b!=='tiefsee')continue;const g=ruinOf(s);if(g&&!RUI.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<170)ruBuild(g);}
  for(const B of[...RUI.built.values()])if(Math.hypot(B.r.x-P.x,B.r.z-P.z)>240)ruFree(B);}
{const a=wlReset;wlReset=function(){for(const B of[...RUI.built.values()])ruFree(B);a();};}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{ruTick(dt);}catch(e){if(!ruTick.err){ruTick.err=1;console.error('Ruinen',e);}}};}
