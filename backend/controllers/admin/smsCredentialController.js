const asyncHandler = require('../../middlewares/async');
const SmsCredential = require('../../models/SmsCredential');

// @desc    Get SMS Credential
// @route   GET /api/v1/sms-credentials
// @access  Private/Admin
exports.getSmsCredential = asyncHandler(async (req, res) => {
  let credential = await SmsCredential.findOne();
  
  if (!credential) {
    credential = await SmsCredential.create({
      baseUrl: 'http://sms.smsariseworld.com/submitsms.jsp',
      user: 'THEREPID',
      key: '',
      sender: 'TRDINV',
      entityId: '1701175144798287756',
      templateId: '1707177219938893175',
      countryCode: '91',
      isActive: true
    });
  }

  res.status(200).json({
    success: true,
    data: credential,
  });
});

// @desc    Update SMS Credential
// @route   PUT /api/v1/sms-credentials
// @access  Private/Admin
exports.updateSmsCredential = asyncHandler(async (req, res) => {
  let credential = await SmsCredential.findOne();

  if (!credential) {
    res.status(404);
    throw new Error('SMS credentials not found');
  }

  const updatableFields = ['baseUrl', 'user', 'key', 'sender', 'entityId', 'templateId', 'countryCode', 'isActive'];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      credential[field] = req.body[field];
    }
  });

  await credential.save();

  console.log('[SmsCredentialController] Credentials updated.');

  res.status(200).json({
    success: true,
    data: credential,
  });
});
