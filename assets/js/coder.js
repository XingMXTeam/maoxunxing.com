const body = document.body;
const root = document.documentElement;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const menuToggle = document.getElementById('menu-toggle');
const menuToggleIcon = menuToggle ? menuToggle.querySelector('i') : null;
const navigation = document.querySelector('.navigation');
const navigationList = document.getElementById('site-navigation');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const themeBackgrounds = {
    light: '#ffffff',
    dark: '#050505',
};

const themeTokens = {
    light: {
        '--c-bg': '#ffffff',
        '--c-fg-deeper': '#000',
        '--c-fg-deep': '#222',
        '--c-fg': '#555',
        '--c-fg-light': '#888',
        '--c-border': 'rgba(125, 125, 125, 0.3)',
        '--c-border-hover': '#555',
        '--c-link': '#1565c0',
    },
    dark: {
        '--c-bg': '#050505',
        '--c-fg-deeper': '#fff',
        '--c-fg-deep': '#ddd',
        '--c-fg': '#bbb',
        '--c-fg-light': '#888',
        '--c-border': 'rgba(125, 125, 125, 0.3)',
        '--c-border-hover': '#bbb',
        '--c-link': '#64b5f6',
    },
};

const isHomePage = markHomePage();
let homeParticleScene = null;

function getStoredTheme() {
    try {
        const theme = localStorage.getItem('colorscheme');
        return theme === 'dark' || theme === 'light' ? theme : null;
    } catch (error) {
        return null;
    }
}

function markHomePage() {
    const normalizedPath = window.location.pathname.replace(/\/+$/, '');
    const isHome = normalizedPath === '' || normalizedPath === '/zh-cn' || normalizedPath === '/en';
    body.classList.toggle('page-home', isHome);
    return isHome;
}

// Check if user preference is set, if not check value of body class for light or dark else it means that colorscheme = auto
const storedTheme = getStoredTheme();
if (storedTheme) {
    setTheme(storedTheme);
} else if (body.classList.contains('colorscheme-light') || body.classList.contains('colorscheme-dark')) {
    setTheme(body.classList.contains('colorscheme-dark') ? 'dark' : 'light');
} else {
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
}

if (isHomePage) {
    homeParticleScene = createHomeParticleScene();
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        const theme = body.classList.contains('colorscheme-dark') ? 'light' : 'dark';
        setThemeWithTransition(theme);
        rememberTheme(theme);
    });
}

const onSystemThemeChange = (event) => {
    if (!getStoredTheme()) {
        setTheme(event.matches ? 'dark' : 'light');
    }
};

if (darkModeMediaQuery.addEventListener) {
    darkModeMediaQuery.addEventListener('change', onSystemThemeChange);
} else if (darkModeMediaQuery.addListener) {
    darkModeMediaQuery.addListener(onSystemThemeChange);
}

if (menuToggle && navigation && navigationList) {
    setMenuState(false);

    menuToggle.addEventListener('click', () => {
        setMenuState(!navigation.classList.contains('is-open'));
    });

    navigationList.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
            setMenuState(false);
            menuToggle.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let node = document.querySelector('.preload-transitions');
    node && node.classList.remove('preload-transitions');
});

function setTheme(theme) {
    body.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    if (body) {
        body.classList.remove('colorscheme-' + inverse);
        body.classList.add('colorscheme-' + theme);
    }

    applyRootTheme(theme);
    updateThemeToggle(theme);
    homeParticleScene && homeParticleScene.redraw();

    const iframe = document.querySelector('.utterances-frame');
    if (iframe) {
        iframe.src = iframe.src.replace('github-light', `github-${theme}`).replace('github-dark', `github-${theme}`);
    }
}

function setThemeWithTransition(theme) {
    if (!canRunThemeTransition()) {
        setTheme(theme);
        return;
    }

    prepareThemeTransition(theme);

    const transition = document.startViewTransition(() => {
        setTheme(theme);
    });

    transition.finished.finally(() => {
        cleanupThemeTransition();
    });
}

function canRunThemeTransition() {
    return Boolean(
        darkModeToggle &&
        document.startViewTransition &&
        !reducedMotionMediaQuery.matches
    );
}

function prepareThemeTransition(theme) {
    const rect = darkModeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.ceil(
        Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        )
    );

    root.style.setProperty('--theme-transition-x', `${x}px`);
    root.style.setProperty('--theme-transition-y', `${y}px`);
    root.style.setProperty('--theme-transition-radius', `${endRadius}px`);
    root.dataset.themeTransition = theme === 'dark' ? 'to-dark' : 'to-light';
}

function cleanupThemeTransition() {
    delete root.dataset.themeTransition;
    root.style.removeProperty('--theme-transition-x');
    root.style.removeProperty('--theme-transition-y');
    root.style.removeProperty('--theme-transition-radius');
}

function applyRootTheme(theme) {
    const tokens = themeTokens[theme] || themeTokens.light;
    root.dataset.initialColorScheme = theme;
    root.style.backgroundColor = themeBackgrounds[theme] || themeBackgrounds.light;
    root.style.colorScheme = theme;

    Object.keys(tokens).forEach((token) => {
        root.style.setProperty(token, tokens[token]);
    });
}

function updateThemeToggle(theme) {
    if (!darkModeToggle) return;
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    darkModeToggle.setAttribute('aria-pressed', String(isDark));
    darkModeToggle.setAttribute('aria-label', label);
    darkModeToggle.setAttribute('title', label);
}

function rememberTheme(theme) {
    try {
        localStorage.setItem('colorscheme', theme);
    } catch (error) {}
}

function setMenuState(isOpen) {
    if (!menuToggle || !navigation || !navigationList) return;

    navigation.classList.toggle('is-open', isOpen);
    body.classList.toggle('nav-menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    navigationList.setAttribute('aria-hidden', String(!isOpen));

    if (menuToggleIcon) {
        menuToggleIcon.classList.toggle('fa-bars', !isOpen);
        menuToggleIcon.classList.toggle('fa-times', isOpen);
    }
}

function createHomeParticleScene() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.className = 'home-particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    body.insertBefore(canvas, body.firstChild);

    const scene = {
        canvas,
        context,
        width: 0,
        height: 0,
        pixelRatio: 1,
        particles: [],
        frame: 0,
        startedAt: performance.now(),
        reducedMotion: reducedMotionMediaQuery.matches,
    };

    const resize = () => resizeHomeParticleScene(scene);
    const tick = (timestamp) => renderHomeParticleScene(scene, timestamp, tick);

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onReducedMotionChange = (event) => {
        scene.reducedMotion = event.matches;
        scene.startedAt = performance.now();
        drawHomeParticleScene(scene, performance.now());

        if (!scene.reducedMotion && !scene.frame) {
            scene.frame = requestAnimationFrame(tick);
        }
    };

    if (reducedMotionMediaQuery.addEventListener) {
        reducedMotionMediaQuery.addEventListener('change', onReducedMotionChange);
    } else if (reducedMotionMediaQuery.addListener) {
        reducedMotionMediaQuery.addListener(onReducedMotionChange);
    }

    if (!scene.reducedMotion) {
        scene.frame = requestAnimationFrame(tick);
    }

    return {
        redraw() {
            drawHomeParticleScene(scene, performance.now());
        },
    };
}

function resizeHomeParticleScene(scene) {
    scene.width = window.innerWidth;
    scene.height = window.innerHeight;
    scene.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    scene.canvas.width = Math.round(scene.width * scene.pixelRatio);
    scene.canvas.height = Math.round(scene.height * scene.pixelRatio);
    scene.canvas.style.width = `${scene.width}px`;
    scene.canvas.style.height = `${scene.height}px`;
    scene.context.setTransform(scene.pixelRatio, 0, 0, scene.pixelRatio, 0, 0);
    scene.particles = buildHomeParticles(scene.width, scene.height);
    drawHomeParticleScene(scene, performance.now());
}

function buildHomeParticles(width, height) {
    const particles = [];
    const spacing = width < 768 ? 34 : 32;
    const columns = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = -1; row < rows; row += 1) {
        for (let column = -1; column < columns; column += 1) {
            const seed = seededHomeRandom(row * 928371 + column * 364479);
            const secondarySeed = seededHomeRandom(row * 167761 + column * 475733 + 19);
            const depth = 0.45 + seededHomeRandom(row * 73471 + column * 91873 + 7) * 0.8;

            particles.push({
                baseX: column * spacing + (seed - 0.5) * spacing * 0.42,
                baseY: row * spacing + (secondarySeed - 0.5) * spacing * 0.42,
                depth,
                radius: 0.58 + depth * 0.48,
                alpha: 0.3 + depth * 0.36,
                phase: seed * Math.PI * 2,
            });
        }
    }

    return particles;
}

function seededHomeRandom(value) {
    const x = Math.sin(value * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

function renderHomeParticleScene(scene, timestamp, tick) {
    drawHomeParticleScene(scene, timestamp);

    if (scene.reducedMotion) {
        scene.frame = 0;
        return;
    }

    scene.frame = requestAnimationFrame(tick);
}

function drawHomeParticleScene(scene, timestamp) {
    const { context, width, height, particles } = scene;
    const time = (timestamp - scene.startedAt) / 1000;
    const colors = getHomeParticleColors();

    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
        const waveX = Math.sin(time * 0.95 + particle.baseY * 0.018 + particle.phase);
        const waveY = Math.cos(time * 0.78 + particle.baseX * 0.015 + particle.phase * 0.7);
        const ripple = Math.sin(time * 0.5 + (particle.baseX + particle.baseY) * 0.012 + particle.phase);
        const breathing = 0.74 + Math.sin(time * 1.2 + particle.phase + index * 0.017) * 0.16;
        const amplitude = scene.reducedMotion ? 0 : 1.45 + particle.depth * 1.25;
        const x = particle.baseX + waveX * amplitude + ripple * 0.7;
        const y = particle.baseY + waveY * amplitude + ripple * 0.45;

        if (x < -8 || x > width + 8 || y < -8 || y > height + 8) return;

        const color = particle.depth > 0.95 ? colors.strong : particle.depth > 0.72 ? colors.mid : colors.soft;
        context.globalAlpha = particle.alpha * breathing * colors.opacity;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
    });

    context.globalAlpha = 1;
}

function getHomeParticleColors() {
    const isDark = body.classList.contains('colorscheme-dark') ||
        (body.classList.contains('colorscheme-auto') && darkModeMediaQuery.matches);

    if (isDark) {
        return {
            strong: 'rgba(255, 255, 255, 0.82)',
            mid: 'rgba(100, 181, 246, 0.64)',
            soft: 'rgba(255, 255, 255, 0.45)',
            opacity: 0.72,
        };
    }

    return {
        strong: 'rgba(15, 23, 42, 0.34)',
        mid: 'rgba(21, 101, 192, 0.32)',
        soft: 'rgba(15, 23, 42, 0.2)',
        opacity: 0.66,
    };
}
