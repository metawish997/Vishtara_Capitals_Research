const mongoose = require('mongoose');

const RefundRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  user_subscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserSubscription',
    required: true,
  },
  service_plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlan',
  },
  service_plan_duration: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlanDuration',
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  payment_gateway: {
    type: String,
    default: 'razorpay',
  },
  razorpay_payment_id: {
    type: String,
    index: true,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_refund_id: {
    type: String,
  },
  refund_amount: {
    type: Number,
    required: true,
  },
  refund_reason: {
    type: String,
  },
  refund_proof_image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  status: {
    type: String,
    default: 'refunded',
    index: true,
  },
  refunded_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  admin_note: {
    type: String,
  },
  refunded_at: {
    type: Date,
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

RefundRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RefundRequest', RefundRequestSchema);
