document.addEventListener('DOMContentLoaded', function() {
    // Controleer of de gebruiker de website voor het eerst bezoekt
    if (!localStorage.getItem('visited')) {
      // Maak een nieuw element voor de popup
      var popup = document.createElement('div');
      popup.id = 'popup';
      popup.className = 'popup'; // Voeg de class "popup" toe
  
      // Voeg de tekst toe aan de popup
      var text = document.createTextNode('Door deze website te gebruiken ga je akkoord met de privacy policy en de terms of service.');
      popup.appendChild(text);
  
      // Maak de "Ok" knop
      var button = document.createElement('button');
      button.innerHTML = 'Ok';
  
      // Voeg een event listener toe aan de knop
      button.addEventListener('click', function() {
        // Verberg de popup
        popup.style.display = 'none';
  
        // Sla op dat de gebruiker de website heeft bezocht
        localStorage.setItem('visited', 'true');
      });
  
      // Voeg de knop toe aan de popup
      popup.appendChild(button);
  
      // Voeg de popup toe aan de body van de pagina
      document.body.appendChild(popup);
    }
  });  