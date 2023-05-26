document.addEventListener('DOMContentLoaded', function() {
  // Controleer of de gebruiker de website voor het eerst bezoekt
  if (!localStorage.getItem('accept')) {
    // Maak een nieuw element voor de popup
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup'; // Voeg de class "popup" toe

    // Voeg de tekst toe aan de popup
    var text = 'Door deze website te gebruiken ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    // Maak de "Ok" knop
    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    // Voeg een event listener toe aan de knop
    button.addEventListener('click', function() {
      // Stuur een POST-verzoek naar de Discord-webhook
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111603856112099399/vxqfA_5PITqXx-i38QYJnLIwgaoncT4lRIb0hdrTNM1VRMBn6BWPXNO6_qOwk7b4VIbe';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      // Bouw het bericht op
      var message = {
        content: '+1 Gebruiker'
      };

      // Stuur het bericht als JSON naar de webhook
      xhr.send(JSON.stringify(message));

      // Verberg de popup
      popup.style.display = 'none';

      // Sla op dat de gebruiker de website heeft bezocht
      localStorage.setItem('accept', 'true');
    });

    // Voeg de knop toe aan de popup
    popup.appendChild(button);

    // Voeg de popup toe aan de body van de pagina
    document.body.appendChild(popup);
  }
});

// Maak een knop aan en voeg deze toe aan de pagina
var button = document.createElement("button");
button.innerHTML = "Menu";
button.style.position = "fixed";
button.style.top = "10px";
button.style.right = "10px";
document.body.appendChild(button);

// Maak het menu met knoppen
var menu = document.createElement("div");
menu.style.display = "none";
menu.style.position = "fixed";
menu.style.top = "50px";
menu.style.right = "10px";
menu.style.padding = "10px";
menu.style.backgroundColor = "#f1f1f1";
menu.style.border = "1px solid #ccc";
document.body.appendChild(menu);

// Voeg knoppen toe aan het menu
var closeButton = document.createElement("button");
closeButton.innerHTML = "Sluiten";
menu.appendChild(closeButton);

// Eventlistener voor de knop
button.addEventListener("click", function() {
  if (menu.style.display === "none") {
    menu.style.display = "block";
    button.style.display = "none";
  } else {
    menu.style.display = "none";
    button.style.display = "block";
  }
});

// Eventlistener voor de sluitknop
closeButton.addEventListener("click", function() {
  menu.style.display = "none";
  button.style.display = "block";
});
