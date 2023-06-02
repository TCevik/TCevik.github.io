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

      popup.style.display = 'none';

      localStorage.setItem('accept', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});



document.addEventListener('DOMContentLoaded', function () {
  var xhr = new XMLHttpRequest();
  var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var pageName = document.title;
  var pageURL = window.location.href;

  var now = new Date();
  var currentTime = now.toLocaleString();

  navigator.getBattery().then(function (battery) {
    var batteryPercentage = Math.round(battery.level * 100);
    var UserName = localStorage.getItem('UserName');

    if (UserName.toLowerCase() !== "tamer") {
      var message = {
        content: '----------------------------------------' + '\n**' + UserName + '**' + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});



const savedUserName = localStorage.getItem('UserName');
const forbiddenNames = ['tameriscool192', 'tamerisgay', 'mdmmfzf'];

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




document.addEventListener('DOMContentLoaded', function() {
  var bookIconStyles = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    background: 'url(https://cdn-icons-png.flaticon.com/512/4693/4693365.png) no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  };

  var bookIcon = document.createElement('div');
  Object.assign(bookIcon.style, bookIconStyles);

  bookIcon.classList.add('readPage');

  document.body.appendChild(bookIcon);

  function readPage() {
    var pageContent = document.body.innerText || document.body.textContent;

    var speechUtterance = new SpeechSynthesisUtterance(pageContent);

    speechUtterance.rate = 0.9;

    speechUtterance.lang = 'nl-NL';
    
    window.speechSynthesis.speak(speechUtterance);
  }

  bookIcon.addEventListener('click', readPage);
});



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


/*
window.addEventListener('load', function() {
  var script = document.createElement('script');
  script.src = 'https://www.googleoptimize.com/optimize.js?id=OPT-59BDR98';
  document.head.appendChild(script);
}); */



/* document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('UserName') === '[Verbannen Gebruikersnaam]') {
    var bannedMessage = document.createElement('h1');
    bannedMessage.textContent = 'Je bent verbannen';

    document.body.innerHTML = '';

    document.body.appendChild(bannedMessage);
  }
}); */