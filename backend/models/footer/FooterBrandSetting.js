const mongoose = require('mongoose');

const FooterBrandSettingSchema = new mongoose.Schema({
  title: { type: String },
  icon_svg: { type: String },
  description: { type: String },
  subtitle: { type: String },
  content: { type: String },
  note: { type: String },
  button_text: { type: String },
  button_link: { type: String },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media'
  },
  status: { type: Boolean, default: true },
  sort_order: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FooterBrandSettingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterBrandSetting', FooterBrandSettingSchema);
