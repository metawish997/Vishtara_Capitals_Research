const mongoose = require('mongoose');

const FooterSettingSchema = new mongoose.Schema({
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  copyright_text: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FooterSettingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterSetting', FooterSettingSchema);
