const mongoose = require('mongoose');

const ServicePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service plan name'],
    unique: true,
  },
  tagline: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 1,
  },
  button_text: {
    type: String,
    default: 'Subscribe Now',
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

ServicePlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ServicePlan', ServicePlanSchema);
