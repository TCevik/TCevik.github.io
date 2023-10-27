/* accepteer popup */
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('acceptPopup')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'By using this site you will accept the <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> and the <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    button.addEventListener('click', function () {
      var opacity = 1;
      var intervalId = setInterval(function () {
        opacity -= 0.05;
        popup.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(intervalId);
          popup.style.display = 'none';
        }
      }, 15);

      localStorage.setItem('acceptPopup', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});

/* google analytics */
(function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7KL389S9VR');
})();

// Maak een nieuwe script tag element
var script = document.createElement('script');
script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8924607946192862";
script.setAttribute("crossorigin", "anonymous");
script.setAttribute("async", true);
var head = document.head || document.getElementsByTagName('head')[0];
head.appendChild(script);

document.addEventListener('DOMContentLoaded', function() {
  // Haal de huidige URL op
  const currentURL = window.location.pathname;

  // Controleer of de URL begint met '/games/' of '/games?' (en optionele queryparameters)
if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?') && 
    !currentURL.startsWith('/sites/') && !currentURL.startsWith('/sites?')) {
    // Voeg een knop toe aan de pagina
    const loginButton = document.createElement("button");
    loginButton.style.position = "fixed";
    loginButton.style.top = "3px";
    loginButton.style.right = "3px";
    document.body.appendChild(loginButton);

    // Functie om de tekst van de knop te updaten op basis van de loggedIn-cookie
    function updateLoginButton() {
        const loggedIn = localStorage.getItem('loggedIn');

        if (loggedIn === 'true') {
            loginButton.textContent = "Logged in";
        } else {
            loginButton.textContent = "Log in";
        }
    }

    // Maak een callback-functie
    const updateLoginButtonCallback = () => {
        // Voer de functie `updateLoginButton()` uit
        updateLoginButton();
    };

    updateLoginButton();

    // Voer de callback-functie elke seconde uit
    setInterval(updateLoginButtonCallback, 1000);

    // Voeg een click event listener toe aan de knop
    loginButton.addEventListener("click", function() {
        const loggedIn = localStorage.getItem('loggedIn');

        if (loggedIn === 'true') {
            window.location.href = "/tctam-chat";
        } else {
            // Navigeer naar de opgegeven URL voor inloggen
            window.location.href = "/tctam-chat";
        }
    });
  }
});


var originalTitle = document.title; // Bewaar de oorspronkelijke titel van het tabblad

// Array met de berichten die we willen weergeven wanneer de focus verloren is
var messages = [
  "TC_tam mist je!",
  "TC_tam zit hier!",
  "Hier was je bezig, bij TC_tam!",
  "TC_tam: blijf bij mij!",
  "Let goed op TC_tam!",
  "TC_tam: kom je snel Back?",
  "TC_tam: wat doe je nou?",
  "TC_tam: hier moet je zijn!"
];

var currentMessageIndex = 0; // Index van het huidige bericht

function changeTitle() {
  const stopTabNamesCookie = getCookie("stopTabNames");

  if (stopTabNamesCookie === null || stopTabNamesCookie === "false") {
    const randomIndex = Math.floor(Math.random() * messages.length);
    document.title = messages[randomIndex];
  }
}

// Functie om een cookie op te halen op basis van de naam
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Functie om de titel Back te zetten naar de oorspronkelijke titel wanneer de focus wordt hersteld
function restoreTitle() {
  const stopTabNamesCookie = getCookie("stopTabNames");

  if (stopTabNamesCookie === null || stopTabNamesCookie === "false") {
    document.title = originalTitle;
  }
}

// Luister naar het focusverlies van het tabblad en herstel van de focus
/* window.addEventListener("blur", changeTitle);
window.addEventListener("focus", restoreTitle); */

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
    var tabName = prompt("Enter the name of the tab (enter 'reset' to revert everything back to normal):");
    
    // Controleer of de gebruiker "reset" heeft ingevoerd
    if (tabName === "reset") {
      // Verwijder het cookie "tabName"
      deleteCookie("tabName");
      
      // Verwijder het cookie "faviconLink"
      deleteCookie("faviconLink");
      
      // Zet de cookie "stopTabNames" op false
      setCookie("stopTabNames", "false");

      location.reload();
    } else if (tabName !== null && tabName !== "") {
      // Stel de tabbladnaam in op de ingevoerde waarde
      document.title = tabName;
      
      // Sla de naam op in een cookie genaamd "tabName"
      setCookie("tabName", tabName);
      
      // Vraag de gebruiker om de link naar een afbeelding in te voeren
      var faviconLink = prompt("Enter the link to an image for the favicon (leave empty to not use a favicon):");
      
      // Sla de link op in een cookie genaamd "faviconLink"
      setCookie("faviconLink", faviconLink);
      
      // Als er een favicon-link is ingevoerd, stel de favicon in
      if (faviconLink) {
        setFavicon(faviconLink);
      }
      
      // Zet de cookie "stopTabNames" op true
      setCookie("stopTabNames", "true");
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


















document.addEventListener("DOMContentLoaded", function () {
  var showCodeButton = document.createElement("button");
  showCodeButton.setAttribute("id", "showCodeButton");
  showCodeButton.textContent = ">";
  showCodeButton.style.position = "fixed";
  showCodeButton.style.left = "-5px";
  showCodeButton.style.borderTopLeftRadius = "0px"
  showCodeButton.style.borderBottomLeftRadius = "0px"
  showCodeButton.style.paddingTop = "25px"
  showCodeButton.style.paddingBottom = "25px"
  showCodeButton.style.top = "50%";
  showCodeButton.style.transform = "translateY(-50%)";
  showCodeButton.style.transition = "opacity 0.5s";
  document.body.appendChild(showCodeButton);

  var closeButton = document.createElement("button");
  closeButton.setAttribute("id", "closeButton");
  closeButton.style.display = "none";
  closeButton.textContent = "X";
  closeButton.style.backgroundColor = "var(--background-color)";
  closeButton.style.color = "var(--text-color)";
  closeButton.style.position = "fixed";
  closeButton.style.left = "5px";
  closeButton.style.top = "5px";
  closeButton.style.zIndex = "3";
  closeButton.style.transition = "opacity 0.5s";
  document.body.appendChild(closeButton);

  var menuVisible = false;

  showCodeButton.addEventListener("click", function () {
    if (!menuVisible) {
      var codeElement = document.createElement("div");
      codeElement.setAttribute("id", "menu");
      codeElement.style.opacity = 0;
      codeElement.style.transition = "opacity 0.5s";
      codeElement.innerHTML = code;
      document.body.appendChild(codeElement);
      setTimeout(function () {
        codeElement.style.opacity = 1;
      }, 0);
      showCodeButton.style.opacity = 0;
      closeButton.style.display = "block";
      closeButton.style.opacity = 1;
      menuVisible = true;

      // Save menu visibility to cookie
      document.cookie = "menuVisible=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
  });

  closeButton.addEventListener("click", function () {
    var menu = document.getElementById("menu");
    if (menu) {
      menu.style.opacity = 0;
      setTimeout(function () {
        menu.remove();
      }, 500);
      showCodeButton.style.opacity = 1;
      closeButton.style.opacity = 0;
      setTimeout(function () {
        closeButton.style.display = "none";
      }, 500);
      menuVisible = false;

      // Save menu visibility to cookie
      document.cookie = "menuVisible=false; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
  });

  document.addEventListener("click", function (event) {
    var menu = document.getElementById("menu");
    var showCodeButton = document.getElementById("showCodeButton");
    var closeButton = document.getElementById("closeButton");

    // Als het menu open is en er ergens anders dan op het menu wordt geklikt, sluit dan het menu.
    if (menu && !menu.contains(event.target) && event.target !== showCodeButton) {
      menu.style.opacity = 0;
      setTimeout(function () {
        menu.remove();
      }, 500);
      showCodeButton.style.opacity = 1;
      closeButton.style.opacity = 0;
      setTimeout(function () {
        closeButton.style.display = "none";
      }, 500);
      menuVisible = false;

      // Save menu visibility to cookie
      document.cookie = "menuVisible=false; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
  });

  // Check for existing cookie on page load
  var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)menuVisible\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (cookieValue === "true") {
    var codeElement = document.createElement("div");
    codeElement.setAttribute("id", "menu");
    codeElement.style.opacity = 1;
    codeElement.style.transition = "opacity 0.5s";
    codeElement.innerHTML = code;
    document.body.appendChild(codeElement);
    showCodeButton.style.opacity = 0;
    closeButton.style.display = "block";
    closeButton.style.opacity = 1;
    menuVisible = true;
  }
});


var code = `
<td id="menu">
    <button onclick="window.location.href='/'">Home</button>
    <h3 id="general">General</h3>
    <button onclick="window.open('https://www.youtube.com/@YT.TC_tam?sub_confirmation=1', '_blank')">My YouTube Channel</button>
    <button id="ex-bt" onclick="window.location.href='/login-exclusive'">Exclusive Pages</button>
    <button id="ex-bt" onclick="window.location.href='/tctam-search'">TC_tam Search</button>
    <button onclick="window.location.href='/games/all-games'">Games</button>
    <button onclick="window.location.href='/stories/all-stories'">My Stories</button>

    <h3 style="margin-top: 50px;" id="other">Other</h3>
    <button onclick="window.location.href='/other/bing-chat'">Bing Ai (GPT 4)</button>
    <button onclick="window.location.href='/other/myinstants'">MyInstants</button>
    <button onclick="window.location.href='/other/hz-sounds'">Play Sounds from 20 - 20,000 Hz (including school bell)</button>
    <button onclick="window.location.href='/other/notes'">Notes</button>
    <button onclick="window.location.href='/other/ide'">IDE</button>
    <button onclick="window.location.href='/other/tts'">TTS</button>

    <h3 style="margin-top: 50px;" id="login-pages">Login Pages</h3>
    <button onclick="window.location.href='/tctam-chat'">TC_tam Chat</button>

    <h3 style="margin-top: 50px;" id="school-hacks">School Hacks</h3>
    <button onclick="window.location.href='/web-tricks/downgrade-chromebook'">Downgrade Chromebook</button>
    <button onclick="window.location.href='/school-hacks/remove-chromebook-admin'">Remove Chromebook Admin</button>
    <button onclick="window.location.href='/school-hacks/add-personal-account'">Add Personal Account</button>
    <button onclick="window.location.href='/school-hacks/bookmarklets'">Bookmarklets</button>
    <button onclick="window.location.href='/school-hacks/dns-unblock'">DNS Unblock</button>
    <button onclick="window.location.href='https://docs.google.com/document/d/1GJoZwF2rXrPBnTExhcwztkuhs5evwI7x04U0WGPr_E4/view'">Answers HAVO 2 New Dutch</button>
    <button onclick="window.location.href='/school-hacks/answers/nieuw-nederlands-havo3'">Answers HAVO 3 Nieuw Nederlands</button>

    <h4 id="extension-hacks">Extension Hacks</h4>
    <button onclick="window.location.href='/school-hacks/extension-hacks/ultimate-ext-crasher'">Ultimate Extension Crasher</button>
    <button onclick="window.location.href='/school-hacks/extension-hacks/unblock-without-snooping-2.0'">Unblock Without Snooping 2.0</button>
    <button onclick="window.location.href='/school-hacks/extension-hacks/extension-stopper'">Extension Stopper</button>

    <h4 id="proxy-emulators">Proxies - Emulators</h4>
    <button onclick="window.location.href='/school-hacks/proxies-emulators/chrome-emulator'">Chrome Emulator</button>
    <button onclick="window.location.href='/school-hacks/proxies-emulators/chrome-emulator-2'">Chrome Emulator 2</button>
    <button onclick="window.location.href='/school-hacks/proxies-emulators/proxy'">Proxy with Tab Hider (use top search bar)</button>

    <h3 style="margin-top: 50px;" id="about-website">About the Website</h3>
    <button onclick="window.open('https://github.com/TCevik/TCevik.github.io/issues/new', '_blank')">Report a Bug</button>
    <button onclick="window.open('/terms-of-service', '_blank')">Terms of Service</button>
    <button onclick="window.open('/privacy-policy', '_blank')">Privacy Policy</button>
    <button onclick="window.open('https://github.com/TCevik/TCevik.github.io', '_blank')">View Site Code</button>
</td>
`;

document.addEventListener("DOMContentLoaded", function(event) {
  const canvas = document.createElement('canvas');
  canvas.id = 'backgroundCanvas';
  document.body.appendChild(canvas);

  const style = canvas.style;
  style.position = 'fixed';
  style.top = '0';
  style.left = '0';
  style.zIndex = '-1';

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let stars = [];
  let count = 500;

  function generateStars() {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2,
        alpha: Math.random(),
        decreasing: true
      });
    }
  }

  generateStars();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < count; i++) {
      let star = stars[i];
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + star.alpha + ')';
      ctx.fill();

      if (star.decreasing) {
        star.alpha -= 0.005;
        if (star.alpha < 0.1) star.decreasing = false;
      } else {
        star.alpha += 0.005;
        if (star.alpha > 0.95) star.decreasing = true;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  });
});