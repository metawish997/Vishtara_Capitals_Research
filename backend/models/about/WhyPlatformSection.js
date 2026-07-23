const mongoose = require('mongoose');

const WhyPlatformSectionSchema = new mongoose.Schema({
  badge: { type: String },
  heading: { type: String, required: true },
  subheading: { type: String },
  closing_text: { type: String },
  image: { type: mongoose.Schema.ObjectId, ref: 'Media' },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

WhyPlatformSectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WhyPlatformSection', WhyPlatformSectionSchema);
