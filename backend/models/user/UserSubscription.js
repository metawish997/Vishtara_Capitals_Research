const mongoose = require('mongoose');

const UserSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  service_plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlan',
    required: function() { return this.payment_gateway !== 'demo'; }
  },
  service_plan_duration: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlanDuration',
    required: function() { return this.payment_gateway !== 'demo'; }
  },
  amount: {
    type: Number,
    required: function() { return this.payment_gateway !== 'demo'; }
  },
  currency: {
    type: String,
    default: 'INR',
  },
  payment_gateway: {
    type: String,
    default: 'razorpay',
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    index: true,
  },
  is_auto_renew: {
    type: Boolean,
    default: false,
  },
  payment_reference: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
    index: true,
  },
  razorpay_payment_id: {
    type: String,
    index: true,
  },
  razorpay_signature: {
    type: String,
  },
  payment_status: {
    type: String,
    default: 'pending',
    index: true,
  },
  payment_payload: {
    type: Object,
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
  },
  coupon_code: {
    type: String,
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

UserSubscriptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserSubscription', UserSubscriptionSchema);
