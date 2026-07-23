const mongoose = require('mongoose');

const HeaderSettingSchema = new mongoose.Schema({
  website_name: {
    type: String,
    required: true,
  },
  logo_svg: {
    type: String,
  },
  button_text: {
    type: String,
    default: 'Sign In',
  },
  button_link: {
    type: String,
    default: '#',
  },
  button_active: {
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
  collection: 'header_settings',
  bufferCommands: false
});

HeaderSettingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HeaderSetting', HeaderSettingSchema);
