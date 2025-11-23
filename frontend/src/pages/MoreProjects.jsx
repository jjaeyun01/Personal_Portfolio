import useFetchGithub from "../hooks/useFetchGithub";
import { useNavigate } from "react-router-dom";

function MoreProjects() {
  const { repos, loading } = useFetchGithub();
  const navigate = useNavigate();

  if (loading) return <p className="loading">Loading GitHub Projects...</p>;

  return (
    <section className="more-projects">

      {/* 🔙 Back Button */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>

      <h2 className="title">📁 More Projects</h2>

      <div className="project-grid">
        {repos.map((repo) => (
          <div key={repo.name} className="project-card">

            <h3 className="project-title">{repo.name}</h3>
            <p className="project-desc">
              {repo.description || "No description available."}
            </p>

            {/* 🔹 Tech Stack */}
            <div className="lang-list">
              {repo.languages.map((lang) => (
                <span key={lang} className="badge">{lang}</span>
              ))}
            </div>

            {/* 🔗 Links */}
            <div className="links">
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>

              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MoreProjects;
