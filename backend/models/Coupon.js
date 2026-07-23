const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['flat', 'percent'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  min_amount: {
    type: Number,
  },
  global_limit: {
    type: Number,
  },
  used_global: {
    type: Number,
    default: 0,
  },
  per_user_limit: {
    type: Number,
    default: 1,
  },
  expires_at: {
    type: Date,
  },
  active: {
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

CouponSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Coupon', CouponSchema);
