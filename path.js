// Guided path after the quiz: test -> trial workout -> gym mode -> food -> club.
// Include on every page of the path: <script src="path.js" data-root="" data-step="trial"></script>
// data-root is the relative path to the site root ("" or "../"); data-step marks this page as visited.
(function(){
  var me=document.currentScript,ROOT=me.getAttribute('data-root')||'',STEP=me.getAttribute('data-step')||'';
  // Telegram bot for "save the plan" and "send the workout later"; replace with the real bot when it exists
  var BOT='https://t.me/keebfit_bot';
  var STEPS=[['trial','Тренировка','trial.html'],['zal','Зал','demo/zal.html'],['food','Питание','demo/pitanie.html'],['club','Клуб','index.html#club']];
  function get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  var plan=get('kf-plan'),seen=get('kf-seen')||{};
  if(STEP&&STEP!=='site'&&STEP!=='quiz'){seen[STEP]=1;set('kf-seen',seen)}
  // the bot learns her quiz answers from the start parameter (Telegram allows 64 chars of [A-Za-z0-9_-]):
  // tag_goal_place_kids_obstacles, e.g. plan_m_g_y_fs; the bot uses it to pick the follow-up messages
  function code(){
    var q=get('kf-quiz');if(!q||!get('kf-plan'))return '';
    var G={lose_s:'s',lose_m:'m',lose_l:'l',tone:'t',start:'n'},P={home:'h',gym:'g',both:'b'},O={food:'f',system:'s',motiv:'m',tired:'t',alone:'a',how:'h'};
    return '_'+(G[q.goal]||'x')+'_'+(P[q.place]||'x')+'_'+(q.kids==='yes'?'y':'n')+'_'+((q.obst||[]).map(function(o){return O[o]||''}).join('')||'x');
  }
  // she came from the bot: its quiz link carries ?u=<telegram id>.<signature>; keep it so the result goes to her chat by itself
  var API='https://keebfit-bot-production.up.railway.app/quiz';
  var um=/[?&]u=(\d{3,15}\.[0-9a-f]{12})(?:&|$)/.exec(location.search);if(um)set('kf-tg',um[1]);
  var TG=get('kf-tg');
  function sendPlan(){
    var c=code();if(!TG||!c)return;
    var tag='plan'+c;if(get('kf-tg-sent')===tag)return;
    try{fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({u:TG,code:tag})}).then(function(r){if(r.ok)set('kf-tg-sent',tag)}).catch(function(){})}catch(e){}
  }
  window.KF={plan:plan,bot:function(tag){return BOT+(tag?'?start='+tag+code():'')},root:ROOT,tg:!!TG,sendPlan:sendPlan};
  if(STEP==='quiz'||STEP==='site')return;  // the site and the quiz keep one action per screen, no step bar
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var css='.kfp,.kfp *{box-sizing:border-box}.kfp{position:sticky;top:0;z-index:60;background:#1B1416;color:#F7EFE4;font:600 13px/1.25 Manrope,-apple-system,Arial,sans-serif;padding:8px max(12px,env(safe-area-inset-left,0px)) 9px}'
   +'.kfp a{color:inherit;text-decoration:none}.kfp .kfpl{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px;font-size:12px;opacity:.85}'
   +'.kfp .kfpl b{color:#FF8FA8;font-weight:800}.kfp .kfst{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}'
   +'.kfp .kfst a{background:none;box-shadow:none;min-height:0;display:flex;align-items:center;justify-content:center;gap:4px;border:2px solid #4a3a3d;border-radius:10px;padding:6px 2px;font-weight:800;font-size:12px;white-space:nowrap;overflow:hidden}'
   +'.kfp .kfst a.ok{border-color:#3DD07A;color:#3DD07A}.kfp .kfst a.on{background:#E2385F;border-color:#E2385F;color:#FFFDF9}'
   +'.kfp .kfst i{font:800 11px/1 Manrope,-apple-system,Arial,sans-serif;font-style:normal;opacity:.8;position:static;width:auto;height:auto;background:none;border:0;color:inherit}'
   +'.kfn{position:fixed;left:max(14px,env(safe-area-inset-left,0px));right:max(14px,env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:61;display:block;text-align:center;background:#E2385F;color:#FFFDF9;font:400 16px/1 "Dela Gothic One","Arial Black",sans-serif;text-transform:uppercase;border:3px solid #1B1416;border-radius:16px;padding:15px 12px;text-decoration:none;box-shadow:5px 5px 0 #1B1416;max-width:520px;margin:0 auto}'
   +'.kfpad{height:84px}.kfn.off,.kft.off{display:none}'
   +'.kft{display:block;box-sizing:border-box;max-width:560px;margin:28px auto 0;width:calc(100% - 32px);background:#FFFDF9;color:#1B1416;border:3px solid #1B1416;border-radius:20px;box-shadow:5px 5px 0 #E2385F;overflow:hidden;text-decoration:none;font:500 15px/1.45 Manrope,-apple-system,Arial,sans-serif}'
   +'.kft img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;object-position:50% 30%;border-bottom:3px solid #1B1416}'
   +'.kft div{padding:16px 18px 18px}.kft b{display:block;font:400 20px/1.15 "Dela Gothic One","Arial Black",sans-serif;text-transform:uppercase;margin-bottom:8px}'
   +'.kft span{display:inline-block;margin-top:12px;font-weight:800;color:#E2385F}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var cur=-1;STEPS.forEach(function(s,k){if(s[0]===STEP)cur=k});
  // on the site, arriving at the club block (or anything after it) counts as the "Club" step
  if(STEP==='site'&&/^#(club|why|price)$/.test(location.hash)){cur=3;seen.club=1;set('kf-seen',seen)}
  // "next" is always the following step in order, so a returning visitor keeps the same chain
  var nextK=cur>=0&&cur<STEPS.length-1?cur+1:-1;
  var bar=document.createElement('div');bar.className='kfp';
  bar.innerHTML='<div class="kfpl">'+(plan?'<a href="'+ROOT+'quiz.html#result">Твой план: <b>'+esc(plan.prog)+'</b> · '+plan.kcal+' ккал</a>':'<a href="'+ROOT+'quiz.html">Подобрать программу за 2 минуты →</a>')+'<a href="'+ROOT+'index.html">Сайт</a></div>'
    +'<div class="kfst">'+STEPS.map(function(s,k){var c=k===cur?'on':(seen[s[0]]?'ok':'');return '<a class="'+c+'" href="'+ROOT+s[2]+'"><i>'+(seen[s[0]]&&k!==cur?'✓':(k+1))+'</i>'+s[1]+'</a>'}).join('')+'</div>';
  var nav=document.querySelector('header.nav');
  if(nav){bar.style.position='static';nav.appendChild(bar)}
  else{
    [].forEach.call(document.querySelectorAll('body>a'),function(a){if(/Вернуться/.test(a.textContent))a.style.display='none'});
    document.body.insertBefore(bar,document.body.firstChild);
  }
  // one "next" button at the bottom of every path page except the site itself
  if(STEP!=='site'&&nextK>=0&&!/app|embed/.test(location.hash)){
    var LABEL={trial:'Дальше: бесплатная тренировка →',zal:'Дальше: режим «Зал» →',food:'Дальше: твоё питание →',club:'Дальше: что ждёт в клубе →'};
    var n=document.createElement('a');n.className='kfn';n.href=ROOT+STEPS[nextK][2];n.textContent=LABEL[STEPS[nextK][0]];
    // a teaser card at the end of the page answers "what's next?" before the sticky button does
    var TEASE={
      zal:['Дома разобрались. А что в зале?','Телефон ведёт по каждому упражнению: вес, повторы, отдых. Ничего не нужно придумывать.','img/zal_start.jpg','Открыть режим «Зал» →'],
      food:['А теперь самое важное: питание','Твоя норма уже посчитана. Без запретов: считай КБЖУ или просто ладонями.','img/pit_norm.jpg','Посмотреть моё питание →'],
      club:['Всё это вместе — клуб','Тренировки дома и в зале, питание, чат со мной и эфиры. Тренировки остаются с тобой навсегда.','img/about_5.jpg','Что ждёт в клубе →']
    }[STEPS[nextK][0]];
    var tc=null;
    if(TEASE){
      tc=document.createElement('a');tc.className='kft';tc.href=n.href;
      tc.innerHTML='<img src="'+ROOT+TEASE[2]+'" alt="" loading="lazy"><div><b>'+esc(TEASE[0])+'</b>'+esc(TEASE[1])+'<br><span>'+esc(TEASE[3])+'</span></div>';
      (document.querySelector('.wrap')||document.body).appendChild(tc);
    }
    var pad=document.createElement('div');pad.className='kfpad';
    document.body.appendChild(pad);document.body.appendChild(n);
    // on the workout page the main action is "start now"; the way on appears once she has started
    // the gym page's main action is inside the phone, so the sticky button waits until she has tapped it
    if(STEP==='trial'){n.classList.add('off');if(tc)tc.classList.add('off')}
    if(STEP==='zal')n.classList.add('off');
    window.KF.showNext=function(){n.classList.remove('off');if(tc)tc.classList.remove('off')};
  }
  // on the site, the mobile sticky button leads to the next unvisited step instead of the price
  if(STEP==='site'&&plan){
    var sb=document.querySelector('.sticky .btn');
    var firstK=-1;for(var j=0;j<3;j++){if(!seen[STEPS[j][0]]){firstK=j;break}}
    if(sb&&firstK>=0){sb.href=ROOT+STEPS[firstK][2];sb.textContent=['Попробовать тренировку','Посмотреть режим «Зал»','Твоё питание'][firstK]}
  }
})();
