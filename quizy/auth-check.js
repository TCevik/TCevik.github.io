(function() {
    const token = localStorage.getItem('google_access_token');
    const expiry = localStorage.getItem('google_token_expiry');

    const isExpired = expiry && Date.now() > parseInt(expiry, 10);

    if (!token || isExpired) {
        console.warn("Geen toegang: Gebruiker is niet ingelogd of token is verlopen. Redirecting...");
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_token_expiry');
        window.location.href = '/quizy/index.html';
        return;
    }

    // Intercept fetch calls to catch any 401 Unauthorized errors dynamically (safety net)
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                console.warn("Google API Access Token is niet meer geldig (401 Unauthorized). Uitloggen...");
                localStorage.removeItem('google_access_token');
                localStorage.removeItem('google_token_expiry');
                window.location.href = '/quizy/index.html';
            }
            return response;
        } catch (error) {
            throw error;
        }
    };
})();