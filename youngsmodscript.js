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

function calculateYoungsModulus() {
    // Retrieve inputs
    const weight = parseFloat(document.getElementById("weight").value);
    const weightUnit = document.getElementById("weightUnit").value;
    let length = parseFloat(document.getElementById("length").value);
    const lengthUnit = document.getElementById("lengthUnit").value;
    let width = parseFloat(document.getElementById("width").value);
    const widthUnit = document.getElementById("widthUnit").value;
    let thickness = parseFloat(document.getElementById("thickness").value);
    const thicknessUnit = document.getElementById("thicknessUnit").value;
    let deflection = parseFloat(document.getElementById("deflection").value);
    const deflectionUnit = document.getElementById("deflectionUnit").value;

    // Validate inputs
    if (!weight || !length || !width || !thickness || !deflection) {
        document.getElementById("output").innerText = "All fields are required.";
        return;
    }

    // Constants
    const g = 9.81; // Gravity in m/s²

    // Convert weight to Newtons
    let force = weight;
    if (weightUnit === "lb") {
        force = weight * 0.453592; // Convert pounds to kilograms
    }
    force *= g; // Convert to Newtons

    // Convert all dimensions to meters
    if (lengthUnit === "in") {
        length *= 0.0254;
    }
    if (widthUnit === "in") {
        width *= 0.0254;
    }
    if (thicknessUnit === "in") {
        thickness *= 0.0254;
    }
    if (deflectionUnit === "in") {
        deflection *= 0.0254;
    }

    // Calculate Young's Modulus
    const youngsModulus = (force * Math.pow(length, 3)) / (4 * width * Math.pow(thickness, 3) * deflection);
    const youngsModulusGPa = youngsModulus / 1e9; // Convert to GPa

    // Display result
    if (!isFinite(youngsModulusGPa) || youngsModulusGPa <= 0) {
        document.getElementById("output").innerText = "Calculation error. Check your inputs.";
    } else {
        document.getElementById("output").innerText = `Young's Modulus: ${youngsModulusGPa.toFixed(2)} GPa`;
    }
}
