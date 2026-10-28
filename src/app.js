// ── КОНФИГ ─────────────────────────────────────────────────────────────────
const SUPA_URL='https://ivmdbkukjvxzoazcicet.supabase.co';
const SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bWRia3VranZ4em9hemNpY2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTk5OTgsImV4cCI6MjA5MjU5NTk5OH0.0--m60cy6Ppz3_TC1-aX8sBG1ibyqHWE-ozR4y0zZM8';
const SESSION_URL='https://habit-bot-nu.vercel.app/api/session';
const BOT_URL='https://t.me/stabilityhabits_bot';
const ACT_KEY='habit-rpg-code';
const LS_KEY='nonpc-v2';

const STATS=['VIGOR','MIND','WILL','AURA','GOLD'];
const STAT_META={
  VIGOR:{c:'#ff6b6b',ru:'Тело',hint:'сон, вода, движение, еда'},
  MIND:{c:'#5bd9d0',ru:'Разум',hint:'чтение, учёба, глубокая работа'},
  WILL:{c:'#a78bfa',ru:'Воля',hint:'отказ от импульсов, дисциплина'},
  AURA:{c:'#f472b6',ru:'Влияние',hint:'контент, общение, видимость'},
  GOLD:{c:'#f3c55a',ru:'Деньги',hint:'доход, учёт, работа на результат'},
};
const RANKS=['NPC','SPAWN','GRINDER','CONTENDER','CHAMPION','LEGEND','IMMORTAL'];
const RANK_AT=[0,1,7,21,45,90,180];
const RANK_C={NPC:'#8a93a8',SPAWN:'#6fe28b',GRINDER:'#5bd9d0',CONTENDER:'#5b9bff',CHAMPION:'#a78bfa',LEGEND:'#ffd24a',IMMORTAL:'#ff6b9a'};
const DAILY_CAP=150;

const PROGRAMS=[
  {days:7,name:'РАЗВЕДКА',d:'Неделя, чтобы понять, твоё ли это. Без обязательств.'},
  {days:21,name:'ПРИВЫЧКА',d:'Три недели подряд. Достаточно, чтобы начать чувствовать разницу.'},
  {days:30,name:'СЕЗОН',d:'Месяц. Полноценный сезон: ранг, серия, результат.'},
  {days:66,name:'ЛЕГЕНДА',d:'66 дней: в среднем столько нужно, чтобы действие стало привычкой.'},
];
const ENEMIES=[
  {id:'SCROLL',name:'Бесконечная лента',q:'Сколько раз сегодня палец сам открыл ленту?'},
  {id:'SMOKE',name:'Никотин',q:'Тяга придёт. Она проходит за несколько минут.'},
  {id:'BOOZE',name:'Алкоголь',q:'Сегодня без. Это и есть победа.'},
  {id:'SUGAR',name:'Сахар и фастфуд',q:'Еда по расписанию, а не по настроению.'},
  {id:'LAZY',name:'Диван и откладывание',q:'Начать на пять минут. Остальное сделает инерция.'},
  {id:'SLEEP',name:'Сбитый режим',q:'Ночь решает, каким будет завтрашний день.'},
  {id:'ALONE',name:'Одиночество',q:'Один живой разговор в день. Без экрана между вами.'},
];
const NICKS=['Рысь','Волк','Ворон','Тень','Кай','Нова','Феникс','Гром','Лис','Искра','Орион','Мираж'];
const CAST=[
  {g:0,b:2,sk:2,h:16,hc:1,e:1,ec:1,br:1,m:2,fh:0,o:12,oc:11,p:6,pc:0,s:4,a:9,it:0,cp:0},
  {g:1,b:0,sk:1,h:17,hc:3,e:2,ec:2,br:0,m:1,fh:0,o:11,oc:8,p:7,pc:1,s:5,a:11,it:0,cp:0},
  {g:0,b:1,sk:6,h:18,hc:0,e:0,ec:1,br:3,m:3,fh:0,o:10,oc:1,p:6,pc:2,s:5,a:10,it:0,cp:0},
];
const NICK_RE=/^[A-Za-zА-Яа-яЁё0-9_ .-]{3,16}$/;

// ── УТИЛИТЫ ────────────────────────────────────────────────────────────────
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const n=v=>Number(v)||0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const plural=(k,f)=>{const a=Math.abs(k)%100,b=a%10;return a>10&&a<20?f[2]:b>1&&b<5?f[1]:b===1?f[0]:f[2];};
const dayNum=iso=>Math.floor(Date.UTC(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10))/86400000);
const dayIso=num=>new Date(num*86400000).toISOString().slice(0,10);
const rankColor=r=>RANK_C[r]||'#8a93a8';
const rankIdx=r=>Math.max(0,RANKS.indexOf(r));
const levelOf=xp=>Math.floor(Math.sqrt(Math.max(0,xp)/30))+1;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function hap(kind){try{const H=TGW&&TGW.HapticFeedback;if(!H)return;if(kind==='ok')H.notificationOccurred('success');else if(kind==='err')H.notificationOccurred('error');else H.impactOccurred('light');}catch{}}
const DEFAULT_AV={g:0,b:1,sk:2,h:0,hc:2,e:0,ec:0,br:0,m:1,fh:0,o:10,oc:5,p:6,pc:0,s:4,a:0,it:0,cp:0,fc:0,x:0};
const edTag=b=>{const x=b&&b.avatar&&b.avatar.x,S=SKINS[x];return S&&b.xn?` <span class="ed" style="color:${RARITY_COL[S.r]}">${S.n} #${n(b.xn)}</span>`:'';};
const safeAv=a=>validAvatar(a)?normAv(a):{...DEFAULT_AV};
const avAttr=a=>{a=safeAv(a);return AV_KEYS.map(k=>a[k]).join(',');};
const parseAv=s=>{const p=String(s).split(',').map(Number),o={};AV_KEYS.forEach((k,i)=>o[k]=p[i]);return safeAv(o);};
const heroTag=(a,crop,cls)=>`<canvas class="${cls||''}" data-av="${avAttr(a)}"${crop?` data-crop="${crop}"`:''}></canvas>`;
function paintHeroes(root){(root||document).querySelectorAll('canvas[data-av]').forEach(cv=>drawHero(cv,parseAv(cv.dataset.av),cv.dataset.crop||undefined));}

let toastTimer=null;
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
function modal(html,onclose){const m=$('modal');m.innerHTML=`<div class="panel modal-box">${html}</div>`;m.classList.add('show');m.onclick=e=>{if(e.target===m||e.target.closest('[data-x]')){m.classList.remove('show');if(onclose)onclose();}};}
function popXP(txt,el){const r=el.getBoundingClientRect();const p=document.createElement('div');p.className='pop';p.textContent=txt;p.style.left=(r.left+r.width/2-30)+'px';p.style.top=(r.top-6)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),950);}

// ── БАЗА ───────────────────────────────────────────────────────────────────
async function rpc(fn,args){
  const r=await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'},body:JSON.stringify(args)});
  if(!r.ok)throw new Error('http '+r.status);
  return r.json();
}

// ── СОСТОЯНИЕ ──────────────────────────────────────────────────────────────
const DEF=()=>({v:2,program:null,enemy:null,enemyLog:{},taken:{},perfect:''});
let S=DEF();
let userCode=null;
try{userCode=localStorage.getItem(ACT_KEY);}catch{}
const W={data:null,loading:false,at:0,error:false,busy:false};
const ui={tab:'quests',step:null,hl:null,edit:false,reprogram:false,reenemy:false,crTab:'face'};
const C={av:null,nick:''};

function loadLocal(){try{const r=localStorage.getItem(LS_KEY);if(r){const o=JSON.parse(r);if(o&&o.v===2)S={...DEF(),...o};}}catch{}}
function saveLocal(){try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch{}}
let syncTimer=null;
function setSync(st){const d=$('syncDot');if(d)d.className='sync-dot '+st;}
function save(){
  saveLocal();
  if(!userCode)return;
  setSync('syncing');clearTimeout(syncTimer);
  syncTimer=setTimeout(async()=>{let ok=false;try{const r=await rpc('save_data',{p_code:userCode,p_data:S});ok=!!(r&&r.ok);}catch{}setSync(ok?'ok':'err');},1500);
}
function applyCloud(cloud){S=(cloud&&cloud.v===2)?{...DEF(),...cloud}:DEF();saveLocal();}

// ── МИР ────────────────────────────────────────────────────────────────────
async function worldLoad(force){
  if(!userCode)return false;
  if(W.loading){for(let i=0;i<80&&W.loading;i++)await sleep(100);return !!W.data;}
  if(!force&&W.data&&Date.now()-W.at<90000)return true;
  W.loading=true;
  try{
    const r=await rpc('get_world',{p_code:userCode});
    if(r&&r.ok){
      W.data=r;W.error=false;W.at=Date.now();
      const ids=new Set((r.quests||[]).map(q=>String(q.id)));
      let ch=false;Object.keys(S.taken).forEach(k=>{if(!ids.has(k)){delete S.taken[k];ch=true;}});
      if(ch)saveLocal();
    }else W.error=true;
  }catch{W.error=true;}
  W.loading=false;
  return !W.error;
}

// ── ЭКРАНЫ-ЗАГЛУШКИ ────────────────────────────────────────────────────────
function setApp(html,nopad){const a=$('app');a.className='app'+(nopad?' nopad':'');a.innerHTML=html;paintHeroes(a);}
function msgScreen(inner){setApp(`<div class="screen"><div class="logo sm">NO NPC</div><div style="height:18px"></div>${inner}</div>`,true);}

function showActivation(){
  msgScreen(`<div class="lead" style="margin-top:0">Введи код доступа,<br>или открой игру через Telegram-бота.</div>
    <input class="inp act-input" id="actInput" placeholder="HRPG-XXXX-XXXX-XXXX" maxlength="19" autocomplete="off" autocorrect="off" spellcheck="false">
    <div class="err" id="actErr"></div>
    <button class="btn" id="actBtn">ВОЙТИ</button>
    <a class="link" href="${BOT_URL}">Открыть бота</a>`);
  const inp=$('actInput'),btn=$('actBtn'),err=$('actErr');
  inp.oninput=()=>{const raw=inp.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase();let f=raw.slice(0,4);if(raw.length>4)f+='-'+raw.slice(4,8);if(raw.length>8)f+='-'+raw.slice(8,12);if(raw.length>12)f+='-'+raw.slice(12,16);inp.value=f;err.textContent='';};
  inp.onkeydown=e=>{if(e.key==='Enter')btn.click();};
  btn.onclick=async()=>{
    const code=inp.value.trim().toUpperCase();btn.disabled=true;err.textContent='';
    let res=null;try{res=await rpc('activate_code',{p_code:code});}catch{err.textContent='Нет связи. Попробуй ещё раз.';btn.disabled=false;return;}
    if(!res||!res.ok){err.textContent='Код не подходит.';btn.disabled=false;return;}
    try{localStorage.setItem(ACT_KEY,code);}catch{}
    userCode=code;applyCloud(res.data);start();
  };
}

function errorScreen(){
  msgScreen(`<div class="lead" style="margin-top:0">Нет связи с сервером.</div><button class="btn" id="retry">ПОВТОРИТЬ</button>`);
  $('retry').onclick=()=>start();
}

// ── ВХОД: СПЛЭШ ────────────────────────────────────────────────────────────
function renderSplash(){
  const d=W.data,total=n(d.players_total),online=n(d.online_today);
  const stat=total>0?`В лобби: <b>${total}</b> ${plural(total,['игрок','игрока','игроков'])} · сегодня в деле: <b>${online}</b>`:'Лобби только открылось. Ты можешь быть среди первых.';
  setApp(`<div class="screen">
    <div class="tag">МУЛЬТИПЛЕЕР · ЛОББИ ОТКРЫТО</div>
    <div class="logo">NO<br>NPC</div>
    <div class="cast">${CAST.map(a=>heroTag(a,'','')).join('')}</div>
    <div class="lead"><b>С этого дня ты не фон.</b><br>Каждый день пять квестов на тело, разум, волю, влияние и деньги. Закрыл — получил XP и поднялся в рейтинге. Пропустил — остался NPC.<br><br>${stat}</div>
    <button class="btn" id="enter">ВОЙТИ В ЛОББИ</button>
    <div class="foot-note">Главный конкурент — ты вчерашний.</div>
  </div>`,true);
  $('enter').onclick=()=>{hap();ui.step='creator';ui.edit=false;C.av=randomAvatar(0);C.nick='';route();};
}

// ── СОЗДАНИЕ ГЕРОЯ ─────────────────────────────────────────────────────────
const CR_TABS=[
  {id:'face',name:'ЛИЦО',secs:[['sw','sk','КОЖА',SKIN],['tl','fc','ТИП ЛИЦА',FACE_NAMES,'head'],['tl','e','ГЛАЗА',EYE_NAMES,'face'],['sw','ec','ЦВЕТ ГЛАЗ',EYEC],['tl','br','БРОВИ',BROW_NAMES,'face'],['tl','m','РОТ',MOUTH_NAMES,'face'],['tl','fh','БОРОДА',BEARD_NAMES,'face']]},
  {id:'hair',name:'ВОЛОСЫ',secs:[['tl','h','ПРИЧЁСКА',HAIR_NAMES,'head'],['sw','hc','ЦВЕТ ВОЛОС',HAIRC]]},
  {id:'body',name:'ТЕЛО',secs:[['tl','b','ТЕЛОСЛОЖЕНИЕ',BODY_NAMES,'full']]},
  {id:'wear',name:'ОДЕЖДА',secs:[['tl','o','ВЕРХ',OUTFIT_NAMES,'top'],['sw','oc','ЦВЕТ ВЕРХА',OUTC],['tl','p','НИЗ',PANT_NAMES,'legs'],['sw','pc','ЦВЕТ НИЗА',PANTC],['tl','s','ОБУВЬ',SHOE_NAMES,'legs'],['tl','cp','ПЛАЩ',CAPE_NAMES,'full']]},
  {id:'extra',name:'ДЕТАЛИ',secs:[['tl','a','АКСЕССУАР',ACC_NAMES,'head'],['tl','it','ПРЕДМЕТ',ITEM_NAMES,'full']]},
  {id:'skin',name:'СКИНЫ',secs:[['sk','x','ЭКСКЛЮЗИВНЫЕ СКИНЫ']]},
];
const ownedSkins=()=>{const inv=(W.data&&W.data.me&&W.data.me.inv)||[];const m={};inv.forEach(i=>m[i.id]=i);return m;};
function creatorCanBack(){return !W.data.joined||validAvatar(W.data.me&&W.data.me.avatar);}
function renderCreator(){
  if(!C.av)C.av=randomAvatar(0);
  const sw=(k,arr,label)=>`<div class="cr-sec"><div class="cr-h">${label}</div><div class="cr-row">${arr.map((c,i)=>`<button class="sw" data-k="${k}" data-v="${i}" style="background:${c}" aria-label="${label} ${i+1}"></button>`).join('')}</div></div>`;
  const tl=(k,names,label,crop)=>`<div class="cr-sec"><div class="cr-h">${label}</div><div class="cr-row">${names.map((nm,i)=>`<button class="tile" data-k="${k}" data-v="${i}"><canvas data-tile="1" data-k="${k}" data-v="${i}" data-crop="${crop}"></canvas>${esc(nm)}</button>`).join('')}</div></div>`;
  const skinSec=()=>{const own=ownedSkins();const ids=Object.keys(SKINS).map(Number);
    return`<div class="cr-sec"><div class="cr-h">ЭКСКЛЮЗИВНЫЕ СКИНЫ</div><div class="skin-note">Нумерованные издания. Выдаёт автор в роликах и стримах: купить или обменять нельзя.</div><div class="cr-row"><button class="tile" data-k="x" data-v="0"><canvas data-tile="1" data-k="x" data-v="0" data-crop="full"></canvas>Без скина</button>${ids.map(id=>{const S=SKINS[id],o=own[id];return`<button class="tile${o?'':' lock'}" data-k="x" data-v="${id}" data-own="${o?1:0}"><canvas data-tile="1" data-k="x" data-v="${id}" data-crop="full"></canvas><span class="sk-n" style="color:${RARITY_COL[S.r]}">${S.n}</span><span class="sk-e">${o?`#${o.no} из ${S.max}`:`${RARITY_NAMES[S.r]} · ${S.max} шт.`}</span></button>`;}).join('')}</div></div>`;};
  const panes=CR_TABS.map(t=>`<div class="cr-pane" data-pane="${t.id}"${ui.crTab===t.id?'':' hidden'}>${t.secs.map(s=>s[0]==='sk'?skinSec():s[0]==='sw'?sw(s[1],s[3],s[2]):tl(s[1],s[3],s[2],s[4])).join('')}</div>`).join('');
  const nickBlock=ui.edit?'':`<div class="cr-sec"><div class="cr-h">ПОЗЫВНОЙ</div><input class="inp" id="nick" maxlength="16" placeholder="Как тебя называть" autocomplete="off" value="${esc(C.nick)}"><div class="row2" style="margin-top:8px"><button class="btn ghost sm" id="nickRnd">СЛУЧАЙНЫЙ</button><div class="faint" style="font-size:11px;align-self:center">3–16 символов: буквы, цифры, пробел, _ . -</div></div><div class="err" id="crErr"></div></div>`;
  setApp(`<div style="padding-top:6px">
    <div class="topbar"><div class="brand">${ui.edit?'ИЗМЕНИТЬ ГЕРОЯ':'ВЫБЕРИ ГЕРОЯ'}</div>${creatorCanBack()?'<button class="ico" id="crBack" aria-label="Назад">←</button>':''}</div>
    <div class="cr-sticky"><div class="cr-gender">${GENDER_NAMES.map((nm,i)=>`<button class="cr-g${C.av.g===i?' on':''}" data-g="${i}">${nm.toUpperCase()}</button>`).join('')}</div><div class="cr-stage"><canvas id="crMain"></canvas><button class="dice-btn" id="dice">СЛУЧАЙНО</button></div>
      <div class="cr-tabs">${CR_TABS.map(t=>`<button class="cr-tab${ui.crTab===t.id?' on':''}" data-crtab="${t.id}">${t.name}</button>`).join('')}</div></div>
    ${panes}
    ${nickBlock}
    <button class="btn" id="crGo">${ui.edit?'СОХРАНИТЬ':'ВОЙТИ В ИГРУ'}</button>
    <div style="height:30px"></div>
  </div>`,true);
  refreshCreator();
  const app=$('app');
  app.onclick=e=>{
    const tb=e.target.closest('[data-crtab]');
    if(tb){ui.crTab=tb.dataset.crtab;document.querySelectorAll('.cr-pane').forEach(p=>p.hidden=p.dataset.pane!==ui.crTab);document.querySelectorAll('.cr-tab').forEach(b=>b.classList.toggle('on',b.dataset.crtab===ui.crTab));hap();refreshCreator();return;}
    const gb=e.target.closest('[data-g]');
    if(gb){C.av.g=Number(gb.dataset.g);if(C.av.g===1)C.av.fh=0;document.querySelectorAll('.cr-g').forEach(b=>b.classList.toggle('on',Number(b.dataset.g)===C.av.g));hap();refreshCreator();return;}
    const t=e.target.closest('.tile,.sw');
    if(t){if(t.dataset.k==='x'&&Number(t.dataset.v)>0&&t.dataset.own!=='1'){hap('err');toast('Этот скин выдаёт автор. Лови дропы в роликах.');return;}C.av[t.dataset.k]=Number(t.dataset.v);hap();refreshCreator();return;}
  };
  $('dice').onclick=()=>{const x=C.av.x||0;C.av=randomAvatar(C.av.g===1?1:0);C.av.x=x;hap();refreshCreator();};
  const back=$('crBack');if(back)back.onclick=()=>{ui.step=null;ui.edit=false;route();};
  const ni=$('nick');
  if(ni){ni.oninput=()=>{C.nick=ni.value;$('crErr').textContent='';};ni.onkeydown=e=>{if(e.key==='Enter')$('crGo').click();};}
  const nr=$('nickRnd');if(nr)nr.onclick=()=>{const v=NICKS[Math.floor(Math.random()*NICKS.length)]+(Math.floor(Math.random()*90)+10);C.nick=v;ni.value=v;hap();};
  $('crGo').onclick=creatorSubmit;
}

function refreshCreator(){
  const main=$('crMain');if(main)drawHero(main,C.av);
  document.querySelectorAll(`.cr-pane[data-pane="${ui.crTab}"] canvas[data-tile]`).forEach(cv=>{const k=cv.dataset.k;drawHero(cv,{...C.av,[k]:Number(cv.dataset.v),...((k==='p'||k==='s')?{o:11,cp:0}:{})},cv.dataset.crop||undefined,true);});
  document.querySelectorAll('.tile[data-k],.sw[data-k]').forEach(el=>el.classList.toggle('sel',C.av[el.dataset.k]===Number(el.dataset.v)));
}

async function creatorSubmit(){
  const btn=$('crGo'),err=$('crErr');
  if(!validAvatar(C.av))return;
  if(C.av.x&&!ownedSkins()[C.av.x])C.av.x=0;
  if(ui.edit){
    btn.disabled=true;let res=null;
    try{res=await rpc('set_avatar',{p_code:userCode,p_avatar:C.av});}catch{}
    if(!res||!res.ok){toast(res&&res.error==='skin_not_owned'?'Этот скин тебе не выдан':'Не удалось сохранить');btn.disabled=false;return;}
    await worldLoad(true);ui.edit=false;ui.step=null;ui.tab='hero';toast('Герой обновлён');route();return;
  }
  const nick=C.nick.trim();
  if(!NICK_RE.test(nick)){err.textContent='Позывной: 3–16 символов, буквы, цифры, пробел, _ . -';$('nick').focus();return;}
  btn.disabled=true;err.textContent='';
  let res=null;try{res=await rpc('join_world',{p_code:userCode,p_nick:nick,p_avatar:C.av});}catch{}
  if(!res){err.textContent='Нет связи. Попробуй ещё раз.';btn.disabled=false;return;}
  if(!res.ok){err.textContent=res.error==='nick_taken'?'Этот позывной занят.':res.error==='bad_nick'?'Недопустимый позывной.':res.error==='skin_not_owned'?'Этот скин тебе не выдан.':'Не получилось войти.';btn.disabled=false;return;}
  hap('ok');
  await worldLoad(true);ui.step=null;route();
}

// ── ВЫБОР СРОКА ────────────────────────────────────────────────────────────
function renderProgram(){
  setApp(`<div style="padding-top:6px">
    <div class="topbar"><div class="brand">ВЫБЕРИ <b>СЕЗОН</b></div>${ui.reprogram?'<button class="ico" id="pgBack" aria-label="Назад">←</button>':''}</div>
    <div class="lead" style="margin:6px 0 18px;max-width:none;text-align:left">Сезон — срок, на который ты записываешься. Рейтинг и квесты идут каждый день, сезон задаёт твою личную цель и счётчик.</div>
    ${PROGRAMS.map(p=>`<button class="card-pick" data-days="${p.days}"><div class="t"><span>${p.name}</span><em>${p.days} ДНЕЙ</em></div><div class="d">${esc(p.d)}</div></button>`).join('')}
    <div class="panel"><div class="cr-h">СВОЙ СРОК</div><div class="row2"><input class="inp" id="pgDays" type="number" inputmode="numeric" min="3" max="365" placeholder="3–365 дней"><button class="btn sm" id="pgOk">НАЧАТЬ</button></div><div class="err" id="pgErr"></div></div>
  </div>`,true);
  document.querySelectorAll('[data-days]').forEach(b=>b.onclick=()=>chooseProgram(Number(b.dataset.days)));
  $('pgOk').onclick=()=>{const v=Number($('pgDays').value);if(!Number.isInteger(v)||v<3||v>365){$('pgErr').textContent='От 3 до 365 дней.';return;}chooseProgram(v);};
  const bk=$('pgBack');if(bk)bk.onclick=()=>{ui.reprogram=false;route();};
}
function chooseProgram(days){
  hap('ok');S.program={days,start:W.data.today};ui.reprogram=false;save();route();
}

// ── ВРАГ ───────────────────────────────────────────────────────────────────
function renderEnemy(){
  setApp(`<div style="padding-top:6px">
    <div class="topbar"><div class="brand">ВЫБЕРИ <b>ВРАГА</b></div>${ui.reenemy?'<button class="ico" id="enBack" aria-label="Назад">←</button>':''}</div>
    <div class="lead" style="margin:6px 0 18px;max-width:none;text-align:left">У каждого есть одна вещь, которая тянет назад. Назови её. Каждый день будешь отмечать: победил или сорвался. Серия побед считается отдельно.</div>
    ${ENEMIES.map(e=>`<button class="card-pick" data-en="${e.id}"><div class="t"><span>${esc(e.name)}</span></div><div class="d">${esc(e.q)}</div></button>`).join('')}
    <div class="panel"><div class="cr-h">СВОЙ ВРАГ</div><div class="row2"><input class="inp" id="enName" maxlength="24" placeholder="Название"><button class="btn sm" id="enOk">ВЫБРАТЬ</button></div><div class="err" id="enErr"></div></div>
    <button class="btn ghost" id="enSkip">ПОКА БЕЗ ВРАГА</button>
    <div class="note-sm">Приложение — не лечение. Если зависимость серьёзная, это повод обратиться к специалисту. Здесь ты укрепляешь привычку, а не заменяешь помощь.</div>
  </div>`,true);
  document.querySelectorAll('[data-en]').forEach(b=>b.onclick=()=>{const e=ENEMIES.find(x=>x.id===b.dataset.en);setEnemy({id:e.id,name:e.name});});
  $('enOk').onclick=()=>{const v=$('enName').value.trim();if(v.length<3||v.length>24||/[<>]/.test(v)){$('enErr').textContent='От 3 до 24 символов.';return;}setEnemy({id:'CUSTOM',name:v});};
  $('enSkip').onclick=()=>setEnemy(false);
  const bk=$('enBack');if(bk)bk.onclick=()=>{ui.reenemy=false;route();};
}
function setEnemy(e){hap('ok');S.enemy=e;if(e)S.enemyLog={};ui.reenemy=false;save();route();}
function enemyQuote(){const e=ENEMIES.find(x=>S.enemy&&x.id===S.enemy.id);return e?e.q:'Один день за раз.';}
function enemyStreak(today){
  let d=dayNum(today);if(S.enemyLog[dayIso(d)]===undefined)d--;
  let k=0;while(S.enemyLog[dayIso(d)]===1){k++;d--;}return k;
}
function enemyAnswer(win){
  const today=W.data.today;if(S.enemyLog[today]!==undefined)return;
  S.enemyLog[today]=win?1:0;save();hap(win?'ok':'err');
  if(win){const k=enemyStreak(today);toast(k>1?`Победа. Серия: ${k}`:'Победа. Первый раунд за тобой');}
  else toast('Срыв — не конец. Завтра новый раунд.');
  renderHome();
}

// ── ГЛАВНЫЙ ЭКРАН ──────────────────────────────────────────────────────────
function totalXP(me){return Object.values(me.stats||{}).reduce((s,v)=>s+n(v),0);}

function questCard(q,joined){
  const M=STAT_META[q.stat]||STAT_META.WILL,boss=q.kind==='weekly',id=n(q.id);
  let act='';
  if(q.done)act='<div class="q-ok">ВЫПОЛНЕНО</div>';
  else if(joined&&S.taken[id])act=`<button class="btn green sm" data-claim="${id}">СДЕЛАНО</button>`;
  else if(joined)act=`<button class="btn ghost sm" data-take="${id}">ВЗЯТЬ</button>`;
  const left=n(q.days_left)+1;
  return`<div class="q${q.done?' done':''}${boss?' boss':''}${ui.hl===String(id)?' hl':''}" data-qid="${id}" style="--c:${M.c}">
    <div class="q-top"><span class="q-stat">${iconSVG(q.stat,M.c,16)}${esc(q.stat)}</span><span class="q-xp">+${n(q.xp)} XP</span></div>
    ${boss?`<div class="q-boss">БОСС НЕДЕЛИ · ещё ${left} ${plural(left,['день','дня','дней'])}</div>`:''}
    <div class="q-title">${esc(q.title)}</div>${q.descr?`<div class="q-descr">${esc(q.descr)}</div>`:''}
    <div class="q-act">${act}</div></div>`;
}

function programPanel(){
  if(!S.program)return'';
  const today=dayNum(W.data.today),start=dayNum(S.program.start),total=S.program.days;
  const cur=today-start+1;
  if(cur>total)return`<div class="panel"><div class="day-sum"><div><div class="cr-h" style="margin:0 0 8px">СЕЗОН ПРОЙДЕН</div><div class="big">${total}/${total}</div></div></div><div class="bar" style="--c:#6fe28b;--c2:#c9f7d5"><i style="width:100%"></i></div><div class="sub muted" style="font-size:12px;margin:10px 0 12px;line-height:1.5">Ты закрыл сезон из ${total} ${plural(total,['дня','дней','дней'])}. Бери новый.</div><button class="btn green sm" id="newSeason">НОВЫЙ СЕЗОН</button></div>`;
  return`<div class="panel"><div class="day-sum"><div><div class="cr-h" style="margin:0 0 8px">СЕЗОН · ДЕНЬ</div><div class="big">${cur}<span class="muted" style="font-size:10px"> / ${total}</span></div></div><div class="muted" style="font-size:12px">осталось ${total-cur}</div></div><div class="bar"><i style="width:${Math.round(cur/total*100)}%"></i></div></div>`;
}

function enemyPanel(){
  if(!S.enemy)return'';
  const today=W.data.today,ans=S.enemyLog[today],k=enemyStreak(today);
  let body;
  if(ans===undefined)body=`<div class="e-q">${esc(enemyQuote())}</div><div class="row2"><button class="btn green sm" data-win="1">ДЕРЖАЛСЯ</button><button class="btn ghost sm" data-win="0">СОРВАЛСЯ</button></div>`;
  else body=`<div class="q-ok" style="color:${ans?'var(--green)':'var(--muted)'}">${ans?'РАУНД ВЫИГРАН':'РАУНД ПРОПУЩЕН'}</div><div class="e-q" style="margin:10px 0 0">${ans?'Заходи завтра: серия растёт.':'Срыв не сбрасывает прогресс в лобби. Завтра новый раунд.'}</div>`;
  return`<div class="q enemy" style="--c:#ff6b6b"><div class="e-t">ВРАГ: ${esc(S.enemy.name).toUpperCase()}</div><div class="faint" style="font-size:11px;margin:-4px 0 10px">Серия побед: ${k}</div>${body}</div>`;
}

function renderHome(){
  const y=window.scrollY;
  const d=W.data,me=d.me,xp=totalXP(me),lvl=levelOf(xp);
  const quests=d.quests||[],dailies=quests.filter(q=>q.kind!=='weekly'),boss=quests.filter(q=>q.kind==='weekly');
  const doneN=dailies.filter(q=>q.done).length;
  let body='';
  if(ui.tab==='quests'){
    const pct=Math.min(100,Math.round(n(me.today_xp)/DAILY_CAP*100));
    body=`
    <div class="panel"><div class="day-sum"><div><div class="cr-h" style="margin:0 0 8px">СЕГОДНЯ</div><div class="big">${n(me.today_xp)}<span class="muted" style="font-size:10px"> / ${DAILY_CAP} XP</span></div></div><div class="sub" style="text-align:right">${doneN}/${dailies.length} квестов<br><span class="faint">${doneN===dailies.length&&dailies.length?'идеальный день':'осталось '+(dailies.length-doneN)}</span></div></div><div class="bar"><i style="width:${pct}%"></i></div></div>
    ${programPanel()}
    <div class="h-sec">КВЕСТЫ ДНЯ<span>в лобби закрыли: ${n(d.online_today)}</span></div>
    ${dailies.length?dailies.map(q=>questCard(q,true)).join(''):'<div class="empty">Квестов на сегодня нет. Загляни позже.</div>'}
    ${boss.length?`<div class="h-sec">БОСС НЕДЕЛИ</div>${boss.map(q=>questCard(q,true)).join('')}`:''}
    ${S.enemy?`<div class="h-sec">ЛИЧНЫЙ ВРАГ</div>${enemyPanel()}`:''}
    <div class="note-sm">XP за квесты назначает сервер. В сутки не больше ${DAILY_CAP} XP.</div>`;
  }else if(ui.tab==='hero'){
    body=heroTab(me,xp,lvl);
  }else{
    body=lobbyTab(d);
  }
  setApp(`
    <div class="topbar"><div class="brand">NO <b>NPC</b><span class="sync-dot" id="syncDot"></span></div><div class="chip" style="font-size:9px;padding:9px">LV ${lvl}</div></div>
    ${ui.tab==='quests'?`<div class="panel"><div class="me-strip">${heroTag(me.avatar,'bust')}<div style="min-width:0"><div class="me-name">${esc(me.nick)}</div><div class="chips"><span class="chip rank" style="--rc:${rankColor(me.rank)}">${esc(me.rank)}</span><span class="chip fire">СЕРИЯ ${n(me.streak)}</span><span class="chip">${n(me.days)} ${plural(n(me.days),['ДЕНЬ','ДНЯ','ДНЕЙ'])}</span></div></div></div></div>`:''}
    ${body}
    <div class="tabbar"><div class="tabbar-in">
      ${[['quests','КВЕСТЫ','VIGOR'],['hero','ГЕРОЙ','WILL'],['lobby','ЛОББИ','AURA']].map(([k,l,s])=>`<button class="tab${ui.tab===k?' on':''}" data-tab="${k}">${iconSVG(s,ui.tab===k?'#ffd24a':'#9aa3b8',18)}${l}</button>`).join('')}
    </div></div>`);
  setSync('ok');
  bindHome();
  if(ui.hl){const el=document.querySelector(`.q[data-qid="${ui.hl}"]`);if(el)el.scrollIntoView({block:'center'});ui.hl=null;}
  else window.scrollTo(0,y);
}

function heroTab(me,xp,lvl){
  const ri=rankIdx(me.rank),nxt=me.next_rank_at;
  const mx=Math.max(60,...STATS.map(k=>n((me.stats||{})[k])));
  return`
  <div class="panel hs"><div class="hs-l"><div class="plat">${heroTag(me.avatar,'')}</div></div>
    <div class="hs-r"><div class="nm">${esc(me.nick)}</div>
      <div class="chips"><span class="chip rank" style="--rc:${rankColor(me.rank)}">${esc(me.rank)}</span><span class="chip">LV ${lvl}</span></div>
      <div class="hs-xp">${xp} XP</div>
      ${STATS.map(k=>{const M=STAT_META[k],v=n((me.stats||{})[k]);return`<div class="hs-st" style="--c:${M.c}"><div class="hs-h"><span>${iconSVG(k,M.c,14)}${k}<i>${M.ru}</i></span><b>${v}</b></div><div class="bar" style="--c:${M.c};--c2:${M.c}"><i style="width:${Math.round(v/mx*100)}%"></i></div></div>`;}).join('')}
    </div></div>
  <div class="panel"><div class="rl">${RANKS.map((r,i)=>`<div class="rl-i${i<=ri?' on':''}${i===ri?' cur':''}" style="--rc:${RANK_C[r]}"><b>${r}</b><span>${i?RANK_AT[i]+' '+plural(RANK_AT[i],['день','дня','дней']):'старт'}</span></div>`).join('')}</div>
    <div class="bar-meta"><span>${nxt?`до ранга ${RANKS[ri+1]}: ${Math.max(0,nxt-n(me.days))} ${plural(Math.max(0,nxt-n(me.days)),['день','дня','дней'])}`:'максимальный ранг'}</span><span>${n(me.days)} дн. в игре</span></div>
    <div class="faint" style="font-size:11px;line-height:1.5;margin-top:10px">Каждый квест качает одну характеристику. Тянешь все пять — растёшь ровно.</div></div>
  <div class="kv">
    <div class="c"><div class="l">Серия</div><div class="n">${n(me.streak)}</div><div class="s">дней подряд</div></div>
    <div class="c"><div class="l">Щит</div><div class="n" style="color:${me.shield_ready?'var(--teal)':'var(--faint)'}">${me.shield_ready?'ГОТОВ':'ИСПОЛЬЗОВАН'}</div><div class="s">${me.shield_ready?'один пропуск не сломает серию':'вернётся, когда серия окрепнет'}</div></div>
  </div>
  <div class="h-sec">НАСТРОЙКИ</div>
  <button class="btn ghost sm" id="editHero" style="margin-bottom:10px">ИЗМЕНИТЬ ГЕРОЯ</button>
  <button class="btn ghost sm" id="editEnemy" style="margin-bottom:10px">${S.enemy?'СМЕНИТЬ ВРАГА':'ВЫБРАТЬ ВРАГА'}</button>
  <button class="btn ghost sm" id="editSeason"${''}>${S.program?'НОВЫЙ СЕЗОН':'ВЫБРАТЬ СЕЗОН'}</button>
  ${IN_TG&&TGW.addToHomeScreen?'<button class="btn ghost sm" id="homeScr" style="margin-top:10px">ИКОНКА НА ГЛАВНЫЙ ЭКРАН</button>':''}
  <div class="note-sm">Приложение — инструмент привычек, а не лечение. При серьёзной зависимости обратись к специалисту.</div>`;
}

function lobbyTab(d){
  const board=d.board||[],roster=d.roster||[],total=n(d.players_total),online=n(d.online_today);
  const myPos=board.findIndex(b=>b.me)+1;
  return`
  <div class="panel"><div class="kv"><div class="c"><div class="l">В лобби</div><div class="n">${total}</div><div class="s">${plural(total,['игрок','игрока','игроков'])}</div></div><div class="c"><div class="l">Сегодня в деле</div><div class="n" style="color:var(--green)">${online}</div><div class="s">закрыли квест</div></div></div></div>
  <div class="h-sec">ТОП НЕДЕЛИ<span>по дням активности</span></div>
  ${board.length?board.map((b,i)=>`<div class="bd-row${b.me?' me':''}"><span class="bd-pos">${i+1}</span>${heroTag(b.avatar,'bust')}<div style="min-width:0"><div class="bd-nick">${esc(b.nick)}</div><div class="bd-rank" style="--rc:${rankColor(b.rank)}">${esc(b.rank)}${edTag(b)}</div></div><span></span><span class="bd-days">${n(b.days)} дн.</span></div>`).join(''):'<div class="empty">На этой неделе никто ещё не закрыл квест. Первое место свободно.</div>'}
  ${myPos?`<div class="note-sm">Ты на ${myPos} месте.</div>`:'<div class="note-sm">Закрой квест — и ты появишься в рейтинге.</div>'}
  <div class="h-sec">ИГРОКИ<span>${total} в лобби · зелёная точка: квест закрыт сегодня</span></div>
  ${roster.length?roster.map(b=>`<div class="bd-row rs${b.me?' me':''}"><span class="dot${b.active?' on':''}"></span>${heroTag(b.avatar,'bust')}<div style="min-width:0"><div class="bd-nick">${esc(b.nick)}${b.me?' · ты':''}</div><div class="bd-rank" style="--rc:${rankColor(b.rank)}">${esc(b.rank)}${edTag(b)}</div></div><span></span><span class="bd-days">${n(b.days)} дн.</span></div>`).join(''):'<div class="empty">В лобби пока никого.</div>'}
  ${total>roster.length?`<div class="note-sm">Показаны ${roster.length} из ${total}.</div>`:''}
  <div class="h-sec">ПОЗОВИ СВОИХ</div>
  <div class="panel"><div class="muted" style="font-size:13px;line-height:1.6;margin-bottom:12px">Лобби живёт, пока в нём есть люди. Один в лобби — это тренировка. Вдвоём — уже игра.</div><button class="btn sm" id="invite">ПОЗВАТЬ ДРУГА</button></div>
  <div class="note-sm">В рейтинге считаются дни, в которые закрыт хотя бы один квест. Дни, а не очки: выиграть можно только постоянством.</div>`;
}

function bindHome(){
  const app=$('app');
  app.onclick=async e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.tab){ui.tab=t.dataset.tab;hap();renderHome();window.scrollTo(0,0);return;}
    if(t.dataset.take){S.taken[t.dataset.take]=true;save();hap();renderHome();return;}
    if(t.dataset.claim){claim(t.dataset.claim,t);return;}
    if(t.dataset.win!==undefined){enemyAnswer(t.dataset.win==='1');return;}
    if(t.id==='editHero'){ui.edit=true;C.av={...safeAv(W.data.me.avatar)};ui.step='creator';route();return;}
    if(t.id==='editEnemy'){ui.reenemy=true;route();return;}
    if(t.id==='editSeason'||t.id==='newSeason'){ui.reprogram=true;route();return;}
    if(t.id==='invite'){invite();return;}
    if(t.id==='homeScr'){if(!tgHome())toast('Доступно в Telegram 8.0+');return;}
  };
}

function invite(){
  const text='Захожу в лобби NO NPC: ежедневные квесты, ранги и рейтинг недели. Заходи, посмотрим, кто кого.';
  const url='https://t.me/share/url?url='+encodeURIComponent(BOT_URL)+'&text='+encodeURIComponent(text);
  try{if(TGW&&TGW.openTelegramLink){TGW.openTelegramLink(url);return;}}catch{}
  window.open(url,'_blank','noopener');
}

async function claim(id,btn){
  if(W.busy)return;
  W.busy=true;btn.disabled=true;btn.textContent='…';
  const prevRank=W.data.me.rank;
  let res=null;try{res=await rpc('claim_quest',{p_code:userCode,p_quest_id:Number(id)});}catch{}
  W.busy=false;
  if(!res){toast('Нет связи. Попробуй ещё раз.');renderHome();return;}
  if(res.ok){popXP(`+${n(res.xp)} ${res.stat}`,btn);hap('ok');delete S.taken[id];}
  else if(res.error==='already'){toast('Уже выполнено');delete S.taken[id];}
  else if(res.error==='cap')toast('Лимит XP на сегодня исчерпан');
  else if(res.error==='closed'){toast('Квест уже закрыт');delete S.taken[id];}
  else toast('Не получилось');
  saveLocal();
  await worldLoad(true);
  if(!W.data)return;
  renderHome();
  const me=W.data.me,ds=(W.data.quests||[]).filter(q=>q.kind!=='weekly');
  if(res.ok&&me.rank!==prevRank&&rankIdx(me.rank)>rankIdx(prevRank)){
    modal(`<div class="tag">НОВЫЙ РАНГ</div><div class="px" style="font-size:20px;color:${rankColor(me.rank)};margin:14px 0">${esc(me.rank)}</div><div class="lead" style="margin:0 0 18px">Ты поднялся. Теперь на тебя смотрят другие игроки.</div><button class="btn" data-x="1">ДАЛЬШЕ</button>`);
  }else if(res.ok&&ds.length&&ds.every(q=>q.done)&&S.perfect!==W.data.today){
    S.perfect=W.data.today;save();toast('Идеальный день: все квесты закрыты');
  }
}

// ── МАРШРУТ ────────────────────────────────────────────────────────────────
function route(){
  $('app').onclick=null;
  const d=W.data;
  if(!d){errorScreen();return;}
  if(!d.joined){if(ui.step==='creator')renderCreator();else renderSplash();return;}
  if(!validAvatar(d.me&&d.me.avatar)&&ui.step!=='creator'){ui.edit=true;ui.step='creator';C.av=randomAvatar(0);}
  if(ui.step==='creator'){renderCreator();return;}
  if(!S.program||ui.reprogram){renderProgram();return;}
  if(S.enemy===null||ui.reenemy){renderEnemy();return;}
  renderHome();
}

async function start(){
  msgScreen('<div class="lead" style="margin:0">Вхожу в лобби…</div>');
  await worldLoad(true);
  if(!W.data){errorScreen();return;}
  route();
  deepLink();
}

// ── TELEGRAM ───────────────────────────────────────────────────────────────
const TGW=window.Telegram&&window.Telegram.WebApp;
const IN_TG=!!(TGW&&TGW.initData);
function tgSetup(){
  if(!TGW)return;
  try{TGW.ready();TGW.expand();}catch{}
  try{TGW.setHeaderColor('#0a0b10');TGW.setBackgroundColor('#0a0b10');}catch{}
  try{if(TGW.disableVerticalSwipes)TGW.disableVerticalSwipes();}catch{}
  // полный экран только на телефонах (Bot API 8.0+); на десктопе остаётся обычное окно
  try{
    const mob=/android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if(mob&&TGW.isVersionAtLeast&&TGW.isVersionAtLeast('8.0')&&TGW.requestFullscreen&&!TGW.isFullscreen)TGW.requestFullscreen();
  }catch{}
  const safe=()=>{try{
    const s=TGW.safeAreaInset||{},c=TGW.contentSafeAreaInset||{},r=document.documentElement.style;
    r.setProperty('--tg-top',((s.top||0)+(c.top||0))+'px');
  }catch{}};
  safe();
  try{TGW.onEvent('fullscreenChanged',safe);TGW.onEvent('safeAreaChanged',safe);TGW.onEvent('contentSafeAreaChanged',safe);}catch{}
}
function tgHome(){
  try{if(TGW&&TGW.isVersionAtLeast&&TGW.isVersionAtLeast('8.0')&&TGW.addToHomeScreen){TGW.addToHomeScreen();return true;}}catch{}
  return false;
}
async function tgSession(){
  const r=await fetch(SESSION_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:TGW.initData})});
  if(r.status>=500)throw new Error('http '+r.status);
  return r.json();
}
async function tgBoot(){
  msgScreen('<div class="lead" style="margin:0">Вхожу в лобби…</div>');
  let res=null;try{res=await tgSession();}catch{}
  if(res&&res.ok&&res.code){
    if(res.code!==userCode){
      let act=null;try{act=await rpc('activate_code',{p_code:res.code});}catch{}
      if(!act||!act.ok){errorScreen();return;}
      try{localStorage.setItem(ACT_KEY,res.code);}catch{}
      userCode=res.code;applyCloud(act.data);
    }
    start();return;
  }
  if(res&&res.error==='no_access'){
    msgScreen(`<div class="tag">ЛОББИ ЗАКРЫТО</div><div class="lead" style="margin-top:0">Вход только для игроков.<br>Отправь боту команду <b>/buy</b>. После подтверждения оплаты вход откроется сам.</div><button class="btn" id="tgClose">ЗАКРЫТЬ</button>`);
    $('tgClose').onclick=()=>{try{TGW.close();}catch{}};return;
  }
  if(!res&&userCode){start();return;}
  errorScreen();
}

// ссылка на квест: ?q=ID в адресе кнопки или start_param вида q123
function deepLink(){
  let q=null;
  try{
    const sp=(TGW&&TGW.initDataUnsafe&&TGW.initDataUnsafe.start_param)||'';
    const m=/^q(\d{1,9})$/.exec(sp);if(m)q=m[1];
    const u=new URLSearchParams(location.search).get('q');
    if(u&&/^\d{1,9}$/.test(u))q=u;
    if(u!==null)history.replaceState(null,'',location.pathname);
  }catch{}
  if(!q||!W.data||!W.data.joined||!S.program||S.enemy===null)return;
  ui.tab='quests';ui.hl=q;renderHome();
}

document.addEventListener('visibilitychange',async()=>{
  if(document.hidden||!userCode||!W.data||$('modal').classList.contains('show'))return;
  const was=W.data.today;
  await worldLoad(false);
  if(W.data&&!ui.step&&!ui.reprogram&&!ui.reenemy&&W.data.joined&&S.program&&S.enemy!==null)renderHome();
  else if(W.data&&W.data.today!==was)route();
});

// ── СТАРТ ──────────────────────────────────────────────────────────────────
tgSetup();loadLocal();startAnim();
if(IN_TG)tgBoot();
else if(!userCode)showActivation();
else start();
