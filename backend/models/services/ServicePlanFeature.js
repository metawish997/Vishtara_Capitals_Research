const mongoose = require('mongoose');

const ServicePlanFeatureSchema = new mongoose.Schema({
  service_plan_duration: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlanDuration',
    required: true,
  },
  svg_icon: {
    type: String,
  },
  text: {
    type: String,
    required: [true, 'Please add feature text'],
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

ServicePlanFeatureSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ServicePlanFeature', ServicePlanFeatureSchema);
