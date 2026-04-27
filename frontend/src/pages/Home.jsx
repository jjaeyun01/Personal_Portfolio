import { useState, useEffect } from 'react';
import profileImg from '../assets/images/Profile1.jpeg';

const greetings = ["Hello 🙋", "안녕하세요 👋"];

function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
        setOpacity(1);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="home">
      <div className="home-origin-tag">
        <span />
        Seoul, South Korea → Madison, Wisconsin
      </div>

      <div className="intro">
        <h1>
          <span style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}>
            {greetings[greetingIndex]}
          </span>
        </h1>
        <h2>
          I'm <span className="highlight">Jaeyoon Lee</span>
          <br />
          Software Programmer
        </h2>
        <p>
          B.S. in Computer Science &amp; Data Science at the University of Wisconsin–Madison (2023–2027)
          <br />
          Grew up in South Korea 🇰🇷, now building my career in the U.S.
        </p>
      </div>

      <img className="profile-img" src={profileImg} alt="Jaeyoon Lee" />

      <div className="home-cta">
        <a href="#contact" className="btn-primary">Get in Touch</a>
        <a href="#about-skills" className="btn-secondary">About Me</a>
      </div>
    </section>
  );
}

export default Home;
