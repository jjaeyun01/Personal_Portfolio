import useFetchGithub from '../hooks/useFetchGithub';
import { useNavigate } from 'react-router-dom';

function MoreProjects() {
  const { repos, loading } = useFetchGithub();
  const navigate = useNavigate();

  return (
    <section className="more-projects">
      <div className="more-header">
        <div className="prompt-line" style={{ marginBottom: '8px' }}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="syn-cmt">←</span> cd ..
          </button>
        </div>
        <div className="prompt-line" style={{ marginBottom: '6px' }}>
          <span className="ps1">$</span>
          <span className="cmd"> git log --oneline --all</span>
        </div>
        <p className="syn-cmt" style={{ fontSize: '0.75rem', paddingLeft: '16px' }}>
          {loading ? '// fetching repositories...' : `// ${repos.length} repositories found`}
        </p>
      </div>

      {loading ? (
        <div className="term-win" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <span className="ps1">$</span>
          <span className="cmd"> git fetch --all</span>
          <span className="cursor" style={{ marginLeft: 8 }} />
        </div>
      ) : (
        <div className="project-grid">
          {repos.map((repo) => (
            <div key={repo.name} className="project-card">
              <h3 className="project-title">
                <span className="syn-fn">📁 </span>{repo.name}
              </h3>
              <p className="project-desc">
                <span className="syn-cmt">// </span>
                {repo.description || 'No description available.'}
              </p>
              <div className="lang-list">
                {repo.languages.map((lang) => (
                  <span key={lang} className="badge">{lang}</span>
                ))}
              </div>
              <div className="links">
                <a href={repo.url} target="_blank" rel="noopener noreferrer">GitHub →</a>
                {repo.homepage && (
                  <a href={repo.homepage} target="_blank" rel="noopener noreferrer">Live Demo →</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MoreProjects;
