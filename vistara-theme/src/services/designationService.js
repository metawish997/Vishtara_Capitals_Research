import api from './api';

const designationService = {
    getDesignations: async () => {
        const response = await api.get('/designations');
        return response.data;
    },
    createDesignation: async (data) => {
        const response = await api.post('/designations', data);
        return response.data;
    },
    updateDesignation: async (id, data) => {
        const response = await api.put(`/designations/${id}`, data);
        return response.data;
    },
    deleteDesignation: async (id) => {
        const response = await api.delete(`/designations/${id}`);
        return response.data;
    },
    reorderDesignations: async (designationIds) => {
        const response = await api.patch('/designations/reorder', { designationIds });
        return response.data;
    }
};

export default designationService;
