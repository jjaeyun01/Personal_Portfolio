import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,   // Gmail SMTP 규칙
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `📩 New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ error: "Email sending failed" });
  }
};
