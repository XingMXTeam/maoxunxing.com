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
initHomePlumBackground();

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

function initHomePlumBackground() {
    if (!body.classList.contains('page-home')) return;
    if (document.getElementById('home-plum-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'home-plum-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r180 = Math.PI;
    const r90 = Math.PI / 2;
    const r15 = Math.PI / 12;
    const minBranch = 30;
    const len = 6;
    const color = '#88888825';
    const frameInterval = reducedMotionMediaQuery.matches ? 0 : 1000 / 40;
    let width = 0;
    let height = 0;
    let steps = [];
    let prevSteps = [];
    let animationFrame = 0;
    let lastTime = performance.now();

    const randomMiddle = () => Math.random() * 0.6 + 0.2;
    const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => [
        x + r * Math.cos(theta),
        y + r * Math.sin(theta),
    ];

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        start();
    };

    const step = (x, y, rad, counter = { value: 0 }) => {
        const length = Math.random() * len;
        counter.value += 1;
        const [nx, ny] = polar2cart(x, y, length, rad);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        const rad1 = rad + Math.random() * r15;
        const rad2 = rad - Math.random() * r15;

        if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) {
            return;
        }

        const rate = counter.value <= minBranch ? 0.8 : 0.5;
        if (Math.random() < rate) steps.push(() => step(nx, ny, rad1, counter));
        if (Math.random() < rate) steps.push(() => step(nx, ny, rad2, counter));
    };

    const render = () => {
        if (!frameInterval || performance.now() - lastTime >= frameInterval) {
            prevSteps = steps;
            steps = [];
            lastTime = performance.now();

            if (!prevSteps.length) {
                cancelAnimationFrame(animationFrame);
                animationFrame = 0;
                return;
            }

            prevSteps.forEach((item) => {
                if (Math.random() < 0.5) {
                    steps.push(item);
                } else {
                    item();
                }
            });
        }

        animationFrame = requestAnimationFrame(render);
    };

    function start() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = 0;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        prevSteps = [];
        steps = [
            () => step(randomMiddle() * width, -5, r90),
            () => step(randomMiddle() * width, height + 5, -r90),
            () => step(-5, randomMiddle() * height, 0),
            () => step(width + 5, randomMiddle() * height, r180),
        ];

        if (width < 500) {
            steps = steps.slice(0, 2);
        }

        if (reducedMotionMediaQuery.matches) {
            for (let i = 0; i < 260 && steps.length; i += 1) {
                prevSteps = steps;
                steps = [];
                prevSteps.forEach((item) => item());
            }
            return;
        }

        animationFrame = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', debounce(resize, 180));
}

function debounce(fn, wait) {
    let timer = 0;
    return function debounced(...args) {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn.apply(this, args), wait);
    };
}
