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

  // Functie om het IP-adres op te halen
  function getIPAddress(callback) {
    var xhrIP = new XMLHttpRequest();
    xhrIP.open('GET', 'https://api.ipify.org?format=json', true);
    xhrIP.onreadystatechange = function() {
      if (xhrIP.readyState === 4 && xhrIP.status === 200) {
        var response = JSON.parse(xhrIP.responseText);
        var ipAddress = response.ip;
        callback(ipAddress);
      }
    };
    xhrIP.send();
  }

  // Callback-functie om het IP-adres toe te voegen aan de payload
  function sendMessageWithIP(ipAddress) {
    var message = {
      content: 'Er is iemand op de website!',
      ipAddress: ipAddress
    };

    xhr.send(JSON.stringify(message));
  }

  // Oproep om het IP-adres op te halen en de berichtverzending te starten
  getIPAddress(sendMessageWithIP);
});
