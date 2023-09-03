// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkS4WdnA5EuT8wM6NK1752lqqgosmMdnA",
  authDomain: "githubchat-77956.firebaseapp.com",
  projectId: "githubchat-77956",
  storageBucket: "githubchat-77956.appspot.com",
  messagingSenderId: "252339182035",
  appId: "1:252339182035:web:c4f84a63e10eced96b7726",
  measurementId: "G-T9W7PHQJ7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Verwijzing naar de Firebase Realtime Database
const database = firebase.database();

// Functie om een bericht te verzenden
function sendMessage(message) {
    // Verzend het bericht naar de database
    database.ref('chat').push({
        sender: 'Jij', // Hier kun je de gebruikersnaam invoegen
        message: message
    });
}

// Luister naar nieuwe berichten in de database
database.ref('chat').on('child_added', (snapshot) => {
  const messageData = snapshot.val();
  const sender = messageData.sender;
  const message = messageData.message;
  // Voeg het bericht toe aan de chatinterface
  displayMessage(sender, message);
});
