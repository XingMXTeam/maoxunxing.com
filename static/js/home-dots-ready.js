(function () {
  function run() {
    var body = document.body;
    if (!body || !body.classList || !body.classList.contains('page-home')) return;
    if (document.getElementById('home-art-canvas')) return;

    var oldDots = document.getElementById('home-dots-background');
    if (oldDots && oldDots.parentNode) oldDots.parentNode.removeChild(oldDots);

    var scale = 200;
    var length = 5;
    var spacing = 15;
    var frameInterval = 1000 / 30;
    var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
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

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function fract(n) { return n - Math.floor(n); }
    function hash(x, y, z) { return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123); }
    function noise(x, y, z) {
      var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      var xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
      var x00 = lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), xf);
      var x10 = lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), xf);
      var x01 = lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), xf);
      var x11 = lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), xf);
      return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf);
    }
    function force(x, y, z) { return (noise(x / scale, y / scale, z) - 0.5) * 2 * Math.PI; }

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
      for (var x = -spacing / 2; x < width + spacing; x += spacing) {
        for (var y = -spacing / 2; y < height + spacing; y += spacing) {
          points.push({ x: x, y: y, opacity: Math.random() * 0.5 + 0.5 });
        }
      }
    }

    function draw(now) {
      if (typeof now !== 'number') now = performance.now();
      if (!reduce.matches && now - last < frameInterval) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#cccccc';
      var t = reduce.matches ? 0 : now / 10000;
      for (var i = 0; i < points.length; i += 1) {
        var p = points[i];
        var r = force(p.x, p.y, t);
        var len = (noise(p.x / scale, p.y / scale, t * 2) + 0.5) * length;
        ctx.globalAlpha = (Math.abs(Math.cos(r)) * 0.8 + 0.2) * p.opacity;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(r) * len, p.y + Math.sin(r) * len, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce.matches) raf = requestAnimationFrame(draw);
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
