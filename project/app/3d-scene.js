/* ==========================================================================
   3D Background Scene — Three.js
   Gold particle field + floating wireframe geometries + large orbital ring
   ========================================================================== */

(function () {
  'use strict';

  function init() {
    if (typeof THREE === 'undefined') {
      return setTimeout(init, 100);
    }

    /* ── Canvas ──────────────────────────────────────────────────────────── */
    var canvas = document.createElement('canvas');
    canvas.id = 'three-bg';
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    /* ── Renderer / Scene / Camera ───────────────────────────────────────── */
    var W = window.innerWidth, H = window.innerHeight;
    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 55;

    var GOLD        = 0x06B6D4;
    var GOLD_BRIGHT = 0x22D3EE;
    var GOLD_DEEP   = 0x0891B2;

    /* ── Particle field ──────────────────────────────────────────────────── */
    var N = window.innerWidth < 768 ? 130 : 280;
    var pos = new Float32Array(N * 3);
    var vel = new Float32Array(N * 3);

    for (var i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 155;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 105;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 55;
      vel[i * 3]     = (Math.random() - 0.5) * 0.038;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.030;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.016;
    }

    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.34, transparent: true, opacity: 0.55, sizeAttenuation: true
    });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    var meshes = [];

    /* ── Line connections between nearby particles ───────────────────────── */
    var lineGeo   = new THREE.BufferGeometry();
    var lineVerts = new Float32Array(N * N * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
    var lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.07 })
    );
    scene.add(lineMat);

    /* ── Mouse & scroll state ────────────────────────────────────────────── */
    var mx = 0, my = 0;
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Resize handler ──────────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });

    /* ── Animation loop ──────────────────────────────────────────────────── */
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      /* update particle positions & wrap */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < N; j++) {
        pa[j*3]     += vel[j*3];
        pa[j*3 + 1] += vel[j*3 + 1];
        pa[j*3 + 2] += vel[j*3 + 2];
        if (Math.abs(pa[j*3])     > 77) vel[j*3]     *= -1;
        if (Math.abs(pa[j*3 + 1]) > 52) vel[j*3 + 1] *= -1;
        if (Math.abs(pa[j*3 + 2]) > 27) vel[j*3 + 2] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      /* update line connections (max 300 segments for perf) */
      var lv = lineGeo.attributes.position.array;
      var count = 0, maxLines = 300;
      for (var a = 0; a < N && count < maxLines; a++) {
        for (var b = a + 1; b < N && count < maxLines; b++) {
          var dx = pa[a*3] - pa[b*3];
          var dy = pa[a*3+1] - pa[b*3+1];
          var dz = pa[a*3+2] - pa[b*3+2];
          if (dx*dx + dy*dy + dz*dz < 420) {
            var base = count * 6;
            lv[base]   = pa[a*3];   lv[base+1] = pa[a*3+1]; lv[base+2] = pa[a*3+2];
            lv[base+3] = pa[b*3];   lv[base+4] = pa[b*3+1]; lv[base+5] = pa[b*3+2];
            count++;
          }
        }
      }
      for (var k = count * 6; k < lineVerts.length; k++) lv[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, count * 2);

      /* slow global rotation on particle cloud */
      points.rotation.y = t * 0.013;
      points.rotation.x = t * 0.007;

      /* smooth camera parallax from mouse */
      camera.position.x += (mx * 7 - camera.position.x) * 0.018;
      camera.position.y += (-my * 5 - camera.position.y) * 0.018;
      /* subtle camera breathing */
      camera.position.z = 55 + Math.sin(t * 0.28) * 2.2;

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
