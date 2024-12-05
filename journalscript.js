document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add("hidden"); // Hide the header when scrolling down
        } else {
            header.classList.remove("hidden"); // Show the header when scrolling up
        }

        lastScroll = currentScroll;
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

// Save Setup and Display
function saveSetup() {
    const actionHeight = document.getElementById("action-height").value;
    const neckRelief = document.getElementById("neck-relief").value;
    const stringGauge = document.getElementById("string-gauge").value;
    const tuningNotes = document.getElementById("tuning-notes").value;

    if (actionHeight === "" || neckRelief === "" || stringGauge === "" || tuningNotes === "") {
        alert("Please fill out all setup fields.");
        return;
    }

    const setupEntry = {
        actionHeight,
        neckRelief,
        stringGauge,
        tuningNotes,
    };

    let setups = JSON.parse(localStorage.getItem("setups")) || [];
    setups.push(setupEntry);
    localStorage.setItem("setups", JSON.stringify(setups));

    alert("Setup saved!");
    displaySetups();

    // Clear fields
    document.getElementById("action-height").value = "";
    document.getElementById("neck-relief").value = "";
    document.getElementById("string-gauge").value = "";
    document.getElementById("tuning-notes").value = "";
}

function displaySetups() {
    const setups = JSON.parse(localStorage.getItem("setups")) || [];
    const setupsContainer = document.querySelector(".setups-display");
    setupsContainer.innerHTML = "";

    setups.forEach((setup, index) => {
        const setupEntry = document.createElement("div");
        setupEntry.classList.add("setup-entry");

        setupEntry.innerHTML = `
            <strong>Setup ${index + 1}</strong><br>
            Action Height: ${setup.actionHeight} mm<br>
            Neck Relief: ${setup.neckRelief} mm<br>
            String Gauge: ${setup.stringGauge}<br>
            Tuning Notes: ${setup.tuningNotes}
        `;

        setupsContainer.appendChild(setupEntry);
    });
}

// Save Finishing Details and Display
function saveFinishingDetails() {
    const technique = document.getElementById("finish-technique").value;
    const color = document.getElementById("finish-color").value;
    const notes = document.getElementById("finish-notes").value;

    if (technique === "" || color === "" || notes === "") {
        alert("Please fill out all finishing details.");
        return;
    }

    const finishingEntry = { technique, color, notes };
    localStorage.setItem("finishingDetails", JSON.stringify(finishingEntry));

    alert("Finishing details saved!");
    displayFinishingDetails();

    // Clear fields
    document.getElementById("finish-technique").value = "";
    document.getElementById("finish-color").value = "";
    document.getElementById("finish-notes").value = "";
}

function displayFinishingDetails() {
    const finishingDetails = JSON.parse(localStorage.getItem("finishingDetails"));
    const finishingContainer = document.querySelector(".finishing-display");
    finishingContainer.innerHTML = "";

    if (finishingDetails) {
        const finishingEntry = document.createElement("div");
        finishingEntry.classList.add("finishing-entry");

        finishingEntry.innerHTML = `
            <strong>Technique:</strong> ${finishingDetails.technique}<br>
            <strong>Color:</strong> ${finishingDetails.color}<br>
            <strong>Notes:</strong> ${finishingDetails.notes}
        `;

        finishingContainer.appendChild(finishingEntry);
    }
}

// Save Project Summary and Display
function saveProjectSummary() {
    const summaryNotes = document.getElementById("summary-notes").value;

    if (summaryNotes === "") {
        alert("Please add some reflection notes.");
        return;
    }

    localStorage.setItem("projectSummary", summaryNotes);

    alert("Project summary saved!");
    displayProjectSummary();

    // Clear field
    document.getElementById("summary-notes").value = "";
}

function displayProjectSummary() {
    const summaryNotes = localStorage.getItem("projectSummary");
    const summaryContainer = document.querySelector(".summary-display");
    summaryContainer.innerHTML = "";

    if (summaryNotes) {
        const summaryEntry = document.createElement("div");
        summaryEntry.classList.add("summary-entry");
        summaryEntry.innerText = summaryNotes;

        summaryContainer.appendChild(summaryEntry);
    }
}

// Generate PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Add content
    const setups = JSON.parse(localStorage.getItem("setups")) || [];
    const finishingDetails = JSON.parse(localStorage.getItem("finishingDetails")) || {};
    const summaryNotes = localStorage.getItem("projectSummary") || "";

    let yOffset = 10; // Vertical position offset

    pdf.setFont("helvetica", "bold");
    pdf.text("Luthier's Workshop Journal", 10, yOffset);
    yOffset += 10;

    pdf.setFont("helvetica", "normal");
    pdf.text("Setups:", 10, yOffset);
    yOffset += 10;

    setups.forEach((setup, index) => {
        pdf.text(
            `Setup ${index + 1}: Action Height: ${setup.actionHeight} mm, Neck Relief: ${setup.neckRelief} mm, String Gauge: ${setup.stringGauge}, Notes: ${setup.tuningNotes}`,
            10,
            yOffset
        );
        yOffset += 10;
    });

    if (Object.keys(finishingDetails).length > 0) {
        pdf.text("Finishing Details:", 10, yOffset);
        yOffset += 10;

        pdf.text(
            `Technique: ${finishingDetails.technique}, Color: ${finishingDetails.color}, Notes: ${finishingDetails.notes}`,
            10,
            yOffset
        );
        yOffset += 10;
    }

    if (summaryNotes) {
        pdf.text("Project Summary:", 10, yOffset);
        yOffset += 10;

        pdf.text(summaryNotes, 10, yOffset);
    }

    // Save PDF
    pdf.save("Luthiers_Workshop_Journal.pdf");
}

document.getElementById("save-as-pdf").addEventListener("click", function () {
    const { jsPDF } = window.jspdf; // Load jsPDF
    const pdf = new jsPDF();

    // Get the journal container content
    const journalContent = document.querySelector(".container");

    // Convert the journal content to a PDF
    pdf.html(journalContent, {
        callback: function (doc) {
            doc.save("Luthiers_Journal.pdf"); // Save the file with this name
        },
        x: 10, // Horizontal offset
        y: 10, // Vertical offset
        html2canvas: { scale: 0.8 }, // Adjust scale for better quality
    });
});