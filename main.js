// Voeg hier je Firebase-configuratiegegevens toe
const firebaseConfig = {
  apiKey: "AIzaSyAkS4WdnA5EuT8wM6NK1752lqqgosmMdnA",
  authDomain: "githubchat-77956.firebaseapp.com",
  projectId: "githubchat-77956",
  databaseURL: "https://githubchat-77956-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "githubchat-77956.appspot.com",
  messagingSenderId: "252339182035",
  appId: "1:252339182035:web:c4f84a63e10eced96b7726",
  measurementId: "G-T9W7PHQJ7S"
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
function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = `${sender}: ${message}`;
  chatMessages.appendChild(messageElement);
}

// Luister naar nieuwe berichten in de database
database.ref('chat').on('child_added', (snapshot) => {
  const messageData = snapshot.val();
  const sender = messageData.sender || 'Anoniem'; // Vervang 'Anoniem' door de daadwerkelijke gebruikersnaam
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