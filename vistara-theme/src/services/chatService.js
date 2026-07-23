import api from './api';

const chatService = {
    getConversations: async () => {
        console.log('[CHAT_DEBUG] Fetching conversation directory...');
        const response = await api.get('/chat/conversations');
        console.log('[CHAT_DEBUG] Conversations received:', response.data.data?.length || 0);
        return response.data;
    },

    getMessages: async (userId) => {
        console.log(`[CHAT_DEBUG] Pulling history for user: ${userId}`);
        const response = await api.get(`/chat/messages/${userId}`);
        console.log(`[CHAT_DEBUG] Sync complete. Messages:`, response.data.data?.length || 0);
        return response.data;
    },

    getSupportAdmin: async () => {
        console.log('[CHAT_DEBUG] Handshaking with support terminal...');
        const response = await api.get('/chat/support-admin');
        console.log('[CHAT_DEBUG] Terminal link established:', response.data.data?.name);
        return response.data;
    },

    sendMessage: async (receiverId, message) => {
        console.log(`[CHAT_DEBUG] Transmitting signal to: ${receiverId}`);
        const response = await api.post('/chat/send', { receiverId, message });
        console.log('[CHAT_DEBUG] Transmission successful:', response.data.data?._id);
        return response.data;
    }
};

export default chatService;
