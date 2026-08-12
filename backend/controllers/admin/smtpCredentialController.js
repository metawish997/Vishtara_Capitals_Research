const asyncHandler = require('../../middlewares/async');
const SmtpCredential = require('../../models/SmtpCredential');

// @desc    Get SMTP Credential
// @route   GET /api/v1/smtp-credentials
// @access  Private/Admin
exports.getSmtpCredential = asyncHandler(async (req, res) => {
  let credential = await SmtpCredential.findOne();
  
  if (!credential) {
    credential = await SmtpCredential.create({
      host: 'smtp.hostinger.com',
      port: '465',
      encryption: 'ssl',
      user: 'support@therapidinvestors.com',
      pass: '',
      fromEmail: 'support@therapidinvestors.com',
      fromName: 'The Rapid Investors',
      isActive: true
    });
  }

  res.status(200).json({
    success: true,
    data: credential,
  });
});

// @desc    Update SMTP Credential
// @route   PUT /api/v1/smtp-credentials
// @access  Private/Admin
exports.updateSmtpCredential = asyncHandler(async (req, res) => {
  let credential = await SmtpCredential.findOne();

  if (!credential) {
    res.status(404);
    throw new Error('SMTP credentials not found');
  }

  const updatableFields = ['host', 'port', 'encryption', 'user', 'pass', 'fromEmail', 'fromName', 'isActive'];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      credential[field] = req.body[field];
    }
  });

  await credential.save();

  console.log('[SmtpCredentialController] Credentials updated.');

  res.status(200).json({
    success: true,
    data: credential,
  });
});
