const Certificate = require('../models/Certificate');
const Media = require('../models/Media');
const { processMedia } = require('../utils/fileHandler');

// @desc    Get all certificates
// @route   GET /api/v1/certificates
// @access  Private
exports.getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
        .populate('user', 'name email')
        .populate('media');

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new certificate
// @route   POST /api/v1/certificates
// @access  Private
exports.createCertificate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a certificate file (Image or PDF)' });
    }

    // Process file (Image/PDF)
    const processedData = await processMedia(req.file);
    const media = await Media.create({
      ...processedData,
      uploadedBy: req.body.user_id || null // Ideally req.user.id
    });

    // Create certificate
    const certificate = await Certificate.create({
      ...req.body,
      user: req.body.user_id, // For testing, usually req.user.id
      media: media._id
    });

    res.status(201).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/v1/certificates/:id
// @access  Private
exports.updateCertificate = async (req, res, next) => {
  try {
    let certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/v1/certificates/:id
// @access  Private
exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await certificate.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
