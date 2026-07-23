const express = require('express');
const router = express.Router();
const {
  getDigioCredential,
  updateDigioCredential
} = require('../controllers/admin/digioCredentialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('view_settings'), getDigioCredential)
  .put(protect, checkPermission('manage_settings'), updateDigioCredential);

module.exports = router;
