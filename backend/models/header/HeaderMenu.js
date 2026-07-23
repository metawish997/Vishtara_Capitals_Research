const mongoose = require('mongoose');

const HeaderMenuSchema = new mongoose.Schema({
  icon_svg: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Please add a menu title'],
  },
  slug: {
    type: String,
    required: true,
    index: true,
  },
  link: {
    type: String,
  },
  order_no: {
    type: Number,
    required: true,
    index: true,
  },
  show_in_header: {
    type: Boolean,
    default: true,
  },
  status: {
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
}, {
  collection: 'header_menus',
  bufferCommands: false
});

HeaderMenuSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HeaderMenu', HeaderMenuSchema);
