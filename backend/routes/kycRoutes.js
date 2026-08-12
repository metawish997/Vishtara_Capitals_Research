const express = require('express');
const {
  initiateKyc,
  digioCallback,
  checkKycStatus,
  getKycFullDetails
} = require('../controllers/user/kycController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');

// Private routes
router.post('/initiate', protect, initiateKyc);
router.get('/status', protect, checkKycStatus);
router.get('/full-details', protect, getKycFullDetails);

// Public route for Digio Callback (though redirect usually happens to frontend)
router.get('/callback', digioCallback);

module.exports = router;
