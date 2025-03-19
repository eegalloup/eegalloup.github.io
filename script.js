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

window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 50) { // Adjust threshold if needed
        header.classList.add("scrolled"); // Add class when scrolling down
    } else {
        header.classList.remove("scrolled"); // Remove class when at top
    }
});

window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");

    if (window.scrollY > 50) {  
        header.classList.add("scrolled");
        console.log("Scrolled: Normal logo should appear");  // Debugging
    } else {
        header.classList.remove("scrolled");
        console.log("At top: White logo should appear");  // Debugging
    }
});

window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 50) { 
        header.classList.add("scrolled"); // Adds scroll effect
    } else {
        header.classList.remove("scrolled"); // Removes scroll effect
    }
});



