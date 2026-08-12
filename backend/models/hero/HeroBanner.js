const mongoose = require('mongoose');

const HeroBannerSchema = new mongoose.Schema({
  page_key: {
    type: String,
    index: true,
  },
  badge: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  button_text_1: {
    type: String,
  },
  button_link_1: {
    type: String,
  },
  button_text_2: {
    type: String,
  },
  button_link_2: {
    type: String,
  },
  background_image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  mobile_background_image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  overlay_color: {
    type: String,
    default: '#000000',
  },
  text_color: {
    type: String,
    default: '#ffffff',
  },
  alignment: {
    type: String,
    default: 'left',
  },
  vertical_position: {
    type: String,
    default: 'center',
  },
  overlay_opacity: {
    type: Number,
    default: 0.30,
  },
  show_badge: {
    type: Boolean,
    default: true,
  },
  show_buttons: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  settings: {
    type: Object,
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

HeroBannerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HeroBanner', HeroBannerSchema);
