const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateProfile, deleteAccount, checkRegistration } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getUsers);
router.post('/check-registration', protect, checkRegistration);
router.get('/:id', getUser);
router.put('/profile', protect, updateProfile);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
