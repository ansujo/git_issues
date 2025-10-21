// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import IssueList from "./components/IssueList";
import IssueDetail from "./components/IssueDetail";
import NewIssue from "./components/NewIssue"; 
import ProjectDetail from "./components/ProjectDetail";
import PullReqList from "./components/PullReqList";
import PullReqForm from "./components/PullReqForm";
import PullReqDetail from "./components/PullReqDetail";
// import PullReqForm isEdit from "./components/PullReqForm isEdit";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:projectId/pdetails" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/issues" element={<IssueList />} />
          <Route path="/projects/:projectId/pullreqs" element={<PullReqList />} />
          <Route path="/issues/:id" element={<IssueDetail />} /> 
          <Route path="/projects/:projectId/issues/new" element={<NewIssue />} /> 
          <Route path="/projects/:projectId/pullreqs" element={<PullReqList />} />
          <Route path="/projects/:projectId/pullreqs/new" element={<PullReqForm />} />
          <Route path="/pullreqs/:pullId" element={<PullReqDetail />} />
          <Route path="/pullreqs/:pullId/edit" element={<PullReqForm isEdit />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

