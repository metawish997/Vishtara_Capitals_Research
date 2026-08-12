const mongoose = require('mongoose');

const UserAgreementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  subscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserSubscription',
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  invoice_number: {
    type: String,
    required: true,
    index: true,
  },
  agreement_number: {
    type: String,
    required: true,
    index: true,
  },
  signed_at: {
    type: Date,
  },
  user_snapshot: {
    type: Object,
    required: true,
  },
  kyc_snapshot: {
    type: Object,
    required: true,
  },
  subscription_snapshot: {
    type: Object,
    required: true,
  },
  invoice_snapshot: {
    type: Object,
    required: true,
  },
  is_signed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'generated',
    index: true,
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
  },
  coupon_code: {
    type: String,
  },
  digio_document_id: {
    type: String,
  },
  esign_url: {
    type: String,
  },
  pdf_path: {
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

UserAgreementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserAgreement', UserAgreementSchema);
