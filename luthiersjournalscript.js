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

const imageInput = document.getElementById('image');
const preview = document.getElementById('preview');
const downloadButton = document.getElementById('download');

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

downloadButton.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const formData = {
        "Project Name": document.getElementById('project-name').value || 'N/A',
        "Instrument Type": document.getElementById('instrument-type').value || 'N/A',
        "Current Date": document.getElementById('current-date').value || 'N/A',
        "Project Description": document.getElementById('project-description').value || 'N/A',
        "Body Wood": document.getElementById('body-wood').value || 'N/A',
        "Neck Wood": document.getElementById('neck-wood').value || 'N/A',
        "Fretboard Wood": document.getElementById('fretboard-wood').value || 'N/A',
        "Additional Notes": document.getElementById('additional-notes').value || 'N/A',
        "Current Stage": document.getElementById('current-stage').value || 'N/A',
        "Stage Notes": document.getElementById('stage-notes').value || 'N/A',
        "Action Height": document.getElementById('action-height').value || 'N/A',
        "Neck Relief": document.getElementById('neck-relief').value || 'N/A',
        "String Gauge": document.getElementById('string-gauge').value || 'N/A',
        "Tuning Setup": document.getElementById('tuning-setup').value || 'N/A',
        "Finishing Technique": document.getElementById('finishing-technique').value || 'N/A',
        "Finish Color": document.getElementById('finish-color').value || 'N/A',
        "Additional Notes on Finish": document.getElementById('additional-notes-on-finish').value || 'N/A',
        "Project Summary": document.getElementById('project-summary').value || 'N/A'
    };

    let yOffset = 10; // Initial vertical offset
    Object.keys(formData).forEach(key => {
        doc.text(`${key}: ${formData[key]}`, 10, yOffset);
        yOffset += 10;
        if (yOffset > 280) { // Prevent text overflow
            doc.addPage();
            yOffset = 10;
        }
    });

    if (preview.src) {
        const img = new Image();
        img.src = preview.src;
        img.onload = () => {
            const imgWidth = 100;
            const imgHeight = (img.height / img.width) * imgWidth;
            doc.addImage(preview.src, 'JPEG', 10, yOffset, imgWidth, imgHeight);
            doc.save('lutherie-journal.pdf');
        };
    } else {
        doc.save('lutherie-journal.pdf');
    }
});
