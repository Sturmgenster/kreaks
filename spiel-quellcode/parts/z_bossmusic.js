/* =========================================================
   Eigener Regler für Boss-Musik
   - Bosskampf-Musik hat ihre eigene Lautstärke und läuft auch,
     wenn die normale Musik auf 0 steht
   - Startet ein Bosskampf, endet die normale Musik (wie bisher)
   ========================================================= */
DEFAULTS.bossMusic=60;if(settings.bossMusic==null)settings.bossMusic=60;
const isBossTrack=k=>!!k&&k.startsWith('bosskampf/');
function bossMusicVol(){return Math.pow((settings.bossMusic==null?60:settings.bossMusic)/100,1.4)*.85;}
sliders.push(['sBoss','oBoss','bossMusic',v=>v+'%']);
$('sBoss').addEventListener('input',e=>{settings.bossMusic=+e.target.value;$('oBoss').textContent=settings.bossMusic+'%';saveSettings();});
updateMusic=function(dt){const want=musicPick();if(!Mus.cur||Mus.cur.k!==want)musicPlay(want);
  const V=musicVol(),B=bossMusicVol();
  for(let i=Mus.els.length-1;i>=0;i--){const m=Mus.els[i],vol=isBossTrack(m.k)?B:V;
    if(m.retry&&m===Mus.cur&&(Snd.ctx||Mus.user)){m.retry=false;const p=m.el.play();if(p&&p.catch)p.catch(()=>{m.retry=true;});}
    m.v=clamp(m.v+m.fade*dt/1.6,0,1);m.el.volume=clamp(m.v*vol,0,1);
    if(m.fade<0&&m.v<=0){m.el.pause();m.el.removeAttribute('src');try{m.el.load();}catch(e){}Mus.els.splice(i,1);}}};
