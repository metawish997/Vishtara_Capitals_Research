const express = require('express');
const router = express.Router();
const {
  getSmsCredential,
  updateSmsCredential
} = require('../controllers/admin/smsCredentialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('view_settings'), getSmsCredential)
  .put(protect, checkPermission('manage_settings'), updateSmsCredential);

module.exports = router;
