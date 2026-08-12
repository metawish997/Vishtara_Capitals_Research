const mongoose = require('mongoose');
const slugify = require('slugify');

const NewsCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: {
    type: String,
  },
  color_code: {
    type: String,
    default: '#4f46e5',
  },
  icon: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  order_priority: {
    type: Number,
    default: 0,
  },
  meta_title: {
    type: String,
  },
  meta_description: {
    type: String,
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

NewsCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NewsCategory', NewsCategorySchema);
