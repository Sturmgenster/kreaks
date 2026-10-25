/* =========================================================
   0.0.137 · Eingänge in die Tiefe
   - Jedes Gewölbe hat von außen ein eigenes Bauwerk passend zum Thema:
     Gruft: Mausoleum mit Säulen, Kreuz und Grabsteinen · Eisgewölbe: Eisgrab mit Zapfen und Kristallen
     Grabmal: Sandsteintempel mit Obelisken und Sandverwehungen · Tempel: Stufentempel mit Ranken und Schlangenköpfen
     Versunkenes Gewölbe: halb versunkene Ruine mit toten Bäumen, Pfützen und grünen Laternen
   - Die Eisgruft in den Schneebergen ist jetzt ein echtes Eisgewölbe mit zwei Ebenen. Unten wartet Graf Vlados
     (Quest „Der Bruder“), sonst Hrimgar, der Frostfürst.
   - Einfach hineinlaufen: durch die Tür ins Gewölbe, die Treppe hoch wieder hinaus, in den Schacht hinab zur nächsten Ebene.
     Auch die Höhlen in der Wildnis betritt man jetzt einfach im Vorbeigehen.
   ========================================================= */
const DGI={sol:new Map(),t:0};
function dg2Ext(g,opt){opt=opt||{};const th=opt.th||dg2ThemeOf(g),M=dg2Mats(th),VM=vl2Mats(),W=opt.W||6.4,D=opt.D||6.2,H=opt.H||4.2,c=Math.cos(g.rot),s=Math.sin(g.rot);
  const L2W=(lx,lz)=>[g.x+lx*c-lz*s,g.z+lx*s+lz*c];let mn=1e9,mx=-1e9;
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const[x,z]=L2W(i*(W/2+.6),j*(D/2+.6)),h=getHeight(x,z);mn=Math.min(mn,h);mx=Math.max(mx,h);}
  const tier=th==='dschungel'?1.1:0,y0=mx+.15+tier,V=new VB2(),C=vCx(V,vM(g.x,y0,g.z,0,-g.rot,0)),grp=new THREE.Group(),sol=[],r=mulberry32(((g.seed|0)^0x77e1)>>>0),ri=(a,b)=>a+((r()*(b-a+1))|0);
  const S=(lx,lz,hw,hd,y1,walk)=>{const[x,z]=L2W(lx,lz);sol.push(solAdd(Object.assign({x,z,hw,hd,y0:mn-3,y1:y0+y1,rot:g.rot,solid:1},walk?{walk:1}:{})));};
  const gy=(lx,lz)=>{const[x,z]=L2W(lx,lz);return getHeight(x,z)-y0;};
  // Sockel und Stufen
  {const ph=y0-mn+1;C.b(M.acc,W+1.2,ph,D+1.2,0,.02-ph/2,0);S(0,0,W/2+.6,D/2+.6,.02,true);
    if(tier){const p2=y0-mn+1-.55;C.b(M.acc,W+3.2,p2,D+3.2,0,-.55-p2/2,0);S(0,0,W/2+1.6,D/2+1.6,-.55,true);}
    const ft=gy(0,D/2+1.6+tier),dy=-ft;const n=dy>.25?Math.ceil(dy/.3):0;for(let k=0;k<n;k++){const top=-(k+1)*dy/(n+1),zc=D/2+.6+(tier?1:0)+.42*(k+.5),h=top-ft+1;C.b(M.acc,2.8,h,.42,0,top-h/2,zc);}
    if(dy>.1){const zin=D/2+.2,zout=D/2+.6+(tier?1:0)+.42*n+.1,[x,z]=L2W(0,(zin+zout)/2);sol.push(solAdd({x,z,hw:1.4,hd:(zout-zin)/2,y0:y0-dy,y1:y0+.02,rot:g.rot+Math.PI,solid:1,walk:1,ramp:1}));}}
  // Mauern mit Tür
  const t=.6,dw=2.2,dh=2.9,sw=(W-dw)/2;C.b(M.wall,W,H,t,0,H/2,-D/2+t/2);S(0,-D/2+t/2,W/2,t/2,H);
  for(const sx of[-1,1]){C.b(M.wall,t,H,D,sx*(W/2-t/2),H/2,0);S(sx*(W/2-t/2),0,t/2,D/2,H);C.b(M.wall,sw,H,t,sx*(dw/2+sw/2),H/2,D/2-t/2);S(sx*(dw/2+sw/2),D/2-t/2,sw/2,t/2,H);}
  C.b(M.wall,dw,H-dh,t,0,dh+(H-dh)/2,D/2-t/2);C.b(M.void,W-2*t+.02,H-.1,D-2*t+.02,0,(H-.1)/2,0);C.b(M.void,dw,.02,t,0,.01,D/2-t/2);S(0,D/2-t-1.6,dw/2+.3,.2,H);
  for(const sx of[-1,1])C.b(M.acc,.45,dh+.1,t+.3,sx*(dw/2+.22),(dh+.1)/2,D/2-t/2);C.b(M.acc,dw+1.2,.5,t+.35,0,dh+.25,D/2-t/2);
  for(const sx of[-1,1])for(const sz of[-1,1])C.b(M.acc,.8,H+.3,.8,sx*W/2,(H+.3)/2,sz*D/2);
  // Thema
  if(th==='gruft'){vRoof(C,VM.slate,M.wall,W+.2,D+.2,H,.62,.4,M.acc);const Hr=H+(D+.2)/2*Math.tan(.62);C.b(M.acc,.18,1.2,.18,0,Hr+.6,D/2-.3);C.b(M.acc,.7,.18,.18,0,Hr+.85,D/2-.3);
    for(const sx of[-1,1]){C.b(M.acc,.55,dh+.7,.55,sx*(dw/2+.85),(dh+.7)/2,D/2+.4);C.b(M.acc,.75,.25,.75,sx*(dw/2+.85),dh+.82,D/2+.4);C.b(M.candle,.1,.3,.1,sx*(dw/2+.85),dh+1.1,D/2+.4);C.b(M.fire,.07,.1,.07,sx*(dw/2+.85),dh+1.3,D/2+.4);}
    for(let k=0;k<ri(5,8);k++){const a=r()*6.283,d=W*.75+r()*3.5,lx=Math.cos(a)*d,lz=Math.sin(a)*d;if(lz>D/2&&Math.abs(lx)<2.2)continue;const y=gy(lx,lz),ry=(r()-.5)*.5,tl=(r()-.5)*.25;
      C.b(M.acc,.7,.9,.16,lx,y+.42,lz,tl,ry,0);C.b(M.acc,.5,.18,.16,lx,y+.92,lz,tl,ry,0);if(r()<.4)C.b(M.acc,.16,.5,.16,lx,y+1.15,lz,tl,ry,0);}
    for(let k=-3;k<=3;k++){if(Math.abs(k)<2)continue;const lx=k*1.1,lz=D/2+2.6;C.b(VM.iron,.07,1.1,.07,lx,gy(lx,lz)+.55,lz);C.b(VM.iron,.12,.12,.12,lx,gy(lx,lz)+1.12,lz);}}
  else if(th==='eis'){C.cone(M.acc,Math.max(W,D)*.78,3.2,4,0,H,0,Math.PI/4);C.b(M.acc,W+.8,.35,D+.8,0,H+.15,0);for(let k=0;k<14;k++){const sd=k%4,u=(r()-.5)*(sd<2?W:D),lx=sd===0?u:sd===1?u:sd===2?-W/2-.4:W/2+.4,lz=sd===0?D/2+.4:sd===1?-D/2-.4:u,l=.5+r()*1.2;
      V.cone(M.ice,.12+r()*.08,l,5,vM(lx,H,lz,Math.PI,0,0,C.M),0);}
    for(let k=0;k<ri(6,10);k++){const a=r()*6.283,d=W*.7+r()*4,lx=Math.cos(a)*d,lz=Math.sin(a)*d;if(lz>D/2&&Math.abs(lx)<2.2)continue;const y=gy(lx,lz),h=.8+r()*2.2;V.cone(r()<.4?M.glow:M.ice,.25+r()*.25,h,5,vM(lx,y-.1,lz,(r()-.5)*.4,r()*3,(r()-.5)*.4,C.M),0);}
    for(const sx of[-1,1]){C.b(M.ice,.6,dh+1,.6,sx*(dw/2+.85),(dh+1)/2,D/2+.4);C.b(M.glow,.3,.3,.3,sx*(dw/2+.85),dh+1.3,D/2+.4,.6,.785,0);}
    if(opt.cry){C.b(M.acc,W*.6,.9,D*.6,0,H+.8,0);for(const sx of[-1,1])for(const sz of[-1,1])V.cone(M.ice,.3,2.2,5,vM(sx*(W/2+.1),H+.3,sz*(D/2+.1),0,0,0,C.M),0);C.b(M.glow,.5,.5,.5,0,H+1.6,0,.6,.785,0);}}
  else if(th==='wueste'){C.b(M.acc,W+.7,.45,D+.7,0,H+.22,0);C.b(M.acc,W+.2,.3,D+.2,0,H+.6,0);C.b(VM.gold,1.1,1.1,.12,0,dh+.95,D/2+.05,0,0,.785);
    for(const sx of[-1,1]){const lx=sx*(dw/2+2),lz=D/2+1.8,y=gy(lx,lz);C.b(M.acc,.8,.4,.8,lx,y+.2,lz);C.b(M.acc,.55,4.2,.55,lx,y+2.5,lz);V.cone(VM.gold,.42,.7,4,vM(lx,y+4.6,lz,0,Math.PI/4,0,C.M),0);}
    for(let k=0;k<ri(3,5);k++){const sd=r()<.5?-1:1,lz=(r()-.5)*D,lx=sd*(W/2+.9);C.b(M.sand,1.6,.5+r()*.6,1.8+r(),lx,gy(lx,lz)+.1,lz,0,0,sd*.35);}C.b(M.sand,W+2,.35,1.5,0,gy(0,-D/2-1)+.05,-D/2-1,-.3,0,0);}
  else if(th==='dschungel'){C.b(M.acc,W+.6,.5,D+.6,0,H+.25,0);C.b(M.acc,W*.7,.6,D*.7,0,H+.8,0);C.b(M.acc,W*.4,.9,D*.4,0,H+1.55,0);
    for(let k=0;k<ri(12,20);k++){const sd=k%4,u=(r()-.5)*(sd<2?W:D),lx=sd<2?u:(sd===2?-1:1)*(W/2+.32),lz=sd===0?D/2+.32:sd===1?-D/2-.32:u,l=.8+r()*2.6;if(sd===0&&Math.abs(u)<dw/2+.3)continue;C.b(VM.vine,sd<2?.3:.06,l,sd<2?.06:.3,lx,H-l/2+.4,lz);}
    for(let k=0;k<ri(4,8);k++)C.b(VM.canopy,.6+r()*.9,.2,.6+r()*.9,(r()-.5)*W,H+.55,(r()-.5)*D);
    for(const sx of[-1,1]){C.b(M.acc,.7,.7,1,sx*(dw/2+.75),.35,D/2+.7);C.b(M.acc,.6,.5,.7,sx*(dw/2+.75),.95,D/2+.95);C.b(M.glow,.12,.08,.04,sx*(dw/2+.75)-.15,1.05,D/2+1.31);C.b(M.glow,.12,.08,.04,sx*(dw/2+.75)+.15,1.05,D/2+1.31);}}
  else{const tilt=(r()-.5)*.12;C.b(VM.shingle,W*.55,.14,D*.7,-W*.22,H+.5,0,0,0,.5+tilt);C.b(VM.shingle,W*.4,.14,D*.6,W*.25,H+.35,-.3,.1,0,-.45);
    for(let k=0;k<ri(3,5);k++){const a=r()*6.283,d=W*.8+r()*4,lx=Math.cos(a)*d,lz=Math.sin(a)*d;if(lz>D/2&&Math.abs(lx)<2.2)continue;const y=gy(lx,lz),h=3+r()*3;C.b(VM.beamD,.25,h,.25,lx,y+h/2,lz,(r()-.5)*.2,0,(r()-.5)*.2);
      for(let q=0;q<2;q++)C.b(VM.beamD,.12,1.4,.12,lx+(r()-.5)*.6,y+h*.6+q*.6,lz,0,r()*3,(r()<.5?1:-1)*.9);}
    for(let k=0;k<ri(3,6);k++){const lx=(r()-.5)*(W+6),lz=D/2+1+r()*3;C.b(M.water,1.2+r()*1.6,.03,1+r()*1.4,lx,gy(lx,lz)+.03,lz,0,r(),0);}
    for(const sx of[-1,1]){const lx=sx*(dw/2+1.6),lz=D/2+1.4,y=gy(lx,lz);C.b(VM.beamD,.14,2.2,.14,lx,y+1.1,lz);C.b(M.glow,.26,.32,.26,lx,y+2.35,lz);}}
  V.build(grp);scene.add(grp);g.ed=D/2+2.4+(tier?1.2:0);g.ext={y0,W,D,dw,th};return{grp,sol};}
// ---------- Wildnis-Gewölbe ----------
dgEntBuild=function(g){const B=dg2Ext(g);DGE.built.set(g.id,{g,grp:B.grp});DGI.sol.set(g.id,B.sol);};
dgEntLooked=function(){return null;};
// ---------- Eisgruft ----------
cryBuild=function(g){if(!g.dg)g.dg={id:g.id+'_dg',x:g.x,z:g.z,y:g.y,rot:g.rot,seed:((g.x*73856093)^(g.z*19349663)^(WSEED|0))|0,b:'schnee',cry:1,nf:2};
  const B=dg2Ext(g.dg,{th:'eis',W:9,D:7,H:4.4,cry:1}),R={g,grp:B.grp,sol:B.sol};CRY.built.set(g.id,R);return R;};
cryFree=function(B){scene.remove(B.grp);B.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const s of B.sol)solDel(s);CRY.built.delete(B.g.id);};
cryTick=function(dt){CRY.t-=dt;if(CRY.t<=0){CRY.t=1;if(P.x<60000&&WL_READY&&!DGX.on){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=cryptOf(wlSite(ci+a,cj+b));if(g&&!CRY.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<200)cryBuild(g);}}
  for(const B of[...CRY.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>270||P.x>60000)cryFree(B);}};
// ---------- Hineinlaufen ----------
function dgiInside(g){const e=g.ext;if(!e)return false;const c=Math.cos(g.rot),s=Math.sin(g.rot),dx=P.x-g.x,dz=P.z-g.z,lx=dx*c+dz*s,lz=-dx*s+dz*c;
  return Math.abs(lx)<e.dw/2&&lz<e.D/2-.2&&lz>e.D/2-2.2&&Math.abs(P.y-e.y0)<1.6;}
function dgiTick(dt){DGI.t-=dt;if(DGI.t<=0){DGI.t=1;for(const[id,L]of[...DGI.sol])if(!DGE.built.has(id)){for(const b of L)solDel(b);DGI.sol.delete(id);}}
  if(state!=='playing'||loadBusy||DGX.on||P.x>60000||time<DG2.armT)return;
  const go=(g,name)=>{if(P.riding){if(time-(DGI.rt||-9)>4){DGI.rt=time;toast('Steig erst ab');}return;}DG2.armT=time+2.5;loadTransition(name,()=>{if(!DGX.on)dgEnter(g);});};
  for(const B of DGE.built.values())if(dgiInside(B.g)){go(B.g,DG_THEMES[dg2ThemeOf(B.g)].n);return;}
  for(const B of CRY.built.values())if(B.g.dg&&dgiInside(B.g.dg)){go(B.g.dg,'Die Eisgruft');return;}
  // Höhlen in der Wildnis
  if(!inCore(P.x,P.z)&&caveArm.armed&&caveArm.t<=0){const q=wlCaveNear();if(q){const[s,cv]=q;if(Math.hypot(cv.x-P.x,cv.z-P.z)<1.6){if(P.riding)return;caveArm.armed=false;let h=0;for(const ch of cv.id)h=(h*31+ch.charCodeAt(0))|0;
      const d={kind:'caveEnter',i:wlSlot0+((h>>>0)%WL_CAVE_SLOTS),wild:cv,site:s};loadTransition('Die Höhle',()=>useDoor(d));}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{dgiTick(dt);}catch(e){if(!dgiTick.err){dgiTick.err=1;console.error('Eingänge',e);}}};}
// beim Ankommen im Gewölbe nicht sofort wieder hinaus
{const a=dgEnter;dgEnter=function(g){a(g);DG2.armT=time+2;};}
{const a=dgLeave;dgLeave=function(dead){a(dead);DG2.armT=time+2;};}
// keine Bäume und Büsche direkt am Eingang (Boden bleibt wie die Umgebung)
for(const b of['wald','ebene','nadelwald','nadel2','redwood','dschungel','savanne','wueste','steinwueste','sumpf','schnee','schneeberge']){if(!WLP[b])continue;const k=b+'_frei';WLP[k]=WLP[b];WLV[k]=[];WLB[k]=WLB[b];try{FA_BIO[k]=[];FA_TGT[k]=0;}catch(e){}}
{const a=wlColor;wlColor=function(b,...r){if(b&&b.endsWith&&b.endsWith('_frei'))b=b.slice(0,-5);return a(b,...r);};}
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){let b=a(s,x,z);if(b==='dorf'&&WLV[s.b+'_frei']){const g=s.dgDone?s.dg:null;if(g&&Math.hypot(x-g.x,z-g.z)<7)b=s.b;}if(!WLV[b+'_frei'])return b;let g=null;if(s.dgDone?s.dg:DG_BIO.has(s.b)){g=dgOf(s);}if(g&&Math.hypot(x-g.x,z-g.z)<13)return b+'_frei';
  if(s.b==='schneeberge'){const c=s.cpDone?s.cp:cryptOf(s);if(c&&Math.hypot(x-c.x,z-c.z)<14)return b+'_frei';}return b;};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(!k||!k.endsWith('_frei'))return k;const b=k.slice(3,-5);if(!AREAS['wl_'+b]&&WLB[b]){AREAS['wl_'+b]=WLB[b].n;AREA_MUSIC['wl_'+b]=WLB[b].mus;}return'wl_'+b;};}
