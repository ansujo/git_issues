import { PermissionProvider } from "./context/PermissionContext";
import React, { useEffect , useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import IssueList from "./components/IssueList";
import IssueDetail from "./components/IssueDetail";
import NewIssue from "./components/NewIssue"; 
import ProjectDetail from "./components/ProjectDetail";
import PullReqList from "./components/PullReqList";
import PullReqForm from "./components/PullReqForm";
import PullReqDetail from "./components/PullReqDetail";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { initCSRF ,setGlobalErrorHandler} from "./api"; // to initialize CSRF token once
import Errorpop from "./components/Errorpop";
import AdminNavbar from "./components/AdminNavbar"; 
import AdminHome from "./components/AdminHome";
import RoleFormPage from "./components/RoleFormPage";
import RoleList from "./components/RoleList";
import UserRoleAssign from "./components/UserRoleAssign";


function LayoutWithNavbar() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);//hide navbar
  const isAdminRoute = location.pathname.startsWith("/admin"); // ✅ check admin pages


  return (
    
    <>
    {!hideNavbar && <Navbar />}
    {/* Show admin navbar when on admin routes */}
    {!hideNavbar && isAdminRoute && <AdminNavbar />} 

      <Routes> 
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/roles/new" element={<RoleFormPage />} />
        <Route path="/admin/roles/:id" element={<RoleFormPage />} />
        <Route path="admin/roles" element={<RoleList />} />
        <Route path="admin/assign-role" element={<UserRoleAssign />} />


        {/* ✅ Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireSuperuser>
              <AdminHome />
            </ProtectedRoute>
          }
        />

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

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initCSRF();
    setGlobalErrorHandler(setErrorMessage);
  }, []);

  return (
    <Router>
      <PermissionProvider>
      <LayoutWithNavbar />
      <Errorpop
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
      </PermissionProvider>
    </Router>
  );
}

export default App;



