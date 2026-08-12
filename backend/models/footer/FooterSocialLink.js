const mongoose = require('mongoose');

const FooterSocialLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  icon: { type: String },
  url: { type: String, required: true },
  sort_order: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FooterSocialLinkSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterSocialLink', FooterSocialLinkSchema);
