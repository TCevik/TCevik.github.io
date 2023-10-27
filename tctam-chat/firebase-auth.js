// Initialize Firebase authentication
var auth = firebase.auth();

// Get the necessary elements by their IDs
var loginForm = document.getElementById('login');
var userInfo = document.getElementById('user-info');
var chat = document.getElementById('chat'); // Add chat to your code

// Function to toggle between showing/hiding the login form and user information
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    userInfo.style.display = isLoggedIn ? 'block' : 'none';
    chat.style.display = isLoggedIn ? 'block' : 'none';
}

// Check login status on page load
window.addEventListener('load', function () {
    var loggedIn = localStorage.getItem('loggedIn');
    toggleUI(loggedIn === 'true'); // Convert the value to a boolean
});

// Login / Register
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var loginEmail = document.getElementById('login-email').value;
    var loginPassword = document.getElementById('login-password').value;

    // Try to log in, if fails, attempt to register
    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (userCredential) {
            var user = userCredential.user;
            console.log('User logged in:', user.email);
            alert('Logged in!');
            toggleUI(true);
            localStorage.setItem('loggedIn', 'true'); // Set loggedIn to 'true' upon login
            localStorage.setItem('userEmail', user.email); // Save the user's email
            location.reload();
        })
        .catch(function (error) {
            auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
                .then(function (userCredential) {
                    console.log('User registered:', userCredential.user.email);
                    alert('Registration successful!');
                    toggleUI(true);
                    localStorage.setItem('loggedIn', 'true'); // Set loggedIn to 'true' upon registration
                })
                .catch(function (error) {
                    console.error('Error with logging in/registering:', error.message);
                    alert('Error with logging in/registering: ' + error.message);
                });
        });
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            console.log('User logged out');
            toggleUI(false);
            localStorage.setItem('loggedIn', 'false');
        })
        .catch(function (error) {
            console.error('Error with logging out:', error.message);
        });
});

// Add code to change password
document.getElementById('change-password-btn').addEventListener('click', function () {
    var user = firebase.auth().currentUser;

    if (user) {
        var newPassword = prompt("Enter your new password:");

        if (newPassword !== null) {
            user.updatePassword(newPassword)
                .then(function () {
                    alert('Password successfully changed.');
                })
                .catch(function (error) {
                    console.error('Error changing password:', error.message);
                    alert('Error changing password: ' + error.message);
                });
        }
    }
});

// Add code to reset password
document.getElementById('reset-password-btn').addEventListener('click', function () {
    var userEmail = prompt("Enter your email address to reset your password:");

    if (userEmail !== null) {
        firebase.auth().sendPasswordResetEmail(userEmail)
            .then(function () {
                alert('An email with instructions to reset your password has been sent to ' + userEmail);
            })
            .catch(function (error) {
                console.error('Error sending password reset email:', error.message);
                alert('Error sending password reset email: ' + error.message);
            });
    }
});