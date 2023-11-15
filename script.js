/* accepteer popup */
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('acceptPopup')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'Door het gebruik van deze site of het proberen van de inhoud ervan ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
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

document.addEventListener('DOMContentLoaded', function() {
  const currentURL = window.location.pathname;

  if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?') && 
      !currentURL.startsWith('/picto-planner/') && !currentURL.startsWith('/picto-planner?') &&
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
              loginButton.addEventListener("click", function() {
                  const popupWidth = Math.floor(window.outerWidth * 0.75);
                  const popupHeight = Math.floor(window.outerHeight * 0.8);
                  const leftPosition = (window.screen.width - popupWidth) / 2;
                  const topPosition = (window.screen.height - popupHeight) / 2;
                  window.open("/auth/account", "_blank", `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
              });
          } else {
                const loginLink = document.createElement("button");
                loginLink.textContent = "Inloggen";
                loginLink.onclick = function() {
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

var originalTitle = document.title; // Bewaar de oorspronkelijke titel van het tabblad

// Array met de berichten die we willen weergeven wanneer de focus verloren is
var messages = [
  "TC_tam mist je!",
  "TC_tam zit hier!",
  "Hier was je bezig, bij TC_tam!",
  "TC_tam: blijf bij mij!",
  "Let goed op TC_tam!",
  "TC_tam: kom je snel terug?",
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

// Functie om de titel terug te zetten naar de oorspronkelijke titel wanneer de focus wordt hersteld
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
    var tabName = prompt("Vul hier de naam van het tabblad in (vul reset in om alles weer normaal te krijgen):");
    
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
      var faviconLink = prompt("Vul hier de link naar een afbeelding in voor de favicon (laat leeg om geen favicon te gebruiken):");
      
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
  var showmenuCodeButton = document.createElement("button");
  showmenuCodeButton.setAttribute("id", "showmenuCodeButton");
  showmenuCodeButton.textContent = ">";
  showmenuCodeButton.style.position = "fixed";
  showmenuCodeButton.style.left = "-5px";
  showmenuCodeButton.style.borderTopLeftRadius = "0px"
  showmenuCodeButton.style.borderBottomLeftRadius = "0px"
  showmenuCodeButton.style.paddingTop = "25px"
  showmenuCodeButton.style.userSelect = "none"
  showmenuCodeButton.style.paddingBottom = "25px"
  showmenuCodeButton.style.zIndex = '997';
  showmenuCodeButton.style.top = "50%";
  showmenuCodeButton.style.transform = "translateY(-50%)";
  showmenuCodeButton.style.transition = "opacity 0.5s";
  document.body.appendChild(showmenuCodeButton);

  var closeButton = document.createElement("button");
  closeButton.setAttribute("id", "closeButton");
  closeButton.style.display = "none";
  closeButton.textContent = "X";
  closeButton.style.backgroundColor = "var(--background-color)";
  closeButton.style.color = "var(--text-color)";
  closeButton.style.position = "fixed";
  closeButton.style.left = "5px";
  closeButton.style.top = "5px";
  closeButton.style.zIndex = '997';
  closeButton.style.transition = "opacity 0.5s";
  document.body.appendChild(closeButton);

  var menuVisible = false;

  showmenuCodeButton.addEventListener("click", function () {
    if (!menuVisible) {
      var menuCodeElement = document.createElement("div");
      menuCodeElement.setAttribute("id", "menu");
      menuCodeElement.style.opacity = 0;
      menuCodeElement.style.transition = "opacity 0.5s";
      menuCodeElement.innerHTML = menuCode;
      document.body.appendChild(menuCodeElement);
      setTimeout(function () {
        menuCodeElement.style.opacity = 1;
      }, 0);
      showmenuCodeButton.style.opacity = 0;
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
      showmenuCodeButton.style.opacity = 1;
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
    var showmenuCodeButton = document.getElementById("showmenuCodeButton");
    var closeButton = document.getElementById("closeButton");

    // Als het menu open is en er ergens anders dan op het menu wordt geklikt, sluit dan het menu.
    if (menu && !menu.contains(event.target) && event.target !== showmenuCodeButton) {
      menu.style.opacity = 0;
      setTimeout(function () {
        menu.remove();
      }, 500);
      showmenuCodeButton.style.opacity = 1;
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
  /* var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)menuVisible\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (cookieValue === "true") {
    var menuCodeElement = document.createElement("div");
    menuCodeElement.setAttribute("id", "menu");
    menuCodeElement.style.opacity = 1;
    menuCodeElement.style.transition = "opacity 0.5s";
    menuCodeElement.innerHTML = menuCode;
    document.body.appendChild(menuCodeElement);
    showmenuCodeButton.style.opacity = 0;
    closeButton.style.display = "block";
    closeButton.style.opacity = 1;
    menuVisible = true;
  } */
});


var menuCode = `
<td id="menu">
    <button onclick="window.location.href='/'">Home</button>
    <button onclick="runBookmarklet()">JavaScript/Bookmarklet Code</button>
    <h3 id="algemeen">Algemeen</h3>
    <button onclick="window.open('https://www.youtube.com/@YT.TC_tam?sub_confirmation=1', '_blank')">Mijn YouTube kanaal</button>
    <button id="ex-bt" onclick="window.location.href='/login-exclusive'">Exclusieve Pagina's</button>
    <button id="ex-bt" onclick="window.location.href='/tctam-zoeken'">TC_tam zoeken</button>
    <button onclick="window.location.href='/games/alle-games'">Games</button>
    <button onclick="window.location.href='/tctam-chat'">TC_tam Chat</button>
    <button onclick="window.location.href='/verhalen/alle-verhalen'">Mijn verhalen</button>

    <h3 style="margin-top: 50px;" id="overig">Overig</h3>
    <button onclick="window.location.href='/overig/bing-chat'">Bing Ai (GPT 4)</button>
    <button onclick="window.location.href='/overig/myinstants'">MyInstants</button>
    <button onclick="window.location.href='/overig/hz-geluiden'">Speel geluiden van 20 - 20.000 hz (inc schoolbel)</button>
    <button onclick="window.location.href='/overig/notities'">Notities</button>
    <button onclick="window.location.href='/overig/ide'">IDE</button>
    <button onclick="window.location.href='/overig/tts'">TTS</button>

    <h3 style="margin-top: 50px;" id="schoolhacks">School Hacks</h3>
    <button onclick="window.location.href='/alle-methoden'">Alle methoden</button>
    <button onclick="window.location.href='/school-hacks/bookmarklets'">Bookmarklets</button>
    <button onclick="window.location.href='https://docs.google.com/document/d/1GJoZwF2rXrPBnTExhcwztkuhs5evwI7x04U0WGPr_E4/view'">Antwoorden HAVO 2 Nieuw Nederlands</button>
    <button onclick="window.location.href='/school-hacks/antwoorden/nieuw-nederlands-havo3'">Antwoorden HAVO 3 Nieuw Nederlands</button>

    <h4 id="proxysemulators">Proxys - Emulators</h4>
    <button onclick="window.location.href='/school-hacks/proxys-emulators/chrome-unblock'">Chrome Emulator</button>
    <button onclick="window.location.href='/school-hacks/proxys-emulators/chrome-unblock-2'">Chrome Emulator 2</button>
    <button onclick="window.location.href='/school-hacks/proxys-emulators/proxy'">Proxy met tab verberger (gebruik bovenste zoekbalk)</button>

    <h3 style="margin-top: 50px;" id="overwebsite">Over de website</h3>
    <button onclick="window.open('https://github.com/TCevik/TCevik.github.io/issues/new', '_blank')">Meld een bug</button>
    <button onclick="window.open('/terms-of-service', '_blank')">Terms of Service</button>
    <button onclick="window.open('/privacy-policy', '_blank')">Privacy Policy</button>
    <button onclick="window.open('https://github.com/TCevik/TCevik.github.io', '_blank')">Bekijk de broncode van de site</button>
</td>
`;

function runBookmarklet() {
  var bookmarklet = prompt("Javascript here:");
  if (bookmarklet) {
    bookmarklet = bookmarklet.replace(/^javascript:/i, '');
    try {
      var script = document.createElement('script');
      script.textContent = bookmarklet;
      document.body.appendChild(script);
    } catch (e) {
      alert("Something went wrong: " + e);
    }
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
      pageLanguage: 'nl',
  }, 'google_translate_element');

  var userLanguage = window.navigator.language.toLowerCase().split("-")[0];

  setTimeout(function() {
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

document.addEventListener('DOMContentLoaded', function() {
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

function togglePopup(category) {
  var overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
      
  var popup = document.createElement("div");
  popup.classList.add("popup");
  popup.style.opacity = 0;
  popup.style.top = "50px";
  popup.style.bottom = "50px";
  popup.style.transition = "opacity 0.3s";
  popup.style.width = "calc(100vw - 150px)";
  popup.style.position = "fixed";
  popup.style.left = "50%";
  popup.style.zIndex = 999;
  popup.style.transform = "translateX(-50%)";
      
  var closeBtn = document.createElement("b");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "X";
  closeBtn.style.position = "fixed"
  closeBtn.style.top = "20px"
  closeBtn.style.right = "35px"
  closeBtn.style.cursor = "pointer"
  closeBtn.style.fontSize = "1.4em"
  closeBtn.style.zIndex = 999;
  closeBtn.onclick = function () {
      popup.style.opacity = 0;
      overlay.style.display = "none";
      var elementsToBlur = document.querySelectorAll('body > *:not(.popup)');
      elementsToBlur.forEach(function (element) {
          element.style.filter = "none";
      });
      document.body.style.overflowY = "auto";
      setTimeout(function () {
          document.body.removeChild(popup);
          document.body.removeChild(overlay);
      }, 300);
  };

  popup.appendChild(closeBtn);

  var popupContent = document.getElementById(category + "-popup");
  var contentClone = popupContent.cloneNode(true);
  contentClone.style.maxHeight = "65vh";
  contentClone.style.overflowY = "auto";

  popup.appendChild(contentClone);

  document.body.appendChild(popup);

  void popup.offsetWidth;

  popup.style.opacity = 1;

  var elementsToBlur = document.querySelectorAll('body > *:not(.popup)');
  elementsToBlur.forEach(function (element) {
      element.style.transition = "filter 0.3s";
      element.style.filter = "blur(2px)";
  });

  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 998;

  document.body.style.overflowY = "hidden";
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
    notification.style.maxWidth = '90vw';
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
    closeNotificationButton.onclick = function() {
        removeNotification();
    };
    notification.appendChild(closeNotificationButton);

    document.body.appendChild(notification);
    existingNotification = notification;
}