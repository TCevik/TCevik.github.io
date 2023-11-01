const firebaseConfig = {
    apiKey: "AIzaSyDp6L5-6r3a6yQV_py46q3GWf_ZL2ttfu8",
    authDomain: "tctam-d04b8.firebaseapp.com",
    projectId: "tctam-d04b8",
    storageBucket: "tctam-d04b8.appspot.com",
    messagingSenderId: "793882705601",
    appId: "1:793882705601:web:118e6ea26069867d0b5e40",
    measurementId: "G-Q00YFYX8SP"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();

function addToChild(picto, imageUrl) {
    var childSection = document.getElementById('child-section');
    var img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('picto');
    img.onclick = function () {
        childSection.removeChild(this);
        if (childSection.childNodes.length === 0) {
            childSection.style.display = 'none';
        }
    };
    childSection.appendChild(img);
    childSection.style.display = 'block';
}

function deleteAllPictos() {
    var childSection = document.getElementById('child-section');
    childSection.innerHTML = '';
    childSection.style.display = 'none';
}

function savePictosToFirebase() {
    const email = firebase.auth().currentUser.email;
    var allowedEmails = ['tam.cevik123@gmail.com', 'leonora1974@gmail.com'];
    var askEmails = ['sercevik11@gmail.com', 'sercandenizcevik11@gmail.com'];

    if (allowedEmails.includes(email)) {
        var pictos = document.getElementById('child-section').innerHTML;
        var pictosRef = firestore.collection('pictos').doc('pictos');

        // Sla de pictogrammen op in de database
        pictosRef.set({
            pictos
        }).then(function () {
            alert("De picto's zijn succesvol opgeslagen.");
        }).catch(function (error) {
            alert("Er is een fout opgetreden bij het opslaan van de pictogrammen: " + error);
        });
    } else {
        if (askEmails.includes(email)) {
            var pictos = document.getElementById('child-section').innerHTML;
            var pictosRef = firestore.collection('pictos').doc('preview');

            // Sla de pictogrammen op in de database
            pictosRef.set({
                pictos
            }).then(function () {
                alert("De picto's zijn succesvol aangevraagd.");
            }).catch(function (error) {
                alert("Er is een fout opgetreden bij het aanvragen van de pictogrammen: " + error);
            });
        } else {
            alert("Deze gebruiker heeft geen toestemming om de picto's op te slaan of aan te vragen.");
        }
    }
}

setTimeout(() => {
    askedPictos();
}, 1000);

function askedPictos() {
    const email = firebase.auth().currentUser.email;
    var allowedEmails = ['tam.cevik123@gmail.com'];

    if (allowedEmails.includes(email)) {
        var pictosRef = firestore.collection('pictos').doc('preview');

        pictosRef.get().then(function (doc) {
            if (doc.exists) {
                // Vraag de gebruiker om goedkeuring voor de picto's
                if (confirm("Wil je de aangevraagde picto's goedkeuren?")) {
                    // Haal de picto's op uit de preview en sla ze op in de database
                    var pictos = doc.data().pictos;
                    var pictosRef = firestore.collection('pictos').doc('pictos');

                    pictosRef.set({
                        pictos
                    }).then(function () {
                        var pictosRef = firestore.collection('pictos').doc('preview');
                        pictosRef.delete();
                        alert("De picto's zijn succesvol opgeslagen.");
                    }).catch(function (error) {
                        alert("Er is een fout opgetreden bij het opslaan van de pictogrammen: " + error);
                    });
                } else {
                    var pictosRef = firestore.collection('pictos').doc('preview');
                    pictosRef.delete();
                }
            } else {
                return;
            }
        }).catch(function (error) {
            alert("Er is een fout opgetreden: " + error);
        });
    }
}

function loadPictosFromDatabase() {
    var childSection = document.getElementById('child-section');
    var pictosRef = firestore.collection('pictos').doc('pictos');

    pictosRef.get().then(function (doc) {
        if (doc.exists) {
            var pictosData = doc.data();
            var pictos = pictosData.pictos;
            childSection.innerHTML = pictos;
            childSection.style.display = 'block';
            var pictoElements = childSection.getElementsByClassName('picto');
            for (var i = 0; i < pictoElements.length; i++) {
                var picto = pictoElements[i];
                picto.onclick = function () {
                    childSection.removeChild(this);
                    if (childSection.childNodes.length === 0) {
                        childSection.style.display = 'none';
                    }
                };
            }
        }
    }).catch(function (error) {
        alert("Er is een fout opgetreden bij het laden van pictogrammen: " + error);
    });
}

loadPictosFromDatabase();

function speakDateTime() {
    const dateTime = new Date();
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

    const day = dayNames[dateTime.getDay()];
    const numericDay = dateTime.getDate();
    const month = monthNames[dateTime.getMonth()];
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();

    const dateTimeText = `De datum van vandaag is ${day} ${numericDay} ${month} en de tijd is ${hour} uur ${minute}.`;

    const speech = new SpeechSynthesisUtterance(dateTimeText);
    speech.rate = 0.9;
    speechSynthesis.speak(speech);
}

setInterval(updateDateTime, 1000);

function updateDateTime() {
    const dateTime = new Date();
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

    const day = dayNames[dateTime.getDay()];
    const numericDay = dateTime.getDate();
    const month = monthNames[dateTime.getMonth()];
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();

    const dateTimeText = `De datum van vandaag is ${day} ${numericDay} ${month} en de tijd is ${hour} uur ${minute}.`;

    document.getElementById("date-time").textContent = dateTimeText;
}