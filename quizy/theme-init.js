(function() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        localStorage.setItem('theme', savedTheme);
    }
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
})();
