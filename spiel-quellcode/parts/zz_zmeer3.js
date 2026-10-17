/* =========================================================
   0.0.110 · Das Meer (3/3): Meerestiere und ihr Ökosystem
   - Meer: Sardinen, Doktorfische, Clownfische, Makrelen, Thunfische, Seepferdchen,
     Quallen, Schildkröten, Tintenfische, Kalmare, Delfine, Haie
   - Tiefsee zusätzlich: Wale, Orcas, Riesenkraken, Plesiosaurier und ganz selten der Megalodon
   - Seen: Süßwasserfische
   - Fressen und gefressen werden: Räuber jagen ihre Beute (wie in der Savanne),
     Beute flieht, Schwärme halten zusammen, Wale und Delfine holen an der Oberfläche Luft
   ========================================================= */
// =========================================================
// Bilder (Seitenansicht, Blick nach rechts)
// =========================================================
function seaFish(o,f){const W=o.w,H=o.h,p=new Px(W,H),B=pal(o.body),Be=pal(o.belly||['#d8dcd8','#f0f2ee']),Fn=pal(o.fin||o.body.slice(0,2)),tl=Math.round(W*(o.tl||.2)),cy=H*(o.cy||.52),flap=(f===1?1:-1)*Math.max(1,H*.07);
  const x0=tl,x1=W-1,cx=(x0+x1)/2,rx=(x1-x0)/2,ry=H*(o.ry||.3);
  // Schwanz
  if(o.tail==='fluke')mrPoly(p,[[x0+3,cy-ry*.35],[0,cy-ry*.9+flap],[2,cy+flap*.5],[0,cy+ry*.6+flap],[x0+3,cy+ry*.3]],Fn[0]);
  else if(o.tail==='crescent')mrPoly(p,[[x0+3,cy-ry*.3],[1,cy-H*.45+flap],[x0*.55,cy+flap*.3],[1,cy+H*.4+flap],[x0+3,cy+ry*.3]],Fn[0]);
  else mrPoly(p,[[x0+2,cy-ry*.4],[0,cy-H*.38+flap],[x0*.45,cy+flap*.4],[0,cy+H*.38+flap],[x0+2,cy+ry*.4]],Fn[1]||Fn[0]);
  // Rückenflosse
  if(o.dorsal){const dx=x0+rx*(o.dpos||.9),dh=H*o.dorsal;mrPoly(p,[[dx-rx*.28,cy-ry*.7],[dx+(o.dcurve?-rx*.15:rx*.02),cy-ry-dh],[dx+rx*.22,cy-ry*.75]],Fn[0]);}
  // Körper
  const nose=o.nose||1.6;
  for(let y=0;y<H;y++)for(let x=x0;x<=x1;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry,front=dx>0?Math.pow(Math.abs(dx),nose):dx*dx;if(front+dy*dy>1)continue;
    let c=dy>(o.bl||.25)?Be[dy>.6?0:1]:B[shadeIdx(.62-dy*.45+(hash2(x,y,81)-.5)*.12,B.length,x,y)];if(o.paint){const q=o.paint(x,y,dx,dy,x0,x1,cy,ry);if(q)c=q;}p.set(x,y,c);}
  // Brustflosse
  if(o.pec!==false)mrPoly(p,[[cx+rx*.35,cy+ry*.2],[cx+rx*.05,cy+ry*.2+H*.18+(f===1?1:0)],[cx+rx*.2,cy+ry*.1]],Fn[0]);
  // Auge, Kiemen, Maul
  const ex=Math.round(x1-rx*(o.eyeX||.28)),ey=Math.round(cy-ry*(o.eyeY||.2));p.set(ex,ey,hex('#0c0c10'));if(W>30){p.set(ex-1,ey,hex('#0c0c10'));p.set(ex,ey-1,hex('#f0f0f0'));}
  if(o.gills)for(let k=0;k<o.gills;k++)for(let y=Math.round(cy-ry*.3);y<=Math.round(cy+ry*.3);y++)p.set(ex-4-k*2,y,B[0]);
  if(o.mouth)for(let x=x1-Math.round(rx*o.mouth);x<x1;x++)p.set(x,Math.round(cy+ry*.35),hex('#1a0e0e'));
  if(o.teeth)for(let x=x1-Math.round(rx*o.mouth);x<x1-1;x+=2)p.set(x,Math.round(cy+ry*.35)-1,hex('#f4f0e4'));
  outline(p);return p.done();}
function seaTurtle(f){const p=new Px(28,15),S=pal(['#2a3a18','#3e5422','#566e2e','#72883c']),K=pal(['#5a6a3a','#7a8a50','#9aa868']),a=f===1?2:-1;
  mrPoly(p,[[16,8],[22,12+a],[25,14+a],[18,10]],K[1]);mrPoly(p,[[7,9],[2,12-a],[1,13-a],[9,10]],K[1]);
  mrEll(p,13,7,10,5.2,(x,y,dx,dy)=>dy>.45?K[0]:S[((x>>2)+(y>>2))%2?1:2]);for(let x=5;x<22;x+=4)for(let y=3;y<10;y++)if(hash2(x,y,82)<.5)p.set(x,y,S[0]);
  mrEll(p,24.5,7.5,2.8,2.2,K[2]);p.set(26,7,hex('#101010'));mrPoly(p,[[18,9],[24,13-a],[26,15-a],[20,10]],K[2]);outline(p);return p.done();}
function seaOcto(f,big){const s=big?2.6:1,W=Math.round(26*s),H=Math.round(20*s),p=new Px(W,H),C=pal(big?['#4a0a10','#7a1a1e','#a8322a','#d05a40']:['#6a2a3a','#9a4a52','#c47070','#e8a0a0']);
  for(let t=0;t<(big?10:8);t++){const y0=H*.5+(t-3.5)*s*.9,ph=t*1.3+(f===1?1.2:0);let x=W*.42,y=y0;for(let k=0;k<(big?40:15);k++){const nx=x-s*.9,ny=y+Math.sin(k*.45+ph)*s*.7+(t-3.5)*.12*s;mrLine(p,x,y,nx,ny,Math.max(1,Math.round((big?3.4:1.6)*(1-k/(big?40:15)))),C[k%5===0?3:1]);x=nx;y=ny;}}
  mrEll(p,W*.62,H*.42,W*.3,H*.3,(x,y,dx,dy)=>C[shadeIdx(.65-dy*.35-dx*.15,4,x,y)]);
  const ex=Math.round(W*.68),ey=Math.round(H*.48);mrEll(p,ex,ey,s*1.6,s*1.4,hex(big?'#ffd040':'#f8f0c0'));p.set(ex,ey,hex('#000000'));if(big){p.set(ex+1,ey,hex('#000000'));p.set(ex,ey+1,hex('#000000'));}
  outline(p);return p.done();}
function seaSquid(f){const p=new Px(28,11),C=pal(['#7a4a5a','#b07a84','#e0b0b0','#f8dcd8']),w=f===1?1:0;
  for(let t=0;t<4;t++){let x=9,y=4+t*.9;for(let k=0;k<9;k++){const nx=x-1,ny=y+Math.sin(k*.6+t+w*1.5)*.6;p.set(nx,ny,C[1]);x=nx;y=ny;}}
  mrEll(p,17,5,9,3.2,(x,y,dx,dy)=>C[shadeIdx(.65-dy*.4,4,x,y)]);mrPoly(p,[[22,5],[27,1+w],[27,9-w]],C[2]);p.set(11,4,hex('#101010'));outline(p);return p.done();}
function seaJelly(f){const p=new Px(14,20),C=pal(['#a86aa8','#d098d0','#f0c8f0','#fff0ff']),pu=f===1?1:0;
  mrEll(p,7,6,6-pu*.6,5+pu*.4,(x,y,dx,dy)=>dy>.3?null:C[shadeIdx(.7-dy*.3+(Math.abs(dx)>.7?-.2:0),4,x,y)]);
  for(let x=2;x<13;x++)p.set(x,7,C[0]);for(const tx of[3,5,7,9,11])for(let y=8;y<19;y++)if(hash2(tx,y,83+pu)<.85)p.set(tx+Math.round(Math.sin(y*.6+tx+pu*2)*.6),y,C[(y+tx)%2?1:2]);
  outline(p);return p.done();}
function seaHorse(f){const p=new Px(10,17),C=pal(['#8a5a14','#c08a24','#e8b440','#ffd870']),w=f===1?1:0;
  mrEll(p,5,3,2.2,2,C[2]);mrLine(p,6,3,9,3,1,C[1]);p.set(5,2,hex('#101010'));
  for(let y=4;y<12;y++){const x=4+Math.sin(y*.5)*1.2;mrLine(p,x-1.2,y,x+1.4,y,1,C[shadeIdx(.6-(y-4)/16,4,x,y)]);}p.set(2,7+w,C[3]);p.set(1,8+w,C[3]);
  for(let k=0;k<7;k++){const a=k*.8,x=4+Math.cos(a)*(2.2-k*.25),y=13+Math.sin(a)*(2.2-k*.25);p.set(x,y,C[1]);}outline(p);return p.done();}
function seaPlesio(f){const W=92,H=36,p=new Px(W,H),C=pal(['#1e3a3a','#2e5450','#46706a','#62908a']),Be=pal(['#9ab8a0','#c4dcc4']),a=f===1?3:-2;
  mrPoly(p,[[22,20],[2,18+a*.3],[4,22],[22,24]],C[1]);
  mrPoly(p,[[30,24],[18,32+a],[14,34+a],[34,26]],C[0]);mrPoly(p,[[48,24],[40,33-a],[36,35-a],[52,26]],C[0]);
  mrEll(p,40,20,20,7,(x,y,dx,dy)=>dy>.35?Be[0]:C[shadeIdx(.62-dy*.4,4,x,y)]);
  let x=57,y=17;for(let k=0;k<28;k++){const nx=x+1.1,ny=y-Math.sin(k*.12)*.7+.05;mrLine(p,x,ny-2,x,ny+2-Math.min(2,k*.06),1,(t,o)=>C[2]);x=nx;y=ny;}
  mrEll(p,x+2,y,4,2.6,C[2]);p.set(x+3,y-1,hex('#101010'));for(let k=0;k<4;k++)p.set(x+3-k,y+2,hex('#f0f0e0'));
  outline(p);return p.done();}
const SEA_SPR={
  sardine:f=>seaFish({w:14,h:6,body:['#2a4a6a','#4a7a9a','#8ab4c8'],belly:['#c8dce4','#eef6f8'],tl:.2,ry:.3},f),
  reef:f=>seaFish({w:14,h:11,body:['#1a3a9a','#2a5ad0','#4a8af0'],belly:['#3a6ae0','#4a8af0'],fin:['#f0c020','#ffd840'],tl:.2,ry:.38,nose:1.3,dorsal:.06,paint:(x,y,dx)=>dx<-.75?hex('#f0c020'):null},f),
  clown:f=>seaFish({w:12,h:8,body:['#b84a0a','#e8701a','#ff9a3a'],belly:['#e8701a','#ff9a3a'],fin:['#1a1010','#e8701a'],tl:.22,ry:.36,nose:1.2,paint:(x,y,dx)=>Math.abs(dx-.5)<.12||Math.abs(dx+.15)<.12?hex('#f8f8f0'):null},f),
  mackerel:f=>seaFish({w:18,h:7,body:['#1a3a3a','#2a6a5a','#4a9a7a'],belly:['#d8e4e0','#f4f8f6'],tl:.2,ry:.28,nose:2,paint:(x,y,dx,dy)=>dy<-.1&&((x+y*2)%5===0)?hex('#0a1a1a'):null},f),
  fishl:f=>seaFish({w:14,h:7,body:['#3a4a1a','#5a6a2a','#7a8a3a'],belly:['#c8c8a0','#e8e8c8'],fin:['#c05a20','#e07a30'],tl:.2,ry:.32,dorsal:.1,paint:(x,y,dx,dy)=>dy<.2&&(x%4===0)?hex('#2a3010'):null},f),
  tuna:f=>seaFish({w:26,h:11,body:['#0e1e3a','#1e3a6a','#3a5a8a'],belly:['#c0c8cc','#e8ecee'],fin:['#c8a020','#e8c040'],tail:'crescent',tl:.22,ry:.3,nose:2.2,dorsal:.1,gills:1},f),
  seahorse:seaHorse,jelly:seaJelly,turtle:seaTurtle,octopus:f=>seaOcto(f,false),squid:seaSquid,
  dolphin:f=>seaFish({w:40,h:14,body:['#3e4a56','#5a6874','#7a8894'],belly:['#c8ccd0','#e4e6e8'],tail:'fluke',tl:.16,ry:.28,nose:3,dorsal:.22,dcurve:1,dpos:.95,eyeX:.22,mouth:.15,pec:true},f),
  shark:f=>seaFish({w:48,h:18,body:['#3a4248','#56606a','#76808a'],belly:['#d4d8da','#eef0f0'],tail:'crescent',tl:.2,ry:.26,nose:2.6,dorsal:.32,dpos:.95,gills:4,eyeX:.2,mouth:.16},f),
  orca:f=>seaFish({w:62,h:24,body:['#08080c','#141418','#22222a'],belly:['#e8ecf0','#ffffff'],fin:['#08080c','#141418'],tail:'fluke',tl:.16,ry:.3,nose:1.8,dorsal:.48,dpos:.9,eyeX:.2,bl:.2,
    paint:(x,y,dx,dy)=>(dx>.55&&dx<.78&&dy>-.6&&dy<-.25)?hex('#f4f6f8'):(dx<-.2&&dx>-.45&&dy<-.35&&dy>-.7)?hex('#5a5e66'):null},f),
  whale:f=>seaFish({w:120,h:30,body:['#24324a','#34465e','#4a5e78','#5e7490'],belly:['#8a9aae','#b4c2d0'],tail:'fluke',tl:.14,ry:.33,nose:1.4,dorsal:.06,dpos:.35,eyeX:.18,eyeY:-.1,mouth:.35,
    paint:(x,y,dx,dy)=>dy>.3&&x%3===0?hex('#6a7a90'):(hash2(x,y,84)<.012&&dy<0)?hex('#c8ccd0'):null},f),
  megalodon:f=>seaFish({w:110,h:40,body:['#262c30','#3a4248','#525c64'],belly:['#c0c4c6','#dcdedf'],tail:'crescent',tl:.2,ry:.27,nose:2.2,dorsal:.3,dpos:.95,gills:5,eyeX:.2,mouth:.24,teeth:1,
    paint:(x,y,dx,dy)=>(hash2(x>>1,y,85)<.03&&dy<.2)?hex('#7a8088'):null},f),
  kraken:f=>seaOcto(f,true),plesio:seaPlesio};
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k in SEA_SPR)for(const f of[0,1])list.push(['sea_'+k+'_'+f,SEA_SPR[k](f)]);}catch(e){console.error('Meerestiere: Bilder',e);}};}
// =========================================================
// Arten
// =========================================================
// hab: wo sie leben; d: Tiefe [von, bis]; g: Gruppe; w: Gewicht; eats: Beute; aggr: 2 greift an, 1 nur wenn gereizt
const SEA={
  sardine:{n:'Sardine',len:.32,spd:2.2,fast:5.5,hp:3,hab:['meer','tiefsee'],d:[1,40],g:[8,14],w:2.2,prey:1,drop:[['seafish',1,.5]],xp:.5},
  reef:{n:'Doktorfisch',len:.36,spd:1.4,fast:4,hp:3,hab:['meer'],d:[1,14],g:[3,6],w:2,prey:1,drop:[['seafish',1,.5]],xp:.5,bottom:3},
  clown:{n:'Clownfisch',len:.24,spd:1.2,fast:3.5,hp:2,hab:['meer'],d:[1,10],g:[2,4],w:1.2,prey:1,drop:[['seafish',1,.3]],xp:.5,bottom:1.5},
  mackerel:{n:'Makrele',len:.46,spd:2.6,fast:6,hp:5,hab:['meer','tiefsee'],d:[2,50],g:[5,9],w:1.4,prey:1,drop:[['seafish',1,.7]],xp:1},
  fishl:{n:'Barsch',len:.34,spd:1.5,fast:4,hp:4,hab:['see'],d:[.8,12],g:[2,5],w:4,prey:1,drop:[['perch',1,.6],['trout',1,.2]],xp:.5},
  tuna:{n:'Thunfisch',len:1.6,spd:3.2,fast:7,hp:30,hab:['meer','tiefsee'],d:[4,60],g:[2,4],w:1.2,prey:1,eats:['sardine','mackerel','squid'],drop:[['seafish',3,1]],xp:6},
  seahorse:{n:'Seepferdchen',len:.24,spd:.4,fast:1.2,hp:2,hab:['meer'],d:[1,12],g:[1,3],w:1,prey:1,drop:[],xp:1,bottom:.6,upright:1},
  jelly:{n:'Qualle',len:.6,spd:.35,fast:.6,hp:4,hab:['meer','tiefsee'],d:[1,30],g:[2,5],w:1,prey:1,drift:1,sting:3,drop:[],xp:1,upright:1},
  turtle:{n:'Meeresschildkröte',len:1.25,spd:1.3,fast:2.8,hp:45,hab:['meer'],d:[2,25],g:[1,2],w:1,prey:1,eats:['jelly'],breath:1,drop:[['shell',1,1]],xp:8},
  octopus:{n:'Tintenfisch',len:1.1,spd:.9,fast:4,hp:25,hab:['meer'],d:[3,30],g:[1,1],w:0.8,prey:1,eats:['clown','reef','seahorse'],bottom:.3,ink:1,drop:[['tentacle',2,1]],xp:6},
  squid:{n:'Kalmar',len:1.3,spd:2,fast:6,hp:16,hab:['meer','tiefsee'],d:[8,200],g:[3,6],w:0.9,prey:1,eats:['sardine'],ink:1,drop:[['tentacle',1,1]],xp:4},
  dolphin:{n:'Delfin',len:2.4,spd:4,fast:8.5,hp:90,hab:['meer','tiefsee'],d:[3,40],g:[3,6],w:1.1,prey:1,eats:['sardine','mackerel','squid'],breath:1,jump:1,aggr:0,drop:[['seafish',2,1]],xp:12},
  shark:{n:'Hai',len:3.2,spd:3,fast:7.5,hp:140,hab:['meer','tiefsee'],d:[5,120],g:[1,2],w:1,eats:['tuna','mackerel','turtle','octopus','squid','dolphin'],aggr:2,dmg:13,sense:22,cd:1.4,drop:[['sharktooth',2,1],['seafish',2,.8]],xp:40,max:4},
  orca:{n:'Orca',len:7,spd:4,fast:9,hp:420,hab:['tiefsee'],d:[6,150],g:[2,4],w:0.7,prey:1,eats:['shark','dolphin','turtle','tuna','squid'],breath:1,aggr:1,dmg:22,sense:30,cd:1.6,drop:[['seafish',5,1],['silver',4,.6]],xp:90,max:4},
  whale:{n:'Blauwal',len:18,spd:2,fast:3.5,hp:1500,hab:['tiefsee'],d:[12,200],g:[1,2],w:0.7,prey:1,breath:1,drop:[['seafish',8,1],['silver',10,.6]],xp:140,max:3,big:1},
  kraken:{n:'Riesenkrake',len:11,spd:.8,fast:4,hp:950,hab:['tiefsee'],d:[40,260],g:[1,1],w:0.3,eats:['whale','shark','orca','squid','plesio'],aggr:2,dmg:24,sense:18,cd:2,bottom:1,ink:1,boss:1,drop:[['tentacle',6,1],['pearl',2,.8],['silver',12,1]],xp:320,max:1,big:1},
  plesio:{n:'Plesiosaurus',len:11,spd:3.4,fast:7,hp:780,hab:['tiefsee'],d:[10,200],g:[1,1],w:0.35,eats:['tuna','squid','mackerel','dolphin','turtle'],breath:1,aggr:2,dmg:20,sense:30,cd:1.6,boss:1,drop:[['seafish',6,1],['silver',8,1],['pearl',1,.4]],xp:260,max:2,big:1},
  megalodon:{n:'Megalodon',len:16,spd:3.8,fast:9.5,hp:2200,hab:['tiefsee'],d:[25,260],g:[1,1],w:0.06,eats:['whale','orca','plesio','shark','dolphin','kraken'],aggr:2,dmg:38,sense:45,cd:1.8,boss:1,drop:[['megatooth',1,1],['sharktooth',4,1],['silver',25,1]],xp:650,max:1,big:1}};
for(const k in SEA){const S=SEA[k];S.k=k;S.min=Math.max(.8,S.len*(S.big?.45:.5)+.4);}
// Wer frisst wen? (umgekehrt: Feinde jeder Art)
for(const k in SEA){SEA[k].foes=[];}for(const k in SEA)for(const q of SEA[k].eats||[])if(SEA[q])SEA[q].foes.push(k);
// =========================================================
// Darstellung
// =========================================================
const SEA_N=240,SEAL=[];let seaBBMesh=null,seaBBMat=null;
{const a=initDemons;initDemons=function(at){a(at);try{seaBBMat=bbMaterial(demMat.uniforms.map.value,0,0);EXTRA_BB.push(seaBBMat);const L=[];for(let k=0;k<SEA_N;k++)L.push({x:0,y:-999,z:0,w:.01,h:.01,spr:'sea_sardine_0',tint:1});
  seaBBMesh=makeBillboards(L,seaBBMat);seaBBMesh.geometry.instanceCount=0;seaBBMesh.frustumCulled=false;scene.add(seaBBMesh);}catch(e){console.error('Meerestiere',e);}};}
function seaDraw(){if(!seaBBMesh)return;const g=seaBBMesh.geometry.attributes,cx=camera.position.x,cz=camera.position.z,cy=Math.cos(P.yaw),sy=Math.sin(P.yaw);let n=0;
  for(const c of SEAL){if(n>=SEA_N)break;if(Math.abs(c.x-cx)>170||Math.abs(c.z-cz)>170)continue;const S=c.S,s=SPR['sea_'+S.k+'_'+(c.dead?0:(Math.floor(time*(S.big?1.6:4)+c.ph)%2))];if(!s)continue;
    const w=S.len,h=w*s.h/s.w;let fl=(c.vx*cy-c.vz*sy)<0;if(Math.abs(c.vx*cy-c.vz*sy)<.05)fl=c.fl;c.fl=fl;
    let pitch=S.upright?0:Math.atan2(c.vy,Math.hypot(c.vx,c.vz)+.01);pitch=clamp(pitch,-.7,.7);if(c.dead)pitch=fl?-.4:.4;const rot=fl?-pitch:pitch;
    g.offset.array[n*3]=c.x;g.offset.array[n*3+1]=c.y-h/2-Math.abs(Math.sin(rot))*w*.5;g.offset.array[n*3+2]=c.z;g.size.array[n*2]=w;g.size.array[n*2+1]=h;g.rot.array[n]=rot;
    g.uvr.array[n*4]=fl?s.u+s.du:s.u;g.uvr.array[n*4+1]=s.v;g.uvr.array[n*4+2]=fl?-s.du:s.du;g.uvr.array[n*4+3]=s.dv;g.tint.array[n]=c.hurt>0?-1.3:c.dead?.5:(S.glow||1);n++;}
  seaBBMesh.geometry.instanceCount=n;for(const k of['offset','size','uvr','tint','rot'])g[k].needsUpdate=true;}
// =========================================================
// Erscheinen und Verschwinden
// =========================================================
const SEAT={t:0,ids:0};
function seaHab(x,z){if(x>60000||inCore(x,z))return null;const d=WATER-getHeight(x,z);if(d<.8)return null;return{b:mrBio(x,z),d};}
function seaCount(k){let n=0;for(const c of SEAL)if(c.S.k===k&&!c.dead)n++;return n;}
function seaMake(S,x,y,z,lead){const c={S,x,y,z,vx:0,vy:0,vz:0,hp:S.hp,id:++SEAT.ids,ph:Math.random()*10,lead:lead||null,ox:(Math.random()-.5)*S.len*6,oy:(Math.random()-.5)*S.len*3,oz:(Math.random()-.5)*S.len*6,
  hunger:Math.random()*60,breathT:30+Math.random()*60,wt:0,tx:x,ty:y,tz:z,hurt:0,angry:0,biteT:0,fearT:0};SEAL.push(c);return c;}
function seaSpawn(){if(SEAL.length>=SEA_N-20)return;
  for(let t=0;t<10;t++){const a=Math.random()*6.283,dd=45+Math.random()*80,x=P.x+Math.cos(a)*dd,z=P.z+Math.sin(a)*dd,H=seaHab(x,z);if(!H)continue;
    const pool=[];let tot=0;for(const k in SEA){const S=SEA[k];if(!S.hab.includes(H.b))continue;if(H.d<S.d[0]+S.min||H.d<S.min*1.5)continue;if(S.max&&seaCount(k)>=S.max)continue;if(S.g[1]>=8&&SEAL.length>70)continue;if(S.bottom&&H.d>S.d[1]+10)continue;pool.push(S);tot+=S.w;}
    if(!pool.length)continue;let r=Math.random()*tot,S=pool[0];for(const q of pool){if((r-=q.w)<=0){S=q;break;}}
    const n=S.g[0]+Math.floor(Math.random()*(S.g[1]-S.g[0]+1)),g=WATER-H.d;let lead=null;
    for(let i=0;i<n;i++){const y=S.bottom?g+S.min*.5+Math.random()*Math.min(S.bottom,H.d*.3):clamp(WATER-S.d[0]-Math.random()*(Math.min(S.d[1],H.d)-S.d[0]),g+S.min,WATER-.4);
      const c=seaMake(S,x+(i?(Math.random()-.5)*S.len*5:0),y,z+(i?(Math.random()-.5)*S.len*5:0),lead);if(!lead)lead=c;}
    return;}}
function seaTarget(){if(P.x>60000)return 0;let w=0;for(let k=0;k<6;k++){const a=k*1.047,H=seaHab(P.x+Math.cos(a)*60,P.z+Math.sin(a)*60);if(H)w+=H.b==='tiefsee'?14:H.b==='meer'?12:4;}
  const H0=seaHab(P.x,P.z);if(H0)w+=H0.b==='see'?6:14;return Math.min(110,w);}
function seaTick(dt){SEAT.t-=dt;if(SEAT.t<=0){SEAT.t=1;
    for(let i=SEAL.length-1;i>=0;i--){const c=SEAL[i],d=Math.hypot(c.x-P.x,c.z-P.z);if(d>(c.S.big?280:200)||P.x>60000||(c.dead&&c.deadT>8)){if(c===SEAT.boss)seaBossOff();SEAL.splice(i,1);}}
    const tgt=seaTarget();let near=0;for(const c of SEAL)if(!c.dead&&Math.hypot(c.x-P.x,c.z-P.z)<150)near++;if(near<tgt)seaSpawn();if(near<tgt*.5)seaSpawn();}
  for(const c of SEAL)seaStep(c,dt);seaDraw();}
// =========================================================
// Verhalten
// =========================================================
const seaD=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
function seaPlayerIn(){return SW.on&&P.x<60000;}
const SEA_PL={x:0,y:0,z:0};
function seaBlood(x,y,z,n){for(let k=0;k<n;k++){if(parts.length>=PART_N)parts.shift();parts.push({x:x+(Math.random()-.5),y:y+(Math.random()-.5),z:z+(Math.random()-.5),vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.4,vz:(Math.random()-.5)*.8,col:0x8a1018,life:1.6+Math.random(),t:0,g:-.2});}}
function seaInk(x,y,z,n){for(let k=0;k<n;k++){if(parts.length>=PART_N)parts.shift();parts.push({x:x+(Math.random()-.5)*1.5,y:y+(Math.random()-.5),z:z+(Math.random()-.5)*1.5,vx:(Math.random()-.5),vy:(Math.random()-.5)*.4,vz:(Math.random()-.5),col:0x0a0a12,life:2+Math.random(),t:0,g:0});}}
function seaKill(c,by){if(c.dead)return;c.dead=true;c.deadT=0;c.hp=0;seaBlood(c.x,c.y,c.z,c.S.big?40:6);if(c===SEAT.boss)seaBossOff();
  if(by==='player'){for(const[id,n,p]of c.S.drop||[])if(ITEMS[id]&&Math.random()<p)spawnDrop(id,n,c.x,c.y,c.z);if(c.S.xp)gainXP(c.S.xp);if(c.S.big||c.S.k==='shark')toast(c.S.n+' besiegt!');}
  for(const o of SEAL)if(o.lead===c){o.lead=null;}}
function seaHurt(c,n,by,src){if(c.dead)return;c.hp-=n;c.hurt=.18;if(by==='player'){c.angry=25;c.fearT=6;}else if(src){c.fearT=5;c.threat=src;}if(c.S.ink&&c.hp>0&&Math.random()<.5){seaInk(c.x,c.y,c.z,c.S.big?60:20);c.fearT=6;}
  if(c.hp<=0)seaKill(c,by);}
function seaBossOn(c){if(SEAT.boss===c)return;SEAT.boss=c;try{dmBossShow({d:{name:c.S.n},hp:c.hp,max:c.S.hp,get x(){return c.x},get z(){return c.z}});}catch(e){}}
function seaBossOff(){if(!SEAT.boss)return;SEAT.boss=null;try{dmBossHide();}catch(e){}}
{const a=dmBossTick;dmBossTick=function(){const c=SEAT.boss;if(c&&dmBoss&&!dmBoss.kind){dmBoss.hp=Math.max(0,c.hp);}return a();};}
function seaFind(c,list,R){let best=null,bd=R;for(const o of SEAL){if(o===c||o.dead||!list.includes(o.S.k))continue;const d=seaD(c,o);if(d<bd){bd=d;best=o;}}return best;}
function seaWander(c){const S=c.S,g=getHeight(c.x,c.z);for(let t=0;t<6;t++){const a=Math.random()*6.283,r=6+Math.random()*(S.big?60:25),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r,H=seaHab(x,z);if(!H||H.d<S.min+S.d[0]*.3)continue;
    const gy=WATER-H.d;c.tx=x;c.tz=z;c.ty=S.bottom?gy+S.min*.4+Math.random()*Math.min(S.bottom,H.d*.2):clamp(WATER-S.d[0]-Math.random()*(Math.min(S.d[1],H.d)-S.d[0]),gy+S.min,WATER-.5);c.wt=4+Math.random()*8;return;}
  c.tx=c.x-c.vx*3;c.tz=c.z-c.vz*3;c.ty=c.y;c.wt=2;}
function seaStep(c,dt){const S=c.S;if(c.hurt>0)c.hurt-=dt;if(S.ai&&!c.dead&&S.ai(c,dt))return;
  if(c.dead){c.deadT+=dt;c.vy=-.8;c.vx*=.95;c.vz*=.95;c.y=Math.max(getHeight(c.x,c.z)+.2,c.y+c.vy*dt);return;}
  if(Math.abs(c.x-P.x)>220||Math.abs(c.z-P.z)>220)return;
  c.hunger-=dt;c.biteT-=dt;c.wt-=dt;c.fearT-=dt;c.angry-=dt;c.sT=(c.sT||Math.random()*.5)-dt;
  const pin=seaPlayerIn();SEA_PL.x=P.x;SEA_PL.y=P.y+.9;SEA_PL.z=P.z;const pd=seaD(c,SEA_PL);
  let wx=0,wy=0,wz=0,sp=S.spd,mode='wander';
  // Sinne (nicht in jedem Bild)
  if(c.sT<=0){c.sT=.4+Math.random()*.3;
    if(S.prey||S.foes.length){let th=null,td=S.big?25:14;for(const o of SEAL){if(o.dead||!S.foes.includes(o.S.k)||o.hunger>0&&o.tgt!==c)continue;const d=seaD(c,o);if(d<td){td=d;th=o;}}
      if(pin&&pd<6&&S.len<2&&!S.aggr)th=SEA_PL;if(th){c.threat=th;c.fearT=Math.max(c.fearT,2);}}
    if(S.eats&&!c.tgt&&c.hunger<=0)c.tgt=seaFind(c,S.eats,S.big?55:28);
    if(c.tgt&&(c.tgt.dead||seaD(c,c.tgt)>70||(c.chaseT||0)>30)){c.tgt=null;c.chaseT=0;c.hunger=10;}
    c.ptgt=pin&&S.aggr&&(S.aggr===2||c.angry>0)&&pd<(c.ptgt?S.sense*1.8:S.sense)&&c.hp>S.hp*.15;
    if(S.boss){if(c.ptgt)seaBossOn(c);else if(SEAT.boss===c&&(pd>60||!pin))seaBossOff();}}
  // Flucht
  if(c.fearT>0&&c.threat&&!(c.ptgt)){const t=c.threat,dx=c.x-t.x,dy=c.y-t.y,dz=c.z-t.z,l=Math.hypot(dx,dy,dz)||1;wx=dx/l;wy=dy/l*.4;wz=dz/l;sp=S.fast;mode='flee';
    if(S.ink&&!c.inked&&l<5){c.inked=1;seaInk(c.x,c.y,c.z,25);}}
  // Spieler angreifen
  else if(c.ptgt){const dx=P.x-c.x,dy=SEA_PL.y-c.y,dz=P.z-c.z,l=Math.hypot(dx,dy,dz)||1;wx=dx/l;wy=dy/l;wz=dz/l;sp=S.fast*(l<S.len?.7:1);mode='hunt';
    if(l<S.len*.5+1&&c.biteT<=0){c.biteT=S.cd;if(state==='playing'||state==='dialog'){takeDamage(S.dmg);try{Snd.bite();}catch(e){}seaBlood(P.x,P.y+1,P.z,6);P.vx+=dx/l*-4;P.vz+=dz/l*-4;
      if(S.k==='kraken'){P.vx+=dx/l*-6;toast('Ein Tentakel packt dich!');}}}}
  // Beute jagen
  else if(c.tgt){const t=c.tgt,dx=t.x-c.x,dy=t.y-c.y,dz=t.z-c.z,l=Math.hypot(dx,dy,dz)||1;wx=dx/l;wy=dy/l;wz=dz/l;sp=S.fast;mode='hunt';c.chaseT=(c.chaseT||0)+dt;
    if(l<(S.len+t.S.len)*.45+.3&&c.biteT<=0){c.biteT=S.cd||1.2;const dmg=Math.max(S.dmg||6,S.len*12);seaHurt(t,dmg,'sea',c);t.threat=c;if(t.dead){c.hunger=S.big?150+Math.random()*120:50+Math.random()*80;c.tgt=null;c.chaseT=0;}}}
  // Schwarm
  else if(c.lead&&!c.lead.dead){const L=c.lead,tx=L.x+c.ox,ty=L.y+c.oy,tz=L.z+c.oz,dx=tx-c.x,dy=ty-c.y,dz=tz-c.z,l=Math.hypot(dx,dy,dz);
    if(l>.3){wx=dx/l+L.vx*.2;wy=dy/l*.6;wz=dz/l+L.vz*.2;}sp=Math.min(S.fast,S.spd+l*.6);if(L.fearT>0){c.fearT=L.fearT;c.threat=L.threat;}}
  // Luft holen
  else if(S.breath&&(c.breathT-=dt)<=0){wy=1;wx=c.vx*.3;wz=c.vz*.3;sp=S.spd;mode='air';
    if(c.y>WATER-S.len*.12-.6){c.breathT=40+Math.random()*60;if(S.k==='whale'){for(let k=0;k<30;k++)spawnParticle(c.x+(Math.random()-.5)*.6,WATER+.5,c.z+(Math.random()-.5)*.6,(Math.random()-.5)*1.5,5+Math.random()*4,(Math.random()-.5)*1.5,0xe8f4ff,1.2,.25);}
      if(S.jump&&Math.random()<.6){c.jumpV=6+Math.random()*2;}}}
  // umherschwimmen
  else{if(c.wt<=0||Math.hypot(c.tx-c.x,c.tz-c.z)<2)seaWander(c);const dx=c.tx-c.x,dy=c.ty-c.y,dz=c.tz-c.z,l=Math.hypot(dx,dy,dz)||1;wx=dx/l;wy=dy/l;wz=dz/l;if(S.drift){sp=S.spd;wy+=Math.sin(time*1.5+c.ph)*.5;}}
  // Quallen nesseln
  if(S.sting&&pin&&pd<.9&&c.biteT<=0){c.biteT=2;takeDamage(S.sting);toast('Autsch! Eine Qualle!');}
  // Sprung (Delfine)
  if(c.jumpV){c.vy=c.jumpV;c.jumpV=0;c.jumping=1;}
  if(c.jumping){c.vy-=12*dt;c.x+=c.vx*dt;c.z+=c.vz*dt;c.y+=c.vy*dt;if(c.y<WATER-.3&&c.vy<0){c.jumping=0;for(let k=0;k<14;k++)spawnParticle(c.x,WATER+.05,c.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,0xd8f0ff,.7,.2);}return;}
  // Lenken
  const wl=Math.hypot(wx,wy,wz)||1,k=1-Math.exp(-(S.big?.9:2.6)*dt);c.vx+=(wx/wl*sp-c.vx)*k;c.vy+=(wy/wl*sp*(S.big?.4:.7)-c.vy)*k;c.vz+=(wz/wl*sp-c.vz)*k;
  let nx=c.x+c.vx*dt,nz=c.z+c.vz*dt,ny=c.y+c.vy*dt;let g=getHeight(nx,nz);
  if(WATER-g<S.min||inCore(nx,nz)){c.vx*=-.5;c.vz*=-.5;c.wt=0;c.tgt=mode==='hunt'?c.tgt:null;nx=c.x;nz=c.z;g=getHeight(nx,nz);}
  const top=mode==='air'?WATER-S.len*.08:WATER-(S.big?S.len*.12+.8:.35);ny=clamp(ny,g+S.min*.5,top);
  if(c.jumpV===0&&mode==='air'&&S.jump&&ny>=top-.05&&Math.random()<.02)c.jumpV=6;
  c.x=nx;c.y=ny;c.z=nz;}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{seaTick(dt);}catch(e){if(!seaTick.err){seaTick.err=1;console.error('Meerestiere',e);}}};}
// =========================================================
// Spieler schlägt zu (auch unter Wasser)
// =========================================================
{const a=attack;attack=function(){const t0=P.atkT;a();if(P.atkT===t0||P.x>60000)return;const w=weaponOf(),W=WEAPONS[w]||WEAPONS.fist,L=lookDir(),ey=P.y+P.eye;let best=null,bd=1e9;
  for(const c of SEAL){if(c.dead)continue;const dx=c.x-P.x,dy=c.y-ey,dz=c.z-P.z,d=Math.hypot(dx,dy,dz),reach=W.range+.6+c.S.len*.45;if(d>reach)continue;if(d>.5&&(dx*L.x+dy*L.y+dz*L.z)/d<(c.S.big?.35:.72))continue;if(d<bd){bd=d;best=c;}}
  if(!best)return;let dmg=W.dmg*dmgMult()*swHitK();const h=inv[HOT0+sel];if(h&&h.id==='trident')dmg*=1.6/(swHitK()||1);seaHurt(best,dmg,'player');try{Snd.hit(w);}catch(e){}seaBlood(best.x,best.y,best.z,4);};}
{const a=startGame;startGame=function(isNew,char){SEAL.length=0;seaBossOff();return a(isNew,char);};}
{const a=dangerNear;dangerNear=function(){if(a())return true;for(const c of SEAL)if(!c.dead&&c.ptgt&&Math.hypot(c.x-P.x,c.z-P.z)<40)return true;return false;};}
