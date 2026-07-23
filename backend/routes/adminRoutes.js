const express = require('express');
const router = express.Router();
const { getDeletedUsers } = require('../controllers/admin/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/deleted-users', protect, authorize('admin', 'super_admin', 'superadmin'), getDeletedUsers);

module.exports = router;
