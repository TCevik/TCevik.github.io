// Verwijzing naar de Firebase Realtime Database
const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output'); // Voeg chat-output toe

// Functie om een bericht te verzenden
function sendMessage(email, message) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        email: email, // Voeg de e-mail toe aan het bericht
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
    const email = firebase.auth().currentUser.email; // Haal de huidige gebruikerse-mail op
    const message = messageInput.value;
    
    if (message.trim() !== '') {
        if (canSendMessage()) { // Controleer of er 3 seconden zijn verstreken
            sendMessage(email, message); // Stuur de e-mail mee met het bericht
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
        const email = firebase.auth().currentUser.email; // Haal de huidige gebruikerse-mail op
        const message = messageInput.value;
        
        if (message.trim() !== '') {
            if (canSendMessage()) { // Controleer of er 3 seconden zijn verstreken
                sendMessage(email, message); // Stuur de e-mail mee met het bericht
                messageInput.value = '';
                lastMessageTime = Date.now(); // Bijwerken van de tijd van het laatste bericht
            } else {
                alert('Je moet 3 seconden wachten voordat je een nieuw bericht kunt sturen.');
            }
        }
    }
});

database.ref('chat').orderByChild('timestamp').limitToLast(50).on('child_added', (snapshot) => {
    if (isTabActive) {
        const messageData = snapshot.val();
        const email = messageData.email; // Haal de e-mail op uit het bericht
        const message = messageData.message;
        
        // Maak een nieuw HTML-element voor het bericht
        const messageElement = document.createElement('div');
        messageElement.textContent = email + ': ' + message;
        
        // Voeg het bericht toe aan de chat-output aan het begin (bovenaan)
        chatOutput.insertBefore(messageElement, chatOutput.firstChild);
    }
});
