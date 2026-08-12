const mongoose = require('mongoose');

const HowItWorksStepSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.ObjectId,
    ref: 'HowItWorksSection',
    required: true,
  },
  short_title: { type: String },
  title: { type: String },
  description: { type: String },
  highlight_text: { type: String },
  icon: { type: String },
  link_text: { type: String },
  link_url: { type: String },
  sort_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HowItWorksStepSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HowItWorksStep', HowItWorksStepSchema);
