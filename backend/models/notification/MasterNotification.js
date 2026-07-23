const mongoose = require('mongoose');

const MasterNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    index: true,
  },
  severity: {
    type: String,
    enum: ['info', 'success', 'warning', 'danger'],
    default: 'info',
  },
  title: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true,
  },
  is_global: {
    type: Boolean,
    default: false,
    index: true,
  },
  channel: {
    type: String,
    default: 'database',
  },
  expires_at: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MasterNotificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const axios = require('axios');

MasterNotificationSchema.post('save', async function (doc) {
  try {
    const User = mongoose.model('User');
    let tokens = [];
    
    if (doc.is_global) {
      const users = await User.find({ fcm_token: { $ne: null }, status: 'active' }).select('fcm_token');
      tokens = users.map(u => u.fcm_token).filter(t => t && t.startsWith('ExponentPushToken'));
    } else if (doc.user) {
      const user = await User.findById(doc.user).select('fcm_token');
      if (user && user.fcm_token && user.fcm_token.startsWith('ExponentPushToken')) {
        tokens.push(user.fcm_token);
      }
    }

    if (tokens.length > 0) {
      const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: doc.title || 'New Notification',
        body: doc.message,
        data: doc.data || { screen: 'allNotifications' },
      }));

      await axios.post('https://exp.host/--/api/v2/push/send', messages, {
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        }
      });
      console.log(`[PUSH NOTIFICATION] Sent ${messages.length} remote push notifications`);
    }

    if (global.io) {
      global.io.emit('notification_refresh');
    }
  } catch (err) {
    console.error('[PUSH NOTIFICATION ERROR]', err.message);
  }
});

MasterNotificationSchema.post('insertMany', async function (docs) {
  try {
    const User = mongoose.model('User');
    let messages = [];
    
    // Collect all user IDs from the docs that are targeted
    const userIds = docs.filter(doc => doc.user && !doc.is_global).map(doc => doc.user);
    
    if (userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds }, fcm_token: { $ne: null }, status: 'active' }).select('_id fcm_token');
      
      const userMap = {};
      users.forEach(u => {
        if (u.fcm_token && u.fcm_token.startsWith('ExponentPushToken')) {
          userMap[u._id.toString()] = u.fcm_token;
        }
      });

      docs.forEach(doc => {
        if (doc.user && userMap[doc.user.toString()]) {
          messages.push({
            to: userMap[doc.user.toString()],
            sound: 'default',
            title: doc.title || 'New Notification',
            body: doc.message,
            data: doc.data || { screen: 'allNotifications' },
          });
        }
      });
    }

    // Process global docs if any (fallback)
    const globalDocs = docs.filter(doc => doc.is_global);
    if (globalDocs.length > 0) {
      const users = await User.find({ fcm_token: { $ne: null }, status: 'active' }).select('fcm_token');
      const tokens = users.map(u => u.fcm_token).filter(t => t && t.startsWith('ExponentPushToken'));
      
      globalDocs.forEach(doc => {
        tokens.forEach(token => {
          messages.push({
            to: token,
            sound: 'default',
            title: doc.title || 'New Notification',
            body: doc.message,
            data: doc.data || { screen: 'allNotifications' },
          });
        });
      });
    }

    if (messages.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < messages.length; i += chunkSize) {
        const chunk = messages.slice(i, i + chunkSize);
        await axios.post('https://exp.host/--/api/v2/push/send', chunk, {
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          }
        });
      }
      console.log(`[PUSH NOTIFICATION] Sent ${messages.length} remote push notifications via insertMany`);
    }

    if (global.io) {
      global.io.emit('notification_refresh');
    }
  } catch (err) {
    console.error('[PUSH NOTIFICATION ERROR IN insertMany]', err.message);
  }
});

module.exports = mongoose.model('MasterNotification', MasterNotificationSchema);
