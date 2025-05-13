document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("patreon_token");
  if (!token) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.8)";
    overlay.style.color = "#fff";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.innerHTML = `
      <div style="text-align: center;">
        <h2>🔒 Members Only</h2>
        <p>You must be logged in to use this tool.</p>
        <p>Redirecting you to home...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 3000);
  }
});
