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
      await pg.goto('http://127.0.0.1:8765/test.html?ns='+ns,wait_until='commit',timeout=180000);await pg.wait_for_function('typeof window.__G==="function"',timeout=180000)
      await pg.wait_for_timeout(3000)
      return pg
    A=await mk('a');B=await mk('b')
    code='TESTQWER7890'
    print('A start',await ev(A,f"(()=>{{curSlot='mp1';MP.pending={{mode:'host',code:'{code}'}};const c=defaultChar();c.name='Anna';startGame(true,c);return 1}})()"))
    await A.wait_for_timeout(1500);await A.evaluate(INTRO)
    await A.wait_for_timeout(7000)
    print('A role',await ev(A,"[MP.role,MP.ready,FLAGS.wseed,P.x,P.z]"))
    print('B start',await ev(B,f"(()=>{{curSlot='mp1';MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Ben';c.race=c.race;startGame(true,c);return 1}})()"))
    await B.wait_for_timeout(1500);await B.evaluate(INTRO)
    await B.wait_for_timeout(6000)
    print('B role',await ev(B,"[MP.role,MP.ready,MP.host===MP.pid,FLAGS.wseed,MP.order.length,REMOTE.size,P.x,P.z,$('mpWait').hidden]"))
    print('A sees',await ev(A,"[MP.order.length,REMOTE.size,[...REMOTE.values()].map(r=>r.name)]"))
    # Welt-Änderung beim Host
    print('A change',await ev(A,"(()=>{FLAGS.harv=FLAGS.harv||{};FLAGS.harv['oak@123,456']=gameMinutes();addFurn('chest',P.x+3,P.z+1);furnSave();renderFurn();FLAGS.chests=FLAGS.chests||{};FLAGS.chests['ctest']=[{id:'wood',n:5}];return 1})()"))
    await A.wait_for_timeout(2500)
    print('B got',await ev(B,"[!!(FLAGS.harv||{})['oak@123,456'],FURN.length,JSON.stringify((FLAGS.chests||{}).ctest)]"))
    # Änderung beim Beitretenden
    print('B change',await ev(B,"(()=>{FLAGS.wtorches=FLAGS.wtorches||[];FLAGS.wtorches.push([P.x+2,P.z+2]);renderWTorches();return 1})()"))
    await B.wait_for_timeout(2500)
    print('A got',await ev(A,"[(FLAGS.wtorches||[]).length,Object.keys(FLAGS.mp.log).length]"))
    # B schaut auf Anna
    await ev(B,"(()=>{const r=[...REMOTE.values()][0];P.x=r.x+4;P.z=r.z+4;P.y=groundAt(P.x,P.z,1e4);P.yaw=Math.atan2(-(r.x-P.x),-(r.z-P.z));P.pitch=-.05;show('pause',false);state='playing';return 1})()")
    await ev(A,"(()=>{P.yaw=.8;inv[HOT0]={id:'iron_sword',n:1};sel=0;return 1})()")
    await B.wait_for_timeout(2500)
    await B.screenshot(path='shotMP1.png',timeout=180000)
    print('B remote',await ev(B,"[...REMOTE.values()].map(r=>[r.name,r.x.toFixed(1),r.z.toFixed(1),r.held])"))
    # Host verlässt die Welt
    await A.close()
    await B.wait_for_timeout(19000)
    print('B after host left',await ev(B,"[document.visibilityState,$('mpWS').textContent,$('mpWT').textContent,$('mpWC').textContent,state,MP.role,MP.host===MP.pid,MP.order.length,$('mpWait').hidden,REMOTE.size]"))
    # Anna kommt zurück und tritt Ben bei
    A=await mk('a')
    print('A continue',await ev(A,"(()=>{mpPlaySlot(1);return [curSlot]})()"))
    await A.wait_for_timeout(1500);await A.evaluate(INTRO)
    await A.wait_for_timeout(7000)
    print('A role2',await ev(A,"[Math.round(FLAGS.mp.tick),MP.dbg.filter(x=>!x.startsWith('pose')).join(' '),MP.role,MP.host===MP.pid,MP.order.length,REMOTE.size,(FLAGS.wtorches||[]).length]"))
    print('B role2',await ev(B,"[MP.dbg.filter(x=>!x.startsWith('pose')).slice(-14).join(' '),Math.round(FLAGS.mp.tick),MP.role,MP.order.length,REMOTE.size]"))
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
