const mongoose = require('mongoose');

const razorpayCredentialSchema = new mongoose.Schema(
  {
    keyId: {
      type: String,
      default: '',
    },
    keySecret: {
      type: String,
      default: '',
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

const RazorpayCredential = mongoose.model('RazorpayCredential', razorpayCredentialSchema);

module.exports = RazorpayCredential;
