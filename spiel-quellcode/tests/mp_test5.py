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
      await pg.goto('http://127.0.0.1:8765/test.html?ns='+ns,wait_until='domcontentloaded',timeout=180000)
      await pg.wait_for_timeout(3000)
      return pg
    A=await mk('a');B=await mk('b');C=await mk('c')
    code='TESTPWVR7788'
    await ev(A,f"(()=>{{curSlot='mp1';MP.pending={{mode:'host',code:'{code}'}};const c=defaultChar();c.name='Anna';startGame(true,c);return 1}})()")
    await A.wait_for_timeout(1500);await A.evaluate(INTRO);await A.wait_for_timeout(5000)
    print('setpw',await ev(A,"(()=>{FLAGS.mpCfg={pw:MP_HASH(MP.code+'|geheim')};return MP.role})()"))
    await ev(B,f"(()=>{{curSlot='mp1';MP.pwHash=MP_HASH('{code}|falsch');MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Ben';startGame(true,c);return 1}})()")
    await B.wait_for_timeout(9000)
    print('B wrong pw',await ev(B,"[MP.on,$('mpWT').textContent]"),await ev(A,"MP.order.length"))
    await ev(C,f"(()=>{{GAME_VER='V60';curSlot='mp1';MP.pwHash=MP_HASH('{code}|geheim');MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Cleo';startGame(true,c);return 1}})()")
    await C.wait_for_timeout(9000)
    print('C old ver',await ev(C,"[MP.on,$('mpWT').textContent]"),await ev(A,"MP.order.length"))
    await ev(C,f"(()=>{{GAME_VER='V74';return 1}})()")
    await ev(B,f"(()=>{{mpWaitHide();curSlot='mp2';MP.pwHash=MP_HASH('{code}|geheim');MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Ben';startGame(true,c);return 1}})()")
    await B.wait_for_timeout(9000)
    print('B right pw',await ev(B,"[MP.on,MP.role]"),await ev(A,"MP.order.length"))
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
