// ── PIXEL ENGINE v4 ────────────────────────────────────────────────────────
// Сетка 72×96. Рисовка «уличный комикс» (плоские 3 тона, толстый контур) +
// угловая анатомия (широкие плечи, гранёная челюсть, длинные ноги, серьёзные лица).
const PW=72,PH=96,CX=36;
const hex2=h=>{const v=parseInt(h.slice(1),16);return[v>>16&255,v>>8&255,v&255];};
const unpk=v=>[v>>16&255,v>>8&255,v&255];
const cl8=v=>v<0?0:v>255?255:v|0;
const pk=a=>(cl8(a[0])<<16)|(cl8(a[1])<<8)|cl8(a[2]);
const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const mixp=(p,q,t)=>pk(mixc(unpk(p),unpk(q),t));
const _rc={};
// 4 тона: [свет, база, тень, глубокая тень]
function ramp(hx){
  if(_rc[hx])return _rc[hx];
  const b=hex2(hx);
  return _rc[hx]=[pk(mixc(b,[255,250,230],.36)),pk(b),pk(mixc(b,[50,20,90],.4)),pk(mixc(b,[25,12,55],.62))];
}
const _sc={};
function skinRamp(hx){
  if(_sc[hx])return _sc[hx];
  const b=hex2(hx);
  return _sc[hx]=[pk(mixc(b.map(v=>v*1.03+6),[255,243,228],.34)),pk(b),pk(mixc(b.map(v=>v*.82),[150,55,75],.2)),pk(mixc(b.map(v=>v*.6),[90,28,50],.3))];
}
const rampN=n=>ramp('#'+n.toString(16).padStart(6,'0'));

// ── ПАЛИТРЫ И ИМЕНА ───────────────────────────────────────────────────────
const SKIN=['#fde6d2','#f7d0ae','#eebc92','#d9a070','#b97d4e','#94603a','#6e432a','#4a2c1b'];
const HAIRC=['#1b1a20','#3a2415','#6b4423','#8b5a2b','#d9b45a','#e8e2cf','#b8452a','#c22d3a','#3f7de8','#27b5a8','#ec7fb0','#8b5cf6'];
const OUTC=['#e5484d','#f59e0b','#facc15','#2ecc71','#14b8a6','#38bdf8','#3b6fe0','#6366f1','#a855f7','#ec4899','#e9ecf3','#2b3040'];
const PANTC=['#3b5b92','#262a38','#5b6275','#a58d62','#5b6b3f','#222f55','#6a4a30','#d8dbe4'];
const EYEC=['#6b3f1d','#2a2230','#3f8fe0','#3fa86a','#8a97a8','#d49a2a'];
const BODY_NAMES=['Худой','Обычный','Атлет','Крупный'];
const GENDER_NAMES=['Парень','Девушка'];
const HAIR_NAMES=['Короткая','Шипы','Ирокез','Длинные','Каре','Хвост','Пучок','Афро','Ёжик','Назад','Кудри','Косы','Андеркат','Пробор','Хвостики','Лысый','Кудрявый фейд','Длинные кудри','Шторки','Маллет'];
const FACE_NAMES=['Классика','Квадратное','Узкое','Скулы','Мягкое','Тяжёлый лоб','Острое','Усталое'];
const EYE_NAMES=['Обычные','Острые','Большие','Сонные','Точки'];
const BROW_NAMES=['Обычные','Густые','Тонкие','Хмурые'];
const MOUTH_NAMES=['Ровный','Улыбка','Ухмылка','Оскал'];
const BEARD_NAMES=['Нет','Щетина','Усы','Эспаньолка','Борода','Густая'];
const OUTFIT_NAMES=['Худи','Футболка','Бомбер','Броня','Майка','Костюм','Кожанка','Мантия','Спортивка','Разгрузка','Оверсайз-футболка','Рашгард','Оверсайз-худи','Рубашка в клетку','Джерси'];
const PANT_NAMES=['Джинсы','Карго','Шорты','Джоггеры','Юбка','Брюки','Широкие джинсы','Широкие спортивные'];
const SHOE_NAMES=['Белые','Чёрные','Ботинки','Хай-топы','Массивные ботинки','Массивные кроссовки'];
const ACC_NAMES=['Нет','Очки','Тёмные','Кепка','Повязка','Наушники','Шапка','Серьга','Шрам','Круглые очки','Большие очки','Цепочка'];
const ITEM_NAMES=['Нет','Камера','Кофе','Книга','Меч','Гантель'];
const CAPE_NAMES=['Нет','Красный','Чёрный','Синий'];
// x — эксклюзивный скин (0 = нет). Допустимость проверяет сервер по инвентарю игрока.
const AV_RANGE={g:2,b:4,sk:8,h:20,hc:12,e:5,ec:6,br:4,m:4,fh:6,o:15,oc:12,p:8,pc:8,s:6,a:12,it:6,cp:4,fc:8,x:16};
const AV_KEYS=Object.keys(AV_RANGE);
const AV_CORE=['g','sk','h','hc','o','oc','a'];
const DG={'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],'2':['111','001','111','100','111'],'3':['111','001','111','001','111'],'4':['101','101','111','001','001'],'5':['111','100','111','001','111'],'6':['111','100','111','101','111'],'7':['111','001','010','010','010'],'8':['111','101','111','101','111'],'9':['111','101','111','001','111']};
const INK=0x1c1220;       // тёмный контур
const OUT_RGB=[18,8,30];

// ── ФИГУРЫ ────────────────────────────────────────────────────────────────
const fl=Math.floor,ce=Math.ceil;
const shp=(b,f)=>({b,f});
function ell(cx,cy,rx,ry){return shp([cx-rx,cy-ry,cx+rx,cy+ry],(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy<=1?[dx,dy]:null;});}
function cap(x1,y1,x2,y2,r1,r2){
  if(r2===undefined)r2=r1;
  const dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy||1,m=Math.max(r1,r2);
  return shp([Math.min(x1,x2)-m,Math.min(y1,y2)-m,Math.max(x1,x2)+m,Math.max(y1,y2)+m],(x,y)=>{
    let t=((x-x1)*dx+(y-y1)*dy)/L2;t=t<0?0:t>1?1:t;
    const ax=x1+dx*t,ay=y1+dy*t,r=r1+(r2-r1)*t,ex=(x-ax)/r,ey=(y-ay)/r;
    return ex*ex+ey*ey<=1?[ex,ey]:null;});
}
function rr(x0,y0,x1,y1,r){
  const mx=(x0+x1)/2,my=(y0+y1)/2,hw=(x1-x0)/2,hh=(y1-y0)/2;
  return shp([x0,y0,x1,y1],(x,y)=>{
    if(x<x0||x>x1||y<y0||y>y1)return null;
    const qx=Math.abs(x-mx)-(hw-r),qy=Math.abs(y-my)-(hh-r);
    if(qx>0&&qy>0&&qx*qx+qy*qy>r*r)return null;
    return[(x-mx)/hw*.9,(y-my)/hh*.7];});
}
function rect(x0,y0,x1,y1){return rr(x0,y0,x1,y1,0);}
function poly(pts){
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const mx=(x0+x1)/2,my=(y0+y1)/2,hw=(x1-x0)/2||1,hh=(y1-y0)/2||1;
  return shp([x0,y0,x1,y1],(x,y)=>{
    let c=false;
    for(let i=0,j=pts.length-1;i<pts.length;j=i++){const xi=pts[i][0],yi=pts[i][1],xj=pts[j][0],yj=pts[j][1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}
    return c?[(x-mx)/hw,(y-my)/hh]:null;});
}
// симметричный контур по строкам: pts=[[y,halfwidth],...], cx — ось
function sym(pts,cx,step=1){
  const L=[],R=[];
  const y0=pts[0][0],y1=pts[pts.length-1][0];
  for(let y=y0;y<y1;y+=step){const h=lerpPts(pts,y);L.push([cx-h,y]);R.push([cx+h,y]);}
  const h=lerpPts(pts,y1);L.push([cx-h,y1]);R.push([cx+h,y1]);
  return poly(L.concat(R.reverse()));
}
function lerpPts(pts,y){
  if(y<=pts[0][0])return pts[0][1];
  for(let i=1;i<pts.length;i++)if(y<=pts[i][0]){const a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]||1);}
  return pts[pts.length-1][1];
}
function uni(...a){return shp([Math.min(...a.map(s=>s.b[0])),Math.min(...a.map(s=>s.b[1])),Math.max(...a.map(s=>s.b[2])),Math.max(...a.map(s=>s.b[3]))],(x,y)=>{for(const s of a){const n=s.f(x,y);if(n)return n;}return null;});}
function inter(a,b){return shp(a.b,(x,y)=>b.f(x,y)?a.f(x,y):null);}
function sub(a,b){return shp(a.b,(x,y)=>b.f(x,y)?null:a.f(x,y));}
const clip=(s,fn)=>shp(s.b,(x,y)=>fn(x,y)?s.f(x,y):null);
// нормали головы относительно её центра
const renorm=(s,cx,cy,rx,ry)=>shp(s.b,(x,y)=>s.f(x,y)?[(x-cx)/rx,(y-cy)/ry]:null);

// ── ХОЛСТ ─────────────────────────────────────────────────────────────────
class Painter{
  constructor(){this.buf=new Int32Array(PW*PH).fill(-1);this.ox=0;this.oy=0;}
  set(x,y,c){x=Math.round(x)+this.ox;y=Math.round(y)+this.oy;if(x>=0&&y>=0&&x<PW&&y<PH)this.buf[y*PW+x]=c;}
  get(x,y){x=Math.round(x)+this.ox;y=Math.round(y)+this.oy;return x>=0&&y>=0&&x<PW&&y<PH?this.buf[y*PW+x]:-1;}
  hl(x0,x1,y,c){x0=Math.round(x0);x1=Math.round(x1);for(let x=x0;x<=x1;x++)this.set(x,y,c);}
  vl(x,y0,y1,c){y0=Math.round(y0);y1=Math.round(y1);for(let y=y0;y<=y1;y++)this.set(x,y,c);}
  rectf(x0,y0,x1,y1,c){for(let y=Math.round(y0);y<=Math.round(y1);y++)for(let x=Math.round(x0);x<=Math.round(x1);x++)this.set(x,y,c);}
  line(x0,y0,x1,y1,c){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){this.set(x0,y0,c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
  // R=[свет,база,тень,глубокая]; o.flat — одна база; o.dark сдвиг тона; o.edge — внутренний контур
  // o.tex(x,y)->сдвиг тона; o.k — сила объёма
  paint(sh,R,o={}){
    const[x0,y0,x1,y1]=sh.b,k=o.k||1,dk=o.dark||0;
    const LV=[R[3],R[2],R[1],R[0]];
    const edgeOn=o.edge===undefined?true:o.edge;
    const edgeC=typeof o.edge==='number'?o.edge:mixp(R[2],0x08040f,.55);
    for(let y=fl(y0);y<=ce(y1);y++)for(let x=fl(x0);x<=ce(x1);x++){
      const n=sh.f(x+.5,y+.5);if(!n)continue;
      let t;
      if(o.flat)t=2;
      else{const L=-(n[0]*.62+n[1]*.55)*k;t=L<-.25?1:L>.72?3:2;}
      if(o.tex)t+=o.tex(x,y);
      t=t+dk;t=t<0?0:t>3?3:t;
      let c=LV[t];
      if(edgeOn&&(!sh.f(x-.5,y+.5)||!sh.f(x+1.5,y+.5)||!sh.f(x+.5,y-.5)||!sh.f(x+.5,y+1.5)))c=edgeC;
      this.set(x,y,c);
    }
  }
}
// внешний контур в 2 пикселя, цвет — тёмный фиолетовый
function outlinePass(buf){
  let cur=buf;
  for(let p=0;p<2;p++){
    const out=new Int32Array(cur);
    for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){
      if(cur[y*PW+x]>=0)continue;
      let hit=false;
      if(x>0&&cur[y*PW+x-1]>=0)hit=true;
      else if(x<PW-1&&cur[y*PW+x+1]>=0)hit=true;
      else if(y>0&&cur[(y-1)*PW+x]>=0)hit=true;
      else if(y<PH-1&&cur[(y+1)*PW+x]>=0)hit=true;
      if(hit)out[y*PW+x]=pk(OUT_RGB);
    }
    cur=out;
  }
  return cur;
}

// ── АВАТАР: нормализация/валидация ─────────────────────────────────────────
function normAv(a){const o={};for(const k of AV_KEYS){const v=a&&Number.isInteger(a[k])?a[k]:0;o[k]=v>=0&&v<AV_RANGE[k]?v:0;}return o;}
function validAvatar(a){
  if(!a||typeof a!=='object')return false;
  if(!AV_CORE.every(k=>Number.isInteger(a[k])))return false;
  return AV_KEYS.every(k=>a[k]===undefined||(Number.isInteger(a[k])&&a[k]>=0&&a[k]<AV_RANGE[k]));
}
function randomAvatar(g){
  const r=n=>Math.floor(Math.random()*n),o={};
  for(const k of AV_KEYS)o[k]=r(AV_RANGE[k]);
  o.x=0;
  if(g===0||g===1)o.g=g;
  const pick=a=>a[r(a.length)];
  if(o.g===0){o.h=pick([0,1,2,5,6,7,8,9,10,12,13,15,16,18,19]);o.p=pick([0,1,2,3,5,6,7]);}
  else{o.h=pick([0,3,4,5,6,7,10,11,13,14,17,18,19,12]);}
  o.fh=o.g===1?0:(Math.random()<.7?0:o.fh);
  o.cp=Math.random()<.8?0:o.cp;
  o.it=Math.random()<.6?0:o.it;
  o.a=Math.random()<.35?0:o.a;
  if(Math.random()<.6){o.o=10+r(5);o.p=o.g===1&&Math.random()<.3?4:6+r(2);o.s=4+r(2);}
  return o;
}
