async function waitForAuth0Init(timeout = 3000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (auth0 || Date.now() - start > timeout) return resolve();
      requestAnimationFrame(check);
    };
    check();
  });
}

async function gateProtectedPage() {
  await waitForAuth0Init();

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
  const popup = document.getElementById("login-popup");

  if (gatedPages.includes(currentPage) && !token && popup) {
    popup.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", gateProtectedPage);
