const mongoose = require('mongoose');

const ServicePlanDurationSchema = new mongoose.Schema({
  service_plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlan',
    required: true,
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration name'],
  },
  duration_type: {
    type: String,
    enum: ['monthly', 'half_yearly', 'yearly', 'custom'],
    default: 'monthly',
  },
  duration_months: {
    type: Number,
    required: [true, 'Please add duration in months'],
  },
  duration_days: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
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

ServicePlanDurationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ServicePlanDuration', ServicePlanDurationSchema);
