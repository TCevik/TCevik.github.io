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

var existingNotification = null;
function removeNotification() {
	if (existingNotification) {
		document.body.removeChild(existingNotification);
		existingNotification = null;
	}
}
function notification(message) {
	removeNotification();

	var notification = document.createElement('div');
	notification.setAttribute('id', 'customNotification');
	notification.style.position = 'fixed';
	notification.style.bottom = '20px';
	notification.style.left = '20px';
	notification.style.wordBreak = 'break-word';
	notification.style.backgroundColor = 'var(--background-color)';
	notification.style.padding = '10px';
	notification.style.border = '1px solid var(--text-color)';
	notification.style.borderRadius = '5px';
	notification.style.textAlign = 'left';
	notification.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.5)';
	notification.style.display = 'flex';
	notification.style.alignItems = 'center';
	notification.style.zIndex = '9999';

	var notificationElement = document.createElement('span');
	notificationElement.textContent = message;
	notificationElement.style.flex = '1';
	notification.appendChild(notificationElement);

	var closeNotificationButton = document.createElement('span');
	closeNotificationButton.textContent = 'X';
	closeNotificationButton.style.marginLeft = '5px';
	closeNotificationButton.style.cursor = 'pointer';
	closeNotificationButton.style.fontWeight = 'bold';
	closeNotificationButton.style.userSelect = 'none';
	closeNotificationButton.onclick = function () {
		removeNotification();
	};
	notification.appendChild(closeNotificationButton);

	document.body.appendChild(notification);
	existingNotification = notification;

	var screenHeight = window.innerHeight;
	var notificationHeight = notification.getBoundingClientRect().height;

	if (notificationHeight > 0.9 * screenHeight) {
		notificationElement.textContent = "Deze notificatie is te lang om weer te geven.";
		notification.style.overflowY = 'none';
		notification.style.maxHeight = 0.9 * screenHeight + 'px';
	}
}

document.addEventListener("DOMContentLoaded", function () {
	sideMenuNav();
});

var buttons = `
	<button onclick="window.location.href='/'">Home</button>
	<p style="display: none;" id="install-text"></p>
    <button style="display: none;" id="install">Installeer de TC_tam app</button>

	<h3 id="algemeen">Algemeen</h3>
	<button onclick="window.open('https://www.youtube.com/@YT.TC_tam?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
	<button onclick="window.location.href='/games'">Games</button>

	<h3 style="margin-top: 50px;" id="tools">Handige Tools</h3>
	<button onclick="window.location.href='/tools/time-timer'">Time Timer</button>
	<button onclick="window.location.href='/tools/hz-geluiden'">Speel geluiden van 20 - 20.000 hz (inc schoolbel)</button>
	<button onclick="window.location.href='/tools/ide'">IDE</button>

	<h3 style="margin-top: 50px;" id="answers">School Antwoorden</h3>
	<button onclick="window.location.href='https://docs.google.com/document/d/1GJoZwF2rXrPBnTExhcwztkuhs5evwI7x04U0WGPr_E4/view'">Antwoorden HAVO 2 Nieuw Nederlands</button>
	<button onclick="window.location.href='https://drive.google.com/file/d/1rxxmBaUypzZLDiGK9psBTB_Wjpie7-4Z/preview'">Antwoorden HAVO 3 Nieuw Nederlands</button>

	<h3 style="margin-top: 50px;" id="overwebsite">Over de website</h3>
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
	sideBar.style.zIndex = "9998";
	sideBar.style.overflowX = "hidden";
	sideBar.style.transition = "0.5s";

	// Voeg de knoppen toe aan de sidebar
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
	openButton.style.zIndex = "9999";
	openButton.style.minWidth = "35px";
	openButton.style.top = "50%";
	openButton.style.transform = "translateY(-50%)";

	function adjustOpenButtonPosition() {
		if (sideBar.style.width === "300px") {
			openButton.style.left = "296px";
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
    document.querySelector("#install").style.display="none";
});

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome === 'accepted') {
            showInstallationResult('Nice, veel plezier met de TC_tam app!');
            document.querySelector("#install").style.display="none";
        } else if (outcome === 'dismissed') {
            showInstallationResult('Jammer, ik hoop dat je hem de volgende keer wel zal installeren.');
        }
    }
}

function showInstallationResult(message) {
    const installText = document.querySelector("#install-text");
    installText.textContent = message;
}