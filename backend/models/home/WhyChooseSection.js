const mongoose = require('mongoose');

const WhyChooseSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  badge: {
    type: String,
  },
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
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

WhyChooseSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WhyChooseSection', WhyChooseSectionSchema);
