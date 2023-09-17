var auth = firebase.auth();
var loggedIn = localStorage.getItem('loggedIn');
var loginForm = document.getElementById('login');
var userInfo = document.getElementById('user-info');

// Functie om inlogformulier en gebruikersinformatie te tonen/verbergen
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    userInfo.style.display = isLoggedIn ? 'block' : 'none';
    chat.style.display = isLoggedIn ? 'block' : 'none';
}

// Inlogstatus controleren bij het laden van de pagina
window.addEventListener('load', function () {
    auth.onAuthStateChanged(function (user) {
        toggleUI(!!user);
    });
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
            localStorage.setItem('loggedIn', 'true');
        })
        .catch(function (error) {
            // Als inloggen mislukt, probeer te registreren
            auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
                .then(function (userCredential) {
                    console.log('Gebruiker geregistreerd:', userCredential.user.email);
                    alert('Registratie gelukt!');
                    toggleUI(true);
                    localStorage.setItem('loggedIn', 'true');
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
            localStorage.removeItem('loggedIn');
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