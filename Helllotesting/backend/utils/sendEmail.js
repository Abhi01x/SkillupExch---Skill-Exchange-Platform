const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  console.log('📧 Attempting to send email to:', options.email);
  console.log('📧 SENDGRID_API_KEY set:', process.env.SENDGRID_API_KEY ? 'Yes' : 'NO');
  console.log('📧 EMAIL_FROM set:', process.env.EMAIL_FROM ? 'Yes' : 'NO');

  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not set');
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: process.env.EMAIL_FROM || 'noreply@skillexchange.com',
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', options.email);
  } catch (error) {
    console.error('❌ SendGrid Error:', error.message);
    if (error.response) {
      console.error('❌ SendGrid Response:', error.response.body);
    }
    throw error;
  }
};

module.exports = sendEmail;