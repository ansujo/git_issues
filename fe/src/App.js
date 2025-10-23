// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// your existing components
import ProjectList from "./components/ProjectList";
import IssueList from "./components/IssueList";
import IssueDetail from "./components/IssueDetail";
import NewIssue from "./components/NewIssue"; 
import ProjectDetail from "./components/ProjectDetail";
import PullReqList from "./components/PullReqList";
import PullReqForm from "./components/PullReqForm";
import PullReqDetail from "./components/PullReqDetail";

// newly added
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { initCSRF } from "./api"; // to initialize CSRF token once

// helper layout for conditional navbar rendering
function LayoutWithNavbar() {
  const location = useLocation();

  // hide navbar on login & register pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/pdetails"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/issues"
          element={
            <ProtectedRoute>
              <IssueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/issues/:issueId"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/issues/new"
          element={
            <ProtectedRoute>
              <NewIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/pullreqs"
          element={
            <ProtectedRoute>
              <PullReqList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/pullreqs/new"
          element={
            <ProtectedRoute>
              <PullReqForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pullreqs/:pullId"
          element={
            <ProtectedRoute>
              <PullReqDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pullreqs/:pullId/edit"
          element={
            <ProtectedRoute>
              <PullReqForm isEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  // initialize CSRF token on app load
  useEffect(() => {
    initCSRF();
  }, []);

  return (
    <Router>
      <LayoutWithNavbar />
    </Router>
  );
}

export default App;
