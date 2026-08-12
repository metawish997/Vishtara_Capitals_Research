const mongoose = require('mongoose');
const slugify = require('slugify');

const NewsSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'NewsCategory',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  short_description: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  full_description: {
    type: String,
  },
  content_json: {
    type: Object,
  },
  news_type: {
    type: String,
    enum: ['regular', 'breaking', 'exclusive', 'live'],
    default: 'regular',
  },
  location: {
    type: String,
  },
  source_name: {
    type: String,
  },
  source_url: {
    type: String,
  },
  video_url: {
    type: String,
  },
  meta_title: {
    type: String,
  },
  meta_description: {
    type: String,
  },
  meta_keywords: {
    type: [String],
  },
  canonical_url: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft',
    index: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_trending: {
    type: Boolean,
    default: false,
  },
  allow_comments: {
    type: Boolean,
    default: true,
  },
  priority_weight: {
    type: Number,
    default: 0,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  share_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: Number,
    default: 0,
  },
  published_at: {
    type: Date,
  },
  scheduled_for: {
    type: Date,
  },
  table_of_contents: {
    type: Object,
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
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

NewsSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('News', NewsSchema);
