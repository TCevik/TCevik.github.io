/* accepteer acceptTosPpPopup */
document.addEventListener('DOMContentLoaded', function () {
	var tosAndPpVersion = 1;
	if (!localStorage.getItem('acceptacceptTosPpPopup' + tosAndPpVersion)) {
		var acceptTosPpPopup = document.createElement('div');
		acceptTosPpPopup.id = 'acceptTosPpPopup';
		acceptTosPpPopup.className = 'acceptTosPpPopup';

		var text = 'Door deze site te gebruiken ga je akkoord met de <a href="/privacy-policy">privacy policy</a> en de <a href="/terms-of-service">terms of service</a>.';
		acceptTosPpPopup.innerHTML = text;

		var button = document.createElement('button');
		button.innerHTML = 'Ok';

		button.addEventListener('click', function () {
			var opacity = 1;
			var intervalId = setInterval(function () {
				opacity -= 0.05;
				acceptTosPpPopup.style.opacity = opacity;
				if (opacity <= 0) {
					clearInterval(intervalId);
					acceptTosPpPopup.style.display = 'none';
				}
			}, 15);

			localStorage.setItem('acceptacceptTosPpPopup' + tosAndPpVersion, 'true');
		});

		acceptTosPpPopup.appendChild(button);

		document.body.appendChild(acceptTosPpPopup);
	}
});

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

// profielfoto
document.addEventListener('DOMContentLoaded', function () {
	const currentURL = window.location.pathname;

	if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?') &&
		!currentURL.startsWith('/auth/') && !currentURL.startsWith('/auth?')) {

		const loginButton = document.createElement("div");
		loginButton.style.position = "fixed";
		loginButton.style.top = "6px";
		loginButton.style.right = "6px";
		loginButton.style.zIndex = "9999px";
		document.body.appendChild(loginButton);

		function updateLoginButton() {
			const loggedIn = localStorage.getItem('loggedIn');

			if (loggedIn === 'true') {
				let userPhotoURL = getCookie('userPhotoURL');
				if (!userPhotoURL || !isValidURL(userPhotoURL)) {
					userPhotoURL = "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";
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
					window.open("/auth/account", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
				});
			} else {
				const loginLink = document.createElement("button");
				loginLink.textContent = "Inloggen";
				loginLink.onclick = function () {
					const popupWidth = Math.floor(window.outerWidth * 0.75);
					const popupHeight = Math.floor(window.outerHeight * 0.8);
					const leftPosition = (window.screen.width - popupWidth) / 2;
					const topPosition = (window.screen.height - popupHeight) / 2;
					window.open("/auth/account", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
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

// Controleer of de pagina geladen is
document.addEventListener("DOMContentLoaded", function () {
	// Kijk of er een cookie "tabName" is
	var tabNameCookie = getCookie("tabName");
	var faviconCookie = getCookie("faviconLink");

	// Als er een cookie is, stel de tabbladnaam in op de waarde van het cookie
	if (tabNameCookie) {
		document.title = tabNameCookie;
	}

	// Als er een favicon-cookie is, stel de favicon in op basis van de link in het cookie
	if (faviconCookie) {
		setFavicon(faviconCookie);
	}
});

// Eventlistener voor het indrukken van de backspace-toets
document.addEventListener("keydown", function (event) {
	// Controleer of de backspace-toets is ingedrukt
	if (event.key === "Escape" && document.activeElement) {
		// Vraag de gebruiker om de naam van het tabblad in te vullen
		var tabName = prompt("Vul hier de naam van het tabblad in (vul reset in om alles weer normaal te krijgen):");

		// Controleer of de gebruiker "reset" heeft ingevoerd
		if (tabName === "reset") {
			// Verwijder het cookie "tabName"
			deleteCookie("tabName");

			// Verwijder het cookie "faviconLink"
			deleteCookie("faviconLink");

			location.reload();
		} else if (tabName !== null && tabName !== "") {
			// Stel de tabbladnaam in op de ingevoerde waarde
			document.title = tabName;

			// Sla de naam op in een cookie genaamd "tabName"
			setCookie("tabName", tabName);

			// Vraag de gebruiker om de link naar een afbeelding in te voeren
			var faviconLink = prompt("Vul hier de link naar een afbeelding in voor de favicon (laat leeg om geen favicon te gebruiken):");

			// Sla de link op in een cookie genaamd "faviconLink"
			setCookie("faviconLink", faviconLink);

			// Als er een favicon-link is ingevoerd, stel de favicon in
			if (faviconLink) {
				setFavicon(faviconLink);
			}

		}
	}
});

// Functie om een cookie te verwijderen
function deleteCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Functie om een cookie in te stellen
function setCookie(name, value) {
	document.cookie = name + "=" + value + "; path=/";
}

// Functie om een cookie op te halen
function getCookie(name) {
	var nameEQ = name + "=";
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		while (cookie.charAt(0) === " ") {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(nameEQ) === 0) {
			return cookie.substring(nameEQ.length, cookie.length);
		}
	}
	return null;
}

// Functie om de favicon van de pagina in te stellen
function setFavicon(faviconLink) {
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'icon';
	link.href = faviconLink;
	document.getElementsByTagName('head')[0].appendChild(link);
}

function googleTranslateElementInit() {
	new google.translate.TranslateElement({
		pageLanguage: 'nl',
	}, 'google_translate_element');

	var userLanguage = window.navigator.language.toLowerCase().split("-")[0];

	setTimeout(function () {
		var selectElement = document.querySelector('#google_translate_element select');
		selectElement.value = userLanguage;
		selectElement.dispatchEvent(new Event('change'));
	}, 2000);
}

function loadTranslateScript() {
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
	document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function () {
	var newDiv = document.createElement('div');
	newDiv.id = 'google_translate_element';
	document.body.appendChild(newDiv);
});

document.addEventListener('DOMContentLoaded', loadTranslateScript);

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

if (window.location.href === "https://free-tctam.github.io/") {
	window.location.href = "https://tcevik.github.io/";
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
	var currentUrl = window.location.href;

	if (currentUrl.includes("/blogs/") || currentUrl.includes("/blogs?")) {
		document.body.style.textAlign = "left";
	}
});

document.addEventListener("DOMContentLoaded", function () {
	sideMenuNav();
});

var buttons = `
	<button onclick="window.location.href='/'">Home</button>
	<p style="display: none;" id="install-text"></p>
    <button style="display: none;" id="install">Installeer de TC_tam app</button>
	<h3 id="algemeen">Algemeen</h3>
	<button onclick="window.open('https://www.youtube.com/@YT.TC_tam?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
	<button onclick="window.location.href='/login-exclusive'">Exclusieve Pagina's</button>
	<button onclick="window.location.href='/tools/tctam-zoeken'">TC_tam zoeken</button>
	<button onclick="window.location.href='/games/alle-games'">Games</button>
	<button onclick="window.location.href='/tctam-chat'">TC_tam Chat</button>
	<button onclick="window.location.href='/blogs/alle-blogs'">Mijn blogs</button>

	<h3 style="margin-top: 50px;" id="tools">Handige Tools</h3>
	<button onclick="window.location.href='/alle-methoden'">School unblocks</button>
	<button onclick="window.location.href='/school-hacks/bookmarklets'">Bookmarklets</button>
	<button onclick="window.location.href='/tools/time-timer'">Time Timer</button>
	<button onclick="window.location.href='/tools/live-clock'">Live Klok</button>
	<button onclick="window.location.href='/tools/bing-chat'">Bing Ai (GPT 4)</button>
	<button onclick="window.location.href='/tools/pranks'">Pranks</button>
	<button onclick="window.location.href='/tools/file-maker'">Maak bestanden naar keuze</button>
	<button onclick="window.location.href='/tools/myinstants'">MyInstants</button>
	<button onclick="window.location.href='/tools/hz-geluiden'">Speel geluiden van 20 - 20.000 hz (inc schoolbel)</button>
	<button onclick="window.location.href='/tools/notities'">Notities</button>
	<button onclick="window.location.href='/tools/ide'">IDE</button>
	<button onclick="window.location.href='/tools/tts'">TTS</button>

	<h3 style="margin-top: 50px;" id="schoolhacks">School Hacks</h3>
	<button onclick="window.location.href='https://docs.google.com/document/d/1GJoZwF2rXrPBnTExhcwztkuhs5evwI7x04U0WGPr_E4/view'">Antwoorden HAVO 2 Nieuw Nederlands</button>
	<button onclick="window.location.href='/school-hacks/antwoorden/nieuw-nederlands-havo3'">Antwoorden HAVO 3 Nieuw Nederlands</button>

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
			openButton.style.left = "297px";
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
        showResult("Hey, wil jij nou de TC_tam app downloaden? Het kost je maar 10 seconden!");
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
    showResult("Aan het installeren...");
    document.querySelector("#install").style.display="none";
});

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome === 'accepted') {
            showResult('Nice, veel plezier met de TC_tam app!');
            document.querySelector("#install").style.display="none";
        } else if (outcome === 'dismissed') {
            showResult('Jammer, ik hoop dat je hem de volgende keer wel zal installeren.');
        }
    }
}

function showResult(message) {
    const installText = document.querySelector("#install-text");
    installText.textContent = message;
}