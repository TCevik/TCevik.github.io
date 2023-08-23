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

// Bewaar de oorspronkelijke inhoud van de pagina
var originalContent = document.body.innerHTML;

// Wacht tot het document volledig is geladen
document.addEventListener("DOMContentLoaded", function() {
    // Functie om het schermformaat te controleren en de pagina aan te passen
    function checkScreenSize() {
        // Haal de breedte van het scherm op
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Controleer of de schermgrootte kleiner is dan 750px
        if (screenWidth < 750) {
            // Leeg de inhoud van de pagina en toon de boodschap
            document.body.innerHTML = "<div style='text-align: center; padding: 50px;'>Draai je apparaat om de website te bekijken.</div>";
        } else {
            // Herstel de oorspronkelijke inhoud van de pagina
            document.body.innerHTML = originalContent;
        }
    }

    // Voer de functie uit bij het laden en wijzigen van de schermgrootte
    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();
});
