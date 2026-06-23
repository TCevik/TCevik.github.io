var metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1';

var head = document.querySelector('head');
head.appendChild(metaTag);

var manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/quizy/app.webmanifest';
var headElement = document.head || document.getElementsByTagName('head')[0];
headElement.insertBefore(manifestLink, headElement.firstChild);

/* Register Service Worker */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

/* PWA Installation Flow */
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    window.deferredPrompt = e;
    // Inject and update buttons visibility
    setupPwaButtons();
    updatePwaButtonsVisibility();
});

window.addEventListener('appinstalled', (e) => {
    console.log('PWA was installed');
    window.deferredPrompt = null;
    updatePwaButtonsVisibility();
});

function triggerPwaInstall() {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            window.deferredPrompt = null;
            updatePwaButtonsVisibility();
        });
    }
}

function setupPwaButtons() {
    // Mobile PWA Install button (links naast themeToggle)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !document.getElementById('pwa-install-mobile')) {
        const mobileBtn = document.createElement('button');
        mobileBtn.id = 'pwa-install-mobile';
        mobileBtn.className = 'pwa-download-btn-mobile';
        mobileBtn.title = 'App downloaden';
        mobileBtn.innerHTML = '<i class="fa-solid fa-circle-down"></i>';
        mobileBtn.style.display = 'none';
        themeToggle.parentNode.insertBefore(mobileBtn, themeToggle);
        mobileBtn.addEventListener('click', triggerPwaInstall);
    }

    // Desktop PWA Install button (rechts in dashboard-intro)
    const dashboardIntro = document.querySelector('.dashboard-intro');
    if (dashboardIntro && !document.getElementById('pwa-install-desktop')) {
        const desktopBtn = document.createElement('button');
        desktopBtn.id = 'pwa-install-desktop';
        desktopBtn.className = 'pwa-download-btn-desktop';
        desktopBtn.innerHTML = '<i class="fa-solid fa-download"></i> App downloaden';
        desktopBtn.style.display = 'none';
        dashboardIntro.appendChild(desktopBtn);
        desktopBtn.addEventListener('click', triggerPwaInstall);
    }
}

function updatePwaButtonsVisibility() {
    const show = !!window.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches;
    const mBtn = document.getElementById('pwa-install-mobile');
    const dBtn = document.getElementById('pwa-install-desktop');
    if (mBtn) mBtn.style.display = show ? 'flex' : 'none';
    if (dBtn) dBtn.style.display = show ? 'inline-flex' : 'none';
}

// Keep checking for the elements in the DOM since they can be dynamically injected later (e.g. by injectCommonLayout)
document.addEventListener('DOMContentLoaded', () => {
    setupPwaButtons();
    updatePwaButtonsVisibility();
    
    // Check periodically to ensure buttons are injected even if header is rendered dynamically
    const pwaInterval = setInterval(() => {
        setupPwaButtons();
        updatePwaButtonsVisibility();
    }, 1000);
    
    // Stop checking after 10 seconds to save performance
    setTimeout(() => clearInterval(pwaInterval), 10000);
});

/* google analytics */
(function () {
	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

	var firstScript = document.getElementsByTagName('script')[0];
	firstScript.parentNode.insertBefore(script, firstScript);

	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());

	gtag('config', 'G-7KL389S9VR');
})();

/* Adsense */
const adsenseScript = document.createElement('script');
adsenseScript.async = true;
adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8924607946192862";
adsenseScript.crossOrigin = "anonymous";
document.head.appendChild(adsenseScript);