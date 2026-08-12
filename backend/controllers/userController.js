const User = require('../models/User');
const AccountDeletionHistory = require('../models/user/AccountDeletionHistory');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select('name email phone bsmr_id');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      dob: req.body.dob,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      address: req.body.address,
      father_name: req.body.father_name,
      gender: req.body.gender,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('role');

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        id: user._id,
        role: user.role.name.toLowerCase(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account (Soft Delete)
// @route   DELETE /api/v1/users/delete-account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const deletionCount = await AccountDeletionHistory.countDocuments({ phone: user.phone });

    if (deletionCount >= 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum account deletions reached for this phone number.' 
      });
    }

    // Create AccountDeletionHistory record
    await AccountDeletionHistory.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      ipAddress: req.ip || req.connection.remoteAddress,
      deviceInfo: req.headers['user-agent'],
      deleteReason: req.body.deleteReason || 'User requested deletion',
    });

    user.status = 'deleted';
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.fcm_token = null;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if lead phone/email is registered
// @route   POST /api/v1/users/check-registration
// @access  Private
exports.checkRegistration = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Please provide email or phone' });
    }

    const query = { status: 'active', isDeleted: { $ne: true } };
    const orConditions = [];
    if (email && email.trim()) {
      orConditions.push({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
    }
    if (phone && phone.toString().trim()) {
      const cleanPhone = phone.toString().replace(/\D/g, '');
      if (cleanPhone) {
        // Match phone numbers that end with the provided digits (to ignore country codes like +91)
        orConditions.push({ phone: { $regex: new RegExp(`${cleanPhone}$`) } });
      } else {
        orConditions.push({ phone: phone.toString().trim() });
      }
    }
    
    if (orConditions.length > 0) {
      query.$or = orConditions;
    } else {
      return res.status(200).json({ success: true, isRegistered: false });
    }

    const user = await User.findOne(query).select('name email phone kyc_status smra_id');

    if (!user) {
      return res.status(200).json({ success: true, isRegistered: false });
    }

    // Check for subscriptions
    const UserSubscription = require('../models/user/UserSubscription');
    const subscriptions = await UserSubscription.find({ 
      user: user._id, 
      status: { $in: ['active', 'pending'] } 
    }).populate('service_plan', 'name');

    let subType = 'None';
    if (subscriptions.length > 0) {
      const hasPaid = subscriptions.some(s => s.payment_gateway !== 'demo');
      subType = hasPaid ? 'Paid' : 'Demo';
    }

    const allSubs = await UserSubscription.find({ user: user._id }).lean();
    const hasUsedDemo = allSubs.some(s => s.payment_gateway === 'demo');
    const hasActiveSubscription = allSubs.some(s => ['active', 'pending'].includes(s.status) && new Date(s.end_date) >= new Date());

    const demoHistory = allSubs
        .filter(s => s.payment_gateway === 'demo')
        .map(s => ({
            id: s._id,
            start_date: s.start_date,
            end_date: s.end_date,
            status: s.status
        }))
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    res.status(200).json({
      success: true,
      isRegistered: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        smra_id: user.smra_id,
        kyc_status: user.kyc_status,
        subscription: subType,
        plans: subscriptions.map(s => s.service_plan?.name).filter(Boolean),
        hasUsedDemo,
        hasActiveSubscription,
        demoHistory
      }
    });
  } catch (error) {
    next(error);
  }
};
