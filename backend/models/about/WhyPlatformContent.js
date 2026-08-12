const mongoose = require('mongoose');

const WhyPlatformContentSchema = new mongoose.Schema({
  section_id: { type: mongoose.Schema.ObjectId, ref: 'WhyPlatformSection', required: true },
  content: { type: String, required: true },
  sort_order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

WhyPlatformContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WhyPlatformContent', WhyPlatformContentSchema);
