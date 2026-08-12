const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  user_subscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserSubscription', // Will create this model later
  },
  invoice_number: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  payment_gateway: {
    type: String,
  },
  payment_reference: {
    type: String,
  },
  invoice_date: {
    type: Date,
    required: true,
  },
  service_start_date: {
    type: Date,
    required: true,
  },
  service_end_date: {
    type: Date,
    required: true,
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

InvoiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
