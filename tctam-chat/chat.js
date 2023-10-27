// Initialize Firebase Realtime Database
const database = firebase.database();

// Get necessary elements by their IDs
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output');

// Variables to keep track of last message times and Enter key status
let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;
let enterKeyEnabled = true;

// Check if a user can send a message based on email and time since last message
function canSendMessage(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com' || email === 'tamer.cevik@vlietlandcollege.nl' || email === 'timo.witteveen@vlietlandcollege.nl') {
        const timeSinceLastMessage = currentTime - lastMessageTimeForSpecialEmail;
        return timeSinceLastMessage >= 0;
    } else {
        const timeSinceLastMessage = currentTime - lastMessageTime;
        return timeSinceLastMessage >= 3000;
    }
}

// Update the last message time for a specific email
function updateLastMessageTime(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        lastMessageTimeForSpecialEmail = currentTime;
    } else {
        lastMessageTime = currentTime;
    }
}

// Function to send a message to the database
function sendMessage(email, message) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        email: email,
        message: message,
    };

    database.ref('chat').push(messageData);
}

// Update the send button status based on email verification
function updateSendButtonStatus(emailVerified) {
    if (emailVerified) {
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
        enterKeyEnabled = true;
    } else {
        sendButton.disabled = true;
        sendButton.textContent = 'Verify your email to send';
        enterKeyEnabled = false;
    }
}

// Event listener for the send button click
sendButton.addEventListener('click', () => {
    const email = firebase.auth().currentUser.email;
    const message = messageInput.value;

    if (message.trim() !== '') {
        if (canSendMessage(email)) {
            sendMessage(email, message);
            messageInput.value = '';
            updateLastMessageTime(email);
        } else {
            alert('Please wait before sending a new message.');
        }
    }
});

// Event listener for the Enter key press
messageInput.addEventListener('keydown', (event) => {
    const email = firebase.auth().currentUser.email;
    const message = messageInput.value;

    if (event.key === 'Enter' && enterKeyEnabled) {
        if (message.trim() !== '') {
            if (canSendMessage(email)) {
                sendMessage(email, message);
                messageInput.value = '';
                updateLastMessageTime(email);
            } else {
                alert('Please wait before sending a new message.');
            }
        }
    }
});

// Function to check if email is verified
function checkEmailVerification() {
    const user = firebase.auth().currentUser;
    if (user) {
        updateSendButtonStatus(user.emailVerified);

        if (!user.emailVerified) {
            alert('Your email is not verified. A verification email has been sent.');
            user.sendEmailVerification().catch((error) => {
                console.error('Error sending verification email:', error);
            });
        }
    }
}

// Check authentication state change
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkEmailVerification();
    }
});

// Listen for new child added to 'chat' in the database
database.ref('chat').orderByChild('timestamp').limitToLast(300).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const email = messageData.email;
    const message = messageData.message;

    const messageElement = document.createElement('div');
    const messageContent = linkifyText(message); // Function to convert links in text to clickable <a> tags
    messageElement.innerHTML = email + ': ' + messageContent;

    chatOutput.insertBefore(messageElement, chatOutput.firstChild);
});

// Function to convert text into clickable links
function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}
