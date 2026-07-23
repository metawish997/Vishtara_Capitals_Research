const mongoose = require('mongoose');

const HomeKeyFeatureItemSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.ObjectId,
    ref: 'HomeKeyFeatureSection',
    required: true,
  },
  title: { type: String },
  sort_order: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HomeKeyFeatureItemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HomeKeyFeatureItem', HomeKeyFeatureItemSchema);
