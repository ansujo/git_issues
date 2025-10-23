// src/components/ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check login status by calling a simple protected endpoint
    async function checkAuth() {
      try {
        await axios.get("http://localhost:8000/api/projects/", { withCredentials: true });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // show nothing until we know login state
  if (isAuthenticated === null) return <p>Loading...</p>;

  // if not logged in, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // otherwise render the protected content
  return children;
}
