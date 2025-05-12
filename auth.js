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
          await auth0.loginWithRedirect();
        });
      }
    }
  } catch (err) {
    console.error("❌ Auth0 init error:", err);
  }
}

async function loadUserProfile() {
  const token = localStorage.getItem("patreon_token");
  if (!token) return;

  try {
    const res = await fetch("https://www.patreon.com/api/oauth2/v2/identity?fields[user]=image_url,full_name", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    const loginArea = document.getElementById("login-area");
    const { full_name, image_url } = data.data.attributes;

    loginArea.innerHTML = `
      <div class="profile-wrapper">
        <img src="${image_url}" alt="${full_name}" class="profile-pic" title="${full_name}" />
        <div class="logout-menu" onclick="logout()">Log out</div>
      </div>`;
  } catch (err) {
    console.error("🚨 Failed to load Patreon profile:", err);
    localStorage.removeItem("patreon_token");
  }
}

function logout() {
  localStorage.removeItem("patreon_token");
  auth0.logout({ returnTo: window.location.origin });
}

document.addEventListener("DOMContentLoaded", initAuth);
