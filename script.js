/* 이승연 포트폴리오 — 스크롤 애니메이션 · 네비 활성표시 */
(function(){
  /* 새로고침 시 항상 최상단에서 시작 */
  if('scrollRestoration' in history){ history.scrollRestoration='manual'; }
  window.scrollTo(0,0);
  window.addEventListener('load',function(){ window.scrollTo(0,0); });

  /* hero 사인 — 글자 하나씩 써지게 분해 */
  var sign=document.querySelector('.hero-sign');
  if(sign){
    var lines=sign.innerHTML.split(/<br\s*\/?>/i);
    sign.innerHTML='';
    var i=0, start=0.3, step=0.07; // 초 단위 — 사인이 먼저 써짐
    lines.forEach(function(line,li){
      if(li>0) sign.appendChild(document.createElement('br'));
      line.split('').forEach(function(c){
        var s=document.createElement('span');
        s.className='ch';
        if(c===' '){ s.innerHTML='&nbsp;'; }
        else { s.textContent=c; }
        s.style.animationDelay=(start+i*step).toFixed(2)+'s';
        i++;
        sign.appendChild(s);
      });
    });
  }

  /* projects 'PROJECT' 사인 — 글자 분해 + 스크롤 진입 시 모션 */
  var psign=document.querySelector('.projects-sign');
  if(psign){
    var plines=psign.innerHTML.split(/<br\s*\/?>/i);
    psign.innerHTML='';
    var pi=0;
    plines.forEach(function(line,li){
      if(li>0) psign.appendChild(document.createElement('br'));
      line.split('').forEach(function(c){
        var s=document.createElement('span');
        s.className='ch';
        if(c===' '){ s.innerHTML='&nbsp;'; }
        else { s.textContent=c; }
        s.style.animationDelay=(0.05+pi*0.07).toFixed(2)+'s';
        pi++;
        psign.appendChild(s);
      });
    });
    if('IntersectionObserver' in window){
      var po=new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ psign.classList.add('in'); po.unobserve(psign); } });
      },{threshold:.3});
      po.observe(psign);
    } else { psign.classList.add('in'); }
  }

  /* nav scrolled state + 스크롤 내리면 숨김 / 올리면 다시 표시 */
  var nav=document.getElementById('nav');
  var lastY=window.scrollY;
  function onScroll(){
    var y=window.scrollY;
    nav.classList.toggle('scrolled', y>16);
    /* 아래로 스크롤 & 충분히 내려갔을 때 숨김, 위로 스크롤하면 표시 */
    if(y>lastY && y>70){ nav.classList.add('nav-hidden'); }
    else { nav.classList.remove('nav-hidden'); }
    lastY=y;
  }
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  /* 모바일 햄버거 메뉴 토글 */
  var burger=document.getElementById('navBurger');
  if(burger){
    function setMenu(open){
      nav.classList.toggle('menu-open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
    }
    burger.addEventListener('click',function(){
      setMenu(!nav.classList.contains('menu-open'));
    });
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click',function(){ setMenu(false); });
    });
  }

  /* reveal on scroll */
  var revs=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revs.forEach(function(el,i){
      // small stagger within siblings sharing a parent
      el.style.transitionDelay=(Math.min(i%4,3)*0.06)+'s';
      io.observe(el);
    });
  } else { revs.forEach(function(el){el.classList.add('in');}); }

  /* active nav link via section observer */
  var links=Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var map={}; links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
  var secs=['about','projects','experience','education','skills','contact'].map(function(id){return document.getElementById(id);}).filter(Boolean);
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){a.classList.remove('active');});
          var a=map[e.target.id]; if(a)a.classList.add('active');
        }
      });
    },{threshold:.2,rootMargin:'-45% 0px -45% 0px'});
    secs.forEach(function(s){so.observe(s);});
  }

  /* 프로젝트 — 버튼 클릭 시 오른쪽 패널이 해당 프로젝트로 바뀜 */
  var pAside=document.querySelector('.projects-aside');
  var pIntro=document.querySelector('.projects-intro');
  var pDetail=document.querySelector('.projects-detail');
  if(pAside && pIntro && pDetail){
    function showProject(card){
      var tpl=card.querySelector('.pcard-detail');
      if(!tpl) return;
      pDetail.innerHTML='';
      var back=document.createElement('button');
      back.type='button'; back.className='pd-back';
      back.innerHTML='← 목록';
      back.addEventListener('click',hideProject);
      pDetail.appendChild(back);
      pDetail.appendChild(tpl.content.cloneNode(true));
      /* 카드 컬러칩 토큰을 패널로 전달 */
      pAside.setAttribute('style', card.getAttribute('style')||'');
      pAside.classList.add('detail-open');
      pIntro.hidden=true; pDetail.hidden=false;
      document.querySelectorAll('.pcard').forEach(function(c){ c.classList.toggle('active', c===card); });
    }
    function hideProject(){
      pIntro.hidden=false; pDetail.hidden=true; pDetail.innerHTML='';
      pAside.removeAttribute('style');
      pAside.classList.remove('detail-open');
      document.querySelectorAll('.pcard').forEach(function(c){ c.classList.remove('active'); });
    }
    document.querySelectorAll('.pcard .pcard-face').forEach(function(face){
      face.addEventListener('click',function(){
        var card=face.closest('.pcard');
        if(card.classList.contains('active')) hideProject();  /* 같은 버튼 다시 누르면 취소 */
        else showProject(card);
      });
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && !pDetail.hidden) hideProject();
    });
  }
})();

/* ============================================================
   스크린샷 쇼케이스 — Web/Mobile 버튼 클릭 시 브라우저/폰 창 슬라이드쇼
   ============================================================ */
(function(){
  var W='assets/On_You_assets/On_You_web/';
  var M='assets/On_You_assets/On_You_mobile/';
  var GAL={
    'onyou-web':{ views:[
      { tab:'Browser', type:'browser', url:'On_You', dur:5000, shots:[
        {src:W+'On_You_web_비로그인_채팅_1.gif', label:'비로그인 채팅'},
        {src:W+'On_You_web_피부관리법_질문_2.gif', label:'피부관리법 질문'},
        {src:W+'On_You_web_피부시술법_질문_3.gif', label:'피부시술법 질문'},
        {src:W+'On_You_web_피부사진_빠른분석_4.gif', label:'피부사진 빠른분석'},
        {src:W+'On_You_web_피부사진_정밀분석_5.gif', label:'피부사진 정밀분석'},
        {src:W+'On_You_web_전성분사진_OCR정보추출_6.gif', label:'전성분사진 OCR정보추출'},
        {src:W+'On_You_web_피부사진_퍼스널컬러분석_7.gif', label:'피부사진 퍼스널컬러분석'},
        {src:W+'On_You_web_피부MBTI테스트_8.gif', label:'피부MBTI테스트'}
      ]},
      { tab:'Laptop', type:'laptop', url:'On_You', dur:4000, shots:[
        {src:W+'On_You_web_비로그인_1.png', label:'비로그인'},
        {src:W+'On_You_web_로그인_2.png', label:'로그인'},
        {src:W+'On_You_web_회원가입_3.png', label:'회원가입'},
        {src:W+'On_You_web_마이페이지_4.png', label:'마이페이지'},
        {src:W+'On_You_web_제품추천_5.png', label:'제품추천'},
        {src:W+'On_You_web_정밀분석_사진업로드_6.png', label:'정밀분석 사진업로드'},
        {src:W+'On_You_web_정밀분석_사진업로드후_분석_7.png', label:'정밀분석 사진업로드후 분석'},
        {src:W+'On_You_web_전성분사진_OCR정보추출_8.png', label:'전성분사진 OCR정보추출'},
        {src:W+'On_You_web_피부분석결과_현재분석_9.png', label:'피부분석결과 현재분석'},
        {src:W+'On_You_web_피부분석결과_비교분석_10.png', label:'피부분석결과 비교분석'}
      ]}
    ]},
    'onyou-mobile':{ views:[
      { tab:'Mobile', type:'phone', url:'On_You · App', dur:4000, shots:[] }
    ]}
  };
  for(var j=1;j<=17;j++){ GAL['onyou-mobile'].views[0].shots.push({src:M+'On_You_mobile_'+j+'.gif', label:'화면 '+j}); }

  var modal=document.getElementById('shotModal');
  if(!modal) return;
  var body=document.getElementById('shotBody');

  var shots=[], slideEls=[], dotEls=[], current=0, dur=4500;
  var rafId=null, slideStart=0, accumulated=0, paused=false, open=false;
  var progressFill=null, captionEl=null, touchX=null;
  var curViews=null, viewIdx=0, viewDur=4500, navToken=0;

  /* GIF 전체 재생 길이(ms) 파싱 — 프레임 delay 합산 */
  function gifDuration(buf){
    var b=new Uint8Array(buf); if(b[0]!==0x47) return 0;
    var i=6, total=0; var packed=b[i+4]; i+=7;
    if(packed&0x80) i+=3*(2<<(packed&7));
    while(i<b.length){
      var blk=b[i];
      if(blk===0x3B) break;
      if(blk===0x21){
        if(b[i+1]===0xF9) total+=((b[i+4]|(b[i+5]<<8))||0)*10;
        i+=2; while(i<b.length && b[i]!==0) i+=b[i]+1; i++;
      } else if(blk===0x2C){
        var p=b[i+9]; i+=10; if(p&0x80) i+=3*(2<<(p&7));
        i++; while(i<b.length && b[i]!==0) i+=b[i]+1; i++;
      } else i++;
    }
    return total;
  }
  function resolveDur(sld, cb){
    if(sld._dur){ cb(sld._dur); return; }
    if(!/\.gif(\?|$)/i.test(sld.src)){ sld._dur=viewDur; cb(viewDur); return; }
    fetch(enc(sld.src)).then(function(r){return r.arrayBuffer();}).then(function(buf){
      var d=gifDuration(buf); sld._dur=(d>500? d+300 : viewDur); cb(sld._dur);  // +300ms 여유
    }).catch(function(){ sld._dur=viewDur; cb(viewDur); });
  }
  /* 현재 슬라이드: 길이 파악 후 그만큼 재생 (파싱 끝날 때까지 안 넘어감) */
  function playCurrent(){
    if(progressFill) progressFill.style.width='0%';
    cancelAnimationFrame(rafId);
    if(shots.length<=1) return;
    var token=++navToken;
    resolveDur(shots[current], function(d){ if(token===navToken && open){ dur=d; startTiming(); } });
  }

  function enc(s){ return encodeURI(s); }
  function mk(tag,cls,html){ var n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; }

  function build(view){
    shots=view.shots; current=0; dur=view.dur||4500; viewDur=view.dur||4500; slideEls=[]; dotEls=[];
    var t=view.type;   // 'browser' | 'phone' | 'laptop'
    body.className='shot-body '+t;
    body.innerHTML='';

    var screen=mk('div', t==='phone'?'shot-screen':(t==='laptop'?'shot-lap-screen':'shot-stage'));
    shots.forEach(function(s,idx){
      var img=mk('img','shot-slide'+(idx===0?' active':''));
      img.alt=s.label||('slide '+(idx+1));
      img.dataset.src=enc(s.src);
      if(idx===0) img.src=enc(s.src);
      screen.appendChild(img);
      slideEls.push(img);
    });

    var progWrap=mk('div','shot-progress'); progressFill=mk('div','shot-progress-fill'); progWrap.appendChild(progressFill);
    var prevBtn=mk('button','shot-nav prev','‹'); prevBtn.type='button'; prevBtn.setAttribute('aria-label','이전');
    var nextBtn=mk('button','shot-nav next','›'); nextBtn.type='button'; nextBtn.setAttribute('aria-label','다음');
    prevBtn.addEventListener('click',function(){ goTo(current-1); });
    nextBtn.addEventListener('click',function(){ goTo(current+1); });

    var device;
    if(t==='phone'){
      device=mk('div','shot-phone');
      device.appendChild(screen);
      device.appendChild(mk('span','shot-key vol'));
      device.appendChild(mk('span','shot-key pwr'));
    } else if(t==='laptop'){
      device=mk('div','shot-laptop');
      var lbar=mk('div','shot-bar');
      lbar.appendChild(mk('div','shot-lights','<span></span><span></span><span></span>'));
      lbar.appendChild(mk('div','shot-url','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg> <span>'+(view.url||'')+'</span>'));
      screen.insertBefore(progWrap, screen.firstChild);   // 진행바: 화면 상단
      device.appendChild(lbar); device.appendChild(screen);
    } else {
      device=mk('div','shot-frame');
      var bar=mk('div','shot-bar');
      bar.appendChild(mk('div','shot-lights','<span></span><span></span><span></span>'));
      bar.appendChild(mk('div','shot-url','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg> <span>'+(view.url||'')+'</span>'));
      screen.insertBefore(progWrap, screen.firstChild);   // 진행바: 화면 상단
      device.appendChild(bar); device.appendChild(screen);
    }
    // 화살표는 항상 프레임 바깥(좌우)에
    var row=mk('div','shot-stage-row');
    row.appendChild(prevBtn); row.appendChild(device); row.appendChild(nextBtn);
    body.appendChild(row);
    if(t==='phone') body.appendChild(progWrap);   // 폰 진행바: 아래

    var footer=mk('div','shot-footer center');
    // 탭 (Browser / Laptop) — 점 위
    if(curViews && curViews.length>1){
      var tabs=mk('div','shot-tabs');
      curViews.forEach(function(v,ti){
        var tab=mk('button','shot-tab'+(ti===viewIdx?' active':''), v.tab||('View '+(ti+1)));
        tab.type='button';
        (function(k){ tab.addEventListener('click',function(){ if(k!==viewIdx) openView(k); }); })(ti);
        tabs.appendChild(tab);
      });
      footer.appendChild(tabs);
    }
    var dots=mk('div','shot-dots');
    shots.forEach(function(s,idx){
      var dot=mk('button','shot-dot'+(idx===0?' active':'')); dot.type='button';
      dot.setAttribute('aria-label',(idx+1)+'번');
      (function(j){ dot.addEventListener('click',function(){ goTo(j); }); })(idx);
      dots.appendChild(dot); dotEls.push(dot);
    });
    captionEl=mk('div','shot-caption', shots.length?(shots[0].label||''):'');
    footer.appendChild(dots); footer.appendChild(captionEl);
    body.appendChild(footer);

    // 스와이프
    screen.addEventListener('touchstart',function(e){ touchX=e.touches[0].clientX; },{passive:true});
    screen.addEventListener('touchend',function(e){
      if(touchX===null) return;
      var dx=e.changedTouches[0].clientX-touchX;
      if(Math.abs(dx)>40) goTo(current+(dx<0?1:-1));
      touchX=null;
    });
  }

  function goTo(i){
    if(!shots.length) return;
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');
    current=(i+shots.length)%shots.length;
    var el=slideEls[current];
    el.src=el.dataset.src;                   // GIF 처음부터 재생
    el.classList.add('active');
    dotEls[current].classList.add('active');
    captionEl.textContent=shots[current].label||'';
    playCurrent();
  }

  function tick(now){
    if(paused||!open) return;
    var p=Math.min((accumulated+(now-slideStart))/dur,1);
    if(progressFill) progressFill.style.width=(p*100)+'%';
    if(p>=1){ goTo(current+1); return; }
    rafId=requestAnimationFrame(tick);
  }
  function startTiming(){ accumulated=0; slideStart=performance.now(); cancelAnimationFrame(rafId); rafId=requestAnimationFrame(tick); }
  function pause(){ if(paused)return; paused=true; accumulated+=performance.now()-slideStart; cancelAnimationFrame(rafId); }
  function resume(){ if(!paused||!open)return; paused=false; slideStart=performance.now(); rafId=requestAnimationFrame(tick); }

  function openView(i){
    viewIdx=i;
    build(curViews[i]);
    paused=false;
    playCurrent();
  }
  function openGal(key){
    var gal=GAL[key]; if(!gal||!gal.views) return;
    curViews=gal.views; viewIdx=0;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-lock');
    open=true;
    openView(0);
  }
  function closeGal(){
    open=false; cancelAnimationFrame(rafId);
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-lock');
    slideEls.forEach(function(el){ el.src=''; });   // GIF 메모리 해제
  }

  body.addEventListener('mouseenter',pause);
  body.addEventListener('mouseleave',resume);
  modal.querySelectorAll('[data-shot-close]').forEach(function(el){ el.addEventListener('click',closeGal); });
  document.addEventListener('keydown',function(e){
    if(!open) return;
    if(e.key==='Escape') closeGal();
    else if(e.key==='ArrowLeft') goTo(current-1);
    else if(e.key==='ArrowRight') goTo(current+1);
  });

  // Web/Mobile 버튼(동적 생성) → 이벤트 위임
  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-shot]');
    if(btn){ e.preventDefault(); openGal(btn.getAttribute('data-shot')); }
  });
})();
