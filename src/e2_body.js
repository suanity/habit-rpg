// ── ТЕЛО: каркас, ноги, обувь, верх ────────────────────────────────────────
// pose: {dx — смещение веса (px), bob — вдох (0/1), blink}
function mkRig(av,pose){
  const f=av.g===1;
  const T=[[11.8,11.4,8.8,9.6,3.3,5.0],[13.2,12.8,10,10.8,3.7,5.5],[15.2,14.8,10.4,11.4,4.3,6],[14.6,15.2,13.4,13.6,4.6,6.6]][av.b];
  const r={sh:T[0],ch:T[1],wa:T[2],hp:T[3],ar:T[4],lg:T[5],f};
  if(f){r.sh-=2.2;r.ch-=1.2;r.wa-=1.5;r.hp+=.4;r.ar-=.4;r.lg-=.2;}
  r.sy=36;r.tb=60;r.lt=57;r.lb=82;r.shoeY=86.5;r.hy=19.5;r.nk=f?3.1:3.7;
  r.lo=r.hp*.55+.4;                       // смещение ног от оси
  r.dx=pose.dx||0;r.ts=r.dx*.7;r.hs=r.dx*.45;
  r.cx=CX+r.ts;
  return r;
}
const white=0xf1f3f9,whiteD=0xc9ccd6;

// ── ОБУВЬ ─────────────────────────────────────────────────────────────────
const SHOES=[
  {col:'#e9ecf3',sole:'#9aa3b8',acc:'#e5484d',k:'snk'},
  {col:'#2a2d3a',sole:'#e0e3ec',acc:'#5a6070',k:'snk'},
  {col:'#6a4426',sole:'#2a1a10',acc:'#a8743f',k:'boot'},
  {col:'#d63b3b',sole:'#e9ecf3',acc:'#ffffff',k:'hi'},
  {col:'#3a2f2a',sole:'#c8a46a',acc:'#e0b060',k:'cboot'},
  {col:'#eceff6',sole:'#cfd5e4',acc:'#ff7a2f',k:'csnk'},
];
function drawShoes(c){
  const{P,av,r}=c;
  const sd=SHOES[av.s],R=ramp(sd.col),SO=ramp(sd.sole),AC=hex2(sd.acc),acc=pk(AC);
  const chunky=sd.k==='cboot'||sd.k==='csnk';
  const srx=chunky?9.2:8.2,sry=chunky?5.4:4.4,sy0=r.shoeY+(chunky?.4:0);
  for(const s of[-1,1]){
    const fx=CX+s*(r.lo*1.12+1.5);
    // подошва (толстая у chunky)
    const soleTop=sy0+sry-(chunky?3.4:2.2),soleBot=sy0+sry+(chunky?1.8:1);
    P.paint(ell(fx,sy0,srx,sry),R,{});
    P.paint(rr(fx-srx+.5,soleTop,fx+srx-.5,soleBot,1.2),SO,{});
    if(chunky){ // протектор
      for(let x=Math.round(fx-srx+2);x<=Math.round(fx+srx-2);x+=2)P.set(x,Math.round(soleBot)-0,SO[2]);
      P.hl(fx-srx+1,fx+srx-1,soleTop+.6,SO[0]);
    }
    // акцентная полоса и носок
    P.hl(fx-srx*.55,fx+srx*.35,soleTop-1,acc);
    P.paint(ell(fx-s*.6,sy0-.8,srx*.5,sry*.5),R,{dark:1,edge:false,flat:true});
    P.hl(fx-2.5,fx+1.5,sy0-sry+1.4,R[0]);
    // шнуровка
    for(let k=0;k<3;k++)P.hl(fx-1.5-s*0,fx+1.5,sy0-sry+3.2+k*1.6,k%2?R[0]:white);
    if(sd.k==='hi'||sd.k==='boot'||sd.k==='cboot'){ // голенище
      const top=sd.k==='hi'?r.lb-6:r.lb-5.5;
      P.paint(rr(fx-5.6,top,fx+5.6,sy0-sry+2.4,1.6),R,{});
      P.hl(fx-4.6,fx+4.6,top+1,sd.k==='hi'?white:R[0]);
      if(sd.k==='hi'){P.hl(fx-3,fx+3,top+4,white);P.set(fx,top+6,acc);}
      else{P.hl(fx-4.6,fx+4.6,top+3.4,R[2]);P.rectf(fx-1,top+4.6,fx+1,top+6.6,acc);}
    }
    if(sd.k==='snk'||sd.k==='csnk'){ // ярлык на пятке/логотип
      P.set(fx+s*(srx-3),sy0-1,acc);P.set(fx+s*(srx-3),sy0,acc);
    }
  }
}

// ── НОГИ ──────────────────────────────────────────────────────────────────
function drawLegs(c){
  const{P,av,r,S}=c,PR=c.PR,pt=av.p;
  const legC=(s)=>({hx:CX+s*r.lo+r.dx,fx:CX+s*(r.lo*1.12+1.5)});
  const skinLegs=pt===2||pt===4;
  const hem=pt===6||pt===7?84:pt===1?83:pt===3?81.4:82.2;
  // голые ноги: шорты, юбка
  if(skinLegs){
    for(const s of[-1,1]){const l=legC(s);
      P.paint(cap(l.hx,r.lt+4,l.fx,r.lb+1.5,r.lg*.95,r.lg*.82),c.SK,{});
      // носок/щиколотка
      P.hl(l.fx-r.lg*.8,l.fx+r.lg*.8,r.lb-.5,whiteD);P.hl(l.fx-r.lg*.8,l.fx+r.lg*.8,r.lb-1.5,white);
    }
  }
  drawShoes(c);
  const hipBlock=()=>P.paint(rr(CX-r.lo-r.lg+r.dx*.5,r.lt-4,CX+r.lo+r.lg+r.dx*.5,r.lt+8,4),PR,{edge:false});
  const legFill=(s,flare,topR,o={})=>{
    const l=legC(s),endY=o.endY||hem;
    const shape=clip(cap(l.hx,r.lt,l.fx,endY+2,r.lg+topR,r.lg+flare),(x,y)=>y<endY);
    P.paint(shape,PR,{});
    return l;
  };
  if(pt===0){ // джинсы: прямые
    for(const s of[-1,1]){const l=legFill(s,.2,.4);
      P.paint(ell(l.hx+(l.fx-l.hx)*.3,r.lt+10,2.4,3.6),PR,{flat:true,dark:-1,edge:false}); // выбеленность
      P.line(l.hx+s*(r.lg-1.5),r.lt+1,l.hx+s*(r.lg-2.5),r.lt+6,PR[3]);                    // шов кармана
      P.hl(l.fx-r.lg,l.fx+r.lg,hem-1,PR[2]);P.hl(l.fx-r.lg,l.fx+r.lg,hem-3,PR[3]);         // отворот
      P.vl(Math.round(l.fx+s*(r.lg-.5)),r.lt+8,hem-4,PR[2]);
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,0x2a2230);
  }else if(pt===1){ // карго
    for(const s of[-1,1]){const l=legFill(s,1.4,.9);
      const px=l.hx+s*(r.lg+.6),pt0=r.lt+8;
      P.paint(rr(px-3.2,pt0,px+3.2,pt0+9,.8),PR,{dark:1,flat:true});         // накладной карман
      P.hl(px-3,px+3,pt0+2,PR[0]);P.set(px,pt0+3,0xcfd3df);
      P.hl(l.fx-r.lg-1,l.fx+r.lg+1,hem-1,PR[2]);P.hl(l.fx-r.lg-1,l.fx+r.lg+1,hem-5,PR[3]);
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,0x2a2230);
  }else if(pt===2){ // шорты
    for(const s of[-1,1]){const l=legC(s);
      P.paint(clip(cap(l.hx,r.lt,l.hx+(l.fx-l.hx)*.5,r.lt+18,r.lg+1.2,r.lg+1.8),(x,y)=>y<r.lt+17),PR,{});
      P.hl(l.hx+(l.fx-l.hx)*.5-r.lg-1.5,l.hx+(l.fx-l.hx)*.5+r.lg+1.5,r.lt+16,PR[3]);
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,0x2a2230);
  }else if(pt===3){ // джоггеры: сужаются к манжете
    for(const s of[-1,1]){const l=legFill(s,-1.2,.2);
      P.hl(l.fx-r.lg+1,l.fx+r.lg-1,hem-1,PR[3]);P.hl(l.fx-r.lg+1,l.fx+r.lg-1,hem-2,PR[2]);P.hl(l.fx-r.lg+1,l.fx+r.lg-1,hem-3,PR[0]);
      P.line(l.hx+s*(r.lg-1),r.lt+3,l.fx+s*(r.lg-2),hem-5,PR[3]);
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,PR[3]);
  }else if(pt===4){ // юбка
    const sk=sym([[r.lt-4,r.hp+.6],[r.lt+4,r.hp+3],[r.lt+13,r.hp+6.6]],CX+r.dx*.4,1.5);
    P.paint(sk,PR,{});
    for(let x=-12;x<=12;x+=4)P.vl(Math.round(CX+x+r.dx*.4),r.lt+2,r.lt+12,PR[2]);
    P.hl(CX-r.hp-6.4+r.dx*.4,CX+r.hp+6.4+r.dx*.4,r.lt+13,PR[3]);
    P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,PR[3]);
  }else if(pt===5){ // брюки со стрелкой
    for(const s of[-1,1]){const l=legFill(s,.4,.3);
      P.vl(Math.round(l.hx+(l.fx-l.hx)*.5),r.lt+6,hem-2,PR[0]);P.vl(Math.round(l.hx+(l.fx-l.hx)*.5)+1,r.lt+6,hem-2,PR[2]);
      P.hl(l.fx-r.lg,l.fx+r.lg,hem-1,PR[3]);
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,0x2a2230);P.hl(CX-1,CX,r.lt-3,0xe3b64a);
  }else{ // 6 широкие джинсы, 7 широкие спортивные
    for(const s of[-1,1]){const l=legFill(s,3.6,.4);
      if(pt===6){
        P.paint(ell(l.hx+(l.fx-l.hx)*.4,r.lt+10,2.8,3.6),PR,{flat:true,dark:-1,edge:false});
        P.hl(l.fx-r.lg-1,l.fx+r.lg+1,hem-2,PR[2]);P.hl(l.fx-r.lg,l.fx+r.lg,hem-4,PR[2]);P.hl(l.fx-r.lg,l.fx+r.lg,hem-8,PR[3]);
        P.line(l.hx+s*(r.lg-2),r.lt+1,l.hx+s*(r.lg-3),r.lt+6,PR[3]);
      }else{
        P.vl(Math.round(l.hx+s*(r.lg+.2)+(l.fx-l.hx)*.5),r.lt+4,hem-2,white);
        P.hl(l.fx-r.lg-1,l.fx+r.lg+1,hem-2,PR[3]);
      }
    }
    hipBlock();P.hl(CX-r.hp+1,CX+r.hp-1,r.lt-3,pt===6?0x2a2230:PR[3]);
    if(pt===6)P.hl(CX-1,CX,r.lt-3,0xe3b64a);
  }
}

// ── ВЕРХ ──────────────────────────────────────────────────────────────────
const OF=[
  {e:[.6,1.2,1.2],h:2,sl:'long',fat:.7,fn:'hoodie'},
  {e:[.4,.8,.8],h:1,sl:'short',fat:.3,fn:'tee'},
  {e:[.8,1.4,1.2],h:1,sl:'long',fat:.8,fn:'bomber'},
  {e:[1.2,1.8,1.2],h:1,sl:'long',fat:.8,fn:'armor'},
  {e:[0,.3,.5],h:0,sl:'none',fat:0,fn:'tank'},
  {e:[.6,1,1],h:4,sl:'long',fat:.5,fn:'suit'},
  {e:[.8,1.4,1],h:1,sl:'long',fat:.7,fn:'leather'},
  {e:[.6,1.2,2],h:0,sl:'long',fat:.8,fn:'robe'},
  {e:[.7,1.2,1.2],h:2,sl:'long',fat:.6,fn:'track'},
  {e:[.4,.8,.6],h:1,sl:'short',fat:.3,fn:'vest'},
  {e:[2,3.4,5],h:4,sl:'short',fat:1.8,fn:'otee'},
  {e:[0,.2,0],h:0,sl:'long',fat:0,fn:'rash'},
  {e:[2.2,3.6,5.6],h:5,sl:'long',fat:1.9,fn:'ohood'},
  {e:[1,1.8,2.4],h:3,sl:'long',fat:.9,fn:'plaid'},
  {e:[1.2,2.2,3.4],h:3,sl:'none',fat:0,fn:'jersey'},
];
function mkGarment(r,spec){
  const E=spec.e,hem=r.tb+spec.h;
  const pts=[[r.sy-1,r.nk+.8],[r.sy+.5,r.sh-1+E[0]*.5],[r.sy+3.5,r.sh+E[0]],[r.sy+9,r.ch+E[1]],[r.sy+16,r.wa+E[1]*.5+E[2]*.5],[r.tb,r.hp+E[2]*.8],[Math.max(hem,r.tb+.01),r.hp+E[2]]];
  const hw=y=>lerpPts(pts,y);
  const shape=sym(pts,r.cx,1.5);
  return{hw,shape,hem,shG:r.sh+E[0],fat:spec.fat,sl:spec.sl,E};
}
function armGeo(c,G,s){
  const{r}=c;
  const jx=r.cx+s*(G.shG-2.4),jy=r.sy+3.6+s*r.dx*.25;
  const ex=r.cx+s*(G.shG+.7+G.fat*.35),ey=r.sy+15.5;
  const wx=ex+s*.9,wy=r.tb+1.5;
  return{jx,jy,ex,ey,wx,wy};
}
function drawArms(c,G,SR,o={}){
  const{P,r,SK}=c,rad=r.ar,fat=G.fat;
  for(const s of[-1,1]){
    const a=armGeo(c,G,s);
    const up=cap(a.jx,a.jy,a.ex,a.ey,rad+fat+.5,rad+fat);
    const fo=cap(a.ex,a.ey,a.wx,a.wy,rad+fat,rad+fat*.8-.2);
    if(G.sl==='long'){P.paint(up,SR,{});P.paint(fo,SR,{});}
    else if(G.sl==='short'){P.paint(cap(a.ex,a.ey-3,a.wx,a.wy,rad+.1,rad-.3),SK,{});P.paint(up,SR,{});}
    else{P.paint(up,SK,{});P.paint(fo,SK,{});}
    // кисть
    P.paint(ell(a.wx+s*.2,a.wy+r.ar*.95,r.ar+.9,r.ar*1.25),SK,{});
    const hx=Math.round(a.wx+s*.2);
    P.hl(hx-1,hx+1,a.wy+r.ar*1.9,SK[2]);P.set(hx+s*2,a.wy+r.ar*.6,SK[2]);
    if(o.cuff){P.hl(a.wx-r.ar-fat*.6,a.wx+r.ar+fat*.6,a.wy-.5,o.cuff[3]);P.hl(a.wx-r.ar-fat*.6,a.wx+r.ar+fat*.6,a.wy+.5,o.cuff[2]);P.hl(a.wx-r.ar-fat*.6,a.wx+r.ar+fat*.6,a.wy-1.5,o.cuff[0]);}
  }
}
const _pn={};
function drawTop(c){
  const{P,av,r,SK,OR}=c;
  const spec=OF[av.o],G=mkGarment(r,spec);
  c.G=G;
  if(spec.fn==='robe'){drawRobe(c,G);return;}
  P.paint(G.shape,OR,{});
  (OUTFITFN[spec.fn])(c,G);
}
const hwAt=(G,y)=>G.hw(y);
function trimHem(c,G,col,rows=2){
  const{P,r}=c;
  for(let k=0;k<rows;k++){const y=G.hem-k,h=G.hw(y);P.hl(r.cx-h+.5,r.cx+h-.5,y,col[k===0?3:k===1?2:1]);}
}
// воротник-капюшон для худи
function hoodRing(c,G,wide){
  const{P,r,OR,SK}=c;
  P.paint(ell(r.cx,r.sy-.2,r.nk+wide,4.6),OR,{dark:1});
  P.paint(ell(r.cx,r.sy+.9,r.nk+wide-3.6,2.8),OR,{flat:true,dark:-1,edge:false});
  P.paint(ell(r.cx,r.sy+.8,r.nk-.4,1.8),SK,{flat:true,edge:false});
}
function hoodStrings(c,G,len){
  const{P,r}=c;
  for(const s of[-1,1]){const x=Math.round(r.cx+s*3.4);P.vl(x,r.sy+4,r.sy+4+len,white);P.vl(x+(s<0?-1:1)*(1),r.sy+4,r.sy+4+len,whiteD);P.set(x,r.sy+5+len,0xb8bdca);P.set(x+s,r.sy+5+len,0xb8bdca);}
}
function foldLines(c,G,OR,list){
  const{P}=c;for(const[a,b,x,y]of list)P.line(a,b,x,y,OR[2]);
}
const OUTFITFN={
  hoodie(c,G){
    const{P,r,OR}=c;drawArms(c,G,OR,{cuff:OR});
    hoodRing(c,G,5.6);hoodStrings(c,G,8);
    const cx=r.cx,pk0=G.hem-11;
    P.paint(poly([[cx-G.hw(pk0)+2,pk0],[cx+G.hw(pk0)-2,pk0],[cx+G.hw(G.hem)+.2,G.hem-.5],[cx-G.hw(G.hem)-.2,G.hem-.5]]),OR,{dark:1,flat:true});
    P.hl(cx-G.hw(pk0)+4,cx+G.hw(pk0)-4,pk0+1,OR[2]);
    P.vl(cx,pk0+3,G.hem-1,OR[3]);
    trimHem(c,G,OR,3);
    foldLines(c,G,OR,[[cx-G.hw(r.sy+10)+3,r.sy+11,cx-G.hw(r.sy+10)+5,r.sy+15],[cx+G.hw(r.sy+10)-3,r.sy+10,cx+G.hw(r.sy+10)-5,r.sy+15]]);
  },
  ohood(c,G){
    const{P,r,OR}=c;drawArms(c,G,OR,{cuff:OR});
    hoodRing(c,G,7.4);hoodStrings(c,G,9);
    const cx=r.cx;
    // принт на груди
    P.hl(cx-5,cx+5,r.sy+12,white);P.hl(cx-4,cx+4,r.sy+13,whiteD);P.set(cx-1,r.sy+13,OR[2]);P.set(cx,r.sy+13,OR[2]);
    const pk0=G.hem-12;
    P.paint(poly([[cx-G.hw(pk0)+1,pk0],[cx+G.hw(pk0)-1,pk0],[cx+G.hw(G.hem)+.4,G.hem-.5],[cx-G.hw(G.hem)-.4,G.hem-.5]]),OR,{dark:1,flat:true});
    P.hl(cx-G.hw(pk0)+3,cx+G.hw(pk0)-3,pk0+1,OR[2]);P.vl(cx,pk0+3,G.hem-1,OR[3]);
    trimHem(c,G,OR,3);
    // складки на рукавах (гармошка)
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.hl(a.ex-r.ar-1.4,a.ex+r.ar+1.4,a.ey+2,OR[3]);P.hl(a.ex-r.ar-1.2,a.ex+r.ar+1.2,a.ey+3,OR[2]);P.hl(a.wx-r.ar-2,a.wx+r.ar+2,a.wy-4,OR[3]);}
    foldLines(c,G,OR,[[cx-G.hw(r.sy+10)+3,r.sy+11,cx-G.hw(r.sy+10)+6,r.sy+17],[cx+G.hw(r.sy+10)-3,r.sy+10,cx+G.hw(r.sy+10)-6,r.sy+17]]);
  },
  tee(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    drawArms(c,G,OR,{});
    P.paint(ell(cx,r.sy+.4,r.nk+1.8,2.2),OR,{dark:1,edge:true});
    P.paint(ell(cx,r.sy+1.2,r.nk+.6,1.5),SK,{flat:true,edge:false});
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.hl(a.ex-r.ar-.6,a.ex+r.ar+.6,a.ey-2,OR[3]);P.hl(a.ex-r.ar-.6,a.ex+r.ar+.6,a.ey-1,OR[2]);}
    P.hl(cx-G.hw(r.sy+7)+3,cx+G.hw(r.sy+7)-3,r.sy+8,OR[0]);
    foldLines(c,G,OR,[[cx-4,r.sy+19,cx-6,G.hem-2],[cx+5,r.sy+18,cx+6,G.hem-2]]);
    trimHem(c,G,OR,2);
  },
  otee(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    drawArms(c,G,OR,{});
    P.paint(ell(cx,r.sy+.4,r.nk+1.8,2.2),OR,{dark:1,edge:true});
    P.paint(ell(cx,r.sy+1.2,r.nk+.6,1.5),SK,{flat:true,edge:false});
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.hl(a.ex-r.ar-G.fat-1.4,a.ex+r.ar+G.fat+.6,a.ey-2,OR[3]);P.hl(a.ex-r.ar-G.fat-1.2,a.ex+r.ar+G.fat+.4,a.ey-1,OR[2]);}
    // принт
    P.paint(rr(cx-7,r.sy+9,cx+7,r.sy+20,1.6),ramp('#1b1a20'),{flat:true});
    const pc=0xfff4d6;P.hl(cx-5,cx+5,r.sy+11,pc);P.hl(cx-5,cx+1,r.sy+13,pc);P.hl(cx-5,cx+5,r.sy+15,pc);P.hl(cx-5,cx-1,r.sy+17,pc);P.set(cx+3,r.sy+13,0xff7a2f);P.set(cx+4,r.sy+13,0xff7a2f);
    foldLines(c,G,OR,[[cx-8,r.sy+22,cx-11,G.hem-2],[cx+9,r.sy+21,cx+11,G.hem-2],[cx-3,r.sy+23,cx-4,G.hem-1]]);
    trimHem(c,G,OR,2);
  },
  rash(c,G){
    const{P,r,OR}=c,cx=r.cx,DK=ramp('#2b3040');
    drawArms(c,G,OR,{});
    for(const s of[-1,1]){ // тёмные боковые вставки
      const pts=[];for(let y=r.sy+4;y<=r.tb;y+=2)pts.push([cx+s*(G.hw(y)-.5),y]);
      const pts2=pts.map(p=>[p[0]-s*3.6,p[1]]).reverse();
      P.paint(poly(pts.concat(pts2)),DK,{edge:false});
    }
    // вставки по рукавам
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.paint(cap(a.jx+s*(r.ar-1.2),a.jy+2,a.ex+s*(r.ar-1.2),a.ey,1.4,1.4),DK,{edge:false});P.paint(cap(a.ex+s*(r.ar-1.2),a.ey,a.wx+s*(r.ar-1.2),a.wy,1.4,1.2),DK,{edge:false});}
    // реглан-швы, мышцы, лого
    P.line(cx-4,r.sy+1,cx-G.hw(r.sy+5)+1,r.sy+7,OR[2]);P.line(cx+4,r.sy+1,cx+G.hw(r.sy+5)-1,r.sy+7,OR[2]);
    P.hl(cx-G.hw(r.sy+10)+4,cx-1,r.sy+11,OR[2]);P.hl(cx+1,cx+G.hw(r.sy+10)-4,r.sy+11,OR[2]);P.vl(cx,r.sy+9,r.sy+16,OR[2]);
    for(let y=r.sy+16;y<=r.tb-2;y+=3)P.hl(cx-1,cx,y,OR[2]);
    P.hl(cx-G.hw(r.sy+7)+3,cx-G.hw(r.sy+7)+5,r.sy+8,white);P.set(cx-G.hw(r.sy+7)+4,r.sy+9,white);
    P.paint(ell(cx,r.sy-.6,r.nk+1.8,2.8),OR,{dark:1});
    P.paint(ell(cx,r.sy+.2,r.nk-.2,1.4),c.SK,{flat:true,edge:false});
    P.hl(cx-G.hw(r.tb)+3,cx+G.hw(r.tb)-3,r.tb-1,OR[3]);
    trimHem(c,G,OR,1);
  },
  jersey(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    drawArms(c,G,OR,{});
    for(const s of[-1,1]){P.paint(cap(cx+s*(G.shG-2.6),r.sy+1.6,cx+s*(G.shG-2.2),r.sy+11,2.8,2.6),SK,{edge:false});}
    // бретели
    for(const s of[-1,1]){const x=cx+s*(r.nk+2);P.paint(rect(Math.min(x,x+s*4.4),r.sy-1,Math.max(x,x+s*4.4),r.sy+3.8),OR,{flat:true});}
    P.paint(poly([[cx-r.nk-.6,r.sy-.4],[cx+r.nk+.6,r.sy-.4],[cx,r.sy+8]]),SK,{flat:true,edge:false});
    for(let k=0;k<7;k++){P.set(cx-r.nk-.4+k*.95,r.sy-.2+k*1.15,white);P.set(cx+r.nk+.4-k*.95,r.sy-.2+k*1.15,white);}
    // номер крупно
    const num=String((c.av.hc*8+c.av.pc+c.av.oc*3)%90+10);
    let nx0=cx-7;
    for(const chn of num){const gl=DG[chn];gl.forEach((row,j)=>{for(let i=0;i<3;i++)if(row[i]==='1')for(let a=0;a<2;a++)for(let b=0;b<2;b++)P.set(nx0+i*2+a,r.sy+11+j*2+b,white);});nx0+=8;}
    P.vl(Math.round(cx-G.hw(r.sy+17)+1),r.sy+12,G.hem-1,whiteD);P.vl(Math.round(cx+G.hw(r.sy+17)-1),r.sy+12,G.hem-1,whiteD);
    P.hl(cx-G.hw(G.hem)+.5,cx+G.hw(G.hem)-.5,G.hem-1,white);P.hl(cx-G.hw(G.hem)+.5,cx+G.hw(G.hem)-.5,G.hem,OR[2]);
  },
  plaid(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    // клетка
    P.paint(G.shape,OR,{tex:(x,y)=>(x%6===0?-1:0)+(y%6===2?1:0),flat:false});
    drawArms(c,G,OR,{cuff:OR});
    const tee=ramp('#eef0f6');
    P.paint(poly([[cx-4.6,r.sy+1],[cx+4.6,r.sy+1],[cx+4.8,G.hem-.5],[cx-4.8,G.hem-.5]]),tee,{flat:true});
    P.paint(ell(cx,r.sy+1.2,r.nk+.4,1.5),SK,{flat:true,edge:false});
    P.hl(cx-2,cx+1,r.sy+8,0x9aa3b8);P.hl(cx-2,cx-1,r.sy+9,0x9aa3b8);
    P.vl(Math.round(cx-5),r.sy+3,G.hem-1,OR[3]);P.vl(Math.round(cx+4),r.sy+3,G.hem-1,OR[3]);
    P.paint(poly([[cx-r.nk-1.2,r.sy-1],[cx-2,r.sy+1],[cx-5.4,r.sy+6],[cx-r.nk-3.4,r.sy+2]]),OR,{dark:-1,flat:true});
    P.paint(poly([[cx+r.nk+1.2,r.sy-1],[cx+2,r.sy+1],[cx+5.4,r.sy+6],[cx+r.nk+3.4,r.sy+2]]),OR,{dark:-1,flat:true});
    P.rectf(cx-G.hw(r.sy+12)+2,r.sy+11,cx-G.hw(r.sy+12)+6,r.sy+15,OR[2]);P.hl(cx-G.hw(r.sy+12)+2,cx-G.hw(r.sy+12)+6,r.sy+11,OR[3]);P.set(cx-G.hw(r.sy+12)+3,r.sy+12,0xe9d9a8);
    P.set(cx-5,r.sy+14,0xe9d9a8);P.set(cx+4,r.sy+19,0xe9d9a8);
    trimHem(c,G,OR,2);
  },
  bomber(c,G){
    const{P,r,OR,SK}=c,cx=r.cx,dark=ramp('#2b3040'),inner=ramp('#e9ecf3');
    drawArms(c,G,OR,{cuff:dark});
    for(let k=0;k<6;k++)P.hl(cx-k,cx+k-1,r.sy+k,k<5?inner[1]:inner[2]);
    P.paint(ell(cx,r.sy-.2,r.nk+2.4,2.2),dark,{flat:true});
    P.vl(cx-1,r.sy+6,G.hem-1,OR[3]);P.vl(cx,r.sy+6,G.hem-1,OR[0]);P.set(cx-1,r.sy+7,0xb8bdca);P.set(cx,r.sy+8,0xe9ecf3);
    for(let k=0;k<3;k++)P.hl(cx-G.hw(G.hem)+.5,cx+G.hw(G.hem)-.5,G.hem-k,dark[k===0?3:k===1?2:1]);
    P.line(cx-G.hw(r.sy+14)+1,r.sy+14,cx-G.hw(r.sy+14)+4,r.sy+21,OR[3]);P.line(cx+G.hw(r.sy+14)-2,r.sy+14,cx+G.hw(r.sy+14)-5,r.sy+21,OR[3]);
    const a=armGeo(c,G,-1);P.rectf(a.jx-1,r.sy+4,a.jx+2,r.sy+8,white);P.set(a.jx+.5,r.sy+6,OR[1]);
    P.hl(cx-G.hw(r.sy+9)+3,cx-G.hw(r.sy+9)+6,r.sy+9,OR[0]);
  },
  armor(c,G){
    const{P,r,OR,SK}=c,cx=r.cx,st=ramp('#aab4c6'),gold=0xe3b64a,steel=ramp('#4a4f64');
    P.paint(G.shape,st,{});
    drawArms(c,G,OR,{});
    for(const s of[-1,1]){const a=armGeo(c,G,s);
      P.paint(cap(a.ex,a.ey+1.5,a.wx,a.wy,r.ar+G.fat+.2,r.ar+G.fat-.4),st,{});            // наручи
      P.paint(ell(cx+s*(G.shG-2.2),r.sy+2.4,6,4.4),ramp('#c2cbdd'),{});                    // наплечники
      P.hl(cx+s*(G.shG-2.2)-3,cx+s*(G.shG-2.2)+2,r.sy,0xffffff);
    }
    P.vl(cx-1,r.sy+3,r.sy+17,st[0]);P.vl(cx,r.sy+3,r.sy+17,st[2]);
    P.hl(cx-G.hw(r.sy+4)+1,cx+G.hw(r.sy+4)-1,r.sy+4,0xe6ecf8);P.hl(cx-G.hw(r.sy+5)+1,cx+G.hw(r.sy+5)-1,r.sy+5,gold);
    P.paint(poly([[cx-5,r.sy+8],[cx+5,r.sy+8],[cx+5,r.sy+14],[cx,r.sy+19],[cx-5,r.sy+14]]),OR,{});
    P.hl(cx-1,cx,r.sy+11,0xfff2c0);P.set(cx-1,r.sy+12,0xfff2c0);
    P.paint(ell(cx,r.sy+.4,r.nk+3.6,2.6),st,{});
    P.hl(cx-G.hw(r.sy+17),cx+G.hw(r.sy+17)-1,r.sy+18,0x4a3524);P.hl(cx-G.hw(r.sy+17),cx+G.hw(r.sy+17)-1,r.sy+19,0x6a4a30);P.rectf(cx-2,r.sy+18,cx+1,r.sy+19,gold);
    P.hl(cx-G.hw(G.hem)+.5,cx+G.hw(G.hem)-.5,G.hem-1,st[2]);P.hl(cx-G.hw(G.hem)+.5,cx+G.hw(G.hem)-.5,G.hem,st[3]);
    P.set(cx-G.hw(r.sy+6)+2,r.sy+6,gold);P.set(cx+G.hw(r.sy+6)-3,r.sy+6,gold);
  },
  tank(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    drawArms(c,G,OR,{});
    for(const s of[-1,1]){P.paint(cap(cx+s*(G.shG-2.2),r.sy+2,cx+s*(G.shG-1.6),r.sy+12,3.4,3.2),SK,{edge:false});}
    for(const s of[-1,1]){const x=cx+s*(r.nk+2);P.paint(rect(Math.min(x,x+s*3.6),r.sy-1,Math.max(x,x+s*3.6),r.sy+3.6),OR,{flat:true});}
    P.paint(ell(cx,r.sy+.4,r.nk+.4,2.2),SK,{flat:true,edge:false});P.paint(ell(cx,r.sy+2.8,r.nk+1.8,2.6),SK,{flat:true,edge:false});
    P.hl(cx-r.nk,cx+r.nk-1,r.sy+5,OR[3]);
    P.vl(Math.round(cx-G.hw(r.sy+14)+.8),r.sy+11,G.hem-1,white);P.vl(Math.round(cx+G.hw(r.sy+14)-1.8),r.sy+11,G.hem-1,whiteD);
    P.hl(cx-4,cx+3,r.sy+12,OR[2]);P.hl(cx-3,cx+2,r.sy+13,OR[2]);
    trimHem(c,G,OR,2);
  },
  suit(c,G){
    const{P,r,OR,SK}=c,cx=r.cx,shirt=ramp('#f3f4f8'),tie=ramp('#b4232c');
    drawArms(c,G,OR,{});
    P.paint(poly([[cx-4,r.sy],[cx+4,r.sy],[cx+1.8,r.sy+12],[cx-1.8,r.sy+12]]),shirt,{flat:true});
    P.paint(poly([[cx-1.2,r.sy+1],[cx+1.2,r.sy+1],[cx+1.6,r.sy+11],[cx-1.6,r.sy+11]]),tie,{flat:true});
    P.set(cx-1,r.sy+2,tie[0]);
    P.paint(poly([[cx-r.nk-1.2,r.sy-1],[cx-4,r.sy],[cx-1.8,r.sy+12],[cx-6,r.sy+8],[cx-r.nk-3.4,r.sy+3]]),OR,{dark:-1});
    P.paint(poly([[cx+r.nk+1.2,r.sy-1],[cx+4,r.sy],[cx+1.8,r.sy+12],[cx+6,r.sy+8],[cx+r.nk+3.4,r.sy+3]]),OR,{dark:-1});
    P.vl(cx,r.sy+13,G.hem-1,OR[3]);P.set(cx-1,r.sy+15,OR[3]);P.set(cx+1,r.sy+19,OR[3]);
    P.hl(cx-G.hw(r.sy+10)+2,cx-G.hw(r.sy+10)+5,r.sy+10,white);
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.hl(a.wx-r.ar,a.wx+r.ar,a.wy-.5,shirt[1]);}
    trimHem(c,G,OR,1);
  },
  leather(c,G){
    const{P,r,OR,SK}=c,cx=r.cx,inner=ramp('#e9ecf3');
    drawArms(c,G,OR,{});
    P.paint(poly([[cx-3.6,r.sy],[cx+3.6,r.sy],[cx+2.6,r.sy+12],[cx-4.4,r.sy+12]]),inner,{flat:true});
    P.line(cx-1,r.sy+2,cx+4,G.hem-1,0xc9ccd6);P.line(cx,r.sy+2,cx+5,G.hem-1,OR[3]);
    P.paint(poly([[cx-r.nk-1.2,r.sy-1],[cx-1.4,r.sy+1],[cx-6,r.sy+9],[cx-r.nk-3.8,r.sy+3]]),OR,{dark:-1});
    P.paint(poly([[cx+r.nk+1.2,r.sy-1],[cx+1.4,r.sy+1],[cx+6.6,r.sy+10],[cx+r.nk+3.8,r.sy+3]]),OR,{dark:-1});
    P.hl(cx-G.shG+1.5,cx-G.shG+4,r.sy+3,OR[0]);P.hl(cx+G.shG-4.5,cx+G.shG-2,r.sy+3,OR[0]);
    P.vl(Math.round(cx-G.hw(r.sy+10)+2.4),r.sy+8,r.sy+11,OR[0]);
    P.set(cx-G.shG+3,r.sy+1,0xcfd3df);P.set(cx+G.shG-4,r.sy+1,0xcfd3df);
    P.line(cx-G.hw(r.sy+16)+1,r.sy+17,cx-G.hw(r.sy+16)+5,r.sy+17,OR[3]);P.line(cx+G.hw(r.sy+16)-1,r.sy+17,cx+G.hw(r.sy+16)-5,r.sy+17,OR[3]);
    trimHem(c,G,OR,2);
  },
  track(c,G){
    const{P,r,OR,SK}=c,cx=r.cx;
    drawArms(c,G,OR,{cuff:OR});
    P.paint(ell(cx,r.sy-.2,r.nk+2.6,2.8),OR,{dark:1});P.paint(ell(cx,r.sy+.8,r.nk,1.6),SK,{flat:true,edge:false});
    P.vl(cx-1,r.sy+3,G.hem-1,OR[3]);P.vl(cx-2,r.sy+3,G.hem-1,OR[0]);P.set(cx-2,r.sy+4,0xcfd3df);P.set(cx-2,r.sy+5,0xcfd3df);
    P.vl(Math.round(cx-G.hw(r.sy+14)+1.6),r.sy+9,G.hem-2,white);P.vl(Math.round(cx+G.hw(r.sy+14)-2.6),r.sy+9,G.hem-2,white);
    for(const s of[-1,1]){const a=armGeo(c,G,s);P.vl(Math.round(a.ex+s*(r.ar+G.fat-.4)),a.jy+5,a.wy-2,white);}
    trimHem(c,G,OR,3);
  },
  vest(c,G){
    const{P,r,OR,SK}=c,cx=r.cx,vest=ramp('#3d4350');
    drawArms(c,G,OR,{});
    P.paint(ell(cx,r.sy+.4,r.nk+1.6,2),OR,{dark:1});P.paint(ell(cx,r.sy+1.2,r.nk+.4,1.4),SK,{flat:true,edge:false});
    for(const s of[-1,1]){
      const xs=cx+s*(r.nk+3.4),xo=cx+s*(G.shG-2.4),xw=cx+s*(G.hw(r.sy+16)-1);
      P.paint(poly([[xs,r.sy],[xo,r.sy+3],[xw,r.sy+19],[cx+s*3,r.sy+19]]),vest,{dark:-1});
      for(const py of[r.sy+7,r.sy+13]){const x0=Math.min(cx+s*4.4,cx+s*(G.hw(py)-3));P.rectf(x0,py,x0+4.6,py+4.4,vest[2]);P.hl(x0,x0+4.6,py,vest[3]);P.hl(x0,x0+4.6,py+4.4,vest[3]);P.set(x0+2,py+2,vest[0]);}
      P.hl(cx+s*(r.nk+1.6),cx+s*(G.shG-3),r.sy+1,vest[3]);
    }
    P.set(cx-3,r.sy+1,0xb8bdca);P.set(cx+3,r.sy+1,0xb8bdca);
    trimHem(c,G,OR,1);
  },
};
function drawRobe(c,G){
  const{P,r,OR,SK}=c,cx=r.cx;
  const pts=[[r.sy-1,r.nk+.8],[r.sy+.5,r.sh],[r.sy+3.5,r.sh+.6],[r.sy+9,r.ch+1.2],[r.sy+16,r.wa+1.4],[r.tb,r.hp+3],[r.lb+3,r.hp+8.6]];
  const hw=y=>lerpPts(pts,y);
  P.paint(sym(pts,cx,1.5),OR,{});
  G.hw=hw;G.hem=r.lb+3;
  const gold=0xd9a52a;
  drawArms(c,G,OR,{cuff:ramp('#d9a52a')});
  for(let y=r.tb+3;y<=r.lb+1;y++){P.set(cx-3-(y-r.tb)*.25,y,OR[2]);P.set(cx+4+(y-r.tb)*.3,y,OR[2]);P.set(cx,y,OR[3]);}
  P.hl(cx-hw(r.lb+3)+.5,cx+hw(r.lb+3)-.5,r.lb+3,gold);P.hl(cx-hw(r.lb+2)+.5,cx+hw(r.lb+2)-.5,r.lb+2,mixp(gold,0,.25));
  P.hl(cx-hw(r.sy+17)-1,cx+hw(r.sy+17)+1,r.sy+17,gold);P.hl(cx-hw(r.sy+17)-1,cx+hw(r.sy+17)+1,r.sy+18,mixp(gold,0,.3));P.vl(cx,r.sy+18,r.sy+23,gold);P.vl(cx+1,r.sy+18,r.sy+22,mixp(gold,0,.3));
  for(let k=0;k<5;k++)P.hl(cx-k+.5,cx+k-1.5,r.sy+k,k>3?SK[2]:SK[1]);
  P.paint(ell(cx,r.sy-.2,r.nk+2.6,2.4),OR,{dark:1});P.paint(ell(cx,r.sy+.9,r.nk+.2,1.8),SK,{flat:true,edge:false});
}
