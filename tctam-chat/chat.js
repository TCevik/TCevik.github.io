const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output'); 

let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;
let enterKeyEnabled = true;

function canSendMessage(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com' || email === 'tamer.cevik@vlietlandcollege.nl') {
        const timeSinceLastMessage = currentTime - lastMessageTimeForSpecialEmail;
        return timeSinceLastMessage >= 0;
    } else {
        const timeSinceLastMessage = currentTime - lastMessageTime;
        return timeSinceLastMessage >= 3000;
    }
}

function updateLastMessageTime(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        lastMessageTimeForSpecialEmail = currentTime;
    } else {
        lastMessageTime = currentTime;
    }
}

function updateSendButtonStatus(emailVerified) {
    if (emailVerified) {
        sendButton.disabled = false;
        sendButton.textContent = 'Verzend';
        enterKeyEnabled = true; // Schakel de Enter-toets in
    } else {
        sendButton.disabled = true;
        sendButton.textContent = 'Verifieer je e-mail om te verzenden';
        enterKeyEnabled = false; // Schakel de Enter-toets uit
    }
}

function sendMessage(email, message, displayName, photoURL) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        email: email,
        displayName: displayName,
        message: message,
        photoURL: photoURL,
    };

    database.ref('chat').push(messageData);
}

sendButton.addEventListener('click', () => {
    const user = firebase.auth().currentUser;
    const email = user.email;
    const displayName = user.displayName ? user.displayName : email;
    const message = messageInput.value;
    const photoURL = user.photoURL ? user.photoURL : 'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg';

    if (message.trim() !== '') {
        if (canSendMessage(email)) {
            sendMessage(email, message, displayName, photoURL);
            messageInput.value = '';
            updateLastMessageTime(email);
        } else {
            notification('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
        }
    }
});

messageInput.addEventListener('keydown', (event) => {
    const user = firebase.auth().currentUser;
    const email = user.email;
    const displayName = user.displayName ? user.displayName : email;
    const message = messageInput.value;
    const photoURL = user.photoURL ? user.photoURL : 'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg';

    if (event.key === 'Enter' && enterKeyEnabled) {
        if (message.trim() !== '') {
            if (canSendMessage(email)) {
                sendMessage(email, message, displayName, photoURL);
                messageInput.value = '';
                updateLastMessageTime(email);
            } else {
                notification('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
            }
        }
    }
});

// Voeg e-mailverificatie toe
function checkEmailVerification() {
    const user = firebase.auth().currentUser;
    if (user) {
        updateSendButtonStatus(user.emailVerified);

        if (!user.emailVerified) {
            notification("Je e-mailadres is nog niet geverifieerd. Ga naar je " + <a href="https://tcevik.github.io/auth/account">accountdashboard</a> + " om de mail te ontvangen.");
        }
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkEmailVerification();
        deleteOldMessages();
    }
});

const uiInput = document.getElementById('ui-input');

database.ref('chat').orderByChild('timestamp').limitToLast(1).on('value', (snapshot) => {
    const messages = snapshot.val();
    if (!messages) {
        const noMessageElement = document.createElement('div');
        noMessageElement.textContent = "Er zijn op dit moment geen berichten beschikbaar. Stuur er eens een paar zou ik zeggen!";
        chatOutput.appendChild(noMessageElement);
    }
});

let prevEmail = null;
let emailMap = {};

function updateEmailMap(email, action) {
    if (action === 'add') {
        emailMap[email] = true;
    } else if (action === 'remove') {
        delete emailMap[email];
    }
}

database.ref('chat').on('child_removed', (snapshot) => {
    const deletedMessageKey = snapshot.key;
    const deletedMessageElement = document.querySelector(`[data-key='${deletedMessageKey}']`);
    if (deletedMessageElement) {
        deletedMessageElement.innerHTML = '<i>Dit bericht is verwijderd door de auteur</i>';
    }
});

database.ref('chat').orderByChild('timestamp').limitToLast(300).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const email = messageData.email;
    const displayName = messageData.displayName;
    const message = messageData.message;
    const timestamp = messageData.timestamp;
    const photoURL = messageData.photoURL;

    const messageElement = document.createElement('div');
    const messageContent = linkifyText(message);


    if (prevEmail !== email || !emailMap[email]) {
        const emailElement = document.createElement('strong');
        emailElement.textContent = displayName + ': ';
        chatOutput.appendChild(emailElement);
        emailElement.style.display = 'block';
        emailElement.style.marginTop = '5px';
        emailElement.style.marginBottom = '5px';
        emailElement.style.marginLeft = '40px';
        emailElement.style.wordBreak = 'break-word';
        emailElement.style.textAlign = 'left';
        updateEmailMap(email, 'add');

        const imgElement = document.createElement('img');
        let urlChecked = false;

        function checkImageURL(url, callback) {
            imgElement.onload = () => callback(true);
            imgElement.onerror = () => callback(false);
            imgElement.src = url;
        }

        checkImageURL(photoURL, function (response) {
            if (!urlChecked) {
                if (response) {
                    imgElement.src = photoURL;
                } else {
                    imgElement.src =
                        'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg';
                }
                imgElement.style.width = '35px';
                imgElement.style.height = '35px';
                imgElement.style.borderRadius = '15px';
                imgElement.style.marginTop = '20px';
                imgElement.style.display = 'inline-block';
                imgElement.style.marginRight = '5px';
                emailElement.insertBefore(imgElement, emailElement.firstChild);
                urlChecked = true;
            }
        });
    }

    messageElement.appendChild(messageContent);
    chatOutput.appendChild(messageElement);

    messageElement.style.marginTop = '0px';
    messageElement.style.marginBottom = '0px';
    messageElement.style.marginLeft = '50px';
    messageElement.style.marginRight = '50px';
    messageElement.style.wordBreak = 'break-word';
    messageElement.style.textAlign = 'left';
    messageElement.style.paddingLeft = '5px';
    messageElement.style.paddingBottom = '2px';
    messageElement.style.paddingTop = '2px';
    messageElement.style.borderLeft = 'solid 4px var(--h1234-color)';
    messageElement.style.position = 'relative'; // Add this line

    messageElement.setAttribute('data-key', snapshot.key);

    chatOutput.scrollTop = chatOutput.scrollHeight;

    const currentUserEmail = firebase.auth().currentUser.email;
    if (currentUserEmail === email) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.padding = '0';
        deleteButton.style.margin = '0';
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.position = 'absolute'; // Add this line
        deleteButton.style.right = '-40px'; // Add this line
        deleteButton.style.color = 'red';
        deleteButton.style.fontSize = 'inherit';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.userSelect = 'none';

        deleteButton.addEventListener('click', () => {
            database.ref('chat').child(snapshot.key).remove();
            notification('Bericht succesvol verwijderd.');
        });

        messageElement.appendChild(deleteButton);
    }

    const timeElement = document.createElement('i');
    const messageTime = new Date(timestamp).toLocaleString();
    timeElement.textContent = ' (' + email + ') ' + ' (' + messageTime + ')';
    timeElement.style.marginLeft = '30px';
    timeElement.style.color = 'var(--h1234-color)';
    timeElement.style.paddingLeft = '5px';
    timeElement.style.backgroundColor = 'var(--background-color)';
    timeElement.style.position = 'absolute';
    timeElement.style.right = '0px';

    messageElement.appendChild(timeElement);

    timeElement.style.display = 'none';
    messageElement.style.color = 'var(--text-color)';

    messageElement.addEventListener('mouseover', () => {
        timeElement.style.display = 'inline';
        messageElement.style.color = 'var(--h1234-color)';
    });

    messageElement.addEventListener('mouseout', () => {
        timeElement.style.display = 'none';
        messageElement.style.color = 'var(--text-color)';
    });

    prevEmail = email;
});

function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const messageNode = document.createElement('span');
    let lastIndex = 0;
    text.replace(urlRegex, function (url, index) {
        const before = text.substring(lastIndex, index);
        const linkNode = document.createElement('a');
        linkNode.href = url;
        linkNode.target = "_blank";
        linkNode.textContent = url;
        messageNode.appendChild(document.createTextNode(before));
        messageNode.appendChild(linkNode);
        lastIndex = index + url.length;
    });
    if (lastIndex < text.length) {
        messageNode.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    return messageNode;
}

function deleteOldMessages() {
    const messagesRef = database.ref('chat');
    messagesRef.once('value', (snapshot) => {
        const messages = snapshot.val();
        const messageCount = Object.keys(messages).length;
        if (messageCount > 300) {
            const messagesToDelete = Object.keys(messages).slice(0, messageCount - 300);
            messagesToDelete.forEach((messageKey) => {
                messagesRef.child(messageKey).remove();
            });
        }
    });
}