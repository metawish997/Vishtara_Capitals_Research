const mongoose = require('mongoose');

const ComplaintDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['monthly', 'monthly_trend', 'annual']
  },
  period: {
    type: String,
  },
  received_from: {
    type: String,
  },
  pending_last_month: {
    type: Number,
    default: 0,
  },
  received: {
    type: Number,
    default: 0,
  },
  resolved: {
    type: Number,
    default: 0,
  },
  total_pending: {
    type: Number,
    default: 0,
  },
  pending_gt_3months: {
    type: Number,
    default: 0,
  },
  avg_resolution_time: {
    type: Number,
    default: 0.00,
  },
  carried_forward: {
    type: Number,
    default: 0,
  },
  sno: {
    type: Number,
    default: 0,
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

ComplaintDataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ComplaintData', ComplaintDataSchema);
