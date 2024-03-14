const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output');

let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;
let enterKeyEnabled = false;

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
    const photoURL = user.photoURL ? user.photoURL : '/assets/no-icon.jpg';

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
    const photoURL = user.photoURL ? user.photoURL : '/assets/no-icon.jpg';

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

firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        deleteOldMessages();
        sendButton.disabled = false; // Als de gebruiker geverifieerd is, schakel de verzendknop in
        enterKeyEnabled = true; // Als de gebruiker geverifieerd is, schakel de enter-toets in
    } else {
        sendButton.disabled = true; // Als de gebruiker niet geverifieerd is, schakel de verzendknop uit
        enterKeyEnabled = false; // Als de gebruiker niet geverifieerd is, schakel de enter-toets uit
        sendButton.innerText = 'Verifieer uw e-mail om te verzenden. Ga naar uw profiel om de mail te ontvangen.'; // Bericht op de stuurknop voor niet-geverifieerde gebruikers
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
        deletedMessageElement.innerHTML = '<i>Dit bericht is verwijderd.</i>';
        deletedMessageElement.style.color = "var(--text-color)";
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

        if (email === 'tam.cevik123@gmail.com' || email === 'tamer.cevik@vlietlandcollege.nl') {
            emailElement.style.color = 'var(--h1234-color)';
            emailElement.style.fontSize = '1.1em';
            emailElement.style.fontStyle = "italic";
        }

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
                        '/assets/no-icon.jpg';
                }
                imgElement.style.width = '35px';
                imgElement.style.height = '35px';
                imgElement.style.borderRadius = '15px';
                imgElement.style.marginTop = '20px';
                imgElement.style.display = 'inline-block';
                imgElement.style.marginRight = '5px';
                emailElement.insertBefore(imgElement, emailElement.firstChild);
                urlChecked = true;
                chatOutput.scrollTop = chatOutput.scrollHeight;
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

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.style.padding = '0';
    deleteButton.style.margin = '0';
    deleteButton.style.background = 'none';
    deleteButton.style.border = 'none';
    deleteButton.style.position = 'absolute'; // Add this line
    deleteButton.style.right = '-40px'; // Add this line
    deleteButton.style.color = 'red';
    deleteButton.style.zIndex = '1';
    deleteButton.style.fontSize = 'inherit';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.userSelect = 'none';

    if (currentUserEmail === "tam.cevik123@gmail.com") {
        if (currentUserEmail === email) {
            deleteButton.addEventListener('click', () => {
                database.ref('chat').child(snapshot.key).remove();
                notification('Je bericht is succesvol verwijderd.');
            });

            messageElement.appendChild(deleteButton);
        } else {
            deleteButton.addEventListener('click', () => {
                database.ref('chat').child(snapshot.key).remove();
                notification('Het bericht is succesvol verwijderd als moderator.');
            });

            messageElement.appendChild(deleteButton);
        }
    } else if (currentUserEmail === email) {
        deleteButton.addEventListener('click', () => {
            database.ref('chat').child(snapshot.key).remove();
            notification('Je bericht is succesvol verwijderd.');
        });

        messageElement.appendChild(deleteButton);
    }

    const timeElement = document.createElement('i');
    const messageTime = new Date(timestamp).toLocaleString();
    timeElement.textContent = ' (' + email + ') ' + ' (' + messageTime + ')';
    timeElement.style.marginLeft = '30px';
    timeElement.style.color = 'var(--h1234-color)';
    timeElement.style.zIndex = '5';
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

    while ((match = urlRegex.exec(text)) !== null) {
        const before = text.substring(lastIndex, match.index);
        const linkNode = document.createElement('a');
        linkNode.href = match[0];
        linkNode.target = "_blank";
        linkNode.textContent = match[0];

        const normalTextNode = document.createTextNode(before);

        messageNode.appendChild(normalTextNode);
        messageNode.appendChild(linkNode);

        lastIndex = urlRegex.lastIndex;
    }

    const remainingText = text.substring(lastIndex);
    const remainingTextNode = document.createTextNode(remainingText);
    messageNode.appendChild(remainingTextNode);

    return messageNode;
}


function deleteOldMessages() {
    const messagesRef = database.ref('chat');
    messagesRef.once('value', (snapshot) => {
        const messages = snapshot.val();
        const messageCount = Object.keys(messages).length;
        if (messageCount > 150) {
            const messagesToDelete = Object.keys(messages).slice(0, messageCount - 150);
            messagesToDelete.forEach((messageKey) => {
                messagesRef.child(messageKey).remove();
            });
        }
    });
}