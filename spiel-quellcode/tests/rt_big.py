import sys,asyncio,json
from playwright.async_api import async_playwright
THREE=open('nm/node_modules/three/build/three.min.js').read()
async def main(steps,setup=True):
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':1600,'height':900})
    errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    await pg.route('**/three.min.js',lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
    await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
    await pg.route('**/*.mp3',lambda r:r.abort())
    import os
    await pg.goto('file://'+os.path.abspath('test.html'))
    await pg.wait_for_timeout(2500)
    if setup:
      await pg.evaluate("__G(\"P.char=defaultChar();startGame(true,P.char);\")")
      for i in range(30):
        await pg.wait_for_timeout(300)
        if await pg.evaluate("__G('IN.on')"):break
      await pg.evaluate("__G('try{endIntro()}catch(e){};if(typeof IN!==\\'undefined\\')IN.on=false;var el=document.getElementById(\\'intro\\');if(el)el.hidden=true;cine=null;$(\\'cine\\').hidden=true;$(\\'hotbar\\').hidden=false;FLAGS.introSeen=1;state=\\'playing\\';FLAGS.clock=600;')")
      await pg.wait_for_timeout(1200)
    for line in open(steps).read().split('\n'):
      if not line.strip() or line.startswith('#'):continue
      name,w,js=line.split('|',2)
      try:
        r=await pg.evaluate("s=>{try{return JSON.stringify(__G(s))}catch(e){return 'ERR '+e.message+' '+(e.stack||'').split('\\n')[1]}}",js)
      except Exception as e:r='EXC '+str(e)[:300]
      await pg.wait_for_timeout(int(w))
      if name.startswith('shot'):await pg.screenshot(path=name+'.png',timeout=180000)
      if name.startswith('img') and isinstance(r,str) and 'base64,' in r:
        import base64
        open(name+'.png','wb').write(base64.b64decode(json.loads(r).split('base64,')[1]))
        r='saved'
      if name.startswith('file'):
        open(name+'.txt','w').write(json.loads(r) if isinstance(r,str) and r.startswith('"') else str(r))
      print(name,'=>',str(r)[:1500])
    print('ERRORS:',errs[:15])
    await b.close()
asyncio.run(main(sys.argv[1],len(sys.argv)<3))
