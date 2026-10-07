/* =========================================================
   V63 · Die Abenteurergilde von Coda
   - Gildenhaus mit Innenraum, Gildenmeisterin Hilde
   - Questreihen (Monsterscharen und Minibosse), wiederholbar mit Abklingzeit
   - Abenteurer zum Anheuern: Schwertkämpfer, Schildträger, Bogenschützen, Heiler.
     Verträge für 1 Tag, 3 Tage oder eine Woche. Höchstens 3 Begleiter,
     Kreak zählt mit, MiniGHG auch, solange er nicht Wache hält.
   ========================================================= */
VDEFS.push({name:'Hilde',sex:'f',skin:2,hair:'red',style:'braid',dress:false,top:'black',bottom:'leather',apron:'leather',tw:13,seed:900+VDEFS.length*7,role:'Gildenmeisterin',id:VDEFS.length});
Object.assign(DOOR_TXT,{guildEnter:'Die Abenteurergilde',guildExit:'Coda'});
AREAS.in_guild='Die Abenteurergilde';AREA_MUSIC.in_guild='orte/coda';
let guildOut=null;
const GF=()=>{FLAGS.guild=FLAGS.guild||{rank:0,done:0,lines:{},q:null,hired:{}};const G=FLAGS.guild;G.lines=G.lines||{};G.hired=G.hired||{};return G;};
// ---------- Außen: das Gildenhaus ----------
function buildGuild(b){const hw=b.w/2,hd=b.d/2,base=footY(b,hw+.6,-hd-.6,hd+1.4),yW=base+.45,g1=yW+3.3,top=g1+3,rh=4.2,j=.25,P=(x,y,z)=>W3(b,x,y,z);
  if(!VM.guildSign){VM.guildSign=mat(pxTex(40,12,p=>{for(let y=0;y<12;y++)for(let x=0;x<40;x++)p.set(x,y,x===0||x===39||y===0||y===11?hex('#2a1a10'):hex('#4a2c18'));const G=hex('#f2cf6b'),S=hex('#c8ccd4');
      const F={G:['111','100','101','101','111'],I:['111','010','010','010','111'],L:['100','100','100','100','111'],D:['110','101','101','101','110'],E:['111','100','110','100','111']};let cx=11;for(const ch of'GILDE'){const g=F[ch];for(let yy=0;yy<5;yy++)for(let xx=0;xx<3;xx++)if(g[yy][xx]==='1')p.set(cx+xx,3+yy,G);cx+=4;}
      for(let k=0;k<7;k++){p.set(2+k,2+k,S);p.set(8-k,2+k,S);p.set(31+k,2+k,S);p.set(37-k,2+k,S);}p.set(2,9,G);p.set(8,9,G);p.set(31,9,G);p.set(37,9,G);}),{});
    VM.banRed=mat(pxTex(8,16,p=>{for(let y=0;y<16;y++)for(let x=0;x<8;x++){const t=y>12?Math.abs(x-3.5)<(16-y)*1.2:true;if(!t)continue;p.set(x,y,x===0||x===7?hex('#d8a028'):((x+y)%5===0?hex('#8a1a1a'):hex('#a82424')));}
      for(let y=4;y<9;y++){p.set(3,y,hex('#f2cf6b'));p.set(4,y,hex('#f2cf6b'));}p.set(2,5,hex('#f2cf6b'));p.set(5,5,hex('#f2cf6b'));},true),{alphaTest:.5,transparent:true});}
  // Sockel und Erdgeschoss aus Feldstein
  boxL(VM.stone,b,-hw-.2,hw+.2,base-2.5,yW,-hd-.2,hd+.2);for(let k=0;k<3;k++)boxL(VM.stone,b,-1.6,1.6,base-.5,yW-k*.15,hd+.2,hd+.55+k*.35,1,1);
  boxL(VM.field,b,-hw,hw,yW,g1,-hd,hd,3,2,'FBLR');
  hDoor(b,yW,hw,hd,1.4,2.3);for(const a of[-hw*.62,hw*.62])decal(VM.win,b,'F',a,yW+1.2,1.3,1.1,hw,hd);for(const f of['L','R'])for(const a of[-hd*.4,hd*.4])decal(VM.win,b,f,a,yW+1.2,1.2,1.1,hw,hd);
  // Obergeschoss aus Balken, leicht vorkragend
  boxL(VM.planks,b,-hw-j,hw+j,g1-.12,g1+.12,-hd-j,hd+j,2,1);boxL(VM.logs,b,-hw-j,hw+j,g1+.12,top,-hd-j,hd+j,3,2,'FBLR');
  for(const a of[-hw*.7,-hw*.23,hw*.23,hw*.7]){decal(VM.win,b,'F',a,g1+1,1.2,1.1,hw+j,hd+j);decal(VM.win,b,'B',a,g1+1,1.2,1.1,hw+j,hd+j);}
  for(const[x,z]of[[-hw-j,-hd-j],[hw+j,-hd-j],[-hw-j,hd+j],[hw+j,hd+j]])boxL(VM.planks,b,x-.18,x+.18,yW,top,z-.18,z+.18,1,1);
  gable(VM.shingle,VM.logs,b,-hw-j,hw+j,top,-hd-j,hd+j,rh,.6);boxL(VM.planks,b,-hw-.7,hw+.7,top+rh-.05,top+rh+.15,-.1,.1,1,1);
  hChimney(b,hw*.55,-hd*.3,top,top+rh+.6);
  // Schild und Banner
  {const z=hd+.06;quad(VM.guildSign,P(-1.7,yW+2.6,z),P(1.7,yW+2.6,z),P(1.7,yW+3.15,z),P(-1.7,yW+3.15,z),1,1);
    for(const a of[-hw*.45,hw*.45]){const zz=hd+j+.05;boxL(VM.planks,b,a-.8,a+.8,g1+2.55,g1+2.68,hd+j,hd+j+.25,1,1);quad(VM.banRed,P(a-.6,g1+.2,zz),P(a+.6,g1+.2,zz),P(a+.6,g1+2.6,zz),P(a-.6,g1+2.6,zz),1,1);}}
  // Übungspuppe und Waffenständer vor dem Haus
  {const[dx,dz]=[hw+1.8,hd+2.2];const gy=getHeight(...toW(b,dx,dz))-.05;boxL(VM.planks,b,dx-.1,dx+.1,gy,gy+1.9,dz-.1,dz+.1,1,1);boxL(VM.planks,b,dx-.7,dx+.7,gy+1.35,gy+1.47,dz-.07,dz+.07,1,1);
    boxL(VM.thatch||VM.planks,b,dx-.32,dx+.32,gy+.9,gy+1.7,dz-.25,dz+.25,1,1);boxL(VM.thatch||VM.planks,b,dx-.22,dx+.22,gy+1.7,gy+2.1,dz-.2,dz+.2,1,1);addColl(b,dx-.35,dx+.35,dz-.3,dz+.3);}
  {const[rx,rz]=[-hw-1.6,hd+1.4];const gy=getHeight(...toW(b,rx,rz))-.05;for(const o of[-.9,.9])boxL(VM.planks,b,rx-.08,rx+.08,gy,gy+1.6,rz+o-.08,rz+o+.08,1,1);boxL(VM.planks,b,rx-.07,rx+.07,gy+1.1,gy+1.2,rz-1,rz+1,1,1);
    for(let k=0;k<4;k++){const z=rz-.6+k*.4;boxL(VM.iron||VM.stone,b,rx+.05,rx+.12,gy+.25,gy+1.75,z-.03,z+.03,1,1);}addColl(b,rx-.2,rx+.2,rz-1,rz+1);}
  b.ct=top+rh+.3;addColl(b,-hw-.1,hw+.1,-hd-.1,hd+.1);}
{const bv1=buildVillage;buildVillage=function(){bv1();try{const g=VB.find(b=>b.type==='guild');if(g){buildGuild(g);flushGB();}}catch(e){console.error('Gilde',e);}};}
// ---------- Innen: der Gildensaal ----------
const MERC_SPOTS=[[-5.6,1.6],[-3.6,3.4],[4.4,1.2],[6.2,3.2],[6.6,-1.8],[-6.8,-1.4]];
function buildGuildHall(atlas){const H=GUILDI,ox=H.x,oz=H.z,grp=new THREE.Group(),ph=o=>new THREE.MeshPhongMaterial(Object.assign({flatShading:true,shininess:0,specular:0x000000},o));
  const planks=drawPlanksTex(),wallC=drawWallTex();
  const mats={floor:ph({map:texRepC(planks,9,6),color:0xb8a080}),ceil:ph({map:texRepC(planks,9,6),color:0x8a7a6a}),beam:ph({color:0x2e1c0e}),wall:len=>ph({map:texRepC(wallC,len/2,1.3),color:0xd8ccb4})};
  buildRoomShell(H,grp,mats);
  const wood=ph({map:texRepC(planks,1,1)}),dark=ph({color:0x2e1c0e}),stone=ph({color:0x625c58}),red=ph({color:0x8a1e1e}),blue=ph({color:0x22346a}),gold=ph({color:0xc8a040}),paper=ph({color:0xe8dcc0}),iron=ph({color:0x8a8e96}),fur=ph({color:0x6a4a2a});
  const win=new THREE.MeshBasicMaterial({map:texRepC(drawWindowTex(),1,1)}),doorM=ph({map:texRepC(drawDoorTex(),1,1)});
  const plane=(m,x,y,z,w,h,rot)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);q.position.set(x,y,z);q.rotation.y=rot||0;grp.add(q);return q;};
  plane(doorM,ox,FY+1.15,oz+H.d/2-.02,1.4,2.3,Math.PI);for(const wx of[-5,5])plane(win,ox+wx,FY+2,oz+H.d/2-.03,1.2,1.5,Math.PI);
  for(const sd of[-1,1])plane(win,ox+sd*(H.w/2-.03),FY+2.1,oz+2.4,1.2,1.5,-sd*Math.PI/2);
  // Theke der Gildenmeisterin
  solid(grp,wood,ox,FY,oz-3.5,5,.78,.9,true);solid(grp,dark,ox,FY+.78,oz-3.5,5.3,.08,1.1);solid(grp,wood,ox-2.9,FY,oz-4.4,.9,.78,2.6,true);
  solid(grp,paper,ox-1.2,FY+.86,oz-3.4,.6,.03,.4);solid(grp,dark,ox+1.3,FY+.86,oz-3.5,.35,.3,.35);solid(grp,gold,ox+1.7,FY+.86,oz-3.3,.25,.12,.25);
  // Anschlagbrett mit Aufträgen (Nordwand links)
  {const bx=ox-5.8,bz=oz-H.d/2+.06;plane(wood,bx,FY+2.2,bz,3.2,2,0);const r=mulberry32(77);for(let k=0;k<9;k++){const q=plane(paper,bx-1.2+(k%3)*1.2+(r()-.5)*.3,FY+1.6+Math.floor(k/3)*.62+(r()-.5)*.1,bz+.02+k*.002,.55+r()*.2,.42,0);q.rotation.z=(r()-.5)*.25;}
    plane(red,bx+1.3,FY+2.95,bz+.04,.12,.12,0);}
  // Banner, Wappen
  for(const[bx,m]of[[ox-1.8,red],[ox+1.8,blue]]){plane(m,bx,FY+3.1,oz-H.d/2+.04,1.1,2.2,0);plane(gold,bx,FY+4.2,oz-H.d/2+.05,1.3,.1,0);}
  {const w=new THREE.Mesh(new THREE.CircleGeometry(.6,10),gold);w.position.set(ox,FY+3.6,oz-H.d/2+.05);grp.add(w);plane(iron,ox,FY+3.6,oz-H.d/2+.06,.12,1.1,0).rotation.z=.7;plane(iron,ox,FY+3.6,oz-H.d/2+.07,.12,1.1,0).rotation.z=-.7;}
  // Waffenständer an der Ostwand
  {const x=ox+H.w/2-.35;solid(grp,dark,x,FY,oz-3.2,.4,2.2,2.6,true);for(let k=0;k<6;k++){solid(grp,iron,x-.25,FY+.4,oz-4.2+k*.4,.06,1.6,.08);solid(grp,dark,x-.25,FY+1.6,oz-4.2+k*.4,.18,.08,.18);}}
  // Fell vor dem Kamin, Kamin an der Westwand
  solid(grp,stone,ox-H.w/2+.5,FY,oz+1.2,.9,2.6,2.2,true);{const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.9),new THREE.MeshBasicMaterial({color:0x120804}));fp.position.set(ox-H.w/2+.96,FY+.45,oz+1.2);fp.rotation.y=Math.PI/2;grp.add(fp);}
  {const f=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),fur);f.rotation.x=-Math.PI/2;f.position.set(ox-H.w/2+2.4,FY+.012,oz+1.2);grp.add(f);}
  // Runde Tische mit Hockern
  const deco=[];for(const[tx,tz]of[[-4.4,2.4],[4.6,2.4],[0,1.4]]){const x=ox+tx,z=oz+tz;const t=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.08,10),wood);t.position.set(x,FY+.76,z);grp.add(t);
    const l=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,.76,6),dark);l.position.set(x,FY+.38,z);grp.add(l);COLL.push({x,z,cos:1,sin:0,hw:.75,hd:.75,h:.8});
    for(let k=0;k<3;k++){const a=k*2.1+.4,sx=x+Math.cos(a)*1.25,sz=z+Math.sin(a)*1.25;const s=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.45,8),wood);s.position.set(sx,FY+.225,sz);grp.add(s);}
    deco.push({x,z,y:FY+.8,w:.13,h:.26,spr:'candle',tint:1.4});}
  deco.push({x:ox-H.w/2+1.15,z:oz+1.2,y:FY,w:.9,h:.74,spr:'campfire',tint:1.5});for(const[lx,lz]of[[-3.5,0],[3.5,0],[0,-2],[0,3.5]])deco.push({x:ox+lx,z:oz+lz,y:FY+3.6,w:.16,h:.32,spr:'candle',tint:1.6});
  for(const[lx,lz,s]of[[-7.6,-4.6,'chest'],[7.4,4.6,'chest'],[-7.4,4.8,'potb']]){const S=SPR[s];if(S)deco.push({x:ox+lx,z:oz+lz,y:FY,w:.9,h:.9*S.h/S.w,spr:s,tint:1});}
  scene.add(grp);const im=bbMaterial(atlas,0,0);EXTRA_BB.push(im);scene.add(makeBillboards(deco,im));
  INT_DOORS.push({x:ox,z:oz+H.d/2-.3,kind:'guildExit'});
  const g=VB.find(b=>b.type==='guild');if(g&&g.door){guildOut={x:g.door[0],z:g.door[1]};const ux=g.door[0]-g.x,uz=g.door[1]-g.z,ul=Math.hypot(ux,uz)||1;guildOut.nx=ux/ul;guildOut.nz=uz/ul;}
  const v=villagers.find(q=>q.name==='Hilde');if(v){const x=ox+.4,z=oz-4.3;v.ax=x;v.az=z;v.rad=.8;v.x=x;v.z=z;v.tx=x;v.tz=z;v.y=FY;v.inside=true;v.home=null;}}
{const ii1=initInteriors;initInteriors=function(atlas){ii1(atlas);try{buildGuildHall(atlas);}catch(e){console.error('Gildensaal',e);}};}
{const dl1=doorLooked;doorLooked=function(){const d=dl1();if(d)return d;if(P.x<IN_X&&guildOut&&Math.hypot(guildOut.x-P.x,guildOut.z-P.z)<3.2&&lookingAt(guildOut.x,getHeight(guildOut.x,guildOut.z)+1.4,guildOut.z,3.8,.55))return{kind:'guildEnter'};return null;};}
{const ud1=useDoor;useDoor=function(d){
  if(d.kind==='guildEnter'){enterInterior(GUILDI.x,GUILDI.z+GUILDI.d/2-1.3,0);return;}
  if(d.kind==='guildExit'){const x=guildOut.x+guildOut.nx*1.2,z=guildOut.z+guildOut.nz*1.2;P.x=x;P.z=z;P.y=getHeight(x,z)+.05;P.vx=P.vy=P.vz=0;P.yaw=Math.atan2(guildOut.nx,guildOut.nz);P.safe=[x,z];curArea=null;setTimeout(checkArea,150);Snd.click();return;}
  ud1(d);};}
{const sp1=storyPrompt2;storyPrompt2=function(){const t=sp1();if(t)return t;const d=doorLooked();if(d&&d.kind==='guildEnter')return'Abenteurergilde betreten';if(d&&d.kind==='guildExit')return'Gilde verlassen';return null;};}

/* =========================================================
   Abenteurer zum Anheuern
   ========================================================= */
const MERCS=[
  {id:'bruna',name:'Bruna',full:'Bruna Stahlhand',cls:'sword',role:'Schwertkämpferin',wpn:'great',hp:380,dmg:22,spd:5.3,reach:2.0,cd:.95,
    look:{race:'human',sex:'f',age:'adult',skin:2,hair:'braid',hairColor:'blond',beard:'none',cloth:'chain',clothColor:'red',pants:'brown',eyes:'blue'},
    deals:[[1,45],[3,120],[7,260]],intro:'Bruna Stahlhand. Ich schwinge einen Zweihänder, und zwar ziemlich gut. Ich gehe vorneweg und räume auf.',
    skills:['Klingenkombo: jeder dritte Hieb trifft mit voller Wucht und stößt zurück','Wirbelschlag: trifft alle Gegner rund um sie herum','Ansturm: stürmt auf Gegner zu, die weiter weg stehen'],
    lines:['Bleib hinter mir, dann passiert dir nichts.','Mein Schwert wird schon ungeduldig.','Wann gibt es wieder was zu tun?']},
  {id:'ivo',name:'Ivo',full:'Ivo Eichschild',cls:'tank',role:'Schildträger',wpn:'axeshield',hp:560,dmg:15,spd:4.7,reach:1.8,cd:1.1,
    look:{race:'dwarf',sex:'m',age:'adult',skin:1,hair:'short',hairColor:'red',beard:'long',cloth:'chain',clothColor:'blue',pants:'grey',eyes:'black'},
    deals:[[1,35],[3,95],[7,200]],intro:'Ivo Eichschild, Schildträger. Ich halte die Viecher von dir fern. Was an mich drankommt, kommt nicht an dich dran.',
    skills:['Spott: lockt alle Gegner in der Nähe auf sich','Schildwall: hält viel mehr aus, wenn es eng wird','Schildstoß: betäubt einen Gegner kurz'],
    lines:['Ein guter Schild ist mehr wert als zehn Schwerter.','Ich stell mich vorne hin. Wie immer.','Riechst du das? Regen. Oder Ork.']},
  {id:'lyra',name:'Lyra',full:'Lyra Windpfeil',cls:'bow',role:'Bogenschützin',wpn:'bow',hp:220,dmg:15,spd:5.7,reach:1.6,cd:1.35,range:20,
    look:{race:'elf',sex:'f',age:'adult',skin:0,hair:'long',hairColor:'silver',beard:'none',cloth:'leather',clothColor:'green',pants:'brown',eyes:'green'},
    deals:[[3,140],[7,270]],intro:'Lyra Windpfeil. Ich treffe eine Krähe auf hundert Schritt. Unter drei Tagen fange ich gar nicht erst an, das lohnt sich nicht.',
    skills:['Hält Abstand und schießt aus der Ferne','Mehrfachschuss: drei Pfeile auf drei Gegner','Zielschuss: ein langer, sehr harter Schuss'],
    lines:['Der Wind steht gut.','Siehst du den Vogel dort? Nein? Ich schon.','Lass mir Platz zum Zielen.']},
  {id:'fenn',name:'Fenn',full:'Fenn Kieselbart',cls:'xbow',role:'Armbrustschütze',wpn:'xbow',hp:300,dmg:21,spd:4.9,reach:1.6,cd:2.0,range:17,
    look:{race:'dwarf',sex:'m',age:'adult',skin:2,hair:'mohawk',hairColor:'black',beard:'short',cloth:'leather',clothColor:'brown',pants:'brown',eyes:'blue'},
    deals:[[1,50],[3,130]],intro:'Fenn Kieselbart. Armbrust, Brandbolzen, und ein Bein, das schneller rennt als es aussieht. Eine Woche? Nee, so lange halte ich es mit niemandem aus.',
    skills:['Schwere Bolzen: langsam, aber hart','Brandbolzen: explodiert und lässt Gegner brennen','Rückzugssprung: springt weg, wenn ihm jemand zu nahe kommt'],
    lines:['Bolzen poliert, Sehne gespannt.','Feuer löst die meisten Probleme.','Kurz und schmerzlos, so mag ich das.']},
  {id:'mira',name:'Mira',full:'Mira Sonnhold',cls:'heal',role:'Heilerin',wpn:'staff',hp:240,dmg:9,spd:5.1,reach:1.6,cd:2.2,range:14,
    look:{race:'human',sex:'f',age:'adult',skin:1,hair:'bun',hairColor:'brown',beard:'none',cloth:'robe',clothColor:'cream',pants:'brown',eyes:'blue'},
    deals:[[1,55],[3,150],[7,290]],intro:'Mira Sonnhold, Heilerin. Ich halte dich am Leben. Und deine anderen Begleiter auch, wenn sie nett zu mir sind.',
    skills:['Heilung: heilt dich und deine Begleiter','Segen: alle nehmen eine Weile weniger Schaden','Wiederbelebung: holt Begleiter zurück, die am Boden liegen','Lichtstrahl, wenn niemand Heilung braucht'],
    lines:['Halt still, das ist nur ein Kratzer.','Iss mal was Ordentliches.','Ich spüre, wenn jemand Schmerzen hat.']},
  {id:'theo',name:'Theo',full:'Bruder Theo',cls:'heal2',role:'Wanderpriester',wpn:'staff2',hp:270,dmg:7,spd:4.3,reach:1.6,cd:2.6,range:12,
    look:{race:'human',sex:'m',age:'old',skin:0,hair:'none',hairColor:'white',beard:'long',cloth:'robe',clothColor:'purple',pants:'brown',eyes:'black'},
    deals:[[7,220]],intro:'Bruder Theo. Ich bin alt und gehe langsam, aber wenn ich mich einer Gruppe anschließe, dann richtig. Eine Woche, nicht weniger, und dafür nicht teuer.',
    skills:['Starke Heilung, etwas langsamer','Heilkreis: heilt alle in der Nähe auf einmal','Wiederbelebung von Begleitern am Boden'],
    lines:['Die Götter sehen alles. Na ja, das meiste.','Langsam, Kind. Meine Knie.','Ich habe schon Schlimmeres gesehen.']}];
const MERC_BY={};MERCS.forEach((m,i)=>{m.i=i;MERC_BY[m.name]=m;});
const mercEnts=[];
// ---------- Bilder: eigener kleiner Atlas ----------
function drawMercWeapon(k){
  if(k==='great'){const p=new Px(7,26),B=pal(['#5a606a','#9aa2ae','#d8dee6']),H=pal(['#3a2414','#6a4422']);for(let y=0;y<18;y++){p.set(2,y,B[0]);p.set(3,y,B[2]);p.set(4,y,B[1]);}p.set(3,0,B[2]);for(let x=0;x<7;x++)p.set(x,18,hex('#c8a040'));for(let y=19;y<25;y++)p.set(3,y,H[1]);p.set(3,25,hex('#c8a040'));return p.done();}
  if(k==='axeshield'){const p=new Px(9,18),H=pal(['#3a2414','#6a4422']),B=pal(['#5a606a','#9aa2ae','#d8dee6']);for(let y=2;y<18;y++)p.set(4,y,H[1]);for(let y=0;y<6;y++)for(let x=5;x<9-Math.abs(y-2.5)*.5;x++)p.set(x,y,B[x===8?2:1]);return p.done();}
  if(k==='shield'){const p=new Px(12,14),W=pal(['#3a2414','#5a3a1c','#7a5228']),M=hex('#9aa2ae');for(let y=0;y<14;y++)for(let x=0;x<12;x++){if(y>9&&Math.abs(x-5.5)>(14-y)*1.4)continue;p.set(x,y,x===0||x===11||y===0?M:W[(x>>2)%3]);}p.set(5,6,hex('#c8a040'));p.set(6,6,hex('#c8a040'));p.set(5,7,hex('#c8a040'));p.set(6,7,hex('#c8a040'));return p.done();}
  if(k==='bow'){const p=new Px(8,24),W=pal(['#4a2c14','#7a4a22','#a0682e']);for(let y=0;y<24;y++){const x=Math.round(5-Math.sin(y/23*Math.PI)*4);p.set(x,y,W[1]);p.set(x+1,y,W[2]);}for(let y=1;y<23;y++)p.set(6,y,hex('#e8e2d0'));return p.done();}
  if(k==='xbow'){const p=new Px(12,12),W=pal(['#3a2414','#6a4422','#8a6030']);for(let x=0;x<12;x++)p.set(x,6,W[2]);for(let x=2;x<12;x++)p.set(x,7,W[1]);for(let y=1;y<12;y++)p.set(9-Math.abs(y-6)*.3,y,hex('#5a606a'));p.set(0,5,hex('#9aa2ae'));return p.done();}
  const gem=k==='staff2'?hex('#c070ff'):hex('#ffe070'),p=new Px(5,28),W=pal(['#3a2414','#6a4422','#8a6030']);for(let y=4;y<28;y++){p.set(2,y,W[1]);p.set(1,y,W[0]);}for(let y=0;y<4;y++)for(let x=0;x<5;x++)if(Math.hypot(x-2,y-2)<2.2)p.set(x,y,gem);p.set(2,1,hex('#ffffff'));return p.done();}
function mercHoldBoth(c,right,ang,left,angL){const o=heroHold(c,right,ang);if(left&&c.handL){const x=o.getContext('2d');const[hx,hy]=c.handL;x.save();x.translate(hx+.5,hy+.5);x.rotate(angL||0);x.drawImage(left,-left.width/2,-left.height/2+2);x.restore();}return o;}
let mercMesh=null,mercTex=null;
function initMercAtlas(){const cv=document.createElement('canvas');cv.width=512;cv.height=512;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;const FR=['0','1','2','a','c','k'];
  MERCS.forEach((m,i)=>{const L=m.look,main=drawMercWeapon(m.wpn==='axeshield'?'axeshield':m.wpn),sh=m.wpn==='axeshield'?drawMercWeapon('shield'):null;
    const rangedHold=m.wpn==='bow'||m.wpn==='xbow';
    const fr={'0':mercHoldBoth(drawHero(L,0),main,rangedHold?0:.25,sh,0),'1':mercHoldBoth(drawHero(L,1),main,rangedHold?0:.25,sh,0),'2':mercHoldBoth(drawHero(L,2),main,rangedHold?0:.25,sh,0),
      'a':mercHoldBoth(drawHero(L,0,false,'up','R'),main,rangedHold?-1.3:-.7,sh,-.2),'c':mercHoldBoth(drawHero(L,0,false,'up','R'),main,rangedHold?-1.5:0,sh,0),'k':squashCv(drawHero(L,0),1.12,.62)};
    FR.forEach((f,k)=>{const c=fr[f];x.drawImage(c,k*50,i*64+(64-c.height));SPR['mc'+i+'_'+f]={c,w:c.width,h:c.height,u:k*50/512,v:1-(i*64+64)/512,du:c.width/512,dv:c.height/512};});
    m.portrait=frogPortrait(L);});
  mercTex=new THREE.CanvasTexture(cv);mercTex.magFilter=THREE.NearestFilter;mercTex.minFilter=THREE.NearestFilter;mercTex.generateMipmaps=false;
  const mm=bbMaterial(mercTex,0,0);EXTRA_BB.push(mm);mercMesh=makeBillboards(MERCS.map(()=>({x:0,y:-999,z:0,w:.01,h:.01,spr:'mc0_0',tint:1})),mm);mercMesh.frustumCulled=false;mercMesh.geometry.instanceCount=0;scene.add(mercMesh);}
{const i1=initDemons;initDemons=function(a){i1(a);try{initMercAtlas();}catch(e){console.error('Söldner-Bilder',e);}};}
MERCS.forEach((m,i)=>{DT['merc_'+m.id]={name:m.name,fac:'ally',h:m.cls==='tank'?1.7:1.84,hp:m.hp,dmg:m.dmg,spd:m.spd,reach:m.reach,cd:m.cd,hero:1,spr:'mc'+i+'_',rad:.35,aggro:20};});
// ---------- Begleiter zählen ----------
const hiredNames=()=>Object.keys(GF().hired);
function companionsUsed(){let n=hiredNames().length;if(FLAGS.kreak)n++;if(FLAGS.mini&&FLAGS.mini.mode!=='guard')n++;return n;}
const MAX_COMP=3;
function companionList(){const L=[];if(FLAGS.kreak)L.push('Kreak');if(FLAGS.mini&&FLAGS.mini.mode!=='guard')L.push('MiniGHG');return L.concat(hiredNames());}
// MiniGHG folgt nur, wenn noch Platz ist
{const s0=setupStoryDialogs;setupStoryDialogs=function(){s0();try{const D=DIALOGS.MiniGHG;if(D&&!D._g){D._g=1;const h0=D.nodes.hello;D.nodes.hello=()=>{const n=h0();for(const o of n.opts)if(/^Folge mir/.test(o.label)){const a0=o.act;o.act=()=>{if(FLAGS.mini.mode==='guard'&&companionsUsed()>=MAX_COMP)return'(MiniGHG schaut auf deine Begleiter und schüttelt den Kopf. Mehr als drei passen nicht in eine Gruppe.)';return a0();};}return n;};}}catch(e){console.error(e);}};}
// ---------- Vertrag ----------
const mins=()=>gameMinutes();
function fmtLeft(m){m=Math.max(0,m);const d=Math.floor(m/1440),h=Math.floor(m%1440/60);return d?`${d} T ${h} Std`:h?`${h} Std`:`${Math.max(1,Math.round(m))} Min`;}
const dealLabel=d=>d===1?'1 Tag':d===7?'1 Woche':d+' Tage';
function mercHire(m,days,price){const G=GF();if(wallet()<price){toast('Du hast nicht genug Geld.');return false;}
  const ext=!!G.hired[m.name];if(!ext&&companionsUsed()>=MAX_COMP){toast('Du hast schon drei Begleiter.');return false;}
  setWallet(wallet()-price);Snd.coin();if(ext)G.hired[m.name].until+=days*1440;else G.hired[m.name]={until:mins()+days*1440,wait:false};
  const e=mercEnts[m.i];if(e){e.hired=true;e.mode='follow';e.hp=e.max;e.down=0;}toast(ext?`Vertrag mit ${m.name} um ${dealLabel(days)} verlängert`:`${m.name} schließt sich dir an (${dealLabel(days)})`);renderQuests();saveGame();return true;}
function mercRelease(m,why){const G=GF();delete G.hired[m.name];const e=mercEnts[m.i];if(e){if(why&&Math.hypot(e.x-P.x,e.z-P.z)<30)say(e,why,3.5);e.hired=false;e.mode='home';e.homeT=why?4:0;}renderQuests();}
// ---------- Gespräche mit den Abenteurern ----------
MERCS.forEach(m=>{DIALOGS[m.name]={start:()=>'hello',nodes:{
  hello:()=>{const G=GF(),h=G.hired[m.name];
    if(h){return{text:`Noch ${fmtLeft(h.until-mins())} läuft unser Vertrag. `+(h.wait?'Ich warte hier, bis du mich holst.':'Wohin geht es?'),
      opts:[{label:h.wait?'Komm mit.':'Warte hier.',act:()=>{h.wait=!h.wait;const e=mercEnts[m.i];if(e)e.mode=h.wait?'wait':'follow';toast(h.wait?`${m.name} wartet hier`:`${m.name} folgt dir`);return null;},go:null},
        {label:'Vertrag verlängern',go:'deals'},{label:'Was kannst du?',go:'skills'},{label:'Vertrag beenden',go:'quit'},{label:'Weiter geht’s.',go:null}]};}
    return{text:m.intro,opts:[{label:'Was kannst du?',go:'skills'},{label:'Was kostet das?',go:'deals'},{label:'Vielleicht später.',go:null}]};},
  skills:()=>({text:`${m.full}, ${m.role}. `+m.skills.map(s=>'• '+s).join(' '),opts:[{label:'Zurück',go:'hello'}]}),
  deals:()=>{const G=GF(),ext=!!G.hired[m.name],full=!ext&&companionsUsed()>=MAX_COMP;
    return{text:ext?'Gern bleibe ich länger. Was darf es sein?':full?`Du hast schon drei Begleiter (${companionList().join(', ')}). Mehr passen nicht in eine Gruppe.`:'Das sind meine Bedingungen. Bezahlt wird im Voraus.',trade:true,
      opts:m.deals.map(([d,p])=>({label:`${dealLabel(d)} · ${fmtMoney(p)}`,on:wallet()>=p&&!full,act:()=>{mercHire(m,d,p);return null;},go:null})).concat([{label:'Zurück',go:'hello'}])};},
  quit:()=>({text:'Du willst den Vertrag beenden? Das Geld behalte ich, so ist das in der Gilde.',opts:[{label:'Ja, wir trennen uns.',act:()=>{mercRelease(m,'Dann gehe ich zurück zur Gilde. Mach’s gut.');return null;},go:null},{label:'Nein, doch nicht.',go:'hello'}]})}};});
// Mit den Abenteurern sprechen (im Saal und unterwegs)
{const sl2=storyLooked;storyLooked=function(){const v=sl2();if(v)return v;return lookNPC(mercEnts.filter(e=>e&&!e.dead&&!e.down&&!e.hidden),3.6);};}
// ---------- Spawnen und Verwalten ----------
function mercHomeSpot(m){const[lx,lz]=MERC_SPOTS[m.i%MERC_SPOTS.length];return[GUILDI.x+lx,GUILDI.z+lz];}
function ensureMercs(){const G=GF();for(const m of MERCS){let e=mercEnts[m.i];if(e&&DEM.includes(e))continue;
    const h=G.hired[m.name];let x,z;if(h&&!h.wait&&P.x<IN_X+1e9){[x,z]=behindP(2.5);}else[x,z]=mercHomeSpot(m);
    e=spawnEnt('merc_'+m.id,x,z,{name:m.name,role:m.role,always:true,merc:m,kind:'merc',hired:!!h,mode:h?(h.wait?'wait':'follow'):'home',portrait:m.portrait,promptName:'Mit '+m.name,ownMesh:mercMesh,ownI:m.i});
    e.special=mercStep;e.cds={};e.combo=0;mercEnts[m.i]=e;}}
let mercTick=0;
function mercContracts(){const G=GF(),now=mins();for(const name of hiredNames()){const h=G.hired[name],m=MERC_BY[name];if(!m){delete G.hired[name];continue;}
  if(now>=h.until){mercRelease(m,'Unser Vertrag ist um. Ich gehe zurück zur Gilde. Wenn du mich wieder brauchst, weißt du, wo du mich findest.');toast(`Der Vertrag mit ${name} ist abgelaufen.`);}}}
// ---------- Kampf-Hilfen ----------
let blessUntil=0;const MSHOTS=[];
function mHeal(t,n,e){if(t==='player'){const S=P.stats;if(S.hp>=S.maxHp)return;S.hp=Math.min(S.maxHp,S.hp+n);renderStats();for(let k=0;k<14;k++)spawnParticle(P.x+(Math.random()-.5)*1.2,P.y+Math.random()*2,P.z+(Math.random()-.5)*1.2,0,1.2+Math.random(),0,Math.random()<.5?0x9aff7a:0xfff0a0,.8,.18);}
  else if(t&&!t.dead){t.hp=Math.min(t.max,t.hp+n);for(let k=0;k<10;k++)spawnParticle(t.x+(Math.random()-.5),t.y+Math.random()*t.h,t.z+(Math.random()-.5),0,1.2,0,0x9aff7a,.7,.16);}}
function mShoot(e,q,dmg,o){o=o||{};MSHOTS.push({x:e.x,y:e.y+e.h*.62,z:e.z,q,dmg,spd:o.spd||26,col:o.col||0xd8c8a0,aoe:o.aoe||0,burn:o.burn||0,t:0,big:o.big||0});Snd.whoosh(700,.06);}
function enemyPos(q){const o=q[0];return[o.x,(o.y||0)+(o.h||1.4)*.5,o.z];}
function updateMShots(dt){for(let i=MSHOTS.length-1;i>=0;i--){const s=MSHOTS[i],o=s.q[0];s.t+=dt;if(!o||o.dead||o.alive===false||o.hp<=0||s.t>3){MSHOTS.splice(i,1);continue;}
  const[tx,ty,tz]=enemyPos(s.q),dx=tx-s.x,dy=ty-s.y,dz=tz-s.z,d=Math.hypot(dx,dy,dz);const st=s.spd*dt;
  for(let k=0;k<3;k++){const f=k/3;spawnParticle(s.x+dx/d*st*f,s.y+dy/d*st*f,s.z+dz/d*st*f,0,0,0,s.col,.18,s.big?.24:.12);}
  if(d<=st+.4){kreakHit(s.q,s.dmg);if(s.aoe){for(const e of DEM)if(e!==o&&e.fac==='demon'&&!e.dead&&!e.dormant&&Math.hypot(e.x-tx,e.z-tz)<s.aoe)hurtEnt(e,s.dmg*.6,'kreak');for(let k=0;k<26;k++)spawnParticle(tx,ty,tz,(Math.random()-.5)*5,Math.random()*4,(Math.random()-.5)*5,Math.random()<.5?0xff7a20:0xffd040,.6,.3);Snd.boom(.1);}
    if(s.burn&&s.q[1]==='dem'){o.burnT=4;o.burnD=s.burn;}MSHOTS.splice(i,1);continue;}
  s.x+=dx/d*st;s.y+=dy/d*st;s.z+=dz/d*st;}}
function updateBurns(dt){for(const e of DEM)if(e.burnT>0&&!e.dead){e.burnT-=dt;hurtEnt(e,e.burnD*dt,'kreak');if(Math.random()<dt*12)spawnParticle(e.x+(Math.random()-.5)*.6,e.y+Math.random()*e.h,e.z+(Math.random()-.5)*.6,0,1.4,0,Math.random()<.5?0xff6a20:0xffc040,.5,.2);}}
function allyList(e){const L=[];for(const o of mercEnts)if(o&&o!==e&&o.hired&&!o.dead)L.push(o);if(kreakE&&!kreakE.dead)L.push(kreakE);return L;}
function enemiesNear(x,z,r){const L=[];for(const o of DEM)if(o.fac==='demon'&&!o.dead&&!o.dormant&&!o.sink&&Math.hypot(o.x-x,o.z-z)<r)L.push(o);return L;}
function cdOk(e,k){return!(e.cds[k]>time);}function cdSet(e,k,s){e.cds[k]=time+s;}
function burst(e,col,n){for(let k=0;k<(n||16);k++)spawnParticle(e.x+(Math.random()-.5)*1.4,e.y+Math.random()*e.h,e.z+(Math.random()-.5)*1.4,(Math.random()-.5)*3,Math.random()*2.5,(Math.random()-.5)*3,col,.6,.22);}
function keepRange(e,o,dist,minR,maxR,dt){const ax=e.x-o.x,az=e.z-o.z,l=Math.hypot(ax,az)||1;
  if(dist<minR){entMove(e,e.x+ax/l*3,e.z+az/l*3,e.d.spd*1.1,dt);return true;}
  if(dist>maxR){entMove(e,o.x,o.z,e.d.spd,dt);return true;}
  e.sd=e.sd||(Math.random()<.5?1:-1);if(Math.random()<dt*.3)e.sd*=-1;if(e.atk>.4){entMove(e,e.x-az/l*e.sd*2,e.z+ax/l*e.sd*2,e.d.spd*.35,dt);return true;}return false;}
// ---------- Der Schritt eines Abenteurers ----------
function mercStep(e,dt){const m=e.merc,d=e.d;
  if(dlg&&dlg.v===e){e.frame=0;return true;}
  if(e.talk>0)e.talk-=dt;
  // Nicht angeheuert: im Gildensaal, oder auf dem Weg dorthin
  if(!e.hired){const[hx,hz]=mercHomeSpot(m);if(e.homeT>0){e.homeT-=dt;e.frame=0;return true;}
    if(Math.abs(e.x-hx)>40||Math.abs(e.z-hz)>40||P.x<IN_X||Math.hypot(P.x-e.x,P.z-e.z)>30){e.x=hx;e.z=hz;e.y=FY;e.frame=0;e.down=0;e.hp=e.max;e.mode='home';}
    e.idleT=(e.idleT||2+Math.random()*4)-dt;if(e.idleT<=0){e.idleT=3+Math.random()*5;e.ix=hx+(Math.random()-.5)*1.4;e.iz=hz+(Math.random()-.5)*1.4;}
    if(e.ix!=null&&Math.hypot(e.ix-e.x,e.iz-e.z)>.2)entMove(e,e.ix,e.iz,.9,dt);else e.frame=0;
    if(P.x>IN_X&&Math.hypot(P.x-e.x,P.z-e.z)<4&&!(e.chatCd>0)&&Math.random()<dt*.15)say(e,m.lines[(Math.random()*m.lines.length)|0],3);if(e.chatCd>0)e.chatCd-=dt;return true;}
  // Am Boden
  if(e.down>0){e.down-=dt;e.frame='k';if(e.down<=0){e.hp=e.max*.45;say(e,['Ich bin wieder auf den Beinen.','Das war knapp.','Weiter!'][(Math.random()*3)|0],2.5);}return true;}
  if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+dt*2.5);if(e.wall>0)e.wall-=dt;
  const pd=Math.hypot(P.x-e.x,P.z-e.z);
  e.farT=pd>22&&e.mode==='follow'?(e.farT||0)+dt:0;
  if(e.mode==='follow'&&(pd>60||e.farT>6||Math.abs(P.x-e.x)>500||(Math.abs(P.y-e.y)>12&&pd>6))){const b=behindP(2.6);e.x=b[0]+(Math.random()-.5);e.z=b[1]+(Math.random()-.5);e.y=groundAt(e.x,e.z,P.y+2);e.rs=null;burst(e,0xd8c8a0,10);return true;}
  // Laufende Aktionen (Ausholen, Zaubern)
  if(e.wind>0){e.wind-=dt;e.frame='a';if(e.wind<=0&&e.act)e.act();return true;}
  if(e.cast>0){e.cast-=dt;e.frame='c';if(e.cast<=0&&e.act)e.act();return true;}
  const healer=m.cls==='heal'||m.cls==='heal2';
  if(healer&&state==='playing'&&healerSupport(e,m))return true;
  const q=state==='cutscene'?null:kreakEnemies(e);
  if(q&&(e.mode!=='wait'||Math.hypot(q[0].x-e.x,q[0].z-e.z)<9)){const o=q[0],od=Math.hypot(o.x-e.x,o.z-e.z),reach=d.reach+(o.d&&o.d.rad||.4);
    if(!e.cry||time-e.cry>30){e.cry=time;say(e,{sword:['Für die Gilde!','Endlich!','Komm her!'],tank:['Hinter mich!','Ich hab sie!','Steht euch nicht im Weg!'],bow:['Ziel erfasst.','Bleibt in Bewegung!','Hab ihn.'],xbow:['Feuer frei!','Gleich knallt’s!','Runter mit dir!'],heal:['Ich halte euch am Leben!','Vorsicht, ihr da vorne!'],heal2:['Die Götter mit uns!','Seid tapfer!']}[m.cls][(Math.random()*2)|0],2.2);}
    if(m.cls==='sword'||m.cls==='tank')meleeAI(e,m,q,o,od,reach,dt);else rangedAI(e,m,q,o,od,dt);return true;}
  if(e.mode==='follow'){kreakRoam(e,dt,pd);e.chatCd=(e.chatCd==null?40+Math.random()*40:e.chatCd)-dt;if(e.chatCd<=0&&state==='playing'&&pd<10){e.chatCd=60+Math.random()*80;say(e,m.lines[(Math.random()*m.lines.length)|0],3);}}
  else e.frame=0;return true;}
function meleeAI(e,m,q,o,od,reach,dt){const d=e.d;
  if(m.cls==='sword'){
    if(cdOk(e,'charge')&&od>6&&od<16){cdSet(e,'charge',7);e.speedMul=2.6;e.chargeT=.9;e.chargeBonus=1;say(e,'Ansturm!',1.5);}
    if(e.chargeT>0){e.chargeT-=dt;if(e.chargeT<=0)e.speedMul=1;}
    const near=enemiesNear(e.x,e.z,3.2);
    if(cdOk(e,'whirl')&&near.length>=2){cdSet(e,'whirl',9);e.wind=.45;e.act=()=>{for(const t of enemiesNear(e.x,e.z,3.4)){hurtEnt(t,d.dmg*1.4,'kreak');const a=Math.atan2(t.z-e.z,t.x-e.x);t.x+=Math.cos(a)*1.2;t.z+=Math.sin(a)*1.2;}
      for(let k=0;k<30;k++){const a=k/30*6.283;spawnParticle(e.x+Math.cos(a)*2.2,e.y+1,e.z+Math.sin(a)*2.2,Math.cos(a)*2,.5,Math.sin(a)*2,0xd8dee6,.4,.2);}Snd.hit('sword');};say(e,'Wirbelschlag!',1.5);return;}}
  if(m.cls==='tank'){
    if(cdOk(e,'taunt')&&enemiesNear(e.x,e.z,10).length>=1){cdSet(e,'taunt',12);for(const t of enemiesNear(e.x,e.z,10))if(!t.d.boss||Math.random()<.6){t.tgt=e;t.tgtT=4.5;}burst(e,0xff4a2a,20);say(e,'Hierher, ihr Biester!',2);}
    if(cdOk(e,'wall')&&e.hp<e.max*.4){cdSet(e,'wall',20);e.wall=6;burst(e,0x8ab0ff,24);say(e,'Schildwall!',1.6);}
    if(cdOk(e,'bash')&&od<reach+.3&&q[1]==='dem'){cdSet(e,'bash',8);e.wind=.3;e.act=()=>{if(!o.dead&&Math.hypot(o.x-e.x,o.z-e.z)<reach+.8){hurtEnt(o,d.dmg*.8,'kreak');o.atk=Math.max(o.atk||0,1.8);o.wind=0;o.cast=0;const a=Math.atan2(o.z-e.z,o.x-e.x);o.x+=Math.cos(a)*.9;o.z+=Math.sin(a)*.9;
        for(let k=0;k<12;k++)spawnParticle(o.x,o.y+o.h*.8,o.z,(Math.random()-.5)*2,1,(Math.random()-.5)*2,0xfff080,.5,.15);Snd.hit('shield');}};return;}}
  if(!combatMove(e,o.x,o.z,od,reach,dt,1.1)){if(e.atk<=0){e.atk=d.cd*(.85+Math.random()*.3);e.wind=.3;e.act=()=>{if(Math.hypot(o.x-e.x,o.z-e.z)>reach+.8)return;e.combo=(e.combo||0)+1;let dmg=d.dmg;
      if(e.chargeBonus){dmg*=1.5;e.chargeBonus=0;}if(m.cls==='sword'&&e.combo%3===0){dmg*=1.7;if(q[1]==='dem'){const a=Math.atan2(o.z-e.z,o.x-e.x);o.x+=Math.cos(a)*1.3;o.z+=Math.sin(a)*1.3;}for(let k=0;k<10;k++)spawnParticle(o.x,(o.y||e.y)+1,o.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,0xffffff,.35,.18);}
      kreakHit(q,dmg);Snd.hit('sword');};}else e.frame=0;}}
function rangedAI(e,m,q,o,od,dt){const d=e.d;
  if(m.cls==='xbow'&&cdOk(e,'leap')&&od<3){cdSet(e,'leap',9);const ax=e.x-o.x,az=e.z-o.z,l=Math.hypot(ax,az)||1;for(let k=0;k<10;k++){e.x+=ax/l*.5;e.z+=az/l*.5;if(e.x<60000)collideTreesObj(e,.3);}burst(e,0xc8b090,12);say(e,'Hoppla!',1.2);return;}
  const minR=m.cls==='bow'?6:m.cls==='xbow'?5:5,maxR=m.range||16;
  if(keepRange(e,o,od,minR,maxR,dt))return;
  if(e.atk>0){e.frame=0;return;}
  if(m.cls==='bow'){
    if(cdOk(e,'multi')){const T=enemiesNear(e.x,e.z,maxR+2);if(T.length>=2){cdSet(e,'multi',7);e.atk=d.cd;e.cast=.45;e.act=()=>{T.slice(0,3).forEach(t=>mShoot(e,[t,'dem'],d.dmg*.9));};say(e,'Mehrfachschuss!',1.4);return;}}
    if(cdOk(e,'aim')&&(o.d&&o.d.boss||o.hp>120)){cdSet(e,'aim',12);e.atk=d.cd+.5;e.cast=1.2;e.act=()=>{mShoot(e,q,d.dmg*3,{spd:38,col:0xfff0a0,big:1});};say(e,'Zielschuss …',1.4);return;}
    e.atk=d.cd*(.9+Math.random()*.2);e.cast=.4;e.act=()=>mShoot(e,q,d.dmg);return;}
  if(m.cls==='xbow'){
    if(cdOk(e,'fire')){cdSet(e,'fire',10);e.atk=d.cd;e.cast=.6;e.act=()=>mShoot(e,q,d.dmg*1.3,{col:0xff7a20,aoe:2.8,burn:6,big:1});say(e,'Brandbolzen!',1.4);return;}
    e.atk=d.cd*(.9+Math.random()*.2);e.cast=.55;e.act=()=>mShoot(e,q,d.dmg,{spd:30,col:0xa09080});return;}
  // Heiler greifen nur an, wenn niemand Hilfe braucht
  e.atk=d.cd*(.9+Math.random()*.2);e.cast=.5;e.act=()=>mShoot(e,q,d.dmg,{spd:20,col:m.cls==='heal2'?0xc070ff:0xfff080,big:1});}
function healerSupport(e,m){const d=e.d,S=P.stats,strong=m.cls==='heal2',pd=Math.hypot(P.x-e.x,P.z-e.z),allies=allyList(e);
  // Wiederbelebung
  if(cdOk(e,'revive')){const t=allies.find(o=>o.down>0&&Math.hypot(o.x-e.x,o.z-e.z)<14);if(t){cdSet(e,'revive',strong?45:60);e.cast=1.4;e.act=()=>{if(t.down>0){t.down=0;t.hp=t.max*.6;burst(t,0xfff0a0,30);say(t,'Danke!',1.5);}};say(e,'Steh auf!',1.6);return true;}}
  // Heilkreis
  if(strong&&cdOk(e,'circle')){const low=[(S.hp<S.maxHp*.8&&pd<8)?'player':null].concat(allies.filter(o=>!o.down&&o.hp<o.max*.8&&Math.hypot(o.x-e.x,o.z-e.z)<8)).filter(Boolean);
    if(low.length>=2){cdSet(e,'circle',15);e.cast=1.2;e.act=()=>{for(const t of low)mHeal(t,26,e);for(let k=0;k<36;k++){const a=k/36*6.283;spawnParticle(e.x+Math.cos(a)*6,e.y+.3,e.z+Math.sin(a)*6,0,1.5,0,0x9aff7a,.9,.2);}};say(e,'Heilkreis!',1.5);return true;}}
  // Einzelheilung
  if(cdOk(e,'heal')){let t=null;if(S.hp<S.maxHp*.75&&pd<16)t='player';else{let w=.6;for(const o of allies)if(!o.down&&o.hp/o.max<w&&Math.hypot(o.x-e.x,o.z-e.z)<16){w=o.hp/o.max;t=o;}}
    if(t){cdSet(e,'heal',strong?6:4);e.cast=strong?1.1:.8;e.act=()=>mHeal(t,strong?46:30,e);if(Math.random()<.35)say(e,t==='player'?'Halt durch!':'Gleich wieder gut.',1.5);
      const tx=t==='player'?P.x:t.x,tz=t==='player'?P.z:t.z;if(Math.hypot(tx-e.x,tz-e.z)>10)entMove(e,tx,tz,d.spd,1/60);return true;}}
  // Segen
  if(!strong&&cdOk(e,'bless')&&kreakEnemies(e)){cdSet(e,'bless',25);e.cast=.9;e.act=()=>{blessUntil=time+10;burst(e,0xfff0a0,26);for(let k=0;k<20;k++)spawnParticle(P.x+(Math.random()-.5)*1.4,P.y+Math.random()*2,P.z+(Math.random()-.5)*1.4,0,1,0,0xfff0a0,.8,.18);toast('Miras Segen schützt euch.');};say(e,'Segen über uns!',1.6);return true;}
  return false;}
// Schaden an Abenteurern: Schildwall, Segen, am Boden statt tot
{const h2=hurtEnt;hurtEnt=function(e,n,by){if(e&&e.merc){if(!e.hired||e.down>0)return;n*=(e.wall>0?.4:1)*(blessUntil>time?.7:1);if(e.hp-n<=0){e.hp=0;e.down=35;e.wind=0;e.cast=0;say(e,'Ugh … ich brauche einen Moment …',2.5);toast(`${e.merc.name} ist am Boden!`);return;}e.hp-=n;e.hurt=.2;return;}
  if(e&&e===kreakE&&blessUntil>time)n*=.7;return h2(e,n,by);};}
{const td=takeDamage;takeDamage=function(n){if(blessUntil>time)n*=.7;return td(n);};}
// Gegner zielen nicht auf Abenteurer, die nicht in der Gruppe sind
{const pt=pickTarget;pickTarget=function(e){const t=pt(e);if(t&&t.merc&&(!t.hired||t.down))return'player';return t;};}
// Haupttakt
{const ud2=updateDemons;updateDemons=function(dt){if(mercMesh){const a=mercMesh.geometry.attributes.offset.array;for(let i=0;i<MERCS.length;i++)a[i*3+1]=-999;mercMesh.geometry.attributes.offset.needsUpdate=true;mercMesh.geometry.instanceCount=MERCS.length;}
  ud2(dt);if(state!=='playing'&&state!=='dialog')return;try{updateMShots(dt);updateBurns(dt);mercTick-=dt;if(mercTick<=0){mercTick=1;if(mercMesh)ensureMercs();mercContracts();guildTick();}}catch(e){if(!ud2.err){ud2.err=1;console.error('Gilde',e);}}};}
{const rs=resetStoryRuntime;resetStoryRuntime=function(){rs();mercEnts.length=0;MSHOTS.length=0;blessUntil=0;};}

/* =========================================================
   Gildenaufträge: Questreihen mit Monsterscharen und Minibossen
   ========================================================= */
Object.assign(DT,{
  g_plaguerat:{name:'Pestratte',fac:'demon',h:1.3,hp:110,dmg:9,spd:4,reach:1.3,cd:1,wind:.25,side:1,spr:'rat_',xp:14,aggro:26,rad:.45,tint:.75,loot:[['meat',1,.4]]},
  g_ratking:{name:'Grauzahn, der Rattenkönig',fac:'demon',boss:1,h:2.8,hp:1100,dmg:20,spd:3.8,reach:2.3,cd:1.2,wind:.4,side:1,spr:'rat_',xp:320,rad:1.1,aggro:32,leash:60,tint:.9,loot:[['ruby',1,.6],['silver_ingot',2,1],['fur',3,1]]},
  g_skelwar:{name:'Skelettkrieger',fac:'demon',h:2.5,hp:230,dmg:15,spd:2.7,reach:1.9,cd:1.3,wind:.4,spr:'skel_',xp:32,aggro:26,rad:.5,loot:[['bones',3,.9],['iron_ingot',1,.3]]},
  g_bonelord:{name:'Morrak, der Knochenfürst',fac:'demon',boss:1,h:3.9,hp:1500,dmg:26,spd:2.4,reach:2.7,cd:1.6,wind:.5,spr:'skel_',xp:420,rad:1.1,aggro:32,leash:60,tint:1.1,
    ranged:{min:5,max:22,cd:4,wind:.7,spd:11,dmg:16,orb:'orb_void',n:3,spread:.25,col:0xa0a0ff},loot:[['opal',1,.6],['mythril_ore',2,1],['bones',6,1]]},
  g_alphawolf:{name:'Graumähne, der Leitwolf',fac:'demon',boss:1,h:2.0,hp:950,dmg:22,spd:6.4,reach:2.1,cd:1,wind:.3,side:1,sprF:DT.wolfd.sprF,xp:280,rad:.9,aggro:34,leash:60,tint:.85,loot:[['fur',4,1],['emerald',1,.5],['antler',1,.5]]},
  g_ashmaw:{name:'Aschenschlund, der Höllenrüde',fac:'demon',boss:1,h:2.7,hp:1350,dmg:24,spd:5.6,reach:2.3,cd:1.2,wind:.35,side:1,spr:'hnd_',xp:380,rad:1.1,aggro:34,leash:60,tint:1.25,
    ranged:{min:4,max:16,cd:5,wind:.6,spd:13,dmg:16,orb:'orb_fire',n:5,spread:.13,col:0xff6a20},loot:[['ruby',1,.7],['coal',6,1],['gold_ingot',1,.6]]},
  g_kharz:{name:'Kharz, Hauptmann der Vorhut',fac:'demon',boss:1,h:3.7,hp:2000,dmg:30,spd:2.9,reach:2.9,cd:1.5,wind:.5,spr:'dw_',xp:520,rad:1.2,aggro:34,leash:60,tint:1.15,eyes:DT.warrior.eyes,
    ranged:{min:6,max:20,cd:6,wind:.8,spd:10,dmg:22,orb:'orb_blood',n:1,arc:1,aoe:3,col:0xff2a2a},loot:[['diamond',1,.5],['adamant_ore',2,1],['gold_ingot',2,1]]}});
const GLINES={
  rats:{title:'Die Rattenplage',cool:2,where:'Unter der Ebene wimmelt es. Die Riesenratten kommen aus den Höhlen und fressen die Vorräte der Bauern.',stages:[
    {name:'Eine Schar Riesenratten',spawn:[['nrat',8]],reward:[55,40]},
    {name:'Pestratten',spawn:[['nrat',8],['g_plaguerat',3]],reward:[100,80]},
    {name:'Grauzahn, der Rattenkönig',spawn:[['g_ratking',1],['nrat',4]],reward:[240,220],boss:1,summon:['nrat',2,14]}]},
  bones:{title:'Knochen im Nebel',cool:3,where:'Auf einem alten Schlachtfeld stehen die Toten wieder auf. Jemand oder etwas ruft sie.',stages:[
    {name:'Ein Trupp Skelette',spawn:[['nskel',6]],reward:[70,50]},
    {name:'Skelettkrieger',spawn:[['nskel',6],['g_skelwar',2]],reward:[120,100]},
    {name:'Morrak, der Knochenfürst',spawn:[['g_bonelord',1],['g_skelwar',2]],reward:[300,280],boss:1,summon:['nskel',2,16]}]},
  wolves:{title:'Wolfsnächte',cool:2,where:'Ein Rudel, größer als alle, die wir kennen. Es reißt Schafe bis vor die Tore von Coda.',stages:[
    {name:'Ein hungriges Rudel',spawn:[['wolfd',5]],reward:[60,45]},
    {name:'Das große Rudel',spawn:[['wolfd',9]],reward:[110,90]},
    {name:'Graumähne, der Leitwolf',spawn:[['g_alphawolf',1],['wolfd',4]],reward:[240,220],boss:1,summon:['wolfd',2,18]}]},
  hounds:{title:'Asche und Glut',cool:3,where:'Höllenhunde streifen durch das Land. Wo sie laufen, ist das Gras verbrannt.',stages:[
    {name:'Höllenhunde',spawn:[['hound',4]],reward:[80,60]},
    {name:'Eine Meute Höllenhunde',spawn:[['hound',7]],reward:[130,110]},
    {name:'Aschenschlund, der Höllenrüde',spawn:[['g_ashmaw',1],['hound',2]],reward:[320,300],boss:1,summon:['hound',1,20]}]},
  imps:{title:'Die Vorhut der Tiefe',cool:4,where:'Imps, Dämonenkrieger und ein Hauptmann. Sie erkunden das Land. Wir sollten ihnen zeigen, dass es hier nichts zu holen gibt.',stages:[
    {name:'Ein Impschwarm',spawn:[['imp',8]],reward:[90,70]},
    {name:'Dämonenkrieger',spawn:[['imp',5],['warrior',2]],reward:[150,130]},
    {name:'Kharz, Hauptmann der Vorhut',spawn:[['g_kharz',1],['imp',4]],reward:[400,380],boss:1,summon:['imp',3,18]}],minRank:1}};
const RANKS=['Anwärter','Mitglied','Klinge','Veteran','Held von Coda'];
const guildRank=()=>RANKS[Math.min(RANKS.length-1,GF().rank||0)];
function lineState(k){const G=GF();return G.lines[k]=G.lines[k]||{stage:0,runs:0,cool:0};}
function lineReady(k){const L=lineState(k);return(FLAGS.day||0)>=L.cool&&(GF().rank||0)>=(GLINES[k].minRank||0);}
function guildSpot(){const r=Math.random;for(let t=0;t<300;t++){const a=r()*6.283,d=135+r()*150,x=CODA.x+Math.cos(a)*d,z=CODA.z-60+Math.sin(a)*d*1.3;
    if(!inWorld(x,z)||x>HALF+300||x<-HALF-420||z<ZMIN+40)continue;const g=getHeight(x,z);if(!(g>WATER+.6)||nearWater(x,z))continue;if(Math.hypot(x-CODA.x,z-CODA.z)<130)continue;
    if(Math.hypot(x-FROG.x,z-FROG.z)<FROG.r+70||Math.hypot(x-JVIL.x,z-JVIL.z)<JVIL.r+60)continue;if(typeof inFar==='function'&&inFar(x,z))continue;return[x,z];}return[CODA.x+120,CODA.z-200];}
function guildAccept(k){const G=GF(),L=lineState(k),S=GLINES[k].stages[L.stage],[x,z]=guildSpot();
  G.q={line:k,stage:L.stage,x,z,left:S.spawn.map(([t,n])=>[t,n]),done:false};Snd.pickup();toast('Neuer Gildenauftrag: '+S.name);renderQuests();saveGame();}
function guildLeft(q){return q.left.reduce((a,[,n])=>a+n,0);}
const qSpawned=[];let qSpawnKey='';
function guildDespawn(){for(const e of qSpawned.slice())if(DEM.includes(e)&&!e.dead)removeEnt(e);qSpawned.length=0;qSpawnKey='';}
function guildTick(){const G=GF(),q=G.q;if(!q||q.done){if(qSpawned.length)guildDespawn();return;}const key=q.line+q.stage+q.x;if(qSpawnKey&&qSpawnKey!==key)guildDespawn();
  const d=Math.hypot(P.x-q.x,P.z-q.z);
  if(!qSpawnKey&&d<120&&P.x<IN_X){qSpawnKey=key;const S=GLINES[q.line].stages[q.stage],runs=lineState(q.line).runs,k=1+.2*runs;
    for(const[t,n]of q.left)for(let i=0;i<n;i++){const a=Math.random()*6.283,r=DT[t].boss?0:2+Math.random()*7,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;
      const e=spawnEnt(t,x,z,{gq:1,hp:Math.round(DT[t].hp*k),home:{x:q.x,z:q.z},aggroT:0});if(DT[t].boss&&S.summon)e.summon=S.summon;qSpawned.push(e);}}
  if(qSpawnKey&&d>300){guildDespawn();}
  // Der Boss ruft Verstärkung
  for(const e of qSpawned)if(e.summon&&!e.dead&&e.tgt){e.sumT=(e.sumT==null?e.summon[2]:e.sumT)-1;if(e.sumT<=0){e.sumT=e.summon[2];const n=qSpawned.filter(o=>!o.dead&&!o.d.boss).length;if(n<7){for(let i=0;i<e.summon[1];i++){const a=Math.random()*6.283,x=e.x+Math.cos(a)*3,z=e.z+Math.sin(a)*3;
      const m=spawnEnt(e.summon[0],x,z,{gq:1,adds:1,home:{x:e.x,z:e.z}});qSpawned.push(m);burst(m,0x5a0a0a,14);}if(Math.hypot(P.x-e.x,P.z-e.z)<60)toast(e.d.name.split(',')[0]+' ruft Verstärkung!');}}}
  // Leuchtsäule über dem Ziel
  if(d<420&&d>25)for(let k=0;k<4;k++)spawnParticle(q.x+(Math.random()-.5)*1.5,getHeight(q.x,q.z)+Math.random()*26,q.z+(Math.random()-.5)*1.5,0,2,0,0xffd050,1.4,.5);}
{const k1=killEnt;killEnt=function(e,by){const was=!e.dead;k1(e,by);if(!was||!e.gq)return;const G=GF(),q=G.q;if(!q||q.done)return;if(e.adds)return;
  const L=q.left.find(x=>x[0]===e.type&&x[1]>0);if(L)L[1]--;const n=guildLeft(q);if(n<=0){q.done=true;Snd.pickup();toast('Gildenauftrag erfüllt! Kehre zu Hilde in die Gilde zurück.');for(const o of qSpawned)if(o.adds&&!o.dead)killEnt(o,'ally');}renderQuests();};}
function guildFinish(){const G=GF(),q=G.q,L=lineState(q.line),S=GLINES[q.line].stages[q.stage],k=1+.15*L.runs,money=Math.round(S.reward[0]*k),xp=Math.round(S.reward[1]*k);
  if(!setWallet(wallet()+money))toast('Inventar ist voll');gainXP(xp);G.q=null;let line=`Hier, ${fmtMoney(money)} aus der Gildenkasse.`;
  if(S.boss){L.stage=0;L.runs++;L.cool=(FLAGS.day||0)+GLINES[q.line].cool;G.done=(G.done||0)+1;const nr=Math.min(RANKS.length-1,Math.floor(G.done/2));if(nr>(G.rank||0)){G.rank=nr;line+=` Und du steigst auf: Ab heute bist du ${RANKS[nr]} der Gilde!`;toast('Gildenrang: '+RANKS[nr]);}
    line+=` Die ganze Reihe ist geschafft. In ${GLINES[q.line].cool} Tagen gibt es wieder Arbeit dieser Art, und sie wird härter.`;}else{L.stage++;line+=' Die nächste Stufe wartet schon, wenn du dich bereit fühlst.';}
  Snd.coin();renderQuests();saveGame();return line;}
// ---------- Hilde, die Gildenmeisterin ----------
DIALOGS.Hilde={start:()=>'hello',nodes:{
  hello:()=>{const G=GF(),q=G.q;let text,opts=[];
    if(q&&q.done){text='Das sieht nach getaner Arbeit aus. Erzähl!';opts.push({label:'Der Auftrag ist erledigt.',act:()=>{dlg.hText=guildFinish();return null;},go:'paid'});}
    else if(q){const S=GLINES[q.line].stages[q.stage];text=`Dein Auftrag: ${S.name}. Noch ${guildLeft(q)} übrig. Folge der goldenen Lichtsäule, ${guildDir(q)}.`;opts.push({label:'Ich gebe den Auftrag auf.',go:'abort'});}
    else{text=G.done||G.rank?`Willkommen zurück, ${guildRank()}. Am Brett hängt neue Arbeit.`:'Willkommen in der Abenteurergilde von Coda! Hilde Eisenfaust, Gildenmeisterin. Hier gibt es Arbeit für alle, die mit einer Klinge umgehen können. Und Leute, die dir dabei helfen, gegen Bezahlung.';
      opts.push({label:'Welche Aufträge gibt es?',go:'board'});}
    opts.push({label:'Ich suche Begleiter.',go:'mercs'},{label:'Was ist die Gilde?',go:'about'},{label:'Bis bald.',go:null});return{text,opts};},
  board:()=>{const opts=Object.keys(GLINES).map(k=>{const Lg=GLINES[k],L=lineState(k),ready=lineReady(k),S=Lg.stages[L.stage];
      const lab=ready?`${Lg.title} · Stufe ${L.stage+1}/3: ${S.name}`:(GF().rank||0)<(Lg.minRank||0)?`${Lg.title} · erst ab Rang ${RANKS[Lg.minRank]}`:`${Lg.title} · wieder in ${Math.max(1,L.cool-(FLAGS.day||0))} Tag(en)`;
      return{label:lab,on:ready,act:()=>{dlg.pick=k;return null;},go:'brief'};});
    return{text:`Das Brett. Jede Reihe hat drei Stufen, am Ende wartet ein besonders zäher Brocken. Dein Rang: ${guildRank()}.`,opts:opts.concat([{label:'Zurück',go:'hello'}])};},
  brief:()=>{const k=dlg&&dlg.pick;if(!k)return{text:'',opts:[{label:'Zurück',go:'board'}]};const Lg=GLINES[k],L=lineState(k),S=Lg.stages[L.stage],n=S.spawn.reduce((a,[,c])=>a+c,0),k2=1+.15*L.runs;
    return{text:`${Lg.where} Stufe ${L.stage+1}: ${S.name}. ${S.boss?'Ein Miniboss mit Gefolge. Nimm Begleiter mit!':n+' Gegner.'} Lohn: ${fmtMoney(Math.round(S.reward[0]*k2))}.`+(L.runs?` (Schon ${L.runs}× erledigt, die Biester werden zäher.)`:''),
      opts:[{label:'Ich übernehme das.',act:()=>{guildAccept(k);return null;},go:'took'},{label:'Lieber etwas anderes.',go:'board'}]};},
  took:()=>({text:'Gut. Ich habe dir die Stelle auf der Karte markiert. Du siehst eine goldene Lichtsäule, wenn du in die Nähe kommst. Viel Glück, und komm lebend zurück.',opts:[{label:'Weiter',go:'hello'}]}),
  paid:()=>({text:(dlg&&dlg.hText)||'Gut gemacht.',opts:[{label:'Danke.',go:'hello'}]}),
  abort:()=>({text:'Kein Grund, sich zu schämen. Lieber ein lebender Feigling als ein toter Held. Der Auftrag kommt wieder ans Brett.',opts:[{label:'Ja, ich gebe ihn auf.',act:()=>{GF().q=null;guildDespawn();renderQuests();saveGame();return null;},go:'hello'},{label:'Nein, ich mache weiter.',go:'hello'}]}),
  mercs:()=>{const G=GF(),L=MERCS.map(m=>`${m.name} (${m.role})`+(G.hired[m.name]?' · bei dir':'')).join(', ');
    return{text:`Die Abenteurer sitzen hier im Saal, sprich sie direkt an. Jeder hat seinen Preis und seine eigenen Bedingungen. Mehr als drei Begleiter kann keiner führen, und Kreak oder dein kleiner MiniGHG zählen mit, solange er dir folgt. Gerade bei dir: ${companionList().join(', ')||'niemand'}. Im Saal: ${L}.`,opts:[{label:'Zurück',go:'hello'}]};},
  about:()=>({text:'Die Gilde gibt es, seit die Dämonen wieder unruhig sind. Albrecht kümmert sich um das Dorf, wir um alles, was Zähne hat. Wer Aufträge erledigt, steigt im Rang. Anwärter, Mitglied, Klinge, Veteran, und wer ganz oben steht, ist ein Held von Coda.',opts:[{label:'Zurück',go:'hello'}]})}};
function guildDir(q){const dx=q.x-P.x,dz=q.z-P.z,d=Math.hypot(dx,dz);const a=(Math.atan2(dx,-dz)*180/Math.PI+360)%360,D=['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'][Math.round(a/45)%8];return`etwa ${Math.round(d/10)*10} m Richtung ${D}`;}
// ---------- Anzeige ----------
{const rq1=renderQuests;renderQuests=function(){rq1();const box=document.getElementById('quests');if(!box||state==='menu'||!FLAGS.guild)return;const G=FLAGS.guild,add=[];
  if(G.q){const S=GLINES[G.q.line].stages[G.q.stage],dx=G.q.x-P.x,dz=G.q.z-P.z,a=(Math.atan2(dx,-dz)*180/Math.PI+360)%360,D=['N','NO','O','SO','S','SW','W','NW'][Math.round(a/45)%8];
    add.push(`<div class="q"><b>Gilde: ${S.name}</b><span>${G.q.done?'Erledigt · zurück zu Hilde':`${guildLeft(G.q)} übrig · ${Math.round(Math.hypot(dx,dz))} m ${D}`}</span></div>`);}
  const H=hiredNames();if(H.length)add.push(`<div class="q"><b>Begleiter</b><span>${H.map(n=>`${n} (${fmtLeft(G.hired[n].until-mins())})`).join(', ')}</span></div>`);
  if(!add.length)return;if(box.hidden){box.innerHTML='<h4>Aufgaben</h4>';box.hidden=false;}box.insertAdjacentHTML('beforeend',add.join(''));};}
{let t=0;const u7=updateAnimals;updateAnimals=function(dt){u7(dt);t+=dt;if(t>1){t=0;if(FLAGS.guild&&(FLAGS.guild.q||hiredNames().length))renderQuests();}};}
// Beim Laden: Gegner der Aufträge neu aufstellen
{const sg=startGame;startGame=function(isNew,char){qSpawned.length=0;qSpawnKey='';MSHOTS.length=0;sg(isNew,char);};}
