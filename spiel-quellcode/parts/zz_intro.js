/* =========================================================
   INTRO als Film (wie der Kampf-Film): echte Orte der Welt, Kamerafahrten,
   Effekte, gemalte Nahaufnahmen. Die Helden, Phantom und Shikaya sind
   schwarze Silhouetten. Erzähler und Untertitel laufen synchron mit.
   ========================================================= */
// ---------- Bilder ins Atlas: Intro-Figuren und Phantom ----------
{const a=finaleSprites;finaleSprites=function(list){a(list);try{iBuildFigs();
    for(const k of['er_0','er_up','er_a','kp_0','kp_pt','kp_up','kp_pl'])if(ICUS[k])list.push(['ix_'+k,ICUS[k]]);
    for(let i=0;i<10;i++)for(const p of['db','dbL','dbR'])if(ICUS[p+i])list.push(['ix_'+p+i,ICUS[p+i]]);
    list.push(['phantom_0',iPhantom()]);}catch(e){console.error('Intro-Figuren',e);}};}
DT.sil={name:'',fac:'prop',h:1.9,hp:1,dmg:0,spd:0,reach:0,cd:9,hero:1,spr:e=>e.sp,tint:.03};
DT.crowd={name:'',fac:'prop',h:1.8,hp:1,dmg:0,spd:0,reach:0,cd:9,hero:1,spr:e=>e.sp};
const INTRO={ents:[]};
function iSpawn(type,x,z,o){const e=spawnEnt(type,x,z,Object.assign({always:true,noHostile:true,intro:1},o||{}));e.special=()=>true;INTRO.ents.push(e);return e;}
function iSil2(sp,x,z,h,eyes){const e=iSpawn('sil',x,z,{sp});e.h=h;if(eyes)e.d=Object.assign({},DT.sil,{eyes});return e;}
function iClear(){for(const e of INTRO.ents)removeEnt(e);INTRO.ents=[];if(INTRO.cl){filmRestore(INTRO.cl);INTRO.cl=null;}if(INTRO.gh&&guardMesh){guardMesh.visible=true;INTRO.gh=0;}for(const v of villagers){v.flee=0;}}
const HEROES5=()=>{const vp=n=>{const d=VDEFS.find(v=>v.name===n);return d?'p'+d.id+'_':'g0_';};return[['corvin',vp('Corvin'),'0',1.8],['dofra',vp('Dofra'),'0',1.8],['eron','ix_er_','0',1.95],['kreak','ix_kp_','0',1.95],['shikaya','shk_','0',2.15]];};
const SHK_EYES={y:23,dx:[-2.5,2.5],c:'r'},PH_EYES={y:22,dx:[-4.5,1.5],c:'r'};
function ledgePos(u,v){return[PROCK.x+PROCK.c*u-PROCK.s*v,PROCK.z+PROCK.s*u+PROCK.c*v];}
const ledgeY=()=>groundAt(...ledgePos(30,0),1e4);
const iCl=(x,z,r)=>{INTRO.cl=(INTRO.cl||[]).concat(filmClear(x,z,r)||[]);};const STT=()=>STORM_TOP;
// ---------- Silhouetten-Nahaufnahmen ----------
function silPaint(lp,bg,fig,rim){bg(lp);const B=new Uint8ClampedArray(lp.d);fig(lp);const d=lp.d,W=lp.w,H=lp.h,m=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){const j=i*4;if(d[j]!==B[j]||d[j+1]!==B[j+1]||d[j+2]!==B[j+2])m[i]=1;}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,j=i*4;if(!m[i])continue;const edge=(x>0&&!m[i-1])||(x<W-1&&!m[i+1])||(y>0&&!m[i-W])||(y<H-1&&!m[i+W]);
    const c=edge&&rim?rim:[7,5,9];d[j]=c[0];d[j+1]=c[1];d[j+2]=c[2];}}
function cuSilKreak(t0){const o={cx:96,cy:60,s:1.25,anger:.5,mouth:0,wind:.5};return{draw:(lp,t,dt)=>{o.t=t;silPaint(lp,l=>cuSky(l,t,{top:[40,60,110],mid:[230,140,90],bot:[255,220,160]}),l=>paintKreak(l,o),[200,120,70]);cuEmbers(lp,FILM,dt,1,[255,220,170]);}};}
function cuSilShk(t0){const o={cx:96,cy:58,s:1.2,mood:'smirk',glow:0,wind:.4};return{draw:(lp,t,dt)=>{o.t=t;silPaint(lp,l=>cuSky(l,t,{top:[4,4,14],mid:[24,16,44],bot:[60,30,60],moon:[40,24,9]}),l=>paintShk(l,o),[90,60,120]);
    const lt=t-t0,g=Math.min(1,Math.max(0,(lt-.35)/.4));if(g>0)for(const sd of[-1,1])for(let k=-1;k<=1;k++)lp.set(o.cx+sd*10*o.s+k,o.cy-1*o.s,[255,40*g,30*g]);o.glow=g;},
  glow:(x,map,sc,t)=>{const lt=t-t0,g=Math.min(1,Math.max(0,(lt-.35)/.4));if(g>0)shkEyeGlow({cx:96,cy:58,s:1.2},g*1.3)(x,map,sc,t);}};}
function cuSilPhantom(t0){return{draw:(lp,t,dt)=>{const lt=t-t0;cuSky(lp,t,{top:[10,2,4],mid:[70,8,14],bot:[140,24,16]});if(Math.sin(lt*23)>.97)for(let i=0;i<lp.d.length;i+=4){lp.d[i]=Math.min(255,lp.d[i]+90);lp.d[i+1]=Math.min(255,lp.d[i+1]+70);lp.d[i+2]=Math.min(255,lp.d[i+2]+80);}
    const B=[7,4,8],R=[120,20,20],cx=96,cy=62+Math.sin(lt*1.5)*1.5;
    lp.poly([[cx-70,108],[cx-40,cy+10],[cx-24,cy-30],[cx,cy-44],[cx+24,cy-30],[cx+40,cy+10],[cx+70,108]],(u,v,x,y)=>B);
    for(const sd of[-1,1])lp.tube([[cx+sd*16,cy-30],[cx+sd*30,cy-46],[cx+sd*36,cy-62],[cx+sd*30,cy-74]],5,1,()=>B);
    for(let y=0;y<lp.h;y++)for(let x=1;x<lp.w-1;x++){const j=(y*lp.w+x)*4,d=lp.d;const isB=d[j]===7&&d[j+1]===4&&d[j+2]===8;if(!isB)continue;const L=(y*lp.w+x-1)*4,Rr=(y*lp.w+x+1)*4;if(!(d[L]===7&&d[L+1]===4)||!(d[Rr]===7&&d[Rr+1]===4)){d[j]=R[0];d[j+1]=R[1];d[j+2]=R[2];}}
    for(const sd of[-1,1])lp.ell(cx+sd*9,cy-12,4,1.6,()=>[255,60,40]);cuEmbers(lp,FILM,dt,3);},
  glow:(x,map,sc,t)=>{for(const sd of[-1,1]){const[px,py]=map(96+sd*9,50+Math.sin((t-t0)*1.5)*1.5);glowAt(x,x,px,py,sc*14,'255,40,20',.8);glowAt(x,x,px,py,sc*4,'255,180,140',.8);}}};}
// ---------- Szenen ----------
const fireTick=(F,dt,n)=>{for(const f of finFireList())if(Math.random()<dt*(n||12)){fxP(f.x+rnd(-1.6,1.6),f.y+rnd(0,1),f.z+rnd(-1.6,1.6),rnd(-.4,.4),rnd(2,4),rnd(-.4,.4),[0xff6a10,0xffb030,0xffe080],1,.9,{s1:.3});if(Math.random()<.3)fxP(f.x,f.y+2,f.z,rnd(-.5,.5),rnd(1.5,3),rnd(-.5,.5),0x2a2026,2.5,1.4,{add:false,s1:3,a:.5});}};
const blood=()=>{FLAGS.moonForce={n:FLAGS.day,phase:4,ev:'blood'};};
const ISC2=[
 // 0 Friedliches Kriesa: Coda am Morgen
 {t0:0,t1:3.6,setup(F){FLAGS.clock=7*60+30;FLAGS.moonForce=null;},upd(F,lt){const k=fEase(lt/3.6);F.cam(lrp(-70,-24,k),lrp(48,22,k),lrp(880,790,k),0,2,722,55);}},
 // 1 Die Dämonen brechen herein
 {t0:3.6,t1:9,setup(F){FLAGS.clock=20*60+40;blood();F.flash(.6,'#ff4020');Snd.demonRoar(.9,.9);
   F.rift=iSpawn('portalFx',30,640);F.rift.h=.1;F.dem=[];const T=['imp','hound','warrior','imp','hound'];
   for(let i=0;i<16;i++){const e=iSpawn(T[i%5],rnd(-20,30),rnd(630,650));e.t0=1.2+i*.22;e.tx=rnd(-14,14);e.tz=rnd(705,730);e.hidden=true;F.dem.push(e);}F.mets=[];},
  upd(F,lt,dt){const R=F.rift;R.hidden=false;R.h=Math.max(.1,30*fEase(Math.min(1,lt/1.6)));fplace(R,30,640,46);
   for(let i=0;i<4;i++){const a=Math.random()*6.283;fxP(30+Math.cos(a)*R.h*.36,R.y+R.h*.5+Math.sin(a)*R.h*.48,640,0,0,0,[0xff3a2a,0xffb090],.3,1.4,{s1:.2});}
   if(lt>1.2&&lt<5&&Math.random()<dt*4)F.mets.push({t:0,x0:30,y0:R.y+R.h*.5,z0:640,x1:rnd(-30,30),z1:rnd(690,740)});
   for(let i=F.mets.length-1;i>=0;i--){const m=F.mets[i];m.t+=dt;const k=Math.min(1,m.t/1.1),x=lrp(m.x0,m.x1,k),z=lrp(m.z0,m.z1,k),y=lrp(m.y0,fgy(m.x1,m.z1),k*k);fxP(x,y,z,0,0,0,[0xff6a20,0xffd060],.35,.9,{s1:.2});
     if(k>=1){F.mets.splice(i,1);fxBurst(x,y+.5,z,40,[0xff3a1a,0xffa040],7,.7,.5,{up:3,g:5});Snd.boom(.12);F.shake=.4;}}
   for(const e of F.dem){const tt=lt-e.t0;if(tt<0)continue;e.hidden=false;const k=Math.min(1,tt/2.6);fplace(e,lrp(e.x,e.tx,k*.06)+0,lrp(e.z,e.tz,k*.06),0,Math.floor(tt*8)%2?1:2);e.x=lrp(e.x,e.tx,dt*.5);e.z=lrp(e.z,e.tz,dt*.5);e.flip=e.tx<e.x;}
   if(lt>1.5&&!F.fled){F.fled=1;for(const v of villagers)if(v.z>PLAIN_END&&!v.inside)v.flee=8;}
   if(lt>2.6)fireTick(F,dt,10);
   const k=lt/5.4,g=fgy(12,740);F.cam(lrp(16,10,k),g+lrp(3,4,k),lrp(746,736,k),4,g+lrp(9,15,k),670,58);}},
 // 2 Phantom
 {t0:9,t1:12.6,setup(F){FLAGS.clock=23*60;blood();F.fled=0;F.ph=iSil2('phantom_',0,-1792,58);F.phg=STT();
   for(let r=0;r<2;r++)for(let i=0;i<9;i++){const x=-15+i*3.6+r*1.8;if(Math.abs(x)<2.5)continue;const e=iSil2(['dw_','hnd_','vg_','gr_'][(i+r)%4],x,-1746-r*2.4,[2.2,1.4,4,4.2][(i+r)%4]);e.y=STT();}},
  upd(F,lt,dt){const k=fEase(Math.min(1,lt/1.6));F.ph.x=0;F.ph.z=-1792;F.ph.y=F.phg-58*(1-k);if(lt>1.5&&!F.ph.d.eyes){F.ph.d=Object.assign({},DT.sil,{eyes:PH_EYES});Snd.demonRoar(.5,1.2);}
   if(Math.random()<dt*.8||F.at(9.1)||F.at(10.4)){F.flash(.8,'#e8e0ff');Snd.boom(.2);}
   const g=STT();if(lt<2.6)F.cam(lrp(-4,-2,lt/2.6),g+8,-1726-lt*2,0,g+26+lt*4,-1792,64);else{F.cu=F._ph||(F._ph=cuSilPhantom(11.6));}}},
 // 3 Fünf Helden auf dem Felsen
 {t0:12.6,t1:15.6,setup(F){FLAGS.clock=19*60+55;FLAGS.moonForce=null;F.cu=null;const Y=ledgeY();F.H5=HEROES5().map(([k,sp,f,h],i)=>{const[x,z]=ledgePos(27+(i-2)*1.3,0);const e=iSil2(sp,x,z,h);e.frame=f;return e;});},
  upd(F,lt){const Y=ledgeY();for(const e of F.H5)e.y=groundAt(e.x,e.z,1e4);const v=lrp(15,10,fEase(lt/3)),[cx,cz]=ledgePos(27,v),[lx,lz]=ledgePos(27,0);F.cam(cx,Y+.5,cz,lx,Y+1.5,lz,50);
   if(Math.random()<.5)fxP(lx+rnd(-6,6),Y+rnd(0,6),lz+rnd(-6,6),rnd(-.3,.3),.2,rnd(-.3,.3),[0xffd8a8,0xffe8c0],2,.12,{s1:.05});}},
 // 4 Eron: das Wüstenreich jubelt seinem König zu
 {t0:15.6,t1:18.9,setup(F){FLAGS.clock=12*60;F.er=iSil2('ix_er_',582,548,2.1);F.er.frame='0';F.crowd=[];
   for(let r=0;r<3;r++)for(let i=0;i<12;i++){const a=(i/11-.5)*2.2,R=6+r*2.4,x=582+Math.sin(a)*R,z=548+Math.cos(a)*R,id=(i*7+r*3)%10;const e=iSpawn('crowd',x,z,{sp:'ix_db'});e.id=id;e.ph=Math.random()*6;e.frame=id;F.crowd.push(e);}},
  upd(F,lt,dt){fplace(F.er,582,548,.6,Math.floor(lt*1.6)%2===0||lt>2.2?'up':'0');
   for(const e of F.crowd){const up=Math.sin(lt*3+e.ph)>-.2;e.sp=up?'ix_db'+(e.ph>3?'L':'R'):'ix_db';e.frame=e.id;e.y=fgy(e.x,e.z)+(up?Math.abs(Math.sin((lt*3+e.ph)*2))*.15:0);}
   for(let i=0;i<3;i++)fxP(582+rnd(-10,10),fgy(582,548)+rnd(6,10),548+rnd(-4,12),rnd(-.6,.6),-rnd(.6,1.4),rnd(-.6,.6),[0xf0c840,0xe84a3a,0xf8f0e0,0x2a6aa0],3,.18,{add:false,g:-.3,s1:.18});
   if(F.at(17.2)){try{Snd.fanfare();}catch(e){}}
   const k=fEase(lt/3.3),g=fgy(582,560);F.cam(582+Math.sin(lt*.3)*2,g+lrp(5,4.4,k),lrp(565,558,k),582,g+2,548,lrp(52,40,k));}},
 // 5 Kreak: Kronprinz von Sturmburg, gibt den Wachen Befehle
 {t0:18.9,t1:24.5,setup(F){FLAGS.clock=10*60;const Z=-1776;iCl(0,Z,30);F.k=iSil2('ix_kp_',0,Z,2.05);F.k.frame='0';F.gd=[];
   for(const sd of[-1,1])F.gd.push(Object.assign(iSpawn('guardA',sd*2.2,Z-1,{gi:sd<0?2:5}),{fix:1}));
   for(let r=0;r<3;r++)for(const sd of[-1,1])for(let i=0;i<2;i++){const e=iSpawn('guardA',sd*(1.6+i*1.4),Z-6-r*2.6,{gi:(r*2+i)%8});e.row=r;e.sd=sd;e.bx=e.x;e.bz=e.z;F.gd.push(e);}},
  upd(F,lt,dt){const p=lt<.6?'0':lt<1.4?'pt':lt<2.1?'up':lt<2.9?'pl':lt<3.4?'pt':'up';fplace(F.k,0,-1776,0,p);const march=Math.min(1,Math.max(0,(lt-2.1)/1.6));
   for(const e of F.gd){if(e.fix){fplace(e,e.x,e.z,0,0);continue;}if(e.row===2&&march>0){fplace(e,e.bx+e.sd*march*10,e.bz-march*6,0,1+(Math.floor(lt*7)%2));}else fplace(e,e.bx,e.bz,0,0);}
   if(F.at(20.4)){Snd.clank(.6);}if(F.at(21.0)){Snd.thud();setTimeout(()=>Snd.thud(),250);}if(F.at(22.4)){try{Snd.fanfare();}catch(e){}}
   const g=fgy(0,-1776),fin=fEase(Math.min(1,Math.max(0,(lt-3.6)/1.6)));F.cam(lrp(4,1,lt/5.6),g+lrp(2.2,1.8,lt/5.6),lrp(-1767,-1770,lt/5.6)-fin*2.5,0,g+1.8,-1790,lrp(56,36,fin));}},
 // 6 Lange hielten sie stand
 {t0:24.5,t1:27.2,setup(F){FLAGS.clock=19*60+25;blood();iCl(0,420,34);F.h=HEROES5().map(([k,sp,f,h],i)=>{const e=iSil2(sp,(i-2)*2.4,420,h);e.frame=f;e.k=k;return e;});F.dm=[];
   for(let i=0;i<12;i++){const e=iSpawn(['imp','hound','warrior'][i%3],rnd(-8,8),380-i*3);e.t0=i*.18;e.hidden=true;F.dm.push(e);}},
  upd(F,lt,dt){for(const e of F.h){const f=e.k==='kreak'?(Math.floor(lt*3)%2?'up':'pt'):e.k==='eron'?(Math.floor(lt*3)%2?'a':'0'):e.k==='shikaya'?(Math.floor(lt*3)%2?'a':'0'):'0';fplace(e,e.x,e.z,0,f);}
   for(const e of F.dm){const tt=lt-e.t0;if(tt<0||e.gone)continue;e.hidden=false;e.z+=dt*9;fplace(e,e.x,e.z,0,1+(Math.floor(tt*8)%2));
     if(e.z>417.5){e.gone=1;e.hidden=true;fxSparks(e.x,fgy(e.x,e.z)+1.2,e.z,26,{spd:8});fxBurst(e.x,fgy(e.x,e.z)+1,e.z,20,[0x5a0a0a,0x200008],4,.6,.4,{});Snd.clank(.4);}}
   const g=fgy(10,423);F.cam(lrp(10,7,lt/2.7),g+2,425,0,g+1.3,413,50);}},
 // 7 Verrat
 {t0:27.2,t1:30.6,setup(F){FLAGS.clock=20*60+50;FLAGS.moonForce=null;F.H7=HEROES5().map(([k,sp,f,h],i)=>{const[x,z]=ledgePos(27+(i-2)*1.3,0);const e=iSil2(sp,x,z,h);e.frame=f;e.k=k;return e;});F.cu=null;},
  upd(F,lt,dt){const Y=ledgeY();const S=F.H7[4];for(const e of F.H7)e.y=groundAt(e.x,e.z,1e4);
   if(lt>.8&&!S.d.eyes){S.d=Object.assign({},DT.sil,{eyes:SHK_EYES});Snd.demonRoar(1.6,.5);}
   const[fx,fz]=ledgePos(23,0);fxP(fx+rnd(-.3,.3),Y+.2,fz+rnd(-.3,.3),rnd(-.2,.2),rnd(1,2),rnd(-.2,.2),[0xff8a20,0xffd060],.6,.4,{s1:.1});
   if(lt>1.3){const u=lrp(29.6,31,Math.min(1,(lt-1.3)/.8)),[sx,sz]=ledgePos(u,0);S.x=sx;S.z=sz;S.y=groundAt(sx,sz,1e4);
     if(!F.cr){F.cr=1;F.flash(.6,'#ff3020');F.shake=.8;Snd.boom(.3);}const[ax,az]=ledgePos(29,-5),[bx,bz]=ledgePos(29,3);fxLine(ax,Y+.1,az,bx,Y+.1,bz,6,[0xff3a2a,0xff7a4a],.4,.25,{});}
   const v=lrp(11,8.5,lt/3.4),[cx,cz]=ledgePos(27,v),[lx,lz]=ledgePos(27,.5);
   if(lt>.9&&lt<1.9){F.cu=F._s7||(F._s7=cuSilShk(28.1));}else{F.cu=null;F.cam(cx,Y+.6,cz,lx,Y+1.5,lz,48);}}},
 // 8 Erons Tod vor seinem Palast
 {t0:30.6,t1:33.8,setup(F){FLAGS.clock=22*60;blood();F.cr=0;F.cu=null;F.er=iSil2('ix_er_',582,548,2.1);F.er.frame='0';F.sh=iSil2('shk_',588,545,4.2,SHK_EYES);F.sh.frame='0';},
  upd(F,lt,dt){fplace(F.sh,588,545,0,lt<.7?'0':'a');fplace(F.er,582,548,0,'0');
   if(F.at(31.3)){F.flash(.75,'#ff2a2a');Snd.clank(.7);const g=fgy(582,548);fxArc(584,g+1.6,547,0,2.5,-1.2,1.2,40,[0xff2a2a,0xff7a4a],.4,.5,{tilt:1});}
   if(lt>.9){F.er.sink=true;F.er.sinkT=(F.er.sinkT||0)+dt*.9;if(Math.random()<.5)fxDust(582,548,2,.6,{spd:1.5,size:.4});}
   if(lt>2.4&&lt<3.2)F.sh.hidden=Math.random()<lt-2.4;
   const g=fgy(574,552);F.cam(574,g+1.6,553,584,g+1.6,547,46);}},
 // 9 Das Königreich zerfällt zu Wüstenstaub
 {t0:33.8,t1:37,setup(F){FLAGS.clock=16*60+30;FLAGS.moonForce=null;F.fade(.1);},
  upd(F,lt,dt){const k=lt/3.2,cx=lrp(556,604,k),cz=574,g=fgy(cx,cz);F.cam(cx,g+6,cz,cx+8,g+2,546,55);
   for(let i=0;i<40;i++)fxP(cx+rnd(-10,30),g+rnd(0,9),cz+rnd(-28,4),-rnd(9,16),rnd(-.5,.5),rnd(-1,1),[0xd8a860,0xb88848,0xe8c890],1.3,.5,{add:false,s1:.9,a:.55});}},
 // 10 Viele verloren den Mut
 {t0:37,t1:38.9,setup(F){FLAGS.clock=15*60;F.fade(.32);for(const v of villagers)v.flee=0;},
  upd(F,lt,dt){const g=fgy(-8,730);F.cam(-8,g+2.2,730,4,g+1.4,712,52);for(let i=0;i<30;i++)fxP(rnd(-14,14),g+rnd(4,9),rnd(712,738),-1.5,-18,0,[0xa8b0c0,0xc0c8d4],.45,.06,{add:false,a:.5,s1:.05});}},
 // 11 Kreak, wahrer Kaiser von Sturmburg
 {t0:38.9,t1:43.5,setup(F){FLAGS.clock=19*60+50;F.fade(0);iCl(-8,-1748,24);if(guardMesh){guardMesh.visible=false;INTRO.gh=1;}F.k=iSil2('ix_kp_',-10.5,-1748,2.05);F.k.frame='0';},
  upd(F,lt){fplace(F.k,-10.5,-1748,0,'0');const g=fgy(-10.5,-1748),k=fEase(lt/2.6);
   if(lt<2.7)F.cam(lrp(-.5,-1.6,k),g+lrp(2.4,1.9,k),lrp(-1754,-1752,k),-20,g+1.6,-1742,lrp(52,44,k));else F.cu=F._k11||(F._k11=cuSilKreak(41.6));}},
 // 12 ... verschwand spurlos
 {t0:43.5,t1:47.9,setup(F){FLAGS.clock=23*60+30;F.cu=null;iCl(-8,-1748,24);if(guardMesh){guardMesh.visible=false;INTRO.gh=1;}F.k=iSil2('ix_kp_',-10.5,-1748,2.05);F.k.frame='0';},
  upd(F,lt,dt){const g=fgy(-10.5,-1748);fplace(F.k,-10.5,-1748,0,'0');
   if(lt>2&&lt<3.6){for(let i=0;i<6;i++)fxP(-10.5+rnd(-.4,.4),g+rnd(0,2),-1748+rnd(-.3,.3),rnd(-.3,.3),rnd(.8,2),rnd(-.3,.3),[0x7ad04a,0xc8f0a0],1.6,.2,{s1:.05});F.k.sink=true;F.k.sinkT=((lt-2)/1.6)*1.5;}
   if(lt>=3.6)F.k.hidden=true;F.cam(-1.6+lt*.25,g+1.9,-1752-lt*.5,-20,g+1.6,-1742,46);}},
 // 13 Phantom und Shikaya herrschen
 {t0:47.9,t1:52.9,setup(F){FLAGS.clock=22*60;blood();F.ph=iSil2('phantom_',0,660,64,PH_EYES);F.sh=iSil2('shk_',0,716,4.2,SHK_EYES);F.sh.frame='f';
   for(let i=0;i<12;i++){const a=i/12*6.283,e=iSpawn(['imp','hound','warrior'][i%3],Math.cos(a)*6,716+Math.sin(a)*6);e.frame=0;}},
  upd(F,lt,dt){fplace(F.ph,0,660,0);fplace(F.sh,0,716,0,'f');fireTick(F,dt,6);const k=fEase(lt/5),g=fgy(0,728);F.cam(lrp(3,1,k),g+lrp(1.4,3,k),lrp(728,724,k),0,g+lrp(5,24,k),690,lrp(60,66,k));
   if(F.at(48.4))Snd.demonRoar(.6,1);if(F.at(50.6)&&Snd.queenRoar)Snd.queenRoar();}},
 // 14 Sie plündern die armen Dörfer
 {t0:52.9,t1:57.7,setup(F){FLAGS.clock=22*60+30;blood();F.ch=[];for(let i=0;i<7;i++){const e=iSpawn(['imp','hound','warrior'][i%3],24+i*2.6,700+rnd(-2,2));e.t0=i*.35;F.ch.push(e);}F.fl=0;},
  upd(F,lt,dt){fireTick(F,dt,14);if(!F.fl&&lt>.3){F.fl=1;for(const v of villagers)if(v.z>PLAIN_END&&!v.inside)v.flee=8;}
   for(const e of F.ch){const tt=lt-e.t0;if(tt<0){e.hidden=true;continue;}e.hidden=false;e.x-=dt*6;fplace(e,e.x,e.z,0,1+(Math.floor(tt*8)%2));e.flip=true;}
   if(F.at(53.3))Snd.demonRoar(1.2,.8);if(F.at(55))Snd.boom(.16);const k=lt/4.8,g=fgy(-4,714);F.cam(-4-k*4,g+2.4,714,lrp(16,-6,k),g+1.2,700,56);}},
 // 15 Bis heute …
 {t0:57.7,t1:62.2,setup(F){F.fade(1);for(const v of villagers)v.flee=0;},
  upd(F,lt){if(lt>1.5&&!F.home){F.home=1;FLAGS.clock=INTRO.save.clock;FLAGS.moonForce=INTRO.save.moon;iClear();F.fade(0);}
   if(lt>1.5){const s=INTRO.save,k=fEase(Math.min(1,(lt-1.5)/3)),ey=s.y+(P.eye||1.6),fx=-Math.sin(s.yaw),fz=-Math.cos(s.yaw);
     F.cam(s.x-fx*lrp(14,0,k),lrp(ey+26,ey,k),s.z-fz*lrp(14,0,k),s.x+fx*10,ey+lrp(-6,Math.sin(s.pitch||0)*10,k),s.z+fz*10,lrp(60,F.fov0,k));}}}];
const INTRO_FILM={dur:62.2,silent:false,
  start(F){INTRO.save={clock:FLAGS.clock,moon:FLAGS.moonForce||null,x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch};IN.on=true;F.si=-1;Mus.cine='ereignisse/intro';
    if(!$('filmSub')){const s=document.createElement('div');s.id='filmSub';$('film').appendChild(s);const st=document.createElement('style');
      st.textContent="#filmSub{position:absolute;left:50%;bottom:2.4vh;transform:translateX(-50%);width:min(880px,92vw);text-align:center;color:#f2e6c8;font-family:var(--f-title,serif);font-size:clamp(15px,2.3vw,24px);line-height:1.3;text-shadow:0 2px 0 #000,0 0 8px #000;transition:opacity .4s;opacity:0}";document.head.appendChild(st);}
    try{const a=new Audio('assets/sfx/intro/erzaehler.mp3');a.volume=clamp(voiceVol()*.95,0,1);F.audio=a;F.audioOk=false;
      a.addEventListener('playing',()=>{F.audioOk=true;},{once:true});a.addEventListener('error',()=>{F.audio=null;},{once:true});const p=a.play();if(p&&p.catch)p.catch(()=>{F.audio=null;});}catch(e){F.audio=null;}},
  step(F,dt){const A=F.audio;if(A&&F.audioOk&&!A.paused&&!A.ended&&A.currentTime>0)F.t=A.currentTime;
    const t=F.t,i=ISC2.findIndex(s=>t>=s.t0&&t<s.t1);if(i<0)return;const S=ISC2[i];
    if(i!==F.si){iClear();F.si=i;F.cu=null;F.shake=0;try{S.setup(F);}catch(e){console.error('Intro-Szene',i,e);}}
    try{S.upd(F,t-S.t0,dt);}catch(e){console.error('Intro',i,e);}
    const sub=INTRO_SUBS.find(s=>t>=s[0]&&t<s[1]),el=$('filmSub');if(el){const tx=sub?sub[2]:'';if(el.textContent!==tx&&tx)el.textContent=tx;el.style.opacity=sub?1:0;}},
  end(F){iClear();if(F.audio){try{F.audio.pause();}catch(e){}F.audio=null;}const s=INTRO.save;if(s){FLAGS.clock=s.clock;FLAGS.moonForce=s.moon;Object.assign(P,{x:s.x,y:s.y,z:s.z,yaw:s.yaw,pitch:s.pitch,vx:0,vy:0,vz:0});}
    for(const v of villagers)v.flee=0;const el=$('filmSub');if(el)el.style.opacity=0;F.fade(0);$('filmFade').style.opacity=0;IN.on=false;FLAGS.introSeen=1;try{saveGame();}catch(e){}}};
playIntro=function(){if(FILM.on)return;try{finFires=null;}catch(e){}playFilm(INTRO_FILM);};
endIntro=function(){if(FILM.on&&FILM.def===INTRO_FILM){FILM.onEnd=null;filmEnd(true);}IN.on=false;};

const SIL_M=()=>[wMesh,demMesh,kreakMesh,villMesh,guardMesh,animalMesh,frogMesh,mercMesh,mumMesh,phMesh,merchMesh,witchMesh,mobMesh,fightMesh,coachMesh,steedMesh,jorinMesh];
function silPass(on){for(const m of SIL_M()){if(!m||!m.geometry)continue;const t=m.geometry.attributes.tint;if(!t)continue;
  if(on){if(!m._silBk)m._silBk=Float32Array.from(t.array);t.array.fill(.03);t.needsUpdate=true;}
  else if(m._silBk){t.array.set(m._silBk.length===t.array.length?m._silBk:t.array);m._silBk=null;t.needsUpdate=true;}}}
let silHooked=false;function silHook(){if(silHooked||!renderer)return;silHooked=true;const r=renderer.render.bind(renderer);
  renderer.render=function(sc,cam){if(FILM.on&&FILM.def===INTRO_FILM)try{silPass(true);}catch(e){}return r(sc,cam);};}
{const a=INTRO_FILM.start;INTRO_FILM.start=function(F){silHook();return a.call(this,F);};}
{const a=INTRO_FILM.end;INTRO_FILM.end=function(F){try{silPass(false);}catch(e){}return a.call(this,F);};}
