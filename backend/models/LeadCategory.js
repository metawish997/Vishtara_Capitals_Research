const mongoose = require('mongoose');

const LeadCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a lead category name'],
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  status: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeadCategory', LeadCategorySchema);
