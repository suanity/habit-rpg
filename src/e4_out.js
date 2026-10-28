// ── ПЛАЩ, ПРЕДМЕТЫ, СБОРКА КАДРА, ВЫВОД ─────────────────────────────────────
function drawCape(c){
  const{P,av,r}=c;if(!av.cp)return;
  const R=ramp(['#c0392b','#22232e','#2f5fb8'][av.cp-1]),sw=c.pose.dx*.5,cx=CX+r.ts*.5;
  const pts=[[r.sy,r.sh+1],[r.sy+8,r.sh+3.6],[r.sy+20,r.sh+7],[r.lb-6,r.sh+9.4]];
  const L=[],Rr=[];
  for(let y=r.sy;y<=r.lb-6;y++){const h=lerpPts(pts,y),k=y>r.sy+14?(y-r.sy-14)/30:0;L.push([cx-h-sw*k*2,y]);Rr.push([cx+h-sw*k*2,y]);}
  P.paint(poly(L.concat(Rr.reverse())),R,{});
  for(let y=r.sy+8;y<=r.lb-8;y++){const k=(y-r.sy-8)/34;P.set(cx-5-k*5,y,R[2]);P.set(cx+5+k*5,y,R[2]);}
  P.hl(cx-r.sh-8,cx+r.sh+8,r.lb-6,R[3]);
}
function drawItem(c){
  const{P,av,r,SK,G}=c;if(!av.it||!G)return;
  const a=armGeo(c,G,-1),hx=Math.round(a.wx),hy=Math.round(a.wy+r.ar*.9);
  const fingers=()=>{P.paint(ell(a.wx-.2,hy+.4,r.ar+.4,r.ar),SK,{});P.hl(hx-3,hx,hy+3,SK[2]);P.set(hx-3,hy+1,SK[2]);};
  if(av.it===1){ // камера
    const body=ramp('#3a3f50');
    P.paint(rr(hx-11,hy-4,hx+4,hy+7,1.4),body,{});
    P.paint(ell(hx-5,hy+2,4.4,4.4),ramp('#1d2030'),{});P.paint(ell(hx-5,hy+2,2.4,2.4),ramp('#3f8fe0'),{flat:true});P.set(hx-6,hy,0xffffff);
    P.hl(hx-10,hx+2,hy-4,body[0]);P.rectf(hx,hy-2,hx+2,hy,0xe5484d);P.rectf(hx-1,hy+2,hx+2,hy+4,body[2]);
    fingers();
  }else if(av.it===2){ // кофе
    const cup=ramp('#f1f3f9');
    P.paint(poly([[hx-4.6,hy-5],[hx+4.6,hy-5],[hx+3.4,hy+7],[hx-3.4,hy+7]]),cup,{});
    P.hl(hx-4,hx+3,hy-1,0xb9722f);P.hl(hx-4,hx+3,hy,0xb9722f);P.hl(hx-4,hx+3,hy+1,0xb9722f);P.hl(hx-5,hx+4,hy-6,0x6a4a30);
    for(let k=0;k<3;k++)P.set(hx-1+(k%2),hy-8-k*2,0xd6dbe6);
    fingers();
  }else if(av.it===3){ // книга
    const bk=ramp('#7a3b2e');
    P.paint(rr(hx-9,hy-6,hx+3,hy+8,1),bk,{});
    P.vl(hx-8,hy-6,hy+8,bk[3]);P.hl(hx-6,hx+1,hy-2,0xe9d9a8);P.hl(hx-6,hx+1,hy-1,0xe9d9a8);P.hl(hx-6,hx-1,hy+2,bk[0]);P.hl(hx-8,hx+3,hy+8,0xe9d9a8);
    fingers();
  }else if(av.it===4){ // меч
    const bl=ramp('#c9d2e4');
    P.paint(rect(hx-2,hy-38,hx+3,hy-1),bl,{});
    P.vl(hx-1,hy-37,hy-2,0xffffff);P.vl(hx+1,hy-37,hy-2,0x8e99b3);P.set(hx,hy-39,0xffffff);
    P.rectf(hx-7,hy-1,hx+7,hy+1,0xe3b64a);P.set(hx-7,hy-1,0xb8862a);P.set(hx+7,hy-1,0xb8862a);P.hl(hx-6,hx+6,hy+1,0xb8862a);
    P.paint(rr(hx-1.4,hy+1,hx+2,hy+7,.6),ramp('#6a3d2a'),{});P.paint(ell(hx+.3,hy+8,2.8,2.2),ramp('#e3b64a'),{});
    fingers();
  }else if(av.it===5){ // гантель
    const mt=ramp('#4a5060');
    P.paint(rect(hx-10,hy+.4,hx+9,hy+3.6),ramp('#b8bdca'),{});
    P.paint(rr(hx-12,hy-4,hx-7,hy+8,.8),mt,{});P.paint(rr(hx+7,hy-4,hx+12,hy+8,.8),mt,{});
    fingers();
  }
}

// ── СБОРКА ────────────────────────────────────────────────────────────────
function renderAvatar(av,pose){
  av=normAv(av);pose=pose||{dx:0,bob:0,blink:0};
  const P=new Painter(),r=mkRig(av,pose),f=av.g===1;
  const SK=skinRamp(SKIN[av.sk]);
  const c={P,av,r,f,SK,HR:ramp(HAIRC[av.hc]),OR:ramp(OUTC[av.oc]),PR:ramp(PANTC[av.pc]),pose,hg:headGeo(av),G:null};
  c.hx=CX+r.hs;c.hy=r.hy;
  c.head=headShape(c);
  P.oy=0;drawCape(c);
  P.oy=pose.bob;drawHairBack(c);
  P.oy=0;drawLegs(c);
  P.oy=pose.bob;drawTop(c);drawItem(c);
  drawHead(c);drawHairFront(c);drawAccessory(c);
  return P.buf;
}

// ── ВЫВОД ─────────────────────────────────────────────────────────────────
const CROPS={head:[8,0,56,42],bust:[10,0,52,40],face:[16,8,40,28],top:[4,32,64,36],legs:[4,56,64,40],full:[0,0,PW,PH]};
const _fc=new Map();
function avKey(av){return AV_KEYS.map(k=>av[k]).join(',');}
function frameCanvas(av,pose){
  const key=avKey(av)+'|'+pose.dx+'|'+pose.bob+'|'+pose.blink+'|'+(pose.t||0);
  let cv=_fc.get(key);
  if(cv)return cv;
  let buf=outlinePass(renderAvatar(av,pose));
  if(av.x&&typeof applySkin==='function')buf=applySkin(buf,av,pose);
  cv=document.createElement('canvas');cv.width=PW;cv.height=PH;
  const ctx=cv.getContext('2d'),img=ctx.createImageData(PW,PH);
  for(let i=0;i<buf.length;i++){const v=buf[i];if(v>=0){img.data[i*4]=v>>16&255;img.data[i*4+1]=v>>8&255;img.data[i*4+2]=v&255;img.data[i*4+3]=255;}}
  ctx.putImageData(img,0,0);
  if(_fc.size>360)_fc.delete(_fc.keys().next().value);
  _fc.set(key,cv);
  return cv;
}
const _anim=new Set();
const IDLE=pose=>pose;
function paint(cv,av,crop,pose){
  const src=frameCanvas(av,pose),r=CROPS[crop]||CROPS.full;
  const dpr=window.devicePixelRatio||1;
  if(!cv._tw){const w=parseFloat(getComputedStyle(cv).width);cv._tw=w>0?w:r[2]*3;}
  const k=Math.max(1,Math.round(cv._tw*dpr/r[2])),W=r[2]*k,H=r[3]*k;
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;cv.style.width=(W/dpr)+'px';cv.style.height=(H/dpr)+'px';}
  const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);ctx.drawImage(src,r[0],r[1],r[2],r[3],0,0,W,H);
  cv.style.imageRendering='pixelated';
}
const REST={dx:0,bob:0,blink:0,t:0};
function drawHero(cv,av,crop,still){
  av=normAv(av);
  paint(cv,av,crop,REST);
  if(!still&&!matchMedia('(prefers-reduced-motion: reduce)').matches){cv._av=av;cv._crop=crop;_anim.add(cv);}
  else _anim.delete(cv);
}
// цикл покоя: смещение веса с ноги на ногу, дыхание, моргание
const DX=[0,0,-1.2,-2.4,-2.4,-2.4,-2.4,-1.2,0,0,1.2,2.4,2.4,2.4,2.4,1.2];
const BOB=[0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0];
const BLK=[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0];
let _tick=0,_timer=null;
function animTick(){
  _tick=(_tick+1)%DX.length;
  const pose={dx:DX[_tick],bob:BOB[_tick],blink:BLK[_tick],t:_tick&3};
  for(const cv of _anim){
    if(!cv.isConnected){_anim.delete(cv);continue;}
    const sk=cv._av&&cv._av.x?pose:{...pose,t:0};
    paint(cv,cv._av,cv._crop,sk);
  }
}
function startAnim(){if(_timer)return;_timer=setInterval(animTick,240);}
function heroCanvas(av,cls,crop,still){const cv=document.createElement('canvas');if(cls)cv.className=cls;drawHero(cv,av,crop,still);return cv;}

// ── ИКОНКИ СТАТОВ (8×8) ───────────────────────────────────────────────────
function shade(hex,f){const h=hex.replace('#','');const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));const m=c.map(v=>Math.max(0,Math.min(255,Math.round(f<1?v*f:v+(255-v)*(f-1)))));return'#'+m.map(v=>v.toString(16).padStart(2,'0')).join('');}
const ICONS={
  VIGOR:['.##..##.','########','########','########','.######.','..####..','...##...','........'],
  MIND:['..####..','.#++++#.','########','.######.','..####..','...##...','........','........'],
  WILL:['########','#++++++#','#++++++#','#++++++#','.#++++#.','..#++#..','...##...','........'],
  AURA:['...##...','...##...','########','.######.','..####..','.##..##.','.#....#.','........'],
  GOLD:['..####..','.######.','##+##+##','##+##+##','##+##+##','.######.','..####..','........'],
};
function iconSVG(stat,color,size){
  const m=ICONS[stat];if(!m)return'';
  let r='';
  m.forEach((row,y)=>{for(let x=0;x<8;x++){const ch=row[x];if(ch==='#')r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;else if(ch==='+')r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${shade(color,.62)}"/>`;}});
  return`<svg width="${size}" height="${size}" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
