window.addEventListener('DOMContentLoaded', () => {
  const newElement = document.createElement('div');
  newElement.className = 'custom-element';
  newElement.textContent = '𖣠';

  const saveLocation = (left, top) => {
    localStorage.setItem('elementLocation', JSON.stringify({ left, top }));
  };

  const restoreLocation = () => {
    const savedLocation = localStorage.getItem('elementLocation');
    if (savedLocation) {
      const { left, top } = JSON.parse(savedLocation);
      newElement.style.left = `${left}px`;
      newElement.style.top = `${top}px`;
    }
  };

  let isDragging = false;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  const startDragging = (event) => {
    event.preventDefault();

    if (event.type === 'mousedown') {
      isDragging = true;
      touchOffsetX = event.clientX - newElement.offsetLeft;
      touchOffsetY = event.clientY - newElement.offsetTop;
    } else if (event.type === 'touchstart') {
      isDragging = true;
      touchOffsetX = event.touches[0].clientX - newElement.offsetLeft;
      touchOffsetY = event.touches[0].clientY - newElement.offsetTop;
    }
  };

  const moveElement = (event) => {
    event.preventDefault();
  
    if (isDragging) {
      let clientX, clientY;
      if (event.type === 'mousemove') {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }
      newElement.style.left = `${clientX - touchOffsetX}px`;
      newElement.style.top = `${clientY - touchOffsetY}px`;
    }
  };

  const stopDragging = () => {
    isDragging = false;
    saveLocation(parseInt(newElement.style.left), parseInt(newElement.style.top));
  };

  newElement.addEventListener('mousedown', startDragging);
  newElement.addEventListener('touchstart', startDragging);

  document.addEventListener('mousemove', moveElement);
  document.addEventListener('touchmove', moveElement);

  document.addEventListener('mouseup', stopDragging);
  document.addEventListener('touchend', stopDragging);

  restoreLocation();

  document.body.appendChild(newElement);

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset aanwijzer';
  resetButton.style.position = 'fixed';
  resetButton.style.left = '10px';
  resetButton.style.top = '5px';
  resetButton.addEventListener('click', () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const elementWidth = newElement.offsetWidth;
    const elementHeight = newElement.offsetHeight;
  
    const centerX = (screenWidth - elementWidth) / 2;
    const centerY = (screenHeight - elementHeight) / 2;
  
    newElement.style.left = `${centerX}px`;
    newElement.style.top = `${centerY}px`;
  
    saveLocation(centerX, centerY);
  });

  document.body.appendChild(resetButton);
});
