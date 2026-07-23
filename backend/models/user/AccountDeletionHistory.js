const mongoose = require('mongoose');

const AccountDeletionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  deleteReason: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  deviceInfo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AccountDeletionHistory', AccountDeletionHistorySchema);
