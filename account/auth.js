function showInput(id) {
    document.getElementById(id).setAttribute('type', 'text');
}

function hideInput(id) {
    document.getElementById(id).setAttribute('type', 'password');
}

var auth = firebase.auth();

document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var registerEmail = document.getElementById('register-email').value;
    var registerEmail = document.getElementById('register-email').value;
    var registerPassword = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(registerEmail, registerEmail)
        .then(function (userCredential) {
            console.log('Gebruiker geregistreerd:', userCredential.user.email);
            notification('Gebruiker geregistreerd: ' + userCredential.user.email);
        })
        .catch(function (error) {
            console.error('Fout bij registreren:', error.message);
            notification('Fout bij registreren: ' + error.message);
        });
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var loginEmail = document.getElementById('login-email').value;
    var loginEmail = document.getElementById('login-email').value;
    var loginPassword = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (userCredential) {
            console.log('Gebruiker ingelogd:', userCredential.user.email);
            notification('Gebruiker ingelogd: ' + userCredential.user.email);
        })
        .catch(function (error) {
            console.error('Fout bij inloggen:', error.message);
            notification('Fout bij inloggen: ' + error.message);
        });
});

function resetPassword() {
    var userEmail = document.getElementById('login-email').value;
    if (userEmail.trim() !== "") {
        firebase.auth().sendPasswordResetEmail(userEmail)
            .then(function () {
                notification('Een e-mail met instructies voor het resetten van het wachtwoord is verzonden naar ' + userEmail);
            })
            .catch(function (error) {
                console.error('Fout bij het verzenden van de wachtwoordreset-e-mail:', error.message);
                notification('Fout bij het verzenden van de wachtwoordreset-e-mail: ' + error.message);
            });
    } else {
        notification('Voer een geldig e-mailadres in.');
        document.getElementById('login-email').focus();
    }
}

function modeLogin() {
    var register = document.getElementsByClassName("registerForm")[0];
    register.style.display = "none";
    var login = document.getElementsByClassName("loginForm")[0];
    login.style.display = "block";
}

function modeRegister() {
    var login = document.getElementsByClassName("loginForm")[0];
    login.style.display = "none";
    var register = document.getElementsByClassName("registerForm")[0];
    register.style.display = "block";
}

setInterval(function () {
    const user = auth.currentUser;
    if (user) {
        window.location.href = "/account"
    } else {
        console.log("Niet ingelogd. Blijf waar je bent. :)");
    }
}, 500);

function getUserDataFromFirebase() {
    var user = firebase.auth().currentUser;
    var userEmail = user ? user.email : "Geen e-mail gevonden";
    var userName = user ? (user.displayName ? user.displayName : "") : "Geen gebruikersnaam gevonden";
    var photoURL = user ? (user.photoURL ? user.photoURL : "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg") : "Geen profielfoto gevonden";

    document.getElementById("user-email").innerHTML = 'Je email is: ' + userEmail;
    document.getElementById("name-input").value = userName;
    document.getElementById("pic-input").value = photoURL;
}

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

document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            notification('Gebruiker uitgelogd');
            document.cookie = `userPhotoURL=https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        })
        .catch(function (error) {
            notification('Fout bij uitloggen:', error.message);
        });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        setTimeout(() => {
            if (!user.emailVerified) {
                user.sendEmailVerification().then(function () {
                    notification('Er is een verificatie-email gestuurd naar ' + user.email + '. Check je inbox voor de mail.');
                }).catch(function (error) {
                    notification(error);
                });
            }
            getUserDataFromFirebase();
            redirectToUrl();
            saveProfileData();
        }, 1000);
    }
});

function savePic() {
    var pic = document.getElementById('pic-input').value;
    if (pic.trim().length >= 5) {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            photoURL: pic
        }).then(function () {
            notification('Profielfoto succesvol bijgewerkt: ' + pic);
        }).catch(function (error) {
            notification('Fout bij het bijwerken van de profielfoto: ' + error);
        });
    } else {
        notification('De foto-URL moet minimaal 5 tekens bevatten en mag niet alleen spaties zijn.');
    }
}

function saveName() {
    var name = document.getElementById('name-input').value;
    if (name.trim().length >= 3) {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            notification('Gebruikersnaam succesvol bijgewerkt: ' + name);
        }).catch(function (error) {
            notification('Fout bij het bijwerken van de gebruikersnaam: ' + error);
        });
    } else {
        notification('De gebruikersnaam moet minimaal 3 tekens bevatten en mag niet alleen spaties zijn.');
    }
}

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