const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  getAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/mark-all-read', markAllAsRead);

router.get('/unread-count', getUnreadCount);

router.get('/all-list', getAllNotifications);

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.route('/:id')
  .put(markAsRead)
  .delete(deleteNotification);

module.exports = router;
