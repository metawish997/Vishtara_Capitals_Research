const Media = require('../models/Media');
const { processMedia } = require('../utils/fileHandler');
const path = require('path');
const fs = require('fs-extra');

// @desc    Upload single or multiple files
// @route   POST /api/v1/media/upload
// @access  Private (Admin/User)
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const files = req.files ? req.files : [req.file];
    const results = [];
    const customSubfolder = req.body.category || null;

    for (const file of files) {
      const processedData = await processMedia(file, customSubfolder);
      const media = await Media.create({
        ...processedData,
        uploadedBy: req.user ? req.user.id : null // req.user comes from auth middleware
      });
      results.push(media);
    }

    res.status(201).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get files by category
// @route   GET /api/v1/media/category/:category
// @access  Private
exports.getFilesByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const files = await Media.find({ fileCategory: category });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stream file (Securely)
// @route   GET /api/v1/media/stream/:id
// @access  Private
exports.streamFile = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Convert local URL back to absolute path
    const filePath = path.join(__dirname, '..', media.url);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on disk' });
    }

    res.setHeader('Content-Type', media.mimetype);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
};
