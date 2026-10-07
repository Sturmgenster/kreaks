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
    code='TESTPLMN3456'
    await ev(A,f"(()=>{{curSlot='mp1';MP.pending={{mode:'host',code:'{code}'}};const c=defaultChar();c.name='Anna';startGame(true,c);return 1}})()")
    await A.wait_for_timeout(1500);await A.evaluate(INTRO);await A.wait_for_timeout(7000)
    for pg,nm in((B,'Ben'),(C,'Cleo')):
      await ev(pg,f"(()=>{{curSlot='mp1';MP.pending={{mode:'join',code:'{code}'}};const c=defaultChar();c.name='{nm}';startGame(true,c);return 1}})()")
      await pg.wait_for_timeout(1500);await pg.evaluate(INTRO);await pg.wait_for_timeout(6000)
    print('roles',await ev(A,"[MP.role,MP.order.length,REMOTE.size]"),await ev(B,"[MP.role,MP.order.length,REMOTE.size]"),await ev(C,"[MP.role,MP.order.length,REMOTE.size]"))
    print('chat logA',await ev(A,"$('mpChatLog').textContent"))
    await ev(B,"(()=>{openChat();$('mpChatIn').value='Hallo zusammen!';closeChat(true);return 1})()")
    await A.wait_for_timeout(1500)
    print('chat',await ev(A,"$('mpChatLog').textContent"),await ev(C,"$('mpChatLog').textContent"))
    # Drops
    await ev(A,"(()=>{spawnDrop('wood',7,P.x+30,groundAt(P.x+30,P.z+30,1e4)+.5,P.z+30);return drops.length})()")
    await A.wait_for_timeout(2000)
    print('drops',await ev(B,"drops.map(d=>d.id+d.n)"),await ev(C,"drops.map(d=>d.id+d.n)"))
    await ev(C,"(()=>{const d=drops.find(d=>d.id==='wood');if(!d)return 'kein drop';P.x=d.x;P.z=d.z;P.y=d.y;show('pause',false);state='playing';for(let i=0;i<30;i++){time+=.05;updateDrops(.05);}mpDropTick();return [countItem('wood'),document.visibilityState]})()")
    await A.wait_for_timeout(2000)
    print('after pickup',await ev(A,"drops.map(d=>d.id+d.n)"),await ev(B,"drops.map(d=>d.id+d.n)"),await ev(C,"countItem('wood')"))
    # Geben
    print('give',await ev(B,"(()=>{inv[HOT0]={id:'bread',n:3};sel=0;const r=[...REMOTE.values()].find(r=>r.name==='Anna');P.x=r.x+2;P.z=r.z;P.y=groundAt(P.x,P.z,1e4)+0;P.yaw=Math.atan2(-(r.x-P.x),-(r.z-P.z));P.pitch=-.05;camera.position.set(P.x,P.y+P.eye,P.z);show('pause',false);state='playing';return [!!remoteLooked(),storyUse()]})()"))
    await A.wait_for_timeout(1500)
    print('A bread',await ev(A,"countItem('bread')"))
    # Schlafen beim Mitspieler
    await ev(C,"(()=>{FLAGS.day=(FLAGS.day||0)+1;FLAGS.clock=420;return 1})()")
    await A.wait_for_timeout(2500)
    print('sleep',await ev(A,"[FLAGS.day,Math.round(FLAGS.clock)]"),await ev(B,"[FLAGS.day,Math.round(FLAGS.clock)]"))
    # Zwischensequenz
    await ev(A,"(()=>{show('pause',false);state='playing';playCine([{who:'Kreak',t:'Test für alle.'}],null);return 1})()")
    await A.wait_for_timeout(1500)
    print('cine',await ev(B,"[state,$('cineText').textContent||cine&&cine.full]"),await ev(C,"[state]"))
    # Kill zählt beim Schützen
    print('kill',await ev(A,"(()=>{FLAGS.clock=1380;tonightEv=()=>'none';const e=spawnEnt('nskel',P.x+5,P.z+5,{nm:1});NIGHTMOB.push(e);return 1})()"))
    await A.wait_for_timeout(2500)
    await ev(C,'1')
    print('B mayor before',await ev(B,"(()=>{const M=MY();M.q={type:'night',need:3,have:0};const e=[...MP_MIR.dem.values()][0];if(!e)return 'kein Spiegel';for(let i=0;i<10;i++)hurtAny(Object.assign(e,{kind:'demon'}),40);return 1})()"))
    await B.wait_for_timeout(2500)
    print('B mayor after',await ev(B,"JSON.stringify(MY().q)"),'A',await ev(A,"JSON.stringify(MY().q)"))
    # Rauswerfen
    print('kick',await ev(A,"(()=>{const pid=[...REMOTE.values()].find(r=>r.name==='Cleo').pid;mpKick(pid,true);return [MP.order.length,JSON.stringify(FLAGS.mpBans)]})()"))
    await A.wait_for_timeout(2500)
    print('C after',await ev(C,"[MP.on,$('mpWT').textContent]"),await ev(B,"[MP.order.length,JSON.stringify(FLAGS.mpBans)]"))
    print('ERRORS:',errs[:12])
    await b.close()
asyncio.run(main())
srv.terminate()
