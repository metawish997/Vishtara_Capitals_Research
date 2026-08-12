const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead,
} = require('../controllers/announcementController');

const { protect, optionalProtect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(optionalProtect, getAnnouncements)
  .post(protect, upload.array('images', 5), handleUploadError, createAnnouncement);

router.post('/:id/read', protect, markAnnouncementAsRead);

router.route('/:id')
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

module.exports = router;
