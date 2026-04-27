import { Link } from 'react-router-dom';
import CompileReveal from '../components/CompileReveal';

const PROJECT_CODE = [
  { h: '<span class="ps1">$</span> ls -la ~/projects' },
  { h: '' },
  { h: '<span class="syn-cmt">// team projects</span>' },
  { h: '  <span class="syn-fn">📁</span> team-project-1/    <span class="syn-str">"XXX"</span>' },
  { h: '  <span class="syn-fn">📁</span> team-project-2/    <span class="syn-str">"XXX"</span>' },
  { h: '  <span class="syn-fn">📁</span> team-project-3/    <span class="syn-str">"XXX"</span>' },
  { h: '' },
  { h: '<span class="syn-cmt">// personal projects</span>' },
  { h: '  <span class="syn-fn">📁</span> web-portfolio/     <span class="syn-str">"Personal portfolio with React &amp; Node.js"</span>' },
  { h: '  <span class="syn-fn">📁</span> personal-project-2/ <span class="syn-str">"XXX"</span>' },
  { h: '  <span class="syn-fn">📁</span> personal-project-3/ <span class="syn-str">"XXX"</span>' },
];

const teamProjects = [
  { title: 'Team Project 1', desc: 'XXX', langs: [] },
  { title: 'Team Project 2', desc: 'XXX', langs: [] },
  { title: 'Team Project 3', desc: 'XXX', langs: [] },
];
const personalProjects = [
  { title: 'Web Portfolio',       desc: 'Personal web portfolio built with React, Node.js, and Three.js.', langs: ['React', 'Node.js', 'CSS'] },
  { title: 'Personal Project 2', desc: 'XXX', langs: [] },
  { title: 'Personal Project 3', desc: 'XXX', langs: [] },
];

function Card({ title, desc, langs }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p className="project-desc">{desc}</p>
      {langs.length > 0 && (
        <div className="lang-list">
          {langs.map(l => <span key={l} className="badge">{l}</span>)}
        </div>
      )}
    </div>
  );
}

const PROJECTS_TEXT = (
  <div>
    <p className="project-category">Team Projects</p>
    <div className="projects-grid">
      {teamProjects.map(p => <Card key={p.title} {...p} />)}
    </div>
    <p className="project-category" style={{ marginTop: 36 }}>Personal Projects</p>
    <div className="projects-grid">
      {personalProjects.map(p => <Card key={p.title} {...p} />)}
    </div>
    <Link to="/projects" className="more-btn">
      <span className="ps1">$</span> git log --all<span style={{ color: 'var(--accent)' }}> →</span>
    </Link>
  </div>
);

function Project() {
  return (
    <section id="projects" className="projects">
      <CompileReveal
        codeLines={PROJECT_CODE}
        textView={PROJECTS_TEXT}
        lineDelay={50}
      />
    </section>
  );
}

export default Project;
