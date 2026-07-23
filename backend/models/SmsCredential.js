const mongoose = require('mongoose');

const smsCredentialSchema = new mongoose.Schema(
  {
    baseUrl: {
      type: String,
      default: 'http://sms.smsariseworld.com/submitsms.jsp',
    },
    user: {
      type: String,
      default: 'THEREPID',
    },
    key: {
      type: String,
      default: '',
    },
    sender: {
      type: String,
      default: 'TRDINV',
    },
    entityId: {
      type: String,
      default: '1701175144798287756',
    },
    templateId: {
      type: String,
      default: '1707177219938893175',
    },
    countryCode: {
      type: String,
      default: '91',
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

const SmsCredential = mongoose.model('SmsCredential', smsCredentialSchema);

module.exports = SmsCredential;
