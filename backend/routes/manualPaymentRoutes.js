const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllManualPayments, updatePaymentStatus } = require('../controllers/manualPaymentController');

// All routes are for Admin only
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/', getAllManualPayments);
router.put('/:id/status', updatePaymentStatus);

module.exports = router;
