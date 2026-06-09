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
      back.innerHTML='← 나가기';
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
