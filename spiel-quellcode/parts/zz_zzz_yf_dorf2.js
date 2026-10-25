/* =========================================================
   0.0.135 · Dörfer überarbeitet
   - Fischer- und Elfendörfer bekommen ein richtiges Straßen- und Wegenetz: Hauptstraßen vom Dorfplatz aus,
     Seitengassen und Trampelpfade zu jeder Haustür. Im Fischerdorf führt eine Hauptstraße zum Steg.
   - Die Häuser stehen an den Straßen, mit der Tür zur Straße. Viele Hausvarianten:
     Fischer: Kate, Steinhaus, buntes Giebelhaus, Fachwerkhaus mit 2 Stockwerken, Langhaus mit Anbau, Netzschuppen
     Elfen:   Elfenhaus, Elfenturm, Baumhaus, Elfenhalle mit Vordach, Giebelhaus
   - Gärten mit Zaun und Beeten, Brunnen bzw. Elfenbrunnen, Marktstand, Bänke, Laternen, Fässer, Kisten,
     Holzstapel, Fischgestelle, Netze, Boote am Steg, Ortsschild, Elfenbögen am Dorfeingang
   - Feiner Dorfboden (etwa 8 Pixel pro Meter) mit Straßen, Pflaster, Beeten und Schatten an den Häusern
   - Fenster leuchten nachts, aus Schornsteinen steigt Rauch
   ========================================================= */
const VL2={M:null};
// ---------- Farben und kleine Bilder ----------
const VC2=s=>{const n=parseInt(s.slice(1),16);return[n>>16,(n>>8)&255,n&255];};
const vcl2=v=>v<0?0:v>255?255:v;
const vmul2=(c,f)=>[vcl2(c[0]*f),vcl2(c[1]*f),vcl2(c[2]*f)];
const vmix2=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const vpk2=(P,t)=>P[Math.max(0,Math.min(P.length-1,Math.floor(t*P.length)))];
const vpal2=a=>a.map(VC2);
function vCan(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h),D=im.data;
  for(let y=0;y<h;y++)for(let i=0;i<w;i++){const q=fn(i,y),o=(y*w+i)*4;D[o]=q[0];D[o+1]=q[1];D[o+2]=q[2];D[o+3]=q.length>3?q[3]:255;}x.putImageData(im,0,0);return c;}
function vTex(c,rep){const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapNearestFilter;if(rep!==false){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;}
// kachelbares Voronoi-Muster (Bruchsteine)
function vVor(W,H,cw,ch,seed,fn){const nx=W/cw,ny=H/ch,pts=[];for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)pts.push([i*cw+hash2(i,j,seed)*cw,j*ch+hash2(i,j,seed+1)*ch,i,j]);
  return vCan(W,H,(x,y)=>{let d1=1e9,d2=1e9,b=null,bx=0,by=0;for(const p of pts)for(const ox of[-W,0,W])for(const oy of[-H,0,H]){const dx=x+.5-(p[0]+ox),dy=y+.5-(p[1]+oy),d=dx*dx+dy*dy;if(d<d1){d2=d1;d1=d;b=p;bx=dx;by=dy;}else if(d<d2)d2=d;}
    return fn(x,y,b,Math.sqrt(d2)-Math.sqrt(d1),bx,by);});}
// Voronoi in Weltkoordinaten (Pflaster, Steinplatten)
function vVorW(x,z,cs,seed){const ix=Math.floor(x/cs),iz=Math.floor(z/cs);let d1=9,d2=9,id=0;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const cx=ix+a,cz=iz+b,px=(cx+hash2(cx,cz,seed))*cs,pz=(cz+hash2(cx,cz,seed+1))*cs,d=Math.hypot(x-px,z-pz);if(d<d1){d2=d1;d1=d;id=cx*7919+cz;}else if(d<d2)d2=d;}
  return[d2-d1,id];}
function vl2Mats(){if(VL2.M)return VL2.M;const T={},M={};
  const plank=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{const row=y>>2,off=(hash2(row,7,901)*32)|0,xx=(x+off)&31,seg=xx>>4,sx=xx&15;
    let c=vpk2(P,.2+hash2(row,seg,902)*.55+(hash2(x>>1,row*7+seg,903)-.5)*.2);if((y&3)===3)c=vmul2(c,.55);else if(sx===0)c=vmul2(c,.62);else if((y&3)===0)c=vmul2(c,1.1);if(hash2(x,y,904)>.965)c=vmul2(c,.78);return c;});};
  const stone=(cols,mort)=>{const P=vpal2(cols),Mo=VC2(mort);return vVor(32,32,8,8,911,(x,y,p,edge,dx,dy)=>{if(edge<1.1)return vmul2(Mo,.9+hash2(x,y,912)*.2);
    let c=vpk2(P,.15+hash2(p[2],p[3],913)*.7);c=vmul2(c,1-dy*.035+(hash2(x,y,914)-.5)*.12);if(edge<2)c=vmul2(c,.86);return c;});};
  const thatch=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{const row=y>>2,yy=y&3;let c=vpk2(P,.22+hash2(x,row,921)*.5+yy*.06);if(yy===3)c=vmul2(c,.6);if(hash2(x,y,922)>.92)c=vmul2(c,1.18);return c;});};
  const shingle=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{const row=y>>2,yy=y&3,xs=x+(row&1)*4,xx=xs&7,id=(xs>>3)&3;let c=vpk2(P,.2+hash2(id,row,931)*.6);
    if(yy===3)c=vmul2(c,.55);else if(xx===0)c=vmul2(c,.7);else if(yy===0)c=vmul2(c,1.1);return c;});};
  const leafroof=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{const row=y>>2,yy=y&3,xs=x+(row&1)*2,xo=xs&3,id=(xs>>2)&7;let c=vpk2(P,.25+hash2(id,row,941)*.55);
    if(yy===3||(yy===2&&(xo===0||xo===3)))c=vmul2(c,.6);else if(yy===0&&xo>0&&xo<3)c=vmul2(c,1.15);if(hash2(x,y,942)>.965)c=vmul2(c,1.35);return c;});};
  const plaster=col=>{const C=VC2(col);return vCan(32,32,(x,y)=>vmul2(C,.9+hash2(x>>1,y>>1,951)*.1+(hash2(x,y,952)-.5)*.06));};
  const blocks=(cols,line)=>{const P=vpal2(cols),Li=VC2(line);return vCan(32,32,(x,y)=>{const row=y>>3,xx=(x+(row&1)*8)&31,id=xx>>4;if((y&7)===7||(xx&15)===0)return vmul2(Li,.95+hash2(x,y,971)*.1);
    return vmul2(vpk2(P,.3+hash2(id,row,972)*.5),.95+hash2(x,y,973)*.08);});};
  const wood=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{let c=vpk2(P,.3+hash2(x>>3,y,981)*.35+(hash2(x,y>>2,982)-.5)*.2);if(hash2(x>>2,y,983)>.9)c=vmul2(c,.75);return c;});};
  const leaves=cols=>{const P=vpal2(cols);return vCan(32,32,(x,y)=>{let c=vpk2(P,hash2(x>>1,y>>1,1001)*.6+hash2(x,y,1002)*.4);if(hash2(x>>2,(y+1)>>2,1003)>.8)c=vmul2(c,.7);return c;});};
  const bark=cols=>{const P=vpal2(cols);return vCan(16,32,(x,y)=>{let c=vpk2(P,.3+hash2(x,y>>3,1011)*.5);if(hash2(x,y>>2,1012)>.8)c=vmul2(c,.6);return c;});};
  const door=(cols,iron)=>{const P=vpal2(cols),I=VC2(iron);return vCan(32,64,(x,y)=>{if(x<2||x>29||y<2)return vmul2(P[0],.7);const b=((x-2)/7)|0;let c=vpk2(P,.3+hash2(b,3,961)*.4+(hash2(b,y>>2,962)-.5)*.12);
    if(((x-2)%7)===6)c=vmul2(c,.6);if((y>=12&&y<15)||(y>=50&&y<53)){c=vmul2(I,.9+hash2(x,y,963)*.2);if((x%7)===4&&(y===13||y===51))c=vmul2(I,1.5);}const hx=x-24,hy=y-33;if(hx*hx+hy*hy<5)c=vmul2(I,1.3);return c;});};
  const win=(frame,glass)=>{const F=VC2(frame),G=VC2(glass);return vCan(16,16,(x,y)=>{if(x<2||x>13||y<2||y>13||x===7||x===8||y===7||y===8)return vmul2(F,.9+hash2(x,y,991)*.15);
    let c=vmul2(G,.85+y*.02);if(((x-y+32)%9)===0)c=vmul2(c,1.6);return c;});};
  const winGlow=glow=>{const G=VC2(glow);return vCan(16,16,(x,y)=>(x<2||x>13||y<2||y>13||x===7||x===8||y===7||y===8)?[0,0,0]:vmul2(G,.8+hash2(x,y,992)*.25));};
  const ewin=(emis)=>{const F=VC2('#d8d0b0'),G=VC2('#2a4a40'),E=VC2('#a8f8d0');return vCan(16,24,(x,y)=>{const ax=x-7.5,ay=y-8,o=y<8&&ax*ax+ay*ay>6*6,bd=x<2||x>13||y>21||(y<8&&ax*ax+ay*ay>4.6*4.6);
    if(o||bd||x===7||x===8||y===13)return emis?[0,0,0]:vmul2(F,.92+hash2(x,y,993)*.12);return emis?vmul2(E,.8+hash2(x,y,994)*.25):vmul2(G,.85+y*.015+(((x+y)%8)===0?.5:0));});};
  const barrel=()=>{const P=vpal2(['#4a3220','#5a3e28','#684a30']),I=VC2('#2e2e32');return vCan(16,16,(x,y)=>{if(y===2||y===3||y===12||y===13)return vmul2(I,.9+hash2(x,y,1021)*.2);let c=vpk2(P,hash2(x>>2,1,1022));if((x&3)===0)c=vmul2(c,.65);return c;});};
  const net=()=>vCan(16,16,(x,y)=>((x&3)===0||(y&3)===0)?[64,74,62,255]:[0,0,0,0]);
  const cloth=(a,b)=>{const A=VC2(a),B=VC2(b);return vCan(16,16,(x,y)=>vmul2((x>>2)&1?A:B,.92+hash2(x,y,1031)*.1));};
  const L1=(t,o)=>new THREE.MeshLambertMaterial(Object.assign({map:t},o||{})),C1=col=>new THREE.MeshLambertMaterial({color:col});
  const tPl=vTex(plank(['#8a8a8a','#9e9e9e','#b2b2b2','#c4c4c4','#d2d2d2'])),tTh=vTex(thatch(['#5e4a20','#725a28','#866a30','#9a7c3a','#ac8e46'])),tCa=vTex(leaves(['#1e4a1a','#2a5e22','#367228','#468a32','#56a03c']));
  M.plankG=L1(vTex(plank(['#4e4a44','#5e5952','#6e685f','#7e776c','#8e877a'])));M.plankB=L1(vTex(plank(['#3e2a1a','#4c3420','#5a3e28','#684a30','#76563a'])));
  M.plankE=L1(vTex(plank(['#7a603e','#8a6e48','#9a7c52','#aa8a5e','#b89868'])));
  M.pRed=L1(tPl,{color:0xc04a3a});M.pOchre=L1(tPl,{color:0xd8a446});M.pBlue=L1(tPl,{color:0x5a86bc});M.pGreen=L1(tPl,{color:0x5e9462});M.white=C1(0xeee8da);
  M.stone=L1(vTex(stone(['#55524c','#64605a','#736e66','#837d74','#938c82'],'#34312c')));M.elfStone=L1(vTex(blocks(['#c4c2b4','#cecdbf','#d8d6ca','#e2e0d4'],'#a6a496')));
  M.plaster=L1(vTex(plaster('#dcd2b8')));M.plasterE=L1(vTex(plaster('#e8e6dc')));
  M.beamD=L1(vTex(wood(['#2a1c12','#342216','#3e2a1a','#48321e'])));M.beamL=L1(vTex(wood(['#86683e','#967648','#a68452','#b4925e'])));
  M.thatch=L1(tTh);M.thatchD=L1(tTh,{color:0x9a8a70});M.shingle=L1(vTex(shingle(['#3a281c','#463022','#523a28','#5e4430'])));M.slate=L1(vTex(shingle(['#323842','#3c434e','#464e5a','#505966'])));
  M.leafRoof=L1(vTex(leafroof(['#1c4418','#265820','#306c28','#3c8032','#4a923a'])));M.leafA=L1(vTex(leafroof(['#5a2e10','#784014','#96541a','#b46c22','#c88430'])));
  M.canopy=L1(tCa);M.vine=L1(tCa,{color:0x90c070});M.crop=L1(tCa,{color:0xb0e888});M.bark=L1(vTex(bark(['#2e2216','#3a2c1c','#463422','#523e28'])));M.log=M.bark;
  M.doorF=L1(vTex(door(['#3a2618','#46301e','#523a24','#5e442a'],'#2e2e32')));M.doorE=L1(vTex(door(['#6a7438','#788440','#86924a','#94a054'],'#c8b060')));
  const tG=vTex(winGlow('#ffd890'));M.winF=L1(vTex(win('#3a2a1e','#2a3a48')),{emissive:0xffffff,emissiveMap:tG,emissiveIntensity:0});M.winW=L1(vTex(win('#e6e2d6','#2a3a48')),{emissive:0xffffff,emissiveMap:tG,emissiveIntensity:0});
  M.winE=L1(vTex(ewin(false)),{emissive:0xffffff,emissiveMap:vTex(ewin(true)),emissiveIntensity:.3});
  M.lamp=new THREE.MeshLambertMaterial({color:0xffe6a8,emissive:0xffc860,emissiveIntensity:.25});M.crystal=new THREE.MeshLambertMaterial({color:0xa8f8e0,emissive:0x5ae8c0,emissiveIntensity:.6});
  M.water=new THREE.MeshLambertMaterial({color:0x2e6a9a,transparent:true,opacity:.85});M.waterD=C1(0x18303e);
  M.iron=C1(0x3a3a40);M.gold=C1(0xc8a848);M.rope=C1(0x8a7a5a);M.fish=C1(0xaab8c0);M.flR=C1(0xd8404e);M.flY=C1(0xf0cc3a);M.flB=C1(0x7a68dc);M.flW=C1(0xf2f0ea);M.soil=C1(0x3a2a1c);
  M.net=new THREE.MeshLambertMaterial({map:vTex(net()),alphaTest:.5,side:THREE.DoubleSide});M.barrel=L1(vTex(barrel()));
  M.clothF=L1(vTex(cloth('#2a5a9a','#e8e2d0')));M.clothE=L1(vTex(cloth('#3a7a3a','#e8e2c0')));
  VL2.M=M;return M;}
// ---------- Geometrie sammeln (eine Mesh pro Material) ----------
class VB2{constructor(){this.g=new Map();}
  _b(m){let b=this.g.get(m);if(!b)this.g.set(m,b={p:[],n:[],u:[],i:[]});return b;}
  face(m,P,U){const B=this._b(m),o=B.p.length/3,a=P[0],b=P[1],c=P[P.length-1];const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z;
    let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
    for(let k=0;k<P.length;k++){B.p.push(P[k].x,P[k].y,P[k].z);B.n.push(nx,ny,nz);B.u.push(U[k*2],U[k*2+1]);}if(P.length===4)B.i.push(o,o+1,o+2,o,o+2,o+3);else B.i.push(o,o+1,o+2);}
  box(m,w,h,d,M,mode){const x=w/2,y=h/2,z=d/2,fit=mode==='fit',e=M.elements,ou=fit?0:((Math.abs(e[12]*.37+e[14]*.23))%1);
    const F=[[[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z],w,h],[[x,-y,-z],[-x,-y,-z],[-x,y,-z],[x,y,-z],w,h],[[x,-y,z],[x,-y,-z],[x,y,-z],[x,y,z],d,h],[[-x,-y,-z],[-x,-y,z],[-x,y,z],[-x,y,-z],d,h],[[-x,y,z],[x,y,z],[x,y,-z],[-x,y,-z],w,d],[[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z],w,d]];
    for(const f of F){const P=[0,1,2,3].map(k=>new THREE.Vector3(f[k][0],f[k][1],f[k][2]).applyMatrix4(M));let U;if(fit)U=[0,0,1,0,1,1,0,1];else{const fu=f[4]/2,fv=f[5]/2;U=[ou,0,ou+fu,0,ou+fu,fv,ou,fv];}this.face(m,P,U);}}
  cyl(m,r,h,seg,M,mode,caps,rot){rot=rot||0;const fit=mode==='fit',P=k=>{const a=rot+k/seg*6.2832;return[Math.sin(a)*r,Math.cos(a)*r];},circ=6.2832*r,V=(x,y,z)=>new THREE.Vector3(x,y,z).applyMatrix4(M);
    for(let k=0;k<seg;k++){const[a0,b0]=P(k),[a1,b1]=P(k+1);let U;if(fit)U=[k/seg,0,(k+1)/seg,0,(k+1)/seg,1,k/seg,1];else{const u0=k/seg*circ/2,u1=(k+1)/seg*circ/2;U=[u0,0,u1,0,u1,h/2,u0,h/2];}
      this.face(m,[V(a0,0,b0),V(a1,0,b1),V(a1,h,b1),V(a0,h,b0)],U);}
    if(caps){const uc=(x,z)=>fit?[.5+x/(2*r),.5+z/(2*r)]:[x/2,z/2],ct=V(0,h,0),cb=V(0,0,0);for(let k=0;k<seg;k++){const[a0,b0]=P(k),[a1,b1]=P(k+1);
      this.face(m,[ct,V(a0,h,b0),V(a1,h,b1)],[...uc(0,0),...uc(a0,b0),...uc(a1,b1)]);this.face(m,[cb,V(a1,0,b1),V(a0,0,b0)],[...uc(0,0),...uc(a1,b1),...uc(a0,b0)]);}}}
  cone(m,r,h,seg,M,rot){rot=rot||0;const V=(x,y,z)=>new THREE.Vector3(x,y,z).applyMatrix4(M),ap=V(0,h,0),c=V(0,0,0),sl=Math.hypot(r,h),w=2*r*Math.sin(Math.PI/seg);
    for(let k=0;k<seg;k++){const a0=rot+k/seg*6.2832,a1=rot+(k+1)/seg*6.2832,p0=V(Math.sin(a0)*r,0,Math.cos(a0)*r),p1=V(Math.sin(a1)*r,0,Math.cos(a1)*r);this.face(m,[p0,p1,ap],[0,0,w/2,0,w/4,sl/2]);this.face(m,[c,p1,p0],[0,0,1,0,0,1]);}}
  build(grp){for(const[m,b]of this.g){if(!b.i.length)continue;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));
      geo.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));geo.setIndex(b.i);grp.add(new THREE.Mesh(geo,m));}this.g.clear();}}
const _vq=new THREE.Quaternion(),_ve=new THREE.Euler(),_vs=new THREE.Vector3(1,1,1),_vp=new THREE.Vector3();
function vM(x,y,z,rx,ry,rz,par){const m=new THREE.Matrix4();_ve.set(rx||0,ry||0,rz||0,'YXZ');_vq.setFromEuler(_ve);m.compose(_vp.set(x,y,z),_vq,_vs);return par?m.premultiply(par):m;}
function vCx(V,M){return{V,M,
  b(m,w,h,d,x,y,z,rx,ry,rz,mode){V.box(m,w,h,d,vM(x,y,z,rx,ry,rz,M),mode);},
  s(x,y,z,ry){return vCx(V,vM(x,y,z,0,ry||0,0,M));},
  cyl(m,r,h,seg,x,y,z,mode,caps,rot){V.cyl(m,r,h,seg,vM(x,y,z,0,0,0,M),mode,caps,rot);},
  cone(m,r,h,seg,x,y,z,rot){V.cone(m,r,h,seg,vM(x,y,z,0,0,0,M),rot);},
  tri(m,a,b,c){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],nx=Math.abs(uy*vz-uz*vy),ny=Math.abs(uz*vx-ux*vz),nz=Math.abs(ux*vy-uy*vx);
    const uv=q=>nx>=ny&&nx>=nz?[q[2]/2,q[1]/2]:nz>=ny?[q[0]/2,q[1]/2]:[q[0]/2,q[2]/2];V.face(m,[a,b,c].map(q=>new THREE.Vector3(q[0],q[1],q[2]).applyMatrix4(M)),[...uv(a),...uv(b),...uv(c)]);},
  w(x,y,z){return new THREE.Vector3(x,y,z).applyMatrix4(M);}};}
// ---------- Bauteile ----------
// Satteldach, First entlang x. Gibt die Firsthöhe zurück.
function vRoof(C,rm,gm,W,D,H,pitch,o,ridge){const t=.16,hs=D/2+o,tn=Math.tan(pitch),Ls=hs/Math.cos(pitch)+.06,Hr=H+D/2*tn;
  for(const sg of[1,-1])C.b(rm,W+2*o,t,Ls,0,Hr-hs/2*tn+t*.5,sg*hs/2,sg*pitch,0,0);
  if(gm){C.tri(gm,[W/2,H,D/2],[W/2,H,-D/2],[W/2,Hr,0]);C.tri(gm,[-W/2,H,-D/2],[-W/2,H,D/2],[-W/2,Hr,0]);}
  if(ridge)C.b(ridge,W+2*o+.08,.2,.2,0,Hr+.1,0,Math.PI/4,0,0);return Hr;}
// Wand-Rahmen: lokales +z zeigt aus der Wand heraus
function vWall(C,f,W,D){if(f==='f')return[C.s(0,0,D/2,0),W];if(f==='b')return[C.s(0,0,-D/2,Math.PI),W];if(f==='r')return[C.s(W/2,0,0,Math.PI/2),D];return[C.s(-W/2,0,0,-Math.PI/2),D];}
function vWin(Cw,x,y,o){const w=o.ww||.8,h=o.wh||.8;Cw.b(o.win,w,h,.06,x,y,.03,0,0,0,'fit');Cw.b(o.fr,w+.18,.1,.18,x,y-h/2-.05,.08);Cw.b(o.fr,w+.18,.1,.1,x,y+h/2+.05,.05);
  Cw.b(o.fr,.1,h,.1,x-w/2-.04,y,.05);Cw.b(o.fr,.1,h,.1,x+w/2+.04,y,.05);
  if(o.sh){Cw.b(o.sh,w*.52,h+.04,.05,x-w*.78-.06,y,.06);Cw.b(o.sh,w*.52,h+.04,.05,x+w*.78+.06,y,.06);}
  if(o.fl){Cw.b(o.box,w+.06,.2,.24,x,y-h/2-.22,.16);for(let k=0;k<4;k++)Cw.b(o.fl[k%o.fl.length],.15,.15,.15,x-w*.36+k*w*.24,y-h/2-.06,.16);}}
function vDoor(Cw,o,x){Cw.b(o.door,1.0,1.95,.06,x,1.095,.03,0,0,0,'fit');Cw.b(o.fr,.14,2.18,.14,x-.57,1.21,.06);Cw.b(o.fr,.14,2.18,.14,x+.57,1.21,.06);Cw.b(o.fr,1.28,.16,.16,x,2.3,.07);Cw.b(o.step,1.5,.24,.75,x,0,.38);}
// Fachwerk auf einer Wand
function vFrame(Cw,bm,S,y0,y1,sk){const n=Math.max(1,Math.round(S/1.5)),bw=S/n,th=.16,inS=x=>sk&&sk.some(q=>x>q[0]-.08&&x<q[1]+.08);
  Cw.b(bm,S+.08,th,.1,0,y0+th/2,.03);Cw.b(bm,S+.08,th,.1,0,y1-th/2,.03);
  for(let k=0;k<=n;k++){const x=-S/2+k*bw;if(k>0&&k<n&&inS(x))continue;Cw.b(bm,th,y1-y0,.1,x,(y0+y1)/2,.03);}
  for(const k of n>1?[0,n-1]:[]){const xa=-S/2+k*bw,xb=xa+bw;if(sk&&sk.some(q=>q[1]>xa+.05&&q[0]<xb-.05))continue;const hh=(y1-y0)*.62,len=Math.hypot(bw,hh),ang=Math.atan2(hh,bw)*(k===0?1:-1);Cw.b(bm,len,.12,.08,(xa+xb)/2,y0+hh/2,.03,0,0,ang);}}
function vPlinth(C,m,W,D,lot){const ph=lot.fl-lot.base+.55;C.b(m,W+.3,ph,D+.3,0,.12-ph/2,0);}
// ---------- Häuser ----------
function vl2House(V,M,L,lot,B){const rr=mulberry32(lot.seed>>>0),C=vCx(V,vM(lot.x,lot.fl,lot.z,0,lot.ry,0)),W=lot.W,D=lot.D,flA=[M.flR,M.flY,M.flB,M.flW];
  const oF={win:M.winF,ww:.8,wh:.8,fr:M.beamD,sh:rr()<.6?[M.pRed,M.pBlue,M.pGreen,M.pOchre][(rr()*4)|0]:null,door:M.doorF,step:M.stone,box:M.plankB,fl:rr()<.4?flA:null};
  const oE={win:M.winE,ww:.7,wh:1.05,fr:M.beamL,sh:null,door:M.doorE,step:M.elfStone,box:M.beamL,fl:rr()<.55?flA:null};
  const noFl=o=>Object.assign({},o,{fl:null});
  const sol=(ox,oz,hw,hd,top)=>{const p=C.w(ox,0,oz);B.sol.push(solAdd({x:p.x,z:p.z,hw,hd,y0:lot.base-1,y1:lot.fl+top,rot:-lot.ry,solid:1}));};
  const chim=(x,z,H,Hr)=>{const t=Hr+.75;C.b(M.stone,.6,t-H+.2,.6,x,(H-.2+t)/2,z);C.b(M.stone,.76,.14,.76,x,t+.07,z);B.chim.push(C.w(x,t+.3,z));};
  const corners=(Cc,m,W,D,y0,y1,th)=>{for(const sx of[-1,1])for(const sz of[-1,1])Cc.b(m,th,y1-y0,th,sx*W/2,(y0+y1)/2,sz*D/2);};
  const vines=(Cc,W,D,H,n)=>{for(let k=0;k<n;k++){const f=rr()<.5?1:-1,x=(rr()-.5)*W*.9,len=.7+rr()*1.6;Cc.b(M.vine,.24,len,.06,x,H-len/2,f*(D/2+.04));}};
  switch(lot.t){
  case'kate':{const H=2.5,o=oF;vPlinth(C,M.stone,W,D,lot);C.b(M.plankG,W,H,D,0,H/2,0);corners(C,M.beamD,W,D,0,H,.16);
    const[Cf]=vWall(C,'f',W,D);vDoor(Cf,o,lot.dx);vWin(Cf,lot.dx>0?-W*.24:W*.24,1.5,o);vWin(vWall(C,'b',W,D)[0],0,1.5,noFl(o));vWin(vWall(C,rr()<.5?'l':'r',W,D)[0],0,1.5,noFl(o));
    const Hr=vRoof(C,M.thatch,M.plankG,W,D,H,.72,.5,null);C.b(M.thatchD,W+1.1,.32,.5,0,Hr+.06,0);if(rr()<.65)chim(W*.28*(rr()<.5?-1:1),-D*.2,H,Hr);sol(0,0,W/2,D/2,Hr);break;}
  case'haus':{const H=2.8,o=oF,up=rr()<.5?M.plankB:M.plankG;vPlinth(C,M.stone,W,D,lot);C.b(M.stone,W,1.1,D,0,.55,0);C.b(up,W,H-1.1,D,0,1.1+(H-1.1)/2,0);C.b(M.beamD,W+.08,.14,D+.08,0,1.12,0);corners(C,M.beamD,W,D,1.1,H,.16);
    const[Cf]=vWall(C,'f',W,D);vDoor(Cf,o,lot.dx);for(const x of[-W*.3,W*.3])if(Math.abs(x-lot.dx)>1.1)vWin(Cf,x,1.65,o);
    const[Cb]=vWall(C,'b',W,D);for(const x of[-W*.25,W*.25])vWin(Cb,x,1.65,noFl(o));for(const f of['l','r'])vWin(vWall(C,f,W,D)[0],0,1.65,noFl(o));
    const th=rr()<.5,Hr=vRoof(C,th?M.thatch:M.shingle,up,W,D,H,.68,.5,th?null:M.beamD);if(th)C.b(M.thatchD,W+1.1,.32,.5,0,Hr+.06,0);chim(W*.3*(rr()<.5?-1:1),-D*.2,H,Hr);sol(0,0,W/2,D/2,Hr);break;}
  case'bunt':{const H=3.0,pm=[M.pRed,M.pOchre,M.pBlue,M.pGreen,M.pRed][(rr()*5)|0],o=Object.assign({},oF,{fr:M.white,sh:null,win:M.winW});vPlinth(C,M.stone,W,D,lot);C.b(pm,W,H,D,0,H/2,0);
    corners(C,M.white,W,D,0,H,.18);C.b(M.white,W+.06,.12,D+.06,0,H-.06,0);
    const[Cf]=vWall(C,'f',W,D);vDoor(Cf,o,lot.dx);vWin(Cf,lot.dx<0?W*.24:-W*.24,1.6,o);for(const f of['l','r']){const[Cs]=vWall(C,f,W,D);vWin(Cs,-D*.25,1.6,noFl(o));vWin(Cs,D*.25,1.6,noFl(o));}vWin(vWall(C,'b',W,D)[0],0,1.6,noFl(o));
    const pit=.8,Hr=vRoof(C.s(0,0,0,Math.PI/2),rr()<.5?M.slate:M.shingle,pm,D,W,H,pit,.42,M.white);vWin(Cf,0,H+(Hr-H)*.4,Object.assign({},o,{ww:.55,wh:.55,fl:null}));
    if(rr()<.6)chim(-W*.2,-D*.25,H,Hr);sol(0,0,W/2,D/2,Hr);break;}
  case'fach':{const H1=2.7,H2=2.4,D2=D+.5,o=oF,rm=rr()<.5?M.shingle:M.slate;vPlinth(C,M.stone,W,D,lot);C.b(M.plaster,W,H1,D,0,H1/2,0);C.b(M.plaster,W,H2,D2,0,H1+H2/2,0);C.b(M.beamD,W+.12,.2,D2+.12,0,H1+.02,0);
    const gw=W>6.4?[W*.05,W*.32]:[W*.2];
    for(const f of['f','b','l','r']){const[Cw,S]=vWall(C,f,W,D),[Cu,S2]=vWall(C,f,W,D2);let gx=[],ux=[];if(f==='f'){vDoor(Cw,o,lot.dx);gx=gw;ux=[-W/3,0,W/3];}else if(f==='b'){gx=[-W*.25,W*.25];ux=gx;}else ux=[0];
      for(const x of gx)vWin(Cw,x,1.55,f==='f'?o:noFl(o));for(const x of ux)vWin(Cu,x,H1+1.25,noFl(o));const sk=gx.map(x=>[x-.55,x+.55]);if(f==='f')sk.push([lot.dx-.65,lot.dx+.65]);
      vFrame(Cw,M.beamD,S,.12,H1,sk);vFrame(Cu,M.beamD,S2,H1+.1,H1+H2,ux.map(x=>[x-.55,x+.55]));}
    const Hr=vRoof(C,rm,M.plaster,W,D2,H1+H2,.72,.45,M.beamD);chim(W*.3*(rr()<.5?-1:1),-D2*.2,H1+H2,Hr);sol(0,0,W/2,D2/2,Hr);break;}
  case'lang':{const sa=rr()<.5?1:-1,Wb=W-2.3,bx=-sa*1.15,H=2.5,o=oF,Cb=C.s(bx,0,0,0);vPlinth(Cb,M.stone,Wb,D,lot);Cb.b(M.plankB,Wb,H,D,0,H/2,0);corners(Cb,M.beamD,Wb,D,0,H,.16);
    const[Cf]=vWall(Cb,'f',Wb,D),dl=lot.dx-bx;vDoor(Cf,o,dl);for(const x of[-Wb*.32,Wb*.32])if(Math.abs(x-dl)>1.1)vWin(Cf,x,1.5,o);
    const[Cbk]=vWall(Cb,'b',Wb,D);for(const x of[-Wb*.3,0,Wb*.3])vWin(Cbk,x,1.5,noFl(o));vWin(vWall(Cb,sa>0?'l':'r',Wb,D)[0],0,1.5,noFl(o));
    const Hr=vRoof(Cb,M.thatch,M.plankB,Wb,D,H,.75,.5,null);Cb.b(M.thatchD,Wb+1.1,.32,.5,0,Hr+.06,0);chim(bx+Wb*.25,-D*.2,H,Hr);
    // offener Anbau mit Fässern und Holz
    const ax=sa*(W/2-1.1),Ca=C.s(ax,0,0,0),Da=D-.4,hb=lot.base-lot.fl;Ca.b(M.plankB,2.2,2.4-hb,.12,0,(2.4+hb)/2,-Da/2);Ca.b(M.plankB,.12,2.3-hb,Da,sa*1.05,(2.3+hb)/2,0);
    for(const px of[sa*1.05,-sa*.95])Ca.b(M.beamD,.14,2.05-hb,.14,px,(2.05+hb)/2,Da/2);const sl=Math.atan2(.45,Da+.6);Ca.b(M.shingle,2.5,.12,Math.hypot(Da+.6,.45),0,2.32,0,sl,0,0);
    Ca.cyl(M.barrel,.34,.85,8,-sa*.3,hb,-Da/2+.5,'fit',true);Ca.cyl(M.barrel,.34,.85,8,sa*.4,hb,-Da/2+.55,'fit',true);for(let k=0;k<3;k++)for(let q=0;q<3-k;q++)Ca.b(M.log,.26,.26,1.3,(q-(2-k)/2)*.28,hb+.13+k*.24,Da/2-1.1);
    sol(bx,0,Wb/2,D/2,Hr);sol(ax,0,1.1,Da/2,2.4);break;}
  case'schuppen':{const H=2.3;vPlinth(C,M.stone,W,D,lot);C.b(M.plankG,W,.1,D,0,.17,0);C.b(M.plankG,W,H,.12,0,H/2,-D/2+.06);for(const sx of[-1,1])C.b(M.plankG,.12,H,D,sx*(W/2-.06),H/2,0);
    for(const x of[-W/2+.1,0,W/2-.1])C.b(M.beamD,.16,H,.16,x,H/2,D/2-.08);C.b(M.beamD,W,.16,.16,0,H-.08,D/2-.08);const Hr=vRoof(C,M.shingle,M.plankG,W,D,H,.6,.45,M.beamD);
    C.b(M.net,W-.8,1.4,.03,0,1.3,-D/2+.16);C.cyl(M.barrel,.34,.85,8,-W*.3,.22,-.2,'fit',true);C.cyl(M.barrel,.34,.85,8,-W*.3+.75,.22,-.3,'fit',true);C.b(M.plankB,.7,.7,.7,W*.28,.57,-.3,0,.4,0);
    C.b(M.beamL,.08,2.1,.12,W*.05,1.2,-D/2+.32,0,0,.18);C.b(M.beamL,.08,2.1,.12,W*.12,1.2,-D/2+.32,0,0,.1);sol(0,0,W/2,D/2,Hr);break;}
  case'elfhaus':{const H=3.0,o=oE,rm=rr()<.25?M.leafA:M.leafRoof;vPlinth(C,M.elfStone,W,D,lot);C.b(M.elfStone,W,H,D,0,H/2,0);corners(C,M.beamL,W,D,0,H,.2);C.b(M.beamL,W+.06,.14,D+.06,0,H-.07,0);
    const[Cf]=vWall(C,'f',W,D);vDoor(Cf,o,lot.dx);for(const x of[-W*.3,W*.3])if(Math.abs(x-lot.dx)>1.1)vWin(Cf,x,1.7,o);const[Cb]=vWall(C,'b',W,D);for(const x of[-W*.25,W*.25])vWin(Cb,x,1.7,noFl(o));
    for(const f of['l','r'])vWin(vWall(C,f,W,D)[0],0,1.7,noFl(o));const Hr=vRoof(C,rm,M.elfStone,W,D,H,.9,.55,M.beamL);vines(C,W,D,H,5);
    C.b(M.beamL,.08,.08,.45,lot.dx+.85,2.35,D/2+.22);C.b(M.crystal,.2,.3,.2,lot.dx+.85,2.16,D/2+.42,0,.785,0);sol(0,0,W/2,D/2,Hr);break;}
  case'elfturm':{const r=2.15,H=5.8,o=oE,ap=r*Math.cos(Math.PI/8),ph=lot.fl-lot.base+.55,rm=rr()<.3?M.leafA:M.leafRoof;C.cyl(M.elfStone,r+.18,ph,8,0,.12-ph,0,'tile',true,Math.PI/8);
    C.cyl(M.elfStone,r,H,8,0,0,0,'tile',false,Math.PI/8);for(const y of[2.85,H-.1])C.cyl(M.beamL,r+.05,.2,8,0,y,0,'tile',false,Math.PI/8);vDoor(C.s(0,0,ap,0),o,0);
    for(let k=0;k<8;k++){const a=k*Math.PI/4,Cw=C.s(Math.sin(a)*ap,0,Math.cos(a)*ap,a);if(k===2||k===6)vWin(Cw,0,1.7,noFl(o));if(k%2===0)vWin(Cw,0,4.3,noFl(o));}
    C.cone(rm,r+.75,3.8,8,0,H-.05,0,Math.PI/8);C.b(M.gold,.12,1.3,.12,0,H+3.9,0);C.b(M.crystal,.26,.4,.26,0,H+4.6,0,0,.785,0);vines(C.s(0,0,0,0),r*1.4,r*1.9,H-.2,3);sol(0,0,r*.92,r*.92,H+3.5);break;}
  case'baumhaus':{const o=oE,hb=lot.base-lot.fl,py=4.3;C.cyl(M.bark,.85,9.6-hb,8,0,hb-.3,0,'tile',false,0);for(let k=0;k<4;k++){const a=k*1.5708+.4;C.b(M.bark,.35,.5,1.6,Math.sin(a)*.95,hb+.1,Math.cos(a)*.95,0,a,0);}
    C.b(M.plankE,5.2,.24,5.2,0,py,0);for(const sx of[-1,1])for(const sz of[-1,1])C.b(M.beamL,.18,py-hb,.18,sx*2.4,(py+hb)/2,sz*2.4);
    for(const sx of[-1,0,1])for(const sz of[-1,0,1]){if(!sx&&!sz)continue;if(sz===1&&sx===0)continue;C.b(M.beamL,.1,.9,.1,sx*2.5,py+.55,sz*2.5);}
    C.b(M.beamL,5.1,.08,.08,0,py+.95,-2.5);for(const sx of[-1,1])C.b(M.beamL,.08,.08,5.1,sx*2.5,py+.95,0);for(const sx of[-1,1])C.b(M.beamL,1.9,.08,.08,sx*1.6,py+.95,2.5);
    const Ch=C.s(0,py+.12,-.6,0);Ch.b(M.plankE,3.2,2.3,2.8,0,1.15,0);vDoor(vWall(Ch,'f',3.2,2.8)[0],Object.assign({},o,{step:M.plankE}),0);for(const f of['l','r'])vWin(vWall(Ch,f,3.2,2.8)[0],0,1.4,noFl(o));
    vRoof(Ch,M.leafRoof,M.plankE,3.2,2.8,2.3,.85,.4,M.beamL);for(const sx of[-1,1])C.b(M.beamL,.08,py-hb+.9,.08,sx*.3,(py+hb+.9)/2,2.72);for(let y=hb+.35;y<py;y+=.36)C.b(M.beamL,.6,.06,.06,0,y,2.72);
    for(let k=0;k<6;k++)C.b(M.canopy,2.6+rr()*1.6,1.4+rr(),2.6+rr()*1.6,(rr()-.5)*3.2,8.4+rr()*1.8,(rr()-.5)*3.2-.4,0,rr()*1.5,0);
    C.b(M.crystal,.2,.3,.2,1.8,py-.4,2.3,0,.785,0);sol(0,0,.9,.9,10);break;}
  case'elfhalle':{const Db=D-1.5,H=3.3,o=oE,Cb=C.s(0,0,-.75,0),rm=rr()<.3?M.leafA:M.leafRoof;vPlinth(Cb,M.elfStone,W,Db,lot);Cb.b(M.plasterE,W,H,Db,0,H/2,0);
    for(const f of['f','b','l','r']){const[Cw,S]=vWall(Cb,f,W,Db),xs=f==='f'?[-W*.33,W*.33]:f==='b'?[-W*.3,0,W*.3]:[0];if(f==='f')vDoor(Cw,o,0);for(const x of xs)vWin(Cw,x,1.75,f==='f'?o:noFl(o));
      const sk=xs.map(x=>[x-.5,x+.5]);if(f==='f')sk.push([-.65,.65]);vFrame(Cw,M.beamL,S,.12,H,sk);}
    const Hr=vRoof(Cb,rm,M.plasterE,W,Db,H,.8,.5,M.beamL);C.b(M.plankE,W*.72,.16,1.5,0,.04,D/2-.75);for(const x of[-W*.33,-W*.11,W*.11,W*.33])C.b(M.beamL,.18,2.75,.18,x,1.4,D/2-.15);
    const pl=Math.hypot(1.75,.32);C.b(rm,W*.76,.12,pl,0,2.98,D/2-.68,Math.atan2(.32,1.75),0,0);C.b(M.beamL,W*.72,.16,.16,0,2.8,D/2-.15);vines(Cb,W,Db,H,4);sol(0,-.75,W/2,Db/2,Hr);break;}
  case'elfgiebel':default:{const H=3.1,o=oE,rm=rr()<.3?M.leafA:M.leafRoof;vPlinth(C,M.elfStone,W,D,lot);C.b(M.elfStone,W,H,D,0,H/2,0);corners(C,M.beamL,W,D,0,H,.2);C.b(M.beamL,W+.06,.14,D+.06,0,H-.07,0);
    const[Cf]=vWall(C,'f',W,D);vDoor(Cf,o,lot.dx);vWin(Cf,lot.dx<0?W*.24:-W*.24,1.7,o);for(const f of['l','r']){const[Cs]=vWall(C,f,W,D);vWin(Cs,-D*.25,1.7,noFl(o));vWin(Cs,D*.25,1.7,noFl(o));}vWin(vWall(C,'b',W,D)[0],0,1.7,noFl(o));
    const Hr=vRoof(C.s(0,0,0,Math.PI/2),rm,M.elfStone,D,W,H,1.0,.45,M.beamL);vWin(Cf,0,H+(Hr-H)*.38,Object.assign({},o,{ww:.5,wh:.75,fl:null}));vines(C,W,D,H,4);sol(0,0,W/2,D/2,Hr);break;}}}
// ---------- Gärten ----------
function vl2Garden(V,M,L,gd,B){const r=mulberry32(gd.seed>>>0),h=gd.h,C=vCx(V,vM(gd.x,h,gd.z,0,gd.ry,0)),W=gd.W,D=gd.D,fm=L.elf?M.beamL:M.beamD;
  const gy=(x,z)=>{const p=C.w(x,0,z);return getHeight(p.x,p.z)-h;};
  const side=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(len/1.5)),a=Math.atan2(x1-x0,z1-z0);for(let k=0;k<=n;k++){const x=x0+(x1-x0)*k/n,z=z0+(z1-z0)*k/n;C.b(fm,.1,1.05,.1,x,gy(x,z)+.42,z);}
    const ym=(gy(x0,z0)+gy(x1,z1))/2;for(const y of[.35,.75])C.b(fm,.06,.08,len,(x0+x1)/2,ym+y,(z0+z1)/2,0,a,0);const p=C.w((x0+x1)/2,0,(z0+z1)/2);B.sol.push(solAdd({x:p.x,z:p.z,hw:.08,hd:len/2,y0:h-1.5,y1:h+ym+1.1,rot:-(gd.ry+a),solid:1}));};
  side(-W/2,-D/2,W/2,-D/2);side(-W/2,-D/2,-W/2,D/2);side(W/2,-D/2,W/2,D/2);side(-W/2,D/2,-.6,D/2);side(.6,D/2,W/2,D/2);
  for(let z=-D/2+.55;z<D/2-.4;z+=.7){const kind=r();for(let x=-W/2+.5;x<W/2-.35;x+=.48){const y=gy(x,z);if(kind<.5)C.b(M.crop,.3+r()*.08,.26,.3+r()*.08,x,y+.13,z,0,r(),0);else if(kind<.75){C.b(M.beamL,.04,1.3,.04,x,y+.65,z);C.b(M.crop,.2,.9,.12,x,y+.7,z+.02);}
      else{C.b(M.crop,.14,.2,.14,x,y+.1,z);if(r()<.4)C.b([M.flR,M.flY][(r()*2)|0],.08,.08,.08,x,y+.24,z);}}}}
// ---------- Kleinkram ----------
function vl2Boat(C,M){C.b(M.plankB,1.0,.08,3.0,0,0,0);for(const sx of[-1,1])C.b(M.plankB,.08,.46,2.9,sx*.55,.2,0,0,0,-sx*.25);C.b(M.plankB,1.15,.46,.08,0,.2,-1.48);
  for(const sx of[-1,1])C.b(M.plankB,.08,.46,.95,sx*.3,.2,1.78,0,-sx*.55,0);C.b(M.plankB,1.0,.06,.3,0,.32,.3);C.b(M.beamL,.06,.06,2.4,.2,.42,0,0,.15,0);}
function vl2Deco(V,M,L,d,B){const h=getHeight(d.x,d.z),ry=d.ry||0,C=vCx(V,vM(d.x,h,d.z,0,ry,0)),elf=L.elf;
  const so=(hw,hd,top,ox,oz)=>{const p=C.w(ox||0,0,oz||0);B.sol.push(solAdd({x:p.x,z:p.z,hw,hd,y0:h-1,y1:h+top,rot:-ry,solid:1}));};
  switch(d.t){
  case'well':{C.cyl(M.stone,1.0,.95,10,0,-.4,0,'tile',true);C.cyl(M.waterD,.8,.03,10,0,.56,0,'fit',true);for(const sx of[-1,1])C.b(M.beamD,.16,2.3,.16,sx*.88,1.0,0);C.b(M.beamD,2.0,.14,.14,0,1.95,0);
    vRoof(C.s(0,2.1,0,0),M.shingle,null,2.3,1.5,0,.62,.18,M.beamD);C.b(M.rope,.04,.7,.04,.25,1.55,0);C.b(M.plankB,.3,.28,.3,.25,1.1,0);so(1.05,1.05,2.5);break;}
  case'fountain':{C.cyl(M.elfStone,1.9,.95,8,0,-.4,0,'tile',true,Math.PI/8);C.cyl(M.water,1.68,.04,8,0,.52,0,'fit',true,Math.PI/8);C.cyl(M.elfStone,.3,1.7,8,0,.5,0,'tile',true);
    C.cyl(M.elfStone,.75,.2,8,0,2.1,0,'tile',true,Math.PI/8);C.b(M.crystal,.42,.42,.42,0,2.72,0,.62,.785,0);for(let k=0;k<4;k++){const a=k*1.5708+.785;C.b(M.crystal,.16,.3,.16,Math.sin(a)*1.75,.75,Math.cos(a)*1.75,0,.785,0);}
    so(1.9,1.9,1.4);B.spark.push({x:d.x,y:h+2.75,z:d.z});break;}
  case'stall':{const cm=elf?M.clothE:M.clothF;for(const sx of[-1,1]){C.b(M.beamD,.12,2.35,.12,sx*1.25,1.17,.62);C.b(M.beamD,.12,2.7,.12,sx*1.25,1.35,-.62);}
    C.b(elf?M.plankE:M.plankB,2.6,.95,.7,0,.47,.42);C.b(cm,3.0,.06,1.9,0,2.55,0,.18,0,0);
    if(elf){for(let k=0;k<6;k++)C.b([M.flR,M.flY,M.crystal,M.flB][k%4],.16,.2,.16,-1+k*.4,1.05,.42);}else{for(let k=0;k<5;k++)C.b(M.fish,.12,.06,.42,-.95+k*.42,.99,.42,0,.3,0);C.b(M.plankB,.6,.35,.5,.85,1.12,.42);}
    so(1.3,.4,1.2,0,.42);break;}
  case'bench':{const pm=elf?M.plankE:M.plankB;C.b(pm,1.6,.08,.42,0,.46,0);for(const sx of[-1,1])C.b(M.beamD,.1,.46,.36,sx*.66,.23,0);C.b(pm,1.6,.32,.06,0,.78,-.2,-.12,0,0);break;}
  case'lamp':{if(elf){C.b(M.beamL,.12,2.7,.12,0,1.35,0);C.b(M.beamL,.1,.1,.5,0,2.7,.2);C.b(M.crystal,.22,.36,.22,0,2.46,.42,0,.785,0);}
    else{C.b(M.beamD,.14,2.6,.14,0,1.3,0);C.b(M.beamD,.1,.1,.62,0,2.52,.28);C.b(M.lamp,.24,.3,.24,0,2.24,.52);C.b(M.iron,.32,.06,.32,0,2.42,.52);}so(.1,.1,2.6);break;}
  case'lampE':{C.b(M.beamL,.1,1.4,.1,0,.7,0);C.b(M.crystal,.2,.32,.2,0,1.56,0,0,.785,0);break;}
  case'barrel':{C.cyl(M.barrel,.36,.9,8,0,0,0,'fit',true);so(.38,.38,.9);break;}
  case'barrel2':{C.cyl(M.barrel,.36,.9,8,-.38,0,0,'fit',true);C.cyl(M.barrel,.36,.9,8,.38,0,.08,'fit',true);C.cyl(M.barrel,.32,.8,8,0,.9,.04,'fit',true);so(.78,.4,1.7);break;}
  case'crate':{C.b(M.plankB,.75,.75,.75,0,.37,0,0,.3,0);if(d.big)C.b(M.plankB,.55,.55,.55,.05,1.02,0,0,.9,0);so(.45,.45,.8);break;}
  case'wood':{for(let k=0;k<3;k++)for(let q=0;q<3-k;q++)C.b(M.log,.26,.26,1.3,(q-(2-k)/2)*.28,.13+k*.24,0);so(.45,.68,.75);break;}
  case'flowers':{C.b(M.beamL,1.4,.2,.7,0,.1,0);C.b(M.soil,1.3,.06,.6,0,.2,0);for(let k=0;k<8;k++)C.b([M.flR,M.flY,M.flB,M.flW][k%4],.14,.18+((k*7)%3)*.05,.14,-.5+(k%4)*.33,.3,-.15+((k/4)|0)*.3);break;}
  case'sign':{C.b(M.beamD,.14,2.2,.14,0,1.1,0);const cv=document.createElement('canvas');cv.width=128;cv.height=32;const x=cv.getContext('2d');x.fillStyle=elf?'#d8d0b0':'#6a4a2c';x.fillRect(0,0,128,32);
    x.fillStyle=elf?'#8a7a50':'#3a2616';x.fillRect(0,0,128,2);x.fillRect(0,30,128,2);x.fillRect(0,0,2,32);x.fillRect(126,0,2,32);x.fillStyle=elf?'#2a4a2a':'#f0e0b0';let fs=16;x.font='bold 16px Georgia,serif';
    while(x.measureText(L.g.name).width>118&&fs>9){fs--;x.font='bold '+fs+'px Georgia,serif';}x.textAlign='center';x.textBaseline='middle';x.fillText(L.g.name,64,17);
    const t=vTex(cv,false),m=new THREE.MeshLambertMaterial({map:t});B.extra.push(t,m);C.b(m,1.8,.5,.06,0,1.78,.1,0,0,0,'fit');so(.1,.1,2.2);break;}
  case'arch':{const w=d.w;for(const sx of[-1,1])C.cyl(M.elfStone,.26,3.0,8,sx*w/2,-.2,0,'tile',true);const n=7;
    for(let k=0;k<n;k++){const a0=k/n*Math.PI,a1=(k+1)/n*Math.PI,x0=Math.cos(a0)*w/2,y0=2.8+Math.sin(a0)*w*.3,x1=Math.cos(a1)*w/2,y1=2.8+Math.sin(a1)*w*.3;C.b(M.elfStone,Math.hypot(x1-x0,y1-y0)+.08,.3,.36,(x0+x1)/2,(y0+y1)/2,0,0,0,Math.atan2(y1-y0,x1-x0));}
    for(let k=0;k<6;k++){const xx=-w/2+.4+k*(w-.8)/5,top=2.8+Math.sqrt(Math.max(0,1-(xx/(w/2))**2))*w*.3,len=.4+((k*5)%4)*.25;C.b(M.vine,.2,len,.08,xx,top-.15-len/2,.2);}
    C.b(M.crystal,.22,.38,.22,0,2.8+w*.3-.45,0,0,.785,0);for(const sx of[-1,1])so(.28,.28,3,sx*w/2,0);break;}
  case'rack':{for(const sx of[-1,1])C.b(M.beamD,.12,1.9,.12,sx*1.15,.95,0);C.b(M.beamD,2.5,.1,.1,0,1.85,0);for(let k=0;k<6;k++){C.b(M.rope,.02,.2,.02,-.9+k*.36,1.7,0);C.b(M.fish,.05,.4,.13,-.9+k*.36,1.42,0);}so(1.2,.15,1.9);break;}
  case'netrack':{for(const sx of[-1,1])C.b(M.beamD,.12,2,.12,sx*1.2,1,0);C.b(M.beamD,2.6,.1,.1,0,1.95,0);C.b(M.net,2.3,1.5,.02,0,1.15,0);C.cyl(M.barrel,.3,.7,8,1.7,0,.3,'fit',true);so(1.25,.12,2);break;}}}
// ---------- Steg ----------
function vl2Pier(V,M,L,B){const g=L.g,ang=g.wa.ang,c=Math.cos(ang),s=Math.sin(ang),wr=L.roads.find(q=>q.water);let k0=4;if(wr){const p=wr.pts[wr.pts.length-1];k0=Math.max(4,Math.hypot(p.x-g.x,p.z-g.z)-1.5);}
  const L2=Math.max(g.wa.dd+10,k0+12);for(let k=k0;k<L2;k+=1){const x=g.x+c*k,z=g.z+s*k,gy=getHeight(x,z),y=Math.max(gy,WATER+.45);V.box(M.plankG,2.2,.18,1.05,vM(x,y,z,0,-ang+Math.PI/2,0),'tile');
    if((Math.round(k-k0))%3===0&&gy<y-.5){for(const sd of[1,-1])V.box(M.beamD,.18,y-gy+.6,.18,vM(x+s*sd,gy+(y-gy)/2-.2,z-c*sd,0,0,0),'tile');}
    B.sol.push(solAdd({x,z,hw:.53,hd:1.1,y0:y-.1,y1:y+.09,rot:ang,walk:1}));}
  {const x=g.x+c*(L2-.6),z=g.z+s*(L2-.6),y=Math.max(getHeight(x,z),WATER+.45);for(const sd of[1,-1])V.box(M.beamD,.2,.7,.2,vM(x+s*sd*.95,y+.35,z-c*sd*.95,0,0,0),'tile');}
  let nb=0;for(let k=Math.ceil(k0+4);k<L2-2&&nb<2;k+=3){const x=g.x+c*k,z=g.z+s*k;if(getHeight(x,z)>WATER-.7)continue;const sd=nb===0?1:-1;vl2Boat(vCx(V,vM(x+s*sd*1.9,WATER+.06,z-c*sd*1.9,0,Math.atan2(c,s),0)),M);nb++;}}
// ---------- Planung: Straßen, Grundstücke, Gärten, Deko ----------
const VL2_T={f:[['kate',3,4.2,5,3.8,4.3],['haus',3,5.4,6.6,4.4,5],['bunt',3,4.6,5.4,6,7],['fach',2,6,7,4.8,5.4],['lang',1.4,9,10.5,4.4,4.8],['schuppen',1,4.5,5.5,3.4,3.8]],
  e:[['elfhaus',3,5,6,4.4,4.9],['elfturm',2,4.8,4.8,4.8,4.8],['baumhaus',1.3,6,6,6,6],['elfhalle',1.5,8.5,9.5,6.4,6.6],['elfgiebel',2.5,4.8,5.4,6.2,6.8]]};
function vl2DoorX(t,W,r){return t==='kate'?(r()<.5?-1:1)*W*.22:(t==='bunt'||t==='elfgiebel')?-W*.2:t==='fach'?-W*.28:0;}
const vSegD=(s,x,z)=>{const t=Math.max(0,Math.min(1,((x-s.ax)*s.dx+(z-s.az)*s.dz)/s.l2)),px=s.ax+s.dx*t,pz=s.az+s.dz*t;return Math.hypot(x-px,z-pz);};
const vSeg=(ax,az,bx,bz,hw,kind,road)=>{const dx=bx-ax,dz=bz-az;return{ax,az,bx,bz,dx,dz,l2:dx*dx+dz*dz||1e-6,hw,kind,road};};
function vl2RectD(o,x,z){const dx=x-o.x,dz=z-o.z,c=Math.cos(o.ry),s=Math.sin(o.ry),lx=dx*c-dz*s,lz=dx*s+dz*c,ex=Math.abs(lx)-o.W/2,ez=Math.abs(lz)-o.D/2;return ex>0||ez>0?Math.hypot(Math.max(ex,0),Math.max(ez,0)):Math.max(ex,ez);}
function vl2Layout(g){if(g.lay)return g.lay;const r=mulberry32(((g.seed|0)*31+77)>>>0),elf=g.k==='e',H=(x,z)=>getHeight(x,z),RMAX=54;
  const L={g,elf,roads:[],segs:[],paths:[],lots:[],gard:[],deco:[],pr:elf?6.5:6,R:24,mhw:elf?1.45:1.7,shw:elf?1.0:1.15};
  const roadD=(x,z,skip)=>{let m=1e9;for(const s of L.segs){if(skip&&s.road===skip)continue;const d=vSegD(s,x,z)-s.hw;if(d<m)m=d;}return m;};
  const pathD=(x,z)=>{let m=1e9;for(const s of L.paths){const d=vSegD(s,x,z)-s.hw;if(d<m)m=d;}return m;};
  const lotD=(x,z)=>{let m=1e9;for(const o of L.lots){const d=vl2RectD(o,x,z);if(d<m)m=d;}for(const o of L.gard){const d=vl2RectD(o,x,z);if(d<m)m=d;}return m;};
  const freeD=(x,z,rad)=>L.deco.every(d=>Math.hypot(d.x-x,d.z-z)>rad+(d.rad||.6));const put=(d,rad)=>{d.rad=rad;L.deco.push(d);};
  const addRoad=rd=>{L.roads.push(rd);for(let i=1;i<rd.pts.length;i++){const a=rd.pts[i-1],b=rd.pts[i];L.segs.push(vSeg(a.x,a.z,b.x,b.z,rd.hw,rd.k==='main'?1:2,rd));}};
  const stepOK=(x,z,px,pz,water)=>{if(Math.hypot(x-g.x,z-g.z)>RMAX)return 0;const h=H(x,z);if(Math.abs(h-H(px,pz))>1.4)return 0;if(h<WATER+(water?.3:.9))return water?2:0;return 1;};
  // Hauptstraßen vom Dorfplatz aus (im Fischerdorf zeigt die erste zum Wasser)
  const A0=g.wa?g.wa.ang:r()*6.283,arms=[A0,A0+Math.PI+(r()-.5)*.7];if(r()<.7)arms.push(A0+(r()<.5?1:-1)*(Math.PI/2+(r()-.5)*.5));
  arms.forEach((a0,ai)=>{const water=!!g.wa&&ai===0;let x=g.x,z=g.z,a=a0;const pts=[{x,z}],len=(elf?34:38)+r()*16;
    for(let s=0;s<len;s+=3){if(!water&&s>5)a+=(r()-.5)*.22;const nx=x+Math.cos(a)*3,nz=z+Math.sin(a)*3,k=stepOK(nx,nz,x,z,water);if(!k)break;x=nx;z=nz;pts.push({x,z});if(k===2)break;}
    if(pts.length>=3)addRoad({pts,hw:L.mhw,k:'main',water});});
  // Seitengassen
  for(const R0 of L.roads.slice()){if(R0.pts.length<7)continue;const nb=R0.water?(r()<.4?1:0):1+((r()*1.8)|0);
    for(let q=0;q<nb;q++){const i=3+((r()*(R0.pts.length-5))|0),p=R0.pts[i],p2=R0.pts[i+1];if(!p2)continue;const ta=Math.atan2(p2.z-p.z,p2.x-p.x),sd=r()<.5?1:-1;let a=ta+sd*(Math.PI/2+(r()-.5)*.5),x=p.x,z=p.z;const pts=[{x,z}],len=14+r()*14;
      for(let s=0;s<len;s+=3){a+=(r()-.5)*.25;const nx=x+Math.cos(a)*3,nz=z+Math.sin(a)*3;if(!stepOK(nx,nz,x,z,false))break;if(Math.hypot(nx-g.x,nz-g.z)<L.pr+4)break;if(roadD(nx,nz,R0)<6)break;x=nx;z=nz;pts.push({x,z});}
      if(pts.length>=4)addRoad({pts,hw:L.shw,k:'side',par:R0});}}
  // Grundstücke an den Straßen, Tür zur Straße
  const occ=new Set(),ck=(x,z)=>Math.floor(x)*65537+Math.floor(z),T=VL2_T[g.k]||VL2_T.f,tw=T.reduce((s,t)=>s+t[1],0),pick=()=>{let q=r()*tw;for(const t of T){if(q<t[1])return t;q-=t[1];}return T[0];};
  const tryLot=(W,D,cx,cz,ry,lim,gar)=>{const c=Math.cos(ry),s=Math.sin(ry),nx=Math.max(2,Math.ceil((W+1.2)/.9)),nz=Math.max(2,Math.ceil((D+1.2)/.9));let mn=1e9,mx=-1e9;
    for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const lx=-W/2-.6+i*(W+1.2)/nx,lz=-D/2-.6+j*(D+1.2)/nz,x=cx+lx*c+lz*s,z=cz-lx*s+lz*c,dc=Math.hypot(x-g.x,z-g.z);
      if(dc>RMAX+5||dc<L.pr+1.2)return null;if(roadD(x,z)<.3)return null;if(gar?lotD(x,z)<.5||pathD(x,z)<.3:occ.has(ck(x,z)))return null;const h=H(x,z);if(h<WATER+.9)return null;if(h<mn)mn=h;if(h>mx)mx=h;}
    if(mx-mn>(lim||1.9))return null;for(let lx=-W/2-1;lx<=W/2+1.01;lx+=.5)for(let lz=-D/2-1;lz<=D/2+1.01;lz+=.5)occ.add(ck(cx+lx*c+lz*s,cz-lx*s+lz*c));return{mn,mx};};
  const at=(rd,cum,s)=>{let i=1;while(i<cum.length-1&&cum[i]<s)i++;const a=rd.pts[i-1],b=rd.pts[i],l=cum[i]-cum[i-1]||1,t=Math.max(0,Math.min(1,(s-cum[i-1])/l));return[a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,(b.x-a.x)/l,(b.z-a.z)/l];};
  for(const rd of L.roads){const cum=[0];for(let i=1;i<rd.pts.length;i++)cum.push(cum[i-1]+Math.hypot(rd.pts[i].x-rd.pts[i-1].x,rd.pts[i].z-rd.pts[i-1].z));const tot=cum[cum.length-1];
    for(const side of r()<.5?[1,-1]:[-1,1]){let s=rd.k==='main'?L.pr+2:3;
      while(s<tot-1&&L.lots.length<26){let t=pick();if(rd.water&&r()<.35)t=T.find(q=>q[0]==='schuppen')||t;const W=t[2]+r()*(t[3]-t[2]),D=t[4]+r()*(t[5]-t[4]),sc=s+W/2;if(sc>tot+1)break;
        const[px,pz,tx,tz]=at(rd,cum,Math.min(sc,tot)),nx=-tz,nz=tx,off=rd.hw+.9+r()*.8+D/2,cx=px+nx*side*off,cz=pz+nz*side*off,fx=-nx*side,fz=-nz*side,ry=Math.atan2(fx,fz);
        const res=tryLot(W,D,cx,cz,ry);if(res){L.lots.push({t:t[0],W,D,x:cx,z:cz,ry,base:res.mn,fl:res.mx+.15,seed:(r()*1e9)|0,dx:vl2DoorX(t[0],W,r),fx,fz});s+=W+1.4+r()*2.2;if(r()<.12)s+=4+r()*4;}else s+=2;}}}
  // Trampelpfade von den Türen zur Straße
  for(const o of L.lots){const c=Math.cos(o.ry),s=Math.sin(o.ry),lz=o.D/2+.75,x=o.x+o.dx*c+lz*s,z=o.z-o.dx*s+lz*c,d=roadD(x,z);if(d>0&&d<7)L.paths.push(vSeg(x,z,x+o.fx*(d+.5),z+o.fz*(d+.5),.5,3,null));}
  // Gärten hinter den Häusern
  for(const o of L.lots){if(L.gard.length>=8||['schuppen','baumhaus','elfturm'].includes(o.t)||r()>(elf?.3:.45))continue;const gw=Math.max(3,o.W*(.75+r()*.3)),gd=2.6+r()*1.8,dd=o.D/2+1.5+gd/2,cx=o.x-o.fx*dd,cz=o.z-o.fz*dd;
    const res=tryLot(gw,gd,cx,cz,o.ry,1.1,1);if(res)L.gard.push({x:cx,z:cz,ry:o.ry,W:gw,D:gd,h:(res.mn+res.mx)/2,seed:(r()*1e9)|0,c:Math.cos(o.ry),s:Math.sin(o.ry)});}
  // Dorfplatz: Brunnen, Marktstand, Bänke
  put({t:elf?'fountain':'well',x:g.x,z:g.z,ry:0},elf?2:1.2);
  const armA=L.roads.filter(q=>q.k==='main').map(q=>Math.atan2(q.pts[1].z-q.pts[0].z,q.pts[1].x-q.pts[0].x)).sort((a,b)=>a-b),gaps=[];
  for(let i=0;i<armA.length;i++){const a=armA[i],b=i+1<armA.length?armA[i+1]:armA[0]+6.2832;gaps.push([b-a,(a+b)/2]);}if(!gaps.length)gaps.push([6.28,0]);gaps.sort((a,b)=>b[0]-a[0]);
  {const ph=gaps[0][1],R=L.pr-1.3,x=g.x+Math.cos(ph)*R,z=g.z+Math.sin(ph)*R;put({t:'stall',x,z,ry:Math.atan2(g.x-x,g.z-z),tx:g.x+Math.cos(ph)*(R+.95),tz:g.z+Math.sin(ph)*(R+.95)},1.4);}
  for(let i=1;i<Math.min(3,gaps.length);i++){const ph=gaps[i][1],R=L.pr-.8,x=g.x+Math.cos(ph)*R,z=g.z+Math.sin(ph)*R;if(gaps[i][0]>.9)put({t:'bench',x,z,ry:Math.atan2(g.x-x,g.z-z)},.9);}
  if(gaps[0][0]>2.2)for(const da of[-.55,.55]){const ph=gaps[0][1]+da,R=L.pr-.8,x=g.x+Math.cos(ph)*R,z=g.z+Math.sin(ph)*R;put({t:elf?'flowers':'barrel2',x,z,ry:Math.atan2(g.x-x,g.z-z)},.9);}
  // Laternen an den Hauptstraßen
  for(const rd of L.roads){if(rd.k!=='main')continue;let sd=1;for(let i=3;i<rd.pts.length-1;i+=4){const p=rd.pts[i],q=rd.pts[i+1],l=Math.hypot(q.x-p.x,q.z-p.z)||1,nx=-(q.z-p.z)/l,nz=(q.x-p.x)/l;
      for(const s2 of[sd,-sd]){const x=p.x+nx*s2*(rd.hw+.55),z=p.z+nz*s2*(rd.hw+.55);if(lotD(x,z)>.5&&pathD(x,z)>.6&&freeD(x,z,.8)&&H(x,z)>WATER+.5){put({t:'lamp',x,z,ry:Math.atan2(-nx*s2,-nz*s2)},.5);sd=-s2;break;}}}}
  // Ortsschild und Elfenbögen an den Dorfeingängen
  for(const rd of L.roads){if(rd.k!=='main'||rd.water||rd.pts.length<4)continue;const n=rd.pts.length,p=rd.pts[n-1],q=rd.pts[n-2],l=Math.hypot(p.x-q.x,p.z-q.z)||1,tx=(p.x-q.x)/l,tz=(p.z-q.z)/l,nx=-tz,nz=tx;
    if(elf){const x=(p.x+q.x)/2,z=(p.z+q.z)/2;if(lotD(x,z)>1)put({t:'arch',x,z,ry:Math.atan2(tx,tz),w:rd.hw*2+1.4},1.2);}
    if(!L.deco.some(d=>d.t==='sign')){const x=p.x+nx*(rd.hw+.9),z=p.z+nz*(rd.hw+.9);if(lotD(x,z)>.6)put({t:'sign',x,z,ry:Math.atan2(tx,tz)},.5);}}
  // Fischgestelle und Netze am Weg zum Wasser
  if(!elf){const wr=L.roads.find(q=>q.water);if(wr){let n=0;for(let i=wr.pts.length-2;i>=2&&n<3;i-=2){const p=wr.pts[i],q=wr.pts[i+1],l=Math.hypot(q.x-p.x,q.z-p.z)||1,tx=(q.x-p.x)/l,tz=(q.z-p.z)/l;
      for(const sd of[1,-1]){const x=p.x-tz*sd*(wr.hw+1.5),z=p.z+tx*sd*(wr.hw+1.5);if(n<3&&lotD(x,z)>.8&&pathD(x,z)>.6&&freeD(x,z,1.3)&&H(x,z)>WATER+.4){put({t:n===1?'netrack':'rack',x,z,ry:Math.atan2(tx,tz)+Math.PI/2},1.3);n++;}}}}}
  // Kleinkram an den Häusern
  for(const o of L.lots){if(o.t==='baumhaus')continue;const n=(r()*2.6)|0,c=Math.cos(o.ry),s=Math.sin(o.ry);for(let q=0;q<n;q++){const sx=r()<.5?-1:1,lx=sx*(o.W/2+.65),lz=(r()-.5)*(o.D-1.2),x=o.x+lx*c+lz*s,z=o.z-lx*s+lz*c;
      if(roadD(x,z)<.5||pathD(x,z)<.5||lotD(x,z)<.4||!freeD(x,z,.6)||H(x,z)<WATER+.6)continue;const kinds=elf?['barrel','flowers','crate','lampE']:['barrel','crate','wood','barrel2'];put({t:kinds[(r()*kinds.length)|0],x,z,ry:o.ry,big:r()<.4},.7);}}
  // Größe des Dorfs
  let R=L.pr+4;for(const rd of L.roads)for(const p of rd.pts)R=Math.max(R,Math.hypot(p.x-g.x,p.z-g.z)+3);for(const o of L.lots.concat(L.gard))R=Math.max(R,Math.hypot(o.x-g.x,o.z-g.z)+Math.hypot(o.W,o.D)/2+3);
  for(const d of L.deco)R=Math.max(R,Math.hypot(d.x-g.x,d.z-g.z)+2);L.R=Math.min(64,R);
  // Raster: 2 = Straße/Haus (keine Pflanzen), 3 = nah am Haus (keine Bäume), 1 = Dorfwiese
  const zx=Math.floor(g.x-L.R-3),zz=Math.floor(g.z-L.R-3),zn=Math.ceil(2*L.R+6),Z=new Int8Array(zn*zn);
  for(let j=0;j<zn;j++)for(let i=0;i<zn;i++){const x=zx+i+.5,z=zz+j+.5;if(Math.hypot(x-g.x,z-g.z)<=L.R+1)Z[j*zn+i]=Math.hypot(x-g.x,z-g.z)<L.pr+.8?2:1;}
  const paint=(x0,z0,x1,z1,v,f)=>{const i0=Math.max(0,Math.floor(x0-zx)),i1=Math.min(zn-1,Math.floor(x1-zx)),j0=Math.max(0,Math.floor(z0-zz)),j1=Math.min(zn-1,Math.floor(z1-zz));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*zn+i;if(!Z[k]||Z[k]===2||(v===3&&Z[k]===3))continue;if(f(zx+i+.5,zz+j+.5))Z[k]=v;}};
  for(const o of L.lots.concat(L.gard)){const e=Math.hypot(o.W,o.D)/2+3.6;paint(o.x-e,o.z-e,o.x+e,o.z+e,2,(x,z)=>vl2RectD(o,x,z)<.8);paint(o.x-e,o.z-e,o.x+e,o.z+e,3,(x,z)=>vl2RectD(o,x,z)<3.5);}
  for(const s of L.segs.concat(L.paths)){const e=s.hw+(s.kind===3?.5:.7);paint(Math.min(s.ax,s.bx)-e,Math.min(s.az,s.bz)-e,Math.max(s.ax,s.bx)+e,Math.max(s.az,s.bz)+e,2,(x,z)=>vSegD(s,x,z)<e);}
  for(const d of L.deco){const e=(d.rad||.6)+.2;paint(d.x-e,d.z-e,d.x+e,d.z+e,2,(x,z)=>Math.hypot(x-d.x,z-d.z)<e);}
  L.zx=zx;L.zz=zz;L.zn=zn;L.zone=Z;L.roadD=roadD;g.lay=L;return L;}
function vl2Zone(L,x,z){const i=Math.floor(x-L.zx),j=Math.floor(z-L.zz);if(i<0||j<0||i>=L.zn||j>=L.zn)return 0;return L.zone[j*L.zn+i];}
// ---------- Feiner Dorfboden ----------
const VG={dirt:vpal2(['#4e3c28','#5c4830','#6a5438','#786042','#866c4c']),dirtE:vpal2(['#3e3424','#4a3e2a','#584a32','#64563a']),flag:vpal2(['#8e8c7c','#a09e8c','#b2b09c','#c2c0ac','#cfcdba']),
  moss:VC2('#3e5a2c'),mortE:VC2('#5a5a4a'),cob:vpal2(['#5a5650','#6a665e','#7a756c','#8a857a','#9a9488']),mortF:VC2('#3a3630'),path:vpal2(['#6a5a3e','#786848','#867452','#94805c']),
  soil:vpal2(['#2e2016','#3a2a1c','#463222','#523c28']),lotF:vpal2(['#3a3024','#463a2c']),worn:VC2('#6a6040'),peb1:VC2('#a8a49a'),peb2:VC2('#6e6a62'),leafO:VC2('#b86a24'),leafG:VC2('#7a9a3a'),goldL:VC2('#c8b070'),
  fl:vpal2(['#e84a5a','#f0d040','#8a6ae0','#f4f0ea'])};
function vl2RoadPx(L,kd,dr,c,wx,wz,n1,n2,e){const hw=kd===1?L.mhw:L.shw,dc=dr+hw;let q;
  if(L.elf&&kd===1){const[ed,id]=vVorW(wx,wz,.55,6120);q=ed<.07?vmix2(VG.moss,VG.mortE,n1):vmul2(vpk2(VG.flag,hash2(id,3,6121)),.9+n1*.12-(ed<.12?.08:0));}
  else if(L.elf){q=vpk2(VG.dirtE,.15+n2*.55+n1*.3);if(n1>.95)q=n1>.975?VG.leafO:VG.leafG;}
  else{q=vpk2(VG.dirt,.12+n2*.55+n1*.3);if(n1>.955)q=n1>.98?VG.peb1:VG.peb2;if(kd===1&&Math.abs(dc-hw*.5)<.16+n2*.06)q=vmul2(q,.8);}
  if(dr>e*.8-.3)q=vmix2(q,c,.3+n1*.3);return q;}
function vl2PlazaPx(L,dp,c,wx,wz,n1,e){let q;
  if(L.elf){if(dp%1.7<.09&&dp>2.2)return vmix2(VG.goldL,VG.flag[1],n1*.4);const[ed,id]=vVorW(wx,wz,.6,6130);q=ed<.06?vmix2(VG.moss,VG.mortE,n1):vmul2(vpk2(VG.flag,hash2(id,5,6131)),.92+n1*.1);}
  else{const[ed,id]=vVorW(wx,wz,.32,6132);q=ed<.05?vmul2(VG.mortF,.9+n1*.2):vmul2(vpk2(VG.cob,hash2(id,7,6133)),.9+n1*.14-(ed<.09?.1:0));}
  if(dp>L.pr+e-.4)q=vmix2(q,c,.3+n1*.4);return q;}
function* vl2Ground(L){const g=L.g,half=L.R+5,X0=Math.floor((g.x-half)/2)*2,Z0=Math.floor((g.z-half)/2)*2,N=Math.ceil((2*half+2)/2),S=N*2,V=N+1,T=S<=72?512:1024,ppm=T/S;
  const H=new Float32Array(V*V);for(let j=0;j<V;j++){for(let i=0;i<V;i++)H[j*V+i]=getHeight(X0+i*2,Z0+j*2);if(j%6===5)yield 0;}
  const FC=.5,FN=Math.ceil(S/FC)+3,fR=new Float32Array(FN*FN),fK=new Int8Array(FN*FN),fP=new Float32Array(FN*FN),fL=new Float32Array(FN*FN);
  for(let j=0;j<FN;j++){for(let i=0;i<FN;i++){const x=X0+i*FC,z=Z0+j*FC,k=j*FN+i;if(Math.hypot(x-g.x,z-g.z)>L.R+6){fR[k]=fP[k]=fL[k]=9;continue;}
      let m=9,kk=0;for(const s of L.segs){const d=vSegD(s,x,z)-s.hw;if(d<m){m=d;kk=s.kind;}}fR[k]=m;fK[k]=kk;let p=9;for(const s of L.paths){const d=vSegD(s,x,z)-s.hw;if(d<p)p=d;}fP[k]=p;
      let l=9;for(const o of L.lots){const d=vl2RectD(o,x,z);if(d<l)l=d;}fL[k]=l;}if(j%4===3)yield 0;}
  const fs=(F,x,z)=>{const fx=(x-X0)/FC,fz=(z-Z0)/FC,i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j,k=j*FN+i;return F[k]*(1-u)*(1-v)+F[k+1]*u*(1-v)+F[k+FN]*(1-u)*v+F[k+FN+1]*u*v;};
  const cv=document.createElement('canvas');cv.width=cv.height=T;const ctx=cv.getContext('2d'),img=ctx.createImageData(T,T),Dt=img.data,b0=L.elf?(WLP[g.sb]?g.sb:'wald'):'kueste';
  for(let py=0;py<T;py++){const wz=Z0+(py+.5)/ppm,gy=Math.floor(wz*ppm),fj=(wz-Z0)/2,jj=Math.min(N-1,Math.floor(fj)),v=fj-jj;
    for(let px=0;px<T;px++){const wx=X0+(px+.5)/ppm,o=(py*T+px)*4,dp=Math.hypot(wx-g.x,wz-g.z);if(dp>L.R+(vnoise(wx*.08,wz*.08,6102)-.5)*8){Dt[o+3]=0;continue;}
      const gx=Math.floor(wx*ppm),fi=(wx-X0)/2,ii=Math.min(N-1,Math.floor(fi)),u=fi-ii,a=H[jj*V+ii],bb=H[jj*V+ii+1],c2=H[(jj+1)*V+ii],d2=H[(jj+1)*V+ii+1],h=a*(1-u)*(1-v)+bb*u*(1-v)+c2*(1-u)*v+d2*u*v,sl=Math.hypot((bb-a+d2-c2)*.5,(c2-a+d2-bb)*.5)/2;
      let bio=b0;{const q=vnoise(wx*.09,wz*.09,6103)*.7+vnoise(wx*.6,wz*.6,6104)*.22+hash2(gx,gy,6105)*.08;if(!L.elf){if(h>WATER+1.2&&q>.28+dp/L.R*.55)bio='ebene';}else if(b0!=='wald'&&q>.3+dp/L.R*.35)bio='wald';}
      let c=wlColor(bio,h,sl,wx,wz,gx,gy);const n1=hash2(gx,gy,6110),n2=vnoise(wx*1.1,wz*1.1,6111),nv=vnoise(wx*.7,wz*.7,6101),e=(nv-.5)*.5;
            const dl=fs(fL,wx,wz);if(dl<0)c=vpk2(VG.lotF,.3+n1*.5);else if(dl<.7)c=vmul2(c,.7+dl*.43);
      for(const gd of L.gard){const dx=wx-gd.x,dz=wz-gd.z,lx=dx*gd.c-dz*gd.s,lz=dx*gd.s+dz*gd.c;if(Math.abs(lx)<gd.W/2-.15&&Math.abs(lz)<gd.D/2-.15){const row=((lz+gd.D/2)%.7)/.7;c=vpk2(VG.soil,(row<.5?.55:.15)+n1*.35);break;}}
      const dr=fs(fR,wx,wz);if(dr<e*.8+.05)c=vl2RoadPx(L,fK[Math.round((wz-Z0)/FC)*FN+Math.round((wx-X0)/FC)],dr,c,wx,wz,n1,n2,e);else if(dr<e+.45)c=vmix2(c,VG.worn,.22);
      if(dp<L.pr+e)c=vl2PlazaPx(L,dp,c,wx,wz,n1,e);
      const dq=fs(fP,wx,wz);if(dq<(nv-.5)*.4)c=vmix2(c,vpk2(VG.path,.2+n2*.6),.55+n1*.35);
      if(n1>.992&&h>WATER+1&&dr>e+.6&&dq>.4&&dl>.8&&dp>L.pr+1)c=L.elf?vpk2(VG.fl,hash2(gx,gy,6112)):VG.peb1;
      Dt[o]=c[0];Dt[o+1]=c[1];Dt[o+2]=c[2];Dt[o+3]=(h<WATER-.1&&dr>.3)?0:255;}
    if(py&1)yield 0;}
  ctx.putImageData(img,0,0);const tex=vTex(cv,false);
  const pos=new Float32Array(V*V*3),uv=new Float32Array(V*V*2),idx=[];for(let j=0;j<V;j++)for(let i=0;i<V;i++){const k=j*V+i;pos[k*3]=X0+i*2;pos[k*3+1]=H[k]+.02;pos[k*3+2]=Z0+j*2;uv[k*2]=i/N;uv[k*2+1]=1-j/N;}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const cx=X0+i*2+1,cz=Z0+j*2+1;if(Math.hypot(cx-g.x,cz-g.z)>L.R+7)continue;const a=j*V+i,b=a+1,c=a+V,d=c+1;idx.push(a,c,b,b,c,d);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
  return new THREE.Mesh(geo,new THREE.MeshPhongMaterial({map:tex,flatShading:true,shininess:0,specular:0x000000,alphaTest:.5,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));}
// ---------- Bewohner ----------
function vl2People(L,B){const g=L.g,r=mulberry32(((g.seed|0)^0x9e37)>>>0),pts=[];for(const rd of L.roads)for(const p of rd.pts)if(Math.hypot(p.x-g.x,p.z-g.z)>3&&getHeight(p.x,p.z)>WATER+.5)pts.push(p);
  const st=L.deco.find(d=>d.t==='stall'),cnt=Math.min(10,5+Math.floor(L.lots.length/3));
  for(let i=0;i<cnt;i++){const tr=i===0,look=(r()*6)|0;let x,z;if(tr&&st){x=st.tx;z=st.tz;}else{const p=pts[(r()*pts.length)|0]||{x:g.x+3,z:g.z+3};x=p.x+(r()-.5)*1.5;z=p.z+(r()-.5)*1.5;}
    const e=spawnEnt('vlg_'+g.k+look,x,z,{home:{x,z},name:tr?g.tr:(g.k==='f'?['Fischer','Fischerin','Seemann','Netzflickerin'][i%4]:['Elfe','Waldläufer','Hüterin','Sänger'][i%4]),
      role:tr?(g.k==='f'?'Händler · '+g.name:'Händlerin · '+g.name):g.name,vlgTrader:tr,talk:0,vlg:g.k});if(tr){e.wander=false;e.portrait=vlgPortrait('vlg_'+g.k+look+'_0');}B.ents.push(e);}}
// ---------- Aufbau Schritt für Schritt (damit nichts ruckelt) ----------
function* vl2Job(B){const g=B.g,L=vl2Layout(g),M=vl2Mats(),V=new VB2();
  for(const lot of L.lots){try{vl2House(V,M,L,lot,B);}catch(e){console.error('Dorfhaus',lot.t,e);}yield 0;}
  for(const gd of L.gard){try{vl2Garden(V,M,L,gd,B);}catch(e){console.error('Garten',e);}}yield 0;
  for(const d of L.deco){try{vl2Deco(V,M,L,d,B);}catch(e){console.error('Dorf-Deko',d.t,e);}}yield 0;
  if(g.wa)vl2Pier(V,M,L,B);yield 0;V.build(B.grp);yield 0;vl2People(L,B);yield 0;
  const gm=yield*vl2Ground(L);if(!VLG.built.has(g.id)){gm.geometry.dispose();gm.material.map.dispose();gm.material.dispose();return;}B.ground=gm;B.grp.add(gm);}
vlgBuild=function(g){const grp=new THREE.Group(),B={g,grp,sol:[],ents:[],chim:[],spark:[],extra:[],job:null,ground:null};VLG.built.set(g.id,B);scene.add(grp);B.job=vl2Job(B);return B;};
{const a=vlgFree;vlgFree=function(B){B.job=null;try{if(B.ground){B.ground.material.map.dispose();B.ground.material.dispose();}for(const q of B.extra||[])q.dispose();}catch(e){}a(B);};}
{const a=vlgOf;vlgOf=function(s){const g=a(s);if(g&&!g.sb)g.sb=s.b;return g;};}
function vl2Night(){const c=FLAGS.clock||0;if(c>=1260||c<300)return 1;if(c>=1140)return(c-1140)/120;if(c<420)return 1-(c-300)/120;return 0;}
vlgTick=function(dt){VLG.t-=dt;
  for(const B of VLG.built.values())if(B.job){const near=Math.hypot(B.g.x-P.x,B.g.z-P.z)<90,t0=performance.now(),bud=near?9:4;try{let r;do r=B.job.next();while(!r.done&&performance.now()-t0<bud);if(r.done)B.job=null;}catch(e){B.job=null;console.error('Dorf-Aufbau',e);}}
  if(VL2.M){const n=vl2Night(),M=VL2.M;M.winF.emissiveIntensity=M.winW.emissiveIntensity=n*.95;M.winE.emissiveIntensity=.3+n*.7;M.lamp.emissiveIntensity=.25+n;M.crystal.emissiveIntensity=.6+n*.6;}
  for(const B of VLG.built.values()){if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>80)continue;for(const c of B.chim)if(Math.random()<dt*1.4){spawnParticle(c.x+(Math.random()-.5)*.2,c.y,c.z+(Math.random()-.5)*.2,(Math.random()-.5)*.25,.5+Math.random()*.3,(Math.random()-.5)*.25,0x8c8c8c,2.6,.6);const p=parts[parts.length-1];if(p)p.g=-.25;}
    for(const s of B.spark)if(Math.random()<dt*3){spawnParticle(s.x+(Math.random()-.5)*.5,s.y,s.z+(Math.random()-.5)*.5,(Math.random()-.5)*.3,.5,(Math.random()-.5)*.3,0x9af0d0,1.2,.3);const p=parts[parts.length-1];if(p)p.g=-.3;}}
  if(VLG.t<=0){VLG.t=1;if(P.x<60000&&WL_READY&&!DGX.on){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=vlgOf(wlSite(ci+a,cj+b));if(g&&!VLG.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<210)vlgBuild(g);}}
    for(const B of[...VLG.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>280||P.x>60000)vlgFree(B);
    let cur=null;for(const B of VLG.built.values())if(Math.hypot(B.g.x-P.x,B.g.z-P.z)<(B.g.lay?B.g.lay.R*.8:28))cur=B.g;if(cur&&VLG.cur!==cur.id&&state==='playing'){showArea((cur.k==='f'?'Fischerdorf ':'Elfendorf ')+cur.name);}VLG.cur=cur?cur.id:null;
    for(const B of VLG.built.values())for(const e of B.ents){if(e.dead||e.vlgTrader)continue;if(Math.hypot(e.x-P.x,e.z-P.z)<6&&time-(e.chatT||-99)>25&&Math.random()<.3){e.chatT=time;say(e,VLG_LINES[e.vlg][(Math.random()*VLG_LINES[e.vlg].length)|0],3);}}}};
// ---------- Pflanzen: keine auf Straßen und an Häusern, Bäume nur auf der Dorfwiese (Elfen) ----------
WLB.dorfweg=Object.assign({},WLB.dorf);WLB.dorfe=Object.assign({},WLB.dorf);WLV.dorfweg=[];
WLV.dorfe=[['grass',.14,.4,.55,0,.08],['flower',.05,.35,.45,0,.05],['fern',.03,.5,.7],['bush',.01,1,1.4],['oak',.004,6.5,9.5,.45],['birch',.004,7.5,10,.35]];
WLP.dorfweg=WLP.ebene;WLP.dorfe=WLP.wald;try{FA_BIO.dorfweg=[];FA_BIO.dorfe=[];FA_TGT.dorfweg=0;FA_TGT.dorfe=0;}catch(e){}
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){const b=a(s,x,z);if(b==='meer'||b==='tiefsee')return b;if(!s.vgDone&&!['kueste','wald','redwood','nadel2'].includes(s.b))return b;const g=vlgOf(s);if(!g)return b;
  const dx=x-g.x,dz=z-g.z;if(dx*dx+dz*dz>4900)return b;const L=vl2Layout(g),zn=vl2Zone(L,x,z);if(!zn)return b;return zn===2?'dorfweg':(zn===3||!L.elf)?'dorf':'dorfe';};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(k!=='wl_dorfweg'&&k!=='wl_dorfe'&&k!=='wl_dorf')return k;const b=wlDom(x,z).b;if(!AREAS['wl_'+b]&&WLB[b]){AREAS['wl_'+b]=WLB[b].n;AREA_MUSIC['wl_'+b]=WLB[b].mus;}return'wl_'+b;};}
// ---------- Kultisten: größere Dörfer ----------
{const a=cultSettlements;cultSettlements=function(){const Ls=a();for(const S of Ls)if(S.vlg){const B=VLG.built.get(S.id);if(B){const L=vl2Layout(B.g);S.R=Math.max(14,L.R*.45);S.out=[L.R+8,L.R+26];}}return Ls;};}
// ---------- /dorf: auf die Hauptstraße stellen ----------
{const a=runCommand;runCommand=function(raw){const res=a(raw);try{if(/^\/dorf\b/i.test(String(raw||'').trim())&&cheatOn()){let best=null,bd=1e9;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);
    for(let a2=-1;a2<=1;a2++)for(let b=-1;b<=1;b++){const g=vlgOf(wlSite(ci+a2,cj+b));if(!g)continue;const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;best=g;}}
    if(best&&bd<30){const L=vl2Layout(best),rd=L.roads.find(q=>q.k==='main'&&!q.water)||L.roads[0];if(rd){const p=rd.pts[Math.min(3,rd.pts.length-1)];teleport(p.x,p.z,Math.atan2(-(best.x-p.x),-(best.z-p.z)));}}}}catch(e){}return res;};}
