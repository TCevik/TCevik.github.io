document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('accept')) {
    var acceptPopup = document.createElement('div');
    acceptPopup.id = 'accept-popup';
    acceptPopup.className = 'popup';

    var acceptText = 'Door deze website te gebruiken ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    acceptPopup.innerHTML = acceptText;

    var acceptButton = document.createElement('button');
    acceptButton.innerHTML = 'Ok';

    acceptButton.addEventListener('click', function() {
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      var message = {
        content: 'Iemand heeft op de accepteer knop geklikt!'
      };

      xhr.send(JSON.stringify(message));

      acceptPopup.style.display = 'none';

      localStorage.setItem('accept', 'true');
    });

    acceptPopup.appendChild(acceptButton);

    document.body.appendChild(acceptPopup);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var xhr = new XMLHttpRequest();
  var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var pageName = document.title;
  var pageURL = window.location.href;

  var now = new Date();
  var currentTime = now.toLocaleString();

  navigator.getBattery().then(function(battery) {
    var batteryPercentage = Math.round(battery.level * 100);

    var userName = localStorage.getItem('userName');
    if (userName) {
      var message = {
        content: 'Er is iemand op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + userName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});

let userName = localStorage.getItem('userName');

function showAcceptPopup() {
  if (!userName && !localStorage.getItem('accept')) {
    // Accepteer popup-element maken
    const acceptPopup = document.createElement('div');
    acceptPopup.id = 'accept-popup';
    acceptPopup.classList.add('popup'); // Toevoegen van de CSS-klasse "popup" aan de accepteer popup

    // Inhoud van de accepteer popup
    const acceptText = 'Door deze website te gebruiken ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    acceptPopup.innerHTML = acceptText;

    // Knop van de accepteer popup
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Ok';

    // Eventlistener toevoegen aan de accepteer knop
    acceptButton.addEventListener('click', function() {
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      var message = {
        content: 'Iemand heeft op de accepteer knop geklikt!'
      };

      xhr.send(JSON.stringify(message));

      acceptPopup.style.display = 'none';

      localStorage.setItem('accept', 'true');
    });

    // Elementen toevoegen aan de accepteer popup
    acceptPopup.appendChild(acceptButton);

    // Accepteer popup toevoegen aan de body van de pagina
    document.body.appendChild(acceptPopup);
  }
}

function showNamePopup() {
  if (!userName && localStorage.getItem('accept')) {
    // Naam popup-element maken
    const namePopup = document.createElement('div');
    namePopup.id = 'name-popup';
    namePopup.classList.add('popup'); // Toevoegen van de CSS-klasse "popup" aan de naam popup

    // Invoerveld maken
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Voer je naam in';
    input.style.padding = '10px';
    input.style.fontSize = '18px';
    input.style.marginRight = '10px';

    // Knop maken
    const button = document.createElement('button');
    button.textContent = 'Opslaan';
    button.style.padding = '10px';
    button.style.fontSize = '18px';

    // Eventlistener toevoegen aan de knop
    button.addEventListener('click', function() {
      userName = input.value;
      localStorage.setItem('userName', userName); // Opslaan van de userName in de localStorage
      closeNamePopup();
    });

    // Elementen toevoegen aan de naam popup
    namePopup.appendChild(input);
    namePopup.appendChild(button);

    // Naam popup toevoegen aan de body van de pagina
    document.body.appendChild(namePopup);
  }
}

function closeAcceptPopup() {
  // Accepteer popup-element verwijderen
  const acceptPopup = document.getElementById('accept-popup');
  document.body.removeChild(acceptPopup);
}

function closeNamePopup() {
  // Naam popup-element verwijderen
  const namePopup = document.getElementById('name-popup');
  document.body.removeChild(namePopup);
}

// Popup weergeven wanneer de pagina volledig geladen is
window.addEventListener('load', function() {
  showAcceptPopup();
  showNamePopup();
});
