const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  issue: {
    type: String,
    required: [true, 'Please specify the issue'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  attachment: {
    type: String,
  },
  admin_note: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  status: {
    type: String,
    enum: ['In Progress', 'Open', 'Resolved'],
    default: 'In Progress',
  },
  opened_at: {
    type: Date,
    default: Date.now,
  },
  resolved_at: {
    type: Date,
  },
  resolution_days: {
    type: Number,
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

TicketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema);
