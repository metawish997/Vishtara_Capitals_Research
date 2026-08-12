const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please add a type'],
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  detail: {
    type: String,
    required: [true, 'Please add details'],
  },
  published_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  attachments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Media',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
AnnouncementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
