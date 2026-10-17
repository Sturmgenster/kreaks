/* =========================================================
   0.0.112 · Wetter (selten, nur passend zum Biom)
   - Kalte Biome (Schnee, Schneeberge, Nordwald, Sturmberg): Schneefall, selten Schneesturm
   - Wüste und Steinwüste: Sandsturm
   - Restliche Welt: ganz selten Regen, noch seltener Gewitter (Blitze, Donner)
   - Jedes Wetter dauert nur ein paar Spielstunden
   ========================================================= */
const WX_COLD=new Set(['wl_schnee','wl_schneeberge','wl_nadelwald','deep','storm','stormgate']),WX_DESERT=new Set(['wl_wueste','wl_steinwueste','desert','dvillage','tomb','camp']),WX_NONE=new Set(['wl_candy']);
const WX_K={rain:{n:'Regen',col:'#6a7480',far:.55,light:.75,pc:0x9ab8d8,ps:.07,fall:17,wind:2},thunder:{n:'Gewitter',col:'#3a4048',far:.45,light:.55,pc:0x9ab8d8,ps:.08,fall:20,wind:4},
  snow:{n:'Schneefall',col:'#c4ccd4',far:.6,light:.9,pc:0xffffff,ps:.11,fall:1.6,wind:1},blizzard:{n:'Schneesturm',col:'#dde4ea',far:.18,light:.8,pc:0xffffff,ps:.12,fall:3,wind:11},
  sand:{n:'Sandsturm',col:'#c8a060',far:.17,light:.78,pc:0xd8b070,ps:.1,fall:.6,wind:13}};
const WX={cat:null,cur:null,int:0,flash:0,flashT:8,coldT:8,pts:null,amb:null,catT:0};
function wxCat(x,z){if(x>60000)return null;let a=null;try{a=areaAt(x,z);}catch(e){}if(!a||WX_NONE.has(a))return null;if(WX_COLD.has(a))return'cold';if(WX_DESERT.has(a))return'desert';return'normal';}
function wxRoll(){const now=gameMinutes(),F=FLAGS.wx=FLAGS.wx||{};const hr=Math.floor(now/60);if(F.h===hr)return;const steps=F.h==null?1:Math.min(24,hr-F.h);F.h=hr;
  for(let s=0;s<steps;s++)for(const c of['cold','desert','normal']){const E=F[c];if(E&&E.end>now)continue;F[c]=null;const r=Math.random();
    if(c==='cold'&&r<.05)F[c]={k:Math.random()<.25?'blizzard':'snow',end:now+120+Math.random()*180};
    else if(c==='desert'&&r<.03)F[c]={k:'sand',end:now+60+Math.random()*120};
    else if(c==='normal'&&r<.006)F[c]={k:Math.random()<.3?'thunder':'rain',end:now+60+Math.random()*120};}}
function wxNow(){const F=FLAGS.wx||{},c=WX.cat;if(!c)return null;const E=F[c];return E&&E.end>gameMinutes()?E.k:null;}
// ---------- Niederschlag ----------
const WX_N=3200,WX_BOX=[44,26,44];
function wxInit(){const g=new THREE.BufferGeometry(),pos=new Float32Array(WX_N*3);for(let i=0;i<WX_N;i++){pos[i*3]=(Math.random()-.5)*WX_BOX[0];pos[i*3+1]=Math.random()*WX_BOX[1];pos[i*3+2]=(Math.random()-.5)*WX_BOX[2];}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));const m=new THREE.PointsMaterial({color:0xffffff,size:.1,transparent:true,opacity:.8,depthWrite:false,fog:true});WX.pts=new THREE.Points(g,m);WX.pts.frustumCulled=false;WX.pts.visible=false;scene.add(WX.pts);
  const fl=document.createElement('div');fl.id='wxFlash';fl.style.cssText='position:absolute;inset:0;pointer-events:none;background:#eef4ff;opacity:0;z-index:2';document.body.appendChild(fl);}
function wxTickPts(dt,K){const p=WX.pts;if(!p)return;const on=WX.int>.02&&K&&!SW.uw&&P.x<60000;p.visible=on;if(!on)return;const c=camera.position,a=p.geometry.attributes.position,A=a.array,n=Math.floor(WX_N*Math.min(1,WX.int));
  p.material.color.setHex(K.pc);p.material.size=K.ps;p.material.opacity=.85*Math.min(1,WX.int*1.5);const wx=K.wind,ox=c.x,oy=c.y-8,oz=c.z,hx=WX_BOX[0]/2,hz=WX_BOX[2]/2;
  for(let i=0;i<n;i++){let x=A[i*3],y=A[i*3+1],z=A[i*3+2];y-=K.fall*dt*(.8+((i*7)%10)*.04);x+=wx*dt*(.7+((i*3)%10)*.06);if(K===WX_K.snow)x+=Math.sin(time*1.3+i)*.3*dt;
    if(y<0)y+=WX_BOX[1];if(y>WX_BOX[1])y-=WX_BOX[1];if(x>hx)x-=WX_BOX[0];if(x<-hx)x+=WX_BOX[0];if(z>hz)z-=WX_BOX[2];if(z<-hz)z+=WX_BOX[2];A[i*3]=x;A[i*3+1]=y;A[i*3+2]=z;}
  p.position.set(ox,oy,oz);p.geometry.setDrawRange(0,n);a.needsUpdate=true;}
// ---------- Geräusche: Regen, Wind, Donner ----------
function wxNoise(){const c=Snd.ctx;if(!c)return null;if(WX.nb)return WX.nb;const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return WX.nb=b;}
function wxAmb(K,v){const c=Snd.ctx;if(!c||!Snd.sfx)return;if(!WX.amb){if(v<=0)return;const nb=wxNoise();if(!nb)return;const s=c.createBufferSource();s.buffer=nb;s.loop=true;const f=c.createBiquadFilter(),g=c.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(Snd.sfx);s.start();WX.amb={s,f,g};}
  const A=WX.amb;if(K){A.f.type=K===WX_K.rain||K===WX_K.thunder?'highpass':'bandpass';A.f.frequency.value=K===WX_K.rain||K===WX_K.thunder?1400:K===WX_K.sand?700:420;A.f.Q.value=.7;}
  A.g.gain.setTargetAtTime(v,c.currentTime,.5);}
function wxThunder(dist){const c=Snd.ctx;if(!c||!Snd.sfx)return;const nb=wxNoise();if(!nb)return;const t=c.currentTime+Math.min(3,dist/340),s=c.createBufferSource();s.buffer=nb;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=dist<60?900:320;
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(dist<60?.9:.45,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+2.6);s.connect(f);f.connect(g);g.connect(Snd.sfx);s.start(t);s.stop(t+2.8);}
// ---------- Blitze ----------
function wxMetal(){const a=equip&&equip.armor,h=equip&&equip.helm;const m=s=>s&&ITEMS[s.id]&&(ITEMS[s.id].mat||/chain|iron|helm/.test(s.id));return!!(m(a)||m(h));}
function wxLightning(){WX.flash=1;const metal=wxMetal(),hit=metal?Math.random()<.22:Math.random()<.04;let x,z;
  if(hit&&!SW.uw){x=P.x+(Math.random()-.5)*1.2;z=P.z+(Math.random()-.5)*1.2;}else{const a=Math.random()*6.283,d=20+Math.random()*120;x=P.x+Math.cos(a)*d;z=P.z+Math.sin(a)*d;}
  const g=groundAt(x,z,1e4),d=Math.hypot(x-P.x,z-P.z);for(let k=0;k<60;k++){const y=g+Math.random()*40;spawnParticle(x+(Math.random()-.5)*.8,y,z+(Math.random()-.5)*.8,0,0,0,0xeef4ff,.25,.3);}
  for(let k=0;k<20;k++)spawnParticle(x,g+.3,z,(Math.random()-.5)*6,2+Math.random()*4,(Math.random()-.5)*6,0xffd040,.5,.25);wxThunder(d);
  if(d<3&&state==='playing'){takeDamage(metal?24:14);toast(metal?'Der Blitz schlägt in deine Metallrüstung ein!':'Ein Blitz schlägt direkt neben dir ein!');P.vx+=(Math.random()-.5)*8;P.vz+=(Math.random()-.5)*8;}
  else if(metal&&!FLAGS.wxMetalTip){FLAGS.wxMetalTip=1;toast('Achtung: In Metallrüstung ziehst du Blitze an!');}}
// ---------- Takt ----------
function wxTick(dt){if(!WX.pts)wxInit();WX.catT-=dt;if(WX.catT<=0){WX.catT=.5;WX.cat=state==='playing'||state==='dialog'?wxCat(P.x,P.z):WX.cat;wxRoll();}
  const k=wxNow(),K=k?WX_K[k]:null;if(K&&WX.cur!==k){if(WX.int<.05||!WX.cur){WX.cur=k;if(state==='playing')toast(K.n+(k==='blizzard'?'! Such dir Schutz.':k==='sand'?'! Man sieht kaum die Hand vor Augen.':'.'));}}
  const tgt=K&&WX.cur===k?1:0;WX.int+=(tgt-WX.int)*(1-Math.exp(-dt/(tgt?6:4)));if(WX.int<.01&&!K)WX.cur=null;
  const CK=WX.cur?WX_K[WX.cur]:null;wxTickPts(dt,CK);wxAmb(CK,CK&&!SW.uw?WX.int*(WX.cur==='snow'?.04:WX.cur==='rain'?.08:.12):0);
  if(WX.cur==='thunder'&&WX.int>.6&&state==='playing'){WX.flashT-=dt;if(WX.flashT<=0){WX.flashT=8+Math.random()*20;wxLightning();}}
  WX.flash=Math.max(0,WX.flash-dt*3);const fe=$('wxFlash');if(fe){const o=(WX.flash>.5?WX.flash:WX.flash*.5)*.7;if(fe._o!==o){fe._o=o;fe.style.opacity=o.toFixed(2);}}
  if(WX.cur==='blizzard'&&WX.int>.6&&state==='playing'&&!cheatOn()){WX.coldT-=dt;if(WX.coldT<=0){WX.coldT=8;if(P.stats.hp>15){takeDamage(1);if(!WX.coldTip||time-WX.coldTip>60){WX.coldTip=time;toast('Dir ist eiskalt! Such Schutz.');}}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{wxTick(dt);}catch(e){if(!wxTick.err){wxTick.err=1;console.error('Wetter',e);}}};}
// Sturm bremst
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);if(!SW.on&&!P.riding&&(WX.cur==='blizzard'||WX.cur==='sand')&&WX.int>.3){const k=1-.2*WX.int;P.x=x0+(P.x-x0)*k;P.z=z0+(P.z-z0)*k;}};}
// Sicht, Licht, Nebel
const WXC=new THREE.Color(),WXS={fog:new THREE.Color(),hor:new THREE.Color(),top:new THREE.Color()};
{const r0=renderer.render;renderer.render=function(s,c){const CK=WX.cur?WX_K[WX.cur]:null;if(!CK||WX.int<.01||SW.uw||P.x>60000)return r0.call(renderer,s,c);
  if(time-uwT>2){uwT=time;uwCollect();}const k=WX.int,day=typeof DN!=='undefined'?Math.max(.15,DN.day+(1-DN.day)*.15):1;WXC.set(CK.col).multiplyScalar(day);
  WXS.fog.copy(scene.fog.color);WXS.hor.copy(SKY_HOR);WXS.top.copy(SKY_TOP);const fn=scene.fog.near,ff=scene.fog.far,hi=hemi.intensity,si=sun.intensity,saved=UWM.map(m=>[m,m.uniforms.fogNear.value,m.uniforms.fogFar.value,m.uniforms.light?m.uniforms.light.value:null]);
  const fk=1-(1-CK.far)*k,lk=(1-(1-CK.light)*k)+WX.flash*.8;scene.fog.color.lerp(WXC,.8*k);SKY_HOR.lerp(WXC,.8*k);SKY_TOP.lerp(WXC,.85*k);scene.fog.far=Math.max(14,ff*fk);scene.fog.near=Math.min(fn,scene.fog.far*.3);hemi.intensity=hi*lk;sun.intensity=si*(1-(1-CK.light)*k);
  for(const[m,n0,f0,l]of saved){m.uniforms.fogFar.value=Math.max(14,f0*fk);m.uniforms.fogNear.value=Math.min(n0,m.uniforms.fogFar.value*.3);if(l!=null)m.uniforms.light.value=l*lk;}
  try{r0.call(renderer,s,c);}finally{scene.fog.color.copy(WXS.fog);SKY_HOR.copy(WXS.hor);SKY_TOP.copy(WXS.top);scene.fog.near=fn;scene.fog.far=ff;hemi.intensity=hi;sun.intensity=si;for(const[m,n0,f0,l]of saved){m.uniforms.fogNear.value=n0;m.uniforms.fogFar.value=f0;if(l!=null)m.uniforms.light.value=l;}}};}
// Uhr: Wetter anzeigen
{const a=renderClock;renderClock=function(clk,M){a(clk,M);const el=document.getElementById('clockHud');if(!el)return;const base=el.textContent.split(' · ').slice(0,3).join(' · '),s=WX.cur&&WX.int>.3?base+' · '+WX_K[WX.cur].n:base;if(el.textContent!==s)el.textContent=s;};}
// /wetter zum Ausprobieren (Cheat-Modus)
HELP.push(['/wetter <regen|gewitter|schnee|schneesturm|sandsturm|klar>','Wetter für die Gegend, in der du gerade bist (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/wetter\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);if(!cheatOn()){conLog('/wetter geht nur im Cheat-Modus.','err');return;}
    const w=norm(t.replace(/^\/wetter\s*/i,'')),map={regen:'rain',gewitter:'thunder',schnee:'snow',schneefall:'snow',schneesturm:'blizzard',sandsturm:'sand',sand:'sand',klar:null,sonne:null};
    if(!(w in map)){conLog('Benutze: regen, gewitter, schnee, schneesturm, sandsturm oder klar','err');return;}const c=wxCat(P.x,P.z)||'normal';const OK={cold:['snow','blizzard'],desert:['sand'],normal:['rain','thunder']};if(map[w]&&!OK[c].includes(map[w])){conLog(`${WX_K[map[w]].n} gibt es hier nicht. Hier möglich: ${OK[c].map(k=>WX_K[k].n).join(', ')}.`,'err');return;}FLAGS.wx=FLAGS.wx||{};FLAGS.wx[c]=map[w]?{k:map[w],end:gameMinutes()+180}:null;
    conLog(map[w]?`${WX_K[map[w]].n} beginnt.`:'Das Wetter klart auf.','ok');closeConsole();return;}
  return a(raw);};}
