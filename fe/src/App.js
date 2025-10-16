import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import IssueList from "./components/IssueList";
import IssueDetail from "./components/IssueDetail";
import IssueForm from "./components/IssueForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:slug/issues" element={<IssueList />} />
          <Route path="/projects/:slug/issues/new" element={<IssueForm />} />
          <Route path="/projects/:slug/issues/:pk" element={<IssueDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
