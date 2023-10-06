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























































import firebase from 'firebase/app';
import 'firebase/database';

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);

// Maak een database aan
var database = firebase.database();

// Maak een tabel aan
var cookiesTable = database.ref('cookies');

// Sla de cookies op in de database
function saveCookies() {
    // Haal de e-mailadres van de gebruiker op
    var email = firebase.auth().currentUser.email;

    // Haal de cookies van de gebruiker op
    var cookies = document.cookie;

    // Sla de cookies op in de database
    cookiesTable.child(email).child('cookies').set(cookies);
}

// Haal de cookies op uit de database
function getCookies() {
    // Haal de e-mailadres van de gebruiker op
    var email = firebase.auth().currentUser.email;

    // Haal de cookies uit de database
    var cookies = cookiesTable.child(email).child('cookies').val();

    // Converteer de cookies naar een JSON-object
    cookies = JSON.parse(cookies);

    // Zet de cookies in de browser
    document.cookie = cookies;
}

// Voeg de login-form-submit-handler toe
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Sla de cookies op in de database
    saveCookies();
});

// Voeg de logout-btn-click-handler toe
document.getElementById('logout-btn').addEventListener('click', function () {
    // Verwijder de cookies uit de database
    cookiesTable.child(firebase.auth().currentUser.email).set({
        email: '',
        cookies: ''
    });
});

// Voeg de getCookies()-functie toe aan het begin van het script
getCookies();
