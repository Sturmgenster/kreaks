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
    A=await mk('a');B=await mk('b')
    code='TESTPRED1122'
    await ev(A,f"(()=>{{curSlot='mp1';MP.pending={{mode:'host',code:'{code}'}};const c=defaultChar();c.name='Anna';startGame(true,c);return 1}})()")
    await A.wait_for_timeout(1500);await A.evaluate(INTRO);await A.wait_for_timeout(5000)
    await ev(B,f"(()=>{{curSlot='mp1';MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='Ben';startGame(true,c);return 1}})()")
    await B.wait_for_timeout(1500);await B.evaluate(INTRO);await B.wait_for_timeout(6000)
    # B weit weg von A, Wildschwein neben B
    print('B pos',await ev(B,"(()=>{P.x+=60;P.z+=60;P.y=groundAt(P.x,P.z,1e4);return [Math.round(P.x),Math.round(P.z),P.stats.hp]})()"))
    await B.wait_for_timeout(2500)
    print('pred',await ev(A,"(()=>{const R=[...REMOTE.values()][0];const a=animals.find(a=>a.type==='boar'&&a.alive)||animals.find(a=>a.type==='wolf'&&a.alive);if(!a)return 'kein Tier';a.x=R.x+4;a.z=R.z;a.y=R.y;a.berserk=true;state='paused';window.__d=[];const ob=bite;bite=function(a,d,k){window.__d.push([+(P.y-a.y).toFixed(2),!!MP.dmgTo]);return ob(a,d,k)};const os=mpSend;mpSend=function(m,t){if(m.t==='dmg')window.__d.push('sent'+m.n);return os(m,t)};for(let i=0;i<120;i++){time+=.05;R.seen=time;try{updateAnimals(.05);}catch(e){const m=animals.find(a=>!SPR['an_'+a.type+(a.v!=null?a.v:a.male?1:0)+'_'+a.frame]);return 'MISS '+(m&&[m.type,m.v,m.male,m.frame,m===a,i])}}bite=ob;mpSend=os;return [JSON.stringify(window.__d),a.type,Math.round(Math.hypot(a.x-R.x,a.z-R.z)*10)/10,state]})()"))
    await B.wait_for_timeout(2000)
    print('B hp',await ev(B,"P.stats.hp"))
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
