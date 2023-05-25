document.addEventListener('DOMContentLoaded', function() {
    // Controleer of de gebruiker de website voor het eerst bezoekt
    if (!localStorage.getItem('visited')) {
      // Maak een nieuw element voor de popup
      var popup = document.createElement('div');
      popup.id = 'popup';
      popup.style.position = 'fixed';
      popup.style.bottom = '10px';
      popup.style.left = '10px';
      popup.style.background = '#ffffff';
      popup.style.padding = '10px';
      popup.style.border = '1px solid #cccccc';
  
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