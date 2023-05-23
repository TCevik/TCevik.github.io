// Voeg hier de IP-adressen toe die toegang hebben tot de website
var toegestaneIPs = ["192.168.178.1"];

// Haal het IP-adres van de bezoeker op
var bezoekerIP = "<?php echo $_SERVER['REMOTE_ADDR']; ?>";

// Controleer of het IP-adres overeenkomt met een toegestaan IP-adres
if (toegestaneIPs.indexOf(bezoekerIP) === -1) {
    // Toon een foutmelding of doorverwijzing naar een andere pagina
    alert("Je hebt geen toegang tot deze website.");
    window.location.href = "https://www.google.com";
}