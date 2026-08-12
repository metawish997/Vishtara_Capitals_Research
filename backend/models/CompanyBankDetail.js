const mongoose = require('mongoose');

const CompanyBankDetailSchema = new mongoose.Schema({
  bank_name: {
    type: String,
  },
  account_holder_name: {
    type: String,
  },
  account_number: {
    type: String,
  },
  account_type: {
    type: String,
    default: 'saving',
  },
  ifsc_code: {
    type: String,
  },
  branch_address: {
    type: String,
  },
  upi_id: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  qr_code_image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  bank_logo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  payment_type: {
    type: String,
    default: 'bank',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  sort_order: {
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

CompanyBankDetailSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CompanyBankDetail', CompanyBankDetailSchema);
