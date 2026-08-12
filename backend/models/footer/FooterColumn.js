const mongoose = require('mongoose');

const FooterColumnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sort_order: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FooterColumnSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterColumn', FooterColumnSchema);
