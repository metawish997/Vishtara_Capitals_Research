const asyncHandler = require('../../middlewares/async');
const AngelCredential = require('../../models/AngelCredential');
const TokenManager = require('../../services/angel/TokenManager');

// @desc    Get Angel Credential
// @route   GET /api/v1/angel-credentials
// @access  Private/Admin
exports.getAngelCredential = asyncHandler(async (req, res) => {
  let credential = await AngelCredential.findOne();
  
  if (!credential) {
    credential = await AngelCredential.create({
      apiKey: process.env.ANGEL_API_KEY || 'default_api_key',
      clientCode: process.env.ANGEL_CLIENT_CODE || 'default_client_code',
      password: process.env.ANGEL_PASSWORD || 'default_password',
      totpSecret: process.env.ANGEL_TOTP_SECRET || 'default_totp_secret',
      baseUrl: process.env.ANGEL_BASE_URL || 'https://apiconnect.angelbroking.com',
      marketBaseUrl: process.env.ANGEL_MARKET_BASE_URL || 'https://apiconnect.angelone.in',
      isActive: true
    });
  }

  res.status(200).json({
    success: true,
    data: credential,
  });
});

// @desc    Update Angel Credential
// @route   PUT /api/v1/angel-credentials
// @access  Private/Admin
exports.updateAngelCredential = asyncHandler(async (req, res) => {
  let credential = await AngelCredential.findOne();

  if (!credential) {
    res.status(404);
    throw new Error('Angel credentials not found');
  }

  credential.apiKey = req.body.apiKey !== undefined ? req.body.apiKey : credential.apiKey;
  credential.clientCode = req.body.clientCode !== undefined ? req.body.clientCode : credential.clientCode;
  credential.password = req.body.password !== undefined ? req.body.password : credential.password;
  credential.totpSecret = req.body.totpSecret !== undefined ? req.body.totpSecret : credential.totpSecret;
  credential.baseUrl = req.body.baseUrl !== undefined ? req.body.baseUrl : credential.baseUrl;
  credential.marketBaseUrl = req.body.marketBaseUrl !== undefined ? req.body.marketBaseUrl : credential.marketBaseUrl;
  
  if (req.body.isActive !== undefined) {
    credential.isActive = req.body.isActive;
  }

  await credential.save();

  // Clear existing tokens to force re-login on the next request using the new credentials
  TokenManager.delete('jwt');
  TokenManager.delete('feed');
  
  console.log('[AngelCredentialController] Credentials updated. Cached tokens cleared.');

  res.status(200).json({
    success: true,
    data: credential,
  });
});
