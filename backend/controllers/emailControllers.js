import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    return res.status(503).json({
      error: "Email is not configured",
      hint: "Set EMAIL_USER and EMAIL_PASS in the project root .env file",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,   // Gmail SMTP 규칙
      replyTo: email,
      to: emailUser,
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
