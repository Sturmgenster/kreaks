/* =========================================================
   0.0.140 · Akt II: Der Schlafende
   Nach Shikayas Fall geht die Geschichte weiter (Kapitel VI bis VIII):
   - VI · Die Schweigenden: Corvin sorgt sich um die Kultisten. Man belauscht nachts eine Zeremonie und findet ihre Litanei.
   - VII · Die Siegelsteine: Murgla liest sie: Die Kultisten wollen Vorgrath wecken, den Schlafenden, älter als die Dämonen.
     Drei Siegelsteine halten ihn. Sie liegen ganz unten in drei Gewölben (auf der Karte markiert), bewacht vom Wächter
     und von Kultisten der Tiefe. Man muss sie vor dem Kult holen.
   - VIII · Der Erwachende: An der Stillen Senke ruft Hohepriester Morvek nachts den Schlafenden. Nach Morvek erhebt sich
     Vorgrath aus dem Siegel. Solange nicht alle drei Siegelsteine in den Sockeln stecken, ist er unverwundbar.
     Er schlägt mit Klauen, schießt mit seinen Augen und ruft Kultisten. Belohnung: das Amulett der Stille.
   ========================================================= */
const K2={watchT:0,placed:0,ped:[0,0,0],site:null,ents:[],morvek:null,vor:null,stun:0,t:0};
CHAPTERS.push('Die Schweigenden','Die Siegelsteine','Der Erwachende');
MQ.push({ch:5,id:'k_corvin'},{ch:5,id:'k_watch'},{ch:5,id:'k_murgla'},{ch:6,id:'k_seals'},{ch:6,id:'k_murgla2'},{ch:7,id:'k_senke'},{ch:7,id:'k_morvek'},{ch:7,id:'k_vorgrath'},{ch:7,id:'k_corvin2'},{ch:7,id:'k_fin'});
const K2I=id=>MQ.findIndex(q=>q.id===id);
const K2L=LETTERS.length;
LETTERS.push({t:'Die Litanei der Schweigenden',src:'Verloren bei einer Zeremonie der Kultisten',text:'Wir schweigen, damit er hört.\nWir knien, damit er steht.\n\nVorgrath, Schläfer unter dem Stein,\ndie Königin des Feuers ist gefallen,\nihr Licht hielt dich gebunden, nun ist es erloschen.\n\nDrei Steine halten dich. Drei Steine holen wir aus der Tiefe.\nDann öffnen wir das Siegel in der Stillen Senke,\nund die Welt wird schweigen, so wie wir.'},
  {t:'Morveks Tagebuch',src:'Hohepriester Morvek',text:'Ich war Lehrer in Sturmburg. Ich hatte eine Familie. Dann kam der Blutmond, und Shikayas Dämonen nahmen mir alles.\n\nAls sie fiel, hörte ich zum ersten Mal die Stille. Darin war eine Stimme. Sie sagte: Es wird nie wieder wehtun.\n\nVorgrath verspricht kein Paradies. Nur Ruhe. Für immer. Ist das so schlimm?'},
  {t:'Inschrift am Siegel',src:'Die Stille Senke',text:'Hier schläft, was vor allem war.\nWir, die ersten Könige, haben es nicht besiegt. Wir haben es nur zum Schlafen gebracht.\n\nDrei Steine aus dem Herzen der Berge halten es. Trennt sie nie.\n\nWer dies liest: Es wird wieder erwachen. Sei bereit.'});
JR_DONE.push([5,'k_watch','Corvin bat mich, die Schweigenden nachts zu beobachten.'],[5,'k_murgla','Ich habe eine Zeremonie belauscht. Sie beten zu „Vorgrath“.'],[6,'k_seals','Murgla erzählte vom Schlafenden und den drei Siegelsteinen.'],
  [6,'k_murgla2','Alle drei Siegelsteine sind in meiner Hand.'],[7,'k_morvek','An der Stillen Senke rief Hohepriester Morvek den Schlafenden.'],[7,'k_vorgrath','Morvek ist gefallen. Vorgrath ist erwacht.'],[7,'k_corvin2','Vorgrath ist wieder versiegelt.'],[7,'k_fin','Corvin hat mir gedankt. Die Schweigenden sind ohne Führer.']);
// ---------- Gegenstände ----------
Object.assign(ITEMS,{siegelstein:{name:'Siegelstein',plural:'Siegelsteine'},stillamulett:{name:'Amulett der Stille',plural:'Amulette der Stille',slot:'neck'}});
Object.assign(ITEM_DESC,{siegelstein:'Ein schwerer, sechseckiger Stein. Violette Runen glimmen darin, wie ein langsamer Herzschlag. Er hält etwas fest.',stillamulett:'Halsschmuck aus dem Herzen eines Siegelsteins. Monster bemerken dich erst, wenn du ihnen sehr nahe kommst.'});
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(14,14),S=pal(['#2a2236','#3e3450','#56486c','#6e5e88']),G=hex('#c88aff');for(let y=1;y<13;y++)for(let x=1;x<13;x++){const dx=Math.abs(x-6.5),dy=Math.abs(y-6.5);if(dx+dy*.6>6.6)continue;p.set(x,y,S[shadeIdx(.75-(x-6.5)*.05-(y-6.5)*.07,4,x,y)]);}
    for(const[x,y]of[[6,4],[7,5],[6,6],[7,7],[6,8],[5,6],[8,6]])p.set(x,y,G);outline(p);list.push(['siegelstein',p.done()]);}
  {const p=new Px(12,14),G=pal(['#5a4a2a','#8a7440','#c8b070']),S=hex('#b07aff');for(let k=0;k<9;k++){const a=Math.PI*(k/8);p.set(6+Math.cos(a)*5,1+Math.sin(a)*4.5,G[1]);}for(let y=6;y<13;y++)for(let x=3;x<10;x++){if(Math.abs(x-6)+Math.abs(y-9)>3.5)continue;p.set(x,y,G[shadeIdx(.7-(x-6)*.1-(y-9)*.1,3,x,y)]);}
    p.set(6,9,S);p.set(6,8,S);p.set(5,9,S);p.set(7,9,S);outline(p);list.push(['stillamulett',p.done()]);}
}catch(e){console.error('Akt II: Symbole',e);}};}
// ---------- Kultisten der Tiefe, Morvek, Vorgrath ----------
CULT_LOOK.push(['#2a0606','#4a0c0c','#6e1414','#962020'],['#0a0610','#180e22','#28183a','#3a2452']);
DT.kultf={name:'Kultist der Tiefe',fac:'demon',h:1.9,hp:120,dmg:11,spd:2.6,reach:1.4,cd:1.3,wind:.4,spr:'kf_',xp:30,aggro:30,leash:70,rad:.35,
  ranged:{min:4,max:14,cd:3.5,wind:.5,spd:12,dmg:9,orb:'orb_void',n:1,col:0x9a4aff},loot:[['silver',2,.6],['copper',12,.6]]};
DT.morvek={name:'Hohepriester Morvek',fac:'demon',boss:1,h:2.6,hp:2600,dmg:20,spd:2.6,reach:1.6,cd:1.4,wind:.45,spr:'mor_',xp:700,aggro:45,leash:140,rad:.5,
  ranged:{min:4,max:22,cd:2.6,wind:.6,spd:13,dmg:14,orb:'orb_void',n:3,spread:.2,col:0xb04aff},loot:[['coin',2,1],['ruby',1,.8]]};
DT.vorgrath={name:'Vorgrath, der Schlafende',fac:'demon',boss:1,h:15,hp:9000,dmg:30,spd:0,reach:0,cd:99,spr:'vorg_',xp:1500,aggro:80,leash:400,rad:3,noLeash:true,loot:[['coin',5,1],['diamond',2,1],['sapphire',2,1]]};
function vorSprite(f){const W=160,H=150,p=new Px(W,H),B=pal(['#07030b','#110818','#1c0e28','#2a163c','#3c2054','#52306e']),E=hex('#ffe070'),EP=hex('#200000'),Rd=pal(['#2a0408','#5a0a14','#8a1424']),T=hex('#e8dcc8'),G=hex('#b060ff');
  const att=f==='a',stun=f==='k',ph=f===1?1:f===2?2:0;
  const ell=(x0,y0,rx,ry,P,b)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry;if(dx*dx+dy*dy>1)continue;p.set(x,y,P[shadeIdx((b||.6)-dx*.25-dy*.35,P.length,x,y)]);}};
  const limb=(x0,y0,x1,y1,w0,w1,b)=>{const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*1.5);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q,w=w0+(w1-w0)*q;for(let o=-w/2;o<=w/2;o+=.5)p.set(X+nx*o,Y+ny*o,B[shadeIdx((b||.55)-o/(w+1)*.4,B.length,Math.round(X+nx*o),Math.round(Y+ny*o))]);}};
  // Tentakel am Boden
  for(let k=0;k<6;k++){const s=k<3?-1:1,i=k%3,x0=80+s*(18+i*8),y0=140-i*3,wv=Math.sin(ph*2.1+k)*6;limb(x0,y0,x0+s*(22+i*6),y0-16+wv,8,3,.45);limb(x0+s*(22+i*6),y0-16+wv,x0+s*(30+i*7),y0-30+wv*1.4,3,1,.4);}
  // Körper
  const sy=stun?10:0;ell(80,96+sy,50,52,B,.55);ell(80,52+sy*1.4,36,30,B,.62);
  // Arme
  for(const s of[-1,1]){const sx=80+s*40,sy0=66+sy;if(att){limb(sx,sy0,80+s*66,22,16,10,.6);limb(80+s*66,22,80+s*72,6,10,6,.55);for(let c=0;c<3;c++)limb(80+s*72,6,80+s*(66+c*6),-4+c*2,3,1,.7);}
    else{limb(sx,sy0,80+s*64,104+sy,16,11,.55);limb(80+s*64,104+sy,80+s*58,136,11,7,.5);for(let c=0;c<3;c++)limb(80+s*58,136,80+s*(52+c*6),146,3,1,.6);}}
  // Maul
  const mo=att?14:stun?3:7+ph,my=62+sy;ell(80,my,18,mo,Rd,.5);for(let k=0;k<8;k++){p.set(66+k*4,my-mo+1,T);p.set(66+k*4,my-mo+2,T);p.set(67+k*4,my+mo-1,T);p.set(67+k*4,my+mo-2,T);}
  // Augen
  const eyes=[[80,40,6],[66,46,3],[94,46,3],[58,58,2.5],[102,58,2.5],[72,30,2],[88,30,2],[60,86,2.5],[100,90,2.5],[80,104,3]];
  for(const[x,y,r]of eyes){const yy=y+sy*(y<70?1.4:1);for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(a*a+b*b<=r*r)p.set(x+a,yy+b,stun?hex('#6a5a2a'):E);if(!stun){p.set(x,yy,EP);if(r>2.5){p.set(x,yy-1,EP);p.set(x,yy+1,EP);}}}
  // Runen
  for(let k=0;k<14;k++){const a=k/14*6.283,x=80+Math.cos(a)*40,y=100+sy+Math.sin(a)*34;p.set(x,y,G);if(k%2)p.set(x+1,y,G);}
  outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const f of[0,1,2,'p','k']){list.push(['mor_'+f,cultSprite(3,f)]);list.push(['kf_'+f,cultSprite(4,f)]);}list.push(['mor_a',cultSprite(3,'p')]);list.push(['kf_a',cultSprite(4,'p')]);
  for(const f of[0,1,2,'a','k'])list.push(['vorg_'+f,vorSprite(f)]);}catch(e){console.error('Akt II: Bilder',e);}};}
// ---------- Ziele ----------
const k2Night=()=>{const c=FLAGS.clock||0;return c>=1230||c<300;};
function k2CultNear(){let b=null,bd=1e9;try{for(const G of CULT.groups.values()){const x=G.st==='rite'&&G.spot?G.spot.x:G.x,z=G.st==='rite'&&G.spot?G.spot.z:G.z,d=Math.hypot(x-P.x,z-P.z);if(d<bd){bd=d;b=[x,z];}}}catch(e){}return b||[CODA.x,CODA.z];}
function k2Objective(id){switch(id){
  case'k_corvin':return{t:'Corvin will dich sprechen. Geh zur Kirche in Coda',at:npcAt('Corvin')};
  case'k_watch':return{t:k2Night()?'Belausche eine Zeremonie der Kultisten. Bleib in der Nähe, bis sie sprechen':'Warte auf die Nacht und belausche eine Zeremonie der Kultisten',at:k2CultNear()};
  case'k_murgla':return{t:'Bring die Litanei zu Murgla, der Froschhexe',at:[WITCH.x,WITCH.z]};
  case'k_seals':{const D=FLAGS.k2d||[],got=FLAGS.k2got||{},dirs=['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'];let at=null,bd=1e9;
    const list=D.map((d,i)=>{const ang=Math.atan2(d.x-CODA.x,-(d.z-CODA.z)),dir=dirs[((Math.round(ang/(Math.PI/4))%8)+8)%8],done=!!got[i];if(!done){const q=Math.hypot(d.x-P.x,d.z-P.z);if(q<bd){bd=q;at=[d.x,d.z];}}
      return{k:'s'+i,n:'Siegelstein '+(i+1),w:'',done,step:done?null:['Gewölbe im '+dir+' von Coda, ganz unten beim Wächter',[d.x,d.z]]};});
    if(DGX.on)at=null;return{t:`Hol die drei Siegelsteine aus den markierten Gewölben (${Object.keys(got).length}/3)`,list,at};}
  case'k_murgla2':return{t:'Bring die drei Siegelsteine zu Murgla',at:[WITCH.x,WITCH.z]};
  case'k_senke':{const s=FLAGS.k2site;return{t:k2Night()?'Geh zur Stillen Senke! Das Ritual beginnt':'Geh nachts zur Stillen Senke (auf der Karte markiert)',at:s?[s.x,s.z]:null};}
  case'k_morvek':{const e=K2.morvek;return{t:'Besiege Hohepriester Morvek',at:e&&!e.dead?[e.x,e.z]:FLAGS.k2site?[FLAGS.k2site.x,FLAGS.k2site.z]:null};}
  case'k_vorgrath':{const s=FLAGS.k2site,i=K2.ped.findIndex(v=>!v);if(K2.placed<3&&s&&i>=0){const[x,z]=k2PedPos(i);return{t:`Setz die Siegelsteine in die Sockel (${K2.placed}/3) und besiege Vorgrath`,at:[x,z]};}
    return{t:'Vorgrath ist verwundbar! Besiege ihn',at:s?[s.x,s.z]:null};}
  case'k_corvin2':return{t:'Kehre zu Corvin nach Coda zurück',at:npcAt('Corvin')};
  case'k_fin':return{t:'Akt II ist erzählt. Die Schweigenden sind ohne Führer.',at:null};}return undefined;}
{const a=mqObjective3;mqObjective3=function(id){const r=k2Objective(id);return r!==undefined?r:a(id);};}
// ---------- Gespräche ----------
{const D=DIALOGS.Corvin;if(D){const h0=D.nodes.hello;D.nodes.hello=function(){const n=h0.apply(this,arguments);if(n&&n.opts){const add=(label,go)=>{if(!n.opts.some(o=>o.go===go))n.opts.unshift({label,go});};
    if(mqIs('k_corvin'))add('Ihr habt nach mir geschickt?','k2a');if(mqIs('k_corvin2'))add('Vorgrath schläft wieder.','k2z');}return n;};
  D.nodes.k2a=()=>({text:'Gut, dass du da bist. Seit Shikaya gefallen ist, sehe ich sie überall: Gestalten in tiefen Roben. Sie stehen immer zusammen, sie sagen kein Wort. Und nachts gehen sie hinaus vor die Dörfer und knien im Kreis.\n\nIch habe hundert Jahre Bücher über die Dämonen gelesen. Aber das hier … das ist etwas anderes. Etwas Älteres.',opts:[{label:'Was soll ich tun?',go:'k2b'}]});
  D.nodes.k2b=()=>({text:'Beobachte sie. Nachts, wenn sie beten. Bleib nah genug, um zu hören, was sie sagen, aber lass dich nicht sehen. Ich will wissen, zu wem sie beten.',opts:[{label:'Ich kümmere mich darum.',act:()=>{mqSet(K2I('k_watch'));return null;},go:null}]});
  D.nodes.k2z=()=>({text:'Ich habe das Beben bis hierher gespürt. Und dann … Stille. Eine gute Stille.\n\nDu hast die Welt zum zweiten Mal gerettet, und kaum jemand wird es je erfahren. Nimm das hier. Ich habe es aus dem Splitter eines Siegelsteins gemacht, den Murgla mir brachte. Wer es trägt, geht leise durch die Welt.',
    opts:[{label:'Danke, Corvin.',act:()=>{k2Reward();return null;},go:null}]});}}
{const D=DIALOGS.Murgla;if(D){const h0=D.nodes.hello;D.nodes.hello=function(){const n=h0.apply(this,arguments);if(n&&n.opts){const add=(label,go)=>{if(!n.opts.some(o=>o.go===go))n.opts.unshift({label,go});};
    if(mqIs('k_murgla'))add('Kannst du das hier lesen? (Die Litanei zeigen)','k2m');if(mqIs('k_murgla2'))add('Ich habe alle drei Siegelsteine.','k2n');}return n;};
  D.nodes.k2m=()=>({text:'Quak … wo hast du das her? Das ist die Litanei der Schweigenden. Sie beten zu Vorgrath, dem Schlafenden. Er ist älter als die Dämonen, älter als Kreak, älter als alles.\n\nDie ersten Könige konnten ihn nicht töten. Sie haben ihn mit drei Siegelsteinen in den Schlaf gezwungen. Shikayas Feuer hat die Welt so laut gemacht, dass er nichts hörte. Jetzt ist sie tot, und es ist still. Zu still.',opts:[{label:'Wo sind die Steine?',go:'k2m2'}]});
  D.nodes.k2m2=()=>({text:'Ich spüre sie. Drei Herzschläge, tief unter der Erde, in drei alten Gewölben. Die Kultisten graben schon danach. Hol sie zuerst! Ganz unten, wo die Wächter schlafen. Ich male sie dir auf deine Karte.',opts:[{label:'Ich hole sie.',act:()=>{k2PickVaults();mqSet(K2I('k_seals'));return null;},go:null}]});
  D.nodes.k2n=()=>({text:'Ich höre sie in deinem Beutel pochen … Gut. Aber die Schweigenden geben nicht auf. Ihr Hohepriester heißt Morvek. Er wird an der Stillen Senke rufen, dort, wo Vorgrath unter dem Siegel liegt. Nachts, wenn die Welt am leisesten ist.\n\nWenn Vorgrath erwacht, ist er unverwundbar. Setz die drei Steine in die Sockel des alten Siegels. Erst dann kann deine Klinge ihn treffen.',opts:[{label:'Ich gehe zur Stillen Senke.',act:()=>{k2PickSite();mqSet(K2I('k_senke'));return null;},go:null}]});}}
// ---------- Gewölbe mit Siegelsteinen ----------
function k2PickVaults(){if(FLAGS.k2d&&FLAGS.k2d.length===3)return;const ci=Math.floor(CODA.x/WL_CELL),cj=Math.floor(CODA.z/WL_CELL),L=[];
  for(let R=1;R<=16&&L.length<10;R++)for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const g=dgOf(wlSite(ci+a,cj+b));if(g&&!L.includes(g))L.push(g);}
  L.sort((p,q)=>Math.hypot(p.x-CODA.x,p.z-CODA.z)-Math.hypot(q.x-CODA.x,q.z-CODA.z));const pick=[];for(const g of L){if(pick.every(q=>Math.hypot(q.x-g.x,q.z-g.z)>200))pick.push(g);if(pick.length===3)break;}
  for(const g of L){if(pick.length>=3)break;if(!pick.includes(g))pick.push(g);}
  FLAGS.k2d=pick.map(g=>({id:g.id,x:g.x,z:g.z}));FLAGS.k2got={};FLAGS.mapMarks=FLAGS.mapMarks||[];FLAGS.k2d.forEach((d,i)=>FLAGS.mapMarks.push({x:d.x,z:d.z,c:'#b070ff',n:'Siegelstein '+(i+1),k2:i+1}));
  for(const g of pick)g.nf=null;saveGame();}
// Gewölbe mit Siegelstein haben mindestens 2 Ebenen (außer der Wächter ist schon besiegt)
{const a=dg2Floors;dg2Floors=function(g){const n=a(g);try{if(n<2&&(FLAGS.k2d||[]).some(d=>d.id===g.id)&&!(FLAGS.k2got||{})[FLAGS.k2d.findIndex(d=>d.id===g.id)]){const st=(FLAGS.dgs||{})[g.id];if(!(st&&st.boss))g.nf=2;}}catch(e){}return g.nf;};}
function k2DgHook(g,G){const b=g.base||g,D=FLAGS.k2d||[],i=D.findIndex(d=>d.id===b.id);if(i<0||!mqAt('k_seals'))return;
  const d=DGX.d,r=mulberry32(((g.seed|0)^0x7c1e)>>>0);
  if(!(FLAGS.k2got||{})[i])for(const R of G.rooms){if(R.c===G.start||R.c===G.boss||!R.mob||r()>.6)continue;const[cx,cz]=dgCC(d,R.c);const e=spawnEnt('kultf',cx+(r()-.5)*5,cz+(r()-.5)*5,{home:{x:cx,z:cz},cmd:1,aggroT:0});e.y=DG_Y;e.dormant=true;e.showDormant=true;e.wakeR=11;DGX.ents.push(e);}
  if(!G.last)return;const[cx,cz]=dgCC(d,G.boss),ax=cx+2.6,az=cz+2.6,V=new VB2(),M=dg2Mats(d.th),C=vCx(V,vM(ax,DG_Y,az,0,.4,0));
  C.b(M.acc,1.6,.3,1.6,0,.15,0);C.b(M.acc,1,.9,1,0,.75,0);C.b(M.acc,1.3,.15,1.3,0,1.25,0);const got=!!(FLAGS.k2got||{})[i];V.build(DGX.grp);
  const stone=new THREE.Mesh(new THREE.BoxGeometry(.42,.5,.42),new THREE.MeshLambertMaterial({color:0x5a4a78,emissive:0x8a4aff,emissiveIntensity:.8}));stone.position.set(ax,DG_Y+1.6,az);stone.rotation.y=.6;stone.visible=!got;DGX.grp.add(stone);
  const s=solAdd({x:ax,z:az,hw:.6,hd:.6,y0:DG_Y,y1:DG_Y+1.3,rot:0,solid:1,dg:1});DGX.sol.push(s);
  DGX.uses.push({x:ax,z:az,y:DG_Y+1.4,r:2.6,txt:()=>(FLAGS.k2got||{})[i]?null:'Siegelstein nehmen',fn:()=>{if(DGX.ents.some(e=>e.dgBoss&&!e.dead)){toast('Der Wächter dieses Gewölbes bewacht den Stein. Besiege ihn zuerst!');return;}
    FLAGS.k2got=FLAGS.k2got||{};FLAGS.k2got[i]=1;stone.visible=false;if(!addItem('siegelstein',1))spawnDrop('siegelstein',1,P.x,P.y+1,P.z);renderInv();FLAGS.mapMarks=(FLAGS.mapMarks||[]).filter(m=>m.k2!==i+1);
    const n=Object.keys(FLAGS.k2got).length;showArea(`Siegelstein gefunden (${n}/3)`);try{Snd.chime();}catch(e){}for(let k=0;k<40;k++)spawnParticle(ax,DG_Y+1.6,az,(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,0xb070ff,.8,.2);
    if(n>=3&&mqIs('k_seals'))mqSet(K2I('k_murgla2'));else{renderMQ(true);saveGame();}}});
  DGX.traps2.push({k:'bubble',x:ax,z:az,y:DG_Y+1.9,col:0xb070ff,up:1});}
// ---------- Die Stille Senke ----------
function k2PickSite(){if(FLAGS.k2site)return;const r=mulberry32(((WSEED|0)^0x5e17)>>>0),ci=Math.floor(CODA.x/WL_CELL),cj=Math.floor(CODA.z/WL_CELL);
  for(let R=1;R<=10;R++)for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){if(Math.max(Math.abs(a),Math.abs(b))!==R)continue;const s=wlSite(ci+a,cj+b);if(!['ebene','wald','savanne','nadelwald'].includes(s.b)||s.island)continue;
    for(let t=0;t<12;t++){const an=r()*6.283,d=r()*s.R*.5,x=s.x+Math.cos(an)*d,z=s.z+Math.sin(an)*d;if(coreDist(x,z)<300||Math.hypot(x-CODA.x,z-CODA.z)<350)continue;if(wlDom(x,z)!==s)continue;
      let mn=1e9,mx=-1e9,ok=true;for(let q=0;q<16;q++){const aa=q/16*6.283;for(const rr of[6,12,18]){const h=getHeight(x+Math.cos(aa)*rr,z+Math.sin(aa)*rr);mn=Math.min(mn,h);mx=Math.max(mx,h);if(h<WATER+2)ok=false;}}
      if(!ok||mx-mn>2.2)continue;const g=s.dgDone?s.dg:dgOf(s);if(g&&Math.hypot(g.x-x,g.z-z)<70)continue;const v=s.vgDone?s.vg:null;if(v&&Math.hypot(v.x-x,v.z-z)<90)continue;
      FLAGS.k2site={x,z,y:getHeight(x,z)};FLAGS.mapMarks=FLAGS.mapMarks||[];FLAGS.mapMarks.push({x,z,c:'#9a4aff',n:'Die Stille Senke',k2:9});saveGame();return;}}
  FLAGS.k2site={x:CODA.x+420,z:CODA.z-60,y:getHeight(CODA.x+420,CODA.z-60)};}
{const a=wlBiomeOf;wlBiomeOf=function(s,x,z){const b=a(s,x,z),S=FLAGS.k2site;if(S&&WLV[b+'_frei']&&Math.abs(x-S.x)<26&&Math.abs(z-S.z)<26&&Math.hypot(x-S.x,z-S.z)<24)return b+'_frei';return b;};}
const k2PedPos=i=>{const S=FLAGS.k2site,a=-Math.PI/2+i*2.094;return[S.x+Math.cos(a)*8.5,S.z+Math.sin(a)*8.5];};
function k2SiteBuild(){const S=FLAGS.k2site,grp=new THREE.Group(),V=new VB2(),M=dg2Mats('gruft'),sol=[],gy=(x,z)=>getHeight(x,z),R0=17;
  // Steinboden, der dem Gelände folgt
  {const N=R0*2,pos=[],uv=[],idx=[];const X0=S.x-R0,Z0=S.z-R0;for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const x=X0+i,z=Z0+j;pos.push(x,gy(x,z)+.04,z);uv.push(x/2,z/2);}
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){if(Math.hypot(X0+i+.5-S.x,Z0+j+.5-S.z)>R0)continue;const a=j*(N+1)+i,b=a+1,c=a+N+1,d=c+1;idx.push(a,c,b,b,c,d);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
    grp.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:M.floor.map,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4})));}
  const OB=new THREE.MeshLambertMaterial({color:0x1a1620}),GL=new THREE.MeshLambertMaterial({color:0xb070ff,emissive:0x9a4aff,emissiveIntensity:.9});
  for(let k=0;k<8;k++){const a=k/8*6.283+.2,x=S.x+Math.cos(a)*15.5,z=S.z+Math.sin(a)*15.5,y=gy(x,z),C=vCx(V,vM(x,y,z,0,-a,0));C.b(OB,1,5.2,1,0,2.4,0);V.cone(OB,.75,1.2,4,vM(0,5,0,0,Math.PI/4,0,C.M),0);C.b(GL,.12,3,.06,0,2.4,.52);
    sol.push(solAdd({x,z,hw:.55,hd:.55,y0:y-1,y1:y+6,rot:0,solid:1}));}
  const sy=gy(S.x,S.z),Cs=vCx(V,vM(S.x,sy,S.z,0,0,0));K2.sealY=sy;
  for(let k=0;k<24;k++){const a=k/24*6.283;Cs.b(GL,.5,.08,.18,Math.cos(a)*3.9,.33,Math.sin(a)*3.9,0,-a,0);}
  for(let k=0;k<4;k++){const a=k/4*6.283+.4,x=S.x+Math.cos(a)*12,z=S.z+Math.sin(a)*12,y=gy(x,z),C=vCx(V,vM(x,y,z,0,0,0));C.cyl(dg2Mats('gruft').acc,.5,.8,8,0,0,0,'tile',true);C.b(GL,.5,.12,.5,0,.86,0);}
  for(let i=0;i<3;i++){const[x,z]=k2PedPos(i),y=gy(x,z),C=vCx(V,vM(x,y,z,0,0,0));C.b(M.acc,1.4,.3,1.4,0,.15,0);C.b(M.acc,.9,1,.9,0,.8,0);C.b(M.acc,1.1,.15,1.1,0,1.35,0);sol.push(solAdd({x,z,hw:.6,hd:.6,y0:y-1,y1:y+1.4,rot:0,solid:1}));}
  V.build(grp);
  // Siegel (abnehmbar) und offene Grube
  const seal=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.8,.6,24),new THREE.MeshLambertMaterial({map:M.acc.map}));seal.position.set(S.x,sy+.05,S.z);grp.add(seal);
  const pit=new THREE.Mesh(new THREE.CylinderGeometry(4.4,4.4,.1,24),new THREE.MeshBasicMaterial({color:0x050208}));pit.position.set(S.x,sy+.08,S.z);pit.visible=false;grp.add(pit);
  sol.push(solAdd({x:S.x,z:S.z,hw:3.6,hd:3.6,y0:sy-2,y1:sy+3,rot:0,solid:1}));
  const gems=[0,1,2].map(i=>{const[x,z]=k2PedPos(i),m=new THREE.Mesh(new THREE.BoxGeometry(.42,.5,.42),GL);m.position.set(x,gy(x,z)+1.7,z);m.visible=false;grp.add(m);return m;});
  scene.add(grp);K2.site={grp,sol,seal,pit,gems};}
function k2SiteFree(){const B=K2.site;if(!B)return;scene.remove(B.grp);B.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const s of B.sol)solDel(s);K2.site=null;}
// ---------- Kämpfe ----------
function k2Despawn(){for(const e of[K2.morvek,K2.vor,...K2.ents])if(e&&DEM.includes(e))removeEnt(e);K2.morvek=null;K2.vor=null;K2.ents=[];K2.placed=0;K2.ped=[0,0,0];}
function k2Acolytes(n,R){const S=FLAGS.k2site;for(let k=0;k<n;k++){if(K2.ents.filter(e=>!e.dead&&DEM.includes(e)).length>=6)break;const a=Math.random()*6.283,x=S.x+Math.cos(a)*(R||11),z=S.z+Math.sin(a)*(R||11);const e=spawnEnt('kultf',x,z,{home:{x,z},cmd:1,aggroT:20,always:true});K2.ents.push(e);
  for(let q=0;q<14;q++)spawnParticle(x,e.y+1,z,(Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2,0x9a4aff,.6,.25);}}
function k2MorvekAI(e,dt){e.sumT=(e.sumT==null?8:e.sumT)-dt;e.blT=(e.blT||0)-dt;if(e.tgt!=='player')return false;
  if(e.sumT<=0){e.sumT=14;k2Acolytes(2,9);mzSay(e,['Brüder und Schwestern, erhebt euch!','Schweigt … und kämpft!','Er hört uns. Er kommt.'][(Math.random()*3)|0]);}
  if(e.blT<=0&&Math.hypot(P.x-e.x,P.z-e.z)<2.6){e.blT=6;const a=Math.random()*6.283;for(let q=0;q<20;q++)spawnParticle(e.x,e.y+1,e.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,0x9a4aff,.5,.25);e.x+=Math.cos(a)*8;e.z+=Math.sin(a)*8;}
  return false;}
function k2SpawnMorvek(){const S=FLAGS.k2site;const e=spawnEnt('morvek',S.x,S.z+6,{home:{x:S.x,z:S.z+6},cmd:1,aggroT:30,always:true,noLeash:true});e.special=k2MorvekAI;K2.morvek=e;
  e.onDeath=ev=>{setTimeout(()=>{addLetter(K2L+1);k2Rise();},1500);};k2Acolytes(4,11);}
function k2Rise(){if(K2.vor&&!K2.vor.dead)return;const S=FLAGS.k2site;if(K2.site){K2.site.seal.visible=false;K2.site.pit.visible=true;}
  playCine([{t:'Morvek sinkt zu Boden. Für einen Moment ist es vollkommen still.'},{t:'Dann bricht das Siegel. Ein Laut steigt aus der Tiefe, so tief, dass du ihn eher in den Knochen spürst als hörst.'},
    {who:'Vorgrath',t:'„… WER … WECKT … MICH …“'},{t:'Murgla hatte recht: Solange die drei Siegelsteine nicht in ihren Sockeln stecken, wird ihn nichts verletzen.'}],()=>{k2SpawnVor();if(mqIs('k_morvek'))mqSet(K2I('k_vorgrath'));});}
function k2SpawnVor(){const S=FLAGS.k2site;K2.placed=0;K2.ped=[0,0,0];if(K2.site)K2.site.gems.forEach(g=>g.visible=false);
  const e=spawnEnt('vorgrath',S.x,S.z,{home:{x:S.x,z:S.z},cmd:1,always:true,noLeash:true,rise:0});e.inv=true;e.special=k2VorAI;K2.vor=e;try{Snd.demonRoar(1,.6);}catch(_){}
  e.onDeath=ev=>{k2VorDown();};}
function k2VorAI(e,dt){const S=FLAGS.k2site;e.x=S.x;e.z=S.z;if(e.rise!=null){e.rise=Math.min(1,e.rise+dt/4);e.frame=0;e.y=K2.sealY-(1-e.rise)*e.h*.85;if(Math.random()<dt*30)spawnParticle(S.x+(Math.random()-.5)*8,K2.sealY+.3,S.z+(Math.random()-.5)*8,(Math.random()-.5)*4,2+Math.random()*4,(Math.random()-.5)*4,Math.random()<.5?0x2a1a3a:0x9a4aff,1,.4);if(e.rise>=1)e.rise=null;return true;}
  e.y=K2.sealY;e.inv=K2.placed<3;if(K2.stun>0){K2.stun-=dt;e.frame='k';return true;}
  const pd=Math.hypot(P.x-S.x,P.z-S.z);e.frame=e.slam?'a':[0,1,2,1][Math.floor(time*2.5)%4];if(pd>60||state!=='playing')return true;
  e.slT=(e.slT==null?3:e.slT)-dt;e.voT=(e.voT==null?5:e.voT)-dt;e.suT=(e.suT==null?12:e.suT)-dt;e.puT=(e.puT||0)-dt;
  if(e.slam){e.slam.t-=dt;const L=e.slam;if(Math.random()<dt*40){const a=Math.random()*6.283;spawnParticle(L.x+Math.cos(a)*3.2,L.y+.2,L.z+Math.sin(a)*3.2,0,.6,0,0xb070ff,.4,.15);}
    if(L.t<=0){e.slam=null;try{Snd.boom(.5);}catch(_){}for(let k=0;k<40;k++)spawnParticle(L.x+(Math.random()-.5)*5,L.y+.3,L.z+(Math.random()-.5)*5,(Math.random()-.5)*6,1+Math.random()*4,(Math.random()-.5)*6,0x3a2a4a,.8,.35);
      if(Math.hypot(P.x-L.x,P.z-L.z)<3.5){takeDamage(32);P.vy=Math.max(P.vy,8);}}return true;}
  if(pd<6&&e.puT<=0){e.puT=3;const dx=P.x-S.x,dz=P.z-S.z,l=Math.hypot(dx,dz)||1;P.vx+=dx/l*16;P.vz+=dz/l*16;P.vy=Math.max(P.vy,6);takeDamage(10);for(let k=0;k<30;k++){const a=k/30*6.283;spawnParticle(S.x+Math.cos(a)*4,K2.sealY+1,S.z+Math.sin(a)*4,Math.cos(a)*8,1,Math.sin(a)*8,0x9a4aff,.5,.25);}return true;}
  if(e.slT<=0){e.slT=3.2+Math.random()*2;e.slam={x:P.x,z:P.z,y:groundAt(P.x,P.z,P.y+2),t:1.2};mzSay(e,['…ZERDRÜCKT…','…STILLE…','…KLEIN…'][(Math.random()*3)|0]);return true;}
  if(e.voT<=0){e.voT=6+Math.random()*2;shoot(e,P.x,P.y+1,P.z,{spd:16,dmg:14,n:5,spread:.16,col:0x9a4aff,orb:'orb_void',size:.8,life:4,sy:.72});return true;}
  if(e.suT<=0){e.suT=18;k2Acolytes(2,10);}return true;}
function k2Place(i){if(K2.ped[i]||!K2.vor||K2.vor.dead)return;K2.ped[i]=1;K2.placed++;if(K2.site)K2.site.gems[i].visible=true;K2.stun=4;const[x,z]=k2PedPos(i);
  for(let k=0;k<50;k++)spawnParticle(x,getHeight(x,z)+1.7,z,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,0xb070ff,.8,.25);try{Snd.chime();Snd.demonRoar(.8,.9);}catch(_){}
  if(K2.placed>=3){showArea('Das Siegel brennt! Vorgrath ist verwundbar!');K2.vor.inv=false;}else showArea(`Siegelstein eingesetzt (${K2.placed}/3)`);renderMQ(true);}
function k2VorDown(){const S=FLAGS.k2site;let n=3;while(n>0&&countItem('siegelstein')>0){removeItem('siegelstein',1);n--;}if(K2.site){K2.site.seal.visible=true;K2.site.pit.visible=false;}FLAGS.k2won=1;
  for(const e of K2.ents)if(e&&!e.dead&&DEM.includes(e))killEnt(e,'ally');try{gainXP(1500);}catch(e){}
  setTimeout(()=>playCine([{t:'Vorgrath sinkt zurück in die Tiefe. Das Siegel schließt sich über ihm, und die drei Steine leuchten ein letztes Mal auf.'},{who:'Vorgrath',t:'„… ICH … SCHLAFE … NUR …“'},
    {t:'Auf dem Siegel erscheint eine Inschrift, die vorher nicht da war.'}],()=>{addLetter(K2L+2);if(mqIs('k_vorgrath'))mqSet(K2I('k_corvin2'));saveGame();}),2500);}
function k2Reward(){if(!addItem('stillamulett',1))spawnDrop('stillamulett',1,P.x,P.y+1,P.z);lootGive([['coin',3],['diamond',1]],null);try{gainXP(800);}catch(e){}mqSet(K2I('k_fin'));
  FLAGS.mapMarks=(FLAGS.mapMarks||[]).filter(m=>!m.k2);saveGame();setTimeout(()=>showArea('Akt II abgeschlossen'),600);}
// ---------- Takt ----------
function k2Tick(dt){const st=mqStage();if(st<0)return;const id=MQ[st]&&MQ[st].id;
  if(id==='end'&&state==='playing'&&!(typeof FIN!=='undefined'&&FIN.on)){FLAGS.k2w=(FLAGS.k2w||0)+dt;if(FLAGS.k2w>150){mqSet(K2I('k_corvin'));setTimeout(()=>toast('Ein Bote aus Coda: Corvin bittet dich dringend in die Kirche.'),5600);}return;}
  if(id==='k_watch'&&state==='playing'){let near=false;try{if(k2Night())for(const G of CULT.groups.values())if(G.st==='rite'&&G.spot&&Math.hypot(P.x-G.spot.x,P.z-G.spot.z)<15)near=true;}catch(e){}
    K2.watchT=near?K2.watchT+dt:Math.max(0,K2.watchT-dt);if(K2.watchT>6){K2.watchT=0;playCine([{t:'Die Kultisten knien im Kreis. Leise, kaum hörbar, beginnen sie zu sprechen. Zum ersten Mal hörst du ihre Stimmen.'},
      {who:'Kultisten',t:'„Vor-grath … Schläfer unter dem Stein … die Königin ist gefallen, das Siegel ist schwach …“'},{who:'Kultisten',t:'„Drei Steine halten dich. Drei Steine holen wir. Dann wachst du auf, und die Welt schweigt mit uns.“'},
      {t:'Als sie aufstehen, verliert einer von ihnen ein Blatt Papier. Niemand bemerkt es. Du hebst es auf.'}],()=>{addLetter(K2L);mqSet(K2I('k_murgla'));});}}
  const S=FLAGS.k2site;if(!S)return;const d=Math.hypot(P.x-S.x,P.z-S.z),active=st>=K2I('k_senke');
  if(active&&P.x<60000&&!DGX.on&&d<230&&!K2.site)k2SiteBuild();if(K2.site&&(d>290||P.x>60000||DGX.on))k2SiteFree();
  if(K2.site&&Math.random()<dt*8){const a=(Math.random()*4|0)/4*6.283+.4,x=S.x+Math.cos(a)*12,z=S.z+Math.sin(a)*12;spawnParticle(x+(Math.random()-.5)*.4,getHeight(x,z)+1,z+(Math.random()-.5)*.4,0,1.2,0,0xb070ff,.7,.2);}
  if(state==='dead'||d>200){if(K2.morvek||K2.vor||K2.ents.length){k2Despawn();if(K2.site){K2.site.seal.visible=true;K2.site.pit.visible=false;K2.site.gems.forEach(g=>g.visible=false);}if(mqIs('k_morvek'))mqSet(K2I('k_senke'),true);}return;}
  if(id==='k_senke'&&k2Night()&&d<35&&!K2.morvek&&state==='playing'){playCine([{who:'Hohepriester Morvek',t:'„Da bist du also. Die Steine hast du uns genommen, ja. Aber das Siegel ist alt, und wir sind viele.“'},{who:'Hohepriester Morvek',t:'„Blut weckt ihn genauso gut. Deins wird reichen.“'}],()=>{k2SpawnMorvek();mqSet(K2I('k_morvek'));});}
  if(id==='k_vorgrath'&&!K2.vor&&d<40&&state==='playing')k2Rise();}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{k2Tick(dt);}catch(e){if(!k2Tick.err){k2Tick.err=1;console.error('Akt II',e);}}};}
// Sockel benutzen
function k2Usable(){if(!mqIs('k_vorgrath')||!K2.vor||K2.vor.dead||state!=='playing'||K2.vor.rise!=null)return null;for(let i=0;i<3;i++){if(K2.ped[i])continue;const[x,z]=k2PedPos(i);if(Math.hypot(x-P.x,z-P.z)<2.8)return{t:'Siegelstein einsetzen',fn:()=>k2Place(i)};}return null;}
{const a=storyUse;storyUse=function(){const u=k2Usable();if(u){u.fn();return true;}return a();};}
{const a=storyPrompt2;storyPrompt2=function(){const u=k2Usable();if(u)return u.t;return a();};}
// Amulett der Stille: Monster bemerken dich später
{const a=pickTarget;pickTarget=function(e){const t=a(e);try{if(t==='player'&&e.fac==='demon'&&!(e.aggroT>0)&&equip.neck&&equip.neck.id==='stillamulett'&&!e.d.boss){const d=Math.hypot(P.x-e.x,P.z-e.z);if(d>(e.d.aggro||30)*.55)return null;}}catch(_){}return t;};}
{const a=startGame;startGame=function(...r){k2Despawn();k2SiteFree();return a(...r);};}
// Cheat zum Testen
HELP.push(['/akt2 [stufe]','Akt II starten oder zu einer Stufe springen (nur im Cheat-Modus)']);
{const a=runCommand;runCommand=function(raw){const t=String(raw||'').trim();if(/^\/akt2\b/i.test(t)&&cheatsAllowed()){conHist.unshift(t);conHist=conHist.slice(0,30);conLog(`<span class="cmd">${esc(t)}</span>`);
    if(!cheatOn()){conLog('/akt2 geht nur im Cheat-Modus.','err');return;}const w=t.split(/\s+/)[1];const id=w?'k_'+w.replace(/^k_/,''):'k_corvin',i=K2I(id);if(i<0){conLog('Stufen: '+MQ.filter(q=>q.id.startsWith('k_')).map(q=>q.id.slice(2)).join(', '),'err');return;}
    if(i>=K2I('k_seals'))k2PickVaults();if(i>=K2I('k_senke'))k2PickSite();mqSet(i);conLog('Akt II: '+id,'ok');closeConsole();return;}return a(raw);};}
