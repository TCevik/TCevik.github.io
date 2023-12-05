var auth = firebase.auth();
var loginForm = document.getElementById('login');
var dashboard = document.getElementById('dashboard');

// Functie om inlogformulier en gebruikersinformatie te tonen/verbergen
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    dashboard.style.display = isLoggedIn ? 'block' : 'none';
}

function getUserDataFromFirebase() {
    var user = firebase.auth().currentUser;
    var userEmail = user ? user.email : "Geen e-mail gevonden";
    var userName = user ? (user.displayName ? user.displayName : "") : "Geen gebruiker ingelogd";
    var phoneNumber = user ? (user.phoneNumber ? user.phoneNumber : "") : "Geen telefoonnummer opgegeven";
    var photoURL = user ? (user.photoURL ? user.photoURL : "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg") : "Geen profielfoto gevonden";

    document.getElementById("user-email").innerHTML = 'Je email is: ' + userEmail;
    document.getElementById("phone-number").value = phoneNumber;
    document.getElementById("name-input").value = userName;
    document.getElementById("pic-input").value = photoURL;
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        setTimeout(() => {
            if (!user.emailVerified) {
                user.sendEmailVerification().then(function() {
                    notification('Er is een verificatie-email gestuurd naar ' + user.email + '. Check je inbox voor de mail.');
                }).catch(function(error) {
                    notification(error);
                });
            }
            getUserDataFromFirebase();
            redirectToUrl();
            saveProfileData();
        }, 1000);
    }
});

function saveProfileData() {
    const user = firebase.auth().currentUser;
    const photoURL = user.photoURL;
  
    document.cookie = `userPhotoURL=${photoURL}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}
  

function redirectToUrl() {
    var currentUrl = window.location.href;
    
    if (currentUrl.includes("?")) {
        var parts = currentUrl.split("?");
        if (parts[1]) {
            var redirectTo = parts[1];
            window.location.href = redirectTo;
        }
    }
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
            notification('Ingelogd!');
            toggleUI(true);
            localStorage.setItem('loggedIn', 'true');
        })
        .catch(function (error) {
            // Als inloggen mislukt, probeer te registreren
            auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
                .then(function (userCredential) {
                    console.log('Gebruiker geregistreerd:', userCredential.user.email);
                    notification('Registratie gelukt!');
                    toggleUI(true);
                    localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij registratie
                })
                .catch(function (error) {
                    console.error('Fout bij inloggen/registreren:', error.message);
                    notification('Fout bij inloggen/registreren: ' + error.message);
                });
        });
});

// Uitloggen
document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            notification('Gebruiker uitgelogd');
            toggleUI(false);
            localStorage.setItem('loggedIn', 'false');
            document.cookie = `https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        })
        .catch(function (error) {
            notification('Fout bij uitloggen:', error.message);
        });
});

function changePassword() {
    var user = firebase.auth().currentUser;

    if (user) {
        var newPassword = prompt("New password:");

        if (newPassword !== null) {
            user.updatePassword(newPassword)
                .then(function () {
                    notification('Wachtwoord is succesvol gewijzigd.');
                })
                .catch(function (error) {
                    console.error('Fout bij het wijzigen van het wachtwoord:', error.message);
                    notification('Fout bij het wijzigen van het wachtwoord: ' + error.message);
                });
        }
    }
}