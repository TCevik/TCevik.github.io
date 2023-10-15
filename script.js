/* accepteer popup */
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('acceptPopup')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'Door het gebruik van deze site of het proberen van de inhoud ervan ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>. Veel plezier!';
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
  if (!currentURL.startsWith('/games/') && !currentURL.startsWith('/games?')) {
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
            loginButton.textContent = "Je bent ingelogd";
        } else {
            loginButton.textContent = "Inloggen";
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




























document.addEventListener('DOMContentLoaded', function() {
  var alleElementen = document.body;
  alleElementen.style.opacity = 0;
  alleElementen.style.transition = 'opacity 1.0s';
        
  setTimeout(function() {
    alleElementen.style.opacity = 1;
  }, 100);
});