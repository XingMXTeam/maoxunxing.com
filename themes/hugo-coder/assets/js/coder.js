const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Check if user preference is set, if not check value of body class for light or dark else it means that colorscheme = auto
if (localStorage.getItem("colorscheme")) {
    setTheme(localStorage.getItem("colorscheme"));
} else if (body.classList.contains('colorscheme-light') || body.classList.contains('colorscheme-dark')) {
    setTheme(body.classList.contains("colorscheme-dark") ? "dark" : "light");
} else {
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', (e) => {
        let theme = body.classList.contains("colorscheme-dark") ? "light" : "dark";
        toggleThemeWithTransition(e, theme);
    });
}

function toggleThemeWithTransition(event, theme) {
    // Fallback if View Transition API is not supported or user prefers reduced motion
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTheme(theme);
        rememberTheme(theme);
        return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const isDark = theme === 'dark';

    const transition = document.startViewTransition(() => {
        setTheme(theme);
        rememberTheme(theme);
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
            { clipPath: isDark ? clipPath : [...clipPath].reverse() },
            {
                duration: 400,
                easing: 'ease-in-out',
                pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
            }
        );
    });
}

darkModeMediaQuery.addListener((event) => {
    setTheme(event.matches ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", function () {
    let node = document.querySelector('.preload-transitions');
    node && node.classList.remove('preload-transitions');
});

function setTheme(theme) {
    body.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    body.classList.remove('colorscheme-' + inverse);
    body.classList.add('colorscheme-' + theme);

    const iframe = document.querySelector('.utterances-frame')
    if (iframe) {
        iframe.src = iframe.src.replace('github-light', `github-${theme}`).replace('github-dark', `github-${theme}`)
    }
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}
