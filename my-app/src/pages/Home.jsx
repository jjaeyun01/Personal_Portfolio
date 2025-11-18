import { useState, useEffect } from 'react';
import profileImg from '../assets/images/Profile1.jpeg';

// ★ 핵심 수정: greetings 배열을 컴포넌트 밖으로 뺐습니다.
// 이제 리액트는 이것을 변하지 않는 고정값으로 인식하여 경고를 띄우지 않습니다.
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
  }, []); // 빈 배열 []만 있어도 경고가 뜨지 않습니다.

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