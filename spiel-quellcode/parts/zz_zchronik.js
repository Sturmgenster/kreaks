/* =========================================================
   DIE CHRONIK VON KRIESA
   Zwischensequenz beim ersten Betreten von Sturmburg (erst nach Shikayas Gefangennahme).
   Echter Film wie das Duell: Kulissen, Kamerafahrten, Effekte, Erzähler mit Untertiteln.
   Neue Orte: Butzi, Hammerhausen, Festungsstadt Aetherberg, Metropole Creeperia,
   die Ahnengalerie im Schloss, der Thronsaal von Skyroad.
   Neue Figuren: die Götterkönige, Immanuel, Großherzog Altonos, die Generäle
   Sturmgenster, Yin-Yang und Mauley, Plünderer, Schattenarmee, Skyroad-Soldaten,
   Altonarien, Aetherbergisches Kaiserreich, Flugapparate und Kriegsschiffe.
   ========================================================= */
// ---------- Figuren ----------
const CHS={};
const chLook=o=>Object.assign(defaultChar(),o);
function chOver(cv,fn,under){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');if(under)under(x);x.drawImage(cv,0,0);if(fn)fn(x);
  o.headBox=cv.headBox;o.waist=cv.waist;o.legTop=cv.legTop;o.handL=cv.handL;o.handR=cv.handR;return o;}
const chPx=(x,X,Y,c)=>{x.fillStyle=c;x.fillRect(X,Y,1,1);};
function chCrown(col,gem){return cv=>{if(!cv.headBox)return cv;const[h0,h1,t]=cv.headBox;return chOver(cv,x=>{for(let X=h0;X<=h1;X++){chPx(x,X,t-1,col);if((X-h0)%2===0)chPx(x,X,t-2,col);}
  chPx(x,(h0+h1)>>1,t-3,col);chPx(x,(h0+h1)>>1,t-1,gem||'#d83a2a');});};}
function chCape(col,dark){return cv=>{if(!cv.headBox)return cv;const[h0,h1,,b]=cv.headBox,H=cv.height;return chOver(cv,null,x=>{x.fillStyle=col;x.beginPath();x.moveTo(h0-2,b+2);x.lineTo(h1+2,b+2);x.lineTo(h1+6,H-3);x.lineTo(h0-6,H-3);x.fill();
  x.fillStyle=dark||'rgba(0,0,0,.35)';x.fillRect(h0-6,H-5,h1-h0+12,2);});};}
function chHelm(col,crest){return cv=>{if(!cv.headBox)return cv;const[h0,h1,t]=cv.headBox;return chOver(cv,x=>{for(let y=t-1;y<=t+2;y++)for(let X=h0-1;X<=h1+1;X++){if(y===t-1&&(X===h0-1||X===h1+1))continue;chPx(x,X,y,y===t+2?'#3a3c42':col);}
  chPx(x,(h0+h1)>>1,t+3,'#3a3c42');chPx(x,(h0+h1)>>1,t+4,'#3a3c42');if(crest)for(let y=t-4;y<t-1;y++)chPx(x,(h0+h1)>>1,y,crest);});};}
function chBand(col){return cv=>{if(!cv.headBox)return cv;const[h0,h1,t]=cv.headBox;return chOver(cv,x=>{for(let y=t;y<t+3;y++)for(let X=h0-1;X<=h1+1;X++)chPx(x,X,y,y===t+2?'rgba(0,0,0,.3)':col);chPx(x,h1+2,t+2,col);chPx(x,h1+3,t+3,col);});};}
// schmale Augen: das Augenweiß verschwindet, nur der dunkle Strich bleibt
function chSlit(cv){if(!cv.headBox)return cv;const o=chOver(cv),x=o.getContext('2d'),[h0,h1,t,b]=cv.headBox,W=o.width,img=x.getImageData(0,0,W,o.height),d=img.data;
  const skin=[];for(let y=t;y<=b;y++)for(let X=h0;X<=h1;X++){const i=(y*W+X)*4;if(d[i+3]&&d[i]>d[i+2]+30&&d[i]>110)skin.push([d[i],d[i+1],d[i+2]]);}
  const sc=skin.length?skin[skin.length>>1]:[210,160,120];
  for(let y=t;y<=b;y++)for(let X=h0-1;X<=h1+1;X++){const i=(y*W+X)*4;if(d[i+3]&&d[i]>200&&d[i+1]>195&&d[i+2]>180){d[i]=sc[0];d[i+1]=sc[1];d[i+2]=sc[2];}}
  // Lidstrich etwas breiter
  for(let y=t;y<=b;y++)for(let X=h0;X<=h1;X++){const i=(y*W+X)*4;if(d[i+3]&&d[i]<40&&d[i+1]<40&&d[i+2]<40&&y>t+2&&y<b-2){const j=i+4;if(X+1<=h1&&d[j]>100){d[j]=Math.min(d[j],60);d[j+1]=Math.min(d[j+1],40);d[j+2]=Math.min(d[j+2],30);}}}
  x.putImageData(img,0,0);return o;}
// Schattenkrieger: fast schwarz mit violettem Schimmer
function chShadow(cv){const o=chOver(cv),x=o.getContext('2d'),img=x.getImageData(0,0,o.width,o.height),d=img.data;
  for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const l=(d[i]+d[i+1]+d[i+2])/765;d[i]=14+l*40;d[i+1]=8+l*18;d[i+2]=24+l*60;}
  x.putImageData(img,0,0);return o;}
// Hose über die Beine malen (für Figuren mit freiem Oberkörper)
function chPants(col,belt){return cv=>{const o=chOver(cv),x=o.getContext('2d'),W=o.width,H=o.height,img=x.getImageData(0,0,W,H),d=img.data,w0=(cv.waist||30)+1,C=hex(col);
  for(let y=w0;y<H-3;y++)for(let X=0;X<W;X++){const i=(y*W+X)*4;if(!d[i+3])continue;const l=(d[i]+d[i+1]+d[i+2])/765,k=.55+l*.9;d[i]=Math.min(255,C[0]*k);d[i+1]=Math.min(255,C[1]*k);d[i+2]=Math.min(255,C[2]*k);}
  if(belt){const B=hex(belt);for(let X=0;X<W;X++){const i=(w0*W+X)*4;if(d[i+3]){d[i]=B[0];d[i+1]=B[1];d[i+2]=B[2];}}}
  x.putImageData(img,0,0);return o;};}
const chPipe=(cv,fs)=>fs.reduce((c,f)=>f(c),cv);
const CH_LOOKS={
  imru:[{skin:2,hair:'long',hairColor:'blond',beard:'long',cloth:'chain',clothColor:'blue',pants:'grey',eyes:'blue'},[chCape('#1e3a8a'),chCrown('#f0c840','#3a8ce8')]],
  imman:[{skin:2,hair:'short',hairColor:'white',beard:'none',cloth:'robe',clothColor:'cream',pants:'cream',eyes:'gold'},[chCape('#e8d070','#b89030'),chCrown('#ffe070','#3a8ce8')]],
  altonos:[{skin:2,hair:'short',hairColor:'black',beard:'short',cloth:'robe',clothColor:'purple',pants:'black',eyes:'black'},[chCape('#2a1438'),chCrown('#c8ccd4','#8a2ad8')]],
  sturmg:[Object.assign({},KREAK_LOOK,{cloth:'chain',clothColor:'red',pants:'grey',beard:'none',name:''}),[chCape('#8e1c1a')]],
  yinyang:[{skin:2,hair:'wild',hairColor:'black',beard:'none',cloth:'none',pants:'black',eyes:'black'},[chSlit,chPants('#24242c','#c8281e')]],
  mauley:[{race:'mole',skin:1,cloth:'tunic',clothColor:'teal',pants:'brown',eyes:'black'},[]],
  sky0:[{skin:0,hair:'short',hairColor:'brown',cloth:'tunic',clothColor:'blue',pants:'grey'},[chHelm('#c8ccd4','#3a6ad8')]],
  sky1:[{skin:2,hair:'short',hairColor:'blond',beard:'short',cloth:'tunic',clothColor:'blue',pants:'grey'},[chHelm('#c8ccd4','#3a6ad8')]],
  sky2:[{skin:1,hair:'short',hairColor:'black',cloth:'leather',clothColor:'blue',pants:'grey'},[chHelm('#a8aeb8')]],
  pl0:[{skin:3,hair:'mohawk',hairColor:'red',beard:'short',cloth:'rags',clothColor:'red',pants:'black'},[]],
  pl1:[{skin:1,hair:'none',beard:'long',hairColor:'black',cloth:'leather',clothColor:'black',pants:'brown'},[chBand('#a02018')]],
  pl2:[{skin:0,hair:'long',hairColor:'black',cloth:'vest',clothColor:'red',pants:'black'},[chBand('#2a2a2a')]],
  pl3:[{skin:3,hair:'wild',hairColor:'brown',beard:'short',cloth:'rags',clothColor:'brown',pants:'leather'},[]],
  sh0:[{skin:0,hair:'none',cloth:'chain',clothColor:'black',pants:'black'},[chHelm('#3a3a44','#5a2a8a'),chShadow]],
  sh1:[{skin:0,hair:'long',hairColor:'black',cloth:'robe',clothColor:'black',pants:'black'},[chShadow]],
  sh2:[{skin:0,hair:'none',cloth:'leather',clothColor:'black',pants:'black'},[chHelm('#2a2a30'),chShadow]],
  alt0:[{skin:2,hair:'short',hairColor:'black',cloth:'tunic',clothColor:'purple',pants:'black'},[chHelm('#8a8e98','#6a2a9a')]],
  alt1:[{skin:0,hair:'short',hairColor:'brown',beard:'short',cloth:'leather',clothColor:'purple',pants:'black'},[chHelm('#8a8e98','#6a2a9a')]],
  aet0:[{skin:1,hair:'short',hairColor:'brown',cloth:'tunic',clothColor:'red',pants:'ochre'},[chHelm('#d8b040','#f0e0a0')]],
  aet1:[{skin:2,hair:'short',hairColor:'red',beard:'short',cloth:'tunic',clothColor:'red',pants:'ochre'},[chHelm('#d8b040','#f0e0a0')]],
  fish0:[{skin:2,hair:'short',hairColor:'brown',beard:'long',cloth:'tunic',clothColor:'teal',pants:'brown'},[]],
  fish1:[{sex:'f',skin:0,hair:'braid',hairColor:'blond',cloth:'dress',clothColor:'cream',pants:'brown'},[]],
  fish2:[{skin:3,hair:'short',hairColor:'black',cloth:'tunic',clothColor:'ochre',pants:'brown'},[]],
  kreak:[Object.assign({},KREAK_LOOK2,{cloth:'tunic',clothColor:'red',pants:'grey',name:''}),[chCape('#6a1410','#4a0c0a'),chCrown('#f0c840')]],
  smith:[{skin:1,hair:'none',hairColor:'black',beard:'long',cloth:'leather',clothColor:'brown',pants:'black'},[]]};
const CH_POSE=[['0',0,null],['1',1,null],['2',2,null],['u',0,'up','R'],['p',0,'point','R']];
// Die Götterkönige der Ahnengalerie
const CH_KINGS=[
  ['Imru','der Erste',{skin:2,hair:'long',hairColor:'blond',beard:'long',cloth:'chain',clothColor:'blue'},'#1e3a8a','#3a8ce8',[34,46,96]],
  ['Tarmuel','der Baumeister',{skin:0,hair:'short',hairColor:'brown',beard:'short',cloth:'robe',clothColor:'blue'},'#1a3060','#e8b828',[30,40,70]],
  ['Nagus','der Strenge',{skin:1,hair:'none',hairColor:'black',beard:'long',cloth:'chain',clothColor:'grey'},'#3a3a44','#d83a2a',[40,30,36]],
  ['Itramuel','der Weise',{skin:2,hair:'long',hairColor:'grey',beard:'long',cloth:'robe',clothColor:'cream'},'#5a4a2a','#3cc04a',[36,44,40]],
  ['Manus','der Seefahrer',{skin:3,hair:'short',hairColor:'black',beard:'short',cloth:'tunic',clothColor:'teal'},'#123432','#3a8ce8',[24,40,52]],
  ['Imman','der Gerechte',{skin:2,hair:'short',hairColor:'red',beard:'none',cloth:'chain',clothColor:'blue'},'#2a3a66','#e8b828',[44,34,60]],
  ['Immanus','der Kühne',{skin:0,hair:'wild',hairColor:'brown',beard:'short',cloth:'leather',clothColor:'red'},'#4c1416','#e8b828',[50,28,30]],
  ['Manuelus','der Stille',{skin:1,hair:'long',hairColor:'black',beard:'none',cloth:'robe',clothColor:'purple'},'#2a1834','#c8ccd4',[34,26,50]],
  ['Manuel','der Milde',{skin:2,hair:'short',hairColor:'blond',beard:'short',cloth:'robe',clothColor:'blue'},'#1a2440','#f0f0f0',[30,42,66]],
  ['Immanuel','Erbe der Urkraft',{skin:2,hair:'short',hairColor:'white',beard:'none',cloth:'robe',clothColor:'cream'},'#b89030','#3a8ce8',[90,70,30]]];
function chPortrait(K){const[name,,look,capeC,gem,bg]=K,W=46,H=60,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d');
  // Hintergrund mit Lichthof
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const d=Math.hypot(X-W/2,y-H*.38)/(W*.7),n=BAY[(y&3)*4+(X&3)]/16*.12,k=Math.max(0,1-d)*.9+n;
    chPx(x,X,y,`rgb(${bg[0]*(.5+k)|0},${bg[1]*(.5+k)|0},${bg[2]*(.5+k)|0})`);}
  if(name==='Immanuel')for(let i=0;i<14;i++){const a=i/14*6.283;x.strokeStyle='rgba(255,230,140,.35)';x.beginPath();x.moveTo(W/2,H*.36);x.lineTo(W/2+Math.cos(a)*40,H*.36+Math.sin(a)*40);x.stroke();}
  let cv=drawHero(chLook(look),0);cv=chCape(capeC)(cv);cv=chCrown(name==='Immanuel'?'#ffe070':'#f0c840',gem)(cv);
  const[h0,h1,t,b]=cv.headBox,sw=cv.width,crop=Math.min(cv.height,(cv.waist||b+14)+4),sy=Math.max(0,t-5),sc=2;
  x.imageSmoothingEnabled=false;x.drawImage(cv,0,sy,sw,crop-sy,Math.round(W/2-sw*sc/2),8,sw*sc,(crop-sy)*sc);
  // Firnis und Rahmen
  x.fillStyle='rgba(60,30,10,.12)';x.fillRect(0,0,W,H);
  const G=['#5a3a10','#a87a20','#e8c050','#fff0a0'];for(let k=0;k<4;k++){x.fillStyle=G[k===3?2:k];x.fillRect(k,k,W-2*k,1);x.fillRect(k,H-1-k,W-2*k,1);x.fillRect(k,k,1,H-2*k);x.fillRect(W-1-k,k,1,H-2*k);}
  x.fillStyle=G[3];x.fillRect(1,1,W-2,1);x.fillRect(1,1,1,H-2);
  for(const[cx,cy]of[[2,2],[W-3,2],[2,H-3],[W-3,H-3]]){x.fillStyle=G[3];x.fillRect(cx-1,cy-1,3,3);x.fillStyle=G[0];x.fillRect(cx,cy,1,1);}
  return o;}
function chPlate(name,sub){const o=document.createElement('canvas');o.width=128;o.height=36;const x=o.getContext('2d');
  const g=x.createLinearGradient(0,0,0,36);g.addColorStop(0,'#e8c060');g.addColorStop(.5,'#a87a28');g.addColorStop(1,'#6a4410');x.fillStyle=g;x.fillRect(0,0,128,36);
  x.fillStyle='#3a2408';x.fillRect(0,0,128,2);x.fillRect(0,34,128,2);x.fillRect(0,0,2,36);x.fillRect(126,0,2,36);
  x.textAlign='center';x.fillStyle='#2a1604';x.font="bold 15px 'Pixelify Sans',serif";x.fillText(name.toUpperCase(),64,16);x.font="11px 'Pixelify Sans',serif";x.fillText(sub,64,30);return o;}
// Flugapparat (Ornithopter) mit Pilot, zwei Flügelstellungen
function chFlyer(f){const W=48,H=30,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d'),P=(X,Y,c,w=1,h=1)=>{x.fillStyle=c;x.fillRect(X,Y,w,h);};
  // Rumpf
  P(10,16,'#5a3a1c',28,4);P(10,16,'#7a5228',28,1);P(36,14,'#6a4420',6,7);P(8,17,'#3a2410',3,2);P(4,15,'#7a5228',5,1);P(2,12,'#e8dcc0',4,4);P(2,12,'#c8b890',1,4);
  // Propeller
  const pr=f?['#d8d0c0',40,8,2,14]:['#d8d0c0',38,15,8,2];P(42,16,'#3a3a40',2,3);P(pr[1]+3,pr[2],pr[0],pr[3],pr[4]);
  // Pilot
  P(24,11,'#6a4a30',4,5);P(24,8,'#d39d78',4,3);P(23,7,'#3a2a1a',6,2);P(25,9,'#202028',3,1);
  // Flügel
  const wy=f?3:11,wh=f?9:3;for(let i=0;i<20;i++){const X=12+i,top=f?wy+Math.abs(i-10)*.3:wy;P(X,Math.round(top),i%4===0?'#8a6a40':'#efe4c8',1,wh);}
  P(12,f?3:11,'#5a3a1c',20,1);
  // Fahne
  P(8,10,'#3a2410',1,6);P(4,10,'#2a5ac8',4,3);P(4,10,'#e8b830',4,1);return o;}
// Banner an der Stange
const CH_BAN={sky:['#2a4ab0','#1a2a70','#f0c840','sun'],alt:['#5a2a7a','#2a1438','#101010','claw'],aet:['#a82a1e','#6a1410','#f0c840','peak'],pl:['#1a1a1a','#000','#c8281e','skull'],sturm:['#b42a1e','#7a1a14','#f2ece0','eye']};
function chBanner(k,torn){const[c0,c1,c2,em]=CH_BAN[k],W=20,H=64,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d'),P=(X,Y,c,w=1,h=1)=>{x.fillStyle=c;x.fillRect(X,Y,w,h);};
  P(2,0,'#4a3018',2,H);P(2,0,'#7a5a30',1,H);P(1,0,'#e8c050',4,2);
  for(let y=3;y<34;y++)for(let X=4;X<19;X++){if(y>27&&Math.abs(X-11.5)<(y-27)*1.3)continue;if(torn&&X>9+((y*7)%3)&&y>4)continue;if(torn&&X>6&&y>20+((X*5)%4))continue;P(X,y,X===4||X===18?c1:c0);}
  for(let X=4;X<19;X++)P(X,3,c2);const cx=11,cy=14;
  if(em==='sun'){for(let a=0;a<8;a++)P(cx+Math.round(Math.cos(a*.785)*4),cy+Math.round(Math.sin(a*.785)*4),c2);P(cx-2,cy-2,c2,5,5);P(cx-1,cy-1,'#fff0a0',3,3);for(const s of[-1,1])P(cx+s*5-(s<0?3:0),cy,'#e8e8f0',4,2);}
  if(em==='claw'){for(let k=-1;k<=1;k++){for(let y=0;y<9;y++)P(cx+k*3+(y>5?k:0),cy-4+y,c2);}P(cx-4,cy+5,c2,9,2);}
  if(em==='peak'){for(let y=0;y<9;y++)P(cx-y*.7|0,cy-4+y,c2,Math.max(1,y*1.4|0),1);P(cx-1,cy-4,'#fff',2,2);}
  if(em==='skull'){P(cx-3,cy-4,c2,7,6);P(cx-2,cy+2,c2,5,2);P(cx-2,cy-2,'#000',2,2);P(cx+1,cy-2,'#000',2,2);P(cx,cy+2,'#000',1,2);for(let k=0;k<7;k++){P(cx-5+k*1.6|0,cy+5+(k&1),c2,1,1);}}
  if(em==='eye'){P(cx-3,cy-1,c2,7,3);P(cx-1,cy-1,'#2a5ac8',3,3);P(cx,cy,'#1a3a8a',1,1);P(cx-3,cy-2,'#1a1a2a',7,1);P(cx-3,cy+2,'#1a1a2a',7,1);}
  return o;}
function chCrownItem(){const o=document.createElement('canvas');o.width=12;o.height=8;const x=o.getContext('2d'),P=(X,Y,c,w=1,h=1)=>{x.fillStyle=c;x.fillRect(X,Y,w,h);};
  P(1,4,'#a87a20',10,4);P(1,4,'#ffe070',10,1);for(const X of[1,4,7,10])P(X,1,'#e8c050',1,3);P(5,5,'#3a8ce8',2,2);return o;}
function chBuildSprites(list){
  for(const k in CH_LOOKS){const[lk,fx]=CH_LOOKS[k],L=chLook(lk);
    for(const[f,fr,pose,side]of CH_POSE){let cv;try{cv=drawHero(L,fr,false,pose||undefined,side);}catch(e){cv=drawHero(L,fr);}cv=chPipe(cv,fx);
      if(pose==='up')cv=iLongArm(cv);list.push(['ch_'+k+'_'+f,cv]);CHS[k+f]=cv;}
    if(/^(sky|pl|alt|aet|sh)/.test(k)){const b=chPipe(drawHero(L,0,true),fx);list.push(['ch_'+k+'_b',b]);}}
  CH_KINGS.forEach((K,i)=>{CHS['pt'+i]=chPortrait(K);CHS['pl'+i]=chPlate(K[0],i===9?'Gottkönig · Jahr 285':'Götterkönig · '+K[1]);});
  list.push(['ch_fly_0',chFlyer(0)],['ch_fly_1',chFlyer(1)],['ch_crown_0',chCrownItem()]);
  for(const k in CH_BAN){list.push(['ch_ban'+k+'_0',chBanner(k)]);list.push(['ch_ban'+k+'_t',chBanner(k,1)]);}}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{chBuildSprites(list);}catch(e){console.error('Chronik-Figuren',e);}};}
DT.chr={name:'',fac:'prop',h:1.85,hp:1,dmg:0,spd:0,reach:0,cd:9,hero:1,side:1,spr:e=>e.sp,rad:.3};
DT.chp={name:'',fac:'prop',h:1,hp:1,dmg:0,spd:0,reach:0,cd:9,side:1,spr:e=>e.sp,rad:.3};
// Augenleuchten der Schattenkrieger und von Altonos
function chEyes(k){const cv=CHS[k+'0'];if(!cv||!cv.headBox)return null;const[h0,h1,t,b]=cv.headBox,cx=(h0+h1)/2,W=cv.width;return{y:Math.round(t+(b-t)*.5),dx:[Math.round(cx-2)-W/2,Math.round(cx+2)-W/2],c:'v'};}
// =========================================================
// Kulissen: eine Bühne hoch über dem Sturmberg (unsichtbar fürs Spiel)
// =========================================================
const STG={x:0,z:420,y:900};
const CHX={sets:{},grp:null,built:false,ents:[],fires:[],smoke:[],torches:[],anim:[]};
const chY=h=>STG.y+(h||0);
const chB=(lx,lz,rot)=>({x:STG.x+lx,z:STG.z+lz,cos:Math.cos(rot||0),sin:Math.sin(rot||0)});
function chFlush(g){for(const[m,d]of GB){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(d.p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(d.t,2));geo.computeVertexNormals();g.add(new THREE.Mesh(geo,m));}GB.clear();}
const chRnd=mulberry32(4711);const cr=(a,b)=>a+(b-a)*chRnd();
function chTx(W,H,fn){return pxTex(W,H,p=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)p.set(x,y,fn(x,y));});}
const chN=(x,y,s)=>hash2(x,y,s||1);
let CHM=null;
function chMats(){if(CHM)return CHM;const P=a=>pal(a),sh=(pl,k,x,y)=>pl[shadeIdx(k,pl.length,x,y)];
  const GR=P(['#2c4a1e','#3a6026','#4a7630','#5e8c3a','#73a246']),SA=P(['#b89a62','#cdb27a','#dcc48e','#e8d4a2']),MU=P(['#3a2e22','#4a3c2c','#5a4a36','#6a5a40']),WA=P(['#163a52','#1e4c68','#2a6282','#3a7a9c']);
  const WS=P(['#8a8e96','#a8acb4','#c4c8ce','#dcdfe2']),BL=P(['#1a2a5a','#24387a','#30489a','#4a62b4']),GN=P(['#14381c','#1e5028','#2a6a34','#3e8a44']),DK=P(['#1c1a1e','#2a272c','#38343a','#48434a']),RD=P(['#4a0c0c','#6e1414','#8e1c1a','#ab2a22']);
  const tex={
    grass:chTx(32,32,(x,y)=>sh(GR,.5+(chN(x>>1,y>>1,11)-.5)*.5+(vnoise(x*.2,y*.2,12)-.5)*.4,x,y)),
    sand:chTx(32,32,(x,y)=>sh(SA,.55+(chN(x,y,13)-.5)*.35+Math.sin((x+y*.3)*.4)*.08,x,y)),
    mud:chTx(32,32,(x,y)=>chN(x>>1,y>>1,14)<.12?sh(GR,.3,x,y):sh(MU,.5+(chN(x,y,15)-.5)*.5+(vnoise(x*.15,y*.15,16)-.5)*.4,x,y)),
    water:chTx(32,32,(x,y)=>{const w=Math.sin(x*.4+Math.sin(y*.3)*2)+Math.sin(y*.5+x*.1);return w>1.55?hex('#8ab8cc'):sh(WA,.45+w*.12+(chN(x,y,17)-.5)*.15,x,y);}),
    wstone:chTx(32,32,(x,y)=>{const row=y>>3,bx=(x+(row&1)*8)>>4;if(y%8===0||(x+(row&1)*8)%16===0)return WS[0];return sh(WS,.62+(chN(bx,row,18)-.5)*.3+(chN(x,y,19)-.5)*.2,x,y);}),
    dstone:chTx(32,32,(x,y)=>{const row=y>>3,bx=(x+(row&1)*8)>>4;if(y%8===0||(x+(row&1)*8)%16===0)return DK[0];return sh(DK,.6+(chN(bx,row,20)-.5)*.3+(chN(x,y,21)-.5)*.2,x,y);}),
    blue:chTx(16,16,(x,y)=>y%4===0?BL[0]:sh(BL,.6+((x+(y>>2)*2)%4===0?-.3:0)+(chN(x,y,22)-.5)*.2,x,y)),
    green:chTx(16,16,(x,y)=>y%4===0?GN[0]:sh(GN,.6+((x+(y>>2)*2)%4===0?-.3:0)+(chN(x,y,23)-.5)*.2,x,y)),
    red:chTx(16,16,(x,y)=>y%4===0?RD[0]:sh(RD,.6+((x+(y>>2)*2)%4===0?-.3:0)+(chN(x,y,24)-.5)*.2,x,y)),
    gold:chTx(8,8,(x,y)=>hex(['#8a6a1c','#d6b048','#f0d070'][(x+y)%3])),
    glow:chTx(8,8,(x,y)=>hex(chN(x,y,25)<.5?'#ffd27a':'#ffb040')),
    hull:chTx(32,16,(x,y)=>y%4===0?hex('#2a1a0e'):sh(P(['#3a2414','#4e3018','#64401e','#7a5228']),.55+(chN(x>>3,y>>2,26)-.5)*.4,x,y)),
    dhull:chTx(32,16,(x,y)=>y%4===0?hex('#0e0a08'):sh(P(['#1a1210','#261a14','#33241a','#402e20']),.55+(chN(x>>3,y>>2,27)-.5)*.4,x,y)),
    iron:chTx(16,16,(x,y)=>(x%8===0||y%8===0)?hex('#2a2c30'):((x%8===2&&y%8===2)?hex('#9aa0a8'):sh(P(['#3a3e44','#4a4e56','#5a6068']),.5+(chN(x,y,28)-.5)*.3,x,y)))};
  const sail=(base,em)=>{const W=32,H=32;return pxTex(W,H,p=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=hex(base);if(x%8===0)c=c.map(v=>v*.82|0);if(y===0||y===H-1)c=hex('#3a2410');p.set(x,y,c);}
    if(em==='skull'){for(let y=9;y<17;y++)for(let x=11;x<21;x++)p.set(x,y,hex('#e8e0cc'));for(const[x,y]of[[13,12],[14,12],[17,12],[18,12],[13,13],[14,13],[17,13],[18,13],[15,15],[16,15]])p.set(x,y,hex('#1a1a1a'));for(let x=12;x<20;x++)p.set(x,17+(x&1),hex('#e8e0cc'));
      for(let k=0;k<10;k++){p.set(8+k,20+k*.6,hex('#e8e0cc'));p.set(23-k,20+k*.6,hex('#e8e0cc'));}}
    if(em==='sun'){for(let a=0;a<16;a++)p.set(16+Math.cos(a*.39)*7,15+Math.sin(a*.39)*7,hex('#f0c840'));for(let y=11;y<20;y++)for(let x=12;x<21;x++)if(Math.hypot(x-16,y-15)<4.5)p.set(x,y,hex('#f0c840'));}});};
  const M=(t,o)=>mat(t,o),B=(t,o)=>new THREE.MeshBasicMaterial(Object.assign({map:t,side:THREE.DoubleSide},o||{}));
  CHM={tex,grass:M(tex.grass),sand:M(tex.sand),mud:M(tex.mud),water:new THREE.MeshPhongMaterial({map:tex.water,shininess:40,specular:0x223344,side:THREE.DoubleSide}),
    wstone:M(tex.wstone),dstone:M(tex.dstone),blue:M(tex.blue),green:M(tex.green),red:M(tex.red),gold:M(tex.gold),glow:B(tex.glow),hull:M(tex.hull),dhull:M(tex.dhull),iron:M(tex.iron),
    sailR:M(sail('#7a1410','skull')),sailW:M(sail('#e8e0cc','sun')),sailB:M(sail('#2a3a6a','sun')),aether:new THREE.MeshBasicMaterial({color:0x9ae8ff,transparent:true,opacity:.85}),
    black:new THREE.MeshBasicMaterial({color:0x050406})};
  return CHM;}
function chGround(g,m,size,h,cx,cz){const geo=new THREE.PlaneGeometry(size,size,1,1);geo.rotateX(-Math.PI/2);const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*size/4,uv.getY(i)*size/4);
  const me=new THREE.Mesh(geo,m);me.position.set(STG.x+(cx||0),chY(h||0),STG.z+(cz||0));g.add(me);return me;}
function chHouse(lx,lz,w,d,st,rot,wallM,roofM,o){o=o||{};const b=chB(lx,lz,rot),y0=chY(o.y||0),top=y0+3*st,hw=w/2,hd=d/2,rh=o.rh||(2+d*.25);
  boxL(wallM,b,-hw,hw,y0,top,-hd,hd,2,3,'FBLR');gable(roofM,wallM,b,-hw,hw,top,-hd,hd,rh);
  decal(VM.door,b,'F',0,y0,1.1,2.1,hw,hd);for(let s=0;s<st;s++)for(const fx of[-.3,.3]){decal(VM.win,b,'F',fx*w,y0+s*3+(s?0.9:1.1),.9,.9,hw,hd);decal(VM.win,b,'B',fx*w,y0+s*3+1.1,.9,.9,hw,hd);}
  if(o.chim)boxL(VM.stone,b,hw*.4,hw*.4+1,top-1,top+rh+1.6,-.5,.5,1,1);
  return{x:b.x,z:b.z,top:top+rh,cx:STG.x+lx,cz:STG.z+lz,y0};}
function chTower(lx,lz,r,y0,top,roofH,wallM,roofM,sides){const cx=STG.x+lx,cz=STG.z+lz,n=sides||8;y0=chY(y0);top=chY(top);
  for(let i=0;i<n;i++){const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,p0=[Math.cos(a0)*r,Math.sin(a0)*r],p1=[Math.cos(a1)*r,Math.sin(a1)*r],sl=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);
    quad(wallM,[cx+p0[0],y0,cz+p0[1]],[cx+p1[0],y0,cz+p1[1]],[cx+p1[0],top,cz+p1[1]],[cx+p0[0],top,cz+p0[1]],sl/2,(top-y0)/2);
    const R2=r+.5,q0=[Math.cos(a0)*R2,Math.sin(a0)*R2],q1=[Math.cos(a1)*R2,Math.sin(a1)*R2];
    quad(wallM,[cx+q0[0],top,cz+q0[1]],[cx+q1[0],top,cz+q1[1]],[cx+q1[0],top+1.4,cz+q1[1]],[cx+q0[0],top+1.4,cz+q0[1]],sl/2,.7);
    if(roofM)tri(roofM,[cx+q0[0],top+1.4,cz+q0[1]],[cx+q1[0],top+1.4,cz+q1[1]],[cx,top+1.4+roofH,cz],[0,0],[sl/2,0],[sl/4,roofH/2]);}
  return{x:cx,z:cz,top:top+1.4+(roofM?roofH:0)};}
function chWall(x0,z0,x1,z1,y0,h,t,m,merl){const len=Math.hypot(x1-x0,z1-z0),a=Math.atan2(-(z1-z0),x1-x0),b=chB((x0+x1)/2,(z0+z1)/2,a);y0=chY(y0);
  boxL(m,b,-len/2,len/2,y0,y0+h,-t/2,t/2,2,2);if(merl!==false)for(let mx=-len/2+.5;mx<len/2-.5;mx+=2)boxL(m,b,mx,mx+1,y0+h,y0+h+1.1,-t/2,-t/2+.6,1,1);}
function chMound(g,lx,lz,r0,r1,h,m,seg,jit){const geo=new THREE.CylinderGeometry(r1,r0,h,seg||18,4,false);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i);if(y>-h/2+.01&&y<h/2-.01){const k=1+(chN(i,3,31)-.5)*(jit||.18);p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k);}}geo.computeVertexNormals();
  const me=new THREE.Mesh(geo,m);me.position.set(STG.x+lx,chY(h/2),STG.z+lz);g.add(me);return me;}
function chBox(g,m,w,h,d,x,y,z,ry){const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y,z);if(ry)me.rotation.y=ry;g.add(me);return me;}
// Schiffe (Länge entlang x)
function chShip(kind){const M=chMats(),g=new THREE.Group(),raid=kind==='raid',war=kind==='war',hm=raid?M.dhull:M.hull,L=raid?13:16,Wd=raid?3.8:4.6;
  chBox(g,hm,L,2.2,Wd,0,1.1,0);chBox(g,hm,L*.7,1.6,Wd*.8,0,.1,0);
  const bow=new THREE.Mesh(new THREE.CylinderGeometry(0,Wd/2,3.4,4,1),hm);bow.rotation.z=-Math.PI/2;bow.rotation.x=Math.PI/4;bow.scale.set(1,1,.62);bow.position.set(L/2+1.6,1.3,0);g.add(bow);
  chBox(g,hm,3.2,2,Wd*.92,-L/2+1.8,3.1,0);chBox(g,VM.planks,L*.92,.15,Wd*.86,0,2.25,0);
  if(war){chBox(g,M.iron,L*.86,1.3,Wd+.12,0,1.2,0);for(let i=0;i<5;i++)for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(.22,.26,1.5,6),VM.iron);c.rotation.x=Math.PI/2;c.position.set(-L*.35+i*L*.17,1.6,s*(Wd/2+.55));g.add(c);}
    chBox(g,M.iron,1.1,4.5,1.1,-1,4.5,0);}
  const masts=war?[[3.5,9],[-4.5,8]]:raid?[[0,10]]:[[3,10],[-3.5,9]];g.sails=[];
  for(const[mx,mh]of masts){chBox(g,VM.planks,.32,mh,.32,mx,2.2+mh/2,0);chBox(g,VM.planks,.2,.2,Wd*1.5,mx,2.2+mh*.92,0);
    const s=new THREE.Mesh(new THREE.PlaneGeometry(Wd*1.4,mh*.62),raid?M.sailR:war?M.sailB:M.sailW);s.rotation.y=Math.PI/2;s.position.set(mx+.25,2.2+mh*.58,0);g.add(s);g.sails.push(s);}
  // Fahne
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1),raid?M.black:CHM.blue);fl.position.set(masts[0][0]-.8,2.2+masts[0][1]+.4,0);g.add(fl);
  return g;}
// ---------- die einzelnen Orte ----------
function chFar(g,n,r,h,seed){const M=chMats();for(let i=0;i<n;i++){const a=i/n*6.283+chN(i,seed,32)*.4,d=r*(.85+chN(i,seed,33)*.4);chMound(g,Math.cos(a)*d,Math.sin(a)*d,40+chN(i,seed,34)*50,4,h*(.6+chN(i,seed,35)*.7),M.dstone,7,.35);}}
const CH_SETS={
 hill(){const g=new THREE.Group(),M=chMats();chGround(g,M.grass,1600,0);chMound(g,0,0,40,26,5,M.grass,24,.08);
  for(let i=0;i<12;i++){const a=i/12*6.283,b=chB(Math.cos(a)*10,Math.sin(a)*10,-a);boxL(VM.stone,b,-.7,.7,chY(5),chY(5+3.2+(i%3)*.5),-.5,.5,1,1);}
  boxL(VM.stone,chB(0,0),-1.6,1.6,chY(5),chY(5.9),-1,1,1,1);chFlush(g);chFar(g,9,320,90,1);
  return{g,hAt:(x,z)=>{const d=Math.hypot(x,z);return(Math.abs(x)<1.6&&Math.abs(z)<1)?5.9:d<26?5:d<40?5*(40-d)/14:0;}};},
 plain(){const g=new THREE.Group(),M=chMats();chGround(g,M.grass,1600,0);chGround(g,M.sand,1,0.02).scale.set(8,1,240);g.children[g.children.length-1].position.z=STG.z+20;
  const cz=-120;for(const[x0,z0,x1,z1]of[[-40,cz+30,40,cz+30],[40,cz+30,40,cz-40],[40,cz-40,-40,cz-40],[-40,cz-40,-40,cz+30]]){if(z0===z1&&z0===cz+30){chWall(-40,z0,-5,z0,0,10,3,M.wstone);chWall(5,z0,40,z0,0,10,3,M.wstone);}else chWall(x0,z0,x1,z1,0,10,3,M.wstone);}
  for(const[x,z]of[[-40,cz+30],[40,cz+30],[40,cz-40],[-40,cz-40],[-6,cz+30],[6,cz+30]])chTower(x,z,4,0,15,7,M.wstone,M.blue);
  chTower(0,cz-8,9,0,32,13,M.wstone,M.blue);for(const[x,z]of[[-9,cz-17],[9,cz-17],[-9,cz+1],[9,cz+1]])chTower(x,z,3,0,40,9,M.wstone,M.blue);
  for(let i=0;i<10;i++){const x=-32+(i%5)*15,z=cz+18-(i>4?44:0);if(Math.abs(x)<14&&i<5)continue;chHouse(x,z,7,6,2,0,M.wstone,M.blue);}
  chFlush(g);chFar(g,10,330,80,2);return{g,hAt:()=>0,keep:[0,cz-8,47]};},
 coast(){const g=new THREE.Group(),M=chMats(),wat=chGround(g,M.water,1600,0.15,0,-500);g.userData.water=wat;
  const sand=chGround(g,M.sand,1,.6);sand.scale.set(700,1,320);sand.position.z=STG.z+160;
  const geo=new THREE.PlaneGeometry(700,14,1,1);geo.rotateX(-Math.PI/2);const sl=new THREE.Mesh(geo,M.sand);sl.position.set(STG.x,chY(-.1),STG.z-7);sl.rotation.x=-.09;g.add(sl);
  const H=[[-28,24,0.3],[-14,30,-.2],[2,22,.1],[16,28,.25],[30,22,-.1],[-22,44,0],[-4,46,.2],[14,48,-.15],[30,42,.1]];
  const hs=H.map(([x,z,r],i)=>chHouse(x,z,6,5,1,r,i%3?VM.fach:VM.planks,VM.thatch,{y:.6,rh:2.6}));
  for(let k=0;k<8;k++)boxL(VM.planks,chB(8,-1-k*2),-1,1,chY(.4),chY(.7),-1,1,1,1);
  chTower(-40,8,2.6,.6,12,4,VM.stone,VM.tiles);chFlush(g);
  for(const[x,z,r]of[[5,-6,.4],[11,-12,-.3]]){const b=chShip('fish');b.scale.setScalar(.38);b.position.set(STG.x+x,chY(0),STG.z+z);b.rotation.y=r;g.add(b);}
  const fleet=[];for(let i=0;i<7;i++){const s=chShip('raid');s.position.set(STG.x-60+i*20+cr(-4,4),chY(-.3),STG.z-140-cr(0,60));s.rotation.y=Math.PI/2+cr(-.15,.15);g.add(s);fleet.push(s);}
  chFar(g,6,360,70,3);return{g,hAt:(x,z)=>z>0?.6:z>-14?.6+z*.09:-.6,houses:hs,fleet};},
 hammer(){const g=new THREE.Group(),M=chMats();chGround(g,M.mud,1600,0);const hs=[];
  for(let i=0;i<14;i++){const a=i/14*6.283,R=24+(i%3)*9,x=Math.cos(a)*R,z=Math.sin(a)*R-6;hs.push(chHouse(x,z,7,6,1+(i%3===0?1:0),-a+Math.PI/2,VM.stone,VM.slate,{chim:1}));}
  for(const[x,z]of[[-10,10],[10,10]]){const b=chB(x,z);boxL(VM.planks,b,-3,3,chY(0),chY(3.4),-2.5,2.5,2,2,'BLR');boxL(VM.slate,b,-3.4,3.4,chY(3.4),chY(3.7),-2.9,2.9,2,2);boxL(VM.stone,b,-1.2,1.2,chY(0),chY(1),-2,-.8,1,1);}
  const P=chB(0,0);boxL(VM.stone,P,-2.4,2.4,chY(0),chY(2.2),-2.4,2.4,1,1);boxL(VM.planks,P,-.4,.4,chY(2.2),chY(11),-.4,.4,1,1);boxL(CHM.iron,P,-2.8,2.8,chY(11),chY(13.6),-1.6,1.6,1,1);
  chFlush(g);for(const[x,z]of[[-10,8.2],[10,8.2]]){const c=new THREE.Mesh(new THREE.BoxGeometry(2,.3,1),VM.coal);c.position.set(STG.x+x,chY(1.05),STG.z+z);g.add(c);}
  chFar(g,9,300,85,4);return{g,hAt:()=>0,houses:hs,forges:[[-10,1.3,8.2],[10,1.3,8.2]]};},
 aether(){const g=new THREE.Group(),M=chMats();chGround(g,M.grass,1600,0);const cz=-70;chMound(g,0,cz,84,40,40,M.dstone,20,.22);
  const tops=[];const n=12,R=34;for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283;chWall(Math.cos(a0)*R,cz+Math.sin(a0)*R,Math.cos(a1)*R,cz+Math.sin(a1)*R,40,9,2.4,M.wstone);
    tops.push(chTower(Math.cos(a0)*R,cz+Math.sin(a0)*R,3.2,40,55,6,M.wstone,M.red));}
  const k=chTower(0,cz,9,40,80,16,M.wstone,M.red);for(let i=0;i<8;i++){const a=i/8*6.283;chHouse(Math.cos(a)*20,cz+Math.sin(a)*20,6,5,2,-a,M.wstone,M.red,{y:40});}
  chFlush(g);const cry=[];for(const t of tops.filter((_,i)=>i%3===0).concat([k])){const m=new THREE.Mesh(new THREE.OctahedronGeometry(t===k?2.6:1.3,0),M.aether);m.position.set(t.x,t.top+3,t.z);m.userData.y0=t.top+3;g.add(m);cry.push(m);}
  chFar(g,8,330,100,5);return{g,hAt:(x,z)=>{const d=Math.hypot(x,z-cz);return d<40?40:d<84?40*(84-d)/44:0;},cry,keep:k};},
 creep(){const g=new THREE.Group(),M=chMats();chGround(g,M.grass,1600,0);const st=chGround(g,VM.stone,1,.03,0,-110);st.scale.set(150,1,170);const roofs=[];
  for(let gx=-5;gx<=5;gx++)for(let gz=0;gz<12;gz++){const x=gx*12+cr(-1,1),z=-40-gz*12+cr(-1,1);if(Math.hypot(x,z+110)<16)continue;if(Math.abs(gx)<1&&gz<3)continue;
    const s=2+((chN(gx,gz,36)*5)|0)+(Math.hypot(x,z+110)<40?2:0);roofs.push(chHouse(x,z,8,8,s,chN(gx,gz,37)<.5?0:Math.PI/2,chN(gx,gz,38)<.5?M.wstone:VM.fach,chN(gx,gz,39)<.7?M.green:VM.slate,{rh:3}));}
  chWall(-70,-30,-5,-30,0,12,3,M.wstone);chWall(5,-30,70,-30,0,12,3,M.wstone);for(const x of[-70,-35,-6,6,35,70])chTower(x,-30,3.6,0,17,6,M.wstone,M.green);
  for(const[x,z]of[[-30,-80],[30,-80],[-30,-145],[30,-145]])chTower(x,z,4,0,40,10,M.wstone,M.green);chFlush(g);
  const tw=new THREE.Group();chTower(0,-110,8,0,70,22,M.wstone,M.green);chTower(0,-110,4.5,70,92,12,M.wstone,M.green);chFlush(tw);g.add(tw);
  chFar(g,9,340,80,6);return{g,hAt:()=>0,roofs,tower:tw};},
 field(){const g=new THREE.Group(),M=chMats();chGround(g,M.mud,1600,0);chMound(g,0,-40,40,14,6,M.mud,20,.1);
  for(let i=0;i<40;i++){const x=cr(-120,120),z=cr(-160,80);if(Math.abs(x)<30&&z>-70&&z<30)continue;chMound(g,x,z,cr(.8,2.2),.2,cr(.6,1.6),VM.stone,6,.4);}
  for(let i=0;i<10;i++){const x=cr(-90,90),z=cr(-120,60),b=chB(x,z,cr(0,3));if(Math.abs(x)<25&&z>-60)continue;boxL(VM.planks,b,-.2,.2,chY(0),chY(4),-.2,.2,1,1);boxL(VM.planks,b,-1.4,.2,chY(2.6),chY(2.9),-.15,.15,1,1);}
  chFlush(g);chFar(g,10,320,70,7);return{g,hAt:(x,z)=>{const d=Math.hypot(x,z+40);return d<14?6:d<40?6*(40-d)/26:0;}};},
 sea(){const g=new THREE.Group(),M=chMats();const w=chGround(g,M.water,1600,0);g.userData.water=w;chFar(g,7,300,60,8);
  const ships={sky:[],war:[],raid:[]};for(let i=0;i<4;i++){const s=chShip('raid');g.add(s);ships.raid.push(s);}for(let i=0;i<3;i++){const s=chShip('sky');g.add(s);ships.sky.push(s);}for(let i=0;i<3;i++){const s=chShip('war');g.add(s);ships.war.push(s);}
  return{g,hAt:()=>0,ships};},
 gallery(){const g=new THREE.Group(),X0=-30,X1=34,D=9,H=8,L=X1-X0;
  const torchX=[];for(let i=0;i<=9;i++)torchX.push(-26.5+i*5);torchX.push(21.5,28.5);
  const wall=(lit)=>{const W=1024,Hh=128,cv=document.createElement('canvas');cv.width=W;cv.height=Hh;const x=cv.getContext('2d'),im=x.createImageData(W,Hh),d=im.data;
    for(let y=0;y<Hh;y++)for(let X=0;X<W;X++){const row=y>>3,bx=(X+(row&1)*8)>>4;let c;
      if(y>=108){const pl=(X>>5)&1;c=y===108||y===109?[90,60,30]:[(pl?62:56)+chN(X>>1,y,41)*10,38+chN(X,y,42)*6,22];}
      else if(y%8===0||(X+(row&1)*8)%16===0)c=[46,40,40];else{const v=70+chN(bx,row,43)*22+chN(X,y,44)*10;c=[v,v*.92,v*.86];}
      let L2=.55;if(lit)for(const tx of torchX){const px=(tx-X0)*16,dd=Math.hypot(X-px,(y-58)*1.3);if(dd<70)L2+=(1-dd/70)*.9;}
      L2=Math.min(1.5,L2);const i=(y*W+X)*4;d[i]=Math.min(255,c[0]*L2*1.1);d[i+1]=Math.min(255,c[1]*L2*.98);d[i+2]=Math.min(255,c[2]*L2*.8);d[i+3]=255;}
    x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;return t;};
  const B=(t,o)=>new THREE.MeshBasicMaterial(Object.assign({map:t,fog:false,side:THREE.DoubleSide},o||{}));
  const pl=(w,h,m,x,y,z,ry,rx)=>{const me=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);me.position.set(STG.x+x,chY(y),STG.z+z);if(ry)me.rotation.y=ry;if(rx)me.rotation.x=rx;g.add(me);return me;};
  const wt=wall(true),wd=wall(false);pl(L,H,B(wt),(X0+X1)/2,H/2,0);pl(L,H,B(wd,{color:0x8a8078}),(X0+X1)/2,H/2,D,Math.PI);pl(D,H,B(wd,{color:0x8a8078}),X0,H/2,D/2,Math.PI/2);pl(D,H,B(wd,{color:0x8a8078}),X1,H/2,D/2,-Math.PI/2);
  const fl=document.createElement('canvas');fl.width=512;fl.height=72;{const x=fl.getContext('2d');for(let y=0;y<72;y++)for(let X=0;X<512;X++){const tile=((X>>3)+(y>>3))&1,car=y>22&&y<50;
    x.fillStyle=car?(y===23||y===49||y===26||y===46?'#c8a040':`rgb(${118+chN(X>>1,y>>1,45)*18|0},20,24)`):tile?'#3a3434':'#4a4442';x.fillRect(X,y,1,1);}}
  const ft=new THREE.CanvasTexture(fl);ft.magFilter=THREE.NearestFilter;pl(L,D,B(ft,{color:0xb0a090}),(X0+X1)/2,0,D/2,0,-Math.PI/2);
  const cl=document.createElement('canvas');cl.width=256;cl.height=36;{const x=cl.getContext('2d');x.fillStyle='#1a120c';x.fillRect(0,0,256,36);x.fillStyle='#3a2414';for(let X=0;X<256;X+=16)x.fillRect(X,0,5,36);}
  const ct=new THREE.CanvasTexture(cl);ct.magFilter=THREE.NearestFilter;pl(L,D,B(ct),(X0+X1)/2,H,D/2,0,Math.PI/2);
  const pics=[];CH_KINGS.forEach((K,i)=>{const big=i===9,x=big?25:-24+i*5,w=big?4.4:3.2,h=big?5.8:4.2,y=big?4.4:3.6;
    const tp=new THREE.CanvasTexture(CHS['pt'+i]);tp.magFilter=THREE.NearestFilter;tp.minFilter=THREE.NearestFilter;tp.generateMipmaps=false;const m=pl(w,h,B(tp),x,y,.06);
    const tl=new THREE.CanvasTexture(CHS['pl'+i]);tl.minFilter=THREE.LinearFilter;pl(1.8,.5,B(tl),x,big?1.05:1.0,.06);pics.push({x,y,w,h,m});});
  const rib=document.createElement('canvas');rib.width=32;rib.height=32;{const x=rib.getContext('2d');x.fillStyle='#0a0a0c';x.beginPath();x.moveTo(14,0);x.lineTo(32,0);x.lineTo(32,18);x.lineTo(0,32);x.lineTo(0,26);x.closePath();x.fill();x.fillStyle='#24242a';x.fillRect(20,2,4,4);}
  const rt=new THREE.CanvasTexture(rib);rt.magFilter=THREE.NearestFilter;const ribbon=pl(2.2,2.2,B(rt,{transparent:true,opacity:0,alphaTest:.05}),25+1.3,4.4+2.0,.1);
  for(const tx of torchX){const b=new THREE.Mesh(new THREE.BoxGeometry(.25,.5,.35),new THREE.MeshBasicMaterial({color:0x2a2a30,fog:false}));b.position.set(STG.x+tx,chY(4),STG.z+.2);g.add(b);}
  return{g,hAt:()=>0,torchX,pics,ribbon,interior:true};},
 throne(){const g=new THREE.Group(),M=chMats(),B=(t,o)=>new THREE.MeshBasicMaterial(Object.assign({map:t,fog:false,side:THREE.DoubleSide},o||{}));
  const pl=(w,h,m,x,y,z,ry,rx)=>{const me=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);me.position.set(STG.x+x,chY(y),STG.z+z);if(ry)me.rotation.y=ry;if(rx)me.rotation.x=rx;g.add(me);return me;};
  const wcv=document.createElement('canvas');wcv.width=256;wcv.height=96;{const x=wcv.getContext('2d'),im=x.createImageData(256,96),d=im.data;for(let y=0;y<96;y++)for(let X=0;X<256;X++){const row=y>>3,bx=(X+(row&1)*8)>>4;let v=(y%8===0||(X+(row&1)*8)%16===0)?60:96+chN(bx,row,51)*30+chN(X,y,52)*10;
      const win=(X%64>26&&X%64<38&&y>18&&y<62);const i=(y*256+X)*4;if(win){const k=y<24?.7:1;d[i]=150*k;d[i+1]=190*k;d[i+2]=230*k;}else{d[i]=v*.95;d[i+1]=v*.92;d[i+2]=v*.88;}d[i+3]=255;}x.putImageData(im,0,0);
    for(let k=0;k<4;k++){const bx=k*64+6;x.fillStyle='#24387a';x.fillRect(bx,10,14,46);x.fillStyle='#f0c840';x.fillRect(bx,10,14,2);x.beginPath();x.arc(bx+7,28,4,0,7);x.fill();x.fillStyle='#24387a';x.beginPath();x.moveTo(bx,56);x.lineTo(bx+7,50);x.lineTo(bx+14,56);x.fill();}}
  const wtx=new THREE.CanvasTexture(wcv);wtx.magFilter=THREE.NearestFilter;wtx.wrapS=THREE.RepeatWrapping;
  const sideM=B(wtx);const W2=10,Z0=-26,Z1=6,H=12;pl(Z1-Z0,H,sideM,-W2,H/2,(Z0+Z1)/2,Math.PI/2);pl(Z1-Z0,H,sideM,W2,H/2,(Z0+Z1)/2,-Math.PI/2);
  pl(2*W2,H,B(wtx,{color:0xb0a8a0}),0,H/2,Z0);pl(2*W2,H,B(wtx,{color:0x807870}),0,H/2,Z1,Math.PI);
  const fcv=document.createElement('canvas');fcv.width=40;fcv.height=64;{const x=fcv.getContext('2d');for(let y=0;y<64;y++)for(let X=0;X<40;X++){const car=X>=14&&X<26;x.fillStyle=car?((X===14||X===25)?'#d0a840':'#8a1c22'):(((X>>2)+(y>>2))&1?'#d8d4cc':'#3a3a44');x.fillRect(X,y,1,1);}}
  const ftx=new THREE.CanvasTexture(fcv);ftx.magFilter=THREE.NearestFilter;pl(2*W2,Z1-Z0,B(ftx,{color:0xc8c0b8}),0,0,(Z0+Z1)/2,0,-Math.PI/2);pl(2*W2,Z1-Z0,new THREE.MeshBasicMaterial({color:0x1a140e,fog:false,side:THREE.DoubleSide}),0,H,(Z0+Z1)/2,0,Math.PI/2);
  for(let z=-20;z<=2;z+=6)for(const s of[-1,1])boxL(M.wstone,chB(s*6,z),-.8,.8,chY(0),chY(H),-.8,.8,1,2);
  const t=chB(0,-21);boxL(M.wstone,t,-5,5,chY(0),chY(.6),-3,3,2,1);boxL(M.wstone,t,-3.5,3.5,chY(.6),chY(1.2),-2.4,2.4,2,1);boxL(CHM.gold,t,-1.3,1.3,chY(1.2),chY(1.9),-.9,.9,1,1);boxL(CHM.blue,t,-1.3,1.3,chY(1.9),chY(5.2),-1.2,-.8,1,1);boxL(CHM.gold,t,-1.5,1.5,chY(5.2),chY(5.7),-1.25,-.75,1,1);
  chFlush(g);return{g,hAt:(x,z)=>(Math.abs(x)<3.5&&z<-18.6&&z>-23.4)?1.2:(Math.abs(x)<5&&z<-18&&z>-24)?.6:0,interior:true,torches:[[-5,4,-14],[5,4,-14],[-5,4,-2],[5,4,-2]]};}};
function chBuild(){if(CHX.built)return;CHX.built=true;chMats();const root=new THREE.Group();root.visible=false;scene.add(root);CHX.grp=root;
  for(const k in CH_SETS){try{const S=CH_SETS[k]();S.g.visible=false;root.add(S.g);CHX.sets[k]=S;}catch(e){console.error('Chronik-Kulisse',k,e);}}}
function chDispose(){if(!CHX.grp)return;scene.remove(CHX.grp);CHX.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});CHX.grp=null;CHX.sets={};CHX.built=false;}
function chShow(k){CHX.cur=k;if(CHX.grp)CHX.grp.visible=!!k;for(const n in CHX.sets)CHX.sets[n].g.visible=n===k;}
const chH=(lx,lz)=>{const S=CHX.sets[CHX.cur];return S&&S.hAt?S.hAt(lx,lz):0;};
// =========================================================
// Film
// =========================================================
const CH_SUBS=[[0,2.95,'Die Geburt des großen Götterkönig Imru,'],[2.95,7.6,'der das gesamte Land eroberte und unter dem mächtigen Königreich Skyroad vereinte,'],[7.6,10.6,'war ein Wendepunkt für den Kontinenten Kriesa.'],
  [10.8,15.7,'Ihm folgten die Götterkönige Tarmuel, Nagus, Itramuel, Manus,'],[15.7,20.45,'Imman, Immanus, Manuelus und Manuel als Herrscher nach,'],[20.5,26.5,'bis schließlich im Jahr 285 mit Gottkönig Immanuel ein Regent geboren wurde,'],[26.5,29.6,'der die Urkraft des ersten Gottkönig in sich trug.'],
  [30.7,32.3,'Doch die goldenen Jahre endeten,'],[32.3,37.3,'als im Jahr 301 eine feindliche Invasionsflotte an den Küsten landete'],[37.35,39.9,'und der große Plündererkrieg ausbrach.'],
  [40.3,42.75,'Was mit der Zerstörung kleinerer Dörfer begann,'],[42.75,45.3,'wuchs zu einem Kontinentalkrieg heran.'],
  [45.4,51.6,'Schlüsselorte wie Butzi, Hammerhausen, die Festungsstadt Aetherberg'],[51.6,55.35,'und die Metropole Creeperia wurden zu Schauplätzen erbitterter Schlachten'],[55.35,60.3,'zu Lande und zu See, bei denen neuartige Flugapparate und umgerüstete Kriegsschiffe zum Einsatz kamen.'],
  [60.55,65.7,'In diesen wirren Zeiten stiegen die Generäle Sturmgenster, Yin-Yang und Mauley auf'],[65.75,68.4,'und gründeten die Bastion Sturmburg.'],
  [68.75,73.1,'Der Krieg erreichte im Jahr 322 seinen tragischen Höhepunkt.'],[73.65,76.6,'Durch den finsteren Verrat des Großherzog Altonos'],[76.6,80.6,'und das Auftauchen der Schattenarmee versank das Land im Chaos.'],
  [81.1,85.8,'In einer letzten, verzweifelten Schlacht opferte sich Gottkönig Immanuel selbst,'],[85.8,88.3,'um Kriesa vor dem Untergang zu bewahren.'],
  [88.7,91.8,'Sein Tod besiegelte das Ende der alten Dynastie,'],[92,94.5,'führte zum blutigen Fall von Creeperia'],[94.5,99.3,'und spaltete das einst unbesiegbare Skyroad in verfeindete Fraktionen'],[99.3,102.6,'wie Altonarien und das Aetherbergische Kaiserreich.'],
  [103.3,106.6,'Nun, 100 Jahre nach dem Fall des Gottkönigs,'],[106.6,109.7,'ist ein würdiger Nachfolger in das Land zurückgekehrt.'],[110.05,113.8,'Ein Mann, dessen Gier nach Rache kaum größer sein könnte.'],[114.2,117.6,'KREAK, wahrer Kaiser von Sturmburg.']];
const sfx=f=>{try{f();}catch(e){}};
const cK=(a,b,lt)=>Math.max(0,Math.min(1,(lt-a)/(b-a)));
function chCam(F,lx,ly,lz,tx,ty,tz,fov,roll){F.cam(STG.x+lx,chY(ly+chH(lx,lz)),STG.z+lz,STG.x+tx,chY(ty+chH(tx,tz)),STG.z+tz,fov,roll);}
function chHead(e){const s=SPR[sprOf(e,e.frame)],hb=s&&s.c&&s.c.headBox;if(!hb)return e.y+e.h*.8;return e.y+e.h*(1-((hb[2]+hb[3])/2)/s.h);}
function chClose(F,e,ox,oy,oz,fov){const hy=chHead(e);F.cam(e.x+ox,hy+oy,e.z+oz,e.x,hy,e.z,fov);}
function cE(sp,lx,lz,o){o=o||{};const prop=!!o.prop,e=spawnEnt(prop?'chp':'chr',STG.x+lx,STG.z+lz,{always:true,noHostile:true,chr:1,sp,scale:(o.h||1.85)/(prop?1:1.85)});
  e.special=()=>true;e.lx=lx;e.lz=lz;e.bx=lx;e.bz=lz;e.ph=Math.random()*6;e.frame=o.f||'0';e.dy=o.dy||0;e.y=chY(chH(lx,lz)+e.dy);if(o.eyes)e.d=Object.assign({},e.d,{eyes:o.eyes});if(o.flip)e.flip=true;if(o.hid)e.hidden=true;CHX.ents.push(e);return e;}
function cRE(sp,x,z,o){o=o||{};const e=spawnEnt(o.type||'chr',x,z,Object.assign({always:true,noHostile:true,chr:1,sp,scale:o.type==='chp'?(o.h||1):(o.h||1.85)/1.85},o.ex||{}));e.special=()=>true;e.frame=o.f||'0';e.y=fgy(x,z)+(o.dy||0);if(o.flip)e.flip=true;CHX.ents.push(e);return e;}
function cMv(e,lx,lz,f,dy){e.lx=lx;e.lz=lz;e.x=STG.x+lx;e.z=STG.z+lz;if(dy!=null)e.dy=dy;e.y=chY(chH(lx,lz)+(e.dy||0));if(f!=null)e.frame=f;}
const cWalk=(e,t,sp)=>(Math.floor(t*(sp||7)+e.ph)%2)?'1':'2';
function cArmy(keys,cols,rows,x0,z0,dx,dz,o){o=o||{};const L=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const k=keys[(r*cols+c)%keys.length],x=x0+c*dx+(o.jit?cr(-o.jit,o.jit):0)+(r%2)*dx*.5*(o.stag?1:0),z=z0+r*dz+(o.jit?cr(-o.jit,o.jit):0);
  const e=cE(k.startsWith('ch_')?k:'ch_'+k+'_',x,z,{h:o.h||1.85,flip:o.flip,eyes:o.eyes&&o.eyes(k)});e.row=r;e.col=c;L.push(e);}return L;}
function chFireAt(x,y,z,s){CHX.fires.push({x,y,z,s:s||1});}
function chSmokeAt(x,y,z,s){CHX.smoke.push({x,y,z,s:s||1});}
function chFxTick(dt){for(const f of CHX.fires)if(Math.random()<dt*14*f.s){fxP(f.x+rnd(-1.2,1.2)*f.s,f.y+rnd(0,.8),f.z+rnd(-1.2,1.2)*f.s,rnd(-.4,.4),rnd(2,4.5)*f.s,rnd(-.4,.4),[0xff6a10,0xffb030,0xffe080],1,.9*f.s,{s1:.3});
    if(Math.random()<.35)fxP(f.x,f.y+2*f.s,f.z,rnd(-.5,.5),rnd(1.5,3),rnd(-.5,.5),0x2a2026,2.6,1.6*f.s,{add:false,s1:3.5*f.s,a:.5});}
  for(const f of CHX.smoke)if(Math.random()<dt*6*f.s)fxP(f.x+rnd(-.6,.6),f.y,f.z+rnd(-.6,.6),rnd(-.3,.6),rnd(1.2,2.4),rnd(-.3,.3),[0x6a6a70,0x55555c,0x3a3a40],3.5,1.4*f.s,{add:false,s1:4*f.s,a:.45});}
function chTorchTick(dt){const S=CHX.sets.gallery;if(!S||CHX.cur!=='gallery')return;S.torchX.forEach((tx,i)=>{if(CHX.torchOff&&CHX.torchOff[i])return;if(Math.random()<dt*22)fxP(STG.x+tx+rnd(-.08,.08),chY(4.38),STG.z+.32,rnd(-.1,.1),rnd(.6,1.2),0,[0xff8a20,0xffc040,0xfff0a0],.45,.32,{s1:.08});});}
function chTag(t,sub,dur){let el=$('chTag');if(!el){el=document.createElement('div');el.id='chTag';$('film').appendChild(el);const st=document.createElement('style');
  st.textContent="#chTag{position:absolute;left:5vw;top:14vh;font-family:'Pixelify Sans','Silkscreen',sans-serif;color:#f6e2a8;text-shadow:0 0 10px rgba(0,0,0,.9),2px 2px 0 #1a0e04;opacity:0;transition:opacity .5s,transform .5s;transform:translateX(-12px)}#chTag b{display:block;font-size:min(4.6vw,40px);letter-spacing:.08em}#chTag i{display:block;font-style:normal;font-size:min(2vw,17px);color:#e0d0b0;margin-top:2px}#chTag.on{opacity:1;transform:none}";document.head.appendChild(st);}
  el.innerHTML='<b>'+esc(t)+'</b>'+(sub?'<i>'+esc(sub)+'</i>':'');el.classList.add('on');CHX.tagT=dur||2.4;}
function chSubDom(){if($('filmSub'))return;const s=document.createElement('div');s.id='filmSub';$('film').appendChild(s);const st=document.createElement('style');
  st.textContent="#filmSub{position:absolute;left:50%;bottom:2.4vh;transform:translateX(-50%);width:min(880px,92vw);text-align:center;color:#f2e6c8;font-family:var(--f-title,serif);font-size:clamp(15px,2.3vw,24px);line-height:1.3;text-shadow:0 2px 0 #000,0 0 8px #000;transition:opacity .4s;opacity:0}";document.head.appendChild(st);}
function chClear(){for(const e of CHX.ents)removeEnt(e);CHX.ents=[];CHX.fires=[];CHX.smoke=[];CHX.fog=null;}
// Kamerapfad durch die Ahnengalerie
const GAL_K=[[10.8,-27],[12.15,-24],[12.75,-19],[13.45,-14],[14.25,-9],[15.1,-4],[15.95,1],[16.6,6],[17.5,11],[18.45,16],[20.4,18.4],[23.1,25]];
function galX(t){if(t<=GAL_K[0][0])return GAL_K[0][1];for(let i=0;i<GAL_K.length-1;i++){const[a,x0]=GAL_K[i],[b,x1]=GAL_K[i+1];if(t<=b){const k=fEase((t-a)/(b-a));return x0+(x1-x0)*k;}}return GAL_K[GAL_K.length-1][1];}
function chGlowRise(x,y,z,n,r,cols,h){for(let i=0;i<n;i++){const a=Math.random()*6.283,rr=Math.random()*r;fxP(x+Math.cos(a)*rr,y+Math.random()*(h||1),z+Math.sin(a)*rr,0,rnd(2,6),0,cols||[0xfff0a0,0xffd040,0xffffff],1.2,rnd(.2,.6),{s1:.05});}}
function chShipBob(s,t,base){s.position.y=chY(base||0)+Math.sin(t*1.3+s.position.x)*.18;s.rotation.z=Math.sin(t*.9+s.position.x)*.03;}
function cFly(lx,ly,lz){const e=cE('ch_fly_',lx,lz,{prop:1,h:2.6});e.dy=ly;e.y=chY(ly);return e;}
const CHS_K=k=>'ch_'+k+'_';
const SHE=k=>chEyes(k.replace(/^ch_|_$/g,''));
const CHGOLD=[0xfff0a0,0xffd040,0xffffff,0xffc030];
const CSC=[
 // 0 Die Geburt Imrus: ein goldener Stern fällt in den Steinkreis
 {t0:0,t1:2.95,set:'hill',clock:23*60+30,fog:[70,460],setup(F){F.im=cE('ch_imru_',0,0,{hid:1,f:'u'});F.hit=0;},
  upd(F,lt,dt){const k=fEase(Math.min(1,lt/1.3)),sx=-90*(1-k),sy=140*(1-k)+6.5,sz=-220*(1-k);
   if(lt<1.3){for(let i=0;i<5;i++)fxP(STG.x+sx+rnd(-.5,.5),chY(sy)+rnd(-.5,.5),STG.z+sz+rnd(-.5,.5),rnd(-.3,.3),rnd(-.3,.3),rnd(-.3,.3),CHGOLD,1.1,rnd(.8,1.8),{s1:.1});fxP(STG.x+sx,chY(sy),STG.z+sz,0,0,0,0xffffff,.2,5,{s1:4});}
   else{if(!F.hit){F.hit=1;F.flash(.9,'#fff3c0');F.shake=.7;sfx(()=>Snd.boom(.3));sfx(()=>Snd.chime());fxBurst(STG.x,chY(6.5),STG.z,160,CHGOLD,14,1.2,.9,{up:2});fxRing(STG.x,chY(5.4),STG.z,90,CHGOLD,16,1,.7,{});}
     if(lt>1.5)F.im.hidden=false;chGlowRise(STG.x,chY(5.2),STG.z,6,1.2,CHGOLD,1);}
   if(lt<1.3)chCam(F,15,2.2,15,sx*.4,Math.max(8,sy*.6),sz*.4,62);else{const q=cK(1.3,2.95,lt);chCam(F,lrp(15,8.5,q),lrp(1.4,1.2,q),lrp(15,8.5,q),0,lrp(2.4,1.6,q),0,lrp(56,48,q));}}},
 // 1 Imru erobert das Land und vereint es unter Skyroad
 {t0:2.95,t1:7.6,set:'plain',clock:10*60,fog:[60,420],setup(F){F.im=cE('ch_imru_',0,8,{f:'u'});F.ar=cArmy(['sky0','sky1','sky2'],7,5,-6,13,2,2.2,{jit:.25});
   F.bn=[];for(const x of[-7,7])F.bn.push(cE('ch_bansky_',x,11,{prop:1,h:5}));
   for(const[x,z]of[[-40,-90],[-20,-90],[20,-90],[40,-90],[-6,-90],[6,-90],[0,-128]])cE('ch_bansky_',x,z,{prop:1,h:7,dy:z===-128?47:11});},
  upd(F,lt,dt){const v=2.4,o=lt*v;cMv(F.im,0,8+o,'u');for(const e of F.ar)cMv(e,e.bx,e.bz+o,cWalk(e,lt));F.bn.forEach((b,i)=>cMv(b,i?7:-7,11+o));
   if(lt<2.7)chCam(F,lrp(7,4,lt/2.7),2.1,30+o*.9,0,2.4,8+o,58);else{const k=cK(2.7,4.65,lt);chCam(F,lrp(36,24,k),lrp(9,14,k),lrp(-40,-58,k),0,lrp(14,22,k),-110,56);}
   if(F.at(5.65))sfx(()=>Snd.chime());}},
 // 2 Ein Wendepunkt für Kriesa: hoch über dem Reich
 {t0:7.6,t1:10.8,set:'plain',clock:19*60+20,fog:[120,640],setup(F){F.ar=cArmy(['sky0','sky1','sky2'],9,8,-8,0,2,2.2,{jit:.3});cE('ch_imru_',0,-3,{f:'u'});for(const[x,z]of[[-40,-90],[40,-90],[0,-128]])cE('ch_bansky_',x,z,{prop:1,h:7,dy:z===-128?47:11});},
  upd(F,lt,dt){const k=fEase(cK(0,3.2,lt));for(const e of F.ar)cMv(e,e.bx,e.bz-lt*1.2,cWalk(e,lt));chCam(F,lrp(10,-30,k),lrp(16,120,k),lrp(30,150,k),0,lrp(4,0,k),lrp(-10,-70,k),lrp(58,64,k));
   if(Math.random()<dt*30)fxP(STG.x+rnd(-60,60),chY(rnd(10,60)),STG.z+rnd(-120,40),0,rnd(.2,.6),0,CHGOLD,2,rnd(.6,1.4),{s1:.1});}},
 // 3 Die Ahnengalerie: von links nach rechts
 {t0:10.8,t1:23.3,set:'gallery',clock:12*60,fog:[300,700],setup(F){CHX.torchOff=null;F.y285=0;},
  upd(F,lt,dt,t){const x=galX(t),z=t>20.4?lrp(6.8,7.6,cK(20.4,23.1,t)):6.8,y=t>20.4?lrp(2.9,3.6,cK(20.4,23.1,t)):2.9;chCam(F,x-.4,y,z,x+.3,3.4,0,t>20.4?lrp(50,54,cK(20.4,23.1,t)):50);
   if(F.at(20.7))chTag('Jahr 285','Die Geburt Immanuels',2.6);
   if(t>21.5&&Math.random()<dt*20)fxP(STG.x+25+rnd(-2.4,2.4),chY(rnd(1.6,7.4)),STG.z+.3,0,rnd(.1,.5),rnd(0,.2),CHGOLD,1.4,rnd(.1,.25),{s1:.04});}},
 // 4 Immanuel, Erbe der Urkraft (Gemälde)
 {t0:23.3,t1:26.5,set:'gallery',clock:12*60,fog:[300,700],setup(F){},
  upd(F,lt,dt){const k=fEase(cK(0,3.2,lt));chCam(F,25,lrp(3.6,4.3,k),lrp(7.6,4.6,k),25,4.4,0,lrp(54,46,k));
   if(Math.random()<dt*50)fxP(STG.x+25+rnd(-2.6,2.6),chY(rnd(1.4,7.6)),STG.z+.3,rnd(-.2,.2),rnd(.2,.8),rnd(0,.3),CHGOLD,1.6,rnd(.1,.3),{s1:.04});}},
 // 5 Die Urkraft des ersten Gottkönigs erwacht in Immanuel
 {t0:26.5,t1:29.6,set:'hill',clock:6*60+5,fog:[70,460],setup(F){F.im=cE('ch_imman_',0,0,{f:'u'});F.f=0;},
  upd(F,lt,dt){if(!F.f){F.f=1;sfx(()=>Snd.shimmer&&Snd.shimmer());}chGlowRise(STG.x,chY(5.1),STG.z,3,1.6,CHGOLD,2.4);
   for(let i=0;i<3;i++){const a=lt*4+i*2.1;fxP(STG.x+Math.cos(a)*1.4,chY(5.3+((lt*2+i)%3)),STG.z+Math.sin(a)*1.4,0,.5,0,CHGOLD,.7,.35,{s1:.05});}
   if(lt>2.5)F.fade(1);const a=.7+lt*.2;chCam(F,Math.sin(a)*6,1.2,Math.cos(a)*6,0,1.7,0,lrp(46,38,lt/3.1));}},
 // 6 Butzi: die goldenen Jahre
 {t0:29.6,t1:32.3,set:'coast',clock:16*60+40,fog:[70,480],setup(F){F.fade(0);const S=CHX.sets.coast;S.fleet.forEach(s=>s.visible=false);F.p=[cE('ch_fish0_',-6,14),cE('ch_fish1_',-3,16),cE('ch_fish2_',4,10,{flip:1}),cE('ch_fish0_',10,3,{f:'p'})];},
  upd(F,lt,dt,t){F.p.forEach((e,i)=>{if(i<2)cMv(e,e.bx+lt*1.1,e.bz,cWalk(e,lt,5));});if(F.at(31))chTag('Jahr 301','Butzi, ein Fischerdorf an der Küste',2.6);
   const k=fEase(cK(0,2.7,lt));chCam(F,lrp(-26,-14,k),3.2,lrp(-3,4,k),lrp(6,10,k),2.2,30,56);}},
 // 7 Die Invasionsflotte taucht aus dem Nebel
 {t0:32.3,t1:37.35,set:'coast',clock:18*60+40,fog:[12,150],setup(F){const S=CHX.sets.coast;F.fl=S.fleet;F.fl.forEach((s,i)=>{s.visible=true;s.userData.x0=-48+i*16;s.userData.d=cr(0,40);});F.r=[];F.horn=0;},
  upd(F,lt,dt,t){const S=CHX.sets.coast;F.fl.forEach((s,i)=>{const k=Math.min(1,(lt+.3)/4.4),z=lrp(-200-s.userData.d,-16-((i*7)%10),fEase(k));s.position.set(STG.x+s.userData.x0,0,STG.z+z);chShipBob(s,t,-.25);});
   if(F.at(32.6)||F.at(34.4))sfx(()=>Snd.gate());
   if(lt>3.9&&!F.r.length){for(let i=0;i<14;i++){const e=cE('ch_pl'+(i%4)+'_',-40+i*6+cr(-1,1),-10+cr(-2,0),{f:'u'});F.r.push(e);}sfx(()=>Snd.demonRoar(1.4,.4));}
   for(const e of F.r){e.lz+=dt*4.5;cMv(e,e.lx,e.lz,cWalk(e,lt,8));}
   if(lt<3.6)chCam(F,lrp(-2,2,lt/3.6),1.6,lrp(10,8,lt/3.6),0,lrp(5,3.5,lt/3.6),-80,lrp(50,44,lt/3.6));else chCam(F,9,1.4,4,-6,2.4,-14,52);}},
 // 8 Der Plündererkrieg bricht aus
 {t0:37.35,t1:40.3,set:'coast',clock:19*60+45,fog:[30,260],setup(F){const S=CHX.sets.coast;S.fleet.forEach((s,i)=>{s.visible=true;s.position.set(STG.x-48+i*16,chY(-.25),STG.z-16-((i*7)%10));});
   F.r=[];for(let i=0;i<18;i++)F.r.push(cE('ch_pl'+(i%4)+'_',-30+i*3.4+cr(-1,1),2+cr(0,4),{f:i%3?'u':'p'}));F.v=[];for(let i=0;i<6;i++)F.v.push(cE('ch_fish'+(i%3)+'_',-20+i*8,22+cr(0,4),{flip:i%2}));F.lit=0;},
  upd(F,lt,dt){for(const e of F.r){e.lz+=dt*5.2;cMv(e,e.lx,e.lz,cWalk(e,lt,9));if(Math.random()<dt*6)fxP(e.x+.3,e.y+2.1,e.z,0,1.5,0,[0xff8a20,0xffd060],.4,.3,{s1:.06});}
   for(const e of F.v){e.lz+=dt*6;cMv(e,e.lx,e.lz,cWalk(e,lt,10));}
   const S=CHX.sets.coast;while(F.lit<S.houses.length&&lt>.5+F.lit*.3){const h=S.houses[F.lit++];chFireAt(h.cx,h.top-1,h.cz,1.1);}
   if(F.at(38))sfx(()=>Snd.clash&&Snd.clash());chCam(F,lrp(14,10,lt/3),2,lrp(36,32,lt/3),-2,1.8,8,56);}},
 // 9 Butzi brennt
 {t0:40.3,t1:42.75,set:'coast',clock:22*60,fog:[30,240],setup(F){const S=CHX.sets.coast;for(const h of S.houses){chFireAt(h.cx,h.top-1.2,h.cz,1.3);chFireAt(h.cx+1.5,h.y0+1.5,h.cz+2.6,.7);}
   F.r=[];for(let i=0;i<8;i++)F.r.push(cE('ch_pl'+(i%4)+'_',-16+i*4.4,36+cr(-2,2),{f:i%2?'u':'0',flip:i%2}));},
  upd(F,lt,dt){F.r.forEach((e,i)=>{if(i%3===0){cMv(e,e.lx+dt*2*(i%2?-1:1),e.lz,cWalk(e,lt));}});const k=lt/2.45;chCam(F,lrp(-8,-2,k),1.5,lrp(62,54,k),0,4.5,30,54);}},
 // 10 Ein Krieg über den ganzen Kontinent
 {t0:42.75,t1:45.4,set:'field',clock:22*60+30,fog:[80,600],setup(F){for(let i=0;i<46;i++){const x=cr(-150,150),z=cr(-170,90);chFireAt(STG.x+x,chY(chH(x,z)+.2),STG.z+z,cr(.8,1.8));}
   for(let g=0;g<4;g++){const cx=-60+g*40,cz=-30+((g*37)%60);F['a'+g]=cArmy(['sky0','sky1'],5,2,cx-5,cz-6,2,2,{jit:.3});F['b'+g]=cArmy(['pl0','pl1','pl2','pl3'],5,2,cx-5,cz+3,2,2,{jit:.3,flip:1});}},
  upd(F,lt,dt){for(let g=0;g<4;g++){for(const e of F['a'+g])cMv(e,e.lx,e.lz,Math.floor(lt*5+e.ph)%2?'p':'0');for(const e of F['b'+g])cMv(e,e.lx,e.lz,Math.floor(lt*5+e.ph)%2?'u':'0');
     if(Math.random()<dt*3){const e=F['a'+g][(Math.random()*10)|0];fxSparks(e.x,e.y+1.2,e.z+1.5,10,{});}}
   const k=fEase(cK(0,2.65,lt));chCam(F,lrp(-20,-60,k),lrp(14,90,k),lrp(40,110,k),0,0,-40,lrp(58,64,k));}},
 // 11 Butzi in Trümmern
 {t0:45.4,t1:47.05,set:'coast',clock:8*60,fog:[40,320],setup(F){const S=CHX.sets.coast;S.fleet.forEach(s=>s.visible=false);for(const h of S.houses)chSmokeAt(h.cx,h.top-1,h.cz,1.2);},
  upd(F,lt,dt,t){if(F.at(46.3))chTag('Butzi','Das erste Dorf, das fiel',1.8);const k=lt/1.65;chCam(F,lrp(-14,-8,k),3,lrp(70,64,k),2,3,34,54);}},
 // 12 Hammerhausen
 {t0:47.05,t1:48.85,set:'hammer',clock:11*60,fog:[60,420],setup(F){const S=CHX.sets.hammer;for(const h of S.houses)chSmokeAt(h.x+(h.cx-h.x),h.top+.6,h.cz,.5);
   F.sm=[cE('ch_smith_',-10,9.6,{f:'u'}),cE('ch_smith_',10,9.6,{f:'u',flip:1})];F.ar=cArmy(['sky0','sky1','sky2'],6,2,-6,20,2,2.2,{});chTag('Hammerhausen','Stadt der Schmiede',1.8);},
  upd(F,lt,dt){F.sm.forEach((e,i)=>{const up=Math.floor(lt*3+i*.5)%2;e.frame=up?'u':'p';if(!up&&!e.hitF){e.hitF=1;fxSparks(e.x+(i?-.6:.6),chY(1.2),e.z-1.2,16,{});sfx(()=>Snd.clank(.25));}if(up)e.hitF=0;});
   for(const S of CHX.sets.hammer.forges)if(Math.random()<dt*8)fxP(STG.x+S[0]+rnd(-.8,.8),chY(S[1]),STG.z+S[2],0,rnd(1,2.5),0,[0xff8a20,0xffd060],.6,.18,{s1:.05});
   chCam(F,lrp(-6,-2,lt/1.8),lrp(2.4,3.4,lt/1.8),lrp(18,15,lt/1.8),0,5,0,58);}},
 // 13 Festungsstadt Aetherberg
 {t0:48.85,t1:51.62,set:'aether',clock:13*60,fog:[80,560],setup(F){const S=CHX.sets.aether;chTag('Aetherberg','Die Festungsstadt',2.4);},
  upd(F,lt,dt,t){const S=CHX.sets.aether;S.cry.forEach((m,i)=>{m.position.y=m.userData.y0+Math.sin(t*1.6+i)*.5;m.rotation.y=t*.8+i;});
   if(Math.random()<dt*10){const m=S.cry[(Math.random()*S.cry.length)|0];fxP(m.position.x+rnd(-1,1),m.position.y+rnd(-1,1),m.position.z+rnd(-1,1),0,rnd(.3,1),0,[0x9ae8ff,0xe0faff],1.2,.4,{s1:.05});}
   const k=fEase(cK(0,2.77,lt));chCam(F,lrp(30,10,k),lrp(6,40,k),lrp(60,-6,k),0,lrp(6,26,k),-70,lrp(56,60,k));}},
 // 14 Metropole Creeperia
 {t0:51.62,t1:53.75,set:'creep',clock:18*60+40,fog:[90,620],setup(F){chTag('Creeperia','Die Metropole',2);CHX.sets.creep.tower.rotation.set(0,0,0);CHX.sets.creep.tower.position.set(0,0,0);},
  upd(F,lt,dt){const k=fEase(cK(0,2.13,lt));chCam(F,lrp(-70,30,k),lrp(46,60,k),lrp(30,10,k),0,lrp(30,46,k),-110,60);}},
 // 15 Erbitterte Schlachten zu Lande
 {t0:53.75,t1:55.4,set:'field',clock:14*60,fog:[60,420],setup(F){F.a=cArmy(['sky0','sky1','sky2'],10,3,-10,-12,2.1,-2.2,{jit:.3});F.b=cArmy(['pl0','pl1','pl2','pl3'],10,3,-10,10,2.1,2.2,{jit:.3,flip:1});
   cE('ch_bansky_',-12,-16,{prop:1,h:5});cE('ch_banpl_',12,14,{prop:1,h:5});},
  upd(F,lt,dt){const m=Math.min(1,lt/.9);for(const e of F.a){cMv(e,e.bx,e.bz+m*9,lt<.9?cWalk(e,lt,10):(Math.floor(lt*6+e.ph)%2?'p':'0'));}for(const e of F.b){cMv(e,e.bx,e.bz-m*8,lt<.9?cWalk(e,lt,10):(Math.floor(lt*6+e.ph)%2?'u':'0'));}
   if(lt>.85&&Math.random()<dt*14){const x=rnd(-10,10);fxSparks(STG.x+x,chY(1.3),STG.z-1.5,14,{});if(Math.random()<.3)sfx(()=>Snd.clank(.2));}
   if(lt>.8)fxDust(STG.x+rnd(-10,10),STG.z+rnd(-3,1),2,1.5,{});chCam(F,lrp(-16,-10,lt/1.65),1.3,lrp(-4,-1,lt/1.65),6,1.8,0,60);}},
 // 16 und zur See, mit neuartigen Flugapparaten
 {t0:55.4,t1:57.75,set:'sea',clock:15*60,fog:[60,480],setup(F){const S=CHX.sets.sea.ships;S.raid.forEach((s,i)=>{s.position.set(STG.x-30+i*20,0,STG.z-60-((i*13)%20));s.rotation.y=Math.PI/2+.4*(i%2?1:-1);s.position.y=chY(0);s.rotation.x=0;s.visible=true;});
   S.sky.forEach((s,i)=>{s.position.set(STG.x-20+i*20,0,STG.z+18);s.rotation.y=-Math.PI/2;s.visible=true;});S.war.forEach(s=>s.visible=false);
   F.fl=[];for(let i=0;i<5;i++){const e=cFly(-24+i*12,11+i%2*3,36+i*4);e.h*=1.5;e.w*=1.5;F.fl.push(e);}F.bm=[];},
  upd(F,lt,dt,t){const S=CHX.sets.sea.ships;S.raid.concat(S.sky).forEach(s=>chShipBob(s,t));
   F.fl.forEach((e,i)=>{e.lz-=dt*19;e.frame=Math.floor(t*8+i)%2?'1':'0';e.lx+=Math.sin(t+i)*dt;e.x=STG.x+e.lx;e.z=STG.z+e.lz;e.y=chY(e.dy);
     if(!e.dropped&&e.lz<-50){e.dropped=1;F.bm.push({x:e.x,y:e.y,z:e.z,vy:0,t:0});}});
   for(let i=F.bm.length-1;i>=0;i--){const b=F.bm[i];b.vy-=20*dt;b.y+=b.vy*dt;b.z-=dt*10;fxP(b.x,b.y,b.z,0,0,0,0x303030,.3,.4,{add:false});if(b.y<chY(2)){F.bm.splice(i,1);fxBurst(b.x,b.y+1,b.z,60,[0xff6a10,0xffd060,0xffffff],10,.9,.9,{up:3,g:6});fxBurst(b.x,b.y,b.z,30,[0xc8e0f0,0xffffff],6,1.2,.6,{up:6,g:9,add:false});sfx(()=>Snd.boom(.18));F.shake=.3;}}
   const k=lt/2.35;chCam(F,lrp(-8,-4,k),lrp(5,7,k),lrp(34,30,k),lrp(-4,0,k),lrp(14,8,k),-40,62);}},
 // 17 umgerüstete Kriegsschiffe
 {t0:57.75,t1:60.55,set:'sea',clock:16*60,fog:[60,480],setup(F){const S=CHX.sets.sea.ships;S.sky.forEach(s=>s.visible=false);S.war.forEach((s,i)=>{s.visible=true;s.position.set(STG.x-26+i*22,chY(0),STG.z-6);s.rotation.y=0;});
   S.raid.forEach((s,i)=>{s.visible=i<3;s.position.set(STG.x-24+i*22,chY(0),STG.z-44);s.rotation.y=Math.PI;s.rotation.x=0;s.rotation.z=0;});F.vol=0;F.sink=0;},
  upd(F,lt,dt,t){const S=CHX.sets.sea.ships;S.war.forEach(s=>chShipBob(s,t));S.raid.forEach((s,i)=>{if(i===1&&F.sink>0){F.sink+=dt;s.position.y=chY(-F.sink*1.4);s.rotation.x=F.sink*.25;if(Math.random()<dt*20)fxP(s.position.x+rnd(-5,5),s.position.y+3,s.position.z,0,3,0,[0xff6a10,0xffd060],.9,1.2,{s1:.3});}else chShipBob(s,t);});
   if(lt>.4&&lt-F.vol>.55){F.vol=lt;const sh=S.war[(Math.random()*3)|0];sfx(()=>Snd.boom(.14));for(let c=0;c<5;c++){const x=sh.position.x-6.5+c*2.7,z=sh.position.z-3.3;fxBurst(x,chY(1.6),z,14,[0xffffff,0xfff0a0,0xff9a30],6,.25,.5,{});fxP(x,chY(1.8),z-1,0,1,-2,[0xc8c8c8,0x9a9a9a],2.2,2,{add:false,s1:4,a:.6});}
     const tgt=S.raid[(Math.random()*3)|0];if(tgt.visible){const hx=tgt.position.x+rnd(-5,5);setTimeout(()=>{fxBurst(hx,chY(2.5),tgt.position.z,40,[0xff6a10,0xffd060],8,.7,.8,{up:2});},300);}}
   if(lt>1.5&&!F.sink){F.sink=.01;sfx(()=>Snd.boom(.3));F.shake=.4;}
   const k=lt/2.8;chCam(F,lrp(44,30,k),lrp(2,3,k),lrp(10,4,k),0,3,-24,58);}},
 // 18 Wirre Zeiten
 {t0:60.55,t1:61.75,set:'field',clock:19*60+30,fog:[20,200],setup(F){for(let i=0;i<10;i++)chSmokeAt(STG.x+cr(-20,20),chY(0),STG.z+cr(-30,10),2);cE('ch_bansky_',2,-6,{prop:1,h:4.5,f:'t'});},
  upd(F,lt,dt){chCam(F,lrp(-6,-3,lt/1.2),1.6,lrp(10,8,lt/1.2),2,2.6,-6,56);}},
 // 19 Drei Generäle treten aus dem Rauch
 {t0:61.75,t1:62.85,set:'field',clock:19*60+40,fog:[20,200],setup(F){for(let i=0;i<14;i++)chSmokeAt(STG.x+cr(-14,14),chY(0),STG.z+cr(-12,-2),2.2);F.g=[cE('ch_sturmg_',-2.4,-8),cE('ch_yinyang_',0,-8.4),cE('ch_mauley_',2.4,-8)];},
  upd(F,lt,dt){F.g.forEach((e,i)=>cMv(e,e.bx,e.bz+lt*1.5,cWalk(e,lt,4)));chCam(F,0,1.2,2.5,0,1.8,-8,52);}},
 {t0:62.85,t1:63.85,set:'field',clock:19*60+40,fog:[20,200],setup(F){for(let i=0;i<8;i++)chSmokeAt(STG.x+cr(-10,10),chY(0),STG.z+cr(-14,-6),2);F.e=cE('ch_sturmg_',0,-5,{f:'u'});chTag('Sturmgenster','General · ein Vorfahre von Kreak',1.6);},
  upd(F,lt){chClose(F,F.e,.5,.05,2.6,lrp(40,32,lt));}},
 {t0:63.85,t1:64.65,set:'field',clock:19*60+40,fog:[20,200],setup(F){for(let i=0;i<8;i++)chSmokeAt(STG.x+cr(-10,10),chY(0),STG.z+cr(-14,-6),2);F.e=cE('ch_yinyang_',0,-5,{f:'p'});chTag('Yin-Yang','General aus der Kaiserstadt',1.3);},
  upd(F,lt){chClose(F,F.e,-.5,.05,2.6,lrp(40,32,lt/.8));}},
 {t0:64.65,t1:65.8,set:'field',clock:19*60+40,fog:[20,200],setup(F){for(let i=0;i<8;i++)chSmokeAt(STG.x+cr(-10,10),chY(0),STG.z+cr(-14,-6),2);F.e=cE('ch_mauley_',0,-5);chTag('Mauley','General vom Volk der Maulwurfmenschen',1.5);},
  upd(F,lt){chClose(F,F.e,.4,.05,2.5,lrp(40,32,lt/1.15));}},
 // 20 Die Gründung der Bastion Sturmburg
 {t0:65.8,t1:68.75,set:'real',clock:9*60+30,noGuards:1,setup(F){const g=STT();F.g=[cRE('ch_sturmg_',-2.2,-1741),cRE('ch_yinyang_',0,-1741.4),cRE('ch_mauley_',2.2,-1741)];F.g.forEach(e=>{e.y=g;});
   for(const x of[-7,7])cRE('ch_bansturm_',x,-1750,{type:'chp',h:6});chTag('Bastion Sturmburg','gegründet von den drei Generälen',2.6);},
  upd(F,lt){const g=STT(),k=fEase(cK(0,2.95,lt));F.cam(lrp(1.5,0,k),g+lrp(1.5,5,k),lrp(-1735.5,-1726,k),0,g+lrp(1.5,9,k),-1758,lrp(54,60,k));}},
 // 21 Jahr 322: der Höhepunkt des Krieges
 {t0:68.75,t1:73.65,set:'field',clock:21*60+30,fog:[50,420],blood:1,setup(F){F.a=cArmy(['sky0','sky1','sky2'],14,4,-18,-8,2.6,-2.4,{jit:.5});F.b=cArmy(['pl0','pl1','pl2','pl3','alt0','alt1'],14,4,-18,4,2.6,2.4,{jit:.5,flip:1});
   for(let i=0;i<20;i++)chFireAt(STG.x+cr(-70,70),chY(.2),STG.z+cr(-80,40),cr(.8,1.6));chTag('Jahr 322','Der Höhepunkt des Krieges',2.6);},
  upd(F,lt,dt){for(const e of F.a)cMv(e,e.bx,e.bz+Math.min(1,lt/1.2)*6,lt<1.2?cWalk(e,lt,10):(Math.floor(lt*6+e.ph)%2?'p':'0'));for(const e of F.b)cMv(e,e.bx,e.bz-Math.min(1,lt/1.2)*5,lt<1.2?cWalk(e,lt,10):(Math.floor(lt*6+e.ph)%2?'u':'0'));
   if(lt>1.1&&Math.random()<dt*18){fxSparks(STG.x+rnd(-18,18),chY(1.3),STG.z-1.5,12,{});if(Math.random()<.2)sfx(()=>Snd.clank(.18));}
   const a=-.6+lt*.16;chCam(F,Math.sin(a)*24,lrp(4,9,lt/4.9),Math.cos(a)*24,0,1,-2,58);}},
 // 22 Der Verrat des Großherzogs Altonos
 {t0:73.65,t1:76.6,set:'throne',clock:12*60,fog:[300,700],setup(F){F.im=cE('ch_imman_',0,-21.2);F.al=cE('ch_altonos_',-1,-15,{flip:1});for(const z of[-12,-6])for(const s of[-1,1])cE('ch_sky0_',s*3.6,z,{flip:s>0});chTag('Großherzog Altonos','',2.2);F.e=0;},
  upd(F,lt,dt){const A=F.al;if(lt>1.5&&!F.e){F.e=1;A.d=Object.assign({},A.d,{eyes:chEyes('altonos')});sfx(()=>Snd.demonRoar(.6,.5));F.flash(.25,'#6a2a9a');}
   if(lt>1.5){if(Math.random()<dt*30)fxP(A.x+rnd(-1.4,1.4),A.y+rnd(0,.6),A.z+rnd(-1.4,1.4),rnd(-.3,.3),rnd(.3,1.2),rnd(-.3,.3),[0x1a0a24,0x2a1438,0x0a0410],2,rnd(1,2),{add:false,s1:2.5,a:.7});A.frame=lt>2.1?'p':'0';}
   if(lt<1.5)chCam(F,-4,2.2,-8,-.5,1.3,-19,50);else chClose(F,F.al,-1.2,.05,2.6,lrp(40,30,cK(1.5,2.9,lt)));}},
 // 23 Die Schattenarmee erhebt sich
 {t0:76.6,t1:78.65,set:'field',clock:23*60,fog:[30,260],blood:1,setup(F){F.s=cArmy(['sh0','sh1','sh2'],10,4,-12,-14,2.6,2.4,{jit:.6,eyes:k=>chEyes(k)});F.s.forEach(e=>{e.dy=-2.2;e.t0=Math.random()*.9;});F.r=0;},
  upd(F,lt,dt){if(!F.r){F.r=1;sfx(()=>Snd.demonRoar(.8,.7));sfx(()=>Snd.summon&&Snd.summon());}
   for(const e of F.s){const k=fEase(cK(e.t0,e.t0+1,lt));cMv(e,e.bx,e.bz,'0',-2.2*(1-k));if(k<1&&Math.random()<dt*6)fxP(e.x+rnd(-.6,.6),chY(.2),e.z,0,rnd(.4,1.2),0,[0x14081c,0x2a1438,0x5a2a8a],1.6,rnd(.8,1.6),{add:false,s1:2,a:.7});}
   for(let i=0;i<4;i++)fxP(STG.x+rnd(-20,20),chY(.3),STG.z+rnd(-20,10),rnd(-.3,.3),rnd(.1,.4),rnd(-.3,.3),[0x0a0410,0x1a0a24],3,rnd(2,4),{add:false,s1:4,a:.55});
   chCam(F,lrp(-2,0,lt/2),1.1,lrp(4,2,lt/2),0,2.2,-14,56);}},
 // 24 Das Land versinkt im Chaos
 {t0:78.65,t1:81.1,set:'hammer',clock:22*60+40,fog:[30,300],blood:1,setup(F){for(const h of CHX.sets.hammer.houses)chFireAt(h.cx,h.top-1.4,h.cz,1.2);
   F.s=cArmy(['sh0','sh1','sh2'],4,4,-3,24,2,2.2,{jit:.3,eyes:k=>chEyes(k)});},
  upd(F,lt,dt){for(const e of F.s)cMv(e,e.bx,e.bz-lt*2.2,cWalk(e,lt,6));if(lt>2.1)F.fade(1);chCam(F,lrp(-3,-1,lt/2.4),2,lrp(5,8,lt/2.4),0,2.4,22,58);}},
 // 25 Die letzte Schlacht: Immanuel auf dem Hügel
 {t0:81.1,t1:83.35,set:'field',clock:19*60+25,fog:[40,360],blood:1,setup(F){F.fade(0);F.im=cE('ch_imman_',0,-40,{f:'u'});F.sk=[];for(let i=0;i<10;i++){const a=i/10*6.283;F.sk.push(cE('ch_sky'+(i%3)+'_',Math.cos(a)*4,-40+Math.sin(a)*4,{f:'p'}));}
   F.s=[];for(let i=0;i<60;i++){const a=i/60*6.283+cr(-.05,.05),r=cr(22,34);F.s.push(cE('ch_sh'+(i%3)+'_',Math.cos(a)*r,-40+Math.sin(a)*r,{eyes:chEyes('sh'+(i%3))}));}},
  upd(F,lt,dt){for(const e of F.s){const dx=-e.bx,dz=-40-e.bz,d=Math.hypot(dx,dz),k=Math.min(lt*.12,.3);cMv(e,e.bx+dx*k,e.bz+dz*k,cWalk(e,lt,6));e.flip=dx<0;}chGlowRise(STG.x,chY(6.2),STG.z-40,2,1,CHGOLD,1.5);
   chCam(F,lrp(6,4,lt/2.25),3.2,lrp(6,1,lt/2.25),0,1.6,-40,lrp(40,34,lt/2.25));}},
 // 26 Immanuel opfert sich
 {t0:83.35,t1:85.85,set:'field',clock:19*60+25,fog:[40,360],blood:1,setup(F){F.im=cE('ch_imman_',0,-40,{f:'u'});F.s=[];for(let i=0;i<60;i++){const a=i/60*6.283,r=cr(16,24);F.s.push(cE('ch_sh'+(i%3)+'_',Math.cos(a)*r,-40+Math.sin(a)*r,{eyes:chEyes('sh'+(i%3)),flip:Math.cos(a)>0}));}F.boom=0;},
  upd(F,lt,dt){const up=fEase(cK(0,1.6,lt))*5;cMv(F.im,0,-40,'u',up);chGlowRise(STG.x,chY(6+up),STG.z-40,8+lt*10,1.5+lt,CHGOLD,2);
   for(let i=0;i<6;i++){const a=Math.random()*6.283;fxP(STG.x+Math.cos(a)*14,chY(6+up+1),STG.z-40+Math.sin(a)*14,-Math.cos(a)*9,0,-Math.sin(a)*9,CHGOLD,1.5,.5,{s1:.1});}
   if(lt>1.65&&!F.boom){F.boom=1;F.flash(1,'#fff6d0');F.shake=1.4;sfx(()=>Snd.boom(.5));sfx(()=>Snd.chime());fxBurst(STG.x,chY(7+up),STG.z-40,300,CHGOLD,30,1.6,1.6,{up:2});fxRing(STG.x,chY(6.5),STG.z-40,200,CHGOLD,34,1.4,1.2,{});F.im.hidden=true;}
   if(lt<1.65)chCam(F,3,1.2,-31,0,2.4+up*.7,-40,lrp(52,44,lt/1.65));else chCam(F,lrp(3,10,cK(1.65,2.5,lt)),lrp(1.2,11,cK(1.65,2.5,lt)),lrp(-31,-14,cK(1.65,2.5,lt)),0,1,-40,56);}},
 // 27 Die Schattenarmee zerfällt
 {t0:85.85,t1:88.7,set:'field',clock:19*60+40,fog:[40,380],setup(F){F.s=[];for(let i=0;i<50;i++){const a=i/50*6.283,r=cr(16,30);F.s.push(cE('ch_sh'+(i%3)+'_',Math.cos(a)*r,-40+Math.sin(a)*r,{flip:Math.cos(a)>0}));}F.cr=cE('ch_crown_',0,-40,{prop:1,h:.32});},
  upd(F,lt,dt){const R=lt*14;for(const e of F.s){if(e.gone)continue;const d=Math.hypot(e.lx,e.lz+40);if(d<R){e.gone=1;e.hidden=true;fxBurst(e.x,e.y+1,e.z,24,[0x5a2a8a,0x1a0a24,0xe080ff],5,1,.6,{up:2});}}
   for(let i=0;i<20;i++){const a=Math.random()*6.283;fxP(STG.x+Math.cos(a)*R,chY(6.4-Math.min(6,R*.25)+.6),STG.z-40+Math.sin(a)*R,0,.5,0,CHGOLD,.5,.6,{s1:.2});}
   if(Math.random()<dt*10)fxP(F.cr.x+rnd(-.2,.2),F.cr.y+.2,F.cr.z,0,.4,0,0xffffff,.5,.15,{});
   const k=fEase(cK(0,2.85,lt));chCam(F,lrp(10,1.2,k),lrp(11,.9,k),lrp(-14,-37.6,k),0,.1,-40,lrp(56,40,k));}},
 // 28 Das Ende der alten Dynastie
 {t0:88.7,t1:92,set:'gallery',clock:12*60,fog:[300,700],setup(F){CHX.torchOff={};const S=CHX.sets.gallery;S.ribbon.material.opacity=0;},
  upd(F,lt,dt){const S=CHX.sets.gallery,order=[10,9,8,7,6];order.forEach((ti,i)=>{if(lt>.5+i*.45&&!CHX.torchOff[ti]){CHX.torchOff[ti]=1;fxP(STG.x+S.torchX[ti],chY(4.5),STG.z+.3,0,.6,0,[0x8a8a8a,0x5a5a5a],2,.5,{add:false,s1:1.2,a:.5});}});
   S.ribbon.material.opacity=Math.min(1,Math.max(0,(lt-1.2)/1.2));const k=fEase(cK(0,3.3,lt));chCam(F,lrp(21,24.4,k),lrp(3.6,4.3,k),lrp(9,6,k),25,4.3,0,lrp(56,48,k));}},
 // 29 Der blutige Fall von Creeperia
 {t0:92,t1:94.55,set:'creep',clock:23*60,fog:[60,520],blood:1,setup(F){const S=CHX.sets.creep;S.roofs.forEach((r,i)=>{if(i%2===0)chFireAt(r.cx,r.top-1.2,r.cz,1.5);});S.tower.rotation.set(0,0,0);S.tower.position.set(0,0,0);F.c=0;},
  upd(F,lt,dt){const S=CHX.sets.creep,tw=S.tower;if(lt>1){const k=Math.min(1,(lt-1)/1.4);tw.rotation.z=-k*k*.55;tw.position.set((STG.x)*(1-Math.cos(tw.rotation.z))-Math.sin(tw.rotation.z)*0,-k*k*20,0);
     if(!F.c){F.c=1;sfx(()=>Snd.treeFall&&Snd.treeFall());sfx(()=>Snd.boom(.35));}if(Math.random()<dt*30)fxDust(STG.x+rnd(-12,12),STG.z-110+rnd(-12,12),3,4,{size:2,life:2.5,cols:[0x5a5048,0x4a4038,0x6a6058]});}
   chCam(F,lrp(-40,-34,lt/2.55),lrp(26,30,lt/2.55),lrp(10,4,lt/2.55),0,lrp(36,28,lt/2.55),-110,58);}},
 // 30 Skyroad zerbricht
 {t0:94.55,t1:99.3,set:'field',clock:15*60,fog:[50,400],setup(F){F.b=cE('ch_bansky_',0,-40,{prop:1,h:6});F.L=cArmy(['alt0','alt1'],5,4,-6,-34,1.8,2,{jit:.2});F.R=cArmy(['aet0','aet1'],5,4,-2,-34,1.8,2,{jit:.2,flip:1});F.L.forEach(e=>e.bx-=1);F.R.forEach(e=>e.bx+=4);F.tr=0;},
  upd(F,lt,dt){if(lt>1&&!F.tr){F.tr=1;F.b.sp='ch_bansky_';F.b.frame='t';sfx(()=>Snd.crack&&Snd.crack());sfx(()=>Snd.clank(.5));fxBurst(F.b.x,F.b.y+4.5,F.b.z,30,[0x2a4ab0,0xf0c840],4,1.2,.3,{g:3,add:false});}
   const m=Math.max(0,lt-1.4);for(const e of F.L)cMv(e,e.bx-m*3.2,e.bz,m>0?cWalk(e,lt,6):'0');for(const e of F.R)cMv(e,e.bx+m*3.2,e.bz,m>0?cWalk(e,lt,6):'0');F.L.forEach(e=>e.flip=m>0);F.R.forEach(e=>e.flip=m<=0);
   const k=fEase(cK(0,4.75,lt));chCam(F,0,lrp(2.6,9,k),lrp(-26,-6,k),0,3,-40,lrp(44,62,k));}},
 // 31 Altonarien und das Aetherbergische Kaiserreich
 {t0:99.3,t1:103.3,set:'field',clock:16*60,fog:[50,400],setup(F){F.L=cArmy(['alt0','alt1'],4,8,-36,6,2,2.4,{jit:.3});F.R=cArmy(['aet0','aet1'],4,8,28,6,2,2.4,{jit:.3,flip:1});
   for(const z of[5,14])cE('ch_banalt_',-28,z,{prop:1,h:5.5});for(const z of[5,14])cE('ch_banaet_',28,z,{prop:1,h:5.5});cE('ch_bansky_',0,12,{prop:1,h:6,f:'t'});},
  upd(F,lt,dt,t){if(F.at(99.45))chTag('Altonarien','Reich des Verräters',1.4);if(F.at(100.6))chTag('Aetherbergisches Kaiserreich','',1.8);
   const k=t<100.5?fEase(cK(99.3,100.5,t)):1,k2=fEase(cK(100.5,101.9,t));const tx=t<100.5?-30:lrp(-30,30,k2);chCam(F,0,2.6,32,tx,1.6,14,52);if(t>102.3)F.fade(1);}},
 // 32 Hundert Jahre später: Sturmburg im Morgengrauen
 {t0:103.3,t1:106.6,set:'real',clock:6*60+10,setup(F){F.fade(0);chTag('100 Jahre später','',2.4);gateTarget=1;},
  upd(F,lt){const g=STT();gateOpen=Math.min(1,gateOpen+.006);if(gateLeaves)gateLeaves.forEach(L=>{L.piv.rotation.y=-L.s*cK(1.4,3.3,lt)*1.35;});const k=fEase(cK(0,3.3,lt));
   const cx=lrp(-9,-3,k),cz=lrp(-1704,-1716,k);F.cam(cx,Math.max(getHeight(cx,cz)+2.2,g-16+k*6),cz,0,g+lrp(14,9,k),-1760,58);}},
 // 33 Ein würdiger Nachfolger kehrt zurück
 {t0:106.6,t1:110.05,set:'real',clock:6*60+20,setup(F){gateTarget=1;if(gateLeaves)gateLeaves.forEach(L=>{L.piv.rotation.y=-L.s*1.35;});F.k=cRE('ch_kreak_',0,-1742);for(let i=0;i<4;i++)for(const s of[-1,1])cRE('g'+((i*2+(s>0?1:0))%8)+'_',s*3,-1772-i*3.4,{flip:s>0});},
  upd(F,lt){const g=STT(),z=lrp(-1742,-1766,cK(0,3.4,lt));F.k.x=0;F.k.z=z;F.k.y=g+Math.abs(Math.sin(lt*7))*.06;F.k.frame='0';F.cam(lrp(1.4,.8,lt/3.4),g+1.5,-1781,0,g+1.9,-1752,lrp(46,38,lt/3.4));}},
 // 34 Gier nach Rache
 {t0:110.05,t1:113.75,set:'real',clock:6*60+20,setup(F){const t0=F.t;F.cu=chCuKreak(t0);},upd(F,lt){}},
 // 35 KREAK, wahrer Kaiser von Sturmburg
 {t0:113.75,t1:118.4,set:'real',clock:6*60+40,setup(F){F.cu=null;F.k=cRE('ch_kreak_',0,-1828,{f:'u'});for(let i=0;i<5;i++)for(const s of[-1,1]){const e=cRE('g'+((i+(s>0?3:0))%8)+'_',s*(3+i%2*.4),-1822+i*3.2,{flip:s<0});e.dy=0;}
   for(const s of[-1,1])cRE('ch_bansturm_',s*5,-1830,{type:'chp',h:6});F.cp=0;},
  upd(F,lt,dt,t){const g=STT();if(F.at(114.22)){F.flash(.7,'#fff');F.cap('KREAK',3.2);sfx(()=>Snd.boom(.25));sfx(()=>Snd.chime());F.shake=.5;}
   if(t>114.22&&Math.random()<dt*14)fxP(F.k.x+rnd(-.5,.5),g+rnd(.2,2),F.k.z,0,rnd(.5,1.5),0,[0xffe080,0xffb040],1,.25,{s1:.05});
   const k=fEase(cK(0,3.9,lt)),hy=chHead(F.k);F.cam(lrp(2.6,.6,k),g+lrp(.7,1.5,k),lrp(-1802,-1821.5,k),0,lrp(hy+1.2,hy-.1,k),-1828,lrp(56,38,k));if(t>117.7)F.fade(1);}}];
// gemalte Nahaufnahme: Kreak im Morgenlicht, voller Zorn
function chCuKreak(t0){const o={cx:96,cy:62,s:1.3,anger:1,mouth:0,wind:.35};return{draw:(lp,t,dt)=>{const lt=t-t0;o.t=t;o.cy=62-Math.min(1,lt/3)*3;o.s=1.3+Math.min(1,lt/3.6)*.25;
  cuSky(lp,t,{top:[40,52,96],mid:[214,120,80],bot:[255,200,140]});paintKreak(lp,o);cuEmbers(lp,FILM,dt,1,[255,220,170]);}};}
const CHRON_FILM={dur:118.4,silent:false,fadeIn:true,
  start(F){CHX.save={clock:FLAGS.clock,moon:FLAGS.moonForce||null,x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch,kh:kreakE?kreakE.hidden:null,gate:gateTarget};
    chBuild();chSubDom();F.si=-1;CHX.torchOff=null;if(kreakE)kreakE.hidden=true;Mus.cine='ereignisse/chronik';
    try{const a=new Audio('assets/sfx/chronik/erzaehler.mp3');a.volume=clamp(voiceVol()*.95,0,1);F.audio=a;F.audioOk=false;
      a.addEventListener('playing',()=>{F.audioOk=true;},{once:true});a.addEventListener('error',()=>{F.audio=null;},{once:true});const p=a.play();if(p&&p.catch)p.catch(()=>{F.audio=null;});}catch(e){F.audio=null;}},
  step(F,dt){const A=F.audio;if(A&&F.audioOk&&!A.paused&&!A.ended&&A.currentTime>0)F.t=A.currentTime;
    const t=F.t,i=CSC.findIndex(s=>t>=s.t0&&t<s.t1);
    if(i>=0){const S=CSC[i];if(i!==F.si){chClear();F.si=i;F.cu=null;F.shake=0;chShow(S.set==='real'?null:S.set);FLAGS.clock=S.clock;FLAGS.moonForce=S.blood?{n:FLAGS.day,phase:4,ev:'blood'}:null;
        CHX.fog=S.set==='real'?null:(S.fog||[50,380]);if(guardMesh)guardMesh.visible=!S.noGuards;try{S.setup(F);}catch(e){console.error('Chronik-Szene',i,e);}}
      try{S.upd(F,t-S.t0,dt,t);}catch(e){console.error('Chronik',i,e);}}
    chFxTick(dt);chTorchTick(dt);if(CHM&&CHM.tex.water){CHM.tex.water.offset.x+=dt*.03;CHM.tex.water.offset.y+=dt*.012;}
    if(CHX.tagT>0){CHX.tagT-=dt;if(CHX.tagT<=0){const el=$('chTag');if(el)el.classList.remove('on');}}
    const sub=CH_SUBS.find(s=>t>=s[0]&&t<s[1]),el=$('filmSub');if(el){const tx=sub?sub[2]:'';if(el.textContent!==tx&&tx)el.textContent=tx;el.style.opacity=sub?1:0;}},
  end(F){chClear();chShow(null);chDispose();if(F.audio){try{F.audio.pause();}catch(e){}F.audio=null;}if(guardMesh)guardMesh.visible=true;
    const s=CHX.save;if(s){FLAGS.clock=s.clock;FLAGS.moonForce=s.moon;if(kreakE&&s.kh!=null)kreakE.hidden=s.kh;}
    if(gateLeaves&&!FLAGS.sturmOpen){gateTarget=s?s.gate:0;}
    const el=$('filmSub');if(el)el.style.opacity=0;const tg=$('chTag');if(tg)tg.classList.remove('on');F.fade(0);$('filmFade').style.opacity=0;
    if(CHX.enter){CHX.enter=false;FLAGS.chronik=1;Object.assign(P,{x:0,z:WALL_Z-10,y:STORM_TOP+.3,yaw:0,pitch:0,vx:0,vy:0,vz:0});try{saveGame();}catch(e){}
      setTimeout(()=>{if(!FILM.on)toast('Willkommen in Sturmburg');},400);}
    else if(s)Object.assign(P,{x:s.x,y:s.y,z:s.z,yaw:s.yaw,pitch:s.pitch,vx:0,vy:0,vz:0});}};
function playChronik(enter){if(FILM.on)return;CHX.enter=!!enter;playFilm(CHRON_FILM);}
// Sichtweite während der Kulissen-Szenen
{const a=setFog;setFog=function(n,f){if(FILM.on&&FILM.def===CHRON_FILM&&CHX.fog){const rd=settings.renderDist;settings.renderDist=1e4;try{a(CHX.fog[0],CHX.fog[1]);}finally{settings.renderDist=rd;}return;}return a(n,f);};}
// =========================================================
// Sturmburg: erst betretbar, wenn Shikaya besiegt ist
// =========================================================
const shkBeaten=()=>{try{return mqAt('end');}catch(e){return false;}};
const STURM_LINES=['Halt! Solange die Dämonenkönigin frei ist, bleibt das Tor geschlossen. Befehl des Hauptmanns.','Niemand kommt nach Sturmburg hinein. Nicht, solange Shikaya lebt und frei ist.','Das Tor bleibt zu. Erst wenn die Dämonenkönigin gefallen ist, öffnet Sturmburg seine Tore wieder.'];
let sturmHouses=false;
function sturmCityColl(){if(sturmHouses)return;sturmHouses=true;const rr=mulberry32(612),W0=WALL_Z,cz=-1880;
  for(let i=0;i<46;i++){const x=(rr()*2-1)*150,z=W0-14-rr()*180;if(Math.hypot(x,z-cz)<26)continue;
    const b={x,z,cos:Math.cos(rr()<.5?0:Math.PI/2),sin:Math.sin(rr()<.5?0:Math.PI/2),st:2+(rr()*3|0),w:6+rr()*4,d:6+rr()*3};rr();rr();rr();
    if(Math.abs(b.cos*b.cos+b.sin*b.sin-1)<.1)COLL.push({x:b.x,z:b.z,cos:b.cos,sin:b.sin,hw:b.w/2+.2,hd:b.d/2+.2,top:STORM_TOP+3*b.st+4});}
  COLL.push({x:-60,z:-1830,cos:1,sin:0,hw:6.2,hd:12.2,top:STORM_TOP+23});}
function sturmOpenGate(quiet){FLAGS.sturmOpen=1;gateTarget=1;for(const c of COLL)if(c.gate){c.hw=.01;c.hd=.01;c.top=-1e4;}sturmCityColl();if(!quiet){sfx(()=>Snd.gate());toast('Die Tore von Sturmburg öffnen sich.');}}
openGate=function(){if(!shkBeaten()){const g=guards&&guards.slice().sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];
    const line=STURM_LINES[(Math.random()*STURM_LINES.length)|0];if(g&&Math.hypot(g.x-P.x,g.z-P.z)<30){say(g,line);g.talk=4;}else toast('Das Tor ist verschlossen.');sfx(()=>Snd.click());return;}
  if(!FLAGS.sturmOpen){sturmOpenGate();try{saveGame();}catch(e){}}};
{const a=updateGate;updateGate=function(dt){if(FLAGS.sturmOpen&&(gateTarget!==1||!sturmHouses)&&!FILM.on)sturmOpenGate(true);a(dt);
  if(state!=='playing'||FILM.on||!gateLeaves)return;const inside=P.z<WALL_Z-4.5&&P.z>MZ0&&Math.abs(P.x)<172;if(!inside)return;
  if(!shkBeaten()){Object.assign(P,{x:0,z:WALL_Z+9,y:getHeight(0,WALL_Z+9)+.3,vx:0,vy:0,vz:0,yaw:Math.PI});toast('Die Wache bringt dich vor das Tor. Sturmburg ist noch verschlossen.');return;}
  if(!FLAGS.sturmOpen)sturmOpenGate(true);if(!FLAGS.chronik)playChronik(true);};}
{const a=findTarget;findTarget=function(){a.apply(this,arguments);if(targetGate&&FLAGS.sturmOpen){targetGate=false;promptEl.hidden=true;}};}
// Vorschau über /cutszene
CUTS.push(['chronik','Die Chronik von Kriesa (Sturmburg)',()=>{CS.film=1;playFilm(CHRON_FILM,csDone);}]);
// Gebiet „Sturmburg“ hinter den Mauern
AREAS.stormcity='Sturmburg';if(typeof AREA_MUSIC!=='undefined')AREA_MUSIC.stormcity=AREA_MUSIC.stormgate||'orte/sturmburg';
{const a=areaAt;areaAt=function(x,z){if(x<60000&&z<WALL_Z-3&&z>MZ0&&Math.abs(x)<175)return'stormcity';return a(x,z);};}
if(typeof MAPC!=='undefined')MAPC.stormcity=MAPC.stormgate;
