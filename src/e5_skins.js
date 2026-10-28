// ── ЭКСКЛЮЗИВНЫЕ СКИНЫ ─────────────────────────────────────────────────────
// Постобработка готового кадра: материал по яркости пикселя, цветной контур, искры вокруг героя.
// Выдаёт только сервер (таблица inventory), здесь лишь внешний вид и подписи.
const hsh=(a,b,c)=>{let h=(Math.imul(a+11,73856093)^Math.imul(b+7,19349663)^Math.imul(c+3,83492791))>>>0;h^=h>>>13;h=Math.imul(h,1274126177)>>>0;return h%1000;};
function grad(stops,l){
  l=l<0?0:l>1?1:l;
  for(let i=1;i<stops.length;i++)if(l<=stops[i][0]){const a=stops[i-1],b=stops[i],t=(l-a[0])/((b[0]-a[0])||1);return[a[1][0]+(b[1][0]-a[1][0])*t,a[1][1]+(b[1][1]-a[1][1])*t,a[1][2]+(b[1][2]-a[1][2])*t];}
  return stops[stops.length-1][1];
}
function hsl2rgb(h,s,l){h=((h%360)+360)%360;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255];}
const SK_GOLD=[[0,[62,34,4]],[.35,[176,116,18]],[.62,[236,186,52]],[.86,[255,232,134]],[1,[255,251,226]]];
const SK_CHR=[[0,[16,22,44]],[.4,[104,124,160]],[.75,[204,218,238]],[1,[255,255,255]]];
const SK_ICE=[[0,[8,44,86]],[.4,[58,158,220]],[.8,[172,232,255]],[1,[255,255,255]]];
const SK_NEO=[[0,[10,6,36]],[.5,[170,24,190]],[1,[255,130,255]]];
const SK_OBS=[[0,[4,2,10]],[.55,[40,30,62]],[1,[118,96,160]]];
const SK_LAV=[[0,[24,0,0]],[.4,[150,22,0]],[.75,[255,112,10]],[1,[255,226,70]]];
const SK_VOI=[[0,[2,0,8]],[.55,[30,10,62]],[1,[96,52,148]]];
const SK_PLT=[[0,[26,26,38]],[.5,[170,172,196]],[1,[255,255,255]]];
const SKINS={
  1:{n:'GOLD',r:'legendary',max:25,aura:[[255,226,110],[255,255,255]],
     map:(l,x,y,t)=>hsh(x,y,t)<14?[255,255,235]:grad(SK_GOLD,l),edge:()=>[96,58,6]},
  2:{n:'CHROME',r:'epic',max:50,aura:[[190,210,255]],
     map:(l,x,y,t)=>grad(SK_CHR,l+.2*Math.sin(y*.34+x*.06-t*.8)),edge:()=>[30,40,74]},
  3:{n:'ICE',r:'epic',max:50,aura:[[170,230,255],[255,255,255]],
     map:(l,x,y,t)=>hsh(x,y,t&1)<16?[255,255,255]:grad(SK_ICE,l),edge:()=>[20,90,150]},
  4:{n:'NEON',r:'rare',max:100,aura:[[60,255,240],[255,70,220]],
     map:(l)=>grad(SK_NEO,l),edge:(x,y,t)=>(t&1)?[60,255,240]:[255,70,220]},
  5:{n:'OBSIDIAN',r:'legendary',max:25,aura:[[255,50,70],[120,20,40]],
     map:(l,x,y,t)=>l>.8&&hsh(x,y,t)<90?[255,60,80]:grad(SK_OBS,l),edge:(x,y,t)=>[190+((t&1)?50:0),30,50]},
  6:{n:'GLITCH',r:'epic',max:50,aura:[[0,255,240],[255,0,90]],
     map:(l,x,y,t,v)=>{const h=hsh(0,y,t);const c=unpk(v);if(h<110)return[c[2],c[0],c[1]];if(h<170)return[c[0]*.4,c[1]*1.3+40,c[2]*1.3+60];return c;},
     edge:(x,y,t)=>hsh(1,y,t)<400?[0,255,240]:[255,0,90]},
  7:{n:'LAVA',r:'legendary',max:25,aura:[[255,140,20],[255,230,90]],
     map:(l,x,y,t)=>grad(SK_LAV,l+.16*Math.sin(y*.55-t*1.7+x*.35)),edge:(x,y,t)=>[255,70+((t&1)?50:0),0]},
  8:{n:'HOLO',r:'mythic',max:10,aura:[[255,120,255],[120,255,255],[255,255,120]],
     map:(l,x,y,t)=>hsl2rgb(x*5+y*3+t*50,.85,.3+.5*l),edge:(x,y,t)=>hsl2rgb(x*8+y*4+t*70,1,.7)},
  9:{n:'VOID',r:'mythic',max:10,aura:[[170,90,255],[255,255,255]],
     map:(l,x,y,t)=>hsh(x,y,t)<9?[255,255,255]:grad(SK_VOI,l),edge:(x,y,t)=>(t&1)?[160,70,255]:[110,40,200]},
  10:{n:'CREATOR',r:'unique',max:1,aura:[[255,210,80],[255,255,255]],
     map:(l,x,y,t)=>hsh(x,y,t)<10?[255,226,120]:grad(SK_PLT,l),edge:()=>[255,196,48]},
};
const RARITY_NAMES={rare:'РЕДКИЙ',epic:'ЭПИЧЕСКИЙ',legendary:'ЛЕГЕНДАРНЫЙ',mythic:'МИФИЧЕСКИЙ',unique:'ЕДИНСТВЕННЫЙ'};
const RARITY_COL={rare:'#5b9bff',epic:'#a78bfa',legendary:'#ffd24a',mythic:'#ff6b9a',unique:'#ffffff'};
function applySkin(buf,av,pose){
  const S=SKINS[av.x];if(!S)return buf;
  const t=pose.t||0,out=new Int32Array(buf),OUTP=pk(OUT_RGB);
  const keep=new Set([0xf2efea,0x120d18,INK]);
  for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){
    const i=y*PW+x,v=buf[i];if(v<0)continue;
    if(v===OUTP){out[i]=pk(S.edge(x,y,t));continue;}
    if(keep.has(v))continue;
    const c=unpk(v),l=(.3*c[0]+.59*c[1]+.11*c[2])/255;
    out[i]=pk(S.map(l,x,y,t,v));
  }
  // искры вокруг героя, поднимаются вверх
  for(let j=0;j<16;j++){
    const px=6+(hsh(j,1,0)%60),py=PH-((hsh(j,2,0)%96)+t*5+j*3)%PH;
    const col=S.aura[j%S.aura.length];
    for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){
      if(dx||dy){if(hsh(j,3,t)>480)continue;}
      const xx=px+dx,yy=Math.round(py)+dy;
      if(xx>=0&&yy>=0&&xx<PW&&yy<PH&&buf[yy*PW+xx]<0&&out[yy*PW+xx]<0)out[yy*PW+xx]=pk(dx||dy?col.map(v=>v*.55):col);
    }
  }
  return out;
}
