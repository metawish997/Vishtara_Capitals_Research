const mongoose = require('mongoose');

const WatchlistScriptSchema = new mongoose.Schema({
  watchlist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Watchlist',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    index: true,
  },
  trading_symbol: {
    type: String,
  },
  token: {
    type: String,
  },
  exchange: {
    type: String,
    default: 'NSE',
  },
  ltp: {
    type: Number,
    default: 0.00,
  },
  net_change: {
    type: Number,
    default: 0.00,
  },
  percent_change: {
    type: Number,
    default: 0.00,
  },
  is_positive: {
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

WatchlistScriptSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WatchlistScript', WatchlistScriptSchema);
