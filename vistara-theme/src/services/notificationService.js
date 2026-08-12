import api from './api';

const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    getAllNotifications: async () => {
        const response = await api.get('/notifications/all-list');
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.put(`/notifications/${id}`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('/notifications/mark-all-read');
        return response.data;
    },

    deleteNotification: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    }
};

export default notificationService;
