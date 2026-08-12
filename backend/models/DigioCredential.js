const mongoose = require('mongoose');

const digioCredentialSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: true,
    },
    client_secret: {
      type: String,
      required: true,
    },
    api_base_url: {
      type: String,
      required: true,
    },
    workflow_name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DigioCredential = mongoose.model('DigioCredential', digioCredentialSchema);

module.exports = DigioCredential;
