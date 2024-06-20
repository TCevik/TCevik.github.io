function notification(message) {
	var notificationElement = document.createElement("div");

	notificationElement.setAttribute('id', 'customNotification');
	notificationElement.style.position = "fixed";
	notificationElement.style.wordBreak = 'break-word';
	notificationElement.style.bottom = "0";
	notificationElement.style.backgroundColor = "var(--bg-accent-color2)";
	notificationElement.style.color = "var(--text-color)";
	notificationElement.style.padding = "15px";
	notificationElement.style.border = "1px solid var(--text-color)";
	notificationElement.style.borderRadius = "var(--border-radius2)";
	notificationElement.style.zIndex = "99999";
	notificationElement.style.opacity = "0";
	notificationElement.style.marginBottom = "10px";
	notificationElement.style.maxWidth = "90%";
	notificationElement.style.left = "50%"; // Nieuwe regel om het element te centreren
	notificationElement.style.transform = "translateX(-50%)"; // Nieuwe regel om het element te centreren

	notificationElement.innerHTML = message;

	document.body.appendChild(notificationElement);

	notificationElement.offsetHeight;

	notificationElement.style.transition = "opacity 0.3s";
	notificationElement.style.opacity = "1";

	var screenHeight = window.innerHeight;
	var notificationHeight = notificationElement.getBoundingClientRect().height;

	if (notificationHeight > 0.96 * screenHeight) {
		notificationElement.textContent = "Deze notificatie is te lang om weer te geven.";
		notificationElement.style.overflowY = 'none';
		notificationElement.style.maxHeight = 0.96 * screenHeight + 'px';
	}

	setTimeout(function () {
		notificationElement.style.opacity = "0";

		setTimeout(function () {
			document.body.removeChild(notificationElement);
		}, 300);
	}, 3000);
}

var metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1';

var head = document.querySelector('head');
head.appendChild(metaTag);

var manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/app.webmanifest';
var headElement = document.head || document.getElementsByTagName('head')[0];
headElement.insertBefore(manifestLink, headElement.firstChild);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
		.then(function (registration) {
			console.log('Service Worker geregistreerd met scope:', registration.scope);
		})
		.catch(function (error) {
			console.error('Fout bij het registreren van de Service Worker:', error);
		});
}

/* google analytics */
(function () {
	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

	var firstScript = document.getElementsByTagName('script')[0];
	firstScript.parentNode.insertBefore(script, firstScript);

	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());

	gtag('config', 'G-7KL389S9VR');
})();

document.addEventListener("DOMContentLoaded", function () {
	sideMenuNav();
});

var buttons = `
    <button onclick="window.location.href='/'">Home</button>
	<button id="toggleStylesButton">Gebruik klassieke stijl</button>
    <h3 id="algemeen">Algemeen</h3>
    <button onclick="window.open('https://www.youtube.com/@Tamer-Cevik?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
    <button onclick="window.location.href='/games/alle-games'">Games</button>
	<button onclick="window.location.href='/tctam-chat'">Chat</button>
    <button onclick="window.location.href='/blogs/alle-blogs'">Mijn blogs</button>
	<button onclick="window.location.href='/online-store'">Online Store</button>
	<button id="login-register-button-nav" onclick="window.location.href='/account/inloggen-registreren'">Inloggen / Registreren</button>

    <h3 style="margin-top: 50px;" id="tools">Handige Tools</h3>
    <button onclick="window.location.href='/tools/time-timer'">Time Timer</button>
	<button onclick="window.location.href='/tools/bookmarklets'">Bookmarklets</button>
    <button onclick="window.location.href='/tools/live-clock'">Live Klok</button>
    <button onclick="window.location.href='/tools/file-maker'">Maak bestanden naar keuze</button>
    <button onclick="window.location.href='/tools/ide'">IDE</button>
    <button onclick="window.location.href='/tools/tts'">TTS</button>

	<h3 style="margin-top: 50px;" id="schoolhacks">Voor School</h3>
	<button onclick="window.location.href='/school/hz-geluiden'">Speel geluiden van 20 - 20.000 hz (inc schoolbel)</button>
    <button onclick="window.location.href='/school/bing-chat'">Bing Ai (GPT 4)</button>
	<button onclick="window.location.href='/school/myinstants'">MyInstants</button>
    <button onclick="window.location.href='/school/rammerhead'">Proxy - Rammerhead</button>

	<h3 style="margin-top: 50px;" id="archief">Archief</h3>
    <button onclick="window.location.href='/archief/school-hack-1'">School hack 1</button>
	<button onclick="window.location.href='/archief/school-hack-2'">School hack 2</button>
    <button onclick="window.location.href='/archief/school-hack-3'">School hack 3</button>

	<h3 style="margin-top: 50px;" id="overwebsite">Over de website</h3>
	<button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSd2I8nAoty8Zp-akaEThrUnWLLBfj5V843WSkj0h8EjApAHWg/viewform', '_blank')">Rapporteer een fout</button>
	<button onclick="window.open('/terms-of-service', '_blank')">Terms of Service</button>
	<button onclick="window.open('/privacy-policy', '_blank')">Privacy Policy</button>
	<button onclick="window.open('https://github.com/TCevik/TCevik.github.io', '_blank')">Bekijk de broncode van de site</button>
`;

function sideMenuNav() {
	var sideBar = document.createElement("div");
	sideBar.id = "sidebar";
	sideBar.style.backgroundColor = "var(--background-color)";
	sideBar.style.color = "#fff";
	sideBar.style.borderRight = "1px solid var(--h1234-color)";
	sideBar.style.width = "0";
	sideBar.style.height = "100%";
	sideBar.style.position = "fixed";
	sideBar.style.top = "0";
	sideBar.style.left = "0px";
	sideBar.style.zIndex = "9999";
	sideBar.style.overflowX = "hidden";
	sideBar.style.transition = "0.5s";

	sideBar.innerHTML = buttons;

	var openButton = document.createElement("button");
	openButton.id = "openButton";
	openButton.textContent = ">";
	openButton.style.position = "fixed";
	openButton.style.left = "-5px";
	openButton.style.borderTopLeftRadius = "0px";
	openButton.style.borderBottomLeftRadius = "0px";
	openButton.style.paddingTop = "75px";
	openButton.style.userSelect = "none";
	openButton.style.paddingBottom = "75px";
	openButton.style.zIndex = "9998";
	openButton.style.minWidth = "35px";
	openButton.style.top = "50%";
	openButton.style.zIndex = "10000";
	openButton.style.transform = "translateY(-50%)";

	function adjustOpenButtonPosition() {
		if (sideBar.style.width === "300px") {
			openButton.style.left = "295px";
			openButton.textContent = "<";
		} else {
			openButton.style.left = "-5px";
			openButton.textContent = ">";
		}
	}

	openButton.addEventListener("click", function () {
		if (sideBar.style.width === "300px") {
			sideBar.style.width = "0";
			openButton.style.transition = "left 0.5s ease";
		} else {
			sideBar.style.width = "300px";
			openButton.style.transition = "left 0.5s ease";
		}
		adjustOpenButtonPosition();
	});

	document.addEventListener("click", function (event) {
		if (
			event.target !== openButton &&
			event.target !== sideBar &&
			!sideBar.contains(event.target)
		) {
			if (sideBar.style.width === "300px") {
				sideBar.style.width = "0";
				openButton.style.transition = "left 0.5s ease";
				adjustOpenButtonPosition();
			}
		}
	});

	openButton.addEventListener("transitionend", function () {
		openButton.style.transition = "";
	});

	document.body.appendChild(openButton);
	document.body.appendChild(sideBar);

	const loggedIn = localStorage.getItem('loggedIn');
	if (loggedIn === 'true') {
		document.getElementById('login-register-button-nav').style.display = 'none';
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const currentURL = window.location.pathname;

	if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?') &&
		!currentURL.startsWith('/account/') && !currentURL.startsWith('/account?')) {

		const loginButton = document.createElement("div");
		loginButton.style.position = "fixed";
		loginButton.style.top = "6px";
		loginButton.style.right = "6px";
		loginButton.style.zIndex = "9999";
		document.body.appendChild(loginButton);

		function updateLoginButton() {
			const loggedIn = localStorage.getItem('loggedIn');

			if (loggedIn === 'true') {
				let userPhotoURL = getCookie('userPhotoURL');
				if (!userPhotoURL || !isValidURL(userPhotoURL)) {
					userPhotoURL = "/assets/no-icon.jpg";
				}
				const img = document.createElement("img");
				img.src = userPhotoURL;
				img.alt = "User Photo";
				img.style.userSelect = "none";
				img.style.width = "50px";
				img.style.height = "50px";
				img.style.cursor = "pointer";
				img.style.borderRadius = "50%";
				loginButton.appendChild(img);
				loginButton.addEventListener("click", function () {
					const popupWidth = Math.floor(window.outerWidth * 0.75);
					const popupHeight = Math.floor(window.outerHeight * 0.8);
					const leftPosition = (window.screen.width - popupWidth) / 2;
					const topPosition = (window.screen.height - popupHeight) / 2;
					const newWindow = window.open("/account", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
				});
			} else {
				const loginLink = document.createElement("button");
				loginLink.textContent = "Inloggen";
				loginLink.onclick = function () {
					const popupWidth = Math.floor(window.outerWidth * 0.75);
					const popupHeight = Math.floor(window.outerHeight * 0.8);
					const leftPosition = (window.screen.width - popupWidth) / 2;
					const topPosition = (window.screen.height - popupHeight) / 2;
					const newWindow = window.open("/account/inloggen-registreren", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
				};
				loginButton.appendChild(loginLink);
			}
		}

		function getCookie(name) {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
		}

		function isValidURL(string) {
			try {
				new URL(string);
				return true;
			} catch (_) {
				return false;
			}
		}

		updateLoginButton();
	}
});
























document.addEventListener('DOMContentLoaded', function () {
	const toggleStylesButton = document.getElementById('toggleStylesButton');
	const head = document.head || document.getElementsByTagName('head')[0];

	let styleAdded = false;
	let styleElement;

	// Functie om de stijl toe te voegen of te verwijderen
	function toggleStyle() {
		if (!styleAdded) {
			styleElement = document.createElement('style');
			styleElement.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap');

body {
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0 auto;
    padding: 0;
    position: relative;
    width: calc(100% - 40px);
    margin-left: 20px;
    text-align: center;
    transition: 0.5s;
    scroll-behavior: smooth;
}

/* light mode and dark mode */
:root {
    --background-color: #fbfffd;
    --text-color: #000000;
    --h1234-color: #38761d;
    --custom-link-color: #38761d;
    --font-size: 16px;
    --h1-font-size: 46px;
    --h2-font-size: 36px;
    --h3-font-size: 26px;
    --h4-font-size: 22px;
    --button-padding: 7px;
    --button-bgcolor: #379429;
    --button-shadow: hsl(112, 56%, 31%);
    --bg-accent-color1: #e0fde9;
    --bg-accent-color2: #c7ead2;
    --border-radius1: 10px;
    --border-radius2: 25px;
    --border-radius3: 50px;
    --border-radius4: 50vw;
    overflow-x: hidden;
    transition: 0.5s;
    font-family: Lexend, Arial, sans-serif;
}

/* dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #0d1710;
        --text-color: #ffffff;
        --h1234-color: #7fff48;
        --custom-link-color: #33ff33;
        --button-bgcolor: #38761d;
        --button-shadow: #2c5c17;
        --bg-accent-color1: #16301f;
        --bg-accent-color2: #133820;
    }
}

.diff-color-section1 {
    width: 80%;
    background-color: var(--bg-accent-color1);
    padding: 20px;
    margin: 0 auto;
    border-radius: var(--border-radius3);
    margin-top: 20px;
    align-items: center;
}

.diff-color-section2 {
    width: 80%;
    background-color: var(--bg-accent-color2);
    padding: 20px;
    margin: 0 auto;
    border-radius: var(--border-radius3);
    margin-top: 20px;
    align-items: center;
}

h1 {
    color: var(--h1234-color);
    font-size: var(--h1-font-size);
    margin-bottom: 10px;
}

h2 {
    color: var(--h1234-color);
    font-size: var(--h2-font-size);
    margin-bottom: 15px;
}

h3 {
    color: var(--h1234-color);
    font-size: var(--h3-font-size);
    margin-bottom: 5px;
}

h4 {
    color: var(--h1234-color);
    font-size: var(--h4-font-size);
    margin-bottom: 5px;
    margin-top: 15px;
}

p,
label {
    font-size: var(--font-size);
    line-height: 1.5;
    overflow-wrap: break-word;
}

a {
    font-size: var(--font-size);
    color: var(--custom-link-color);
    text-decoration: none;
    border-bottom: 1px solid var(--custom-link-color);
    line-height: 1;
}

button {
    position: relative;
    font-family: Lexend, Arial, sans-serif;
    border-radius: var(--border-radius1);
    font-weight: inherit;
    outline: none;
    border: solid var(--button-bgcolor);
    background-color: var(--button-bgcolor);
    color: #ffffff;
    padding: var(--button-padding);
    font-size: var(--font-size);
    margin: 0.3%;
    transition: filter 0.2s, transform 0.3s, border-radius 0.75s, border-color 0.3s;
    transform-origin: center;
    z-index: 1;
}

button:hover {
    border: solid #58bf33;
    cursor: pointer;
    border-radius: var(--border-radius1);
    padding: var(--button-padding);
    filter: brightness(120%);
    z-index: 2;
}

button:focus {
    border: solid #58bf33;
    border-radius: var(--border-radius1);
}

button:disabled {
    filter: brightness(0.75) !important;
    border: red 3px solid !important;
    cursor: not-allowed !important;
}

img {
    border-radius: var(--border-radius1);
}

input,
textarea {
    border-radius: var(--border-radius1);
    padding: 10px;
    outline: none;
    margin: 20px;
    border: solid var(--text-color);
    font-size: var(--text-size);
    color: var(--text-color);
    transition: border-color 0.3s;
    background-color: var(--background-color);
    font-family: Lexend, Arial, sans-serif;
    text-align: left;
    resize: none;
}

input:hover,
input:focus,
textarea:hover,
textarea:focus {
    border: solid #58bf33;
}

input::placeholder,
textarea::placeholder {
    color: var(--text-color);
}

#sidebar button {
    width: 90%;
    text-align: center;
}

/* Change things like scrollbar and select text */
::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: var(--h1234-color);
    border-radius: 6px;
}

::-moz-scrollbar {
    width: 12px;
}

::-moz-scrollbar-track {
    background-color: transparent;
}

::-moz-scrollbar-thumb {
    background-color: var(--h1234-color);
    border-radius: 6px;
}

::selection {
    background-color: #58bf33;
    color: #fff;
}

::-webkit-progress-bar,
::-moz-progress-bar {
    background-color: #58bf33;
}
	`;

			head.appendChild(styleElement);
			styleAdded = true;
			toggleStylesButton.textContent = 'Gebruik nieuwe stijl';

			// Opslaan in localStorage
			localStorage.setItem('styleAdded', 'true');
		} else {
			if (styleElement && styleElement.parentNode === head) {
				head.removeChild(styleElement);
			}

			styleAdded = false;
			toggleStylesButton.textContent = 'Gebruik klassieke stijl';

			// Opslaan in localStorage
			localStorage.setItem('styleAdded', 'false');
		}
	}

	// Controleren en herstellen van de voorkeursstatus bij het laden van de pagina
	const storedStyleAdded = localStorage.getItem('styleAdded');
	if (storedStyleAdded === 'true') {
		toggleStyle(); // Voeg de stijl toe als deze was opgeslagen als toegevoegd
	}

	// Event listener toevoegen aan de knop
	toggleStylesButton.addEventListener('click', toggleStyle);
});