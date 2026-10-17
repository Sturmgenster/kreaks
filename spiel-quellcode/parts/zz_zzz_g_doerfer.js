/* =========================================================
   0.0.112 · Neue Dörfer
   - Fischerdörfer an den Küsten: Fischer mit Steg, Händler für Angel- und Tauchsachen
   - Elfendörfer in Wäldern: helle Häuser mit grünen Dächern, Händler für Bögen, Pfeile und Tränke
   ========================================================= */
const VLG_LOOK={f:[{skin:0,hair:'short',hairColor:'brown',beard:'short',cloth:'vest',clothColor:'blue',pants:'brown'},{sex:'f',skin:2,hair:'braid',hairColor:'blond',cloth:'dress',clothColor:'teal',pants:'brown'},
    {skin:1,hair:'none',beard:'long',hairColor:'grey',cloth:'tunic',clothColor:'cream',pants:'grey',age:'old'},{skin:3,hair:'short',hairColor:'black',cloth:'leather',clothColor:'brown',pants:'blue'},
    {sex:'f',skin:0,hair:'long',hairColor:'red',cloth:'tunic',clothColor:'blue',pants:'brown'},{skin:2,hair:'wild',hairColor:'brown',beard:'short',cloth:'vest',clothColor:'green',pants:'brown'}],
  e:[{race:'elf',hair:'long',hairColor:'blond',cloth:'robe',clothColor:'green',pants:'grey'},{race:'elf',sex:'f',hair:'long',hairColor:'blond',cloth:'dress',clothColor:'cream',pants:'grey'},
    {race:'elf',hair:'short',hairColor:'brown',cloth:'leather',clothColor:'green',pants:'brown'},{race:'elf',sex:'f',hair:'braid',hairColor:'red',cloth:'robe',clothColor:'purple',pants:'grey'},
    {race:'elf',hair:'long',hairColor:'black',cloth:'tunic',clothColor:'teal',pants:'grey'},{race:'elf',sex:'f',hair:'long',hairColor:'brown',cloth:'dress',clothColor:'green',pants:'brown',age:'old'}]};
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k of['f','e'])VLG_LOOK[k].forEach((L,i)=>{const c=Object.assign(defaultChar(),{beard:'none',eyes:'gold'},L);for(const f of[0,1,2])list.push(['vlg_'+k+i+'_'+f,drawHero(c,f)]);});}catch(e){console.error('Dörfer: Bilder',e);}};}
for(const k of['f','e'])for(let i=0;i<6;i++)DT['vlg_'+k+i]={name:k==='f'?'Fischer':'Elf',fac:'neutral',hero:1,h:k==='e'?1.85:1.78,hp:80,dmg:0,spd:1.1,reach:.5,cd:2,spr:'vlg_'+k+i+'_',aggro:.01,rad:.3};
const VLG_NAMES={f:['Möwenbucht','Salzhafen','Kliffwacht','Muschelstrand','Tangwiek'],e:['Silberlaub','Mondhain','Sternenwipfel','Taublatt','Lichtgrund']};
const VLG_TR={f:['Fischer Hannes','Fischerin Maren','Kapitän Jorge'],e:['Elarwen','Thalion','Liriel']};
const VLG_LINES={f:['Heute beißen sie gut!','Pass auf die Haie auf, da draußen.','Mein Großvater hat einen Wal gesehen. So groß wie ein Haus!','Riecht nach Sturm … oder nach Fisch.','Wer taucht, braucht gute Lungen. Oder einen Helm.'],
  e:['Möge das Licht der Sterne dich leiten.','Die Bäume erzählen von dir, Wanderer.','Ein guter Bogen ist ein Freund fürs Leben.','Wir Elfen leben lange. Und wir vergessen nichts.','Hörst du den Wald atmen?']};
for(const n of VLG_TR.f){SHOPS[n]={title:n+'s Fischerbude',greet:'Angeln, Tauchen, frischer Fisch! Und was du aus dem Meer holst, kaufe ich dir ab.',
  buy:[['rod',25],['seafish',5],['pbreath',90],['flippers',140],['divehelm',320],['kelp',2]].filter(q=>ITEMS[q[0]]),sell:[['seafish',5],['shell',4],['pearl',40],['kelp',2],['sharktooth',14],['coral',8],['tentacle',6]].filter(q=>ITEMS[q[0]])};}
for(const n of VLG_TR.e){SHOPS[n]={title:n+'s Waldladen',greet:'Bögen aus Mondholz, Pfeile, die nie fehlgehen, und Tränke aus Sternenblüten.',
  buy:[['bow',120],['arrow',3],['pregen',470],['pmana',280],['hpot2',110],['hpot',38]].filter(q=>ITEMS[q[0]]),sell:[['flower',3],['glowgland',14],['frostflower',12],['swampherb',4],['berries',2],['mushroom',4]].filter(q=>ITEMS[q[0]])};}
for(const n of VLG_TR.f.concat(VLG_TR.e)){const elf=VLG_TR.e.includes(n);DIALOGS[n]={start:()=>'hello',nodes:{
  hello:()=>({text:elf?'Sei gegrüßt, Wanderer. Selten verirren sich Menschen in unseren Hain. Was suchst du?':'Ahoi! Lust auf Fisch? Oder willst du ins Wasser? Ich hab alles, was du brauchst.',opts:[{label:'Zeig mir deine Waren.',act:()=>{openShop(n);return null;}},{label:elf?'Erzähl mir vom Wald.':'Was gibt es im Meer?',go:'info'},{label:'Leb wohl.',go:null}]}),
  info:()=>({text:elf?'Tief im Wald liegen alte Gewölbe aus der Zeit vor uns. Wer hinabsteigt, braucht Licht und Mut. Und weit im Norden, in den Schneebergen, schläft etwas Kaltes in einer Gruft aus Eis.':
    'Draußen wird das Wasser schwarz und tief. Da leben Wale, Kraken und noch Schlimmeres. Und manchmal sieht man Lichter unten am Grund. Man sagt, dort liegt eine Stadt, die das Meer verschluckt hat. Und ein König, der sie bewacht.',opts:[{label:'Zurück.',go:'hello'}]})}};}
// ---------- Lage ----------
function vlgOf(s){if(s.vgDone)return s.vg;s.vgDone=true;s.vg=null;const k=s.b==='kueste'&&!s.island?'f':['wald','redwood','nadel2'].includes(s.b)?'e':null;if(!k)return null;
  const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,7110)>(k==='f'?.4:.25))return null;const r=mulberry32(7111+s.ci*7919+s.cj*15485+WSEED*59);
  for(let t=0;t<30;t++){const a=r()*6.283,d=r()*s.R*.5,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<300)continue;const y=getHeight(x,z);if(y<WATER+.8||y>40)continue;let mn=1e9,mx=-1e9,ok=true;
    for(let q=0;q<8;q++){const ang=q*.785,h=getHeight(x+Math.cos(ang)*16,z+Math.sin(ang)*16);mn=Math.min(mn,h);mx=Math.max(mx,h);if(h<WATER+.4){ok=false;}}if(!ok||mx-mn>5)continue;
    let wa=null;if(k==='f'){for(let q=0;q<16&&wa==null;q++){const ang=q*.3927;for(let dd=18;dd<45;dd+=3){if(getHeight(x+Math.cos(ang)*dd,z+Math.sin(ang)*dd)<WATER-1.2){wa={ang,dd};break;}}}if(!wa)continue;}
    s.vg={id:s.id+'_vg',k,x,z,y,wa,name:VLG_NAMES[k][(r()*VLG_NAMES[k].length)|0],tr:VLG_TR[k][(r()*VLG_TR[k].length)|0],seed:(A*13+B*7+WSEED)|0};return s.vg;}return null;}
const VLG={built:new Map(),t:0,cur:null};
let VLM=null;function vlgMats(){if(VLM)return VLM;const B=bMats(),T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const tex=(cols,fn)=>{const p=new Px(32,32),S=pal(cols);for(let y=0;y<32;y++)for(let x=0;x<32;x++)p.set(x,y,S[fn(x,y,S.length)]);return T(p.done());};
  VLM={wood:B.wood,stone:B.stone,roof:B.roof,thatch:new THREE.MeshLambertMaterial({map:tex(['#5a4a1a','#7a6624','#9a8232','#b89c44'],(x,y,n)=>shadeIdx(.5+(y%4)/10+(hash2(x,y>>2,71)-.5)*.4,n,x,y))}),
    white:new THREE.MeshLambertMaterial({map:tex(['#b8b4a4','#d0ccbc','#e4e0d2','#f2eee2'],(x,y,n)=>shadeIdx(.6+(hash2(x>>2,y>>2,72)-.5)*.3,n,x,y))}),
    leaf:new THREE.MeshLambertMaterial({map:tex(['#1e4a1a','#2e6a24','#3e8a2e','#5aa83a'],(x,y,n)=>shadeIdx(.55+(hash2(x>>1,y>>1,73)-.5)*.6,n,x,y))}),
    dark:new THREE.MeshLambertMaterial({color:0x1a120c}),glow:new THREE.MeshBasicMaterial({color:0xffe08a}),glow2:new THREE.MeshBasicMaterial({color:0x9af0c0})};return VLM;}
function vlgBuild(g){const M=vlgMats(),r=mulberry32(g.seed>>>0),grp=new THREE.Group(),sol=[],ents=[];const B={g,grp,sol,ents};VLG.built.set(g.id,B);const elf=g.k==='e';
  const box=(w,h,d,m,x,y,z,ry,rz)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;if(rz)o.rotation.z=rz;grp.add(o);return o;};
  const n=elf?5:4+((r()*2)|0);const avoid=g.wa?g.wa.ang:null;
  for(let i=0;i<n;i++){let a=i/n*6.283+r()*.4;if(avoid!=null&&Math.abs(((a-avoid+9.42)%6.283)-3.14)<.5)a+=.9;const R=11+r()*4,x=g.x+Math.cos(a)*R,z=g.z+Math.sin(a)*R,y=getHeight(x,z),w=4.6+r()*1.4,d=4.4+r()*1,h=elf?3.4:2.9,rot=Math.atan2(g.x-x,g.z-z);
    const hg=new THREE.Group();hg.position.set(x,y-.4,z);hg.rotation.y=rot;grp.add(hg);const hb=(ww,hh,dd,m,px,py,pz,rz)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(ww,hh,dd),m);o.position.set(px,py,pz);if(rz)o.rotation.z=rz;hg.add(o);return o;};
    hb(w,h+.4,d,elf?M.white:(r()<.5?M.wood:M.stone),0,(h+.4)/2,0);hb(1.1,1.9,.12,M.dark,0,1.35,d/2+.02);for(const sx of[-1,1])hb(.8,.7,.12,elf?M.glow2:M.dark,sx*w*.3,2.1,d/2+.02);
    const rw=Math.hypot(w/2+.4,1.4);for(const sx of[-1,1]){const o=hb(rw,.22,d+.6,elf?M.leaf:M.thatch,sx*(w/4+.1),h+.4+.7,0,sx*-.6);}hb(.3,1.8,d+.6,elf?M.leaf:M.thatch,0,h+.4+1.25,0);
    sol.push(solAdd({x,z,hw:w/2,hd:d/2,y0:y-1,y1:y+h+2,rot:-rot,solid:1}));}
  // Steg (Fischerdorf)
  if(g.wa){const L=g.wa.dd+10,ang=g.wa.ang,c=Math.cos(ang),s=Math.sin(ang);for(let k=4;k<L;k+=1){const x=g.x+c*k,z=g.z+s*k,gy=getHeight(x,z),y=Math.max(gy,WATER+.45);const o=box(2.2,.18,1.05,M.wood,x,y,z,-ang+Math.PI/2);if(k%3===0&&gy<y-.5){box(.18,y-gy+.6,.18,M.wood,x+s*1,gy+(y-gy)/2-.2,z-c*1);box(.18,y-gy+.6,.18,M.wood,x-s*1,gy+(y-gy)/2-.2,z+c*1);}
      const sb=solAdd({x,z,hw:.53,hd:1.1,y0:y-.1,y1:y+.09,rot:ang,walk:1});sol.push(sb);}
    for(let k=0;k<4;k++)box(.7,.9,.7,M.wood,g.x+(r()-.5)*6,getHeight(g.x,g.z)+.45,g.z+(r()-.5)*6,r());}
  // Laternen (Elfen)
  if(elf)for(let k=0;k<6;k++){const a=k/6*6.283,x=g.x+Math.cos(a)*6,z=g.z+Math.sin(a)*6,y=getHeight(x,z);box(.12,2.2,.12,M.wood,x,y+1.1,z);box(.35,.35,.35,M.glow,x,y+2.3,z);}
  // Brunnen / Feuerstelle in der Mitte
  {const y=getHeight(g.x,g.z);if(elf){box(2.2,.5,2.2,M.white,g.x,y+.25,g.z);box(.5,1.6,.5,M.white,g.x,y+1,g.z);box(.6,.6,.6,M.glow2,g.x,y+2,g.z);}else{for(let k=0;k<6;k++){const a=k/6*6.283;box(.5,.4,.5,M.stone,g.x+Math.cos(a)*1,y+.2,g.z+Math.sin(a)*1);}}
    sol.push(solAdd({x:g.x,z:g.z,hw:1.1,hd:1.1,y0:y-1,y1:y+.5,rot:0,solid:1}));}
  scene.add(grp);
  // Bewohner
  const cnt=4+((r()*2)|0);for(let i=0;i<cnt;i++){const a=r()*6.283,R=4+r()*5,x=g.x+Math.cos(a)*R,z=g.z+Math.sin(a)*R,look=(r()*6)|0,tr=i===0;
    const e=spawnEnt('vlg_'+g.k+look,x,z,{home:{x:g.x+(tr?Math.cos(a)*3:0),z:g.z+(tr?Math.sin(a)*3:0)},name:tr?g.tr:(g.k==='f'?['Fischer','Fischerin','Seemann','Netzflickerin'][i%4]:['Elfe','Waldläufer','Hüterin','Sänger'][i%4]),role:tr?(g.k==='f'?'Händler · '+g.name:'Händlerin · '+g.name):g.name,vlgTrader:tr,talk:0,vlg:g.k});
    if(tr){e.wander=false;e.portrait=vlgPortrait('vlg_'+g.k+look+'_0');}ents.push(e);}
  return B;}
function vlgPortrait(k){const s=SPR[k];if(!s)return null;const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d'),hb=s.c.headBox||[18,26,6,15];x.fillStyle='#1a2418';x.fillRect(0,0,22,22);x.drawImage(s.c,-(((hb[0]+hb[1])>>1)-11),-(hb[2]-4));return c;}
function vlgFree(B){scene.remove(B.grp);B.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const s of B.sol)solDel(s);for(const e of B.ents)if(DEM.includes(e))removeEnt(e);VLG.built.delete(B.g.id);}
function vlgTick(dt){VLG.t-=dt;if(VLG.t<=0){VLG.t=1;if(P.x<60000&&WL_READY&&!DGX.on){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=vlgOf(wlSite(ci+a,cj+b));if(g&&!VLG.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<190)vlgBuild(g);}}
    for(const B of[...VLG.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>260||P.x>60000)vlgFree(B);
    let cur=null;for(const B of VLG.built.values())if(Math.hypot(B.g.x-P.x,B.g.z-P.z)<28)cur=B.g;if(cur&&VLG.cur!==cur.id&&state==='playing'){showArea((cur.k==='f'?'Fischerdorf ':'Elfendorf ')+cur.name);}VLG.cur=cur?cur.id:null;
    for(const B of VLG.built.values())for(const e of B.ents){if(e.dead||e.vlgTrader)continue;if(Math.hypot(e.x-P.x,e.z-P.z)<6&&time-(e.chatT||-99)>25&&Math.random()<.3){e.chatT=time;say(e,VLG_LINES[e.vlg][(Math.random()*VLG_LINES[e.vlg].length)|0],3);}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{vlgTick(dt);}catch(e){if(!vlgTick.err){vlgTick.err=1;console.error('Dörfer',e);}}};}
function vlgLooked(){for(const B of VLG.built.values())for(const e of B.ents)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<3.6&&lookingAt(e.x,e.y+1.3,e.z,4.4,.8))return e;return null;}
{const a=storyUse;storyUse=function(){if(state==='playing'&&P.x<60000){const e=vlgLooked();if(e){if(e.vlgTrader){openDialog(e);}else say(e,VLG_LINES[e.vlg][(Math.random()*VLG_LINES[e.vlg].length)|0],3);return true;}}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){if(P.x<60000){const e=vlgLooked();if(e)return e.vlgTrader?'Mit '+e.name+' handeln':'Mit '+e.name+' reden';}return a();};}
{const a=startGame;startGame=function(isNew,char){for(const B of[...VLG.built.values()])vlgFree(B);return a(isNew,char);};}
{const a=wlReset;wlReset=function(){for(const B of[...VLG.built.values()])vlgFree(B);a();};}
HELP.push(['/dorf','Teleport zum nächsten Fischer- oder Elfendorf (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/dorf\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/dorf geht nur im Cheat-Modus.','err');return;}let best=null,bd=1e9;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL),want=/elf/i.test(t)?'e':/fisch/i.test(t)?'f':null;
    for(let R=0;R<=25&&!best;R++)for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const g=vlgOf(wlSite(ci+a,cj+b));if(!g||(want&&g.k!==want))continue;const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;best=g;}}
    if(!best){conLog('Kein Dorf in der Nähe gefunden.','err');return;}teleport(best.x+7,best.z+7,0);conLog(`${best.k==='f'?'Fischerdorf':'Elfendorf'} ${best.name} (${Math.round(bd)} m).`,'ok');closeConsole();return;}return a(raw);};}
// Dorfplatz: keine Bäume zwischen den Häusern
WLB.dorf={n:'Dorf',mus:'orte/coda',gloom:0,cave:0,reg:'old'};WLV.dorf=[['grass',.12,.4,.55,0,.08],['flower',.03,.35,.45,0,.05]];WLP.dorf=WLP.ebene;
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){const b=a(s,x,z);if(b==='meer'||b==='tiefsee')return b;const g=s.vgDone?s.vg:(['kueste','wald','redwood','nadel2'].includes(s.b)?vlgOf(s):null);if(g&&Math.hypot(x-g.x,z-g.z)<21)return'dorf';
  const d=s.dgDone?s.dg:(DG_BIO.has(s.b)?dgOf(s):null);if(d&&Math.hypot(x-d.x,z-d.z)<6)return'dorf';return b;};}
{const a=areaAt;areaAt=function(x,z){const k=a(x,z);if(k!=='wl_dorf')return k;const b=wlDom(x,z).b;if(!AREAS['wl_'+b]&&WLB[b]){AREAS['wl_'+b]=WLB[b].n;AREA_MUSIC['wl_'+b]=WLB[b].mus;}return'wl_'+b;};}
try{FA_BIO.dorf=[];FA_TGT.dorf=0;}catch(e){}
