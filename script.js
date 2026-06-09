/* 이승연 포트폴리오 — 스크롤 애니메이션 · 네비 활성표시 */
(function(){
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

  /* project modal */
  var modal=document.getElementById('projectModal');
  if(modal){
    var content=modal.querySelector('.modal-content');
    var win=modal.querySelector('.modal-window');
    var lastFocused=null;

    function openModal(card){
      var tpl=card.querySelector('.pcard-detail');
      if(!tpl) return;
      lastFocused=document.activeElement;
      content.innerHTML='';
      content.appendChild(tpl.content.cloneNode(true));
      /* 카드의 컬러칩 토큰을 모달 창으로 전달 */
      win.setAttribute('style',card.getAttribute('style')||'');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('modal-lock');
      win.scrollTop=0;
      var closeBtn=modal.querySelector('.modal-close');
      if(closeBtn) closeBtn.focus();
    }
    function closeModal(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-lock');
      if(lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.querySelectorAll('.pcard').forEach(function(card){
      var face=card.querySelector('.pcard-face');
      if(face) face.addEventListener('click',function(){ openModal(card); });
    });
    modal.querySelectorAll('[data-close]').forEach(function(el){
      el.addEventListener('click',closeModal);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && modal.classList.contains('open')) closeModal();
    });
  }
})();
