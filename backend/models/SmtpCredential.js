const mongoose = require('mongoose');

const smtpCredentialSchema = new mongoose.Schema(
  {
    host: {
      type: String,
      default: 'smtp.hostinger.com',
    },
    port: {
      type: String,
      default: '465',
    },
    encryption: {
      type: String,
      default: 'ssl',
    },
    user: {
      type: String,
      default: 'support@therapidinvestors.com',
    },
    pass: {
      type: String,
      default: '',
    },
    fromEmail: {
      type: String,
      default: 'support@therapidinvestors.com',
    },
    fromName: {
      type: String,
      default: 'The Rapid Investors',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SmtpCredential = mongoose.model('SmtpCredential', smtpCredentialSchema);

module.exports = SmtpCredential;
