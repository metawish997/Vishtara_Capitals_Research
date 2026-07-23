const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  certificate_name: {
    type: String,
    required: [true, 'Please add a certificate name'],
  },
  certificate_number: {
    type: String,
  },
  issued_by: {
    type: String,
  },
  issue_date: {
    type: Date,
  },
  expiry_date: {
    type: Date,
  },
  description: {
    type: String,
  },
  media: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked', 'pending'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
CertificateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Certificate', CertificateSchema);
