firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        localStorage.removeItem('google_access_token');
        window.location.href = '/quizy/index.html';
    }
});
