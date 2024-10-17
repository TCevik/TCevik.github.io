let cookies = document.cookie;
let now = new Date();
let deadline = new Date('2024-10-25T16:00:00');
if (now < deadline && (!cookies.includes('visittctamquiz') || cookies.includes('visittctamquiz=false'))) {
    alert('De site is voor een tijdje onbereikbaar vanwege een probleem. Hij is weer beschikbaar op 25 oktober om 16:00. Dankjewel voor je begrip!');
    window.location.href = 'about:blank';
}

/* google adsense */
var adScript = document.createElement('script');
adScript.async = true;
adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8924607946192862";
adScript.setAttribute('crossorigin', 'anonymous');
document.head.appendChild(adScript);

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
	function checkPageAndRunSideMenuNav() {
		const currentPath = window.location.pathname;
		if (currentPath !== '/games/tctam-casino') {
			sideMenuNav();
		}
	}
	checkPageAndRunSideMenuNav();
});

var buttons = `
    <button onclick="window.location.href='/'">Home</button>
    <h3 id="algemeen">Algemeen</h3>
    <button onclick="window.open('https://www.youtube.com/@Tamer-Cevik?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
    <button onclick="window.location.href='/games'">Games</button>
    <button onclick="window.location.href='/blogs/alle-blogs'">Mijn blogs</button>
	<button onclick="window.location.href='/online-store'">Online Store</button>

    <h3 style="margin-top: 50px;" id="tools">Handige Tools</h3>
	<button onclick="window.location.href='/picto-planner'">Picto Planner</button>
	<button onclick="window.location.href='/tools/tctam-docs'">TC_tam Documenten</button>
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
	sideBar.style.zIndex = "99999";
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
}