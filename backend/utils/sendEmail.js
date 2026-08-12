const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Load SMTP config from DB first, fallback to .env
  let smtpConfig = {};
  try {
    const SmtpCredential = require('../models/SmtpCredential');
    const credential = await SmtpCredential.findOne({ isActive: true });
    if (credential && credential.host && credential.user && credential.pass) {
      smtpConfig = {
        host: credential.host,
        port: Number(credential.port) || 465,
        secure: Number(credential.port) === 465,
        user: credential.user,
        pass: credential.pass,
        fromName: credential.fromName,
        fromEmail: credential.fromEmail,
      };
      console.log('[sendEmail] Using SMTP credentials from DB');
    }
  } catch (e) {
    console.warn('[sendEmail] Could not load SMTP credentials from DB, using .env', e.message);
  }

  // Fallback to .env if DB config is missing
  const host = smtpConfig.host || process.env.MAIL_HOST || process.env.EMAIL_HOST;
  const port = smtpConfig.port || Number(process.env.MAIL_PORT || process.env.EMAIL_PORT);
  const user = smtpConfig.user || process.env.MAIL_USERNAME || process.env.EMAIL_USER;
  const pass = smtpConfig.pass || process.env.MAIL_PASSWORD || process.env.EMAIL_PASS;
  const fromName = smtpConfig.fromName || process.env.MAIL_FROM_NAME || process.env.EMAIL_FROM_NAME;
  const fromEmail = smtpConfig.fromEmail || process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_FROM;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('[sendEmail] Email sent: %s', info.messageId);
  } catch (error) {
    console.error('[sendEmail] NODEMAILER_ERROR:', error);
    throw error;
  }
};

module.exports = sendEmail;

