// Verwijzing naar de Firebase Realtime Database
const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output'); // Voeg chat-output toe

// Voeg een variabele toe om de tijd van het laatste verzonden bericht bij te houden
let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;

// Voeg een timer toe om de wachttijd te regelen
function canSendMessage(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        const timeSinceLastMessage = currentTime - lastMessageTimeForSpecialEmail;
        return timeSinceLastMessage >= 0; // Direct verzenden voor specifieke e-mail
    } else {
        const timeSinceLastMessage = currentTime - lastMessageTime;
        return timeSinceLastMessage >= 3000; // 3000 milliseconden = 3 seconden voor andere e-mails
    }
}

// Eventlistener om berichttijd bij te werken
function updateLastMessageTime(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        lastMessageTimeForSpecialEmail = currentTime;
    } else {
        lastMessageTime = currentTime;
    }
}

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

// Voeg een eventlistener toe voor de verzendknop
sendButton.addEventListener('click', () => {
    const email = firebase.auth().currentUser.email; // Haal de huidige gebruikerse-mail op
    const message = messageInput.value;
    
    if (message.trim() !== '') {
        if (canSendMessage(email)) { // Controleer of er 3 seconden zijn verstreken (of direct voor specifieke e-mail)
            sendMessage(email, message); // Stuur de e-mail mee met het bericht
            messageInput.value = '';
            updateLastMessageTime(email); // Bijwerken van de tijd van het laatste bericht
        } else {
            alert('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
        }
    }
});

// Eventlistener voor toetsenbord "Enter" om bericht te verzenden
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const email = firebase.auth().currentUser.email; // Haal de huidige gebruikerse-mail op
        const message = messageInput.value;
        
        if (message.trim() !== '') {
            if (canSendMessage(email)) { // Controleer of er 3 seconden zijn verstreken (of direct voor specifieke e-mail)
                sendMessage(email, message); // Stuur de e-mail mee met het bericht
                messageInput.value = '';
                updateLastMessageTime(email); // Bijwerken van de tijd van het laatste bericht
            } else {
                alert('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
            }
        }
    }
});

database.ref('chat').orderByChild('timestamp').limitToLast(50).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const email = messageData.email; // Haal de e-mail op uit het bericht
    const message = messageData.message;
    
    // Maak een nieuw HTML-element voor het bericht
    const messageElement = document.createElement('div');
    messageElement.textContent = email + ': ' + message;
    
    // Voeg het bericht toe aan de chat-output aan het begin (bovenaan)
    chatOutput.insertBefore(messageElement, chatOutput.firstChild);
});
