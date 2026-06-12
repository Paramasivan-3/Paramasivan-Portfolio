/* ==========================================================================
   3D Effects — GSAP scroll animations, hero mouse parallax, card 3D tilt
   Runs after React has mounted (delayed past loader animation)
   ========================================================================== */

(function () {
  'use strict';

  /* ── Utility ─────────────────────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Hero mouse parallax ────────────────────────────────────────────────── */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var mx = 0, my = 0;
    var portraitRX = 0, portraitRY = 0;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width  - 0.5;
      my = (e.clientY - r.top)  / r.height - 0.5;
    });

    hero.addEventListener('mouseleave', function () {
      mx = 0; my = 0;
    });

    var portraitFrame = hero.querySelector('.portrait-frame');
    var chips         = hero.querySelectorAll('.float-chip');
    var heroText      = hero.querySelector('.hero-text');
    var glow          = hero.querySelector('.hero-bg-glow');

    var cx = 0, cy = 0; /* smoothed camera values */

    function tick() {
      cx = lerp(cx, mx, 0.06);
      cy = lerp(cy, my, 0.06);

      if (portraitFrame) {
        portraitRX = lerp(portraitRX, -cy * 10, 0.07);
        portraitRY = lerp(portraitRY,  cx *  8, 0.07);
        portraitFrame.style.transform =
          'perspective(700px) rotateX(' + portraitRX + 'deg) rotateY(' + portraitRY + 'deg)';
      }

      /* chips float at varying depth layers */
      var depths = [2.2, 3.0, 2.6, 1.8];
      chips.forEach(function (chip, i) {
        var d = depths[i] || 2;
        chip.style.transform =
          'translate(' + (cx * 20 * d) + 'px, ' + (cy * 14 * d) + 'px)';
      });

      if (heroText) {
        heroText.style.transform =
          'translate(' + (cx * -9) + 'px, ' + (cy * -6) + 'px)';
      }

      if (glow) {
        glow.style.transform =
          'translate(' + (cx * 30) + 'px, ' + (cy * 20) + 'px)';
      }

      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── 3D card tilt ────────────────────────────────────────────────────────── */
  function initCardTilt(selector, maxTilt, zLift) {
    maxTilt = maxTilt || 12;
    zLift   = zLift   || 10;

    document.querySelectorAll(selector).forEach(function (el) {
      /* skip tiny / badge-like elements */
      if (el.offsetWidth < 80) return;

      el.addEventListener('mousemove', function (e) {
        var r  = this.getBoundingClientRect();
        var x  = (e.clientX - r.left) / r.width  - 0.5;
        var y  = (e.clientY - r.top)  / r.height - 0.5;
        this.style.transform =
          'perspective(900px) rotateY(' + (x * maxTilt) + 'deg) rotateX(' + (-y * maxTilt) + 'deg) translateZ(' + zLift + 'px)';
        this.style.transition = 'transform 0.08s linear';

        /* dynamic edge highlight */
        var shine = this.querySelector('.glass-shine');
        if (shine) {
          shine.style.background =
            'radial-gradient(circle at ' + ((x + 0.5) * 100) + '% ' + ((y + 0.5) * 100) + '%, rgba(255,255,255,0.18), transparent 60%)';
        }
      });

      el.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
        var shine = this.querySelector('.glass-shine');
        if (shine) shine.style.background = '';
      });

      /* inject shine overlay once */
      if (!el.querySelector('.glass-shine')) {
        var s = document.createElement('div');
        s.className = 'glass-shine';
        s.style.cssText =
          'position:absolute;inset:0;pointer-events:none;border-radius:inherit;transition:background 0.15s ease;z-index:1;';
        el.style.position = el.style.position || 'relative';
        el.appendChild(s);
      }
    });
  }

  /* ── GSAP scroll-triggered animations ───────────────────────────────────── */
  /* ── Lenis smooth scroll ─────────────────────────────────────────────────── */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return setTimeout(initSmoothScroll, 150);
    var lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothTouch: false
    });
    /* store globally so anchor clicks can use lenis.scrollTo */
    window._lenis = lenis;
    lenis.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
    /* smooth anchor / nav click scrolling */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80, duration: 1.4 }); }
      });
    });
  }

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return setTimeout(initGSAP, 200);
    }
    gsap.registerPlugin(ScrollTrigger);

    /* section headings — rise + 3D rotate from depth */
    gsap.utils.toArray('.sec-head').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: 60, opacity: 0, rotationX: 24, scale: 0.96,
        transformOrigin: 'center bottom',
        duration: 1.0, ease: 'power3.out'
      });
    });

    /* service cards — 3D flip-in stagger */
    gsap.utils.toArray('.svc-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 93%' },
        y: 55, opacity: 0, rotationY: -22, rotationX: 8,
        transformOrigin: 'left center',
        duration: 0.8, delay: (i % 3) * 0.1, ease: 'back.out(1.3)'
      });
    });

    /* skill cards — cascade with depth */
    gsap.utils.toArray('.sk-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 93%' },
        y: 40, opacity: 0, scale: 0.85, rotationX: 12,
        transformOrigin: 'center bottom',
        duration: 0.65, delay: (i % 8) * 0.055, ease: 'back.out(1.5)'
      });
    });

    /* timeline items — slide + 3D depth */
    gsap.utils.toArray('.tl-item').forEach(function (item, i) {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 88%' },
        x: -50, opacity: 0, rotationY: 10,
        transformOrigin: 'right center',
        duration: 0.7, delay: i * 0.08, ease: 'power2.out'
      });
    });

    /* portfolio cards — .reveal CSS handles the fade-in; GSAP only adds the hover-scale boost */
    /* Removed opacity/y from GSAP to prevent cards going invisible at 2700ms init */

    /* work cards */
    gsap.utils.toArray('.work-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 93%' },
        y: 45, opacity: 0, scale: 0.93,
        duration: 0.65, delay: (i % 3) * 0.09, ease: 'power2.out'
      });
    });

    /* stat bar — punch up from below */
    gsap.utils.toArray('.stats-bar').forEach(function (bar) {
      gsap.from(bar, {
        scrollTrigger: { trigger: bar, start: 'top 90%' },
        y: 40, opacity: 0, scale: 0.94, rotationX: 10,
        transformOrigin: 'center bottom',
        duration: 0.8, ease: 'back.out(1.3)'
      });
    });

    /* result cards — 3D tilt reveal */
    gsap.utils.toArray('.result-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%' },
        y: 50, opacity: 0, rotationX: 18, rotationY: (i % 2 === 0 ? 6 : -6),
        transformOrigin: 'center bottom',
        duration: 0.7, delay: i * 0.1, ease: 'power2.out'
      });
    });

    /* blog cards — stagger fade-up */
    gsap.utils.toArray('.blog-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%' },
        y: 35, opacity: 0, scale: 0.94, rotationX: 6,
        transformOrigin: 'center bottom',
        duration: 0.6, delay: (i % 3) * 0.08, ease: 'power2.out'
      });
    });

    /* testimonials — scale pop with depth */
    gsap.utils.toArray('.testimonial-card, .tst-card').forEach(function (card) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        scale: 0.88, opacity: 0, rotationX: 12,
        transformOrigin: 'center bottom',
        duration: 0.75, ease: 'back.out(1.4)'
      });
    });

    /* id-card — 3D slide from left */
    gsap.utils.toArray('.id-card').forEach(function (card) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        x: -60, opacity: 0, rotationY: -16,
        transformOrigin: 'right center',
        duration: 0.9, ease: 'power3.out'
      });
    });

    /* case study image frame — tilt in */
    gsap.utils.toArray('.cs-img-frame').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        x: 50, opacity: 0, rotationY: 14, scale: 0.94,
        transformOrigin: 'left center',
        duration: 0.9, ease: 'power3.out'
      });
    });

    /* monument cards — stagger 3D reveal */
    gsap.utils.toArray('.mon-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%' },
        y: 40, opacity: 0, rotationX: 14, scale: 0.92,
        transformOrigin: 'center bottom',
        duration: 0.65, delay: i * 0.08, ease: 'back.out(1.2)'
      });
    });

    /* contact info rows — slide from left */
    gsap.utils.toArray('.ct-row').forEach(function (row, i) {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 90%' },
        x: -35, opacity: 0,
        duration: 0.55, delay: i * 0.07, ease: 'power2.out'
      });
    });

    /* navbar brand mark bounce */
    gsap.from('.brand-mark', {
      delay: 2.8, scale: 0, rotation: -20, opacity: 0,
      duration: 0.5, ease: 'back.out(2)'
    });

    /* eyebrow labels — fade-in with line */
    gsap.utils.toArray('.eyebrow').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        x: -20, opacity: 0,
        duration: 0.5, ease: 'power2.out'
      });
    });
  }

  /* ── Magnetic buttons ────────────────────────────────────────────────────── */
  function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = this.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width  / 2);
        var dy = e.clientY - (r.top  + r.height / 2);
        this.style.transform =
          'translate(' + (dx * 0.22) + 'px, ' + (dy * 0.22) + 'px) scale(1.04)';
        this.style.transition = 'transform 0.12s linear';
      });
      btn.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)';
      });
    });
  }

  /* ── Cursor glow trail ───────────────────────────────────────────────────── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; /* skip touch */

    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText =
      'position:fixed;pointer-events:none;z-index:9999;width:26px;height:26px;' +
      'border-radius:50%;background:rgba(6,182,212,0.38);filter:blur(9px);' +
      'transform:translate(-50%,-50%);transition:width 0.22s,height 0.22s,opacity 0.22s;' +
      'mix-blend-mode:screen;';
    document.body.appendChild(glow);

    var tx = -100, ty = -100, cx2 = -100, cy2 = -100;

    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });

    (function trailLoop() {
      cx2 = lerp(cx2, tx, 0.14);
      cy2 = lerp(cy2, ty, 0.14);
      glow.style.left = cx2 + 'px';
      glow.style.top  = cy2 + 'px';
      requestAnimationFrame(trailLoop);
    })();

    /* expand on interactive elements — include pf-card and gallery cards */
    document.querySelectorAll('a,button,.btn,.chip,.soc-btn,.pf-card,.gallery-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        glow.style.width   = '64px';
        glow.style.height  = '64px';
        glow.style.opacity = '0.55';
      });
      el.addEventListener('mouseleave', function () {
        glow.style.width   = '26px';
        glow.style.height  = '26px';
        glow.style.opacity = '1';
      });
    });
  }

  /* ── Scroll-reveal: floating aura drift ─────────────────────────────────── */
  function initAuraDrift() {
    var aura = document.querySelector('.aura');
    if (!aura) return;
    window.addEventListener('scroll', function () {
      var p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      aura.style.transform = 'translateY(' + (-p * 120) + 'px)';
    }, { passive: true });
  }

  /* ── Section parallax depth ─────────────────────────────────────────────── */
  function initSectionParallax() {
    var sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function () {
      sections.forEach(function (sec) {
        var rect  = sec.getBoundingClientRect();
        var ratio = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
        var bg    = sec.querySelector('.pf-bg-accent, .hero-bg-glow');
        if (bg) bg.style.transform = 'translateY(' + (ratio * -30) + 'px)';
      });
    }, { passive: true });
  }

  /* ── Portrait photo — continuous depth tilt on mouse ────────────────────── */
  function initPortraitDepth() {
    var portrait = document.querySelector('.portrait');
    var frame    = portrait && portrait.querySelector('.portrait-frame');
    if (!portrait || !frame) return;

    var rx = 0, ry = 0;

    portrait.addEventListener('mousemove', function (e) {
      var r = portrait.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      rx = lerp(rx, -y * 16, 0.12);
      ry = lerp(ry,  x * 12, 0.12);
      frame.style.transform =
        'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.02)';
      frame.style.transition = 'transform 0.1s linear';
    });

    portrait.addEventListener('mouseleave', function () {
      rx = 0; ry = 0;
      frame.style.transform  = '';
      frame.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
    });
  }

  /* ── Boot sequence ───────────────────────────────────────────────────────── */
  function boot() {
    /* Lenis starts immediately so window._lenis is ready before any card click */
    initSmoothScroll();

    /* wait until React + loader has finished (~2.6 s) */
    setTimeout(function () {
      initHeroParallax();
      initPortraitDepth();
      initCardTilt(
        '.svc-card, .sk-card, .id-card, .work-card, .blog-card, .testimonial-card, .result-card',
        10, 8
      );
      initMagneticButtons();
      initCursorGlow();
      initAuraDrift();
      initSectionParallax();
      initGSAP();
    }, 2700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
