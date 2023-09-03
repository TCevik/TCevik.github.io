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
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Functie om een bericht te verzenden
function sendMessage(message) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        message: message,
    };

    // Verzend het bericht naar de database
    database.ref('chat').push(messageData);
}

// Functie om berichten weer te geven
function displayMessage(message) {
  const userName = getUserName(); // Haal de gebruikersnaam op uit de cookie
  const messageElement = document.createElement('div');
  messageElement.innerText = `${userName}: ${message}`;
  chatMessages.appendChild(messageElement);
}


// Luister naar nieuwe berichten in de database
database.ref('chat').on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const sender = messageData.sender || 'Gebruiker'; // Vervang 'Anoniem' door de daadwerkelijke gebruikersnaam
    const message = messageData.message;
    displayMessage(sender, message);
});

// Eventlistener voor verzenden van bericht
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        sendMessage(message);
        messageInput.value = '';
    }
});

// Eventlistener voor toetsenbord "Enter" om bericht te verzenden
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const message = messageInput.value;
        if (message.trim() !== '') {
            sendMessage(message);
            messageInput.value = '';
        }
    }
});

// Functie om de gebruikersnaam uit de cookie te halen
function getUserName() {
  const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('userName='))
      .split('=')[1];
  
  return cookieValue ? decodeURIComponent(cookieValue) : 'Gebruiker';
}
