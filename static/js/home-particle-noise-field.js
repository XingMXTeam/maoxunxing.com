(function () {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

  if (!body) return;

  const path = window.location.pathname.replace(/\/+$/, '');
  const isHome = path === '' || path === '/zh-cn' || path === '/en';
  if (!isHome) return;

  function removeOldParticleCanvases() {
    document.querySelectorAll('.home-particles-canvas').forEach((node) => node.remove());
  }

  function init() {
    removeOldParticleCanvases();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.className = 'home-particles-canvas home-particles-noise-field';
    canvas.setAttribute('aria-hidden', 'true');
    body.appendChild(canvas);

    const scene = {
      canvas,
      ctx,
      width: 0,
      height: 0,
      dpr: 1,
      particles: [],
      frame: 0,
      reduced: reducedMotion.matches,
    };

    const resize = () => {
      scene.width = window.innerWidth;
      scene.height = window.innerHeight;
      scene.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(scene.width * scene.dpr);
      canvas.height = Math.round(scene.height * scene.dpr);
      canvas.style.width = `${scene.width}px`;
      canvas.style.height = `${scene.height}px`;
      ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      scene.particles = buildParticles(scene.width, scene.height);
      draw(scene, performance.now());
    };

    const tick = (time) => {
      draw(scene, time);
      if (scene.reduced) {
        scene.frame = 0;
        return;
      }
      scene.frame = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize, { passive: true });

    const onReducedMotionChange = (event) => {
      scene.reduced = event.matches;
      draw(scene, performance.now());
      if (!scene.reduced && !scene.frame) {
        scene.frame = requestAnimationFrame(tick);
      }
    };

    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener('change', onReducedMotionChange);
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(onReducedMotionChange);
    }

    resize();
    if (!scene.reduced) {
      scene.frame = requestAnimationFrame(tick);
    }
  }

  function buildParticles(width, height) {
    const particles = [];
    const spacing = width < 768 ? 26 : 20;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = -1; row < rows; row += 1) {
      for (let col = -1; col < cols; col += 1) {
        const seed = seededRandom(row * 928371 + col * 364479);
        const depth = 0.72 + seededRandom(row * 73471 + col * 91873 + 7) * 0.58;
        particles.push({
          x: col * spacing + spacing / 2,
          y: row * spacing + spacing / 2,
          radius: 0.55 + depth * 0.34,
          alpha: 0.42 + seed * 0.5,
          depth,
        });
      }
    }

    return particles;
  }

  function draw(scene, timestamp) {
    const { ctx, width, height, particles } = scene;
    const time = timestamp / 10000;
    const colors = getColors();
    const scale = width < 768 ? 150 : 200;
    const length = scene.reduced ? 0 : width < 768 ? 3.4 : 4.8;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      const angle = (noise3(particle.x / scale, particle.y / scale, time) - 0.5) * Math.PI * 2;
      const offset = (noise3(particle.x / scale + 18.3, particle.y / scale - 7.1, time * 2) + 0.5) * length;
      const x = particle.x + Math.cos(angle) * offset;
      const y = particle.y + Math.sin(angle) * offset;

      if (x < -8 || x > width + 8 || y < -8 || y > height + 8) return;

      const alphaWave = Math.abs(Math.cos(angle)) * 0.8 + 0.2;
      ctx.globalAlpha = alphaWave * particle.alpha * colors.opacity;
      ctx.fillStyle = particle.depth > 1.02 ? colors.strong : particle.depth > 0.88 ? colors.mid : colors.soft;
      ctx.beginPath();
      ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function getColors() {
    const isDark = body.classList.contains('colorscheme-dark') ||
      (body.classList.contains('colorscheme-auto') && darkMode.matches);

    if (isDark) {
      return {
        strong: 'rgba(255, 255, 255, 0.78)',
        mid: 'rgba(100, 181, 246, 0.56)',
        soft: 'rgba(255, 255, 255, 0.38)',
        opacity: 0.66,
      };
    }

    return {
      strong: 'rgba(15, 23, 42, 0.26)',
      mid: 'rgba(21, 101, 192, 0.24)',
      soft: 'rgba(15, 23, 42, 0.16)',
      opacity: 0.56,
    };
  }

  function noise3(x, y, z) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;
    const u = smooth(xf);
    const v = smooth(yf);
    const w = smooth(zf);

    const x00 = lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), u);
    const x10 = lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u);
    const x01 = lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u);
    const x11 = lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u);
    const y0 = lerp(x00, x10, v);
    const y1 = lerp(x01, x11, v);
    return lerp(y0, y1, w);
  }

  function hash(x, y, z) {
    return seededRandom(x * 127.1 + y * 311.7 + z * 74.7);
  }

  function seededRandom(value) {
    const n = Math.sin(value * 12.9898) * 43758.5453;
    return n - Math.floor(n);
  }

  function smooth(value) {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  requestAnimationFrame(init);
})();
