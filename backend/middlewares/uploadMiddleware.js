const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Memory storage to process files before saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // ─── Images (all common formats) ───────────────────────────────────
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/heif',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    // ─── Documents ─────────────────────────────────────────────────────
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Pass a typed error so the error handler can send a clean JSON response
    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    err.message = `File type "${file.mimetype}" is not supported. Allowed: images (JPG, PNG, WebP, GIF, SVG, BMP, TIFF, AVIF, HEIC), PDF, DOCX, CSV.`;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB — covers high-res images
  },
});

// ─── Multer error handler middleware ───────────────────────────────────────────
// Must be used AFTER the upload middleware in routes.
// Converts multer errors (size limit, bad file type) into clean JSON 400 responses
// instead of crashing the process and causing a 502 Bad Gateway.
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum allowed size is 15MB.';
    }
    return res.status(400).json({ success: false, message });
  }
  // Non-multer error — pass to global error handler
  next(err);
};

module.exports = { upload, handleUploadError };

