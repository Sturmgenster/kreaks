/* =========================================================
   V60 · Der Löwenfelsen, neu: ein Tafelberg aus rotem Sandstein mit Steilwänden,
   einem überhängenden Felsvorsprung, einer Felsrampe auf der Rückseite und
   einer schattigen Höhle am Fuß, in der die Löwinnen die Mittagshitze verschlafen.
   ========================================================= */
const PR={ru:31,rv:18,H:17,ledge0:25,ledge1:45};
PROCK.lx=PROCK.x+PROCK.c*38;PROCK.lz=PROCK.z+PROCK.s*38;
const prLocal=(x,z)=>{const dx=x-PROCK.x,dz=z-PROCK.z;return[dx*PROCK.c+dz*PROCK.s,-dx*PROCK.s+dz*PROCK.c];};
const prWorld=(u,v)=>[PROCK.x+u*PROCK.c-v*PROCK.s,PROCK.z+u*PROCK.s+v*PROCK.c];
function prRad(ang){return 1+(vnoise(Math.cos(ang)*1.6+4,Math.sin(ang)*1.6+4,1602)-.5)*.32+.06*Math.sin(ang*5+1)+.04*Math.sin(ang*11+2);}
function prFoot(u,v){const ang=Math.atan2(v/PR.rv,u/PR.ru),k=prRad(ang);return Math.hypot(u/(PR.ru*k),v/(PR.rv*k));}
prideH=function(x,z){const dx=x-PROCK.x,dz=z-PROCK.z;if(Math.abs(dx)>100||Math.abs(dz)>100)return 0;const[u,v]=prLocal(x,z);let h=0;
  const d=prFoot(u,v);
  if(d<1){const top=PR.H-Math.max(0,-u)*.05+(vnoise(x*.11,z*.11,1603)-.5)*.9-(d>.82?(d-.82)*2.5:0);
    // eine niedrigere Felsstufe auf der linken Flanke
    const shelf=v<-6&&u<8?Math.min(1,(-v-6)/6)*4.5:0;h=Math.max(0,(top-shelf))*smooth(clamp((1-d)/.055,0,1));}
  // Rampe aus Geröll auf der Rückseite
  const r0=-PR.ru*.62,r1=-78;if(u<r0+6&&u>r1&&Math.abs(v-2)<10){const t=clamp((u-r1)/(r0-r1),0,1),top=(PR.H-(-r0)*.05)*.97;
    const rh=Math.pow(t,1.15)*top*smooth(clamp((10-Math.abs(v-2))/3.2,0,1))+(vnoise(x*.3,z*.3,1604)-.5)*.35*t;h=Math.max(h,rh);}
  return h;};
function prideBaseH(x,z){const p0=prideH;prideH=()=>0;try{return savH(x,z);}finally{prideH=p0;}}
// Felsvorsprung: begehbar, hängt über
prideLedgeTop=function(x,z){const[u,v]=prLocal(x,z);if(u<PR.ledge0-3||u>PR.ledge1)return null;const t=(u-PR.ledge0)/(PR.ledge1-PR.ledge0),hw=4.2-t*2.4;if(Math.abs(v)>hw)return null;return PROCK.y0+.25+Math.max(0,t)*.5;};
function prPixTex(){const W=64,p=new Px(W,W),S=pal(['#5a2e1c','#7a4228','#955634','#ad6c40','#c4844e','#d89c62']);
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){const band=Math.sin(y*.42+vnoise(x*.08,y*.08,1611)*3)*.12,L=.55+band+(hash2(x>>1,y,1612)-.5)*.22+(vnoise(x*.2,y*.5,1613)-.5)*.3;p.set(x,y,S[shadeIdx(L,6,x,y)]);}
  for(let k=0;k<22;k++){const r=mulberry32(1620+k);let x=r()*W,y=r()*W;const n=4+r()*10;for(let i=0;i<n;i++){p.set(((x%W)+W)%W,((y%W)+W)%W,S[0]);x+=(r()-.5)*2.2;y+=.6+r()*.8;}}
  for(let y=0;y<W;y+=8+((y*7)%5))for(let x=0;x<W;x++)if(hash2(x,y,1621)<.7)p.set(x,y,S[1]);
  const t=new THREE.CanvasTexture(p.done());t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapNearestFilter;return t;}
let prMat=null;
function prRockMat(){if(prMat)return prMat;prMat=new THREE.MeshPhongMaterial({map:prPixTex(),vertexColors:true,flatShading:true,shininess:0,specular:0,side:THREE.DoubleSide});return prMat;}
// Dreiecke mit eigener Projektion: Wände senkrecht, Flächen von oben
function prPushTri(pos,uv,col,A,B,C,tint){const ux=B[0]-A[0],uy=B[1]-A[1],uz=B[2]-A[2],vx=C[0]-A[0],vy=C[1]-A[1],vz=C[2]-A[2];
  let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const nl=Math.hypot(nx,ny,nz)||1;nx/=nl;ny/=nl;nz/=nl;const wall=Math.abs(ny)<.55;
  for(const Q of[A,B,C]){pos.push(Q[0],Q[1],Q[2]);if(wall){const h=Math.abs(nx)>Math.abs(nz)?Q[2]:Q[0];uv.push(h*.22,Q[1]*.3);}else uv.push(Q[0]*.18,Q[2]*.18);
    // Farbe: Schichtbänder an den Wänden, Sand und trockenes Gras oben
    const y=Q[1],band=.84+.16*Math.sin(y*1.7+Q[0]*.05)+(hash2(Math.round(Q[0]),Math.round(y*2),1626)-.5)*.08;let r,g,b;if(wall){r=band*1.02;g=band*.9;b=band*.84;}
    else{const gr=smooth(clamp((vnoise(Q[0]*.09,Q[2]*.09,1625)-.42)/.25,0,1)),dust=.9+vnoise(Q[0]*.3,Q[2]*.3,1627)*.15;r=dust*(1-gr)+.78*gr;g=dust*.93*(1-gr)+.9*gr;b=dust*.82*(1-gr)+.5*gr;}
    const k=tint||1;col.push(r*k,g*k,b*k);}}
function prMesh(pos,uv,col,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat||prRockMat());return m;}
function initPrideRockV2(){PROCK.y0=getHeight(...prWorld(14,0));const grp=new THREE.Group(),r=mulberry32(1631),mat=prRockMat();
  // 1) Felshaut: genau das Raster, auf dem man läuft (2-m-Gitter des Ostens)
  const pos=[],uv=[],col=[],ix0=Math.floor((PROCK.x-100-FX0)/FCELL),ix1=Math.ceil((PROCK.x+100-FX0)/FCELL),iz0=Math.floor((PROCK.z-100-FZ0)/FCELL),iz1=Math.ceil((PROCK.z+100-FZ0)/FCELL);
  const V=(ix,iz)=>[FX0+ix*FCELL,hFg(ix,iz)+.04,FZ0+iz*FCELL],inR=(ix,iz)=>prideH(FX0+ix*FCELL,FZ0+iz*FCELL)>.05;
  for(let iz=iz0;iz<iz1;iz++)for(let ix=ix0;ix<ix1;ix++){if(!(inR(ix,iz)||inR(ix+1,iz)||inR(ix,iz+1)||inR(ix+1,iz+1)))continue;
    const a=V(ix,iz),d=V(ix+1,iz),b=V(ix,iz+1),c=V(ix+1,iz+1);prPushTri(pos,uv,col,a,b,d);prPushTri(pos,uv,col,c,d,b);}
  grp.add(prMesh(pos,uv,col,mat));
  // 2) Der Vorsprung: eine sich verjüngende Felszunge mit zerklüfteter Unterseite
  {const P2=[],U2=[],C2=[],N=14,M=8,top=t=>PROCK.y0+.25+t*.5;const ring=[];
    for(let i=0;i<=N;i++){const t=i/N,u=PR.ledge0-6+t*(PR.ledge1-PR.ledge0+6),tt=clamp((u-PR.ledge0)/(PR.ledge1-PR.ledge0),0,1),hw=4.4-tt*2.5,th=3.4-tt*2.2,R=[];
      for(let j=0;j<=M;j++){const a=j/M*Math.PI;// 0: rechts oben, PI: links oben, unten dazwischen
        const v=Math.cos(a)*hw,dn=Math.sin(a)*th*(1+(hash2(i,j,1641)-.5)*.35);const y=top(tt)-.05-dn-(j===0||j===M?0:.15);R.push(prWorld(u,v).concat([y]));}
      // oben flach
      ring.push(R);}
    const W3=q=>[q[0],q[2],q[1]];
    for(let i=0;i<N;i++){const A=ring[i],B=ring[i+1];for(let j=0;j<M;j++){prPushTri(P2,U2,C2,W3(A[j]),W3(B[j]),W3(A[j+1]),.95);prPushTri(P2,U2,C2,W3(B[j+1]),W3(A[j+1]),W3(B[j]),.95);}
      // Deckfläche
      prPushTri(P2,U2,C2,W3(A[M]),W3(B[M]),W3(A[0]),1.05);prPushTri(P2,U2,C2,W3(B[0]),W3(A[0]),W3(B[M]),1.05);}
    {const E=ring[N],c=E.reduce((s,q)=>[s[0]+q[0]/E.length,s[1]+q[1]/E.length,s[2]+q[2]/E.length],[0,0,0]);for(let j=0;j<M;j++)prPushTri(P2,U2,C2,W3(E[j]),W3(c),W3(E[j+1]),.9);}
    grp.add(prMesh(P2,U2,C2,mat));}
  // 3) Geröll am Fuß der Wände und ein paar Blöcke oben
  const rock=(x,y,z,s,sy)=>{const m=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),mat);const g=m.geometry,n=g.attributes.position.count,cc=[];for(let i=0;i<n;i++){const k=.82+r()*.22;cc.push(k*1.02,k*.9,k*.82);}
    g.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));
    m.position.set(x,y,z);m.scale.set(1.2,sy||.8,1);m.rotation.set(r()*3,r()*3,r()*3);grp.add(m);};
  for(let k=0;k<70;k++){const a=r()*6.283,k2=prRad(Math.atan2(Math.sin(a),Math.cos(a))),u=Math.cos(a)*PR.ru*k2*(1.02+r()*.12),v=Math.sin(a)*PR.rv*k2*(1.02+r()*.15);if(u<-PR.ru*.55&&Math.abs(v-2)<12)continue;
    const[x,z]=prWorld(u,v);rock(x,prideBaseH(x,z)+.2,z,.8+r()*2.2,.6+r()*.5);}
  for(let k=0;k<12;k++){const u=-18+r()*36,v=(r()-.5)*PR.rv*1.2;if(prFoot(u,v)>.8)continue;const[x,z]=prWorld(u,v);rock(x,getHeight(x,z)+.3,z,.6+r()*1.4,.5+r()*.4);}
  // 4) Die Löwenhöhle am Fuß der Vorderwand
  {let u=0,v=0;const a=.95;for(let s=10;s<60;s+=.25){u=Math.cos(a)*s;v=Math.sin(a)*s;if(prFoot(u,v)>1.02)break;}
    const[x,z]=prWorld(u,v),y=prideBaseH(x,z),out=Math.atan2(Math.cos(a)*PROCK.s+Math.sin(a)*PROCK.c,Math.cos(a)*PROCK.c-Math.sin(a)*PROCK.s);
    PROCK.den={x:x+Math.cos(out)*4,z:z+Math.sin(out)*4,y,ang:out};
    const dark=new THREE.Mesh(new THREE.CircleGeometry(3.6,16,0,Math.PI),new THREE.MeshBasicMaterial({color:0x0c0604}));dark.position.set(x+Math.cos(out)*.4,y-.1,z+Math.sin(out)*.4);dark.rotation.y=Math.PI/2-out;dark.scale.set(1.25,1,1);grp.add(dark);
    for(let k=0;k<=9;k++){const t=k/9*Math.PI,ax=Math.cos(t)*4.6,ay=Math.sin(t)*3.9;rock(x+Math.cos(out)*.9-Math.sin(out)*ax,y+ay-.2,z+Math.sin(out)*.9+Math.cos(out)*ax,1+r()*.6,.9);}}
  scene.add(grp);PROCK.grp=grp;
  // Akazien und Gras auf dem Plateau
  const deco=[];for(const[u,v,h]of[[6,-5,7.5],[-12,6,6.2],[18,9,5.6]]){const[x,z]=prWorld(u,v),s=SPR.acacia0;deco.push({x,z,y:getHeight(x,z)-.1,w:h*s.w/s.h,h,spr:'acacia'+((u>0)|0),tint:1});frogProp(x,z,.45,h);}
  for(let k=0;k<70;k++){const u=-26+r()*52,v=(r()-.5)*PR.rv*1.7;if(prFoot(u,v)>.9)continue;const[x,z]=prWorld(u,v),w=.55+r()*.5;deco.push({x,z,y:getHeight(x,z)-.05,w,h:w,spr:'sgrass'+(r()*3|0),sway:.14,tint:1.05+r()*.1});}
  const dm=makeBillboards(deco,farMat||bbMaterial(decorMat.uniforms.map.value,0,0));scene.add(dm);}
initPrideRock=function(){try{initPrideRockV2();}catch(e){console.error('Löwenfelsen',e);}};
// Boden unter dem Felsen absenken, damit nur die Felshaut zu sehen ist
{const fb0=farBuild;farBuild=function(ch){fb0(ch);if(Math.abs(ch.cx-PROCK.x)>140||Math.abs(ch.cz-PROCK.z)>140||!ch.ground)return;const p=ch.ground.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);if(prideH(x,z)>.05)p.setY(i,Math.min(p.getY(i),prideBaseH(x,z)-.6));}p.needsUpdate=true;ch.ground.geometry.computeVertexNormals();};}
// Kein Bewuchs auf Wänden und Rampe
{const fd0=farData;farData=function(ch){const D=fd0(ch);if(Math.abs(ch.cx-PROCK.x)<140&&Math.abs(ch.cz-PROCK.z)<140)D.deco=D.deco.filter(o=>prideH(o.x,o.z)<.2&&prFoot(...prLocal(o.x,o.z))>1.08);return D;};}
// Tiere klettern nicht die Wände hoch
{const wl0=wLand;wLand=function(sp,x,z){if(!wl0(sp,x,z))return false;if(Math.abs(x-PROCK.x)<100&&Math.abs(z-PROCK.z)<100){const h=prideH(x,z);if(h>1.2&&sp!=='lion'&&sp!=='lioness'&&sp!=='vulture')return false;}return true;};}
// Weg der Löwen auf den Felsen: über die Rampe (immer ein Stück voraus, damit niemand hängen bleibt)
function prRoute(m,tx,tz){const on=prideH(m.x,m.z)>PR.H*.55,tOn=prideH(tx,tz)>PR.H*.55;if(on===tOn)return[tx,tz];const[mu,mv]=prLocal(m.x,m.z),R0=-PR.ru*.5,R1=-84,onRamp=mu>R1-6&&mu<R0+4&&Math.abs(mv-2)<9.5;
  if(tOn){if(onRamp)return prWorld(Math.min(mu+8,R0+8),2+(mv-2)*.3);return prWorld(R1-4,2);}
  if(!onRamp)return prWorld(R0-3,2);return prWorld(Math.max(mu-8,R1-8),2+(mv-2)*.3);}
// Gebietsname im größeren Umkreis
{const fa0=farArea;farArea=function(x,z){if(Math.abs(x-PROCK.x)<100&&Math.abs(z-PROCK.z)<100){const[u,v]=prLocal(x,z);if(prFoot(u,v)<1.7||u<-30&&u>-85&&Math.abs(v)<14)return'prock';}return fa0(x,z);};}
