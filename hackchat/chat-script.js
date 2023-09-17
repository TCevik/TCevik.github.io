// Voeg hier je Firebase-configuratiegegevens toe
const firebaseConfig = {
    apiKey: "AIzaSyDp6L5-6r3a6yQV_py46q3GWf_ZL2ttfu8",
    authDomain: "tctam-d04b8.firebaseapp.com",
    projectId: "tctam-d04b8",
    databaseURL: "https://tctam-d04b8-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "tctam-d04b8.appspot.com",
    messagingSenderId: "793882705601",
    appId: "1:793882705601:web:ac714f422263f4350b5e40",
    measurementId: "G-TQLZK0WT42"
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
    database.ref('hackchat').push(messageData);
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

// Voeg een variabele toe om de tijd van het laatste verzonden bericht bij te houden
let lastMessageTime = 0;

// Voeg een timer toe om de wachttijd te regelen
function canSendMessage() {
    const currentTime = Date.now();
    const timeSinceLastMessage = currentTime - lastMessageTime;
    return timeSinceLastMessage >= 3000; // 3000 milliseconden = 3 seconden
}

// Voeg een eventlistener toe voor de verzendknop
sendButton.addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    const message = messageInput.value;
    
    if (message.trim() !== '') {
        if (canSendMessage()) { // Controleer of er 3 seconden zijn verstreken
            sendMessage(username, message);
            messageInput.value = '';
            lastMessageTime = Date.now(); // Bijwerken van de tijd van het laatste bericht
        } else {
            alert('Je moet 3 seconden wachten voordat je een nieuw bericht kunt sturen.');
        }
    }
});

// Eventlistener voor toetsenbord "Enter" om bericht te verzenden
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const username = document.getElementById('username-input').value;
        const message = messageInput.value;
        
        if (message.trim() !== '') {
            if (canSendMessage()) { // Controleer of er 3 seconden zijn verstreken
                sendMessage(username, message);
                messageInput.value = '';
                lastMessageTime = Date.now(); // Bijwerken van de tijd van het laatste bericht
            } else {
                alert('Je moet 3 seconden wachten voordat je een nieuw bericht kunt sturen.');
            }
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
database.ref('hackchat').orderByChild('timestamp').limitToLast(maxMessagesToShow).on('child_added', (snapshot) => {
    if (isTabActive) {
        const messageData = snapshot.val();
        const sender = messageData.sender || 'Gebruiker';
        const message = messageData.message;
        displayMessageAsAlert(sender, message);
    }
});
