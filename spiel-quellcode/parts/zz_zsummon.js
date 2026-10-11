/* =========================================================
   /summon (0.0.104) – Wesen herbeirufen (nur im Cheat-Modus)
   /summon <Name> [Anzahl]   z. B. /summon zombie 3, /summon lich, /summon höllenhund
   /summon                   zeigt alle Namen
   Es gibt bewusst keinen Befehl zum Entfernen.
   ========================================================= */
// Was man rufen kann: [Anzeigename, Aliasse, Rufen(x,z)]
const SUMMON=[];
function smAdd(name,alias,fn){SUMMON.push({name,keys:[name,...alias].map(norm),fn});}
const smEnt=(t,o)=>(x,z)=>{const e=spawnEnt(t,x,z,Object.assign({home:{x,z},aggroT:0,cmd:1},o||{}));return e;};
const smUnd=(t,o)=>(x,z)=>{const e=spawnEnt(t,x,z,Object.assign({home:{x,z},rise:0,cmd:1,v:(Math.random()*3)|0},o||{}));e.special=mzMember;MZ.und.push(e);return e;};
const smLich=(k,elder)=>(x,z)=>{if(elder){const e=mzSpawnLich(x,z,true);e.cmd=1;return e;}const t='lich'+(k||'fisb'[(Math.random()*4)|0]),L=spawnEnt(t,x,z,{rise:0,home:{x,z},cmd:1});L.special=mzLichAI;L.sq=mzSquad(L,'lich');L.sq.pat=Math.random()<.5?'ring':'zange';MZ.und.push(L);mzBurst(x,L.y+1,z,50,[0x7aff3a,0x5a4a34,0x2a1a0e],7,1.2,.45);return L;};
smAdd('Zombie',['zombies'],smUnd('zombie'));
smAdd('Skelett',['skelette'],smEnt('nskel'));
smAdd('Skelettkrieger',['skelettschwert'],smUnd('usks'));
smAdd('Gepanzerter Skelettkrieger',[],smUnd('usksa'));
smAdd('Skelettberserker',['skelettaxt'],smUnd('uska'));
smAdd('Gepanzerter Skelettberserker',[],smUnd('uskaa'));
smAdd('Skelett mit Schild',['skelettschild'],smUnd('uskh'));
smAdd('Gepanzertes Skelett mit Schild',[],smUnd('uskha'));
smAdd('Skelettschütze',['skelettbogen','skelettbogenschuetze'],smUnd('uskb'));
smAdd('Gepanzerter Skelettschütze',[],smUnd('uskba'));
smAdd('Lich',['liche'],smLich(null));
smAdd('Feuerlich',['lichfeuermagier','feuermagier'],smLich('f'));
smAdd('Frostlich',['lichfrostmagier','frostmagier'],smLich('i'));
smAdd('Beschwörerlich',['lichbeschwoerer','beschwoerer'],smLich('s'));
smAdd('Schattenlich',['lichschattenklinge','schattenklinge'],smLich('b'));
smAdd('Elderlich',['elder','elderliche'],smLich(null,true));
smAdd('Troll',['trolle'],(x,z)=>{const e=smEnt('troll')(x,z);e.special=mzTrollAI;return e;});
smAdd('Kobold',['kobolde'],(x,z)=>smEnt('kobold',{v:(Math.random()*3)|0})(x,z));
smAdd('Horde',['trollhorde','koboldhorde'],(x,z)=>{const H=mzSpawnHorde(x,z);for(const m of H.members)m.cmd=1;return H.members[0];});
smAdd('Riesenratte',['ratte','ratten'],smEnt('nrat'));
smAdd('Imp',['imps'],smEnt('imp'));
smAdd('Höllenhund',['hoellenhunde','hund'],smEnt('hound'));
smAdd('Dämonenkrieger',['daemon','daemonen'],smEnt('warrior'));
smAdd('Höllenritter',['ritter'],smEnt('knight'));
smAdd('Wolf',['woelfe'],smEnt('wolfd'));
for(const[k,nm,al]of[['g_skelwar','Großer Skelettkrieger',[]]])if(DT[k])smAdd(nm,al,smEnt(k));
function smFind(q){const n=norm(q);if(!n)return[];const ex=SUMMON.filter(s=>s.keys.includes(n));if(ex.length)return ex;return SUMMON.filter(s=>s.keys.some(k=>k.startsWith(n)));}
HELP.push(['/summon <Name> [Anzahl]','Ruft ein Wesen vor dich (nur im Cheat-Modus), z. B. /summon zombie 3. Ohne Name: alle Namen']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();
  if(/^\/summon\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/summon geht nur im Cheat-Modus. Benutze erst /cheats on.','err');return;}
    const rest=t.replace(/^\/summon\s*/i,'').trim();
    if(!rest){conLog('Du kannst rufen: '+SUMMON.map(s=>s.name).join(', '),'sys');return;}
    let m=/^(.*?)\s+(\d+)$/.exec(rest),name=m?m[1]:rest,n=m?Math.max(1,Math.min(10,+m[2])):1;
    const L=smFind(name);
    if(!L.length){conLog(`„${esc(name)}“ kenne ich nicht. Gib /summon ohne Namen ein, um alle Namen zu sehen.`,'err');return;}
    if(L.length>1){conLog('Meinst du: '+L.slice(0,8).map(s=>s.name).join(', ')+'?','err');return;}
    const S=L[0];
    const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),big=/troll|horde|elderlich|ritter/i.test(S.name)?8:5;let ok=0;
    for(let i=0;i<n;i++){const a=(i-(n-1)/2)*.35,d=big+Math.floor(i/6)*2,x=P.x+(fx*Math.cos(a)-fz*Math.sin(a))*d,z=P.z+(fz*Math.cos(a)+fx*Math.sin(a))*d;
      try{if(S.fn(x,z))ok++;}catch(e){console.error('summon',e);}}
    if(ok){conLog(`${ok}× ${S.name} gerufen.`,'ok');toast(`${ok>1?ok+'× ':''}${S.name} erscheint!`);closeConsole();}else conLog(`${S.name} konnte hier nicht erscheinen.`,'err');return;}
  return a(raw);};}
