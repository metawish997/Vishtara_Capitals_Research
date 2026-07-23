const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadLeads,
  getHistory,
  getImportById,
  getUnassigned,
  getImportProgress
} = require('../controllers/leadImportController');

// @route   POST /api/lead-imports/upload
// @desc    Upload CSV/Excel and bulk-import leads
router.post('/upload', uploadMiddleware, uploadLeads);

// @route   GET /api/lead-imports/history
// @desc    Get paginated import history
router.get('/history', getHistory);

// @route   GET /api/lead-imports/history/:id
// @desc    Get single import batch record (for View Summary)
router.get('/history/:id', getImportById);

// @route   GET /api/lead-imports/unassigned-leads
// @desc    Get leads with ownerLead = null (with search/filter/pagination)
router.get('/unassigned-leads', getUnassigned);

// @route   GET /api/lead-imports/progress/:jobId
// @desc    Get upload progress
router.get('/progress/:jobId', getImportProgress);

module.exports = router;
