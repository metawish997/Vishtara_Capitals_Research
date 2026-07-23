import api from './api';

const serviceService = {
    getServicePlans: async () => {
        const response = await api.get('/services');
        return response.data;
    },
    createServicePlan: async (data) => {
        const response = await api.post('/services', data);
        return response.data;
    },
    getServicePlanById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },
    updateServicePlan: async (id, data) => {
        const response = await api.put(`/services/${id}`, data);
        return response.data;
    },
    deleteServicePlan: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },
    
    // Plan Durations
    getPlanDurations: async (planId) => {
        const response = await api.get(`/services/${planId}/durations`);
        return response.data;
    },
    createPlanDuration: async (data) => {
        const response = await api.post('/services/durations', data);
        return response.data;
    },
    updatePlanDuration: async (id, data) => {
        const response = await api.put(`/services/durations/${id}`, data);
        return response.data;
    },
    deletePlanDuration: async (id) => {
        const response = await api.delete(`/services/durations/${id}`);
        return response.data;
    },

    // Plan Features
    getDurationFeatures: async (durationId) => {
        const response = await api.get(`/services/durations/${durationId}/features`);
        return response.data;
    },
    createPlanFeature: async (data) => {
        const response = await api.post('/services/features', data);
        return response.data;
    },
    updatePlanFeature: async (id, data) => {
        const response = await api.put(`/services/features/${id}`, data);
        return response.data;
    },
    deletePlanFeature: async (id) => {
        const response = await api.delete(`/services/features/${id}`);
        return response.data;
    }
};

export default serviceService;
