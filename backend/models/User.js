const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  smra_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  employeeCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  joiningDate: {
    type: Date,
  },
  profilePhoto: {
    type: String,
  },
  father_name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted', 'blocked', 'resigned'],
    default: 'active',
  },
  annual_income: {
    type: String,
  },
  is_age_verified: {
    type: Boolean,
    default: false,
  },
  email_verified_at: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
  },
  remember_token: {
    type: String,
  },
  fcm_token: {
    type: String,
  },
  last_login_at: {
    type: Date,
  },
  last_active_at: {
    type: Date,
  },
  login_count: {
    type: Number,
    default: 0,
  },
  phone_change_count: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
  country: {
    type: String,
  },
  is_kyc_synced: {
    type: Boolean,
    default: false,
  },
  kyc_status: {
    type: String,
    default: 'none',
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
  language_preference: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  marital_status: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
  },
  blood_group: {
    type: String,
  },
  adhar_card: {
    type: String,
  },
  adhar_card_name: {
    type: String,
  },
  pan_card: {
    type: String,
  },
  pan_card_name: {
    type: String,
  },
  pan_card_image: {
    type: String,
  },
  adhar_card_image: {
    type: String,
  },
  business_name: {
    type: String,
  },
  business_type: {
    type: String,
  },
  business_document: {
    type: String,
  },
  education_institute: {
    type: String,
  },
  education_degree: {
    type: String,
  },
  education_document: {
    type: String,
  },
  website: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  social_links: {
    type: Map,
    of: String,
  },
  hobbies: {
    type: String,
  },
  skills: {
    type: String,
  },
  emergency_contact_name: {
    type: String,
  },
  emergency_contact_phone: {
    type: String,
  },
  deletedAt: {
    type: Date,
  },
  deleteReason: {
    type: String,
  },
  deletedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  isDeleted: {
    type: Boolean,
    default: false,
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
UserSchema.virtual('kycVerification', {
  ref: 'KycVerification',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
