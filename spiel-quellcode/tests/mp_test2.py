import asyncio,json,subprocess,os,sys,time
from playwright.async_api import async_playwright
THREE=open('nm/node_modules/three/build/three.min.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8765'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
INTRO="__G('try{endIntro()}catch(e){};if(typeof IN!==\\'undefined\\')IN.on=false;var el=document.getElementById(\\'intro\\');if(el)el.hidden=true;cine=null;$(\\'cine\\').hidden=true;$(\\'hotbar\\').hidden=false;FLAGS.introSeen=1;state=\\'playing\\';FLAGS.clock=600;')"
async def ev(pg,js):
  try:return await pg.evaluate("s=>{try{return JSON.stringify(__G(s))}catch(e){return 'ERR '+e.message+' '+(e.stack||'').split('\\n')[1]}}",js)
  except Exception as e:return 'EXC '+str(e)[:300]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--no-proxy-server'])
    ctx=await b.new_context(viewport={'width':900,'height':560})
    errs=[]
    async def mk(ns):
      pg=await ctx.new_page()
      pg.on('pageerror',lambda e:errs.append(ns+':'+str(e)))
      pg.on('console',lambda m:errs.append(ns+':C:'+m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
      await pg.route('**/three.min.js',lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
      await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
      await pg.route('**/*.mp3',lambda r:r.abort())
      await pg.goto('http://127.0.0.1:8765/test.html?ns='+ns,wait_until='domcontentloaded')
      await pg.wait_for_timeout(3000)
      return pg
    A=await mk('a');B=await mk('b')
    code='TESTZXCV5678'
    await ev(A,f"(()=>{{curSlot='mp1';MP.pending={{mode:'host',code:'{code}'}};const c=defaultChar();c.name='Anna';startGame(true,c);return 1}})()")
    await A.wait_for_timeout(1500);await A.evaluate(INTRO);await A.wait_for_timeout(7000)
    await ev(B,f"(()=>{{curSlot='mp1';MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Ben';c.race='dwarf';startGame(true,c);return 1}})()")
    await B.wait_for_timeout(1500);await B.evaluate(INTRO);await B.wait_for_timeout(7000)
    print('roles',await ev(A,"MP.role"),await ev(B,"[MP.role,MP.ready]"))
    # Host spawnt Nachtmonster, Spion
    print('A spawn',await ev(A,"(()=>{FLAGS.clock=1380;tonightEv=()=>'none';show('pause',false);state='playing';const e=spawnEnt('nskel',P.x+6,P.z+3,{nm:1,home:{x:P.x,z:P.z}});NIGHTMOB.push(e);const s=spawnSpy(true);return [!!e,s]})()"))
    await A.wait_for_timeout(3000)
    print('A spy',await ev(A,"[(show('pause',false),state='playing',updateSpy(.016),!!spy),MP.spyR,NIGHTMOB.length]"));print('B mirrors',await ev(B,"[MP_MIR.dem.size,[...MP_MIR.dem.values()].map(e=>e.type),!!spy,!!MP_SPY,Object.keys(MP_HS).map(k=>k+':'+MP_HS[k].size).join(' ')]"))
    print('vil compare',await ev(A,"villagers.slice(0,3).map(v=>[v.x.toFixed(1),v.z.toFixed(1)])"),await ev(B,"villagers.slice(0,3).map(v=>[v.x.toFixed(1),v.z.toFixed(1)])"))
    print('ani compare',await ev(A,"animals.filter(a=>a.alive).slice(0,3).map(a=>[a.type,a.x.toFixed(1),a.z.toFixed(1)])"),await ev(B,"animals.filter(a=>a.alive).slice(0,3).map(a=>[a.type,a.x.toFixed(1),a.z.toFixed(1)])"))
    # B schlägt das Skelett bis es stirbt -> Beute bei B
    print('B hit',await ev(B,"(()=>{const e=[...MP_MIR.dem.values()][0];window.__xp0=FLAGS.xp||0;window.__d0=drops.length;for(let i=0;i<10;i++)hurtAny(Object.assign(e,{kind:'demon'}),30);return 1})()"))
    await B.wait_for_timeout(2500)
    print('A skel',await ev(A,"NIGHTMOB.map(e=>[e.dead,Math.round(e.hp)])"),'B loot',await ev(B,"[(FLAGS.xp||0)-window.__xp0,drops.length-window.__d0]"))
    # Monster greift Ben an
    print('A proxy',await ev(A,"(()=>{const R=[...REMOTE.values()][0];const e=spawnEnt('nrat',R.x+1,R.z+1,{nm:1});NIGHTMOB.push(e);return [MP_PROXY.size]})()"))
    await ev(B,"window.__hp0=P.stats.hp")
    await A.wait_for_timeout(6000)
    print('A rat',await ev(A,"(()=>{const r=NIGHTMOB.find(e=>e.type==='nrat');const px=[...MP_PROXY.values()][0];return [state,!!r,r&&r.dead,r&&(r.tgt==='player'?'P':r.tgt&&r.tgt.type),r&&px&&Math.hypot(r.x-px.x,r.z-px.z).toFixed(1),px&&DEM.includes(px),px&&px.fac]})()"))
    print('A sim',await ev(A,"(()=>{let n=0;const px=[...MP_PROXY.values()][0];const oh=px.onHurt;px.onHurt=(e,a,b)=>{n++;return oh(e,a,b);};for(let i=0;i<120;i++){time+=.05;updateDemons(.05);}return n})()"))
    await B.wait_for_timeout(1500)
    print('B spy',await ev(B,"[!!spy,!!MP_SPY]"))
    print('B hp',await ev(B,"[window.__hp0,P.stats.hp]"))
    # Schleichen und Namensschild
    await ev(B,"keys.add(settings.keys.sneak)")
    await ev(A,"(()=>{const r=[...REMOTE.values()][0];P.x=r.x+3;P.z=r.z+3;P.y=groundAt(P.x,P.z,1e4);P.yaw=Math.atan2(-(r.x-P.x),-(r.z-P.z));P.pitch=-.05;return 1})()")
    await A.wait_for_timeout(2500)
    await A.screenshot(path='shotMP2.png')
    print('A sees sneak',await ev(A,"[...REMOTE.values()].map(r=>[r.name,r.sn])"))
    await ev(B,"keys.delete(settings.keys.sneak)")
    await ev(B,"(()=>{const s=spy;if(s){P.x=s.x+4;P.z=s.z+4;P.y=groundAt(P.x,P.z,1e4);P.yaw=Math.atan2(-(s.x-P.x),-(s.z-P.z));P.pitch=0;}return !!s})()")
    await B.wait_for_timeout(2500)
    await B.screenshot(path='shotMP3.png')
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
