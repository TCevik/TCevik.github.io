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









































































// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyDp6L5-6r3a6yQV_py46q3GWf_ZL2ttfu8",
  authDomain: "tctam-d04b8.firebaseapp.com",
  databaseURL: "https://tctam-d04b8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tctam-d04b8",
  storageBucket: "tctam-d04b8.appspot.com",
  messagingSenderId: "793882705601",
  appId: "1:793882705601:web:118e6ea26069867d0b5e40",
  measurementId: "G-Q00YFYX8SP"
};

// Initialiseren van Firebase
firebase.initializeApp(firebaseConfig);

// Firebase authenticatie initialiseren
var auth = firebase.auth();

// Controleer of de gebruiker is ingelogd
if (localStorage.getItem('loggedIn') === 'true') {
  // De gebruiker is ingelogd, start het synchroniseren van cookies
  setInterval(() => {
      // Haal alle cookies op
      const cookies = document.cookie.split(';').reduce((res, c) => {
          const [key, val] = c.trim().split('=').map(decodeURIComponent);
          try {
              return Object.assign(res, { [key]: JSON.parse(val) });
          } catch (e) {
              return Object.assign(res, { [key]: val });
          }
      }, {});

      // Haal de huidige gebruiker op
      const user = auth.currentUser;

      if (user != null) {
          // Sla de cookies op in de firebase database onder de e-mail van de gebruiker
          firebase.database().ref('users/' + user.email.replace('.', ',')).set(cookies);
      }
  }, 500);
}

// Wanneer de gebruiker inlogt, laad dan de cookies
auth.onAuthStateChanged((user) => {
  if (user) {
      // De gebruiker is ingelogd, haal de cookies op uit de database
      firebase.database().ref('/users/' + user.email.replace('.', ',')).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data) {
              // Er zijn cookies opgeslagen in de database, zet ze in de browser
              Object.keys(data).forEach((key) => {
                  document.cookie = key + '=' + data[key];
              });
          }
      });
  }
});