/* accepteer popup */
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('accept')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'Door het gebruik van deze site of het proberen van de inhoud ervan ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    button.addEventListener('click', function () {
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      var message = {
        content: 'Iemand heeft op de accepteer knop geklikt!'
      };

      xhr.send(JSON.stringify(message));

      var opacity = 1;
      var intervalId = setInterval(function () {
        opacity -= 0.05;
        popup.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(intervalId);
          popup.style.display = 'none';
        }
      }, 15);

      localStorage.setItem('accept', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});



/* google analytics */
(function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7KL389S9VR');
})();






document.addEventListener('DOMContentLoaded', function() {
  // Haal de huidige URL op
  const currentURL = window.location.pathname;

  // Controleer of de URL begint met '/games/' of '/games?' (en optionele queryparameters)
  if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?')) {
    // Voeg een knop toe aan de pagina
    const loginButton = document.createElement("button");
    loginButton.style.position = "fixed";
    loginButton.style.top = "3px";
    loginButton.style.right = "3px";
    document.body.appendChild(loginButton);

    // Functie om de tekst van de knop te updaten op basis van de loggedIn-cookie
    function updateLoginButton() {
        const loggedIn = localStorage.getItem('loggedIn');

        if (loggedIn === 'true') {
            loginButton.textContent = "Je bent ingelogd";
        } else {
            loginButton.textContent = "Inloggen";
        }
    }

    // Maak een callback-functie
    const updateLoginButtonCallback = () => {
        // Voer de functie `updateLoginButton()` uit
        updateLoginButton();
    };

    updateLoginButton();

    // Voer de callback-functie elke seconde uit
    setInterval(updateLoginButtonCallback, 1000);

    // Voeg een click event listener toe aan de knop
    loginButton.addEventListener("click", function() {
        const loggedIn = localStorage.getItem('loggedIn');

        if (loggedIn === 'true') {
            window.location.href = "/tctam-chat";
        } else {
            // Navigeer naar de opgegeven URL voor inloggen
            window.location.href = "/tctam-chat";
        }
    });
  }
});






















































// Importeer Firebase
import * as firebase from 'firebase/app';
import 'firebase/database';

// Firebase configuratie
var firebaseConfig = {
    // jouw configuratie
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);

// Referentie naar de database
var db = firebase.database();

// Functie om cookies op te slaan in de database
function saveCookies(email, cookies) {
    db.ref('users/' + email).set({
        cookies: cookies
    });
}

// Functie om cookies op te halen uit de database
function getCookies(email) {
    return db.ref('users/' + email).once('value').then(function(snapshot) {
        return snapshot.val().cookies;
    });
}

// Sla cookies op wanneer de gebruiker inlogt
auth.signInWithEmailAndPassword(loginEmail, loginPassword)
    .then(function (userCredential) {
        var user = userCredential.user;
        console.log('Gebruiker ingelogd:', user.email);
        alert('Ingelogd!');
        toggleUI(true);
        localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij inloggen
        localStorage.setItem('userEmail', user.email); // Sla de gebruikers-e-mail op

        // Sla de huidige cookies op in de database
        saveCookies(user.email, document.cookie);
    })
    .catch(function (error) {
        // Als inloggen mislukt, probeer te registreren
        auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
            .then(function (userCredential) {
                console.log('Gebruiker geregistreerd:', userCredential.user.email);
                alert('Registratie gelukt!');
                toggleUI(true);
                localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij registratie

                // Sla de huidige cookies op in de database
                saveCookies(user.email, document.cookie);
            })
            .catch(function (error) {
                console.error('Fout bij inloggen/registreren:', error.message);
                alert('Fout bij inloggen/registreren: ' + error.message);
            });
    });

// Haal cookies op wanneer de pagina wordt geladen
window.addEventListener('load', function () {
    var loggedIn = localStorage.getItem('loggedIn');
    var userEmail = localStorage.getItem('userEmail');

    if (loggedIn === 'true' && userEmail) {
        getCookies(userEmail).then(function(cookies) {
            document.cookie = cookies;
        });
    }

    toggleUI(loggedIn === 'true'); // Converteer de waarde naar een boolean
});