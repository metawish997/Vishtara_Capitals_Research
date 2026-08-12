const mongoose = require('mongoose');

const ManualPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  plan_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlan',
  },
  duration_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlanDuration',
  },
  plan_name: {
    type: String,
    required: true,
  },
  duration_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  screenshot: {
    type: String,
    required: false,
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
  },
  coupon_code: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'expired', 'rejected'],
    default: 'pending',
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

ManualPaymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ManualPayment', ManualPaymentSchema);
