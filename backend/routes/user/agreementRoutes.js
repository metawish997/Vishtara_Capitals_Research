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
    getAccountServices,
    completeUserAgreementEsign,
    checkUserAgreementEsignStatus
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

// Post-payment e-sign completion (Condition 2 catch-up flow)
router.post('/complete-esign/:agreementId', protect, completeUserAgreementEsign);
router.get('/user-agreement-status/:agreementId', protect, checkUserAgreementEsignStatus);
router.get('/verify-strict/:agreementId', protect, require('../../controllers/user/agreementController').verifyDigioDocumentStrict);

module.exports = router;
