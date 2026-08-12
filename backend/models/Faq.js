const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  page_type: {
    type: String,
    required: true,
    index: true,
  },
  page_slug: {
    type: String,
    index: true,
  },
  question: {
    type: String,
    required: [true, 'Please add a question'],
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  meta_title: {
    type: String,
  },
  meta_description: {
    type: String,
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

FaqSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Faq', FaqSchema);
