// Voeg hier de IP-adressen toe die toegang hebben tot de website
var toegestaneIPs = ["192.168.178.74"];

// Haal het IP-adres van de bezoeker op
var bezoekerIP = "";

// Functie om het IP-adres van de bezoeker op te halen
function getBezoekerIP(callback) {
  // Stuur een verzoek naar een externe service om het IP-adres op te halen
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open("GET", "https://api.ipify.org/?format=json", true);
  xhr.send();
}

// Controleer of het IP-adres overeenkomt met een toegestaan IP-adres
function controleerIP() {
  // Roep de functie aan om het IP-adres van de bezoeker op te halen
  getBezoekerIP(function(ip) {
    bezoekerIP = ip;

    // Controleer of het IP-adres overeenkomt met een toegestaan IP-adres
    if (toegestaneIPs.indexOf(bezoekerIP) === -1) {
      // Toon een foutmelding of doorverwijzing naar een andere pagina
      alert("Je hebt geen toegang tot deze website.");
      window.location.href = "https://www.google.com";
    }
  });
}

// Roep de functie aan om het IP-adres te controleren wanneer de pagina geladen is
controleerIP();