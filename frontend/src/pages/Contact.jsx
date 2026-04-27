import { useState, useEffect } from 'react';

function Contact({ setSenderPos, setSendKey }) {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus]     = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setSenderPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setSenderPos(null)
    );
  }, [setSenderPos]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res  = await fetch('http://localhost:5001/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Email Error:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-form-win term-win">
          <div className="term-bar">
            <div className="term-dots">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
            </div>
            <span className="term-title">contact.sh</span>
          </div>

          <div className="contact-form">
            <h1>
              <span className="syn-fn">sendMessage</span>
              <span className="syn-muted">()</span>
            </h1>
            <p>
              <span className="syn-cmt">// Have an opportunity? Drop a message.</span>
            </p>
            <p className="contact-globe-hint">
              Watch the globe on the right — your message will fly to Madison 🌏
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>name</label>
                <input type="text" name="name" placeholder="Your name"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>email</label>
                <input type="email" name="email" placeholder="your@email.com"
                  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>company</label>
                <input type="text" name="company" placeholder="Company or Personal"
                  value={formData.company} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>message</label>
                <textarea name="message" rows="4" placeholder="Write your message..."
                  value={formData.message} onChange={handleChange} required />
              </div>

              <button type="submit" className="send-btn">
                <span className="syn-green">$ </span>send --to madison ✈️
              </button>
            </form>

            {status === 'success' && (
              <p className="form-status success">✓ Message sent! Your letter is flying to Madison ✉️</p>
            )}
            {status === 'error' && (
              <p className="form-status error">✗ Failed to send. Please try again.</p>
            )}

            <a href="/Jaeyoon_Lee_Resume.pdf" className="resume-btn" download>
              <span className="syn-cmt">// </span>📄 download resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
