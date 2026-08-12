const express = require('express');
const router = express.Router();
const { uploadFile, getFilesByCategory, streamFile } = require('../controllers/mediaController');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

// Using .array() for multiple files support
router.post('/upload', upload.array('files', 10), handleUploadError, uploadFile);
router.get('/category/:category', getFilesByCategory);
router.get('/stream/:id', streamFile);

module.exports = router;
