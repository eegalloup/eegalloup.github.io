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
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }

    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
      const token = await auth0.getTokenSilently();
      localStorage.setItem("patreon_token", token);
      loadUserProfile();
    } else {
      const loginButton = document.getElementById("login-button");
      if (loginButton) {
        loginButton.addEventListener("click", async (e) => {
          e.preventDefault();
          await auth0.loginWithRedirect({
            authorizationParams: {
              scope: "openid profile email"
            }
          });
        });
      }
    }
  } catch (err) {
    console.error("Auth0 init error:", err);
  }
}

async function loadUserProfile() {
  const loginArea = document.getElementById("login-area");
  if (!loginArea) return;
  const user = await auth0.getUser();
  const displayName = user.nickname || user.name || user.email;
  loginArea.innerHTML = `
    <li class="profile-wrapper">
      <div class="profile-pic-container" id="profileToggle">
        <img src="images/profile-pic.jpg" alt="Profile" class="profile-pic" title="Logged In" />
      </div>
      <div class="dropdown-menu" id="dropdownMenu">
        <span class="dropdown-name">${displayName}</span>
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

document.addEventListener("DOMContentLoaded", async () => {
  await initAuth();
});
