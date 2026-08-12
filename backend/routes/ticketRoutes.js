const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const {
  getTickets,
  getUserTickets,
  createTicket,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');

router.route('/')
  .get(protect, authorize('admin', 'super admin', 'super_admin'), getTickets)
  .post(protect, upload.single('attachment'), handleUploadError, createTicket);

router.get('/my-tickets', protect, getUserTickets);

router.route('/:id')
  .put(protect, authorize('admin', 'super admin', 'super_admin'), updateTicket)
  .delete(protect, authorize('admin', 'super admin', 'super_admin'), deleteTicket);

module.exports = router;
