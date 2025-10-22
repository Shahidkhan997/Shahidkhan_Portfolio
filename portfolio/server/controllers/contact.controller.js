const nodemailer = require('nodemailer');
const Contact = require('../models/contact.model');

// Create a transporter object using Outlook SMTP (only for notifications)
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

// Contact form submission
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate request
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Save to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await newContact.save();

    // Send notification email (optional)
    try {
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${subject}`,
        text: `New message from ${name} (${email}):\n\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><small>Received at: ${new Date().toLocaleString()}</small></p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the request if email sending fails
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    next(error);
  }
};

module.exports = {
  submitContactForm
};
