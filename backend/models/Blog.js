const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'BlogCategory',
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
  },
  content_json: {
    type: String, // To store rich text editor JSON
  },
  meta_title: {
    type: String,
  },
  meta_description: {
    type: String,
  },
  meta_keywords: {
    type: String,
  },
  reading_time: {
    type: Number,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'published'],
    default: 'draft',
  },
  published_at: {
    type: Date,
  },
  scheduled_for: {
    type: Date,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  like_count: {
    type: Number,
    default: 0,
  },
  share_count: {
    type: Number,
    default: 0,
  },
  canonical_url: {
    type: String,
  },
  table_of_contents: {
    type: String,
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

// Create slug from title
BlogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
