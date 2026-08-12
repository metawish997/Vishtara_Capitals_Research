const mongoose = require('mongoose');

const ComplaintRecordSchema = new mongoose.Schema({
  received_from: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
  },
  complaint_number: {
    type: String,
  },
  complaint_date: {
    type: Date,
    required: true,
  },
  complaint_month: {
    type: Number,
    required: true,
    index: true,
  },
  complaint_year: {
    type: Number,
    required: true,
    index: true,
  },
  status: {
    type: String,
    default: 'pending',
    index: true,
  },
  pending_since_date: {
    type: Date,
  },
  resolution_description: {
    type: String,
  },
  resolved_date: {
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

ComplaintRecordSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ComplaintRecord', ComplaintRecordSchema);
