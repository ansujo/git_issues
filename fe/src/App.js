// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import IssueList from "./components/IssueList";
import IssueDetail from "./components/IssueDetail";
import NewIssue from "./components/NewIssue"; 
import ProjectDetail from "./components/ProjectDetail";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:projectId/pdetails" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/issues" element={<IssueList />} />
          <Route path="/issues/:id" element={<IssueDetail />} /> 
          <Route path="/projects/:projectId/issues/new" element={<NewIssue />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

