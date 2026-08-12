const mongoose = require('mongoose');

const TipPlanAccessSchema = new mongoose.Schema({
  tip: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tip',
    required: true,
    index: true,
  },
  service_plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServicePlan',
    required: true,
    index: true,
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

TipPlanAccessSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TipPlanAccess', TipPlanAccessSchema);
