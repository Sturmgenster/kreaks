/* =========================================================
   GEGENSTÄNDE (0.0.102)
   - Inventarbilder für Werkzeuge, Waffen, Fackel, Tränke usw. aus denselben
     Grafiken wie in der Hand (ohne Hand, schräg wie im Inventar üblich).
   - Gegenstände am Boden haben einen eigenen Bildatlas: jede Textur stimmt.
   - Jede Rüstung, jeder Helm und jedes Paar Stiefel hat ein eigenes Aussehen.
   ========================================================= */
// =========================================================
// 1. Inventarbilder wie in der Hand
// =========================================================
let ICAP=0;const ICV={};
{const a=fpPlace;fpPlace=function(cv){if(ICAP)return{raw:cv};return a.apply(this,arguments);};}
function icRaw(id){const it=ITEMS[id],m=it&&it.mat;let r=null;ICAP=1;
  try{if(id==='sword')r=fpSword('metal','iron');else if(id==='dagger')r=fpSword('dagger','silver');else if(id==='wsword')r=fpSword('wood');else if(id==='ssword')r=fpSword('stone');
    else if(m&&id.endsWith('_sword'))r=fpSword('metal',m);else if(id==='axe')r=fpAxe('metal','iron',1);else if(id==='waxe')r=fpAxe('wood');else if(id==='saxe')r=fpAxe('stone');else if(m&&id.endsWith('_axe'))r=fpAxe('metal',m);
    else if(id==='wpick')r=fpPick('wood');else if(id==='spick')r=fpPick('stone');else if(m&&id.endsWith('_pick'))r=fpPick('metal',m);else if(id==='spear')r=fpSpear();else if(id==='torch')r=fpTorch();
    else if(/^(hpot|hpot2|pstr|pspeed|pregen|pstam|pmana|pmregen)$/.test(id))r=fpPotion(id);else if(id==='rod')r={raw:drawRodFP()};else if(id==='akuma')r={raw:drawAkumaFP()};}
  catch(e){r=null;}finally{ICAP=0;}return r&&r.raw?r.raw:null;}
// Schräg stellen, verkleinern und die Kanten wieder hart machen
function icMake(raw,rot,S){S=S||40;const W=raw.width,H=raw.height,c=Math.abs(Math.cos(rot)),s=Math.abs(Math.sin(rot)),rw=W*c+H*s,rh=W*s+H*c,k=Math.min((S-3)/rw,(S-3)/rh,1);
  const o=document.createElement('canvas');o.width=o.height=S;const x=o.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  x.translate(S/2,S/2);x.rotate(rot);x.scale(k,k);x.drawImage(raw,-W/2,-H/2);x.setTransform(1,0,0,1,0,0);
  const im=x.getImageData(0,0,S,S),d=im.data;for(let i=0;i<d.length;i+=4){if(d[i+3]<110){d[i+3]=0;continue;}const a=d[i+3]/255;d[i]=Math.min(255,d[i]/a);d[i+1]=Math.min(255,d[i+1]/a);d[i+2]=Math.min(255,d[i+2]/a);d[i+3]=255;}
  // dunkle Kontur, damit das Bild auf jedem Hintergrund lesbar bleibt
  const A=(X,Y)=>X>=0&&Y>=0&&X<S&&Y<S&&d[(Y*S+X)*4+3]>0,ol=[];for(let Y=0;Y<S;Y++)for(let X=0;X<S;X++)if(!A(X,Y)&&(A(X-1,Y)||A(X+1,Y)||A(X,Y-1)||A(X,Y+1)))ol.push((Y*S+X)*4);
  for(const i of ol){d[i]=18;d[i+1]=12;d[i+2]=10;d[i+3]=255;}x.putImageData(im,0,0);return o;}
function icRot(id){if(/pot|^p(str|speed|regen|stam|mana|mregen)$/.test(id))return 0;if(id==='torch')return .35;return Math.PI/4;}
function icBuildAll(){let n=0;for(const id in ITEMS){const raw=icRaw(id);if(!raw)continue;try{const cv=icMake(raw,icRot(id));ICV[id]=cv;ITEMS[id].icon=cv.toDataURL();n++;}catch(e){console.warn('Icon',id,e);}}
  try{if(typeof cheatIds!=='undefined')cheatIds=null;}catch(e){}try{renderInv();}catch(e){}return n;}
// =========================================================
// 2. Eigener Bildatlas für Gegenstände am Boden
// =========================================================
const DSPR={},DROP_EXTRA=[];let dropTex=null;
function dropAtlas(){const L=[];for(const id in ITEMS){const c=ICV[id]||(SPR[id]&&SPR[id].c);if(c)L.push([id,c]);}for(const k of DROP_EXTRA)if(SPR[k]&&!ITEMS[k])L.push([k,SPR[k].c]);
  const AW=1024;let x=1,y=1,row=0;const pos=[];for(const[id,c]of L){if(x+c.width+1>AW){x=1;y+=row+1;row=0;}pos.push([id,c,x,y]);x+=c.width+1;row=Math.max(row,c.height);}
  let AH=64;while(AH<y+row+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');
  for(const[id,c,px,py]of pos){ctx.drawImage(c,px,py);DSPR[id]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;dropTex=t;
  if(dropMat)dropMat.uniforms.map.value=t;try{if(typeof jwAtlasReady==='function')jwAtlasReady();}catch(e){}return pos.length;}
// Beim Zeichnen der Bodengegenstände kurz die Einträge aus dem eigenen Atlas verwenden
{const a=updateDrops;updateDrops=function(dt){if(!dropTex)return a(dt);const sw=new Map();
  const use=id=>{if(!sw.has(id)&&DSPR[id]){sw.set(id,SPR[id]);SPR[id]=DSPR[id];}};for(const d of drops)use(d.id);for(const f of DROP_FX)use(f.id);
  try{return a(dt);}finally{for(const[id,s]of sw){if(s===undefined)delete SPR[id];else SPR[id]=s;}}};}
{const a=spawnDrop;spawnDrop=function(id,n,x,y,z){const r=a.apply(this,arguments);const d=drops[drops.length-1],D=DSPR[id];if(d&&d.id===id&&D&&d.h)d.w=d.h*D.w/D.h;return r;};}
{const a=initFPItems;initFPItems=function(){a();try{icBuildAll();}catch(e){console.error('Inventarbilder',e);}try{dropAtlas();}catch(e){console.error('Boden-Atlas',e);}};}
// =========================================================
// 3. Rüstungen mit eigenem Aussehen
// =========================================================
if(ITEMS.leatherarmor&&!ITEMS.leatherarmor.look)ITEMS.leatherarmor.look='leather';
// Farben, Art und Verzierung je Rüstung
const GEAR={
  iron:{pal:['#2a2c30','#4e5258','#7c828a','#b4bac2'],acc:null,trim:'#3a3c42'},
  alu:{pal:['#4a5058','#8a96a2','#c4cfda','#eef4fa'],acc:null,trim:'#6a7682'},
  silver:{pal:['#4a4e58','#9298a4','#d0d6e0','#ffffff'],acc:'#3a7ae0',trim:'#c8a040'},
  mythril:{pal:['#0e3048','#1e6290','#48a8d8','#a8f0ff'],acc:'#a8ffff',trim:'#2ad0ff',glow:1},
  adamant:{pal:['#2e061e','#5e123e','#962660','#d85c98'],acc:'#ffd040',trim:'#1a0410'},
  diamond:{pal:['#3e7a98','#7cc4e0','#c8f0ff','#ffffff'],acc:'#ffffff',trim:'#e8fcff',sparkle:1},
  black:{pal:['#050508','#141420','#2e2e44','#6a5aa0'],acc:'#b070ff',trim:'#8a4ae0',glow:1},
  natta:{pal:['#163018','#2a5a2a','#4a8a3a','#8ac860'],acc:'#e8d040',trim:'#123012',scale:1}};
const gearOf=id=>{if(!id)return null;const it=ITEMS[id];if(!it)return null;if(id==='nattaarmor')return GEAR.natta;if(it.mat&&GEAR[it.mat])return GEAR[it.mat];return null;};
{const a=lookWithGear;lookWithGear=function(c){const o=a(c);o.gear={h:equip.helm?equip.helm.id:null,a:equip.armor?equip.armor.id:null,b:equip.boots?equip.boots.id:null};return o;};}
const GREYSET=new Set(CLOTH.grey.map(c=>c.join(','))),LEATHERSET=new Set(CLOTH.leather.map(c=>c.join(','))),IRSET=new Set(pal(['#2c2e33','#4a4e55','#7a808a','#aeb4bd']).map(c=>c.join(',')));
function gearPaint(cv,c,back){const G=c.gear;if(!G||!cv.headBox)return cv;const ga=gearOf(G.a),gh=gearOf(G.h),gb=gearOf(G.b);if(!ga&&!gh&&!gb)return cv;
  const W=cv.width,H=cv.height,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d');x.drawImage(cv,0,0);
  const im=x.getImageData(0,0,W,H),d=im.data,[h0,h1,t,b]=cv.headBox,waist=cv.waist||40,cx=(h0+h1)>>1;
  const key=(X,Y)=>{const i=(Y*W+X)*4;return d[i+3]?d[i]+','+d[i+1]+','+d[i+2]:null;},set=(X,Y,col)=>{if(X<0||Y<0||X>=W||Y>=H)return;const i=(Y*W+X)*4;d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];d[i+3]=255;},
    lum=(X,Y)=>{const i=(Y*W+X)*4;return(d[i]+d[i+1]+d[i+2])/3;};
  // ---- Brustpanzer ----
  if(ga){const M=pal(ga.pal);let L0=W,R0=0;
    for(let y=Math.max(0,t-10);y<=waist;y++)for(let X=0;X<W;X++){const inHead=y<=b&&X>=h0-1&&X<=h1+1;if(inHead)continue;const k=key(X,y);if(!k||!GREYSET.has(k))continue;
      const nx=(X-cx)/9,row=y-(b+2),seam=row>=0&&row%4===3,top=row>=0&&row%4===0;let L=.6-nx*.38+(seam?-.3:0)+(top?.14:0);
      if(ga.scale)L+=((X+(y>>1)*2)%3===0)?-.22:((X+y)%3===1?.08:0);
      set(X,y,M[shadeIdx(L,4,X,y)]);if(y===b+3){L0=Math.min(L0,X);R0=Math.max(R0,X);}}
    // Schulterstücke
    if(R0>L0)for(const[s,ax]of[[-1,L0],[1,R0]])for(let k=0;k<4;k++)for(let y=b+1;y<=b+3;y++){if(y===b+1&&k===3)continue;set(ax+s*(k-1),y,M[y===b+1?3:k===3?1:2]);}
    if(!back){// Mittelnaht, Verzierung und Edelstein
      if(ga.trim)for(let y=b+3;y<waist;y++){if(lum(cx,y)>25)set(cx,y,hex(ga.trim));}
      if(ga.acc){const A=hex(ga.acc);set(cx,b+5,A);set(cx-1,b+5,A);set(cx,b+6,A);set(cx-1,b+6,A);set(cx-1,b+5,hex('#ffffff'));}
      if(ga.glow)for(const[X,Y]of[[cx-3,b+4],[cx+3,b+4],[cx-3,b+8],[cx+3,b+8]])if(lum(X,Y)>25)set(X,Y,hex(ga.trim));
      if(ga.sparkle)for(const[X,Y]of[[cx-4,b+3],[cx+3,b+7],[cx-2,b+9]])if(lum(X,Y)>25)set(X,Y,hex('#ffffff'));}}
  // ---- Helm ----
  if(gh&&c.helm){const M=pal(gh.pal);for(let y=Math.max(0,t-3);y<=Math.min(H-1,t+5);y++)for(let X=Math.max(0,h0-3);X<=Math.min(W-1,h1+3);X++){const k=key(X,y);if(!k||!IRSET.has(k))continue;
      set(X,y,M[shadeIdx(.66-(X-cx)/7*.4-(y-t)*.05,4,X,y)]);}
    const m=(G.h||'').split('_')[0],T=hex(gh.trim||gh.pal[3]),A=gh.acc?hex(gh.acc):T;
    if(m==='silver'){for(const s of[-1,1]){const bx=s<0?h0-2:h1+2;for(let k=0;k<3;k++){set(bx+s*k,t-k,hex('#f4f4f8'));set(bx+s*k,t+1-k,hex('#c8ccd8'));}}}
    else if(m==='mythril'){for(let y=t-4;y<t-1;y++)set(cx,y,T);set(cx,t-5,hex('#ffffff'));}
    else if(m==='adamant'||m==='black'){const HN=m==='black'?pal(['#1a1a26','#3a3050','#6a5aa0']):pal(['#3a2410','#c8b890','#f0e8d0']);for(const s of[-1,1]){const bx=s<0?h0-1:h1+1;for(let k=0;k<5;k++)set(bx+s*(k<2?0:k<4?1:2),t-1-k,HN[k<2?0:k<4?1:2]);}
      if(m==='black'&&!back){set(cx-2,t+2,hex('#b070ff'));set(cx+2,t+2,hex('#b070ff'));}}
    else if(m==='diamond'){for(let y=t-5;y<t-1;y++){set(cx,y,hex(y===t-5?'#ffffff':'#c8f0ff'));if(y>t-4){set(cx-1,y,hex('#7cc4e0'));set(cx+1,y,hex('#e8fcff'));}}}
    else if(m==='alu'){for(let X=h0;X<=h1;X++)if(key(X,t-1))set(X,t-1,hex('#eef4fa'));}
    if(gh.acc&&!back&&m!=='silver'&&m!=='black'&&m!=='diamond')set(cx,t,A);}
  // ---- Stiefel (Schuh und Beinschienen) ----
  if(gb){const M=pal(gb.pal);for(let y=Math.max(0,H-9);y<H;y++)for(let X=0;X<W;X++){const k=key(X,y);if(!k)continue;const isShoe=LEATHERSET.has(k)&&y>=H-5;
      if(!isShoe&&!(y>=H-8&&y<H-3&&lum(X,y)>30&&!LEATHERSET.has(k)))continue;const L=.62-((X%5)/5)*.3+(y===H-8||y===H-6?.12:0)+(isShoe&&y===H-1?-.25:0);set(X,y,M[shadeIdx(L,4,X,y)]);}}
  x.putImageData(im,0,0);o.headBox=cv.headBox;o.waist=cv.waist;o.legTop=cv.legTop;o.handL=cv.handL;o.handR=cv.handR;return o;}
{const a=drawHero;drawHero=function(c,frame,back,pose,side){const cv=a.apply(this,arguments);if(!c||!c.gear)return cv;try{return gearPaint(cv,c,back);}catch(e){return cv;}};}
