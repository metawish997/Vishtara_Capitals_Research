const Announcement = require('../models/Announcement');
const Media = require('../models/Media');
const { processMedia } = require('../utils/fileHandler');

// @desc    Get all announcements
// @route   GET /api/v1/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
  try {
    let query = { is_active: true };

    // If user is authenticated, only show announcements published after they registered
    if (req.user) {
      query.published_at = { $gte: req.user.createdAt };
    }

    const announcements = await Announcement.find(query)
      .populate('attachments')
      .sort('-published_at');

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

const MasterNotification = require('../models/notification/MasterNotification');

// @desc    Create new announcement
// @route   POST /api/v1/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const attachmentIds = [];

    // Process uploaded images if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const processedData = await processMedia(file);
        const media = await Media.create({
          ...processedData,
          uploadedBy: req.user ? req.user.id : null
        });
        attachmentIds.push(media._id);
      }
    }

    // Create announcement with attachments
    const announcement = await Announcement.create({
      ...req.body,
      attachments: attachmentIds
    });

    // Create a global notification for this announcement
    await MasterNotification.create({
      type: 'announcement',
      severity: 'info',
      title: announcement.title,
      message: announcement.content,
      is_global: true,
      data: { announcementId: String(announcement._id) }
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/v1/announcements/:id
// @access  Private (Admin)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/v1/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const MasterNotificationRead = require('../models/notification/MasterNotificationRead');

// @desc    Mark announcement notification as read
// @route   POST /api/v1/announcements/:id/read
// @access  Private
exports.markAnnouncementAsRead = async (req, res, next) => {
  try {
    const announcementId = String(req.params.id);
    const userId = req.user.id;

    // Find the global notification associated with this announcement
    // We search in the 'data' field which is Mixed, so we use the string ID
    const notification = await MasterNotification.findOne({
      type: 'announcement',
      'data.announcementId': announcementId
    });

    if (notification) {
      // Mark as read in MasterNotificationRead
      await MasterNotificationRead.findOneAndUpdate(
        { notification: notification._id, user: userId },
        { read_at: Date.now() },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Marked as read'
    });
  } catch (error) {
    next(error);
  }
};
