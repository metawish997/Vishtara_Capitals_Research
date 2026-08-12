const mongoose = require('mongoose');

const RiskRewardMasterSchema = new mongoose.Schema({
  calculation_type: {
    type: String,
    enum: ['percentage', 'price'],
    required: true,
  },
  target1_value: {
    type: Number,
    required: true,
  },
  target2_value: {
    type: Number,
  },
  stoploss_value: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
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

RiskRewardMasterSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RiskRewardMaster', RiskRewardMasterSchema);
