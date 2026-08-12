const mongoose = require('mongoose');

const FooterLinkSchema = new mongoose.Schema({
  footer_column: {
    type: mongoose.Schema.ObjectId,
    ref: 'FooterColumn',
    required: true,
  },
  label: { type: String, required: true },
  url: { type: String },
  sort_order: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FooterLinkSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterLink', FooterLinkSchema);
