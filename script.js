document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('accept')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'Door het gebruik van deze site of het proberen van de inhoud ervan ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    button.addEventListener('click', function () {
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      var message = {
        content: 'Iemand heeft op de accepteer knop geklikt!'
      };

      xhr.send(JSON.stringify(message));

      popup.style.display = 'none';

      localStorage.setItem('accept', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});



document.addEventListener('DOMContentLoaded', function () {
  var xhr = new XMLHttpRequest();
  var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var pageName = document.title;
  var pageURL = window.location.href;

  var now = new Date();
  var currentTime = now.toLocaleString();

  navigator.getBattery().then(function (battery) {
    var batteryPercentage = Math.round(battery.level * 100);
    var UserName = localStorage.getItem('UserName');

    if (UserName.toLowerCase() !== "tamer") {
      var message = {
        content: '----------------------------------------' + '\n**' + UserName + '**' + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});



const savedUserName = localStorage.getItem('UserName');
const forbiddenNames = ['tameriscool192', 'tamerisgay', 'mdmmfzf'];

function setUserName() {
  const userName = prompt('(Vul gewoon je naam in ofzo. Dit word later gebruikt als nickname.) Voer een gebruikersnaam in om door te gaan:');

  if (
    userName &&
    /^[qwertyuiopasdfghjklzxcvbnm0-9]+$/i.test(userName) &&
    !forbiddenNames.includes(userName.toLowerCase())
  ) {
    localStorage.setItem('UserName', userName);
    alert('Bedankt! Je gebruikersnaam is opgeslagen.');
  } else {
    alert('Je moet een geldige gebruikersnaam invoeren om door te gaan.');
    setUserName();
  }
}

if (window.location.href !== 'https://tcevik.github.io/') {
  if (!savedUserName || forbiddenNames.includes(savedUserName.toLowerCase())) {
    setUserName();
  }
}




document.addEventListener('DOMContentLoaded', function() {
  var bookIconStyles = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    background: 'url(https://cdn-icons-png.flaticon.com/512/4693/4693365.png) no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  };

  var bookIcon = document.createElement('div');
  Object.assign(bookIcon.style, bookIconStyles);

  bookIcon.classList.add('readPage');

  document.body.appendChild(bookIcon);

  function readPage() {
    var pageContent = document.body.innerText || document.body.textContent;

    var speechUtterance = new SpeechSynthesisUtterance(pageContent);

    speechUtterance.rate = 0.9;

    speechUtterance.lang = 'nl-NL';
    
    window.speechSynthesis.speak(speechUtterance);
  }

  bookIcon.addEventListener('click', readPage);
});



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





// Functie om de cookie te maken
function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// Functie om de cookie te lezen
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

// Functie om de cookie te verwijderen
function eraseCookie(name) {
  createCookie(name, "", -1);
}

// Functie om de initiële acties uit te voeren bij het laden van de pagina
function initializePage() {
  var cookieName = "changeTab";
  var cookieValue = "enabled";

  if (readCookie(cookieName) === cookieValue) {
    // Cookie bestaat en heeft de juiste waarde, dus we passen de tabnaam en het favicon aan
    document.title = "Google";
    var link = document.querySelector("link[rel~='icon']");
    link.href = "https://google.com/favicon.ico";
  } else {
    // Cookie bestaat niet of heeft een andere waarde, dus we herstellen de oorspronkelijke tabnaam en het favicon
    document.title = "Jouw website";
    var link = document.querySelector("link[rel~='icon']");
    link.href = "pad/naar/jouw/favicon.ico";
  }
}

// Functie die wordt uitgevoerd wanneer op de knop wordt geklikt
function changeTab() {
  var cookieName = "changeTab";
  var cookieValue = "enabled";

  if (readCookie(cookieName) === null) {
    // Cookie bestaat niet, dus we maken het aan
    createCookie(cookieName, cookieValue, 1);
    document.title = "Google";
    var link = document.querySelector("link[rel~='icon']");
    link.href = "https://google.com/favicon.ico";
  } else {
    // Cookie bestaat al, dus we verwijderen het
    eraseCookie(cookieName);
    alert("De functie is uitgeschakeld bij de volgende herlaadbeurt.");
  }
}

// Roep de functie aan bij het laden van de pagina
initializePage();








/* document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('UserName') === '[Verbannen Gebruikersnaam]') {
    var bannedMessage = document.createElement('h1');
    bannedMessage.textContent = 'Je bent verbannen';

    document.body.innerHTML = '';

    document.body.appendChild(bannedMessage);
  }
}); */