const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { register, login, getMe, sendOtp, sendUpdateOtp, verifyAndUpdateContact, forgotPassword, resetPassword, updateFcmToken, removeFcmToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/send-otp', sendOtp);
router.post('/send-update-otp', protect, sendUpdateOtp);
router.post('/verify-update-contact', protect, verifyAndUpdateContact);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// FCM Token routes
router.post('/fcm-token', protect, updateFcmToken);
router.delete('/fcm-token', protect, removeFcmToken);

module.exports = router;
