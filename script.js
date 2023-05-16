// Gegevens verzamelen
function logActivity(activity) {
  var activities = localStorage.getItem('studentActivities');
  if (!activities) {
    activities = [];
  } else {
    activities = JSON.parse(activities);
  }
  activities.push(activity);
  localStorage.setItem('studentActivities', JSON.stringify(activities));
}

// Activiteit loggen wanneer de pagina wordt geladen
window.onload = function() {
  logActivity('Page loaded');
};

// Activiteit loggen wanneer er op een link wordt geklikt
var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function() {
    logActivity('Link clicked: ' + this.href);
  });
}
