/* =========================================================
   V62 · Savannentiere doppelt so groß und feiner gezeichnet.
   Die Tiere werden mit doppelter Pixeldichte gemalt (Körper, Beine, Fell, Kontur),
   und bekommen dafür einen eigenen Sprite-Atlas, damit der Hauptatlas nicht überläuft.
   ========================================================= */
const WILD_HD=new Set(['zebra','gazelle','giraffe','elephant','rhino','ostrich','meerkat','hippo','croc','lion','lioness','hyena','vulture','gnu','buffalo','warthog','cheetah','wilddog','baboon']);
for(const t of WILD_HD)if(WSP[t])WSP[t].h*=2;
// Pixel-Leinwand mit doppelter Auflösung. Einzelne Pixel (Augen, Nase …) bleiben 2×2 groß,
// Ellipsen und Beine werden in der feinen Auflösung gezeichnet.
class HPx extends Px{
  constructor(w,h){super(w*2,h*2);this.k=2;}
  fs(X,Y,col){if(X<0||Y<0||X>=this.w||Y>=this.h)return;const i=(Y*this.w+X)*4;this.d[i]=col[0];this.d[i+1]=col[1];this.d[i+2]=col[2];this.d[i+3]=255;}
  set(x,y,col){const X=Math.round(x)*2,Y=Math.round(y)*2;this.fs(X,Y,col);this.fs(X+1,Y,col);this.fs(X,Y+1,col);this.fs(X+1,Y+1,col);}
  done(){wFurPass(this);this.ctx.putImageData(this.img,0,0);return this.c;}}
// Feine Fellstruktur: helle Härchen oben, dunklere Strähnen unten, nur innerhalb der Figur
function wFurPass(p){const{w,h,d}=p,A=(x,y)=>x<0||y<0||x>=w||y>=h?0:d[(y*w+x)*4+3];
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;if(!d[i+3])continue;if(!A(x,y-1)||!A(x-1,y)||!A(x+1,y)||!A(x,y+1))continue;
    const r=hash2(x,y,619);let k=1;if(r<.07)k=1.12;else if(r>.93)k=.88;else if(((x+(y>>1))%5===0)&&r<.3)k=.94;
    if(k!==1){d[i]=Math.min(255,d[i]*k);d[i+1]=Math.min(255,d[i+1]*k);d[i+2]=Math.min(255,d[i+2]*k);}}}
{const e0=wEll;wEll=function(p,cx,cy,rx,ry,P,f,lit){if(!p.k)return e0(p,cx,cy,rx,ry,P,f,lit);
  for(let Y=Math.floor((cy-ry)*2);Y<=Math.ceil((cy+ry)*2)+1;Y++)for(let X=Math.floor((cx-rx)*2);X<=Math.ceil((cx+rx)*2)+1;X++){const x=X/2-.25,y=Y/2-.25,dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy>1)continue;
    const L=(lit==null?.62:lit)-dy*.34-dx*.08+(hash2(X,Y,73)-.5)*.12;const c=f?f(X/2,Y/2,L):null;p.fs(X,Y,c||P[shadeIdx(L,P.length,X,Y)]);}};}
{const l0=wLeg;wLeg=function(p,x,y0,len,w0,w1,P,dx,f){if(!p.k)return l0(p,x,y0,len,w0,w1,P,dx,f);
  for(let K=0;K<len*2;K++){const k=K/2,t=k/len,W=Math.round((w0+(w1-w0)*t)*2),X0=Math.round((x+dx*t)*2),Y=Math.round(y0*2)+K;
    for(let O=0;O<W;O++){const X=X0+O;const c=f?f(X/2,Y/2,Math.floor(k),len):null;p.fs(X,Y,c||P[k>=len-1?0:O<=1?2:O>=W-1&&W>3?0:1]);}}};}
// Beim Malen der Savannentiere die feine Leinwand benutzen
{const wd1=wildDraw;wildDraw=function(t,f){if(!WILD_HD.has(t))return wd1(t,f);const P0=Px;Px=HPx;try{return wd1(t,f);}finally{Px=P0;}};}
// Eigener Atlas für alle Wildtiere
const WILD_LIST=[];let WILD_TEX=null;
{const ws0=wildSprites;wildSprites=function(list){WILD_LIST.length=0;ws0(WILD_LIST);};}
function packWild(){const L=WILD_LIST.slice().sort((a,b)=>b[1].height-a[1].height),AW=2048;let x=2,y=2,rowH=0;const pos=[];
  for(const[name,c]of L){if(x+c.width+2>AW){x=2;y+=rowH+3;rowH=0;}pos.push([name,c,x,y]);x+=c.width+3;rowH=Math.max(rowH,c.height);}
  const need=y+rowH+2;let AH=256;while(AH<need)AH*=2;
  const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const ctx=cv.getContext('2d');
  for(const[name,c,px,py]of pos){ctx.drawImage(c,px,py);SPR[name]={c,w:c.width,h:c.height,u:px/AW,v:1-(py+c.height)/AH,du:c.width/AW,dv:c.height/AH};}
  WILD_TEX=new THREE.CanvasTexture(cv);WILD_TEX.magFilter=THREE.NearestFilter;WILD_TEX.minFilter=THREE.NearestFilter;WILD_TEX.generateMipmaps=false;}
{const ba0=buildAtlas;buildAtlas=function(){const tex=ba0();try{packWild();}catch(e){console.error('Wildatlas',e);}return tex;};}
{const iw1=initWild;initWild=function(){iw1();if(wMat&&WILD_TEX)wMat.uniforms.map.value=WILD_TEX;};}
