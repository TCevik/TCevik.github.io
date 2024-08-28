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
        savePictosToCookies(); // Sla de pictogrammen op in cookies zodra er een wordt verwijderd
    };
    childSection.appendChild(img);
    childSection.style.display = 'block';
    savePictosToCookies(); // Sla de pictogrammen op in cookies zodra er een wordt toegevoegd
}

function deleteAllPictos() {
    var childSection = document.getElementById('child-section');
    childSection.innerHTML = '';
    childSection.style.display = 'none';
    savePictosToCookies(); // Sla de lege staat op in cookies
}

function savePictosToCookies() {
    var pictos = document.getElementById('child-section').innerHTML;
    document.cookie = "pictos=" + encodeURIComponent(pictos) + "; path=/; max-age=31536000"; // Sla op voor 1 jaar
    notification('Bewerking opgeslagen');
}

function loadPictosFromCookies() {
    var childSection = document.getElementById('child-section');
    var pictos = getCookie("pictos");

    if (pictos) {
        childSection.innerHTML = decodeURIComponent(pictos);
        childSection.style.display = 'block';
        var pictoElements = childSection.getElementsByClassName('picto');
        for (var i = 0; i < pictoElements.length; i++) {
            var picto = pictoElements[i];
            picto.onclick = function () {
                childSection.removeChild(this);
                if (childSection.childNodes.length === 0) {
                    childSection.style.display = 'none';
                }
                savePictosToCookies(); // Sla de pictogrammen op in cookies zodra er een wordt verwijderd
            };
        }
    }
}

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