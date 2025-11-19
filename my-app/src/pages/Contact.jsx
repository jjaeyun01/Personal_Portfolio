import { useState } from 'react';
import emailjs from 'emailjs-com';
import Earth from '../components/Earth';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS 보내기
    emailjs.send(
      'service_uxf3q4b',    // EmailJS에서 발급받은 Service ID
      'template_dm1u7za',   // EmailJS에서 만든 Template ID
      formData,
      '1f6kD_TMkjo3ffOIb'     // EmailJS에서 발급받은 Public Key
    )
    .then(() => {
      alert('✈️ Message sent successfully!');
      setFormData({ name: '', email: '', company: '', message: '' });
    })
    .catch((err) => {
      console.error('Send failed:', err);
      alert('❌ Failed to send message. Please try again later.');
    });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-form">
          <h1>Contact Me</h1>
          <p>Have an opportunity or question? Send me a message ✉️</p>

          <form id="contactForm" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Company / Team / Personal</label>
            <input
              type="text"
              name="company"
              placeholder="Company or Personal"
              value={formData.company}
              onChange={handleChange}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="send-btn">
              Send Message ✈️
            </button>
          </form>

          <a href="/Jaeyoon_Lee_Resume.pdf" className="resume-btn" download>
            📄 Download Resume
          </a>
        </div>

        <div className="globe-container">
          <Earth />
        </div>
      </div>
    </section>
  );
}

export default Contact;
