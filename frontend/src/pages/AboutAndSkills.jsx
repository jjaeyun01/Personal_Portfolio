import { useState } from 'react';
import img1 from '../assets/images/img1.png';
import CompileReveal from '../components/CompileReveal';

const TABS = [
  { id: 'about',      label: 'me.js' },
  { id: 'education',  label: 'education.js' },
  { id: 'experience', label: 'experience.js' },
];

// Code phase (syntax-highlighted lines)
const CODE = {
  about: [
    { h: '<span class="syn-cmt">// me.js</span>' },
    { h: '' },
    { h: '<span class="syn-kw">const</span> <span class="syn-var">developer</span> = {' },
    { h: '  <span class="syn-prop">name</span>     : <span class="syn-str">"Jaeyoon Lee"</span>,' },
    { h: '  <span class="syn-prop">origin</span>   : <span class="syn-str">"Seoul, South Korea 🇰🇷"</span>,' },
    { h: '  <span class="syn-prop">sports</span>   : [<span class="syn-str">"Soccer ⚽️"</span>],' },
    { h: '  <span class="syn-prop">favMovie</span> : <span class="syn-str">"Iron Man"</span>,' },
    { h: '};' },
  ],
  education: [
    { h: '<span class="syn-cmt">// education.js</span>' },
    { h: '' },
    { h: '<span class="syn-kw">const</span> <span class="syn-var">education</span> = {' },
    { h: '  <span class="syn-prop">school</span> : <span class="syn-str">"University of Wisconsin–Madison"</span>,' },
    { h: '  <span class="syn-prop">degree</span> : <span class="syn-str">"B.S. CS &amp; Data Science"</span>,' },
    { h: '  <span class="syn-prop">years</span>  : <span class="syn-str">"2023 – 2027"</span>,' },
    { h: '};' },
  ],
  experience: [
    { h: '<span class="syn-cmt">// experience.js</span>' },
    { h: '' },
    { h: '<span class="syn-kw">const</span> <span class="syn-var">experience</span> = [{' },
    { h: '  <span class="syn-prop">company</span> : <span class="syn-str">"Sinor Korea"</span>,' },
    { h: '  <span class="syn-prop">city</span>    : <span class="syn-str">"Seoul"</span>,' },
    { h: '  <span class="syn-prop">role</span>    : <span class="syn-str">"Data Engineer Intern"</span>,' },
    { h: '  <span class="syn-prop">period</span>  : <span class="syn-str">"May 2025 – June 2025"</span>,' },
    { h: '}];' },
  ],
};

// Text phase (clean readable content)
const TEXT = {
  about: (
    <div className="info-card">
      <div className="info-name">Jaeyoon Lee</div>
      <div className="info-list">
        <span>🇰🇷&nbsp; Seoul, South Korea</span>
        <span>⚽️&nbsp; Soccer</span>
        <span>🎬&nbsp; Iron Man</span>
      </div>
    </div>
  ),
  education: (
    <div className="info-card">
      <div className="info-name">University of Wisconsin–Madison</div>
      <div className="info-list">
        <span>B.S. Computer Science &amp; Data Science</span>
        <span>2023 – 2027</span>
      </div>
    </div>
  ),
  experience: (
    <div className="info-card">
      <div className="info-name">Sinor Korea · Seoul</div>
      <div className="info-list">
        <span>Data Engineer Intern</span>
        <span>May 2025 – June 2025</span>
      </div>
    </div>
  ),
};

// Skills — code phase
const SKILLS_CODE = [
  { h: '<span class="syn-cmt">// skills.json</span>' },
  { h: '' },
  { h: '{' },
  { h: '  <span class="syn-prop">"frontend"</span>:     [<span class="syn-str">"React"</span>, <span class="syn-str">"JavaScript"</span>, <span class="syn-str">"HTML"</span>, <span class="syn-str">"CSS"</span>],' },
  { h: '  <span class="syn-prop">"backend"</span>:      [<span class="syn-str">"Java"</span>, <span class="syn-str">"Python"</span>, <span class="syn-str">"Node.js"</span>],' },
  { h: '  <span class="syn-prop">"database"</span>:     [<span class="syn-str">"MySQL"</span>, <span class="syn-str">"DBeaver"</span>],' },
  { h: '  <span class="syn-prop">"data-science"</span>: [<span class="syn-str">"R"</span>, <span class="syn-str">"Pandas"</span>, <span class="syn-str">"NumPy"</span>, <span class="syn-str">"Matplotlib"</span>]' },
  { h: '}' },
];

const SKILL_GROUPS = [
  { label: 'Frontend',     tags: ['React', 'JavaScript', 'HTML', 'CSS'] },
  { label: 'Backend',      tags: ['Java', 'Python', 'Node.js'] },
  { label: 'Database',     tags: ['MySQL', 'DBeaver'] },
  { label: 'Data Science', tags: ['R', 'Pandas', 'NumPy', 'Matplotlib'] },
];

const SKILLS_TEXT = (
  <div className="skills-compiled">
    {SKILL_GROUPS.map(({ label, tags }) => (
      <div key={label} className="skill-row">
        <span className="skill-row-label">{label}</span>
        <div className="skill-tags">
          {tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
        </div>
      </div>
    ))}
  </div>
);

function AboutAndSkills() {
  const [activeTab, setActiveTab]     = useState('about');
  const [compiledTabs, setCompiledTabs] = useState(new Set());

  const markCompiled = (id) => setCompiledTabs(prev => new Set([...prev, id]));

  return (
    <section id="about-skills" className="about-skills">
      <div className="about-top">
        <div className="about-left">
          <img className="about-img" src={img1} alt="About" />
        </div>

        <div className="about-right">
          <div className="file-tabs">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                className={`file-tab${activeTab === id ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="about-code-win">
            {compiledTabs.has(activeTab) ? (
              <div className="compiled-view" style={{ padding: '16px 0' }}>
                {TEXT[activeTab]}
              </div>
            ) : (
              <CompileReveal
                key={activeTab}
                codeLines={CODE[activeTab]}
                textView={TEXT[activeTab]}
                onCompile={() => markCompiled(activeTab)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="skills-section">
        <p className="skills-label">
          <span className="syn-cmt">{'// '}</span>technical skills
        </p>
        <CompileReveal
          codeLines={SKILLS_CODE}
          textView={SKILLS_TEXT}
          lineDelay={50}
        />
      </div>
    </section>
  );
}

export default AboutAndSkills;
