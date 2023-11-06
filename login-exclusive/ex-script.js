const loggedIn = localStorage.getItem('loggedIn');

if (loggedIn === 'true') {

} else {
  notification("Dit is een exclusieve pagina. Maak een account om door te gaan.");
  var currentURL = window.location.href;
  window.location.href = '/auth/account' + '?' + currentURL;
}