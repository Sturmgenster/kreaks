/* =========================================================
   0.0.123 · Umgebungsgeräusche und neue Sturmklänge
   - Neuer Regler „Umgebung“ in den Einstellungen: Wetter, Wind, Donner, Vögel, Eulen, Wolfsgeheul, Arenapublikum.
   - Stürme klingen nicht mehr nach Rauschen aus dem Fernseher: weiches Braun-/Rosa-Rauschen, Böen,
     Stereo-Breite, leises Pfeifen im Schneesturm, Sandkörner im Sandsturm, Regen mit Körper.
   - Donner: Knall in der Nähe, danach rollendes Grollen in mehreren Wellen, je nach Entfernung dumpfer und später.
   ========================================================= */
// ---------- Regler ----------
if(settings.env==null)settings.env=70;
const envVol=()=>Math.pow((settings.env==null?70:settings.env)/100,1.4);
{const a=Snd.init;Snd.init=function(){const r=a.apply(this,arguments);try{const c=this.ctx;if(c&&!this.envG){this.envG=c.createGain();this.envG.connect(this.sfx);this.envG.gain.value=envVol();}}catch(e){}return r;};}
{const a=Snd.apply;Snd.apply=function(){a.apply(this,arguments);if(this.envG)this.envG.gain.value=envVol();};}
{const lab=document.createElement('label');lab.className='row';lab.htmlFor='sEnv';lab.innerHTML='<span>Umgebung</span><input type="range" id="sEnv" min="0" max="100" step="1"><output id="oEnv"></output>';
  const snd=$('sSound');if(snd&&snd.closest('label'))snd.closest('label').after(lab);
  sliders.push(['sEnv','oEnv','env',v=>v+'%']);
  $('sEnv').addEventListener('input',e=>{settings.env=+e.target.value;$('oEnv').textContent=settings.env+'%';applySettings();try{saveSettings();}catch(_){}});
  $('sEnv').value=settings.env;$('oEnv').textContent=settings.env+'%';}
// Naturgeräusche über den Umgebungs-Regler leiten
const envBus=()=>Snd.envG||Snd.sfx;
function envRun(fn,self,args){const s=Snd.sfx;if(Snd.envG)Snd.sfx=Snd.envG;try{return fn.apply(self,args);}finally{Snd.sfx=s;}}
for(const k of['chirp','hoot','caw','howl'])if(typeof Snd[k]==='function'){const a=Snd[k];Snd[k]=function(){return envRun(a,this,arguments);};}
try{const a=crwRoar;crwRoar=function(){return envRun(a,null,arguments);};}catch(e){}
// ---------- Rauschen: braun (tief, weich) und rosa (ausgewogen) ----------
const ENVN={};
function envNoise(kind){const c=Snd.ctx;if(!c)return null;if(ENVN[kind])return ENVN[kind];const len=c.sampleRate*4,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);
  if(kind==='brown'){let l=0;for(let i=0;i<len;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l;}}
  else{let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=b0+b1+b2+b3+b4+b5+b6+w*.5362;b6=w*.115926;}}
  // weich in sich schließen (keine Knackser an der Schleife) und auf gleiche Lautheit bringen
  const F=Math.floor(c.sampleRate*.05);for(let i=0;i<F;i++){const t=i/F;d[i]=d[i]*t+d[len-F+i]*(1-t);}
  let pk=0;for(let i=0;i<len;i++)pk=Math.max(pk,Math.abs(d[i]));for(let i=0;i<len;i++)d[i]/=pk||1;return ENVN[kind]=b;}
function envSrc(kind,dest){const c=Snd.ctx,s=c.createBufferSource();s.buffer=envNoise(kind);s.loop=true;s.connect(dest);s.start(c.currentTime,Math.random()*3.5);return s;}
function envChain(c,nodes){for(let i=0;i<nodes.length-1;i++)nodes[i].connect(nodes[i+1]);return nodes[0];}
function envFilt(c,type,f,q){const n=c.createBiquadFilter();n.type=type;n.frequency.value=f;n.Q.value=q==null?.7:q;return n;}
function envPan(c,v,dest){if(!c.createStereoPanner)return dest;const p=c.createStereoPanner();p.pan.value=v;p.connect(dest);return p;}
// ---------- Klangbilder je Wetter ----------
// wind: Tiefpass und Stärke, gust: wie stark die Böen schwanken, whistle: Pfeifen, rain: Regen, grain: Sandkörner, lvl: Gesamtlautstärke
const WXS_DEF={snow:{wind:[340,.55],gust:.35,lvl:.16},blizzard:{wind:[700,1],gust:.75,whistle:.3,lvl:.34},sand:{wind:[520,1],gust:.7,grain:.7,lvl:.3},
  rain:{wind:[300,.3],gust:.25,rain:1,lvl:.24},thunder:{wind:[420,.6],gust:.55,rain:1.15,lvl:.3}};
function wxsBuild(k){const c=Snd.ctx,D=WXS_DEF[k];if(!c||!D)return null;const out=c.createGain();out.gain.value=0;out.connect(envBus());const L={k,out,srcs:[],gusts:[],wh:null,next:0};
  for(const pv of[-.65,.65]){const g=c.createGain();g.gain.value=D.wind[1]*.6;const f=envFilt(c,'lowpass',D.wind[0]*(pv<0?.9:1.1),.4),f2=envFilt(c,'highpass',150,.5);envChain(c,[f,f2,g]);g.connect(envPan(c,pv,out));L.srcs.push(envSrc('brown',f));L.gusts.push({g,f,base:D.wind[1],fb:D.wind[0]*(pv<0?.9:1.1)});}
  if(D.whistle){const g=c.createGain();g.gain.value=0;const f=envFilt(c,'bandpass',800,9);f.connect(g);g.connect(envPan(c,.2,out));L.srcs.push(envSrc('pink',f));L.wh={g,f,base:D.whistle};}
  if(D.rain){const body=c.createGain();body.gain.value=.55*D.rain;const hp=envFilt(c,'highpass',380,.5),lp=envFilt(c,'lowpass',5200,.5),pk=envFilt(c,'peaking',2600,1);pk.gain.value=-4;envChain(c,[hp,lp,pk,body]);body.connect(out);L.srcs.push(envSrc('pink',hp));
    const low=c.createGain();low.gain.value=.35*D.rain;const lf=envFilt(c,'lowpass',260,.5);lf.connect(low);low.connect(out);L.srcs.push(envSrc('brown',lf));L.rainG=body;}
  if(D.grain){const g=c.createGain();g.gain.value=D.grain*.5;const hp=envFilt(c,'highpass',2600,.6),lp=envFilt(c,'lowpass',7000,.5);envChain(c,[hp,lp,g]);g.connect(envPan(c,-.3,out));L.srcs.push(envSrc('pink',hp));L.grain={g,base:D.grain};}
  return L;}
function wxsDrop(L){if(!L)return;const c=Snd.ctx,t=c.currentTime;L.out.gain.cancelScheduledValues(t);L.out.gain.setTargetAtTime(0,t,.8);setTimeout(()=>{for(const s of L.srcs)try{s.stop();}catch(e){}try{L.out.disconnect();}catch(e){}},4500);}
// Ersatz für das alte Wetterrauschen
wxAmb=function(K,v){const c=Snd.ctx;if(!c||!Snd.sfx)return;const k=K?Object.keys(WX_K).find(n=>WX_K[n]===K):null;
  if(WX.snd&&WX.snd.k!==k){wxsDrop(WX.snd);WX.snd=null;}
  if(!WX.snd&&k&&v>0)WX.snd=wxsBuild(k);const L=WX.snd;if(!L)return;const D=WXS_DEF[L.k],t=c.currentTime;
  const vol=v>0?Math.min(1,WX.int)*D.lvl:0;L.out.gain.setTargetAtTime(vol,t,.6);
  // Böen: langsam schwellende, zufällige Windstöße, links und rechts unabhängig
  if(t>=L.next){L.next=t+.35+Math.random()*1.1;for(const G of L.gusts){const q=Math.pow(Math.random(),1.4),amp=G.base*(1-D.gust*.6+D.gust*1.1*q);G.g.gain.setTargetAtTime(amp*.6,t,.5+Math.random()*.7);G.f.frequency.setTargetAtTime(G.fb*(.75+q*.7),t,.8);}
    if(L.wh){const q=Math.random();L.wh.g.gain.setTargetAtTime(q>.55?L.wh.base*(q-.55)*2.2:0,t,.7);L.wh.f.frequency.setTargetAtTime(650+q*650,t,1.1);}
    if(L.grain)L.grain.g.gain.setTargetAtTime(L.grain.base*(.25+Math.random()*.6),t,.4);}};
// Donner: naher Knall, dann rollendes Grollen in Wellen
wxThunder=function(dist){const c=Snd.ctx;if(!c||!Snd.sfx)return;const bus=envBus(),t0=c.currentTime+Math.min(4,dist/340),near=dist<70,vol=near?.6:Math.max(.12,.48-dist/420),pan=envPan(c,(Math.random()-.5)*1.2,bus);
  if(dist<160){const s=c.createBufferSource();s.buffer=envNoise('pink');const hp=envFilt(c,'highpass',near?900:1400,.6),g=c.createGain();g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol*(near?.75:.35),t0+.006);g.gain.exponentialRampToValueAtTime(.0001,t0+(near?.35:.2));
    envChain(c,[hp,g]);g.connect(pan);s.connect(hp);s.start(t0,Math.random()*3);s.stop(t0+.5);
    if(near){const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.setValueAtTime(70,t0);o.frequency.exponentialRampToValueAtTime(32,t0+.6);og.gain.setValueAtTime(.0001,t0);og.gain.exponentialRampToValueAtTime(vol*.7,t0+.02);og.gain.exponentialRampToValueAtTime(.0001,t0+.9);o.connect(og);og.connect(pan);o.start(t0);o.stop(t0+1);}}
  const s=c.createBufferSource();s.buffer=envNoise('brown');const lp=envFilt(c,'lowpass',near?320:dist<200?190:120,.8),g=c.createGain();envChain(c,[lp,g]);g.connect(pan);s.connect(lp);
  g.gain.setValueAtTime(.0001,t0);let tt=t0+.05;const n=3+((Math.random()*4)|0);for(let i=0;i<n;i++){tt+=.2+Math.random()*.75;const a=vol*(1-i/n*.65)*(.55+Math.random()*.45);g.gain.setTargetAtTime(a,tt-.25,.09);g.gain.setTargetAtTime(a*.25,tt,.3+Math.random()*.3);}
  g.gain.setTargetAtTime(.0001,tt+.3,.9);s.start(t0,Math.random()*2);s.stop(tt+5);};
// Altes Rauschen sicher abschalten, falls es noch läuft
{const a=wxTick;wxTick=function(dt){if(WX.amb&&WX.amb.s){try{WX.amb.s.stop();WX.amb.g.disconnect();}catch(e){}WX.amb=null;}return a(dt);};}
