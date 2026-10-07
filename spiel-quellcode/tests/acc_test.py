import asyncio,os,json
from playwright.async_api import async_playwright
THREE=open('nm/node_modules/three/build/three.min.js').read()
async def run(page_file,acc,steps):
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':1100,'height':650});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    if acc:await pg.add_init_script("window.KREAKS_ACCOUNT="+json.dumps(acc)+";localStorage.setItem('kreaks_slot_1',JSON.stringify({v:6,meta:{name:'Altname',level:3,day:5,t:1},char:{name:'Altname'},flags:{}}))")
    await pg.route('**/three.min.js',lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
    await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
    await pg.route('**/*.mp3',lambda r:r.abort())
    await pg.goto('file://'+os.path.abspath(page_file));await pg.wait_for_timeout(2500)
    for name,js in steps:
      try:r=await pg.evaluate(js)
      except Exception as e:r='EXC '+str(e)[:200]
      print(name,'=>',str(r)[:400])
      if name.startswith('shot'):await pg.screenshot(path=name+'.png')
    print('ERR',errs[:5]);await b.close()
async def main():
  # 1) echtes Spiel per file:// -> gesperrt
  await run('kreaks.html',None,[('blocked',"!!document.getElementById('accBlock')"),('shotBlock','1')])
  # 2) Testversion mit Konto
  G=lambda s:"__G("+json.dumps(s)+")"
  await run('test.html',{'uuid':'cad5135c-94c8-45a2-becf-bf7512dd0f34','name':'Jonas_K','licensed':True},[
    ('ver',"document.getElementById('verTag').textContent+' | '+document.getElementById('accTag').textContent"),
    ('pid',G("mpPid()")),
    ('migr',"Object.keys(localStorage).filter(k=>k.includes('slot')).join(',')"),
    ('slots',G("(openSlots('load'),document.getElementById('slotList').innerText.slice(0,120))")),
    ('creator',G("(openCreator(),document.getElementById('ccNext').click(),document.querySelector('label[for=ccName]').textContent+' / '+document.getElementById('ccName').placeholder)")),
    ('finish',G("(curSlot=2,document.getElementById('ccName').value='Karottental',finishCreator(),[P.char.name,P.char.world])")),
    ('save',G("(saveGame(),JSON.stringify(store.get(SLOT_KEY(2)).meta))")),
  ])
asyncio.run(main())
