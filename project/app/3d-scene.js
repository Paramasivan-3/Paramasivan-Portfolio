/* ==========================================================================
   3D Background — Orbital Constellation
   Deep starfield · orbital ring system · torus core · pulsing connections
   Completely different from the previous minimal globe style
   ========================================================================== */

(function () {
  'use strict';

  function init() {
    if (typeof THREE === 'undefined') return setTimeout(init, 100);

    var canvas = document.createElement('canvas');
    canvas.id  = 'three-bg';
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var W = window.innerWidth, H = window.innerHeight;
    var isMobile = W < 768;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(62, W / H, 0.1, 800);
    camera.position.z = 58;

    var CYAN  = 0x06B6D4;
    var CYAN2 = 0x22D3EE;
    var BLUE  = 0x1565C0;

    var root = new THREE.Group();
    scene.add(root);

    /* ════════════════════════════════════════════════════════════════════════
       1. DEEP STARFIELD  — static shell of tiny background stars
          Two layers at different depths for parallax illusion
       ════════════════════════════════════════════════════════════════════════ */
    function makeStarShell(count, radius, ptSize, opacity) {
      var pts = new Float32Array(count * 3);
      for (var i = 0; i < count; i++) {
        /* Fibonacci sphere distribution — uniform on sphere surface */
        var phi   = Math.acos(1 - 2 * (i + 0.5) / count);
        var theta = Math.PI * (1 + Math.sqrt(5)) * i;
        var r     = radius * (0.85 + Math.random() * 0.3);
        pts[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pts[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pts[i*3+2] = r * Math.cos(phi);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      return new THREE.Points(g,
        new THREE.PointsMaterial({ color: CYAN2, size: ptSize, transparent: true, opacity: opacity, sizeAttenuation: true }));
    }

    root.add(makeStarShell(isMobile ? 280 : 480,  200, 0.18, 0.22)); /* far layer  */
    root.add(makeStarShell(isMobile ? 120 : 200,   90, 0.28, 0.30)); /* near layer */

    /* ════════════════════════════════════════════════════════════════════════
       2. DRIFTING PARTICLE FIELD  — medium depth, gentle drift
       ════════════════════════════════════════════════════════════════════════ */
    var PN  = isMobile ? 100 : 180;
    var pPos = new Float32Array(PN * 3);
    var pVel = new Float32Array(PN * 3);
    for (var i = 0; i < PN; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 130;
      pPos[i*3+1] = (Math.random() - 0.5) * 80;
      pPos[i*3+2] = (Math.random() - 0.5) * 55;
      pVel[i*3]   = (Math.random() - 0.5) * 0.010;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.007;
      pVel[i*3+2] = (Math.random() - 0.5) * 0.005;
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    root.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: CYAN, size: 0.30, transparent: true, opacity: 0.40, sizeAttenuation: true })));

    /* ════════════════════════════════════════════════════════════════════════
       3. TORUS CORE  — the new centrepiece replacing the globe
          A spinning torus with inner rings — dynamic & sculptural
       ════════════════════════════════════════════════════════════════════════ */
    var torusGroup = new THREE.Group();
    torusGroup.position.set(26, 0, -12);
    root.add(torusGroup);

    /* outer torus ring */
    torusGroup.add(new THREE.Mesh(
      new THREE.TorusGeometry(14, 0.55, 12, 80),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.14 })
    ));

    /* inner torus ring (smaller, perpendicular) */
    var innerTorus = new THREE.Mesh(
      new THREE.TorusGeometry(9.5, 0.35, 10, 60),
      new THREE.MeshBasicMaterial({ color: CYAN2, transparent: true, opacity: 0.10 })
    );
    innerTorus.rotation.x = Math.PI / 2;
    torusGroup.add(innerTorus);

    /* wireframe icosahedron in the torus core */
    torusGroup.add(new THREE.Mesh(
      new THREE.IcosahedronGeometry(5.5, 1),
      new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.12 })
    ));

    /* ════════════════════════════════════════════════════════════════════════
       4. ORBITAL RING SYSTEM  — 3 tilted elliptical orbits with travelling nodes
          Each ring has 6 glowing nodes that orbit continuously
       ════════════════════════════════════════════════════════════════════════ */
    var NUM_ORBITS = 3;
    var NODES_PER  = isMobile ? 4 : 6;
    var ORBIT_CONFIGS = [
      { rx: 32, ry: 18, rz: 0,      tiltX: 0.3,  tiltZ: 0.15, speed: 0.18  },
      { rx: 26, ry: 14, rz: 0,      tiltX: -0.6, tiltZ: 0.4,  speed: -0.12 },
      { rx: 20, ry: 24, rz: 0,      tiltX: 1.1,  tiltZ: -0.3, speed: 0.09  },
    ];

    /* orbit path rings (faint torus-like paths) */
    var orbitGroups = [];
    ORBIT_CONFIGS.forEach(function (cfg) {
      var g = new THREE.Group();
      g.rotation.x = cfg.tiltX;
      g.rotation.z = cfg.tiltZ;
      root.add(g);

      /* path line (elliptical ring drawn as line segments) */
      var segs = 96;
      var lineVerts = new Float32Array((segs + 1) * 3);
      for (var s = 0; s <= segs; s++) {
        var a = (s / segs) * Math.PI * 2;
        lineVerts[s*3]   = Math.cos(a) * cfg.rx;
        lineVerts[s*3+1] = Math.sin(a) * cfg.ry;
        lineVerts[s*3+2] = 0;
      }
      var lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
      g.add(new THREE.Line(lineGeo,
        new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.06 })
      ));

      /* node positions (updated each frame) */
      var nodePts = new Float32Array(NODES_PER * 3);
      var nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePts, 3));
      g.add(new THREE.Points(nodeGeo,
        new THREE.PointsMaterial({ color: CYAN2, size: isMobile ? 1.8 : 2.4, transparent: true, opacity: 0.75, sizeAttenuation: true })
      ));

      orbitGroups.push({ cfg: cfg, nodeGeo: nodeGeo, nodePts: nodePts });
    });

    /* ════════════════════════════════════════════════════════════════════════
       5. DYNAMIC CONNECTIONS  — lines between nearby orbital nodes
          Flat in world-space, collected once per frame across all orbits
       ════════════════════════════════════════════════════════════════════════ */
    var MAX_CONN  = isMobile ? 40 : 80;
    var connVerts = new Float32Array(MAX_CONN * 6);
    var connGeo   = new THREE.BufferGeometry();
    connGeo.setAttribute('position', new THREE.BufferAttribute(connVerts, 3));
    root.add(new THREE.LineSegments(connGeo,
      new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.08 })));

    /* ════════════════════════════════════════════════════════════════════════
       6. FLOATING WIREFRAME ACCENTS  — 5 geometric shapes at edges
       ════════════════════════════════════════════════════════════════════════ */
    var accents = [];
    [
      { geo: new THREE.TetrahedronGeometry(3.8, 0),    x: -50, y:  18, z: -10, op: 0.10 },
      { geo: new THREE.OctahedronGeometry(4.2, 0),     x:  52, y: -18, z: -16, op: 0.09 },
      { geo: new THREE.IcosahedronGeometry(2.8, 0),    x: -22, y: -28, z:  -6, op: 0.08 },
      { geo: new THREE.TetrahedronGeometry(2.5, 0),    x:  14, y:  34, z: -18, op: 0.07 },
      { geo: new THREE.OctahedronGeometry(3.2, 0),     x: -36, y: -10, z:  -8, op: 0.08 },
    ].forEach(function (d) {
      var m = new THREE.Mesh(d.geo,
        new THREE.MeshBasicMaterial({ color: CYAN2, wireframe: true, transparent: true, opacity: d.op }));
      m.position.set(d.x, d.y, d.z);
      m.userData = {
        rx: (Math.random() - 0.5) * 0.006,
        ry: (Math.random() - 0.5) * 0.008,
        fy: d.y, fa: 1.4 + Math.random() * 1.0,
        fs: 0.18 + Math.random() * 0.14, fo: Math.random() * Math.PI * 2
      };
      root.add(m);
      accents.push(m);
    });

    /* ════════════════════════════════════════════════════════════════════════
       7. MOUSE + RESIZE
       ════════════════════════════════════════════════════════════════════════ */
    var mx = 0, my = 0, scrollY = 0;
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / W - 0.5) * 2;
      my = (e.clientY / H - 0.5) * 2;
    });
    window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('resize', function () {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });

    /* ════════════════════════════════════════════════════════════════════════
       ANIMATION LOOP
       ════════════════════════════════════════════════════════════════════════ */
    var clock = new THREE.Clock();
    /* world-space node positions for connection calculation */
    var worldNodes = [];

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      /* drift particles */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < PN; j++) {
        pa[j*3]   += pVel[j*3];
        pa[j*3+1] += pVel[j*3+1];
        pa[j*3+2] += pVel[j*3+2];
        if (Math.abs(pa[j*3])   > 65) pVel[j*3]   *= -1;
        if (Math.abs(pa[j*3+1]) > 40) pVel[j*3+1] *= -1;
        if (Math.abs(pa[j*3+2]) > 27) pVel[j*3+2] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      /* torus core rotation (different axes for interest) */
      torusGroup.rotation.y  = t * 0.08;
      torusGroup.rotation.x  = t * 0.04;
      innerTorus.rotation.y  = t * 0.12;

      /* update orbital node positions + collect world coords */
      worldNodes.length = 0;
      orbitGroups.forEach(function (ob) {
        var cfg = ob.cfg;
        var pts = ob.nodePts;
        for (var n = 0; n < NODES_PER; n++) {
          var angle = (n / NODES_PER) * Math.PI * 2 + t * cfg.speed;
          var lx = Math.cos(angle) * cfg.rx;
          var ly = Math.sin(angle) * cfg.ry;
          pts[n*3]   = lx;
          pts[n*3+1] = ly;
          pts[n*3+2] = 0;
          /* approximate world position (simplified, ignores group tilt) */
          worldNodes.push(lx, ly, 0);
        }
        ob.nodeGeo.attributes.position.needsUpdate = true;
      });

      /* dynamic connections between close world-space nodes */
      var cv  = connGeo.attributes.position.array;
      var cnt = 0;
      var NWN = worldNodes.length / 3;
      for (var a = 0; a < NWN && cnt < MAX_CONN; a++) {
        for (var b = a + 1; b < NWN && cnt < MAX_CONN; b++) {
          var dx = worldNodes[a*3]   - worldNodes[b*3];
          var dy = worldNodes[a*3+1] - worldNodes[b*3+1];
          var dz = worldNodes[a*3+2] - worldNodes[b*3+2];
          if (dx*dx + dy*dy + dz*dz < 500) {
            cv[cnt*6]   = worldNodes[a*3];   cv[cnt*6+1] = worldNodes[a*3+1]; cv[cnt*6+2] = worldNodes[a*3+2];
            cv[cnt*6+3] = worldNodes[b*3];   cv[cnt*6+4] = worldNodes[b*3+1]; cv[cnt*6+5] = worldNodes[b*3+2];
            cnt++;
          }
        }
      }
      for (var k = cnt * 6; k < MAX_CONN * 6; k++) cv[k] = 0;
      connGeo.attributes.position.needsUpdate = true;
      connGeo.setDrawRange(0, cnt * 2);

      /* floating accents */
      accents.forEach(function (m) {
        var d = m.userData;
        m.rotation.x += d.rx;
        m.rotation.y += d.ry;
        m.position.y  = d.fy + Math.sin(t * d.fs + d.fo) * d.fa;
      });

      /* slow camera orbit — signature of new style */
      var orbit = t * 0.028;
      root.rotation.y = Math.sin(orbit) * 0.22 + (mx * 0.032);
      root.rotation.x = Math.sin(orbit * 0.7) * 0.10 + (-my * 0.018);

      /* camera breathing + scroll pull-back */
      camera.position.x += (mx * 4.0 - camera.position.x) * 0.010;
      camera.position.y += (-my * 2.8 - camera.position.y) * 0.010;
      camera.position.z  = 58 + Math.sin(t * 0.11) * 2.5 - scrollY * 0.005;

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
