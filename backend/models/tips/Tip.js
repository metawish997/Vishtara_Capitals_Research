const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tip',
  },
  tip_type: {
    type: String,
    enum: ['equity', 'future', 'option'],
    required: true,
    index: true,
  },
  stock_name: {
    type: String,
    required: true,
    index: true,
  },
  symbol_token: {
    type: String,
  },
  exchange: {
    type: String,
    required: true,
  },
  chart_image: {
    type: String,
  },
  call_type: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'TipCategory',
    required: true,
    index: true,
  },
  entry_price: {
    type: Number,
    required: true,
  },
  target_price: {
    type: Number,
    required: true,
  },
  target_price_2: {
    type: Number,
  },
  stop_loss: {
    type: Number,
    required: true,
  },
  cmp_price: {
    type: Number,
  },
  exit_price: {
    type: Number,
  },
  exit_at: {
    type: Date,
  },
  t1_achieved_at: {
    type: Date,
  },
  expiry_date: {
    type: Date,
  },
  strike_price: {
    type: String,
  },
  option_type: {
    type: String,
    enum: ['CE', 'PE'],
  },
  status: {
    type: String,
    enum: ['Wait for Entry', 'Active', 'T1-Achieved', 'T2-Achieved', 'SL-Hit', 'Early-Exit'],
    default: 'Active',
    index: true,
  },
  trade_status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
    index: true,
  },
  version: {
    type: Number,
    default: 1,
    index: true,
  },
  admin_note: {
    type: String,
  },
  admin_notes: [{
    note: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  remarks: {
    type: String,
  },
  followups: {
    type: Array,
    default: []
  },
  created_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
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

TipSchema.index({ trade_status: 1, createdAt: -1 });


TipSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tip', TipSchema);
