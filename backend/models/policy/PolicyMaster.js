const mongoose = require('mongoose');
const slugify = require('slugify');

const PolicyMasterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a policy name'],
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  is_enabled: {
    type: Boolean,
    default: true,
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

PolicyMasterSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PolicyMaster', PolicyMasterSchema);
