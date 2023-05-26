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

// Controleren of userName al aanwezig is in localStorage
if (!localStorage.getItem('userName')) {
  showUserNameInput(); // Weergeven van het scherm voor het invoeren van userName
}

// Functie om het scherm voor het invoeren van userName weer te geven
function showUserNameInput() {
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  var inputContainer = document.createElement('div');
  inputContainer.style.backgroundColor = '#fff';
  inputContainer.style.padding = '20px';
  inputContainer.style.borderRadius = '8px';

  var inputLabel = document.createElement('label');
  inputLabel.textContent = 'Voer je gebruikersnaam in: ';
  inputLabel.style.marginRight = '10px';

  var inputField = document.createElement('input');
  inputField.type = 'text';

  var submitButton = document.createElement('button');
  submitButton.textContent = 'Opslaan';
  submitButton.style.marginTop = '10px';

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(inputField);
  inputContainer.appendChild(submitButton);

  overlay.appendChild(inputContainer);
  document.body.appendChild(overlay);

  // Eventlistener voor het opslaan van userName
  submitButton.addEventListener('click', function() {
    var userName = inputField.value.trim();
    if (userName !== '') {
      localStorage.setItem('userName', userName);
      document.body.removeChild(overlay);
    }
  });

  // Eventlistener om terug te gaan als het scherm wordt gesloten
  window.addEventListener('beforeunload', function() {
    if (!localStorage.getItem('userName')) {
      return 'Weet je zeker dat je het scherm wilt sluiten? Je moet een gebruikersnaam invoeren om door te gaan.';
    }
  });
}
