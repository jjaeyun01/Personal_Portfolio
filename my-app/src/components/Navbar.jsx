import { useState, useEffect } from 'react';
import logo from '../assets/images/W_logo.png';

function Navbar() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <a href="#home">JAEYOON LEE</a>
      </div>
      <div className="nav-links">
        <a
          href="#home"
          className={activeSection === 'home' ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleClick('home');
          }}
        >
          Home
        </a>
        <a
          href="#about"
          className={activeSection === 'about' ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleClick('about');
          }}
        >
          About
        </a>
        <a
          href="#projects"
          className={activeSection === 'projects' ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleClick('projects');
          }}
        >
          Projects
        </a>
        <a
          href="#skills"
          className={activeSection === 'skills' ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleClick('skills');
          }}
        >
          Skills
        </a>
        <a
          href="#contact"
          className={activeSection === 'contact' ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleClick('contact');
          }}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}

export default Navbar;