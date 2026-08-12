const MasterNotification = require('../models/notification/MasterNotification');
const MasterNotificationRead = require('../models/notification/MasterNotificationRead');

// --- Master Notification Controllers ---
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    
    // Find IDs of notifications read or deleted by this user
    const readRecords = await MasterNotificationRead.find({ user: userId }).select('notification deleted_at');
    const readIds = readRecords.filter(rn => !rn.deleted_at).map(rn => rn.notification);
    const deletedIds = readRecords.filter(rn => rn.deleted_at).map(rn => rn.notification);

    const notifications = await MasterNotification.find({
      _id: { $nin: [...readIds, ...deletedIds] },
      $or: [
        { is_global: true },
        { user: userId }
      ]
    }).sort('-createdAt');
    
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) { next(error); }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) return res.status(200).json({ success: true, count: 0 });

    const readRecords = await MasterNotificationRead.find({ user: userId }).select('notification deleted_at');
    const readIds = readRecords.filter(rn => !rn.deleted_at).map(rn => rn.notification);
    const deletedIds = readRecords.filter(rn => rn.deleted_at).map(rn => rn.notification);

    const count = await MasterNotification.countDocuments({
      _id: { $nin: [...readIds, ...deletedIds] },
      $or: [
        { is_global: true },
        { user: userId }
      ]
    });
    
    res.status(200).json({ success: true, count });
  } catch (error) { next(error); }
};

exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    // 1. Get read and deleted status for this user
    const readRecords = await MasterNotificationRead.find({ user: userId }).select('notification read_at deleted_at').lean();
    
    const readIds = new Set(readRecords.filter(r => r.read_at && !r.deleted_at).map(r => r.notification ? r.notification.toString() : ''));
    const deletedIds = new Set(readRecords.filter(r => r.deleted_at).map(r => r.notification ? r.notification.toString() : ''));

    // 2. Get all notifications first to ensure we have a base list (exclude deleted ones)
    let notifications = await MasterNotification.find({
      $or: [
        { is_global: true },
        { user: userId }
      ]
    }).sort('-createdAt').lean();

    notifications = notifications.filter(n => !deletedIds.has(n._id.toString()));

    // 3. Map status
    const data = notifications.map(notif => ({
      ...notif,
      isRead: readIds.has(notif._id.toString())
    }));
    
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { 
    console.error('NOTIF_ERROR:', error);
    next(error); 
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const notification = await MasterNotification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const readRecord = await MasterNotificationRead.findOneAndUpdate(
      { notification: req.params.id, user: req.user._id },
      { read_at: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: readRecord });
  } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Find unread notifications
    const readRecords = await MasterNotificationRead.find({ user: userId }).select('notification deleted_at');
    const readIds = readRecords.filter(rn => !rn.deleted_at).map(rn => rn.notification);
    const deletedIds = readRecords.filter(rn => rn.deleted_at).map(rn => rn.notification);

    const unreadNotifications = await MasterNotification.find({
      _id: { $nin: [...readIds, ...deletedIds] },
      $or: [
        { is_global: true },
        { user: userId }
      ]
    }).select('_id');

    if (unreadNotifications.length > 0) {
      const readData = unreadNotifications.map(n => ({
        notification: n._id,
        user: userId,
        read_at: Date.now()
      }));
      await MasterNotificationRead.insertMany(readData);
    }

    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const notificationId = req.params.id;

    const notification = await MasterNotification.findById(notificationId);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    // Soft delete per user
    await MasterNotificationRead.findOneAndUpdate(
      { notification: notificationId, user: userId },
      { deleted_at: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
