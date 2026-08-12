const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  changeStatus,
  changeOwner,
  changeReadStatus,
  getComments,
  addComment,
  getActivity,
  getLeadMetadata,
  getLeadDashboard,
  bulkAssignOwner
} = require('../controllers/leadController');
const { assignOwner } = require('../controllers/leadImportController');
const { protect } = require('../middlewares/authMiddleware');

// Secure all routes
router.use(protect);

// Metadata endpoints
router.get('/meta/dropdowns', getLeadMetadata);
router.get('/meta/dashboard', getLeadDashboard);

// Standard CRUD endpoints
router.route('/')
  .get(getLeads)
  .post(createLead);

router.patch('/bulk/assign', bulkAssignOwner);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

// Action patches
router.patch('/:id/status', changeStatus);
router.patch('/:id/owner', changeOwner);
router.patch('/:id/read-status', changeReadStatus);

// Comments endpoints
router.route('/:id/comments')
  .get(getComments)
  .post(addComment);

// Activity logs
router.get('/:id/activity', getActivity);

// Assign owner (from Lead Pull Uploads - unassigned leads)
router.patch('/:id/assign-owner', assignOwner);

module.exports = router;
