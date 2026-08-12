const mongoose = require('mongoose');

const HomeCounterSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, 'Please add a value (e.g., 500+)'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
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

HomeCounterSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HomeCounter', HomeCounterSchema);
