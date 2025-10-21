// src/components/ProjectList.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Styles
const styles = {
  container: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    minHeight: '100vh',
    padding: '20px',
  },
  projectItemBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    margin: '10px 0',
    border: '2px solid #90EE90',
    borderRadius: '5px',
    backgroundColor: '#2D2D2D',
  },
  projectText: {
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
  button: {
    backgroundColor: '#90EE90',
    color: '#1E1E1E',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};
export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/projects/").then((res) => setProjects(res.data));
  }, []);

  const handleOpen = (projectId) => {
    navigate(`/projects/${projectId}/pdetails`);
  };

  return (
    <div style={styles.container}>
      <h2>Projects</h2>
      {projects.map((project) => (
        <div key={project.id} style={styles.projectItemBox}>
          <span style={styles.projectText}>{project.name}</span>
          <button 
            onClick={() => handleOpen(project.id)}
            style={styles.button}
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}

















