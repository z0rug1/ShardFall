import sys,os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'src') if os.path.isdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'src')) else '.'
files=['engine.js','chars.js','art.js','data.js','fx.js','systems.js','parts.js','world2.js','gfx.js','gfx2.js','ch1grids.js','maps.js','workshop.js','ch2.js','battle.js','ui.js','main.js']
js=''.join(open(os.path.join(SRC,f)).read()+'\n' for f in files)
h=open(os.path.join(SRC,'shell.html')).read().replace('/*JS*/',js)
pwa='--pwa' in sys.argv
h=h.replace('<!--PWA-->','<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png"><link rel="icon" href="icon-192.png">' if pwa else '')
out=sys.argv[sys.argv.index('-o')+1] if '-o' in sys.argv else 'index.html'
open(out,'w').write(h);print(out,len(h))
