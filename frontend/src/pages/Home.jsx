import { useState, useEffect } from 'react';
import profileImg from '../assets/images/Profile1.jpeg';

const GREETINGS = ['Hello 🙋', '안녕하세요 👋'];

const LINES = [
  { delay: 400  },
  { delay: 950  },
  { delay: 1500 },
  { delay: 1700 },
  { delay: 2200 },
  { delay: 2600 },
  { delay: 3000 },
  { delay: 3200 },
  { delay: 3700 },
  { delay: 4200 },
];

function Home() {
  const [phase, setPhase]               = useState(0);
  const [greetIdx, setGreetIdx]         = useState(0);
  const [greetOpacity, setGreetOpacity] = useState(1);

  useEffect(() => {
    const timers = LINES.map((l, i) => setTimeout(() => setPhase(i + 1), l.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setGreetOpacity(0);
      setTimeout(() => {
        setGreetIdx(i => (i + 1) % GREETINGS.length);
        setGreetOpacity(1);
      }, 400);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="home" className="home">
      {/* Journey origin tag — globe on the right tells the full story */}
      <div className="home-origin-tag">
        <span />
        Seoul, South Korea → Madison, Wisconsin
      </div>

      <div className="home-terminal term-win">
        <div className="term-bar">
          <div className="term-dots">
            <span className="term-dot r" />
            <span className="term-dot y" />
            <span className="term-dot g" />
          </div>
          <span className="term-title">~/portfolio — bash</span>
        </div>

        <div className="term-body">
          {phase >= 1 && (
            <div className="prompt-line line-in">
              <span className="ps1">$</span>
              <span className="cmd"> whoami</span>
            </div>
          )}

          {phase >= 2 && (
            <div className="out-name-line line-in" style={{ paddingLeft: '14px' }}>
              <span style={{ opacity: greetOpacity, transition: 'opacity 0.4s', color: 'var(--muted)' }}>
                {GREETINGS[greetIdx]}
              </span>
              {'  '}
              <span className="syn-fn">Jaeyoon Lee</span>
              {'  '}
              <span className="syn-cmt">// Software Programmer</span>
            </div>
          )}

          {phase >= 3 && <div style={{ height: '8px' }} />}

          {phase >= 4 && (
            <div className="prompt-line line-in">
              <span className="ps1">$</span>
              <span className="cmd"> cat ./info.txt</span>
            </div>
          )}

          {phase >= 5 && (
            <div className="out line-in" style={{ paddingLeft: '14px' }}>
              <span className="syn-str">"</span>
              <span>B.S. Computer Science &amp; Data Science</span>
              <span className="syn-str">"</span>
            </div>
          )}

          {phase >= 6 && (
            <div className="out line-in" style={{ paddingLeft: '14px' }}>
              <span className="syn-str">"</span>
              <span>University of Wisconsin–Madison</span>
              <span className="syn-str">"</span>
              {'  '}
              <span className="syn-num">2023 – 2027</span>
            </div>
          )}

          {phase >= 7 && <div style={{ height: '8px' }} />}

          {phase >= 8 && (
            <div className="prompt-line line-in">
              <span className="ps1">$</span>
              <span className="cmd"> git status</span>
            </div>
          )}

          {phase >= 9 && (
            <div className="out line-in" style={{ paddingLeft: '14px', color: 'var(--green)' }}>
              🟢 &nbsp;Open to new opportunities
            </div>
          )}

          {phase >= 10 && <div style={{ height: '8px' }} />}

          <div className="prompt-line">
            <span className="ps1">$</span>
            {phase >= LINES.length && <span className="cursor" />}
          </div>
        </div>
      </div>

      <img className="profile-img" src={profileImg} alt="Profile" />
    </section>
  );
}

export default Home;
