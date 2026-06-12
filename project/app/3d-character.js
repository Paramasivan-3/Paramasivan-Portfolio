/* ==========================================================================
   Character 360° Turntable — canvas 2D
   Tries assets/Parama 3D turntable.png (4 panels) first.
   Falls back to assets/Parama 3D.png (single view squish rotation).
   ========================================================================== */

(function () {
  'use strict';

  window.initCharacter3D = function (canvas) {

    var TURNTABLE_SRC = 'assets/Parama 3D turntable.png';
    var SINGLE_SRC    = 'assets/Parama 3D.png';
    var NUM_PANELS    = 4;   /* turntable mode only */
    var STEP          = 360 / NUM_PANELS;

    var ctx  = canvas.getContext('2d');
    var W = 1, H = 1, dpr = 1;
    var mode = 'loading';   /* 'turntable' | 'single' | 'loading' */

    /* Off-screen canvas for crossfade compositing */
    var offC = document.createElement('canvas');
    var offX = offC.getContext('2d');

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      W   = canvas.clientWidth  || 460;
      H   = canvas.clientHeight || 600;
      var pw = Math.round(W * dpr);
      var ph = Math.round(H * dpr);
      canvas.width = pw;  canvas.height = ph;
      offC.width   = pw;  offC.height   = ph;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offX.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    /* ── Image loading with fallback ─────────────────────────────────────── */
    var img = new Image();

    img.onload = function () {
      mode = (img.src.indexOf('turntable') !== -1) ? 'turntable' : 'single';
      if (!raf) raf = requestAnimationFrame(draw);
    };
    img.onerror = function () {
      if (img.src.indexOf('turntable') !== -1) {
        /* turntable not found → fall back to single PNG */
        img = new Image();
        img.onload  = function () { mode = 'single'; if (!raf) raf = requestAnimationFrame(draw); };
        img.onerror = function () {
          ctx.font = '13px monospace';
          ctx.fillStyle = 'rgba(6,182,212,0.7)';
          ctx.textAlign = 'center';
          ctx.fillText('Place image at: assets/Parama 3D.png', W/2, H/2);
        };
        img.src = SINGLE_SRC;
      }
    };
    img.src = TURNTABLE_SRC;

    /* ── Rotation state ──────────────────────────────────────────────────── */
    var angle    = 0;
    var BASE_SPD = 0.007;
    var curSpeed = BASE_SPD;
    var tgtSpeed = BASE_SPD;

    canvas.addEventListener('mouseenter', function () { tgtSpeed = BASE_SPD * 3.0; });
    canvas.addEventListener('mouseleave', function () { tgtSpeed = BASE_SPD; });

    var dragging = false, dragX0 = 0, dragA0 = 0;
    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', function (e) {
      dragging = true; dragX0 = e.clientX; dragA0 = angle;
      canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      if (canvas.style) canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      angle = dragA0 - (e.clientX - dragX0) * 0.016;
    });
    var tx0 = 0, ta0 = 0;
    canvas.addEventListener('touchstart', function (e) {
      tx0 = e.touches[0].clientX; ta0 = angle;
    }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      angle = ta0 - (e.touches[0].clientX - tx0) * 0.016;
    }, { passive: true });

    /* ── Helpers ─────────────────────────────────────────────────────────── */
    function smoothStep(t) { return t * t * (3 - 2 * t); }

    function getBlend(deg) {
      deg = ((deg % 360) + 360) % 360;
      var i = Math.floor(deg / STEP) % NUM_PANELS;
      var j = (i + 1) % NUM_PANELS;
      return { p0: i, p1: j, t: smoothStep((deg - i * STEP) / STEP) };
    }

    function drawPanel(panelIdx, dx, dy, dw, dh, alpha) {
      if (alpha <= 0.01) return;
      var pW = img.naturalWidth / NUM_PANELS;
      var pH = img.naturalHeight;
      offX.save();
      offX.globalAlpha = alpha;
      offX.drawImage(img, panelIdx * pW, 0, pW, pH, dx, dy, dw, dh);
      offX.restore();
    }

    /* ── Render loop ─────────────────────────────────────────────────────── */
    var clock = 0, lastTs = 0, raf = null;

    function draw(ts) {
      raf    = requestAnimationFrame(draw);
      var dt = Math.min((ts - (lastTs || ts)) / 1000, 0.05);
      lastTs = ts;
      clock += dt;

      if (!dragging) {
        curSpeed += (tgtSpeed - curSpeed) * 0.06;
        angle    += curSpeed;
      }

      ctx.clearRect(0, 0, W, H);
      offX.clearRect(0, 0, W, H);

      if (!img.complete || !img.naturalWidth || mode === 'loading') return;

      var breathe = Math.sin(clock * 0.95) * 6;

      /* ── TURNTABLE MODE: sprite-sheet crossfade ── */
      if (mode === 'turntable') {
        var nW = img.naturalWidth / NUM_PANELS;
        var nH = img.naturalHeight;
        var scale = (H / nH) * 0.92;
        var fw = nW * scale;
        var fh = nH * scale;
        var dy = (H - fh) / 2 + breathe;

        var angDeg  = ((angle * 180 / Math.PI) % 360 + 360) % 360;
        var b       = getBlend(angDeg);
        var midDist = 1 - Math.abs(b.t * 2 - 1);
        var curW    = fw * (1 - midDist * 0.10);
        var dx      = (W - curW) / 2;

        /* Ground shadow */
        var sg = ctx.createRadialGradient(W/2, dy+fh*0.97, 0, W/2, dy+fh*0.97, curW*0.50);
        sg.addColorStop(0, 'rgba(15,23,42,0.55)');
        sg.addColorStop(1, 'rgba(15,23,42,0)');
        ctx.beginPath();
        ctx.ellipse(W/2, dy+fh*0.982, curW*0.46, curW*0.46*0.22, 0, 0, Math.PI*2);
        ctx.fillStyle = sg;
        ctx.fill();

        /* Crossfade panels */
        drawPanel(b.p0, dx, dy, curW, fh, 1 - b.t);
        drawPanel(b.p1, dx, dy, curW, fh, b.t);
        ctx.drawImage(offC, 0, 0, Math.round(W * dpr), Math.round(H * dpr), 0, 0, W, H);

        drawRings(W/2, dy + fh * 0.978, curW, clock);

      /* ── SINGLE MODE: perspective squish rotation ── */
      } else {
        var nW2 = img.naturalWidth;
        var nH2 = img.naturalHeight;
        var scale2 = (H / nH2) * 0.92;
        var fw2 = nW2 * scale2;
        var fh2 = nH2 * scale2;
        var dy2 = (H - fh2) / 2 + breathe;

        var cosA   = Math.cos(angle);
        var absC   = Math.abs(cosA);
        var curW2  = fw2 * absC;
        var dx2    = (W - curW2) / 2;

        /* Ground shadow */
        var sg2 = ctx.createRadialGradient(W/2, dy2+fh2*0.97, 0, W/2, dy2+fh2*0.97, fw2*0.45*absC+fw2*0.05);
        sg2.addColorStop(0, 'rgba(15,23,42,0.45)');
        sg2.addColorStop(1, 'rgba(15,23,42,0)');
        ctx.beginPath();
        ctx.ellipse(W/2, dy2+fh2*0.98, fw2*0.42*absC+fw2*0.05, (fw2*0.42*absC+fw2*0.05)*0.22, 0, 0, Math.PI*2);
        ctx.fillStyle = sg2;
        ctx.fill();

        /* Front / back face */
        ctx.save();
        if (cosA >= 0) {
          ctx.shadowColor = 'rgba(6,182,212,0.30)';
          ctx.shadowBlur  = 28;
          ctx.drawImage(img, dx2, dy2, curW2, fh2);
        } else {
          ctx.filter = 'brightness(0.30) saturate(0.25)';
          ctx.translate(dx2 + curW2, dy2);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, 0, curW2, fh2);
        }
        ctx.restore();

        drawRings(W/2, dy2 + fh2 * 0.978, fw2 * absC, clock);
      }

      /* Vignette */
      var vig = ctx.createRadialGradient(W/2, H*0.42, W*0.18, W/2, H*0.42, W*0.85);
      vig.addColorStop(0, 'rgba(15,23,42,0)');
      vig.addColorStop(1, 'rgba(15,23,42,0.52)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      /* Cyan top rim light */
      var rim = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, W*0.75);
      rim.addColorStop(0,   'rgba(6,182,212,0.18)');
      rim.addColorStop(0.5, 'rgba(6,182,212,0.06)');
      rim.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, W, H*0.55);
    }

    function drawRings(cx, cy, rw, clk) {
      var pulse = 1 + Math.sin(clk * 2.2) * 0.16;
      var rRX   = Math.max(rw * 0.045, rw * 0.42);
      var rRY   = rRX * 0.18;

      /* Outer cyan ring */
      ctx.save();
      ctx.globalAlpha = 0.78 * pulse;
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth   = 2.8;
      ctx.shadowColor = '#0891B2';
      ctx.shadowBlur  = 22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rRX, rRY, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();

      /* Inner teal ring */
      ctx.save();
      ctx.globalAlpha = 0.55 * pulse;
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth   = 2.0;
      ctx.shadowColor = '#0EA5E9';
      ctx.shadowBlur  = 14;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rRX*0.70, rRY*0.70, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();

      /* Ring ground glow */
      var gGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rRX*1.3);
      gGrad.addColorStop(0, 'rgba(6,182,212,' + (0.18*pulse) + ')');
      gGrad.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rRX*1.3, rRY*2.8, 0, 0, Math.PI*2);
      ctx.fill();
    }

    /* ── Resize observer ─────────────────────────────────────────────────── */
    var ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return function cleanup() {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  };

})();
