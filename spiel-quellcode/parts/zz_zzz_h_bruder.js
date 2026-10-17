/* =========================================================
   0.0.112 · Quest „Der Bruder“
   - In Graf Morvans Truhe liegt ein Brief (Rechtsklick: lesen). Er führt zu einer Eisgruft in den Schneebergen
     (wird auf der Karte markiert). Dort schläft Graf Vlados, der Eisvampir: Frostkugeln, Fledermausgestalt,
     auch er stirbt nur durch einen Holzpflock. Belohnung: das Blutamulett (Treffer heilen dich).
   ========================================================= */
Object.assign(ITEMS,{vletter:{name:'Brief an Vlados',plural:'Briefe'},vamulet:{name:'Blutamulett',plural:'Blutamulette',slot:'neck'}});
Object.assign(ITEM_DESC,{vletter:'Ein vergilbter Brief mit Siegel. Rechtsklick: lesen',vamulet:'Halsschmuck. Jeder deiner Treffer heilt dich ein wenig'});
DT.vampir2=Object.assign({},DT.vampir,{name:'Graf Vlados, der Eisvampir',hp:1400,dmg:21,spd:4.1,xp:620,spr:e=>e.bat?'vbat_':'vamp2_'});
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const f of[0,1,2,'a','c','k']){const c=vpDraw(f),x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height),D=d.data;
    for(let i=0;i<D.length;i+=4){if(!D[i+3])continue;const r=D[i],g=D[i+1],b=D[i+2];if(r>g+50&&r>b+40){D[i]=Math.min(255,g*.6+30);D[i+1]=Math.min(255,r*.8+40);D[i+2]=Math.min(255,r+80);}
      else if(r<40&&g<40&&b<50){D[i]=r*1.2+10;D[i+1]=g*1.3+16;D[i+2]=b*1.6+34;}}x.putImageData(d,0,0);c.headBox=c.headBox;list.push(['vamp2_'+f,c]);}}catch(e){console.error('Vlados: Bilder',e);}};}
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(14,11),Pp=pal(['#a89878','#d0c4a4','#ece2c8']);for(let y=1;y<10;y++)for(let x=1;x<13;x++)p.set(x,y,Pp[(x+y)%7===0?0:y<3?2:1]);for(let x=3;x<11;x++){p.set(x,4,Pp[0]);p.set(x,6,Pp[0]);}mrEll(p,10,8,1.6,1.4,hex('#8a1020'));outline(p);list.push(['vletter',p.done()]);}
  {const p=new Px(12,14),G=pal(['#8a6a10','#c8a020','#f0d050']),R=pal(['#5a0610','#a01020','#ff4a5a']);for(let k=0;k<9;k++){const a=Math.PI*(k/8);p.set(6+Math.cos(a)*5,1+Math.sin(a)*4.5,G[1]);}mrEll(p,6,9,3.2,3.6,(x,y,dx,dy)=>R[shadeIdx(.65-dx*.3-dy*.3,3,x,y)]);p.set(5,8,R[2]);outline(p);list.push(['vamulet',p.done()]);}
}catch(e){console.error('Vlados: Symbole',e);}};}
// Blutamulett: Lebensraub
{const a=hurtEnt;hurtEnt=function(e,n,by){const hp0=e.hp;a(e,n,by);if(by==='player'&&equip.neck&&equip.neck.id==='vamulet'&&e.hp<hp0&&P.stats){P.stats.hp=Math.min(P.stats.maxHp,P.stats.hp+(hp0-Math.max(0,e.hp))*.08);renderStats();}};}
// ---------- Eisgruft ----------
function cryptOf(s){if(s.cpDone)return s.cp;s.cpDone=true;s.cp=null;if(s.b!=='schneeberge'||s.island)return null;const A=s.ci*7+(WSEED%100003),B=s.cj*13+((WSEED>>>7)%100019);if(hash2(A,B,7210)>.6)return null;
  const r=mulberry32(7211+s.ci*7919+s.cj*15485+WSEED*61);for(let t=0;t<40;t++){const a=r()*6.283,d=r()*s.R*.7,x=s.x+Math.cos(a)*d,z=s.z+Math.sin(a)*d;if(coreDist(x,z)<300)continue;let mn=1e9,mx=-1e9,ok=true;
    for(let q=0;q<8;q++){const ang=q*.785,h=getHeight(x+Math.cos(ang)*7,z+Math.sin(ang)*7);mn=Math.min(mn,h);mx=Math.max(mx,h);if(wlDom(x+Math.cos(ang)*7,z+Math.sin(ang)*7)!==s)ok=false;}if(!ok||mx-mn>6||mn<WATER+3)continue;
    const rot=r()*6.283;s.cp={id:s.id+'_cp',x,z,rot,c:Math.cos(rot),s:Math.sin(rot),y:mx+.3,base:mn-.5};return s.cp;}return null;}
const CRY={built:new Map(),t:0};let CRM=null;
function cryMats(){if(CRM)return CRM;const T=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const p=new Px(32,32),S=pal(['#3a5068','#4e6a84','#6a88a4','#8aa8c4','#b8d4ea']);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=Math.floor(y/8),off=row%2?8:0,seam=y%8===0||(x+off)%16===0;p.set(x,y,S[seam?0:shadeIdx(.6+(hash2((x+off)>>4,row,81)-.5)*.3+(hash2(x,y,82)-.5)*.2,5,x,y)]);if(hash2(x,y,83)<.04)p.set(x,y,hex('#eaf6ff'));}
  CRM={ice:new THREE.MeshLambertMaterial({map:T(p.done())}),glass:new THREE.MeshLambertMaterial({color:0x9ad8f0,transparent:true,opacity:.75}),dark:new THREE.MeshBasicMaterial({color:0x0a1018})};return CRM;}
function cryBuild(g){const M=cryMats(),grp=new THREE.Group(),sol=[];grp.position.set(g.x,0,g.z);grp.rotation.y=-g.rot;const W=9,D=7,H=4.4,y=g.y;
  const box=(w,h,d,m,x,yy,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,yy,z);grp.add(o);return o;};
  const wsol=(lx,lz,hw,hd,y0,y1,walk)=>{const x=g.x+lx*g.c-lz*g.s,z=g.z+lx*g.s+lz*g.c;sol.push(solAdd({x,z,hw,hd,y0,y1,rot:g.rot,solid:walk?0:1,walk:walk?1:0}));};
  box(W+2,y-g.base,D+2,M.ice,0,(y+g.base)/2,0);wsol(0,0,W/2+1,D/2+1,g.base,y,1);
  box(W,H,.6,M.ice,0,y+H/2,-D/2);wsol(0,-D/2,W/2,.3,y,y+H);box(.6,H,D,M.ice,-W/2,y+H/2,0);wsol(-W/2,0,.3,D/2,y,y+H);box(.6,H,D,M.ice,W/2,y+H/2,0);wsol(W/2,0,.3,D/2,y,y+H);
  const sw=(W-2.6)/2;box(sw,H,.6,M.ice,-W/2+sw/2,y+H/2,D/2);wsol(-W/2+sw/2,D/2,sw/2,.3,y,y+H);box(sw,H,.6,M.ice,W/2-sw/2,y+H/2,D/2);wsol(W/2-sw/2,D/2,sw/2,.3,y,y+H);box(2.6,1.2,.6,M.ice,0,y+H-.6,D/2);
  box(W+1.2,.5,D+1.2,M.ice,0,y+H+.25,0);box(W*.7,.9,D*.7,M.ice,0,y+H+.95,0);for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]])box(.9,H+.6,.9,M.ice,sx*(W/2+.1),y+(H+.6)/2,sz*(D/2+.1));
  box(1.4,1,2.6,M.ice,0,y+.5,-1.2);box(1.5,.25,2.7,M.glass,0,y+1.12,-1.2);wsol(0,-1.2,.75,1.35,y,y+1.2);for(let k=0;k<6;k++){const o=box(.3,.8+Math.random(),.3,M.glass,(Math.random()-.5)*7,y+.5,(Math.random()-.5)*5);o.rotation.z=(Math.random()-.5)*.6;}
  scene.add(grp);const B={g,grp,sol};CRY.built.set(g.id,B);return B;}
function cryFree(B){scene.remove(B.grp);B.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const s of B.sol)solDel(s);if(B.v&&!B.v.dead){vpPark(B.v);removeEnt(B.v);}CRY.built.delete(B.g.id);}
const crySarc=g=>[g.x+0*g.c-(-1.2)*g.s,g.z+0*g.s+(-1.2)*g.c];
function vladSpawn(B){const g=B.g,[sx,sz]=crySarc(g),x=sx+(-g.s)*2.4,z=sz+g.c*2.4;const e=spawnEnt('vampir2',x,z,{home:{x,z},name:'Graf Vlados',role:'Eisvampir',talk:0,airK:0,ice:1,aggroT:40});e.h0=e.h;e.special=vpAI;e.onHurt=vpHurt;
  e.onDeath=ev=>{vpPark(ev);ev.hidden=true;mzBurst(ev.x,ev.y+1,ev.z,90,[0x9ae8ff,0xeaf6ff,0x3a5068],6,1.6,.45);try{Snd.demonRoar(.9,1.7);}catch(_){}spawnDrop('vamulet',1,ev.x,ev.y+.5,ev.z);spawnDrop('coin',2,ev.x,ev.y+.5,ev.z);spawnDrop('silver',20,ev.x,ev.y+.5,ev.z);
    FLAGS.vq=2;saveGame();setTimeout(()=>toast('Graf Vlados zerfällt zu Eis und Asche. Die Brüder ruhen nun beide. Quest „Der Bruder“ abgeschlossen!'),1200);};
  VP.list.push(e);B.v=e;mzBurst(x,e.y+1,z,60,[0x9ae8ff,0x3a5068,0xeaf6ff],6,1,.4);mzSay(e,'Morvan … ist tot? Dann folgst du ihm in die Kälte!');try{Snd.demonRoar(.6,1.2);}catch(_){}return e;}
function cryTick(dt){CRY.t-=dt;if(CRY.t<=0){CRY.t=1;if(P.x<60000&&WL_READY&&!DGX.on){const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=cryptOf(wlSite(ci+a,cj+b));if(g&&!CRY.built.has(g.id)&&Math.hypot(g.x-P.x,g.z-P.z)<200)cryBuild(g);}}
    for(const B of[...CRY.built.values()])if(Math.hypot(B.g.x-P.x,B.g.z-P.z)>270||P.x>60000)cryFree(B);}
  for(const B of CRY.built.values()){const[sx,sz]=crySarc(B.g);if(FLAGS.vq===1&&!(B.v&&!B.v.dead)&&Math.hypot(sx-P.x,sz-P.z)<6&&Math.abs(P.y-B.g.y)<3&&state==='playing')vladSpawn(B);}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{cryTick(dt);}catch(e){if(!cryTick.err){cryTick.err=1;console.error('Eisgruft',e);}}};}
{const a=wlReset;wlReset=function(){for(const B of[...CRY.built.values()])cryFree(B);a();};}
{const a=startGame;startGame=function(isNew,char){for(const B of[...CRY.built.values()])cryFree(B);return a(isNew,char);};}
// ---------- Der Brief ----------
const LETTER={name:'Brief an Vlados',role:'Gefunden in Graf Morvans Sarg',talk:0,x:0,y:0,z:0,h:2,d:{id:'letter'}};
function cryNearest(){let best=null,bd=1e9;const ci=Math.floor(P.x/WL_CELL),cj=Math.floor(P.z/WL_CELL);for(let R=0;R<=40;R++){for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const g=cryptOf(wlSite(ci+a,cj+b));if(!g)continue;const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;best=g;}}if(best&&R>2)break;}return best;}
DIALOGS['Brief an Vlados']={start:()=>'read',nodes:{read:()=>({text:'„Mein Bruder Vlados,\nsie haben mich in Stein gelegt, hier im dunklen Nadelwald. Ein Priester mit seinem verfluchten Siegel. Du aber bist ihnen entkommen, hoch in die Schneeberge, wo das Eis dich bewahrt.\nWenn je ein Sterblicher diesen Brief liest, dann bin ich gefallen. Räche mich, Bruder. Und trink für uns beide.\n– Morvan“',
  opts:[{label:'Den Brief einstecken.',go:null}]})}};
{const a=rightClickUse;rightClickUse=function(){if(state==='playing'){const h=inv[HOT0+sel];if(h&&h.id==='vletter'){if(!LETTER.portrait){const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d');x.drawImage(SPR.vletter.c,4,5);LETTER.portrait=c;}
      try{$('dlgText').style.whiteSpace='pre-line';}catch(e){}openDialog(LETTER);if(FLAGS.vq!==2){if(!FLAGS.vq)FLAGS.vq=1;const g=cryNearest();if(g){FLAGS.mapMarks=FLAGS.mapMarks||[];if(!FLAGS.mapMarks.some(m=>m.vq)){FLAGS.mapMarks.push({x:g.x,z:g.z,c:'#8ad8ff',n:'Eisgruft',vq:1});}
        const d=Math.round(Math.hypot(g.x-P.x,g.z-P.z)),ang=Math.atan2(g.x-P.x,-(g.z-P.z)),dirs=['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'],dir=dirs[((Math.round(ang/(Math.PI/4))%8)+8)%8];
        setTimeout(()=>toast(`Neue Quest: Der Bruder. Die Eisgruft liegt etwa ${d} m im ${dir}. Sie ist auf deiner Karte markiert.`),400);}else setTimeout(()=>toast('Neue Quest: Der Bruder. Irgendwo in den Schneebergen liegt eine Eisgruft …'),400);saveGame();}
      return true;}}return a();};}
HELP.push(['/eisgruft','Teleport zur nächsten Eisgruft (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/eisgruft\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/eisgruft geht nur im Cheat-Modus.','err');return;}const g=cryNearest();if(!g){conLog('Keine Eisgruft gefunden.','err');return;}teleport(g.x-g.s*9,g.z+g.c*9,0);conLog('Eisgruft gefunden.','ok');closeConsole();return;}return a(raw);};}
