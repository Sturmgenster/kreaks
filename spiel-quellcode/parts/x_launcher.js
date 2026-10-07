/* =========================================================
   KREAKS Launcher: Konto aus dem Launcher übernehmen
   ========================================================= */
const KACC=(typeof window!=='undefined'&&window.KREAKS_ACCOUNT)||null;
if(KACC&&KACC.uuid){
  // Feste Spieler-ID aus der Konto-UUID: gleiche ID auf jedem PC, Sperren gelten fürs Konto
  const accPid='a'+String(KACC.uuid).replace(/[^a-z0-9]/gi,'').toLowerCase().slice(0,12);
  mpPid=function(){return accPid;};
  // Charaktername mit dem Kontonamen vorbelegen
  {const inp=document.getElementById('ccName');if(inp){const fill=()=>{if(!inp.value)inp.value=KACC.name||'';};new MutationObserver(fill).observe(inp,{attributes:true});inp.addEventListener('focus',fill);}}
  // Anzeige im Hauptmenü
  {const m=document.getElementById('menu');if(m){const d=document.createElement('div');d.id='accTag';d.textContent='Angemeldet als '+(KACC.name||'Spieler')+(KACC.demo?' (Demo)':'');
    d.style.cssText='position:absolute;right:16px;bottom:12px;font:14px var(--f-ui);color:var(--muted);text-shadow:0 2px 0 var(--edge-dark);pointer-events:none';m.appendChild(d);}}
}
