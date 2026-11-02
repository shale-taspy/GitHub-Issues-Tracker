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
const tabButtons = document.querySelectorAll(".tab-btn");
const issueCount = document.getElementById("issueCount");
const loadingSpinner = document.getElementById("loadingSpinner");
const issuesGrid = document.getElementById("issuesGrid");
const noIssues = document.getElementById("noIssues");
const issueModal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");

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

function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn && window.location.pathname.includes("index.html")) {
    window.location.href = "./login.html";
  }
}

//Fetching from API
async function fetchIssues() {
  showLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}`);
    const data = await response.json();
    allIssues = Array.isArray(data) ? data : data.data || data.issues || [];
    displayIssues(filterIssues());
  } catch (error) {
    console.error("Error fetching issues:", error);
  } finally {
    showLoading(false);
  }
}

async function fetchSingleIssue(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();
    if (data) return data.data || data;
  } catch (error) {
    console.error("Error fetching single issue:", error);
  }
  return null;
}

//new issue

async function createIssue(issueData) {
  showLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });

    if (response.ok) {
      await fetchIssues();
      return true;
    } else {
      const newIssue = {
        id: Date.now().toString(),
        ...issueData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      allIssues.unshift(newIssue);
      displayIssues(filterIssues());
      return true;
    }
  } catch (error) {
    console.error("Error creating issue:", error);
    const newIssue = {
      id: Date.now().toString(),
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allIssues.unshift(newIssue);
    displayIssues(filterIssues());
    return true;
  } finally {
    showLoading(false);
  }
}
//search

async function searchIssues(query) {
  showLoading(true);
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    const results = Array.isArray(data) ? data : data.data || data.issues || [];

    if (results.length > 0) {
      displayIssues(results);
    } else {
      const matched = allIssues.filter(
        (issue) =>
          (issue.title &&
            issue.title.toLowerCase().includes(query.toLowerCase())) ||
          (issue.description &&
            issue.description.toLowerCase().includes(query.toLowerCase())),
      );
      displayIssues(matched);
    }
  } catch (error) {
    console.error("Search error, filtering locally:", error);
    const matched = allIssues.filter(
      (issue) =>
        (issue.title &&
          issue.title.toLowerCase().includes(query.toLowerCase())) ||
        (issue.description &&
          issue.description.toLowerCase().includes(query.toLowerCase())),
    );
    displayIssues(matched);
  } finally {
    showLoading(false);
  }
}



