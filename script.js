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
  
      // Optional: Auto-hide after 4 seconds
      // setTimeout(() => {
      //   popup.style.display = 'none';
      // }, 4000);
    }
  
    // Patreon login status and profile swap
    const token = localStorage.getItem('patreon_token');
  
    if (token) {
      fetch("https://www.patreon.com/api/oauth2/v2/identity?fields[user]=image_url,full_name", {
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      .then(res => res.json())
      .then(data => {
        const imgUrl = data.data.attributes.image_url || 'default-profile.png';
        const fullName = data.data.attributes.full_name || 'User';
  
        document.getElementById("login-area").innerHTML = `
          <div class="profile-wrapper">
            <img src="${imgUrl}" alt="${fullName}" class="profile-pic" title="${fullName}" />
            <div class="logout-menu" onclick="logout()">Log out</div>
          </div>
        `;
      })
      .catch(() => {
        localStorage.removeItem('patreon_token');
        window.location.reload();
      });
    }
  });
  
  // Global logout function
  function logout() {
    localStorage.removeItem('patreon_token');
    window.location.href = '/index.html';
  }
  
  // Popup dismiss function
  function dismissPopup() {
    document.getElementById('login-popup').style.display = 'none';
  }
  