/* =========================================================
   0.0.113 · Die Dungeon-Stadt und der Große Turm
   - 2500 m westlich vom Spawn steht ein riesiger runder Turm (120 m Durchmesser, höher als man sehen kann)
   - Eine verwinkelte Straße führt vom Spawn dorthin (im Westen weiter über einen Damm durch die Wildnis),
     reisende Händler ziehen hin und her
   - Rund um den Turm: die Dungeon-Stadt, eine freie Stadt unter der Herrschaft der Gilde. Stadtmauer mit 4 Toren,
     Wachen, Einwohner, Marktstände, Kaufhäuser, Wohnhäuser, ein riesiges Gildenhaus, Heldenstatuen und eine große Arena
   ========================================================= */
const TWC={x:SPAWN.x-2500,z:SPAWN.z,H:6,R:60,WR:232,TOP:1600};
const AR={x:TWC.x-20,z:TWC.z+150,R0:32,R1:50};
const GH={x:TWC.x-10,z:TWC.z-150,w:56,d:34,h:16};
const TWH={x:TWC.x+96,z:TWC.z-66,w:10,d:8,h:4.2};
const twD=(x,z)=>Math.hypot(x-TWC.x,z-TWC.z);
// =========================================================
// Die Straße
// =========================================================
// Die Straße wird für jede Welt neu gesucht (A*-Wegsuche): sie meidet Meer, Seen und steile Berge,
// windet sich durch die Biome und nimmt lieber einen Umweg als eine Brücke.
const TRD={core:[],wild:[],all:[],len:[],grid:new Map(),G:64,seed:null,busy:false,total:1};
function trdBuild(){TRD.busy=true;TRD.seed=WSEED;try{
  const zf=x=>x<-HALF?pathZW(x):pathZ(x),SX=-850,core=[];for(let x=-20;x>=SX;x-=10)core.push([x,zf(x)]);
  const S=16,X0=-2760,X1=-60,Z0=-900,Z1=1500,NC=Math.ceil((X1-X0)/S),NR=Math.ceil((Z1-Z0)/S),N=NC*NR,cost=new Float32Array(N),hgt=new Float32Array(N);
  const nz=(x,z)=>{const f=(q,sc,sd)=>{const gx=x/sc,gz=z/sc,ix=Math.floor(gx),iz=Math.floor(gz),fx=gx-ix,fz=gz-iz,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz),h=(a,b)=>hash2(a,b,sd+(WSEED%997));
    return(h(ix,iz)*(1-u)+h(ix+1,iz)*u)*(1-v)+(h(ix,iz+1)*(1-u)+h(ix+1,iz+1)*u)*v;};return f(0,140,8101)*.7+f(0,48,8102)*.3;};
  const gate=[TWC.x+TWC.WR+22,TWC.z];
  for(let r=0;r<NR;r++)for(let c=0;c<NC;c++){const i=r*NC+c,x=X0+(c+.5)*S,z=Z0+(r+.5)*S,h=getHeight(x,z);hgt[i]=h;let k=1+Math.pow(nz(x,z),2)*6;
    if(h<WATER+.7)k=h<WATER-2?400:80;else{if(h<WATER+2)k*=5;if(h>30)k*=3;if(inCore(x,z))k*=2.5;const d=twD(x,z);if(d<TWC.WR+14)k=-1;}
    cost[i]=k;}
  const idx=(x,z)=>{const c=clamp(Math.floor((x-X0)/S),0,NC-1),r=clamp(Math.floor((z-Z0)/S),0,NR-1);return r*NC+c;};
  const st=idx(SX,zf(SX)),gl=idx(gate[0],gate[1]);cost[st]=Math.max(cost[st],1);cost[gl]=1;
  const gS=new Float32Array(N).fill(1e30),from=new Int32Array(N).fill(-1),done=new Uint8Array(N),heap=[];const gx=gl%NC,gz=(gl/NC)|0;
  const hu=i=>Math.hypot(i%NC-gx,((i/NC)|0)-gz)*.9;
  const push=(i,f)=>{heap.push([f,i]);let k=heap.length-1;while(k){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p;}};
  const pop=()=>{const t=heap[0],l=heap.pop();if(heap.length){heap[0]=l;let k=0;for(;;){const a=2*k+1,b=a+1;let m=k;if(a<heap.length&&heap[a][0]<heap[m][0])m=a;if(b<heap.length&&heap[b][0]<heap[m][0])m=b;if(m===k)break;[heap[m],heap[k]]=[heap[k],heap[m]];k=m;}}return t;};
  gS[st]=0;push(st,hu(st));const NB=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];let found=false,it=0;
  while(heap.length&&it<400000){it++;const[,i]=pop();if(done[i])continue;done[i]=1;if(i===gl){found=true;break;}const c=i%NC,r=(i/NC)|0;
    for(const[dc,dr,L]of NB){const c2=c+dc,r2=r+dr;if(c2<0||r2<0||c2>=NC||r2>=NR)continue;const j=r2*NC+c2;if(done[j]||cost[j]<0)continue;
      const sl=Math.abs(hgt[j]-hgt[i])/(S*L),g=gS[i]+L*(cost[i]+cost[j])*.5*(1+sl*sl*60);if(g<gS[j]){gS[j]=g;from[j]=i;push(j,g+hu(j));}}}
  let pts=[];if(found){for(let i=gl;i>=0;i=from[i]){pts.push([X0+(i%NC+.5)*S,Z0+(((i/NC)|0)+.5)*S]);if(i===st)break;}pts.reverse();}
  else pts=[[SX,zf(SX)],gate];
  pts[0]=[SX,zf(SX)];pts.push(gate);
  // vereinfachen und glätten
  const simp=[pts[0]];for(let i=2;i<pts.length;i+=2)simp.push(pts[i]);if(simp[simp.length-1]!==pts[pts.length-1])simp.push(pts[pts.length-1]);pts=simp;
  for(let k=0;k<3;k++){const o=[pts[0]];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}o.push(pts[pts.length-1]);pts=o;}
  const W=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/2));for(let k=0;k<n;k++)W.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}
  W.push(pts[pts.length-1]);W.push([TWC.x+TWC.WR,TWC.z]);W.push([TWC.x+200,TWC.z]);
  TRD.core=core;TRD.wild=W;TRD.all=core.concat(W);TRD.len=[0];let s=0;for(let i=1;i<TRD.all.length;i++){s+=Math.hypot(TRD.all[i][0]-TRD.all[i-1][0],TRD.all[i][1]-TRD.all[i-1][1]);TRD.len.push(s);}TRD.total=s;
  TRD.grid=new Map();for(let i=0;i<W.length-1;i++){const k=Math.floor(W[i][0]/TRD.G)*100003+Math.floor(W[i][1]/TRD.G);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const kk=k+a*100003+b;let l=TRD.grid.get(kk);if(!l)TRD.grid.set(kk,l=[]);l.push(i);}}
  TRD.found=found;}catch(e){console.error('Straße',e);}TRD.busy=false;}
const trdOk=()=>{if(TRD.busy||!WL_READY)return false;if(TRD.seed!==WSEED)trdBuild();return!TRD.busy;};
function roadD(x,z){if(x>-40||x<-2800||!trdOk())return 1e9;const l=TRD.grid.get(Math.floor(x/TRD.G)*100003+Math.floor(z/TRD.G));if(!l)return 1e9;let best=1e9;const W=TRD.wild;
  for(const i of l){const a=W[i],b=W[i+1];const dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz||1;let t=((x-a[0])*dx+(z-a[1])*dz)/L2;t=t<0?0:t>1?1:t;const d=Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);if(d<best)best=d;}return best;}
function roadAt(s){trdOk();s=clamp(s,0,TRD.total);let lo=0,hi=TRD.len.length-1;if(hi<1)return[SPAWN.x,SPAWN.z,0];while(hi-lo>1){const m=(lo+hi)>>1;if(TRD.len[m]<=s)lo=m;else hi=m;}const a=TRD.all[lo],b=TRD.all[hi],L=TRD.len[hi]-TRD.len[lo]||1,t=(s-TRD.len[lo])/L;return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,Math.atan2(b[1]-a[1],b[0]-a[0])];}
// ---------- Gelände: Stadtplateau ----------
{const a=wlRawH;wlRawH=function(x,z){let h=a(x,z);const d=twD(x,z);if(d<420){const w=wsm(clamp((420-d)/120,0,1));h=h*(1-w)+TWC.H*w;return h;}
  // Wo der Weg durch Wasser müsste, entsteht ein schmaler Landstreifen (keine Brücke)
  if(h<WATER+1.4&&!TRD.busy&&TRD.seed===WSEED){const r=roadD(x,z);if(r<16){const w=wsm(clamp((16-r)/11,0,1));h=Math.max(h,h*(1-w)+(WATER+1.4)*w);}}return h;};}
// keine fremden Bauwerke in der Stadt oder auf der Straße
const twBlock=(x,z)=>twD(x,z)<470||roadD(x,z)<28;
for(const fn of['wlGy','dgOf','vlgOf','cryptOf','ruinOf','wreckOf','cityOf'])try{const a=eval(fn);const w=function(s){const g=a(s);if(g&&twBlock(g.x,g.z)){const k={wlGy:'gy',dgOf:'dg',vlgOf:'vg',cryptOf:'cp',ruinOf:'ru',wreckOf:'wr',cityOf:'ct'}[fn];s[k]=null;return null;}return g;};eval(fn+'=w');}catch(e){console.error('Turm: Sperre',fn,e);}
{const a=wlCave;wlCave=function(s){const c=a(s);if(c&&twBlock(c.x,c.z)){s.cave=null;return null;}return c;};}
// ---------- Biome: Stadt, Straße ----------
Object.assign(WLB,{stadt:{n:'Die Dungeon-Stadt',mus:'orte/coda',gloom:0,cave:0,reg:'plain'},stadtrand:{n:'Die Dungeon-Stadt',mus:'orte/coda',gloom:0,cave:0,reg:'plain'},strasse:{n:'Straße',mus:'orte/ebene',gloom:0,cave:0,reg:'plain'}});
Object.assign(WLV,{stadt:[],stadtrand:[['grass',.2,.4,.55,0,.08],['flower',.04,.35,.45,0,.05]],strasse:[]});
Object.assign(WLP,{stadt:[pal(['#5a5650','#6a665e','#7a766c','#8a857a']),pal(['#4e4a44','#5e5a52'])],stadtrand:WLP.ebene,strasse:[pal(['#3d2b1c','#4c3722','#5d452a','#6f5434','#846640']),pal(['#5d452a','#6f5434'])]});
try{Object.assign(FA_BIO,{stadt:[],stadtrand:[],strasse:[]});Object.assign(FA_TGT,{stadt:0,stadtrand:0,strasse:0});Object.assign(MAPC,{wl_stadt:[120,116,108],wl_strasse:[150,120,80]});}catch(e){}
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){const d=twD(x,z);if(d<TWC.WR+4)return'stadt';if(d<330)return'stadtrand';const b=a(s,x,z);if(b==='meer'||b==='tiefsee')return b;if(roadD(x,z)<2.2)return'strasse';return b;};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(k==='wl_stadtrand')return'wl_stadt';if(k==='wl_strasse'){const b=wlDom(x,z).b;if(!AREAS['wl_'+b]&&WLB[b]){AREAS['wl_'+b]=WLB[b].n;AREA_MUSIC['wl_'+b]=WLB[b].mus;}return'wl_'+b;}
  if(k==='wl_stadt'&&Math.hypot(x-AR.x,z-AR.z)<AR.R0)return'tw_arena';return k;};}
AREAS.tw_arena='Die große Arena';AREA_MUSIC.tw_arena='orte/coda';try{MAPC.tw_arena=[190,160,110];WX_NONE.add('tw_arena');}catch(e){}
{const a=mzBlocked;mzBlocked=function(){return a()||twD(P.x,P.z)<TWC.WR+40;};}
// =========================================================
// Straße als Belag (Wildnis) mit Brücke übers Wasser
// =========================================================
let RDM=null;function rdMats(){if(RDM)return RDM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  // Ein ganz normaler Erdweg wie überall im Spiel: Erdfarben, Kiesel, ausgefranste Ränder
  const p=new Px(16,32),S=pal(['#3d2b1c','#4c3722','#5d452a','#6f5434','#846640']),PB=pal(['#6a665e','#8a857a']);
  for(let y=0;y<32;y++)for(let x=0;x<16;x++){const e=Math.min(x,15-x),cut=e<3&&hash2(x,y>>1,311)>e*.34+.05;if(cut)continue;p.set(x,y,S[shadeIdx(.45+(hash2(x>>1,y>>1,312)-.5)*.6+(e>4?.1:-.12),5,x,y)]);if(hash2(x,y,313)<.03)p.set(x,y,PB[(x+y)&1]);}
  RDM={road:new THREE.MeshLambertMaterial({map:T(p.done()),side:THREE.DoubleSide,alphaTest:.5,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})};return RDM;}
const RDC={built:new Map(),t:0},RD_SEG=60;
function rdBuild(ci){const W=TRD.wild,i0=ci*RD_SEG,i1=Math.min(W.length-1,i0+RD_SEG);if(i1-i0<1)return null;const M=rdMats(),grp=new THREE.Group();
  const pos=[],uv=[],idx=[];let v=0,u=ci*RD_SEG*.5,prev=false;
  for(let i=i0;i<=i1;i++){const a=W[Math.max(0,i-1)],b=W[Math.min(W.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l,nz=dx/l,[x,z]=W[i];u+=.5;
    const ok=twD(x,z)>TWC.WR-2,hw=1.6;const y1=getHeight(x+nx*hw,z+nz*hw)+.05,y2=getHeight(x-nx*hw,z-nz*hw)+.05;pos.push(x+nx*hw,y1,z+nz*hw,x-nx*hw,y2,z-nz*hw);uv.push(0,u*.32,1,u*.32);
    if(i>i0&&ok&&prev)idx.push(v-2,v-1,v,v-1,v+1,v);prev=ok;v+=2;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  grp.add(new THREE.Mesh(g,M.road));scene.add(grp);return grp;}
function rdTick(dt){RDC.t-=dt;if(RDC.t>0)return;RDC.t=1;if(P.x>60000||!trdOk())return;if(RDC.seed!==TRD.seed){for(const[c,g]of RDC.built){scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();});}RDC.built.clear();RDC.seed=TRD.seed;}const W=TRD.wild,n=Math.ceil(W.length/RD_SEG);
  for(let c=0;c<n;c++){const m=W[Math.min(W.length-1,c*RD_SEG+(RD_SEG>>1))],d=Math.hypot(m[0]-P.x,m[1]-P.z);const has=RDC.built.has(c);
    if(d<(settings.renderDist||140)+180&&!has){const g=rdBuild(c);if(g)RDC.built.set(c,g);}else if(d>(settings.renderDist||140)+320&&has){const g=RDC.built.get(c);scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const s of g.userData.sol||[])solDel(s);RDC.built.delete(c);}}}
// =========================================================
// Zusammengefasste Geometrie (wenige Zeichenaufrufe)
// =========================================================
const twM4=new THREE.Matrix4(),twQ=new THREE.Quaternion(),twE=new THREE.Euler(),twV=new THREE.Vector3(),twS1=new THREE.Vector3(1,1,1);
function mgNew(){return new Map();}
function mgPush(MG,mat,geo,x,y,z,ry,rx,rz){twE.set(rx||0,ry||0,rz||0,'YXZ');twQ.setFromEuler(twE);twV.set(x,y,z);twM4.compose(twV,twQ,twS1);let g=geo.index?geo.toNonIndexed():geo.clone();g.applyMatrix4(twM4);let l=MG.get(mat);if(!l)MG.set(mat,l=[]);l.push(g);if(geo!==g)geo.dispose();}
function mgBuild(MG,grp){for(const[mat,L]of MG){let n=0;for(const g of L)n+=g.attributes.position.count;const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let o=0;
  for(const g of L){pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);if(g.attributes.uv)uv.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count;g.dispose();}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));G.setAttribute('normal',new THREE.BufferAttribute(nor,3));G.setAttribute('uv',new THREE.BufferAttribute(uv,2));const m=new THREE.Mesh(G,mat);m.frustumCulled=false;grp.add(m);}}
// =========================================================
// Materialien
// =========================================================
let TWM=null;
function twMats(){if(TWM)return TWM;const T=(c,rx,ry)=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry);return t;};
  const brick=(seed,cols,o)=>{o=o||{};const p=new Px(32,32),S=pal(cols);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),off=row%2?8:0,seam=y%8===0||(x+off)%16===0;p.set(x,y,S[seam?0:shadeIdx(.55+(hash2((x+off)>>4,row,seed)-.5)*.35+(hash2(x,y,seed+1)-.5)*.2,S.length,x,y)]);
    if(o.win&&x>=13&&x<=18&&y>=10&&y<=22)p.set(x,y,hex(y<12?'#1a1814':'#0e0c0a'));if(o.rune&&row===2&&x%8===3)p.set(x,y,hex('#7af0ff'));}return p.done();};
  const L=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:c},o||{}));const B=bMats(),V=vlgMats();
  const sand=new Px(16,16);{const S=pal(['#a88a5a','#b89a68','#c8aa76','#d8ba86']);for(let y=0;y<16;y++)for(let x=0;x<16;x++)sand.set(x,y,S[shadeIdx(.6+(hash2(x,y,311)-.5)*.5,4,x,y)]);}
  const cob=new Px(32,32);{const S=pal(['#4a4640','#5e5a52','#726c62','#868076']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const c=(Math.floor(x/6)+Math.floor(y/6)*7)%5,ed=x%6===0||y%6===0;cob.set(x,y,S[ed?0:shadeIdx(.5+c*.08+(hash2(x,y,312)-.5)*.2,4,x,y)]);}}
  TWM={tower:L(T(brick(320,['#1a1a20','#26262e','#32323c','#40404a','#4e4e58'],{win:1,rune:1}),40,700)),base:L(T(brick(323,['#2a2a30','#3a3a42','#4c4c54','#5e5e66']),20,2)),
    wall:L(T(brick(326,['#4a463e','#5c584e','#6e6a5e','#807b6e']),1,1)),stone:B.stone,wood:B.wood,roof:B.roof,thatch:V.thatch,white:V.white,leaf:V.leaf,dark:V.dark,
    sand:L(T(sand.done(),12,12)),cob:L(T(cob.done(),20,2)),marble:new THREE.MeshLambertMaterial({color:0xd8d4c8}),gold:new THREE.MeshLambertMaterial({color:0xc8a030}),
    red:new THREE.MeshLambertMaterial({color:0x8a1a1a}),blue:new THREE.MeshLambertMaterial({color:0x1a3a8a}),green:new THREE.MeshLambertMaterial({color:0x2a6a2a}),yellow:new THREE.MeshLambertMaterial({color:0xb8901a}),
    glow:new THREE.MeshBasicMaterial({color:0xffd890}),rune:new THREE.MeshBasicMaterial({color:0x7af0ff}),far:new THREE.MeshBasicMaterial({color:0x303038,fog:false,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide})};return TWM;}
// =========================================================
// Die Stadt bauen
// =========================================================
const TWS={built:false,grp:null,sol:[],ents:[],far:null,houses:[]};
function twBuild(){const M=twMats(),MG=mgNew(),grp=new THREE.Group(),r=mulberry32(4242),H=TWC.H,X=TWC.x,Z=TWC.z,sol=TWS.sol;TWS.grp=grp;
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),put=(mat,geo,x,y,z,ry,rx,rz)=>mgPush(MG,mat,geo,x,y,z,ry,rx,rz);
  const box=(mat,w,h,d,x,y,z,ry,solid)=>{put(mat,B(w,h,d),x,y,z,ry);if(solid)sol.push(solAdd({x,z,hw:w/2,hd:d/2,y0:y-h/2-2,y1:y+h/2,rot:-(ry||0),solid:1,tw:1}));};
  // ---------- Der Turm ----------
  {const t=new THREE.Mesh(new THREE.CylinderGeometry(TWC.R,TWC.R+2,TWC.TOP,72,1,true),M.tower);t.position.set(X,H+TWC.TOP/2,Z);grp.add(t);
    put(M.base,new THREE.CylinderGeometry(TWC.R+5,TWC.R+7,6,72),X,H+3,Z);for(let k=0;k<24;k++){const a=k/24*6.283;if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<.12)continue;put(M.base,B(4,22,6),X+Math.cos(a)*(TWC.R+3),H+11,Z+Math.sin(a)*(TWC.R+3),-a);}
    for(let k=0;k<6;k++)put(M.rune,new THREE.TorusGeometry(TWC.R+.6,.25,4,72),X,H+40+k*60,Z,0,Math.PI/2);
    // Tor (Osten)
    box(M.base,3,18,4,X+TWC.R+4,H+9,Z-8,0,true);box(M.base,3,18,4,X+TWC.R+4,H+9,Z+8,0,true);box(M.base,4,4,20,X+TWC.R+4,H+20,Z);put(M.dark,B(1,14,12),X+TWC.R+.6,H+7,Z);put(M.rune,B(.3,.6,10),X+TWC.R+1.5,H+15,Z);
    for(const sd of[-1,1]){put(M.glow,B(.6,.9,.6),X+TWC.R+6.5,H+6,Z+sd*10);put(M.wood,B(.3,5,.3),X+TWC.R+6.5,H+2.5,Z+sd*10);}
}
  const AW=[M.red,M.blue,M.green,M.yellow];twCity({M,MG,put,box,B,sol,r,grp,H,X,Z});
  // ---------- Gildenhaus ----------
  {const x=GH.x,z=GH.z,w=GH.w,d=GH.d,h=GH.h;box(M.stone,w,h,d,x,H+h/2,z,0,true);for(const s2 of[-1,1])put(M.roof,B(w+2,.6,Math.hypot(d/2+1,8)),x,H+h+4,z+s2*(d/4),0,s2*.75);put(M.roof,B(w+2,1,1),x,H+h+8,z);
    for(const[cx,cz]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const tx=x+cx*(w/2),tz=z+cz*(d/2);put(M.stone,new THREE.CylinderGeometry(3.4,3.6,h+10,12),tx,H+(h+10)/2,tz);put(M.roof,new THREE.ConeGeometry(4.4,7,12),tx,H+h+13.5,tz);sol.push(solAdd({x:tx,z:tz,hw:3.5,hd:3.5,y0:H-2,y1:H+h+10,rot:0,solid:1,tw:1}));}
    put(M.dark,B(6,8,.3),x,H+4,z+d/2+.1);put(M.gold,B(7,.6,.4),x,H+8.4,z+d/2+.2);for(const bx of[-14,-7,7,14]){put(M.red,B(2.6,9,.2),x+bx,H+9,z+d/2+.15);put(M.gold,B(1,1,.25),x+bx,H+11,z+d/2+.2);}
    for(const wx of[-20,-10,10,20])put(M.glow,B(2,3,.2),x+wx,H+5,z+d/2+.12);put(M.cob,B(30,.2,24),x,H+.07,z+d/2+12);}
  // ---------- Arena ----------
  {const x=AR.x,z=AR.z,seg=56;for(let k=0;k<seg;k++){const a=k/seg*6.283,a2=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a2+Math.PI/2)<.17)continue;const cw=6.283*AR.R1/seg+.6;
      if(Math.abs(a2-Math.PI/2)>.2)for(let t=0;t<5;t++){const rr=AR.R0+1.5+t*3.2,hh=2+t*2.4;put(M.stone,B(3.4,hh,6.283*rr/seg+.4),x+Math.cos(a)*rr,H+hh/2,z+Math.sin(a)*rr,-a);}
      put(M.wall,B(2,15,cw),x+Math.cos(a)*AR.R1,H+7.5,z+Math.sin(a)*AR.R1,-a);if(k%2)put(M.dark,B(.3,5,cw*.5),x+Math.cos(a)*(AR.R1+1.05),H+3.5,z+Math.sin(a)*(AR.R1+1.05),-a);
      put(M.wall,B(1,2.6,6.283*AR.R0/seg+.3),x+Math.cos(a)*AR.R0,H+1.3,z+Math.sin(a)*AR.R0,-a);if(k%4===0)put(AW[(k/4)%4],B(.2,3,1.4),x+Math.cos(a)*(AR.R1+1.2),H+11,z+Math.sin(a)*(AR.R1+1.2),-a);}
    const fl=new THREE.CircleGeometry(AR.R0,48);fl.rotateX(-Math.PI/2);put(M.sand,fl,x,H+.07,z);
    box(M.wall,3,16,4,x-7,H+8,z-AR.R1,0,false);box(M.wall,3,16,4,x+7,H+8,z-AR.R1,0,false);put(M.wall,B(17,4,4),x,H+17,z-AR.R1);put(M.gold,B(10,1.4,.3),x,H+17,z-AR.R1-2.1);}
  // ---------- Stadtmauer und Tore ----------
  {const R=TWC.WR,seg=128;for(let k=0;k<seg;k++){const a=k/seg*6.283,g=[0,Math.PI/2,Math.PI,-Math.PI/2].some(q=>Math.abs(Math.atan2(Math.sin(a-q),Math.cos(a-q)))<.03);if(g)continue;
      put(M.wall,B(3,12,6.283*R/seg+.4),X+Math.cos(a)*R,H+6,Z+Math.sin(a)*R,-a);if(k%2===0)put(M.wall,B(1,1.2,1.2),X+Math.cos(a)*(R+1.4),H+12.6,Z+Math.sin(a)*(R+1.4),-a);}
    for(let k=0;k<24;k++){const a=k/24*6.283+.13;put(M.wall,new THREE.CylinderGeometry(4.5,5,18,10),X+Math.cos(a)*R,H+9,Z+Math.sin(a)*R);put(M.roof,new THREE.ConeGeometry(5.6,6,10),X+Math.cos(a)*R,H+21,Z+Math.sin(a)*R);}
    for(const q of[0,Math.PI/2,Math.PI,-Math.PI/2]){for(const sd of[-1,1]){const a=q+sd*.045;put(M.wall,new THREE.CylinderGeometry(5,5.5,20,10),X+Math.cos(a)*R,H+10,Z+Math.sin(a)*R);put(M.roof,new THREE.ConeGeometry(6,7,10),X+Math.cos(a)*R,H+23.5,Z+Math.sin(a)*R);}
      put(M.wall,B(4,5,16),X+Math.cos(q)*R,H+15,Z+Math.sin(q)*R,-q);put(M.red,B(.3,6,3),X+Math.cos(q)*(R+2.2),H+12,Z+Math.sin(q)*(R+2.2),-q);}}
  mgBuild(MG,grp);scene.add(grp);TWS.built=true;}
function twFree(){if(TWS.grp){scene.remove(TWS.grp);TWS.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});}for(const s of TWS.sol)solDel(s);TWS.sol.length=0;for(const e of TWS.ents)if(DEM.includes(e))removeEnt(e);TWS.ents.length=0;TWS.built=false;TWS.grp=null;}
// Rundungen: Turm, Mauer, Arena
function twPush(o,R,y){if(Math.abs(o.x-TWC.x)>TWC.WR+20||Math.abs(o.z-TWC.z)>TWC.WR+20||y<TWC.H-10)return;const dx=o.x-TWC.x,dz=o.z-TWC.z,d=Math.hypot(dx,dz)||1;
  if(d<TWC.R+R+1){const k=(TWC.R+R+1)/d;o.x=TWC.x+dx*k;o.z=TWC.z+dz*k;return;}
  if(Math.abs(d-TWC.WR)<1.6+R){const a=Math.atan2(dz,dx),g=[0,Math.PI/2,Math.PI,-Math.PI/2].some(q=>Math.abs(Math.atan2(Math.sin(a-q),Math.cos(a-q)))*TWC.WR<6.5);if(!g&&y<TWC.H+12){const k=(d<TWC.WR?TWC.WR-1.6-R:TWC.WR+1.6+R)/d;o.x=TWC.x+dx*k;o.z=TWC.z+dz*k;}}
  const ax=o.x-AR.x,az=o.z-AR.z,ad=Math.hypot(ax,az)||1;if(y<TWC.H+3&&ad>AR.R0-R-.3&&ad<AR.R1+1+R){const a=Math.atan2(az,ax),gate=Math.abs(a+Math.PI/2)<.13&&!ARNA.closed;if(!gate){const k=(ad<(AR.R0+AR.R1)/2?AR.R0-R-.3:AR.R1+1+R)/ad;o.x=AR.x+ax*k;o.z=AR.z+az*k;}}}
{const a=updatePlayer;updatePlayer=function(dt){a(dt);if(P.x<60000&&!DGX.on)twPush(P,P.rad||.3,P.y);};}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){const r=a(e,tx,tz,sp,dt);if(e.x<60000)twPush(e,(e.d.rad||.35)*.8,e.y);return r;};}
// =========================================================
// Einwohner, Wachen, Händler
// =========================================================
const TC_LOOK=[{hair:'short',hairColor:'brown',beard:'short',cloth:'tunic',clothColor:'red',pants:'brown'},{sex:'f',hair:'long',hairColor:'blond',cloth:'dress',clothColor:'blue',pants:'brown'},{hair:'none',beard:'long',hairColor:'grey',cloth:'robe',clothColor:'purple',pants:'grey',age:'old'},
  {sex:'f',hair:'braid',hairColor:'black',cloth:'dress',clothColor:'green',pants:'brown'},{hair:'wild',hairColor:'red',beard:'short',cloth:'vest',clothColor:'cream',pants:'blue'},{race:'dwarf',hair:'short',hairColor:'red',beard:'long',cloth:'leather',clothColor:'brown',pants:'brown'},
  {sex:'f',hair:'long',hairColor:'red',cloth:'tunic',clothColor:'teal',pants:'grey'},{hair:'short',hairColor:'black',cloth:'leather',clothColor:'black',pants:'black'},
  {hair:'short',hairColor:'brown',cloth:'chain',clothColor:'black',pants:'black',guard:1,uni:{a:'#1c2440',b:'#c8a030',e:'#7af0ff'}},{sex:'f',hair:'long',hairColor:'blond',cloth:'robe',clothColor:'cream',pants:'grey',gm:1},{hair:'none',beard:'short',hairColor:'black',cloth:'leather',clothColor:'red',pants:'brown',am:1}];
{const a=finaleSprites;finaleSprites=function(list){a(list);try{TC_LOOK.forEach((L,i)=>{const c=Object.assign(defaultChar(),{beard:'none',eyes:'gold'},L);if(c.race&&!RACES[c.race])c.race='human';for(const f of[0,1,2])list.push(['tc'+i+'_'+f,drawHero(c,f)]);});}catch(e){console.error('Turmstadt: Bilder',e);}};}
TC_LOOK.forEach((L,i)=>{DT['tc'+i]={name:'Bürger',fac:'neutral',hero:1,h:1.78,hp:100,dmg:0,spd:1.15,reach:.5,cd:2,spr:'tc'+i+'_',aggro:.01,rad:.3};});
const TC_LINES=['Willkommen in der freien Stadt! Hier zählt nur, was du im Turm leistest.','Die Gilde hat das Sagen. Ohne Gildenpass kommst du nicht in den Turm.','Mein Bruder kam bis Ebene 3. Dann kam er nicht mehr.','Hast du die Arena gesehen? Heute Abend kämpft wieder jemand!',
  'Niemand hat je die Spitze gesehen. Manche sagen, der Turm hat gar keine.','Frisches Brot! Ach nein, falscher Stand.','Die Statuen? Das sind die Helden, die am höchsten kamen.','Keine Krone, kein König. Nur die Gilde und der Turm.'];
const TC_GUARD=['Halt die Augen offen.','Keine Kämpfe in der Stadt. Dafür gibt es die Arena.','Die Gilde zahlt gut für jede Ebene.','Weiter, Bürger.'];
// Händler
const TC_SHOP=[['Waffenschmied Gorm','Gorms Waffenkammer','Klingen, Äxte, Speere. Alles scharf, alles ehrlich.',()=>{const L=[['sword',260],['axe',280],['spear',240],['dagger',150],['bow',120],['arrow',3]];for(const m of['iron','silver','gold','mythril'])if(ITEMS[m+'_sword'])L.push([m+'_sword',m==='iron'?320:m==='silver'?620:m==='gold'?900:1600]);return L;},[['bones',2],['iron_ingot',30]]],
  ['Rüstungsmacherin Hilda','Hildas Rüstungen','Wer in den Turm geht, braucht mehr als Mut. Er braucht Stahl.',()=>{const L=[['helm',160],['chainmail',320],['boots',90],['shield',110]];for(const m of['iron','silver','gold'])for(const p of['helm','armor','boots'])if(ITEMS[m+'_'+p])L.push([m+'_'+p,(p==='armor'?500:240)*(m==='iron'?1:m==='silver'?1.8:2.6)|0]);return L;},[['fur',10],['iron_ingot',30]]],
  ['Alchemistin Mira','Miras Tränke','Heilung, Kraft, Tempo, Atem. Was immer du da oben brauchst.',()=>[['hpot',36],['hpot2',105],['pregen',450],['pstr',440],['pspeed',380],['pmana',270],['pbreath',90]],[['flower',3],['mushroom',4],['swampherb',4],['glowgland',12]]],
  ['Proviantmeister Bert','Berts Proviant','Wer kämpft, muss essen. Brot, Braten, Met.',()=>[['bread',5],['roastmeat',7],['mead',9],['seafish',5],['berries',3]],[['meat',4],['wheat',3],['seafish',4]]],
  ['Baumeister Kurt','Kurts Baustoffe','Du willst dir ein Haus bauen? Hier gibt es alles dafür.',()=>[['bwall',22],['swall',30],['bwin',24],['bdoor',30],['bfloor',16],['sfloor',22],['bstair',30],['broof',18],['workbench',40]],[['wood',3],['stone',3]]],
  ['Trophäenhändler Silas','Silas’ Trophäen','Ich kaufe alles, was im Turm oder im Meer gestorben ist. Und zahle gut.',()=>[['arrow',3]],[['bones',3],['batwing',7],['sharktooth',16],['vfang',170],['tentacle',7],['glowgland',14],['megatooth',480],['pearl',45],['oldcoin',32]]]];
for(const[n,title,greet,buy,sell]of TC_SHOP){SHOPS[n]={title,greet,get buy(){return buy().filter(q=>ITEMS[q[0]]);},sell:sell.filter(q=>ITEMS[q[0]])};
  DIALOGS[n]={start:()=>'hello',nodes:{hello:()=>({text:greet,opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop(n);return null;}},{label:'Was ist das für eine Stadt?',go:'city'},{label:'Leb wohl.',go:null}]}),
    city:()=>({text:'Die Dungeon-Stadt. Eine freie Stadt, keine Krone, kein Fürst. Hier herrscht die Gilde, und alles dreht sich um den Turm. Wer ihn bezwingt, wird zur Legende.',opts:[{label:'Zurück.',go:'hello'}]})}};}
function twPortrait(k){const s=SPR[k];if(!s)return null;const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d'),hb=s.c.headBox||[18,26,6,15];x.fillStyle='#24201a';x.fillRect(0,0,22,22);x.drawImage(s.c,-(((hb[0]+hb[1])>>1)-11),-(hb[2]-4));return c;}
function twSpawnFolk(){const X=TWC.x,Z=TWC.z,r=mulberry32(777),add=(look,x,z,o)=>{const e=spawnEnt('tc'+look,x,z,Object.assign({home:{x,z},talk:0,tc:1},o||{}));TWS.ents.push(e);return e;};
  // Händler an Ständen und Kaufhäusern
  TC_SHOP.forEach(([n],i)=>{const p=i<4?TWS.stalls[[0,3,5,8][i]]:TWS.shops[i-4];const e=add([7,1,3,4,5,0][i],p.x,p.z,{name:n,role:'Händler · Dungeon-Stadt',trader:1,wander:false});e.portrait=twPortrait('tc'+[7,1,3,4,5,0][i]+'_0');});
  // Gildenmeisterin, Arenameister
  {const e=add(9,GH.x,GH.z+GH.d/2+3,{name:'Gildenmeisterin Seraphine',role:'Gilde der Dungeon-Stadt',wander:false,gm:1});e.portrait=twPortrait('tc9_0');}
  {const e=add(10,AR.x+5,AR.z-AR.R1-4,{name:'Arenameister Brutus',role:'Die große Arena',wander:false,am:1});e.portrait=twPortrait('tc10_0');}
  // Wachen
  for(const q of[0,Math.PI/2,Math.PI,-Math.PI/2])for(const sd of[-1,1]){const a=q+sd*.04,R=TWC.WR-5;add(8,X+Math.cos(a)*R,Z+Math.sin(a)*R,{name:'Stadtwache',role:'Wache',guard:1,wander:false});}
  for(const sd of[-1,1])add(8,X+TWC.R+8,Z+sd*12,{name:'Turmwache',role:'Wache der Gilde',guard:1,wander:false,twGate:1});
  for(let i=0;i<4;i++){const e=add(8,X+90+i*30,Z+(i%2?5:-5),{name:'Stadtwache',role:'Streife',guard:1});e.patrol=[[X+TWC.R+15,Z+(i%2?5:-5)],[X+TWC.WR-15,Z+(i%2?5:-5)]];e.pi=i%2;e.special=twPatrol;}
  // Bürger
  for(let i=0;i<34;i++){let x,z;if(i<14){x=X+80+r()*130;z=Z+(r()-.5)*26;}else{const h=TWS.houses[(r()*TWS.houses.length)|0];if(!h)continue;x=h.door[0];z=h.door[1];}add([0,1,2,3,4,5,6][(r()*7)|0],x,z,{name:'Bürger',role:'Dungeon-Stadt'});}}
function twPatrol(e,dt){const p=e.patrol[e.pi];if(Math.hypot(p[0]-e.x,p[1]-e.z)<1.5)e.pi=1-e.pi;entMove(e,p[0],p[1],e.d.spd,dt);return true;}
function twLooked(){let best=null,bd=3.8;for(const e of TWS.ents){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd&&lookingAt(e.x,e.y+1.3,e.z,4.6,.82)){bd=d;best=e;}}return best;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&TWS.built&&P.x<60000){const e=twLooked();if(e){if(e.trader||e.gm||e.am)openDialog(e);else say(e,(e.guard?TC_GUARD:TC_LINES)[(Math.random()*(e.guard?TC_GUARD:TC_LINES).length)|0],3.2);return true;}
    for(const s of TWS.statues||[])if(Math.hypot(s.x-P.x,s.z-P.z)<3.5&&lookingAt(s.x,TWC.H+2,s.z,4.5,.75)){toast('Statue: '+s.n+' – Held der Dungeon-Stadt');return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(TWS.built&&P.x<60000){const e=twLooked();if(e)return e.trader?'Mit '+e.name+' handeln':(e.gm||e.am)?'Mit '+e.name+' sprechen':'Mit '+e.name+' reden';}return a();};}
// =========================================================
// Gilde
// =========================================================
FLAGS.tower=FLAGS.tower||null;
const twF=()=>FLAGS.tower||(FLAGS.tower={reg:0,max:0,paid:0});
const TW_RANK=m=>m>=100?'Legende':m>=75?'Diamant':m>=50?'Platin':m>=30?'Gold':m>=15?'Silber':m>=5?'Bronze':m>=1?'Eisen':'Anwärter';
DIALOGS['Gildenmeisterin Seraphine']={start:()=>'hello',nodes:{
  hello:()=>{const F=twF();return{text:F.reg?`Willkommen zurück, ${TW_RANK(F.max)}. Du hast ${F.max} ${F.max===1?'Ebene':'Ebenen'} des Turms bezwungen. Der Turm hat bis zu hundert. Mindestens.`:'Willkommen in der Gilde der Dungeon-Stadt. Hier herrscht kein König. Hier herrscht der Turm, und wir verwalten ihn. Wer hinauf will, braucht einen Gildenpass.',
    opts:[!F.reg?{label:'Ich will mich anmelden. (10 Silbertaler)',act:()=>{if(wallet()<100)return'Du hast nicht genug Geld. Zehn Silbertaler, nicht weniger.';setWallet(wallet()-100);renderInv();F.reg=1;saveGame();try{Snd.chime();}catch(e){}return'Willkommen in der Gilde! Mit diesem Pass lassen dich die Turmwachen hinein. Jede Ebene, die du bezwingst, bringt dir Ruhm und Gold. Komm zu mir, um deine Belohnung abzuholen.';}}:null,
      F.reg&&F.max>F.paid?{label:`Belohnung abholen (${F.max-F.paid} neue ${F.max-F.paid===1?'Ebene':'Ebenen'})`,act:()=>{let s=0,xp=0;for(let l=F.paid+1;l<=F.max;l++){s+=5+l*3;xp+=40+l*25;}F.paid=F.max;addItem('silver',s);gainXP(xp);renderInv();saveGame();try{Snd.coin?Snd.coin():Snd.pickup();}catch(e){}return`Gut gemacht! ${s} Silbertaler und ${xp} Erfahrung. Die Gilde ist stolz auf dich.`;}}:null,
      {label:'Erzähl mir vom Turm.',go:'tower'},{label:'Was ist das für eine Stadt?',go:'city'},{label:'Leb wohl.',go:null}].filter(Boolean)};},
  tower:()=>({text:'Niemand weiß, wer ihn gebaut hat. Er ist rund, hundertzwanzig Schritt breit und höher, als ein Auge reicht. Jede Ebene ist anders: Hallen, Labyrinthe, Wächter. Wer eine Ebene bezwingt, kann von dort weitergehen. Hundert Ebenen sind verzeichnet. Was darüber liegt, weiß niemand.',opts:[{label:'Zurück.',go:'hello'}]}),
  city:()=>({text:'Die Dungeon-Stadt ist frei. Keine Krone, keine Fraktion. Händler, Abenteurer und Glücksritter aus allen Ländern leben hier, und alle zahlen ihren Teil an die Gilde. Dafür halten unsere Wachen den Frieden. Streit trägt man in der Arena aus.',opts:[{label:'Zurück.',go:'hello'}]})}};
// =========================================================
// Arena
// =========================================================
const ARNA={on:false,closed:false,fight:null,wave:0,ents:[]};
const ARENA_FIGHTS=[{n:'Bronze-Kampf',d:'Drei Wellen Untote',rew:30,xp:150,waves:[[['zombie',3]],[['usks',3],['uskb',1]],[['usksa',2],['uska',2]]]},
  {n:'Silber-Kampf',d:'Kobolde und Trolle',rew:80,xp:400,waves:[[['kobold',6]],[['kobold',4],['troll',1]],[['troll',2],['kobold',3]]]},
  {n:'Gold-Kampf',d:'Liche und ihre Armee',rew:200,xp:900,waves:[[['usksa',3],['uskba',2]],[['lich',1],['usks',3]],[['lich',2],['uskaa',2]]]}];
DIALOGS['Arenameister Brutus']={start:()=>'hello',nodes:{hello:()=>({text:ARNA.on?'Der Kampf läuft! Zeig, was du kannst!':'Willkommen in der großen Arena! Hier kämpft man um Ruhm und Gold. Wähle deinen Kampf. Bist du drin, schließt sich das Tor, bis alle Gegner liegen. Oder du.',
  opts:ARNA.on?[{label:'Weiter.',go:null}]:ARENA_FIGHTS.map((F,i)=>({label:`${F.n}: ${F.d} (${F.rew} Silber)`,act:()=>{arStart(i);return null;},go:null})).concat([{label:'Nicht heute.',go:null}])})}};
function arStart(i){const F=ARENA_FIGHTS[i];if(dlg)closeDialog();if(P.riding){toast('Steig erst ab. Reittiere kämpfen nicht in der Arena.');return;}ARNA.on=true;ARNA.fight=F;ARNA.wave=0;ARNA.ents=[];ARNA.closed=false;P.x=AR.x;P.z=AR.z-AR.R0+6;P.y=TWC.H+.1;P.yaw=Math.PI;P.vx=P.vz=0;
  setTimeout(()=>{ARNA.closed=true;showArea(F.n);toast('Das Tor schließt sich. Die Menge tobt!');arWave();},1200);}
function arWave(){const F=ARNA.fight,W=F.waves[ARNA.wave];if(!W)return;let k=0;for(const[t,n]of W)for(let i=0;i<n;i++){const a=Math.random()*Math.PI+.3,x=AR.x+Math.cos(a)*(AR.R0-6),z=AR.z+Math.sin(a)*(AR.R0-6);let e;if(t==='lich'){e=mzSpawnLich(x,z,false);e.home={x:AR.x,z:AR.z};e.noLeash=true;}else{if(!DT[t])continue;e=spawnEnt(t,x,z,{home:{x:AR.x,z:AR.z},cmd:1,aggroT:60,noLeash:true});if(t==='troll')e.special=mzTrollAI;}
    e.arena=1;ARNA.ents.push(e);k++;}toast(`Welle ${ARNA.wave+1} von ${F.waves.length}!`);}
function arTick(dt){if(!ARNA.on)return;const inside=Math.hypot(P.x-AR.x,P.z-AR.z)<AR.R0;if(state==='dead'||(!inside&&ARNA.closed)){arEnd(false);return;}if(!ARNA.closed)return;
  ARNA.ents=ARNA.ents.filter(e=>DEM.includes(e));if(ARNA.ents.every(e=>e.dead)){ARNA.wave++;if(ARNA.wave>=ARNA.fight.waves.length){arEnd(true);return;}arWave();}}
function arEnd(win){const F=ARNA.fight;for(const e of ARNA.ents)if(!e.dead&&DEM.includes(e))removeEnt(e);for(const e of DEM.slice())if(e.summoned&&Math.hypot(e.x-AR.x,e.z-AR.z)<AR.R0+3)removeEnt(e);ARNA.on=false;ARNA.closed=false;ARNA.ents=[];
  if(win){addItem('silver',F.rew);gainXP(F.xp);renderInv();FLAGS.arenaWins=(FLAGS.arenaWins||0)+1;showArea('Sieg!');toast(`${F.n} gewonnen! ${F.rew} Silbertaler. Die Menge jubelt!`);try{Snd.fanfare?Snd.fanfare():Snd.levelUp();}catch(e){}saveGame();}
  else if(state!=='dead')toast('Du hast die Arena verlassen. Der Kampf ist verloren.');}
// =========================================================
// Reisende Händler auf der Straße
// =========================================================
const CAR={list:[{f:.12,dir:-1,w:0},{f:.45,dir:1,w:0},{f:.8,dir:-1,w:0}],t:0};
const CAR_NAMES=['Händler Jorek','Händlerin Ysolde','Händler Pim'];
CAR.list.forEach((c,i)=>{c.n=CAR_NAMES[i];SHOPS[c.n]={title:c.n+', reisend',greet:'Ich ziehe zwischen dem Wald und der Dungeon-Stadt hin und her. Was ich dabei habe, kannst du kaufen.',
  buy:[[['hpot',40],['bread',6],['rope',8],['torch',6],['arrow',3],['pbreath',95]],[['seafish',6],['mead',10],['bow',130],['hpot2',115],['bwall',24],['broof',20]],[['pregen',470],['silk',9],['batwing',18],['stake',12],['garlic',6],['roastmeat',8]]][i].filter(q=>ITEMS[q[0]]),
  sell:[['fur',8],['meat',4],['bones',2],['pearl',40],['shell',3]].filter(q=>ITEMS[q[0]])};
  DIALOGS[c.n]={start:()=>'hello',nodes:{hello:()=>({text:['Ah, ein Reisender! Die Straße ist lang, aber sicher. Meistens.','Zur Dungeon-Stadt? Immer der Straße nach, über den Damm. Du kannst sie nicht verfehlen. Der Turm ist schwer zu übersehen.','Ich verkaufe, was die Leute im Turm brauchen. Und was sie vergessen haben.'][i],
    opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop(c.n);return null;}},{label:'Gute Reise.',go:null}]})}};});
function carTick(dt){if(!trdOk())return;for(const c of CAR.list){if(c.s==null||c.seed!==TRD.seed){c.s=TRD.total*c.f;c.seed=TRD.seed;if(c.e){removeEnt(c.e);c.e=null;}}{// Position hängt nur von der Weltzeit ab: auf allen Geräten gleich (Mehrspieler)
    const T=(FLAGS.day||0)*1440+(FLAGS.clock||0),L0=40,L1=TRD.total-5,tr=(L1-L0)/1.4,cyc=2*tr+80,ph=((T+c.f*cyc)%cyc+cyc)%cyc;c.s=ph<tr?L1-ph*1.4:ph<tr+40?L0:ph<2*tr+40?L0+(ph-tr-40)*1.4:L1;}
  const[x,z]=roadAt(c.s),d=Math.hypot(x-P.x,z-P.z);
  if(d<170&&!c.e&&P.x<60000&&!DGX.on){const e=spawnEnt('tc'+[4,6,5][CAR.list.indexOf(c)],x,z,{home:{x,z},name:c.n,role:'Reisender Händler',talk:0,trader:1,wander:false,always:true});e.portrait=twPortrait(sprOf(e,0));e.special=(e2,dt2)=>{if(dlg&&dlg.v===e2){e2.frame=0;return true;}const[tx,tz]=roadAt(c.s);if(Math.hypot(tx-e2.x,tz-e2.z)>30){e2.x=tx;e2.z=tz;}if(Math.hypot(tx-e2.x,tz-e2.z)>.2)entMove(e2,tx,tz,3,dt2);else e2.frame=0;return true;};c.e=e;
    try{if(typeof c2Cart==='function'&&VM&&VM.planks){e.cartMode='pull';c.cart=c2Cart(e);CL2.carts.push(c.cart);}}catch(_){}}
  else if(c.e&&(d>230||P.x>60000)){removeEnt(c.e);if(c.cart){scene.remove(c.cart.g);const i=CL2.carts.indexOf(c.cart);if(i>=0)CL2.carts.splice(i,1);c.cart=null;}c.e=null;}}}
function carLooked(){for(const c of CAR.list){const e=c.e;if(e&&!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.5,.82))return e;}return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&P.x<60000){const e=carLooked();if(e){openDialog(e);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000){const e=carLooked();if(e)return'Mit '+e.name+' handeln';}return a();};}
// =========================================================
// Takt
// =========================================================
let twT=0,twIn=false;
function twTick(dt){twT-=dt;rdTick(dt);carTick(dt);arTick(dt);if(twT>0)return;twT=.5;if(P.x>60000&&TWS.built&&!DGX.on){twFree();return;}
  const d=twD(P.x,P.z);const BR=Math.max(760,camera.far+120);if(d<BR&&!TWS.built&&WL_READY){twBuild();twSpawnFolk();}else if(d>BR+240&&TWS.built)twFree();
  const inC=d<TWC.WR&&!(DGX.on&&P.y<DG_Y+40);if(inC&&!twIn&&state==='playing'){showArea('Die Dungeon-Stadt');}twIn=inC;
  for(const e of TWS.ents){if(e.dead||e.trader||e.gm||e.am)continue;if(Math.hypot(e.x-P.x,e.z-P.z)<6&&time-(e.chatT||-99)>30&&Math.random()<.25){e.chatT=time;say(e,(e.guard?TC_GUARD:TC_LINES)[(Math.random()*(e.guard?TC_GUARD:TC_LINES).length)|0],3.2);}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{twTick(dt);}catch(e){if(!twTick.err){twTick.err=1;console.error('Turmstadt',e);}}};}
{const a=startGame;startGame=function(isNew,char){if(TWS.built)twFree();if(TWS.far){scene.remove(TWS.far);TWS.far=null;}for(const c of CAR.list){if(c.e)removeEnt(c.e);c.e=null;}for(const[c,g]of RDC.built){scene.remove(g);for(const s of g.userData.sol||[])solDel(s);}RDC.built.clear();ARNA.on=false;return a(isNew,char);};}
{const a=wlReset;wlReset=function(){if(TWS.built)twFree();for(const[c,g]of RDC.built){scene.remove(g);for(const s of g.userData.sol||[])solDel(s);}RDC.built.clear();a();};}
// Karte: Turm immer sichtbar markiert
{const a=startGame;startGame=function(isNew,char){const r=a(isNew,char);FLAGS.mapMarks=FLAGS.mapMarks||[];if(!FLAGS.mapMarks.some(m=>m.tw))FLAGS.mapMarks.push({x:TWC.x,z:TWC.z,c:'#c8a030',n:'Dungeon-Stadt',tw:1});return r;};}
HELP.push(['/turm','Teleport zur Dungeon-Stadt vor den Turm (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/turm\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/turm geht nur im Cheat-Modus.','err');return;}if(DGX.on){conLog('Geh erst nach draußen.','err');return;}P.x=TWC.x+95;P.z=TWC.z;P.y=TWC.H+.2;P.vx=P.vz=0;P.yaw=Math.PI/2;P.safe=[P.x,P.z];conLog('Willkommen in der Dungeon-Stadt.','ok');closeConsole();return;}return a(raw);};}
