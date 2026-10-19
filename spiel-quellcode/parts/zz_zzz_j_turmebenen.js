/* =========================================================
   0.0.113 · Die Ebenen des Großen Turms
   - Grundgerüst für bis zu 100 Ebenen (TOWER_LEVELS). Neue Ebenen werden einfach hinten angehängt.
   - Eintritt durch das Turmtor (nur mit Gildenpass). Man wählt jede schon erreichte Ebene.
   - Jede Ebene ist eine runde Halle im Turm (Ø 120 m). Wer den Wächter besiegt, öffnet die Treppe nach oben.
   - Ebene 1: Die Halle der Prüfung
   ========================================================= */
const TOWER_MAX=100;
const TOWER_LEVELS=[];
let TWLM=null;
function twlMats(){if(TWLM)return TWLM;const T=(c,rx,ry)=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return t;};
  const brick=(seed,cols,rune)=>{const p=new Px(32,32),S=pal(cols);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),off=row%2?8:0,seam=y%8===0||(x+off)%16===0;p.set(x,y,S[seam?0:shadeIdx(.55+(hash2((x+off)>>4,row,seed)-.5)*.35+(hash2(x,y,seed+1)-.5)*.2,S.length,x,y)]);if(rune&&row===1&&(x+off)%16===8&&y%8>2&&y%8<6)p.set(x,y,hex('#4ad8f0'));}return p.done();};
  const tiles=(seed,cols)=>{const p=new Px(32,32),S=pal(cols);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const seam=x%16===0||y%16===0;p.set(x,y,S[seam?0:shadeIdx(.55+(hash2(x>>4,y>>4,seed)-.5)*.4+(hash2(x,y,seed+1)-.5)*.18,S.length,x,y)]);}return p.done();};
  const L=m=>new THREE.MeshLambertMaterial({map:m});
  TWLM={wall:L(T(brick(9101,['#1a1a20','#26262e','#34343e','#44444e','#54545e'],1),48,3)),floor:L(T(tiles(9104,['#1c1a1e','#2c2a30','#3a3840','#4a4850']),30,30)),ceil:new THREE.MeshLambertMaterial({color:0x101014}),
    pillar:L(T(brick(9107,['#2a2a32','#3a3a44','#4c4c56','#5e5e68']),1,4)),stone:L(T(tiles(9110,['#3a3a40','#4e4e56','#62626a','#76767e']),1,1)),
    rune:new THREE.MeshBasicMaterial({color:0x4ad8f0}),fire:new THREE.MeshBasicMaterial({color:0xffa030}),iron:new THREE.MeshLambertMaterial({color:0x2a2a30}),gold:new THREE.MeshLambertMaterial({color:0xc8a030}),
    red:new THREE.MeshLambertMaterial({color:0x6a1414}),seal:new THREE.MeshBasicMaterial({color:0x4ad8f0,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false})};return TWLM;}
// Bauhelfer für Ebenen: alles in Turmkoordinaten (lx,lz) relativ zur Turmmitte, Norden = -z
// Jede Ebene liegt an ihrem eigenen Ort (siehe zz_zzz_v_ebenen.js); TWL_O ist die Mitte der aktuellen Ebene
const TWL_O={x:TWC.x,z:TWC.z};
function twlKit(){const M=twlMats(),grp=DGX.grp,X=TWL_O.x,Z=TWL_O.z,Y=DG_Y;
  const K={M,X,Z,Y,grp,
    mesh(geo,mat,lx,y,lz,ry){const m=new THREE.Mesh(geo,mat);m.position.set(X+lx,Y+y,Z+lz);if(ry)m.rotation.y=ry;grp.add(m);return m;},
    box(w,h,d,mat,lx,y,lz,ry,solid){const m=K.mesh(new THREE.BoxGeometry(w,h,d),mat,lx,y+h/2,lz,ry);if(solid){const s=solAdd({x:X+lx,z:Z+lz,hw:w/2,hd:d/2,y0:Y-1,y1:Y+y+h,rot:-(ry||0),solid:1,walk:solid==='walk'?1:0,dg:1});DGX.sol.push(s);m.userData.sol=s;}return m;},
    pillar(lx,lz,r,h){K.mesh(new THREE.CylinderGeometry(r,r*1.1,h,10),M.pillar,lx,h/2,lz);K.mesh(new THREE.BoxGeometry(r*2.6,.6,r*2.6),M.stone,lx,.3,lz);K.mesh(new THREE.BoxGeometry(r*2.6,.6,r*2.6),M.stone,lx,h-.3,lz);DGX.sol.push(solAdd({x:X+lx,z:Z+lz,hw:r*1.1,hd:r*1.1,y0:Y-1,y1:Y+h,rot:0,solid:1,dg:1}));},
    brazier(lx,lz,light){K.mesh(new THREE.CylinderGeometry(.5,.3,1.1,8),M.iron,lx,.55,lz);K.mesh(new THREE.BoxGeometry(.6,.4,.6),M.fire,lx,1.25,lz);DGX.traps.push({fire:1,x:X+lx,z:Z+lz});DGX.sol.push(solAdd({x:X+lx,z:Z+lz,hw:.5,hd:.5,y0:Y-1,y1:Y+1.4,rot:0,solid:1,dg:1}));
      if(light){const l=new THREE.PointLight(0xffa050,1.3,26,1.4);l.position.set(X+lx,Y+3,Z+lz);grp.add(l);}},
    mob(t,lx,lz,o){if(!DT[t])return null;const e=spawnEnt(t,X+lx,Z+lz,Object.assign({home:{x:X+lx,z:Z+lz},cmd:1,aggroT:0},o||{}));if(t==='troll')e.special=mzTrollAI;e.y=Y;e.dormant=true;e.showDormant=true;e.wakeR=(o&&o.wakeR)||14;e.twl=1;DGX.ents.push(e);return e;},
    group(lx,lz,list,rad,wakeR){const out=[];for(const[t,n]of list)for(let i=0;i<n;i++){const a=Math.random()*6.283,d=Math.random()*(rad||4);const e=K.mob(t,lx+Math.cos(a)*d,lz+Math.sin(a)*d,{wakeR});if(e){e.grpH={x:X+lx,z:Z+lz};out.push(e);}}
      for(const e of out)e.mates=out;return out;},
    chest(lx,lz,key,boss){const c=dgChest(X+lx,Z+lz,key,boss);DGX.chests.push(c);return c;}};return K;}
// Gemeinsamer Rahmen jeder Ebene: runde Halle, Startplattform im Süden, versiegelte Treppe im Norden
function twlShell(K,o){const{M,X,Z,Y}=K,R=TWC.R-2,H=o.h||16,seg=64;
  const fl=new THREE.Mesh(new THREE.CircleGeometry(R+1,64),M.floor);fl.rotation.x=-Math.PI/2;fl.position.set(X,Y,Z);K.grp.add(fl);
  const ce=new THREE.Mesh(new THREE.CircleGeometry(R+1,64),M.ceil);ce.rotation.x=Math.PI/2;ce.position.set(X,Y+H,Z);K.grp.add(ce);
  const wall=new THREE.Mesh(new THREE.CylinderGeometry(R+1,R+1,H,seg,1,true),M.wall);wall.material.side=THREE.BackSide;wall.position.set(X,Y+H/2,Z);K.grp.add(wall);
  for(let k=0;k<seg;k++){const a=k/seg*6.283,cw=6.283*(R+1.5)/seg+.4;DGX.sol.push(solAdd({x:X+Math.cos(a)*(R+1.5),z:Z+Math.sin(a)*(R+1.5),hw:1,hd:cw/2,y0:Y-1,y1:Y+H,rot:a,solid:1,dg:1}));}
  for(let k=0;k<3;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(R+.6,.12,4,64),M.rune);t.rotation.x=Math.PI/2;t.position.set(X,Y+3+k*4.5,Z);K.grp.add(t);}
  // Süden: Treppe nach unten (zurück in die Stadt)
  for(let k=0;k<6;k++)K.box(4,.4*(k+1),.8,M.stone,0,0,R-1-k*.8,0,false);K.box(5,.3,5,M.stone,0,0,R-7.5,0,false);DGX.exit={x:X,z:Z+R-2.5};
  K.brazier(-4,R-8,true);K.brazier(4,R-8,false);
  // Norden: versiegelte Treppe nach oben
  for(let k=0;k<8;k++)K.box(5,.45*(k+1),.9,M.stone,0,0,-R+1+k*.9,0,'walk');const up={x:X,z:Z-R+3.5};
  const seal=K.mesh(new THREE.PlaneGeometry(7,7),M.seal,0,3.5,-R+9);const sS=solAdd({x:X,z:Z-R+9,hw:3.6,hd:.4,y0:Y-1,y1:Y+8,rot:0,solid:1,dg:1});DGX.sol.push(sS);
  K.box(1,8,1,M.pillar,-4,0,-R+9,0,true);K.box(1,8,1,M.pillar,4,0,-R+9,0,true);K.box(9,1,1.2,M.pillar,0,8,-R+9,0,false);
  DGX.tw={seal,sS,up,open:false,boss:null,lvl:o.lvl,t:0};}
// Ebene 1 (Die Kalte Tiefe) steht in zz_zzz_jb_hoehle.js
TOWER_LEVELS.push(null);
// =========================================================
// Betreten, Verlassen
// =========================================================
function twlEnter(lvl){const L=TOWER_LEVELS[lvl-1];if(!L){toast('Diese Ebene ist noch versiegelt.');return;}if(P.riding){toast('Steig erst ab');return;}if(dlg)closeDialog();
  if(DGX.on){dgFree();DGX.on=false;}const W=L.W||TWC.R*2+8;Object.assign(TWL_O,lvOrigin(lvl));
  DGX.d={tower:1,lvl,ox:TWL_O.x-W/2,oz:TWL_O.z-W/2,W,st:{},far:L.far||62,hemi:L.hemi||.42,fogC:L.fogC||null,near:L.near||2,bbl:L.bbl||null,g:null};DGX.on=true;DGX.grp=new THREE.Group();scene.add(DGX.grp);DGX.sol=[];DGX.ents=[];DGX.traps=[];DGX.chests=[];DGX.gate=null;DGX.lever=null;
  DGX.light=new THREE.PointLight(0xffb060,1.6,20,1.5);scene.add(DGX.light);
  try{L.build(twlKit());}catch(e){console.error('Turmebene',lvl,e);}
  P.x=DGX.exit.x;P.z=DGX.exit.z-6;P.y=DG_Y+.05;P.vx=P.vy=P.vz=0;P.yaw=0;P.safe=null;curArea=null;setTimeout(checkArea,150);
  if(L.enter)try{L.enter();}catch(e){console.error('Turmebene betreten',e);}
  try{Snd.chime();}catch(e){}setTimeout(()=>{showArea('Ebene '+lvl+': '+L.n);},300);}
{const a=dgLeave;dgLeave=function(dead){const tw=DGX.d&&DGX.d.tower;a(dead);DGX.tw=null;if(tw&&!dead){P.x=TWC.x+TWC.R+9;P.z=TWC.z;P.y=getHeight(P.x,P.z)+.1;P.vx=P.vy=P.vz=0;P.yaw=Math.PI/2*-1;P.safe=[P.x,P.z];}};}
{const a=playerDie;playerDie=function(){const was=DGX.on&&DGX.d&&DGX.d.tower;a();if(was&&state==='dead'){DGX.tw=null;toast('Der Turm hat dich besiegt. Du erwachst wieder draußen.');}};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(k==='in_dungeon'&&DGX.d&&DGX.d.tower)return'in_tower';return k;};}
AREAS.in_tower='Der Große Turm';AREA_MUSIC.in_tower=AREA_MUSIC.in_dungeon||AREA_MUSIC.in_cave||'orte/hoehle';try{WX_NONE.add('in_tower');MAPC.in_tower=[40,40,52];}catch(e){}
// =========================================================
// Takt: Wächter, Siegel, Trupps wecken sich gegenseitig
// =========================================================
function twlTick(dt){const T=DGX.tw;if(!T||!DGX.on)return;
  for(const e of DGX.ents)if(e.mates&&!e.dormant&&!e.dead)for(const m of e.mates)if(m.dormant&&!m.dead){m.dormant=false;}
  if(T.boss&&T.boss.dead&&!T.open){T.open=true;T.sS.off=true;DGX.d.st.boss=1;const F=twF();if(T.lvl>F.max){F.max=T.lvl;}saveGame();
    setTimeout(()=>{showArea('Ebene '+T.lvl+' bezwungen!');if(T.seal&&T.seal.visible)toast('Das Siegel bricht! Der Weg nach oben ist frei, und die große Truhe öffnet sich.');},900);try{Snd.fanfare?Snd.fanfare():Snd.levelUp();}catch(e){}}
  if(T.open&&T.seal.visible){T.t+=dt;T.seal.material.opacity=Math.max(0,.55-T.t*.3);if(T.t>2)T.seal.visible=false;}
  if(T.seal.visible)T.seal.rotation.z+=dt*.2;}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{twlTick(dt);}catch(e){if(!twlTick.err){twlTick.err=1;console.error('Turmebene',e);}}};}
// =========================================================
// Turmtor, Treppe nach oben
// =========================================================
const twDoorNear=()=>!DGX.on&&P.x<60000&&Math.abs(P.y-TWC.H)<6&&Math.hypot(P.x-(TWC.x+TWC.R+2),P.z-TWC.z)<7&&lookingAt(TWC.x+TWC.R+.6,TWC.H+4,TWC.z,11,.45);
const twUpNear=()=>DGX.on&&DGX.tw&&Math.hypot(P.x-DGX.tw.up.x,P.z-DGX.tw.up.z)<4.5&&lookingAt(DGX.tw.up.x,DG_Y+2,DGX.tw.up.z,8,.4);
function twDoorPortrait(){const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d');x.fillStyle='#14141a';x.fillRect(0,0,22,22);x.fillStyle='#3a3a44';x.fillRect(4,3,14,19);x.fillStyle='#0a0a0e';x.fillRect(7,7,8,15);x.fillStyle='#4ad8f0';x.fillRect(10,4,2,2);x.fillRect(5,9,1,1);x.fillRect(16,9,1,1);return c;}
const TW_DOOR={name:'Das Turmtor',role:'Der Große Turm',talk:0};
DIALOGS['Das Turmtor']={start:()=>'hello',nodes:{hello:()=>{const F=twF();if(!F.reg)return{text:'Zwei Turmwachen kreuzen ihre Hellebarden. „Kein Gildenpass, kein Zutritt. Melde dich bei Gildenmeisterin Seraphine im Gildenhaus.“',opts:[{label:'Verstanden.',go:null}]};
    const top=Math.min(F.max+1,TOWER_LEVELS.length,TOWER_MAX),opts=[];for(let l=top;l>=1&&opts.length<6;l--)opts.push({label:`Ebene ${l}: ${TOWER_LEVELS[l-1].n}${l<=F.max?' (bezwungen)':''}`,act:()=>{twlEnter(l);return null;},go:null});
    return{text:`Die Wachen nicken und treten zur Seite. Hinter dem Tor glühen blaue Runen. Du hast ${F.max} von ${TOWER_MAX} Ebenen bezwungen.${F.max>=TOWER_LEVELS.length?' Die Treppen über Ebene '+TOWER_LEVELS.length+' sind noch von einem uralten Siegel versperrt.':''}`,opts:opts.concat([{label:'Später.',go:null}])};}}};
{const a=storyUse;storyUse=function(){if(state==='playing'){if(twDoorNear()){TW_DOOR.portrait=TW_DOOR.portrait||twDoorPortrait();openDialog(TW_DOOR);return true;}
    if(twUpNear()){const T=DGX.tw;if(!T.open){toast('Ein Runensiegel versperrt die Treppe. Besiege erst den Wächter dieser Ebene.');return true;}
      const n=T.lvl+1;if(TOWER_LEVELS[n-1]){twlEnter(n);}else{toast(`Über Ebene ${T.lvl} ist alles still. Die nächste Ebene ist noch versiegelt.`);dgLeave(false);}return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(twDoorNear())return'Das Turmtor';if(twUpNear())return DGX.tw.open?'Nach oben steigen':'Versiegelte Treppe';if(DGX.on&&DGX.d&&DGX.d.tower&&DGX.exit&&Math.hypot(DGX.exit.x-P.x,DGX.exit.z-P.z)<3.2)return'Zurück in die Stadt';return a();};}
// /turmebene <n> (Cheat-Modus)
HELP.push(['/turmebene <n>','Direkt in Ebene n des Großen Turms (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/turmebene\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/turmebene geht nur im Cheat-Modus.','err');return;}const n=parseInt(t.split(/\s+/)[1]||'1',10);if(!TOWER_LEVELS[n-1]){conLog(`Ebene ${n} gibt es noch nicht (bisher ${TOWER_LEVELS.length}).`,'err');return;}closeConsole();twlEnter(n);conLog(`Ebene ${n}: ${TOWER_LEVELS[n-1].n}`,'ok');return;}return a(raw);};}
