(function () {
    const token = localStorage.getItem('google_access_token');
    const expiry = localStorage.getItem('google_token_expiry');

    const parsedExpiry = parseInt(expiry, 10);
    const isExpired = expiry && !isNaN(parsedExpiry) && Date.now() > parsedExpiry;

    if (!token || isExpired) {
        console.warn("Geen toegang: Gebruiker is niet ingelogd of token is verlopen. Redirecting...");
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_token_expiry');
        localStorage.setItem('login_redirect', window.location.href);
        window.location.href = '/quizy/index.html';
        return;
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
                localStorage.setItem('login_redirect', window.location.href);
                
                const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/quizy/');
                if (!isLoginPage) {
                    alert("Je sessie is verlopen. Open Quizy in een nieuw tabblad/venster en log opnieuw in. Daarna kun je hier op 'Opslaan' klikken of doorgaan om je werk te behouden.");
                } else {
                    window.location.href = '/quizy/index.html';
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    };
})();
