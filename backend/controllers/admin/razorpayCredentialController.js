const asyncHandler = require('../../middlewares/async');
const RazorpayCredential = require('../../models/RazorpayCredential');

// @desc    Get Razorpay Credential
// @route   GET /api/v1/razorpay-credentials
// @access  Private/Admin
exports.getRazorpayCredential = asyncHandler(async (req, res) => {
  let credential = await RazorpayCredential.findOne();
  
  if (!credential) {
    credential = await RazorpayCredential.create({
      keyId: '',
      keySecret: '',
      isActive: true
    });
  }

  res.status(200).json({
    success: true,
    data: credential,
  });
});

// @desc    Update Razorpay Credential
// @route   PUT /api/v1/razorpay-credentials
// @access  Private/Admin
exports.updateRazorpayCredential = asyncHandler(async (req, res) => {
  let credential = await RazorpayCredential.findOne();

  if (!credential) {
    res.status(404);
    throw new Error('Razorpay credentials not found');
  }

  const updatableFields = ['keyId', 'keySecret', 'isActive'];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      credential[field] = req.body[field];
    }
  });

  await credential.save();

  console.log('[RazorpayCredentialController] Credentials updated.');

  res.status(200).json({
    success: true,
    data: credential,
  });
});
