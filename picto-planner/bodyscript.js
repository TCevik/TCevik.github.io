function addToChild(picto, imageUrl) {
  var childSection = document.getElementById('child-section');
  var img = document.createElement('img');
  img.src = imageUrl;
  img.classList.add('picto');
  img.onclick = function() {
      childSection.removeChild(this);
      if (childSection.childNodes.length === 0) {
        childSection.style.display = 'none';
      }
    };
  childSection.appendChild(img);
  childSection.style.display = 'block';
}

function deleteAllPictos() {
var childSection = document.getElementById('child-section');
childSection.innerHTML = '';
childSection.style.display = 'none';
}
function savePictosToCookies() {
var pin = getCookie('code');
if (pin === null) {
  pin = prompt("Maak een code aan om picto's op te slaan. Het mogen cijfers of letters zijn, maar bewaar deze goed want hij is HoOfDlEtTeR gevoelig en je hebt hem voortaan nodig bij het opslaan van de picto's");
  if (pin === null || pin === "" || pin.includes(" ")) {
    alert("Geen code ingevoerd of je hebt een spatie gebruikt. Picto's kunnen niet worden opgeslagen.");
    return;
  }
  alert("De code is opgeslagen.");
  setCookie('code', pin, 30);
}

var enteredPin = prompt("Voer de code in om picto's op te slaan:");
if (enteredPin !== pin) {
  alert("Onjuiste code. Picto's kunnen niet worden opgeslagen.");
  return;
}
alert("De picto's zijn opgeslagen.");
var pictos = document.getElementById('child-section').innerHTML;
setCookie('pictocookie', pictos, 30);
}

function setCookie(name, value, days) {
var expires = "";
if (days) {
  var date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  expires = "; expires=" + date.toUTCString();
}
document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
var nameEQ = name + "=";
var ca = document.cookie.split(';');
for (var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) === ' ') c = c.substring(1, c.length);
  if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
}
return null;
}

function loadPictosFromCookies() {
var pictos = getCookie('pictocookie');
if (pictos) {
  var childSection = document.getElementById('child-section');
  childSection.innerHTML = pictos;
  childSection.style.display = 'block';
  var pictoElements = childSection.getElementsByClassName('picto');
  for (var i = 0; i < pictoElements.length; i++) {
    var picto = pictoElements[i];
    picto.onclick = function() { 
      childSection.removeChild(this);
      if (childSection.childNodes.length === 0) {
        childSection.style.display = 'none';
      }
    };
  }
}
}
loadPictosFromCookies();



function speakDateTime() {
const dateTime = new Date();
const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

const day = dayNames[dateTime.getDay()];
const numericDay = dateTime.getDate();
const month = monthNames[dateTime.getMonth()];
const hour = dateTime.getHours();
const minute = dateTime.getMinutes();

const dateTimeText = `De datum van vandaag is ${day} ${numericDay} ${month} en de tijd is ${hour} uur ${minute}.`;

const speech = new SpeechSynthesisUtterance(dateTimeText);
speech.rate = 0.9;
speechSynthesis.speak(speech);
}

setInterval(updateDateTime, 1000);

function updateDateTime() {
const dateTime = new Date();
const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

const day = dayNames[dateTime.getDay()];
const numericDay = dateTime.getDate();
const month = monthNames[dateTime.getMonth()];
const hour = dateTime.getHours();
const minute = dateTime.getMinutes();

const dateTimeText = `De datum van vandaag is ${day} ${numericDay} ${month} en de tijd is ${hour} uur ${minute}.`;

document.getElementById("date-time").textContent = dateTimeText;
}