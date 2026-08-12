const mongoose = require('mongoose');

const DraftAgreementSchema = new mongoose.Schema({
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
  agreement_no: {
    type: String,
    required: true,
  },
  plan_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  aadhaar_number: {
    type: String,
  },
  signature: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  pdf: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  digio_document_id: {
    type: String,
  },
  digio_request_id: {
    type: String,
  },
  esign_url: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
  },
  esign_completed_at: {
    type: Date,
  },
  agreement_details: {
    type: Object, // In SQL it was longtext bin
    required: true,
  },
  pdf_path: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'esign_pending', 'kyc_pending', 'signed', 'payment_pending', 'expired'],
    default: 'draft',
    index: true,
  },
  try_count: {
    type: Number,
    default: 0,
  },
  expires_at: {
    type: Date,
  },
  user_snapshot: {
    type: Object,
  },
  kyc_snapshot: {
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

DraftAgreementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DraftAgreement', DraftAgreementSchema);
