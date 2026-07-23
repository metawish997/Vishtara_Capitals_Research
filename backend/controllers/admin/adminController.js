const User = require('../../models/User');
const AccountDeletionHistory = require('../../models/user/AccountDeletionHistory');

// @desc    Get deleted users
// @route   GET /api/v1/admin/deleted-users
// @access  Private/Admin
exports.getDeletedUsers = async (req, res, next) => {
  try {
    const deletedUsers = await User.find({ isDeleted: true }).lean();
    
    // Add deletionCountForPhone for each user
    const usersWithCount = await Promise.all(deletedUsers.map(async (user) => {
      const count = await AccountDeletionHistory.countDocuments({ phone: user.phone });
      return {
        ...user,
        deletionCountForPhone: count
      };
    }));

    res.status(200).json({
      success: true,
      count: usersWithCount.length,
      data: usersWithCount
    });
  } catch (error) {
    next(error);
  }
};
