import axios from "axios";



// ---- Initialize CSRF token (optional, can call once at startup) ----
export const initCSRF = async () => {
  try {
    await api.get("/get-csrf-token/"); // or your endpoint: /csrf/
  } catch (error) {
    console.error("CSRF init failed:", error);
  }
};

// ---- Helper: Get CSRF token from cookie ----
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ---- Create axios instance ----
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // change to http://127.0.0.1:8000/api if not using proxy
  withCredentials: true, // important for CSRF + session cookies
});

// ---- Global interceptor to automatically attach CSRF token ----
api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");

  // Only attach CSRF for write operations
  if (["post", "put", "patch", "delete"].includes(config.method) && csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

// ---- Auth-related API functions ----

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
    await api.post("/logout/");
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

export default api;
