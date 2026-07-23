const mongoose = require('mongoose');

const PolicyContentSchema = new mongoose.Schema({
  policy_master: {
    type: mongoose.Schema.ObjectId,
    ref: 'PolicyMaster',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please add policy content'],
  },
  updates_summary: {
    type: String,
  },
  version_number: {
    type: Number,
    default: 1,
  },
  is_active: {
    type: Boolean,
    default: false,
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

PolicyContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PolicyContent', PolicyContentSchema);
