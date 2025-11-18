import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

function MoreProjects() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const teamProjects = [
    { title: "Team Project 1", description: "XXX" },
    { title: "Team Project 2", description: "XXX" },
    { title: "Team Project 3", description: "XXX" }
  ];

  const personalProjects = [
    {
      title: "Web Portfolio",
      description: "Personal web portfolio built with HTML, CSS, JS, and React."
    },
    { title: "Personal Project 2", description: "XXX" },
    { title: "Personal Project 3", description: "XXX" }
  ];

  const filteredProjects =
    filter === "team"
      ? teamProjects
      : filter === "personal"
      ? personalProjects
      : [...teamProjects, ...personalProjects];

  return (
    <section className="more-projects">

      <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>

      <h2>📁 More Projects</h2>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>

        <button
          onClick={() => setFilter("team")}
          className={filter === "team" ? "active" : ""}
        >
          Team
        </button>

        <button
          onClick={() => setFilter("personal")}
          className={filter === "personal" ? "active" : ""}
        >
          Personal
        </button>
      </div>

      <div className="project-container">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
      
    </section>
  );
}

export default MoreProjects;
