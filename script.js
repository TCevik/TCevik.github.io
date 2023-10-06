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

firebase.initializeApp(firebaseConfig);

// Importeer Firebase
import firebase from 'firebase/app';

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);

// Haal de huidige gebruiker op
var user = firebase.auth().currentUser;

// Controleer of de gebruiker is ingelogd
if (!user) {
    // Toon een foutmelding
    alert('U moet eerst inloggen.');
    return;
}

// Haal de cookies op van de gebruiker
var cookies = localStorage.getItem('cookies');

// Versleutel de cookies
var encryptedCookies = encrypt(cookies);

// Sla de cookies op in de database
firebase.database().ref('cookies').child(user.email).set({
    cookies: encryptedCookies,
    expires: new Date(Date.now() + (31557600000))
});

// Haal de cookies op uit de database
var cookies = firebase.database().ref('cookies').child(user.email).get().val().cookies;

// Onversleutel de cookies
var decryptedCookies = decrypt(cookies);

// Sla de cookies op in LocalStorage
localStorage.setItem('cookies', decryptedCookies);

// Controleer of de cookies zijn opgehaald
if (cookies) {
    // Toon de chatpagina
    document.getElementById('chat').style.display = 'block';
} else {
    // Haal de cookies op uit de database
    firebase.database().ref('cookies').child(user.email).get().then(function (snapshot) {
        if (snapshot.exists()) {
            // Sla de cookies op in LocalStorage
            localStorage.setItem('cookies', snapshot.val().cookies);

            // Toon de chatpagina
            document.getElementById('chat').style.display = 'block';
        } else {
            // Toon een foutmelding
            alert('Er zijn geen cookies opgeslagen voor deze gebruiker.');
        }
    });
}

var auth = firebase.auth();
var loginForm = document.getElementById('login');
var userInfo = document.getElementById('user-info');
var chat = document.getElementById('chat'); // Voeg chat toe aan je code

// Functie om inlogformulier en gebruikersinformatie te tonen/verbergen
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    userInfo.style.display = isLoggedIn ? 'block' : 'none';
    chat.style.display = isLoggedIn ? 'block' : 'none';
}

// Inlogstatus controleren bij het laden van de pagina
window.addEventListener('load', function () {
    var loggedIn = localStorage.getItem('loggedIn');
    toggleUI(loggedIn === 'true'); // Converteer de waarde naar een boolean
});

// Inloggen / Registreren
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var loginEmail = document.getElementById('login-email').value;
    var loginPassword = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (userCredential) {
            var user = userCredential.user;
            console.log('Gebruiker ingelogd:', user.email);
            alert('Ingelogd!');
            toggleUI(true);
            localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij inloggen
            localStorage.setItem('userEmail', user.email); // Sla de gebruikers-e-mail op
        })
        .catch(function (error) {
            // Als inloggen mislukt, probeer te registreren
            auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
                .then(function (userCredential) {
                    console.log('Gebruiker geregistreerd:', userCredential.user.email);
                    alert('Registratie gelukt!');
                    toggleUI(true);
                    localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij registratie
                })
                .catch(function (error) {
                    console.error('Fout bij inloggen/registreren:', error.message);
                    alert('Fout bij inloggen/registreren: ' + error.message);
                });
        });
});

// Uitloggen
document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            console.log('Gebruiker uitgelogd');
            toggleUI(false);
            localStorage.setItem('loggedIn', 'false'); // Stel loggedIn in op 'false' bij uitloggen
        })
        .catch(function (error) {
            console.error('Fout bij uitloggen:', error.message);
        });
});

// Voeg code toe om wachtwoord te wijzigen
document.getElementById('change-password-btn').addEventListener('click', function () {
    var user = firebase.auth().currentUser;

    if (user) {
        var newPassword = prompt("Voer uw nieuwe wachtwoord in:");

        if (newPassword !== null) {
            user.updatePassword(newPassword)
                .then(function () {
                    alert('Wachtwoord is succesvol gewijzigd.');
                })
                .catch(function (error) {
                    console.error('Fout bij het wijzigen van het wachtwoord:', error.message);
                    alert('Fout bij het wijzigen van het wachtwoord: ' + error.message);
                });
        }
    }
});

// Voeg code toe om wachtwoord te resetten
document.getElementById('reset-password-btn').addEventListener('click', function () {
    var userEmail = prompt("Voer uw e-mailadres in om uw wachtwoord te resetten:");

    if (userEmail !== null) {
        firebase.auth().sendPasswordResetEmail(userEmail)
            .then(function () {
                alert('Een e-mail met instructies voor het resetten van uw wachtwoord is verzonden naar ' + userEmail);
            })
            .catch(function (error) {
                console.error('Fout bij het verzenden van de wachtwoordreset-e-mail:', error.message);
                alert('Fout bij het verzenden van de wachtwoordreset-e-mail: ' + error.message);
            });
    }
});
