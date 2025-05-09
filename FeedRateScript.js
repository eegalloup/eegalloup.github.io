// Block access to this page if user is not logged in
(function () {
    const token = localStorage.getItem('patreon_token');
  
    if (!token) {
      // Redirect to homepage or custom "please log in" page
        sessionStorage.setItem('login_required', 'true');
        window.location.href = '/index.html';
    }
  })();
  
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const directoryOverlay = document.querySelector(".directory-overlay");
    const menuLinks = document.querySelectorAll(".directory-overlay ul a");

    // Open menu
    menuToggle.addEventListener("click", function () {
        directoryOverlay.classList.add("active");
    });

    // Close menu
    menuClose.addEventListener("click", function () {
        directoryOverlay.classList.remove("active");
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener("click", function () {
            directoryOverlay.classList.remove("active");
        });
    });
});

function calculateFeedRate() {
    let rpm = parseFloat(document.getElementById('rpm').value) || 0;
    let flutes = parseFloat(document.getElementById('flutes').value) || 0;
    let chipload = parseFloat(document.getElementById('chipload').value) || 0;
    if (rpm <= 0 || flutes <= 0 || chipload <= 0) {
        document.getElementById('result-feedrate').textContent = "Please enter valid positive numbers.";
        return;
    }
    let feedRate = rpm * flutes * chipload;
    document.getElementById('result-feedrate').textContent = `Feed Rate: ${feedRate.toFixed(2)} inches/min`;
}

function calculateChipLoad() {
    let feedrate = parseFloat(document.getElementById('feedrate').value) || 0;
    let rpm = parseFloat(document.getElementById('rpm-chip').value) || 0;
    let flutes = parseFloat(document.getElementById('flutes-chip').value) || 0;
    if (feedrate <= 0 || rpm <= 0 || flutes <= 0) {
        document.getElementById('result-chipload').textContent = "Please enter valid positive numbers.";
        return;
    }
    let chipLoad = feedrate / (rpm * flutes);
    document.getElementById('result-chipload').textContent = `Chip Load: ${chipLoad.toFixed(4)} inches/tooth`;
}

function calculateFeedPerRevolution() {
    let feedrate = parseFloat(document.getElementById('feedrate-fpr').value) || 0;
    let rpm = parseFloat(document.getElementById('rpm-fpr').value) || 0;
    if (feedrate <= 0 || rpm <= 0) {
        document.getElementById('result-fpr').textContent = "Please enter valid positive numbers.";
        return;
    }
    let feedPerRevolution = feedrate / rpm;
    document.getElementById('result-fpr').textContent = `Feed per Revolution: ${feedPerRevolution.toFixed(4)} inches/rev`;
}
