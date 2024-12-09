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
