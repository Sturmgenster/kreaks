/* =========================================================
   FINALE · Film „Kreak gegen Shikaya", Gefangennahme, Abspann, Käfigwagen
   ========================================================= */
Object.assign(Snd,{
  clash(v=.25){const c=this.ctx;if(!c)return;const t=c.currentTime;[1870,2630,3410,4470,5230].forEach((f,i)=>{try{this.tone(i%2?'square':'triangle',f*(.97+Math.random()*.06),t,.35+i*.08,v*.22/(1+i*.5),null,7000);}catch(e){}});try{this.whoosh(2400,v*.5);}catch(e){}},
  rumble(v=.3){try{this.boom(v);}catch(e){}const c=this.ctx;if(!c)return;const t=c.currentTime;try{const a=this.tone('sawtooth',46,t,1.6,v*.12,null,200);a.o.frequency.linearRampToValueAtTime(30,t+1.6);}catch(e){}},
  summon(v=.2){const c=this.ctx;if(!c)return;const t=c.currentTime;for(let i=0;i<5;i++){try{const a=this.tone('sine',300+i*120,t+i*.08,1.2,v*.1,null,5000);a.o.frequency.exponentialRampToValueAtTime(1200+i*300,t+1.2);}catch(e){}}}});
const camRight=new THREE.Vector3();
function camR(){camRight.setFromMatrixColumn(camera.matrixWorld,0);return camRight;}
function fplace(e,x,z,yo,f){if(!e)return;e.x=x;e.z=z;e.y=fgy(x,z)+(yo||0);if(f!=null)e.frame=f;}
const kk=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
const lrp=(a,b,k)=>a+(b-a)*k;

/* ---------- Nahaufnahmen des Films ---------- */
function cuKreakShout(t0){const o={cx:96,cy:58,s:1.15,anger:.85,wind:.25};return{draw:(lp,t,dt)=>{const lt=t-t0;cuSky(lp,t,{moon:[156,22,12]});o.t=t;o.mouth=lt>.5?Math.min(1,(lt-.5)*5)*(.85+Math.sin(lt*18)*.15):0;o.cy=58+Math.sin(lt*30)*(lt>.5&&lt<1.2?.6:0);
  paintKreak(lp,o);cuEmbers(lp,FILM,dt,3);if(lt>.5)cuSpeed(lp,96,60,.12*(1-Math.min(1,(lt-.5)/2)));}};}
function cuKreakEyes(t0){const o={cx:96,cy:60,s:1.9,anger:1,mouth:0,wind:0};let W=0;return{draw:(lp,t,dt)=>{const lt=t-t0;W=kk(lt,.8,1.5);o.t=t;o.white=W;o.wind=W*.9;o.cy=60-W*1.5;
    cuSky(lp,t,{top:mixc([8,2,6],[30,40,60],W*.6),mid:mixc([70,10,14],[90,110,140],W*.5),bot:mixc([150,40,24],[200,220,240],W*.4)});paintKreak(lp,o);cuEmbers(lp,FILM,dt,2,W>.5?[200,230,255]:null);if(W>.2)cuSpeed(lp,96,58,.18*W,[230,245,255]);},
  glow:(x,map,sc,t)=>kreakEyeGlow(o,W)(x,map,sc,t)};}
function cuShkSmile(t0){const o={cx:96,cy:58,s:1.15,glow:1.1,wind:.5};return{draw:(lp,t,dt)=>{const lt=t-t0;o.t=t;o.mood=lt>1.8?'laugh':'smirk';o.cy=58+(lt>1.8?Math.sin(lt*14)*.6:0);
  cuSky(lp,t,{moon:[34,20,12]});paintShk(lp,o);cuEmbers(lp,FILM,dt,3);},glow:(x,map,sc,t)=>shkEyeGlow(o,o.glow)(x,map,sc,t)};}
function cuShkAngry(t0){const o={cx:96,cy:57,s:1.45,glow:1.6,wind:1,mood:'angry'};return{draw:(lp,t,dt)=>{const lt=t-t0;o.t=t;o.glow=1.4+Math.sin(lt*9)*.3;
  cuSky(lp,t,{top:[20,0,4],mid:[120,10,10],bot:[220,60,20]});paintShk(lp,o);cuSpeed(lp,96,55,.22,[255,80,60]);cuEmbers(lp,FILM,dt,5);},glow:(x,map,sc,t)=>shkEyeGlow(o,o.glow)(x,map,sc,t)};}
function cuKreakBlade(t0){const o={cx:104,cy:58,s:1.6,anger:1,mouth:.15,wind:.7,white:1};return{draw:(lp,t,dt)=>{const lt=t-t0;o.t=t;
  cuSky(lp,t,{top:[6,8,16],mid:[40,50,80],bot:[150,60,40]});paintKreak(lp,o);
  // das Akuma Senso quer durchs Bild
  const ax=8,ay=104,bx=150+lt*4,by=-6,L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,nx=-uy,ny=ux;
  lp.poly([[ax+nx*7,ay+ny*7],[bx+nx*3,by+ny*3],[bx+ux*8,by+uy*8],[bx-nx*3,by-ny*3],[ax-nx*7,ay-ny*7]],(u,v,x,y)=>{const d=(x-ax)*nx+(y-ay)*ny;return d>4.6?[255,70,50]:d>3.4?[180,20,30]:shd(pl3(['#06060a','#101018','#1c1c28','#2c2c3c','#44445a']),.6-d*.08,x,y);});
  const sh=(lt*60)%140;for(let i=0;i<8;i++){const k=(sh+i)/140;if(k>1)continue;lp.add(ax+(bx-ax)*k,ay+(by-ay)*k,[255,255,255],.8);}
  cuEmbers(lp,FILM,dt,3,[200,230,255]);cuSpeed(lp,96,58,.15,[230,245,255]);},glow:(x,map,sc,t)=>kreakEyeGlow(o,1)(x,map,sc,t)};}
function cuSplit(t0,hard){const ok={cx:52,cy:60,s:.92,anger:1,mouth:.35,wind:.6,white:1},os={cx:142,cy:56,s:.92,mood:'angry',glow:1.4,wind:.7};
  const lineX=y=>108-y*.36;
  return{draw:(lp,t,dt)=>{const lt=t-t0;ok.t=os.t=t;const j=hard?Math.sin(lt*40)*1.2:Math.sin(lt*25)*.6;ok.cx=52+j;os.cx=142-j;
    lp.clip=(x,y)=>x<lineX(y);cuSky(lp,t,{top:[4,8,20],mid:[30,50,90],bot:[160,190,230]});paintKreak(lp,ok);
    lp.clip=(x,y)=>x>=lineX(y);cuSky(lp,t,{top:[24,0,4],mid:[120,10,14],bot:[230,70,30]});paintShk(lp,os);lp.clip=null;
    for(let y=0;y<lp.h;y++){const x=lineX(y)+(Math.random()-.5)*2;lp.set(x,y,[255,255,230]);lp.add(x-1,y,[255,200,120],.6);lp.add(x+1,y,[255,200,120],.6);}
    FILM.cuS=FILM.cuS||[];const S=FILM.cuS;for(let i=0;i<(hard?6:3);i++){const y=Math.random()*lp.h;S.push({x:lineX(y),y,vx:(Math.random()-.5)*60,vy:(Math.random()-.5)*60,t:0,l:.3+Math.random()*.3});}
    for(let i=S.length-1;i>=0;i--){const s=S[i];s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.t>s.l){S.splice(i,1);continue;}lp.add(s.x,s.y,[255,230,160],1-s.t/s.l);}},
    glow:(x,map,sc,t)=>{kreakEyeGlow(ok,1)(x,map,sc,t);shkEyeGlow(os,os.glow)(x,map,sc,t);}};}
function cuKreakCalm(t0){const o={cx:96,cy:59,s:1.25,anger:.55,mouth:0,wind:.3,white:1};return{draw:(lp,t,dt)=>{o.t=t;cuSky(lp,t,{moon:[150,24,12]});paintKreak(lp,o);cuEmbers(lp,FILM,dt,2,[220,235,255]);},
  glow:(x,map,sc,t)=>kreakEyeGlow(o,.9)(x,map,sc,t)};}


/* ---------- Kampfplatz freiräumen (nur fürs Bild, solange der Film läuft) ---------- */
function filmClear(x,z,r){const L=[];const hide=d=>{if(!d||d._fh||!(d.w>0))return;L.push([d,d.w,d.h]);d._fh=1;d.w=0;d.h=0;try{syncDeco(d);}catch(e){}};
  for(const d of hvNear(x,z,r)){if(d._gone||!d._hv)continue;if(Math.hypot(d.x-x,d.z-z)>r)continue;const sp=(d._o&&d._o.spr)||d.spr||'';if(d._hv.t==='tree'||/^(tall|reed|fern|bush|grass)/.test(sp))hide(d);}
  for(const[k,d]of TREEDECO){if(Math.hypot(d.x-x,d.z-z)<=r)hide(d);}return L;}
function filmRestore(L){for(const[d,w,h]of L||[]){d.w=w;d.h=h;d._fh=0;try{syncDeco(d);}catch(e){}}}
{const a=updateCoaches;updateCoaches=function(dt){const hide=typeof FIN!=='undefined'&&FIN.on;if(coachMesh)coachMesh.visible=!hide;if(hide)return;return a(dt);};}

/* ---------- Der Film: Kreak gegen Shikaya ---------- */
const DUEL={};
function duelStartPositions(F,L0){const S=F.S,K=F.K;
  // Verbündete sammeln: Ziel ist ein Halbkreis südlich des Kampfplatzes
  const L=L0||DEM.filter(e=>e.fin&&e.fac==='ally'&&!e.dead).concat(mercEnts.filter(e=>e&&(e.finHelp||e.hired)&&!e.dead));F.AL=L;
  L.forEach((e,i)=>{const a=.18*Math.PI+(i/(Math.max(1,L.length-1)))*.64*Math.PI,R=10+((i*7)%5);e._tx=Math.cos(a)*R;e._tz=SHK_W.z+6+Math.sin(a)*R;e._sx=e._tx*1.6+(Math.random()-.5)*6;e._sz=e._tz+30+Math.random()*10;});}
const DUEL_FILM={dur:111,silent:true,
  start(F){if(F.view)return duelViewStart(F);const S=FIN.shk;F.S=S;S.d=DT.shikaya;S.inv=true;S.final=false;S.hidden=false;S.flyOff=0;S.frame=0;S.x=SHK_W.x;S.z=SHK_W.z;S.hurt=0;
    for(const d of DEM.slice())if(d.fin&&d.fac==='demon'&&d!==S)removeEnt(d);METEORS.length=0;SHOTS.length=0;
    F.K=spawnEnt('kreakF',POR.x,POR.z,{always:true,hidden:true});F.PE=spawnEnt('portalFx',POR.x,POR.z,{always:true,hidden:true});F.PE.h=.1;
    if(kreakE){kreakE.hidden=true;kreakE.scene=true;}
    if(!FIN.dofra)duelHelpers();for(const e of[FIN.dofra,FIN.corvin])if(e)e.hidden=true;
    duelStartPositions(F);F.clr=filmClear(0,600,30);F.orbs=[];F.pil=[];F.waves=[];FLAGS.clock=21*60+20;},
  step(F,dt,rdt){const t=F.t,S=F.S,K=F.K,PE=F.PE,E=Math.PI;F.cu=null;
    // ---------------- Schauspieler ----------------
    // Kreak
    K.hidden=t<13.2;let kx=0,kz=610,ky=0,kf='0';
    if(t<13.2){kz=POR.z;}
    else if(t<14.6){const k=kk(t,13.2,14.6);kz=lrp(POR.z,610,k);ky=1.4*(1-k)+4.2*Math.sin(E*k);kf='j';}
    else if(t<15.4)kf='k';else if(t<21)kf='0';else if(t<23)kf='h';else if(t<28)kf='sh';else if(t<39.6)kf='s0';
    else if(t<40.8){kz=lrp(610,601.6,fEase(kk(t,39.6,40.8)));kf='sa';}
    else if(t<45){kz=601.6;kf='sb';}
    else if(t<51){kz=601.8+Math.sin((t-45)*9)*.25;kf=Math.floor((t-45)/.35)%2?'sa':'sb';}
    else if(t<51.6){kz=601.8;kf='s0';}
    else if(t<52.4){const k=kk(t,51.6,52.4);kz=lrp(601.8,606,k);ky=2.4*Math.sin(E*k);kf='sj';}
    else if(t<53.2){kz=606;kf='sk';}else if(t<55){kz=606;kf='s0';}
    else if(t<59){kx=2.2*Math.sin((t-55)*3.4);kz=606-(t-55)*.5;kf=t>58.6?'sb':Math.floor(t*6)%2?'s1':'s2';}
    else if(t<60.6){kx=2.2*Math.sin(4*3.4);kz=604;kf='s0';}
    else if(t<61.8){const k=kk(t,60.6,61.8);kx=lrp(2.2*Math.sin(13.6),0,k);kz=lrp(604,597,k);ky=9*Math.sin(k*E/2);kf='sa';}
    else if(t<62.3){const k=kk(t,61.8,62.3);kz=lrp(597,593.8,k);ky=lrp(9,.6,k*k);kf='sb';}
    else if(t<63){const k=kk(t,62.3,63);kz=lrp(593.8,597,k);ky=.6*(1-k)+2*Math.sin(E*k);kf='sj';}
    else if(t<69.5){kz=597.5;kf='s0';}
    else if(t<70.3){const k=kk(t,69.5,70.3);kx=lrp(0,4,k);kz=597.5;ky=2.6*Math.sin(E*k);kf='sj';}
    else if(t<72.5){kx=4;kz=597.5;kf=t<70.7?'sk':'s0';}
    else if(t<74){const k=kk(t,72.5,74);kx=lrp(4,-1.2,k);kz=lrp(597.5,596.6,k);kf=Math.floor(t*7)%2?'s1':'s2';}
    else if(t<74.4){kx=-1.2;kz=596.6;kf='sb';}
    else if(t<80){kx=-1.2;kz=596.6;kf='s0';}
    else if(t<87){const j=Math.floor(t-80),a=j*1.9+.4,lt=t-80-j;kx=Math.sin(a)*1.5;kz=595+Math.cos(a)*1.5;kf=(j%2===0)?(lt<.45?'sa':'sb'):'s0';}
    else if(t<91){const th=(t-87)/4*E*.6+.3;kx=Math.sin(th)*1.7;kz=595+Math.cos(th)*1.7;kf='sb';}
    else if(t<94){kx=0;kz=606;kf='s0';}
    else if(t<99){const k=kk(t,94,99);kz=lrp(606,601,k);kx=Math.sin(k*9)*1.2;kf=Math.floor(t*7)%2?'s1':'s2';}
    else if(t<99.8){kz=lrp(601,604,kk(t,99,99.8));kf='s0';}
    else if(t<100.6){kz=lrp(604,597.6,fEase(kk(t,99.8,100.6)));kf='sa';}
    else if(t<101.6){const k=kk(t,100.6,101.6);kz=lrp(597.6,607,1-(1-k)*(1-k));ky=1.6*Math.sin(E*k);kf='sj';}
    else{kz=607;kf=t<102.2?'sk':'s0';}
    fplace(K,kx,kz,ky,kf);if(t>=28&&K.d!==DT.kreakFW)K.d=DT.kreakFW;
    // Shikaya
    let sx=0,sz=SHK_W.z,sy=0,sf=0;
    if(t<31){sf=(t>7.5&&t<8.3)?'f':0;}
    else if(t<33.2)sf='c';
    else if(t<39.6)sf=0;
    else if(t<40.8){sz=lrp(SHK_W.z,598.2,fEase(kk(t,39.6,40.8)));sf='a';}
    else if(t<45){sz=598.2;sf='b';}
    else if(t<51){sz=598+Math.sin((t-45)*9+1)*.25;sf=Math.floor((t-45)/.35)%2?'b':'a';}
    else if(t<51.9){sz=598.4;sf='a';}
    else if(t<53){sz=598.6;sf='b';}
    else if(t<55){sz=lrp(598.6,592.5,kk(t,53,55));sf=Math.floor(t*4)%2?1:2;}
    else if(t<58.8){sz=592.5;sf='c';}
    else if(t<61.9){sz=592.5;sf=0;}
    else if(t<62.3){sz=592.5;sf='a';}
    else if(t<63.2){sz=592.5;sf='b';}
    else if(t<67){sz=592.5;sf=0;}
    else if(t<68.5){const k=kk(t,67,68.5);sx=lrp(0,-4,k);sz=592.5;sy=6*fEase(k);sf='f';}
    else if(t<69.5){const k=kk(t,68.5,69.5);sx=lrp(-4,3,k);sz=592.5;sy=lrp(6,3,k);sf=k<.8?'a':'b';}
    else if(t<72.5){const k=kk(t,69.5,72.5);sx=lrp(3,-3,k);sz=lrp(592.5,594.5,k);sy=lrp(3,0,fEase(k));sf=k<.85?'f':0;}
    else if(t<74.4){sx=-3;sz=594.5;sf=0;}
    else if(t<75){const k=kk(t,74.4,75);sx=-3;sz=lrp(594.5,588.5,1-(1-k)*(1-k));sf='b';}
    else if(t<80){sx=-3;sz=588.5;sf=0;}
    else if(t<87){const j=Math.floor(t-80),a=j*1.9+.4,lt=t-80-j;sx=-Math.sin(a)*1.8;sz=595-Math.cos(a)*1.8;sf=(j%2===1)?(lt<.45?'a':'b'):0;}
    else if(t<91){const th=(t-87)/4*E*.6+.3;sx=-Math.sin(th)*1.9;sz=595-Math.cos(th)*1.9;sf='b';}
    else if(t<94){sx=0;sz=592;sf=0;}
    else if(t<99.8){sz=592;sf='c';}
    else if(t<100.6){sz=lrp(592,595.4,fEase(kk(t,99.8,100.6)));sf='a';}
    else if(t<101.6){const k=kk(t,100.6,101.6);sz=lrp(595.4,588,1-(1-k)*(1-k));sf='b';}
    else{sz=588;sf=(t>103.4&&t<105)?'a':0;}
    fplace(S,sx,sz,sy,sf);S.hidden=false;
    if(F.at(33.2)){S.d=DT.shkDuel;}
    // Portal
    if(t>=9&&t<17.5){PE.hidden=false;const h=t<12.6?3.6*fEase(kk(t,9,12.6)):t<15.5?3.6+Math.sin(t*8)*.08:3.6*(1-kk(t,15.5,17.2));PE.h=Math.max(.05,h);fplace(PE,POR.x,POR.z,.35);
      if(PE.h>.3){for(let i=0;i<7;i++){const a=Math.random()*6.283,rx=PE.h*.36,ry=PE.h*.48;fxP(POR.x+Math.cos(a)*rx,PE.y+PE.h*.5+Math.sin(a)*ry,POR.z,-Math.sin(a)*2.5,Math.cos(a)*2.5,0,[0xff3a2a,0xffb090,0xa0101e,0xffffff],.5,.32,{s1:.05});}}}
    else PE.hidden=true;
    // Verbündete laufen am Ende herbei
    if(F.at(102.9)){for(const e of F.AL){e.x=e._sx;e.z=e._sz;e.hidden=false;}for(const e of[FIN.dofra,FIN.corvin])if(e)e.hidden=false;}
    if(t>=102.9){const k=fEase(kk(t,103,108.2));for(const e of F.AL.concat([FIN.dofra,FIN.corvin].filter(Boolean))){if(e._tx==null){e._tx=(Math.random()-.5)*16;e._tz=SHK_W.z+16;e._sx=e._tx;e._sz=e._tz+34;}
      const x=lrp(e._sx,e._tx,k),z=lrp(e._sz,e._tz,k);fplace(e,x,z,e.type==='dragonA'?2.5*(1-k)+.2:0,k<1?(Math.floor(t*6+(e.x|0))%2?1:2):0);}}
    // ---------------- Kamera und Effekte ----------------
    const KH=K.y+1.3,SH=S.y+2.4;if(t>38.2&&t<103)F.hp(null);
    if(t<5){const k=fEase(t/5);F.cam(0,lrp(32,13,k),lrp(706,662,k),0,lrp(4,5,k),lrp(592,595,k),55);if(Math.random()<.5)fxP(rnd(-20,20),rnd(4,20),rnd(640,690),0,rnd(.5,1.5),0,[0xff8a30,0xffc060],2,.25);}
    else if(t<9){const k=kk(t,5,9);F.cam(lrp(8,6,k),lrp(2.4,2.7,k),lrp(602,598.5,k),0,3.7,SHK_W.z,44);if(Math.random()<.4)fxDust(rnd(-4,4),SHK_W.z+rnd(-2,4),1,1,{spd:3,up:.3,size:.35,life:2});}
    else if(t<13.2){F.cam(13,2.6,632,0,3,618,50);
      if(F.at(9.05)){Snd.rumble(.3);F.shake=.3;}if(F.at(10.6)||F.at(11.9)){F.flash(.45,'#ff4a3a');Snd.boom(.25);F.shake=.5;}}
    else if(t<16.5){const k=kk(t,13.2,16.5);F.cam(lrp(9,7,k),lrp(2.7,2.4,k),lrp(615,611.5,k),K.x,KH,K.z,lrp(50,44,k));
      if(F.at(13.25)){fxBurst(POR.x,PE.y+1.8,POR.z,90,[0xff3a2a,0xffd0a0,0xffffff],8,.7,.4,{});Snd.whoosh(600,.3);F.flash(.3,'#ffffff');}
      if(F.at(14.6)){fxDust(K.x,K.z,50,1.5,{spd:6,size:.6});fxRing(K.x,K.y+.2,K.z,40,[0xd0c0a0,0xffffff],9,.5,.35,{add:true});F.shake=.8;Snd.thud();Snd.boom(.25);}}
    else if(t<20.5){if(!F._cu1)F._cu1=cuKreakShout(16.5);F.cu=F._cu1;
      if(F.at(17.0)){F.cap('„Zu mir, Akuma Senso!"',3.2);F.shake=.35;Snd.whoosh(300,.25);Snd.rumble(.2);}}
    else if(t<24.5){const k=kk(t,20.5,24.5);F.cam(lrp(1.6,1.0,k),lrp(2.0,2.2,k),lrp(614.8,613.6,k),K.x+.2,K.y+1.75,K.z,lrp(46,40,k));
      const hx=K.x+camR().x*.32,hz=K.z+camR().z*.32,hy=K.y+2.05;
      if(t>=21&&t<23){const r=lrp(6,.4,kk(t,21,23));for(let i=0;i<10;i++){const a=Math.random()*6.283,b=(Math.random()-.5)*2;const px=hx+Math.cos(a)*r,py=hy+b*r*.6,pz=hz+Math.sin(a)*r;
        fxP(px,py,pz,(hx-px)*2.2-Math.sin(a)*3,(hy-py)*2.2,(hz-pz)*2.2+Math.cos(a)*3,[0xff2a2a,0x200008,0xff7a5a,0x6a0a14],.4,.22,{s1:.05});}if(F.at(21.05))Snd.summon(.25);}
      if(F.at(23)){F.flash(.95,'#ffffff');F.shake=.7;fxBurst(hx,hy,hz,120,[0xffffff,0xff3a3a,0xffd0d0],8,.8,.35,{});Snd.clash(.35);Snd.boom(.3);}
      if(t>23&&Math.random()<.6)fxP(hx+rnd(-.2,.2),hy+rnd(0,1.6),hz+rnd(-.2,.2),0,rnd(.2,1),0,[0xff3a3a,0xffffff],.6,.12);}
    else if(t<28){if(!F._cu2)F._cu2=cuKreakEyes(24.5);F.cu=F._cu2;if(F.at(25.35)){F.flash(.5,'#e8f4ff');Snd.shimmer&&Snd.shimmer();F.shake=.3;}}
    else if(t<31){if(!F._cu3)F._cu3=cuShkSmile(28);F.cu=F._cu3;if(F.at(29.8))Snd.demonRoar(.8,.35);}
    else if(t<36){const k=kk(t,31,36);F.cam(lrp(-7.5,-6.4,k),lrp(3.4,3.8,k),lrp(598,596,k),.8,3.4,SHK_W.z,56);
      const r=camR(),hx=S.x+r.x*1.0,hz=S.z+r.z*1.0,hy=S.y+2.0;
      if(t<33.2){for(let i=0;i<8;i++){const a=Math.random()*6.283,d=rnd(.3,2.2);fxP(hx+Math.cos(a)*d,hy+rnd(-1,1),hz+Math.sin(a)*d,-Math.cos(a)*2,rnd(-.5,.5),-Math.sin(a)*2,[0x5a0610,0xa01020,0x140004],.5,.28,{add:Math.random()<.5});}}
      if(F.at(33.2)){F.flash(.7,'#ff3020');F.shake=1;Snd.demonRoar(1.1,1.1);Snd.rumble(.35);for(let i=0;i<70;i++){const k2=Math.random();fxP(hx+r.x*k2*2.6,hy-k2*1.9,hz+r.z*k2*2.6,rnd(-1,1),rnd(0,2),rnd(-1,1),[0xff3a2a,0xff9a6a,0x200008],.8,.3);}
        Mus.cine='bosskampf/kein_erbarmen';F.silent=false;}
      if(t>33.6)F.hp('Shikaya, die Dämonenkönigin',lrp(.25,1,kk(t,33.6,35.8)));if(F.at(35))Snd.demonRoar(1.4,.9);}
    else if(t<39.6){const k=kk(t,36,39.6);F.cam(lrp(24,21,k),lrp(3.2,3.8,k),lrp(600,601.5,k),0,2.4,600,44);if(t>38)F.hp(null);
      if(Math.random()<.5)fxDust(rnd(-12,12),rnd(592,610),1,1,{spd:4,up:.2,size:.4,life:2.4});}
    else if(t<42){const k=kk(t,39.6,42);F.cam(lrp(15,11,k),lrp(3,3.2,k),lrp(601,600.3,k),0,2.7,600,t<40.8?46:lrp(38,44,kk(t,40.8,42)));
      if(t<40.8&&Math.random()<.9){fxDust(K.x,K.z,1,.3,{spd:1,size:.35});fxDust(S.x,S.z,1,.5,{spd:1,size:.5});}
      if(F.at(40.8)){F.flash(1,'#ffffff');F.shake=1.2;fxRing(0,fgy(0,600)+.5,600,90,[0xffffff,0xffd0a0,0xff6a4a],18,.6,.5,{});fxSparks(0,2.3,600,90,{spd:12});fxDust(0,600,60,2,{spd:9,size:.7});Snd.clash(.5);Snd.boom(.4);F.ts=.22;}
      if(F.at(41.0))F.ts=1;}
    else if(t<45){if(!F._cu4)F._cu4=cuSplit(42,false);F.cu=F._cu4;if(F.at(42.1))F.shake=.25;if(Math.random()<rdt*4)Snd.clash(.12);}
    else if(t<51){const th=(t-45)*.75+.3;F.cam(Math.sin(th)*10,2.8+Math.sin(t)*.4,600+Math.cos(th)*10,0,2.7,600,50);
      for(let i=0;i<17;i++)if(F.at(45.2+i*.35)){fxSparks(rnd(-.3,.3),2.1+rnd(0,.7),600+rnd(-.3,.3),i%4===3?50:22,{spd:i%4===3?11:7});Snd.clash(i%4===3?.35:.18);F.shake=i%4===3?.45:.18;if(i%4===3)F.flash(.25);}}
    else if(t<55){const k=kk(t,51,55);F.cam(lrp(-5,-3,k),lrp(12,14,k),lrp(611,607,k),0,.5,600.5,55);
      if(F.at(51.9)){const g=fgy(0,601.2);F.flash(.55,'#ff4020');F.shake=1.4;Snd.rumble(.5);fxBurst(0,g+.4,601.2,140,[0xff3a1a,0xffa040,0xffe080],11,.9,.55,{up:5,g:6});
        for(let i=0;i<60;i++){const a=Math.random()*6.283,v=rnd(3,9);fxP(Math.cos(a)*.6,g+.3,601.2+Math.sin(a)*.6,Math.cos(a)*v,rnd(4,10),Math.sin(a)*v,[0x2a1a10,0x4a3220,0x6a4a30],1.4,.3,{add:false,g:18,s1:.3});}fxDust(0,601.2,80,2.5,{spd:8,size:.9,life:2.4});}}
    else if(t<60){F.cam(K.x+1.4,K.y+2.3,K.z+3.8,S.x,3.2,S.z,52);
      for(let i=0;i<11;i++)if(F.at(55.4+i*.3)){const last=i===10;F.orbs.push({t:0,T:.6,x0:S.x+.9,y0:S.y+3.4,z0:S.z+1,x1:last?K.x+.3:K.x+rnd(-2.5,2.5),y1:last?K.y+1.4:fgy(K.x,K.z-.5)+.2,z1:last?K.z-.6:K.z+rnd(-2,1.5),last});Snd.whoosh(900,.1);}
      for(let i=F.orbs.length-1;i>=0;i--){const o=F.orbs[i];o.t+=dt;const k=Math.min(1,o.t/o.T);const x=lrp(o.x0,o.x1,k),y=lrp(o.y0,o.y1,k)+Math.sin(k*E)*.8,z=lrp(o.z0,o.z1,k);
        fxP(x,y,z,0,0,0,[0xff2a2a,0xff7a5a],.18,.55,{s1:.2});fxP(x,y,z,rnd(-.5,.5),rnd(-.5,.5),rnd(-.5,.5),[0xa01020,0xff3a3a],.35,.22);
        if(k>=1){F.orbs.splice(i,1);if(o.last){fxArc(K.x,K.y+1.4,K.z-.4,Math.PI/2,1.4,-1.3,1.3,40,[0xffffff,0xd8ecff],.35,.35,{sp:3});Snd.clash(.3);
            F.orbs.push({t:0,T:.4,x0:x,y0:y,z0:z,x1:S.x,y1:S.y+2.6,z1:S.z,back:1});}
          else if(o.back){fxBurst(x,y,z,60,[0xff3a2a,0xffd0a0,0xffffff],7,.6,.45,{});S.hurt=.3;Snd.boom(.25);F.shake=.4;}
          else{fxBurst(x,y,z,40,[0xff3a1a,0xffa040],5,.5,.4,{up:2});fxDust(x,z,14,1,{spd:4});Snd.boom(.12);F.shake=.25;}}}}
    else if(t<64){if(t<61.8){F.cam(3.2,1.3,607.5,K.x,K.y+1.2,K.z,52);if(F.at(60.6)){F.ts=.35;Snd.whoosh(500,.3);}}
      else{F.cam(7,2.4,595,0,2,594,48);if(F.at(61.8))F.ts=1;}
      if(F.at(62.3)){F.flash(.85);F.shake=1.2;fxRing(0,fgy(0,593.5)+.4,593.5,80,[0xffffff,0xbfe0ff,0xff6a4a],16,.55,.5,{});fxSparks(0,2.6,593.5,70,{spd:11});fxDust(0,593.5,60,2,{spd:8,size:.8});Snd.clash(.45);Snd.boom(.4);}
      if(t<62.3&&t>60.6)fxP(K.x+rnd(-.2,.2),K.y+rnd(.4,1.8),K.z,0,0,0,[0xd8ecff,0xffffff],.25,.15);}
    else if(t<67){if(!F._cu5)F._cu5=cuKreakBlade(64);F.cu=F._cu5;}
    else if(t<73){const k=kk(t,67,73);F.cam(lrp(-17,-15,k),lrp(4,5,k),lrp(604,600,k),(K.x+S.x)/2,3,(K.z+S.z)/2,52);
      if(t>67&&t<72.5&&Math.random()<.7)fxP(S.x+rnd(-1.5,1.5),S.y+rnd(1,3),S.z,0,-1,0,[0x6a0a14,0xff3a2a],.6,.25);
      if(F.at(69.3)){F.waves.push({t:0,T:.9,x0:S.x,z0:S.z,x1:-1.5,z1:613});Snd.whoosh(250,.35);}
      for(let i=F.waves.length-1;i>=0;i--){const w=F.waves[i];w.t+=dt;const k2=Math.min(1,w.t/w.T),x=lrp(w.x0,w.x1,k2),z=lrp(w.z0,w.z1,k2),yaw=Math.atan2(w.z1-w.z0,w.x1-w.x0)+Math.PI/2;
        fxArc(x,fgy(x,z)+1.6,z,yaw,2.2,-1.4,1.4,30,[0xff2a2a,0xff7a4a,0x5a0610],.3,.5,{sp:1});fxDust(x,z,3,1,{spd:3});
        if(k2>=1){F.waves.splice(i,1);const g=fgy(x,z);fxBurst(x,g+.6,z,150,[0xff3a1a,0xffa040,0xffe080],12,1,.6,{up:5,g:5});fxDust(x,z,70,3,{spd:9,size:1,life:2.6});F.shake=1;F.flash(.4,'#ff6020');Snd.rumble(.5);}}
      if(F.at(70.3))fxDust(4,597.5,30,1,{spd:5});}
    else if(t<77){F.cam(K.x+2.4,2.2,K.z+5,S.x,2.5,S.z,46);
      if(t>72.5&&t<74)fxDust(K.x,K.z,1,.3,{spd:1,size:.3});
      if(F.at(74)){F.waves.push({t:0,T:.3,x0:K.x,z0:K.z,x1:S.x,z1:S.z,white:1});Snd.whoosh(1600,.3);}
      for(let i=F.waves.length-1;i>=0;i--){const w=F.waves[i];w.t+=dt;const k2=Math.min(1,w.t/w.T),x=lrp(w.x0,w.x1,k2),z=lrp(w.z0,w.z1,k2),yaw=Math.atan2(w.z1-w.z0,w.x1-w.x0)+Math.PI/2;
        fxArc(x,fgy(x,z)+1.5,z,yaw,1.7,-1.3,1.3,30,[0xffffff,0xd8ecff,0x9ad0ff],.3,.45,{sp:1});if(k2>=1){F.waves.splice(i,1);F.flash(.6);F.shake=.9;fxSparks(S.x,S.y+2.4,S.z,70,{cols:[0xffffff,0xbfe0ff,0xff5a4a],spd:11});Snd.clash(.4);Snd.boom(.35);S.hurt=.35;}}
      if(t>74.4&&t<75){fxSparks(S.x,S.y+.3,S.z,3,{spd:4});fxDust(S.x,S.z,2,.6,{spd:3});}}
    else if(t<80){if(!F._cu6)F._cu6=cuShkAngry(77);F.cu=F._cu6;if(F.at(77.6)){Snd.demonRoar(1.3,1);F.shake=.4;}}
    else if(t<87){const j=Math.floor(t-80),M=[0,2.5,595],R=[[8,2,595,0,0,48],[0,7,603,0,0,52],[2,1.3,598.5,0,1,40],[-6,2.5,599,.35,0,48],[.5,13,595.5,0,-2,55],[3.2,2.2,595,0,0,36],[0,3.5,587,0,-.4,50]][j]||[8,2,595,0,0,48];
      F.cam(R[0],R[1],R[2],M[0],M[1]+R[4],M[2],R[5],R[3]);
      if(F.at(80+j+.45)){const mx=(K.x+S.x)/2,mz=(K.z+S.z)/2;fxSparks(mx,2.2+rnd(0,.6),mz,40,{spd:10});Snd.clash(.3);F.shake=.35;if(j%2)F.flash(.2,'#ff6040');}}
    else if(t<91){const dx=S.x-K.x,dz=S.z-K.z,d=Math.hypot(dx,dz)||1;
      if(t<89)F.cam(K.x-dx/d*2.4-dz/d*.9,KH+1,K.z-dz/d*2.4+dx/d*.9,S.x,SH+.4,S.z,46);else F.cam(S.x+dx/d*3.2+dz/d*1,SH+1.2,S.z+dz/d*3.2-dx/d*1,K.x,KH+.2,K.z,46);
      if(Math.random()<.8)fxSparks((K.x+S.x)/2,2.3+rnd(0,.5),(K.z+S.z)/2,3,{spd:5});if(Math.random()<rdt*3)Snd.clash(.12);}
    else if(t<94){if(!F._cu7)F._cu7=cuSplit(91,true);F.cu=F._cu7;if(F.at(91.1))F.shake=.4;if(Math.random()<rdt*6)Snd.clash(.12);}
    else if(t<99){F.cam(K.x+1.6,2.4,K.z-5.2,K.x,1.4,K.z,48);
      for(let i=0;i<8;i++)if(F.at(94.4+i*.22)){const a=Math.PI*.15+i/7*Math.PI*.7;F.pil.push({x:Math.cos(a)*7.5*(i%2?1:-1)*.9,z:600+Math.sin(a)*3+rnd(-2,4),t:0});Snd.boom(.18);}
      for(const p of F.pil){p.t+=dt;if(p.t<4){const g=fgy(p.x,p.z);for(let i=0;i<5;i++)fxP(p.x+rnd(-.5,.5),g+rnd(0,.5),p.z+rnd(-.5,.5),rnd(-.3,.3),rnd(5,9),rnd(-.3,.3),[0xff3a1a,0xff8a30,0xffd060,0x6a0a0a],.7,.5,{s1:.8});}}}
    else if(t<103){const k=kk(t,99,103);F.cam(0,lrp(9,10,k),lrp(620,622,k),0,1.5,597,52);
      for(const p of F.pil){p.t+=dt;if(p.t<4){const g=fgy(p.x,p.z);for(let i=0;i<3;i++)fxP(p.x+rnd(-.5,.5),g+rnd(0,.5),p.z+rnd(-.5,.5),0,rnd(5,9),0,[0xff3a1a,0xff8a30,0xffd060],.7,.5,{s1:.8});}}
      if(t>99.8&&t<100.6){fxP(K.x,K.y+1.2,K.z,0,0,0,[0xffffff,0xd8ecff],.3,.6);fxP(S.x,S.y+2.2,S.z,0,0,0,[0xff3a2a,0xff7a5a],.3,.9);}
      if(F.at(100.6)){F.flash(1);F.shake=1.6;fxRing(0,fgy(0,596.5)+.5,596.5,140,[0xffffff,0xffd0a0,0xff6a4a],26,.8,.7,{});fxRing(0,fgy(0,596.5)+1.5,596.5,90,[0xbfe0ff,0xffffff],20,.7,.5,{});fxSparks(0,2.2,596.5,120,{spd:14});
        fxDust(0,596.5,120,4,{spd:12,size:1,life:2.8});Snd.clash(.6);Snd.rumble(.6);F.ts=.2;}
      if(F.at(100.8))F.ts=1;}
    else if(t<108){const k=fEase(kk(t,103,108));F.cam(lrp(14,12,k),lrp(3.2,5,k),lrp(612,617,k),0,2,598,50);
      if(F.at(103.6)){Snd.demonRoar(1.3,1.2);F.shake=.5;}if(t>104)F.hp('Shikaya, die Dämonenkönigin',1);if(F.at(104.5)){Snd.fanfare&&Snd.fanfare();}}
    else{if(!F._cu8)F._cu8=cuKreakCalm(108);F.cu=F._cu8;F.hp(null);if(F.at(110.2)){$('film').classList.remove('on');}}
  },
  end(F,skip){if(F.view)return duelViewEnd(F);const S=F.S,K=F.K;filmRestore(F.clr);F.clr=null;FIN.kreakPos=[0,607];FIN.allyPlaced=true;
    for(const e of F.AL.concat([FIN.dofra,FIN.corvin].filter(Boolean))){if(e._tx!=null){e.x=e._tx;e.z=e._tz;e.y=fgy(e.x,e.z);}e.hidden=false;e.frame=0;}
    if(K)removeEnt(K);if(F.PE)removeEnt(F.PE);S.x=0;S.z=588;S.hidden=false;
    P.x=5;P.z=612;P.y=fgy(P.x,P.z)+.2;P.vx=P.vy=P.vz=0;P.yaw=.25;P.pitch=.08;
    duelSetup(false);S.x=0;S.z=588;toast('Alle zusammen: Besiegt Shikaya!');
    try{say(kreakE,'Jetzt! Alle zusammen!',3);}catch(e){}
    setTimeout(()=>FIN.dofra&&say(FIN.dofra,'Für Coda! Dofra ist noch nicht zu alt für eine Prügelei!',3.5),1500);
    setTimeout(()=>FIN.corvin&&say(FIN.corvin,'Möge das Licht uns beistehen!',3),3200);}};
function startDuelFilm(){if(FILM.on||FIN.duel)return;playFilm(DUEL_FILM);}

/* ---------- Gefangennahme ---------- */
function captureScene(){const S=FIN.shk,k=kreakE;S.final=true;S.inv=true;S.frame='k';S.wind=0;S.cast=0;S.slam=null;S.sweep=0;dmBossHide&&dmBossHide();
  for(const d of DEM)if(d.fac==='demon'&&d!==S&&!d.dead){d.sink=true;d.sinkT=0;d.inv=true;}METEORS.length=0;SHOTS.length=0;
  if(k){k.scene=true;k.hidden=false;k.sceneFrame=0;k.x=S.x+1.4;k.z=S.z+2.2;}
  let cap=DEM.find(d=>d.name==='Hauptmann'&&!d.dead);if(!cap){cap=spawnEnt('guardA',S.x-3,S.z+4,{gi:0,always:true,fin:1,name:'Hauptmann'});}
  const G=DEM.filter(d=>d.type==='guardA'&&!d.dead).slice(0,6);G.forEach((g,i)=>{const a=i/6*6.283;g.x=S.x+Math.cos(a)*3.2;g.z=S.z+Math.sin(a)*3.2;g.y=fgy(g.x,g.z);g.capt=true;g.frame=0;});
  cap.x=S.x-2.4;cap.z=S.z+3;cap.y=fgy(cap.x,cap.z);
  cineMus('ereignisse/abschied');
  playCine([{t:'(Shikaya sinkt auf die Knie. Das riesige Schwert an ihrem Arm zerfällt zu schwarzer Asche. Um Coda herum zerfallen die letzten Dämonen.)',fn:()=>{S.frame='k';Snd.demonRoar(1.8,.6);fxBurst(S.x,S.y+2,S.z,120,[0x200008,0x5a0610,0xff3a2a],5,1.4,.5,{up:2});}},
    {who:'Shikaya',t:'(keuchend) Na los. Worauf wartest du, kleiner Bruder? Tu es. So wie damals.'},
    {who:'Kreak',t:'(Er senkt das Akuma Senso. Das weiße Leuchten in seinen Augen wird schwächer.) Nein. Ich habe dich einmal in die Tiefe gestoßen. Diesen Fehler mache ich kein zweites Mal.'},
    {who:'Hauptmann',t:'Im Namen von Sturmburg: Ihr seid gefangen, Dämonenkönigin. Wachen! Die Runenketten!'},
    {t:'(Die Wachen legen ihr schwere Ketten aus Runeneisen an. Wo das Eisen ihre Haut berührt, verlischt das Rot in ihren Augen ein Stück.)',fn:()=>{for(let i=0;i<4;i++)setTimeout(()=>{Snd.clank&&Snd.clank(.5);fxSparks(S.x+rnd(-1,1),S.y+rnd(.6,1.8),S.z,14,{cols:[0x9ad0ff,0xffffff]});},i*350);}},
    {who:'Shikaya',t:'Ketten. Wie in den Geschichten, die du mir als Kind erzählt hast. Du warst schon immer ein Träumer, Nerra.'},
    {who:'Kreak',t:'Vielleicht. Aber in Sturmburg gibt es Gelehrte und Priester. Leute, die alte Flüche brechen können. Ich hole dich zurück. Die echte Shikaya.'},
    {who:'Shikaya',t:'(Sie lacht leise. Dann schweigt sie und schaut zum Himmel.)'},
    {t:'(Der Blutmond verblasst. Über Coda geht die Sonne auf.)',fn:()=>{FLAGS.moonForce=null;FLAGS.clock=5*60+50;Snd.chime();FLAGS.kreakGlow=0;if(k){k.d=DT.kreak;}}}],
  ()=>{gainXP(3000);setTimeout(epilogue,1200);});}
function epilogue(){cineMus('ereignisse/abschied');if(kreakE){kreakE.sceneFrame=0;}
  playCine([{t:'(Die Sonne steht über Coda. Zum ersten Mal seit Tagen ist der Himmel klar. Die Wachen führen Shikaya in Ketten zu einem Käfigwagen.)'},
    {who:'Hauptmann',t:'Wir bringen sie nach Sturmburg, in den tiefsten Kerker unter der Burg. Sturmburg wird noch in hundert Jahren von dieser Nacht singen.'},
    {who:'Drakon',t:'Die Drachenmenschen vergessen das nicht. Ruft, wenn ihr uns braucht. Wir hören euch.'},
    {who:'Dofra',t:'Und ich habe drei Dämonen mit dem Schmiedehammer erwischt! Drei! Erzählt das ruhig weiter.'},
    {who:'Kreak',t:'Sie lebt. Und solange sie lebt, gibt es Hoffnung. Das ist mehr, als ich je zu träumen gewagt habe.'},
    {who:'Kreak',t:'(Er reicht dir das Akuma Senso.) Behalte es. Du hast es dir verdient. Ich bringe sie selbst nach Sturmburg. Ich gehe vorneweg, wie früher, als wir Kinder waren. Wenn du mich suchst: Ich warte in Sturmburg vor dem Tor.',
      fn:()=>{if(countItem('akuma')<1&&addItem('akuma',1)===0)selectAkuma();}}],
  ()=>{if(kreakE){kreakE.scene=false;kreakE.mode='follow';kreakE.d=DT.kreak;}FLAGS.kreakGlow=0;FLAGS.finDuel=0;FLAGS.finShkHp=0;FLAGS.akumaPlayer=1;
    const S=FIN.shk;if(S){S.hidden=true;S.dead=true;S.alive=false;S.deadT=99;}if(dmBoss===S)dmBossHide();
    for(const d of DEM)if(d.capt)d.capt=false;
    FIN.on=false;FIN.duel=false;FIN.done=true;FIN.leaveT=0;mqSet(15);addLetter(5);FLAGS.cartPending=1;showCredits();});}
// Der Brief am Ende passt jetzt zur Gefangenschaft
{const L=LETTERS[5]||LETTERS.find(l=>l.t==='Ein letzter Brief');if(L){L.t='Ein Brief aus Sturmburg';L.src='Gebracht von einem Boten der Burgwache';
  L.text='Nerra,\n\nsie geben mir Papier und eine Kerze. Der Kerker ist kalt, aber ruhig. Zum ersten Mal seit hundert Jahren höre ich meine eigenen Gedanken.\n\nIch weiß nicht, ob die Priester finden, was sie suchen. Ich weiß nicht einmal, ob ich will, dass sie es finden.\n\nAber ich habe von der Suppe geträumt. Sie war angebrannt.\n\nKomm mich besuchen. Und bring nicht wieder dieses Schwert mit.\n\n– S.';}}
document.getElementById('crClose').addEventListener('click',()=>{if(FLAGS.cartPending){FLAGS.cartPending=0;setTimeout(startCartFilm,700);}});

/* ---------- Nach dem Abspann: der Käfigwagen zieht nach Sturmburg ---------- */
const CART={on:false,list:[],s:0,R:null,L:null,cum:null};
function cartRoute(){if(CART.R)return;const R=coachRoute('sturm');let i0=0;for(let i=0;i<R.length;i++)if(R[i][1]<=628){i0=i;break;}CART.R=R.slice(i0);const c=[0];for(let i=1;i<CART.R.length;i++)c.push(c[i-1]+Math.hypot(CART.R[i][0]-CART.R[i-1][0],CART.R[i][1]-CART.R[i-1][1]));CART.cum=c;}
function cartAt(s){const R=CART.R,c=CART.cum;s=Math.max(0,Math.min(c[c.length-1],s));let i=0;while(i<c.length-2&&c[i+1]<s)i++;const k=(s-c[i])/((c[i+1]-c[i])||1);const a=R[i],b=R[i+1]||a;
  const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;return[a[0]+dx*k,a[1]+dz*k,dx/l,dz/l];}
function cartSpawn(s){cartClear();cartRoute();CART.on=true;CART.s=s;CART.t=0;const L=[];CART.cart=spawnEnt('prisonCart',0,0,{always:true});CART.cart.special=()=>true;L.push(CART.cart);
  // 2 Wachen vorneweg, 6 hinterher (zwei Reihen zu drei)
  const offs=[[7,-.9],[7,.9],[-7.5,-1.2],[-7.5,1.2],[-10,-1.2],[-10,1.2],[-12.5,-1.2],[-12.5,1.2]];
  offs.forEach((o,i)=>{const g=spawnEnt('guardA',0,0,{gi:i%8,always:true,cartG:o});g.special=()=>true;L.push(g);});CART.list=L;cartPlace(0);}
function cartClear(){for(const e of CART.list)removeEnt(e);CART.list=[];CART.on=false;}
function cartPlace(dt){const[x,z,dx,dz]=cartAt(CART.s);const c=CART.cart;c.x=x;c.z=z;c.y=fgy(x,z);c.anim=(c.anim||0)+dt*3;c.frame=Math.floor(c.anim)%3;
  const r=camR();c.flip=(dx*r.x+dz*r.z)<0;
  for(const g of CART.list){if(!g.cartG)continue;const[o,side]=g.cartG,[gx,gz,ddx,ddz]=cartAt(CART.s+o);g.x=gx-ddz*side;g.z=gz+ddx*side;g.y=fgy(g.x,g.z);g.anim=(g.anim||0)+dt*2.2;g.frame=1+(Math.floor(g.anim)%2);}
  if(FLAGS.kreakEscort&&kreakE&&!(FILM.on&&FILM.view)){const[kx,kz]=cartAt(CART.s+10.5);kreakE.x=kx;kreakE.z=kz;kreakE.y=fgy(kx,kz);kreakE.hidden=false;kreakE.scene=false;kreakE.anim=(kreakE.anim||0)+dt*2.2;kreakE.frame=1+(Math.floor(kreakE.anim)%2);}}
const CART_SPD=.85;
function cartTick(dt){if(FILM.on)return;
  if(!CART.on){if(FLAGS.cartS!=null&&state==='playing'&&P.x!=null){try{cartSpawn(FLAGS.cartS);}catch(e){FLAGS.cartS=null;}}return;}
  const cpd=CART.cart?Math.hypot(P.x-CART.cart.x,P.z-CART.cart.z):0;CART.s+=dt*CART_SPD*(cpd>260||P.x>60000?6:1);cartPlace(dt);if(!(typeof CS!=='undefined'&&CS.on))FLAGS.cartS=Math.round(CART.s*10)/10;
  // Ankunft am Tor von Sturmburg: der Wagen fährt hinein, Kreak wartet vor dem Tor
  if(CART.s>=CART.cum[CART.cum.length-1]-2){cartClear();FLAGS.cartS=null;FLAGS.cartArrived=1;if(FLAGS.kreakEscort){FLAGS.kreakEscort=0;FLAGS.kreakAtSturm=1;}
    if(Math.hypot(P.x,P.z-WALL_Z)<200)toast('Der Käfigwagen rollt durch das Tor von Sturmburg.');}}
const CART_FILM={dur:31,fadeIn:true,
  start(F){F.hid=[];for(const e of DEM)if(e.fin&&!e.hidden){e.hidden=true;F.hid.push(e);}if(!F.view&&!(typeof CS!=='undefined'&&CS.on))FLAGS.kreakEscort=1;FLAGS.clock=6*60+20;cartSpawn(6);F.cartS0=6;Mus.cine='ereignisse/abschied';},
  step(F,dt){const t=F.t;CART.s=F.cartS0+t*CART_SPD;cartPlace(dt);F.cu=null;const c=CART.cart,[x,z,dx,dz]=cartAt(CART.s);const nx=-dz,nz=dx;
    if(t<7){const k=kk(t,0,7);F.cam(x+nx*16+dx*lrp(6,-2,k),3,z+nz*16+dz*lrp(6,-2,k),x,1.8,z,46);}
    else if(t<13){if(!F._cc)F._cc=cuCage(7);F.cu=F._cc;}
    else if(t<19){const k=kk(t,13,19);F.cam(x-dx*lrp(22,19,k)+nx*1.5,lrp(2.4,3.4,k),z-dz*lrp(22,19,k)+nz*1.5,x+dx*30,2,z+dz*30,50);}
    else if(t<24){const k=kk(t,19,24);F.cam(x+dx*14-nx*6,2.3,z+dz*14-nz*6,x+dx*4,1.6,z+dz*4,44);}
    else{const k=fEase(kk(t,24,31));F.cam(x-dx*lrp(10,30,k)+nx*lrp(8,14,k),lrp(4,26,k),z-dz*lrp(10,30,k)+nz*lrp(8,14,k),x+dx*lrp(10,60,k),2,z+dz*lrp(10,60,k),50);if(t>29)F.fade(1);}
    if(Math.random()<.3)fxDust(x+rnd(-1,1),z+rnd(-1,1),1,.5,{spd:1,up:.2,size:.3,life:1.6});},
  end(F){Mus.cine=null;$('filmFade').style.opacity=0;for(const e of F.hid||[])e.hidden=false;F.hid=null;}};
// Nahaufnahme: Shikaya hinter Gittern, im Morgenlicht
function cuCage(t0){const o={cx:96,cy:62,s:1.15,mood:'smirk',glow:.35,wind:.15};return{draw:(lp,t,dt)=>{const lt=t-t0;o.t=t;o.glow=.35+Math.max(0,Math.sin(lt*.8))*.15;
  cuSky(lp,t,{top:[60,90,140],mid:[200,150,110],bot:[250,210,150]});
  // vorbeiziehende Bäume im Hintergrund
  for(let k=0;k<6;k++){const x=((k*47-lt*22)%240+240)%240-24;lp.poly([[x,90],[x+10,30+k%3*6],[x+20,90]],(u,v,xx,y)=>shd(pl3(['#1a2a14','#2a4020','#3a5a2a']),.5-v*.2,xx,y));}
  paintShk(lp,o);
  // Gitterstäbe
  for(let bx=6;bx<192;bx+=22)for(let y=0;y<108;y++)for(let w=0;w<5;w++){const L=w<1?.85:w<3?.55:.3;lp.set(bx+w,y,shd(pl3(['#101216','#262a30','#3e444c','#5a626c','#8a929c']),L,bx+w,y));}
  for(const yy of[4,98])for(let x=0;x<192;x++)for(let w=0;w<4;w++)lp.set(x,yy+w,shd(pl3(['#101216','#262a30','#3e444c','#5a626c']),.6-w*.15,x,yy+w));
  // Ketten
  for(let i=0;i<30;i++){const x=70+i*1.8,y=100-Math.sin(i/29*Math.PI)*6;lp.ell(x,y,1.4,1,()=>i%2?[120,130,140]:[70,76,84]);}},glow:(x,map,sc,t)=>shkEyeGlow(o,o.glow)(x,map,sc,t)};}
function startCartFilm(){if(FILM.on)return;playFilm(CART_FILM,()=>{toast('Der Käfigwagen zieht langsam nach Sturmburg. Kreak geht vorneweg.');try{codaReturnStart();}catch(e){console.error(e);}});}

/* ---------- Mehrspieler: alle Spieler sehen die Filme ----------
   Der Host schickt „film", jeder Mitspieler spielt ihn bei sich ab, mit eigenen Darstellern.
   Danach ist bei Mitspielern alles wie vorher (nur zuschauen). */
function duelViewStart(F){const V=F.vEnts=[];F.vSave={x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch,k:kreakE?{hidden:kreakE.hidden,scene:kreakE.scene}:null};
  const S=spawnEnt('shikaya',SHK_W.x,SHK_W.z,{noHostile:true,inv:true,always:true,viewOnly:1});S.special=()=>true;V.push(S);F.S=S;S.frame=0;
  F.K=spawnEnt('kreakF',POR.x,POR.z,{always:true,hidden:true});F.PE=spawnEnt('portalFx',POR.x,POR.z,{always:true,hidden:true});F.PE.h=.1;V.push(F.K,F.PE);
  if(kreakE){kreakE.hidden=true;kreakE.scene=true;}
  const L=[],nf=typeof FROG_FOLK!=='undefined'?FROG_FOLK.length:4;
  for(let k=0;k<14;k++){const e=spawnEnt(k%3===2?'frogA':'guardA',0,700,{gi:k%8,fi:k%nf,always:true,viewOnly:1});e.special=()=>true;e.hidden=true;L.push(e);V.push(e);}
  for(const n of['Dofra','Corvin']){const d=VDEFS.find(v=>v.name===n);const sp=d&&SPR['p'+d.id+'_0']?'p'+d.id+'_':null;if(!sp)continue;const e=spawnEnt('helperA',0,700,{sp,name:n,always:true,viewOnly:1});e.special=()=>true;e.hidden=true;L.push(e);V.push(e);}
  duelStartPositions(F,L);F.clr=filmClear(0,600,30);F.orbs=[];F.pil=[];F.waves=[];}
function duelViewEnd(F){filmRestore(F.clr);F.clr=null;for(const e of F.vEnts||[])removeEnt(e);F.vEnts=null;const s=F.vSave;
  if(s){Object.assign(P,{x:s.x,y:s.y,z:s.z,yaw:s.yaw,pitch:s.pitch,vx:0,vy:0,vz:0});if(kreakE&&s.k)Object.assign(kreakE,s.k);}}
DUEL_FILM.mpId='duel';CART_FILM.mpId='cart';
const MP_FILMS={duel:DUEL_FILM,cart:CART_FILM};
{const a=playFilm;playFilm=function(def,onEnd){if(typeof MP!=='undefined'&&MP.on&&MP.ready&&def&&def.mpId&&!FILM.view&&!filmViewNext&&!(typeof CS!=='undefined'&&CS.on)){try{mpSend({t:'film',id:def.mpId});}catch(e){}}return a(def,onEnd);};}
function mpFilmPrep(){try{if(cine){cine=null;$('cine').hidden=true;$('hotbar').hidden=false;}const s=state;
    if(s==='inventory')closeInventory();else if(s==='dialog')closeDialog();else if(s==='shop')closeShop();else if(s==='craft')closeCraft();else if(s==='journal')closeJournal();
    else if(s==='skills')closeSkills();else if(s==='console')closeConsole();else if(s==='paused')show('pause',false);else if(s==='map'&&typeof closeMap==='function')closeMap();}catch(e){}
  if(state!=='menu'&&state!=='loading'&&state!=='dead')state='playing';}
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='film'){const d=MP_FILMS[m.id];if(d&&!FILM.on&&state!=='menu'&&state!=='loading'){mpFilmPrep();
      if(d===CART_FILM&&isClient&&isClient()){filmViewNext=true;playFilm(d,()=>{try{cartClear();}catch(e){}});}else{filmViewNext=true;playFilm(d);}}return;}
  return a(m,peer);};}
