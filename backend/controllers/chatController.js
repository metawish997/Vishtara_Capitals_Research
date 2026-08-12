const Message = require('../models/Message');
const User = require('../models/User');
const Role = require('../models/Role');
const MasterNotification = require('../models/notification/MasterNotification');
const MasterNotificationRead = require('../models/notification/MasterNotificationRead');

// @desc    Get list of unique conversations for admin
// @route   GET /api/v1/chat/conversations
// @access  Private/Admin
exports.getConversations = async (req, res) => {
    console.log(`[SERVER_CHAT] Fetching conversations for admin: ${req.user?._id}`);
    try {
        // 1. Get role IDs for customers
        const customerRoles = await Role.find({
            slug: { $in: ['customer', 'user'] }
        }).select('_id');
        const roleIds = customerRoles.map(r => r._id);

        // 2. Get all customers
        const customers = await User.find({
            role: { $in: roleIds }
        }).select('name smra_id _id createdAt').lean();
        console.log(`[SERVER_CHAT] Found ${customers.length} customers with roles: ${roleIds}`);

        // 3. Get all messages involving admin
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }).sort({ createdAt: -1 }).lean();
        console.log(`[SERVER_CHAT] Found ${messages.length} messages`);

        // 4. Map messages to customers
        const conversationMap = new Map();
        for (const msg of messages) {
            const otherUserId = msg.sender.toString() === req.user._id.toString()
                ? msg.receiver.toString()
                : msg.sender.toString();

            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, {
                    lastMessage: msg.message,
                    time: msg.createdAt,
                    unread: !msg.isRead && msg.receiver.toString() === req.user._id.toString()
                });
            }
        }

        // 5. Build final list
        const conversationList = customers.map(customer => {
            const history = conversationMap.get(customer._id.toString());
            return {
                userId: customer._id,
                name: customer.name,
                smra_id: customer.smra_id,
                lastMessage: history?.lastMessage || 'No conversation yet',
                time: history?.time || customer.createdAt,
                unread: history?.unread || false
            };
        });

        conversationList.sort((a, b) => new Date(b.time) - new Date(a.time));
        res.status(200).json({ success: true, data: conversationList });
    } catch (error) {
        console.error('[SERVER_CHAT_ERR] getConversations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get chat history with a specific user
// @route   GET /api/v1/chat/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
    console.log(`[SERVER_CHAT] History request: ${req.user._id} <-> ${req.params.userId}`);
    try {
        const otherUserId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            { sender: otherUserId, receiver: req.user._id, isRead: false },
            { isRead: true }
        );

        // Mark chat notifications as read
        const notifications = await MasterNotification.find({
            user: req.user._id,
            type: 'chat'
        });

        // Filter notifications where sender matches otherUserId (comparing strings to be safe)
        const relevantNotifications = notifications.filter(n =>
            n.data && n.data.senderId && n.data.senderId.toString() === otherUserId.toString()
        );

        if (relevantNotifications.length > 0) {
            await Promise.all(relevantNotifications.map(n =>
                MasterNotificationRead.findOneAndUpdate(
                    { notification: n._id, user: req.user._id },
                    { read_at: Date.now() },
                    { upsert: true }
                )
            ));
        }

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error('[SERVER_CHAT_ERR] getMessages:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/v1/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
    console.log(`[SERVER_CHAT] Sending signal from ${req.user._id} to ${req.body.receiverId}`);
    try {
        const { receiverId, message } = req.body;

        if (!receiverId || !message) {
            return res.status(400).json({ success: false, message: 'Please provide receiver and message' });
        }

        const newMessage = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            message
        });

        // Create Master Notification for the receiver
        await MasterNotification.create({
            type: 'chat',
            severity: 'info',
            title: `New Message from ${req.user.name}`,
            message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            user: receiverId,
            is_global: false,
            data: {
                chatId: newMessage._id,
                senderId: req.user._id,
                senderName: req.user.name
            }
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error('[SERVER_CHAT_ERR] sendMessage:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSupportAdmin = async (req, res) => {
    console.log('[SERVER_CHAT] Handshake: Support admin lookup');
    try {
        const adminRoles = await Role.find({
            slug: { $in: ['admin', 'super-admin', 'super_admin'] }
        }).select('_id');
        const adminRoleIds = adminRoles.map(r => r._id);

        const admin = await User.findOne({
            role: { $in: adminRoleIds }
        }).select('_id name');

        if (!admin) {
            console.warn('[SERVER_CHAT] No admin found with role IDs:', adminRoleIds);
            return res.status(404).json({ success: false, message: 'No support admin found' });
        }

        console.log(`[SERVER_CHAT] Found admin: ${admin.name} (${admin._id})`);
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        console.error('[SERVER_CHAT_ERR] getSupportAdmin:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
