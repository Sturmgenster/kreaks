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
    print('A hire',await ev(A,"(()=>{ensureMercs();FLAGS.kreak=1;FLAGS.kreakNamed=1;ensureKreak();setWallet(99999);const r=mercHire(MERC_BY.Fenn,1,50);return [r,JSON.stringify(FLAGS.mercClaims)]})()"))
    await A.wait_for_timeout(2500)
    print('B claim',await ev(B,"(()=>{ensureMercs();const e=mercEnts[MERC_BY.Fenn.i];const n=DIALOGS.Fenn.nodes.hello();return [JSON.stringify(FLAGS.mercClaims),e.hidden,n.text.slice(0,40),mercHire(MERC_BY.Fenn,1,50)]})()"))
    print('A ride',await ev(A,"(()=>{FLAGS.mounts={horse0:1};summonMount('horse0');mount.x=P.x+1;mount.z=P.z+1;mount.state='idle';mount.delay=0;mountUp();show('pause',false);state='playing';for(let i=0;i<40;i++){time+=.05;updateDemons(.05);}return [P.riding,kreakE&&kreakE.steed,mercEnts[MERC_BY.Fenn.i].steed]})()"))
    await A.wait_for_timeout(2500)
    print('B sees',await ev(B,"[...REMOTE.values()].map(r=>[r.rd,r.kg&&r.kg.steed,(r.mg||[]).filter(Boolean).map(g=>[g.name,g.steed])])"))
    await ev(B,"(()=>{const r=[...REMOTE.values()][0];P.x=r.x+5;P.z=r.z+5;P.y=groundAt(P.x,P.z,1e4);P.yaw=Math.atan2(-(r.x-P.x),-(r.z-P.z));P.pitch=-.05;show('pause',false);state='playing';return 1})()")
    await B.wait_for_timeout(3000)
    await B.screenshot(path='shotMP4.png')
    await ev(B,"(()=>{const r=[...REMOTE.values()][0];const st=STEEDS[r.rd];window.__dbg=1;mpFrame=(f=>dt=>{f(dt);const g=r.mesh.geometry.attributes;g.offset.array[1]+=0;})(mpFrame);return 1})()")
    await ev(A,"(()=>{P.yaw+=1.2;return 1})()")
    await B.evaluate(INTRO)
    await ev(B,"(()=>{const r=[...REMOTE.values()][0];P.x=r.x+3;P.z=r.z+1;P.y=groundAt(P.x,P.z,1e4);P.yaw=Math.atan2(-(r.x-P.x),-(r.z-P.z));P.pitch=.05;show('pause',false);state='playing';return 1})()")
    await B.wait_for_timeout(2500)
    await B.screenshot(path='shotMP5.png')
    import base64
    u=json.loads(await ev(B,"[...REMOTE.values()][0].mesh.material.uniforms.map.value.image.toDataURL()"))
    open('rstrip.png','wb').write(base64.b64decode(u.split(',')[1]))
    print('B R',await ev(B,"(()=>{const r=[...REMOTE.values()][0],g=r.mesh.geometry.attributes;return [Array.from(g.offset.array),Array.from(g.size.array),Array.from(g.uvr.array),r.mesh.material.uniforms.map.value.image.width,!!SPR['rp_'+r.pid+'_14'],r.mesh.visible,r.y,r.head]})()"))
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
