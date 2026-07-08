(function () {
  function runHomeDots() {
    var body = document.body;
    if (!body || !body.classList || !body.classList.contains('page-home')) return;

    var oldCanvas = document.getElementById('home-art-canvas');
    if (oldCanvas && oldCanvas.parentNode) oldCanvas.parentNode.removeChild(oldCanvas);
    var oldFallback = document.getElementById('home-dots-background');
    if (oldFallback && oldFallback.parentNode) oldFallback.parentNode.removeChild(oldFallback);

    var SCALE = 200;
    var LENGTH = 5;
    var SPACING = 15;
    var FRAME_INTERVAL = 1000 / 60;
    var DOT_COLOR = '#cccccc';
    var reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.id = 'home-art-canvas';
    canvas.setAttribute('data-art', 'dots');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.display = 'block';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.maxWidth = 'none';
    canvas.style.maxHeight = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.border = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    body.insertBefore(canvas, body.firstChild);

    var width = 0;
    var height = 0;
    var points = [];
    var raf = 0;
    var last = 0;
    var noise3d = createSimplex3D();

    function createSimplex3D() {
      var grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
      ];
      var p = [];
      for (var i = 0; i < 256; i += 1) p[i] = i;
      for (var j = 255; j > 0; j -= 1) {
        var r = Math.floor(Math.random() * (j + 1));
        var tmp = p[j];
        p[j] = p[r];
        p[r] = tmp;
      }
      var perm = [];
      for (var k = 0; k < 512; k += 1) perm[k] = p[k & 255];
      var F3 = 1 / 3;
      var G3 = 1 / 6;

      function dot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
      }

      return function noise(xin, yin, zin) {
        var n0 = 0;
        var n1 = 0;
        var n2 = 0;
        var n3 = 0;
        var s = (xin + yin + zin) * F3;
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t;
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0;
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        var i1, j1, k1;
        var i2, j2, k2;

        if (x0 >= y0) {
          if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
          else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
          else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
        } else {
          if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
          else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
          else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        }

        var x1 = x0 - i1 + G3;
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2 * G3;
        var y2 = y0 - j2 + 2 * G3;
        var z2 = z0 - k2 + 2 * G3;
        var x3 = x0 - 1 + 3 * G3;
        var y3 = y0 - 1 + 3 * G3;
        var z3 = z0 - 1 + 3 * G3;
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
        var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
        var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
        var gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * dot(grad3[gi0], x0, y0, z0); }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * dot(grad3[gi1], x1, y1, z1); }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * dot(grad3[gi2], x2, y2, z2); }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 > 0) { t3 *= t3; n3 = t3 * t3 * dot(grad3[gi3], x3, y3, z3); }
        return 32 * (n0 + n1 + n2 + n3);
      };
    }

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      width = window.innerWidth || document.documentElement.clientWidth || 0;
      height = window.innerHeight || document.documentElement.clientHeight || 0;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      for (var x = -SPACING / 2; x < width + SPACING; x += SPACING) {
        for (var y = -SPACING / 2; y < height + SPACING; y += SPACING) {
          points.push({ x: x, y: y, opacity: Math.random() * 0.5 + 0.5 });
        }
      }
    }

    function draw(now) {
      if (typeof now !== 'number') now = performance.now();
      if (!reducedMotion.matches && now - last < FRAME_INTERVAL) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = DOT_COLOR;
      var t = reducedMotion.matches ? 0 : Date.now() / 10000;
      for (var i = 0; i < points.length; i += 1) {
        var p = points[i];
        var rad = (noise3d(p.x / SCALE, p.y / SCALE, t) - 0.5) * 2 * Math.PI;
        var len = (noise3d(p.x / SCALE, p.y / SCALE, t * 2) + 0.5) * LENGTH;
        var nx = p.x + Math.cos(rad) * len;
        var ny = p.y + Math.sin(rad) * len;
        ctx.globalAlpha = (Math.abs(Math.cos(rad)) * 0.8 + 0.2) * p.opacity;
        ctx.beginPath();
        ctx.arc(nx, ny, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reducedMotion.matches) raf = requestAnimationFrame(draw);
    }

    var timer = 0;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (raf) cancelAnimationFrame(raf);
        resize();
        draw();
      }, 180);
    });

    resize();
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runHomeDots);
  else runHomeDots();
})();
