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

  // Scroll-based header styling
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Show login popup if needed
  const needsLogin = sessionStorage.getItem('login_required');
  if (needsLogin === 'true') {
    const popup = document.getElementById('login-popup');
    popup.style.display = 'block';
    sessionStorage.removeItem('login_required');
  }
});

// Popup dismiss function
function dismissPopup() {
  const popup = document.getElementById('login-popup');
  if (popup) popup.style.display = 'none';
}