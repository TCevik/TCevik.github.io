(function () {
    const token = localStorage.getItem('google_access_token');
    const expiry = localStorage.getItem('google_token_expiry');

    const parsedExpiry = parseInt(expiry, 10);
    const isExpired = expiry && !isNaN(parsedExpiry) && Date.now() > parsedExpiry;

    if (!token || isExpired) {
        console.warn("Geen toegang: Gebruiker is niet ingelogd of token is verlopen. Redirecting...");
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_token_expiry');
        window.location.href = '/quizy/index.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Dynamisch inladen van Google Identity Services client voor de silent token refresh
    function loadGoogleGsi() {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            setupTokenRefresh();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = setupTokenRefresh;
        document.head.appendChild(script);
    }

    let tokenClient;
    const CLIENT_ID = '702903974846-l9hochhjsflkr40icdujpo769mmhu6kj.apps.googleusercontent.com';
    const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

    function setupTokenRefresh() {
        if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) return;
        
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    localStorage.setItem('google_access_token', tokenResponse.access_token);
                    const expiryTime = Date.now() + (parseInt(tokenResponse.expires_in, 10) || 3600) * 1000;
                    localStorage.setItem('google_token_expiry', expiryTime);
                    console.log("Google access token succesvol stil vernieuwd.");
                }
            },
        });

        // Direct controleren en periodiek inplannen
        checkAndRefresh();
        setInterval(checkAndRefresh, 60000); // Elke minuut checken
    }

    function checkAndRefresh() {
        const exp = localStorage.getItem('google_token_expiry');
        if (!exp) return;
        const parsedExp = parseInt(exp, 10);
        if (isNaN(parsedExp)) return;

        // Als het token binnen 10 minuten verloopt, vraag stil een nieuwe aan (prompt: 'none')
        const timeRemaining = parsedExp - Date.now();
        if (timeRemaining < 600000) {
            console.log("Google access token verloopt bijna, bezig met stil vernieuwen...");
            if (tokenClient) {
                tokenClient.requestAccessToken({ prompt: 'none' });
            }
        }
    }

    // Start inladen van de Google script
    if (document.readyState === 'complete') {
        loadGoogleGsi();
    } else {
        window.addEventListener('load', loadGoogleGsi);
    }

    // Intercept fetch calls to catch any 401 Unauthorized errors dynamically (safety net)
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        try {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                console.warn("Google API Access Token is niet meer geldig (401 Unauthorized). Uitloggen...");
                localStorage.removeItem('google_access_token');
                localStorage.removeItem('google_token_expiry');
                
                const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/quizy/');
                if (!isLoginPage) {
                    alert("Je sessie is verlopen. Open Quizy in een nieuw tabblad/venster en log opnieuw in. Daarna kun je hier op 'Opslaan' klikken of doorgaan om je werk te behouden.");
                } else {
                    window.location.href = '/quizy/index.html?redirect=' + encodeURIComponent(window.location.href);
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    };
})();
