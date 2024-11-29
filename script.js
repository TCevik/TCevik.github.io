/* block pages for school */
const gamePaths = ['/tools/hz-geluiden', '/tools/bookmarklets'];
if (gamePaths.some(path => window.location.pathname.startsWith(path))) {
	fetch('https://api.ipify.org?format=json')
		.then(response => response.json())
		.then(data => {
			if (data.ip === '84.35.97.220') {
				const blockedElement = document.createElement('div');
				blockedElement.id = 'blockedDuringSchool';
				blockedElement.style.position = 'fixed';
				blockedElement.style.display = 'flex';
				blockedElement.style.justifyContent = 'center';
				blockedElement.style.alignItems = 'center';
				blockedElement.style.top = '0';
				blockedElement.style.left = '0';
				blockedElement.style.width = '100vw';
				blockedElement.style.height = '100vh';
				blockedElement.style.backdropFilter = 'blur(10px)';
				blockedElement.style.zIndex = '100';

				const blockedContainer = document.createElement('div');
				blockedContainer.id = 'blockedContainer';
				blockedContainer.style.backgroundColor = 'var(--bg-accent-color1)';
				blockedContainer.style.padding = '20px';
				blockedContainer.style.borderRadius = 'var(--border-radius2)';
				blockedContainer.style.textAlign = 'center';
				blockedContainer.style.width = '600px';
				blockedContainer.style.maxWidth = '100%';

				const message = document.createElement('h3');
				message.textContent = 'Helaas is deze pagina niet beschikbaar als je op school bent.';
				message.style.margin = '0px';
				message.style.marginBottom = '10px'

				const button = document.createElement('button');
				button.textContent = 'Ben je niet op school, of ben je het er niet mee eens? Meld de fout.';
				button.addEventListener('click', () => {
					window.open('https://docs.google.com/forms/d/e/1FAIpQLSd2I8nAoty8Zp-akaEThrUnWLLBfj5V843WSkj0h8EjApAHWg/viewform', '_blank');
				});

				blockedContainer.appendChild(message);
				blockedContainer.appendChild(button);
				blockedElement.appendChild(blockedContainer);
				document.body.appendChild(blockedElement);
			}
		})
		.catch(error => console.error('Error fetching IP address:', error));
}

/* custom notification */
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
	notificationElement.style.left = "50%";
	notificationElement.style.transform = "translateX(-50%)";

	notificationElement.innerHTML = message;

	document.body.appendChild(notificationElement);

	notificationElement.offsetHeight;

	notificationElement.style.transition = "opacity 0.3s";
	notificationElement.style.opacity = "1";

	var screenHeight = window.innerHeight;
	var notificationHeight = notificationElement.getBoundingClientRect().height;

	if (notificationHeight > 0.96 * screenHeight) {
		notificationElement.textContent = "This notification is too long to display.";
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
			console.log('Service Worker registered with scope:', registration.scope);
		})
		.catch(function (error) {
			console.error('Error registering Service Worker:', error);
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

/* sidemenu */
document.addEventListener("DOMContentLoaded", function () {
	function checkPageAndRunSideMenuNav() {
		let currentPath = window.location.pathname;
		currentPath = currentPath.replace('.html', '');

		const pagesWithoutSideMenu = ['/games/tctam-casino', '/tools/live-clock', '/tools/file-maker', '/tools/tts', '/tctam-fans', '/tctam-quiz'];

		if (!pagesWithoutSideMenu.includes(currentPath)) {
			sideMenuNav();
		}
	}
	checkPageAndRunSideMenuNav();
});

var buttons = `
	<select style="width: 90%; margin-top: 10px;" id="theme-switch">
	    <option value="lightmode">Light Mode</option>
	    <option value="darkmode">Dark Mode</option>
		<option value="neutralmode">Neutral Mode</option>
		<option value="underwatermode">Underwater Mode</option>
		<option value="pinkmode">Pink Mode</option>
		<option value="highcontrast">High Contrast</option>
	</select>

    <button onclick="window.location.href='/'">Home</button>
    <h3 id="algemeen">General</h3>
    <button onclick="window.open('https://www.youtube.com/@Tamer-Cevik?sub_confirmation=1', '_blank')">My YouTube channel</button>
    <button onclick="window.location.href='/games'">Games</button>
    <button onclick="window.location.href='/blogs/alle-blogs'">My blogs (DUTCH)</button>
	<button onclick="window.location.href='/online-store'">Online Store</button>

    <h3 style="margin-top: 50px;" id="tools">Handy Tools</h3>
	<button onclick="window.location.href='/picto-planner'">Picto Planner (DUTCH)</button>
	<button onclick="window.location.href='/tools/hz-geluiden'">Play sounds from 20 - 20,000 Hz</button>
    <button onclick="window.location.href='/tools/time-timer'">Time Timer</button>
	<button onclick="window.location.href='/tools/bookmarklets'">Bookmarklets</button>
    <button onclick="window.location.href='/tools/ide'">IDE</button>
	<button onclick="window.location.href='/tools/useful-pages'">Useful Pages / Simple Tools</button>

	<h3 style="margin-top: 50px;" id="archief">Archive (DUTCH)</h3>
    <button onclick="window.location.href='/archief/school-hack-1'">School hack 1</button>
	<button onclick="window.location.href='/archief/school-hack-2'">School hack 2</button>
    <button onclick="window.location.href='/archief/school-hack-3'">School hack 3</button>

	<h3 style="margin-top: 50px;" id="overwebsite">About</h3>
	<button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSd2I8nAoty8Zp-akaEThrUnWLLBfj5V843WSkj0h8EjApAHWg/viewform', '_blank')">Report an error</button>
	<button onclick="window.open('/terms-of-service', '_blank')">Terms of Service</button>
	<button onclick="window.open('/privacy-policy', '_blank')">Privacy Policy</button>
	<button style="margin-bottom: 10px;" onclick="window.open('https://github.com/TCevik/TCevik.github.io', '_blank')">View the source code of the site</button>
`;

function sideMenuNav() {
	var sideBar = document.createElement("div");
	sideBar.id = "sidebar";
	sideBar.style.backgroundColor = "var(--background-color)";
	sideBar.style.color = "#fff";
	sideBar.style.boxShadow = "0px 0px 10px var(--h1234-color)";
	sideBar.style.width = "0";
	sideBar.style.opacity = "0"; // Start met opacity 0
	sideBar.style.position = "fixed";
	sideBar.style.top = "10px";
	sideBar.style.left = "20px";
	sideBar.style.bottom = "10px";
	sideBar.style.borderRadius = "var(--border-radius2)";
	sideBar.style.zIndex = "99999";
	sideBar.style.overflowX = "hidden";
	sideBar.style.transition = "width 0.5s, opacity 0.3s";

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
	openButton.style.minWidth = "35px";
	openButton.style.top = "50%";
	openButton.style.zIndex = "100000";
	openButton.style.transform = "translateY(-50%)";

	function adjustOpenButtonPosition() {
		if (sideBar.style.width === "300px") {
			openButton.style.left = "315px";
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
			setTimeout(() => {
				sideBar.style.opacity = "0"; // Verlaag opacity na 0.5s
			}, 500);
		} else {
			sideBar.style.width = "300px";
			sideBar.style.zIndex = "99999";
			openButton.style.transition = "left 0.5s ease";
			sideBar.style.opacity = "1"; // Toon sidebar onmiddellijk
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
				setTimeout(() => {
					sideBar.style.opacity = "0"; // Verlaag opacity na 0.5s
				}, 500);
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

/* show navigation info */
window.addEventListener('load', function () {
	let loadCount = localStorage.getItem('loadCount') || 0;


	if (loadCount === 0) {
		let openButton = document.getElementById('openButton');

		if (openButton) {
			openButton.textContent = "Click here for site navigation.";
			openButton.style.maxWidth = '150px';
			loadCount++;
		}
	}

	localStorage.setItem('loadCount', loadCount);
});

/* theme selector */
function setCorrectTheme() {
	const themeSwitch = document.getElementById("theme-switch");
	let savedTheme = localStorage.getItem("themeSetting");

	if (!savedTheme) {
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		savedTheme = prefersDark ? "darkmode" : "lightmode";
		localStorage.setItem("themeSetting", savedTheme);
	}

	if (!themeSwitch) {
		document.body.classList.add(savedTheme);
		return;
	}

	const themeOptions = Array.from(themeSwitch.options).map(option => option.value);
	if (!themeOptions.includes(savedTheme)) {
		savedTheme = themeOptions[0];
		localStorage.setItem("themeSetting", savedTheme);
	}

	document.body.classList.add(savedTheme);
	themeSwitch.value = savedTheme;

	themeSwitch.addEventListener("change", (event) => {
		const selectedTheme = event.target.value;

		document.body.classList.remove(...document.body.classList);
		document.body.classList.add(selectedTheme);
		localStorage.setItem("themeSetting", selectedTheme);
	});
}
document.addEventListener("DOMContentLoaded", () => {
	setCorrectTheme();
});