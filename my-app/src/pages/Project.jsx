import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

function Project() {
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

  return (
    <section id="projects" className="projects">
      <h2>💻 Projects</h2>

      <h3 className="project-category">👥 Team Projects</h3>
      <div className="project-container">
        {teamProjects.map((project, index) => (
          <ProjectCard key={index} title={project.title} description={project.description} />
        ))}
      </div>

      <h3 className="project-category">🧠 Personal Projects</h3>
      <div className="project-container">
        {personalProjects.map((project, index) => (
          <ProjectCard key={index} title={project.title} description={project.description} />
        ))}
      </div>

      {/* More Projects 버튼 */}
      <p>
        <Link to="/projects" className="more-btn">
          More Projects →
        </Link>
      </p>
    </section>
  );
}

export default Project;
