const express = require('express');
const router = express.Router();
const {
  getTipCategories,
  createTipCategory,
  updateTipCategory,
  deleteTipCategory,
  getTips,
  createTip,
  updateTip,
  deleteTip,
  getAccuracyDashboard,
  getTipById,
  addAdminNote
} = require('../../controllers/tips/tipController');

const { protect } = require('../../middlewares/authMiddleware');

// Category Routes
router.route('/categories')
  .get(getTipCategories)
  .post(protect, createTipCategory);

router.route('/categories/:id')
  .put(protect, updateTipCategory)
  .delete(protect, deleteTipCategory);

router.get('/accuracy-dashboard', protect, getAccuracyDashboard);

router.route('/')
  .get(protect, getTips)
  .post(protect, createTip);

router.route('/:id')
  .get(protect, getTipById)
  .put(protect, updateTip)
  .delete(protect, deleteTip);

router.post('/:id/notes', protect, addAdminNote);
router.post('/:id/update-live-status', protect, require('../../controllers/tips/tipController').updateLiveStatus);
router.post('/:id/manual-close', protect, require('../../controllers/tips/tipController').manualClose);
router.post('/:id/follow-up', protect, require('../../controllers/tips/tipController').storeFollowUp);

module.exports = router;
