const mongoose = require('mongoose');

const MarqueeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'Please add marquee content'],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  start_at: {
    type: Date,
  },
  end_at: {
    type: Date,
  },
  display_order: {
    type: Number,
    default: 1,
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

MarqueeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Marquee', MarqueeSchema);
