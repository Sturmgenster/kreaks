/* =========================================================
   0.0.129 · Karten für die Wildnis-Dungeons, Mehrspieler-Abgleich
   - Jedes Gewölbe in der Wildnis hat eine eigene Karte (Minikarte und M). Räume decken sich auf, sobald man sie betritt.
     Ausgang, Hebel, Gitter und die große Truhe werden eingezeichnet, wenn man sie gesehen hat.
   - Mehrspieler: Pfeile der Mitspieler fliegen sichtbar mit, Zielen und Blocken sieht man an ihrer Figur,
     Mitspieler erscheinen auf den Karten der Ebenen und Gewölbe, und man sieht im Chat, wer welche Turm-Ebene betritt.
   ========================================================= */
// =========================================================
// Gewölbe-Karte
// =========================================================
function lvMapBuildDG(){const d=DGX.d;if(!d||!d.G)return;const G=d.G,N=G.N,W=d.W,cell=1,gw=W,base=document.createElement('canvas');base.width=base.height=gw;const c=base.getContext('2d');
  c.fillStyle='rgb(22,20,18)';c.fillRect(0,0,gw,gw);const has=(a,b)=>G.edges.has(a<b?a+','+b:b+','+a);
  for(const R of G.rooms){const x0=R.i*DG_C+1,z0=R.j*DG_C+1,boss=R.c===G.boss,st=R.c===G.start;c.fillStyle=boss?'rgb(120,70,62)':st?'rgb(92,116,86)':'rgb(112,104,92)';c.fillRect(x0,z0,DG_C-1,DG_C-1);
    c.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<DG_C-1;k+=2)c.fillRect(x0,z0+k,DG_C-1,1);}
  c.fillStyle='rgb(112,104,92)';for(let i=1;i<N;i++)for(let j=0;j<N;j++){const a=(i-1)*N+j,b=i*N+j;if(has(a,b))c.fillRect(i*DG_C-1,j*DG_C+4,3,4);}
  for(let j=1;j<N;j++)for(let i=0;i<N;i++){const a=i*N+j-1,b=i*N+j;if(has(a,b))c.fillRect(i*DG_C+4,j*DG_C-1,4,3);}
  const vis=document.createElement('canvas');vis.width=vis.height=gw;const vctx=vis.getContext('2d'),key='D'+d.g.id;
  Object.assign(LVM,{on:true,dg:1,gid:d.g.id,lvl:0,key,title:'Gewölbe',cell,gw,ox:d.ox,oz:d.oz,W,base,vis,vctx,seen:lvSeenLoad(key,gw*gw),outdoor:false,revT:0,miniT:0,tot:N*N*(DG_C-1)*(DG_C-1)+40});
  const bc=c.getImageData(0,0,gw,gw);LVM.bdata=bc.data;const vi=vctx.createImageData(gw,gw);for(let i=0;i<gw*gw;i++)if(LVM.seen[i])for(let q=0;q<4;q++)vi.data[i*4+q]=bc.data[i*4+q];vctx.putImageData(vi,0,0);}
function lvRevealDG(){const d=DGX.d;if(!d||!d.G||P.y>DG_Y+40)return;const lx=P.x-LVM.ox,lz=P.z-LVM.oz,i=Math.floor(lx/DG_C),j=Math.floor(lz/DG_C),N=d.G.N;if(i<0||j<0||i>=N||j>=N)return;
  const gw=LVM.gw,x0=Math.max(0,i*DG_C-1),z0=Math.max(0,j*DG_C-1),x1=Math.min(gw-1,(i+1)*DG_C+1),z1=Math.min(gw-1,(j+1)*DG_C+1);let im=null;
  for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const k=z*gw+x;if(LVM.seen[k])continue;LVM.seen[k]=1;if(!im)im=LVM.vctx.getImageData(0,0,gw,gw);for(let q=0;q<4;q++)im.data[k*4+q]=LVM.bdata[k*4+q];}
  if(im){LVM.vctx.putImageData(im,0,0);LVM.dirty=true;}}
function lvPinsDG(pin){const L=DGX.lever;if(L)pin(L.x,L.z,DGX.d.st.lever?'#8a8a8a':'#ffd84a','Hebel');const G=DGX.gate;if(G&&!G.open)pin(G.s.x,G.s.z,'#e04a3a','Gitter');
  for(const c of DGX.chests)if(!c.open)pin(c.x,c.z,c.boss?'#ffb030':'#c8a060',c.boss?'Große Truhe':null);}
{const a=dgEnter;dgEnter=function(g){a(g);try{if(DGX.on&&DGX.d&&!DGX.d.tower)lvMapBuildDG();}catch(e){console.error('Gewölbekarte',e);}};}
// =========================================================
// Mehrspieler
// =========================================================
// Mitspieler-Figuren bekommen Haltungen fürs Zielen und Blocken
mpRemoteSprite=function(R){const F=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,0,'strike'],[0,1,'strike'],[0,0,'brace'],[0,1,'brace'],[0,0,'block'],[0,1,'block']],strip=document.createElement('canvas');strip.width=64*F.length;strip.height=60;const ctx=strip.getContext('2d');ctx.imageSmoothingEnabled=false;let top=60;
  F.forEach(([f,b,pose],i)=>{const hp=pose==='block'?undefined:pose,cv=drawHero(R.look,f,!!b,hp,b?'R':'L'),out=document.createElement('canvas');out.width=64;out.height=60;const x=out.getContext('2d');x.imageSmoothingEnabled=false;const ms=b?'R':'L',os=ms==='L'?'R':'L',ang=pose==='strike'?1.1:pose==='brace'?.8:0;
    const put=(id,side,main)=>{if(id&&SPR[id])drawHeld2(x,id,SPR[id].c,side==='L'?cv.handL:cv.handR,10,side==='L',main?ang:0,main);};if(b){put(R.held,ms,1);put(R.off,os,0);}x.drawImage(cv,10,0);if(!b){put(R.held,ms,1);put(R.off,os,0);}
    if(pose==='block'&&R.off){const ic=(typeof ICV!=='undefined'&&ICV[R.off])||(SPR[R.off]&&SPR[R.off].c);if(ic){const hb=cv.headBox||[0,0,20,30];x.globalAlpha=b?.85:1;x.drawImage(ic,32+(b?-4:-12),(hb[3]||30)+3,22,22);x.globalAlpha=1;}}
    ctx.drawImage(out,i*64,0);if(!pose&&!b&&!f)top=Math.min(top,cv.headBox[2]);SPR['rp_'+R.pid+'_'+i]={u:i/F.length,v:0,du:1/F.length,dv:1,w:64,h:60};});
  const tex=new THREE.CanvasTexture(strip);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  if(R.mesh){scene.remove(R.mesh);R.mesh.geometry.dispose();R.mesh.material.uniforms.map.value.dispose();}
  const m=bbMaterial(tex,0,0);R.h=1.75*(R.size||1)*60/(60-top+1);R.w=R.h*64/60;R.mesh=makeBillboards([{x:R.x||0,y:-999,z:R.z||0,w:R.w,h:R.h,spr:'rp_'+R.pid+'_0',tint:1}],m);R.mesh.frustumCulled=false;scene.add(R.mesh);};
{const a=mpSend;mpSend=function(m,to){if(m&&m.t==='pose'){const w=weaponOf();m.aim=(BOW.on||(w==='xbow'&&rightDown))?1:0;m.bk=BLK.on?1:0;}return a(m,to);};}
{const a=mpPose;mpPose=function(m){a(m);const R=REMOTE.get(m.pid);if(R){R.aim=m.aim;R.bk=m.bk;}};}
{const a=mpFrame;mpFrame=function(dt){a(dt);if(!MP.on)return;for(const R of REMOTE.values()){if(!R.mesh||!(R.aim||R.bk))continue;const g=R.mesh.geometry.attributes;if(g.offset.array[1]<-900)continue;
    const vx=R.x-camera.position.x,vz=R.z-camera.position.z,back=(-Math.sin(R.yaw)*vx-Math.cos(R.yaw)*vz)>0,s=SPR['rp_'+R.pid+'_'+(R.aim?(back?9:8):(back?11:10))];if(!s)continue;
    g.uvr.array[0]=s.u;g.uvr.array[1]=s.v;g.uvr.array[2]=s.du;g.uvr.array[3]=s.dv;g.uvr.needsUpdate=true;}};}
// Pfeile der Mitspieler: fliegen sichtbar mit, verletzen aber auf diesem Gerät niemanden
{const a=rangedShot;rangedShot=function(sp,dmg,am,o){const s=a(sp,dmg,am,o);try{if(MP.on&&MP.ready)mpSend({t:'arw',pid:MP.pid,x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2),vx:+s.vx.toFixed(2),vy:+s.vy.toFixed(2),vz:+s.vz.toFixed(2),g:s.grav,a:am});}catch(e){}return s;};}
{const a=shotHit;shotHit=function(s){if(s&&s.ghost){for(let k=0;k<5;k++)spawnParticle(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,s.col||0xc8b080,.22,.2);return;}return a(s);};}
// Turm-Ebenen: Bescheid geben, wer wohin geht
{const a=twlEnter;twlEnter=function(lvl){a(lvl);try{if(MP.on&&MP.ready&&DGX.on&&DGX.d&&DGX.d.tower)mpSend({t:'twl',pid:MP.pid,lvl,name:P.char&&P.char.name||'Spieler'});}catch(e){}};}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='arw'){try{if(Math.hypot(m.x-P.x,m.z-P.z)<300&&(m.x>60000)===(P.x>60000)){const s={x:m.x,y:m.y,z:m.z,vx:m.vx,vy:m.vy,vz:m.vz,t:0,life:4,dmg:0,fac:'ally',orb:'orb_arrow',size:.32,col:ARW_COL[m.a]||0xc8b080,grav:m.g||7,aoe:0,home:0,src:null,by:'mp',arrow:1,atype:m.a,ghost:1};SHOTS.push(s);}}catch(e){}return;}
  if(m&&m.t==='twl'){try{const L=TOWER_LEVELS[m.lvl-1];if(typeof chatLine==='function')chatLine(`${mpEsc(m.name||'Jemand')} betritt Ebene ${m.lvl}${L?': '+mpEsc(L.n):''}.`,'sys');}catch(e){}return;}return a(m,peer);};}
