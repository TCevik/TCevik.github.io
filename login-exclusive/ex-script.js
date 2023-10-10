const loggedIn = localStorage.getItem('loggedIn'); {

  if (loggedIn === 'true') {

  } else {
    alert("Dit is een exclusieve pagina. Maak een account om door te gaan.")
    window.location.href = '/';
  }
}