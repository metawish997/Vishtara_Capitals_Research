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
    required: true,
  },
  exchange: {
    type: String,
    required: true,
    default: 'NSE',
  },
  expiry: {
    type: String,
  },
  instrumenttype: {
    type: String,
  },
  lot_size: {
    type: Number,
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

WatchlistScriptSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WatchlistScript', WatchlistScriptSchema);
