document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const directoryOverlay = document.querySelector(".directory-overlay");
    const menuLinks = document.querySelectorAll(".directory-overlay ul a");

    // Debugging: Check if elements exist
    console.log("Menu Toggle:", menuToggle);
    console.log("Menu Close:", menuClose);
    console.log("Directory Overlay:", directoryOverlay);

    // Prevent script errors if elements don't exist
    if (menuToggle && directoryOverlay) {
        // Open menu
        menuToggle.addEventListener("click", function () {
            directoryOverlay.classList.add("active");
        });
    }

    if (menuClose) {
        // Close menu
        menuClose.addEventListener("click", function () {
            directoryOverlay.classList.remove("active");
        });
    }

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener("click", function () {
            directoryOverlay.classList.remove("active");
        });
    });

    // Function to calculate frets
    function calculateFrets() {
        const scaleLength = parseFloat(document.getElementById("scale-length").value);
        const fretNumber = parseInt(document.getElementById("fret-number").value);

        if (isNaN(scaleLength) || scaleLength <= 0 || isNaN(fretNumber) || fretNumber <= 0 || fretNumber > 24) {
            alert("Please enter a valid scale length and fret number.");
            return;
        }

        // Calculate the distance from nut to the given fret
        const distanceFromNut = scaleLength - (scaleLength / Math.pow(2, fretNumber / 12));

        // Calculate Side B
        const sideB = scaleLength - distanceFromNut;

        // Run the triangle calculation with the computed Side B
        calculateTriangle(sideB);
    }

    // Function to calculate the triangle
    function calculateTriangle(b) {
        let a = parseFloat(document.getElementById("sideA").value);

        if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        let c = Math.sqrt(a ** 2 + b ** 2);
        let theta1 = Math.asin(a / c) * (180 / Math.PI);

        // Display the main result as Neck Angle
        document.getElementById("result").innerHTML = `
            <strong>Neck Angle:</strong> ${theta1.toFixed(2)}°<br>
        `;
    }

    // Check if button exists before adding event listener
    const calculateButton = document.getElementById("calculate-fret");
    if (calculateButton) {
        calculateButton.addEventListener("click", calculateFrets);
    } else {
        console.log("Error: Calculate button not found!");
    }
});
