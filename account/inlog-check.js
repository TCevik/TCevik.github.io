document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
        var currentURL = window.location.href;
        window.location.href = '/account/inloggen-registreren' + '?' + currentURL;
    }
});  