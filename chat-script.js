// Voeg hier je Firebase-configuratiegegevens toe
const firebaseConfig = {
    apiKey: "AIzaSyAkS4WdnA5EuT8wM6NK1752lqqgosmMdnA",
    authDomain: "githubchat-77956.firebaseapp.com",
    databaseURL: "https://githubchat-77956-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "githubchat-77956",
    storageBucket: "githubchat-77956.appspot.com",
    messagingSenderId: "252339182035",
    appId: "1:252339182035:web:9b3fd5f4937364e56b7726",
    measurementId: "G-SN0H6S7567"
};

firebase.initializeApp(firebaseConfig);

// Verwijzing naar de Firebase Realtime Database
const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Variabele om het aantal weer te geven berichten bij te houden
const maxMessagesToShow = 8;
const displayedMessages = [];

// Functie om een bericht te verzenden
function sendMessage(username, message) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        sender: username,
        message: message,
    };

    // Verzend het bericht naar de database
    database.ref('chat').push(messageData);
}

// Eventlistener om bij te houden of het tabblad actief is
let isTabActive = true;

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        isTabActive = true;
    } else {
        isTabActive = false;
    }
});

// Voeg een eventlistener toe voor de verzendknop
sendButton.addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    const message = messageInput.value;
    if (message.trim() !== '') {
        sendMessage(username, message);
        messageInput.value = '';
    }
});

// Eventlistener voor toetsenbord "Enter" om bericht te verzenden
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const username = document.getElementById('username-input').value;
        const message = messageInput.value;
        if (message.trim() !== '') {
            sendMessage(username, message);
            messageInput.value = '';
        }
    }
});

// Functie om berichten weer te geven als een alert
function displayMessageAsAlert(sender, message) {
    const alertMessage = `${sender}: ${message}`;
    displayedMessages.push(alertMessage);

    if (displayedMessages.length > maxMessagesToShow) {
        displayedMessages.shift();
    }

    alert(displayedMessages.join('\n'));
}

// Luister naar nieuwe berichten in de database
database.ref('chat').orderByChild('timestamp').limitToLast(maxMessagesToShow).on('child_added', (snapshot) => {
    if (isTabActive) {
        const messageData = snapshot.val();
        const sender = messageData.sender || 'Gebruiker';
        const message = messageData.message;
        displayMessageAsAlert(sender, message);
    }
});