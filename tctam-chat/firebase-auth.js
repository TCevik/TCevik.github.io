var auth = firebase.auth();
var loginForm = document.getElementById('login');
var userInfo = document.getElementById('user-info');
var chat = document.getElementById('chat'); // Voeg chat toe aan je code

// Cookies ophalen
var cookies = document.cookie.split(";");

// Cookies opslaan in de database
for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var key = cookie.split("=")[0];
    var value = cookie.split("=")[1];

    // Sla de cookie op in de database
    firebase.database().ref("cookies").child(key).set(value);
}

// Inloggen / Registreren
function toggleUI(isLoggedIn) {
    // Controleer of de gebruiker cookies heeft opgeslagen
    var user = firebase.auth().currentUser;

    if (user) {
        // Sla de cookies op in de browser
        for (var key in user.cookies) {
            document.cookie = key + "=" + user.cookies[key];
        }
    }

    // Inlogstatus controleren
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    userInfo.style.display = isLoggedIn ? 'block' : 'none';
    chat.style.display = isLoggedIn ? 'block' : 'none';
}

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



















// Cookies uit de database halen
var user = firebase.auth().currentUser;

// Controleer of de gebruiker cookies heeft opgeslagen
if (user.cookies) {
    // Sla de cookies op in de browser
    for (var key in user.cookies) {
        document.cookie = key + "=" + user.cookies[key];
    }
}
