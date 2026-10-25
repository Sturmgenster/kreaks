/* =========================================================
   0.0.136 · Gewölbe (Dungeons) überarbeitet
   Fehler behoben:
   - Monster und Wächter entstanden an der Oberfläche statt unten im Gewölbe (das Gewölbe war leer, die Bosstruhe blieb versiegelt)
   - Unsichtbare Bäume, Felsen und Stege der Oberfläche blockierten die Gänge
   - Monster bemerkten dich durch Wände und schossen durch Wände; jetzt brauchen sie freie Sicht, Geschosse prallen an Wänden ab
   - Monster liefen gegen Wände; jetzt finden sie den Weg durch die Türen von Raum zu Raum (auch Kreak und Begleiter)
   - Fackeln, Hebel und Bosstruhe standen teils mitten in Türöffnungen; die Treppe nach oben versperrte manchmal eine Tür
   - Beim Verlassen landete man je nach Drehung des Eingangs hinter dem Torbogen
   - Lädt man einen Spielstand, der im Gewölbe gespeichert wurde, steht man jetzt am Eingang statt irgendwo im Gelände
   Neu:
   - 1 bis 3 Ebenen pro Gewölbe: eine Treppe führt tiefer, unten wartet der Wächter. Tiefere Ebenen sind größer und härter.
   - Themen je nach Gegend: Gruft, Eisgewölbe (Schnee), Grabmal (Wüste/Savanne), Tempel (Dschungel), Versunkenes Gewölbe (Sumpf)
     mit eigenen Steinen, Licht, Monstern und Wächtern (Frostfürst, Grabkönig, Tempeltroll, Weberkönigin, Rattenkönig, Gruftschlinger)
   - Neue Räume: Schatzkammer, Bibliothek (alte Bücher, manchmal eine Zauberrolle), Schrein (heilt), Kerker (Gefangene befreien),
     Alchemielabor, Brunnen der Heilung, Waffenkammer, Grabkammer (Sarkophage), Spinnennest, Säulenhalle
   - Neue Fallen: Flammenwerfer und Pfeilfallen. Mimics: manche Truhen beißen zurück.
   - Säulen, Deckenbalken, Türbögen, Fackeln mit echtem Licht, Spinnweben, Knochen, Ketten, Geröll; Geheimräume bleiben offen
   ========================================================= */
const DG2={lights:[],lt:0,M:{},bld:false,used:new Set(),fcd:{},armT:0};
{const a=dgOf;dgOf=function(s){const g=a(s);if(g&&!g.b)g.b=s.b;return g;};}
const DG_THEMES={
  gruft:{n:'Gruft',wall:['#26242a','#34323a','#43414a','#525059','#62606a'],moss:'#2e4a26',mossA:.035,floor:['#1e1c1a','#2a2724','#36322e','#433e38'],ceil:['#121114','#19181c','#211f25','#29272e'],acc:['#3a3a40','#4a4a52','#5c5c64','#6e6e78'],
    fog:[.012,.011,.014],torch:0xffa040,fire:0xffa030,hemi:.4,water:0x2a4a6a,glow:0xa8f0ff,
    mobs:[['zombie','usks','uska','uskh','uskb','nskel','nrat','bat'],['usksa','uskaa','uskha','uskba','zombie','troll'],['usksa','uskaa','uskha','uskba','troll','LICH']],boss:['dgboss','LICH','dgb_ghoul']},
  eis:{n:'Eisgewölbe',wall:['#2a3442','#36465a','#465a70','#587088','#6e88a2'],moss:'#d8eefc',mossA:.05,floor:['#26303c','#303c4a','#3c4a5a','#4a5a6c'],ceil:['#18202a','#202a36','#283442','#30404e'],acc:['#4a5a6e','#5a6e84','#6e849c','#86a0b8'],
    fog:[.03,.045,.07],torch:0x9ad0ff,fire:0x8ad8ff,hemi:0.46,water:0x6ab8e8,glow:0x9ae8ff,
    mobs:[['usks','uska','uskh','uskb','wolfd','bat'],['usksa','uskha','uskba','wolfd','troll'],['usksa','uskaa','uskha','uskba','LICH']],boss:['dgb_frost','LICH']},
  wueste:{n:'Grabmal',wall:['#5a4428','#6a5230','#7c603a','#8e7046','#a08254'],moss:'#d0b070',mossA:.03,floor:['#4a3a24','#58462c','#665236','#745e40'],ceil:['#2e2416','#3a2e1c','#463822','#52422a'],acc:['#6e5636','#826640','#96784c','#aa8c5a'],
    fog:[.06,.045,.025],torch:0xffb050,fire:0xffb040,hemi:0.44,water:0x3a7a8a,glow:0xffd870,
    mobs:[['usks','uska','uskb','kobold','spj','nskel'],['usksa','uskaa','uskba','kobold','spg'],['usksa','uskha','spw','LICH']],boss:['dgb_pharao','dgboss']},
  dschungel:{n:'Tempel',wall:['#2a3424','#34402c','#404e36','#4e5e42','#5e7050'],moss:'#3e6a2a',mossA:.11,floor:['#24281e','#2e3426','#38402e','#444c38'],ceil:['#161a12','#1e2418','#262e1e','#2e3824'],acc:['#46503c','#566248','#687456','#7a8866'],
    fog:[.02,.04,.025],torch:0xffc860,fire:0xffb840,hemi:0.42,water:0x2a6a4a,glow:0xb8ff70,
    mobs:[['kobold','spj','bat','nrat','kobold'],['spg','troll','kobold','spj'],['troll','spw','spg','LICH']],boss:['dgb_troll','dgb_spinne']},
  sumpf:{n:'Versunkenes Gewölbe',wall:['#222a22','#2c362c','#364236','#424e42','#4e5c4e'],moss:'#3a5a2a',mossA:.09,floor:['#1c221c','#242c24','#2e382c','#384434'],ceil:['#111611','#181e18','#1f261f','#262e26'],acc:['#38423a','#465248','#566258','#667468'],
    fog:[.025,.04,.03],torch:0xc8ff80,fire:0x9aff60,hemi:.4,water:0x2e4a2a,glow:0xa8ff80,
    mobs:[['zombie','nrat','g_plaguerat','bat','spj'],['zombie','g_plaguerat','troll','spg'],['troll','zombie','LICH','g_plaguerat']],boss:['dgb_rat','dgb_ghoul']}};
function dg2ThemeOf(g){const b=(g&&(g.base||g).b)||'wald';return b==='schnee'||b==='nadel2'?'eis':(b==='wueste'||b==='steinwueste'||b==='savanne')?'wueste':b==='dschungel'?'dschungel':b==='sumpf'?'sumpf':'gruft';}
// ---------- Wächter und Mimic ----------
{const B=DT.g_bonelord||DT.dgboss;
  DT.dgb_frost=Object.assign({},B,{name:'Hrimgar, der Frostfürst',boss:1,hp:2100,xp:600,leash:80,noLeash:false});
  DT.dgb_pharao=Object.assign({},B,{name:'Amun-Kesh, der Grabkönig',boss:1,hp:2200,xp:620,leash:80,noLeash:false});
  if(DT.troll)DT.dgb_troll=Object.assign({},DT.troll,{name:'Grokk, der Tempeltroll',boss:1,hp:2600,xp:640,dmg:(DT.troll.dmg||20)*1.4,leash:80});
  if(DT.spw)DT.dgb_spinne=Object.assign({},DT.spw,{name:'Die Weberkönigin',boss:1,hp:1800,xp:600,dmg:(DT.spw.dmg||12)*1.7,leash:80});
  if(DT.g_plaguerat)DT.dgb_rat=Object.assign({},DT.g_plaguerat,{name:'Schlammzahn, der Rattenkönig',boss:1,hp:1700,xp:560,dmg:19,leash:80});
  if(DT.zombie)DT.dgb_ghoul=Object.assign({},DT.zombie,{name:'Der Gruftschlinger',boss:1,hp:2000,xp:560,dmg:24,spd:1.9,leash:80});}
DT.mimic={name:'Mimic',fac:'demon',h:1.15,hp:260,dmg:20,spd:2.6,reach:1.5,cd:1.3,wind:.4,spr:'mimic_',xp:60,aggro:22,leash:40,rad:.5,loot:[['silver',10,1],['coin',1,.5],['ruby',1,.15]]};
function dg2MimicSprite(f){const W=48,H=40,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),R=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  const open=f===0||f==='0'?0:f===1||f==='1'?6:f===2||f==='2'?10:12,by=H-17;
  R('#2a1a0e',4,by,40,17);R('#5a3a20',5,by+1,38,15);for(let k=0;k<5;k++)R('#46301a',7+k*8,by+1,1,15);R('#2e2e34',4,by+5,40,2);R('#2e2e34',4,by+12,40,2);R('#c8a030',22,by+3,4,4);
  if(open){R('#1a0406',6,by-open,36,open);R('#5a0e18',9,by-open+2,30,Math.max(1,open-3));R('#c83a4a',15,by-3,16,3);}
  for(let k=0;k<9;k++)R('#f0ead8',6+k*4,by-2,2,2+(k%2));
  const ly=by-open-8;R('#2a1a0e',3,ly,42,8);R('#6a4428',4,ly+1,40,6);R('#2e2e34',3,ly+3,42,2);for(let k=0;k<9;k++)R('#f0ead8',7+k*4,ly+8,2,2+((k+1)%2));
  if(open){R('#ffd040',11,ly+2,4,2);R('#ffd040',33,ly+2,4,2);R('#200000',12,ly+2,1,2);R('#200000',35,ly+2,1,2);}return c;}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const f of[0,1,2,'a'])list.push(['mimic_'+f,dg2MimicSprite(f)]);}catch(e){console.error('Mimic',e);}};}
// ---------- Stoffe je Thema ----------
function dg2Mats(key){if(DG2.M[key])return DG2.M[key];const T=DG_THEMES[key],M={},A=VC2(T.moss);
  const brick=()=>{const P=vpal2(T.wall),Mo=vmul2(VC2(T.wall[0]),.7);return vCan(32,32,(x,y)=>{const row=y>>3,xs=(x+(row&1)*8)&31,id=xs>>4,seam=(y&7)===7||(xs&15)===0;
    if(seam)return hash2(x,y,7201)<T.mossA*5?vmul2(A,.8+hash2(x,y,7202)*.3):vmul2(Mo,.9+hash2(x,y,7203)*.2);let c=vpk2(P,.2+hash2(id,row,7204)*.6);c=vmul2(c,.92+hash2(x,y,7205)*.14+((y&7)===0?.08:0));if(hash2(x,y,7206)<T.mossA)c=vmix2(c,A,.7);return c;});};
  const flag=()=>{const P=vpal2(T.floor),Mo=vmul2(VC2(T.floor[0]),.6);return vVor(32,32,16,16,7210,(x,y,p,edge)=>{if(edge<1.2)return hash2(x,y,7211)<T.mossA*3?vmul2(A,.8):vmul2(Mo,.9+hash2(x,y,7212)*.2);
    return vmul2(vpk2(P,.15+hash2(p[2],p[3],7213)*.7),.93+hash2(x,y,7214)*.12-(edge<2.2?.08:0));});};
  const rough=(cols,s)=>{const P=vpal2(cols);return vVor(32,32,8,8,s,(x,y,p,edge)=>edge<1?vmul2(P[0],.7):vmul2(vpk2(P,.2+hash2(p[2],p[3],s+2)*.6),.92+hash2(x,y,s+3)*.12));};
  const blocks=cols=>{const P=vpal2(cols),Li=vmul2(VC2(cols[0]),.75);return vCan(32,32,(x,y)=>{const row=y>>3,xx=(x+(row&1)*8)&31,id=xx>>4;if((y&7)===7||(xx&15)===0)return vmul2(Li,.95+hash2(x,y,7221)*.1);
    let c=vmul2(vpk2(P,.3+hash2(id,row,7222)*.5),.93+hash2(x,y,7223)*.1);if(hash2(x,y,7224)<T.mossA*.6)c=vmix2(c,A,.6);return c;});};
  const books=()=>{const BC=vpal2(['#7a2a24','#2a4a6a','#3a5a2a','#6a4a1e','#4a2a4a','#8a6a2a','#2a2a2a']);return vCan(32,48,(x,y)=>{const sh=Math.floor(y/16),yy=y%16;
    if(yy>=14||x<1||x>30)return vmul2(VC2('#3a2616'),.9+hash2(x,y,7231)*.2);const bk=Math.floor((x+sh*2)/3),top=2+((hash2(bk,sh,7232)*4)|0);if(yy<top)return[18,14,12];
    let c=vpk2(BC,hash2(bk,sh,7233));if((x+sh*2)%3===2)c=vmul2(c,.6);if(yy===top+2||yy===11)c=vmix2(c,[200,170,90],.5);return vmul2(c,.9+hash2(x,y,7234)*.15);});};
  const web=()=>vCan(32,32,(x,y)=>{const r=Math.hypot(x,y),a=Math.atan2(y,x),rad=Math.abs(((a/(Math.PI/2))*7)%1-.5)>.5-.6/(r*.25+1),ring=r<31&&Math.abs(r-Math.round(r/5)*5)<.45;return(rad&&r<31)||ring?[220,220,224,190]:[0,0,0,0];});
  const carpet=()=>{const Rr=VC2('#6a1418'),G=VC2('#c8a040');return vCan(16,32,(x,y)=>{if(x===1||x===14)return G;if(x<1||x>14)return vmul2(Rr,.7);const d=((x+y)%6===0||(x-y+64)%6===0)&&x>3&&x<12;return d?vmix2(Rr,G,.5):vmul2(Rr,.9+hash2(x,y,7241)*.15);});};
  const straw=()=>{const P=vpal2(['#3e3218','#4e3e1e','#5e4c26','#6c582e']);return vCan(32,32,(x,y)=>{const s=hash2(x,y>>1,7251);return vpk2(P,s*.8+(hash2(x>>2,y,7252)-.5)*.3);});};
  const L=(t,o)=>new THREE.MeshLambertMaterial(Object.assign({map:t},o||{}));
  M.wall=L(vTex(brick()));M.floor=L(vTex(flag()));M.ceil=L(vTex(rough(T.ceil,7260)));M.acc=L(vTex(blocks(T.acc)));
  M.fire=new THREE.MeshBasicMaterial({color:T.fire});M.void=new THREE.MeshBasicMaterial({color:0x030303});M.day=new THREE.MeshBasicMaterial({color:0x6a6656});
  M.books=L(vTex(books()));M.web=new THREE.MeshLambertMaterial({map:vTex(web(),false),transparent:true,alphaTest:.3,side:THREE.DoubleSide,depthWrite:false});
  M.bone=new THREE.MeshLambertMaterial({color:0xd8d0b8});M.page=new THREE.MeshLambertMaterial({color:0xe8e0c8});M.candle=new THREE.MeshLambertMaterial({color:0xf0e6c8,emissive:0xffc060,emissiveIntensity:.45});
  M.glow=new THREE.MeshLambertMaterial({color:T.glow,emissive:T.glow,emissiveIntensity:.85});M.water=new THREE.MeshLambertMaterial({color:T.water,transparent:true,opacity:.82});
  M.carpet=L(vTex(carpet()));M.straw=L(vTex(straw()));M.sand=new THREE.MeshLambertMaterial({color:0xb89a64});M.ice=new THREE.MeshLambertMaterial({color:0xbfe6ff,transparent:true,opacity:.85,emissive:0x2a5a7a,emissiveIntensity:.3});
  M.egg=new THREE.MeshLambertMaterial({color:0xe6e0cc});M.glass=[0xd83a4a,0x3a7ad8,0x4ad86a,0xe8c040,0xb85ae8].map(c=>new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:.25,transparent:true,opacity:.85}));
  M.potion=new THREE.MeshLambertMaterial({color:0x6aff7a,emissive:0x3aff5a,emissiveIntensity:.7});M.mush=new THREE.MeshLambertMaterial({color:0xb86a4a});
  DG2.M[key]=M;return M;}
// ---------- Ebenen ----------
function dg2Floors(g){if(g.nf==null){const st=(FLAGS.dgs||{})[g.id];g.nf=st&&(st.boss||st.loot)?1:1+(hash2(g.seed|0,3,7101)<.65?1:0)+(hash2(g.seed|0,5,7102)<.3?1:0);}return g.nf;}
function dgFloorG(g,f){const b=g.base||g;dg2Floors(b);if(!f)return b;return Object.assign({},b,{id:b.id+'_f'+f,seed:((b.seed|0)^Math.imul(f,0x2c9277b5))|0,fl:f,base:b,N:f>=2?6:5});}
function dg2Shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=(r()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
// ---------- Grundriss ----------
function dg2Gen(g){const N=g.N||DG_N,r=mulberry32(g.seed>>>0),b=g.base||g,fl=g.fl||0,nf=b.nf||1,last=fl>=nf-1,th=dg2ThemeOf(b);
  const vis=new Set(),edges=new Set(),ek=(a,c)=>a<c?a+','+c:c+','+a,ci=(i,j)=>i*N+j,stk=[[0,N>>1]];vis.add(ci(0,N>>1));
  while(stk.length){const[i,j]=stk[stk.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,c])=>[i+a,j+c]).filter(([a,c])=>a>=0&&c>=0&&a<N&&c<N&&!vis.has(ci(a,c)));if(!nb.length){stk.pop();continue;}
    const n=nb[(r()*nb.length)|0];vis.add(ci(n[0],n[1]));edges.add(ek(ci(i,j),ci(n[0],n[1])));stk.push(n);}
  for(let k=0;k<4+(N-5)*2;k++){const i=(r()*(N-1))|0,j=(r()*N)|0;edges.add(ek(ci(i,j),ci(i+1,j)));}
  const nbOf=c=>{const o=[];for(const e of edges){const[a,q]=e.split(',').map(Number);if(a===c)o.push(q);else if(q===c)o.push(a);}return o;};
  const start=ci(0,N>>1),dist=new Map([[start,0]]),q=[start];while(q.length){const c=q.shift();for(const o of nbOf(c)){if(dist.has(o))continue;dist.set(o,dist.get(c)+1);q.push(o);}}
  let boss=start;for(const[c,d]of dist)if(d>dist.get(boss))boss=c;let gate=null;for(const o of nbOf(boss))if(dist.get(o)===dist.get(boss)-1){gate=ek(o,boss);break;}
  const reach=new Set([start]),q2=[start];while(q2.length){const c=q2.shift();for(const o of nbOf(c)){if(ek(c,o)===gate||reach.has(o))continue;reach.add(o);q2.push(o);}}
  const cand=[...reach].filter(c=>c!==start&&c!==boss),lever=cand.length?cand[(r()*cand.length)|0]:start;
  const rooms=[];for(let c=0;c<N*N;c++){const sp=c===start||c===boss;rooms.push({c,i:(c/N)|0,j:c%N,mob:!sp&&r()<.62+fl*.08,trap:!sp&&r()<.28+fl*.06,chest:!sp&&r()<.22,lever:c===lever,kind:null});}
  const pool=dg2Shuffle(['schatz','biblio','schrein','kerker','labor','brunnen','waffen','grab','saeulen'].concat(th==='eis'?[]:['nest']),r),kc=dg2Shuffle(rooms.filter(R=>R.c!==start&&R.c!==boss&&!R.lever),r),nk=Math.min(kc.length,pool.length,3+fl+((r()*2)|0));
  for(let k=0;k<nk;k++){const R=kc[k];R.kind=pool[k];if(['schrein','brunnen','grab','nest'].includes(R.kind)){R.mob=false;R.trap=false;}if(['schatz','schrein','brunnen','grab'].includes(R.kind))R.chest=false;if(R.kind==='schatz'||R.kind==='saeulen')R.mob=true;if(R.kind==='kerker')R.trap=false;}
  for(const R of rooms){if(R.trap)R.trapT=r()<.4?'spikes':r()<.55?'flame':'darts';R.mimic=R.chest&&r()<.13;}
  const sc=[];for(const R of rooms){if(R.c===start||R.c===boss)continue;if(R.i===0)sc.push([R,-1,0]);if(R.i===N-1)sc.push([R,1,0]);if(R.j===0)sc.push([R,0,-1]);if(R.j===N-1)sc.push([R,0,1]);}dg2Shuffle(sc,r);
  const ns=r()<.75?1+(r()<.4?1:0):0,secrets=sc.slice(0,ns).map(([R,dx,dz])=>({c:R.c,dx,dz}));
  return{N,edges,start,boss,gate,lever,rooms,r,fl,nf,last,th,secrets};}
// ---------- Truhe (schöner, drehbar) ----------
function dg2Chest(x,z,key,boss,ang){const VM=vl2Mats(),g=new THREE.Group(),lid=new THREE.Group(),V=new VB2(),V2=new VB2(),w=boss?1.4:1,d=boss?.9:.7,Cb=vCx(V,new THREE.Matrix4()),Cl=vCx(V2,new THREE.Matrix4());
  Cb.b(VM.plankB,w,.62,d,0,.31,0);for(const sx of[-1,1])Cb.b(VM.iron,.08,.64,d+.04,sx*(w/2-.12),.32,0);Cb.b(VM.iron,w+.04,.08,d+.04,0,.08,0);Cb.b(boss?VM.gold:VM.iron,.18,.2,.06,0,.5,d/2+.02);
  Cl.b(VM.plankB,w+.06,.22,d+.06,0,0,0);for(const sx of[-1,1])Cl.b(boss?VM.gold:VM.iron,.09,.24,d+.1,sx*(w/2-.12),0,0);if(boss)Cl.b(VM.gold,w*.5,.06,d*.5,0,.13,0);
  V.build(g);V2.build(lid);lid.position.y=.73;g.add(lid);const gy=(typeof CV!=='undefined'&&CV.on&&CV.fy&&cvFloor(x,z))||DG_Y;g.position.set(x,gy,z);g.rotation.y=ang||0;DGX.grp.add(g);
  const s=solAdd({x,z,hw:w/2,hd:d/2,y0:gy,y1:gy+.95,rot:-(ang||0),solid:1,dg:1});DGX.sol.push(s);return{x,z,y:gy,key,boss,g,s,lid,open:false};}
dgChest=function(x,z,key,boss){return dg2Chest(x,z,key,boss,0);};
// ---------- Aufbau ----------
const DG2_SIDE={zm:0,xp:-Math.PI/2,zp:Math.PI,xm:Math.PI/2};
const DG_LORE=[
  'Tagebuch eines Steinmetzen: „Wir bauen tiefer, als der König es wollte. Unten hört man nachts etwas klopfen. Von der anderen Seite der Wand.“',
  '„Die Toten dieser Gruft wurden mit Silber im Mund begraben, damit sie ruhig schlafen. Wer das Silber nimmt, weckt sie.“ – eine alte Warnung',
  'Ein Bericht der Wache: „Der Knochenfürst war einst ein Feldherr. Er schwor, sein Reich nie zu verlassen. Er hat Wort gehalten.“',
  '„Die Kultisten in den Roben kommen nachts hierher. Sie beten zu etwas, das tiefer liegt als jedes Gewölbe.“ – Notiz, hastig geschrieben',
  'Ein Kinderreim, in den Stein geritzt: „Ein Licht ohne Gesicht, mit Flügeln so weit, holt dich heim, wenn du betest zur rechten Zeit.“',
  '„Die Händler der Dungeon-Stadt kaufen alles, was aus der Tiefe kommt. Fragen stellen sie keine.“ – Brief an einen Bruder',
  'Rezept eines Alchemisten: „Drei Tropfen Glühdrüse, ein Blatt Frostblume, und niemals bei Blutmond umrühren. Niemals.“',
  '„Hundert Jahre schlief Kreak, und die Welt vergaß ihn. Doch die Steine hier unten vergessen nichts.“',
  'Verwaltungsbuch: „Gitter Nummer sieben klemmt wieder. Hebel liegt irgendwo im Westflügel. Wer hat den Plan verlegt?“',
  '„Wer im Kerker sitzt, hört die Ratten zählen. Ich bin bei dreitausendzweihundert.“ – an die Zellenwand geschrieben'];
const DG_PRIS=['Bruno, ein Händler','Mira, eine Kräutersammlerin','Tjark, ein Fischer','Ole, ein Holzfäller','Wenke, eine Jägerin','Lasse, ein Lehrling','Hedda, eine Wirtin','Kuno, ein Barde'];
function dg2Build(g){const fl=g.fl||0,b0=g.base||g;if(!fl)dg2Floors(g);const th=dg2ThemeOf(b0),T=DG_THEMES[th],M=dg2Mats(th),VM=vl2Mats(),G=dg2Gen(g),N=G.N,W=N*DG_C,H=DG_H;
  const sxI=(G.start/N)|0,szI=G.start%N,gx0=g.x-(sxI+.5)*DG_C,gz0=g.z-(szI+.5)*DG_C,st=(FLAGS.dgs=FLAGS.dgs||{})[g.id]=FLAGS.dgs[g.id]||{},grp=new THREE.Group();
  DGX.d={g,G,ox:gx0,oz:gz0,W,st,gx0,gz0,ox0:gx0,oz0:gz0,W0:W,th,fogC:T.fog,near:2,far:30,hemi:T.hemi,bbl:.55,fl,nf:G.nf};
  Object.assign(DGX,{grp,sol:[],ents:[],traps:[],traps2:[],chests:[],gate:null,lever:null,exit:null,exitTop:null,downHole:null,spawn:null,down:null,downSpawn:null,uses:[],secrets:[],torches:[],pris:[]});
  DG2.bld=true;try{dg2BuildInner(g,G,T,M,VM,st,gx0,gz0,N,W,H,fl);try{if(typeof k2DgHook==='function')k2DgHook(g,G);}catch(e){console.error('Akt II Gewölbe',e);}}finally{DG2.bld=false;}
  if(DGX.secrets.length){DGX.d.ox-=12;DGX.d.oz-=12;DGX.d.W+=24;}
  AREAS.in_dungeon=T.n+(G.nf>1?' · Ebene '+(fl+1):'');scene.add(grp);DGX.light=new THREE.PointLight(0xffb060,1.5,18,1.5);scene.add(DGX.light);dg2Lights(T);}
function dg2BuildInner(g,G,T,M,VM,st,gx0,gz0,N,W,H,fl){const V=new VB2(),C0=vCx(V,new THREE.Matrix4()),r=mulberry32(((g.seed|0)^0x5bd1)>>>0),grp=DGX.grp,ri=(a,b)=>a+((r()*(b-a+1))|0);
  const sol=(x,z,hw,hd,y0,y1,rot,ex)=>{const b=solAdd(Object.assign({x,z,hw,hd,y0,y1,rot:rot||0,solid:1,dg:1},ex||{}));DGX.sol.push(b);return b;};
  const has=(a,b)=>G.edges.has(a<b?a+','+b:b+','+a),cc=c=>[gx0+(((c/N)|0)+.5)*DG_C,gz0+(c%N+.5)*DG_C];
  const SC=(cx,cz,s)=>vCx(V,vM(cx,DG_Y,cz,0,DG2_SIDE[s],0));
  const mob=(t,x,z,o)=>{if(t==='LICH'){if(typeof mzSpawnLich!=='function'||DGX.ents.some(e=>e.lich))t='usksa';else{const e=mzSpawnLich(x,z,false);e.cmd=1;e.lich=1;e.dormant=true;e.showDormant=true;e.wakeR=12;DGX.ents.push(e);return e;}}
    if(!DT[t])return null;const e=spawnEnt(t,x,z,Object.assign({home:{x,z},cmd:1,aggroT:0},o||{}));if(t==='troll'||t==='dgb_troll')e.special=mzTrollAI;if(fl){e.hp=e.max=Math.round(e.hp*(1+.35*fl));}e.dormant=true;e.showDormant=true;e.wakeR=12;DGX.ents.push(e);return e;};
  const pool=()=>{const P=T.mobs[Math.min(2,fl+(G.last&&fl>0?0:0))];return P[(r()*P.length)|0];};
  // Treppe hinab: Loch im Boden vorbereiten
  let downSide=null,hole=null;const bossR=G.rooms[G.boss],bossDoors={xm:bossR.i>0&&has(G.boss,G.boss-N),xp:bossR.i<N-1&&has(G.boss,G.boss+N),zm:bossR.j>0&&has(G.boss,G.boss-1),zp:bossR.j<N-1&&has(G.boss,G.boss+1)};
  if(!G.last){downSide=['xp','zp','zm','xm'].find(s=>!bossDoors[s])||'xp';const[cx,cz]=cc(G.boss),Cs=SC(cx,cz,downSide),p1=Cs.w(-1.3,0,-5.5),p2=Cs.w(1.3,0,-1.6);hole=[Math.min(p1.x,p2.x),Math.max(p1.x,p2.x),Math.min(p1.z,p2.z),Math.max(p1.z,p2.z)];}
  // Boden und Decke
  {const X0=gx0,X1=gx0+W,Z0=gz0,Z1=gz0+W,fb=(x0,x1,z0,z1)=>{if(x1-x0>.01&&z1-z0>.01)C0.b(M.floor,x1-x0,.2,z1-z0,(x0+x1)/2,DG_Y-.1,(z0+z1)/2);};
    if(hole){fb(X0,hole[0],Z0,Z1);fb(hole[1],X1,Z0,Z1);fb(hole[0],hole[1],Z0,hole[2]);fb(hole[0],hole[1],hole[3],Z1);}else fb(X0,X1,Z0,Z1);
    C0.b(M.ceil,W,.3,W,gx0+W/2,DG_Y+H+.15,gz0+W/2);}
  // Wände mit Türbögen
  const seg=(x,z,w,d)=>{C0.b(M.wall,w,H,d,x,DG_Y+H/2,z);sol(x,z,w/2,d/2,DG_Y,DG_Y+H);};
  const door=(x,z,alongZ)=>{C0.b(M.wall,alongZ?1:3,1,alongZ?3:1,x,DG_Y+H-.5,z);for(const sd of[-1,1]){const jx=alongZ?x:x+sd*1.72,jz=alongZ?z+sd*1.72:z;C0.b(M.acc,alongZ?1.2:.45,H-1,alongZ?.45:1.2,jx,DG_Y+(H-1)/2,jz);}
    C0.b(M.acc,alongZ?1.2:3.9,.35,alongZ?3.9:1.2,x,DG_Y+H-1.17,z);};
  const wallX=(x,z0,z1,op)=>{if(!op){seg(x,(z0+z1)/2,1,z1-z0);return;}const s=(z1-z0-3)/2;seg(x,z0+s/2,1,s);seg(x,z1-s/2,1,s);if(op==='door')door(x,(z0+z1)/2,true);else C0.b(M.wall,1,1,3,x,DG_Y+H-.5,(z0+z1)/2);};
  const wallZ=(z,x0,x1,op)=>{if(!op){seg((x0+x1)/2,z,x1-x0,1);return;}const s=(x1-x0-3)/2;seg(x0+s/2,z,s,1);seg(x1-s/2,z,s,1);if(op==='door')door((x0+x1)/2,z,false);else C0.b(M.wall,3,1,1,(x0+x1)/2,DG_Y+H-.5,z);};
  const secAt=(c,dx,dz)=>G.secrets.find(s=>s.c===c&&s.dx===dx&&s.dz===dz);
  for(let i=0;i<=N;i++)for(let j=0;j<N;j++){const x=gx0+i*DG_C,z0=gz0+j*DG_C,z1=z0+DG_C;if(i===0||i===N){const c=(i===0?0:N-1)*N+j,s=secAt(c,i===0?-1:1,0);wallX(x,z0,z1,s?'sec':null);if(s)s.w=[x,(z0+z1)/2];continue;}
    const a=(i-1)*N+j,b=i*N+j,k=a+','+b;wallX(x,z0,z1,has(a,b)?'door':null);if(G.gate===k)dgGate(x,(z0+z1)/2,true);}
  for(let j=0;j<=N;j++)for(let i=0;i<N;i++){const z=gz0+j*DG_C,x0=gx0+i*DG_C,x1=x0+DG_C;if(j===0||j===N){const c=i*N+(j===0?0:N-1),s=secAt(c,0,j===0?-1:1);wallZ(z,x0,x1,s?'sec':null);if(s)s.w=[(x0+x1)/2,z];continue;}
    const a=i*N+j-1,b=i*N+j,k=a+','+b;wallZ(z,x0,x1,has(a,b)?'door':null);if(G.gate===k)dgGate((x0+x1)/2,z,false);}
  // Fackel an einer Säule
  const torch=(C,cx,cz,sx,sz,o)=>{o=o||4.42;const x=sx*o,z=sz*o,a=Math.atan2(-sx,-sz);C.b(VM.iron,.07,.07,.42,x,2.62,z,.5,a,0);C.b(VM.beamD,.09,.55,.09,x-sx*.12,2.86,z-sz*.12,0,0,0);C.b(M.fire,.2,.26,.2,x-sx*.12,3.22,z-sz*.12);
    DGX.traps.push({fire:1,x:cx+x-sx*.12,z:cz+z-sz*.12});DGX.torches.push({x:cx+x-sx*.12,y:DG_Y+3.3,z:cz+z-sz*.12});};
  const webAt=(Cs,x,sz)=>{const y=H-.02,z=-5.47;V.face(M.web,[Cs.w(x,y,z),Cs.w(x+sz*1.9,y,z),Cs.w(x,y-1.9,z)],[0,1,1,1,0,0]);};
  const bones=(C,x,z)=>{C.b(M.bone,.22,.2,.24,x,.1,z,0,r()*3,0);C.b(M.bone,.16,.06,.1,x+.05,.03,z+.16,0,r(),0);for(let k=0;k<3;k++)C.b(M.bone,.05,.05,.45,x+(r()-.5)*.8,.03,z+(r()-.5)*.8,0,r()*3,0);};
  const rubble=(C,x,z)=>{for(let k=0;k<3+ri(0,3);k++){const s=.15+r()*.35;C.b(M.acc,s,s*.7,s,x+(r()-.5)*1.1,s*.35,z+(r()-.5)*1.1,r()*.4,r()*3,r()*.4);}};
  // ---------- Räume ----------
  for(const R of G.rooms){const[cx,cz]=cc(R.c),C=vCx(V,vM(cx,DG_Y,cz,0,0,0)),dr={xm:R.i>0&&has(R.c,R.c-N),xp:R.i<N-1&&has(R.c,R.c+N),zm:R.j>0&&has(R.c,R.c-1),zp:R.j<N-1&&has(R.c,R.c+1)};
    const secS=G.secrets.filter(s=>s.c===R.c).map(s=>s.dx<0?'xm':s.dx>0?'xp':s.dz<0?'zm':'zp'),isStart=R.c===G.start,isBoss=R.c===G.boss;
    const slots=[];for(const s of['xm','xp','zm','zp']){if(secS.includes(s))continue;if(isStart&&s==='xm')continue;if(isBoss&&s===downSide)continue;for(const x of dr[s]?[-3.2,3.2]:[0,-3.2,3.2])slots.push({s,x,center:x===0,used:false});}
    dg2Shuffle(slots,r);slots.sort((a,b)=>(b.center?1:0)-(a.center?1:0));
    const take=(wantCenter)=>{let sl=slots.find(q=>!q.used&&(!wantCenter||q.center));if(!sl&&wantCenter)sl=slots.find(q=>!q.used);if(!sl)return null;sl.used=true;if(sl.center)for(const q of slots)if(q.s===sl.s)q.used=true;else{}
      if(!sl.center)for(const q of slots)if(q.s===sl.s&&q.center)q.used=true;return{s:sl.s,x:sl.x,C:SC(cx,cz,sl.s),wide:sl.center};};
    // Säulen, Balken
    for(const sx of[-1,1])for(const sz of[-1,1]){C.b(M.acc,.9,H,.9,sx*5.05,H/2,sz*5.05);C.b(M.acc,1.15,.32,1.15,sx*5.05,.16,sz*5.05);C.b(M.acc,1.15,.3,1.15,sx*5.05,H-.15,sz*5.05);}
    C.b(M.acc,DG_C-1,.32,.45,0,H-.16,0);C.b(M.acc,.45,.32,DG_C-1,0,H-.16,0);
    // Fackeln
    const tc=isStart||isBoss||R.kind?4:2,corners=dg2Shuffle([[-1,-1],[-1,1],[1,-1],[1,1]],r);for(let k=0;k<tc;k++)torch(C,cx,cz,corners[k][0],corners[k][1]);
    // Geröll, Knochen, Spinnweben, Ketten
    for(let k=0;k<ri(1,3);k++){const q=corners[(k+1)%4];rubble(C,q[0]*3.7,q[1]*3.7);}if(r()<.55)bones(C,(r()-.5)*5,(r()-.5)*5);
    for(const s of['xm','xp','zm','zp'])if(r()<.25){const Cs=SC(cx,cz,s);webAt(Cs,r()<.5?-4.55:4.55,0);}
    {const Cs=SC(cx,cz,['xm','xp','zm','zp'][ri(0,3)]);if(r()<.35)webAt(Cs,-4.6,1);if(r()<.35)webAt(Cs,4.6,-1);}
    if(r()<.28)for(let k=0;k<ri(1,3);k++){const x=(r()-.5)*7,z=(r()-.5)*7,l=.8+r()*1.6;C.b(VM.iron,.05,l,.05,x,H-l/2,z);C.b(VM.iron,.18,.04,.18,x,H-l,z);}
    // Thema
    if(G.th==='eis')for(let k=0;k<ri(2,6);k++){const x=(r()-.5)*9,z=(r()-.5)*9,l=.4+r()*1.1;V.cone(M.ice,.12+r()*.1,l,5,vM(cx+x,DG_Y+H,cz+z,Math.PI,0,0),0);}
    if(G.th==='wueste'){for(let k=0;k<ri(1,3);k++){const q=corners[k];C.b(M.sand,1.6+r(),.25+r()*.2,1.4+r(),q[0]*3.8,.1,q[1]*3.8,0,r(),0);}if(r()<.5){const q=corners[3];C.cyl(VM.barrel,.3,.7,8,q[0]*3.6,0,q[1]*2.4,'fit',true);}}
    if(G.th==='dschungel')for(const s of['xm','xp','zm','zp'])if(r()<.6){const Cs=SC(cx,cz,s);for(let k=0;k<ri(2,5);k++){const x=(r()-.5)*8,l=.8+r()*2.4;Cs.b(VM.vine,.26,l,.06,x,H-l/2,-5.45);}}
    if(G.th==='sumpf'){for(let k=0;k<ri(1,3);k++)C.b(M.water,1.4+r()*2,.03,1.2+r()*2,(r()-.5)*6,.02,(r()-.5)*6,0,r(),0);for(let k=0;k<ri(0,4);k++){const q=corners[k%4];C.b(M.mush,.08,.22,.08,q[0]*3.9+(r()-.5),.11,q[1]*3.9+(r()-.5));C.b(M.mush,.26,.06,.26,q[0]*3.9,.24,q[1]*3.9);}}
    // Start: Treppe hinauf
    if(isStart){const Cs=SC(cx,cz,'xm');for(let k=0;k<6;k++){const h=(6-k)*.4,z=-5.5+.3+k*.6;Cs.b(M.acc,2.6,h,.6,0,h/2,z);}{const p=Cs.w(0,0,-3.55);sol(p.x,p.z,1.3,1.65,DG_Y,DG_Y+2.4,-DG2_SIDE.xm+Math.PI,{walk:1,ramp:1});}
      for(const sd of[-1,1])Cs.b(M.acc,.3,1,3.6,sd*1.45,.5,-3.7);Cs.b(fl?M.void:M.day,2.2,2.2,.05,0,3.5,-5.47);for(const sd of[-1,1])Cs.b(M.acc,.4,2.6,.4,sd*1.3,3.6,-5.3);Cs.b(M.acc,3,.4,.45,0,4.7-.2,-5.3);
      const e=Cs.w(0,0,-3.5),s0=Cs.w(0,0,-.6),s1=Cs.w(0,0,1);DGX.exit={x:e.x,z:e.z};{const t=Cs.w(0,0,-4.6);DGX.exitTop={x:t.x,z:t.z};}DGX.spawn={x:s0.x,z:s0.z,yaw:Math.atan2(-(s1.x-s0.x),-(s1.z-s0.z))};}
    // Ziel: Wächter oder Treppe hinab
    if(isBoss){if(!G.last){const Cs=SC(cx,cz,downSide);for(let k=0;k<7;k++){const top=-(k+1)*.42,h=3.5+top,z=-1.6-(k+.5)*.55;Cs.b(M.acc,2.6,h,.55,0,top-h/2,z);}
        for(const sd of[-1,1])Cs.b(M.acc,.12,3.5,3.9,sd*1.36,-1.75,-3.55);Cs.b(M.void,2.6,2.2,.06,0,-1.2,-5.4);Cs.b(M.void,2.6,.06,1.8,0,-3.3,-4.6);
        for(const sd of[-1,1]){Cs.b(M.acc,.3,1,3.9,sd*1.5,.5,-3.55);const p=Cs.w(sd*1.5,0,-3.55);sol(p.x,p.z,.15,1.95,DG_Y,DG_Y+1,-DG2_SIDE[downSide]);}
        for(const sd of[-1,1])Cs.b(M.acc,.4,2.8,.4,sd*1.6,1.4,-1.5);Cs.b(M.acc,3.6,.45,.5,0,3,-1.5);
        const d=Cs.w(0,0,-2.2),s0=Cs.w(0,0,.4),s1=Cs.w(0,0,2);DGX.down={x:d.x,z:d.z};DGX.downHole=hole;DGX.downSpawn={x:s0.x,z:s0.z,yaw:Math.atan2(-(s1.x-s0.x),-(s1.z-s0.z))};}
      else{const bt=T.boss[(r()*T.boss.length)|0];if((g.base||g).cry&&FLAGS.vq===1){const e=dg2Vlados(cx,cz);e.dgBoss=1;e.dormant=true;e.showDormant=true;e.wakeR=13;DGX.ents.push(e);}else if(!st.boss){let e;if(bt==='LICH'&&typeof mzSpawnLich==='function'){e=mzSpawnLich(cx,cz,true);e.cmd=1;}else{const t=DT[bt]?bt:'dgboss';e=spawnEnt(t,cx,cz,{home:{x:cx,z:cz},cmd:1,scale:/troll|spinne|rat|ghoul/.test(t)?1.35:1});if(t==='dgb_troll')e.special=mzTrollAI;}
          if(fl){e.hp=e.max=Math.round(e.hp*(1+.3*fl));}e.dgBoss=1;e.dormant=true;e.showDormant=true;e.wakeR=13;DGX.ents.push(e);}
        const sl=take(true);if(sl){const Cs=sl.C,X=sl.x;Cs.b(M.acc,3.2,.25,2.4,X,.125,-4.3);Cs.b(M.acc,2.4,.25,1.6,X,.375,-4.7);Cs.b(M.acc,1.3,.5,1,X,.75,-4.95);Cs.b(M.acc,1.3,1.8,.3,X,1.4,-5.3);for(const sd of[-1,1])Cs.b(M.acc,.25,1.2,1,X+sd*.6,1.1,-4.95);
          Cs.b(VM.gold,1.4,.08,.08,X,2.35,-5.2);Cs.b(M.carpet,1.3,.02,4.2,X,.01,-1.3,0,0,0,'tile');if(!st.loot){const p=Cs.w(X,0,-3.2);DGX.chests.push(dg2Chest(p.x,p.z,'boss',true,DG2_SIDE[sl.s]));}}}}
    // Hebel
    if(R.lever){const sl=take(false)||{C:SC(cx,cz,'zp'),x:3.2,s:'zp'};const p=sl.C.w(sl.x,0,-5.1),Lg=new THREE.Group(),Mo=dgMats();const base=new THREE.Mesh(new THREE.BoxGeometry(.6,.4,.4),Mo.stone),arm=new THREE.Mesh(new THREE.BoxGeometry(.12,1,.12),Mo.iron);arm.position.y=.5;
      const pv=new THREE.Group();pv.add(arm);pv.rotation.z=st.lever?-.7:.7;pv.position.y=.2;Lg.add(base,pv);Lg.position.set(p.x,DG_Y,p.z);Lg.rotation.y=DG2_SIDE[sl.s];grp.add(Lg);DGX.lever={x:p.x,z:p.z,pv};}
    // Truhe
    if(R.chest&&!(st.ch&&st.ch[R.c])){const sl=take(false);if(sl){const p=sl.C.w(sl.x,0,-4.75),c=dg2Chest(p.x,p.z,R.c,false,DG2_SIDE[sl.s]);c.mimic=R.mimic;DGX.chests.push(c);}}
    // Raumarten
    if(R.kind)dg2Kind(R,{C,V,M,VM,T,G,st,cx,cz,take,SC,mob,pool,sol,r,ri,fl,H,torch,bones,webAt,rubble,dr});
    // Fallen
    if(R.trap){const t=R.trapT;if(t==='spikes'){for(let k=0;k<2;k++){const tx=cx+(r()-.5)*6,tz=cz+(r()-.5)*6;C0.b(VM.iron,2,.08,2,tx,DG_Y+.04,tz);const sp=new THREE.Group(),V2=new VB2();for(let a=0;a<4;a++)for(let b=0;b<4;b++)V2.cone(M.acc,.12,.7,4,vM(-.75+a*.5,0,-.75+b*.5,0,0,0),0);
          V2.build(sp);sp.position.set(tx,DG_Y-.4,tz);grp.add(sp);DGX.traps.push({plate:1,x:tx,z:tz,sp,ph:r()*3});}}
      else if(t==='flame'){const sl=take(true);if(sl){const Cs=sl.C,X=sl.x;for(const dx of[-1,0,1])Cs.b(VM.iron,.32,.32,.3,X+dx*.9,.95,-5.35);const o=Cs.w(X,0,-5.2),o2=Cs.w(X,0,-4.2);DGX.traps2.push({k:'flame',x:o.x,z:o.z,dx:o2.x-o.x,dz:o2.z-o.z,len:6.2,w:1.6,ph:r()*5,nz:[-1,0,1].map(dx=>Cs.w(X+dx*.9,0,-5.15))});}}
      else{const px=cx+(r()-.5)*4,pz=cz+(r()-.5)*4;C0.b(M.acc,1.4,.06,1.4,px,DG_Y+.03,pz);const s=['xm','xp','zm','zp'].find(q=>!dr[q]&&!secS.includes(q))||'zm',Cs=SC(cx,cz,s);
        for(let k=-2;k<=2;k++)Cs.b(M.void,.12,.12,.04,k*.6,1.1,-5.47);const w=Cs.w(0,0,-5.4);DGX.traps2.push({k:'dart',x:px,z:pz,wx:w.x,wz:w.z,cd:0});}}
    // Monster
    if(R.mob&&!isBoss&&!isStart&&!st.boss){const n=1+((r()*(fl?3.6:3))|0)+(R.kind==='schatz'||R.kind==='saeulen'?1:0);for(let k=0;k<n;k++)mob(pool(),cx+(r()-.5)*6,cz+(r()-.5)*6);}}
  // Geheimräume hinter rissigen Außenwänden
  const TM=tzMats();st.sec=st.sec||{};G.secrets.forEach((S,k)=>{if(!S.w)return;const[wx,wz]=S.w,alongZ=!!S.dx,ux=S.dx,uz=S.dz,key='s'+S.c+'_'+ux+'_'+uz,broken=!!st.sec[key];
    let cg=new THREE.Group(),cs=null;if(!broken){for(let a=-1;a<=1;a++)for(let b=0;b<3;b++){const m=new THREE.Mesh(new THREE.BoxGeometry(alongZ?.9:1.05,(H-1)/3+.15,alongZ?1.05:.9),TM.wall);m.position.set(alongZ?(r()-.5)*.15:a*1,b*(H-1)/3+(H-1)/6,alongZ?a*1:(r()-.5)*.15);cg.add(m);}
      cg.position.set(wx,DG_Y,wz);grp.add(cg);cs=sol(wx,wz,alongZ?.55:1.6,alongZ?1.6:.55,DG_Y-1,DG_Y+H);}
    const rc=[wx+ux*4.5,wz+uz*4.5],RW=8;C0.b(M.floor,RW,.2,RW,rc[0],DG_Y-.1,rc[1]);C0.b(M.ceil,RW,.3,RW,rc[0],DG_Y+H+.15,rc[1]);
    {const x=rc[0]+ux*(RW/2+.5),z=rc[1]+uz*(RW/2+.5);C0.b(M.wall,alongZ?1:RW+2,H,alongZ?RW+2:1,x,DG_Y+H/2,z);sol(x,z,alongZ?.5:RW/2+1,alongZ?RW/2+1:.5,DG_Y,DG_Y+H);}
    for(const sd of[-1,1]){const x=alongZ?rc[0]:rc[0]+sd*(RW/2+.5),z=alongZ?rc[1]+sd*(RW/2+.5):rc[1];C0.b(M.wall,alongZ?RW:1,H,alongZ?1:RW,x,DG_Y+H/2,z);sol(x,z,alongZ?RW/2:.5,alongZ?.5:RW/2,DG_Y,DG_Y+H);}
    const Cr=vCx(V,vM(rc[0],DG_Y,rc[1],0,0,0));for(const sx of[-1,1])for(const sz of[-1,1])Cr.b(M.acc,.7,H,.7,sx*3.65,H/2,sz*3.65);torch(Cr,rc[0],rc[1],1,1,3.1);torch(Cr,rc[0],rc[1],-1,-1,3.1);bones(Cr,-ux*1.5+uz*1.5,-uz*1.5+ux*1.5);
    if(!(st.ch&&st.ch['ds'+k])){const c=dg2Chest(rc[0]+ux*2,rc[1]+uz*2,'ds'+k,false,Math.atan2(-ux,-uz));DGX.chests.push(c);}if(r()<.6)mob(['usksa','uskha','troll','zombie'][(r()*4)|0],rc[0],rc[1],{});
    DGX.secrets.push({x:wx,z:wz,y:DG_Y,g:cg,sol:cs||{off:true},hp:5,room:{x:rc[0],z:rc[1],w:RW},cell:S.c,key,gone:broken});});
  V.build(grp);}
// ---------- Raumarten ----------
function dg2Kind(R,K){const{C,V,M,VM,T,G,st,cx,cz,take,SC,mob,pool,sol,r,ri,fl,H,bones,webAt,rubble,torch}=K,use=(x,z,y,txt,fn,rad)=>DGX.uses.push({x,z,y:DG_Y+y,r:rad||2.4,txt,fn});
  const sideRot=s=>-DG2_SIDE[s];const ssol=(sl,x,z,hw,hd,top)=>{const p=sl.C.w(x,0,z);sol(p.x,p.z,hw,hd,DG_Y,DG_Y+top,sideRot(sl.s));};
  const dr=K.dr,quad=()=>{const q=[[-1,-1],[-1,1],[1,-1],[1,1]].filter(([sx,sz])=>!(dr[sx<0?'xm':'xp']&&dr[sz<0?'zm':'zp']));const c=q.length?q[(r()*q.length)|0]:null;return c?[c[0]*2.7,c[1]*2.7]:[0,0];};
  st.k=st.k||{};const once=k=>!st.k[R.c+k],mark=k=>{st.k[R.c+k]=1;saveGame();};
  switch(R.kind){
  case'schatz':{for(const[q,s]of[[[-1,-1],1],[[1,1],.8],[[-1,1],.6]]){const x=q[0]*3.2,z=q[1]*3.2;C.b(VM.gold,1.3*s,.22,1.1*s,x,.11,z,0,r(),0);C.b(VM.gold,.9*s,.22,.7*s,x,.33,z,0,r(),0);C.b(VM.gold,.45*s,.2,.4*s,x,.52,z,0,r(),0);
      for(let k=0;k<9;k++)C.b(VM.gold,.13,.03,.13,x+(r()-.5)*2.2,.015,z+(r()-.5)*2.2,0,r()*3,0);}
    for(const k of['kA','kB']){if(st.ch&&st.ch[k+R.c])continue;const sl=take(false);if(!sl)continue;const p=sl.C.w(sl.x,0,-4.75);DGX.chests.push(dg2Chest(p.x,p.z,k+R.c,false,DG2_SIDE[sl.s]));}break;}
  case'biblio':{for(let k=0;k<4;k++){const sl=take(false);if(!sl)break;const Cs=sl.C,X=sl.x,w=sl.wide?3.4:2.3;Cs.b(VM.plankB,w,3.0,.55,X,1.5,-5.22);Cs.b(M.books,w-.2,2.8,.02,X,1.5,-4.93,0,0,0,'fit');Cs.b(VM.beamD,w+.1,.12,.6,X,3.06,-5.2);ssol(sl,X,-5.22,w/2,.3,3);}
    const[x,z]=quad();C.b(VM.plankB,1.8,.1,.9,x,.85,z);for(const sx of[-1,1])for(const sz of[-1,1])C.b(VM.beamD,.1,.8,.1,x+sx*.8,.4,z+sz*.38);C.b(M.page,.42,.03,.56,x-.21,.92,z,0,0,.12);C.b(M.page,.42,.03,.56,x+.21,.92,z,0,0,-.12);
    C.b(M.candle,.07,.25,.07,x+.7,1.02,z-.3);C.b(M.fire,.05,.08,.05,x+.7,1.18,z-.3);sol(cx+x,cz+z,.9,.45,DG_Y,DG_Y+1);for(let k=0;k<ri(2,5);k++)C.b([M.books][0],.25,.06,.35,(r()-.5)*6,.03,(r()-.5)*6,0,r()*3,0,'fit');
    const li=((st.seedLore|0)+R.c*7+(G.fl||0)*3+((DGX.d.g.seed|0)&255))%DG_LORE.length;use(cx+x,cz+z,1,()=>'Altes Buch lesen',()=>dg2Book(DG_LORE[Math.abs(li)%DG_LORE.length],once('bk')?()=>mark('bk'):null),2.6);break;}
  case'schrein':{const sl=take(true);if(!sl)break;const Cs=sl.C,X=sl.x;Cs.b(K.M.acc,3,.3,1.9,X,.15,-4.5);Cs.b(M.acc,1.8,1,.9,X,.8,-4.7);Cs.b(VM.gold,1.9,.08,1,X,1.32,-4.7);Cs.b(M.glow,.36,.36,.36,X,2.05,-4.7,.6,.785,0);
    for(const dx of[-.7,-.35,.35,.7]){Cs.b(M.candle,.07,.22+r()*.1,.07,X+dx,1.45,-4.45);Cs.b(M.fire,.05,.07,.05,X+dx,1.62,-4.45);}Cs.b(M.carpet,1.3,.02,3.6,X,.01,-1.9,0,0,0,'tile');
    for(const sd of[-1,1]){Cs.cyl(VM.iron,.35,.15,8,X+sd*2.2,.9,-4.2,'tile',true);Cs.b(VM.iron,.08,.9,.08,X+sd*2.2,.45,-4.2);Cs.b(M.fire,.3,.3,.3,X+sd*2.2,1.15,-4.2);const p=Cs.w(X+sd*2.2,0,-4.2);DGX.traps.push({fire:1,x:p.x,z:p.z});}
    ssol(sl,X,-4.6,1.5,.95,1.3);const p=Cs.w(X,0,-3.4);use(p.x,p.z,1,()=>DG2.used.has(DGX.d.g.id+':s'+R.c)?null:'Am Schrein beten',()=>{DG2.used.add(DGX.d.g.id+':s'+R.c);const S=P.stats;S.hp=S.maxHp;S.mp=S.maxMp;S.st=S.maxSt;renderStats();
      for(let k=0;k<40;k++)spawnParticle(P.x+(Math.random()-.5)*1.5,P.y+Math.random()*2,P.z+(Math.random()-.5)*1.5,0,1+Math.random(),0,T.glow,1,.3);showArea('Segen des Schreins');try{Snd.pickup();}catch(e){}},3);break;}
  case'kerker':{const sl=take(true);if(!sl)break;if(!sl.wide){K.mob(pool(),cx,cz);break;}const Cs=sl.C;
    Cs.b(M.acc,.3,H,2.3,0,H/2,-4.35);for(const sd of[-1,1]){const X=sd*2.35;Cs.b(M.straw,4.3,.02,2.2,X,.01,-4.4);for(let k=0;k<3;k++)Cs.b(VM.iron,.05,.7,.05,X+(r()-.5)*3,1.4,-5.45);
      for(let x=-2.1;x<=2.11;x+=.3){if(Math.abs(x)<.7)continue;Cs.b(VM.iron,.05,H-.4,.05,X+x,(H-.4)/2,-3.25);}Cs.b(VM.iron,4.4,.08,.08,X,H-.4,-3.25);Cs.b(VM.iron,4.4,.08,.08,X,.3,-3.25);
      for(const xx of[[-2.2,-.7],[.7,2.2]]){const p=Cs.w(X+(xx[0]+xx[1])/2,0,-3.25);sol(p.x,p.z,.75,.08,DG_Y,DG_Y+H,sideRot(sl.s));}}
    const prc=ri(0,1)?1:-1,key='pr';st.pr=st.pr||{};const free=!!st.pr[R.c];
    for(const sd of[-1,1]){const X=sd*2.35,dg=new THREE.Group(),V2=new VB2(),Cd=vCx(V2,new THREE.Matrix4());for(let x=-.6;x<=.61;x+=.3)Cd.b(VM.iron,.05,H-.4,.05,x,(H-.4)/2,0);Cd.b(VM.iron,1.3,.08,.08,0,H*.5,0);Cd.b(VM.iron,.14,.14,.1,.5,1.1,.03);V2.build(dg);
      const p=Cs.w(X,0,-3.25);dg.position.set(p.x,DG_Y,p.z);dg.rotation.y=DG2_SIDE[sl.s];DGX.grp.add(dg);const open=sd===prc?free:r()<.5;const sd2=sol(p.x,p.z,.7,.08,DG_Y,DG_Y+H,sideRot(sl.s));if(open){dg.position.y=DG_Y+H-.7;sd2.off=true;}
      if(sd===prc){const c=Cs.w(X,0,-4.4),f=Cs.w(X,0,-2.6);if(!free){const nm=DG_PRIS[((DGX.d.g.seed|0)+R.c*3)&7],k=(R.c*5+(DGX.d.g.seed|0))%6;let e=null;if(DT['vlg_f'+((k%6+6)%6)]){e=spawnEnt('vlg_f'+((k%6+6)%6),c.x,c.z,{home:{x:c.x,z:c.z},name:'Gefangener',role:nm,wander:false,talk:0});e.y=DG_Y;DGX.ents.push(e);}
          const pr={e,dg,s:sd2,x:f.x,z:f.z,name:nm,c:R.c};DGX.pris.push(pr);use(p.x,p.z,1.2,()=>pr.freed?null:'Zelle öffnen',()=>dg2Free(pr),2.6);}}
      else bones(Cs,X+(r()-.5)*2,-4.6);}
    break;}
  case'labor':{for(let k=0;k<2;k++){const sl=take(false);if(!sl)break;const Cs=sl.C,X=sl.x;Cs.b(VM.plankB,2.2,.1,.8,X,.9,-4.9);for(const sx of[-1,1])for(const sz of[-1,1])Cs.b(VM.beamD,.1,.85,.1,X+sx*1,.43,-4.9+sz*.32);
      for(let q=0;q<5;q++){const gm=M.glass[(r()*M.glass.length)|0];Cs.cyl(gm,.07+r()*.05,.18+r()*.2,6,X-.8+q*.4,.95,-4.95+(r()-.5)*.3,'tile',true);}ssol(sl,X,-4.9,1.1,.4,1);
      if(k===0){const p=Cs.w(X,0,-3.9);use(p.x,p.z,1,()=>once('lab')?'Tränke einsammeln':null,()=>{mark('lab');const L=[['hpot',1+ri(0,1)],['pmana',1]];if(r()<.5)L.push(['hpot2',1]);if(r()<.3)L.push(['pregen',1]);if(r()<.3)L.push(['pstr',1]);lootGive(L,'Alchemielabor');},2.6);}}
    {const[qx,qz]=quad();C.cyl(VM.iron,.75,.75,10,qx,0,qz,'tile',true);C.cyl(M.potion,.62,.04,10,qx,.76,qz,'fit',true);for(let k=0;k<3;k++)C.b(VM.iron,.08,.3,.08,qx+Math.cos(k*2.1)*.7,.12,qz+Math.sin(k*2.1)*.7);sol(cx+qx,cz+qz,.75,.75,DG_Y,DG_Y+.8);
    DGX.traps2.push({k:'bubble',x:cx+qx,z:cz+qz,y:DG_Y+.85,col:0x6aff7a});}break;}
  case'brunnen':{const[qx,qz]=quad();C.cyl(M.acc,1.35,.7,8,qx,0,qz,'tile',true,Math.PI/8);C.cyl(M.water,1.18,.04,8,qx,.71,qz,'fit',true,Math.PI/8);C.cyl(M.acc,.22,1.5,8,qx,.7,qz,'tile',true);C.b(M.glow,.4,.4,.4,qx,2.45,qz,.6,.785,0);sol(cx+qx,cz+qz,1.3,1.3,DG_Y,DG_Y+.8);
    DGX.traps2.push({k:'bubble',x:cx+qx,z:cz+qz,y:DG_Y+2.4,col:T.glow,up:1});use(cx+qx*.4,cz+qz*.4,.8,()=>'Aus dem Brunnen trinken',()=>{const k=DGX.d.g.id+':b'+R.c;if(time<(DG2.fcd[k]||0)){toast('Das Wasser ist noch trüb. Warte ein wenig.');return;}DG2.fcd[k]=time+90;const S=P.stats;S.hp=Math.min(S.maxHp,S.hp+S.maxHp*.5);S.mp=Math.min(S.maxMp,S.mp+S.maxMp*.5);renderStats();showArea('Heilendes Wasser');try{Snd.pickup();}catch(e){}},2.8);break;}
  case'waffen':{for(let k=0;k<3;k++){const sl=take(false);if(!sl)break;const Cs=sl.C,X=sl.x;Cs.b(VM.beamD,2.3,.1,.3,X,2.2,-5.3);Cs.b(VM.beamD,2.3,.1,.3,X,.6,-5.3);for(const sx of[-1,1])Cs.b(VM.beamD,.1,2.3,.3,X+sx*1.1,1.15,-5.3);
      for(let q=0;q<4;q++){const x=X-.8+q*.53;if(q%2){Cs.b(VM.iron,.08,1.3,.04,x,1.3,-5.15);Cs.b(VM.beamD,.3,.06,.06,x,.75,-5.15);}else Cs.b(VM.beamD,.05,2,.05,x,1.2,-5.15);}Cs.cyl(VM.iron,.32,.06,8,X+.85,1.6,-5.1,'tile',true);ssol(sl,X,-5.3,1.15,.2,2.3);
      if(k===0){const p=Cs.w(X,0,-4.1);use(p.x,p.z,1.2,()=>once('wf')?'Waffenkammer durchsuchen':null,()=>{mark('wf');const L=[[['arrow','arrow_fire','arrow_silver'][ri(0,2)],10+ri(0,12)]];const W=['iron_sword','longbow','iron_shield','iron_axe','spear','iron_helm','iron_armor','iron_boots','compbow','silver_sword','silver_helm'].filter(q=>ITEMS[q]);
        if(r()<.55&&W.length)L.push([W[(r()*W.length)|0],1]);lootGive(L,'Waffenkammer');},2.6);}}
    C.b(VM.plankB,.8,.8,.8,(r()-.5)*4,.4,(r()-.5)*4,0,r(),0);break;}
  case'grab':{st.sar=st.sar||{};for(let k=0;k<4;k++){const sl=take(false);if(!sl)break;const Cs=sl.C,X=sl.x;Cs.b(M.acc,2.3,.75,1.1,X,.375,-4.6);Cs.b(M.acc,2.45,.12,1.25,X,.81,-4.6);Cs.b(VM.gold,1.6,.02,.08,X,.88,-4.6);Cs.b(VM.gold,.08,.02,.6,X-.4,.88,-4.6);
      Cs.b(M.candle,.08,.3,.08,X+1.35,.15,-4.1);Cs.b(M.fire,.06,.08,.06,X+1.35,.34,-4.1);ssol(sl,X,-4.6,1.2,.6,.9);const key=R.c+'_'+k,lid=sl.C.w(X,0,-4.6),fr=sl.C.w(X,0,-3.6);
      use(fr.x,fr.z,.6,()=>st.sar[key]?null:'Sarkophag öffnen',()=>{st.sar[key]=1;saveGame();for(let q=0;q<20;q++)spawnParticle(lid.x,DG_Y+1,lid.z,(Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2,0x8a8a80,.8,.2);
        if(Math.random()<.5){const e=spawnEnt(['usks','uska','usksa'][(Math.random()*3)|0],fr.x,fr.z,{home:{x:fr.x,z:fr.z},cmd:1,aggroT:5});e.y=DG_Y;DGX.ents.push(e);toast('Etwas regt sich im Sarkophag!');}
        else lootGive([['silver',4+((Math.random()*10)|0)],[['ruby','opal','sapphire','emerald','oldcoin'][(Math.random()*5)|0],1]],'Grabbeigabe');},2);}
    break;}
  case'nest':{for(const s of['xm','xp','zm','zp']){const Cs=SC(cx,cz,s);K.webAt(Cs,-4.6,1);K.webAt(Cs,4.6,-1);}for(let k=0;k<4;k++){const x=(r()-.5)*7,z=(r()-.5)*7,y=1+r()*2;V.face(M.web,[C.w(x-1.2,y+1.4,z),C.w(x+1.3,y+1.2,z+.4),C.w(x,y-.6,z-.3)],[0,1,1,1,0,0]);}
    for(let k=0;k<ri(4,8);k++){const q=[[-1,-1],[1,-1],[-1,1],[1,1]][k%4],x=q[0]*(3+r()*1.2),z=q[1]*(3+r()*1.2);C.cyl(M.egg,.2+r()*.12,.45,6,x,0,z,'tile',true);}K.bones(C,0,0);
    const sp=fl?['spj','spg','spw']:['spj','spj','spg'];for(let k=0;k<ri(3,5);k++)mob(sp[(r()*sp.length)|0],cx+(r()-.5)*6,cz+(r()-.5)*6);break;}
  case'saeulen':{for(const sx of[-1,1])for(const sz of[-1,1]){C.b(M.acc,.8,H,.8,sx*2.1,H/2,sz*2.1);C.b(M.acc,1,.3,1,sx*2.1,.15,sz*2.1);sol(cx+sx*2.1,cz+sz*2.1,.4,.4,DG_Y,DG_Y+H);}C.b(M.carpet,1.4,.02,9,0,.01,0,0,0,0,'tile');break;}}}
// ---------- Bücher, Gefangene ----------
DIALOGS['Altes Buch']={start:()=>'r',nodes:{r:()=>({text:DG2.book||'',opts:[{label:'Buch schließen',go:null}]})}};
function dg2Icon(kind){const c=document.createElement('canvas');c.width=c.height=22;const x=c.getContext('2d');x.fillStyle='#1a1410';x.fillRect(0,0,22,22);if(kind==='book'){x.fillStyle='#6a1e1a';x.fillRect(4,4,14,15);x.fillStyle='#e8e0c8';x.fillRect(6,5,11,13);x.fillStyle='#7a6a50';for(let k=0;k<5;k++)x.fillRect(8,7+k*2,7,1);x.fillStyle='#c8a040';x.fillRect(4,4,2,15);}return c;}
function dg2Book(text,onFirst){DG2.book=text;let bonus='';if(onFirst&&Math.random()<.35&&typeof SPELL_ORDER!=='undefined'&&SPELL_ORDER.length){const id='sr_'+SPELL_ORDER[(Math.random()*SPELL_ORDER.length)|0];if(ITEMS[id]){if(!addItem(id,1))spawnDrop(id,1,P.x,P.y+1,P.z);bonus='\n\nZwischen den Seiten steckt eine Zauberrolle: '+ITEMS[id].name+'.';renderInv();}}
  if(onFirst){onFirst();try{gainXP(10);}catch(e){}}DG2.book=text+bonus;openDialog({name:'Altes Buch',role:'Gewölbe-Bibliothek',portrait:dg2Icon('book')});}
DIALOGS['Gefangener']={start:()=>'a',nodes:{a:()=>({text:DG2.prText||'',opts:[{label:'Geh schnell nach oben. Du bist frei.',go:null}]})}};
function dg2Free(pr){if(pr.freed)return;pr.freed=true;const st=DGX.d.st;st.pr=st.pr||{};st.pr[pr.c]=1;pr.dg.userData.t=0;pr.s.off=true;try{Snd.clank?Snd.clank():Snd.click();}catch(e){}
  const n=pr.name.split(',')[0],L=[['silver',8+((Math.random()*14)|0)]];L.push([['hpot','arrow','bread','ruby','opal','pstam'][(Math.random()*6)|0],1+((Math.random()*2)|0)]);
  DG2.prText=`Endlich! Ich dachte schon, mich holt hier keiner mehr raus. Ich bin ${n}. Die Skelette haben mich im Wald erwischt und hier runtergeschleppt.\n\nHier, das habe ich in meinem Stiefel versteckt. Nimm es, du hast es dir verdient!`;
  pr.anim=1;if(pr.e)openDialog({name:'Gefangener',role:pr.name,portrait:vlgPortrait(sprOf(pr.e,0))||dg2Icon('book'),d:pr.e.d});lootGive(L,null);try{gainXP(40);}catch(e){}pr.leaveT=time+1.5;}
// ---------- Licht der Fackeln ----------
function dg2Lights(T){for(const L of DG2.lights)scene.remove(L);DG2.lights=[];for(let k=0;k<3;k++){const L=new THREE.PointLight(T.torch,0,14,1.5);scene.add(L);DG2.lights.push(L);}DG2.lt=0;}
{const a=dgFree;dgFree=function(){for(const L of DG2.lights)scene.remove(L);DG2.lights=[];DGX.uses=[];DGX.traps2=[];DGX.torches=[];DGX.pris=[];return a();};}
dgSecrets=function(){};
// ---------- Wechsel zwischen den Ebenen ----------
function dg2Go(f,at){const g0=DGX.d&&DGX.d.g;if(!g0)return;const b=g0.base||g0,g2=dgFloorG(b,f),fl=$('wxFlash');if(DG2.going)return;DG2.going=true;if(fl){fl.style.transition='opacity .25s';fl.style.opacity=1;}try{Snd.click();}catch(e){}
  setTimeout(()=>{try{dgFree();DGX.on=true;dgBuild(g2);const s=at==='down'?DGX.downSpawn||DGX.spawn:DGX.spawn;P.x=s.x;P.z=s.z;P.y=DG_Y+.05;P.vx=P.vy=P.vz=0;P.yaw=s.yaw;P.safe=null;curArea=null;setTimeout(checkArea,150);
      try{lvMapBuildDG();}catch(e){}for(const e of DEM)if(e.fac==='ally'&&!e.dead){e.x=P.x+(Math.random()-.5)*2;e.z=P.z+(Math.random()-.5)*2;e.y=DG_Y;}
      const T=DG_THEMES[DGX.d.th];showArea(`${T.n} · Ebene ${f+1} von ${DGX.d.nf}`);}catch(e){console.error('Ebenenwechsel',e);}
    if(fl)setTimeout(()=>{fl.style.opacity=0;},120);DG2.going=false;DG2.armT=time+1.5;},280);}
{const a=dgEnter;dgEnter=function(g){a(g);try{if(DGX.on&&DGX.d&&!DGX.d.tower){const T=DG_THEMES[DGX.d.th];FLAGS.dgLast={x:g.x,z:g.z,rot:g.rot};setTimeout(()=>showArea(DGX.d&&DGX.d.nf>1?`${T.n} · Ebene 1 von ${DGX.d.nf}`:T.n),400);}}catch(e){}};}
// ---------- Benutzen ----------
function dg2Usable(){const d=dgD();if(!d||state!=='playing')return null;if(d.fl>0&&DGX.exit&&Math.hypot(DGX.exit.x-P.x,DGX.exit.z-P.z)<3.2&&lookingAt(DGX.exit.x,DG_Y+1,DGX.exit.z,4,.6))return{txt:'Nach oben steigen',fn:()=>dg2Go(d.fl-1,'down')};
  if(DGX.down&&Math.hypot(DGX.down.x-P.x,DGX.down.z-P.z)<3&&lookingAt(DGX.down.x,DG_Y-.3,DGX.down.z,4,.55))return{txt:'Hinabsteigen',fn:()=>dg2Go(d.fl+1,'start')};
  let best=null,bd=1e9;for(const u of DGX.uses||[]){const dd=Math.hypot(u.x-P.x,u.z-P.z);if(dd>u.r||dd>bd)continue;if(!lookingAt(u.x,u.y,u.z,u.r+1.2,.55))continue;const t=u.txt();if(!t)continue;bd=dd;best={txt:t,fn:u.fn};}return best;}
{const a=storyUse;storyUse=function(){const u=dg2Usable();if(u){u.fn();return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){const u=dg2Usable();if(u)return u.txt;return a();};}
// Mimics, Schatzkammer, tiefe Truhen
{const a=dgLoot;dgLoot=function(c){if(c&&!c.open&&c.mimic&&DGX.d){c.open=true;c.g.visible=false;c.s.off=true;const st=DGX.d.st;st.ch=st.ch||{};st.ch[c.key]=1;saveGame();
    const e=spawnEnt('mimic',c.x,c.z,{home:{x:c.x,z:c.z},cmd:1,aggroT:8});e.y=c.y;if(DGX.d.fl){e.hp=e.max=Math.round(e.hp*(1+.35*DGX.d.fl));}DGX.ents.push(e);toast('Die Truhe hat Zähne!');try{Snd.hit('axe');}catch(_){}return;}
  if(c&&!c.open&&/^k[AB]/.test(String(c.key))){c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z-=.3;c.lid.position.y+=.25;const R=Math.random,f=DGX.d.fl||0,L=[['silver',15+((R()*25)|0)+f*10],['coin',1+((R()*2)|0)+f]];L.push([['ruby','sapphire','emerald','opal','diamond'][(R()*5)|0],1]);
    if(R()<.3+f*.1){const ex=['ex_sharp_iron_sword','ex_fire_iron_armor','ex_sturdy_iron_shield','ex_sharp_longbow','ex_sharp_silver_sword','ex_ward_silver_helm'].filter(q=>ITEMS[q]);if(ex.length)L.push([ex[(R()*ex.length)|0],1]);}
    const st=DGX.d.st;st.ch=st.ch||{};st.ch[c.key]=1;lootGive(L,'Schatzkammer!');return;}
  const was=c&&c.open;a(c);try{const d=DGX.d;if(!was&&c&&c.open&&d&&!d.tower&&c.boss&&d.nf>1){const R=Math.random,L=[['coin',d.nf+((R()*3)|0)],[['diamond','ruby','sapphire'][(R()*3)|0],1+(d.nf>2?1:0)]];const ex=['ex_holy_silver_sword','ex_ward_silver_armor','ex_sturdy_silver_helm','ex_sharp_longbow'].filter(q=>ITEMS[q]);if(ex.length&&R()<.6)L.push([ex[(R()*ex.length)|0],1]);lootGive(L,'Schatz der Tiefe!');}}catch(e){}};}
// ---------- Takt: Licht, Fallen, Gefangene ----------
function dg2Tick(dt){const d=dgD();if(!d)return;const T=DG_THEMES[d.th];
  DG2.lt-=dt;if(DG2.lt<=0){DG2.lt=.25;const L=DGX.torches.map(t=>[Math.hypot(t.x-P.x,t.z-P.z),t]).filter(q=>q[0]<18).sort((a,b)=>a[0]-b[0]);DG2.lights.forEach((l,k)=>{const q=L[k];if(q){l.position.set(q[1].x,q[1].y,q[1].z);l.userData.on=1;}else l.userData.on=0;});}
  DG2.lights.forEach((l,k)=>{l.intensity=l.userData.on?1.5+Math.sin(time*11+k*2)*.12+Math.sin(time*7.3+k)*.08:0;});
  for(const t of DGX.traps2){
    if(t.k==='flame'){const ph=(time+t.ph)%5.5,on=ph>3.4&&ph<5.1,warn=ph>2.8&&ph<=3.4,l=Math.hypot(t.dx,t.dz)||1,ux=t.dx/l,uz=t.dz/l;
      if(warn&&Math.random()<dt*20)for(const n of t.nz)spawnParticle(n.x,DG_Y+.95,n.z,ux*.5,.2,uz*.5,0xffd040,.25,.1);
      if(on){for(const n of t.nz)for(let k=0;k<3;k++){const s=4+Math.random()*4;spawnParticle(n.x,DG_Y+.95+(Math.random()-.5)*.2,n.z,ux*s+(Math.random()-.5),(Math.random()-.2)*.8,uz*s+(Math.random()-.5),Math.random()<.5?0xff7a1a:0xffd040,.55,.25);}
        const px=P.x-t.x,pz=P.z-t.z,al=px*ux+pz*uz,lat=Math.abs(px*uz-pz*ux);if(al>0&&al<t.len&&lat<t.w&&P.y<DG_Y+1.6&&time-(t.hitT||-9)>.5){t.hitT=time;takeDamage(8);P.burnT=Math.max(P.burnT||0,1.5);}}}
    else if(t.k==='dart'){if(time>t.cd&&Math.abs(P.x-t.x)<.7&&Math.abs(P.z-t.z)<.7&&P.y<DG_Y+.4){t.cd=time+2.5;t.fire=time+.15;try{Snd.click();}catch(e){}}
      if(t.fire&&time>=t.fire){t.fire=0;const dx=t.x-t.wx,dz=t.z-t.wz,l=Math.hypot(dx,dz)||1;for(let k=0;k<12;k++){const s=14+Math.random()*4;spawnParticle(t.wx+(Math.random()-.5)*2.4,DG_Y+1.1,t.wz,dx/l*s,0,dz/l*s,0x8a8a80,.35,.08);}
        if(Math.hypot(P.x-t.x,P.z-t.z)<1.6&&P.y<DG_Y+1.5){takeDamage(9);toast('Pfeilfalle!');}}}
    else if(t.k==='bubble'){if(Math.random()<dt*(t.up?3:6))spawnParticle(t.x+(Math.random()-.5)*(t.up?.4:1),t.y,t.z+(Math.random()-.5)*(t.up?.4:1),(Math.random()-.5)*.2,t.up?.6:.4,(Math.random()-.5)*.2,t.col,.8,.15);}}
  for(const pr of DGX.pris){if(pr.anim&&pr.dg.position.y<DG_Y+DG_H-.7){pr.dg.position.y=Math.min(DG_Y+DG_H-.7,pr.dg.position.y+dt*2);}
    if(pr.e&&pr.leaveT&&time>pr.leaveT&&state==='playing'){const e=pr.e;e.home={x:DGX.spawn.x,z:DGX.spawn.z};e.wander=true;e.wx=DGX.spawn.x;e.wz=DGX.spawn.z;try{entMove(e,DGX.spawn.x,DGX.spawn.z,2.6,dt);e.anim=(e.anim||0)+dt*6;e.frame=[1,0,2,0][Math.floor(e.anim)%4];}catch(_){}
      if(Math.hypot(e.x-DGX.spawn.x,e.z-DGX.spawn.z)<1.5||time>pr.leaveT+40){removeEnt(e);pr.e=null;}}}
  if(state==='playing'&&time>DG2.armT&&!DG2.going&&!loadBusy){
    if(DGX.exitTop&&P.y>DG_Y+1.7&&Math.hypot(P.x-DGX.exitTop.x,P.z-DGX.exitTop.z)<1.5){DG2.armT=time+2.5;if(d.fl>0)dg2Go(d.fl-1,'down');else loadTransition('Zurück ans Tageslicht',()=>{if(DGX.on)dgLeave(false);});}
    const h=DGX.downHole;if(h&&P.x>h[0]+.3&&P.x<h[1]-.3&&P.z>h[2]+.3&&P.z<h[3]-.3){DG2.armT=time+2.5;dg2Go(d.fl+1,'start');}}
  for(const e of DGX.ents)if(e.vlados&&!e.greeted&&!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<12){e.greeted=1;mzSay(e,'Morvan … ist tot? Dann folgst du ihm in die Kälte!');try{Snd.demonRoar(.6,1.2);}catch(_){}}
  for(const s of DGX.secrets)if(s.gone&&s.key&&!d.st.sec[s.key]){d.st.sec[s.key]=1;saveGame();}
  if((d.th==='sumpf'||d.th==='eis')&&Math.random()<dt*2)spawnParticle(P.x+(Math.random()-.5)*14,DG_Y+H_DG2-.2,P.z+(Math.random()-.5)*14,0,-2,0,d.th==='eis'?0xcfe8ff:0x6a8a6a,1.2,.06);}
const H_DG2=DG_H;
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{dg2Tick(dt);}catch(e){if(!dg2Tick.err){dg2Tick.err=1;console.error('Gewölbe 2',e);}}};}
// ---------- Fehlerbehebungen ----------
const dgD=()=>DGX.on&&DGX.d&&!DGX.d.tower&&DGX.d.G&&DGX.d.gx0!=null?DGX.d:null;
// Monster entstehen im Gewölbe, nicht an der Oberfläche
{const a=spawnEnt;spawnEnt=function(t,x,z,o){const e=a(t,x,z,o);try{if(e&&DG2.bld){e.y=DG_Y;e.gy=DG_Y;}}catch(_){}return e;};}
// Bäume, Felsen und Stege der Oberfläche zählen unten nicht
{const a=collideTrees;collideTrees=function(){if(DGX.on&&P.y<DG_Y+40)return;return a();};}
{const a=collideTreesObj;collideTreesObj=function(o,R){if(DGX.on&&(o.y!=null?o.y:P.y)<DG_Y+40)return;return a(o,R);};}
try{const a=collideBridge;collideBridge=function(){if(DGX.on&&P.y<DG_Y+40)return;return a();};}catch(e){}
// Sicht und Wege
function dgBlocked(x,z){for(const b of solNear(x,z)){if(b.off||!b.solid||b.walk)continue;if(b.y1<DG_Y+1||b.y0>DG_Y+1.5)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)<b.hw&&Math.abs(lz)<b.hd)return true;}return false;}
function dgLOS(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),n=Math.ceil(L/.5);for(let k=1;k<n;k++){const q=k/n;if(dgBlocked(x0+(x1-x0)*q,z0+(z1-z0)*q))return false;}return true;}
function dgCellOf(d,x,z){const i=Math.floor((x-d.gx0)/DG_C),j=Math.floor((z-d.gz0)/DG_C),N=d.G.N;if(i<0||j<0||i>=N||j>=N)return-1;return i*N+j;}
const dgCC=(d,c)=>[d.gx0+(((c/d.G.N)|0)+.5)*DG_C,d.gz0+(c%d.G.N+.5)*DG_C];
function dgNextCell(d,a,b){const G=d.G,N=G.N,prev=new Map([[a,-1]]),q=[a],gOpen=!DGX.gate||DGX.gate.open;
  while(q.length){const c=q.shift();if(c===b)break;for(const n of[c-N,c+N,c-1,c+1]){if(n<0||n>=N*N||prev.has(n))continue;if((n===c-1||n===c+1)&&((n/N)|0)!==((c/N)|0))continue;const k=c<n?c+','+n:n+','+c;if(!G.edges.has(k)||(k===G.gate&&!gOpen))continue;prev.set(n,c);q.push(n);}}
  if(!prev.has(b))return-1;let c=b;while(prev.get(c)!==a)c=prev.get(c);return c;}
function dgSecOf(x,z){for(const s of DGX.secrets||[])if(s.room&&Math.abs(x-s.room.x)<s.room.w/2+.7&&Math.abs(z-s.room.z)<s.room.w/2+.7)return s;return null;}
function dgRoute(d,e,tx,tz){let ca=dgCellOf(d,e.x,e.z),cb=dgCellOf(d,tx,tz);
  if(ca<0){const S=dgSecOf(e.x,e.z);if(!S)return null;if(cb===-1&&dgSecOf(tx,tz)===S)return null;if(Math.hypot(S.x-e.x,S.z-e.z)>1.2)return[S.x,S.z];const c=dgCC(d,S.cell);return c;}
  if(cb<0){const S=dgSecOf(tx,tz);if(!S)return null;if(ca!==S.cell){cb=S.cell;}else{if(Math.hypot(S.x-e.x,S.z-e.z)<1.2)return null;if(dgLOS(e.x,e.z,tx,tz))return null;return[S.x,S.z];}}
  if(ca===cb)return null;const n=dgNextCell(d,ca,cb);if(n<0)return null;const[ax,az]=dgCC(d,ca),[bx,bz]=dgCC(d,n),dx=(ax+bx)/2,dz=(az+bz)/2;if(Math.hypot(dx-e.x,dz-e.z)<1.2)return[bx,bz];return[dx,dz];}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){const d=dgD();if(d&&!e.noPath&&Math.abs(e.y-DG_Y)<6){try{const w=dgRoute(d,e,tx,tz);if(w){tx=w[0];tz=w[1];}}catch(_){}}return a(e,tx,tz,sp,dt);};}
{const a=pickTarget;pickTarget=function(e){const t=a(e);if(!t||e.fac!=='demon')return t;const d=dgD();if(!d||Math.abs(e.y-DG_Y)>6)return t;
  if(time-(e.dgLT||-9)>.3){e.dgLT=time;const[tx,,tz]=tPos(t);e.dgLV=dgLOS(e.x,e.z,tx,tz);if(e.dgLV)e.dgSeen=time;}
  if(e.dgLV||e.aggroT>0||time-(e.dgSeen||-99)<10)return t;return null;};}
// Geschosse prallen an Wänden und Häusern ab
{const a=updateShots;updateShots=function(dt){a(dt);try{for(let i=SHOTS.length-1;i>=0;i--){const s=SHOTS[i];for(const b of solNear(s.x,s.z)){if(b.off||!b.solid||b.walk)continue;if(s.y<b.y0||s.y>b.y1)continue;const[lx,lz]=solLoc(b,s.x,s.z);if(Math.abs(lx)<b.hw&&Math.abs(lz)<b.hd){shotHit(s);SHOTS.splice(i,1);break;}}}}catch(e){}};}
// Spielstand im Gewölbe gespeichert: am Eingang weitermachen
{const a=loadGame;loadGame=function(){const r=a();try{if(r!==false&&!DGX.on&&P.x<60000&&P.y<DG_Y+40){const L=FLAGS.dgLast;if(L&&Math.hypot(P.x-L.x,P.z-L.z)<140){P.x=L.x-Math.sin(L.rot||0)*2.8;P.z=L.z+Math.cos(L.rot||0)*2.8;}P.y=getHeight(P.x,P.z)+.1;P.vx=P.vy=P.vz=0;P.safe=[P.x,P.z];}}catch(e){}return r;};}
// /gewoelbe: Cheat zum Testen (Thema erzwingen nicht möglich, aber direkt hinab)
HELP.push(['/tiefer','Im Gewölbe: direkt zur nächsten Ebene (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/tiefer\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/tiefer geht nur im Cheat-Modus.','err');return;}const d=dgD();if(!d){conLog('Du bist in keinem Gewölbe.','err');return;}if(d.fl>=d.nf-1){conLog('Das ist schon die unterste Ebene.','err');return;}dg2Go(d.fl+1,'start');closeConsole();return;}return a(raw);};}

// Graf Vlados als Wächter der Eisgruft (Quest „Der Bruder“)
function dg2Vlados(x,z){const e=spawnEnt('vampir2',x,z,{home:{x,z},name:'Graf Vlados',role:'Eisvampir',talk:0,airK:0,ice:1,aggroT:0});e.vlados=1;e.h0=e.h;e.special=vpAI;e.onHurt=vpHurt;
  e.onDeath=ev=>{vpPark(ev);ev.hidden=true;mzBurst(ev.x,ev.y+1,ev.z,90,[0x9ae8ff,0xeaf6ff,0x3a5068],6,1.6,.45);try{Snd.demonRoar(.9,1.7);}catch(_){}spawnDrop('vamulet',1,ev.x,ev.y+.5,ev.z);spawnDrop('coin',2,ev.x,ev.y+.5,ev.z);spawnDrop('silver',20,ev.x,ev.y+.5,ev.z);
    FLAGS.vq=2;saveGame();setTimeout(()=>toast('Graf Vlados zerfällt zu Eis und Asche. Die Brüder ruhen nun beide. Quest „Der Bruder“ abgeschlossen!'),1200);};
  VP.list.push(e);return e;}
