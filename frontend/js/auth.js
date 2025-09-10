// Base API URL
const API_BASE = "http://localhost:3000";

// Get logged in user info
async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include" // if using cookies
  });
  if (!res.ok) {
    window.location.href = "/login.html"; // Redirect if not logged in
    return;
  }
  const user = await res.json();
  return user;
}

// Protect pages by role
async function protectPage(requiredRole) {
  const user = await getCurrentUser();
  if (!user) return;

  // Store globally
  window.currentUser = user;

  // Role check
  if (requiredRole && user.role !== requiredRole) {
    alert("You do not have access to this page.");
    window.location.href = "/";
  }
}
