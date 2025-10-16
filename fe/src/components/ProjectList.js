import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/projects/")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;
if (error) return <p>{error}</p>;

// ✅ Log the full projects array once to check if slugs exist
console.log(projects);

return (
  <div>
    <h2>Projects</h2>
    <ul>
      {projects.map((project) => {
        // ✅ Log each project inside the map to check individual slugs
        console.log(project);

        return (
          <li key={project.id} style={{ marginBottom: "10px" }}>
            <Link to={`/projects/${project.slug}/issues`}>
              {project.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

}
