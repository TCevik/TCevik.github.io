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

function showPopup() {
  if (!userName) {
    // Popup-element maken
    const popup = document.createElement('div');
    popup.classList.add('popup'); // Toevoegen van de CSS-klasse "popup" aan de popup

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
      closePopup();
    });

    // Elementen toevoegen aan de popup
    popup.appendChild(input);
    popup.appendChild(button);

    // Popup toevoegen aan de body van de pagina
    document.body.appendChild(popup);
  }
}

function closePopup() {
  // Popup-element verwijderen
  const popup = document.querySelector('.popup'); // Selecteren op basis van de CSS-klasse "popup"
  document.body.removeChild(popup);
}

// Popup weergeven wanneer de pagina volledig geladen is
window.addEventListener('load', showPopup);
