/* =========================================================
   V65 · Die Wildnis: Hinter den bekannten Gebieten liegen bis 50 km weit
   zufällig aneinandergereihte Biome. Jede Welt (jeder neue Spielstand) würfelt
   ihre eigene Anordnung. Erzeugt wird nur, was in Sichtweite kommt; alles
   außerhalb wird wieder entladen. Danach ist die Welt zu Ende.
   ========================================================= */
var WL_READY=false;
const WL_CELL=300,WL_BLEND=24,WL_EDGE=220,WLC=80,WLN=40;
// ---------- Biome ----------
const WLB={
  wald:{n:'Wald',mus:'orte/wald',gloom:.12,cave:.25,reg:'old'},
  ebene:{n:'Ebene',mus:'orte/ebene',gloom:0,cave:.12,reg:'plain'},
  nadelwald:{n:'Nadelwald',mus:'orte/nordwald',gloom:.3,cave:.45,reg:'nord'},
  redwood:{n:'Redwood',mus:'orte/redwood',gloom:.22,cave:.3,reg:'red'},
  wueste:{n:'Wüste',mus:'orte/wueste',gloom:0,cave:.3,reg:'desert'},
  dschungel:{n:'Dschungel',mus:'orte/dschungel',gloom:.22,cave:.3,reg:'old'},
  savanne:{n:'Savanne',mus:'orte/savanne',gloom:0,cave:.2,reg:'desert'},
  kueste:{n:'Küste',mus:'orte/kueste',gloom:0,cave:.15,reg:'west'},
  meer:{n:'Meer',mus:'orte/kueste',gloom:0,cave:0,reg:'west'},
  insel:{n:'Insel',mus:'orte/kueste',gloom:0,cave:.35,reg:'west'},
  schnee:{n:'Schneelandschaft',mus:'orte/nordwald',gloom:.05,cave:.35,reg:'nord'},
  schneeberge:{n:'Schneeberge',mus:'orte/sturmberg',gloom:0,cave:.7,reg:'nord'},
  steinwueste:{n:'Steinwüste',mus:'orte/wueste',gloom:0,cave:.7,reg:'desert'},
  sumpf:{n:'Sumpf',mus:'orte/froschdorf',gloom:.38,cave:.15,reg:'old'},
  candy:{n:'Candyland',mus:'orte/ebene',gloom:0,cave:0,reg:'plain'}};
// Diese Biome werden zufällig verteilt. Inseln entstehen nur mitten im Meer.
const WL_POOL=['wald','ebene','nadelwald','redwood','wueste','dschungel','savanne','kueste','meer','schnee','schneeberge','steinwueste','sumpf'];
// ---------- Weltsamen: jede Welt würfelt neu ----------
let WSEED=1,WOX=0,WOZ=0;
function wlSetSeed(n){WSEED=(n|0)||1;WOX=(WSEED%9973)*37.3;WOZ=((WSEED/9973|0)%9967)*41.7;}
const WLB_KEYS=Object.keys(WLB);
// ---------- Kontinente und Meere (V67) ----------
// Ein großräumiges Rauschen teilt die Welt in Landmassen und Ozeane. Im Ozean liegen
// Inselketten, kleine Inseln und große Inseln, die selbst aus mehreren Biomen bestehen.
const WL_LAND_POOL=['wald','ebene','nadelwald','redwood','wueste','dschungel','savanne','schnee','schneeberge','steinwueste','sumpf'];
const WL_SEA=.49,WL_COAST=.014;
function wlCont(x,z){x+=WOX*3.1;z+=WOZ*2.7;let c=fbm(x*.00005,z*.00005,4,4901)*.9+vnoise(x*.0005,z*.0005,4902)*.1;
  const d=typeof coreDist==='function'?coreDist(x-WOX*3.1,z-WOZ*2.7):0;c+=.16*(1-wsm(clamp((d-1500)/3000,0,1)));return c;}
// Große Inseln im Ozean (mehrere Regionen groß) und schmale Inselketten
function wlBigIsle(x,z){x+=WOX;z+=WOZ;return vnoise(x*.0006,z*.0006,4903)*.7+vnoise(x*.0019,z*.0019,4904)*.3;}
function wlChain(x,z){x+=WOX;z+=WOZ;return 1-Math.abs(vnoise(x*.00055,z*.00055,4905)*2-1);}
function wlIsleChance(x,z){const ch=wlChain(x,z);return .14+wsm(clamp((ch-.82)/.14,0,1))*.75;}
function wlPickBiome(x,z,r,h){const c=wlCont(x,z),pick=()=>WL_LAND_POOL[Math.min(WL_LAND_POOL.length-1,(r*WL_LAND_POOL.length)|0)];
  if(c>=WL_SEA+WL_COAST){if(r<.04)return'kueste';return pick();}   // Festland
  if(c>=WL_SEA)return'kueste';                                     // Küstensaum
  const bi=wlBigIsle(x,z);if(c>WL_SEA-.13&&bi>.66){return bi<.7?'kueste':pick();}  // große Inseln in Küstennähe und auf hoher See
  if(bi>.72)return bi<.755?'kueste':pick();
  return'meer';}
// ---------- Kerngebiet: Rechtecke der bekannten Welt ----------
const CORE_RECTS=[[HALF,1000,FOREST_END,ZMAX],[HALF,600,ZMIN,FOREST_END],[-HALF,HALF,ZMIN,ZMAX],[-NX1,NX1,NZ0,ZMIN],[WX0,-HALF,ZMIN,ZMAX],[-MX1,MX1,MZ0,NZ0],[1000,2760,-120,1080],[600,1000,-120,120],[840,1640,-760,-120]];
function coreDist(x,z){let d=1e9;for(const[x0,x1,z0,z1]of CORE_RECTS){const q=Math.hypot(x-clamp(x,x0,x1),z-clamp(z,z0,z1));if(q<d)d=q;}return d;}
function coreEdgeH(x,z){let dmin=1e9;const L=[];for(const[x0,x1,z0,z1]of CORE_RECTS){const qx=clamp(x,x0,x1),qz=clamp(z,z0,z1),d=Math.hypot(x-qx,z-qz);L.push([d,clamp(x,x0+.05,x1-.05),clamp(z,z0+.05,z1-.05)]);if(d<dmin)dmin=d;}
  let s=0,w=0;for(const[d,qx,qz]of L){if(d>dmin+40)continue;const k=Math.exp(-(d-dmin)/10);s+=k*getHeight(qx,qz);w+=k;}return{d:dmin,h:s/w};}
// Wie sieht das Kerngebiet am nächsten Randpunkt aus? (für weiche Farbübergänge)
function coreLook(x,z){let best=0,bd=1e9,qx=0,qz=0;CORE_RECTS.forEach(([x0,x1,z0,z1],i)=>{const cx=clamp(x,x0,x1),cz=clamp(z,z0,z1),d=Math.hypot(x-cx,z-cz);if(d<bd){bd=d;best=i;qx=cx;qz=cz;}});
  switch(best){case 0:return'wueste';case 1:return'redwood';case 2:return qz<FOREST_END?'wald':'ebene';case 3:return'nadelwald';case 4:return qx<coastX(qz)+40?'kueste':qz<westForestLimit(qx)?'wald':'ebene';
    case 5:return'schneeberge';case 6:return qx>2380?'ebene':'savanne';case 7:return qx<700?'redwood':'savanne';case 8:return'dschungel';}return'ebene';}
// ---------- Regionen (Voronoi mit Gewichten = unterschiedliche Größen) ----------
const WL_SITES=new Map();let wlSiteN=0;
function wlSite(ci,cj){const key=ci*131071+cj;let s=WL_SITES.get(key);if(s)return s;const A=ci*7+(WSEED%100003),B=cj*13+(WSEED>>>7)%100019;
  const x=(ci+.15+hash2(A,B,4001)*.7)*WL_CELL,z=(cj+.15+hash2(A,B,4002)*.7)*WL_CELL,w=(hash2(A,B,4003)-.5)*140,h=hash2(A,B,4004),h2=hash2(A,B,4005);
  let b=wlPickBiome(x,z,hash2(A,B,4006),h);if(b!=='meer'&&b!=='kueste'&&hash2(A,B,4007)<.013&&coreDist(x,z)>900)b='candy';const big=b==='candy'&&h2<.45,island=b==='meer'&&wlIsleChance(x,z)>h;
  s={ci,cj,x,z,w:big?w*.3+95:w,b,island,big,id:'wl'+ci+'_'+cj,h,R:island?40+h2*35:big?150+h2*30:90+h2*55,cave:null,caveDone:false};WL_SITES.set(key,s);
  if(WL_SITES.size>9000)for(const k of WL_SITES.keys()){WL_SITES.delete(k);if(WL_SITES.size<6000)break;}
  return s;}
// Biom an einem Punkt (im Meer kann es eine Insel sein)
function wlBiomeOf(s,x,z){return s.island&&Math.hypot(x-s.x,z-s.z)<s.R*1.02?'insel':s.b;}
function wlSites(x,z){const ci=Math.floor(x/WL_CELL),cj=Math.floor(z/WL_CELL),out=[];let dmin=1e9;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=wlSite(ci+a,cj+b),d=Math.hypot(x-s.x,z-s.z)-s.w;out.push([s,d]);if(d<dmin)dmin=d;}
  const res=[];let sum=0;for(const[s,d]of out){const k=Math.exp(-(d-dmin)/WL_BLEND);if(k<.02)continue;res.push([s,k]);sum+=k;}
  for(const r of res)r[1]/=sum;res.sort((p,q)=>q[1]-p[1]);return res;}
// ---------- Höhen je Biom ----------
const wsm=t=>t*t*(3-2*t);
function wlBiomeH(b,x,z,s){const ox=x,oz=z;x+=WOX;z+=WOZ;switch(b){
  case'wald':return 3+(fbm(x*.006,z*.006,4,3101)-.5)*14;
  case'ebene':return 2.4+(fbm(x*.004,z*.004,3,3102)-.5)*7;
  case'nadelwald':return 6+(fbm(x*.005,z*.005,4,3103)-.5)*26;
  case'redwood':return 7+(fbm(x*.004,z*.004,4,3104)-.5)*22;
  case'wueste':{const n=fbm(x*.003,z*.003,3,3105),r=Math.abs(Math.sin(x*.045+z*.02+vnoise(x*.01,z*.01,3115)*7));return 4+(n-.5)*10+(1-r)*3.2;}
  case'dschungel':return 4.5+(fbm(x*.006,z*.006,4,3106)-.5)*16;
  case'savanne':{let h=3+(fbm(x*.003,z*.003,3,3107)-.5)*7;const k=vnoise(x*.012,z*.012,3117);if(k>.78)h+=(k-.78)*55;return h;}
  case'kueste':return 1.1+(fbm(x*.01,z*.01,3,3108)-.5)*2.4;
  case'meer':{const h=-7+(fbm(x*.004,z*.004,3,3109)-.5)*4;if(!s.island)return h;const d=Math.hypot(ox-s.x,oz-s.z)/s.R;const k=wsm(clamp(1.15-d,0,1));return Math.max(h,-7+Math.pow(k,1.2)*15+(fbm(x*.012,z*.012,3,3119)-.5)*5*k);}
  case'insel':{const d=Math.hypot(ox-s.x,oz-s.z)/s.R;const k=wsm(clamp(1.15-d,0,1));return -7+Math.pow(k,1.2)*15+(fbm(x*.012,z*.012,3,3119)-.5)*5*k;}
  case'schnee':return 7+(fbm(x*.004,z*.004,4,3110)-.5)*18;
  case'schneeberge':{const r=ridgeN(x*.55,z*.55,3111);return 12+Math.pow(r,1.7)*125+(fbm(x*.01,z*.01,2,3121)-.5)*6;}
  case'steinwueste':{const n=fbm(x*.0035,z*.0035,3,3112)*5,f=Math.floor(n),t=n-f,st=f+wsm(clamp((t-.82)/.18,0,1));return 4+st*9+(vnoise(x*.05,z*.05,3122)-.5)*1.2;}
  case'sumpf':return .12+(fbm(x*.02,z*.02,3,3113)-.5)*1.9;
  case'candy':{let h=3.4+(fbm(x*.005,z*.005,3,3130)-.5)*7;const k=vnoise(x*.03,z*.03,3131);if(k>.66)h+=Math.pow((k-.66)/.34,1.5)*5;return h;}}
  return 2;}
// Hügel und Kuppen: in manchen Gegenden sanft gewellt, hier und da auch steil, anderswo ganz flach
const WL_HILLK={candy:.25,meer:0,kueste:.3,sumpf:.2,insel:.4,schneeberge:.45,steinwueste:.7};
function wlHills(x,z){x+=WOX;z+=WOZ;const m=wsm(clamp((vnoise(x*.0019,z*.0019,4801)-.42)/.3,0,1));let h=0;
  if(m>0)h+=(fbm(x*.011,z*.011,3,4802)-.5)*2*15*m;
  const q=vnoise(x*.0013,z*.0013,4803);if(q>.7){const k=wsm(clamp((q-.7)/.14,0,1));h+=Math.pow(ridgeN(x*1.1,z*1.1,4804),2.2)*24*k;}
  return h;}
function wlRawH(x,z){const S=wlSites(x,z);let h=0,f=0;for(const[s,k]of S){h+=k*wlBiomeH(s.b,x,z,s);const hk=WL_HILLK[s.island?'insel':s.b];f+=k*(hk==null?1:hk);}
  if(f>.01)h+=wlHills(x,z)*f;return h;}
function wlHeight(x,z){if(!WL_READY)return 0;if(Math.abs(x)>WORLD_R+200||Math.abs(z)>WORLD_R+200)return 30;
  const r=wlRawH(x,z),dc=coreDist(x,z);if(dc>=WL_EDGE)return r;const E=coreEdgeH(x,z),t=wsm(clamp(E.d/WL_EDGE,0,1));return E.h*(1-t)+r*t;}
const wlCoreK=(x,z)=>x>60000||inCore(x,z)?0:wsm(clamp(coreDist(x,z)/150,0,1));
function wlGloom(x,z){let g=0;for(const[s,k]of wlSites(x,z))g+=k*WLB[s.b].gloom;return g;}
function wlDom(x,z){return wlSites(x,z)[0][0];}
// ---------- Gebietsname und Musik ----------
{const a0=areaAt;areaAt=function(x,z){if(x<60000&&!inCore(x,z)){const b=wlBiomeOf(wlDom(x,z),x,z),k='wl_'+b;if(!AREAS[k]){AREAS[k]=WLB[b].n;AREA_MUSIC[k]=WLB[b].mus;}return k;}return a0(x,z);};}
// ---------- Grenzen: nur noch der Weltrand ----------
let wlBorderT=0;
clampWorld=function(o){if(o.x>60000)return;const R=WORLD_R-2;if(Math.abs(o.x)>R||Math.abs(o.z)>R){o.x=clamp(o.x,-R,R);o.z=clamp(o.z,-R,R);if(o===P&&time-wlBorderT>6){wlBorderT=time;toast('Hier endet die Welt. Weiter kommt niemand.');}}
  if(o.x>FX0+100&&o.x<FX1&&inCore(o.x,o.z))clampFar(o);};
// ---------- Schwimmen: tiefes Wasser trägt dich an der Oberfläche ----------
const SWIM_Y=WATER-1.25;
// Nur dort schwimmen, wo wirklich Wasser ist (sonst schwebt man über Senken im Wald)
function swimWater(x,z){if(x>=60000)return false;if(!inCore(x,z))return true;if(nearWater(x,z))return true;try{if(typeof kWater==='function'&&kWater(x,z)>.3)return true;}catch(e){}return false;}
{const g0=groundAt;groundAt=function(x,z,feet){const g=g0(x,z,feet);if(x<60000&&g<SWIM_Y&&g>-1e3&&swimWater(x,z))return SWIM_Y;return g;};}
let swimMsg=false;
{const up0=updatePlayer;updatePlayer=function(dt){const px=P.x,pz=P.z;up0(dt);if(P.x<60000&&!P.riding&&getHeight(P.x,P.z)<SWIM_Y-.05&&P.y<=SWIM_Y+.3&&swimWater(P.x,P.z)){P.x=px+(P.x-px)*.55;P.z=pz+(P.z-pz)*.55;
    if(!swimMsg){swimMsg=true;toast('Du schwimmst. Im Wasser kommst du nur langsam voran.');}if(Math.random()<dt*3)spawnParticle(P.x+(Math.random()-.5),WATER+.05,P.z+(Math.random()-.5),0,.4,0,0xe8f4ff,.5,.15);}};}

/* =========================================================
   Bilder der Wildnis: eigener Atlas (Kopien bekannter Pflanzen + neue)
   ========================================================= */
const WL_COPY=['pine0','pine1','pine2','dpine0','dpine1','dpine2','oak0','oak1','oak2','birch0','birch1','bush0','bush1','grass0','grass1','grass2','grass3','tall0','tall1','tall2','flower0','flower1','flower2','flower3',
  'fern0','fern1','rock0','rock1','srock0','srock1','lrock0','lrock1','stump0','rwstump','redwood0','redwood1','redwood2','jtree0','jtree1','jtree2','jpalm0','jpalm1','palm0','palm1','acacia0','acacia1','baobab',
  'cactus0','cactus1','cactus2','bcactus','dshrub','reed0','reed1','sgrass0','sgrass1','sgrass2','termite','bones','jbush0','jbush1','jbush2','jleaf0','jleaf1','mushroom','cmush','dead0','dead1','caveent0','caveent1','caveent2'];
function cvCopy(c,fn){const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const x=o.getContext('2d');x.drawImage(c,0,0);if(fn){const d=x.getImageData(0,0,o.width,o.height),D=d.data,W=o.width,H=o.height;
    const A=(i,j)=>i<0||j<0||i>=W||j>=H?0:D[(j*W+i)*4+3];for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=(j*W+i)*4;if(!D[k+3])continue;const r=fn(D[k],D[k+1],D[k+2],i,j,W,H,A);if(r){D[k]=r[0];D[k+1]=r[1];D[k+2]=r[2];}}x.putImageData(d,0,0);}
  for(const k of['headBox'])if(c[k]!=null)o[k]=c[k];return o;}
const lum=(r,g,b)=>(r*.3+g*.59+b*.11)/255;
function snowify(r,g,b,i,j,W,H,A){const top=!A(i,j-1)||!A(i,j-2),h=hash2(i,j,4401);if(top||(h<.18&&g>r))return[214+h*36,226+h*28,238+h*17];const L=lum(r,g,b);return[r*.85+L*30,g*.85+L*34,b*.85+L*52];}
function wlNewSprites(){const out=[];
  ['pine0','pine1','pine2'].forEach((k,i)=>out.push(['snowpine'+i,cvCopy(SPR[k].c,snowify)]));
  out.push(['snowbush',cvCopy(SPR.bush0.c,snowify)]);out.push(['snowdead',cvCopy(SPR.dead0.c,(r,g,b,i,j,W,H,A)=>!A(i,j-1)?[230,236,244]:null)]);
  const ice=pal(['#4a7a98','#6a9ab8','#8cbcd4','#b4dcec','#e2f4fc']);
  ['rock1','lrock0'].forEach((k,i)=>out.push(['icerock'+i,cvCopy(SPR[k].c,(r,g,b,x,y)=>ice[clamp(Math.floor(lum(r,g,b)*1.35*ice.length),0,ice.length-1)])]));
  out.push(['frost',cvCopy(SPR.flower1.c,(r,g,b)=>g>r&&g>b?null:[180+lum(r,g,b)*70,230,255])]);
  const sw=(r,g,b,i,j)=>{const h=hash2(i,j,4402);if(h<.16)return[50,74,34];return[r*.62,g*.7+8,b*.55];};
  out.push(['swamptree0',cvCopy(SPR.dead0.c,sw)]);out.push(['swamptree1',cvCopy(SPR.dead1.c,sw)]);
  const MS=pal(['#5a2a14','#7a3c1c','#9a5026','#b8683a','#d08850']);
  ['srock0','lrock1'].forEach((k,i)=>out.push(['mesa'+i,cvCopy(SPR[k].c,(r,g,b,x,y)=>{const L=lum(r,g,b)+((y>>2)%2?.06:-.04);return MS[clamp(Math.floor(L*1.3*MS.length),0,MS.length-1)];})]));
  const OB=pal(['#100c16','#1e1626','#2e2238','#4a3a5a']);out.push(['obsid',cvCopy(SPR.rock1.c,(r,g,b,x,y)=>{const h=hash2(x,y,4403);if(h<.05)return[200,180,230];return OB[clamp(Math.floor(lum(r,g,b)*1.2*OB.length),0,OB.length-1)];})]);
  {const p=new Px(26,12),T=pal(['#1e140c','#2e2014','#3e2c1c','#4e3a24']),G=pal(['#2e4a1e','#4a6a2a','#6a8a3a']);for(let y=0;y<12;y++)for(let x=0;x<26;x++){const dx=(x-12.5)/12.5,dy=(y-11)/9;if(dx*dx+dy*dy>1)continue;p.set(x,y,T[shadeIdx(.6-dy*.3+(hash2(x,y,4404)-.5)*.3,T.length,x,y)]);}
    for(const gx of[5,9,14,19])for(let k=0;k<3;k++)p.set(gx+(k%2),3-k+(gx%3),G[k]);outline(p);out.push(['peat',p.done()]);}
  {const p=new Px(12,14),G=pal(['#1e3a1a','#2e5a26','#4a7a34']),Pp=hex('#8a4aa8');for(let y=4;y<14;y++){p.set(6,y,G[1]);if(y%3===0){p.set(5-(y%2),y-1,G[2]);p.set(7+(y%2),y-1,G[2]);p.set(4,y-1,G[0]);p.set(8,y-1,G[0]);}}
    for(const[x,y]of[[6,2],[5,3],[7,3],[6,4],[3,6],[9,6]])p.set(x,y,Pp);outline(p);out.push(['herb',p.done()]);}
  return out;}
const WL_LIST=[];let WL_TEX=null,wlMat=null;
function packWL(){const L=[];for(const k of WL_COPY)if(SPR[k])L.push(['wl_'+k,cvCopy(SPR[k].c)]);for(const[k,c]of wlNewSprites())L.push(['wl_'+k,c]);
  L.sort((a,b)=>b[1].height-a[1].height);const AW=2048;let x=2,y=2,rowH=0;const pos=[];for(const[n,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([n,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  let AH=256;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');
  for(const[n,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[n]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  WL_TEX=new THREE.CanvasTexture(cv);WL_TEX.magFilter=THREE.NearestFilter;WL_TEX.minFilter=THREE.NearestFilter;WL_TEX.generateMipmaps=false;}
{const ba1=buildAtlas;buildAtlas=function(){const t=ba1();try{packWL();}catch(e){console.error('Wildnis-Atlas',e);}return t;};}
// Ernten: dieselben Regeln wie die Vorbilder, Baumstümpfe aus dem eigenen Atlas
for(const k of WL_COPY){const base=k.replace(/\d+$/,''),S=HV[k]||HV[base];if(!S)continue;const C=Object.assign({},S,{st:S.st?'wl_'+S.st:null});HV['wl_'+k]=C;HV['wl_'+base]=HV['wl_'+base]||C;}
Object.assign(HV,{
  wl_snowpine:Object.assign({},HV.pine,{st:'wl_stump0'}),wl_snowbush:Object.assign({},HV.bush),wl_snowdead:Object.assign({},HV.dead,{st:'wl_stump0'}),
  wl_icerock:{t:'rock',hp:45,d:[['ice',1,3,1],['stone',0,1,.5]],re:4320},wl_frost:{t:'soft',hp:1,d:[['frostflower',1,1,1]],re:1440,small:1},
  wl_swamptree:{t:'tree',hp:40,d:[['w_dead',2,3,1],['fiber',1,2,.6]],st:'wl_stump0',re:2880},wl_peat:{t:'soft',hp:18,d:[['peat',2,3,1]],re:2880},
  wl_herb:{t:'soft',hp:1,d:[['swampherb',1,2,1]],re:1440,small:1},wl_mesa:{t:'rock',hp:80,d:[['stone',2,4,1],['clay',1,2,.5]],re:4320},
  wl_obsid:{t:'rock',hp:95,d:[['obsidian',1,2,1],['stone',0,1,.5]],re:4320}});
// ---------- Neue Rohstoffe ----------
Object.assign(ITEMS,{ice:{name:'Eisbrocken',plural:'Eisbrocken'},peat:{name:'Torf',plural:'Torf'},obsidian:{name:'Obsidian',plural:'Obsidian'},frostflower:{name:'Frostblume',plural:'Frostblumen'},swampherb:{name:'Sumpfkraut',plural:'Sumpfkraut'}});
Object.assign(ITEM_DESC,{ice:'Klirrend kalt. Aus den Schneelandschaften',peat:'Brennt lange im Schmelzofen',obsidian:'Schwarzes Glas aus der Steinwüste. Händler zahlen gut',frostblume:'',frostflower:'Blüht nur im ewigen Schnee. Kräuterfrauen lieben sie',swampherb:'Bitter, aber heilsam. Drei davon und eine Blume ergeben einen Heiltrank'});
{const cs1=craftSprites;craftSprites=function(list){cs1(list);
  {const p=new Px(13,12),I=pal(['#4a7a98','#7aaccc','#b4dcec','#eaf8ff']);fPoly(p,[[1,9],[4,2],[8,1],[12,5],[11,10],[5,11]],I,{n:7,na:.3});p.set(5,4,I[3]);p.set(6,4,I[3]);outline(p);list.push(['ice',p.done()]);}
  {const p=new Px(13,10),T=pal(['#1e140c','#2e2014','#44301e','#5a4028']);for(let y=1;y<10;y++)for(let x=1;x<12;x++)p.set(x,y,T[shadeIdx(.6-(y-5)/10+(hash2(x,y,4410)-.5)*.4,T.length,x,y)]);outline(p);list.push(['peat',p.done()]);}
  {const p=new Px(12,12),O=pal(['#0e0a14','#221a30','#3a2e4e','#8a7aa8']);fPoly(p,[[1,10],[3,3],[7,1],[11,4],[10,11]],O,{n:5,na:.2});p.set(6,4,O[3]);p.set(7,5,O[3]);outline(p);list.push(['obsidian',p.done()]);}
  {const p=new Px(12,14),G=pal(['#2a5a3a','#3e7a4a']),F=pal(['#7ab8ff','#b4dcff','#ecf8ff']);for(let y=6;y<14;y++)p.set(6,y,G[1]);for(const[x,y,c]of[[6,2,2],[4,3,1],[8,3,1],[5,4,0],[7,4,0],[6,4,2],[3,5,0],[9,5,0]])p.set(x,y,F[c]);outline(p);list.push(['frostflower',p.done()]);}
  {const p=new Px(12,14),G=pal(['#1e3a1a','#2e5a26','#4a7a34']);for(let y=3;y<14;y++){p.set(6,y,G[1]);if(y%3===0){p.set(4,y,G[2]);p.set(5,y,G[2]);p.set(7,y,G[0]);p.set(8,y,G[0]);}}p.set(6,1,hex('#8a4aa8'));p.set(6,2,hex('#a86ac8'));outline(p);list.push(['swampherb',p.done()]);}};}
FOOD.swampherb=[8,0,'Bitter … aber es tut gut.'];FOOD.frostflower=[4,10,'Eiskalt und süß.'];
RECIPES.push({id:'hpot',need:{swampherb:3,flower:1},bench:1});
try{STALL.Wilma.sell.push(['frostflower',12],['swampherb',4]);STALL.Kuno.sell.push(['obsidian',18],['ice',2],['peat',2]);STALL.Kuno.pool.push(['peat',4]);}catch(e){}

/* =========================================================
   Gelände in Kacheln (80 m), nach Bedarf erzeugt und wieder freigegeben
   ========================================================= */
const WLP={
  wald:[pal(['#23471b','#2e5c21','#3a7128','#4a8731','#5e9e3a'])],ebene:[pal(['#3a6a24','#4a8030','#5c963a','#72aa48','#8cbe58'])],
  nadelwald:[pal(['#1e3420','#28442a','#334f30','#3e5a36','#4a6640']),pal(['#3a2e20','#4a3a28','#5a4630'])],redwood:[pal(['#3a2a1e','#4a3624','#5a422c','#6a4e34']),pal(['#2e4a22','#3c5a2a'])],
  wueste:[pal(['#c8a468','#d6b478','#e2c288','#ecd09a','#f4dcac'])],dschungel:[pal(['#1a3a12','#24501a','#2e6420','#3a7a2a','#4a8a34']),pal(['#3a2e1e','#4a3a24'])],
  savanne:[pal(['#8a7a3a','#a08c44','#b49e52','#c8b264','#d8c478'])],kueste:[pal(['#d0bc90','#dcc8a0','#e8d6b0','#f2e2c0'])],meer:[pal(['#5a5040','#6a5e4a','#7a6c54'])],
  insel:[pal(['#3e7a2a','#4e8e34','#62a040']),pal(['#dcc8a0','#e8d6b0','#f2e2c0'])],schnee:[pal(['#b8c6d4','#ccd8e4','#dce6f0','#eaf0f8','#f8fbff'])],
  schneeberge:[pal(['#c4d0dc','#d8e2ec','#eaf0f8','#ffffff']),pal(['#4a4c52','#5c5e64','#707278','#888a90'])],steinwueste:[pal(['#6a3c22','#7e4a2a','#925834','#a6683e','#ba7a4c','#cc8e5c'])],
  candy:[pal(['#d87aa8','#e690b8','#f0a8c8','#f8c0d8','#fcd6e6']),pal(['#7ad0b0','#90dcc0','#a8e8d0','#c4f2e0'])],
  sumpf:[pal(['#26361c','#2e3e22','#364628','#3e4e2e','#46562e']),pal(['#2e2418','#3a2e1e','#463824'])]};
const WLROCK=pal(['#3e3e42','#505056','#64646a','#7a7a80','#929298']),WLSAND=pal(['#b8a070','#c8b080','#d6c094','#e2cea4']),WLMUD=pal(['#3a3020','#4a3c28','#5a4a32']);
function wlColor(b,h,sl,wx,wz,gx,gy){const P=WLP[b],r=hash2(gx,gy,4501),L=.56+(vnoise(wx*.07,wz*.07,4502)-.5)*.5+(r-.5)*.2;
  if(h<WATER-.2&&b!=='sumpf')return(b==='meer'||h<-2.5?P[0]:WLSAND)[shadeIdx(L-.15+Math.min(.2,-h*.02),3,gx,gy)];
  if(b==='candy'&&h>=WATER+.7){if(r<.018){const C=[[255,90,90],[255,220,80],[120,200,255],[255,255,255],[140,230,120],[200,120,255]];return C[(hash2(gx,gy,4520)*6)|0];}const Q=vnoise(wx*.045,wz*.045,4521)<.33?P[1]:P[0];return Q[shadeIdx(L+.08,Q.length,gx,gy)];}
  if(b==='sumpf'){if(h<WATER+.15)return WLMUD[shadeIdx(L,3,gx,gy)];{const Q=vnoise(wx*.05,wz*.05,4503)<.38?P[1]:P[0];return Q[shadeIdx(L,Q.length,gx,gy)];}}
  if(b==='schneeberge'){if(sl>1.05&&r<.8)return WLROCK[shadeIdx(L,5,gx,gy)];if(h<26&&vnoise(wx*.03,wz*.03,4504)<.5)return P[1][shadeIdx(L+.1,4,gx,gy)];return P[0][shadeIdx(L+.2,4,gx,gy)];}
  if(sl>.95&&b!=='steinwueste')return WLROCK[shadeIdx(L,5,gx,gy)];
  if(h<WATER+.7&&b!=='schnee')return WLSAND[shadeIdx(L,4,gx,gy)];
  if(b==='steinwueste'){const band=Math.floor(h/2.2)%3;return P[0][shadeIdx(L+(band-1)*.13+(sl>.9?-.15:0),6,gx,gy)];}
  if(b==='insel')return(h<2.2?P[1]:P[0])[shadeIdx(L,P[0].length,gx,gy)];
  if(P[1]&&vnoise(wx*.04,wz*.04,4505)<.3)return P[1][shadeIdx(L,P[1].length,gx,gy)];
  return P[0][shadeIdx(L,P[0].length,gx,gy)];}
// Pflanzen und Rohstoffe je Biom: [Bild(ohne wl_), Anteil, Höhe von, Höhe bis, Kollision, Wackeln]
const WLV={
  wald:[['oak',.06,6.5,9.5,.45],['birch',.03,7.5,10,.35],['bush',.05,1,1.4],['grass',.18,.4,.55,0,.08],['flower',.07,.35,.45,0,.05],['fern',.05,.5,.7],['mushroom',.008,.35,.4],['rock',.012,.7,1.1,.3],['stump',.004,.9,1]],
  ebene:[['grass',.32,.4,.55,0,.08],['tall',.12,.5,.8,0,.1],['flower',.11,.35,.45,0,.05],['oak',.008,6,8.5,.45],['bush',.015,1,1.3],['rock',.006,.7,1,.3]],
  nadelwald:[['pine',.12,8,12,.4],['dpine',.05,9,13,.45],['fern',.07,.5,.7],['sgrass',.12,.4,.55,0,.06],['rock',.025,.9,1.5,.4],['mushroom',.01,.35,.4],['stump',.006,.9,1]],
  redwood:[['redwood',.022,26,38,1.5],['dpine',.025,9,13,.45],['fern',.12,.6,.8],['bush',.04,1.1,1.5],['rock',.012,1,1.5,.4]],
  wueste:[['cactus',.018,2.2,3.6,.3],['bcactus',.025,.6,.8],['dshrub',.035,.5,.7],['srock',.015,.6,1.2,.3],['bones',.004,.4,.5]],
  dschungel:[['jtree',.02,15,22,1.1],['jpalm',.045,9,12,.4],['jbush',.11,1.6,2.2],['jleaf',.1,.9,1.2],['fern',.07,.6,.8],['cmush',.006,.5,.6]],
  savanne:[['acacia',.022,5.5,7.5,.4],['baobab',.004,8,10,1.1],['sgrass',.22,.4,.6,0,.08],['tall',.08,.5,.8,0,.1],['termite',.005,1.6,2.2,.4],['dshrub',.02,.5,.7]],
  kueste:[['palm',.02,7,10,.35],['sgrass',.12,.4,.6,0,.08],['reed',.03,.9,1.3,0,.1],['srock',.015,.6,1.1,.3]],
  meer:[],insel:[['palm',.05,7,10,.35],['jbush',.05,1.5,2],['sgrass',.2,.4,.6,0,.08],['rock',.015,.7,1.1,.3]],
  schnee:[['snowpine',.05,7,10.5,.4],['snowbush',.03,1,1.4],['icerock',.014,1,1.8,.45],['frost',.006,.4,.5],['snowdead',.008,6,8,.3]],
  schneeberge:[['snowpine',.025,6.5,9.5,.4],['icerock',.025,1,2,.5],['rock',.03,1,1.8,.45],['frost',.004,.4,.5]],
  steinwueste:[['mesa',.03,2.5,5,.8],['obsid',.0022,1,1.6,.45],['dshrub',.03,.5,.7],['bcactus',.01,.6,.8],['bones',.004,.4,.5],['dead',.004,5,7,.3]],
  candy:[['lolli',.035,4.5,7,.3],['cane',.025,5,8,.3],['cotton',.02,6,8.5,.45],['kandis',.018,1.1,2,.45],['gumdrop',.05,.9,1.3],['sgrassc',.25,.4,.6,0,.08],['sprink',.09,.35,.5,0,.05]],
  sumpf:[['swamptree',.05,6,9,.4],['reed',.22,.9,1.4,0,.1],['peat',.012,.9,1.1],['herb',.02,.45,.55],['cmush',.01,.5,.6],['fern',.05,.5,.7],['dead',.012,5,7,.3]]};
const WL_VAR={lolli:3,cane:2,cotton:2,kandis:2,sgrassc:2,sprink:2,pine:3,dpine:3,oak:3,birch:2,bush:2,grass:4,tall:3,flower:4,fern:2,rock:2,srock:2,redwood:3,jtree:3,jpalm:2,palm:2,acacia:2,cactus:3,reed:2,sgrass:3,jbush:3,jleaf:2,dead:2,snowpine:3,icerock:2,swamptree:2,mesa:2};
const wlSpr=(k,r)=>{const n=WL_VAR[k];if(!n)return'wl_'+k+(SPR['wl_'+k]?'':'0');return'wl_'+k+((r*n)|0);};
const WL_CH=new Map();let wlBuildT=0,wlJob=null,wlFast=false;
function wlChunkInCore(x0,z0){for(const[x1,x2,z1,z2]of CORE_RECTS)if(x0>=x1&&x0+WLC<=x2&&z0>=z1&&z0+WLC<=z2)return true;return false;}
function*wlBuildChunk(ch){const{x0,z0}=ch,N=WLN,S=WLC/N,V=N+1,H=new Float32Array(V*V),B1=new Array(V*V),B2=new Array(V*V),W2=new Float32Array(V*V);const CL=new Array(V*V),CD=new Float32Array(V*V).fill(1e9);
  for(let j=0;j<V;j++){if(j%4===3)yield;for(let i=0;i<V;i++){const x=x0+i*S,z=z0+j*S,k=j*V+i;H[k]=getHeight(x,z);if(!inCore(x,z)){const ss=wlSites(x,z);B1[k]=wlBiomeOf(ss[0][0],x,z);B2[k]=ss[1]?wlBiomeOf(ss[1][0],x,z):B1[k];W2[k]=ss[1]?ss[1][1]:0;const dc=coreDist(x,z);if(dc<80){CD[k]=dc;CL[k]=coreLook(x,z);}}else{B1[k]=B2[k]=CL[k]=coreLook(x,z);W2[k]=0;CD[k]=0;}}}
  // Geometrie (nur Zellen außerhalb des Kerngebiets)
  const pos=new Float32Array(V*V*3),uv=new Float32Array(V*V*2),idx=[],widx=[];let anyWild=false,anyWater=false;
  for(let j=0;j<V;j++)for(let i=0;i<V;i++){const k=j*V+i;pos[k*3]=x0+i*S;pos[k*3+1]=H[k];pos[k*3+2]=z0+j*S;uv[k*2]=i/N;uv[k*2+1]=1-j/N;}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){if(inCore(x0+(i+.5)*S,z0+(j+.5)*S))continue;anyWild=true;const a=j*V+i,b=a+1,c=a+V,d=c+1;idx.push(a,c,b,b,c,d);
    if(Math.min(H[a],H[b],H[c],H[d])<WATER)widx.push(i,j);}
  if(!anyWild){ch.empty=true;return;}yield;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  // Textur: zuerst grob (schnell sichtbar), die feine Fassung kommt später
  Object.assign(ch,{H,B1,B2,W2,CD,CL,N,S,V});
  const tex=yield*wlPaintTex(ch,WL_TEX_LO);
  ch.ground=new THREE.Mesh(g,new THREE.MeshPhongMaterial({map:tex,flatShading:true,shininess:0,specular:0x000000}));scene.add(ch.ground);
  // Wasser
  if(widx.length){const wp=[],wi=[];let n=0;for(let k=0;k<widx.length;k+=2){const x=x0+widx[k]*S,z=z0+widx[k+1]*S;wp.push(x,WATER,z,x+S,WATER,z,x,WATER,z+S,x+S,WATER,z+S);wi.push(n,n+2,n+1,n+1,n+2,n+3);n+=4;}
    const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));wg.setIndex(wi);ch.water=new THREE.Mesh(wg,waterMat);scene.add(ch.water);}
  // Pflanzen, Steine, Rohstoffe
  const r=mulberry32(77777+ch.i*7919+ch.j*104729+WSEED*31),deco=[],props=[];const hAt=(x,z)=>{const fi=(x-x0)/S,fj=(z-z0)/S,i=clamp(Math.floor(fi),0,N-1),j=clamp(Math.floor(fj),0,N-1),u=fi-i,v=fj-j,a=H[j*V+i],b=H[j*V+i+1],c=H[(j+1)*V+i],d=H[(j+1)*V+i+1];return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;};
  yield;for(let t=0;t<1100;t++){if(t%220===219)yield;const x=x0+r()*WLC,z=z0+r()*WLC;if(inCore(x,z)||coreDist(x,z)<6)continue;const ss=wlSites(x,z);let pick=r(),s=ss[0][0];for(const[q,k]of ss){if(pick<k){s=q;break;}pick-=k;}
    const bio=wlBiomeOf(s,x,z),L=WLV[bio];if(!L||!L.length)continue;let roll=r(),it=null;for(const e of L){if(roll<e[1]){it=e;break;}roll-=e[1];}if(!it)continue;
    const h=hAt(x,z),reed=it[0]==='reed';if(h<WATER+(reed?-.5:.15))continue;if(reed&&h>WATER+1.4&&bio!=='sumpf')continue;
    const sl=Math.abs(hAt(x+1,z)-h)+Math.abs(hAt(x,z+1)-h);if(sl>(it[4]?.7:1.2))continue;
    const spr=wlSpr(it[0],r());const sp=SPR[spr];if(!sp)continue;const hh=it[2]+r()*(it[3]-it[2]),w=hh*sp.w/sp.h;
    deco.push({x,y:h-(it[4]?.05:.02),z,w,h:hh,spr,tint:.92+r()*.16,sway:it[5]||0});if(it[4]){const p={x,z,type:'prop',h:1,w:1,r:it[4]};props.push(p);}}
  // Höhleneingänge der Regionen in dieser Kachel
  for(const s of wlChunkSites(ch)){const c=wlCave(s);if(!c||c.x<x0||c.x>=x0+WLC||c.z<z0||c.z>=z0+WLC)continue;const v=s.b==='wueste'||s.b==='steinwueste'||s.b==='savanne'?2:s.b==='schneeberge'||s.b==='nadelwald'?1:0;
    deco.push({x:c.x,y:c.y-.35,z:c.z,w:6.9,h:6.9*60/84,spr:'wl_caveent'+v,tint:1});}
  for(const p of props){const k=gk(p.x,p.z);let l=tgrid.get(k);if(!l)tgrid.set(k,l=[]);l.push(p);}ch.props=props;ch.deco=deco;
  if(deco.length){ch.bb=makeBillboards(deco,wlMat);ch.bb.frustumCulled=false;scene.add(ch.bb);}}
function*wlPaintTex(ch,T){const{x0,z0,H,B1,B2,W2,CD,CL,N,S,V}=ch;const ES=WLC/T,cv=document.createElement('canvas');cv.width=cv.height=T;const ctx=cv.getContext('2d'),img=ctx.createImageData(T,T),D=img.data;
  for(let py=0;py<T;py++){if(py%Math.max(2,Math.round(10*T/512))===Math.max(2,Math.round(10*T/512))-1)yield;const wz=z0+(py+.5)*ES,gy=Math.floor(wz/ES),fj=(py+.5)/T*N;for(let px=0;px<T;px++){const wx=x0+(px+.5)*ES,gx=Math.floor(wx/ES),fi=(px+.5)/T*N;
      const i=clamp(Math.round(fi+(hash2(gx,gy,4510)-.5)*1.1),0,N),j=clamp(Math.round(fj+(hash2(gx,gy,4511)-.5)*1.1),0,N),k=j*V+i;
      let b=B1[k];if(!b){const o=(py*T+px)*4;D[o]=D[o+1]=D[o+2]=90;D[o+3]=255;continue;}if(W2[k]>0&&vnoise(wx*.11,wz*.11,4512)*.75+hash2(gx>>1,gy>>1,4513)*.25<W2[k])b=B2[k];if(CD[k]<80&&vnoise(wx*.13,wz*.13,4514)*.6+hash2(gx,gy,4515)*.4>CD[k]/80)b=CL[k];
      const ii=Math.min(N-1,Math.floor(fi)),jj=Math.min(N-1,Math.floor(fj)),u=fi-ii,v=fj-jj,a=H[jj*V+ii],bb=H[jj*V+ii+1],c=H[(jj+1)*V+ii],d=H[(jj+1)*V+ii+1];
      const h=a*(1-u)*(1-v)+bb*u*(1-v)+c*(1-u)*v+d*u*v,sl=Math.hypot((bb-a+d-c)*.5,(c-a+d-bb)*.5)/S;
      const col=wlColor(b,h,sl,wx,wz,gx,gy),o=(py*T+px)*4;D[o]=col[0];D[o+1]=col[1];D[o+2]=col[2];D[o+3]=255;}}
  ctx.putImageData(img,0,0);const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestMipmapNearestFilter;
  return tex;}
const WL_TEX_LO=96,WL_TEX_HI=512;
// Feine Textur nachreichen (nur wenn alle Kacheln in der Nähe schon stehen)
function*wlRefine(ch){const tex=yield*wlPaintTex(ch,WL_TEX_HI);if(ch.ground){const old=ch.ground.material.map;ch.ground.material.map=tex;ch.ground.material.needsUpdate=true;if(old)old.dispose();}else tex.dispose();ch.hi=true;}
function wlFreeChunk(ch){if(ch.ground){scene.remove(ch.ground);ch.ground.geometry.dispose();ch.ground.material.map.dispose();ch.ground.material.dispose();}
  if(ch.water){scene.remove(ch.water);ch.water.geometry.dispose();}if(ch.bb){scene.remove(ch.bb);ch.bb.geometry.dispose();}
  for(const p of ch.props||[]){const l=tgrid.get(gk(p.x,p.z));if(l){const i=l.indexOf(p);if(i>=0)l.splice(i,1);}}
  for(const b of ch.deco||[])if(b._hv){const c=hvCell(b.x,b.z),l=HG.get(c);if(l){const i=l.indexOf(b);if(i>=0)l.splice(i,1);if(!l.length)HG.delete(c);}if(HK.get(b._hk)===b)HK.delete(b._hk);HGONE.delete(b);}
  ch.ground=ch.water=ch.bb=null;ch.props=ch.deco=null;ch.H=ch.B1=ch.B2=ch.W2=ch.CD=ch.CL=null;}
function wlChunkSites(ch){const out=new Set();for(const[dx,dz]of[[0,0],[WLC,0],[0,WLC],[WLC,WLC],[WLC/2,WLC/2]]){const ci=Math.floor((ch.x0+dx)/WL_CELL),cj=Math.floor((ch.z0+dz)/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)out.add(wlSite(ci+a,cj+b));}return out;}
function wlUpdate(){if(!WL_READY||!wlMat)return;const cx=camera.position.x,cz=camera.position.z;if(cx>60000){return;}
  const rd=(settings.renderDist||140)+70,ci=Math.floor(cx/WLC),cj=Math.floor(cz/WLC),R=Math.ceil(rd/WLC)+1;let best=null,bd=1e9;
  for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){const i=ci+a,j=cj+b,x0=i*WLC,z0=j*WLC;if(Math.abs(x0)>WORLD_R+WLC||Math.abs(z0)>WORLD_R+WLC)continue;
    const d=Math.max(0,Math.hypot(x0+WLC/2-cx,z0+WLC/2-cz)-WLC*.71);if(d>rd)continue;const key=i*100003+j;let ch=WL_CH.get(key);if(!ch){if(wlChunkInCore(x0,z0))continue;ch={i,j,x0,z0,built:false};WL_CH.set(key,ch);}
    if(!ch.built&&d<bd){bd=d;best=ch;}}
  // Eine Verfeinerung wird abgebrochen, sobald eine neue Kachel gebaut werden muss
  if(wlJob&&wlJob.refine&&best){wlJob.ch.refining=false;wlJob=null;}
  if(!wlJob&&best){best.built=true;wlJob={ch:best,g:wlBuildChunk(best)};}
  if(!wlJob&&!best){let rf=null,rd2=1e9;for(const ch of WL_CH.values()){if(!ch.ground||ch.hi||!ch.H)continue;const d=Math.hypot(ch.x0+WLC/2-cx,ch.z0+WLC/2-cz);if(d<rd2&&d<rd*.75){rd2=d;rf=ch;}}
    if(rf){rf.refining=true;wlJob={ch:rf,g:wlRefine(rf),refine:true};}}
  // Steht der Spieler auf (oder direkt neben) einer noch leeren Kachel, mehr Rechenzeit geben
  const urgent=wlJob&&!wlJob.refine&&Math.hypot(wlJob.ch.x0+WLC/2-cx,wlJob.ch.z0+WLC/2-cz)<WLC*1.3;
  if(wlJob){const t0=performance.now(),bud=wlFast?1e9:urgent?22:wlJob.refine?5:9;try{while(performance.now()-t0<bud){if(wlJob.g.next().done){wlJob=null;break;}}}catch(e){console.error('Wildnis-Kachel',e);wlJob=null;}}
  for(const[k,ch]of WL_CH){const d=Math.max(0,Math.hypot(ch.x0+WLC/2-cx,ch.z0+WLC/2-cz)-WLC*.71);if(d>rd+90&&!(wlJob&&wlJob.ch===ch)){if(ch.built)wlFreeChunk(ch);WL_CH.delete(k);}}}
{const ud0=updateDesert;updateDesert=function(){ud0();try{wlUpdate();}catch(e){if(!wlUpdate.err){wlUpdate.err=1;console.error('Wildnis',e);}}};}
{const id0=initDemons;initDemons=function(a){id0(a);try{wlMat=bbMaterial(WL_TEX,0,0);wlMat.uniforms.time=decorMat.uniforms.time;EXTRA_BB.push(wlMat);}catch(e){console.error(e);}};}

/* =========================================================
   Höhlen der Wildnis: Eingänge in vielen Regionen, Innenräume aus einem Vorrat
   ========================================================= */
const WL_CAVE_SLOTS=12;let wlSlot0=-1;
{const pc0=placeCaveEntrances;placeCaveEntrances=function(){pc0();wlSlot0=CAVES.length;for(let k=0;k<WL_CAVE_SLOTS;k++){const i=CAVES.length;CAVES.push({i,ex:-9e6,ez:-9e6,ea:0,reg:'old',wild:1,village:false,spiders:k%3===1,moles:k%4===2,mine:k%2===0});}};}
function wlCave(s){if(s.caveDone)return s.cave;s.caveDone=true;const B=WLB[s.island?'insel':s.b];if(!B.cave||hash2(s.ci,s.cj,4601+WSEED%997)>B.cave*.3)return null;
  const r=mulberry32(4700+s.ci*7919+s.cj*15485+WSEED*17);for(let t=0;t<40;t++){const a=r()*6.283,d=(s.island?10:40)+r()*(s.R*(s.island?.6:.8)),x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(inCore(x,z)||coreDist(x,z)<60||Math.abs(x)>WORLD_R-50||Math.abs(z)>WORLD_R-50)continue;
    const y=getHeight(x,z);if(y<WATER+.8)continue;const sl=Math.abs(getHeight(x+2,z)-y)+Math.abs(getHeight(x,z+2)-y);if(sl>2.2)continue;if(wlDom(x,z)!==s)continue;
    s.cave={x,z,y,ea:r()*6.283,id:s.id};return s.cave;}return null;}
function wlCaveNear(){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=wlSite(ci+a,cj+b),c=wlCave(s);if(c&&Math.hypot(c.x-P.x,c.z-P.z)<4)return[s,c];}return null;}
{const dl2=doorLooked;doorLooked=function(){const d=dl2();if(d)return d;if(P.x<60000&&!inCore(P.x,P.z)){const q=wlCaveNear();if(q){const[s,c]=q;if(lookingAt(c.x,c.y+1,c.z,4.5,.45)){
      let h=0;for(const ch of c.id)h=(h*31+ch.charCodeAt(0))|0;return{kind:'caveEnter',i:wlSlot0+((h>>>0)%WL_CAVE_SLOTS),wild:c,site:s};}}}return null;};}
{const ud3=useDoor;useDoor=function(d){if(d&&d.kind==='caveEnter'&&d.wild){const C=CAVES[d.i],c=d.wild;C.ex=c.x;C.ez=c.z;C.ea=c.ea;C.ey=c.y;C.reg=WLB[d.site.island?'insel':d.site.b].reg;
    FLAGS.wcaves=FLAGS.wcaves||{};const S=FLAGS.wcaves[c.id]=FLAGS.wcaves[c.id]||{mined:{},torches:[]};FLAGS.caves=FLAGS.caves||{};FLAGS.caves[d.i]=S;if(caveBuiltI===d.i)disposeCave();}
  ud3(d);};}
{const sp3=storyPrompt2;storyPrompt2=function(){const t=sp3();if(t)return t;if(P.x<60000&&!inCore(P.x,P.z)&&wlCaveNear())return'Höhle betreten';return null;};}


/* =========================================================
   Tiere der Wildnis: jedes Biom hat seine eigenen Tiere. Sie erscheinen,
   wenn du einer Region nahe kommst, und verschwinden, wenn du weit weg bist.
   ========================================================= */
// A = heimische Tiere (Reh, Wolf, Bär …), W = Wildtiere (Zebra, Gnu, Krokodil …): [Art, min, max]
const WL_FAUNA={
  wald:[['A','deer',2,4],['A','boar',2,3],['A','hare',1,2],['A','fox',1,1]],
  ebene:[['A','hare',2,3],['A','deer',2,3],['A','fox',1,1]],
  nadelwald:[['A','elk',1,2],['A','wolf',3,5],['A','bear',1,1],['A','fox',1,1]],
  redwood:[['A','deer',2,3],['A','bear',1,1],['A','elk',1,2]],
  wueste:[['W','ostrich',3,5],['W','snake',1,1]],
  dschungel:[['W','baboon',4,6],['W','snake',1,1],['A','boar',2,3],['W','elephant',2,4]],
  savanne:[['W','zebra',5,8],['W','gazelle',5,8],['W','gnu',6,9],['W','giraffe',2,4],['W','elephant',3,5],['W','ostrich',3,4],['W','cheetah',2,2],['W','wilddog',5,7],['W','warthog',3,5]],
  kueste:[['A','hare',1,2],['A','boar',1,2]],
  meer:[],insel:[['A','hare',2,3],['A','boar',1,2]],
  schnee:[['A','wolf',3,4],['A','elk',1,2],['A','hare',1,2],['A','fox',1,1]],
  schneeberge:[['A','wolf',2,3],['A','elk',1,2]],
  steinwueste:[['W','baboon',4,6],['W','gazelle',4,6],['W','snake',1,1]],
  candy:[],
  sumpf:[['W','croc',1,1],['W','croc',1,1],['W','snake',1,1],['A','boar',2,3],['A','hare',1,2]]};
const WL_WSP_OK={zebra:['savanne'],gazelle:['savanne','steinwueste'],gnu:['savanne'],giraffe:['savanne'],elephant:['savanne','dschungel'],ostrich:['savanne','wueste'],
  cheetah:['savanne'],wilddog:['savanne'],warthog:['savanne'],baboon:['steinwueste','dschungel'],snake:['wueste','steinwueste','dschungel','sumpf'],croc:['sumpf']};
const wlWild=(x,z)=>x<60000&&!inCore(x,z);
{const wl0=wLand;wLand=function(sp,x,z){if(wlWild(x,z)){const ok=WL_WSP_OK[sp==='lioness'?'lion':sp];if(!ok)return false;const b=wlBiomeOf(wlDom(x,z),x,z);if(!ok.includes(b))return false;
    const g=getHeight(x,z);return WSP[sp]&&WSP[sp].water?g<WATER-.2:g>WATER+.25;}return wl0(sp,x,z);};}
// Freie Plätze für heimische Tiere (fester Vorrat, damit das Tier-Bild nicht wächst)
const WL_ANI_N=300,WL_ANI=[];
{const af0=addFarmAnimals;addFarmAnimals=function(){af0();for(let k=0;k<WL_ANI_N;k++){const s=SPR.an_deer0_0;const a={type:'deer',male:false,x:0,z:-9e6,hx:0,hz:-9e6,y:-999,tx:0,tz:-9e6,h:1.56,w:1.56*s.w/s.h,state:'idle',t:1,anim:0,frame:0,flip:false,roam:30,alive:false,corpse:null,hp:1,tame:true,wlFree:true};animals.push(a);WL_ANI.push(a);}};}
const WL_ACTIVE=new Map();
function wlFaunaSpot(s,r,want,near){for(let t=0;t<40;t++){const a=r()*6.283,d=near?60+r()*140:r()*s.R;const x=(near?P.x:s.x)+Math.cos(a)*d,z=(near?P.z:s.z)+Math.sin(a)*d;
    if(!wlWild(x,z)||coreDist(x,z)<30||wlDom(x,z)!==s)continue;const g=getHeight(x,z);if(want==='water'?g>WATER-.4:g<WATER+.3)continue;if(want!=='water'&&(Math.abs(getHeight(x+2,z)-g)>1.6))continue;return[x,z];}return null;}
function wlSpawnAnimal(type,x,z,ex){const a=WL_ANI.find(a=>a.wlFree);if(!a)return null;const A=ANIMALS[type],male=ex&&ex.male,spr='an_'+type+(male?1:0)+'_0',sp=SPR[spr];if(!sp)return null;const h=male&&A.hm?A.hm:A.h;
  Object.assign(a,{type,male:!!male,v:undefined,x,z,hx:x,hz:z,tx:x,tz:z,y:getHeight(x,z),h,w:h*sp.w/sp.h,state:'idle',t:Math.random()*4,anim:0,frame:0,alive:true,corpse:null,hp:ANIMAL_HP[type]||60,
    tame:false,wlFree:false,scared:0,berserk:false,pack:undefined,ox:0,oz:0,roam:type==='hare'?14:type==='bear'?50:type==='wolf'?90:35,aggro:false,hurt:0},ex||{});return a;}
function wlFreeAnimal(a){a.alive=false;a.corpse=null;a.tame=true;a.wlFree=true;a.x=a.hx=a.tx=0;a.z=a.hz=a.tz=-9e6;const i=HOSTILES.indexOf(a);if(i>=0)HOSTILES.splice(i,1);}
function wlPopulate(s){const bio=s.island?'insel':s.b,T=WL_FAUNA[bio]||[];if(!T.length)return[];const r=mulberry32(9100+s.ci*7919+s.cj*104729+WSEED*13+(Math.floor(gameMinutes()/1440)*31)),out=[];
  const picks=T.slice().sort(()=>r()-.5).slice(0,3+(r()<.6?1:0)+(r()<.3?1:0));
  for(const[k,sp,mn,mx]of picks){const n=Math.round((mn+Math.floor(r()*(mx-mn+1)))*2);
    if(k==='A'){const q=wlFaunaSpot(s,r,'land',true)||wlFaunaSpot(s,r,'land',false);if(!q)continue;let lead=null;for(let i=0;i<n;i++){const x=q[0]+(i?(r()-.5)*7:0),z=q[1]+(i?(r()-.5)*7:0);
        const a=wlSpawnAnimal(sp,x,z,sp==='deer'||sp==='elk'?{male:i===0&&r()<.6}:null);if(!a)break;if(sp==='wolf'){if(!lead){lead=a;a.pack=a;a.roam=120;}else{a.pack=lead;a.ox=(r()-.5)*8;a.oz=(r()-.5)*8;}HOSTILES.push(a);}out.push(['A',a]);}}
    else{const water=sp==='croc'||sp==='hippo',q=wlFaunaSpot(s,r,water?'water':'land',true)||wlFaunaSpot(s,r,water?'water':'land',false);if(!q)continue;const[x,z]=q;let g;
      if(sp==='croc'){g=wGroup('croc',x,z,6,1,1,{lurk:{x,z},wl:1});wSpawn(g,'croc',x,z,{inWater:1});}
      else if(sp==='snake'){g=wGroup('snake',x,z,40,1,1,{wl:1});wSpawn(g,'snake',x,z);}
      else if(sp==='cheetah'||sp==='wilddog'){g=wGroup(sp,x,z,sp==='cheetah'?320:420,mn,mx,{st:'rest',hunger:.5,lair:{x,z},wl:1});for(let i=0;i<n;i++)wSpawn(g,sp,x+(r()-.5)*8,z+(r()-.5)*8);}
      else{g=wGroup(sp,x,z,Math.min(s.R,sp==='elephant'?260:180),mn,mx,{wl:1});for(let i=0;i<n;i++)wSpawn(g,sp,x+(r()-.5)*10,z+(r()-.5)*10,sp==='hippo'?{inWater:1}:null);}
      out.push(['W',g]);}}
  return out;}
function wlDespawn(list){for(const[k,o]of list){if(k==='A'){if(!o.wlFree)wlFreeAnimal(o);}
  else{for(const m of WM.filter(m=>m.g===o))wRemove(m);o.min=0;o.max=0;o.dead=1;o.x=o.cx=o.tx=0;o.z=o.cz=o.tz=-9e6;if(o.lurk){o.lurk.x=0;o.lurk.z=-9e6;}if(o.lair){o.lair.x=0;o.lair.z=-9e6;}}}}
function wlFaunaReset(){for(const[,v]of WL_ACTIVE)wlDespawn(v.list);WL_ACTIVE.clear();}
let wlFaunaT=0;
function wlFaunaTick(dt){wlFaunaT-=dt;if(wlFaunaT>0)return;wlFaunaT=1.5;if(!WL_READY||!wInit)return;
  // tote oder weggelaufene Tiere zurück in den Vorrat
  for(const a of WL_ANI)if(!a.wlFree&&(!a.alive&&a.corpse==null||Math.hypot(a.x-P.x,a.z-P.z)>900))wlFreeAnimal(a);
  if(P.x>60000)return;
  for(const[id,v]of WL_ACTIVE){const d=Math.hypot(v.s.x-P.x,v.s.z-P.z);if(d>v.s.R+760){wlDespawn(v.list);WL_ACTIVE.delete(id);}}
  const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=wlSite(ci+a,cj+b);if(WL_ACTIVE.has(s.id)||coreDist(s.x,s.z)<60)continue;const d=Math.hypot(s.x-P.x,s.z-P.z);
    if(d<s.R+320){WL_ACTIVE.set(s.id,{s,list:wlPopulate(s)});}}
}
{const ua=updateAnimals;updateAnimals=function(dt){ua(dt);if(state==='playing')try{wlFaunaTick(dt);}catch(e){if(!wlFaunaTick.err){wlFaunaTick.err=1;console.error('Wildnis-Tiere',e);}}};}
/* =========================================================
   Alte Spielstände: Innenräume liegen jetzt hinter dem Weltrand (x ≥ 60000)
   ========================================================= */
{const lg1=loadGame;loadGame=function(){const ok=lg1();if(ok&&!FLAGS.intShift){const sh=v=>v>3000&&v<30000?v+57000:v;P.x=sh(P.x);if(P.safe)P.safe[0]=sh(P.safe[0]);
    if(FLAGS.furn)FLAGS.furn.forEach(f=>{f[1]=sh(f[1]);});if(FLAGS.grave)FLAGS.grave.forEach(g=>{g[2]=sh(g[2]);});if(FLAGS.caves)for(const k in FLAGS.caves){const S=FLAGS.caves[k];if(S&&S.torches)S.torches.forEach(t=>{t[0]=sh(t[0]);});}
    if(FLAGS.mini&&FLAGS.mini.pos)FLAGS.mini.pos[0]=sh(FLAGS.mini.pos[0]);}if(ok)FLAGS.intShift=1;return ok;};}
function wlReset(){if(wlJob)wlJob=null;for(const ch of WL_CH.values())if(ch.built)wlFreeChunk(ch);WL_CH.clear();WL_SITES.clear();if(typeof wlFaunaReset==='function')wlFaunaReset();}
{const sg4=startGame;startGame=function(isNew,char){sg4(isNew,char);if(isNew)FLAGS.intShift=1;
  if(isNew||!FLAGS.wseed)FLAGS.wseed=1+Math.floor(Math.random()*2e9);if(FLAGS.wseed!==WSEED){wlSetSeed(FLAGS.wseed);wlReset();}};}
WL_READY=true;
