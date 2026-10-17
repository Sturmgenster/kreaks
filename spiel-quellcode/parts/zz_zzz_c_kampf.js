/* =========================================================
   0.0.112 · Bogen und Pfeile, Talentbaum
   - Bogen (Linksklick schießt einen Pfeil, braucht Pfeile im Inventar). Trifft Gegner, Tiere und Meerestiere an der Oberfläche
   - Talentbaum im Skill-Fenster (K): 1 Talentpunkt pro Level, 4 Zweige mit je 4 Talenten (bis Stufe 3)
   ========================================================= */
Object.assign(ITEMS,{bow:{name:'Bogen',plural:'Bögen',weapon:'bow',dur:200},arrow:{name:'Pfeil',plural:'Pfeile'}});
Object.assign(ITEM_DESC,{bow:'Linksklick: Pfeil abschießen. Braucht Pfeile im Inventar',arrow:'Munition für den Bogen'});
WEAPONS.bow={cost:4,dmg:6,range:1.8,cd:.8};
RECIPES.push({id:'bow',need:{stick:3,rope:1}},{id:'arrow',n:6,need:{stick:1,stone:1}});
{const a=craftSprites;craftSprites=function(list){a(list);try{
  {const p=new Px(10,26),W=pal(['#4a2c14','#7a4a22','#a0682e']);for(let y=0;y<26;y++){const x=Math.round(6-Math.sin(y/25*Math.PI)*4.5);p.set(x,y,W[2]);p.set(x+1,y,W[1]);}for(let y=1;y<25;y++)p.set(7.5,y,hex('#e8e0c8'));outline(p);list.push(['bow',p.done()]);}
  {const p=new Px(18,6),W=pal(['#5a3a1c','#8a6034']);for(let x=2;x<14;x++){p.set(x,3,W[1]);}mrPoly(p,[[13,1],[17,3],[13,5]],hex('#a8acb4'));mrPoly(p,[[0,1],[4,3],[0,5]],hex('#e8e8e8'));p.set(2,3,hex('#c83a2a'));outline(p);list.push(['arrow',p.done()]);}
}catch(e){console.error('Bogen: Symbole',e);}};}
// ---------- Talente ----------
const TAL=[
  ['Kampf','#d8433f',[['blade','Klingenmeister','+8 % Nahkampfschaden'],['archer','Scharfschütze','+15 % Bogenschaden'],['skin','Eisenhaut','−5 % erlittener Schaden'],['rage','Kampfwut','+12 % Schaden unter 40 % Leben']]],
  ['Magie','#4b86e6',[['mflow','Manafluss','+25 % Mana-Erholung'],['mres','Arkane Reserve','+15 maximales Mana'],['mpow','Zauberkraft','+8 % Zauberschaden'],['scholar','Gelehrter','+8 % Erfahrung']]],
  ['Handwerk','#d8a030',[['wood','Holzfäller','+20 % schneller Holz hacken'],['stone','Bergmann','+20 % schneller Stein abbauen'],['luck','Glückspilz','10 % Chance auf doppelte Beute'],['tool','Werkzeugpflege','Werkzeuge halten 15 % länger']]],
  ['Überleben','#6fbf3c',[['tough','Zähigkeit','+10 maximales Leben'],['endur','Ausdauer','+10 maximale Ausdauer'],['diver','Taucher','+30 % Luft unter Wasser'],['runner','Läufer','+4 % Lauftempo']]]];
const TAL_MAX=3,tal=k=>((FLAGS.tal||{})[k]||0);
const talSpent=()=>Object.values(FLAGS.tal||{}).reduce((a,b)=>a+b,0),talPoints=()=>Math.max(0,(FLAGS.level||0)-talSpent());
function talBuy(k){if(talPoints()<=0)return;const T=TAL.find(t=>t[2].some(q=>q[0]===k)),i=T[2].findIndex(q=>q[0]===k);if(i>0&&tal(T[2][i-1][0])<1)return;if(tal(k)>=TAL_MAX)return;
  FLAGS.tal=FLAGS.tal||{};FLAGS.tal[k]=tal(k)+1;try{Snd.levelUp();}catch(e){}if(['tough','endur','mres'].includes(k)){const S0=Object.assign({},P.stats);applyChar(true);P.stats.hp=Math.min(P.stats.maxHp,S0.hp);P.stats.st=Math.min(P.stats.maxSt,S0.st);P.stats.mp=Math.min(P.stats.maxMp,S0.mp);renderStats();}renderSkills();renderXP();saveGame();}
{const st=document.createElement('style');st.textContent=`.sk-panel{max-height:92vh;overflow:auto}#talBox{display:flex;flex-direction:column;gap:8px;border-top:2px solid #a8762e55;padding-top:10px}
#talBox h3{margin:0;font-family:var(--f-title);font-size:16px;color:var(--gold)}#talPts{color:var(--muted);font-size:13px}#talGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.tal-col{display:flex;flex-direction:column;gap:6px}.tal-col>b{font-family:var(--f-title);font-size:13px;color:var(--c);text-align:center}
.tal{background:var(--panel-2);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--c) 40%,transparent);padding:6px 6px 7px;display:flex;flex-direction:column;gap:3px;font-size:12px}
.tal b{color:var(--gold);font-size:12px}.tal small{color:var(--muted);font-size:11px;line-height:1.25}.tal i{display:flex;gap:3px}.tal i span{width:10px;height:10px;background:#0c140c;box-shadow:inset 0 0 0 1px var(--c)}.tal i span.on{background:var(--c)}
.tal button{font-size:11px;padding:3px 4px}.tal.lock{opacity:.5}@media(max-width:560px){#talGrid{grid-template-columns:repeat(2,1fr)}}`;document.head.appendChild(st);
  const box=document.createElement('div');box.id='talBox';box.innerHTML='<h3>Talente</h3><div id="talPts"></div><div id="talGrid"></div>';const pan=document.querySelector('#skillsOv .sk-panel');if(pan)pan.appendChild(box);
  box.addEventListener('click',e=>{const b=e.target.closest('button[data-tal]');if(b){talBuy(b.dataset.tal);}});}
{const a=renderSkills;renderSkills=function(){a();const tp=talPoints(),el=$('talPts');if(!el)return;el.innerHTML=tp>0?`<b>${tp}</b> ${tp===1?'freier Talentpunkt':'freie Talentpunkte'} · du bekommst einen pro Level`:`Keine freien Talentpunkte · jedes Level bringt einen`;
  $('talGrid').innerHTML=TAL.map(([bn,col,L])=>`<div class="tal-col" style="--c:${col}"><b>${bn}</b>`+L.map(([k,n,d],i)=>{const r=tal(k),lock=i>0&&tal(L[i-1][0])<1;
    return`<div class="tal${lock?' lock':''}"><b>${n}</b><small>${d} pro Stufe</small><i>${[0,1,2].map(j=>`<span class="${j<r?'on':''}"></span>`).join('')}</i><button class="ccb" data-tal="${k}"${tp<=0||lock||r>=TAL_MAX?' disabled':''}>${r>=TAL_MAX?'Voll':lock?'Gesperrt':'Lernen'}</button></div>`;}).join('')+'</div>').join('');};}
// Wirkungen
{const a=charStats;charStats=function(c){const S=a(c);try{if(typeof FLAGS!=='undefined'&&FLAGS.tal){S.hp+=10*tal('tough');S.st+=10*tal('endur');if(!S.noMagic)S.mp+=15*tal('mres');}}catch(e){}return S;};}
{const a=weaponMult;weaponMult=function(t){let m=a(t);if(weaponOf()!=='bow')m*=1+.08*tal('blade');if(P.stats&&P.stats.hp<P.stats.maxHp*.4)m*=1+.12*tal('rage');return m;};}
{const a=takeDamage;takeDamage=function(n){return a(n*(1-.05*tal('skin')));};}
{const a=magPower;magPower=function(el){return a(el)*(1+.08*tal('mpow'));};}
{const a=gainXP;gainXP=function(n){return a(n*(1+.08*tal('scholar')));};}
{const a=gatherPower;gatherPower=function(kind){const p=a(kind);return p*(1+.2*tal(kind==='wood'?'wood':kind==='stone'?'stone':'_'));};}
{const a=wearTool;wearTool=function(){if(Math.random()<.15*tal('tool'))return;return a();};}
{const a=killEnt;killEnt=function(e,by){const was=!e.dead;a(e,by);if(was&&e.dead&&e.fac==='demon'&&(by==='player'||!by)&&Math.random()<.1*tal('luck')){for(const[id,n,p]of e.d.loot||[])if(Math.random()<p)spawnDrop(id,n,e.x,e.y+.4,e.z);}};}
{const a=swAir;swAir=function(dt){const air0=SW.air;a(dt);if(SW.head&&SW.air<air0&&tal('diver'))SW.air+=(air0-SW.air)*(.3*tal('diver'))/(1+.3*tal('diver'));};}
{const a=updatePlayer;updatePlayer=function(dt){const x0=P.x,z0=P.z,mp0=P.stats?P.stats.mp:0;a(dt);if(!SW.on&&!P.riding&&tal('runner')){const k=1+.04*tal('runner');P.x=x0+(P.x-x0)*k;P.z=z0+(P.z-z0)*k;}
  if(tal('mflow')&&P.stats&&P.stats.maxMp&&P.stats.mp>mp0)P.stats.mp=Math.min(P.stats.maxMp,P.stats.mp+(P.stats.mp-mp0)*.25*tal('mflow'));};}
// ---------- Bogen ----------
const ARW=[];
{const a=attack;attack=function(){if(weaponOf()!=='bow')return a();if(state!=='playing'||time<(P.atkReady||0))return;
  if(SW.under){toast('Unter Wasser kannst du nicht schießen.');P.atkReady=time+1;return;}
  if(countItem('arrow')<1){toast('Du hast keine Pfeile. Aus 1 Stock und 1 Stein baust du 6 Pfeile.');P.atkReady=time+1;return;}
  if(P.stats.st<4){toast('Zu wenig Ausdauer');return;}P.stats.st-=4;P.atkReady=time+.75;P.atkT=time;P.atkDur=.3;P.lastAction=time;removeItem('arrow',1);renderInv();wearTool();
  const L=lookDir(),sp=38,dmg=24*(1+.15*tal('archer'))*(P.stats.hp<P.stats.maxHp*.4?1+.12*tal('rage'):1)*(buffOn&&buffOn('str')?1.5:1),x=P.x+L.x*.6,y=P.y+P.eye-.15+L.y*.6,z=P.z+L.z*.6;
  const s={x,y,z,vx:L.x*sp,vy:L.y*sp,vz:L.z*sp,t:0,life:3,dmg,fac:'ally',orb:'orb_arrow',size:.32,col:0xe8e0c8,grav:7,aoe:0,home:0,src:null,by:'player',arrow:1};SHOTS.push(s);ARW.push(s);try{Snd.whoosh(1100,.08);}catch(e){}renderStats();};}
function arwTick(){for(let i=ARW.length-1;i>=0;i--){const s=ARW[i];if(!SHOTS.includes(s)){ARW.splice(i,1);continue;}let hit=null;
  for(const a of animals){if(!a.alive||a.tame&&!a.wlFree&&a.pen)continue;if(a.wlFree)continue;if(Math.hypot(a.x-s.x,a.z-s.z)<Math.max(.5,a.w*.35)&&s.y>a.y-.2&&s.y<a.y+a.h+.2){hit=a;break;}}
  if(hit){hurtAnimal(hit,s.dmg);SHOTS.splice(SHOTS.indexOf(s),1);ARW.splice(i,1);for(let k=0;k<6;k++)spawnParticle(s.x,s.y,s.z,(Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2,0x8a1018,.4,.2);continue;}
  for(const c of SEAL){if(c.dead)continue;if(Math.hypot(c.x-s.x,c.y-s.y,c.z-s.z)<c.S.len*.5+.4){seaHurt(c,s.dmg,'player');SHOTS.splice(SHOTS.indexOf(s),1);ARW.splice(i,1);hit=c;break;}}}}
{const a=updateAnimals;updateAnimals=function(dt){a(dt);try{arwTick();}catch(e){if(!arwTick.err){arwTick.err=1;console.error('Pfeile',e);}}};}
