
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, message, name } = req.body;

  // Validate required fields
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: 'wolfras87@gmail.com',
      subject: `Portfolio Contact from ${name || email}`,
      text: message,
      html: `<p><strong>From:</strong> ${email}</p>
             <p><strong>Name:</strong> ${name || 'Not provided'}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}