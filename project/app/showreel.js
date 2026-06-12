/* ==========================================================================
   SHOWREEL ENGINE — maximum-motion layer
   Loads after 3d-effects.js on both pages. Same retry-loop pattern.
   Every feature is wrapped so a failure never breaks the site.
   ========================================================================== */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH   = window.matchMedia('(pointer: coarse)').matches;
  var IS_GALLERY = /portfolio-gallery/i.test(location.pathname);

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function safe(fn) { try { fn(); } catch (e) { console.warn('[showreel]', e); } }

  /* —— 1. Split-word headings — cinematic cascade ————————————————————————— */
  function splitWords(el) {
    if (el.dataset.srSplit) return [];
    el.dataset.srSplit = '1';
    var words = [];
    function walk(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement('span');
          w.className = 'sr-word';
          w.textContent = part;
          frag.appendChild(w);
          words.push(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && !node.classList.contains('sr-word')) {
        Array.prototype.slice.call(node.childNodes).forEach(walk);
      }
    }
    walk(el);
    return words;
  }

  function initSplitHeadings() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* hero h1 — plays once shortly after the loader clears */
    var heroH1 = document.querySelector('.hero-h1');
    if (heroH1) {
      var hw = splitWords(heroH1);
      if (hw.length) {
        gsap.from(hw, {
          yPercent: 105, opacity: 0, rotationX: -55,
          transformOrigin: 'center bottom',
          duration: 0.9, stagger: 0.055, ease: 'back.out(1.6)', delay: 0.15
        });
      }
    }

    /* section headings — cascade on scroll */
    gsap.utils.toArray('.sec-head h2, .gallery-back-title').forEach(function (h2) {
      var ws = splitWords(h2);
      if (!ws.length) return;
      gsap.from(ws, {
        scrollTrigger: { trigger: h2, start: 'top 90%', once: true },
        yPercent: 100, opacity: 0, rotationX: -45,
        transformOrigin: 'center bottom',
        duration: 0.75, stagger: 0.045, ease: 'back.out(1.5)'
      });
    });
  }

  /* —— 2. Scroll-velocity skew — showreel "speed" feel ——————————————————— */
  function initVelocitySkew() {
    if (typeof gsap === 'undefined') return;
    var targets = gsap.utils.toArray('.pf-masonry, .gallery-grid, .services-grid');
    if (!targets.length) return;

    var setters = targets.map(function (t) {
      return gsap.quickTo(t, 'skewY', { duration: 0.45, ease: 'power2.out' });
    });
    var lastY = window.scrollY, vel = 0;

    gsap.ticker.add(function () {
      var y = window.scrollY;
      vel = lerp(vel, clamp((y - lastY) * 0.06, -3.2, 3.2), 0.12);
      lastY = y;
      var v = Math.abs(vel) < 0.02 ? 0 : vel;
      setters.forEach(function (set) { set(v); });
    });
  }

  /* —— 3. Per-card image parallax (scrub) ————————————————————————————————— */
  function initImageParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.utils.toArray('.pf-card .pf-img').forEach(function (img) {
      gsap.set(img, { scale: 1.16 });
      gsap.fromTo(img,
        { yPercent: -7 },
        {
          yPercent: 7, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.pf-card') || img,
            start: 'top bottom', end: 'bottom top', scrub: 0.6
          }
        });
    });
  }

  /* —— 4. Hero exit scrub — page-transition feel on scroll ——————————————— */
  function initHeroScrub() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    /* target the layout container — mouse parallax animates its CHILDREN,
       so the two transforms compose instead of overwriting each other */
    var inner = hero.querySelector(':scope > .wrap, :scope > .hero-split');
    if (inner) {
      gsap.to(inner, {
        yPercent: -16, opacity: 0.05, scale: 0.94, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 28%', scrub: 0.5 }
      });
    }
    var stats = hero.querySelector('.hero-stats-anchor');
    if (stats) {
      gsap.to(stats, {
        yPercent: 30, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom 30%', scrub: 0.5 }
      });
    }
  }

  /* —— 5. Section drift — everything keeps moving while you scroll ————————— */
  function initSectionDrift() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.utils.toArray('main > section').forEach(function (sec) {
      if (sec.classList.contains('hero')) return;
      var wrap = sec.querySelector(':scope > .wrap') || sec.firstElementChild;
      if (!wrap) return;
      gsap.fromTo(wrap, { y: 46 }, {
        y: -34, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });

      /* beam divider sweeps in at top of each section */
      var beam = document.createElement('div');
      beam.className = 'sr-beam';
      sec.appendChild(beam);
      gsap.to(beam, {
        scaleX: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 78%', once: true }
      });
    });
  }

  /* —— 6. Velocity-reactive marquee strips ——————————————————————————————— */
  function buildMarquee(words) {
    var mq = document.createElement('div');
    mq.className = 'sr-marquee';
    var track = document.createElement('div');
    track.className = 'sr-marquee-track';
    var html = words.map(function (w, i) {
      var cls = i % 2 === 0 ? '' : ' class="sr-mq-solid"';
      return '<span' + cls + '>' + w + '</span><span class="sr-mq-dot">…</span>';
    }).join('');
    /* 4 copies so the loop never shows a gap on wide screens */
    for (var i = 0; i < 4; i++) {
      var item = document.createElement('div');
      item.className = 'sr-marquee-item';
      item.innerHTML = html;
      track.appendChild(item);
    }
    mq.appendChild(track);
    return mq;
  }

  function initMarquees() {
    if (REDUCED) return;
    var words = ['Festival Creatives', 'Travel Promotions', 'Lead Generation',
                 'Social Media Design', 'Branding', 'Visual Storytelling'];
    var spots = [];

    var work = document.getElementById('work');
    if (work && work.parentNode) spots.push({ ref: work, parent: work.parentNode });
    var contact = document.getElementById('contact') || document.querySelector('.connect, footer');
    if (!IS_GALLERY && contact && contact.parentNode && contact !== work) {
      spots.push({ ref: contact, parent: contact.parentNode });
    }
    if (IS_GALLERY) {
      var grid = document.querySelector('.gallery-grid');
      var bar = document.querySelector('.gallery-filter-bar');
      var anchor = bar || grid;
      if (anchor && anchor.parentNode) spots.push({ ref: anchor, parent: anchor.parentNode });
    }
    if (!spots.length) return;

    var tracks = [];
    spots.forEach(function (s) {
      var mq = buildMarquee(words);
      s.parent.insertBefore(mq, s.ref);
      tracks.push(mq.querySelector('.sr-marquee-track'));
    });

    /* drive with ticker so direction follows scroll */
    var pos = 0, lastY = window.scrollY, vel = 0;
    function frame() {
      var y = window.scrollY;
      vel = lerp(vel, (y - lastY), 0.1);
      lastY = y;
      pos -= 0.9 + clamp(vel * 0.12, -4, 4);
      tracks.forEach(function (t) {
        var w = t.scrollWidth / 4;
        if (!w) return;
        var x = ((pos % w) + w) % w;   /* always 0..w regardless of direction */
        t.style.transform = 'translateX(' + (-x) + 'px)';
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* —— 7. Cursor ring with VIEW label ————————————————————————————————————— */
  function initCursorRing() {
    if (TOUCH || REDUCED) return;
    var ring = document.createElement('div');
    ring.id = 'sr-cursor-ring';
    ring.className = 'sr-hidden';
    ring.innerHTML = '<span class="sr-cursor-label">VIEW</span>';
    document.body.appendChild(ring);

    var tx = -100, ty = -100, x = -100, y = -100, shown = false;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; ring.classList.remove('sr-hidden'); }
    });
    document.addEventListener('mouseleave', function () {
      shown = false; ring.classList.add('sr-hidden');
    });
    (function loop() {
      x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18);
      ring.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(loop);
    })();

    /* delegate hover states */
    document.addEventListener('mouseover', function (e) {
      var card = e.target.closest('.pf-card');
      var link = !card && e.target.closest('a, button, .btn, .chip');
      ring.classList.toggle('sr-view', !!card);
      ring.classList.toggle('sr-link', !!link);
    });
  }

  /* —— 8. Page-transition wipes between main page ↔ gallery —————————————— */
  function initPageWipes() {
    if (REDUCED) return;
    var wipe = document.createElement('div');
    wipe.id = 'sr-wipe';
    wipe.innerHTML = '<span class="sr-wipe-mark">PARAMASIVAN&nbsp;V</span>';
    document.body.appendChild(wipe);

    /* incoming reveal on gallery page (main page has its own loader) */
    if (IS_GALLERY) {
      wipe.style.clipPath = 'inset(0 0 0 0)';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wipe.style.clipPath = '';
          wipe.classList.add('sr-out');
          setTimeout(function () { wipe.classList.remove('sr-out'); }, 750);
        });
      });
    }

    /* outgoing wipe when navigating between the two pages */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href$="portfolio-gallery.html"], a[href$="Paramasivan-Portfolio.html"]');
      if (!a || e.metaKey || e.ctrlKey || a.target === '_blank') return;
      e.preventDefault();
      var href = a.getAttribute('href');
      wipe.classList.remove('sr-out');
      wipe.classList.add('sr-in');
      setTimeout(function () { location.href = href; }, 560);
    });

    /* bfcache restore — make sure the wipe is gone */
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) { wipe.classList.remove('sr-in', 'sr-out'); wipe.style.clipPath = ''; }
    });
  }

  /* —— 9. Gallery filter — staggered re-entry on category change ————————— */
  function initGalleryFilterStagger() {
    if (!IS_GALLERY || REDUCED) return;
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('.gallery-filter-bar .chip');
      if (!chip) return;
      setTimeout(function () {
        var cells = document.querySelectorAll('.gallery-grid .pf-cell, .gallery-grid > *');
        Array.prototype.forEach.call(cells, function (cell, i) {
          if (!cell.animate) return;
          cell.animate([
            { opacity: 0, transform: 'translateY(34px) scale(0.9) rotateX(10deg)' },
            { opacity: 1, transform: 'none' }
          ], {
            duration: 520,
            delay: Math.min(i * 45, 540),
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards'
          });
        });
      }, 60);
    });
  }

  /* —— 10. Portfolio card 3D tilt + magnetic pull + inner depth —————————— */
  function initShowreelTilt() {
    if (TOUCH || REDUCED) return;
    var bound = new WeakSet();

    function bind(card) {
      if (bound.has(card)) return;
      bound.add(card);
      var img = card.querySelector('.pf-img');

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 0.08s linear';
        card.style.transform =
          'perspective(950px)' +
          ' rotateY(' + (px * 13) + 'deg) rotateX(' + (-py * 13) + 'deg)' +
          ' translate3d(' + (px * 10) + 'px,' + (py * 8) + 'px, 14px)';
        if (img) {
          /* image counter-shifts for depth (combined with parallax scale) */
          img.style.translate = (-px * 14) + 'px ' + (-py * 10) + 'px';
        }
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
        card.style.transform = '';
        if (img) img.style.translate = '';
      });
    }

    function bindAll() {
      document.querySelectorAll('.pf-card').forEach(bind);
    }
    bindAll();

    /* cards render async (fetch + React) — watch for new ones */
    var mo = new MutationObserver(bindAll);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* —— 11. Refresh ScrollTrigger after late layout shifts ————————————————— */
  function initLateRefresh() {
    if (typeof ScrollTrigger === 'undefined') return;
    setTimeout(function () { ScrollTrigger.refresh(); }, 1200);
    window.addEventListener('load', function () {
      setTimeout(function () { ScrollTrigger.refresh(); }, 400);
    });
  }

  /* —— Boot ————————————————————————————————————————————————————————————————— */
  function waitForLibs(cb, tries) {
    tries = tries || 0;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      return cb();
    }
    if (tries > 40) return cb(); /* run what we can without GSAP */
    setTimeout(function () { waitForLibs(cb, tries + 1); }, 150);
  }

  function waitForContent(cb, tries) {
    tries = tries || 0;
    var ready = document.querySelector('.pf-card, .sec-head, .gallery-grid');
    if (ready || tries > 50) return cb();
    setTimeout(function () { waitForContent(cb, tries + 1); }, 200);
  }

  function boot() {
    /* immediate — independent of React */
    safe(initPageWipes);
    /* cursor ring removed */

    waitForLibs(function () {
      waitForContent(function () {
        /* give the loader animation room on the main page */
        var delay = IS_GALLERY ? 250 : 2750;
        setTimeout(function () {
          if (!REDUCED) {
            safe(initSplitHeadings);
            safe(initHeroScrub);
            safe(initSectionDrift);
            safe(initVelocitySkew);
            safe(initImageParallax);
            /* marquee removed */
            safe(initShowreelTilt);
            safe(initGalleryFilterStagger);
          }
          safe(initLateRefresh);
        }, delay);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
