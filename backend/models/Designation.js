const mongoose = require('mongoose');

const DesignationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a designation name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  level: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Designation', DesignationSchema);
