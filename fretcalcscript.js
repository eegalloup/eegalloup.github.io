function calculateFrets() {
    const scaleLengthInput = document.getElementById("scale-length");
    const scaleLength = parseFloat(scaleLengthInput.value);
    const fretPositionsTable = document.getElementById("fret-positions").querySelector("tbody");

    // Clear previous results
    fretPositionsTable.innerHTML = "";

    // Check for valid input
    if (isNaN(scaleLength) || scaleLength <= 0) {
        fretPositionsTable.innerHTML = "<tr><td colspan='3'>Please enter a valid scale length.</td></tr>";
        return;
    }

    let previousDistance = scaleLength; // Initial distance at the nut (fret 0)

    // Calculate each fret position and fret-to-fret distance
    for (let fret = 1; fret <= 24; fret++) {
        const distanceFromNut = scaleLength - (scaleLength / Math.pow(2, fret / 12));

        // Set the first fret-to-fret distance as zero, then calculate others normally
        const fretToFretDistance = fret === 1 ? 0 : Math.abs(previousDistance - distanceFromNut);

        // Create table row for each fret
        const row = document.createElement("tr");

        // Fret Number column
        const fretNumberCell = document.createElement("td");
        fretNumberCell.textContent = fret;

        // Distance from Nut column
        const distanceFromNutCell = document.createElement("td");
        distanceFromNutCell.textContent = distanceFromNut.toFixed(3);

        // Distance from Previous Fret column
        const fretToFretDistanceCell = document.createElement("td");
        fretToFretDistanceCell.textContent = fretToFretDistance.toFixed(3);

        // Append cells to the row
        row.appendChild(fretNumberCell);
        row.appendChild(distanceFromNutCell);
        row.appendChild(fretToFretDistanceCell);

        // Append row to the table body
        fretPositionsTable.appendChild(row);

        // Update previous distance for the next calculation
        previousDistance = distanceFromNut;
    }

    // Clear the input field for convenience
    scaleLengthInput.value = "";
}
