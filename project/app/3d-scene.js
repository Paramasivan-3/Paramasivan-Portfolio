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

    /* ── Wire material factory ───────────────────────────────────────────── */
    function wMat(col, opacity) {
      return new THREE.MeshBasicMaterial({
        color: col || GOLD, wireframe: true, transparent: true, opacity: opacity || 0.09
      });
    }

    /* ── Floating wireframe geometries ───────────────────────────────────── */
    var geoData = [
      { geo: new THREE.IcosahedronGeometry(7, 1),        x:  30,  y:  12, z: -20, rx: 0.003, ry: 0.005, rz: 0.001, op: 0.10, col: GOLD        },
      { geo: new THREE.TorusKnotGeometry(4, 1, 80, 10),  x: -28,  y:  -8, z: -16, rx: 0.004, ry: 0.003, rz: 0.002, op: 0.09, col: GOLD        },
      { geo: new THREE.OctahedronGeometry(4.5),           x: -18,  y:  20, z:  -9, rx: 0.007, ry: 0.005, rz: 0.003, op: 0.14, col: GOLD_BRIGHT },
      { geo: new THREE.TetrahedronGeometry(3.5),          x:  22,  y: -18, z:  -8, rx: 0.005, ry: 0.008, rz: 0.002, op: 0.12, col: GOLD        },
      { geo: new THREE.IcosahedronGeometry(2.8, 0),       x:   8,  y: -26, z:  -5, rx: 0.006, ry: 0.004, rz: 0.004, op: 0.11, col: GOLD_BRIGHT },
      { geo: new THREE.TorusGeometry(5, 1.2, 8, 24),      x: -34,  y:  16, z: -22, rx: 0.002, ry: 0.006, rz: 0.001, op: 0.08, col: GOLD        },
      { geo: new THREE.DodecahedronGeometry(3.5),          x:  16,  y:  28, z: -18, rx: 0.004, ry: 0.006, rz: 0.002, op: 0.08, col: GOLD_DEEP  },
      { geo: new THREE.ConeGeometry(3, 7, 6),              x: -12,  y: -30, z: -12, rx: 0.005, ry: 0.004, rz: 0.003, op: 0.09, col: GOLD        },
      { geo: new THREE.OctahedronGeometry(2.2),            x:  36,  y:  -4, z: -10, rx: 0.008, ry: 0.006, rz: 0.005, op: 0.10, col: GOLD_BRIGHT },
    ];

    var meshes = geoData.map(function (d) {
      var m = new THREE.Mesh(d.geo, wMat(d.col, d.op));
      m.position.set(d.x, d.y, d.z);
      scene.add(m);
      return { mesh: m, rx: d.rx, ry: d.ry, rz: d.rz };
    });

    /* ── Large orbital ring (always visible background) ──────────────────── */
    var outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(28, 0.45, 4, 90),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.055 })
    );
    outerRing.rotation.x = 1.1;
    outerRing.rotation.z = 0.3;
    scene.add(outerRing);

    var innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(16, 0.28, 4, 70),
      new THREE.MeshBasicMaterial({ color: GOLD_BRIGHT, transparent: true, opacity: 0.045 })
    );
    innerRing.rotation.x = -0.6;
    innerRing.rotation.y = 0.4;
    scene.add(innerRing);

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

      /* rotate wireframe shapes */
      meshes.forEach(function (d) {
        d.mesh.rotation.x += d.rx;
        d.mesh.rotation.y += d.ry;
        d.mesh.rotation.z += d.rz;
      });

      /* rotate orbital rings */
      outerRing.rotation.z += 0.0014;
      outerRing.rotation.y += 0.0006;
      innerRing.rotation.z -= 0.0018;
      innerRing.rotation.x += 0.0004;

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
