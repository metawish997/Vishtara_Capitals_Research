const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  badge: { type: String, default: 'OUR MISSION' },
  title: { type: String },
  mission_text: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MissionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Mission', MissionSchema);
