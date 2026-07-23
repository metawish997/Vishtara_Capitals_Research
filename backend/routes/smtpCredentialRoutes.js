const express = require('express');
const router = express.Router();
const {
  getSmtpCredential,
  updateSmtpCredential
} = require('../controllers/admin/smtpCredentialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('view_settings'), getSmtpCredential)
  .put(protect, checkPermission('manage_settings'), updateSmtpCredential);

module.exports = router;
