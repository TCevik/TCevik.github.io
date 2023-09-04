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
function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = `${sender}: ${message}`;
  chatMessages.appendChild(messageElement);

  var destination = document.getElementById("message-input").offsetTop;

  window.scrollTo({
      top: destination,
      behavior: "smooth"
  });
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

// Inloggen met e-mail en wachtwoord
function loginWithEmailAndPassword(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Gebruiker succesvol ingelogd
      const user = userCredential.user;
      console.log(`Gebruiker ingelogd: ${user.email}`);
    })
    .catch((error) => {
      // Inlogfout, toon een foutmelding aan de gebruiker
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Fout bij inloggen: ${errorMessage}`);
    });
}

// Eventlistener voor inloggen
loginButton.addEventListener('click', () => {
  const email = document.getElementById('login-email-input').value;
  const password = document.getElementById('login-password-input').value;
  
  if (email.trim() !== '' && password.trim() !== '') {
    loginWithEmailAndPassword(email, password);
  }
});


// Verkrijg referenties naar de chat-input en de verzendknop
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Controleer de inlogstatus van de gebruiker
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Gebruiker is ingelogd, toon de chat-invoer en verzendknop
    chatContainer.style.display = 'block';
  } else {
    // Gebruiker is niet ingelogd, verberg de chat-invoer en verzendknop
    chatContainer.style.display = 'none';
  }
});
