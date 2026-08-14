const User = require('../models/User');
const Role = require('../models/Role');
const Employee = require('../models/Employee');
const OTP = require('../models/OTP');
const DigioCredential = require('../models/DigioCredential');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const sendMobileOtp = require('../utils/sendMobileOtp');
const getOtpEmailTemplate = require('../utils/emailTemplate');
// @desc    Send OTP to Mobile and Email
// @route   POST /api/v1/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!phone || !email) {
      return res.status(400).json({ success: false, message: 'Please provide email and phone number' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }], status: { $ne: 'deleted' } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (associated with phone)
    await OTP.deleteMany({ phone }); // Clear old OTPs
    await OTP.create({ phone, otp, type: 'mobile' });

    // 1. Send via Mobile SMS — REQUIRED (block if fails)
    try {
      await sendMobileOtp({ phone, otp });
      console.log('[sendOtp] SMS OTP sent to', phone);
    } catch (err) {
      console.error('[sendOtp] Mobile SMS Error:', err);
      return res.status(500).json({ success: false, message: 'Mobile OTP could not be sent. Please check your phone number.' });
    }

    // 2. Send via Email — OPTIONAL (warn but don't block)
    let emailSent = false;
    try {
      await sendEmail({
        email,
        subject: 'Registration OTP - Vishtara Capital Research',
        message: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
        html: getOtpEmailTemplate(otp, 'Account Registration', 'Thank you for choosing Vishtara Capital Research. Please use the following OTP to complete your registration.'),
      });
      emailSent = true;
      console.log('[sendOtp] Email OTP sent to', email);
    } catch (err) {
      // Email failed but SMS was sent — warn and continue
      console.warn('[sendOtp] Email OTP failed (non-blocking):', err.message);
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? 'OTP sent to your mobile number and email'
        : 'OTP sent to your mobile number (email delivery failed)',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, annual_income, is_age_verified, password, otp } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }], status: { $ne: 'deleted' } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already registered' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      phone,
      otp,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // 5 mins
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Delete used OTPs
    await OTP.deleteMany({ phone });

    // Check for customer role
    let role = await Role.findOne({ name: 'customer' });

    if (!role) {
      // Create customer role if not exists
      role = await Role.create({
        name: 'customer',
        slug: 'customer',
        is_locked: true
      });
    }

    // Generate smra_id (incremental) with collision handling
    let smra_id = 'SMRA-0001';
    let attempts = 0;
    let success = false;
    let user = null;

    while (attempts < 5 && !success) {
      const lastUsers = await User.find({ smra_id: { $regex: /^SMRA-\d{4}$/ } })
        .sort({ smra_id: -1 })
        .limit(1);

      let nextNumber = 1;
      if (lastUsers.length > 0 && lastUsers[0].smra_id) {
        const lastIdStr = lastUsers[0].smra_id.split('-')[1];
        nextNumber = parseInt(lastIdStr) + 1;
      }

      // Offset by attempts to try next one if collision
      smra_id = `SMRA-${(nextNumber + attempts).toString().padStart(4, '0')}`;

      try {
        // Try to create the user
        user = await User.create({
          smra_id,
          name,
          email,
          phone,
          annual_income,
          is_age_verified,
          password,
          fcm_token: req.body.fcm_token || null,
          role: role._id,
          status: 'active'
        });
        success = true;
      } catch (error) {
        if (error.code === 11000) {
          // If it's a duplicate key error
          const field = Object.keys(error.keyPattern)[0];
          if (field === 'smra_id') {
            attempts++;
            continue; // Try next smra_id
          } else {
            // It's email or phone, which should have been caught, but just in case
            return res.status(400).json({
              success: false,
              message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
            });
          }
        }
        throw error; // Rethrow other errors
      }
    }

    if (!success) {
      return res.status(500).json({ success: false, message: 'System busy. Please try registration again.' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });

    const credential = await DigioCredential.findOne({ isActive: true });
    const kyc_status = credential ? user.kyc_status : 'approved';

    res.status(201).json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        kyc_status,
        id: user._id,
        role: role.name.toLowerCase(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email or phone and password' });
    }

    email = email.trim();

    // Check for user (sort to get the most recent active account if a deleted one exists)
    let isEmployee = false;
    let user = await User.findOne({
      $or: [
        { email: email },
        { phone: email }
      ]
    }).sort({ createdAt: -1 }).select('+password').populate({
      path: 'role',
      populate: { path: 'permissions' }
    });

    if (!user) {
      user = await Employee.findOne({
        $or: [
          { email: email },
          { phone: email }
        ]
      }).select('+password').populate({
        path: 'roleId',
        populate: { path: 'permissions' }
      }).populate('designationId');
      isEmployee = true;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials - User not found' });
    }

    if (user.status === 'deleted' || user.isDeleted || user.status === 'Inactive' || user.status === 'Resigned') {
      return res.status(401).json({ success: false, message: 'This account has been deleted or deactivated.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials - Password mismatch' });
    }

    // Generate smra_id if missing (fallback for old users) - NOT APPLICABLE TO EMPLOYEES
    if (!isEmployee) {
      if (!user.smra_id) {
        const lastUser = await User.findOne({ smra_id: { $exists: true } }).sort({ smra_id: -1 });
        let smra_id = 'SMRA-0001';
        if (lastUser && lastUser.smra_id) {
          const lastId = parseInt(lastUser.smra_id.split('-')[1]);
          smra_id = `SMRA-${(lastId + 1).toString().padStart(4, '0')}`;
        }
        user.smra_id = smra_id;
      }

      // Update FCM token if provided during login
      if (req.body.fcm_token) {
        user.fcm_token = req.body.fcm_token;
      }
      
      // Save user if we modified smra_id or fcm_token
      if (!user.smra_id || req.body.fcm_token) {
        await user.save();
      }
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });

    const credential = await DigioCredential.findOne({ isActive: true });
    const kyc_status = credential ? (user.kyc_status || 'approved') : 'approved';

    // Automatically assign Customer role if none is present
    if (!isEmployee && !user.role) {
      let customerRole = await Role.findOne({ slug: 'customer' });
      if (!customerRole) {
        customerRole = await Role.findOne({ name: /customer/i });
      }
      if (!customerRole) {
        customerRole = await Role.create({
          name: 'Customer',
          slug: 'customer',
          permissions: []
        });
      }
      user.role = customerRole._id;
      await user.save();
      await user.populate('role');
    }

    let roleName = 'user';
    if (isEmployee) {
      roleName = user.roleId ? user.roleId.name.toLowerCase() : 'employee';
      // Normalize role so frontend logic relying on 'role' works
      user.role = user.roleId;
    } else {
      roleName = user.role ? user.role.name.toLowerCase() : 'user';
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        kyc_status,
        id: user._id,
        role: roleName,
        roleData: isEmployee ? user.roleId : user.role,
        isEmployee,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    let isEmployee = false;
    let user = await User.findById(req.user.id).populate({
      path: 'role',
      populate: { path: 'permissions' }
    });

    if (!user) {
      user = await Employee.findById(req.user.id).populate({
        path: 'roleId',
        populate: { path: 'permissions' }
      });
      isEmployee = true;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const credential = await DigioCredential.findOne({ isActive: true });
    const kyc_status = credential ? (user.kyc_status || 'approved') : 'approved';

    // Automatically assign Customer role if none is present
    if (!isEmployee && !user.role) {
      let customerRole = await Role.findOne({ slug: 'customer' });
      if (!customerRole) {
        customerRole = await Role.findOne({ name: /customer/i });
      }
      if (!customerRole) {
        customerRole = await Role.create({
          name: 'Customer',
          slug: 'customer',
          permissions: []
        });
      }
      user.role = customerRole._id;
      await user.save();
      await user.populate({
        path: 'role',
        populate: { path: 'permissions' }
      });
    }

    let roleName = 'user';
    if (isEmployee) {
      roleName = user.roleId ? user.roleId.name.toLowerCase() : 'employee';
      user.role = user.roleId;
    } else {
      roleName = user.role ? user.role.name.toLowerCase() : 'user';
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        kyc_status,
        id: user._id,
        role: roleName,
        roleData: isEmployee ? user.roleId : user.role,
        isEmployee,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for updating email/phone
// @route   POST /api/v1/auth/send-update-otp
// @access  Private
exports.sendUpdateOtp = async (req, res, next) => {
  try {
    const { type, value } = req.body; // type: 'email' or 'phone'

    if (!value) {
      return res.status(400).json({ success: false, message: `Please provide new ${type}` });
    }

    // Check if new value is already taken by another user
    const userExists = await User.findOne({ [type]: value, _id: { $ne: req.user.id }, status: { $ne: 'deleted' } });
    if (userExists) {
      return res.status(400).json({ success: false, message: `This ${type} is already registered to another account` });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    await OTP.deleteMany({ [type === 'email' ? 'email' : 'phone']: value });
    await OTP.create({ [type === 'email' ? 'email' : 'phone']: value, otp, type: type === 'email' ? 'email' : 'mobile' });

    // Send OTP
    if (type === 'email') {
      try {
        await sendEmail({
          email: value,
          subject: 'Change Email OTP',
          message: `Your OTP for updating email is ${otp}. It will expire in 5 minutes.`,
          html: getOtpEmailTemplate(otp, 'Update Email Address', 'You have requested to change your email address. Please use the following OTP to verify your new email.'),
        });
      } catch (err) {
        console.error('Email send error in forgotPassword:', err);
        return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
      }
    } else {
      try {
        await sendMobileOtp({ phone: value, otp });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Mobile OTP could not be sent' });
      }
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to your new ${type}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and update email/phone
// @route   POST /api/v1/auth/verify-update-contact
// @access  Private
exports.verifyAndUpdateContact = async (req, res, next) => {
  try {
    const { type, value, otp } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({
      [type === 'email' ? 'email' : 'phone']: value,
      otp,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const user = await User.findById(req.user.id).populate('role');

    if (type === 'phone') {
      if (user.phone !== value) {
        if (user.phone_change_count >= 2) {
          return res.status(400).json({ success: false, message: 'You have reached the maximum limit of 2 phone number changes' });
        }
        user.phone_change_count += 1;
      }
      user.phone = value;
    } else {
      user.email = value;
      user.email_verified_at = new Date();
    }

    await user.save();
    await OTP.deleteMany({ [type === 'email' ? 'email' : 'phone']: value });

    res.status(200).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`,
      user: {
        ...user.toObject(),
        id: user._id,
        role: user.role.name.toLowerCase(),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { identifier, type } = req.body; // type is 'email' or 'phone'

    if (!identifier) {
      return res.status(400).json({ success: false, message: `Please provide an ${type}` });
    }

    const user = await User.findOne({ [type]: identifier, status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ success: false, message: `No user found with this ${type}` });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    await OTP.deleteMany({ [type]: identifier });
    await OTP.create({ [type]: identifier, otp, type: type === 'email' ? 'email' : 'mobile' });

    // Send OTP
    if (type === 'email') {
      try {
        await sendEmail({
          email: identifier,
          subject: 'Password Reset OTP',
          message: `Your OTP for resetting your password is ${otp}. It will expire in 5 minutes.`,
          html: getOtpEmailTemplate(otp, 'Password Reset Request', 'We received a request to reset your password. Please use the following OTP to securely reset your password.'),
        });
      } catch (err) {
        console.error('Email send error in forgotPassword:', err);
        return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
      }
    } else {
      try {
        await sendMobileOtp({ phone: identifier, otp });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Mobile OTP could not be sent' });
      }
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to your ${type}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword, type } = req.body;

    if (!identifier || !otp || !newPassword || !type) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      [type]: identifier,
      otp,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ [type]: identifier, status: { $ne: 'deleted' } }).sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ [type]: identifier });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FCM Token
// @route   POST /api/v1/auth/fcm-token
// @access  Private
exports.updateFcmToken = async (req, res, next) => {
  try {
    const { fcm_token } = req.body;

    if (!fcm_token) {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fcm_token = fcm_token;
    await user.save();

    res.status(200).json({ success: true, message: 'FCM token updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove FCM Token
// @route   DELETE /api/v1/auth/fcm-token
// @access  Private
exports.removeFcmToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fcm_token = null;
    await user.save();

    res.status(200).json({ success: true, message: 'FCM token removed successfully' });
  } catch (error) {
    next(error);
  }
};
