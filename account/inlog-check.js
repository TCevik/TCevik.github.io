setInterval(function () {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = "/account/inloggen-registreren";
    } else {
        console.log("Wel ingelogd. Blijf waar je bent. :)");
    }
}, 2000);