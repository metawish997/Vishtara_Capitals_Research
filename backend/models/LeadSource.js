const mongoose = require('mongoose');

const LeadSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a lead source name'],
    unique: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeadSource', LeadSourceSchema);
