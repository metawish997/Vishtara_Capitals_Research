const mongoose = require('mongoose');

const MasterNotificationReadSchema = new mongoose.Schema({
  notification: {
    type: mongoose.Schema.ObjectId,
    ref: 'MasterNotification',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  read_at: {
    type: Date,
  },
  acknowledged_at: {
    type: Date,
  },
  deleted_at: {
    type: Date,
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

MasterNotificationReadSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MasterNotificationRead', MasterNotificationReadSchema);
