const mongoose = require('mongoose');
const slugify = require('slugify');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'danger', 'offer'],
    default: 'info',
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  starts_at: {
    type: Date,
  },
  ends_at: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create campaign slug from the title
CampaignSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Campaign', CampaignSchema);
