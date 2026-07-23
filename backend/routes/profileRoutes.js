const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userDashboard/profileController');
const { protect } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

router.use(protect); // All routes in this file are protected

router.route('/')
  .get(getProfile)
  .put(upload.single('profile_image'), handleUploadError, updateProfile);

router.post('/update', upload.single('profile_image'), handleUploadError, updateProfile);

module.exports = router;
