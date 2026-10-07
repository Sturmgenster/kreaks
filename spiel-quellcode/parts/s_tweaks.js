/* =========================================================
   V68 · Kleinigkeiten
   - Keine Hinweis-Einblendungen mehr über der Hotbar
   - Obsidian erst ab Eisenspitzhacke
   - Gegenstände in der Hand (Ansicht von außen): größer, richtig gegriffen, gut erkennbar
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent='#toast{display:none!important}';document.head.appendChild(st);})();
// ---------- Obsidian: mindestens Eisen ----------
HV.wl_obsid.minTier=3;
{const hh0=harvHit;harvHit=function(W,strict){const R=Math.max(2.4,(W&&W.range||2)+.6),b=hvTarget(R);
  if(b&&b._hv&&b._hv.minTier&&!b._gone){const H=heldItem(),it=H&&H.it;if(!(it&&it.tool==='pick'&&(it.tier||0)>=b._hv.minTier)){if(strict)return false;P.lastAction=time;try{Snd.clink(.7);}catch(e){}
      for(let i=0;i<5;i++)spawnParticle(b.x+(Math.random()-.5)*.4,b.y+Math.min(b.h*.4,1),b.z+(Math.random()-.5)*.4,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,0xfff0c0,.25,.1);return true;}}
  return hh0(W,strict);};}
// ---------- Gegenstände in der Hand ----------
function heldKind(id){const it=ITEMS[id]||{};if(id==='akuma'||id==='nattafang')return'long';if(id==='torch')return'torch';if(id==='rod')return'rod';
  if(id==='shield'||id==='bow'||it.slot==='off')return'shield';if(it.tool==='pick'||/_pick$/.test(id)||it.tool==='axe'||/_axe$/.test(id))return'tool';
  if(it.weapon==='spear'||id==='spear')return'spear';if(id==='dagger'||it.weapon==='dagger')return'dagger';if(it.weapon==='axe')return'tool';if(it.weapon)return'sword';return'item';}
const HELD_LEN={sword:28,tool:25,spear:38,rod:33,dagger:17,long:40,torch:16};
function drawHeld2(ctx,id,ic,hand,ox,flip,ang,main){const k=heldKind(id),w=ic.width,h=ic.height,hx=ox+hand[0]+(flip?1.5:-.5),hy=hand[1]+1.5;ctx.save();ctx.imageSmoothingEnabled=false;
  if(k==='item'){const s=Math.min(1.25,15/Math.max(w,h));ctx.translate(hx,hy);if(flip)ctx.scale(-1,1);if(ang)ctx.rotate(ang*.5);ctx.drawImage(ic,-w*s*.45,-h*s*.72,w*s,h*s);ctx.restore();return;}
  if(k==='shield'){const s=Math.min(1.35,18/Math.max(w,h));ctx.translate(hx,hy);if(flip)ctx.scale(-1,1);ctx.drawImage(ic,-w*s*.5,-h*s*.62,w*s,h*s);ctx.restore();return;}
  ctx.translate(hx,hy);if(flip)ctx.scale(-1,1);ctx.rotate((main?.22:.12)+(ang||0));
  if(k==='long'||k==='torch'){const s=HELD_LEN[k]/h;ctx.drawImage(ic,-w*s*.5,-h*s*(k==='torch'?.72:.82),w*s,h*s);ctx.restore();return;}
  // Waffen und Werkzeuge liegen im Bild schräg (Griff unten links): aufrichten und am Griff fassen
  const s=HELD_LEN[k]/Math.hypot(w,h)*1.12;ctx.rotate(-Math.PI/4);const gx=w*(k==='spear'||k==='rod'?.16:.2),gy=h*(k==='spear'||k==='rod'?.84:.8);ctx.drawImage(ic,-gx*s,-gy*s,w*s,h*s);ctx.restore();}
composeHero=function(frame,back,pose,pad=0){const c=lookWithGear(P.char),mr=settings.hand!=='left',ms=back?(mr?'R':'L'):(mr?'L':'R'),cv=drawHero(c,frame,back,pose,ms),out=document.createElement('canvas');out.width=44+2*pad;out.height=60;const ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;
  const held=inv[HOT0+sel],off=equip.off,mainIc=held&&SPR[held.id]?SPR[held.id].c:null,offIc=off&&SPR[off.id]?SPR[off.id].c:null;
  const mainSide=back?(mr?'R':'L'):(mr?'L':'R'),offSide=mainSide==='L'?'R':'L',ang={up:-.9,strike:1.1,brace:.8}[pose]||0;
  const put=(id,ic,side)=>{if(ic)drawHeld2(ctx,id,ic,side==='L'?cv.handL:cv.handR,pad,side==='L',side===mainSide?ang:0,side===mainSide);};
  if(back){put(held&&held.id,mainIc,mainSide);put(off&&off.id,offIc,offSide);}ctx.drawImage(cv,pad,0);if(!back){put(held&&held.id,mainIc,mainSide);put(off&&off.id,offIc,offSide);}
  out.headBox=cv.headBox;out.waist=cv.waist;out.legTop=cv.legTop;return out;};
