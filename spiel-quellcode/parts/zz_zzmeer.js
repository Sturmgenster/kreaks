/* 0.0.110 · /summon für Meerestiere (nach /summon geladen) */
// /summon für Meerestiere (nur im Wasser sinnvoll)
try{for(const k of['shark','orca','whale','kraken','plesio','megalodon','dolphin','turtle','octopus','squid','jelly','seahorse','tuna'])smAdd(SEA[k].n,[k,SEA[k].n.toLowerCase()+'e'],(x,z)=>{const H=seaHab(x,z);if(!H||H.d<SEA[k].min){conLog('Das geht nur über tiefem Wasser.','err');return null;}
  const S=SEA[k],n=S.g[0],y=clamp(P.y,WATER-H.d+S.min,WATER-.5);let lead=null;for(let i=0;i<n;i++){const c=seaMake(S,x+(i?(Math.random()-.5)*4:0),y,z+(i?(Math.random()-.5)*4:0),lead);if(!lead)lead=c;}return lead;});}catch(e){}
