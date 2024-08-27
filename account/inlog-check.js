document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
        var currentURL = window.location.href;
        window.location.href = '/account/inloggen-registreren' + '?' + currentURL;
    }
});

/*
var userEmailC = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, "$1");
var userNameC = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*=\s*([^;]*).*$)|^.*$/, "$1");
if (userEmailC && userNameC) {
    notification("De email opgeslagen in je cookies is " + userEmail + " en je gebruikersnaam " + userName + ". Klopt dit niet? Refresh dan de pagina.");
}
*/