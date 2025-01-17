
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const dashboard = document.getElementById('dashboard');
const loginFormContainer = document.getElementById('login-form-container');

firebase.auth().onAuthStateChanged((user) => {
    const defaultProfilePicture = 'https://tctam.nl/assets/no-icon.jpg'

    if (user) {
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = userName;

        const userEmail = user.email;
        document.getElementById('email').textContent = userEmail;

        const profilePicUrl = user.photoURL || defaultProfilePicture;
        document.getElementById('profile-image').src = profilePicUrl;

        const emailVerifiedMessage = user.emailVerified
            ? "Your email is verified."
            : "Your email is not verified.";
        const emailStatus = document.getElementById('verification-status');
        emailStatus.textContent = emailVerifiedMessage;
        emailStatus.style.marginTop = "-10px";
        emailStatus.style.color = user.emailVerified ? "green" : "red";
        document.getElementById('dashboard').appendChild(emailStatus);

        if (!user.emailVerified) {
            user.sendEmailVerification()
                .then(() => {
                    notification("Verification email sent.");
                })
                .catch((error) => {
                    console.error("Error sending verification email: ", error);
                    notification("Error sending verification email: " + error);
                });
        }

        if (!user.photoURL) {
            user.updateProfile({
                photoURL: defaultProfilePicture
            }).catch((error) => {
                console.error("Error updating profile picture: ", error);
                notification("Error updating profile picture: " + error);
            });
        }

        dashboard.style.display = "block";
        loginFormContainer.style.display = "none";

        document.getElementById('user-name-edit').addEventListener('click', () => {
            openNameChangePopup();
        });

        document.getElementById('user-name').addEventListener('click', () => {
            openNameChangePopup();
        });

        function openNameChangePopup() {
            document.getElementById('change-name-popup').style.display = "block";
            document.getElementById('new-name-url').value = user.displayName;
        }

        document.getElementById('cancel-name-url').addEventListener('click', () => {
            document.getElementById('change-name-popup').style.display = "none";
        });

        document.getElementById('save-name-url').addEventListener('click', () => {
            const newName = document.getElementById('new-name-url').value;
            if (newName) {
                user.updateProfile({
                    displayName: newName
                }).then(() => {
                    document.getElementById('user-name').textContent = newName;
                    document.getElementById('change-name-popup').style.display = "none";
                }).catch((error) => {
                    if (error.code === 'auth/invalid-profile-attribute' && error.message.includes('Display name too long')) {
                        notification("The name you entered is too long. Choose a shorter name and try again.");
                    } else {
                        console.error("Error updating display name: ", error);
                        notification("Error updating display name: " + error);
                    }
                });
            }
        });

        document.getElementById('profile-image').addEventListener('click', () => {
            document.getElementById('change-profile-popup').style.display = "block";
            document.getElementById('new-pfp-url').value = user.photoURL;
        });

        document.getElementById('cancel-pfp-url').addEventListener('click', () => {
            document.getElementById('change-profile-popup').style.display = "none";
        });

        document.getElementById('save-pfp-url').addEventListener('click', () => {
            const newUrl = document.getElementById('new-pfp-url').value;
            if (newUrl) {
                user.updateProfile({
                    photoURL: newUrl
                }).then(() => {
                    document.getElementById('profile-image').src = newUrl;
                    document.getElementById('change-profile-popup').style.display = "none";
                }).catch((error) => {
                    console.error("Error updating profile picture: ", error);
                    notification("Error updating profile picture: " + error);
                });
            }
        });

        document.getElementById('remove-pfp-url').addEventListener('click', () => {
            user.updateProfile({
                photoURL: defaultProfilePicture
            }).then(() => {
                document.getElementById('profile-image').src = defaultProfilePicture;
                document.getElementById('change-profile-popup').style.display = "none";
            }).catch((error) => {
                console.error("Error updating profile picture: ", error);
                notification("Error updating profile picture: " + error);
            });
        });
    } else {
        dashboard.style.display = "none";
        loginFormContainer.style.display = "block";
    }
});

document.getElementById('upload-pfp').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let maxWidth = 300;
                let maxHeight = 300;
                let quality = 1.0;
                let base64String = "";

                const compressImage = () => {
                    const aspectRatio = img.width / img.height;

                    if (img.width > img.height) {
                        maxHeight = maxWidth / aspectRatio;
                    } else {
                        maxWidth = maxHeight * aspectRatio;
                    }

                    canvas.width = Math.floor(maxWidth);
                    canvas.height = Math.floor(maxHeight);

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    base64String = canvas.toDataURL('image/webp', quality);

                    if (base64String.length > 2048) {
                        if (quality > 0.3) {
                            quality -= 0.1;
                        } else {
                            maxWidth *= 0.9;
                            maxHeight *= 0.9;
                        }
                        compressImage();
                    }
                };

                compressImage();

                if (base64String.length <= 2048) {
                    firebase.auth().currentUser.updateProfile({
                        photoURL: base64String
                    }).then(() => {
                        document.getElementById('profile-image').src = base64String;
                        document.getElementById('change-profile-popup').style.display = "none";
                        notification("Profile picture updated successfully!");
                    }).catch((error) => {
                        console.error("Error updating profile picture:", error);
                        notification("Error updating profile picture: " + error);
                    });
                } else {
                    notification("Unable to compress image sufficiently. Please upload a smaller image.");
                }
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    } else {
        notification("No file selected.");
    }
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            dashboard.style.display = "none";
            loginFormContainer.style.display = "block";
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
            notification('Error logging out: ' + error)
        });
});