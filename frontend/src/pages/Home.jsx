import { useState, useEffect } from 'react';
import profileImg from '../assets/images/Profile1.jpeg';

const greetings = ["Hello🙋", "안녕하세요👋"];

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
      <div className="intro">
        <h1>
          <span id="greeting" style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}>
            {greetings[greetingIndex]}
          </span>
        </h1>
        <h2>
          I'm <span className="highlight">Jaeyoon Lee</span>
          <br />
          Software Programmer
        </h2>
        <p>B.S. in Computer Science & Data Science at the University of Wisconsin–Madison (2023–2027)</p>
      </div>
      <img className="profile-img" src={profileImg} alt="Profile" />
    </section>
  );
}

export default Home;