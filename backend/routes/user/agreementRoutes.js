const express = require('express');
const router = express.Router();
const {
    storeDraftAgreement,
    checkAgreementStatus,
    findDraft,
    submitManualPayment,
    incrementTryCount,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getAccountServices
} = require('../../controllers/user/agreementController');
const { protect } = require('../../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/temp/' });

router.post('/draft', protect, storeDraftAgreement);
router.get('/status/:id', protect, checkAgreementStatus);
router.get('/draft/:planId/:durationId', protect, findDraft);
router.post('/manual-payment', protect, upload.single('screenshot'), submitManualPayment);
router.post('/increment-try/:id', protect, incrementTryCount);
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-razorpay-payment', protect, verifyRazorpayPayment);
router.get('/account-services', protect, getAccountServices);

module.exports = router;
