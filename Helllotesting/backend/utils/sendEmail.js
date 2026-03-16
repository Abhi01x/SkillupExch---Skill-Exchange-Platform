const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('📧 Attempting to send email to:', options.email);
  console.log('📧 EMAIL_USER set:', process.env.EMAIL_USER ? 'Yes' : 'NO');
  console.log('📧 EMAIL_PASS set:', process.env.EMAIL_PASS ? 'Yes (length: ' + process.env.EMAIL_PASS.length + ')' : 'NO');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true,
    family: 4
  });

  const mailOptions = {
    from: `"Skill Exchange" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email Error:', error.message);
    console.error('❌ Error Code:', error.code);
    throw error;
  }
};

module.exports = sendEmail;