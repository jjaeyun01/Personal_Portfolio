import { useState, useEffect } from 'react';
import Earth from '../components/Earth';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [senderPos, setSenderPos] = useState(null);
  const [sendKey, setSendKey] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setSenderPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setSenderPos(null)
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch("http://localhost:5001/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setSendKey((k) => k + 1);
        setFormData({ name: '', email: '', company: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Email Error:", err);
      setStatus('error');
    }
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

          {status === 'success' && (
            <p className="form-status success">Message sent! Your letter is on its way to Madison ✉️</p>
          )}
          {status === 'error' && (
            <p className="form-status error">Failed to send. Please try again.</p>
          )}

          <a href="/Jaeyoon_Lee_Resume.pdf" className="resume-btn" download>
            📄 Download Resume
          </a>
        </div>

        <div className="globe-container">
          <Earth senderPos={senderPos} sendKey={sendKey} />
        </div>
      </div>
    </section>
  );
}

export default Contact;
