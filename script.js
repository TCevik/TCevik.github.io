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



/* laat gebruiker een naam kiezen */
const savedUserName = localStorage.getItem('UserName');
const forbiddenNames = ['tameriscool192', 'tamerisgay'];

function setUserName() {
  const userName = prompt('(Vul gewoon je naam in ofzo. Dit word later gebruikt als nickname.) Voer een gebruikersnaam in om door te gaan:');

  if (
    userName &&
    /^[qwertyuiopasdfghjklzxcvbnm0-9]+$/i.test(userName) &&
    !forbiddenNames.includes(userName.toLowerCase())
  ) {
    localStorage.setItem('UserName', userName);
    alert('Bedankt! Je gebruikersnaam is opgeslagen.');
  } else {
    alert('Je moet een geldige gebruikersnaam invoeren om door te gaan.');
    setUserName();
  }
}

if (window.location.href !== 'https://tcevik.github.io/') {
  if (!savedUserName || forbiddenNames.includes(savedUserName.toLowerCase())) {
    setUserName();
  }
}