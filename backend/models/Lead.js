const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  leadCode: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add a mobile number'],
    trim: true
  },
  email: {
    type: String,
    default: null,
    trim: true
  },
  leadSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeadSource"
  },
  leadCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeadCategory"
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeadStatus"
  },
  ownerLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  readStatus: {
    type: String,
    enum: ["Unread", "Read"],
    default: "Unread"
  },
  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save hook for auto-generating lead code (LD000001, LD000002...)
LeadSchema.pre('save', async function (next) {
  if (!this.leadCode) {
    try {
      const lastLead = await this.constructor.findOne().sort({ leadCode: -1 });
      let nextNum = 1;
      if (lastLead && lastLead.leadCode) {
        const match = lastLead.leadCode.match(/LD(\d+)/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      this.leadCode = `LD${nextNum.toString().padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Lead', LeadSchema);
