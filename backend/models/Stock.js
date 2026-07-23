const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Please add a stock symbol'],
    unique: true,
    trim: true,
    maxlength: [10, 'Symbol cannot be more than 10 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please add a stock name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  sector: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Stock', StockSchema);
