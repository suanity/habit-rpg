import os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(d,f),encoding='utf-8').read()
eng='\n'.join(r(f) for f in ['e1_core.js','e2_body.js','e3_head.js','e4_out.js','e5_skins.js'] if os.path.exists(os.path.join(d,f)))
out=r('head.html')+'<script>\n'+eng+'\n'+r('app.js')+'\n</script>\n</body>\n</html>\n'
open(os.path.join(d,'index.html'),'w',encoding='utf-8').write(out)
print(len(out))
