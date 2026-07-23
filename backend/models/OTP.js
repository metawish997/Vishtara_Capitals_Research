const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['mobile', 'email'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 }, // OTP expires in 5 minutes
  },
});

module.exports = mongoose.model('OTP', OTPSchema);
