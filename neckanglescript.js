document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const directoryOverlay = document.querySelector(".directory-overlay");
    const menuLinks = document.querySelectorAll(".directory-overlay ul a");

    // Menu toggle functionality
    if (menuToggle && directoryOverlay) {
        menuToggle.addEventListener("click", function () {
            directoryOverlay.classList.add("active");
        });
    }

    if (menuClose) {
        menuClose.addEventListener("click", function () {
            directoryOverlay.classList.remove("active");
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", function () {
            directoryOverlay.classList.remove("active");
        });
    });

    // Function to calculate frets
    function calculateFrets() {
        const scaleLengthInput = document.getElementById("scale-length").value;
        const fretNumber = parseInt(document.getElementById("fret-number").value);
        const measurementSystem = document.getElementById("measurement-system").value;
        
        if (isNaN(scaleLengthInput) || scaleLengthInput <= 0 || isNaN(fretNumber) || fretNumber <= 0 || fretNumber > 24) {
            alert("Please enter a valid scale length and fret number.");
            return;
        }

        let scaleLength = parseFloat(scaleLengthInput);

        // Convert to inches if metric is selected
        if (measurementSystem === "metric") {
            scaleLength = scaleLength / 25.4; // Convert mm to inches
        }

        // Calculate the distance from nut to the given fret
        const distanceFromNut = scaleLength - (scaleLength / Math.pow(2, fretNumber / 12));

        // Calculate Side B
        const sideB = scaleLength - distanceFromNut;

        // Run the triangle calculation with the computed Side B
        calculateTriangle(sideB, measurementSystem);
    }

    // Function to calculate the triangle
    function calculateTriangle(b, measurementSystem) {
        let aInput = document.getElementById("sideA").value;
        let deflectionInput = document.getElementById("bridge-deflection").value;
        let fretboardThicknessInput = document.getElementById("fretboard-thickness").value;

        if (isNaN(aInput) || aInput <= 0 || isNaN(b) || b <= 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        let a = parseFloat(aInput);
        let bridgeDeflection = isNaN(parseFloat(deflectionInput)) ? 0 : parseFloat(deflectionInput); // Default to 0 if empty
        let fretboardThickness = isNaN(parseFloat(fretboardThicknessInput)) ? 0 : parseFloat(fretboardThicknessInput); // Default to 0 if empty

        // Apply bridge deflection
        a += bridgeDeflection;

        // Convert values to inches if metric is selected
        if (measurementSystem === "metric") {
            a = a / 25.4; // Convert mm to inches
            fretboardThickness = fretboardThickness / 25.4; // Convert mm to inches
        }

        // Subtract fretboard thickness from bridge height
        a -= fretboardThickness;

        // Ensure Side A is still positive after subtraction
        if (a <= 0) {
            alert("Error: The calculated bridge height (Side A) cannot be zero or negative. Check the input values.");
            return;
        }

        let c = Math.sqrt(a ** 2 + b ** 2);
        let theta1 = Math.asin(a / c) * (180 / Math.PI);

        // Convert result back to metric if needed
        if (measurementSystem === "metric") {
            a = a * 25.4;
            b = b * 25.4;
            c = c * 25.4;
        }

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

function showInfo(event, infoId) {
    // Close all other info boxes
    document.querySelectorAll('.info-box').forEach(box => {
        if (box.id !== infoId) {
            box.classList.remove('active');
        }
    });

    const infoBox = document.getElementById(infoId);

    if (infoBox) {
        infoBox.classList.toggle('active');

        // Position tooltip near the clicked icon
        let rect = event.target.getBoundingClientRect();
        infoBox.style.left = `${rect.left + window.scrollX + 10}px`; 
        infoBox.style.top = `${rect.bottom + window.scrollY + 5}px`; 
    }
}

// Close tooltips when clicking outside
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("info-icon")) {
        document.querySelectorAll('.info-box').forEach(box => box.classList.remove('active'));
    }
});
