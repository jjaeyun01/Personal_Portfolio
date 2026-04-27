import { useState, useEffect } from 'react';

const TABS = [
  { id: 'home',         label: 'home.jsx' },
  { id: 'about-skills', label: 'about.jsx' },
  { id: 'projects',     label: 'projects.jsx' },
  { id: 'contact',      label: 'contact.jsx' },
];

const GH_ICON = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
      -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
      .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
      -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
      .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
      .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
      0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const LI_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037
      -1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046
      c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286
      zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065
      zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729
      v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729
      C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function Navbar() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 100;
      for (const { id } of TABS) {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav>
      <div className="nav-left">
        <div className="nav-dot-group">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
        </div>
        <span className="nav-host">
          <span className="syn-cmt">jaeyoon</span>
          <span className="syn-muted">@</span>
          <span className="syn-fn">portfolio</span>
          <span className="syn-muted">:~$</span>
        </span>
        <span className="nav-branch">
          <span style={{ color: 'var(--green)' }}>⎇</span>
          {' '}main
        </span>
      </div>

      <ul className="nav-tabs">
        {TABS.map(({ id, label }) => (
          <li key={id} className={`nav-tab${active === id ? ' active' : ''}`}>
            <a href={`#${id}`} onClick={(e) => scrollTo(e, id)}>
              <span className="nav-tab-dot" />
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <a
          className="nav-social"
          href="https://github.com/jjaeyun01"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          {GH_ICON}
        </a>
        <a
          className="nav-social"
          href="https://www.linkedin.com/in/jaeyoon-lee-8a73a72b6/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          {LI_ICON}
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
