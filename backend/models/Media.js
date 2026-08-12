const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  storageName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  size: {
    type: Number, // in bytes
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileCategory: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Media', MediaSchema);
