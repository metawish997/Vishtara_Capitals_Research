const mongoose = require('mongoose');

const LeadImportSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  totalRows: {
    type: Number,
    default: 0
  },
  importedRows: {
    type: Number,
    default: 0
  },
  duplicateRows: {
    type: Number,
    default: 0
  },
  failedRows: {
    type: Number,
    default: 0
  },
  unassignedRows: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending'
  },
  progress: {
    type: Number,
    default: 0
  },
  warnings: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeadImport', LeadImportSchema);
