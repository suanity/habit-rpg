// ── ГОЛОВА, ЛИЦО, ВОЛОСЫ, АКСЕССУАРЫ ───────────────────────────────────────
// Типы лиц: геометрия челюсти и черты. Всё в координатах относительно центра головы.
const FACEP=[
  {tmp:11.6,chk:12,jw:9.6,cw:5.2,jy:8.6,cy:13.6,nw:2,nl:5,brow:0,bags:0,ridge:0,soft:0},    // классика
  {tmp:12.2,chk:12.6,jw:12,cw:8.2,jy:9.2,cy:13.6,nw:2,nl:5,brow:0,bags:0,ridge:0,soft:0},   // квадратное
  {tmp:10.4,chk:10.8,jw:8,cw:4,jy:10,cy:15.8,nw:1,nl:6,brow:0,bags:0,ridge:0,soft:0},       // узкое
  {tmp:11.6,chk:13.4,jw:8.8,cw:3.8,jy:9.2,cy:14,nw:2,nl:5,brow:0,bags:0,ridge:0,soft:0},    // скулы
  {tmp:12,chk:12.8,jw:11.4,cw:7.4,jy:8.2,cy:13.2,nw:2,nl:4,brow:0,bags:0,ridge:0,soft:1},   // мягкое
  {tmp:12.6,chk:12,jw:10.6,cw:6.2,jy:8.8,cy:13.6,nw:3,nl:5,brow:1,bags:0,ridge:1,soft:0},   // тяжёлый лоб
  {tmp:11.8,chk:11.8,jw:7.6,cw:2.4,jy:9.8,cy:15,nw:1,nl:5,brow:0,bags:0,ridge:0,soft:0},    // острое
  {tmp:11.6,chk:12,jw:9.6,cw:5.4,jy:8.6,cy:14.2,nw:2,nl:5,brow:1,bags:1,ridge:0,soft:0},    // усталое
];
function headGeo(av){
  const p={...FACEP[av.fc]};
  if(av.g===1){p.jw-=1.5;p.cw-=.9;p.chk-=.6;p.tmp-=.3;p.nw=Math.max(1,p.nw-1);}
  return p;
}
function headShape(c){
  const{hx,hy,hg}=c;
  const R=[[6,-13.6],[9.6,-12],[hg.tmp,-7],[hg.chk,1.2]];
  if(hg.soft)R.push([hg.chk-.2,4.6]);
  R.push([hg.jw,hg.jy],[hg.cw+1.4,hg.cy-.8],[hg.cw,hg.cy]);
  const pts=R.map(p=>[hx+p[0],hy+p[1]]).concat(R.slice().reverse().map(p=>[hx-p[0],hy+p[1]]));
  const s=poly(pts);
  return renorm(s,hx,hy+2,13.5,14.5);
}
function drawHead(c){
  const{P,av,r,SK,hx,hy,f,hg}=c;
  // шея
  P.paint(cap(CX+r.ts*.6,hy+9,CX+r.ts,r.sy+1,r.nk,r.nk+.2),SK,{k:.8});
  P.hl(hx-r.nk+1,hx+r.nk-1,hy+hg.cy+1,SK[3]);P.hl(hx-r.nk+1,hx+r.nk-1,hy+hg.cy+2,SK[2]);
  // уши
  for(const s of[-1,1]){P.paint(ell(hx+s*(hg.chk+.2),hy+1.6,2.2,3.4),SK,{});P.set(hx+s*(hg.chk+.2)-(s<0?-.6:.6),hy+1,SK[3]);}
  P.paint(c.head,SK,{k:.5});
  // тень от подбородка и скулы
  P.hl(hx-hg.cw+1,hx+hg.cw-1,hy+hg.cy-.6,SK[2]);
  if(hg.jw>=11)for(const s of[-1,1]){P.line(hx+s*(hg.jw-.6),hy+hg.jy-3,hx+s*(hg.jw-.6),hy+hg.jy,SK[2]);}
  if(hg.chk>=13.8)for(const s of[-1,1]){P.line(hx+s*(hg.chk-1.8),hy+1,hx+s*(hg.chk-3),hy+4,SK[2]);}
  drawFace(c);
}
function lipCol(c){return mixp(c.SK[1],c.f?0xd23a64:0xa8505a,.58);}
function drawFace(c){
  const{P,av,r,SK,hx,hy,f,hg,pose}=c;
  const ey=Math.round(hy+1.6)+(hg.ridge?1:0),ex=5.8;
  const ec=ramp(EYEC[av.ec]),W=0xf2efea,lid=INK;
  // нос
  const ny=ey+6;
  P.vl(hx+1,ey+1,ny-1,SK[2]);P.vl(hx,ey+2,ny-1,SK[0]);P.set(hx-1,ny-2,SK[0]);
  for(let i=-hg.nw;i<=hg.nw;i++)P.set(hx+i,ny,SK[2]);
  P.set(hx-hg.nw,ny,SK[3]);P.set(hx+hg.nw,ny,SK[3]);P.set(hx-hg.nw+1,ny+1,SK[2]);P.set(hx+hg.nw-1,ny+1,SK[2]);
  P.set(hx,ny-1,SK[1]);
  // надбровье
  if(hg.ridge)for(const s of[-1,1])P.hl(hx+s*2.6,hx+s*9.4,ey-3,SK[2]);
  // брови
  const BR=ramp(HAIRC[av.hc]);
  const brC=BR[2],brD=BR[3];
  const byo=hg.brow?1:0;
  for(const s of[-1,1]){
    const x=(i)=>hx+s*(2.6+i);            // i: от внутреннего края наружу
    const yb=ey-4-1+byo;
    const L=av.br;
    if(L===0){for(let i=0;i<7;i++)P.set(x(i),yb+(i<2?.5:i>4?-.5:0),brD);for(let i=1;i<6;i++)P.set(x(i),yb+1,brC);}
    else if(L===1){for(let i=0;i<7;i++){P.set(x(i),yb-.4+(i>4?-.6:0),brD);P.set(x(i),yb+.6,brD);}for(let i=1;i<6;i++)P.set(x(i),yb+1.6,brC);}
    else if(L===2){for(let i=0;i<7;i++)P.set(x(i),yb+(i>4?-1:0)+(i<1?1:0),brC);}
    else{for(let i=0;i<7;i++){P.set(x(i),yb+1.2-i*.38+(i>4?0:0),brD);P.set(x(i),yb+2.2-i*.38,brC);}P.set(x(0),yb+2.5,brD);}
  }
  if(hg.bags)for(const s of[-1,1]){P.hl(hx+s*3.4,hx+s*8,ey+3,SK[2]);P.set(hx+s*8.2,ey+2,SK[2]);}
  // глаза
  for(const s of[-1,1]){
    const c0=hx+s*ex,e=av.e;
    const X=(i)=>c0+i*s;            // i от центра: отрицательные — внутрь (к носу)
    const blink=pose.blink;
    const px=(i,y,col)=>P.set(X(i),y,col);
    if(blink){for(let i=-2;i<=2;i++)px(i,ey+1,lid);if(f)px(3,ey,lid);continue;}
    if(e===0){ // обычные: узкая щель, радужка 3 px
      for(let i=-2;i<=2;i++)px(i,ey,lid);
      px(-2,ey+1,W);px(-1,ey+1,ec[2]);px(0,ey+1,0x120d18);px(1,ey+1,ec[2]);px(2,ey+1,W);
      px(-1,ey+2,ec[0]);px(0,ey+2,ec[1]);px(1,ey+2,ec[0]);px(-2,ey+2,SK[2]);px(2,ey+2,SK[2]);
    }else if(e===1){ // острые: наклон наружу, злой взгляд
      for(let i=-2;i<=2;i++)px(i,ey+(i>=2?-1:0)+(i<=-2?1:0),lid);px(3,ey-1,lid);
      px(-1,ey+1,W);px(0,ey+1,ec[2]);px(1,ey+1,0x120d18);px(2,ey+1,ec[2]);
      px(0,ey+2,SK[2]);px(1,ey+2,ec[1]);px(-1,ey+2,SK[2]);
    }else if(e===2){ // большие: выше, без бликов
      for(let i=-2;i<=2;i++)px(i,ey-1,lid);px(-3,ey,lid);px(3,ey,lid);
      for(let y=ey;y<=ey+1;y++){px(-2,y,W);px(-1,y,ec[2]);px(0,y,y===ey?0x120d18:ec[1]);px(1,y,ec[2]);px(2,y,W);}
      px(-1,ey+2,ec[0]);px(0,ey+2,ec[1]);px(1,ey+2,ec[0]);px(-2,ey+2,SK[2]);px(2,ey+2,SK[2]);
    }else if(e===3){ // сонные: тяжёлое веко
      for(let i=-2;i<=2;i++){px(i,ey,SK[3]);px(i,ey+1,lid);}
      px(-1,ey+2,ec[2]);px(0,ey+2,ec[1]);px(1,ey+2,ec[2]);px(-2,ey+2,W);px(2,ey+2,W);
    }else{ // точки
      for(const[dx,dy]of[[0,0],[1,0],[0,1],[1,1]])px(dx-.5,ey+1+dy,lid);
    }
    if(f&&e!==3&&e!==4)px(3,ey-1,lid);   // ресницы
  }
  // румянец
  if(f)for(const s of[-1,1]){P.set(hx+s*8,ey+5,mixp(SK[1],0xff7a90,.4));P.set(hx+s*9,ey+5,mixp(SK[1],0xff7a90,.3));}
  drawBeard(c);
  // рот
  const my=Math.round(hy+hg.jy+.4),lip=lipCol(c),lipD=mixp(lip,0x1a0810,.45),teeth=0xf4f1ee,m=av.m;
  const wH=hg.cw>=6.5?4:3;
  if(m===0){P.hl(hx-wH,hx+wH,my,lipD);P.hl(hx-wH+1,hx+wH-1,my+1,lip);}
  else if(m===1){P.hl(hx-wH,hx+wH,my,lipD);P.hl(hx-wH+1,hx+wH-1,my+1,lip);P.set(hx-wH-1,my-1,lipD);P.set(hx+wH+1,my-1,lipD);}
  else if(m===2){P.hl(hx-wH,hx+wH,my,lipD);P.hl(hx-wH+1,hx+wH-1,my+1,lip);P.set(hx+wH+1,my-1,lipD);P.set(hx+wH+2,my-2,lipD);P.set(hx+wH+2,my-1,SK[2]);}
  else{P.hl(hx-wH-1,hx+wH+1,my,0x5a1c2a);P.hl(hx-wH,hx+wH,my+1,teeth);P.hl(hx-wH+1,hx+wH-1,my+2,0x5a1c2a);P.set(hx-wH-2,my-1,lipD);P.set(hx+wH+2,my-1,lipD);}
  if(f&&m!==3)P.hl(hx-1,hx+1,my+2,mixp(lip,0xff9ab0,.3));
  P.hl(hx-2,hx+2,my+(m===3?4:3),SK[2]);
}
function drawBeard(c){
  const{P,av,SK,hx,hy,hg}=c,fh=av.fh;
  if(!fh)return;
  const R=ramp(HAIRC[av.hc]),head=c.head;
  const low=(x,y)=>{const n=head.f(x,y);return n&&y>=hy+hg.jy-3.6+Math.abs(x-hx)*.2?n:null;};
  const mouthY=hy+hg.jy;
  if(fh===1){
    for(let y=fl(head.b[1]);y<=ce(head.b[3]);y++)for(let x=fl(head.b[0]);x<=ce(head.b[2]);x++){
      if(!low(x+.5,y+.5)||((x+y)&1))continue;
      if(Math.abs(x+.5-hx)<4&&y>=mouthY-1&&y<=mouthY+1)continue;
      P.set(x,y,mixp(SK[1],R[3],.55));
    }
    return;
  }
  const must=ell(hx,mouthY-2.6,5.6,1.8);
  if(fh>=2)P.paint(must,R,{edge:false,flat:true,dark:1});
  if(fh===3)P.paint(ell(hx,mouthY+3.6,3,2.6),R,{flat:true,dark:1});
  if(fh>=4){
    const bs=shp(head.b,(x,y)=>{
      const n=low(x,y);if(!n)return null;
      if(y>=mouthY-1.5&&y<=mouthY+1.6&&Math.abs(x-hx)<=4.6)return null;
      return n;});
    P.paint(bs,R,{flat:true,dark:1,edge:false,tex:(x,y)=>((x*3+y)%5===0?1:0)});
    if(fh===5)P.paint(ell(hx,hy+hg.cy-1.2,hg.jw-1,3.4),R,{flat:true,dark:1,edge:false,tex:(x,y)=>((x+y*2)%4===0?1:0)});
    P.set(hx-5,mouthY-.4,R[1]);P.set(hx+5,mouthY-.4,R[1]);
  }
}

// ── ВОЛОСЫ ────────────────────────────────────────────────────────────────
function capHair(c,o={}){
  const{hx,hy}=c;
  const{rx=14.4,ry=13.8,cy=-1.4,hl=-5,hk=3.4,hp=1.4,side=11.8,sideY=3,tilt=0}=o;
  const big=ell(hx,hy+cy,rx,ry);
  return shp(big.b,(x,y)=>{
    const nn=big.f(x,y);if(!nn)return null;
    const dx=x-hx,yh=hy+hl+hk*Math.pow(Math.abs(dx)/13,hp)+tilt*dx;
    const face=(y>=yh&&Math.abs(dx)<=side)||y>=hy+sideY;
    return face?null:nn;});
}
const strand=(x,y)=>((x*2+(y>>1))%7===0?-1:0);
const strandV=(x,y)=>((x+(y>>2))%5===0?-1:0);
const strandHi=(x,y)=>((x*3+y)%9===0?1:0);
function bumps(c,list,rad,o={}){const{P,HR}=c;for(const[bx,by,k]of list)P.paint(ell(bx,by,rad*(k||1),rad*(k||1)*.94),HR,{...o});}
function curlRing(c,n,rr0,ry0,cyOff,rad,a0=190,a1=350){
  const{hx,hy}=c,list=[];
  for(let k=0;k<n;k++){const a=(a0+k*(a1-a0)/(n-1))*Math.PI/180;list.push([hx+Math.cos(a)*rr0,hy+cyOff+Math.sin(a)*ry0]);}
  return list;
}
function drawHairBack(c){
  const{P,av,hx,hy,HR,pose}=c,h=av.h,sw=pose.dx*.3;
  if(h===3){ // длинные
    P.paint(rows2(hy-4,hy+24,y=>{const w=lerpPts([[hy-4,13.4],[hy+4,14.6],[hy+16,14],[hy+24,11]],y);return[hx-w+sw*(y>hy+14?-1:0),hx+w+sw*(y>hy+14?1:0)];}),HR,{tex:strandV,dark:1});
  }else if(h===4){ // каре
    P.paint(rows2(hy-4,hy+10,y=>{const w=lerpPts([[hy-4,13.6],[hy+4,14.6],[hy+10,13.8]],y);return[hx-w,hx+w];}),HR,{tex:strandV,dark:1});
  }else if(h===5){ // хвост
    const o=sw;
    P.paint(cap(hx+12,hy-9,hx+17+o,hy-2,3.4,4.2),HR,{tex:strand});
    P.paint(cap(hx+17+o,hy-2,hx+18+o*1.4,hy+9,4.2,4.4),HR,{tex:strand});
    P.paint(cap(hx+18+o*1.4,hy+9,hx+16+o*2,hy+19,4.4,2),HR,{tex:strand});
    P.rectf(hx+11.5,hy-10.5,hx+13.5,hy-8,0xe5484d);
  }else if(h===7){ // афро
    P.paint(ell(hx,hy-5,18.6,16.4),HR,{tex:(x,y)=>((x*5+y*3)%7===0?1:((x+y*2)%9===0?-1:0))});
  }else if(h===14){ // хвостики
    for(const s of[-1,1]){
      P.paint(cap(hx+s*13,hy-5,hx+s*17+s*sw,hy+3,3.4,4),HR,{tex:strand});
      P.paint(cap(hx+s*17+s*sw,hy+3,hx+s*17.6+s*sw*1.4,hy+14,4,2),HR,{tex:strand});
    }
  }else if(h===17){ // длинные кудри
    P.paint(rows2(hy-6,hy+20,y=>{const w=lerpPts([[hy-6,12.6],[hy+2,15],[hy+12,15.4],[hy+20,13]],y);return[hx-w,hx+w];}),HR,{flat:true});
    for(let k=0;k<6;k++){const y=hy+2+k*3.8;for(const s of[-1,1])P.paint(ell(hx+s*(15.2-(k>3?k*.2:0))+s*sw*.3,y,5,4.8),HR,{});}
  }else if(h===19){ // маллет
    P.paint(rows2(hy-2,hy+19,y=>{const w=lerpPts([[hy-2,13],[hy+8,12.6],[hy+14,11],[hy+19,7.8]],y);return[hx-w+(y>hy+12?-sw:0),hx+w+(y>hy+12?sw:0)];}),HR,{tex:strandV,dark:1});
  }
}
function rows2(y0,y1,fn){
  const L=[],R=[];
  for(let y=y0;y<=y1;y+=1){const[a,b]=fn(y);L.push([a,y]);R.push([b,y]);}
  return poly(L.concat(R.reverse()));
}
function drawHairFront(c){
  const{P,av,hx,hy,HR,pose}=c,h=av.h,sw=pose.dx*.3;
  if(h===15){P.set(hx-4,hy-12,HR[0]);P.set(hx-3,hy-12,HR[0]);P.set(hx-5,hy-11,HR[0]);return;}
  const cap0=(o,t={})=>P.paint(capHair(c,o),HR,{tex:strand,...t});
  if(h===0){cap0({hl:-5.6,hk:3.4,hp:1.4,side:11.6,sideY:2.4});}
  else if(h===1){
    cap0({hl:-6,hk:3.4,side:11.6,sideY:2.4});
    const sp=[[-10,-11,-13,-17,-6,-13],[-5,-12.6,-7,-19.4,-1.6,-14],[0,-13,0,-21,3,-14],[5,-12.6,8,-19,5.4,-14],[10,-11,13.4,-16.6,7.4,-13]];
    for(const[x0,y0,x1,y1,x2,y2]of sp)P.paint(poly([[hx+x0-2.4,hy+y0+1.4],[hx+x1,hy+y1],[hx+x2+1.4,hy+y2+1.4]]),HR,{tex:strand});
  }else if(h===2){
    P.paint(capHair(c,{hl:-6,hk:4.4,hp:1.2,side:11.8,sideY:2}),HR,{flat:true,dark:2});
    P.paint(poly([[hx-3.6,hy-9],[hx+3.6,hy-9],[hx+3.6,hy-17],[hx+2.4,hy-20],[hx+1,hy-23],[hx,hy-20],[hx-1,hy-23],[hx-2.4,hy-20],[hx-3.6,hy-17]]),HR,{tex:strandV});
    P.vl(hx-1,hy-19,hy-10,HR[2]);
  }else if(h===3){
    cap0({hl:-6.6,hk:5.8,hp:1.1,side:12,sideY:12});
    P.paint(cap(hx-14.2,hy-3,hx-14.4,hy+17,3.4,2.8),HR,{tex:strandV});P.paint(cap(hx+14.2,hy-3,hx+14.4,hy+17,3.4,2.8),HR,{tex:strandV});
    P.vl(hx,hy-14,hy-9,HR[3]);
  }else if(h===4){
    cap0({hl:-1.4,hk:1.6,hp:2,side:12,sideY:9});
    P.hl(hx-9,hx+9,hy-1.6,HR[2]);
  }else if(h===5){cap0({hl:-5.8,hk:3.6,side:11.8,sideY:2.4,tilt:.12});}
  else if(h===6){
    P.paint(ell(hx,hy-16,5.6,4.8),HR,{tex:strand});P.hl(hx-4.4,hx+4.4,hy-13.4,0xe5484d);
    cap0({hl:-6.6,hk:4.6,hp:1.2,side:11.8,sideY:2.4});
  }else if(h===7){cap0({rx:17.2,ry:15.2,cy:-4.2,hl:-6.2,hk:3.4,hp:1.4,side:11.8,sideY:2.4},{tex:(x,y)=>((x*5+y*3)%7===0?1:0)});}
  else if(h===8){
    P.paint(capHair(c,{rx:13.8,ry:12.8,cy:-1.2,hl:-8,hk:3.4,hp:1.3,side:12,sideY:1.6}),HR,{flat:true,dark:1});
    for(let y=hy-13;y<=hy-4;y++)for(let x=hx-14;x<=hx+14;x++)if(P.get(x,y)>=0){if((x*3+y*5)%7===0)P.set(x,y,HR[3]);else if((x*5+y*3)%6===0)P.set(x,y,HR[0]);}
  }else if(h===9){
    cap0({hl:-8,hk:6.4,hp:1.1,side:12,sideY:2.4},{tex:strandV});
    P.line(hx-3,hy-12,hx-7,hy-7,HR[3]);P.line(hx,hy-13,hx,hy-8,HR[3]);P.line(hx+3,hy-12,hx+7,hy-7,HR[3]);
  }else if(h===10){
    cap0({hl:-6,hk:3.8,hp:1.3,side:11.6,sideY:2.4},{tex:null});
    bumps(c,curlRing(c,9,14.2,13.4,-1.6,5.2),5.2);
    bumps(c,curlRing(c,5,8.6,8.2,-4,4.6,205,335),4.6);
    bumps(c,[[hx-6.6,hy-6.4],[hx-2.2,hy-6.8],[hx+2.4,hy-6.8],[hx+6.8,hy-6.4]],4);
  }else if(h===11){
    cap0({hl:-6.6,hk:5.8,hp:1.1,side:12,sideY:11});
    for(const s of[-1,1])for(let i=0;i<7;i++)P.paint(ell(hx+s*(14+(i%2?.6:-.4)),hy+2+i*3.5,3.2,2.8),HR,{flat:true,dark:i%2?1:0});
    P.vl(hx,hy-14,hy-9,HR[3]);
  }else if(h===12){
    P.paint(capHair(c,{hl:-6,hk:4.4,hp:1.2,side:11.8,sideY:2}),HR,{flat:true,dark:2});
    for(let y=hy-14;y<=hy-2;y++)for(let x=hx-14;x<=hx+14;x++)if(P.get(x,y)>=0&&(x*3+y*5)%5===0&&(Math.abs(x-hx)>7||y>hy-7))P.set(x,y,HR[2]);
    P.paint(poly([[hx-10,hy-7],[hx-8,hy-15],[hx,hy-19],[hx+8,hy-16],[hx+11,hy-7],[hx+7,hy-8.4],[hx+1,hy-9.4],[hx-6,hy-8.4]]),HR,{tex:strand});
  }else if(h===13){
    cap0({hl:-8.4,hk:4,hp:1.2,side:11.8,sideY:2.4,tilt:.55});
    P.paint(poly([[hx+1,hy-9.4],[hx+12,hy-8],[hx+12.6,hy-1],[hx+8,hy-5],[hx+3,hy-7.4]]),HR,{tex:strand});
    P.line(hx-6,hy-12,hx+2,hy-9,HR[3]);
  }else if(h===14){
    cap0({hl:-6,hk:4.2,side:11.8,sideY:2.4});
    for(const s of[-1,1])P.rectf(hx+s*13-1.4,hy-5,hx+s*13+1.4,hy-3.6,0xec4899);
  }else if(h===16){
    P.paint(capHair(c,{hl:-6.4,hk:4.8,hp:1.2,side:11.8,sideY:2.2}),HR,{flat:true,dark:2});
    for(let y=hy-14;y<=hy-2;y++)for(let x=hx-14;x<=hx+14;x++)if(P.get(x,y)>=0&&(x*3+y*5)%5===0&&Math.abs(x-hx)>7)P.set(x,y,HR[2]);
    const bl=[[hx-8.4,hy-12],[hx-3.6,hy-14.6],[hx+1.6,hy-15.4],[hx+6.4,hy-14],[hx+10.4,hy-10.6],[hx-5.6,hy-9],[hx+0,hy-9.6],[hx+5.6,hy-9.2],[hx-2.2,hy-12.4],[hx+3.6,hy-12.6],[hx-11,hy-7.6],[hx+11.4,hy-7.8]];
    bumps(c,bl,5.4);
    for(const[bx,by]of bl.slice(0,6))P.set(bx-1.4,by-1.6,HR[0]);
  }else if(h===17){
    cap0({hl:-6.4,hk:4.8,hp:1.2,side:11.8,sideY:9},{tex:null});
    bumps(c,[[hx-9,hy-10],[hx-4.4,hy-13.6],[hx+1,hy-14.4],[hx+6,hy-13],[hx+10.4,hy-9.6],[hx-12.4,hy-3.6],[hx+12.6,hy-3.6],[hx-6.6,hy-8.8],[hx+7.6,hy-8.6],[hx,hy-9.6],[hx-13,hy+2],[hx+13,hy+2]],5.2);
    for(const s of[-1,1])for(const yy of[hy+7,hy+12,hy+16.6])P.paint(ell(hx+s*14.6+s*sw*.3,yy,4.8,4.6),HR,{});
  }else if(h===18){
    cap0({hl:-10,hk:11,hp:1.1,side:12,sideY:7},{tex:strandV});
    P.line(hx,hy-14,hx-1,hy-10,HR[3]);P.line(hx-1,hy-10,hx-5,hy-6,HR[3]);P.line(hx+1,hy-10,hx+5,hy-6,HR[3]);P.line(hx-3,hy-11,hx-8,hy-8,HR[2]);P.line(hx+3,hy-11,hx+8,hy-8,HR[2]);
    P.set(hx,hy-12,HR[0]);
  }else if(h===19){
    cap0({hl:-4.6,hk:2.6,hp:1.3,side:11.8,sideY:2.8,tilt:-.1});
    for(let x=hx-9;x<=hx+9;x+=3)P.set(x,hy-4.4,HR[3]);P.line(hx-8,hy-11,hx-13,hy-5,HR[3]);P.line(hx+7,hy-11,hx+12,hy-5,HR[3]);
  }
}

// ── АКСЕССУАРЫ ────────────────────────────────────────────────────────────
function drawAccessory(c){
  const{P,av,hx,hy,SK,OR,hg,f}=c,a=av.a;
  if(!a)return;
  const ey=Math.round(hy+1.6)+(hg.ridge?1:0),ex=5.8;
  if(a===1){ // прямоугольные очки
    const fr=0x18121f;
    for(const s of[-1,1]){const x0=hx+s*ex;
      for(let i=-4;i<=4;i++){P.set(x0+i,ey-1,fr);P.set(x0+i,ey+4,fr);}
      for(let y=ey-1;y<=ey+4;y++){P.set(x0-4,y,fr);P.set(x0+4,y,fr);}
      P.set(x0-s*2.5,ey,mixp(0xffffff,0x9fd4ff,.5));P.set(x0-s*3,ey+1,mixp(0xffffff,0x9fd4ff,.3));
    }
    P.hl(hx-1,hx+1,ey+1,fr);P.hl(hx-hg.tmp-1,hx-ex-4,ey+1,fr);P.hl(hx+ex+4,hx+hg.tmp+1,ey+1,fr);
  }else if(a===2){ // тёмные
    const fr=0x0b0a10;
    for(const s of[-1,1]){const x0=hx+s*ex;
      for(let y=ey-1;y<=ey+3;y++)for(let i=-4;i<=4;i++)P.set(x0+i,y,y===ey+3?0x1a1824:fr);
      P.set(x0-s*2.5,ey,0x6a7080);P.set(x0-s*1.5,ey+1,0x4a5060);P.set(x0-s*3,ey+1,0x4a5060);
    }
    P.hl(hx-1,hx+1,ey,fr);P.hl(hx-hg.tmp-1,hx-ex-4,ey,fr);P.hl(hx+ex+4,hx+hg.tmp+1,ey,fr);
  }else if(a===3){ // кепка
    const R=OR;
    P.paint(shp([hx-15,hy-18,hx+15,hy-3],(x,y)=>{const n=ell(hx,hy-3.4,14.6,13).f(x,y);return n&&y<=hy-5?n:null;}),R,{});
    P.paint(rr(hx-15.4,hy-7.4,hx+15.4,hy-4.4,1),ramp(OUTC[av.oc]),{dark:1,flat:true});
    P.paint(poly([[hx-14,hy-4.6],[hx+14,hy-4.6],[hx+17,hy-1],[hx-17,hy-1]]),R,{dark:2,flat:true});
    P.hl(hx-4,hx+4,hy-16,R[2]);P.vl(hx-1,hy-17,hy-8,R[3]);P.vl(hx,hy-17,hy-8,R[3]);P.set(hx,hy-17.5,R[0]);
  }else if(a===4){ // повязка
    P.paint(shp([hx-15,hy-9,hx+15,hy-3],(x,y)=>{const n=ell(hx,hy-2,14.2,12.6).f(x,y);return n&&y>=hy-9&&y<=hy-5.4?n:null;}),OR,{flat:true});
    P.hl(hx-12,hx+12,hy-7.4,OR[0]);
    P.paint(rr(hx+13,hy-8,hx+19,hy-5.4,1),OR,{flat:true});P.paint(poly([[hx+17,hy-5],[hx+22,hy+2],[hx+18.6,hy+2]]),OR,{});
  }else if(a===5){ // наушники
    const bc=ramp('#2b3040');
    P.paint(shp([hx-15,hy-17,hx+15,hy-2],(x,y)=>{const n=ell(hx,hy-1,15.2,14.6).f(x,y),m=ell(hx,hy-1,12.4,11.8).f(x,y);return n&&!m&&y<=hy+2?n:null;}),bc,{flat:true});
    for(const s of[-1,1]){P.paint(ell(hx+s*14.6,hy+2.6,3.6,5.2),OR,{});P.set(hx+s*14.6-(s<0?-1.4:1.4),hy,OR[0]);}
  }else if(a===6){ // шапка
    P.paint(shp([hx-15,hy-19,hx+15,hy-3],(x,y)=>{const n=ell(hx,hy-3.6,14.8,13.4).f(x,y);return n&&y<=hy-4.4?n:null;}),OR,{tex:(x,y)=>(x%2===0?1:0)});
    P.paint(rr(hx-15.4,hy-8.4,hx+15.4,hy-3.6,1.4),ramp(OUTC[av.oc]),{dark:1,flat:true});
    for(let x=hx-14;x<=hx+14;x+=2)P.vl(x,hy-7.4,hy-4.4,OR[3]);
    P.paint(ell(hx,hy-18.6,3,2.6),OR,{});
  }else if(a===7){ // серьга
    const ex2=hx-hg.chk-.2;P.set(ex2,hy+5.4,0xffe08a);P.set(ex2,hy+6.4,0xe3b64a);P.set(ex2-1,hy+7.4,0xe3b64a);P.set(ex2,hy+7.4,0xffe08a);
  }else if(a===9){ // круглые очки
    const fr=0x1b1420;
    for(const s of[-1,1]){const cx2=hx+s*ex,cy2=ey+1.4,r0=4.8;
      for(let y=fl(cy2-r0-1);y<=ce(cy2+r0+1);y++)for(let x=fl(cx2-r0-1);x<=ce(cx2+r0+1);x++){
        const d=Math.hypot(x+.5-cx2,y+.5-cy2);if(d>r0-1.2&&d<=r0)P.set(x,y,fr);}
      P.set(cx2-s*2.2,cy2-2.2,mixp(0xffffff,0xa8dcff,.5));P.set(cx2-s*2.2+s*-1,cy2-1.2,mixp(0xffffff,0xa8dcff,.4));
    }
    P.hl(hx-ex+4,hx+ex-4,ey+.4,fr);P.hl(hx-hg.tmp-1,hx-ex-4.6,ey+1,fr);P.hl(hx+ex+4.6,hx+hg.tmp+1,ey+1,fr);
  }else if(a===10){ // большие очки
    const fr=ramp(OUTC[av.oc]);
    for(const s of[-1,1]){const x0=hx+s*ex;
      for(let y=ey-2;y<=ey+5;y++)for(let i=-5;i<=5;i++){
        const edge=Math.abs(i)===5||y===ey-2||y===ey+5;
        if(edge)P.set(x0+i,y,fr[3]);
        else{const col=P.get(x0+i,y);if(col>=0&&((i+y)&3)!==0)P.set(x0+i,y,mixp(col,0x1c2b55,.16));}
      }
      P.set(x0-s*3.4,ey-1,0xffffff);P.set(x0-s*2.4,ey,mixp(0xffffff,0xa8dcff,.5));P.set(x0-s*5,ey-2,fr[2]);P.set(x0+s*5,ey+5,fr[2]);
    }
    P.hl(hx-1,hx+1,ey,fr[3]);P.hl(hx-hg.tmp-1,hx-ex-5,ey,fr[3]);P.hl(hx+ex+5,hx+hg.tmp+1,ey,fr[3]);
  }else if(a===11){ // цепочка
    const r=c.r,g=0xe3b64a,gl=0xfff2c0;
    for(let k=0;k<=12;k++){const u=(k-6)/6,x=c.r.cx+u*(r.nk+5.4),y=r.sy+1.6+(1-Math.abs(u))*8.6;P.set(x,y,k%2?g:gl);P.set(x,y+1,g);}
    P.paint(ell(c.r.cx,r.sy+11.6,2.2,2.4),ramp('#e3b64a'),{flat:true});P.set(c.r.cx-.8,r.sy+10.8,0xffffff);
  }else if(a===8){ // шрам
    P.line(hx-9,hy-6,hx-6,hy+2,0xe0a8a0);P.line(hx-8,hy-6,hx-5,hy+2,mixp(SK[2],0xc04050,.4));P.set(hx-8,hy-3,SK[0]);P.set(hx-7,hy-1,SK[0]);
  }
}
