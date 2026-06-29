(function () {
  var SCALE = 200;
  var LENGTH = 5;
  var SPACING = 15;
  var DOT_COLOR = '#cccccc';
  var FRAME_INTERVAL = 1000 / 30;

  var body = document.body;
  if (!body || !body.classList || !body.classList.contains('page-home')) return;
  if (document.getElementById('home-art-canvas')) return;

  var reducedMotionMediaQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.id = 'home-art-canvas';
  canvas.setAttribute('data-art', 'dots');
  canvas.setAttribute('aria-hidden', 'true');
  applyCanvasStyle(canvas);
  body.insertBefore(canvas, body.firstChild);

  var width = 0;
  var height = 0;
  var points = [];
  var animationFrame = 0;
  var lastFrame = 0;

  function applyCanvasStyle(target) {
    target.style.position = 'fixed';
    target.style.inset = '0';
    target.style.display = 'block';
    target.style.width = '100vw';
    target.style.height = '100vh';
    target.style.maxWidth = 'none';
    target.style.maxHeight = 'none';
    target.style.margin = '0';
    target.style.padding = '0';
    target.style.border = '0';
    target.style.pointerEvents = 'none';
    target.style.zIndex = '0';
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fract(n) {
    return n - Math.floor(n);
  }

  function hash3(x, y, z) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
  }

  // Continuous 3D value noise. This gives antfu-like smooth dot movement
  // without bundling pixi.js/simplex-noise into the Hugo build.
  function valueNoise3D(x, y, z) {
    var xi = Math.floor(x);
    var yi = Math.floor(y);
    var zi = Math.floor(z);
    var xf = fade(x - xi);
    var yf = fade(y - yi);
    var zf = fade(z - zi);

    var x00 = lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf);
    var x10 = lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf);
    var x01 = lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf);
    var x11 = lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf);
    var y0 = lerp(x00, x10, yf);
    var y1 = lerp(x01, x11, yf);
    return lerp(y0, y1, zf);
  }

  function getForceOnPoint(x, y, z) {
    return (valueNoise3D(x / SCALE, y / SCALE, z) - 0.5) * 2 * Math.PI;
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
        points.push({
          x: x,
          y: y,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    }
  }

  function draw(now) {
    if (typeof now !== 'number') now = performance.now();

    if (!reducedMotionMediaQuery.matches && now - lastFrame < FRAME_INTERVAL) {
      animationFrame = requestAnimationFrame(draw);
      return;
    }

    lastFrame = now;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = DOT_COLOR;

    var t = reducedMotionMediaQuery.matches ? 0 : now / 10000;
    for (var i = 0; i < points.length; i += 1) {
      var point = points[i];
      var rad = getForceOnPoint(point.x, point.y, t);
      var lenNoise = valueNoise3D(point.x / SCALE, point.y / SCALE, t * 2);
      var len = (lenNoise + 0.5) * LENGTH;
      var nx = point.x + Math.cos(rad) * len;
      var ny = point.y + Math.sin(rad) * len;
      var alpha = (Math.abs(Math.cos(rad)) * 0.8 + 0.2) * point.opacity;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(nx, ny, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    if (!reducedMotionMediaQuery.matches) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  function debounce(fn, wait) {
    var timer = 0;
    return function debounced() {
      var args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  resize();
  draw();
  window.addEventListener('resize', debounce(function () {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    resize();
    draw();
  }, 180));
})();
