const body = document.body;
const root = document.documentElement;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.querySelector('.navigation');
const navigationList = document.getElementById('site-navigation');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

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

function getStoredTheme() {
    try {
        const theme = localStorage.getItem('colorscheme');
        return theme === 'dark' || theme === 'light' ? theme : null;
    } catch (error) {
        return null;
    }
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
        setTheme(theme);
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
        if (event.key === 'Escape') {
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
    if (!menuToggle || !navigation) return;
    navigation.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}
