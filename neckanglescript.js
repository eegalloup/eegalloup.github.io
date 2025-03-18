document.addEventListener("DOMContentLoaded", function () {
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

    function calculateTriangle(b) {
        let a = parseFloat(document.getElementById("sideA").value);

        if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        let c = Math.sqrt(a ** 2 + b ** 2);
        let theta1 = Math.asin(a / c) * (180 / Math.PI);
        let theta2 = Math.asin(b / c) * (180 / Math.PI);

        // Display the main result as Angle 1
        document.getElementById("result").innerHTML = `
            <strong>Neck Angle:</strong> ${theta1.toFixed(2)}°<br>
        `;
    }

    document.getElementById("calculate-fret").addEventListener("click", calculateFrets);
});
