function addToChild(picto, imageUrl) {
    var childSection = document.getElementById('child-section');
    var img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('picto');
    img.onclick = function () {
        childSection.removeChild(this);
        if (childSection.childNodes.length === 0) {
            childSection.style.display = 'none';
        }
        saveChildPictosToStorage(); // Sla de pictogrammen van child-section op in localStorage zodra er een wordt verwijderd
    };
    childSection.appendChild(img);
    childSection.style.display = 'block';
    saveChildPictosToStorage(); // Sla de pictogrammen van child-section op in localStorage zodra er een wordt toegevoegd
}

// Functie om alle pictogrammen in de child-section te verwijderen
function deleteAllPictos() {
    var childSection = document.getElementById('child-section');
    childSection.innerHTML = '';
    childSection.style.display = 'none';
    saveChildPictosToStorage(); // Sla de lege staat op in localStorage
}

// Functie om de pictogrammen van child-section op te slaan in localStorage
function saveChildPictosToStorage() {
    var pictos = [];
    var pictoElements = document.getElementById('child-section').getElementsByClassName('picto');
    for (var i = 0; i < pictoElements.length; i++) {
        pictos.push(pictoElements[i].src);
    }
    localStorage.setItem('childPictos', JSON.stringify(pictos));
    notification('Bewerking opgeslagen');
}

// Functie om de pictogrammen van child-section te laden vanuit localStorage
function loadChildPictosFromStorage() {
    var childSection = document.getElementById('child-section');
    var pictos = JSON.parse(localStorage.getItem('childPictos'));

    if (pictos && pictos.length > 0) {
        pictos.forEach(function(imageUrl) {
            var img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('picto');
            img.onclick = function () {
                childSection.removeChild(this);
                if (childSection.childNodes.length === 0) {
                    childSection.style.display = 'none';
                }
                saveChildPictosToStorage(); // Sla de pictogrammen van child-section op in localStorage zodra er een wordt verwijderd
            };
            childSection.appendChild(img);
        });
        childSection.style.display = 'block';
    }
}

// Functie om een cookie op te halen (als je cookies gebruikt voor andere doeleinden)
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return cookiePair[1];
        }
    }
    return null;
}

loadChildPictosFromStorage();

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