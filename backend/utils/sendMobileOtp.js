const axios = require('axios');

const sendMobileOtp = async (options) => {
  const { phone, otp } = options;

  // Load SMS config from DB first, fallback to .env
  let smsConfig = {};
  try {
    const SmsCredential = require('../models/SmsCredential');
    const credential = await SmsCredential.findOne({ isActive: true });
    if (credential && credential.user && credential.key) {
      smsConfig = {
        baseUrl: credential.baseUrl,
        user: credential.user,
        key: credential.key,
        sender: credential.sender,
        countryCode: credential.countryCode,
        entityId: credential.entityId,
        templateId: credential.templateId,
      };
      console.log('[sendMobileOtp] Using SMS credentials from DB');
    }
  } catch (e) {
    console.warn('[sendMobileOtp] Could not load SMS credentials from DB, using .env', e.message);
  }

  // Fallback to .env if DB config is missing
  const baseUrl = smsConfig.baseUrl || process.env.SMS_BASE_URL;
  const smsUser = smsConfig.user || process.env.SMS_USER;
  const smsKey = smsConfig.key || process.env.SMS_KEY;
  const smsSender = smsConfig.sender || process.env.SMS_SENDER;
  const countryCode = smsConfig.countryCode || process.env.SMS_COUNTRY_CODE;
  const entityId = smsConfig.entityId || process.env.SMS_ENTITY_ID;
  const templateId = smsConfig.templateId || process.env.SMS_TEMPLATE_ID;

  const message = `Your Vishtara Capital Research verification code is ${otp}. This OTP is valid for **10 minutes*. Do not share this code with anyone. If you did not request this, please ignore this message.`;

  const params = {
    user: smsUser,
    key: smsKey,
    mobile: `${countryCode}${phone}`,
    message: message,
    senderid: smsSender,
    accusage: 1,
    entityid: entityId,
    tempid: templateId,
  };

  try {
    const response = await axios.get(baseUrl, { params });
    console.log('[sendMobileOtp] SMS API Response:', response.data);
    return response.status === 200;
  } catch (error) {
    console.error('[sendMobileOtp] SMS API Error:', error.response?.data || error.message);
    throw new Error('Failed to send mobile OTP');
  }
};

module.exports = sendMobileOtp;

