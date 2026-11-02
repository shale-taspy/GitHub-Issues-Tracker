// Basic info
const API_BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const DEMO_CREDENTIALS = { username: "admin", password: "admin123" };
let currentTab = "all";
let allIssues = [];

//Dom
const loginForm = document.getElementById("loginForm");
const searchInput = document.getElementById("searchInput");
const newIssueBtn = document.getElementById("newIssueBtn");
const logoutBtn = document.getElementById("logoutBtn");

//Login function
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (
      username === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "./index.html";
    } else {
      errorMessage.textContent = "Invalid credentials. Use admin/admin123";
      errorMessage.classList.remove("hidden");
    }
  });
}

//Logout function
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "./login.html";
  });
}

