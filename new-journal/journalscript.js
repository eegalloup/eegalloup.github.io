function startJourney(journey) {
    document.getElementById("start-screen").style.display = "none"; // Hide start screen

    // Hide both journeys before showing the selected one
    document.getElementById("journey1").style.display = "none";
    document.getElementById("journey2").style.display = "none";

    document.getElementById(journey).style.display = "block"; // Show selected journey

    // Ensure only the first question of the selected journey is shown
    let questions = document.querySelectorAll(`#${journey} .question`);
    questions.forEach(q => q.style.display = "none"); // Hide all questions
    questions[0].style.display = "block"; // Show only the first question
}

function nextQuestion(current, next) {
    let currentElement = document.getElementById(current);
    let nextElement = document.getElementById(next);

    if (currentElement && nextElement) {
        currentElement.style.display = "none"; // Hide current question
        nextElement.style.display = "block";     // Show next question
    } else {
        console.error(`Error: Could not find elements for ${current} or ${next}`);
    }

    if (next === "j1q3") {
        console.log("Generating repair options...");
        generateRepairOptions();
    } else if (next === "j1q4") {
        console.log("Generating quote inputs...");
        generateQuoteInputs();
    } else if (next === "j1q5") {
        console.log("Generating final repair report...");
        generateReport();
    }
}


function prevQuestion(current, previous) {
    let currentElement = document.getElementById(current);
    let previousElement = document.getElementById(previous);

    if (currentElement && previousElement) {
        currentElement.style.display = "none"; // Hide current question
        previousElement.style.display = "block"; // Show previous question
    } else {
        console.error(`Error: Could not find elements for ${current} or ${previous}`);
    }

    // Special case: If going back to the start screen, reset journey visibility
    if (previous === "start-screen") {
        document.getElementById("start-screen").style.display = "block";
        document.getElementById("journey1").style.display = "none";
        document.getElementById("journey2").style.display = "none";
    }
}

// Handle multiple button selections in j1q2
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".option-btn");
    const inputFields = {
        "Fret": document.getElementById("fret-issue"),
        "Neck": document.getElementById("neck-issue"),
        "Bridge": document.getElementById("bridge-issue"),
        "Body": document.getElementById("body-issue"),
        "Electronics": document.getElementById("electronics-issue"),
        "Other": document.getElementById("other-issue")
    };

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            this.classList.toggle("active"); // Toggle selection state

            const issueInput = inputFields[this.dataset.value];

            if (issueInput) {
                if (this.classList.contains("active")) {
                    issueInput.classList.remove("hidden");
                    issueInput.focus();
                } else {
                    issueInput.classList.add("hidden");
                    issueInput.value = ""; // Clear input when deselected
                }
            }
        });
    });
});

// Define possible repair options for each issue, including "Other"
const repairOptions = {
    "Fret": ["Leveled Frets", "Replaced Frets", "Polished Frets", "Other"],
    "Neck": ["Adjusted Truss Rod", "Reshaped Neck", "Glued Neck Joint", "Other"],
    "Bridge": ["Re-glued Bridge", "Replaced Bridge", "Adjusted Saddle", "Other"],
    "Body": ["Fixed Crack", "Refinished Body", "Repaired Binding", "Other"],
    "Electronics": ["Rewired Pickups", "Replaced Jack", "Soldered Loose Connections", "Other"],
    "Other": ["Custom Repair"]
};

// Function to generate repair options in j1q3
function generateRepairOptions() {
    const repairContainer = document.getElementById("repair-options");
    if (!repairContainer) {
        console.error("Error: repair-options container not found!");
        return;
    }

    repairContainer.innerHTML = ""; // Clear previous options

    // Get selected issues from j1q2
    let selectedIssues = [];
    document.querySelectorAll(".option-btn.active").forEach(btn => {
        selectedIssues.push(btn.dataset.value);
    });

    // Generate buttons and "Other" input fields for each selected issue
    selectedIssues.forEach(issue => {
        if (repairOptions[issue]) {
            let btnContainer = document.createElement("div");
            btnContainer.classList.add("repair-btn-container");

            let otherContainer = document.createElement("div"); // Separate container for input
            otherContainer.classList.add("other-repair-container");

            repairOptions[issue].forEach(repair => {
                if (repair === "Other") {
                    // Create "Other" button
                    let otherBtn = document.createElement("button");
                    otherBtn.classList.add("repair-btn");
                    otherBtn.textContent = "Other";
                    otherBtn.dataset.value = `Other-${issue}`;

                    // Create "Other" input field (initially hidden)
                    let otherInput = document.createElement("input");
                    otherInput.type = "text";
                    otherInput.classList.add("other-repair-input");
                    otherInput.placeholder = `Describe other ${issue.toLowerCase()} repair`;
                    otherInput.id = `other-repair-${issue}`;
                    otherInput.style.display = "none"; // Ensure it's hidden

                    // ✅ Fix: Place the input BELOW the buttons
                    otherBtn.addEventListener("click", function () {
                        if (otherInput.style.display === "none" || otherInput.style.display === "") {
                            otherInput.style.display = "block";
                            otherInput.focus();
                        } else {
                            otherInput.style.display = "none";
                            otherInput.value = ""; // Clear input if hidden
                        }
                    });

                    // Append button to buttons container
                    btnContainer.appendChild(otherBtn);
                    
                    // Append input to separate container BELOW buttons
                    otherContainer.appendChild(otherInput);

                    repairContainer.appendChild(btnContainer);
                    repairContainer.appendChild(otherContainer);
                } else {
                    let repairBtn = document.createElement("button");
                    repairBtn.classList.add("repair-btn");
                    repairBtn.textContent = repair;
                    repairBtn.dataset.value = repair;
                    repairBtn.onclick = function () {
                        this.classList.toggle("active");
                    };
                    btnContainer.appendChild(repairBtn);
                }
            });

            repairContainer.appendChild(btnContainer);
            repairContainer.appendChild(otherContainer); // Ensure input is added BELOW
        }
    });
}

function generateQuoteInputs() {
    const quoteContainer = document.getElementById("quote-container");
    if (!quoteContainer) {
        console.error("Error: quote-container not found!");
        return;
    }

    quoteContainer.innerHTML = ""; // Clear previous quotes

    let selectedRepairs = [];
    document.querySelectorAll(".repair-btn.active").forEach(btn => {
        selectedRepairs.push(btn.dataset.value);
    });

    console.log("Selected repairs for quote:", selectedRepairs);

    if (selectedRepairs.length === 0) {
        console.warn("No repairs were selected in j1q3.");
        return; // Prevent adding empty fields
    }

    // Generate quote input fields for each selected repair
    selectedRepairs.forEach(repair => {
        let quoteItem = document.createElement("div");
        quoteItem.classList.add("quote-item");

        let quoteLabel = document.createElement("label");
        quoteLabel.textContent = `${repair} Cost:`;

        // Create input field for cost
        let quoteInput = document.createElement("input");
        quoteInput.type = "number";
        quoteInput.classList.add("quote-input");
        quoteInput.placeholder = `Enter cost for ${repair}`;
        quoteInput.dataset.repair = repair;

        // Append elements to container
        quoteItem.appendChild(quoteLabel);
        quoteItem.appendChild(quoteInput);
        quoteContainer.appendChild(quoteItem);
    });
}

function submitForm() {
    // Gather selected issues
    let selectedIssues = [];
    document.querySelectorAll(".option-btn.active").forEach(btn => {
        selectedIssues.push(btn.dataset.value);
    });

    // Include the "Other" input if filled
    let otherIssue = document.getElementById("other-issue")?.value.trim();
    if (otherIssue !== "") {
        selectedIssues.push(otherIssue);
    }

    // Gather selected repairs from j1q3
    let selectedRepairs = [];
    document.querySelectorAll(".repair-btn.active").forEach(btn => {
        selectedRepairs.push(btn.dataset.value);
    });

    // Gather "Other" repair inputs
    document.querySelectorAll(".form:not(.hidden)").forEach(input => {
        let inputValue = input.value.trim();
        if (inputValue !== "") {
            selectedRepairs.push(inputValue);
        }
    });

    let formData = {
        instrument: document.getElementById("instrument")?.value || "",
        model: document.getElementById("model")?.value || "",
        serial: document.getElementById("serial")?.value || "",
        owner: document.getElementById("owner")?.value || "",
        date: document.getElementById("date")?.value || "",
        issues: selectedIssues,
        repairs: selectedRepairs,
        notes: document.getElementById("notes")?.value || ""
    };

    console.log("Form Submitted:", formData);
    alert("Your repair form has been submitted!");
}

function generateReport() {
    let reportContainer = document.getElementById("report-container");
    if (!reportContainer) {
        console.error("Error: report-container not found!");
        return;
    }
    reportContainer.innerHTML = ""; // Clear previous report

    // Get selected currency from dropdown
    const currencySelect = document.getElementById("currency-select");
    const selectedCurrency = currencySelect ? currencySelect.value : "USD"; // Default to USD

    // Currency symbols mapping
    const currencySymbols = {
        "USD": "$",  "EUR": "€",  "GBP": "£",  
        "CAD": "C$", "AUD": "A$", "JPY": "¥"
    };
    const currencySymbol = currencySymbols[selectedCurrency] || "$"; // Fallback to "$"

    let formData = {
        client: document.getElementById("client")?.value || "N/A",
        name: document.getElementById("name")?.value || "N/A",
        serial: document.getElementById("serial")?.value || "N/A",
        model: document.getElementById("model")?.value || "N/A",
        date: document.getElementById("date")?.value || "N/A",
        issues: [],
        repairs: [],
        quotes: [],
        additionalCosts: {}
    };

    // Collect selected issues
    document.querySelectorAll(".option-btn.active").forEach(btn => {
        formData.issues.push(btn.dataset.value);
    });

    // Collect selected repairs
    document.querySelectorAll(".repair-btn.active").forEach(btn => {
        formData.repairs.push(btn.dataset.value);
    });

    // Collect "Other" inputs if filled
    document.querySelectorAll(".form:not(.hidden)").forEach(input => {
        let inputValue = input.value.trim();
        if (inputValue !== "") {
            formData.repairs.push(inputValue);
        }
    });

    let totalCost = 0;

    // ✅ Collect repair quotes and apply currency symbol
    document.querySelectorAll(".quote-input").forEach(input => {
        let repair = input.dataset.repair;
        let cost = parseFloat(input.value.trim());
        if (!isNaN(cost)) {
            formData.quotes.push(`${repair}: ${currencySymbol}${cost.toFixed(2)}`);
            totalCost += cost;
        }
    });

    // ✅ Collect additional costs
    const additionalCostFields = {
        "Labor": "labor-cost",
        "Materials": "materials-cost",
        "Tax/Fees": "tax-cost"
    };

    Object.entries(additionalCostFields).forEach(([label, id]) => {
        let cost = parseFloat(document.getElementById(id)?.value.trim() || 0);
        if (!isNaN(cost) && cost > 0) {
            formData.additionalCosts[label] = `${currencySymbol}${cost.toFixed(2)}`;
            totalCost += cost;
        }
    });

    // Generate Report HTML
    let reportHTML = `
        <h2>Repair Summary</h2>
        <p><strong>Client Name:</strong> ${formData.client}</p>
        <p><strong>Repair Technician:</strong> ${formData.name}</p>
        <p><strong>Serial Number:</strong> ${formData.serial}</p>
        <p><strong>Model:</strong> ${formData.model}</p>
        <p><strong>Repair Date:</strong> ${formData.date}</p>
        <h3>Issues Identified</h3>
        <ul>${formData.issues.map(issue => `<li>${issue}</li>`).join("")}</ul>
        <h3>Repairs Performed</h3>
        <ul>${formData.repairs.map(repair => `<li>${repair}</li>`).join("")}</ul>
        <h3>Quotes (${selectedCurrency})</h3>
        <ul>${formData.quotes.map(quote => `<li>${quote}</li>`).join("")}</ul>
        <h3>Additional Costs</h3>
        <ul>${Object.entries(formData.additionalCosts).map(([label, cost]) => `<li>${label}: ${cost}</li>`).join("")}</ul>
        <h3>Total Cost: ${currencySymbol}${totalCost.toFixed(2)}</h3>
    `;

    reportContainer.innerHTML = reportHTML;
}


// Function to download report as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let reportText = document.getElementById("report-container").innerText;

    doc.text(reportText, 10, 10);
    doc.save("repair_report.pdf");
}

// Function to print the repair report
function printReport() {
    let printContent = document.getElementById("report-container").innerHTML;
    let originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    location.reload(); // Reload to restore page content
}

// Function to email the repair report
function emailPDF() {
    let clientEmail = prompt("Enter client's email address:");
    if (!clientEmail) return; // Stop if no email is provided

    let subject = "Repair Report";
    let body = encodeURIComponent(document.getElementById("report-container").innerText);

    window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
}
