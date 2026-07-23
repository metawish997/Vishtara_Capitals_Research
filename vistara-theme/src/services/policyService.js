import api from './api';

const policyService = {
    getPolicies: () => api.get('/policies/masters'),
    getPolicyById: (id) => api.get(`/policies/masters/${id}`),
    createPolicy: (data) => api.post('/policies/masters', data),
    updatePolicy: (id, data) => api.put(`/policies/masters/${id}`, data),
    deletePolicy: (id) => api.delete(`/policies/masters/${id}`),
    getPublicPolicy: (slug) => api.get(`/policies/content/${slug}`)
};

export default policyService;
