// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // important for CSRF/session cookies
});



// --- Named helper functions ---

// Initialize CSRF token (if your Django backend uses CSRF protection)
export const initCSRF = async () => {
  try {
    await api.get("/csrf/");
  } catch (error) {
    console.error("CSRF init failed:", error);
  }
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}


// Login user
export const login = async (username, password) => {
  try {
    const response = await api.post("/login/", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    const csrfToken = getCookie("csrftoken");
    await api.post("/logout/", {}, {
      headers: {
        "X-CSRFToken": csrfToken
      }
    });
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};


// Register new user
export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register/", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

export default api