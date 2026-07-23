const mongoose = require('mongoose');
const slugify = require('slugify');

const PopupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['notification', 'offer', 'policy', 'image', 'video'],
    default: 'notification',
  },
  content_type: {
    type: String,
    enum: ['text', 'html', 'image'],
    default: 'text',
  },
  content: {
    type: String,
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  button_text: {
    type: String,
  },
  button_url: {
    type: String,
  },
  is_dismissible: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
    index: true,
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

PopupSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Popup', PopupSchema);
