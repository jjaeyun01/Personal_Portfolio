import { useState } from 'react';
import img1 from '../assets/images/img1.png';

function AboutAndSkills() {
    const [activeTab, setActiveTab] = useState('about');

    const skills = [
        { category: "Front-End", technologies: "React, HTML, CSS, JavaScript" },
        { category: "Back-End", technologies: "Java, Python, Node.js" },
        { category: "Database", technologies: "MySQL, DBeaver" },
        { category: "Data Science", technologies: "R, Python (Pandas, NumPy, Matplotlib)" }
    ];

    return (
        <section id="about-skills" className="about-skills">
            <div className="top-section">
                <div className="emoji-section">
                    <img src={img1} alt="About" />
                </div>

                <div className="info-section">
                    <div className="button-group">
                        <button
                            className={activeTab === 'about' ? 'active' : ''}
                            onClick={() => setActiveTab('about')}
                        >
                            About
                        </button>
                        <button
                            className={activeTab === 'education' ? 'active' : ''}
                            onClick={() => setActiveTab('education')}
                        >
                            Education
                        </button>
                        <button
                            className={activeTab === 'experience' ? 'active' : ''}
                            onClick={() => setActiveTab('experience')}
                        >
                            Experience
                        </button>
                    </div>

                    <div className="content">
                        {activeTab === 'about' && (
                            <div className="content-box">
                                <h3>👻 About Me</h3>
                                <p>
                                    <strong>Hello! I'm from South Korea 🇰🇷</strong>
                                    <br />
                                    I like to play Soccer⚽️
                                    <br />
                                    My favorite movie is "Iron Man"
                                </p>
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <div className="content-box">
                                <h3>🎓 Education</h3>
                                <p>
                                    <strong>University of Wisconsin-Madison</strong>
                                    <br />
                                    B.S. Computer Science & Data Science
                                    <br />
                                    2023 - 2027
                                </p>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div className="content-box">
                                <h3>💼 Experience</h3>
                                <p>
                                    <strong>Sinor Korea</strong> | Seoul
                                    <br />
                                    Data Engineer Intern
                                    <br />
                                    May 2025 – June 2025
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Skills Section 아래 붙이기 */}
            <div className="skills-section">
                <h2>⚙️ Technical Skills</h2>
                <div className="skills-container">
                    {skills.map((skill, index) => (
                        <div key={index} className="skill-card">
                            <h3>{skill.category}</h3>
                            <p>{skill.technologies}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AboutAndSkills;
