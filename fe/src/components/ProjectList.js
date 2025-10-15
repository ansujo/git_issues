// src/components/ProjectList.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects/").then((res) => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((project) => (
        <div key={project.id}>
          <Link to={`/projects/${project.id}/issues`}>{project.name}</Link>
        </div>
      ))}
    </div>
  );
}
