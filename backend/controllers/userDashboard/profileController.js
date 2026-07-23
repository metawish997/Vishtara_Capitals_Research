const User = require('../../models/User');
const DigioCredential = require('../../models/DigioCredential');
const UserSubscription = require('../../models/user/UserSubscription');
const Invoice = require('../../models/user/Invoice');
const UserAgreement = require('../../models/user/UserAgreement');
const KycVerification = require('../../models/user/KycVerification');
const { processMedia, deleteMedia } = require('../../utils/fileHandler');

// @desc    Get full profile of logged in user
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate smra_id if missing (fallback for old users)
    if (!user.smra_id) {
      const lastUser = await User.findOne({ smra_id: { $exists: true } }).sort({ smra_id: -1 });
      let smra_id = 'SMRA-0001';
      if (lastUser && lastUser.smra_id) {
        const lastId = parseInt(lastUser.smra_id.split('-')[1]);
        smra_id = `SMRA-${(lastId + 1).toString().padStart(4, '0')}`;
      }
      user.smra_id = smra_id;
      await user.save();
    }

    const credential = await DigioCredential.findOne({ isActive: true });
    const kyc_status = credential ? user.kyc_status : 'approved';

    // Fetch related records
    const subscriptions = await UserSubscription.find({ user: user._id }).populate('service_plan');
    const invoices = await Invoice.find({ user_id: user._id });
    const agreements = await UserAgreement.find({ user: user._id });
    const kyc = await KycVerification.findOne({ user: user._id }).sort({ createdAt: -1 });

    // Return the complete user object along with the related details
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        kyc_status,
        id: user._id,
        role: user.role.name.toLowerCase(),
        subscriptions,
        invoices,
        agreements,
        kyc
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile of logged in user
// @route   PUT /api/v1/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Process image if uploaded
    if (req.file) {
      const currentUser = await User.findById(req.user.id);

      // Delete old image if it exists
      if (currentUser && currentUser.image) {
        await deleteMedia(currentUser.image);
      }

      // Process and save new image
      const processedMedia = await processMedia(req.file, 'profile_images');
      updateData.image = processedMedia.url;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('role');

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        id: user._id,
        role: user.role.name.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};
