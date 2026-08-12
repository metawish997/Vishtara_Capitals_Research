const express = require('express');
const router = express.Router();
const {
  getAngelCredential,
  updateAngelCredential
} = require('../controllers/admin/angelCredentialController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('view_settings'), getAngelCredential)
  .put(protect, checkPermission('manage_settings'), updateAngelCredential);

module.exports = router;
