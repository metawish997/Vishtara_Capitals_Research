const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  invoice_id: {
    type: String, // Or ObjectId if we had Invoice model
  },
  times_used: {
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

CouponUsageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CouponUsage', CouponUsageSchema);
