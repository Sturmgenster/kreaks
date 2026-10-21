/* =========================================================
   0.0.132 · Ebene 4 des Großen Turms: Der Schlund
   - Die Ebene ist ein riesiger Körper von innen: Rachen, Speiseröhre, Magen mit Blutseen, der enge Pförtner,
     das verschlungene Gedärm, die Herzkammer mit schlagendem Herz, die Halsschlagader unter Rippenbögen
     und am Ende die Hirnkammer.
   - Die Wände atmen. Der Boden ist matschig und schleimig (langsamer), in Blutseen watet man.
     Von der Decke tropft Blut. Augen in den Wänden folgen dir und blinzeln. Finger tasten aus dem Fleisch.
   - Abszesse wachsen aus dem Boden: Augenbeulen (spucken), Händebeulen (greifen und halten fest),
     Beinbeulen (treten weg) und Schlundmäuler (beißen, Gift). Sie bewegen sich nicht von selbst,
     aber kommt man zu nah, wachsen sie heraus. Sie tauchen auch ab und an anderer Stelle wieder auf.
   - In Engstellen schnappen Zahnreihen aus den Wänden zu wie ein Gebiss. In großen Kammern beißt manchmal die Wand.
   - Endboss: Das Gehirn (15000 LP) mit einem großen bösen Auge und kleinen, verkrüppelten Gliedmaßen.
     Es feuert Laserstrahlen über den Boden, schlägt mit den Gliedern, lässt die Wand zubeißen,
     ruft Abszesse und schießt im Zorn eine Laserspirale.
   - Mehrspieler: Fallen, Laser und Wandbisse sieht und spürt jeder Spieler, die Monster sind die des Hosts.
   ========================================================= */
const SZ={on:false,fx:[],jaws:[],eyes:[],hands:[],drops:[],cols:[],t:0,beat:0,uT:{value:0}};
// ---------- Aufbau der Ebene (lokale Koordinaten, Mitte = Ebenenmitte, Norden = -z) ----------
const SZD={W:440,PAD:1.5,
  S:[// [ax,az,bx,bz,r0,r1,Höhe,Gebiet]
    [0,162,0,162,13,13,9,'rachen'],[0,150,0,112,6,5,7,'roehre'],[0,112,-6,96,5.5,10,9,'magen'],
    [-12,72,-12,72,34,34,22,'magen'],[22,52,22,52,24,24,16,'magen'],
    [-38,90,-60,108,3.4,3.2,5,'magen'],[-64,112,-64,112,7,7,6,'magen'],
    [36,36,62,22,4.4,3.4,5,'pfoertner'],
    [62,22,92,14,6.5,6.5,8,'darm'],[92,14,112,-8,6.5,6.5,8,'darm'],[112,-8,104,-34,6.5,6.5,8,'darm'],[104,-34,76,-36,6.5,6.5,8,'darm'],
    [76,-36,56,-54,6.5,6.5,8,'darm'],[56,-54,64,-80,6.5,6.5,8,'darm'],[64,-80,94,-88,5,5,7,'darm'],[94,-88,122,-78,6.5,6.5,8,'darm'],
    [112,-8,138,0,3.2,3.2,5,'darm'],[146,2,146,2,7.5,7.5,7,'darm'],
    [122,-78,128,-92,6,8,10,'herz'],[132,-112,132,-112,24,24,20,'herz'],
    [118,-128,90,-150,4.8,4.8,6,'ader'],[90,-150,56,-160,4.6,4.6,6,'ader'],[56,-160,22,-160,4.6,4.6,6,'ader'],
    [22,-160,10,-158,5,8,9,'hirn'],[-14,-156,-14,-156,36,36,26,'hirn'],[-14,-186,-14,-206,4.2,4.2,6,'hirn']],
  // Höhenpunkte des Bodens [x,z,h]
  HP:[[0,162,0],[0,120,-1],[-12,72,-2.5],[22,52,-2],[50,30,-.5],[92,14,1.5],[112,-8,3],[104,-34,1],[76,-36,-1],[56,-54,0],[64,-80,2.5],[94,-88,1],[122,-78,0],
    [132,-112,0],[90,-150,2],[56,-160,3.5],[24,-160,4],[-14,-156,4],[-14,-200,4],[-64,112,-2],[146,2,3]],
  L:[[-22,66,13],[24,58,7],[132,-112,11],[104,-30,4]],// Blutseen [x,z,r]
  J:[[0,140,0,124,5.6],[42,33,58,24,4],[70,-82,88,-86,5],[52,-160,34,-160,4.6]],// Gebisse in Engstellen [ax,az,bx,bz,r]
  CH:[[-12,72,34,'magen'],[22,52,24,'magen'],[132,-112,24,'herz']],// Kammern, deren Wand zubeißen kann
  BR:{x:-14,z:-156,R:36},HEART:{x:132,z:-112,r:5.5},EXIT:{x:0,z:168},ARR:{x:0,z:158},UP:{x:-14,z:-203},SEAL:-195};
const SZ_AREA={rachen:'Der Rachen',roehre:'Die Speiseröhre',magen:'Der Magen',pfoertner:'Der Pförtner',darm:'Das Gedärm',herz:'Die Herzkammer',ader:'Die Halsschlagader',hirn:'Die Hirnkammer'};
function szSeg(x,z,s){const ax=s[0],az=s[1],bx=s[2],bz=s[3],dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz,t=L2>0?clamp(((x-ax)*dx+(z-az)*dz)/L2,0,1):0;return[Math.hypot(x-ax-dx*t,z-az-dz*t)-(s[4]+(s[5]-s[4])*t),t];}
// kleinste Entfernung zur Wand (negativ = innen) und die gemischte Form an dieser Stelle
function szSdf(x,z){let b=1e9;for(const s of SZD.S){const d=szSeg(x,z,s)[0];if(d<b)b=d;}return b;}
function szInfo(x,z){let b=1e9,bi=0,wH=0,wR=0,wS=0;const ds=[];for(let i=0;i<SZD.S.length;i++){const s=SZD.S[i],[d,t]=szSeg(x,z,s);ds.push([d,t]);if(d<b){b=d;bi=i;}}
  for(let i=0;i<SZD.S.length;i++){const[d,t]=ds[i];if(d>b+5)continue;const w=Math.exp(-(d-b)*.9),s=SZD.S[i];wH+=w*s[6];wR+=w*(s[4]+(s[5]-s[4])*t);wS+=w;}return{s:b,H:wH/wS,r:wR/wS,a:SZD.S[bi][7]};}
function szBase(x,z,s){let wn=0,wd=0;for(const[px,pz,h]of SZD.HP){const d2=(x-px)**2+(z-pz)**2+60;const w=1/(d2*d2);wn+=w*h;wd+=w;}let h=wn/wd+fbm(x*.04+11,z*.04,3,s)*1.4-.7+vnoise(x*.3,z*.3,s+3)*.18;
  for(const[lx,lz,lr]of SZD.L){const d=Math.hypot(x-lx,z-lz);if(d<lr+3)h-=2.4*smooth(clamp((lr+3-d)/(lr*.8+2),0,1));}return h;}
function szLakeY(i,s){const[lx,lz]=SZD.L[i];let wn=0,wd=0;for(const[px,pz,h]of SZD.HP){const d2=(lx-px)**2+(lz-pz)**2+60;const w=1/(d2*d2);wn+=w*h;wd+=w;}return wn/wd-1.05;}
function szT(x,z){const G=SZ.g;if(!G)return null;const fx=(x-G.ox)/G.c,fz=(z-G.oz)/G.c,i=Math.floor(fx),j=Math.floor(fz);if(i<0||j<0||i>=G.n-1||j>=G.n-1)return null;const u=fx-i,v=fz-j,n=G.n,H=G.f,k=j*n+i;
  return DG_Y+(H[k]*(1-u)+H[k+1]*u)*(1-v)+(H[k+n]*(1-u)+H[k+n+1]*u)*v;}
function szCeil(x,z){const G=SZ.g;if(!G)return null;const i=clamp(Math.round((x-G.ox)/G.c),0,G.n-1),j=clamp(Math.round((z-G.oz)/G.c),0,G.n-1);return DG_Y+G.cl[j*G.n+i];}
// ---------- Bilder ----------
function szFleshTex(){const S=64,p=new Px(S,S),F=pal(['#5a1018','#7c1c26','#9c2e36','#b8484a','#d06a66','#e8958a']);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const n=vnoise(x*.12,y*.12,301)*.5+vnoise(x*.3,y*.3,302)*.3,v=Math.abs(Math.sin((x*.21+vnoise(x*.08,y*.08,303)*7)+y*.05));let L=.45+n*.45;
    if(v<.08)L-=.35;else if(v<.16)L-=.15;if(hash2(x,y,304)<.02)L+=.35;p.set(x,y,F[shadeIdx(L,F.length,x,y)]);}
  const t=new THREE.CanvasTexture(p.done());t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapLinearFilter;return t;}
function szEye(p,x0,y0,r,o){const S=pal(['#a89a8a','#d8ccbc','#f4ece0']),I=pal(o.iris||['#2a3a0a','#4a6a12','#7aa020','#b8d840']),SK=pal(['#5a1018','#8a2230','#b0404a']);
  for(let y=Math.floor(y0-r);y<=y0+r;y++)for(let x=Math.floor(x0-r);x<=x0+r;x++){const dx=(x-x0)/r,dy=(y-y0)/(r*.82);const q=dx*dx+dy*dy;if(q>1)continue;
    if(o.closed){p.set(x,y,SK[shadeIdx(.75-dy*.4,3,x,y)]);if(Math.abs(dy)<.18)p.set(x,y,hex('#2a0608'));continue;}
    const id=Math.hypot(x-x0-(o.lx||0),y-y0-(o.ly||0));let c=S[shadeIdx(.8-dy*.25-q*.2,3,x,y)];if(hash2(x,y,311)<.06&&q>.3)c=hex('#c8303a');
    if(id<r*.55){c=I[shadeIdx(.9-id/(r*.55)*.6+(o.glow?.3:0),I.length,x,y)];}
    if(o.slit?(Math.abs(x-x0-(o.lx||0))<Math.max(1,r*.12)&&Math.abs(y-y0-(o.ly||0))<r*.48):id<r*.24)c=o.glow?hex('#fff0c0'):hex('#0a0204');p.set(x,y,c);}
  if(!o.closed){p.set(x0-r*.3,y0-r*.35,hex('#ffffff'));if(r>3)p.set(x0-r*.3+1,y0-r*.35,hex('#ffffff'));}}
function szLimb(p,x0,y0,x1,y1,w,pl){const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L,n=Math.ceil(L*2);for(let t=0;t<=n;t++){const q=t/n,X=x0+(x1-x0)*q,Y=y0+(y1-y0)*q;for(let o=-w/2;o<=w/2;o+=.5)p.set(X+nx*o,Y+ny*o,pl[shadeIdx(.62-o/w*.5+(hash2(Math.round(X),Math.round(Y),321)-.5)*.2,pl.length,Math.round(X+nx*o),Math.round(Y+ny*o))]);}}
function szHand(p,x,y,a,pl,open){const dx=Math.cos(a),dy=Math.sin(a);for(let yy=-3;yy<=3;yy++)for(let xx=-3;xx<=3;xx++)if(xx*xx+yy*yy<=9)p.set(x+xx,y+yy,pl[shadeIdx(.6-yy*.08,pl.length,x+xx,y+yy)]);
  for(let k=-2;k<=2;k++){const fa=a+k*(open?.38:.2),L=open?6:4;szLimb(p,x+Math.cos(fa)*2,y+Math.sin(fa)*2,x+Math.cos(fa)*(2+L),y+Math.sin(fa)*(2+L)+(open?0:1.5),1.4,pl);}}
// Abszess: k = a (Auge), h (Hände), l (Beine), m (Maul); f = 0, b (blinzeln), a (Angriff)
function szAbs(k,f){const W=56,H=56,p=new Px(W,H),cx=28,F=pal(['#4a0c12','#6e161e','#94262e','#b6404a','#d26a6a','#eaa09a']),SK=pal(['#7a3a32','#a8604e','#cc8a70','#e8b496']),cl=f==='b',at=f==='a';
  const blob=(x0,y0,rx,ry)=>{for(let y=Math.floor(y0-ry);y<=y0+ry;y++)for(let x=Math.floor(x0-rx);x<=x0+rx;x++){const dx=(x-x0)/rx,dy=(y-y0)/ry,q=dx*dx+dy*dy;if(q>1+(hash2(x>>1,y>>1,331)-.5)*.25)continue;
    let L=.82-dy*.32-dx*.18-q*.15+(hash2(x>>1,y>>1,332)-.5)*.14;if(hash2(x,y,333)<.03)L+=.3;const v=Math.abs(Math.sin(x*.5+vnoise(x*.2,y*.2,334)*5+y*.15));if(v<.07)L-=.3;p.set(x,y,F[shadeIdx(L,F.length,x,y)]);}};
  // Gliedmaßen hinter dem Körper
  if(k==='h'){const A=at?[[12,30,2,6,-2.2],[44,30,54,6,-.9]]:[[12,32,4,16,-2.3],[44,30,52,14,-.8]];for(const[x0,y0,x1,y1,a]of A){szLimb(p,x0,y0,x1,y1,4,SK);szHand(p,x1,y1,a,SK,at);}
    if(at){szLimb(p,28,26,28,4,3.5,SK);szHand(p,28,4,-1.57,SK,true);}}
  if(k==='l'){const legs=at?[[14,40,4,30,0,46],[42,38,54,32,55,32]]:[[14,40,4,28,2,46],[42,40,52,28,54,46]];for(const[x0,y0,kx,ky,fx,fy]of legs){szLimb(p,x0,y0,kx,ky,4.5,SK);szLimb(p,kx,ky,fx,fy,3.5,SK);for(let q=-2;q<=2;q++)p.set(fx+q,fy+1,hex('#3a1a12'));}}
  blob(cx,41,24,14);blob(cx,29,17,17);blob(cx-11,21,7,7);blob(cx+12,23,6,6);
  // Pusteln
  for(const[x,y,r]of[[12,38,2],[44,36,2.5],[20,47,1.5],[38,46,1.8]])for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r)p.set(x+xx,y+yy,hex(xx+yy<0?'#f0e090':'#c8b050'));
  if(k==='a'){const I=at?['#5a0a0a','#a01a10','#e05a1a','#ffd060']:null;szEye(p,cx,29,8,{closed:cl,iris:I,glow:at});for(const[x,y,r]of[[cx-11,19,3.2],[cx+12,21,3.5],[cx-15,33,2.5],[cx+15,33,2.6],[cx,12,3.4],[cx-5,42,2],[cx+6,43,2]])szEye(p,x,y,r,{closed:cl||(at&&r<3),lx:(hash2(x,y,335)-.5)*r*.6});
    if(at)for(let y=38;y<52;y++)if(hash2(y,3,336)<.6)p.set(cx+(hash2(y,4,337)-.5)*4,y,hex('#a8e040'));}
  if(k==='h'){szEye(p,cx,18,5,{closed:cl});szEye(p,cx-11,21,3,{closed:cl});szEye(p,cx+12,23,2.6,{closed:cl});szEye(p,cx+7,35,2.4,{closed:cl});}
  if(k==='l'){szEye(p,cx-5,16,4,{closed:cl});szEye(p,cx+7,19,3.4,{closed:cl});szEye(p,cx,30,2.6,{closed:cl});}
  if(k==='m'){const mh=at?14:8,mw=at?12:10;for(let y=34-mh;y<=34+mh;y++)for(let x=cx-mw;x<=cx+mw;x++){const dx=(x-cx)/mw,dy=(y-34)/mh;if(dx*dx+dy*dy>1)continue;p.set(x,y,hex(dy>.4?'#2a0406':'#5a0a10'));}
    for(let x=cx-mw+2;x<=cx+mw-2;x+=3){const ty=34-Math.sqrt(Math.max(0,1-((x-cx)/mw)**2))*mh;for(let q=0;q<4;q++)p.set(x+(q>2?1:0),ty+q,hex(q<3?'#f0e8c8':'#c8b890'));const by=68-ty;for(let q=0;q<4;q++)p.set(x,by-q,hex('#e8e0c0'));}
    szEye(p,cx-10,14,3.4,{closed:cl});szEye(p,cx+9,13,3,{closed:cl});szEye(p,cx,9,2.6,{closed:cl});}
  outline(p);return p.done();}
// Das Gehirn: f = 0, 1, b (Auge zu), c (lädt), l (Laser), a (Glieder), r (Wut)
function szBrain(f){const W=200,H=170,p=new Px(W,H),cx=100,B=pal(['#4a1c2a','#6e3044','#94485a','#b86a76','#d68c92','#eeb4b0']),SK=pal(['#5a2a2a','#7e4038','#a25c4c','#c47e66']),N=pal(['#7a3a3a','#a05a50','#c8806c']);
  const tw=f===1?2:f==='a'?0:f==='r'?3:0;
  // Glieder und Rückenmark (hinter dem Hirn)
  szLimb(p,cx,110,cx+tw,158,12,N);for(let y=114;y<158;y+=5)for(let x=-6;x<=6;x++)p.set(cx+x+tw,y,hex('#5a2a28'));
  const arms=f==='a'?[[62,104,34,76,24,52,-2.2],[138,104,166,76,176,52,-.9],[76,112,58,132,48,150,1.9],[124,112,142,132,152,150,1.2]]:f==='r'?[[62,104,30,96,18,84,-2.6],[138,104,170,96,182,84,-.5],[78,112,66,140,60,160,1.7],[122,112,134,140,140,160,1.4]]
    :[[62,104,50+tw,128,56,148,1.5],[138,104,150-tw,128,144,148,1.6],[80,112,74,138+tw,80,160,1.6],[120,112,126,138-tw,120,160,1.5]];
  arms.forEach(([x0,y0,kx,ky,hx,hy,a],i)=>{szLimb(p,x0,y0,kx,ky,i<2?6:5,SK);szLimb(p,kx,ky,hx,hy,i<2?5:4,SK);if(i<2)szHand(p,hx,hy,a,SK,f==='a'||f==='r');else for(let q=-3;q<=3;q++)p.set(hx+q,hy+1,hex('#3a1a12'));
    if(i===1)szEye(p,kx,ky,2.4,{closed:f==='b'});});
  // Hirnmasse mit Windungen
  for(let y=4;y<=118;y++)for(let x=8;x<=192;x++){const dx=(x-cx)/92,dy=(y-62)/(y<62?58:56),q=dx*dx+dy*dy;if(q>1+(hash2(x>>2,y>>2,341)-.5)*.06)continue;
    const fold=Math.abs(Math.sin(x*.075+vnoise(x*.045,y*.045,342)*5.5+(y*.05)*(x<cx?1:-1)));let L=.78-dy*.35-q*.2+(hash2(x>>1,y>>1,343)-.5)*.1;if(fold<.12)L-=.42;else if(fold<.25)L-=.16;else if(fold>.9)L+=.1;
    if(Math.abs(x-cx)<1.5&&y<70)L=.05;if(f==='r'&&fold<.12)L-=.1;p.set(x,y,B[shadeIdx(L,B.length,x,y)]);}
  for(let k=0;k<40;k++){const x=20+hash2(k,1,344)*160,y=10+hash2(k,2,345)*95;const dx=(x-cx)/92,dy=(y-62)/58;if(dx*dx+dy*dy>.85)continue;p.set(x,y,hex('#ff6a6a'));}
  // Das große Auge
  const I=f==='c'?['#6a0a0a','#c81a10','#ff6a2a','#ffe0a0']:f==='l'?['#a01a10','#ff4a1a','#ffc080','#ffffff']:['#3a0606','#7a120c','#c03a16','#f08a2a'];
  for(let y=68;y<=118;y++)for(let x=60;x<=140;x++){const dx=(x-cx)/38,dy=(y-93)/24;if(dx*dx+dy*dy>1)continue;p.set(x,y,hex(dx*dx+dy*dy>.86?'#3a0c12':'#5a1418'));}
  szEye(p,cx,93,f==='l'||f==='r'?28:24,{closed:f==='b',iris:I,slit:true,glow:f==='c'||f==='l'});
  if(f==='c'||f==='l')for(let k=0;k<26;k++){const a=k/26*6.283,r0=f==='l'?32:28,r1=r0+(f==='l'?12:6)+hash2(k,5,346)*5;for(let r=r0;r<r1;r+=1)p.set(cx+Math.cos(a)*r,93+Math.sin(a)*r*.8,hex(f==='l'?'#ffd0a0':'#ff7a3a'));}
  outline(p);return p.done();}
function szIcon(){const p=new Px(16,16);szEye(p,8,8,7,{iris:['#3a0606','#7a120c','#c03a16','#f08a2a'],slit:true});for(let x=0;x<4;x++)p.set(13+x*.5,13+x*.4,hex('#a02030'));outline(p);return p.done();}
{const a=finaleSprites;finaleSprites=function(list){a(list);try{for(const k of['a','h','l','m'])for(const f of[0,'b','a'])list.push(['sz'+k+'_'+f,szAbs(k,f)]);for(const f of[0,1,'b','c','l','a','r'])list.push(['szb_'+f,szBrain(f)]);}catch(e){console.error('Schlund: Bilder',e);}};}
{const a=craftSprites;craftSprites=function(list){a(list);try{list.push(['szeyeball',szIcon()]);}catch(e){}};}
ITEMS.szeyeball={name:'Auge des Gehirns',plural:'Augen des Gehirns'};ITEM_DESC.szeyeball='Es blinzelt noch manchmal. Trophäenhändler zahlen viel dafür.';
try{SHOPS['Trophäenhändler Silas'].sell.push(['szeyeball',1800]);}catch(e){}
Object.assign(DT,{
  sza:{name:'Augenbeule',fac:'demon',h:2.3,hp:150,dmg:10,spd:0,reach:1.4,cd:2.4,spr:'sza_',xp:45,aggro:18,leash:40,rad:.95,spit:15,loot:[['silver',2,.6],['copper',14,.7]]},
  szh:{name:'Händebeule',fac:'demon',h:2.5,hp:210,dmg:14,spd:0,reach:2.8,cd:1.9,spr:'szh_',xp:55,aggro:14,leash:40,rad:1,loot:[['silver',3,.6],['bones',2,.4]]},
  szl:{name:'Beinbeule',fac:'demon',h:2.5,hp:230,dmg:16,spd:0,reach:2.6,cd:2.1,spr:'szl_',xp:55,aggro:14,leash:40,rad:1,loot:[['silver',3,.6],['bones',2,.4]]},
  szm:{name:'Schlundmaul',fac:'demon',h:2.7,hp:270,dmg:20,spd:0,reach:2.3,cd:2.3,spr:'szm_',xp:65,aggro:14,leash:40,rad:1.05,loot:[['silver',4,.7],['hpot',1,.15]]},
  szbrain:{name:'Das Gehirn',fac:'demon',boss:1,h:11,hp:15000,dmg:24,spd:0,reach:6,cd:2,spr:'szb_',xp:6000,rad:3.6,aggro:60,leash:999,tint:1.05,
    loot:[['coin',10,1],['silver',120,1],['platin',1,1],['hpot2',3,1],['starshard',2,1],['szeyeball',1,1]]}});
// ---------- Stoffe ----------
let SZM=null;function szMats(){if(SZM)return SZM;const tex=szFleshTex();
  const mk=(amp,shin)=>{const m=new THREE.MeshPhongMaterial({map:tex,vertexColors:true,shininess:shin,specular:0x6a3030,side:THREE.DoubleSide});
    m.onBeforeCompile=sh=>{sh.uniforms.uT=SZ.uT;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uT;varying vec3 vWP;varying vec3 vWN;')
      .replace('#include <begin_vertex>',`#include <begin_vertex>\ntransformed+=objectNormal*sin(uT*1.7+position.x*.33+position.z*.27)*${amp};`)
      .replace('#include <project_vertex>','#include <project_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
      sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;').replace('#include <map_fragment>',
        'vec3 bw=pow(abs(vWN),vec3(6.0));bw/=(bw.x+bw.y+bw.z+1e-4);vec3 t1=texture2D(map,vWP.zy*.22).rgb*bw.x+texture2D(map,vWP.xz*.22).rgb*bw.y+texture2D(map,vWP.xy*.22).rgb*bw.z;vec4 texelColor=mapTexelToLinear(vec4(t1*1.12,1.0));diffuseColor*=texelColor;');};return m;};
  SZM={floor:mk('.05',38),ceil:mk('.22',22),blood:new THREE.MeshPhongMaterial({color:0x5a0608,transparent:true,opacity:.86,shininess:90,specular:0xc06060,depthWrite:false}),
    tooth:new THREE.MeshLambertMaterial({color:0xece0c0}),bone:new THREE.MeshLambertMaterial({color:0xd8ccb0}),white:new THREE.MeshLambertMaterial({color:0xf0e8dc}),
    iris:new THREE.MeshBasicMaterial({color:0xc8a020}),pupil:new THREE.MeshBasicMaterial({color:0x080204}),skin:new THREE.MeshLambertMaterial({color:0xb86a5a}),heart:new THREE.MeshPhongMaterial({color:0xa8202a,emissive:0x3a0408,shininess:60,specular:0xa04040}),ridge:new THREE.MeshPhongMaterial({color:0x9a3a3c,shininess:30,specular:0x502020}),
    vein:new THREE.MeshPhongMaterial({color:0x8a2a48,emissive:0x1a0408,shininess:40}),drop:new THREE.MeshBasicMaterial({color:0x8a0a0e}),laser:new THREE.MeshBasicMaterial({color:0xff3a1a,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}),
    aim:new THREE.MeshBasicMaterial({color:0xff2a1a,transparent:true,opacity:.28,depthWrite:false}),glowR:new THREE.MeshBasicMaterial({color:0xff6a3a,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide}),
    seal:new THREE.MeshBasicMaterial({color:0xc85a6a,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false})};return SZM;}
// ---------- Bau ----------
function szBuild(K){const X=K.X,Z=K.Z,Y=DG_Y,s=((WSEED|0)^0x5c41)>>>0,M=szMats(),grp=K.grp,R=mulberry32(s+7),hw=SZD.W/2;
  Object.assign(SZ,{on:true,X,Z,fx:[],jaws:[],eyes:[],hands:[],drops:[],cols:[],t:0,beat:0,lights:[],won:false,dripT:0,biteT:6});
  // Raster: Boden f, Decke cl (Höhen relativ zu DG_Y)
  const c=1.6,n=Math.ceil(SZD.W/c)+1,ox=X-hw,oz=Z-hw,F=new Float32Array(n*n),CL=new Float32Array(n*n),SD=new Float32Array(n*n),AR=[];
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const lx=-hw+i*c,lz=-hw+j*c,k=j*n+i,I=szInfo(lx,lz),b=szBase(lx,lz,s);SD[k]=I.s;AR[k]=I.a;
    if(I.s>0){F[k]=b+30;CL[k]=b+2.2;continue;}const dp=-I.s;let f=b;if(dp<2.6)f+=(2.6-dp)**2*.45;
    const hc=b+2.8+(I.H-2.8)*Math.sqrt(clamp(dp/(I.r*.8),0,1))+vnoise(lx*.15,lz*.15,s+9)*1.2;F[k]=Math.min(f,hc-.4);CL[k]=hc;}
  SZ.g={n,c,ox,oz,f:F,cl:CL};
  // Farben je Gebiet
  const TINT={rachen:[.66,.34,.34],roehre:[.7,.38,.36],magen:[.74,.42,.34],pfoertner:[.66,.32,.32],darm:[.78,.5,.42],herz:[.6,.2,.22],ader:[.62,.24,.26],hirn:[.58,.42,.52]};
  const mesh=(H,isC)=>{const pos=new Float32Array(n*n*3),col=new Float32Array(n*n*3);for(let j=0;j<n;j++)for(let i=0;i<n;i++){const k=j*n+i,lx=-hw+i*c,lz=-hw+j*c;pos[k*3]=X+lx;pos[k*3+1]=Y+H[k];pos[k*3+2]=Z+lz;
      const T=TINT[AR[k]]||TINT.magen,v=.82+.3*vnoise(lx*.2,lz*.2,s+11),vein=Math.abs(Math.sin(lx*.31+vnoise(lx*.07,lz*.07,s+12)*6+lz*.19));let r=T[0]*v,g=T[1]*v,b=T[2]*v;
      const rg=Math.sin(lx*.55+vnoise(lx*.05,lz*.05,s+14)*9)*Math.sin(lz*.48+vnoise(lz*.05,lx*.05,s+15)*9);if(rg<-.45){const q=(-.45-rg)*1.6;r*=1-q*.45;g*=1-q*.5;b*=1-q*.45;}if(vein<.06){r*=.55;g*=.4;b*=.5;}if(!isC){const muc=vnoise(lx*.11,lz*.11,s+13);if(muc>.62&&SD[k]<-2){const q=(muc-.62)*2.2;r+=(.78-r)*q;g+=(.72-g)*q;b+=(.4-b)*q;}}else{r*=.72;g*=.66;b*=.7;}
      col[k*3]=r;col[k*3+1]=g;col[k*3+2]=b;}
    const idx=[];for(let j=0;j<n-1;j++)for(let i=0;i<n-1;i++){const a=j*n+i,b=a+1,cc=a+n,e=cc+1;if(Math.min(SD[a],SD[b],SD[cc],SD[e])>.5)continue;if(isC)idx.push(a,b,cc,b,e,cc);else idx.push(a,cc,b,b,cc,e);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx),1));g.computeVertexNormals();
    const m=new THREE.Mesh(g,isC?M.ceil:M.floor);m.frustumCulled=false;grp.add(m);return m;};
  mesh(F,false);mesh(CL,true);
  // Blutseen
  SZ.lakes=SZD.L.map(([lx,lz,lr],i)=>{const y=Y+szLakeY(i,s),m=new THREE.Mesh(new THREE.CircleGeometry(lr+3.5,40),M.blood);m.rotation.x=-Math.PI/2;m.position.set(X+lx,y,Z+lz);m.renderOrder=2;grp.add(m);return{x:X+lx,z:Z+lz,r:lr+3,y,m};});
  // Licht: dunkles Rot, pulsierende Lichter in den Kammern
  const amb=new THREE.AmbientLight(0x6a2020,.42);grp.add(amb);SZ.amb=amb;
  for(const[lx,lz,col,int]of[[0,160,0xff7050,.9],[-12,72,0xff5040,1.1],[22,52,0xff6040,.8],[100,-20,0xff8060,.9],[146,-100,0xff3020,1.5],[60,-158,0xff5040,.8],[-14,-156,0xc070ff,1.2]]){const l=new THREE.PointLight(col,int,70,1.2);l.position.set(X+lx,Y+(szBase(lx,lz,s))+9,Z+lz);grp.add(l);SZ.lights.push({l,b:int});}
  // Herz in der Herzkammer
  {const Hh=SZD.HEART,hx=X+Hh.x,hz=Z+Hh.z,hy=Y+szBase(Hh.x,Hh.z,s)-1,g=new THREE.Group();g.position.set(hx,hy,hz);
    for(const[x,y,z,r]of[[0,4.2,0,4.6],[-2.2,6.4,.6,3],[2.4,6,-.4,3.2],[0,2,0,3.4],[1.2,7.8,1.4,1.8]]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),M.heart);m.position.set(x,y,z);g.add(m);}
    for(const[a,len]of[[.2,20],[2.4,18],[4.3,22]]){const v=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.4,len,8),M.vein);v.position.set(Math.cos(a)*2,8+len/2-2,Math.sin(a)*2);v.rotation.z=Math.cos(a)*.25;v.rotation.x=Math.sin(a)*.25;g.add(v);}
    grp.add(g);SZ.heart=g;SZ.cols.push({x:hx,z:hz,r:Hh.r});}
  // Rippenbögen über der Halsschlagader, Ringwülste in der Speiseröhre
  const arch=(ax,az,bx,bz,step,rad,mat,thick)=>{const L=Math.hypot(bx-ax,bz-az),ang=Math.atan2(bx-ax,bz-az);for(let d=2;d<L-1;d+=step){const lx=ax+(bx-ax)*d/L,lz=az+(bz-az)*d/L,y=Y+szBase(lx,lz,s)-.4;
      const t=new THREE.Mesh(new THREE.TorusGeometry(rad,thick,6,18,Math.PI),mat);t.position.set(X+lx,y,Z+lz);t.rotation.y=ang;grp.add(t);}};
  arch(90,-150,56,-160,4,4.4,M.bone,.32);arch(118,-128,90,-150,5,4.6,M.bone,.3);arch(0,150,0,114,3,5.2,M.ridge,.55);
  // Pusteln am Boden (viele kleine Kugeln)
  {const geo=new THREE.SphereGeometry(1,10,8),N=170,im=new THREE.InstancedMesh(geo,new THREE.MeshPhongMaterial({shininess:60,specular:0x806040}),N),mt=new THREE.Matrix4(),q=new THREE.Quaternion(),cc=new THREE.Color();let k=0;
    for(let t=0;t<4000&&k<N;t++){const lx=(R()-.5)*SZD.W,lz=(R()-.5)*SZD.W,sd=szSdf(lx,lz);if(sd>-1.9||sd<-6)continue;const r=.3+R()*.8,y=Y+szBase(lx,lz,s)+(sd>-2.6?(2.6+sd)**2*.45:0);
      mt.compose(new THREE.Vector3(X+lx,y,Z+lz),q,new THREE.Vector3(r,r*(.6+R()*.4),r));im.setMatrixAt(k,mt);cc.setRGB(.7+R()*.25,.45+R()*.35,.25+R()*.2);im.setColorAt(k,cc);k++;}
    im.count=k;grp.add(im);}
  // Augen in den Wänden: folgen dir und blinzeln
  for(let t=0;t<20000&&SZ.eyes.length<70;t++){const lx=(R()-.5)*SZD.W,lz=(R()-.5)*SZD.W,sd=szSdf(lx,lz);if(sd>-.3||sd<-1.1)continue;const fy=szT(X+lx,Z+lz);if(fy==null)continue;
    const r=.3+R()*.8,g=new THREE.Group(),w=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),M.white),ir=new THREE.Mesh(new THREE.CircleGeometry(r*.5,14),R()<.7?M.iris:M.laser),pu=new THREE.Mesh(new THREE.CircleGeometry(r*.24,10),M.pupil);
    ir.position.z=r*.98;pu.position.z=r*1.0;g.add(w,ir,pu);g.position.set(X+lx,fy+.2+R()*1.6,Z+lz);grp.add(g);SZ.eyes.push({g,bl:R()*6,bt:0});}
  // Finger, die aus der Wand tasten
  for(let t=0;t<20000&&SZ.hands.length<26;t++){const lx=(R()-.5)*SZD.W,lz=(R()-.5)*SZD.W,sd=szSdf(lx,lz);if(sd>-.6||sd<-1.1)continue;const fy=szT(X+lx,Z+lz);if(fy==null)continue;
    const g=new THREE.Group(),fs=[];for(let k=0;k<5;k++){const f=new THREE.Group(),seg=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,.7,6),M.skin);seg.position.y=.35;f.add(seg);f.position.set((k-2)*.16,0,0);f.rotation.z=(k-2)*.22;g.add(f);fs.push(f);}
    const palm=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),M.skin);palm.scale.set(1.3,.6,1);g.add(palm);const a=Math.atan2(-(lz-0),-(lx-0));g.position.set(X+lx,fy+.6+R()*1.2,Z+lz);g.rotation.set((R()-.5)*1.2,R()*6.28,(R()-.5)*1.2);grp.add(g);SZ.hands.push({g,fs,ph:R()*6});}
  // Gebisse in den Engstellen
  SZD.J.forEach(([ax,az,bx,bz,r],i)=>{const L=Math.hypot(bx-ax,bz-az),dx=(bx-ax)/L,dz=(bz-az)/L,teeth=[];
    for(let d=.6;d<L;d+=1.1)for(const sd of[-1,1])for(const hy of[.7,1.9]){const px=ax+dx*d,pz=az+dz*d,nx=-dz*sd,nz=dx*sd,wx=px+nx*(r-.4),wz=pz+nz*(r-.4),fy=szT(X+wx,Z+wz);
      const m=new THREE.Mesh(new THREE.ConeGeometry(.32,1.7,6),M.tooth);m.rotation.set(0,0,0);const dir=new THREE.Vector3(-nx,0,-nz);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);grp.add(m);
      teeth.push({m,wx:X+wx,wz:Z+wz,y:(fy==null?Y:szT(X+px,Z+pz))+hy,nx:-nx,nz:-nz,reach:r-.5});}
    SZ.jaws.push({i,ax:X+ax,az:Z+az,bx:X+bx,bz:Z+bz,r,dx,dz,L,teeth,st:'idle',t:0,w:2+R()*2,hit:0});});
  // Kisten in den Seitentaschen
  for(const[lx,lz,key]of[[-66,114,'sz1'],[148,3,'sz2']]){const st=DGX.d.st;if(st.ch&&st.ch[key])continue;const ch=K.chest(lx,lz,key,false),y=szT(X+lx,Z+lz);if(y!=null){ch.g.position.y=y;ch.y=y;ch.s.y0=y;ch.s.y1=y+.95;}}
  // Ankunft (Rückweg in die Stadt)
  {const E=SZD.EXIT,ex=X+E.x,ez=Z+E.z,ey=szT(ex,ez);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.6,.8,10,24),M.ceil);ring.position.set(ex,ey+2.8,ez);grp.add(ring);
    const lm=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),new THREE.MeshBasicMaterial({color:0xfff0e0,transparent:true,opacity:.85,side:THREE.DoubleSide,fog:false}));lm.position.set(ex,ey+2.8,ez+.1);grp.add(lm);
    DGX.exit={x:ex,z:ez-1.2};SZ.arrive={x:X+SZD.ARR.x,z:Z+SZD.ARR.z};}
  // Hirnkammer: Nervenstränge, Membran vor dem Ausgang, das Gehirn
  {const B=SZD.BR,bx=X+B.x,bz=Z+B.z,by=szT(bx,bz),cy=szCeil(bx,bz);for(let k=0;k<7;k++){const a=k/7*6.283,r=3+R()*2,top=cy-1,len=top-(by+12);const v=new THREE.Mesh(new THREE.CylinderGeometry(.35,.6,len,6),M.vein);v.position.set(bx+Math.cos(a)*r,by+12+len/2,bz+Math.sin(a)*r);v.rotation.z=(R()-.5)*.3;grp.add(v);}
    const U=SZD.UP,ux=X+U.x,uz=Z+U.z,uy=szT(ux,uz),sy=szT(ux,Z+SZD.SEAL);const seal=new THREE.Mesh(new THREE.CircleGeometry(4.6,24),M.seal.clone());seal.position.set(ux,sy+3,Z+SZD.SEAL);grp.add(seal);
    const sS=solAdd({x:ux,z:Z+SZD.SEAL,hw:4.6,hd:.5,y0:DG_Y-20,y1:sy+12,rot:0,solid:1,dg:1});DGX.sol.push(sS);
    const lm=new THREE.Mesh(new THREE.CircleGeometry(2,20),new THREE.MeshBasicMaterial({color:0xffe8f0,transparent:true,opacity:.8,side:THREE.DoubleSide,fog:false}));lm.position.set(ux,uy+2.4,uz-1.5);grp.add(lm);
    const b=spawnEnt('szbrain',bx,bz,{home:{x:bx,z:bz},cmd:1,noLeash:true,always:true});b.y=by;b.yo=2.6;b.dormant=true;b.showDormant=true;b.wakeR=27;b.twBoss=1;b.frame='b';b.special=szBrainAI;DGX.ents.push(b);SZ.boss=b;SZ.cols.push({x:bx,z:bz,r:2.6});
    DGX.tw={seal,sS,up:{x:ux,z:uz},open:false,boss:b,lvl:4,t:0};
    if(!DGX.d.st.loot){const ch=K.chest(-14,-176,'boss',true),y=szT(X-14,Z-176);if(y!=null){ch.g.position.y=y;ch.y=y;ch.s.y0=y;ch.s.y1=y+.95;}}}
  szPopulate(R);}
// Abszesse verteilen
function szSpot(R,cx,cz,rad,minS){for(let t=0;t<80;t++){const a=R()*6.283,d=Math.sqrt(R())*rad,lx=cx+Math.cos(a)*d,lz=cz+Math.sin(a)*d;if(szSdf(lx,lz)>-(minS||3.2))continue;if(SZD.L.some(([x,z,r])=>Math.hypot(lx-x,lz-z)<r+1.5))continue;return[lx,lz];}return null;}
function szAbsSpawn(t,x,z,o){if(!DT[t])return null;const e=spawnEnt(t,x,z,Object.assign({home:{x,z},cmd:1,aggroT:0},o||{}));if(!e)return null;e.special=szAbsAI;e.bob=Math.random()*6;e.ab='hid';e.rise=.24;e.inv=true;e.y=szT(x,z)||DG_Y;e.szk=1;DGX.ents.push(e);return e;}
function szPopulate(R){const X=SZ.X,Z=SZ.Z,T=['sza','sza','szh','szl','szm'];
  const put=(cx,cz,rad,n,types)=>{for(let k=0;k<n;k++){const p=szSpot(R,cx,cz,rad);if(!p)continue;const ty=(types||T)[(R()*(types||T).length)|0];szAbsSpawn(ty,X+p[0],Z+p[1]);}};
  put(0,150,8,2,['sza','szh']);put(-12,72,30,7);put(22,52,20,4);put(-64,112,5,2,['szm','szh']);put(62,22,2,1,['szm']);
  for(const[x,z]of[[92,14],[112,-8],[104,-34],[76,-36],[56,-54],[64,-80],[94,-88],[122,-78]])put(x,z,4,1.4>R()*2?2:1);put(146,2,5,3,['szm','szl','sza']);
  put(132,-112,21,5);put(90,-150,2,1,['sza']);put(56,-160,2,1,['szh']);}
// ---------- Abszess-Verhalten ----------
function szAbsAI(e,dt){const d=e.d;e.noPath=1;e.cd3=(e.cd3||0)-dt;if(e.ab==null){e.ab='hid';e.rise=.24;e.inv=true;}
  const t=e.tgt;let dist=99,tx=e.x,ty=e.y,tz=e.z;if(t){[tx,ty,tz]=tPos(t);dist=Math.hypot(tx-e.x,tz-e.z);if(Math.abs(ty-e.y)>5)dist=99;}
  const blink=()=>Math.sin(time*.9+e.bob*3)>.94?'b':0;
  if(e.ab==='hid'){e.inv=true;e.rise=.24+Math.sin(time*1.6+e.bob)*.03;e.frame=blink();e.reT=(e.reT||0)-dt;if(t&&dist<(e.wakeD||8.5)&&e.reT<=0){e.ab='rise';try{Snd.splat();}catch(_){}}return true;}
  if(e.ab==='rise'){e.rise=Math.min(1,(e.rise||0)+dt/.9);e.frame=0;if(Math.random()<dt*30)spawnParticle(e.x+(Math.random()-.5)*1.6,e.y+.2,e.z+(Math.random()-.5)*1.6,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,Math.random()<.5?0x8a1018:0xc8b050,.5,.3);
    if(e.rise>=1){e.rise=null;e.ab='up';e.inv=false;e.upT=0;e.cd3=Math.max(e.cd3,.6);}return true;}
  if(e.ab==='sink'){e.rise=Math.max(0,(e.rise==null?1:e.rise)-dt/.8);e.inv=true;e.frame='b';if(Math.random()<dt*25)spawnParticle(e.x+(Math.random()-.5)*1.6,e.y+.2,e.z+(Math.random()-.5)*1.6,0,1.5,0,0x8a1018,.5,.3);
    if(e.rise<=0){const H=e.home;for(let k=0;k<30;k++){const a=Math.random()*6.283,r=3+Math.random()*7,x=H.x+Math.cos(a)*r,z=H.z+Math.sin(a)*r;if(szSdf(x-SZ.X,z-SZ.Z)<-3&&!DEM.some(o=>o!==e&&o.szk&&!o.dead&&Math.hypot(o.x-x,o.z-z)<2.2)){e.x=x;e.z=z;break;}}
      e.ab='hid';e.reT=1.4+Math.random()*2;e.rise=.24;}return true;}
  e.upT=(e.upT||0)+dt;
  if(!t||dist>18){e.awayT=(e.awayT||0)+dt;e.frame=blink();if(e.awayT>3.5){e.ab='sink';e.awayT=0;}return true;}e.awayT=0;
  if(e.hp<e.max*.7&&e.upT>7&&!(e.wind>0)&&Math.random()<dt*.15){e.ab='sink';e.upT=0;return true;}
  if(e.wind>0){e.wind-=dt;e.frame='a';if(e.wind<=0){const loc=t==='player'||MPV.on;
      if(e.atkK==='spit'){shoot(e,tx,ty+1,tz,{spd:15,dmg:d.dmg,orb:'orb_poison',col:0xa8e040,size:.6,life:3,sy:.62});try{Snd.splat();}catch(_){}}
      else if(dist<d.reach+.9){meleeHit(e,t,d.dmg);if(loc){const l=Math.hypot(P.x-e.x,P.z-e.z)||1;
          if(e.type==='szh'){P.slowT=Math.max(P.slowT||0,1.6);}
          else if(e.type==='szl'){P.vx+=(P.x-e.x)/l*9;P.vz+=(P.z-e.z)/l*9;P.vy=Math.max(P.vy,4.5);}
          else if(e.type==='szm'){P.poisonT=Math.max(P.poisonT||0,4);try{Snd.bite();}catch(_){}}}}}return true;}
  if(d.spit){if(dist<d.spit&&e.cd3<=0){e.cd3=d.cd*(.8+Math.random()*.4);e.wind=.6;e.atkK='spit';}}
  else if(dist<d.reach+.6&&e.cd3<=0){e.cd3=d.cd*(.8+Math.random()*.4);e.wind=.45;e.atkK='melee';}
  e.frame=blink();return true;}
// Tote Abszesse sacken in den Boden statt umzukippen
{const a=killEnt;killEnt=function(e,by){const r=a(e,by);try{if(e&&(e.szk||e.type==='szbrain'))e.fallDir=0;}catch(_){}return r;};}
// ---------- Schaden für alle Spieler ----------
function szHurt(n,kx,kz,up){if(state!=='playing'&&state!=='dialog')return;takeDamage(n);P.vx+=kx||0;P.vz+=kz||0;if(up)P.vy=Math.max(P.vy,up);}
function szHitPlayers(x,z,y,r,dmg,kb,up){const me=MPV.on?MPV.real:P,dm=Math.hypot(me.x-x,me.z-z);
  if(dm<r&&Math.abs(me.y-y)<4){if(MPV.on)MPV.hostD+=dmg;else szHurt(dmg,(me.x-x)/(dm||1)*kb,(me.z-z)/(dm||1)*kb,up);}
  if(MP.on&&MP.role==='host')for(const R of REMOTE.values()){if(time-R.seen>5)continue;const d=Math.hypot(R.x-x,R.z-z);if(d<r&&Math.abs(R.y-y)<4)try{mpBhit(R.pid,{n:dmg,kx:(R.x-x)/(d||1)*kb,kz:(R.z-z)/(d||1)*kb,vy:up||0});}catch(_){}}}
// ---------- Effekte (Laser, Spirale, Wandbiss, Gebiss) ----------
// Jeder Spieler spielt die Effekte selbst ab und prüft nur sich selbst. Der Host (oder wer allein ist) löst sie aus.
const szAuth=()=>!(isClient()&&mpHostHere());
function szFx(f){szFxStart(f);if(MP.on&&MP.role==='host'&&MP.ready)try{mpSend({t:'szfx',f});}catch(_){}}
function szFxStart(f){const M=szMats(),grp=DGX.grp;if(!grp||!SZ.on)return;f=Object.assign({},f,{t:0});
  if(f.k==='jaw'){const J=SZ.jaws[f.i];if(J){J.st='warn';J.t=0;J.hit=0;}return;}
  if(f.k==='laser'||f.k==='spiral'){const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.26,1,8,1,true),M.aim.clone());b.visible=false;grp.add(b);const ring=new THREE.Mesh(new THREE.RingGeometry(.6,1.4,20),M.glowR);ring.rotation.x=-Math.PI/2;ring.visible=false;grp.add(ring);f.b=b;f.ring=ring;f.hitT=0;}
  if(f.k==='arc'){f.teeth=[];const n=Math.max(6,Math.round((f.a1-f.a0)*f.R/1.3));for(let k=0;k<n;k++){const a=f.a0+(f.a1-f.a0)*(k+.5)/n,wx=f.cx+Math.cos(a)*(f.R-.6),wz=f.cz+Math.sin(a)*(f.R-.6),fy=szT(wx,wz);if(fy==null)continue;
      for(const hy of[.6,1.8]){const m=new THREE.Mesh(new THREE.ConeGeometry(.42,2.2,6),M.tooth);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-Math.cos(a),0,-Math.sin(a)));m.visible=false;grp.add(m);f.teeth.push({m,wx,wz,y:fy+hy,nx:-Math.cos(a),nz:-Math.sin(a)});}}}
  SZ.fx.push(f);}
function szFxDrop(f){for(const m of[f.b,f.ring])if(m){m.parent&&m.parent.remove(m);m.geometry.dispose();}if(f.teeth)for(const q of f.teeth){q.m.parent&&q.m.parent.remove(q.m);q.m.geometry.dispose();}}
function szBeamPt(f,q){if(f.k==='laser')return[f.ax+(f.bx-f.ax)*q,f.az+(f.bz-f.az)*q];const a=f.a0+f.turns*6.283*q,r=f.r0+(f.r1-f.r0)*q;return[f.cx+Math.cos(a)*r,f.cz+Math.sin(a)*r];}
function szFxTick(dt){for(let i=SZ.fx.length-1;i>=0;i--){const f=SZ.fx[i];f.t+=dt;
  if(f.k==='laser'||f.k==='spiral'){const dl=f.dl||1,live=f.t>dl,q=clamp((f.t-dl)/f.T,0,1),[gx,gz]=szBeamPt(f,live?q:0),gy=szT(gx,gz)||DG_Y,ex=f.ex,ey=f.ey,ez=f.ez;
    const dx=gx-ex,dy=gy-ey,dz=gz-ez,L=Math.hypot(dx,dy,dz);f.b.visible=true;f.b.position.set((ex+gx)/2,(ey+gy)/2,(ez+gz)/2);f.b.scale.set(live?1.15:.45,L,live?1.15:.45);f.b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx/L,dy/L,dz/L));
    f.b.material=live?szMats().laser:f.b.material;f.ring.visible=true;f.ring.position.set(gx,gy+.08,gz);f.ring.scale.setScalar(live?1.2+Math.sin(f.t*30)*.15:.7);
    if(live){if(Math.random()<dt*50)spawnParticle(gx+(Math.random()-.5)*.8,gy+.2,gz+(Math.random()-.5)*.8,(Math.random()-.5)*4,1+Math.random()*3,(Math.random()-.5)*4,Math.random()<.5?0xff5a1a:0xffd080,.22,.25);
      f.hitT-=dt;if(f.hitT<=0&&Math.hypot(P.x-gx,P.z-gz)<1.6&&P.y<gy+2.2){f.hitT=.45;szHurt(f.dmg||13,0,0,2);}
      if(!f.snd){f.snd=1;try{Snd.flame();}catch(_){}}}else if(!f.cs){f.cs=1;try{Snd.summon(.12);}catch(_){}}
    if(f.t>dl+f.T){szFxDrop(f);SZ.fx.splice(i,1);}continue;}
  if(f.k==='arc'){const W=f.dl||1,ph=f.t<W?f.t/W*.25:f.t<W+.25?.25+(f.t-W)/.25*.75:f.t<W+.75?1:Math.max(0,1-(f.t-W-.75)/.6);
    for(const q of f.teeth){q.m.visible=ph>.02;const o=-1+ph*3.2;q.m.position.set(q.wx+q.nx*o,q.y,q.wz+q.nz*o);}
    if(f.t<W&&!f.w1){f.w1=1;try{Snd.rumble(.35);}catch(_){}}
    if(f.t>=W+.2&&!f.done){f.done=1;try{Snd.bite();Snd.boom(.25);}catch(_){}const dx=P.x-f.cx,dz=P.z-f.cz,d=Math.hypot(dx,dz);let a=Math.atan2(dz,dx);while(a<f.a0-Math.PI)a+=6.283;while(a>f.a0+Math.PI)a-=6.283;
      if(d>f.R-4.6&&a>=f.a0-.05&&a<=f.a1+.05&&Math.abs(P.y-(szT(P.x,P.z)||P.y))<2.5){szHurt(26,-dx/(d||1)*9,-dz/(d||1)*9,4);showArea('Die Wand beißt zu!');}}
    if(f.t>W+1.4){szFxDrop(f);SZ.fx.splice(i,1);}continue;}}}
// Gebisse in den Engstellen
function szJawTick(dt){const auth=szAuth();for(const J of SZ.jaws){J.t+=dt;
  const near=Math.hypot(P.x-(J.ax+J.bx)/2,P.z-(J.az+J.bz)/2)<30||(MP.on&&[...REMOTE.values()].some(R=>time-R.seen<5&&Math.hypot(R.x-(J.ax+J.bx)/2,R.z-(J.az+J.bz)/2)<30));
  if(J.st==='idle'){if(auth&&near&&J.t>J.w){J.w=2.2+Math.random()*1.6;szFx({k:'jaw',i:J.i});}}
  else if(J.st==='warn'&&J.t>.9){J.st='bite';J.t=0;try{Snd.bite();Snd.boom(.18);}catch(_){}
    const px=P.x-J.ax,pz=P.z-J.az,al=px*J.dx+pz*J.dz,lat=Math.abs(px*J.dz-pz*J.dx);if(al>-.5&&al<J.L+.5&&lat<J.r&&!J.hit){J.hit=1;szHurt(24,-J.dx*7,-J.dz*7,3);showArea('Das Gebiss schnappt zu!');}}
  else if(J.st==='bite'&&J.t>.45){J.st='back';J.t=0;}else if(J.st==='back'&&J.t>.6){J.st='idle';J.t=0;}
  const ph=J.st==='warn'?Math.min(1,J.t/.9)*.28:J.st==='bite'?Math.min(1,J.t/.12):J.st==='back'?Math.max(0,1-J.t/.6):0;
  for(const q of J.teeth){q.m.visible=ph>.02;const o=-1.4+ph*(q.reach+1.2);q.m.position.set(q.wx+q.nx*o,q.y,q.wz+q.nz*o);}
  if(J.st==='warn'&&Math.random()<dt*12){const q=J.teeth[(Math.random()*J.teeth.length)|0];spawnParticle(q.wx,q.y,q.wz,q.nx,.5,q.nz,0x9a1a22,.4,.2);}}}
// ---------- Das Gehirn ----------
const SZ_TAUNT=['Ich sehe dich.','Du schmeckst nach Angst.','Bleib. Werde ein Teil von mir.','Jeder Gedanke hier ist meiner.','Lauf nur. Der Schlund verdaut alles.','Ich zähle deine Herzschläge.'];
function szBrainAI(e,dt){const C=e.cd2||(e.cd2={laser:2.4,slam:2,teeth:6,sum:9,spiral:6,talk:5});for(const k in C)C[k]-=dt;e.noPath=1;e.yo=2.6+Math.sin(time*1.3)*.35;
  if(!e.met){e.met=1;e.ph=1;showArea('Das Gehirn');try{Snd.demonRoar(.25,1.8);}catch(_){}say(e,SZ_TAUNT[0],3);}
  if(e.ph===1&&e.hp<e.max*.6){e.ph=2;e.st='roar';e.mt=2;showArea('Das Auge öffnet sich weit!');try{Snd.demonRoar(.22,1.9);}catch(_){}}
  if(e.ph===2&&e.hp<e.max*.3){e.ph=3;e.st='roar';e.mt=2.2;showArea('Das Gehirn rast! Der ganze Schlund bebt.');try{Snd.demonRoar(.2,2);Snd.rumble(.5);}catch(_){}}
  if(e.st==='roar'){e.mt-=dt;e.frame='r';if(e.mt<=0)e.st=null;return true;}
  if(e.st==='charge'){e.mt-=dt;e.frame=e.mt>e.fire?'c':'l';if(e.mt<=0)e.st=null;return true;}
  if(e.st==='slam'){e.mt-=dt;e.frame='a';if(e.mt<=0&&!e.slamDone){e.slamDone=1;szHitPlayers(e.x,e.z,e.y,7,22,10,4);try{Snd.boom(.4);}catch(_){}for(let k=0;k<40;k++)spawnParticle(e.x+(Math.random()-.5)*10,e.y+.3,e.z+(Math.random()-.5)*10,(Math.random()-.5)*6,1+Math.random()*3,(Math.random()-.5)*6,0x8a2030,.8,.35);}
    if(e.mt<=-.4)e.st=null;return true;}
  const t=e.tgt;if(!t){e.frame=Math.sin(time*.7)>.96?'b':(Math.sin(time*2.2)>0?0:1);return true;}
  const[tx,,tz]=tPos(t),dist=Math.hypot(tx-e.x,tz-e.z),K=e.ph===3?1.4:e.ph===2?1.2:1,eye=[e.x,e.y+e.yo+e.h*.45,e.z];
  if(C.talk<=0){C.talk=9+Math.random()*8;say(e,SZ_TAUNT[(Math.random()*SZ_TAUNT.length)|0],3);}
  if(dist<8&&C.slam<=0){C.slam=3.2/K;e.st='slam';e.mt=.7;e.slamDone=0;return true;}
  if(e.ph===3&&C.spiral<=0){C.spiral=17;e.st='charge';e.mt=6.6;e.fire=5.5;szFx({k:'spiral',ex:eye[0],ey:eye[1],ez:eye[2],cx:e.x,cz:e.z,a0:Math.random()*6.283,turns:2.2*(Math.random()<.5?-1:1),r0:3,r1:SZD.BR.R-2,T:5.5,dl:1.1,dmg:16});return true;}
  if(C.laser<=0){C.laser=(e.ph>=2?3.4:5)+Math.random();const l=dist||1,ux=(tx-e.x)/l,uz=(tz-e.z)/l,sd=Math.random()<.5?-1:1,w=8;
    e.st='charge';e.mt=2.9;e.fire=1.9;szFx({k:'laser',ex:eye[0],ey:eye[1],ez:eye[2],ax:tx-uz*w*sd,az:tz+ux*w*sd,bx:tx+uz*w*sd,bz:tz-ux*w*sd,T:1.9,dl:1,dmg:13});
    if(e.ph>=2)szFx({k:'laser',ex:eye[0],ey:eye[1],ez:eye[2],ax:e.x+ux*4,az:e.z+uz*4,bx:e.x+ux*(SZD.BR.R-2),bz:e.z+uz*(SZD.BR.R-2),T:1.6,dl:1.6,dmg:13});return true;}
  if(C.teeth<=0){C.teeth=(e.ph>=2?7:10)+Math.random()*3;const a=Math.atan2(tz-e.z,tx-e.x),w=.5+Math.random()*.3;szFx({k:'arc',cx:e.x,cz:e.z,R:SZD.BR.R,a0:a-w,a1:a+w,dl:1.1});}
  if(e.ph>=2&&C.sum<=0){C.sum=e.ph===3?11:15;let n=0;for(let k=0;k<12&&n<(e.ph===3?3:2);k++){const a=Math.random()*6.283,r=5+Math.random()*6,x=tx+Math.cos(a)*r,z=tz+Math.sin(a)*r;if(szSdf(x-SZ.X,z-SZ.Z)>-3.5)continue;
      const s=szAbsSpawn(['sza','szm','szh'][(Math.random()*3)|0],x,z);if(s){s.ab='rise';s.rise=0;n++;}}if(n)say(e,'Wachst, meine Kinder!',2.5);}
  e.frame=Math.sin(time*2.2)>0?0:1;return true;}
// ---------- Umgebung: Blutstropfen, Atmen, Herzschlag, Augen, Finger ----------
function szDripTick(dt){const M=szMats();SZ.dripT-=dt;if(SZ.dripT<=0){SZ.dripT=.18+Math.random()*.4;for(let k=0;k<6;k++){const a=Math.random()*6.283,r=2+Math.random()*16,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;if(szSdf(x-SZ.X,z-SZ.Z)>-2)continue;
      const c=szCeil(x,z),f=szT(x,z);if(c==null||f==null||c-f<3)continue;let d=SZ.drops.find(q=>!q.on);if(!d){if(SZ.drops.length>24)break;d={m:new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),M.drop)};d.m.scale.y=2.2;DGX.grp.add(d.m);SZ.drops.push(d);}
      d.on=1;d.x=x;d.z=z;d.y=c-.3;d.vy=0;d.f=f;d.m.visible=true;break;}}
  for(const d of SZ.drops){if(!d.on)continue;d.vy-=18*dt;d.y+=d.vy*dt;d.m.position.set(d.x,d.y,d.z);if(d.y<=d.f){d.on=0;d.m.visible=false;for(let k=0;k<6;k++)spawnParticle(d.x,d.f+.05,d.z,(Math.random()-.5)*2,1+Math.random()*1.5,(Math.random()-.5)*2,0x8a0a0e,.3,.2);
      if(Math.hypot(P.x-d.x,P.z-d.z)<.7&&P.y<d.f+2.5){szHurt(3);}}}}
function szAmbTick(dt){SZ.uT.value+=dt;SZ.beat+=dt;const per=SZ.boss&&SZ.boss.met&&!SZ.boss.dead?.75:1.1;let pulse=0;if(SZ.beat>per){SZ.beat=0;const H=SZ.heart;if(H&&Math.hypot(P.x-H.position.x,P.z-H.position.z)<55)try{Snd.thud();}catch(_){}}
  pulse=Math.exp(-SZ.beat*7);if(SZ.heart)SZ.heart.scale.setScalar(1+pulse*.09);for(const L of SZ.lights)L.l.intensity=L.b*(.75+pulse*.5);
  // Augen schauen dich an
  const cam=camera.position;for(const E of SZ.eyes){const d=Math.hypot(E.g.position.x-P.x,E.g.position.z-P.z);if(d>40)continue;E.g.lookAt(cam);E.bl-=dt;if(E.bl<=0){E.bt=.16;E.bl=2+Math.random()*7;}if(E.bt>0){E.bt-=dt;E.g.scale.y=.12;}else E.g.scale.y=1;}
  for(const H of SZ.hands){const d=Math.hypot(H.g.position.x-P.x,H.g.position.z-P.z);if(d>35)continue;H.ph+=dt*(d<6?5:1.6);H.fs.forEach((f,k)=>{f.rotation.x=Math.sin(H.ph+k*.7)*.6-.3;});}
  // Schleim beim Laufen
  if(state==='playing'&&Math.hypot(P.vx,P.vz)>1&&Math.random()<dt*6)spawnParticle(P.x+(Math.random()-.5)*.6,P.y+.05,P.z+(Math.random()-.5)*.6,(Math.random()-.5),.6,(Math.random()-.5),Math.random()<.5?0xc8b860:0x9a2a2a,.3,.2);
  // Nebel und Licht je nach Kammer
  const D=DGX.d,a=szInfo(P.x-SZ.X,P.z-SZ.Z).a;D.fogC=a==='hirn'?[.1,.03,.09]:a==='herz'?[.16,.02,.03]:[.13,.03,.035];D.far=a==='hirn'||a==='magen'||a==='herz'?78:56;D.near=4;D.hemi=.22;D.bbl=.9;
  if(DGX.light)DGX.light.intensity=1.1+pulse*.3;}
// Wand beißt in großen Kammern zu, wenn jemand nah an der Wand steht
function szWallBiteTick(dt){if(!szAuth())return;SZ.biteT-=dt;if(SZ.biteT>0)return;SZ.biteT=5+Math.random()*5;const ps=[[P.x,P.z]];if(MP.on)for(const R of REMOTE.values())if(time-R.seen<5)ps.push([R.x,R.z]);
  const cand=[];for(const[px,pz]of ps)for(const[cx,cz,r]of SZD.CH){const X=SZ.X+cx,Z=SZ.Z+cz,d=Math.hypot(px-X,pz-Z);if(d>r-6.5&&d<r&&szSdf(px-SZ.X,pz-SZ.Z)>-5)cand.push([X,Z,r,Math.atan2(pz-Z,px-X)]);}
  if(!cand.length){SZ.biteT=2;return;}const[cx,cz,r,a]=cand[(Math.random()*cand.length)|0];szFx({k:'arc',cx,cz,R:r,a0:a-.32,a1:a+.32,dl:1.1});}
function szTick(dt){if(!SZ.on||!DGX.on)return;if(SZ.boss&&SZ.boss.dead&&!SZ.won){SZ.won=1;setTimeout(()=>{if(SZ.on)showArea('Die Membran reißt auf. Dahinter geht es hinaus.');},4200);}szAmbTick(dt);szDripTick(dt);szJawTick(dt);szFxTick(dt);szWallBiteTick(dt);
  // Blutsee: waten
  let w=0;for(const L of SZ.lakes)if(Math.hypot(P.x-L.x,P.z-L.z)<L.r&&P.y<L.y+.2){w=1;if(Math.random()<dt*Math.hypot(P.vx,P.vz)*2)spawnParticle(P.x,L.y+.05,P.z,(Math.random()-.5),1,(Math.random()-.5),0x8a0a0e,.4,.15);}P.szWade=w;}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{szTick(dt);}catch(e){if(!szTick.err){szTick.err=1;console.error('Schlund',e);}}};}
// ---------- Boden, Wände, Gebiet ----------
const szHere=y=>SZ.on&&DGX.on&&(y==null||y<DG_Y+80);
{const a=groundAt;groundAt=function(x,z,feet){if(szHere(feet)&&dgIn(x,z)){let g=szT(x,z);if(g==null)return a(x,z,feet);const lim=feet==null?1e9:feet+.65;
    for(const b of solNear(x,z)){if(b.off||!b.walk)continue;const[lx,lz]=solLoc(b,x,z);if(Math.abs(lx)>b.hw||Math.abs(lz)>b.hd)continue;const t=solTop(b,lz);if(t<=lim&&t>g)g=t;}return g;}return a(x,z,feet);};}
function szPush(o,R){if(!SZ.on)return;const lx=o.x-SZ.X,lz=o.z-SZ.Z,lim=-(SZD.PAD+R),s=szSdf(lx,lz);
  if(s>lim){const e=.15,gx=szSdf(lx+e,lz)-szSdf(lx-e,lz),gz=szSdf(lx,lz+e)-szSdf(lx,lz-e),gl=Math.hypot(gx,gz)||1,k=Math.min(s-lim,4);o.x-=gx/gl*k;o.z-=gz/gl*k;}
  for(const c of SZ.cols){const ex=o.x-c.x,ez=o.z-c.z,dd=Math.hypot(ex,ez),rr=c.r+R;if(dd<rr&&dd>1e-4){o.x=c.x+ex/dd*rr;o.z=c.z+ez/dd*rr;}}}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z;a(dt);if(!szHere(P.y))return;if(state==='playing'){const k=P.szWade?.62:.86;P.x=x0+(P.x-x0)*k;P.z=z0+(P.z-z0)*k;}szPush(P,P.rad||.3);waterTint.hidden=true;};}
{const a=entMove;entMove=function(e,tx,tz,sp,dt){const r=a(e,tx,tz,sp,dt);if(szHere(e.y))szPush(e,(e.d.rad||.35)*.9);return r;};}
{const a=collideTrees;collideTrees=function(){if(szHere(P.y))return;return a();};}
{const a=collideTreesObj;collideTreesObj=function(o,R){if(szHere(o.y))return;return a(o,R);};}
{const a=areaAt;areaAt=function(x,z){if(SZ.on&&DGX.on&&dgIn(x,z))return'tw_sz_'+szInfo(x-SZ.X,z-SZ.Z).a;return a(x,z);};}
for(const k in SZ_AREA){AREAS['tw_sz_'+k]=SZ_AREA[k];AREA_MUSIC['tw_sz_'+k]=AREA_MUSIC.in_tower;try{WX_NONE.add('tw_sz_'+k);MAPC['tw_sz_'+k]=[120,40,48];}catch(e){}}
{const a=dgFree;dgFree=function(){a();if(SZ.on){SZ.on=false;SZ.fx=[];SZ.jaws=[];SZ.eyes=[];SZ.hands=[];SZ.drops=[];SZ.cols=[];SZ.lakes=[];SZ.g=null;SZ.boss=null;SZ.heart=null;SZ.lights=[];P.szWade=0;}};}
// Beute: Taschen-Truhen und große Truhe
{const a=dgLoot;dgLoot=function(c){const tw=DGX.d&&DGX.d.tower&&DGX.d.lvl===4;
  if(tw&&c&&!c.open&&/^sz\d/.test(c.key||'')){c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z-=.3;c.lid.position.y+=.25;const st=DGX.d.st;st.ch=st.ch||{};st.ch[c.key]=1;const R=Math.random;
    const L=[['silver',30+((R()*30)|0)],['hpot2',1+((R()*2)|0)],[['ruby','sapphire','emerald','opal','diamond'][(R()*5)|0],1],[['arrow_fire','arrow_poison','arrow_silver'][(R()*3)|0],10]];if(R()<.4)L.push(['platin',1]);if(R()<.3&&typeof RUNE_EX!=='undefined')L.push([RUNE_EX[(R()*RUNE_EX.length)|0],1]);
    lootGive(L,'Versteckter Schatz!');return;}
  const was=c&&c.open;a(c);try{if(tw&&c&&c.boss&&!was&&c.open){const L=[['platin',1+((Math.random()*2)|0)],['diamond',1],['szeyeball',1]];if(typeof RUNE_EX!=='undefined')L.push([RUNE_EX[(Math.random()*RUNE_EX.length)|0],1]);lootGive(L,'Der Schatz des Schlunds!');}}catch(e){}};}
// ---------- Mehrspieler: Effekte empfangen ----------
{const a=mpOnMsg;mpOnMsg=function(m,peer){if(m&&m.t==='szfx'){try{if(isClient()&&SZ.on&&lvKey()==='T4')szFxStart(m.f);}catch(e){}return;}return a(m,peer);};}
// ---------- Karte der Ebene ----------
{const a=lvMapBuild;lvMapBuild=function(lvl){if(!(lvl===4&&SZ.on))return a(lvl);const d=DGX.d;if(!d)return;const cell=2,W=d.W,gw=Math.ceil(W/cell),base=document.createElement('canvas');base.width=base.height=gw;const c=base.getContext('2d'),im=c.createImageData(gw,gw),D=im.data;
  const TC={rachen:[150,80,80],roehre:[160,86,84],magen:[172,96,84],pfoertner:[150,76,76],darm:[180,116,100],herz:[140,52,56],ader:[148,60,64],hirn:[140,100,130]};
  for(let j=0;j<gw;j++)for(let i=0;i<gw;i++){const x=d.ox+i*cell+1,z=d.oz+j*cell+1,I=szInfo(x-SZ.X,z-SZ.Z),k=(j*gw+i)*4;let col;
    if(I.s>-1.2){const n=hash2(i,j,77)*8;col=I.s>0?[24+n,12+n,14+n]:[70,24,30];}else{const T=TC[I.a]||TC.magen,n=(hash2(i,j,78)-.5)*12;col=[T[0]+n,T[1]+n,T[2]+n];if(SZ.lakes.some(L=>Math.hypot(x-L.x,z-L.z)<L.r-1))col=[110,14,20];}
    D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;}
  c.putImageData(im,0,0);const vis=document.createElement('canvas');vis.width=vis.height=gw;const vctx=vis.getContext('2d');
  Object.assign(LVM,{on:true,lvl,key:lvl,dg:0,title:'Ebene 4: Der Schlund',cell,gw,ox:d.ox,oz:d.oz,W,base,vis,vctx,seen:lvSeenLoad(lvl,gw*gw),outdoor:false,revT:0,miniT:0,sz:1});
  const bc=c.getImageData(0,0,gw,gw),vi=vctx.createImageData(gw,gw);for(let i=0;i<gw*gw;i++)if(LVM.seen[i])for(let q=0;q<4;q++)vi.data[i*4+q]=bc.data[i*4+q];vctx.putImageData(vi,0,0);LVM.bdata=bc.data;};}
{const a=lvReveal;lvReveal=function(){if(!(LVM.on&&LVM.sz&&SZ.on))return a();const R=20,cell=LVM.cell,ci=(P.x-LVM.ox)/cell,cj=(P.z-LVM.oz)/cell,r=R/cell,gw=LVM.gw;let im=null;
  for(let j=Math.max(0,Math.floor(cj-r));j<=Math.min(gw-1,Math.ceil(cj+r));j++)for(let i=Math.max(0,Math.floor(ci-r));i<=Math.min(gw-1,Math.ceil(ci+r));i++){const k=j*gw+i;if(LVM.seen[k]||(i-ci)**2+(j-cj)**2>r*r)continue;LVM.seen[k]=1;if(!im)im=LVM.vctx.getImageData(0,0,gw,gw);for(let q=0;q<4;q++)im.data[k*4+q]=LVM.bdata[k*4+q];}
  if(im){LVM.vctx.putImageData(im,0,0);LVM.dirty=true;}};}
{const a=twlEnter;twlEnter=function(lvl){if(lvl!==4)LVM.sz=0;return a(lvl);};}
// ---------- Ebene 4 eintragen ----------
TOWER_LEVELS[3]={n:'Der Schlund',d:'Ein riesiger Körper von innen. Abszesse mit Augen und Händen wachsen aus dem Fleisch, die Wände beißen. Am Ende wartet das Gehirn.',cave:1,W:SZD.W,far:60,near:4,hemi:.22,bbl:.9,fogC:[.13,.03,.035],
  build(K){szBuild(K);},
  enter(){const A=SZ.arrive;if(!A)return;P.x=A.x;P.z=A.z;P.y=(szT(A.x,A.z)||DG_Y)+.1;P.vx=P.vy=P.vz=0;P.yaw=0;P.pitch=0;try{Snd.thud();}catch(_){}setTimeout(()=>showArea('Der Schlund'),900);}};
// ---------- Musik: eigener Bosskampf für den Minotaurus (Turm-Ebene 1) ----------
MUSIC_SLOTS['bosskampf/minotaurus']='Minotaurus (Turm-Ebene 1: Iron Horns in the Labyrinth)';BOSS_MUSIC.minotaur='bosskampf/minotaurus';
MUSIC_SLOTS['bosskampf/tarantula']='Tarantula (Turm-Ebene 2: Labyrinth Sovereign)';BOSS_MUSIC.tarantula='bosskampf/tarantula';
MUSIC_SLOTS['bosskampf/biglunar']='Big Lunar (Turm-Ebene 3: Oculus of the Hive)';BOSS_MUSIC.biglunar='bosskampf/biglunar';
MUSIC_SLOTS['bosskampf/gehirn']='Das Gehirn (Turm-Ebene 4: A Geometry of Teeth)';BOSS_MUSIC.szbrain='bosskampf/gehirn';
