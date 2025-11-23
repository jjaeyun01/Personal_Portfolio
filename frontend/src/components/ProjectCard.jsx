function ProjectCard({ title, description, languages, githubLink, demoLink }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>

      {languages && (
        <p className="languages">🔥 {languages.join(", ")}</p>
      )}

      <p>{description}</p>

      <div className="project-links">
        <a href={githubLink} target="_blank">GitHub</a>
        {demoLink && <a href={demoLink} target="_blank">Live Demo</a>}
      </div>
    </div>
  );
}

export default ProjectCard;
