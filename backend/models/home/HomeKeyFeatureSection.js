const mongoose = require('mongoose');

const HomeKeyFeatureSectionSchema = new mongoose.Schema({
  heading: { type: String },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HomeKeyFeatureSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HomeKeyFeatureSection', HomeKeyFeatureSectionSchema);
