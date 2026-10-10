/* =========================================================
   MAGIE · Die Zauber
   Kosten (mana/hp) und Abklingzeiten (cd) sind VORLÄUFIG.
   ========================================================= */
const cpos=c=>{const o=c.caster||P;return{x:o.x,y:o.y,z:o.z};};
const cfwd=(c,d)=>({x:c.o.x+c.d.x*d,y:c.o.y+c.d.y*d,z:c.o.z+c.d.z*d});
const cflat=c=>{const l=Math.hypot(c.d.x,c.d.z)||1;return{x:c.d.x/l,z:c.d.z/l};};
const cHand=c=>{const f=cflat(c),sd=settings.hand==='left'?-1:1;return{x:c.o.x+c.d.x*.75-f.z*.24*sd,y:c.o.y-.3+c.d.y*.75,z:c.o.z+c.d.z*.75+f.x*.24*sd};};
function cGround(c,max){let x=c.o.x,y=c.o.y,z=c.o.z;for(let s=0;s<max;s+=.4){x=c.o.x+c.d.x*s;y=c.o.y+c.d.y*s;z=c.o.z+c.d.z*s;const g=groundAt(x,z,y+1);if(y<=g)return{x,y:g,z,hit:true};}return{x,y:groundAt(x,z,y+1),z,hit:false};}
// Punkt vor dem Zaubernden auf dem Boden (für Wände, Blüte …)
function cAhead(c,d){const f=cflat(c),p=cpos(c),x=p.x+f.x*d,z=p.z+f.z*d;return{x,y:groundAt(x,z,p.y+3),z};}
// Ziel: lokal per Zielhilfe, beim Mitspieler aus der Nachricht
function cTarget(c,range,cos){if(c.own){const t=magAim(range,cos);if(t){c.x=magCenter(t).map(v=>+v.toFixed(2));c.tg=t;}else c.x=null;return t;}return null;}
const cTargetPos=c=>c.tg?magCenter(c.tg):c.x?c.x:null;
// sichere kurze Teleportation in Blickrichtung
function magDash(dist){const f={x:-Math.sin(P.yaw),z:-Math.cos(P.yaw)};let x=P.x,z=P.z,y=P.y;
  if(P.x>60000&&P.x<CAVE_X0-400){toast('Das geht hier drinnen nicht.');return false;}
  for(let s=.3;s<=dist;s+=.3){const nx=P.x+f.x*s,nz=P.z+f.z*s,g=groundAt(nx,nz,y+1.2);if(g>y+1.3)break;if(P.x>CAVE_X0-400&&caveSolid(nx,nz))break;
    if(nx<60000){const t={x:nx,z:nz};collideTreesObj(t,.3);if(Math.hypot(t.x-nx,t.z-nz)>.05)break;}if(collTopAt(nx,nz,y+1.5)>y+1.3)break;x=nx;z=nz;y=Math.max(g,collTopAt(nx,nz,y+.5));}
  if(Math.hypot(x-P.x,z-P.z)<.6)return false;P.x=x;P.z=z;P.y=Math.max(groundAt(x,z,y+1),y);P.vx=P.vz=0;if(P.vy<0)P.vy=0;return true;}
function healMe(n){const S=P.stats;if(state==='dead')return;S.hp=Math.min(S.maxHp,S.hp+n);renderStats();}
function healAlly(e,n){if(isClient()||e.dead)return;e.hp=Math.min(e.max||e.hp+n,e.hp+n);}
// Gegner in einem Kegel vor dem Zaubernden
function coneFoes(c,range,cos){const p=c.o,out=[];for(const o of magFoesAt(p.x,p.y,p.z,range)){const[tx,,tz]=magCenter(o),dx=tx-p.x,dz=tz-p.z,l=Math.hypot(dx,dz)||1,f=cflat(c);if((dx*f.x+dz*f.z)/l>cos)out.push(o);}return out;}
function magSegDist(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,l2=vx*vx+vz*vz||1;let k=((px-ax)*vx+(pz-az)*vz)/l2;k=Math.max(0,Math.min(1,k));return Math.hypot(px-ax-vx*k,pz-az-vz*k);}
// Aura: Partikel um den Zaubernden, solange ein Effekt läuft
function auraZone(c,dur,fn,key){return magZone({kind:'aura',key,x:0,z:0,r:1,life:dur,ctx:c,follow:()=>{const o=c.caster;return o?{x:o.x,y:o.y,z:o.z}:null;},tick:fn});}
function fireLight(x,y,z,dur,I,dist){return magLight({x,y,z,col:0xff8a30,I:I||1.8,dist:dist||10,until:time+dur,flick:1});}

/* ===================== FEUER ===================== */
const fireTrail=(p,dt,big)=>{const n=big?3:1;for(let i=0;i<n;i++)spark({x:p.x+(Math.random()-.5)*.1,y:p.y+(Math.random()-.5)*.1,z:p.z+(Math.random()-.5)*.1,vx:(Math.random()-.5)*.6,vy:.6+Math.random()*.6,vz:(Math.random()-.5)*.6,life:big?.5:.28,s:big?.42:.16,s1:.04,c:mpick(MPAL.fire),c1:'#5a1a08',add:true});
  if(big&&Math.random()<.5)spark({x:p.x,y:p.y,z:p.z,vy:.8,life:1,s:.25,s1:.5,c:mpick(MPAL.smoke),add:false,a:.5});
  if(big)spark({x:p.x,y:p.y,z:p.z,life:.06,s:.7,s1:.6,c:'#ffd860',add:true,a:.8});};
// Flamme: teils deckend (satte Farben auch am Tag), teils leuchtend
function flame(x,y,z,vx,vy,vz,life,sz){const glow=Math.random()<.4;spark({x,y,z,vx,vy,vz,life,s:sz,s1:sz*.15,c:glow?mpick(['#fff3a0','#ffcc33']):mpick(['#ff8a1f','#ff5a10','#e83a08','#ffb020']),c1:glow?'#ff5a10':'#7a1a06',add:glow,a:glow?.9:.85,drag:.8});}
function fireBoom(x,y,z,k){mburst(x,y+.3*k,z,Math.round(16*k),{cols:['#ffffff','#fff3a0'],spd:1.2*k,life:.22,s:1.3*k,s1:.4*k,add:true,drag:4});
  mburst(x,y+.3*k,z,Math.round(70*k),{cols:MPAL.fire,spd:4.5*k,up:1.2,life:.8,s:.55*k,s1:.12,c1:'#801e08',add:true,drag:3});
  mburst(x,y+.3*k,z,Math.round(30*k),{cols:['#ffcc33','#ff8a1f'],spd:9*k,up:2,life:.6,s:.12,s1:.03,add:true,g:9,drag:1});
  mburst(x,y+.5*k,z,Math.round(26*k),{cols:MPAL.smoke,spd:2*k,up:1.4,life:1.6,s:.5*k,s1:1.2*k,add:false,a:.55,drag:2});}
defSpell('funken',{el:'fire',name:'Funkenschuss',desc:'Kleines, schnelles Feuergeschoss. Wenig Schaden, kurze Abklingzeit.',mana:6,cd:.35,
  cast(c){const h=cHand(c);magSnd('fire',h.x,h.z,.5);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*32,vy:c.d.y*32,vz:c.d.z*32,life:1.1,r:.25,el:'fire',ctx:c,trail:p=>fireTrail(p),
    hit(p,o){mburst(p.x,p.y,p.z,10,{cols:MPAL.fire,spd:2.5,life:.35,s:.12,add:true});if(o){magHurt(o,10,'fire',c);if(Math.random()<.3)magFx(o,'burn',3,{dps:4},c);}}});}});
defSpell('feuerball',{el:'fire',name:'Feuerball',desc:'Langsames Geschoss, das beim Aufprall explodiert. Flächenschaden, Gegner fangen an zu brennen.',mana:22,cd:1.6,
  cast(c){const h=cHand(c);magSnd('whoosh',h.x,h.z,.8);const L=fireLight(h.x,h.y,h.z,3,1.6,9);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*19,vy:c.d.y*19+1,vz:c.d.z*19,g:3,life:2.6,r:.45,el:'fire',ctx:c,
    trail:p=>{fireTrail(p,0,true);L.x=p.x;L.y=p.y;L.z=p.z;},
    hit(p){L.kill=1;magSnd('boom',p.x,p.z);fireLight(p.x,p.y+.5,p.z,.6,3,14);
      fireBoom(p.x,p.y,p.z,1);
      ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,.5,24,{cols:MPAL.fire,spd:6,life:.45,s:.2,add:true});
      if(Math.hypot(P.x-p.x,P.z-p.z)<9)magShake(.12,.35);
      for(const o of magFoesAt(p.x,p.y,p.z,3.2)){const d=Math.hypot(o.x-p.x,o.z-p.z);magHurt(o,32*(1-Math.min(.6,d/5)),'fire',c);magFx(o,'burn',4,{dps:6},c);const l=d||1;magPush(o,(o.x-p.x)/l*3,(o.z-p.z)/l*3,c);}}});}});
defSpell('atem',{el:'fire',name:'Flammenatem',desc:'Feuerkegel vor dir, solange du die Taste hältst. Kostet Mana pro Sekunde.',mana:4,chan:1,chanCost:14,cd:.4,
  start(c){c.L=fireLight(c.o.x,c.o.y,c.o.z,999,1.8,9);c.snd=0;},
  tick(c,dt){const h=cHand(c);c.L.x=h.x+c.d.x*2;c.L.y=h.y;c.L.z=h.z+c.d.z*2;c.L.until=time+.3;
    if(magNear(h.x,h.z))for(let i=0;i<Math.ceil(dt*140);i++){const sp=8+Math.random()*3,a=(Math.random()-.5)*.5,b=(Math.random()-.5)*.35,f=cflat(c);
      const dx=c.d.x+f.z*a,dz=c.d.z-f.x*a,dy=c.d.y+b;spark({x:h.x,y:h.y,z:h.z,vx:dx*sp,vy:dy*sp+.5,vz:dz*sp,life:.5+Math.random()*.15,s:.08,s1:.55,c:mpick(['#fff3a0','#ffcc33','#ff8a1f']),c1:'#a01e08',add:true,drag:1.2});
      if(Math.random()<.15)spark({x:h.x+dx*4,y:h.y+dy*4+.3,z:h.z+dz*4,vx:dx*2,vy:1.4,vz:dz*2,life:1,s:.3,s1:.8,c:mpick(MPAL.smoke),add:false,a:.35});}
    c.snd-=dt;if(c.snd<=0){c.snd=.32;magSnd('fire',h.x,h.z,.6);}
    c.acc=(c.acc||0)+dt;if(c.acc>=.25&&c.own){c.acc=0;for(const o of coneFoes(c,5.8,.78)){magHurt(o,7,'fire',c);magFx(o,'burn',2.5,{dps:5},c);}}},
  stop(c){if(c.L)c.L.kill=1;}});
defSpell('glut',{el:'fire',name:'Glutspur',desc:'Beim Laufen hinterlässt du für ein paar Sekunden brennenden Boden.',mana:18,cd:12,
  cast(c){magSnd('fire',c.o.x,c.o.z);if(c.own)magBuff('ember',10);let lx=null,lz=null;
    auraZone(c,10,(z,dt)=>{if(lx==null){lx=z.x;lz=z.z;}if(Math.random()<dt*14)spark({x:z.x+(Math.random()-.5)*.5,y:z.y+.1,z:z.z+(Math.random()-.5)*.5,vy:1,life:.4,s:.12,c:mpick(MPAL.fire),add:true});
      if(Math.hypot(z.x-lx,z.z-lz)>.9){lx=z.x;lz=z.z;const px=z.x,pz=z.z;magZone({kind:'fire',x:px,z:pz,r:.8,life:4,ctx:c,
        tick(q,dt){if(magNear(q.x,q.z)&&Math.random()<dt*20)flame(q.x+(Math.random()-.5)*1.1,q.y+.05,q.z+(Math.random()-.5)*1.1,0,1.3+Math.random(),0,.55,.22);
          q.acc=(q.acc||0)+dt;if(q.acc>.5&&c.own){q.acc=0;for(const o of magFoesAt(q.x,q.y+.5,q.z,q.r)){magHurt(o,5,'fire',c);magFx(o,'burn',2,{dps:4},c);}}}});}});}});
defSpell('feuerwand',{el:'fire',name:'Feuerwand',desc:'Eine Flammenmauer am Boden. Wer durchläuft, brennt. Tiere laufen nicht hindurch.',mana:30,cd:10,
  cast(c){const m=cAhead(c,5),f=cflat(c),L=7;magSnd('fire',m.x,m.z,1.2);magSnd('whoosh',m.x,m.z);
    const ax=m.x-f.z*L/2,az=m.z+f.x*L/2,bx=m.x+f.z*L/2,bz=m.z-f.x*L/2,l1=fireLight(ax*.7+bx*.3,m.y+1,az*.7+bz*.3,10,1.8,10),l2=fireLight(ax*.3+bx*.7,m.y+1,az*.3+bz*.7,10,1.8,10);
    magZone({kind:'fire',x:m.x,z:m.z,r:L/2+.5,life:10,ctx:c,ax,az,bx,bz,
      tick(q,dt){const k=Math.min(1,q.t*3)*Math.min(1,(q.life-q.t)*1.5);if(magNear(q.x,q.z))for(let i=0;i<Math.ceil(dt*90*k);i++){const u=Math.random(),x=ax+(bx-ax)*u,z=az+(bz-az)*u,y=groundAt(x,z,m.y+3);
          flame(x+(Math.random()-.5)*.3,y+Math.random()*.4,z+(Math.random()-.5)*.3,0,2.4+Math.random()*1.8,0,.55+Math.random()*.35,.34);
          if(Math.random()<.05)spark({x,y:y+2,z,vy:1.2,life:1.4,s:.4,s1:.9,c:mpick(MPAL.smoke),add:false,a:.3});}
        q.acc=(q.acc||0)+dt;if(q.acc>=.4){q.acc=0;for(const o of magTargetsAt(q.x,m.y+1,q.z,q.r+1)){if(magSegDist(o.x,o.z,ax,az,bx,bz)>1.6)continue;
          if(o.kind==='animal'||o.kind==='wild'){const s=((o.x-q.x)*f.x+(o.z-q.z)*f.z)<0?-1:1;magPush(o,f.x*s*4,f.z*s*4,c);magFx(o,'fear',1.2,{x:q.x-f.x*s,z:q.z-f.z*s},c);}
          if(magSegDist(o.x,o.z,ax,az,bx,bz)<1&&magFoe(o)){magHurt(o,8,'fire',c);magFx(o,'burn',3,{dps:6},c);}}}},
      end(){l1.kill=l2.kill=1;}});}});
defSpell('hitze',{el:'fire',name:'Überhitzen',desc:'10 Sekunden lang machen deine Zauber +50 % Schaden. Danach bist du kurz erschöpft: keine Mana-Erholung.',mana:25,cd:40,
  cast(c){magSnd('fire',c.o.x,c.o.z,1.2);const p=cpos(c);mburst(p.x,p.y+1,p.z,40,{cols:MPAL.fire,spd:4,up:1,life:.7,s:.2,add:true});
    if(c.own){magBuff('overheat',10,{onEnd:()=>{magBuff('exhaust',8);toast('Du bist erschöpft – kein Mana für kurze Zeit');}});magScreen('radial-gradient(ellipse at center,rgba(255,120,20,0) 50%,rgba(255,90,10,.4) 100%)',1,1);}
    auraZone(c,10,(z,dt)=>{if(Math.random()<dt*30){const a=Math.random()*6.283;spark({x:z.x+Math.cos(a)*.45,y:z.y+Math.random()*1.6,z:z.z+Math.sin(a)*.45,vy:1.4,life:.5,s:.12,s1:.02,c:mpick(MPAL.fire),add:true});}});}});
defSpell('meteor',{el:'fire',name:'Meteor',big:1,desc:'Großer Zauber. Ein Kreis zeigt die Stelle, 2 Sekunden später schlägt ein brennender Brocken ein und hinterlässt einen Krater.',mana:60,cd:30,noIndoor:1,
  cast(c){const g=cGround(c,38),f=cflat(c),sx=g.x+f.x*16-f.z*6,sz=g.z+f.z*16+f.x*6,sy=g.y+30;magSnd('fire',g.x,g.z,.6);
    magZone({kind:'meteor',x:g.x,z:g.z,y:g.y,r:5,life:2,ctx:c,ring:magRing(g.x,g.z,5,'#ff5a1f',{top:1}),
      tick(q,dt){const k=q.t/2,x=sx+(g.x-sx)*k,y=sy+(g.y-sy)*k*k,z=sz+(g.z-sz)*k;q.ring.material.opacity=.4+.4*Math.sin(time*14);
        for(let i=0;i<5;i++)spark({x:x+(Math.random()-.5)*.6,y:y+(Math.random()-.5)*.6,z:z+(Math.random()-.5)*.6,vy:.5,life:.6,s:.9,s1:.1,c:mpick(MPAL.fire),c1:'#5a1a08',add:true});
        spark({x,y,z,vy:1,life:2,s:.8,s1:2,c:mpick(MPAL.smoke),add:false,a:.45});spark({x,y,z,life:.05,s:1.8,s1:1.6,c:'#ffe080',add:true});
        if(!q.L)q.L=fireLight(x,y,z,2.2,3,22);q.L.x=x;q.L.y=y;q.L.z=z;if(q.t>1.4&&!q.w){q.w=1;magSnd('whoosh',g.x,g.z,1.5);}},
      end(q){if(q.L)q.L.kill=1;magSnd('bigboom',g.x,g.z);fireLight(g.x,g.y+1,g.z,.8,4,26);const d=Math.hypot(P.x-g.x,P.z-g.z);if(d<25)magShake(.45*(1-d/25)+.05,1);
        fireBoom(g.x,g.y,g.z,2.4);
        mburst(g.x,g.y+.3,g.z,40,{cols:MPAL.earth,spd:9,up:5,life:1.4,s:.18,g:14,add:false});ringFx(g.x,g.y,g.z,1,48,{cols:MPAL.fire,spd:14,life:.6,s:.3,add:true});
        for(const o of magFoesAt(g.x,g.y+1,g.z,5.5)){const dd=Math.hypot(o.x-g.x,o.z-g.z),l=dd||1;magHurt(o,85*(1-Math.min(.6,dd/8)),'fire',c);magFx(o,'burn',5,{dps:7},c);magPush(o,(o.x-g.x)/l*6,(o.z-g.z)/l*6,c,1);}
        magZone({kind:'fire',x:g.x,z:g.z,r:2.6,life:6,ctx:c,L:fireLight(g.x,g.y+.8,g.z,6,2,12),
          tick(z,dt){if(magNear(z.x,z.z))for(let i=0;i<Math.ceil(dt*50);i++){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*z.r;flame(z.x+Math.cos(a)*r,z.y+.05,z.z+Math.sin(a)*r,0,1.4+Math.random()*1.5,0,.6,.26);}
            z.acc=(z.acc||0)+dt;if(z.acc>.5&&c.own){z.acc=0;for(const o of magFoesAt(z.x,z.y+.5,z.z,z.r)){magHurt(o,6,'fire',c);magFx(o,'burn',2,{dps:5},c);}}}});}});}});
defSpell('lagerfeuer',{el:'fire',name:'Lagerfeuer entzünden',desc:'Zündet ein magisches Lagerfeuer an (wärmt, leuchtet) und heizt einen Schmelzofen in der Nähe auf – ganz ohne Feuerstein.',mana:8,cd:3,
  cast(c){const g=cGround(c,4.5),p=g.hit?g:cAhead(c,2);magSnd('fire',p.x,p.z);
    if(c.own)for(const f of FURN)if(f.type==='furnace'&&Math.hypot(f.x-p.x,f.z-p.z)<4){try{const S=furnState(f.key);S.heat=(S.heat||0)+4;toast('Der Schmelzofen glüht auf.');}catch(e){}}
    mburst(p.x,p.y+.3,p.z,25,{cols:MPAL.fire,spd:2.5,up:1.5,life:.6,s:.16,add:true});
    magZone({kind:'campfire',x:p.x,z:p.z,r:1,life:120,ctx:c,L:fireLight(p.x,p.y+.9,p.z,120,1.7,12),
      tick(z,dt){if(!magNear(z.x,z.z,60))return;for(let i=0;i<Math.ceil(dt*36);i++)flame(z.x+(Math.random()-.5)*.45,z.y+.05,z.z+(Math.random()-.5)*.45,0,1.2+Math.random()*1.2,0,.6,.24);
        if(Math.random()<dt*3)spark({x:z.x,y:z.y+1.2,z:z.z,vx:(Math.random()-.5)*.3,vy:.9,vz:(Math.random()-.5)*.3,life:2.5,s:.25,s1:.7,c:mpick(MPAL.smoke),add:false,a:.3});
        if(Math.random()<dt*2)spark({x:z.x,y:z.y+.4,z:z.z,vx:(Math.random()-.5),vy:2.5,vz:(Math.random()-.5),life:1.2,s:.05,c:'#ffcc33',add:true});
        if(Math.random()<dt*2){magSnd('fire',z.x,z.z,.15);}
        if(magInRain(z.x,z.z))z.t+=dt*10;}});}});

/* ===================== WASSER ===================== */
function waterBeamEnd(c,max){let end=null;for(let s=.6;s<max;s+=.4){const x=c.o.x+c.d.x*s,y=c.o.y+c.d.y*s,z=c.o.z+c.d.z*s;if(y<=groundAt(x,z,y+1)){end={x,y,z,s};break;}}
  if(!end)end={x:c.o.x+c.d.x*max,y:c.o.y+c.d.y*max,z:c.o.z+c.d.z*max,s:max};return end;}
function douse(x,z,r){for(const q of MAG.zones)if((q.kind==='fire'||q.kind==='campfire')&&Math.hypot(q.x-x,q.z-z)<r+q.r)q.t=Math.max(q.t,q.life-.3);}
defSpell('wasserstrahl',{el:'water',name:'Wasserstrahl',desc:'Dauerstrahl, der Gegner zurückdrückt. Löscht Feuer – auch wenn du selbst brennst.',mana:3,chan:1,chanCost:10,cd:.3,
  start(c){c.snd=0;if(c.own)P.burnT=0;},
  tick(c,dt){const h=cHand(c),e=waterBeamEnd(c,9.5);if(magNear(h.x,h.z))for(let i=0;i<Math.ceil(dt*110);i++){const k=Math.random(),sp=13;
      spark({x:h.x+(e.x-h.x)*k*.15,y:h.y+(e.y-h.y)*k*.15,z:h.z+(e.z-h.z)*k*.15,vx:c.d.x*sp+(Math.random()-.5),vy:c.d.y*sp+(Math.random()-.5)+.3,vz:c.d.z*sp+(Math.random()-.5),g:5,life:Math.min(.75,e.s/sp+.08),s:.09,s1:.2,c:mpick(MPAL.water),add:true,drag:.4,a:.85});}
    if(Math.random()<dt*25)spark({x:e.x,y:e.y+.1,z:e.z,vx:(Math.random()-.5)*3,vy:1.5+Math.random()*2,vz:(Math.random()-.5)*3,g:9,life:.5,s:.1,c:mpick(MPAL.water),add:true});
    c.snd-=dt;if(c.snd<=0){c.snd=.4;magSnd('water',h.x,h.z,.7);}douse(e.x,e.z,1.5);
    c.acc=(c.acc||0)+dt;if(c.acc>=.2&&c.own){c.acc=0;P.burnT=0;for(const o of magFoesAt((h.x+e.x)/2,(h.y+e.y)/2,(h.z+e.z)/2,e.s/2+.8)){if(magSegDist(o.x,o.z,h.x,h.z,e.x,e.z)>.9)continue;
      magHurt(o,1.3,'water',c);const f=cflat(c);magPush(o,f.x*3.5,f.z*3.5,c);if(o._mg)delete o._mg.burn;}}}});
defSpell('eissplitter',{el:'water',name:'Eissplitter',desc:'Drei kleine Eisgeschosse im Fächer. Verlangsamen die Getroffenen.',mana:12,cd:.9,
  cast(c){const h=cHand(c);magSnd('ice',h.x,h.z);for(const a of[-.12,0,.12]){const ca=Math.cos(a),sa=Math.sin(a),dx=c.d.x*ca-c.d.z*sa,dz=c.d.x*sa+c.d.z*ca;
    magShoot({x:h.x,y:h.y,z:h.z,vx:dx*27,vy:c.d.y*27,vz:dz*27,life:1,r:.22,el:'water',ctx:c,
      trail:p=>{spark({x:p.x,y:p.y,z:p.z,life:.18,s:.18,s1:.05,c:mpick(MPAL.ice),add:true});if(Math.random()<.4)spark({x:p.x,y:p.y,z:p.z,vy:-.3,life:.5,s:.06,c:'#ffffff',add:true});},
      hit(p,o){mburst(p.x,p.y,p.z,12,{cols:MPAL.ice,spd:3,life:.4,s:.1,add:true,g:6});if(o){magHurt(o,11,'water',c);magFx(o,'slow',3,null,c);}}});}}});
defSpell('frostnova',{el:'water',name:'Frostnova',desc:'Eisring um dich herum: friert nahe Gegner 2–3 Sekunden ein.',mana:24,cd:9,
  cast(c){const p=cpos(c),y=groundAt(p.x,p.z,p.y+1);magSnd('ice',p.x,p.z,1.3);
    for(let r=.6;r<5;r+=.55)ringFx(p.x,y,p.z,r,Math.round(r*9),{cols:MPAL.ice,spd:1.5,up:.6,life:.45+r*.06,s:.18,add:true});
    mburst(p.x,y+.8,p.z,30,{cols:['#ffffff','#e0f6ff'],spd:6,flat:1,life:.6,s:.12,add:true});
    magZone({kind:'frost',x:p.x,z:p.z,r:5,life:3,ctx:c,ring:magRing(p.x,p.z,5,'#9cd4ff',{op:.5}),tick(q,dt){q.ring.material.opacity=.5*(1-q.t/3);if(Math.random()<dt*20){const a=Math.random()*6.283,r=Math.random()*5;spark({x:q.x+Math.cos(a)*r,y:q.y+.1,z:q.z+Math.sin(a)*r,vy:.2,life:.8,s:.1,c:'#ffffff',add:true});}}});
    for(const o of magFoesAt(p.x,p.y+1,p.z,5)){magHurt(o,10,'water',c);magFx(o,'freeze',2.6,null,c);if(o._mg&&o._mg.burn)delete o._mg.burn;}}});
defSpell('flutwelle',{el:'water',name:'Flutwelle',desc:'Eine Welle rollt nach vorne, nimmt Gegner mit und wirft sie um.',mana:30,cd:10,noIndoor:1,
  cast(c){const p=cpos(c),f=cflat(c);magSnd('water',p.x,p.z,1.5);const hitS=new Set();
    magZone({kind:'wave',x:p.x+f.x,z:p.z+f.z,r:2.8,life:1.5,ctx:c,
      tick(q,dt){q.x+=f.x*9*dt;q.z+=f.z*9*dt;const y=groundAt(q.x,q.z,q.y+3);q.y=y;douse(q.x,q.z,2.8);
        if(magNear(q.x,q.z))for(let i=0;i<Math.ceil(dt*340);i++){const u=(Math.random()-.5)*5.4,x=q.x-f.z*u,z=q.z+f.x*u,gy=groundAt(x,z,y+3),hgt=Math.random()*1.9*(1-Math.abs(u)/3.4);
          const top=hgt>1;spark({x,y:gy+hgt,z,vx:f.x*9+(Math.random()-.5),vy:1.5+Math.random()*2,vz:f.z*9+(Math.random()-.5),g:7,life:.45,s:top?.3:.45,s1:.15,c:mpick(top?['#ffffff','#e0f6ff']:['#3a8cff','#1a4ec8','#7ac4ff','#2a6ad8']),add:false,a:top?.9:.75});}
        if(!c.own)return;for(const o of magFoesAt(q.x,q.y+1,q.z,3.2)){if(hitS.has(o))continue;const lat=Math.abs((o.x-q.x)*-f.z+(o.z-q.z)*f.x);if(lat>2.9)continue;hitS.add(o);
          magHurt(o,15,'water',c);magPush(o,f.x*7,f.z*7,c,1.2);if(o._mg)delete o._mg.burn;}}});}});
defSpell('eisbruecke',{el:'water',name:'Eisbrücke',desc:'Über Wasser entsteht für 30 Sekunden ein begehbarer Eisweg in Blickrichtung.',mana:26,cd:15,noIndoor:1,
  check(c){const f=cflat(c),p=cpos(c);for(let s=1;s<22;s+=.8){const x=p.x+f.x*s,z=p.z+f.z*s;if(getHeight(x,z)<WATER-.15)return true;}toast('Hier ist kein Wasser in Blickrichtung.');return false;},
  cast(c){const f=cflat(c),p=cpos(c),yaw=Math.atan2(f.x,f.z);let first=null,last=null;
    for(let s=.6;s<24;s+=.6){const x=p.x+f.x*s,z=p.z+f.z*s,wet=getHeight(x,z)<WATER-.1;if(wet){if(first==null)first=s;last=s;}else if(first!=null&&s-last>1.5)break;}
    if(first==null)return;const a=Math.max(.3,first-1.2),b=last+1.4,len=b-a,top=WATER+.12,meshes=[],seg=1.6;magSnd('ice',p.x,p.z,1.4);
    for(let s=a;s<b;s+=seg){const L=Math.min(seg,b-s),x=p.x+f.x*(s+L/2),z=p.z+f.z*(s+L/2),m=magBlock(x,top-.35,z,1.9,.35,L+.02,yaw,'ice',.88);m.userData={y:top-.35+.175,h:.6};meshes.push(m);
      mburst(x,top,z,10,{cols:MPAL.ice,spd:2,up:1,life:.5,s:.12,add:true});}
    const cx=p.x+f.x*(a+len/2),cz=p.z+f.z*(a+len/2);
    MAG.walls.push({x:cx,z:cz,y:top,yaw,hw:.95,hd:len/2,top,walk:true,life:30,meshes,rise:0,
      end(w){for(const m of w.meshes)mburst(m.position.x,top,m.position.z,12,{cols:MPAL.ice,spd:2,life:.6,s:.12,add:true,g:6});magSnd('ice',cx,cz,.8);}});}});
defSpell('stroemung',{el:'water',name:'Strömung',desc:'20 Sekunden lang schwimmst du doppelt so schnell.',mana:15,cd:25,
  cast(c){const p=cpos(c);magSnd('water',p.x,p.z);mburst(p.x,p.y+.5,p.z,30,{cols:MPAL.water,spd:3,up:.5,life:.6,s:.12,add:true});if(c.own)magBuff('stream',20);
    auraZone(c,20,(z,dt)=>{const wet=z.y<WATER;if(Math.random()<dt*(wet?25:5)){const a=Math.random()*6.283;spark({x:z.x+Math.cos(a)*.5,y:z.y+.2+Math.random()*.8,z:z.z+Math.sin(a)*.5,vx:-Math.sin(a)*1.5,vy:wet?.8:.2,vz:Math.cos(a)*1.5,life:.5,s:.08,c:mpick(MPAL.water),add:true});}});}});
defSpell('blasenschild',{el:'water',name:'Blasenschild',desc:'Eine Wasserblase schluckt 40 Schaden (20 Sekunden lang).',mana:20,cd:18,
  cast(c){const p=cpos(c);magSnd('bubble',p.x,p.z,1.2);if(c.own)magBuff('bubble',20,{hp:40});
    auraZone(c,20,(z,dt)=>{if(c.own&&!MAG.fx.bubble){z.kill=1;return;}if(!magNear(z.x,z.z,60))return;for(let i=0;i<Math.ceil(dt*30);i++){const a=Math.random()*6.283,b=Math.acos(Math.random()*2-1);
      spark({x:z.x+Math.sin(b)*Math.cos(a)*.85,y:z.y+.95+Math.cos(b)*1,z:z.z+Math.sin(b)*Math.sin(a)*.85,life:.35,s:.07,c:mpick(['#c4ecff','#7ac4ff','#ffffff']),add:true,a:.55});}},'bubble');}});
let magRainEl=null;
defSpell('regenruf',{el:'water',name:'Regenruf',big:1,desc:'Großer Zauber. Lässt es in der Gegend regnen: Pflanzen wachsen nach, Feuer gehen aus, Feuermagie wird schwächer, Wassermagie stärker.',mana:50,cd:60,noIndoor:1,
  cast(c){const p=cpos(c);magSnd('water',p.x,p.z,1.5);mburst(p.x,p.y+2,p.z,40,{cols:MPAL.water,spd:2,up:4,life:1.2,s:.15,add:true});
    magZone({kind:'rain',x:p.x,z:p.z,r:45,life:90,ctx:c,
      tick(q,dt){const cam=camera.position,inside=Math.hypot(cam.x-q.x,cam.z-q.z)<q.r;
        if(inside){const k=Math.min(1,q.t/3)*Math.min(1,(q.life-q.t)/3);for(let i=0;i<Math.ceil(dt*260*k);i++){const x=cam.x+(Math.random()-.5)*28,z=cam.z+(Math.random()-.5)*28,y=cam.y+6+Math.random()*6;
            spark({x,y,z,vx:-.8,vy:-22,vz:.4,life:Math.max(.15,(y-groundAt(x,z,y))/22),s:.045,s1:.045,c:'#b8d0e8',add:false,a:.55});}
          for(let i=0;i<Math.ceil(dt*40*k);i++){const x=cam.x+(Math.random()-.5)*18,z=cam.z+(Math.random()-.5)*18;spark({x,y:groundAt(x,z,cam.y+3)+.05,z,vy:1.2,g:8,life:.2,s:.06,c:'#d8ecff',add:false,a:.6});}
          if(!magRainEl){magRainEl=document.createElement('div');magRainEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;background:rgba(40,60,90,.18);transition:opacity 2s;opacity:0';document.body.appendChild(magRainEl);}
          magRainEl.style.opacity=k.toFixed(2);if(Math.random()<dt*.5)magSnd('water',null,null,.12);}
        else if(magRainEl)magRainEl.style.opacity=0;
        if(Math.hypot(P.x-q.x,P.z-q.z)<q.r){P.burnT=0;}douse(q.x,q.z,q.r);
        q.acc=(q.acc||0)+dt;if(q.acc>5&&!isClient()){q.acc=0;const now=gameMinutes();for(const pk of pickups)if(!pk.active&&pk.regrowAt&&Math.hypot(pk.x-q.x,pk.z-q.z)<q.r)pk.regrowAt=Math.min(pk.regrowAt,now+20);}},
      end(){if(magRainEl&&!MAG.zones.some(z=>z.kind==='rain'&&z.t<z.life))magRainEl.style.opacity=0;}});}});

/* ===================== NATUR / ERDE ===================== */
defSpell('dornen',{el:'nature',name:'Dornenranke',desc:'Ranken schießen aus dem Boden und halten einen Gegner 3 Sekunden fest.',mana:14,cd:5,
  cast(c){const t=cTarget(c,16,.88),tp=cTargetPos(c),g=tp?{x:tp[0],y:groundAt(tp[0],tp[2],tp[1]+1),z:tp[2]}:cGround(c,16);magSnd('leaf',g.x,g.z,1.2);magSnd('earth',g.x,g.z,.5);
    if(t){magHurt(t,8,'nature',c);magFx(t,'root',3,null,c);}
    magZone({kind:'vine',x:g.x,z:g.z,y:g.y,r:1,life:3,ctx:c,tick(q,dt){if(!magNear(q.x,q.z))return;const k=Math.min(1,q.t*3);
      for(let i=0;i<Math.ceil(dt*50);i++){const v=(Math.random()*4)|0,a=v*1.57+q.t*1.5,h=Math.random()*1.7*k,r=.55-h*.18;spark({x:q.x+Math.cos(a+h*2)*r,y:q.y+h,z:q.z+Math.sin(a+h*2)*r,life:.35,s:.13,c:mpick(['#3a9a28','#1e6a1a','#6ad83a']),add:false});
        if(Math.random()<.08)spark({x:q.x+Math.cos(a)*r,y:q.y+h,z:q.z+Math.sin(a)*r,life:.4,s:.09,c:'#e8d0a0',add:false});}}});
    mburst(g.x,g.y+.2,g.z,18,{cols:MPAL.earth,spd:3,up:2,life:.6,s:.12,g:9,add:false});}});
defSpell('steinwurf',{el:'nature',name:'Steinwurf',desc:'Ein schwerer, langsamer Brocken, der im Bogen fliegt. Viel Schaden.',mana:16,cd:2.2,
  cast(c){const h=cHand(c);magSnd('earth',h.x,h.z,.6);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*20,vy:c.d.y*20+3,vz:c.d.z*20,g:10,life:3,r:.4,el:'nature',ctx:c,
    trail:p=>{spark({x:p.x,y:p.y,z:p.z,life:.05,s:.55,s1:.5,c:'#7e705a',add:false});spark({x:p.x+(Math.random()-.5)*.25,y:p.y+(Math.random()-.5)*.25,z:p.z+(Math.random()-.5)*.25,life:.05,s:.3,c:mpick(['#9a8a70','#6a5c48']),add:false});
      if(Math.random()<.6)spark({x:p.x,y:p.y,z:p.z,vy:-.5,g:6,life:.6,s:.08,c:mpick(MPAL.earth),add:false});},
    hit(p,o){magSnd('earth',p.x,p.z,1.2);mburst(p.x,p.y+.2,p.z,30,{cols:['#9a8a70','#7e705a','#544838'],spd:5,up:2,life:.9,s:.16,g:12,add:false});mburst(p.x,p.y+.3,p.z,14,{cols:MPAL.smoke,spd:2,life:1,s:.3,s1:.6,add:false,a:.4});
      if(o){magHurt(o,38,'nature',c);const l=Math.hypot(p.vx,p.vz)||1;magPush(o,p.vx/l*4,p.vz/l*4,c,.5);}
      else for(const q of magFoesAt(p.x,p.y+.5,p.z,1.3))magHurt(q,18,'nature',c);}});}});
defSpell('erdwall',{el:'nature',name:'Erdwall',desc:'Eine Steinmauer wächst aus dem Boden – Deckung für 15 Sekunden.',mana:28,cd:12,noIndoor:1,
  cast(c){const m=cAhead(c,3.5),f=cflat(c),yaw=Math.atan2(f.x,f.z),L=6,meshes=[];magSnd('earth',m.x,m.z,1.5);magShake(.06,.4);
    for(let i=0;i<3;i++){const u=(i-1)*2,x=m.x-f.z*u,z=m.z+f.x*u,y=groundAt(x,z,m.y+3),mm=magBlock(x,y-.3,z,2.05,2.5,.9,yaw,'stone');mm.userData={y:y-.3+1.25,h:2.6};mm.position.y-=2.6;meshes.push(mm);
      mburst(x,y+.3,z,18,{cols:MPAL.earth,spd:4,up:3,life:.8,s:.14,g:12,add:false});mburst(x,y+.4,z,6,{cols:MPAL.smoke,spd:1.5,life:1.2,s:.4,s1:.8,add:false,a:.35});}
    MAG.walls.push({x:m.x,z:m.z,y:m.y,yaw,hw:L/2,hd:.45,top:m.y+2.2,solid:true,walk:true,life:15,meshes,rise:0,
      end(w){for(const mm of w.meshes)mburst(mm.position.x,m.y+.5,mm.position.z,14,{cols:MPAL.earth,spd:3,up:2,life:.8,s:.14,g:10,add:false});magSnd('earth',m.x,m.z,.8);}});}});
defSpell('rinde',{el:'nature',name:'Rindenhaut',desc:'15 Sekunden lang bekommst du 40 % weniger Schaden, bist aber etwas langsamer.',mana:18,cd:30,
  cast(c){const p=cpos(c);magSnd('earth',p.x,p.z,.6);magSnd('leaf',p.x,p.z);mburst(p.x,p.y+1,p.z,30,{cols:['#6e5030','#9a7448','#3a9a28'],spd:2.5,life:.7,s:.14,add:false});if(c.own)magBuff('bark',15);
    auraZone(c,15,(z,dt)=>{if(Math.random()<dt*14){const a=Math.random()*6.283;spark({x:z.x+Math.cos(a)*.42,y:z.y+.1+Math.random()*1.5,z:z.z+Math.sin(a)*.42,vy:.15,life:.7,s:.12,c:mpick(['#6e5030','#9a7448','#544838','#3a9a28']),add:false});}});}});
defSpell('wachstum',{el:'nature',name:'Wachstum',desc:'Gefällte Bäume, abgeerntete Sträucher und Pilze in der Nähe wachsen sofort nach.',mana:25,cd:20,noIndoor:1,
  cast(c){const p=cpos(c),R=12;magSnd('leaf',p.x,p.z,1.4);magSnd('heal',p.x,p.z,.5);let n=0;const pop=(x,z)=>{const y=groundAt(x,z,p.y+5);mburst(x,y+.6,z,16,{cols:MPAL.bloom.concat(MPAL.nature),spd:2,up:2,life:1,s:.13,add:true});};
    ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,1,30,{cols:MPAL.nature,spd:8,life:.9,s:.16,add:true});
    if(!isClient()){
      const F=FLAGS.felled||{};for(const[k,t]of TREEOBJ){if(F[k]==null||Math.hypot(t.x-p.x,t.z-p.z)>R)continue;delete F[k];if(t.broken)unfell(t);const d=TREEDECO.get(k);if(d&&d._stump)unstumpDeco(d);pop(t.x,t.z);n++;}
      if(typeof HGONE!=='undefined'&&FLAGS.harv)for(const b of [...HGONE]){if(Math.hypot(b.x-p.x,b.z-p.z)>R)continue;delete FLAGS.harv[b._hk];try{hvBack(b);}catch(e){}pop(b.x,b.z);n++;}
      let pk=0;for(const q of pickups)if(!q.active&&q.regrowAt&&Math.hypot(q.x-p.x,q.z-p.z)<R){q.regrowAt=0;pk++;pop(q.x,q.z);n++;}if(pk){regrowT=0;regrowPickups(1);}
      if(c.own)toast(n?`${n} Pflanze${n>1?'n':''} sind nachgewachsen`:'Hier gibt es nichts nachwachsen zu lassen.');}
    for(let i=0;i<60;i++){const a=Math.random()*6.283,r=Math.random()*R,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;spark({x,y:groundAt(x,z,p.y+4)+.1,z,vy:1+Math.random(),life:1.2,s:.1,c:mpick(MPAL.nature.concat(MPAL.bloom)),add:true,a:.8});}}});
defSpell('bluete',{el:'nature',name:'Heilende Blüte',desc:'Eine Blume am Boden heilt alle in ihrer Nähe langsam (auch Mitspieler und Begleiter).',mana:26,cd:15,
  cast(c){const g=cGround(c,6),p=g.hit?g:cAhead(c,1.5);magSnd('heal',p.x,p.z,.8);
    magZone({kind:'bloom',x:p.x,z:p.z,r:4,life:12,ctx:c,ring:magRing(p.x,p.z,4,'#6ad83a',{op:.35}),L:magLight({x:p.x,y:p.y+1,z:p.z,col:0xa8ff8a,I:1,dist:7,until:time+12}),
      tick(q,dt){const k=Math.min(1,q.t*2);if(magNear(q.x,q.z)){for(let i=0;i<5;i++){const a=i*1.2566+q.t*.6,r=.35*k;spark({x:q.x+Math.cos(a)*r,y:q.y+.45*k,z:q.z+Math.sin(a)*r,life:.06,s:.32*k,c:i%2?'#ff7ab8':'#ffb0d8',add:false});}
          spark({x:q.x,y:q.y+.47*k,z:q.z,life:.06,s:.22*k,c:'#fff07a',add:false});for(let i=0;i<3;i++)spark({x:q.x+(Math.random()-.5)*.1,y:q.y+i*.14*k,z:q.z,life:.06,s:.12,c:'#3a9a28',add:false});
          if(Math.random()<dt*14){const a=Math.random()*6.283,r=Math.random()*q.r;spark({x:q.x+Math.cos(a)*r,y:q.y+.1,z:q.z+Math.sin(a)*r,vy:.9,life:1.3,s:.1,c:mpick(['#b8ff7a','#e8ffb0','#ffb0d8']),add:true});}}
        q.acc=(q.acc||0)+dt;if(q.acc>=.5){q.acc=0;if(Math.hypot(P.x-q.x,P.z-q.z)<q.r&&P.stats.hp<P.stats.maxHp){healMe(3*lvK(c));spark({x:P.x,y:P.y+1.8,z:P.z,vy:.8,life:.7,s:.14,c:'#6ad83a',add:true});}
          for(const e of magAllies(q.x,q.z,q.r))healAlly(e,4);}}});}});
defSpell('tierfreund',{el:'nature',name:'Tierfreund',desc:'Wilde Tiere in der Nähe werden für eine Minute friedlich. Wölfe kämpfen kurz sogar an deiner Seite.',mana:20,cd:30,
  cast(c){const p=cpos(c);magSnd('leaf',p.x,p.z);magSnd('chime',p.x,p.z,.6);ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,.8,40,{cols:MPAL.bloom,spd:10,life:1,s:.14,add:true});
    let n=0;for(const o of magTargetsAt(p.x,p.y+1,p.z,20)){if(o.kind==='animal'||o.kind==='wild'){magFx(o,'calm',60,null,c);n++;}}
    if(!isClient())for(const e of DEM)if(!e.dead&&e.fac==='demon'&&(e.type==='wolfd')&&Math.hypot(e.x-p.x,e.z-p.z)<20){e.fac='ally';e.tame=1;const j=HOSTILES.indexOf(e);if(j>=0)HOSTILES.splice(j,1);e.tgt=null;n++;
      setTimeout(()=>{if(!e.dead&&DEM.includes(e)){e.fac='demon';e.tame=0;HOSTILES.push(e);}},30000);mburst(e.x,e.y+1,e.z,14,{cols:MPAL.bloom,spd:2,up:1,life:.8,s:.12,add:true});}
    if(c.own)toast(n?`${n} Tier${n>1?'e':''} beruhigt`:'Keine Tiere in der Nähe.');}});
defSpell('erdbeben',{el:'nature',name:'Erdbeben',big:1,desc:'Großer Zauber. Der Boden bebt: Gegner im Umkreis fallen um. In Höhlen glitzert Erz in der Nähe kurz auf.',mana:55,cd:40,
  cast(c){const p=cpos(c),R=10;magSnd('rumble',p.x,p.z,1.5);if(Math.hypot(P.x-p.x,P.z-p.z)<30)magShake(.22,1.6);
    magZone({kind:'quake',x:p.x,z:p.z,r:R,life:1.6,ctx:c,tick(q,dt){if(!magNear(q.x,q.z))return;for(let i=0;i<Math.ceil(dt*90);i++){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*R,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r,y=groundAt(x,z,q.y+4);
      spark({x,y:y+.05,z,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,vz:(Math.random()-.5)*2,g:14,life:.7,s:.13,c:mpick(MPAL.earth),add:false});if(Math.random()<.15)spark({x,y:y+.2,z,vy:.6,life:1.6,s:.5,s1:1.1,c:mpick(['#9a8a70','#7a716a']),add:false,a:.3});}}});
    for(const o of magFoesAt(p.x,p.y+1,p.z,R)){if(o.d&&o.d.fly)continue;magHurt(o,22,'nature',c);magFx(o,'stun',2,null,c);}
    if(caveCur&&P.x>CAVE_X0-400&&caveCur.D&&caveCur.D.deps){const C=caveCur;let n=0;for(const d of C.D.deps){if(d.x==null||(C.save&&C.save.mined&&C.save.mined[d.j]))continue;if(Math.hypot(d.x-p.x,d.z-p.z)>22)continue;n++;
      magZone({kind:'glint',x:d.x,z:d.z,y:d.wy,r:.5,life:5,ctx:c,tick(q,dt){if(Math.random()<dt*10)spark({x:q.x+(Math.random()-.5)*.6,y:q.y+(Math.random()-.5)*.6,z:q.z+(Math.random()-.5)*.6,life:.5,s:.16,c:'#fff07a',add:true});}});}
      if(c.own&&n)toast(`${n} Erzadern glitzern auf`);}}});
defSpell('wurzelweg',{el:'nature',name:'Wurzelweg',desc:'Du tauchst in den Boden ein und kommst 8 Meter weiter wieder heraus.',mana:18,cd:6,
  cast(c){const a=cpos(c);mburst(a.x,a.y+.2,a.z,26,{cols:MPAL.earth.concat(['#3a9a28']),spd:3,up:2,life:.7,s:.15,g:10,add:false});magSnd('earth',a.x,a.z);
    if(c.own){if(!magDash(8))return;}const b=c.own?{x:P.x,y:P.y,z:P.z}:null;
    setTimeout(()=>{const q=b||cpos(c);mburst(q.x,q.y+.2,q.z,30,{cols:MPAL.earth.concat(['#3a9a28','#6ad83a']),spd:4,up:3,life:.8,s:.15,g:10,add:false});magSnd('leaf',q.x,q.z);},c.own?0:120);}});

/* ===================== DUNKLE MAGIE ===================== */
defSpell('schattenpfeil',{el:'dark',name:'Schattenpfeil',desc:'Ein Geschoss, das durch Gegner hindurchfliegt und bis zu drei trifft.',mana:14,cd:1.2,
  cast(c){const h=cHand(c);magSnd('dark',h.x,h.z,.6);magSnd('whoosh',h.x,h.z,.5);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*28,vy:c.d.y*28,vz:c.d.z*28,life:1.2,r:.3,pierce:2,el:'dark',ctx:c,
    trail:p=>{spark({x:p.x,y:p.y,z:p.z,life:.25,s:.32,s1:.05,c:mpick(['#0a0410','#24083e','#4a1a8a']),add:false});spark({x:p.x,y:p.y,z:p.z,life:.12,s:.2,c:'#b07aff',add:true,a:.7});
      if(Math.random()<.5)spark({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5),vy:(Math.random()-.5),vz:(Math.random()-.5),life:.6,s:.1,c:mpick(MPAL.dark),add:false});},
    hit(p,o){mburst(p.x,p.y,p.z,o?14:20,{cols:MPAL.dark,spd:3,life:.5,s:.15,add:false});if(o)magHurt(o,20,'dark',c);else magSnd('dark',p.x,p.z,.4);}});}});
function darkLine(c,tp){const h=cHand(c);lineFx(h.x,h.y,h.z,tp[0],tp[1],tp[2],{cols:MPAL.dark,dens:6,life:.45,s:.12,add:false,jit:.2});lineFx(h.x,h.y,h.z,tp[0],tp[1],tp[2],{cols:['#b07aff'],dens:2,life:.3,s:.08,add:true});}
defSpell('schwaeche',{el:'dark',name:'Fluch der Schwäche',desc:'Der Gegner macht 15 Sekunden lang 30 % weniger Schaden.',mana:14,cd:6,
  check(c){if(!magAim(18,.86)){toast('Kein Ziel – schau einen Gegner an.');return false;}return true;},
  cast(c){const t=cTarget(c,18,.86),tp=cTargetPos(c);if(!tp)return;magSnd('dark',tp[0],tp[2]);darkLine(c,tp);if(t)magFx(t,'weak',15,null,c);
    for(let i=0;i<24;i++){const a=i/24*6.283;spark({x:tp[0]+Math.cos(a)*.6,y:tp[1]+.6,z:tp[2]+Math.sin(a)*.6,vx:-Math.cos(a)*.8,vy:-.6,vz:-Math.sin(a)*.8,life:.8,s:.14,c:mpick(MPAL.dark),add:false});}}});
defSpell('furcht',{el:'dark',name:'Furcht',desc:'Gegner in einem Kegel vor dir laufen 4 Sekunden lang panisch davon.',mana:22,cd:14,
  cast(c){const h=cHand(c),f=cflat(c);magSnd('dark',h.x,h.z,1.3);
    for(let i=0;i<70;i++){const a=(Math.random()-.5)*1.4,sp=6+Math.random()*4,dx=f.x*Math.cos(a)-f.z*Math.sin(a),dz=f.x*Math.sin(a)+f.z*Math.cos(a);
      spark({x:h.x,y:h.y,z:h.z,vx:dx*sp,vy:(Math.random()-.4)*2,vz:dz*sp,life:.8,s:.12,s1:.45,c:mpick(['#24083e','#4a1a8a','#0a0410']),add:false,drag:1.5,a:.75});}
    for(const o of coneFoes(c,8.5,.5))magFx(o,'fear',4,{x:cpos(c).x,z:cpos(c).z},c);}});
defSpell('skelett',{el:'dark',name:'Skelett erwecken',desc:'Aus einem besiegten Gegner (oder Knochen aus deinem Inventar) steht ein Skelett auf und kämpft 60 Sekunden für dich.',mana:30,cd:20,
  check(c){const s=skelSpot();if(!s){toast('Kein Leichnam in der Nähe – und keine Knochen im Inventar.');return false;}return true;},
  cast(c){let s=c.own?skelSpot():null;if(c.own){c.x=[+s.x.toFixed(2),0,+s.z.toFixed(2)];if(s.bones)removeItem('bones',1),renderInv();if(s.corpse)s.corpse._raised=1;}
    const x=c.own?s.x:c.x?c.x[0]:cpos(c).x,z=c.own?s.z:c.x?c.x[2]:cpos(c).z,y=groundAt(x,z,1e4);magSnd('dark',x,z,1.2);
    magZone({kind:'raise',x,z,y,r:1,life:1.2,ctx:c,ring:magRing(x,z,1.4,'#7a3ad8',{op:.6}),tick(q,dt){for(let i=0;i<4;i++){const a=Math.random()*6.283;spark({x:q.x+Math.cos(a)*.7,y:q.y+.1,z:q.z+Math.sin(a)*.7,vx:-Math.cos(a)*.5,vy:2+Math.random()*2,vz:-Math.sin(a)*.5,life:.7,s:.14,c:mpick(MPAL.dark),add:Math.random()<.4});}}});
    if(c.own)magSummon('mag_skel',x,z,60);}});
function skelSpot(){for(const e of DEM)if(e.dead&&!e._raised&&!e.d.boss&&Math.hypot(e.x-P.x,e.z-P.z)<10)return{x:e.x,z:e.z,corpse:e};
  for(const a of animals)if(!a.alive&&!a._raised&&Math.hypot(a.x-P.x,a.z-P.z)<10)return{x:a.x,z:a.z,corpse:a};
  if(inv.some(s=>s&&s.id==='bones')){const f=cflat({d:lookDir()});return{x:P.x+f.x*2,z:P.z+f.z*2,bones:1};}return null;}
defSpell('schattenschritt',{el:'dark',name:'Schattenschritt',desc:'Du wirst 3 Sekunden unsichtbar und springst 6 Meter durch die Schatten nach vorne.',mana:20,cd:10,
  cast(c){const a=cpos(c);mburst(a.x,a.y+1,a.z,40,{cols:['#0a0410','#24083e','#4a1a8a'],spd:3,life:.9,s:.25,s1:.6,add:false,a:.8});magSnd('tp',a.x,a.z);
    if(c.own){magDash(6);magBuff('shade',3);for(const e of DEM)if(e.tgt==='player'){e.tgt=null;e.tgtT=1;}}
    const b=c.own?{x:P.x,y:P.y,z:P.z}:null;setTimeout(()=>{const q=b||cpos(c);mburst(q.x,q.y+1,q.z,30,{cols:['#0a0410','#24083e','#7a3ad8'],spd:3,life:.8,s:.22,s1:.5,add:false,a:.8});},50);}});
defSpell('seelenernte',{el:'dark',name:'Seelenernte',desc:'20 Sekunden lang gibt dir jeder besiegte Gegner in der Nähe 15 Mana zurück.',mana:15,cd:30,
  cast(c){const p=cpos(c);magSnd('dark',p.x,p.z);mburst(p.x,p.y+1,p.z,30,{cols:MPAL.dark,spd:2,up:1,life:.8,s:.14,add:true});if(c.own)magBuff('harvest',20);
    auraZone(c,20,(z,dt)=>{if(Math.random()<dt*8){const a=time*3+Math.random();spark({x:z.x+Math.cos(a)*.8,y:z.y+1.6+Math.sin(time*2)*.2,z:z.z+Math.sin(a)*.8,life:.6,s:.13,c:mpick(['#b07aff','#7a3ad8','#a8ff5a']),add:true});}});}});
let magDarkEl=null;
defSpell('finsternis',{el:'dark',name:'Finsternis',desc:'Eine schwarze Wolke (10 s). Gegner darin sehen nichts und greifen niemanden an. Mit Nachtsicht siehst du trotzdem.',mana:30,cd:18,
  cast(c){const g=cGround(c,20);magSnd('dark',g.x,g.z,1.2);
    magZone({kind:'dark',x:g.x,z:g.z,y:g.y,r:5,life:10,ctx:c,
      tick(q,dt){const k=Math.min(1,q.t*2)*Math.min(1,(q.life-q.t)*1.5);if(magNear(q.x,q.z))for(let i=0;i<Math.ceil(dt*170*k);i++){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*q.r;
          spark({x:q.x+Math.cos(a)*r,y:q.y+.1+Math.random()*2.8,z:q.z+Math.sin(a)*r,vx:(Math.random()-.5)*.4,vy:.1,vz:(Math.random()-.5)*.4,life:1.4,s:.9,s1:1.8,c:mpick(['#0a0410','#14081e','#24083e','#2e0c4a']),add:false,a:.75});}
          if(Math.random()<dt*8){const a=Math.random()*6.283,r=Math.random()*q.r;spark({x:q.x+Math.cos(a)*r,y:q.y+.5+Math.random()*2,z:q.z+Math.sin(a)*r,life:.5,s:.08,c:'#b07aff',add:true});}
        const inside=Math.hypot(P.x-q.x,P.z-q.z)<q.r&&!(P.mods&&P.mods.nightVis);
        if(!magDarkEl){magDarkEl=document.createElement('div');magDarkEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse at center,rgba(10,4,16,.55) 0%,rgba(6,2,10,.92) 70%);opacity:0;transition:opacity .5s';document.body.appendChild(magDarkEl);}
        if(inside)q.in=1;magDarkEl.style.opacity=MAG.zones.some(z=>z.kind==='dark'&&z.t<z.life&&Math.hypot(P.x-z.x,P.z-z.z)<z.r)&&!(P.mods&&P.mods.nightVis)?(.9*k).toFixed(2):0;
        q.acc=(q.acc||0)+dt;if(q.acc>.3&&c.own){q.acc=0;for(const o of magFoesAt(q.x,q.y+1,q.z,q.r))magFx(o,'blind',.8,null,c);}},
      end(){if(magDarkEl&&!MAG.zones.some(z=>z.kind==='dark'&&z.t<z.life-.1&&Math.hypot(P.x-z.x,P.z-z.z)<z.r))magDarkEl.style.opacity=0;}});}});
defSpell('verderbnis',{el:'dark',name:'Verderbnis',big:1,desc:'Großer Zauber. Ein Gegner wird verflucht und verliert Leben. Stirbt er, springt der Fluch auf den nächsten Gegner über.',mana:45,cd:25,
  check(c){if(!magAim(20,.86)){toast('Kein Ziel – schau einen Gegner an.');return false;}return true;},
  cast(c){const t=cTarget(c,20,.86),tp=cTargetPos(c);if(!tp)return;magSnd('dark',tp[0],tp[2],1.4);darkLine(c,tp);
    mburst(tp[0],tp[1],tp[2],40,{cols:['#24083e','#7a3ad8','#a8ff5a'],spd:3,life:.9,s:.16,add:false});if(t)magFx(t,'curse',10,{dps:9,jumps:4},c);}});
function magDeathHook(o,M){const C=M.curse;if(!C||!C.own||C.until<=time||!(C.jumps>0))return;const[x,y,z]=magCenter(o);
  const n=magFoesAt(x,y,z,10).filter(q=>q!==o&&!magHasFx(q,'curse')).sort((a,b)=>Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z))[0];if(!n)return;
  const[nx,ny,nz]=magCenter(n);lineFx(x,y,z,nx,ny,nz,{cols:['#24083e','#7a3ad8','#a8ff5a'],dens:8,life:.6,s:.14,add:false,jit:.3});magSnd('dark',nx,nz,.8);
  magFx(n,'curse',10,{dps:C.dps,jumps:C.jumps-1},{own:true});}

/* ===================== BLUTMAGIE ===================== */
defSpell('blutpfeil',{el:'blood',name:'Blutpfeil',desc:'Kostet 5 Leben statt Mana und macht dafür viel Schaden.',hp:5,mana:0,cd:1,
  cast(c){const h=cHand(c);magSnd('blood',h.x,h.z,.8);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*34,vy:c.d.y*34,vz:c.d.z*34,life:1,r:.25,el:'blood',ctx:c,
    trail:p=>{spark({x:p.x,y:p.y,z:p.z,life:.15,s:.26,s1:.06,c:mpick(['#e0182a','#a00c1c']),add:false});if(Math.random()<.7)spark({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5),vy:0,vz:(Math.random()-.5),g:9,life:.5,s:.07,c:mpick(MPAL.blood),add:false});},
    hit(p,o){mburst(p.x,p.y,p.z,18,{cols:MPAL.blood,spd:3.5,up:1,life:.6,s:.1,g:10,add:false});if(o)magHurt(o,34,'blood',c);}});}});
defSpell('lebensraub',{el:'blood',name:'Lebensraub',desc:'Ein Strahl zieht einem Gegner Leben ab und gibt es dir (solange du die Taste hältst).',mana:3,chan:1,chanCost:6,cd:.4,
  start(c){c.snd=0;c.tt=0;},
  tick(c,dt){c.tt-=dt;if(c.own&&c.tt<=0){c.tt=.3;const t=magAim(11,.82);c.tg=t;c.x=t?magCenter(t).map(v=>+v.toFixed(2)):null;}const h=cHand(c),tp=c.tg&&!magDead(c.tg)?magCenter(c.tg):c.x;
    if(!tp){if(Math.random()<dt*20)spark({x:h.x+c.d.x*.4,y:h.y,z:h.z+c.d.z*.4,vx:c.d.x*3,vy:c.d.y*3,vz:c.d.z*3,life:.3,s:.08,c:mpick(MPAL.blood),add:false});return;}
    if(magNear(h.x,h.z))for(let i=0;i<Math.ceil(dt*70);i++){const k=Math.random();spark({x:tp[0]+(h.x-tp[0])*k+(Math.random()-.5)*.15,y:tp[1]+(h.y-tp[1])*k+Math.sin(k*Math.PI)*.3,z:tp[2]+(h.z-tp[2])*k+(Math.random()-.5)*.15,
      vx:(h.x-tp[0])*1.4,vy:(h.y-tp[1])*1.4,vz:(h.z-tp[2])*1.4,life:.25,s:.11,c:mpick(['#ff3a4a','#e0182a','#a00c1c']),add:Math.random()<.4});}
    c.snd-=dt;if(c.snd<=0){c.snd=.5;magSnd('blood',h.x,h.z,.4);}
    c.acc=(c.acc||0)+dt;if(c.acc>=.25&&c.own&&c.tg){c.acc=0;magHurt(c.tg,3,'blood',c);healMe(3*lvK(c));}}});
defSpell('blutopfer',{el:'blood',name:'Blutopfer',desc:'Du opferst 20 % deines Lebens und bekommst dafür sofort volles Mana.',hp:()=>Math.round(P.stats.maxHp*.2),mana:0,cd:20,
  cast(c){const p=cpos(c);magSnd('blood',p.x,p.z,1.2);magSnd('chime',p.x,p.z,.5);mburst(p.x,p.y+1,p.z,40,{cols:MPAL.blood,spd:3,life:.8,s:.14,add:false,g:4});
    if(c.own){P.stats.mp=P.stats.maxMp;renderStats();}for(let i=0;i<30;i++){const a=i/30*6.283;spark({x:p.x+Math.cos(a)*1.2,y:p.y+.3+i*.05,z:p.z+Math.sin(a)*1.2,vx:-Math.cos(a)*1.2,vy:.8,vz:-Math.sin(a)*1.2,life:1,s:.13,c:i%2?'#e0182a':'#4a8cff',c1:'#4a8cff',add:true});}}});
defSpell('aderlass',{el:'blood',name:'Aderlass',desc:'Der Gegner blutet 12 Sekunden lang. Jede Bewegung kostet ihn Leben, Stillstehen nicht.',mana:12,cd:8,
  check(c){if(!magAim(16,.86)){toast('Kein Ziel – schau einen Gegner an.');return false;}return true;},
  cast(c){const t=cTarget(c,16,.86),tp=cTargetPos(c);if(!tp)return;const h=cHand(c);magSnd('blood',tp[0],tp[2]);lineFx(h.x,h.y,h.z,tp[0],tp[1],tp[2],{cols:MPAL.blood,dens:5,life:.35,s:.1,add:false});
    mburst(tp[0],tp[1],tp[2],22,{cols:MPAL.blood,spd:3,up:1,g:10,life:.7,s:.1,add:false});if(t)magFx(t,'bleed',12,null,c);}});
defSpell('blutrausch',{el:'blood',name:'Blutrausch',desc:'15 Sekunden lang: Je weniger Leben du hast, desto mehr Schaden machst du (Zauber und Waffen).',hp:10,mana:0,cd:30,
  cast(c){const p=cpos(c);magSnd('blood',p.x,p.z,1.2);magSnd('dark',p.x,p.z,.5);mburst(p.x,p.y+1,p.z,40,{cols:MPAL.blood,spd:4,life:.7,s:.14,add:false});if(c.own)magBuff('rage',15);
    auraZone(c,15,(z,dt)=>{if(Math.random()<dt*16){const a=Math.random()*6.283;spark({x:z.x+Math.cos(a)*.45,y:z.y+.2+Math.random()*1.4,z:z.z+Math.sin(a)*.45,vy:1.2,life:.5,s:.12,s1:.02,c:mpick(['#ff3a4a','#e0182a','#600610']),add:Math.random()<.5});}});}});
defSpell('blutband',{el:'blood',name:'Blutband',desc:'Verbindet dich 30 Sekunden mit einem Mitspieler oder Begleiter: Den Schaden, den du bekommst, teilt ihr euch.',mana:15,cd:20,
  check(c){if(!bandTarget()){toast('Schau einen Mitspieler oder Begleiter an.');return false;}return true;},
  cast(c){let tg=null;if(c.own){tg=bandTarget();c.x=tg.pid?['p',tg.pid]:['e',+tg.x.toFixed(2),+tg.z.toFixed(2)];magBuff('band',30,tg.pid?{ally:'remote',pid:tg.pid}:{ally:tg});}
    const who=()=>{if(c.own)return tg.pid?REMOTE.get(tg.pid):tg;if(c.x&&c.x[0]==='p')return c.x[1]===MP.pid?P:REMOTE.get(c.x[1]);return c.x?{x:c.x[1],y:groundAt(c.x[1],c.x[2],1e4),z:c.x[2]}:null;};
    const p=cpos(c);magSnd('blood',p.x,p.z);magSnd('chime',p.x,p.z,.4);
    magZone({kind:'band',x:p.x,z:p.z,r:1,life:30,ctx:c,follow:()=>c.caster,tick(q,dt){if(c.own&&!MAG.fx.band){q.kill=1;return;}const o=who();if(!o||!magNear(q.x,q.z))return;
      if(Math.random()<dt*25){const k=Math.random();spark({x:q.x+(o.x-q.x)*k,y:q.y+1.1+(o.y-q.y)*k+Math.sin(k*Math.PI)*.4,z:q.z+(o.z-q.z)*k,life:.3,s:.09,c:mpick(['#ff3a4a','#e0182a']),add:true,a:.7});}}});}});
function bandTarget(){const R=typeof remoteLooked==='function'&&MP.on?remoteLooked():null;if(R)return{pid:R.pid,x:R.x,z:R.z};
  let best=null,bs=.85;const e0=magEye(),d=lookDir();for(const e of magAllies(P.x,P.z,14)){const dx=e.x-e0.x,dy=e.y+e.h*.5-e0.y,dz=e.z-e0.z,l=Math.hypot(dx,dy,dz)||1,s=(dx*d.x+dy*d.y+dz*d.z)/l;if(s>bs){bs=s;best=e;}}return best;}
defSpell('blutgolem',{el:'blood',name:'Blutgolem',big:1,desc:'Großer Zauber. Du opferst ein Drittel deines Lebens, dafür erscheint ein Golem aus Blut. Je mehr Leben du gibst, desto stärker ist er.',hp:()=>Math.max(10,Math.round(P.stats.hp*.33)),mana:0,cd:45,
  cast(c){const g=cAhead(c,3),spent=c.own?Math.max(10,Math.round(P.stats.hp*.33/.67)):30;magSnd('blood',g.x,g.z,1.5);magSnd('rumble',g.x,g.z,.6);
    magZone({kind:'raise',x:g.x,z:g.z,y:g.y,r:1,life:1.4,ctx:c,ring:magRing(g.x,g.z,1.8,'#a00c1c',{op:.7}),tick(q,dt){for(let i=0;i<6;i++){const a=Math.random()*6.283,r=Math.random()*.9;
      spark({x:q.x+Math.cos(a)*r,y:q.y+.1,z:q.z+Math.sin(a)*r,vy:3+Math.random()*3,life:.6,s:.18,c:mpick(['#e0182a','#a00c1c','#600610']),add:false,g:3});}}});
    if(c.own)magSummon('mag_golem',g.x,g.z,45,{hp:Math.round(80+spent*8),dmg:Math.round(12+spent*.3)});}});
defSpell('blutleben',{el:'blood',name:'Wiederbelebung durch Blut',desc:'Ein am Boden liegender Begleiter steht sofort wieder auf. Kostet dich die Hälfte deines Lebens.',hp:()=>Math.round(P.stats.hp*.5),mana:0,cd:40,
  check(c){if(!downedAlly()){toast('Kein Begleiter liegt in der Nähe am Boden.');return false;}return true;},
  cast(c){const e=c.own?downedAlly():null;if(e)c.x=[+e.x.toFixed(2),+(e.y+1).toFixed(2),+e.z.toFixed(2)];const tp=c.x;if(!tp)return;const h=cHand(c);magSnd('blood',tp[0],tp[2],1.2);magSnd('heal',tp[0],tp[2],.7);
    lineFx(h.x,h.y,h.z,tp[0],tp[1],tp[2],{cols:MPAL.blood,dens:6,life:.6,s:.13,add:false,jit:.2});mburst(tp[0],tp[1],tp[2],50,{cols:['#ff3a4a','#e0182a','#fff8d8'],spd:3,up:2,life:1,s:.14,add:true});
    if(e&&!isClient()){e.down=0;e.hp=Math.round((e.max||100)*.6);e.downT=0;}}});
function downedAlly(){let best=null,bd=12;for(const e of DEM)if(e.fac==='ally'&&!e.dead&&e.down>0){const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd){bd=d;best=e;}}return best;}

/* ===================== LICHT ===================== */
defSpell('heilung',{el:'light',name:'Heilung',desc:'Heilt dich – oder den Mitspieler bzw. Begleiter, den du anschaust – um 35 Leben.',mana:20,cd:4,
  cast(c){let tp=null;if(c.own){const R=MP.on&&typeof remoteLooked==='function'?remoteLooked():null;
      if(R){const peer=[...MP.peerPid].find(([,p])=>p===R.pid);if(peer)mpSend({t:'magheal',n:Math.round(35*lvK(c)),from:P.char&&P.char.name},peer[0]);tp=[R.x,R.y+1,R.z];}
      else{const b=bandTarget();if(b&&!b.pid){healAlly(b,35*lvK(c));tp=[b.x,b.y+1,b.z];}else{healMe(35*lvK(c));tp=null;}}c.x=tp?tp.map(v=>+v.toFixed(2)):null;}else tp=c.x;
    const p=tp?{x:tp[0],y:tp[1]-1,z:tp[2]}:cpos(c);magSnd('heal',p.x,p.z);if(tp){const h=cHand(c);lineFx(h.x,h.y,h.z,tp[0],tp[1],tp[2],{cols:MPAL.light,dens:5,life:.4,s:.1,add:true});}
    for(let i=0;i<40;i++){const a=i/40*6.283*2;spark({x:p.x+Math.cos(a)*.6,y:p.y+i*.045,z:p.z+Math.sin(a)*.6,vx:-Math.sin(a)*.5,vy:.6,vz:Math.cos(a)*.5,life:.9,s:.12,c:mpick(MPAL.light),add:true});}
    mburst(p.x,p.y+1,p.z,16,{cols:['#ffffff','#fff07a'],spd:1.5,up:1.5,life:1,s:.1,add:true});}});
defSpell('lichtkugel',{el:'light',name:'Lichtkugel',desc:'Eine schwebende Kugel folgt dir 3 Minuten und leuchtet – wie eine Fackel ohne Hand.',mana:15,cd:10,
  cast(c){const p=cpos(c);magSnd('light',p.x,p.z);if(c.own){magBuff('orb',180);for(const z of MAG.zones)if(z.kind==='orb'&&z.ctx.own)z.kill=1;}
    const pos=()=>{const o=c.caster;if(!o)return null;const a=time*1.3;return{x:o.x+Math.cos(a)*.7,y:o.y+2.1+Math.sin(time*2.1)*.12,z:o.z+Math.sin(a)*.7};};
    const L=magLight({x:p.x,y:p.y+2,z:p.z,col:0xfff2c0,I:1.7,dist:14,until:time+180,follow:pos});
    magZone({kind:'orb',x:p.x,z:p.z,r:1,life:180,ctx:c,tick(q,dt){if(c.own&&!MAG.fx.orb){q.kill=1;L.kill=1;return;}const o=pos();if(!o||!magNear(o.x,o.z))return;
      spark({x:o.x,y:o.y,z:o.z,life:.05,s:.42,s1:.4,c:'#fff8d8',add:true});spark({x:o.x,y:o.y,z:o.z,life:.05,s:.22,c:'#ffffff',add:true});
      if(Math.random()<dt*14)spark({x:o.x+(Math.random()-.5)*.3,y:o.y+(Math.random()-.5)*.3,z:o.z+(Math.random()-.5)*.3,vy:-.3,life:.7,s:.07,c:mpick(MPAL.light),add:true});},end(){L.kill=1;}});}});
defSpell('heiligerstrahl',{el:'light',name:'Heiliger Strahl',desc:'Ein Lichtstrahl. Dreifacher Schaden gegen Untote, Skelette und Dämonen.',mana:18,cd:1.5,
  cast(c){const h=cHand(c);let end=null,hitO=null;if(c.own){const t=magAim(24,.95);if(t){hitO=t;const m=magCenter(t);end={x:m[0],y:m[1],z:m[2]};}}
    if(!end)for(let s=.8;s<24;s+=.4){const x=c.o.x+c.d.x*s,y=c.o.y+c.d.y*s,z=c.o.z+c.d.z*s;
      if(c.own){const f=magFoesAt(x,y,z,.7).find(o=>Math.abs(magCenter(o)[1]-y)<(o.h||1.4)*.7);if(f){hitO=f;end={x,y,z};break;}}
      if(y<=groundAt(x,z,y+1)){end={x,y,z};break;}}
    if(!end)end=cfwd(c,24);if(c.own)c.x=[+end.x.toFixed(2),+end.y.toFixed(2),+end.z.toFixed(2)];else if(c.x)end={x:c.x[0],y:c.x[1],z:c.x[2]};
    magSnd('light',h.x,h.z,1.2);magSnd('zap',h.x,h.z,.5);lineFx(h.x,h.y,h.z,end.x,end.y,end.z,{cols:['#ffffff','#fff8d8'],dens:16,life:.45,s:.22,s1:.04,add:true,jit:.03,spd:.1});lineFx(h.x,h.y,h.z,end.x,end.y,end.z,{cols:['#fff07a','#ffd84a'],dens:8,life:.6,s:.4,s1:.05,add:true,jit:.12,spd:.2});
    lineFx(h.x,h.y,h.z,end.x,end.y,end.z,{cols:['#ffd84a'],dens:3,life:.8,s:.06,add:true,jit:.4,up:.4});mburst(end.x,end.y,end.z,24,{cols:MPAL.light,spd:3,life:.5,s:.12,add:true});
    magLight({x:end.x,y:end.y+.5,z:end.z,col:0xfff2c0,I:2.5,dist:10,until:time+.35});
    if(hitO){const und=magUndead(hitO);magHurt(hitO,und?72:24,'light',c);if(und)mburst(end.x,end.y,end.z,30,{cols:['#ffffff','#fff07a'],spd:5,life:.6,s:.14,add:true});}}});
defSpell('schutzkreis',{el:'light',name:'Schutzkreis',desc:'Ein goldener Kreis (30 s), in den keine Monster eintreten können. Gut zum Übernachten draußen.',mana:35,cd:30,
  cast(c){const p=cpos(c),y=groundAt(p.x,p.z,p.y+1);magSnd('light',p.x,p.z,1.3);ringFx(p.x,y,p.z,5,60,{cols:MPAL.light,up:2,life:1,s:.18,add:true});
    magZone({kind:'ward',x:p.x,z:p.z,y,r:5,life:30,ctx:c,ring:magRing(p.x,p.z,5,'#ffd84a',{op:.7}),L:magLight({x:p.x,y:y+1.5,z:p.z,col:0xfff0a0,I:1.2,dist:10,until:time+30}),
      tick(q,dt){q.ring.material.opacity=.45+.25*Math.sin(time*3);if(magNear(q.x,q.z)&&Math.random()<dt*30){const a=Math.random()*6.283;spark({x:q.x+Math.cos(a)*q.r,y:q.y+.1,z:q.z+Math.sin(a)*q.r,vy:1+Math.random(),life:1,s:.1,c:mpick(MPAL.light),add:true});}
        if(isClient())return;q.acc=(q.acc||0)+dt;if(q.acc<.15)return;q.acc=0;for(const o of magTargetsAt(q.x,q.y+1,q.z,q.r+1.5)){if(!magFoe(o)||(o.kind==='animal'&&!o.berserk&&o.type!=='wolf'&&o.type!=='bear'))continue;const dx=o.x-q.x,dz=o.z-q.z,d=Math.hypot(dx,dz)||.01;
          if(d<q.r+.5){o.x=q.x+dx/d*(q.r+.5);o.z=q.z+dz/d*(q.r+.5);if(o._lx!=null){o._lx=o.x;o._lz=o.z;}if(Math.random()<.3)mburst(o.x,o.y+1,o.z,6,{cols:['#ffffff','#fff07a'],spd:2,life:.3,s:.1,add:true});}}},
      end(q){q.L.kill=1;}});}});
defSpell('segen',{el:'light',name:'Segen',desc:'2 Minuten lang sind du, deine Mitspieler in der Nähe und deine Begleiter stärker (+25 % Schaden, mehr Erholung).',mana:30,cd:60,
  cast(c){const p=cpos(c);magSnd('light',p.x,p.z);magSnd('heal',p.x,p.z,.6);ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,.5,40,{cols:MPAL.light,spd:12,up:1,life:.8,s:.16,add:true});
    if(c.own||Math.hypot(P.x-p.x,P.z-p.z)<15){magBuff('bless',120);mburst(P.x,P.y+1,P.z,20,{cols:MPAL.light,spd:2,up:1.5,life:1,s:.12,add:true});}
    if(!isClient())for(const e of magAllies(p.x,p.z,15)){e.blessU=time+120;mburst(e.x,e.y+1,e.z,16,{cols:MPAL.light,spd:2,up:1.5,life:1,s:.12,add:true});}}});
defSpell('blenden',{el:'light',name:'Blenden',desc:'Ein greller Lichtblitz: Gegner vor dir sind 4 Sekunden blind und treffen nichts.',mana:16,cd:10,
  cast(c){const h=cHand(c);magSnd('zap',h.x,h.z,1.2);magSnd('light',h.x,h.z);mburst(h.x+c.d.x,h.y,h.z+c.d.z,60,{cols:['#ffffff','#fff8d8'],spd:9,life:.35,s:.2,add:true});
    magLight({x:h.x,y:h.y,z:h.z,col:0xffffff,I:4,dist:18,until:time+.25});if(c.own)magScreen('rgba(255,255,240,1)',.35,.4);else{const p=cpos(c);if(Math.hypot(P.x-p.x,P.z-p.z)<12)magScreen('rgba(255,255,240,1)',.5,.6);}
    for(const o of coneFoes(c,12,.25))magFx(o,'blind',4,null,c);}});
defSpell('laeuterung',{el:'light',name:'Läuterung',desc:'Entfernt Brennen, Gift, Flüche und dunkle Effekte – bei dir und Mitspielern in der Nähe.',mana:14,cd:8,
  cast(c){const p=cpos(c);magSnd('chime',p.x,p.z);magSnd('heal',p.x,p.z,.5);ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,.4,30,{cols:['#ffffff','#fff8d8'],spd:8,up:1.5,life:.8,s:.14,add:true});
    if(c.own||Math.hypot(P.x-p.x,P.z-p.z)<8)magPurifySelf();}});
let magDawn=null;
defSpell('morgenroete',{el:'light',name:'Morgenröte',big:1,desc:'Großer Zauber. Es wird 20 Sekunden lang taghell. Nachtmonster und Untote fliehen und zerfallen langsam.',mana:70,cd:120,noIndoor:1,
  cast(c){const p=cpos(c);magSnd('light',p.x,p.z,1.5);magSnd('heal',p.x,p.z,1);
    if(Math.hypot(P.x-p.x,P.z-p.z)<70)magDawn={t0:time,dur:20};
    magZone({kind:'dawn',x:p.x,z:p.z,r:30,life:20,ctx:c,L:magLight({x:p.x,y:p.y+6,z:p.z,col:0xffe8b0,I:2.4,dist:30,until:time+20}),
      tick(q,dt){if(magNear(q.x,q.z,80))for(let i=0;i<Math.ceil(dt*40);i++){const a=Math.random()*6.283,r=Math.random()*25,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;
          spark({x,y:groundAt(x,z,q.y+5)+8+Math.random()*6,z,vy:-6,life:1.4,s:.12,s1:.03,c:mpick(['#ffffff','#fff8d8','#ffd84a']),add:true,a:.8});}
        q.acc=(q.acc||0)+dt;if(q.acc>=.5&&c.own){q.acc=0;for(const o of magFoesAt(q.x,q.y+1,q.z,q.r)){if(!magUndead(o))continue;magFx(o,'fear',1.2,{x:q.x,z:q.z},c);magHurt(o,7,'light',c);
          if(Math.random()<.5)mburst(o.x,o.y+1,o.z,8,{cols:['#ffffff','#fff07a'],spd:1.5,up:1,life:.6,s:.1,add:true});}}},
      end(q){q.L.kill=1;}});}});
{const a=sunAngle;sunAngle=function(clk){const r=a(clk);if(!magDawn)return r;const t=time-magDawn.t0;if(t>magDawn.dur+3){magDawn=null;return r;}
  const k=Math.min(1,t/2.5)*Math.min(1,(magDawn.dur+3-t)/3),noon=a(720);let d=noon-r;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return r+d*k;};}

/* ===================== NEUTRAL ===================== */
defSpell('geschoss',{el:'neutral',name:'Magisches Geschoss',desc:'Ein einfaches Geschoss, das sich selbst ins Ziel lenkt. Trifft fast immer.',mana:7,cd:.5,
  cast(c){const h=cHand(c);magSnd('cast',h.x,h.z,1.2);magShoot({x:h.x,y:h.y,z:h.z,vx:c.d.x*18,vy:c.d.y*18+.5,vz:c.d.z*18,home:7,life:2.2,r:.3,el:'neutral',ctx:c,
    trail:p=>{spark({x:p.x,y:p.y,z:p.z,life:.25,s:.24,s1:.04,c:mpick(['#ffffff','#c8d8f8','#9fb6e0']),add:true});if(Math.random()<.5)spark({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5),vy:(Math.random()-.5),vz:(Math.random()-.5),life:.4,s:.06,c:'#ffffff',add:true});},
    hit(p,o){mburst(p.x,p.y,p.z,14,{cols:MPAL.neutral,spd:3,life:.4,s:.1,add:true});if(o)magHurt(o,12,'neutral',c);}});}});
defSpell('telekinese',{el:'neutral',name:'Telekinese',desc:'Holt einen Gegenstand am Boden zu dir – oder schubst Gegner vor dir weg.',mana:10,cd:1.5,
  cast(c){const h=cHand(c);magSnd('whoosh',h.x,h.z,.8);let d=null;
    if(c.own){let bs=.95;const e=magEye(),L=lookDir();for(const q of drops){const dx=q.x-e.x,dy=q.y+.2-e.y,dz=q.z-e.z,l=Math.hypot(dx,dy,dz);if(l>18)continue;const s=(dx*L.x+dy*L.y+dz*L.z)/l;if(s>bs){bs=s;d=q;}}}
    if(d){const sx=d.x,sy=d.y,sz=d.z;c.x=[+sx.toFixed(2),+sy.toFixed(2),+sz.toFixed(2)];d.noPick=0;d.fullT=0;magZone({kind:'tk',x:sx,z:sz,r:1,life:.5,ctx:c,tick(q,dt){const k=q.t/.5;d.x=sx+(P.x-sx)*k;d.z=sz+(P.z-sz)*k;d.y=sy+(P.y+.4-sy)*k+Math.sin(k*Math.PI)*1.2;d.vy=0;d.vx=d.vz=0;
      spark({x:d.x,y:d.y+.2,z:d.z,life:.3,s:.14,c:mpick(MPAL.neutral),add:true});}});lineFx(h.x,h.y,h.z,sx,sy+.2,sz,{cols:MPAL.neutral,dens:4,life:.3,s:.08,add:true});return;}
    if(c.x){lineFx(h.x,h.y,h.z,c.x[0],c.x[1]+.2,c.x[2],{cols:MPAL.neutral,dens:4,life:.3,s:.08,add:true});return;}
    const f=cflat(c);for(let i=0;i<40;i++){const a=(Math.random()-.5)*1.2,sp=8,dx=f.x*Math.cos(a)-f.z*Math.sin(a),dz=f.x*Math.sin(a)+f.z*Math.cos(a);spark({x:h.x,y:h.y,z:h.z,vx:dx*sp,vy:(Math.random()-.5),vz:dz*sp,life:.45,s:.06,s1:.3,c:mpick(['#ffffff','#c8d8f8']),add:true,a:.5,drag:2});}
    for(const o of coneFoes(c,7,.6)){magHurt(o,4,'neutral',c);magPush(o,f.x*7,f.z*7,c,.6);}}});
defSpell('schweben',{el:'neutral',name:'Schweben',desc:'10 Sekunden lang fällst du langsam – kein Fallschaden.',mana:10,cd:12,
  cast(c){const p=cpos(c);magSnd('whoosh',p.x,p.z,.6);magSnd('chime',p.x,p.z,.4);if(c.own){magBuff('float',10);if(P.vy<0)P.vy=0;}
    auraZone(c,10,(z,dt)=>{if(Math.random()<dt*20){const a=Math.random()*6.283;spark({x:z.x+Math.cos(a)*.35,y:z.y-.05,z:z.z+Math.sin(a)*.35,vx:Math.cos(a)*.6,vy:-.4,vz:Math.sin(a)*.6,life:.6,s:.09,c:mpick(MPAL.neutral),add:true});}});}});
defSpell('blinzeln',{el:'neutral',name:'Blinzeln',desc:'Kurzer Teleport 5 Meter nach vorne.',mana:10,cd:3,
  cast(c){const a=cpos(c);mburst(a.x,a.y+1,a.z,24,{cols:MPAL.neutral,spd:2.5,life:.4,s:.12,add:true});magSnd('tp',a.x,a.z,.8);if(c.own)magDash(5);
    const b=c.own?{x:P.x,y:P.y,z:P.z}:null;setTimeout(()=>{const q=b||cpos(c);mburst(q.x,q.y+1,q.z,24,{cols:MPAL.neutral,spd:2.5,life:.4,s:.12,add:true});},40);}});
defSpell('magielicht',{el:'neutral',name:'Magisches Licht',desc:'Setzt ein Licht an eine Stelle, das 5 Minuten dort bleibt – z. B. als Markierung in Höhlen.',mana:6,cd:1,
  cast(c){const g=cGround(c,12),p=g.hit?{x:g.x-c.d.x*.4,y:g.y+.9,z:g.z-c.d.z*.4}:cfwd(c,4);magSnd('chime',p.x,p.z);
    const mine=MAG.zones.filter(z=>z.kind==='mlight'&&z.ctx.own===c.own&&z.ctx.caster===c.caster);if(mine.length>=5)mine[0].kill=1;
    const L=magLight({x:p.x,y:p.y,z:p.z,col:0xd8e8ff,I:1.6,dist:12,until:time+300});
    magZone({kind:'mlight',x:p.x,z:p.z,y:p.y,r:1,life:300,ctx:c,tick(q,dt){if(!magNear(q.x,q.z,70))return;const y=q.y+Math.sin(time*2+q.x)*.08;spark({x:q.x,y,z:q.z,life:.05,s:.32,s1:.3,c:'#d8e8ff',add:true});spark({x:q.x,y,z:q.z,life:.05,s:.14,c:'#ffffff',add:true});
      if(Math.random()<dt*6)spark({x:q.x+(Math.random()-.5)*.3,y,z:q.z+(Math.random()-.5)*.3,vy:.3,life:.8,s:.05,c:'#ffffff',add:true});},end(){L.kill=1;}});}});
defSpell('rueckruf',{el:'neutral',name:'Rückruf',desc:'Nach 3 Sekunden Stillstehen wirst du zu deinem Rastplatz teleportiert. Bricht ab, wenn du getroffen wirst oder dich bewegst.',mana:20,cd:60,noIndoor:1,
  cast(c){const p=cpos(c);magSnd('chime',p.x,p.z);const done={ok:false};
    if(c.own){const sx=P.x,sz=P.z;magBuff('recall',3,{tick(F,dt){if(Math.hypot(P.x-sx,P.z-sz)>1.2){F.cancel=1;magBuffEnd('recall');toast('Rückruf abgebrochen');}},
      onEnd(){const F=this;if(F.cancel||time<F.until-.05)return;done.ok=true;const sp=FLAGS.spawn||{x:SPAWN.x,z:SPAWN.z,name:'Der Wald'};mburst(P.x,P.y+1,P.z,60,{cols:MPAL.neutral,spd:4,up:2,life:.8,s:.14,add:true});magSnd('tp');
        teleport(sp.x,sp.z);magNet({t:'magc',id:'rueckruf_fx',pid:MP.pid,o:[P.x,P.y+1,P.z],d:[0,0,0],yaw:0,pitch:0,seed:0});mburst(P.x,P.y+1,P.z,60,{cols:MPAL.neutral,spd:4,up:2,life:.8,s:.14,add:true});toast('Zurück bei: '+sp.name);}});}
    magZone({kind:'recall',x:p.x,z:p.z,r:1,life:3,ctx:c,follow:()=>c.caster,tick(q,dt){if(c.own&&!MAG.fx.recall&&!done.ok){q.kill=1;return;}for(let i=0;i<3;i++){const a=Math.random()*6.283;
      spark({x:q.x+Math.cos(a)*.6,y:q.y+.05,z:q.z+Math.sin(a)*.6,vy:2+q.t*2,life:.7,s:.1,c:mpick(MPAL.neutral),add:true});}}});}});
defSpell('rueckruf_fx',{el:'neutral',name:'Rückruf',hidden:1,cast(c){mburst(c.o.x,c.o.y,c.o.z,60,{cols:MPAL.neutral,spd:4,up:2,life:.8,s:.14,add:true});}});
defSpell('manaschild',{el:'neutral',name:'Mana-Schild',desc:'30 Sekunden lang geht Schaden zuerst auf dein Mana statt auf dein Leben.',mana:15,cd:20,
  cast(c){const p=cpos(c);magSnd('chime',p.x,p.z);magSnd('bubble',p.x,p.z,.5);if(c.own)magBuff('mshield',30);
    auraZone(c,30,(z,dt)=>{if(c.own&&!MAG.fx.mshield){z.kill=1;return;}if(Math.random()<dt*12){const a=Math.random()*6.283,b=Math.random()*1.8;spark({x:z.x+Math.cos(a)*.7,y:z.y+.1+b,z:z.z+Math.sin(a)*.7,life:.4,s:.08,c:mpick(['#9fb6e0','#c8d8f8','#4a8cff']),add:true,a:.7});}});}});
defSpell('spueren',{el:'neutral',name:'Spüren',desc:'Zeigt 10 Sekunden lang Truhen, Erze, Pilze und andere Dinge in der Nähe an.',mana:12,cd:15,
  cast(c){const p=cpos(c);magSnd('chime',p.x,p.z);ringFx(p.x,groundAt(p.x,p.z,p.y+1),p.z,.5,50,{cols:MPAL.neutral,spd:16,life:1,s:.12,add:true});if(!c.own)return;
    const L=[];for(const f of FURN)if(f.type==='chest'&&Math.hypot(f.x-P.x,f.z-P.z)<35)L.push([f.x,f.y+.6,f.z,'Truhe','#ffd84a']);
    for(const q of pickups)if(q.active&&Math.hypot(q.x-P.x,q.z-P.z)<30)L.push([q.x,q.y+.4,q.z,ITEMS[q.id]?ITEMS[q.id].name:'?','#b8ff7a']);
    for(const d of drops)if(Math.hypot(d.x-P.x,d.z-P.z)<30)L.push([d.x,d.y+.4,d.z,ITEMS[d.id]?ITEMS[d.id].name:'?','#ffffff']);
    if(caveCur&&P.x>CAVE_X0-400&&caveCur.D&&caveCur.D.deps)for(const d of caveCur.D.deps){if(d.x==null||(caveCur.save&&caveCur.save.mined&&caveCur.save.mined[d.j]))continue;if(Math.hypot(d.x-P.x,d.z-P.z)<35)L.push([d.x,d.wy,d.z,(ORES[d.k]||GEMS[d.k]||{n:'Erz'}).n,GEMS[d.k]?'#7ac4ff':'#ffb070']);}
    L.sort((a,b)=>Math.hypot(a[0]-P.x,a[2]-P.z)-Math.hypot(b[0]-P.x,b[2]-P.z));const show=L.slice(0,24);magBuff('sense',10,{marks:show});
    for(const m of show)magZone({kind:'senseFx',x:m[0],z:m[2],y:m[1],r:.5,life:10,ctx:c,tick(q,dt){if(Math.random()<dt*6)spark({x:q.x+(Math.random()-.5)*.4,y:q.y+(Math.random()-.5)*.4,z:q.z+(Math.random()-.5)*.4,vy:.4,life:.7,s:.14,c:m[4],add:true});}});
    toast(show.length?`Du spürst ${show.length} Dinge in der Nähe`:'Du spürst nichts Besonderes in der Nähe.');}});
