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

    if (UserName !== "Tamer") {
      var message = {
        content: '----------------------------------------' + '\n**' + UserName + '**' + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});



const savedUserName = localStorage.getItem('UserName');

function setUserName() {
  const UserName = prompt('Voer een gebruikersnaam in om door te gaan:');

  if (UserName && /^[qwertyuiopasdfghjklzxcvbnm_\-0-9]+$/i.test(UserName)) {
    localStorage.setItem('UserName', UserName);
    alert('Bedankt! Je gebruikersnaam is opgeslagen.');
  } else {
    alert('Je moet een geldige gebruikersnaam invoeren om door te gaan.');
    setUserName();
  }
}

if (window.location.href !== 'https://tcevik.github.io/') {
  if (!savedUserName) {
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




document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('UserName') === '[Verbannen Gebruikersnaam]') {
    var bannedMessage = document.createElement('h1');
    bannedMessage.textContent = 'Je bent verbannen';

    document.body.innerHTML = '';

    document.body.appendChild(bannedMessage);
  }
});
















document.addEventListener('DOMContentLoaded', function() {
  const contentDiv = document.getElementById('content');
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Voorkomt dat de link de pagina opnieuw laadt

      const url = this.getAttribute('href');
      const pageTitle = this.textContent;

      // Wijzig de URL zonder de pagina opnieuw te laden
      history.pushState({ url: url, pageTitle: pageTitle }, pageTitle, url);

      // Update de inhoud van de pagina
      fetchPage(url);
    });
  });

  // Vang het popstate-event op wanneer de gebruiker teruggaat of vooruitgaat in de browsergeschiedenis
  window.addEventListener('popstate', function(event) {
    const state = event.state;
    if (state) {
      const url = state.url;
      const pageTitle = state.pageTitle;

      // Update de inhoud van de pagina
      fetchPage(url);
    }
  });

  // Functie om de inhoud van de pagina op te halen via AJAX
  function fetchPage(url) {
    fetch(url)
      .then(function(response) {
        return response.text();
      })
      .then(function(html) {
        contentDiv.innerHTML = html; // Update de inhoud van de pagina
      })
      .catch(function(error) {
        console.log('Er is een fout opgetreden:', error);
      });
  }
});
