// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // important for CSRF/session cookies
});

let showGlobalError = null;

export function setGlobalErrorHandler(callback) {
  showGlobalError = callback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const backendMessage =
        // error.response.data?.detail ||
        // error.response.data?.message ||
        error.response.data?.error ||
        null;

      if (error.response.status === 403) {
        showGlobalError?.(backendMessage||"Access Denied: You don't have permission to do this activity");
      } else if (error.response.status === 401) {
        showGlobalError?.("You are not logged in or your session expired.");
      }
    }
    return Promise.reject(error);
  }
);


export const initCSRF = async () => {
  try {
    await api.get("/csrf/");
  } catch (error) {
    console.error("CSRF init failed:", error);
  }
};

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export const login = async (username, password) => {
  try {
    const csrfToken=getCookie("csrftoken")
    const response = await api.post("/login/", { username, password },{
      headers: {
        "X-CSRFToken": csrfToken, // include CSRF token
      },
    });
    api.get("/auth/my-permissions/");
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

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

export const register = async (username, email, password) => {
  try {
    const csrfToken = getCookie("csrftoken");
    const response = await api.post("/register/", {
      username,
      email,
      password,
    },
      {headers: {
          "X-CSRFToken": csrfToken
        }});
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

export default api