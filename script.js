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
  var discordUrl = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
  var htmlUrl = 'meekijkfunctie.html';
  
  xhr.open('POST', discordUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var pageName = document.title;
  var pageURL = window.location.href;

  var now = new Date();
  var currentTime = now.toLocaleString();

  navigator.getBattery().then(function(battery) {
    var batteryPercentage = Math.round(battery.level * 100);
    var UserName = localStorage.getItem('UserName');

    if (UserName !== "Tamer") {
      var message = {
        content: UserName + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));

      var htmlContent = '<p>' + JSON.stringify(message) + '</p>';
      var htmlXhr = new XMLHttpRequest();
      htmlXhr.open('GET', htmlUrl, true);
      htmlXhr.onreadystatechange = function() {
        if (htmlXhr.readyState === 4 && htmlXhr.status === 200) {
          var response = htmlXhr.responseText;
          var updatedContent = response + htmlContent;
          var htmlUpdateXhr = new XMLHttpRequest();
          htmlUpdateXhr.open('POST', htmlUrl, true);
          htmlUpdateXhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          htmlUpdateXhr.send('content=' + encodeURIComponent(updatedContent));
        }
      };
      htmlXhr.send();
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
