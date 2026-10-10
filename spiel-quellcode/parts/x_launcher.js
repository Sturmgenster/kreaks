/* =========================================================
   KREAKS Beta-2.0 (0.0.100) · Konto aus dem Launcher
   - Das Spiel läuft nur mit freigeschaltetem KREAKS-Konto (Start über den Launcher)
   - Der Spielername ist der Kontoname, Spielstände gehören zum Konto
   ========================================================= */
const KREAKS_VERSION={label:'Beta-2.0',build:'0.0.100'};
const KACC=(typeof window!=='undefined'&&window.KREAKS_ACCOUNT)||null;

// Startbildschirm: Version anzeigen
{const m=document.getElementById('menu');if(m){const v=document.createElement('div');v.id='verTag';v.textContent=KREAKS_VERSION.label+' · '+KREAKS_VERSION.build;
  v.style.cssText='position:absolute;right:16px;top:12px;font:13px var(--f-title);letter-spacing:.08em;color:var(--gold);text-shadow:0 2px 0 var(--edge-dark);pointer-events:none';m.appendChild(v);}}

// Ohne Konto: Spiel sperren, wenn es außerhalb des Launchers gestartet wurde.
// (Entwickler-Vorschau im Browser und die Testversion bleiben offen.)
{const viaLauncher=location.protocol==='kreaks:';
 const isTest=/test\.html$/.test(location.pathname)||window.KREAKS_DEV===true;   // Testversion bzw. Entwickler-Paket für die KREA-Engine
 const blocked=!isTest&&((viaLauncher&&!(KACC&&KACC.licensed))||(location.protocol==='file:'));
 if(blocked){const d=document.createElement('div');d.id='accBlock';
   d.innerHTML=`<div class="ab-in"><h1>KREAKS</h1><p>${viaLauncher?'Dein Konto ist noch nicht freigeschaltet.':'KREAKS startest du über den KREAKS Launcher.'}</p><small>${viaLauncher?'Löse im Launcher einen Key ein und starte das Spiel neu.':'Melde dich dort mit deinem Konto an und klicke auf „Spielen“.'}</small></div>`;
   d.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(6,10,7,.94);color:var(--ink);text-align:center;font-family:var(--f-ui)';
   const st=document.createElement('style');st.textContent='#accBlock h1{font:700 64px var(--f-title);color:var(--gold);margin:0 0 18px;text-shadow:0 5px 0 var(--gold-deep)}#accBlock p{font-size:22px;margin:0 0 8px}#accBlock small{color:var(--muted);font-size:16px}';
   document.head.appendChild(st);document.body.appendChild(d);
   try{state='blocked';}catch(e){}
   addEventListener('keydown',e=>{e.stopImmediatePropagation();},true);}
}

if(KACC&&KACC.uuid){
  const accId=String(KACC.uuid).replace(/[^a-z0-9]/gi,'').toLowerCase();
  // Feste Spieler-ID aus der Konto-UUID: gleiche ID auf jedem PC, Sperren im Mehrspieler gelten fürs Konto
  const accPid='a'+accId.slice(0,12);
  mpPid=function(){return accPid;};

  // Spielstände pro Konto. Beim allerersten Konto werden vorhandene Spielstände übernommen.
  {const NS='acc_'+accId.slice(0,12)+':';
   try{
     if(!localStorage.getItem('kreaks_migrated')){
       const keys=[];for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));
       for(const k of keys)if(k&&k.startsWith('kreaks_')&&!k.includes(':')&&localStorage.getItem(NS+k)==null)localStorage.setItem(NS+k,localStorage.getItem(k));
       localStorage.setItem('kreaks_migrated',accId);}
   }catch(e){}
   const g0=store.get.bind(store),s0=store.set.bind(store);
   // Einstellungen gelten für den ganzen PC (nicht pro Konto). Früher landeten sie im Konto-Bereich,
   // wurden beim Start aber aus dem allgemeinen Bereich gelesen – deshalb waren sie nach dem Neustart weg.
   {const ns=g0(NS+SET_KEY);if(ns&&typeof ns==='object'){s0(SET_KEY,ns);try{localStorage.removeItem(NS+SET_KEY);}catch(e){}
      Object.assign(settings,ns);settings.keys=Object.assign({},DEFAULTS.keys,ns.keys||{});}}
   store.get=k=>k===SET_KEY?g0(k):g0(NS+k);store.set=(k,v)=>k===SET_KEY?s0(k,v):s0(NS+k,v);
   // Spielstand löschen: auch im Konto-Bereich
   {const rm=Storage.prototype.removeItem;Storage.prototype.removeItem=function(k){rm.call(this,k);try{if(this===localStorage&&typeof k==='string'&&k.startsWith('kreaks_')&&!k.includes(':'))rm.call(this,NS+k);}catch(e){}};}}

  // Spielername = Kontoname (auch bei alten Spielständen)
  {const a=startGame;startGame=function(isNew,char){if(char)char.name=KACC.name||char.name;const r=a.apply(this,arguments);
    try{if(P.char){P.char.name=KACC.name||P.char.name;if(!P.char.world&&!isNew)P.char.world='Welt von '+P.char.name;}}catch(e){}return r;};}

  // Anzeige im Hauptmenü
  {const m=document.getElementById('menu');if(m){const d=document.createElement('div');d.id='accTag';d.textContent='Angemeldet als '+(KACC.name||'Spieler');
    d.style.cssText='position:absolute;right:16px;bottom:12px;font:14px var(--f-ui);color:var(--muted);text-shadow:0 2px 0 var(--edge-dark);pointer-events:none';m.appendChild(d);}}
}
