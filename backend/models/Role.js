const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a role name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please add a slug'],
    unique: true,
    lowercase: true,
  },
  permissions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Permission',
    },
  ],
  is_locked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Role', RoleSchema);
