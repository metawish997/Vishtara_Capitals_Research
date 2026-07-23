import api from './api';

const marqueeService = {
    getMarquees: async () => {
        const response = await api.get('/marquees');
        return response.data;
    },
    createMarquee: async (data) => {
        const response = await api.post('/marquees', data);
        return response.data;
    },
    updateMarquee: async (id, data) => {
        const response = await api.put(`/marquees/${id}`, data);
        return response.data;
    },
    deleteMarquee: async (id) => {
        const response = await api.delete(`/marquees/${id}`);
        return response.data;
    }
};

export default marqueeService;
