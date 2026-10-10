# Baut pkg/KREAKS (Spielpaket) aus kreaks.html: three.js lokal statt aus dem Internet
import shutil,os,sys
DEV='dev' in sys.argv  # Entwickler-Paket (läuft ohne Launcher-Konto)
s=open('kreaks.html').read()
cdn='<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"'
assert cdn in s
s=s.replace(cdn,'<script src="assets/three.min.js"',1)
link='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Silkscreen:wght@400;700&family=Pixelify+Sans:wght@400;500;700&display=swap">'
assert link in s
s=s.replace('<link rel="preconnect" href="https://fonts.googleapis.com">\n','').replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n','')
s=s.replace(link,'<link rel="stylesheet" href="assets/fonts/fonts.css">')
os.makedirs('pkg/KREAKS/assets/fonts',exist_ok=True)
css=''
for fam,f,w in[('Great Vibes','great-vibes-latin-400-normal',400),('Silkscreen','silkscreen-latin-400-normal',400),('Silkscreen','silkscreen-latin-700-normal',700),('Pixelify Sans','pixelify-sans-latin-400-normal',400),('Pixelify Sans','pixelify-sans-latin-500-normal',500),('Pixelify Sans','pixelify-sans-latin-700-normal',700)]:
  shutil.copy('gamefonts/'+f+'.woff2','pkg/KREAKS/assets/fonts/'+f+'.woff2')
  css+="@font-face{font-family:'%s';src:url(%s.woff2) format('woff2');font-weight:%d;font-display:swap}\n"%(fam,f,w)
open('pkg/KREAKS/assets/fonts/fonts.css','w').write(css)
if DEV:
  s=s.replace('<script src="assets/three.min.js"','<script>window.KREAKS_DEV=true</script><script src="assets/three.min.js"',1)
open('pkg/KREAKS/index.html','w').write(s)
shutil.copy('nm/node_modules/three/build/three.min.js','pkg/KREAKS/assets/three.min.js')
# Launcher: mitgelieferte Version aktualisieren

print('pkg ok')
