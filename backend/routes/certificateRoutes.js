const express = require('express');
const router = express.Router();
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

router.route('/')
  .get(getCertificates)
  .post(upload.single('file'), handleUploadError, createCertificate);

router.route('/:id')
  .put(updateCertificate)
  .delete(deleteCertificate);

module.exports = router;
