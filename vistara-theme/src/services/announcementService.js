import api from './api';

const announcementService = {
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },

    getSingleAnnouncement: async (id) => {
        const response = await api.get(`/announcements/${id}`);
        return response.data;
    },

    createAnnouncement: async (announcementData) => {
        const response = await api.post('/announcements', announcementData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateAnnouncement: async (id, announcementData) => {
        const response = await api.put(`/announcements/${id}`, announcementData);
        return response.data;
    },

    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    },
    
    markAsRead: async (id) => {
        const response = await api.post(`/announcements/${id}/read`);
        return response.data;
    }
};

export default announcementService;
