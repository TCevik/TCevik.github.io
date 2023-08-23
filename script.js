/* accepteer popup */
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

      var opacity = 1;
      var intervalId = setInterval(function () {
        opacity -= 0.05;
        popup.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(intervalId);
          popup.style.display = 'none';
        }
      }, 15);

      localStorage.setItem('accept', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});



/* verwijder naam */
document.cookie = "UserName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";



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

// Wacht tot de pagina volledig is geladen
window.addEventListener('load', function() {
  // Functie om de schermgrootte te controleren en acties uit te voeren
  function checkScreenSize() {
      if (window.innerWidth < 750) {  // Controleer of scherm smaller is dan 750px
          // Verwijder alle inhoud van de pagina
          document.body.innerHTML = '';

          // Maak een nieuw berichtelement aan
          var message = document.createElement('div');
          message.innerText = 'Draai je apparaat';  // Stel de boodschap in
          message.style.fontSize = '24px';  // Pas de tekstgrootte aan voor duidelijkheid
          message.style.textAlign = 'center';  // Centreer de tekst
          message.style.marginTop = '50vh';  // Plaats het bericht verticaal gecentreerd

          // Voeg het berichtelement toe aan de pagina
          document.body.appendChild(message);
      }
  }

  // Voer de controlefunctie uit wanneer de schermgrootte verandert
  window.addEventListener('resize', checkScreenSize);

  // Voer de controlefunctie eenmaal uit bij het laden van de pagina
  checkScreenSize();
});
