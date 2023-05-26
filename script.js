document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('accept')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';
    
    var text = 'Door deze website te gebruiken ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    button.addEventListener('click', function() {
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
    var message = {
      content: 'Er is iemand op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%'
    };

    xhr.send(JSON.stringify(message));
  });
});

// Controleer of de userName al aanwezig is in de localStorage
if (!localStorage.getItem('userName')) {
  // Creëer een nieuw div-element om het invoerscherm weer te geven
  var inputDiv = document.createElement('div');
  inputDiv.style.position = 'fixed';
  inputDiv.style.top = '0';
  inputDiv.style.left = '0';
  inputDiv.style.width = '100%';
  inputDiv.style.height = '100%';
  inputDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  inputDiv.style.display = 'flex';
  inputDiv.style.justifyContent = 'center';
  inputDiv.style.alignItems = 'center';

  // Creëer een input-element om de userName in te voeren
  var inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.placeholder = 'Voer je gebruikersnaam in';
  inputElement.style.padding = '10px';
  inputElement.style.fontSize = '16px';

  // Creëer een button-element om het invoerscherm te sluiten
  var closeButton = document.createElement('button');
  closeButton.innerText = 'Opslaan';
  closeButton.style.padding = '10px';
  closeButton.style.fontSize = '16px';
  closeButton.style.marginLeft = '10px';

  // Voeg de input-element en de closeButton toe aan het inputDiv
  inputDiv.appendChild(inputElement);
  inputDiv.appendChild(closeButton);

  // Voeg het inputDiv toe aan de body van de pagina
  document.body.appendChild(inputDiv);

  // Voeg een eventlistener toe aan de closeButton om het invoerscherm te sluiten en de userName op te slaan
  closeButton.addEventListener('click', function() {
    var userName = inputElement.value;
    if (userName) {
      localStorage.setItem('userName', userName);
      document.body.removeChild(inputDiv);
    }
  });
} else {
  // De userName is al aanwezig in de localStorage, dus voer hier de rest van je code uit
  var userName = localStorage.getItem('userName');
  console.log('Gebruikersnaam: ' + userName);
}