import re,sys,subprocess
import glob
h=open('head.html').read();j=open('game.js').read();t=open('tail.html').read()
parts=''.join('\n'+open(f).read() for f in sorted(glob.glob('parts/*.js')))
k0=j.rstrip();assert k0.endswith('})();')
j=k0[:-5]+parts+'\n})();\n'
out=h+'<script>\n'+j+t
open('kreaks.html','w').write(out)
k=j.rstrip()
assert k.endswith('})();')
tj=k[:-5]+"\nwindow.__G=s=>eval(s);\n})();\n"
open('test.html','w').write(h+'<script>\n'+tj+t)
open('check.js','w').write(j)
r=subprocess.run(['node','--no-lazy','--check','check.js'],capture_output=True,text=True)
print('SYNTAX_OK' if r.returncode==0 else r.stderr[:2000])
