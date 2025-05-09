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

// Stiffness K Calculator
document.getElementById("stiffnessForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user inputs
    const weight = parseFloat(document.getElementById("weight").value);
    const weightUnit = document.getElementById("weightUnit").value;
    const deflection = parseFloat(document.getElementById("deflection").value);
    const deflectionUnit = document.getElementById("deflectionUnit").value;

    // Convert weight to Newtons
    let force = weightUnit === "grams" ? weight * 9.80665 / 1000 : weight * 4.44822;

    // Convert deflection to meters
    let deflectionMeters = deflectionUnit === "inches" ? deflection * 0.0254 : deflection / 1000;

    // Calculate stiffness K
    const stiffness = force / deflectionMeters;

    // Display result rounded to 1 decimal place
    document.getElementById("kOutput").textContent = stiffness.toFixed(1);
});

// Monopole Mobility Calculator
document.getElementById("mobilityForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user inputs
    const frequency = parseFloat(document.getElementById("frequency").value);
    const stiffness = parseFloat(document.getElementById("stiffnessInput").value);

    // Calculate monopole mobility
    const mobility = (2 * Math.PI * frequency) / stiffness;

    // Display result in scientific notation
    document.getElementById("mobilityOutput").textContent = mobility.toExponential(5);
});
