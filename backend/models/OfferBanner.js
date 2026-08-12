const mongoose = require('mongoose');
const slugify = require('slugify');

const OfferBannerSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  heading: {
    type: String,
    required: [true, 'Please add a heading'],
  },
  sub_heading: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  highlight_text: {
    type: String,
  },
  button1_text: {
    type: String,
    required: true,
  },
  button1_link: {
    type: String,
    required: true,
  },
  button1_target: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self',
  },
  button2_text: {
    type: String,
    required: true,
  },
  button2_link: {
    type: String,
    required: true,
  },
  button2_target: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self',
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  mobile_image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  position: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  device_visibility: {
    type: String,
    enum: ['all', 'desktop', 'mobile'],
    default: 'all',
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  click_count: {
    type: Number,
    default: 0,
  },
  created_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  updated_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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

OfferBannerSchema.pre('save', function (next) {
  if (this.isModified('heading')) {
    this.slug = slugify(this.heading, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('OfferBanner', OfferBannerSchema);
