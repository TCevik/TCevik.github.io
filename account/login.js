loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            notification('Succesfully logged in!')
            dashboard.style.display = "block";
            loginFormContainer.style.display = "none";
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                notification('Incorrect login details.');
            } else {
                notification('An error occurred: ' + error.code + '. Please try again.');
            }
        });
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
                displayName: username
            }).then(() => {
                notification('Successfully registered!')
                const userName = user.displayName || user.email.split('@')[0];
                document.getElementById('user-name').textContent = userName;
            }).catch((error) => {
                if (error.code === 'auth/invalid-profile-attribute' && error.message.includes('Display name too long')) {
                    notification("The name you entered is too long. Choose a shorter name and try again.");
                } else {
                    console.error("Error setting display name: ", error);
                    notification("Error setting display name: " + error);
                }
            });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                notification('Email is already in use.');
            } else if (error.code === 'auth/password-does-not-meet-requirements') {
                notification('Use a password of 6 to 4096 characters, which must contain at least 1 lowercase and 1 uppercase letter.');
            }
            else {
                notification('An error occurred: ' + error.code + '. Please try again.');
            }
        });
});

document.getElementById('toggle-form').addEventListener('click', () => {
    const toggleButton = document.getElementById('toggle-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleButton.textContent = "Don't have an account? Sign up";
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleButton.textContent = "Already have an account? Sign in";
    }
});

document.getElementById('forgot-password-button').addEventListener('click', () => {
    document.getElementById('reset-password-popup').style.display = "block";
});

document.getElementById('cancel-reset-password').addEventListener('click', () => {
    document.getElementById('reset-password-popup').style.display = "none";
});

document.getElementById('send-reset-link-button').addEventListener('click', function () {
    const email = document.getElementById('reset-password-email').value;

    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                notification("Reset link sent! Check your email.");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
                notification("Error sending reset email. Please try again." + error);
            });
    } else {
        notification("Please enter a valid email address.");
    }
});