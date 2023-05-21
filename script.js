document.addEventListener("DOMContentLoaded", function() {
    var currentDate = new Date();
    var targetDate = new Date(currentDate.getFullYear(), 4, 30); // 4 staat voor mei (index begint bij 0)

    if (currentDate >= targetDate) {
       var element = document.getElementById("birthday-message");
       element.style.display = "none";
    }
});