const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, getSupportAdmin } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/support-admin', protect, getSupportAdmin);
router.get('/messages/:userId', protect, getMessages);
router.post('/send', protect, sendMessage);

module.exports = router;
