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
        	<p style="display: none;" id="install-text"></p>
            <button style="display: none;" id="install">Installeer de TC_tam app</button>
        	<h3 id="algemeen">Algemeen</h3>
        	<button onclick="window.open('https://www.youtube.com/@Tamer-Cevik?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
        	<button onclick="window.location.href='/games/alle-games'">Games</button>
			<button onclick="window.location.href='/tctam-chat'">TC_tam Chat</button>
        	<button onclick="window.location.href='/blogs/alle-blogs'">Mijn blogs</button>
			<button onclick="window.location.href='/account/inloggen-registreren'">Inloggen / Registreren</button>

        	<h3 style="margin-top: 50px;" id="tools">Handige Tools</h3>
        	<button onclick="window.location.href='/tools/time-timer'">Time Timer</button>
			<button onclick="window.location.href='/tools/bookmarklets'">Bookmarklets</button>
        	<button onclick="window.location.href='/tools/live-clock'">Live Klok</button>
        	<button onclick="window.location.href='/tools/bing-chat'">Bing Ai (GPT 4)</button>
        	<button onclick="window.location.href='/tools/pranks'">Pranks</button>
        	<button onclick="window.location.href='/tools/file-maker'">Maak bestanden naar keuze</button>
        	<button onclick="window.location.href='/tools/myinstants'">MyInstants</button>
        	<button onclick="window.location.href='/tools/hz-geluiden'">Speel geluiden van 20 - 20.000 hz (inc schoolbel)</button>
        	<button onclick="window.location.href='/tools/ide'">IDE</button>
        	<button onclick="window.location.href='/tools/tts'">TTS</button>

        	<h3 style="margin-top: 50px;" id="schoolhacks">School Hacks</h3>
        	<button onclick="window.location.href='https://docs.google.com/document/d/1GJoZwF2rXrPBnTExhcwztkuhs5evwI7x04U0WGPr_E4/view'">Antwoorden HAVO 2 Nieuw Nederlands</button>
        	<button onclick="window.location.href='/school-antwoorden/nieuw-nederlands-havo3'">Antwoorden HAVO 3 Nieuw Nederlands</button>

        	<h3 style="margin-top: 50px;" id="overwebsite">Over de website</h3>
        	<button onclick="window.location.href='/status'">TC_tam Website Status</button>
        	<button onclick="window.open('https://github.com/TCevik/TCevik.github.io/issues/new', '_blank')">Meld een bug</button>
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
}

/* installeer TC_tam website */
window.addEventListener("DOMContentLoaded", async event => {
	if ('BeforeInstallPromptEvent' in window) {
		showInstallationResult("Hey, wil jij nou de TC_tam app downloaden? Het kost je maar 10 seconden!");
	} else {
		return;
	}
	document.querySelector("#install").addEventListener("click", installApp);
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	document.querySelector("#install").style.display = "block";
	document.querySelector("#install").style.margin = "0 auto";
	document.querySelector("#install-text").style.display = "block";
	document.querySelector("#install-text").style.margin = "0 auto";
});

window.addEventListener('appinstalled', (e) => {
	showInstallationResult("Aan het installeren...");
	document.querySelector("#install").style.display = "none";
});

async function installApp() {
	if (deferredPrompt) {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		deferredPrompt = null;
		if (outcome === 'accepted') {
			showInstallationResult('Nice, veel plezier met de TC_tam app!');
			document.querySelector("#install").style.display = "none";
		} else if (outcome === 'dismissed') {
			showInstallationResult('Jammer, ik hoop dat je hem de volgende keer wel zal installeren.');
		}
	}
}

function showInstallationResult(message) {
	const installText = document.querySelector("#install-text");
	installText.textContent = message;
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
					window.open("/account", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
				});
			} else {
				const loginLink = document.createElement("button");
				loginLink.textContent = "Inloggen";
				loginLink.onclick = function () {
					const popupWidth = Math.floor(window.outerWidth * 0.75);
					const popupHeight = Math.floor(window.outerHeight * 0.8);
					const leftPosition = (window.screen.width - popupWidth) / 2;
					const topPosition = (window.screen.height - popupHeight) / 2;
					window.open("/account/inloggen-registreren", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
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