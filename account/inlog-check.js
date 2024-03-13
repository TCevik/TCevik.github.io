document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
        var currentURL = window.location.href;
        window.location.href = '/account/inloggen-registreren' + '?' + currentURL;
    }
});

/*
var userEmail = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, "$1");
if (userEmail) {
    notification("De email opgeslagen in je cookies is " + userEmail + ". Klopt dit niet? Refresh dan de pagina.");
}
*/