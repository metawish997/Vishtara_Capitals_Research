const mongoose = require('mongoose');

const CoreValueSectionSchema = new mongoose.Schema({
  badge: { type: String, default: 'CORE VALUES' },
  title: { type: String, default: 'What We Stand For' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CoreValueSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CoreValueSection', CoreValueSectionSchema);
