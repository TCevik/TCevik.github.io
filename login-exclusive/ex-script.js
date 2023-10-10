const user = firebase.auth().currentUser;

if (user) {
  if (user.emailVerified) {
    stop
  } else {
    alert("Dit is een exclusieve pagina. Verifieer je email om door te gaan.");
    window.location.href = '/';
  }
} else {
  alert("Dit is een exclusieve pagina. Maak een account om door te gaan.");
  window.location.href = '/';
}
