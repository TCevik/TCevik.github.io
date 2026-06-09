(function() {
    const token = localStorage.getItem('google_access_token');

    if (!token) {
        console.warn("Geen toegang: Gebruiker is niet ingelogd. Redirecting...");
        window.location.href = '/quizy/index.html';
    }
})();