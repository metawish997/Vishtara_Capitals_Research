const express = require('express');
const router = express.Router();
const {
  getRazorpayCredential,
  updateRazorpayCredential
} = require('../controllers/admin/razorpayCredentialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('view_settings'), getRazorpayCredential)
  .put(protect, checkPermission('manage_settings'), updateRazorpayCredential);

module.exports = router;
