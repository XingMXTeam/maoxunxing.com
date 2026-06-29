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

markHomePage();
initHomeDotsBackground();

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
    const isHomePage = normalizedPath === '' || normalizedPath === '/zh-cn' || normalizedPath === '/en';
    body.classList.toggle('page-home', isHomePage);
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

function initHomeDotsBackground() {
    if (!body.classList.contains('page-home')) return;
    if (document.getElementById('home-art-canvas')) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.id = 'home-art-canvas';
    canvas.dataset.art = 'dots';
    canvas.setAttribute('aria-hidden', 'true');
    applyHomeCanvasStyle(canvas);
    body.prepend(canvas);
    initHomeDotsArt(canvas, ctx);
}

function applyHomeCanvasStyle(canvas) {
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
}

function initHomeDotsArt(canvas, ctx) {
    const scale = 200;
    const length = 5;
    const spacing = 15;
    const dotColor = '#cccccc';
    const frameInterval = 1000 / 24;
    let width = 0;
    let height = 0;
    let points = [];
    let animationFrame = 0;
    let lastFrame = 0;

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const fract = (n) => n - Math.floor(n);

    const hash3 = (x, y, z) => fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);

    const valueNoise3D = (x, y, z) => {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const zi = Math.floor(z);
        const xf = fade(x - xi);
        const yf = fade(y - yi);
        const zf = fade(z - zi);

        const x00 = lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf);
        const x10 = lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf);
        const x01 = lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf);
        const x11 = lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf);
        const y0 = lerp(x00, x10, yf);
        const y1 = lerp(x01, x11, yf);
        return lerp(y0, y1, zf);
    };

    const getForceOnPoint = (x, y, z) => (valueNoise3D(x / scale, y / scale, z) - 0.5) * 2 * Math.PI;

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        points = [];

        for (let x = -spacing / 2; x < width + spacing; x += spacing) {
            for (let y = -spacing / 2; y < height + spacing; y += spacing) {
                points.push({
                    x,
                    y,
                    opacity: Math.random() * 0.5 + 0.5,
                });
            }
        }
    };

    const draw = (now) => {
        if (typeof now !== 'number') {
            now = performance.now();
        }

        if (!reducedMotionMediaQuery.matches && now - lastFrame < frameInterval) {
            animationFrame = requestAnimationFrame(draw);
            return;
        }

        lastFrame = now;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = dotColor;
        const t = now / 16000;

        for (const point of points) {
            const rad = getForceOnPoint(point.x, point.y, t);
            const lenNoise = valueNoise3D(point.x / scale, point.y / scale, t * 2);
            const dotLength = (lenNoise * 0.75 + 0.25) * length;
            const nx = point.x + Math.cos(rad) * dotLength;
            const ny = point.y + Math.sin(rad) * dotLength;
            const alpha = (Math.abs(Math.cos(rad)) * 0.55 + 0.18) * point.opacity;

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(nx, ny, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        if (!reducedMotionMediaQuery.matches) {
            animationFrame = requestAnimationFrame(draw);
        }
    };

    resize();
    draw();
    window.addEventListener('resize', debounce(() => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        resize();
        draw();
    }, 180));
}

function debounce(fn, wait) {
    let timer = 0;
    return function debounced(...args) {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn.apply(this, args), wait);
    };
}
