const mongoose = require('mongoose');

const AngelScripSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Please add a token'],
    index: true,
  },
  symbol: {
    type: String,
  },
  name: {
    type: String,
  },
  expiry: {
    type: String,
  },
  strike: {
    type: Number,
  },
  lotsize: {
    type: String,
  },
  instrumenttype: {
    type: String,
  },
  exch_seg: {
    type: String,
    required: [true, 'Please add exch_seg'],
    index: true,
  },
  tick_size: {
    type: Number,
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

// Update the updatedAt field before saving
AngelScripSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AngelScrip', AngelScripSchema);
