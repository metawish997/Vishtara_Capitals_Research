const express = require('express');
const router = express.Router();
const {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  reorderDesignations,
} = require('../controllers/designationController');
const { protect } = require('../middlewares/authMiddleware');

router.patch('/reorder', protect, reorderDesignations);

router.route('/')
  .get(getDesignations)
  .post(protect, createDesignation);

router.route('/:id')
  .put(protect, updateDesignation)
  .delete(protect, deleteDesignation);

module.exports = router;
