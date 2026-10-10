/* =========================================================
   MAGIE · Zaubermenü und Zauberleiste
   - Zaubermenü über den Knopf „Zauber“ im Inventar
   - Zauberleiste mit 7 Plätzen: Tasten 1–7 wirken den Zauber
     (Dauerzauber gedrückt halten), Abklingzeit im Platz
   - Die normale Hotbar wechselt man jetzt mit dem Mausrad
   - Zauber lernt man mit Schriftrollen (z_mag4_scrolls.js), Stufe 1–10
   - Im Cheat-Modus sind alle Zauber frei (Stufe 10)
   ========================================================= */
// alte Test-Tasten aus 0.0.78 entfernen
delete DEFAULTS.keys.cast;delete DEFAULTS.keys.book;if(settings.keys){delete settings.keys.cast;delete settings.keys.book;}
const SPELLBAR_N=7;
function spellBar(){if(!Array.isArray(FLAGS.spellbar))FLAGS.spellbar=[];while(FLAGS.spellbar.length<SPELLBAR_N)FLAGS.spellbar.push(null);return FLAGS.spellbar;}
const spellKnown=id=>magLv(id)>0;

/* ---------- Pixel-Symbole: jedes zeigt, was der Zauber macht ---------- */
const EPAL={fire:['#7a1a06','#ff6a1a','#ffcc33','#fff3a0'],water:['#123a9a','#3a8cff','#9cd4ff','#ffffff'],nature:['#1a5a16','#4fbf3a','#a8ff6a','#e8ffb0'],
  dark:['#1a0630','#6a2aa8','#b07aff','#e8d8ff'],blood:['#3a030c','#b0101e','#ff3a4a','#ffb0b8'],light:['#946a0c','#ffd84a','#fff07a','#ffffff'],neutral:['#3a4a70','#9fb6e0','#dfe8ff','#ffffff']};
const BRN='#7a5230',BRN2='#a8743e',GRY='#8a8a8a',GRY2='#c4c4c4',BONE='#ece6d6';
const MAG_GLYPH={
  // Feuer
  funken:g=>{g.l(2,14,9,7,2,g.m);g.l(3,13,7,9,1,g.L);g.c(11,5,3.2,g.m);g.c(11,5,2,g.L);g.c(11.5,4.5,.9,g.W);},
  feuerball:g=>{g.c(8,8.5,6.4,g.m);g.c(7.5,8,4.5,g.L);g.c(6.5,7,2.2,g.W);g.p([[3,4],[5,1],[6,4]],g.m);g.p([[10,3],[12,0],[13,4]],g.m);},
  atem:g=>{g.p([[2,8],[15,1],[15,15]],g.m);g.p([[2,8],[13,4],[13,12]],g.L);g.p([[2,8],[10,6.5],[10,9.5]],g.W);g.c(2.5,8,2,g.d);},
  glut:g=>{g.flame(5,15,7,2.6);g.flame(11,15,10,3.2);g.r(1,14,14,2,g.d);},
  feuerwand:g=>{g.r(0,13,16,3,BRN);g.flame(3,14,8,2.4);g.flame(8,14,11,2.8);g.flame(13,14,8,2.4);},
  hitze:g=>{g.flame(8,16,11,5);g.p([[5,6],[8,2],[11,6]],g.W);g.r(7,5,2,6,g.W);},
  meteor:g=>{g.l(1,1,9,9,4,g.m);g.l(2,2,9,9,2,g.L);g.c(11,11,4.4,BRN);g.c(10,10,2.2,BRN2);g.c(12.5,12.5,1,g.m);},
  lagerfeuer:g=>{g.l(2,15,14,12,2.2,BRN);g.l(2,12,14,15,2.2,BRN2);g.flame(8,13,10,4);},
  // Wasser
  wasserstrahl:g=>{g.c(2.5,8,2.4,g.d);g.r(2,5.5,10,5,g.m);g.r(2,7,11,2,g.L);g.c(13,8,2.8,g.W);g.c(15,5,1,g.L);g.c(15,11,1,g.L);},
  eissplitter:g=>{for(const[x,y]of[[3,13],[8,15],[12,11]]){g.p([[x-1.5,y],[x+4,y-9],[x+1.5,y]],g.L);g.p([[x-.5,y-1],[x+3,y-8],[x+.5,y-1]],g.W);}},
  frostnova:g=>{for(let k=0;k<8;k++){const a=k*Math.PI/4;g.l(8,8,8+Math.cos(a)*7,8+Math.sin(a)*7,1.4,g.L);}g.ring(8,8,4.5,1.6,g.m);g.c(8,8,2.3,g.W);},
  flutwelle:g=>{g.p([[0,15],[0,10],[3,6],[7,3],[12,3],[15,6],[12,7],[9,6],[7,8],[9,11],[16,12],[16,15]],g.m);g.p([[7,3],[12,3],[15,6],[12,7],[9,6],[6,6]],g.W);},
  eisbruecke:g=>{g.r(0,12,16,4,g.m);g.l(0,13,16,13,1,g.L);g.r(1,7,14,3,g.L);g.r(2,7,1,5,g.W);g.r(7,7,1,5,g.W);g.r(13,7,1,5,g.W);g.r(1,7,14,1,g.W);},
  stroemung:g=>{g.l(1,6,10,6,2,g.L);g.l(1,10,11,10,2,g.m);g.l(3,14,9,14,1.6,g.L);g.p([[10,3],[16,8],[10,13]],g.W);},
  blasenschild:g=>{g.c(8,8,7,g.m);g.c(8,8,5.6,g.L);g.c(8,8,4.4,g.d);g.c(5.5,5.5,1.6,g.W);g.c(10,11,.9,g.W);},
  regenruf:g=>{g.c(5,6,3.4,GRY2);g.c(9,5,4,GRY2);g.c(12,7,3,GRY2);g.r(3,6,11,3,GRY2);for(const x of[4,8,12])g.l(x,11,x-1,15,1.4,g.m);},
  // Natur
  dornen:g=>{g.l(8,15,8,3,2,g.m);g.l(8,11,4,7,1.6,g.m);g.l(8,8,12,4,1.6,g.m);for(const[x,y]of[[6,13],[10,10],[5,8],[11,6],[9,4]])g.p([[x-1,y],[x+1,y],[x,y-2]],g.W);g.r(4,14,8,2,BRN);},
  steinwurf:g=>{g.p([[4,5],[10,2],[14,6],[13,12],[7,14],[3,10]],GRY);g.p([[5,6],[10,3],[12,6],[9,9],[5,9]],GRY2);g.l(0,3,3,5,1,g.L);g.l(0,8,2,8,1,g.L);},
  erdwall:g=>{g.r(1,4,14,11,BRN);for(const y of[7,10,13])g.r(1,y,14,1,'#4a3420');for(const[x,y]of[[5,4],[10,7],[4,10],[11,13],[7,4],[2,7]])g.r(x,y,1,3,'#4a3420');g.r(1,4,14,1,BRN2);},
  rinde:g=>{g.p([[8,1],[14,4],[13,11],[8,15],[3,11],[2,4]],BRN);g.p([[8,3],[12,5],[11,10],[8,13]],BRN2);g.l(5,5,5,11,1,'#4a3420');g.p([[8,8],[12,4],[11,8]],g.m);},
  wachstum:g=>{g.r(0,13,16,3,BRN);g.l(8,14,8,5,1.6,g.m);g.p([[8,9],[2,5],[4,10]],g.L);g.p([[8,7],[14,2],[12,8]],g.m);g.c(8,4,1.5,g.W);},
  bluete:g=>{for(let k=0;k<5;k++){const a=k*1.2566-1.57;g.c(8+Math.cos(a)*4,8+Math.sin(a)*4,3,'#ff7ab8');}g.c(8,8,2.6,'#fff07a');g.c(7.4,7.4,1,'#ffffff');},
  tierfreund:g=>{g.c(8,11,4,g.m);g.c(8,11,2.4,g.L);for(const[x,y]of[[3,6],[6,3],[10,3],[13,6]])g.c(x,y,2,g.m);},
  erdbeben:g=>{g.r(0,9,16,7,BRN);g.l(2,9,6,13,1.2,'#2a1a10');g.l(6,13,9,10,1.2,'#2a1a10');g.l(9,10,13,15,1.2,'#2a1a10');for(const[x,y]of[[3,4],[8,2],[13,5]])g.c(x,y,1.6,GRY2);},
  wurzelweg:g=>{g.r(0,10,16,6,BRN);g.l(2,4,4,12,1.6,g.m);g.l(4,12,12,12,1.6,g.m);g.l(12,12,13,5,1.6,g.m);g.p([[10,6],[13,2],[16,6]],g.L);},
  // Dunkle Magie
  schattenpfeil:g=>{g.l(2,14,12,4,2.2,g.m);g.l(2,14,9,7,1,g.L);g.p([[9,2],[15,1],[14,7]],g.L);g.l(1,11,4,14,1,g.d);g.l(4,15,1,12,1,g.d);},
  schwaeche:g=>{g.l(4,2,12,10,2,GRY2);g.r(2,9,6,2,BRN);g.p([[8,10],[16,10],[12,15]],g.L);g.r(10,6,4,4,g.L);},
  furcht:g=>{g.p([[1,8],[8,3],[15,8],[8,13]],g.L);g.c(8,8,3.4,g.m);g.c(8,8,1.6,g.d);g.c(7,7,.8,g.W);},
  skelett:g=>{g.c(8,7,5.6,BONE);g.r(5,10,6,4,BONE);g.c(5.8,7,1.6,g.d);g.c(10.2,7,1.6,g.d);g.p([[8,9],[7,11],[9,11]],g.d);for(const x of[6,8,10])g.r(x,12,1,2,g.d);},
  schattenschritt:g=>{g.c(10,4,2.2,g.m);g.p([[8,6],[12,6],[13,12],[11,12],[11,15],[9,15],[9,12],[7,12]],g.m);g.c(5,5,1.6,g.L);g.p([[3,7],[6,7],[6,12],[3,12]],g.L);g.l(0,9,2,9,1,g.L);},
  seelenernte:g=>{for(const[x,y]of[[4,10],[8,6],[12,10]]){g.c(x,y,2.6,g.L);g.p([[x-2,y],[x+2,y],[x,y+5]],g.L);g.c(x,y,1.2,g.W);}},
  finsternis:g=>{g.c(5,9,4,g.d);g.c(10,7,5,g.m);g.c(11,11,4,g.d);g.c(6,12,3,g.m);g.c(9,9,2,'#000000');g.c(13,4,1,g.L);},
  verderbnis:g=>{g.c(8,7,5.6,'#3a5a20');g.c(5.8,7,1.6,'#0a1a04');g.c(10.2,7,1.6,'#0a1a04');g.r(5,10,6,3,'#3a5a20');g.c(5,15,1.4,'#a8ff5a');g.c(11,14,1,'#a8ff5a');g.ring(8,7,7,1,g.L);},
  // Blutmagie
  blutpfeil:g=>{g.l(1,15,9,7,1.6,BONE);g.p([[8,8],[13,2],[15,3],[10,9]],g.L);g.c(12,5,2.5,g.m);g.p([[12,0],[14,4],[10,4]],g.m);},
  lebensraub:g=>{g.c(6,6,3.4,g.m);g.c(10,6,3.4,g.m);g.p([[3,7],[13,7],[8,14]],g.m);g.c(6,5,1.4,g.L);g.l(0,2,5,6,1.4,g.W);g.p([[3,7],[6,5],[5,8]],g.W);},
  blutopfer:g=>{g.p([[5,1],[8,6],[5,9],[2,6]],g.m);g.c(5,7,3,g.m);g.l(8,9,11,9,1,g.W);g.p([[12,5],[13,8],[16,9],[13,10],[12,13],[11,10],[8,9],[11,8]],'#7ac4ff');},
  aderlass:g=>{g.l(2,2,14,14,2.4,GRY2);g.l(2,2,14,14,1,g.W);for(const[x,y]of[[4,10],[6,13],[11,4],[13,7]])g.c(x,y,1.6,g.m);},
  blutrausch:g=>{g.flame(8,16,13,6);g.c(6,9,1.2,g.W);g.c(10,9,1.2,g.W);g.l(5,12,11,12,1,g.d);},
  blutband:g=>{g.ring(5,8,3.4,1.8,g.L);g.ring(11,8,3.4,1.8,g.m);g.c(3,14,1.4,g.m);},
  blutgolem:g=>{g.c(8,4,3,g.m);g.r(3,7,10,6,g.m);g.r(1,7,3,7,g.d);g.r(12,7,3,7,g.d);g.r(4,13,3,3,g.d);g.r(9,13,3,3,g.d);g.c(7,4,.8,g.W);g.c(9,4,.8,g.W);},
  blutleben:g=>{g.ring(8,4,3,2,g.m);g.r(7,6,2,10,g.m);g.r(3,8,10,2,g.m);g.c(13,13,1.5,g.L);},
  // Licht
  heilung:g=>{g.r(6,1,4,14,g.m);g.r(1,6,14,4,g.m);g.r(7,2,2,12,g.L);g.r(2,7,12,2,g.L);g.c(8,8,1.4,g.W);},
  lichtkugel:g=>{for(let k=0;k<8;k++){const a=k*Math.PI/4;g.l(8+Math.cos(a)*5,8+Math.sin(a)*5,8+Math.cos(a)*7.5,8+Math.sin(a)*7.5,1.2,g.m);}g.c(8,8,4.2,g.L);g.c(7.5,7.5,2.4,g.W);},
  heiligerstrahl:g=>{g.p([[5,0],[11,0],[10,13],[6,13]],g.L);g.r(7,0,2,13,g.W);g.r(2,13,12,3,g.m);g.c(8,13,2.4,g.W);},
  schutzkreis:g=>{g.p([[2,12],[3,6],[8,2],[13,6],[14,12]],g.L);g.p([[4,12],[5,7],[8,4],[11,7],[12,12]],'#3a3010');g.r(0,12,16,3,g.m);g.ring(8,9,6,1,g.W);},
  segen:g=>{g.p([[8,0],[10,5],[15,5],[11,8],[13,14],[8,10],[3,14],[5,8],[1,5],[6,5]],g.m);g.p([[8,3],[9,6],[12,6],[10,8],[11,11],[8,9],[5,11],[6,8],[4,6],[7,6]],g.L);},
  blenden:g=>{for(let k=0;k<12;k++){const a=k*Math.PI/6;g.l(8,8,8+Math.cos(a)*7.5,8+Math.sin(a)*7.5,k%2?1:1.8,k%2?g.L:g.m);}g.c(8,8,3.2,g.W);},
  laeuterung:g=>{g.p([[8,1],[9.5,6.5],[15,8],[9.5,9.5],[8,15],[6.5,9.5],[1,8],[6.5,6.5]],g.L);g.c(8,8,1.8,g.W);g.p([[13,1],[14,3],[16,3.5],[14,4],[13,6],[12,4],[10,3.5],[12,3]],g.W);},
  morgenroete:g=>{for(let k=0;k<7;k++){const a=Math.PI+k*Math.PI/6;g.l(8,11,8+Math.cos(a)*8,11+Math.sin(a)*8,1.4,g.L);}g.c(8,11,4.6,g.m);g.c(8,11,3,g.L);g.r(0,11,16,5,'#e8a040');g.r(0,12,16,4,'#b86a30');},
  // Neutral
  geschoss:g=>{g.l(2,13,5,8,1.6,g.L);g.l(5,8,10,6,1.6,g.L);g.c(12,5,3,g.m);g.c(12,5,1.8,g.W);g.c(3,14,1,g.m);},
  telekinese:g=>{g.p([[3,2],[7,2],[7,9],[9,9],[9,2],[13,2],[13,10],[8,15],[3,10]],g.m);g.r(3,2,4,3,GRY2);g.r(9,2,4,3,GRY2);g.c(8,13,1,g.W);},
  schweben:g=>{g.l(3,14,12,3,1.6,BONE);g.p([[12,2],[14,4],[7,13],[4,13]],g.L);g.p([[12,2],[9,3],[4,11],[6,12]],g.W);},
  blinzeln:g=>{g.c(3,8,2.6,g.d);g.c(13,8,2.8,g.L);g.c(13,8,1.4,g.W);for(const x of[6,8,10])g.r(x,7.5,1,1,g.m);g.p([[9,5],[12,8],[9,11]],g.m);},
  magielicht:g=>{g.r(6,13,4,3,GRY);g.l(8,13,8,11,1,GRY);g.c(8,7,4.4,g.L);g.c(8,7,2.6,g.W);g.ring(8,7,6.5,1,g.m);},
  rueckruf:g=>{g.p([[1,8],[8,2],[15,8]],'#b04a2a');g.r(3,8,10,7,BONE);g.r(7,10,2,5,BRN);g.c(13,3,1.6,g.L);g.ring(13,3,2.6,.8,g.m);},
  manaschild:g=>{g.p([[8,1],[14,4],[14,10],[8,15],[2,10],[2,4]],'#4a8cff');g.p([[8,3],[12,5],[12,9],[8,13],[4,9],[4,5]],'#9cd4ff');g.c(8,8,1.8,g.W);},
  spueren:g=>{g.p([[0,8],[5,3],[11,3],[16,8],[11,13],[5,13]],g.W);g.c(8,8,3.6,g.m);g.c(8,8,1.8,g.d);g.c(7,7,.9,g.W);}};
const MAG_SICON={};
function spellIcon(id){if(MAG_SICON[id])return MAG_SICON[id];const S=SPELLS[id],E=EPAL[S?S.el:'neutral'],c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');
  const g={d:E[0],m:E[1],L:E[2],W:E[3],
    c:(cx,cy,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();},
    r:(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);},
    l:(a,b,c2,d,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.beginPath();x.moveTo(a,b);x.lineTo(c2,d);x.stroke();},
    p:(pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill();},
    ring:(cx,cy,r,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();},
    flame:(cx,by,h,w)=>{g.p([[cx-w,by],[cx+w,by],[cx+w*.9,by-h*.45],[cx+w*.3,by-h*.7],[cx,by-h],[cx-w*.3,by-h*.7],[cx-w*.9,by-h*.45]],E[1]);g.p([[cx-w*.55,by],[cx+w*.55,by],[cx+w*.5,by-h*.4],[cx,by-h*.7],[cx-w*.5,by-h*.4]],E[2]);g.c(cx,by-h*.18,w*.3,E[3]);}};
  try{(MAG_GLYPH[id]||(q=>q.c(8,8,5,q.m)))(g);}catch(e){}
  const D=x.getImageData(0,0,16,16),A=D.data;for(let i=0;i<256;i++)A[i*4+3]=A[i*4+3]>100?255:0;
  const O=x.createImageData(16,16);for(let i=0;i<256;i++){const X=i%16,Y=(i/16)|0;if(A[i*4+3]){for(let k=0;k<4;k++)O.data[i*4+k]=A[i*4+k];continue;}
    for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=X+a,ny=Y+b;if(nx<0||ny<0||nx>15||ny>15)continue;if(A[(ny*16+nx)*4+3]){O.data[i*4]=8;O.data[i*4+1]=10;O.data[i*4+2]=12;O.data[i*4+3]=255;break;}}}
  x.putImageData(O,0,0);return MAG_SICON[id]=c.toDataURL();}

/* ---------- Stil ---------- */
{const st=document.createElement('style');st.textContent=`
#magBook .mb-panel{width:min(1040px,100%);max-height:min(94vh,800px);display:flex;flex-direction:column;gap:10px}
#magBook .mb-sub{margin:0;color:var(--muted);font-size:14px}
#magBook .mb-sub b{color:var(--gold);font-weight:400}
#magBook .mb-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px;background:rgba(6,10,7,.45)}
#magBook .mb-bar>span{font:12px var(--f-title);letter-spacing:.12em;color:var(--muted);margin-right:6px}
.msl{position:relative;width:52px;height:52px;display:grid;place-items:center;background:#111914;box-shadow:inset 3px 3px 0 var(--edge-dark),inset -3px -3px 0 #2a3c2f;cursor:pointer}
.msl img{width:36px;height:36px;image-rendering:pixelated;pointer-events:none}
.msl .k{position:absolute;left:4px;top:1px;font:12px var(--f-title);color:var(--gold);text-shadow:1px 1px 0 #000;pointer-events:none}
.msl.over{box-shadow:inset 0 0 0 3px var(--gold)}
.msl.pick{box-shadow:inset 0 0 0 2px #fff}
#magBook .mb-tabs{display:flex;flex-wrap:wrap;gap:6px}
#magBook .mb-tab{display:flex;align-items:center;gap:6px;border:0;cursor:pointer;background:var(--panel-2);color:var(--ink);padding:6px 10px 8px;font:15px var(--f-ui);box-shadow:inset 0 -3px 0 var(--edge-dark),inset 0 0 0 2px color-mix(in srgb,var(--c) 35%,transparent)}
#magBook .mb-tab small{color:var(--muted);font-size:12px}
#magBook .mb-tab.on{background:color-mix(in srgb,var(--c) 28%,var(--panel));color:#fff;box-shadow:inset 0 0 0 2px var(--c),inset 0 -3px 0 var(--edge-dark)}
#magBook .mb-tab img,#magBook .mb-card img,#spellBar img,#magFx img{image-rendering:pixelated}
#magBook .mb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;overflow:auto;padding:2px 4px 6px 2px;min-height:0}
#magBook .mb-card{position:relative;display:grid;grid-template-columns:44px 1fr;gap:3px 10px;text-align:left;color:var(--ink);background:var(--panel-2);padding:10px 12px 12px;font:14px var(--f-ui);box-shadow:inset 0 -3px 0 var(--edge-dark),inset 4px 0 0 var(--c);cursor:grab;user-select:none}
#magBook .mb-card:hover{background:color-mix(in srgb,var(--c) 14%,var(--panel-2))}
#magBook .mb-card.pick{box-shadow:inset 0 0 0 2px #fff,inset 0 -3px 0 var(--edge-dark)}
#magBook .mb-card.off{cursor:default;opacity:.55;filter:saturate(.25)}
#magBook .mb-card img{width:40px;height:40px;grid-row:span 2}
#magBook .mb-card b{font-size:16px;color:#fff;font-weight:500}
#magBook .mb-card .mb-lv{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}
#magBook .mb-card .mb-lv i{display:flex;gap:2px}
#magBook .mb-card .mb-lv i u{display:block;width:6px;height:8px;background:#2a3c2f}
#magBook .mb-card .mb-lv i u.f{background:var(--c)}
#magBook .mb-card .mb-cost{grid-column:1/-1;font-size:12px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap}
#magBook .mb-card .mb-cost .hp{color:#ff8a94}#magBook .mb-card .mb-cost .mp{color:#8ab8ff}#magBook .mb-card .mb-cost .big{color:var(--gold)}
#magBook .mb-card p{grid-column:1/-1;margin:2px 0 0;font-size:14px;line-height:1.35;color:#d4ddcf}
#magBook .mb-card .mb-lock{grid-column:1/-1;font-size:12px;color:var(--gold)}
#spellBar{position:absolute;left:50%;bottom:calc(var(--s) + 34px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;gap:4px;padding:4px;background:rgba(8,12,9,.5);pointer-events:none}
#spellBar .ss{position:relative;width:42px;height:42px;display:grid;place-items:center;background:#111914;box-shadow:inset 2px 2px 0 var(--edge-dark),inset -2px -2px 0 #2a3c2f}
#spellBar .ss img{width:30px;height:30px}
#spellBar .ss.empty{opacity:.45}
#spellBar .ss.low img{filter:grayscale(1) brightness(.6)}
#spellBar .ss.act{box-shadow:inset 0 0 0 2px var(--c)}
#spellBar .ss .k{position:absolute;left:3px;top:0;font:11px var(--f-title);color:var(--gold);text-shadow:1px 1px 0 #000}
#spellBar .ss .cd{position:absolute;inset:2px;background:conic-gradient(rgba(6,10,7,.8) var(--p,0%),transparent 0)}
#spellBar .ss em{position:absolute;inset:0;display:grid;place-items:center;font:700 14px var(--f-ui);color:#fff;font-style:normal;text-shadow:0 1px 0 #000,1px 0 0 #000}
#spellBar .ss .lv{position:absolute;right:3px;bottom:0;font:10px var(--f-title);color:#fff;text-shadow:1px 1px 0 #000}
#magFx{position:absolute;right:16px;bottom:16px;display:flex;flex-direction:column;align-items:flex-end;gap:3px;pointer-events:none;font-family:var(--f-ui)}
#magFx span{display:flex;align-items:center;gap:6px;background:rgba(6,10,7,.72);padding:2px 8px 3px;font-size:13px;color:#fff;box-shadow:inset 3px 0 0 var(--c)}
#magFx span img{width:16px;height:16px}
#magFx span i{font-style:normal;color:var(--muted);font-variant-numeric:tabular-nums}
.mag-mark{position:absolute;left:0;top:0;font:13px var(--f-ui);color:#fff;background:rgba(6,10,7,.6);padding:1px 6px 2px;white-space:nowrap;pointer-events:none;box-shadow:inset 0 -2px 0 var(--c)}
@media (max-width:640px){#magBook .mb-grid{grid-template-columns:1fr}#spellBar .ss{width:34px;height:34px}#spellBar .ss img{width:24px;height:24px}}
`;document.head.appendChild(st);}

/* ---------- Zaubermenü ---------- */
const magBookEl=document.createElement('div');magBookEl.id='magBook';magBookEl.className='overlay';magBookEl.hidden=true;
magBookEl.innerHTML=`<div class="panel notch mb-panel" role="dialog" aria-labelledby="mbTitle">
  <div class="panel-head"><div><h2 id="mbTitle">Zauber</h2><p class="mb-sub" id="mbSub"></p></div><button id="mbClose" class="ccb">Zurück</button></div>
  <div class="mb-bar" id="mbBar"></div>
  <div class="mb-tabs" id="mbTabs"></div><div class="mb-grid" id="mbList"></div></div>`;
document.body.appendChild(magBookEl);
let magTab='fire',magPick=null;
function magCostHtml(S){const out=[],hp=S.hp,lv=Math.max(1,magLv(S.id));
  if(hp)out.push(`<span class="hp">${typeof hp==='function'?({blutopfer:'20 % Leben',blutgolem:'⅓ deines Lebens',blutleben:'½ deines Lebens'}[S.id]||'Leben'):hp+' Leben'}</span>`);
  if(S.chan)out.push(`<span class="mp">${Math.round(S.chanCost*(1-.03*(lv-1)))} Mana/s</span>`);else{const m=magManaCost(S);if(m)out.push(`<span class="mp">${m} Mana</span>`);}
  if(S.cd>=1)out.push(`<span>${S.cd>=60?Math.round(S.cd/60)+' min':S.cd+' s'} Abklingzeit</span>`);if(S.chan)out.push('<span>gedrückt halten</span>');if(S.big)out.push('<span class="big">Großer Zauber</span>');return out.join('');}
function renderMagBook(){const bar=spellBar();
  $('mbSub').innerHTML=cheatOn()?'<b>Cheat-Modus:</b> alle Zauber sind frei (Stufe 10).':'Zauber lernst du mit <b>Schriftrollen</b> von seltenen Händlern. Jede Schriftrolle hebt einen Zauber um eine Stufe (bis 10). Ziehe gelernte Zauber in die Leiste, die Tasten <b>1–7</b> wirken sie.';
  $('mbBar').innerHTML='<span>ZAUBERLEISTE</span>'+bar.map((id,i)=>`<div class="msl${magPick&&!id?' pick':''}" data-slot="${i}" draggable="${id?'true':'false'}" title="${id?SPELLS[id].name+' – Rechtsklick: entfernen':'Leer'}" ${id?`style="--c:${ELEM[SPELLS[id].el].c}"`:''}><span class="k">${i+1}</span>${id?`<img src="${spellIcon(id)}" alt="">`:''}</div>`).join('');
  $('mbTabs').innerHTML=Object.keys(ELEM).map(k=>{const all=SPELL_ORDER.filter(id=>SPELLS[id].el===k&&!SPELLS[id].hidden),n=all.filter(spellKnown).length;
    return`<button class="mb-tab${k===magTab?' on':''}" data-el="${k}" style="--c:${ELEM[k].c}"><img src="${magIcon(k)}" width="16" height="16" alt="">${ELEM[k].n} <small>${n}/${all.length}</small></button>`;}).join('');
  $('mbList').innerHTML=SPELL_ORDER.filter(id=>SPELLS[id].el===magTab&&!SPELLS[id].hidden).map(id=>{const S=SPELLS[id],lv=magLv(id),k=spellKnown(id);
    return`<div class="mb-card${k?'':' off'}${magPick===id?' pick':''}" data-id="${id}" draggable="${k?'true':'false'}" style="--c:${ELEM[S.el].c}"><img src="${spellIcon(id)}" alt=""><b>${S.name}</b>
      <div class="mb-lv">${k?`Stufe ${lv}/10`:'Nicht gelernt'}<i>${Array.from({length:10},(_,j)=>`<u class="${j<lv?'f':''}"></u>`).join('')}</i></div>
      <div class="mb-cost">${magCostHtml(S)}</div><p>${S.desc}</p>${k?'':'<div class="mb-lock">Schriftrollen gibt es nur bei wenigen Händlern – und sie sind teuer.</div>'}</div>`;}).join('');}
function magSetSlot(i,id){const bar=spellBar();if(id){const j=bar.indexOf(id);if(j>=0&&j!==i)bar[j]=bar[i]||null;}bar[i]=id||null;magPick=null;renderMagBook();magHud();Snd.click();}
magBookEl.addEventListener('click',e=>{const t=e.target.closest('.mb-tab');if(t){magTab=t.dataset.el;Snd.click();renderMagBook();return;}
  const c=e.target.closest('.mb-card');if(c){if(!spellKnown(c.dataset.id)){Snd.click();return;}magPick=magPick===c.dataset.id?null:c.dataset.id;Snd.click();renderMagBook();return;}
  const s=e.target.closest('.msl');if(s){const i=+s.dataset.slot;if(magPick){magSetSlot(i,magPick);return;}return;}
  if(e.target.id==='mbClose'){Snd.click();closeMagBook();}});
magBookEl.addEventListener('contextmenu',e=>{const s=e.target.closest('.msl');if(s){e.preventDefault();magSetSlot(+s.dataset.slot,null);}});
// Ziehen und Ablegen
magBookEl.addEventListener('dragstart',e=>{const c=e.target.closest('.mb-card'),s=e.target.closest('.msl');let v=null;
  if(c&&spellKnown(c.dataset.id))v='c:'+c.dataset.id;else if(s&&spellBar()[+s.dataset.slot])v='s:'+s.dataset.slot;if(!v){e.preventDefault();return;}
  e.dataTransfer.setData('text/plain',v);e.dataTransfer.effectAllowed='move';
  const id=v[0]==='c'?v.slice(2):spellBar()[+v.slice(2)];const im=new Image();im.src=spellIcon(id);try{e.dataTransfer.setDragImage(im,8,8);}catch(_){}});
magBookEl.addEventListener('dragover',e=>{const s=e.target.closest('.msl');if(s||e.target.closest('.mb-grid')){e.preventDefault();}document.querySelectorAll('#mbBar .msl').forEach(q=>q.classList.toggle('over',q===s));});
magBookEl.addEventListener('dragend',()=>document.querySelectorAll('#mbBar .msl').forEach(q=>q.classList.remove('over')));
magBookEl.addEventListener('drop',e=>{e.preventDefault();const v=e.dataTransfer.getData('text/plain')||'';const s=e.target.closest('.msl'),bar=spellBar();
  if(s){const i=+s.dataset.slot;if(v.startsWith('c:'))magSetSlot(i,v.slice(2));else if(v.startsWith('s:')){const j=+v.slice(2),a=bar[j];bar[j]=bar[i];bar[i]=a;renderMagBook();magHud();Snd.click();}}
  else if(v.startsWith('s:')&&e.target.closest('.mb-grid')){magSetSlot(+v.slice(2),null);}});
function openMagBook(){if(state==='inventory')closeInventory();if(state!=='playing')return;state='magbook';keys.clear();MAG.hold=null;if(MAG.chan)magChanStop();promptEl.hidden=true;
  if(document.pointerLockElement){suppressPause=true;document.exitPointerLock();}magPick=null;renderMagBook();magBookEl.hidden=false;updateLockHint();}
function closeMagBook(){magBookEl.hidden=true;state='playing';openInventory();}
// Knopf im Inventar
{const sk=document.getElementById('invSkills');if(sk){const b=document.createElement('button');b.className='ccb';b.id='invSpells';b.textContent='Zauber';sk.after(b);b.addEventListener('click',()=>{Snd.click();openMagBook();});}}

/* ---------- Tasten 1–7: Zauber wirken (die Hotbar läuft jetzt über das Mausrad) ---------- */
addEventListener('keydown',e=>{
  if(state==='magbook'){if(e.code==='Escape'||e.code===settings.keys.inventory){e.preventDefault();e.stopImmediatePropagation();closeMagBook();}return;}
  if(state!=='playing'||!/^Digit[1-7]$/.test(e.code))return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
  const i=+e.code.slice(5)-1,id=spellBar()[i];if(!id){if(!SPELL_ORDER.some(spellKnown))toast('Du kennst noch keine Zauber. Schriftrollen gibt es bei seltenen Händlern.');return;}
  if(SPELLS[id].chan)MAG.hold=e.code;castSpell(id);},true);
addEventListener('keyup',e=>{if(MAG.hold&&e.code===MAG.hold)MAG.hold=null;},true);
addEventListener('blur',()=>{MAG.hold=null;});

/* ---------- Anzeige: Zauberleiste und aktive Effekte ---------- */
const spellBarEl=document.createElement('div');spellBarEl.id='spellBar';document.getElementById('hud').appendChild(spellBarEl);
const magFxEl=document.createElement('div');magFxEl.id='magFx';document.getElementById('hud').appendChild(magFxEl);
const MAG_MARKS=[];
function magHud(){const bar=spellBar();
  spellBarEl.innerHTML=bar.map((id,i)=>{const S=id&&SPELLS[id];return`<div class="ss${S?'':' empty'}" ${S?`style="--c:${ELEM[S.el].c}"`:''}>${S?`<img src="${spellIcon(id)}" alt=""><i class="cd"></i><em></em><span class="lv">${magLv(id)||''}</span>`:''}<span class="k">${i+1}</span></div>`;}).join('');
  magFxEl.innerHTML=Object.keys(MAG.fx).filter(k=>MAG_FXN[k]).map(k=>{const[n,el]=MAG_FXN[k];return`<span data-k="${k}" style="--c:${ELEM[el].c}"><img src="${magIcon(el)}" alt="">${n}<i></i></span>`;}).join('');
  magHudT=0;}
let magHudT=0,magHudSig='';
function magHudTick(dt){const play=state==='playing',bar=spellBar(),any=bar.some(Boolean);
  spellBarEl.style.display=play&&any?'':'none';magFxEl.style.display=play||state==='inventory'||state==='dialog'?'':'none';
  const sig=bar.join(',')+'|'+bar.map(id=>id?magLv(id):0).join('');if(sig!==magHudSig){magHudSig=sig;magHud();}
  magHudT-=dt;if(magHudT>0)return;magHudT=.1;
  if(play&&any){const els=spellBarEl.children;bar.forEach((id,i)=>{const el=els[i];if(!el||!id)return;const S=SPELLS[id],rem=(MAG.cd[id]||0)-time,p=rem>0?Math.min(100,rem/(S.cd||1)*100):0;
    el.querySelector('.cd').style.setProperty('--p',p.toFixed(1)+'%');el.querySelector('em').textContent=rem>0?(rem<1?rem.toFixed(1):Math.ceil(rem)):'';
    const low=!cheatOn()&&(P.stats.mp<magManaCost(S)||(S.hp&&P.stats.hp<=(typeof S.hp==='function'?S.hp():S.hp)+1));el.classList.toggle('low',!!low);el.classList.toggle('act',!!(MAG.chan&&MAG.chan.id===id));});}
  for(const s of magFxEl.querySelectorAll('span')){const F=MAG.fx[s.dataset.k];if(!F)continue;const r=Math.max(0,F.until-time);let t=r>=60?Math.floor(r/60)+':'+String(Math.floor(r%60)).padStart(2,'0'):Math.ceil(r)+' s';
    if(s.dataset.k==='bubble')t=Math.ceil(F.hp)+' · '+t;s.querySelector('i').textContent=t;}
  // Spüren: Markierungen
  const M=MAG.fx.sense&&MAG.fx.sense.marks||[];while(MAG_MARKS.length<M.length){const el=document.createElement('div');el.className='mag-mark';document.getElementById('hud').appendChild(el);MAG_MARKS.push(el);}
  MAG_MARKS.forEach((el,i)=>{const m=M[i];if(!m||!play){el.hidden=true;return;}_bv.set(m[0],m[1]+.5,m[2]);const d=_bv.distanceTo(camera.position);_bv.project(camera);
    if(_bv.z>1||Math.abs(_bv.x)>1.05||Math.abs(_bv.y)>1.05){el.hidden=true;return;}el.hidden=false;el.textContent=m[3]+' · '+Math.round(d)+' m';el.style.setProperty('--c',m[4]);
    el.style.transform=`translate(${((_bv.x+1)/2*innerWidth).toFixed(1)}px,${((1-_bv.y)/2*innerHeight).toFixed(1)}px) translate(-50%,-100%)`;});}
// Element-Symbole (für Reiter und Effekte)
const MAG_ICON={};
function magIcon(el){if(MAG_ICON[el])return MAG_ICON[el];const id=SPELL_ORDER.find(i=>SPELLS[i].el===el&&!SPELLS[i].hidden);return MAG_ICON[el]=spellIcon({fire:'feuerball',water:'blasenschild',nature:'wachstum',dark:'finsternis',blood:'lebensraub',light:'lichtkugel',neutral:'geschoss'}[el]||id);}
{const a=startGame;startGame=function(){const r=a.apply(this,arguments);setTimeout(()=>{magHudSig='';magHud();},50);return r;};}
magHud();
