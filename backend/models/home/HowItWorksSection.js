const mongoose = require('mongoose');

const HowItWorksSectionSchema = new mongoose.Schema({
  badge: { type: String },
  heading: { type: String },
  sub_heading: { type: String },
  description: { type: String },
  cta_text: { type: String },
  cta_url: { type: String },
  alignment: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center',
  },
  sort_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HowItWorksSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HowItWorksSection', HowItWorksSectionSchema);
