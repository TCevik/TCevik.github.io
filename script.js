<script>
    document.addEventListener("DOMContentLoaded", function() {
        var currentDate = new Date();
        var targetDateStart = new Date(currentDate.getFullYear(), 4, 17); // 4 staat voor mei (index begint bij 0)
        var targetDateEnd = new Date(currentDate.getFullYear(), 4, 30); // 4 staat voor mei (index begint bij 0)

        if (currentDate >= targetDateStart && currentDate < targetDateEnd) {
            var element = document.getElementById("birthday-message");
            element.style.display = "block";
        } else {
            var element = document.getElementById("birthday-message");
            element.style.display = "none";
        }
    });
</script>