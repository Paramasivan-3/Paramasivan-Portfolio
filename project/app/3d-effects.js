/* ==========================================================================
   3D Effects — loader · scroll · GSAP · tilt · magnetic · cursor · particles
   ========================================================================== */

(function () {
  'use strict';

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ══════════════════════════════════════════════════════════════════════════
     PW-0  Page Loader
     ══════════════════════════════════════════════════════════════════════════ */
  function initPageLoader() {
    var loader = document.getElementById('pw-loader');
    if (!loader) return;

    var bar    = loader.querySelector('.pw-progress-bar');
    var status = loader.querySelector('.pw-status');
    var steps  = ['Initializing…', 'Loading assets…', 'Building scene…', 'Ready'];
    var prog   = 0;
    var si     = 0;

    function step() {
      prog = Math.min(prog + (8 + Math.random() * 18), 100);
      if (bar) bar.style.width = prog + '%';
      if (status && si < steps.length) {
        status.textContent = steps[Math.floor(si)];
        si += 0.6;
      }
      if (prog < 100) {
        setTimeout(step, 80 + Math.random() * 90);
      } else {
        setTimeout(function () {
          loader.classList.add('done');
          setTimeout(function () { loader.style.display = 'none'; }, 720);
          showScrollIndicator();
        }, 320);
      }
    }

    /* Mini Three.js loader canvas */
    var lc = document.getElementById('pw-loader-canvas');
    if (lc && typeof THREE !== 'undefined') {
      var lr = new THREE.WebGLRenderer({ canvas: lc, alpha: true, antialias: false });
      var lW = window.innerWidth, lH = window.innerHeight;
      lr.setSize(lW, lH);
      var lScene  = new THREE.Scene();
      var lCamera = new THREE.PerspectiveCamera(70, lW/lH, 0.1, 500);
      lCamera.position.z = 50;
      var lpN   = 120;
      var lpPos = new Float32Array(lpN * 3);
      for (var li = 0; li < lpN; li++) {
        lpPos[li*3]   = (Math.random()-0.5)*120;
        lpPos[li*3+1] = (Math.random()-0.5)*80;
        lpPos[li*3+2] = (Math.random()-0.5)*60;
      }
      var lpGeo  = new THREE.BufferGeometry();
      lpGeo.setAttribute('position', new THREE.BufferAttribute(lpPos, 3));
      var lpPts  = new THREE.Points(lpGeo, new THREE.PointsMaterial({ color: 0x06B6D4, size: 0.5, transparent: true, opacity: 0.55 }));
      lScene.add(lpPts);
      var lClock = new THREE.Clock();
      function lAnimate() {
        if (!lc.parentNode) return;
        requestAnimationFrame(lAnimate);
        var lt = lClock.getElapsedTime();
        lpPts.rotation.y = lt * 0.12;
        lpPts.rotation.x = lt * 0.07;
        lr.render(lScene, lCamera);
      }
      lAnimate();
    }

    setTimeout(step, 200);
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PW-1  Scroll Indicator
     ══════════════════════════════════════════════════════════════════════════ */
  function showScrollIndicator() {
    var ind = document.getElementById('pw-scroll-indicator');
    if (!ind) return;
    setTimeout(function () { ind.classList.add('visible'); }, 600);
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) ind.classList.add('hidden');
      else ind.classList.remove('hidden');
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PW-2  Scroll Progress Bar
     ══════════════════════════════════════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      bar.style.width = (p * 100) + '%';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PW-3  Word Reveal (clip-path slide up)
     ══════════════════════════════════════════════════════════════════════════ */
  function initWordReveal() {
    var io = ('IntersectionObserver' in window)
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var words = e.target.querySelectorAll('.pw-word-inner');
            words.forEach(function (w, i) {
              setTimeout(function () { w.classList.add('revealed'); }, i * 55);
            });
            io.unobserve(e.target);
          });
        }, { threshold: 0.15 })
      : null;

    document.querySelectorAll('h1, h2, .hero-h1').forEach(function (el) {
      if (el.dataset.pwDone) return;
      el.dataset.pwDone = '1';
      var html = '';
      el.textContent.split(' ').forEach(function (word) {
        html += '<span class="pw-word-wrap"><span class="pw-word-inner">' + word + '</span></span> ';
      });
      el.innerHTML = html;
      if (io) io.observe(el);
      else el.querySelectorAll('.pw-word-inner').forEach(function (w) { w.classList.add('revealed'); });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PW-4  Portfolio card overlay injection
     ══════════════════════════════════════════════════════════════════════════ */
  function initPortfolioOverlay() {
    function attach(card) {
      if (card.querySelector('.pw-card-overlay')) return;
      var ov = document.createElement('div');
      ov.className = 'pw-card-overlay';
      var txt = document.createElement('span');
      txt.className = 'pw-card-overlay-txt';
      txt.textContent = 'View Work';
      ov.appendChild(txt);
      card.appendChild(ov);
    }
    document.querySelectorAll('.pf-card').forEach(attach);
    if ('MutationObserver' in window) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType !== 1) return;
            if (n.classList && n.classList.contains('pf-card')) attach(n);
            n.querySelectorAll && n.querySelectorAll('.pf-card').forEach(attach);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Hero mouse parallax
     ══════════════════════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var mx = 0, my = 0, cx = 0, cy = 0;
    var portraitRX = 0, portraitRY = 0;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width  - 0.5;
      my = (e.clientY - r.top)  / r.height - 0.5;
    });
    hero.addEventListener('mouseleave', function () { mx = 0; my = 0; });

    var portraitFrame = hero.querySelector('.portrait-frame');
    var chips         = hero.querySelectorAll('.float-chip');
    var heroText      = hero.querySelector('.hero-text');
    var glow          = hero.querySelector('.hero-bg-glow');

    (function tick() {
      cx = lerp(cx, mx, 0.06);
      cy = lerp(cy, my, 0.06);
      if (portraitFrame) {
        portraitRX = lerp(portraitRX, -cy * 10, 0.07);
        portraitRY = lerp(portraitRY,  cx *  8, 0.07);
        portraitFrame.style.transform =
          'perspective(700px) rotateX(' + portraitRX + 'deg) rotateY(' + portraitRY + 'deg)';
      }
      var depths = [2.2, 3.0, 2.6, 1.8];
      chips.forEach(function (chip, i) {
        var d = depths[i] || 2;
        chip.style.transform = 'translate(' + (cx*20*d) + 'px,' + (cy*14*d) + 'px)';
      });
      if (heroText) heroText.style.transform = 'translate(' + (cx*-9) + 'px,' + (cy*-6) + 'px)';
      if (glow)     glow.style.transform     = 'translate(' + (cx* 30) + 'px,' + (cy*20) + 'px)';
      requestAnimationFrame(tick);
    })();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     3D Card Tilt
     ══════════════════════════════════════════════════════════════════════════ */
  function initCardTilt(selector, maxTilt, zLift) {
    maxTilt = maxTilt || 12; zLift = zLift || 10;
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.offsetWidth < 80) return;
      el.addEventListener('mousemove', function (e) {
        var r  = this.getBoundingClientRect();
        var x  = (e.clientX - r.left) / r.width  - 0.5;
        var y  = (e.clientY - r.top)  / r.height - 0.5;
        this.style.transform =
          'perspective(900px) rotateY(' + (x*maxTilt) + 'deg) rotateX(' + (-y*maxTilt) + 'deg) translateZ(' + zLift + 'px)';
        this.style.transition = 'transform 0.08s linear';
        var shine = this.querySelector('.glass-shine');
        if (shine) shine.style.background =
          'radial-gradient(circle at ' + ((x+0.5)*100) + '% ' + ((y+0.5)*100) + '%, rgba(255,255,255,0.18), transparent 60%)';
      });
      el.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
        var shine = this.querySelector('.glass-shine');
        if (shine) shine.style.background = '';
      });
      if (!el.querySelector('.glass-shine')) {
        var s = document.createElement('div');
        s.className = 'glass-shine';
        s.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;transition:background 0.15s;z-index:1;';
        el.style.position = el.style.position || 'relative';
        el.appendChild(s);
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Button 3D tilt + magnetic
     ══════════════════════════════════════════════════════════════════════════ */
  function initButton3DTilt() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = this.getBoundingClientRect();
        var x  = (e.clientX - r.left) / r.width  - 0.5;
        var y  = (e.clientY - r.top)  / r.height - 0.5;
        var dx = e.clientX - (r.left + r.width/2);
        var dy = e.clientY - (r.top  + r.height/2);
        this.style.transform =
          'translate(' + (dx*0.20) + 'px,' + (dy*0.20) + 'px) ' +
          'perspective(500px) rotateX(' + (-y*8) + 'deg) rotateY(' + (x*8) + 'deg) scale(1.04)';
        this.style.transition = 'transform 0.10s linear';
      });
      btn.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Button particle burst on click
     ══════════════════════════════════════════════════════════════════════════ */
  function initButtonParticleBurst() {
    var sparkColors = ['#22D3EE','#06B6D4','#0891B2','#67E8F9','#BAE6FD'];
    document.querySelectorAll('.btn-gold, .btn-ghost').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var cx2 = e.clientX, cy2 = e.clientY;
        for (var si = 0; si < 16; si++) {
          var spark = document.createElement('div');
          spark.className = 'btn-spark';
          var angle = (si / 16) * Math.PI * 2;
          var dist  = 30 + Math.random() * 55;
          spark.style.left = cx2 + 'px';
          spark.style.top  = cy2 + 'px';
          spark.style.background = sparkColors[si % sparkColors.length];
          spark.style.setProperty('--sx', Math.cos(angle)*dist + 'px');
          spark.style.setProperty('--sy', Math.sin(angle)*dist + 'px');
          spark.style.width  = (3 + Math.random()*3) + 'px';
          spark.style.height = spark.style.width;
          document.body.appendChild(spark);
          setTimeout(function () { spark.remove(); }, 680);
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Cursor glow trail
     ══════════════════════════════════════════════════════════════════════════ */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText =
      'position:fixed;pointer-events:none;z-index:9999;width:26px;height:26px;' +
      'border-radius:50%;background:rgba(6,182,212,0.38);filter:blur(9px);' +
      'transform:translate(-50%,-50%);transition:width 0.22s,height 0.22s,opacity 0.22s;mix-blend-mode:screen;';
    document.body.appendChild(glow);

    var tx = -100, ty = -100, cx3 = -100, cy3 = -100;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function trail() {
      cx3 = lerp(cx3, tx, 0.14);
      cy3 = lerp(cy3, ty, 0.14);
      glow.style.left = cx3 + 'px';
      glow.style.top  = cy3 + 'px';
      requestAnimationFrame(trail);
    })();

    document.querySelectorAll('a,button,.btn,.chip,.soc-btn,.pf-card,.gallery-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { glow.style.width='64px';glow.style.height='64px';glow.style.opacity='0.55'; });
      el.addEventListener('mouseleave', function () { glow.style.width='26px';glow.style.height='26px';glow.style.opacity='1'; });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Aura drift on scroll
     ══════════════════════════════════════════════════════════════════════════ */
  function initAuraDrift() {
    var aura = document.querySelector('.aura');
    if (!aura) return;
    window.addEventListener('scroll', function () {
      var p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      aura.style.transform = 'translateY(' + (-p*120) + 'px)';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Portrait depth tilt
     ══════════════════════════════════════════════════════════════════════════ */
  function initPortraitDepth() {
    var portrait = document.querySelector('.portrait');
    var frame    = portrait && portrait.querySelector('.portrait-frame');
    if (!portrait || !frame) return;
    var rx = 0, ry = 0;
    portrait.addEventListener('mousemove', function (e) {
      var r = portrait.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      rx = lerp(rx, -y*16, 0.12); ry = lerp(ry, x*12, 0.12);
      frame.style.transform  = 'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.02)';
      frame.style.transition = 'transform 0.1s linear';
    });
    portrait.addEventListener('mouseleave', function () {
      rx = 0; ry = 0;
      frame.style.transform  = '';
      frame.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Lenis smooth scroll
     ══════════════════════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return setTimeout(initSmoothScroll, 150);
    var lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10*t)); },
      smoothTouch: false
    });
    window._lenis = lenis;
    lenis.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80, duration: 1.4 }); }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     GSAP scroll-triggered 3D animations
     ══════════════════════════════════════════════════════════════════════════ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined')
      return setTimeout(initGSAP, 200);
    gsap.registerPlugin(ScrollTrigger);

    /* ── Shared eases ──────────────────────────────────────────────────── */
    var EXPO = 'power4.out';
    var BACK = 'back.out(1.5)';

    /* ── Helper: fromTo so opacity always lands at 1 (never captured from .reveal CSS) */
    function ft(el, fromVars, toVars, stVars) {
      var merged = Object.assign({ opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 }, toVars);
      merged.scrollTrigger = Object.assign({ trigger: el, start: 'top 92%', once: true }, stVars);
      gsap.fromTo(el, fromVars, merged);
    }

    /* ── Section headings ─────────────────────────────────────────────── */
    gsap.utils.toArray('.sec-head').forEach(function (el) {
      var kicker = el.querySelector('.eyebrow');
      var title  = el.querySelector('h2');
      var sub    = el.querySelector('.sec-sub, p');
      var tl     = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
      if (kicker) tl.fromTo(kicker, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: EXPO });
      if (title)  tl.fromTo(title,  { y: 36,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EXPO }, kicker ? '-=0.25' : 0);
      if (sub)    tl.fromTo(sub,    { y: 22,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: EXPO }, '-=0.4');
    });

    /* ── Service cards ────────────────────────────────────────────────── */
    gsap.utils.toArray('.svc-card').forEach(function (card, i) {
      ft(card, { y: 48, opacity: 0, scale: 0.93 }, { y: 0, scale: 1, duration: 0.75, ease: EXPO, delay: (i % 3) * 0.10 });
    });

    /* ── Process cards ────────────────────────────────────────────────── */
    gsap.utils.toArray('.proc-card').forEach(function (card, i) {
      ft(card, { y: 40, opacity: 0, scale: 0.94 }, { y: 0, scale: 1, duration: 0.70, ease: EXPO, delay: (i % 3) * 0.09 });
    });

    /* ── Big skill cards ──────────────────────────────────────────────── */
    gsap.utils.toArray('.big-skill-wrap').forEach(function (wrap, i) {
      ft(wrap, { y: 32, opacity: 0, scale: 0.85, rotation: -8 }, { y: 0, scale: 1, rotation: 0, duration: 0.65, ease: BACK, delay: i * 0.07 }, { start: 'top 93%' });
    });

    /* ── Skill chips ──────────────────────────────────────────────────── */
    gsap.utils.toArray('.sk-card').forEach(function (card, i) {
      ft(card, { y: 18, opacity: 0, scale: 0.88 }, { y: 0, scale: 1, duration: 0.5, ease: BACK, delay: (i % 8) * 0.04 }, { start: 'top 94%' });
    });

    /* ── Work / portfolio cards ───────────────────────────────────────── */
    gsap.utils.toArray('.work-card, .pf-card').forEach(function (card, i) {
      ft(card, { x: i % 2 === 0 ? -32 : 32, y: 28, opacity: 0 }, { x: 0, y: 0, duration: 0.75, ease: EXPO, delay: (i % 3) * 0.09 }, { start: 'top 91%' });
    });

    /* ── Timeline items ───────────────────────────────────────────────── */
    gsap.utils.toArray('.tl-item').forEach(function (item, i) {
      ft(item, { x: -40, opacity: 0 }, { x: 0, duration: 0.7, ease: EXPO, delay: i * 0.08 }, { start: 'top 88%' });
    });

    /* ── Stats / achievement cards ────────────────────────────────────── */
    gsap.utils.toArray('.stat, .ach-card').forEach(function (el, i) {
      ft(el, { y: 28, opacity: 0, scale: 0.90 }, { y: 0, scale: 1, duration: 0.65, ease: BACK, delay: i * 0.06 }, { start: 'top 90%' });
    });

    /* ── Testimonial / tst cards ──────────────────────────────────────── */
    gsap.utils.toArray('.testimonial-card, .tst-card').forEach(function (el, i) {
      ft(el, { y: 24, opacity: 0, scale: 0.95 }, { y: 0, scale: 1, duration: 0.75, ease: EXPO, delay: (i % 4) * 0.07 });
    });

    /* ── Contact rows ─────────────────────────────────────────────────── */
    gsap.utils.toArray('.ct-row').forEach(function (row, i) {
      ft(row, { x: -28, opacity: 0 }, { x: 0, duration: 0.6, ease: EXPO, delay: i * 0.07 }, { start: 'top 91%' });
    });

    /* ── Case study frames ────────────────────────────────────────────── */
    gsap.utils.toArray('.cs-img-frame').forEach(function (el, i) {
      ft(el, { x: 44, opacity: 0 }, { x: 0, duration: 0.85, ease: EXPO, delay: (i % 4) * 0.07 });
    });

    /* ── About identity cards ─────────────────────────────────────────── */
    gsap.utils.toArray('.id-card').forEach(function (el, i) {
      ft(el, { x: -36, opacity: 0 }, { x: 0, duration: 0.85, ease: EXPO, delay: (i % 4) * 0.07 });
    });

    /* ── Navbar brand entrance — removed; logo visible immediately ───── */
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Geometry decorator injection
     ══════════════════════════════════════════════════════════════════════════ */
  function injectGeometryDecorators() {
    document.querySelectorAll('.hero, .about, .work, .connect').forEach(function (sec, i) {
      if (sec.querySelector('.section-geo')) return;
      var a = document.createElement('div');
      a.className = 'section-geo section-geo-a';
      var b = document.createElement('div');
      b.className = 'section-geo section-geo-b';
      var c = document.createElement('div');
      c.className = 'section-geo section-geo-c';
      sec.appendChild(a);
      sec.appendChild(b);
      sec.appendChild(c);
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Section Headline Underlines — adds .in-view when heading scrolls into view
     ══════════════════════════════════════════════════════════════════════════ */
  function initSectionHeadlines() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.sec-head').forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.sec-head').forEach(function (el) { io.observe(el); });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Boot
     ══════════════════════════════════════════════════════════════════════════ */
  function boot() {
    initPageLoader();
    initScrollProgress();
    initSmoothScroll();

    setTimeout(function () {
      initHeroParallax();
      initPortraitDepth();
      initCardTilt('.svc-card,.sk-card,.id-card,.work-card,.blog-card,.testimonial-card,.result-card', 6, 5);
      initButton3DTilt();
      initCursorGlow();
      initAuraDrift();
      initPortfolioOverlay();
      initSectionHeadlines();
      initGSAP();
    }, 2700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
