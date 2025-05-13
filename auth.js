// auth.js

let auth0 = null;

async function initAuth() {
  try {
    auth0 = await createAuth0Client({
      domain: "dev-agd6batxjqwwngzp.us.auth0.com",
      client_id: "mQNsWOq2ShrI309xhlFfkSaWbn32wiho",
      audience: "https://www.patreon.com/api/oauth2/v2/identity",
      useRefreshTokens: true,
      cacheLocation: "localstorage",
      redirect_uri: window.location.origin
    });

    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      console.log("🔁 Handling redirect callback...");
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }

    const isAuthenticated = await auth0.isAuthenticated();
    console.log("🔒 Authenticated:", isAuthenticated);

    if (isAuthenticated) {
      const token = await auth0.getTokenSilently();
      console.log("🔑 Token acquired:", token);
      localStorage.setItem("patreon_token", token);
      loadUserProfile();
    } else {
      const loginButton = document.getElementById("login-button");
      if (loginButton) {
        loginButton.addEventListener("click", async (e) => {
          e.preventDefault();
          console.log("🚪 Redirecting to login...");
          await auth0.loginWithRedirect({
            authorizationParams: {
              scope: "openid profile email"
            }
          });
        });
      }
    }
  } catch (err) {
    console.error("❌ Auth0 init error:", err);
  }
}

async function loadUserProfile() {
  const loginArea = document.getElementById("login-area");
  if (!loginArea) return;

  const user = await auth0.getUser();

  loginArea.innerHTML = `
    <li class="profile-wrapper">
      <div class="profile-pic-container" id="profileToggle">
        <img src="images/profile-pic.jpg" alt="Profile" class="profile-pic" title="Logged In" />
      </div>
      <div class="dropdown-menu" id="dropdownMenu">
        <span class="dropdown-name">${user.name}</span>
        <a href="#" id="logoutLink">Log out</a>
      </div>
    </li>`;

  const profileToggle = document.getElementById("profileToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutLink = document.getElementById("logoutLink");

  profileToggle.addEventListener("click", () => {
    const isVisible = dropdownMenu.style.display === "block";
    dropdownMenu.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!profileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

function logout() {
  localStorage.removeItem("patreon_token");
  auth0.logout({ returnTo: window.location.origin });
}

function triggerLogin() {
  if (auth0) {
    auth0.loginWithRedirect({
      authorizationParams: {
        scope: "openid profile email"
      }
    });
  } else {
    window.location.href = "https://www.luthiertoolbox.com/";
  }
}

function dismissPopup() {
  const popup = document.getElementById("login-popup");
  if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAuth();

  const gatedPages = [
    "FeedRate.html",
    "fretboardtaper.html",
    "FretCalculator.html",
    "luthiersjournal.html",
    "MonopoleMobility.html",
    "neckangle.html",
    "tonegenerator.html",
    "YoungsModulus.html"
  ];

  const currentPage = window.location.pathname.split("/").pop();
  const token = localStorage.getItem("patreon_token");

  if (gatedPages.includes(currentPage)) {
    if (!token) {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0, 0, 0, 0.8)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = 9999;

      const messageBox = document.createElement("div");
      messageBox.style.background = "white";
      messageBox.style.padding = "2rem";
      messageBox.style.textAlign = "center";
      messageBox.style.borderRadius = "8px";
      messageBox.style.maxWidth = "400px";

      messageBox.innerHTML = `
        <h2>🔒 Members Only</h2>
        <p>You must be logged in to access this page.</p>
        <p>Redirecting to home...</p>
      `;

      overlay.appendChild(messageBox);
      document.body.appendChild(overlay);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 3000);
    }
  }
});
