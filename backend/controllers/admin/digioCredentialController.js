const asyncHandler = require('../../middlewares/async');
const DigioCredential = require('../../models/DigioCredential');

// @desc    Get Digio Credential
// @route   GET /api/v1/digio-credentials
// @access  Private/Admin
exports.getDigioCredential = asyncHandler(async (req, res) => {
  let credential = await DigioCredential.findOne();

  if (!credential) {
    // Should not happen because of seeder, but just in case
    credential = await DigioCredential.create({
      client_id: 'default',
      client_secret: 'default',
      api_base_url: 'https://api.digio.in',
      workflow_name: 'AadharPanVerify',
      isActive: false
    });
  }

  res.status(200).json({
    success: true,
    data: credential,
  });
});

// @desc    Update Digio Credential
// @route   PUT /api/v1/digio-credentials
// @access  Private/Admin
exports.updateDigioCredential = asyncHandler(async (req, res) => {
  let credential = await DigioCredential.findOne();

  if (!credential) {
    res.status(404);
    throw new Error('Digio credentials not found');
  }

  credential.client_id = credential.client_id;
  credential.client_secret = credential.client_secret;
  credential.api_base_url = credential.api_base_url;
  credential.workflow_name = credential.workflow_name;

  if (req.body.isActive !== undefined) {
    credential.isActive = req.body.isActive;
  }

  await credential.save();

  res.status(200).json({
    success: true,
    data: credential,
  });
});
