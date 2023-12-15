document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  
    if (!isLoggedIn) {
      window.location.href = 'https://tctam.nl/account/inloggen-registreren';
    }
  });  