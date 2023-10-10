const loggedIn = localStorage.getItem('loggedIn'); {

  if (loggedIn === 'true') {
    if (!user.emailVerified) {
        alert('Je e-mailadres is nog niet geverifieerd. Een bevestigingsmail is verzonden.');
        user.sendEmailVerification().catch((error) => {
            console.error('Fout bij het verzenden van de bevestigingsmail:', error);
        });
    } else {
      
    }
  } else {
    alert("Dit is een exclusieve pagina. Maak een account om door te gaan.")
    window.location.href = '/';
  }
     
}