const mongoose = require('mongoose');

const angelCredentialSchema = new mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
    },
    clientCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    totpSecret: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      default: 'https://apiconnect.angelbroking.com',
    },
    marketBaseUrl: {
      type: String,
      default: 'https://apiconnect.angelone.in',
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

const AngelCredential = mongoose.model('AngelCredential', angelCredentialSchema);

module.exports = AngelCredential;
